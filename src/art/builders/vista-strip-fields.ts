import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { landWash, markVista, vistaRidge, VISTA_MATERIALS } from '../vista';
import { crestAlong } from '../vista-kit';

// Strip fields: long narrow strips running down a gentle slope toward +Z,
// alternating between two crops, a dark baulk between each pair.

export const vistaStripFields: MeshBuilder = {
  name: 'vista-strip-fields',
  category: 'vista',
  radius: 45,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const length = rng.range(70, 90);
    const height = rng.range(6, 9);
    const strip = rng.range(7, 10);
    const geometry = vistaRidge(rng, {
      crest: crestAlong(rng, length, height, 5),
      face: rng.range(4, 5),
      back: rng.range(3, 4),
      facets: 3,
      foot: 6,
      rough: 0.03,
    });

    const washes = [
      landWash(seed ^ 0x51a1, VISTA_MATERIALS.hay, { scale: 60, crown: height }),
      landWash(seed ^ 0x51a2, VISTA_MATERIALS.crop, { scale: 60, crown: height }),
      landWash(seed ^ 0x51a3, VISTA_MATERIALS.pasture, { scale: 60, crown: height }),
    ];
    const baulk = landWash(seed ^ 0x51a4, VISTA_MATERIALS.hedge, { scale: 60, crown: height });
    const offset = rng.range(0, strip);
    const parts: Part[] = [
      {
        geometry,
        color: (x, y, z) => {
          const u = (x + offset) / strip;
          const cell = Math.floor(u);
          if (u - cell < 0.12) return baulk(x, y, z);
          return washes[((cell % 3) + 3) % 3](x, y, z);
        },
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-strip-fields', 0));
  },
};
