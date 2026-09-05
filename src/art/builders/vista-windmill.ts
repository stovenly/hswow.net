import * as THREE from 'three';
import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';
import { block, cap, pickVariant, variantField, WALLS } from '../vista-kit';

// A windmill facing +Z: a battered tower with a cap and four sails, or a post
// mill, a box body on a short post. The sails are a cross of two thin slabs
// standing proud of the face.

const VARIANTS = ['tower', 'post'] as const;

export interface VistaWindmillOptions extends BuildOptions {
  variant?: (typeof VARIANTS)[number];
}

/** The mill's parts about the origin, sails toward +Z. */
export function windmillParts(rng: Rng, kind: (typeof VARIANTS)[number]): Part[] {
  const parts: Part[] = [];
  let hub: number;
  let front: number;
  if (kind === 'tower') {
    const height = rng.range(12, 16);
    const foot = rng.range(3.2, 4);
    const shaft = new THREE.CylinderGeometry(foot * 0.7, foot, height, 6, 1);
    shaft.deleteAttribute('uv');
    shaft.translate(0, height / 2, 0);
    parts.push({ geometry: shaft, color: rng.pick(WALLS), sway: 0 });
    parts.push({ geometry: cap(foot * 0.85, 3, 6, 0, height, 0), color: shade(PALETTE.STONE_DARK, 0.7), sway: 0 });
    hub = height * 0.8;
    front = foot * 0.75;
  } else {
    const post = rng.range(3, 4);
    const body = rng.range(4, 5);
    const stem = new THREE.CylinderGeometry(0.5, 0.9, post, 4, 1);
    stem.deleteAttribute('uv');
    stem.translate(0, post / 2, 0);
    parts.push({ geometry: stem, color: PALETTE.TIMBER_DARK, sway: 0 });
    parts.push({ geometry: block(body, body * 1.4, body * 0.8, 0, post, 0), color: rng.pick(WALLS), sway: 0 });
    parts.push({ geometry: cap(body * 0.75, 1.8, 4, 0, post + body * 1.4, 0), color: shade(PALETTE.STONE_DARK, 0.7), sway: 0 });
    hub = post + body * 1.1;
    front = body * 0.4;
  }
  const span = rng.range(14, 18);
  const tilt = rng.range(0, Math.PI / 2);
  for (const turn of [tilt, tilt + Math.PI / 2]) {
    const sail = new THREE.BoxGeometry(span, 1.6, 0.25);
    sail.rotateZ(turn);
    sail.translate(0, hub, front + 0.4);
    parts.push({ geometry: sail, color: shade(PALETTE.TIMBER_PALE, 1.1), sway: 0 });
  }
  return parts;
}

export const vistaWindmill: BuilderWith<VistaWindmillOptions> = {
  name: 'vista-windmill',
  category: 'vista',
  radius: 9,
  solid: false,
  options: variantField(VARIANTS),

  build({ seed = 1, scale = 1, variant }: VistaWindmillOptions = {}) {
    const rng = createRng(seed);
    const merged = assemble(windmillParts(rng, pickVariant(rng, VARIANTS, variant)));
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-windmill', 0));
  },
};
