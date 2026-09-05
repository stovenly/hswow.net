import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge } from '../vista';

// A far range: five to seven peaks welded into one long jagged profile for the
// horizon, in one value, with the fog to make it blue.

export const vistaRangeFar: MeshBuilder = {
  name: 'vista-range-far',
  category: 'vista',
  radius: 170,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const peaks = rng.int(5, 7);
    const length = rng.range(250, 340);
    const height = rng.range(50, 80);

    // Peaks and the saddles between them, alternating, no two peaks alike.
    const crest: [number, number, number][] = [];
    const stations = peaks * 2 + 1;
    for (let i = 0; i < stations; i++) {
      const t = i / (stations - 1);
      const x = -length / 2 + t * length + (i > 0 && i < stations - 1 ? rng.range(-8, 8) : 0);
      const z = rng.range(-12, 12);
      const isPeak = i % 2 === 1;
      const envelope = 0.55 + 0.45 * Math.sin(t * Math.PI);
      const h = isPeak ? height * envelope * rng.range(0.8, 1.1) : height * envelope * rng.range(0.4, 0.6);
      crest.push([x, z, i === 0 || i === stations - 1 ? height * 0.2 : h]);
    }

    const geometry = vistaRidge(rng, {
      crest,
      face: rng.range(0.95, 1.15),
      back: rng.range(1.1, 1.35),
      facets: 2,
      foot: 14,
      sink: 5,
      rough: 0.08,
    });

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0xfa12, {
          ground: 'heath',
          bands: [{ material: 'rock', above: height * 0.55 }],
          wobble: 5,
          crown: height * 0.8,
          scale: rng.range(90, 150),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-range-far', 0));
  },
};
