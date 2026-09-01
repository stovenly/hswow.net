import * as THREE from 'three';
import type { BuildOptions, BuilderWith } from './types';
import { assemble, finish, type Part } from './assemble';
import { createRng, type Rng } from './random';
import { writing } from './writing';
import { PALETTE, shade } from './palette';

/**
 * One book, several bindings: a block of leaves, two boards and a covering over
 * the back edge, at proportions that change with what it was bound for. The
 * spine is the whole budget — a shelved book shows nothing but its back edge —
 * so the size ranges below must not overlap into one average. Built standing as
 * if shelved: +Y tail to head, spine facing +Z, X across the boards. The parts
 * are exposed as well as the mesh, so a dozen books merged into a shelf stay one
 * draw call.
 */

export interface Cover {
  /** Head to tail, in metres. The first thing that tells two shelved books apart. */
  height: [number, number];
  /** Spine to fore-edge, as a fraction of the height. */
  proportion: [number, number];
  /** Across the boards, as a fraction of the height. */
  bulk: [number, number];
  /** Board thickness, in metres. Zero is limp — a skin a tenth of a board thick, with the leaves filling the rest. */
  board: number;
  /** How far the boards stand past the leaves, all round. The pale sliver. */
  square: number;
  /** Raised bands across the spine. */
  bands: [number, number];
  /** How far the spine rounds out past the boards, as a fraction of the bulk. Stepped rather than turned. */
  round: number;
  /** Covering colours. One per book, picked by the seed. */
  hide: readonly Hide[];
  /**
   * Spine colours, when the back is bound in something else — the half-binding.
   * The spine is all a shelved book shows, so a different back is simply a
   * different colour of book, and the cheapest variety in the family.
   */
  spine?: readonly Hide[];
  /** What shows past the fore-edge, if anything. One kind, and that is the whole list. */
  furniture?: 'clasps';
  /** How far out of square the thing has been knocked about, 0..1: cocked boards, and a block of leaves that no longer lines up with them. */
  worn?: number;
}

/** A covering colour. A worded one reaches the player through `MeshBuilder.nameFor`. */
export type Hide = number | { readonly color: number; readonly word: string };

export function hideColor(hide: Hide): number {
  return typeof hide === 'number' ? hide : hide.color;
}

/** The draws a shut book makes before anything is measured. One function, so `nameFor` and the mesh cannot disagree. */
function shutRoll(plan: Cover, rng: Rng): { height: number; hide: Hide; spine: Hide } {
  return {
    height: rng.range(plan.height[0], plan.height[1]),
    hide: rng.pick(plan.hide),
    spine: rng.pick(plan.spine ?? plan.hide),
  };
}

/** Shut, or lying open on its face. Two attitudes of one object rather than two objects — see `cover`. */
export type BookState = 'shut' | 'open';

export interface BookOptions extends BuildOptions {
  /** Shut unless the placer says otherwise. Never rolled by the seed. */
  state?: BookState;
}

/** A built book, and the dimensions a shelf needs to stand it up. */
export interface Book {
  parts: Part[];
  /** Head to tail. */
  height: number;
  /** Spine to fore-edge. */
  width: number;
  /** Across the boards — how much shelf one takes up. */
  thickness: number;
  /**
   * How far the outermost point of the spine stands from the book's centre. Not
   * `width / 2`: a rounded back bulges past the boards and its bands stand proud
   * of that, so a shelf lining books up by half their width stands the fat ones
   * through the front of the case.
   */
  reach: number;
}

/**
 * What a caller may fix about a book instead of leaving it to the seed. All of it
 * exists for a run of matched volumes, which cannot come out of a seed rolled per
 * book, because the whole point is that the books agree with each other.
 */
export interface Fit {
  /** Never taller than this, whatever it rolled. For fitting a shelf. */
  tallest?: number;
  /** Built to this height rather than rolling one. For a run of matched volumes. */
  height?: number;
  /** The covering colour, fixed. */
  hide?: number;
  /** The spine colour, fixed. */
  spine?: number;
}

/** Page edges. Off-white and slightly foxed; nothing here is new. */
const PAPER = [PALETTE.WOOL, shade(PALETTE.WOOL, 0.93), PALETTE.CLOTH] as const;

/** Cover thickness for a limp binding — a skin rather than a board. */
const LIMP = 0.0013;

/**
 * The least a cover may overhang its leaves, in metres. A limp binding declares
 * no square at all, and no square means every cover edge lands exactly on the
 * block's — shared corners, and edges belonging to four faces. Four tenths of a
 * millimetre is invisible, and is what a real limp binding does at larger scale.
 */
const MARGIN = 0.0004;

/**
 * Builds one book standing on its tail, spine facing +Z. Nothing here is
 * coincident with anything else on purpose: the covering stands a fraction proud
 * of the boards it wraps, which is what leather does and what keeps two boxes
 * from sharing a vertex.
 */
export function bookParts(plan: Cover, rng: Rng, fit: Fit = {}): Book {
  const parts: Part[] = [];

  // Every roll is drawn whether or not it is used: a caller supplying a height or
  // a colour must not shift the sequence for everything after it, or a shelf
  // would rearrange itself the moment one book on it was matched to a neighbour.
  const { height: rolled, hide: pickedHide, spine: pickedSpine } = shutRoll(plan, rng);

  // Clamped before the other two are derived from it, so a book cut down to fit
  // a shelf keeps its proportions instead of becoming a squat one.
  const height = Math.min(fit.height ?? rolled, fit.tallest ?? Infinity);
  const width = height * rng.range(plan.proportion[0], plan.proportion[1]);
  const thickness = height * rng.range(plan.bulk[0], plan.bulk[1]);

  const hide = fit.hide ?? hideColor(pickedHide);
  const backing = fit.spine ?? hideColor(pickedSpine);
  const paper = rng.pick(PAPER);
  const board = Math.max(plan.board, LIMP);
  const square = Math.max(plan.square, MARGIN);

  // --- the leaves -----------------------------------------------------------
  //
  // Recessed from the boards by the square on every free edge, which is the pale
  // sliver that says book from across a room. The spine end stops short of the
  // covering; nothing can see into that gap.
  const wrap = width * rng.range(0.06, 0.1);
  const leafFore = -(width / 2 - square);
  const leafSpine = width / 2 - wrap;
  const leaves = new THREE.BoxGeometry(
    Math.max(thickness - board * 2, thickness * 0.5),
    height - square * 2,
    leafSpine - leafFore,
  );
  const worn = plan.worn ?? 0;
  if (worn > 0) leaves.rotateX(rng.around(0, worn * 0.05));
  leaves.translate(
    rng.around(0, worn * board),
    height / 2,
    (leafSpine + leafFore) / 2 - rng.range(0, worn * square * 2),
  );
  parts.push({ geometry: leaves, color: paper, sway: 0 });

  // --- the boards -----------------------------------------------------------
  for (const side of [-1, 1]) {
    const face = new THREE.BoxGeometry(board, height, width);
    // Cocked, on a cover that says it has been. Turned about its own centre
    // before it is put in place, which is the only order that keeps the hinge.
    if (worn > 0) {
      face.rotateX(rng.around(0, worn * 0.045));
      face.rotateZ(rng.around(0, worn * 0.02));
    }
    face.translate((side * (thickness - board)) / 2, height / 2, 0);
    // A shade apart, so the two boards of an open book are not one colour.
    parts.push({ geometry: face, color: shade(hide, side > 0 ? 1.06 : 0.94), sway: 0 });
  }

  // --- the spine ------------------------------------------------------------
  //
  // Nested boxes, each narrower across the boards and standing further out: a
  // rounded back at the only resolution this renders at. One box when the cover
  // is flat-backed, since two identical ones would weld.
  const lift = 0.0007;
  const spineHalf = thickness / 2 + lift;
  const bulge = thickness * plan.round;
  const steps = plan.round > 0.02 ? rng.int(2, 3) : 1;
  const back = width / 2 - wrap;

  const profile: { half: number; out: number }[] = [];
  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    profile.push({
      half: spineHalf * (1 - t * 0.34),
      out: width / 2 + (steps === 1 ? 0 : (bulge * (i + 1)) / steps),
    });
  }

  for (let i = 0; i < steps; i++) {
    const { half, out } = profile[i];
    const step = new THREE.BoxGeometry(half * 2, height + lift * 2, out - back);
    step.translate(0, height / 2, (out + back) / 2);
    parts.push({ geometry: step, color: shade(backing, 1 - i * 0.05), sway: 0 });
  }

  // --- the bands ------------------------------------------------------------
  //
  // Ridges across the spine, kept off the head and the tail where a real binding
  // leaves its two end panels taller. One segment per step of the profile, so a
  // band sits on a rounded back rather than hanging off either side of it.
  const bands = rng.int(plan.bands[0], plan.bands[1]);
  // Clamped against the book's own thickness. A fixed floor of a couple of
  // millimetres is nothing on a folio and is most of a pamphlet, and a band
  // standing half as proud as the book is thick reads as a rung.
  const proud = Math.min(0.0022 + thickness * 0.025, thickness * 0.32);
  const run = height * 0.72;
  const foot = height * 0.14;
  for (let i = 0; i < bands; i++) {
    const at = foot + (run * (i + 1)) / (bands + 1);
    const deep = proud + Math.max(bulge * 0.5, 0.0015);
    for (const { half, out } of profile) {
      const band = new THREE.BoxGeometry(half * 1.97, 0.006 + height * 0.012, deep);
      band.translate(0, at, out + proud - deep / 2);
      parts.push({ geometry: band, color: shade(backing, 0.86), sway: 0 });
    }
  }

  // --- what shows past the fore-edge ----------------------------------------
  //
  // Shelved, the fore-edge of one book is the gap beside the next, and the eye is
  // already there looking for where one stops and the other starts.
  const fore = -width / 2;
  if (plan.furniture === 'clasps') {
    // Straps over the fore-edge with a plate on the front board. Two of them,
    // set in from the head and the tail the way a real pair sits.
    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));
    for (const at of [height * 0.28, height * 0.72]) {
      const strap = new THREE.BoxGeometry(
        thickness * 1.06,
        height * 0.055,
        width * rng.range(0.1, 0.14),
      );
      strap.translate(0, at, fore + (width * 0.12) / 2 - 0.0009);
      parts.push({ geometry: strap, color: iron, sway: 0 });

      const catchPlate = new THREE.BoxGeometry(thickness * 0.34, height * 0.075, 0.004);
      catchPlate.translate(0, at, fore - 0.0022);
      parts.push({ geometry: catchPlate, color: shade(iron, 1.18), sway: 0 });
    }
    // Corner bosses, on the fore-edge corners only — the two that stand at the
    // gap. Bosses on the spine corners would be inside the next book along.
    for (const sx of [-1, 1]) {
      for (const sy of [height * 0.045, height * 0.955]) {
        const boss = new THREE.BoxGeometry(thickness * 0.2, height * 0.05, width * 0.055);
        boss.translate((sx * thickness) / 2.6, sy, fore + width * 0.03);
        parts.push({ geometry: boss, color: shade(iron, 0.9), sway: 0 });
      }
    }
  }

  return {
    parts,
    height,
    width,
    thickness,
    reach: profile[profile.length - 1].out + (bands > 0 ? proud : 0),
  };
}

/**
 * How tall a row of illegible marks stands on a page, in metres. Deliberately
 * coarse: forty lines of 2 mm type through this pipeline is a grey rectangle, and
 * twelve rows of 6 mm bars is what still says words from across a room.
 */
const PAGE_LEADING = 0.02;

/**
 * Lying open on its face, spread flat. Built in the pose it ends up in rather
 * than rotated out of the shelved frame, because an open book has no shelved
 * frame — and a transform would have to be written twice, once for the boards
 * and once for what is written on them. Head at +Z, gutter down x = 0.
 */
function openParts(plan: Cover, rng: Rng): Part[] {
  const parts: Part[] = [];

  const height = rng.range(plan.height[0], plan.height[1]);
  const width = height * rng.range(plan.proportion[0], plan.proportion[1]);
  const thickness = height * rng.range(plan.bulk[0], plan.bulk[1]);

  const hide = hideColor(rng.pick(plan.hide));
  const backing = hideColor(rng.pick(plan.spine ?? plan.hide));
  const paper = rng.pick(PAPER);
  const board = Math.max(plan.board, LIMP);
  const square = Math.max(plan.square, MARGIN);
  // The spine, flattened out across the table. Wider than the shut book is
  // thick, because opening one pulls the covering straight.
  const gutter = thickness * 0.72;
  const leaf = Math.max((thickness - board * 2) / 2, 0.004);

  // The spine, under the gutter and standing a hair proud of the boards it
  // joins — a book laid open rocks on its back, it does not lie in a plane.
  const spine = new THREE.BoxGeometry(gutter, board * 1.35, height * 1.004);
  spine.translate(0, (board * 1.35) / 2, 0);
  parts.push({ geometry: spine, color: shade(backing, 0.9), sway: 0 });

  // --- the gutter -----------------------------------------------------------
  //
  // Without this an open book is two slabs of paper lying on a mat: the leaves do
  // not stop at the edge of the trough, they curve down into it and meet in a
  // dark line. Two ramps and a slit, the slit narrow because a wide one reads as
  // a gap between two objects. The fold is stated as the two points the leaves
  // run between — the inner edge of the page block, and the bottom of the throat
  // — and everything else is derived. Only on books thick enough to have one.
  const lip = gutter / 2 + square;
  const surface = board + leaf;
  const throat = lip * 0.22;
  const trough = board + leaf * 0.18;
  const folds = leaf > 0.008;

  if (folds) {
    // The dark at the bottom of the fold. It caps the gap the ramps leave and
    // stops at the bottom of the trough, not at the page — a box filling the
    // gutter to the height of the leaves is a dark bar lying flush between slabs.
    const shadow = board * 1.35;
    const slit = new THREE.BoxGeometry(throat * 2, trough + leaf * 0.06 - shadow, height * 0.99);
    slit.translate(0, (trough + leaf * 0.06 + shadow) / 2, 0);
    parts.push({ geometry: slit, color: shade(hide, 0.5), sway: 0 });
  }

  for (const side of [-1, 1]) {
    const at = side * (gutter / 2 + width / 2);

    const face = new THREE.BoxGeometry(width, board, height);
    face.translate(at, board / 2, 0);
    parts.push({ geometry: face, color: shade(hide, side > 0 ? 1.06 : 0.94), sway: 0 });

    const block = new THREE.BoxGeometry(width - square * 2, leaf, height - square * 2);
    block.translate(at, board + leaf / 2, 0);
    parts.push({ geometry: block, color: paper, sway: 0 });

    // The leaves rolling into the fold: turned to the slope between the two points
    // above, laid on the midpoint of that line, then dropped half its own
    // thickness along its own normal, which puts its top face on the line.
    if (folds) {
      const run = lip - throat;
      const fall = surface - trough;
      const slope = Math.atan2(fall, run);
      const thick = leaf * 0.34;
      // Shorter head to tail than the block it runs off, so no two of these boxes
      // share a corner — and the fold stops short of the head and tail anyway.
      const ramp = new THREE.BoxGeometry(Math.hypot(run, fall), thick, height - square * 2.4);
      ramp.rotateZ(side * slope);
      ramp.translate(
        side * (throat + run / 2 + Math.sin(slope) * (thick / 2)),
        trough + fall / 2 - Math.cos(slope) * (thick / 2),
        0,
      );
      parts.push({ geometry: ramp, color: shade(paper, 0.88), sway: 0 });
    }

    // The marks, built flat in their own plane and laid onto the page as a unit.
    // They straddle the surface rather than sitting on it.
    const type = writing(width * 0.74, (height - square * 2) * 0.82, rng, {
      lines: Math.max(5, Math.round(((height - square * 2) * 0.82) / PAGE_LEADING)),
      word: [0.06, 0.2],
      relief: 0.0014,
    });
    for (const mark of type) {
      mark.geometry.rotateX(Math.PI / 2);
      mark.geometry.translate(at, board + leaf, 0);
      parts.push(mark);
    }
  }

  return parts;
}

/**
 * One cover style as a builder. The style is the builder, not an option on one:
 * `display` is fixed per builder and it is what the player is told the thing is.
 * The pose is not — open or shut is one object in two attitudes, so it is an
 * option a placer sets and never one the seed rolls. Laid down either way.
 */
export interface CoverBuilder extends BuilderWith<BookOptions> {
  /** The profile it was built from, so a shelf can fill itself from the family without a second table naming the same covers. */
  readonly plan: Cover;
}

export function cover(name: string, display: string, plan: Cover): CoverBuilder {
  return {
    name,
    plan,
    category: 'objects',
    display,
    // The footprint lying down is the height by the width, so the height is the
    // long side. Derived rather than declared.
    radius: plan.height[1] * 0.6,
    // Never collidable: being stopped by a book is the fastest way to make a room
    // feel like a floor with boxes on it, and the ray finds a readable by label.
    solid: false,

    nameFor(seed) {
      const { hide } = shutRoll(plan, createRng(seed));
      return typeof hide === 'number' ? display : `${hide.word} ${display}`;
    },

    build({ seed = 1, scale = 1, state = 'shut' }: BookOptions = {}) {
      const rng = createRng(seed);

      let geometry: THREE.BufferGeometry;
      if (state === 'open') {
        geometry = assemble(openParts(plan, rng));
      } else {
        const book = bookParts(plan, rng);
        geometry = assemble(book.parts);
        // Shelved to laid down: the head swings to +Z, the spine to +X, and
        // across-the-boards becomes up. Two turns of the whole assembly, so
        // nothing inside the book has to know which way up it ended.
        geometry.rotateX(Math.PI / 2);
        geometry.rotateZ(Math.PI / 2);
        geometry.translate(0, book.thickness / 2, -book.height / 2);
      }

      if (scale !== 1) geometry.scale(scale, scale, scale);
      return finish(geometry, name, rng.range(0, Math.PI * 2));
    },
  };
}
