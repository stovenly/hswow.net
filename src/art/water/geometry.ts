import * as THREE from 'three';

// Water surfaces from shapes: an outline gridded and snapped to its ring, a
// course swept into a ribbon, a fall lofted into a sheet, a sea's apron rings.
// Positions are world xz at the body's level; the mesh sits at the origin.

export type Point = readonly [number, number];

/** Every surface carries the same four attributes, spelled the same in the shader. */
export interface Surface {
  positions: number[];
  /** 0 in open water, 1 at the buried edge. */
  edge: number[];
  /** Across (−1..1) and along (metres of arc, or 0..1 down a fall). */
  uv: number[];
  /** 1 on a sea's apron rings, which are too coarse to carry chop. */
  apron: number[];
  index: number[];
}

export function emptySurface(): Surface {
  return { positions: [], edge: [], uv: [], apron: [], index: [] };
}

export function appendSurface(into: Surface, from: Surface): void {
  const base = into.positions.length / 3;
  for (const v of from.positions) into.positions.push(v);
  for (const v of from.edge) into.edge.push(v);
  for (const v of from.uv) into.uv.push(v);
  for (const v of from.apron) into.apron.push(v);
  for (const i of from.index) into.index.push(i + base);
}

export function surfaceGeometry(surface: Surface): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(surface.positions, 3));
  geometry.setAttribute('aEdge', new THREE.Float32BufferAttribute(surface.edge, 1));
  geometry.setAttribute('aUV', new THREE.Float32BufferAttribute(surface.uv, 2));
  geometry.setAttribute('aApron', new THREE.Float32BufferAttribute(surface.apron, 1));
  geometry.setIndex(surface.index);
  return geometry;
}

// --- rings -------------------------------------------------------------------

/** Twice the signed area in xz. Positive means the outward normal of a→b is (dz, −dx). */
export function ringArea(ring: readonly Point[]): number {
  let sum = 0;
  for (let i = 0; i < ring.length; i++) {
    const [ax, az] = ring[i];
    const [bx, bz] = ring[(i + 1) % ring.length];
    sum += ax * bz - bx * az;
  }
  return sum;
}

export function insideRing(ring: readonly Point[], x: number, z: number): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, zi] = ring[i];
    const [xj, zj] = ring[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

/** Distance to the ring's edge, unsigned. */
export function distanceToRing(ring: readonly Point[], x: number, z: number): number {
  let best = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const [ax, az] = ring[i];
    const [bx, bz] = ring[(i + 1) % ring.length];
    const dx = bx - ax;
    const dz = bz - az;
    const len2 = dx * dx + dz * dz;
    const t = len2 > 0 ? Math.min(1, Math.max(0, ((x - ax) * dx + (z - az) * dz) / len2)) : 0;
    const d = Math.hypot(x - (ax + dx * t), z - (az + dz * t));
    if (d < best) best = d;
  }
  return best;
}

/** The point on the ring nearest to (x, z). */
export function nearestOnRing(ring: readonly Point[], x: number, z: number): Point {
  let best = Infinity;
  let px = x;
  let pz = z;
  for (let i = 0; i < ring.length; i++) {
    const [ax, az] = ring[i];
    const [bx, bz] = ring[(i + 1) % ring.length];
    const dx = bx - ax;
    const dz = bz - az;
    const len2 = dx * dx + dz * dz;
    const t = len2 > 0 ? Math.min(1, Math.max(0, ((x - ax) * dx + (z - az) * dz) / len2)) : 0;
    const qx = ax + dx * t;
    const qz = az + dz * t;
    const d = Math.hypot(x - qx, z - qz);
    if (d < best) {
      best = d;
      px = qx;
      pz = qz;
    }
  }
  return [px, pz];
}

/** Positive inside the ring, negative outside. */
export function signedDistance(ring: readonly Point[], x: number, z: number): number {
  const d = distanceToRing(ring, x, z);
  return insideRing(ring, x, z) ? d : -d;
}

/** Outward unit normals at each vertex: the mitre of the two edge normals. */
export function ringNormals(ring: readonly Point[]): Point[] {
  const sign = ringArea(ring) >= 0 ? 1 : -1;
  const n = ring.length;
  const out: Point[] = [];
  for (let i = 0; i < n; i++) {
    const [px, pz] = ring[(i + n - 1) % n];
    const [cx, cz] = ring[i];
    const [nx, nz] = ring[(i + 1) % n];
    // Edge normal (dz, −dx) points outward when the ring is positively wound.
    const e1x = cx - px;
    const e1z = cz - pz;
    const e2x = nx - cx;
    const e2z = nz - cz;
    const l1 = Math.hypot(e1x, e1z) || 1;
    const l2 = Math.hypot(e2x, e2z) || 1;
    let mx = sign * (e1z / l1 + e2z / l2);
    let mz = sign * (-e1x / l1 - e2x / l2);
    const ml = Math.hypot(mx, mz) || 1;
    mx /= ml;
    mz /= ml;
    out.push([mx, mz]);
  }
  return out;
}

export function offsetRing(ring: readonly Point[], distance: number): Point[] {
  const normals = ringNormals(ring);
  return ring.map(([x, z], i) => [x + normals[i][0] * distance, z + normals[i][1] * distance]);
}

export function ringBounds(ring: readonly Point[]): { minX: number; minZ: number; maxX: number; maxZ: number } {
  let minX = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxZ = -Infinity;
  for (const [x, z] of ring) {
    if (x < minX) minX = x;
    if (z < minZ) minZ = z;
    if (x > maxX) maxX = x;
    if (z > maxZ) maxZ = z;
  }
  return { minX, minZ, maxX, maxZ };
}

/** The ring walked at roughly `step` metres between points. */
export function resampleRing(ring: readonly Point[], step: number): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < ring.length; i++) {
    const [ax, az] = ring[i];
    const [bx, bz] = ring[(i + 1) % ring.length];
    const len = Math.hypot(bx - ax, bz - az);
    const n = Math.max(1, Math.round(len / step));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      out.push([ax + (bx - ax) * t, az + (bz - az) * t]);
    }
  }
  return out;
}

// --- an outline --------------------------------------------------------------

/**
 * A still body's surface: a grid at `segment` over the ring offset outward by
 * `bury`, with the grid vertices just outside the offset ring snapped onto it so
 * the surface ends on the ring and not on a staircase.
 */
export function outlineSurface(ring: readonly Point[], level: number, segment: number, bury: number): Surface {
  const outer = offsetRing(ring, bury);
  const b = ringBounds(outer);
  const cols = Math.max(2, Math.ceil((b.maxX - b.minX) / segment) + 1);
  const rows = Math.max(2, Math.ceil((b.maxZ - b.minZ) / segment) + 1);
  const sx = (b.maxX - b.minX) / (cols - 1);
  const sz = (b.maxZ - b.minZ) / (rows - 1);
  const surface = emptySurface();
  const slot = new Int32Array(cols * rows).fill(-1);
  const inside = new Uint8Array(cols * rows);
  const snapWithin = Math.max(sx, sz) * 1.5;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let x = b.minX + i * sx;
      let z = b.minZ + j * sz;
      const d = signedDistance(outer, x, z);
      if (d < -snapWithin) continue;
      if (d < 0) [x, z] = nearestOnRing(outer, x, z);
      else inside[j * cols + i] = 1;
      const dRing = signedDistance(ring, x, z);
      slot[j * cols + i] = surface.positions.length / 3;
      surface.positions.push(x, level, z);
      surface.edge.push(Math.min(1, Math.max(0, 1 - dRing / bury)));
      surface.uv.push(0, 0);
      surface.apron.push(0);
    }
  }
  for (let j = 0; j + 1 < rows; j++) {
    for (let i = 0; i + 1 < cols; i++) {
      const a = j * cols + i;
      const bq = a + 1;
      const c = a + cols + 1;
      const d = a + cols;
      if (slot[a] < 0 || slot[bq] < 0 || slot[c] < 0 || slot[d] < 0) continue;
      if (!(inside[a] || inside[bq] || inside[c] || inside[d])) continue;
      // Wound so the face normal is +Y: (a, c, b) then (a, d, c) with z increasing along j.
      surface.index.push(slot[a], slot[c], slot[bq], slot[a], slot[d], slot[c]);
    }
  }
  return surface;
}

// --- a course ----------------------------------------------------------------

export interface CoursePoint {
  at: Point;
  width: number;
  level?: number;
  speed?: number;
}

export interface CourseSample {
  x: number;
  z: number;
  /** Unit tangent, the way the water goes. */
  tx: number;
  tz: number;
  width: number;
  level: number;
  speed: number;
  /** Arc length from the source, metres. */
  s: number;
}

/**
 * A Catmull–Rom curve through the course points, resampled by arc length at
 * `segment`. Width, level and speed interpolate by curve parameter; a missing
 * level holds the previous point's, so a flat river states one on its first point.
 */
export function sampleCourse(course: readonly CoursePoint[], segment: number): CourseSample[] {
  if (course.length < 2) return [];
  const pts = course.map((p) => p.at);
  const levels: number[] = [];
  const speeds: number[] = [];
  let level = course[0].level ?? 0;
  let speed = course[0].speed ?? 0.8;
  for (const p of course) {
    if (p.level !== undefined) level = p.level;
    if (p.speed !== undefined) speed = p.speed;
    levels.push(level);
    speeds.push(speed);
  }
  const n = pts.length;
  const at = (i: number): Point => pts[Math.min(n - 1, Math.max(0, i))];
  const dense: { x: number; z: number; u: number }[] = [];
  const SUB = 12;
  for (let i = 0; i + 1 < n; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    for (let k = 0; k < SUB; k++) {
      const t = k / SUB;
      const t2 = t * t;
      const t3 = t2 * t;
      const x =
        0.5 *
        (2 * p1[0] +
          (-p0[0] + p2[0]) * t +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const z =
        0.5 *
        (2 * p1[1] +
          (-p0[1] + p2[1]) * t +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      dense.push({ x, z, u: i + t });
    }
  }
  dense.push({ x: pts[n - 1][0], z: pts[n - 1][1], u: n - 1 });

  const arc: number[] = [0];
  for (let i = 1; i < dense.length; i++) {
    arc.push(arc[i - 1] + Math.hypot(dense[i].x - dense[i - 1].x, dense[i].z - dense[i - 1].z));
  }
  const total = arc[arc.length - 1];
  const count = Math.max(2, Math.round(total / segment) + 1);
  const samples: CourseSample[] = [];
  let cursor = 0;
  for (let k = 0; k < count; k++) {
    const s = (k / (count - 1)) * total;
    while (cursor + 1 < arc.length - 1 && arc[cursor + 1] < s) cursor++;
    const a = dense[cursor];
    const b = dense[cursor + 1];
    const span = arc[cursor + 1] - arc[cursor] || 1;
    const f = Math.min(1, Math.max(0, (s - arc[cursor]) / span));
    const x = a.x + (b.x - a.x) * f;
    const z = a.z + (b.z - a.z) * f;
    let tx = b.x - a.x;
    let tz = b.z - a.z;
    const tl = Math.hypot(tx, tz) || 1;
    tx /= tl;
    tz /= tl;
    const u = a.u + (b.u - a.u) * f;
    const i0 = Math.min(n - 2, Math.max(0, Math.floor(u)));
    const fu = Math.min(1, Math.max(0, u - i0));
    const lerp = (arr: readonly number[]): number => arr[i0] + (arr[i0 + 1] - arr[i0]) * fu;
    samples.push({
      x,
      z,
      tx,
      tz,
      width: lerp(course.map((p) => p.width)),
      level: lerp(levels),
      speed: lerp(speeds),
      s,
    });
  }
  return samples;
}

/** Nine stations across each sample: the outer two buried, the seven inner carrying the profile. */
const STATIONS = 9;

export function ribbonSurface(samples: readonly CourseSample[], bury: number): Surface {
  const surface = emptySurface();
  for (const p of samples) {
    const half = p.width / 2 + bury;
    // Left of travel is (−tz, tx): rotating the tangent a quarter turn anticlockwise seen from above.
    const nx = -p.tz;
    const nz = p.tx;
    for (let k = 0; k < STATIONS; k++) {
      const across = (k / (STATIONS - 1)) * 2 - 1;
      const off = across * half;
      surface.positions.push(p.x + nx * off, p.level, p.z + nz * off);
      surface.edge.push(Math.min(1, Math.max(0, (Math.abs(off) - p.width / 2) / bury)));
      surface.uv.push(across, p.s);
      surface.apron.push(0);
    }
  }
  for (let r = 0; r + 1 < samples.length; r++) {
    for (let k = 0; k + 1 < STATIONS; k++) {
      const a = r * STATIONS + k;
      const b = a + 1;
      const c = a + STATIONS + 1;
      const d = a + STATIONS;
      // Along +tangent with the left station first: (a, b, c) and (a, c, d) face +Y
      // when the left of travel is at k = 0.
      surface.index.push(a, b, c, a, c, d);
    }
  }
  return surface;
}

/** The outline a ribbon covers, for anything that asks whether a point is on the river. */
export function ribbonInside(samples: readonly CourseSample[], x: number, z: number): boolean {
  for (let i = 0; i + 1 < samples.length; i++) {
    const a = samples[i];
    const b = samples[i + 1];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len2 = dx * dx + dz * dz;
    const t = len2 > 0 ? Math.min(1, Math.max(0, ((x - a.x) * dx + (z - a.z) * dz) / len2)) : 0;
    const d = Math.hypot(x - (a.x + dx * t), z - (a.z + dz * t));
    const w = a.width + (b.width - a.width) * t;
    if (d <= w / 2) return true;
  }
  return false;
}

/** The nearest sample to a point, by index. */
export function nearestSample(samples: readonly CourseSample[], x: number, z: number): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < samples.length; i++) {
    const d = (samples[i].x - x) ** 2 + (samples[i].z - z) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

// --- a fall ------------------------------------------------------------------

/**
 * A sheet from the lip out and down to the pool: `width / 0.5` columns by
 * twelve rows on a quadratic, U across, V down. `throw` is how far the sheet
 * stands out from the lip at the pool.
 */
export function sheetSurface(
  from: Point,
  lip: number,
  to: Point,
  pool: number,
  width: number,
  throwOut: number,
): Surface {
  const surface = emptySurface();
  let dx = to[0] - from[0];
  let dz = to[1] - from[1];
  const dl = Math.hypot(dx, dz) || 1;
  dx /= dl;
  dz /= dl;
  // Across the sheet is the fall direction turned a quarter turn.
  const ax = -dz;
  const az = dx;
  const drop = Math.max(lip - pool, 0.05);
  const cols = Math.max(2, Math.round(width / 0.5)) + 1;
  const rows = 13;
  for (let j = 0; j < rows; j++) {
    const v = j / (rows - 1);
    const out = throwOut * v;
    const y = lip - drop * v * v;
    for (let i = 0; i < cols; i++) {
      const u = (i / (cols - 1)) * 2 - 1;
      const off = (u * width) / 2;
      surface.positions.push(from[0] + dx * out + ax * off, y, from[1] + dz * out + az * off);
      surface.edge.push(0);
      surface.uv.push(u, v);
      surface.apron.push(0);
    }
  }
  for (let j = 0; j + 1 < rows; j++) {
    for (let i = 0; i + 1 < cols; i++) {
      const a = j * cols + i;
      const b = a + 1;
      const c = a + cols + 1;
      const d = a + cols;
      // (a, b, c) and (a, c, d) face the way the water falls, toward the pool.
      surface.index.push(a, b, c, a, c, d);
    }
  }
  return surface;
}

// --- a sea's apron -----------------------------------------------------------

/** Every `APRON_STEP` metres to `APRON_DENSE`, then geometrically to the reach. */
const APRON_STEP = 4;
const APRON_DENSE = 100;
const APRON_FAR_RINGS = 6;

/**
 * Rings from the surface's ring outward to `reach`, pinned on the land side so
 * the water does not run under the dunes. The first ring sits a segment inside
 * the surface so the two overlap by one cell and share a level and a field.
 */
export function apronSurface(
  ring: readonly Point[],
  level: number,
  segment: number,
  reach: number,
  groundAt: (x: number, z: number) => number,
): Surface {
  const surface = emptySurface();
  if (reach <= 0) return surface;
  const rim = resampleRing(ring, APRON_STEP);
  const normals = ringNormals(rim);
  const count = rim.length;
  const pinned = new Uint8Array(count);
  for (let p = 0; p < count; p++) {
    const [x, z] = rim[p];
    const [nx, nz] = normals[p];
    const far = Math.min(reach, 40);
    pinned[p] = groundAt(x, z) >= level || groundAt(x + nx * far, z + nz * far) >= level ? 1 : 0;
  }
  const distances: number[] = [-segment];
  const dense = Math.min(reach, APRON_DENSE);
  for (let d = APRON_STEP; d <= dense; d += APRON_STEP) distances.push(d);
  if (reach > dense) {
    for (let r = 1; r <= APRON_FAR_RINGS; r++) distances.push(dense * Math.pow(reach / dense, r / APRON_FAR_RINGS));
  }
  for (let r = 0; r < distances.length; r++) {
    for (let p = 0; p < count; p++) {
      const [x, z] = rim[p];
      const [nx, nz] = normals[p];
      const out = pinned[p] ? Math.min(distances[r], 0) : distances[r];
      surface.positions.push(x + nx * out, level, z + nz * out);
      surface.edge.push(0);
      surface.uv.push(0, 0);
      surface.apron.push(r === 0 ? 0 : 1);
    }
  }
  const outwardFacesUp = ringArea(rim) >= 0;
  for (let r = 0; r + 1 < distances.length; r++) {
    for (let p = 0; p < count; p++) {
      const q = (p + 1) % count;
      const ip = r * count + p;
      const iq = r * count + q;
      const op = (r + 1) * count + p;
      const oq = (r + 1) * count + q;
      // Winding follows the ring's: a positively wound ring walks anticlockwise
      // seen from above, so inner→next→outer faces +Y.
      if (outwardFacesUp) surface.index.push(ip, iq, oq, ip, oq, op);
      else surface.index.push(ip, oq, iq, ip, op, oq);
    }
  }
  return surface;
}
