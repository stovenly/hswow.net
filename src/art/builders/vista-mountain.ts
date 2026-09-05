import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge } from '../vista';
import { pickVariant, variantField } from '../vista-kit';

// A mountain for the far band: one high mass with a peak, a flat top, or two
// peaks, wood below the tree line, heath above it and rock on the top.

const VARIANTS = ['peaked', 'flat', 'twin'] as const;

export interface VistaMountainOptions extends BuildOptions {
  variant?: (typeof VARIANTS)[number];
}

export const vistaMountain: BuilderWith<VistaMountainOptions> = {
  name: 'vista-mountain',
  category: 'vista',
  radius: 70,
  solid: false,
  options: variantField(VARIANTS),

  build({ seed = 1, scale = 1, variant }: VistaMountainOptions = {}) {
    const rng = createRng(seed);
    const kind = pickVariant(rng, VARIANTS, variant);

    const height = rng.range(60, 90);
    const half = rng.range(25, 35);
    const wander = () => rng.range(-4, 4);
    const crest: [number, number, number][] =
      kind === 'peaked'
        ? [
            [-half, wander(), height * 0.3],
            [rng.range(-6, 6), wander(), height],
            [half, wander(), height * 0.28],
          ]
        : kind === 'flat'
          ? [
              [-half, wander(), height * 0.3],
              [-half * 0.3, wander(), height * 0.96],
              [half * 0.3, wander(), height],
              [half, wander(), height * 0.32],
            ]
          : [
              [-half * 1.3, wander(), height * 0.3],
              [-half * 0.55, wander(), height * 0.92],
              [0, wander(), height * 0.62],
              [half * 0.55, wander(), height],
              [half * 1.3, wander(), height * 0.28],
            ];

    const geometry = vistaRidge(rng, {
      crest,
      face: rng.range(0.85, 1.0),
      back: rng.range(1.0, 1.25),
      facets: 3,
      foot: 12,
      sink: 4,
      rough: 0.08,
    });

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0x3017, {
          ground: 'wood',
          bands: [
            { material: 'heath', above: height * 0.35 },
            { material: 'rock', above: height * 0.6 },
            { material: 'rock', steeperThan: 0.95 },
          ],
          wobble: 4,
          crown: height * 0.7,
          scale: rng.range(50, 90),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-mountain', 0));
  },
};
