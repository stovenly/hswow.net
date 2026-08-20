import type { AudioEngine } from '../../AudioEngine';
import { human, hold, type Instrument } from './voice';

/**
 * Waterphone — bowed junk metal.
 *
 * A ring of rods on a water-filled pan: nothing about it is harmonic, and
 * bowing one rod wakes its neighbours. So a note is a stack of inharmonic
 * partials under one slow bowed swell, and the water is what happens next —
 * each partial drifts a little as it rings, its own way, so a held note never
 * sits still and a chord smears as it sounds. The bow itself is a narrow band
 * of grip noise that swells and dies with the note.
 *
 * The ratios are deliberately no series at all — near the bell's neighbours
 * but agreeing with nothing, which is where the unease lives.
 */

export interface WaterphoneOptions {
  gain?: number;
  attack?: number;
  release?: number;
}

const PARTIALS: readonly { ratio: number; level: number }[] = [
  { ratio: 1, level: 1 },
  { ratio: 1.34, level: 0.55 },
  { ratio: 2.28, level: 0.42 },
  { ratio: 3.17, level: 0.3 },
  { ratio: 4.11, level: 0.18 },
  { ratio: 5.43, level: 0.1 },
];

export function createWaterphone(engine: AudioEngine, options: WaterphoneOptions = {}): Instrument {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('waterphone built before the noise buffers were ready');
  const white = noise.white;

  const attack = options.attack ?? 1.2;
  const release = options.release ?? 2.2;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // The pan under the rods, and a ceiling over the scrape.
  const pan = context.createBiquadFilter();
  pan.type = 'peaking';
  pan.frequency.value = 180;
  pan.Q.value = 1.2;
  pan.gain.value = 3;

  const lid = context.createBiquadFilter();
  lid.type = 'lowpass';
  lid.frequency.value = 5200;
  lid.Q.value = 0.5;

  pan.connect(lid).connect(output);

  return {
    output,

    noteOn(at, freq, velocity, duration = 4) {
      const n = human(context, at, freq, velocity);
      const top = context.sampleRate * 0.45;
      const until = n.at + Math.max(duration, attack);

      PARTIALS.forEach((partial, i) => {
        const f = n.freq * partial.ratio * (1 + (Math.random() * 2 - 1) * 0.03);
        if (f > top) return;

        const osc = context.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        // The water: each partial bends its own way as it rings, slowly and
        // once — a tilt of the pan, not a vibrato.
        const wander = (Math.random() * 2 - 1) * (15 + Math.random() * 30);
        osc.detune.setValueAtTime(0, n.at);
        osc.detune.linearRampToValueAtTime(wander, until + release);

        // The higher rods wake later under the bow.
        const envelope = context.createGain();
        const level = n.velocity * partial.level * 0.14;
        const off = hold(envelope.gain, n.at, level, attack * (1 + i * 0.15), until, release);

        osc.connect(envelope).connect(pan);
        osc.start(n.at);
        osc.stop(off);
      });

      // The bow's grip, swelling and dying with the note.
      const air = context.createBufferSource();
      air.buffer = white;
      air.loop = true;
      const grip = context.createBiquadFilter();
      grip.type = 'bandpass';
      grip.frequency.value = Math.min(n.freq * 2.2, 3800);
      grip.Q.value = 2.5;
      const bow = context.createGain();
      const off = hold(bow.gain, n.at, n.velocity * 0.045, attack, until, release);
      air.connect(grip).connect(bow).connect(pan);
      air.start(n.at);
      air.stop(off);
    },

    dispose() {
      pan.disconnect();
      lid.disconnect();
      output.disconnect();
    },
  };
}
