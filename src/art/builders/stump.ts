import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

// A cut stump with roots spreading into the ground. The cut face is a separate
// disc in a paler colour, because the inside of a tree is not the colour of its
// bark, and that contrast is what makes it read as cut rather than as a short post.
export const stump: MeshBuilder = {
  name: 'stump',
  category: 'foliage',
  radius: 0.75,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(0.3, 0.7);
    const top = rng.range(0.22, 0.36);
    const bottom = top * rng.range(1.25, 1.6);
    const sides = rng.int(6, 9);
    // Cut at a slight angle, as a saw leaves it.
    const lean = rng.range(0, 0.12);

    const trunk = new THREE.CylinderGeometry(top, bottom, height, sides);
    trunk.translate(0, height / 2, 0);
    trunk.rotateZ(lean);
    parts.push({ geometry: trunk, color: PALETTE.BARK, sway: 0 });

    // The cut face, a shade proud of the trunk so it is never z-fighting.
    const face = new THREE.CylinderGeometry(top * 0.94, top * 0.94, 0.04, sides);
    face.translate(0, height, 0);
    face.rotateZ(lean);
    parts.push({ geometry: face, color: PALETTE.BARK_PALE, sway: 0 });

    // Roots, angled out and down so they disappear into the ground.
    const roots = rng.int(3, 6);
    for (let i = 0; i < roots; i++) {
      const length = rng.range(0.3, 0.6);
      const root = new THREE.CylinderGeometry(0.04, 0.11, length, 4);
      root.translate(0, -length / 2, 0);
      root.rotateZ(rng.range(1.05, 1.45));
      root.rotateY((i / roots) * Math.PI * 2 + rng.around(0, 0.5));
      root.translate(0, rng.range(0.05, 0.16), 0);
      parts.push({ geometry: root, color: PALETTE.BARK, sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'stump', 0);
  },
};
