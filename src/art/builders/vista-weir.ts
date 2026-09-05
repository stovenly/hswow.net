import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';
import { block, GLINT, glint } from '../vista-kit';

// A weir: a white line across a river running along −Z, the water above it a
// shade stiller than below.

export const vistaWeir: MeshBuilder = {
  name: 'vista-weir',
  category: 'vista',
  radius: 12,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const width = rng.range(10, 14);
    const parts: Part[] = [
      { geometry: glint(width, 22, 0, 0.1, 0), color: GLINT, sway: 0 },
      { geometry: block(width, 0.7, 1.2, 0, 0.15, 0), color: shade(PALETTE.STONE_PALE, 1.2), sway: 0 },
    ];
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-weir', 0));
  },
};
