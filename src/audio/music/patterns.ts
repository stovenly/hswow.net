import { createRng, type Rng } from '../../art/random';
import { degreeToSemitone, inMode, semitoneToDegree, type Mode } from './theory';

/**
 * Seeded cell generators. A zone stores seeds, never notes; re-rolling a seed
 * replays its cell exactly, which is what makes a motif recur without a bar of
 * composed data anywhere. The `Rng` is the same seeded randomness every
 * builder uses — a seed that gave a different melody on a different day would
 * stop a zone's music being *its* music.
 *
 * Cells are walked in degree space and converted at the end, so the scale lock
 * holds by construction. The melodic rule is one leap, then steps, with the
 * first step recovering against the leap. The walk is clamped so a whole cell
 * spans no more than a major sixth, which is what makes cells
 * order-independent: whatever order the director plays them in, no interval
 * can exceed the span, so every permutation connects.
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

/** Semitone width of a degree line with one more note added to it. */
const spanWith = (degrees: readonly number[], next: number, mode: Mode): number => {
  let lo = Infinity;
  let hi = -Infinity;
  for (const degree of degrees) {
    const semitone = degreeToSemitone(mode, degree);
    lo = Math.min(lo, semitone);
    hi = Math.max(hi, semitone);
  }
  const added = degreeToSemitone(mode, next);
  return Math.max(hi, added) - Math.min(lo, added);
};

/**
 * The melodic rule re-applied to a line that has been developed: one leap of
 * two or three degrees, then steps, and the whole line inside `CONNECT`.
 * `applyOp` can lose it — a sequence most of all — so it is re-imposed rather
 * than played as found. Direction is preserved, so a sequence still sounds
 * sequenced and an inversion still sounds inverted.
 */
export function connect(head: readonly number[], mode: Mode): readonly number[] {
  if (head.length < 2) return head;
  const leap = head[1] - head[0];
  const up = leap >= 0 ? 1 : -1;
  const out = [head[0], head[0] + up * Math.min(3, Math.max(2, Math.abs(leap)))];
  for (let i = 2; i < head.length; i++) {
    const want = Math.sign(head[i] - head[i - 1]) || -up;
    let next = out[i - 1] + want;
    // Turning inward can only revisit ground already inside the span.
    if (spanWith(out, next, mode) > CONNECT) next = out[i - 1] - want;
    out.push(next);
  }
  return out;
}

/**
 * How closed a line's ending is, by as much of Narmour's checklist as a line
 * of degrees can show: a large interval into a small one, a change of
 * direction, and an arrival on the tonic. Rest, metrical position and the
 * length of the last note belong to the director, not to the line.
 */
export function closure(line: readonly number[], mode: Mode): number {
  if (line.length < 3) return 0;
  const n = line.length;
  const at = (i: number): number => degreeToSemitone(mode, line[i]);
  const last = at(n - 1) - at(n - 2);
  const prior = at(n - 2) - at(n - 3);
  let score = 0;
  if (Math.abs(last) < Math.abs(prior)) score++;
  if (Math.sign(last) !== Math.sign(prior)) score++;
  if ((((at(n - 1) % 12) + 12) % 12) === 0) score++;
  return score;
}

/**
 * Notes the texture stratum may sit on: root, fourth, fifth, octave, ninth,
 * filtered to the mode. No third — the mid stratum keeps the drone's ambiguity
 * rather than deciding major or minor underneath the melody.
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
// whole trick that makes an answer an answer.

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
 * Deterministic on purpose — every restatement of a head gets the same tails,
 * so a developed motif is still audibly the motif.
 */
export function periodFrom(head: readonly number[], mode: Mode): Period {
  const last = head[head.length - 1];

  // The open tail steps to the nearest open degree, in whichever octave is
  // closest, and never stands still: an unmoved question is no question. Where
  // two are equally near, the one carrying on the way the head was going wins
  // — a change of direction is one of Narmour's closure conditions, and a
  // question is the half that fails to close.
  const heading = head.length > 1 ? Math.sign(last - head[head.length - 2]) : 0;
  const candidates: number[] = [];
  for (const open of openDegrees(mode)) {
    for (let octave = -2; octave <= 2; octave++) candidates.push(open + octave * mode.length);
  }
  let open = last;
  let best = Infinity;
  for (const candidate of candidates) {
    const distance = Math.abs(candidate - last);
    if (distance === 0) continue;
    const turns = heading !== 0 && Math.sign(candidate - last) !== heading ? 0.5 : 0;
    const cost = distance + turns;
    if (cost < best || (cost === best && candidate < open)) {
      open = candidate;
      best = cost;
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

/**
 * Schoenberg's sentence, beside the period: presentation — the basic idea,
 * then the idea answered a degree away — continuation, which fragments the
 * answer and states its front half twice, and the cadence, the same stepwise
 * landing on the root the period closes with. Five gestures rather than a
 * question and an answer.
 */
export function sentenceFrom(head: readonly number[], mode: Mode): readonly (readonly number[])[] {
  const answer = connect(head.map((degree) => degree + 1), mode);
  const front = answer.slice(0, Math.max(2, Math.ceil(answer.length / 2)));
  const again = front.map((degree) => degree - 1);
  const last = again[again.length - 1];
  const root = mode.length * Math.floor(last / mode.length);
  const cadence = last === root ? [last + 1, last] : stepsBetween(last, root);
  return [head, answer, front, again, cadence];
}

/** How a later statement develops the motif. Augmentation is a duration op. */
export type MotifOp = 'plain' | 'sequence' | 'inversion' | 'fragment';

/** Every developed head goes back through `connect` — the cell's own rule. */
export function applyOp(
  head: readonly number[],
  op: MotifOp,
  rng: Rng,
  mode: Mode,
): readonly number[] {
  switch (op) {
    case 'plain':
      return head;
    case 'sequence':
      // The whole idea restated a step away — up or down, all of it.
      return connect(head.map((degree) => degree + (rng.chance(0.5) ? 1 : -1)), mode);
    case 'inversion':
      return connect(head.map((degree) => head[0] - (degree - head[0])), mode);
    case 'fragment':
      return head.slice(0, Math.max(2, Math.ceil(head.length / 2)));
  }
}
