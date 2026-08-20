import type { AudioEngine } from '../../AudioEngine';
import { vibrato, type Instrument } from './voice';
import { createMonoPool, type MonoVoice } from './mono';

/**
 * Flute — a narrow pulse squeezed to nearly a sine, blown by the mono core.
 *
 * A real flute is almost all fundamental. A saw has every harmonic and
 * whatever survives the lowpass is still a ladder of them, so the source is a
 * 40 % pulse instead: it starts hollow, sparse harmonics weighted low, and the
 * same ceiling leaves a rounder tone.
 *
 * The counter-intuitive parts that matter:
 *
 * - **Vibrato goes on brightness, not pitch.** A flautist varies breath
 *   pressure, and pressure moves the tone before it moves the tuning. The LFO
 *   rides the lowpass cutoff at 5–6 Hz and the pitch stays put.
 * - **The ceiling barely tracks the note.** Real flute brightness is nearly
 *   absolute — around 2 kHz — so high notes get *purer*, not brighter.
 * - **No breath noise.** Broadband hiss reads as synth-plus-noise, not flute.
 *
 * The bottle is the exception that proves it: a blown pipe or bottle is mostly
 * air, so `breath` exists for that one preset. The flute never asks for it.
 */

export interface FluteOptions {
  gain?: number;
  attack?: number;
  release?: number;
  /** 'pulse' is the flute; 'round' is nearly a sine — the ocarina's vessel tone. */
  wave?: 'pulse' | 'round';
  /** Cap on the brightness ceiling, Hz. */
  ceiling?: number;
  /** Sung vibrato: pitch moves with the tone, the ocarina way. */
  sing?: boolean;
  /** Wind in the tone, 0..1. The flute refuses it; a blown bottle is made of it. */
  breath?: number;
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

/** Nearly a sine — a vessel resonates one mode, and overtones barely exist. */
function roundWave(context: BaseAudioContext): PeriodicWave {
  const real = new Float32Array([0, 0, 0, 0]);
  const imag = new Float32Array([0, 1, 0.08, 0.025]);
  return context.createPeriodicWave(real, imag);
}

interface Breath {
  amount: number;
  white: AudioBuffer;
}

function flutePlayer(
  context: BaseAudioContext,
  wave: PeriodicWave,
  output: AudioNode,
  cap: number,
  sing: boolean,
  breath: Breath | undefined,
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

  // Wind runs into the same envelope as the tone, so it lives and dies with
  // the note rather than hissing between phrases. Its band tracks the note —
  // broadband hiss is a synth, air moving around an edge is an instrument.
  let air: AudioBufferSourceNode | undefined;
  let band: BiquadFilterNode | undefined;
  let wind: GainNode | undefined;
  if (breath) {
    air = context.createBufferSource();
    air.buffer = breath.white;
    air.loop = true;
    band = context.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 900;
    band.Q.value = 1.2;
    wind = context.createGain();
    wind.gain.value = 0;
    air.connect(band).connect(wind).connect(envelope);
    air.start();
  }

  let ceiling = 1500;

  return {
    envelope,

    tune(at, freq, velocity, glide, until) {
      osc.frequency.cancelScheduledValues(at);
      high.frequency.cancelScheduledValues(at);
      low.frequency.cancelScheduledValues(at);
      ceiling = Math.min(cap, 500 + freq * 1.1) * (0.9 + velocity * 0.25);
      if (glide) {
        osc.frequency.setTargetAtTime(freq, at, 0.02);
        high.frequency.setTargetAtTime(freq * 0.6, at, 0.02);
        low.frequency.setTargetAtTime(ceiling, at, 0.02);
      } else {
        osc.frequency.setValueAtTime(freq, at);
        high.frequency.setValueAtTime(freq * 0.6, at);
        low.frequency.setValueAtTime(ceiling, at);
      }
      // Breath-pressure vibrato: the cutoff breathes. The flute's pitch stays
      // put; the ocarina's leans with it, because the vessel has no register
      // to brace against.
      vibrato(context, low.frequency, at, until, ceiling * (sing ? 0.1 : 0.14), 5.5);
      if (sing) vibrato(context, osc.detune, at, until, 10, 5);

      if (breath && band && wind) {
        band.frequency.setTargetAtTime(Math.min(freq * 2.2, 4000), at, 0.03);
        wind.gain.setTargetAtTime(breath.amount * (0.5 + velocity * 0.5), at, 0.05);
      }
    },

    taper(at, release) {
      low.frequency.setTargetAtTime(Math.max(ceiling * 0.55, 400), at, release / 3);
    },

    dispose() {
      osc.stop();
      osc.disconnect();
      if (air) {
        air.stop();
        air.disconnect();
      }
      band?.disconnect();
      wind?.disconnect();
      high.disconnect();
      low.disconnect();
      envelope.disconnect();
    },
  };
}

export function createFlute(engine: AudioEngine, options: FluteOptions = {}): Instrument {
  const context = engine.context;
  const wave = options.wave === 'round' ? roundWave(context) : pulseWave(context);
  const cap = options.ceiling ?? 2100;
  const sing = options.sing ?? false;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  let breath: Breath | undefined;
  if (options.breath) {
    if (!engine.noise) throw new Error('a blown pipe built before the noise buffers were ready');
    breath = { amount: options.breath, white: engine.noise.white };
  }

  const pool = createMonoPool(context, () => flutePlayer(context, wave, output, cap, sing, breath), {
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

/** The blown bottle: the vessel tone with the top gone and the air left in. */
export const createPipe = (engine: AudioEngine, options: FluteOptions = {}): Instrument =>
  createFlute(engine, {
    wave: 'round',
    ceiling: 900,
    breath: 0.09,
    attack: 0.2,
    release: 0.6,
    ...options,
  });

/** The vessel: a near-sine that sings its vibrato instead of breathing it. */
export const createOcarina = (engine: AudioEngine, options: FluteOptions = {}): Instrument =>
  createFlute(engine, {
    wave: 'round',
    ceiling: 1500,
    sing: true,
    attack: 0.09,
    release: 0.35,
    ...options,
  });
