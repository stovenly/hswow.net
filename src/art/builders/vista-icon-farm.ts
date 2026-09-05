import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';
import { cap, shift } from '../vista-kit';
import { barnParts } from './vista-barn';
import { cottageParts } from './vista-cottage';

// The farm's icon: the barn's long roof with the rick beside it and the house
// behind.

export const vistaIconFarm: MeshBuilder = {
  name: 'vista-icon-farm',
  category: 'vista',
  radius: 20,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = shift(barnParts(rng), -4, 0, 2);
    const rick = rng.range(4, 5.5);
    parts.push({ geometry: cap(rick * 0.7, rick, 6, 14, 0, 3), color: shade(PALETTE.GRASS_DRY, 1.15), sway: 0 });
    parts.push(...shift(cottageParts(rng).parts, 6, 0, -10, Math.PI / 2));
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-icon-farm', 0));
  },
};
