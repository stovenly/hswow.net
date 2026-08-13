import type { AudioEngine } from '../../AudioEngine';
import { createPluck, type PluckInstrument } from './pluck';

/**
 * Banjo — the bright pluck into a drum head.
 *
 * The pluck family is sustain-pretty throughout: harp, dulcimer, guitar all
 * ring. What a banjo has that they lack is a membrane where they have a box —
 * the string drives a drum head, and a drum head answers loud, fast and
 * nasal, then stops caring. So the string is the existing waveguide, plucked
 * hard at the bridge with a short decay, and the banjo-ness is downstream: a
 * head resonance in the low mids, its overtone ring above, and a thin bottom,
 * because a membrane on a hoop has no bass to give.
 */

export interface BanjoOptions {
  gain?: number;
}

export function createBanjo(engine: AudioEngine, options: BanjoOptions = {}): PluckInstrument {
  const context = engine.context;

  // Plucked at the bridge, wire-bright, and dead in about a second.
  const string = createPluck(engine, {
    decay: 1.1,
    bright: 0.8,
    place: 0.12,
    voices: 5,
    gain: 0.5,
    strike: { floor: 1600, span: 2600, cap: 4200, duration: 0.0015 },
  });

  // A hoop has no bass: the membrane's floor, not a tone control.
  const hoop = context.createBiquadFilter();
  hoop.type = 'highpass';
  hoop.frequency.value = 140;
  hoop.Q.value = 0.7;

  // The head's main mode — the pop that makes it percussive.
  const head = context.createBiquadFilter();
  head.type = 'peaking';
  head.frequency.value = 380;
  head.Q.value = 1.4;
  head.gain.value = 7;

  // The head's ring above the pop.
  const ring = context.createBiquadFilter();
  ring.type = 'peaking';
  ring.frequency.value = 760;
  ring.Q.value = 2.2;
  ring.gain.value = 3;

  // The pick's snap surviving the head.
  const snap = context.createBiquadFilter();
  snap.type = 'peaking';
  snap.frequency.value = 2800;
  snap.Q.value = 1;
  snap.gain.value = 2;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.45;

  string.output.connect(hoop).connect(head).connect(ring).connect(snap).connect(output);

  return {
    output,
    ready: string.ready,

    get usingFaust() {
      return string.usingFaust;
    },

    noteOn(at, freq, velocity) {
      string.noteOn(at, freq, velocity);
    },

    dispose() {
      string.dispose();
      hoop.disconnect();
      head.disconnect();
      ring.disconnect();
      snap.disconnect();
      output.disconnect();
    },
  };
}
