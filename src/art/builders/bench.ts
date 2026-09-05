import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { stoneChunk, stoneColour } from '../stone';

// Bench: a plank on two stone blocks. Lies along +X on y = 0, sat on from +Z.
export const bench: MeshBuilder = {
  name: 'bench',
  category: 'furniture',
  radius: 0.95,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const length = rng.range(1.6, 1.9);
    const seatY = rng.range(0.42, 0.48);
    const thickness = rng.range(0.055, 0.07);
    const width = rng.range(0.3, 0.36);
    const timber = rng.chance(0.5) ? PALETTE.TIMBER : PALETTE.TIMBER_DARK;

    const rise = seatY - thickness;
    for (const x of [-(length / 2 - 0.3), length / 2 - 0.3]) {
      const block = stoneChunk(rng, {
        width: rng.range(0.15, 0.19),
        height: rise / 2,
        depth: rng.range(0.17, 0.21),
        sides: 6,
        rough: 0.1,
        skew: 0.08,
        flat: true,
      });
      block.rotateY(rng.around(0, 0.1));
      block.translate(x, 0, 0);
      parts.push({ geometry: block, color: stoneColour(rng), sway: 0 });
    }

    const plank = new THREE.BoxGeometry(length, thickness, width);
    plank.translate(0, seatY - thickness / 2 - 0.004, 0);
    plank.rotateY(rng.around(0, 0.02));
    parts.push({ geometry: plank, color: shade(timber, rng.range(0.94, 1.06)), sway: 0 });

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'bench', 0);
  },
};
