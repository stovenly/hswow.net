import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge } from '../vista';
import { crestAlong } from '../vista-kit';

// Foothills: three or four low rises, each behind and higher than the one in
// front of it, stepping back toward −Z as the ground climbs toward a range.

export const vistaFoothills: MeshBuilder = {
  name: 'vista-foothills',
  category: 'vista',
  radius: 50,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const rows = rng.int(3, 4);
    const pieces = [];
    let tallest = 0;
    for (let i = 0; i < rows; i++) {
      const height = rng.range(6, 8) + i * rng.range(3, 4.5);
      const length = rng.range(50, 75);
      const ridge = vistaRidge(rng, {
        crest: crestAlong(rng, length, height, 3),
        face: rng.range(2.2, 2.8),
        back: rng.range(2.4, 3.2),
        facets: 2,
        foot: 5,
        rough: 0.05,
      });
      ridge.translate(rng.range(-25, 25), 0, -i * rng.range(16, 22));
      pieces.push(ridge);
      tallest = Math.max(tallest, height);
    }
    const geometry = mergeGeometries(pieces, false);
    for (const piece of pieces) piece.dispose();
    if (!geometry) throw new Error('vista-foothills: rises did not share an attribute set');

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0xf007, {
          ground: 'pasture',
          bands: [
            { material: 'wood', steeperThan: 0.4, below: tallest * 0.5 },
            { material: 'heath', above: tallest * 0.7 },
          ],
          wobble: 2,
          crown: tallest * 0.6,
          scale: rng.range(50, 90),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-foothills', 0));
  },
};
