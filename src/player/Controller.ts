import * as THREE from 'three';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import type { Input } from '../engine/Input';
import type { Collider } from './Collider';
import type { SurfaceName } from '../audio/models/footsteps';

// First-person movement. The player is a capsule, accelerated Quake-style
// toward the wish direction up to the wish speed. Integration runs on a fixed
// sub-step, so every frame rate resolves collisions the same way.

const SUB_STEP = 1 / 120;
/** Enough for the loop's 0.1 s delta clamp, with headroom. */
const MAX_SUB_STEPS = 16;
/** How many depenetration passes per sub-step. Corners need more than one. */
const RESOLVE_PASSES = 4;
/** Downward probe increments for the step-up landing sweep. */
const STEP_DROP_SAMPLES = 6;

/** How much quicker the debug camera is than walking. Sprint multiplies it again. */
const NOCLIP_SCALE = 4;

/** How far a step-up may climb past the last walkable ground, in step heights. */
const STEP_CLIMB_BUDGET = 1.5;

/** Ceiling on how far the camera may trail the feet, in metres. */
const MAX_STEP_LAG = 0.22;

/** How soon after landing a jump counts as a continued hop rather than a fresh push-off, in seconds. */
const HOP_CONTINUATION = 0.28;

/** Which axis a field-of-view figure is measured along. See `fovScaling`. */
export type FovScaling = 'horizontal' | 'vertical';

/**
 * One footfall, and which way it was going. The direction comes from input and
 * not from velocity: sliding sideways down a slope while pressing forward is
 * still forward walking. A landing is the opposite case and reads velocity.
 */
export interface Footfall {
  /** Metres per second. */
  speed: number;
  /**
   * Where the player is asking to go, in their own frame; +1 is to their right,
   * +1 is straight ahead. Latched, so a step firing while they decelerate keeps
   * the gait it was travelling with.
   */
  right: number;
  forward: number;
}

export interface PlayerTuning {
  /** Capsule radius. Also, incidentally, how tight a gap the player fits through. */
  radius: number;
  /** Head to heel. */
  height: number;
  /** Camera height above the feet. Slightly below `height`, as eyes are. */
  eyeHeight: number;

  walkSpeed: number;
  sprintScale: number;
  /** Eye height while crouched, as a fraction of the standing one. */
  crouchScale: number;
  /** Capsule height while crouched, as a fraction of the standing one. `headroom` is what stops you standing up inside geometry. */
  crouchHeight: number;
  /** How fast the crouch eases in and out, in fractions per second. High: it exists only so the camera does not teleport. */
  crouchSpeed: number;
  /** Movement speed while crouched, as a multiple of the walk. */
  crouchDrag: number;
  /**
   * How fast the camera catches up after a step, in fractions per second. Low
   * enough that consecutive steps overlap and sum into one continuous climb;
   * the cost is a few centimetres of standing lag while climbing.
   */
  stepSmoothing: number;
  groundAccel: number;
  /**
   * Steering authority while airborne, about half the ground figure. Only safe
   * because `maxAirSpeed` caps the magnitude — Quake air acceleration has no
   * upper bound of its own, so this would otherwise compound.
   */
  airAccel: number;
  friction: number;
  /** Floor under the friction curve, so low speeds still stop crisply. */
  stopSpeed: number;

  /** Well above 9.81. Real gravity reads as floating in a first-person game. */
  gravity: number;
  jumpSpeed: number;
  /** Grace period after walking off a ledge during which a jump still works, in seconds. */
  coyoteTime: number;
  /** How early a jump press can land before touchdown and still be honoured. */
  jumpBuffer: number;
  /** Jump again on landing while the control is held. */
  autoHop: boolean;

  /** Steeper than this is a wall: you slide rather than stand. */
  slopeLimitDeg: number;
  /** Ledges up to this high are climbed rather than blocked. 0 disables it. */
  stepHeight: number;

  lookSensitivity: number;
  invertY: boolean;
  invertX: boolean;

  /** Global scale over the head bob, 0..1. Separate from the three amplitudes, so switching it off does not destroy their tuning. */
  bobScale: number;
  bobAmount: number;
  bobSway: number;
  bobRoll: number;
  /** Footfalls per second at walking pace. Two footfalls to a bob cycle. */
  bobStepsPerSecond: number;
  /** How far into a stride the gait sits while standing still, 0..1, so moving off from a standstill steps almost at once. */
  firstStepFraction: number;
  /**
   * How much faster the legs turn over when moving faster, as an exponent on
   * the speed ratio. Cadence rises with about the square root of speed, hence
   * 0.5; 0 is a fixed cadence whatever the pace.
   */
  bobSpeedInfluence: number;

  /**
   * Ceiling on horizontal speed while airborne, as a multiple of sprint speed.
   * Quake air acceleration has no upper bound, so without this air-strafing
   * compounds every hop. Capping the magnitude leaves the steering untouched.
   */
  maxAirSpeed: number;

  fov: number;
  /**
   * Which axis `fov` is measured along. `vertical` fixes the vertical angle, so
   * a wider window shows more to the sides — three's own convention.
   * `horizontal` fixes the horizontal angle and loses height instead.
   */
  fovScaling: FovScaling;
  /** How much wider the view goes while sprinting, in degrees on top of `fov`. A delta, so the two cannot come apart. */
  sprintFovBoost: number;
  /** Camera dip on landing, per m/s of impact speed. */
  landDip: number;
}

export const DEFAULT_TUNING: PlayerTuning = {
  radius: 0.32,
  height: 1.8,
  // Below where a person's eyes actually sit. At 1.62 you are above most of the
  // art kit and everything reads as smaller than it is; the capsule is unchanged.
  eyeHeight: 1.35,

  walkSpeed: 4.2,
  sprintScale: 1.75,
  crouchScale: 0.52,
  crouchHeight: 0.58,
  crouchSpeed: 22,
  crouchDrag: 0.45,
  stepSmoothing: 6,
  groundAccel: 14,
  airAccel: 7.5,
  friction: 10,
  stopSpeed: 1.6,

  gravity: 26,
  jumpSpeed: 7.2,
  coyoteTime: 0.22,
  jumpBuffer: 0.15,
  autoHop: false,

  slopeLimitDeg: 50,
  stepHeight: 0.45,

  lookSensitivity: 0.0022,
  invertY: false,
  invertX: false,

  bobScale: 1,
  bobAmount: 0.02,
  bobSway: 0.012,
  bobRoll: 0.004,
  bobStepsPerSecond: 1.9,
  bobSpeedInfluence: 0.5,
  firstStepFraction: 0.65,

  maxAirSpeed: 1.12,

  fov: 80,
  // Vertical, which is what `PerspectiveCamera.fov` is, so 80 keeps meaning what
  // it meant while it was being tuned.
  fovScaling: 'vertical',
  sprintFovBoost: 8,
  landDip: 0.02,
};

/** Scratch vectors — the movement step runs up to 16 times a frame. */
const _wish = new THREE.Vector3();
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _push = new THREE.Vector3();
const _slide = new THREE.Vector3();
const _delta = new THREE.Vector3();
const _drop = new THREE.Vector3();
const _before = new THREE.Vector3();
const _position = new THREE.Vector3();
const _probeStart = new THREE.Vector3();
const _probeEnd = new THREE.Vector3();

const _probe = new Capsule();
const _look = { x: 0, y: 0 };
const _toTarget = new THREE.Vector3();

/** Seconds the turn into a conversation takes, and what the distance adds. */
const CONVERSE_BASE = 0.45;
const CONVERSE_PER_RADIAN = 0.35;
const CONVERSE_CAP = 1.1;
/** Half-life of the hold once the turn has landed. */
const CONVERSE_HOLD = 0.23;
/** Degrees off the vertical field of view while talking to somebody. */
const CONVERSE_ZOOM = 7;
/** How fast the zoom follows the turn. Slower than the sprint widening, which is a flinch. */
const CONVERSE_ZOOM_RATE = 2.2;

/** The shortest way round to an angle, in radians. */
function shortest(angle: number): number {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

/**
 * A moving thing the player is stopped by — a creature. An upright cylinder,
 * refreshed every frame: the static collider indexes triangles once per zone.
 */
export interface Obstacle {
  x: number;
  z: number;
  /** Ground under it. */
  y: number;
  radius: number;
  height: number;
}

export class Controller {
  readonly tuning: PlayerTuning = { ...DEFAULT_TUNING };
  readonly velocity = new THREE.Vector3();
  /** Replaced, not appended, by whatever owns the moving things. */
  obstacles: readonly Obstacle[] = [];

  /** Fires on each footfall. */
  onFootstep: ((step: Footfall) => void) | null = null;
  /**
   * Fires on touchdown with the vertical impact speed and the horizontal speed
   * it arrived carrying, both in m/s. Two numbers: vertical is what gets
   * arrested and sets the weight, horizontal carries on and is the shear.
   */
  onLand: ((impact: number, horizontal: number) => void) | null = null;
  /** Fires on a jump that is a fresh push-off, with the horizontal speed it was taken at. See `HOP_CONTINUATION`. */
  onJump: ((speed: number) => void) | null = null;

  /** Public so systems that need the player's *view* can read it: the camera axis and the body's facing differ by the bob and the pitch. */
  readonly camera: THREE.PerspectiveCamera;
  private readonly input: Input;
  private readonly collider: Collider;
  private readonly capsule = new Capsule();

  private yaw = 0;
  private pitch = 0;

  /** Where the view is being held, while somebody is being spoken to. */
  private talkingTo: THREE.Vector3 | null = null;
  private talkT = 0;
  private talkFor = 0;
  /** 0 out of a conversation, 1 in one. Eased, and the only thing the zoom reads. */
  private talkZoom = 0;
  private readonly talkFrom = new THREE.Vector2();

  /**
   * Fly, and pass through everything. A debug camera rather than a movement
   * mode: gravity, friction, the slope limit, step-up and the collider are all
   * skipped. The capsule keeps its size, so what you fly through is the volume
   * you would occupy standing there.
   */
  noclip = false;
  /** Whether the sprint widening is engaged. Latched, with hysteresis. */
  private zoomedOut = false;
  /**
   * The field of view in the axis the player authored it in, damped. Held apart
   * from `camera.fov`, which is always vertical.
   */
  private authoredFov = DEFAULT_TUNING.fov;
  /** How far into the crouch the camera is, 0..1. Eased rather than switched. */
  private crouch = 0;
  /**
   * How far the camera is still lagging behind the feet after a step up. Each
   * upward step is subtracted here and paid back over the next fraction of a
   * second, so the body climbs in steps and the view rises in one glide.
   */
  private stepLag = 0;
  /**
   * How short the capsule currently is, 0..1, matching `crouch`. Held apart
   * from the input, because releasing the key under a low beam has to leave the
   * body crouched until there is room to rise.
   */
  private stance = 0;
  /** Feet height last frame, for spotting those steps. */
  private lastFeetY: number | null = null;

  /** Surface the player is standing on. Straight up whenever airborne. */
  private readonly groundNormal = new THREE.Vector3(0, 1, 0);
  /** What the last thing that held the player up was made of. See `groundSurface`. */
  private ground: SurfaceName | null = null;
  /** Horizontal unit direction the player is asking to go, world space. */
  private wishX = 0;
  private wishZ = 0;
  /** The same wish in the player's own frame, latched at its last non-zero value. */
  private headingRight = 0;
  private headingForward = 1;
  private grounded = false;
  /** Set for the one sub-step a jump is launched on, so it isn't snapped back. */
  private jumped = false;
  /** Height accumulated by step-ups since the player last stood on ground the slope limit allows. */
  private stepClimb = 0;
  private timeOffGround = 0;
  /** Seconds standing since the last touchdown. Gates the take-off sound. */
  private timeSinceLand = Infinity;
  private bobPhase = 0;
  /** Fraction of the current stride covered. Reaching 1 is a footfall. */
  private strideProgress = 0.65;
  private dip = 0;
  private accumulator = 0;

  constructor(camera: THREE.PerspectiveCamera, input: Input, collider: Collider) {
    this.camera = camera;
    this.input = input;
    this.collider = collider;
    // The controller drives rotation directly; three's default order would let
    // pitch tilt the horizon.
    this.camera.rotation.order = 'YXZ';
    // Seeded rather than damped into: `Viewport` builds the camera at its own
    // fov, and easing from it would be a slow zoom across the boot frames.
    this.authoredFov = this.tuning.fov;
    this.applyProjection();
    this.teleport(new THREE.Vector3(0, 2, 6), 0);
  }

  /** Drops the player at a world position, facing `yaw` radians. */
  teleport(feet: THREE.Vector3, yaw = this.yaw): void {
    const { radius, height } = this.tuning;
    this.capsule.set(
      new THREE.Vector3(feet.x, feet.y + radius, feet.z),
      new THREE.Vector3(feet.x, feet.y + height - radius, feet.z),
      radius,
    );
    this.velocity.set(0, 0, 0);
    this.yaw = yaw;
    this.grounded = false;
    // Whatever they were standing on is in another zone. Left set, the first
    // footfall after a doorway would be the last plank on the other side of it.
    this.ground = null;
    // The capsule has just been rebuilt at full height, and `applyStance` only
    // acts when the crouch has moved.
    this.stance = 0;
    this.crouch = 0;
    this.stepLag = 0;
    this.lastFeetY = null;
  }

  /**
   * Changes the field of view at once rather than easing into it. The damp in
   * `applyCamera` is for the sprint zoom and would make a settings slider lag.
   * All three together, because whether the boost applies depends on sprinting.
   */
  setFieldOfView(fov: number, sprintBoost: number, scaling: FovScaling): void {
    this.tuning.fov = fov;
    this.tuning.sprintFovBoost = sprintBoost;
    this.tuning.fovScaling = scaling;
    this.authoredFov = fov + (this.zoomedOut ? sprintBoost : 0);
    this.applyProjection();
  }

  /**
   * Writes the camera's vertical angle from the authored one. Every frame,
   * because the conversion depends on the aspect ratio; guarded on an actual
   * change, because `updateProjectionMatrix` is not free.
   */
  private applyProjection(): void {
    const authored = this.authoredFov;
    const vertical =
      this.tuning.fovScaling === 'vertical'
        ? authored
        : // Half-angles: the tangent relationship holds on the half, not the whole.
          THREE.MathUtils.radToDeg(
            2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(authored) / 2) / this.camera.aspect),
          );

    if (Math.abs(vertical - this.camera.fov) > 1e-3) {
      this.camera.fov = vertical;
      this.camera.updateProjectionMatrix();
    }
  }

  /** Feet position. Shared scratch; copy it. */
  get position(): THREE.Vector3 {
    return _position.copy(this.capsule.start).setY(this.capsule.start.y - this.tuning.radius);
  }

  /**
   * What the player is standing on, or null when the triangle had no material —
   * bare ground, a terrain face, an interior floor, which the zone answers for.
   * Taken from the collision that stopped them, and held across frames in the air.
   */
  get groundSurface(): SurfaceName | null {
    return this.ground;
  }

  get heading(): number {
    return this.yaw;
  }

  /** How far the view is tilted, in radians. Positive is up. */
  get tilt(): number {
    return this.pitch;
  }

  /**
   * Points the view. Only the editor's orbit camera uses this — the player
   * looks with the mouse, and a second way to set the same two numbers would be
   * a second place for them to disagree.
   */
  aim(yaw: number, pitch: number): void {
    const limit = Math.PI / 2 - 0.001;
    this.yaw = yaw % (Math.PI * 2);
    this.pitch = Math.min(Math.max(pitch, -limit), limit);
  }

  get isGrounded(): boolean {
    return this.grounded;
  }

  get speed(): number {
    return Math.hypot(this.velocity.x, this.velocity.z);
  }

  /**
   * Turns the view onto a point and holds it there. The one place in the game
   * that takes the camera from the player; `release` gives it back where it
   * rests, with nothing snapping.
   */
  converse(at: THREE.Vector3): void {
    if (!this.talkingTo) {
      this.talkT = 0;
      this.talkFrom.set(this.yaw, this.pitch);
      this.talkFor = 0;
    }
    this.talkingTo = at;
  }

  release(): void {
    this.talkingTo = null;
  }

  get inConverse(): boolean {
    return this.talkingTo !== null;
  }

  /**
   * A fixed-time eased blend rather than a damp: a damp moves fastest at the
   * start, which reads as a snap. Cubic ease-in-out over a length set by how
   * far there is to go, so a quarter turn takes about as long as the villager's
   * own turn and the two read as one exchange. Once it lands, a lazy damp holds
   * the head so breathing is followed without rigidity.
   */
  private applyConverse(dt: number): void {
    const at = this.talkingTo;
    if (!at) return;
    _toTarget.copy(at).sub(this.camera.position);
    const flat = Math.hypot(_toTarget.x, _toTarget.z);
    const wantYaw = Math.atan2(-_toTarget.x, -_toTarget.z);
    const wantPitch = Math.atan2(_toTarget.y, flat);

    const offYaw = shortest(wantYaw - this.yaw);
    const offPitch = wantPitch - this.pitch;
    if (this.talkFor === 0) {
      const away = Math.hypot(offYaw, offPitch);
      this.talkFor = Math.min(CONVERSE_BASE + CONVERSE_PER_RADIAN * away, CONVERSE_CAP);
      this.talkFrom.set(this.yaw, this.pitch);
    }

    this.talkT += dt;
    if (this.talkT >= this.talkFor) {
      const close = 1 - 2 ** (-dt / CONVERSE_HOLD);
      this.yaw += offYaw * close;
      this.pitch += offPitch * close;
      return;
    }
    // Measured against the live target every frame, so a villager still
    // settling is tracked rather than landed short of.
    const t = this.talkT / this.talkFor;
    const eased = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    const left = 1 - eased;
    this.yaw = wantYaw - shortest(wantYaw - this.talkFrom.x) * left;
    this.pitch = wantPitch - (wantPitch - this.talkFrom.y) * left;
  }

  update(dt: number): void {
    this.applyLook();
    this.applyConverse(dt);

    // Fixed sub-steps, with the remainder carried to the next frame so motion
    // stays smooth instead of quantising to the sub-step.
    this.accumulator += dt;
    let steps = 0;
    while (this.accumulator >= SUB_STEP && steps < MAX_SUB_STEPS) {
      this.step(SUB_STEP);
      this.accumulator -= SUB_STEP;
      steps += 1;
    }
    // A tab restored after a long pause would otherwise bank seconds of
    // simulation and fire them off over the following frames.
    if (steps === MAX_SUB_STEPS) this.accumulator = 0;

    this.applyCamera(dt);
  }

  // --- look ---------------------------------------------------------------

  private applyLook(): void {
    this.input.drainLook(_look);
    // Drained even while the view is held, or the spin banked during a
    // conversation lands the moment it ends.
    if (this.talkingTo) return;
    const { lookSensitivity, invertY, invertX } = this.tuning;

    this.yaw -= _look.x * lookSensitivity * (invertX ? -1 : 1);
    this.pitch -= _look.y * lookSensitivity * (invertY ? -1 : 1);

    // Just short of straight up and down. Exactly ±π/2 makes the yaw axis
    // degenerate and the view swims.
    const limit = Math.PI / 2 - 0.001;
    this.pitch = Math.min(Math.max(this.pitch, -limit), limit);
    // Wrapped so yaw never grows large enough to lose float precision.
    this.yaw = this.yaw % (Math.PI * 2);
  }

  // --- movement -----------------------------------------------------------

  private step(dt: number): void {
    const t = this.tuning;
    this.jumped = false;

    if (this.noclip) {
      this.fly(dt);
      return;
    }

    if (this.grounded) {
      this.timeOffGround = 0;
      this.timeSinceLand += dt;
      this.applyFriction(dt);
    } else {
      this.timeOffGround += dt;
      this.velocity.y -= t.gravity * dt;
    }

    this.applyWish(dt);
    this.applyJump();
    this.capAirSpeed();

    const wasGrounded = this.grounded;
    const impact = -this.velocity.y;
    // Read before `move`, which cancels velocity into whatever it hits — after
    // it, the horizontal speed at touchdown is already partly scrubbed.
    const horizontal = this.speed;

    this.move(dt);

    if (this.grounded && !wasGrounded) {
      this.timeSinceLand = 0;
      if (impact > 1) {
        this.dip += Math.min(impact, 18) * t.landDip;
        this.onLand?.(impact, horizontal);
      }
    }

    this.advanceBob(dt);
  }

  /**
   * One sub-step of the debug camera. Velocity is set rather than accelerated
   * toward, so nothing overshoots; still written to `velocity`, so leaving
   * noclip mid-air hands the ordinary path a sensible starting speed.
   */
  private fly(dt: number): void {
    const t = this.tuning;
    const speed = t.walkSpeed * NOCLIP_SCALE * (this.input.sprint ? t.sprintScale : 1);

    // Pitch included, unlike `applyWish` — walking is over ground and flying is
    // aiming.
    const cosPitch = Math.cos(this.pitch);
    _forward.set(-Math.sin(this.yaw) * cosPitch, Math.sin(this.pitch), -Math.cos(this.yaw) * cosPitch);
    _right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    _wish
      .set(0, 0, 0)
      .addScaledVector(_forward, this.input.moveZ)
      .addScaledVector(_right, this.input.moveX);
    _wish.y += (this.input.jumping ? 1 : 0) - (this.input.crouching ? 1 : 0);

    if (_wish.lengthSq() > 1e-8) _wish.normalize().multiplyScalar(speed);
    this.velocity.copy(_wish);
    this.capsule.translate(_delta.copy(_wish).multiplyScalar(dt));

    // Never standing, so leaving noclip inside geometry falls and depenetrates
    // the ordinary way rather than believing it is on a floor.
    this.grounded = false;
    this.groundNormal.set(0, 1, 0);
    this.stepClimb = 0;
    this.wishX = 0;
    this.wishZ = 0;
  }

  private applyFriction(dt: number): void {
    const t = this.tuning;
    // The whole vector, not just its horizontal part: on a slope, velocity has
    // a vertical component that is still the player walking, and it has to
    // decay with the rest of it or you keep climbing after letting go.
    const speed = this.velocity.length();
    if (speed < 1e-4) {
      this.velocity.set(0, 0, 0);
      return;
    }
    const drop = Math.max(speed, t.stopSpeed) * t.friction * dt;
    this.velocity.multiplyScalar(Math.max(speed - drop, 0) / speed);
  }

  private applyWish(dt: number): void {
    const t = this.tuning;
    const { moveX, moveZ } = this.input;

    _forward.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    _right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    _wish.set(0, 0, 0).addScaledVector(_forward, moveZ).addScaledVector(_right, moveX);

    const magnitude = _wish.length();
    if (magnitude < 1e-4) {
      this.wishX = 0;
      this.wishZ = 0;
      return;
    }
    _wish.divideScalar(magnitude);

    // Kept before the slope projection: this is where the player is trying to
    // go, which is the only honest measure of whether something is in the way.
    // Velocity is not — a wall zeroes it, and then nothing looks obstructed.
    this.wishX = _wish.x;
    this.wishZ = _wish.z;
    // The same thing in the player's own frame — `moveX` and `moveZ` already are
    // right and forward. Latched inside the guard, so releasing the keys
    // mid-stride leaves the last real direction standing.
    this.headingRight = moveX / magnitude;
    this.headingForward = moveZ / magnitude;

    if (this.grounded) {
      // Steer along the surface rather than into it, so walking up a slope is
      // just walking and gravity is never fought with a horizontal push.
      _wish.projectOnPlane(this.groundNormal);
      const flattened = _wish.length();
      if (flattened < 1e-4) return;
      _wish.divideScalar(flattened);
    }

    // Analog sticks scale speed; keys are already unit-length so this is a
    // no-op for them. Diagonals are normalised above, so no strafe-run bonus.
    const wishSpeed =
      t.walkSpeed *
      Math.min(magnitude, 1) *
      (this.input.sprint ? t.sprintScale : 1) *
      // Crouching slows you smoothly with the camera rather than as a step.
      (1 - this.stance * (1 - t.crouchDrag));

    // Quake acceleration: only ever adds up to the shortfall between current
    // speed along the wish direction and the wish speed, so you cannot exceed
    // it by holding the key, but you can steer freely below it.
    const current = this.velocity.dot(_wish);
    const shortfall = wishSpeed - current;
    if (shortfall <= 0) return;

    const accel = this.grounded ? t.groundAccel : t.airAccel;
    this.velocity.addScaledVector(_wish, Math.min(accel * wishSpeed * dt, shortfall));
  }

  /** Bounds horizontal speed in the air. Horizontal only: scaling the vertical component too would make it a parachute. */
  private capAirSpeed(): void {
    if (this.grounded) return;
    const t = this.tuning;
    const max = t.walkSpeed * t.sprintScale * t.maxAirSpeed;
    const speed = Math.hypot(this.velocity.x, this.velocity.z);
    if (speed <= max || speed < 1e-6) return;
    const scale = max / speed;
    this.velocity.x *= scale;
    this.velocity.z *= scale;
  }

  private applyJump(): void {
    const t = this.tuning;
    const canJump = this.grounded || this.timeOffGround < t.coyoteTime;
    if (!canJump) return;

    const requested = this.input.takeJump(t.jumpBuffer) || (t.autoHop && this.input.jumping);
    if (!requested) return;

    this.velocity.y = t.jumpSpeed;
    this.grounded = false;
    this.jumped = true;
    // Only when this is a push-off in its own right, not the second half of a
    // hop that has just landed.
    if (this.timeSinceLand > HOP_CONTINUATION) this.onJump?.(this.speed);
    this.timeSinceLand = 0;
    // Spent, so the coyote window cannot be used twice for one jump.
    this.timeOffGround = t.coyoteTime;
  }

  private move(dt: number): void {
    const t = this.tuning;
    _delta.copy(this.velocity).multiplyScalar(dt);
    _before.copy(this.capsule.start);

    const wasGrounded = this.grounded;
    const wishX = this.velocity.x;
    const wishZ = this.velocity.z;
    this.grounded = false;

    this.capsule.translate(_delta);
    this.resolve();
    this.resolveObstacles();

    // Moving along a surface never penetrates it, so contact is lost the moment
    // the ground stops being flat. Feel within a step's reach and settle back
    // onto it; only an actual jump is exempt.
    if (wasGrounded && !this.grounded && !this.jumped) this.snapToGround();

    // Ledge climbing, when the player is asking to go somewhere and isn't. Not
    // gated on being grounded: catching a lip on the way down is the same move.
    if (t.stepHeight <= 0 || (this.wishX === 0 && this.wishZ === 0)) return;
    if (this.velocity.y > 0.1) return; // rising: mid-jump, leave it alone

    const advanced =
      (this.capsule.start.x - _before.x) * this.wishX +
      (this.capsule.start.z - _before.z) * this.wishZ;
    if (advanced >= t.walkSpeed * dt * 0.5) return;

    if (this.tryStepUp(dt)) {
      // The obstruction will have scrubbed the horizontal velocity on the way
      // in. Restoring it is what stops a staircase feeling like wading.
      this.velocity.x = wishX;
      this.velocity.z = wishZ;
      this.velocity.y = 0;
    }
  }

  /** Push out of every surface touched, and cancel velocity into each one. */
  private resolve(): void {
    const slopeCos = Math.cos((this.tuning.slopeLimitDeg * Math.PI) / 180);

    for (let pass = 0; pass < RESOLVE_PASSES; pass++) {
      const contact = this.collider.intersectCapsule(this.capsule);
      if (!contact) break;

      // Standing is only possible on a surface flatter than the slope limit.
      const walkable = contact.normal.y > slopeCos;

      // A bank you cannot stand on is resolved as a wall: along its own normal a
      // too-steep face lifts the capsule as it depenetrates and turns horizontal
      // speed into up-slope speed. Ceilings keep their normal, which points down.
      _slide.copy(contact.normal);
      if (!walkable && contact.normal.y > 0) {
        const flat = Math.hypot(contact.normal.x, contact.normal.z);
        if (flat > 1e-4) _slide.set(contact.normal.x / flat, 0, contact.normal.z / flat);
      }

      // Depth is measured along the true normal, so clearing the same
      // penetration along the flattened one takes correspondingly further.
      const along = Math.max(_slide.dot(contact.normal), 1e-4);
      this.capsule.translate(_push.copy(_slide).multiplyScalar(contact.depth / along));

      if (walkable) {
        this.grounded = true;
        this.groundNormal.copy(contact.normal);
        this.ground = contact.surface;
        // Standing on ground the limit allows is what a climb is measured from.
        this.stepClimb = 0;
      }

      const into = this.velocity.dot(_slide);
      if (into < 0) this.velocity.addScaledVector(_slide, -into);
    }

    if (!this.grounded) this.groundNormal.set(0, 1, 0);
  }

  /** Push out of every creature touched, sideways only, and stop into it. */
  private resolveObstacles(): void {
    if (this.noclip || this.obstacles.length === 0) return;
    const r = this.tuning.radius;
    const feet = this.capsule.start.y - r;
    const head = this.capsule.end.y + r;
    for (const o of this.obstacles) {
      if (head < o.y || feet > o.y + o.height) continue;
      const dx = this.capsule.start.x - o.x;
      const dz = this.capsule.start.z - o.z;
      const d = Math.hypot(dx, dz);
      const reach = o.radius + r;
      if (d >= reach) continue;
      // Straight out from the middle when standing exactly on it.
      const nx = d > 1e-4 ? dx / d : 1;
      const nz = d > 1e-4 ? dz / d : 0;
      const depth = reach - d;
      this.capsule.start.x += nx * depth;
      this.capsule.start.z += nz * depth;
      this.capsule.end.x += nx * depth;
      this.capsule.end.z += nz * depth;
      const into = this.velocity.x * nx + this.velocity.z * nz;
      if (into < 0) {
        this.velocity.x -= nx * into;
        this.velocity.z -= nz * into;
      }
    }
  }

  /**
   * Whether there is room to stand up: the capsule at full height at the
   * current feet. Without it, releasing the key under a beam would shove the
   * player sideways out of the gap they had squeezed into.
   */
  private headroom(): boolean {
    if (this.stance < 0.01) return true;
    const t = this.tuning;
    const feetY = this.capsule.start.y - t.radius;
    _probe.copy(this.capsule);
    _probe.start.set(this.capsule.start.x, feetY + t.radius, this.capsule.start.z);
    _probe.end.set(this.capsule.start.x, feetY + t.height - t.radius, this.capsule.start.z);
    return !this.collider.overlaps(_probe);
  }

  /** Resizes the capsule to match the current crouch. The feet stay put and the head moves. */
  private applyStance(): void {
    if (Math.abs(this.crouch - this.stance) < 0.001) return;
    this.stance = this.crouch;
    const t = this.tuning;
    const feetY = this.capsule.start.y - t.radius;
    const height = t.height * (1 - this.stance * (1 - t.crouchHeight));
    // Never shorter than the two end spheres, or the capsule turns inside out.
    this.capsule.end.set(
      this.capsule.start.x,
      feetY + Math.max(height - t.radius, t.radius + 0.01),
      this.capsule.start.z,
    );
  }

  /**
   * Feels downward for a walkable surface within one step height and settles on
   * it. Deliberately penetrates first, because `resolve` is what reports the
   * surface normal and a probe stopping short reports nothing.
   */
  private snapToGround(): void {
    const t = this.tuning;
    const slopeCos = Math.cos((t.slopeLimitDeg * Math.PI) / 180);
    const increment = Math.max(t.stepHeight, 0.05) / STEP_DROP_SAMPLES;
    _drop.set(0, -increment, 0);
    _probe.copy(this.capsule);

    for (let i = 0; i < STEP_DROP_SAMPLES; i++) {
      _probe.translate(_drop);
      const contact = this.collider.intersectCapsule(_probe);
      if (!contact) continue;
      // Too steep to stand on: fall, and let the slope do what slopes do.
      if (contact.normal.y <= slopeCos) return;

      // Settle at the last height that was clear rather than dropping in and
      // depenetrating: pushing out along the normal moves you down the slope as
      // well as out of it, and a nudge back every sub-step is a treadmill.
      _probe.translate(_push.set(0, increment, 0));
      this.capsule.copy(_probe);
      this.grounded = true;
      this.groundNormal.copy(contact.normal);
      this.ground = contact.surface;
      this.stepClimb = 0;
      return;
    }
  }

  /**
   * Ledge climbing: the move is retried from a position raised by `stepHeight`,
   * and if that path is clear the capsule is dropped back onto what it finds.
   * A wall is blocked up there too; a gap finds nothing on the way down.
   */
  private tryStepUp(dt: number): boolean {
    const t = this.tuning;
    // One sub-step's worth of walking, no more. Reaching further would clear the
    // tread and land the probe inside the riser above it.
    const reach = Math.max(t.walkSpeed * dt, 0.02);

    _probeStart.set(
      this.capsule.start.x + this.wishX * reach,
      this.capsule.start.y + t.stepHeight,
      this.capsule.start.z + this.wishZ * reach,
    );
    _probeEnd.copy(_probeStart).setY(_probeStart.y + t.height - t.radius * 2);
    _probe.set(_probeStart, _probeEnd, t.radius);

    if (this.collider.overlaps(_probe)) return false;

    // Clear up there. Feel for the surface on the way back down; if nothing is
    // within the step height, this was a gap rather than a ledge.
    const increment = t.stepHeight / STEP_DROP_SAMPLES;
    _drop.set(0, -increment, 0);

    for (let i = 0; i < STEP_DROP_SAMPLES; i++) {
      _probe.translate(_drop);
      // Asked as a contact rather than an overlap, only so the tread can say what
      // it is made of — a step up is where a footfall is most likely to land.
      const contact = this.collider.intersectCapsule(_probe);
      if (contact) {
        // Back off to the last clear height and stand there.
        _probe.translate(_push.set(0, increment, 0));

        // A step-up may only carry you so far past real ground. Climbing is a
        // ratchet by design and unbounded it defeats the slope limit: a ledge
        // ends and resets this, a bank only goes on.
        const gain = _probe.start.y - this.capsule.start.y;
        if (gain > 0 && this.stepClimb + gain > t.stepHeight * STEP_CLIMB_BUDGET) return false;
        this.stepClimb += Math.max(gain, 0);

        this.capsule.copy(_probe);
        this.grounded = true;
        // A tread is flat by definition; the real normal is one frame away.
        this.groundNormal.set(0, 1, 0);
        this.ground = contact.surface;
        return true;
      }
    }
    return false;
  }

  // --- camera -------------------------------------------------------------

  /**
   * Advances the gait by distance covered, not by time: creeping steps rarely
   * and a tap steps not at all. Stride length grows with speed as well, so
   * cadence rises as speed^influence rather than proportionally.
   */
  private advanceBob(dt: number): void {
    const t = this.tuning;
    if (!this.grounded) return;

    const speed = this.speed;
    if (speed < 0.15) {
      // Ease the phase back to a footfall rather than freezing mid-stride.
      this.bobPhase += (Math.round(this.bobPhase) - this.bobPhase) * Math.min(dt * 8, 1);
      // Primed just short of a footfall, so moving off again steps promptly
      // instead of after a full stride of silence.
      this.strideProgress = t.firstStepFraction;
      return;
    }

    const strideAtWalk = t.walkSpeed / Math.max(t.bobStepsPerSecond, 0.1);
    const stride = Math.max(
      0.2,
      strideAtWalk * Math.pow(speed / t.walkSpeed, 1 - t.bobSpeedInfluence),
    );

    this.strideProgress += (speed * dt) / stride;
    // Phase is in cycles and a cycle is two steps, so half a stride per cycle.
    this.bobPhase += (speed * dt) / (stride * 2);

    while (this.strideProgress >= 1) {
      this.strideProgress -= 1;
      this.onFootstep?.({
        speed,
        right: this.headingRight,
        forward: this.headingForward,
      });
    }
  }

  private applyCamera(dt: number): void {
    const t = this.tuning;

    // Eased toward whatever the key is doing, unless standing up would put the
    // head through something. Never while flying: crouch is the descend key there.
    const wanted = !this.noclip && (this.input.crouching || !this.headroom()) ? 1 : 0;
    this.crouch += (wanted - this.crouch) * Math.min(dt * t.crouchSpeed, 1);
    this.applyStance();

    const cycle = this.bobPhase * Math.PI * 2;
    // Recomputed rather than reused from the movement step, which does not run
    // on every frame.
    _right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    // Scales with how fast you are actually going, not with input, so the bob
    // settles as you decelerate. Capped at walking pace, since sprinting already
    // quickens the cadence. `bobScale` rides the same term, so switching the bob
    // off leaves the gait and the footfalls it drives alone.
    const intensity = Math.min(this.speed / t.walkSpeed, 1) * t.bobScale;

    this.dip = Math.max(this.dip - this.dip * Math.min(dt * 9, 1), 0);

    const feetY = this.capsule.start.y - t.radius;

    // A step is a move of less than a step height, while grounded, in either
    // direction. Bounding it keeps a teleport or a fall arrival out. A negative
    // lag puts the camera above the feet and pays back the same way.
    if (this.lastFeetY !== null && this.grounded) {
      const climbed = feetY - this.lastFeetY;
      if (Math.abs(climbed) > 0.001 && Math.abs(climbed) < t.stepHeight * 1.2) {
        this.stepLag += climbed;
      }
    }
    this.lastFeetY = feetY;
    // Paid back exponentially, and clamped so a long flight taken quickly cannot
    // accumulate a lag nobody asked for.
    this.stepLag = THREE.MathUtils.clamp(
      this.stepLag - this.stepLag * Math.min(dt * t.stepSmoothing, 1),
      -MAX_STEP_LAG,
      MAX_STEP_LAG,
    );
    this.camera.position.set(
      this.capsule.start.x,
      feetY -
        this.stepLag +
        t.eyeHeight * (1 - this.stance * (1 - t.crouchScale)) -
        this.dip +
        Math.sin(cycle * 2) * t.bobAmount * intensity,
      this.capsule.start.z,
    );
    // Lateral sway runs at half the vertical rate — one sideways lean per pair
    // of steps, which is how walking actually looks.
    this.camera.position.addScaledVector(_right, Math.sin(cycle) * t.bobSway * intensity);

    this.camera.rotation.set(this.pitch, this.yaw, Math.sin(cycle) * t.bobRoll * intensity);

    // Hysteresis on the speed gate: a single threshold makes the FOV flap at
    // frame rate whenever you hover around it with sprint held.
    if (this.zoomedOut) {
      if (!this.input.sprint || this.speed < 0.4) this.zoomedOut = false;
    } else if (this.input.sprint && this.speed > 1.2) {
      this.zoomedOut = true;
    }
    this.talkZoom = THREE.MathUtils.damp(this.talkZoom, this.talkingTo ? 1 : 0, CONVERSE_ZOOM_RATE, dt);
    const targetFov =
      t.fov + (this.zoomedOut ? t.sprintFovBoost : 0) - CONVERSE_ZOOM * this.talkZoom;
    this.authoredFov = THREE.MathUtils.damp(this.authoredFov, targetFov, 6, dt);
    this.applyProjection();
  }
}
