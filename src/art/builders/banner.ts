import * as THREE from 'three';
import type { BuildOptions, MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { lettering } from '../lettering';

/**
 * A cloth banner slung between two poles, with words across it.
 *
 * The signboard's loud sibling: where a sign is read from beside it, a banner
 * is read from down the street — strung overhead, big letters, few words. The
 * broadcast register, and the reason the default cap height here is nearly
 * twice the signboard's.
 *
 * The cloth moves. Its sway weights pin the pole edges and the top rope and
 * free the belly and hem, and the lettering carries the *same* weights at the
 * same positions — the wind shader displaces by position, so letters and
 * cloth agree and the words ride the fabric rather than hanging still in
 * front of it. `FLEX` says how far; see the `banner` entry there.
 *
 * Built facing +Z, standing on y = 0, poles on ±X.
 */

export interface BannerOptions extends BuildOptions {
  /** What the banner says. Best kept to a few words — it is read at range. */
  text?: string;
}

export const banner: MeshBuilder = {
  name: 'banner',
  category: 'structures',
  radius: 1.6,

  build({ seed = 1, scale = 1, text = 'BANNER' }: BannerOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const poleH = rng.range(2.6, 3.0);
    const span = rng.range(2.4, 2.9);
    const clothW = span - 0.22;
    const clothH = rng.range(0.6, 0.78);
    const clothTop = poleH - 0.12;

    // How the cloth hangs: fixed at both poles and along the rope, loose in
    // the belly and along the hem. Shared verbatim with the lettering, which
    // is what keeps the words on the fabric while it moves.
    const hang = (x: number, y: number): number => {
      const across = 1 - Math.min(Math.abs(x) / (clothW / 2), 1);
      const down = Math.min(Math.max((clothTop - y) / clothH, 0), 1);
      return across * (0.25 + 0.75 * down);
    };

    const wood = shade(PALETTE.TIMBER_DARK, rng.range(0.88, 1.02));
    for (const side of [-1, 1]) {
      const pole = new THREE.CylinderGeometry(0.035, 0.05, poleH, 8);
      pole.translate(side * (span / 2), poleH / 2, 0);
      parts.push({ geometry: pole, color: wood, sway: 0 });
      // A finial, so the pole does not end in a cut end.
      const top = new THREE.ConeGeometry(0.055, 0.09, 8);
      top.translate(side * (span / 2), poleH + 0.04, 0);
      parts.push({ geometry: top, color: shade(wood, 0.9), sway: 0 });
    }

    // The rope the cloth hangs from. Rigid — it is under tension, and a rope
    // that waves while its cloth waves reads as everything being underwater.
    const rope = new THREE.CylinderGeometry(0.012, 0.012, span, 6);
    rope.rotateZ(Math.PI / 2);
    rope.translate(0, clothTop + 0.01, 0);
    parts.push({ geometry: rope, color: shade(PALETTE.TIMBER_PALE, 0.85), sway: 0 });

    // The cloth. Segmented well past what its silhouette needs, because the
    // wind shader bends per vertex — a two-triangle sheet cannot billow.
    const cloth = new THREE.BoxGeometry(clothW, clothH, 0.02, 10, 5, 1);
    cloth.translate(0, clothTop - clothH / 2, 0);
    parts.push({
      geometry: cloth,
      color: shade(PALETTE.CLOTH, rng.range(0.94, 1.06)),
      sway: (x, y) => hang(x, y),
    });

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    const mesh = finish(geometry, 'banner', 0);

    // The words, heavy and few. Weight up at the top of the range: thin
    // strokes on a moving ground lose more to the pipeline than thin strokes
    // on a board, and a banner's whole job is to be read at range.
    //
    // A child mesh flagged `noCollide`, for the signboard's reason: lettering
    // triangles do not belong in the collider's octree. Finished under the
    // banner's own name so `FLEX` scales its sway exactly as it scales the
    // cloth's — the two bake the same weights at the same positions, and a
    // mismatched flex would peel the words off the fabric in any wind.
    const written = lettering(text, {
      capHeight: clothH * 0.52,
      fitWidth: clothW * 0.86,
      weight: 0.22,
      depth: 0.5,
    });
    written.geometry.translate(0, clothTop - clothH / 2, 0.02);
    const inkGeometry = assemble([
      { geometry: written.geometry, color: PALETTE.INK, sway: (x, y) => hang(x, y) },
    ]);
    if (scale !== 1) inkGeometry.scale(scale, scale, scale);
    const inked = finish(inkGeometry, 'banner', 0);
    inked.userData.noCollide = true;
    mesh.add(inked);

    return mesh;
  },
};
