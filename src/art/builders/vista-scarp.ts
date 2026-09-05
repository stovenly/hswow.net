import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge, type BankBand } from '../vista';
import { crestAlong, pickVariant, variantField } from '../vista-kit';

// An escarpment: a steep face toward +Z and a long gentle back, with a notch in
// the crest. The face is wooded, bare with rock where it is steepest, or the
// crest carries a hanging wood along its top.

const VARIANTS = ['wooded', 'bare', 'hanging'] as const;

export interface VistaScarpOptions extends BuildOptions {
  variant?: (typeof VARIANTS)[number];
}

export const vistaScarp: BuilderWith<VistaScarpOptions> = {
  name: 'vista-scarp',
  category: 'vista',
  radius: 60,
  solid: false,
  options: variantField(VARIANTS),

  build({ seed = 1, scale = 1, variant }: VistaScarpOptions = {}) {
    const rng = createRng(seed);
    const kind = pickVariant(rng, VARIANTS, variant);

    const length = rng.range(90, 120);
    const height = rng.range(14, 20);
    const geometry = vistaRidge(rng, {
      crest: crestAlong(rng, length, height, 6),
      face: rng.range(1.1, 1.4),
      back: rng.range(3.6, 4.4),
      facets: 3,
      foot: 6,
      notches: 1,
      rough: 0.06,
    });

    const bands: BankBand[] =
      kind === 'wooded'
        ? [{ material: 'wood', steeperThan: 0.45, facing: 0 }]
        : kind === 'bare'
          ? [
              { material: 'heath', above: height * 0.7 },
              { material: 'rock', steeperThan: 0.62, facing: 0 },
            ]
          : [
              { material: 'scrub', steeperThan: 0.5, facing: 0 },
              { material: 'wood', above: height * 0.62 },
            ];

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0x5ca2, {
          ground: 'pasture',
          bands,
          wobble: 2.5,
          crown: height * 0.6,
          scale: rng.range(60, 100),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-scarp', 0));
  },
};
