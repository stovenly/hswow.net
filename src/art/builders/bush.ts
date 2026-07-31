import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * A bush: a clump of squashed lumps, sitting low.
 *
 * No trunk, so sway is nearly uniform — a bush bends from the ground rather
 * than pivoting about a stem. Slightly less at the base than the top, enough
 * that it does not slide.
 */
export const bush: MeshBuilder = {
  name: 'bush',
  category: 'foliage',
  radius: 1,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const lumps = rng.int(3, 5);
    const spread = rng.range(0.35, 0.7);

    for (let i = 0; i < lumps; i++) {
      const radius = rng.range(0.3, 0.62);
      const lump = new THREE.IcosahedronGeometry(radius, 0);
      lump.rotateX(rng.range(0, Math.PI));
      lump.rotateY(rng.range(0, Math.PI));
      lump.scale(1, rng.range(0.6, 0.85), 1);

      const angle = (i / lumps) * Math.PI * 2 + rng.around(0, 0.6);
      const distance = rng.range(0, spread);
      const y = radius * rng.range(0.55, 0.85);
      lump.translate(Math.cos(angle) * distance, y, Math.sin(angle) * distance);

      parts.push({
        geometry: lump,
        color: rng.chance(0.2) ? PALETTE.LEAF_DRY : PALETTE.LEAF,
        // Weighted by height off the ground, gently. A bush has no rigid part
        // to pivot around, so this is a lean rather than a bend.
        sway: (_x, vy) => Math.min(1, 0.35 + vy * 0.75),
      });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'bush', rng() * Math.PI * 2);
  },
};
