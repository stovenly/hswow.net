import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';

// A barn seen far off: one long low roof over pale walls, and a stack at one end.
// Its length is the whole read — a hamlet is a knot of short roofs, a farm is one
// roof longer than any house. Around forty triangles.

const WALLS = [PALETTE.STONE_PALE, PALETTE.TIMBER_PALE, PALETTE.STONE] as const;
const ROOFS = [shade(PALETTE.BARK, 0.9), PALETTE.TIMBER_DARK, shade(PALETTE.STONE_DARK, 0.8)] as const;

/** A gable roof along X: two slopes and two gables, open underneath. */
function gable(length: number, width: number, eave: number, rise: number): THREE.BufferGeometry {
  const l = length / 2;
  const w = width / 2;
  const position: number[] = [];
  const tri = (...v: number[][]): void => {
    for (const p of v) position.push(p[0], p[1], p[2]);
  };
  const ridgeA = [-l, eave + rise, 0];
  const ridgeB = [l, eave + rise, 0];
  // Slopes, wound so each normal faces out and up.
  tri([-l, eave, w], [l, eave, w], ridgeB);
  tri([-l, eave, w], ridgeB, ridgeA);
  tri([l, eave, -w], [-l, eave, -w], ridgeA);
  tri([l, eave, -w], ridgeA, ridgeB);
  // Gables.
  tri([-l, eave, -w], [-l, eave, w], ridgeA);
  tri([l, eave, w], [l, eave, -w], ridgeB);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  return geometry;
}

export const vistaFarmstead: MeshBuilder = {
  name: 'vista-farmstead',
  category: 'vista',
  radius: 14,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const length = rng.range(18, 26);
    const width = rng.range(8, 10.5);
    const eave = rng.range(3.4, 4.6);
    const rise = width * rng.range(0.42, 0.55);
    const parts: Part[] = [];

    const body = new THREE.BoxGeometry(length, eave, width);
    body.translate(0, eave / 2, 0);
    parts.push({ geometry: body, color: rng.pick(WALLS), sway: 0 });

    parts.push({ geometry: gable(length + 0.8, width + 1.2, eave, rise), color: rng.pick(ROOFS), sway: 0 });

    // The stack, at whichever end, clear of the ridge.
    const end = rng.pick([-1, 1]);
    const stack = new THREE.BoxGeometry(1.2, rise + 1.6, 1.2);
    stack.translate(end * (length / 2 - 2.2), eave + (rise + 1.6) / 2, 0);
    parts.push({ geometry: stack, color: shade(PALETTE.STONE_DARK, 0.9), sway: 0 });

    const merged = assemble(parts);
    merged.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-farmstead', 0));
  },
};
