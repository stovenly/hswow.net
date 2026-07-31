import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { createModalBank } from '../dsp/modal';
import { excite, thump } from '../dsp/impact';

/**
 * Hammer on anvil.
 *
 * Steel struck by steel: a set of long, bright, thoroughly inharmonic modes
 * over a short dull thud. The thud is the blow, the modes are the anvil, and the
 * ratio between them is whether the smith is working hot iron (soft, damped, the
 * ring swallowed) or cold (a bell).
 *
 * ## The phrase is the model
 *
 * A single clang is a sound effect. What makes this read as *a blacksmith two
 * streets away* is the rhythm: smiths strike a heavy blow and then let the
 * hammer bounce — two or three lighter taps against the anvil face, each faster
 * and quieter than the last, before the next blow. It is one of the most
 * recognisable work rhythms there is, and it costs three extra scheduled
 * impacts.
 *
 * The falling interval matters as much as the falling level. Real hammer bounce
 * accelerates, because each rebound is shorter than the one before it.
 */

/**
 * Anvil partials.
 *
 * Deliberately non-harmonic — no ratio here is a small integer. Harmonic
 * partials read as a musical instrument, which a lump of steel is not, and the
 * inharmonicity is most of what separates "anvil" from "bell".
 *
 * The long ones are up around 1–3 kHz, which is exactly the band the wind
 * model's shelf exists to tame. Fine here: it is a brief event and the
 * brightness is the point, but it is why the emitter wants a real `maxDistance`
 * rather than being heard across a whole village.
 */
const ANVIL = [
  { hz: 512, decay: 0.3, level: 0.4 },
  { hz: 1183, decay: 0.85, level: 0.72 },
  { hz: 1794, decay: 1.15, level: 1 },
  { hz: 2741, decay: 0.7, level: 0.5 },
  { hz: 4310, decay: 0.4, level: 0.28 },
];

export interface HammerOptions {
  gain?: number;
  /** Shifts every partial. Below 1 is a bigger anvil. */
  tone?: number;
  /**
   * How much the work damps the anvil, 0..1.
   *
   * Hot iron on the face soaks up the ring; an empty anvil sings. Above about
   * 0.6 this stops being a smith and starts being a carpenter.
   */
  damping?: number;
  /** Rebounds after the blow. Zero is a single strike. */
  bounces?: number;
}

export function createHammer(engine: AudioEngine, options: HammerOptions = {}): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('hammer built before the noise buffers were ready');

  const tone = options.tone ?? 1;
  const damping = Math.min(0.9, Math.max(0, options.damping ?? 0.3));
  const bounces = options.bounces ?? 2;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.7;

  const bank = createModalBank(
    context,
    ANVIL.map((mode) => ({
      hz: mode.hz * tone,
      decay: mode.decay * (1 - damping),
      level: mode.level,
    })),
    output,
  );

  /** One contact: excite every mode together, plus the weight of the blow. */
  const blow = (at: number, force: number, hard: boolean): void => {
    // Excitation length is contact hardness. A struck blow is steel on steel
    // and about as short as contacts get; a rebound is glancing and softer.
    const contact = hard ? 0.0022 : 0.0035;
    bank.inputs.forEach((input, i) => {
      excite(context, noise.white, input, at, force * ANVIL[i].level, contact);
    });
    // The mass behind it. Without this an anvil is bright and weightless — all
    // ring and no arm.
    thump(context, output, at, force * (hard ? 0.5 : 0.16), 165 * tone, 62 * tone, 0.075, 0.003);
  };

  return {
    output,

    fire(at, force) {
      blow(at, force, true);

      // Accelerating, decaying rebounds. The gap shrinks by a third each time
      // and the level by rather more, because a bouncing hammer loses energy
      // fast and the smith's hand is already lifting.
      let offset = 0.13 + Math.random() * 0.05;
      let level = force * 0.3;
      for (let i = 0; i < bounces; i++) {
        blow(at + offset, level * (0.7 + Math.random() * 0.5), false);
        offset += (0.13 + Math.random() * 0.05) * Math.pow(0.66, i + 1);
        level *= 0.5;
      }

      // Busy until the longest mode has died. The bank is shared across every
      // strike this voice makes, so overlapping two would ring one anvil twice
      // rather than ringing two anvils.
      return offset + 1.3 * (1 - damping) + 0.2;
    },

    dispose() {
      bank.dispose();
      output.disconnect();
    },
  };
}
