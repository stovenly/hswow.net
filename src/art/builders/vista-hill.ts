import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaMass } from '../vista';

// A rounded hill for the near band: a displaced dome with one flank pushed
// steeper than the other, turf on the gentle side and wood on the steep one.

export const vistaHill: MeshBuilder = {
  name: 'vista-hill',
  category: 'vista',
  radius: 20,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);

    const radius = rng.range(18, 26);
    const squash = rng.range(0.3, 0.46);
    const bury = rng.range(0.46, 0.56);
    const geometry = vistaMass(rng, {
      radius,
      detail: 1,
      rough: rng.range(0.14, 0.26),
      squash,
      stretch: rng.range(0.7, 1.45),
      bury,
    });
    const top = radius * squash * 2 * (1 - bury);

    // The top is pushed along +X, so the +X flank is the scarp and −X the dip.
    const lean = rng.range(0.25, 0.6);
    const position = geometry.getAttribute('position');
    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);
      if (y > 0) position.setX(i, position.getX(i) + y * lean);
    }
    position.needsUpdate = true;
    geometry.computeVertexNormals();

    // rotateY(θ) takes +X to bearing θ + π/2, which is where the scarp now faces.
    const turn = rng.range(0, Math.PI * 2);
    geometry.rotateY(turn);

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0x5e1a, {
          ground: rng.chance(0.35) ? 'hay' : 'pasture',
          bands: [{ material: 'wood', steeperThan: 0.42, below: top * 0.8, facing: turn + Math.PI / 2 }],
          wobble: 1.5,
          crown: top,
          scale: rng.range(30, 55),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-hill', 0));
  },
};
