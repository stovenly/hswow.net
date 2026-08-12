/**
 * Note math, mode tables, the scale lock.
 *
 * Pure arithmetic — no audio context anywhere in this file, which is what
 * lets `check:audio` assert the grammar headlessly. Pitch is a count of
 * semitones relative to a zone's declared root and only becomes hertz at the
 * last moment, on the way to a `noteOn`.
 *
 * The lock is the Spore lesson taken literally: Eno's day-two filter that
 * turned random sequences into music was nothing but "snap every note into
 * the mode", and here nothing upstream is trusted to be in the mode until
 * this file has said so.
 */

/** Semitones above the root, one octave, ascending, always starting at 0. */
export type Mode = readonly number[];

export const MODES = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  'pentatonic-major': [0, 2, 4, 7, 9],
  'pentatonic-minor': [0, 3, 5, 7, 10],
} as const satisfies Record<string, Mode>;
// Locrian is left out on purpose. Its fifth is flat, and the drone is a root
// and a perfect fifth — a zone cannot declare a mode that argues with its
// own drone.

export type ModeName = keyof typeof MODES;

/** The drone, as the grammar writes it: root and fifth, no third. */
export const DRONE: readonly number[] = [0, 7];

/** Hertz for a note `semitones` above (or below) a root given in hertz. */
export function hz(root: number, semitones: number): number {
  return root * 2 ** (semitones / 12);
}

export function inMode(semitone: number, mode: Mode): boolean {
  return mode.includes(((semitone % 12) + 12) % 12);
}

/** Snaps a semitone to the nearest scale degree; ties resolve downward. */
export function lock(semitone: number, mode: Mode): number {
  const pc = ((semitone % 12) + 12) % 12;
  let best = 0;
  let bestDistance = Infinity;
  for (const degree of mode) {
    // The nearest degree may sit across the octave seam in either direction.
    for (const candidate of [degree - 12, degree, degree + 12]) {
      const distance = Math.abs(candidate - pc);
      if (distance < bestDistance || (distance === bestDistance && candidate < best)) {
        best = candidate;
        bestDistance = distance;
      }
    }
  }
  return semitone + (best - pc);
}

/** Degree 0 is the root; degrees continue through neighbouring octaves. */
export function degreeToSemitone(mode: Mode, degree: number): number {
  const octave = Math.floor(degree / mode.length);
  return octave * 12 + mode[degree - octave * mode.length];
}

/** Inverse of `degreeToSemitone`. The note must be in the mode. */
export function semitoneToDegree(mode: Mode, semitone: number): number {
  const octave = Math.floor(semitone / 12);
  const index = mode.indexOf(semitone - octave * 12);
  if (index === -1) throw new Error(`semitone ${semitone} is not in the mode`);
  return octave * mode.length + index;
}

// Pitch class → weight for a harmonic centre. The classic modal moves — IV,
// the seconds, the sixths and sevenths — weigh most; the fifth is a dominant
// and the major seventh is its leading tone, and both pull the cadence the
// grammar forbids, so both weigh zero.
const CENTRE_WEIGHT: readonly number[] = [3, 2, 2, 1, 1, 3, 1, 0, 2, 2, 3, 0];

/**
 * The degrees a harmonic centre may stand on, repeated by weight so a uniform
 * pick over the array is the weighted pick. The root is always in the bag —
 * going home is a move too.
 */
export function centreMoves(mode: Mode): readonly number[] {
  const moves: number[] = [];
  mode.forEach((semitone, degree) => {
    for (let i = 0; i < CENTRE_WEIGHT[semitone]; i++) moves.push(degree);
  });
  return moves;
}
