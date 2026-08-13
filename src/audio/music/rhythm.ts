import { createRng, type Rng } from '../../art/random';
import type { Cell } from './patterns';

/**
 * Rhythm with intent — a repeated cell, not per-note dice.
 *
 * Folk rhythm is a bar-length figure owned for a whole section: the snap,
 * the dotted pair, short-short-long. Randomizing onsets independently is
 * what a metronome with noise sounds like, which is exactly what the old
 * texture was. A section seeds ONE cell and states it bar over bar; variety
 * comes from the minimalist's mutation rule below, one element at a time.
 */

/** Beats to a bar, everywhere the grid exists. */
export const BAR_BEATS = 4;

export interface RhythmStep {
  /** Length in beats. A cell's steps always sum to the bar. */
  beats: number;
  /** 0–1, folded into velocity. The downbeat usually carries the most. */
  accent: number;
}

export type RhythmCell = readonly RhythmStep[];

/** The cells by name, so a vibe can own a subset — its gait. */
export type GaitName = 'even' | 'dotted' | 'snap' | 'short-short-long' | 'lilt' | 'aksak' | 'crooked';

export const RHYTHM_CELLS: Record<GaitName, RhythmCell> = {
  // Even quarters — the family's lowest-energy member.
  even: [
    { beats: 1, accent: 1 },
    { beats: 1, accent: 0.55 },
    { beats: 1, accent: 0.8 },
    { beats: 1, accent: 0.55 },
  ],
  // Dotted long–short, exaggerated the folk way.
  dotted: [
    { beats: 1.5, accent: 1 },
    { beats: 0.5, accent: 0.5 },
    { beats: 1.5, accent: 0.85 },
    { beats: 0.5, accent: 0.5 },
  ],
  // The scotch snap: the short lands the beat and the long hangs off it.
  snap: [
    { beats: 0.5, accent: 0.95 },
    { beats: 1.5, accent: 0.6 },
    { beats: 0.5, accent: 1 },
    { beats: 1.5, accent: 0.6 },
  ],
  'short-short-long': [
    { beats: 1, accent: 0.8 },
    { beats: 1, accent: 0.7 },
    { beats: 2, accent: 1 },
  ],
  // The 6/8 lilt laid over the bar: swung pairs.
  lilt: [
    { beats: 4 / 3, accent: 1 },
    { beats: 2 / 3, accent: 0.5 },
    { beats: 4 / 3, accent: 0.85 },
    { beats: 2 / 3, accent: 0.5 },
  ],
  // The crooked bars — eighth-note 3+3+2 over the same four beats, and its
  // back-heavy reverse. The limp is the point.
  aksak: [
    { beats: 1.5, accent: 1 },
    { beats: 1.5, accent: 0.7 },
    { beats: 1, accent: 0.85 },
  ],
  crooked: [
    { beats: 1, accent: 0.9 },
    { beats: 1.5, accent: 1 },
    { beats: 1.5, accent: 0.6 },
  ],
};

export const GAITS = Object.keys(RHYTHM_CELLS) as readonly GaitName[];

/**
 * A seed owns one cell from the vibe's gait — the same seed is the same
 * figure, always. An empty gait falls back to the whole library.
 */
export function rhythmCell(seed: number, gait: readonly GaitName[] = GAITS): RhythmCell {
  const pool = gait.length > 0 ? gait : GAITS;
  return RHYTHM_CELLS[createRng(seed).pick(pool)];
}

/**
 * One rung down the ladder: every step long enough to split becomes a pair,
 * the second half softer. The bar total is untouched, so the grid holds.
 */
export function subdivide(cell: RhythmCell): RhythmCell {
  return cell.flatMap((step) =>
    step.beats >= 1
      ? [
          { beats: step.beats / 2, accent: step.accent },
          { beats: step.beats / 2, accent: step.accent * 0.6 },
        ]
      : [step],
  );
}

export type MutationOp = 'swap' | 'replace' | 'add' | 'drop';

export interface Mutation {
  notes: Cell;
  op: MutationOp;
}

const stutters = (cell: readonly number[]): boolean =>
  cell.some((note, i) => i > 0 && note === cell[i - 1]);

/**
 * The minimalist's rule: every few repeats, exactly one element changes — a
 * neighbour swap, one note replaced, one added or dropped. Never more, and
 * never a stutter; the ostinato stays recognizably itself while it drifts.
 */
export function mutateOstinato(rng: Rng, notes: Cell, pool: readonly number[]): Mutation {
  const ops: MutationOp[] = ['swap', 'replace'];
  if (notes.length < 6) ops.push('add');
  if (notes.length > 3) ops.push('drop');

  for (let tries = 0; tries < 8; tries++) {
    const op = rng.pick(ops);
    const out = notes.slice();
    if (op === 'swap') {
      const i = rng.int(0, notes.length - 2);
      [out[i], out[i + 1]] = [out[i + 1], out[i]];
    } else if (op === 'replace') {
      const i = rng.int(0, notes.length - 1);
      const options = pool.filter((note) => note !== out[i]);
      out[i] = rng.pick(options);
    } else if (op === 'add') {
      out.splice(rng.int(0, notes.length), 0, rng.pick(pool));
    } else {
      out.splice(rng.int(0, notes.length - 1), 1);
    }
    if (!stutters(out) && String(out) !== String(notes)) return { notes: out, op };
  }

  // Cornered — an end replacement excluding both its neighbours always lands.
  const out = notes.slice();
  out[0] = rng.pick(pool.filter((note) => note !== notes[0] && note !== notes[1]));
  return { notes: out, op: 'replace' };
}
