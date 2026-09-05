import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { landWash, markVista, VISTA_MATERIALS } from '../vista';
import { GLINT } from '../vista-kit';

// A river reach: a bend of pale water between two darker banks, running away
// from the viewer along −Z so it is seen along its length.

/** A ribbon along a bent line: `width` metres wide at `y`, one quad per step. */
function ribbon(centre: (t: number) => [number, number], width: number, y: number, steps: number): THREE.BufferGeometry {
  const position: number[] = [];
  const edge = (t: number, side: number): [number, number] => {
    const [x, z] = centre(t);
    const [x1, z1] = centre(Math.min(1, t + 0.01));
    const dx = x1 - x;
    const dz = z1 - z;
    const l = Math.hypot(dx, dz) || 1;
    return [x + (-dz / l) * side * width * 0.5, z + (dx / l) * side * width * 0.5];
  };
  for (let i = 0; i < steps; i++) {
    const t0 = i / steps;
    const t1 = (i + 1) / steps;
    const a = edge(t0, -1);
    const b = edge(t0, 1);
    const c = edge(t1, 1);
    const d = edge(t1, -1);
    // Wound so the normal is up: the ribbon runs toward −Z and its right-hand edge is +X.
    position.push(a[0], y, a[1], b[0], y, b[1], c[0], y, c[1], a[0], y, a[1], c[0], y, c[1], d[0], y, d[1]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export const vistaRiverReach: MeshBuilder = {
  name: 'vista-river-reach',
  category: 'vista',
  radius: 30,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const length = rng.range(50, 64);
    const swing = rng.range(10, 16) * rng.pick([-1, 1]);
    const width = rng.range(6, 9);
    const centre = (t: number): [number, number] => [Math.sin(t * Math.PI) * swing, length / 2 - t * length];
    const bank = landWash(seed ^ 0x51e4, VISTA_MATERIALS.pasture, { scale: 30 });
    const parts: Part[] = [
      { geometry: ribbon(centre, width * 3.2, 0.1, 8), color: bank, sway: 0 },
      { geometry: ribbon(centre, width, 0.3, 8), color: GLINT, sway: 0 },
    ];
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-river-reach', 0));
  },
};
