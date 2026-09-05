import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaWoodEdge } from '../vista';
import { pickVariant, variantField } from '../vista-kit';

// The wall of a wood along +X, facing +Z: a ragged top, a dark foot and
// standards in front. Straight, bowed toward the viewer, or with a ride cut in.

const VARIANTS = ['straight', 'bowed', 'ride'] as const;

export interface VistaWoodEdgeOptions extends BuildOptions {
  variant?: (typeof VARIANTS)[number];
}

export const vistaWoodEdgeBuilder: BuilderWith<VistaWoodEdgeOptions> = {
  name: 'vista-wood-edge',
  category: 'vista',
  radius: 36,
  solid: false,
  options: variantField(VARIANTS),

  build({ seed = 1, scale = 1, variant }: VistaWoodEdgeOptions = {}) {
    const rng = createRng(seed);
    const kind = pickVariant(rng, VARIANTS, variant);

    const length = rng.range(50, 70);
    const bow = kind === 'bowed' ? rng.range(6, 10) : 0;
    const edge: [number, number][] = [
      [-length / 2, -bow * 0.2],
      [-length / 4, bow * 0.6],
      [0, bow],
      [length / 4, bow * 0.6],
      [length / 2, -bow * 0.2],
    ];
    const parts: Part[] = [
      vistaWoodEdge(rng, {
        edge,
        depth: rng.range(14, 20),
        low: rng.range(9, 12),
        high: rng.range(13, 17),
        spacing: 5,
        standards: rng.int(2, 3),
        gap: kind === 'ride',
      }),
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-wood-edge', 0));
  },
};
