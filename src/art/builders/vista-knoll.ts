import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista, vistaBank, vistaMass } from '../vista';
import { block, pickVariant, treeParts, variantField } from '../vista-kit';

// A knoll: one small steep hill on its own, bare, with a copse on top, or with
// a tor of blocks on the crest.

const VARIANTS = ['bare', 'wooded', 'tor'] as const;

export interface VistaKnollOptions extends BuildOptions {
  variant?: (typeof VARIANTS)[number];
}

export const vistaKnoll: BuilderWith<VistaKnollOptions> = {
  name: 'vista-knoll',
  category: 'vista',
  radius: 16,
  solid: false,
  options: variantField(VARIANTS),

  build({ seed = 1, scale = 1, variant }: VistaKnollOptions = {}) {
    const rng = createRng(seed);
    const kind = pickVariant(rng, VARIANTS, variant);

    const radius = rng.range(12, 16);
    const squash = rng.range(0.7, 0.95);
    const bury = 0.4;
    const geometry = vistaMass(rng, {
      radius,
      detail: 1,
      rough: rng.range(0.12, 0.2),
      squash,
      stretch: rng.range(0.85, 1.2),
      bury,
    });
    geometry.rotateY(rng.range(0, Math.PI * 2));
    const top = radius * squash * 2 * (1 - bury);

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0x4e01, {
          ground: 'pasture',
          bands: [{ material: 'scrub', steeperThan: 0.55 }],
          wobble: 1.5,
          crown: top,
          scale: rng.range(20, 34),
        }),
        sway: 0,
      },
    ];

    if (kind === 'wooded') {
      const count = rng.int(3, 4);
      for (let i = 0; i < count; i++) {
        const angle = rng.range(0, Math.PI * 2);
        const away = rng.range(0, radius * 0.3);
        parts.push(
          ...treeParts(rng, rng.range(7, 10), Math.cos(angle) * away, Math.sin(angle) * away).map((part) => {
            part.geometry.translate(0, top - 1.5, 0);
            return part;
          }),
        );
      }
    } else if (kind === 'tor') {
      let y = top - 1;
      const stack = rng.int(2, 3);
      for (let i = 0; i < stack; i++) {
        const w = rng.range(4, 6) * (1 - i * 0.15);
        const h = rng.range(1.6, 2.6);
        const stone = block(w, h, w * rng.range(0.7, 1), rng.range(-1, 1), y, rng.range(-1, 1));
        stone.rotateY(rng.range(-0.3, 0.3));
        parts.push({ geometry: stone, color: shade(rng.pick([PALETTE.STONE_DARK, PALETTE.STONE]), 0.95), sway: 0 });
        y += h * 0.9;
      }
    }

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-knoll', 0));
  },
};
