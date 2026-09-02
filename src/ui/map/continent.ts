import type { Family } from './relief';

/**
 * The continent under the world map: a raster of land, height, water and
 * moisture drawn from the zone graph, and the lines traced off it.
 *
 * The continent is a fib — the places are a few hundred metres across and the
 * map claims they are days apart — but it is a deterministic one: same nodes,
 * same roads, same seed, same coast on every machine. Nothing here depends on
 * what the player has found.
 *
 * Everything is in map units, where a road is `ROAD` long, except the cell
 * fields, which are in cells.
 */

/** Map units between two places joined by a road. Everything on the world map is measured in these. */
export const ROAD = 1;

/** Cells across the raster's longer side. */
const CELLS = 1536;

export interface Span {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A place the land is built around. */
export interface Site {
  x: number;
  y: number;
  family: Family | null;
}

/** A closed polyline in map units. */
export type Loop = [number, number][];

export interface River {
  /** Source to mouth, in map units. */
  points: [number, number][];
  /** How many rivers have joined by the mouth, which is how wide it is drawn. */
  flux: number;
}

export interface Continent {
  span: Span;
  cols: number;
  rows: number;
  /** Map units per cell. */
  cell: number;
  land: Uint8Array;
  lake: Uint8Array;
  /** Cells from the sea: positive on land, negative at sea. */
  shore: Float32Array;
  /** 0..1 over land, 0 elsewhere. */
  height: Float32Array;
  /** 0..1 over land. */
  wet: Float32Array;
  /** 0..1 over land: how far an industrial place has spoiled the ground. */
  blight: Float32Array;
  /** Hillshade, 1 on the flat. */
  shade: Float32Array;
  /** Cells to the nearest river or lake, over land. */
  fresh: Float32Array;
  coast: Loop[];
  lakes: Loop[];
  /** Ripple lines off the coast, nearest first. */
  ripples: Loop[][];
  rivers: River[];
}

/** The field a place is built on and what the kind of place does to it. */
interface Shape {
  radius: number;
  lift: number;
}
const SHAPES: Record<Family | 'none', Shape> = {
  none: { radius: 0.9, lift: 1 },
  village: { radius: 0.9, lift: 1 },
  farm: { radius: 1, lift: 0.95 },
  forest: { radius: 0.95, lift: 1.05 },
  riverside: { radius: 0.9, lift: 0.9 },
  cave: { radius: 0.85, lift: 1.25 },
  factory: { radius: 0.9, lift: 1 },
  sewer: { radius: 0.9, lift: 0.95 },
  scrapyard: { radius: 0.9, lift: 1 },
  substation: { radius: 0.9, lift: 1 },
  beach: { radius: 0.72, lift: 0.68 },
  plains: { radius: 1.15, lift: 0.9 },
};

const INDUSTRY: ReadonlySet<Family> = new Set(['factory', 'sewer', 'scrapyard', 'substation']);

/** Roads inland at which the ground is as high as it gets. */
const PEAK_REACH = 0.5;
/** Roads from the sheet's edge over which the land dies away, so no coast runs along the edge. */
const EDGE_FADE = 1.1;

/** Where the sea sits in the land field, and how far the noise reaches either side of it. */
const SEA = 0.16;
const NOISE = 0.55;
/** Wavelengths, in roads. */
const COAST_WAVE = 0.9;
const ISLE_WAVE = 0.55;
const HEIGHT_WAVE = 0.5;
const WET_WAVE = 0.4;
const LAKE_WAVE = 0.32;

const RIDGE_RADIUS = 0.32;
const RIDGE_LIFT = 0.7;

/** Land narrower than this many roads is a speck, and sea narrower than it a puddle. */
const SPECK = 0.04;
const PUDDLE = 0.07;

/** Ripple lines off the coast, in cells out. */
const RIPPLES = [5, 11, 19];

/** A lake's width, in roads. */
const LAKE_LEAST = 0.06;
const LAKE_MOST = 0.36;

/** Up to how many rivers start on high ground, per road-square of land. */
const RIVERS_PER_AREA = 1.2;

export function buildContinent(sites: readonly Site[], roads: readonly [number, number][][], span: Span, seed: number): Continent {
  const cell = Math.max(span.w, span.h) / CELLS;
  const cols = Math.max(2, Math.round(span.w / cell));
  const rows = Math.max(2, Math.round(span.h / cell));
  const n = cols * rows;
  const at = (col: number, row: number): [number, number] => [
    span.x + (col + 0.5) * cell,
    span.y + (row + 0.5) * cell,
  ];

  // --- land ---------------------------------------------------------------
  const field = new Float32Array(n);
  const ridge = new Float32Array(n);
  for (const site of sites) {
    const shape = SHAPES[site.family ?? 'none'];
    stamp(field, cols, rows, span, cell, site.x, site.y, shape.radius * ROAD, shape.lift, false);
  }
  for (const road of roads) {
    for (const [x, y] of road) {
      stamp(ridge, cols, rows, span, cell, x, y, RIDGE_RADIUS * ROAD, RIDGE_LIFT, true);
    }
  }
  const land = new Uint8Array(n);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col;
      const [x, y] = at(col, row);
      const isle = Math.max(0, fbm(x / ISLE_WAVE, y / ISLE_WAVE, seed + 7, 2) - 0.72) * 3;
      const toEdge = Math.min(x - span.x, span.x + span.w - x, y - span.y, span.y + span.h - y);
      const inland = Math.min(1, Math.max(0, toEdge / (EDGE_FADE * ROAD)));
      const value =
        (field[i] + ridge[i] + isle) * inland * inland * (3 - 2 * inland) +
        (fbm(x / COAST_WAVE, y / COAST_WAVE, seed, 3) - 0.5) * NOISE -
        SEA;
      const rim = col < 2 || row < 2 || col >= cols - 2 || row >= rows - 2;
      land[i] = value > 0 && !rim ? 1 : 0;
    }
  }
  const cellsIn = (width: number): number => (width * width) / (cell * cell);
  tidy(land, cols, rows, 1, cellsIn(SPECK * ROAD));
  tidy(land, cols, rows, 0, cellsIn(PUDDLE * ROAD));
  // Sea is what the ocean reaches. A pocket of it shut in by land is land —
  // the lakes are chosen later, and on purpose.
  for (const pocket of components(land, cols, rows, 0)) {
    let open = false;
    for (const i of pocket) {
      const col = i % cols;
      const row = (i - col) / cols;
      if (col === 0 || row === 0 || col === cols - 1 || row === rows - 1) {
        open = true;
        break;
      }
    }
    if (!open) for (const i of pocket) land[i] = 1;
  }

  // --- the shore, both ways ----------------------------------------------
  const shore = distance(cols, rows, (i) => land[i] === 1, (i) => land[i] === 0);
  const seaward = distance(cols, rows, (i) => land[i] === 0, (i) => land[i] === 1);
  for (let i = 0; i < n; i++) if (land[i] === 0) shore[i] = -seaward[i];

  // --- height -------------------------------------------------------------
  const height = new Float32Array(n);
  // Cells from the coast at which the land is as high as it gets.
  const peak = Math.max(1, (PEAK_REACH * ROAD) / cell);
  const flat = sites.filter((site) => site.family === 'plains');
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col;
      if (!land[i]) continue;
      const [x, y] = at(col, row);
      let h = Math.pow(Math.min(1, shore[i] / peak), 0.8);
      h *= 0.55 + 0.45 * fbm(x / HEIGHT_WAVE, y / HEIGHT_WAVE, seed + 3, 3);
      // A place sits in its own valley; a cave is the exception, and is a peak.
      for (const site of sites) {
        const d = Math.hypot(x - site.x, y - site.y);
        if (site.family === 'cave') h += 0.9 * kernel(d, 0.45 * ROAD);
        else h *= 1 - 0.55 * kernel(d, 0.4 * ROAD);
      }
      for (const site of flat) h *= 1 - 0.6 * kernel(Math.hypot(x - site.x, y - site.y), 1.0 * ROAD);
      height[i] = Math.min(1, h);
    }
  }

  // --- lakes --------------------------------------------------------------
  const lake = new Uint8Array(n);
  {
    const want = new Uint8Array(n);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        if (!land[i] || shore[i] * cell < 0.22 * ROAD) continue;
        const h = height[i];
        if (h < 0.12 || h > 0.55) continue;
        const [x, y] = at(col, row);
        if (fbm(x / LAKE_WAVE, y / LAKE_WAVE, seed + 11, 2) < 0.3) want[i] = 1;
      }
    }
    const most = Math.min(3, 1 + Math.floor(sites.length / 3));
    const pools = components(want, cols, rows, 1)
      .filter((pool) => pool.length >= cellsIn(LAKE_LEAST * ROAD) && pool.length <= cellsIn(LAKE_MOST * ROAD))
      .sort((a, b) => b.length - a.length)
      .slice(0, most);
    // A lake is flat, at the lowest point of its bed.
    for (const pool of pools) {
      let level = Infinity;
      for (const i of pool) level = Math.min(level, height[i]);
      for (const i of pool) {
        lake[i] = 1;
        height[i] = level;
      }
    }
  }

  // --- rivers -------------------------------------------------------------
  const filled = flood(cols, rows, land, lake, height);
  const rivers: River[] = [];
  const onRiver = new Int32Array(n).fill(-1);
  // `leaving` is a lake's outflow, which may not run back into the lake it
  // left: where the filled ground offers nothing else it steps toward the sea.
  const trace = (start: number, leaving = false): void => {
    const path: number[] = [];
    let i = start;
    let joined = -1;
    while (i >= 0 && land[i] && !lake[i] && path.length < 6000) {
      if (onRiver[i] >= 0) {
        joined = onRiver[i];
        break;
      }
      path.push(i);
      i = downhill(i, cols, rows, shore, filled, lake, leaving);
      if (i < 0 && leaving) i = toSea(path, cols, rows, shore, lake);
    }
    if (path.length < 6) return;
    const index = rivers.length;
    for (const c of path) onRiver[c] = index;
    if (i >= 0) path.push(i);
    rivers.push({ points: path.map((c) => at(c % cols, Math.floor(c / cols))), flux: 1 });
    if (joined >= 0) rivers[joined].flux += 1;
  };
  for (const site of sites) {
    if (site.family !== 'riverside') continue;
    const start = highestNear(site.x, site.y, 0.4 * ROAD, span, cell, cols, rows, land, shore);
    if (start >= 0) trace(start);
  }
  {
    let area = 0;
    for (let i = 0; i < n; i++) area += land[i];
    area *= cell * cell;
    const wanted = Math.max(1, Math.min(12, Math.round(area * RIVERS_PER_AREA)));
    const step = Math.max(2, Math.round((0.25 * ROAD) / cell));
    const heads: number[] = [];
    for (let row = step >> 1; row < rows; row += step) {
      for (let col = step >> 1; col < cols; col += step) {
        const i = row * cols + col;
        if (land[i] && !lake[i] && height[i] > 0.45 && onRiver[i] < 0) heads.push(i);
      }
    }
    heads.sort((a, b) => height[b] - height[a]);
    for (const head of heads.slice(0, wanted)) trace(head);
  }
  for (const pool of components(lake, cols, rows, 1)) {
    let mouth = -1;
    for (const i of pool) {
      for (const j of around(i, cols, rows)) {
        if (land[j] && !lake[j] && (mouth < 0 || shore[j] < shore[mouth])) mouth = j;
      }
    }
    if (mouth >= 0) trace(mouth, true);
  }

  // --- moisture -----------------------------------------------------------
  const fresh = distance(cols, rows, (i) => land[i] === 1, (i) => onRiver[i] >= 0 || lake[i] === 1);
  const wet = new Float32Array(n);
  const blight = new Float32Array(n);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col;
      if (!land[i]) continue;
      const [x, y] = at(col, row);
      let w = 1 - Math.min(1, (fresh[i] * cell) / (0.45 * ROAD));
      w += (fbm(x / WET_WAVE, y / WET_WAVE, seed + 5, 2) - 0.5) * 0.3;
      let spoil = 0;
      for (const site of sites) {
        const d = Math.hypot(x - site.x, y - site.y);
        switch (site.family) {
          case 'forest':
            w += 0.6 * kernel(d, 0.8 * ROAD);
            break;
          case 'farm':
            w += 0.35 * kernel(d, 0.7 * ROAD);
            break;
          case 'riverside':
            w += 0.3 * kernel(d, 0.6 * ROAD);
            break;
          case 'plains':
            w -= 0.5 * kernel(d, 1.0 * ROAD);
            break;
          default:
            if (site.family && INDUSTRY.has(site.family)) spoil += kernel(d, 0.6 * ROAD);
        }
      }
      wet[i] = Math.min(1, Math.max(0, w));
      blight[i] = Math.min(1, spoil);
    }
  }

  // --- relief -------------------------------------------------------------
  const shade = new Float32Array(n).fill(1);
  {
    // Lit from the north-west: -x, and -y, which is up the sheet.
    const lx = -1 / 1.86;
    const ly = -1 / 1.86;
    const lz = 1.2 / 1.86;
    const flatLight = lz;
    const steep = 120;
    for (let row = 1; row < rows - 1; row++) {
      for (let col = 1; col < cols - 1; col++) {
        const i = row * cols + col;
        if (!land[i]) continue;
        const dx = (height[i + 1] - height[i - 1]) * 0.5 * steep;
        const dy = (height[i + cols] - height[i - cols]) * 0.5 * steep;
        const len = Math.hypot(dx, dy, 1);
        const lit = (-dx * lx - dy * ly + lz) / len;
        shade[i] = Math.min(1.18, Math.max(0.6, 0.55 + 0.6 * lit)) / (0.55 + 0.6 * flatLight);
      }
    }
  }

  // --- the lines ----------------------------------------------------------
  const landField = new Float32Array(n);
  for (let i = 0; i < n; i++) landField[i] = land[i] ? 1 : -1;
  blur(landField, cols, rows);
  const coast = contour(landField, cols, rows, 0, span, cell);

  const lakeField = new Float32Array(n);
  for (let i = 0; i < n; i++) lakeField[i] = lake[i] ? 1 : -1;
  blur(lakeField, cols, rows);
  const lakes = contour(lakeField, cols, rows, 0, span, cell);

  const ripples = RIPPLES.map((out) => contour(shore, cols, rows, -out, span, cell));

  return {
    span,
    cols,
    rows,
    cell,
    land,
    lake,
    shore,
    height,
    wet,
    blight,
    shade,
    fresh,
    coast,
    lakes,
    ripples,
    rivers,
  };
}

/** A sample of the continent at a map point, for anything placed on it. */
export function sample(c: Continent, x: number, y: number): number {
  const col = Math.floor((x - c.span.x) / c.cell);
  const row = Math.floor((y - c.span.y) / c.cell);
  if (col < 0 || row < 0 || col >= c.cols || row >= c.rows) return -1;
  return row * c.cols + col;
}

/** Forest thickens with wetness on middling ground; 0..1. */
export function woodland(c: Continent, i: number): number {
  const h = c.height[i];
  return step(0.45, 0.8, c.wet[i]) * step(0.04, 0.16, h) * (1 - step(0.58, 0.72, h)) * (1 - c.blight[i]);
}

function step(a: number, b: number, t: number): number {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

/** A smooth hill of radius `r`, 1 at the middle and 0 at the rim. */
export function kernel(d: number, r: number): number {
  if (d >= r) return 0;
  const t = 1 - (d * d) / (r * r);
  return t * t;
}

function stamp(
  into: Float32Array,
  cols: number,
  rows: number,
  span: Span,
  cell: number,
  x: number,
  y: number,
  r: number,
  lift: number,
  most: boolean,
): void {
  const c0 = Math.max(0, Math.floor((x - r - span.x) / cell));
  const c1 = Math.min(cols - 1, Math.ceil((x + r - span.x) / cell));
  const r0 = Math.max(0, Math.floor((y - r - span.y) / cell));
  const r1 = Math.min(rows - 1, Math.ceil((y + r - span.y) / cell));
  for (let row = r0; row <= r1; row++) {
    const dy = span.y + (row + 0.5) * cell - y;
    for (let col = c0; col <= c1; col++) {
      const dx = span.x + (col + 0.5) * cell - x;
      const v = kernel(Math.hypot(dx, dy), r) * lift;
      const i = row * cols + col;
      into[i] = most ? Math.max(into[i], v) : into[i] + v;
    }
  }
}

function hash2(x: number, y: number, seed: number): number {
  let h = Math.imul(x, 0x27d4eb2d) ^ Math.imul(y, 0x165667b1) ^ Math.imul(seed, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Value noise, 0..1, smooth across the unit lattice. */
function noise(x: number, y: number, seed: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash2(x0, y0, seed);
  const b = hash2(x0 + 1, y0, seed);
  const c = hash2(x0, y0 + 1, seed);
  const d = hash2(x0 + 1, y0 + 1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

export function fbm(x: number, y: number, seed: number, octaves: number): number {
  let sum = 0;
  let amp = 0.5;
  let total = 0;
  for (let o = 0; o < octaves; o++) {
    sum += noise(x, y, seed + o * 131) * amp;
    total += amp;
    x = x * 2.03 + 17.1;
    y = y * 2.03 + 9.7;
    amp *= 0.5;
  }
  return sum / total;
}

function around(i: number, cols: number, rows: number): number[] {
  const col = i % cols;
  const row = (i - col) / cols;
  const out: number[] = [];
  for (let dy = -1; dy <= 1; dy++) {
    const r = row + dy;
    if (r < 0 || r >= rows) continue;
    for (let dx = -1; dx <= 1; dx++) {
      const c = col + dx;
      if ((dx === 0 && dy === 0) || c < 0 || c >= cols) continue;
      out.push(r * cols + c);
    }
  }
  return out;
}

/** Connected runs of cells holding `value`, four-connected. */
function components(mask: Uint8Array, cols: number, rows: number, value: number): number[][] {
  const seen = new Uint8Array(mask.length);
  const out: number[][] = [];
  const stack: number[] = [];
  for (let start = 0; start < mask.length; start++) {
    if (mask[start] !== value || seen[start]) continue;
    const run: number[] = [];
    stack.push(start);
    seen[start] = 1;
    while (stack.length > 0) {
      const i = stack.pop() as number;
      run.push(i);
      const col = i % cols;
      const row = (i - col) / cols;
      const next = [
        col > 0 ? i - 1 : -1,
        col < cols - 1 ? i + 1 : -1,
        row > 0 ? i - cols : -1,
        row < rows - 1 ? i + cols : -1,
      ];
      for (const j of next) {
        if (j < 0 || seen[j] || mask[j] !== value) continue;
        seen[j] = 1;
        stack.push(j);
      }
    }
    out.push(run);
  }
  return out;
}

/** Flips every run of `value` smaller than `least` cells to the other value. */
function tidy(mask: Uint8Array, cols: number, rows: number, value: number, least: number): void {
  for (const run of components(mask, cols, rows, value)) {
    if (run.length >= least) continue;
    for (const i of run) mask[i] = value ? 0 : 1;
  }
}

/** Cells from the nearest `source`, over cells `open` to the walk. Eight-connected, so a diagonal is one step. */
function distance(
  cols: number,
  rows: number,
  open: (i: number) => boolean,
  source: (i: number) => boolean,
): Float32Array {
  const n = cols * rows;
  const out = new Float32Array(n).fill(Infinity);
  let frontier: number[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col;
      if (!open(i)) continue;
      let edge = false;
      for (let dy = -1; dy <= 1 && !edge; dy++) {
        const r = row + dy;
        if (r < 0 || r >= rows) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const c = col + dx;
          if (c < 0 || c >= cols) continue;
          if (source(r * cols + c)) {
            edge = true;
            break;
          }
        }
      }
      if (edge) {
        out[i] = 1;
        frontier.push(i);
      }
    }
  }
  let d = 1;
  while (frontier.length > 0) {
    d++;
    const next: number[] = [];
    for (const i of frontier) {
      const col = i % cols;
      const row = (i - col) / cols;
      for (let dy = -1; dy <= 1; dy++) {
        const r = row + dy;
        if (r < 0 || r >= rows) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const c = col + dx;
          if (c < 0 || c >= cols) continue;
          const j = r * cols + c;
          if (!open(j) || out[j] <= d) continue;
          out[j] = d;
          next.push(j);
        }
      }
    }
    frontier = next;
  }
  for (let i = 0; i < n; i++) if (!Number.isFinite(out[i])) out[i] = 0;
  return out;
}

/**
 * Every hollow filled to its spill point, so that from any cell there is a
 * strictly lower neighbour all the way to the sea or a lake: the priority
 * flood, from the water inward, each cell raised to no less than a hair above
 * the one it was reached from.
 */
function flood(cols: number, rows: number, land: Uint8Array, lake: Uint8Array, height: Float32Array): Float32Array {
  const n = cols * rows;
  const out = new Float32Array(n).fill(Infinity);
  const heap = new Heap(n);
  for (let i = 0; i < n; i++) {
    if (land[i] && !lake[i]) continue;
    out[i] = land[i] ? height[i] : -1;
    heap.push(out[i], i);
  }
  const done = new Uint8Array(n);
  while (heap.size > 0) {
    const i = heap.pop();
    if (done[i]) continue;
    done[i] = 1;
    const col = i % cols;
    const row = (i - col) / cols;
    for (let dy = -1; dy <= 1; dy++) {
      const r = row + dy;
      if (r < 0 || r >= rows) continue;
      for (let dx = -1; dx <= 1; dx++) {
        const c = col + dx;
        if (c < 0 || c >= cols) continue;
        const j = r * cols + c;
        if (done[j] || !land[j] || lake[j]) continue;
        const level = Math.max(height[j], out[i] + 1e-4);
        if (level < out[j]) {
          out[j] = level;
          heap.push(level, j);
        }
      }
    }
  }
  return out;
}

/** The lowest neighbour on the filled ground; a lake or the sea ends the walk. */
function downhill(
  i: number,
  cols: number,
  rows: number,
  shore: Float32Array,
  filled: Float32Array,
  lake: Uint8Array,
  avoidLake: boolean,
): number {
  let best = -1;
  for (const j of around(i, cols, rows)) {
    if (lake[j] && avoidLake) continue;
    if (lake[j] || shore[j] <= 0) {
      if (filled[j] < filled[i]) return j;
      continue;
    }
    if (filled[j] >= filled[i]) continue;
    if (best < 0 || filled[j] < filled[best]) best = j;
  }
  return best;
}

/** A step nearer the sea that is not a lake and not already walked, or nothing. */
function toSea(path: number[], cols: number, rows: number, shore: Float32Array, lake: Uint8Array): number {
  const i = path[path.length - 1];
  let best = -1;
  for (const j of around(i, cols, rows)) {
    if (lake[j] || shore[j] >= shore[i] || path.includes(j)) continue;
    if (best < 0 || shore[j] < shore[best]) best = j;
  }
  return best;
}

/** A least-first heap of cells keyed by a number. */
class Heap {
  private keys: Float64Array;
  private cells: Int32Array;
  size = 0;

  constructor(most: number) {
    this.keys = new Float64Array(most);
    this.cells = new Int32Array(most);
  }

  push(key: number, cell: number): void {
    if (this.size === this.keys.length) this.grow();
    let at = this.size++;
    while (at > 0) {
      const parent = (at - 1) >> 1;
      if (this.keys[parent] <= key) break;
      this.keys[at] = this.keys[parent];
      this.cells[at] = this.cells[parent];
      at = parent;
    }
    this.keys[at] = key;
    this.cells[at] = cell;
  }

  private grow(): void {
    const keys = new Float64Array(this.keys.length * 2);
    keys.set(this.keys);
    this.keys = keys;
    const cells = new Int32Array(this.cells.length * 2);
    cells.set(this.cells);
    this.cells = cells;
  }

  pop(): number {
    const top = this.cells[0];
    const key = this.keys[--this.size];
    const cell = this.cells[this.size];
    let at = 0;
    for (;;) {
      let child = at * 2 + 1;
      if (child >= this.size) break;
      if (child + 1 < this.size && this.keys[child + 1] < this.keys[child]) child++;
      if (this.keys[child] >= key) break;
      this.keys[at] = this.keys[child];
      this.cells[at] = this.cells[child];
      at = child;
    }
    this.keys[at] = key;
    this.cells[at] = cell;
    return top;
  }
}

function highestNear(
  x: number,
  y: number,
  r: number,
  span: Span,
  cell: number,
  cols: number,
  rows: number,
  land: Uint8Array,
  shore: Float32Array,
): number {
  let best = -1;
  const c0 = Math.max(0, Math.floor((x - r - span.x) / cell));
  const c1 = Math.min(cols - 1, Math.ceil((x + r - span.x) / cell));
  const r0 = Math.max(0, Math.floor((y - r - span.y) / cell));
  const r1 = Math.min(rows - 1, Math.ceil((y + r - span.y) / cell));
  for (let row = r0; row <= r1; row++) {
    for (let col = c0; col <= c1; col++) {
      const i = row * cols + col;
      if (!land[i]) continue;
      const dx = span.x + (col + 0.5) * cell - x;
      const dy = span.y + (row + 0.5) * cell - y;
      if (dx * dx + dy * dy > r * r) continue;
      if (best < 0 || shore[i] > shore[best]) best = i;
    }
  }
  return best;
}

/** One box blur, in place. */
function blur(field: Float32Array, cols: number, rows: number): void {
  const copy = Float32Array.from(field);
  for (let row = 1; row < rows - 1; row++) {
    for (let col = 1; col < cols - 1; col++) {
      const i = row * cols + col;
      field[i] =
        (copy[i] * 2 + copy[i - 1] + copy[i + 1] + copy[i - cols] + copy[i + cols]) / 6;
    }
  }
}

/**
 * Marching squares: the closed loops where `field` crosses `level`, joined
 * end to end and smoothed once. The raster's outer ring is always sea, so
 * every loop closes.
 */
function contour(
  field: Float32Array,
  cols: number,
  rows: number,
  level: number,
  span: Span,
  cell: number,
): Loop[] {
  // A crossing point lives on a grid edge; keyed by that edge so segments
  // sharing a point can be joined without comparing floats.
  const point = (col: number, row: number, along: 0 | 1): [number, number] => {
    const a = field[row * cols + col] - level;
    const b = (along ? field[(row + 1) * cols + col] : field[row * cols + col + 1]) - level;
    const t = a === b ? 0.5 : a / (a - b);
    return [
      span.x + (col + 0.5 + (along ? 0 : t)) * cell,
      span.y + (row + 0.5 + (along ? t : 0)) * cell,
    ];
  };
  const key = (col: number, row: number, along: 0 | 1): number => (row * cols + col) * 2 + along;
  const links = new Map<number, number[]>();
  const link = (a: number, b: number): void => {
    (links.get(a) ?? links.set(a, []).get(a))!.push(b);
    (links.get(b) ?? links.set(b, []).get(b))!.push(a);
  };
  for (let row = 0; row < rows - 1; row++) {
    for (let col = 0; col < cols - 1; col++) {
      const i = row * cols + col;
      const code =
        (field[i] > level ? 1 : 0) |
        (field[i + 1] > level ? 2 : 0) |
        (field[i + cols + 1] > level ? 4 : 0) |
        (field[i + cols] > level ? 8 : 0);
      if (code === 0 || code === 15) continue;
      const top = key(col, row, 0);
      const right = key(col + 1, row, 1);
      const bottom = key(col, row + 1, 0);
      const left = key(col, row, 1);
      switch (code) {
        case 1: case 14: link(left, top); break;
        case 2: case 13: link(top, right); break;
        case 3: case 12: link(left, right); break;
        case 4: case 11: link(right, bottom); break;
        case 5: link(left, top); link(right, bottom); break;
        case 6: case 9: link(top, bottom); break;
        case 7: case 8: link(left, bottom); break;
        case 10: link(top, right); link(left, bottom); break;
      }
    }
  }
  const where = (k: number): [number, number] => {
    const along = (k & 1) as 0 | 1;
    const i = k >> 1;
    return point(i % cols, Math.floor(i / cols), along);
  };
  const loops: Loop[] = [];
  const used = new Set<number>();
  for (const start of links.keys()) {
    if (used.has(start)) continue;
    const loop: Loop = [];
    let prev = -1;
    let k = start;
    while (k >= 0 && !used.has(k)) {
      used.add(k);
      loop.push(where(k));
      const next = links.get(k) ?? [];
      const step = next.find((j) => j !== prev && !used.has(j));
      prev = k;
      k = step ?? -1;
    }
    if (loop.length >= 6) loops.push(smooth(loop));
  }
  return loops;
}

function smooth(loop: Loop): Loop {
  const n = loop.length;
  const out: Loop = [];
  for (let i = 0; i < n; i++) {
    const a = loop[(i + n - 1) % n];
    const b = loop[i];
    const c = loop[(i + 1) % n];
    out.push([(a[0] + b[0] * 2 + c[0]) / 4, (a[1] + b[1] * 2 + c[1]) / 4]);
  }
  return out;
}
