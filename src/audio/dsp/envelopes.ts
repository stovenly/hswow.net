/**
 * Amplitude envelopes, pooled.
 *
 * Two things about envelopes cost more than they look like they should.
 *
 * **Corners are clicks.** A linear attack meeting a linear decay is a
 * discontinuity in the *slope*, and the ear hears that as a tick however short
 * the ramp is. At a few hundred grains a second those ticks are the whole
 * sound. A raised cosine — a Hann window — has no corners anywhere, and it is
 * the single change that turns granular synthesis from bubble wrap into
 * texture.
 *
 * **`setValueCurveAtTime` copies its argument.** Every call allocates and
 * copies the array it is handed. Building a fresh `Float32Array` per grain at
 * a few hundred grains a second is real garbage on the audio path, so the
 * curves are precomputed once at a handful of quantised peak levels and shared.
 * Nobody can hear the quantisation; everybody can hear a GC pause.
 *
 * Extracted from `foliage.ts`, which discovered both of these the hard way.
 */

/** Distinct peak levels available. More is smoother and buys nothing audible. */
const STEPS = 8;
/** Points per curve. Enough that the interpolation between them is inaudible. */
const POINTS = 48;

function build(shape: (t: number) => number): Float32Array[] {
  return Array.from({ length: STEPS }, (_, step) => {
    // Squared spacing, so most events sit low and a few stand slightly out.
    // Evenly spread amplitudes sound machine-made — real populations of small
    // events are heavily weighted toward the quiet ones.
    const peak = ((step + 1) / STEPS) ** 2;
    const curve = new Float32Array(POINTS);
    for (let i = 0; i < POINTS; i++) curve[i] = peak * shape(i / (POINTS - 1));
    return curve;
  });
}

/**
 * Symmetric raised cosine. Rises and falls equally.
 *
 * For sustained-ish grains where the event has no attack of its own — wind
 * through leaves, a breath of noise. Anything with a *strike* in it wants
 * `PERCUSSIVE` instead.
 */
export const HANN = build((t) => 0.5 * (1 - Math.cos(2 * Math.PI * t)));

/**
 * Fast rise, exponential-ish fall.
 *
 * The shape of something being hit. Still cosine-smoothed on the way up so it
 * has no corner, but the attack occupies a twentieth of the window rather than
 * half of it, which is the difference between a tap and a swell.
 */
export const PERCUSSIVE = build((t) => {
  const attack = 0.05;
  if (t < attack) return 0.5 * (1 - Math.cos(Math.PI * (t / attack)));
  const fall = (t - attack) / (1 - attack);
  return Math.exp(-5 * fall) * (1 - fall);
});

/**
 * Picks a curve at roughly the requested peak.
 *
 * @param level 0..1. Quantised to one of `STEPS` shared curves.
 */
export function curveAt(pool: Float32Array[], level: number): Float32Array {
  // `level` is a *peak*, and the pool is spaced by the square of its index, so
  // the index is recovered with a square root. Picking linearly here would
  // crowd every quiet event onto the bottom curve.
  const index = Math.round(Math.sqrt(Math.max(0, Math.min(1, level))) * (STEPS - 1));
  return pool[index];
}

/** A curve at random, weighted the way the pool is. Cheap variety. */
export function anyCurve(pool: Float32Array[]): Float32Array {
  return pool[Math.floor(Math.random() * STEPS)];
}

/**
 * Schedules a short envelope with a ramp and a decay, rather than a curve.
 *
 * For one-off events where the peak level matters exactly and the pool's
 * quantisation would be visible — an impact, a clank, a footfall. Cheaper than
 * a curve for a single event, and it can decay for longer than its nominal
 * duration, which `setValueCurveAtTime` cannot.
 *
 * **No `setValueAtTime` at the same instant as a curve.** An automation event
 * scheduled at exactly the start of a value curve is a spec violation and
 * throws; this function does not use curves, so it is safe to open with one.
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
  // what a real ring-down does too. The time constant is a third of the decay
  // so the audible tail is about the length asked for.
  gain.setTargetAtTime(0, at + attack, decay / 3);
}
