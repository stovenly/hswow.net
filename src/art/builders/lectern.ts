import * as THREE from 'three';
import type { BuildOptions, MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A sloped desk on a post. Standalone, and carries nothing.
 *
 * **There is no `lectern({ book })`.** It is a piece of furniture with a
 * sloping top, and a book is a prop that can be put on one — two entries, two
 * seeds, and a placer who can move either without rebuilding the other. A
 * builder that took its own contents would be a builder that has to be edited
 * every time the family it stages grows a member.
 *
 * The lip at the foot of the slope is the whole of what makes it a lectern
 * rather than a drawing board. Without it the slope is a ramp and anything put
 * on it reads as sliding off; with it, the empty desk still says what it is
 * for, which is the test a piece of furniture has to pass on its own.
 *
 * Built facing +Z — the slope falls toward the reader.
 */
export const lectern: MeshBuilder = {
  name: 'lectern',
  category: 'furniture',
  radius: 0.4,

  build({ seed = 1, scale = 1 }: BuildOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(0.89, 1.06);
    const deskW = rng.range(0.42, 0.54);
    const deskD = rng.range(0.3, 0.38);
    const slope = rng.range(0.34, 0.48);
    const timber = rng.chance(0.5) ? PALETTE.TIMBER_DARK : shade(PALETTE.TIMBER, 0.88);

    // --- the foot -------------------------------------------------------------
    //
    // A cross rather than a disc or a box. Two planks lapped over each other is
    // how a stand that has to take a lean actually gets made, and it is the one
    // part of this that is visible from across a room at ankle height.
    const spread = rng.range(0.34, 0.42);
    for (const along of [0, 1]) {
      const arm = new THREE.BoxGeometry(
        along === 0 ? spread * 2 : 0.1,
        0.045 + along * 0.006,
        along === 0 ? 0.1 : spread * 2,
      );
      arm.translate(0, (0.045 + along * 0.006) / 2 + along * 0.001, 0);
      parts.push({ geometry: arm, color: shade(timber, 0.86), sway: 0 });
    }

    // --- the post -------------------------------------------------------------
    const postW = rng.range(0.075, 0.1);
    const post = new THREE.BoxGeometry(postW, height - 0.06, postW * rng.range(0.9, 1.05));
    post.translate(0, 0.05 + (height - 0.06) / 2, 0);
    parts.push({ geometry: post, color: timber, sway: 0 });

    // A collar where the post meets the desk. Cheap, and it stops the top
    // reading as a plank balanced on a stick.
    const collar = new THREE.BoxGeometry(postW * 2.1, 0.05, postW * 2.1);
    collar.translate(0, height - 0.08, 0);
    parts.push({ geometry: collar, color: shade(timber, 0.92), sway: 0 });

    // --- the desk -------------------------------------------------------------
    //
    // Built flat about its own middle and then tilted as a unit, so the lip
    // arrives on the low edge wherever the tilt put it — the same reason
    // `chest` builds its lid in the hinge's frame rather than in the world's.
    const desk: Part[] = [];
    const top = new THREE.BoxGeometry(deskW, 0.028, deskD);
    desk.push({ geometry: top, color: shade(timber, 1.08), sway: 0 });

    const lip = new THREE.BoxGeometry(deskW * 1.01, 0.032, 0.026);
    lip.translate(0, 0.02, deskD / 2 - 0.013);
    desk.push({ geometry: lip, color: shade(timber, 0.96), sway: 0 });

    // Two battens underneath, running with the fall. They carry the weight and
    // they are what is actually seen of the desk when you walk past it.
    for (const sx of [-1, 1]) {
      const batten = new THREE.BoxGeometry(0.03, 0.03, deskD * 0.86);
      batten.translate((sx * deskW) / 3.4, -0.028, 0);
      desk.push({ geometry: batten, color: shade(timber, 0.82), sway: 0 });
    }

    for (const part of desk) {
      part.geometry.rotateX(slope);
      part.geometry.translate(0, height - 0.04, 0);
      parts.push(part);
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'lectern', 0);
  },
};
