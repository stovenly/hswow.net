import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A snag: a standing dead trunk, snapped off well above head height — four to six
// metres of vertical mass for about eighty triangles. The break is the whole
// silhouette: three cones leaning outward to different heights, because timber
// tears along the grain and never breaks level. The bark comes off in sheets from
// the top down, done as a colour function, so a patch lands on facet boundaries
// and reads as a hard-edged sheet.
export const snag: MeshBuilder = {
  name: 'snag',
  category: 'foliage',
  radius: 1,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(3.4, 6.2);
    const butt = rng.range(0.24, 0.42);
    const top = butt * rng.range(0.5, 0.72);
    const sides = rng.int(6, 8);
    const lean = rng.around(0, 0.07);
    const bark = rng.chance(0.5) ? PALETTE.BARK_PALE : PALETTE.BARK;
    const bare = shade(PALETTE.TIMBER, rng.range(0.86, 1));
    // How far down the bark has gone. Fresh snags keep most of it; old ones are
    // bare to the ground and pale all over.
    const stripped = rng.range(0.15, 0.9);
    const ax = rng.range(0, Math.PI * 2);

    const trunk = new THREE.CylinderGeometry(top, butt, height, sides);
    trunk.translate(0, height / 2, 0);
    trunk.rotateZ(lean);
    parts.push({
      geometry: trunk,
      // Bare above the line, and ragged along it — a sheet of bark peels off in
      // a torn edge, never a ring.
      color: (x, y, z) => {
        const edge = height * (1 - stripped) + Math.sin(Math.atan2(z, x) * 3 + ax) * height * 0.12;
        return y > edge ? shade(bare, 0.94 + (y / height) * 0.12) : shade(bark, 0.9 + (y / height) * 0.2);
      },
      sway: 0,
    });

    // The break: splinters standing off the top at different heights, leaning
    // out. Never level — see the header.
    for (let i = rng.int(3, 5); i > 0; i--) {
      const reach = rng.range(0.2, 0.75);
      const around = rng.range(0, Math.PI * 2);
      const spike = new THREE.ConeGeometry(top * rng.range(0.25, 0.5), reach, 4);
      spike.translate(0, reach / 2, 0);
      spike.rotateZ(rng.range(0.06, 0.35));
      spike.rotateY(around);
      spike.translate(0, height - rng.range(0, 0.12), 0);
      spike.rotateZ(lean);
      parts.push({ geometry: spike, color: shade(bare, rng.range(0.9, 1.05)), sway: 0 });
    }

    // Broken boughs, short and pointing down-ish. A dead branch that still
    // reaches out horizontally has not been dead long enough to be on a snag.
    for (let i = rng.int(2, 5); i > 0; i--) {
      const at = height * rng.range(0.35, 0.92);
      const out = rng.range(0.4, 1.1);
      const bough = new THREE.CylinderGeometry(0.03, rng.range(0.06, 0.12), out, 4);
      bough.translate(0, out / 2, 0);
      bough.rotateZ(rng.range(1.1, 1.6));
      bough.rotateY(rng.range(0, Math.PI * 2));
      bough.translate(0, at, 0);
      bough.rotateZ(lean);
      parts.push({ geometry: bough, color: shade(bare, rng.range(0.85, 1)), sway: 0 });
    }

    // Root flare at the foot, so it grows out of the ground instead of being
    // pushed into it.
    for (let i = rng.int(3, 5); i > 0; i--) {
      const out = rng.range(0.25, 0.5);
      const root = new THREE.CylinderGeometry(0.04, butt * 0.4, out, 4);
      root.translate(0, -out / 2, 0);
      root.rotateZ(rng.range(1.05, 1.4));
      root.rotateY(rng.range(0, Math.PI * 2));
      root.translate(0, rng.range(0.1, 0.3), 0);
      parts.push({ geometry: root, color: shade(bark, 0.88), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'snag', 0);
  },
};
