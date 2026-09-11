import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { oakWood, type WoodForm } from '../oakwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';

// Alder: wet ground and only wet ground. One to three stems off a low stool,
// short level branches all the way up a straight leader so the crown is narrow
// and conical, and the darkest bark and leaf in the kit. Stands on y = 0.

const TAU = Math.PI * 2;

/** Short branches leaving level off a leader that keeps going straight up. */
const ALDER_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [3, 4],
    [2, 3],
    [2, 3],
  ],
  lengthRatio: [
    [0.45, 0.6],
    [0.5, 0.7],
    [0.5, 0.7],
  ],
  angle: [
    [0.85, 1.2],
    [0.55, 0.95],
    [0.5, 0.9],
  ],
  along: [
    [0.1, 0.9],
    [0.3, 0.95],
    [0.3, 0.95],
  ],
  lift: [0.4, 0.06, 0.02, -0.05],
  wobble: [0.1, 0.25, 0.35, 0.45],
  sides: [7, 6, 5, 4],
  swing: [0.09, 0.1],
  minRadius: 0.04,
};

const ALDER: WoodForm = {
  height: [8.5, 11.5],
  butt: [0.26, 0.34],
  forkAt: [0.12, 0.18],
  spread: [0.2, 0.25],
  rootLength: [0.86, 0.95],
  stems: [1, 3],
  ribs: [3, 4],
  bark: 0x3a332b,
  pale: 0x4a4238,
  colour: LEAVES.alder,
  growth: ALDER_GROWTH,
};

export const alder: MeshBuilder = {
  name: 'alder',
  category: 'foliage',
  radius: 3.2,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = oakWood(rng, parts, ALDER);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [1.8, 2.4], turn: false, cross: true }));
    return finishFoliage(parts, 'alder', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
