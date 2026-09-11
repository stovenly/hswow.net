import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { oakWood, type WoodForm } from '../oakwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';
import { SHEET_OF } from '../branchSheet';

// Ash: a straight pale bole forking high into few long limbs that leave wide
// and are pulled back toward the sky along their length, so a branch is a
// shallow S ending at the top of the crown. Airy: you see through an ash.
// Stands on y = 0.

const TAU = Math.PI * 2;

/** Few children, long, and lifted harder at every level out: the sweep out and back up. */
const ASH_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [2, 3],
    [2, 2],
    [2, 3],
  ],
  lengthRatio: [
    [0.7, 0.9],
    [0.6, 0.8],
    [0.55, 0.75],
  ],
  angle: [
    [0.7, 1.05],
    [0.4, 0.7],
    [0.35, 0.65],
  ],
  along: [
    [0.2, 0.8],
    [0.35, 0.95],
    [0.4, 0.95],
  ],
  lift: [0.35, 0.3, 0.5, 0.6],
  wobble: [0.1, 0.2, 0.3, 0.4],
  swing: [0.14, 0.15],
};

const ASH: WoodForm = {
  height: [12, 14.5],
  butt: [0.34, 0.44],
  forkAt: [0.34, 0.42],
  spread: [0.24, 0.29],
  rootLength: [0.8, 0.92],
  ribs: [2, 3],
  bark: 0x6a6459,
  pale: 0x7a746a,
  colour: LEAVES.ash,
  growth: ASH_GROWTH,
};

export const ash: MeshBuilder = {
  name: 'ash',
  category: 'foliage',
  radius: 5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = oakWood(rng, parts, ASH);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [2.2, 3.0], tiles: SHEET_OF.pinnate, turn: false, cross: true }));
    return finishFoliage(parts, 'ash', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
