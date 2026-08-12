import type { AudioEngine } from '../../AudioEngine';
import { createFormantBank, type Formant } from '../../dsp/formant';
import { human, hold, vibrato, type Instrument } from './voice';

/**
 * Choir — a detuned saw pair through the formant bank, holding one dark vowel.
 *
 * The source-filter split `dsp/formant` exists for: the saws are the vocal
 * folds, the bank is the mouth. What makes it a *background* choir is that
 * **the vowel is frozen** — the classic string-machine choirs fixed one vowel
 * per registration, because a mouth that moves between vowels is a voice
 * *saying something*, and anything saying something is foreground. Each note
 * breathes the shape by a few percent, which is a section never quite singing
 * the same "aah" twice, and no note ever wanders toward the bright nasal
 * vowels.
 *
 * The bank is shared by every sounding note, which is right: a section sings
 * one vowel at a time, together. The lowpass above the formants takes off the
 * saw edge the bank lets through.
 */

export interface ChoirOptions {
  gain?: number;
  release?: number;
}

/** A dark "aah" — the choir vowel, gently resonant, nothing nasal. */
const AAH: readonly Formant[] = [
  { hz: 660, q: 4, level: 1 },
  { hz: 1120, q: 12, level: 0.36 },
  { hz: 2440, q: 25, level: 0.18 },
];

export function createChoir(engine: AudioEngine, options: ChoirOptions = {}): Instrument {
  const context = engine.context;
  const release = options.release ?? 0.7;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const veil = context.createBiquadFilter();
  veil.type = 'lowpass';
  veil.frequency.value = 3500;
  veil.Q.value = 0.5;
  veil.connect(output);

  const bank = createFormantBank(context, AAH, veil);

  return {
    output,

    noteOn(at, freq, velocity, duration = 3) {
      const n = human(context, at, freq, velocity);

      // The breath in the vowel: the same shape, never quite the same place.
      const shape = AAH.map((formant) => ({
        ...formant,
        hz: formant.hz * (1 + (Math.random() * 2 - 1) * 0.03),
      }));
      bank.shape(shape, n.at, Math.min(duration * 0.7, 2.8));

      const envelope = context.createGain();
      const stop = hold(envelope.gain, n.at, n.velocity * 0.3, 0.6, n.at + duration, release);
      envelope.connect(bank.input);

      for (const cents of [-6, 6]) {
        const osc = context.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = n.freq;
        osc.detune.value = cents + (Math.random() * 2 - 1) * 2;
        // One LFO per saw at its own rate — two singers, not one singer twice.
        vibrato(context, osc.detune, n.at, n.at + duration, 6, 4.8);
        osc.connect(envelope);
        osc.start(n.at);
        osc.stop(stop);
      }
    },

    dispose() {
      bank.dispose();
      veil.disconnect();
      output.disconnect();
    },
  };
}
