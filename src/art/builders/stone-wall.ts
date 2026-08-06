import * as THREE from 'three';
import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import {
  hearting,
  patch,
  pointing,
  seam,
  skin,
  stoneColours,
  tapered,
  throughStone,
  wander,
  SKIN,
} from '../masonry';

/**
 * A field wall: stones bedded on a hearting, two skins, coped.
 *
 * Dry-laid or mortared — rolled per wall, and the difference is what shows in
 * the joints. A dry wall shows its own dark interior; a mortared one shows pale
 * pointing. The stonework is the same either way, because a wall built of
 * whatever came off the field is the same wall whether or not somebody pointed
 * it. How a face is laid out and warped is in `art/masonry`.
 *
 * Each face carries its own skin, cut separately, so the two sides do not match.
 * **The sideways part of the warp fades to a shared seam at each end of the
 * piece**, so two pieces still meet exactly — see `seam`.
 *
 * **It leans in as it rises** — `BATTER` takes a quarter of the thickness off
 * between foot and top. **The biggest stones are at the bottom**, grading finer
 * with height. **The coping is a different thing from the wall**: stones running
 * right through it, lying flat.
 *
 * As `fence`: the pitch is fixed, so a run of any length is a count of sections,
 * and every piece butts flush against the next on the hearting, which spans the
 * piece exactly and takes no jitter. The wall carries no piers;
 * `stone-wall-column` is a separate object for an end, a corner or a gate cheek.
 *
 * `stone-wall-low` is the same wall built to `LOW` instead.
 *
 * Built along **+X**, standing on y = 0, centred on its own span.
 */

/** Metres of wall in one section. The same for every wall, so runs tile. */
export const WALL_SECTION = 1.6;

/** Sections in one piece. */
export const WALL_MAX_SECTIONS = 4;

/** Through the wall at its foot. Shared with `stone-wall-column`. */
export const WALL_DEPTH = 0.48;

/** How much of that thickness is gone by the top. */
const BATTER = 0.26;

/**
 * How far the stonework runs on past where the coping starts.
 *
 * Only just far enough. Bedding a stone pulls its top edge down by a centimetre
 * or so and the warp used to move it another two or three, so the coping had to
 * be set deep enough to cover the worst of that — which buried the top course of
 * the face along with it. The warp is now **held level** where the two meet (see
 * `wander`) and the coping's underside is flattened onto one line, so what is
 * left to cover is the bedding alone.
 */
const UNDER = 0.04;

/** What a wall of this sort is built to. */
export interface Build {
  readonly height: readonly [number, number];
  readonly coping: readonly [number, number];
  readonly stone: readonly [number, number];
  readonly depth: number;
}

export const TALL: Build = {
  height: [1.3, 2],
  coping: [0.15, 0.22],
  stone: [0.44, 0.58],
  depth: WALL_DEPTH,
};

/**
 * Half a wall: something to sit on, or to edge a garden with.
 *
 * The same stones and much the same coping, thinner through and fewer courses
 * high — which is what a low wall is. Scaling the whole thing down would give it
 * stones the size of a fist, and a wall does not get its stones smaller because
 * it got shorter. It gets fewer of them.
 */
export const LOW: Build = {
  height: [0.6, 0.95],
  coping: [0.13, 0.18],
  stone: [0.34, 0.44],
  depth: WALL_DEPTH * 0.84,
};

/** How tall a run is. Taken off the run's own seed, so its pieces agree. */
export function wallHeight(rng: Rng, made: Build = TALL): number {
  return rng.range(made.height[0], made.height[1]);
}

export interface StoneWallOptions extends BuildOptions {
  /** How many sections long, 1..4. Rolled from the seed when the caller says nothing. */
  sections?: number;
  /**
   * Seeds everything that has to **agree across a join** — how tall the wall is,
   * whether it is pointed, what bed the stone came out of. Defaults to `seed`.
   *
   * Without it a run of two pieces steps by up to two thirds of a metre in the
   * middle of what is meant to be one boundary. The pitch tiling exactly is not
   * enough on its own.
   */
  run?: number;
}

export function buildWall(
  name: string,
  made: Build,
  { seed = 1, scale = 1, sections, run }: StoneWallOptions = {},
): THREE.Mesh {
  const rng = createRng(seed);
  // Everything a neighbouring piece has to match comes off this one, in this
  // order, before anything else touches it.
  const along = createRng(run ?? seed);
  const parts: Part[] = [];

  const rolled = rng.int(1, WALL_MAX_SECTIONS);
  const count = Math.max(1, Math.min(WALL_MAX_SECTIONS, Math.round(sections ?? rolled)));
  const span = count * WALL_SECTION;
  const height = wallHeight(along, made);

  const dry = along.chance(0.5);
  const point = pointing(along, dry);
  const fill = hearting(along, dry);
  const copingH = along.range(made.coping[0], made.coping[1]);
  const base = along.range(made.stone[0], made.stone[1]);
  const amount = along.range(0.016, 0.026);
  // One per face and one for the coping, all off the run's seed, so the piece
  // next door wanders across the join in exactly the same way. Rolled before the
  // colours, which draw lazily and would otherwise shift the stream.
  const seams = [seam(along, amount), seam(along, amount), seam(along, amount)];
  const colour = stoneColours(along);

  const masonry = height - copingH;
  const depthAt = (y: number): number => made.depth * (1 - BATTER * (y / masonry));
  /** Where a face lies at this height — the hearting's surface. */
  const faceAt = (y: number): number => depthAt(y) / 2 - SKIN;
  // And on up behind the coping, because cope stones are bedded a joint apart
  // and a course laid on nothing has daylight between every pair of them — but
  // not past the shortest of them, which is `0.9 * copingH` less the bedding.
  const core = masonry + copingH * 0.65;

  // This is what two pieces meet on, so it spans exactly and takes no jitter.
  parts.push({ geometry: tapered(span, core, faceAt(0), faceAt(core)), color: fill, sway: 0 });

  // Footings first, grading finer with height.
  const sizeAt = (y: number): number => base * (1 - 0.32 * (y / masonry));
  const held = { at: span / 2, over: 0.2 };
  const level = { at: masonry, over: 0.14 };

  for (const [face, facing] of [
    [0, 1],
    [1, -1],
  ] as const) {
    const stones: Part[] = [];
    skin(
      rng,
      patch(-span / 2, 0, span, masonry + UNDER),
      sizeAt,
      point,
      faceAt,
      wander(rng, amount, { ...held, seam: seams[face] }, level),
      colour,
      stones,
    );
    // Turning the far skin about the vertical carries its seat with it, so it
    // lands on the far face pointing outward with no second translate.
    for (const part of stones) {
      if (facing < 0) part.geometry.rotateY(Math.PI);
      parts.push(part);
    }
  }

  // --- the coping ------------------------------------------------------------
  //
  // Right through the wall, lying flat, and bedded down onto one line so it
  // covers the top of the face without burying it. Varied in width, height and
  // how far they overhang, and not one of them tilted: a coping set on the slant
  // reads as a row of tents.
  const top = depthAt(masonry);
  const copeW = rng.range(0.26, 0.42);
  const move = wander(rng, amount, { ...held, seam: seams[2] }, level);

  let x = -span / 2;
  while (span / 2 - x > 1e-6) {
    let w = copeW * rng.range(0.8, 1.3);
    if (span / 2 - (x + w) < copeW * 0.55) w = span / 2 - x;
    w = Math.min(w, span / 2 - x);

    parts.push({
      geometry: throughStone(
        rng,
        patch(x, masonry, w, copingH * rng.range(0.9, 1.08)).map(move),
        { ...point, chamfer: 0.04 },
        top * rng.range(1.1, 1.2),
        rng.range(0.01, 0.022),
        masonry - 0.006,
      ),
      color: colour(),
      sway: 0,
    });
    x += w;
  }

  const geometry = assemble(parts);
  if (scale !== 1) geometry.scale(scale, scale, scale);
  return finish(geometry, name, 0);
}

export const stoneWall: BuilderWith<StoneWallOptions> = {
  name: 'stone-wall',
  category: 'structures',
  radius: (WALL_MAX_SECTIONS * WALL_SECTION) / 2,
  build: (options) => buildWall('stone-wall', TALL, options),
};
