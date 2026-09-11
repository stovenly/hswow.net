import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { oakWood, type WoodForm } from '../oakwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';

// Sycamore: a heavy bole under a big even dome, branching more often and
// shorter than an oak so the crown closes over and reads as one mass with no
// limbs showing through it. Stands on y = 0.

const TAU = Math.PI * 2;

/** More children, shorter, forking harder: the crown fills in instead of reaching out. */
const SYCAMORE_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [4, 5],
    [2, 3],
    [2, 3],
  ],
  lengthRatio: [
    [0.5, 0.7],
    [0.45, 0.65],
    [0.4, 0.6],
  ],
  angle: [
    [0.7, 1.1],
    [0.5, 0.9],
    [0.5, 0.95],
  ],
  along: [
    [0.1, 0.75],
    [0.3, 0.95],
    [0.35, 0.95],
  ],
  lift: [0.3, 0.25, 0.18, 0.1],
  wobble: [0.12, 0.26, 0.34, 0.44],
  sides: [8, 7, 5, 4],
  swing: [0.06, 0.07],
};

const SYCAMORE: WoodForm = {
  height: [13, 18],
  butt: [0.45, 0.6],
  forkAt: [0.2, 0.28],
  spread: [0.34, 0.4],
  rootLength: [0.7, 0.85],
  ribs: [3, 5],
  thin: 0.35,
  bark: 0x776b5c,
  pale: 0x847867,
  colour: LEAVES.sycamore,
  growth: SYCAMORE_GROWTH,
};

export const sycamore: MeshBuilder = {
  name: 'sycamore',
  category: 'foliage',
  radius: 7.5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = oakWood(rng, parts, SYCAMORE);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [2.4, 3.2], turn: false, cross: true }));
    return finishFoliage(parts, 'sycamore', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
