import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista, vistaBank, vistaRidge } from '../vista';
import { block, crestAlong, pickVariant, variantField } from '../vista-kit';

// A granite top: a rounded whaleback with a stack of blocks on the crest, or
// two, and clitter lying on the slope below them.

const VARIANTS = ['one', 'two'] as const;

export interface VistaTorOptions extends BuildOptions {
  variant?: (typeof VARIANTS)[number];
}

export const vistaTor: BuilderWith<VistaTorOptions> = {
  name: 'vista-tor',
  category: 'vista',
  radius: 30,
  solid: false,
  options: variantField(VARIANTS),

  build({ seed = 1, scale = 1, variant }: VistaTorOptions = {}) {
    const rng = createRng(seed);
    const kind = pickVariant(rng, VARIANTS, variant);

    const length = rng.range(50, 70);
    const height = rng.range(10, 14);
    const crest = crestAlong(rng, length, height, 4, 0.5);
    const geometry = vistaRidge(rng, {
      crest,
      face: rng.range(2.0, 2.6),
      back: rng.range(2.4, 3.0),
      facets: 2,
      foot: 5,
      rough: 0.05,
    });

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0x7a0b, {
          ground: 'heath',
          bands: [{ material: 'pasture', below: height * 0.4 }],
          wobble: 2,
          crown: height * 0.6,
          scale: rng.range(30, 50),
        }),
        sway: 0,
      },
    ];

    const stone = () => shade(rng.pick([PALETTE.STONE_DARK, PALETTE.STONE]), rng.range(0.9, 1.05));
    const stacks = kind === 'one' ? [crest[1]] : [crest[1], crest[2]];
    for (const [x, z, h] of stacks) {
      let y = h - 1.2;
      const count = rng.int(2, 3);
      for (let i = 0; i < count; i++) {
        const w = rng.range(4.5, 7) * (1 - i * 0.12);
        const tall = rng.range(1.8, 2.8);
        const slab = block(w, tall, w * rng.range(0.6, 0.9), x + rng.range(-1, 1), y, z + rng.range(-1, 1));
        slab.rotateY(rng.range(-0.35, 0.35));
        parts.push({ geometry: slab, color: stone(), sway: 0 });
        y += tall * 0.9;
      }
    }

    // Clitter: blocks fallen down the face.
    const fallen = rng.int(3, 4);
    for (let i = 0; i < fallen; i++) {
      const [x, z, h] = rng.pick(crest);
      const down = rng.range(0.3, 0.8);
      const w = rng.range(1.6, 2.8);
      // The face profile is the ridge's own: convex at the shoulder, concave at the foot.
      const y = h * (0.5 + 0.5 * Math.cos(Math.PI * down)) - 0.6;
      const slab = block(w, w * 0.6, w * 0.8, x + rng.range(-6, 6), y, z + h * 2.3 * down);
      slab.rotateY(rng.range(0, Math.PI));
      parts.push({ geometry: slab, color: stone(), sway: 0 });
    }

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-tor', 0));
  },
};
