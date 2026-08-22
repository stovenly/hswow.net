import * as THREE from 'three';
import type { RigHandle } from '../art/rig';
import type { Collider } from '../player/Collider';
import type { AudioEngine } from '../audio/AudioEngine';
import { Emitter } from '../audio/Emitter';
import { buildOneShot, type OneShot } from '../audio/Scatter';
import { createVoice, voiceState, type Voice, type Utterance } from '../audio/voice/Voice';
import { flags } from '../debug/flags';
import { VoiceLabel } from '../debug/VoiceLabel';
import { Pose, applyPose, approach, angleTo, smooth, clamp01, envelope } from './pose';
import { Spring, damp } from './spring';
import { Legs } from './legs';
import type { LifeSpec } from './spec';
import {
  bipedFidget,
  bipedGreet,
  bipedIdle,
  bipedTalk,
  bipedWalk,
  call,
  faceGreet,
  faceHang,
  faceIdle,
  faceTalk,
  fowlIdle,
  fowlWalk,
  graze,
  look,
  peck,
  quadrupedIdle,
  quadrupedWalk,
  stride,
  FOWL_SWING,
  QUAD_SWING,
  pulse,
  GREET_LENGTH,
  type Fidget,
  type Greeting,
  type Talk,
} from './gaits';

const FIDGETS: readonly Fidget[] = ['stretch', 'scratch', 'fold', 'lookAround', 'shift'];
const GREETINGS: readonly Greeting[] = ['wave', 'bow', 'raise', 'heart', 'press', 'brow', 'beckon', 'doff', 'offer', 'clap'];
const TALKS: readonly Talk[] = ['beat', 'roll', 'sweep', 'clasp', 'point', 'open'];

/** The next of a list, never the one just used. */
function another<T>(list: readonly T[], last: T): T {
  const i = Math.floor(Math.random() * list.length);
  return list[i] === last ? list[(i + 1) % list.length] : list[i];
}

/**
 * One living thing: a rigged mesh, a bit of mind, and a voice.
 *
 * The mind is a small state machine — idle, walk, business, greet, talk — over
 * a home disc it wanders in. Attention is separate and continuous: within
 * notice range the head tracks the player, glancing away and back; within
 * greeting range the body turns and the creature greets once, then leaves it a
 * good while.
 *
 * Every frame the mind decides weights and phases, the layers in `gaits` are
 * summed into one pose, a biped's legs are solved from its planted feet, the
 * transition offset is added and decayed, and the pose is written to the
 * skeleton.
 */

export interface World {
  /** The player's feet, world space. */
  player: THREE.Vector3;
  /** The player's eye — where a creature looks when it looks at you. */
  eye: THREE.Vector3;
  /** Where the player is looking, unit: a greeting waits to be looked at. */
  gaze: THREE.Vector3;
  groundAt: (x: number, z: number) => number;
  collider: Collider;
  audio: AudioEngine | null;
  /** Whether the occlusion raycast is due this frame. */
  retestOcclusion: boolean;
  /** Everything else awake, for keeping apart. */
  others: readonly Creature[];
}

type State = 'idle' | 'walk' | 'business' | 'greet' | 'talk';

const NOTICE: Record<LifeSpec['kind'], number> = { biped: 10, quadruped: 8, fowl: 5 };
const GREET: Record<LifeSpec['kind'], number> = { biped: 2.6, quadruped: 2.4, fowl: 1.8 };
/** How far off the player's line of sight a creature can be and still be greeted at. */
const GREET_GAZE = 0.58;
const TURN_RATE = 2.4;
/** Seconds the shoulders wait after the head has gone before they follow. */
const BODY_LAG = 0.4;
/** How far off its own facing a creature will leave you rather than square up. */
const SHOULDER_EASE = 0.45;
const HEAD_YAW_LIMIT = 1.15;
/**
 * How far a figure will turn to look, shared out over torso, neck and head by
 * `look` — so this is the whole upper body twisting, not a neck on its own.
 */
const BIPED_YAW_LIMIT = 1.6;
/** Within this of its facing, a greeting can start. */
const GREET_FACING = 1;
const HEAD_PITCH_LIMIT = 0.62;
/** Half-life of the offset a state change leaves behind. */
const SETTLE = 0.14;

/** When anything last began a greeting, so a crowd takes turns rather than hailing at once. */
let lastGreetAt = -Infinity;
/** Seconds between one creature's greeting starting and the next's. */
const GREET_GAP = 0.9;

const _dir = new THREE.Vector3();
const _origin = new THREE.Vector3();
const _at = new THREE.Vector3();
const _rot = new THREE.Vector3();

export class Creature {
  readonly mesh: THREE.SkinnedMesh;
  readonly spec: LifeSpec;
  private readonly rig: RigHandle;
  private readonly pose: Pose;
  private readonly layer: Pose;
  private readonly last: Pose;
  /** The difference a state change left, decaying to nothing. */
  private readonly offset: Float32Array;
  private settling = false;
  private readonly home = new THREE.Vector2();
  private readonly salt: number;
  private readonly legs: Legs | null;
  private placed = false;

  private state: State = 'idle';
  private timer = 0;
  private clock = 0;
  private yaw: number;
  private speed = 0;
  private lastSpeed = 0;
  private phase = 0;
  private readonly target = new THREE.Vector2();
  private probeIn = 0;

  private walkW = 0;
  private grazeW = 0;
  private lookW = 0;
  private readonly lookYaw = new Spring();
  private readonly lookPitch = new Spring();
  /** Where the eyes are, when not on the player: a glance yaw and how long. */
  private glanceYaw = 0;
  private glancePitch = 0;
  private glanceFor = 0;
  private glanceIn = 2;
  private readonly lean = new Spring();
  private readonly headLag = new Spring();
  private readonly earLag = new Spring();
  private gestureT = 0;
  /** Runs from the moment it turns to you; the gesture clock waits on this. */
  private turnT = 0;
  private hailed = false;
  private gestureLength = 1;
  private fidget: Fidget = 'lookAround';
  private fidgetLength = 3;
  private greeting: Greeting;
  private talkStyle: Talk = 'beat';
  private lastYaw: number;
  private greetCooldown = 0;
  private greeted = false;
  private talkedThisVisit = false;
  private nearFor = 0;

  private emitter: Emitter | null = null;
  private shot: OneShot | null = null;
  private voice: Voice | null = null;
  private said: Utterance | null = null;
  /** `?debug`: what this one is saying, over its head. */
  private label: VoiceLabel | null = null;

  constructor(mesh: THREE.SkinnedMesh) {
    this.mesh = mesh;
    this.rig = mesh.userData.rig as RigHandle;
    this.spec = mesh.userData.life as LifeSpec;
    this.pose = new Pose(this.rig.names);
    this.layer = new Pose(this.rig.names);
    this.last = new Pose(this.rig.names);
    this.offset = new Float32Array(this.pose.data.length);
    this.home.set(mesh.position.x, mesh.position.z);
    this.yaw = mesh.rotation.y;
    this.lastYaw = this.yaw;
    this.greeting = GREETINGS[this.spec.seed % GREETINGS.length];
    this.salt = (this.spec.seed % 1000) * 0.37;
    this.legs = this.spec.legs && this.rig.bones.legLf ? new Legs(this.spec, this.rig) : null;
    // Out of step with its neighbours from the first frame.
    this.clock = (this.spec.seed % 97) * 0.61;
    this.timer = 1 + (this.spec.seed % 7);
    this.glanceIn = 1 + (this.spec.seed % 5) * 0.7;
    // Bones and mesh move; the zone froze them.
    mesh.matrixAutoUpdate = true;
    for (const name of this.rig.names) this.rig.bones[name].matrixAutoUpdate = true;
  }

  /** The cylinder the player is pushed out of. */
  get radius(): number {
    return this.spec.radius;
  }
  get height(): number {
    return this.spec.height;
  }

  update(dt: number, world: World): void {
    this.clock += dt;
    const spec = this.spec;
    const pos = this.mesh.position;
    if (!this.placed) {
      this.placed = true;
      pos.y = world.groundAt(pos.x, pos.z);
      this.legs?.place(pos, this.yaw, world.groundAt);
    }

    // --- attention --------------------------------------------------------
    const dx = world.player.x - pos.x;
    const dz = world.player.z - pos.z;
    const dist = Math.hypot(dx, dz);
    const bearing = Math.atan2(dx, dz);
    const notice = NOTICE[spec.kind];
    const greetAt = GREET[spec.kind];
    if (dist > greetAt * 2.2) {
      this.greeted = false;
      this.talkedThisVisit = false;
      this.nearFor = 0;
    }
    this.greetCooldown = Math.max(0, this.greetCooldown - dt);

    // Glances: every few seconds the gaze goes somewhere else for a moment —
    // away from the player if it is on them, to something if it is not.
    this.glanceIn -= dt;
    if (this.glanceFor > 0) this.glanceFor -= dt;
    if (this.glanceIn <= 0) {
      this.glanceIn = 3 + Math.random() * 5;
      this.glanceFor = 0.5 + Math.random() * 1.2;
      this.glanceYaw = (Math.random() - 0.5) * 1.4;
      this.glancePitch = (Math.random() - 0.5) * 0.3;
    }
    const glancing = this.glanceFor > 0;

    // The head follows the player within notice range, as far as it can turn.
    let wantLook = 0;
    let goalYaw = 0;
    let goalPitch = 0;
    const engaged = this.state === 'greet' || this.state === 'talk';
    if (dist < notice && !(glancing && !engaged)) {
      // Aimed at the camera, which is not always over the player's feet.
      const eyeDist = Math.max(0.2, Math.hypot(world.eye.x - pos.x, world.eye.z - pos.z));
      const local = angleTo(this.yaw, Math.atan2(world.eye.x - pos.x, world.eye.z - pos.z));
      // A person stood behind you does not wait for you to turn round before
      // they look. A figure that is not walking twists as far as it goes
      // whatever the angle, and unwinds as the shoulders come after it. An
      // animal keeps to its own neck, and nothing does it while walking away.
      const limit = spec.kind === 'biped' ? BIPED_YAW_LIMIT : HEAD_YAW_LIMIT;
      const reach = spec.kind === 'biped' && this.state !== 'walk' ? Math.PI : limit + 0.4;
      if (Math.abs(local) < reach) {
        wantLook = 1;
        // The camera itself, not a nominal height off the player's feet: it
        // looks you in the eye whether you are crouching, standing or in the air.
        goalYaw = Math.max(-limit, Math.min(limit, local));
        goalPitch = Math.max(-HEAD_PITCH_LIMIT, Math.min(HEAD_PITCH_LIMIT, -Math.atan2(world.eye.y - (pos.y + spec.headHeight), eyeDist)));
      }
    } else if (glancing && this.state !== 'walk') {
      wantLook = 0.7;
      goalYaw = this.glanceYaw;
      goalPitch = this.glancePitch;
    }
    // A glance is quick and settles; the weight comes in faster than it goes.
    this.lookYaw.to(goalYaw, 0.1, dt);
    this.lookPitch.to(goalPitch, 0.12, dt);
    this.lookW = damp(this.lookW, wantLook, wantLook > this.lookW ? 0.12 : 0.35, dt);

    // Whether the player is looking this way: the cosine between where they
    // are looking, flattened, and the way from them to here.
    const gl = Math.hypot(world.gaze.x, world.gaze.z) || 1;
    const looked = dist > 0.01 && (world.gaze.x * -dx + world.gaze.z * -dz) / (gl * dist) > GREET_GAZE;

    // Greeting: once per approach, when it is looked at, not again for a while,
    // and never on the heels of someone else's.
    const now = performance.now() / 1000;
    if (
      dist < greetAt &&
      looked &&
      !this.greeted &&
      this.greetCooldown === 0 &&
      now - lastGreetAt > GREET_GAP + (this.spec.seed % 5) * 0.15 &&
      (this.state === 'idle' || this.state === 'business' || this.state === 'walk')
    ) {
      this.begin('greet');
      this.greeted = true;
      this.greetCooldown = 30 + (this.spec.seed % 30);
      lastGreetAt = now;
    }
    // A figure that has greeted and is still being stood in front of says
    // something, once.
    if (spec.kind === 'biped' && dist < greetAt * 0.8 && this.greeted) this.nearFor += dt;
    else this.nearFor = 0;
    if (spec.kind === 'biped' && this.state === 'idle' && this.nearFor > 2.5 && !this.talkedThisVisit) {
      this.talkedThisVisit = true;
      this.begin('talk');
      const said = this.babble('talk', world);
      if (said) this.gestureLength = said.end - said.at + 0.6;
    }

    // --- the state machine ------------------------------------------------
    this.timer -= dt;
    let wantWalk = 0;
    let wantGraze = 0;
    switch (this.state) {
      case 'idle':
        if (this.timer <= 0) {
          const busy = (spec.grazes || spec.kind === 'biped') && Math.random() < 0.5;
          if (!busy && spec.roam > 0 && this.pickTarget(world)) {
            this.begin('walk');
          } else if (spec.grazes || spec.kind === 'biped') {
            this.begin('business');
          } else {
            this.timer = 2 + Math.random() * 5;
          }
        }
        break;
      case 'business':
        if (spec.grazes) wantGraze = 1;
        if (this.timer <= 0) this.begin('idle');
        break;
      case 'walk': {
        const tx = this.target.x - pos.x;
        const tz = this.target.y - pos.z;
        const remaining = Math.hypot(tx, tz);
        const heading = Math.atan2(tx, tz);
        const off = angleTo(this.yaw, heading);
        this.yaw += Math.max(-TURN_RATE * dt, Math.min(TURN_RATE * dt, off));
        // Walk once roughly facing the way; slow into the arrival.
        const facing = Math.abs(off) < 0.5;
        const wanted = facing ? spec.walkSpeed * Math.min(1, Math.sqrt(remaining / 0.9) + 0.15) : 0;
        this.speed = approach(this.speed, wanted, spec.walkSpeed * 2.2, dt);
        wantWalk = clamp01(this.speed / (spec.walkSpeed * 0.5));
        // Something in the way — a wall, the player — stops it.
        this.probeIn -= dt;
        if (this.probeIn <= 0) {
          this.probeIn = 0.3;
          if (this.blockedAhead(world) || (dist < spec.radius + 0.7 && Math.abs(angleTo(this.yaw, bearing)) < 0.9)) {
            this.begin('idle');
            this.timer = 1.5 + Math.random() * 3;
            break;
          }
        }
        pos.x += Math.sin(this.yaw) * this.speed * dt;
        pos.z += Math.cos(this.yaw) * this.speed * dt;
        if (remaining < 0.2) this.begin('idle');
        break;
      }
      case 'greet':
      case 'talk': {
        this.turnT += dt;
        // The head goes first and the body follows it. The head has been
        // tracking since you came into notice range; the shoulders come after,
        // and only far enough to leave you off one shoulder — nobody squares up
        // to someone they are talking to.
        //
        // How far it has to go decides both the wait and the speed. Someone
        // stood behind you is not a leisurely quarter turn: the head cannot get
        // there alone, so the shoulders go almost at once and go quickly.
        const off = angleTo(this.yaw, bearing);
        const away = Math.abs(off);
        const hurry = clamp01((away - 0.5) / 1.5);
        const settle = clamp01((this.turnT - BODY_LAG * (1 - 0.8 * hurry)) / 0.35);
        if (settle > 0) {
          const want = Math.sign(off) * Math.max(0, away - SHOULDER_EASE);
          const rate = TURN_RATE * (0.55 + 0.85 * hurry) * smooth(settle);
          this.yaw += Math.max(-rate * dt, Math.min(rate * dt, want));
        }
        // The gesture, and the voice with it, waits until it is round far
        // enough to be greeting *you* — hailing the air behind it, arms up,
        // before it has turned is worse than greeting a moment late.
        if (this.state === 'talk' || away < GREET_FACING || this.turnT > 2.5) {
          if (!this.hailed) {
            this.hailed = true;
            if (this.state === 'greet') {
              if (spec.kind === 'biped') this.babble('greeting', world);
              else this.callOut(0.5, world);
            }
          }
          this.gestureT += dt;
        }
        if (this.gestureT > this.gestureLength) this.begin('idle');
        break;
      }
    }
    if (this.state !== 'walk') this.speed = approach(this.speed, 0, spec.walkSpeed * 3, dt);
    const accel = dt > 0 ? (this.speed - this.lastSpeed) / dt : 0;
    this.lastSpeed = this.speed;
    // Turning: the head lags the turn and catches up; the feet shuffle.
    const yawRate = dt > 0 ? angleTo(this.lastYaw, this.yaw) / dt : 0;
    this.lastYaw = this.yaw;
    this.headLag.to(-yawRate * 0.1, 0.09, dt);
    // Leaning into an acceleration and out of a stop, softened.
    this.lean.to(Math.max(-0.12, Math.min(0.12, accel * 0.06)), 0.18, dt);
    const shuffle = clamp01(Math.abs(yawRate) / 1.6) * 0.5;
    this.walkW = damp(this.walkW, Math.max(wantWalk, shuffle), 0.12, dt);
    this.grazeW = approach(this.grazeW, wantGraze, 0.8, dt);

    // Keep apart from the others.
    for (const other of world.others) {
      if (other === this) continue;
      const ox = pos.x - other.mesh.position.x;
      const oz = pos.z - other.mesh.position.z;
      const d = Math.hypot(ox, oz);
      const gap = spec.radius + other.spec.radius;
      if (d < gap && d > 1e-4) {
        const push = (gap - d) * 0.5 * Math.min(1, dt * 6);
        pos.x += (ox / d) * push;
        pos.z += (oz / d) * push;
      }
    }

    // --- ground -----------------------------------------------------------
    pos.y = world.groundAt(pos.x, pos.z);
    this.mesh.rotation.y = this.yaw;
    let slope = 0;
    if (spec.kind !== 'biped') {
      const half = spec.bodyLength * 0.35;
      const fx = Math.sin(this.yaw) * half;
      const fz = Math.cos(this.yaw) * half;
      const front = world.groundAt(pos.x + fx, pos.z + fz);
      const back = world.groundAt(pos.x - fx, pos.z - fz);
      // rx > 0 tips the front down, so rising ground ahead is a negative pitch.
      slope = Math.max(-0.22, Math.min(0.22, -Math.atan2(front - back, half * 2)));
    }

    // --- the clock --------------------------------------------------------
    if (this.legs) {
      // The stride clock runs at cadence while moving, keeps turning while
      // the feet have anything to settle, and stops when they are home.
      const cadence = Math.PI / this.legs.stepTime;
      const moving = this.speed > 0.02;
      let rate = 0;
      if (moving) rate = cadence * Math.max(0.6, Math.min(1.15, 0.5 + 0.6 * (this.speed / spec.walkSpeed)));
      rate = Math.max(rate, Math.abs(yawRate) * 2.2);
      if (rate === 0 && this.legs.unsettled) rate = cadence * 0.7;
      this.legs.phase += rate * dt;
      this.phase = this.legs.phase;
    } else {
      const swing = spec.kind === 'fowl' ? FOWL_SWING : QUAD_SWING;
      const cycle = stride(spec.legLength, swing);
      this.phase += (this.speed / Math.max(cycle, 0.05)) * Math.PI * 2 * dt;
      if (this.speed < spec.walkSpeed * 0.2) this.phase += Math.abs(yawRate) * 1.1 * dt;
    }

    // --- pose -------------------------------------------------------------
    const pose = this.pose;
    const layer = this.layer;
    pose.clear();
    pose.turn('root', slope);

    const t = this.clock;
    const idleW = 1 - this.walkW * 0.85;
    pose.turn('head', 0, this.headLag.x);
    layer.clear();
    if (spec.kind === 'biped') {
      bipedIdle(layer, t, this.salt);
      faceIdle(layer, spec.face, t, this.salt);
    }
    else if (spec.kind === 'fowl') fowlIdle(layer, t, this.salt);
    else quadrupedIdle(layer, t, this.salt, spec);
    pose.blend(layer, idleW);

    if (this.walkW > 0) {
      layer.clear();
      if (spec.kind === 'biped') bipedWalk(layer, this.phase, spec);
      else if (spec.kind === 'fowl') fowlWalk(layer, this.phase, spec);
      else quadrupedWalk(layer, this.phase, spec);
      pose.blend(layer, this.walkW);
    }
    if (spec.kind === 'biped') {
      // Lean into the acceleration, and roll a little into a turn.
      pose.turn('torso', this.lean.x, 0, -0.04 * this.speed * yawRate);
      pose.turn('hips', 0, 0, -0.03 * this.speed * yawRate);
    }

    if (this.grazeW > 0) {
      const w = smooth(this.grazeW);
      if (spec.kind === 'fowl') peck(pose, t, this.salt, w, spec.grazeDrop);
      else graze(pose, t, this.salt, w, spec.grazeDrop);
    }
    if (spec.kind === 'biped' && this.state === 'business') {
      bipedFidget(pose, this.fidget, 1 - this.timer / this.fidgetLength, t, this.salt, spec.handed ?? 1, spec.gestures);
    }

    // The gesture, if one is running.
    const { level: syllable, beat } = this.voiceNow(world);
    if (this.state === 'greet' || this.state === 'talk') {
      const t01 = this.gestureT / this.gestureLength;
      if (spec.kind === 'biped') {
        if (this.state === 'greet') {
          bipedGreet(pose, this.greeting, t01, spec.handed ?? 1, spec.gestures);
          faceGreet(pose, spec.face, envelope(t01, 0.22, 0.28));
        } else {
          const w = smooth(Math.min(t01 * 4, 1, (1 - t01) * 4));
          bipedTalk(pose, this.talkStyle, t, this.salt, syllable, beat, w, spec.handed ?? 1);
          faceTalk(pose, spec.face, syllable, beat, w, t, this.salt);
        }
      } else {
        call(pose, t01, syllable, spec.call === 'dog');
      }
    } else if (spec.kind === 'biped' && syllable > 0) {
      // Still talking after the gesture: the head keeps time on its own.
      pose.turn('head', 0.05 * syllable);
      faceTalk(pose, spec.face, syllable, beat, 1, t, this.salt);
    }

    // Looking, over the top; the graze relaxes as it looks up.
    if (this.lookW > 0.001) {
      const w = this.lookW * (1 - 0.7 * this.grazeW);
      look(pose, spec.kind, this.lookYaw.x, this.lookPitch.x, w);
      if (this.grazeW > 0) graze(pose, t, this.salt, -0.6 * this.grazeW * this.lookW, spec.grazeDrop);
    }
    // The ears follow the head late and springily: attention with a wobble.
    if (spec.kind === 'biped') {
      const headYaw = this.lookYaw.x * this.lookW + this.headLag.x;
      this.earLag.bounce(headYaw, 0.14, 0.45, dt);
      const drag = (this.earLag.x - headYaw) * 0.8;
      pose.turn('nubL', 0, drag, drag * 0.4);
      pose.turn('nubR', 0, drag, drag * 0.4);
    }

    // --- transitions: carry the old pose's difference and let it fade ------
    const data = pose.data;
    if (this.settling) {
      this.settling = false;
      const prev = this.last.data;
      for (let i = 0; i < data.length; i++) this.offset[i] += prev[i] - data[i];
    }
    const keep = Math.exp((-Math.LN2 * dt) / SETTLE);
    for (let i = 0; i < data.length; i++) {
      this.offset[i] *= keep;
      data[i] += this.offset[i];
    }
    this.last.copy(pose);

    // The shoulder followers ride at half of whatever the upper arms ended up
    // turned by, so draped cloth fades arm → half → trunk (`dressedSkinOf`).
    if (spec.kind === 'biped') {
      pose.rotationOf('armLu', _rot);
      pose.turn('armLs', _rot.x / 2, _rot.y / 2, _rot.z / 2);
      pose.rotationOf('armRu', _rot);
      pose.turn('armRs', _rot.x / 2, _rot.y / 2, _rot.z / 2);
    }

    // Hanging things hang. Whatever the head and neck have ended up doing,
    // the cords and panels on the front of it are undone by that much, so a
    // villager looking up does not swing its own fringe into its face.
    if (spec.kind === 'biped') {
      pose.rotationOf('head', _rot);
      const pitch = _rot.x;
      pose.rotationOf('neck', _rot);
      faceHang(pose, spec.face, pitch + _rot.x);
    }

    // The legs, from the feet, after everything the hips have been given.
    if (this.legs) {
      this.legs.update(
        {
          pos,
          yaw: this.yaw,
          vx: Math.sin(this.yaw) * this.speed,
          vz: Math.cos(this.yaw) * this.speed,
          groundAt: world.groundAt,
          dt,
        },
        pose,
      );
    }

    applyPose(this.rig, pose);

    // --- voice ------------------------------------------------------------
    if (this.emitter) {
      _at.set(pos.x, pos.y + spec.headHeight, pos.z);
      this.emitter.moveTo(_at);
      this.emitter.update(dt, world.collider, world.retestOcclusion);
    }
    if (this.said && world.audio && world.audio.context.currentTime > this.said.end + 1) this.said = null;
    if (this.label && !this.said) this.label.hide();
  }

  /** Frozen out of range: the voice goes quiet with it. */
  setAwake(awake: boolean): void {
    if (this.emitter) this.emitter.enabled = awake;
    if (!awake && this.voice?.speaking) {
      this.voice.hush(0);
      this.said = null;
    }
    if (!awake) this.label?.hide();
  }

  dispose(): void {
    this.emitter?.dispose();
    this.emitter = null;
    this.shot = null;
    this.voice = null;
    this.said = null;
    this.label?.dispose();
    this.label = null;
  }

  private begin(state: State): void {
    // Whatever pose the old state left, the new one starts from it.
    if (state !== this.state) this.settling = true;
    this.state = state;
    switch (state) {
      case 'idle':
        this.timer = 2 + Math.random() * (this.spec.kind === 'biped' ? 8 : 6);
        break;
      case 'business':
        if (this.spec.kind === 'biped') {
          this.fidget = FIDGETS[Math.floor(Math.random() * FIDGETS.length)];
          this.fidgetLength = this.fidget === 'lookAround' || this.fidget === 'fold' ? 3.5 + Math.random() * 3 : 1.8 + Math.random() * 1.2;
          this.timer = this.fidgetLength;
        } else {
          this.timer = 4 + Math.random() * 6;
        }
        break;
      case 'walk':
        this.probeIn = 0;
        break;
      case 'greet':
        // A different one from last time, so a village does not have one hello
        // in it, and each takes as long as it needs.
        this.greeting = another(GREETINGS, this.greeting);
        this.gestureT = 0;
        this.turnT = 0;
        this.hailed = false;
        this.gestureLength = this.spec.kind === 'biped' ? GREET_LENGTH[this.greeting] : 1.6;
        break;
      case 'talk':
        this.talkStyle = another(TALKS, this.talkStyle);
        this.gestureT = 0;
        this.turnT = 0;
        this.hailed = true;
        this.gestureLength = 3.2;
        break;
    }
  }

  /** A reachable point in the home disc, or false if none was found in a few tries. */
  private pickTarget(world: World): boolean {
    const pos = this.mesh.position;
    for (let attempt = 0; attempt < 6; attempt++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * this.spec.roam;
      const x = this.home.x + Math.cos(angle) * r;
      const z = this.home.y + Math.sin(angle) * r;
      const dx = x - pos.x;
      const dz = z - pos.z;
      const d = Math.hypot(dx, dz);
      if (d < 0.8) continue;
      // Not up anything steep.
      const rise = world.groundAt(x, z) - pos.y;
      if (Math.abs(rise) / d > 0.4) continue;
      // Not into the player.
      if (Math.hypot(x - world.player.x, z - world.player.z) < this.spec.radius + 0.8) continue;
      // Not through anything: two rays, knee and chest, the length of the path.
      if (this.rayHits(world, dx / d, dz / d, d + this.spec.radius)) continue;
      this.target.set(x, z);
      return true;
    }
    return false;
  }

  private blockedAhead(world: World): boolean {
    return this.rayHits(world, Math.sin(this.yaw), Math.cos(this.yaw), this.spec.radius + 0.8);
  }

  private rayHits(world: World, dx: number, dz: number, within: number): boolean {
    const pos = this.mesh.position;
    _dir.set(dx, 0, dz);
    for (const h of [this.spec.legLength * 0.5 + 0.05, this.spec.height * 0.7]) {
      _origin.set(pos.x, pos.y + h, pos.z);
      const hit = world.collider.raycast(_origin, _dir);
      if (hit !== null && hit < within) return true;
    }
    return false;
  }

  /**
   * How loud the voice is right now, 0..1, and a pulse on its stressed
   * syllables — from the voice's own schedule, so the head keeps exact time.
   */
  private voiceNow(world: World): { level: number; beat: number } {
    const units = this.said?.units ?? this.shot?.syllables;
    if (!units || !world.audio) {
      // No voice: a stand-in rhythm during a gesture.
      const on = this.state === 'greet' || this.state === 'talk' ? pulse(this.gestureT, 0.35, 0.2, this.salt) : 0;
      return { level: on, beat: on };
    }
    const now = world.audio.context.currentTime;
    for (const s of units) {
      if (now >= s.at && now <= s.at + s.length) {
        const level = Math.sin(((now - s.at) / s.length) * Math.PI);
        const stress = 'stress' in s ? (s as { stress: number }).stress : 0.5;
        return { level, beat: level * stress };
      }
    }
    return { level: 0, beat: 0 };
  }

  /** A few syllables of nothing: a short greeting or a run of talk. */
  private babble(kind: 'greeting' | 'talk', world: World): Utterance | null {
    if (!world.audio || !world.audio.noise) return null;
    // A voice is kept for life, so it is worth missing one greeting rather
    // than being built on the old model a millisecond before the throat lands.
    if (!this.voice && voiceState(world.audio.context) === 'waiting') return null;
    if (!this.voice) {
      // Where it stands is part of who it is: two villagers built from the
      // same seed still get their own note, rate and hello.
      const spot = Math.abs(this.home.x * 73.1 + this.home.y * 41.7);
      const voice = createVoice(world.audio, {
        tone: this.spec.tone,
        gain: 1.0,
        seed: this.spec.seed + spot,
        lect: this.spec.lect,
        character: this.spec.character,
      });
      this.voice = voice;
      this.shot = voice;
      _at.set(this.mesh.position.x, this.mesh.position.y + this.spec.headHeight, this.mesh.position.z);
      this.emitter = new Emitter(world.audio, voice, {
        position: _at,
        refDistance: 3,
        maxDistance: 45,
        rolloff: 1.15,
        reverb: 0.5,
        out: world.audio.voices,
      });
    }
    this.said = this.voice.babble(kind, world.audio.context.currentTime + 0.05);
    if (flags.debug) {
      this.label ??= new VoiceLabel(this.mesh, this.spec.headHeight + 0.55);
      // Says which lect it is speaking and which named voice if any, and says
      // MUTE where a throat failed to build — otherwise a silent villager reads
      // as one with nothing to say.
      const who = `${this.spec.lect ?? 'country'}${this.spec.character ? ` ${this.spec.character}` : ''}`;
      const model = voiceState(world.audio.context) === 'ready' ? who : 'MUTE';
      this.label.show(`${this.voiceId} ${model}`, this.said.text);
    }
    return this.said;
  }

  /**
   * A short name for this voice: the seed and where it stands, which together
   * are what decides how it sounds. Two rows of the same seed differ by it.
   */
  private get voiceId(): string {
    const spot = Math.abs(this.home.x * 73.1 + this.home.y * 41.7);
    return `#${Math.floor(this.spec.seed + spot).toString(36)}`;
  }

  /** An animal's call. */
  private callOut(force: number, world: World): void {
    const spec = this.spec;
    if (!spec.call || spec.call === 'voice' || !world.audio || !world.audio.noise) return;
    if (!this.emitter) {
      const shot = buildOneShot(world.audio, { sound: 'animal', options: { kind: spec.call, tone: spec.tone, gain: 0.5 } });
      this.shot = shot;
      _at.set(this.mesh.position.x, this.mesh.position.y + spec.headHeight, this.mesh.position.z);
      this.emitter = new Emitter(world.audio, shot, {
        position: _at,
        refDistance: 3,
        maxDistance: 45,
        rolloff: 1.15,
        reverb: 0.5,
        out: world.audio.creatures,
      });
    }
    this.shot!.fire(world.audio.context.currentTime + 0.05, force);
  }
}
