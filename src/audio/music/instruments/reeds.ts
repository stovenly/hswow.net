import type { AudioEngine } from '../../AudioEngine';
import { excite } from '../../dsp/impact';
import { vibrato, type Instrument } from './voice';
import { createMonoPool, type MonoVoice } from './mono';

/**
 * Reeds and pipes — the accordion, the organ and the harmonica, blown by the
 * mono core.
 *
 * All are wind instruments in the way that matters here: held notes joined
 * legato, no re-attack inside a phrase. And all are nearly synthesizers
 * already. A free reed is a bright saw; the musette identity is two reeds
 * beating at a constant few cents, so the beat quickens with pitch — that is
 * the authentic behaviour, not a defect. An organ pipe rank is a drawbar
 * recipe: fixed harmonic weights on one wave, straight tone, a chiff of wind
 * noise where the pipe speaks. The harmonica is the reed with the person
 * still attached: breath in the tone, and every drawn note scooped up into
 * from below.
 */

export interface ReedsOptions {
  gain?: number;
  attack?: number;
  release?: number;
}

function accordionPlayer(context: BaseAudioContext, output: AudioNode): MonoVoice {
  // The bellows' box: a mid bump under a fixed ceiling.
  const body = context.createBiquadFilter();
  body.type = 'peaking';
  body.frequency.value = 500;
  body.Q.value = 1;
  body.gain.value = 2.5;

  const lid = context.createBiquadFilter();
  lid.type = 'lowpass';
  lid.frequency.value = 3200;
  lid.Q.value = 0.7;

  const envelope = context.createGain();
  envelope.gain.value = 0;
  body.connect(lid).connect(envelope).connect(output);

  // Dry musette: the pair holds its cents apart, so the beat rides the pitch.
  const reeds = [-4, 4].map((cents) => {
    const osc = context.createOscillator();
    osc.type = 'sawtooth';
    osc.detune.value = cents;
    osc.connect(body);
    osc.start();
    return osc;
  });

  return {
    envelope,

    tune(at, freq, velocity, glide) {
      for (const reed of reeds) reed.frequency.cancelScheduledValues(at);
      lid.frequency.cancelScheduledValues(at);
      lid.frequency.setTargetAtTime(2200 + velocity * 1400, at, 0.03);
      if (glide) {
        for (const reed of reeds) reed.frequency.setTargetAtTime(freq, at, 0.02);
      } else {
        // The reed speaks slightly flat and rises — the onset sag.
        for (const reed of reeds) {
          reed.frequency.setValueAtTime(freq * 0.994, at);
          reed.frequency.setTargetAtTime(freq, at, 0.04);
        }
      }
    },

    taper(at, release) {
      lid.frequency.setTargetAtTime(1600, at, release / 3);
    },

    dispose() {
      for (const reed of reeds) {
        reed.stop();
        reed.disconnect();
      }
      body.disconnect();
      lid.disconnect();
      envelope.disconnect();
    },
  };
}

/** Half square, half saw — a single free reed is brighter than either alone. */
function harmonicaWave(context: BaseAudioContext): PeriodicWave {
  const HARMONICS = 16;
  const real = new Float32Array(HARMONICS + 1);
  const imag = new Float32Array(HARMONICS + 1);
  for (let n = 1; n <= HARMONICS; n++) {
    imag[n] = 0.5 / n + (n % 2 === 1 ? 0.6 / n : 0);
  }
  return context.createPeriodicWave(real, imag);
}

function harmonicaPlayer(
  context: BaseAudioContext,
  wave: PeriodicWave,
  white: AudioBuffer,
  output: AudioNode,
): MonoVoice {
  const osc = context.createOscillator();
  osc.setPeriodicWave(wave);

  const lid = context.createBiquadFilter();
  lid.type = 'lowpass';
  lid.frequency.value = 2600;
  lid.Q.value = 0.7;

  const envelope = context.createGain();
  envelope.gain.value = 0;
  osc.connect(lid).connect(envelope).connect(output);
  osc.start();

  // Breath in the tone, the flute's manner: a band of air tracking the note,
  // living and dying with the envelope. A harmonica without it is an organ.
  const air = context.createBufferSource();
  air.buffer = white;
  air.loop = true;
  const band = context.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1200;
  band.Q.value = 1.1;
  const wind = context.createGain();
  wind.gain.value = 0;
  air.connect(band).connect(wind).connect(envelope);
  air.start();

  let ceiling = 2600;

  return {
    envelope,

    tune(at, freq, velocity, glide, until) {
      osc.frequency.cancelScheduledValues(at);
      lid.frequency.cancelScheduledValues(at);
      ceiling = 1400 + velocity * 1800;
      if (glide) {
        osc.frequency.setTargetAtTime(freq, at, 0.03);
      } else {
        // The scoop: the draw starts well under the note and bends up into it
        // over the first tenth of a second.
        osc.frequency.setValueAtTime(freq * 0.93, at);
        osc.frequency.setTargetAtTime(freq, at, 0.035);
      }
      lid.frequency.setTargetAtTime(ceiling, at, 0.03);
      band.frequency.setTargetAtTime(Math.min(freq * 2.5, 3800), at, 0.03);
      wind.gain.setTargetAtTime(0.08 + velocity * 0.08, at, 0.05);
      // The hand wah: the cup opens and closes over the tone, pitch holds.
      vibrato(context, lid.frequency, at, until, ceiling * 0.18, 4.4);
    },

    taper(at, release) {
      lid.frequency.setTargetAtTime(Math.max(ceiling * 0.55, 700), at, release / 3);
    },

    dispose() {
      osc.stop();
      osc.disconnect();
      air.stop();
      air.disconnect();
      band.disconnect();
      wind.disconnect();
      lid.disconnect();
      envelope.disconnect();
    },
  };
}

/** A principal rank's weights, descending — enough edge to read as pipes. */
function principalWave(context: BaseAudioContext): PeriodicWave {
  const real = new Float32Array(9);
  const imag = new Float32Array([0, 1, 0.45, 0.28, 0.16, 0.05, 0.06, 0, 0.04]);
  return context.createPeriodicWave(real, imag);
}

function organPlayer(
  context: BaseAudioContext,
  wave: PeriodicWave,
  white: AudioBuffer,
  output: AudioNode,
): MonoVoice {
  const osc = context.createOscillator();
  osc.setPeriodicWave(wave);

  const lid = context.createBiquadFilter();
  lid.type = 'lowpass';
  lid.frequency.value = 3200;
  lid.Q.value = 0.5;

  const envelope = context.createGain();
  envelope.gain.value = 0;
  osc.connect(lid).connect(envelope).connect(output);
  osc.start();

  // The chiff: wind noise around the pipe's third harmonic as it speaks.
  const chiff = context.createBiquadFilter();
  chiff.type = 'bandpass';
  chiff.frequency.value = 1200;
  chiff.Q.value = 6;
  chiff.connect(output);

  return {
    envelope,

    tune(at, freq, velocity, glide) {
      osc.frequency.cancelScheduledValues(at);
      if (glide) {
        osc.frequency.setTargetAtTime(freq, at, 0.02);
      } else {
        osc.frequency.setValueAtTime(freq, at);
        chiff.frequency.setValueAtTime(Math.min(freq * 3, 4000), at);
        excite(context, white, chiff, at, velocity * 0.12, 0.03, 0.005);
      }
    },

    taper() {
      // Pipes do not darken toward the end of a note; the envelope alone closes.
    },

    dispose() {
      osc.stop();
      osc.disconnect();
      lid.disconnect();
      chiff.disconnect();
      envelope.disconnect();
    },
  };
}

export function createAccordion(engine: AudioEngine, options: ReedsOptions = {}): Instrument {
  const context = engine.context;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const pool = createMonoPool(context, () => accordionPlayer(context, output), {
    attack: options.attack ?? 0.06,
    release: options.release ?? 0.3,
    peak: (velocity) => velocity * 0.22,
  });

  return {
    output,

    noteOn(at, freq, velocity, duration = 1.8) {
      pool.note(at, freq, velocity, duration);
    },

    dispose() {
      pool.dispose();
      output.disconnect();
    },
  };
}

export function createHarmonica(engine: AudioEngine, options: ReedsOptions = {}): Instrument {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('harmonica built before the noise buffers were ready');
  const wave = harmonicaWave(context);

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const pool = createMonoPool(
    context,
    () => harmonicaPlayer(context, wave, noise.white, output),
    {
      attack: options.attack ?? 0.07,
      release: options.release ?? 0.35,
      peak: (velocity) => velocity * 0.24,
    },
  );

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

export function createOrgan(engine: AudioEngine, options: ReedsOptions = {}): Instrument {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('organ built before the noise buffers were ready');
  const wave = principalWave(context);

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const pool = createMonoPool(
    context,
    () => organPlayer(context, wave, noise.white, output),
    {
      attack: options.attack ?? 0.05,
      release: options.release ?? 0.3,
      peak: (velocity) => velocity * 0.22,
    },
  );

  return {
    output,

    noteOn(at, freq, velocity, duration = 2.2) {
      pool.note(at, freq, velocity, duration);
    },

    dispose() {
      pool.dispose();
      output.disconnect();
    },
  };
}
