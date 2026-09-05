import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaMass } from '../vista';

// A sea stack: a tall narrow pillar of rock with a lower lump at its foot, wet
// at the waterline. Placed in the sea, in line with the headland it fell off.

export const vistaStack: MeshBuilder = {
  name: 'vista-stack',
  category: 'vista',
  radius: 10,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const radius = rng.range(6, 9);
    const squash = rng.range(2.0, 2.8);
    const pillar = vistaMass(rng, {
      radius,
      detail: 0,
      rough: rng.range(0.22, 0.32),
      squash,
      stretch: rng.range(0.6, 0.8),
      bury: 0.3,
    });
    pillar.rotateY(rng.range(0, Math.PI * 2));
    const foot = vistaMass(rng, {
      radius: radius * 0.8,
      detail: 0,
      rough: 0.3,
      squash: 0.5,
      stretch: rng.range(0.8, 1.2),
      bury: 0.5,
    });
    foot.translate(rng.range(-radius, radius) * 0.6, 0, rng.range(-radius, radius) * 0.6);
    const geometry = mergeGeometries([pillar, foot], false);
    pillar.dispose();
    foot.dispose();
    if (!geometry) throw new Error('vista-stack: masses did not share an attribute set');
    const top = radius * squash * 2 * 0.7;

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0x57ac, {
          ground: 'rock',
          bands: [
            { material: 'scrub', gentlerThan: 0.5, above: top * 0.5 },
            { material: 'wet', below: 3 },
          ],
          wobble: 1,
          crown: top,
          scale: rng.range(12, 20),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-stack', 0));
  },
};
