import type { AudioEngine } from '../../AudioEngine';
import { excite } from '../../dsp/impact';
import { human, vibrato, type Instrument } from './voice';

/**
 * Jaw harp — one plucked reed, and the mouth is the filter.
 *
 * The reed has one pitch and never retunes: the played note is folded down to
 * a fixed low octave and the reed twangs there, rich in harmonics, while the
 * melody lives in a formant — a narrow band that sweeps up to the written
 * note and sits on it, the mouth opening around the harmonic it wants. The
 * fold is by octaves, so the selected note is always a harmonic the reed
 * actually has.
 *
 * The instrument is one dial from cartoon, and the dial is the sweep: it
 * arrives in about a tenth of a second and the wobble after it is small.
 * Anything faster and deeper is a sound effect.
 */

export interface JawHarpOptions {
  gain?: number;
  /** Seconds the twang takes to fall away. */
  decay?: number;
}

/** The reed's home octave. Every played note folds down into it. */
const REED = 110;

export function createJawHarp(engine: AudioEngine, options: JawHarpOptions = {}): Instrument {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('jaw harp built before the noise buffers were ready');
  const white = noise.white;

  const decay = options.decay ?? 0.9;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // The frame against the teeth: no bottom, a soft ceiling.
  const frame = context.createBiquadFilter();
  frame.type = 'highpass';
  frame.frequency.value = 90;
  frame.Q.value = 0.6;

  const lid = context.createBiquadFilter();
  lid.type = 'lowpass';
  lid.frequency.value = 3600;
  lid.Q.value = 0.5;

  frame.connect(lid).connect(output);

  return {
    output,

    noteOn(at, freq, velocity) {
      const n = human(context, at, freq, velocity);
      // Fold to the reed's octave; the octave count is which harmonic speaks.
      const k = Math.min(Math.max(Math.round(Math.log2(n.freq / REED)), 0), 3);
      const fund = n.freq / 2 ** k;
      const seconds = decay * (0.9 + Math.random() * 0.2);

      const osc = context.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = fund;

      const envelope = context.createGain();
      envelope.gain.setValueAtTime(0, n.at);
      envelope.gain.linearRampToValueAtTime(1, n.at + 0.003);
      envelope.gain.exponentialRampToValueAtTime(0.0005, n.at + seconds);

      // The mouth: a narrow band sweeping up onto the wanted harmonic. The
      // upper harmonics of a saw are quieter, so the mouth makes up for what
      // the reed gives it less of.
      const mouth = context.createBiquadFilter();
      mouth.type = 'bandpass';
      mouth.frequency.setValueAtTime(n.freq * 0.65, n.at);
      mouth.frequency.setTargetAtTime(n.freq, n.at + 0.01, 0.045);
      mouth.Q.value = 6.5;
      const voiced = context.createGain();
      voiced.gain.value = n.velocity * 0.4 * (1 + k * 0.45);
      // The small wobble after arrival — the jaw settling, not a siren.
      vibrato(context, mouth.frequency, n.at + 0.15, n.at + seconds, n.freq * 0.03, 4.5);

      // The reed itself under the formant, dark and quiet.
      const reed = context.createBiquadFilter();
      reed.type = 'lowpass';
      reed.frequency.value = 240;
      reed.Q.value = 0.7;
      const felt = context.createGain();
      felt.gain.value = n.velocity * 0.2;

      osc.connect(envelope);
      envelope.connect(mouth);
      envelope.connect(reed);
      mouth.connect(voiced).connect(frame);
      reed.connect(felt).connect(frame);
      osc.start(n.at);
      osc.stop(n.at + seconds + 0.05);

      // The thumb on the reed.
      excite(context, white, mouth, n.at, n.velocity * 0.12, 0.004, 0.001);
    },

    dispose() {
      frame.disconnect();
      lid.disconnect();
      output.disconnect();
    },
  };
}
