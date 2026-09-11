import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { landWash, markVista, vistaMass, VISTA_MATERIALS } from '../vista';

// Scrub: a loose scatter of low dark lumps, gorse and thorn on a heath.

export const vistaScrub: MeshBuilder = {
  name: 'vista-scrub',
  category: 'vista',
  radius: 16,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const count = rng.int(6, 8);
    const spread = rng.range(20, 30);
    const wash = landWash(seed ^ 0x5c2b, VISTA_MATERIALS.scrub, { scale: rng.range(12, 20), crown: 4, foot: 0.7 });
    const parts: Part[] = [];
    for (let i = 0; i < count; i++) {
      const angle = rng.range(0, Math.PI * 2);
      const away = Math.sqrt(rng()) * spread * 0.5;
      const lump = vistaMass(rng, {
        radius: rng.range(2, 4),
        detail: 0,
        rough: rng.range(0.2, 0.35),
        squash: rng.range(0.5, 0.8),
        stretch: rng.range(0.8, 1.6),
        bury: 0.35,
      });
      lump.rotateY(rng.range(0, Math.PI * 2));
      lump.translate(Math.cos(angle) * away, 0, Math.sin(angle) * away);
      parts.push({ geometry: lump, color: wash, sway: 0 });
    }
    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-scrub', 0));
  },
};
