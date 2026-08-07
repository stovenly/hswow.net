import * as THREE from 'three';
import type { BuildOptions, BuilderWith } from './types';
import { assemble, finish, type Part } from './assemble';
import { createRng, type Rng } from './random';
import { writing } from './writing';
import { PALETTE, shade } from './palette';

/**
 * One book, several bindings.
 *
 * A book is a block of leaves, two boards and a covering over the back edge, at
 * proportions that change with what it was bound for. The same argument the
 * quadrupeds and the flowers are built on: one construction, a table per kind.
 *
 * **The spine is the whole budget.** A shelved book shows nothing but its back
 * edge, so height, thickness, colour, how far the spine rounds and what runs
 * across it are everything a cover has to tell itself apart with. Front boards,
 * face clasps and tooling are invisible the moment the book is put away, which
 * is where most of them spend their lives.
 *
 * Which means the size ranges below must not overlap into one average. Ten
 * covers each rolling 18–22 cm is ten identical spines; each takes a band of
 * its own.
 *
 * Built standing, as if shelved: +Y from tail to head, the spine facing +Z, X
 * across the boards. `cover` lays it down; a shelf will not — which is why the
 * parts are exposed rather than only a finished mesh. A dozen books merged into
 * one shelf is one draw call; a dozen meshes parented to it is a dozen.
 */

export interface Cover {
  /** Head to tail, in metres. The first thing that tells two shelved books apart. */
  height: [number, number];
  /** Spine to fore-edge, as a fraction of the height. */
  proportion: [number, number];
  /** Across the boards, as a fraction of the height. */
  bulk: [number, number];
  /**
   * Board thickness, in metres. Zero is limp — a covering and no boards.
   *
   * Limp still gets a skin over each face, because a binding with nothing on
   * its outside is a stack of paper. What changes is that the skin is a tenth
   * of a board and the leaves fill the rest, so a ledger the same thickness as
   * a bound book has visibly more paper in it.
   */
  board: number;
  /** How far the boards stand past the leaves, all round. The pale sliver. */
  square: number;
  /** Raised bands across the spine. */
  bands: [number, number];
  /**
   * How far the spine rounds out past the boards, as a fraction of the bulk.
   *
   * Stepped rather than turned, the way the chest's domed lid is: through this
   * pipeline a three-step ziggurat and a true arc are the same handful of
   * pixels, and the steps cost twelve triangles each.
   */
  round: number;
  /** Covering colours. One per book, picked by the seed. */
  hide: readonly number[];
  /**
   * Spine colours, when the back is bound in something else.
   *
   * The half-binding: cloth or hide over the spine and corners, plain paper or
   * board over the rest. Worth its own field for a reason nothing else here
   * has — **the spine is all a shelved book shows**, so a cover whose back is a
   * different colour from its front is, on a shelf, simply a different colour
   * of book. It is the cheapest variety in the whole family.
   */
  spine?: readonly number[];
  /**
   * What shows past the fore-edge, if anything.
   *
   * The other half of the spine-on budget. Height, thickness and colour say
   * most of what a shelved book can say; the rest is whatever sticks out past
   * the boards where the eye is already looking for the gap between one book
   * and the next.
   *
   * One kind, and that is the whole list. Hanging thongs and chains were here
   * and are not: at book scale they came out as a few loose lines beside the
   * cover rather than as anything you could name, which is the failure mode
   * every small dangling detail in this kit has.
   */
  furniture?: 'clasps';
  /**
   * How far out of square the thing has been knocked about, 0..1.
   *
   * Cocked boards and a block of leaves that no longer lines up with them. It
   * is worth a field because *every other cover in the family is perfect*, and
   * a shelf of nothing but perfect books reads as a shop rather than as a
   * collection — one that has been sat on is the cheapest thing that says the
   * rest of them were looked after.
   */
  worn?: number;
}

/**
 * Shut, or lying open on its face.
 *
 * Two attitudes of one object rather than two objects. A player calls both of
 * them a book, and `display` is fixed per builder, so this cannot be a cover of
 * its own — see `cover` for the other half of that argument.
 */
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
   * How far the outermost point of the spine stands from the book's centre.
   *
   * Not `width / 2`. A rounded back bulges past the boards and its bands stand
   * proud of *that*, so a shelf lining books up by half their width stands the
   * fat ones through the front of the case — which is what happened, by three
   * millimetres, and is invisible in anything but a measurement.
   */
  reach: number;
}

/**
 * What a caller may fix about a book instead of leaving it to the seed.
 *
 * All of it exists for one job: **a run of matched volumes**. A shelf is not a
 * stream of unrelated books, it is a few sets and some strays, and a set is
 * three or four of the same binding at the same height in the same colour. None
 * of that can come out of a seed rolled per book, because the whole point of it
 * is that the books agree with each other.
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
 * The least a cover may overhang its leaves, in metres.
 *
 * A limp binding declares no square at all, and *no square at all* is not a
 * proportion — it is a cover whose every edge lands exactly on the block's,
 * which means shared corners, which means edges belonging to four faces and a
 * solid the closure check calls open. It cost two builders on the first run.
 *
 * Four tenths of a millimetre: invisible, over the quantization the check
 * rounds to, and true of a real limp binding anyway, which is cut a hair
 * outside its own text block for exactly this reason at a larger scale.
 */
const MARGIN = 0.0004;

/**
 * Builds one book standing on its tail, spine facing +Z.
 *
 * Nothing here is coincident with anything else on purpose. The covering stands
 * a fraction proud of the boards it wraps — which is what leather actually does
 * — and that fraction is also what keeps two boxes from sharing a vertex, where
 * a shared vertex means an edge belonging to four faces and a solid the closure
 * check calls open.
 */
export function bookParts(plan: Cover, rng: Rng, fit: Fit = {}): Book {
  const parts: Part[] = [];

  // **Every roll is drawn whether or not it is used.** A caller supplying a
  // height or a colour must not shift the random sequence for everything after
  // it, or a shelf would rearrange itself the moment one book on it was
  // matched to its neighbour. Same rule the flower clump follows for its
  // bearing.
  const rolled = rng.range(plan.height[0], plan.height[1]);
  const pickedHide = rng.pick(plan.hide);
  const pickedSpine = rng.pick(plan.spine ?? plan.hide);

  // Clamped before the other two are derived from it, so a book cut down to fit
  // a shelf keeps its proportions instead of becoming a squat one.
  const height = Math.min(fit.height ?? rolled, fit.tallest ?? Infinity);
  const width = height * rng.range(plan.proportion[0], plan.proportion[1]);
  const thickness = height * rng.range(plan.bulk[0], plan.bulk[1]);

  const hide = fit.hide ?? pickedHide;
  const backing = fit.spine ?? pickedSpine;
  const paper = rng.pick(PAPER);
  const board = Math.max(plan.board, LIMP);
  const square = Math.max(plan.square, MARGIN);

  // --- the leaves -----------------------------------------------------------
  //
  // Recessed from the boards by the square on every free edge, which is the
  // pale sliver that says *book* from across a room. The spine end stops short
  // of the covering; nothing can see into that gap.
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
    // before it is put in place, which is the only order that keeps the hinge
    // where it was — see `chest`, which makes the same argument about a lid.
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
  // Nested boxes, each narrower across the boards and standing further out,
  // which is a rounded back at the only resolution this renders at. One box
  // when the cover is flat-backed, since two identical ones would weld.
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
  // Ridges across the spine, dividing it into panels, and kept off the head and
  // the tail where a real binding leaves its two end panels taller.
  //
  // One segment per step of the profile, so a band sits *on* a rounded back
  // rather than as a flat slab with its ends hanging off either side of it.
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
  // Everything above is the spine. This is the other end of the book, and it is
  // in the budget for the same reason the spine is: shelved, the fore-edge of
  // one book is the gap beside the next, and the eye is already there looking
  // for where one stops and the other starts.
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
 * How tall a row of illegible marks stands on a page, in metres.
 *
 * Deliberately coarse — see `art/writing`. A page of this size really carries
 * forty lines of 2 mm type, and forty lines of 2 mm type through this pipeline
 * is a grey rectangle. Twelve or so rows of 6 mm bars is not to scale and it is
 * the version that still says *words* from across a room.
 */
const PAGE_LEADING = 0.02;

/**
 * Lying open on its face, spread flat.
 *
 * Built in the pose it ends up in rather than in the shelved frame and rotated,
 * because an open book has no shelved frame — the boards are splayed, the block
 * is in two halves and the spine is underneath rather than at one edge. Turning
 * a shut book into this one with a transform would mean writing the transform
 * twice, once for the boards and once for what is written on them, which is
 * exactly the mistake `rod` exists to stop.
 *
 * Head at +Z, gutter down the middle at x = 0, both boards on the ground.
 */
function openParts(plan: Cover, rng: Rng): Part[] {
  const parts: Part[] = [];

  const height = rng.range(plan.height[0], plan.height[1]);
  const width = height * rng.range(plan.proportion[0], plan.proportion[1]);
  const thickness = height * rng.range(plan.bulk[0], plan.bulk[1]);

  const hide = rng.pick(plan.hide);
  const backing = rng.pick(plan.spine ?? plan.hide);
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
  // **Without this an open book is two slabs of paper lying on a mat.** Two
  // flat-topped blocks with a flat-bottomed channel between them is what the
  // first version was, and every part of it was individually right: the boards
  // are flat, the blocks are the right thickness, the trough is the right
  // width. What was missing is the one feature that says *open book* rather
  // than *two stacks of paper* — the leaves do not stop at the edge of the
  // trough, they curve down into it and meet in a dark line.
  //
  // Two ramps and a slit. The ramps carry each block's inner edge down toward
  // the middle; the slit is the shadow they close onto, and it is narrow
  // because a wide one reads as a gap between two objects rather than as the
  // fold of one.
  //
  // The fold is stated as the two points the leaves have to run between: the
  // inner edge of the page block at the top, and the bottom of the throat.
  // Everything else is derived from those, because a ramp positioned by eye
  // lands either buried in the board or hanging over the gutter, and both look
  // like a modelling fault rather than like a wrong number.
  //
  // **Only on books thick enough to have one.** A pamphlet is a folded sheet:
  // its fold is a fraction of a millimetre deep, which is under the resolution
  // anything here renders or is measured at — the closure check quantizes to a
  // tenth of a millimetre and read the whole feature as one welded lump. A
  // sheet has no gutter, so it does not get one.
  const lip = gutter / 2 + square;
  const surface = board + leaf;
  const throat = lip * 0.22;
  const trough = board + leaf * 0.18;
  const folds = leaf > 0.008;

  if (folds) {
    // The dark at the bottom of the fold. It caps the gap the two ramps leave
    // between them and **stops at the bottom of the trough, not at the page** —
    // a box filling the gutter to the height of the leaves is a dark bar lying
    // flush between two slabs, which is the thing this is here to stop being.
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

    // The leaves rolling into the fold.
    //
    // Sized and placed off the run it has to cover rather than off a tilt that
    // looked about right: it is turned to the slope between the two points
    // above, laid on the midpoint of that line, and then dropped half its own
    // thickness along its *own* normal — which is what puts its top face on the
    // line rather than its centre. Shaded under the page it runs off, since the
    // inside of a fold is the one part of a page that never gets the light.
    if (folds) {
      const run = lip - throat;
      const fall = surface - trough;
      const slope = Math.atan2(fall, run);
      const thick = leaf * 0.34;
      // Shorter head to tail than the block it runs off, so no two of these
      // boxes can share a corner — the closure check is unforgiving about that,
      // and the fold does stop short of the head and the tail anyway.
      const ramp = new THREE.BoxGeometry(Math.hypot(run, fall), thick, height - square * 2.4);
      ramp.rotateZ(side * slope);
      ramp.translate(
        side * (throat + run / 2 + Math.sin(slope) * (thick / 2)),
        trough + fall / 2 - Math.cos(slope) * (thick / 2),
        0,
      );
      parts.push({ geometry: ramp, color: shade(paper, 0.88), sway: 0 });
    }

    // The marks, built flat in their own plane and then laid onto the page as a
    // unit. They straddle the surface rather than sitting on it, which is why
    // it does not matter which way the relief ended up facing.
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
 * One cover style as a builder.
 *
 * The style is the builder, not an option on one: `display` is a fixed string
 * per builder and it is what the player is told the thing is, so anything that
 * changes the words *Leather Bound Book* has to be its own entry in the kit.
 *
 * **The pose is not.** Open or shut is one object in two attitudes and the
 * player calls both of them a book, so it is an option — and an option a placer
 * sets, never one the seed rolls. A prop whose staging arrives with its seed
 * cannot be put down twenty times in a village.
 *
 * The book is laid down either way. That is where a book is when it is not on a
 * shelf, and a shelf takes the parts instead.
 */
export interface CoverBuilder extends BuilderWith<BookOptions> {
  /**
   * The profile it was built from.
   *
   * Carried on the builder so a shelf can fill itself from the family without
   * a second table naming the same covers — a list of what a bookshelf stocks,
   * kept beside the covers themselves, is a list that is wrong the first time
   * one of them is renamed.
   */
  readonly plan: Cover;
}

export function cover(name: string, display: string, plan: Cover): CoverBuilder {
  return {
    name,
    plan,
    category: 'objects',
    display,
    // The footprint lying down is the height by the width, so the height is the
    // long side. Derived rather than declared: a cover is a table, and a number
    // beside it that has to agree with it will one day not.
    radius: plan.height[1] * 0.6,
    // Never collidable. Being stopped by a book is the fastest way to make a
    // room feel like a floor with boxes on it, and the interaction ray finds a
    // readable by its label rather than by its collider.
    solid: false,

    build({ seed = 1, scale = 1, state = 'shut' }: BookOptions = {}) {
      const rng = createRng(seed);

      let geometry: THREE.BufferGeometry;
      if (state === 'open') {
        geometry = assemble(openParts(plan, rng));
      } else {
        const book = bookParts(plan, rng);
        geometry = assemble(book.parts);
        // Shelved to laid down: the head swings to +Z, the spine to +X and
        // across-the-boards becomes up. Taken as two turns of the whole
        // assembly rather than as an authored second pose, so nothing inside
        // the book has to know which way up it ended.
        geometry.rotateX(Math.PI / 2);
        geometry.rotateZ(Math.PI / 2);
        geometry.translate(0, book.thickness / 2, -book.height / 2);
      }

      if (scale !== 1) geometry.scale(scale, scale, scale);
      return finish(geometry, name, rng.range(0, Math.PI * 2));
    },
  };
}
