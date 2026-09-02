import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';

// A boat out on the water: a hull, a mast, and one sail, pale against the sea.
// The sail is drawn both ways so it reads from either shore. Twenty triangles,
// and the only thing in the band that says someone else is out there.

const SAIL = [shade(PALETTE.CLOTH, 1.25), PALETTE.STONE_PALE, shade(PALETTE.TIMBER_PALE, 1.15)] as const;

/** A triangle, both windings. */
function bothWays(a: number[], b: number[], c: number[]): number[] {
  return [...a, ...b, ...c, ...a, ...c, ...b];
}

export const vistaSail: MeshBuilder = {
  name: 'vista-sail',
  category: 'vista',
  radius: 4,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const length = rng.range(5, 7);
    const beam = length * 0.32;
    const mast = length * rng.range(1.1, 1.35);
    const parts: Part[] = [];

    // The hull: a box narrowed at the bow, a little of it under the water.
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

    // One sail, sheeted out to leeward.
    const foot = 0.9 + mast * 0.12;
    const head = 0.9 + mast * 0.95;
    const x = -length * 0.1;
    const lean = rng.pick([-1, 1]) * beam * 0.6;
    const sail = new THREE.BufferGeometry();
    sail.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        bothWays([x, foot, 0], [x, head, 0], [x + length * 0.55, foot + mast * 0.08, lean]),
        3,
      ),
    );
    parts.push({ geometry: sail, color: rng.pick(SAIL), sway: 0 });

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-sail', 0));
  },
};
