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
  // Phase 6i: five scales the pastoral book had no use for. All keep the
  // perfect fifth, so the drone still fits under every one of them.
  'harmonic-minor': [0, 2, 3, 5, 7, 8, 11],
  'phrygian-dominant': [0, 1, 4, 5, 7, 8, 10],
  'blues-hexatonic': [0, 3, 5, 6, 7, 10],
  hirajoshi: [0, 2, 3, 7, 8],
  kumoi: [0, 2, 3, 7, 9],
} as const satisfies Record<string, Mode>;
// Locrian is left out on purpose. Its fifth is flat, and the drone is a root
// and a perfect fifth — a zone cannot declare a mode that argues with its
// own drone.

export type ModeName = keyof typeof MODES;

/**
 * The modes a bridge may step to — Phase 6k. One accidental apart and the
 * same number of notes: the brightness chain, plus the edges the 6i scales
 * added. Equal length is load-bearing — heads and ostinatos live in degree
 * space, so a same-size neighbour re-says the same idea with one accidental
 * moved. Blues has six notes and no same-size neighbour, so it sits out.
 */
export const NEIGHBOURS: Partial<Record<ModeName, readonly ModeName[]>> = {
  lydian: ['ionian'],
  ionian: ['lydian', 'mixolydian'],
  mixolydian: ['ionian', 'dorian'],
  dorian: ['mixolydian', 'aeolian'],
  aeolian: ['dorian', 'phrygian', 'harmonic-minor'],
  phrygian: ['aeolian', 'phrygian-dominant'],
  'harmonic-minor': ['aeolian'],
  'phrygian-dominant': ['phrygian'],
  'pentatonic-major': ['kumoi'],
  kumoi: ['pentatonic-major', 'hirajoshi'],
  hirajoshi: ['kumoi'],
};

/** The drone, as the grammar writes it: root and fifth, no third. */
export const DRONE: readonly number[] = [0, 7];

/** Hertz for a note `semitones` above (or below) a root given in hertz. */
export function hz(root: number, semitones: number): number {
  return root * 2 ** (semitones / 12);
}

/**
 * Pure ratios per pitch class above the zone root — Phase 6k. Equal
 * temperament makes every held interval beat slowly against the pad; drone
 * traditions tune to the drone instead. 5-limit, except the flat fifth,
 * which takes 7:5 — the blue note by ratio rather than by accident. The
 * minor seventh is two pure fourths, the gentlest of its candidates.
 */
export const JUST: readonly number[] = [
  1 / 1,
  16 / 15,
  9 / 8,
  6 / 5,
  5 / 4,
  4 / 3,
  7 / 5,
  3 / 2,
  8 / 5,
  5 / 3,
  16 / 9,
  15 / 8,
];

/**
 * `hz` retuned to the drone: pure octaves, pure ratios inside them. The
 * music path's hertz — the reference is always the zone root, never the
 * chord of the bar, because the drone is what the ear tunes to.
 */
export function justHz(root: number, semitones: number): number {
  const pc = ((semitones % 12) + 12) % 12;
  return root * JUST[pc] * 2 ** ((semitones - pc) / 12);
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
