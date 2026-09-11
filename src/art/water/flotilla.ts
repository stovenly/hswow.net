import * as THREE from 'three';
import type { Persistence } from './persistence';

// Things on the water: floats that ride the wave the vertex stage draws, and
// the catenary ropes that hold them.

export interface FloatOptions {
  /** Metres of hull below the surface. */
  draft: number;
  /** Half-length of the footprint, metres. */
  radius: number;
}

/** Surface height at a point and time, or null off the water. */
export type SurfaceHeight = (x: number, z: number, time: number) => number | null;

/** A critically damped spring toward a target. */
class Spring {
  value = 0;
  velocity = 0;
  constructor(readonly omega: number) {}
  step(target: number, dt: number): number {
    const accel = this.omega * this.omega * (target - this.value) - 2 * this.omega * this.velocity;
    this.velocity += accel * dt;
    this.value += this.velocity * dt;
    return this.value;
  }
}

interface Float {
  object: THREE.Object3D;
  draft: number;
  radius: number;
  heave: Spring;
  pitch: Spring;
  roll: Spring;
  baseYaw: number;
  baseY: number;
  lastX: number;
  lastZ: number;
  /** Whether the bow was above the water last frame, for the slap. */
  bowUp: boolean;
  settled: boolean;
}

export class Flotilla {
  private readonly floats: Float[] = [];
  /** Fired when a hull slaps down onto a rising crest: position and a 0..1 force. */
  onSlap: ((x: number, y: number, z: number, force: number) => void) | null = null;

  add(object: THREE.Object3D, options: FloatOptions): void {
    // Each hull's own spring rate, so a fleet settles at different tempos.
    const vary = 0.85 + 0.3 * fract(Math.sin(this.floats.length * 12.9898) * 43758.5453);
    this.floats.push({
      object,
      draft: options.draft,
      radius: options.radius,
      heave: new Spring(2.6 * vary),
      pitch: new Spring(2.2 * vary),
      roll: new Spring(2.8 * vary),
      baseYaw: object.rotation.y,
      baseY: object.position.y,
      lastX: object.position.x,
      lastZ: object.position.z,
      bowUp: true,
      settled: false,
    });
  }

  remove(object: THREE.Object3D): void {
    const i = this.floats.findIndex((f) => f.object === object);
    if (i >= 0) this.floats.splice(i, 1);
  }

  /** Where a float's hull sits this frame. */
  update(dt: number, time: number, heightAt: SurfaceHeight, persistence: Persistence | null): void {
    const step = Math.min(dt, 0.05);
    for (const f of this.floats) {
      const o = f.object;
      const yaw = f.baseYaw;
      // The hull is built along +X, bow toward +X; the beam point is on its +Z side.
      const fx = Math.sin(yaw + Math.PI / 2);
      const fz = Math.cos(yaw + Math.PI / 2);
      const rx = Math.sin(yaw);
      const rz = Math.cos(yaw);
      const L = f.radius * 0.8;
      const W = f.radius * 0.35;
      const x = o.position.x;
      const z = o.position.z;
      const hBow = heightAt(x + fx * L, z + fz * L, time);
      const hStern = heightAt(x - fx * L, z - fz * L, time);
      const hBeam = heightAt(x + rx * W, z + rz * W, time);
      const hMid = heightAt(x, z, time);
      if (hBow === null || hStern === null || hBeam === null || hMid === null) continue;
      const mean = (hBow + hStern + hBeam + hMid) / 4;
      const targetY = mean - f.draft;
      // Pitch is about the hull's z axis: rotateZ(θ) takes +X (the bow) upward for positive θ.
      const targetPitch = Math.atan2(hBow - hStern, 2 * L);
      // Roll is about the hull's x axis: rotateX(θ) takes +Z downward for positive θ, so a rising beam is negative roll.
      const targetRoll = -Math.atan2(hBeam - hMid, W);
      if (!f.settled) {
        f.heave.value = targetY;
        f.pitch.value = targetPitch;
        f.roll.value = targetRoll;
        f.settled = true;
      }
      o.position.y = f.heave.step(targetY, step);
      const pitch = f.pitch.step(targetPitch, step);
      const roll = f.roll.step(targetRoll, step);
      o.rotation.set(roll, yaw, pitch, 'YXZ');

      const bowUp = hBow < o.position.y + f.draft * 0.35;
      if (bowUp !== f.bowUp) {
        if (!bowUp && this.onSlap) {
          const force = Math.min(1, Math.abs(f.heave.velocity) * 2 + Math.abs(hBow - hStern));
          this.onSlap(x + fx * L, o.position.y, z + fz * L, force);
        }
        f.bowUp = bowUp;
      }

      if (persistence) {
        const dx = x - f.lastX;
        const dz = z - f.lastZ;
        const speed = dt > 0 ? Math.hypot(dx, dz) / dt : 0;
        persistence.stamp({ x, z, radius: f.radius * 1.1, foam: 0.3 + Math.min(0.5, speed), wet: 0 });
        if (speed > 0.2) persistence.wake(x, z, dx / (speed * dt), dz / (speed * dt), f.radius, speed);
      }
      f.lastX = x;
      f.lastZ = z;
    }
  }
}

function fract(x: number): number {
  return x - Math.floor(x);
}

// --- moorings -----------------------------------------------------------------

const ROPE_SEGMENTS = 12;
const ROPE_SIDES = 5;
const ROPE_RADIUS = 0.022;

export interface MooringOptions {
  /** The float the rope holds. */
  float: THREE.Object3D;
  /** Where the rope is made fast ashore, world. */
  post: THREE.Vector3;
  /** Where on the hull the rope is tied, in the hull's local frame. */
  cleat: THREE.Vector3;
  /** Extra rope as a fraction of the straight distance. */
  slack: number;
  colour: number;
}

/**
 * A catenary rope re-solved every frame from the float's current position, so
 * it tightens as the hull drifts and slackens as it returns.
 */
export class Mooring {
  readonly mesh: THREE.Mesh;
  /** 0 slack, 1 bar-tight. For the creak. */
  tightness = 0;
  private readonly options: MooringOptions;
  private readonly positions: THREE.BufferAttribute;
  private readonly length: number;
  private readonly points: THREE.Vector3[] = Array.from({ length: ROPE_SEGMENTS + 1 }, () => new THREE.Vector3());

  constructor(options: MooringOptions) {
    this.options = options;
    const start = options.post;
    const end = options.float.localToWorld(options.cleat.clone());
    this.length = start.distanceTo(end) * (1 + options.slack);
    const geometry = new THREE.BufferGeometry();
    this.positions = new THREE.BufferAttribute(new Float32Array((ROPE_SEGMENTS + 1) * ROPE_SIDES * 3), 3);
    this.positions.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', this.positions);
    const index: number[] = [];
    for (let s = 0; s < ROPE_SEGMENTS; s++) {
      for (let k = 0; k < ROPE_SIDES; k++) {
        const a = s * ROPE_SIDES + k;
        const b = s * ROPE_SIDES + ((k + 1) % ROPE_SIDES);
        const c = a + ROPE_SIDES;
        const d = b + ROPE_SIDES;
        index.push(a, c, b, b, c, d);
      }
    }
    geometry.setIndex(index);
    this.mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: options.colour }));
    this.mesh.name = 'mooring-line';
    this.mesh.frustumCulled = false;
    this.mesh.userData.noCollide = true;
    this.update();
  }

  update(): void {
    const { post, float, cleat } = this.options;
    const end = _end.copy(cleat);
    float.localToWorld(end);
    solveCatenary(post, end, this.length, this.points);
    this.tightness = Math.min(1, post.distanceTo(end) / this.length);
    const arr = this.positions.array as Float32Array;
    for (let s = 0; s <= ROPE_SEGMENTS; s++) {
      const p = this.points[s];
      const q = this.points[Math.min(ROPE_SEGMENTS, s + 1)];
      const r = this.points[Math.max(0, s - 1)];
      _tangent.subVectors(q, r).normalize();
      _side.crossVectors(_tangent, UP);
      if (_side.lengthSq() < 1e-6) _side.set(1, 0, 0);
      _side.normalize();
      _up.crossVectors(_side, _tangent).normalize();
      for (let k = 0; k < ROPE_SIDES; k++) {
        const angle = (k / ROPE_SIDES) * Math.PI * 2;
        const i = (s * ROPE_SIDES + k) * 3;
        arr[i] = p.x + (_side.x * Math.cos(angle) + _up.x * Math.sin(angle)) * ROPE_RADIUS;
        arr[i + 1] = p.y + (_side.y * Math.cos(angle) + _up.y * Math.sin(angle)) * ROPE_RADIUS;
        arr[i + 2] = p.z + (_side.z * Math.cos(angle) + _up.z * Math.sin(angle)) * ROPE_RADIUS;
      }
    }
    this.positions.needsUpdate = true;
    this.mesh.geometry.computeBoundingSphere();
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}

const UP = new THREE.Vector3(0, 1, 0);
const _end = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _side = new THREE.Vector3();
const _up = new THREE.Vector3();

/**
 * Points along y = a·cosh(x/a) between two ends for a rope of `length`. A rope
 * shorter than the gap is drawn straight.
 */
export function solveCatenary(a: THREE.Vector3, b: THREE.Vector3, length: number, out: THREE.Vector3[]): void {
  const n = out.length - 1;
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const d = Math.hypot(dx, dz);
  const h = b.y - a.y;
  const straight = Math.hypot(d, h);
  if (length <= straight * 1.001 || d < 1e-4) {
    for (let i = 0; i <= n; i++) out[i].lerpVectors(a, b, i / n);
    return;
  }
  // 2·s·sinh(d / 2s) = sqrt(L² − h²), solved for s by bisection.
  const target = Math.sqrt(length * length - h * h);
  let lo = 1e-3;
  let hi = 1e4;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const value = 2 * mid * Math.sinh(d / (2 * mid));
    if (value > target) lo = mid;
    else hi = mid;
  }
  const s = (lo + hi) / 2;
  const x0 = d / 2 - s * Math.asinh(h / (2 * s * Math.sinh(d / (2 * s))));
  const c = a.y - s * Math.cosh(-x0 / s);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = t * d;
    out[i].set(a.x + dx * t, s * Math.cosh((x - x0) / s) + c, a.z + dz * t);
  }
}
