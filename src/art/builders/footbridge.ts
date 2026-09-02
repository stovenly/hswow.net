import * as THREE from 'three';
import type { BuildOptions, MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import type { Fields } from '../schema';

// A plank footbridge: two bearers on four posts, planks across, a handrail down
// one side. Built along +X on y = 0, centred on its span; the deck stands a
// little above the ground it is set on, so a stream can run under it.

export interface FootbridgeOptions extends BuildOptions {
  /** Metres end to end. */
  length?: number;
}

const WIDTH = 1.4;
const DECK = 0.45;

export const footbridge: MeshBuilder = {
  name: 'footbridge',
  category: 'structures',
  options: { length: { type: 'number', min: 2.5, max: 10, step: 0.5 } } satisfies Fields,
  radius: 3,

  build({ seed = 1, scale = 1, length = 5 }: FootbridgeOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const dark = shade(PALETTE.TIMBER_DARK, rng.range(0.88, 1));
    const half = length / 2;

    for (const x of [-half + 0.25, half - 0.25]) {
      for (const z of [-WIDTH / 2 + 0.1, WIDTH / 2 - 0.1]) {
        // Driven well below y = 0, so a bank that falls away under the end still meets a post.
        const post = new THREE.BoxGeometry(0.14, DECK + 1.2, 0.14);
        post.translate(x, (DECK - 1.2) / 2, z);
        parts.push({ geometry: post, color: dark, sway: 0 });
      }
    }
    for (const z of [-WIDTH / 2 + 0.1, WIDTH / 2 - 0.1]) {
      const bearer = new THREE.BoxGeometry(length, 0.16, 0.12);
      bearer.translate(0, DECK - 0.1, z);
      parts.push({ geometry: bearer, color: dark, sway: 0 });
    }

    const pitch = 0.24;
    const count = Math.floor(length / pitch);
    for (let i = 0; i < count; i++) {
      const x = -half + pitch * (i + 0.5);
      const plank = new THREE.BoxGeometry(pitch - 0.025, 0.05, WIDTH + rng.around(0, 0.06));
      plank.translate(x, DECK, rng.around(0, 0.02));
      parts.push({ geometry: plank, color: shade(PALETTE.TIMBER_PALE, rng.range(0.85, 1.02)), sway: 0 });
    }

    // The rail, one side, on the posts' own uprights.
    const railZ = WIDTH / 2 - 0.1;
    const railH = DECK + 0.95;
    for (const x of [-half + 0.25, half - 0.25, 0]) {
      const upright = new THREE.BoxGeometry(0.09, railH - DECK, 0.09);
      upright.translate(x, (railH + DECK) / 2, railZ);
      parts.push({ geometry: upright, color: dark, sway: 0 });
    }
    const rail = new THREE.BoxGeometry(length, 0.08, 0.1);
    rail.translate(0, railH, railZ);
    parts.push({ geometry: rail, color: dark, sway: 0 });

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return finish(merged, 'footbridge', 0);
  },
};
