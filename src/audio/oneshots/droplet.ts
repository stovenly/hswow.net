import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { popBubble, bubbleRadius, bubbleHz } from '../dsp/bubble';
import { excite } from '../dsp/impact';

/**
 * Water arriving: a drip off an eave, a fish rising, a stone into a pool, a
 * pour hitting a surface.
 *
 * Water is silent. Every sound it makes is **air it trapped on the way in**,
 * ringing at the size of the bubble that holds it — Minnaert, `f = 3.26 / r` —
 * and rising in pitch as the bubble loses energy and shrinks. Get that rise
 * wrong and it is a marimba.
 *
 * What a bare bubble misses, and what this adds:
 *
 * **The film breaking.** Before the air is trapped the surface has to tear, and
 * that is a very short broadband tick with no pitch at all. It is nearly
 * inaudible alone and it is the entire difference between a drip and a sine
 * that faded in.
 *
 * **The space it lands in.** A drip into a cistern is heard almost entirely as
 * the cistern. A resonant cavity around the event does more for "this room is
 * large, hard and empty" than any amount of reverb send, because it colours the
 * bubble itself rather than smearing it.
 *
 * **A distribution, not a bubble.** Anything bigger than a drip traps a whole
 * range of sizes at once — a few large ones that carry the pitch and a spray of
 * tiny ones that carry the hiss. One bubble is a drip; forty is a splash.
 */

export type Wet = 'drip' | 'rise' | 'plunk' | 'splash' | 'patter';

interface Kind {
  /** Bubble radii, metres. 1 mm is 3.3 kHz; 6 mm is 540 Hz and fat. */
  radius: readonly [number, number];
  /** How many are trapped. */
  count: readonly [number, number];
  /** Over how long, seconds. */
  over: number;
  /** Oscillations before each is gone. Longer is a stiller pool. */
  cycles: number;
  /** The film tearing, 0..1. */
  film: number;
  /** Level of one bubble. */
  level: number;
  /** Bias in the size draw: below 0 favours small, above favours large. */
  bias: number;
}

const KINDS: Record<Wet, Kind> = {
  // One bubble and one tick. The simplest thing here and the most effective.
  drip: {
    radius: [0.0018, 0.004],
    count: [1, 1],
    over: 0.01,
    cycles: 22,
    film: 0.5,
    level: 0.5,
    bias: 0,
  },
  // A fish taking something off the surface: from underneath, so the film
  // breaks outward and there is almost no impact at all.
  rise: {
    radius: [0.003, 0.008],
    count: [2, 5],
    over: 0.07,
    cycles: 14,
    film: 0.25,
    level: 0.4,
    bias: 0.3,
  },
  // Something small and solid going in. One big cavity and a few stragglers.
  plunk: {
    radius: [0.006, 0.016],
    count: [3, 7],
    over: 0.09,
    cycles: 11,
    film: 0.85,
    level: 0.5,
    bias: 0.55,
  },
  // The whole distribution at once: pitch from the big ones, hiss from the
  // hundreds of small ones underneath them.
  splash: {
    radius: [0.0004, 0.02],
    count: [30, 70],
    over: 0.35,
    cycles: 9,
    film: 1,
    level: 0.16,
    bias: -0.4,
  },
  // Rain finding a puddle: many small, spread out, no single event.
  patter: {
    radius: [0.0005, 0.0022],
    count: [14, 30],
    over: 0.6,
    cycles: 13,
    film: 0.3,
    level: 0.12,
    bias: -0.2,
  },
};

export interface DropletOptions {
  kind?: Wet;
  gain?: number;
  /** Size. Above 1 is finer and higher; below is fatter and lower. */
  tone?: number;
  /**
   * The space it lands in: the cavity's note in Hz, or absent for open air.
   * A cistern is 90–200, a stone vault 40–90, a pail whatever the pail is.
   */
  cavity?: number;
  /** How much of the event the cavity colours, 0..1. */
  room?: number;
}

function between(range: readonly [number, number]): number {
  return range[0] + Math.random() * (range[1] - range[0]);
}

export function createDroplet(engine: AudioEngine, options: DropletOptions = {}): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('droplet built before the noise buffers were ready');

  const kind = KINDS[options.kind ?? 'drip'];
  const tone = options.tone ?? 1;
  const room = options.room ?? 0;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const direct = context.createGain();
  direct.gain.value = 1 - room * 0.55;
  direct.connect(output);

  // The space, as a resonance the event happens *inside* rather than a tail
  // smeared behind it.
  let cavity: BiquadFilterNode | null = null;
  if (options.cavity && room > 0.01) {
    cavity = context.createBiquadFilter();
    cavity.type = 'bandpass';
    cavity.frequency.value = options.cavity;
    cavity.Q.value = 5;
    const wet = context.createGain();
    wet.gain.value = room * 1.4;
    cavity.connect(wet).connect(output);
  }

  const into = (node: AudioNode): void => {
    void node;
  };
  into(direct);

  return {
    output,

    fire(at, force) {
      const count = Math.round(between(kind.count));
      const span = kind.over;

      // The film tearing. Broadband, no pitch, and over in two milliseconds.
      if (kind.film > 0.02) {
        excite(context, noise.white, direct, at, force * kind.film * 0.16, 0.0022, 0.0004);
        if (cavity) {
          excite(context, noise.white, cavity, at, force * kind.film * 0.2, 0.003, 0.0005);
        }
      }

      let lowest = 6000;
      for (let i = 0; i < count; i++) {
        // Log-uniform with a bias, so the size distribution is a distribution
        // and not a scatter between two numbers.
        const radius = bubbleRadius(kind.radius[0], kind.radius[1], kind.bias) / tone;
        lowest = Math.min(lowest, bubbleHz(radius));
        const when = at + (count === 1 ? 0 : Math.random() * span);
        const level = force * kind.level * (0.6 + Math.random() * 0.5);
        popBubble(context, direct, when, { radius, level, cycles: kind.cycles });
        // Through the room as well, at a fraction: the space is hearing the
        // same bubble, not a copy of it.
        if (cavity) {
          popBubble(context, cavity, when, { radius, level: level * 0.8, cycles: kind.cycles });
        }
      }

      // The lowest bubble sets how long the event lasts: a fat one at 400 Hz
      // rings far longer than a fine one at four kilohertz.
      return span + (kind.cycles / Math.max(lowest, 80)) * 3 + 0.05;
    },

    dispose() {
      cavity?.disconnect();
      direct.disconnect();
      output.disconnect();
    },
  };
}
