import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A hay bale: one corded rectangular bale.
 *
 * **One.** It briefly rolled its own stack — a bale, or two, or three piled up —
 * on the reasoning that a single bale is a knee-high box and three of them
 * against a gateway is a wall, so one name would give both registers. That is
 * the builder taking a decision that is not its to take: a stack of bales is
 * three bales put on top of each other, which is a thing a person does when
 * placing them, and a builder that rolls the count cannot be asked for the plain
 * version at all.
 *
 * A corded rectangular bale rather than a round one: a round bale is machinery,
 * and it does not stack. This one does — squarely, at a known height, which is
 * what makes it stackable **by hand**.
 *
 * ## Straw is a texture problem solved with two cords and four wisps
 *
 * A bale is a rectangular block, which is the most obviously untouched primitive
 * there is — `crate` has the same problem and answers it the same way. The cords
 * cost twenty-four triangles and are most of what says *made*, because the eye
 * looks for edges and joins and giving it some is nearly all that detail means at
 * this polygon count. The wisps standing out of the ends are the other half:
 * they break the silhouette, which is the only thing that survives distance.
 *
 * The colour is `GRASS_DRY` lifted, because that is what the kit already calls
 * cut and dried, and a fourth brown in the palette for one prop would be a fourth
 * brown to keep in step with the other three.
 */
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
