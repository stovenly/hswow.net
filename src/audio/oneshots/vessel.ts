import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { createModalBank, type Mode } from '../dsp/modal';
import { popBubble, bubbleRadius } from '../dsp/bubble';
import { excite, thump } from '../dsp/impact';

/**
 * A hollow container being used: a pail, a churn, a jar, a trough, a pot.
 *
 * The generic "something was set down" one-shot is a leading strike and a
 * decaying scatter, and it is the right model for a heap of firewood and the
 * wrong one for anything with an inside. A vessel has two resonators, not one:
 *
 * - **The wall.** A thin shell, so its modes are close together, inharmonic,
 *   and gone quickly. Fired clay is dead, oak is woody, a metal pail rings.
 * - **The air in it.** A Helmholtz resonator — a volume of air behind a neck —
 *   which is a *single low tone* and nothing like the wall's modes.
 *
 * And the second one moves. **As a vessel fills, its air volume shrinks and its
 * cavity note climbs**, which is why you can hear a bucket getting full from
 * across a yard without looking at it. `f ∝ 1/√V`, so a pail two thirds full
 * sings about three semitones above an empty one struck the same way.
 *
 * That rise is the whole reason this file exists. Nothing else in the library
 * tells you the *state* of an object rather than its material.
 */

export type Vessel = 'pail' | 'churn' | 'jar' | 'trough' | 'pot';

interface Kind {
  /** Wall modes, as ratios of the first, with its decay in seconds. */
  ratios: readonly number[];
  wallHz: number;
  wallDecay: number;
  /** How much wall there is against cavity, 0..1. Clay is nearly all wall. */
  wall: number;
  /** Cavity note when empty, Hz. Where the air sits before anything is in it. */
  cavityHz: number;
  /** How long the air rings. Always longer than the wall, and much purer. */
  cavityDecay: number;
  /** Contact hardness, seconds. Short is a rap, long is a soft set-down. */
  contact: number;
  /** Mass under the contact, Hz. */
  thumpHz: number;
}

const KINDS: Record<Vessel, Kind> = {
  // Thin metal, so the wall rings and the ratios are wide apart.
  pail: {
    ratios: [1, 2.37, 3.81, 5.44, 7.03],
    wallHz: 420,
    wallDecay: 0.5,
    wall: 0.6,
    cavityHz: 155,
    cavityDecay: 0.42,
    contact: 0.0025,
    thumpHz: 130,
  },
  // Staved oak: heavier, deader, and a big slow cavity behind it.
  churn: {
    ratios: [1, 1.94, 2.71, 3.66],
    wallHz: 240,
    wallDecay: 0.18,
    wall: 0.45,
    cavityHz: 98,
    cavityDecay: 0.55,
    contact: 0.006,
    thumpHz: 82,
  },
  // Fired clay is almost pure wall: dense modes, gone at once.
  jar: {
    ratios: [1, 2.14, 3.27, 4.61, 6.02],
    wallHz: 880,
    wallDecay: 0.13,
    wall: 0.82,
    cavityHz: 250,
    cavityDecay: 0.3,
    contact: 0.0018,
    thumpHz: 190,
  },
  // A long open box. Barely a cavity at all, and it is mostly mass.
  trough: {
    ratios: [1, 1.72, 2.44, 3.19],
    wallHz: 165,
    wallDecay: 0.22,
    wall: 0.75,
    cavityHz: 74,
    cavityDecay: 0.35,
    contact: 0.008,
    thumpHz: 62,
  },
  pot: {
    ratios: [1, 2.05, 3.4, 4.72],
    wallHz: 640,
    wallDecay: 0.22,
    wall: 0.7,
    cavityHz: 205,
    cavityDecay: 0.34,
    contact: 0.0022,
    thumpHz: 155,
  },
};

/** What is being done to it. The gesture, not the object. */
export type Handling = 'knock' | 'set-down' | 'fill' | 'pour';

export interface VesselOptions {
  kind?: Vessel;
  handling?: Handling;
  gain?: number;
  /** Size. Below 1 is a bigger vessel: wall and cavity both fall together. */
  tone?: number;
  /**
   * How full it starts, 0..1. Drives the cavity note up, and decides how much
   * water there is to slop about.
   */
  full?: number;
}

/**
 * Semitones the cavity climbs from empty to nearly full. Helmholtz goes as the
 * reciprocal square root of the volume, so this is what `1/sqrt(1 - 0.75)`
 * comes to — a fifth, and it is very audible.
 */
const FILL_RISE = 2;

export function createVessel(engine: AudioEngine, options: VesselOptions = {}): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('vessel built before the noise buffers were ready');

  const kind = KINDS[options.kind ?? 'pail'];
  const handling = options.handling ?? 'knock';
  const tone = options.tone ?? 1;
  const startFull = options.full ?? 0.3;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // The wall: close, inharmonic, and quick.
  const wallModes: Mode[] = kind.ratios.map((ratio, i) => ({
    hz: kind.wallHz * ratio * tone,
    decay: kind.wallDecay * Math.pow(0.72, i),
    level: kind.wall / (1 + i * 0.6),
  }));
  const wall = createModalBank(context, wallModes, output, { ring: 'excitation' });

  // The air. One mode, and it is the one that moves — so it is a filter of its
  // own rather than a member of the bank.
  const cavity = context.createBiquadFilter();
  cavity.type = 'bandpass';
  cavity.frequency.value = kind.cavityHz * tone;
  // High: a Helmholtz resonator is a genuinely narrow thing, which is why an
  // empty bottle has a *note* and a plank does not.
  cavity.Q.value = 14;
  const cavityGain = context.createGain();
  cavityGain.gain.value = 1 - kind.wall;
  cavity.connect(cavityGain).connect(output);

  let level = startFull;
  const pending: AudioNode[] = [];

  /** Where the air sits at a given fullness. See `FILL_RISE`. */
  const cavityAt = (fill: number): number =>
    kind.cavityHz * tone * Math.pow(2, (FILL_RISE * Math.min(fill, 0.95)) / 12) ** 1;

  const strike = (at: number, force: number, contact: number): void => {
    wall.inputs.forEach((input, i) => {
      excite(context, noise.white, input, at, force * wallModes[i].level, contact, contact * 0.4);
    });
    excite(context, noise.white, cavity, at, force * (1 - kind.wall) * 1.6, contact * 2.2);
    thump(context, output, at, force * 0.3, kind.thumpHz * tone, kind.thumpHz * tone * 0.6, 0.06);
  };

  return {
    output,

    fire(at, force) {
      // The air note is set before anything strikes it, so a full pail already
      // sounds full on the first knock rather than on the second.
      cavity.frequency.setValueAtTime(cavityAt(level), at);

      switch (handling) {
        case 'knock': {
          strike(at, force, kind.contact);
          return kind.cavityDecay + 0.2;
        }

        case 'set-down': {
          // Down, then a settle a moment later as it rocks onto its base. Two
          // contacts is what makes it read as put down rather than dropped.
          strike(at, force, kind.contact * 2.4);
          const settle = 0.055 + Math.random() * 0.05;
          strike(at + settle, force * 0.28, kind.contact * 1.6);
          // Whatever is in it carries on moving after the vessel stops.
          if (level > 0.08) {
            const slops = 2 + Math.floor(Math.random() * 3);
            for (let i = 0; i < slops; i++) {
              popBubble(context, output, at + settle + 0.03 + i * 0.06 + Math.random() * 0.04, {
                radius: bubbleRadius(0.004, 0.011),
                level: force * 0.1 * level,
                cycles: 9,
              });
            }
          }
          return kind.cavityDecay + 0.5;
        }

        case 'fill': {
          // The one worth having. Water in, the air volume shrinks, the note
          // climbs — and the stream is bubbles, because entrained air is all
          // that water ever says.
          const seconds = 1.6 + Math.random() * 1.8;
          const from = level;
          const to = Math.min(0.95, from + 0.35 + Math.random() * 0.4);
          cavity.frequency.setValueAtTime(cavityAt(from), at);
          cavity.frequency.linearRampToValueAtTime(cavityAt(to), at + seconds);

          const stream = context.createBufferSource();
          stream.buffer = noise.white;
          const hiss = context.createBiquadFilter();
          hiss.type = 'bandpass';
          hiss.frequency.value = 1100;
          hiss.Q.value = 0.8;
          const streamGain = context.createGain();
          streamGain.gain.setValueAtTime(0, at);
          streamGain.gain.linearRampToValueAtTime(force * 0.09, at + 0.12);
          streamGain.gain.setValueAtTime(force * 0.09, at + seconds - 0.15);
          streamGain.gain.linearRampToValueAtTime(0, at + seconds);
          stream.connect(hiss).connect(streamGain).connect(cavity);
          stream.start(at, Math.random() * Math.max(noise.white.duration - 3, 0));
          stream.stop(at + seconds + 0.05);
          pending.push(hiss, streamGain);

          // Bubbles all the way down, getting smaller as the surface rises to
          // meet the stream.
          const drops = Math.round(seconds * 26);
          for (let i = 0; i < drops; i++) {
            const t = i / drops;
            popBubble(context, cavity, at + 0.05 + t * seconds + Math.random() * 0.03, {
              radius: bubbleRadius(0.0006, 0.0035 * (1 - t * 0.5)),
              level: force * 0.05,
              cycles: 12,
            });
          }
          level = to;
          return seconds + 0.4;
        }

        case 'pour': {
          const seconds = 0.9 + Math.random() * 1.1;
          const from = level;
          const to = Math.max(0, from - 0.4 - Math.random() * 0.4);
          cavity.frequency.setValueAtTime(cavityAt(from), at);
          cavity.frequency.linearRampToValueAtTime(cavityAt(to), at + seconds);
          // Glugging: a pour out of a narrow neck is air going *in*, in gulps,
          // which is why it is periodic and a fill is not.
          const gulps = Math.round(seconds * 7);
          for (let i = 0; i < gulps; i++) {
            popBubble(context, cavity, at + i * (seconds / gulps) + Math.random() * 0.02, {
              radius: bubbleRadius(0.006, 0.014),
              level: force * 0.16,
              cycles: 14,
            });
          }
          level = to;
          return seconds + 0.4;
        }
      }
    },

    dispose() {
      for (const node of pending) node.disconnect();
      pending.length = 0;
      wall.dispose();
      cavity.disconnect();
      cavityGain.disconnect();
      output.disconnect();
    },
  };
}
