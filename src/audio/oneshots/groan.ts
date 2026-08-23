import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { createModalBank, type Mode } from '../dsp/modal';
import { excite, thump } from '../dsp/impact';

/**
 * A structure taking up strain: a steel frame, a timber one, rock under its
 * own weight.
 *
 * A groan is stick-slip — a joint held by friction, let go, caught again —
 * and what makes it a groan rather than a creak is that the slips are slow
 * enough to hear singly and the body they drive rings long. The slip rate is
 * not constant: it climbs as the load moves and falls off as it settles, so
 * every event is a hump with a beginning and an end, and no two humps are the
 * same length.
 */

export type Strained = 'iron' | 'timber' | 'rock';

interface Body {
  ratios: readonly number[];
  /** First mode, Hz. */
  hz: number;
  decay: number;
  damping: number;
  /** Slips per second at the top of the hump, and at the foot of it. */
  slips: readonly [number, number];
  over: readonly [number, number];
  /** How long a slip's contact is, seconds. Coarse surfaces are longer. */
  contact: number;
  weight: number;
}

const BODIES: Record<Strained, Body> = {
  iron: {
    ratios: [1, 2.76, 5.4, 8.93],
    hz: 95,
    decay: 1.8,
    damping: 0.82,
    slips: [38, 14],
    over: [0.6, 2.2],
    contact: 0.0035,
    weight: 0.45,
  },
  timber: {
    ratios: [1, 1.68, 2.41, 3.12],
    hz: 150,
    decay: 0.35,
    damping: 0.55,
    slips: [70, 22],
    over: [0.3, 1.2],
    contact: 0.005,
    weight: 0.25,
  },
  rock: {
    ratios: [1, 1.59, 2.29, 3.11],
    hz: 58,
    decay: 0.9,
    damping: 0.5,
    slips: [16, 6],
    over: [1.2, 3],
    contact: 0.009,
    weight: 0.8,
  },
};

export interface GroanOptions {
  material?: Strained;
  gain?: number;
  /** Size. Below 1 is a bigger body: every mode falls. */
  size?: number;
}

function between(range: readonly [number, number]): number {
  return range[0] + Math.random() * (range[1] - range[0]);
}

export function createGroan(engine: AudioEngine, options: GroanOptions = {}): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('groan built before the noise buffers were ready');

  const body = BODIES[options.material ?? 'iron'];
  const size = options.size ?? 1;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.4;

  const modes: Mode[] = body.ratios.map((ratio, i) => ({
    hz: body.hz * ratio * size,
    decay: body.decay * Math.pow(body.damping, i),
    level: 1 / (1 + i * 0.7),
  }));
  const bank = createModalBank(context, modes, output, { ring: 'filter', maxQ: 60 });

  // One drive into every mode, so a slip is one source node and not four.
  const drive = context.createGain();
  bank.inputs.forEach((input, i) => {
    const weight = context.createGain();
    weight.gain.value = modes[i].level;
    drive.connect(weight).connect(input);
  });

  return {
    output,

    fire(at, force) {
      const span = between(body.over);
      // Where the hump peaks, 0..1 through the event. Early is a jolt that
      // settles; late is a slow build that lets go.
      const crest = 0.25 + Math.random() * 0.5;
      let t = 0;
      while (t < span) {
        const x = t / span;
        const hump = x < crest ? x / crest : 1 - (x - crest) / (1 - crest);
        const shaped = Math.pow(Math.max(hump, 0), 1.4);
        const rate = body.slips[1] + (body.slips[0] - body.slips[1]) * shaped;
        const level = force * (0.25 + shaped * 0.75) * (0.6 + Math.random() * 0.4);
        const contact = body.contact * (0.7 + Math.random() * 0.6);
        excite(context, noise.white, drive, at + t, level, contact, contact * 0.3);
        t += 1 / (rate * (0.8 + Math.random() * 0.4));
      }

      // The member settling at the end of it.
      thump(context, output, at + span, force * body.weight * 0.3, body.hz * size * 0.6, body.hz * size * 0.3, 0.12, 0.006);

      return span + modes[0].decay + 0.2;
    },

    dispose() {
      bank.dispose();
      drive.disconnect();
      output.disconnect();
    },
  };
}
