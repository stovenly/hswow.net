import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise, type NoiseVoice } from '../noise';
import { createEventClock, poissonGap } from '../dsp/clock';
import { createGrainBed, scheduleGrain } from '../dsp/grain';

/**
 * Leaves. A continuous band-limited hush carrying almost all the level, and
 * grains on top carrying almost none — they give the hush a shimmer, not
 * events to be heard. Backwards, that is the sound of crushing bubble wrap.
 *
 * Hann windows, because a corner in an envelope is a click. Narrow bands,
 * because a wide filter passes a broadband burst. And long grains: overlap is
 * rate times length, and below about 10 the ear resolves single events. This
 * sits around 25.
 *
 * Grain rate follows the same gust signal as the wind model, scheduled against
 * `AudioContext.currentTime` over a lookahead.
 */

/**
 * Grains route into a few fixed filter channels rather than each building its
 * own — a bandpass per grain is hundreds of filter nodes a second per tree.
 *
 * The Q values are high for a noise source, deliberately. Weighted toward the
 * middle with very little up top: a canopy is mostly a mid-range sound.
 */
const CHANNELS = [
  { hz: 1150, q: 2.6, weight: 0.4 },
  { hz: 2400, q: 3.2, weight: 0.46 },
  { hz: 4600, q: 3.8, weight: 0.14 },
];

export interface FoliageOptions {
  /** Grains per second in a full gust. See the note on overlap above. */
  density?: number;
  /** Shifts every band up or down. Below 1 is broad wet leaves. */
  tone?: number;
  gain?: number;
  /** How much of the level the grains carry, 0..1. Small on purpose. */
  articulation?: number;
  /** Rustles even in still air, 0..1 — a tree is never quite silent. */
  restlessness?: number;
}

export interface FoliageModel extends SoundModel {
  /**
   * Scales how much of the level the grains carry against the hush beneath.
   * The one control worth having live — grain-heavy is bubble wrap, hush-heavy
   * is a waterfall.
   */
  setArticulation(value: number): void;
}

export function createFoliage(engine: AudioEngine, options: FoliageOptions = {}): FoliageModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('foliage model built before the noise buffers were ready');

  const density = options.density ?? 240;
  const tone = options.tone ?? 1;
  const restlessness = options.restlessness ?? 0.2;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // Grains all pass through here, so their overall level tracks the wind
  // without every grain having to be scaled individually.
  const grainBus = context.createGain();
  grainBus.gain.value = 0;
  grainBus.connect(output);

  const grains = createGrainBed(context, CHANNELS, grainBus, tone);

  // The hush: the layer that actually carries the sound. Pink rather than
  // white because foliage is weighted to the middle, and a gentle Q so it is a
  // broad breath rather than a whistle.
  const bedFilter = context.createBiquadFilter();
  bedFilter.type = 'bandpass';
  bedFilter.frequency.value = 1800 * tone;
  bedFilter.Q.value = 0.75;
  const bedGain = context.createGain();
  bedGain.gain.value = 0;
  const bed: NoiseVoice = playNoise(context, noise.pink, bedFilter);
  bedFilter.connect(bedGain).connect(output);

  let articulation = options.articulation ?? 0.3;
  let active = true;
  const clock = createEventClock(context);
  const rustleGap = poissonGap();

  // Long grains, so they overlap heavily and blur into one another. Short
  // grains are what make a canopy sound like a rainstick.
  const fire = (at: number): void =>
    scheduleGrain(context, noise.white, grains.pick(), at, {
      minDuration: 0.055,
      maxDuration: 0.165,
    });

  return {
    output,

    setArticulation(value) {
      articulation = value;
    },

    setActive(next) {
      active = next;
      // Reset the cursor: coming back after minutes away must not try to
      // catch up on every grain it missed.
      if (next) clock.reset();
      if (!next) {
        bedGain.gain.value = 0;
        grainBus.gain.value = 0;
      }
    },

    update(_dt, audio, at) {
      if (!active) return;

      const strength = Math.max(audio.weather.strengthAt(at.x, at.z), restlessness);
      const now = context.currentTime;

      // The hush carries the level and brightens as the wind rises — a canopy
      // in a gust is not just louder, the air through it is moving faster past
      // smaller edges.
      bedGain.gain.setTargetAtTime(0.1 + strength * 0.5, now, 0.15);
      bedFilter.frequency.setTargetAtTime((1500 + strength * 1900) * tone, now, 0.15);
      grainBus.gain.setTargetAtTime(articulation * (0.25 + strength * 0.75), now, 0.15);

      // Rate scales with the square of strength: a stiff breeze does not
      // rustle twice as many leaves as a light one, it rustles far more.
      const rate = Math.max(20, density * strength * strength);
      rustleGap.rate = rate;
      clock.pump(fire, rustleGap);
    },

    dispose() {
      bed.stop();
      grains.dispose();
      grainBus.disconnect();
      output.disconnect();
    },
  };
}
