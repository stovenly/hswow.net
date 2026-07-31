/**
 * Granular texture — one sound made of hundreds of sounds too small to hear.
 *
 * A grain is a few tens of milliseconds of noise through a narrow band with a
 * smooth window on it. One is nothing. Three hundred a second is leaves, or
 * rain on a canopy, or a crowd too far off to make out.
 *
 * **The mix is the model.** This is the lesson `foliage.ts` was built around
 * and it generalises to everything granular: loud, short, broadband grains are
 * individually audible, and a few hundred audible pops a second is exactly the
 * sound of crushing bubble wrap. The synthesis is not wrong when that happens —
 * the balance is. Real populations of small events are quiet things heard in
 * enormous numbers.
 *
 * Three constraints keep grains from popping, and all three are load-bearing:
 *
 * - **Smooth windows.** A corner in an envelope is a click. See `envelopes.ts`.
 * - **Narrow bands.** A wide filter passes a broadband burst, which is a *pop*.
 *   Narrow ones pass a breath of tone, which is a rustle.
 * - **Overlap above ten.** Overlap is grains-per-second times grain-length.
 *   Below about 10 the ear resolves individual events and the illusion of a
 *   continuous texture collapses. This is the one that gets violated by
 *   accident, because raising the rate and shortening the grains both feel like
 *   "more detail".
 *
 * Grains are routed into a few fixed filter channels rather than each building
 * its own. A bandpass per grain is hundreds of filter nodes a second and buys
 * nothing that three well-separated bands do not already give.
 */

import { anyCurve, HANN } from './envelopes';

export interface GrainChannel {
  hz: number;
  q: number;
  /** Share of grains routed here. Should sum to about 1. */
  weight: number;
}

export interface GrainBed {
  /** Picks a channel by weight. One call per grain. */
  pick(): BiquadFilterNode;
  /** Shifts every channel together. Below 1 is broader and wetter. */
  setTone(tone: number, when: number): void;
  /** Overlap at a given rate and mean grain length. Keep above 10. */
  overlap(rate: number, meanDuration: number): number;
  dispose(): void;
}

export function createGrainBed(
  context: BaseAudioContext,
  channels: readonly GrainChannel[],
  destination: AudioNode,
  tone = 1,
): GrainBed {
  const built = channels.map((channel) => {
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = channel.hz * tone;
    filter.Q.value = channel.q;
    filter.connect(destination);
    return { filter, weight: channel.weight, hz: channel.hz };
  });

  return {
    pick() {
      let roll = Math.random();
      for (const channel of built) {
        roll -= channel.weight;
        if (roll <= 0) return channel.filter;
      }
      return built[built.length - 1].filter;
    },

    setTone(next, when) {
      for (const channel of built) {
        channel.filter.frequency.setTargetAtTime(channel.hz * next, when, 0.15);
      }
    },

    overlap(rate, meanDuration) {
      return rate * meanDuration;
    },

    dispose() {
      for (const channel of built) channel.filter.disconnect();
    },
  };
}

export interface GrainOptions {
  /** Seconds. Long grains blur together; short ones are a rainstick. */
  minDuration?: number;
  maxDuration?: number;
  /** Playback rate range. Per-grain pitch variety at no extra node. */
  minRate?: number;
  maxRate?: number;
  /** Envelope pool. `HANN` unless the grain has a strike in it. */
  pool?: Float32Array[];
}

/** Schedules a single grain. Cheap enough to call a few hundred times a second. */
export function scheduleGrain(
  context: BaseAudioContext,
  noise: AudioBuffer,
  target: AudioNode,
  at: number,
  options: GrainOptions = {},
): void {
  const min = options.minDuration ?? 0.055;
  const max = options.maxDuration ?? 0.165;
  const duration = min + Math.random() * (max - min);

  const source = context.createBufferSource();
  source.buffer = noise;
  const minRate = options.minRate ?? 0.7;
  const maxRate = options.maxRate ?? 1.4;
  source.playbackRate.value = minRate + Math.random() * (maxRate - minRate);

  const envelope = context.createGain();
  // **No `setValueAtTime` before this.** An automation event at the same
  // instant as the start of a value curve is a spec violation and throws. The
  // curve begins at zero of its own accord, and the source does not start
  // until `at` regardless.
  envelope.gain.setValueCurveAtTime(anyCurve(options.pool ?? HANN), at, duration);

  source.connect(envelope).connect(target);
  source.start(at, Math.random() * Math.max(noise.duration - 0.3, 0), duration + 0.02);
  source.stop(at + duration + 0.03);
}
