import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A bramble thicket: a low mass with half a dozen canes looping out of it and
// diving back to the ground, which is the silhouette. Every joint stops at the
// ground, the leaves sit on the cane in threes, and the canes come up from a stool
// a few centimetres across leaning the same general way.
export const bramble: MeshBuilder = {
  name: 'bramble',
  category: 'foliage',
  radius: 1.3,
  // Walked through, in spite of being the one plant here that would really stop
  // you: a tangle's collision volume would have to be the tangle, and anything
  // simpler catches the player on air a foot from the canes.
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const canes = rng.int(5, 8);
    const reach = rng.range(0.85, 1.4);
    const wood = rng.chance(0.5) ? 0x5a4a38 : 0x6b5230;
    const leaf = rng.chance(0.5) ? PALETTE.LEAF_DARK : PALETTE.LEAF;
    // The way the thicket leans as a whole. Brambles grow toward the light, so
    // a clump that radiates evenly reads as a firework rather than as scrub.
    const lean = rng.range(0, Math.PI * 2);

    for (let c = 0; c < canes; c++) {
      const bearing = lean + rng.range(-1.5, 1.5);
      const grown = reach * rng.range(0.65, 1.1);
      const segments = 4;
      const step = grown / segments;
      const thick = rng.range(0.013, 0.022);

      // Up out of the stool, over the top, and down again. Ending below
      // horizontal is what makes it an arch rather than a branch.
      let pitch = rng.range(1, 1.35);
      // Rooted a few centimetres off centre, not all from one point.
      const root = rng.range(0, 0.09);
      const rootAt = rng.range(0, Math.PI * 2);
      let x = Math.cos(rootAt) * root;
      let y = 0.02;
      let z = Math.sin(rootAt) * root;

      for (let i = 0; i < segments; i++) {
        const piece = new THREE.CylinderGeometry(thick * 0.72, thick, step * 1.1, 4);
        piece.translate(0, step / 2, 0);
        piece.rotateX(Math.PI / 2 - pitch);
        piece.rotateY(bearing);
        piece.translate(x, y, z);
        // Only the far end of a cane moves. The base of a thicket is a mat of
        // woody stems and does not.
        const looseness = (i / segments) ** 1.4;
        parts.push({ geometry: piece, color: shade(wood, rng.range(0.88, 1.1)), sway: looseness });

        // Advance along the cane, taken from the rotation the geometry got.
        const out = Math.cos(pitch) * step;
        const nx = x + Math.sin(bearing) * out;
        const ny = y + Math.sin(pitch) * step;
        const nz = z + Math.cos(bearing) * out;

        // Leaves in threes, sitting *on* the cane at the joint rather than
        // scattered near it. A bramble leaf is three leaflets round a point,
        // and three small fins is exactly that at this size.
        if (ny > 0.05) {
          for (let l = 0; l < 3; l++) {
            const size = thick * rng.range(3.6, 5.4);
            const blade = new THREE.ConeGeometry(size * 0.55, size * 1.5, 3);
            blade.translate(0, size * 0.75, 0);
            blade.scale(1, 1, 0.3);
            blade.rotateZ(rng.range(0.9, 1.4));
            blade.rotateY((l / 3) * Math.PI * 2 + rng.range(0, 0.4));
            blade.translate(nx, ny, nz);
            parts.push({
              geometry: blade,
              color: shade(leaf, rng.range(0.85, 1.15)),
              sway: looseness,
            });
          }
        }

        x = nx;
        // **Clamped at the ground.** Past the top of the arch the pitch is
        // negative and the cane is heading down; without this the last segment
        // or two are buried and the whip appears to stop in mid-air.
        y = Math.max(0.03, ny);
        z = nz;
        pitch -= rng.range(0.4, 0.7);
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'bramble', rng.range(0, Math.PI * 2));
  },
};
