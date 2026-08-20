import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A root tangle: roots washed clear of the soil along the lip of a bank — the one
// shape that can straddle a terrain step, because a root arch has one end above
// the lip and the other below it and is mostly holes.
//
// Arches, not a starburst: every root leaves the low mass, rises and dives back
// into the ground, with the height clamped at the ground or the far half of each
// is buried and what shows is a set of stubs. They lean one general way, because
// roots follow the fall of a bank. Not solid — the collision volume of a tangle
// would have to be the tangle, and anything simpler catches the player on air.
export const rootTangle: MeshBuilder = {
  name: 'root-tangle',
  category: 'nature',
  radius: 1.3,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const wood = rng.chance(0.5) ? PALETTE.BARK : shade(PALETTE.BARK_PALE, 0.9);
    const soil = shade(PALETTE.EARTH, rng.range(0.92, 1.12));
    // The fall of the bank. Roots hang down it rather than spreading evenly.
    const fall = rng.range(0, Math.PI * 2);

    // The mass they come out of: a low mound of soil still held together by the
    // roots inside it. Without it the arches start from nothing.
    const lumps = rng.int(2, 4);
    for (let i = 0; i < lumps; i++) {
      const radius = rng.range(0.22, 0.42);
      const clod = new THREE.IcosahedronGeometry(radius, 0);
      clod.scale(1, rng.range(0.45, 0.7), rng.range(0.9, 1.4));
      clod.rotateY(rng.range(0, Math.PI * 2));
      clod.translate(rng.around(0, 0.3), radius * rng.range(0.1, 0.3), rng.around(0, 0.3));
      parts.push({ geometry: clod, color: shade(soil, rng.range(0.9, 1.1)), sway: 0 });
    }

    // Four to seven, in three joints each, on three-sided stems. Deliberately mean:
    // a root is a centimetre or two thick and the arch is read entirely as a
    // silhouette, so every triangle past the outline is spent on nothing — and this
    // is knee-high scenery placed by the dozen along a bank.
    const roots = rng.int(4, 7);
    for (let r = 0; r < roots; r++) {
      const bearing = fall + rng.range(-1.4, 1.4);
      const reach = rng.range(0.7, 1.5);
      const segments = 3;
      const step = reach / segments;
      const thick = rng.range(0.03, 0.065);

      // Up out of the mass, over, and down again. Ending below horizontal is
      // what makes it an arch rather than a branch.
      let pitch = rng.range(0.55, 1);
      let x = rng.around(0, 0.18);
      let y = rng.range(0.05, 0.2);
      let z = rng.around(0, 0.18);

      for (let i = 0; i < segments; i++) {
        const piece = new THREE.CylinderGeometry(thick * 0.78, thick, step * 1.12, 3);
        piece.translate(0, step / 2, 0);
        piece.rotateX(Math.PI / 2 - pitch);
        piece.rotateY(bearing);
        piece.translate(x, y, z);
        parts.push({ geometry: piece, color: shade(wood, rng.range(0.85, 1.12)), sway: 0 });

        const out = Math.cos(pitch) * step;
        x += Math.sin(bearing) * out;
        // **Clamped at the ground**, so the tail of the arch stops where it
        // enters the soil instead of continuing underneath it.
        y = Math.max(0.02, y + Math.sin(pitch) * step);
        z += Math.cos(bearing) * out;
        pitch -= rng.range(0.35, 0.6);
      }

      // A fine root or two hanging off the arch, which is what makes it read as
      // washed out rather than carved.
      if (rng.chance(0.35)) {
        const hang = rng.range(0.08, 0.22);
        const whisker = new THREE.CylinderGeometry(thick * 0.2, thick * 0.4, hang, 3);
        whisker.translate(0, -hang / 2, 0);
        whisker.rotateZ(rng.around(0, 0.5));
        whisker.translate(x, Math.max(y, 0.12), z);
        parts.push({ geometry: whisker, color: shade(wood, 0.86), sway: 0 });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'root-tangle', 0);
  },
};
