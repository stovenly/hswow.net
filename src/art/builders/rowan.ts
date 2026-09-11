import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { oakWood, type WoodForm } from '../oakwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';
import { SHEET_OF } from '../branchSheet';

// Rowan: a slight silver-grey pole forking at half height into a few upswept
// limbs, the whole tree narrow and open — the tree that grows on rock and in
// gullies where nothing bigger will. Stands on y = 0.

const TAU = Math.PI * 2;

/** Few limbs, every one leaving at a shallow angle and pulled hard upward. */
const ROWAN_GROWTH: GrowForm = {
  ...OAK_GROWTH,
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
    [0.3, 0.6],
    [0.3, 0.6],
    [0.35, 0.7],
  ],
  along: [
    [0.15, 0.9],
    [0.3, 0.95],
    [0.3, 0.95],
  ],
  lift: [0.5, 0.45, 0.4, 0.3],
  wobble: [0.12, 0.25, 0.35, 0.45],
  sides: [6, 5, 4, 4],
  swing: [0.13, 0.13],
};

const ROWAN: WoodForm = {
  height: [6, 9],
  butt: [0.16, 0.22],
  forkAt: [0.38, 0.48],
  spread: [0.24, 0.3],
  rootLength: [0.78, 0.92],
  ribs: [2, 3],
  flute: [0.25, 1.1],
  thin: 0.22,
  bark: 0x8a887c,
  pale: 0x96948a,
  colour: LEAVES.rowan,
  growth: ROWAN_GROWTH,
};

export const rowan: MeshBuilder = {
  name: 'rowan',
  category: 'foliage',
  radius: 3,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = oakWood(rng, parts, ROWAN);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [1.5, 2.1], tiles: SHEET_OF.pinnate, turn: false, cross: true }));
    return finishFoliage(parts, 'rowan', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
