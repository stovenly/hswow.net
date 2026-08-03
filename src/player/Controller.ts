import * as THREE from 'three';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import type { Input } from '../engine/Input';
import type { Collider } from './Collider';

/**
 * First-person movement.
 *
 * The player is a capsule. Acceleration is Quake-shaped — accelerate toward the
 * wish direction only up to the wish speed, with separate ground and air rates
 * — because that model is what makes an FPS feel crisp rather than slippery,
 * and it gives air control without giving flight.
 *
 * Integration runs on a fixed sub-step. Collision resolution is not
 * frame-rate-independent in any honest sense: a big step lets the capsule reach
 * further into geometry before it is pushed out, and the recovery differs. A
 * fixed sub-step means a phone at 30 fps and a desktop at 144 resolve the same
 * way.
 */

const SUB_STEP = 1 / 120;
/** Enough for the loop's 0.1 s delta clamp, with headroom. */
const MAX_SUB_STEPS = 16;
/** How many depenetration passes per sub-step. Corners need more than one. */
const RESOLVE_PASSES = 4;
/** Downward probe increments for the step-up landing sweep. */
const STEP_DROP_SAMPLES = 6;

/**
 * How soon after landing a jump counts as a continuation rather than a new
 * push-off, in seconds.
 *
 * Chaining hops is one continuous contact with the ground: the foot arrives,
 * loads and leaves. The landing already made that sound, so a take-off scuff
 * a few milliseconds later reads as a stutter rather than as effort. Past this
 * the player has been standing there and pushing off is its own event.
 */
const HOP_CONTINUATION = 0.28;

/** Which axis a field-of-view figure is measured along. See `fovScaling`. */
export type FovScaling = 'horizontal' | 'vertical';

export interface PlayerTuning {
  /** Capsule radius. Also, incidentally, how tight a gap the player fits through. */
  radius: number;
  /** Head to heel. */
  height: number;
  /** Camera height above the feet. Slightly below `height`, as eyes are. */
  eyeHeight: number;

  walkSpeed: number;
  sprintScale: number;
  /**
   * Eye height while crouched, as a fraction of the standing one.
   *
   * The camera moves and the capsule does not. That is a deliberate
   * simplification and worth stating plainly: a shorter capsule would let the
   * player crouch under things, which needs a headroom test before standing up
   * again or they stand up inside geometry. Nothing in this world is low enough
   * to crawl under yet, so crouch is a *viewpoint* — it lowers the eye to look
   * at something properly — and the collision volume is unchanged.
   */
  crouchScale: number;
  /**
   * Capsule height while crouched, as a fraction of the standing one.
   *
   * The collider really does shrink now. That is what makes crouching a
   * *movement* rather than a camera effect — you can get under a beam — and it
   * brings an obligation with it: something has to stop the player standing up
   * inside whatever they crouched under. See `headroom`.
   */
  crouchHeight: number;
  /**
   * How fast the crouch eases in and out, in fractions per second.
   *
   * High. The ease exists only so the camera does not *teleport* between two
   * heights — a couple of frames of travel is enough to read as movement, and
   * anything slower feels like the controller is thinking about it. Crouching
   * is an input, not an animation.
   */
  crouchSpeed: number;
  /** Movement speed while crouched, as a multiple of the walk. */
  crouchDrag: number;
  /**
   * How fast the camera catches up after a step, in fractions per second.
   *
   * High enough that the lag is never more than a few centimetres — this is
   * smoothing a judder, not adding suspension.
   */
  stepSmoothing: number;
  groundAccel: number;
  /**
   * Steering authority while airborne.
   *
   * Deliberately generous — about half the ground figure, where a cautious
   * controller uses a fifth of it. A jump you cannot adjust once you have left
   * the ground is a jump you have to line up perfectly *before* taking it, and
   * a game about moving over things becomes a game about standing still and
   * aiming.
   *
   * **This is only safe because `maxAirSpeed` exists.** Quake air acceleration
   * has no upper bound, so raising this without a speed cap would not have made
   * the player more agile, it would have made air-strafing accumulate faster.
   * With the magnitude capped, this buys steering and nothing else.
   */
  airAccel: number;
  friction: number;
  /** Floor under the friction curve, so low speeds still stop crisply. */
  stopSpeed: number;

  /** Well above 9.81. Real gravity reads as floating in a first-person game. */
  gravity: number;
  jumpSpeed: number;
  /**
   * Grace period after walking off a ledge during which a jump still works.
   *
   * Generous on purpose. Players press jump *as* they reach an edge, not a
   * frame before it, and the honest version of that — no grace at all — reads
   * as the game dropping inputs rather than as the player being late. A fifth
   * of a second is long enough to cover a normal mistime and short enough that
   * jumping from thin air never looks like it.
   */
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
  /**
   * Reverses horizontal look.
   *
   * Rare, and worth having anyway: a player who inverts one axis on a flight
   * stick often inverts both, and the alternative to an option is that the
   * game is unplayable for them.
   */
  invertX: boolean;

  /**
   * Global scale over the head bob, 0..1.
   *
   * Separate from the three amplitudes rather than folded into them, and for
   * the same reason `windUniforms.swayAmount` is separate from the per-species
   * flex weights: turning the effect off must not destroy the tuning. A player
   * who switches head bob off and back on gets the bob that was dialled in,
   * not the defaults, and the debug sliders keep working underneath.
   */
  bobScale: number;
  bobAmount: number;
  bobSway: number;
  bobRoll: number;
  /** Footfalls per second at walking pace. Two footfalls to a bob cycle. */
  bobStepsPerSecond: number;
  /**
   * How far into a stride the gait sits while standing still, 0..1.
   *
   * Moving off from a standstill should step almost at once. Starting a stride
   * from zero means a stride's worth of silent walking before the first
   * footfall, which reads as the sound being broken rather than as gait.
   */
  firstStepFraction: number;
  /**
   * How much faster the legs turn over when moving faster, as an exponent on
   * the speed ratio.
   *
   * 1 would make cadence proportional to speed, which is wrong and reads as a
   * cartoon scramble: going 75% faster does not mean taking steps 75% faster.
   * People cover ground mostly by lengthening their stride, and cadence rises
   * roughly with the square root of speed, hence 0.5. Set it to 0 for a fixed
   * cadence regardless of pace.
   */
  bobSpeedInfluence: number;

  /**
   * Ceiling on horizontal speed while airborne, as a multiple of sprint speed.
   *
   * **This exists because Quake acceleration has no upper bound in the air.**
   * The rule is "add up to the shortfall between your speed *along the wish
   * direction* and the wish speed" — and if you point the wish direction
   * sideways to where you are already going, that dot product stays near zero,
   * so the shortfall stays near full and you keep getting acceleration you have
   * no business getting. It adds at right angles to your motion, so the total
   * speed grows by Pythagoras, and with no air friction to bleed it off, every
   * hop compounds the last. That is air-strafing, and it is why holding jump
   * while steering at an angle ran away to absurd speeds.
   *
   * Capping the *magnitude* rather than the acceleration keeps what is good
   * about air control — you can still steer freely mid-jump — and removes only
   * the speed gain. A little over 1 leaves a small reward for chaining jumps
   * well without letting it snowball.
   */
  maxAirSpeed: number;

  fov: number;
  /**
   * Which axis `fov` is measured along.
   *
   * The two behave differently only when the window is not 16:9, and the
   * difference is what happens to the *other* axis as the shape changes:
   *
   * - `vertical` fixes the vertical angle, so a wider window shows more to
   *   the sides. This is Hor+, it is what most PC games do, and it is what
   *   three.js does natively — `PerspectiveCamera.fov` is a vertical angle.
   * - `horizontal` fixes the horizontal angle, so a wider window loses height
   *   instead. This is Vert−, and it is what a player usually means when they
   *   type a number into an FOV box, because the numbers everyone quotes
   *   (90, 103) are horizontal ones.
   *
   * Both are honest and neither is a hack; which one is wanted depends on
   * whether the player is thinking about the number or about the window.
   */
  fovScaling: FovScaling;
  /**
   * How much wider the view goes while sprinting, in degrees **on top of**
   * `fov`.
   *
   * A boost rather than a second absolute angle. Held absolutely, the two have
   * to be kept in step by whoever moves either — a field-of-view slider that
   * set one and forgot the other would silently turn the sprint zoom into a
   * zoom *out*, and nothing in the code would look wrong. As a delta the
   * relationship cannot come apart: the effect is this many degrees wherever
   * the player puts their field of view, and 0 is no effect at all.
   */
  sprintFovBoost: number;
  /** Camera dip on landing, per m/s of impact speed. */
  landDip: number;
}

export const DEFAULT_TUNING: PlayerTuning = {
  radius: 0.32,
  height: 1.8,
  // Well below the top of the capsule, and deliberately.
  //
  // 1.62 is where a person's eyes actually are on a 1.8 m body, and it looked
  // wrong: at that height you are above most of the art kit, the ground is a
  // long way down, and everything reads as smaller than it is. Dropping the
  // camera without dropping the capsule keeps collision honest — you still
  // occupy a person's volume — while putting the view somewhere the world can
  // be looked *at* rather than over.
  eyeHeight: 1.35,

  walkSpeed: 4.2,
  sprintScale: 1.75,
  crouchScale: 0.52,
  crouchHeight: 0.58,
  crouchSpeed: 22,
  crouchDrag: 0.45,
  stepSmoothing: 16,
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
  // Vertical, which is also what this was implicitly before the option
  // existed — `PerspectiveCamera.fov` is a vertical angle and the code set it
  // straight. So 80 keeps meaning exactly what it meant while it was being
  // tuned, and the option changes the framing only for somebody who asks it
  // to. Read as horizontal it would be 50.5° vertical on a 16:9 screen, which
  // is a considerably tighter game than the one that was dialled in.
  fovScaling: 'vertical',
  sprintFovBoost: 8,
  landDip: 0.02,
};

/** Scratch vectors — the movement step runs up to 16 times a frame. */
const _wish = new THREE.Vector3();
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _push = new THREE.Vector3();
const _delta = new THREE.Vector3();
const _drop = new THREE.Vector3();
const _before = new THREE.Vector3();
const _position = new THREE.Vector3();
const _probeStart = new THREE.Vector3();
const _probeEnd = new THREE.Vector3();
const _probe = new Capsule();
const _look = { x: 0, y: 0 };

export class Controller {
  readonly tuning: PlayerTuning = { ...DEFAULT_TUNING };
  readonly velocity = new THREE.Vector3();

  /** Fires on each footfall, with the speed it happened at. Phase 3 listens. */
  onFootstep: ((speed: number) => void) | null = null;
  /**
   * Fires on touchdown, with the vertical impact speed and the horizontal
   * speed it arrived carrying, both in m/s.
   *
   * **Two numbers, because a landing is two events.** Vertical is what gets
   * arrested and it sets the weight. Horizontal carries on, and it is the shear
   * — the skid, the gravel thrown forward, the difference between dropping onto
   * a spot and sliding into it. Total speed would merge them and get both
   * wrong: a fast shallow skim would read as heavier than a long drop.
   */
  onLand: ((impact: number, horizontal: number) => void) | null = null;
  /**
   * Fires on a jump that is a fresh push-off rather than a continued hop, with
   * the horizontal speed it was taken at.
   *
   * Suppressed within `HOP_CONTINUATION` of landing — see that constant.
   */
  onJump: ((speed: number) => void) | null = null;

  /**
   * Public so systems that need the player's *view* can read it — the
   * interaction ray is cast down the camera axis, not the body's facing, and
   * those differ by the head bob and the pitch.
   */
  readonly camera: THREE.PerspectiveCamera;
  private readonly input: Input;
  private readonly collider: Collider;
  private readonly capsule = new Capsule();

  private yaw = 0;
  private pitch = 0;
  /** Whether the sprint widening is currently engaged. Latched, with
   * hysteresis — see `applyCamera`. */
  private zoomedOut = false;
  /**
   * The field of view **in the axis the player authored it in**, damped.
   *
   * Held separately from `camera.fov`, which is always vertical. Damping the
   * camera's value directly would mean the sprint widening was smoothed in a
   * different unit depending on the scaling option, and — worse — that a
   * window resize under horizontal scaling would be *eased* into rather than
   * simply being the correct angle for the new shape.
   */
  private authoredFov = DEFAULT_TUNING.fov;
  /**
   * How far into the crouch the camera is, 0..1.
   *
   * Eased rather than switched. A camera that jumps between two heights on a
   * key press reads as a teleport, and the whole value of crouching is that you
   * watch the world get taller.
   */
  private crouch = 0;
  /**
   * How far the camera is still lagging behind the feet after a step up.
   *
   * Climbing a stair is a sequence of instantaneous vertical jumps: the
   * collider finds the next tread, the capsule is placed on it, and the camera
   * — which is pinned to the feet — snaps up with it. At a 0.19 m rise and four
   * steps a second that is a visible judder, and it reads as the controller
   * struggling rather than as the player climbing.
   *
   * The fix is not to move the feet more smoothly, which would break collision;
   * it is to let the *camera* arrive late. Each upward step is subtracted from
   * the camera's height here and paid back over the next fraction of a second,
   * so the body climbs in steps and the view rises in one continuous glide.
   */
  private stepLag = 0;
  /**
   * How short the capsule currently is, 0..1, matching `crouch`.
   *
   * Held separately from the input because the two can disagree: releasing the
   * key under a low beam has to leave the body crouched until there is room to
   * rise. The camera follows this rather than the key for the same reason —
   * the view has to agree with the collision volume or you are looking out of
   * the top of a ceiling.
   */
  private stance = 0;
  /** Feet height last frame, for spotting those steps. */
  private lastFeetY: number | null = null;

  /** Surface the player is standing on. Straight up whenever airborne. */
  private readonly groundNormal = new THREE.Vector3(0, 1, 0);
  /** Horizontal unit direction the player is asking to go, world space. */
  private wishX = 0;
  private wishZ = 0;
  private grounded = false;
  /** Set for the one sub-step a jump is launched on, so it isn't snapped back. */
  private jumped = false;
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
    // **Seeded, not damped into.**
    //
    // `Viewport` constructs the camera at whatever fov it likes — 70 — and the
    // tuning here wants 74, so without this the first second of play is a slow
    // zoom from one to the other. That is bad enough on its own, and worse
    // because those are the frames boot work is stuttering through: `damp` fed
    // erratic deltas moves in lurches, and the whole thing reads as the camera
    // wobbling in and out as the page loads.
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
    // The capsule has just been rebuilt at full height. `applyStance` only acts
    // when the crouch has moved, so without this a player who arrives mid-crouch
    // would keep a standing collision volume until they stood up and ducked
    // again — and the camera, which follows `stance`, would be at the wrong
    // height for it the whole time.
    this.stance = 0;
    this.crouch = 0;
    this.stepLag = 0;
    this.lastFeetY = null;
  }

  /**
   * Changes the field of view **at once**, rather than easing into it.
   *
   * The damp in `applyCamera` exists for the sprint zoom, where the whole
   * effect is the widening — and it is exactly wrong for a settings slider,
   * where every drag of the handle would chase a target it never reaches and
   * the picture would lag a fraction of a second behind the number. Setting
   * the camera here puts it already at the target, so the damp has nothing
   * left to do and the next frame is drawn at the new angle.
   *
   * All three together, because whether the boost is currently applied depends
   * on whether the player is sprinting, and only this class knows — and
   * because changing the scaling without the angle would be read against the
   * wrong axis for a frame.
   */
  setFieldOfView(fov: number, sprintBoost: number, scaling: FovScaling): void {
    this.tuning.fov = fov;
    this.tuning.sprintFovBoost = sprintBoost;
    this.tuning.fovScaling = scaling;
    this.authoredFov = fov + (this.zoomedOut ? sprintBoost : 0);
    this.applyProjection();
  }

  /**
   * Writes the camera's *vertical* angle from the authored one.
   *
   * The conversion is the only place the scaling option means anything, and it
   * has to happen here rather than once when the option changes, because it
   * depends on the aspect ratio — which moves whenever the window does. Run
   * every frame from `applyCamera`, it costs a `tan` and an `atan` and it can
   * never be stale.
   *
   * Guarded on an actual change: `updateProjectionMatrix` is not free, and the
   * value is identical on the vast majority of frames.
   */
  private applyProjection(): void {
    const authored = this.authoredFov;
    const vertical =
      this.tuning.fovScaling === 'vertical'
        ? authored
        : // Half-angles, because the tangent relationship holds on the half
          // and not on the whole: the aspect ratio is width over height of the
          // image plane, and each half-angle subtends half of one of those.
          THREE.MathUtils.radToDeg(
            2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(authored) / 2) / this.camera.aspect),
          );

    if (Math.abs(vertical - this.camera.fov) > 1e-3) {
      this.camera.fov = vertical;
      this.camera.updateProjectionMatrix();
    }
  }

  /** Feet position — what autosave persists in Phase 9. Shared scratch; copy it. */
  get position(): THREE.Vector3 {
    return _position.copy(this.capsule.start).setY(this.capsule.start.y - this.tuning.radius);
  }

  get heading(): number {
    return this.yaw;
  }

  get isGrounded(): boolean {
    return this.grounded;
  }

  get speed(): number {
    return Math.hypot(this.velocity.x, this.velocity.z);
  }

  update(dt: number): void {
    this.applyLook();

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

    if (this.grounded) {
      // Steer along the surface rather than into it. Walking up a slope is
      // then just walking: the wish direction tilts with the ground, so the
      // acceleration that carries you forward carries you up as well, and
      // gravity never has to be fought with a horizontal push.
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
      // Crouching slows you down, and does so smoothly with the camera rather
      // than as a step — otherwise the speed changes a beat before the view
      // does and the two read as unrelated.
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

  /**
   * Bounds horizontal speed in the air. See `maxAirSpeed`.
   *
   * Horizontal only — scaling the vertical component too would turn the cap
   * into a parachute, slowing every fall the moment a player happened to be
   * moving quickly sideways.
   */
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

    // Moving along a surface rather than into it means there is nothing to
    // penetrate, so contact is lost the moment the ground stops being flat —
    // walking up a ramp, over the lip of one, down a stair. Feel for ground
    // within a step's reach and settle back onto it. Only an actual jump is
    // exempt; anything else that leaves the floor should be pulled back to it.
    if (wasGrounded && !this.grounded && !this.jumped) this.snapToGround();

    // Ledge climbing, when the player is asking to go somewhere and isn't.
    // Not gated on being grounded: catching a lip on the way down is the same
    // manoeuvre, and `tryStepUp` refuses anything that isn't a real ledge.
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

      this.capsule.translate(_push.copy(contact.normal).multiplyScalar(contact.depth));

      // Standing is only possible on a surface flatter than the slope limit.
      // On anything steeper the contact still stops you, but gravity is left
      // alone, so you slide down it.
      if (contact.normal.y > slopeCos) {
        this.grounded = true;
        this.groundNormal.copy(contact.normal);
      }

      const into = this.velocity.dot(contact.normal);
      if (into < 0) this.velocity.addScaledVector(contact.normal, -into);
    }

    if (!this.grounded) this.groundNormal.set(0, 1, 0);
  }

  /**
   * Whether there is room to stand up.
   *
   * Tests the capsule at *full* height at the player's current feet. Cheap —
   * one overlap query — and only meaningful while crouched, so it short-circuits
   * the rest of the time.
   *
   * Without this, releasing the key under a beam would push the capsule's head
   * into solid geometry and the collider would resolve it by shoving the player
   * sideways out of the gap they had deliberately squeezed into, which reads as
   * the world rejecting them.
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

  /**
   * Resizes the capsule to match the current crouch.
   *
   * **The feet stay put and the head moves**, which is the only version that
   * behaves: shrinking about the middle would lift the feet off the floor on
   * the way down and drive them through it on the way up, and either one is a
   * frame of the player falling or being ejected.
   */
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
   * Feels downward for a walkable surface within one step height and settles
   * onto it. Deliberately penetrates before resolving, because `resolve` is
   * what reports the surface normal, and a probe that stops just short of
   * contact reports nothing at all.
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
      // depenetrating. Pushing out along the surface normal moves you *down
      // the slope* as well as up out of it, and a nudge backwards every
      // sub-step is a treadmill — it is what stops a 45° ramp being climbable
      // while a 20° one is fine.
      _probe.translate(_push.set(0, increment, 0));
      this.capsule.copy(_probe);
      this.grounded = true;
      this.groundNormal.copy(contact.normal);
      return;
    }
  }

  /**
   * Ledge climbing.
   *
   * Rather than special-casing the geometry, the move is retried from a
   * position raised by `stepHeight`; if that path is clear, the capsule is
   * dropped back onto whatever it finds. A kerb or a stair tread is climbed;
   * a wall is not, because the raised path is blocked too; a gap is not,
   * because nothing is found on the way down.
   */
  private tryStepUp(dt: number): boolean {
    const t = this.tuning;
    // One sub-step's worth of walking, no more. Reaching further would clear
    // the tread the player is climbing onto and land the probe inside the
    // riser above it, so a staircase would read as a wall. A stair is climbed
    // over several sub-steps, a fraction at a time, the way it is walked.
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
      if (this.collider.overlaps(_probe)) {
        // Back off to the last clear height and stand there.
        _probe.translate(_push.set(0, increment, 0));
        this.capsule.copy(_probe);
        this.grounded = true;
        // A tread is flat by definition; the real normal is one frame away.
        this.groundNormal.set(0, 1, 0);
        return true;
      }
    }
    return false;
  }

  // --- camera -------------------------------------------------------------

  /**
   * Advances the gait by **distance covered**, not by time.
   *
   * A time-driven cadence gets the sprint right and everything else wrong:
   * edging forward at walking pace still steps at walking rate, and tapping a
   * key fires a footfall for a few centimetres of movement. Distance fixes
   * both — a step happens when a stride's worth of ground has gone past, so
   * creeping steps rarely and a tap steps not at all.
   *
   * Cadence still has to rise sub-linearly with speed, or a sprint scrambles.
   * That falls out for free by making stride length grow with speed too:
   *
   *     stride ∝ speed^(1 − influence)   ⟹   cadence = speed/stride ∝ speed^influence
   *
   * which is also roughly what people do — most of going faster is a longer
   * stride, not a quicker one.
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
      this.onFootstep?.(speed);
    }
  }

  private applyCamera(dt: number): void {
    const t = this.tuning;

    // Eased toward whatever the key is doing — unless standing up would put
    // the player's head through something, in which case they stay down.
    //
    // Held, not toggled: `crouching` is a live read of the key state, so
    // releasing it always stands you up the moment there is room.
    const wanted = this.input.crouching || !this.headroom() ? 1 : 0;
    this.crouch += (wanted - this.crouch) * Math.min(dt * t.crouchSpeed, 1);
    this.applyStance();

    const cycle = this.bobPhase * Math.PI * 2;
    // Recomputed rather than reused from the movement step, which does not run
    // on every frame.
    _right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    // Scales with how fast you are actually going, not with input, so the bob
    // settles as you decelerate instead of cutting out. Capped at walking
    // pace: sprinting already quickens the cadence, and letting it deepen the
    // sway as well stacks two effects into a lurch.
    //
    // `bobScale` rides on the same term, so switching the bob off scales all
    // three components at once and leaves the gait itself alone — footfalls are
    // driven by distance covered in `advanceBob` and keep firing exactly as
    // before, which is what stops "no head bob" also meaning "no footsteps".
    const intensity = Math.min(this.speed / t.walkSpeed, 1) * t.bobScale;

    this.dip = Math.max(this.dip - this.dip * Math.min(dt * 9, 1), 0);

    const feetY = this.capsule.start.y - t.radius;

    // A step is an *upward* move, while grounded, of less than a step height.
    // Bounding it above matters: a teleport or a fall arrival also moves the
    // feet, and smoothing those would leave the camera drifting up through the
    // floor for half a second after every portal.
    if (this.lastFeetY !== null && this.grounded) {
      const climbed = feetY - this.lastFeetY;
      if (climbed > 0.001 && climbed < t.stepHeight * 1.2) this.stepLag += climbed;
    }
    this.lastFeetY = feetY;
    // Paid back exponentially. Fast enough that the camera is never far from
    // where the body is — which matters, because the lag is a lie about where
    // your eyes are and a long one would be felt as floating.
    this.stepLag = Math.max(0, this.stepLag - this.stepLag * Math.min(dt * t.stepSmoothing, 1));
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

    // Hysteresis on the speed gate. A single threshold makes the FOV flap
    // between the two values whenever you happen to be moving at about that
    // speed with sprint held — which is a zoom oscillating at frame rate, and
    // reads as the camera wobbling in and out.
    if (this.zoomedOut) {
      if (!this.input.sprint || this.speed < 0.4) this.zoomedOut = false;
    } else if (this.input.sprint && this.speed > 1.2) {
      this.zoomedOut = true;
    }
    const targetFov = t.fov + (this.zoomedOut ? t.sprintFovBoost : 0);
    this.authoredFov = THREE.MathUtils.damp(this.authoredFov, targetFov, 6, dt);
    this.applyProjection();
  }
}
