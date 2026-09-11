import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { blend } from '../palette';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { oakWood, type WoodForm } from '../oakwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';
import { SHEET_OF } from '../branchSheet';

// Scots pine: a bare bole for two thirds of the height, grey-brown and plated
// below, orange-red where it comes out of the wood, then limbs leaving nearly
// level into flat plates of needle cards and nothing under them. Stands on
// y = 0.

const TAU = Math.PI * 2;

/** Limbs only high on the bole, leaving level and tipping up at the ends: a plate, not a dome. */
const PINE_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [3, 4],
    [2, 3],
    [2, 3],
  ],
  lengthRatio: [
    [0.45, 0.65],
    [0.55, 0.75],
    [0.5, 0.7],
  ],
  angle: [
    [1.0, 1.35],
    [0.7, 1.05],
    [0.6, 1.0],
  ],
  along: [
    [0.35, 0.95],
    [0.3, 0.95],
    [0.35, 0.95],
  ],
  lift: [0.2, -0.04, 0.1, 0.18],
  wobble: [0.08, 0.2, 0.3, 0.4],
  sides: [7, 6, 5, 4],
  swing: [0.07, 0.08],
};

const PINE: WoodForm = {
  height: [12, 18],
  butt: [0.3, 0.42],
  forkAt: [0.6, 0.68],
  spread: [0.24, 0.3],
  rootLength: [0.7, 0.88],
  ribs: [3, 4],
  crownFlat: 0.5,
  evergreen: true,
  // Grey-brown and plated to halfway, then the orange bole, which is the one thing everybody knows about this tree.
  bark: (t) => blend(0x6a5a4a, 0xa9663a, (t - 0.34) / 0.24),
  pale: 0xb0723f,
  colour: LEAVES.pine,
  growth: PINE_GROWTH,
};

export const pine: MeshBuilder = {
  name: 'pine',
  category: 'foliage',
  radius: 5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = oakWood(rng, parts, PINE);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [1, 1], tiles: SHEET_OF.pine, perTwig: 2, turn: false, cross: true, lengthOf: (twig) => Math.max(1.1, twig.from.distanceTo(twig.to) * 1.3) }));
    return finishFoliage(parts, 'pine', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
