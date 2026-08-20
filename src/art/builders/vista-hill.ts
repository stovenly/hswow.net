import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import { landWash, markVista, vistaMass } from '../vista';

// A rounded hill, a hundred metres away and mostly fog: a displaced icosahedron
// at subdivision 1, squashed into a dome, sunk so it grows out of the skirt rather
// than resting on it, and washed with a drift of close greens. Wide and low, about
// five to one — the eye is 1.35 m up, so anything past a few metres tall already
// breaks the horizon and height buys nothing after that.

/** Pasture, and the same pasture drying off. Three close colours each, ordered by value — the wash blends between neighbours, so a palette that jumps in brightness puts a hard step in a hillside. */
const GREEN = [PALETTE.LEAF_DARK, PALETTE.LEAF, PALETTE.GRASS] as const;
/** The same hill in late summer, or on thinner soil. */
const DRY = [PALETTE.LEAF, PALETTE.GRASS, PALETTE.GRASS_DRY] as const;

export const vistaHill: MeshBuilder = {
  name: 'vista-hill',
  category: 'vista',
  radius: 20,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);

    const radius = rng.range(18, 26);
    const squash = rng.range(0.3, 0.46);
    const geometry = vistaMass(rng, {
      radius,
      detail: 1,
      rough: rng.range(0.14, 0.26),
      squash,
      // Longer one way than the other, so a row of them does not read as a row
      // of the same hill.
      stretch: rng.range(0.7, 1.45),
      // Half in. A hill grows out of the ground rather than resting on it, and
      // burying the equator is what stops the base reading as a hard rim.
      bury: rng.range(0.46, 0.56),
    });
    // Turned before the colour function runs, so the patchwork bands are laid
    // across whichever way this one happens to lie.
    geometry.rotateY(rng.range(0, Math.PI * 2));

    const parts: Part[] = [
      {
        geometry,
        color: landWash(seed ^ 0x5e1a, rng.chance(0.35) ? DRY : GREEN, {
          // Comparable to the hill's own width, so the colour drifts once
          // across it rather than banding it.
          scale: rng.range(30, 55),
          crown: radius * squash,
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-hill', 0));
  },
};
