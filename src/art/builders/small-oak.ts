import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { oakWood, type WoodForm } from '../oakwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';

// A young oak: one leader with side branches nearly level all the way up and no
// fork, which is what says sapling rather than small tree. Stands on y = 0.

const TAU = Math.PI * 2;

/** Side branches the whole length of the leader, leaving it square and staying short. */
const SMALL_OAK_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [4, 6],
    [2, 3],
  ],
  lengthRatio: [
    [0.22, 0.34],
    [0.5, 0.7],
  ],
  angle: [
    [1.0, 1.35],
    [0.6, 1.0],
  ],
  along: [
    [0.15, 0.95],
    [0.25, 0.95],
  ],
  lift: [0.35, 0.15, 0.2],
  wobble: [0.1, 0.25, 0.4],
  sides: [6, 5, 4, 4],
  levels: 2,
  swing: [0.1, 0.1],
  minRadius: 0.014,
};

const SMALL_OAK: WoodForm = {
  height: [2.6, 3.8],
  butt: [0.06, 0.09],
  forkAt: [0.12, 0.18],
  spread: [0.3, 0.38],
  rootLength: [0.9, 0.98],
  ribs: [2, 3],
  flute: [0.25, 0.5],
  thin: 0.25,
  bark: PALETTE.BARK,
  pale: PALETTE.BARK_PALE,
  colour: LEAVES.broadleaf,
  growth: SMALL_OAK_GROWTH,
};

export const smallOak: MeshBuilder = {
  name: 'small-oak',
  category: 'foliage',
  radius: 1.4,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = oakWood(rng, parts, SMALL_OAK);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [0.7, 0.95], turn: false, cross: true }));
    return finishFoliage(parts, 'small-oak', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
