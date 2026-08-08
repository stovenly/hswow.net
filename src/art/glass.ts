import * as THREE from 'three';
import { GLASS_LAYER } from '../layers';
import { NOISE_GLSL } from '../engine/noise';
import { SKY_GLSL, skyUniforms } from '../engine/Sky';
import { REFLECT_GLSL } from '../engine/reflect';

/**
 * The transmissive family: crystal, glass, bubble. SHADERS-AND-MATERIALS.md
 * Track B / M3.
 *
 * The fourth shared material, beside `ART_MATERIAL`, `GLOW_MATERIAL` and
 * `WATER_MATERIAL` — and water paid nearly every design cost this needs, because
 * water *is* a transmissive material with a wave generator attached. What
 * transfers verbatim: drawn in the effect chain with the opaque pass's colour
 * and depth bound as textures, its own exclusive layer, the hand depth test, and
 * pass gating from what the zone actually built. `engine/Glass.ts` is the pass.
 *
 * Per-prop variation is per-vertex — `aGlass` and `aTint` — so several glass
 * props in one zone could merge into a single draw the way the art kit's parts
 * do, with no per-prop material and nothing to keep in step.
 */

/** ior, dispersion, thickness in metres, density. */
export const GLASS_ATTRIBUTE = 'aGlass';
/** Body colour, and thin-film strength in w. */
export const TINT_ATTRIBUTE = 'aTint';

export interface Glass {
  /**
   * Refractive index. 1 bends nothing; 1.5 is window glass, 1.77 sapphire,
   * 2.4 diamond. What decides how far the image behind jumps at a facet edge.
   */
  ior: number;
  /**
   * How far apart the three channels are refracted, 0..0.2. The rainbow fringe
   * that separates crystal from glass — zero on a plain pane.
   */
  dispersion?: number;
  /** Beer–Lambert absorption per metre. Zero is water-clear whatever the tint. */
  density?: number;
  /** What it absorbs toward. sRGB hex. */
  tint?: number;
  /** Thin-film iridescence over the fresnel, 0..1. A bubble is all of it. */
  film?: number;
}

/** Named glasses. Names are placeholders. */
export const GLASSES = {
  crystal: { ior: 1.78, dispersion: 0.055, density: 1.1, tint: 0x8fb6d8 },
  amethyst: { ior: 1.74, dispersion: 0.045, density: 2.6, tint: 0x7c4ea8 },
  glass: { ior: 1.52, dispersion: 0, density: 0.35, tint: 0xbfd6cf },
  bubble: { ior: 1.06, dispersion: 0.02, density: 0.02, tint: 0xffffff, film: 1 },
} as const satisfies Record<string, Glass>;

export type GlassName = keyof typeof GLASSES;

export const glassUniforms = {
  /** Whether the screen-space march runs. The sky fallback alone is respectable. */
  uGlassReflections: { value: 1 },
  /** Global scale on refraction offset. A look knob, not a per-prop one. */
  uGlassRefraction: { value: 1 },
  /** 1 where the zone has a sky, 0 indoors. */
  uGlassSky: { value: 1 },
};

export const GLASS_MATERIAL = new THREE.ShaderMaterial({
  name: 'Glass',
  uniforms: {
    // The scene so far, and the depth it was drawn with. Bound by `GlassEffect`.
    tScene: { value: null },
    tDepth: { value: null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uProjectionView: { value: new THREE.Matrix4() },
    uInverseProjectionView: { value: new THREE.Matrix4() },
    uFar: { value: 500 },

    ...glassUniforms,
    ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
    // Shared by reference, never cloned: a second sky would part company with
    // the real one the first time either was tuned. Same argument as water's.
    ...skyUniforms,
  },
  fog: true,
  // For its *sorting* effect only — the blending is off, because this shader
  // composites what is behind it itself. The transparent list is simply the one
  // that gets sorted back to front, so two crystals in line resolve
  // nearest-wins, which is the answer the missing depth test would have given.
  transparent: true,
  blending: THREE.NoBlending,
  depthTest: false,
  depthWrite: false,
  // A closed solid seen from outside. Back faces would draw a second surface
  // over the first with no depth test to order them.
  side: THREE.FrontSide,

  vertexShader: /* glsl */ `
    attribute vec4 aGlass;
    attribute vec4 aTint;

    varying vec3 vWorld;
    varying vec3 vNormal;
    varying vec4 vGlass;
    varying vec4 vTint;

    void main() {
      vec4 world = modelMatrix * vec4(position, 1.0);
      vWorld = world.xyz;
      // The upper-left 3x3 by hand: mat3(mat4) is a GLSL ES 3.00 constructor
      // and this shader is 1.00 like the rest of the kit.
      vNormal = normalize(
        modelMatrix[0].xyz * normal.x + modelMatrix[1].xyz * normal.y
          + modelMatrix[2].xyz * normal.z);
      vGlass = aGlass;
      vTint = aTint;
      gl_Position = projectionMatrix * viewMatrix * world;
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D tScene;
    uniform sampler2D tDepth;
    uniform vec2 uResolution;
    uniform mat4 uProjectionView;
    uniform mat4 uInverseProjectionView;
    uniform float uFar;
    uniform float uGlassReflections;
    uniform float uGlassRefraction;
    uniform float uGlassSky;

    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;

    varying vec3 vWorld;
    varying vec3 vNormal;
    varying vec4 vGlass;
    varying vec4 vTint;

    // The sky's clouds are fbm, and SKY_GLSL leaves the noise to its caller so
    // a shader that already has it does not declare it twice.
    ${NOISE_GLSL}
    ${SKY_GLSL}

    /**
     * How far along the camera ray the scene stops, at a screen position.
     *
     * By unprojection rather than by converting axis depth to ray depth: the
     * result is a length between two world points and is therefore a distance
     * along the ray by construction. Sky comes back as the far plane.
     */
    float sceneDistance(vec2 uv) {
      float d = texture2D(tDepth, uv).r;
      if (d >= 0.9999) return uFar;
      vec4 p = uInverseProjectionView * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
      return length(p.xyz / p.w - cameraPosition);
    }

    ${REFLECT_GLSL}

    /** Where a ray leaving this point ends up on screen. */
    vec2 exitUV(vec3 direction, float distance, vec2 fallback) {
      vec4 clip = uProjectionView * vec4(vWorld + direction * distance, 1.0);
      if (clip.w <= 0.0) return fallback;
      vec2 uv = clip.xy / clip.w * 0.5 + 0.5;
      // Off the edge of the frame there is nothing recorded to refract, so the
      // honest answer is the unbent pixel rather than a smear of the border.
      vec2 edge = min(uv, 1.0 - uv);
      return mix(fallback, uv, smoothstep(0.0, 0.02, min(edge.x, edge.y)));
    }

    /**
     * Thin film, as a hue walk — the Track A term, in this shader's own frame.
     *
     * A bubble's colour is its wall thickness, and a real bubble's wall is not
     * even: it drains downward, so the bands run round it and crowd toward the
     * bottom. Height carries most of that, and the view angle does the rest.
     */
    vec3 filmTint(float dotNV, vec3 world) {
      float thickness = 0.7 + 0.5 * sin(world.y * 9.0 + world.x * 3.0);
      float phase = (1.0 - dotNV) * 2.6 * thickness;
      return max(vec3(0.0), 0.72 + cos(6.2831853 * (phase + vec3(0.0, 0.33, 0.67))));
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;

      vec3 toEye = cameraPosition - vWorld;
      float surfaceDistance = length(toEye);
      vec3 view = toEye / surfaceDistance;
      vec3 normal = normalize(vNormal);
      if (!gl_FrontFacing) normal = -normal;

      // **The depth test, done by hand.** Everything opaque was drawn before
      // this pass and its distance is in tDepth; anything nearer than this
      // surface is in front of it. A centimetre of slack keeps a crystal
      // resting on a plinth from flickering along the contact line.
      if (sceneDistance(uv) < surfaceDistance - 0.02) discard;

      float ior = max(vGlass.x, 1.0);
      float dispersion = vGlass.y;
      float span = vGlass.z;
      float density = vGlass.w;

      float dotNV = clamp(dot(normal, view), 0.0, 1.0);

      // **How much material the eye is looking through**, in metres, from the
      // shape rather than from the depth buffer. The buffer knows where the
      // *wall behind* is, which is the length of the air gap and not of the
      // crystal — a gem held up against a distant sky would read as infinitely
      // deep and one against a wall as paper thin. The chord through a convex
      // solid is what is wanted, and for a body d deep it is d·cos(θ) where
      // cos θ is dot(N, V): thickest looking into the middle, vanishing at the
      // silhouette. The span is baked per face along that face's own normal, so a
      // windowpane is three centimetres deep rather than as deep as it is wide.
      //
      // Flat facets make this jump facet to facet, which is not an artefact —
      // it is what a cut gem does, each face showing its own depth of colour.
      float path = span * dotNV;

      // --- refraction ---------------------------------------------------------
      // The ray bent at the surface, walked its path length, and projected back
      // to screen. Per facet, so the image behind *jumps* at every facet
      // boundary, which is the single feature that sells "crystal".
      vec3 through = refract(-view, normal, 1.0 / ior);
      float reach = path * uGlassRefraction;
      vec3 seen;
      if (dispersion > 0.0001) {
        // Three reads at slightly different indices. Two extra samples, on
        // crystal pixels only, for the rainbow fringe.
        vec3 red = refract(-view, normal, 1.0 / (ior * (1.0 - dispersion)));
        vec3 blue = refract(-view, normal, 1.0 / (ior * (1.0 + dispersion)));
        seen = vec3(
          texture2D(tScene, exitUV(red, reach, uv)).r,
          texture2D(tScene, exitUV(through, reach, uv)).g,
          texture2D(tScene, exitUV(blue, reach, uv)).b
        );
      } else {
        seen = texture2D(tScene, exitUV(through, reach, uv)).rgb;
      }

      // Beer–Lambert on the path just measured: thin edges pale, thick cores
      // deep. A rate rather than a threshold, exactly as the water column and
      // the fog volumes are.
      float absorbed = 1.0 - exp(-path * density);
      seen = mix(seen, seen * vTint.rgb, absorbed);

      // --- reflection ---------------------------------------------------------
      vec3 bounce = reflect(-view, normal);
      vec3 reflection = uGlassSky > 0.5 ? skyColour(bounce) : vec3(0.0);
      float hit = 0.0;
      if (uGlassReflections > 0.5) {
        float found;
        float travelled;
        vec3 marched = marchReflection(
          vWorld,
          normalize(bounce),
          reflectJitter(floor(gl_FragCoord.xy)),
          found,
          travelled
        );
        reflection = mix(reflection, marched, found);
        hit = found;
      }

      // Schlick from the index itself rather than a chosen constant: the same
      // number decides how far the image bends and how bright the rim is, so
      // the two cannot disagree.
      float f0 = pow((ior - 1.0) / (ior + 1.0), 2.0);
      float fresnel = clamp(f0 + (1.0 - f0) * pow(1.0 - dotNV, 5.0), 0.0, 1.0);

      // A bubble is fresnel and film and almost nothing else — the wall is far
      // too thin to absorb anything, so what you see is the rim.
      if (vTint.w > 0.0) {
        reflection *= mix(vec3(1.0), filmTint(dotNV, vWorld), vTint.w);
      }

      vec3 colour = mix(seen, reflection, fresnel);

      // --- fog ----------------------------------------------------------------
      // **Only the part of this pixel that is ours gets fogged.** What came out
      // of tScene — the refracted image, and anything the march found — was
      // fogged for its own distance when it was drawn; hazing the composite
      // again would fog it twice. What is genuinely this shader's is the
      // absorption and an unmarched sky reflection.
      float own = mix(absorbed, 1.0 - hit, fresnel);
      float haze = smoothstep(fogNear, fogFar, surfaceDistance) * own;

      gl_FragColor = vec4(mix(colour, fogColor, haze), 1.0);
    }
  `,
});

// A geometry without these would read whatever the last draw left in the slot —
// the lesson every patch in this kit records. An index of 1 bends nothing.
(GLASS_MATERIAL as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
  [GLASS_ATTRIBUTE]: [1, 0, 0, 0],
  [TINT_ATTRIBUTE]: [1, 1, 1, 0],
};

/**
 * Turns a geometry into a transmissive prop.
 *
 * **The geometry decides whether it facets**, and nothing else does: this reads
 * the interpolated vertex normal, so un-indexed geometry with face normals
 * gives hard facets and a smooth sphere gives a bubble. That is the same
 * distinction `flatShading` draws on the art material, made by construction
 * rather than by a flag that could disagree with the mesh.
 *
 * The thickness the shader absorbs over is measured here, per face and along
 * its own normal, so a big crystal is deeper than a small one of the same
 * recipe and a windowpane is as thin as it looks, with nothing to author.
 */
export function glassMesh(
  geometry: THREE.BufferGeometry,
  kind: GlassName | Glass,
  name = 'glass',
): THREE.Mesh {
  const g: Glass = typeof kind === 'string' ? GLASSES[kind] : kind;
  const source = geometry.index === null ? geometry : geometry.toNonIndexed();
  if (source !== geometry) geometry.dispose();
  source.deleteAttribute('uv');
  if (!source.getAttribute('normal')) source.computeVertexNormals();

  source.computeBoundingBox();
  source.computeBoundingSphere();
  const size = new THREE.Vector3();
  source.boundingBox?.getSize(size);
  const widest = (source.boundingSphere?.radius ?? 0.5) * 2;

  const count = source.getAttribute('position').count;
  const normals = source.getAttribute('normal');
  const glass = new Float32Array(count * 4);
  const tint = new Float32Array(count * 4);
  const colour = new THREE.Color(g.tint ?? 0xffffff);
  for (let i = 0; i < count; i++) {
    // How much glass is behind this face, measured along its own normal. The
    // box's width in that direction, capped by the bounding sphere so a
    // diagonal normal cannot claim the box's long corner-to-corner reach.
    const across = Math.min(
      widest,
      Math.abs(normals.getX(i)) * size.x
        + Math.abs(normals.getY(i)) * size.y
        + Math.abs(normals.getZ(i)) * size.z,
    );

    glass[i * 4] = g.ior;
    glass[i * 4 + 1] = g.dispersion ?? 0;
    glass[i * 4 + 2] = across;
    glass[i * 4 + 3] = g.density ?? 0;
    tint[i * 4] = colour.r;
    tint[i * 4 + 1] = colour.g;
    tint[i * 4 + 2] = colour.b;
    tint[i * 4 + 3] = g.film ?? 0;
  }
  source.setAttribute(GLASS_ATTRIBUTE, new THREE.BufferAttribute(glass, 4));
  source.setAttribute(TINT_ATTRIBUTE, new THREE.BufferAttribute(tint, 4));

  const mesh = new THREE.Mesh(source, GLASS_MATERIAL);
  mesh.name = name;
  // Off layer 0 entirely: out of the opaque pass, the normal pass and the
  // shadow map in one line. The fresnel rim is the outline. See `layers.ts`.
  mesh.layers.set(GLASS_LAYER);
  // You do not walk into a crystal on a plinth; callers mark whole subtrees
  // solid, and the hull is decoration standing on something that is not.
  mesh.userData.noCollide = true;
  // How the zone finds out it has glass in it without being told twice — the
  // pass is skipped entirely in a zone with none. See `Zone.hasGlass`.
  mesh.userData.glass = true;
  return mesh;
}
