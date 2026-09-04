import * as THREE from 'three';
import { builderByName } from '../art/registry';
import { GLOW_LAYER, HELD_LAYER } from '../layers';
import { LightActivity } from '../engine/LightActivity';
import { hashString } from '../world/loot';
import type { Item } from '../world/items';

/**
 * The equipped tool, drawn in the world at the camera's right hand. Swinging is
 * a gesture and nothing else yet: the arc plays and no world query is made.
 *
 * What is held decides how it moves. A tool is gripped and follows the hand
 * with a little lag and the bob of a step; a candle stands in the hand and bobs
 * with it; a lantern hangs from its ring and swings behind every move.
 */

const SWING_TIME = 0.32;
/** Camera-space grip: right, down and forward of the eye, in metres. */
const GRIP = new THREE.Vector3(0.34, -0.32, -0.55);
/** Where the hand holds a candle's base, and where it holds a lantern's ring. */
const HAND = new THREE.Vector3(0.3, -0.34, -0.5);
const RING = new THREE.Vector3(0.32, -0.08, -0.5);

/** Strides a metre at walking pace, for the bob. */
const STEPS_PER_METRE = 0.95;
/** Metres a candle or tool bobs per step, and how far it lags the hand. */
const BOB = 0.012;
const LAG = 0.06;
/** A lantern's pendulum: g over the length it hangs by, and how quickly it settles. */
const PENDULUM_STIFFNESS = 22;
const PENDULUM_DAMPING = 2.6;
const SWING_MOST = 0.55;
/** Metres a second squared the ring is believed to move at; a zone swap is not a swing. */
const KICK_MOST = 15;

type Carry = 'grip' | 'hand' | 'hang';

const _offset = new THREE.Vector3();
const _tilt = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _velocity = new THREE.Vector3();
const _local = new THREE.Vector3();
const _inverse = new THREE.Quaternion();
const _box = new THREE.Box3();
const _yaw = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);
const _forward = new THREE.Vector3();

let motionOption = 1;

/** The accessibility switch. Off holds whatever is carried still against the view. */
export function setHeldMotion(on: boolean): void {
  motionOption = on ? 1 : 0;
}

export class HeldTool {
  private readonly holder = new THREE.Group();
  private readonly activity = new LightActivity();
  /** Seconds into the current swing; past SWING_TIME is idle. */
  private arc = SWING_TIME;
  private signature = '';
  private carry: Carry = 'grip';
  private elapsed = 0;
  private stride = 0;
  private readonly lastEye = new THREE.Vector3();
  /** Where the ring was and how fast it was going, for the pendulum. */
  private readonly lastPivot = new THREE.Vector3();
  private readonly lastPivotVelocity = new THREE.Vector3();
  private settled = false;
  /** The pendulum's lean, in radians, and its rate: forward and sideways. */
  private lean = new THREE.Vector2();
  private leanRate = new THREE.Vector2();
  /** Where the hand is against where the eye asked, smoothed. */
  private readonly hand = new THREE.Vector3();

  constructor(scene: THREE.Scene) {
    scene.add(this.holder);
    this.holder.visible = false;
  }

  setItem(item: Item | null): void {
    const signature = item ? `${item.builder ?? ''}:${item.seed ?? 0}:${item.name}` : '';
    if (signature === this.signature) return;
    this.signature = signature;

    this.activity.release('held');
    for (const child of [...this.holder.children]) {
      child.removeFromParent();
      release(child);
    }
    this.holder.visible = false;
    if (!item) return;

    const stand = (item.builder ? builderByName(item.builder) : undefined) ?? builderByName('sack');
    if (!stand) return;
    const seed = item.seed ?? hashString(item.name) % 1_000_000;
    const mesh = stand.build({ seed });
    this.carry = carryOf(item.builder);
    // HELD_LAYER only: out of every world pass, drawn by the held overlay. A
    // glow keeps its layer as well, so the bloom pass still finds the flame;
    // a light keeps the world layer, which is what lets it land on the room.
    mesh.traverse((child) => {
      if (child instanceof THREE.Light) {
        child.castShadow = false;
        return;
      }
      const glows = child.layers.isEnabled(GLOW_LAYER);
      child.layers.set(HELD_LAYER);
      if (glows) child.layers.enable(GLOW_LAYER);
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    const scale = THREE.MathUtils.clamp(0.5 / Math.max(stand.radius, 0.15), 0.35, 1.3);
    mesh.scale.setScalar(scale);
    // A lantern hangs from its top, so the mesh is dropped until its top is at the pivot.
    if (this.carry === 'hang') {
      mesh.updateMatrixWorld(true);
      _box.setFromObject(mesh);
      mesh.position.y = -(_box.max.y - mesh.position.y);
    }
    this.holder.add(mesh);
    this.holder.visible = true;
    this.activity.collect('held', mesh);
    this.settled = false;
    this.lean.set(0, 0);
    this.leanRate.set(0, 0);
  }

  /** Starts a swing, or reports that one could not start — nothing held, or mid-arc. */
  swing(): boolean {
    if (!this.holder.visible || this.arc < SWING_TIME) return false;
    this.arc = 0;
    return true;
  }

  get visible(): boolean {
    return this.holder.visible;
  }

  get swinging(): boolean {
    return this.arc < SWING_TIME;
  }

  update(camera: THREE.Camera, dt: number): void {
    if (!this.holder.visible) return;
    this.elapsed += dt;

    // How the eye moved since last frame. Everything the hand does comes off this.
    const step = Math.max(dt, 1e-3);
    _forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    const yaw = Math.atan2(_forward.x, _forward.z);
    if (!this.settled || camera.position.distanceToSquared(this.lastEye) > 9) {
      this.lastEye.copy(camera.position);
      this.lastPivot.copy(camera.position).add(_offset.copy(RING).applyQuaternion(camera.quaternion));
      this.lastPivotVelocity.set(0, 0, 0);
      this.hand.set(0, 0, 0);
      this.settled = true;
    }
    _velocity.subVectors(camera.position, this.lastEye).divideScalar(step);
    this.lastEye.copy(camera.position);
    const ground = Math.hypot(_velocity.x, _velocity.z);
    this.stride += ground * STEPS_PER_METRE * dt;
    const motion = motionOption;

    let bend = 0;
    if (this.arc < SWING_TIME) {
      this.arc = Math.min(this.arc + dt, SWING_TIME);
      bend = Math.sin((this.arc / SWING_TIME) * Math.PI) * -1.15;
    }

    switch (this.carry) {
      case 'grip': {
        this.placeInHand(camera, GRIP, ground, _velocity, dt, motion);
        // rotateX lays the tool's +Y forward over the hand; the yaw turns its face
        // in toward the view. The swing bends further about the same axis.
        _tilt.setFromEuler(_euler.set(-0.5 + bend, 0.4, 0.12));
        this.holder.quaternion.copy(camera.quaternion).multiply(_tilt);
        break;
      }
      case 'hand': {
        this.placeInHand(camera, HAND, ground, _velocity, dt, motion);
        // Stood up in the hand, level with the world however the view pitches,
        // and leaning a touch into the walk.
        _yaw.setFromAxisAngle(_up, yaw);
        _tilt.setFromEuler(_euler.set(0.08 * motion * Math.min(1, ground / 2) + bend * 0.3, 0.3, 0.1));
        this.holder.quaternion.copy(_yaw).multiply(_tilt);
        break;
      }
      case 'hang': {
        this.holder.position.copy(camera.position).add(_offset.copy(RING).applyQuaternion(camera.quaternion));
        // The pendulum: the ring's own acceleration — walking, stopping, and the
        // arc it is carried through on a turn — in the view's yaw frame. The
        // body swings the other way from it, g over the length it hangs by.
        _yaw.setFromAxisAngle(_up, yaw);
        _inverse.copy(_yaw).invert();
        _local.subVectors(this.holder.position, this.lastPivot).divideScalar(step);
        this.lastPivot.copy(this.holder.position);
        _velocity.subVectors(_local, this.lastPivotVelocity).divideScalar(step);
        this.lastPivotVelocity.copy(_local);
        _velocity.applyQuaternion(_inverse);
        // In this frame +Z is forward and +X is left. Acceleration forward swings
        // the body back, a positive lean about X; acceleration left swings it
        // right, a positive lean.y — the body lags whatever the ring does.
        const kickForward = THREE.MathUtils.clamp(_velocity.z, -KICK_MOST, KICK_MOST) * PENDULUM_STIFFNESS / 9.81 * motion;
        const kickSide = THREE.MathUtils.clamp(_velocity.x, -KICK_MOST, KICK_MOST) * PENDULUM_STIFFNESS / 9.81 * motion;
        const rate = Math.min(dt, 1 / 30);
        this.leanRate.x += (kickForward - PENDULUM_STIFFNESS * this.lean.x - PENDULUM_DAMPING * this.leanRate.x) * rate;
        this.leanRate.y += (kickSide - PENDULUM_STIFFNESS * this.lean.y - PENDULUM_DAMPING * this.leanRate.y) * rate;
        this.lean.x = THREE.MathUtils.clamp(this.lean.x + this.leanRate.x * rate, -SWING_MOST, SWING_MOST);
        this.lean.y = THREE.MathUtils.clamp(this.lean.y + this.leanRate.y * rate, -SWING_MOST, SWING_MOST);
        // Hung from the ring: upright in the world, turned with the view, then
        // leaned. rotateX(θ) takes the hanging body toward −Z; rotateZ(−φ) takes it toward −X.
        _tilt.setFromEuler(_euler.set(this.lean.x, 0, -this.lean.y));
        this.holder.quaternion.copy(_yaw).multiply(_tilt);
        break;
      }
    }

    this.activity.update('held', this.elapsed, camera.position);
  }

  /** Puts the holder at a grip point, lagging the eye a little and bobbing with the stride. */
  private placeInHand(
    camera: THREE.Camera,
    grip: THREE.Vector3,
    ground: number,
    velocity: THREE.Vector3,
    dt: number,
    motion: number,
  ): void {
    _offset.copy(grip).applyQuaternion(camera.quaternion);
    if (motion > 0) {
      // The hand trails the body: a fraction of the velocity, the other way,
      // smoothed so a stop does not snap.
      _local.copy(velocity).multiplyScalar(-LAG * 0.1);
      _local.y += Math.sin(this.stride * Math.PI * 2) * BOB * Math.min(1, ground / 1.5);
      this.hand.lerp(_local, Math.min(1, dt * 10));
    } else {
      this.hand.set(0, 0, 0);
    }
    this.holder.position.copy(camera.position).add(_offset).add(this.hand);
  }

  dispose(): void {
    this.activity.clear();
    for (const child of [...this.holder.children]) {
      child.removeFromParent();
      release(child);
    }
    this.holder.removeFromParent();
  }
}

function carryOf(builder: string | undefined): Carry {
  if (builder === 'lantern') return 'hang';
  if (builder === 'candle') return 'hand';
  return 'grip';
}

function release(root: THREE.Object3D): void {
  root.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      if (object.userData.borrowedGeometry !== true) object.geometry.dispose();
      for (const material of [object.material].flat()) {
        if (material.userData.owned) material.dispose();
      }
    }
  });
}
