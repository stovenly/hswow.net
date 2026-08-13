import type { AudioEngine } from '../../AudioEngine';
import { excite } from '../../dsp/impact';
import { vibrato, type Instrument } from './voice';
import { createMonoPool, type MonoVoice } from './mono';

/**
 * The bowed pair — the fiddle and the musical saw, bowed by the mono core.
 *
 * A bow is a breath that does not run out: a bowed phrase is one bow direction
 * the way a wind phrase is one lungful, so both voices live on persistent
 * players and read legato from timing, and re-attacking a join would be the
 * same harsh stop-start the winds were cured of.
 *
 * These are the book's benders. A join's glide speed belongs to the voice, not
 * the pool: the fiddle shifts fast, a finger moving along a string, and the
 * saw travels slow, because the blade has to bend its whole body to the next
 * pitch. Both start a phrase *under* the note — the fiddle settles the last
 * few cents as the bow takes, the saw rises in from a third below and never
 * quite stops moving.
 */

export interface BowedOptions {
  gain?: number;
  attack?: number;
  release?: number;
}

function fiddlePlayer(context: BaseAudioContext, white: AudioBuffer, output: AudioNode): MonoVoice {
  const osc = context.createOscillator();
  osc.type = 'sawtooth';

  // The body, as two formant peaks: the air mode low, the bridge hill high.
  // A raw saw is a synth; a saw heard through these two windows is a box.
  const air = context.createBiquadFilter();
  air.type = 'peaking';
  air.frequency.value = 300;
  air.Q.value = 1.2;
  air.gain.value = 4;

  const bridge = context.createBiquadFilter();
  bridge.type = 'peaking';
  bridge.frequency.value = 2500;
  bridge.Q.value = 1.8;
  bridge.gain.value = 5;

  const lid = context.createBiquadFilter();
  lid.type = 'lowpass';
  lid.frequency.value = 3400;
  lid.Q.value = 0.6;

  const envelope = context.createGain();
  envelope.gain.value = 0;
  osc.connect(air).connect(bridge).connect(lid).connect(envelope).connect(output);
  osc.start();

  // The bow's own noise where the hair first grips, phrase starts only.
  const bow = context.createBiquadFilter();
  bow.type = 'bandpass';
  bow.frequency.value = 3200;
  bow.Q.value = 1.4;
  bow.connect(envelope);

  let ceiling = 3400;

  return {
    envelope,

    tune(at, freq, velocity, glide, until) {
      osc.frequency.cancelScheduledValues(at);
      lid.frequency.cancelScheduledValues(at);
      ceiling = 1900 + velocity * 1700;
      if (glide) {
        // A finger moving along the string: fast, but a travelled distance.
        osc.frequency.setTargetAtTime(freq, at, 0.06);
      } else {
        // The onset settles: a few cents under, sliding true as the bow takes.
        osc.frequency.setValueAtTime(freq * 0.99, at);
        osc.frequency.setTargetAtTime(freq, at, 0.05);
        bow.frequency.setValueAtTime(Math.min(freq * 6, 4200), at);
        excite(context, white, bow, at, velocity * 0.09, 0.09, 0.02);
      }
      lid.frequency.setTargetAtTime(ceiling, at, 0.03);
      // Pitch vibrato, and `vibrato` already makes it arrive late — the player
      // finds the note first and leans into it after.
      vibrato(context, osc.detune, at, until, 14, 5.2);
    },

    taper(at, release) {
      lid.frequency.setTargetAtTime(Math.max(ceiling * 0.5, 900), at, release / 3);
    },

    dispose() {
      osc.stop();
      osc.disconnect();
      air.disconnect();
      bridge.disconnect();
      lid.disconnect();
      bow.disconnect();
      envelope.disconnect();
    },
  };
}

/** Nearly a sine — a bent blade rings one mode, with one faint memory of steel. */
function bladeWave(context: BaseAudioContext): PeriodicWave {
  const real = new Float32Array([0, 0, 0, 0]);
  const imag = new Float32Array([0, 1, 0, 0.07]);
  return context.createPeriodicWave(real, imag);
}

function sawPlayer(context: BaseAudioContext, wave: PeriodicWave, output: AudioNode): MonoVoice {
  const osc = context.createOscillator();
  osc.setPeriodicWave(wave);

  const lid = context.createBiquadFilter();
  lid.type = 'lowpass';
  lid.frequency.value = 2600;
  lid.Q.value = 0.5;

  const envelope = context.createGain();
  envelope.gain.value = 0;
  osc.connect(lid).connect(envelope).connect(output);
  osc.start();

  return {
    envelope,

    tune(at, freq, velocity, glide, until) {
      osc.frequency.cancelScheduledValues(at);
      if (glide) {
        // The blade has to travel.
        osc.frequency.setTargetAtTime(freq, at, 0.2);
      } else {
        // Every phrase rises in from a third below and searches upward.
        osc.frequency.setValueAtTime(freq * 0.84, at);
        osc.frequency.setTargetAtTime(freq, at, 0.09);
      }
      lid.frequency.setTargetAtTime(1600 + velocity * 1200, at, 0.05);
      // Deep and slow — the wobble of a sheet of steel, not a player's hand.
      vibrato(context, osc.detune, at, until, 30, 3.2);
    },

    taper(at, release) {
      lid.frequency.setTargetAtTime(1200, at, release / 3);
    },

    dispose() {
      osc.stop();
      osc.disconnect();
      lid.disconnect();
      envelope.disconnect();
    },
  };
}

export function createFiddle(engine: AudioEngine, options: BowedOptions = {}): Instrument {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('fiddle built before the noise buffers were ready');

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const pool = createMonoPool(context, () => fiddlePlayer(context, noise.white, output), {
    attack: options.attack ?? 0.18,
    release: options.release ?? 0.6,
    peak: (velocity) => velocity * 0.26,
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

export function createSaw(engine: AudioEngine, options: BowedOptions = {}): Instrument {
  const context = engine.context;
  const wave = bladeWave(context);

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const pool = createMonoPool(context, () => sawPlayer(context, wave, output), {
    attack: options.attack ?? 0.3,
    release: options.release ?? 1,
    peak: (velocity) => velocity * 0.28,
  });

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
