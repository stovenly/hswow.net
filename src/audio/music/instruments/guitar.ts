import type { AudioEngine } from '../../AudioEngine';
import { createPluck, type PluckInstrument } from './pluck';

/**
 * Electric guitar — the pluck through a waveshaper and a cabinet.
 *
 * The string already exists: `createPluck` is a bright, long-decay waveguide,
 * which is exactly what a solid-body guitar is before the amplifier. What
 * makes it *electric* is entirely downstream and entirely native — a `tanh`
 * waveshaper for the amp (drive is pre-gain into a fixed curve, the way an
 * amp's input stage works) and a lowpass for the cabinet, because a speaker
 * cone stops caring above a few kilohertz and that rolloff is most of what
 * separates "distorted guitar" from "distorted anything".
 *
 * Velocity still matters through distortion — not as level, which the
 * clipping compresses away, but as the brightness of the pick reaching the
 * amp, which is how real dynamics survive a driven stage too.
 */

export interface GuitarOptions {
  gain?: number;
  /** Amp drive, 0..1. Low is break-up, high is saturation. */
  drive?: number;
}

/** The amp curve, computed once. `tanh` — soft knees, no corners. */
function ampCurve(): Float32Array<ArrayBuffer> {
  const points = 257;
  const curve = new Float32Array(points);
  for (let i = 0; i < points; i++) {
    const x = (i / (points - 1)) * 2 - 1;
    curve[i] = Math.tanh(2.8 * x);
  }
  return curve;
}

export function createGuitar(engine: AudioEngine, options: GuitarOptions = {}): PluckInstrument {
  const context = engine.context;
  const drive = options.drive ?? 0.5;

  const string = createPluck(engine, { decay: 3.2, bright: 0.55, voices: 4, gain: 0.5 });

  // What reaches the amp is already dark — distortion multiplies whatever
  // top it is fed, so the tone control belongs *before* the clip.
  const tame = context.createBiquadFilter();
  tame.type = 'lowpass';
  tame.frequency.value = 2600;
  tame.Q.value = 0.6;

  const pre = context.createGain();
  pre.gain.value = 1 + drive * 10;

  const shaper = context.createWaveShaper();
  shaper.curve = ampCurve();
  // Clipping makes harmonics above Nyquist out of anything it is fed;
  // oversampling is what keeps them from folding back down as grit.
  shaper.oversample = '2x';

  // Make-up the other way: the harder the drive, the more the clip levels out.
  const post = context.createGain();
  post.gain.value = 0.5 / (1 + drive * 2);

  const body = context.createBiquadFilter();
  body.type = 'highpass';
  body.frequency.value = 95;
  body.Q.value = 0.6;

  // Two poles of cabinet: a speaker cone's rolloff is steep, and clipping
  // fizz survives anything shallower.
  const cab = context.createBiquadFilter();
  cab.type = 'lowpass';
  cab.frequency.value = 3200;
  cab.Q.value = 0.7;

  const cone = context.createBiquadFilter();
  cone.type = 'lowpass';
  cone.frequency.value = 4200;
  cone.Q.value = 0.5;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.4;

  string.output
    .connect(tame)
    .connect(pre)
    .connect(shaper)
    .connect(post)
    .connect(body)
    .connect(cab)
    .connect(cone)
    .connect(output);

  return {
    output,
    ready: string.ready,

    get usingFaust() {
      return string.usingFaust;
    },

    noteOn(at, freq, velocity) {
      string.noteOn(at, freq, velocity);
    },

    dispose() {
      string.dispose();
      tame.disconnect();
      pre.disconnect();
      shaper.disconnect();
      post.disconnect();
      body.disconnect();
      cab.disconnect();
      cone.disconnect();
      output.disconnect();
    },
  };
}
