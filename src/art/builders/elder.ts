import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { FIN_FLAG } from '../canopy';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { stoolWood, type StoolForm } from '../stoolwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';
import { SHEET_OF } from '../branchSheet';

// Elder: a low wide sheaf of soft-wooded stems under big loose pinnate leaves,
// hung with black berries in autumn. Stands on y = 0.

const TAU = Math.PI * 2;

/** Fewer, heavier stems than a hazel's, leaving the stool at a wider angle. */
const ELDER_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [2, 3],
    [2, 3],
  ],
  lengthRatio: [
    [0.45, 0.65],
    [0.4, 0.6],
  ],
  angle: [
    [0.6, 1.0],
    [0.5, 0.9],
  ],
  along: [
    [0.25, 0.9],
    [0.3, 0.95],
  ],
  lift: [0.3, 0.22, 0.14],
  wobble: [0.12, 0.32, 0.42],
  sides: [5, 5, 4, 4],
  levels: 2,
  swing: [0.22, 0.18],
  minRadius: 0.013,
};

const ELDER: StoolForm = {
  height: [2.0, 2.9],
  spread: [0.5, 0.65],
  rods: [5, 7],
  butt: [0.026, 0.042],
  reach: [0.35, 0.8],
  bark: 0x60564a,
  colour: LEAVES.broadleaf,
  growth: ELDER_GROWTH,
};

export const elder: MeshBuilder = {
  name: 'elder',
  category: 'foliage',
  radius: 1.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = stoolWood(rng, parts, ELDER);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [0.9, 1.25], tiles: SHEET_OF.pinnate, turn: false, cross: true }));
    const berried = wood.twigs.filter((_, i) => i % 4 === 0);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: berried, count: 0, length: [0.7, 0.95], tiles: SHEET_OF.blossom, turn: false, cross: true, flag: FIN_FLAG.fruit, colour: LEAVES.elderberry }));
    return finishFoliage(parts, 'elder', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
