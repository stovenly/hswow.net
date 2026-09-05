import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';

// An orchard: a grid of small round crowns, low and pale green, rows along +X.

const CROWN = [shade(PALETTE.LEAF, 1.05), shade(PALETTE.GRASS, 1.08), shade(PALETTE.GRASS, 1.18)] as const;

export const vistaOrchard: MeshBuilder = {
  name: 'vista-orchard',
  category: 'vista',
  radius: 18,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const rows = rng.int(3, 4);
    const cols = rng.int(4, 5);
    const pitch = rng.range(6, 7.5);
    const parts: Part[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - (cols - 1) / 2) * pitch;
        const z = (r - (rows - 1) / 2) * pitch;
        const radius = rng.range(2.2, 3);
        const crown = new THREE.IcosahedronGeometry(radius, 0);
        crown.deleteAttribute('uv');
        crown.deleteAttribute('normal');
        crown.scale(1, 0.8, 1);
        crown.rotateY(rng.range(0, Math.PI * 2));
        crown.translate(x, radius * 0.9, z);
        parts.push({ geometry: crown, color: shade(rng.pick(CROWN), rng.range(0.95, 1.05)), sway: 0 });
      }
    }
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-orchard', 0));
  },
};
