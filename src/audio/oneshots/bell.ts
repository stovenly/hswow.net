import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { excite } from '../dsp/impact';

/**
 * A bell, additive rather than modal.
 *
 * `dsp/modal.ts` is the right tool for almost everything struck and the wrong
 * one here. Its argument is that a resonator sharp enough to ring for a long
 * time has no bandwidth left to carry timbre — and for wood, stone or iron
 * that is fatal, because the noise *is* the material. A bell's partials
 * genuinely are near-pure sines and they ring for ten or twenty seconds, so
 * the thing modal synthesis loses is the thing a bell does not have. An
 * oscillator per partial with its own exponential decay is also cheaper,
 * exactly controllable, and numerically safe in a way a biquad at Q 600 is not.
 *
 * Two things make it a bell, and both are in the table below.
 *
 * **The minor third.** A tuned church bell's partials are deliberately not
 * harmonic: hum at 0.5, prime at 1, tierce at 1.2 — a minor third above the
 * strike note — then the quint at 1.5 and the nominal at 2. That flat third is
 * why bells sound solemn, and why a bell on a harmonic series is an organ pipe.
 *
 * **The strike note is not there.** What you hear as the pitch of a big bell is
 * the nominal, an octave up, which the ear folds down into a virtual pitch no
 * partial occupies. So the apparent pitch survives the low partials being
 * filtered away by distance, and a bell two miles off still has a note.
 *
 * Every partial is doubled and detuned by a fraction of a percent. Real bells
 * are never perfectly axisymmetric, so each mode splits into two and they beat
 * against each other at a fraction of a hertz. Without it the tail is dead.
 */

export interface Partial {
  /** Ratio to the strike note. */
  ratio: number;
  /** Decay as a fraction of the bell's longest. */
  decay: number;
  level: number;
}

/**
 * The tuned-bell partial series.
 *
 * Low partials ring far longer than high ones — which is why a bell gets darker
 * and purer as it dies, and why a bell whose partials all decay together sounds
 * like a synthesiser patch of a bell.
 *
 * Shared with the melodic bell in `music/instruments/bell.ts` — the tuning of
 * a bell is a fact about bells, not about which system rang one.
 */
export const PARTIALS: readonly Partial[] = [
  { ratio: 0.5, decay: 1, level: 0.5 }, // hum
  { ratio: 1, decay: 0.72, level: 0.85 }, // prime — the strike note
  { ratio: 1.2, decay: 0.55, level: 0.7 }, // tierce — the minor third
  { ratio: 1.5, decay: 0.42, level: 0.45 }, // quint
  { ratio: 2, decay: 0.35, level: 1 }, // nominal — the perceived pitch
  { ratio: 2.5, decay: 0.2, level: 0.3 },
  { ratio: 2.67, decay: 0.17, level: 0.26 },
  { ratio: 3.0, decay: 0.13, level: 0.22 },
  { ratio: 4.0, decay: 0.09, level: 0.16 },
  { ratio: 5.33, decay: 0.06, level: 0.1 },
  { ratio: 6.4, decay: 0.04, level: 0.07 },
];

export interface BellOptions {
  gain?: number;
  /** Strike note in Hz. A tower bell is 100–250; a handbell 600–1200. */
  hz?: number;
  /** Longest partial's decay, in seconds. Big bells run 15–25. */
  decay?: number;
  /** Level of the clapper against the ring, 0..1. */
  strike?: number;
  /** Beat depth as a fraction of a percent. Zero is a dead, synthetic tail. */
  warble?: number;
  /** Strokes per ring. Two is a bell being tolled; one is a single stroke. */
  strokes?: number;
  /** Seconds between strokes. */
  interval?: number;
}

export function createBell(engine: AudioEngine, options: BellOptions = {}): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('bell built before the noise buffers were ready');

  const hz = options.hz ?? 168;
  const decay = options.decay ?? 14;
  const strikeLevel = options.strike ?? 0.4;
  const warble = options.warble ?? 1;
  const strokes = Math.max(1, options.strokes ?? 1);
  const interval = options.interval ?? 2.4;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // The clapper: a short bright transient, straight to the output rather than
  // through anything. It is only a few milliseconds and it is what makes the
  // bell sound *hit* rather than faded in — remove it and the partials arrive
  // out of nowhere.
  const clapper = context.createBiquadFilter();
  clapper.type = 'bandpass';
  clapper.frequency.value = hz * 9;
  clapper.Q.value = 1.6;
  clapper.connect(output);

  /** One partial, one oscillator, one envelope. Both self-terminating. */
  const ring = (at: number, ratio: number, seconds: number, level: number, cents: number): void => {
    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = hz * ratio;
    osc.detune.value = cents;

    const envelope = context.createGain();
    envelope.gain.setValueAtTime(level, at);
    // Exponential to a floor rather than to zero — `exponentialRampToValueAtTime`
    // cannot reach zero, and a partial that ends at a finite value would step.
    envelope.gain.exponentialRampToValueAtTime(level * 0.0005, at + seconds);

    osc.connect(envelope).connect(output);
    osc.start(at);
    osc.stop(at + seconds + 0.02);
  };

  const strike = (at: number, force: number): number => {
    excite(context, noise.white, clapper, at, force * strikeLevel, 0.004);

    let longest = 0;
    for (const partial of PARTIALS) {
      // A little variation per stroke, because a clapper never lands twice in
      // the same place and the partials it excites are never in quite the same
      // proportion. Small — this is a rung bell, not a different bell.
      const level = force * partial.level * 0.14 * (0.85 + Math.random() * 0.3);
      const seconds = decay * partial.decay * (0.9 + Math.random() * 0.2);
      // The split pair. Detune scales with the partial index so the upper
      // partials beat faster, which is what real asymmetry does.
      const cents = warble * partial.ratio * 1.6;
      ring(at, partial.ratio, seconds, level, -cents);
      ring(at, partial.ratio, seconds, level, cents);
      longest = Math.max(longest, seconds);
    }
    return longest;
  };

  return {
    output,

    fire(at, force) {
      let tail = 0;
      for (let i = 0; i < strokes; i++) {
        const when = at + i * interval * (1 + (Math.random() * 2 - 1) * 0.02);
        tail = when - at + strike(when, force * (i === 0 ? 1 : 0.9));
      }
      return tail;
    },

    dispose() {
      clapper.disconnect();
      output.disconnect();
    },
  };
}
