import type { MeshBuilder } from '../types';
import { buildQuadruped, type Species } from '../quadruped';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * A pig. Barrel-bodied, almost no leg, and no neck to speak of.
 *
 * The head sits practically on the shoulders — a neck length near zero and a
 * rise near zero — so the whole animal is one continuous mass from snout to
 * rump. That, the blunt cylinder of a snout, and the curl of tail are the
 * three things that make it unmistakable.
 */
const PORCINE: Species = {
  length: [1.1, 1.5],
  girth: [0.6, 0.78],
  legLength: [0.25, 0.36],
  legThickness: 0.055,
  neck: [0.1, 0.2],
  neckRise: [0, 0.2],
  headSize: [0.19, 0.24],
  headStretch: 1.45,
  snout: 0.75,
  ears: 'floppy',
  horns: 'none',
  tail: 'curl',
  woolly: false,
  hide: [PALETTE.HOG, PALETTE.HIDE_PALE, PALETTE.HIDE_DARK],
  extremity: PALETTE.HOG,
  patch: [PALETTE.HIDE_DARK, PALETTE.HIDE],
  patchCoverage: 0.3,
};

export const porcine: MeshBuilder = {
  name: 'porcine',
  radius: 0.95,
  build: (options = {}) =>
    buildQuadruped('porcine', PORCINE, createRng(options.seed ?? 1), options),
};
