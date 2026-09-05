import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';
import { block, gable, GLINT, glint, roofShade, WALLS } from '../vista-kit';

// A watermill: a house with a wheel hung on its +X end over a glint of water
// that runs past it along +X.

export const vistaWatermill: MeshBuilder = {
  name: 'vista-watermill',
  category: 'vista',
  radius: 16,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const length = rng.range(10, 13);
    const width = rng.range(7, 8.5);
    const eave = rng.range(4.5, 6);
    const parts: Part[] = [
      { geometry: block(length, eave, width, 0, 0, 0), color: rng.pick(WALLS), sway: 0 },
      { geometry: gable(length + 0.8, width + 1.2, eave, width * 0.5), color: roofShade(rng), sway: 0 },
    ];

    const radius = rng.range(3, 4);
    const wheel = new THREE.CylinderGeometry(radius, radius, 1.2, 8, 1);
    wheel.deleteAttribute('uv');
    wheel.rotateZ(Math.PI / 2);
    wheel.translate(length / 2 + 0.8, radius * 0.8, 0);
    parts.push({ geometry: wheel, color: shade(PALETTE.TIMBER_DARK, 0.8), sway: 0 });

    parts.push({ geometry: glint(length * 2.4, width * 1.4, length * 0.3, 0.12, 0), color: GLINT, sway: 0 });

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-watermill', 0));
  },
};
