import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { landWash, markVista, vistaMass } from '../vista';

// A dune: a hill's mass, flatter and longer than any hill, in sand, with the
// grass of its crest as a darker band along the top. The one pale thing in a
// band of green and grey, which is what makes a coast read from the trees.

const SAND = [shade(0xc4ad84, 0.86), 0xc4ad84, shade(0xc4ad84, 1.1)] as const;
const CREST = shade(PALETTE.GRASS_DRY, 0.9);

export const vistaDune: MeshBuilder = {
  name: 'vista-dune',
  category: 'vista',
  radius: 24,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const radius = rng.range(20, 30);
    const squash = rng.range(0.16, 0.26);
    const geometry = vistaMass(rng, {
      radius,
      detail: 1,
      rough: rng.range(0.1, 0.2),
      squash,
      stretch: rng.range(1.6, 2.4),
      bury: rng.range(0.4, 0.5),
    });
    geometry.rotateY(rng.range(0, Math.PI * 2));

    const crest = radius * squash * rng.range(0.45, 0.6);
    const wash = landWash(seed ^ 0x3d0e, SAND, { scale: rng.range(24, 40), crown: crest });
    const parts: Part[] = [
      {
        geometry,
        // The marram takes the crest; everything below it is bare sand.
        color: (x, y, z) => (y > crest ? CREST : wash(x, y, z)),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-dune', 0));
  },
};
