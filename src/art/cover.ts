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
const MAX_SHELLS = 16;

/** Deepest cover any setting can produce, for the culling sphere. */
const MAX_RISE = 0.4;

/** Blade cell, in metres. Small enough that one blade is a pixel or two. */
const CELL = 0.055;

/** Clump cell. Coarse, and what stops a field reading as a lawn. */
const CLUMP = 0.8;

/** How far the top of the stack leans downwind, as a fraction of its height. */
const LEAN = 0.7;

/** Per-face cover type, as an index into `COVER_TYPES`. */
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
});

COVER_MATERIAL.onBeforeCompile = (shader) => {
  Object.assign(shader.uniforms, windUniforms, coverUniforms);

  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      /* glsl */ `#include <common>
      attribute float ${COVER_ATTRIBUTE};
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
      // Three varying vectors, packed rather than five named ones. A Lambert
      // program with shadows is already most of the way to the guaranteed
      // minimum, and this is the one thing here that is a hardware limit rather
      // than a budget.
      varying vec4 vCoverBlade;  // density, base radius, tip radius, height up
      varying vec4 vCoverPlace;  // world XZ, and the wind shear to take it by
      varying vec3 vCoverTint;
      `,
    )
    .replace(
      '#include <begin_vertex>',
      /* glsl */ `#include <begin_vertex>
      {
        // One dynamic index, in the vertex shader, which is the one place GLSL
        // ES 1 allows it — hence the varyings rather than a fragment lookup.
        // All three corners of a face carry the same index, so what arrives on
        // the other side is constant across the face and the edges stay hard.
        int coverIndex = int(${COVER_ATTRIBUTE} + 0.5);
        vec4 spec = coverSpec[coverIndex];
        vCoverTint = coverTint[coverIndex];

        float up = (${SHELL_ATTRIBUTE} + 1.0) / max(coverShells, 1.0);
        vCoverBlade = vec4(spec.yzw, up);

        // World +Y. Divided by the model's own Y scale so the rise is metres
        // whatever the mesh is scaled to.
        float rise = up * coverHeight * spec.x;
        transformed.y += rise / max(length(modelMatrix[1].xyz), 0.0001);
        vec3 worldAt = (modelMatrix * vec4(transformed, 1.0)).xyz;

        // The same travelling gust the trees answer, and by construction the
        // same one driving the rustle in the audio. See art/sway.ts.
        float lag = dot(worldAt.xz, windDir) * windLagScale;
        float u = clamp(0.5 - lag / (2.0 * windHalfSpan), 0.0, 1.0);
        float strength = texture2D(gustField, vec2(u, 0.5)).r * swayAmount;
        // A ripple rather than one field breathing in unison. The gust already
        // travels; this is the small motion inside it.
        float ripple = 0.66 + 0.34 * sin(swayTime * 1.6 + worldAt.x * 0.7 + worldAt.z * 0.53);
        // Shearing the hash sample downwind by height is the whole wind effect:
        // the higher the cross-section, the further over it is taken.
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

      float coverHash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      `,
    )
    .replace(
      '#include <clipping_planes_fragment>',
      /* glsl */ `#include <clipping_planes_fragment>
      {
        float up = vCoverBlade.w;
        vec2 blown = (vCoverPlace.xy - vCoverPlace.zw) / ${CELL.toFixed(4)};
        vec2 cell = floor(blown);

        // Clumps are sampled undisplaced, so they stay where they are while the
        // blades in them lean. Type comes from the face; height, thickness and
        // tint come from here, and bare clumps are where mixed cover comes from.
        vec2 clump = floor(vCoverPlace.xy / ${CLUMP.toFixed(2)});
        float clumpTall = coverHash(clump);
        float clumpThick = coverHash(clump + 17.0);

        float density = vCoverBlade.x * coverDensity * (0.5 + clumpThick);
        if (coverHash(cell + 5.0) > density) discard;

        float strand = (0.55 + 0.45 * coverHash(cell + 11.0)) * (0.6 + 0.8 * clumpTall);
        if (up > strand) discard;

        // The cross-section: a disc that narrows with height. Both radii come
        // from the type table, so a blade, a leaf and a fuzz are one shader.
        vec2 centre = 0.5 + (vec2(coverHash(cell + 3.0), coverHash(cell + 23.0)) - 0.5) * 0.32;
        if (length(blown - cell - centre) > mix(vCoverBlade.y, vCoverBlade.z, up)) discard;
      }
      `,
    )
    .replace(
      '#include <color_fragment>',
      /* glsl */ `#include <color_fragment>
      // The type's own colour, keeping a quarter of the ground it grows out of
      // so painted patches and the terrain's height cooling read through it,
      // and darkened toward the roots — which is what makes a stack of flat
      // cross-sections read as having depth.
      diffuseColor.rgb = mix(vCoverTint, diffuseColor.rgb, 0.25) * (0.56 + 0.44 * vCoverBlade.w);
      `,
    );
};

// Missing means bare. A shader attribute the geometry does not supply falls
// back to a *generic* value that persists across draw calls, so leaving this
// out would make cover depend on whatever was drawn before it.
(COVER_MATERIAL as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
  [COVER_ATTRIBUTE]: [0],
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
    // One constant face colour's worth of attribute, for a mesh the terrain did
    // not build. Four bytes a vertex on a slab, against a branch in the shader.
    const index = COVER_ORDER.indexOf(uniform as CoverName);
    const count = source.getAttribute('position').count;
    geometry.setAttribute(
      COVER_ATTRIBUTE,
      new THREE.BufferAttribute(new Float32Array(count).fill(index), 1),
    );
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
  mesh.visible = shellCount > 0;

  live.add(mesh);
  geometry.addEventListener('dispose', () => live.delete(mesh));
  return mesh;
}
