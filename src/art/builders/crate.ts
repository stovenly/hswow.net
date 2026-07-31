import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * A wooden crate, bound with iron straps.
 *
 * A bare box is the most obviously untouched primitive in any engine. The
 * straps cost a dozen triangles and are most of what makes it read as a *made*
 * object — the eye looks for edges and joins, and giving it some is nearly all
 * that "detail" means at this polygon count.
 *
 * Sizes come in classes rather than from one continuous range. A uniform
 * spread produces a yard full of crates that are all slightly different and
 * all basically the same; a few distinct sizes with clear gaps between them
 * produce a yard where things have obviously been sorted, which is what a
 * yard looks like. The large ones also carry more binding, because they need
 * it — that coupling is free and it is the sort of thing that reads as sense
 * even when nobody could say why.
 */

const CLASSES = [
  { name: 'small', weight: 0.3, scale: [0.55, 0.75] as const },
  { name: 'ordinary', weight: 0.45, scale: [0.85, 1.15] as const },
  { name: 'large', weight: 0.18, scale: [1.5, 1.9] as const },
  { name: 'huge', weight: 0.07, scale: [2.1, 2.6] as const },
];

export const crate: MeshBuilder = {
  name: 'crate',
  category: 'objects',
  // Sized for the biggest class, so the gallery and prop placement leave room
  // for one even when most instances need a fraction of it.
  radius: 1.2,

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
    const bulk = rng.range(size.scale[0], size.scale[1]);

    const width = rng.range(0.5, 0.9) * bulk;
    const height = rng.range(0.45, 0.8) * bulk;
    const depth = rng.range(0.5, 0.9) * bulk;
    const turn = rng.around(0, 0.35);

    const body = new THREE.BoxGeometry(width, height, depth);
    body.translate(0, height / 2, 0);
    body.rotateY(turn);
    parts.push({ geometry: body, color: PALETTE.TIMBER, sway: 0 });

    // Horizontal bands. More of them on bigger boxes — one band around a crate
    // twice the size holds nothing.
    const bands = Math.max(2, Math.round(2 + bulk * 0.9 + (rng.chance(0.3) ? 1 : 0)));
    const bandHeight = 0.05 * Math.min(bulk, 1.5);
    const proud = 1.02;

    for (let i = 0; i < bands; i++) {
      // Spread between an eighth and seven eighths of the height, so bands sit
      // *on* the box rather than hanging off its corners.
      const at = height * (0.13 + (i / Math.max(bands - 1, 1)) * 0.74);
      const band = new THREE.BoxGeometry(width * proud, bandHeight, depth * proud);
      band.translate(0, at, 0);
      band.rotateY(turn);
      parts.push({ geometry: band, color: PALETTE.TIMBER_DARK, sway: 0 });
    }

    // Vertical straps down the corners, on the heavier crates. Iron rather
    // than timber: this is the binding, not the box.
    if (bulk > 1.2 || rng.chance(0.25)) {
      const strapWidth = 0.055 * Math.min(bulk, 1.6);
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          const strap = new THREE.BoxGeometry(strapWidth, height * 0.96, strapWidth);
          strap.translate(
            (sx * width) / 2,
            height * 0.48,
            (sz * depth) / 2,
          );
          strap.rotateY(turn);
          parts.push({ geometry: strap, color: PALETTE.RUST, sway: 0 });
        }
      }
    }

    // A lid, sometimes ajar.
    if (rng.chance(0.35)) {
      const lid = new THREE.BoxGeometry(width * 0.92, 0.05 * bulk, depth * 0.92);
      lid.translate(
        rng.around(0, 0.08 * bulk),
        height + 0.03 * bulk,
        rng.around(0, 0.08 * bulk),
      );
      lid.rotateY(turn + rng.around(0, 0.25));
      parts.push({ geometry: lid, color: PALETTE.TIMBER_DARK, sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'crate', 0);
  },
};
