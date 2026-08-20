import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A hay rake: a long shaft, a wooden head across it, and a row of pegs. Built
// along +X with its butt at the origin, in the air, for `pitchfork`'s reason.
//
// It must not read as a pitchfork, and the difference is the head: a bar across
// the shaft at right angles, a third of its length, so it reads as a T from
// anywhere; teeth short, many and square to the ground; and wood rather than
// iron. Two struts run from partway up the shaft out to the ends of the head,
// with both their ends landing on points that already exist.
export const rake: MeshBuilder = {
  name: 'rake',
  category: 'objects',
  radius: 1.1,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const shaft = rng.range(1.4, 1.75);
    const thick = rng.range(0.02, 0.027);
    const timber = shade(PALETTE.TIMBER, rng.range(0.94, 1.08));
    const head = shade(PALETTE.TIMBER_DARK, rng.range(0.94, 1.08));

    // The shaft, butt at the origin, running out along +X.
    const pole = new THREE.CylinderGeometry(thick, thick * 1.12, shaft, 6);
    pole.rotateZ(-Math.PI / 2);
    pole.translate(shaft / 2, 0, 0);
    parts.push({ geometry: pole, color: timber, sway: 0 });

    const grip = new THREE.CylinderGeometry(thick * 1.25, thick * 1.25, rng.range(0.1, 0.16), 6);
    grip.rotateZ(-Math.PI / 2);
    grip.translate(rng.range(0.08, 0.16), 0, 0);
    parts.push({ geometry: grip, color: shade(PALETTE.HIDE, 0.85), sway: 0 });

    // --- the head ------------------------------------------------------------
    //
    // A bar across the end of the shaft. Wide, because that is the recognition.
    const wide = shaft * rng.range(0.3, 0.4);
    const barT = rng.range(0.032, 0.042);
    const at = shaft - barT * 0.5;
    const bar = new THREE.BoxGeometry(barT, barT * 1.35, wide);
    bar.rotateX(rng.around(0, 0.03));
    bar.translate(at, 0, 0);
    parts.push({ geometry: bar, color: head, sway: 0 });

    // The teeth: short pegs down through the bar, evenly spaced. Even, because a
    // rake with its teeth at random intervals is a rake with teeth missing —
    // and a missing tooth is a thing to place, not a thing to roll.
    const teeth = rng.int(7, 10);
    const tooth = rng.range(0.09, 0.13);
    for (let i = 0; i < teeth; i++) {
      const along = (i / (teeth - 1) - 0.5) * wide * 0.92;
      const peg = new THREE.CylinderGeometry(thick * 0.42, thick * 0.55, tooth + barT, 4);
      // Down, and a couple of degrees of rake so they are not machine-parallel.
      peg.rotateX(rng.around(0, 0.05));
      peg.rotateZ(rng.around(0, 0.05));
      peg.translate(at, -tooth * 0.5 + barT * 0.2, along);
      parts.push({ geometry: peg, color: shade(head, rng.range(0.92, 1.08)), sway: 0 });
    }

    // --- the braces ----------------------------------------------------------
    // From a point up the shaft out to each end of the head, so both ends land on
    // things that already exist. They land a third of the way in from each end,
    // where there is bar either side of the joint, and each is lapped past its
    // endpoint so it is let into the head rather than butted against it — at the
    // very end the bar is 3 cm of timber seen edge-on and a strut only grazes it.
    const UP = new THREE.Vector3(0, 1, 0);
    const collar = shaft * rng.range(0.68, 0.78);
    const lap = 0.05;
    for (const side of [-1, 1]) {
      const from = new THREE.Vector3(collar, 0, 0);
      const to = new THREE.Vector3(at, 0, side * wide * 0.34);
      const along = new THREE.Vector3().subVectors(to, from);
      const run = along.length();
      along.divideScalar(run);
      const strut = new THREE.CylinderGeometry(thick * 0.5, thick * 0.5, run + lap * 2, 4);
      strut.translate(0, run / 2, 0);
      strut.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, along));
      // Backed off along its own line by the lap, so the extra length is shared
      // between the two ends instead of all appearing beyond the head.
      strut.translate(from.x - along.x * lap, from.y - along.y * lap, from.z - along.z * lap);
      parts.push({ geometry: strut, color: shade(timber, 0.94), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'rake', 0);
  },
};
