/**
 * Global weather: one wind, felt by everything.
 *
 * Wind speed and direction are world parameters rather than per-emitter ones,
 * so the trees rustle when the wind actually gusts. Coherence is the whole
 * point — a foliage emitter with its own private randomness sounds like a
 * separate machine making leaf noises, however good the grain synthesis is.
 *
 * The gust signal is smooth 1-D value noise, not an LFO. An LFO reads as
 * periodic inside about thirty seconds, and once heard it cannot be unheard;
 * layered value noise never repeats at any scale a player will sit through.
 */

/**
 * Octave weights for the gust field.
 *
 * Weighted hard toward the slowest layer rather than the usual halving. Equal
 * octaves give a field that is busy at every scale at once — constant fidget,
 * no shape — and summing several of them also pulls the distribution into a
 * tight clump around the mean. One dominant slow layer with detail sprinkled
 * on top is what gusting actually sounds like: a long push with texture in it.
 */
const OCTAVE_AMPLITUDES = [1, 0.4, 0.2, 0.1];
const OCTAVE_FREQUENCIES = [1, 2.7, 6.1, 13.3];

/**
 * How much slower the swell runs than the gusting.
 *
 * This is the ebb and flow: a separate, very slow field that moves the
 * baseline wind up and down over minutes, so there are long calm stretches and
 * long blustery ones rather than a permanent medium breeze with bumps in it.
 * At the default gust rate one swell takes something over three minutes.
 */
const SWELL_RATIO = 0.11;

/**
 * Integer mix rather than the usual `fract(sin(n) * large)`. The sine trick
 * has structure in it — visible as banding in graphics, and here as slow
 * correlations that would put a period back into a signal whose whole purpose
 * is not having one.
 */
function hash(n: number): number {
  let x = Math.imul(n | 0, 0x27d4eb2d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  return (x >>> 0) / 4294967296;
}

/** Cosine-interpolated value noise: continuous in value and in slope. */
function valueNoise(t: number): number {
  const i = Math.floor(t);
  const f = t - i;
  const blend = (1 - Math.cos(f * Math.PI)) * 0.5;
  return hash(i) * (1 - blend) + hash(i + 1) * blend;
}

/**
 * Expansion applied to the summed octaves.
 *
 * Adding several independent random octaves produces a distribution clustered
 * hard around its mean — the central limit theorem, doing exactly what it
 * always does. Left alone, the gust technically varies across its full range
 * and audibly never leaves the middle of it: measured over ten minutes, the
 * raw field spent one second above 0.75, so the wind's whistle layer, which
 * scales as the cube of strength, would effectively have been dead code.
 *
 * Expanding and clamping costs the very extremes, which become brief plateaus.
 * That is not a defect: a sustained lull and a gust that holds are both things
 * weather does.
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
}

export const DEFAULT_WEATHER: WeatherSettings = {
  windSpeed: 0.5,
  // Wide on purpose. Layered value noise clusters around its mean — the sum of
  // several random octaves rarely reaches its extremes — so a modest depth
  // gives a wind that technically varies and audibly does not. The wind
  // whistle scales as the cube of strength, and a signal that never gets past
  // 0.6 never triggers it at all.
  gustDepth: 0.6,
  gustRate: 0.06,
  windDirection: 2.1,
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

    const { windSpeed, gustDepth } = this.settings;
    // Three scales stacked: the setting is the climate, the swell is the hour,
    // the gust is the moment. Without the middle one the wind has no shape
    // over any span longer than about ten seconds, which is the difference
    // between weather and a texture that happens to wobble.
    const baseline = windSpeed * (0.45 + this.swell * 1.1);
    this.strength = Math.min(1, Math.max(0, baseline + (this.gust - 0.5) * gustDepth));
  }
}
