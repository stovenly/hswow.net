import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { landWash, markVista, vistaMass, VISTA_MATERIALS } from '../vista';

// A mere: a flat pale glint of water in a hollow, reeds along its +Z shore.

const WATER = [shade(PALETTE.STONE_PALE, 0.95), PALETTE.STONE_PALE, shade(PALETTE.STONE_PALE, 1.1)] as const;

export const vistaMere: MeshBuilder = {
  name: 'vista-mere',
  category: 'vista',
  radius: 24,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const radius = rng.range(18, 26);
    const water = vistaMass(rng, {
      radius,
      detail: 0,
      rough: 0.12,
      squash: 0.02,
      stretch: rng.range(0.7, 1.3),
      bury: 0.5,
    });
    water.rotateY(rng.range(0, Math.PI * 2));
    const parts: Part[] = [
      { geometry: water, color: landWash(seed ^ 0x3e2e, WATER, { scale: rng.range(20, 30) }), sway: 0 },
    ];

    const reeds = vistaMass(rng, {
      radius: radius * 0.6,
      detail: 0,
      rough: 0.2,
      squash: 0.08,
      stretch: 0.45,
      bury: 0.3,
    });
    reeds.translate(rng.range(-4, 4), 0, radius * 0.75);
    parts.push({
      geometry: reeds,
      color: landWash(seed ^ 0x3e2f, VISTA_MATERIALS.scrub, { scale: 20 }),
      sway: 0,
    });

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-mere', 0));
  },
};
