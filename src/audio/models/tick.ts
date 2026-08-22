import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { createModalBank, type ModalBank } from '../dsp/modal';
import { createEventClock, periodicGap, type EventClock } from '../dsp/clock';
import { excite } from '../dsp/impact';

/**
 * Something small and hard, at a rate: a clock escapement, an insulator, a
 * cooling engine, a car body letting go of the day's heat.
 *
 * Continuous rather than a one-shot per tick, because at one a second through a
 * pool of voices a clock costs more in scheduling than it does in sound. Here
 * the whole thing is two resonances and a clock.
 *
 * `cooling` is the one that earns its place. A steel body at dusk ticks fast at
 * first and slows as it gives up its heat, over minutes, and settles into
 * silence — so a scrapyard at sunset does something a scrapyard at noon does
 * not, and it costs one exponential.
 */

export interface TickOptions {
  gain?: number;
  /** Seconds between ticks. A clock is 1, a cooling panel starts near 0.3. */
  every?: number;
  /** The body's resonance in Hz. High and small is glass, low is a case. */
  pitch?: number;
  /** Ring-down in seconds. Short: this is a click, not a chime. */
  decay?: number;
  /** Alternates loud and quiet, 0..1. An escapement is not even-handed. */
  swing?: number;
  /**
   * Seconds for the rate to fall by a factor of e. Absent keeps time forever,
   * which is what a clock does and a cooling engine does not.
   */
  cooling?: number;
}

export function createTick(engine: AudioEngine, options: TickOptions = {}): SoundModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('tick built before the noise buffers were ready');

  const every = options.every ?? 1;
  const pitch = options.pitch ?? 2400;
  const decay = options.decay ?? 0.06;
  const swing = options.swing ?? 0.35;
  const cooling = options.cooling;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.1;

  // Two modes and no more. A click is identified by its band, not its spectrum.
  const bank: ModalBank = createModalBank(
    context,
    [
      { hz: pitch, decay, level: 1 },
      { hz: pitch * 2.71, decay: decay * 0.55, level: 0.35 },
    ],
    output,
    { ring: 'excitation' },
  );

  const clock: EventClock = createEventClock(context);
  // Periodic, and it wanders a little: nothing physical keeps time perfectly,
  // and a train the ear can predict exactly stops being heard.
  const gap = periodicGap(every, 0.02);

  let active = true;
  let beat = 0;
  let since = 0;

  return {
    output,

    setActive(next) {
      active = next;
      if (next) {
        clock.reset();
        since = 0;
      }
    },

    update(dt) {
      if (!active) return;
      if (cooling !== undefined) {
        since += dt;
        // Slowing toward stopped. Capped rather than allowed to run away, so a
        // panel left alone for an hour is silent rather than firing once a year.
        gap.rate = Math.min(every * Math.exp(since / cooling), every * 60);
      }
      clock.pump((at) => {
        beat = 1 - beat;
        const force = 0.5 * (1 - swing * beat);
        bank.inputs.forEach((input, i) => {
          excite(context, noise.white, input, at, force * (i === 0 ? 1 : 0.35), 0.0016, 0.0006);
        });
      }, gap, 'oneGap');
    },

    dispose() {
      bank.dispose();
      output.disconnect();
    },
  };
}
