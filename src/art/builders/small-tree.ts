import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { oakWood, type WoodForm } from '../oakwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';

// A small tree: one clear stem and a thin crown, the middle storey between
// `bush` and `tree`. A quarter of them come up in dry leaf. Stands on y = 0.

const TAU = Math.PI * 2;

/** One leader, a handful of short branches near the top, and nothing else. */
const SMALL_TREE_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [2, 4],
    [2, 3],
  ],
  lengthRatio: [
    [0.3, 0.45],
    [0.5, 0.7],
  ],
  angle: [
    [0.8, 1.2],
    [0.55, 1.0],
  ],
  along: [
    [0.1, 0.85],
    [0.25, 0.95],
  ],
  lift: [0.4, 0.3, 0.22],
  wobble: [0.1, 0.3, 0.45],
  sides: [5, 4, 4, 4],
  levels: 2,
  swing: [0.14, 0.12],
  minRadius: 0.013,
};

const SMALL_TREE: WoodForm = {
  height: [1.6, 2.8],
  butt: [0.038, 0.06],
  forkAt: [0.3, 0.42],
  spread: [0.26, 0.34],
  rootLength: [0.85, 0.95],
  ribs: [2, 3],
  flute: [0.2, 0.5],
  thin: 0.25,
  bark: PALETTE.BARK,
  pale: PALETTE.BARK_PALE,
  colour: LEAVES.broadleaf,
  growth: SMALL_TREE_GROWTH,
};

export const smallTree: MeshBuilder = {
  name: 'small-tree',
  category: 'foliage',
  radius: 1.1,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const pale = rng.chance(0.4);
    const dry = rng.chance(0.25);
    const wood = oakWood(rng, parts, { ...SMALL_TREE, bark: pale ? PALETTE.BARK_PALE : PALETTE.BARK, colour: dry ? LEAVES.dry : LEAVES.broadleaf });
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [0.7, 0.95], turn: false, cross: true }));
    return finishFoliage(parts, 'small-tree', rng.range(0, TAU), 0, scale);
  },
};
