import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise, type NoiseVoice } from '../noise';
import { createEventClock, poissonGap } from '../dsp/clock';
import { popBubble, bubbleRadius, bubbleHz } from '../dsp/bubble';

/**
 * Moving water — a brook, a stream, a fountain, a cistern. A bed carrying the
 * level and a population of events carrying the identity, and the events are
 * not impacts: water's voice is entrained air, so every audible thing about it
 * is a distribution of bubble radii. See `dsp/bubble.ts`.
 *
 * - a **brook** over stones traps a great many very small bubbles — fast,
 *   bright, fizzing
 * - a **stream** with depth traps fewer and larger ones — slower, rounder
 * - a **fountain** is a brook's distribution at a much higher rate, because
 *   falling water entrains far more air than flowing water
 * - a **cistern** is almost still: a few large bubbles a second and silence
 *
 * The bed under all of it is turbulence rather than bubbles blurring together,
 * and it wants to be narrower and lower than instinct suggests. Wide bright
 * noise under bubbles is a tap running into a metal sink.
 */

export type Flow = 'brook' | 'stream' | 'fountain' | 'cistern';

interface FlowKind {
  /** Bubbles per second at full rate. */
  rate: number;
  /** Radius range in metres. Log-uniform — see `bubbleRadius`. */
  radius: readonly [number, number];
  /** Oscillations per bubble. Longer where the surface is calmer. */
  cycles: number;
  /** Turbulence bed. */
  bedHz: number;
  bedQ: number;
  bedLevel: number;
  /** Level of one bubble. */
  voice: number;
}

const FLOWS: Record<Flow, FlowKind> = {
  brook: {
    rate: 95,
    radius: [0.0004, 0.0026],
    cycles: 15,
    bedHz: 1500,
    bedQ: 0.75,
    bedLevel: 0.28,
    voice: 0.1,
  },
  stream: {
    rate: 62,
    radius: [0.0009, 0.005],
    cycles: 18,
    bedHz: 900,
    bedQ: 0.7,
    bedLevel: 0.36,
    voice: 0.13,
  },
  // Falling water entrains air far more violently than flowing water, so the
  // rate is high and the bed is bright with spray.
  fountain: {
    rate: 150,
    radius: [0.0005, 0.0035],
    cycles: 14,
    bedHz: 2100,
    bedQ: 0.6,
    bedLevel: 0.34,
    voice: 0.09,
  },
  // Nearly silent, and it should be: a cistern is defined by its gaps. At a
  // couple of events a second the ear stops hearing standing water and starts
  // hearing a spring, because anything bubbling continuously has something
  // driving it. One fat slow plop every few seconds into a long tail.
  cistern: {
    rate: 0.45,
    radius: [0.003, 0.009],
    cycles: 30,
    bedHz: 260,
    bedQ: 1.3,
    bedLevel: 0.02,
    voice: 0.62,
  },
};

export interface WaterOptions {
  gain?: number;
  flow?: Flow;
  /** How hard it is running, 0..1. */
  rate?: number;
  /**
   * Shifts the bubble distribution and the bed together. Below 1 is bigger
   * water: radii scale inversely, so pitches come down as the volume goes up,
   * which is the relationship the ear uses to judge the size of a body.
   */
  tone?: number;
}

export interface WaterModel extends SoundModel {
  setRate(value: number): void;
  /** Mean bubble pitch, for the debug readout. */
  readonly voiceHz: number;
}

export function createWater(engine: AudioEngine, options: WaterOptions = {}): WaterModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('water model built before the noise buffers were ready');

  const kind = FLOWS[options.flow ?? 'brook'];
  const tone = options.tone ?? 1;
  // Radius scales as 1/tone so that pitch scales as tone. See the option doc.
  const low = kind.radius[0] / tone;
  const high = kind.radius[1] / tone;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const bubbleBus = context.createGain();
  bubbleBus.gain.value = 1;

  // Bubbles are pure sines, and a few hundred pure sines a second stack up
  // glassy at the top end in a way real water never is. A gentle tilt off the
  // treble, on the bubbles only — the bed underneath needs its air.
  const sparkle = context.createBiquadFilter();
  sparkle.type = 'highshelf';
  sparkle.frequency.value = 3000;
  sparkle.gain.value = -3;
  bubbleBus.connect(sparkle).connect(output);

  const bedFilter = context.createBiquadFilter();
  bedFilter.type = 'bandpass';
  bedFilter.frequency.value = kind.bedHz * tone;
  bedFilter.Q.value = kind.bedQ;
  const bedGain = context.createGain();
  bedGain.gain.value = 0;
  const bed: NoiseVoice = playNoise(context, noise.pink, bedFilter);
  bedFilter.connect(bedGain).connect(output);

  let rate = options.rate ?? 1;
  let active = true;
  const clock = createEventClock(context);
  const popGap = poissonGap();

  const pop = (at: number): void => {
    popBubble(context, bubbleBus, at, {
      radius: bubbleRadius(low, high),
      // A wide level spread. Uniform amplitudes read as one mechanism; the
      // spread is what makes it a surface with things happening all over it.
      level: kind.voice * (0.3 + Math.random() * 0.7),
      cycles: kind.cycles * (0.75 + Math.random() * 0.5),
    });
  };

  return {
    output,

    get voiceHz() {
      return bubbleHz(Math.sqrt(low * high));
    },

    setRate(value) {
      rate = Math.min(1, Math.max(0, value));
    },

    setActive(next) {
      active = next;
      if (next) clock.reset();
      else bedGain.gain.value = 0;
    },

    update(_dt) {
      if (!active) return;
      const now = context.currentTime;

      bedGain.gain.setTargetAtTime(kind.bedLevel * rate, now, 0.5);
      // Faster flow is brighter as well as louder — smaller eddies, more spray.
      bedFilter.frequency.setTargetAtTime(kind.bedHz * tone * (0.75 + rate * 0.4), now, 0.5);

      if (rate < 0.02) {
        clock.reset();
        return;
      }
      popGap.rate = kind.rate * rate;
      clock.pump(pop, popGap);
    },

    dispose() {
      bed.stop();
      sparkle.disconnect();
      bubbleBus.disconnect();
      bedGain.disconnect();
      output.disconnect();
    },
  };
}
