import * as THREE from 'three';
import type { Part } from '../assemble';
import { loft, ruffle, type Columns, type Station } from '../loft';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { sheet, type Vec3 } from '../sheet';
import type { Rng } from '../random';
import { blend, shade } from '../palette';
import { TRUNK_SIDES, TRUNK_US, U_ACROMION, U_WAIST, ease, type Trunk } from './figure-trunk';

/**
 * What a villager wears on its trunk. Every garment is a **layer**: the
 * trunk's own surface taken outward by a thickness, over a run of heights and
 * a run of columns, so a coat over a shirt over the body are three nested
 * copies of one surface and cannot cut through each other. Straps, fringe,
 * beads and bags are placed off the same surface. Colour boundaries are rows
 * and columns of the sheet — never a threshold — see `art/loft`'s `Columns`.
 *
 * An outfit is: the base cloth in bands (shirt over the lower half, cut by a
 * style), one over-layer, one thing at the waist, one thing at the shoulders,
 * and a few extras. Nothing here is a skirt: no layer stands further off the
 * body than the legs stand out under it.
 */

export interface Cloths {
  cloth: number;
  lower: number;
  accent: number;
}

/** A ball the garments have to go round: the deltoid on each shoulder. */
export interface Ball {
  x: number;
  y: number;
  z: number;
  r: number;
}

/** What the wear builders get. */
export interface Body extends Cloths {
  trunk: Trunk;
  hide: number;
  leather: number;
  metal: number;
  side: 1 | -1;
  /** The deltoids, centred on the shoulder pivots, which every layer wraps. */
  deltoids: readonly Ball[];
  /** How far off the trunk the outermost layer over the waist stands. */
  layer: number;
  /** The same at the neck, above the shoulders: what a collar or ruff goes over. */
  neck: number;
  /** Where the shirt ends over the lower half. */
  hemU: number;
  /** Edging: what a hem, a cuff or a collar is faced in. */
  trim: number;
  /** Fur, as a colour. */
  fur: number;
}

/**
 * The dressed surface: the trunk `proud` off itself, taken out further where
 * a deltoid stands past it at that height, so a garment goes over the
 * shoulder rather than through it. The deltoids are centred on their pivots,
 * so this holds however the arms move. The arm below the ball is not wrapped:
 * a tube cannot go round it, so the arm is hung far enough out to clear the
 * thickest layer instead (`figure.ts`).
 */
export function surface(m: Body, u: number, bearing: number, proud = 0): Vec3 {
  const p = m.trunk.point(u, bearing, proud);
  const y = p[1];
  const cz = m.trunk.extent(u).cz;
  let dx = p[0];
  let dz = p[2] - cz;
  const rt = Math.hypot(dx, dz);
  if (rt < 1e-9) return p;
  dx /= rt;
  dz /= rt;
  let r = rt;
  for (const b of m.deltoids) {
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

/** Rows of the dressed surface at these heights. */
export function rowsOf(m: Body, us: readonly number[], proud = 0, flare?: (u: number) => number): Vec3[][] {
  return us.map((u) => {
    const p = proud + (flare ? flare(u) : 0);
    const row: Vec3[] = [];
    for (let i = 0; i < TRUNK_SIDES; i++) row.push(surface(m, u, ((i + 0.5) / TRUNK_SIDES) * Math.PI * 2, p));
    return row;
  });
}

/**
 * A closed strap round the trunk at a height, its edges drawn in toward the
 * layer beneath (`m.layer`) so the top and bottom are a bevel and not a shelf.
 */
export function band(m: Body, y: number, height: number, proud: number, color: number): Part {
  const u0 = m.trunk.uOf(y - height / 2);
  const u1 = m.trunk.uOf(y + height / 2);
  const bevel = (u1 - u0) * 0.28;
  const drop = Math.max(0, proud - m.layer) * 0.6;
  const rows = rowsOf(m, [u0, u0 + bevel, u1 - bevel, u1], proud, (u) => (u <= u0 || u >= u1 ? -drop : 0));
  return { geometry: sheet(rows, { caps: { start: true, end: true } }), color, skin: m.trunk.skin };
}

/**
 * A layer of the trunk between two heights, `proud` off it. Full ring, or a
 * run of columns; open at the ends unless a cap is asked for. `fold` turns
 * the ends back down onto the layer beneath — `to`, the stand-off of that
 * layer, the trunk itself by default — so an edge is a hem and not a lip you
 * can see under or into.
 *
 * A layer lies on the trunk and stops at the arms: every quad that would
 * fall inside a deltoid is left out, which cuts an armhole, and the layer is
 * lined so the hole shows cloth from below. A shoulder covering that is meant
 * to go over the arm asks for `over`, and is taken out round the deltoids
 * instead.
 */
export function shell(
  m: Body,
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
  const inner = TRUNK_US.filter((u) => u > u0 + 1e-6 && u < u1 - 1e-6);
  const us = [
    u0,
    ...(foldStart ? [u0 + 0.008] : []),
    ...inner.filter((u) => (!foldStart || u > u0 + 0.008) && (!foldEnd || u < u1 - 0.008)),
    ...(foldEnd ? [u1 - 0.008] : []),
    u1,
  ];
  const flare = (u: number): number =>
    ((foldStart && u <= u0) || (foldEnd && u >= u1) ? -(proud - foldTo) - 0.0004 : 0) + (o.flare ? o.flare(u) : 0);
  if (o.over) return { geometry: sheet(rowsOf(m, us, proud, flare), { caps: o.caps, columns: o.columns }), color, skin: m.trunk.skin };
  const rows = m.trunk.rows(us, proud, flare);
  const inArm = (s: number, c: number): boolean => {
    const [x, y, z] = rows[s][c % TRUNK_SIDES];
    for (const b of m.deltoids) {
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
  const lining = sheet(m.trunk.rows(us, proud - 0.003, flare).reverse(), { columns: o.columns, skip: (s, c) => skip(last - s, c) });
  const geometry = mergeGeometries([outer, lining], false);
  if (!geometry) throw new Error('shell: lining did not merge');
  outer.dispose();
  lining.dispose();
  return { geometry, color, skin: m.trunk.skin };
}

/**
 * A layer that hangs open at the bottom: an outer face, a lining, a hem
 * joining them, and a top. Rows run down the lining, across the hem and up the
 * outside, so every face points the right way and there is no disc across the
 * inside for the shoulders to cut through.
 */
export function cape(m: Body, u0: number, u1: number, proud: number, thick: number, color: number, flare?: (u: number) => number): Part {
  const us = [u0, ...TRUNK_US.filter((u) => u > u0 + 1e-6 && u < u1 - 1e-6), u1];
  const outer = rowsOf(m, us, proud, flare);
  const inner = rowsOf(m, us, proud - thick, flare).reverse();
  return { geometry: sheet([...inner, ...outer], { caps: { start: false, end: true } }), color, skin: m.trunk.skin };
}

/** Bearing (radians from +Z toward +X) to the trunk's ring parameter. */
const at = (bearing: number): number => 1.5 * Math.PI + bearing;
export const atBearing = at;

/** A small thing set on the dressed surface at a height and bearing, facing out. */
export function stuck(m: Body, geometry: THREE.BufferGeometry, y: number, bearing: number, proud: number): THREE.BufferGeometry {
  const [x, py, z] = surface(m, m.trunk.uOf(y), at(bearing), proud);
  // rotateY(bearing) takes +Z to (sin, 0, cos): the piece faces out along its bearing.
  geometry.rotateY(bearing);
  geometry.translate(x, py, z);
  return geometry;
}

/** The centre bearing of column `c` of the trunk. Vertex i sits at (i + ½)·2π/N. */
export const columnBearing = (c: number): number => ((c + 1) / TRUNK_SIDES) * Math.PI * 2 - 1.5 * Math.PI;

/** The column the front centre falls in, so a centred panel is `half` columns either side of it. */
export const FRONT_COLUMN = Math.floor(0.75 * TRUNK_SIDES - 0.5);
const BACK_COLUMN = FRONT_COLUMN + TRUNK_SIDES / 2;
export const frontColumns = (half: number): Columns => ({ from: FRONT_COLUMN - half, to: FRONT_COLUMN + half });
export const backColumns = (half: number): Columns => ({ from: FRONT_COLUMN + half + 1, to: FRONT_COLUMN - half - 1 + TRUNK_SIDES });
/** The columns opposite a run of front columns. */
const rearColumns = (half: number): Columns => ({ from: BACK_COLUMN - half, to: BACK_COLUMN + half });

/**
 * A ribbon lying on the dressed surface from `u0` up to `u1` at a bearing:
 * `width` radians across, `thick` deep. Closed, so it reads as cloth from
 * any angle, and it follows the body's curve rather than cutting its chord.
 */
export function ribbon(m: Body, u0: number, u1: number, bearing: number, width: number, proud: number, thick: number, color: number): Part {
  const us = [u0, ...TRUNK_US.filter((u) => u > u0 + 1e-6 && u < u1 - 1e-6), u1];
  // Counter-clockwise seen from above, as a trunk row is, so the faces point out.
  const rows = us.map((u): Vec3[] => [
    surface(m, u, at(bearing - width / 2), proud),
    surface(m, u, at(bearing - width / 2), proud + thick),
    surface(m, u, at(bearing + width / 2), proud + thick),
    surface(m, u, at(bearing + width / 2), proud),
  ]);
  return { geometry: sheet(rows, { caps: { start: true, end: true } }), color, skin: m.trunk.skin };
}

/**
 * Strips hanging from a line round the trunk at `u`, one per column in the
 * run: fringe on a hem or a yoke seam.
 */
export function fringe(m: Body, u: number, columns: Columns, proud: number, length: number, color: number): Part[] {
  const parts: Part[] = [];
  const drop = length / (m.trunk.top - m.trunk.bottom);
  for (let c = columns.from; c <= columns.to; c++) {
    parts.push(ribbon(m, u - drop, u, columnBearing(c), 0.11, proud, 0.005, color));
  }
  return parts;
}

/**
 * The garment styles: the base cloth in bands up the trunk, chin to crotch, as
 * (from, to, colour). `bib` may take a panel up the front; `coat` always does.
 */
interface Garment {
  weight: number;
  bib?: boolean;
  coat?: boolean;
  bands(rng: Rng, hem: number, c: Cloths): [number, number, number][];
}

const GARMENTS: readonly Garment[] = [
  // A shirt to the hem and the lower half under it.
  { weight: 0.3, bib: true, bands: (_rng, hem, c) => [[0, hem, c.lower], [hem, 1, c.cloth]] },
  // A yoke across the shoulders.
  {
    weight: 0.2,
    bands: (rng, hem, c) => {
      const shoulder = rng.range(0.78, 0.86);
      return [[0, hem, c.lower], [hem, shoulder, c.cloth], [shoulder, 1, c.accent]];
    },
  },
  // A girdle of cloth round the middle.
  {
    weight: 0.18,
    bands: (rng, hem, c) => {
      const a = hem + rng.range(0.06, 0.12);
      const b = a + rng.range(0.1, 0.16);
      return [[0, hem, c.lower], [hem, a, c.cloth], [a, b, c.accent], [b, 1, c.cloth]];
    },
  },
  // An open coat: the shirt shows in a strip up the front.
  { weight: 0.18, coat: true, bands: (_rng, hem, c) => [[0, hem, c.lower], [hem, 1, shade(c.cloth, 0.72)]] },
  // A long tunic with a trimmed hem, hanging over the hips.
  {
    weight: 0.14,
    bands: (rng, hem, c) => {
      const low = hem * 0.55;
      const trim = low + rng.range(0.05, 0.08);
      return [[0, low, c.lower], [low, trim, c.accent], [trim, 1, c.cloth]];
    },
  },
];

export function splitAt(bands: [number, number, number][], t: number): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (const b of bands) {
    if (t > b[0] + 1e-3 && t < b[1] - 1e-3) out.push([b[0], t, b[2]], [t, b[1], b[2]]);
    else out.push(b);
  }
  return out;
}

export function pickWeighted<T extends { weight: number }>(rng: Rng, table: readonly T[]): T {
  let roll = rng() * table.reduce((sum, t) => sum + t.weight, 0);
  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) return entry;
  }
  return table[0];
}

/**
 * The base cloth: the trunk's own skin, in bands and panels of one sheet over
 * shared rows, closed at the crotch and the neck.
 */
export function dressBase(rng: Rng, m: Body, parts: Part[], collar = shade(m.leather, 0.9)): void {
  const style = pickWeighted(rng, GARMENTS);
  const panel = style.coat === true || (style.bib === true && rng.chance(0.45));
  const panelColor = style.coat === true ? m.cloth : m.accent;
  const half = style.coat === true ? 2 : rng.int(1, 2);
  // The collar is a colour of the same sheet, not a piece laid over it:
  // nothing sits on the shoulder slope to be seen edge-on.
  const collarU = 0.96;
  const bands = splitAt(panel ? splitAt(style.bands(rng, m.hemU, m), 0.9) : style.bands(rng, m.hemU, m), collarU)
    .map((b) => (b[0] >= collarU - 1e-6 ? [b[0], b[1], collar] : b) as [number, number, number]);
  const us = [...new Set([...TRUNK_US, ...bands.flatMap((b) => [b[0], b[1]])])].sort((a, b) => a - b);

  for (const [from, to, base] of bands) {
    if (to - from < 1e-3) continue;
    const rows = m.trunk.rows(us.filter((u) => u >= from - 1e-6 && u <= to + 1e-6));
    if (rows.length < 2) continue;
    // A capped ring is never split into columns: a partial ring cannot be closed by a fan.
    const caps = { start: from <= 1e-6, end: to >= 1 - 1e-6 };
    if (panel && from >= m.hemU - 1e-6 && !caps.end && !caps.start) {
      parts.push({ geometry: sheet(rows, { columns: frontColumns(half) }), color: panelColor, skin: m.trunk.skin, name: `garment panel ${from.toFixed(2)}-${to.toFixed(2)}` });
      parts.push({ geometry: sheet(rows, { columns: backColumns(half) }), color: base, skin: m.trunk.skin, name: `garment back ${from.toFixed(2)}-${to.toFixed(2)}` });
    } else {
      parts.push({ geometry: sheet(rows, { caps }), color: base, skin: m.trunk.skin, name: `garment ${from.toFixed(2)}-${to.toFixed(2)}` });
    }
  }

  // The hem's lip: the shirt is a layer over the lower half, not a colour change.
  const lipH = 0.03;
  const lipColor = shade(bands[1] ? bands[1][2] : m.cloth, 0.86);
  parts.push(shell(m, m.hemU - lipH * 0.4, m.hemU + lipH * 0.6, 0.004, lipColor, {
    caps: { start: true, end: true },
    flare: (u) => 0.006 * (1 - ease((u - (m.hemU - lipH * 0.4)) / lipH)),
  }));
}

// --- over-layers ---------------------------------------------------------------------

export interface Wear {
  weight: number;
  /** How far off the trunk the piece stands at the waist, for what goes over it. */
  proud?: number;
  build(rng: Rng, m: Body): Part[];
}

/** One garment worn over the shirt. */
export const OVERLAYERS: readonly Wear[] = [
  { weight: 0.3, build: () => [] },
  // A vest, open down the front, up to the neck.
  {
    proud: 0.016,
    weight: 0.2,
    build: (rng, m) => {
      const color = shade(m.accent, rng.range(0.8, 0.95));
      const gap = rng.int(1, 2);
      return [
        shell(m, m.hemU + 0.04, 0.985, 0.011, color, { columns: backColumns(gap), fold: true }),
        // Its edges, turned back a little further out.
        shell(m, m.hemU + 0.04, 0.985, 0.016, shade(color, 0.86), { columns: { from: FRONT_COLUMN - gap - 1, to: FRONT_COLUMN - gap - 1 }, fold: { start: true, end: true, to: 0.011 } }),
        shell(m, m.hemU + 0.04, 0.985, 0.016, shade(color, 0.86), { columns: { from: FRONT_COLUMN + gap + 1, to: FRONT_COLUMN + gap + 1 }, fold: { start: true, end: true, to: 0.011 } }),
      ];
    },
  },
  // A wrap coat: one front lapped over the other, up to the neck.
  {
    proud: 0.024,
    weight: 0.18,
    build: (rng, m) => {
      const color = shade(m.cloth, rng.range(0.66, 0.8));
      const low = Math.max(0.05, m.hemU - 0.16);
      // The dominant side's front laps over the other; its edge column is a shade darker.
      const over: Columns = m.side > 0 ? { from: FRONT_COLUMN - 3, to: FRONT_COLUMN + 1 } : { from: FRONT_COLUMN - 1, to: FRONT_COLUMN + 3 };
      const edge = m.side > 0 ? FRONT_COLUMN - 3 : FRONT_COLUMN + 3;
      return [
        shell(m, low, 0.985, 0.011, color, { fold: true }),
        shell(m, low, 0.985, 0.02, color, { columns: over, fold: { start: true, end: true, to: 0.011 } }),
        shell(m, low, 0.985, 0.024, shade(color, 0.8), { columns: { from: edge, to: edge }, fold: { start: true, end: true, to: 0.02 } }),
      ];
    },
  },
  // A tabard: a panel down the front and one down the back, joined over the shoulders.
  {
    proud: 0.013,
    weight: 0.14,
    build: (rng, m) => {
      // In the accent, but drawn toward the shirt it lies on, so the two read as one outfit.
      const color = shade(blend(m.accent, m.cloth, 0.45), rng.range(0.85, 1));
      const half = 2;
      const low = m.hemU + rng.range(-0.06, 0.02);
      m.neck = 0.013;
      return [
        shell(m, low, 0.94, 0.013, color, { columns: frontColumns(half), fold: true }),
        shell(m, low, 0.94, 0.013, color, { columns: rearColumns(half), fold: true }),
        shell(m, 0.94, 0.995, 0.013, color, { fold: true, over: true }),
        ...fringe(m, low, frontColumns(half), 0.013, 0.05, shade(color, 0.85)),
        ...fringe(m, low, rearColumns(half), 0.013, 0.05, shade(color, 0.85)),
      ];
    },
  },
  // A quilted jerkin: stitched in bands, tonal, up to the neck.
  {
    proud: 0.017,
    weight: 0.14,
    build: (rng, m) => {
      const color = shade(m.cloth, rng.range(0.78, 0.9));
      const parts: Part[] = [];
      const low = m.hemU + 0.02;
      const step = 0.065;
      let i = 0;
      for (let u = low; u < 0.985 - 1e-6; u += step, i++) {
        parts.push(shell(m, u, Math.min(u + step, 0.985), 0.013, i % 2 ? color : shade(color, 0.9), {
          flare: (v) => 0.004 * Math.sin(((v - u) / step) * Math.PI),
        }));
      }
      return parts;
    },
  },
  // A hide over-tunic with a fringed hem.
  {
    proud: 0.011,
    weight: 0.14,
    build: (rng, m) => {
      const color = shade(m.leather, rng.range(1.0, 1.2));
      const low = m.hemU + 0.03;
      m.neck = 0.011;
      return [
        shell(m, low, 0.985, 0.011, color, { fold: true }),
        ...fringe(m, low, { from: 0, to: TRUNK_SIDES - 1 }, 0.011, rng.range(0.04, 0.06), shade(color, 0.85)),
      ];
    },
  },
];

// --- at the waist ----------------------------------------------------------------------

export const WAISTS: readonly Wear[] = [
  { weight: 0.15, build: () => [] },
  // A belt with a buckle and a keeper.
  {
    weight: 0.4,
    build: (rng, m) => {
      const y = m.trunk.yOf(U_WAIST) + rng.range(0.005, 0.03);
      const h = rng.range(0.028, 0.04);
      const proud = m.layer + 0.007;
      const bone = m.trunk.boneAt(y);
      const buckle = new THREE.BoxGeometry(h * 1.4, h * 1.1, 0.012);
      const keeper = new THREE.BoxGeometry(0.014, h * 1.15, 0.014);
      return [
        band(m, y, h, proud, m.leather),
        { geometry: stuck(m, buckle, y, 0, proud + 0.006), color: m.metal, bone },
        { geometry: stuck(m, keeper, y, 0.35, proud + 0.004), color: shade(m.leather, 0.8), bone },
      ];
    },
  },
  // A sash: a broad band, tucked through itself at one hip, two ends hanging.
  {
    weight: 0.3,
    build: (rng, m) => {
      const y = m.trunk.yOf(U_WAIST) + rng.range(0.01, 0.045);
      const h = rng.range(0.045, 0.07);
      const proud = m.layer + 0.008;
      const bone = m.trunk.boneAt(y);
      const bearing = m.side * 1.4;
      // The tuck: a short length of the same band doubled over the first.
      const tuck = new THREE.BoxGeometry(h * 0.7, h * 0.8, 0.012);
      tuck.rotateZ(m.side * 0.35);
      const T = m.trunk.top - m.trunk.bottom;
      const u = m.trunk.uOf(y - h * 0.3);
      return [
        band(m, y, h, proud, m.accent),
        { geometry: stuck(m, tuck, y, bearing, proud + 0.008), color: shade(m.accent, 0.92), bone },
        // Two ends hanging down the hip, lying on it.
        ribbon(m, u - rng.range(0.1, 0.14) / T, u, bearing - m.side * 0.12, 0.16, proud + 0.002, 0.008, m.accent),
        ribbon(m, u - rng.range(0.07, 0.1) / T, u, bearing + m.side * 0.14, 0.14, proud + 0.004, 0.008, shade(m.accent, 0.9)),
      ];
    },
  },
  // A cord wound twice, with tassels off the knot.
  {
    weight: 0.25,
    build: (rng, m) => {
      const y = m.trunk.yOf(U_WAIST) + rng.range(0.01, 0.03);
      const proud = m.layer + 0.007;
      const bone = m.trunk.boneAt(y);
      const color = shade(m.accent, 0.9);
      const parts: Part[] = [band(m, y - 0.009, 0.012, proud, color), band(m, y + 0.009, 0.012, proud, color)];
      for (const k of [-1, 1]) {
        const tassel = new THREE.ConeGeometry(0.011, 0.07, 5);
        tassel.translate(k * 0.012, -0.045, 0);
        parts.push({ geometry: stuck(m, tassel, y - 0.01, m.side * 1.25, proud + 0.004), color, bone });
      }
      return parts;
    },
  },
];

// --- at the shoulders ---------------------------------------------------------------------

export const SHOULDERS: readonly Wear[] = [
  { weight: 0.42, build: () => [] },
  // A short mantle: from the neck down over the shoulders, going round the
  // deltoids and hanging open at the bottom.
  {
    weight: 0.2,
    build: (rng, m) => {
      const low = U_ACROMION - rng.range(0.06, 0.12);
      const proud = Math.max(0.016, m.neck + 0.006);
      return [cape(m, low, 0.995, proud, 0.006, m.accent, (u) => 0.012 * (1 - ease((u - low) / (0.995 - low))))];
    },
  },
  // A fur ruff round the neck, above the shoulders.
  {
    weight: 0.14,
    build: (rng, m) => {
      const low = 0.94;
      const g = shell(m, low, 0.995, m.neck + 0.004, shade(m.leather, rng.range(1.15, 1.4)), {
        caps: { start: true, end: true },
        over: true,
        flare: (u) => 0.022 * Math.sin(((u - low) / (0.995 - low)) * Math.PI),
      });
      ruffle(g.geometry, rng, 0.94, 1.08, m.trunk.yOf(0.97));
      return [g];
    },
  },
  // A blanket rolled and slung shoulder to hip, tied twice.
  {
    weight: 0.14,
    build: (rng, m) => {
      const high = m.trunk.top - 0.03;
      const low = m.trunk.yOf(U_WAIST) + 0.03;
      const r = rng.range(0.02, 0.027);
      const along = (t: number): THREE.Vector3 => {
        const y = high + (low - high) * t;
        // Round the front only: past three quarters of the way out it goes through the arms.
        const bearing = m.side * (0.7 - 1.5 * t);
        // The roll rides on the outermost layer, a whole radius off it, so it sits over the shoulder rather than in it.
        return new THREE.Vector3(...surface(m, m.trunk.uOf(y), at(bearing), m.layer + r));
      };
      const run = (from: number, to: number, rad: number, steps: number): THREE.BufferGeometry => {
        const stations: Station[] = [];
        for (let i = 0; i <= steps; i++) {
          const t = from + ((to - from) * i) / steps;
          const p = along(t);
          const a = along(Math.max(0, t - 0.04));
          const b = along(Math.min(1, t + 0.04));
          stations.push({ at: [p.x, p.y, p.z], rx: rad, ry: rad, axis: [b.x - a.x, b.y - a.y, b.z - a.z] });
        }
        return loft(stations, 6, { start: true, end: true });
      };
      return [
        { geometry: run(0, 1, r, 8), color: m.accent, skin: m.trunk.skin },
        { geometry: run(0.3, 0.38, r * 1.32, 1), color: m.leather, skin: m.trunk.skin },
        { geometry: run(0.66, 0.74, r * 1.32, 1), color: m.leather, skin: m.trunk.skin },
      ];
    },
  },
  // A scarf: a band at the top with a tail down the front.
  {
    weight: 0.1,
    build: (rng, m) => {
      // High on the neck's foot, clear of the shoulders; the tail lies on the chest.
      const y = m.trunk.top - 0.016;
      const T = m.trunk.top - m.trunk.bottom;
      const u = m.trunk.uOf(y - 0.012);
      return [
        band(m, y, 0.03, m.layer + m.neck + 0.008, m.accent),
        ribbon(m, u - rng.range(0.1, 0.17) / T, u, m.side * 0.35, 0.2, m.layer + 0.006, 0.01, m.accent),
      ];
    },
  },
];

// --- extras --------------------------------------------------------------------------------

const HORN = 0xbfae8e;

export const EXTRAS: readonly Wear[] = [
  // Pouches on the hip, one or two.
  {
    weight: 0.26,
    build: (rng, m) => {
      const parts: Part[] = [];
      const y = m.trunk.yOf(0.2);
      const bone = m.trunk.boneAt(y);
      const bearings = rng.chance(0.5) ? [m.side * 0.95] : [0.95, -0.95];
      for (const bearing of bearings) {
        const w = rng.range(0.055, 0.08);
        const pouch = new THREE.BoxGeometry(w, rng.range(0.055, 0.08), 0.045);
        const flap = new THREE.BoxGeometry(w * 1.05, 0.028, 0.05);
        flap.translate(0, 0.032, 0.002);
        parts.push({ geometry: stuck(m, pouch, y, bearing, 0.03), color: m.leather, bone });
        parts.push({ geometry: stuck(m, flap, y, bearing, 0.03), color: shade(m.leather, 0.85), bone });
      }
      return parts;
    },
  },
  // A satchel slung on one hip.
  {
    weight: 0.2,
    build: (rng, m) => {
      const y = m.trunk.yOf(0.22);
      const bone = m.trunk.boneAt(y);
      const bag = new THREE.BoxGeometry(rng.range(0.12, 0.15), rng.range(0.11, 0.14), 0.055);
      const flap = new THREE.BoxGeometry(0.13, 0.055, 0.065);
      flap.translate(0, 0.05, 0.005);
      const clasp = new THREE.BoxGeometry(0.018, 0.022, 0.01);
      clasp.translate(0, 0.018, 0.036);
      return [
        { geometry: stuck(m, bag, y, m.side * 2.0, 0.034), color: m.leather, bone },
        { geometry: stuck(m, flap, y, m.side * 2.0, 0.034), color: shade(m.leather, 0.85), bone },
        { geometry: stuck(m, clasp, y, m.side * 2.0, 0.034), color: m.metal, bone },
      ];
    },
  },
  // A pack on the back.
  {
    weight: 0.14,
    build: (rng, m) => {
      const y = m.trunk.yOf(0.68);
      const w = rng.range(0.15, 0.2);
      const h = rng.range(0.16, 0.24);
      const pack = new THREE.BoxGeometry(w, h, 0.09);
      const lid = new THREE.BoxGeometry(w * 1.05, 0.032, 0.1);
      lid.translate(0, h / 2, 0);
      const strap = new THREE.BoxGeometry(0.018, h * 0.9, 0.012);
      strap.translate(0, 0, 0.05);
      return [
        { geometry: stuck(m, pack, y, Math.PI, 0.055), color: m.leather, bone: 'chest' },
        { geometry: stuck(m, lid, y, Math.PI, 0.055), color: shade(m.leather, 0.85), bone: 'chest' },
        { geometry: stuck(m, strap, y, Math.PI, 0.055), color: shade(m.leather, 0.7), bone: 'chest' },
      ];
    },
  },
  // A water skin on the off hip.
  {
    weight: 0.16,
    build: (rng, m) => {
      const y = m.trunk.yOf(0.16);
      const skin = new THREE.IcosahedronGeometry(0.045, 1);
      skin.scale(0.8, 1.15, 0.6);
      const neck = new THREE.CylinderGeometry(0.01, 0.014, 0.03, 6);
      neck.translate(0, 0.055, 0);
      const stopper = new THREE.CylinderGeometry(0.008, 0.008, 0.012, 5);
      stopper.translate(0, 0.075, 0);
      return [
        { geometry: stuck(m, skin, y, -m.side * 2.0, 0.04), color: shade(m.leather, rng.range(1.05, 1.25)), bone: 'hips' },
        { geometry: stuck(m, neck, y, -m.side * 2.0, 0.04), color: shade(m.leather, 0.8), bone: 'hips' },
        { geometry: stuck(m, stopper, y, -m.side * 2.0, 0.04), color: HORN, bone: 'hips' },
      ];
    },
  },
  // A quiver of sticks across the back.
  {
    weight: 0.12,
    build: (rng, m) => {
      const y = m.trunk.yOf(0.62);
      const quiver = new THREE.CylinderGeometry(0.03, 0.026, 0.3, 7);
      // Leant across the back, mouth up over the shoulder.
      quiver.rotateZ(m.side * 0.35);
      const sticks = new THREE.CylinderGeometry(0.024, 0.024, 0.06, 6);
      sticks.translate(0, 0.17, 0);
      sticks.rotateZ(m.side * 0.35);
      return [
        { geometry: stuck(m, quiver, y, Math.PI, 0.05), color: m.leather, bone: 'chest' },
        { geometry: stuck(m, sticks, y, Math.PI, 0.05), color: shade(HORN, rng.range(0.7, 0.9)), bone: 'chest' },
      ];
    },
  },
  // Tokens off the waist: feathers or tassels on a cord.
  {
    weight: 0.16,
    build: (rng, m) => {
      const parts: Part[] = [];
      const y = m.trunk.yOf(U_WAIST);
      const bone = m.trunk.boneAt(y);
      const feathers = rng.chance(0.5);
      for (let i = 0; i < rng.int(2, 3); i++) {
        const bearing = m.side * (0.6 + i * 0.28);
        if (feathers) {
          const quill = new THREE.BoxGeometry(0.014, 0.075, 0.004);
          quill.translate(0, -0.05, 0);
          quill.rotateZ(m.side * 0.15);
          parts.push({ geometry: stuck(m, quill, y, bearing, 0.028), color: shade(HORN, rng.range(0.6, 0.95)), bone });
        } else {
          const tassel = new THREE.ConeGeometry(0.009, 0.06, 5);
          tassel.translate(0, -0.045, 0);
          parts.push({ geometry: stuck(m, tassel, y, bearing, 0.028), color: shade(m.accent, 0.9), bone });
        }
      }
      return parts;
    },
  },
  // Fringe off the shoulder line, round the back and sides.
  {
    weight: 0.14,
    build: (rng, m) => fringe(m, U_ACROMION + 0.04, rearColumns(3), 0.012, rng.range(0.035, 0.05), shade(m.leather, 1.1)),
  },
];

/** The extras a villager gets, and how many. */
export function wearExtras(rng: Rng, m: Body, parts: Part[]): void {
  const count = rng.chance(0.15) ? 0 : rng.chance(0.4) ? 1 : rng.chance(0.6) ? 2 : 3;
  const worn = new Set<Wear>();
  for (let i = 0; i < count; i++) {
    const wear = pickWeighted(rng, EXTRAS);
    if (worn.has(wear)) continue;
    worn.add(wear);
    parts.push(...wear.build(rng, m));
  }
}
