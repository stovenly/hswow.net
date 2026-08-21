/**
 * Global weather: one wind, felt by everything. Speed and direction are world
 * parameters rather than per-emitter ones, so the trees rustle when the wind
 * actually gusts — a foliage emitter with its own private randomness sounds
 * like a separate machine making leaf noises, however good the synthesis is.
 *
 * The gust signal is smooth 1-D value noise, not an LFO. An LFO reads as
 * periodic inside about thirty seconds and cannot be unheard once it does;
 * layered value noise never repeats at any scale a player will sit through.
 */

/**
 * Octave weights for the gust field. Weighted hard toward the slowest layer
 * rather than the usual halving: equal octaves give a field busy at every
 * scale at once — constant fidget, no shape — and summing several also pulls
 * the distribution into a tight clump around the mean. One dominant slow layer
 * with detail on top is what gusting sounds like.
 */
const OCTAVE_AMPLITUDES = [1, 0.4, 0.2, 0.1];
const OCTAVE_FREQUENCIES = [1, 2.7, 6.1, 13.3];

/**
 * How much slower the swell runs than the gusting. This is the ebb and flow: a
 * very slow field moving the baseline up and down over minutes, so there are
 * long calm stretches and long blustery ones rather than a permanent medium
 * breeze with bumps in it. One swell takes something over three minutes.
 */
const SWELL_RATIO = 0.11;

/**
 * Integer mix rather than the usual `fract(sin(n) * large)`. The sine trick has
 * structure in it — banding in graphics, and here slow correlations that would
 * put a period back into a signal whose whole purpose is not having one.
 */
export function hash(n: number): number {
  let x = Math.imul(n | 0, 0x27d4eb2d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  return (x >>> 0) / 4294967296;
}

/** Cosine-interpolated value noise: continuous in value and in slope. */
export function valueNoise(t: number): number {
  const i = Math.floor(t);
  const f = t - i;
  const blend = (1 - Math.cos(f * Math.PI)) * 0.5;
  return hash(i) * (1 - blend) + hash(i + 1) * blend;
}

/**
 * Expansion applied to the summed octaves. Adding several independent random
 * octaves clusters the distribution hard around its mean, so the raw field
 * varies across its full range and audibly never leaves the middle of it —
 * and the wind's whistle layer, which scales as the cube of strength, would
 * never trigger.
 *
 * Expanding and clamping costs the very extremes, which become brief plateaus.
 * A sustained lull and a gust that holds are both things weather does.
 */
const CONTRAST = 1.35;

function fbm(t: number): number {
  let sum = 0;
  let total = 0;
  for (let i = 0; i < OCTAVE_AMPLITUDES.length; i++) {
    sum += valueNoise(t * OCTAVE_FREQUENCIES[i] + i * 17.3) * OCTAVE_AMPLITUDES[i];
    total += OCTAVE_AMPLITUDES[i];
  }
  const raw = sum / total;
  return Math.min(1, Math.max(0, 0.5 + (raw - 0.5) * CONTRAST));
}

export interface WeatherSettings {
  /** Baseline wind, 0..1. Sets how loud and how bright the whole system sits. */
  windSpeed: number;
  /** How much the gusts swing away from the baseline, 0..1. */
  gustDepth: number;
  /** Gust cycles per second. Well under 1 — these are swells, not tremolo. */
  gustRate: number;
  /** Compass direction the wind comes from, radians. Used for panning bias. */
  windDirection: number;
  /**
   * How fast a gust travels across the world, in metres per second — what makes
   * the wind a front rather than a switch. Without it every tree in a valley
   * starts moving on the same frame, which reads as a global parameter being
   * turned, because that is what it is.
   *
   * With it, the same gust reaches each point later the further downwind it
   * stands. At 9 m/s a gust takes about eleven seconds to cross Arkstin's
   * bowl: slow enough to see coming, fast enough not to read as a wave.
   */
  frontSpeed: number;
}

export const DEFAULT_WEATHER: WeatherSettings = {
  windSpeed: 0.5,
  // Wide on purpose. Layered value noise clusters around its mean, so a modest
  // depth gives a wind that technically varies and audibly does not — and the
  // whistle scales as the cube of strength, so a signal that never gets past
  // 0.6 never triggers it at all.
  gustDepth: 0.6,
  gustRate: 0.06,
  windDirection: 2.1,
  frontSpeed: 9,
};

export class Weather {
  readonly settings: WeatherSettings = { ...DEFAULT_WEATHER };

  /** Current gust strength, 0..1. Read by every model that cares about wind. */
  gust = 0;
  /** The slow swell, 0..1 — which way the weather is leaning over minutes. */
  swell = 0.5;
  /** Wind speed including swell and gust, 0..1. What most models actually use. */
  strength = 0;

  private time = 0;

  update(dt: number): void {
    this.time += dt * this.settings.gustRate;
    this.gust = fbm(this.time);
    this.swell = valueNoise(this.time * SWELL_RATIO + 91.7);
    this.strength = this.fieldAt(this.time);
  }

  /**
   * The field itself: strength at a point in gust-time, and a pure function of
   * its argument. It is evaluated three ways — here for the global reading, per
   * emitter for the audio, and per vertex on the GPU through a lookup table
   * sampled from this method — and because it depends on nothing but the phase
   * handed to it, all three agree exactly.
   */
  fieldAt(phase: number): number {
    const { windSpeed, gustDepth } = this.settings;
    const gust = fbm(phase);
    const swell = valueNoise(phase * SWELL_RATIO + 91.7);
    // Three scales stacked: the setting is the climate, the swell is the hour,
    // the gust is the moment. Without the middle one the wind has no shape over
    // any span longer than about ten seconds.
    const baseline = windSpeed * (0.45 + swell * 1.1);
    return Math.min(1, Math.max(0, baseline + (gust - 0.5) * gustDepth));
  }

  /**
   * How far behind the leading edge a point in the world is, in gust-time.
   *
   * A gust travels along the wind, so somewhere downwind meets it later. The
   * lag is the distance measured *along* the wind divided by how fast the front
   * moves, and the projection is what makes it a front: everything on the same
   * line across the wind receives it together. Upwind points give a negative
   * lag, which is fine — the field is defined for any phase.
   *
   * `gustRate` converts seconds into the units `time` counts in.
   */
  lagAt(x: number, z: number): number {
    const { windDirection, frontSpeed, gustRate } = this.settings;
    const along = x * Math.cos(windDirection) + z * Math.sin(windDirection);
    return (along / Math.max(frontSpeed, 0.5)) * gustRate;
  }

  /**
   * Wind strength where something actually stands — what every emitter should
   * use instead of `strength`. The far treeline quickens before the near hedge,
   * in the order you watch the same gust cross them.
   */
  strengthAt(x: number, z: number): number {
    return this.fieldAt(this.time - this.lagAt(x, z));
  }

  /** Gust-time now. For the sway shader's lookup window. */
  get phase(): number {
    return this.time;
  }
}
