import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaMass } from '../vista';

// A plateau: a flat-topped table with a steep rim, moor on top. A displaced
// dome with its top sliced level, rock where the rim is steep.

export const vistaPlateau: MeshBuilder = {
  name: 'vista-plateau',
  category: 'vista',
  radius: 36,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const radius = rng.range(30, 38);
    const squash = rng.range(0.45, 0.55);
    const bury = 0.35;
    const geometry = vistaMass(rng, {
      radius,
      detail: 1,
      rough: rng.range(0.1, 0.16),
      squash,
      stretch: rng.range(0.8, 1.3),
      bury,
    });
    const top = radius * squash * 2 * (1 - bury);
    const table = top * rng.range(0.55, 0.65);
    const position = geometry.getAttribute('position');
    for (let i = 0; i < position.count; i++) {
      if (position.getY(i) > table) position.setY(i, table + rng.range(-0.3, 0.3));
    }
    position.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.rotateY(rng.range(0, Math.PI * 2));

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0x91a7, {
          ground: 'pasture',
          bands: [
            { material: 'rock', steeperThan: 0.7 },
            { material: 'heath', above: table - 1.5, gentlerThan: 0.35 },
          ],
          wobble: 1.5,
          crown: table,
          scale: rng.range(30, 50),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-plateau', 0));
  },
};
