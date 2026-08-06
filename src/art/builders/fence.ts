import * as THREE from 'three';
import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A run of post-and-rail fence, built to be joined to another one.
 *
 * ## Two rules make an arbitrary length possible
 *
 * **The pitch is fixed.** A section is `FENCE_SECTION` long whatever the seed
 * rolls, so a placer laying a boundary counts sections instead of building a
 * piece to find out how wide it came out. The seed decides the carpentry, not
 * the measurements.
 *
 * **The last post is missing.** A piece carries a post at the near end of every
 * section and none at its far end, and the last bay's rails run out to where
 * that post *would* stand. Whatever comes next supplies it: another fence
 * extends the run, a `fence-post` finishes it. There is no arrangement of the
 * two that leaves a doubled post or a rail ending in mid-air.
 *
 * **Every bay is railed.** A gap in a boundary is something you place, by
 * leaving a piece out of a run.
 *
 * ## Where the rails sit
 *
 * On one face, always the same one. Each rail takes its endpoints from the two
 * posts it is nailed to, *at its own height*, so it follows their lean and their
 * sideways tilt and still lies flat against both. The wonk lives in the posts,
 * which is where a fence's wonk comes from.
 *
 * **No random facing.** A fence faces where it is put — the seed has no business
 * deciding which way a boundary runs. Built along **+X**, standing on y = 0,
 * centred on its own span.
 */

/** Metres between posts. The same for every fence, so runs tile. */
export const FENCE_SECTION = 1.4;

/** Sections in one piece. Longer than four is a stockade, not a fence. */
export const FENCE_MAX_SECTIONS = 4;

/** Post section, square. Shared with `fence-post`, which stands in the same line. */
export const FENCE_POST = 0.12;

/** Rail thickness through the run. Exported for the check that reads it. */
export const RAIL_DEPTH = 0.05;
const RAIL_HEIGHT = 0.075;
/**
 * How far a rail's centre stands off its post's.
 *
 * Ten millimetres inside the post face rather than flush against it: two
 * coplanar faces z-fight, and a rail let slightly into its post is what a
 * nailed one looks like once the timber has taken a few winters.
 */
const RAIL_FACE = FENCE_POST / 2 + RAIL_DEPTH / 2 - 0.01;

export interface FenceOptions extends BuildOptions {
  /**
   * How many sections long, 1..4.
   *
   * Rolled from the seed when the caller says nothing, which is what a gallery
   * wants. A placer building a run to a length says so instead — and the roll
   * still happens, so stating it does not reshuffle the carpentry.
   */
  sections?: number;
  /**
   * Seeds the carpentry that has to **agree across a join** — how tall the posts
   * are, how many rails, what timber they were cut from. Defaults to `seed`, so
   * a fence standing on its own is unchanged; a placer laying a run passes one
   * number for the whole of it.
   *
   * Without it a run of two pieces is two different fences butted together:
   * three rails meeting two on the same post, with the tops a hand's breadth
   * apart. The pitch tiling exactly is not enough on its own.
   */
  run?: number;
}

/** One post's own idea of vertical. */
export interface PostShape {
  readonly x: number;
  readonly z: number;
  readonly height: number;
  /** Lean along the run — where most of a fence's wonk lives. */
  readonly lean: number;
  /**
   * Lean across it. Kept to about a degree and a half: the rails follow it, so
   * it costs nothing in consistency, but a run that wanders far off its own
   * line stops reading as a boundary somebody set out.
   */
  readonly tilt: number;
  /** Turned in its socket. Small: a square post far off square meets its rails on a corner. */
  readonly twist: number;
}

/** The band a fence post is rolled from, so a cap matches the run it caps. */
export function fenceHeight(rng: Rng): number {
  return rng.range(0.95, 1.3);
}

/**
 * A post at (x, z), leaning its own way — unless it stands on a join.
 *
 * A post at a join is set `plumb`, and it has to be: the piece before it aimed
 * its last rails at that spot before knowing which post would turn up, and a
 * leaning one lands a couple of centimetres off a rail that is only let into it
 * by one. The draws are made either way, so a run keeps its seed.
 */
export function rollPost(
  rng: Rng,
  x: number,
  z: number,
  height: number,
  plumb = false,
): PostShape {
  const tall = height * rng.range(0.88, 1.08);
  const lean = rng.around(0, 0.07);
  const tilt = rng.around(0, 0.03);
  const twist = rng.around(0, 0.07);
  return plumb ? { x, z, height: tall, lean: 0, tilt: 0, twist } : { x, z, height: tall, lean, tilt, twist };
}

export function postGeometry(post: PostShape): THREE.BufferGeometry {
  const shaft = new THREE.BoxGeometry(FENCE_POST, post.height, FENCE_POST);
  shaft.translate(0, post.height / 2, 0);
  // Turned first, then leaned. The other order rotates the lean itself, and
  // `postAt` below would no longer know which way the post had gone.
  shaft.rotateY(post.twist);
  shaft.rotateZ(post.lean);
  shaft.rotateX(post.tilt);
  shaft.translate(post.x, 0, post.z);
  return shaft;
}

/** Where a post's centre line has got to by a given height. */
function postAt(post: PostShape, y: number): { x: number; z: number } {
  return {
    x: post.x - y * Math.sin(post.lean),
    z: post.z + y * Math.cos(post.lean) * Math.sin(post.tilt),
  };
}

/** One rail, nailed across the face of the two posts it spans. */
function rail(a: PostShape, b: PostShape, y: number, sag: number, colour: number): Part {
  const from = postAt(a, y);
  const to = postAt(b, y);
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const length = Math.hypot(dx, dz);

  const geometry = new THREE.BoxGeometry(length, RAIL_HEIGHT, RAIL_DEPTH);
  geometry.rotateZ(sag);
  geometry.rotateY(Math.atan2(-dz, dx));
  // Offset along this bay's own normal rather than the fence's, so a bay whose
  // two posts have wandered apart in z still gets a rail flat against both.
  geometry.translate(
    (from.x + to.x) / 2 - (dz / length) * RAIL_FACE,
    y,
    (from.z + to.z) / 2 + (dx / length) * RAIL_FACE,
  );
  return { geometry, color: colour, sway: 0 };
}

export const fence: BuilderWith<FenceOptions> = {
  name: 'fence',
  category: 'structures',
  radius: (FENCE_MAX_SECTIONS * FENCE_SECTION) / 2,

  build({ seed = 1, scale = 1, sections, run }: FenceOptions = {}) {
    const rng = createRng(seed);
    // Everything a neighbouring piece has to match comes off this one, and
    // everything that may differ from post to post comes off `rng`.
    const along = createRng(run ?? seed);
    const parts: Part[] = [];

    const rolled = rng.int(1, FENCE_MAX_SECTIONS);
    const count = Math.max(1, Math.min(FENCE_MAX_SECTIONS, Math.round(sections ?? rolled)));
    const span = count * FENCE_SECTION;
    const height = fenceHeight(along);
    const rails = along.int(2, 3);
    const timber = shade(PALETTE.TIMBER, along.range(0.94, 1.06));
    const railWood = shade(PALETTE.TIMBER_DARK, along.range(0.92, 1.08));
    // Rail heights are set out once for the run. Nailing them at a different
    // height in every bay is not wonk, it is a different fence each time.
    const lifts = Array.from({ length: rails }, () => along.around(0, 0.02));

    const line: PostShape[] = [];
    for (let i = 0; i < count; i++) {
      const post = rollPost(rng, -span / 2 + i * FENCE_SECTION, 0, height, i === 0);
      line.push(post);
      parts.push({
        geometry: postGeometry(post),
        color: shade(timber, rng.around(1, 0.05)),
        sway: 0,
      });
    }
    // The one past the end, dead upright and never built. The last bay's rails
    // run out to it, which is exactly where the next piece's post will stand.
    line.push({ x: span / 2, z: 0, height, lean: 0, tilt: 0, twist: 0 });

    for (let i = 0; i < count; i++) {
      for (let r = 0; r < rails; r++) {
        const at = height * (0.34 + (r / Math.max(rails - 1, 1)) * 0.5) + lifts[r];
        parts.push(
          rail(line[i], line[i + 1], at, rng.around(0, 0.035), shade(railWood, rng.around(1, 0.05))),
        );
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'fence', 0);
  },
};
