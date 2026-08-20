import { Pose, bump, envelope, smooth, wobble, clamp01 } from './pose';
import type { LifeSpec } from './spec';

/**
 * The procedural poses. Each function adds one layer into a pose; the creature
 * weights and sums them. Nothing here keeps state — every layer is a function
 * of a phase or a clock, so a creature that sleeps and wakes picks up where
 * the clock says.
 *
 * Walks are the Rosen shape: a contact pose and a passing pose, mirrored,
 * traced by sines — legs swing at the stride, the body bobs at twice it,
 * lowest at contact.
 */

const TWO_PI = Math.PI * 2;

/** Metres per full cycle — two steps — for a leg of this length swinging ±`amp`. */
export function stride(legLength: number, amp: number): number {
  return 4 * legLength * Math.sin(amp) * 0.9;
}

/** A brief event once per `period`, offset by salt: 0 outside it, an envelope inside. */
export function pulse(t: number, period: number, length: number, salt: number): number {
  const cycle = Math.floor(t / period);
  const h = Math.sin(cycle * 12.9898 + salt * 78.233) * 43758.5453;
  const offset = (h - Math.floor(h)) * (period - length);
  const local = t - cycle * period - offset;
  return local < 0 || local > length ? 0 : bump(local / length);
}

// --- quadruped ------------------------------------------------------------------

export const QUAD_SWING = 0.34;

export function quadrupedWalk(pose: Pose, phase: number, spec: LifeSpec): void {
  const bob = spec.legLength * 0.02;
  // Four-beat lateral walk: each leg a quarter cycle after the last, in the
  // order front-left, back-left, front-right, back-right.
  const legs: [string, number][] = [
    ['legFL', 0],
    ['legBL', 0.25],
    ['legFR', 0.5],
    ['legBR', 0.75],
  ];
  for (const [leg, offset] of legs) {
    const θ = phase + offset * TWO_PI;
    // rx > 0 swings a hanging leg back: the stance half is θ in 0..π.
    pose.turn(`${leg}u`, QUAD_SWING * Math.sin(θ));
    // The lower leg folds during the swing forward, most just after lift-off.
    pose.turn(`${leg}l`, 0.55 * Math.max(0, -Math.sin(θ - 0.5)));
  }
  pose.move('body', 0, bob * Math.sin(2 * phase + 0.4));
  pose.turn('body', 0, 0, 0.02 * Math.sin(phase));
  // Head nods with the forelegs.
  pose.turn('neck', 0.045 * Math.sin(2 * phase + 1.2));
  pose.turn('head', 0.03 * Math.sin(2 * phase + 0.6));
  pose.turn('tail', 0, 0.16 * Math.sin(phase + 1));
  pose.turn('tail2', 0, 0.16 * Math.sin(phase + 0.2));
}

export function quadrupedIdle(pose: Pose, t: number, salt: number, spec: LifeSpec): void {
  const breath = Math.sin(t * 1.5 + salt);
  pose.swell('body', 0.012 * breath, 0.018 * breath, 0);
  pose.turn('neck', 0.02 * wobble(t * 0.25, salt), 0.1 * wobble(t * 0.2, salt + 1));
  pose.turn('head', 0.03 * wobble(t * 0.3, salt + 2), 0.08 * wobble(t * 0.22, salt + 3));
  // Weight shifts, slowly.
  pose.move('body', spec.radius * 0.02 * wobble(t * 0.15, salt + 4), 0, 0);
  // Tail switching, and now and then a swish.
  pose.turn('tail', 0, 0.2 * wobble(t * 0.6, salt + 5) + 0.5 * pulse(t, 7, 0.9, salt) * Math.sin(t * 9));
  pose.turn('tail2', 0, 0.2 * wobble(t * 0.6 - 0.5, salt + 5));
  // An ear flick every so often, one ear at a time.
  pose.turn('earL', 0, 0, 0.6 * pulse(t, 6, 0.25, salt + 6));
  pose.turn('earR', 0, 0, -0.6 * pulse(t, 8, 0.25, salt + 7));
}

/** Head to the ground. `w` is how far into it, 0..1. */
export function graze(pose: Pose, t: number, salt: number, w: number, drop: number): void {
  // Most of the drop is the neck; the head folds under, but never past vertical.
  pose.turn('neck', drop * 0.6 * w, 0.12 * w * wobble(t * 0.5, salt + 8));
  pose.turn('head', Math.min(drop * 0.5, 0.9) * w + 0.03 * w * Math.sin(t * 5), 0.06 * w * wobble(t * 0.9, salt + 9));
}

/** A call: head comes up and forward with it, and bobs on the syllables. */
export function call(pose: Pose, t01: number, syllable: number, dog: boolean): void {
  const e = envelope(t01, 0.2, 0.3);
  pose.turn('neck', -0.22 * e);
  pose.turn('head', -0.18 * e + 0.12 * syllable);
  if (dog) {
    pose.turn('tail', 0, 0.55 * e * Math.sin(t01 * 40));
    pose.turn('tail2', 0, 0.4 * e * Math.sin(t01 * 40 - 1));
    pose.move('body', 0, 0.01 * syllable, -0.01 * syllable);
  }
}

// --- biped ----------------------------------------------------------------------

/**
 * The body over walking feet. The legs themselves are solved from planted
 * feet in `legs.ts`; this is everything that rides on them, on the same
 * clock: the left foot swings through the first half of the cycle, the right
 * through the second, and the body is lowest at each footfall.
 */
export function bipedWalk(pose: Pose, phase: number, spec: LifeSpec): void {
  const L = spec.legLength;
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  // Two bobs a cycle, lowest at contact; a touch of squash with each.
  const bob = 0.5 * (1 - Math.cos(2 * phase));
  pose.move('hips', -L * 0.03 * s, L * 0.028 * bob - L * 0.02, 0);
  pose.swell('hips', 0, 0.02 * (bob - 0.5), 0);
  // The swing side of the pelvis drops and comes forward: rz > 0 lifts +X,
  // ry > 0 takes +X toward −Z, and the left leg (+X) swings first.
  pose.turn('hips', 0, -0.06 * s, -0.045 * s);
  // The waist and ribcage turn against the pelvis, and lean into the walk;
  // the shoulders swing with the arms — ry > 0 takes the left one back.
  pose.turn('torso', 0.03 + 0.012 * c, 0.03 * s, 0.02 * s);
  pose.turn('chest', 0.012, 0.03 * s, 0.01 * s);
  pose.turn('clavL', 0, 0.05 * s, 0);
  pose.turn('clavR', 0, 0.05 * s, 0);
  // The head holds level: it undoes most of what the body under it does.
  pose.turn('head', -0.02, -0.03 * s, -0.02 * s);
  // Arms swing against the legs — rx > 0 takes a hanging arm back — with the
  // elbow bending more on the way forward. Long arms: a smaller swing reads.
  pose.turn('armLu', 0.24 * s, 0, 0.02);
  pose.turn('armRu', -0.24 * s, 0, -0.02);
  pose.turn('armLl', -0.2 - 0.2 * Math.max(0, -s));
  pose.turn('armRl', -0.2 - 0.2 * Math.max(0, s));
}

export function bipedIdle(pose: Pose, t: number, salt: number): void {
  // Breathing: a quicker breath in and a slower one out, in the chest and a
  // little in the shoulders.
  const b = Math.pow(0.5 + 0.5 * Math.sin(t * 1.4 + salt), 1.5);
  pose.swell('chest', 0.006 * b, 0.01 * b, 0.014 * b);
  pose.turn('chest', -0.012 * b);
  // The shoulders rise on the breath in: rz > 0 lifts +X.
  pose.turn('clavL', 0, 0, 0.02 * b);
  pose.turn('clavR', 0, 0, -0.02 * b);
  // Weight on one hip, then the other. The hips stay up: every millimetre
  // they drop is a visible bend at the knees, and the built knee is soft already.
  const shift = wobble(t * 0.12, salt);
  pose.move('hips', 0.02 * shift, -0.001, 0);
  pose.turn('hips', 0, 0, -0.03 * shift);
  pose.turn('torso', 0.015 * wobble(t * 0.2, salt + 1), 0.05 * wobble(t * 0.15, salt + 2), 0.02 * shift);
  // The moving hold: the head never quite stops.
  pose.turn('head', 0.025 * wobble(t * 0.3, salt + 3), 0.06 * wobble(t * 0.18, salt + 4), 0.03 * wobble(t * 0.25, salt + 5));
  // Arms hang and drift.
  pose.turn('armLu', 0.03 * wobble(t * 0.3, salt + 6), 0, 0.02);
  pose.turn('armRu', 0.03 * wobble(t * 0.3, salt + 7), 0, -0.02);
  pose.turn('armLl', -0.14, 0, 0);
  pose.turn('armRl', -0.14, 0, 0);
  // No eyes, so no blink: an ear twitches on its own now and then.
  pose.turn('nubL', -0.35 * pulse(t, 7, 0.22, salt + 9), 0, 0.5 * pulse(t, 7, 0.22, salt + 9));
  pose.turn('nubR', -0.35 * pulse(t, 9, 0.22, salt + 10), 0, -0.5 * pulse(t, 9, 0.22, salt + 10));
}

/**
 * The greetings. Ten of them, taken from what people actually do when they
 * meet: a wave, a bow from the waist, both arms hailed up, a hand flat on the
 * chest, palms pressed together with a dip, fingertips off the brow, a scoop
 * of the hand to call you over, a touch to the brim of the mask, both hands
 * offered forward, and a couple of claps.
 *
 * Every one of them has to read at ten metres on a figure with mitts for
 * hands, so they are whole-arm shapes, not finger work. `t01` runs over the
 * gesture; `GREET_LENGTH` says how long each is given.
 */
export type Greeting = 'wave' | 'bow' | 'raise' | 'heart' | 'press' | 'brow' | 'beckon' | 'doff' | 'offer' | 'clap';

export const GREET_LENGTH: Record<Greeting, number> = {
  wave: 2,
  bow: 2.2,
  raise: 1.9,
  heart: 2.2,
  press: 2.3,
  brow: 2.1,
  beckon: 2.2,
  doff: 2.1,
  offer: 2,
  clap: 1.8,
};

export function bipedGreet(pose: Pose, kind: Greeting, t01: number, side: 1 | -1): void {
  const arm = side > 0 ? 'armL' : 'armR';
  const e = envelope(t01, 0.22, 0.28);
  switch (kind) {
    case 'wave': {
      // rz > 0 carries a hanging arm toward +X: out and up on the left, so
      // the sign follows the side.
      pose.turn(`${arm}u`, -0.35 * e, 0, side * 1.55 * e);
      const wave = Math.sin(t01 * TWO_PI * 2.5);
      pose.turn(`${arm}l`, -0.35 * e, 0, side * (0.4 + 0.45 * wave) * e);
      // The waving shoulder comes up with the arm.
      pose.turn(side > 0 ? 'clavL' : 'clavR', 0, 0, side * 0.12 * e);
      pose.turn('head', 0.14 * bump(t01), 0, 0.05 * side * e);
      pose.turn('torso', 0.03 * e);
      break;
    }
    case 'bow': {
      // A bow from the waist, the ribcage folding on after it, arms drawn
      // back a little, head following.
      const b = envelope(t01, 0.35, 0.35);
      pose.turn('torso', 0.28 * b);
      pose.turn('chest', 0.16 * b);
      pose.turn('head', 0.15 * b);
      pose.turn('armLu', 0.25 * b, 0, 0.12 * b);
      pose.turn('armRu', 0.25 * b, 0, -0.12 * b);
      pose.turn('armLl', -0.2 * b);
      pose.turn('armRl', -0.2 * b);
      break;
    }
    case 'raise': {
      // Both arms up and out, a bounce on the toes.
      const r = envelope(t01, 0.25, 0.3);
      pose.turn('armLu', -0.4 * r, 0, 1.7 * r);
      pose.turn('armRu', -0.4 * r, 0, -1.7 * r);
      pose.turn('armLl', -0.3 * r, 0, 0.5 * r);
      pose.turn('armRl', -0.3 * r, 0, -0.5 * r);
      pose.turn('clavL', 0, 0, 0.14 * r);
      pose.turn('clavR', 0, 0, -0.14 * r);
      pose.turn('chest', -0.06 * r);
      pose.turn('head', -0.12 * r);
      pose.move('hips', 0, 0.02 * Math.abs(Math.sin(t01 * TWO_PI * 2)) * r, 0);
      break;
    }
    case 'heart': {
      // A hand flat on the chest and a small bow over it. ry carries a
      // forearm inward across the front, as `fold` does.
      const h = envelope(t01, 0.3, 0.32);
      pose.turn(`${arm}u`, -0.3 * h, side * 0.55 * h, -side * 0.1 * h);
      pose.turn(`${arm}l`, -2.3 * h, side * 0.75 * h, 0);
      pose.turn('torso', 0.12 * h);
      pose.turn('chest', 0.08 * h);
      pose.turn('head', 0.12 * h);
      break;
    }
    case 'press': {
      // Both palms brought together in front of the chest, and a dip.
      const p = envelope(t01, 0.3, 0.32);
      pose.turn('armLu', -0.5 * p, 0.5 * p, -0.15 * p);
      pose.turn('armRu', -0.5 * p, -0.5 * p, 0.15 * p);
      pose.turn('armLl', -2.1 * p, 0.8 * p, 0);
      pose.turn('armRl', -2.1 * p, -0.8 * p, 0);
      pose.turn('torso', 0.14 * p);
      pose.turn('chest', 0.1 * p);
      pose.turn('head', 0.16 * p);
      break;
    }
    case 'brow': {
      // Fingertips up off the brow, held a moment, then swept out and down.
      const up = envelope(t01, 0.2, 0.45);
      const out = smooth(clamp01((t01 - 0.5) / 0.5));
      pose.turn(`${arm}u`, (-1.0 + 0.55 * out) * up, side * 0.2 * up, side * (0.45 + 0.7 * out) * up);
      pose.turn(`${arm}l`, (-1.7 + 1.1 * out) * up, side * (0.45 - 0.35 * out) * up, 0);
      pose.turn('head', (0.1 - 0.14 * out) * up);
      pose.turn('torso', 0.05 * up);
      break;
    }
    case 'beckon': {
      // The arm out, and the forearm scooping back twice: come over.
      const b = envelope(t01, 0.2, 0.28);
      const scoop = Math.sin(t01 * TWO_PI * 2.2);
      pose.turn(`${arm}u`, -0.5 * b, side * 0.2 * b, side * 0.7 * b);
      pose.turn(`${arm}l`, (-0.7 - 0.5 * scoop) * b, side * (0.3 + 0.3 * scoop) * b, 0);
      pose.turn('head', 0.06 * b, -side * 0.14 * b, side * 0.1 * b);
      pose.turn('torso', 0, -side * 0.07 * b);
      break;
    }
    case 'doff': {
      // A hand up to the brim of the mask, and the head dipped under it.
      const d = envelope(t01, 0.26, 0.3);
      const touch = bump(t01);
      pose.turn(`${arm}u`, -1.1 * d, side * 0.15 * d, side * 0.5 * d);
      pose.turn(`${arm}l`, (-1.9 - 0.25 * touch) * d, side * 0.45 * d, 0);
      pose.turn('head', 0.2 * touch, 0, side * 0.08 * d);
      pose.turn('torso', 0.06 * d);
      break;
    }
    case 'offer': {
      // Both hands offered forward, palms up, leaning in behind them.
      const o = envelope(t01, 0.32, 0.34);
      pose.turn('armLu', -0.7 * o, 0.18 * o, 0.28 * o);
      pose.turn('armRu', -0.7 * o, -0.18 * o, -0.28 * o);
      pose.turn('armLl', -0.45 * o, 0.3 * o, 0.15 * o);
      pose.turn('armRl', -0.45 * o, -0.3 * o, -0.15 * o);
      pose.turn('torso', 0.06 * o);
      pose.turn('chest', 0.06 * o);
      pose.turn('head', -0.05 * o);
      pose.move('hips', 0, 0, 0.016 * o);
      break;
    }
    case 'clap': {
      // Two claps in front of the chest: the hands open on the off-beat.
      const c = envelope(t01, 0.18, 0.3);
      const beat = Math.abs(Math.sin(t01 * TWO_PI * 2));
      const open = 0.3 * (1 - beat);
      pose.turn('armLu', -0.7 * c, (0.5 - open) * c, (open - 0.1) * c);
      pose.turn('armRu', -0.7 * c, -(0.5 - open) * c, -(open - 0.1) * c);
      pose.turn('armLl', -1.9 * c, (0.6 - open * 0.6) * c, 0);
      pose.turn('armRl', -1.9 * c, -(0.6 - open * 0.6) * c, 0);
      pose.turn('head', 0.1 * beat * c);
      pose.move('hips', 0, 0.012 * beat * c, 0);
      break;
    }
  }
  // The ears perk up and the head tilts a little: pleased to see you.
  pose.turn('nubL', -0.5 * e, 0, 0.25 * e);
  pose.turn('nubR', -0.5 * e, 0, -0.25 * e);
  pose.turn('head', 0, 0, side * 0.1 * e);
}

export type Fidget = 'stretch' | 'scratch' | 'fold' | 'lookAround' | 'shift';

/** Idle business for a figure: one small piece of it, over `t01`. */
export function bipedFidget(pose: Pose, kind: Fidget, t01: number, t: number, salt: number, side: 1 | -1): void {
  const arm = side > 0 ? 'armL' : 'armR';
  const other = side > 0 ? 'armR' : 'armL';
  switch (kind) {
    case 'stretch': {
      const e = envelope(t01, 0.3, 0.3);
      pose.turn('armLu', -0.5 * e, 0, 1.4 * e);
      pose.turn('armRu', -0.5 * e, 0, -1.4 * e);
      pose.turn('armLl', -0.6 * e, 0, 0.3 * e);
      pose.turn('armRl', -0.6 * e, 0, -0.3 * e);
      pose.turn('torso', -0.06 * e);
      pose.turn('chest', -0.08 * e);
      pose.turn('clavL', 0, 0, 0.14 * e);
      pose.turn('clavR', 0, 0, -0.14 * e);
      pose.turn('head', -0.2 * e);
      pose.swell('chest', 0, 0.03 * e, 0);
      break;
    }
    case 'scratch': {
      // One hand up to the side of the head, a few small rubs.
      const e = envelope(t01, 0.25, 0.25);
      pose.turn(`${arm}u`, -0.9 * e, 0, side * 0.9 * e);
      pose.turn(`${arm}l`, (-2.0 - 0.15 * Math.sin(t01 * TWO_PI * 5)) * e, 0, side * 0.6 * e);
      pose.turn('head', 0.05 * e, -side * 0.25 * e, side * 0.15 * e);
      break;
    }
    case 'fold': {
      // Forearms across the front, one over the other.
      const e = envelope(t01, 0.3, 0.3);
      pose.turn('armLu', -0.3 * e, 0.45 * e, -0.05 * e);
      pose.turn('armRu', -0.3 * e, -0.45 * e, 0.05 * e);
      pose.turn('armLl', -2.0 * e, 0.7 * e, 0);
      pose.turn('armRl', -2.0 * e, -0.7 * e, 0);
      pose.turn('torso', -0.03 * e);
      pose.turn('head', 0.06 * e, 0.12 * wobble(t * 0.5, salt) * e);
      break;
    }
    case 'lookAround': {
      // A slow sweep of the head one way, then the other, with a pause.
      const e = envelope(t01, 0.15, 0.15);
      const sweep = Math.sin(t01 * Math.PI * 2) * 0.75;
      pose.turn('head', 0.05 * e, sweep * e, 0.05 * sweep * e);
      pose.turn('torso', 0, sweep * 0.2 * e);
      pose.turn('nubL', 0, sweep * 0.4 * e);
      pose.turn('nubR', 0, sweep * 0.4 * e);
      break;
    }
    case 'shift': {
      // Weight goes onto one leg: the hips slide over it and drop, and the
      // legs, solved from the feet, take up the bend.
      const e = envelope(t01, 0.3, 0.3);
      pose.move('hips', side * 0.035 * e, -0.014 * e, 0);
      pose.turn('hips', 0, 0, -side * 0.06 * e);
      pose.turn('torso', 0, 0, side * 0.05 * e);
      pose.turn(`${other}u`, 0.05 * e);
      break;
    }
  }
}

/**
 * Talking. `syllable` is how loud the voice is right now, `beat` a pulse on
 * its stressed syllables. The head is the mouth it does not have: it dips on
 * each syllable, and the motif on the front of the head works with the voice
 * (`faceTalk`).
 *
 * Six ways of holding the hands while it does — the gesture families people
 * actually talk with: beats on the stress, a listing roll, a broad sweep, both
 * hands clasped and none of it, a point at the listener, and two hands open.
 */
export type Talk = 'beat' | 'roll' | 'sweep' | 'clasp' | 'point' | 'open';

export function bipedTalk(
  pose: Pose,
  kind: Talk,
  t: number,
  salt: number,
  syllable: number,
  beat: number,
  w: number,
  side: 1 | -1,
): void {
  const arm = side > 0 ? 'armL' : 'armR';
  const other = side > 0 ? 'armR' : 'armL';
  const g = 0.5 + 0.5 * wobble(t * 1.4, salt + 10);
  switch (kind) {
    case 'beat':
      // The hand keeps time in front of the chest and the other hangs.
      pose.turn(`${arm}u`, (-0.25 - 0.1 * beat) * w, 0, side * 0.2 * w);
      pose.turn(`${arm}l`, (-0.9 - 0.5 * g - 0.35 * beat) * w, 0, side * 0.3 * wobble(t * 2.2, salt + 11) * w);
      pose.turn(`${other}l`, -0.35 * w * (0.5 + 0.5 * wobble(t * 1.1, salt + 12)));
      break;
    case 'roll':
      // The forearm turns over and back, the way a listing hand does.
      pose.turn(`${arm}u`, (-0.35 - 0.06 * beat) * w, 0, side * 0.3 * w);
      pose.turn(`${arm}l`, (-1.1 - 0.2 * beat) * w, side * (0.35 + 0.45 * Math.sin(t * 2.6 + salt)) * w, side * 0.2 * w);
      pose.turn(`${other}u`, -0.1 * w, 0, -side * 0.06 * w);
      break;
    case 'sweep':
      // A broad open sweep out to the side on the stresses.
      pose.turn(`${arm}u`, (-0.5 - 0.25 * beat) * w, 0, side * (0.45 + 0.5 * g) * w);
      pose.turn(`${arm}l`, (-0.55 + 0.25 * beat) * w, 0, side * (0.25 + 0.3 * g) * w);
      pose.turn(`${other}l`, -0.3 * w);
      pose.turn('torso', 0, -side * 0.06 * g * w, 0);
      pose.turn(arm === 'armL' ? 'clavL' : 'clavR', 0, 0, side * 0.08 * g * w);
      break;
    case 'clasp':
      // Hands held together at the waist: a reserved talker, all head.
      pose.turn('armLu', -0.2 * w, 0.35 * w, -0.05 * w);
      pose.turn('armRu', -0.2 * w, -0.35 * w, 0.05 * w);
      pose.turn('armLl', (-1.7 - 0.1 * beat) * w, 0.65 * w, 0);
      pose.turn('armRl', (-1.7 - 0.1 * beat) * w, -0.65 * w, 0);
      break;
    case 'point':
      // The arm comes forward toward whoever is listening on each stress.
      pose.turn(`${arm}u`, (-0.65 - 0.3 * beat) * w, side * 0.1 * w, side * 0.22 * w);
      pose.turn(`${arm}l`, (-0.35 - 0.3 * beat) * w, side * 0.15 * w, 0);
      pose.turn(`${other}l`, -0.4 * w * (0.5 + 0.5 * wobble(t * 1.3, salt + 15)));
      break;
    case 'open':
      // Both hands up and working together.
      pose.turn('armLu', (-0.55 - 0.12 * beat) * w, 0.15 * w, (0.3 + 0.2 * g) * w);
      pose.turn('armRu', (-0.55 - 0.12 * beat) * w, -0.15 * w, -(0.3 + 0.2 * g) * w);
      pose.turn('armLl', (-1.3 - 0.3 * beat) * w, 0.35 * w, 0.15 * w);
      pose.turn('armRl', (-1.3 - 0.3 * beat) * w, -0.35 * w, -0.15 * w);
      pose.turn('chest', 0.02 * beat * w);
      pose.turn('clavL', 0, 0, 0.05 * w);
      pose.turn('clavR', 0, 0, -0.05 * w);
      break;
  }
  pose.turn(
    'head',
    (0.04 + 0.05 * syllable + 0.05 * beat) * w,
    0.05 * wobble(t * 1.7, salt + 13) * w,
    (0.03 * wobble(t * 1.3, salt + 14) + 0.03 * beat) * w,
  );
  pose.turn('torso', 0.02 * w);
  pose.turn('chest', (0.015 + 0.015 * beat) * w);
  pose.turn('nubL', -0.12 * syllable * w);
  pose.turn('nubR', -0.12 * syllable * w);
}

// --- fowl -----------------------------------------------------------------------

export const FOWL_SWING = 0.55;

export function fowlWalk(pose: Pose, phase: number, spec: LifeSpec): void {
  pose.turn('legL', FOWL_SWING * Math.sin(phase));
  pose.turn('legR', FOWL_SWING * Math.sin(phase + Math.PI));
  pose.move('body', 0, spec.legLength * 0.06 * Math.sin(2 * phase));
  pose.turn('body', 0, 0, 0.06 * Math.sin(phase));
  // The head holds still in the world while the body walks under it, then
  // thrusts forward: a sawtooth on the neck, sharp on the thrust.
  const cycle = (phase / TWO_PI) % 1;
  const thrust = cycle < 0.25 ? smooth(cycle / 0.25) : 1 - smooth((cycle - 0.25) / 0.75);
  pose.turn('neck', -0.28 * (thrust - 0.5));
  pose.turn('head', 0.28 * (thrust - 0.5));
  pose.turn('tail', 0, 0.12 * Math.sin(phase));
}

export function fowlIdle(pose: Pose, t: number, salt: number): void {
  pose.swell('body', 0.02 * Math.sin(t * 2.2 + salt), 0.03 * Math.sin(t * 2.2 + salt), 0);
  pose.turn('head', 0.06 * wobble(t * 1.5, salt), 0.3 * wobble(t * 0.9, salt + 1));
  pose.turn('neck', 0.04 * wobble(t * 0.7, salt + 2), 0.15 * wobble(t * 0.5, salt + 3));
  pose.turn('tail', 0, 0.12 * wobble(t * 1.1, salt + 4), 0);
  // A flap now and then: both wings out from the body, a few beats.
  const flap = pulse(t, 14, 0.9, salt + 5);
  const beat = Math.abs(Math.sin(t * 22));
  pose.turn('wingL', 0, 0, (0.4 + 0.5 * beat) * flap);
  pose.turn('wingR', 0, 0, -(0.4 + 0.5 * beat) * flap);
  pose.move('body', 0, 0.01 * beat * flap, 0);
}

/** Pecking: down twice, up, look. */
export function peck(pose: Pose, t: number, salt: number, w: number, drop: number): void {
  const beat = clamp01(Math.sin(t * 7 + salt) * 1.6);
  pose.turn('neck', drop * 0.6 * w * (0.7 + 0.3 * beat), 0.15 * w * wobble(t * 0.7, salt + 6));
  pose.turn('head', drop * 0.4 * w * beat, 0);
}

// --- look -----------------------------------------------------------------------

/** Turns the head (and some neck, some torso) toward a local yaw and pitch. */
export function look(pose: Pose, kind: LifeSpec['kind'], yaw: number, pitch: number, w: number): void {
  if (kind === 'biped') {
    // Shared down the chain — a little waist, a little ribcage, some neck,
    // most of it head — and a small tilt of the head with it, which is what
    // curiosity looks like on a face with nothing on it.
    pose.turn('torso', 0, yaw * 0.07 * w);
    pose.turn('chest', 0, yaw * 0.08 * w);
    pose.turn('neck', pitch * 0.25 * w, yaw * 0.2 * w);
    pose.turn('head', pitch * 0.65 * w, yaw * 0.6 * w, yaw * 0.08 * w);
    // The ears swing toward what the head is turning to: attention leads.
    pose.turn('nubL', -0.12 * Math.abs(yaw) * w, yaw * 0.35 * w);
    pose.turn('nubR', -0.12 * Math.abs(yaw) * w, yaw * 0.35 * w);
  } else if (kind === 'fowl') {
    pose.turn('neck', pitch * 0.4 * w, yaw * 0.4 * w);
    pose.turn('head', pitch * 0.6 * w, yaw * 0.6 * w);
  } else {
    pose.turn('neck', pitch * 0.5 * w, yaw * 0.45 * w);
    pose.turn('head', pitch * 0.5 * w, yaw * 0.55 * w);
  }
}

// --- the head's motif -------------------------------------------------------------

/** Which motifs hang off the brow and are therefore subject to gravity. */
const HANGING = new Set<string>([]);

/**
 * What the mask does while it talks. `level` is the voice right now, `beat` a
 * pulse on its stressed syllables, `w` how much of the talking pose is in.
 */
export function faceTalk(pose: Pose, kind: string | undefined, level: number, beat: number, w: number, t: number, salt: number): void {
  switch (kind) {
    case 'round':
    case 'burr':
      // The rings draw in as the heart comes forward.
      pose.swell('face', -0.06 * level * w, -0.06 * level * w, 0.3 * level * w);
      pose.turn('face', 0, 0, 0.08 * beat * w);
      break;
    case 'wheel':
      // It turns on its own axis, so the spokes run.
      pose.turn('face', 0, 0, (0.12 * level + 0.09 * beat) * w);
      pose.move('face', 0, 0, 0.004 * level * w);
      break;
    case 'bough':
      pose.turn('face', -0.05 * beat * w, 0, 0.07 * level * w);
      pose.move('face', 0, 0.003 * beat * w, 0.004 * level * w);
      break;
    case 'crown':
      pose.swell('face', 0.08 * level * w, 0, 0.24 * level * w);
      pose.move('face', 0, 0, 0.004 * beat * w);
      break;
    case 'lapped':
      pose.swell('face', 0, 0.07 * level * w, 0.26 * level * w);
      pose.turn('face', -0.05 * beat * w);
      break;
    case 'antler':
    case 'palm':
      // The rack swings: the board tips on its own axis.
      pose.turn('face', 0, 0, (0.1 * level + 0.08 * beat) * w);
      pose.move('face', 0, -0.003 * beat * w, 0.004 * level * w);
      break;
    case 'briar':
      pose.turn('face', -0.04 * beat * w, 0, 0.06 * level * w * wobble(t * 2, salt));
      pose.move('face', 0, 0, 0.003 * beat * w);
      break;
    // The city. A closed helm nods and turns a hair, being heavy; a plumed or
    // crested one sways; a veiled head presses.
    case 'greathelm':
    case 'frogmouth':
    case 'spangen':
    case 'escutcheon':
      pose.turn('face', 0.04 * beat * w, 0.05 * level * w * wobble(t * 1.4, salt), 0);
      pose.move('face', 0, 0, 0.003 * level * w);
      break;
    case 'bascinet':
    case 'burgonet':
    case 'tourney':
    case 'morion':
    case 'bellows':
      pose.turn('face', -0.05 * beat * w, 0, 0.06 * level * w * wobble(t * 1.6, salt));
      pose.move('face', 0, 0.002 * beat * w, 0.003 * level * w);
      break;
    case 'chaperon':
    case 'coif':
      pose.turn('face', 0.03 * beat * w, 0, 0.07 * level * w * wobble(t * 1.5, salt));
      pose.move('face', 0, 0, 0.003 * level * w);
      break;
  }
}

/** The mask at rest: a small life of its own. */
export function faceIdle(pose: Pose, kind: string | undefined, t: number, salt: number): void {
  const drift = wobble(t * 0.5, salt);
  switch (kind) {
    case 'briar':
    case 'round':
    case 'burr':
    case 'bough':
    case 'antler':
    case 'palm':
    case 'wheel':
    case 'bascinet':
    case 'burgonet':
    case 'tourney':
    case 'morion':
    case 'bellows':
    case 'chaperon':
    case 'coif':
      pose.turn('face', 0, 0, 0.025 * drift);
      break;
    case 'lapped':
    case 'crown':
    case 'greathelm':
    case 'frogmouth':
    case 'spangen':
    case 'escutcheon':
      pose.move('face', 0, 0, 0.0014 * drift);
      break;
  }
}

/** The mask on a greeting: it opens up. */
export function faceGreet(pose: Pose, kind: string | undefined, e: number): void {
  switch (kind) {
    case 'briar':
    case 'round':
    case 'burr':
    case 'bough':
    case 'antler':
    case 'palm':
    case 'wheel':
      pose.turn('face', 0, 0, 0.25 * e);
      break;
    case 'lapped':
    case 'crown':
      pose.move('face', 0, 0, 0.007 * e);
      break;
    // The city bows its head: a helm dips, a crest and a veil bow.
    case 'greathelm':
    case 'frogmouth':
    case 'spangen':
    case 'escutcheon':
      pose.turn('face', 0.14 * e);
      break;
    case 'bascinet':
    case 'burgonet':
    case 'tourney':
    case 'morion':
    case 'bellows':
    case 'chaperon':
    case 'coif':
      pose.turn('face', 0.16 * e);
      pose.move('face', 0, 0, 0.004 * e);
      break;
  }
}

/**
 * Undoes the head's pitch on anything that hangs from it.
 *
 * A cord hangs *down*, not along the head. Without this a villager that looks
 * up swings its own fringe back into the mask, and one that looks down pushes
 * it out into the air. Clamped, so a hard look up still moves the curtain a
 * little rather than pinning it.
 */
export function faceHang(pose: Pose, kind: string | undefined, headPitch: number): void {
  if (!HANGING.has(kind ?? '')) return;
  const fix = Math.max(-0.6, Math.min(0.6, -headPitch)) * 0.9;
  for (let i = 0; i < 7; i++) pose.turn(`face${i}`, fix);
}
