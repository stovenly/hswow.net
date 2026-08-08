import * as THREE from 'three';
import type { BuildOptions, BuilderWith } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { lettering } from '../lettering';
import { ClothSim, type ClothCollider } from '../cloth';
import { clothPanel, skinToCloth } from '../clothMesh';

/**
 * A cloth banner slung between two poles, with words across it.
 *
 * The signboard's loud sibling: where a sign is read from beside it, a banner
 * is read from down the street — strung overhead, big letters, few words. The
 * broadcast register, and the reason the default cap height here is nearly
 * twice the signboard's.
 *
 * The cloth is simulated — CLOTH.md, and this was its first prop. The panel
 * is pinned along the rope and pre-draped at build; the lettering is skinned
 * to the grid, so the words bend *with* the fold they sit on rather than
 * hanging still in front of it. The sway attribute is zero throughout: the
 * wind shader leaves cloth alone, and there is no double displacement.
 *
 * Built facing +Z, standing on y = 0, poles on ±X.
 */

export interface BannerOptions extends BuildOptions {
  /** What the banner says. Best kept to a few words — it is read at range. */
  text?: string;
  /** A `FABRICS` name. Canvas: a banner leans and bellies as one surface. */
  fabric?: string;
}

export const banner: BuilderWith<BannerOptions> = {
  name: 'banner',
  category: 'structures',
  radius: 1.6,

  build({ seed = 1, scale = 1, text = 'BANNER', fabric = 'canvas' }: BannerOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Dimensions carry the scale so the sim, the skin and the colliders agree.
    const poleH = rng.range(2.6, 3.0) * scale;
    const span = rng.range(2.4, 2.9) * scale;
    const clothW = span - 0.22 * scale;
    const clothH = rng.range(0.6, 0.78) * scale;
    const clothTop = poleH - 0.12 * scale;

    const wood = shade(PALETTE.TIMBER_DARK, rng.range(0.88, 1.02));
    for (const side of [-1, 1]) {
      const pole = new THREE.CylinderGeometry(0.035 * scale, 0.05 * scale, poleH, 8);
      pole.translate(side * (span / 2), poleH / 2, 0);
      parts.push({ geometry: pole, color: wood, sway: 0 });
      // A finial, so the pole does not end in a cut end.
      const top = new THREE.ConeGeometry(0.055 * scale, 0.09 * scale, 8);
      top.translate(side * (span / 2), poleH + 0.04 * scale, 0);
      parts.push({ geometry: top, color: shade(wood, 0.9), sway: 0 });
    }

    // The rope the cloth hangs from. Rigid — it is under tension, and a rope
    // that waves while its cloth waves reads as everything being underwater.
    const rope = new THREE.CylinderGeometry(0.012 * scale, 0.012 * scale, span, 6);
    rope.rotateZ(Math.PI / 2);
    rope.translate(0, clothTop + 0.01 * scale, 0);
    parts.push({ geometry: rope, color: shade(PALETTE.TIMBER_PALE, 0.85), sway: 0 });

    const mesh = finish(assemble(parts), 'banner', 0);

    // The cloth: a 13×9 grid pinned along its top row, the poles and the
    // ground as colliders, pre-draped so it is never seen falling into place.
    const COLS = 13;
    const ROWS = 9;
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
    const colliders: ClothCollider[] = [
      { kind: 'capsule', a: [-span / 2, 0, 0], b: [-span / 2, poleH, 0], radius: 0.05 * scale },
      { kind: 'capsule', a: [span / 2, 0, 0], b: [span / 2, poleH, 0], radius: 0.05 * scale },
      { kind: 'ground', y: 0 },
    ];
    const sim = new ClothSim({ cols: COLS, rows: ROWS, rest, pins, fabric, colliders, seed });
    sim.settle(24);

    const panel = clothPanel(sim, {
      name: 'banner',
      color: shade(PALETTE.CLOTH, rng.range(0.94, 1.06)),
    });
    mesh.add(panel.mesh);

    // The words, heavy and few, skinned to the fabric. A child mesh flagged
    // `noCollide`: lettering triangles do not belong in the collider's octree.
    const written = lettering(text, {
      capHeight: clothH * 0.52,
      fitWidth: clothW * 0.86,
      weight: 0.22,
      depth: 0.5,
    });
    written.geometry.translate(0, clothTop - clothH / 2, 0.02 * scale);
    const inked = finish(
      assemble([{ geometry: written.geometry, color: PALETTE.INK, sway: 0 }]),
      'banner',
      0,
    );
    inked.userData.noCollide = true;
    mesh.add(inked);
    skinToCloth(inked, panel, (x, y, z) => [
      (x + clothW / 2) / clothW,
      (clothTop - y) / clothH,
      z,
    ]);

    return mesh;
  },
};
