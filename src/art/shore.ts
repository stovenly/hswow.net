import type { Swell } from './water';

// The shore bake: what a water plane knows about its bed before it is drawn.

/** Gravity, m/s². */
export const G = 9.81;
/** Largest wavenumber the bake admits (rad/m); the wavelength never drops under ~3 m. */
export const K_CAP = 2.0;
/** McCowan's breaking index: a wave breaks when its height reaches this fraction of the column. */
export const GAMMA = 0.78;

/** A vertex grid in world xz. `cols` × `rows` vertices, spaced `sx` × `sz` from (`x0`, `z0`). */
export interface ShoreGrid {
  cols: number;
  rows: number;
  x0: number;
  z0: number;
  sx: number;
  sz: number;
}

/** One value per grid vertex, row-major. `dir` is two per vertex. */
export interface ShoreField {
  /** Still-water column, metres. Zero or less on land. */
  h: Float32Array;
  /** The shore train's spatial phase, radians. */
  sigma: Float32Array;
  /** Unit direction the train travels, world xz. */
  dir: Float32Array;
  /** Local wavenumber from the dispersion relation at this column, rad/m. */
  k: Float32Array;
}

export function deepWavenumber(swell: Swell): number {
  return (2 * Math.PI) / swell.length;
}

/** ω² = g k tanh(k h), solved for k by Newton from Eckart's estimate. */
export function wavenumber(omega: number, h: number, k0: number): number {
  if (h <= 0) return K_CAP;
  let k = k0 / Math.sqrt(Math.max(Math.tanh(k0 * h), 1e-6));
  for (let i = 0; i < 4; i++) {
    const t = Math.tanh(k * h);
    const f = G * k * t - omega * omega;
    const df = G * (t + k * h * (1 - t * t));
    k -= f / df;
  }
  return Math.min(Math.max(k, k0), K_CAP);
}

export function bakeShore(
  grid: ShoreGrid,
  level: number,
  groundAt: (x: number, z: number) => number,
  swell: Swell,
): ShoreField {
  const { cols, rows, x0, z0, sx, sz } = grid;
  const count = cols * rows;
  const h = new Float32Array(count);
  const sigma = new Float32Array(count);
  const dir = new Float32Array(count * 2);
  const k = new Float32Array(count);

  const k0 = deepWavenumber(swell);
  const omega = Math.sqrt(G * k0);
  const length = Math.hypot(swell.direction[0], swell.direction[1]) || 1;
  const dx = swell.direction[0] / length;
  const dz = swell.direction[1] / length;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const n = j * cols + i;
      const x = x0 + i * sx;
      const z = z0 + j * sz;
      h[n] = level - groundAt(x, z);
      k[n] = wavenumber(omega, h[n], k0);
      sigma[n] = k0 * (dx * x + dz * z);
      dir[n * 2] = dx;
      dir[n * 2 + 1] = dz;
    }
  }

  return { h, sigma, dir, k };
}
