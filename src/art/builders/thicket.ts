import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { heightRamp, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { LEAVES, branchCards, cloud, finishFoliage, heightWeight, type Cloud, type Species, type Twig } from '../foliage';
import { OAK_GROWTH, growLimb, limbBranch, limbGeometry, sweep, type GrowForm, type Limb } from '../limbs';
import { packBranch, type Family } from '../fields';
import { SHEET_OF } from '../branchSheet';

// A thicket: three to five stems arching out of a stool and back in, sprigs
// off their upper halves, and a crown of small-leaf cards filling the arch.
// Head high and too dense to push through. Stands on y = 0.

const TAU = Math.PI * 2;

/** Sprigs enter at level 2, so a sprig forks once into twigs and no further. */
const THICKET_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [2, 3],
    [2, 3],
    [2, 3],
  ],
  lengthRatio: [
    [0.5, 0.7],
    [0.45, 0.65],
    [0.4, 0.6],
  ],
  angle: [
    [0.5, 0.95],
    [0.45, 0.9],
    [0.45, 0.9],
  ],
  along: [
    [0.2, 0.9],
    [0.25, 0.95],
    [0.3, 0.95],
  ],
  lift: [0.3, 0.3, 0.22, 0.14],
  wobble: [0.14, 0.32, 0.42, 0.5],
  sides: [4, 4, 3, 3],
  levels: 3,
  swing: [0.2, 0.16],
  minRadius: 0.008,
};

export const thicket: MeshBuilder = {
  name: 'thicket',
  category: 'foliage',
  radius: 1.9,
  solid: true,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(2.2, 2.9);
    const spread = height * rng.range(0.38, 0.58);
    const live = rng.chance(0.5) ? PALETTE.BARK : shade(PALETTE.BARK_PALE, 0.94);
    const lean = rng.range(0, TAU);
    const pull = rng.range(0.08, 0.2);
    const species: Species = { colour: LEAVES.thicket, deciduous: true, bark: shade(live, 1.1), weight: heightWeight(height, 1.4) };
    const sway = heightRamp(0, height, 1.4);

    const limbs: Limb[] = [];
    const twigs: Twig[] = [];
    const heads: THREE.Vector3[] = [];
    const stems = rng.int(3, 5);
    const start = rng.range(0, TAU);
    for (let i = 0; i < stems; i++) {
      const bearing = start + (i / stems) * TAU + rng.around(0, 0.35);
      const rise = height * rng.range(0.82, 1);
      const girth = rng.range(0.028, 0.055);
      const out = spread * rng.range(0.62, 0.9);
      const back = rng.range(0.3, 0.72);
      const cos = Math.cos(bearing);
      const sin = Math.sin(bearing);
      const drift = new THREE.Vector3(Math.cos(lean) * pull, 0, Math.sin(lean) * pull);
      // Out to the knee at half height, then in and up to the tip: the arch.
      const base = new THREE.Vector3(cos * 0.06, 0, sin * 0.06);
      const knee = new THREE.Vector3(cos * out, rise * rng.range(0.4, 0.56), sin * out).addScaledVector(drift, rise * 0.5);
      const tip = new THREE.Vector3(cos * out * back, rise, sin * out * back).addScaledVector(drift, rise);
      const spine = [base, base.clone().lerp(knee, 0.5), knee, knee.clone().lerp(tip, 0.55), tip];
      const family: Family = { pivot: base.clone(), phase: rng.range(0, 1), swing: 0.22 };
      parts.push({
        geometry: sweep(spine, (t) => girth * (1 - 0.55 * t), 5),
        color: shade(live, rng.range(0.88, 1.1)),
        sway,
        branch: (x, y, z) => packBranch(x, y, z, family, null),
      });
      heads.push(tip);

      // Sprigs off the upper two thirds, leaving the stem outward and up.
      const curve = new THREE.CatmullRomCurve3(spine, false, 'centripetal', 0.5);
      const sprigs = rng.int(4, 6);
      const at = new THREE.Vector3();
      const dir = new THREE.Vector3();
      for (let k = 0; k < sprigs; k++) {
        const t = 0.34 + (0.62 * (k + rng.range(0.1, 0.9))) / sprigs;
        at.copy(curve.getPointAt(t));
        const roll = bearing + rng.range(-1.5, 1.5);
        dir.set(Math.cos(roll) * rng.range(0.5, 1), rng.range(0.5, 1.1), Math.sin(roll) * rng.range(0.5, 1)).normalize();
        growLimb(rng, at.clone(), dir, rng.range(0.3, 0.55) * spread, girth * rng.range(0.3, 0.45), 2, THICKET_GROWTH, limbs, twigs, family);
      }
    }
    for (const limb of limbs) {
      parts.push({ geometry: limbGeometry(limb), color: shade(live, rng.range(0.92, 1.08)), sway, branch: limbBranch(limb) });
    }

    const clouds: Cloud[] = [];
    for (const head of heads) {
      const r = spread * rng.range(0.42, 0.58);
      clouds.push(cloud(rng, head.clone().lerp(new THREE.Vector3(0, height * 0.6, 0), 0.28), new THREE.Vector3(r, r * 0.9, r), 0.22));
    }
    clouds.push(cloud(rng, new THREE.Vector3(Math.cos(lean) * pull * height * 0.5, height * 0.58, Math.sin(lean) * pull * height * 0.5), new THREE.Vector3(spread * 0.85, height * 0.4, spread * 0.85), 0.2));
    parts.push(...branchCards(rng, species, clouds, { twigs, count: 60, length: [0.35, 0.55], tiles: SHEET_OF.smallleaf, perTwig: 2, upward: 0.15 }));

    return finishFoliage(parts, 'thicket', rng.range(0, TAU), 0, scale);
  },
};
