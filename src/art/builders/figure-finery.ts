import * as THREE from 'three';
import type { Part } from '../assemble';
import type { Columns } from '../loft';
import { sheet, type Vec3 } from '../sheet';
import type { Rng } from '../random';
import { blend, shade } from '../palette';
import { TRUNK_SIDES, TRUNK_US, U_ACROMION, U_WAIST, ease } from './figure-trunk';
import {
  FRONT_COLUMN,
  atBearing,
  backColumns,
  band,
  columnBearing,
  fringe,
  frontColumns,
  pickWeighted,
  ribbon,
  shell,
  splitAt,
  stuck,
  surface,
  type Body,
  type Wear,
} from './figure-wear';

/**
 * What the cityfolk wear: the same trunk, the same layers, richer cloth. A
 * base garment cut in bands and panels of the trunk's own sheet, then
 * one over-layer, one thing at the waist, one at the shoulders, and extras —
 * every one a layer of the one surface, so nothing cuts through anything.
 */

const IVORY = 0xe4d9bd;

const BACK_COLUMN = FRONT_COLUMN + TRUNK_SIDES / 2;

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
  // A houppelande: long, with a broad band of the second cloth at the hem and over the shoulders.
  {
    weight: 0.18,
    hose: 'dark',
    hem: (rng) => rng.range(0.14, 0.22),
    bands: (hem, m) => {
      const band = blend(m.accent, m.cloth, 0.45);
      return [[0, hem, m.lower], [hem, hem + 0.09, band], [hem + 0.09, 0.86, m.cloth], [0.86, 1, band]];
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
];

/**
 * The front panel as a layer of its own: a stole of cloth lying proud on the
 * dressed surface from the hem's top to the yoke, its edges plumb — held at a
 * constant reach either side of centre — where columns of the sheet would bow
 * out with the body.
 */
function stole(m: Body, u0: number, u1: number, reach: number, color: number): Part {
  const proud = 0.004;
  const thick = 0.004;
  const us = [u0, ...TRUNK_US.filter((u) => u > u0 + 1e-6 && u < u1 - 1e-6), u1];
  // The bearing where the dressed surface's x reaches the edge, by bisection: x grows with bearing round the front.
  const edge = (u: number, off: number): number => {
    let lo = 0;
    let hi = 1.35;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (surface(m, u, atBearing(mid), off)[0] < reach) lo = mid;
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
    const row: Vec3[] = [surface(m, u, atBearing(-bIn), proud)];
    for (let i = 0; i <= N; i++) row.push(surface(m, u, atBearing(-bOut + (2 * bOut * i) / N), proud + thick));
    row.push(surface(m, u, atBearing(bIn), proud));
    for (let i = 1; i < N; i++) row.push(surface(m, u, atBearing(bIn - (2 * bIn * i) / N), proud));
    return row;
  });
  return { geometry: sheet(rows, { caps: { start: true, end: true } }), color, skin: m.trunk.skin, name: 'garment panel' };
}

/** The base cloth in bands of one sheet, closed at the crotch and the neck, and the panel laid over it. */
export function dressCity(m: Body, parts: Part[], style: CityGarment): void {
  const collarU = 0.96;
  const yokeU = 0.9;
  const bands = splitAt(style.bands(m.hemU, m), collarU).map((b) => (b[0] >= collarU - 1e-6 ? [b[0], b[1], m.trim] : b) as [number, number, number]);
  const us = [...new Set([...TRUNK_US, ...bands.flatMap((b) => [b[0], b[1]])])].sort((a, b) => a - b);

  for (const [from, to, base] of bands) {
    if (to - from < 1e-3) continue;
    const rows = m.trunk.rows(us.filter((u) => u >= from - 1e-6 && u <= to + 1e-6));
    if (rows.length < 2) continue;
    const caps = { start: from <= 1e-6, end: to >= 1 - 1e-6 };
    parts.push({ geometry: sheet(rows, { caps }), color: base, skin: m.trunk.skin, name: `garment ${from.toFixed(2)}-${to.toFixed(2)}` });
  }

  const panel = style.panel?.(m);
  if (panel) {
    // The reach the old column split had at the trunk's narrowest, so the panel stays inside the body everywhere.
    let minW = Infinity;
    for (const u of TRUNK_US) if (u >= m.hemU && u <= yokeU) minW = Math.min(minW, m.trunk.extent(u).w);
    parts.push(stole(m, m.hemU + 0.02, yokeU, Math.sin(((panel.half + 0.5) * 2 * Math.PI) / TRUNK_SIDES) * minW, panel.color));
  }

  // The hem's lip: the garment is a layer over the hose, not a colour change.
  const lipH = 0.03;
  const lipColor = shade(bands[1] ? bands[1][2] : m.cloth, 0.86);
  parts.push(shell(m, m.hemU - lipH * 0.4, m.hemU + lipH * 0.6, 0.004, lipColor, {
    caps: { start: true, end: true },
    flare: (u) => 0.006 * (1 - ease((u - (m.hemU - lipH * 0.4)) / lipH)),
  }));
}

/**
 * A pleated layer: the dressed surface with every other column stood further
 * out, so the sheet folds in and out round the body.
 */
function pleated(m: Body, u0: number, u1: number, proud: number, depth: number, color: number): Part {
  const us = [u0, ...TRUNK_US.filter((u) => u > u0 + 1e-6 && u < u1 - 1e-6), u1];
  const rows = us.map((u): Vec3[] => {
    const row: Vec3[] = [];
    // The pleats die out toward the top so the waist stays flat.
    const k = ease((u1 - u) / (u1 - u0));
    for (let i = 0; i < TRUNK_SIDES; i++) row.push(surface(m, u, ((i + 0.5) / TRUNK_SIDES) * Math.PI * 2, proud + (i % 2 ? depth * k : 0)));
    return row;
  });
  return { geometry: sheet(rows, { caps: { start: true, end: true } }), color, skin: m.trunk.skin };
}

/**
 * A flat sash lying on the dressed surface from one (u, bearing) to another,
 * `width` radians across: a baldric, a chain's ribbon.
 */
function sash(m: Body, from: [number, number], to: [number, number], width: number, proud: number, thick: number, color: number, steps = 10): Part {
  const rows: Vec3[][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = from[0] + (to[0] - from[0]) * t;
    const b = from[1] + (to[1] - from[1]) * t;
    // Counter-clockwise seen from above, as a trunk row is, so the faces point out.
    rows.push([
      surface(m, u, atBearing(b - width / 2), proud),
      surface(m, u, atBearing(b - width / 2), proud + thick),
      surface(m, u, atBearing(b + width / 2), proud + thick),
      surface(m, u, atBearing(b + width / 2), proud),
    ]);
  }
  return { geometry: sheet(rows, { caps: { start: true, end: true } }), color, skin: m.trunk.skin };
}

/**
 * A facing down one edge of an open front: a welt on the dressed surface
 * whose edges hang plumb — at constant reach from centre — up to the yoke,
 * then turn in with the collar. Columns of the sheet bow out with the chest;
 * clothing hangs straight, so this is its own strip. `bIn`/`bOut` are the
 * bearings it closes onto at the top.
 */
function facing(m: Body, u0: number, u1: number, s: 1 | -1, xIn: number, xOut: number, bIn: number, bOut: number, lo: number, hi: number, color: number): Part {
  const yoke = 0.9;
  // The bearing where the dressed surface's x reaches the edge, by bisection: x grows with bearing round the front.
  const solve = (u: number, x: number): number => {
    let a = 0;
    let b = 1.35;
    for (let i = 0; i < 24; i++) {
      const mid = (a + b) / 2;
      if (surface(m, u, atBearing(s * mid), lo)[0] * s < x) a = mid;
      else b = mid;
    }
    return (a + b) / 2;
  };
  const us = [u0, ...TRUNK_US.filter((u) => u > u0 + 1e-6 && u < u1 - 1e-6), u1];
  const rows = us.map((u): Vec3[] => {
    const k = u <= yoke ? 0 : (u - yoke) / (u1 - yoke);
    const ba = s * ((1 - k) * solve(u, xIn) + k * bIn);
    const bb = s * ((1 - k) * solve(u, xOut) + k * bOut);
    const bm = (ba + bb) / 2;
    // A thin closed ring, as `ribbon`'s are: up the near edge, across the crown, down the far edge, back across the foot.
    return [
      surface(m, u, atBearing(ba), lo),
      surface(m, u, atBearing(ba), hi),
      surface(m, u, atBearing(bm), hi),
      surface(m, u, atBearing(bb), hi),
      surface(m, u, atBearing(bb), lo),
      surface(m, u, atBearing(bm), lo),
    ];
  });
  return { geometry: sheet(rows, { caps: { start: true, end: true } }), color, skin: m.trunk.skin };
}

/**
 * A cloak: a lined layer round the back of the dressed surface, open down
 * the whole front so the dress under it shows. Its edges hang plumb below
 * the yoke and close toward the collar above it; the lining pinches shut at
 * the top and the hem hangs open.
 */
function cloak(m: Body, u0: number, u1: number, proud: number, color: number, flare?: (u: number) => number): Part {
  const yoke = 0.9;
  // What the opening closes to at the collar, and the plumb reach below: the
  // collar bearing's x at the narrowest the trunk gets over the run.
  const bTop = (2.5 * 2 * Math.PI) / TRUNK_SIDES;
  let xEdge = Infinity;
  for (const u of TRUNK_US) if (u >= u0 && u <= Math.min(yoke, u1)) xEdge = Math.min(xEdge, surface(m, u, atBearing(bTop), proud)[0]);
  const solve = (u: number, off: number): number => {
    let a = 0;
    let b = 1.35;
    for (let i = 0; i < 24; i++) {
      const mid = (a + b) / 2;
      if (surface(m, u, atBearing(mid), off)[0] < xEdge) a = mid;
      else b = mid;
    }
    return (a + b) / 2;
  };
  const us = [u0, ...TRUNK_US.filter((u) => u > u0 + 1e-6 && u < u1 - 1e-6), u1];
  const N = 20;
  const rows = us.map((u): Vec3[] => {
    const off = proud + (flare ? flare(u) : 0);
    const lin = off - 0.006 * Math.min(1, (u1 - u) / 0.02);
    const k = u <= yoke ? 0 : (u - yoke) / (u1 - yoke);
    const bA = (1 - k) * solve(u, off) + k * bTop;
    const span = 2 * Math.PI - 2 * bA;
    // A thin C round the back: up the near edge, across the outer face, down the far edge, back across the lining.
    const row: Vec3[] = [surface(m, u, atBearing(bA), lin)];
    for (let i = 0; i <= N; i++) row.push(surface(m, u, atBearing(bA + (span * i) / N), off));
    row.push(surface(m, u, atBearing(bA + span), lin));
    for (let i = N - 1; i >= 1; i--) row.push(surface(m, u, atBearing(bA + (span * i) / N), lin));
    return row;
  });
  return { geometry: sheet(rows), color, skin: m.trunk.skin };
}

/** Both facings of an open front, covering the body's own edge columns wherever the chest carries them. */
function facings(m: Body, u0: number, u1: number, gap: number, lo: number, hi: number, color: number): Part[] {
  const bIn = ((gap + 0.5) * 2 * Math.PI) / TRUNK_SIDES;
  const bOut = ((gap + 1.5) * 2 * Math.PI) / TRUNK_SIDES;
  let minE = Infinity;
  let maxE = 0;
  for (const u of TRUNK_US) {
    if (u < u0 || u > 0.9) continue;
    const x = surface(m, u, atBearing(bIn), lo)[0];
    minE = Math.min(minE, x);
    maxE = Math.max(maxE, x);
  }
  return ([1, -1] as const).map((s) => facing(m, u0, u1, s, minE - 0.004, maxE + 0.008, bIn, bOut, lo, hi, color));
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

export const CITY_OVERLAYERS: readonly Wear[] = [
  { weight: 0.18, build: () => [] },
  // A surcoat: sleeveless, open down the front, its lining showing at the edges, faced at the hem.
  {
    proud: 0.018,
    weight: 0.2,
    build: (rng, m) => {
      const color = shade(m.accent, rng.range(0.85, 1));
      const lining = shade(m.trim, 0.95);
      const low = Math.max(0.05, m.hemU - rng.range(0.04, 0.12));
      const gap = 1;
      return [
        shell(m, low, 0.985, 0.012, color, { columns: backColumns(gap), fold: true }),
        ...facings(m, low, 0.985, gap, 0.013, 0.018, lining),
        shell(m, low, low + 0.035, 0.016, m.trim, { columns: backColumns(gap), fold: { start: true, end: true, to: 0.012 } }),
      ];
    },
  },
  // A tabard: a panel front and back, joined over the shoulders, a device on the chest.
  {
    proud: 0.013,
    weight: 0.18,
    build: (rng, m) => {
      const color = shade(m.accent, rng.range(0.9, 1));
      const half = 2;
      const low = m.hemU + rng.range(-0.04, 0.02);
      const rear: Columns = { from: BACK_COLUMN - half, to: BACK_COLUMN + half };
      m.neck = 0.013;
      const y = m.trunk.yOf(0.72);
      return [
        shell(m, low, 0.94, 0.013, color, { columns: frontColumns(half), fold: true }),
        shell(m, low, 0.94, 0.013, color, { columns: rear, fold: true }),
        shell(m, 0.94, 0.995, 0.013, color, { fold: true, over: true }),
        ...fringe(m, low, frontColumns(half), 0.013, 0.05, m.trim),
        ...fringe(m, low, rear, 0.013, 0.05, m.trim),
        ...device(rng, 0.075).map((g): Part => ({ geometry: stuck(m, g, y, 0, 0.019), color: m.trim, bone: m.trunk.boneAt(y) })),
        { geometry: stuck(m, new THREE.IcosahedronGeometry(0.012, 0), y, 0, 0.026), color: m.metal, bone: m.trunk.boneAt(y) },
      ];
    },
  },
  // A cote trimmed in fur: down the front edges and round the hem.
  {
    proud: 0.022,
    weight: 0.18,
    build: (rng, m) => {
      const color = shade(m.cloth, rng.range(0.7, 0.84));
      const low = Math.max(0.05, m.hemU - rng.range(0.02, 0.1));
      const gap = 1;
      const parts: Part[] = [shell(m, low, 0.985, 0.012, color, { columns: backColumns(gap), fold: true })];
      parts.push(...facings(m, low, 0.985, gap, 0.013, 0.02, m.fur));
      parts.push(shell(m, low, low + 0.045, 0.02, m.fur, { columns: backColumns(gap), fold: { start: true, end: true, to: 0.012 } }));
      return parts;
    },
  },
  // A pleated skirt off the waist over the hips, banded at the top.
  {
    proud: 0.02,
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
    proud: 0.013,
    weight: 0.12,
    build: (rng, m) => {
      const color = shade(m.cloth, rng.range(0.8, 0.92));
      const parts: Part[] = [shell(m, m.hemU + 0.02, 0.985, 0.013, color, { fold: true })];
      for (const b of m.deltoids) {
        // The roll rides the upper arm with the deltoid it sits on.
        const roll = new THREE.TorusGeometry(b.r * 0.82, b.r * 0.34, 6, 14);
        // TorusGeometry lies in XY; rotateX(π/2) lays it flat round the shoulder.
        roll.rotateX(Math.PI / 2);
        roll.translate(b.x, b.y + b.r * 0.4, b.z);
        parts.push({ geometry: roll, color: m.accent, bone: b.x > 0 ? 'armLu' : 'armRu' });
      }
      return parts;
    },
  },
];

// --- at the waist ----------------------------------------------------------------------

export const CITY_WAISTS: readonly Wear[] = [
  { weight: 0.1, build: () => [] },
  // A jewelled girdle: a band set with bosses, its end hanging down the front.
  {
    weight: 0.3,
    build: (rng, m) => {
      const y = m.trunk.yOf(U_WAIST) + rng.range(0.005, 0.03);
      const h = 0.03;
      const proud = m.layer + 0.007;
      const bone = m.trunk.boneAt(y);
      const parts: Part[] = [band(m, y, h, proud, shade(m.trim, 0.9))];
      for (let c = 0; c < TRUNK_SIDES; c += 2) {
        const boss = new THREE.IcosahedronGeometry(0.009, 0);
        parts.push({ geometry: stuck(m, boss, y, columnBearing(c), proud + 0.008), color: c % 4 ? m.metal : m.accent, bone });
      }
      const T = m.trunk.top - m.trunk.bottom;
      const u = m.trunk.uOf(y - h * 0.3);
      parts.push(ribbon(m, u - rng.range(0.14, 0.2) / T, u, 0.12, 0.09, proud + 0.002, 0.007, shade(m.trim, 0.9)));
      return parts;
    },
  },
  // A hip belt slung low, a purse and a sheathed knife off it.
  {
    weight: 0.24,
    build: (rng, m) => {
      const y = m.trunk.yOf(U_WAIST) - 0.02;
      const h = rng.range(0.03, 0.04);
      const proud = m.layer + 0.007;
      const bone = m.trunk.boneAt(y);
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
        band(m, y, h, proud, m.leather),
        { geometry: stuck(m, buckle, y, 0, proud + 0.006), color: m.metal, bone },
        { geometry: stuck(m, purse, y, m.side * 0.85, proud + 0.02), color: shade(m.leather, 1.15), bone },
        { geometry: stuck(m, draw, y, m.side * 0.85, proud + 0.02), color: m.metal, bone },
        { geometry: stuck(m, sheath, y, -m.side * 0.9, proud + 0.012), color: shade(m.leather, 0.8), bone },
        { geometry: stuck(m, grip, y, -m.side * 0.9, proud + 0.012), color: m.metal, bone },
      ];
    },
  },
  // A wide sash with a bow at the hip.
  {
    weight: 0.2,
    build: (rng, m) => {
      const y = m.trunk.yOf(U_WAIST) + rng.range(0.01, 0.04);
      const h = rng.range(0.05, 0.07);
      const proud = m.layer + 0.008;
      const bone = m.trunk.boneAt(y);
      const bearing = m.side * 1.4;
      const T = m.trunk.top - m.trunk.bottom;
      const u = m.trunk.uOf(y - h * 0.3);
      const parts: Part[] = [band(m, y, h, proud, m.accent)];
      for (const k of [-1, 1] as const) {
        const loop = new THREE.IcosahedronGeometry(0.03, 1);
        loop.scale(1.2, 0.7, 0.5);
        loop.translate(k * 0.03, 0.006, 0);
        loop.rotateZ(k * 0.5);
        parts.push({ geometry: stuck(m, loop, y, bearing, proud + 0.012), color: shade(m.accent, 0.92), bone });
      }
      const knot = new THREE.IcosahedronGeometry(0.014, 0);
      parts.push({ geometry: stuck(m, knot, y, bearing, proud + 0.02), color: shade(m.accent, 0.8), bone });
      parts.push(ribbon(m, u - rng.range(0.1, 0.14) / T, u, bearing - m.side * 0.12, 0.14, proud + 0.002, 0.008, m.accent));
      parts.push(ribbon(m, u - rng.range(0.07, 0.1) / T, u, bearing + m.side * 0.14, 0.12, proud + 0.004, 0.008, shade(m.accent, 0.9)));
      return parts;
    },
  },
  // A belt with a buckle and a long tongue hanging from it.
  {
    weight: 0.16,
    build: (rng, m) => {
      const y = m.trunk.yOf(U_WAIST) + rng.range(0.005, 0.03);
      const h = rng.range(0.028, 0.036);
      const proud = m.layer + 0.007;
      const bone = m.trunk.boneAt(y);
      const buckle = new THREE.BoxGeometry(h * 1.4, h * 1.1, 0.012);
      const T = m.trunk.top - m.trunk.bottom;
      const u = m.trunk.uOf(y - h * 0.4);
      return [
        band(m, y, h, proud, m.leather),
        { geometry: stuck(m, buckle, y, 0.05, proud + 0.006), color: m.metal, bone },
        ribbon(m, u - rng.range(0.16, 0.24) / T, u, 0.16, 0.08, proud + 0.002, 0.007, m.leather),
        { geometry: stuck(m, new THREE.IcosahedronGeometry(0.008, 0), y - 0.06, 0.16, proud + 0.01), color: m.metal, bone: m.trunk.boneAt(y - 0.06) },
      ];
    },
  },
];

// --- at the shoulders ---------------------------------------------------------------------

export const CITY_SHOULDERS: readonly Wear[] = [
  { weight: 0.24, build: () => [] },
  // A cloak from the shoulders, open down the whole front so the dress shows,
  // going round the deltoids; a darker shoulder cape over it, clasped at the chest.
  {
    weight: 0.2,
    build: (rng, m) => {
      const low = Math.max(0.08, m.hemU - rng.range(0.02, 0.1));
      const proud = Math.max(0.018, m.layer + 0.008, m.neck + 0.006);
      const y = m.trunk.top - 0.05;
      const bone = m.trunk.boneAt(y);
      const clasp = new THREE.IcosahedronGeometry(0.016, 1);
      clasp.scale(1.4, 1, 0.5);
      const flare = (u: number): number => 0.018 * (1 - ease((u - low) / (0.995 - low)));
      return [
        cloak(m, low, 0.995, proud, shade(m.cloth, 0.62), flare),
        cloak(m, 0.9, 0.995, proud + 0.005, m.accent, flare),
        { geometry: stuck(m, clasp, y, 0, m.layer + 0.012), color: m.metal, bone },
        { geometry: stuck(m, new THREE.IcosahedronGeometry(0.007, 0), y, 0, m.layer + 0.024), color: m.trim, bone },
      ];
    },
  },
  // A baldric from one shoulder to the other hip, a badge where it crosses the chest.
  {
    weight: 0.14,
    build: (_rng, m) => {
      const proud = m.layer + 0.006;
      const y = m.trunk.yOf(0.68);
      const badge = new THREE.IcosahedronGeometry(0.02, 1);
      badge.scale(1, 1, 0.4);
      return [
        // Up the front from the off hip over the shoulder point, then down the back to the same hip.
        sash(m, [U_WAIST + 0.06, -m.side * 1.25], [0.91, m.side * 1.57], 0.2, proud, 0.007, m.trim, 12),
        sash(m, [0.91, m.side * 1.57], [U_WAIST + 0.06, m.side * (2 * Math.PI - 1.89)], 0.2, proud, 0.007, m.trim, 12),
        { geometry: stuck(m, badge, y, m.side * 0.2, proud + 0.008), color: m.metal, bone: m.trunk.boneAt(y) },
        { geometry: stuck(m, new THREE.IcosahedronGeometry(0.008, 0), y, m.side * 0.2, proud + 0.016), color: m.accent, bone: m.trunk.boneAt(y) },
      ];
    },
  },
  // A rolled hood-band at the neck with its liripipe hanging down the back.
  {
    weight: 0.1,
    build: (rng, m) => {
      const y = m.trunk.top - 0.016;
      const T = m.trunk.top - m.trunk.bottom;
      const u = m.trunk.uOf(y - 0.012);
      return [
        band(m, y, 0.034, m.layer + m.neck + 0.01, m.accent),
        ribbon(m, u - rng.range(0.28, 0.4) / T, u, Math.PI + m.side * 0.1, 0.16, m.layer + 0.006, 0.01, m.accent),
      ];
    },
  },
];

// --- extras --------------------------------------------------------------------------------

export const CITY_EXTRAS: readonly Wear[] = [
  // A scroll tucked in the belt.
  {
    weight: 0.2,
    build: (_rng, m) => {
      const y = m.trunk.yOf(U_WAIST);
      const bone = m.trunk.boneAt(y);
      const scroll = new THREE.CylinderGeometry(0.014, 0.014, 0.12, 7);
      // rotateZ(θ) takes +Y toward −X: the scroll rakes across the belt.
      scroll.rotateZ(m.side * 0.5);
      const tie = new THREE.CylinderGeometry(0.016, 0.016, 0.012, 7);
      tie.rotateZ(m.side * 0.5);
      return [
        { geometry: stuck(m, scroll, y, m.side * 0.55, m.layer + 0.03), color: IVORY, bone },
        { geometry: stuck(m, tie, y, m.side * 0.55, m.layer + 0.03), color: m.accent, bone },
      ];
    },
  },
  // A purse with keys on a ring beside it.
  {
    weight: 0.18,
    build: (_rng, m) => {
      const y = m.trunk.yOf(0.24);
      const bone = m.trunk.boneAt(y);
      const parts: Part[] = [];
      const purse = new THREE.IcosahedronGeometry(0.038, 1);
      purse.scale(0.9, 1.1, 0.7);
      parts.push({ geometry: stuck(m, purse, y, -m.side * 0.9, 0.032), color: m.accent, bone });
      const ring = new THREE.TorusGeometry(0.012, 0.003, 4, 10);
      parts.push({ geometry: stuck(m, ring, y + 0.04, -m.side * 0.65, 0.028), color: m.metal, bone: m.trunk.boneAt(y + 0.04) });
      for (let i = 0; i < 3; i++) {
        const key = new THREE.BoxGeometry(0.006, 0.05, 0.004);
        key.translate((i - 1) * 0.008, -0.03, 0);
        key.rotateZ((i - 1) * 0.15);
        parts.push({ geometry: stuck(m, key, y + 0.04, -m.side * 0.65, 0.028), color: shade(m.metal, 0.9), bone: m.trunk.boneAt(y + 0.04) });
        const bow = new THREE.IcosahedronGeometry(0.006, 0);
        bow.translate((i - 1) * 0.008 * 1.6, -0.056, 0);
        parts.push({ geometry: stuck(m, bow, y + 0.04, -m.side * 0.65, 0.028), color: shade(m.metal, 0.9), bone: m.trunk.boneAt(y + 0.04) });
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
        parts.push({ geometry: bead, color: i % 5 === 0 ? m.metal : dark, skin: m.trunk.skin });
      }
      const y = m.trunk.yOf(U_WAIST - 0.19);
      const medal = new THREE.CylinderGeometry(0.011, 0.011, 0.004, 8);
      // rotateX(π/2) takes the drum's +Y axis to +Z, the outward normal: the medal lies flat on the hip.
      medal.rotateX(Math.PI / 2);
      medal.translate(0, -0.02, 0);
      const ring = new THREE.TorusGeometry(0.014, 0.0025, 4, 12);
      ring.translate(0, -0.02, 0);
      parts.push({ geometry: stuck(m, medal, y, m.side * 0.9, 0.02), color: m.accent, bone: m.trunk.boneAt(y) });
      parts.push({ geometry: stuck(m, ring, y, m.side * 0.9, 0.02), color: m.metal, bone: m.trunk.boneAt(y) });
      return parts;
    },
  },
  // A pomander on a chain off the girdle.
  {
    weight: 0.14,
    build: (rng, m) => {
      const parts: Part[] = [];
      const bearing = -m.side * 0.55;
      const T = m.trunk.top - m.trunk.bottom;
      const top = U_WAIST + 0.01;
      const drop = rng.range(0.08, 0.11) / T;
      for (let i = 0; i <= 6; i++) {
        const u = top - (drop * i) / 6;
        const [x, y, z] = surface(m, u, atBearing(bearing), 0.022);
        const link = new THREE.IcosahedronGeometry(0.005, 0);
        link.translate(x, y, z);
        parts.push({ geometry: link, color: m.metal, skin: m.trunk.skin });
      }
      const y = m.trunk.yOf(top - drop);
      const ball = new THREE.IcosahedronGeometry(0.02, 1);
      ball.translate(0, -0.02, 0);
      parts.push({ geometry: stuck(m, ball, y, bearing, 0.028), color: m.metal, bone: m.trunk.boneAt(y) });
      const belt = new THREE.TorusGeometry(0.02, 0.003, 4, 12);
      belt.rotateX(Math.PI / 2);
      belt.translate(0, -0.02, 0);
      parts.push({ geometry: stuck(m, belt, y, bearing, 0.028), color: m.accent, bone: m.trunk.boneAt(y) });
      return parts;
    },
  },
  // Fringe off the shoulder line, round the back and sides, in the trim.
  {
    weight: 0.1,
    build: (rng, m) => fringe(m, U_ACROMION + 0.04, { from: FRONT_COLUMN + 3, to: FRONT_COLUMN + TRUNK_SIDES - 3 }, 0.012, rng.range(0.035, 0.05), m.trim),
  },
];

/** The extras a cityfolk gets, and how many: they carry more than a villager. */
export function wearCityExtras(rng: Rng, m: Body, parts: Part[]): void {
  const count = rng.chance(0.1) ? 0 : rng.chance(0.35) ? 1 : rng.chance(0.6) ? 2 : 3;
  const worn = new Set<Wear>();
  for (let i = 0; i < count; i++) {
    const wear = pickWeighted(rng, CITY_EXTRAS);
    if (worn.has(wear)) continue;
    worn.add(wear);
    parts.push(...wear.build(rng, m));
  }
}
