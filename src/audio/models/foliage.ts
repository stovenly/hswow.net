import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise, type NoiseVoice } from '../noise';

/**
 * Leaves.
 *
 * Two layers, and the balance between them is the whole model:
 *
 * - A **continuous band-limited hush** — the sound of air moving through a
 *   mass of foliage — which carries almost all of the level.
 * - **Grains** on top, one per leaf, which carry almost none of it. They exist
 *   to give the hush a grain and a shimmer, not to be heard as events.
 *
 * Getting that balance backwards is what makes granular foliage sound like
 * bubble wrap. Loud, short, broadband grains are individually audible, and a
 * few hundred audible pops a second is exactly the sound of crushing plastic
 * packaging — the synthesis is not wrong, the mix is. Real leaves are quiet
 * things heard in enormous numbers.
 *
 * Three details keep them from popping:
 *
 * - **Hann windows.** Linear attack and decay meet at a corner, and a corner
 *   in an envelope is a click however short the ramp is. A raised cosine has
 *   no corners anywhere.
 * - **Narrow bands.** A wide filter passes a broadband burst, which is a
 *   *pop*. Narrow ones pass a breath of tone, which is a rustle.
 * - **Long grains.** Overlap is grains-per-second times grain-length. Below
 *   about 10 the ear resolves individual events; this sits around 25.
 *
 * Grain rate is driven by the same gust signal as the wind model, so the tree
 * moves when the wind does. Grains are scheduled against
 * `AudioContext.currentTime` over a lookahead window — the "two clocks"
 * pattern — because the audio clock is sample-accurate and the frame clock is
 * not.
 */

/** How far ahead to schedule. Longer survives worse frame hitches. */
const LOOKAHEAD = 0.14;
/** Cap per update, in case a huge dt would otherwise queue thousands. */
const MAX_PER_UPDATE = 160;

/**
 * Grains are routed into a few fixed filter channels rather than each building
 * its own — a bandpass per grain is hundreds of filter nodes a second per tree
 * and buys nothing three well-separated bands do not already give.
 *
 * The Q values are high for a noise source, deliberately. Weighted toward the
 * middle, with very little up top: the highest band is where the crinkle
 * lives, and a canopy is mostly a mid-range sound.
 */
const CHANNELS = [
  { hz: 1150, q: 2.6, weight: 0.4 },
  { hz: 2400, q: 3.2, weight: 0.46 },
  { hz: 4600, q: 3.8, weight: 0.14 },
];

/**
 * Precomputed Hann envelopes at several peak levels.
 *
 * `setValueCurveAtTime` copies the array it is given, so one shared curve per
 * amplitude avoids allocating a Float32Array for every grain — at a few
 * hundred grains a second that is the difference between negligible and
 * noticeable garbage.
 */
const ENVELOPE_STEPS = 8;
const ENVELOPE_POINTS = 48;
const ENVELOPES = Array.from({ length: ENVELOPE_STEPS }, (_, step) => {
  // Squared spacing, so most grains are quiet and a few stand slightly out —
  // evenly spread amplitudes sound mechanical.
  const peak = ((step + 1) / ENVELOPE_STEPS) ** 2;
  const curve = new Float32Array(ENVELOPE_POINTS);
  for (let i = 0; i < ENVELOPE_POINTS; i++) {
    curve[i] = peak * 0.5 * (1 - Math.cos((2 * Math.PI * i) / (ENVELOPE_POINTS - 1)));
  }
  return curve;
});

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
   * Scales how much of the level the grains carry, against the hush beneath.
   *
   * The one control worth having live. Grain-heavy is bubble wrap, hush-heavy
   * is a waterfall, and where the line sits between them is a judgement that
   * cannot be made from a constant in a file.
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

  const channels = CHANNELS.map((channel) => {
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = channel.hz * tone;
    filter.Q.value = channel.q;
    filter.connect(grainBus);
    return { node: filter, weight: channel.weight };
  });

  const pick = (): BiquadFilterNode => {
    let roll = Math.random();
    for (const channel of channels) {
      roll -= channel.weight;
      if (roll <= 0) return channel.node;
    }
    return channels[channels.length - 1].node;
  };

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
  let nextGrain = 0;

  const scheduleGrain = (at: number): void => {
    const source = context.createBufferSource();
    source.buffer = noise.white;
    // Detuned per grain: pitch variety that costs no extra node.
    source.playbackRate.value = 0.7 + Math.random() * 0.7;

    const envelope = context.createGain();
    // Long, so grains overlap heavily and blur into one another. Short grains
    // are what make a canopy sound like a rainstick.
    const duration = 0.055 + Math.random() * 0.11;
    // No `setValueAtTime` ahead of this: an automation event at the same
    // instant as the start of a value curve is a spec violation and throws.
    // The curve begins at zero of its own accord, and the source does not
    // start until `at` regardless.
    envelope.gain.setValueCurveAtTime(
      ENVELOPES[Math.floor(Math.random() * ENVELOPE_STEPS)],
      at,
      duration,
    );

    source.connect(envelope).connect(pick());
    source.start(at, Math.random() * (noise.white.duration - 0.3), duration + 0.02);
    source.stop(at + duration + 0.03);
  };

  return {
    output,

    setArticulation(value) {
      articulation = value;
    },

    setActive(next) {
      active = next;
      // Reset the cursor: coming back after minutes away must not try to
      // catch up on every grain it missed.
      if (next) nextGrain = 0;
      if (!next) {
        bedGain.gain.value = 0;
        grainBus.gain.value = 0;
      }
    },

    update(_dt, audio) {
      if (!active) return;

      const strength = Math.max(audio.weather.strength, restlessness);
      const now = context.currentTime;
      if (nextGrain < now) nextGrain = now;

      // The hush carries the level and brightens as the wind rises — a canopy
      // in a gust is not just louder, the air through it is moving faster past
      // smaller edges.
      bedGain.gain.setTargetAtTime(0.1 + strength * 0.5, now, 0.15);
      bedFilter.frequency.setTargetAtTime((1500 + strength * 1900) * tone, now, 0.15);
      grainBus.gain.setTargetAtTime(articulation * (0.25 + strength * 0.75), now, 0.15);

      const horizon = now + LOOKAHEAD;
      // Rate scales with the square of strength: a stiff breeze does not
      // rustle twice as many leaves as a light one, it rustles far more.
      const rate = Math.max(20, density * strength * strength);

      let queued = 0;
      while (nextGrain < horizon && queued < MAX_PER_UPDATE) {
        scheduleGrain(nextGrain);
        // Exponential gaps — a Poisson process. Evenly spaced grains sound
        // like a buzz at the grain rate, which is exactly what this is trying
        // not to be.
        nextGrain += -Math.log(1 - Math.random()) / rate;
        queued++;
      }
    },

    dispose() {
      bed.stop();
      grainBus.disconnect();
      output.disconnect();
    },
  };
}
