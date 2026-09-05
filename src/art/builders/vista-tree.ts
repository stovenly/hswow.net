import * as THREE from 'three';
import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';
import { pickVariant, pineParts, treeParts, variantField } from '../vista-kit';

// One big tree for the middle distance, twelve to eighteen metres tall: an oak
// of stacked crowns, a pine of stacked cones, or a dead one that is trunk and
// limbs only.

const VARIANTS = ['oak', 'pine', 'dead'] as const;

export interface VistaTreeOptions extends BuildOptions {
  variant?: (typeof VARIANTS)[number];
}

export const vistaTree: BuilderWith<VistaTreeOptions> = {
  name: 'vista-tree',
  category: 'vista',
  radius: 6,
  solid: false,
  options: variantField(VARIANTS),

  build({ seed = 1, scale = 1, variant }: VistaTreeOptions = {}) {
    const rng = createRng(seed);
    const kind = pickVariant(rng, VARIANTS, variant);
    const height = rng.range(12, 18);
    let parts: Part[];

    if (kind === 'oak') {
      parts = treeParts(rng, height, 0, 0);
    } else if (kind === 'pine') {
      parts = pineParts(rng, height, 0, 0);
    } else {
      const bark = shade(PALETTE.BARK, 0.8);
      const trunk = new THREE.CylinderGeometry(0.25, 0.6, height * 0.7, 4, 1, true);
      trunk.deleteAttribute('uv');
      trunk.translate(0, height * 0.35, 0);
      parts = [{ geometry: trunk, color: bark, sway: 0 }];
      const limbs = rng.int(2, 3);
      for (let i = 0; i < limbs; i++) {
        const length = height * rng.range(0.25, 0.4);
        const limb = new THREE.CylinderGeometry(0.1, 0.22, length, 3, 1, true);
        limb.deleteAttribute('uv');
        limb.translate(0, length / 2, 0);
        // Tipped out from the trunk and turned to its own bearing.
        limb.rotateZ(rng.range(0.5, 1.1));
        limb.rotateY(rng.range(0, Math.PI * 2));
        limb.translate(0, height * rng.range(0.4, 0.62), 0);
        parts.push({ geometry: limb, color: bark, sway: 0 });
      }
    }

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-tree', 0));
  },
};
