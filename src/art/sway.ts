import * as THREE from 'three';
import { ART_MATERIAL, SWAY_ATTRIBUTE } from './assemble';
import { applyWear } from './weathering';
import { applyDetail } from './detail';
import { applyFinish } from './finish';
import type { Weather } from '../audio/weather';

/**
 * The world moving on its own.
 *
 * A still world reads as a diorama however good it looks, and a small amount
 * of constant unforced motion buys more presence per unit of effort than
 * almost anything else available. This is that motion.
 *
 * Three things had to be true, and they are the three the design is built
 * around:
 *
 * 1. **The breeze travels.** Not every tree at once — a gust arrives somewhere
 *    and moves through, so you can watch it cross a valley. See
 *    `Weather.lagAt`: the field is sampled at a phase offset by how far
 *    downwind a point stands, which makes it a front rather than a switch.
 * 2. **What you see is what you hear.** The shader and the audio evaluate the
 *    *same* `Weather.fieldAt`, so the gust that bends a tree is the gust that
 *    quickens its rustle. Uncoupled they are two ambiences sharing a room.
 * 3. **Not everything bends.** A mushroom is rigid, a sunflower nods, reeds
 *    thrash. See `art/flex.ts`, which is applied to the sway weights when a
 *    builder finishes rather than being a uniform here — a uniform would mean
 *    a material per species, and one shared material is what keeps a prop to a
 *    single draw call.
 *
 * ## How the field reaches the GPU exactly
 *
 * The obvious approach is to reimplement the gust noise in GLSL. It is also
 * the one that quietly breaks the second requirement: the field is built from
 * an integer hash and cosine interpolation, and a GLSL reimplementation would
 * differ in the last bits — enough that over a minute the picture and the
 * sound drift out of step, which is worse than never having coupled them,
 * because the failure is invisible in code and only shows up as a vague sense
 * that something is off.
 *
 * So the CPU stays the single source of truth and ships the answer. The field
 * depends on exactly one scalar, so a **one-dimensional lookup texture** holds
 * it over the window of phases the visible world can ask for, rebuilt each
 * frame from `Weather.fieldAt`. Agreement is then by construction rather than
 * by care.
 *
 * Eight bits is plenty: a strength quantised to 1/255 is far finer than any
 * displacement it drives, and a byte texture filters linearly everywhere
 * without an extension.
 */

/** Texels across the lookup window. 256 over ~25 s is a sample every 100 ms. */
const FIELD_SIZE = 256;

/**
 * Half-width of the sampled window, in metres along the wind.
 *
 * The window has to cover every point the visible world might ask about,
 * upwind and down. Comfortably past the largest zone — Arkstin's bowl is 96 m
 * across — and the cost of being generous is only resolution, which there is
 * plenty of.
 */
const WORLD_REACH = 140;

/**
 * How far a vertex leans downwind at full strength, **as a fraction of its own
 * height above the ground**.
 *
 * The fraction is the important word, and getting it wrong the first time made
 * every small plant ridiculous. The authored sway weight is normalised to each
 * plant's *own* height — a daisy's petal and a tree's top twig both carry
 * weight 1 — so a displacement measured in metres moves them the same absolute
 * distance. At 0.34 m that is a hand's width, which on a 6 m tree is a breath
 * and on a 25 cm daisy is longer than the whole flower. Every short thing was
 * flailing like a windsock while the trees barely stirred.
 *
 * Scaling by height is also simply what a cantilever does: tip deflection goes
 * with length, so a tall thing moves further in metres and about the same in
 * proportion — which is exactly how a field of mixed planting reads.
 *
 * Object-space height is used, so a builder's `scale` carries through for free.
 */
const BEND = 0.16;
/** The same, across the wind. Smaller, faster, and never quite zero. */
const FLUTTER = 0.05;

export interface WindUniforms {
  gustField: { value: THREE.DataTexture };
  /**
   * The running integral of the same field, in strength-seconds.
   *
   * What an *unanchored* thing needs. A plant is a spring, so it answers the
   * wind now; a snowflake keeps everything the wind has already given it, which
   * is the integral over its own age — see PARTICLES.md §4. Two taps and a
   * subtract, from the table beside the one the plants read, so the gust that
   * carries the snow is the gust bending the trees by construction.
   *
   * Float, and that is not caution: a running sum quantised to a byte comes out
   * of a short-lived particle as a staircase of two or three discrete drifts.
   * Sampled `NearestFilter` and interpolated by hand in the shader, because
   * linear filtering of a float texture is an extension and this is not.
   */
  gustIntegral: { value: THREE.DataTexture };
  windDir: { value: THREE.Vector2 };
  /** Metres per gust-time unit along the wind. Converts world position to phase. */
  windLagScale: { value: number };
  /** Half the lookup window, in the same units as the lag. */
  windHalfSpan: { value: number };
  /** Seconds of age → texture coordinate, for reaching back into the integral. */
  windAgeScale: { value: number };
  swayTime: { value: number };
  swayAmount: { value: number };
}

const field = new THREE.DataTexture(
  new Uint8Array(FIELD_SIZE),
  FIELD_SIZE,
  1,
  THREE.RedFormat,
  THREE.UnsignedByteType,
);
field.minFilter = THREE.LinearFilter;
field.magFilter = THREE.LinearFilter;
field.wrapS = THREE.ClampToEdgeWrapping;
field.wrapT = THREE.ClampToEdgeWrapping;
field.needsUpdate = true;

const integral = new THREE.DataTexture(
  new Float32Array(FIELD_SIZE),
  FIELD_SIZE,
  1,
  THREE.RedFormat,
  THREE.FloatType,
);
integral.minFilter = THREE.NearestFilter;
integral.magFilter = THREE.NearestFilter;
integral.wrapS = THREE.ClampToEdgeWrapping;
integral.wrapT = THREE.ClampToEdgeWrapping;
integral.needsUpdate = true;

export const windUniforms: WindUniforms = {
  gustField: { value: field },
  gustIntegral: { value: integral },
  windDir: { value: new THREE.Vector2(1, 0) },
  windLagScale: { value: 0 },
  windHalfSpan: { value: 1 },
  windAgeScale: { value: 0 },
  swayTime: { value: 0 },
  // A global scale, so the whole world's motion can be turned down without
  // re-tuning seventy builders against each other. Composed below from the
  // player's option and the active zone's own wind.
  swayAmount: { value: 1 },
};

let swayOption = 1;
let swayZone = 1;

/** The reduced-motion / wind-sway option. Zero stills everything. */
export function setSwayOption(enabled: boolean): void {
  swayOption = enabled ? 1 : 0;
  windUniforms.swayAmount.value = swayOption * swayZone;
}

/** The active zone's wind, over the weather's. An exposed hilltop blows harder. */
export function setZoneWind(factor: number): void {
  swayZone = factor;
  windUniforms.swayAmount.value = swayOption * swayZone;
}

/**
 * The depth material the shadow map is drawn with, displaced to match.
 *
 * **A vertex shader that moves geometry has to move it twice.** Three.js draws
 * the shadow pass with its own `MeshDepthMaterial`, which knows nothing about
 * a patch applied to the surface material — so a swaying plant casts a
 * perfectly still shadow of where it is not. Standing in a field that reads as
 * an undisplaced copy of every plant, welded to the ground, in whatever colour
 * a shadow quantises to over that floor.
 *
 * `RGBADepthPacking` because that is what the renderer expects from a
 * `customDepthMaterial` on a non-cube light, and getting it wrong silently
 * produces shadows at the wrong depth rather than an error.
 */
export const SWAY_DEPTH_MATERIAL = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
});

let patched = false;

/**
 * Patches the one shared art material to displace vertices.
 *
 * Idempotent, and called once at boot. Everything built by the art kit picks
 * this up; nothing else does, which is why the Proving Ground's ad-hoc test
 * geometry stands still and its trees do not.
 */
export function patchArtMaterial(): void {
  if (patched) return;
  patched = true;

  // Both, and with the same code. The surface material decides what you see;
  // the depth material decides what the sun sees, and they have to agree.
  // `MeshDepthMaterial`'s vertex shader carries the same two include points,
  // so one patch serves both.
  const patch = (shader: { vertexShader: string; uniforms: Record<string, unknown> }): void => {
    Object.assign(shader.uniforms, windUniforms);

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        attribute float ${SWAY_ATTRIBUTE};
        uniform sampler2D gustField;
        uniform vec2 windDir;
        uniform float windLagScale;
        uniform float windHalfSpan;
        uniform float swayTime;
        uniform float swayAmount;

        // A cheap hash, for the per-instance flutter offset. Two objects the
        // same distance downwind receive the same gust at the same moment,
        // which is correct — but they must not then flutter in lockstep, so
        // the fast component is offset by where the object stands.
        float swayHash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        `,
      )
      .replace(
        '#include <begin_vertex>',
        /* glsl */ `#include <begin_vertex>
        {
          float weight = ${SWAY_ATTRIBUTE} * swayAmount;
          if (weight > 0.0001) {
            // Where this vertex stands, and therefore when the gust reaches it.
            vec3 worldAt = (modelMatrix * vec4(transformed, 1.0)).xyz;
            float lag = dot(worldAt.xz, windDir) * windLagScale;
            // The window is centred on now, so upwind (negative lag) reads
            // ahead of the present and downwind reads behind it.
            float u = clamp(0.5 - lag / (2.0 * windHalfSpan), 0.0, 1.0);
            float strength = texture2D(gustField, vec2(u, 0.5)).r;

            // The wind, in this object's own space. Only Y rotation and a
            // uniform scale are ever used, so the inverse rotation is the
            // transpose over the scale squared — which avoids needing
            // inverse() or transpose(), neither of which exists in GLSL ES 1.
            vec3 c0 = modelMatrix[0].xyz;
            vec3 c1 = modelMatrix[1].xyz;
            vec3 c2 = modelMatrix[2].xyz;
            float scaleSq = max(dot(c0, c0), 0.0001);
            vec3 windWorld = vec3(windDir.x, 0.0, windDir.y);
            vec3 windObj =
              vec3(dot(c0, windWorld), dot(c1, windWorld), dot(c2, windWorld)) / scaleSq;
            vec3 crossObj = vec3(-windObj.z, 0.0, windObj.x);

            float offset = swayHash(floor(modelMatrix[3].xz * 4.0)) * 6.2831;

            // Two frequencies that do not divide evenly, so the pair never
            // visibly repeats. The slow one leans downwind and stays there —
            // wind pushes one way, and a symmetric sine reads as a metronome
            // rather than as a load.
            float lean = 0.62 + 0.38 * sin(swayTime * 1.1 + offset);
            float flutter = sin(swayTime * 3.7 + offset * 2.3);

            // Height is a factor, and it has to be. The sway weight is
            // relative to each plant's own height, so without this a daisy and
            // an oak move the same number of metres -- see BEND. Object-space
            // Y, taken before anything is displaced, which is the vertex's
            // height above its own base because every builder stands on y = 0.
            //
            // (No backticks anywhere in this shader source: it is a template
            // literal, and one would end it mid-GLSL.)
            float tall = max(transformed.y, 0.0);
            float push = weight * strength * tall;
            transformed += windObj * (push * lean * ${BEND.toFixed(3)})
                         + crossObj * (push * flutter * ${FLUTTER.toFixed(3)});
          }
        }
        `,
      );
  };

  swayPatch = patch;
  applySway(ART_MATERIAL);
  applySway(SWAY_DEPTH_MATERIAL);

  // The weathering stage wraps the sway patch on the surface material only —
  // the depth and normal materials read geometry, not colour. Applied here,
  // after sway has claimed `onBeforeCompile`, because it composes by
  // wrapping; see `applyWear`.
  applyWear(ART_MATERIAL);
  // And detail fading wraps that, in this order: it dissolves the finished
  // surface colour, weathering included. See `applyDetail`.
  applyDetail(ART_MATERIAL);
  // The finish stage wraps last. It hooks the lighting chunks rather than the
  // colour ones, so it consumes whatever the three stages above decided the
  // surface is. See `applyFinish`.
  applyFinish(ART_MATERIAL);
}

/** Set by `patchArtMaterial`. Held so late arrivals can be patched too. */
let swayPatch: ((shader: { vertexShader: string; uniforms: Record<string, unknown> }) => void) | null =
  null;

/**
 * Makes one more material displace vertices the same way the kit does.
 *
 * **Anything that draws the scene has to agree about where the scene is**, and
 * three things do. The surface material is the obvious one; the depth material
 * is what the sun sees, or the shadow stays where the plant was. The third is
 * the one that actually caused the visible bug: `RenderPixelatedPass` sets
 * `scene.overrideMaterial` to a `MeshNormalMaterial` and re-renders everything
 * to build the normal buffer its edge detector reads — so the outline was
 * being traced around undisplaced geometry, and every swaying plant carried a
 * motionless wireframe of its own former shape.
 *
 * Exported because that material belongs to a three.js pass and is reached
 * from the render pipeline, not from here.
 *
 * Safe to apply to a material that draws non-kit geometry. A shader attribute
 * the geometry does not supply reads as zero, so the terrain and the floor
 * get a sway weight of zero and are left alone.
 */
export function applySway(material: THREE.Material): void {
  if (!swayPatch) return;
  material.onBeforeCompile = swayPatch;

  // **What a missing attribute reads as, stated rather than assumed.** As an
  // override material this draws the terrain, the floor and the sky dome too,
  // and none of them carries a sway weight. When a geometry does not supply an
  // attribute the shader declares, WebGL falls back to a *generic* value that
  // persists across draw calls — so without this the weight would be whatever
  // the last mesh happened to leave in that slot, and the ground would ripple
  // occasionally and unreproducibly. Zero means rigid.
  //
  // `defaultAttributeValues` is read by the renderer on every material and
  // typed on only some of them.
  (material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
    ...(material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues,
    [SWAY_ATTRIBUTE]: [0],
  };

  // Three.js caches compiled programs by a key that knows nothing about an
  // `onBeforeCompile`, so two materials differing only in their patch can be
  // handed each other's program. The normal material is the live risk: it is
  // an ordinary `MeshNormalMaterial` that another pass could also be using.
  material.customProgramCacheKey = () => 'sway';
  material.needsUpdate = true;
}

const texels = field.image.data as Uint8Array;
const sums = integral.image.data as unknown as Float32Array;

/**
 * Refills the lookup window and advances the clock. Once a frame.
 *
 * The whole texture is rebuilt rather than scrolled. It is 256 evaluations of
 * a handful of hashes — far cheaper than the bookkeeping a ring buffer would
 * need, and it cannot drift out of alignment with the phase it claims to hold.
 */
export function updateWind(weather: Weather, elapsed: number): void {
  const { windDirection, frontSpeed, gustRate } = weather.settings;

  windUniforms.windDir.value.set(Math.cos(windDirection), Math.sin(windDirection));
  // Metres → gust-time, matching `Weather.lagAt` exactly. The shader multiplies
  // this by the along-wind distance to get the same lag the audio computes.
  const lagScale = gustRate / Math.max(frontSpeed, 0.5);
  const halfSpan = WORLD_REACH * lagScale;
  windUniforms.windLagScale.value = lagScale;
  windUniforms.windHalfSpan.value = halfSpan;
  windUniforms.swayTime.value = elapsed;
  // Seconds of age into a step along the window. The window is a span of
  // gust-time and age is a span of seconds, so the rate is the whole of the
  // conversion — and a rate of zero would be a still world with an integral
  // that never advances, which is exactly the right answer for one.
  windUniforms.windAgeScale.value = gustRate / (2 * halfSpan || 1);

  // Seconds between neighbouring texels, for the integral below. The window is
  // `2·halfSpan` of gust-time wide, and `gustRate` is gust-time per second.
  const step = (2 * halfSpan) / (FIELD_SIZE - 1) / Math.max(gustRate, 1e-6);
  let sum = 0;
  let previous = 0;

  const now = weather.phase;
  for (let i = 0; i < FIELD_SIZE; i++) {
    const u = i / (FIELD_SIZE - 1);
    // Inverse of the shader's `u = 0.5 - lag / (2·halfSpan)`, which gives
    // `lag = (0.5 − u)·2·halfSpan` and therefore this. Worth deriving rather
    // than eyeballing: the two are trivially easy to get the wrong way round,
    // and inverted they still produce a perfectly plausible travelling gust —
    // one moving *upwind*, which nobody would catch by looking.
    //
    // So u = 0 is the far downwind edge and holds an older gust, and u = 1 is
    // upwind and holds one that has not arrived yet. The field is a pure
    // function of phase, so the future is exactly as computable as the past.
    const phase = now + (u - 0.5) * 2 * halfSpan;
    const strength = weather.fieldAt(phase);
    texels[i] = Math.round(strength * 255);
    // Trapezoid, accumulated from the downwind edge — so the table holds the
    // integral *up to* each phase and a particle's drift is the difference
    // between two of them. The zero point slides with the window every frame,
    // which is harmless: nothing ever compares two frames' tables.
    if (i > 0) sum += ((previous + strength) / 2) * step;
    previous = strength;
    sums[i] = sum;
  }
  field.needsUpdate = true;
  integral.needsUpdate = true;
}
