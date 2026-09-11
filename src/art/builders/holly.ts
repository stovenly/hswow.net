import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { oakWood, type WoodForm } from '../oakwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';
import { SHEET_OF } from '../branchSheet';

// Holly: a slim smooth grey pole branching from low down into a narrow
// evergreen cone. The mass is in the cards, not in the wood. Stands on y = 0.

const TAU = Math.PI * 2;

/** Two levels only: a small tree carries a small amount of wood, and the cards close the cone over it. */
const HOLLY_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [3, 4],
    [2, 3],
  ],
  lengthRatio: [
    [0.4, 0.55],
    [0.5, 0.7],
  ],
  angle: [
    [0.6, 0.95],
    [0.5, 0.85],
  ],
  along: [
    [0.06, 0.95],
    [0.2, 0.95],
  ],
  lift: [0.45, 0.3, 0.25],
  wobble: [0.14, 0.28, 0.38],
  sides: [6, 5, 4, 4],
  levels: 2,
  swing: [0.04, 0.05],
};

const HOLLY: WoodForm = {
  height: [4, 7],
  butt: [0.12, 0.17],
  forkAt: [0.14, 0.2],
  spread: [0.2, 0.26],
  rootLength: [0.82, 0.94],
  ribs: [3, 4],
  flute: [0.2, 0.8],
  thin: 0.35,
  evergreen: true,
  bark: 0x6d6a60,
  pale: 0x7a776c,
  colour: LEAVES.holly,
  growth: HOLLY_GROWTH,
};

export const holly: MeshBuilder = {
  name: 'holly',
  category: 'foliage',
  radius: 2.2,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = oakWood(rng, parts, HOLLY);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [1.0, 1.4], tiles: SHEET_OF.smallleaf, perTwig: 2, turn: false, cross: true }));
    return finishFoliage(parts, 'holly', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
