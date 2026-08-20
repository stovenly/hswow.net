import * as THREE from 'three';
import type { Part } from '../assemble';
import { loft, ruffle, type Columns, type Station } from '../loft';
import { sheet } from '../sheet';
import type { Rng } from '../random';
import { blend, shade } from '../palette';
import { U_ACROMION, U_WAIST, type Body } from './figure-trunk';
import {
  atBearing,
  backColumns,
  band,
  bareRows,
  cape,
  dressedSkinOf,
  ease,
  fringe,
  frontColumn,
  frontColumns,
  hemLip,
  pickWeighted,
  rearColumns,
  ribbon,
  shell,
  splitAt,
  stuck,
  surface,
} from './figure-surface';
import type { Catalogs, Wear } from './figure-layers';

/**
 * The countryside catalog: what a villager wears on its trunk, as
 * compositions of the garment vocabulary in `figure-surface.ts`.
 *
 * An outfit is: the base cloth in bands (shirt over the lower half, cut by a
 * style), one over-layer, one thing at the waist, one thing at the shoulders,
 * and a few extras. Nothing here is a skirt: no layer stands further off the
 * body than the legs stand out under it.
 */

/**
 * The garment styles: the base cloth in bands up the trunk, chin to crotch, as
 * (from, to, colour). `bib` may take a panel up the front; `coat` always does.
 */
interface Garment {
  weight: number;
  bib?: boolean;
  coat?: boolean;
  bands(rng: Rng, hem: number, c: Body): [number, number, number][];
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
  const us = [...new Set([...m.surface.us, ...bands.flatMap((b) => [b[0], b[1]])])].sort((a, b) => a - b);

  for (const [from, to, base] of bands) {
    if (to - from < 1e-3) continue;
    const rows = bareRows(m.surface, us.filter((u) => u >= from - 1e-6 && u <= to + 1e-6));
    if (rows.length < 2) continue;
    // A capped ring is never split into columns: a partial ring cannot be closed by a fan.
    const caps = { start: from <= 1e-6, end: to >= 1 - 1e-6 };
    if (panel && from >= m.hemU - 1e-6 && !caps.end && !caps.start) {
      parts.push({ geometry: sheet(rows, { columns: frontColumns(m.surface, half) }), color: panelColor, skin: m.surface.skin, name: `garment panel ${from.toFixed(2)}-${to.toFixed(2)}` });
      parts.push({ geometry: sheet(rows, { columns: backColumns(m.surface, half) }), color: base, skin: m.surface.skin, name: `garment back ${from.toFixed(2)}-${to.toFixed(2)}` });
    } else {
      parts.push({ geometry: sheet(rows, { caps }), color: base, skin: m.surface.skin, name: `garment ${from.toFixed(2)}-${to.toFixed(2)}` });
    }
  }

  parts.push(hemLip(m, m.hemU, bands));
}

// --- over-layers ---------------------------------------------------------------------

/** One garment worn over the shirt. */
export const OVERLAYERS: readonly Wear<Body>[] = [
  { weight: 0.3, build: () => [] },
  // A vest, open down the front, up to the neck.
  {
    regions: { waist: 0.016 },
    weight: 0.2,
    build: (rng, m) => {
      const color = shade(m.accent, rng.range(0.8, 0.95));
      const gap = rng.int(1, 2);
      const F = frontColumn(m.surface);
      return [
        shell(m, m.hemU + 0.04, 0.985, 0.011, color, { columns: backColumns(m.surface, gap), fold: true }),
        // Its edges, turned back a little further out.
        shell(m, m.hemU + 0.04, 0.985, 0.016, shade(color, 0.86), { columns: { from: F - gap - 1, to: F - gap - 1 }, fold: { start: true, end: true, to: 0.011 } }),
        shell(m, m.hemU + 0.04, 0.985, 0.016, shade(color, 0.86), { columns: { from: F + gap + 1, to: F + gap + 1 }, fold: { start: true, end: true, to: 0.011 } }),
      ];
    },
  },
  // A wrap coat: one front lapped over the other, up to the neck.
  {
    regions: { waist: 0.024 },
    weight: 0.18,
    build: (rng, m) => {
      const color = shade(m.cloth, rng.range(0.66, 0.8));
      const low = Math.max(0.05, m.hemU - 0.16);
      const F = frontColumn(m.surface);
      // The dominant side's front laps over the other; its edge column is a shade darker.
      const over: Columns = m.side > 0 ? { from: F - 3, to: F + 1 } : { from: F - 1, to: F + 3 };
      const edge = m.side > 0 ? F - 3 : F + 3;
      return [
        shell(m, low, 0.985, 0.011, color, { fold: true }),
        shell(m, low, 0.985, 0.02, color, { columns: over, fold: { start: true, end: true, to: 0.011 } }),
        shell(m, low, 0.985, 0.024, shade(color, 0.8), { columns: { from: edge, to: edge }, fold: { start: true, end: true, to: 0.02 } }),
      ];
    },
  },
  // A tabard: a panel down the front and one down the back, joined over the shoulders.
  {
    regions: { waist: 0.013, neck: 0.013 },
    weight: 0.14,
    build: (rng, m) => {
      // In the accent, but drawn toward the shirt it lies on, so the two read as one outfit.
      const color = shade(blend(m.accent, m.cloth, 0.45), rng.range(0.85, 1));
      const half = 2;
      const low = m.hemU + rng.range(-0.06, 0.02);
      return [
        shell(m, low, 0.94, 0.013, color, { columns: frontColumns(m.surface, half), fold: true }),
        shell(m, low, 0.94, 0.013, color, { columns: rearColumns(m.surface, half), fold: true }),
        shell(m, 0.94, 0.995, 0.013, color, { fold: true, over: true }),
        ...fringe(m, low, frontColumns(m.surface, half), 0.013, 0.05, shade(color, 0.85)),
        ...fringe(m, low, rearColumns(m.surface, half), 0.013, 0.05, shade(color, 0.85)),
      ];
    },
  },
  // A quilted jerkin: stitched in bands, tonal, up to the neck.
  {
    regions: { waist: 0.017 },
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
    regions: { waist: 0.011, neck: 0.011 },
    weight: 0.14,
    build: (rng, m) => {
      const color = shade(m.leather, rng.range(1.0, 1.2));
      const low = m.hemU + 0.03;
      return [
        shell(m, low, 0.985, 0.011, color, { fold: true }),
        ...fringe(m, low, { from: 0, to: m.surface.sides - 1 }, 0.011, rng.range(0.04, 0.06), shade(color, 0.85)),
      ];
    },
  },
];

// --- at the waist ----------------------------------------------------------------------

export const WAISTS: readonly Wear<Body>[] = [
  { weight: 0.15, build: () => [] },
  // A belt with a buckle and a keeper.
  {
    weight: 0.4,
    build: (rng, m) => {
      const y = m.surface.yOf(U_WAIST) + rng.range(0.005, 0.03);
      const h = rng.range(0.028, 0.04);
      const over = m.layers.proudAt('waist');
      const proud = over + 0.007;
      const buckle = new THREE.BoxGeometry(h * 1.4, h * 1.1, 0.012);
      const keeper = new THREE.BoxGeometry(0.014, h * 1.15, 0.014);
      return [
        band(m, y, h, proud, m.leather, over),
        stuck(m, buckle, y, 0, proud + 0.006, m.metal),
        stuck(m, keeper, y, 0.35, proud + 0.004, shade(m.leather, 0.8)),
      ];
    },
  },
  // A sash: a broad band, tucked through itself at one hip, two ends hanging.
  {
    weight: 0.3,
    build: (rng, m) => {
      const y = m.surface.yOf(U_WAIST) + rng.range(0.01, 0.045);
      const h = rng.range(0.045, 0.07);
      const over = m.layers.proudAt('waist');
      const proud = over + 0.008;
      const bearing = m.side * 1.4;
      // The tuck: a short length of the same band doubled over the first.
      const tuck = new THREE.BoxGeometry(h * 0.7, h * 0.8, 0.012);
      tuck.rotateZ(m.side * 0.35);
      const T = m.surface.yOf(1) - m.surface.yOf(0);
      const u = m.surface.uOf(y - h * 0.3);
      return [
        band(m, y, h, proud, m.accent, over),
        stuck(m, tuck, y, bearing, proud + 0.008, shade(m.accent, 0.92)),
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
      const y = m.surface.yOf(U_WAIST) + rng.range(0.01, 0.03);
      const over = m.layers.proudAt('waist');
      const proud = over + 0.007;
      const color = shade(m.accent, 0.9);
      const parts: Part[] = [band(m, y - 0.009, 0.012, proud, color, over), band(m, y + 0.009, 0.012, proud, color, over)];
      for (const k of [-1, 1]) {
        const tassel = new THREE.ConeGeometry(0.011, 0.07, 5);
        tassel.translate(k * 0.012, -0.045, 0);
        parts.push(stuck(m, tassel, y - 0.01, m.side * 1.25, proud + 0.004, color));
      }
      return parts;
    },
  },
];

// --- at the shoulders ---------------------------------------------------------------------

export const SHOULDERS: readonly Wear<Body>[] = [
  { weight: 0.42, build: () => [] },
  // A short mantle: from the neck down over the shoulders, going round the
  // deltoids and hanging open at the bottom.
  {
    weight: 0.2,
    build: (rng, m) => {
      const low = U_ACROMION - rng.range(0.06, 0.12);
      const proud = Math.max(0.016, m.layers.proudAt('neck') + 0.006);
      return [cape(m, low, 0.995, proud, 0.006, m.accent, (u) => 0.012 * (1 - ease((u - low) / (0.995 - low))))];
    },
  },
  // A fur ruff round the neck, above the shoulders.
  {
    weight: 0.14,
    build: (rng, m) => {
      const low = 0.94;
      const g = shell(m, low, 0.995, m.layers.proudAt('neck') + 0.004, shade(m.leather, rng.range(1.15, 1.4)), {
        caps: { start: true, end: true },
        over: true,
        flare: (u) => 0.022 * Math.sin(((u - low) / (0.995 - low)) * Math.PI),
      });
      ruffle(g.geometry, rng, 0.94, 1.08, m.surface.yOf(0.97));
      return [g];
    },
  },
  // A blanket rolled and slung shoulder to hip, tied twice.
  {
    weight: 0.14,
    build: (rng, m) => {
      const high = m.surface.yOf(1) - 0.03;
      const low = m.surface.yOf(U_WAIST) + 0.03;
      const r = rng.range(0.02, 0.027);
      const along = (t: number): THREE.Vector3 => {
        const y = high + (low - high) * t;
        // Round the front only: past three quarters of the way out it goes through the arms.
        const bearing = m.side * (0.7 - 1.5 * t);
        // The roll rides on the outermost layer, a whole radius off it, so it sits over the shoulder rather than in it.
        return new THREE.Vector3(...surface(m, m.surface.uOf(y), atBearing(bearing), m.layers.proudAt('waist') + r));
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
      const skin = dressedSkinOf(m);
      return [
        { geometry: run(0, 1, r, 8), color: m.accent, skin },
        { geometry: run(0.3, 0.38, r * 1.32, 1), color: m.leather, skin },
        { geometry: run(0.66, 0.74, r * 1.32, 1), color: m.leather, skin },
      ];
    },
  },
  // A scarf: a band at the top with a tail down the front.
  {
    weight: 0.1,
    build: (rng, m) => {
      // High on the neck's foot, clear of the shoulders; the tail lies on the chest.
      const y = m.surface.yOf(1) - 0.016;
      const T = m.surface.yOf(1) - m.surface.yOf(0);
      const u = m.surface.uOf(y - 0.012);
      const waist = m.layers.proudAt('waist');
      return [
        band(m, y, 0.03, waist + m.layers.proudAt('neck') + 0.008, m.accent, waist),
        ribbon(m, u - rng.range(0.1, 0.17) / T, u, m.side * 0.35, 0.2, waist + 0.006, 0.01, m.accent),
      ];
    },
  },
];

// --- extras --------------------------------------------------------------------------------

const HORN = 0xbfae8e;

export const EXTRAS: readonly Wear<Body>[] = [
  // Pouches on the hip, one or two.
  {
    weight: 0.26,
    build: (rng, m) => {
      const parts: Part[] = [];
      const y = m.surface.yOf(0.2);
      const bearings = rng.chance(0.5) ? [m.side * 0.95] : [0.95, -0.95];
      for (const bearing of bearings) {
        const w = rng.range(0.055, 0.08);
        const pouch = new THREE.BoxGeometry(w, rng.range(0.055, 0.08), 0.045);
        const flap = new THREE.BoxGeometry(w * 1.05, 0.028, 0.05);
        flap.translate(0, 0.032, 0.002);
        parts.push(stuck(m, pouch, y, bearing, 0.03, m.leather));
        parts.push(stuck(m, flap, y, bearing, 0.03, shade(m.leather, 0.85)));
      }
      return parts;
    },
  },
  // A satchel slung on one hip.
  {
    weight: 0.2,
    build: (rng, m) => {
      const y = m.surface.yOf(0.22);
      const bag = new THREE.BoxGeometry(rng.range(0.12, 0.15), rng.range(0.11, 0.14), 0.055);
      const flap = new THREE.BoxGeometry(0.13, 0.055, 0.065);
      flap.translate(0, 0.05, 0.005);
      const clasp = new THREE.BoxGeometry(0.018, 0.022, 0.01);
      clasp.translate(0, 0.018, 0.036);
      return [
        stuck(m, bag, y, m.side * 2.0, 0.034, m.leather),
        stuck(m, flap, y, m.side * 2.0, 0.034, shade(m.leather, 0.85)),
        stuck(m, clasp, y, m.side * 2.0, 0.034, m.metal),
      ];
    },
  },
  // A pack on the back.
  {
    weight: 0.14,
    build: (rng, m) => {
      const y = m.surface.yOf(0.68);
      const w = rng.range(0.15, 0.2);
      const h = rng.range(0.16, 0.24);
      const pack = new THREE.BoxGeometry(w, h, 0.09);
      const lid = new THREE.BoxGeometry(w * 1.05, 0.032, 0.1);
      lid.translate(0, h / 2, 0);
      const strap = new THREE.BoxGeometry(0.018, h * 0.9, 0.012);
      strap.translate(0, 0, 0.05);
      return [
        stuck(m, pack, y, Math.PI, 0.055, m.leather),
        stuck(m, lid, y, Math.PI, 0.055, shade(m.leather, 0.85)),
        stuck(m, strap, y, Math.PI, 0.055, shade(m.leather, 0.7)),
      ];
    },
  },
  // A water skin on the off hip.
  {
    weight: 0.16,
    build: (rng, m) => {
      const y = m.surface.yOf(0.16);
      const skin = new THREE.IcosahedronGeometry(0.045, 1);
      skin.scale(0.8, 1.15, 0.6);
      const neck = new THREE.CylinderGeometry(0.01, 0.014, 0.03, 6);
      neck.translate(0, 0.055, 0);
      const stopper = new THREE.CylinderGeometry(0.008, 0.008, 0.012, 5);
      stopper.translate(0, 0.075, 0);
      return [
        stuck(m, skin, y, -m.side * 2.0, 0.04, shade(m.leather, rng.range(1.05, 1.25))),
        stuck(m, neck, y, -m.side * 2.0, 0.04, shade(m.leather, 0.8)),
        stuck(m, stopper, y, -m.side * 2.0, 0.04, HORN),
      ];
    },
  },
  // A quiver of sticks across the back.
  {
    weight: 0.12,
    build: (rng, m) => {
      const y = m.surface.yOf(0.62);
      const quiver = new THREE.CylinderGeometry(0.03, 0.026, 0.3, 7);
      // Leant across the back, mouth up over the shoulder.
      quiver.rotateZ(m.side * 0.35);
      const sticks = new THREE.CylinderGeometry(0.024, 0.024, 0.06, 6);
      sticks.translate(0, 0.17, 0);
      sticks.rotateZ(m.side * 0.35);
      return [
        stuck(m, quiver, y, Math.PI, 0.05, m.leather),
        stuck(m, sticks, y, Math.PI, 0.05, shade(HORN, rng.range(0.7, 0.9))),
      ];
    },
  },
  // Tokens off the waist: feathers or tassels on a cord.
  {
    weight: 0.16,
    build: (rng, m) => {
      const parts: Part[] = [];
      const y = m.surface.yOf(U_WAIST);
      const feathers = rng.chance(0.5);
      for (let i = 0; i < rng.int(2, 3); i++) {
        const bearing = m.side * (0.6 + i * 0.28);
        if (feathers) {
          const quill = new THREE.BoxGeometry(0.014, 0.075, 0.004);
          quill.translate(0, -0.05, 0);
          quill.rotateZ(m.side * 0.15);
          parts.push(stuck(m, quill, y, bearing, 0.028, shade(HORN, rng.range(0.6, 0.95))));
        } else {
          const tassel = new THREE.ConeGeometry(0.009, 0.06, 5);
          tassel.translate(0, -0.045, 0);
          parts.push(stuck(m, tassel, y, bearing, 0.028, shade(m.accent, 0.9)));
        }
      }
      return parts;
    },
  },
  // Fringe off the shoulder line, round the back and sides.
  {
    weight: 0.14,
    build: (rng, m) => fringe(m, U_ACROMION + 0.04, rearColumns(m.surface, 3), 0.012, rng.range(0.035, 0.05), shade(m.leather, 1.1)),
  },
];

/** The whole countryside dress, one entry per slot. */
export const COUNTRY_CATALOGS: Catalogs<Body> = {
  overlayers: OVERLAYERS,
  waists: WAISTS,
  shoulders: SHOULDERS,
  extras: EXTRAS,
  extraOdds: [0.15, 0.4, 0.6],
};
