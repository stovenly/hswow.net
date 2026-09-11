import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { heightRamp, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';
import { LEAVES, branchCards, cloud, finishFoliage, heightWeight, type Cloud, type Species, type Twig } from '../foliage';
import { SHEET_OF } from '../branchSheet';
import { LATHE_NORMAL, LATHE_SIDES, lathe } from '../oakwood';
import { growLimb, limbBranch, limbGeometry, type GrowForm, type Limb } from '../limbs';

// Birch: a white lathe pole faintly banded, bare for half its height, three or
// four primaries grown from the upper half, fine and upswept then hanging at
// the twigs, whose crossed cards wear the birch sheet's shoots. Stands on
// y = 0.

const TAU = Math.PI * 2;
const WHITE = 0xd7d2c3;

/** Fine and upswept, then the twigs let go and hang. */
const BIRCH_GROWTH: GrowForm = {
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
    [0.4, 0.7],
    [0.4, 0.7],
    [0.5, 0.9],
  ],
  along: [
    [0.25, 0.9],
    [0.3, 0.95],
    [0.3, 0.95],
  ],
  lift: [0.5, 0.25, -0.1, -0.45],
  wobble: [0.15, 0.3, 0.4, 0.5],
  sides: [6, 5, 4, 4],
  levels: 3,
  swing: [0.16, 0.14],
  minRadius: 0.04,
};

export const birch: MeshBuilder = {
  name: 'birch',
  category: 'foliage',
  radius: 3.2,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const height = rng.range(8, 11);
    const butt = rng.range(0.15, 0.21);
    const bendAt = rng.range(0, TAU);
    const bend = rng.range(0.1, 0.32);
    const spine = (y: number): THREE.Vector3 => {
      const t = Math.max(0, y / height);
      const off = bend * t ** 2.4;
      return new THREE.Vector3(Math.cos(bendAt) * off, y, Math.sin(bendAt) * off);
    };
    const species: Species = { colour: LEAVES.birch, deciduous: true, bark: shade(WHITE, 0.86), weight: heightWeight(height, 1.6) };

    const bands: number[] = [];
    for (let y = rng.range(0.2, 0.5); y < height * 0.85; y += rng.range(0.35, 0.9)) if (rng.chance(0.6)) bands.push(y);
    parts.push({
      geometry: lathe(spine, butt, height * 0.86, rng.int(2, 3), rng.range(0, TAU), 0.72, undefined, false),
      color: (x, y, z) => {
        // A face is half a metre tall, so a band is a whole face: kept to a few percent rather than the birch's black.
        for (const b of bands) if (Math.abs(y - b) < 0.1 && Math.sin(x * 9 + z * 7 + b) > -0.3) return shade(WHITE, 0.86);
        return shade(WHITE, 0.97 + Math.sin(y * 31 + x * 17) * 0.03);
      },
      sway: heightRamp(0, height, 1.6),
    });

    // Primaries grown off the upper pole, each forking twice into twigs that hang.
    const twigs: Twig[] = [];
    const clouds: Cloud[] = [];
    const limbs: Limb[] = [];
    const primaries = rng.int(3, 4);
    const lean = rng.range(0, TAU);
    for (let i = 0; i < primaries; i++) {
      const y = height * rng.range(0.45, 0.78);
      const at = spine(y);
      const bearing = lean + i * 2.399963 + rng.around(0, 0.4);
      const dir = new THREE.Vector3(Math.cos(bearing) * 0.55, 1, Math.sin(bearing) * 0.55).normalize();
      growLimb(rng, at, dir, rng.range(2.2, 3.4) * (1 - (y / height) * 0.3), butt * 0.45, 1, BIRCH_GROWTH, limbs, twigs);
    }
    // The pole goes on as the leader off the lathe's open top ring: same point,
    // same radius, same ten sides, rising on +Y so that ring is cut square.
    growLimb(rng, spine(height * 0.86), new THREE.Vector3(0, 1, 0), height * 0.16, butt * 0.28, 1, BIRCH_GROWTH, limbs, twigs, null, null, LATHE_SIDES, LATHE_NORMAL);
    for (const limb of limbs) {
      const level = Math.min(limb.level, 3);
      parts.push({ geometry: limbGeometry(limb), color: shade(WHITE, 0.9 - level * 0.02), sway: heightRamp(0, height, 1.6), branch: limbBranch(limb) });
    }
    for (const limb of limbs) {
      if (limb.level !== 1) continue;
      const head = limb.points[limb.points.length - 1];
      clouds.push(cloud(rng, head.clone().add(new THREE.Vector3(0, 0.3, 0)), new THREE.Vector3(1.7, 2.0, 1.7), 0.15));
    }

    parts.push(...branchCards(rng, species, clouds, { twigs, count: 0, length: [1.9, 2.5], tiles: SHEET_OF.birch, turn: false, cross: true }));
    return finishFoliage(parts, 'birch', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
