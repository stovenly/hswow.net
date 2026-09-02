import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { landWash, markVista, vistaMass } from '../vista';

// A headland: a range that steps down into the sea. Four or five stone masses
// on a line, tallest at the landward end and each lower than the last, the
// final one barely clearing the water. Built along +X with the land at -X; the
// water is whatever plane it is placed beside, and everything under y = 0 is
// the sea's to hide.

const STONE = [shade(PALETTE.STONE_DARK, 0.8), PALETTE.STONE_DARK, PALETTE.STONE] as const;

export const vistaHeadland: MeshBuilder = {
  name: 'vista-headland',
  category: 'vista',
  radius: 50,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const count = rng.int(4, 5);
    const step = rng.range(16, 20);
    const span = step * (count - 1);
    const bend = rng.range(-0.1, 0.1);

    const lumps: THREE.BufferGeometry[] = [];
    let tallest = 0;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      // Highest on the land, and each mass steps down toward the last.
      const swell = 1 - t * 0.68;
      const radius = rng.range(16, 22) * swell;
      const squash = rng.range(0.55, 0.8);
      const lump = vistaMass(rng, {
        radius,
        detail: 0,
        rough: rng.range(0.24, 0.36),
        squash,
        stretch: rng.range(0.7, 1.2),
        bury: 0.45 + t * 0.2,
      });
      lump.rotateY(rng.range(0, Math.PI * 2));
      const x = -span / 2 + i * step;
      lump.translate(x, 0, x * x * bend * 0.01 + rng.range(-2, 2));
      tallest = Math.max(tallest, radius * squash);
      lumps.push(lump);
    }
    const ridge = mergeGeometries(lumps, false);
    for (const lump of lumps) lump.dispose();
    if (!ridge) throw new Error('vista-headland: masses did not share an attribute set');

    const parts: Part[] = [
      {
        geometry: ridge,
        color: landWash(seed ^ 0x4c1d, STONE, { scale: rng.range(40, 70), crown: tallest * 0.6 }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-headland', 0));
  },
};
