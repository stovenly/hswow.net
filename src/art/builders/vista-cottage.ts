import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';
import { block, gable, roofShade, WALLS } from '../vista-kit';

// A cottage: one roof along +X with a chimney at one end.

/** The cottage's parts about the origin; `stack` is where its chimney top is. */
export function cottageParts(rng: Rng): { parts: Part[]; stack: [number, number, number] } {
  const length = rng.range(7, 9.5);
  const width = rng.range(5, 6.5);
  const eave = rng.range(3, 3.8);
  const rise = width * 0.55;
  const end = rng.pick([-1, 1]);
  const stackHigh = rise + 1.4;
  const x = end * (length / 2 - 1);
  const parts: Part[] = [
    { geometry: block(length, eave, width, 0, 0, 0), color: rng.pick(WALLS), sway: 0 },
    { geometry: gable(length + 0.7, width + 1, eave, rise), color: roofShade(rng), sway: 0 },
    { geometry: block(0.9, stackHigh, 0.9, x, eave, 0), color: shade(PALETTE.STONE_DARK, 0.9), sway: 0 },
  ];
  return { parts, stack: [x, eave + stackHigh, 0] };
}

export const vistaCottage: MeshBuilder = {
  name: 'vista-cottage',
  category: 'vista',
  radius: 6,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const merged = assemble(cottageParts(rng).parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-cottage', 0));
  },
};
