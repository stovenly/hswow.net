import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaWoodEdge } from '../vista';
import { shift } from '../vista-kit';
import { cottageParts } from './vista-cottage';
import { smokeParts } from './vista-smoke';

// The forest's icon: a clearing in a wood, opening toward +Z, with one roof and
// its chimney smoking in the middle of it.

export const vistaIconForest: MeshBuilder = {
  name: 'vista-icon-forest',
  category: 'vista',
  radius: 30,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    // Two walls of wood angled back from the opening, meeting behind the house.
    const parts: Part[] = [
      vistaWoodEdge(rng, {
        edge: [
          [-26, 6],
          [-16, -8],
          [-4, -16],
        ],
        depth: 12,
        low: 10,
        high: 14,
        spacing: 6,
        standards: 0,
      }),
      vistaWoodEdge(rng, {
        edge: [
          [4, -16],
          [16, -8],
          [26, 6],
        ],
        depth: 12,
        low: 10,
        high: 14,
        spacing: 6,
        standards: 0,
      }),
    ];
    const house = cottageParts(rng);
    parts.push(...shift(house.parts, 0, 0, -2, rng.range(-0.3, 0.3)));
    parts.push(...shift(smokeParts(rng), house.stack[0], house.stack[1], house.stack[2] - 2));
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-icon-forest', 0));
  },
};
