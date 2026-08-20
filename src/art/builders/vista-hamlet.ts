import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';

// A cluster of far roofs, a chimney, and one lit window. Five or six boxes with
// pyramid caps and no other openings: at this range a village is a scatter of pale
// walls under dark roofs. The lit window is the whole prop — one warm face is the
// only thing in the band that implies a person — and it is two triangles painted
// with the lamp colour, which on a lit material comes out as pale cream.

/** Rendered walls, limewashed. Pale, so the roofs read as dark against them. */
const WALLS = [PALETTE.STONE_PALE, PALETTE.STONE, PALETTE.TIMBER_PALE] as const;

export const vistaHamlet: MeshBuilder = {
  name: 'vista-hamlet',
  category: 'vista',
  radius: 16,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);

    const houses = rng.int(4, 6);
    const spread = rng.range(16, 26);
    const parts: Part[] = [];

    // Where the lit window goes, and which house carries it. One per hamlet —
    // two reads as a street of them and the point is that it is singular.
    const litHouse = rng.int(0, houses - 1);
    let lit: { x: number; y: number; z: number; yaw: number; face: number } | null = null;

    for (let i = 0; i < houses; i++) {
      // Loosely gathered rather than in a row: a hamlet is a knot of buildings
      // that grew, and a row reads as a terrace or a fence.
      const angle = rng.range(0, Math.PI * 2);
      const away = Math.sqrt(rng()) * spread * 0.5;
      const x = Math.cos(angle) * away;
      const z = Math.sin(angle) * away;
      const yaw = rng.range(0, Math.PI * 2);

      const width = rng.range(5, 8.5);
      const depth = rng.range(4.5, 7);
      const wallHeight = rng.range(3.2, 5);

      const body = new THREE.BoxGeometry(width, wallHeight, depth);
      body.translate(0, wallHeight / 2, 0);
      body.rotateY(yaw);
      body.translate(x, 0, z);
      parts.push({ geometry: body, color: rng.pick(WALLS), sway: 0 });

      const roofHeight = rng.range(2.2, 3.8);
      // Radius rather than half-width, so the eaves overhang a little — the
      // shadow line under an eave is most of what says "roof" at any range.
      const roof = new THREE.ConeGeometry(Math.max(width, depth) * 0.62, roofHeight, 4);
      roof.translate(0, wallHeight + roofHeight / 2, 0);
      roof.rotateY(yaw + Math.PI / 4);
      roof.translate(x, 0, z);
      parts.push({
        geometry: roof,
        color: shade(PALETTE.STONE_DARK, rng.range(0.55, 0.72)),
        sway: 0,
      });

      if (i === litHouse) {
        lit = { x, y: wallHeight * rng.range(0.4, 0.58), z, yaw, face: depth / 2 };
        // The chimney goes on the same house, so the one building the eye picks
        // out is the one with the most to say.
        const stack = rng.range(1.6, 2.8);
        const chimney = new THREE.BoxGeometry(0.9, stack, 0.9);
        chimney.translate(width * 0.28, wallHeight + roofHeight * 0.5 + stack / 2, 0);
        chimney.rotateY(yaw);
        chimney.translate(x, 0, z);
        parts.push({ geometry: chimney, color: PALETTE.STONE_DARK, sway: 0 });
      }
    }

    if (lit) {
      const window = new THREE.PlaneGeometry(rng.range(1.1, 1.7), rng.range(1.1, 1.6));
      // Stood proud of the wall it belongs to, or the two z-fight at every
      // distance — the same reason a portal door stands out of its doorway.
      window.translate(0, lit.y, lit.face + 0.06);
      window.rotateY(lit.yaw);
      window.translate(lit.x, 0, lit.z);
      parts.push({
        geometry: window,
        // `LAMPLIGHT` on an ordinary lit material, deliberately. The palette
        // warns it comes out as cream-coloured paint, which is precisely the
        // note wanted here — this is a window seen from outside, not a lamp.
        color: PALETTE.LAMPLIGHT,
        sway: 0,
      });
    }

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-hamlet', 0));
  },
};
