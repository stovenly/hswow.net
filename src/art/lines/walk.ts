import type * as THREE from 'three';
import type { Part } from '../assemble';
import type { Fields } from '../schema';
import type { SurfaceName } from '../../audio/models/footsteps';
import type { WaterQuery } from '../../world/water';

// Walking a line: the frame, the arc-length table, the hard points, the even
// spacing and the hash every line builder shares and none reimplements.

export type Point = readonly [number, number];

export interface LinePoint {
  at: Point;
  width?: number;
  height?: number;
  /** Forces a hard point here whatever the turn. */
  corner?: boolean;
}

export interface Mark {
  /** Metres along the line from its first point. */
  at: number;
  kind: string;
  width?: number;
  builder?: string;
  seed?: number;
  options?: Record<string, unknown>;
}

export interface Line {
  id: string;
  seed: number;
  closed: boolean;
  smooth: boolean;
  points: readonly LinePoint[];
  marks: readonly Mark[];
  style?: string;
  options?: Record<string, unknown>;
}

export interface LayContext {
  groundAt(x: number, z: number): number;
  waterAt?(x: number, z: number): WaterQuery | null;
  /** A stateless hash of the line's seed, an element index and a channel, 0..1. */
  hash(index: number, channel: number): number;
  /** sRGB hex of the ground the line stands on. */
  ground: number;
}

export interface OrientedBox {
  centre: readonly [number, number, number];
  halfExtents: readonly [number, number, number];
  /** rotateY(yaw) takes the box's +X to the chord's direction. */
  yaw: number;
}

export interface PlacedProp {
  builder: string;
  at: Point;
  /** rotateY(yaw) takes the builder's +Z to the outward normal; the gate and stile are built with their gap along +X. */
  yaw: number;
  seed: number;
  scale?: number;
  options?: Record<string, unknown>;
}

export interface Laid {
  parts: Part[];
  colliders: readonly OrientedBox[];
  /** A capsule chain for the cover mask: x, z, half width. */
  footprint?: readonly (readonly [number, number, number])[];
  footprintSoft?: number;
  underfoot?: SurfaceName;
  props: readonly PlacedProp[];
  /** Legs standing in water, for the water field's stand lane. */
  wades?: readonly (readonly [number, number, number])[];
  /** Whether the merged mesh itself is collidable. Off for a hedge, whose slabs do the work. */
  solid?: boolean;
}

export interface LineBuilder {
  readonly name: string;
  readonly styles?: readonly string[];
  /**
   * The props this builder stands at a mark when the mark does not name one.
   * Complete, so a zone can have its builders in hand before its walk runs.
   */
  readonly props?: readonly string[];
  readonly options?: Fields;
  lay(line: Line, ctx: LayContext): Laid;
}

export interface Station {
  x: number;
  z: number;
  /** Unit tangent, flattened to xz. */
  tx: number;
  tz: number;
  /** N = cross(up, T): the horizontal left normal, (tz, −tx). */
  nx: number;
  nz: number;
  width: number;
  height: number;
  s: number;
}

interface Row {
  x: number;
  z: number;
  s: number;
  /** Curve parameter, in points. */
  u: number;
}

/** Corner threshold, degrees. */
export const CORNER_DEGREES = 25;

export function hashOf(seed: number, index: number, channel: number): number {
  let h = (seed * 374761393 + index * 668265263 + channel * 2246822519) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Low-frequency noise in arc length, −1..1, for the wonk that reads as age: fences fail in stretches. */
export function drift(s: number, seed: number, wavelength = 7): number {
  const p = hashOf(seed, 0, 9) * 6.2831;
  return Math.sin((s / wavelength) * 6.2831 + p) * 0.7 + Math.sin((s / (wavelength * 0.37)) * 6.2831 + p * 1.7) * 0.3;
}

export class Walk {
  readonly length: number;
  readonly closed: boolean;
  private readonly rows: Row[];
  private readonly points: readonly LinePoint[];

  constructor(line: Line) {
    this.closed = line.closed;
    this.points = line.points;
    this.rows = line.smooth ? smoothRows(line) : chordRows(line);
    this.length = this.rows.length > 0 ? this.rows[this.rows.length - 1].s : 0;
  }

  /** Where the line is at `s` metres, with its frame and the interpolated width and height. */
  at(s: number): Station {
    const rows = this.rows;
    const clamped = Math.min(this.length, Math.max(0, s));
    let lo = 0;
    let hi = rows.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (rows[mid].s <= clamped) lo = mid;
      else hi = mid;
    }
    const a = rows[lo];
    const b = rows[Math.min(rows.length - 1, lo + 1)];
    const span = b.s - a.s || 1;
    const f = Math.min(1, Math.max(0, (clamped - a.s) / span));
    const x = a.x + (b.x - a.x) * f;
    const z = a.z + (b.z - a.z) * f;
    // The tangent over a little more than one row, so a chord end does not read a zero.
    const before = rows[Math.max(0, lo - (f < 0.5 ? 1 : 0))];
    const after = rows[Math.min(rows.length - 1, lo + 1 + (f >= 0.5 ? 1 : 0))];
    let tx = after.x - before.x;
    let tz = after.z - before.z;
    const tl = Math.hypot(tx, tz) || 1;
    tx /= tl;
    tz /= tl;
    const u = a.u + (b.u - a.u) * f;
    return { x, z, tx, tz, nx: tz, nz: -tx, width: this.lerpField(u, 'width'), height: this.lerpField(u, 'height'), s: clamped };
  }

  private lerpField(u: number, field: 'width' | 'height'): number {
    const pts = this.points;
    const n = pts.length;
    const i0 = Math.min(n - 1, Math.max(0, Math.floor(u)));
    const i1 = this.closed ? (i0 + 1) % n : Math.min(n - 1, i0 + 1);
    const f = Math.min(1, Math.max(0, u - i0));
    const a = pts[i0][field];
    const b = pts[i1][field];
    if (a === undefined && b === undefined) return NaN;
    if (a === undefined) return b as number;
    if (b === undefined) return a;
    return a + (b - a) * f;
  }

  /** Arc lengths of the authored points. */
  pointArcs(): number[] {
    const out: number[] = [];
    let index = -1;
    for (const row of this.rows) {
      const whole = Math.round(row.u);
      if (Math.abs(row.u - whole) < 1e-6 && whole !== index) {
        index = whole;
        out.push(row.s);
      }
    }
    return out;
  }

  /**
   * The hard points: ends, every `corner` point, every point turning more than
   * the threshold, and both edges of every mark. Sorted and unique.
   */
  hardPoints(marks: readonly Mark[], cornerDegrees = CORNER_DEGREES): number[] {
    const out = new Set<number>();
    if (!this.closed) {
      out.add(0);
      out.add(this.length);
    }
    const arcs = this.pointArcs();
    const n = this.points.length;
    for (let i = 0; i < n; i++) {
      const isEnd = !this.closed && (i === 0 || i === n - 1);
      if (isEnd) continue;
      const p = this.points[i];
      const prev = this.points[(i + n - 1) % n].at;
      const next = this.points[(i + 1) % n].at;
      const a = Math.atan2(p.at[1] - prev[1], p.at[0] - prev[0]);
      const b = Math.atan2(next[1] - p.at[1], next[0] - p.at[0]);
      let turn = Math.abs(b - a);
      if (turn > Math.PI) turn = Math.PI * 2 - turn;
      if (p.corner || (turn * 180) / Math.PI > cornerDegrees) if (arcs[i] !== undefined) out.add(arcs[i]);
    }
    for (const mark of marks) {
      const half = (mark.width ?? 0) / 2;
      out.add(Math.max(0, mark.at - half));
      out.add(Math.min(this.length, mark.at + half));
    }
    return [...out].sort((a, b) => a - b);
  }

  /** The runs between hard points, each with the mark it lies inside, if any. */
  runs(marks: readonly Mark[], cornerDegrees = CORNER_DEGREES): { s0: number; s1: number; mark: Mark | null }[] {
    const hard = this.hardPoints(marks, cornerDegrees);
    const out: { s0: number; s1: number; mark: Mark | null }[] = [];
    const push = (s0: number, s1: number): void => {
      if (s1 - s0 < 1e-3) return;
      const mid = (s0 + s1) / 2;
      const mark = marks.find((m) => Math.abs(mid - m.at) <= (m.width ?? 0) / 2 + 1e-6) ?? null;
      out.push({ s0, s1, mark });
    };
    if (this.closed) {
      if (hard.length === 0) {
        push(0, this.length);
        return out;
      }
      for (let i = 0; i < hard.length; i++) {
        const s0 = hard[i];
        const s1 = i + 1 < hard.length ? hard[i + 1] : this.length + hard[0];
        push(s0, s1);
      }
      return out;
    }
    for (let i = 0; i + 1 < hard.length; i++) push(hard[i], hard[i + 1]);
    return out;
  }

  /** `s` wrapped into the line, for closed lines whose last run crosses the seam. */
  wrap(s: number): number {
    if (!this.closed || this.length <= 0) return s;
    return ((s % this.length) + this.length) % this.length;
  }

  /** Whether a station is a corner of the authored polyline, within a tolerance. */
  isCorner(s: number, marks: readonly Mark[], tolerance = 0.05): boolean {
    return this.hardPoints(marks).some((h) => Math.abs(h - s) < tolerance || Math.abs(h - s - this.length) < tolerance);
  }
}

/** Even spacing with the remainder distributed: `n = max(1, round(L / p))`, an element every `L / n`. */
export function spacing(length: number, pitch: number): { count: number; step: number } {
  const count = Math.max(1, Math.round(length / pitch));
  return { count, step: length / count };
}

function chordRows(line: Line): Row[] {
  const pts = line.points.map((p) => p.at);
  const rows: Row[] = [];
  let s = 0;
  const n = pts.length;
  const segments = line.closed ? n : n - 1;
  for (let i = 0; i < segments; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    // Sub-rows every half metre, so a station's tangent never spans a whole chord's turn.
    const steps = Math.max(1, Math.ceil(len / 0.5));
    for (let k = 0; k < steps; k++) {
      const t = k / steps;
      rows.push({ x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, s: s + len * t, u: i + t });
    }
    s += len;
  }
  const last = line.closed ? pts[0] : pts[n - 1];
  rows.push({ x: last[0], z: last[1], s, u: line.closed ? n : n - 1 });
  return rows;
}

/** Centripetal Catmull–Rom (α = 0.5), sixteen samples a segment, tabulated by cumulative length. */
function smoothRows(line: Line): Row[] {
  const pts = line.points.map((p) => p.at);
  const n = pts.length;
  if (n < 3) return chordRows(line);
  const at = (i: number): Point => (line.closed ? pts[((i % n) + n) % n] : pts[Math.min(n - 1, Math.max(0, i))]);
  const segments = line.closed ? n : n - 1;
  const rows: Row[] = [];
  let s = 0;
  const SUB = 16;
  for (let i = 0; i < segments; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const d = (a: Point, b: Point): number => Math.max(1e-4, Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1])));
    const t0 = 0;
    const t1 = t0 + d(p0, p1);
    const t2 = t1 + d(p1, p2);
    const t3 = t2 + d(p2, p3);
    let prev: Point = p1;
    for (let k = 0; k < SUB; k++) {
      const f = k / SUB;
      const t = t1 + (t2 - t1) * f;
      const q = centripetal(p0, p1, p2, p3, t0, t1, t2, t3, t);
      if (k > 0) s += Math.hypot(q[0] - prev[0], q[1] - prev[1]);
      rows.push({ x: q[0], z: q[1], s, u: i + f });
      prev = q;
    }
    s += Math.hypot(p2[0] - prev[0], p2[1] - prev[1]);
  }
  const last = line.closed ? pts[0] : pts[n - 1];
  rows.push({ x: last[0], z: last[1], s, u: segments });
  return rows;
}

function centripetal(p0: Point, p1: Point, p2: Point, p3: Point, t0: number, t1: number, t2: number, t3: number, t: number): Point {
  const lerp = (a: Point, b: Point, ta: number, tb: number): Point => {
    const w = tb - ta || 1e-6;
    return [(a[0] * (tb - t) + b[0] * (t - ta)) / w, (a[1] * (tb - t) + b[1] * (t - ta)) / w];
  };
  const a1 = lerp(p0, p1, t0, t1);
  const a2 = lerp(p1, p2, t1, t2);
  const a3 = lerp(p2, p3, t2, t3);
  const b1 = lerp(a1, a2, t0, t2);
  const b2 = lerp(a2, a3, t1, t3);
  return lerp(b1, b2, t1, t2);
}

/**
 * One collider box per chord of a run, from the lowest ground to the top,
 * overlapping the next by half the thickness so a corner has no slot.
 */
export function chordBoxes(walk: Walk, s0: number, s1: number, width: number, height: number, groundAt: (x: number, z: number) => number, maxChord = 3): OrientedBox[] {
  const out: OrientedBox[] = [];
  const length = s1 - s0;
  const count = Math.max(1, Math.ceil(length / maxChord));
  for (let i = 0; i < count; i++) {
    const a = walk.at(walk.wrap(s0 + (length * i) / count));
    const b = walk.at(walk.wrap(s0 + (length * (i + 1)) / count));
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len = Math.hypot(dx, dz);
    if (len < 1e-3) continue;
    const cx = (a.x + b.x) / 2;
    const cz = (a.z + b.z) / 2;
    const low = Math.min(groundAt(a.x, a.z), groundAt(b.x, b.z), groundAt(cx, cz));
    const top = Math.max(groundAt(a.x, a.z), groundAt(b.x, b.z)) + height;
    out.push({
      centre: [cx, (low - 1.5 + top) / 2, cz],
      halfExtents: [len / 2 + width / 2, (top - low + 1.5) / 2, width / 2],
      // rotateY(yaw) takes +X to (cos yaw, 0, −sin yaw); the chord runs (dx, dz).
      yaw: Math.atan2(-dz, dx),
    });
  }
  return out;
}

/** A capsule chain following the line at `half` metres either side. */
export function footprintOf(walk: Walk, half: number, step = 2): (readonly [number, number, number])[] {
  const out: (readonly [number, number, number])[] = [];
  const count = Math.max(1, Math.ceil(walk.length / step));
  for (let i = 0; i <= count; i++) {
    const p = walk.at(walk.wrap((walk.length * i) / count));
    out.push([p.x, p.z, half]);
  }
  return out;
}

/** The yaw that turns a prop built with its gap along +X to lie along the tangent: rotateY(yaw) takes +X to (cos yaw, 0, −sin yaw). */
export function yawAlong(station: Station): number {
  return Math.atan2(-station.tz, station.tx);
}

export type { THREE };
