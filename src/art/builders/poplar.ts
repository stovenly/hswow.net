import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { oakWood, type WoodForm } from '../oakwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';

// Poplar: the columnar one. Every limb leaves the bole at a few degrees off
// vertical and is pulled straight back against it, so a twenty-metre tree is
// three metres across. Stands on y = 0.

const TAU = Math.PI * 2;

/** Shallow angles and hard lift at every level: nothing ever gets away from the bole. */
const POPLAR_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [7, 9],
    [3, 4],
  ],
  lengthRatio: [
    [0.14, 0.24],
    [0.4, 0.6],
  ],
  angle: [
    [0.29, 0.48],
    [0.15, 0.4],
  ],
  along: [
    [0.05, 0.95],
    [0.2, 0.95],
  ],
  lift: [0.55, 0.7, 0.6],
  wobble: [0.06, 0.12, 0.22],
  sides: [7, 6, 5, 4],
  levels: 2,
  slender: 0.7,
  swing: [0.05, 0.06],
};

const POPLAR: WoodForm = {
  height: [16, 22],
  butt: [0.3, 0.4],
  forkAt: [0.1, 0.16],
  spread: [0.09, 0.12],
  rootLength: [0.9, 0.97],
  ribs: [3, 4],
  flute: [0.35, 1.2],
  thin: 0.12,
  crownFlat: 2.2,
  bark: 0x6a6357,
  pale: 0x776f62,
  colour: LEAVES.poplar,
  growth: POPLAR_GROWTH,
};

export const poplar: MeshBuilder = {
  name: 'poplar',
  category: 'foliage',
  radius: 3,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = oakWood(rng, parts, POPLAR);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [1.6, 2.2], turn: false, cross: true }));
    return finishFoliage(parts, 'poplar', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
