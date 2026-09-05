import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge } from '../vista';
import { crestAlong, pickVariant, variantField } from '../vista-kit';

// A down: a long rounded whaleback, both sides gentle, turf all over. Laid along
// +X; the double variant is a second lower crest in front of the first.

const VARIANTS = ['short', 'long', 'double'] as const;

export interface VistaDownOptions extends BuildOptions {
  variant?: (typeof VARIANTS)[number];
}

export const vistaDown: BuilderWith<VistaDownOptions> = {
  name: 'vista-down',
  category: 'vista',
  radius: 50,
  solid: false,
  options: variantField(VARIANTS),

  build({ seed = 1, scale = 1, variant }: VistaDownOptions = {}) {
    const rng = createRng(seed);
    const kind = pickVariant(rng, VARIANTS, variant);

    const length = kind === 'long' ? rng.range(100, 130) : rng.range(55, 80);
    const height = kind === 'long' ? rng.range(10, 15) : rng.range(8, 13);
    const run = rng.range(2.3, 2.8);
    const ridge = vistaRidge(rng, {
      crest: crestAlong(rng, length, height, kind === 'long' ? 7 : 5),
      face: run,
      back: run * rng.range(0.9, 1.15),
      facets: 2,
      foot: 6,
      rough: 0.05,
    });

    let geometry = ridge;
    if (kind === 'double') {
      const second = vistaRidge(rng, {
        crest: crestAlong(rng, length * 0.8, height * 0.7, 5),
        face: run,
        back: run,
        facets: 2,
        foot: 6,
        rough: 0.05,
      });
      second.translate(rng.range(-length * 0.15, length * 0.15), 0, height * run * 1.1);
      const merged = mergeGeometries([ridge, second], false);
      ridge.dispose();
      second.dispose();
      if (!merged) throw new Error('vista-down: crests did not share an attribute set');
      geometry = merged;
    }

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0x0d01, {
          ground: rng.chance(0.3) ? 'hay' : 'pasture',
          bands: [{ material: 'scrub', steeperThan: 0.5 }],
          wobble: 2,
          crown: height * 0.6,
          scale: rng.range(50, 90),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-down', 0));
  },
};
