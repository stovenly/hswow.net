import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge } from '../vista';
import { crestAlong } from '../vista-kit';

// One side of a valley: a long slope facing +Z, hedged fields low on it and
// wood high, so the eye reads a valley between here and there.

export const vistaValleySide: MeshBuilder = {
  name: 'vista-valley-side',
  category: 'vista',
  radius: 75,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const length = rng.range(120, 150);
    const height = rng.range(16, 22);
    const geometry = vistaRidge(rng, {
      crest: crestAlong(rng, length, height, 7),
      face: rng.range(2.8, 3.4),
      back: rng.range(1.4, 1.8),
      facets: 4,
      foot: 8,
      rough: 0.04,
    });

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0x7a11, {
          ground: 'fields',
          field: rng.range(35, 50),
          hedge: 1.6,
          bands: [
            { material: 'wood', above: height * 0.55, facing: 0 },
            { material: 'heath', above: height * 0.88 },
          ],
          wobble: 3,
          crown: height * 0.6,
          scale: rng.range(40, 70),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-valley-side', 0));
  },
};
