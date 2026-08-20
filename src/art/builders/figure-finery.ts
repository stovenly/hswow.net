import * as THREE from 'three';
import type { Part } from '../assemble';
import type { Columns } from '../loft';
import { sheet } from '../sheet';
import type { Rng } from '../random';
import { blend, shade } from '../palette';
import { U_ACROMION, U_WAIST, type Body } from './figure-trunk';
import {
  atBearing,
  backColumn,
  backColumns,
  band,
  bareRows,
  cloak,
  columnBearing,
  dressedSkinOf,
  ease,
  facings,
  fringe,
  frontColumn,
  frontColumns,
  hemLip,
  pleated,
  ribbon,
  sash,
  shell,
  splitAt,
  stole,
  stuck,
  surface,
} from './figure-surface';
import type { Catalogs, Wear } from './figure-layers';

/**
 * The city catalog: what the cityfolk wear — the same trunk, the same
 * vocabulary (`figure-surface.ts`), richer cloth. A base garment cut in bands
 * and panels of the trunk's own sheet, then one over-layer, one thing at the
 * waist, one at the shoulders, and extras — every one a layer of the one
 * surface, so nothing cuts through anything.
 */

const IVORY = 0xe4d9bd;

/** Where the base garment's front panel stops, below the shoulders. */
const YOKE_U = 0.9;

/** A base garment: bands up the trunk, and how the legs go under it. */
export interface CityGarment {
  weight: number;
  /** How the hose are coloured under it. */
  hose: 'plain' | 'dark';
  /** Where the body cloth ends over the lower half. */
  hem(rng: Rng): number;
  bands(hem: number, m: Body): [number, number, number][];
  /** A panel up the front from the hem to the yoke, in this colour, as wide as `half` columns either side of centre are at the trunk’s narrowest. */
  panel?(m: Body): { color: number; half: number };
  /** Mi-parti: the body cloth's band split down the middle, the off side in this colour. */
  parti?(m: Body): number;
  /** Parts of the garment beyond its bands: buttons, dagging. */
  extra?(rng: Rng, m: Body): Part[];
}

export const CITY_GARMENTS: readonly CityGarment[] = [
  // A doublet to the waist over hose, a panel down its front.
  {
    weight: 0.22,
    hose: 'plain',
    hem: (rng) => rng.range(0.4, 0.46),
    bands: (hem, m) => [[0, hem, m.lower], [hem, hem + 0.025, m.trim], [hem + 0.025, 1, m.cloth]],
    panel: (m) => ({ color: m.accent, half: 1 }),
  },
  // A livery gown: a broad panel of the second cloth down the front, faced at the hem.
  {
    weight: 0.2,
    hose: 'plain',
    hem: (rng) => rng.range(0.14, 0.24),
    bands: (hem, m) => [[0, hem, m.lower], [hem, hem + 0.04, m.trim], [hem + 0.04, 1, m.cloth]],
    panel: (m) => ({ color: m.accent, half: 2 }),
  },
  // A houppelande: long, with a broad band of the second cloth at the hem and
  // over the shoulders, the bands often dagged along their lower edges.
  {
    weight: 0.18,
    hose: 'dark',
    hem: (rng) => rng.range(0.14, 0.22),
    bands: (hem, m) => {
      const band = blend(m.accent, m.cloth, 0.45);
      return [[0, hem, m.lower], [hem, hem + 0.09, band], [hem + 0.09, 0.86, m.cloth], [0.86, 1, band]];
    },
    extra: (rng, m) => {
      if (!rng.chance(0.65)) return [];
      const band = blend(m.accent, m.cloth, 0.45);
      const all: Columns = { from: 0, to: m.surface.sides - 1 };
      return [...fringe(m, m.hemU + 0.005, all, 0.006, 0.045, band, 0.24), ...fringe(m, 0.865, all, 0.006, 0.04, band, 0.24)];
    },
  },
  // A robe of office: dark, faced at the hem, a pale stole down the front.
  {
    weight: 0.16,
    hose: 'dark',
    hem: (rng) => rng.range(0.1, 0.16),
    bands: (hem, m) => [[0, hem, m.lower], [hem, hem + 0.04, m.trim], [hem + 0.04, 1, shade(m.cloth, 0.8)]],
    panel: (m) => ({ color: m.trim, half: 1 }),
  },
  // A mi-parti doublet: the body cloth split down the middle, the off side in
  // the accent, both seams piped in trim.
  {
    weight: 0.16,
    hose: 'plain',
    hem: (rng) => rng.range(0.38, 0.46),
    bands: (hem, m) => [[0, hem, m.lower], [hem, hem + 0.025, m.trim], [hem + 0.025, 1, m.cloth]],
    parti: (m) => m.accent,
  },
  // A peascod doublet: the front panel proud and pale, closed by a row of
  // metal buttons from the collar to the belt.
  {
    weight: 0.16,
    hose: 'plain',
    hem: (rng) => rng.range(0.42, 0.48),
    bands: (hem, m) => [[0, hem, m.lower], [hem, hem + 0.02, m.trim], [hem + 0.02, 1, m.cloth]],
    panel: (m) => ({ color: shade(m.cloth, 1.16), half: 1 }),
    extra: (rng, m) => {
      const r = 0.0075;
      // The run stops a button clear of the panel's top edge, so the last one sits on the panel.
      const T = m.surface.yOf(1) - m.surface.yOf(0);
      const low = m.hemU + 0.05;
      const top = YOKE_U - (r + 0.004) / T;
      const n = rng.int(6, 8);
      const parts: Part[] = [];
      for (let i = 0; i < n; i++) {
        const u = low + ((top - low) * i) / (n - 1);
        parts.push(stuck(m, new THREE.IcosahedronGeometry(r, 0), m.surface.yOf(u), 0, 0.014, m.metal));
      }
      return parts;
    },
  },
];

/** The base cloth in bands of one sheet, closed at the crotch and the neck, and the panel laid over it. */
export function dressCity(rng: Rng, m: Body, parts: Part[], style: CityGarment): void {
  const collarU = 0.96;
  const yokeU = YOKE_U;
  const bands = splitAt(style.bands(m.hemU, m), collarU).map((b) => (b[0] >= collarU - 1e-6 ? [b[0], b[1], m.trim] : b) as [number, number, number]);
  const us = [...new Set([...m.surface.us, ...bands.flatMap((b) => [b[0], b[1]])])].sort((a, b) => a - b);

  for (const [from, to, base] of bands) {
    if (to - from < 1e-3) continue;
    const rows = bareRows(m.surface, us.filter((u) => u >= from - 1e-6 && u <= to + 1e-6));
    if (rows.length < 2) continue;
    if (style.parti && base === m.cloth) {
      // Mi-parti: the cloth band as two half sheets, split at the column
      // boundaries nearest the centre lines — vertex S in front, S + half
      // behind — with the seams piped in trim. The dominant side wears the off colour.
      const N = m.surface.sides;
      const S = Math.ceil(0.75 * N);
      const [left, right] = m.side > 0 ? [style.parti(m), base] : [base, style.parti(m)];
      parts.push({ geometry: sheet(rows, { columns: { from: S, to: S + N / 2 - 1 } }), color: left, skin: m.surface.skin, name: 'garment mi-parti' });
      parts.push({ geometry: sheet(rows, { columns: { from: S + N / 2, to: S + N - 1 } }), color: right, skin: m.surface.skin, name: 'garment mi-parti' });
      const seam = ((S + 0.5) / N) * Math.PI * 2 - 1.5 * Math.PI;
      parts.push(ribbon(m, from + 0.01, to - 0.005, seam, 0.15, 0.004, 0.006, m.trim));
      parts.push(ribbon(m, from + 0.01, to - 0.005, seam + Math.PI, 0.15, 0.004, 0.006, m.trim));
      continue;
    }
    const caps = { start: from <= 1e-6, end: to >= 1 - 1e-6 };
    parts.push({ geometry: sheet(rows, { caps }), color: base, skin: m.surface.skin, name: `garment ${from.toFixed(2)}-${to.toFixed(2)}` });
  }

  const panel = style.panel?.(m);
  if (panel) {
    // The reach the old column split had at the trunk's narrowest, so the panel stays inside the body everywhere.
    let minW = Infinity;
    for (const u of m.surface.us) if (u >= m.hemU && u <= yokeU) minW = Math.min(minW, m.surface.extent(u).w);
    parts.push(stole(m, m.hemU + 0.02, yokeU, Math.sin(((panel.half + 0.5) * 2 * Math.PI) / m.surface.sides) * minW, panel.color));
  }

  if (style.extra) parts.push(...style.extra(rng, m));
  parts.push(hemLip(m, m.hemU, bands));
}

/** A device to wear, facing +Z: a lozenge, a roundel, or a chevron in two arms. */
function device(rng: Rng, size: number): THREE.BufferGeometry[] {
  switch (rng.int(0, 2)) {
    case 0: {
      const g = new THREE.BoxGeometry(size, size, 0.008);
      g.rotateZ(Math.PI / 4);
      return [g];
    }
    case 1: {
      const g = new THREE.IcosahedronGeometry(size * 0.6, 1);
      g.scale(1, 1, 0.3);
      return [g];
    }
    default: {
      const arms: THREE.BufferGeometry[] = [];
      for (const s of [-1, 1] as const) {
        const arm = new THREE.BoxGeometry(size * 0.7, size * 0.18, 0.008);
        // rotateZ(θ) takes +X toward +Y: each arm rises toward the middle.
        arm.rotateZ(-s * 0.6);
        arm.translate(s * size * 0.26, 0, 0);
        arms.push(arm);
      }
      return arms;
    }
  }
}

// --- over-layers ---------------------------------------------------------------------

export const CITY_OVERLAYERS: readonly Wear<Body>[] = [
  { weight: 0.18, build: () => [] },
  // A surcoat: sleeveless, open down the front, its lining showing at the edges, faced at the hem.
  {
    regions: { waist: 0.018 },
    weight: 0.2,
    build: (rng, m) => {
      const color = shade(m.accent, rng.range(0.85, 1));
      const lining = shade(m.trim, 0.95);
      const low = Math.max(0.05, m.hemU - rng.range(0.04, 0.12));
      const gap = 1;
      return [
        shell(m, low, 0.985, 0.012, color, { columns: backColumns(m.surface, gap), fold: true }),
        ...facings(m, low, 0.985, gap, 0.013, 0.018, lining),
        shell(m, low, low + 0.035, 0.016, m.trim, { columns: backColumns(m.surface, gap), fold: { start: true, end: true, to: 0.012 } }),
      ];
    },
  },
  // A tabard: a panel front and back, joined over the shoulders, a device on the chest.
  {
    regions: { waist: 0.013, neck: 0.013 },
    weight: 0.18,
    build: (rng, m) => {
      const color = shade(m.accent, rng.range(0.9, 1));
      const half = 2;
      const low = m.hemU + rng.range(-0.04, 0.02);
      const B = backColumn(m.surface);
      const rear: Columns = { from: B - half, to: B + half };
      const y = m.surface.yOf(0.72);
      return [
        shell(m, low, 0.94, 0.013, color, { columns: frontColumns(m.surface, half), fold: true }),
        shell(m, low, 0.94, 0.013, color, { columns: rear, fold: true }),
        shell(m, 0.94, 0.995, 0.013, color, { fold: true, over: true }),
        ...fringe(m, low, frontColumns(m.surface, half), 0.013, 0.05, m.trim),
        ...fringe(m, low, rear, 0.013, 0.05, m.trim),
        ...device(rng, 0.075).map((g) => stuck(m, g, y, 0, 0.019, m.trim)),
        stuck(m, new THREE.IcosahedronGeometry(0.012, 0), y, 0, 0.026, m.metal),
      ];
    },
  },
  // A cote trimmed in fur: down the front edges and round the hem.
  {
    regions: { waist: 0.022 },
    weight: 0.18,
    build: (rng, m) => {
      const color = shade(m.cloth, rng.range(0.7, 0.84));
      const low = Math.max(0.05, m.hemU - rng.range(0.02, 0.1));
      const gap = 1;
      const parts: Part[] = [shell(m, low, 0.985, 0.012, color, { columns: backColumns(m.surface, gap), fold: true })];
      parts.push(...facings(m, low, 0.985, gap, 0.013, 0.02, m.fur));
      parts.push(shell(m, low, low + 0.045, 0.02, m.fur, { columns: backColumns(m.surface, gap), fold: { start: true, end: true, to: 0.012 } }));
      return parts;
    },
  },
  // A pleated skirt off the waist over the hips, banded at the top.
  {
    regions: { waist: 0.02 },
    weight: 0.14,
    build: (rng, m) => {
      const low = Math.max(0.04, m.hemU - rng.range(0.1, 0.16));
      const top = U_WAIST + 0.03;
      const color = shade(m.accent, rng.range(0.85, 1));
      return [
        pleated(m, low, top, 0.012, 0.009, color),
        shell(m, top - 0.02, top + 0.02, 0.02, shade(color, 0.85), { caps: { start: true, end: true } }),
      ];
    },
  },
  // A short jacket with a padded roll on each shoulder.
  {
    regions: { waist: 0.013 },
    weight: 0.12,
    build: (rng, m) => {
      const color = shade(m.cloth, rng.range(0.8, 0.92));
      const parts: Part[] = [shell(m, m.hemU + 0.02, 0.985, 0.013, color, { fold: true })];
      for (const b of m.surface.obstacles) {
        // The roll rides the upper arm with the deltoid it sits on.
        const roll = new THREE.TorusGeometry(b.r * 0.82, b.r * 0.34, 6, 14);
        // TorusGeometry lies in XY; rotateX(π/2) lays it flat round the shoulder.
        roll.rotateX(Math.PI / 2);
        roll.translate(b.x, b.y + b.r * 0.4, b.z);
        parts.push({ geometry: roll, color: m.accent, bone: b.bone });
      }
      return parts;
    },
  },
  // A paned doublet: puffed panes of the accent standing in ranks round the
  // body, a darker ground showing in the grooves between.
  {
    regions: { waist: 0.022 },
    weight: 0.14,
    build: (rng, m) => {
      const low = Math.max(m.hemU + 0.01, U_WAIST - 0.02);
      const top = 0.9;
      const color = shade(m.accent, rng.range(0.9, 1.05));
      const parts: Part[] = [shell(m, low, top, 0.01, shade(m.cloth, 0.55), { fold: true })];
      for (let c = 0; c < m.surface.sides; c += 2) {
        parts.push(ribbon(m, low + 0.012, top - 0.012, columnBearing(m.surface, c), 0.22, 0.011, 0.011, color));
      }
      return parts;
    },
  },
];

// --- at the waist ----------------------------------------------------------------------

export const CITY_WAISTS: readonly Wear<Body>[] = [
  { weight: 0.1, build: () => [] },
  // A jewelled girdle: a band set with bosses, its end hanging down the front.
  {
    weight: 0.3,
    build: (rng, m) => {
      const y = m.surface.yOf(U_WAIST) + rng.range(0.005, 0.03);
      const h = 0.03;
      const over = m.layers.proudAt('waist');
      const proud = over + 0.007;
      const parts: Part[] = [band(m, y, h, proud, shade(m.trim, 0.9), over)];
      for (let c = 0; c < m.surface.sides; c += 2) {
        const boss = new THREE.IcosahedronGeometry(0.009, 0);
        parts.push(stuck(m, boss, y, columnBearing(m.surface, c), proud + 0.008, c % 4 ? m.metal : m.accent));
      }
      const T = m.surface.yOf(1) - m.surface.yOf(0);
      const u = m.surface.uOf(y - h * 0.3);
      parts.push(ribbon(m, u - rng.range(0.14, 0.2) / T, u, 0.12, 0.09, proud + 0.002, 0.007, shade(m.trim, 0.9)));
      return parts;
    },
  },
  // A hip belt slung low, a purse and a sheathed knife off it.
  {
    weight: 0.24,
    build: (rng, m) => {
      const y = m.surface.yOf(U_WAIST) - 0.02;
      const h = rng.range(0.03, 0.04);
      const over = m.layers.proudAt('waist');
      const proud = over + 0.007;
      const buckle = new THREE.BoxGeometry(h * 1.3, h * 1.1, 0.012);
      const purse = new THREE.IcosahedronGeometry(0.04, 1);
      purse.scale(0.9, 1.15, 0.7);
      purse.translate(0, -0.05, 0);
      const draw = new THREE.CylinderGeometry(0.014, 0.02, 0.02, 6);
      draw.translate(0, -0.012, 0);
      const sheath = new THREE.BoxGeometry(0.02, 0.13, 0.016);
      sheath.translate(0, -0.06, 0);
      // rotateZ(θ) takes +X toward +Y: the sheath rakes back off the hip.
      sheath.rotateZ(m.side * 0.35);
      const grip = new THREE.CylinderGeometry(0.008, 0.009, 0.045, 6);
      grip.translate(0, 0.03, 0);
      grip.rotateZ(m.side * 0.35);
      return [
        band(m, y, h, proud, m.leather, over),
        stuck(m, buckle, y, 0, proud + 0.006, m.metal),
        stuck(m, purse, y, m.side * 0.85, proud + 0.02, shade(m.leather, 1.15)),
        stuck(m, draw, y, m.side * 0.85, proud + 0.02, m.metal),
        stuck(m, sheath, y, -m.side * 0.9, proud + 0.012, shade(m.leather, 0.8)),
        stuck(m, grip, y, -m.side * 0.9, proud + 0.012, m.metal),
      ];
    },
  },
  // A wide sash with a bow at the hip.
  {
    weight: 0.2,
    build: (rng, m) => {
      const y = m.surface.yOf(U_WAIST) + rng.range(0.01, 0.04);
      const h = rng.range(0.05, 0.07);
      const over = m.layers.proudAt('waist');
      const proud = over + 0.008;
      const bearing = m.side * 1.4;
      const T = m.surface.yOf(1) - m.surface.yOf(0);
      const u = m.surface.uOf(y - h * 0.3);
      const parts: Part[] = [band(m, y, h, proud, m.accent, over)];
      for (const k of [-1, 1] as const) {
        const loop = new THREE.IcosahedronGeometry(0.03, 1);
        loop.scale(1.2, 0.7, 0.5);
        loop.translate(k * 0.03, 0.006, 0);
        loop.rotateZ(k * 0.5);
        parts.push(stuck(m, loop, y, bearing, proud + 0.012, shade(m.accent, 0.92)));
      }
      const knot = new THREE.IcosahedronGeometry(0.014, 0);
      parts.push(stuck(m, knot, y, bearing, proud + 0.02, shade(m.accent, 0.8)));
      parts.push(ribbon(m, u - rng.range(0.1, 0.14) / T, u, bearing - m.side * 0.12, 0.14, proud + 0.002, 0.008, m.accent));
      parts.push(ribbon(m, u - rng.range(0.07, 0.1) / T, u, bearing + m.side * 0.14, 0.12, proud + 0.004, 0.008, shade(m.accent, 0.9)));
      return parts;
    },
  },
  // A belt with a buckle and a long tongue hanging from it.
  {
    weight: 0.16,
    build: (rng, m) => {
      const y = m.surface.yOf(U_WAIST) + rng.range(0.005, 0.03);
      const h = rng.range(0.028, 0.036);
      const over = m.layers.proudAt('waist');
      const proud = over + 0.007;
      const buckle = new THREE.BoxGeometry(h * 1.4, h * 1.1, 0.012);
      const T = m.surface.yOf(1) - m.surface.yOf(0);
      const u = m.surface.uOf(y - h * 0.4);
      return [
        band(m, y, h, proud, m.leather, over),
        stuck(m, buckle, y, 0.05, proud + 0.006, m.metal),
        ribbon(m, u - rng.range(0.16, 0.24) / T, u, 0.16, 0.08, proud + 0.002, 0.007, m.leather),
        stuck(m, new THREE.IcosahedronGeometry(0.008, 0), y - 0.06, 0.16, proud + 0.01, m.metal),
      ];
    },
  },
];

// --- at the shoulders ---------------------------------------------------------------------

export const CITY_SHOULDERS: readonly Wear<Body>[] = [
  { weight: 0.24, build: () => [] },
  // A cloak from the shoulders, open down the whole front so the dress shows,
  // going round the deltoids; a darker shoulder cape over it, clasped at the chest.
  {
    weight: 0.2,
    // Over a bulky coat (the surcoat or the cote) no cloak goes on top: one coat at a time.
    fits: (layers) => layers.proudAt('waist') < 0.018,
    build: (rng, m) => {
      const low = Math.max(0.08, m.hemU - rng.range(0.02, 0.1));
      const waist = m.layers.proudAt('waist');
      const proud = Math.max(0.018, waist + 0.008, m.layers.proudAt('neck') + 0.006);
      const y = m.surface.yOf(1) - 0.05;
      const clasp = new THREE.IcosahedronGeometry(0.016, 1);
      clasp.scale(1.4, 1, 0.5);
      const flare = (u: number): number => 0.018 * (1 - ease((u - low) / (0.995 - low)));
      return [
        cloak(m, low, 0.995, proud, shade(m.cloth, 0.62), flare),
        cloak(m, 0.9, 0.995, proud + 0.005, m.accent, flare),
        stuck(m, clasp, y, 0, waist + 0.012, m.metal),
        stuck(m, new THREE.IcosahedronGeometry(0.007, 0), y, 0, waist + 0.024, m.trim),
      ];
    },
  },
  // A baldric from one shoulder to the other hip, a badge where it crosses the chest.
  {
    weight: 0.14,
    build: (_rng, m) => {
      const proud = m.layers.proudAt('waist') + 0.006;
      const y = m.surface.yOf(0.68);
      const badge = new THREE.IcosahedronGeometry(0.02, 1);
      badge.scale(1, 1, 0.4);
      return [
        // Up the front from the off hip over the shoulder point, then down the back to the same hip.
        sash(m, [U_WAIST + 0.06, -m.side * 1.25], [0.91, m.side * 1.57], 0.2, proud, 0.007, m.trim, 12),
        sash(m, [0.91, m.side * 1.57], [U_WAIST + 0.06, m.side * (2 * Math.PI - 1.89)], 0.2, proud, 0.007, m.trim, 12),
        stuck(m, badge, y, m.side * 0.2, proud + 0.008, m.metal),
        stuck(m, new THREE.IcosahedronGeometry(0.008, 0), y, m.side * 0.2, proud + 0.016, m.accent),
      ];
    },
  },
  // A rolled hood-band at the neck with its liripipe hanging down the back.
  {
    weight: 0.1,
    build: (rng, m) => {
      const y = m.surface.yOf(1) - 0.016;
      const T = m.surface.yOf(1) - m.surface.yOf(0);
      const u = m.surface.uOf(y - 0.012);
      const waist = m.layers.proudAt('waist');
      return [
        band(m, y, 0.034, waist + m.layers.proudAt('neck') + 0.01, m.accent, waist),
        ribbon(m, u - rng.range(0.28, 0.4) / T, u, Math.PI + m.side * 0.1, 0.16, waist + 0.006, 0.01, m.accent),
      ];
    },
  },
];

// --- extras --------------------------------------------------------------------------------

export const CITY_EXTRAS: readonly Wear<Body>[] = [
  // A scroll tucked in the belt.
  {
    weight: 0.2,
    build: (_rng, m) => {
      const y = m.surface.yOf(U_WAIST);
      const scroll = new THREE.CylinderGeometry(0.014, 0.014, 0.12, 7);
      // rotateZ(θ) takes +Y toward −X: the scroll rakes across the belt.
      scroll.rotateZ(m.side * 0.5);
      const tie = new THREE.CylinderGeometry(0.016, 0.016, 0.012, 7);
      tie.rotateZ(m.side * 0.5);
      const proud = m.layers.proudAt('waist') + 0.03;
      return [
        stuck(m, scroll, y, m.side * 0.55, proud, IVORY),
        stuck(m, tie, y, m.side * 0.55, proud, m.accent),
      ];
    },
  },
  // A purse with keys on a ring beside it.
  {
    weight: 0.18,
    build: (_rng, m) => {
      const y = m.surface.yOf(0.24);
      const parts: Part[] = [];
      const purse = new THREE.IcosahedronGeometry(0.038, 1);
      purse.scale(0.9, 1.1, 0.7);
      parts.push(stuck(m, purse, y, -m.side * 0.9, 0.032, m.accent));
      const ring = new THREE.TorusGeometry(0.012, 0.003, 4, 10);
      parts.push(stuck(m, ring, y + 0.04, -m.side * 0.65, 0.028, m.metal));
      for (let i = 0; i < 3; i++) {
        const key = new THREE.BoxGeometry(0.006, 0.05, 0.004);
        key.translate((i - 1) * 0.008, -0.03, 0);
        key.rotateZ((i - 1) * 0.15);
        parts.push(stuck(m, key, y + 0.04, -m.side * 0.65, 0.028, shade(m.metal, 0.9)));
        const bow = new THREE.IcosahedronGeometry(0.006, 0);
        bow.translate((i - 1) * 0.008 * 1.6, -0.056, 0);
        parts.push(stuck(m, bow, y + 0.04, -m.side * 0.65, 0.028, shade(m.metal, 0.9)));
      }
      return parts;
    },
  },
  // A paternoster: a loop of beads off the girdle, a gaud — a medal in a ring — at the bottom.
  {
    weight: 0.16,
    build: (rng, m) => {
      const parts: Part[] = [];
      const n = 16;
      const dark = rng.chance(0.5) ? shade(m.accent, 0.6) : shade(m.cloth, 0.5);
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const bearing = m.side * (0.9 + 0.3 * Math.sin(Math.PI * 2 * t));
        const u = U_WAIST - 0.02 - 0.16 * Math.sin(Math.PI * t);
        const [x, y, z] = surface(m, u, atBearing(bearing), 0.02);
        const bead = new THREE.IcosahedronGeometry(i % 5 === 0 ? 0.008 : 0.006, 0);
        bead.translate(x, y, z);
        parts.push({ geometry: bead, color: i % 5 === 0 ? m.metal : dark, skin: dressedSkinOf(m, 0.02) });
      }
      const y = m.surface.yOf(U_WAIST - 0.19);
      const medal = new THREE.CylinderGeometry(0.011, 0.011, 0.004, 8);
      // rotateX(π/2) takes the drum's +Y axis to +Z, the outward normal: the medal lies flat on the hip.
      medal.rotateX(Math.PI / 2);
      medal.translate(0, -0.02, 0);
      const ring = new THREE.TorusGeometry(0.014, 0.0025, 4, 12);
      ring.translate(0, -0.02, 0);
      parts.push(stuck(m, medal, y, m.side * 0.9, 0.02, m.accent));
      parts.push(stuck(m, ring, y, m.side * 0.9, 0.02, m.metal));
      return parts;
    },
  },
  // A pomander on a chain off the girdle.
  {
    weight: 0.14,
    build: (rng, m) => {
      const parts: Part[] = [];
      const bearing = -m.side * 0.55;
      const T = m.surface.yOf(1) - m.surface.yOf(0);
      const top = U_WAIST + 0.01;
      const drop = rng.range(0.08, 0.11) / T;
      for (let i = 0; i <= 6; i++) {
        const u = top - (drop * i) / 6;
        const [x, y, z] = surface(m, u, atBearing(bearing), 0.022);
        const link = new THREE.IcosahedronGeometry(0.005, 0);
        link.translate(x, y, z);
        parts.push({ geometry: link, color: m.metal, skin: dressedSkinOf(m, 0.022) });
      }
      const y = m.surface.yOf(top - drop);
      const ball = new THREE.IcosahedronGeometry(0.02, 1);
      ball.translate(0, -0.02, 0);
      parts.push(stuck(m, ball, y, bearing, 0.028, m.metal));
      const belt = new THREE.TorusGeometry(0.02, 0.003, 4, 12);
      belt.rotateX(Math.PI / 2);
      belt.translate(0, -0.02, 0);
      parts.push(stuck(m, belt, y, bearing, 0.028, m.accent));
      return parts;
    },
  },
  // Fringe off the shoulder line, round the back and sides, in the trim.
  {
    weight: 0.1,
    build: (rng, m) => fringe(m, U_ACROMION + 0.04, { from: frontColumn(m.surface) + 3, to: frontColumn(m.surface) + m.surface.sides - 3 }, 0.012, rng.range(0.035, 0.05), m.trim),
  },
];

/** The whole city dress, one entry per slot: they carry more than a villager. */
export const CITY_CATALOGS: Catalogs<Body> = {
  overlayers: CITY_OVERLAYERS,
  waists: CITY_WAISTS,
  shoulders: CITY_SHOULDERS,
  extras: CITY_EXTRAS,
  extraOdds: [0.1, 0.35, 0.6],
};
