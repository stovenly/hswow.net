import { createRng, type Rng } from '../../art/random';
import { degreeToSemitone, inMode, semitoneToDegree, type Mode } from './theory';

/**
 * Seeded cell generators — the Spore recipe. A zone stores seeds, never
 * notes; re-rolling a seed replays its cell exactly, which is what makes a
 * motif recur without a bar of composed data anywhere. The `Rng` is the same
 * seeded randomness every builder uses, for the same reason: if a seed gave a
 * different melody on a different day, a zone's music would stop being *its*
 * music.
 *
 * Cells are walked in degree space and converted at the end, so the scale
 * lock holds by construction. The melodic rule is the grammar's: one leap,
 * then steps — and the first step recovers against the leap, which is the
 * oldest counterpoint advice there is. The walk is also clamped so the whole
 * cell spans no more than a major sixth, and that clamp is what makes cells
 * order-independent: whatever order the director plays the notes in, no
 * interval can exceed the span, so every permutation connects.
 */

/** A cell: semitones relative to the zone root, in generated order. */
export type Cell = readonly number[];

/** The widest a cell may reach, in semitones. Any pair inside it connects. */
export const CONNECT = 9;

export function melodyCell(seed: number, mode: Mode): Cell {
  const rng = createRng(seed);
  const length = rng.int(2, 6);
  const up = rng.chance(0.5) ? 1 : -1;

  const start = rng.int(0, mode.length - 1);
  const degrees = [start, start + up * rng.int(2, 3)];
  let lo = Math.min(degrees[0], degrees[1]);
  let hi = Math.max(degrees[0], degrees[1]);

  // Steps of one degree from here on, starting against the leap.
  let direction = -up;
  while (degrees.length < length) {
    let next = degrees[degrees.length - 1] + direction;
    const wide =
      degreeToSemitone(mode, Math.max(hi, next)) - degreeToSemitone(mode, Math.min(lo, next));
    if (wide > CONNECT) {
      // Turning inward can only revisit ground already inside the span.
      direction = -direction;
      next = degrees[degrees.length - 1] + direction;
    }
    degrees.push(next);
    lo = Math.min(lo, next);
    hi = Math.max(hi, next);
    if (rng.chance(0.4)) direction = -direction;
  }

  return degrees.map((degree) => degreeToSemitone(mode, degree));
}

/**
 * Notes the texture stratum may sit on: root, fourth, fifth, octave, ninth,
 * filtered to the mode. No third — the mid stratum keeps the drone's
 * ambiguity rather than deciding major or minor underneath the melody.
 */
export function texturePool(mode: Mode): readonly number[] {
  return [0, 5, 7, 12, 14].filter((semitone) => inMode(semitone, mode));
}

/** An ostinato cell: open intervals in a repeatable order, never stuttering. */
export function textureCell(seed: number, mode: Mode): Cell {
  const rng = createRng(seed);
  const pool = texturePool(mode);
  const length = rng.int(3, 5);
  const notes: number[] = [];
  while (notes.length < length) {
    notes.push(rng.pick(pool.filter((note) => note !== notes[notes.length - 1])));
  }
  return notes;
}

// --- the period -------------------------------------------------------------
//
// A period is same head, different tail: antecedent and consequent open with
// one idea, the antecedent ends open — a question — and the consequent
// descends by step onto the root and stays there. That tail asymmetry is the
// whole trick that makes an answer an answer; the old firePhrase transposed
// the entire cell and missed it.

/** A phrase, in mode degrees this time — the director owes it a rhythm. */
export interface Period {
  /** The shared opening, exactly as both halves state it. */
  head: readonly number[];
  /** Head plus the open tail, ending on the second or the fifth degree. */
  antecedent: readonly number[];
  /** Head plus the closing tail: a stepwise descent onto the root, held. */
  consequent: readonly number[];
}

/** The degree indices a question may hang on — the second and the fifth. */
export function openDegrees(mode: Mode): readonly number[] {
  return mode.length === 7 ? [1, 4] : [1, 3];
}

/** A zone's motif, as degrees: the melody cell's leap-then-steps shape. */
export function motifHead(seed: number, mode: Mode): readonly number[] {
  return melodyCell(seed, mode).map((semitone) => semitoneToDegree(mode, semitone));
}

const stepsBetween = (from: number, to: number): number[] => {
  const step = to > from ? 1 : -1;
  const out: number[] = [];
  for (let d = from + step; step > 0 ? d <= to : d >= to; d += step) out.push(d);
  return out;
};

/**
 * Deterministic on purpose — every restatement of a head gets the same
 * tails, so a developed motif is still audibly the motif.
 */
export function periodFrom(head: readonly number[], mode: Mode): Period {
  const last = head[head.length - 1];

  // The open tail steps to the nearest open degree, in whichever octave is
  // closest — and never stands still: an unmoved question is no question.
  const candidates: number[] = [];
  for (const open of openDegrees(mode)) {
    for (let octave = -2; octave <= 2; octave++) candidates.push(open + octave * mode.length);
  }
  let open = last;
  let best = Infinity;
  for (const candidate of candidates) {
    const distance = Math.abs(candidate - last);
    if (distance === 0) continue;
    if (distance < best || (distance === best && candidate < open)) {
      open = candidate;
      best = distance;
    }
  }

  // The closing tail falls by step to the root below; a head already on the
  // root closes with the upper-neighbour return instead.
  const root = mode.length * Math.floor(last / mode.length);
  const closing = last === root ? [last + 1, last] : stepsBetween(last, root);

  return {
    head,
    antecedent: [...head, ...stepsBetween(last, open)],
    consequent: [...head, ...closing],
  };
}

/** How a later statement develops the motif. Augmentation is a duration op. */
export type MotifOp = 'plain' | 'sequence' | 'inversion' | 'fragment';

export function applyOp(head: readonly number[], op: MotifOp, rng: Rng): readonly number[] {
  switch (op) {
    case 'plain':
      return head;
    case 'sequence':
      // The whole idea restated a step away — up or down, all of it.
      return head.map((degree) => degree + (rng.chance(0.5) ? 1 : -1));
    case 'inversion':
      return head.map((degree) => head[0] - (degree - head[0]));
    case 'fragment':
      return head.slice(0, Math.max(2, Math.ceil(head.length / 2)));
  }
}
