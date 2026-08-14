import * as THREE from 'three';
import { WATER_LAYER } from '../layers';
import { NOISE_GLSL } from '../engine/noise';
import { SKY_GLSL, skyUniforms } from '../engine/Sky';
import { AERIAL_AIR_GLSL, fogUniforms } from '../engine/fog';
import { REFLECT_GLSL } from '../engine/reflect';
import { windUniforms } from './sway';

/**
 * Stylized water. SHADERS-AND-MATERIALS.md §7 plus §8 tier 2 / R6 — the design and the tuning
 * live there, not here.
 *
 * The fourth shared material, beside `ART_MATERIAL`, `ART_FINISHED_MATERIAL`
 * and `GLOW_MATERIAL`.
 *
 * Everything it does is a function of what is *behind* it — shore shading, body
 * colour, reflection — and nothing can sample the buffer it renders into, so it
 * draws in the effect chain rather than the opaque pass, with that pass's colour
 * and depth bound as textures. `engine/Water.ts` is the pass; `layers.ts` covers
 * how one line of layer setting keeps it out of everything that must not see it.
 * The depth test is done in the shader, which is why the target it draws into
 * never has the depth texture attached.
 *
 * Per-pool variation is per-vertex — `aChop` (wave height) and `aFlow`
 * (velocity), the same trick `SWAY_ATTRIBUTE` uses. Colour is global: every body
 * of water in the game is the same water.
 */

/** Metres per quad, unless a caller says otherwise. See `waterPlane`. */
const SEGMENT = 0.5;

/**
 * Wavelengths in metres, and the amplitude of each train.
 *
 * Two trains, crossing, at wavelengths that do not divide evenly — the same
 * reasoning as the two sway frequencies in `art/sway.ts`, and for the same
 * reason: a single ridge line reads as corduroy, and two that repeat together
 * read as a pattern.
 *
 * **The short one is bounded by the mesh, not by taste.** At `SEGMENT` metres
 * per quad a 2.6 m wave gets five vertices, which is about the least that still
 * looks like a wave rather than a zigzag. Shortening it means subdividing the
 * plane, and the fine detail is far cheaper as a normal perturbation in the
 * fragment shader — which is what the ripple below is.
 */
const WAVE_LONG = 4.3;
const WAVE_SHORT = 2.6;
const AMP_LONG = 0.055;
const AMP_SHORT = 0.03;

/** Wavenumbers, and the speed each train travels over still water. */
const K_LONG = (2 * Math.PI) / WAVE_LONG;
const K_SHORT = (2 * Math.PI) / WAVE_SHORT;
/**
 * How fast each train moves when the water under it is not going anywhere.
 *
 * Derived from the angular frequencies the pools were tuned at rather than
 * chosen, so still water is unchanged by flow existing: a train that was
 * running at `swayTime * 1.05` radians is running at `k · celerity` metres per
 * second, and writing it this way is what lets the flow speed be *added* to it
 * in the units it is authored in.
 */
const CELERITY_LONG = 1.05 / K_LONG;
const CELERITY_SHORT = 1.63 / K_SHORT;

/**
 * What the far field goes to underwater, blending deep toward shallow. Shared
 * with `engine/Underwater` — the two murk different pixels of the same frame.
 */
export const MURK_MIX = 0.42;

/**
 * The shared water material. One instance, for every pond in the game.
 *
 * `depthTest` and `depthWrite` are both off and that is not an oversight — see
 * the header. `transparent` is on for its *sorting* effect only: the blending
 * is off, because this shader composites what is behind it itself rather than
 * letting the blender do it, and the transparent list is simply the one that
 * gets sorted back to front. Two water planes overlapping in view then resolve
 * nearest-wins, which is the answer the missing depth test would have given.
 */
export const WATER_MATERIAL = new THREE.ShaderMaterial({
  name: 'Water',
  uniforms: {
    // The scene so far — opaque colour with the outline already on it — and the
    // depth it was drawn with. Bound per frame by `WaterEffect`.
    tScene: { value: null },
    tDepth: { value: null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uProjectionView: { value: new THREE.Matrix4() },
    uInverseProjectionView: { value: new THREE.Matrix4() },
    uFar: { value: 500 },

    /** Global wave amplitude. A look knob, not a per-pool one. */
    uWaveScale: { value: 1 },
    /**
     * The reduced-motion switch, 0 or 1. Its own uniform rather than a ride on
     * `swayAmount`, so turning wind sway off does not also stop the ponds. Stops
     * the waves *and* the noise scroll — a creeping waterline is motion too.
     */
    uWaterMotion: { value: 1 },
    /** Whether the screen-space march runs at all. A real switch — see `Water.ts`. */
    uReflections: { value: 1 },

    // Set by `engine/Underwater`, which shares both of these — it imports this
    // material, so they live here.
    uSubmerged: { value: 0 },
    uMurkDensity: { value: 0.085 },

    uShallow: { value: new THREE.Color('#6d8f8a') },
    uDeep: { value: new THREE.Color('#1f3a41') },
    uFoam: { value: new THREE.Color('#e8f0f2') },
    /** Metres of column over which shore colour becomes deep colour. */
    uShoreDepth: { value: 1.1 },
    /** Metres of column that fully hides the bed. */
    uClarity: { value: 0.9 },
    /** Roughly how thin the water has to be to foam, in metres. */
    uFoamDepth: { value: 0.34 },

    // Distance fog, filled by the renderer because `fog` is true below.
    ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),

    // The wind field, shared with every plant in the world. Not copied: the
    // claim is that the gust bending the reeds is the gust roughening the
    // pond, and two sets of numbers cannot make that claim.
    ...windUniforms,

    // And the sky's own, for the same reason. Where the reflection march finds
    // nothing, this shader asks the sky what colour it is in that direction and
    // gets exactly what the dome would have drawn — sun disc, halo and clouds.
    // A cloned set would be a second sky, and the reflection would part company
    // with the real one the first time either was tuned.
    ...skyUniforms,
    ...fogUniforms,
  },
  // The renderer fills `fogColor`, `fogNear` and `fogFar` from the scene's fog
  // when this is true. The shader applies them by hand rather than through the
  // usual include, because only part of this pixel is the water's to fog — see
  // the note at the bottom of the fragment shader.
  fog: true,
  transparent: true,
  blending: THREE.NoBlending,
  depthTest: false,
  depthWrite: false,
  // Seen from underneath the moment anybody wades in.
  side: THREE.DoubleSide,

  vertexShader: /* glsl */ `
    attribute float aChop;
    attribute vec2 aFlow;

    uniform sampler2D gustField;
    uniform vec2 windDir;
    uniform float windLagScale;
    uniform float windHalfSpan;
    uniform float swayTime;
    uniform float uWaveScale;
    uniform float uWaterMotion;

    varying vec3 vWorld;
    varying vec3 vSurfaceNormal;
    /** This vertex's chop, after the gust and the global scale. */
    varying float vChop;
    /** Where on the wave this vertex sits, -1 in a trough to 1 on a crest. */
    varying float vCrest;
    /** Which way the surface is travelling, m/s, for the fragment stage. */
    varying vec2 vFlow;
    /** The authored flow speed. Zero on a pond, and the fragment stage cares. */
    varying float vStreak;

    void main() {
      vec3 world = (modelMatrix * vec4(position, 1.0)).xyz;

      // **The same lookup the plants do**, texel for texel: how far downwind
      // this point stands decides which gust it is in. See art/sway.ts, which
      // owns this window and rebuilds it from the audio weather every frame —
      // so a gust that quickens a rustle roughens the water it crosses at the
      // same moment, without either side reimplementing the field.
      float lag = dot(world.xz, windDir) * windLagScale;
      float u = clamp(0.5 - lag / (2.0 * windHalfSpan), 0.0, 1.0);
      float gust = texture2D(gustField, vec2(u, 0.5)).r;

      // Never all the way to nothing: water in a lull is calmer, not glass.
      // uWaterMotion is the accessibility switch, and it is a hard zero — a
      // pond that has stopped is glass, which is the point of asking for it.
      float chop = aChop * uWaveScale * uWaterMotion * (0.35 + 0.65 * gust);

      // **Which way the surface is going.** Flowing water carries its own
      // direction and speed in aFlow; still water answers the wind, which is
      // what every pond does and what the channels deliberately do not.
      float rate = length(aFlow);
      // Two trains, crossed at about fifty degrees. The first runs with the
      // water; the second is it, rotated, so both turn together.
      vec2 d1 = rate > 0.001 ? aFlow / rate : normalize(windDir + vec2(1e-4, 0.0));
      vec2 d2 = vec2(d1.x * 0.62 - d1.y * 0.78, d1.x * 0.78 + d1.y * 0.62);

      float k1 = ${K_LONG.toFixed(5)};
      float k2 = ${K_SHORT.toFixed(5)};
      // Phase speed is the train's own celerity **plus the speed of the water
      // under it**, projected onto the direction that train runs in. With no
      // flow this is exactly the still-water phase the pools were tuned at.
      float p1 = (dot(world.xz, d1) - swayTime * (${CELERITY_LONG.toFixed(4)} + dot(aFlow, d1))) * k1;
      float p2 = (dot(world.xz, d2) - swayTime * (${CELERITY_SHORT.toFixed(4)} + dot(aFlow, d2))) * k2;

      float a1 = ${AMP_LONG.toFixed(3)} * chop;
      float a2 = ${AMP_SHORT.toFixed(3)} * chop;
      float height = a1 * sin(p1) + a2 * sin(p2);

      // **Plain sines so the slope is exact.** A Gerstner sum would look better
      // in a screenshot and would need either a finite difference or a second
      // evaluation to get its normal; the derivative of a sine is a cosine, and
      // the surface normal is most of what water looks like.
      vec2 slope = d1 * (a1 * k1 * cos(p1)) + d2 * (a2 * k2 * cos(p2));

      world.y += height;
      vWorld = world;
      vSurfaceNormal = normalize(vec3(-slope.x, 1.0, -slope.y));
      vChop = chop;
      vCrest = height / max(a1 + a2, 1e-4);
      // What the fragment stage advects its noise along. Still water still
      // drifts, slowly, downwind — a surface pattern nailed to the world reads
      // as ice.
      vFlow = rate > 0.001 ? aFlow : windDir * 0.25;
      // Zero on still water, which is what keeps a pond from looking combed.
      vStreak = rate;

      gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D tScene;
    uniform sampler2D tDepth;
    uniform vec2 uResolution;
    uniform mat4 uProjectionView;
    uniform mat4 uInverseProjectionView;
    uniform float uFar;
    uniform float uReflections;
    uniform float uSubmerged;
    uniform float uMurkDensity;
    uniform vec3 uShallow;
    uniform vec3 uDeep;
    uniform vec3 uFoam;
    uniform float uShoreDepth;
    uniform float uClarity;
    uniform float uFoamDepth;

    uniform vec2 windDir;
    uniform float swayTime;
    uniform float uWaterMotion;

    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;

    varying vec3 vWorld;
    varying vec3 vSurfaceNormal;
    varying float vChop;
    varying float vCrest;
    varying vec2 vFlow;
    varying float vStreak;

    ${NOISE_GLSL}
    ${SKY_GLSL}
    ${AERIAL_AIR_GLSL}

    /**
     * How far along the camera ray the scene stops, at a screen position.
     *
     * By unprojection rather than by converting axis depth to ray depth, for
     * the reason the fog march gives: the result is a length between two world
     * points and is therefore a distance along the ray by construction, with
     * no axis-versus-ray confusion left to get wrong.
     *
     * Sky comes back as the far plane, so a reflection ray crossing open sky
     * finds nothing to hit and carries on.
     */
    float sceneDistance(vec2 uv) {
      float d = texture2D(tDepth, uv).r;
      if (d >= 0.9999) return uFar;
      vec4 p = uInverseProjectionView * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
      return length(p.xyz / p.w - cameraPosition);
    }

    ${REFLECT_GLSL}

    /** Two scales of value noise. Cheaper than fbm, and this is not a cloud. */
    float ripple(vec2 p) {
      return valueNoise(p) * 0.66 + valueNoise(p * 2.17 + 11.3) * 0.34;
    }

    /**
     * The same noise, drawn in a frame that runs with the water and is squeezed
     * along it.
     *
     * **This is what makes flow read as flow rather than as texture sliding
     * about.** Isotropic noise carried downstream moves, and moving is all it
     * does — nothing in the pattern says which way. Compressing the coordinate
     * along the flow stretches every feature *out* along it in world space, and
     * what comes back is streaklines: the shape water actually draws on itself,
     * and the shape a photograph of a river is made of.
     *
     * It is also the cheapest speed cue there is. The stretch grows with the
     * flow, so a slow channel is faintly combed and a fast one is drawn in long
     * lines, side by side, with nothing else different between them.
     *
     * And it is the whole answer to a bend. The frame is built from a varying,
     * so it rotates across the surface exactly as the flow does — the streaks
     * bend round the corner because they are drawn in the water's own frame
     * rather than in the world's. A height field cannot do this (see the note on
     * shear on WaterPlaneOptions.flow); noise can, and does it for free.
     */
    float streaked(vec2 p, vec2 along, float stretch, float scale) {
      vec2 across = vec2(-along.y, along.x);
      return ripple(vec2(dot(p, along) / stretch, dot(p, across)) * scale);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;

      vec3 toEye = cameraPosition - vWorld;
      float surfaceDistance = length(toEye);
      vec3 view = toEye / surfaceDistance;

      // **The depth test, done by hand.** Everything opaque was drawn before
      // this pass and its distance is in tDepth; anything nearer than the
      // surface is in front of it. The centimetre of slack keeps a bed that
      // breaks the surface from flickering along its own waterline.
      float bedDistance = sceneDistance(uv);
      if (bedDistance < surfaceDistance - 0.02) discard;

      // How much water the eye is looking through, in metres. Everything below
      // is a function of this number.
      float thickness = max(bedDistance - surfaceDistance, 0.0);

      // --- the surface normal ------------------------------------------------
      // The wave slope from the vertex stage, plus fine ripple that would need
      // a mesh ten times denser to carry as displacement. Gradient by finite
      // difference, which is the honest cost of using noise for it.
      // **How far the surface has carried its own pattern**, in metres. Every
      // noise lookup below is offset by this rather than being nailed to the
      // world, which is the whole of what makes flowing water read as flowing:
      // the wave trains say which way it is going and this says that the
      // *stuff* is going with them. It is a varying, so a channel can turn a
      // corner and the pattern turns with it — noise shears cleanly where a
      // height field would tear.
      //
      // **The honest limit**: this grows without bound, and the value noise is
      // a hash of its coordinate, so after twenty-odd minutes of watching one
      // fast channel the offset is large enough that float32 starts to coarsen
      // the pattern. The fix, if it is ever wanted, is the tiled noise
      // *texture* that engine/noise already builds for the fog volumes, which
      // wraps and therefore cannot drift out of precision.
      vec2 stream = vFlow * (swayTime * uWaterMotion);

      // The frame the surface pattern is drawn in — see streaked above. Still water
      // gets a stretch of exactly 1, which is no streaking at all: a pond that
      // looked combed downwind would be a worse lie than one that looked
      // featureless.
      float carried = length(vFlow);
      vec2 along = carried > 1e-4 ? vFlow / carried : vec2(1.0, 0.0);
      float stretch = 1.0 + min(vStreak, 3.0) * 1.15;

      // **How broken the surface is, which is not the same as how big its waves
      // are.** A race carries almost no swell — its wave trains have to stay
      // small, because a channel that turns shears the phase — and the first
      // version therefore came out glassy: a mirror with a pattern sliding over
      // it, which reads as still water with something wrong about it. Fast water
      // is not smooth. Speed drives the surface break directly here, so a
      // channel is agitated in proportion to how hard it is running without any
      // of that going through the vertex stage.
      float rushing = min(vStreak, 3.0) / 3.0;
      float agitation = max(vChop, rushing * 1.15);

      vec3 normal = normalize(vSurfaceNormal);
      if (agitation > 0.002) {
        vec2 q = vWorld.xz - stream * 1.35;
        float e = 0.18;
        float n0 = streaked(q, along, stretch, 1.35);
        float gx = streaked(q + vec2(e, 0.0), along, stretch, 1.35) - n0;
        float gz = streaked(q + vec2(0.0, e), along, stretch, 1.35) - n0;
        // **Small.** This tilts the normal, and the normal decides both the
        // fresnel weight and where the reflection ray goes — so at anything
        // past about ten degrees the reflected image stops being a reflection
        // and becomes a warp. Ripple is meant to make the surface *sparkle*,
        // which is a few degrees of scatter; the shape of the water is the
        // vertex stage's business.
        normal = normalize(normal + vec3(-gx, 0.0, -gz) * (0.16 * agitation / e));
      }

      // --- seen from below ----------------------------------------------------
      //
      // A different surface, not a fainter one. Everything past this point
      // assumes the eye is in air, and every term of it inverts underwater.
      //
      // Snell's window: light from above reaches an eye in water only through a
      // cone about 49 degrees wide, cos = sqrt(1 - 1/1.333^2) = 0.661. Outside
      // it, total internal reflection — the same march, pointed down at the bed.
      if (!gl_FrontFacing) {
        vec3 upward = -view;
        float facing = clamp(dot(normal, upward), 0.0, 1.0);
        float window = smoothstep(0.60, 0.71, facing);

        vec3 mirrored = uDeep;
        if (uReflections > 0.5) {
          vec3 down = reflect(upward, normal);
          // Never let a grazing ray run flat along the underside of the surface,
          // where it would march for fifty metres and find whatever is at the
          // far end of the pool.
          down.y = min(down.y, -0.03);
          float found;
          float travelled;
          vec3 marched = marchReflection(
            vWorld,
            normalize(down),
            reflectJitter(floor(gl_FragCoord.xy)),
            found,
            travelled
          );
          // Absorbed with distance, unlike the air side: without this, grazing
          // TIR marches twenty metres and returns crisp bright sand.
          mirrored = mix(uDeep, marched, found * exp(-travelled * 0.32));
        }

        vec3 seen = mix(mirrored, texture2D(tScene, uv).rgb, window);
        seen = mix(seen, uShallow, 0.26);

        // This surface murks itself: the depth buffer has no water in it, so
        // the underwater pass has no distance for these pixels. Same density and
        // far colour, so the two converge at range with no seam.
        float murk = 1.0 - exp(-surfaceDistance * uMurkDensity);
        vec3 scattered = mix(uDeep, uShallow, ${MURK_MIX.toFixed(2)});
        seen = mix(seen, scattered, murk * uSubmerged);

        // Alpha zero: nothing left for the underwater pass to do here.
        gl_FragColor = vec4(seen, 0.0);
        return;
      }

      // --- what is under the water -------------------------------------------
      vec3 bed = texture2D(tScene, uv).rgb;
      // Beer-Lambert on the column, the same shape the fog volumes use: the bed
      // does not vanish at a threshold, it fades out at a rate.
      float opacity = 1.0 - exp(-thickness / max(uClarity, 0.01));
      vec3 body = mix(uShallow, uDeep, 1.0 - exp(-thickness / max(uShoreDepth, 0.01)));
      vec3 below = mix(bed, body, opacity);

      // --- reflection ---------------------------------------------------------
      vec3 bounce = reflect(-view, normal);
      // A wave normal at a grazing angle can send the ray below the horizon,
      // where the sky shader returns ground colour and the march finds the
      // floor at the camera's feet. Neither is a reflection of anything.
      bounce.y = max(bounce.y, 0.015);
      bounce = normalize(bounce);

      vec3 sky = skyColour(bounce);
      vec3 reflection = sky;
      float hit = 0.0;
      if (uReflections > 0.5) {
        float found;
        float travelled;
        vec3 marched = marchReflection(
          vWorld,
          bounce,
          reflectJitter(floor(gl_FragCoord.xy)),
          found,
          travelled
        );
        reflection = mix(sky, marched, found);
        hit = found;
      }

      // Schlick, with water's own 0.02 at normal incidence. Looking straight
      // down you see the bed; looking along the pool you see the sky. That is
      // not a stylistic choice, it is what the number does, and it is why the
      // still pool is long — the reflection lives at the far end of it.
      float fresnel = clamp(
        0.02 + 0.98 * pow(1.0 - clamp(dot(normal, view), 0.0, 1.0), 5.0),
        0.0,
        1.0
      );

      vec3 colour = mix(below, reflection, fresnel);

      // --- foam ---------------------------------------------------------------
      // Two bands and two flat colours, hard-thresholded on purpose: the
      // quantizer downstream would band a gradient anyway, so the bands are
      // authored where they belong rather than landing wherever the level count
      // puts them.
      //
      // The waterline is scaled by noise and scrolled downwind, which is what
      // stops a threshold on depth reading as a contour line drawn on a map.
      // Three layers at slightly different rates, because water is not one
      // sheet: the fine ripple above rides fastest, the crest speckle goes with
      // the body, and the waterline lags. All of them are carried by the stream above,
      // so the motion switch stops every one of them — a waterline undulating
      // around an otherwise dead pond is the exact thing somebody turning
      // reduced motion on is asking to be rid of.
      float lap = streaked(vWorld.xz - stream * 0.85, along, stretch, 0.55);
      // **Fast water is aerated, and aerated water is white further out.** The
      // band a race foams over is nearly twice a pond's, which is why a mill
      // race reads as white and a lake does not. It costs one multiply and it
      // is the other half of making flow visible: the streaklines say which way,
      // and this is what there is enough of to see them in.
      float band = uFoamDepth * (0.45 + 1.1 * lap) * (1.0 + rushing * 0.95);
      float shore = 1.0 - smoothstep(band * 0.5, band, thickness);

      // **Crest foam has to be broken up, because the waves are a grid.**
      // Two crossed sine trains interfere into a perfectly regular lattice, and
      // a plain threshold on wave height therefore puts a white speck at every
      // node of it — which reads as a pattern sliding across the pool rather
      // than as water breaking. So the threshold is *lowered* by a drifting
      // noise field instead of being a constant: foam is possible where the
      // noise is high, and even there only the tallest crests reach it. Same
      // move as the waterline above, one scale finer.
      float speck = streaked(vWorld.xz - stream, along, stretch, 1.7);
      float crest =
        smoothstep(1.05 - speck * 0.55, 1.25 - speck * 0.5, vCrest) *
        smoothstep(0.12, 0.5, agitation);
      float foam = max(shore, crest);

      float wash = step(0.28, foam);
      float white = step(0.68, foam);
      // The paler band is mixed from the shore colour rather than authored, so
      // the two never drift apart when the palette is tuned.
      vec3 foamColour = mix(mix(uShallow, uFoam, 0.55), uFoam, white);
      colour = mix(colour, foamColour, wash);

      // --- fog ----------------------------------------------------------------
      // **Only the part of this pixel that is ours gets fogged.** The bed came
      // out of tScene already fogged for its own distance, and so did anything
      // the reflection march found; fogging the composite again would haze both
      // of them twice. What is genuinely this shader's — the body colour, a sky
      // reflection, the foam — is fogged for the surface's distance, which is
      // what the rest of the world would have done with it.
      float own = mix(opacity, 1.0 - hit, fresnel);
      own = mix(own, 1.0, wash);
      // The same air as the rest of the world, from the same functions - see
      // engine/fog.ts. No backticks in here: this is a template literal, and
      // one inside a comment would end it mid-GLSL. The view vector points at
      // the eye, and the air is measured going the other way.
      float haze = aerialAmount(-view, surfaceDistance) * own;

      gl_FragColor = vec4(mix(colour, aerialAir(-view), haze), 1.0);
    }
  `,
});

// A geometry without the attribute would otherwise read whatever the last draw
// left in the slot, exactly as the sway weight would — see `applySway`. Nothing
// but `waterPlane` builds water, and it always sets one; this is here so that
// staying true costs nothing to check.
(WATER_MATERIAL as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
  aChop: [0],
  aFlow: [0, 0],
};

export interface WaterPlaneOptions {
  /** Extent along X and Z, in metres. */
  width: number;
  depth: number;
  /**
   * Where the middle of the surface sits, in the zone's space.
   *
   * The plane places itself, rather than being positioned afterwards, because
   * `flow` is authored in world coordinates and has to be evaluated per vertex
   * — which cannot happen before the plane knows where it is.
   */
  at: THREE.Vector3;
  /**
   * How rough this water is: 0 is a mirror, 1 is the full wind-driven chop.
   *
   * Baked per vertex rather than set as a uniform, which is what lets one
   * material serve a still pool and a choppy one in the same room. Values above
   * 1 are a swell rather than a ripple and are entirely allowed — 2.5 is a
   * quarter-metre wave.
   *
   * **A function makes a beach.** Evaluated per vertex in world coordinates, so
   * a body of water can carry a heavy swell offshore and taper it to nothing as
   * the bed comes up, which is the difference between waves on water and waves
   * driven through the sand.
   */
  chop?: number | ((x: number, z: number) => number);
  /**
   * How fast the water is going and which way, in metres per second.
   *
   * Omitted, the surface is still and answers the wind, which is what every
   * pond does. A vector makes a race; **a function makes a race that turns a
   * corner**, because it is evaluated per vertex — and that is the reason this
   * is an attribute rather than a uniform.
   *
   * The flow rotates the wave trains and speeds them up, and it carries the
   * surface noise with it. A flow field that turns sharply will shear the wave
   * *phase* between neighbouring vertices, so keep the turn gentle or the chop
   * low; the noise shears cleanly at any rate, and it is most of what reads as
   * flow anyway.
   */
  flow?: THREE.Vector2 | ((x: number, z: number) => THREE.Vector2);
  /** Metres per quad. Finer than the shortest wave, or the wave is a zigzag. */
  segment?: number;
}

/**
 * A body of water, placed like any other prop.
 *
 * Three flags, all load-bearing and none of them optional:
 *
 * - **`WATER_LAYER`, set rather than enabled.** The plane leaves layer 0
 *   entirely, which is what takes it out of the opaque pass, the normal pass
 *   and the shadow map in one line. `layers.ts` says why each of those matters.
 * - **`noCollide`.** You wade into water, you do not walk into it. Callers mark
 *   whole subtrees solid, and without this the surface would be a sheet of
 *   glass at knee height.
 * - **`frustumCulled` left on**, but the bounding box three computes is of the
 *   *undisplaced* plane. The waves are under six centimetres, so the box is
 *   correct to within that and a pond does not vanish at the edge of the view.
 *
 * The plane is deliberately sized a little larger than the basin it sits in.
 * The water's own boundary is a hard geometric edge, and the honest place for
 * it is buried in the bank.
 */
export function waterPlane(options: WaterPlaneOptions): THREE.Mesh {
  const { width, depth, at, chop = 1, flow, segment = SEGMENT } = options;

  const across = Math.max(1, Math.round(width / segment));
  const along = Math.max(1, Math.round(depth / segment));
  const geometry = new THREE.PlaneGeometry(width, depth, across, along);
  geometry.rotateX(-Math.PI / 2);

  const position = geometry.getAttribute('position');
  const count = position.count;

  const chopValues = new Float32Array(count);
  if (typeof chop === 'function') {
    for (let i = 0; i < count; i++) {
      chopValues[i] = Math.max(chop(position.getX(i) + at.x, position.getZ(i) + at.z), 0);
    }
  } else {
    chopValues.fill(Math.max(chop, 0));
  }
  geometry.setAttribute('aChop', new THREE.BufferAttribute(chopValues, 1));

  // Zero everywhere unless a flow was authored, which is the still case and by
  // far the common one — the shader reads a zero-length flow as "answer the
  // wind" rather than as "go nowhere".
  const flowValues = new Float32Array(count * 2);
  if (flow) {
    for (let i = 0; i < count; i++) {
      // World coordinates, so a flow field can be written against the room's
      // own layout rather than against wherever this plane's origin landed.
      const velocity =
        typeof flow === 'function'
          ? flow(position.getX(i) + at.x, position.getZ(i) + at.z)
          : flow;
      flowValues[i * 2] = velocity.x;
      flowValues[i * 2 + 1] = velocity.y;
    }
  }
  geometry.setAttribute('aFlow', new THREE.BufferAttribute(flowValues, 2));

  const mesh = new THREE.Mesh(geometry, WATER_MATERIAL);
  mesh.name = 'water';
  mesh.position.copy(at);
  mesh.layers.set(WATER_LAYER);
  mesh.userData.noCollide = true;
  // How the zone finds out it has water in it without being told twice. The
  // pass that draws water is skipped entirely in a zone with none, and a
  // declaration on the zone could disagree with what was actually built — so
  // the geometry is what says so. See `Zone.hasWater`.
  mesh.userData.water = true;
  return mesh;
}
