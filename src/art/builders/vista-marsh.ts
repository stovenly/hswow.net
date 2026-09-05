import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { landWash, markVista, vistaMass, VISTA_MATERIALS } from '../vista';
import { GLINT, glint, treeParts } from '../vista-kit';

// A marsh: a flat of reeds with standing water glinting in it and a line of
// willows along its far side at −Z.

const WILLOW = [VISTA_MATERIALS.pasture[1], VISTA_MATERIALS.hay[1], VISTA_MATERIALS.hay[2]] as const;

export const vistaMarsh: MeshBuilder = {
  name: 'vista-marsh',
  category: 'vista',
  radius: 34,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const radius = rng.range(28, 36);
    const flat = vistaMass(rng, {
      radius,
      detail: 1,
      rough: 0.05,
      squash: 0.05,
      stretch: rng.range(0.8, 1.3),
      bury: 0.5,
    });
    flat.rotateY(rng.range(0, Math.PI * 2));
    const parts: Part[] = [
      {
        geometry: flat,
        color: landWash(seed ^ 0x3a55, VISTA_MATERIALS.scrub, { scale: rng.range(18, 30) }),
        sway: 0,
      },
    ];

    const pools = rng.int(3, 4);
    for (let i = 0; i < pools; i++) {
      const angle = rng.range(0, Math.PI * 2);
      const away = rng.range(4, radius * 0.5);
      const pool = glint(rng.range(6, 12), rng.range(4, 8), Math.cos(angle) * away, 0.45, Math.sin(angle) * away);
      pool.rotateY(rng.range(0, Math.PI));
      parts.push({ geometry: pool, color: GLINT, sway: 0 });
    }

    const willows = rng.int(3, 4);
    for (let i = 0; i < willows; i++) {
      const x = (i - (willows - 1) / 2) * rng.range(8, 11);
      parts.push(...treeParts(rng, rng.range(7, 10), x, -radius * 0.55 + rng.range(-2, 2), WILLOW));
    }

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-marsh', 0));
  },
};
