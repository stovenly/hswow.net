/**
 * Amplitude envelopes, precomputed at a few quantised peak levels and shared:
 * `setValueCurveAtTime` copies its argument, and a fresh array per grain is
 * real garbage on the audio path.
 *
 * Every curve is cosine-smoothed. A corner in an envelope is a click, and at a
 * few hundred grains a second those clicks are the whole sound.
 */

/** Distinct peak levels available. More is smoother and buys nothing audible. */
export const STEPS = 8;
/** Points per curve. Enough that the interpolation between them is inaudible. */
const POINTS = 48;

function build(shape: (t: number) => number): Float32Array[] {
  return Array.from({ length: STEPS }, (_, step) => {
    // Squared spacing, so most events sit low and a few stand out. Evenly
    // spread amplitudes sound machine-made.
    const peak = ((step + 1) / STEPS) ** 2;
    const curve = new Float32Array(POINTS);
    for (let i = 0; i < POINTS; i++) curve[i] = peak * shape(i / (POINTS - 1));
    return curve;
  });
}

/**
 * Symmetric raised cosine, rising and falling equally. For grains with no
 * attack of their own — wind through leaves, a breath of noise.
 */
export const HANN = build((t) => 0.5 * (1 - Math.cos(2 * Math.PI * t)));

/**
 * Fast rise, exponential-ish fall: the shape of something being hit. The
 * attack occupies a twentieth of the window rather than half of it.
 */
export const PERCUSSIVE = build((t) => {
  const attack = 0.05;
  if (t < attack) return 0.5 * (1 - Math.cos(Math.PI * (t / attack)));
  const fall = (t - attack) / (1 - attack);
  return Math.exp(-5 * fall) * (1 - fall);
});

/** Picks a curve at roughly `level`, 0..1, quantised to one of `STEPS`. */
export function curveAt(pool: Float32Array[], level: number): Float32Array {
  // `level` is a peak and the pool is spaced by the square of its index, so
  // the index comes back with a square root.
  const index = Math.round(Math.sqrt(Math.max(0, Math.min(1, level))) * (STEPS - 1));
  return pool[index];
}

/** A curve at random, weighted the way the pool is. Cheap variety. */
export function anyCurve(pool: Float32Array[]): Float32Array {
  return pool[Math.floor(Math.random() * STEPS)];
}

/**
 * Schedules a ramp and a decay rather than a curve, for one-off events where
 * the peak matters exactly and the pool's quantisation would show. It can also
 * decay past its nominal duration, which `setValueCurveAtTime` cannot.
 */
export function strike(
  gain: AudioParam,
  at: number,
  level: number,
  attack: number,
  decay: number,
): void {
  gain.setValueAtTime(0, at);
  gain.linearRampToValueAtTime(level, at + attack);
  // `setTargetAtTime` is exponential and never truly reaches zero, which is
  // what a ring-down does. A third of the decay puts the audible tail at about
  // the length asked for.
  gain.setTargetAtTime(0, at + attack, decay / 3);
}
