import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { createModalBank, type ModalBank, type Mode } from '../dsp/modal';
import { createEventClock, poissonGap, type EventClock } from '../dsp/clock';
import { excite, thump } from '../dsp/impact';

/**
 * A large thin sheet in the wind: corrugated iron, a tarpaulin, an awning, a
 * banner, a loose shutter, a sign on two hooks.
 *
 * A plate's modes are dense and thoroughly inharmonic — nothing about a flat
 * sheet is a small integer ratio — which is why it reads as *sheet* and not as
 * a bell or a bar. There is no fundamental to hear, so the pitch is a size
 * rather than a note.
 *
 * It answers gusts and not wind. Below a threshold it is silent, and that
 * silence is most of the effect: a scrapyard where the metal is always going
 * is a scrapyard nobody can hear the wind arrive at. A hard enough gust makes
 * the sheet let go — one loud crack with the whole plate ringing behind it.
 */

export interface PlateOptions {
  gain?: number;
  /** First mode in Hz. Below 90 is a barn door, above 300 is a road sign. */
  pitch?: number;
  /** Ring-down of the lowest mode, seconds. Long is steel, short is canvas. */
  decay?: number;
  /** Weight of the upper modes, 0..1. Low is heavy plate, high is thin tin. */
  bright?: number;
  /** Gust strength below which it is silent, 0..1. */
  onset?: number;
  /** How readily it lets go with a crack, 0..1. Canvas is high, steel is low. */
  snap?: number;
}

/**
 * Ratios for a rectangular plate. Deliberately none of them small integers:
 * a harmonic set here would read as a struck bar, which is the one thing a
 * sheet is not.
 */
const RATIOS = [1, 1.59, 2.14, 2.65, 3.31, 4.07, 4.86, 6.23];

export function createPlate(engine: AudioEngine, options: PlateOptions = {}): SoundModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('plate built before the noise buffers were ready');

  const pitch = options.pitch ?? 130;
  const decay = options.decay ?? 1.4;
  const bright = options.bright ?? 0.6;
  const onset = options.onset ?? 0.34;
  const snap = options.snap ?? 0.35;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.2;

  const modes: Mode[] = RATIOS.map((ratio, i) => ({
    hz: pitch * ratio,
    // Higher modes lose their energy first, in every real plate.
    decay: decay * Math.pow(0.78, i),
    level: Math.pow(bright, i * 0.55) / (1 + i * 0.35),
  }));
  const bank: ModalBank = createModalBank(context, modes, output, { ring: 'excitation' });

  const clock: EventClock = createEventClock(context);
  const gap = poissonGap(0.4);
  let active = true;
  let strength = 0;

  const rattle = (at: number): void => {
    const over = Math.max(0, (strength - onset) / (1 - onset));
    if (over <= 0.02) return;

    // Every mode from one impulse: that is what makes it one sheet flexing
    // rather than eight resonators agreeing to start together.
    const contact = 0.02 + Math.random() * 0.03;
    const force = 0.12 + over * 0.5;
    bank.inputs.forEach((input, i) => {
      excite(context, noise.white, input, at, force * modes[i].level, contact, 0.008);
    });

    // And now and then it lets go. One hard contact with the whole plate
    // behind it, and it is the only part anybody consciously hears.
    if (Math.random() < snap * over * 0.5) {
      bank.inputs.forEach((input, i) => {
        excite(context, noise.white, input, at + 0.004, (0.7 + over * 0.5) * modes[i].level, 0.0025, 0.0008);
      });
      thump(context, output, at + 0.004, 0.22 * over, pitch * 0.7, pitch * 0.4, 0.09);
    }
  };

  return {
    output,

    setActive(next) {
      active = next;
      if (next) clock.reset();
    },

    update(_dt, audio, at) {
      if (!active) return;
      // The travelling field: a sheet across the yard answers the same gust
      // later than the one beside you.
      strength = audio.weather.strengthAt(at.x, at.z);
      const over = Math.max(0, (strength - onset) / (1 - onset));
      if (over <= 0.02) {
        clock.reset();
        return;
      }
      // Steep, not proportional. Silent, then hurrying.
      gap.rate = 0.3 + over * over * 9;
      clock.pump(rattle, gap, 'oneGap');
    },

    dispose() {
      bank.dispose();
      output.disconnect();
    },
  };
}
