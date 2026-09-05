import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { PALETTE, blend, shade } from '../palette';
import { markVista } from '../vista';

// Smoke over a chimney: a vertical ribbon of three quads leaning downwind,
// paler as it rises, drawn both ways. Opaque geometry that does not move.

/** The ribbon's parts, rising from the origin. */
export function smokeParts(rng: Rng): Part[] {
  const height = rng.range(9, 13);
  const lean = rng.range(2, 4);
  const width = rng.range(1.2, 1.8);
  const grey = shade(PALETTE.STONE_PALE, 0.95);
  const parts: Part[] = [];
  for (let i = 0; i < 3; i++) {
    const y0 = (height / 3) * i;
    const y1 = (height / 3) * (i + 1);
    const x0 = lean * (i / 3) ** 1.5;
    const x1 = lean * ((i + 1) / 3) ** 1.5;
    const w0 = width * (0.5 + i * 0.35);
    const w1 = width * (0.5 + (i + 1) * 0.35);
    const quad = new THREE.BufferGeometry();
    const a = [x0 - w0 / 2, y0, 0];
    const b = [x0 + w0 / 2, y0, 0];
    const c = [x1 + w1 / 2, y1, 0];
    const d = [x1 - w1 / 2, y1, 0];
    quad.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([...a, ...b, ...c, ...a, ...c, ...d, ...a, ...c, ...b, ...a, ...d, ...c], 3),
    );
    parts.push({ geometry: quad, color: blend(grey, 0xb8bcc2, i / 2.5), sway: 0 });
  }
  return parts;
}

export const vistaSmoke: MeshBuilder = {
  name: 'vista-smoke',
  category: 'vista',
  radius: 2,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const merged = assemble(smokeParts(rng));
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-smoke', 0));
  },
};
