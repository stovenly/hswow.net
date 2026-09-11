import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import { FIN_FLAG } from '../canopy';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { oakWood, type WoodForm } from '../oakwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';
import { SHEET_OF } from '../branchSheet';

// An orchard tree: a short trunk forking low into a round crown, blossom in
// spring and fruit in autumn. Apple or pear by the seed. Stands on y = 0.

const TAU = Math.PI * 2;

/** A low fork into short limbs that turn up early: a pruned crown, open in the middle. */
const FRUIT_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [3, 4],
    [2, 3],
  ],
  lengthRatio: [
    [0.45, 0.65],
    [0.45, 0.65],
  ],
  angle: [
    [0.8, 1.2],
    [0.5, 0.95],
  ],
  along: [
    [0.06, 0.55],
    [0.25, 0.95],
  ],
  lift: [0.35, 0.4, 0.3],
  wobble: [0.12, 0.3, 0.42],
  sides: [6, 5, 4, 4],
  levels: 2,
  swing: [0.12, 0.11],
  minRadius: 0.022,
};

const FRUIT: WoodForm = {
  height: [3.2, 4.2],
  butt: [0.14, 0.2],
  forkAt: [0.3, 0.38],
  spread: [0.3, 0.36],
  rootLength: [0.55, 0.7],
  ribs: [2, 3],
  flute: [0.3, 1.0],
  bark: PALETTE.BARK,
  pale: PALETTE.BARK_PALE,
  colour: LEAVES.fruit,
  growth: FRUIT_GROWTH,
};

export const fruit: MeshBuilder = {
  name: 'fruit',
  category: 'foliage',
  radius: 2,
  nameFor: (seed) => (createRng(seed).chance(0.6) ? 'apple tree' : 'pear tree'),

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const apple = rng.chance(0.6);
    const parts: Part[] = [];
    const wood = oakWood(rng, parts, FRUIT);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [1.0, 1.4], turn: false, cross: true }));
    const flowering = wood.twigs.filter((_, i) => i % 3 === 0);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: flowering, count: 0, length: [0.8, 1.1], tiles: SHEET_OF.blossom, turn: false, cross: true, flag: FIN_FLAG.blossom, colour: apple ? LEAVES.blossomPink : LEAVES.blossomWhite }));
    const bearing = wood.twigs.filter((_, i) => i % 4 === 1);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: bearing, count: 0, length: [0.6, 0.85], tiles: SHEET_OF.blossom, turn: false, cross: true, flag: FIN_FLAG.fruit, colour: apple ? LEAVES.apple : LEAVES.pear }));
    return finishFoliage(parts, 'fruit', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
