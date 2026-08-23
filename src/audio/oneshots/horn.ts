import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';

/**
 * A works horn, heard across the whole site.
 *
 * A steam horn is a chord, not a note — two or three pipes sounded together —
 * and each pipe is driven hard enough to be mostly odd harmonics. Pressure
 * takes a moment to build, so the pitch **scoops up** into the note and sags
 * out of it, and there is breath under the tone the whole way through. The
 * scoop is the part that makes it a horn rather than an organ.
 */

export interface HornOptions {
  gain?: number;
  /** Fundamental, Hz. */
  pitch?: number;
  /** Size, as a multiplier on the whole thing. Below 1 is bigger and lower. */
  tone?: number;
}

/** The chord: the second pipe a fifth up, the third nearly an octave. */
const PIPES: readonly { ratio: number; level: number }[] = [
  { ratio: 1, level: 1 },
  { ratio: 1.498, level: 0.55 },
  { ratio: 2.01, level: 0.3 },
];

const CURVE = (() => {
  const points = 2048;
  const curve = new Float32Array(points);
  const k = 2.6;
  for (let i = 0; i < points; i++) {
    const x = (i / (points - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * k) / Math.tanh(k);
  }
  return curve;
})();

function between(range: readonly [number, number]): number {
  return range[0] + Math.random() * (range[1] - range[0]);
}

export function createHorn(engine: AudioEngine, options: HornOptions = {}): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('horn built before the noise buffers were ready');

  const pitch = (options.pitch ?? 340) * (options.tone ?? 1);

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.4;

  const level = context.createGain();
  level.gain.value = 0;
  level.connect(output);

  const bell = context.createBiquadFilter();
  bell.type = 'bandpass';
  bell.frequency.value = pitch * 2.2;
  bell.Q.value = 1.6;
  const bellLevel = context.createGain();
  bellLevel.gain.value = 0.6;
  bell.connect(bellLevel).connect(level);

  const direct = context.createGain();
  direct.gain.value = 0.5;
  direct.connect(level);

  const saturate = context.createWaveShaper();
  saturate.curve = CURVE;
  saturate.oversample = '2x';
  saturate.connect(bell);
  saturate.connect(direct);

  const breath = context.createBiquadFilter();
  breath.type = 'bandpass';
  breath.frequency.value = pitch * 4;
  breath.Q.value = 0.9;
  const breathLevel = context.createGain();
  breathLevel.gain.value = 0.1;
  breath.connect(breathLevel).connect(level);

  const pending: AudioNode[] = [];
  let cleanup = 0;

  const blast = (at: number, force: number): number => {
    const rise = 0.14;
    const hold = between([1.2, 2.6]);
    const fall = 0.38;
    const end = at + rise + hold + fall;

    for (const pipe of PIPES) {
      const osc = context.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = pitch * pipe.ratio;
      // The scoop in and the sag out, in cents so every pipe moves together.
      osc.detune.setValueAtTime(-260, at);
      osc.detune.linearRampToValueAtTime(0, at + rise * 1.4);
      osc.detune.setValueAtTime(0, end - fall);
      osc.detune.linearRampToValueAtTime(-180, end);
      const pre = context.createGain();
      pre.gain.value = pipe.level * 1.7;
      osc.connect(pre).connect(saturate);
      osc.start(at);
      osc.stop(end + 0.05);
      pending.push(pre);
    }

    const air = context.createBufferSource();
    air.buffer = noise.white;
    air.connect(breath);
    air.start(at, Math.random() * Math.max(noise.white.duration - (end - at) - 0.1, 0));
    air.stop(end + 0.05);

    level.gain.setValueAtTime(0, at);
    level.gain.linearRampToValueAtTime(force, at + rise);
    level.gain.setValueAtTime(force, end - fall);
    level.gain.linearRampToValueAtTime(0, end);

    return end - at;
  };

  return {
    output,

    fire(at, force) {
      const blasts = Math.random() < 0.35 ? 2 : 1;
      let cursor = at;
      for (let i = 0; i < blasts; i++) cursor += blast(cursor, force) + 0.45;
      const busy = cursor - at;

      window.clearTimeout(cleanup);
      cleanup = window.setTimeout(
        () => {
          for (const node of pending) node.disconnect();
          pending.length = 0;
        },
        (busy + 0.5) * 1000,
      );
      return busy;
    },

    dispose() {
      window.clearTimeout(cleanup);
      for (const node of pending) node.disconnect();
      pending.length = 0;
      saturate.disconnect();
      bell.disconnect();
      bellLevel.disconnect();
      direct.disconnect();
      breath.disconnect();
      breathLevel.disconnect();
      level.disconnect();
      output.disconnect();
    },
  };
}
