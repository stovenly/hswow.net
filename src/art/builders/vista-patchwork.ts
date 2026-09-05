import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge, type VistaMaterial } from '../vista';
import { crestAlong, pickVariant, treeParts, variantField } from '../vista-kit';

// A patchwork: a low gentle slope facing +Z laid out in hedged fields, with
// standards at some of the corners. Pasture only, mixed, or after harvest.

const VARIANTS = ['pasture', 'mixed', 'harvest'] as const;

export interface VistaPatchworkOptions extends BuildOptions {
  variant?: (typeof VARIANTS)[number];
}

const CROPS: Record<(typeof VARIANTS)[number], readonly VistaMaterial[]> = {
  pasture: ['pasture', 'pasture', 'hay'],
  mixed: ['pasture', 'hay', 'crop'],
  harvest: ['hay', 'crop', 'crop'],
};

export const vistaPatchwork: BuilderWith<VistaPatchworkOptions> = {
  name: 'vista-patchwork',
  category: 'vista',
  radius: 60,
  solid: false,
  options: variantField(VARIANTS),

  build({ seed = 1, scale = 1, variant }: VistaPatchworkOptions = {}) {
    const rng = createRng(seed);
    const kind = pickVariant(rng, VARIANTS, variant);

    const length = rng.range(100, 130);
    const height = rng.range(6, 9);
    const field = rng.range(30, 45);
    const geometry = vistaRidge(rng, {
      crest: crestAlong(rng, length, height, 6),
      face: rng.range(4, 5),
      back: rng.range(4, 6),
      facets: 4,
      foot: 8,
      rough: 0.03,
    });

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0x9a7c, {
          ground: 'fields',
          field,
          hedge: 1.5,
          crops: CROPS[kind],
          wobble: 1,
          crown: height,
          scale: rng.range(60, 90),
        }),
        sway: 0,
      },
    ];

    // Standards where field corners fall, roughly: on the field grid, low on the slope.
    const count = rng.int(3, 4);
    for (let i = 0; i < count; i++) {
      const x = (Math.round(rng.range(-length * 0.4, length * 0.4) / field) + 0.5) * field;
      const z = rng.range(height * 1.5, height * 4);
      parts.push(...treeParts(rng, rng.range(8, 11), x, z));
    }

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-patchwork', 0));
  },
};
