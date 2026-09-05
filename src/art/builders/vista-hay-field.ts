import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { landWash, markVista, vistaMass, VISTA_MATERIALS } from '../vista';
import { cap } from '../vista-kit';

// A hay field: a pale flat with a row of ricks standing in it along +X.

export const vistaHayField: MeshBuilder = {
  name: 'vista-hay-field',
  category: 'vista',
  radius: 30,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const radius = rng.range(26, 34);
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
        color: landWash(seed ^ 0x4a7f, VISTA_MATERIALS.hay, { scale: rng.range(20, 34) }),
        sway: 0,
      },
    ];

    const ricks = rng.int(4, 6);
    const pitch = rng.range(6, 8);
    const rick = shade(PALETTE.GRASS_DRY, 1.15);
    for (let i = 0; i < ricks; i++) {
      const x = (i - (ricks - 1) / 2) * pitch;
      const z = rng.range(-3, 3);
      const tall = rng.range(2.4, 3.4);
      parts.push({ geometry: cap(tall * 0.6, tall, 5, x, 0.4, z), color: rick, sway: 0 });
    }

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-hay-field', 0));
  },
};
