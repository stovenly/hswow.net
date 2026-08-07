import * as THREE from 'three';
import type { BuildOptions, MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { sheet, STOCK, LEAF } from '../paper';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A sheet folded in three, with a seal on it.
 *
 * **The fold is what tells it from a note.** Both are one sheet of paper and
 * both are read the same way; what the player sees is that one was left out and
 * the other was sent. So the folds stand proud as ridges and the seal sits on
 * the middle panel — a red disc a centimetre across, which is the only spot of
 * that colour anywhere in the kit and finds the letter across a room on its own.
 *
 * The writing is on the underside, where a folded letter's writing is. It costs
 * nothing to draw and it means picking one up is the only way to see it, which
 * is the correct relationship between an object and what is written in it.
 */
export const foldedLetter: MeshBuilder = {
  name: 'folded-letter',
  category: 'objects',
  display: 'Folded Letter',
  radius: 0.11,
  solid: false,

  build({ seed = 1, scale = 1 }: BuildOptions = {}) {
    const rng = createRng(seed);
    const width = rng.range(0.09, 0.125);
    const length = width * rng.range(0.62, 0.78);
    const colour = rng.pick(STOCK);

    // Face down, so the marks are underneath. Turned before anything else is
    // put on top of it, or the seal would go under the paper.
    const parts: Part[] = sheet(width, length, rng, { colour, lines: rng.int(4, 7) });
    for (const part of parts) part.geometry.rotateZ(Math.PI);

    // The two folds, as ridges across the sheet rather than as separate panels.
    // A letter folded in three is one sheet with two creases in it, and three
    // stacked slabs would be three sheets.
    for (const at of [-length / 6, length / 6]) {
      const crease = new THREE.BoxGeometry(width * 0.99, LEAF * 2.4, length * 0.055);
      crease.translate(0, LEAF * 0.7, at + rng.around(0, length * 0.01));
      parts.push({ geometry: crease, color: shade(colour, 0.93), sway: 0 });
    }

    const seal = new THREE.CylinderGeometry(
      rng.range(0.008, 0.011),
      rng.range(0.009, 0.012),
      0.0028,
      6,
    );
    seal.translate(rng.around(0, width * 0.06), LEAF * 1.4, rng.around(0, length * 0.06));
    parts.push({ geometry: seal, color: shade(PALETTE.COMB, 0.85), sway: 0 });

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    geometry.translate(0, LEAF, 0);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'folded-letter', 0);
  },
};
