import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge } from '../vista';

// A headland: a spine running from the land at −X down into the sea at +X,
// turf along the top and rock where the sides drop to the water. Everything
// under y = 0 is the sea's to hide.

export const vistaHeadland: MeshBuilder = {
  name: 'vista-headland',
  category: 'vista',
  radius: 50,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const length = rng.range(90, 110);
    const height = rng.range(18, 26);
    const points = 5;
    const crest: [number, number, number][] = [];
    for (let i = 0; i < points; i++) {
      const t = i / (points - 1);
      const x = -length / 2 + t * length + (i > 0 && i < points - 1 ? rng.range(-4, 4) : 0);
      const z = rng.range(-5, 5) + t * rng.range(-10, 10);
      // Highest on the land, each station lower than the last, the tip barely up.
      const h = i === points - 1 ? height * 0.15 : height * (1 - t * 0.6) * rng.range(0.9, 1.08);
      crest.push([x, z, h]);
    }

    const geometry = vistaRidge(rng, {
      crest,
      face: rng.range(1.0, 1.3),
      back: rng.range(1.1, 1.4),
      facets: 3,
      foot: 5,
      sink: 5,
      rough: 0.1,
    });

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0x4c1d, {
          ground: 'pasture',
          bands: [
            { material: 'rock', steeperThan: 0.55 },
            { material: 'wet', below: 3, steeperThan: 0.5 },
          ],
          wobble: 2,
          crown: height * 0.7,
          scale: rng.range(40, 70),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-headland', 0));
  },
};
