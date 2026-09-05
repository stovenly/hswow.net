import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';
import { block } from '../vista-kit';

// A causeway: a straight raised road along +X with posts along one side.

export const vistaCauseway: MeshBuilder = {
  name: 'vista-causeway',
  category: 'vista',
  radius: 30,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const length = rng.range(50, 64);
    const parts: Part[] = [
      { geometry: block(length, 1.6, 5, 0, -0.4, 0), color: shade(PALETTE.EARTH, 1.15), sway: 0 },
      { geometry: block(length, 0.3, 3.4, 0, 1.2, 0), color: shade(PALETTE.TIMBER_PALE, 1.05), sway: 0 },
    ];
    const pitch = rng.range(5, 7);
    for (let x = -length / 2 + 2; x < length / 2; x += pitch) {
      parts.push({ geometry: block(0.4, rng.range(1.6, 2.2), 0.4, x, 1.2, 2.2), color: PALETTE.TIMBER_DARK, sway: 0 });
    }
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-causeway', 0));
  },
};
