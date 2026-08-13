import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';

/**
 * A drystone wall wandering off over a distant slope.
 *
 * **The cheapest thing in the band that says the land is used.** Hills say
 * geography; a wall says somebody divided this up and keeps sheep. Four slabs
 * end to end, each turned a few degrees off the last, so the run bends the way
 * a field boundary does — following ground nobody can see any more.
 *
 * Low and long. At a hundred metres two metres of height is about a degree, so
 * this is very nearly a line — which is correct, and why it is worth so little
 * geometry. Sunk a third of its height, because a wall on distant ground should
 * disappear into every dip rather than ride over them: the builder cannot know
 * what it is standing on, so it is built to be partly buried wherever it lands.
 */

const DRYSTONE = [PALETTE.STONE_DARK, PALETTE.STONE] as const;

export const vistaFieldWall: MeshBuilder = {
  name: 'vista-field-wall',
  category: 'vista',
  radius: 22,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);

    const runs = 4;
    const thick = rng.range(0.7, 1.1);
    const parts: Part[] = [];

    // Walked out segment by segment from one end, each turning off the last, so
    // the run stays continuous however much it wanders.
    let x = 0;
    let z = 0;
    let heading = rng.range(0, Math.PI * 2);

    for (let i = 0; i < runs; i++) {
      const length = rng.range(11, 19);
      const height = rng.range(1.5, 2.4);
      // A few degrees each joint. More and it reads as a pen; less and it is a
      // straight line, which nothing in a field ever is.
      heading += rng.range(-0.28, 0.28);

      const slab = new THREE.BoxGeometry(length, height, thick);
      // Sunk, and the top jitters — a drystone wall is level nowhere.
      slab.translate(length / 2, height * rng.range(0.16, 0.34), 0);
      slab.rotateY(heading);
      slab.translate(x, 0, z);
      parts.push({
        geometry: slab,
        color: shade(rng.pick(DRYSTONE), rng.range(0.92, 1.06)),
        sway: 0,
      });

      x += Math.cos(heading) * length;
      z -= Math.sin(heading) * length;
    }

    // Centred on itself, so placing it by a single point puts the middle of the
    // run there rather than one end.
    const merged = assemble(parts);
    merged.computeBoundingBox();
    const box = merged.boundingBox;
    if (box) merged.translate(-(box.min.x + box.max.x) / 2, 0, -(box.min.z + box.max.z) / 2);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-field-wall', 0));
  },
};
