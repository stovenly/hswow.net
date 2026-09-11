import * as THREE from 'three';
import type { Rng } from './random';

// A fence post's shape and geometry, shared by the fence line, the gate and the stile.

/** Post section, square, metres. */
export const FENCE_POST = 0.16;

export interface PostShape {
  readonly x: number;
  readonly z: number;
  readonly height: number;
  /** Lean along the run. */
  readonly lean: number;
  /** Lean across it. */
  readonly tilt: number;
  /** Turned in its socket. */
  readonly twist: number;
}

/** The band a fence post is rolled from. */
export function fenceHeight(rng: Rng): number {
  return rng.range(1.15, 1.35);
}

export function rollPost(rng: Rng, x: number, z: number, height: number, plumb = false): PostShape {
  const tall = height * rng.range(0.94, 1.06);
  const lean = rng.around(0, 0.04);
  const tilt = rng.around(0, 0.02);
  const twist = rng.around(0, 0.07);
  return plumb ? { x, z, height: tall, lean: 0, tilt: 0, twist } : { x, z, height: tall, lean, tilt, twist };
}

/** Standing on y = 0 at (x, z), sunk `sink` metres; turned first, then leaned, so the lean is along the run. */
export function postGeometry(post: PostShape, size = FENCE_POST, sink = 0.5): THREE.BufferGeometry {
  const shaft = new THREE.BoxGeometry(size, post.height + sink, size);
  shaft.translate(0, (post.height - sink) / 2, 0);
  shaft.rotateY(post.twist);
  shaft.rotateZ(post.lean);
  shaft.rotateX(post.tilt);
  shaft.translate(post.x, 0, post.z);
  return shaft;
}

/** Where a post's centre line has got to by height `y`. */
export function postAt(post: PostShape, y: number): { x: number; z: number } {
  return { x: post.x - y * Math.sin(post.lean), z: post.z + y * Math.cos(post.lean) * Math.sin(post.tilt) };
}
