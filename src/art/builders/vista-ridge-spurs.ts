import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge } from '../vista';
import { crestAlong, pickVariant, variantField } from '../vista-kit';

// A ridge sending spurs down toward +Z with coombes between them, wood in the
// coombes and heath along the top.

const VARIANTS = ['two', 'three'] as const;

export interface VistaRidgeSpursOptions extends BuildOptions {
  variant?: (typeof VARIANTS)[number];
}

export const vistaRidgeSpurs: BuilderWith<VistaRidgeSpursOptions> = {
  name: 'vista-ridge-spurs',
  category: 'vista',
  radius: 55,
  solid: false,
  options: variantField(VARIANTS),

  build({ seed = 1, scale = 1, variant }: VistaRidgeSpursOptions = {}) {
    const rng = createRng(seed);
    const kind = pickVariant(rng, VARIANTS, variant);

    const length = rng.range(90, 110);
    const height = rng.range(12, 18);
    const geometry = vistaRidge(rng, {
      crest: crestAlong(rng, length, height, 5),
      face: rng.range(1.6, 2.0),
      back: rng.range(2.6, 3.4),
      facets: 2,
      foot: 6,
      spurs: kind === 'two' ? 2 : 3,
      rough: 0.06,
    });

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0x5b0c, {
          ground: 'pasture',
          bands: [
            { material: 'wood', steeperThan: 0.4, below: height * 0.5 },
            { material: 'heath', above: height * 0.78 },
          ],
          wobble: 2.5,
          crown: height * 0.6,
          scale: rng.range(50, 90),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-ridge-spurs', 0));
  },
};
