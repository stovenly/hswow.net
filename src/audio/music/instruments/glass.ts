import type { AudioEngine } from '../../AudioEngine';
import { human, hold, type Instrument } from './voice';

/**
 * Glass — a rubbed rim, not a struck one.
 *
 * A wet finger around a wineglass drives the bowl's lowest mode almost alone:
 * the tone is a sine with a whisper of upper modes at 2.3 and 4.2, and there
 * is *no onset at all* — the note swells out of nothing over seconds, which is
 * the entire identity. Give it an attack transient and it becomes a bell.
 *
 * The rim's beating pair and one shared slow tremble are the only motion; a
 * hand keeps almost, but not quite, an even pressure.
 */

export interface GlassOptions {
  gain?: number;
  attack?: number;
  release?: number;
}

/** The bowl's modes, weighted for a driven rim rather than a tap. */
const MODES = [
  { ratio: 1, level: 1 },
  { ratio: 2.3, level: 0.1 },
  { ratio: 4.2, level: 0.04 },
] as const;

export function createGlass(engine: AudioEngine, options: GlassOptions = {}): Instrument {
  const context = engine.context;
  const attack = options.attack ?? 2.4;
  const release = options.release ?? 2.2;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const tremble = context.createGain();
  tremble.gain.value = 1;
  tremble.connect(output);

  const lfo = context.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 3.7;
  const depth = context.createGain();
  depth.gain.value = 0.05;
  lfo.connect(depth).connect(tremble.gain);
  lfo.start();

  return {
    output,

    noteOn(at, freq, velocity, duration = 6) {
      const n = human(context, at, freq, velocity);

      const envelope = context.createGain();
      const stop = hold(envelope.gain, n.at, n.velocity * 0.13, attack, n.at + duration, release);
      envelope.connect(tremble);

      for (const mode of MODES) {
        const f = mode.ratio * n.freq;
        if (f > context.sampleRate * 0.45) continue;
        // The rim is never quite round: a pair a few cents apart, beating.
        for (const cents of [-2.5, 2.5]) {
          const osc = context.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = f;
          osc.detune.value = cents;
          const part = context.createGain();
          part.gain.value = mode.level * 0.5;
          osc.connect(part).connect(envelope);
          osc.start(n.at);
          osc.stop(stop);
        }
      }
    },

    dispose() {
      lfo.stop();
      lfo.disconnect();
      depth.disconnect();
      tremble.disconnect();
      output.disconnect();
    },
  };
}
