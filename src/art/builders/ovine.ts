import type { MeshBuilder } from '../types';
import { buildQuadruped, type Species } from '../quadruped';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * A sheep: a small dark head and legs, and a cloud where the body should be.
 *
 * The only species here that sets `woolly`, which scatters fleece lumps proud
 * of the torso. Underneath it is nearly a scaled-down cow — the fleece is
 * doing all of the identification, which is also true of the animal.
 */
const OVINE: Species = {
  length: [0.95, 1.25],
  girth: [0.55, 0.7],
  legLength: [0.34, 0.46],
  legThickness: 0.045,
  neck: [0.18, 0.28],
  neckRise: [0.2, 0.5],
  headSize: [0.13, 0.17],
  headStretch: 1.4,
  // Narrow. A sheep's face tapers to a point far more than a cow's, and the
  // fleece behind it makes anything blunt on the front read as enormous.
  snout: 0.32,
  ears: 'side',
  horns: 'none',
  tail: 'switch',
  woolly: true,
  hide: [PALETTE.HIDE_DARK, PALETTE.STONE_DARK],
  extremity: PALETTE.HIDE_DARK,
};

export const ovine: MeshBuilder = {
  name: 'ovine',
  category: 'animals',
  radius: 0.8,
  build: (options = {}) =>
    buildQuadruped('ovine', OVINE, createRng(options.seed ?? 1), options),
};
