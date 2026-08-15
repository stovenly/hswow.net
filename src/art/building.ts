import * as THREE from 'three';
import type { Part } from './assemble';
import { prism, type Cell } from './masonry';
import type { Rng } from './random';
import { PALETTE, shade, blend } from './palette';

/**
 * Buildings: the walls, roofs and openings the eight of them share.
 *
 * A hut, a barn and a church are one construction at three sizes and three
 * levels of expense, and the worst thing they could do is disagree about what a
 * wall is. So the vocabulary lives here and the builders compose it — the same
 * arrangement `masonry.ts` has with the stone wall family.
 *
 * ## A building is rectangular gabled blocks and lean-tos
 *
 * Not a simplification for the game's sake: it is how these were built. A manor
 * is a range with a cross-wing, a church is a nave with a narrower chancel, a
 * tower and a porch, a barn is a shed with two cart porches. Every one of those
 * parts is a box with a pitched roof on it, so `block` makes one and the
 * builders stack them.
 *
 * ## Openings are laid on, not cut out
 *
 * No hole is ever cut. A window is a leaded light laid on the wall — at this
 * palette indistinguishable from an opening, and it costs no constructive solid
 * geometry.
 *
 * **A doorway is nothing at all.** Not a dark panel, not a frame, not a step: a
 * door builder supplies the leaf and everything round it, so anything the
 * building puts there is something that has to be covered up or fought with. All
 * a building owes a doorway is the entry in `userData.doorways` saying where it
 * is.
 *
 * **A wall is a solid box, so everything laid on it stands in front of it.**
 * This is the mistake that made every window paneless: the glass and the dark
 * behind it were authored at negative z, *inside* the wall slab, where the
 * wall's own front face hides them completely. Nothing can be recessed into a
 * solid; depth is made by stacking layers outward, with the frame proudest and
 * the opening least proud, so the opening reads as set back inside its frame.
 *
 * **And no two layers may share a plane.** Two faces at the same depth are two
 * faces the depth buffer cannot separate, and the result flickers at every
 * distance. Every layer below therefore starts inside the wall and comes out,
 * and each stands clear of the next. The depths are named constants for that
 * reason — they are a ladder, not a set of guesses.
 *
 * ## Orientation, stated once
 *
 * Everything that goes on a wall is authored in one canonical frame — **facing
 * +Z, centred on x = 0, with the wall's outer surface at z = 0 and the piece
 * standing proud toward +z** — and `onFace` turns it onto whichever wall it
 * belongs to. `rotateY(yaw)` takes +Z to `(sin yaw, 0, cos yaw)`, so a face's
 * yaw *is* the bearing of its outward normal: 0 is +Z, π/2 is +X, π is −Z,
 * −π/2 is −X. That is the only place a wall rotation happens, which is the
 * point of having it.
 */

/** How a wall is built up: a timber frame with daub in it, stone, or boarding. */
export type Walling = 'frame' | 'stone' | 'board';
/** What is on the roof. Thatch is a different shape, not just a different colour. */
export type RoofKind = 'thatch' | 'tile' | 'slate' | 'shingle';
/** Which way the ridge runs, and therefore which two ends are gables. */
export type Ridge = 'x' | 'z';

/** One building's materials, rolled once so every block of it agrees. */
export interface Look {
  walling: Walling;
  roofKind: RoofKind;
  /** The wall body — daub, stone or boarding. */
  wall: number;
  timber: number;
  timberDark: number;
  /** Plinth, quoins, chimney, dressings. */
  stone: number;
  stoneDark: number;
  roof: number;
  /**
   * How far apart the studs are, where the building wants to say.
   *
   * Close studding — a stud every half metre, timber standing nearly as wide as
   * the panel between — was a display of how much oak the owner could afford to
   * nail to the outside of his house. Left off, the wall rolls its own.
   */
  studs?: number;
}

/**
 * Limewash, ochre or grey clay.
 *
 * The three infills that actually turn up, and the whole of what separates a
 * Kentish panel from an Alsatian one at this distance — the carpentry behind
 * them is the same either way.
 */
function daub(rng: Rng): number {
  const draw = rng();
  if (draw < 0.45) return shade(0xc9c2ae, rng.around(1, 0.05));
  if (draw < 0.78) return shade(0xb3a184, rng.around(1, 0.06));
  return shade(0x9a9284, rng.around(1, 0.06));
}

function roofColour(rng: Rng, kind: RoofKind): number {
  switch (kind) {
    // Straw goes grey from the ridge down and keeps its gold where the sun gets
    // it. Half way between, so a rick beside it is the fresher of the two.
    case 'thatch':
      return shade(
        blend(PALETTE.GRASS_DRY, PALETTE.CLOTH, rng.range(0.3, 0.62)),
        rng.around(1, 0.07),
      );
    case 'tile':
      return shade(blend(PALETTE.RUST, PALETTE.EARTH, rng.range(0.15, 0.45)), rng.around(1, 0.08));
    case 'slate':
      return shade(
        blend(PALETTE.STONE_DARK, PALETTE.IRON_DARK, rng.range(0.3, 0.6)),
        rng.around(1, 0.07),
      );
    case 'shingle':
      return shade(
        blend(PALETTE.TIMBER_DARK, PALETTE.BARK, rng.range(0.2, 0.55)),
        rng.around(1, 0.08),
      );
  }
}

export function look(rng: Rng, walling: Walling, roofKind: RoofKind): Look {
  const oak = rng.chance(0.5) ? PALETTE.TIMBER_DARK : PALETTE.BARK_PALE;
  const stone = shade(PALETTE.STONE, rng.around(1, 0.06));
  return {
    walling,
    roofKind,
    wall:
      walling === 'frame'
        ? daub(rng)
        : walling === 'stone'
          ? stone
          : shade(blend(PALETTE.TIMBER_DARK, PALETTE.BARK, 0.4), rng.around(1, 0.07)),
    timber: shade(oak, rng.around(1, 0.06)),
    timberDark: shade(oak, rng.range(0.7, 0.84)),
    stone,
    stoneDark: shade(PALETTE.STONE_DARK, rng.around(1, 0.06)),
    roof: roofColour(rng, roofKind),
  };
}

/** Slate and tile do not burn. Thatch does, which is why a smithy never has it. */
export function hardRoof(rng: Rng): RoofKind {
  return rng.chance(0.55) ? 'tile' : 'slate';
}

/** The dark of an unlit opening. Not black — see `PALETTE.INK` for why. */
export const RECESS = 0x14161a;

/**
 * The outside of a leaded light.
 *
 * **Pale, and that is the whole of why a window reads as a window.** From
 * outside, glass shows the sky, not the room — a dark panel in a wall is a hole,
 * and only something lighter than the wall around it says there is glass in it.
 */
export const GLASS = 0x93a0a6;

/** How far a squared corner stone reaches along each face it turns. */
export const QUOIN = 0.34;

/** A box with its middle at `(x, y, z)`. The workhorse of everything below. */
export function slab(
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
): THREE.BufferGeometry {
  const geometry = new THREE.BoxGeometry(w, h, d);
  geometry.translate(x, y, z);
  return geometry;
}

// --- faces ------------------------------------------------------------------

/** One wall of a block: which way it looks, where its surface is, how wide it is. */
export interface Facing {
  /** Bearing of the outward normal. `rotateY(yaw)` takes +Z to it. */
  readonly yaw: number;
  /** Distance from the block's middle out to this wall's surface. */
  readonly out: number;
  /** How wide the wall is, across the face. */
  readonly span: number;
  /** The block's middle, in world plan. */
  readonly x: number;
  readonly z: number;
}

/** The four walls of a block, by where they look. */
export function faces(
  x: number,
  z: number,
  width: number,
  depth: number,
): { front: Facing; back: Facing; right: Facing; left: Facing } {
  return {
    front: { yaw: 0, out: depth / 2, span: width, x, z },
    back: { yaw: Math.PI, out: depth / 2, span: width, x, z },
    right: { yaw: Math.PI / 2, out: width / 2, span: depth, x, z },
    left: { yaw: -Math.PI / 2, out: width / 2, span: depth, x, z },
  };
}

/** The same face pushed out or pulled in — an upper storey jettied over a lower. */
export function proud(face: Facing, by: number, span = face.span): Facing {
  return { yaw: face.yaw, out: face.out + by, span, x: face.x, z: face.z };
}

/**
 * Turns pieces authored in the canonical face frame onto a wall.
 *
 * `rotateY(yaw)` takes the frame's +Z — the direction everything stands proud
 * in — to the wall's outward normal, and the translate then pushes the lot out
 * to where that wall's surface is. Rotate first: the other order would turn
 * each piece about the block's middle instead of its own.
 */
export function onFace(parts: Part[], face: Facing): Part[] {
  const nx = Math.sin(face.yaw);
  const nz = Math.cos(face.yaw);
  for (const part of parts) {
    part.geometry.rotateY(face.yaw);
    part.geometry.translate(face.x + nx * face.out, 0, face.z + nz * face.out);
  }
  return parts;
}

/** Where a point `at` along a face lands in world plan, once `onFace` has run. */
export function facePoint(face: Facing, at: number): { x: number; z: number } {
  const c = Math.cos(face.yaw);
  const s = Math.sin(face.yaw);
  return { x: face.x + at * c + face.out * s, z: face.z - at * s + face.out * c };
}

// --- doorways ---------------------------------------------------------------

/**
 * Where a door goes, in the building's own space.
 *
 * Recorded rather than recomputed by whoever places the door: an opening's
 * position depends on the whole run of numbers above it, and arithmetic done
 * outside the builder would drift the moment any of them changed.
 */
export interface Doorway {
  x: number;
  z: number;
  /** Height of the threshold. Zero on the ground; a loft door is up in a gable. */
  y?: number;
  /** Outward normal of the wall it is in. `rotateY(yaw)` takes +Z to it. */
  yaw: number;
  width: number;
  height: number;
}

export function markDoorways(mesh: THREE.Mesh, ways: readonly Doorway[], scale = 1): void {
  mesh.userData.doorways = ways.map((way) => ({
    x: way.x * scale,
    z: way.z * scale,
    y: (way.y ?? 0) * scale,
    yaw: way.yaw,
    width: way.width * scale,
    height: way.height * scale,
  }));
}

/** Reads the doorways back off a mesh. Empty for anything that is not a building. */
export function doorways(mesh: THREE.Mesh): Doorway[] {
  return (mesh.userData.doorways as Doorway[] | undefined) ?? [];
}

/**
 * Where a door leaf stands in front of a doorway, `by` clear of the wall.
 *
 * Out along the doorway's own normal rather than along +Z. A church's west door
 * is in a wall facing nothing like the front, and arithmetic that assumed
 * otherwise would put it inside the building.
 */
export function doorwayFront(way: Doorway, by: number): { x: number; z: number } {
  return { x: way.x + Math.sin(way.yaw) * by, z: way.z + Math.cos(way.yaw) * by };
}

// --- walls ------------------------------------------------------------------

/**
 * The depth ladder, out from the wall's own surface at z = 0.
 *
 * **Every number here is different from every other number here, and that is the
 * whole point of the list.** Two box faces on one plane is a z-fight, and it does
 * not matter whether the two boxes belong to the same part of the building — a
 * course band and a corner stone, a jamb and the sill under it, a shutter and the
 * ledge nailed across it. So each layer gets a back and a front of its own, and
 * anything new must take a pair not already in this list.
 *
 * Openings sit **in front of** the skin rather than behind it: the skin is drawn
 * across the whole face — a course of stone does not know a window is coming —
 * so anything set behind it is a window with masonry laid over the glass. Depth
 * is read from the dressings standing proud of the light, not from the light
 * standing back from the wall.
 */
const CORNER_AT = 0.07;
/**
 * A corner post stands prouder than a quoin.
 *
 * They meet on the manor, where a stone ground storey carries a framed upper
 * one: at the same depth the post's foot and the topmost quoin had one outer
 * plane between them, and that corner flickered.
 */
const POST_AT = 0.09;
const SKIN_BACK = -0.03;
/** How proud the wall's own uprights — studs, boards, courses — stand. */
const SKIN_AT = 0.045;
/** The horizontals stand a little prouder, as they do in a real frame. */
const RAIL_BACK = -0.022;
const RAIL_AT = 0.06;
const OPENING_BACK = 0.01;
const OPENING_AT = 0.08;
const GLASS_BACK = 0.085;
const GLASS_AT = 0.105;
const CAME_BACK = 0.11;
const CAME_AT = 0.14;
const JAMB_BACK = 0.015;
const JAMB_AT = 0.175;
const HEAD_BACK = 0.025;
const HEAD_AT = 0.195;
const SILL_BACK = 0.035;
const SILL_AT = 0.25;
const SHUTTER_BACK = 0.2;
const SHUTTER_AT = 0.245;
const LEDGE_BACK = 0.23;
const LEDGE_AT = 0.275;

/**
 * How far below the ground anything standing on it reaches.
 *
 * A threshold, a jamb foot and the plinth all had their underside on y = 0, and
 * three coplanar faces on the ground plane is what made every base trim flicker
 * against every doorway.
 */
const FOOT = -0.07;

/** A slab spanning a depth range, rather than one given a middle and a thickness. */
function layer(w: number, h: number, back: number, front: number, x: number, y: number): THREE.BufferGeometry {
  return slab(w, h, front - back, x, y, (back + front) / 2);
}

/** How wide a corner post is, on every framed and boarded wall. */
const POST = 0.26;

/**
 * Timber frame: a heavy perimeter, one or two mid posts, and big panels.
 *
 * **Few members and thick ones.** This was a rank of thin studs at half-metre
 * centres — close studding, which is a real thing and reads at this scale as a
 * picket fence glued to a wall. What a framed wall actually shows from across a
 * street is a bold rectangle of sill, plate and corner posts, divided into two
 * or three big panels by a stout mid post, with one horizontal rail across each
 * panel and a raking brace in the end ones. That is six or eight pieces of oak,
 * not twenty, and every one of them is wide enough to read as a beam.
 *
 * The corner posts are not here — `block` puts one at each corner, once, for the
 * same reason it does the quoins: two walls each raising their own post at the
 * corner they share is two posts in the same place.
 *
 * Uprights and horizontals sit at **different depths**, so a rail crossing a
 * stud is two solids meeting rather than two coplanar faces flickering.
 */
function framing(rng: Rng, look: Look, span: number, low: number, high: number): Part[] {
  const parts: Part[] = [];
  const half = span / 2;
  const beam = 0.26;
  const post = 0.24;
  const footY = low + beam;
  const headY = high - beam;
  const storey = headY - footY;
  if (storey <= 0.35 || span < 0.8) return parts;

  // The perimeter: sill along the bottom, plate along the top.
  for (const y of [low + beam / 2, high - beam / 2]) {
    parts.push({ geometry: layer(span, beam, RAIL_BACK, RAIL_AT, 0, y), color: look.timberDark });
  }

  // Two or three panels on a normal wall. `studs` is what a building says when
  // it wants them closer together than that.
  const bays = Math.max(1, Math.round(span / (look.studs ?? 2.7)));
  const step = span / bays;
  const upright = (x: number, w: number, colour: number): void => {
    // Run into both rails, so no end face lands on a rail's face.
    parts.push({
      geometry: layer(w, storey + 0.12, SKIN_BACK, SKIN_AT, x, footY + storey / 2),
      color: colour,
    });
  };
  for (let i = 1; i < bays; i++) upright(-half + i * step, post, look.timberDark);

  for (let i = 0; i < bays; i++) {
    const middle = -half + (i + 0.5) * step;
    const panel = step - post;
    // The rail runs into the posts either side of it for the same reason.
    parts.push({
      geometry: layer(panel + 0.12, 0.2, RAIL_BACK, RAIL_AT, middle, footY + storey * 0.55),
      color: look.timber,
    });

    const ends: number[] = [];
    if (i === 0) ends.push(-1);
    if (i === bays - 1) ends.push(1);
    if (ends.length === 0) {
      // An interior panel gets a stud down the middle of it, crossing the rail.
      upright(middle, 0.22, look.timber);
      continue;
    }
    for (const side of ends) {
      // **A corner brace cuts across the corner**, foot on the post and head on
      // the plate. Its axis foot-to-head is `(−side, 1)/√2`, and `rotateZ(θ)`
      // takes +Y to `(−sin θ, cos θ)`, so θ = +side·π/4. A little long at both
      // ends so it dies into the plate rather than stopping on its face.
      const reach = Math.min(panel * 0.8, storey * 0.4);
      if (reach < 0.35) continue;
      const brace = layer(0.22, reach * Math.SQRT2 + 0.14, SKIN_BACK, SKIN_AT, 0, 0);
      brace.rotateZ((side * Math.PI) / 4);
      brace.translate(side * (half - 0.12 - reach / 2), headY - reach / 2, 0);
      parts.push({ geometry: brace, color: look.timber });
    }
  }
  void rng;
  return parts;
}

/**
 * How many courses a stone wall of this height is laid in.
 *
 * Not rolled: the face blocks and the corner quoins are built separately and
 * have to land on the same beds, so the count has to be something both can work
 * out from the same two numbers.
 */
function courses(low: number, high: number): number {
  return Math.min(13, Math.max(2, Math.round((high - low) / 0.44)));
}

/**
 * Stone: a field of coursed blocks, running under the quoins at each end.
 *
 * Blocks, not bands. A course drawn as one long slab is a stripe, and a wall of
 * stripes reads as a painted texture however many of them there are — what says
 * masonry is the **vertical** joint, which only exists if the course is cut into
 * stones. So each course is walked across in blocks of random length with a
 * joint's gap between them, and every course starts at a different point so the
 * joints never line up from one to the next.
 */
function coursing(rng: Rng, look: Look, span: number, low: number, high: number): Part[] {
  const parts: Part[] = [];
  // Under the quoins rather than up to them: a block ending exactly on a quoin's
  // inner face put the two on one plane all the way up every corner.
  const field = span - (QUOIN * 0.58 - 0.09) * 2;
  if (field < 0.4) return parts;

  const rows = courses(low, high);
  const step = (high - low) / rows;
  const joint = 0.035;

  for (let i = 0; i < rows; i++) {
    const bed = low + i * step;
    let x = -field / 2;
    let first = true;
    while (x < field / 2 - 0.05) {
      const want = first ? rng.range(0.35, 1.0) : rng.range(0.55, 1.35);
      const w = Math.min(want, field / 2 - x);
      first = false;
      parts.push({
        geometry: layer(w - joint, step - joint, SKIN_BACK, SKIN_AT, x + w / 2, bed + step / 2),
        color: shade(look.stone, rng.around(1, 0.1)),
        detail: 0.04,
        detailTint: look.stone,
      });
      x += w;
    }
  }
  return parts;
}

/**
 * The squared corner stones, alternating which face they run along.
 *
 * Built once per corner in the block's own space rather than twice per face —
 * two skins each laying their own corner stone put two stones in the same cubic
 * foot, and the pair flickered against each other the whole height of the wall.
 *
 * **Shorter than the course they sit in.** At exactly the course height their
 * beds were the same two planes as the field's, which is the same fight one step
 * along; a quoin that stands a little inside its own course has neither.
 */
function quoins(
  rng: Rng,
  look: Look,
  x: number,
  z: number,
  width: number,
  depth: number,
  low: number,
  /** The skin's top, not the wall head — a quoin run to the head goes through the roof. */
  high: number,
  corners: readonly (readonly [number, number])[],
): Part[] {
  const parts: Part[] = [];
  const rows = courses(low, high);
  const step = (high - low) / rows;

  for (const [sx, sz] of corners) {
    {
      for (let i = 0; i < rows; i++) {
        // Long one way, short the other, swapping every course: that alternation
        // is the whole of what a quoin looks like.
        const long = i % 2 === 0;
        const lx = long ? QUOIN : QUOIN * 0.58;
        const lz = long ? QUOIN * 0.58 : QUOIN;
        parts.push({
          geometry: slab(
            lx + CORNER_AT,
            step - 0.075,
            lz + CORNER_AT,
            x + sx * (width / 2 - lx / 2 + CORNER_AT / 2),
            low + (i + 0.5) * step,
            z + sz * (depth / 2 - lz / 2 + CORNER_AT / 2),
          ),
          color: shade(look.stoneDark, rng.around(1, 0.08)),
        });
      }
    }
  }
  return parts;
}

/** Vertical boarding with the odd gap left open: a barn's walls, and its vents. */
function boarding(rng: Rng, look: Look, span: number, low: number, high: number): Part[] {
  const parts: Part[] = [];
  // Under the corner posts, not up to them — see `coursing`.
  const field = span - (POST - 0.06) * 2;
  if (field < 0.3) return parts;
  const boards = Math.max(2, Math.round(field / rng.range(0.23, 0.3)));
  const step = field / boards;

  for (let i = 0; i < boards; i++) {
    // Every so often a board is left out, which is the whole of how a barn is
    // ventilated: the slit is a missing board, not a hole cut in one.
    if (rng.chance(0.1)) continue;
    parts.push({
      geometry: layer(step * 0.88, high - low, SKIN_BACK, SKIN_AT, -field / 2 + (i + 0.5) * step, (low + high) / 2),
      color: shade(look.wall, rng.around(1, 0.12)),
      detail: 0.04,
      detailTint: look.wall,
    });
  }

  for (const y of [low + 0.16, high - 0.18]) {
    parts.push({
      geometry: layer(field, 0.18, RAIL_BACK, RAIL_AT, 0, y),
      color: look.timberDark,
    });
  }
  return parts;
}

/**
 * A post standing in each corner, proud on both walls that meet there.
 *
 * The frame's answer to the quoin, and there for the same reason. It runs a
 * little past the skin at both ends, so its own end faces are inside the plinth
 * below and the roof above rather than on their faces.
 */
function cornerPosts(
  look: Look,
  x: number,
  z: number,
  width: number,
  depth: number,
  low: number,
  high: number,
  corners: readonly (readonly [number, number])[],
): Part[] {
  const parts: Part[] = [];
  for (const [sx, sz] of corners) {
    {
      parts.push({
        geometry: slab(
          POST + POST_AT,
          high - low + 0.1,
          POST + POST_AT,
          x + sx * (width / 2 - POST / 2 + POST_AT / 2),
          (low + high) / 2 - 0.01,
          z + sz * (depth / 2 - POST / 2 + POST_AT / 2),
        ),
        color: look.timberDark,
      });
    }
  }
  return parts;
}

/** Whichever of the three this building is made of. In the face frame. */
export function walling(rng: Rng, look: Look, span: number, low: number, high: number): Part[] {
  if (look.walling === 'frame') return framing(rng, look, span, low, high);
  if (look.walling === 'stone') return coursing(rng, look, span, low, high);
  return boarding(rng, look, span, low, high);
}

// --- roofs ------------------------------------------------------------------

/** How far the ridge stands above the eave, for a roof of this span and pitch. */
export function ridgeHeight(span: number, pitch: number): number {
  return (span / 2) * Math.tan(pitch);
}

/**
 * How thick the covering is.
 *
 * Not rolled, because the loft under it has to be built to fit *beneath* this
 * exact number — a gable leaf sized against a different thickness from the one
 * the slope came out at is a triangle poking through its own roof.
 */
export function roofThickness(kind: RoofKind): number {
  return kind === 'thatch' ? 0.34 : 0.085;
}

/**
 * The most an eave may hang below the wall head it springs from.
 *
 * The overhang is stated horizontally, and the drop is that times the pitch —
 * so on a steep thatched roof a 90 cm oversail put the eave a metre and a half
 * below the wall plate, which is under head height and straight through the
 * door frame. Deep eaves are a real thing and this is what bounds them.
 */
const MAX_EAVE_DROP = 0.5;

export interface RoofOptions {
  /** Across the slopes, wall face to wall face. */
  span: number;
  /** Along the ridge, gable face to gable face. */
  run: number;
  /** Height of the wall head the rafters sit on. */
  eave: number;
  pitch: number;
  /** How far the slope oversails the eaves wall, measured horizontally. */
  overEave: number;
  /** How far it oversails the gable ends. */
  overGable: number;
  /** Thickness of the covering. `roofThickness`, carried so the loft can fit it. */
  thick: number;
  ridge?: Ridge;
  look: Look;
  x?: number;
  z?: number;
}

/**
 * A pitched roof of two slopes.
 *
 * Each slope is a slab whose **top surface** lies on the rafter plane. That
 * plane passes through the wall head at the wall face and carries on out and
 * *down* past it, so the eave hangs below the wall head — that drop and the
 * shadow under it are what stop a roof reading as a lid.
 *
 * Built with the ridge along X and turned a quarter afterwards if it runs the
 * other way, so there is one construction here rather than two.
 */
export function roof(rng: Rng, o: RoofOptions): Part[] {
  const parts: Part[] = [];
  const half = o.span / 2;
  const grad = Math.tan(o.pitch);
  const reach = half + o.overEave;
  const length = o.run + o.overGable * 2;
  const thick = o.thick;
  const slopeLength = reach / Math.cos(o.pitch);
  const crown = o.eave + half * grad;

  /**
   * The middle of one slope's rafter plane, lifted `by` along that plane's
   * normal. After `rotateX(side·pitch)` the slab's +Y points to
   * `(0, cos p, side·sin p)`, so a lift moves it that way — negative to drop
   * the slab under the plane, positive to sit a batten on top of it.
   */
  const seat = (side: number, by: number): [number, number] => [
    o.eave + (grad * (half - o.overEave)) / 2 + by * Math.cos(o.pitch),
    side * (reach / 2 + by * Math.sin(o.pitch)),
  ];

  for (const side of [-1, 1]) {
    const slope = slab(length, thick, slopeLength, 0, 0, 0);
    slope.rotateX(side * o.pitch);
    const [sy, sz] = seat(side, -thick / 2);
    slope.translate(0, sy, sz);
    parts.push({ geometry: slope, color: shade(o.look.roof, rng.around(1, 0.05)) });

    if (o.look.roofKind === 'thatch') {
      // Thatch has no edge — the butts are dressed round into a roll. One
      // cylinder along the eave is the difference between straw and a plank.
      // A little longer than the slope it lies on. At the same length its end
      // caps were the same two planes as the slabs' and fought at both verges.
      const roll = new THREE.CylinderGeometry(thick * 0.58, thick * 0.58, length + 0.06, 7);
      roll.rotateZ(Math.PI / 2);
      roll.translate(0, o.eave - o.overEave * grad - thick * 0.22, side * reach);
      parts.push({ geometry: roll, color: shade(o.look.roof, 0.92) });
    } else {
      // Courses across the slope, and a barge board down each gable edge —
      // what a tiled roof has instead of the roll: a grain, and a hard edge.
      const rows = Math.max(3, Math.floor(slopeLength / rng.range(0.3, 0.42)));
      const [by, bz] = seat(side, thick / 2 + 0.015);
      for (let i = 1; i < rows; i++) {
        // Short of the slab's own ends, so the batten's end caps are not in the
        // same plane as the roof's.
        const batten = slab(length - 0.04, 0.03, 0.055, 0, 0, (i / rows) * slopeLength - slopeLength / 2);
        batten.rotateX(side * o.pitch);
        batten.translate(0, by, bz);
        parts.push({
          geometry: batten,
          color: shade(o.look.roof, rng.range(0.78, 0.92)),
          detail: 0.03,
          detailTint: o.look.roof,
        });
      }

      const [gy, gz] = seat(side, -thick / 2 - 0.09);
      for (const end of [-1, 1]) {
        // Straddling the slab's edge rather than sitting flush inside it: at
        // `length/2 − 0.03` with a width of 0.06 its outer face landed exactly
        // on the slab's end face, and the two fought down the whole verge.
        const barge = slab(0.09, 0.2, slopeLength, end * (length / 2 + 0.015), 0, 0);
        barge.rotateX(side * o.pitch);
        barge.translate(0, gy, gz);
        parts.push({ geometry: barge, color: o.look.timberDark });
      }
    }
  }

  if (o.look.roofKind === 'thatch') {
    const roll = new THREE.CylinderGeometry(thick * 0.72, thick * 0.72, length + 0.06, 7);
    roll.rotateZ(Math.PI / 2);
    roll.translate(0, crown - thick * 0.2, 0);
    parts.push({ geometry: roll, color: shade(o.look.roof, 0.85) });
  } else {
    // A course of ridge capping: a three-sided prism laid apex up over the join.
    //
    // `rotateZ(π/2)` lays the cylinder's axis along X and leaves its section in
    // the YZ plane with a vertex at +Z and the opposite flat side facing −Z.
    // `rotateX(−π/2)` then turns that section a quarter: the flat side comes to
    // face −Y and the vertex points up. **A sixth of a turn was what this had,
    // which left the prism lying on a corner across the ridge and flickering
    // against both slopes down its whole length.**
    const r = 0.16;
    const cap = new THREE.CylinderGeometry(r, r, length + 0.06, 3);
    cap.rotateZ(Math.PI / 2);
    cap.rotateX(-Math.PI / 2);
    cap.translate(0, crown - 0.08 + r / 2, 0);
    parts.push({ geometry: cap, color: shade(o.look.roof, 0.8) });
  }

  for (const part of parts) {
    if (o.ridge === 'z') part.geometry.rotateY(Math.PI / 2);
    part.geometry.translate(o.x ?? 0, 0, o.z ?? 0);
  }
  return parts;
}

/**
 * The wall above the eave at a gable end.
 *
 * **Built to the roof's underside, not to the rafter plane.** The obvious
 * triangle — base on the wall head, apex on the ridge — has its two sloping
 * faces exactly where the slabs' top surfaces are, so the gable and the whole
 * roof occupy the same two planes and flicker against each other everywhere.
 * Dropping the apex by the covering's vertical thickness puts the leaf under
 * the roof, which is where a gable wall actually stops; the base narrows to
 * suit, and the slope's own overhang covers what that leaves at the eaves.
 *
 * `solid` fills the whole loft with one prism — cheapest, and nothing can be
 * seen into it. A block open at the eaves takes `gables` instead and gets a leaf
 * at each end only, so you can look up into the roof, which is what an
 * open-fronted stable or a cart porch actually shows you.
 */
export type Loft = 'solid' | 'gables' | 'none';

export function gables(rng: Rng, o: RoofOptions, kind: Loft): Part[] {
  if (kind === 'none') return [];
  const half = o.span / 2;
  const rise = ridgeHeight(o.span, o.pitch);
  const under = o.thick / Math.cos(o.pitch) + 0.02;
  if (rise <= under + 0.05) return [];
  const w = half * (1 - under / rise);

  // Wound anticlockwise in the profile plane, which `prism` extrudes along its
  // own +Z.
  const profile: Cell = [
    { x: -w, y: o.eave - 0.06 },
    { x: w, y: o.eave - 0.06 },
    { x: 0, y: o.eave + rise - under },
  ];

  const parts: Part[] = [];
  const thickness = kind === 'solid' ? o.run : rng.range(0.22, 0.3);
  for (const end of kind === 'solid' ? [0] : [-1, 1]) {
    const leaf = prism(profile, thickness);
    // A quarter turn takes the extrusion to +X, which stands the leaf across a
    // ridge running along X; a half turn leaves it on Z, for a ridge running
    // that way. The triangle is symmetric about the profile's x, so the
    // mirroring either turn causes costs nothing.
    leaf.rotateY(o.ridge === 'z' ? Math.PI : Math.PI / 2);
    const along = end * (o.run / 2 - thickness / 2);
    if (o.ridge === 'z') leaf.translate(0, 0, along);
    else leaf.translate(along, 0, 0);
    leaf.translate(o.x ?? 0, 0, o.z ?? 0);
    parts.push({ geometry: leaf, color: o.look.wall });
  }
  return parts;
}

/** The gable end as a face, for putting a loft opening or a louvre on it. */
export function gableFace(o: RoofOptions, end: 1 | -1): Facing {
  const yaw = o.ridge === 'z' ? (end > 0 ? 0 : Math.PI) : (end * Math.PI) / 2;
  return { yaw, out: o.run / 2, span: o.span, x: o.x ?? 0, z: o.z ?? 0 };
}

// --- a block ----------------------------------------------------------------

export interface BlockOptions {
  /** Middle of the block in plan. */
  x?: number;
  z?: number;
  width: number;
  depth: number;
  /** Where the walls start. An upper storey says the floor it stands on. */
  base?: number;
  /**
   * How much stone footing is drawn below `base`. Defaults to all of it, which
   * is what a ground storey wants; an upper storey passes 0 and stands on the
   * jetty instead.
   */
  plinth?: number;
  /** The wall head. */
  eave: number;
  pitch: number;
  ridge?: Ridge;
  overEave?: number;
  overGable?: number;
  loft?: Loft;
  /** Yaws of walls left out — an open porch front, a stable's eaves side. */
  open?: readonly number[];
  /**
   * Yaws of walls built hard against another block of the same building.
   *
   * The wall itself stays — something has to close the box — but it gets no skin
   * and neither of its corners gets a quoin or a post, because the block on the
   * other side is drawing all of that on the very same planes. Two ranges of an
   * L-plan house meeting at a right angle is exactly this, and without it every
   * course on the shared walls is laid twice.
   */
  joins?: readonly number[];
  /** Skip the roof, for a wing another block's roof already covers. */
  roofless?: boolean;
  thickness?: number;
  look: Look;
}

/** What a block came out as, so its own roof can be measured rather than guessed. */
export interface Block {
  parts: Part[];
  wall: ReturnType<typeof faces>;
  /** How far the ridge stands above the ground. */
  crown: number;
  /**
   * The highest an opening's head may reach on this block's walls.
   *
   * **Not the eave.** The rafter plane crosses the wall face below the wall head
   * by the covering's vertical thickness, and lower again out at the depth a
   * lintel or an arch actually stands — so a door or a window sized against the
   * eave comes out through the slope. Deep thatch eats the best part of a metre
   * of wall this way, which is why a thatched building needs a taller wall than
   * it looks like it should. Measure openings against this.
   */
  head: number;
  roof: RoofOptions;
}

/**
 * A plinth, four walls, a loft and a roof: one wing of a building.
 *
 * Walls are four separate slabs rather than one hollow shell so a face can be
 * left out — and because a slab is still a closed box, looking into an open
 * porch shows the inside of the walls around it rather than through them. The
 * two pairs stop against each other rather than crossing: the ±X walls run the
 * full depth and the ±Z walls stop at their inner faces, so the corner is a butt
 * joint and no two surfaces share a plane.
 */
export function block(rng: Rng, o: BlockOptions): Block {
  const parts: Part[] = [];
  const x = o.x ?? 0;
  const z = o.z ?? 0;
  const base = o.base ?? 0;
  // Thick walls on a small block eat the whole face, so it is bounded by the
  // block as well as by the material.
  const t = o.thickness ?? Math.min(o.look.walling === 'stone' ? 0.36 : 0.24, Math.min(o.width, o.depth) * 0.13);
  const open = o.open ?? [];
  const ridge = o.ridge ?? 'x';
  const wall = faces(x, z, o.width, o.depth);

  const plinth = o.plinth ?? base;
  if (plinth > 0) {
    parts.push({
      geometry: slab(o.width + 0.19, plinth, o.depth + 0.19, x, base - plinth / 2, z),
      color: o.look.stoneDark,
    });
  }

  // Compared the long way round the circle, so −π/2 and 3π/2 are one wall.
  const sameWay = (a: number, b: number): boolean =>
    Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))) < 0.01;

  /**
   * Where the skin has to stop, which is **below the wall head**.
   *
   * The rafter plane meets the wall face at the head and carries on down past
   * it, so the roof's *underside* crosses the face lower than that — by the
   * covering's vertical thickness, and lower again out at the skin's own proud
   * depth. A course band or a board run all the way to the head therefore comes
   * out through the slope, which is what put siding above the roof on every
   * thatched building in the kit. The wall body itself still runs to the head;
   * it is buried in the slab, and only the proud skin was showing.
   */
  /**
   * A storey standing on another one runs a little *into* it.
   *
   * Its wall's underside and the lower storey's skin both stopped on the floor
   * level between them, two faces on one plane the whole way round the building.
   * Six centimetres of overlap and the join is buried instead.
   */
  // Always into whatever is underneath, plinth or lower storey alike: the wall's
  // underside and the plinth's top were the same plane the whole way round.
  const bodyLow = base - 0.06;
  const skinLow = base - 0.03;

  const skinTop = o.roofless
    ? o.eave
    : Math.max(
        base + 0.3,
        o.eave -
          roofThickness(o.look.roofKind) / Math.cos(o.pitch) -
          CORNER_AT * Math.tan(o.pitch) -
          0.04,
      );

  const joins = o.joins ?? [];
  const absent = (yaw: number): boolean => open.some((y) => sameWay(y, yaw));
  const buried = (yaw: number): boolean => absent(yaw) || joins.some((y) => sameWay(y, yaw));

  for (const face of [wall.front, wall.back, wall.right, wall.left]) {
    if (absent(face.yaw)) continue;
    // The ±X walls run the full depth and the ±Z walls stop at their inner
    // faces, so the corner is a butt joint. **The skin still runs the whole
    // face**: the corner is solid either way, so a course band or a board that
    // stops where the *body* stops leaves a bare strip at every corner.
    const short = Math.abs(Math.cos(face.yaw)) > 0.5;
    parts.push(
      ...onFace(
        [
          {
            geometry: slab(short ? face.span - t * 2 : face.span, o.eave - bodyLow, t, 0, (bodyLow + o.eave) / 2, -t / 2),
            color: o.look.wall,
          },
          ...(buried(face.yaw) ? [] : walling(rng, o.look, face.span, skinLow, skinTop)),
        ],
        face,
      ),
    );
  }

  // The corners, once each, in the block's own space.
  // Every corner whose two walls are both real and both this block's own. To the
  // skin's top, not the wall head: a quoin or a corner post is as proud as the
  // rest of the skin and goes through the slope for the same reason.
  const corners: [number, number][] = [];
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      if (buried((sx * Math.PI) / 2) || buried(sz > 0 ? 0 : Math.PI)) continue;
      corners.push([sx, sz]);
    }
  }
  if (corners.length > 0) {
    parts.push(
      ...(o.look.walling === 'stone'
        ? quoins(rng, o.look, x, z, o.width, o.depth, skinLow, skinTop, corners)
        : cornerPosts(o.look, x, z, o.width, o.depth, skinLow, skinTop, corners)),
    );
  }

  const thatch = o.look.roofKind === 'thatch';
  const wanted = o.overEave ?? (thatch ? 0.6 : 0.35);
  const plan: RoofOptions = {
    span: ridge === 'x' ? o.depth : o.width,
    run: ridge === 'x' ? o.width : o.depth,
    eave: o.eave,
    pitch: o.pitch,
    overEave: Math.min(wanted, MAX_EAVE_DROP / Math.tan(o.pitch)),
    overGable: o.overGable ?? (thatch ? 0.25 : 0.2),
    thick: roofThickness(o.look.roofKind),
    ridge,
    look: o.look,
    x,
    z,
  };

  if (!o.roofless) {
    parts.push(...gables(rng, plan, o.loft ?? 'solid'));
    parts.push(...roof(rng, plan));
  }

  // Measured at the lintel's own depth rather than the dressings' — the head of
  // a doorway is deliberately the shallowest part of its frame, so that it is
  // the one that has to duck lowest.
  const head = o.roofless
    ? o.eave
    : Math.max(
        base + 0.5,
        o.eave - roofThickness(o.look.roofKind) / Math.cos(o.pitch) - 0.1 * Math.tan(o.pitch) - 0.05,
      );

  return { parts, wall, crown: o.eave + ridgeHeight(plan.span, o.pitch), head, roof: plan };
}

// --- openings ---------------------------------------------------------------
//
// All of these are authored in the face frame and handed to `onFace`. The
// depths they sit at are deliberate and stacked: the reveal is the deepest, the
// glass sits in front of it, the cames in front of that, and every dressing
// stands proud of the wall. No two of them share a plane.

export interface OpeningOptions {
  /** Where along the face, from its middle. */
  at: number;
  /** Height of the opening's foot above the ground. */
  sill: number;
  width: number;
  height: number;
  look: Look;
}

/**
 * The dark of an opening — a hole, a shop front, a cart doorway.
 *
 * Reaches a little below its own sill line so its underside is inside the stone
 * sill rather than on top of it.
 */
export function opening(at: number, sill: number, width: number, height: number): Part {
  return {
    geometry: layer(width, height + 0.08, OPENING_BACK, OPENING_AT, at, sill + height / 2),
    color: RECESS,
  };
}

/**
 * A leaded light: pale glass, and the cames holding it in.
 *
 * In front of the dark and behind the dressings, so a rebate of shadow shows
 * round it and the frame stands proud of it.
 */
export function glazing(
  at: number,
  sill: number,
  width: number,
  height: number,
  look: Look,
): Part[] {
  const w = Math.max(width - 0.09, 0.1);
  const h = Math.max(height - 0.09, 0.1);
  const middle = sill + height / 2;
  const parts: Part[] = [
    { geometry: layer(w, h, GLASS_BACK, GLASS_AT, at, middle), color: GLASS },
  ];
  const cols = Math.max(1, Math.round(w / 0.19));
  const rows = Math.max(1, Math.round(h / 0.23));
  const came = (cw: number, ch: number, cx: number, cy: number): void => {
    parts.push({
      geometry: layer(cw, ch, CAME_BACK, CAME_AT, cx, cy),
      color: look.timberDark,
      detail: 0.024,
      detailTint: GLASS,
    });
  };
  for (let i = 1; i < cols; i++) came(0.024, h, at - w / 2 + (i / cols) * w, middle);
  for (let i = 1; i < rows; i++) came(w, 0.024, at, middle - h / 2 + (i / rows) * h);
  return parts;
}

/**
 * A ring of voussoirs over an opening: a real arch.
 *
 * **Each stone is a wedge, cut on its own two radial joints.** It was a box,
 * turned to point along its radius — and a box is the one shape a voussoir
 * cannot be: its sides are parallel, so where the ring curves they run into
 * their neighbours, and since every one of them shared a front plane each
 * overlap was two faces fighting. Staggering how far they stood out hid that
 * and was not a fix; it made a ragged ring out of a flush one.
 *
 * A voussoir is the quadrilateral between two radii and two arcs, so that is
 * what is built: four corners, extruded through the ring's depth by `prism`.
 * Adjacent stones then share a radial plane and are pulled a joint's width back
 * off it, so they touch nowhere at all and the joint between them is the mortar
 * rather than an artefact.
 *
 * Wound anticlockwise — inner then outer at the first radius, back along the
 * second — because that is what `prism` needs to face its sides outward.
 *
 * The count is forced **odd**, so one stone sits square on the crown. That stone
 * is the keystone, and an arch without one reads as a hole with a border.
 */
function arch(rng: Rng, look: Look, at: number, springing: number, radius: number): Part[] {
  const parts: Part[] = [];
  const ring = 0.3;
  const inner = radius - ring / 2;
  const outer = radius + ring / 2;
  let stones = Math.max(7, Math.round((Math.PI * radius) / 0.28));
  if (stones % 2 === 0) stones += 1;
  // Half a joint, as an angle at this radius.
  const joint = 0.013 / radius;

  for (let i = 0; i < stones; i++) {
    const a0 = (i / stones) * Math.PI + joint;
    const a1 = ((i + 1) / stones) * Math.PI - joint;
    const corner = (a: number, r: number): { x: number; y: number } => ({
      x: at + Math.cos(a) * r,
      y: springing + Math.sin(a) * r,
    });
    const stone = prism(
      [corner(a0, inner), corner(a0, outer), corner(a1, outer), corner(a1, inner)],
      JAMB_AT - JAMB_BACK,
    );
    stone.translate(0, 0, (JAMB_BACK + JAMB_AT) / 2);
    parts.push({ geometry: stone, color: shade(look.stone, rng.around(1, 0.07)) });
  }
  return parts;
}

/**
 * The upper half of a disc standing in the wall plane — the dark inside a round
 * head, so an arch is a hole and not a lid.
 *
 * A cylinder's points are `(r sin t, +-h/2, r cos t)`, and `rotateX(pi/2)` takes
 * them to `(r sin t, -r cos t, +-h/2)` — the disc into the wall plane with its
 * thickness through the wall. The top half is therefore where `cos t <= 0`,
 * which is the half turn starting at pi/2.
 */
function halfDisc(radius: number, x: number, y: number): THREE.BufferGeometry {
  const disc = new THREE.CylinderGeometry(
    radius,
    radius,
    OPENING_AT - OPENING_BACK,
    12,
    1,
    false,
    Math.PI / 2,
    Math.PI,
  );
  disc.rotateX(Math.PI / 2);
  disc.translate(x, y, (OPENING_BACK + OPENING_AT) / 2);
  return disc;
}

/**
 * The dressings round an opening: two jambs, a head and a sill.
 *
 * Three depths, not one. The jamb's top used to end on the head's underside and
 * its foot on the sill's — same plane, same depth, both fighting — so the head
 * and the sill now stand progressively prouder and the jamb dies into each of
 * them instead of meeting it.
 */
function dressing(o: OpeningOptions, stone = false): Part[] {
  const dress = stone || o.look.walling === 'stone' ? o.look.stoneDark : o.look.timberDark;
  const parts: Part[] = [];
  for (const side of [-1, 1]) {
    parts.push({
      geometry: layer(0.13, o.height + 0.1, JAMB_BACK, JAMB_AT, o.at + side * (o.width / 2 + 0.065), o.sill + o.height / 2 + 0.01),
      color: dress,
    });
  }
  parts.push({
    geometry: layer(o.width + 0.26, 0.12, HEAD_BACK, HEAD_AT, o.at, o.sill + o.height + 0.06),
    color: dress,
  });
  parts.push({
    geometry: layer(o.width + 0.34, 0.1, SILL_BACK, SILL_AT, o.at, o.sill - 0.055),
    color: shade(o.look.stone, 0.94),
  });
  return parts;
}

/**
 * An opening boarded over — a shop shut, a bay closed up for the winter.
 *
 * Stands exactly where the dark of an opening would, so any frame built round it
 * still reads. The difference is that you are looking at the back of a shutter
 * rather than into a room the building has not got.
 */
export function boarded(
  rng: Rng,
  at: number,
  sill: number,
  width: number,
  height: number,
  look: Look,
): Part[] {
  const parts: Part[] = [];
  const boards = Math.max(3, Math.round(width / 0.24));
  const step = width / boards;
  for (let i = 0; i < boards; i++) {
    parts.push({
      geometry: layer(step - 0.02, height, OPENING_BACK, OPENING_AT, at - width / 2 + (i + 0.5) * step, sill + height / 2),
      color: shade(look.timber, rng.around(0.88, 0.07)),
      detail: 0.02,
      detailTint: look.timber,
    });
  }
  // The ledges the boards are nailed to, which is what says shutter and not wall.
  // Narrower than the boards they cross, so their ends are not on the same
  // planes as the panel's sides.
  for (const t of [0.22, 0.78]) {
    parts.push({
      geometry: layer(width - 0.09, 0.13, GLASS_BACK, GLASS_AT, at, sill + t * height),
      color: look.timberDark,
    });
  }
  return parts;
}

/** A small glazed opening with a pair of boarded shutters folded back beside it. */
export function shuttered(rng: Rng, o: OpeningOptions): Part[] {
  const parts: Part[] = [opening(o.at, o.sill, o.width, o.height)];
  parts.push(...glazing(o.at, o.sill, o.width, o.height, o.look));
  parts.push(...dressing(o));

  if (rng.chance(0.6)) {
    const leaf = o.width * 0.44;
    for (const side of [-1, 1]) {
      // Clear of the jamb rather than butted against it.
      const x = o.at + side * (o.width / 2 + leaf / 2 + 0.19);
      parts.push({
        geometry: layer(leaf, o.height * 0.96, SHUTTER_BACK, SHUTTER_AT, x, o.sill + o.height / 2),
        color: shade(o.look.timber, rng.around(1, 0.07)),
      });
      // **Narrower than the leaf.** At the same width its ends were on the
      // leaf's own side planes and fought down both edges of every shutter.
      parts.push({
        geometry: layer(leaf - 0.06, 0.08, LEDGE_BACK, LEDGE_AT, x, o.sill + o.height * 0.74),
        color: o.look.timberDark,
      });
    }
  }
  return parts;
}

/** A larger glazed casement. A house with money. */
export function casement(rng: Rng, o: OpeningOptions): Part[] {
  const parts: Part[] = [opening(o.at, o.sill, o.width, o.height)];
  parts.push(...glazing(o.at, o.sill, o.width, o.height, o.look));
  parts.push(
    ...dressing({ ...o, look: { ...o.look, stone: shade(o.look.stone, rng.around(1, 0.05)) } }),
  );
  return parts;
}

/**
 * Stone dressings and mullions between the lights: the manor's windows.
 *
 * The mullion runs the height of the opening and stands between the jambs' depth
 * and the head's, so it crosses neither on a shared plane.
 */
export function mullioned(rng: Rng, o: OpeningOptions & { lights?: number }): Part[] {
  const parts: Part[] = [];
  const lights = o.lights ?? 2;
  const mullion = 0.14;
  const light = (o.width - mullion * (lights - 1)) / lights;

  for (let i = 0; i < lights; i++) {
    const x = o.at - o.width / 2 + light / 2 + i * (light + mullion);
    parts.push(opening(x, o.sill, light, o.height));
    parts.push(...glazing(x, o.sill, light, o.height, o.look));
  }

  for (let i = 1; i < lights; i++) {
    parts.push({
      geometry: layer(
        mullion,
        o.height + 0.06,
        JAMB_BACK + 0.004,
        JAMB_AT - 0.02,
        o.at - o.width / 2 + i * (light + mullion) - mullion / 2,
        o.sill + o.height / 2,
      ),
      color: shade(o.look.stone, rng.around(1, 0.05)),
    });
  }
  parts.push(...dressing(o, true));
  return parts;
}

/** A tall narrow window under a round head: the church's, and only the church's. */
export function lancet(rng: Rng, o: OpeningOptions): Part[] {
  const head = o.sill + o.height;
  const parts: Part[] = [opening(o.at, o.sill, o.width, o.height)];
  parts.push({ geometry: halfDisc(o.width / 2, o.at, head), color: RECESS });
  parts.push(...glazing(o.at, o.sill, o.width, o.height, o.look));
  parts.push(...arch(rng, o.look, o.at, head, o.width / 2 + 0.1));

  // Splayed reveals: the jambs widen outward, which is what makes an opening in
  // a thick wall read as thick.
  for (const side of [-1, 1]) {
    parts.push({
      geometry: layer(0.18, o.height, JAMB_BACK, JAMB_AT, o.at + side * (o.width / 2 + 0.09), o.sill + o.height / 2),
      color: shade(o.look.stone, rng.around(1, 0.06)),
    });
  }
  parts.push({
    geometry: layer(o.width + 0.44, 0.1, SILL_BACK, SILL_AT, o.at, o.sill - 0.055),
    color: o.look.stoneDark,
  });
  return parts;
}

/** Slatted boards in an opening: a belfry, a gable vent, a loft's air. */
export function louvre(rng: Rng, o: OpeningOptions): Part[] {
  const parts: Part[] = [opening(o.at, o.sill, o.width, o.height)];

  const slats = Math.max(3, Math.round(o.height / 0.16));
  for (let i = 0; i < slats; i++) {
    // A slat sheds water outward and down, so its outer edge is the lower one.
    // `rotateX(+t)` takes +Z to `(0, -sin t, cos t)`, which is exactly that.
    const board = slab(o.width * 0.94, 0.045, 0.15, 0, 0, 0);
    board.rotateX(0.5);
    board.translate(o.at, o.sill + ((i + 0.5) / slats) * o.height, GLASS_AT + 0.02);
    parts.push({ geometry: board, color: shade(o.look.timber, rng.around(1, 0.08)) });
  }
  parts.push(...dressing(o));
  return parts;
}

// --- attachments ------------------------------------------------------------

export interface ChimneyOptions {
  x: number;
  z: number;
  /** Where the stack starts — the ground for a breast, the eave for a stub. */
  foot: number;
  /** Top of the shaft, before the cap. */
  top: number;
  girth: number;
  /**
   * The gap back to the wall it belongs to, filled solid up to `top`.
   *
   * A stack has to stand clear of the roof's own oversail or the slope drives
   * straight through it and out the other side, and clear of the oversail is
   * clear of the wall as well. The breast is what a chimney has instead of that
   * gap; `span` reaches back from the stack along `−yaw`, where `yaw` is the
   * outward normal of the wall it stands against.
   */
  breast?: { span: number; top: number; yaw: number };
  look: Look;
}

/** A stone stack in two or three stages, with an oversailing cap on top. */
export function chimney(rng: Rng, o: ChimneyOptions): Part[] {
  const parts: Part[] = [];

  if (o.breast) {
    const nx = Math.sin(o.breast.yaw);
    const nz = Math.cos(o.breast.yaw);
    const back = o.girth / 2 + o.breast.span / 2 - 0.02;
    const across = Math.abs(nx) > 0.5;
    parts.push({
      geometry: slab(
        across ? o.breast.span : o.girth * 0.86,
        o.breast.top - (FOOT - 0.04),
        across ? o.girth * 0.86 : o.breast.span,
        o.x - nx * back,
        FOOT - 0.04 + (o.breast.top - FOOT + 0.04) / 2,
        o.z - nz * back,
      ),
      color: shade(o.look.stone, 0.95),
    });
  }

  const stages = o.top - o.foot > 3 ? 3 : 2;
  let y = o.foot;
  for (let i = 0; i < stages; i++) {
    const h = (o.top - o.foot) / stages;
    const g = o.girth * (1 - i * 0.1);
    // The lowest stage goes below the ground, so its underside is not on the
    // same plane as the plinth's.
    const bottom = i === 0 ? FOOT - 0.04 : y;
    parts.push({
      geometry: slab(g, y + h - bottom, g * 0.84, o.x, (bottom + y + h) / 2, o.z),
      color: shade(o.look.stone, rng.around(1, 0.06)),
    });
    // A drip course between the stages, so the taper reads as built rather than
    // as one box that got thinner.
    if (i < stages - 1) {
      parts.push({
        geometry: slab(g + 0.09, 0.09, g * 0.84 + 0.09, o.x, y + h, o.z),
        color: o.look.stoneDark,
      });
    }
    y += h;
  }

  const capGirth = o.girth * (1 - (stages - 1) * 0.1);
  parts.push({
    geometry: slab(capGirth + 0.16, 0.17, capGirth * 0.84 + 0.16, o.x, o.top + 0.045, o.z),
    color: o.look.stoneDark,
  });
  const flues = rng.chance(0.4) ? 2 : 1;
  for (let i = 0; i < flues; i++) {
    const flue = capGirth * 0.3;
    parts.push({
      geometry: slab(flue, 0.3, flue, o.x + (i === 0 ? 0 : -capGirth * 0.26), o.top + 0.24, o.z),
      color: RECESS,
    });
  }
  return parts;
}

export interface LeanToOptions {
  /** Along the parent wall, from its middle. */
  at: number;
  span: number;
  /** How far it projects from the wall. */
  out: number;
  /** Where its roof meets the parent wall, and where its eave lands. */
  high: number;
  low: number;
  /** Leave the outer wall off — an open cart shed or a smithy's working bay. */
  openFront?: boolean;
  /** Stand it on posts instead of end walls: a canopy. */
  posts?: boolean;
  look: Look;
}

/**
 * A mono-pitch outshot against a wall — a store, a byre, a working canopy.
 *
 * In the face frame, so `onFace` puts it on whichever wall it leans against.
 * The roof's outer edge is the low one, which is what `rotateX(+φ)` gives: it
 * takes the slab's +Y to `(0, cos φ, sin φ)`, tilted toward the outside.
 */
export function leanTo(rng: Rng, o: LeanToOptions): Part[] {
  const parts: Part[] = [];
  const t = 0.22;
  const drop = Math.max(o.high - o.low, 0.2);
  const angle = Math.atan2(drop, o.out);
  const half = o.span / 2;

  if (o.posts) {
    for (const side of [-1, 1]) {
      parts.push({
        geometry: slab(0.19, o.low, 0.19, o.at + side * (half - 0.1), o.low / 2, o.out - 0.14),
        color: o.look.timberDark,
      });
    }
  } else {
    for (const side of [-1, 1]) {
      // The end walls are cut to the rake of the roof; three stacked slabs of
      // stepping height are near enough at this size and cost twelve faces.
      for (let i = 0; i < 3; i++) {
        const z0 = (i / 3) * o.out;
        const z1 = ((i + 1) / 3) * o.out;
        // Measured at the step's **outer** edge, not its middle. Taking the
        // middle left the inner corner of every step standing above the rake,
        // so the end walls poked up through their own roof.
        const h = o.high - (drop * z1) / o.out - 0.05;
        parts.push({
          geometry: slab(t, h, z1 - z0, o.at + side * (half - t / 2), h / 2, (z0 + z1) / 2),
          color: o.look.wall,
        });
      }
    }
    if (!o.openFront) {
      parts.push({
        geometry: slab(o.span, o.low, t, o.at, o.low / 2, o.out - t / 2),
        color: o.look.wall,
      });
      // The outer wall's own skin. It looks the same way the face frame's +Z
      // does, so it only has to be moved out to where that wall stands.
      for (const part of walling(rng, o.look, o.span, 0, o.low)) {
        part.geometry.translate(o.at, 0, o.out);
        parts.push(part);
      }
    }
  }

  const thick = roofThickness(o.look.roofKind);
  const length = (o.out + 0.3) / Math.cos(angle);
  const slope = slab(o.span + 0.3, thick, length, 0, 0, 0);
  slope.rotateX(angle);
  // The plane runs from `high` at the wall to `low` at the outer edge and keeps
  // going for the overhang, so the middle of the slab is below the middle of the
  // two heights, not above it.
  slope.translate(
    o.at,
    (o.high + o.low) / 2 - 0.15 * Math.tan(angle) - (thick / 2) * Math.cos(angle),
    (o.out + 0.3) / 2 - (thick / 2) * Math.sin(angle),
  );
  parts.push({ geometry: slope, color: shade(o.look.roof, rng.around(1, 0.05)) });
  return parts;
}

/**
 * A pilaster buttress: two stages, the upper set back, with a weathering on each.
 *
 * **The weathering sheds away from the wall, not toward it.** In the face frame
 * +Z is out, so the slope's high side is at the building and its low side is at
 * the outer edge — which is `rotateX(+θ)`, taking +Y to `(0, cos θ, sin θ)`.
 * It was written `−θ`, which tipped every set-off on the church back into the
 * wall it was supposed to be draining.
 */
export function buttress(
  rng: Rng,
  o: { at: number; width: number; out: number; high: number; look: Look },
): Part[] {
  const parts: Part[] = [];
  const stage = o.high * 0.62;
  parts.push({
    geometry: slab(o.width, stage, o.out, o.at, stage / 2, o.out / 2),
    color: shade(o.look.stone, rng.around(1, 0.05)),
  });
  parts.push({
    geometry: slab(o.width * 0.86, o.high - stage, o.out * 0.66, o.at, (stage + o.high) / 2, (o.out * 0.66) / 2),
    color: shade(o.look.stone, rng.around(1, 0.05)),
  });
  for (const [y, out, width] of [
    [stage, o.out, o.width],
    [o.high, o.out * 0.66, o.width * 0.86],
  ] as const) {
    const weather = slab(width + 0.09, 0.11, out + 0.07, 0, 0, 0);
    weather.rotateX(0.42);
    weather.translate(o.at, y + 0.02, (out + 0.07) / 2);
    parts.push({ geometry: weather, color: o.look.stoneDark });
  }
  return parts;
}

/**
 * The bressummer and joist ends under a jettied storey.
 *
 * A jetty is the whole argument of a town house — it is what the upper floor
 * being wider than the lower one *looks* like from underneath, and without it
 * the overhang reads as a modelling mistake.
 */
export function jetty(
  rng: Rng,
  o: { at: number; span: number; y: number; out: number; look: Look },
): Part[] {
  const parts: Part[] = [];
  parts.push({
    geometry: slab(o.span, 0.29, o.out + 0.1, o.at, o.y - 0.095, o.out / 2),
    color: o.look.timberDark,
  });
  const joists = Math.max(2, Math.round(o.span / 0.55));
  for (let i = 0; i < joists; i++) {
    parts.push({
      geometry: slab(0.11, 0.16, o.out * 0.8, o.at - o.span / 2 + ((i + 0.5) / joists) * o.span, o.y - 0.33, (o.out * 0.8) / 2),
      color: shade(o.look.timber, rng.around(1, 0.06)),
    });
  }
  return parts;
}

/** A four-sided pyramid cap, for a tower. Squared up so its faces face the walls. */
export function pyramid(
  rng: Rng,
  o: { x: number; z: number; side: number; base: number; height: number; look: Look },
): Part[] {
  // `ConeGeometry` with four segments is a pyramid on a diamond plan; an eighth
  // of a turn brings its faces square with the tower under it.
  const cap = new THREE.ConeGeometry((o.side / 2) * Math.SQRT2 * 1.08, o.height, 4);
  cap.rotateY(Math.PI / 4);
  cap.translate(o.x, o.base + o.height / 2, o.z);
  return [{ geometry: cap, color: shade(o.look.roof, rng.around(1, 0.05)) }];
}
