import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge } from '../vista';
import { crestAlong } from '../vista-kit';

// A sea cliff: a near-vertical face toward +Z, turf on top, rock on the face
// and the wave-cut foot darker where the sea keeps it wet. Sunk deep, so the
// water plane hides the foot row.

export const vistaCliff: MeshBuilder = {
  name: 'vista-cliff',
  category: 'vista',
  radius: 45,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const length = rng.range(70, 90);
    const height = rng.range(25, 40);
    const geometry = vistaRidge(rng, {
      crest: crestAlong(rng, length, height, 5, 0.5),
      face: rng.range(0.18, 0.28),
      back: rng.range(2.2, 2.8),
      facets: 3,
      foot: 4,
      sink: 6,
      rough: 0.07,
    });

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0xc11f, {
          ground: 'pasture',
          bands: [
            { material: 'rock', steeperThan: 0.9 },
            { material: 'wet', below: 4, steeperThan: 0.9 },
          ],
          wobble: 1.5,
          crown: height,
          scale: rng.range(30, 50),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-cliff', 0));
  },
};
