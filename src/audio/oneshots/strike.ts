import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { createModalBank, type Mode } from '../dsp/modal';
import { excite, thump } from '../dsp/impact';

/**
 * A solid body, struck: a plank, a bar, a stone, a latch, a tool set down.
 *
 * Three things separate this from a generic rattle, and all three are the
 * reason the generic one never sounds like a particular object.
 *
 * **The contact is not the body.** How long the two surfaces are touching sets
 * how much of the spectrum gets woken, and that time depends on how hard both
 * of them are — a steel pin on stone is under a millisecond and wakes
 * everything; a knuckle on oak is ten times that and wakes almost nothing above
 * a kilohertz. So `hardness` shapes the excitation, and the same body struck
 * two ways is two different sounds without touching a single mode.
 *
 * **Where you hit it decides what rings.** A mode has nodes along the body, and
 * striking at a node cannot excite it — which is why a bar struck at its centre
 * is hollow and the same bar struck near its end is bright. Amplitudes go as
 * `sin(nπ·place)`, and `place` is re-rolled per event, so no two strikes on the
 * same object are the same strike.
 *
 * **Small things cannot radiate low notes.** An object much smaller than a
 * wavelength moves the air back and forth around itself instead of pushing it
 * away, so the bottom of the spectrum never reaches you. `size` tilts the whole
 * thing, and it is most of why a coin and a girder made of the same steel sound
 * nothing alike.
 */

export type Material = 'oak' | 'pine' | 'iron' | 'brass' | 'stone' | 'clay' | 'glass';

interface Stuff {
  /** Mode ratios. Wood and stone are dense and irregular; metal is sparse. */
  ratios: readonly number[];
  /** First mode, Hz, at `size` 1. */
  hz: number;
  /** Ring-down of the first mode, seconds. */
  decay: number;
  /**
   * How much faster each successive mode dies. Wood and clay lose their top
   * almost at once, which is most of what "dull" means; iron holds on.
   */
  damping: number;
  /** How hard the surface is, 0..1. Sets the shortest contact it can make. */
  hardness: number;
  /** Mass under the contact, as a fraction of the first mode. */
  weight: number;
}

const STUFF: Record<Material, Stuff> = {
  // Dense, irregular, and the top is gone before you notice it was there.
  oak: {
    ratios: [1, 1.68, 2.41, 3.12, 4.05, 5.3],
    hz: 320,
    decay: 0.16,
    damping: 0.55,
    hardness: 0.45,
    weight: 0.42,
  },
  pine: {
    ratios: [1, 1.74, 2.55, 3.38, 4.4],
    hz: 430,
    decay: 0.11,
    damping: 0.48,
    hardness: 0.35,
    weight: 0.3,
  },
  // Sparse, long and thoroughly inharmonic. None of these is a small integer,
  // because a lump of iron is not a musical instrument.
  iron: {
    ratios: [1, 2.76, 5.4, 8.93, 13.3, 18.6],
    hz: 510,
    decay: 1.5,
    damping: 0.86,
    hardness: 0.95,
    weight: 0.5,
  },
  // Denser and warmer than iron, and it holds its low modes far longer.
  brass: {
    ratios: [1, 2.39, 4.31, 6.79, 9.8],
    hz: 420,
    decay: 2.2,
    damping: 0.9,
    hardness: 0.8,
    weight: 0.45,
  },
  // Barely rings at all: almost the whole event is the contact.
  stone: {
    ratios: [1, 1.59, 2.29, 3.11],
    hz: 620,
    decay: 0.045,
    damping: 0.4,
    hardness: 0.9,
    weight: 0.75,
  },
  clay: {
    ratios: [1, 2.11, 3.28, 4.6],
    hz: 780,
    decay: 0.12,
    damping: 0.5,
    hardness: 0.7,
    weight: 0.35,
  },
  glass: {
    ratios: [1, 2.48, 4.35, 6.7, 9.4],
    hz: 1400,
    decay: 0.9,
    damping: 0.82,
    hardness: 1,
    weight: 0.18,
  },
};

export interface StrikeOptions {
  material?: Material;
  gain?: number;
  /**
   * Size. Below 1 is a **bigger** object: every mode falls and it radiates its
   * bottom end properly. Above 1 is small, high and thin.
   */
  size?: number;
  /** What is doing the striking, 0..1. Soft is a hand, hard is another tool. */
  striker?: number;
  /** Extra ring-down, as a multiplier. Damped is held, free is set on a bench. */
  ring?: number;
  /** Strikes per event, and how fast they follow. A latch is two. */
  hits?: readonly [number, number];
  /** Seconds between them. */
  spacing?: readonly [number, number];
}

/**
 * Below this the body is large enough to load the air properly; above it, the
 * low modes are progressively lost. Hz, at `size` 1.
 */
const RADIATION_HZ = 260;

function between(range: readonly [number, number]): number {
  return range[0] + Math.random() * (range[1] - range[0]);
}

export function createStrike(engine: AudioEngine, options: StrikeOptions = {}): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('strike built before the noise buffers were ready');

  const stuff = STUFF[options.material ?? 'oak'];
  const size = options.size ?? 1;
  const striker = options.striker ?? 0.6;
  const ring = options.ring ?? 1;
  const hits = options.hits ?? [1, 1];
  const spacing = options.spacing ?? [0.05, 0.11];

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.45;

  // Radiation. A body smaller than the wavelength it is trying to make simply
  // does not make it, so the low end is rolled off by how small it is.
  const radiation = context.createBiquadFilter();
  radiation.type = 'highpass';
  radiation.frequency.value = RADIATION_HZ * size;
  radiation.Q.value = 0.6;
  radiation.connect(output);

  const modes: Mode[] = stuff.ratios.map((ratio, i) => ({
    hz: stuff.hz * ratio * size,
    decay: stuff.decay * Math.pow(stuff.damping, i) * ring,
    level: 1 / (1 + i * 0.5),
  }));
  const bank = createModalBank(context, modes, radiation, { ring: 'excitation' });

  let sweep = 0;

  const hit = (at: number, force: number): void => {
    // Hertzian contact: two hard surfaces meeting fast are in contact for a
    // very short time and so wake the whole spectrum; anything soft is longer
    // and darker, and no filter downstream turns one into the other.
    const contact = 0.0006 + (1 - stuff.hardness * striker) * 0.011 * (1.1 - force * 0.35);

    // Where it was struck, fresh each time. A mode with a node under the hammer
    // cannot be woken, which is why no two strikes on one object agree.
    const place = 0.12 + Math.random() * 0.38;

    bank.inputs.forEach((input, i) => {
      const shape = Math.abs(Math.sin((i + 1) * Math.PI * place));
      excite(
        context,
        noise.white,
        input,
        at,
        force * modes[i].level * shape,
        contact,
        contact * 0.35,
      );
    });

    // The mass under the blow. Not the body ringing — the whole object moving.
    thump(
      context,
      radiation,
      at,
      force * stuff.weight * 0.4,
      stuff.hz * size * 0.5,
      stuff.hz * size * 0.28,
      0.05 + (1 - stuff.hardness) * 0.06,
    );

    sweep = Math.max(sweep, at + modes[0].decay + 0.05);
  };

  return {
    output,

    fire(at, force) {
      sweep = at;
      const count = Math.round(between(hits));
      let cursor = at;
      for (let i = 0; i < count; i++) {
        // Each one weaker and closer than the last: that acceleration is what
        // makes two contacts read as one gesture instead of two events.
        hit(cursor, force * Math.pow(0.55, i) * (0.85 + Math.random() * 0.3));
        cursor += between(spacing) * Math.pow(0.7, i);
      }
      return sweep - at;
    },

    dispose() {
      bank.dispose();
      radiation.disconnect();
      output.disconnect();
    },
  };
}
