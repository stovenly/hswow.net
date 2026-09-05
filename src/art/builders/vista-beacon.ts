import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { PALETTE } from '../palette';
import { markVista } from '../vista';
import { cairn } from '../vista-kit';

// A beacon: a cairn with a pole beside it, for a summit.

/** The beacon's parts about the origin. */
export function beaconParts(rng: Rng): Part[] {
  const pole = rng.range(5, 7);
  const post = new THREE.CylinderGeometry(0.12, 0.2, pole, 4, 1, true);
  post.deleteAttribute('uv');
  post.translate(1.6, pole / 2, 0);
  return [cairn(rng, rng.range(2.4, 3.2)), { geometry: post, color: PALETTE.TIMBER_DARK, sway: 0 }];
}

export const vistaBeacon: MeshBuilder = {
  name: 'vista-beacon',
  category: 'vista',
  radius: 3,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const merged = assemble(beaconParts(rng));
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-beacon', 0));
  },
};
