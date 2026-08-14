import * as THREE from 'three';
import { SKY_GRADIENT_GLSL, skyUniforms } from './Sky';

/**
 * Aerial perspective: haze that is the sky's own colour, thins with altitude,
 * and is measured from the camera rather than from the plane in front of it.
 *
 * ## Three's fog is wrong in three ways, and only one of them is a bug
 *
 * **1. It measures to the camera plane.** The stock chunk sets
 *
 * ```glsl
 * vFogDepth = - mvPosition.z;
 * ```
 *
 * which is how far *in front of you* something is rather than how far away it
 * is. Those agree only dead ahead; everywhere else the first is shorter by the
 * cosine of the angle off the view axis. At this game's 80 degree vertical field
 * of view on a 16:9 window the horizontal half-angle is 56 degrees and
 * `cos 56° = 0.56`, so a rock 200 m away is fogged as though it were 111 m away
 * at the edge of the screen and about 100 m in a corner. Turn to look at it and
 * it fades back out. It reads as the fog thinning wherever you are not looking,
 * which is what it is doing.
 *
 * **2. It fades everything to one flat colour.** That colour was the sky's
 * horizon, and the sky is a *gradient* — so distant land went pale blue while
 * the dome behind it was already on its way to `ground`. Two different answers
 * to "what colour is the air over there", parting company along the horizon,
 * which is the one line the vista band cannot afford a seam on. Fading toward
 * `skyGradient` in the view direction instead makes land at full haze the sky
 * pixel behind it *by construction* — there is nothing left to keep in step.
 * It also gives warm air toward the sun and cool air away from it for free,
 * which is most of what "the colours aren't quite right" turns out to mean.
 *
 * **3. It has no altitude.** Real haze pools low and thins with height, which is
 * why a distant ridge is clearer at its crest than at its foot — the single most
 * recognisable distance cue there is, and the one that makes a hill read as a
 * *large* thing far away rather than a small thing behind a wall of fog.
 *
 * ## The height integral
 *
 * Density falls off exponentially with altitude, `d(y) = exp(-y / H)`, and the
 * integral of that along a ray has a closed form — one division past the flat
 * case, no ray marching (Inigo Quilez, *Colored fog*):
 *
 * ```
 * reach = exp(-y0 / H) * H * (1 - exp(-s * ry / H)) / ry
 * ```
 *
 * That `reach` is the path length the ray *would* have needed at ground density
 * to pick up as much haze as it actually did. Feeding it back into the same
 * `smoothstep(0, fogFar - fogNear, …)` the old fog used is what keeps every
 * number in the project meaning what it meant: at ground level with `H` large
 * the expression collapses to `s` and the result is bit-identical to
 * `smoothstep(fogNear, fogFar, distance)`. `fogFar` still means gone.
 *
 * ## Why the vertex half patches the chunk and the colour half does not
 *
 * Every fogged material has to agree or the seam merely moves. The chunk is the
 * one place they all come from, so the *geometry* — radial depth, and the world
 * ray each fragment needs — is patched there and reaches three's own built-ins
 * for free.
 *
 * The colour cannot be: it needs the sky's uniforms, and three clones a
 * material's uniforms per material at compile time, so a uniform declared in a
 * shared chunk has no shared value to read. Materials are opted in one at a time
 * by `applyAerialFog`, and anything not opted in keeps the stock flat fog it has
 * today rather than breaking. The set that matters is small and central: the two
 * art materials, ground cover, and particles.
 *
 * **Call `useAerialFog` before anything renders.** Programs bake the chunks in
 * at compile time.
 */

/** How thick the air is, shared so one set of numbers reaches every draw. */
export const fogUniforms = {
  /**
   * Metres of altitude over which the haze thins by `1/e`.
   *
   * **Large, and it has to be.** This started at 30 m, chosen so a hill would be
   * visibly clearer at its crown than at its foot. Measured, that gave a
   * seventeen-metre hill at 250 m an 84 % foot and a 52 % crown, and the castle
   * ran 99 % to 30 % — a third to two thirds of an object's height in fade,
   * which does not read as air. The real atmosphere's scale height is eight
   * kilometres; across seventeen metres that is a fraction of a percent, which
   * is why distant hills do not fade out from the ankles.
   *
   * At 600 the measured spread across every prop in the showcase is one or two
   * points, and flying fifty metres up still thins the air noticeably. Large
   * values collapse the height integral to the flat case exactly, so the top of
   * the slider is genuinely off rather than approximately off.
   */
  uFogHeight: { value: 600 },
  /** The altitude the density is quoted at. Zones are authored about zero. */
  uFogGround: { value: 0 },
  /** How much of the sky's gradient the air takes, against the flat colour. */
  uFogSky: { value: 1 },
  /**
   * How late the haze arrives. 1 is the plain ramp; above it, later.
   *
   * A plain `smoothstep` across the fog range is half spent at half the
   * distance, which makes the middle of the band far hazier than anything asked
   * for — things wash out long before they are anywhere near `fogFar`. Raising
   * it to a power holds the near half nearly clear and spends the fade where the
   * distance actually is, without giving up the zero gradient at both ends that
   * keeps the fog from banding.
   */
  uFogRamp: { value: 1.5 },
  /**
   * The most of a thing the air may ever hide, above the horizon.
   *
   * **Below the horizon it is always all of it**, and that is not negotiable:
   * the skirt's outer edge has to vanish into the sky or it is a rim drawn along
   * the horizon, which is the failure this whole spec exists to avoid.
   *
   * Above it, never quite all. A distant hill in life is washed out, not
   * erased — it keeps a little of its own value however far off it is, and how
   * much depends on the weather and the hour rather than on the sky it stands
   * against. Without this a tall prop simply becomes sky, which reads as it not
   * being there.
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
 * The air itself, as a pair of functions of a view ray.
 *
 * Written against a ray rather than against the fog varying so that water and
 * glass — which fog only their own share of a pixel, and have their own world
 * position to do it from — can call exactly this. Two implementations of the
 * air is two answers to the same question, and the whole point of the rework is
 * that there is one.
 *
 * Needs `fogNear`, `fogFar` and `fogColor` in scope, which three declares under
 * `USE_FOG` and the hand-written shaders declare for themselves. Include
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
    // **skyAir, not skyGradient.** The two differ only in how fast they leave
    // the horizon going up, and that difference is the whole reason distant
    // geometry stays opaque - see SKY_GRADIENT_GLSL, which argues it at length.
    // Fading to the dome's own curve paints a blue ramp down every distant prop
    // that matches the sky behind it exactly, and the prop becomes a window.
    //
    // Never the ridge and never the clouds either. Airlight is what the sun and
    // sky scatter *into* the path; it is not the radiance of whatever stands
    // behind the object. Put the ridge in here and it is painted across the
    // geometry in front of it, which is not a look-alike for transparency - it
    // is transparency, because the object is showing you what is behind it.
    //
    // Indoors uFogSky is zero and this is the room's own darkness again.
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
 * Patches the fog chunks: radial depth, and a world-space ray per fragment.
 *
 * The ray is built from `mvPosition` alone rather than from `transformed`,
 * which matters: multiplying a *vector* by the view matrix from the left is the
 * inverse of its rotation, so this recovers the world direction without an
 * inverse and without caring whether the mesh was skinned, morphed or instanced
 * on its way here. Ground cover is instanced, and deriving world position from
 * `transformed` would have put every blade's haze at the origin.
 *
 * Costs a `length` and a matrix-vector product per vertex.
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
 * Gives one material the sky-coloured, height-aware air.
 *
 * Composed onto whatever patch is already there, as the wear and detail stages
 * are — so it has to be applied *after* a material's own `onBeforeCompile` has
 * been assigned, not before.
 *
 * The sky uniforms go in by reference. `art/finish.ts` already puts the same
 * objects into `ART_FINISHED_MATERIAL` and pulls in the whole of `SKY_GLSL`
 * with them; both are idempotent, and the gradient carries an include guard for
 * exactly that case.
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
