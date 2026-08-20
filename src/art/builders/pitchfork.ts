import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A pitchfork: a long shaft, a socket, and two or three long tines. Built along
// +X with its butt at the origin, in the air, because a hand tool has no one
// resting position — the placer turns it to whatever it is doing.
//
// What separates it from a rake has to be visible in silhouette: two or three
// tines, long — a third of the shaft — curved in the plane of the fork, and
// pointing along the shaft rather than square to it. The iron ferrule where the
// head is driven onto the wood is the join, and the only detail worth triangles.
export const pitchfork: MeshBuilder = {
  name: 'pitchfork',
  category: 'objects',
  radius: 1.25,
  // A tool leaning in a corner is not something you are stopped by.
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const shaft = rng.range(1.35, 1.7);
    const thick = rng.range(0.021, 0.028);
    const timber = shade(PALETTE.TIMBER, rng.range(0.94, 1.08));
    const iron = shade(PALETTE.IRON, rng.range(0.9, 1.08));

    // The shaft, butt at the origin, running out along +X.
    const pole = new THREE.CylinderGeometry(thick, thick * 1.12, shaft, 6);
    pole.rotateZ(-Math.PI / 2);
    pole.translate(shaft / 2, 0, 0);
    parts.push({ geometry: pole, color: timber, sway: 0 });

    // A worn grip at the butt end — one band, which is all a hand's worth of
    // wear reads as.
    const grip = new THREE.CylinderGeometry(thick * 1.25, thick * 1.25, rng.range(0.1, 0.16), 6);
    grip.rotateZ(-Math.PI / 2);
    grip.translate(rng.range(0.08, 0.16), 0, 0);
    parts.push({ geometry: grip, color: shade(PALETTE.HIDE, 0.85), sway: 0 });

    // The socket, over the join. Tapered, so it reads as driven on.
    const socket = rng.range(0.13, 0.19);
    const ferrule = new THREE.CylinderGeometry(thick * 1.5, thick * 1.9, socket, 7);
    ferrule.rotateZ(-Math.PI / 2);
    ferrule.translate(shaft - socket * 0.35, 0, 0);
    parts.push({ geometry: ferrule, color: iron, sway: 0 });

    // The tines. Two or three, spread across the fork's own plane, each in two
    // lengths so it can curve — a straight tine is a nail.
    const tines = rng.int(2, 3);
    const reach = shaft * rng.range(0.3, 0.38);
    const spread = rng.range(0.09, 0.14);
    const curl = rng.range(0.1, 0.22);
    const root = shaft - socket * 0.2;

    const UP = new THREE.Vector3(0, 1, 0);
    /** A length of tine between two points in space, lapped at both ends. */
    const limb = (from: THREE.Vector3, to: THREE.Vector3, fat: number): void => {
      const along = new THREE.Vector3().subVectors(to, from);
      const run = along.length();
      if (run < 1e-4) return;
      const piece = new THREE.CylinderGeometry(fat * 0.62, fat, run * 1.14, 4);
      piece.translate(0, run / 2, 0);
      piece.applyQuaternion(
        new THREE.Quaternion().setFromUnitVectors(UP, along.clone().divideScalar(run)),
      );
      piece.translate(from.x, from.y, from.z);
      parts.push({ geometry: piece, color: iron, sway: 0 });
    };

    for (let i = 0; i < tines; i++) {
      const across = tines === 1 ? 0 : (i / (tines - 1) - 0.5) * 2 * spread;
      // Every tine starts inside the socket, on the shaft's own line, so the
      // whole head is one fan out of one point rather than a set of prongs
      // hanging near the end of a stick.
      const heel = new THREE.Vector3(root - socket * 0.3, 0, across * 0.2);
      // Out and up, then out and back down — the curve that keeps a load on.
      // The rise is carried through in the *points*, not applied to a piece
      // afterwards, so the second length starts exactly where the first ends.
      const knee = new THREE.Vector3(root + reach * 0.5, curl, across * 0.8);
      const point = new THREE.Vector3(root + reach, curl * 0.45, across);

      limb(heel, knee, thick * 0.62);
      limb(knee, point, thick * 0.5);
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'pitchfork', 0);
  },
};
