import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista } from '../vista';
import { block, GLINT, glint } from '../vista-kit';

// A bridge along +X over a glint of water running along +Z: a deck on piers,
// the arches being the gaps between them.

/** The bridge's parts about the origin. */
export function bridgeParts(rng: Rng, arches = 3): Part[] {
  const span = rng.range(7, 9) * arches;
  const deckHigh = rng.range(4, 5.5);
  const stone = shade(rng.pick([PALETTE.STONE, PALETTE.STONE_PALE]), 0.98);
  const parts: Part[] = [
    { geometry: glint(span * 1.6, rng.range(18, 26), 0, 0.1, 0), color: GLINT, sway: 0 },
    { geometry: block(span + 3, 1.4, 4, 0, deckHigh, 0), color: stone, sway: 0 },
  ];
  for (let i = 0; i <= arches; i++) {
    const x = -span / 2 + (span / arches) * i;
    parts.push({ geometry: block(1.6, deckHigh + 0.2, 4.6, x, -0.5, 0), color: shade(stone, 0.92), sway: 0 });
  }
  parts.push({ geometry: block(span + 3, 0.9, 0.5, 0, deckHigh + 1.4, 2), color: shade(stone, 0.9), sway: 0 });
  return parts;
}

export const vistaBridge: MeshBuilder = {
  name: 'vista-bridge',
  category: 'vista',
  radius: 20,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const merged = assemble(bridgeParts(rng));
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-bridge', 0));
  },
};
