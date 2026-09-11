import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { heightRamp, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { LEAVES, branchCards, cloud, finishFoliage, heightWeight, type Cloud, type Species, type Twig } from '../foliage';
import { SHEET_OF } from '../branchSheet';
import { endNormal, growLimb, limbBranch, limbGeometry, sweep, type GrowForm, type Limb } from '../limbs';

// Willow: one leaning trunk swept as a tube, limbs grown from its top reaching
// out and up and falling at the twigs, whose crossed cards wear the willow
// sheet's broom so the shoots hang. Leans toward +Z on y = 0, so a placer aims
// it at the water.

const TAU = Math.PI * 2;

/** Limbs reach out and up, then everything after them falls. */
const WILLOW_GROWTH: GrowForm = {
  children: [
    [2, 3],
    [2, 3],
    [2, 3],
  ],
  lengthRatio: [
    [0.6, 0.8],
    [0.55, 0.75],
    [0.5, 0.7],
  ],
  angle: [
    [0.6, 1.0],
    [0.5, 0.9],
    [0.5, 0.9],
  ],
  along: [
    [0.3, 0.95],
    [0.3, 0.95],
    [0.4, 1.0],
  ],
  lift: [0.15, 0.05, -0.55, -1.1],
  wobble: [0.15, 0.3, 0.35, 0.3],
  sides: [7, 6, 5, 4],
  levels: 3,
  swing: [0.12, 0.13],
  minRadius: 0.04,
};

export const willow: MeshBuilder = {
  name: 'willow',
  category: 'foliage',
  radius: 4.5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const height = rng.range(5, 6.5);
    const lean = rng.range(0.12, 0.26);
    const butt = rng.range(0.26, 0.36);
    const bark = shade(PALETTE.BARK_PALE, rng.range(0.9, 1.02));
    const species: Species = { colour: LEAVES.willow, deciduous: true, bark: shade(bark, 1.02), weight: heightWeight(height, 1.8) };
    const ramp = heightRamp(0, height, 1.8);

    // One trunk leaning toward +Z, bending harder above its knee, swept as a single tube.
    const knee = new THREE.Vector3(0, height * 0.48 * Math.cos(lean), height * 0.48 * Math.sin(lean));
    const top = new THREE.Vector3(0, knee.y + height * 0.52 * Math.cos(lean * 1.8), knee.z + height * 0.52 * Math.sin(lean * 1.8));
    const trunkPoints = [new THREE.Vector3(0, -0.1, 0), new THREE.Vector3(0, height * 0.2, height * 0.2 * Math.sin(lean) * 0.6), knee, top];
    const TRUNK_SIDES = 8;
    const trunkR = (t: number): number => butt * (1.15 - 0.6 * t) * (1 + 0.25 * Math.max(0, 1 - t * 6));
    parts.push({ geometry: sweep(trunkPoints, trunkR, TRUNK_SIDES, false), color: bark, sway: ramp });

    // Limbs grown from the top, reaching out and up, then falling at the twigs.
    const twigs: Twig[] = [];
    const clouds: Cloud[] = [];
    const limbs: Limb[] = [];
    const count = rng.int(4, 6);
    for (let i = 0; i < count; i++) {
      const bearing = (i / count) * TAU + rng.around(0, 0.4);
      const dir = new THREE.Vector3(Math.sin(bearing), 0.7, Math.cos(bearing)).normalize();
      growLimb(rng, top.clone().lerp(knee, 0.08), dir, rng.range(2.2, 3.2), butt * 0.5, 1, WILLOW_GROWTH, limbs, twigs);
    }
    // The leader starts on the trunk's own end ring: its last point, its end
    // tangent, its radius there, its eight sides and the frame it ended on.
    growLimb(rng, top, top.clone().sub(knee).normalize(), rng.range(1.8, 2.6), trunkR(1), 1, WILLOW_GROWTH, limbs, twigs, null, null, TRUNK_SIDES, endNormal(trunkPoints));
    for (const limb of limbs) {
      const level = Math.min(limb.level, 3);
      parts.push({ geometry: limbGeometry(limb), color: shade(bark, 1 + level * 0.02), sway: ramp, branch: limbBranch(limb) });
      if (limb.level === 1) {
        const head = limb.points[limb.points.length - 1];
        clouds.push(cloud(rng, head.clone().add(new THREE.Vector3(0, -1.0, 0)), new THREE.Vector3(1.7, 2.3, 1.7), 0.14));
      }
    }
    clouds.push(cloud(rng, top.clone().add(new THREE.Vector3(0, 0.3, 0.3)), new THREE.Vector3(2.6, 1.8, 2.6), 0.16));

    parts.push(...branchCards(rng, species, clouds, { twigs, count: 0, length: [3.2, 4.4], tiles: SHEET_OF.willow, turn: false, cross: true }));
    return finishFoliage(parts, 'willow', rng.range(0, TAU), 0, scale);
  },
};
