import * as THREE from 'three';
import type { Part } from './assemble';
import type { Rng } from './random';
import { writing } from './writing';
import { PALETTE, shade } from './palette';

/**
 * Loose paper: what is written on that was never bound.
 *
 * A note, a letter and a scroll are one sheet at three sizes in three
 * attitudes, and the sheet is the only part any of them share — so this holds
 * the sheet and the marks on it, and each builder holds its own attitude. That
 * is the opposite split from `art/book.ts`, where the *construction* is shared
 * and the covers are tables, and it is the right way round for the same reason:
 * there is almost nothing to a sheet of paper, and almost everything to how it
 * has been left lying.
 *
 * Sheets are built flat in the XZ plane about the origin, face up, so a builder
 * that wants one standing or rolled turns it afterwards.
 */

/** Paper, and what it goes when it has been somewhere. */
export const STOCK = [
  PALETTE.WOOL,
  shade(PALETTE.WOOL, 0.94),
  shade(PALETTE.CLOTH, 1.14),
  shade(PALETTE.HIDE_PALE, 1.16),
] as const;

/** How thick a sheet is. Well over a real one, and under anything visible. */
export const LEAF = 0.0009;

/**
 * A flat sheet with illegible marks on it.
 *
 * The marks straddle the surface rather than sitting on it, so a caller may
 * turn the sheet any way up without the writing ending up inside it.
 */
export function sheet(
  width: number,
  length: number,
  rng: Rng,
  options: { colour?: number; margin?: number; lines?: number } = {},
): Part[] {
  const colour = options.colour ?? rng.pick(STOCK);
  const margin = options.margin ?? 0.82;
  const parts: Part[] = [];

  const leaf = new THREE.BoxGeometry(width, LEAF, length);
  parts.push({ geometry: leaf, color: colour, sway: 0 });

  const block = length * margin;
  const type = writing(width * margin, block, rng, {
    lines: options.lines ?? Math.max(4, Math.round(block / 0.017)),
    word: [0.06, 0.22],
    relief: 0.0006,
  });
  for (const mark of type) {
    // Written in its own plane and laid onto the sheet, the way a page of a
    // book is — see `art/book.ts`, which does the same turn for the same reason.
    mark.geometry.rotateX(Math.PI / 2);
    mark.geometry.translate(0, LEAF / 2, 0);
    parts.push(mark);
  }

  return parts;
}
