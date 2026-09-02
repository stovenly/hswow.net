import * as THREE from 'three';
import type { BuildOptions, MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { lettering } from '../lettering';
import type { Fields } from '../schema';

// A fingerpost: one post, and an arm for every line of `text`, each pointing its
// own way and lettered on one face. The arms are spaced evenly round the post,
// the first along +Z, so the placer's yaw aims the first and the rest follow —
// unless a line ends `@<degrees>`, which aims that arm itself, from +Z toward +X.

export interface FingerpostOptions extends BuildOptions {
  /** One name a line, one arm a name; `Beach @120` aims the arm. */
  text?: string;
}

const ARM_LENGTH = 0.95;
const ARM_HEIGHT = 0.2;

export const fingerpost: MeshBuilder = {
  name: 'fingerpost',
  category: 'structures',
  options: { text: { type: 'string' } } satisfies Fields,
  radius: 1,

  build({ seed = 1, scale = 1, text = 'THIS WAY\nTHAT WAY' }: FingerpostOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const wood = shade(PALETTE.TIMBER_DARK, rng.range(0.9, 1.05));
    const height = rng.range(2.3, 2.6);

    const post = new THREE.BoxGeometry(0.13, height, 0.13);
    post.translate(0, height / 2, 0);
    parts.push({ geometry: post, color: wood, sway: 0 });
    const cap = new THREE.ConeGeometry(0.13, 0.16, 4);
    cap.rotateY(Math.PI / 4);
    cap.translate(0, height + 0.08, 0);
    parts.push({ geometry: cap, color: shade(wood, 0.9), sway: 0 });

    const names = text
      .split('\n')
      .map((line) => /^(.*?)\s*(?:@\s*(-?\d+(?:\.\d+)?))?\s*$/.exec(line) as RegExpExecArray)
      .map(([, name, degrees]) => ({ name, bearing: degrees === undefined ? undefined : (Number(degrees) * Math.PI) / 180 }))
      .filter(({ name }) => name.trim().length > 0);
    const inks: THREE.BufferGeometry[] = [];
    names.forEach(({ name, bearing }, i) => {
      const yaw = bearing ?? (i / names.length) * Math.PI * 2;
      const y = height - 0.35 - i * (ARM_HEIGHT + 0.08);
      // The arm, along +Z from the post, cut to a point.
      const arm = new THREE.BoxGeometry(0.04, ARM_HEIGHT, ARM_LENGTH);
      const position = arm.getAttribute('position');
      for (let k = 0; k < position.count; k++) {
        if (position.getZ(k) > 0) position.setY(k, position.getY(k) * 0.45);
      }
      arm.translate(0, y, ARM_LENGTH / 2 + 0.04);
      const ink = lettering(name.trim().toUpperCase(), {
        capHeight: ARM_HEIGHT * 0.5,
        fitWidth: ARM_LENGTH * 0.62,
        weight: 0.2,
        depth: 0.4,
      }).geometry;
      // Lettering faces +Z; turned to face +X, the arm's readable side, and stood proud of it.
      ink.rotateY(Math.PI / 2);
      ink.translate(0.028, y + 0.01, ARM_LENGTH * 0.42 + 0.04);
      // rotateY(yaw) takes +Z to this arm's own direction.
      arm.rotateY(yaw);
      ink.rotateY(yaw);
      parts.push({ geometry: arm, color: shade(PALETTE.TIMBER_PALE, rng.range(0.92, 1.04)), sway: 0 });
      inks.push(ink);
    });

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    const mesh = finish(merged, 'fingerpost', 0);

    if (inks.length > 0) {
      const inkGeometry = assemble(inks.map((geometry) => ({ geometry, color: PALETTE.INK, sway: 0 })));
      if (scale !== 1) inkGeometry.scale(scale, scale, scale);
      const inked = finish(inkGeometry, 'fingerpost', 0);
      inked.userData.noCollide = true;
      mesh.add(inked);
    }
    return mesh;
  },
};
