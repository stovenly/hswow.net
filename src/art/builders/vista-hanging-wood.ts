import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge, vistaWoodEdge } from '../vista';
import { crestAlong } from '../vista-kit';

// A hanging wood: a steep slope toward +Z clothed in wood from its foot to a
// line just under the crest, the wood's own edge standing along the bottom.

export const vistaHangingWood: MeshBuilder = {
  name: 'vista-hanging-wood',
  category: 'vista',
  radius: 50,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const length = rng.range(70, 95);
    const height = rng.range(14, 20);
    const face = rng.range(1.3, 1.6);
    const geometry = vistaRidge(rng, {
      crest: crestAlong(rng, length, height, 5),
      face,
      back: rng.range(2.6, 3.4),
      facets: 3,
      foot: 5,
      rough: 0.05,
    });

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0x4a0d, {
          ground: 'pasture',
          bands: [{ material: 'wood', facing: 0, steeperThan: 0.3, below: height * 0.85 }],
          wobble: 2,
          crown: height * 0.6,
          scale: rng.range(40, 70),
        }),
        sway: 0,
      },
    ];

    // The wood's foot along the bottom of the slope, so it has an edge.
    const foot = height * face * 0.85;
    parts.push(
      vistaWoodEdge(rng, {
        edge: [
          [-length * 0.4, foot],
          [0, foot + rng.range(-3, 3)],
          [length * 0.4, foot],
        ],
        depth: 10,
        low: 8,
        high: 11,
        spacing: 6,
        standards: 1,
      }),
    );

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-hanging-wood', 0));
  },
};
