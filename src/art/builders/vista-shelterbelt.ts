import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista } from '../vista';
import { pickVariant, treeParts, variantField } from '../vista-kit';

// A shelterbelt: a straight planted line of tall trees along +X, spaced evenly
// on purpose.

const VARIANTS = ['five', 'nine'] as const;

export interface VistaShelterbeltOptions extends BuildOptions {
  variant?: (typeof VARIANTS)[number];
}

export const vistaShelterbelt: BuilderWith<VistaShelterbeltOptions> = {
  name: 'vista-shelterbelt',
  category: 'vista',
  radius: 30,
  solid: false,
  options: variantField(VARIANTS),

  build({ seed = 1, scale = 1, variant }: VistaShelterbeltOptions = {}) {
    const rng = createRng(seed);
    const kind = pickVariant(rng, VARIANTS, variant);
    const count = kind === 'five' ? 5 : 9;
    const pitch = rng.range(5.5, 7);
    const height = rng.range(14, 18);
    const parts: Part[] = [];
    for (let i = 0; i < count; i++) {
      const x = (i - (count - 1) / 2) * pitch;
      parts.push(...treeParts(rng, height * rng.range(0.92, 1.08), x, rng.range(-0.5, 0.5)));
    }
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-shelterbelt', 0));
  },
};
