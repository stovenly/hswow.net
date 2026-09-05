import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista } from '../vista';
import { shift } from '../vista-kit';
import { churchParts } from './vista-church';
import { cottageParts } from './vista-cottage';

// The village's icon: its church tower standing over a short row of roofs,
// the row along +X in front of the church.

export const vistaIconVillage: MeshBuilder = {
  name: 'vista-icon-village',
  category: 'vista',
  radius: 24,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = shift(churchParts(rng, 'tower'), 4, 0, -10);
    const roofs = rng.int(3, 4);
    for (let i = 0; i < roofs; i++) {
      const x = (i - (roofs - 1) / 2) * rng.range(10, 12);
      parts.push(...shift(cottageParts(rng).parts, x, 0, rng.range(4, 8), rng.range(-0.2, 0.2)));
    }
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-icon-village', 0));
  },
};
