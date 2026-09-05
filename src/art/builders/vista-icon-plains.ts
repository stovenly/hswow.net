import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge } from '../vista';
import { crestAlong, shift } from '../vista-kit';
import { windmillParts } from './vista-windmill';

// The plains' icon: the windmill on its ridge, sails toward +Z.

export const vistaIconPlains: MeshBuilder = {
  name: 'vista-icon-plains',
  category: 'vista',
  radius: 36,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const height = rng.range(8, 11);
    const ridge = vistaRidge(rng, {
      crest: crestAlong(rng, rng.range(55, 70), height, 3, 0.5),
      face: 2.5,
      back: 3,
      facets: 2,
      foot: 5,
      rough: 0.04,
    });
    const parts: Part[] = [
      {
        geometry: ridge,
        color: vistaBank(seed ^ 0x1c0f, { ground: 'pasture', bands: [{ material: 'heath', above: height * 0.7 }], crown: height }),
        sway: 0,
      },
      ...shift(windmillParts(rng, 'tower'), 0, height - 1, 0),
    ];
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-icon-plains', 0));
  },
};
