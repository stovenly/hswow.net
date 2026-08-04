import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A run of steel handrail: stanchions, two rails, and a kick plate.
 *
 * The piece of industrial furniture that does the most for scale. A gantry, a
 * platform edge or a stair is unreadable as a *height* without something at
 * hand level beside it, and a railing is the only prop in the kit whose entire
 * job is to be exactly one metre off the floor. Standing next to one tells you
 * how big everything else is.
 *
 * **Three heights, and they are all standards.** Top rail at 1.1 m, mid rail at
 * roughly half that, kick plate at the floor. Those numbers are not decoration:
 * they are what industrial railings are actually built to, and getting them
 * right is most of why one reads as a railing rather than as a fence. A rail at
 * 1.4 m is a barrier and a rail at 0.8 m is a bench back.
 *
 * The kick plate is the detail most often left off and the one that says
 * *industrial* loudest — it exists so dropped tools cannot go over the edge,
 * which is a concern nowhere but a works.
 */
export const railing: MeshBuilder = {
  name: 'railing',
  category: 'structures',
  radius: 1.5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const length = rng.range(2.2, 3.2);
    // Tight around the standard. The variation is manufacturing tolerance and
    // a slightly different works, not a different idea of what a railing is.
    const top = rng.range(1.04, 1.14);
    const railR = rng.range(0.021, 0.028);
    const postR = railR * rng.range(1.05, 1.25);

    const painted = rng.chance(0.55);
    // Safety yellow on some, bare galvanised on the rest. Both are right, and
    // the yellow ones are what a walkway edge actually looks like.
    const coat = painted
      ? shade(0xb8992e, rng.range(0.92, 1.08))
      : shade(0x8d949a, rng.range(0.92, 1.08));
    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));

    // --- stanchions ----------------------------------------------------------
    //
    // Spaced by dividing the run rather than by a fixed pitch, so the end posts
    // always land exactly on the ends. A fixed pitch leaves a short bay at one
    // end, which reads as a mistake rather than as a longer railing.
    const bays = Math.max(2, Math.round(length / rng.range(1.1, 1.5)));
    for (let i = 0; i <= bays; i++) {
      const x = -length / 2 + (length * i) / bays;

      const post = new THREE.CylinderGeometry(postR * 0.92, postR, top, 6);
      post.translate(x, top / 2, 0);
      parts.push({ geometry: post, color: coat, sway: 0 });

      // A base plate, bolted down. Square, where everything above it is round —
      // which is exactly how they are made, and the change of shape is what
      // makes the foot read as a fixing rather than as the post continuing.
      const plate = new THREE.BoxGeometry(postR * 4.6, postR * 0.7, postR * 4.6);
      plate.translate(x, postR * 0.35, 0);
      parts.push({ geometry: plate, color: shade(iron, 0.88), sway: 0 });
    }

    // --- rails ---------------------------------------------------------------
    //
    // Run past the end stanchions on both sides, so the joint is a lap rather
    // than four faces meeting in one plane.
    for (const at of [top - railR, top * rng.range(0.48, 0.56)]) {
      const rail = new THREE.CylinderGeometry(railR, railR, length + postR * 2.4, 8);
      rail.rotateZ(Math.PI / 2);
      rail.translate(0, at, 0);
      parts.push({ geometry: rail, color: coat, sway: 0 });
    }

    // Rounded returns at each end of the top rail, so it does not terminate in
    // an open tube at shin height for the next person along.
    for (const side of [-1, 1]) {
      const cap = new THREE.CylinderGeometry(railR * 1.1, railR * 1.1, railR * 1.6, 8);
      cap.rotateZ(Math.PI / 2);
      cap.translate((side * (length + postR * 2.4)) / 2, top - railR, 0);
      parts.push({ geometry: cap, color: shade(coat, 0.9), sway: 0 });
    }

    // --- kick plate ----------------------------------------------------------
    const kickH = rng.range(0.1, 0.15);
    const kick = new THREE.BoxGeometry(length, kickH, railR * 0.7);
    kick.translate(0, kickH / 2 + rng.range(0.005, 0.02), postR * 0.8);
    parts.push({ geometry: kick, color: shade(coat, 0.86), sway: 0 });

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'railing', 0, 'metal-ring');
  },
};
