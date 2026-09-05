import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';
import { glint, treeParts } from '../vista-kit';

// An avenue along +X: two lines of trees with a pale lane between them.

export const vistaAvenue: MeshBuilder = {
  name: 'vista-avenue',
  category: 'vista',
  radius: 28,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const count = rng.int(4, 5);
    const pitch = rng.range(9, 12);
    const gap = rng.range(7, 9);
    const height = rng.range(12, 16);
    const length = (count - 1) * pitch + 10;
    const parts: Part[] = [
      { geometry: glint(length, gap * 0.7, 0, 0.15, 0), color: shade(PALETTE.TIMBER_PALE, 1.05), sway: 0 },
    ];
    for (let i = 0; i < count; i++) {
      const x = (i - (count - 1) / 2) * pitch;
      parts.push(...treeParts(rng, height * rng.range(0.9, 1.1), x, -gap / 2));
      parts.push(...treeParts(rng, height * rng.range(0.9, 1.1), x, gap / 2));
    }
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-avenue', 0));
  },
};
