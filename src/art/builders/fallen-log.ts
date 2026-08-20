import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A fallen log: a trunk lying where it came down. Elongation is the whole
// silhouette — four times longer than it is wide and lying dead flat — with a real
// taper and a squared broken end, because a log with two domed ends is a sausage.
// Built lying along +X on y = 0.
export const fallenLog: MeshBuilder = {
  name: 'fallen-log',
  category: 'nature',
  radius: 2.2,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const length = rng.range(2.4, 4.6);
    const butt = rng.range(0.16, 0.26);
    const tip = butt * rng.range(0.6, 0.8);
    const bark = rng.chance(0.45) ? PALETTE.BARK_PALE : PALETTE.BARK;
    // How far it has rotted. Old logs go pale and green; fresh ones stay dark.
    const rot = rng.range(0, 1);
    const moss = 0x51653a;

    // Sunk very slightly, so it beds into the ground instead of resting on a
    // tangent line. A cylinder touching a plane along one line reads as
    // balanced; a centimetre of overlap reads as lying there.
    const lie = butt * 0.86;

    const trunk = new THREE.CylinderGeometry(tip, butt, length, 8);
    trunk.rotateZ(Math.PI / 2);
    trunk.rotateX(rng.around(0, 0.12));
    trunk.translate(0, lie, 0);
    parts.push({
      geometry: trunk,
      // Moss on the upper surface only, which is where it grows and where the
      // light is. Evaluated per face at its centroid, so it lands on facet
      // boundaries and stays crisp rather than smearing into a gradient.
      color: (_x, y) => (y > lie + butt * 0.35 && rng.chance(0) === false && rot > 0.45 ? moss : bark),
      sway: 0,
    });

    // A broken end: a short ragged cone where the trunk snapped, paler than the
    // bark because it is the inside of the tree.
    const broken = new THREE.ConeGeometry(butt * 0.92, butt * 1.1, 6);
    broken.rotateZ(-Math.PI / 2);
    broken.translate(length / 2 + butt * 0.4, lie, 0);
    parts.push({ geometry: broken, color: shade(PALETTE.TIMBER, 0.86), sway: 0 });

    // Stub branches, snapped off short. Two or three, all on the upper half —
    // the ones underneath broke off when it landed.
    const stubs = rng.int(2, 4);
    for (let i = 0; i < stubs; i++) {
      const at = rng.range(-length * 0.42, length * 0.35);
      const out = rng.range(0.18, 0.42);
      const bearing = rng.range(0.3, Math.PI - 0.3) * (rng.chance(0.5) ? 1 : -1);
      const stub = new THREE.CylinderGeometry(butt * 0.16, butt * 0.26, out, 5);
      stub.translate(0, out / 2, 0);
      stub.rotateX(Math.PI / 2 - rng.range(0.4, 1.1));
      stub.rotateY(bearing);
      stub.translate(at, lie + butt * 0.4, 0);
      parts.push({ geometry: stub, color: shade(bark, 0.9), sway: 0 });
    }

    // Bracket fungus on the rotten ones — the one detail that says *dead* rather
    // than merely fallen.
    if (rot > 0.6) {
      const shelves = rng.int(2, 4);
      for (let i = 0; i < shelves; i++) {
        const at = rng.range(-length * 0.4, length * 0.4);
        const side = rng.chance(0.5) ? 1 : -1;
        const shelf = new THREE.CylinderGeometry(rng.range(0.06, 0.12), rng.range(0.03, 0.06), 0.025, 6);
        shelf.rotateZ(side * 0.5);
        shelf.translate(at, lie + rng.range(0, butt * 0.5), side * butt * 0.85);
        parts.push({ geometry: shelf, color: 0xbdae8c, sway: 0 });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'fallen-log', 0);
  },
};
