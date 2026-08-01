import * as THREE from 'three';
import { assemble, finish, type Part } from '../art/assemble';
import { createRng } from '../art/random';
import { PALETTE, shade } from '../art/palette';

/**
 * The shell of an interior: floor, four walls, a ceiling.
 *
 * Built as one merged geometry with vertex colours, exactly like everything the
 * art kit makes, so an interior costs one draw call and one collider subtree
 * however big it is.
 *
 * **The shell is sealed and has no doorway in it.** Cutting an opening would
 * mean constructive solid geometry, and there is nothing to see through it
 * anyway: an interior is its own zone, so the far side of that wall is not the
 * outside of the building, it is nothing at all. Portal doors stand against the
 * wall and bring their own frame and their own dark backing panel, which reads
 * as a doorway at every distance you can be from it in a room this size.
 *
 * Sealing matters beyond looks. The zone check fires rays out of the middle of
 * every interior in a few hundred directions and fails if any of them escapes,
 * because a gap is a place the player can fall through into a black void with
 * no floor and no way back. Walls therefore overlap at the corners rather than
 * meeting at them — each one spans the room's full outer extent on its long
 * axis, so a corner is two boxes intersecting rather than two boxes abutting,
 * and no rounding error can open a seam between them.
 */

export interface InteriorStyle {
  floor: number;
  floorSeam: number;
  wall: number;
  wallTrim: number;
  ceiling: number;
  beam: number;
}

/** Timber and plaster. A dwelling. */
export const HOUSE_STYLE: InteriorStyle = {
  floor: PALETTE.TIMBER,
  floorSeam: 0x14110d,
  wall: PALETTE.CLOTH,
  wallTrim: PALETTE.TIMBER_DARK,
  ceiling: PALETTE.TIMBER_DARK,
  beam: PALETTE.BARK,
};

/** Soot, iron and stone. A workplace. */
export const WORKS_STYLE: InteriorStyle = {
  floor: PALETTE.STONE_DARK,
  floorSeam: 0x0e1012,
  wall: PALETTE.STONE,
  wallTrim: PALETTE.IRON,
  // Not near-black, which it was. A works has a high roof and nothing on it, so
  // the ceiling is a large unbroken plane — and a large unbroken plane at
  // 0x1c1f22 is below the bottom quantization level everywhere at once, which
  // is not "dark" but *absent*: a void where the roof should be, with the walls
  // stopping in mid-air. Lit sootty steel rather than shadow.
  ceiling: 0x3d444a,
  beam: PALETTE.RUST,
};

export interface InteriorOptions {
  width: number;
  depth: number;
  height: number;
  seed?: number;
  style?: InteriorStyle;
  /** Boards across the floor. Off for a stone or earth floor. */
  planks?: boolean;
  /** Beams across the ceiling, and how many. 0 for none. */
  beams?: number;
  /** Wall thickness. Also how far the shell extends beyond the inner volume. */
  thickness?: number;
}

/**
 * Builds an interior shell centred on the origin, floor at y = 0.
 *
 * Centred rather than cornered because a portal door is placed against a wall
 * by measuring out from the middle, and half-extents are the numbers that makes
 * readable at the call site: `width / 2` is the wall, not `width` minus a
 * thickness you have to remember the sign of.
 */
export function buildInterior(options: InteriorOptions): THREE.Mesh {
  const {
    width,
    depth,
    height,
    seed = 1,
    style = HOUSE_STYLE,
    planks = true,
    beams = 3,
    thickness = 0.35,
  } = options;

  const rng = createRng(seed);
  const parts: Part[] = [];
  const t = thickness;
  // Every wall spans this on its long axis, so corners overlap.
  const outerX = width + t * 2;
  const outerZ = depth + t * 2;

  // --- shell --------------------------------------------------------------
  // With boards on top, the slab is dropped a few millimetres.
  //
  // **This is the z-fighting fix.** Both surfaces were at exactly y = 0, so
  // across the whole floor the depth buffer had two coplanar faces to choose
  // between and picked differently from one pixel and one camera angle to the
  // next — which reads as the floor crawling. Dropping the slab below the
  // boards means the boards simply win everywhere, and the gaps between them
  // still show the dark slab because the gaps have no board over them at all.
  const slabTop = planks ? -0.006 : 0;
  const floor = new THREE.BoxGeometry(outerX, t, outerZ);
  floor.translate(0, slabTop - t / 2, 0);
  parts.push({ geometry: floor, color: planks ? style.floorSeam : style.floor, sway: 0 });

  const ceiling = new THREE.BoxGeometry(outerX, t, outerZ);
  ceiling.translate(0, height + t / 2, 0);
  parts.push({ geometry: ceiling, color: style.ceiling, sway: 0 });

  for (const sz of [-1, 1]) {
    const wall = new THREE.BoxGeometry(outerX, height, t);
    wall.translate(0, height / 2, (sz * (depth + t)) / 2);
    parts.push({ geometry: wall, color: style.wall, sway: 0 });
  }
  for (const sx of [-1, 1]) {
    const wall = new THREE.BoxGeometry(t, height, outerZ);
    wall.translate((sx * (width + t)) / 2, height / 2, 0);
    parts.push({ geometry: wall, color: style.wall, sway: 0 });
  }

  // --- floor boards -------------------------------------------------------
  // Laid *into* the slab rather than on top of it: each board's top face is
  // exactly y = 0, so the walkable height is the same whether or not boards
  // are switched on, and the gaps between them show the dark slab underneath
  // as seams instead of opening holes in the floor.
  if (planks) {
    const boardWidth = rng.range(0.24, 0.34);
    const count = Math.ceil(width / boardWidth);
    const gap = 0.012;
    for (let i = 0; i < count; i++) {
      const x = -width / 2 + (i + 0.5) * boardWidth;
      const board = new THREE.BoxGeometry(boardWidth - gap, 0.03, depth);
      board.translate(x, -0.015, 0);
      // Every board a slightly different timber. A floor of one colour is the
      // fastest way to make a room look like a render of a room.
      parts.push({ geometry: board, color: shade(style.floor, rng.around(1, 0.09)), sway: 0 });
    }
  }

  // --- ceiling beams ------------------------------------------------------
  if (beams > 0) {
    const drop = rng.range(0.16, 0.24);
    for (let i = 0; i < beams; i++) {
      const z = -depth / 2 + ((i + 0.5) / beams) * depth;
      const beam = new THREE.BoxGeometry(outerX, drop, rng.range(0.18, 0.26));
      beam.translate(0, height - drop / 2, z);
      parts.push({ geometry: beam, color: style.beam, sway: 0 });
    }
  }

  // --- skirting -----------------------------------------------------------
  // A band where the wall meets the floor. It is a strip of trim and it does
  // more for an interior than anything else this cheap: without it the wall
  // and floor meet in a single hard line and the room reads as a texture-less
  // box, which is exactly what it is.
  const skirt = 0.16;
  for (const sz of [-1, 1]) {
    const trim = new THREE.BoxGeometry(width, skirt, 0.06);
    trim.translate(0, skirt / 2, (sz * (depth - 0.06)) / 2);
    parts.push({ geometry: trim, color: style.wallTrim, sway: 0 });
  }
  for (const sx of [-1, 1]) {
    const trim = new THREE.BoxGeometry(0.06, skirt, depth);
    trim.translate((sx * (width - 0.06)) / 2, skirt / 2, 0);
    parts.push({ geometry: trim, color: style.wallTrim, sway: 0 });
  }

  return finish(assemble(parts), 'interior', 0);
}
