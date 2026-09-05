import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista } from '../vista';
import { shift, treeParts } from '../vista-kit';
import { bridgeParts } from './vista-bridge';

// The riverside's icon: the footbridge over a glint of water with one great oak
// beside it.

export const vistaIconRiverside: MeshBuilder = {
  name: 'vista-icon-riverside',
  category: 'vista',
  radius: 22,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = shift(bridgeParts(rng, 1), 0, 0, 0);
    parts.push(...treeParts(rng, rng.range(18, 22), rng.range(10, 14), rng.range(-4, 2)));
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-icon-riverside', 0));
  },
};
