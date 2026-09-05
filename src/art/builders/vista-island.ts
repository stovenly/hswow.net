import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaMass, landWash, VISTA_MATERIALS } from '../vista';

// A low wooded island in far water: a flat mass with a sand rim and a lumpy
// wood standing on it.

export const vistaIsland: MeshBuilder = {
  name: 'vista-island',
  category: 'vista',
  radius: 26,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const radius = rng.range(20, 28);
    const land = vistaMass(rng, {
      radius,
      detail: 0,
      rough: 0.16,
      squash: rng.range(0.12, 0.18),
      stretch: rng.range(0.7, 1.3),
      bury: 0.55,
    });
    land.rotateY(rng.range(0, Math.PI * 2));
    const parts: Part[] = [
      {
        geometry: land,
        color: vistaBank(seed ^ 0x151a, { ground: 'sand', bands: [{ material: 'pasture', above: 1.2 }], crown: 3 }),
        sway: 0,
      },
    ];
    const wash = landWash(seed ^ 0x151b, VISTA_MATERIALS.wood, { scale: 20, crown: 10 });
    const lumps = rng.int(2, 3);
    for (let i = 0; i < lumps; i++) {
      const lump = vistaMass(rng, {
        radius: rng.range(6, 9),
        detail: 0,
        rough: 0.25,
        squash: rng.range(0.7, 0.9),
        stretch: rng.range(0.8, 1.3),
        bury: 0.45,
      });
      lump.rotateY(rng.range(0, Math.PI * 2));
      lump.translate(rng.range(-radius * 0.35, radius * 0.35), 1.5, rng.range(-radius * 0.3, radius * 0.3));
      parts.push({ geometry: lump, color: wash, sway: 0 });
    }
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-island', 0));
  },
};
