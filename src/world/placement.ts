import * as THREE from 'three';
import { markCollidable } from '../player/Collider';
import { createRng } from '../art/random';
import type { MeshBuilder } from '../art/types';

/**
 * Standing things on ground, laying things along lines, and scattering things
 * over areas. Four copies of these grew in the level files, one per level, and
 * they drifted; the interpreter and every hand-written zone share these.
 */

export type Point = readonly [number, number];

/** Ground height at a position. Interiors answer with their floor. */
export type GroundAt = (x: number, z: number) => number;

const _box = new THREE.Box3();

/** Top of a built mesh in its own space — what something standing on it needs. */
export function topOf(object: THREE.Object3D): number {
  _box.setFromObject(object, true);
  return _box.isEmpty() ? 0 : _box.max.y;
}

/**
 * Which way a line runs. Fences, walls and boundary slabs are all built along
 * +X, and `rotateY(yaw)` takes +X to (ux, uz).
 */
export function along(from: Point, to: Point): {
  ux: number;
  uz: number;
  length: number;
  yaw: number;
} {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const length = Math.hypot(dx, dz);
  if (length === 0) return { ux: 1, uz: 0, length: 0, yaw: 0 };
  return { ux: dx / length, uz: dz / length, length, yaw: Math.atan2(-dz, dx) };
}

/** Stands a mesh on the ground, turned to `yaw`, and adds it. */
export function place(
  parent: THREE.Object3D,
  mesh: THREE.Object3D,
  x: number,
  z: number,
  yaw: number,
  groundAt: GroundAt,
  solid = true,
): void {
  mesh.position.set(x, groundAt(x, z), z);
  mesh.rotation.y = yaw;
  parent.add(solid ? markCollidable(mesh) : mesh);
}

/** Stands something on the ground and tips it about its foot. */
export function lean(
  parent: THREE.Object3D,
  mesh: THREE.Object3D,
  x: number,
  z: number,
  yaw: number,
  tilt: number,
  groundAt: GroundAt,
  solid = true,
): void {
  mesh.position.set(x, groundAt(x, z), z);
  mesh.rotation.set(tilt, yaw, 0, 'YXZ');
  parent.add(solid ? markCollidable(mesh) : mesh);
}

export interface RunOptions {
  /** One piece of the run: its own seed, and how many sections it carries. */
  build(seed: number, sections: number): THREE.Mesh;
  /** Metres per section. */
  pitch: number;
  /** Most sections one mesh may carry. */
  most: number;
  seed: number;
  groundAt: GroundAt;
  /** Called with each piece as it lands, for tagging. */
  onPiece?(mesh: THREE.Mesh, index: number): void;
}

/**
 * Lays a builder that tiles along a line, in pieces, and reports where it
 * actually ended — rounding to whole sections moves it, and chaining from the
 * returned point is what keeps a boundary closed.
 */
export function layRun(
  root: THREE.Object3D,
  options: RunOptions,
  from: Point,
  to: Point,
): Point {
  const { ux, uz, length, yaw } = along(from, to);
  const total = Math.max(1, Math.round(length / options.pitch));

  for (let done = 0, piece = 0; done < total; piece++) {
    const take = Math.min(options.most, total - done);
    const middle = (done + take / 2) * options.pitch;
    const mesh = options.build(options.seed + piece, take);
    options.onPiece?.(mesh, piece);
    place(root, mesh, from[0] + ux * middle, from[1] + uz * middle, yaw, options.groundAt);
    done += take;
  }

  return [from[0] + ux * total * options.pitch, from[1] + uz * total * options.pitch];
}

export interface ScatterRule {
  seed: number;
  count: number;
  /** Radius of the disc candidates are drawn in. */
  within: number;
  /** Centre of that disc. Defaults to the origin. */
  from?: Point;
  maxSlope?: number;
  minHeight?: number;
  maxHeight?: number;
  /** Circles to stay out of: [x, z, radius]. */
  avoid?: readonly (readonly [number, number, number])[];
  scale?: readonly [number, number];
}

export interface ScatterGround {
  groundAt: GroundAt;
  slopeAt?(x: number, z: number): number;
  /** Anything the rule cannot state: inside the boundary, off the lane. */
  accept?(x: number, z: number): boolean;
}

/**
 * Scatters a builder over an area, skipping anything too steep, too low, too
 * high or too near something it must avoid.
 *
 * **Rejected candidates still consume their draws.** Adding an exclusion must
 * not reshuffle what was already placed, and that is only true if every
 * candidate's roll happens whether or not it is kept.
 */
export function scatterProps(
  parent: THREE.Object3D,
  builder: MeshBuilder,
  rule: ScatterRule,
  ground: ScatterGround,
  onPlaced?: (mesh: THREE.Mesh) => void,
): void {
  const rng = createRng(rule.seed);
  const [cx, cz] = rule.from ?? [0, 0];
  const maxSlope = rule.maxSlope ?? 26;
  const avoid = rule.avoid ?? [];
  const solid = builder.solid !== false;

  for (let i = 0; i < rule.count; i++) {
    // Square-rooted radius: uniform in radius is not uniform in area.
    const angle = rng.range(0, Math.PI * 2);
    const radius = Math.sqrt(rng()) * rule.within;
    const x = cx + Math.cos(angle) * radius;
    const z = cz + Math.sin(angle) * radius;
    const yaw = rng.range(0, Math.PI * 2);
    const size = rule.scale ? rng.range(rule.scale[0], rule.scale[1]) : 1;
    const seed = rng.int(1, 1_000_000);

    if (ground.accept && !ground.accept(x, z)) continue;
    if (ground.slopeAt && ground.slopeAt(x, z) > maxSlope) continue;

    const height = ground.groundAt(x, z);
    if (rule.minHeight !== undefined && height < rule.minHeight) continue;
    if (rule.maxHeight !== undefined && height > rule.maxHeight) continue;

    let blocked = false;
    for (const [ax, az, ar] of avoid) {
      if (Math.hypot(x - ax, z - az) < ar) {
        blocked = true;
        break;
      }
    }
    if (blocked) continue;

    const mesh = builder.build({ seed, scale: size });
    // The item systems read this back, so a taken prop is carried with the
    // exact look it stood with.
    mesh.userData.seed = seed;
    onPlaced?.(mesh);
    place(parent, mesh, x, z, yaw, ground.groundAt, solid);
  }
}

/** Shortest distance from a point to a segment, in the XZ plane. */
export function toSegment(x: number, z: number, a: Point, b: Point): number {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const lenSq = dx * dx + dz * dz;
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / lenSq));
  return Math.hypot(x - (a[0] + dx * t), z - (a[1] + dz * t));
}

/** Inside a closed polygon, and at least `inset` metres clear of its edge. */
export function insidePolygon(points: readonly Point[], x: number, z: number, inset = 0): boolean {
  let odd = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i];
    const b = points[j];
    if (a[1] > z !== b[1] > z && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) {
      odd = !odd;
    }
  }
  if (!odd) return false;
  if (inset <= 0) return true;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    if (toSegment(x, z, points[i], points[j]) < inset) return false;
  }
  return true;
}
