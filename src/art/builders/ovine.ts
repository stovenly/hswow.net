import type { BuilderWith } from '../types';
import { buildQuadruped, ovineHead, type Species } from '../quadruped';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import type { LifeOptions } from '../../life/spec';
import type { Fields } from '../schema';

// A sheep: a small dark face and legs, and a loaf of fleece where the body is.
// The loaf is the body loft ruffled — every vertex pushed in or out — so the
// fleece is lumpy everywhere and gapped nowhere.
const OVINE: Species = {
  length: [0.95, 1.25],
  girth: [0.55, 0.7],
  legLength: [0.34, 0.46],
  legThickness: 0.042,
  hock: 0.14,
  feet: 'hoof',
  body: [
    { z: -0.5, y: 0.04, rx: 0.26, ry: 0.32 },
    { z: -0.35, y: 0.04, rx: 0.4, ry: 0.48 },
    { z: -0.1, y: 0.04, rx: 0.42, ry: 0.5 },
    { z: 0.15, y: 0.04, rx: 0.42, ry: 0.5 },
    { z: 0.38, y: 0.04, rx: 0.38, ry: 0.46 },
    { z: 0.5, y: 0.04, rx: 0.24, ry: 0.3 },
  ],
  sides: 7,
  woolly: true,
  neck: [0.2, 0.28],
  neckRise: [0.2, 0.45],
  neckThick: 0.24,
  headSize: [0.13, 0.16],
  headPitch: 0.5,
  head: ovineHead,
  tail: 'dock',
  hide: [PALETTE.HIDE_DARK, PALETTE.STONE_DARK, PALETTE.COW_BLACK],
  extremity: PALETTE.HIDE_DARK,
  hair: [PALETTE.WOOL],
  walkSpeed: 0.5,
  call: 'sheep',
  grazes: true,
};

export const ovine: BuilderWith<LifeOptions> = {
  name: 'ovine',
  category: 'animals',
  options: { roam: { type: 'number', min: 0, max: 12, step: 0.1 }, face: { type: 'string' }, folk: { type: 'choice', options: ['country', 'city'] } } satisfies Fields,
  radius: 0.8,
  solid: false,
  build: (options = {}) =>
    buildQuadruped('ovine', OVINE, createRng(options.seed ?? 1), options),
};
