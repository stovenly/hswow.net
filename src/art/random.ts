/**
 * Seeded randomness.
 *
 * Builders must be deterministic. A prop in the world is stored as a name and
 * a seed, and the geometry is rebuilt from those on load — so if the same seed
 * gave a different tree on a different day, the world would quietly rearrange
 * itself between sessions, and no save file could describe it.
 *
 * `Math.random` is therefore banned inside builders. Everything takes an `Rng`.
 */

export interface Rng {
  /** 0 ≤ x < 1. */
  (): number;
  /** Uniform in [min, max). */
  range(min: number, max: number): number;
  /** Integer in [min, max]. */
  int(min: number, max: number): number;
  /** True with probability `p`. */
  chance(p: number): boolean;
  /** One of the given values. */
  pick<T>(values: readonly T[]): T;
  /** Centred on `value`, plus or minus `spread` — the usual case. */
  around(value: number, spread: number): number;
}

export function createRng(seed: number): Rng {
  // **The incoming seed is avalanched before use.**
  //
  // Mulberry32 advances its state by a fixed constant each call, so two
  // streams started from seeds a fixed distance apart stay a fixed distance
  // apart, and their nth outputs are related. Callers overwhelmingly pass
  // sequences — 1, 2, 3…, or a base plus a stride — which is exactly the case
  // that breaks.
  //
  // It broke here. The prop gallery drew eight figures from `1000 + i * 7919`
  // and their nth draws agreed far more often than chance allows: a feature
  // set to appear on 62% of figures showed up on two of the eight, twice
  // running, and looked like a bug in the feature rather than in the seeding.
  // One round of avalanche mixing scatters neighbouring seeds across the whole
  // state space and costs three multiplies, once, per builder.
  let a = (seed >>> 0) || 0x9e3779b9;
  a = Math.imul(a ^ (a >>> 16), 0x45d9f3b);
  a = Math.imul(a ^ (a >>> 16), 0x45d9f3b);
  a = (a ^ (a >>> 16)) >>> 0;

  const next = (): number => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const rng = next as Rng;
  rng.range = (min, max) => min + next() * (max - min);
  rng.int = (min, max) => Math.floor(min + next() * (max - min + 1));
  rng.chance = (p) => next() < p;
  rng.pick = (values) => values[Math.floor(next() * values.length)];
  rng.around = (value, spread) => value + (next() * 2 - 1) * spread;
  return rng;
}
