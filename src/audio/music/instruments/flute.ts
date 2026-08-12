import type { AudioEngine } from '../../AudioEngine';
import { vibrato, type Instrument } from './voice';
import { createMonoPool, type MonoVoice } from './mono';

/**
 * Flute — a narrow pulse squeezed to nearly a sine, blown by the mono core.
 *
 * A real flute is almost all fundamental, and the shrillness lived in starting
 * from a saw: a saw has every harmonic, and whatever survives the lowpass is
 * still a ladder of them. A 40 % pulse starts hollow — sparse harmonics,
 * weighted low — so the same ceiling leaves a rounder tone.
 *
 * The counter-intuitive parts that matter:
 *
 * - **Vibrato goes on brightness, not pitch.** A flautist varies breath
 *   pressure, and pressure moves the tone before it moves the tuning. The LFO
 *   rides the lowpass cutoff at 5–6 Hz and the pitch stays put.
 * - **The ceiling barely tracks the note.** Real flute brightness is nearly
 *   absolute — around 2 kHz — so high notes get *purer*, not brighter.
 * - **No breath noise.** Broadband hiss reads as synth-plus-noise, not flute.
 */

export interface FluteOptions {
  gain?: number;
  attack?: number;
  release?: number;
}

/** A 40 % duty pulse. Phase is inaudible, so sine terms alone carry it. */
function pulseWave(context: BaseAudioContext): PeriodicWave {
  const HARMONICS = 24;
  const real = new Float32Array(HARMONICS + 1);
  const imag = new Float32Array(HARMONICS + 1);
  for (let n = 1; n <= HARMONICS; n++) {
    imag[n] = (2 / (n * Math.PI)) * Math.sin(Math.PI * n * 0.4);
  }
  return context.createPeriodicWave(real, imag);
}

function flutePlayer(
  context: BaseAudioContext,
  wave: PeriodicWave,
  output: AudioNode,
): MonoVoice {
  const osc = context.createOscillator();
  osc.setPeriodicWave(wave);

  // Thins the bottom so the fundamental is present but not woolly. Below the
  // note, not at it — at the note it eats the tone.
  const high = context.createBiquadFilter();
  high.type = 'highpass';
  high.frequency.value = 260;
  high.Q.value = 0.6;

  const low = context.createBiquadFilter();
  low.type = 'lowpass';
  low.frequency.value = 1500;
  low.Q.value = 0.7;

  const envelope = context.createGain();
  envelope.gain.value = 0;

  osc.connect(high).connect(low).connect(envelope).connect(output);
  osc.start();

  let ceiling = 1500;

  return {
    envelope,

    tune(at, freq, velocity, glide, until) {
      osc.frequency.cancelScheduledValues(at);
      high.frequency.cancelScheduledValues(at);
      low.frequency.cancelScheduledValues(at);
      ceiling = Math.min(2100, 500 + freq * 1.1) * (0.9 + velocity * 0.25);
      if (glide) {
        osc.frequency.setTargetAtTime(freq, at, 0.02);
        high.frequency.setTargetAtTime(freq * 0.6, at, 0.02);
        low.frequency.setTargetAtTime(ceiling, at, 0.02);
      } else {
        osc.frequency.setValueAtTime(freq, at);
        high.frequency.setValueAtTime(freq * 0.6, at);
        low.frequency.setValueAtTime(ceiling, at);
      }
      // Breath-pressure vibrato: the cutoff breathes, the pitch does not.
      vibrato(context, low.frequency, at, until, ceiling * 0.14, 5.5);
    },

    taper(at, release) {
      low.frequency.setTargetAtTime(Math.max(ceiling * 0.55, 400), at, release / 3);
    },

    dispose() {
      osc.stop();
      osc.disconnect();
      high.disconnect();
      low.disconnect();
      envelope.disconnect();
    },
  };
}

export function createFlute(engine: AudioEngine, options: FluteOptions = {}): Instrument {
  const context = engine.context;
  const wave = pulseWave(context);

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const pool = createMonoPool(context, () => flutePlayer(context, wave, output), {
    attack: options.attack ?? 0.15,
    release: options.release ?? 0.45,
    peak: (velocity) => velocity * 0.3,
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
