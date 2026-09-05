import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';
import { block } from '../vista-kit';

// A sheepfold: a small walled square on a hillside, one wall left open a gap.

export const vistaSheepfold: MeshBuilder = {
  name: 'vista-sheepfold',
  category: 'vista',
  radius: 8,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const side = rng.range(9, 12);
    const height = rng.range(1.4, 1.8);
    const stone = shade(rng.pick([PALETTE.STONE_DARK, PALETTE.STONE]), 0.95);
    const half = side / 2;
    const parts: Part[] = [
      { geometry: block(side, height, 0.8, 0, -0.4, -half), color: stone, sway: 0 },
      { geometry: block(0.8, height, side, -half, -0.4, 0), color: stone, sway: 0 },
      { geometry: block(0.8, height, side, half, -0.4, 0), color: stone, sway: 0 },
      { geometry: block(side * 0.7, height, 0.8, -side * 0.15, -0.4, half), color: stone, sway: 0 },
    ];
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-sheepfold', 0));
  },
};
