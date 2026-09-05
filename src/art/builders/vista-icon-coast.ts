import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaMass, vistaRidge } from '../vista';

// The coast's icon: two rock arms reaching toward +Z with a stack standing in
// the sea between them.

export const vistaIconCoast: MeshBuilder = {
  name: 'vista-icon-coast',
  category: 'vista',
  radius: 40,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const height = rng.range(16, 22);
    const arm = (side: number) =>
      vistaRidge(rng, {
        crest: [
          [side * 34, -20, height],
          [side * 28, -4, height * 0.75],
          [side * 22, 10, height * 0.45],
          [side * 18, 22, height * 0.15],
        ],
        face: 1.1,
        back: 1.2,
        facets: 2,
        foot: 4,
        sink: 5,
        rough: 0.1,
      });
    const arms = mergeGeometries([arm(-1), arm(1)], false);
    if (!arms) throw new Error('vista-icon-coast: arms did not share an attribute set');

    const stack = vistaMass(rng, {
      radius: rng.range(4, 6),
      detail: 0,
      rough: 0.28,
      squash: rng.range(1.8, 2.4),
      stretch: 0.7,
      bury: 0.3,
    });
    stack.translate(rng.range(-4, 4), 0, 14);

    const parts: Part[] = [
      {
        geometry: arms,
        color: vistaBank(seed ^ 0xc0a5, {
          ground: 'pasture',
          bands: [
            { material: 'rock', steeperThan: 0.55 },
            { material: 'wet', below: 3 },
          ],
          crown: height,
        }),
        sway: 0,
      },
      {
        geometry: stack,
        color: vistaBank(seed ^ 0xc0a6, { ground: 'rock', bands: [{ material: 'wet', below: 3 }], crown: 12 }),
        sway: 0,
      },
    ];
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-icon-coast', 0));
  },
};
