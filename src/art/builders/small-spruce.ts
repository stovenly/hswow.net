import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { SHEET_CONIFER } from '../branchSheet';
import { whorlWood, type WhorlForm } from '../whorlwood';

// A young spruce: the adult's whorls on a thin stem, tiered nearly to the
// ground and stiffer for its size than anything else that grows. On y = 0.

const TAU = Math.PI * 2;

const SMALL_SPRUCE: WhorlForm = {
  height: [2.1, 3.4],
  butt: [0.045, 0.07],
  bend: [0.01, 0.03],
  ribs: [2, 3],
  thin: 0.7,
  latheTop: 0.95,
  skirt: [0.06, 0.12],
  step: [0.26, 0.36],
  arms: [4, 5],
  reach: 0.22,
  hem: 0.06,
  minReach: 0.09,
  stub: 0.06,
  swing: 0.05,
  cloudStep: 0.55,
  cloudLift: 0.14,
  cloudHeight: 0.38,
  leaderSpray: 0.22,
  tipCloud: [0.18, 0.28],
  bark: PALETTE.BARK,
  colour: LEAVES.conifer,
};

export const smallSpruce: MeshBuilder = {
  name: 'small-spruce',
  category: 'foliage',
  radius: 1.0,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = whorlWood(rng, parts, SMALL_SPRUCE);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [1, 1], tiles: SHEET_CONIFER, turn: false, cross: true, lengthOf: (twig) => twig.from.distanceTo(twig.to) }));
    return finishFoliage(parts, 'small-spruce', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
