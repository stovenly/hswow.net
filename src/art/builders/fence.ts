import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * A run of fence: posts, rails between them, and gaps where it has gone.
 *
 * One builder produces a whole span rather than a single post, because a fence
 * is a *line* — its meaning is entirely in continuity and in where that
 * continuity breaks. Placing individual posts and hoping they align is how you
 * get a row of unrelated sticks.
 *
 * Missing sections are the point. An unbroken fence says a boundary is kept;
 * a fence with two panels down says it was kept once, which is a great deal
 * more interesting and costs a conditional.
 */
export const fence: MeshBuilder = {
  name: 'fence',
  radius: 2.4,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const bays = rng.int(3, 5);
    const spacing = rng.range(1.1, 1.6);
    const height = rng.range(0.85, 1.25);
    const rails = rng.int(2, 3);
    const span = bays * spacing;

    for (let i = 0; i <= bays; i++) {
      const x = i * spacing - span / 2;
      // Every post leans its own way. A fence built by hand and then left is
      // never in line, and a perfectly straight one reads as new.
      const lean = rng.around(0, 0.09);
      const postHeight = height * rng.range(0.85, 1.1);
      const post = new THREE.BoxGeometry(0.11, postHeight, 0.11);
      post.translate(0, postHeight / 2, 0);
      post.rotateZ(lean);
      post.rotateY(rng.around(0, 0.25));
      post.translate(x, 0, rng.around(0, 0.06));
      parts.push({ geometry: post, color: PALETTE.TIMBER, sway: 0 });
    }

    for (let i = 0; i < bays; i++) {
      // A gone panel: no rails, and the gap speaks for itself.
      if (rng.chance(0.22)) continue;

      const x = i * spacing - span / 2 + spacing / 2;
      for (let r = 0; r < rails; r++) {
        const at = height * (0.32 + (r / Math.max(rails - 1, 1)) * 0.52);
        const rail = new THREE.BoxGeometry(spacing * 1.02, 0.07, 0.05);
        rail.rotateZ(rng.around(0, 0.05));
        rail.translate(x, at + rng.around(0, 0.03), rng.around(0, 0.03));
        parts.push({ geometry: rail, color: PALETTE.TIMBER_DARK, sway: 0 });
      }
    }

    const geometry = assemble(parts);
    // Turned as a whole, so a run can be dropped along any line.
    geometry.rotateY(rng.range(0, Math.PI));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'fence', 0);
  },
};
