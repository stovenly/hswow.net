import type { MeshBuilder } from '../types';
import { buildQuadruped, type Species } from '../quadruped';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * Cattle. Long in the body, short in the leg, head carried low.
 *
 * The low head is the whole silhouette. A cow spends its life with its muzzle
 * near the ground and a neck that barely rises out of the shoulders, which is
 * what separates it at fifty metres from a horse built to almost the same
 * dimensions.
 */
const BOVINE: Species = {
  length: [1.9, 2.3],
  girth: [0.85, 1.05],
  legLength: [0.62, 0.78],
  legThickness: 0.085,
  neck: [0.4, 0.55],
  neckRise: [0.05, 0.3],
  headSize: [0.24, 0.3],
  headStretch: 1.5,
  snout: 0.55,
  ears: 'side',
  horns: 'stub',
  tail: 'switch',
  woolly: false,
  // White ground with dark patches. A brown cow and a brown horse at forty
  // metres are the same animal; a black-and-white one is unmistakably cattle,
  // and that legibility is worth more here than breed accuracy.
  hide: [PALETTE.WOOL, PALETTE.STONE_PALE],
  extremity: PALETTE.HOG,
  patch: [PALETTE.COW_BLACK, PALETTE.COW_BLACK, PALETTE.HIDE_DARK],
  patchCoverage: 0.46,
};

export const bovine: MeshBuilder = {
  name: 'bovine',
  radius: 1.4,
  build: (options = {}) =>
    buildQuadruped('bovine', BOVINE, createRng(options.seed ?? 1), options),
};
