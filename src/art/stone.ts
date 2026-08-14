import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import type { Rng } from './random';
import { PALETTE, blend, shade } from './palette';

/**
 * Living rock: the shapes a hillside is made of, at the sizes a player walks up
 * to.
 *
 * The kit already had stone at two scales and nothing in between. `rock` tops
 * out at about a metre and `cairn` at seventy centimetres; `art/vista.ts` starts
 * at hillside size and is never solid, never lit properly and never closer than
 * the boundary. So there was no stone in the world taller than a person, which
 * meant every tall thing in an outdoor scene was a tree — and a treeline says
 * something quite different from a rock line.
 *
 * Everything here is shared by the six boundary builders that came out of that
 * gap, because they are one material seen six ways and the worst thing they
 * could do is disagree about what stone looks like.
 *
 * ## Two shapes, and the difference between them is the whole vocabulary
 *
 * **Lumps are weathered and rounded.** A boulder that has been sitting in a
 * field since the ice left has no edges on it. `stoneLump` is `rock`'s recipe at
 * four times the size: weld, push every vertex along its own normal, squash,
 * bury.
 *
 * **Chunks are fractured and flat-faced.** Bedrock does not come rounded; it
 * comes in plates, along planes, with straight edges and sharp arrises.
 *
 * `stoneChunk` is that, and it is the second attempt. The first used
 * `masonry.roughBox` — a **box** with its eight corners knocked about — on the
 * reasoning that it was written for lintels and a lintel is a squared stone.
 * That reasoning is exactly wrong. A lintel is squared *because a mason squared
 * it*; the whole content of a natural rock is that nobody did. Six faces meeting
 * at twelve right angles survives any amount of corner jitter, so an outcrop
 * built from them was a row of bricks stood on end, a crag was a stack of dice,
 * and a standing stone was a plinth. Nothing else in the kit makes that mistake:
 * `rock` and `cairn` have been displaced icosahedra since the day they were
 * written, and there is not a right angle in either of them.
 *
 * What a fractured stone actually is, is the **convex hull of a handful of
 * scattered points** — flat faces at unrelated angles, sharp arrises where they
 * meet, and no two faces parallel unless it happens. That is one call to
 * three's `ConvexGeometry` and it costs about what a box did.
 */

export interface LumpOptions {
  /** Radius before any squashing, in metres. */
  radius: number;
  /**
   * Icosahedron subdivision. 0 is 20 triangles, 1 is 80.
   *
   * Detail 0 is twelve vertices, which is too few to displace into anything but
   * a lump — fine for rubble that is read as a mass, wrong for anything the
   * player stands next to.
   */
  detail?: number;
  /** How far vertices wander along their own normals, as a fraction of radius. */
  rough?: number;
  /** Vertical scale. Below 1 is a dome, above 1 is a spire. */
  squash?: number;
  /** Scale across Z, for a mass longer one way than the other. */
  stretch?: number;
  /**
   * How much of the mass sits below y = 0. 0 rests on it, 0.5 is half buried.
   *
   * **Where the origin sits inside the mesh, and nothing more.** `rock` and
   * `fallen-log` already do this and say why: a solid touching a plane along one
   * tangent line reads as balanced on it, where a few centimetres of overlap
   * reads as lying there. A boulder is the same fact at four times the size, so
   * it is modelled part-buried because that is what a boulder looks like.
   *
   * It is not a placement aid and there is none: props are placed by hand, and a
   * builder's job is to hand over one complete object with a sane origin.
   */
  bury?: number;
}

/**
 * A weathered mass — the rounded half of the vocabulary.
 *
 * Welded before displacement for `rock`'s reason: `IcosahedronGeometry` is
 * non-indexed, so a corner shared by five faces exists five times over at
 * identical coordinates, and displacing those copies independently pulls the
 * solid to pieces. The weld only takes once the normals and UVs are gone,
 * because a flat-shaded polyhedron is built so that no two copies ever match.
 */
export function stoneLump(rng: Rng, options: LumpOptions): THREE.BufferGeometry {
  const { radius, detail = 1, rough = 0.26, squash = 0.75, stretch = 1, bury = 0.24 } = options;

  const raw = new THREE.IcosahedronGeometry(radius, detail);
  raw.deleteAttribute('normal');
  raw.deleteAttribute('uv');
  const geometry = mergeVertices(raw);
  raw.dispose();

  const position = geometry.getAttribute('position');
  const vertex = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    vertex.multiplyScalar(rng.range(1 - rough, 1 + rough));
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  position.needsUpdate = true;

  geometry.scale(1, squash, stretch);
  // The mass spans ±`half` about its own centre; this drops it so that `bury`
  // of its height is underground.
  const half = radius * squash;
  geometry.translate(0, half * (1 - 2 * bury), 0);
  geometry.computeVertexNormals();
  return geometry;
}

export interface ChunkOptions {
  /** Half-extents, before roughening. A chunk spans roughly ±each. */
  width: number;
  height: number;
  depth: number;
  /**
   * How many bearings the outline is cut at. Five is a splinter, eight is a
   * cobble. Two points per bearing, so the hull is cut from twice this.
   */
  sides?: number;
  /** How far each point wanders, as a fraction. This is what removes the flats. */
  rough?: number;
  /**
   * How far the top is slid sideways off the bottom, as a fraction of width.
   *
   * **The single thing that stops it reading as a prism.** Give a stone parallel
   * top and bottom faces and a straight side and the eye reads a cut block
   * however irregular its outline is, because two parallel planes is the one
   * thing erosion never leaves behind. Sheared over, it is a wedge, and a wedge
   * is what rock breaks into.
   */
  skew?: number;
  /** Top outline as a fraction of the bottom. Below 1 tapers, above 1 overhangs. */
  taper?: number;
  /**
   * Level top and bottom faces, at exactly ±`height`.
   *
   * **For stone that has to sit on other stone.** The default roughens every
   * point's height as well as its bearing, which is right for a boulder lying in
   * a field and wrong the moment two of them are stacked: two ragged faces meet
   * on their high corners, so either they touch at three points with daylight
   * between, or they are pushed together until the corners come through each
   * other. That is what a bedded joint is not.
   *
   * Bedding planes are flat because that is the plane the rock split along, so
   * this is also the truer shape for anything quarried, jointed or stacked. The
   * outline still varies per bearing and `skew` still slides the top off the
   * bottom, so it is a wedge with two level faces rather than a prism.
   */
  flat?: boolean;
  /** How much of the total height sits below y = 0. 0 rests on it. */
  bury?: number;
}

/**
 * A fractured chunk — the angular half of the vocabulary.
 *
 * Points are scattered on two rings, one low and one high, each bearing at its
 * own radius and each point at its own height, with the top ring sheared off the
 * bottom. The hull of that is a solid with flat faces at unrelated angles: a
 * broken piece of rock.
 *
 * Two rings rather than a cloud on a sphere, because a cloud gives something
 * ball-shaped and the aspect is the point — a plate, a wedge and a spire are all
 * this function with different half-extents, and they are three quarters of what
 * separates an outcrop from a crag from a menhir.
 *
 * The hull is well conditioned by construction: every point is at its own
 * radius and its own height, so no four of them are coplanar and there is
 * nothing for the quickhull to be degenerate about.
 */
export function stoneChunk(rng: Rng, options: ChunkOptions): THREE.BufferGeometry {
  const {
    width,
    height,
    depth,
    sides = rng.int(5, 8),
    rough = 0.22,
    skew = 0.3,
    taper = 1,
    flat = false,
    bury = 0,
  } = options;

  // Which way it leans, and how far. One draw for the whole stone: a top whose
  // points each wandered their own way is noise, where a top that has slid as
  // one is a fracture.
  const lean = rng.range(0, Math.PI * 2);
  const slide = rng.range(skew * 0.35, skew);
  const shiftX = Math.cos(lean) * slide * width;
  const shiftZ = Math.sin(lean) * slide * depth;
  const start = rng.range(0, Math.PI * 2);
  const step = (Math.PI * 2) / sides;

  const points: THREE.Vector3[] = [];
  for (let i = 0; i < sides; i++) {
    // Bearings jittered within their own share of the circle, so the outline is
    // irregular without two of them ever crossing over and pinching the hull.
    const angle = start + i * step + rng.around(0, step * 0.32);
    const low = 1 + rng.around(0, rough);
    const high = (1 + rng.around(0, rough)) * taper;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * low * width,
        flat ? -height : -height * rng.range(1 - rough, 1),
        Math.sin(angle) * low * depth,
      ),
      new THREE.Vector3(
        Math.cos(angle) * high * width + shiftX,
        flat ? height : height * rng.range(1 - rough, 1),
        Math.sin(angle) * high * depth + shiftZ,
      ),
    );
  }

  const geometry = new ConvexGeometry(points);
  // The chunk spans ±height about its own middle; this drops it so `bury` of its
  // total height is underground, matching `stoneLump`.
  geometry.translate(0, height * (1 - 2 * bury), 0);
  return geometry;
}

/** Grey stone, occasionally a warmer bed. The boundary family's own mix. */
export function stoneColour(rng: Rng): number {
  const roll = rng();
  const base =
    roll < 0.5 ? PALETTE.STONE : roll < 0.82 ? PALETTE.STONE_DARK : PALETTE.STONE_PALE;
  return shade(base, rng.around(1, 0.09));
}

/** Pale grey-green. Crustose lichen, not moss — moss is `PALETTE.LEAF` country. */
export const LICHEN = 0x8d9377;

/**
 * Lichen and rain-streak, as a colour function.
 *
 * **The one detail that separates stone that has been outside from stone that
 * was placed this morning**, and it costs no geometry at all: `Part.color`
 * accepts a function, evaluated once per face at its centroid, so a patch lands
 * on facet boundaries and comes out crisp instead of smeared.
 *
 * Two rules, both of which are what actually happens to a rock. Lichen takes the
 * **upward** faces, because that is where the light and the rain are — so the
 * amount is driven by height up the mass rather than by position on it. And it
 * is **patchy**, from two sines at unrelated bearings, because lichen that
 * covers a stone evenly is paint.
 *
 * `crown` is the height the mass is fully exposed at, which for a part-buried
 * stone is its own top rather than its radius.
 */
export function weathered(
  rng: Rng,
  base: number,
  crown: number,
  amount = rng.range(0.25, 0.65),
): (x: number, y: number, z: number) => number {
  const tint = shade(LICHEN, rng.around(1, 0.12));
  const ax = rng.range(0, Math.PI * 2);
  const az = rng.range(0, Math.PI * 2);
  // Roughly a hand's width at boulder scale, so a mass this size carries a few
  // patches rather than one or twenty.
  const grain = crown * rng.range(0.55, 1.1) + 0.2;

  return (x, y, z) => {
    const field =
      Math.sin(x / grain + ax) * 0.6 + Math.sin(z / (grain * 1.37) + az) * 0.6 + Math.sin((x + z) / (grain * 0.71)) * 0.4;
    const up = crown > 0 ? Math.min(Math.max(y / crown, 0), 1) : 0;
    // Height gates it and the field decides where. Below the halfway mark
    // nothing grows, which is what keeps the underside of a boulder stone.
    const take = Math.max(0, up - 0.45) / 0.55;
    const patch = Math.max(0, Math.min(1, field * 0.7 + 0.25));
    return blend(base, tint, take * patch * amount);
  };
}

/**
 * How much darker a stone's shaded side is, per face.
 *
 * A single flat colour over a low-poly mass leaves the silhouette doing all the
 * work, which is fine at a hundred metres and thin at two. This is a couple of
 * per cent of value wobble keyed to position — small enough not to read as
 * speckle, big enough that the retro pass dithers it instead of banding.
 */
export function faceWobble(base: number, x: number, z: number): number {
  let h = Math.imul(Math.round(x * 9.1), 374761393) ^ Math.imul(Math.round(z * 9.1), 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  const draw = ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  return shade(base, 0.955 + draw * 0.09);
}
