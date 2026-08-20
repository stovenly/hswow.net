import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A table. Sizes come in classes rather than one continuous range, as crates do:
// a side table, an ordinary table, and a long one. The top is boards rather than a
// slab — the eye reads the seams as construction. Trestle or legged is the other
// axis, and the two are completely different silhouettes.

const CLASSES = [
  { weight: 0.28, width: [0.7, 1.0] as const, depth: [0.5, 0.68] as const },
  { weight: 0.47, width: [1.2, 1.7] as const, depth: [0.7, 0.95] as const },
  { weight: 0.25, width: [2.1, 3.0] as const, depth: [0.85, 1.1] as const },
];

export const table: MeshBuilder = {
  name: 'table',
  category: 'furniture',
  // Sized for the long class, so placement leaves room for one even though
  // most instances need a fraction of it.
  radius: 1.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    let roll = rng();
    let size = CLASSES[1];
    for (const entry of CLASSES) {
      roll -= entry.weight;
      if (roll <= 0) {
        size = entry;
        break;
      }
    }

    const width = rng.range(size.width[0], size.width[1]);
    const depth = rng.range(size.depth[0], size.depth[1]);
    const height = rng.range(0.68, 0.78);
    const topThickness = rng.range(0.045, 0.07);
    // A trestle only makes sense once there is a span to hold up.
    const trestle = width > 1.5 && rng.chance(0.45);

    const timber = rng.chance(0.6) ? PALETTE.TIMBER : PALETTE.TIMBER_DARK;
    const frame = timber === PALETTE.TIMBER ? PALETTE.TIMBER_DARK : PALETTE.TIMBER;

    // --- top: boards along the length --------------------------------------
    const boards = rng.int(3, 5);
    const boardDepth = depth / boards;
    const gap = 0.008;
    for (let i = 0; i < boards; i++) {
      const board = new THREE.BoxGeometry(
        width,
        topThickness * rng.range(0.93, 1),
        boardDepth - gap,
      );
      board.translate(0, height - topThickness / 2, -depth / 2 + (i + 0.5) * boardDepth);
      parts.push({ geometry: board, color: shade(timber, rng.around(1, 0.07)), sway: 0 });
    }

    const legHeight = height - topThickness;

    /**
     * Where anything standing under the top actually stops — not `legHeight`, which
     * is where the underside of the top is: a leg ending exactly there puts its top
     * cap in the same plane as the board above it. The boards make it worse, each
     * rolled between 93% and 100% of nominal, so a leg can also hang short. Running
     * everything a little way into the top is inside every board however it rolled.
     */
    const legTop = height - topThickness * 0.6;

    if (trestle) {
      // Two end frames: a foot on the floor, a post, and a cross-piece under
      // the top. Set in from the ends so the top overhangs them, which is what
      // makes a trestle look like one.
      const inset = width * rng.range(0.16, 0.24);
      for (const sx of [-1, 1]) {
        const x = sx * (width / 2 - inset);

        const foot = new THREE.BoxGeometry(0.09, 0.07, depth * 0.86);
        foot.translate(x, 0.035, 0);
        parts.push({ geometry: foot, color: frame, sway: 0 });

        const postWidth = rng.range(0.09, 0.13);
        const upright = new THREE.BoxGeometry(postWidth, legHeight - 0.07, depth * 0.2);
        upright.translate(x, 0.07 + (legHeight - 0.07) / 2, 0);
        parts.push({ geometry: upright, color: frame, sway: 0 });

        const cap = new THREE.BoxGeometry(0.09, 0.06, depth * 0.8);
        cap.translate(x, legTop - 0.03, 0);
        parts.push({ geometry: cap, color: frame, sway: 0 });
      }

      // The stretcher beam joining them — the defining member.
      const beam = new THREE.BoxGeometry(width - inset * 1.2, 0.07, 0.07);
      beam.translate(0, legHeight * rng.range(0.32, 0.42), 0);
      parts.push({ geometry: beam, color: frame, sway: 0 });
    } else {
      const legThickness = rng.range(0.055, 0.085);
      const halfW = width / 2 - legThickness * 0.9;
      const halfD = depth / 2 - legThickness * 0.9;

      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          const leg = new THREE.BoxGeometry(legThickness, legTop, legThickness);
          leg.translate(sx * halfW, legTop / 2, sz * halfD);
          parts.push({ geometry: leg, color: frame, sway: 0 });
        }
      }

      // An apron under the top, tying the legs together. Without it the legs
      // meet the underside of the boards at a point and the table looks like
      // it would fold up.
      if (rng.chance(0.7)) {
        const apron = 0.07;
        for (const sz of [-1, 1]) {
          const rail = new THREE.BoxGeometry(halfW * 2, apron, 0.03);
          rail.translate(0, legHeight - apron / 2 - 0.02, sz * halfD);
          parts.push({ geometry: rail, color: frame, sway: 0 });
        }
        for (const sx of [-1, 1]) {
          const rail = new THREE.BoxGeometry(0.03, apron, halfD * 2);
          rail.translate(sx * halfW, legHeight - apron / 2 - 0.02, 0);
          parts.push({ geometry: rail, color: frame, sway: 0 });
        }
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'table', 0);
  },
};
