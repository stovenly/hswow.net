import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { branchCards, finishFoliage } from '../foliage';
import { oakWood } from '../oakwood';

// Oak: the shared oak wood under a crown of branch cards off the sprite
// sheet, a crossed pair pinned on every twig and none anywhere else, so every
// branch grows from wood and nothing turns. Stands on y = 0.

const TAU = Math.PI * 2;

export const oak: MeshBuilder = {
  name: 'oak',
  category: 'foliage',
  radius: 6.5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = oakWood(rng, parts);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [2.0, 2.8], turn: false, cross: true }));
    return finishFoliage(parts, 'oak', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
