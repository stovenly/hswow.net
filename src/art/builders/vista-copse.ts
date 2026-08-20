import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { landWash, markVista, vistaMass } from '../vista';

// Three or four separate tree lumps — the step between a tree and a wood.
// `vista-forest` is a continuous mass whose blobs overlap into one silhouette;
// this is the same grammar with the blobs pulled apart, and the gaps are the read:
// a wood is an edge, a copse is a countable number of things.

/** Canopy in shade, close together so the clumps read as one species. */
const CANOPY = [
  shade(PALETTE.LEAF_DARK, 0.74),
  PALETTE.LEAF_DARK,
  shade(PALETTE.LEAF, 0.92),
] as const;

export const vistaCopse: MeshBuilder = {
  name: 'vista-copse',
  category: 'vista',
  radius: 15,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);

    const clumps = rng.int(3, 4);
    const spread = rng.range(16, 26);
    const turn = rng.range(0, Math.PI * 2);
    const along = { x: Math.cos(turn), z: Math.sin(turn) };
    const color = landWash(seed ^ 0x0c05, CANOPY, { scale: rng.range(20, 34), crown: 9 });

    const parts: Part[] = [];
    for (let i = 0; i < clumps; i++) {
      const t = (i + 0.5) / clumps - 0.5;
      // Pulled well apart, and off the line as well as along it — three lumps
      // in a straight row is a hedge that has been let go, not a copse.
      const offset = t * spread + rng.range(-2, 2);
      const aside = rng.range(-7, 7);
      const radius = rng.range(6, 9.5);
      const squash = rng.range(0.7, 1.05);

      const geometry = vistaMass(rng, {
        radius,
        detail: 0,
        rough: rng.range(0.22, 0.38),
        squash,
        stretch: rng.range(0.8, 1.25),
        bury: rng.range(0.46, 0.58),
      });
      geometry.translate(
        along.x * offset - along.z * aside,
        rng.range(-0.8, 2.4),
        along.z * offset + along.x * aside,
      );
      parts.push({ geometry, color, sway: 0 });
    }

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-copse', 0));
  },
};
