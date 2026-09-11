import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { SHEET_CONIFER } from '../branchSheet';
import { whorlWood, type WhorlForm } from '../whorlwood';

// Spruce: whorls of branch stubs up a straight trunk, each stub carrying a
// crossed pair of needle-spray cards off the sheet, pinned where they are.
// Stands on y = 0.

const TAU = Math.PI * 2;

const SPRUCE: WhorlForm = {
  height: [11, 14],
  butt: [0.24, 0.32],
  bend: [0.02, 0.08],
  ribs: [3, 4],
  thin: 0.75,
  latheTop: 0.97,
  skirt: [0.2, 0.26],
  step: [0.42, 0.6],
  arms: [6, 8],
  reach: 0.27,
  hem: 0.3,
  minReach: 0.4,
  stub: 0.28,
  swing: 0.06,
  cloudStep: 2.2,
  cloudLift: 0.6,
  cloudHeight: 1.6,
  leaderSpray: 0.9,
  tipCloud: [0.8, 1.2],
  bark: PALETTE.BARK_PALE,
  colour: LEAVES.conifer,
};

export const spruce: MeshBuilder = {
  name: 'spruce',
  category: 'foliage',
  radius: 4.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = whorlWood(rng, parts, SPRUCE);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [1, 1], tiles: SHEET_CONIFER, turn: false, cross: true, lengthOf: (twig) => twig.from.distanceTo(twig.to) }));
    return finishFoliage(parts, 'spruce', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
