import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { createParticleBed, scatterParticles, type ParticleBed, type Particles } from '../dsp/phisem';
import { thump } from '../dsp/impact';

/**
 * Loose material moving: grit off a roof, scree slipping, a stack going over,
 * embers settling in a grate, a bird leaving a tree.
 *
 * A pile being *dropped* is one contact and a scatter behind it. This is the
 * other thing entirely — material already in motion, arriving over a span, with
 * no single contact anywhere in it. What makes it read as a flow rather than as
 * a rattle is that the rate has a **shape**: it builds, peaks, and trails off in
 * a long thin tail as the last few pieces find somewhere to stop.
 *
 * That tail is the whole effect. Cut it and a rockfall becomes a bin being
 * emptied — the ear takes a scatter that stops cleanly as an object that was
 * put down, and one that keeps finding stragglers as a slope still settling.
 *
 * Bigger flows also **sort themselves**: the large pieces run furthest and
 * arrive last, so the pitch of the tail drifts down through the event. One
 * parameter, and it is most of the difference between gravel and boulders.
 */

export type Loose = 'grit' | 'gravel' | 'scree' | 'rubble' | 'ember' | 'feather' | 'snow' | 'mast';

interface Kind {
  /** Where a single piece resonates, Hz, and how much it insists on it. */
  hz: number;
  q: number;
  /** How many distinct sizes are in it, and how far apart. */
  voices: number;
  spread: number;
  /** Pieces per second at the peak of the flow, at full force. */
  rate: number;
  /** How long the flow runs, seconds. */
  over: readonly [number, number];
  /** How long the stragglers keep arriving, as a multiple of `over`. */
  tail: number;
  /** Level of one piece. */
  level: number;
  /** Weight under the whole thing. Zero for anything that has none. */
  mass: number;
  /** How far the pitch drifts down as the big pieces arrive last, 0..1. */
  sorting: number;
  /** How long one piece rings and how softly it starts, seconds. Hard by default. */
  grain?: number;
  attack?: number;
}

const KINDS: Record<Loose, Kind> = {
  // A handful of dust off a ledge. Fast, high, and over at once.
  grit: {
    hz: 4200,
    q: 1.6,
    voices: 3,
    spread: 0.5,
    rate: 90,
    over: [0.25, 0.5],
    tail: 1.4,
    level: 0.05,
    mass: 0,
    sorting: 0.05,
  },
  gravel: {
    hz: 2100,
    q: 1.5,
    voices: 4,
    spread: 0.7,
    rate: 70,
    over: [0.4, 0.9],
    tail: 1.8,
    level: 0.1,
    mass: 0.1,
    sorting: 0.25,
  },
  // A slope letting go. Long, and the tail is most of its length.
  scree: {
    hz: 1300,
    q: 1.3,
    voices: 5,
    spread: 0.85,
    rate: 120,
    over: [1.2, 2.6],
    tail: 2.6,
    level: 0.13,
    mass: 0.3,
    sorting: 0.55,
  },
  // Masonry, or a stack of something heavy. The pitch falls right through it.
  rubble: {
    hz: 620,
    q: 1.1,
    voices: 5,
    spread: 1,
    rate: 45,
    over: [1, 2.2],
    tail: 2.2,
    level: 0.22,
    mass: 0.8,
    sorting: 0.75,
  },
  // Almost nothing: a grate collapsing in on itself, felt more than heard.
  ember: {
    hz: 1500,
    q: 2.4,
    voices: 4,
    spread: 0.6,
    rate: 22,
    over: [0.5, 1.4],
    tail: 2.2,
    level: 0.045,
    mass: 0.05,
    sorting: 0.15,
  },
  // Wingbeats leaving a tree: soft, broad, and it has no ring at all.
  feather: {
    hz: 900,
    q: 0.7,
    voices: 3,
    spread: 0.5,
    rate: 34,
    over: [0.5, 1.1],
    tail: 0.9,
    level: 0.09,
    mass: 0.06,
    sorting: 0.1,
  },
  // A roof's worth letting go: soft, broad, no ring, and a weight under it.
  snow: {
    hz: 520,
    q: 0.5,
    voices: 3,
    spread: 0.3,
    rate: 160,
    over: [0.7, 1.6],
    tail: 1.2,
    level: 0.05,
    mass: 0.5,
    sorting: 0.2,
    grain: 0.02,
    attack: 0.004,
  },
  // Nuts down through leaves onto ground: a few dry taps, widely spaced.
  mast: {
    hz: 1900,
    q: 1.4,
    voices: 3,
    spread: 0.6,
    rate: 14,
    over: [0.6, 1.5],
    tail: 1.6,
    level: 0.12,
    mass: 0,
    sorting: 0.1,
    grain: 0.008,
  },
};

export interface FlowOptions {
  kind?: Loose;
  gain?: number;
  /** Size. Below 1 is coarser and lower. */
  tone?: number;
  /** How much material. Scales the count and the length together. */
  amount?: number;
}

function between(range: readonly [number, number]): number {
  return range[0] + Math.random() * (range[1] - range[0]);
}

export function createFlow(engine: AudioEngine, options: FlowOptions = {}): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('flow built before the noise buffers were ready');

  const kind = KINDS[options.kind ?? 'gravel'];
  const tone = options.tone ?? 1;
  const amount = options.amount ?? 1;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.45;

  const bed: Particles = {
    count: 60,
    over: 1,
    energyDecay: 0.5,
    hz: kind.hz * tone,
    q: kind.q,
    level: kind.level,
    voices: kind.voices,
    spread: kind.spread,
    grain: kind.grain,
    attack: kind.attack,
  };
  const pieces: ParticleBed = createParticleBed(context, bed, output);

  // The sorted tail runs through its own bed, an octave or so down: the big
  // pieces that arrived last are the low ones.
  const heavy: ParticleBed | null =
    kind.sorting > 0.1
      ? createParticleBed(
          context,
          { ...bed, hz: kind.hz * tone * (1 - kind.sorting * 0.55), q: kind.q * 0.85 },
          output,
        )
      : null;

  return {
    output,

    fire(at, force) {
      const span = between(kind.over) * (0.7 + amount * 0.5);
      const scale = force * amount;

      // The body of it: builds and peaks inside the first third.
      scatterParticles(
        context,
        noise.white,
        pieces,
        {
          ...bed,
          count: Math.round(kind.rate * span * scale),
          over: span,
          energyDecay: span * 0.45,
        },
        at,
        scale,
      );

      // The tail. Far fewer pieces over far longer, and this is the part that
      // says a slope is still settling rather than a bin has been emptied.
      const tail = span * kind.tail;
      scatterParticles(
        context,
        noise.white,
        heavy ?? pieces,
        {
          ...bed,
          hz: kind.hz * tone * (1 - kind.sorting * 0.55),
          count: Math.max(3, Math.round(kind.rate * tail * scale * 0.09)),
          over: tail,
          energyDecay: tail * 0.7,
          level: kind.level * (1 + kind.sorting),
        },
        at + span * 0.55,
        scale * 0.8,
      );

      if (kind.mass > 0.02) {
        // Everything landing at once, once. Under the flow, not in it.
        thump(
          context,
          output,
          at + span * 0.2,
          scale * kind.mass * 0.3,
          70 * tone,
          38 * tone,
          span * 0.4,
          0.03,
        );
      }

      return span + tail + 0.3;
    },

    dispose() {
      pieces.dispose();
      heavy?.dispose();
      output.disconnect();
    },
  };
}
