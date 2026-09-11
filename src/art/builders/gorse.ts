import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { FIN_FLAG } from '../canopy';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { stoolWood, type StoolForm } from '../stoolwood';
import { OAK_GROWTH, type GrowForm } from '../limbs';
import { SHEET_OF } from '../branchSheet';

// Gorse: a dense spiny cushion of short much-forked stems, needled from the
// pine row and dark, with yellow over a third of it all year. Stands on y = 0.

const TAU = Math.PI * 2;

/** Short, stiff, and forked three times over: the branching is the mound. */
const GORSE_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [3, 4],
    [3, 4],
    [2, 3],
  ],
  lengthRatio: [
    [0.45, 0.6],
    [0.4, 0.55],
    [0.35, 0.5],
  ],
  angle: [
    [0.55, 1.0],
    [0.5, 0.95],
    [0.5, 0.95],
  ],
  along: [
    [0.15, 0.9],
    [0.2, 0.95],
    [0.25, 0.95],
  ],
  lift: [0.4, 0.4, 0.35, 0.25],
  wobble: [0.1, 0.26, 0.34, 0.42],
  sides: [4, 4, 3, 3],
  levels: 3,
  swing: [0.06, 0.05],
  minRadius: 0.006,
};

const GORSE: StoolForm = {
  height: [1.0, 1.5],
  spread: [0.55, 0.78],
  rods: [4, 6],
  butt: [0.018, 0.03],
  reach: [0.25, 0.8],
  bark: 0x4a4230,
  colour: LEAVES.gorse,
  growth: GORSE_GROWTH,
  evergreen: true,
};

export const gorse: MeshBuilder = {
  name: 'gorse',
  category: 'foliage',
  radius: 1.2,
  solid: true,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = stoolWood(rng, parts, GORSE);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 40, length: [0.18, 0.3], tiles: SHEET_OF.pine, perTwig: 2, upward: 0.2 }));
    const flowered = wood.twigs.filter((_, i) => i % 3 === 0);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: flowered, count: 0, length: [0.16, 0.26], tiles: SHEET_OF.blossom, flag: FIN_FLAG.evergreenBlossom, colour: LEAVES.gorseYellow }));
    return finishFoliage(parts, 'gorse', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
