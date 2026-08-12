import type { AudioEngine } from '../../AudioEngine';
import type { FaustNode } from '../../faust/FaustNode';
import { excite } from '../../dsp/impact';
import { human, type Instrument } from './voice';

/**
 * Plucks, chimes, harp — the waveguide, struck on schedule from TypeScript.
 *
 * The one family native nodes genuinely cannot carry: a pitched feedback loop
 * above the 128-sample delay clamp needs the committed `waveguide.dsp`, and
 * the split follows the pattern `models/waveguide.ts` established — Faust is
 * the resonator, the substrate does the striking, sample-accurately.
 *
 * ## A pool, because retuning is a message
 *
 * Faust parameters land on a render-quantum boundary, so a single waveguide
 * retuned per note would bend the tail of the note still ringing in it. A
 * small pool played round-robin means the voice being retuned is always the
 * one that has been ringing longest, and by then its tail is the quietest
 * thing on the bus. The retune itself happens at message time — ahead of the
 * strike by the director's whole lookahead, during which the voice is at its
 * oldest and faintest.
 *
 * When the Faust tier fails to arrive, notes fall back to a short additive
 * pluck: a lightly stretched harmonic series with per-partial decays. It lacks
 * the ring-down's changing timbre, same as every native stand-in for this
 * module, but it plays the same notes at the same times.
 */

export interface PluckOptions {
  gain?: number;
  /** Seconds a note takes to fall away. */
  decay?: number;
  /** Upper partial weight, 0..1. Low is nylon, high is wire. */
  bright?: number;
  /** Pool size. More survives faster runs without audible retuning. */
  voices?: number;
}

export interface PluckInstrument extends Instrument {
  /** Resolves once the Faust tier has arrived or failed. */
  readonly ready: Promise<void>;
  readonly usingFaust: boolean;
}

async function loadPool(context: BaseAudioContext, count: number): Promise<FaustNode[] | null> {
  try {
    const [{ createFaustNode }, { waveguideMeta, waveguideUrl }] = await Promise.all([
      import('../../faust/FaustNode'),
      import('../../faust/built/waveguide'),
    ]);
    const nodes = await Promise.all(
      Array.from({ length: count }, () => createFaustNode(context, waveguideUrl, waveguideMeta)),
    );
    if (nodes.some((node) => node === null)) {
      for (const node of nodes) node?.dispose();
      return null;
    }
    return nodes as FaustNode[];
  } catch (error) {
    console.warn('pluck: faust tier unavailable — using the additive fallback', error);
    return null;
  }
}

export function createPluck(engine: AudioEngine, options: PluckOptions = {}): PluckInstrument {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('pluck built before the noise buffers were ready');
  const white = noise.white;

  const decay = options.decay ?? 2.4;
  const bright = options.bright ?? 0.45;
  const count = Math.max(2, options.voices ?? 6);

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // The waveguide runs quiet — same working level as `models/waveguide.ts`,
  // applied only to the Faust path so the fallback is not scaled with it.
  const faustBus = context.createGain();
  faustBus.gain.value = 3.2;

  // The body: what the string is mounted on. Two low resonances and a
  // ceiling, so the pluck warms up and never spits.
  const chest = context.createBiquadFilter();
  chest.type = 'peaking';
  chest.frequency.value = 110;
  chest.Q.value = 1;
  chest.gain.value = 2.5;

  const box = context.createBiquadFilter();
  box.type = 'peaking';
  box.frequency.value = 230;
  box.Q.value = 1;
  box.gain.value = 2;

  const lid = context.createBiquadFilter();
  lid.type = 'lowpass';
  lid.frequency.value = 4000;
  lid.Q.value = 0.5;

  faustBus.connect(chest).connect(box).connect(lid).connect(output);

  interface Voice {
    input: BiquadFilterNode;
    node: FaustNode;
  }
  const voices: Voice[] = [];
  let next = 0;
  let disposed = false;

  const ready = loadPool(context, count).then((nodes) => {
    if (!nodes) return;
    if (disposed) {
      for (const node of nodes) node.dispose();
      return;
    }
    for (const node of nodes) {
      // Per-voice brightness on the excitation: velocity decides how much of
      // the noise burst's top reaches the string, which is where a pluck's
      // hardness actually lives.
      const input = context.createBiquadFilter();
      input.type = 'lowpass';
      input.frequency.value = 4000;
      input.Q.value = 0.4;
      input.connect(node.node);
      node.node.connect(faustBus);
      node.set('decay', decay);
      node.set('bright', bright);
      node.set('closed', 0);
      // Soft mid-string: toward the edge is a twang, dead centre is hollow.
      node.set('place', 0.4);
      node.set('gain', 0.7);
      voices.push({ input, node });
    }
  });

  /** The stand-in: a stretched harmonic series, struck. */
  function fallback(at: number, freq: number, velocity: number): void {
    const top = context.sampleRate * 0.45;
    for (let i = 0; i < 6; i++) {
      const harmonic = i + 1;
      // A hair of stretch — real strings are stiff, and a perfectly harmonic
      // pluck reads as an organ pipe.
      const f = freq * harmonic * (1 + harmonic * harmonic * 0.0004);
      if (f > top) break;

      const osc = context.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;

      const level = velocity * 0.12 * (0.3 + bright * 0.55) ** i;
      const seconds = decay / (1 + i * 0.8);
      const envelope = context.createGain();
      envelope.gain.setValueAtTime(0, at);
      envelope.gain.linearRampToValueAtTime(level, at + 0.0015);
      envelope.gain.exponentialRampToValueAtTime(level * 0.0005, at + seconds);

      osc.connect(envelope).connect(output);
      osc.start(at);
      osc.stop(at + seconds + 0.02);
    }
  }

  return {
    output,
    ready,

    get usingFaust() {
      return voices.length > 0;
    },

    noteOn(at, freq, velocity) {
      const n = human(context, at, freq, velocity);
      if (voices.length === 0) {
        fallback(n.at, n.freq, n.velocity);
        return;
      }
      const voice = voices[next++ % voices.length];
      voice.node.set('pitch', n.freq);
      // The excitation filter is the playing level of the pluck, and it
      // tracks *down* the neck: a high string is stopped shorter and speaks
      // purer, so the same finger reads darker up there.
      const track = Math.min(1, Math.max(0.5, 1 - Math.max(n.freq - 260, 0) / 1600));
      voice.input.frequency.setValueAtTime(
        Math.min((800 + n.velocity * 1800) * track, 2600),
        Math.max(n.at - 0.005, context.currentTime),
      );
      // A slightly longer, shaped burst — a fingertip, not a slap.
      excite(context, white, voice.input, n.at, n.velocity * 0.5, 0.003, 0.001);
    },

    dispose() {
      disposed = true;
      for (const voice of voices) {
        voice.input.disconnect();
        voice.node.dispose();
      }
      faustBus.disconnect();
      chest.disconnect();
      box.disconnect();
      lid.disconnect();
      output.disconnect();
    },
  };
}
