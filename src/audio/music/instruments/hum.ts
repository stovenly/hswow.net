import type { AudioEngine } from '../../AudioEngine';
import { human, hold, type Instrument } from './voice';

/**
 * Hum — a transformer that happens to be in tune.
 *
 * Mains hum is magnetostriction at twice the line frequency: a stiff buzz of
 * *odd* harmonics with an octave ghost over it, and two windings never quite
 * agreeing. The beat between them is the give-away, so the pair is offset by a
 * fixed fraction of a hertz rather than by cents — a real transformer's beat
 * does not speed up because the note went up, and cents would make it do
 * exactly that. The second winding sits well under the first, so the beat is a
 * sway in the tone and never a null in it.
 *
 * The flutter over the top is load: the thing is doing work, and the work
 * varies.
 */

export interface HumOptions {
  gain?: number;
  attack?: number;
  release?: number;
}

/** Odd harmonics only, falling away — a laminated core, not a reed. */
function coreWave(context: BaseAudioContext): PeriodicWave {
  const real = new Float32Array(9);
  const imag = new Float32Array([0, 1, 0, 0.45, 0, 0.2, 0, 0.1, 0]);
  return context.createPeriodicWave(real, imag);
}

/** Hertz between the two windings. Fixed, so the beat is fixed. */
const BEAT = 0.7;

/**
 * The second winding, against the first. Well under it: two equal partials a
 * beat apart cancel outright at every null, which is a hole in the tone rather
 * than a beat in it.
 */
const WINDING = 0.4;

export function createHum(engine: AudioEngine, options: HumOptions = {}): Instrument {
  const context = engine.context;
  const wave = coreWave(context);
  const attack = options.attack ?? 0.8;
  const release = options.release ?? 1.2;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const load = context.createGain();
  load.gain.value = 1;
  load.connect(output);

  const lfo = context.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 1.7;
  const depth = context.createGain();
  depth.gain.value = 0.04;
  lfo.connect(depth).connect(load.gain);
  lfo.start();

  return {
    output,

    noteOn(at, freq, velocity, duration = 4) {
      const n = human(context, at, freq, velocity);

      const lid = context.createBiquadFilter();
      lid.type = 'lowpass';
      lid.frequency.value = Math.min(n.freq * 9, 3200);
      lid.Q.value = 0.5;

      const envelope = context.createGain();
      const stop = hold(envelope.gain, n.at, n.velocity * 0.11, attack, n.at + duration, release);
      lid.connect(envelope).connect(load);

      for (const winding of [
        { offset: 0, level: 1 },
        { offset: BEAT, level: WINDING },
      ]) {
        const osc = context.createOscillator();
        osc.setPeriodicWave(wave);
        osc.frequency.value = n.freq + winding.offset;
        const coil = context.createGain();
        coil.gain.value = winding.level;
        osc.connect(coil).connect(lid);
        osc.start(n.at);
        osc.stop(stop);
      }

      // The octave ghost, well under the buzz.
      const ghost = context.createOscillator();
      ghost.type = 'sine';
      ghost.frequency.value = n.freq * 2;
      const ghostLevel = context.createGain();
      ghostLevel.gain.value = 0.12;
      ghost.connect(ghostLevel).connect(envelope);
      ghost.start(n.at);
      ghost.stop(stop);
    },

    dispose() {
      lfo.stop();
      lfo.disconnect();
      depth.disconnect();
      load.disconnect();
      output.disconnect();
    },
  };
}
