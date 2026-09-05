import * as THREE from 'three';
import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';
import { pickVariant, variantField } from '../vista-kit';

// A boat out on the water: a hull, a mast, and one sail, pale against the sea.
// The sail is drawn both ways so it reads from either shore. One boat, or two
// a little apart.

const VARIANTS = ['one', 'two'] as const;

export interface VistaSailOptions extends BuildOptions {
  variant?: (typeof VARIANTS)[number];
}

const SAIL = [shade(PALETTE.CLOTH, 1.25), PALETTE.STONE_PALE, shade(PALETTE.TIMBER_PALE, 1.15)] as const;

/** A triangle, both windings. */
function bothWays(a: number[], b: number[], c: number[]): number[] {
  return [...a, ...b, ...c, ...a, ...c, ...b];
}

function boat(rng: Rng, x: number, z: number, yaw: number): Part[] {
  const length = rng.range(5, 7);
  const beam = length * 0.32;
  const mast = length * rng.range(1.1, 1.35);
  const parts: Part[] = [];

  const hull = new THREE.BoxGeometry(length, 1.3, beam);
  const position = hull.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    if (position.getX(i) > 0) position.setZ(i, position.getZ(i) * 0.35);
  }
  hull.translate(0, 0.25, 0);
  parts.push({ geometry: hull, color: shade(PALETTE.TIMBER_DARK, 0.85), sway: 0 });

  const pole = new THREE.CylinderGeometry(0.08, 0.12, mast, 4, 1, true);
  pole.translate(-length * 0.1, 0.9 + mast / 2, 0);
  parts.push({ geometry: pole, color: PALETTE.TIMBER_DARK, sway: 0 });

  const foot = 0.9 + mast * 0.12;
  const head = 0.9 + mast * 0.95;
  const sx = -length * 0.1;
  const lean = rng.pick([-1, 1]) * beam * 0.6;
  const sail = new THREE.BufferGeometry();
  sail.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      bothWays([sx, foot, 0], [sx, head, 0], [sx + length * 0.55, foot + mast * 0.08, lean]),
      3,
    ),
  );
  parts.push({ geometry: sail, color: rng.pick(SAIL), sway: 0 });

  for (const part of parts) {
    part.geometry.rotateY(yaw);
    part.geometry.translate(x, 0, z);
  }
  return parts;
}

export const vistaSail: BuilderWith<VistaSailOptions> = {
  name: 'vista-sail',
  category: 'vista',
  radius: 4,
  solid: false,
  options: variantField(VARIANTS),

  build({ seed = 1, scale = 1, variant }: VistaSailOptions = {}) {
    const rng = createRng(seed);
    const kind = pickVariant(rng, VARIANTS, variant);
    const parts = boat(rng, 0, 0, 0);
    if (kind === 'two') parts.push(...boat(rng, rng.range(8, 12), rng.range(-6, 6), rng.range(-0.5, 0.5)));
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-sail', 0));
  },
};
