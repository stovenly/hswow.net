import * as THREE from 'three';
import type { BuildOptions, BuilderWith } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { ClothSim, type ClothCollider } from '../cloth';
import { clothPanel } from '../clothMesh';
import type { Fields } from '../schema';

// A flag on a pole: sheer fabric pinned along its hoist, so it streams in wind,
// seeks alignment and flutters about it — the flutter emerging from the dynamics
// rather than from an authored sine. Built with the fly reaching +X, on y = 0.

export interface FlagOptions extends BuildOptions {
  /** A `FABRICS` name. */
  fabric?: string;
}

export const flag: BuilderWith<FlagOptions> = {
  name: 'flag',
  category: 'structures',
  options: { fabric: { type: 'string' } } satisfies Fields,
  radius: 0.8,

  build({ seed = 1, scale = 1, fabric = 'sheer' }: FlagOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const poleH = rng.range(3.8, 4.4) * scale;
    const poleR = 0.045 * scale;

    const wood = shade(PALETTE.TIMBER_PALE, rng.range(0.9, 1.04));
    const pole = new THREE.CylinderGeometry(0.03 * scale, poleR, poleH, 8);
    pole.translate(0, poleH / 2, 0);
    parts.push({ geometry: pole, color: wood, sway: 0 });

    const knop = new THREE.IcosahedronGeometry(0.06 * scale, 0);
    knop.translate(0, poleH + 0.03 * scale, 0);
    parts.push({ geometry: knop, color: shade(wood, 0.88), sway: 0 });

    const mesh = finish(assemble(parts), 'flag', 0);

    // The cloth: pinned down its hoist edge against the pole, free at the fly.
    const clothH = rng.range(0.7, 0.9) * scale;
    const clothW = clothH * rng.range(1.5, 1.7);
    const clothTop = poleH - 0.1 * scale;
    const x0 = 0.055 * scale;
    const COLS = 12;
    const ROWS = 8;
    const rest = new Float32Array(COLS * ROWS * 3);
    const pins: number[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        rest[i * 3] = x0 + (c / (COLS - 1)) * clothW;
        rest[i * 3 + 1] = clothTop - (r / (ROWS - 1)) * clothH;
        rest[i * 3 + 2] = 0;
        if (c === 0) pins.push(i);
      }
    }
    const colliders: ClothCollider[] = [
      { kind: 'capsule', a: [0, 0, 0], b: [0, poleH, 0], radius: poleR },
      { kind: 'ground', y: 0 },
    ];
    const sim = new ClothSim({ cols: COLS, rows: ROWS, rest, pins, fabric, colliders, seed });
    sim.settle(24);

    const panel = clothPanel(sim, {
      name: 'flag',
      color: shade(rng.pick([PALETTE.CLOTH, PALETTE.RUST, PALETTE.MARKER_YELLOW]), rng.range(0.92, 1.06)),
    });
    mesh.add(panel.mesh);

    return mesh;
  },
};
