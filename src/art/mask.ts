import * as THREE from 'three';

/**
 * A carved mask: an outline, a front worked as a height field, a hollow back
 * and a rim of the board's own thickness between them.
 *
 * The front is cut into horizontal registers, each its own geometry over shared
 * vertices, so a colour boundary is a mesh edge — `loft`'s `Columns` again.
 */

const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Piecewise-linear value from a table of (fraction, value) knots. */
export function profileAt(knots: readonly [number, number][], t: number): number {
  const c = clamp01(t);
  for (let i = 1; i < knots.length; i++) {
    if (c <= knots[i][0]) {
      const [t0, r0] = knots[i - 1];
      const [t1, r1] = knots[i];
      return r0 + ((r1 - r0) * (c - t0)) / (t1 - t0);
    }
  }
  return knots[knots.length - 1][1];
}

/** A ridge crossing `at`, rising over `up` above and falling over `down` below. */
function ridge(x: number, at: number, up: number, down: number): number {
  const d = x - at;
  const s = d >= 0 ? d / up : d / down;
  return Math.exp(-s * s * 2.2);
}

/** One across the middle `w` of the board, falling to nothing at its edge. */
function span(s: number, w: number): number {
  return clamp01((1 - Math.abs(s)) / Math.max(1e-3, 1 - w));
}

/** How the front of the board is worked. Everything is in units of `depth`. */
export interface Relief {
  /** How far the board bows forward at its middle. */
  vault: number;
  /** A ledge right across the board, and how far up it runs. */
  ledge: number;
  ledgeAt: number;
  /** A border left proud just inside the outline. */
  border: number;
}

/** A plain board: a vault, a border, and nothing cut on it. */
export const BOARD: Relief = { vault: 0.9, ledge: 0, ledgeAt: 0.78, border: 0.22 };

function heightAt(r: Relief, v: number, s: number): number {
  // On `s`, so the board falls to its rim however the outline narrows.
  let z = r.vault * Math.pow(Math.max(0, 1 - s * s), 0.6) * Math.pow(Math.sin(Math.PI * clamp01(v)), 0.5);
  if (r.ledge > 0) z += r.ledge * ridge(v, r.ledgeAt, 0.16, 0.06) * span(s, 0.86);
  if (r.border > 0) {
    const d = Math.min(1 - Math.abs(s), v / 0.14, (1 - v) / 0.14);
    z += r.border * Math.exp(-Math.pow((d - 0.12) / 0.09, 2) * 2.2);
  }
  return z;
}

/** A horizontal register of the front, up to `to`, in its own colour. */
export interface Register {
  to: number;
  color: number;
}

export interface MaskSpec {
  width: number;
  height: number;
  /** How far the vault stands off the board's base plane. */
  depth: number;
  /** The board's thickness at the rim. */
  thick: number;
  /** Half-width as a fraction of `width / 2`, from chin (0) to crown (1). */
  outline: readonly [number, number][];
  relief: Relief;
  registers: readonly Register[];
  rim: number;
  back: number;
  columns?: number;
}

export interface MaskPiece {
  geometry: THREE.BufferGeometry;
  color: number;
}

export interface CarvedMask {
  pieces: MaskPiece[];
  /**
   * A point on the board: `s` across (−1 … 1 of the outline at that height),
   * `v` up from chin to crown, `out` in front of the worked surface.
   */
  at(s: number, v: number, out?: number): THREE.Vector3;
  /** The same point on the hollow back, `out` behind it. */
  behind(s: number, v: number, out?: number): THREE.Vector3;
  /** Half-width at a height, in the board's own space. */
  halfAt(v: number): number;
}

export function carveMask(spec: MaskSpec): CarvedMask {
  // Coarse on purpose: the material is flat-shaded, so a fine grid turns a
  // worked plane into speckle. These facets are the tool marks.
  const C = spec.columns ?? 14;
  const half = spec.width / 2;

  // Rows land on every register boundary, so a colour change is a mesh edge.
  const set = new Set<number>([0, 1]);
  for (const r of spec.registers) set.add(r.to);
  for (let v = 0.07; v < 1; v += 0.07) set.add(Math.round(v * 1000) / 1000);
  const vs = [...set].sort((a, b) => a - b);
  const R = vs.length;

  const surface = (s: number, v: number): THREE.Vector3 =>
    new THREE.Vector3(
      s * profileAt(spec.outline, v) * half,
      (v - 0.5) * spec.height,
      heightAt(spec.relief, v, s) * spec.depth,
    );
  const point = (r: number, c: number, front: boolean): THREE.Vector3 => {
    const p = surface(-1 + (2 * c) / C, vs[r]);
    // The back follows the front but shallower: hollow behind, `thick` at the rim.
    if (!front) p.z = p.z * 0.5 - spec.thick;
    return p;
  };

  const grid = (r0: number, r1: number, front: boolean, color: number): MaskPiece => {
    const positions: number[] = [];
    const indices: number[] = [];
    for (let r = r0; r <= r1; r++) {
      for (let c = 0; c <= C; c++) {
        const p = point(r, c, front);
        positions.push(p.x, p.y, p.z);
      }
    }
    const W = C + 1;
    for (let r = 0; r < r1 - r0; r++) {
      for (let c = 0; c < C; c++) {
        const a = r * W + c;
        const b = a + 1;
        const d = a + W;
        const e = d + 1;
        // (a, b, e) is counter-clockwise seen from +Z: the front faces out.
        if (front) indices.push(a, b, e, a, e, d);
        else indices.push(a, e, b, a, d, e);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return { geometry, color };
  };

  const pieces: MaskPiece[] = [];
  let r0 = 0;
  for (const register of spec.registers) {
    let r1 = r0;
    while (r1 < R - 1 && vs[r1] < register.to - 1e-6) r1++;
    if (r1 > r0) pieces.push(grid(r0, r1, true, register.color));
    r0 = r1;
  }
  if (r0 < R - 1) pieces.push(grid(r0, R - 1, true, spec.registers[spec.registers.length - 1].color));
  pieces.push(grid(0, R - 1, false, spec.back));

  // The rim, walked counter-clockwise seen from the front. For an edge p→q the
  // outward direction is (q − p) × +Z, so (front p, back p, back q) faces out.
  const loop: [number, number][] = [];
  for (let c = 0; c <= C; c++) loop.push([0, c]);
  for (let r = 1; r <= R - 1; r++) loop.push([r, C]);
  for (let c = C - 1; c >= 0; c--) loop.push([R - 1, c]);
  for (let r = R - 2; r >= 1; r--) loop.push([r, 0]);
  {
    const positions: number[] = [];
    const indices: number[] = [];
    for (const [r, c] of loop) {
      const f = point(r, c, true);
      const b = point(r, c, false);
      positions.push(f.x, f.y, f.z, b.x, b.y, b.z);
    }
    for (let i = 0; i < loop.length; i++) {
      const p = i * 2;
      const q = ((i + 1) % loop.length) * 2;
      indices.push(p, p + 1, q + 1, p, q + 1, q);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    pieces.push({ geometry, color: spec.rim });
  }

  return {
    pieces,
    at: (s, v, out = 0) => {
      const p = surface(s, v);
      p.z += out;
      return p;
    },
    behind: (s, v, out = 0) => {
      const p = surface(s, v);
      p.z = p.z * 0.5 - spec.thick - out;
      return p;
    },
    halfAt: (v) => profileAt(spec.outline, v) * half,
  };
}

/** The outlines worth cutting. Half-width from chin to crown. */
export const OUTLINES = {
  /** A plain oval, widest a little above the middle. */
  oval: [[0, 0.3], [0.12, 0.62], [0.3, 0.86], [0.52, 0.98], [0.74, 1], [0.9, 0.84], [1, 0.46]],
  /** A shield: broad across the brow, drawn to a rounded chin. */
  shield: [[0, 0.2], [0.1, 0.5], [0.28, 0.74], [0.52, 0.9], [0.78, 1], [0.93, 0.97], [1, 0.82]],
  /** A plank: straight sides, squared off top and bottom. */
  plank: [[0, 0.64], [0.06, 0.88], [0.2, 0.95], [0.5, 0.97], [0.8, 0.98], [0.94, 0.92], [1, 0.68]],
  /** A disc: a round of trunk, cut across. */
  disc: [[0, 0.2], [0.1, 0.58], [0.26, 0.82], [0.5, 1], [0.74, 0.82], [0.9, 0.58], [1, 0.2]],
  /** A gable: wide low, drawn to a point at the crown. */
  gable: [[0, 0.36], [0.12, 0.68], [0.34, 0.9], [0.6, 1], [0.82, 0.84], [0.94, 0.52], [1, 0.18]],
  /** Long and narrow, barely tapered. */
  long: [[0, 0.26], [0.1, 0.56], [0.3, 0.8], [0.55, 0.92], [0.78, 0.95], [0.92, 0.8], [1, 0.42]],
} as const satisfies Record<string, readonly [number, number][]>;
