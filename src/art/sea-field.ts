import * as THREE from 'three';

// The sea's shore field: what every texel of the sea knows about the land around it.

/** Gravity, m/s². */
export const G = 9.81;
/** McCowan's breaking index: a wave breaks when its height reaches this fraction of the column. */
export const GAMMA = 0.78;
/** Shortest wavelength the field admits, metres. */
const SHORTEST_WAVE = 3;
/** Column the field reports where the top-down render found nothing, metres. */
const DEEP = 30;
/** Metres above the water level the top-down camera stands, and metres below it the render reaches. */
const ABOVE = 40;
const BELOW = 30;
/** Gauss–Seidel sweeps that relax the land's phase to the harmonic extension of the water's. */
const RELAX_SWEEPS = 32;

export interface SeaFieldSpec {
  /** Water level, world y. */
  level: number;
  /** World xz of the field's corner and its extent, metres. */
  x0: number;
  z0: number;
  width: number;
  depth: number;
  /** Metres per texel. */
  texel: number;
  /** Unit direction the swell travels, and its deep-water wavenumber, rad/m. */
  direction: readonly [number, number];
  k0: number;
}

/** Texel lanes: still column (m), wave phase (rad), signed distance to land (m, negative on land), travel bearing (rad). */
export const FIELD_LANES = 4;

export interface SeaField {
  cols: number;
  rows: number;
  texture: THREE.DataTexture;
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

/**
 * Draws the scene from above into a depth target over the field's rectangle and
 * reads it back as ground height per texel. Everything on the default layer
 * counts as ground: the terrain, the skirt, and every prop standing on them.
 */
function groundFromAbove(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  spec: SeaFieldSpec,
  cols: number,
  rows: number,
): Float32Array {
  const { level, x0, z0, width, depth } = spec;
  const cx = x0 + width / 2;
  const cz = z0 + depth / 2;
  const near = 0.1;
  const far = ABOVE + BELOW;

  const camera = new THREE.OrthographicCamera(-width / 2, width / 2, depth / 2, -depth / 2, near, far);
  camera.position.set(cx, level + ABOVE, cz);
  // Looking straight down with -z as screen up, so screen x is world x.
  camera.up.set(0, 0, -1);
  camera.lookAt(cx, level, cz);
  camera.updateMatrixWorld(true);
  camera.layers.set(0);

  const target = new THREE.WebGLRenderTarget(cols, rows, {
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    depthBuffer: true,
    stencilBuffer: false,
  });
  const depthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });

  const priorTarget = renderer.getRenderTarget();
  const priorOverride = scene.overrideMaterial;
  const priorClear = new THREE.Color();
  renderer.getClearColor(priorClear);
  const priorAlpha = renderer.getClearAlpha();
  const priorAutoClear = renderer.autoClear;

  scene.overrideMaterial = depthMaterial;
  renderer.setRenderTarget(target);
  // White packs to a depth of one: nothing drawn reads as the far plane.
  renderer.setClearColor(0xffffff, 1);
  renderer.autoClear = true;
  renderer.clear();
  renderer.render(scene, camera);

  const bytes = new Uint8Array(cols * rows * 4);
  renderer.readRenderTargetPixels(target, 0, 0, cols, rows, bytes);

  renderer.setRenderTarget(priorTarget);
  renderer.setClearColor(priorClear, priorAlpha);
  renderer.autoClear = priorAutoClear;
  scene.overrideMaterial = priorOverride;
  target.dispose();
  depthMaterial.dispose();

  // Which way the read-back rows and columns run in the world, from the camera itself.
  const corner = new THREE.Vector3(-1, -1, 0).unproject(camera);
  const alongX = new THREE.Vector3(1, -1, 0).unproject(camera).sub(corner);
  const alongY = new THREE.Vector3(-1, 1, 0).unproject(camera).sub(corner);

  const ground = new Float32Array(cols * rows);
  ground.fill(level - DEEP);
  const unpack = 255 / 256;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const p = (j * cols + i) * 4;
      const d =
        unpack *
        (bytes[p] / 255 / 16777216 + bytes[p + 1] / 255 / 65536 + bytes[p + 2] / 255 / 256 + bytes[p + 3] / 255);
      if (d >= 0.999) continue;
      const y = level + ABOVE - (near + d * (far - near));
      // The read-back pixel (i, j) to its field texel, through the camera's axes.
      const u = (i + 0.5) / cols;
      const v = (j + 0.5) / rows;
      const wx = corner.x + alongX.x * u + alongY.x * v;
      const wz = corner.z + alongX.z * u + alongY.z * v;
      const fi = Math.min(cols - 1, Math.max(0, Math.floor((wx - x0) / spec.texel)));
      const fj = Math.min(rows - 1, Math.max(0, Math.floor((wz - z0) / spec.texel)));
      ground[fj * cols + fi] = y;
    }
  }
  return ground;
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

/**
 * The bake. Ground from above; then the wave phase as the eikonal solution
 * |∇σ| = k(h) over the water, seeded on the rectangle's rim with the swell's
 * plane wave, so crests refract round everything that stands in the water;
 * the signed distance to land; and the phase carried smoothly onto the land so
 * the surface running up it is timed by the water it rises from.
 */
export function bakeSeaField(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  spec: SeaFieldSpec,
): SeaField {
  const { texel, x0, z0, width, depth, k0, level } = spec;
  const cols = Math.max(2, Math.ceil(width / texel));
  const rows = Math.max(2, Math.ceil(depth / texel));
  const count = cols * rows;
  const ground = groundFromAbove(renderer, scene, spec, cols, rows);

  const h = new Float32Array(count);
  for (let n = 0; n < count; n++) h[n] = level - ground[n];

  const omega = Math.sqrt(G * k0);
  const dirLength = Math.hypot(spec.direction[0], spec.direction[1]) || 1;
  const dx = spec.direction[0] / dirLength;
  const dz = spec.direction[1] / dirLength;
  const k = new Float32Array(count);
  for (let n = 0; n < count; n++) k[n] = wavenumber(omega, h[n], k0);

  const xOf = (n: number): number => x0 + ((n % cols) + 0.5) * texel;
  const zOf = (n: number): number => z0 + (Math.floor(n / cols) + 0.5) * texel;
  const water = (n: number): boolean => h[n] > 0;

  // --- phase over the water ---------------------------------------------------
  const sigma = new Float32Array(count);
  const state = new Uint8Array(count);
  const heap = new Heap();
  for (let n = 0; n < count; n++) {
    const i = n % cols;
    const j = Math.floor(n / cols);
    const onRim = i === 0 || j === 0 || i === cols - 1 || j === rows - 1;
    if (!onRim || !water(n)) continue;
    sigma[n] = k0 * (dx * xOf(n) + dz * zOf(n));
    state[n] = KNOWN;
    heap.push(sigma[n], n);
  }
  march(cols, rows, texel, sigma, state, heap, water, (n) => k[n]);
  const wet = state.slice();

  // --- distance to land --------------------------------------------------------
  const away = new Float32Array(count);
  state.fill(FAR);
  seedBoundary(
    cols,
    rows,
    (n) => !water(n),
    (n) => {
      away[n] = 0;
      state[n] = KNOWN;
      heap.push(0, n);
    },
  );
  march(cols, rows, texel, away, state, heap, water, () => 1);
  const distance = new Float32Array(count);
  for (let n = 0; n < count; n++) distance[n] = water(n) ? away[n] : 0;

  // --- onto the land: distance inward, and the phase of the nearest water ------
  const inland = new Float32Array(count);
  const origin = new Int32Array(count);
  state.fill(FAR);
  for (let n = 0; n < count; n++) origin[n] = n;
  seedBoundary(
    cols,
    rows,
    (n) => wet[n] === KNOWN,
    (n) => {
      inland[n] = 0;
      state[n] = KNOWN;
      heap.push(0, n);
    },
  );
  march(cols, rows, texel, inland, state, heap, (n) => wet[n] !== KNOWN, () => 1, origin);
  for (let n = 0; n < count; n++) {
    if (wet[n] === KNOWN) continue;
    distance[n] = -inland[n];
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

  // --- pack ---------------------------------------------------------------------
  // The travel bearing is up the phase gradient: σ grows the way the wave goes.
  const data = new Uint16Array(count * FIELD_LANES);
  const half = THREE.DataUtils.toHalfFloat;
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
    const bearing = Math.hypot(gx, gz) > 1e-6 ? Math.atan2(gz, gx) : Math.atan2(dz, dx);
    data[n * 4] = half(Math.min(h[n], DEEP));
    data[n * 4 + 1] = half(sigma[n]);
    data[n * 4 + 2] = half(distance[n]);
    data[n * 4 + 3] = half(bearing);
  }

  const texture = new THREE.DataTexture(data, cols, rows, THREE.RGBAFormat, THREE.HalfFloatType);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return { cols, rows, texture };
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
