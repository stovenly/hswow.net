import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A hay bale: one corded rectangular bale, and one is all it is — a stack is
// something a person does when placing them. Rectangular rather than round,
// because a round bale is machinery and does not stack. The cords and the wisps
// standing out of the ends are what say made and break the silhouette; a bare
// block is the most obviously untouched primitive there is.
export const hayBale: MeshBuilder = {
  name: 'hay-bale',
  category: 'objects',
  radius: 0.8,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const straw = shade(PALETTE.GRASS_DRY, rng.range(1.02, 1.18));
    const cord = shade(PALETTE.HIDE, rng.range(0.8, 1));

    const length = rng.range(0.85, 1.05);
    const width = length * rng.range(0.45, 0.58);
    const tall = length * rng.range(0.42, 0.55);

    const l = length;
    const w = width;
    const h = tall;

    const body = new THREE.BoxGeometry(l, h, w);
    body.translate(0, h / 2, 0);
    parts.push({ geometry: body, color: shade(straw, rng.around(1, 0.06)), sway: 0 });

    // Two cords round the short way, standing proud so they catch the light
    // separately from the straw.
    for (const at of [-0.26, 0.26]) {
      const band = new THREE.BoxGeometry(0.035, h * 1.02, w * 1.03);
      band.translate(l * at, h / 2, 0);
      parts.push({ geometry: band, color: cord, sway: 0 });
    }

    // Loose straw out of the cut ends. Thin cones, sticking out level — this is
    // silhouette work and nothing else.
    for (let s = rng.int(2, 5); s > 0; s--) {
      const out = rng.range(0.06, 0.16);
      const side = rng.chance(0.5) ? 1 : -1;
      const wisp = new THREE.ConeGeometry(rng.range(0.008, 0.018), out, 3);
      wisp.rotateZ(-side * (Math.PI / 2) + rng.around(0, 0.5));
      wisp.translate(
        (side * l) / 2 + side * out * 0.4,
        h * rng.range(0.2, 0.85),
        rng.around(0, w * 0.35),
      );
      parts.push({ geometry: wisp, color: shade(straw, rng.range(1.05, 1.2)), sway: 0 });
    }

    // Square and level, standing on y = 0. **Not turned by the seed** — a bale
    // faces where it is put, and one that arrives at its own angle cannot be
    // squared up against the bale below it or the wall behind it.

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'hay-bale', 0);
  },
};
