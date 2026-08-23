import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { excite } from '../dsp/impact';

/**
 * Pressure let go somewhere across a works: a valve lifting, a line being
 * blown down.
 *
 * Air through an orifice is noise whose centre sits with the pressure behind
 * it, so the band starts high and **falls as the vessel empties** — which is
 * the one thing that separates a blow-off from a gain fader on hiss. Under it
 * a lowpassed roar, because the same release moves the whole duct.
 */

export interface VentOptions {
  gain?: number;
  /** Size of the opening. Below 1 is a bigger valve: lower and longer. */
  size?: number;
}

const FROM_HZ = 2600;
const TO_HZ = 650;

function between(range: readonly [number, number]): number {
  return range[0] + Math.random() * (range[1] - range[0]);
}

export function createVent(engine: AudioEngine, options: VentOptions = {}): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('vent built before the noise buffers were ready');

  const size = options.size ?? 1;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.4;

  const jet = context.createBiquadFilter();
  jet.type = 'bandpass';
  jet.frequency.value = FROM_HZ * size;
  jet.Q.value = 1.1;
  const jetLevel = context.createGain();
  jetLevel.gain.value = 0;
  jet.connect(jetLevel).connect(output);

  const duct = context.createBiquadFilter();
  duct.type = 'lowpass';
  duct.frequency.value = 320 * size;
  duct.Q.value = 0.8;
  const ductLevel = context.createGain();
  ductLevel.gain.value = 0;
  duct.connect(ductLevel).connect(output);

  const pending: AudioNode[] = [];
  let cleanup = 0;

  return {
    output,

    fire(at, force) {
      const hold = between([0.8, 2.8]) / size;
      const rise = between([0.05, 0.12]);
      const fall = between([0.3, 0.6]);
      const end = at + rise + hold + fall;

      const white = context.createBufferSource();
      white.buffer = noise.white;
      white.connect(jet);
      white.start(at, Math.random() * Math.max(noise.white.duration - (end - at) - 0.1, 0));
      white.stop(end + 0.1);

      const pink = context.createBufferSource();
      pink.buffer = noise.pink;
      pink.connect(duct);
      pink.start(at, Math.random() * Math.max(noise.pink.duration - (end - at) - 0.1, 0));
      pink.stop(end + 0.1);

      jet.frequency.setValueAtTime(FROM_HZ * size, at);
      jet.frequency.exponentialRampToValueAtTime(TO_HZ * size, end);

      for (const [level, peak] of [
        [jetLevel, force],
        [ductLevel, force * 0.7],
      ] as const) {
        level.gain.setValueAtTime(0, at);
        level.gain.linearRampToValueAtTime(peak, at + rise);
        // The pressure falls through the hold, so the level does too.
        level.gain.exponentialRampToValueAtTime(peak * 0.45, at + rise + hold);
        level.gain.linearRampToValueAtTime(0, end);
      }

      // The valve lifting: one broadband chuff at the front.
      excite(context, noise.white, output, at, force * 0.5, 0.04, 0.004);

      window.clearTimeout(cleanup);
      cleanup = window.setTimeout(
        () => {
          for (const node of pending) node.disconnect();
          pending.length = 0;
        },
        (end - at + 0.5) * 1000,
      );
      return end - at + 0.1;
    },

    dispose() {
      window.clearTimeout(cleanup);
      jet.disconnect();
      jetLevel.disconnect();
      duct.disconnect();
      ductLevel.disconnect();
      output.disconnect();
    },
  };
}
