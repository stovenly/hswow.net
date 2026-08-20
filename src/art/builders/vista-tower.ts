import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';

// A single tall landmark — the object whose job is to be looked at rather than
// looked past. Six-sided rather than round, because the silhouette of a hexagonal
// prism against sky is straighter and reads as built; battered, wider at the foot,
// because a vertical-sided tower at a kilometre looks like a post. Thirty-six
// triangles.

const STONE = [PALETTE.STONE_DARK, PALETTE.STONE] as const;

export const vistaTower: MeshBuilder = {
  name: 'vista-tower',
  category: 'vista',
  radius: 6,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);

    const height = rng.range(17, 27);
    const foot = rng.range(2.4, 4.2);
    // A slight batter. Enough to read, not enough to look like a cone.
    const top = foot * rng.range(0.72, 0.88);

    const shaft = new THREE.CylinderGeometry(top, foot, height, 6, 1);
    shaft.translate(0, height / 2, 0);

    const roofHeight = rng.range(3, 6.5);
    const roof = new THREE.ConeGeometry(top * rng.range(1.1, 1.35), roofHeight, 6);
    roof.translate(0, height + roofHeight / 2, 0);

    const turn = rng.range(0, Math.PI * 2);
    shaft.rotateY(turn);
    roof.rotateY(turn);

    const parts: Part[] = [
      { geometry: shaft, color: rng.pick(STONE), sway: 0 },
      // Darker than the shaft, always. A roof reads as a roof because it is the
      // dark cap on a pale mass, and that survives fog where its shape does not.
      { geometry: roof, color: shade(PALETTE.STONE_DARK, rng.range(0.6, 0.74)), sway: 0 },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-tower', 0));
  },
};
