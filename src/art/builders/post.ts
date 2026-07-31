import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * A leaning timber post, sometimes with a crossbar or an iron ring.
 *
 * The most useful thing in any kit: posts mark boundaries, edges, paths and
 * ruins, and a line of them at slightly different heights and leans says
 * "something was built here and then left" more economically than a building
 * does.
 *
 * The lean is the whole point. A perfectly vertical post reads as new.
 */
export const post: MeshBuilder = {
  name: 'post',
  category: 'structures',
  radius: 0.4,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(0.9, 2.1);
    const thickness = rng.range(0.07, 0.13);
    const lean = rng.range(0.02, 0.16);
    const facing = rng.range(0, Math.PI * 2);

    // Square section, not round: sawn timber, and four sides catch the flat
    // shading far more legibly than a cylinder does.
    const shaft = new THREE.BoxGeometry(thickness * 2, height, thickness * 2);
    shaft.translate(0, height / 2, 0);
    shaft.rotateZ(lean);
    shaft.rotateY(facing);
    parts.push({ geometry: shaft, color: PALETTE.TIMBER, sway: 0 });

    if (rng.chance(0.4)) {
      const span = rng.range(0.5, 1.1);
      const bar = new THREE.BoxGeometry(span, thickness * 1.4, thickness * 1.4);
      bar.translate(0, height * rng.range(0.6, 0.85), 0);
      bar.rotateZ(lean);
      bar.rotateY(facing + rng.around(0, 0.3));
      parts.push({ geometry: bar, color: PALETTE.TIMBER_DARK, sway: 0 });
    }

    // An iron collar at the head of the post, where timber splits first.
    //
    // This replaces a tethering ring that floated off the side at a random
    // height, attached to nothing and holding nothing. Detail that implies a
    // use it does not have is worse than no detail: it reads as a mistake,
    // because it is one. A collar binds the top of a post, which is a thing
    // posts actually have and which needs nothing else present to make sense.
    if (rng.chance(0.45)) {
      const collar = new THREE.BoxGeometry(thickness * 2.5, 0.09, thickness * 2.5);
      collar.translate(0, height - 0.09, 0);
      collar.rotateZ(lean);
      collar.rotateY(facing);
      parts.push({ geometry: collar, color: PALETTE.RUST, sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'post', 0);
  },
};
