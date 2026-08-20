import * as THREE from 'three';
import type { Part } from '../assemble';
import type { Columns } from '../loft';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { sheet, type Vec3 } from '../sheet';
import type { Rng } from '../random';
import { shade } from '../palette';
import type { LayerStack } from './figure-layers';

/**
 * The garment vocabulary: everything clothing-shaped is built from these, over
 * one body `Surface`. Every worn piece is a **layer** of that surface — the
 * surface taken outward by a thickness, over a run of heights and a run of
 * columns — or a band, a ribbon, or a stuck thing placed off it, so a coat
 * over a shirt over the body are nested copies of one surface and cannot cut
 * through each other. Colour boundaries are rows and columns of the sheet —
 * never a threshold — see `art/loft`'s `Columns`.
 *
 * Nothing here is humanoid: the villager's trunk is the first `Surface`
 * (`figure-trunk.ts`'s adapter), and a quadruped's barrel or a dwarf's rig can
 * be another. The catalogs (`figure-wear.ts` for the countryside,
 * `figure-finery.ts` for the city) are compositions of these and add no
 * geometry of their own.
 */

export function ease(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/** A bulge the surface wraps and follows: a deltoid, a leg root. */
export interface BoneBall {
  x: number;
  y: number;
  z: number;
  r: number;
  /** What the ball rides: the bone that carries it away when the limb moves. */
  bone: string;
  /** A follower at the same pivot turned half as far, for the fade to blend through. */
  half?: string;
}

/** A body surface the vocabulary dresses: heights u = 0..1, a bearing round each. */
export interface Surface {
  /** Ring vertex count. */
  sides: number;
  /** The sample heights every layer is cut at. */
  us: readonly number[];
  /** The bare surface point at a height and bearing, `proud` off it. */
  point(u: number, bearing: number, proud?: number): Vec3;
  /** Half-width and half-depth of the section, for placing things by. */
  extent(u: number): { w: number; front: number; back: number; cz: number };
  uOf(y: number): number;
  yOf(u: number): number;
  /** Which segment a height falls on, for a rigid piece. */
  boneAt(y: number): string;
  /** The blended binding of the bare surface. */
  skin: NonNullable<Part['skin']>;
  /** What the dressed surface wraps: the balls garments go round. */
  obstacles: readonly BoneBall[];
}

/** What the vocabulary is given: the surface, the outfit's colours, a handedness. */
export interface Wearer {
  surface: Surface;
  /** The layering stack: where the outer level over each region stands. */
  layers: LayerStack;
  cloth: number;
  lower: number;
  accent: number;
  /** Edging: what a hem, a cuff or a collar is faced in. */
  trim: number;
  leather: number;
  metal: number;
  /** Fur, as a colour. */
  fur: number;
  side: 1 | -1;
}

export function pickWeighted<T extends { weight: number }>(rng: Rng, table: readonly T[]): T {
  let roll = rng() * table.reduce((sum, t) => sum + t.weight, 0);
  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) return entry;
  }
  return table[0];
}

// --- the dressed surface ---------------------------------------------------------

/**
 * The dressed surface: the bare surface `proud` off itself, taken out further
 * where an obstacle ball stands past it at that height, so a garment goes
 * over the shoulder rather than through it. The balls are centred on their
 * pivots, so this holds however the limbs move. The limb below the ball is
 * not wrapped: a tube cannot go round it, so the limb is hung far enough out
 * to clear the thickest layer instead (`figure.ts`).
 */
export function surface(m: Wearer, u: number, bearing: number, proud = 0): Vec3 {
  const p = m.surface.point(u, bearing, proud);
  const y = p[1];
  const cz = m.surface.extent(u).cz;
  let dx = p[0];
  let dz = p[2] - cz;
  const rt = Math.hypot(dx, dz);
  if (rt < 1e-9) return p;
  dx /= rt;
  dz /= rt;
  let r = rt;
  for (const b of m.surface.obstacles) {
    const rc2 = b.r * b.r - (y - b.y) * (y - b.y);
    if (rc2 <= 0) continue;
    const rc = Math.sqrt(rc2) + proud;
    // The ray from the ring's centre along (dx, dz), against the ball's slice at this height.
    const ox = -b.x;
    const oz = cz - b.z;
    const along = -(ox * dx + oz * dz);
    const disc = along * along - (ox * ox + oz * oz - rc * rc);
    if (disc <= 0) continue;
    r = Math.max(r, along + Math.sqrt(disc));
  }
  return [dx * r, y, cz + dz * r];
}

/**
 * The dressed surface's binding: the bare surface's blended weights handed
 * over to an obstacle's bone wherever the vertex stands on or near the ball —
 * grown by `over`, the piece's own stand-off, as `surface` grew it to drape
 * the piece — 1 on the grown ball, fading out half a radius beyond — so a
 * band crossing a shoulder travels with the arm and stretches smoothly into
 * the part that stays on the body. Rest pose unchanged: weights only matter
 * once bones move. Trimmed to the four largest and renormalised *here* —
 * `assemble` slices to four but normalises over the full list.
 *
 * Where the ball names a `half` follower, the fade goes arm → half → trunk:
 * a straight arm↔trunk blend under a big turn averages positions along the
 * chord of the whole arc, sinking the cloth into the ball and the limb. The
 * tent split keeps the small-angle follow equal to `w` while halving the arc
 * any one blend spans.
 */
export function dressedSkinOf(m: Wearer, over = 0): NonNullable<Part['skin']> {
  return (x, y, z) => {
    const pairs: [string, number][] = [];
    let rest = 1;
    for (const b of m.surface.obstacles) {
      const d = Math.hypot(x - b.x, y - b.y, z - b.z);
      const w = ease(1 - Math.max(0, d - b.r - over) / (0.5 * b.r));
      if (w <= 0) continue;
      if (b.half) {
        const hi = Math.max(0, 2 * w - 1);
        const mid = Math.min(2 * w, 2 - 2 * w);
        if (hi > 0) pairs.push([b.bone, hi]);
        pairs.push([b.half, mid]);
        rest -= hi + mid;
      } else {
        pairs.push([b.bone, w]);
        rest -= w;
      }
    }
    if (rest > 1e-6) for (const [bone, w] of m.surface.skin(x, y, z)) pairs.push([bone, w * rest]);
    pairs.sort((a, b) => b[1] - a[1]);
    const four = pairs.slice(0, 4);
    const total = four.reduce((sum, [, w]) => sum + w, 0);
    return four.map(([bone, w]): [string, number] => [bone, total > 0 ? w / total : 0]);
  };
}

/** Rows of the dressed surface at these heights. */
export function rowsOf(m: Wearer, us: readonly number[], proud = 0, flare?: (u: number) => number): Vec3[][] {
  return us.map((u) => {
    const p = proud + (flare ? flare(u) : 0);
    const row: Vec3[] = [];
    for (let i = 0; i < m.surface.sides; i++) row.push(surface(m, u, ((i + 0.5) / m.surface.sides) * Math.PI * 2, p));
    return row;
  });
}

/** Rows of the bare surface at these heights — what lies under the obstacles, not over them. */
export function bareRows(s: Surface, us: readonly number[], proud = 0, flare?: (u: number) => number): Vec3[][] {
  return us.map((u) => {
    const p = proud + (flare ? flare(u) : 0);
    const row: Vec3[] = [];
    for (let i = 0; i < s.sides; i++) row.push(s.point(u, ((i + 0.5) / s.sides) * Math.PI * 2, p));
    return row;
  });
}

// --- bearings and columns --------------------------------------------------------

/** Bearing (radians from +Z toward +X) to the surface's ring parameter. */
const at = (bearing: number): number => 1.5 * Math.PI + bearing;
export const atBearing = at;

/** The centre bearing of column `c` of the surface. Vertex i sits at (i + ½)·2π/N. */
export const columnBearing = (s: Surface, c: number): number => ((c + 1) / s.sides) * Math.PI * 2 - 1.5 * Math.PI;

/** The column the front centre falls in, so a centred panel is `half` columns either side of it. */
export const frontColumn = (s: Surface): number => Math.floor(0.75 * s.sides - 0.5);
export const backColumn = (s: Surface): number => frontColumn(s) + s.sides / 2;
export const frontColumns = (s: Surface, half: number): Columns => ({ from: frontColumn(s) - half, to: frontColumn(s) + half });
export const backColumns = (s: Surface, half: number): Columns => ({ from: frontColumn(s) + half + 1, to: frontColumn(s) - half - 1 + s.sides });
/** The columns opposite a run of front columns. */
export const rearColumns = (s: Surface, half: number): Columns => ({ from: backColumn(s) - half, to: backColumn(s) + half });

// --- layers, bands, ribbons ------------------------------------------------------

/**
 * A closed strap round the body at a height, its edges drawn in toward the
 * layer beneath — `over`, its stand-off — so the top and bottom are a bevel
 * and not a shelf.
 */
export function band(m: Wearer, y: number, height: number, proud: number, color: number, over = 0): Part {
  const u0 = m.surface.uOf(y - height / 2);
  const u1 = m.surface.uOf(y + height / 2);
  const bevel = (u1 - u0) * 0.28;
  const drop = Math.max(0, proud - over) * 0.6;
  const rows = rowsOf(m, [u0, u0 + bevel, u1 - bevel, u1], proud, (u) => (u <= u0 || u >= u1 ? -drop : 0));
  return { geometry: sheet(rows, { caps: { start: true, end: true } }), color, skin: dressedSkinOf(m, proud) };
}

/**
 * A layer of the body between two heights, `proud` off it. Full ring, or a
 * run of columns; open at the ends unless a cap is asked for. `fold` turns
 * the ends back down onto the layer beneath — `to`, the stand-off of that
 * layer, the body itself by default — so an edge is a hem and not a lip you
 * can see under or into.
 *
 * A layer lies on the bare surface and stops at the obstacles: every quad
 * that would fall inside a ball is left out, which cuts an armhole, and the
 * layer is lined so the hole shows cloth from below. A shoulder covering that
 * is meant to go over the arm asks for `over`, and is taken out round the
 * balls instead.
 */
export function shell(
  m: Wearer,
  u0: number,
  u1: number,
  proud: number,
  color: number,
  o: {
    columns?: Columns;
    flare?: (u: number) => number;
    caps?: { start?: boolean; end?: boolean };
    fold?: boolean | { start?: boolean; end?: boolean; to?: number };
    over?: boolean;
  } = {},
): Part {
  const foldStart = o.fold === true || (typeof o.fold === 'object' && o.fold.start === true);
  const foldEnd = o.fold === true || (typeof o.fold === 'object' && o.fold.end === true);
  const foldTo = typeof o.fold === 'object' && o.fold.to !== undefined ? o.fold.to : 0;
  const inner = m.surface.us.filter((u) => u > u0 + 1e-6 && u < u1 - 1e-6);
  const us = [
    u0,
    ...(foldStart ? [u0 + 0.008] : []),
    ...inner.filter((u) => (!foldStart || u > u0 + 0.008) && (!foldEnd || u < u1 - 0.008)),
    ...(foldEnd ? [u1 - 0.008] : []),
    u1,
  ];
  const flare = (u: number): number =>
    ((foldStart && u <= u0) || (foldEnd && u >= u1) ? -(proud - foldTo) - 0.0004 : 0) + (o.flare ? o.flare(u) : 0);
  if (o.over) return { geometry: sheet(rowsOf(m, us, proud, flare), { caps: o.caps, columns: o.columns }), color, skin: dressedSkinOf(m, proud) };
  const rows = bareRows(m.surface, us, proud, flare);
  const inArm = (s: number, c: number): boolean => {
    const [x, y, z] = rows[s][c % m.surface.sides];
    for (const b of m.surface.obstacles) {
      const r = b.r + 0.004;
      if ((x - b.x) ** 2 + (y - b.y) ** 2 + (z - b.z) ** 2 < r * r) return true;
    }
    return false;
  };
  // A quad goes only when it lies wholly in the ball; the ones crossing its
  // surface stay, so the layer runs into the shoulder and leaves no gap under the arm.
  const skip = (s: number, c: number): boolean => inArm(s, c) && inArm(s, c + 1) && inArm(s + 1, c) && inArm(s + 1, c + 1);
  const outer = sheet(rows, { caps: o.caps, columns: o.columns, skip });
  // The lining: the same sheet a little in, rows reversed so it faces inward.
  const last = rows.length - 2;
  const lining = sheet(bareRows(m.surface, us, proud - 0.003, flare).reverse(), { columns: o.columns, skip: (s, c) => skip(last - s, c) });
  const geometry = mergeGeometries([outer, lining], false);
  if (!geometry) throw new Error('shell: lining did not merge');
  outer.dispose();
  lining.dispose();
  return { geometry, color, skin: m.surface.skin };
}

/**
 * A layer that hangs open at the bottom: an outer face, a lining, a hem
 * joining them, and a top. Rows run down the lining, across the hem and up the
 * outside, so every face points the right way and there is no disc across the
 * inside for the shoulders to cut through.
 */
export function cape(m: Wearer, u0: number, u1: number, proud: number, thick: number, color: number, flare?: (u: number) => number): Part {
  const us = [u0, ...m.surface.us.filter((u) => u > u0 + 1e-6 && u < u1 - 1e-6), u1];
  const outer = rowsOf(m, us, proud, flare);
  const inner = rowsOf(m, us, proud - thick, flare).reverse();
  return { geometry: sheet([...inner, ...outer], { caps: { start: false, end: true } }), color, skin: dressedSkinOf(m, proud) };
}

/**
 * A small thing set on the dressed surface at a height and bearing, facing
 * out. The whole piece takes the dressed skin sampled once at its anchor —
 * constant weights, so it stays rigid in itself and moves with the band under
 * it, and a bow cannot shear a buckle off its belt.
 */
export function stuck(m: Wearer, geometry: THREE.BufferGeometry, y: number, bearing: number, proud: number, color: number): Part {
  const [x, py, z] = surface(m, m.surface.uOf(y), at(bearing), proud);
  // rotateY(bearing) takes +Z to (sin, 0, cos): the piece faces out along its bearing.
  geometry.rotateY(bearing);
  geometry.translate(x, py, z);
  const weights = dressedSkinOf(m, proud)(x, py, z);
  return { geometry, color, skin: () => weights };
}

/**
 * A ribbon lying on the dressed surface from `u0` up to `u1` at a bearing:
 * `width` radians across, `thick` deep. Closed, so it reads as cloth from
 * any angle, and it follows the body's curve rather than cutting its chord.
 */
export function ribbon(m: Wearer, u0: number, u1: number, bearing: number, width: number, proud: number, thick: number, color: number): Part {
  const us = [u0, ...m.surface.us.filter((u) => u > u0 + 1e-6 && u < u1 - 1e-6), u1];
  // Counter-clockwise seen from above, as a body row is, so the faces point out.
  const rows = us.map((u): Vec3[] => [
    surface(m, u, at(bearing - width / 2), proud),
    surface(m, u, at(bearing - width / 2), proud + thick),
    surface(m, u, at(bearing + width / 2), proud + thick),
    surface(m, u, at(bearing + width / 2), proud),
  ]);
  return { geometry: sheet(rows, { caps: { start: true, end: true } }), color, skin: dressedSkinOf(m, proud + thick) };
}

/**
 * Strips hanging from a line round the body at `u`, one per column in the
 * run: fringe on a hem or a yoke seam.
 */
export function fringe(m: Wearer, u: number, columns: Columns, proud: number, length: number, color: number, width = 0.11): Part[] {
  const parts: Part[] = [];
  const drop = length / (m.surface.yOf(1) - m.surface.yOf(0));
  for (let c = columns.from; c <= columns.to; c++) {
    parts.push(ribbon(m, u - drop, u, columnBearing(m.surface, c), width, proud, 0.005, color));
  }
  return parts;
}

// --- panels, sashes and open fronts ----------------------------------------------

/**
 * A front panel as a layer of its own: a stole of cloth lying proud on the
 * dressed surface from `u0` to `u1`, its edges plumb — held at a constant
 * reach either side of centre — where columns of the sheet would bow out with
 * the body.
 */
export function stole(m: Wearer, u0: number, u1: number, reach: number, color: number): Part {
  const proud = 0.004;
  const thick = 0.004;
  const us = [u0, ...m.surface.us.filter((u) => u > u0 + 1e-6 && u < u1 - 1e-6), u1];
  // The bearing where the dressed surface's x reaches the edge, by bisection: x grows with bearing round the front.
  const edge = (u: number, off: number): number => {
    let lo = 0;
    let hi = 1.35;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (surface(m, u, at(mid), off)[0] < reach) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  };
  // Each row a thin closed ring, as `ribbon`'s are, sampled across the chest
  // so the panel hugs it: inner left edge, across the outer face, inner
  // right edge, back across the inner face.
  const N = 6;
  const rows = us.map((u): Vec3[] => {
    const bOut = edge(u, proud + thick);
    const bIn = edge(u, proud);
    const row: Vec3[] = [surface(m, u, at(-bIn), proud)];
    for (let i = 0; i <= N; i++) row.push(surface(m, u, at(-bOut + (2 * bOut * i) / N), proud + thick));
    row.push(surface(m, u, at(bIn), proud));
    for (let i = 1; i < N; i++) row.push(surface(m, u, at(bIn - (2 * bIn * i) / N), proud));
    return row;
  });
  return { geometry: sheet(rows, { caps: { start: true, end: true } }), color, skin: dressedSkinOf(m, proud + thick), name: 'garment panel' };
}

/**
 * A pleated layer: the dressed surface with every other column stood further
 * out, so the sheet folds in and out round the body.
 */
export function pleated(m: Wearer, u0: number, u1: number, proud: number, depth: number, color: number): Part {
  const us = [u0, ...m.surface.us.filter((u) => u > u0 + 1e-6 && u < u1 - 1e-6), u1];
  const rows = us.map((u): Vec3[] => {
    const row: Vec3[] = [];
    // The pleats die out toward the top so the waist stays flat.
    const k = ease((u1 - u) / (u1 - u0));
    for (let i = 0; i < m.surface.sides; i++) row.push(surface(m, u, ((i + 0.5) / m.surface.sides) * Math.PI * 2, proud + (i % 2 ? depth * k : 0)));
    return row;
  });
  return { geometry: sheet(rows, { caps: { start: true, end: true } }), color, skin: dressedSkinOf(m, proud + depth) };
}

/**
 * A flat sash lying on the dressed surface from one (u, bearing) to another,
 * `width` radians across: a baldric, a chain's ribbon.
 */
export function sash(m: Wearer, from: [number, number], to: [number, number], width: number, proud: number, thick: number, color: number, steps = 10): Part {
  const rows: Vec3[][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = from[0] + (to[0] - from[0]) * t;
    const b = from[1] + (to[1] - from[1]) * t;
    // Counter-clockwise seen from above, as a body row is, so the faces point out.
    rows.push([
      surface(m, u, at(b - width / 2), proud),
      surface(m, u, at(b - width / 2), proud + thick),
      surface(m, u, at(b + width / 2), proud + thick),
      surface(m, u, at(b + width / 2), proud),
    ]);
  }
  return { geometry: sheet(rows, { caps: { start: true, end: true } }), color, skin: dressedSkinOf(m, proud + thick) };
}

/**
 * A facing down one edge of an open front: a welt on the dressed surface
 * whose edges hang plumb — at constant reach from centre — up to the yoke,
 * then turn in with the collar. Columns of the sheet bow out with the chest;
 * clothing hangs straight, so this is its own strip. `bIn`/`bOut` are the
 * bearings it closes onto at the top.
 */
export function facing(m: Wearer, u0: number, u1: number, s: 1 | -1, xIn: number, xOut: number, bIn: number, bOut: number, lo: number, hi: number, color: number): Part {
  const yoke = 0.9;
  // The bearing where the dressed surface's x reaches the edge, by bisection: x grows with bearing round the front.
  const solve = (u: number, x: number): number => {
    let a = 0;
    let b = 1.35;
    for (let i = 0; i < 24; i++) {
      const mid = (a + b) / 2;
      if (surface(m, u, at(s * mid), lo)[0] * s < x) a = mid;
      else b = mid;
    }
    return (a + b) / 2;
  };
  const us = [u0, ...m.surface.us.filter((u) => u > u0 + 1e-6 && u < u1 - 1e-6), u1];
  const rows = us.map((u): Vec3[] => {
    const k = u <= yoke ? 0 : (u - yoke) / (u1 - yoke);
    const ba = s * ((1 - k) * solve(u, xIn) + k * bIn);
    const bb = s * ((1 - k) * solve(u, xOut) + k * bOut);
    const bm = (ba + bb) / 2;
    // A thin closed ring, as `ribbon`'s are: up the near edge, across the crown,
    // down the far edge, back across the foot. On s = −1 the bearings run
    // clockwise, so the ring reverses to keep the faces outward.
    const ring: Vec3[] = [
      surface(m, u, at(ba), lo),
      surface(m, u, at(ba), hi),
      surface(m, u, at(bm), hi),
      surface(m, u, at(bb), hi),
      surface(m, u, at(bb), lo),
      surface(m, u, at(bm), lo),
    ];
    return s > 0 ? ring : ring.reverse();
  });
  return { geometry: sheet(rows, { caps: { start: true, end: true } }), color, skin: dressedSkinOf(m, hi) };
}

/** Both facings of an open front, covering the body's own edge columns wherever the chest carries them. */
export function facings(m: Wearer, u0: number, u1: number, gap: number, lo: number, hi: number, color: number): Part[] {
  const bIn = ((gap + 0.5) * 2 * Math.PI) / m.surface.sides;
  const bOut = ((gap + 1.5) * 2 * Math.PI) / m.surface.sides;
  let minE = Infinity;
  let maxE = 0;
  for (const u of m.surface.us) {
    if (u < u0 || u > 0.9) continue;
    const x = surface(m, u, at(bIn), lo)[0];
    minE = Math.min(minE, x);
    maxE = Math.max(maxE, x);
  }
  return ([1, -1] as const).map((s) => facing(m, u0, u1, s, minE - 0.004, maxE + 0.008, bIn, bOut, lo, hi, color));
}

/**
 * A cloak: a lined layer round the back of the dressed surface, open down
 * the whole front so the dress under it shows. Its edges hang plumb below
 * the yoke and close toward the collar above it; the lining pinches shut at
 * the top and the hem hangs open.
 */
export function cloak(m: Wearer, u0: number, u1: number, proud: number, color: number, flare?: (u: number) => number): Part {
  const yoke = 0.9;
  // What the opening closes to at the collar, and the plumb reach below: the
  // collar bearing's x at the narrowest the body gets over the run.
  const bTop = (2.5 * 2 * Math.PI) / m.surface.sides;
  let xEdge = Infinity;
  for (const u of m.surface.us) if (u >= u0 && u <= Math.min(yoke, u1)) xEdge = Math.min(xEdge, surface(m, u, at(bTop), proud)[0]);
  const solve = (u: number, off: number): number => {
    let a = 0;
    let b = 1.35;
    for (let i = 0; i < 24; i++) {
      const mid = (a + b) / 2;
      if (surface(m, u, at(mid), off)[0] < xEdge) a = mid;
      else b = mid;
    }
    return (a + b) / 2;
  };
  const us = [u0, ...m.surface.us.filter((u) => u > u0 + 1e-6 && u < u1 - 1e-6), u1];
  const N = 20;
  // The lining closes onto its face over the deltoids. It is bound as though
  // it stood where the face does, so depth there is depth it slides through
  // as the arm turns, and it would come out past the layer under the cloak.
  const linAt = (u: number, t: number, off: number, depth: number): number => {
    const [x, y, z] = surface(m, u, t, off);
    let w = 0;
    for (const b of m.surface.obstacles) {
      const d = Math.hypot(x - b.x, y - b.y, z - b.z);
      w = Math.max(w, ease(1 - Math.max(0, d - b.r - off) / (0.5 * b.r)));
    }
    return off - Math.max(0.0006, depth * (1 - w));
  };
  const rows = us.map((u): Vec3[] => {
    const off = proud + (flare ? flare(u) : 0);
    const depth = 0.006 * Math.min(1, (u1 - u) / 0.02);
    const lin = (t: number): number => linAt(u, t, off, depth);
    const k = u <= yoke ? 0 : (u - yoke) / (u1 - yoke);
    const bA = (1 - k) * solve(u, off) + k * bTop;
    const span = 2 * Math.PI - 2 * bA;
    // A thin C round the back: up the near edge, across the outer face, down the far edge, back across the lining.
    const row: Vec3[] = [surface(m, u, at(bA), lin(at(bA)))];
    for (let i = 0; i <= N; i++) row.push(surface(m, u, at(bA + (span * i) / N), off));
    row.push(surface(m, u, at(bA + span), lin(at(bA + span))));
    for (let i = N - 1; i >= 1; i--) {
      const t = at(bA + (span * i) / N);
      row.push(surface(m, u, t, lin(t)));
    }
    return row;
  });
  return { geometry: sheet(rows), color, skin: dressedSkinOf(m, proud) };
}

// --- the base garment's shared pieces --------------------------------------------

export function splitAt(bands: [number, number, number][], t: number): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (const b of bands) {
    if (t > b[0] + 1e-3 && t < b[1] - 1e-3) out.push([b[0], t, b[2]], [t, b[1], b[2]]);
    else out.push(b);
  }
  return out;
}

/** The hem's lip at `hemU`: the shirt is a layer over the lower half, not a colour change. */
export function hemLip(m: Wearer, hemU: number, bands: readonly (readonly [number, number, number])[]): Part {
  const lipH = 0.03;
  const lipColor = shade(bands[1] ? bands[1][2] : m.cloth, 0.86);
  return shell(m, hemU - lipH * 0.4, hemU + lipH * 0.6, 0.004, lipColor, {
    caps: { start: true, end: true },
    flare: (u) => 0.006 * (1 - ease((u - (hemU - lipH * 0.4)) / lipH)),
  });
}
