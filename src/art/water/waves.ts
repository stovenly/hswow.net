import { G, GAMMA, type WaterField } from './field';

// The wave function, written once for two languages. `seaLift` is the CPU
// twin of `TRAIN_GLSL`'s vertex stage: the same constants, the same steps, in
// the same order. A change to one is a change to both.

/** The crossed chop trains every body carries: wavelengths (m), amplitudes (m), deep-water celerity (m/s). */
export const CHOP_LONG = 4.3;
export const CHOP_SHORT = 2.6;
export const K_LONG = (2 * Math.PI) / CHOP_LONG;
export const K_SHORT = (2 * Math.PI) / CHOP_SHORT;
export const C_LONG = Math.sqrt(G / K_LONG);
export const C_SHORT = Math.sqrt(G / K_SHORT);
export const AMP_LONG = 0.035;
export const AMP_SHORT = 0.02;
/** Shortest wavenumber the shore train reaches, rad/m: a 3 m wave. */
export const K_CAP = 2.1;

export interface Swell {
  /** The way it travels, world xz. */
  direction: readonly [number, number];
  /** Wavelength, metres. */
  length: number;
  /** Crest to trough, metres. */
  height: number;
}

export interface SwellState {
  dx: number;
  dz: number;
  k0: number;
  /** Amplitude: half the authored height. */
  amp: number;
  omega: number;
  /** Metres the surface runs up the sand per metre of amplitude. */
  runup: number;
}

export function swellState(swell: Swell | undefined, runup = 1.4): SwellState {
  if (!swell) return { dx: 0, dz: -1, k0: (2 * Math.PI) / 30, amp: 0, omega: Math.sqrt((G * 2 * Math.PI) / 30), runup };
  const len = Math.hypot(swell.direction[0], swell.direction[1]) || 1;
  const k0 = (2 * Math.PI) / swell.length;
  return {
    dx: swell.direction[0] / len,
    dz: swell.direction[1] / len,
    k0,
    amp: swell.height / 2,
    omega: Math.sqrt(G * k0),
    runup,
  };
}

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** Wavenumber at a column, as the shader approximates it: Eckart's estimate, clamped. */
function wavenumberAt(h: number, k0: number): number {
  return h > 0 ? Math.min(Math.max(k0 / Math.sqrt(Math.max(Math.tanh(k0 * h), 1e-4)), k0), K_CAP) : K_CAP;
}

/**
 * The sea's surface height above its level at a point, metres. Chop as well as
 * swell, so a hull rides everything the eye sees. `time` is `swayTime`.
 */
export function seaLift(
  field: WaterField,
  swell: SwellState,
  x: number,
  z: number,
  time: number,
  waveScale: number,
  motion: number,
  chop: number,
  windX: number,
  windZ: number,
): number {
  const h = field.sample(field.column, x, z);
  const phase0 = field.sample(field.phase, x, z);
  const calm = field.sample(field.calm, x, z);
  const a0 = swell.amp * waveScale * motion * calm;
  const k = wavenumberAt(h, swell.k0);
  const kh = Math.min(10, Math.max(1e-3, k * Math.max(h, 0)));
  const shoal = h > 0 ? Math.sqrt(k / swell.k0 / (1 + (2 * kh) / Math.sinh(2 * kh))) : 0;
  const cap = (GAMMA / 2) * Math.max(h, 0);
  const raw = a0 * shoal;
  const b = a0 > 0 ? (h > 0 ? Math.min(1, Math.max(0, raw / Math.max(cap, 1e-4))) : 1) : 0;
  const a = Math.min(raw, cap);
  const phi = phase0 - swell.omega * time * motion;
  const lean = 0.5 * b;
  const phis = phi + lean * (1 - Math.cos(phi));
  let lift = a * Math.cos(phis);

  const carry = smoothstep(0.3, 2.0, h) * chop * waveScale * motion * calm;
  const wl = Math.hypot(windX, windZ) || 1;
  const d1x = windX / wl;
  const d1z = windZ / wl;
  const d2x = d1x * 0.62 - d1z * 0.78;
  const d2z = d1x * 0.78 + d1z * 0.62;
  const t = time * motion;
  const p1 = (x * d1x + z * d1z - t * C_LONG) * K_LONG;
  const p2 = (x * d2x + z * d2z - t * C_SHORT) * K_SHORT;
  lift += AMP_LONG * carry * Math.sin(p1) + AMP_SHORT * carry * Math.sin(p2);
  return lift;
}

/**
 * Shared by both shader stages: the field lookup and the shore train it drives.
 * `fieldA` is column, bank, dir, stand; `fieldB` is flow x, flow z, phase, calm.
 */
export const TRAIN_GLSL = /* glsl */ `
  uniform sampler2D tFieldA;
  uniform sampler2D tFieldB;
  uniform vec2 uFieldMin;
  uniform vec2 uFieldSize;
  uniform float uLevel;
  // The swell: travel direction (xz), deep-water wavenumber, amplitude.
  uniform vec4 uSwell;
  uniform float uOmega;
  uniform float swayTime;
  uniform float uWaterMotion;
  uniform float uWaveScale;
  uniform float uRunup;
  uniform float uChop;
  uniform vec2 windDir;

  vec2 fieldUv(vec2 p) {
    return (p - uFieldMin) / uFieldSize;
  }
  bool inField(vec2 p) {
    vec2 uv = fieldUv(p);
    return all(greaterThanEqual(uv, vec2(0.0))) && all(lessThanEqual(uv, vec2(1.0)));
  }
  // Outside the field: deep open water, no bank, the swell's own plane wave.
  vec4 fieldA(vec2 p) {
    if (!inField(p)) return vec4(30.0, 60.0, atan(uSwell.y, uSwell.x), 50.0);
    return texture2D(tFieldA, fieldUv(p));
  }
  vec4 fieldB(vec2 p) {
    if (!inField(p)) return vec4(0.0, 0.0, uSwell.z * dot(p, uSwell.xy), 1.0);
    return texture2D(tFieldB, fieldUv(p));
  }

  float wavenumberAt(float h) {
    float k0 = uSwell.z;
    return h > 0.0 ? clamp(k0 / sqrt(max(tanh(k0 * h), 1e-4)), k0, ${K_CAP.toFixed(1)}) : ${K_CAP.toFixed(1)};
  }

  // Green's law up the bed, capped by McCowan: b is the breaking ratio, 1 at
  // and past the break point and on the land.
  void trainAt(float h, float phase0, float a0, out float a, out float b, out float k, out float phi) {
    k = wavenumberAt(h);
    float kh = clamp(k * max(h, 0.0), 1e-3, 10.0);
    float shoal = h > 0.0 ? sqrt((k / uSwell.z) / (1.0 + 2.0 * kh / sinh(2.0 * kh))) : 0.0;
    float cap = ${(GAMMA / 2).toFixed(2)} * max(h, 0.0);
    float raw = a0 * shoal;
    b = a0 > 0.0 ? (h > 0.0 ? clamp(raw / max(cap, 1e-4), 0.0, 1.0) : 1.0) : 0.0;
    a = min(raw, cap);
    phi = phase0 - uOmega * swayTime * uWaterMotion;
  }

  float swellAmplitude(float calm) {
    return uSwell.w * uWaveScale * uWaterMotion * calm;
  }

  // How long ago the crest passed, in periods, and how far the surface is
  // pushed up the sand by it: fast up, slow to drain.
  float sinceCrest(float phi) {
    return fract(-phi * 0.15915494);
  }
  float surgeAt(float since) {
    return smoothstep(0.0, 0.3, since) * (1.0 - smoothstep(0.3, 1.0, since));
  }

  // The crossed chop, the same two trains on every body. windDir is the way the
  // wind blows; the trains travel with it.
  void chopAt(vec2 p, float carry, out float lift, out vec2 slope) {
    vec2 d1 = normalize(windDir + vec2(1e-4, 0.0));
    vec2 d2 = vec2(d1.x * 0.62 - d1.y * 0.78, d1.x * 0.78 + d1.y * 0.62);
    float t = swayTime * uWaterMotion;
    float p1 = (dot(p, d1) - t * ${C_LONG.toFixed(4)}) * ${K_LONG.toFixed(5)};
    float p2 = (dot(p, d2) - t * ${C_SHORT.toFixed(4)}) * ${K_SHORT.toFixed(5)};
    float a1 = ${AMP_LONG.toFixed(3)} * carry;
    float a2 = ${AMP_SHORT.toFixed(3)} * carry;
    lift = a1 * sin(p1) + a2 * sin(p2);
    slope = d1 * (a1 * ${K_LONG.toFixed(5)} * cos(p1)) + d2 * (a2 * ${K_SHORT.toFixed(5)} * cos(p2));
  }
`;
