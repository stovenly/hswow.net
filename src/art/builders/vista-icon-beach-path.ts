import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge } from '../vista';
import { crestAlong, shift } from '../vista-kit';
import { beaconParts } from './vista-beacon';

// The beach path's icon: the bluff with its cairn on top, the drop toward +Z.

export const vistaIconBeachPath: MeshBuilder = {
  name: 'vista-icon-beach-path',
  category: 'vista',
  radius: 32,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const height = rng.range(12, 16);
    const crest = crestAlong(rng, rng.range(50, 60), height, 4, 0.5);
    const bluff = vistaRidge(rng, { crest, face: 0.45, back: 5, facets: 2, foot: 3, rough: 0.05 });
    const top = crest[1];
    const parts: Part[] = [
      {
        geometry: bluff,
        color: vistaBank(seed ^ 0xb3a4, {
          ground: 'pasture',
          bands: [{ material: 'rock', steeperThan: 0.8, facing: 0 }],
          crown: height,
        }),
        sway: 0,
      },
      ...shift(beaconParts(rng), top[0], top[2] - 0.5, top[1] - 2),
    ];
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-icon-beach-path', 0));
  },
};
