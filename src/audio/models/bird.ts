import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { createCall, type CallShape } from '../oneshots/call';

/**
 * A small bird at a fixed point, calling now and then.
 *
 * The synthesis is `oneshots/call.ts` — one syrinx in the project, not two.
 * This is the part that decides *when*: bursts with long irregular silences,
 * and quiet in strong wind, as real birds are.
 *
 * A zone that wants a particular species declares an ambience vibe instead;
 * this is the generic garden bird for a place that only wants one somewhere.
 */

export interface BirdOptions {
  /** Centre of the pitch range, Hz. Small birds are high. */
  pitch?: number;
  gain?: number;
  /** Average seconds between calls. */
  interval?: number;
  /** Wind strength above which it stops calling. */
  shySpeed?: number;
  /** Lowpass in Hz. Lower reads as further away. */
  tone?: number;
}

/**
 * Unremarkable on purpose: a few clear notes with the last one running down.
 * Anything with a name lives in the ambience book.
 */
const GARDEN: CallShape = {
  pitch: 2400,
  variance: 0.14,
  phrase: [
    { from: 1, to: 1.1, length: [0.07, 0.12], gap: [0.04, 0.08], drive: 0.28 },
    { from: 1.22, to: 1.06, length: [0.06, 0.1], gap: [0.03, 0.07], drive: 0.3 },
    { from: 0.96, to: 0.8, length: [0.05, 0.09], gap: [0.03, 0.06], drive: 0.34 },
    {
      from: 0.88,
      to: 0.72,
      length: [0.05, 0.08],
      gap: [0.02, 0.05],
      drive: 0.4,
      trill: { hz: 24, cents: 100 },
    },
  ],
  count: [2, 5],
  formant: 3000,
};

export function createBird(engine: AudioEngine, options: BirdOptions = {}): SoundModel {
  const context = engine.context;

  const interval = options.interval ?? 7;
  const shySpeed = options.shySpeed ?? 0.72;

  const output = context.createGain();
  output.gain.value = 1;

  /**
   * A lowpass standing in for distance. Air absorbs high frequencies far faster
   * than low, so distance is heard as dullness first and quietness second;
   * level alone reads as a quiet thing that is close.
   */
  const distance = context.createBiquadFilter();
  distance.type = 'lowpass';
  distance.frequency.value = options.tone ?? 3200;
  distance.Q.value = 0.5;
  distance.connect(output);

  const shot = createCall(engine, {
    shape: { ...GARDEN, pitch: options.pitch ?? GARDEN.pitch },
    gain: options.gain ?? 0.16,
  });
  shot.output.connect(distance);

  let active = true;
  let nextCall = 0;

  return {
    output,

    setActive(next) {
      active = next;
      if (next) nextCall = 0;
    },

    update(_dt, audio, at) {
      if (!active) return;
      const now = context.currentTime;
      if (nextCall < now) nextCall = now + Math.random() * interval;
      if (nextCall > now + 0.2) return;

      if (audio.weather.strengthAt(at.x, at.z) < shySpeed) {
        const busy = shot.fire(nextCall, 0.65 + Math.random() * 0.35);
        // Bouts. A third of the time the bird answers itself a beat later;
        // otherwise it goes quiet for a while. A single exponential wait
        // spreads calls too evenly — real ones cluster.
        nextCall =
          nextCall +
          busy +
          (Math.random() < 0.34
            ? 0.4 + Math.random() * 2.2
            : -Math.log(1 - Math.random()) * interval);
      } else {
        nextCall = now + 1.5;
      }
    },

    dispose() {
      shot.dispose();
      distance.disconnect();
      output.disconnect();
    },
  };
}
