import * as THREE from 'three';
import { assemble, finish, type Part } from '../art/assemble';
import { createRng } from '../art/random';
import { PALETTE, shade } from '../art/palette';

/**
 * The shell of an interior: floor, four walls, a ceiling, as one merged geometry
 * with vertex colours — one draw call and one collider subtree however big it is.
 *
 * The shell is sealed and has no doorway in it. Cutting an opening would mean
 * constructive solid geometry, and there is nothing to see through it anyway: an
 * interior is its own zone, so the far side of that wall is nothing at all. Portal
 * doors stand against the wall and bring their own frame and dark backing panel.
 *
 * Walls overlap at the corners rather than meeting at them — each spans the room's
 * full outer extent on its long axis — so a corner is two boxes intersecting and
 * no rounding error can open a seam a player could fall through.
 */

export interface InteriorStyle {
  floor: number;
  /** The slab under the boards, which shows only in the margin beneath the walls. It no longer colours a seam: the boards tile edge to edge. */
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
  // Not near-black. A works has a high roof and nothing on it, so the ceiling is a
  // large unbroken plane — and one below the bottom quantization level everywhere at
  // once is not dark but absent, a void with the walls stopping in mid-air.
  ceiling: 0x3d444a,
  beam: PALETTE.RUST,
};

const styles = new Map<string, InteriorStyle>([
  ['house', HOUSE_STYLE],
  ['works', WORKS_STYLE],
]);

/** Names a document's `shell.style` can point at. Presets stay code. */
export function registerInteriorStyle(name: string, style: InteriorStyle): void {
  styles.set(name, style);
}

export function interiorStyleByName(name: string): InteriorStyle | undefined {
  return styles.get(name);
}

export function interiorStyleNames(): readonly string[] {
  return [...styles.keys()];
}

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

/** Wall thickness where none is stated, in metres. Shared with `rooms.ts` and with whatever measures how far a shell reaches. */
export const SHELL_THICKNESS = 0.35;

/**
 * Builds an interior shell centred on the origin, floor at y = 0. Centred rather
 * than cornered because a portal door is placed against a wall by measuring out
 * from the middle, and half-extents are the readable numbers at the call site.
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
    thickness = SHELL_THICKNESS,
  } = options;

  const rng = createRng(seed);
  const parts: Part[] = [];
  const t = thickness;
  // Every wall spans this on its long axis, so corners overlap.
  const outerX = width + t * 2;
  const outerZ = depth + t * 2;

  // --- shell --------------------------------------------------------------
  // With boards on top, the slab is dropped a few millimetres. Both at exactly
  // y = 0, the depth buffer has two coplanar faces to choose between across the
  // whole floor and picks differently from pixel to pixel, which reads as the floor
  // crawling. Dropped, the boards win wherever they reach.
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
  // Boards and seams tile edge to edge, every top face at exactly y = 0, so the
  // walkable height does not depend on whether boards are on — and the floor has no
  // vertical faces in it. That second part is the point: a recessed seam stands a
  // 90° normal step in front of the edge detector, which resolves it to a bright
  // line through a hard threshold and re-decides it every frame as the camera turns.
  if (planks) {
    const boardWidth = rng.range(0.24, 0.34);
    const count = Math.ceil(width / boardWidth);
    // A joint lit like the boards either side of it rather than the near-black of a
    // shadowed slot, and wider: the same amount of dark spread across twice the line
    // is the same seam at half the peak, and peak contrast at a low duty cycle is
    // what sparkles at distance.
    const seamWidth = 0.009;
    const seamColor = shade(style.floor, 0.55);
    const strip = (from: number, span: number, color: number): void => {
      // Laid *into* the slab rather than on top of it.
      const geometry = new THREE.BoxGeometry(span, 0.03, depth);
      geometry.translate(from + span / 2, -0.015, 0);
      // Each declares its own width as its feature size, so the two stop being drawn
      // at very different ranges: the seam dissolves into the boards as soon as it is
      // narrower than a pixel, while the board-to-board variation outlasts any room.
      parts.push({ geometry, color, sway: 0, detail: span, detailTint: style.floor });
    };
    for (let i = 0; i < count; i++) {
      const x = -width / 2 + i * boardWidth;
      strip(x, seamWidth, seamColor);
      // Every board a slightly different timber. A floor of one colour is the
      // fastest way to make a room look like a render of a room.
      strip(x + seamWidth, boardWidth - seamWidth, shade(style.floor, rng.around(1, 0.09)));
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
  // A band where the wall meets the floor. Without it the two meet in a single hard
  // line and the room reads as a texture-less box, which is what it is.
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
