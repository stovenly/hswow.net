/**
 * Tempo as a performance, not a setting.
 *
 * Pure curves only — the director owns the state that feeds them. The ritard
 * is Friberg & Sundberg's measured one: performed ritards track
 * v(x) = (1 + (v_end^q − 1)·x)^(1/q) with q ≈ 2, a curve that eases in and
 * commits late, which is why a linear slowdown never sounds like an ending.
 */

/**
 * Tempo factor at progress `x` through a ritard: 1 at the start, `vEnd` at
 * the close, monotone between. Divide a duration by it to slow down.
 */
export function ritardCurve(x: number, vEnd: number, q = 2): number {
  const p = Math.min(Math.max(x, 0), 1);
  return (1 + (vEnd ** q - 1) * p) ** (1 / q);
}

/** Section ends ease, they do not stop. */
export const SECTION_END_V = 0.85;

/** The final cadence commits. Rolled per piece. */
export const FINAL_V: readonly [number, number] = [0.5, 0.7];

/**
 * Phrase-arch rubato: the ends of a phrase linger a few percent and the
 * middle presses on. Multiply a note's duration by it.
 */
export function phraseArch(progress: number): number {
  const edge = Math.abs(Math.min(Math.max(progress, 0), 1) - 0.5) * 2;
  return 0.95 + 0.13 * edge * edge;
}
