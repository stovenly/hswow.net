import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';
import { block, cap, gable, pickVariant, roofShade, variantField, WALLS } from '../vista-kit';

// A church: a west tower at −X and a nave running east from it, the tower the
// tallest thing in its cluster, capped square or drawn up into a spire.

const VARIANTS = ['tower', 'spire'] as const;

export interface VistaChurchOptions extends BuildOptions {
  variant?: (typeof VARIANTS)[number];
}

/** The church's parts about the origin, for the icons that stand it among roofs. */
export function churchParts(rng: Rng, kind: (typeof VARIANTS)[number]): Part[] {
  const wall = rng.pick(WALLS);
  const towerWide = rng.range(6, 7.5);
  const towerHigh = rng.range(18, 24);
  const naveLength = rng.range(18, 26);
  const naveWide = rng.range(8, 10);
  const naveEave = rng.range(5, 6.5);
  const parts: Part[] = [
    { geometry: block(towerWide, towerHigh, towerWide, -naveLength / 2 - towerWide / 2, 0, 0), color: wall, sway: 0 },
    { geometry: block(naveLength, naveEave, naveWide, 0, 0, 0), color: shade(wall, 0.97), sway: 0 },
    { geometry: gable(naveLength + 0.8, naveWide + 1.2, naveEave, naveWide * 0.5), color: roofShade(rng), sway: 0 },
  ];
  const towerX = -naveLength / 2 - towerWide / 2;
  if (kind === 'spire') {
    const spire = rng.range(12, 18);
    parts.push({ geometry: cap(towerWide * 0.62, spire, 4, towerX, towerHigh, 0), color: roofShade(rng), sway: 0 });
  } else {
    parts.push({ geometry: cap(towerWide * 0.66, 2, 4, towerX, towerHigh, 0), color: shade(PALETTE.STONE_DARK, 0.8), sway: 0 });
  }
  return parts;
}

export const vistaChurch: BuilderWith<VistaChurchOptions> = {
  name: 'vista-church',
  category: 'vista',
  radius: 18,
  solid: false,
  options: variantField(VARIANTS),

  build({ seed = 1, scale = 1, variant }: VistaChurchOptions = {}) {
    const rng = createRng(seed);
    const merged = assemble(churchParts(rng, pickVariant(rng, VARIANTS, variant)));
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-church', 0));
  },
};
