import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise } from '../noise';

/**
 * Something thin singing in the wind: chainlink, fence wire, rigging, a
 * telegraph line.
 *
 * Air past a cylinder sheds vortices alternately off each side at a rate set by
 * the Strouhal number, `f ≈ 0.2 · U / d` — so a 3 mm wire at 8 m/s sings near
 * 530 Hz, and **the pitch climbs with the wind**. That rise is the whole
 * effect. A fence that only gets louder is a fader.
 *
 * Shedding also grows more coherent as it speeds up, so the tone emerges out of
 * the hiss rather than fading in beside it: `Q` and the sine's share both rise
 * with speed. Below a threshold there is nothing at all, because below it the
 * flow does not separate.
 */

export interface WireOptions {
  gain?: number;
  /** Diameter in metres. 0.003 is fence wire, 0.012 a rope, 0.03 a pipe. */
  diameter?: number;
  /** Wind speed at full strength, in m/s. What `strength` 1 means here. */
  topSpeed?: number;
  /** How many strands. Each takes its own diameter, so a fence is a chord. */
  strands?: number;
  /** Wind strength below which it is silent, 0..1. */
  onset?: number;
}

export interface WireModel extends SoundModel {
  /** Wind strength, 0..1. Sets pitch, coherence and level together. */
  setWind(strength: number): void;
}

/** Strouhal number for a cylinder in the range this cares about. */
const STROUHAL = 0.2;

export function createWire(engine: AudioEngine, options: WireOptions = {}): WireModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('wire built before the noise buffers were ready');

  const diameter = options.diameter ?? 0.003;
  const topSpeed = options.topSpeed ?? 16;
  const onset = options.onset ?? 0.18;
  const strands = Math.max(1, options.strands ?? 3);

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.1;

  const voices = Array.from({ length: strands }, () => {
    // Each strand its own gauge, so a fence is several tones and not one.
    const gauge = diameter * (0.8 + Math.random() * 0.5);
    const band = context.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 600;
    band.Q.value = 2;
    band.connect(output);

    const level = context.createGain();
    level.gain.value = 0;
    level.connect(band);
    const hiss = playNoise(context, noise.white, level);

    return { gauge, band, level, hiss };
  });

  let strength = 0;
  let active = true;

  const apply = (): void => {
    const now = context.currentTime;
    // Steep rather than proportional, the way every wind-answering thing here
    // is: silent, then hurrying.
    const over = Math.max(0, (strength - onset) / (1 - onset));
    const drive = over * over;

    for (const voice of voices) {
      const speed = strength * topSpeed;
      const hz = Math.min((STROUHAL * speed) / voice.gauge, 11000);
      voice.band.frequency.setTargetAtTime(Math.max(hz, 80), now, 0.14);
      // Coherence: the faster it sheds the more it agrees with itself, so the
      // tone comes out of the hiss rather than arriving beside it.
      voice.band.Q.setTargetAtTime(2 + drive * 16, now, 0.2);
      voice.level.gain.setTargetAtTime(drive / strands, now, 0.12);
    }
  };

  apply();

  return {
    output,

    setWind(value) {
      strength = Math.min(1, Math.max(0, value));
    },

    setActive(next) {
      active = next;
    },

    update(_dt, audio, at) {
      if (!active) return;
      // The travelling field, not the global reading: a fence downwind meets
      // the same gust later than the one you are standing at.
      strength = audio.weather.strengthAt(at.x, at.z);
      apply();
    },

    dispose() {
      for (const voice of voices) {
        voice.hiss.stop();
        voice.level.disconnect();
        voice.band.disconnect();
      }
      voices.length = 0;
      output.disconnect();
    },
  };
}
