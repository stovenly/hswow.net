import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista, vistaWoodEdge } from '../vista';
import { glint, treeParts } from '../vista-kit';

// The forest path's icon: the great oak's crown standing over a wood's edge
// where three pale lanes meet in front of it.

export const vistaIconForestPath: MeshBuilder = {
  name: 'vista-icon-forest-path',
  category: 'vista',
  radius: 26,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [
      vistaWoodEdge(rng, {
        edge: [
          [-22, -6],
          [0, -8],
          [22, -6],
        ],
        depth: 12,
        low: 9,
        high: 12,
        spacing: 6,
        standards: 0,
      }),
      ...treeParts(rng, rng.range(20, 24), rng.range(-3, 3), 2),
    ];
    const lane = shade(PALETTE.TIMBER_PALE, 1.05);
    for (const yaw of [0, 1.1, -1.1]) {
      const strip = glint(3, 20, 0, 0.15, 16);
      strip.rotateY(yaw);
      parts.push({ geometry: strip, color: lane, sway: 0 });
    }
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-icon-forest-path', 0));
  },
};
