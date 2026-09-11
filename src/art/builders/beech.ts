import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { LEAVES, branchCards, finishFoliage } from '../foliage';
import { oakWood, type WoodForm } from '../oakwood';
import { OAK_GROWTH } from '../limbs';

// Beech: the oak's wood grown tall and smooth-barked with a high fork,
// under a crown of crossed branch cards off the broadleaf sheet. Stands on
// y = 0.

const TAU = Math.PI * 2;

const BEECH: WoodForm = {
  height: [10, 12.5],
  butt: [0.36, 0.46],
  forkAt: [0.3, 0.38],
  spread: [0.28, 0.33],
  rootLength: [0.8, 0.92],
  ribs: [2, 3],
  bark: 0x6f6b63,
  pale: 0x7d7970,
  colour: LEAVES.broadleaf,
  // Narrower angles and more lift than the oak: a beech reaches up where an oak reaches out.
  growth: { ...OAK_GROWTH, angle: [[0.5, 0.85], [0.4, 0.75], [0.4, 0.8]], lift: [0.4, 0.35, 0.22, 0.12], children: [[3, 4], [2, 3], [2, 3]], swing: [0.07, 0.09] },
};

export const beech: MeshBuilder = {
  name: 'beech',
  category: 'foliage',
  radius: 6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = oakWood(rng, parts, BEECH);
    parts.push(...branchCards(rng, wood.species, wood.clouds, { twigs: wood.twigs, count: 0, length: [2.0, 2.7], turn: false, cross: true }));
    return finishFoliage(parts, 'beech', rng.range(0, TAU), rng.range(0, TAU), scale);
  },
};
