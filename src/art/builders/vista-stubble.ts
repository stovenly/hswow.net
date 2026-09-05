import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { landWash, markVista, vistaMass, VISTA_MATERIALS } from '../vista';
import { cap } from '../vista-kit';

// Stubble: a pale gold field with stooks standing in rows.

export const vistaStubble: MeshBuilder = {
  name: 'vista-stubble',
  category: 'vista',
  radius: 28,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const radius = rng.range(24, 32);
    const field = vistaMass(rng, {
      radius,
      detail: 1,
      rough: 0.06,
      squash: 0.06,
      stretch: rng.range(0.7, 1.2),
      bury: 0.5,
    });
    field.rotateY(rng.range(0, Math.PI * 2));
    const parts: Part[] = [
      {
        geometry: field,
        color: landWash(seed ^ 0x57bb, VISTA_MATERIALS.crop, { scale: rng.range(20, 34) }),
        sway: 0,
      },
    ];

    const rows = 2;
    const perRow = rng.int(4, 5);
    const pitch = rng.range(5, 6.5);
    const stook = shade(PALETTE.GRASS_DRY, 1.25);
    for (let r = 0; r < rows; r++) {
      for (let i = 0; i < perRow; i++) {
        const x = (i - (perRow - 1) / 2) * pitch + rng.range(-0.5, 0.5);
        const z = (r - 0.5) * pitch * 1.4 + rng.range(-0.5, 0.5);
        parts.push({ geometry: cap(0.9, rng.range(1.5, 1.9), 4, x, 0.3, z), color: stook, sway: 0 });
      }
    }

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-stubble', 0));
  },
};
