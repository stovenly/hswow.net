import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { markVista } from '../vista';
import { block, gable, ROOFS, WALLS } from '../vista-kit';

// A barn on its own in the fields: one long low roof along +X over low walls.

/** The barn's parts about the origin. */
export function barnParts(rng: Rng): Part[] {
  const length = rng.range(18, 24);
  const width = rng.range(8, 10);
  const eave = rng.range(3, 4);
  return [
    { geometry: block(length, eave, width, 0, 0, 0), color: rng.pick(WALLS), sway: 0 },
    { geometry: gable(length + 0.8, width + 1.2, eave, width * rng.range(0.42, 0.52)), color: rng.pick(ROOFS), sway: 0 },
  ];
}

export const vistaBarn: MeshBuilder = {
  name: 'vista-barn',
  category: 'vista',
  radius: 13,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const merged = assemble(barnParts(rng));
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-barn', 0));
  },
};
