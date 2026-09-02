/**
 * Granular texture: a few tens of milliseconds of noise through a narrow band
 * under a smooth window. One is nothing, three hundred a second is leaves.
 *
 * Three constraints keep grains from popping. Windows stay smooth, because a
 * corner is a click. Bands stay narrow, because a wide one passes a broadband
 * burst. And overlap — rate times grain length — stays above about 10, below
 * which the ear resolves single events and the texture collapses.
 *
 * Grains route into a few fixed filter channels rather than each building its
 * own, which would be hundreds of filter nodes a second. Where the particle
 * worklet is registered the grains are records it renders into those
 * channels; elsewhere each grain is a source and a gain, scheduled here.
 */

import { anyCurve, HANN, STEPS } from './envelopes';
import { GRAIN, STRIKE, particleNode, particlesReady, type ParticleNode } from '../particles/Particles';

export interface GrainChannel {
  hz: number;
  q: number;
  /** Share of grains routed here. Should sum to about 1. */
  weight: number;
}

export interface GrainBed {
  /** One grain of noise under a smooth window, into a channel picked by weight. */
  grain(at: number, options?: GrainOptions): void;
  /** One burst of noise struck rather than windowed — `impact.excite` into a channel. */
  strike(at: number, level: number, duration: number, attack?: number): void;
  /** Shifts every channel together. Below 1 is broader and wetter. */
  setTone(tone: number, when: number): void;
  /** Overlap at a given rate and mean grain length. Keep above 10. */
  overlap(rate: number, meanDuration: number): number;
  dispose(): void;
}

export function createGrainBed(
  context: BaseAudioContext,
  noise: AudioBuffer,
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

  const worklet: ParticleNode | null = particlesReady(context)
    ? particleNode(context, built.length, (node) => built.forEach((channel, i) => node.connect(channel.filter, i)))
    : null;

  const pick = (): number => {
    let roll = Math.random();
    for (let i = 0; i < built.length; i++) {
      roll -= built[i].weight;
      if (roll <= 0) return i;
    }
    return built.length - 1;
  };

  return {
    grain(at, options = {}) {
      const channel = pick();
      if (!worklet) {
        scheduleGrain(context, noise, built[channel].filter, at, options);
        return;
      }
      const min = options.minDuration ?? 0.055;
      const max = options.maxDuration ?? 0.165;
      const duration = min + Math.random() * (max - min);
      const minRate = options.minRate ?? 0.7;
      const maxRate = options.maxRate ?? 1.4;
      const rate = minRate + Math.random() * (maxRate - minRate);
      // The same quantised peaks the curve pool has: most grains sit low.
      const peak = ((Math.floor(Math.random() * STEPS) + 1) / STEPS) ** 2;
      worklet.write(GRAIN, at, duration, peak, channel, rate, Math.random() * 1.5);
    },

    strike(at, level, duration, attack) {
      if (level <= 0.0005) return;
      const channel = pick();
      const rise = Math.min(attack ?? Math.min(0.0012, duration * 0.3), duration * 2);
      const window = rise + duration * 2.5 + 0.05;
      if (!worklet) {
        strikeNodes(context, noise, built[channel].filter, at, level, rise, duration * 1.6, window);
        return;
      }
      worklet.write(STRIKE, at, window, level, channel, 1, Math.random() * 1.5, rise, (duration * 1.6) / 3);
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
      worklet?.dispose();
      for (const channel of built) channel.filter.disconnect();
    },
  };
}

/** A struck burst as nodes, for a bed with no worklet. The shape `impact.excite` schedules. */
function strikeNodes(
  context: BaseAudioContext,
  noise: AudioBuffer,
  target: AudioNode,
  at: number,
  level: number,
  rise: number,
  decay: number,
  window: number,
): void {
  const source = context.createBufferSource();
  source.buffer = noise;
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0, at);
  envelope.gain.linearRampToValueAtTime(level, at + rise);
  envelope.gain.setTargetAtTime(0, at + rise, decay / 3);
  source.connect(envelope).connect(target);
  source.start(at, Math.random() * Math.max(noise.duration - window, 0), window);
  source.stop(at + window + 0.01);
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
  // No `setValueAtTime` before this: an automation event at the same instant
  // as the start of a value curve is a spec violation and throws.
  envelope.gain.setValueCurveAtTime(anyCurve(options.pool ?? HANN), at, duration);

  source.connect(envelope).connect(target);
  source.start(at, Math.random() * Math.max(noise.duration - 0.3, 0), duration + 0.02);
  source.stop(at + duration + 0.03);
}
