import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaMass, vistaWoodEdge } from '../vista';

// A wood seen from outside: its edge along +X facing +Z, a ragged wall of canopy
// with a dark foot and a standard or two in front, and a lumpy interior rising
// behind it so the skyline is not the wall's own top.

export const vistaForest: MeshBuilder = {
  name: 'vista-forest',
  category: 'vista',
  radius: 34,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);

    const length = rng.range(46, 68);
    const depth = rng.range(14, 22);
    const low = rng.range(9, 12);
    const high = rng.range(13, 17);
    const edge: [number, number][] = [
      [-length / 2, rng.range(-4, 4)],
      [0, rng.range(-3, 3)],
      [length / 2, rng.range(-4, 4)],
    ];
    const wall = vistaWoodEdge(rng, {
      edge,
      depth,
      low,
      high,
      spacing: 6,
      standards: rng.int(1, 2),
    });

    const parts: Part[] = [wall];
    const lumps = 3;
    for (let i = 0; i < lumps; i++) {
      const t = (i + 0.5) / lumps - 0.5;
      const radius = rng.range(9, 13);
      const geometry = vistaMass(rng, {
        radius,
        detail: 0,
        rough: rng.range(0.2, 0.34),
        squash: rng.range(0.7, 1.0),
        stretch: rng.range(0.8, 1.3),
        bury: 0.5,
      });
      geometry.rotateY(rng.range(0, Math.PI * 2));
      geometry.translate(
        t * length * 0.8 + rng.range(-4, 4),
        high - rng.range(4, 7),
        -depth * rng.range(0.5, 0.9),
      );
      parts.push({ geometry, color: wall.color, sway: 0 });
    }

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-forest', 0));
  },
};
