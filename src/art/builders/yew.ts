import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { oakWood, type WoodForm } from '../oakwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';
import { SHEET_OF } from '../branchSheet';

// Yew: a short massive bole, fluted almost to the fork as though several stems
// had grown together, under a wide low crown dense enough to stop light. The
// density is two cards a twig, not more wood. Stands on y = 0.

const TAU = Math.PI * 2;

/** The oak's counts on a smaller tree: limbs leaving wide and low, and forking short. */
const YEW_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [3, 4],
    [2, 3],
    [2, 3],
  ],
  lengthRatio: [
    [0.5, 0.7],
    [0.5, 0.7],
    [0.45, 0.65],
  ],
  angle: [
    [0.85, 1.25],
    [0.55, 0.95],
    [0.5, 0.9],
  ],
  along: [
    [0.1, 0.8],
    [0.3, 0.95],
    [0.3, 0.95],
  ],
  lift: [0.22, 0.14, 0.12, 0.1],
  wobble: [0.16, 0.3, 0.4, 0.5],
  sides: [8, 6, 5, 4],
  swing: [0.03, 0.04],
};

const YEW: WoodForm = {
  height: [7, 11],
  butt: [0.45, 0.62],
  forkAt: [0.18, 0.24],
  spread: [0.34, 0.42],
  rootLength: [0.7, 0.85],
  ribs: [5, 7],
  flute: [0.3, 4.5],
  thin: 0.18,
  fissure: 0.4,
  evergreen: true,
  bark: 0x6b4436,
  pale: 0x744a3c,
  colour: LEAVES.yew,
  growth: YEW_GROWTH,
};

export const yew: MeshBuilder = {
  name: 'yew',
  category: 'foliage',
  radius: 5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = oakWood(rng, parts, YEW);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [1.3, 1.8], tiles: SHEET_OF.conifer, perTwig: 2, turn: false, cross: true }));
    return finishFoliage(parts, 'yew', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
