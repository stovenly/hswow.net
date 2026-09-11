import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { heightRamp, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';
import { LEAVES, branchCards, cloud, finishFoliage, heightWeight, type Cloud, type Species, type Twig } from '../foliage';
import { OAK_GROWTH, growLimb, limbBranch, limbGeometry, sweep, type GrowForm, type Limb } from '../limbs';
import { SHEET_OF } from '../branchSheet';

// Baobab: one enormous smooth barrel of a bole, fluted as if several trunks had
// fused, pinching to a shoulder at two thirds of the height; above it a wide
// open tangle of gnarled boughs carrying only tufts of leaf, so the wood is
// most of what is seen. Stands on y = 0.

const TAU = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);
const BOLE = 0xa89a90;

/** Boughs rise off the shoulder and flatten; everything after them forks wide and turns up at the tip. */
const BAOBAB_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [3, 4],
    [2, 3],
    [2, 3],
  ],
  lengthRatio: [
    [0.45, 0.62],
    [0.45, 0.65],
    [0.4, 0.6],
  ],
  angle: [
    [0.55, 0.95],
    [0.6, 1.05],
    [0.7, 1.2],
  ],
  along: [
    [0.3, 0.9],
    [0.25, 0.9],
    [0.3, 0.95],
  ],
  lift: [-0.06, 0.06, 0.14, 0.2],
  wobble: [0.16, 0.3, 0.45, 0.55],
  sides: [8, 6, 5, 4],
  levels: 3,
  swing: [0.04, 0.035],
  minRadius: 0.035,
  slender: 0.82,
};

function smooth(x: number): number {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

export const baobab: MeshBuilder = {
  name: 'baobab',
  category: 'foliage',
  radius: 10,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(18, 25);
    // A twelfth of the height in radius: the bole being far too fat for the tree is the whole read.
    const butt = height * rng.range(0.082, 0.108);
    const boleTop = height * rng.range(0.58, 0.66);
    const lobes = rng.int(3, 5);
    const lobePhase = rng.range(0, TAU);

    const bendAt = rng.range(0, TAU);
    const bend = rng.range(0.06, 0.2);
    const spine = (t: number): THREE.Vector3 => new THREE.Vector3(Math.cos(bendAt) * bend * t * t, -0.2 + (boleTop + 0.2) * t, Math.sin(bendAt) * bend * t * t);
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 6; i++) points.push(spine(i / 6));

    /** A barrel widest at two fifths and still nearly full at the top: the boughs leave a shoulder, not a neck. */
    const profile = (t: number): number => (0.82 + 0.3 * Math.sin(Math.PI * (0.3 + t * 0.48))) * (1 - 0.14 * smooth((t - 0.82) / 0.18));
    const flute = (theta: number, t: number): number => 1 + 0.11 * Math.cos(lobes * theta + lobePhase) * (1 - t * 0.7);
    const sway = heightRamp(0, height, 3.0);
    parts.push({
      geometry: sweep(points, (t, theta) => butt * profile(t) * flute(theta, t), 14, true),
      color: (x, y, z) => {
        const c = spine(Math.min(1, Math.max(0, (y + 0.2) / (boleTop + 0.2))));
        const theta = Math.atan2(z - c.z, x - c.x);
        // Light on the ridges of the flutes and dark in their valleys: the bark
        // itself is smooth, so the fusing is all the shape it has.
        const ridge = 0.5 + 0.5 * Math.cos(lobes * theta + lobePhase);
        const grain = Math.sin(x * 33.7 + y * 79.3 + z * 51.9) * 0.5 + 0.5;
        const skirt = 1 - 0.09 * Math.max(0, 1 - y / (height * 0.2));
        return shade(BOLE, (0.9 + 0.15 * ridge) * (0.98 + 0.04 * grain) * skirt);
      },
      sway,
    });

    const species: Species = { colour: LEAVES.baobab, deciduous: true, bark: shade(BOLE, 0.8), weight: heightWeight(height, 3.0) };
    const limbs: Limb[] = [];
    const twigs: Twig[] = [];
    const heads: THREE.Vector3[] = [];
    const boughs = rng.int(5, 7);
    const shoulder = butt * profile(1);
    const boughR = shoulder * rng.range(0.3, 0.4);
    const start = rng.range(0, TAU);
    const from = spine(1);
    for (let i = 0; i < boughs; i++) {
      const b = start + (i / boughs) * TAU + rng.around(0, 0.28);
      const out = new THREE.Vector3(Math.cos(b), 0, Math.sin(b));
      const tilt = rng.range(0.72, 1.05);
      const dir = new THREE.Vector3(0, Math.cos(tilt), 0).addScaledVector(out, Math.sin(tilt)).normalize();
      const at = from.clone().addScaledVector(out, shoulder - boughR);
      const bough = growLimb(rng, at, dir, (height - boleTop) * rng.range(1.25, 1.75), boughR, 0, BAOBAB_GROWTH, limbs, twigs);
      heads.push(bough.points[bough.points.length - 1]);
    }
    for (const limb of limbs) {
      parts.push({ geometry: limbGeometry(limb), color: shade(BOLE, (0.86 - limb.level * 0.03) * rng.range(0.96, 1.05)), sway, branch: limbBranch(limb) });
    }

    // Plates, not balls: the leaf lies over the tangle and the tangle shows under it.
    const clouds: Cloud[] = [];
    const middle = new THREE.Vector3();
    let spread = 0;
    for (const head of heads) {
      middle.add(head);
      spread = Math.max(spread, Math.hypot(head.x, head.z));
      const r = rng.range(2.0, 3.0);
      clouds.push(cloud(rng, head.clone().addScaledVector(UP, r * 0.25), new THREE.Vector3(r, r * 0.45, r), 0.2));
    }
    middle.divideScalar(Math.max(1, heads.length));
    const wide = spread + rng.range(1.0, 2.0);
    clouds.push(cloud(rng, middle.clone().addScaledVector(UP, wide * 0.1), new THREE.Vector3(wide, wide * 0.3, wide), 0.18));
    parts.push(...branchCards(rng, species, clouds, { twigs, count: 150, length: [0.6, 0.95], tiles: SHEET_OF.smallleaf, perTwig: 2, upward: 0.55 }));

    return finishFoliage(parts, 'baobab', rng.range(0, TAU), 0, scale);
  },
};
