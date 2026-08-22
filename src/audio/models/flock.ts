import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { createCall, type CallShape } from '../oneshots/call';
import { createEventClock, poissonGap, type EventClock } from '../dsp/clock';

/**
 * Many of one thing, all calling at once and none of them saying anything you
 * could pick out: a rookery, gulls over a tip, starlings coming in, a pond of
 * frogs, a colony of bats.
 *
 * The structure is `crowd.ts`'s and for the same reason — **the pauses do the
 * work**. Each throat runs a few calls and then stops for a second or three,
 * and the overlapping of those pauses is what produces the swell and ebb of a
 * flock. Six throats is plenty and twelve is worse, because past a handful the
 * ear stops counting and starts hearing a texture, and a texture needs no
 * further voices to pay for.
 *
 * Frogs get the one extra thing worth having: they **entrain**. A chorus pulls
 * itself into phase over a few seconds, holds, and then falls apart again, and
 * nothing else in the library does that.
 */

export interface FlockOptions {
  /** The call every throat here makes. */
  shape: CallShape;
  gain?: number;
  /** How many throats. Six is a rookery; three is a corner of one. */
  voices?: number;
  /** How much of the time each one is calling, 0..1. */
  density?: number;
  /** Spread of size across the flock, 0..1. */
  variety?: number;
  /** How far off, as a lowpass in Hz. Lower is further and duller. */
  distance?: number;
  /**
   * How hard they pull into step, 0..1. Zero is birds, which never do; a pond
   * of frogs is around 0.6 and is the only reason this exists.
   */
  entrain?: number;
}

interface Throat {
  shot: ReturnType<typeof createCall>;
  clock: EventClock;
  gap: ReturnType<typeof poissonGap>;
  /** Calls left before this one takes a breath. */
  left: number;
  /** Its own phase in the chorus, 0..1. Only used when entraining. */
  phase: number;
}

export function createFlock(engine: AudioEngine, options: FlockOptions): SoundModel {
  const context = engine.context;

  const count = Math.max(1, options.voices ?? 5);
  const density = options.density ?? 0.4;
  const variety = options.variety ?? 0.35;
  const entrain = options.entrain ?? 0;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.14;

  // One lowpass over the lot. A flock heard close enough to resolve into
  // individuals is not a flock, it is a list.
  const far = context.createBiquadFilter();
  far.type = 'lowpass';
  far.frequency.value = options.distance ?? 2600;
  far.Q.value = 0.6;
  far.connect(output);

  const throats: Throat[] = Array.from({ length: count }, (_, i) => {
    // Each throat its own size, or a flock is one bird played five times.
    const tone = 1 + (i / Math.max(count - 1, 1) - 0.5) * 2 * variety * 0.35;
    const shot = createCall(engine, { shape: options.shape, tone, gain: 1 / Math.sqrt(count) });
    shot.output.connect(far);
    return {
      shot,
      clock: createEventClock(context),
      gap: poissonGap(density * 0.7),
      left: 1 + Math.floor(Math.random() * 4),
      phase: Math.random(),
    };
  });

  let active = true;
  /** How much the chorus is currently agreeing with itself, 0..1. */
  let together = 0;
  let drift = 0;

  return {
    output,

    setActive(next) {
      active = next;
      if (next) for (const throat of throats) throat.clock.reset();
    },

    update(dt) {
      if (!active) return;

      if (entrain > 0) {
        // Slowly in, then out again. A pond that stays locked is a metronome
        // and a pond that never locks is not a pond.
        drift += dt * 0.05;
        together = entrain * (0.5 + 0.5 * Math.sin(drift));
      }

      for (const throat of throats) {
        throat.clock.pump(
          (at) => {
            const busy = throat.shot.fire(at, 0.5 + Math.random() * 0.5);
            throat.left -= 1;
            if (throat.left > 0) {
              // Mid-phrase: the next one follows close behind.
              throat.gap.rate = 1 / Math.max(busy + 0.08, 0.1);
            } else {
              // A breath. This is the part that gives the flock its shape.
              throat.left = 1 + Math.floor(Math.random() * 4);
              throat.gap.rate = density / (1.2 + Math.random() * 2.5);
            }
            // Entrainment pulls the gap toward the shared period rather than
            // toward a shared instant, which is how a real chorus locks.
            if (together > 0.01) {
              const shared = 1 / Math.max(density, 0.05);
              throat.gap.rate =
                throat.gap.rate * (1 - together) + (1 / shared) * together;
            }
          },
          throat.gap,
          'oneGap',
        );
      }
    },

    dispose() {
      for (const throat of throats) throat.shot.dispose();
      throats.length = 0;
      far.disconnect();
      output.disconnect();
    },
  };
}
