import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { landWash, markVista, vistaMass } from '../vista';

// A plantation: a dark rectangular block of conifers with straight edges, the
// one wood that is a box. The top is jittered a little so it is not a lid.

const CONIFER = [shade(PALETTE.LEAF_DARK, 0.55), shade(PALETTE.LEAF_DARK, 0.66), shade(PALETTE.LEAF_DARK, 0.78)] as const;

export const vistaPlantation: MeshBuilder = {
  name: 'vista-plantation',
  category: 'vista',
  radius: 30,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const width = rng.range(40, 60);
    const depth = rng.range(24, 36);
    const height = rng.range(12, 16);
    const sink = 2;
    const box = new THREE.BoxGeometry(width, height + sink, depth, 4, 1, 3);
    box.deleteAttribute('uv');
    box.translate(0, (height - sink) / 2, 0);
    const position = box.getAttribute('position');
    for (let i = 0; i < position.count; i++) {
      if (position.getY(i) > height - 0.5) position.setY(i, height + rng.range(-1.2, 1.2));
    }
    position.needsUpdate = true;
    box.computeVertexNormals();

    const wash = landWash(seed ^ 0x91a4, CONIFER, { scale: rng.range(20, 40), crown: height, foot: height * 0.2 });
    const parts: Part[] = [
      {
        geometry: box,
        color: (x, y, z, facet) => (facet.slope < 0.5 ? shade(wash(x, y, z), 1.08) : wash(x, y, z)),
        sway: 0,
      },
    ];
    // A few standing proud of the block, so the top edge is trees and not a lid.
    for (let n = rng.int(3, 5); n > 0; n--) {
      const radius = rng.range(2.5, 4);
      const crown = vistaMass(rng, { radius, detail: 0, rough: rng.range(0.24, 0.4), squash: rng.range(1.1, 1.5), stretch: rng.range(0.85, 1.15), bury: 0.35 });
      crown.rotateY(rng.range(0, Math.PI * 2));
      crown.translate(rng.range(-width / 2 + 3, width / 2 - 3), height + rng.range(1, 2.4), rng.range(-depth / 2 + 3, depth / 2 - 3));
      parts.push({ geometry: crown, color: wash, sway: 0 });
    }

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-plantation', 0));
  },
};
