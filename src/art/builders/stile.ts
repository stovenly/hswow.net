import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { FENCE_POST, fenceHeight, postGeometry, rollPost } from './fence';

// Stile: two posts, a hand rail between them and a step board through the line.
// The line runs along +X on y = 0; it is crossed in ±Z. Never solid, so it can be.
export const stile: MeshBuilder = {
  name: 'stile',
  category: 'structures',
  radius: 0.75,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const gap = rng.range(0.56, 0.68);
    const height = fenceHeight(rng) * rng.range(0.95, 1.05);
    const timber = shade(PALETTE.TIMBER, rng.range(0.94, 1.06));
    const railWood = shade(PALETTE.TIMBER_DARK, rng.range(0.92, 1.08));

    for (const x of [-gap / 2, gap / 2]) {
      const post = rollPost(rng, x, 0, height);
      parts.push({ geometry: postGeometry(post), color: shade(timber, rng.around(1, 0.05)), sway: 0 });
    }

    const railY = height * rng.range(0.8, 0.86);
    const rail = new THREE.BoxGeometry(gap + FENCE_POST * 0.9, 0.075, 0.05);
    rail.translate(0, railY, FENCE_POST / 2 + 0.02);
    parts.push({ geometry: rail, color: railWood, sway: 0 });

    const stepY = rng.range(0.3, 0.36);
    const boardLength = rng.range(0.7, 0.85);
    const board = new THREE.BoxGeometry(gap * 0.8, 0.045, boardLength);
    board.translate(0, stepY, 0);
    board.rotateY(rng.around(0, 0.03));
    parts.push({ geometry: board, color: railWood, sway: 0 });

    const blockHeight = stepY - 0.02;
    for (const side of [-1, 1]) {
      const block = new THREE.BoxGeometry(gap * 0.5, blockHeight, 0.1);
      block.translate(0, blockHeight / 2, side * (boardLength / 2 - 0.08));
      parts.push({ geometry: block, color: shade(timber, 0.9), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'stile', 0);
  },
};
