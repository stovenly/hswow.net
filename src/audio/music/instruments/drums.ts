import type { AudioEngine } from '../../AudioEngine';
import { excite, thump } from '../../dsp/impact';
import { strike } from '../../dsp/envelopes';
import { createParticleBed, scatterParticles, type Particles } from '../../dsp/phisem';
import { human, type Instrument } from './voice';

/**
 * Kick, snare, hat — assembled from `dsp/impact` and `dsp/phisem`.
 *
 * Nothing here is new synthesis; the kit is the library's three gestures worn
 * as drums. The kick is `thump` — a sine falling in pitch is the textbook
 * kick and always was — with a beater's click on the front. The snare is a
 * short thump for the shell, a bandpassed crack for the head, and a PhISEM
 * burst for the wires, which really are a population of small metal things
 * colliding. The hat is a filtered noise tick and nothing else, because a
 * closed hat *is* a filtered noise tick.
 *
 * These are the one place the voice contract's timing jitter earns its keep
 * twice over: percussion on a grid is where the ear forgives nothing, and
 * ±15 ms is the difference between a drum machine and someone playing one.
 *
 * `noteOn`'s frequency is a tuning, not a melody — the kick folds whatever it
 * is given down into its own octave so the kit can be handed the zone's root
 * and simply agree with it.
 */

export interface DrumOptions {
  gain?: number;
}

/** Folds a pitch by octaves into a playable range. */
function fold(freq: number, lo: number, hi: number): number {
  let f = freq;
  while (f > hi) f /= 2;
  while (f < lo) f *= 2;
  return f;
}

export function createKick(engine: AudioEngine, options: DrumOptions = {}): Instrument {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('kick built before the noise buffers were ready');

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // The beater: a couple of milliseconds of felt hitting the head, kept dull.
  const beater = context.createBiquadFilter();
  beater.type = 'lowpass';
  beater.frequency.value = 2800;
  beater.Q.value = 0.5;
  beater.connect(output);

  return {
    output,

    noteOn(at, freq, velocity) {
      const n = human(context, at, freq, velocity);
      const f = fold(n.freq, 36, 72);
      // The sweep snaps to the tuning in one beat of a heart and the body
      // rings *on* it — a kick that keeps falling lands below the key.
      const osc = context.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f * 1.8, n.at);
      osc.frequency.exponentialRampToValueAtTime(f, n.at + 0.06);
      const envelope = context.createGain();
      strike(envelope.gain, n.at, n.velocity * 0.85, 0.005, 0.2);
      osc.connect(envelope).connect(output);
      osc.start(n.at);
      osc.stop(n.at + 0.7);
      // Contact energy goes as the square: a soft stroke is all weight.
      excite(context, noise.white, beater, n.at, n.velocity * n.velocity * 0.18, 0.0025);
    },

    dispose() {
      beater.disconnect();
      output.disconnect();
    },
  };
}

/** The wires. Built once — a snare does not grow new wires per hit. */
const WIRES: Particles = {
  count: 26,
  over: 0.09,
  energyDecay: 0.045,
  hz: 3300,
  q: 1.3,
  level: 1,
  voices: 3,
  spread: 0.25,
  grain: 0.014,
};

export function createSnare(engine: AudioEngine, options: DrumOptions = {}): Instrument {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('snare built before the noise buffers were ready');

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // The head: broadband crack through a wide band. Q kept low — a snare's
  // crack is a slap, not a tone — and the band sits low enough to be a drum
  // in a room rather than a hiss beside one.
  const head = context.createBiquadFilter();
  head.type = 'bandpass';
  head.frequency.value = 1200;
  head.Q.value = 0.7;
  head.connect(output);

  const wires = createParticleBed(context, WIRES, output);

  return {
    output,

    noteOn(at, freq, velocity) {
      const n = human(context, at, freq, velocity);
      // The shell, brief and low. Falls fast — a snare has no sustain to it.
      thump(context, output, n.at, n.velocity * 0.3, 185, 130, 0.08, 0.003);
      excite(context, noise.white, head, n.at, n.velocity * 0.4, 0.1);
      scatterParticles(context, noise.white, wires, WIRES, n.at, n.velocity * n.velocity * 0.5);
    },

    dispose() {
      head.disconnect();
      wires.dispose();
      output.disconnect();
    },
  };
}

export function createHat(engine: AudioEngine, options: DrumOptions = {}): Instrument {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('hat built before the noise buffers were ready');

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const sizzle = context.createBiquadFilter();
  sizzle.type = 'highpass';
  sizzle.frequency.value = 7200;
  sizzle.Q.value = 0.7;

  // The very top of raw noise is fizz, not metal; a hat has a ceiling too.
  const cap = context.createBiquadFilter();
  cap.type = 'lowpass';
  cap.frequency.value = 13000;
  cap.Q.value = 0.5;
  sizzle.connect(cap).connect(output);

  return {
    output,

    noteOn(at, freq, velocity) {
      const n = human(context, at, freq, velocity);
      // Velocity opens the hat a little as well as hitting it harder. The
      // floor keeps a quiet stroke a tick rather than a click.
      excite(context, noise.white, sizzle, n.at, n.velocity * 0.3, 0.022 + n.velocity * 0.015);
    },

    dispose() {
      sizzle.disconnect();
      cap.disconnect();
      output.disconnect();
    },
  };
}
