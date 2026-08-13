import type { AudioEngine } from '../../AudioEngine';
import { vibrato, type Instrument } from './voice';
import { createMonoPool, type MonoVoice } from './mono';

/**
 * The whistler — not an instrument, a person.
 *
 * A whistle is nearly a sine, which is exactly why it is hard: with no
 * spectrum to hide in, everything human has to live in the pitch and the air.
 * So the tone is a sine with one faint overtone, and the person is built from
 * four habits: a scoop up into every phrase start, portamento through the
 * joins, a slow wander that never lets the pitch sit dead still, and vibrato
 * that only arrives once the note has been held a while — idling, not
 * performing. The breath is a narrow band of noise around the tone itself,
 * because the hiss of a whistle *is* the note escaping.
 *
 * Two players, not three: a person has one mouth, and the second exists only
 * so a legato join has somewhere to land.
 */

export interface WhistlerOptions {
  gain?: number;
  attack?: number;
  release?: number;
}

/** Nearly pure — one faint octave is all the lips leak. */
function whistleWave(context: BaseAudioContext): PeriodicWave {
  const real = new Float32Array([0, 0, 0]);
  const imag = new Float32Array([0, 1, 0.04]);
  return context.createPeriodicWave(real, imag);
}

function whistlePlayer(
  context: BaseAudioContext,
  wave: PeriodicWave,
  white: AudioBuffer,
  output: AudioNode,
): MonoVoice {
  const osc = context.createOscillator();
  osc.setPeriodicWave(wave);

  const lid = context.createBiquadFilter();
  lid.type = 'lowpass';
  lid.frequency.value = 2400;
  lid.Q.value = 0.5;

  const envelope = context.createGain();
  envelope.gain.value = 0;
  osc.connect(lid).connect(envelope).connect(output);
  osc.start();

  // The air: noise in a narrow band riding the note, inside the envelope so
  // it lives and dies with the whistle instead of hissing between phrases.
  const air = context.createBufferSource();
  air.buffer = white;
  air.loop = true;
  const band = context.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1200;
  band.Q.value = 2;
  const breath = context.createGain();
  breath.gain.value = 0;
  air.connect(band).connect(breath).connect(envelope);
  air.start();

  let sounding = 1200;

  return {
    envelope,

    tune(at, freq, velocity, glide, until) {
      sounding = freq;
      osc.frequency.cancelScheduledValues(at);
      if (glide) {
        // Portamento: the pitch travels through the join, never steps.
        osc.frequency.setTargetAtTime(freq, at, 0.055);
      } else {
        // The scoop — every phrase starts under and slides up into the note.
        osc.frequency.setValueAtTime(freq * 0.96, at);
        osc.frequency.setTargetAtTime(freq, at, 0.035);
      }
      lid.frequency.setTargetAtTime(freq * (2 + velocity), at, 0.03);
      band.frequency.setTargetAtTime(freq, at, 0.03);
      // Harder blowing is airier before it is louder.
      breath.gain.setTargetAtTime(0.04 + velocity * 0.06, at, 0.05);
      // The idle vibrato, arriving late, over a wander that never quite stops.
      vibrato(context, osc.detune, at, until, 16, 4.6);
      vibrato(context, osc.detune, at, until, 7, 0.45);
    },

    taper(at, release) {
      // The last of the breath falls off the note as the lips relax.
      osc.frequency.setTargetAtTime(sounding * 0.985, at + release * 0.3, release / 2);
      lid.frequency.setTargetAtTime(1400, at, release / 3);
    },

    dispose() {
      osc.stop();
      osc.disconnect();
      air.stop();
      air.disconnect();
      band.disconnect();
      breath.disconnect();
      lid.disconnect();
      envelope.disconnect();
    },
  };
}

export function createWhistler(engine: AudioEngine, options: WhistlerOptions = {}): Instrument {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('whistler built before the noise buffers were ready');

  const wave = whistleWave(context);
  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const pool = createMonoPool(context, () => whistlePlayer(context, wave, noise.white, output), {
    voices: 2,
    attack: options.attack ?? 0.08,
    release: options.release ?? 0.3,
    peak: (velocity) => velocity * 0.26,
  });

  return {
    output,

    noteOn(at, freq, velocity, duration = 1.6) {
      pool.note(at, freq, velocity, duration);
    },

    dispose() {
      pool.dispose();
      output.disconnect();
    },
  };
}
