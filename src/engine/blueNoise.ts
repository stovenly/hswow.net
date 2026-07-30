/**
 * Blue-noise threshold mask, by void-and-cluster (Ulichney, 1993).
 *
 * A Bayer matrix is a *regular* threshold pattern, so across a flat colour —
 * where every pixel is handed the same value to quantize — what you see is the
 * matrix itself, tiled: a grid of dots. It only flatters gradients, because
 * there the source colour is what varies and the matrix merely orders the
 * transitions.
 *
 * Blue noise has the same property that makes ordered dithering work (every
 * threshold value appears exactly once, evenly distributed) without the
 * regularity. Its energy is concentrated at high spatial frequencies and it
 * has almost none at low ones, which is precisely the definition of "looks
 * evenly scattered with no visible structure". On a flat colour it reads as a
 * fine organic stipple — closer to an engraving than to a screen door.
 *
 * Void-and-cluster builds the mask by repeatedly finding the emptiest region
 * ("void") and the most crowded one ("cluster") and ranking pixels by the
 * order in which they fill the space. It is slow to describe and quick to run:
 * the density field is updated incrementally, so placing or removing a point
 * touches only the pixels under the kernel rather than the whole image.
 */

/** Ulichney's suggested spread. Wider blurs the distinction between voids. */
const SIGMA = 1.9;
/** Kernel truncation. Past ~2.6σ the weights stop mattering. */
const RADIUS = 5;
/** Fraction of pixels in the initial random pattern. */
const SEED_DENSITY = 0.1;

/** Deterministic, so the same mask comes back every boot and the look is stable. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns `size * size` threshold values in 0..255, one per texel.
 *
 * `size` should be a power of two — the mask tiles, and the wrap arithmetic
 * below assumes it.
 */
export function generateBlueNoise(size: number, seed = 0x9e3779b9): Uint8Array<ArrayBuffer> {
  const count = size * size;
  const pattern = new Uint8Array(count);
  const density = new Float32Array(count);

  // Flattened kernel: offsets from a point to every pixel it influences.
  const offsets: number[] = [];
  const weights: number[] = [];
  for (let dy = -RADIUS; dy <= RADIUS; dy++) {
    for (let dx = -RADIUS; dx <= RADIUS; dx++) {
      offsets.push(dx, dy);
      weights.push(Math.exp(-(dx * dx + dy * dy) / (2 * SIGMA * SIGMA)));
    }
  }
  const taps = weights.length;

  /** Splats the kernel around `index`. `sign` is +1 to place, -1 to remove. */
  const stamp = (index: number, sign: number): void => {
    const px = index % size;
    const py = (index / size) | 0;
    for (let t = 0; t < taps; t++) {
      // Wrapped: the mask is a torus, or its edges would seam when tiled.
      const x = (px + offsets[t * 2] + size) % size;
      const y = (py + offsets[t * 2 + 1] + size) % size;
      density[y * size + x] += sign * weights[t];
    }
  };

  /** Most crowded pixel that is set, or emptiest pixel that is not. */
  const find = (occupied: 0 | 1, wantHighest: boolean): number => {
    let best = -1;
    let bestValue = wantHighest ? -Infinity : Infinity;
    for (let i = 0; i < count; i++) {
      if (pattern[i] !== occupied) continue;
      const value = density[i];
      if (wantHighest ? value > bestValue : value < bestValue) {
        bestValue = value;
        best = i;
      }
    }
    return best;
  };

  // --- initial pattern ----------------------------------------------------
  const random = mulberry32(seed);
  const ones = Math.max(1, Math.round(count * SEED_DENSITY));
  let placed = 0;
  while (placed < ones) {
    const index = (random() * count) | 0;
    if (pattern[index] === 1) continue;
    pattern[index] = 1;
    stamp(index, 1);
    placed++;
  }

  // Relax it: pull the tightest cluster apart and drop it into the largest
  // void, until moving a point would put it straight back where it came from.
  for (let guard = 0; guard < count * 4; guard++) {
    const cluster = find(1, true);
    pattern[cluster] = 0;
    stamp(cluster, -1);

    const voidPixel = find(0, false);
    if (voidPixel === cluster) {
      pattern[cluster] = 1;
      stamp(cluster, 1);
      break;
    }
    pattern[voidPixel] = 1;
    stamp(voidPixel, 1);
  }

  const prototype = pattern.slice();
  const prototypeDensity = density.slice();
  const rank = new Int32Array(count).fill(-1);

  // --- ranks below the initial density: unbuild the prototype -------------
  for (let r = ones - 1; r >= 0; r--) {
    const cluster = find(1, true);
    pattern[cluster] = 0;
    stamp(cluster, -1);
    rank[cluster] = r;
  }

  // --- ranks above it: keep filling the largest void ----------------------
  //
  // Ulichney splits this in two at the halfway point, reversing which colour
  // counts as the minority. On a torus the kernel sums to the same constant
  // everywhere, so the density of zeros is that constant minus the density of
  // ones — "tightest cluster of zeros" and "largest void of ones" pick the
  // same pixel, and the two phases collapse into one loop.
  pattern.set(prototype);
  density.set(prototypeDensity);
  for (let r = ones; r < count; r++) {
    const voidPixel = find(0, false);
    pattern[voidPixel] = 1;
    stamp(voidPixel, 1);
    rank[voidPixel] = r;
  }

  // Backed by an explicit ArrayBuffer: a plain `new Uint8Array(n)` is typed
  // over ArrayBufferLike, which admits SharedArrayBuffer, and three's texture
  // upload will not take one.
  const mask = new Uint8Array(new ArrayBuffer(count));
  for (let i = 0; i < count; i++) {
    // Centre of the rank's band, so no texel sits exactly on 0 or 255.
    mask[i] = Math.min(255, ((rank[i] + 0.5) / count) * 256);
  }
  return mask;
}
