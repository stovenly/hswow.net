import type { AudioEngine } from '../../AudioEngine';
import { human, hold, type Instrument } from './voice';

/**
 * Bass — one saw, one lowpass, keytracked.
 *
 * Deliberately the simplest voice in the rack. A bass line's job in this music
 * is weight under the drone, and weight wants no character that would compete
 * with it. Keytracking is the one non-negotiable: a fixed cutoff makes low
 * notes woolly and high notes thin, while a cutoff that follows the note keeps
 * the same *timbre* everywhere on the neck — which is what an instrument is.
 */

export interface BassOptions {
  gain?: number;
  release?: number;
  /**
   * A small filter envelope on the front of each note — the pluck of a finger
   * rather than the swell of a pedal. For the moving roles; a drone stays
   * static.
   */
  sweep?: boolean;
}

export function createBass(engine: AudioEngine, options: BassOptions = {}): Instrument {
  const context = engine.context;
  const release = options.release ?? 0.3;
  const sweep = options.sweep ?? false;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  return {
    output,

    noteOn(at, freq, velocity, duration = 1.2) {
      const n = human(context, at, freq, velocity);

      const osc = context.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = n.freq;

      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.value = 0.9;
      const base = n.freq * (2 + n.velocity * 3);
      if (sweep) {
        filter.frequency.setValueAtTime(base * 2, n.at);
        filter.frequency.exponentialRampToValueAtTime(base, n.at + 0.3);
      } else {
        filter.frequency.value = base;
      }

      const envelope = context.createGain();
      const stop = hold(envelope.gain, n.at, n.velocity * 0.32, 0.03, n.at + duration, release);

      // The weight: a quiet sine at the fundamental, past the filter, so the
      // bottom stays solid whatever the cutoff does.
      const sub = context.createOscillator();
      sub.type = 'sine';
      sub.frequency.value = n.freq;
      const weight = context.createGain();
      weight.gain.value = 0.45;
      sub.connect(weight).connect(envelope);
      sub.start(n.at);
      sub.stop(stop);

      osc.connect(filter).connect(envelope).connect(output);
      osc.start(n.at);
      osc.stop(stop);
    },

    dispose() {
      output.disconnect();
    },
  };
}
