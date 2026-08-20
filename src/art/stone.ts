import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import type { Rng } from './random';
import { PALETTE, blend, shade } from './palette';

/**
 * Living rock: the shapes a hillside is made of, at the sizes a player walks up
 * to. Shared by the six boundary builders, because they are one material seen
 * six ways.
 *
 * Two shapes. Lumps are weathered and rounded — `rock`'s recipe at four times
 * the size: weld, push every vertex along its own normal, squash, bury. Chunks
 * are fractured and flat-faced: the convex hull of a handful of scattered
 * points, so faces sit at unrelated angles with sharp arrises where they meet.
 * A box with its corners knocked about is not the same thing — six faces at
 * twelve right angles survive any amount of jitter and read as a brick.
 */

export interface LumpOptions {
  /** Radius before any squashing, in metres. */
  radius: number;
  /** Icosahedron subdivision. 0 is 20 triangles, 1 is 80. Detail 0 is twelve vertices, too few to displace into anything but a lump. */
  detail?: number;
  /** How far vertices wander along their own normals, as a fraction of radius. */
  rough?: number;
  /** Vertical scale. Below 1 is a dome, above 1 is a spire. */
  squash?: number;
  /** Scale across Z, for a mass longer one way than the other. */
  stretch?: number;
  /**
   * How much of the mass sits below y = 0. 0 rests on it, 0.5 is half buried.
   * Where the origin sits inside the mesh, and nothing more: a solid touching a
   * plane along one tangent line reads as balanced on it, where a few centimetres
   * of overlap reads as lying there.
   */
  bury?: number;
}

/**
 * A weathered mass — the rounded half of the vocabulary. Welded before
 * displacement: `IcosahedronGeometry` is non-indexed, so a corner shared by five
 * faces exists five times over at identical coordinates, and displacing those
 * copies independently pulls the solid to pieces. The weld only takes once the
 * normals and UVs are gone.
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
   * How far the top is slid sideways off the bottom, as a fraction of width. The
   * single thing that stops it reading as a prism: two parallel planes is the one
   * thing erosion never leaves behind, and sheared over it is a wedge, which is
   * what rock breaks into.
   */
  skew?: number;
  /** Top outline as a fraction of the bottom. Below 1 tapers, above 1 overhangs. */
  taper?: number;
  /**
   * Level top and bottom faces, at exactly ±`height`, for stone that has to sit on
   * other stone. Two ragged faces meet on their high corners, so they either touch
   * at three points with daylight between or are pushed together until the corners
   * come through. Bedding planes are flat anyway, being the plane the rock split
   * along; the outline still varies per bearing and `skew` still slides the top.
   */
  flat?: boolean;
  /** How much of the total height sits below y = 0. 0 rests on it. */
  bury?: number;
}

/**
 * A fractured chunk — the angular half of the vocabulary. Points are scattered on
 * two rings, one low and one high, each bearing at its own radius and each point
 * at its own height, with the top ring sheared off the bottom; the hull of that
 * has flat faces at unrelated angles. Two rings rather than a cloud on a sphere,
 * because the aspect is the point — a plate, a wedge and a spire are this
 * function with different half-extents. No four points are coplanar, so the
 * quickhull has nothing to be degenerate about.
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
 * Lichen and rain-streak, as a colour function — the one detail separating stone
 * that has been outside from stone placed this morning, and it costs no geometry:
 * `Part.color` accepts a function, evaluated once per face at its centroid.
 * Lichen takes the upward faces, so the amount is driven by height up the mass,
 * and it is patchy from two sines at unrelated bearings, because lichen that
 * covers a stone evenly is paint. `crown` is the height it is fully exposed at.
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
 * How much darker a stone's shaded side is, per face. A single flat colour over a
 * low-poly mass leaves the silhouette doing all the work, which is fine at a
 * hundred metres and thin at two. A couple of per cent of value wobble keyed to
 * position: too small to read as speckle, big enough to dither rather than band.
 */
export function faceWobble(base: number, x: number, z: number): number {
  let h = Math.imul(Math.round(x * 9.1), 374761393) ^ Math.imul(Math.round(z * 9.1), 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  const draw = ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  return shade(base, 0.955 + draw * 0.09);
}
