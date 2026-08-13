import type { AudioEngine } from '../../AudioEngine';
import { type Instrument } from './voice';
import { createMonoPool, type MonoVoice } from './mono';

/**
 * Hurdy-gurdy — the folk instrument that is a machine.
 *
 * The crank is a bow that never stops, so the whole thing is a drone by
 * construction: a melody string, a bourdon holding a constant fifth under it,
 * and the trompette — a loose bridge that buzzes when the crank pushes and
 * falls silent between pushes, which is where the ticking rhythm of a real
 * gurdy comes from. The tick is a square LFO gating the buzz outright: the
 * bridge either rattles or it does not, and a smooth swell there would be a
 * tremolo, not a trompette.
 *
 * Built on the mono core because the wheel keeps turning between notes — a
 * key change is a glide on a sounding string, never a fresh attack.
 */

export interface GurdyOptions {
  gain?: number;
  attack?: number;
  release?: number;
}

function gurdyPlayer(context: BaseAudioContext, output: AudioNode): MonoVoice {
  // The soundbox: one low bump under a fixed ceiling.
  const body = context.createBiquadFilter();
  body.type = 'peaking';
  body.frequency.value = 400;
  body.Q.value = 1;
  body.gain.value = 3;

  const lid = context.createBiquadFilter();
  lid.type = 'lowpass';
  lid.frequency.value = 2800;
  lid.Q.value = 0.6;

  const envelope = context.createGain();
  envelope.gain.value = 0;
  body.connect(lid).connect(envelope).connect(output);

  const chanter = context.createOscillator();
  chanter.type = 'sawtooth';
  chanter.connect(body);
  chanter.start();

  // The bourdon: the constant fifth under, well below the melody string.
  const bourdon = context.createOscillator();
  bourdon.type = 'sawtooth';
  const bourdonLevel = context.createGain();
  bourdonLevel.gain.value = 0.4;
  bourdon.connect(bourdonLevel).connect(body);
  bourdon.start();

  // The trompette: a bright buzz an octave up, gated hard by the crank.
  const trompette = context.createOscillator();
  trompette.type = 'sawtooth';
  const buzz = context.createBiquadFilter();
  buzz.type = 'bandpass';
  buzz.frequency.value = 2400;
  buzz.Q.value = 3;
  const push = context.createGain();
  push.gain.value = 0;
  const gate = context.createGain();
  gate.gain.value = 0.5;
  trompette.connect(buzz).connect(push).connect(gate).connect(envelope);
  trompette.start();

  // Each player's crank turns at its own speed, so two never tick together.
  const crank = context.createOscillator();
  crank.type = 'square';
  crank.frequency.value = 1.6 + Math.random() * 0.5;
  const swing = context.createGain();
  swing.gain.value = 0.5;
  crank.connect(swing).connect(gate.gain);
  crank.start();

  return {
    envelope,

    tune(at, freq, velocity, glide) {
      for (const osc of [chanter, bourdon, trompette]) osc.frequency.cancelScheduledValues(at);
      lid.frequency.cancelScheduledValues(at);
      if (glide) {
        chanter.frequency.setTargetAtTime(freq, at, 0.03);
      } else {
        // The wheel bites slightly flat and comes true.
        chanter.frequency.setValueAtTime(freq * 0.996, at);
        chanter.frequency.setTargetAtTime(freq, at, 0.05);
      }
      bourdon.frequency.setTargetAtTime(freq * (2 / 3), at, 0.03);
      trompette.frequency.setTargetAtTime(freq * 2, at, 0.03);
      lid.frequency.setTargetAtTime(1800 + velocity * 1200, at, 0.04);
      // Pushing harder is what makes the bridge rattle at all.
      push.gain.setTargetAtTime(0.08 + velocity * 0.25, at, 0.05);
    },

    taper(at, release) {
      lid.frequency.setTargetAtTime(1400, at, release / 3);
      push.gain.setTargetAtTime(0, at, release / 3);
    },

    dispose() {
      for (const osc of [chanter, bourdon, trompette, crank]) {
        osc.stop();
        osc.disconnect();
      }
      bourdonLevel.disconnect();
      buzz.disconnect();
      push.disconnect();
      gate.disconnect();
      swing.disconnect();
      body.disconnect();
      lid.disconnect();
      envelope.disconnect();
    },
  };
}

export function createGurdy(engine: AudioEngine, options: GurdyOptions = {}): Instrument {
  const context = engine.context;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const pool = createMonoPool(context, () => gurdyPlayer(context, output), {
    attack: options.attack ?? 0.3,
    release: options.release ?? 0.8,
    peak: (velocity) => velocity * 0.2,
  });

  return {
    output,

    noteOn(at, freq, velocity, duration = 2.5) {
      pool.note(at, freq, velocity, duration);
    },

    dispose() {
      pool.dispose();
      output.disconnect();
    },
  };
}
