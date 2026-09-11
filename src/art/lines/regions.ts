import { hashOf, type Line, type LinePoint, type Point } from './walk';
import { insideRing, offsetRing, ringArea } from '../water/geometry';

// Regions: a closed polygon and what fills it. Rows plants by arc length along
// lines clipped to the polygon; a border runs a line builder round the polygon
// offset inward.

export interface RowsOptions {
  /** Degrees, the way the rows run; the polygon's longest edge when absent. */
  bearing?: number;
  rowPitch: number;
  pitch: number;
  headland: number;
  plant: string;
  jitter?: number;
  scale?: readonly [number, number];
}

export interface RowPlacement {
  x: number;
  z: number;
  yaw: number;
  seed: number;
  scale: number;
}

function longestEdgeBearing(points: readonly Point[]): number {
  let best = 0;
  let bestLen = -1;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len > bestLen) {
      bestLen = len;
      best = Math.atan2(b[1] - a[1], b[0] - a[0]);
    }
  }
  return best;
}

/** Plants along parallel rows across the polygon, headland kept clear. */
export function rows(points: readonly Point[], seed: number, options: RowsOptions): RowPlacement[] {
  const inner = offsetRing(points, -Math.max(0, options.headland));
  const bearing = options.bearing !== undefined ? (options.bearing * Math.PI) / 180 : longestEdgeBearing(points);
  const dx = Math.cos(bearing);
  const dz = Math.sin(bearing);
  // Across the rows: the left normal of the row direction.
  const nx = -dz;
  const nz = dx;
  let minA = Infinity;
  let maxA = -Infinity;
  let minB = Infinity;
  let maxB = -Infinity;
  for (const [x, z] of inner) {
    const a = x * dx + z * dz;
    const b = x * nx + z * nz;
    minA = Math.min(minA, a);
    maxA = Math.max(maxA, a);
    minB = Math.min(minB, b);
    maxB = Math.max(maxB, b);
  }
  const out: RowPlacement[] = [];
  const rowCount = Math.max(1, Math.floor((maxB - minB) / options.rowPitch));
  const rowStart = minB + ((maxB - minB) - (rowCount - 1) * options.rowPitch) / 2;
  const jitter = options.jitter ?? 0.12;
  let index = 0;
  for (let r = 0; r < rowCount; r++) {
    const b = rowStart + r * options.rowPitch;
    const steps = Math.max(1, Math.floor((maxA - minA) / options.pitch));
    const start = minA + ((maxA - minA) - (steps - 1) * options.pitch) / 2;
    for (let k = 0; k < steps; k++) {
      const a = start + k * options.pitch;
      const jx = (hashOf(seed, index, 1) - 0.5) * jitter * options.pitch;
      const jz = (hashOf(seed, index, 2) - 0.5) * jitter * options.rowPitch;
      const x = a * dx + b * nx + jx;
      const z = a * dz + b * nz + jz;
      index++;
      if (!insideRing(inner, x, z)) continue;
      const scale = options.scale ? options.scale[0] + (options.scale[1] - options.scale[0]) * hashOf(seed, index, 3) : 1;
      out.push({ x, z, yaw: hashOf(seed, index, 4) * Math.PI * 2, seed: Math.floor(hashOf(seed, index, 5) * 1e6) + 1, scale });
    }
  }
  return out;
}

/** The polygon offset inward by `width / 2`, as a closed line for a builder to run along. */
export function borderLine(id: string, seed: number, points: readonly Point[], width: number, style?: string, options?: Record<string, unknown>): Line {
  const wound = ringArea(points) >= 0 ? points : [...points].reverse();
  const inset = offsetRing(wound, -width / 2);
  const linePoints: LinePoint[] = inset.map((at) => ({ at }));
  return { id, seed, closed: true, smooth: false, points: linePoints, marks: [], style, options };
}
