import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { stoolWood, type StoolForm } from '../stoolwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';

// Hazel: a sheaf of whippy rods splayed from a stool, leafy from the ground up
// and wider than it is tall. Stands on y = 0.

const TAU = Math.PI * 2;

/** A rod forks once and that is all; the sheaf is the shape, not the branching. */
const HAZEL_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [2, 3],
    [2, 3],
  ],
  lengthRatio: [
    [0.5, 0.7],
    [0.4, 0.6],
  ],
  angle: [
    [0.5, 0.9],
    [0.45, 0.85],
  ],
  along: [
    [0.2, 0.9],
    [0.25, 0.95],
  ],
  lift: [0.3, 0.3, 0.2],
  wobble: [0.12, 0.3, 0.4],
  sides: [5, 5, 4, 4],
  levels: 2,
  swing: [0.2, 0.16],
  minRadius: 0.012,
};

const HAZEL: StoolForm = {
  height: [2.0, 2.8],
  spread: [0.45, 0.6],
  rods: [6, 9],
  butt: [0.022, 0.035],
  reach: [0.5, 0.95],
  bark: 0x5a4c3d,
  colour: LEAVES.broadleaf,
  growth: HAZEL_GROWTH,
};

export const hazel: MeshBuilder = {
  name: 'hazel',
  category: 'foliage',
  radius: 1.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = stoolWood(rng, parts, HAZEL);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [0.85, 1.15], turn: false, cross: true }));
    return finishFoliage(parts, 'hazel', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
