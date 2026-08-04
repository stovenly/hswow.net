import * as THREE from 'three';
import { COVER_TYPES, COVER_ORDER, type CoverName } from '../world/ground';
import { windUniforms } from './sway';

/**
 * Groundcover: shells of cross-section stacked over any ground mesh.
 *
 * One `InstancedBufferGeometry` sharing the ground's own attribute buffers,
 * with one instance per shell. Each shell is the ground lifted along +Y; the
 * fragment shader hashes world XZ into cells and throws away anything whose
 * strand does not reach that height. A stack of cross-sections reads as blades.
 * See GROUNDCOVER.md for why shells rather than geometry, and for the three
 * things this project needs that no tutorial mentions:
 *
 * - **Along +Y, never along the normal.** The ground is flat-shaded with one
 *   normal per face, so normal-offset shells tear apart at every face boundary.
 * - **Hash world XZ, not UVs.** `assemble` deletes UVs, and terrain face
 *   density varies — a UV hash would change blade size wherever the mesh does.
 * - **Out of the normal pass.** A shell's normal *is* the ground's, so drawing
 *   it there would be paying twice for the same answer. See `PostFX`.
 *
 * No `customDepthMaterial` and no shadows: cover is scattered small things, and
 * `art/clutter.ts` is the standing rule that those do not cast.
 */

/** How many shells the geometry is built for. The slider never asks for more. */
const MAX_SHELLS = 24;

/** Deepest cover any setting can produce, for the culling sphere. */
const MAX_RISE = 0.4;

/** Blade cell, in metres. Fine, so a blade can be both narrow and dense. */
const CELL = 0.014;

/** Clump cell. Coarse, and what stops a field reading as a lawn. */
const CLUMP = 0.8;

/** Mean of `(0.55 + 0.45u)(0.6 + 0.8v)`, which the far field converges on. */
const MEAN_STRAND = 0.775;

/**
 * The brightness the root ramp averages to, and the far field's own.
 *
 * Mean height in view is `base / 3(base - tip)`, about 0.41 — not the 0.775 the
 * stack reaches, because tall shells are thin. Matching it is what keeps the
 * near-to-far join from reading as a ring on the ground.
 */
const FAR_SHADE = 0.74;

/** How dark the roots are, and how much of that the tips recover. */
const ROOT = 0.56;
const RAMP = 0.44;

/** How far under a screen pixel a cell may go before the pattern gives up. */
const RESOLVE = 1.5;

/** How far the top of the stack leans downwind, as a fraction of its height. */
const LEAN = 0.7;

/** `vec2`: the `COVER_TYPES` index per face, and how far inside it per corner. */
export const COVER_ATTRIBUTE = 'cover';

/** Per-instance shell number, 0 at the ground. */
const SHELL_ATTRIBUTE = 'shell';

const COUNT = COVER_ORDER.length;

/** `vec4(height, density, base, tip)` per type, flat. Filled once, never edited. */
const spec = new Float32Array(COUNT * 4);
/** And the tints, in the renderer's working colour space. */
const tint = new Float32Array(COUNT * 3);

{
  const colour = new THREE.Color();
  COVER_ORDER.forEach((name, i) => {
    const type = COVER_TYPES[name];
    spec.set([type.height, type.density, type.base, type.tip], i * 4);
    colour.set(type.tint).toArray(tint, i * 3);
  });
}

export const coverUniforms = {
  coverSpec: { value: spec },
  coverTint: { value: tint },
  /** Live shell count. The geometry's `instanceCount` is kept equal to it. */
  coverShells: { value: 8 },
  /** Metres the stack spans, before a type's own multiplier. */
  coverHeight: { value: 0.126 },
  /** Global multiplier on each type's density. */
  coverDensity: { value: 1 },
};

/**
 * The one shared shell material.
 *
 * Lambert with vertex colours, exactly like `ART_MATERIAL` — so a shell is lit
 * by the same maths as the ground under it and inherits its per-face colour,
 * which is where the terrain's jitter and height cooling come from for free.
 */
export const COVER_MATERIAL = new THREE.MeshLambertMaterial({
  name: 'Cover',
  vertexColors: true,
  flatShading: true,
  // **Depth-tested but not depth-written**, which is the bias GROUNDCOVER.md
  // asks for. `PixelStage` shares one depth texture between the outline and
  // GTAO, and cover writing 12 cm of relief into it made both read the grass
  // as a field of silhouettes — a dark ring on the ground at the range where
  // non-linear depth resolves that step. Written, the buffer stays the ground.
  //
  // Costs the shells their sorting against each other, which is why they draw
  // after everything else and bottom to top: within one draw the last write
  // wins, and the last shell is the top one.
  depthWrite: false,
});

COVER_MATERIAL.onBeforeCompile = (shader) => {
  Object.assign(shader.uniforms, windUniforms, coverUniforms);

  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      /* glsl */ `#include <common>
      attribute vec2 ${COVER_ATTRIBUTE};
      attribute float ${SHELL_ATTRIBUTE};
      uniform vec4 coverSpec[${COUNT}];
      uniform vec3 coverTint[${COUNT}];
      uniform float coverShells;
      uniform float coverHeight;
      uniform sampler2D gustField;
      uniform vec2 windDir;
      uniform float windLagScale;
      uniform float windHalfSpan;
      uniform float swayTime;
      uniform float swayAmount;
      // Packed: varyings are a hardware limit and Lambert with shadows has
      // already spent most of the guaranteed minimum.
      varying vec4 vCoverBlade;  // density, base radius, tip radius, height up
      varying vec4 vCoverPlace;  // world XZ, and the wind shear to take it by
      varying vec3 vCoverTint;
      varying vec2 vCoverEdge;   // world Y, and how far inside its own cover
      `,
    )
    .replace(
      '#include <begin_vertex>',
      /* glsl */ `#include <begin_vertex>
      {
        // Dynamic indexing of a uniform array is legal in the vertex shader and
        // nowhere else in GLSL ES 1, which is why these arrive as varyings. The
        // index is per face, so it interpolates to itself and edges stay hard;
        // the feather beside it is per corner, and does not.
        int coverIndex = int(${COVER_ATTRIBUTE}.x + 0.5);
        vec4 spec = coverSpec[coverIndex];
        vCoverTint = coverTint[coverIndex];

        float up = (${SHELL_ATTRIBUTE} + 1.0) / max(coverShells, 1.0);
        vCoverBlade = vec4(spec.yzw, up);

        // World +Y, over the model's own Y scale so the rise is metres whatever
        // the mesh is scaled to.
        float rise = up * coverHeight * spec.x;
        transformed.y += rise / max(length(modelMatrix[1].xyz), 0.0001);
        vec3 worldAt = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vCoverEdge = vec2(worldAt.y, ${COVER_ATTRIBUTE}.y);

        // The same travelling gust the trees answer, and by construction the
        // same one driving the rustle in the audio. See art/sway.ts.
        float lag = dot(worldAt.xz, windDir) * windLagScale;
        float u = clamp(0.5 - lag / (2.0 * windHalfSpan), 0.0, 1.0);
        float strength = texture2D(gustField, vec2(u, 0.5)).r * swayAmount;
        float ripple = 0.66 + 0.34 * sin(swayTime * 1.6 + worldAt.x * 0.7 + worldAt.z * 0.53);
        // Shearing the hash sample downwind by height is the whole wind effect.
        vCoverPlace = vec4(worldAt.xz, windDir * (strength * ripple * rise * ${LEAN.toFixed(2)}));
      }
      `,
    );

  shader.fragmentShader = shader.fragmentShader
    .replace(
      '#include <common>',
      /* glsl */ `#include <common>
      uniform float coverDensity;
      varying vec4 vCoverBlade;
      varying vec4 vCoverPlace;
      varying vec3 vCoverTint;
      varying vec2 vCoverEdge;

      // Set where the discards are decided and read where the colour is, which
      // are two separate injections into three's program.
      float coverFade;

      // Not a sine hash: sin(dot(p, big)) loses its fractional bits at cell
      // indices this large and quantises into visible bands. This folds to
      // 0..1 before it multiplies.
      float coverHash(vec2 p) {
        vec3 q = fract(vec3(p.x, p.y, p.x) * 0.1031);
        q += dot(q, q.yzx + 33.33);
        return fract((q.x + q.y) * q.z);
      }
      `,
    )
    .replace(
      '#include <clipping_planes_fragment>',
      /* glsl */ `#include <clipping_planes_fragment>
      {
        // Nothing grows here. Out before the fade below, which converges on
        // "covered" and would otherwise grow a slab on bare rock at distance.
        if (vCoverBlade.x <= 0.0) discard;

        float up = vCoverBlade.w;
        vec2 place = vCoverPlace.xy - vCoverPlace.zw;

        // Clumps are sampled undisplaced, so they stay where they are while the
        // blades in them lean. Type comes from the face; height, thickness and
        // tint come from here, and bare clumps are where mixed cover comes from.
        vec2 clump = floor(vCoverPlace.xy / ${CLUMP.toFixed(2)});
        float clumpTall = coverHash(clump);
        float clumpThick = coverHash(clump + 17.0);

        // The blade lattice turns with the clump. One grid running the same way
        // across a field is a regular pattern, and a regular pattern is what
        // beats against the pixel grid.
        float spin = coverHash(clump + 41.0) * 6.2831;
        vec2 axis = vec2(cos(spin), sin(spin));
        vec2 turned = vec2(dot(place, axis), dot(place, vec2(-axis.y, axis.x)));

        // How much of one cell a screen pixel can still see. A procedural
        // discard has no mipmap chain, so below a pixel the pattern is
        // interference rather than grass — see world/floor.ts for the same
        // failure in grid lines. Y is in the derivative because on a slope seen
        // face-on the XZ footprint barely moves and would claim it is resolved.
        float texel = max(max(fwidth(place.x), fwidth(place.y)), fwidth(vCoverEdge.x));
        float resolve = clamp(${(CELL * RESOLVE).toFixed(4)} / max(texel, 1e-6), 0.0, 1.0);

        vec2 blown = turned / ${CELL.toFixed(4)};
        vec2 cell = floor(blown);
        // Folded, so the hash never sees a coordinate too large to resolve.
        vec2 key = mod(cell, 1024.0);

        // Thinned toward the edge of its own patch, so grass runs out onto a
        // path instead of stopping on a line. A stipple rather than a gradient:
        // this pipeline quantizes a colour ramp into a band of dither.
        float feather = vCoverEdge.y;
        float density = vCoverBlade.x * coverDensity * (0.5 + clumpThick) * feather;
        if (coverHash(key + 5.0) > mix(1.0, density, resolve)) discard;

        // Far off, every test converges on the average of what it would have
        // decided — a solid stack at the mean height, which is the mipmap this
        // cannot have. Grass dissolving into a carpet, with no edge to see.
        float strand = (0.55 + 0.45 * coverHash(key + 11.0)) * (0.6 + 0.8 * clumpTall);
        strand *= mix(0.5, 1.0, feather);
        if (up > mix(${MEAN_STRAND.toFixed(3)}, strand, resolve)) discard;

        // A disc that narrows with height. Both radii come from the type table,
        // so a blade, a leaf and a fuzz are one shader.
        vec2 centre = 0.5 + (vec2(coverHash(key + 3.0), coverHash(key + 23.0)) - 0.5) * 0.24;
        float radius = mix(2.0, mix(vCoverBlade.y, vCoverBlade.z, up), resolve);
        if (length(blown - cell - centre) > radius) discard;

        coverFade = resolve;
      }
      `,
    )
    .replace(
      '#include <color_fragment>',
      /* glsl */ `#include <color_fragment>
      {
        // The type's own colour, keeping a quarter of the ground it grows out
        // of so painted patches and the height cooling read through it.
        vec3 blade = mix(vCoverTint, diffuseColor.rgb, 0.25);
        // Far off a pixel is a patch of ground rather than one blade, so it is
        // that patch's average: shaded blade over the fraction the cover holds,
        // and bare ground under the rest. The ramp applies to the blade only —
        // shading the ground half too is what put a dark ring on the grass.
        float held = clamp(
          vCoverBlade.x * 3.1416 * vCoverBlade.y * vCoverBlade.y * vCoverEdge.y, 0.0, 1.0);
        vec3 far = mix(diffuseColor.rgb, blade * ${FAR_SHADE.toFixed(2)}, held);
        vec3 near = blade * (${ROOT.toFixed(2)} + ${RAMP.toFixed(2)} * vCoverBlade.w);
        diffuseColor.rgb = mix(far, near, coverFade);
      }
      `,
    );
};

// Missing means bare, and fully feathered. A shader attribute the geometry does
// not supply falls back to a generic value that persists across draw calls, so
// without this cover would depend on whatever was drawn before it.
(COVER_MATERIAL as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
  [COVER_ATTRIBUTE]: [0, 1],
  [SHELL_ATTRIBUTE]: [0],
};

// Three caches compiled programs by a key that knows nothing about an
// `onBeforeCompile`, and this is a Lambert material like several others.
COVER_MATERIAL.customProgramCacheKey = () => 'cover';

/**
 * Every cover mesh currently standing, so the shell count can reach them.
 *
 * `instanceCount` is per geometry and the count is a uniform, and the two have
 * to agree or the top of the stack is drawn at the wrong height. Pruned on
 * geometry disposal, which is what `Zone.dispose` does to a released zone.
 */
const live = new Set<THREE.Mesh>();

/**
 * The live shell count, which the uniform cannot hold on its own: it divides,
 * so it is floored at one, and zero has to stay tellable from one.
 */
let shellCount = 8;

/**
 * Sets what the cover is drawn at. Free at runtime: a count and two uniforms.
 *
 * Zero shells means the draw is skipped outright rather than made invisible —
 * the slider's bottom end has to cost nothing, or it is not an option.
 */
export function setCoverDraw(shells: number, height: number, density: number): void {
  shellCount = Math.max(0, Math.min(Math.round(shells), MAX_SHELLS));
  coverUniforms.coverShells.value = Math.max(shellCount, 1);
  coverUniforms.coverHeight.value = height;
  coverUniforms.coverDensity.value = density;

  for (const mesh of live) {
    mesh.visible = shellCount > 0;
    (mesh.geometry as THREE.InstancedBufferGeometry).instanceCount = shellCount;
  }
}

/**
 * Cover for a ground mesh, or null if it grows nothing.
 *
 * Given any mesh: terrain, a flat floor, an ad-hoc slab in a debug zone. The
 * geometry is *shared*, not copied — the instanced wrapper carries the ground's
 * own attribute buffers plus sixteen floats of shell index, so a field of grass
 * costs one draw call and no memory.
 *
 * A mesh with no `cover` attribute grows nothing unless it says otherwise, via
 * `userData.cover` or `type` here. That is what keeps gallery floors bare.
 */
export function coverFor(ground: THREE.Mesh, type?: CoverName): THREE.Mesh | null {
  const source = ground.geometry;
  const painted = source.getAttribute(COVER_ATTRIBUTE);
  const uniform = type ?? (ground.userData.cover as CoverName | undefined);
  if (!painted && (!uniform || uniform === 'none')) return null;

  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = source.index;
  for (const [name, attribute] of Object.entries(source.attributes)) {
    geometry.setAttribute(name, attribute);
  }
  geometry.groups = source.groups;

  if (!painted) {
    // A constant, for a mesh the terrain did not build: one type everywhere and
    // no feathering, since there is no boundary to feather against.
    const index = COVER_ORDER.indexOf(uniform as CoverName);
    const count = source.getAttribute('position').count;
    const constant = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      constant[i * 2] = index;
      constant[i * 2 + 1] = 1;
    }
    geometry.setAttribute(COVER_ATTRIBUTE, new THREE.BufferAttribute(constant, 2));
  }

  const shells = new Float32Array(MAX_SHELLS);
  for (let i = 0; i < MAX_SHELLS; i++) shells[i] = i;
  geometry.setAttribute(SHELL_ATTRIBUTE, new THREE.InstancedBufferAttribute(shells, 1));
  geometry.instanceCount = shellCount;

  // The ground's sphere, opened by the deepest cover any setting can ask for.
  // Culled on the ground's own extent, a hillside would drop its grass a frame
  // before it dropped itself.
  source.computeBoundingSphere();
  if (source.boundingSphere) {
    geometry.boundingSphere = source.boundingSphere.clone();
    geometry.boundingSphere.radius += MAX_RISE;
  }

  const mesh = new THREE.Mesh(geometry, COVER_MATERIAL);
  mesh.name = 'cover';
  // A child of the ground, so it inherits the transform and cannot drift off
  // it. Added after the zone manager has decided shadows, and never marked
  // collidable — cover is something you walk through.
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  // After the ground, which it does not write depth against. See the material.
  mesh.renderOrder = 1;
  mesh.visible = shellCount > 0;

  live.add(mesh);
  geometry.addEventListener('dispose', () => live.delete(mesh));
  return mesh;
}
