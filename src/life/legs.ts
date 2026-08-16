import * as THREE from 'three';
import type { RigHandle } from '../art/rig';
import type { LifeSpec } from './spec';
import { Pose, smooth } from './pose';

/**
 * Feet that are planted, and legs solved back to them.
 *
 * A biped's legs are not swung on a sine: each foot is a point in the world.
 * A planted foot stays exactly where it is while the body moves over it; a
 * foot that has fallen too far behind its home under the hip — or is asked
 * to by the gait clock — lifts and swings to a new place ahead, and plants
 * again. The two legs are then solved by two-bone IK from the hip pivots to
 * the ankles every frame. So the feet never slide, a turn on the spot is a
 * shuffle of real steps, and stopping settles the way stopping does.
 *
 * The clock: `phase` runs at the stride rate; the left foot's swing slot is
 * the first half of each cycle and the right's the second. A slot that opens
 * with nothing to correct is skipped, so a standing figure's feet do not
 * march on the spot.
 */

const TWO_PI = Math.PI * 2;
/** Fraction of the cycle a swing takes. */
const DUTY = 0.5;
/** A foot further than this from home takes a step when its slot comes round. */
const SLACK = 0.07;

interface Foot {
  readonly name: 'legL' | 'legR';
  /** Where the sole is, world space. */
  readonly at: THREE.Vector3;
  /** Which way it was pointing when it planted. */
  yaw: number;
  /** −1 planted; else 0..1 through the swing. */
  swing: number;
  readonly from: THREE.Vector3;
  readonly to: THREE.Vector3;
  /** Cycle index of the last slot decided on, so each is decided once. */
  slot: number;
  /** Rest offsets of hip and knee from the hips bone. */
  readonly hip: THREE.Vector3;
}

export interface LegsInput {
  /** The mesh's position — the point on the ground between the feet. */
  pos: THREE.Vector3;
  yaw: number;
  /** World velocity over the ground. */
  vx: number;
  vz: number;
  groundAt: (x: number, z: number) => number;
  dt: number;
}

const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _hipsW = new THREE.Vector3();
const _hipW = new THREE.Vector3();
const _home = new THREE.Vector3();
const _d = new THREE.Vector3();
const _off = new THREE.Vector3();
const _rot = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _qi = new THREE.Quaternion();

export class Legs {
  readonly feet: readonly [Foot, Foot];
  /** The stride clock, radians. Advanced by the creature. */
  phase = 0;
  /** Seconds a step takes; the cycle is two of them. */
  readonly stepTime: number;
  /** How high a swinging foot lifts, metres. */
  readonly lift: number;

  private readonly thigh: number;
  private readonly shin: number;
  private readonly ankle: number;
  private readonly hipsRest: THREE.Vector3;

  constructor(spec: LifeSpec, rig: RigHandle) {
    const legs = spec.legs!;
    this.thigh = legs.thigh;
    this.shin = legs.shin;
    this.ankle = legs.ankle;
    this.hipsRest = rig.rest.hips;
    this.stepTime = 0.42 * Math.sqrt(spec.legLength / 0.55);
    this.lift = spec.legLength * 0.11;
    this.feet = [
      { name: 'legL', at: new THREE.Vector3(), yaw: 0, swing: -1, from: new THREE.Vector3(), to: new THREE.Vector3(), slot: -1, hip: rig.rest.legLu },
      { name: 'legR', at: new THREE.Vector3(), yaw: 0, swing: -1, from: new THREE.Vector3(), to: new THREE.Vector3(), slot: -1, hip: rig.rest.legRu },
    ];
  }

  /** Puts both feet under the body: on placement, and after a teleport. */
  place(pos: THREE.Vector3, yaw: number, groundAt: LegsInput['groundAt']): void {
    _hipsW.copy(this.hipsRest).applyAxisAngle(_up, yaw).add(pos);
    for (const foot of this.feet) {
      this.homeOf(foot, yaw, 0, _home);
      foot.at.copy(_home);
      foot.at.y = groundAt(_home.x, _home.z);
      foot.yaw = yaw;
      foot.swing = -1;
    }
  }

  /** True while any foot is off its home: the clock must keep running to settle. */
  get unsettled(): boolean {
    return this.feet.some((f) => f.swing >= 0) || this.displaced;
  }
  private displaced = false;

  /** 0..1 through the swing for a foot, or 0 planted. For the body to ride on. */
  swingOf(name: 'legL' | 'legR'): number {
    const foot = this.feet[name === 'legL' ? 0 : 1];
    return foot.swing < 0 ? 0 : foot.swing;
  }

  /**
   * Steps the feet for this frame and writes the leg bones into `pose`, which
   * must already carry the hips' offset and rotation — the legs hang from it.
   */
  update(input: LegsInput, pose: Pose): void {
    const { pos, yaw, dt } = input;
    // Where the hips are in the world this frame.
    pose.offsetOf('hips', _off);
    pose.rotationOf('hips', _rot);
    _hipsW.copy(this.hipsRest).add(_off);
    _hipsW.applyAxisAngle(_up, yaw).add(pos);
    // The hips' own rotation, to undo it on the way into leg space.
    _e.set(_rot.x, _rot.y, _rot.z, 'YXZ');
    _q.setFromEuler(_e);

    const cycle = this.phase / TWO_PI;
    this.displaced = false;
    for (let i = 0; i < 2; i++) {
      const foot = this.feet[i];
      // This foot's slot: the first half of the cycle for the left, second
      // for the right. `local` is 0..1 across the whole cycle from its start.
      const local = ((cycle - i * DUTY) % 1 + 1) % 1;
      const slot = Math.floor(cycle - i * DUTY);
      const inSlot = local < DUTY;

      const speed = Math.hypot(input.vx, input.vz);
      this.homeOf(foot, yaw, speed, _home);
      // Predicted landing: home carried forward by half a step of travel, so
      // the foot goes down ahead of the hip and passes under it mid-stance.
      const lead = this.stepTime * 0.5;
      _home.x += input.vx * lead;
      _home.z += input.vz * lead;

      // Each slot is decided once, and not while the other foot is still in
      // the air — it waits, and takes its step later in the slot if it can.
      const other = this.feet[1 - i];
      if (inSlot && slot !== foot.slot && foot.swing < 0 && other.swing < 0) {
        foot.slot = slot;
        const away = Math.hypot(foot.at.x - _home.x, foot.at.z - _home.z);
        if (away > SLACK || speed > 0.03) {
          foot.swing = 0;
          foot.from.copy(foot.at);
          foot.to.copy(_home);
        }
      }

      if (foot.swing >= 0) {
        // The target keeps tracking the moving prediction as it swings.
        foot.to.x += (_home.x - foot.to.x) * Math.min(1, dt * 12);
        foot.to.z += (_home.z - foot.to.z) * Math.min(1, dt * 12);
        foot.to.y = input.groundAt(foot.to.x, foot.to.z);
        foot.swing = Math.min(1, foot.swing + dt / this.stepTime);
        const p = smooth(foot.swing);
        foot.at.lerpVectors(foot.from, foot.to, p);
        foot.at.y += this.lift * Math.sin(foot.swing * Math.PI);
        if (foot.swing >= 1) {
          foot.at.copy(foot.to);
          foot.yaw = yaw;
          foot.swing = -1;
        }
      } else {
        foot.at.y = input.groundAt(foot.at.x, foot.at.z);
        if (Math.hypot(foot.at.x - _home.x, foot.at.z - _home.z) > SLACK) this.displaced = true;
      }

      this.solve(foot, yaw, pose);
    }
  }

  /** The foot's rest place on the ground under its hip, world space. Needs `_hipsW`. */
  private homeOf(foot: Foot, yaw: number, speed: number, out: THREE.Vector3): void {
    // Slightly wider than the hip, and a touch forward when moving so the
    // stance is not on the heels.
    out.set(foot.hip.x * 1.06, 0, 0.01 + 0.03 * Math.min(1, speed));
    out.applyAxisAngle(_up, yaw);
    out.x += _hipsW.x;
    out.z += _hipsW.z;
    out.y = 0;
  }

  /** Two-bone IK from the hip pivot to the ankle, into `pose`. */
  private solve(foot: Foot, yaw: number, pose: Pose): void {
    // Hip pivot in the world: hips, then the hip's rest offset turned by the
    // hips' rotation and the body's yaw.
    _hipW.copy(foot.hip).applyQuaternion(_q).applyAxisAngle(_up, yaw).add(_hipsW);
    // Hip to ankle, taken back into the hips' frame.
    _d.set(foot.at.x, foot.at.y + this.ankle, foot.at.z).sub(_hipW);
    _d.applyAxisAngle(_up, -yaw);
    _d.applyQuaternion(_qi.copy(_q).invert());

    const reach = this.thigh + this.shin;
    let D = _d.length();
    if (D > reach * 0.995) {
      _d.multiplyScalar((reach * 0.995) / D);
      D = reach * 0.995;
    }
    D = Math.max(D, Math.abs(this.thigh - this.shin) + 1e-3);

    // With the bones YXZ, roll comes first: it takes the hanging leg toward
    // +X, so sin(rz) is the sideways part. Then pitch tips it back (rx > 0
    // swings a hanging leg toward −Z).
    const rz = Math.asin(Math.max(-1, Math.min(1, _d.x / D)));
    const theta = Math.atan2(-_d.z, -_d.y);
    // Cosine rule: the angle at the hip between the thigh and the line to
    // the ankle, and the fold at the knee.
    const a = this.thigh;
    const b = this.shin;
    const cosHip = (a * a + D * D - b * b) / (2 * a * D);
    const cosKnee = (a * a + b * b - D * D) / (2 * a * b);
    const alpha = Math.acos(Math.max(-1, Math.min(1, cosHip)));
    const bend = Math.PI - Math.acos(Math.max(-1, Math.min(1, cosKnee)));
    // The ankle lies behind the thigh's line, so the thigh comes forward of
    // the hip–ankle line by alpha and the knee points +Z.
    const thighRx = theta - alpha;
    pose.turn(`${foot.name}u`, thighRx, 0, rz);
    pose.turn(`${foot.name}l`, bend);
    // The sole stays level with the ground: the foot undoes the leg's pitch,
    // and keeps pointing where it planted while the body turns above it.
    // A swinging foot dips its toe.
    const toe = foot.swing < 0 ? 0 : 0.35 * Math.sin(foot.swing * Math.PI);
    let twist = foot.swing < 0 ? foot.yaw - yaw : 0;
    twist = ((twist + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI;
    twist = Math.max(-0.7, Math.min(0.7, twist));
    pose.turn(`${foot.name}f`, -(thighRx + bend) + toe, twist, -rz);
  }
}

