import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { heightRamp, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { FIN_FLAG } from '../canopy';
import { LEAVES, branchCards, cloud, finishFoliage, heightWeight, type Cloud, type Species, type Twig } from '../foliage';
import { SHEET_OF } from '../branchSheet';
import { OAK_GROWTH, growLimb, limbBranch, limbGeometry, sweep, type GrowForm, type Limb } from '../limbs';

// Hawthorn: a short trunk bent by the wind, its dense crown streaming toward
// +Z, white with blossom for a few weeks of spring. A placer turns +Z downwind.
// Stands on y = 0.

const TAU = Math.PI * 2;

/** Short, dense and forking once: a hawthorn is twigs, not limbs. */
const HAWTHORN_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [2, 3],
    [3, 4],
  ],
  lengthRatio: [
    [0.5, 0.7],
    [0.45, 0.65],
  ],
  angle: [
    [0.6, 1.0],
    [0.55, 1.0],
  ],
  along: [
    [0.2, 0.9],
    [0.25, 0.95],
  ],
  lift: [0.3, 0.2, 0.12],
  wobble: [0.12, 0.35, 0.5],
  sides: [5, 5, 4, 4],
  levels: 2,
  swing: [0.1, 0.09],
  minRadius: 0.015,
};

export const hawthorn: MeshBuilder = {
  name: 'hawthorn',
  category: 'foliage',
  radius: 1.7,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(1.3, 1.9);
    const lean = rng.range(0.05, 0.12);
    const butt = rng.range(0.09, 0.13);
    const bark = shade(PALETTE.BARK, rng.range(0.9, 1.05));
    const species: Species = { colour: LEAVES.hawthorn, deciduous: true, bark: shade(PALETTE.BARK_PALE, 1.0), weight: heightWeight(height + 1, 1.6) };
    const ramp = heightRamp(0, height + 1, 1.6);

    // rotateX(lean) takes +Y toward +Z, the way the wind has pushed it. Above the
    // knee it stands back up: a knee that turns further the same way every roll is
    // a fold, and every tree gets one.
    const lowerLength = height * 0.5;
    const knee = new THREE.Vector3(0, lowerLength * Math.cos(lean), lowerLength * Math.sin(lean));
    const upperLean = lean * 0.4;
    const upperLength = height - lowerLength;
    const top = new THREE.Vector3(0, knee.y + upperLength * Math.cos(upperLean), knee.z + upperLength * Math.sin(upperLean));
    // One tube through the knee rather than two rods meeting at it.
    parts.push({ geometry: sweep([new THREE.Vector3(0, -0.05, 0), knee, top], (t) => butt * (1 - 0.45 * t), 6), color: bark, sway: ramp });

    const twigs: Twig[] = [];
    const limbs: Limb[] = [];
    const heads = rng.int(3, 4);
    const start = rng.range(0, TAU);
    for (let i = 0; i < heads; i++) {
      const bearing = start + (i / heads) * TAU + rng.around(0, 0.4);
      // Every limb carries a length of +Z, so the whole crown is pushed downwind rather than sitting square on the trunk.
      const dir = new THREE.Vector3(Math.cos(bearing) * 0.85, rng.range(0.7, 1.0), Math.sin(bearing) * 0.85 + 0.4).normalize();
      growLimb(rng, top.clone().lerp(knee, 0.06), dir, rng.range(0.8, 1.2), butt * 0.5, 1, HAWTHORN_GROWTH, limbs, twigs);
    }
    for (const limb of limbs) {
      const level = Math.min(limb.level, 3);
      parts.push({ geometry: limbGeometry(limb), color: shade(bark, 1 + level * 0.03), sway: ramp, branch: limbBranch(limb) });
    }

    const clouds: Cloud[] = [];
    for (const limb of limbs) {
      if (limb.level !== 1) continue;
      const head = limb.points[limb.points.length - 1];
      const r = rng.range(0.55, 0.75);
      clouds.push(cloud(rng, head, new THREE.Vector3(r, r * 0.75, r), 0.24));
    }
    clouds.push(cloud(rng, new THREE.Vector3(top.x, top.y + 0.25, top.z + 0.55), new THREE.Vector3(rng.range(0.9, 1.15), rng.range(0.55, 0.7), rng.range(1.0, 1.3)), 0.22));

    parts.push(...branchCards(rng, species, clouds, { twigs, count: 0, length: [0.7, 0.95], tiles: SHEET_OF.smallleaf, turn: false, cross: true }));
    const flowering = twigs.filter((_, i) => i % 3 === 0);
    parts.push(...branchCards(rng, species, clouds, { twigs: flowering, count: 0, length: [0.6, 0.85], tiles: SHEET_OF.blossom, turn: false, cross: true, flag: FIN_FLAG.blossom, colour: LEAVES.blossomWhite }));

    return finishFoliage(parts, 'hawthorn', rng.range(0, TAU), 0, scale);
  },
};
