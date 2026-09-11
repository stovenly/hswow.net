import * as THREE from 'three';
import type { Rng } from './random';
import type { Twig } from './foliage';
import { packBranch, type Family } from './fields';

// Limbs: branches as smooth swept tubes, grown recursively. A branch is a
// curve through a few points that bends a little at each, pulled toward or
// away from the sky by its species, and tapers along its length; children
// leave it at a set angle, spiralling round it, each as thick as its share of
// the parent's cross-section. The last level is handed back as twigs for the
// cards to sit on.

const UP = new THREE.Vector3(0, 1, 0);
const GOLDEN = 2.399963;

/** One grown branch: its curve, radius at start and end, and its level from the root. */
export interface Limb {
  points: THREE.Vector3[];
  r0: number;
  r1: number;
  level: number;
  /** Radial sides of the tube, carried down a chain so a limb and the one continuing it are cut the same way. */
  sides: number;
  /** The frame the tube starts on, so its first ring lands on the ring the limb below it ended on. */
  normal: THREE.Vector3 | null;
  /** A twig ends under its card; every other limb hands its end ring to the limb continuing it and is never capped. */
  capped: boolean;
  /** The first-level limb this grew from, which the wind swings it with, and the second-level one. */
  family: Family | null;
  sub: Family | null;
}

/** How a species grows, per level below the root: index 0 is the root's children. Every pair is rolled. */
export interface GrowForm {
  /** Children a parent bears at each level. */
  children: readonly (readonly [number, number])[];
  /** A child's length as a fraction of its parent's. */
  lengthRatio: readonly (readonly [number, number])[];
  /** A child's angle off the parent's tangent where it leaves, radians. */
  angle: readonly (readonly [number, number])[];
  /** Where along the parent children leave, fractions of its length. */
  along: readonly (readonly [number, number])[];
  /** Pull toward the sky per metre of branch, negative for a weeper; index 0 is the root itself. */
  lift: readonly number[];
  /** Random bend per point, radians; index 0 is the root itself. */
  wobble: readonly number[];
  /** Radial sides of the tube; index 0 is the root itself. */
  sides: readonly number[];
  /** The last level grown; its branches are the twigs. */
  levels: number;
  /** Tip travel per metre from the pivot at full gust, metres: a first-level limb's, then a second-level one's. */
  swing: readonly [number, number];
  /** Nothing thinner than this, metres: a rod under a pixel draws as scattered pixels. */
  minRadius: number;
  /** Child radii against the share the cross-section rule gives them; under 1 is a species whose branches are whippier than its bole implies. */
  slender?: number;
}

/** The oak's growth: massive limbs leaving low and wide, pulled up a little, forking twice more. */
export const OAK_GROWTH: GrowForm = {
  children: [
    [3, 4],
    [2, 3],
    [2, 3],
  ],
  lengthRatio: [
    [0.6, 0.85],
    [0.5, 0.7],
    [0.45, 0.65],
  ],
  angle: [
    [0.75, 1.15],
    [0.5, 0.9],
    [0.5, 0.95],
  ],
  along: [
    [0.08, 0.6],
    [0.3, 0.95],
    [0.35, 0.95],
  ],
  lift: [0.3, 0.22, 0.14, 0.08],
  wobble: [0.12, 0.28, 0.35, 0.45],
  sides: [8, 7, 5, 4],
  levels: 3,
  swing: [0.08, 0.09],
  minRadius: 0.045,
};

/** A parallel-transported frame along a curve: rings that never twist against one another. */
function sweepFrames(curve: THREE.CatmullRomCurve3, steps: number, normal0?: THREE.Vector3 | null): { points: THREE.Vector3[]; normals: THREE.Vector3[]; binormals: THREE.Vector3[]; tangents: THREE.Vector3[] } {
  const points: THREE.Vector3[] = [];
  const tangents: THREE.Vector3[] = [];
  const normals: THREE.Vector3[] = [];
  const binormals: THREE.Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push(curve.getPointAt(t));
    tangents.push(curve.getTangentAt(t).normalize());
  }
  const n = new THREE.Vector3();
  const axis = new THREE.Vector3();
  // A first normal off the first tangent, then carried along by the least rotation between tangents.
  if (normal0) {
    n.copy(normal0).addScaledVector(tangents[0], -normal0.dot(tangents[0])).normalize();
  } else {
    axis.set(1, 0, 0);
    if (Math.abs(axis.dot(tangents[0])) > 0.9) axis.set(0, 0, 1);
    n.crossVectors(tangents[0], axis).normalize();
  }
  normals.push(n.clone());
  for (let i = 1; i <= steps; i++) {
    axis.crossVectors(tangents[i - 1], tangents[i]);
    const s = axis.length();
    if (s > 1e-6) {
      axis.divideScalar(s);
      n.applyAxisAngle(axis, Math.asin(Math.min(1, s)));
    }
    n.addScaledVector(tangents[i], -n.dot(tangents[i])).normalize();
    normals.push(n.clone());
  }
  for (let i = 0; i <= steps; i++) binormals.push(new THREE.Vector3().crossVectors(tangents[i], normals[i]));
  return { points, normals, binormals, tangents };
}

/**
 * A tube swept along `points`, its radius `radiusAt(t, theta)`. The start is
 * left open, since it sits inside whatever it grows from; the end is capped.
 * Ring `j` runs from the frame normal toward the binormal, so with the
 * tangent `t`: (a, b, d) and (b, c, d) face outward.
 */
export function sweep(points: readonly THREE.Vector3[], radiusAt: (t: number, theta: number) => number, sides: number, capEnd = true, normal0?: THREE.Vector3 | null): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => p.clone()), false, 'centripetal', 0.5);
  const steps = sweepSteps(curve);
  const frames = sweepFrames(curve, steps, normal0);
  const ring: THREE.Vector3[][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const verts: THREE.Vector3[] = [];
    for (let j = 0; j < sides; j++) {
      const theta = (j / sides) * Math.PI * 2;
      const r = radiusAt(t, theta);
      verts.push(frames.points[i].clone().addScaledVector(frames.normals[i], Math.cos(theta) * r).addScaledVector(frames.binormals[i], Math.sin(theta) * r));
    }
    ring.push(verts);
  }
  const out: number[] = [];
  const tri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): void => {
    out.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  };
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < sides; j++) {
      const a = ring[i][j];
      const b = ring[i][(j + 1) % sides];
      const c = ring[i + 1][(j + 1) % sides];
      const d = ring[i + 1][j];
      tri(a, b, d);
      tri(b, c, d);
    }
  }
  if (capEnd) {
    const c = frames.points[steps];
    for (let j = 0; j < sides; j++) tri(c, ring[steps][j], ring[steps][(j + 1) % sides]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function sweepSteps(curve: THREE.CatmullRomCurve3): number {
  return Math.max(2, Math.ceil(curve.getLength() / 0.35));
}

/**
 * The frame `sweep` would leave the last ring of these points on. A tube handed
 * this as its `normal0` starts on exactly the ring the one before it ended on,
 * so the two are one surface rather than two rings cut at different angles.
 */
export function endNormal(points: readonly THREE.Vector3[], normal0?: THREE.Vector3 | null): THREE.Vector3 {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => p.clone()), false, 'centripetal', 0.5);
  const steps = sweepSteps(curve);
  return sweepFrames(curve, steps, normal0).normals[steps];
}

/** The point and tangent of a limb at `t`, on the same curve `sweep` draws. */
function along(limb: Limb, t: number, point: THREE.Vector3, tangent: THREE.Vector3): void {
  const curve = new THREE.CatmullRomCurve3(limb.points, false, 'centripetal', 0.5);
  point.copy(curve.getPointAt(t));
  tangent.copy(curve.getTangentAt(t)).normalize();
}

/**
 * Grows one limb from `from` along `direction` for `length`, then its children
 * by the form, down to the last level. Every limb goes into `limbs`; the last
 * level's also go into `twigs`.
 */
export function growLimb(rng: Rng, from: THREE.Vector3, direction: THREE.Vector3, length: number, r0: number, level: number, form: GrowForm, limbs: Limb[], twigs: Twig[], family: Family | null = null, sub: Family | null = null, chainSides?: number, normal0?: THREE.Vector3 | null): Limb {
  // A first-level limb is a lever the wind swings about its base, and a second-level one a lever on that.
  if (level === 1) family = { pivot: from.clone(), phase: rng.range(0, 1), swing: form.swing[0] };
  else if (level === 2) sub = { pivot: from.clone(), phase: rng.range(0, 1), swing: form.swing[1] };
  // The curve: a few points, each bending a little at random and toward or away from the sky.
  const count = level === 0 ? 5 : level === form.levels ? 3 : 4;
  const points: THREE.Vector3[] = [from.clone()];
  const dir = direction.clone().normalize();
  const step = length / (count - 1);
  const swing = new THREE.Vector3();
  for (let i = 1; i < count; i++) {
    swing.set(rng.range(-1, 1), rng.range(-1, 1), rng.range(-1, 1)).normalize();
    // The first step holds `direction`, so the tangent at the start is the one the
    // caller gave and the first ring is cut square to it. Bending it here would
    // tilt that ring off whatever handed the limb over.
    if (i > 1) dir.addScaledVector(swing, form.wobble[level] * 0.5).addScaledVector(UP, form.lift[level] * step).normalize();
    points.push(points[i - 1].clone().addScaledVector(dir, step));
  }
  const last = level >= form.levels;
  const n = last ? 0 : rng.int(form.children[level][0], form.children[level][1]);
  // The end is what is left after each lateral child took its share of the cross-section.
  const r1 = Math.max(form.minRadius, r0 * (last ? 0.55 : Math.max(0.45, Math.sqrt(1 / (n + 1)))));
  const sides = chainSides ?? form.sides[Math.min(level, form.sides.length - 1)];
  const limb: Limb = { points, r0, r1, level, sides, normal: normal0 ?? null, capped: last, family, sub };
  limbs.push(limb);
  if (last) {
    twigs.push({ from: points[0].clone(), to: points[count - 1].clone(), family, sub });
    return limb;
  }

  const ts: number[] = [];
  for (let i = 0; i < n; i++) ts.push(rng.range(form.along[level][0], form.along[level][1]));
  ts.sort((a, b) => a - b);
  // Children spiral round the parent at the golden angle, so no two leave on one side.
  let roll = rng.range(0, Math.PI * 2);
  const at = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();
  const childDir = new THREE.Vector3();
  // Each child takes an equal share of the parent's cross-section where it leaves, the parent keeping one share to go on with.
  const share = Math.sqrt(1 / (n + 1));
  for (const t of ts) {
    along(limb, t, at, tangent);
    roll += GOLDEN + rng.around(0, 0.3);
    side.set(1, 0, 0);
    if (Math.abs(side.dot(tangent)) > 0.9) side.set(0, 0, 1);
    side.cross(tangent).normalize().applyAxisAngle(tangent, roll);
    const angle = rng.range(form.angle[level][0], form.angle[level][1]);
    childDir.copy(tangent).multiplyScalar(Math.cos(angle)).addScaledVector(side, Math.sin(angle)).normalize();
    const parentR = r0 + (r1 - r0) * t;
    const childLength = length * rng.range(form.lengthRatio[level][0], form.lengthRatio[level][1]);
    growLimb(rng, at, childDir, childLength, Math.max(form.minRadius, parentR * share * 1.1 * (form.slender ?? 1)), level + 1, form, limbs, twigs, family, sub);
  }
  // The limb goes on as a thinner one from its own end ring: the same point, the
  // same radius, the same side count and the same frame, so the two tubes share
  // that ring exactly and taper apart from there. This limb is left uncapped.
  along(limb, 1, at, tangent);
  growLimb(rng, at, tangent, length * rng.range(form.lengthRatio[level][1] * 0.9, form.lengthRatio[level][1] * 1.1), r1, level + 1, form, limbs, twigs, family, sub, sides, endNormal(points, normal0));
  return limb;
}

/** A limb's tube. The taper is linear in the radius, which is how a real branch reads. */
export function limbGeometry(limb: Limb): THREE.BufferGeometry {
  return sweep(limb.points, (t) => limb.r0 + (limb.r1 - limb.r0) * t, limb.sides, limb.capped, limb.normal);
}

/** The branch lane for a limb's vertices: which levers swing them, packed as the shader reads it. */
export function limbBranch(limb: Limb): (x: number, y: number, z: number) => number {
  return (x, y, z) => packBranch(x, y, z, limb.family, limb.sub);
}
