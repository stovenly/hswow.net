import * as THREE from 'three';
import { FIELD_ATTRIBUTE, BRANCH_REACH, SUB_REACH } from './fields';
import { ART_MATERIAL } from './material';
import { applyWear } from './weathering';
import { applyDetail } from './detail';
import { applyAerialFog } from '../engine/fog';
import { applyFinish } from './finish';
import { applyGlitch, applyGlitchDisplacement, glitchVariant } from './glitch';
import { applyHorror, applyHorrorDisplacement, horrorVariant } from './horror';
import { valueNoise, type Weather } from '../audio/weather';

/**
 * The world moving on its own. A gust travels: the field is sampled at a phase
 * offset by how far downwind a point stands, which makes it a front rather than
 * a switch. The CPU owns the field and ships the answer in a one-dimensional
 * byte lookup texture, rebuilt each frame from `Weather.fieldAt` — so the gust
 * that bends a tree is the gust that quickens its rustle, by construction. What
 * bends by how much is `art/flex.ts`, applied to the sway weights when a builder
 * finishes; a uniform would mean a material per species.
 */

/** Texels across the lookup window. 256 over ~25 s is a sample every 100 ms. */
const FIELD_SIZE = 256;

/** Half-width of the sampled window, in metres along the wind. Comfortably past the largest zone; the cost of being generous is only resolution. */
const WORLD_REACH = 140;

/**
 * How far a vertex leans downwind at full strength, as a fraction of its own
 * height above the ground. The authored sway weight is normalised to each
 * plant's own height, so a displacement measured in metres would move a daisy
 * and an oak the same absolute distance. Object-space height, so a builder's
 * `scale` carries through for free.
 */
export const BEND = 0.16;

/**
 * The levers as damped oscillators, integrated on the CPU against the wind
 * and shipped as rows of `gustResponse`. Nothing moves but by the wind
 * changing; what changes it at a limb's own pace is the turbulence riding
 * the gust, whose strength is a fraction of the wind's. Natural frequencies
 * in hertz; the damping is enough that a lever never rings on after the
 * wind that moved it has passed.
 */
export const TRUNK_HZ = 0.35;
export const TRUNK_DAMPING = 0.35;
export const LIMB_HZ = 0.5;
export const LIMB_DAMPING = 0.3;
export const SUB_HZ = 0.9;
export const SUB_DAMPING = 0.35;
/** The lean row: the wind smoothed over seconds, the level the limbs swing about. */
const LEAN_HZ = 0.12;
/** Turbulence as a fraction of the wind, and the seconds a cell of each octave spans with its weight. */
const TURBULENCE = 0.35;
const EDDIES: readonly (readonly [number, number])[] = [
  [2.0, 0.5],
  [0.8, 0.35],
  [0.35, 0.15],
];
/** Frequency spread across a level's variant rows, so no two limbs ring alike. */
const SPREAD = [0.8, 1.35] as const;
/** Texels across the response window: with eddies of a third of a second in it, one every 30 ms. */
const RESPONSE_SIZE = 1024;
/** Rows of `gustResponse`: the lean, then the trunk's, the limbs' and the sub-limbs' variants. */
const LEAN_ROW = 0;
const TRUNK_ROWS = 4;
const LIMB_ROWS = 8;
const TRUNK_ROW = 1;
const LIMB_ROW = TRUNK_ROW + TRUNK_ROWS;
const SUB_ROW = LIMB_ROW + LIMB_ROWS;
const RESPONSE_ROWS = SUB_ROW + LIMB_ROWS;
/** A response is stored over this range in a byte: turbulence and overshoot carry it past one. */
const RESPONSE_SCALE = 2.5;
/** Seconds a limb's variant may trail the front by, per step of its phase code. */
const TRAIL = 0.12;
/** A limb's vertical bob as a fraction of its lag behind the lean: a bough dips as the gust takes it and lifts as it lets go. */
export const LIMB_BOB = 0.6;
export const SUB_BOB = 0.5;
/** Every crown's boughs against every trunk's lean. `FLEX` scales the lean and the leaf rock but never reaches the branch lane, so this is the one dial over a tree's own motion; nothing without limbs has a branch lane, so groundcover cannot see it. */
export const CROWN_GAIN = 1.5;

/**
 * The wind, for any vertex shader that moves a plant: the gust at a world
 * point, the wind turned into object space, and the three motions — trunk,
 * limbs, and what the canopy adds for itself. Declared once so the kit's
 * wood and its crown cannot disagree about where a branch is.
 *
 * A trunk leans downwind and swings slowly about that lean at its own pace,
 * quadratically in height, and only by the authored weight. A limb swings
 * about its own base by its distance from it, at its own phase, and bobs on
 * the same wind a beat behind; a sub-limb does the same again, faster and
 * smaller, so the crown is many levers out of step rather than one mass.
 * No backticks in here: it is spliced into template literals.
 */
export const WIND_GLSL = /* glsl */ `
  uniform sampler2D gustField;
  uniform sampler2D gustResponse;
  uniform vec2 windDir;
  uniform float windLagScale;
  uniform float windHalfSpan;
  uniform float windAgeScale;
  uniform float windBuiltAt;
  uniform float swayTime;
  uniform float swayAmount;

  // Per-instance offset, so two plants the same distance downwind do not move in lockstep.
  float swayHash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  // Where a world point reads in the gust window: upwind ahead of now, downwind
  // behind, and the window slid on by the time since it was built, so the wind
  // moves every frame and not only when the table does.
  float gustU(vec3 worldAt) {
    float lag = dot(worldAt.xz, windDir) * windLagScale;
    return clamp(0.5 - lag / (2.0 * windHalfSpan) + (swayTime - windBuiltAt) * windAgeScale, 0.0, 1.0);
  }
  // One lever's response to the wind at that point, from its row.
  float gustRow(float u, float row) {
    return texture2D(gustResponse, vec2(u, (row + 0.5) / ${RESPONSE_ROWS}.0)).r * ${RESPONSE_SCALE.toFixed(1)};
  }
  // The wind in an object's space, for a model matrix of one yaw and one scale:
  // the transpose over the scale squared, so a metre of world travel is a metre.
  vec3 windIn(mat4 m) {
    vec3 c0 = m[0].xyz;
    vec3 c1 = m[1].xyz;
    vec3 c2 = m[2].xyz;
    float scaleSq = max(dot(c0, c0), 0.0001);
    vec3 windWorld = vec3(windDir.x, 0.0, windDir.y);
    return vec3(dot(c0, windWorld), dot(c1, windWorld), dot(c2, windWorld)) / scaleSq;
  }
  // The trunk: its own response along the wind. Height is a factor because the weight is relative to each plant's own height.
  vec3 windTrunk(float weight, float y, float u, float hash, vec3 windObj) {
    float trunk = gustRow(u, ${TRUNK_ROW}.0 + floor(hash * ${TRUNK_ROWS}.0));
    return windObj * (weight * max(y, 0.0) * trunk * ${BEND.toFixed(3)});
  }
  // The limbs, from the branch lane as fields.ts packs it: travel 7 bits, phase 5, sub travel 7, sub phase 5.
  // A phase code picks the lever's variant row and how far it trails the front.
  vec3 windLimbs(float packed, float u, vec3 windObj, float amount) {
    if (packed < 0.5) return vec3(0.0);
    float a1 = floor(packed / 131072.0);
    packed -= a1 * 131072.0;
    float p1 = floor(packed / 4096.0);
    packed -= p1 * 4096.0;
    float a2 = floor(packed / 32.0);
    float p2 = packed - a2 * 32.0;
    a1 *= ${(BRANCH_REACH / 127).toFixed(6)};
    a2 *= ${(SUB_REACH / 127).toFixed(6)};
    float lean = gustRow(u, ${LEAN_ROW}.0);
    float r1 = gustRow(u - floor(p1 / ${LIMB_ROWS}.0) * ${TRAIL.toFixed(2)} * windAgeScale, ${LIMB_ROW}.0 + mod(p1, ${LIMB_ROWS}.0));
    float r2 = gustRow(u - floor(p2 / ${LIMB_ROWS}.0) * ${TRAIL.toFixed(2)} * windAgeScale, ${SUB_ROW}.0 + mod(p2, ${LIMB_ROWS}.0));
    // Buffeting grows faster than the wind: the response is scaled by the root of the wind it swings about.
    float gain = sqrt(max(lean, 0.0)) * amount * ${CROWN_GAIN.toFixed(2)};
    vec3 up = vec3(0.0, 1.0, 0.0);
    return gain * (a1 * (windObj * r1 + up * ((r1 - lean) * ${LIMB_BOB.toFixed(2)})) + a2 * (windObj * r2 + up * ((r2 - lean) * ${SUB_BOB.toFixed(2)})));
  }
`;

export interface WindUniforms {
  gustField: { value: THREE.DataTexture };
  /**
   * The running integral of the same field, in strength-seconds — what an
   * unanchored thing needs: a plant answers the wind now, a snowflake keeps
   * everything the wind has already given it. Float, because a running sum
   * quantised to a byte comes out as a staircase of two or three drifts; sampled
   * `NearestFilter` and interpolated by hand, since linear filtering of a float
   * texture is an extension.
   */
  gustIntegral: { value: THREE.DataTexture };
  /** The levers' responses to the same field, a row each; see `WIND_GLSL`. */
  gustResponse: { value: THREE.DataTexture };
  windDir: { value: THREE.Vector2 };
  /** Metres per gust-time unit along the wind. Converts world position to phase. */
  windLagScale: { value: number };
  /** Half the lookup window, in the same units as the lag. */
  windHalfSpan: { value: number };
  /** Seconds of age → texture coordinate, for reaching back into the integral. */
  windAgeScale: { value: number };
  /** `swayTime` when the window was last built; the shader slides the window on from there. */
  windBuiltAt: { value: number };
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

const response = new THREE.DataTexture(
  new Uint8Array(RESPONSE_SIZE * RESPONSE_ROWS),
  RESPONSE_SIZE,
  RESPONSE_ROWS,
  THREE.RedFormat,
  THREE.UnsignedByteType,
);
response.minFilter = THREE.LinearFilter;
response.magFilter = THREE.LinearFilter;
response.wrapS = THREE.ClampToEdgeWrapping;
response.wrapT = THREE.ClampToEdgeWrapping;
response.needsUpdate = true;

export const windUniforms: WindUniforms = {
  gustField: { value: field },
  gustIntegral: { value: integral },
  gustResponse: { value: response },
  windDir: { value: new THREE.Vector2(1, 0) },
  windLagScale: { value: 0 },
  windHalfSpan: { value: 1 },
  windAgeScale: { value: 0 },
  windBuiltAt: { value: 0 },
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
 * The depth material the shadow map is drawn with, displaced to match. A vertex
 * shader that moves geometry has to move it twice: three draws the shadow pass
 * with its own `MeshDepthMaterial`, so an unpatched plant casts a perfectly
 * still shadow of where it is not. `RGBADepthPacking` is what the renderer
 * expects from a `customDepthMaterial` on a non-cube light.
 */
export const SWAY_DEPTH_MATERIAL = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
});

let patched = false;

/** Patches the one shared art material to displace vertices. Idempotent, and called once at boot; only what the art kit builds picks it up. */
export function patchArtMaterial(): void {
  if (patched) return;
  patched = true;

  // Both, and with the same code: the surface material decides what you see, the
  // depth material what the sun sees. `MeshDepthMaterial`'s vertex shader carries
  // the same two include points, so one patch serves both.
  const patch = (shader: { vertexShader: string; uniforms: Record<string, unknown> }): void => {
    Object.assign(shader.uniforms, windUniforms);

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        // Declared here for the whole chain: .x sway, .y wear, .z detail, .w branch.
        attribute vec4 ${FIELD_ATTRIBUTE};
        ${WIND_GLSL}
        `,
      )
      .replace(
        '#include <begin_vertex>',
        /* glsl */ `#include <begin_vertex>
        {
          float weight = ${FIELD_ATTRIBUTE}.x * swayAmount;
          float packed = ${FIELD_ATTRIBUTE}.w;
          if (weight > 0.0001 || packed > 0.5) {
            vec3 worldAt = (modelMatrix * vec4(transformed, 1.0)).xyz;
            float u = gustU(worldAt);
            vec3 windObj = windIn(modelMatrix);
            float hash = swayHash(floor(modelMatrix[3].xz * 4.0));
            float tall = transformed.y;
            transformed += windTrunk(weight, tall, u, hash, windObj);
            transformed += windLimbs(packed, u, windObj, swayAmount);
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
  // surface is. Mask 0: the lean material carries only the base finish, and
  // anything that declared more takes a variant from `artMaterialFor`.
  applyFinish(ART_MATERIAL, 0);
  // And the glitch stage wraps after even that: it corrupts the lit result,
  // finish and all, which is what makes it read as the signal going bad rather
  // than the material changing. The depth material takes the displacement half
  // too, since shadows re-render every frame.
  applyGlitch(ART_MATERIAL);
  applyGlitchDisplacement(SWAY_DEPTH_MATERIAL);
  // Horror wraps outermost, and lands *before* glitch in the compiled shader:
  // the body goes wrong first, then the signal of it corrupts on top. Depth
  // gets the displacement half for the same live-shadow reason as glitch.
  applyHorror(ART_MATERIAL);
  applyHorrorDisplacement(SWAY_DEPTH_MATERIAL);

  // The air, outermost of all. It is the last thing that happens to a
  // fragment: everything else is what the surface is, and this is what is between
  // you and it. Ground cover and weather do the same for themselves where they
  // are declared — importing them here would close a cycle, since both read the
  // wind out of this module.
  applyAerialFog(ART_MATERIAL);

  // The volume variants ride in the key: each stage is compiled out where the
  // zone has none of it, and the programs must not be confused for each other.
  ART_MATERIAL.customProgramCacheKey = () => `art:0:${glitchVariant()}:${horrorVariant()}`;
}

/** The compiled variants, by finish mask. Mask 0 is the lean shared material. */
const variants = new Map<number, THREE.Material>();

/** The art material carrying exactly the finish chunks `mask` names. Built on first request, kept for the session. */
export function artMaterialFor(mask: number): THREE.Material {
  if (mask === 0) return ART_MATERIAL;
  const held = variants.get(mask);
  if (held) return held;

  const material = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  applySway(material);
  applyWear(material);
  applyDetail(material);
  applyFinish(material, mask);
  applyGlitch(material);
  applyHorror(material);
  applyAerialFog(material);
  // After the chain: each stage sets its own constant key and the last wins.
  material.customProgramCacheKey = () => `art:${mask}:${glitchVariant()}:${horrorVariant()}`;
  variants.set(mask, material);
  return material;
}

/** Puts a mesh in the art material its mask names. Stamped so the compile warmers can read it. */
export function dressArtMesh(mesh: THREE.Mesh, mask: number): void {
  mesh.material = artMaterialFor(mask);
  if (mask !== 0) mesh.userData.finishMask = mask;
}

/** Set by `patchArtMaterial`. Held so late arrivals can be patched too. */
let swayPatch: ((shader: { vertexShader: string; uniforms: Record<string, unknown> }) => void) | null =
  null;

/**
 * Makes one more material displace vertices the same way the kit does. Anything
 * that draws the scene has to agree about where the scene is: the surface
 * material, the depth material the sun sees, and the `MeshNormalMaterial` the
 * edge detector's normal buffer is built with — an outline traced around
 * undisplaced geometry is a motionless wireframe of a plant's former shape.
 * Safe on non-kit geometry: a missing attribute reads as zero, so the terrain
 * and the floor get a sway weight of zero.
 */
export function applySway(material: THREE.Material): void {
  if (!swayPatch) return;
  material.onBeforeCompile = swayPatch;

  // What a missing attribute reads as, stated rather than assumed. When a
  // geometry does not supply an attribute the shader declares, WebGL falls back
  // to a generic value that persists across draw calls — so without this the
  // weight would be whatever the last mesh left in that slot, and the ground
  // would ripple occasionally and unreproducibly. Zero means rigid.
  (material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
    ...(material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues,
    [FIELD_ATTRIBUTE]: [0, 0, 0, 0],
  };

  // Three caches compiled programs by a key that knows nothing about an
  // `onBeforeCompile`, so two materials differing only in their patch can be
  // handed each other's program.
  material.customProgramCacheKey = () => 'sway';
  material.needsUpdate = true;
}

const texels = field.image.data as Uint8Array;
const sums = integral.image.data as unknown as Float32Array;
const responses = response.image.data as Uint8Array;

/**
 * How often the lookup window is rebuilt, in seconds. At the authored gust rate
 * a frame advances the window by 0.14 of a texel, so twelve times a second is
 * the same picture. The uniforms below still move every frame: `swayTime` is the
 * clock the finish and glitch stages read.
 */
const WIND_INTERVAL = 1 / 12;

/** When the window was last rebuilt, on `updateWind`'s own clock. */
let windRebuilt = -Infinity;

/** Seconds the levers are run in from rest before the window opens, so what it holds has settled. */
const SETTLE = 8;

/** Every lever's frequency in radians per second and its damping ratio, by row. */
const LEVERS: { omega: number; zeta: number }[] = [];
LEVERS[LEAN_ROW] = { omega: LEAN_HZ * Math.PI * 2, zeta: 1 };
const spread = (rows: number, hz: number, zeta: number, first: number): void => {
  for (let i = 0; i < rows; i++) {
    const f = SPREAD[0] + ((SPREAD[1] - SPREAD[0]) * (i + 0.5)) / rows;
    LEVERS[first + i] = { omega: hz * f * Math.PI * 2, zeta };
  }
};
spread(TRUNK_ROWS, TRUNK_HZ, TRUNK_DAMPING, TRUNK_ROW);
spread(LIMB_ROWS, LIMB_HZ, LIMB_DAMPING, LIMB_ROW);
spread(LIMB_ROWS, SUB_HZ, SUB_DAMPING, SUB_ROW);

/** The drive across the settle-in and the window, one sample a step. Reused between rebuilds. */
let drive = new Float32Array(0);

/**
 * The wind at a moment: the gust field, and on it the eddies the field is too
 * coarse to hold, at a fraction of the wind so still air is still and a gale
 * is rough. In absolute seconds, so a point downwind meets the same eddy later.
 */
function windAt(field: number, seconds: number): number {
  let eddy = 0;
  for (let i = 0; i < EDDIES.length; i++) eddy += (valueNoise(seconds / EDDIES[i][0] + i * 37.1) - 0.5) * 2 * EDDIES[i][1];
  return field * (1 + TURBULENCE * eddy);
}

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
  // Seconds of age into a step along the window. A rate of zero is a still world
  // with an integral that never advances, which is exactly right for one.
  windUniforms.windAgeScale.value = gustRate / (2 * halfSpan || 1);

  if (elapsed - windRebuilt < WIND_INTERVAL) return;
  windRebuilt = elapsed;
  windUniforms.windBuiltAt.value = elapsed;

  // Seconds between neighbouring texels, for the integral below. The window is
  // `2·halfSpan` of gust-time wide, and `gustRate` is gust-time per second.
  const step = (2 * halfSpan) / (FIELD_SIZE - 1) / Math.max(gustRate, 1e-6);
  let sum = 0;
  let previous = 0;

  const now = weather.phase;
  for (let i = 0; i < FIELD_SIZE; i++) {
    const u = i / (FIELD_SIZE - 1);
    // Inverse of the shader's u = 0.5 - lag / (2*halfSpan). Worth deriving rather
    // than eyeballing: the two are easy to get the wrong way round, and inverted
    // they still produce a plausible travelling gust — one moving upwind. So
    // u = 0 is the far downwind edge and holds an older gust, and u = 1 is upwind
    // and holds one that has not arrived yet.
    const phase = now + (u - 0.5) * 2 * halfSpan;
    const strength = weather.fieldAt(phase);
    texels[i] = Math.round(strength * 255);
    // Trapezoid, accumulated from the downwind edge, so the table holds the
    // integral up to each phase and a particle's drift is the difference between
    // two of them. The zero point slides with the window, harmlessly: nothing
    // ever compares two frames' tables.
    if (i > 0) sum += ((previous + strength) / 2) * step;
    previous = strength;
    sums[i] = sum;
  }

  // The levers: the window in seconds is 2·WORLD_REACH / frontSpeed whatever the
  // gust rate, so the drive is sampled on that clock from `SETTLE` seconds before
  // the downwind edge, and each oscillator is stepped through it from rest.
  const window = (2 * WORLD_REACH) / Math.max(frontSpeed, 0.5);
  const ds = window / (RESPONSE_SIZE - 1);
  const settleSteps = Math.ceil(SETTLE / ds);
  const steps = settleSteps + RESPONSE_SIZE;
  if (drive.length !== steps) drive = new Float32Array(steps);
  for (let j = 0; j < steps; j++) {
    const seconds = (j - settleSteps) * ds - window / 2;
    drive[j] = windAt(weather.fieldAt(now + seconds * gustRate), elapsed + seconds);
  }
  for (let row = 0; row < RESPONSE_ROWS; row++) {
    const { omega, zeta } = LEVERS[row];
    let x = drive[0];
    let v = 0;
    for (let j = 0; j < steps; j++) {
      v += ds * (omega * omega * (drive[j] - x) - 2 * zeta * omega * v);
      x += ds * v;
      const k = j - settleSteps;
      if (k >= 0) responses[row * RESPONSE_SIZE + k] = Math.round(Math.min(1, Math.max(0, x / RESPONSE_SCALE)) * 255);
    }
  }
  response.needsUpdate = true;
  field.needsUpdate = true;
  integral.needsUpdate = true;
}
