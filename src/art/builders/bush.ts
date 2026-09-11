import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { stoolWood, type StoolForm } from '../stoolwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';
import { SHEET_OF } from '../branchSheet';

// A bush: a few short stems off one stool under a low broad crown of cards.
// No trunk. Stands on y = 0.

const TAU = Math.PI * 2;

/** A stem forks once and that is all; the plant is barely taller than it is wide. */
const BUSH_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [2, 3],
    [2, 3],
  ],
  lengthRatio: [
    [0.55, 0.75],
    [0.45, 0.65],
  ],
  angle: [
    [0.55, 1.0],
    [0.5, 0.95],
  ],
  along: [
    [0.2, 0.9],
    [0.3, 0.95],
  ],
  lift: [0.3, 0.3, 0.2],
  wobble: [0.14, 0.34, 0.44],
  sides: [4, 4, 3, 3],
  levels: 2,
  swing: [0.14, 0.1],
  minRadius: 0.007,
};

export const bush: MeshBuilder = {
  name: 'bush',
  category: 'foliage',
  radius: 1,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const form: StoolForm = {
      height: [0.7, 1.1],
      spread: [0.75, 1.0],
      rods: [3, 5],
      butt: [0.016, 0.026],
      reach: [0.5, 1.0],
      bark: 0x584a3c,
      colour: rng.chance(0.2) ? LEAVES.dry : LEAVES.broadleaf,
      growth: BUSH_GROWTH,
    };
    const wood = stoolWood(rng, parts, form);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 12, length: [0.3, 0.45], tiles: SHEET_OF.smallleaf, perTwig: 2, upward: 0.2 }));
    return finishFoliage(parts, 'bush', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
