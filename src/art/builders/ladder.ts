import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A ladder: two rails and the rungs between them.
 *
 * **That is the entire object.** It has been built twice already with brackets
 * standing it off a wall, a hoop cage over the climb, and straps tying the
 * hoops together — and each time the ladder itself disappeared into its own
 * ironmongery. A ladder is one of the simplest things there is, and the only
 * way to get one wrong is to add to it.
 *
 * The rungs are the silhouette and there is nothing here competing with them.
 *
 * Built climbing +Y with the rungs facing +Z, standing on y = 0. Where it
 * leans, what it leans against and whether anything holds it there are all the
 * caller's business.
 */
export const ladder: MeshBuilder = {
  name: 'ladder',
  category: 'structures',
  radius: 0.4,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(2.4, 4.6);
    const width = rng.range(0.36, 0.48);
    const railR = rng.range(0.02, 0.028);
    // A rung every 0.3 m. That is the pitch a person climbs at, and getting it
    // wrong makes the whole thing read as the wrong size without anybody being
    // able to say why.
    const pitch = 0.3;
    const rungs = Math.floor(height / pitch);

    const timber = rng.chance(0.45);
    const railColor = timber
      ? shade(PALETTE.TIMBER, rng.range(0.85, 1.05))
      : shade(PALETTE.IRON, rng.range(0.85, 1.05));
    const rungColor = timber
      ? shade(PALETTE.TIMBER_DARK, rng.range(0.9, 1.1))
      : shade(PALETTE.IRON, rng.range(1, 1.15));

    for (const side of [-1, 1]) {
      // Square in section for timber, flat bar on edge for iron. One number,
      // and it is most of the difference between a ladder in a barn and one in
      // a works.
      const stile = new THREE.BoxGeometry(
        railR * (timber ? 2 : 1.5),
        height,
        railR * (timber ? 2.2 : 3),
      );
      stile.translate((side * width) / 2, height / 2, 0);
      parts.push({ geometry: stile, color: railColor, sway: 0 });
    }

    for (let i = 0; i < rungs; i++) {
      // Timber rungs are square and iron ones are round, which is how they are
      // made — and it means the two versions differ from every angle rather
      // than only in colour.
      const bar = timber
        ? new THREE.BoxGeometry(width * 1.02, railR * 1.5, railR * 1.5)
        : new THREE.CylinderGeometry(railR * 0.72, railR * 0.72, width * 1.02, 6);
      if (!timber) bar.rotateZ(Math.PI / 2);
      bar.translate(0, pitch * (i + 0.6), 0);
      parts.push({ geometry: bar, color: rungColor, sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'ladder', 0);
  },
};
