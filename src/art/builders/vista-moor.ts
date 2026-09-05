import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { landWash, markVista, vistaMass, VISTA_MATERIALS } from '../vista';
import { cairn } from '../vista-kit';

// A moor: a broad dark heath, a paler sheep track wandering across it toward +Z,
// and one cairn on the highest point.

export const vistaMoor: MeshBuilder = {
  name: 'vista-moor',
  category: 'vista',
  radius: 40,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const radius = rng.range(34, 44);
    const squash = rng.range(0.12, 0.18);
    const bury = 0.45;
    const geometry = vistaMass(rng, {
      radius,
      detail: 1,
      rough: rng.range(0.08, 0.14),
      squash,
      stretch: rng.range(0.8, 1.3),
      bury,
    });
    const top = radius * squash * 2 * (1 - bury);

    const heath = landWash(seed ^ 0x300a, VISTA_MATERIALS.heath, { scale: rng.range(30, 50), crown: top });
    const track = landWash(seed ^ 0x300b, VISTA_MATERIALS.hay, { scale: 40, crown: top });
    const bend = rng.range(-0.02, 0.02);
    const drift = rng.range(-8, 8);
    const parts: Part[] = [
      {
        geometry,
        color: (x, y, z) => {
          const across = x - (drift + z * z * bend + Math.sin(z * 0.15) * 4);
          return Math.abs(across) < 1.4 ? track(x, y, z) : heath(x, y, z);
        },
        sway: 0,
      },
      cairn(rng, 2.6, rng.range(-4, 4), top - 0.6, rng.range(-4, 4)),
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-moor', 0));
  },
};
