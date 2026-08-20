import { createRng } from '../../art/random';
import { MODES, inMode, type ModeName } from './theory';

/**
 * The ground library — harmony that moves without ever cadencing.
 *
 * A ground is a loop of chord roots, one per bar, written as pitch classes
 * above the zone root. Every chord is rendered downstream as the grammar's
 * third-less root and fifth, so a ground is nothing but where the bass
 * stands. The loops are the old ones — the double tonic, the lament, each
 * mode's signature move — and none contains the fifth or the leading tone,
 * because a dominant would turn the rocking into a cadence.
 *
 * `home` loops start on the tonic and are a piece's ordinary ground. `away`
 * loops start elsewhere, for a bridge that must feel like leaving; the return
 * is guaranteed by the section that follows, not by the loop.
 */

/** A chord loop: pitch classes above the root, one chord per bar. */
export type Ground = readonly number[];

interface GroundBook {
  home: readonly Ground[];
  away: readonly Ground[];
  /**
   * The one chord a piece may borrow from *outside* the mode — the single
   * emotional event, rationed to one bar, stated by the bass alone while the
   * upper strata hold home. Never the fifth or the leading tone.
   */
  borrow: number;
}

export const GROUNDS: Record<ModeName, GroundBook> = {
  ionian: {
    home: [
      [0, 5],
      [0, 9],
      [0, 5, 9, 5],
      [0, 9, 5, 5],
    ],
    away: [
      [5, 9],
      [9, 5, 2, 5],
    ],
    borrow: 10,
  },
  dorian: {
    home: [
      [0, 5],
      [0, 10],
      [0, 5, 10, 5],
      [0, 3, 10, 3],
    ],
    away: [
      [5, 10],
      [3, 10, 5, 10],
    ],
    borrow: 8,
  },
  phrygian: {
    home: [
      [0, 1],
      [0, 10],
      [0, 10, 8, 10],
      [0, 1, 3, 1],
    ],
    away: [
      [8, 10],
      [1, 10],
    ],
    borrow: 9,
  },
  lydian: {
    home: [
      [0, 2],
      [0, 9],
      [0, 2, 4, 2],
      [0, 9, 2, 9],
    ],
    away: [
      [2, 9],
      [9, 2],
    ],
    borrow: 10,
  },
  mixolydian: {
    home: [
      [0, 10],
      [0, 5],
      [0, 10, 5, 10],
      [0, 5, 10, 5],
    ],
    away: [
      [5, 10],
      [10, 5],
    ],
    borrow: 8,
  },
  aeolian: {
    home: [
      [0, 10],
      [0, 8],
      [0, 10, 8, 10],
      [0, 5],
    ],
    away: [
      [8, 10],
      [5, 3],
    ],
    borrow: 9,
  },
  'pentatonic-major': {
    home: [
      [0, 2],
      [0, 9],
      [0, 9, 2, 9],
    ],
    away: [
      [2, 9],
      [9, 2],
    ],
    borrow: 5,
  },
  'pentatonic-minor': {
    home: [
      [0, 10],
      [0, 3],
      [0, 5, 3, 5],
      [0, 10, 3, 10],
    ],
    away: [
      [5, 10],
      [3, 10],
    ],
    borrow: 8,
  },
  'harmonic-minor': {
    home: [
      [0, 8],
      [0, 5],
      [0, 8, 5, 8],
    ],
    away: [
      [5, 8],
      [8, 0, 5, 0],
    ],
    borrow: 10,
  },
  'phrygian-dominant': {
    home: [
      [0, 10],
      [0, 1],
      [0, 10, 1, 10],
    ],
    away: [
      [10, 1],
      [1, 10],
    ],
    borrow: 3,
  },
  'blues-hexatonic': {
    home: [
      [0, 10],
      [0, 3],
      [0, 5, 3, 5],
    ],
    away: [
      [5, 10],
      [3, 10],
    ],
    borrow: 8,
  },
  // Two chords is the whole book here: in a five-note scale with a minor third
  // and a minor sixth, every other degree has no fifth of its own to stand on.
  // Both places that use these barely move anyway, so the second loop is the
  // slow one — two bars home, two away.
  hirajoshi: {
    home: [
      [0, 8],
      [0, 0, 8, 8],
    ],
    away: [
      [8, 0],
      [8, 8, 0, 0],
    ],
    borrow: 5,
  },
  kumoi: {
    home: [
      [0, 2],
      [0, 0, 2, 2],
    ],
    away: [
      [2, 0],
      [2, 2, 0, 0],
    ],
    borrow: 10,
  },
};

/**
 * Lerdahl's chord distance, `d = j + k`: steps around the circle of fifths
 * between the two roots, plus the pitch classes in the second chord's basic
 * space that the first's does not already hold.
 *
 * Every chord here is a root and a perfect fifth on one sounding mode, so the
 * mode level of the basic space cancels and the triadic level repeats the root
 * and fifth rather than adding a third. What is left is a small integer: 0 for
 * no move, 4 for a plagal step or a fifth, 7 to 11 for anything further round.
 */
export function chordDistance(x: number, y: number): number {
  const pc = (note: number): number => ((note % 12) + 12) % 12;
  const from = pc(x);
  const to = pc(y);
  // Seven semitones is one step of the circle, and 7 is its own inverse mod 12.
  const round = pc((to - from) * 7);
  const j = Math.min(round, 12 - round);
  const held = [from, pc(from + 7)];
  const wanted = [to, pc(to + 7)];
  const missing = wanted.filter((note) => !held.includes(note)).length;
  return j + (to === from ? 0 : 1) + missing * 2;
}

/**
 * Every chord a mode can stand on: in the mode, with its own perfect fifth
 * above it, and never the fifth or the leading tone — the same filter the
 * ground loops are written under, so choosing by distance cannot reach a chord
 * the ground book would have refused.
 */
export function chordCandidates(mode: ModeName): readonly number[] {
  const scale = MODES[mode];
  return scale.filter((pc) => pc !== 7 && pc !== 11 && inMode(pc + 7, scale));
}

/** A seed picks the same loop every time — a zone's ground is its ground. */
export function groundFor(seed: number, mode: ModeName, side: 'home' | 'away'): Ground {
  const book = GROUNDS[mode];
  return createRng(seed).pick(side === 'home' ? book.home : book.away);
}

/** How far a loop moves, chord to chord, around its own cycle. */
export function loopDistance(loop: Ground): number {
  if (loop.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < loop.length; i++) {
    total += chordDistance(loop[i], loop[(i + 1) % loop.length]);
  }
  return total / loop.length;
}

/** How much better than the zone's own loop another has to be to be taken. */
const OWN_GROUND_BIAS = 0.75;

/**
 * Where a tension lands inside a range. Distance targets have to be read off
 * what a mode can actually reach: hirajoshi holds two chords and one move
 * between them, and pentatonic-major has no move under 7.
 */
const toward = (tension: number, options: readonly number[]): number => {
  const lo = Math.min(...options);
  const hi = Math.max(...options);
  return lo + Math.min(Math.max(tension, 0), 1) * (hi - lo);
};

/**
 * The loop from a mode's book that moves by about as much as a section wants
 * to move — the same chords a ground book already writes, entered in the order
 * the arc asks for rather than the one order the seed drew.
 *
 * The zone's own loop is the prior and the tie-break, so a place still has a
 * ground; a section at rest and a section at the peak do not walk the same one.
 */
export function groundToward(
  mode: ModeName,
  side: 'home' | 'away',
  tension: number,
  prior: Ground,
): Ground {
  const book = GROUNDS[mode][side];
  const motions = [...book.map(loopDistance), loopDistance(prior)];
  const target = toward(tension, motions);
  let best = prior;
  let cost = Math.abs(loopDistance(prior) - target) - OWN_GROUND_BIAS;
  for (const loop of book) {
    const miss = Math.abs(loopDistance(loop) - target);
    if (miss < cost) {
      cost = miss;
      best = loop;
    }
  }
  return best;
}

/**
 * The chord a section wants to move to next: the one whose distance from the
 * chord sounding is nearest what the tension asks for, read against the moves
 * this mode has. `written` is the ground's own chord and the prior, so a place
 * still walks its ground.
 */
export function chordToward(
  mode: ModeName,
  from: number,
  written: number,
  tension: number,
  bias: number,
): number {
  const options = chordCandidates(mode).filter((pc) => pc !== from);
  if (options.length === 0) return written;
  const distances = options.map((pc) => chordDistance(from, pc));
  const target = toward(tension, distances);
  let best = written;
  let cost = Math.abs(chordDistance(from, written) - target) - bias;
  options.forEach((pc, i) => {
    const miss = Math.abs(distances[i] - target);
    if (miss < cost) {
      cost = miss;
      best = pc;
    }
  });
  return best;
}

/**
 * The chord a section leans on just before it lands: bVII where the mode has
 * one, otherwise plagal, otherwise the sixth — never a dominant.
 */
export function cadenceApproach(mode: ModeName): number {
  for (const pc of [10, 5, 9, 2]) {
    if (inMode(pc, MODES[mode])) return pc;
  }
  return 0;
}
