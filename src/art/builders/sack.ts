import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A sack of grain, standing where it was set down.
 *
 * **One sack.** It was a pile of three to five, arranged along a run with some
 * leaning and some lying — which is a builder deciding how many sacks are here
 * and how they are laid out, and that is placement. Two sacks against a wall, or
 * six across a barn floor, or one on a cart: all of those are things to put
 * there, and none of them can be got out of a builder that always makes a pile.
 * So it makes a sack, and the variety is in the sack.
 *
 * ## What a sack looks like, since the first version did not
 *
 * It was built as a stack of rings with a knot on top, and it came out as a
 * barrel wearing a hat — which is what that construction gives, because a stack
 * of rings *is* a barrel. The profile is the whole object:
 *
 * - **A full sack sits on a flat bottom** and spreads there. It is *widest at
 *   the base*, not a third of the way up. That single fact separates cloth from
 *   a cask: a cask bulges at its waist because its staves are sprung; a sack
 *   bulges at its foot because the grain is lying on the floor of it.
 * - **It narrows all the way up** from there, in a continuous curve, to about
 *   half its width at the shoulder.
 * - **The neck is a pinch, not a lid.** Above the shoulder the empty cloth
 *   gathers to something much thinner than the body, and that abrupt step is the
 *   silhouette everybody recognises. The old neck was two thirds the body's
 *   width — a lid.
 *
 * Turned from a profile rather than stacked from rings, for `barrel`'s reason: a
 * profile that begins and ends on the axis closes itself, where stacked sections
 * bury a pair of coincident end caps at every join.
 *
 * ## The variety is in the shape, not around it
 *
 * How full it is, how tall, how hard the neck is drawn in, and how far the whole
 * thing leans — a sack that has been shoved against something slumps. There is
 * nothing scattered at its foot: a builder makes the object.
 */
export const sack: MeshBuilder = {
  name: 'sack',
  category: 'objects',
  radius: 0.45,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const cloth = shade(PALETTE.CLOTH, rng.range(0.84, 1.04));
    const cord = shade(PALETTE.HIDE, rng.range(0.8, 0.95));
    const sides = 8;

    // How full it is: a well-filled sack is squat and wide, a half-empty one is
    // narrow and slumps. One roll, and everything else follows it.
    const full = rng.range(0, 1);
    const girth = rng.range(0.2, 0.28) * (0.88 + full * 0.24);
    const tall = girth * (3.1 - full * 0.9);

    // Widest at the foot, narrowing all the way, then a hard pinch to the neck.
    // The step between the last body point and the first neck point is the
    // gather, and it is meant to be abrupt.
    const shoulder = girth * rng.range(0.5, 0.62);
    const neck = girth * rng.range(0.18, 0.27);
    const body = tall * rng.range(0.72, 0.8);
    const profile = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(girth * 0.86, 0),
      new THREE.Vector2(girth, tall * 0.1),
      new THREE.Vector2(girth * (0.86 + full * 0.06), tall * 0.34),
      new THREE.Vector2(shoulder, body),
      new THREE.Vector2(neck, body + tall * 0.07),
      new THREE.Vector2(neck * rng.range(0.85, 1.05), tall),
      new THREE.Vector2(0, tall),
    ];

    const built: THREE.BufferGeometry[] = [];
    const tint: number[] = [];
    built.push(new THREE.LatheGeometry(profile, sides));
    tint.push(cloth);

    // The cord round the gather.
    const tie = new THREE.CylinderGeometry(neck * 1.25, neck * 1.25, tall * 0.045, sides);
    tie.translate(0, body + tall * 0.09, 0);
    built.push(tie);
    tint.push(cord);

    // The puckered top above the tie, where the cloth is bunched.
    const knot = new THREE.ConeGeometry(neck * 1.5, tall * 0.16, 5);
    knot.rotateZ(rng.around(0, 0.35));
    knot.translate(rng.around(0, neck * 0.4), tall * 1.02, rng.around(0, neck * 0.4));
    built.push(knot);
    tint.push(shade(cloth, 0.94));

    // **The lean, about the foot.** A sack shoved against something slumps, and
    // a slumped one is the commoner sight — but it has to pivot on the corner of
    // its own base or it lifts off the ground. Applied to the whole sack at once
    // so the tie and the knot go over with the body.
    const lean = rng.range(0, 0.26);
    const facing = rng.range(0, Math.PI * 2);
    for (let i = 0; i < built.length; i++) {
      const piece = built[i];
      // Tipped about the point of the base it is leaning onto, which is `girth`
      // out along the lean's own direction. Rolling it about the axis instead
      // digs the far side of the base into the ground.
      piece.translate(-girth * 0.7, 0, 0);
      piece.rotateZ(lean);
      piece.translate(girth * 0.7, 0, 0);
      piece.rotateY(facing);
      parts.push({ geometry: piece, color: tint[i], sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'sack', 0);
  },
};
