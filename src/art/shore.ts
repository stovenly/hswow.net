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
  /** Still-water column, metres. On land, minus the distance to the water, metres. */
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

const FAR = 0;
const TRIAL = 1;
const KNOWN = 2;

/**
 * Fast marching over the grid: `field` becomes the eikonal solution with the
 * given cost per metre, growing outward from the cells already `KNOWN` and
 * pushed on `heap`, over the cells `admits` allows.
 */
function march(
  grid: ShoreGrid,
  field: Float32Array,
  state: Uint8Array,
  heap: Heap,
  admits: (n: number) => boolean,
  cost: (n: number) => number,
  origin?: Int32Array,
): void {
  const { cols, rows, sx, sz } = grid;
  const count = cols * rows;
  const ax = 1 / (sx * sx);
  const az = 1 / (sz * sz);
  const update = (n: number): void => {
    if (state[n] === KNOWN || !admits(n)) return;
    const i = n % cols;
    let a = Infinity;
    let b = Infinity;
    let from = -1;
    const offer = (m: number): void => {
      if (from < 0 || field[m] < field[from]) from = m;
    };
    if (i > 0 && state[n - 1] === KNOWN) {
      a = field[n - 1];
      offer(n - 1);
    }
    if (i < cols - 1 && state[n + 1] === KNOWN) {
      a = Math.min(a, field[n + 1]);
      offer(n + 1);
    }
    if (n >= cols && state[n - cols] === KNOWN) {
      b = field[n - cols];
      offer(n - cols);
    }
    if (n + cols < count && state[n + cols] === KNOWN) {
      b = Math.min(b, field[n + cols]);
      offer(n + cols);
    }
    const c = cost(n);
    let value: number;
    if (a === Infinity) value = b + c * sz;
    else if (b === Infinity) value = a + c * sx;
    else {
      const p = ax * a + az * b;
      const q = ax * a * a + az * b * b - c * c;
      const disc = p * p - (ax + az) * q;
      value = disc >= 0 ? (p + Math.sqrt(disc)) / (ax + az) : Infinity;
      if (value < Math.max(a, b)) value = Math.min(a + c * sx, b + c * sz);
    }
    if (state[n] === FAR || value < field[n]) {
      field[n] = value;
      state[n] = TRIAL;
      if (origin && from >= 0) origin[n] = origin[from];
      heap.push(value, n);
    }
  };
  while (heap.size > 0) {
    const n = heap.pop();
    if (state[n] === KNOWN && heap.lastValue > field[n]) continue;
    state[n] = KNOWN;
    const i = n % cols;
    if (i > 0) update(n - 1);
    if (i < cols - 1) update(n + 1);
    if (n >= cols) update(n - cols);
    if (n + cols < count) update(n + cols);
  }
}

/** Every known cell with an unknown neighbour, pushed as a seed. */
function seedEdge(grid: ShoreGrid, field: Float32Array, state: Uint8Array, heap: Heap): void {
  const { cols, rows } = grid;
  const count = cols * rows;
  for (let n = 0; n < count; n++) {
    if (state[n] !== KNOWN) continue;
    const i = n % cols;
    if (
      (i > 0 && state[n - 1] !== KNOWN) ||
      (i < cols - 1 && state[n + 1] !== KNOWN) ||
      (n >= cols && state[n - cols] !== KNOWN) ||
      (n + cols < count && state[n + cols] !== KNOWN)
    )
      heap.push(field[n], n);
  }
}

/**
 * The phase is the eikonal solution |∇σ| = k(h) over the water, marched inward
 * from the perimeter where it is the swell's own plane wave, with land as an
 * obstacle. Land takes the phase of the nearest water and the direction away
 * from it, so a swash sheet moves as one, and learns how far from the water
 * it stands.
 */
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
      h[n] = level - groundAt(x0 + i * sx, z0 + j * sz);
      k[n] = wavenumber(omega, h[n], k0);
    }
  }

  const state = new Uint8Array(count);
  const heap = new Heap();
  const onRim = (n: number): boolean => {
    const i = n % cols;
    const j = (n - i) / cols;
    return i === 0 || j === 0 || i === cols - 1 || j === rows - 1;
  };
  const seed = (n: number): void => {
    const i = n % cols;
    const j = (n - i) / cols;
    sigma[n] = k0 * (dx * (x0 + i * sx) + dz * (z0 + j * sz));
    state[n] = KNOWN;
    heap.push(sigma[n], n);
  };
  let seeded = 0;
  for (let n = 0; n < count; n++) {
    if (onRim(n) && h[n] > 0) {
      seed(n);
      seeded++;
    }
  }
  if (seeded === 0) for (let n = 0; n < count; n++) if (onRim(n)) seed(n);

  march(grid, sigma, state, heap, (n) => h[n] > 0, (n) => k[n]);
  const water = state.slice();

  // How far each cell the water never reached stands from the water, metres,
  // and which water cell is nearest.
  const away = new Float32Array(count);
  const origin = new Int32Array(count);
  for (let n = 0; n < count; n++) origin[n] = n;
  seedEdge(grid, away, state, heap);
  march(grid, away, state, heap, () => true, () => 1, origin);

  for (let n = 0; n < count; n++) {
    const i = n % cols;
    if (water[n] === KNOWN) {
      // The travel direction is up the phase gradient: σ grows the way the wave goes.
      const left = i > 0 && water[n - 1] === KNOWN;
      const right = i < cols - 1 && water[n + 1] === KNOWN;
      const back = n >= cols && water[n - cols] === KNOWN;
      const fore = n + cols < count && water[n + cols] === KNOWN;
      let gx = 0;
      let gz = 0;
      if (left && right) gx = (sigma[n + 1] - sigma[n - 1]) / (2 * sx);
      else if (right) gx = (sigma[n + 1] - sigma[n]) / sx;
      else if (left) gx = (sigma[n] - sigma[n - 1]) / sx;
      if (back && fore) gz = (sigma[n + cols] - sigma[n - cols]) / (2 * sz);
      else if (fore) gz = (sigma[n + cols] - sigma[n]) / sz;
      else if (back) gz = (sigma[n] - sigma[n - cols]) / sz;
      const len = Math.hypot(gx, gz);
      dir[n * 2] = len > 1e-6 ? gx / len : dx;
      dir[n * 2 + 1] = len > 1e-6 ? gz / len : dz;
    } else {
      const o = origin[n];
      const oi = o % cols;
      const ox = i - oi;
      const oz = (n - i) / cols - (o - oi) / cols;
      const len = Math.hypot(ox * sx, oz * sz);
      sigma[n] = sigma[o];
      dir[n * 2] = len > 1e-6 ? (ox * sx) / len : dx;
      dir[n * 2 + 1] = len > 1e-6 ? (oz * sz) / len : dz;
      if (h[n] <= 0) h[n] = -away[n];
    }
  }

  return { h, sigma, dir, k };
}

/** A binary min-heap of (value, index) pairs with lazy deletion. */
class Heap {
  private values: number[] = [];
  private items: number[] = [];
  /** The value the last `pop` came out with. */
  lastValue = 0;

  get size(): number {
    return this.items.length;
  }

  push(value: number, item: number): void {
    const values = this.values;
    const items = this.items;
    let i = items.length;
    values.push(value);
    items.push(item);
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (values[parent] <= values[i]) break;
      [values[parent], values[i]] = [values[i], values[parent]];
      [items[parent], items[i]] = [items[i], items[parent]];
      i = parent;
    }
  }

  pop(): number {
    const values = this.values;
    const items = this.items;
    const top = items[0];
    this.lastValue = values[0];
    const lastValue = values.pop() as number;
    const lastItem = items.pop() as number;
    if (items.length > 0) {
      values[0] = lastValue;
      items[0] = lastItem;
      let i = 0;
      const n = items.length;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < n && values[l] < values[m]) m = l;
        if (r < n && values[r] < values[m]) m = r;
        if (m === i) break;
        [values[m], values[i]] = [values[i], values[m]];
        [items[m], items[i]] = [items[i], items[m]];
        i = m;
      }
    }
    return top;
  }
}
