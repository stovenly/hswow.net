import * as THREE from 'three';
import { SKY_GRADIENT_GLSL, skyUniforms } from './Sky';

/**
 * Aerial perspective: haze that is the sky's own colour, thins with altitude, and
 * is measured from the camera rather than from the plane in front of it.
 *
 * Three's own fog measures to the camera plane, fades everything to one flat
 * colour, and has no altitude. The first makes the fog thin wherever you are not
 * looking; the second puts distant land at odds with the gradient behind it along
 * the horizon, which is the one line the vista band cannot afford a seam on; the
 * third loses the cue that makes a hill read as a large thing far away.
 *
 * Density falls off exponentially with altitude and the integral along a ray has a
 * closed form, so nothing is marched (Inigo Quilez, Colored fog):
 *
 * ```
 * reach = exp(-y0 / H) * H * (1 - exp(-s * ry / H)) / ry
 * ```
 *
 * `reach` is the path length the ray would have needed at ground density to pick
 * up as much haze as it did, and feeding it into the same smoothstep the old fog
 * used keeps every authored number meaning what it meant.
 *
 * The geometry half patches three's chunk, so every fogged material agrees. The
 * colour half cannot — it needs the sky's uniforms, and three clones a material's
 * uniforms at compile time — so materials are opted in one at a time by
 * `applyAerialFog`. Call `useAerialFog` before anything renders.
 */

/** How thick the air is, shared so one set of numbers reaches every draw. */
export const fogUniforms = {
  /**
   * Metres of altitude over which the haze thins by 1/e. Large, and it has to be:
   * the real atmosphere's scale height is eight kilometres, so across a
   * seventeen-metre hill the difference is a fraction of a percent, which is why
   * distant hills do not fade out from the ankles. Large values collapse the height
   * integral to the flat case exactly, so the top of the slider is genuinely off.
   */
  uFogHeight: { value: 600 },
  /** The altitude the density is quoted at. Zones are authored about zero. */
  uFogGround: { value: 0 },
  /** How much of the sky's gradient the air takes, against the flat colour. */
  uFogSky: { value: 1 },
  /**
   * How late the haze arrives. 1 is the plain ramp; above it, later. A plain
   * smoothstep across the fog range is half spent at half the distance, so things
   * wash out long before they are near `fogFar`; raising it to a power holds the
   * near half clear while keeping the zero gradient at both ends that stops banding.
   */
  uFogRamp: { value: 1.5 },
  /**
   * The most of a thing the air may ever hide, above the horizon. Below the horizon
   * it is always all of it, and that is not negotiable: the skirt's outer edge has
   * to vanish into the sky or it is a rim drawn along the horizon. Above it, never
   * quite all — a distant hill is washed out, not erased.
   */
  uFogCeiling: { value: 0.85 },
};

/**
 * Elevation over which the ceiling comes in, in `direction.y`. About three
 * degrees — clear of the skirt's edge from any sane eye height, and well under
 * the crest of anything the ceiling is meant to protect.
 */
const CEILING_LIFT = 0.05;

/**
 * The air itself, as a pair of functions of a view ray. Written against a ray
 * rather than against the fog varying, so that water and glass — which fog only
 * their own share of a pixel and have their own world position to do it from — can
 * call exactly this. Needs `fogNear`, `fogFar` and `fogColor` in scope. Include
 * `SKY_GRADIENT_GLSL` before it.
 */
export const AERIAL_AIR_GLSL = /* glsl */ `
  #ifndef AERIAL_AIR_INCLUDED
  #define AERIAL_AIR_INCLUDED

  uniform float uFogHeight;
  uniform float uFogGround;
  uniform float uFogSky;
  uniform float uFogRamp;
  uniform float uFogCeiling;

  /** What colour the air is, looking along a unit world-space ray. */
  vec3 aerialAir(vec3 ray) {
    // skyAir, not skyGradient. The two differ only in how fast they leave the
    // horizon going up, and fading to the dome's own curve paints a blue ramp down
    // every distant prop that matches the sky behind it exactly, so the prop becomes
    // a window. Never the ridge and never the clouds either: airlight is what the
    // sun and sky scatter into the path, and putting the ridge in here paints it
    // across the geometry in front of it. Indoors uFogSky is zero.
    return mix(fogColor, skyAir(ray), uFogSky);
  }

  /** How much of that air stands between the camera and a point along the ray. */
  float aerialAmount(vec3 ray, float away) {
    if (away <= fogNear) return 0.0;

    // The fogged part of the ray only. Keeping fogNear as a clean start rather
    // than as a threshold is what leaves the playable area untouched.
    float span = away - fogNear;
    float start = (cameraPosition.y - uFogGround) + ray.y * fogNear;
    float scale = max(uFogHeight, 1.0);
    float base = exp(-start / scale);

    // Path length at ground density - the height integral. Flat where the ray
    // is level enough that the exponential would cancel itself numerically.
    float reach = abs(ray.y) < 1e-3
      ? span * base
      : base * scale * (1.0 - exp(-span * ray.y / scale)) / ray.y;

    // Later than a plain ramp - see uFogRamp.
    float amount = pow(
      smoothstep(0.0, max(fogFar - fogNear, 1e-3), reach), max(uFogRamp, 0.1));

    // And never all of it, above the horizon. See uFogCeiling.
    float lift = smoothstep(0.0, ${CEILING_LIFT.toFixed(3)}, ray.y);
    return min(amount, mix(1.0, uFogCeiling, lift));
  }

  #endif
`;

/**
 * The fragment half of the chunk patch: `aerialFog(colour)`.
 *
 * Wrapped in `USE_FOG`, because without it three declares neither `fogColor`
 * nor the varying this reads.
 */
const AERIAL_FOG_GLSL = /* glsl */ `
  #ifdef USE_FOG
  ${AERIAL_AIR_GLSL}

  vec3 aerialFog(vec3 colour) {
    // Not named "distance": that is a built-in function, and shadowing one is
    // the kind of legal-but-rejected that only shows up on somebody else's
    // driver.
    float away = length(vFogRay);
    vec3 ray = vFogRay / max(away, 1e-4);
    return mix(colour, aerialAir(ray), aerialAmount(ray, away));
  }
  #endif
`;

/**
 * Patches the fog chunks: radial depth, and a world-space ray per fragment. The ray
 * is built from `mvPosition` alone rather than from `transformed` — multiplying a
 * vector by the view matrix from the left is the inverse of its rotation, so this
 * recovers the world direction without an inverse and without caring whether the
 * mesh was skinned, morphed or instanced. Ground cover is instanced, and deriving
 * world position from `transformed` would put every blade's haze at the origin.
 */
export function useAerialFog(): void {
  const planar = 'vFogDepth = - mvPosition.z;';
  if (!THREE.ShaderChunk.fog_vertex.includes(planar)) {
    // Three changed the chunk under us. Better to say so than to render a whole
    // session with a fix that silently did nothing.
    console.warn('useAerialFog: three.js fog_vertex has changed; fog is still planar');
    return;
  }

  THREE.ShaderChunk.fog_vertex = THREE.ShaderChunk.fog_vertex.replace(
    planar,
    /* glsl */ `vFogDepth = length( mvPosition.xyz );
    vFogRay = ( vec4( mvPosition.xyz, 0.0 ) * viewMatrix ).xyz;`,
  );
  THREE.ShaderChunk.fog_pars_vertex = THREE.ShaderChunk.fog_pars_vertex.replace(
    'varying float vFogDepth;',
    'varying float vFogDepth;\n\tvarying vec3 vFogRay;',
  );
  THREE.ShaderChunk.fog_pars_fragment = THREE.ShaderChunk.fog_pars_fragment.replace(
    'varying float vFogDepth;',
    'varying float vFogDepth;\n\tvarying vec3 vFogRay;',
  );
}

/**
 * Gives one material the sky-coloured, height-aware air. Composed onto whatever
 * patch is already there, so it has to be applied after a material's own
 * `onBeforeCompile` has been assigned. The sky uniforms go in by reference, and
 * both this and `art/finish.ts` are idempotent.
 */
export function applyAerialFog(material: THREE.Material): void {
  const prior = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prior?.call(material, shader, renderer);

    Object.assign(shader.uniforms, fogUniforms, skyUniforms);

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <fog_pars_fragment>',
        [
          '#include <fog_pars_fragment>',
          // Guarded, so a material that already carries the gradient — the
          // finished twin pulls in the whole sky for its environment term —
          // takes it exactly once.
          SKY_GRADIENT_GLSL,
          AERIAL_FOG_GLSL,
        ].join('\n'),
      )
      .replace(
        '#include <fog_fragment>',
        /* glsl */ `
        #ifdef USE_FOG
          gl_FragColor.rgb = aerialFog( gl_FragColor.rgb );
        #endif
        `,
      );
  };

  // Three caches programs by a key that knows nothing about `onBeforeCompile`
  // unless it is told, and the callers that set their own key set it after this
  // — see `patchArtMaterial`, which says the same thing about ordering.
  material.needsUpdate = true;
}
