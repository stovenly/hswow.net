import * as THREE from 'three';
import type { BuildOptions, MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { lettering } from '../lettering';

/**
 * A standing sign: two posts, a planked board between them, and words on it.
 *
 * The first object in the kit that actually says something. The gallery's
 * `signPost` deliberately carries fake marks and puts its words in the
 * tooltip; this one carries real lettering out of `art/lettering`, sized so a
 * player reading it from conversational distance — two to four metres — gets
 * it without walking up. The tooltip layer is still there for anything
 * smaller; this is for text that belongs to the *world*.
 *
 * `text` rides in through the options, beyond the standard seed and scale.
 * The seed rolls the carpentry — post height, board proportions, timber
 * shades — and the text never varies with it, because what a sign says is
 * content, not carpentry. Multi-line is fine; the lettering fits itself to
 * the board either way.
 *
 * Built facing +Z, standing on y = 0. No random facing, for the panel's
 * reason: a sign faces where it is put.
 */

export interface SignboardOptions extends BuildOptions {
  /** What the board says. Placeholder by default; real signs pass their own. */
  text?: string;
}

export const signboard: MeshBuilder = {
  name: 'signboard',
  category: 'structures',
  radius: 1.0,

  build({ seed = 1, scale = 1, text = 'SIGNBOARD' }: SignboardOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const postH = rng.range(1.9, 2.2);
    const boardW = rng.range(1.3, 1.7);
    const boardH = rng.range(0.5, 0.64);
    const boardD = 0.05;
    // Top rail of the board just under the post caps.
    const boardTop = postH - 0.08;

    const postWood = shade(PALETTE.TIMBER_DARK, rng.range(0.9, 1.05));
    const post = (x: number): void => {
      const upright = new THREE.BoxGeometry(0.1, postH, 0.1);
      upright.translate(x, postH / 2, 0);
      parts.push({ geometry: upright, color: postWood, sway: 0 });
      // A cap, so the post does not end in a cut end.
      const cap = new THREE.BoxGeometry(0.15, 0.05, 0.15);
      cap.translate(x, postH + 0.02, 0);
      parts.push({ geometry: cap, color: shade(postWood, 0.9), sway: 0 });
    };
    post(-(boardW / 2 + 0.09));
    post(boardW / 2 + 0.09);

    // The board: horizontal planks, each its own slightly different timber —
    // one repeated colour reads as a textureless plane however it is lit.
    const planks = rng.int(3, 4);
    const plankH = boardH / planks;
    const boardMid = boardTop - boardH / 2;
    for (let i = 0; i < planks; i++) {
      const plank = new THREE.BoxGeometry(boardW, plankH - 0.006, boardD);
      plank.translate(0, boardTop - plankH * (i + 0.5), 0);
      parts.push({
        geometry: plank,
        color: shade(PALETTE.TIMBER_PALE, rng.range(0.92, 1.08)),
        sway: 0,
      });
    }

    // Rails top and bottom, proud of the planks, holding the board to the
    // posts. What stops the pale board reading as a floating rectangle.
    for (const y of [boardTop + 0.02, boardTop - boardH - 0.02]) {
      const rail = new THREE.BoxGeometry(boardW + 0.34, 0.07, boardD * 1.5);
      rail.translate(0, y, 0);
      parts.push({ geometry: rail, color: postWood, sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    const mesh = finish(geometry, 'signboard', 0);

    // The words, fitted to the board. Cap height splits the writable area
    // over the lines and then defers to the width fit, so one long word and
    // three short lines both come out sitting inside the planks.
    //
    // A child mesh rather than a part, and flagged `noCollide`: lettering is
    // thousands of small triangles in a hand-span of space, and merged into
    // the prop they would all be swept into the collider's octree — pressing
    // the capsule against a sign cost whole milliseconds a frame. The
    // carpentry stays solid; the ink is not made of anything. One extra draw
    // call per sign, which is what the street lamp already pays for its beam.
    const lines = text.split('\n').length;
    const written = lettering(text, {
      capHeight: (boardH * 0.72) / (1 + (lines - 1) * 1.5),
      fitWidth: boardW * 0.86,
      weight: 0.18,
      depth: 0.4,
    });
    // Proud of the front face. Coplanar would z-fight, and shallow relief is
    // what makes the letters read as painted onto the planks.
    written.geometry.translate(0, boardMid, boardD / 2 + 0.008);
    const inkGeometry = assemble([{ geometry: written.geometry, color: PALETTE.INK, sway: 0 }]);
    if (scale !== 1) inkGeometry.scale(scale, scale, scale);
    const inked = finish(inkGeometry, 'signboard', 0);
    inked.userData.noCollide = true;
    mesh.add(inked);

    return mesh;
  },
};
