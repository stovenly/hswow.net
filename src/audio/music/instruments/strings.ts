import type { AudioEngine } from '../../AudioEngine';
import { human, hold, type Instrument } from './voice';

/**
 * Strings and pads — detuned saws through a dual-rate ensemble chorus.
 *
 * The oldest recipe in synthesis and still the load-bearing one, because the
 * physics line up: a bowed string's spectrum genuinely is close to a sawtooth,
 * and a *section* of them is many players drifting independently around the
 * same pitch. Modulated detune is that drift. **The chorus is the section** —
 * three saws without it are one large synthesiser; three saws through it are
 * somebody's idea of twelve players, and the ear accepts the idea.
 *
 * Dual-rate means each delay line carries a slow deep drift (players wandering)
 * and a fast shallow shimmer (bow speed) at once. One LFO per line sounds like
 * a Leslie; the pair sounds like people.
 */

export interface StringsOptions {
  gain?: number;
  /** Seconds to speak. Long is a pad, short is a section playing détaché. */
  attack?: number;
  release?: number;
  /** Upper harmonic weight, 0..1. Low is muted and dark, high is close bowing. */
  bright?: number;
}

/** Per-saw offsets, in cents. Asymmetric so the beat pattern never cycles. */
const SPREAD = [-9, 4, 10] as const;

export function createStrings(engine: AudioEngine, options: StringsOptions = {}): Instrument {
  const context = engine.context;
  const attack = Math.min(Math.max(options.attack ?? 0.9, 0.08), 2);
  const release = options.release ?? 1.4;
  const bright = options.bright ?? 0.5;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // --- the chorus -----------------------------------------------------------
  //
  // Every note routes through this one ensemble, because the section is a
  // property of the instrument and not of the note. Three modulated delay
  // lines over a quiet dry — the wet has to dominate, since the dry saw *is*
  // the buzz — and three because two lines cannot hide their common motion.
  // Base times sit in chorus territory rather than doubling territory, and
  // all the rates are deliberately non-multiples of one another so the
  // combined motion never repeats within a listening span.
  const input = context.createGain();

  // A section has no energy below its lowest body resonance; the saws do.
  const body = context.createBiquadFilter();
  body.type = 'highpass';
  body.frequency.value = 200;
  body.Q.value = 0.5;
  input.connect(body);

  const dry = context.createGain();
  dry.gain.value = 0.32;
  body.connect(dry).connect(output);

  const lfos: OscillatorNode[] = [];
  const nodes: AudioNode[] = [input, body, dry];

  for (const line of [
    { base: 0.008, slow: 0.11, fast: 4.6, drift: 0.0022 },
    { base: 0.0103, slow: 0.16, fast: 5.4, drift: 0.0026 },
    { base: 0.0121, slow: 0.21, fast: 5.0, drift: 0.003 },
  ]) {
    const delay = context.createDelay(0.06);
    delay.delayTime.value = line.base;
    const wet = context.createGain();
    wet.gain.value = 0.33;
    body.connect(delay).connect(wet).connect(output);
    nodes.push(delay, wet);

    for (const [hz, depth] of [
      [line.slow, line.drift],
      [line.fast, 0.0002],
    ]) {
      const lfo = context.createOscillator();
      lfo.frequency.value = hz;
      const amount = context.createGain();
      amount.gain.value = depth;
      lfo.connect(amount);
      amount.connect(delay.delayTime);
      lfo.start();
      lfos.push(lfo);
      nodes.push(amount);
    }
  }

  return {
    output,

    noteOn(at, freq, velocity, duration = 3) {
      const n = human(context, at, freq, velocity);

      // Velocity into brightness: a section leaning in gains harmonics before
      // it gains level.
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = Math.min(n.freq * (2.5 + bright * 3 + n.velocity * 4), 6500);
      filter.Q.value = 0.5;

      const envelope = context.createGain();
      const stop = hold(envelope.gain, n.at, n.velocity * 0.12, attack, n.at + duration, release);
      filter.connect(envelope).connect(input);

      for (const cents of SPREAD) {
        const osc = context.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = n.freq;
        osc.detune.value = cents + (Math.random() * 2 - 1) * 2;
        osc.connect(filter);
        osc.start(n.at);
        osc.stop(stop);
      }
    },

    dispose() {
      for (const lfo of lfos) {
        lfo.stop();
        lfo.disconnect();
      }
      for (const node of nodes) node.disconnect();
      output.disconnect();
    },
  };
}
