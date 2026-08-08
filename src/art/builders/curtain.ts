import * as THREE from 'three';
import type { BuildOptions, BuilderWith } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { ClothSim, type ClothCollider } from '../cloth';
import { clothPanel } from '../clothMesh';

/**
 * A curtain over a doorway: two jambs, a rod, and a drop of sheer cloth.
 *
 * The cloth hangs from the rod and drapes against its own frame — the jambs
 * are its colliders, so a draught moves it without ever pushing it through
 * the wood. Built facing +Z, the opening centred on the origin.
 */

export interface CurtainOptions extends BuildOptions {
  /** A `FABRICS` name. */
  fabric?: string;
}

export const curtain: BuilderWith<CurtainOptions> = {
  name: 'curtain',
  category: 'structures',
  radius: 0.9,

  build({ seed = 1, scale = 1, fabric = 'sheer' }: CurtainOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const width = rng.range(1.05, 1.2) * scale;
    const height = rng.range(2.0, 2.2) * scale;
    const jambW = 0.09 * scale;

    const wood = shade(PALETTE.TIMBER, rng.range(0.9, 1.04));
    for (const side of [-1, 1]) {
      const jamb = new THREE.BoxGeometry(jambW, height, jambW);
      jamb.translate(side * (width / 2), height / 2, 0);
      parts.push({ geometry: jamb, color: wood, sway: 0 });
    }
    const rod = new THREE.CylinderGeometry(0.022 * scale, 0.022 * scale, width + jambW, 6);
    rod.rotateZ(Math.PI / 2);
    rod.translate(0, height - 0.03 * scale, 0);
    parts.push({ geometry: rod, color: shade(PALETTE.TIMBER_DARK, 0.95), sway: 0 });

    const mesh = finish(assemble(parts), 'curtain', 0);

    // The drop fills the opening, pinned along the rod; it clears the floor by
    // a hand so the hem swings free instead of pooling. Its edges stop shy of
    // the jambs' keep-zone — authored inside it, the collision and edge
    // projections fight every substep, which reads as twitching.
    const clothW = width - 0.22 * scale;
    const clothTop = height - 0.06 * scale;
    const clothH = clothTop - 0.12 * scale;
    const COLS = 9;
    const ROWS = 14;
    const rest = new Float32Array(COLS * ROWS * 3);
    const pins: number[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        rest[i * 3] = -clothW / 2 + (c / (COLS - 1)) * clothW;
        rest[i * 3 + 1] = clothTop - (r / (ROWS - 1)) * clothH;
        rest[i * 3 + 2] = 0;
        if (r === 0) pins.push(i);
      }
    }
    const jambR = jambW * 0.75;
    const colliders: ClothCollider[] = [
      { kind: 'capsule', a: [-width / 2, 0, 0], b: [-width / 2, height, 0], radius: jambR },
      { kind: 'capsule', a: [width / 2, 0, 0], b: [width / 2, height, 0], radius: jambR },
      { kind: 'ground', y: 0 },
    ];
    const sim = new ClothSim({ cols: COLS, rows: ROWS, rest, pins, fabric, colliders, seed });
    sim.settle(24);

    const panel = clothPanel(sim, {
      name: 'curtain',
      color: shade(rng.pick([PALETTE.CLOTH, PALETTE.WOOL]), rng.range(0.92, 1.06)),
    });
    mesh.add(panel.mesh);

    return mesh;
  },
};
