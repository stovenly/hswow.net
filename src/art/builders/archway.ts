import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A standing stone archway: two piers and a lintel.
 *
 * Somewhere for a door to be that is not a building. A portal door standing
 * alone in a field reads as a mistake; the same door under an arch reads as a
 * threshold, which is what it is.
 *
 * Built facing **+Z** with its opening centred on the origin, matching the door
 * builder, so a portal can place both from the same position and yaw.
 */
export const archway: MeshBuilder = {
  name: 'archway',
  category: 'structures',
  radius: 1.8,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const opening = rng.range(1.5, 1.9);
    const height = rng.range(2.6, 3.1);
    const pier = rng.range(0.42, 0.58);
    const depth = rng.range(0.5, 0.7);
    const stone = rng.chance(0.5) ? PALETTE.STONE : PALETTE.STONE_DARK;

    // Piers, each a short stack of blocks so the joints show. One block per
    // pier would read as a poured slab.
    for (const side of [-1, 1]) {
      const courses = rng.int(3, 4);
      const course = height / courses;
      for (let i = 0; i < courses; i++) {
        // Each course a little different, and inset slightly as it rises.
        const taper = 1 - (i / courses) * 0.12;
        const block = new THREE.BoxGeometry(pier * taper, course * 1.02, depth * taper);
        block.translate(
          (side * (opening + pier)) / 2 + rng.around(0, 0.02),
          course * (i + 0.5),
          rng.around(0, 0.02),
        );
        parts.push({ geometry: block, color: shade(stone, rng.around(1, 0.08)), sway: 0 });
      }
    }

    // The lintel, overhanging both piers.
    const lintel = new THREE.BoxGeometry(opening + pier * 2.5, rng.range(0.34, 0.46), depth * 1.1);
    lintel.translate(0, height + 0.18, 0);
    parts.push({ geometry: lintel, color: shade(stone, 0.92), sway: 0 });

    // A cap on top, on some of them.
    if (rng.chance(0.55)) {
      const cap = new THREE.BoxGeometry(opening + pier * 1.6, 0.18, depth * 0.8);
      cap.translate(rng.around(0, 0.06), height + 0.48, 0);
      parts.push({ geometry: cap, color: shade(stone, 1.08), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'archway', 0);
  },
};
