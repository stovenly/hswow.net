import * as THREE from 'three';
import type { Part } from './assemble';
import type { Rng } from './random';
import { PALETTE } from './palette';

/**
 * Marks that read as writing without being any: a caption on a plank, a page of
 * prose in an open book — anything whose job is to say there are words here to
 * somebody not close enough to read one of them.
 *
 * The point is the invitation, not the illusion. It has to survive being walked
 * up to, so it must not resolve into fake glyphs; ragged word lengths on a ragged
 * right margin is as much as the trick will bear. Nor is it to scale: a real page
 * at 20 cm is forty lines of 2 mm type, which through this pipeline is a grey
 * rectangle, so the marks are coarser than the thing they stand for.
 *
 * Parts rather than meshes, so a page is one draw call. Written in the XY plane
 * about the origin, standing out along Z and straddling it, so a caller can lay
 * the block onto any face without caring which way the relief ended up pointing.
 */

export interface WritingStyle {
  /** Rows of marks. The caller decides; a block has to fit what it is on. */
  lines: number;
  /** Word length, as a fraction of the usable width. */
  word?: [number, number];
  /** Gap after a word, as a fraction of the usable width. */
  space?: [number, number];
  /** Mark height, as a fraction of the leading. Well under it, or three rows read as a barcode. */
  weight?: [number, number];
  /** Clear at each side, as a fraction of the width. */
  margin?: number;
  /** How thick a mark is through the surface it is written on. */
  relief?: number;
  color?: number;
}

export function writing(
  width: number,
  height: number,
  rng: Rng,
  style: WritingStyle,
): Part[] {
  const {
    lines,
    word: wordRange = [0.08, 0.26],
    space: spaceRange = [0.045, 0.09],
    weight = [0.3, 0.42],
    margin: margins = 0.1,
    relief = 0.008,
    color = PALETTE.INK,
  } = style;

  const parts: Part[] = [];
  const margin = width * margins;
  const usable = width - margin * 2;
  // Leading, not glyph height: the bar is thinner than the space it sits in,
  // which is what stops the rows reading as a barcode.
  const leading = height / (lines + 0.9);

  for (let line = 0; line < lines; line++) {
    const y = height / 2 - leading * (line + 0.95);
    // A ragged right margin. A line that fills the width every time reads as
    // justified type, which is far too tidy for anything hand-made.
    const fill = line === lines - 1 ? rng.range(0.4, 0.8) : rng.range(0.82, 1);
    let x = -usable / 2;
    const limit = -usable / 2 + usable * fill;

    while (x < limit) {
      const word = Math.min(rng.range(usable * wordRange[0], usable * wordRange[1]), limit - x);
      if (word < usable * 0.04) break;
      const bar = new THREE.BoxGeometry(word, leading * rng.range(weight[0], weight[1]), relief);
      bar.translate(x + word / 2, y, 0);
      parts.push({ geometry: bar, color, sway: 0 });
      x += word + usable * rng.range(spaceRange[0], spaceRange[1]);
    }
  }

  return parts;
}

/**
 * A stable seed for whatever the writing is standing in for. A given row's
 * scribble is the same on every load and two rows never share one, which makes
 * the marks landmarks — you learn where you are in a rank by their shape before
 * you can read a word. A cheap FNV hash: distinctness matters far more than
 * distribution.
 */
export function textSeed(name: string): number {
  let hash = 2166136261;
  for (let i = 0; i < name.length; i++) hash = Math.imul(hash ^ name.charCodeAt(i), 16777619);
  return hash >>> 0;
}
