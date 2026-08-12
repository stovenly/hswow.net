import { createRng } from '../../art/random';
import { degreeToSemitone, inMode, type Mode } from './theory';

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
