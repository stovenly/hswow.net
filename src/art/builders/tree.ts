import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { oakWood, type WoodForm } from '../oakwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';

// The generic broadleaf: the cheap one the middle distance is made of. A short
// trunk, a few limbs, one round crown. Stands on y = 0.

const TAU = Math.PI * 2;

/** Two levels and few children: this tree is judged at thirty metres and pays for nothing nearer. */
const TREE_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [3, 4],
    [2, 3],
  ],
  lengthRatio: [
    [0.5, 0.7],
    [0.45, 0.65],
  ],
  angle: [
    [0.7, 1.1],
    [0.5, 0.9],
  ],
  along: [
    [0.1, 0.7],
    [0.3, 0.95],
  ],
  lift: [0.32, 0.28, 0.18],
  wobble: [0.12, 0.28, 0.4],
  sides: [6, 5, 4, 4],
  levels: 2,
  swing: [0.11, 0.1],
  minRadius: 0.02,
};

const TREE: WoodForm = {
  height: [3.2, 4.6],
  butt: [0.16, 0.24],
  forkAt: [0.4, 0.5],
  spread: [0.32, 0.4],
  rootLength: [0.7, 0.88],
  ribs: [2, 3],
  flute: [0.35, 1.0],
  bark: PALETTE.BARK,
  pale: PALETTE.BARK_PALE,
  colour: LEAVES.broadleaf,
  growth: TREE_GROWTH,
};

export const tree: MeshBuilder = {
  name: 'tree',
  category: 'foliage',
  radius: 2.2,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = oakWood(rng, parts, TREE);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [1.1, 1.5], turn: false, cross: true }));
    return finishFoliage(parts, 'tree', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
