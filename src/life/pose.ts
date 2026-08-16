import type * as THREE from 'three';
import type { RigHandle } from '../art/rig';

/**
 * A pose is a set of deltas from the rest pose, one slot per bone: three
 * rotations, three offsets, three scale changes. Layers add into one, weighted,
 * and the sum is written to the skeleton once a frame.
 *
 * Rotations are Euler `YXZ` — yaw about the creature's up, then pitch about the
 * yawed side axis, then roll — which is what a head, a neck and a leg all want.
 * With every bone facing +Z at rest: `rx > 0` tips the front *down* (a hanging
 * leg swings *back*), `ry > 0` turns it toward +X, `rz > 0` rolls it toward +X.
 */

const CHANNELS = 9;

export class Pose {
  readonly data: Float32Array;
  private readonly index: Map<string, number>;

  constructor(readonly names: readonly string[]) {
    this.data = new Float32Array(names.length * CHANNELS);
    this.index = new Map(names.map((name, i) => [name, i]));
  }

  clear(): void {
    this.data.fill(0);
  }

  has(bone: string): boolean {
    return this.index.has(bone);
  }

  /** Adds rotation deltas, radians. Unknown bones are ignored — a fowl has no tail2. */
  turn(bone: string, rx: number, ry = 0, rz = 0): void {
    const i = this.index.get(bone);
    if (i === undefined) return;
    const o = i * CHANNELS;
    this.data[o] += rx;
    this.data[o + 1] += ry;
    this.data[o + 2] += rz;
  }

  /** Adds a position offset, in the bone's parent's space, metres. */
  move(bone: string, px: number, py: number, pz = 0): void {
    const i = this.index.get(bone);
    if (i === undefined) return;
    const o = i * CHANNELS + 3;
    this.data[o] += px;
    this.data[o + 1] += py;
    this.data[o + 2] += pz;
  }

  /** Adds to scale, so 0.02 is two percent larger. */
  swell(bone: string, sx: number, sy: number, sz: number): void {
    const i = this.index.get(bone);
    if (i === undefined) return;
    const o = i * CHANNELS + 6;
    this.data[o] += sx;
    this.data[o + 1] += sy;
    this.data[o + 2] += sz;
  }

  /** `this += other * weight`. */
  blend(other: Pose, weight: number): void {
    if (weight === 0) return;
    const a = this.data;
    const b = other.data;
    for (let i = 0; i < a.length; i++) a[i] += b[i] * weight;
  }

  /** The rotation so far on a bone, radians, or zeros for an unknown one. */
  rotationOf(bone: string, out: THREE.Vector3): THREE.Vector3 {
    const i = this.index.get(bone);
    if (i === undefined) return out.set(0, 0, 0);
    const o = i * CHANNELS;
    return out.set(this.data[o], this.data[o + 1], this.data[o + 2]);
  }

  /** The offset so far on a bone, metres. */
  offsetOf(bone: string, out: THREE.Vector3): THREE.Vector3 {
    const i = this.index.get(bone);
    if (i === undefined) return out.set(0, 0, 0);
    const o = i * CHANNELS + 3;
    return out.set(this.data[o], this.data[o + 1], this.data[o + 2]);
  }

  copy(other: Pose): void {
    this.data.set(other.data);
  }
}

/** Writes a pose to the skeleton: rest plus deltas. */
export function applyPose(rig: RigHandle, pose: Pose): void {
  const d = pose.data;
  for (let i = 0; i < pose.names.length; i++) {
    const name = pose.names[i];
    const bone = rig.bones[name];
    const rest = rig.rest[name];
    const o = i * CHANNELS;
    bone.rotation.set(d[o], d[o + 1], d[o + 2], 'YXZ');
    bone.position.set(rest.x + d[o + 3], rest.y + d[o + 4], rest.z + d[o + 5]);
    bone.scale.set(1 + d[o + 6], 1 + d[o + 7], 1 + d[o + 8]);
  }
}

// --- small curves every layer needs ----------------------------------------

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function smooth(t: number): number {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

/** 0 → 1 → 0 over `t` in 0..1, smooth at both ends. */
export function bump(t: number): number {
  const c = clamp01(t);
  return Math.sin(c * Math.PI);
}

/** A ramp that rises over `rise`, holds, and falls over `fall`, of a duration 1. */
export function envelope(t: number, rise: number, fall: number): number {
  if (t <= 0 || t >= 1) return 0;
  if (t < rise) return smooth(t / rise);
  if (t > 1 - fall) return smooth((1 - t) / fall);
  return 1;
}

/** Cheap deterministic noise in −1..1, continuous in `t`, different per `salt`. */
export function wobble(t: number, salt: number): number {
  return (
    Math.sin(t * 1.31 + salt) * 0.5 +
    Math.sin(t * 2.17 + salt * 1.7) * 0.3 +
    Math.sin(t * 3.71 + salt * 0.4) * 0.2
  );
}

/** Moves `current` toward `target` by at most `rate * dt`. */
export function approach(current: number, target: number, rate: number, dt: number): number {
  const step = rate * dt;
  if (target > current + step) return current + step;
  if (target < current - step) return current - step;
  return target;
}

/** Shortest signed angle from `a` to `b`. */
export function angleTo(a: number, b: number): number {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}
