import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { landWash, markVista, vistaMass } from '../vista';

// One big tree for the middle distance: a trunk and two or three canopy masses
// stacked on it, twelve to eighteen metres tall. Between a real tree, which stops
// paying for itself at forty metres, and the merged wood, which only reads past
// a hundred. The ring's scatter makes a line or an edge of these. Around sixty
// triangles.

const CANOPY = [PALETTE.LEAF_DARK, PALETTE.LEAF, PALETTE.GRASS] as const;

export const vistaTree: MeshBuilder = {
  name: 'vista-tree',
  category: 'vista',
  radius: 6,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const height = rng.range(12, 18);
    const trunkTop = height * rng.range(0.32, 0.42);
    const parts: Part[] = [];

    const trunk = new THREE.CylinderGeometry(0.35, 0.7, trunkTop, 5, 1, true);
    trunk.translate(0, trunkTop / 2, 0);
    parts.push({ geometry: trunk, color: shade(PALETTE.BARK, 0.9), sway: 0 });

    // Widest low and narrowing up, each lump a little off the axis.
    const lumps: THREE.BufferGeometry[] = [];
    const count = rng.int(2, 3);
    let y = trunkTop;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const radius = (height - trunkTop) * rng.range(0.24, 0.32) * (1 - t * 0.35);
      const lump = vistaMass(rng, {
        radius,
        detail: 0,
        rough: rng.range(0.16, 0.28),
        squash: rng.range(0.7, 0.95),
        stretch: rng.range(0.8, 1.25),
        bury: 0.1,
      });
      lump.rotateY(rng.range(0, Math.PI * 2));
      lump.translate(rng.around(0, radius * 0.25), y, rng.around(0, radius * 0.25));
      y += radius * rng.range(0.9, 1.2);
      lumps.push(lump);
    }
    const canopy = mergeGeometries(lumps, false);
    for (const lump of lumps) lump.dispose();
    if (!canopy) throw new Error('vista-tree: masses did not share an attribute set');
    parts.push({
      geometry: canopy,
      color: landWash(seed ^ 0x7e33, CANOPY, { scale: rng.range(8, 14), crown: height }),
      sway: 0,
    });

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-tree', 0));
  },
};
