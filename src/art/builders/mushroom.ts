import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * A cluster of mushrooms, several to a clump at different ages.
 *
 * Never one. Fungi fruit in groups from the same mycelium, and a single
 * mushroom standing alone looks placed, where five of graded sizes look grown.
 * The youngest are barely open and the oldest are flat and turned up at the
 * edges, which is the same shape at different points in its life rather than
 * five different shapes.
 *
 * Walk-through, like the grass — small soft things that stop the player are
 * what make a world feel like a floor with obstacles glued to it.
 */
export const mushroom: MeshBuilder = {
  name: 'mushroom',
  category: 'foliage',
  radius: 0.4,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const count = rng.int(3, 7);
    // One colour for the clump: they are the same organism.
    const cap = rng.pick([PALETTE.RUST, PALETTE.EARTH, PALETTE.STONE_PALE, PALETTE.BARK_PALE]);

    for (let i = 0; i < count; i++) {
      // Age, 0 young to 1 old. Everything else follows from it.
      const age = rng();
      const size = rng.range(0.04, 0.12) * (0.45 + age * 0.8);
      const stemHeight = size * rng.range(1.6, 3.2);

      const angle = rng.range(0, Math.PI * 2);
      const distance = Math.sqrt(rng()) * 0.22;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const lean = rng.around(0, 0.22);

      const stem = new THREE.CylinderGeometry(size * 0.22, size * 0.3, stemHeight, 5);
      stem.translate(0, stemHeight / 2, 0);
      stem.rotateZ(lean);
      stem.translate(x, 0, z);
      parts.push({ geometry: stem, color: PALETTE.CLOTH, sway: 0 });

      // Young caps are tall domes; old ones are wide and flat. A cone with a
      // height that falls as the radius grows is that whole progression.
      const capRadius = size * (0.85 + age * 0.7);
      const capHeight = size * (1.5 - age * 1.05);
      const dome = new THREE.ConeGeometry(capRadius, capHeight, rng.int(6, 9));
      dome.translate(0, capHeight / 2 - capHeight * 0.15, 0);
      dome.rotateZ(lean);
      dome.translate(x, stemHeight, z);
      parts.push({ geometry: dome, color: cap, sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'mushroom', 0);
  },
};
