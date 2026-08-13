import { createRng } from '../../art/random';
import { MODES, inMode, type ModeName } from './theory';

/**
 * The ground library — harmony that moves without ever cadencing.
 *
 * A ground is a loop of chord roots, one per bar, written as pitch classes
 * above the zone root. Every chord is rendered downstream as the grammar's
 * third-less root and fifth, so a ground is nothing but where the bass
 * stands; the loops are the old ones — the double tonic, the lament, each
 * mode's signature move — and none contains the fifth or the leading tone,
 * because a dominant would turn the rocking into a cadence.
 *
 * `home` loops start on the tonic and are a piece's ordinary ground. `away`
 * loops start elsewhere, for a bridge that must feel like leaving — the
 * return is guaranteed by the section that follows, not by the loop.
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
  // slow one — two bars home, two away — rather than another pair of roots.
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

/** A seed picks the same loop every time — a zone's ground is its ground. */
export function groundFor(seed: number, mode: ModeName, side: 'home' | 'away'): Ground {
  const book = GROUNDS[mode];
  return createRng(seed).pick(side === 'home' ? book.home : book.away);
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
