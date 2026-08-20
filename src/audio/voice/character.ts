// Who a throat belongs to: the axes a body and a writer are built from, the
// region each people draws them in, and the named voices that state their own.

import { lectOf, type Draw, type Lect, type Tune, type Vowel } from '../speech';
import { NO_HISS, SHAPES, type Shape } from './shapes';
import type { LectName } from './types';

type Span = readonly [number, number];

/**
 * The world's range on every drawn axis. A people narrows the ones it owns in
 * `REGIONS` and takes the rest of these as they stand.
 */
const WORLD = {
  /** 0..1, how big. Tract length and the f0 centre, and nothing else. */
  size: [0, 1],
  /** On f0, so pitch is not a function of length alone. */
  f0Trim: [0.9, 1.1],
  /** Scales the nose against the mouth, and where it joins as a fraction along. */
  nose: [0.85, 1.15],
  noseJoin: [0.34, 0.46],

  /** Offset on the fold shape: below 0 is pressed, above is breathy. */
  rd: [-0.21, 0.21],
  breath: [0.03, 0.07],
  /** Source-tract coupling. */
  couple: [0.68, 0.82],
  /** Scales the period and amplitude wobble: a clean voice against a rough one. */
  rough: [0.4, 2.2],
  /** How far the pitch wavers, and how slowly. A stated 1 is a frail voice. */
  old: [0, 0.35],
  /** Scales the aspiration that is always there. */
  airy: [0.5, 2.5],
  /** How far the folds drop into creak at the end of a phrase. */
  creak: [0, 0.5],

  /** 0..1, how high the larynx sits. 1 is a short bright pharynx. */
  larynx: [0, 1],
  /** Pharynx diameter, tube units. */
  throat: [0.45, 0.8],
  /** Front-of-mouth diameter, tube units. */
  mouth: [1.3, 1.7],
  /** One-pole on each end reflection: higher is duller. */
  damp: [0.42, 0.74],
  /** Wall loss per section per pass: higher is ringier. */
  ring: [0.9985, 0.9995],
  /** Sections at the front that count as lips; floored to 1..4. */
  horn: [1, 5],
  /** Half-width of the tongue hump, as a fraction of the tract. */
  hump: [0.2, 0.32],
  /** How loud a constriction hisses. */
  hiss: [0.16, 0.36],
  /** Where the tongue tip touches, as a fraction along the tract. */
  tipAt: [0.77, 0.83],
  /** Follower time constants for the tip and the jaw, seconds. */
  tipTau: [0.005, 0.009],
  jawTau: [0.028, 0.041],

  /** Added to every vowel's tongue position: above 0 is fronted. */
  tongue: [-0.08, 0.08],
  /** Scales every vowel's jaw. */
  open: [0.8, 1.25],
  /** Scales every vowel's lip opening: below 1 is habitually rounded. */
  round: [0.85, 1.1],
  /** How far the vowels collapse toward ə. */
  lazy: [0, 0.25],
  /** Scales the followers and the mouth's approach: above 1 undershoots. */
  reach: [0.7, 1.4],

  /** How hard the accent lands, on both loudness and length. */
  punch: [0.6, 1.5],
  /** Where the accent peaks in the syllable, as a fraction of it. */
  peakAt: [0.18, 0.55],
  /** How much of the pitch is nobody's plan. */
  wobble: [0.06, 0.22],
  /** Weight moved from stating to asking. */
  tuneBias: [-1, 1],
  /** Both scale their people's: downhill across a sentence, room between words. */
  declination: [0.6, 1.4],
  pause: [0.7, 1.3],
} satisfies Record<string, Span>;

type Axis = keyof typeof WORLD;

/**
 * Three draws per creature — how big, what the folds are like, how the mouth is
 * held. **Exactly one per axis**, or the space collapses back to size.
 */
const STREAM: Record<Axis, 0 | 1 | 2> = {
  size: 0, f0Trim: 0, nose: 0, noseJoin: 0,

  rd: 1, breath: 1, couple: 1, rough: 1, old: 1, airy: 1, creak: 1,

  larynx: 2, throat: 2, mouth: 2, damp: 2, ring: 2, horn: 2, hump: 2, hiss: 2,
  tipAt: 2, tipTau: 2, jawTau: 2, tongue: 2, open: 2, round: 2, lazy: 2,
  reach: 2, punch: 2, peakAt: 2, wobble: 2, tuneBias: 2, declination: 2, pause: 2,
};

/**
 * Dark, soft, open and unhurried against bright, hard, forward and clattering.
 * The regions overlap on purpose: a people has to be a recognisable sound
 * before a person is, but two neighbours are not two casts either.
 */
const REGIONS: Record<LectName, Partial<Record<Axis, Span>>> = {
  country: {
    larynx: [0, 0.55], throat: [0.6, 0.8], damp: [0.58, 0.74], ring: [0.9985, 0.9991],
    hiss: [0.16, 0.26], airy: [1.1, 2.2], creak: [0, 0.2],
    tipTau: [0.005, 0.007], jawTau: [0.028, 0.033],
    tongue: [-0.08, 0.02], open: [0.95, 1.25], lazy: [0.06, 0.25],
    punch: [0.6, 1.05], peakAt: [0.18, 0.38],
  },
  city: {
    larynx: [0.45, 1], throat: [0.45, 0.65], damp: [0.42, 0.58], ring: [0.9989, 0.9995],
    hiss: [0.26, 0.36], airy: [0.5, 1.3], creak: [0.1, 0.5],
    tipTau: [0.007, 0.009], jawTau: [0.035, 0.041],
    tongue: [-0.02, 0.08], open: [0.8, 1.1], lazy: [0, 0.12],
    punch: [0.95, 1.5], peakAt: [0.32, 0.55],
  },
};

/** One person's throat, mouth and habits: every axis, plus what their lect gave them. */
export interface Character extends Record<Axis, number> {
  /** Syllables a second. */
  rate: number;
  /** How wide the pitch swings. */
  range: number;
  /** How much the nose leaks when it should be shut. */
  velum: number;
}

/**
 * A named voice. Anything stated replaces the draw; anything left out still
 * comes from the people, which is how a row reads as one of them *and* as
 * itself. The seed keeps moving whatever the row does not state.
 */
export interface Part extends Partial<Character> {
  lect: LectName;
  /** What you should hear — the only way to tell later whether the row still does it. */
  note: string;
}

/** Named voices, so an NPC is the same person every time they are met. */
export const VOICES: Record<string, Part> = {};

function hash(seed: number, n: number): number {
  const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function draw(seed: number, name: LectName, part: Part | undefined): Character {
  const region = REGIONS[name];
  const lect = lectOf(name);
  const seeds = [seed, seed * 1.37 + 11.7, seed * 2.11 + 29.3];
  const axes = {} as Record<Axis, number>;
  let n = 0;
  for (const key of Object.keys(WORLD) as Axis[]) {
    const [lo, hi] = region[key] ?? WORLD[key];
    axes[key] = lo + hash(seeds[STREAM[key]], ++n) * (hi - lo);
  }
  const held = seeds[2];
  const [slow, quick] = lect.rate;
  const [narrow, wide] = lect.range;
  const who: Character = {
    ...axes,
    rate: slow + hash(held, 90) * (quick - slow),
    range: narrow + hash(held, 91) * (wide - narrow),
    velum: hash(held, 92) * lect.velum,
  };
  if (!part) return who;
  const { lect: people, note, ...stated } = part;
  return { ...who, ...stated };
}

/** Leans a people's tunes toward asking or toward stating, by one weight. */
function lean(tunes: readonly Draw<Tune>[], bias: number): readonly Draw<Tune>[] {
  return tunes.map(({ of, weight }) => ({
    of,
    weight: Math.max(0.5, weight + (of === 'question' ? bias : of === 'statement' ? -bias : 0)),
  }));
}

export interface Throat {
  lect: Lect;
  who: Character;
  /** The lect's tunes, leaned by this one's `tuneBias`. */
  tunes: readonly Draw<Tune>[];
}

/** Who is speaking: a named character if there is one, otherwise a draw. */
export function whoIs(seed: number, lect: LectName | undefined, character: string | undefined): Throat {
  const part = character ? VOICES[character] : undefined;
  if (character && !part) console.warn(`voice: no character named ${character}`);
  const name = part?.lect ?? lect ?? 'country';
  const spoken = lectOf(name);
  const who = draw(seed, name, part);
  return { lect: spoken, who, tunes: lean(spoken.tunes, who.tuneBias) };
}

const REST = SHAPES['ə'];

function toward(from: number, to: number, by: number): number {
  return from + (to - from) * by;
}

/**
 * One vowel as this person holds it. Anything held below `NO_HISS` comes out as
 * a vowel with a hiss laid over it, so the tongue and the lips clamp there.
 */
function settle(s: Shape, who: Character): Shape {
  const jaw = Math.min(1.1, toward(s.jaw, REST.jaw, who.lazy) * who.open);
  const bodyPos = Math.min(1, Math.max(0, toward(s.bodyPos, REST.bodyPos, who.lazy) + who.tongue));
  const bodyDia = Math.max(NO_HISS, toward(s.bodyDia, REST.bodyDia, who.lazy));
  const lips = Math.max(NO_HISS, toward(s.lips, REST.lips, who.lazy) * who.round);
  return s.tip === undefined
    ? { jaw, bodyPos, bodyDia, lips }
    : { jaw, bodyPos, bodyDia, lips, tip: Math.max(NO_HISS, s.tip) };
}

/** This person's whole vowel space, built once and kept for the voice's life. */
export function vowelSpace(who: Character): Record<Vowel, Shape> {
  const out = {} as Record<Vowel, Shape>;
  for (const v of Object.keys(SHAPES) as Vowel[]) out[v] = settle(SHAPES[v], who);
  return out;
}
