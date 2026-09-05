import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge } from '../vista';
import { crestAlong } from '../vista-kit';

// A dune field: three or four dune ridges laid along +X with the steep lee side
// toward +Z, sand below and marram along the crests.

export const vistaDuneField: MeshBuilder = {
  name: 'vista-dune-field',
  category: 'vista',
  radius: 45,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const rows = rng.int(3, 4);
    const pieces = [];
    let tallest = 0;
    for (let i = 0; i < rows; i++) {
      const height = rng.range(5, 9);
      const length = rng.range(45, 70);
      const ridge = vistaRidge(rng, {
        crest: crestAlong(rng, length, height, 3),
        face: rng.range(1.4, 1.8),
        back: rng.range(3.5, 4.5),
        facets: 2,
        foot: 4,
        sink: 1.5,
        rough: 0.04,
      });
      ridge.translate(rng.range(-20, 20), 0, (i - (rows - 1) / 2) * rng.range(22, 30));
      pieces.push(ridge);
      tallest = Math.max(tallest, height);
    }
    const geometry = mergeGeometries(pieces, false);
    for (const piece of pieces) piece.dispose();
    if (!geometry) throw new Error('vista-dune-field: dunes did not share an attribute set');

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0xd0fe, {
          ground: 'sand',
          bands: [{ material: 'marram', above: tallest * 0.5, gentlerThan: 0.5 }],
          wobble: 1.5,
          crown: tallest * 0.8,
          scale: rng.range(24, 40),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-dune-field', 0));
  },
};
