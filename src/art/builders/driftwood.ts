import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { rod } from '../rod';
import { PALETTE, blend, shade } from '../palette';

// Driftwood: a bleached bare log lying along +X on y = 0, its root end at -X and
// lifted clear of the ground.
export const driftwood: MeshBuilder = {
  name: 'driftwood',
  category: 'nature',
  radius: 1.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const length = rng.range(1.8, 3.2);
    const butt = rng.range(0.13, 0.22);
    const tip = butt * rng.range(0.5, 0.62);
    const bleached = blend(PALETTE.TIMBER_PALE, 0xd9d4c8, rng.range(0.5, 0.7));
    const tilt = rng.range(0.08, 0.16);
    const lie = (length / 2) * Math.sin(tilt) + tip * 0.8;

    // rotateZ(π/2) takes +Y to -X, so the wide end lies at -X; rotateZ(-tilt) then lifts that end.
    const trunk = new THREE.CylinderGeometry(butt, tip, length, 7);
    trunk.rotateZ(Math.PI / 2);
    trunk.rotateZ(-tilt);
    trunk.translate(0, lie, 0);
    parts.push({ geometry: trunk, color: bleached, sway: 0 });

    const root = new THREE.Vector3(-(length / 2) * Math.cos(tilt), lie + (length / 2) * Math.sin(tilt), 0);
    const roots = rng.int(4, 6);
    for (let i = 0; i < roots; i++) {
      const spread = (i / roots) * Math.PI * 2 + rng.around(0, 0.4);
      const fan = rng.range(0.5, 1.1);
      const reach = rng.range(0.35, 0.7);
      const to = new THREE.Vector3(
        root.x - Math.cos(fan) * reach,
        root.y + Math.sin(fan) * Math.sin(spread) * reach,
        root.z + Math.sin(fan) * Math.cos(spread) * reach,
      );
      parts.push({
        geometry: rod(root, to, butt * 0.42, butt * 0.12, 4),
        color: shade(bleached, rng.range(0.86, 0.96)),
        sway: 0,
      });
    }

    for (let i = rng.int(1, 2); i > 0; i--) {
      const at = rng.range(-length * 0.3, length * 0.35);
      const from = new THREE.Vector3(at, lie - at * Math.sin(tilt) + butt * 0.3, 0);
      const bearing = rng.range(-1.1, 1.1);
      const out = rng.range(0.15, 0.32);
      const to = new THREE.Vector3(
        from.x + Math.sin(bearing) * out * 0.3,
        from.y + out * 0.8,
        from.z + Math.cos(bearing) * out * 0.6,
      );
      parts.push({ geometry: rod(from, to, butt * 0.24, butt * 0.12, 4), color: shade(bleached, 0.92), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'driftwood', 0);
  },
};
