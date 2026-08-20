import * as THREE from 'three';
import type { Part } from '../assemble';
import type { BoneSpec } from '../rig';
import { loft, type Station } from '../loft';
import { sheet, type Vec3 } from '../sheet';
import { shade } from '../palette';
import type { BuiltHead, HeadOptions } from './figure-head';

/**
 * The cityfolk's heads: a ceremonial helm or a full cloth covering, in the
 * house's colours, at the villager's scale — as wide as the hood and drawn in at
 * the rim the same way, so it covers the neck and clears the shoulders.
 *
 * A helm is a liner (a closed shell with a flat face plate set back into it) and
 * a few plates lapped over it, each its own solid, with the house's device
 * standing on the face plate. Everything on a curved surface is built along it,
 * so nothing floats and nothing pokes through. Eleven designs.
 *
 * The cowl rides `neck`; everything above rides `face`, so talk moves the head.
 */

export type CityHeadKind =
  // Helms.
  | 'greathelm'
  | 'bascinet'
  | 'frogmouth'
  | 'burgonet'
  | 'tourney'
  | 'morion'
  | 'bellows'
  | 'spangen'
  | 'escutcheon'
  // Cloth.
  | 'chaperon'
  | 'coif';

export const CITY_HEAD_KINDS: readonly CityHeadKind[] = ['greathelm', 'bascinet', 'frogmouth', 'burgonet', 'tourney', 'morion', 'bellows', 'spangen', 'escutcheon', 'chaperon', 'coif'];

export function isCityHead(kind: string): kind is CityHeadKind {
  return (CITY_HEAD_KINDS as readonly string[]).includes(kind);
}

/** The house a cityfolk dresses in: one hue taken down and up, and its one contrast. */
export interface HouseColours {
  dark: number;
  mid: number;
  pale: number;
  contrast: number;
  metal: number;
  fur: number;
}

// --- surfaces ------------------------------------------------------------------

/** A ring of a shell, in head sizes: `y` up from the head's base, `z` its centre forward. */
interface Ring {
  y: number;
  rx: number;
  rz?: number;
  z?: number;
  n?: number;
}

type Full = Required<Pick<Ring, 'rx' | 'rz' | 'z'>> & Pick<Ring, 'n'>;

const full = (r: Ring): Full => ({ rx: r.rx, rz: r.rz ?? r.rx * 0.9, z: r.z ?? 0, n: r.n });

/** The ring a shell has at a height, interpolated. */
function ringAt(rings: readonly Ring[], y: number): Full {
  if (y <= rings[0].y) return full(rings[0]);
  for (let i = 1; i < rings.length; i++) {
    if (y <= rings[i].y) {
      const a = full(rings[i - 1]);
      const b = full(rings[i]);
      const k = (y - rings[i - 1].y) / (rings[i].y - rings[i - 1].y);
      return { rx: a.rx + (b.rx - a.rx) * k, rz: a.rz + (b.rz - a.rz) * k, z: a.z + (b.z - a.z) * k, n: k < 0.5 ? a.n : b.n };
    }
  }
  return full(rings[rings.length - 1]);
}

/** Where a ring's outline is at a bearing (0 the front, π the nape): a superellipse, as `loft` draws it. */
function outline(r: Full, bearing: number): { x: number; z: number; nx: number; nz: number } {
  const k = 2 / (r.n ?? 2);
  const s = Math.sin(bearing);
  const c = Math.cos(bearing);
  const x = Math.sign(s) * Math.abs(s) ** k * r.rx;
  const z = r.z + Math.sign(c) * Math.abs(c) ** k * r.rz;
  // The outline's normal: the gradient of |x/rx|ⁿ + |z/rz|ⁿ.
  const nx = (Math.sign(s) * Math.abs(s) ** (2 - k)) / r.rx;
  const nz = (Math.sign(c) * Math.abs(c) ** (2 - k)) / r.rz;
  return { x, z, nx, nz };
}

/** A point on a shell at (bearing, y), in sizes, and the outward normal there. */
function surface(rings: readonly Ring[], y: number, bearing: number): { p: THREE.Vector3; n: THREE.Vector3 } {
  const r = ringAt(rings, y);
  const o = outline(r, bearing);
  const p = new THREE.Vector3(o.x, y, o.z);
  const below = ringAt(rings, y - 0.04);
  const above = ringAt(rings, y + 0.04);
  const slope = ((above.rx + above.rz) / 2 - (below.rx + below.rz) / 2) / 0.08;
  const n = new THREE.Vector3(o.nx, -slope / ((r.rx + r.rz) / 2), o.nz).normalize();
  return { p, n };
}

/** The rings of a shell offset outward by `out`, from `fromY` up. */
function offsetRings(rings: readonly Ring[], out: number, fromY = -Infinity): Ring[] {
  const result: Ring[] = [];
  if (fromY > rings[0].y) {
    const r = ringAt(rings, fromY);
    result.push({ y: fromY, rx: r.rx + out, rz: r.rz + out, z: r.z, n: r.n });
  }
  for (const r of rings) {
    if (r.y <= fromY) continue;
    const f = full(r);
    result.push({ y: r.y, rx: f.rx + out, rz: f.rz + out, z: f.z, n: f.n });
  }
  return result;
}

// --- primitives ------------------------------------------------------------------

/** A tapered stick from `a` to `b`. */
function stick(a: THREE.Vector3, b: THREE.Vector3, r0: number, r1: number, sides = 6): THREE.BufferGeometry {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const g = new THREE.CylinderGeometry(r1, r0, len, sides);
  g.translate(0, len / 2, 0);
  // CylinderGeometry's axis is +Y; this turns +Y onto the segment.
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()));
  g.translate(a.x, a.y, a.z);
  return g;
}

/** A closed convex lens: `w` across X, `h` up Y, `d` through Z. */
function lens(w: number, h: number, d: number): THREE.BufferGeometry {
  const g = new THREE.IcosahedronGeometry(1, 1);
  g.scale(w / 2, h / 2, d / 2);
  return g;
}

/** A disc facing +Z. */
function disc(r: number, thick: number, sides = 16): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(r, r, thick, sides);
  // CylinderGeometry's axis is +Y; rotateX(π/2) takes +Y to +Z, so the disc faces the front.
  g.rotateX(Math.PI / 2);
  return g;
}

/** A sector between two radii, `a0` to `a1` round from +X. */
function sector(r0: number, r1: number, a0: number, a1: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(Math.cos(a0) * r0, Math.sin(a0) * r0);
  shape.absarc(0, 0, r1, a0, a1, false);
  shape.absarc(0, 0, r0, a1, a0, true);
  shape.closePath();
  return shape;
}

/** A flat solid from an outline, `depth` thick, facing +Z from z = 0. */
function flat(shape: THREE.Shape, depth: number): THREE.BufferGeometry {
  return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 12 });
}

/** A flat cloth strip lofted through points, in the figure's space; `widths` are half-widths. */
function strip(points: readonly THREE.Vector3[], widths: readonly number[], thick: number): THREE.BufferGeometry {
  const stations: Station[] = points.map((p, i): Station => {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    const axis = new THREE.Vector3().subVectors(next, prev).normalize();
    return { at: [p.x, p.y, p.z], rx: widths[i], ry: thick, axis: [axis.x, axis.y, axis.z] };
  });
  return loft(stations, 8, { start: true, end: true });
}

// --- the frame: a shell and everything built on it ---------------------------------

/** A point on the frame's surface, by bearing and height. */
interface Spot {
  b: number;
  y: number;
}

interface Kit {
  s: number;
  base: number;
  c: HouseColours;
  /** The plates' colour: the house's mid, enamelled. */
  shell: number;
  /** The liner under the plates, and the face plate: the house's dark. */
  liner: number;
  side: 1 | -1;
  push(g: THREE.BufferGeometry, color: number, bone?: string): void;
}

/** The face plate set into the liner: flat, so the device on it is flat too. */
interface Plate {
  /** Its centre, in sizes from the head's base. */
  cy: number;
  /** Half its width and height. */
  hw: number;
  hh: number;
  /** A piece built facing +Z, laid on the plate at (x, y) from its centre, `out` proud. */
  on(g: THREE.BufferGeometry, x: number, y: number, out: number, color: number): void;
}

/** The window the plates leave: brow to chin, between the cheeks. */
interface Window {
  phi: number;
  y0: number;
  y1: number;
}

type Edge = number | ((b: number) => number);
const edgeAt = (f: Edge, b: number): number => (typeof f === 'number' ? f : f(b));

/**
 * The frame carries a shell's rings and builds on them, in the figure's
 * space. Every piece is placed off `surface`, so a plate lies on the shell,
 * a bar follows it and a stud sits on it, whatever the curve.
 */
class Frame {
  constructor(
    readonly k: Kit,
    readonly rings: readonly Ring[],
  ) {}

  /** A point `out` off the surface, in the figure's space. */
  at(b: number, y: number, out = 0): THREE.Vector3 {
    const { s, base } = this.k;
    const { p, n } = surface(this.rings, y, b);
    p.addScaledVector(n, out);
    return new THREE.Vector3(p.x * s, base + p.y * s, p.z * s);
  }

  /** The height of the shell's crown over (x, z), in sizes. */
  crown(x: number, z: number): number {
    const top = this.rings[this.rings.length - 1].y;
    for (let y = top; y > this.rings[0].y; y -= 0.01) {
      const r = ringAt(this.rings, y);
      if ((x / r.rx) ** 2 + ((z - r.z) / r.rz) ** 2 <= 1) return y;
    }
    return this.rings[0].y;
  }

  /** The whole shell, `out` off the rings, from `fromY` up: a closed loft. */
  dome(out: number, fromY: number, color: number, sides = 20): void {
    const { s, base } = this.k;
    const stations: Station[] = offsetRings(this.rings, out, fromY).map((r): Station => ({
      at: [0, base + r.y * s, (r.z ?? 0) * s],
      rx: r.rx * s,
      ry: (r.rz ?? r.rx) * s,
      axis: [0, 1, 0],
      n: r.n,
    }));
    this.k.push(loft(stations, sides, { start: true, end: true }), color);
  }

  /**
   * The liner with the face plate set into it: one closed mesh, the shell
   * everywhere but the window, and inside the window a flat plate standing
   * back where the window's edge is narrowest. The window's edges are rows
   * and columns of their own, doubled, so the step is a face and not a slope.
   */
  liner(win: Window, color: number): Plate {
    const { s, base } = this.k;
    const N = 28;
    type Column = { phi: number; edge: 'out' | 'in' | null };
    const columns: Column[] = [];
    for (let j = 0; j < N; j++) columns.push({ phi: -Math.PI + (j * 2 * Math.PI) / N, edge: null });
    columns.push({ phi: -win.phi, edge: 'out' }, { phi: -win.phi, edge: 'in' }, { phi: win.phi, edge: 'in' }, { phi: win.phi, edge: 'out' });
    columns.sort((a, b) => a.phi - b.phi || (a.phi < 0 ? (a.edge === 'out' ? -1 : 1) : a.edge === 'in' ? -1 : 1));
    const inWindow = (c: Column): boolean => c.edge === 'in' || (c.edge === null && Math.abs(c.phi) < win.phi);

    const ys: { y: number; recessed: boolean }[] = [];
    for (const r of this.rings) if (r.y < win.y0 || r.y > win.y1) ys.push({ y: r.y, recessed: false });
    ys.push({ y: win.y0, recessed: false }, { y: win.y0, recessed: true }, { y: win.y1, recessed: true }, { y: win.y1, recessed: false });
    for (const r of this.rings) if (r.y > win.y0 && r.y < win.y1) ys.push({ y: r.y, recessed: true });
    ys.sort((a, b) => a.y - b.y || (a.y === win.y0 ? (a.recessed ? 1 : -1) : a.recessed ? -1 : 1));

    let plateZ = Infinity;
    for (const row of ys) {
      if (!row.recessed) continue;
      plateZ = Math.min(plateZ, outline(ringAt(this.rings, row.y), win.phi).z - 0.03);
    }
    const rows: Vec3[][] = ys.map((row) => {
      const r = ringAt(this.rings, row.y);
      return columns.map((c): Vec3 => {
        const o = outline(r, c.phi);
        const z = row.recessed && inWindow(c) ? plateZ : o.z;
        return [o.x * s, base + row.y * s, z * s];
      });
    });
    this.k.push(sheet(rows, { closed: true, caps: { start: true, end: true } }), color);

    const cy = (win.y0 + win.y1) / 2;
    const hw = Math.min(outline(ringAt(this.rings, win.y0), win.phi).x, outline(ringAt(this.rings, win.y1), win.phi).x);
    const k = this.k;
    return {
      cy,
      hw,
      hh: (win.y1 - win.y0) / 2,
      on: (g, x, y, out, colour) => {
        g.translate(x * s, base + (cy + y) * s, (plateZ + out) * s);
        k.push(g, colour);
      },
    };
  }

  /**
   * A curved plate: a piece of the shell between two bearings and two heights
   * (each may vary with bearing), from `inner` to `outer` off the surface, a
   * closed solid with its edges. Rows run along the bearing; each row is the
   * plate's section, which steps through every ring between its foot and its
   * head so the plate follows the shell and never lets it through. The
   * section is wound out-bottom, in-bottom, up the inside, out-top, down the
   * outside — counter-clockwise about the direction of travel, faces out.
   */
  slabGeometry(b0: number, b1: number, y0: Edge, y1: Edge, inner: number, outer: number): THREE.BufferGeometry {
    const { s, base } = this.k;
    const steps = Math.max(2, Math.ceil((b1 - b0) / 0.12));
    const rows: Vec3[][] = [];
    // The heights the section steps through: the plate's ends and every ring between.
    const heights = (lo: number, hi: number): number[] => {
      const ys = [lo];
      for (const r of this.rings) if (r.y > lo + 1e-4 && r.y < hi - 1e-4) ys.push(r.y);
      ys.push(hi);
      return ys;
    };
    // The same count in every row, so rows string together: sample the union of ring heights, scaled into each row's span.
    const lo0 = Math.min(edgeAt(y0, b0), edgeAt(y0, b1), edgeAt(y0, (b0 + b1) / 2));
    const hi0 = Math.max(edgeAt(y1, b0), edgeAt(y1, b1), edgeAt(y1, (b0 + b1) / 2));
    const template = heights(lo0, hi0);
    for (let i = 0; i <= steps; i++) {
      const b = b0 + ((b1 - b0) * i) / steps;
      const lo = edgeAt(y0, b);
      const hi = edgeAt(y1, b);
      const pt = (y: number, off: number): Vec3 => {
        const { p, n } = surface(this.rings, y, b);
        p.addScaledVector(n, off);
        return [p.x * s, base + p.y * s, p.z * s];
      };
      const ys = template.map((t) => lo + ((t - lo0) / Math.max(1e-6, hi0 - lo0)) * (hi - lo));
      const row: Vec3[] = [];
      for (let j = 0; j < ys.length; j++) row.push(pt(ys[j], inner));
      for (let j = ys.length - 1; j >= 0; j--) row.push(pt(ys[j], outer));
      // Rotate so the section starts at out-bottom, then in-bottom, up the inside.
      row.unshift(row.pop()!);
      rows.push(row);
    }
    return sheet(rows, { closed: true, caps: { start: true, end: true } });
  }

  slab(b0: number, b1: number, y0: Edge, y1: Edge, inner: number, outer: number, color: number): void {
    this.k.push(this.slabGeometry(b0, b1, y0, y1, inner, outer), color);
  }

  /**
   * A bar following a path over the surface, `w` half-wide, from `inner` to
   * `outer` off it. The section is (+side,in) (+side,out) (−side,out)
   * (−side,in) with side = n × t, which is counter-clockwise about t.
   */
  pathBarGeometry(path: readonly Spot[], w: number, inner: number, outer: number, closed = false): THREE.BufferGeometry {
    const { s, base } = this.k;
    const rows: Vec3[][] = [];
    const n0 = path.length;
    // A closed path's ends are neighbours, so the seam's two rows agree and it seals.
    for (let i = 0; i < n0 + (closed ? 1 : 0); i++) {
      const here = path[i % n0];
      const prev = path[closed ? (i - 1 + n0) % n0 : Math.max(0, i - 1)];
      const next = path[closed ? (i + 1) % n0 : Math.min(n0 - 1, i + 1)];
      const { p, n } = surface(this.rings, here.y, here.b);
      const t = surface(this.rings, next.y, next.b).p.sub(surface(this.rings, prev.y, prev.b).p).normalize();
      const side = new THREE.Vector3().crossVectors(n, t).normalize();
      const pt = (a: number, off: number): Vec3 => {
        const q = p.clone().addScaledVector(side, a).addScaledVector(n, off);
        return [q.x * s, base + q.y * s, q.z * s];
      };
      rows.push([pt(w, inner), pt(w, outer), pt(-w, outer), pt(-w, inner)]);
    }
    return sheet(rows, { closed: true, caps: { start: !closed, end: !closed } });
  }

  pathBar(path: readonly Spot[], w: number, inner: number, outer: number, color: number, closed = false): void {
    this.k.push(this.pathBarGeometry(path, w, inner, outer, closed), color);
  }

  /** A round tube following a path over the surface, its centre `out` off it. */
  pathTube(path: readonly Spot[], r: number, out: number, color: number, closed = false): void {
    const { s, base } = this.k;
    const stations: Station[] = [];
    const n0 = path.length;
    for (let i = 0; i < n0 + (closed ? 1 : 0); i++) {
      const here = path[i % n0];
      const prev = path[closed ? (i - 1 + n0) % n0 : Math.max(0, i - 1)];
      const next = path[closed ? (i + 1) % n0 : Math.min(n0 - 1, i + 1)];
      const { p, n } = surface(this.rings, here.y, here.b);
      const t = surface(this.rings, next.y, next.b).p.sub(surface(this.rings, prev.y, prev.b).p).normalize();
      p.addScaledVector(n, out);
      stations.push({ at: [p.x * s, base + p.y * s, p.z * s], rx: r * s, ry: r * s, axis: [t.x, t.y, t.z] });
    }
    this.k.push(loft(stations, 8, { start: !closed, end: !closed }), color);
  }

  /** A piece built facing +Z, stood on the surface at (b, y), `out` proud, turned onto the normal there, then raised `lift` straight up. */
  on(g: THREE.BufferGeometry, b: number, y: number, out: number, color: number, lift = 0): void {
    const { n } = surface(this.rings, y, b);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n));
    const q = this.at(b, y, out);
    g.translate(q.x, q.y + lift * this.k.s, q.z);
    this.k.push(g, color);
  }

  /**
   * A peak: a brim standing straight out from the shell at `y` between two
   * bearings, flat for `lip` and then rising `rise` over the rest of `reach`
   * (both may vary with bearing), `thick` deep. The section runs out-bottom,
   * in-bottom, in-top, out-top: counter-clockwise about the direction of
   * travel, faces out. A full round is left open at the seam, whose rows agree.
   */
  peak(b0: number, b1: number, y: number, out0: number, lip: number, reach: Edge, rise: Edge, thick: number, color: number): void {
    const { s, base } = this.k;
    const round = b1 - b0 >= Math.PI * 2 - 1e-6;
    const steps = Math.max(2, Math.ceil((b1 - b0) / 0.1));
    const rows: Vec3[][] = [];
    for (let i = 0; i <= steps; i++) {
      const b = b0 + ((b1 - b0) * i) / steps;
      const { p, n } = surface(this.rings, y, b);
      // Straight out: the normal flattened, so the brim's rise is its own and not the shell's slope.
      const h = new THREE.Vector3(n.x, 0, n.z).normalize();
      const far = Math.max(edgeAt(reach, b), lip + 0.03);
      const up = edgeAt(rise, b);
      const pt = (along: number, lift: number): Vec3 => {
        const q = p.clone().addScaledVector(h, along);
        return [q.x * s, base + (q.y + lift) * s, q.z * s];
      };
      rows.push([pt(out0 + far, up), pt(out0 + lip, 0), pt(out0, 0), pt(out0, thick), pt(out0 + lip, thick), pt(out0 + far, up + thick)]);
    }
    this.k.push(sheet(rows, { closed: true, caps: { start: !round, end: !round } }), color);
  }

  /** A circle drawn on the surface about (bc, yc), as a path. */
  circle(bc: number, yc: number, r: number, n = 24): Spot[] {
    const rx = ringAt(this.rings, yc).rx;
    const path: Spot[] = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      path.push({ b: bc + (Math.cos(a) * r) / rx, y: yc + Math.sin(a) * r });
    }
    return path;
  }

  /** A straight run on the surface between two spots, sampled. */
  line(a: Spot, b: Spot, n = 6): Spot[] {
    const path: Spot[] = [];
    for (let i = 0; i <= n; i++) path.push({ b: a.b + ((b.b - a.b) * i) / n, y: a.y + ((b.y - a.y) * i) / n });
    return path;
  }

  /** A band round the whole shell, tilted by `tilt·cos(bearing − phase)`, as a path. */
  wind(y: number, tilt = 0, phase = 0, n = 32): Spot[] {
    const path: Spot[] = [];
    for (let i = 0; i < n; i++) {
      const b = -Math.PI + (i / n) * Math.PI * 2;
      path.push({ b, y: y + tilt * Math.cos(b - phase) });
    }
    return path;
  }

  /** A comb: a low fin over the crown, front to back, its foot in the shell. */
  comb(from: number, to: number, tall: number, out: number, color: number): void {
    const { s, base } = this.k;
    const stations: Station[] = [];
    const n = 8;
    for (let i = 0; i <= n; i++) {
      const z = from + ((to - from) * i) / n;
      const y = this.crown(0, z) + out;
      const rise = tall * Math.sin((i / n) * Math.PI) ** 0.6;
      stations.push({ at: [0, base + (y - 0.03) * s + (rise * s) / 2, z * s], rx: s * 0.04, ry: (rise + 0.08) * s * 0.5, axis: [0, 0, 1] });
    }
    this.k.push(loft(stations, 6, { start: true, end: true }), color);
  }

  /**
   * A raised visor: a plate curved to the skull, hinged at the temples and
   * turned up to lie over the crown, a rosette on each pivot. It is built
   * shut — a slab standing `gap` off the shell over the window — then turned
   * about the hinge, so it keeps the skull's own sweep and reads as a piece
   * of the helm and not a band. `dress` adds to it before it turns.
   */
  visor(win: Window, pivotY: number, raise: number, gap: number, dress?: (add: (g: THREE.BufferGeometry, color: number) => void) => void): void {
    const { s, base, c, push } = this.k;
    const r = ringAt(this.rings, pivotY);
    const pieces: [THREE.BufferGeometry, number][] = [];
    // The plate: over the window and a little past it, its top edge arched.
    const arch = (b: number): number => pivotY + 0.05 + 0.1 * Math.max(0, 1 - (b / (win.phi + 0.25)) ** 2);
    pieces.push([this.slabGeometry(-win.phi - 0.25, win.phi + 0.25, win.y0 - 0.02, arch, gap, gap + THICK), this.k.shell]);
    dress?.((g, color) => pieces.push([g, color]));
    for (const [g, color] of pieces) {
      // Turned about the hinge: rotateX(−raise) takes +Z toward +Y, so the plate swings up and back.
      g.translate(0, -(base + pivotY * s), -r.z * s);
      g.rotateX(-raise);
      g.translate(0, base + pivotY * s, r.z * s);
      push(g, color);
    }
    // The hinge bosses: from the skull's plate out to the visor's, on each temple.
    const boss = gap + THICK - LAP + 0.01;
    for (const side of [1, -1] as const) {
      const rosette = disc(s * 0.13, s * boss, 8);
      // The disc faces +Z; rotateY(±π/2) turns it to face out of its temple.
      rosette.rotateY((side * Math.PI) / 2);
      rosette.translate(side * s * (r.rx + LAP + boss / 2 - 0.01), base + pivotY * s, r.z * s);
      push(rosette, c.metal);
      push(new THREE.IcosahedronGeometry(s * 0.05, 0).translate(side * s * (r.rx + LAP + boss + 0.02), base + pivotY * s, r.z * s), c.contrast);
    }
  }
}

/**
 * A plume: a spine curving up and back from `root` with vanes stepping up it,
 * `lean` sideways (+1 to +X). Colours alternate between the two given.
 */
function plume(k: Kit, root: THREE.Vector3, lean: number, scale: number, colors: readonly [number, number]): void {
  const { s, push } = k;
  const steps: readonly [number, number, number][] = [
    [0.02, 0.28, 0.02], [0.05, 0.56, -0.05], [0.1, 0.82, -0.16], [0.17, 1.04, -0.32],
  ];
  let q = root;
  for (let i = 0; i < steps.length; i++) {
    const [x, y, z] = steps[i];
    const next = new THREE.Vector3(root.x + lean * s * x * 1.5 * scale, root.y + s * y * scale, root.z + s * z * scale);
    push(stick(q, next, s * (0.05 - i * 0.008) * scale, s * (0.042 - i * 0.008) * scale), k.c.metal);
    const vane = lens(s * (0.16 + 0.05 * i) * scale, s * (0.34 + 0.06 * i) * scale, s * 0.05 * scale);
    // rotateZ(θ) takes +Y toward −X: the vane leans out with its plume.
    vane.rotateZ(-lean * (0.12 + 0.06 * i));
    vane.translate(next.x, next.y + s * 0.06 * scale, next.z);
    push(vane, colors[i % 2]);
    q = next;
  }
  push(new THREE.IcosahedronGeometry(s * 0.045 * scale, 0).translate(q.x, q.y + s * 0.22 * scale, q.z), k.c.metal);
}

// --- the shells ----------------------------------------------------------------

/**
 * The liner under a close helm: the villager hood's scale and a little
 * rounder, drawn in at the rim below the head's base so it clears the
 * shoulders on a look down.
 */
const LINER: readonly Ring[] = [
  { y: -0.32, rx: 0.55, rz: 0.48 },
  { y: -0.05, rx: 0.74, rz: 0.66 },
  { y: 0.5, rx: 0.8, rz: 0.72 },
  { y: 1.1, rx: 0.8, rz: 0.72 },
  { y: 1.5, rx: 0.7, rz: 0.62 },
  { y: 1.8, rx: 0.48, rz: 0.42 },
  { y: 2.0, rx: 0.18, rz: 0.16 },
  { y: 2.06, rx: 0.02, rz: 0.02 },
];

/** The great helm's: a drum, flat on top. */
const DRUM: readonly Ring[] = [
  { y: -0.32, rx: 0.55, rz: 0.48, n: 2.2 },
  { y: -0.05, rx: 0.76, rz: 0.68, n: 2.5 },
  { y: 1.55, rx: 0.78, rz: 0.7, n: 2.6 },
  { y: 1.8, rx: 0.76, rz: 0.68, n: 2.6 },
  { y: 1.9, rx: 0.56, rz: 0.5, n: 2.4 },
  { y: 1.95, rx: 0.02, rz: 0.02 },
];

/** The bascinet's: pointed, the point leaning back. */
const POINTED: readonly Ring[] = [
  { y: -0.32, rx: 0.55, rz: 0.48 },
  { y: -0.05, rx: 0.74, rz: 0.66 },
  { y: 0.5, rx: 0.8, rz: 0.72 },
  { y: 1.1, rx: 0.78, rz: 0.7 },
  { y: 1.5, rx: 0.68, rz: 0.6, z: -0.02 },
  { y: 1.85, rx: 0.5, rz: 0.44, z: -0.05 },
  { y: 2.15, rx: 0.26, rz: 0.22, z: -0.08 },
  { y: 2.35, rx: 0.02, rz: 0.02, z: -0.1 },
];

/** The spangenhelm's: a cone. */
const CONE: readonly Ring[] = [
  { y: -0.32, rx: 0.55, rz: 0.48 },
  { y: -0.05, rx: 0.74, rz: 0.66 },
  { y: 0.4, rx: 0.78, rz: 0.7 },
  { y: 1.0, rx: 0.72, rz: 0.64 },
  { y: 1.5, rx: 0.52, rz: 0.46 },
  { y: 1.9, rx: 0.26, rz: 0.23 },
  { y: 2.15, rx: 0.02, rz: 0.02 },
];

/** The frog-mouth's: thrust forward to the mouth. */
const WEDGE: readonly Ring[] = [
  { y: -0.32, rx: 0.55, rz: 0.48 },
  { y: -0.05, rx: 0.72, rz: 0.66, z: 0.06 },
  { y: 0.45, rx: 0.78, rz: 0.78, z: 0.18 },
  { y: 1.05, rx: 0.8, rz: 0.84, z: 0.26 },
  { y: 1.3, rx: 0.74, rz: 0.7, z: 0.1 },
  { y: 1.6, rx: 0.56, rz: 0.5 },
  { y: 1.85, rx: 0.26, rz: 0.24 },
  { y: 1.95, rx: 0.02, rz: 0.02 },
];

/** The wound veil under a cloth covering: an egg at the same scale. */
const VEIL: readonly Ring[] = [
  { y: -0.32, rx: 0.52, rz: 0.46 },
  { y: 0.0, rx: 0.68, rz: 0.6 },
  { y: 0.6, rx: 0.76, rz: 0.68 },
  { y: 1.2, rx: 0.72, rz: 0.64 },
  { y: 1.6, rx: 0.54, rz: 0.48 },
  { y: 1.85, rx: 0.26, rz: 0.23 },
  { y: 1.95, rx: 0.02, rz: 0.02 },
];

const WINDOW: Window = { phi: 0.68, y0: 0.35, y1: 1.35 };

const THICK = 0.05;
/** A plate lapping over another stands this much further out. */
const LAP = THICK * 1.25;

// --- devices: what stands on the face plate ------------------------------------------
//
// Worked things, not flags: a rose in layered petals, a cross with lily ends,
// a scallop of ribs, a castle of towers, a knot of rings — each in real relief
// on a coloured field, in the pale, the contrast and the metal.

/** The field the device stands on: a plate of colour filling the window. */
function field(p: Plate, k: Kit, color: number): void {
  p.on(new THREE.BoxGeometry(k.s * (p.hw * 2 - 0.02), k.s * (p.hh * 2 - 0.02), k.s * 0.02), 0, 0, 0.0, color);
}

/** A petal: a lens pointing +Y from the origin, `len` long and `w` wide, turned round by `turn`. */
function petal(s: number, r0: number, len: number, w: number, thick: number, turn: number, lean = 0): THREE.BufferGeometry {
  const g = lens(s * w, s * len, s * thick);
  g.translate(0, s * (r0 + len / 2), 0);
  // rotateX(−lean) tips the petal's far end forward off the plate; rotateZ(turn) turns it round the centre.
  g.rotateX(-lean);
  g.rotateZ(turn);
  return g;
}

/** A cross pattée: four equal arms flaring to their ends, three layers — the metal, the pale, the house's own colour lightened — and a stud. */
function crossPattee(p: Plate, k: Kit): void {
  const { s, c } = k;
  const reach = Math.min(p.hw, p.hh) - 0.06;
  const cross = (r: number, f: number): THREE.Shape => {
    // One outline, the up arm drawn left to right and each next arm turned a
    // quarter clockwise from it, so the four join corner to corner and the
    // outline never crosses itself.
    const pts: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      const a = (-i * Math.PI) / 2;
      const local: [number, number][] = [[-0.09, 0.09], [-0.09, r * 0.45], [-0.26, r], [0.26, r], [0.09, r * 0.45], [0.09, 0.09]];
      for (const [x, y] of local) {
        const q: [number, number] = [(x * Math.cos(a) - y * Math.sin(a)) * f, (x * Math.sin(a) + y * Math.cos(a)) * f];
        const last = pts[pts.length - 1];
        if (!last || Math.abs(last[0] - q[0]) > 1e-6 || Math.abs(last[1] - q[1]) > 1e-6) pts.push(q);
      }
    }
    pts.pop();
    const shape = new THREE.Shape();
    shape.moveTo(pts[0][0], pts[0][1]);
    for (const [x, y] of pts.slice(1)) shape.lineTo(x, y);
    shape.closePath();
    return shape;
  };
  const layers: readonly [number, number, number][] = [[1, 0.02, c.metal], [0.8, 0.07, c.pale], [0.6, 0.12, shade(c.mid, 1.25)]];
  for (const [f, out, color] of layers) p.on(flat(cross(reach, f), s * 0.05).scale(s, s, 1), 0, 0, out, color);
  p.on(new THREE.IcosahedronGeometry(s * 0.045, 1), 0, 0, 0.17, c.metal);
}

/** A polygon cut to the half plane a·x + b·y + c ≥ 0. */
function clipPoly(poly: readonly [number, number][], a: number, b: number, c: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < poly.length; i++) {
    const P = poly[i];
    const Q = poly[(i + 1) % poly.length];
    const dp = a * P[0] + b * P[1] + c;
    const dq = a * Q[0] + b * Q[1] + c;
    if (dp >= 0) out.push(P);
    if (dp >= 0 !== dq >= 0) {
      const t = dp / (dp - dq);
      out.push([P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t]);
    }
  }
  return out;
}

/** A quatrefoil: four lobes of radius `r` about centres `a` out, as one outline. */
function quatrefoil(a: number, r: number): THREE.Shape {
  // Where neighbouring lobes meet, seen from a lobe's centre.
  const meet = (a + Math.sqrt(2 * r * r - a * a)) / 2;
  const alpha = Math.atan2(meet, meet - a);
  const shape = new THREE.Shape();
  for (let i = 0; i < 4; i++) {
    const th = (i * Math.PI) / 2;
    shape.absarc(Math.cos(th) * a, Math.sin(th) * a, r, th - alpha, th + alpha, false);
  }
  shape.closePath();
  return shape;
}

/** A fret: diagonal bars woven over the field, one way under the other, discs in the cells, studs at the crossings, a quatrefoil at the heart. */
function fret(p: Plate, k: Kit): void {
  const { s, c } = k;
  field(p, k, shade(c.mid, 0.8));
  const w = p.hw - 0.05;
  const h = p.hh - 0.05;
  const rect: [number, number][] = [[-w, -h], [w, -h], [w, h], [-w, h]];
  const pitch = 0.4;
  const bw = 0.05;
  const r2 = Math.SQRT1_2;
  const poly = (pts: readonly [number, number][]): THREE.Shape => {
    const shape = new THREE.Shape();
    shape.moveTo(pts[0][0], pts[0][1]);
    for (const [x, y] of pts.slice(1)) shape.lineTo(x, y);
    shape.closePath();
    return shape;
  };
  // Bars along u = (x + dir·y)/√2 = d, each cut to the plate; the second way lies over the first.
  for (const [dir, out, color] of [[1, 0.02, c.pale], [-1, 0.045, shade(c.pale, 0.82)]] as const) {
    for (let i = -2; i <= 2; i++) {
      const d = i * pitch;
      let bar = clipPoly(rect, r2, dir * r2, -(d - bw / 2));
      bar = clipPoly(bar, -r2, -dir * r2, d + bw / 2);
      if (bar.length < 3) continue;
      p.on(flat(poly(bar), s * 0.04).scale(s, s, 1), 0, 0, out, color);
    }
  }
  // Discs in the cells about the heart, two colours by turns; studs where the bars cross.
  for (const [ku, kv] of [[0, 0], [0, -1], [-1, 0], [-1, -1]] as const) {
    const u = (ku + 0.5) * pitch;
    const v = (kv + 0.5) * pitch;
    p.on(disc(s * 0.06, s * 0.04, 12), (u + v) * r2, (u - v) * r2, 0.02, (ku + kv) % 2 ? c.contrast : shade(c.mid, 1.3));
  }
  for (const [x, y] of [[1, 1], [1, -1], [-1, 1], [-1, -1]] as const) p.on(new THREE.IcosahedronGeometry(s * 0.035, 1), x * pitch * r2, y * pitch * r2, 0.085, c.metal);
  p.on(flat(quatrefoil(0.1, 0.1), s * 0.05).scale(s, s, 1), 0, 0, 0.09, c.contrast);
  p.on(flat(quatrefoil(0.06, 0.06), s * 0.04).scale(s, s, 1), 0, 0, 0.14, c.pale);
  p.on(disc(s * 0.045, s * 0.04, 10), 0, 0, 0.18, c.metal);
}

/** An escallop: nine ribs fanning from a scalloped hinge, the colours turning rib by rib. */
function escallop(p: Plate, k: Kit): void {
  const { s, c } = k;
  field(p, k, shade(c.mid, 0.8));
  const R = p.hh * 1.5;
  const hinge = -p.hh * 0.72;
  const ribs = 9;
  const colors = [c.pale, c.contrast, shade(c.pale, 0.82)];
  for (let i = 0; i < ribs; i++) {
    const a = -1.15 + (2.3 * i) / (ribs - 1);
    const len = R * (1 - 0.18 * Math.abs(a) ** 1.5);
    p.on(petal(s, 0.12, len, 0.14, 0.07, -a, 0.08), 0, hinge, 0.02, colors[i % 3]);
  }
  const scallop = flat(sector(0, 0.2, Math.PI, Math.PI * 2), s * 0.06).scale(s, s, 1);
  p.on(scallop, 0, hinge + 0.02, 0.05, c.contrast);
  for (let i = 0; i < 5; i++) {
    const a = Math.PI + (Math.PI * (i + 0.5)) / 5;
    p.on(new THREE.IcosahedronGeometry(s * 0.035, 1), Math.cos(a) * 0.19, hinge + 0.02 + Math.sin(a) * 0.19, 0.1, i % 2 ? c.metal : c.pale);
  }
  p.on(new THREE.IcosahedronGeometry(s * 0.06, 1), 0, hinge - 0.02, 0.12, c.metal);
}

/** A compass rose sized to the window: eight long rays and eight short between, the colours turning, a ringed boss. */
function compassRose(p: Plate, k: Kit): void {
  const { s, c } = k;
  field(p, k, shade(c.mid, 0.8));
  const R = Math.min(p.hw, p.hh) - 0.12;
  const colors = [c.pale, shade(c.pale, 0.82), c.contrast, c.metal];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    const long = i % 2 === 0;
    const len = long ? R : R * 0.55;
    const ray = new THREE.ConeGeometry(s * (long ? 0.09 : 0.07), s * len, 4);
    ray.scale(1, 1, 0.5);
    ray.translate(0, (s * len) / 2 + s * 0.06, 0);
    // rotateZ(a) turns the ray round the heart.
    ray.rotateZ(a);
    p.on(ray, 0, 0, long ? 0.03 : 0.05, colors[(i >> 1) % 4]);
  }
  p.on(new THREE.TorusGeometry(s * R * 0.4, s * 0.03, 6, 24), 0, 0, 0.07, c.metal);
  p.on(disc(s * 0.12, s * 0.05, 16), 0, 0, 0.06, c.contrast);
  p.on(new THREE.IcosahedronGeometry(s * 0.06, 1), 0, 0, 0.1, c.pale);
}

/** A ziggurat: three lozenges stepping up, in the pale, the contrast and the paler pale, studs at the outer points. */
function ziggurat(p: Plate, k: Kit): void {
  const { s, c } = k;
  field(p, k, shade(c.mid, 0.8));
  const w = p.hw - 0.12;
  const h = p.hh - 0.12;
  const steps: readonly [number, number, number][] = [[1, 0.02, c.pale], [0.68, 0.07, c.contrast], [0.36, 0.12, shade(c.pale, 0.82)]];
  for (const [f, out, color] of steps) {
    const shape = new THREE.Shape();
    shape.moveTo(w * f, 0);
    shape.lineTo(0, h * f);
    shape.lineTo(-w * f, 0);
    shape.lineTo(0, -h * f);
    shape.closePath();
    p.on(flat(shape, s * 0.05).scale(s, s, 1), 0, 0, out, color);
  }
  p.on(new THREE.IcosahedronGeometry(s * 0.05, 1), 0, 0, 0.17, c.metal);
  for (const [x, y] of [[w * 0.84, 0], [-w * 0.84, 0], [0, h * 0.84], [0, -h * 0.84]] as const) p.on(new THREE.IcosahedronGeometry(s * 0.035, 1), x, y, 0.07, c.metal);
}

/** Barry wavy: five waves across the plate, the colours turning, kept inside the frame. */
function barryWavy(p: Plate, k: Kit): void {
  const { s, c } = k;
  field(p, k, shade(c.mid, 0.8));
  const w = p.hw - 0.1;
  const h = p.hh - 0.1;
  const bars = 5;
  const bh = (h * 2) / bars;
  const colors = [c.pale, c.contrast, shade(c.pale, 0.82), c.contrast, c.pale];
  for (let i = 0; i < bars; i++) {
    const y0 = -h + i * bh;
    const shape = new THREE.Shape();
    const wave = (x: number, up: number): number => up + 0.045 * Math.sin((x / w) * Math.PI * 2);
    shape.moveTo(-w, wave(-w, y0));
    for (let j = 1; j <= 16; j++) shape.lineTo(-w + (2 * w * j) / 16, wave(-w + (2 * w * j) / 16, y0));
    for (let j = 16; j >= 0; j--) shape.lineTo(-w + (2 * w * j) / 16, wave(-w + (2 * w * j) / 16, y0 + bh * 0.8));
    shape.closePath();
    p.on(flat(shape, s * 0.04).scale(s, s, 1), 0, 0, 0.02 + (i % 2) * 0.03, colors[i]);
  }
  p.on(disc(s * 0.09, s * 0.05, 14), 0, 0, 0.08, c.metal);
  p.on(new THREE.IcosahedronGeometry(s * 0.05, 1), 0, 0, 0.12, c.contrast);
}

/** A triskele: three curved arms sweeping from a boss, each in its own colour, a stone at every tip. */
function triskele(p: Plate, k: Kit): void {
  const { s, c } = k;
  field(p, k, shade(c.mid, 0.8));
  const R = Math.min(p.hw, p.hh) - 0.1;
  const colors = [c.pale, c.contrast, shade(c.pale, 0.82)];
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3 + Math.PI / 2;
    // Each arm: a quarter arc of a torus off centre, sweeping out and round.
    const arm = new THREE.TorusGeometry(s * R * 0.5, s * 0.06, 8, 20, Math.PI * 0.75);
    arm.translate(s * R * 0.5, 0, 0);
    // rotateZ(a) turns the arm round the boss.
    arm.rotateZ(a);
    p.on(arm, 0, 0, 0.05, colors[i]);
    const tip = Math.PI * 0.75;
    const tx = R * 0.5 + Math.cos(tip) * R * 0.5;
    const ty = Math.sin(tip) * R * 0.5;
    p.on(new THREE.IcosahedronGeometry(s * 0.06, 1), tx * Math.cos(a) - ty * Math.sin(a), tx * Math.sin(a) + ty * Math.cos(a), 0.08, c.metal);
  }
  p.on(disc(s * 0.13, s * 0.05, 16), 0, 0, 0.06, c.metal);
  p.on(new THREE.IcosahedronGeometry(s * 0.07, 1), 0, 0, 0.11, c.contrast);
}

/** A swirl: eight curved rays turning about a boss, the colours cycling. */
function swirl(p: Plate, k: Kit): void {
  const { s, c } = k;
  field(p, k, shade(c.mid, 0.8));
  const R = Math.min(p.hw, p.hh) - 0.1;
  const colors = [c.pale, c.contrast, shade(c.pale, 0.82), c.metal];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const ray = new THREE.TorusGeometry(s * R * 0.7, s * 0.045, 6, 16, Math.PI * 0.42);
    ray.translate(-s * R * 0.7 + s * 0.12, 0, 0);
    // rotateZ(a) turns each curved ray round the boss.
    ray.rotateZ(a);
    p.on(ray, 0, 0, 0.04 + (i % 2) * 0.03, colors[i % 4]);
  }
  p.on(new THREE.TorusGeometry(s * 0.16, s * 0.03, 6, 20), 0, 0, 0.06, c.metal);
  p.on(disc(s * 0.1, s * 0.05, 14), 0, 0, 0.06, c.contrast);
  p.on(new THREE.IcosahedronGeometry(s * 0.05, 1), 0, 0, 0.11, c.pale);
}

/** A sun of spikes on a shield: the shield's outline in the metal, flat spikes long and short by turns, a low boss. */
function sunShield(p: Plate, k: Kit): void {
  const { s, c } = k;
  field(p, k, c.mid);
  const w = p.hw - 0.04;
  const h = p.hh - 0.04;
  const shieldShape = (inset: number): THREE.Shape => {
    const ww = w - inset;
    const hh = h - inset;
    const shape = new THREE.Shape();
    shape.moveTo(-ww, hh);
    shape.lineTo(ww, hh);
    shape.lineTo(ww, hh * 0.2);
    shape.quadraticCurveTo(ww, -hh * 0.6, 0, -hh);
    shape.quadraticCurveTo(-ww, -hh * 0.6, -ww, hh * 0.2);
    shape.closePath();
    return shape;
  };
  p.on(flat(shieldShape(0), s * 0.03).scale(s, s, 1), 0, 0, 0.01, c.metal);
  p.on(flat(shieldShape(0.06), s * 0.03).scale(s, s, 1), 0, 0, 0.03, c.contrast);
  const rays = 16;
  const R = Math.min(w, h) - 0.14;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 + Math.PI / rays;
    const long = i % 2 === 0;
    const len = long ? R : R * 0.6;
    const ray = new THREE.ConeGeometry(s * (long ? 0.09 : 0.07), s * len, 4);
    ray.scale(1, 1, 0.4);
    ray.translate(0, (s * len) / 2 + s * 0.08, 0);
    // rotateZ(a) turns the spike round the sun.
    ray.rotateZ(a);
    p.on(ray, 0, 0.06, 0.07, long ? c.pale : shade(c.pale, 0.82));
  }
  p.on(disc(s * 0.16, s * 0.05, 20), 0, 0.06, 0.08, c.metal);
  p.on(disc(s * 0.09, s * 0.04, 14), 0, 0.06, 0.12, c.contrast);
}

// --- helm bodies -----------------------------------------------------------------

/** Cheek plates: the shell's sides from the window back to the nape, meeting there. */
function cheeks(f: Frame, w: Window, y0: number, y1: number): void {
  f.slab(w.phi, Math.PI, y0, y1, 0, THICK, f.k.shell);
  f.slab(-Math.PI, -w.phi, y0, y1, 0, THICK, f.k.shell);
}

/** The bevor's upper edge under the window, curved up to the sides. */
const bevorEdge = (w: Window) => (b: number): number => w.y0 - 0.06 * Math.max(0, 1 - (b / (w.phi + 0.2)) ** 2);

/** The bevor: a chin plate lapped over the cheeks under the window, its edge curved up to the sides. */
function bevor(f: Frame, w: Window, y0: number): void {
  f.slab(-w.phi - 0.2, w.phi + 0.2, y0, bevorEdge(w), THICK, THICK * 2, shade(f.k.shell, 0.94));
}

/**
 * A border round the window: a bar up each side lapped over the plates
 * there, from `foot` up into whatever is at `head`, studded; a bar along the
 * chin plate's edge, standing off it by `chinOut`, its ends nested in the
 * uprights.
 */
function surround(f: Frame, w: Window, chin: (b: number) => number, foot: number, head: number, chinOut: number): void {
  const { s, c } = f.k;
  const b = w.phi + 0.06;
  for (const side of [1, -1] as const) {
    f.pathBar(f.line({ b: side * b, y: foot }, { b: side * b, y: head }, 10), 0.035, THICK, THICK + 0.09, c.metal);
    for (let y = foot + 0.16; y < head - 0.14; y += 0.2) f.on(new THREE.IcosahedronGeometry(s * 0.03, 1), side * b, y, THICK + 0.09, shade(c.metal, 1.15));
  }
  const path: Spot[] = [];
  for (let i = 0; i <= 12; i++) {
    const bb = -b + (2 * b * i) / 12;
    path.push({ b: bb, y: chin(bb) - 0.06 });
  }
  f.pathBar(path, 0.03, chinOut, chinOut + 0.03, c.metal);
}

/** A band right round the shell in the metal. */
function band(f: Frame, y0: number, y1: number, inner: number, outer: number): void {
  f.slab(-Math.PI, Math.PI, y0, y1, inner, outer, f.k.c.metal);
}

/** A fleuron on the shell: three lens leaves spread from a stone, for a hinge or a finial. */
function fleuron(f: Frame, b: number, y: number, out: number, up: number, lift = 0): void {
  const { s, c } = f.k;
  for (const spread of [-0.6, 0, 0.6]) f.on(petal(s, 0.03, 0.2, 0.1, 0.05, up + spread), b, y, out, spread ? c.metal : shade(c.metal, 1.1), lift);
  f.on(new THREE.IcosahedronGeometry(s * 0.05, 1), b, y, out + 0.03, c.contrast, lift);
}

/** The torse: six rolls of the two colours by turns round the crown. */
function torse(f: Frame, y: number, out: number): void {
  const { c } = f.k;
  for (let i = 0; i < 6; i++) {
    const b0 = (i * Math.PI) / 3 - Math.PI;
    f.pathTube(f.line({ b: b0, y }, { b: b0 + Math.PI / 3, y }, 6), 0.09, out, i % 2 ? c.contrast : c.pale);
  }
}

const DESIGNS: Record<CityHeadKind, (k: Kit) => number> = {
  greathelm: (k) => {
    const f = new Frame(k, DRUM);
    const win: Window = { phi: 0.62, y0: 0.35, y1: 1.4 };
    const plate = f.liner(win, k.liner);
    // A drum of plates: two front strips beside the window, chin and crown
    // plates before, a back plate behind, a flat top; bands round the brow,
    // the chin and the crown; the torse.
    const seam = 1.15;
    f.slab(win.phi, seam, -0.3, 1.8, 0, THICK, k.shell);
    f.slab(-seam, -win.phi, -0.3, 1.8, 0, THICK, k.shell);
    f.slab(-win.phi, win.phi, -0.3, win.y0, 0, THICK, k.shell);
    f.slab(-win.phi, win.phi, win.y1, 1.8, 0, THICK, k.shell);
    f.slab(seam, Math.PI * 2 - seam, -0.3, 1.8, 0, THICK, shade(k.shell, 0.96));
    f.dome(LAP, 1.77, k.shell, 24);
    band(f, win.y1 + 0.02, win.y1 + 0.14, THICK, THICK + 0.05);
    band(f, win.y0 - 0.14, win.y0 - 0.02, THICK, THICK + 0.05);
    band(f, 1.6, 1.7, THICK, THICK + 0.04);
    crossPattee(plate, k);
    torse(f, 1.85, LAP + 0.02);
    return 2.0;
  },

  bascinet: (k) => {
    const { c, s, base, push } = k;
    const f = new Frame(k, POINTED);
    const plate = f.liner(WINDOW, k.liner);
    // A pointed skull over cheek plates that meet at the nape, a bevor under
    // the window, a brow band; the visor split in two and slid back along the
    // sides like shutters; a row of spikes over the crown splitting into two
    // down the back.
    cheeks(f, WINDOW, -0.28, 1.0);
    f.slab(WINDOW.phi, Math.PI, 0.98, 2.34, LAP, LAP + THICK, k.shell);
    f.slab(-Math.PI, -WINDOW.phi, 0.98, 2.34, LAP, LAP + THICK, k.shell);
    f.slab(-WINDOW.phi, WINDOW.phi, WINDOW.y1, 2.34, LAP, LAP + THICK, k.shell);
    bevor(f, WINDOW, -0.2);
    band(f, WINDOW.y1 + 0.02, WINDOW.y1 + 0.16, LAP + THICK, LAP + THICK + 0.05);
    for (const side of [1, -1] as const) {
      const b0 = side * (WINDOW.phi + 0.03);
      const b1 = side * (WINDOW.phi + 0.62);
      const top = (b: number): number => WINDOW.y1 - 0.08 + 0.08 * Math.max(0, 1 - Math.abs((b - b0) / (b1 - b0)));
      f.slab(Math.min(b0, b1), Math.max(b0, b1), WINDOW.y0 + 0.02, top, THICK + LAP, THICK + LAP + THICK, shade(k.shell, 1.06));
      f.pathBar(f.line({ b: b0, y: WINDOW.y0 + 0.04 }, { b: b0, y: WINDOW.y1 + 0.02 }, 6), 0.03, THICK + LAP, THICK + LAP + THICK + 0.03, c.metal);
    }
    fret(plate, k);
    const spike = (b: number, y: number, h: number): void => {
      const cone = new THREE.ConeGeometry(s * 0.07, s * h, 8);
      // ConeGeometry points +Y; rotateX(π/2) turns it to point +Z, out along the normal.
      cone.rotateX(Math.PI / 2);
      cone.translate(0, 0, (s * h) / 2);
      f.on(cone, b, y, LAP + THICK - 0.01, c.metal);
    };
    for (const y of [1.6, 1.85, 2.1]) spike(0, y, 0.3);
    push(new THREE.ConeGeometry(s * 0.07, s * 0.36, 8).translate(0, base + s * (2.35 + LAP + THICK + 0.16), -s * 0.1), c.metal);
    for (const y of [2.05, 1.8, 1.55, 1.3, 1.05]) for (const side of [1, -1] as const) spike(Math.PI - side * 0.28, y, 0.26);
    return 2.6;
  },

  frogmouth: (k) => {
    const { c } = k;
    const f = new Frame(k, WEDGE);
    const win: Window = { phi: 0.74, y0: 0.3, y1: 1.02 };
    const plate = f.liner(win, k.liner);
    // The tilting helm: the mouth thrust forward, the sides and back one
    // piece, the chin lapping up to it with a curved edge, the lip a heavy
    // plate arched over it, the mouth bordered in the metal; a comb over the
    // crown with ribs off it down the sides, a band round the rim, finials
    // at the lip's ends.
    f.slab(win.phi, Math.PI * 2 - win.phi, -0.3, 1.05, 0, THICK, k.shell);
    f.slab(-win.phi - 0.05, win.phi + 0.05, -0.3, 0.02, THICK * 0.5, THICK * 1.5, k.shell);
    const chinEdge = (b: number): number => win.y0 - 0.05 * Math.max(0, 1 - (b / (win.phi + 0.05)) ** 2);
    f.slab(-win.phi - 0.05, win.phi + 0.05, -0.02, chinEdge, THICK, THICK * 2, shade(k.shell, 0.94));
    f.dome(LAP, win.y1 + 0.02, k.shell);
    f.slab(-1.05, 1.05, (b) => win.y1 + 0.1 * Math.max(0, 1 - (b / 1.05) ** 2), 1.28, THICK, THICK * 3, shade(k.shell, 0.94));
    surround(f, win, chinEdge, -0.19, win.y1 + 0.06, THICK * 2);
    f.comb(-0.6, 0.2, 0.14, LAP, c.metal);
    for (const b of [0.9, -0.9, 2.2, -2.2]) f.pathBar(f.line({ b, y: 1.3 }, { b, y: 1.85 }, 6), 0.035, LAP, LAP + 0.04, c.metal);
    band(f, -0.24, -0.14, THICK, THICK + 0.04);
    for (const side of [1, -1] as const) fleuron(f, side * 1.05, 1.15, THICK * 3, side * 1.4);
    escallop(plate, k);
    return 2.0;
  },

  burgonet: (k) => {
    const { c, s, push } = k;
    const f = new Frame(k, LINER);
    const plate = f.liner(WINDOW, k.liner);
    // An upturned peak over the brow, a tall comb, hinged cheek pieces and a
    // nape plate, the window bordered in the metal; a wing off each temple,
    // turned to show from the front. The dome starts above the window so
    // the whole plate shows.
    f.dome(LAP, WINDOW.y1 + 0.02, k.shell);
    f.comb(-0.6, 0.6, 0.34, LAP, c.metal);
    f.slab(WINDOW.phi, 2.0, -0.2, WINDOW.y1 + 0.02, 0, THICK, k.shell);
    f.slab(-2.0, -WINDOW.phi, -0.2, WINDOW.y1 + 0.02, 0, THICK, k.shell);
    f.slab(2.0, Math.PI * 2 - 2.0, -0.3, WINDOW.y1 + 0.02, 0, THICK, shade(k.shell, 0.96));
    bevor(f, WINDOW, -0.28);
    f.peak(-1.05, 1.05, WINDOW.y1, 0.01, 0.16, 0.36, 0.18, 0.07, k.shell);
    surround(f, WINDOW, bevorEdge(WINDOW), -0.14, WINDOW.y1 + 0.03, THICK * 2);
    compassRose(plate, k);
    for (const side of [1, -1] as const) {
      const bearing = side * 1.6;
      const hub = f.at(bearing, 1.3, THICK);
      push(new THREE.IcosahedronGeometry(s * 0.1, 1).translate(hub.x, hub.y, hub.z), c.metal);
      for (let i = 0; i < 5; i++) {
        const len = s * (0.6 + i * 0.1);
        const vane = lens(s * 0.06, len, s * 0.2);
        vane.translate(0, len / 2 + s * 0.05, 0);
        // rotateX(−θ) takes +Y toward −Z: each vane tips further back than the last.
        vane.rotateX(-(-0.35 + i * 0.36));
        // rotateZ(−side·φ) takes +Y toward the wing's own side, so the fan flares out;
        // rotateY(−side·ψ) then turns the fan's face toward the front.
        vane.rotateZ(-side * 0.5);
        vane.rotateY(-side * 0.7);
        vane.translate(hub.x, hub.y, hub.z);
        push(vane, i % 2 ? c.contrast : c.pale);
      }
    }
    return 2.5;
  },

  tourney: (k) => {
    const { c, s, base, push } = k;
    const f = new Frame(k, LINER);
    const win: Window = { phi: 0.62, y0: 0.35, y1: 1.4 };
    const plate = f.liner(win, k.liner);
    // A great helm rounded at the crown, plated like the drum, with a torse
    // and a fan crest spread across the head: ribs from a hub at the crown
    // reaching out and down past both temples, each tipped with a vane, a
    // rosette where they come down.
    const seam = 1.15;
    f.slab(win.phi, seam, -0.3, 1.5, 0, THICK, k.shell);
    f.slab(-seam, -win.phi, -0.3, 1.5, 0, THICK, k.shell);
    f.slab(-win.phi, win.phi, -0.3, win.y0, 0, THICK, k.shell);
    f.slab(-win.phi, win.phi, win.y1, 1.5, 0, THICK, k.shell);
    f.slab(seam, Math.PI * 2 - seam, -0.3, 1.5, 0, THICK, shade(k.shell, 0.96));
    f.dome(LAP, 1.45, k.shell);
    band(f, win.y1 + 0.02, win.y1 + 0.14, THICK, THICK + 0.05);
    band(f, win.y0 - 0.14, win.y0 - 0.02, THICK, THICK + 0.05);
    swirl(plate, k);
    torse(f, 1.62, LAP + 0.02);
    const hub = new THREE.Vector3(0, base + s * 2.2, 0);
    push(stick(new THREE.Vector3(0, base + s * 1.95, 0), hub, s * 0.06, s * 0.05, 8), c.metal);
    const ribs = 11;
    const spread = 1.1 * Math.PI;
    for (let i = 0; i < ribs; i++) {
      // a is measured from straight up, out to each side across the head.
      const a = -spread / 2 + (spread * i) / (ribs - 1);
      // The stem: a flat tapered blade from inside the hub ball out to the vane, and the vane a lens on its end.
      const stem = new THREE.Shape();
      stem.moveTo(-0.03, 0.06);
      stem.lineTo(-0.055, 0.82);
      stem.lineTo(0.055, 0.82);
      stem.lineTo(0.03, 0.06);
      stem.closePath();
      const blade = flat(stem, 0.04).scale(s, s, s);
      blade.translate(0, 0, -s * 0.02);
      const vane = lens(s * 0.26, s * 0.5, s * 0.07);
      vane.translate(0, s * 0.98, 0);
      for (const [g, color] of [[blade, c.metal], [vane, i % 2 ? c.pale : c.contrast]] as const) {
        // rotateZ(−a) takes +Y to (sin a, cos a): the rib leans out to its side.
        g.rotateZ(-a);
        g.translate(hub.x, hub.y, hub.z);
        push(g, color);
      }
    }
    push(new THREE.IcosahedronGeometry(s * 0.1, 1).translate(hub.x, hub.y, hub.z), c.metal);
    // The sides: a fleuron at each temple under the crest's fall; the back:
    // three ribs down the nape up to the torse, and a fleuron between.
    for (const side of [1, -1] as const) fleuron(f, side * (Math.PI / 2), 1.42, LAP, side * 1.4);
    for (const b of [Math.PI, Math.PI - 0.5, Math.PI + 0.5]) f.pathBar(f.line({ b, y: 1.0 }, { b, y: 1.5 }, 6), 0.035, LAP, LAP + 0.04, c.metal);
    fleuron(f, Math.PI, 0.9, THICK, Math.PI);
    return 3.5;
  },

  morion: (k) => {
    const { c } = k;
    const f = new Frame(k, LINER);
    const plate = f.liner(WINDOW, k.liner);
    // The Spanish helm: a very tall comb with ribs off it down the sides, a
    // brim swept up before and behind with finials at its points, cheek guards
    // hanging from the skull, the bevor under the window. The dome starts
    // above the window so the whole plate shows.
    f.dome(LAP, WINDOW.y1 + 0.02, k.shell);
    f.comb(-0.7, 0.7, 0.5, LAP, c.metal);
    // Ribs off the comb down the sides, stopping above the brim.
    for (const b of [0.7, -0.7, 1.4, -1.4, 2.1, -2.1]) f.pathBar(f.line({ b, y: 1.6 }, { b, y: 1.9 }, 6), 0.035, LAP, LAP + 0.04, c.metal);
    f.slab(WINDOW.phi, 1.5, -0.2, WINDOW.y1 + 0.02, 0, THICK, k.shell);
    f.slab(-1.5, -WINDOW.phi, -0.2, WINDOW.y1 + 0.02, 0, THICK, k.shell);
    f.slab(1.5, Math.PI * 2 - 1.5, -0.3, WINDOW.y1 + 0.02, 0, THICK, shade(k.shell, 0.96));
    bevor(f, WINDOW, -0.28);
    // The brim right round, narrow at the sides and swept up to a point before and behind.
    const sweep = (b: number): number => Math.max(0, Math.cos(2 * b)) ** 1.2;
    f.peak(-Math.PI, Math.PI, WINDOW.y1, 0.01, 0.1, (b) => 0.14 + 0.2 * sweep(b), (b) => 0.05 + 0.25 * sweep(b), 0.07, k.shell);
    fleuron(f, 0, WINDOW.y1, 0.36, 0, 0.255);
    fleuron(f, Math.PI, WINDOW.y1, 0.36, 0, 0.255);
    triskele(plate, k);
    return 2.6;
  },

  bellows: (k) => {
    const { c, s } = k;
    const f = new Frame(k, LINER);
    const plate = f.liner(WINDOW, k.liner);
    // A close helm whose visor has slid up along the skull: a plate lying on
    // the skull's own curve above the brow, its foot arched, ridged like a
    // bellows, a fleuron at each temple where it hangs.
    f.dome(LAP, WINDOW.y1 + 0.02, k.shell);
    cheeks(f, WINDOW, -0.3, WINDOW.y1 + 0.02);
    bevor(f, WINDOW, -0.2);
    const foot = (b: number): number => WINDOW.y1 + 0.03 + 0.08 * Math.max(0, 1 - (b / (WINDOW.phi + 0.25)) ** 2);
    f.slab(-WINDOW.phi - 0.25, WINDOW.phi + 0.25, foot, 1.92, LAP + 0.02, LAP + 0.02 + THICK, shade(k.shell, 1.06));
    for (const y of [1.55, 1.7, 1.85]) f.pathBar(f.line({ b: -WINDOW.phi - 0.22, y }, { b: WINDOW.phi + 0.22, y }, 12), 0.03, LAP + 0.02 + THICK, LAP + 0.02 + THICK + 0.04, c.metal);
    for (const side of [1, -1] as const) fleuron(f, side * (WINDOW.phi + 0.3), 1.5, LAP + 0.02, side * 1.5);
    // The sides: a scroll of two arcs in the metal about each temple, a stone at its heart.
    for (const side of [1, -1] as const) {
      const bc = side * 1.55;
      f.pathBar(f.circle(bc, 0.9, 0.22, 20), 0.03, THICK, THICK + 0.04, c.metal, true);
      f.pathBar(f.circle(bc, 0.9, 0.12, 16), 0.025, THICK, THICK + 0.05, shade(c.metal, 1.12), true);
      f.on(new THREE.IcosahedronGeometry(s * 0.05, 1), bc, 0.9, THICK + 0.05, c.contrast);
    }
    barryWavy(plate, k);
    return 2.15;
  },

  spangen: (k) => {
    const { c } = k;
    const f = new Frame(k, CONE);
    const win: Window = { phi: 0.68, y0: 0.35, y1: 1.3 };
    const plate = f.liner(win, k.liner);
    // A conical skull of four segments under raised bands, a brow band, a
    // short nasal off it, cheek flaps and a nape guard hanging from the rim.
    for (const [b0, b1] of [[-Math.PI / 4, Math.PI / 4], [Math.PI / 4, (3 * Math.PI) / 4], [(3 * Math.PI) / 4, (5 * Math.PI) / 4], [(-3 * Math.PI) / 4, -Math.PI / 4]] as const) {
      const front = b0 < 0 && b1 > 0;
      f.slab(b0, b1, front ? win.y1 : 0.3, 2.1, 0, THICK, k.shell);
    }
    f.slab(win.phi, Math.PI, 0.3, win.y1, 0, THICK, k.shell);
    f.slab(-Math.PI, -win.phi, 0.3, win.y1, 0, THICK, k.shell);
    for (const b of [Math.PI / 4, (3 * Math.PI) / 4, (-3 * Math.PI) / 4, -Math.PI / 4]) {
      f.pathBar(f.line({ b, y: 0.3 }, { b, y: 2.05 }, 10), 0.05, THICK, THICK + 0.04, c.metal);
    }
    band(f, win.y1 + 0.02, win.y1 + 0.14, THICK, THICK + 0.05);
    band(f, 0.3, 0.4, THICK, THICK + 0.05);
    f.pathBar(f.line({ b: 0, y: win.y1 + 0.02 }, { b: 0, y: win.y1 - 0.22 }, 4), 0.05, 0.0, 0.1, c.metal);
    f.slab(win.phi + 0.02, win.phi + 0.7, -0.25, 0.3, 0, THICK, shade(k.shell, 0.96));
    f.slab(-win.phi - 0.7, -win.phi - 0.02, -0.25, 0.3, 0, THICK, shade(k.shell, 0.96));
    f.slab(Math.PI - 0.9, Math.PI + 0.9, -0.3, 0.3, 0, THICK, shade(k.shell, 0.96));
    ziggurat(plate, k);
    return 2.15;
  },

  escutcheon: (k) => {
    const { c } = k;
    const f = new Frame(k, LINER);
    const win: Window = { phi: 0.66, y0: 0.35, y1: 1.4 };
    const plate = f.liner(win, k.liner);
    // A helm whose front is the house's shield: front strips beside the
    // window, chin and crown plates, a comb, the back one piece, the shield
    // filling the window edge to edge.
    const seam = 1.2;
    f.slab(win.phi, seam, -0.3, 1.5, 0, THICK, k.shell);
    f.slab(-seam, -win.phi, -0.3, 1.5, 0, THICK, k.shell);
    f.slab(-win.phi, win.phi, -0.3, win.y0, 0, THICK, k.shell);
    f.slab(-win.phi, win.phi, win.y1, 1.5, 0, THICK, k.shell);
    f.slab(seam, Math.PI * 2 - seam, -0.3, 1.5, 0, THICK, shade(k.shell, 0.96));
    f.dome(LAP, 1.45, k.shell);
    f.comb(-0.6, 0.6, 0.2, LAP, c.metal);
    for (const b of [seam, -seam]) f.pathBar(f.line({ b, y: -0.28 }, { b, y: 1.48 }, 12), 0.05, THICK, THICK + 0.04, c.metal);
    band(f, win.y1 + 0.02, win.y1 + 0.12, THICK, THICK + 0.05);
    band(f, win.y0 - 0.12, win.y0 - 0.02, THICK, THICK + 0.05);
    sunShield(plate, k);
    return 2.15;
  },

  chaperon: (k) => {
    const { c, s, base, push, side } = k;
    const f = new Frame(k, VEIL);
    f.dome(0, -Infinity, c.pale);
    f.slab(-Math.PI, Math.PI, 0.05, 0.2, -0.01, 0.02, c.contrast);
    // A medallion low over the face — rings of the contrast and the metal
    // about a boss, each open on the dominant side — the bourrelet round the
    // crown, the cornette and the patte both hanging from under it.
    const yc = 0.65;
    // Each ring open on the dominant side, the openings stepping down ring by ring.
    const open = (r: number, n: number, turn: number): Spot[] => {
      const rx = ringAt(VEIL, yc).rx;
      const path: Spot[] = [];
      for (let i = 0; i <= n; i++) {
        const a = 0.55 + ((Math.PI * 2 - 1.1) * i) / n - turn;
        path.push({ b: (side * Math.cos(a) * r) / rx, y: yc + Math.sin(a) * r });
      }
      return path;
    };
    f.pathBar(open(0.36, 28, 0), 0.06, 0.0, 0.03, c.contrast);
    f.pathBar(open(0.24, 24, 0.35), 0.05, 0.0, 0.05, c.metal);
    f.pathBar(open(0.13, 20, 0.7), 0.05, 0.0, 0.07, c.contrast);
    f.on(disc(s * 0.08, s * 0.05, 12), 0, yc, 0.08, c.metal);
    f.on(new THREE.IcosahedronGeometry(s * 0.05, 1), 0, yc, 0.12, c.contrast);
    const rollY = 1.3;
    const rollR = 0.3;
    f.pathTube(f.wind(rollY), rollR, 0.17, c.mid, true);
    // Both hangings start inside the roll and come out through its outer
    // face, then fall down the outside of the head, every point held off
    // the veil so nothing goes back in.
    const hang = (b: number, widths: readonly number[], thick: number, color: number): void => {
      push(
        strip(
          [f.at(b, rollY, 0.17), f.at(b, rollY - 0.12, 0.17 + rollR + 0.06), f.at(b, 0.6, 0.3), f.at(b, 0.05, 0.22), f.at(b, -0.35, 0.2)],
          [widths[0], widths[0], widths[1], widths[2], widths[3]],
          thick,
        ),
        color,
      );
    };
    hang(side * (Math.PI / 2), [s * 0.12, s * 0.12, s * 0.11, s * 0.1], s * 0.025, c.contrast);
    hang(-side * 0.8, [s * 0.24, s * 0.3, s * 0.32, s * 0.3], s * 0.03, c.mid);
    void base;
    return 1.9;
  },

  coif: (k) => {
    const { c, s, side } = k;
    const f = new Frame(k, VEIL);
    f.dome(0, -Infinity, c.dark);
    // A rosette low over the face — an outer ring of petals near the coif's
    // own colour, then the contrast, then the pale turned between, a boss —
    // three bands wound about the skull, parallel, a brooch at the brow with
    // plumes.
    const yc = 0.65;
    for (const [r, len, w, out, color, turn] of [
      [0.46, 0.3, 0.16, 0.015, shade(c.mid, 0.85), Math.PI / 8],
      [0.34, 0.26, 0.14, 0.03, c.contrast, 0],
      [0.22, 0.2, 0.12, 0.05, c.pale, Math.PI / 8],
    ] as const) {
      for (let i = 0; i < 8; i++) f.on(petal(s, r - len, len, w, 0.05, (i / 8) * Math.PI * 2 + turn), 0, yc, out, color);
    }
    f.on(disc(s * 0.1, s * 0.05, 12), 0, yc, 0.08, c.metal);
    f.on(new THREE.IcosahedronGeometry(s * 0.06, 1), 0, yc, 0.12, c.contrast);
    for (const [y, color] of [[1.15, c.mid], [1.38, c.pale], [1.61, c.contrast]] as const) {
      f.pathTube(f.wind(y, 0.06, 0.6), 0.1, 0.06, color, true);
    }
    // A brooch at the brow — a disc in the metal with a stone — and one plume
    // standing from it, leaning a little to the dominant side.
    f.on(disc(s * 0.12, s * 0.06, 12), 0, 1.4, 0.16, c.metal);
    f.on(new THREE.IcosahedronGeometry(s * 0.06, 1), 0, 1.4, 0.22, c.contrast);
    plume(k, f.at(0, 1.5, 0.12), side * 0.4, 0.9, [c.pale, c.contrast]);
    return 2.4;
  },
};

export function buildCityHead(kind: CityHeadKind, options: HeadOptions, parts: Part[], bones: BoneSpec[]): BuiltHead {
  const { base, size: s, neck, side } = options;
  const c: HouseColours = options.house ?? {
    dark: shade(options.cloth, 0.7),
    mid: options.cloth,
    pale: shade(options.cloth, 1.4),
    contrast: options.accent,
    metal: options.metal,
    fur: options.leather,
  };

  const push = (g: THREE.BufferGeometry, color: number, bone = 'face'): void => {
    parts.push({ geometry: g, color, bone });
  };

  // The cowl on the neck, as the villager's, in the house's dark: overlapping
  // solids centred on the neck pivot, its top inside the head's rim.
  const neckPivot = base - neck;
  const cowl: Station[] = [
    { at: [0, neckPivot - s * 0.14, 0], rx: s * 0.26, ry: s * 0.24, axis: [0, 1, 0] },
    { at: [0, neckPivot, 0], rx: s * 0.44, ry: s * 0.4, axis: [0, 1, 0] },
    { at: [0, neckPivot + neck * 0.55, 0], rx: s * 0.42, ry: s * 0.38, axis: [0, 1, 0] },
    { at: [0, base + s * 0.06, 0], rx: s * 0.4, ry: s * 0.36, axis: [0, 1, 0] },
  ];
  parts.push({ geometry: loft(cowl, 12, { start: true, end: true }), color: c.dark, bone: 'neck', name: 'cowl' });

  const kit: Kit = { s, base, c, shell: c.mid, liner: shade(c.dark, 0.85), side, push };
  const first = parts.length;
  const top = DESIGNS[kind](kit);
  for (let i = first; i < parts.length; i++) parts[i].name ??= kind;

  // The head's own centre, on the head bone: what talk turns.
  const faceY = base + s * 0.9;
  bones.push({ name: 'face', parent: 'head', at: [0, faceY, 0] });
  return { crown: base + s * top, faceY };
}
