import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise, type NoiseVoice } from '../noise';

/**
 * A chimney, a flue, a vent, a gap under a door.
 *
 * **Not a pipe.** `waveguide.ts` models something with a length, and a length
 * gives a pitch and a harmonic series over it — which is a flute, and a chimney
 * is not a flute. A flue is tapered, sooted, full of bends and open at both
 * ends, so it has no standing wave worth the name: two very broad resonances,
 * no harmonic relationship between them, and nothing you could hum.
 *
 * What it does have is two flows that answer different things, and getting them
 * apart is the whole model:
 *
 * - **The draw.** Warm air going up because there is a fire under it. Steady,
 *   very low, and it has nothing to do with the weather at all — a lit hearth
 *   pulls whether or not it is blowing outside.
 * - **The buffet.** Wind crossing the *top*, which does not blow down the flue
 *   so much as suck across it and let go. That is why a chimney moans in slow
 *   swells rather than tracking the gust: the pressure at the opening is
 *   unstable, and it takes a second or two to build and collapse.
 *
 * The moan is the part everybody recognises and it is the part a pipe cannot
 * do, because a pipe answers its excitation immediately and this lags it.
 */

export interface FlueOptions {
  gain?: number;
  /** The flue's lowest resonance in Hz. Below 60 is a stack; above 200 a vent. */
  size?: number;
  /** How much fire is under it, 0..1. Drives the draw and nothing else. */
  draw?: number;
  /** How exposed the top is, 0..1. Drives the buffet and nothing else. */
  exposure?: number;
  /** Soot and bends, 0..1. High is dull and dead; low is bare brick. */
  sooted?: number;
}

export interface FlueModel extends SoundModel {
  /** How much fire is under it, 0..1. */
  setDraw(value: number): void;
}

/** No harmonic relationship. A flue with a note in it is a flute. */
const RESONANCES = [1, 2.63];

export function createFlue(engine: AudioEngine, options: FlueOptions = {}): FlueModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('flue built before the noise buffers were ready');

  const size = options.size ?? 90;
  const exposure = options.exposure ?? 0.6;
  const sooted = options.sooted ?? 0.5;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.16;

  const bands: BiquadFilterNode[] = [];
  const feed = context.createGain();
  RESONANCES.forEach((ratio, i) => {
    const band = context.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = size * ratio;
    // Broad. A sharp filter here would give the chimney a note, which is the
    // one thing this file exists to avoid.
    band.Q.value = 2.2 - sooted * 1.1;
    const level = context.createGain();
    level.gain.value = 1 / (1 + i * 1.4);
    feed.connect(band).connect(level).connect(output);
    bands.push(band);
  });

  // The draw: brown, slow, and independent of the weather.
  const drawFilter = context.createBiquadFilter();
  drawFilter.type = 'lowpass';
  drawFilter.frequency.value = size * 1.6;
  const drawGain = context.createGain();
  drawGain.gain.value = 0;
  drawFilter.connect(drawGain).connect(output);

  const buffet = context.createGain();
  buffet.gain.value = 0;
  buffet.connect(feed);

  const voices: NoiseVoice[] = [
    playNoise(context, noise.brown, drawFilter),
    playNoise(context, noise.pink, buffet),
  ];

  let draw = options.draw ?? 0.5;
  let active = true;
  /**
   * The buffet's own state, integrated rather than read. Pressure at the mouth
   * of a flue builds and collapses over a second or two, so it lags the gust —
   * which is exactly why a chimney swells instead of tracking the wind.
   */
  let pressure = 0;

  return {
    output,

    setDraw(value) {
      draw = Math.min(1, Math.max(0, value));
    },

    setActive(next) {
      active = next;
    },

    update(dt, audio, at) {
      if (!active) return;
      const now = context.currentTime;
      const wind = audio.weather.strengthAt(at.x, at.z);

      // Steep, and lagged. The exponent is what keeps a chimney silent in a
      // breeze and moaning in a gale rather than humming in between.
      const target = Math.pow(wind, 3) * exposure;
      pressure += (target - pressure) * Math.min(1, dt / 1.6);

      buffet.gain.setTargetAtTime(pressure * 0.5, now, 0.5);
      drawGain.gain.setTargetAtTime(draw * 0.28, now, 1.2);
      // Under load the flue's effective length shortens as the flow speeds up,
      // so the moan rises a little as it gets going.
      bands.forEach((band, i) => {
        band.frequency.setTargetAtTime(size * RESONANCES[i] * (1 + pressure * 0.12), now, 0.7);
      });
    },

    dispose() {
      for (const voice of voices) voice.stop();
      voices.length = 0;
      for (const band of bands) band.disconnect();
      bands.length = 0;
      feed.disconnect();
      buffet.disconnect();
      drawFilter.disconnect();
      drawGain.disconnect();
      output.disconnect();
    },
  };
}
