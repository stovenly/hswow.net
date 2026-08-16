import type { BuilderWith } from '../types';
import { buildQuadruped, canineHead, type Species } from '../quadruped';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import type { LifeOptions } from '../../life/spec';

/**
 * A dog: short, high off the ground, all head and tail.
 *
 * Deep at the chest and tucked at the loin, a long neck carried up, a head
 * with a stop, and a tail carried above the back — the four things that keep
 * it from reading as a calf. A wide range of leg length on purpose: a terrier
 * and a lurcher are both dogs.
 */
const CANINE: Species = {
  length: [0.5, 0.68],
  girth: [0.19, 0.24],
  legLength: [0.19, 0.38],
  legThickness: 0.024,
  hock: 0.2,
  feet: 'paw',
  body: [
    { z: -0.5, y: 0.04, rx: 0.24, ry: 0.28 },
    { z: -0.35, y: 0.02, rx: 0.34, ry: 0.4 },
    { z: -0.1, y: 0.0, rx: 0.36, ry: 0.44 },
    { z: 0.15, y: -0.03, rx: 0.38, ry: 0.52 },
    { z: 0.38, y: 0.02, rx: 0.34, ry: 0.46 },
    { z: 0.5, y: 0.06, rx: 0.22, ry: 0.3 },
  ],
  sides: 6,
  woolly: false,
  neck: [0.16, 0.22],
  neckRise: [0.6, 1.0],
  neckThick: 0.34,
  headSize: [0.1, 0.13],
  headPitch: 0.15,
  head: canineHead,
  tail: 'carried',
  hide: [PALETTE.HIDE, PALETTE.HIDE_DARK, PALETTE.HIDE_PALE, PALETTE.STONE_DARK],
  extremity: PALETTE.HIDE_DARK,
  hair: [PALETTE.HIDE_DARK],
  walkSpeed: 0.8,
  call: 'dog',
  grazes: false,
};

export const dog: BuilderWith<LifeOptions> = {
  name: 'dog',
  category: 'animals',
  radius: 0.55,
  solid: false,
  build: (options = {}) =>
    buildQuadruped('dog', CANINE, createRng(options.seed ?? 1), options),
};
