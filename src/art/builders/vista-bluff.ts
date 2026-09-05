import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge } from '../vista';
import { crestAlong } from '../vista-kit';

// A bluff: a short steep drop toward +Z with a long flat top behind it, rock
// painted on the face and turf everywhere else.

export const vistaBluff: MeshBuilder = {
  name: 'vista-bluff',
  category: 'vista',
  radius: 40,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const length = rng.range(50, 70);
    const height = rng.range(10, 14);
    const geometry = vistaRidge(rng, {
      crest: crestAlong(rng, length, height, 4, 0.5),
      face: rng.range(0.4, 0.5),
      back: rng.range(4.5, 5.5),
      facets: 2,
      foot: 3,
      rough: 0.05,
    });

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0xb1ff, {
          ground: 'pasture',
          bands: [{ material: 'rock', steeperThan: 0.8, facing: 0 }],
          wobble: 1.5,
          crown: height,
          scale: rng.range(30, 50),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-bluff', 0));
  },
};
