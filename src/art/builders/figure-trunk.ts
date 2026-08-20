import type { Part } from '../assemble';
import type { Rng } from '../random';
import type { Vec3 } from '../sheet';

/**
 * The villager's trunk as a surface: crotch (u = 0) to the base of the neck
 * (u = 1), a bearing θ round it, and a point for each. Everything on the
 * body — the skin, every garment layer, every strap and stuck-on thing — is
 * placed by asking this one function, so nothing can disagree with the body
 * about where the body is.
 *
 * One section per height — a superellipse, wider than deep, its corners
 * filled more or less — so the surface is smooth from crotch to neck with no
 * seam a garment could show. The shoulders are the section itself broadening
 * to the acromion and thinning front to back, then the slope of the
 * trapezius up to the neck; the deltoid balls on the arms carry the breadth
 * outside it, and the shoulder ends inside them. Small lobes — pecs, glutes, the groove of the spine —
 * are added on the radius.
 *
 * All lengths are in units of the trunk's height T; the sliders in `Frame`
 * move the mass about per villager. Bearings run from +X toward −Z, so the
 * front is 3π/2 — the same parameter as a vertical `loft`.
 */

export const TRUNK_SIDES = 20;
/** Where the `torso` and `chest` bones turn, and where the arms hang. */
export const U_WAIST = 0.34;
export const U_CHEST = 0.54;
export const U_ARMPIT = 0.74;
export const U_ACROMION = 0.9;

/** Piecewise-linear value from (t, value) knots. */
export function profile(knots: readonly (readonly number[])[], t: number, column = 1): number {
  const c = Math.max(0, Math.min(1, t));
  for (let i = 1; i < knots.length; i++) {
    if (c <= knots[i][0]) {
      const t0 = knots[i - 1][0];
      const t1 = knots[i][0];
      const r0 = knots[i - 1][column];
      const r1 = knots[i][column];
      return r0 + ((r1 - r0) * (c - t0)) / (t1 - t0);
    }
  }
  return knots[knots.length - 1][column];
}

/** Sorted heights for a dense run: every knot plus a fixed spacing between. */
export function rungs(knots: readonly (readonly number[])[], spacing: number, extra: readonly number[] = []): number[] {
  const set = new Set<number>([0, 1, ...extra]);
  for (const [t] of knots) set.add(t);
  for (let t = spacing; t < 1; t += spacing) set.add(Math.round(t * 1000) / 1000);
  return [...set].sort((a, b) => a - b);
}

export function ease(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/** A bell over `t` centred at `c` with width `s`, 1 at the centre. */
const bell = (t: number, c: number, s: number): number => {
  const d = (t - c) / s;
  return Math.exp(-d * d * 2);
};

/** Shortest signed angle from `a` to `b`. */
const wrap = (d: number): number => Math.atan2(Math.sin(d), Math.cos(d));

// --- the tube: (u, value) in units of T --------------------------------------------

/** Half-width. Widest at the trochanters and the acromion, pinched at the waist and the armpit. */
const WIDTH = [
  [0, 0.235], [0.06, 0.27], [0.16, 0.265], [0.26, 0.24], [0.36, 0.205], [0.5, 0.225],
  [0.62, 0.245], [U_ARMPIT, 0.25], [0.8, 0.245], [0.86, 0.275], [U_ACROMION, 0.3],
  [0.94, 0.27], [0.97, 0.19], [1, 0.115],
];
/** Half-depth in front of the centre line: the lower belly, the chest, thin over the shoulders. */
const FRONT = [
  [0, 0.13], [0.08, 0.15], [0.2, 0.15], [0.36, 0.145], [0.5, 0.16], [0.66, 0.175],
  [0.8, 0.16], [0.9, 0.12], [1, 0.1],
];
/** Half-depth behind it: the seat, the small of the back, the ribs, the blades. */
const BACK = [
  [0, 0.14], [0.06, 0.17], [0.16, 0.16], [0.36, 0.14], [0.5, 0.15], [0.7, 0.165],
  [0.85, 0.14], [0.95, 0.115], [1, 0.1],
];
/** The S-curve: how far forward of the hip line the ring's centre sits. */
const FORWARD = [[0, -0.02], [0.1, -0.03], [0.36, 0], [0.55, 0.02], [0.75, 0.02], [1, 0]];
/** Corner fullness, front and back: 2 is an ellipse, higher fills the corners; the shoulders thin to their ends. */
const N_FRONT = [[0, 2.2], [0.36, 2.3], [0.6, 2.7], [0.8, 2.4], [0.9, 2.0], [1, 2.0]];
const N_BACK = [[0, 2.4], [0.36, 2.1], [0.7, 2.3], [0.9, 2.0], [1, 2.0]];

/** The heights every surface on the trunk is sampled at: every knot, and every 2 %. */
export const TRUNK_US: readonly number[] = rungs(
  [...WIDTH, ...FRONT, ...BACK, [U_WAIST], [U_CHEST], [0.92], [0.98]],
  0.02,
);

/** The per-villager sliders, all about 1. */
export interface Frame {
  /** Trunk height, metres. */
  T: number;
  bottom: number;
  breadth: number;
  chest: number;
  waist: number;
  hip: number;
  depth: number;
  belly: number;
}

export function drawFrame(rng: Rng, T: number, bottom: number): Frame {
  return {
    T,
    bottom,
    breadth: rng.range(0.92, 1.1),
    chest: rng.range(0.94, 1.06),
    waist: rng.range(0.9, 1.08),
    hip: rng.range(0.95, 1.12),
    depth: rng.range(0.92, 1.08),
    belly: rng.range(0.94, 1.14),
  };
}

export type TrunkBone = 'hips' | 'torso' | 'chest';

export interface Trunk {
  readonly frame: Frame;
  readonly bottom: number;
  readonly top: number;
  yOf(u: number): number;
  uOf(y: number): number;
  /** Half-width and half-depth of the section, for placing things by. */
  extent(u: number): { w: number; front: number; back: number; cz: number };
  /** The surface point at a height and bearing, `proud` off it. */
  point(u: number, bearing: number, proud?: number): Vec3;
  /** Rows of the surface at these heights, `proud` off it; `flare(u)` adds to proud per row. */
  rows(us: readonly number[], proud?: number, flare?: (u: number) => number): Vec3[][];
  /** Which segment a height falls on, for a rigid piece. */
  boneAt(y: number): TrunkBone;
  /** The trunk's blended binding, for anything that wraps round it. */
  skin: NonNullable<Part['skin']>;
  /** Half-width to the acromion, and its height. */
  acromion: { x: number; y: number; z: number };
}

export function makeTrunk(frame: Frame): Trunk {
  const { T, bottom } = frame;
  const top = bottom + T;
  const yOf = (u: number): number => bottom + u * T;
  const uOf = (y: number): number => (y - bottom) / T;

  // The sliders as factors up the trunk.
  const widthK = (u: number): number =>
    profile([[0, frame.hip], [0.18, frame.hip], [0.36, frame.waist], [0.55, frame.chest], [0.82, frame.chest], [U_ACROMION, frame.breadth], [1, 1]], u);
  const depthK = (u: number): number => profile([[0, 1], [0.36, 1], [0.6, frame.depth], [0.85, frame.depth], [1, 1]], u);
  const bellyK = (u: number): number => profile([[0, 1], [0.12, frame.belly], [0.42, frame.belly], [0.6, 1]], u);

  const tube = (u: number) => ({
    w: T * profile(WIDTH, u) * widthK(u),
    front: T * profile(FRONT, u) * depthK(u) * bellyK(u),
    back: T * profile(BACK, u) * depthK(u),
    cz: T * profile(FORWARD, u),
    nf: profile(N_FRONT, u),
    nb: profile(N_BACK, u),
  });
  /** Radius of a superellipse quadrant along (c, s), for half-axes a, b and exponent n. */
  const radial = (c: number, s: number, a: number, b: number, n: number): [number, number] => {
    const k = 2 / n;
    return [Math.sign(c) * Math.pow(Math.abs(c), k) * a, Math.sign(s) * Math.pow(Math.abs(s), k) * b];
  };

  const extent = (u: number) => {
    const t = tube(u);
    return { w: t.w, front: t.front, back: t.back, cz: t.cz };
  };

  const point = (u: number, bearing: number, proud = 0): Vec3 => {
    const c = Math.cos(bearing);
    const s = Math.sin(bearing);
    const t = tube(u);
    // s > 0 is toward −Z: the back.
    const [x, d] = radial(c, s, t.w, s > 0 ? t.back : t.front, s > 0 ? t.nb : t.nf);
    // Lobes on the radius. Bearings: front 3π/2, back π/2.
    const front = wrap(bearing - 1.5 * Math.PI);
    const back = wrap(bearing - 0.5 * Math.PI);
    let lobe = 1;
    lobe += 0.04 * frame.chest * bell(u, 0.68, 0.1) * (bell(front, 0.55, 0.32) + bell(front, -0.55, 0.32));
    lobe += 0.06 * frame.hip * bell(u, 0.09, 0.09) * (bell(back, 0.5, 0.35) + bell(back, -0.5, 0.35));
    lobe -= 0.03 * bell(back, 0, 0.16) * (u > 0.3 && u < 0.95 ? 1 : bell(u, 0.3, 0.06));
    const r = Math.hypot(x, d);
    const k = r > 1e-9 ? (r * lobe + proud) / r : 1;
    return [x * k, yOf(u), t.cz - d * k];
  };

  const rows = (us: readonly number[], proud = 0, flare?: (u: number) => number): Vec3[][] =>
    us.map((u) => {
      const p = proud + (flare ? flare(u) : 0);
      const row: Vec3[] = [];
      for (let i = 0; i < TRUNK_SIDES; i++) row.push(point(u, ((i + 0.5) / TRUNK_SIDES) * Math.PI * 2, p));
      return row;
    });

  const boneAt = (y: number): TrunkBone => (uOf(y) < U_WAIST ? 'hips' : uOf(y) < U_CHEST ? 'torso' : 'chest');

  // Weight is shared by height — pelvis, waist, ribcage — with a smooth
  // hand-over either side of each pivot; the outer shoulder leans on the
  // clavicle bones so a shrug lifts the shoulder.
  const BLEND = 0.09;
  const acromionX = tube(U_ACROMION).w;
  const skin = (x: number, y: number): [string, number][] => {
    const u = uOf(y);
    const w = ease((u - (U_WAIST - BLEND)) / (2 * BLEND));
    const c = ease((u - (U_CHEST - BLEND)) / (2 * BLEND));
    const clav = 0.8 * ease((Math.abs(x) / acromionX - 0.4) / 0.5) * ease((u - 0.76) / 0.12);
    const chest = w * c;
    return [
      ['hips', 1 - w],
      ['torso', w * (1 - c)],
      ['chest', chest * (1 - clav)],
      [x >= 0 ? 'clavL' : 'clavR', chest * clav],
    ];
  };

  return {
    frame,
    bottom,
    top,
    yOf,
    uOf,
    extent,
    point,
    rows,
    boneAt,
    skin,
    acromion: { x: acromionX, y: yOf(U_ACROMION), z: tube(U_ACROMION).cz },
  };
}
