import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { heightRamp, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';
import { LEAVES, branchCards, cloud, finishFoliage, heightWeight, type Cloud, type Species, type Twig } from '../foliage';
import { SHEET_OF } from '../branchSheet';
import { LATHE_NORMAL, LATHE_SIDES, lathe } from '../oakwood';
import { growLimb, limbBranch, limbGeometry, type GrowForm, type Limb } from '../limbs';

// A birch sapling: a banded white wand carrying two or three short shoots near
// its top, and nothing below them. The most mobile thing in the kit. On y = 0.

const TAU = Math.PI * 2;
const WHITE = 0xd7d2c3;

/** One fork and then twigs: a wand has no room for more. */
const SMALL_BIRCH_GROWTH: GrowForm = {
  children: [
    [2, 3],
    [2, 3],
  ],
  lengthRatio: [
    [0.5, 0.7],
    [0.45, 0.65],
  ],
  angle: [
    [0.4, 0.75],
    [0.5, 0.95],
  ],
  along: [
    [0.2, 0.9],
    [0.25, 0.95],
  ],
  lift: [0.4, 0.1, -0.35],
  wobble: [0.12, 0.3, 0.45],
  sides: [5, 4, 4, 4],
  levels: 2,
  swing: [0.12, 0.11],
  minRadius: 0.009,
};

export const smallBirch: MeshBuilder = {
  name: 'small-birch',
  category: 'foliage',
  radius: 1.3,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const height = rng.range(2.2, 3.05);
    const butt = rng.range(0.032, 0.05);
    const bendAt = rng.range(0, TAU);
    const bend = height * rng.range(0.006, 0.02);
    const spine = (y: number): THREE.Vector3 => {
      const off = bend * Math.max(0, y / height) ** 1.7;
      return new THREE.Vector3(Math.cos(bendAt) * off, y, Math.sin(bendAt) * off);
    };
    const species: Species = { colour: LEAVES.birch, deciduous: true, bark: shade(WHITE, 0.88), weight: heightWeight(height, 1.4) };

    const bands: number[] = [];
    for (let y = rng.range(0.2, 0.4); y < height * 0.8; y += rng.range(0.25, 0.6)) if (rng.chance(0.5)) bands.push(y);
    parts.push({
      geometry: lathe(spine, butt, height * 0.72, rng.int(2, 3), rng.range(0, TAU), 0.4, [0.15, 0.5], false),
      color: (x, y) => {
        for (const b of bands) if (Math.abs(y - b) < 0.06 && Math.sin(x * 23 + b) > -0.3) return shade(WHITE, 0.84);
        return shade(WHITE, 0.97 + Math.sin(y * 31 + x * 17) * 0.03);
      },
      sway: heightRamp(0, height, 1.6),
    });

    const twigs: Twig[] = [];
    const clouds: Cloud[] = [];
    const limbs: Limb[] = [];
    const shoots = rng.int(2, 3);
    const start = rng.range(0, TAU);
    for (let i = 0; i < shoots; i++) {
      const y = height * rng.range(0.5, 0.7);
      const at = spine(y);
      const bearing = start + i * 2.399963 + rng.around(0, 0.4);
      const dir = new THREE.Vector3(Math.cos(bearing) * 0.5, 1, Math.sin(bearing) * 0.5).normalize();
      growLimb(rng, at, dir, rng.range(0.5, 0.8) * (1 - y / height * 0.3), butt * 0.55, 1, SMALL_BIRCH_GROWTH, limbs, twigs);
    }
    // The wand goes on as the leader off the lathe's open top ring: same point,
    // same radius, same ten sides, rising on +Y so that ring is cut square.
    growLimb(rng, spine(height * 0.72), new THREE.Vector3(0, 1, 0), height * 0.28, butt * 0.6, 1, SMALL_BIRCH_GROWTH, limbs, twigs, null, null, LATHE_SIDES, LATHE_NORMAL);
    for (const limb of limbs) {
      const level = Math.min(limb.level, 3);
      parts.push({ geometry: limbGeometry(limb), color: shade(WHITE, 0.9 - level * 0.02), sway: heightRamp(0, height, 1.6), branch: limbBranch(limb) });
      if (limb.level !== 1) continue;
      const head = limb.points[limb.points.length - 1];
      const r = height * rng.range(0.16, 0.21);
      clouds.push(cloud(rng, head, new THREE.Vector3(r, r * 1.2, r), 0.2));
    }

    parts.push(...branchCards(rng, species, clouds, { twigs, count: 0, length: [0.6, 0.85], tiles: SHEET_OF.birch, turn: false, cross: true }));
    return finishFoliage(parts, 'small-birch', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
