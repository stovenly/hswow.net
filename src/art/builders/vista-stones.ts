import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';
import { block, pickVariant, variantField } from '../vista-kit';

// Standing stones on a down: a ring, or a row along +X.

const VARIANTS = ['ring', 'row'] as const;

export interface VistaStonesOptions extends BuildOptions {
  variant?: (typeof VARIANTS)[number];
}

export const vistaStones: BuilderWith<VistaStonesOptions> = {
  name: 'vista-stones',
  category: 'vista',
  radius: 12,
  solid: false,
  options: variantField(VARIANTS),

  build({ seed = 1, scale = 1, variant }: VistaStonesOptions = {}) {
    const rng = createRng(seed);
    const kind = pickVariant(rng, VARIANTS, variant);
    const count = rng.int(6, 9);
    const parts: Part[] = [];
    for (let i = 0; i < count; i++) {
      const height = rng.range(2.4, 3.6);
      let x: number;
      let z: number;
      if (kind === 'ring') {
        const radius = rng.range(8, 11);
        const angle = (i / count) * Math.PI * 2;
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
      } else {
        x = (i - (count - 1) / 2) * rng.range(3, 4);
        z = rng.range(-0.6, 0.6);
      }
      const stone = block(rng.range(1.2, 1.8), height, rng.range(0.7, 1.0), x, -0.3, z);
      stone.rotateY(rng.range(0, Math.PI));
      parts.push({ geometry: stone, color: shade(rng.pick([PALETTE.STONE_DARK, PALETTE.STONE]), 0.95), sway: 0 });
    }
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-stones', 0));
  },
};
