import * as THREE from 'three';
import type { BuildOptions, BuilderWith } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { ClothSim, type ClothCollider } from '../cloth';
import { clothPanel } from '../clothMesh';

/**
 * A tall banner hanging from a bracket arm on a post.
 *
 * The vertical sibling of the strung banner: one post, one arm, and a long
 * drop of simulated cloth pinned along its top edge. Canvas by default, so it
 * hangs heavy and answers a gust as one surface. Built with the arm reaching
 * +X, standing on y = 0.
 */

export interface HangingBannerOptions extends BuildOptions {
  /** A `FABRICS` name. */
  fabric?: string;
}

export const hangingBanner: BuilderWith<HangingBannerOptions> = {
  name: 'hanging-banner',
  category: 'structures',
  radius: 0.9,

  build({ seed = 1, scale = 1, fabric = 'canvas' }: HangingBannerOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const postH = rng.range(3.0, 3.4) * scale;
    const armL = rng.range(0.85, 1.05) * scale;
    const armY = postH - 0.06 * scale;

    const wood = shade(PALETTE.TIMBER_DARK, rng.range(0.88, 1.02));
    const post = new THREE.CylinderGeometry(0.04 * scale, 0.055 * scale, postH, 8);
    post.translate(0, postH / 2, 0);
    parts.push({ geometry: post, color: wood, sway: 0 });

    const arm = new THREE.CylinderGeometry(0.03 * scale, 0.03 * scale, armL, 6);
    arm.rotateZ(Math.PI / 2);
    arm.translate(armL / 2, armY, 0);
    parts.push({ geometry: arm, color: shade(wood, 0.92), sway: 0 });

    const cap = new THREE.ConeGeometry(0.06 * scale, 0.1 * scale, 8);
    cap.translate(0, postH + 0.04 * scale, 0);
    parts.push({ geometry: cap, color: shade(wood, 0.9), sway: 0 });

    const mesh = finish(assemble(parts), 'hanging-banner', 0);

    // The drop: pinned along the arm, the post and the arm as colliders so a
    // gust cannot blow the cloth through its own mount.
    const clothW = armL - 0.18 * scale;
    const clothH = rng.range(1.7, 2.0) * scale;
    const clothTop = armY - 0.04 * scale;
    const x0 = 0.12 * scale;
    const COLS = 8;
    const ROWS = 16;
    const rest = new Float32Array(COLS * ROWS * 3);
    const pins: number[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        rest[i * 3] = x0 + (c / (COLS - 1)) * clothW;
        rest[i * 3 + 1] = clothTop - (r / (ROWS - 1)) * clothH;
        rest[i * 3 + 2] = 0;
        if (r === 0) pins.push(i);
      }
    }
    const colliders: ClothCollider[] = [
      { kind: 'capsule', a: [0, 0, 0], b: [0, postH, 0], radius: 0.055 * scale },
      { kind: 'capsule', a: [0, armY, 0], b: [armL, armY, 0], radius: 0.03 * scale },
      { kind: 'ground', y: 0 },
    ];
    const sim = new ClothSim({ cols: COLS, rows: ROWS, rest, pins, fabric, colliders, seed });
    sim.settle(24);

    const panel = clothPanel(sim, {
      name: 'hanging-banner',
      color: shade(rng.pick([PALETTE.CLOTH, PALETTE.RUST]), rng.range(0.92, 1.06)),
    });
    mesh.add(panel.mesh);

    return mesh;
  },
};
