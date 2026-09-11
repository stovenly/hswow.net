import * as THREE from 'three';

// The water field: what every half metre of a body knows about its banks, its
// bed, its current and what stands in it. Baked on the CPU so the shader, the
// controller, the boats and the sound all read one set of numbers.

/** Gravity, m/s². */
export const G = 9.81;
/** McCowan's breaking index: a wave breaks when its height reaches this fraction of the column. */
export const GAMMA = 0.78;
/** Shortest wavelength the sea's phase lane admits, metres. */
const SHORTEST_WAVE = 3;
/** Column reported where the bed is deeper than the field cares about, metres. */
export const DEEP = 30;
/** Gauss–Seidel sweeps carrying the sea's phase onto the land. */
const RELAX_SWEEPS = 32;
/** `stand` and `bank` where nothing is in reach, metres. */
const CLEAR = 50;

export interface Disc {
  x: number;
  z: number;
  radius: number;
}

export interface FieldSpec {
  x0: number;
  z0: number;
  width: number;
  depth: number;
  texel: number;
  /** Surface height at a point, metres. Constant on a still body; descends along a course. */
  level(x: number, z: number): number;
  /** Whether the point lies within the body's authored shape. */
  inside(x: number, z: number): boolean;
  groundAt(x: number, z: number): number;
  /** Surface velocity at a point, m/s, for the flow regime. */
  flowAt?(x: number, z: number): readonly [number, number];
  /** Things standing in the water. Only entries that said `wades`. */
  stands: readonly Disc[];
  /** Where a tributary arrives: counted as open water, so no bank forms across it. */
  mouths: readonly Disc[];
  /** Bakes the phase lane: the swell's travel direction and deep-water wavenumber. */
  sea?: { direction: readonly [number, number]; k0: number };
  /** 1 in the open, `calm` inside a painted shelter, ramped at its edge. */
  calmAt?(x: number, z: number): number;
}

/**
 * Texture A holds column, bank, dir, stand; texture B holds flow x, flow z,
 * phase, calm. The water shader spells the same lane order.
 */
export class WaterField {
  readonly cols: number;
  readonly rows: number;
  readonly x0: number;
  readonly z0: number;
  readonly texel: number;
  readonly width: number;
  readonly depth: number;
  readonly column: Float32Array;
  readonly bank: Float32Array;
  readonly dir: Float32Array;
  readonly stand: Float32Array;
  readonly flowX: Float32Array;
  readonly flowZ: Float32Array;
  readonly phase: Float32Array;
  readonly calm: Float32Array;
  readonly textureA: THREE.DataTexture;
  readonly textureB: THREE.DataTexture;

  constructor(spec: FieldSpec) {
    this.texel = spec.texel;
    this.x0 = spec.x0;
    this.z0 = spec.z0;
    this.width = spec.width;
    this.depth = spec.depth;
    this.cols = Math.max(2, Math.ceil(spec.width / spec.texel));
    this.rows = Math.max(2, Math.ceil(spec.depth / spec.texel));
    const count = this.cols * this.rows;
    this.column = new Float32Array(count);
    this.bank = new Float32Array(count);
    this.dir = new Float32Array(count);
    this.stand = new Float32Array(count);
    this.flowX = new Float32Array(count);
    this.flowZ = new Float32Array(count);
    this.phase = new Float32Array(count);
    this.calm = new Float32Array(count);
    this.bake(spec);
    this.textureA = this.pack(this.column, this.bank, this.dir, this.stand);
    this.textureB = this.pack(this.flowX, this.flowZ, this.phase, this.calm);
  }

  xOf(n: number): number {
    return this.x0 + ((n % this.cols) + 0.5) * this.texel;
  }

  zOf(n: number): number {
    return this.z0 + (Math.floor(n / this.cols) + 0.5) * this.texel;
  }

  covers(x: number, z: number): boolean {
    return x >= this.x0 && z >= this.z0 && x <= this.x0 + this.width && z <= this.z0 + this.depth;
  }

  /** Bilinear read of one lane at a world point, clamped at the edge. */
  sample(lane: Float32Array, x: number, z: number): number {
    const u = (x - this.x0) / this.texel - 0.5;
    const v = (z - this.z0) / this.texel - 0.5;
    const i0 = Math.min(this.cols - 1, Math.max(0, Math.floor(u)));
    const j0 = Math.min(this.rows - 1, Math.max(0, Math.floor(v)));
    const i1 = Math.min(this.cols - 1, i0 + 1);
    const j1 = Math.min(this.rows - 1, j0 + 1);
    const fu = Math.min(1, Math.max(0, u - i0));
    const fv = Math.min(1, Math.max(0, v - j0));
    const a = lane[j0 * this.cols + i0];
    const b = lane[j0 * this.cols + i1];
    const c = lane[j1 * this.cols + i0];
    const d = lane[j1 * this.cols + i1];
    return (a * (1 - fu) + b * fu) * (1 - fv) + (c * (1 - fu) + d * fu) * fv;
  }

  dispose(): void {
    this.textureA.dispose();
    this.textureB.dispose();
  }

  private bake(spec: FieldSpec): void {
    const { cols, rows, texel } = this;
    const count = cols * rows;
    const water = new Uint8Array(count);
    for (let n = 0; n < count; n++) {
      const x = this.xOf(n);
      const z = this.zOf(n);
      const level = spec.level(x, z);
      const column = level - spec.groundAt(x, z);
      this.column[n] = Math.min(column, DEEP);
      let wet = spec.inside(x, z) && column > 0;
      if (!wet && column > 0) {
        for (const m of spec.mouths) {
          if (Math.hypot(x - m.x, z - m.z) <= m.radius) {
            wet = true;
            break;
          }
        }
      }
      water[n] = wet ? 1 : 0;
      this.calm[n] = spec.calmAt ? spec.calmAt(x, z) : 1;
      if (spec.flowAt && wet) {
        const [fx, fz] = spec.flowAt(x, z);
        this.flowX[n] = fx;
        this.flowZ[n] = fz;
      }
    }

    // --- bank and dir --------------------------------------------------------
    // Two marches from the waterline: over the water for the positive side, over
    // the land for the negative. Each carries the boundary cell it grew from, and
    // the bearing to that cell is `dir`.
    const heap = new Heap();
    const state = new Uint8Array(count);
    const origin = new Int32Array(count);
    const distance = new Float32Array(count);
    const isWater = (n: number): boolean => water[n] === 1;
    const isLand = (n: number): boolean => water[n] === 0;
    for (const side of [isWater, isLand]) {
      state.fill(FAR);
      for (let n = 0; n < count; n++) origin[n] = n;
      seedBoundary(cols, rows, side, (n) => {
        distance[n] = texel * 0.5;
        state[n] = KNOWN;
        heap.push(distance[n], n);
      });
      march(cols, rows, texel, distance, state, heap, side, () => 1, origin);
      for (let n = 0; n < count; n++) {
        if (!side(n)) continue;
        const d = state[n] === KNOWN ? distance[n] : CLEAR;
        this.bank[n] = side === isWater ? d : -d;
        const o = origin[n];
        this.dir[n] = o === n ? 0 : Math.atan2(this.zOf(o) - this.zOf(n), this.xOf(o) - this.xOf(n));
      }
    }

    // --- stand --------------------------------------------------------------
    this.stand.fill(CLEAR);
    for (const disc of spec.stands) {
      const reach = disc.radius + 4;
      const i0 = Math.max(0, Math.floor((disc.x - reach - this.x0) / texel));
      const i1 = Math.min(cols - 1, Math.ceil((disc.x + reach - this.x0) / texel));
      const j0 = Math.max(0, Math.floor((disc.z - reach - this.z0) / texel));
      const j1 = Math.min(rows - 1, Math.ceil((disc.z + reach - this.z0) / texel));
      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) {
          const n = j * cols + i;
          const d = Math.hypot(this.xOf(n) - disc.x, this.zOf(n) - disc.z) - disc.radius;
          if (d < this.stand[n]) this.stand[n] = Math.max(d, 0);
        }
      }
    }

    if (spec.sea) this.bakePhase(spec, water, heap, state, origin);
  }

  /**
   * The eikonal solution |∇σ| = k(h) over the water, seeded on the field's rim
   * with the swell's plane wave so crests refract round what stands in the water,
   * and carried smoothly onto the land so the swash is timed by the water it rises from.
   */
  private bakePhase(spec: FieldSpec, water: Uint8Array, heap: Heap, state: Uint8Array, origin: Int32Array): void {
    const { cols, rows, texel } = this;
    const count = cols * rows;
    const sea = spec.sea as NonNullable<FieldSpec['sea']>;
    const k0 = sea.k0;
    const omega = Math.sqrt(G * k0);
    const len = Math.hypot(sea.direction[0], sea.direction[1]) || 1;
    const dx = sea.direction[0] / len;
    const dz = sea.direction[1] / len;
    const k = new Float32Array(count);
    for (let n = 0; n < count; n++) k[n] = wavenumber(omega, this.column[n], k0);
    const isWater = (n: number): boolean => water[n] === 1;

    const sigma = this.phase;
    state.fill(FAR);
    for (let n = 0; n < count; n++) {
      const i = n % cols;
      const j = Math.floor(n / cols);
      const onRim = i === 0 || j === 0 || i === cols - 1 || j === rows - 1;
      if (!onRim || !isWater(n)) continue;
      sigma[n] = k0 * (dx * this.xOf(n) + dz * this.zOf(n));
      state[n] = KNOWN;
      heap.push(sigma[n], n);
    }
    march(cols, rows, texel, sigma, state, heap, isWater, (n) => k[n]);
    const wet = state.slice();
    for (let n = 0; n < count; n++) {
      if (isWater(n) && wet[n] !== KNOWN) sigma[n] = k0 * (dx * this.xOf(n) + dz * this.zOf(n));
    }

    const inland = new Float32Array(count);
    state.fill(FAR);
    for (let n = 0; n < count; n++) origin[n] = n;
    seedBoundary(cols, rows, (n) => wet[n] === KNOWN, (n) => {
      inland[n] = 0;
      state[n] = KNOWN;
      heap.push(0, n);
    });
    march(cols, rows, texel, inland, state, heap, (n) => wet[n] !== KNOWN, () => 1, origin);
    for (let n = 0; n < count; n++) {
      if (wet[n] === KNOWN) continue;
      sigma[n] = sigma[origin[n]];
    }
    for (let sweep = 0; sweep < RELAX_SWEEPS; sweep++) {
      const forward = sweep % 2 === 0;
      for (let s = 0; s < count; s++) {
        const n = forward ? s : count - 1 - s;
        if (wet[n] === KNOWN) continue;
        const i = n % cols;
        let sum = 0;
        let weight = 0;
        if (i > 0) {
          sum += sigma[n - 1];
          weight++;
        }
        if (i < cols - 1) {
          sum += sigma[n + 1];
          weight++;
        }
        if (n >= cols) {
          sum += sigma[n - cols];
          weight++;
        }
        if (n + cols < count) {
          sum += sigma[n + cols];
          weight++;
        }
        sigma[n] = sum / weight;
      }
    }
    // On a sea `dir` is the travel bearing, up the phase gradient; the bank is
    // read from the `bank` lane alone.
    for (let n = 0; n < count; n++) {
      const i = n % cols;
      const gx =
        i > 0 && i < cols - 1
          ? (sigma[n + 1] - sigma[n - 1]) / (2 * texel)
          : i > 0
            ? (sigma[n] - sigma[n - 1]) / texel
            : (sigma[n + 1] - sigma[n]) / texel;
      const gz =
        n >= cols && n + cols < count
          ? (sigma[n + cols] - sigma[n - cols]) / (2 * texel)
          : n >= cols
            ? (sigma[n] - sigma[n - cols]) / texel
            : (sigma[n + cols] - sigma[n]) / texel;
      this.dir[n] = Math.hypot(gx, gz) > 1e-6 ? Math.atan2(gz, gx) : Math.atan2(dz, dx);
    }
  }

  private pack(a: Float32Array, b: Float32Array, c: Float32Array, d: Float32Array): THREE.DataTexture {
    const count = this.cols * this.rows;
    const data = new Uint16Array(count * 4);
    const half = THREE.DataUtils.toHalfFloat;
    for (let n = 0; n < count; n++) {
      data[n * 4] = half(a[n]);
      data[n * 4 + 1] = half(b[n]);
      data[n * 4 + 2] = half(c[n]);
      data[n * 4 + 3] = half(d[n]);
    }
    const texture = new THREE.DataTexture(data, this.cols, this.rows, THREE.RGBAFormat, THREE.HalfFloatType);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  }
}

/** ω² = g k tanh(k h), solved for k by Newton from Eckart's estimate. */
export function wavenumber(omega: number, h: number, k0: number): number {
  const cap = (2 * Math.PI) / SHORTEST_WAVE;
  if (h <= 0) return cap;
  let k = k0 / Math.sqrt(Math.max(Math.tanh(k0 * h), 1e-6));
  for (let i = 0; i < 4; i++) {
    const t = Math.tanh(k * h);
    const f = G * k * t - omega * omega;
    const df = G * (t + k * h * (1 - t * t));
    k -= f / df;
  }
  return Math.min(Math.max(k, k0), cap);
}

const FAR = 0;
const TRIAL = 1;
const KNOWN = 2;

/**
 * Fast marching on the texel grid: `field` becomes the eikonal solution with
 * `cost` per metre, growing from the cells already known and on the heap, over
 * the cells `admits` allows. `origin` follows which seed each cell descends from.
 */
function march(
  cols: number,
  rows: number,
  texel: number,
  field: Float32Array,
  state: Uint8Array,
  heap: Heap,
  admits: (n: number) => boolean,
  cost: (n: number) => number,
  origin?: Int32Array,
): void {
  const count = cols * rows;
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
    const c = cost(n) * texel;
    let value: number;
    if (a === Infinity) value = b + c;
    else if (b === Infinity) value = a + c;
    else {
      const diff = a - b;
      value = Math.abs(diff) >= c ? Math.min(a, b) + c : (a + b + Math.sqrt(2 * c * c - diff * diff)) / 2;
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

/** Every cell for which `edge` holds and that has a neighbour for which it does not. */
function seedBoundary(
  cols: number,
  rows: number,
  edge: (n: number) => boolean,
  seed: (n: number) => void,
): void {
  const count = cols * rows;
  for (let n = 0; n < count; n++) {
    if (!edge(n)) continue;
    const i = n % cols;
    if (
      (i > 0 && !edge(n - 1)) ||
      (i < cols - 1 && !edge(n + 1)) ||
      (n >= cols && !edge(n - cols)) ||
      (n + cols < count && !edge(n + cols))
    )
      seed(n);
  }
}

/** A binary min-heap of (value, index) pairs with lazy deletion. */
class Heap {
  private values: number[] = [];
  private items: number[] = [];
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
