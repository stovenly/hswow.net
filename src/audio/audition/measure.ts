/**
 * Measuring whether a model sounds bad.
 *
 * Pure arithmetic over a rendered buffer — no Web Audio, no DOM — so it runs in
 * the check suite as readily as in the browser. The rendering half needs an
 * `OfflineAudioContext` and lives separately; this is the half that decides
 * what the numbers mean.
 *
 * **"Sounds bad" has measurable failure modes**, and this project has already
 * paid for two of them by ear. The foliage model's header records that
 * bubble-wrap is a *mix* failure rather than a synthesis one — grain overlap
 * below about ten. `check:audio` catches a gust field stuck near its mean,
 * which presents as "the wind model is too quiet". Neither was findable by
 * looking at the code, and both are trivial to see in a number.
 *
 * None of this replaces listening. It catches the faults that are embarrassing
 * to ship and tedious to find, so that listening can be spent on judgement.
 */

export interface Measurements {
  /** Largest absolute sample. Above 1 is clipping. */
  peak: number;
  rms: number;
  /** Mean sample value. Anything but ~0 wastes headroom and thumps on start. */
  dc: number;
  /**
   * Peak over RMS, in dB.
   *
   * The shape of a texture in one number. Very high means the energy is in
   * sparse spikes — individually audible events, which is what bubble wrap is.
   * Very low means a wall of constant level, which is a drone the ear stops
   * hearing. Most convincing ambience sits between roughly 8 and 20 dB.
   */
  crest: number;
  /**
   * Centre of spectral mass, in Hz.
   *
   * Tracks perceived brightness. Useful less as an absolute than as something
   * to watch while sweeping a parameter: a model whose "intensity" control
   * moves level but not centroid reads as a knob being turned rather than as
   * something happening.
   */
  centroid: number;
  /** Energy in each octave band, normalised to sum to 1. See `BANDS`. */
  bands: number[];
  /** Rough loudness, dB. Not ITU-R BS.1770 — see `loudness`. */
  loudness: number;
}

/**
 * Octave-ish bands, by their lower edge in Hz.
 *
 * The 2–5 kHz region is deliberately its own band: it is where the ear is most
 * sensitive and where synthesised noise reliably becomes fatiguing. The wind
 * model already carries a `soften` shelf that exists solely to tame it, and a
 * new model creeping up there is the single most common way a procedural
 * library ends up harsh.
 */
export const BANDS = [0, 125, 250, 500, 1000, 2000, 5000, 10000];

/** Peak, RMS, DC and crest factor. One pass. */
function levels(signal: Float32Array): Pick<Measurements, 'peak' | 'rms' | 'dc' | 'crest'> {
  let peak = 0;
  let sum = 0;
  let squares = 0;
  for (let i = 0; i < signal.length; i++) {
    const value = signal[i];
    const magnitude = Math.abs(value);
    if (magnitude > peak) peak = magnitude;
    sum += value;
    squares += value * value;
  }
  const rms = Math.sqrt(squares / Math.max(signal.length, 1));
  return {
    peak,
    rms,
    dc: sum / Math.max(signal.length, 1),
    // Guarded: a silent buffer has no crest factor, and reporting Infinity
    // would fail a threshold for the wrong reason.
    crest: rms > 1e-9 ? 20 * Math.log10(peak / rms) : 0,
  };
}

/**
 * Band energies by direct evaluation at probe frequencies.
 *
 * A Goertzel-style sum rather than an FFT. A single bin of a random signal is
 * itself random, so a handful of probes spread across each band and averaged is
 * both more robust and less code than a windowed transform — and `audio-check`
 * already establishes this approach for the noise-colour test.
 */
function spectrum(signal: Float32Array, rate: number): { bands: number[]; centroid: number } {
  const n = Math.min(signal.length, 16384);
  const PROBES = 12;

  const energyAt = (hz: number): number => {
    let re = 0;
    let im = 0;
    const step = (2 * Math.PI * hz) / rate;
    for (let i = 0; i < n; i++) {
      const angle = step * i;
      re += signal[i] * Math.cos(angle);
      im += signal[i] * Math.sin(angle);
    }
    return (re * re + im * im) / n;
  };

  const bands: number[] = [];
  let weighted = 0;
  let total = 0;

  for (let b = 0; b < BANDS.length; b++) {
    const low = Math.max(BANDS[b], 20);
    const high = b + 1 < BANDS.length ? BANDS[b + 1] : Math.min(rate / 2, 20000);
    let energy = 0;
    for (let p = 0; p < PROBES; p++) {
      // Logarithmic spacing, because hearing is logarithmic and linear probes
      // would cluster every sample at the top of each band.
      const hz = low * Math.pow(high / low, (p + 0.5) / PROBES);
      const at = energyAt(hz);
      energy += at;
      weighted += at * hz;
      total += at;
    }
    bands.push(energy);
  }

  const sum = bands.reduce((a, b) => a + b, 0);
  return {
    bands: sum > 0 ? bands.map((value) => value / sum) : bands.map(() => 0),
    centroid: total > 0 ? weighted / total : 0,
  };
}

/**
 * Loudness, roughly.
 *
 * **Not** ITU-R BS.1770: there is no K-weighting and no gating, so it must not
 * be reported as LUFS. It is a band-weighted RMS in dB, and its only job is
 * *comparison between models in this library* — which is enough, because the
 * commonest reason a procedural library sounds bad is not that any one model is
 * wrong but that one of them is four times louder than its neighbours, and
 * nobody notices until everything is mixed together.
 */
function loudness(bands: number[], rms: number): number {
  if (rms <= 1e-9) return -Infinity;
  // A crude loudness contour: the ear discounts the extremes and favours the
  // 1–5 kHz region where speech and most transients live.
  const weights = [0.15, 0.4, 0.7, 0.95, 1.1, 1.15, 0.9, 0.5];
  let weighted = 0;
  for (let i = 0; i < bands.length; i++) weighted += bands[i] * (weights[i] ?? 0.5);
  return 20 * Math.log10(rms) + 10 * Math.log10(Math.max(weighted, 1e-6));
}

export function measure(signal: Float32Array, rate: number): Measurements {
  const level = levels(signal);
  const { bands, centroid } = spectrum(signal, rate);
  return { ...level, bands, centroid, loudness: loudness(bands, level.rms) };
}

/**
 * Whether a signal ever becomes periodic.
 *
 * Lifted wholesale from the gust-field test in `audio-check`, because the
 * reasoning generalises and it took a wrong answer to arrive at. The naive
 * test — "correlation at long lags must be small" — is wrong, and it failed a
 * correct implementation the moment a slow swell was added: staying
 * self-similar for a long time is what ebb and flow *is*.
 *
 * What separates weather from an LFO is not how long correlation lasts but
 * whether it ever comes **back**. A periodic signal decorrelates and then
 * re-correlates at its period, over and over. Layered noise decays and stays
 * decayed. So: find where correlation has died away, then check it never
 * revives past that.
 *
 * @returns The worst revival after settling, 0..1. Above ~0.35 is a period.
 */
export function periodicity(signal: Float32Array, lags: number[]): number {
  let mean = 0;
  for (let i = 0; i < signal.length; i++) mean += signal[i];
  mean /= Math.max(signal.length, 1);

  let variance = 0;
  for (let i = 0; i < signal.length; i++) variance += (signal[i] - mean) ** 2;
  variance /= Math.max(signal.length, 1);
  if (variance < 1e-12) return 0;

  const correlation = (lag: number): number => {
    if (lag >= signal.length) return 0;
    let sum = 0;
    for (let i = 0; i + lag < signal.length; i++) {
      sum += (signal[i] - mean) * (signal[i + lag] - mean);
    }
    return Math.abs(sum / ((signal.length - lag) * variance));
  };

  const curve = lags.map(correlation);
  const settled = curve.findIndex((r) => r < 0.2);
  if (settled === -1) return 1; // never decorrelates at all
  return Math.max(0, ...curve.slice(settled));
}
