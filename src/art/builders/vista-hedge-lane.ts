import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista, VISTA_MATERIALS } from '../vista';

// A hedge lane: a pale line between two dark ones, running along +Z so a placer
// can lay it up a slope. Three ribbons, each bent a little at two joints.

export const vistaHedgeLane: MeshBuilder = {
  name: 'vista-hedge-lane',
  category: 'vista',
  radius: 28,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const runs = 3;
    const length = rng.range(14, 20);
    const gap = rng.range(3.5, 4.5);
    const parts: Part[] = [];
    const hedge = shade(VISTA_MATERIALS.hedge[1], 1);
    const lane = shade(PALETTE.TIMBER_PALE, 1.05);

    let x = 0;
    let z = -((runs * length) / 2);
    let heading = 0;
    for (let i = 0; i < runs; i++) {
      heading += i === 0 ? 0 : rng.range(-0.25, 0.25);
      const place = (geometry: THREE.BufferGeometry, side: number, colour: number) => {
        geometry.translate(side, 0, length / 2);
        geometry.rotateY(-heading);
        geometry.translate(x, 0, z);
        parts.push({ geometry, color: colour, sway: 0 });
      };
      const floor = new THREE.BoxGeometry(gap, 0.5, length + 0.6);
      floor.translate(0, 0.1, 0);
      place(floor, 0, lane);
      for (const side of [-1, 1]) {
        const height = rng.range(1.8, 2.6);
        const bank = new THREE.BoxGeometry(1.6, height, length + 0.6);
        bank.translate(0, height * 0.35, 0);
        place(bank, side * (gap / 2 + 0.8), hedge);
      }
      // rotateY(−heading) takes +Z to (−sin heading, 0, cos heading).
      x -= Math.sin(heading) * length;
      z += Math.cos(heading) * length;
    }

    const merged = assemble(parts);
    merged.computeBoundingBox();
    const box = merged.boundingBox;
    if (box) merged.translate(-(box.min.x + box.max.x) / 2, 0, -(box.min.z + box.max.z) / 2);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-hedge-lane', 0));
  },
};
