import { createRng, type Rng } from '../../art/random';
import type { Cell } from './patterns';

/**
 * Rhythm with intent — a repeated cell, not per-note dice. Folk rhythm is a
 * bar-length figure owned for a whole section: the snap, the dotted pair,
 * short-short-long. A section seeds ONE cell and states it bar over bar, and
 * variety comes from the minimalist's mutation rule below, one element at a
 * time. Randomising onsets independently is a metronome with noise on it.
 */

/** Beats to a bar, everywhere the grid exists. */
export const BAR_BEATS = 4;

export interface RhythmStep {
  /** Length in beats. A cell's steps always sum to the bar. */
  beats: number;
  /** 0–1, folded into velocity. Read from the onset's place in the bar. */
  accent: number;
}

export type RhythmCell = readonly RhythmStep[];

/** Whether a position sits exactly on a grid of `grid` beats. */
const on = (position: number, grid: number): boolean => {
  const steps = position / grid;
  return Math.abs(steps - Math.round(steps)) < 1e-9;
};

/**
 * Longuet-Higgins & Lee's metric weights: 0 on the bar line, -1 on the half,
 * -2 on the beat, -3 on the eighth or its triplet, -4 below that. The
 * hierarchy is a property of the bar, so accent is read from it rather than
 * written per step — which is what lets `subdivide` halve a cell without the
 * halves inheriting their parent's stress.
 */
export function metricWeight(beat: number): number {
  const position = ((beat % BAR_BEATS) + BAR_BEATS) % BAR_BEATS;
  if (on(position, BAR_BEATS)) return 0;
  if (on(position, BAR_BEATS / 2)) return -1;
  if (on(position, 1)) return -2;
  if (on(position, 0.5) || on(position, 1 / 3)) return -3;
  return -4;
}

/** The weights as touch, 0–1. */
const ACCENTS = [1, 0.8, 0.65, 0.5, 0.4];

export function accentAt(beat: number): number {
  return ACCENTS[-metricWeight(beat)];
}

/** A cell from its lengths alone; the bar says how hard each onset is struck. */
const cellOf = (...beats: readonly number[]): RhythmCell => {
  let at = 0;
  return beats.map((length) => {
    const step = { beats: length, accent: accentAt(at) };
    at += length;
    return step;
  });
};

/**
 * A cell's own emphasis over the bar's, per step. Most gaits agree with the
 * metre and want nothing here; the crooked ones do not, and their whole
 * character is a stress that contradicts where it lands. The lean is a ratio
 * rather than a replacement, so the hierarchy underneath — and therefore
 * `subdivide` — still works.
 */
const leaning = (cell: RhythmCell, accents: readonly number[]): RhythmCell =>
  cell.map((step, i) => ({ ...step, accent: accents[i] }));

/** The cells by name, so a vibe can own a subset — its gait. */
export type GaitName = 'even' | 'dotted' | 'snap' | 'short-short-long' | 'lilt' | 'aksak' | 'crooked';

export const RHYTHM_CELLS: Record<GaitName, RhythmCell> = {
  // Even quarters — the family's lowest-energy member.
  even: cellOf(1, 1, 1, 1),
  // Dotted long–short, exaggerated the folk way.
  dotted: cellOf(1.5, 0.5, 1.5, 0.5),
  // The scotch snap: the short lands the beat and the long hangs off it.
  snap: cellOf(0.5, 1.5, 0.5, 1.5),
  // The long one carries, against the bar line that outranks it.
  'short-short-long': leaning(cellOf(1, 1, 2), [0.8, 0.7, 1]),
  // The 6/8 lilt laid over the bar: swung pairs.
  lilt: cellOf(4 / 3, 2 / 3, 4 / 3, 2 / 3),
  // The crooked bars — eighth-note 3+3+2 over the same four beats, and its
  // back-heavy reverse. The limp is the point, and the limp is the lean.
  aksak: leaning(cellOf(1.5, 1.5, 1), [1, 0.7, 0.85]),
  crooked: leaning(cellOf(1, 1.5, 1.5), [0.9, 1, 0.6]),
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
 * One rung down the ladder: every step long enough to split becomes a pair.
 * The bar total is untouched, so the grid holds, and both halves re-read their
 * accent from where they land rather than inheriting the parent's.
 */
export function subdivide(cell: RhythmCell): RhythmCell {
  const out: RhythmStep[] = [];
  let at = 0;
  for (const step of cell) {
    // The step's lean over the bar's own weight, carried across the split so
    // a crooked cell subdivides crooked.
    const lean = step.accent / accentAt(at);
    const struck = (position: number): number => Math.min(1, accentAt(position) * lean);
    if (step.beats >= 1) {
      const half = step.beats / 2;
      out.push({ beats: half, accent: struck(at) });
      out.push({ beats: half, accent: struck(at + half) });
    } else {
      out.push({ beats: step.beats, accent: struck(at) });
    }
    at += step.beats;
  }
  return out;
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
 * never a stutter; the ostinato stays recognisably itself while it drifts.
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
