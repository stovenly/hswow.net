import * as THREE from 'three';
import { hash } from '../audio/weather';
import { GENERA } from '../art/glsl/clouds';
import { WEATHER_KINDS, type Climate } from './climate';

/**
 * What a storm throws, and when. A strike is discrete, which nothing else in
 * the climate is, so it is drawn from a hash of a time bucket rather than
 * stored: two zones in the same valley see the same bolts, scrubbing the clock
 * scrubs them with it, and there is nothing to serialise.
 */

export type LightningName = 'sheet' | 'forked' | 'crawler' | 'near' | 'horizon';

/** What a weather kind throws. Absent from a row means it never flashes. */
export interface StrikeBias {
  /** Strikes a minute at full amount. */
  readonly rate: number;
  /** Which rows it may draw. Absent is all of them. */
  readonly kinds?: readonly LightningName[];
}

export interface Lightning {
  readonly name: LightningName;
  /** Kilometres, near end and far end. */
  readonly range: readonly [number, number];
  readonly strokes: readonly [number, number];
  /** Seconds between return strokes. */
  readonly gap: readonly [number, number];
  readonly channel: 'none' | 'fork' | 'crawl';
  /** Peak light added to the sky. 1 is about a bright overcast noon. */
  readonly flash: number;
  /** How much of the peal is its first arrival, 0..1. A rip against a roll. */
  readonly crack: number;
  /** Kilometres of channel the peal is spread over. */
  readonly spread: number;
  /** How far the channel wanders off straight, as a fraction of its length. */
  readonly wander: number;
  /** How wide the drawn channel is, in chunky pixels. */
  readonly width: number;
  /** Drawn weight with the cell far off, and with it overhead. */
  readonly odds: readonly [number, number];
  readonly thunder: boolean;
}

/**
 * The rows. Named after what a meteorologist calls them because those are the
 * clearest words available.
 *
 * `horizon` is silent: thunder is inaudible past about fifteen kilometres, and
 * a flash with no sound is heat lightning rather than a missing feature.
 */
export const LIGHTNING: Record<LightningName, Lightning> = {
  sheet: {
    name: 'sheet',
    range: [4, 18],
    strokes: [1, 2],
    gap: [0.05, 0.11],
    channel: 'none',
    flash: 0.25,
    crack: 0.15,
    spread: 7,
    wander: 0,
    width: 0,
    odds: [1, 0.55],
    thunder: true,
  },
  forked: {
    name: 'forked',
    range: [1.5, 9],
    strokes: [3, 5],
    gap: [0.04, 0.09],
    channel: 'fork',
    flash: 1,
    crack: 0.6,
    spread: 4,
    wander: 0.25,
    width: 1.7,
    odds: [0.35, 1],
    thunder: true,
  },
  crawler: {
    name: 'crawler',
    range: [2, 10],
    strokes: [1, 1],
    gap: [0.2, 0.2],
    channel: 'crawl',
    flash: 0.4,
    crack: 0.18,
    spread: 9,
    wander: 0.3,
    width: 1.3,
    odds: [0.5, 0.45],
    thunder: true,
  },
  near: {
    name: 'near',
    range: [0.2, 1.5],
    strokes: [1, 2],
    gap: [0.05, 0.1],
    channel: 'fork',
    flash: 3,
    crack: 0.95,
    spread: 2,
    wander: 0.2,
    width: 4.5,
    odds: [0, 0.35],
    thunder: true,
  },
  horizon: {
    name: 'horizon',
    range: [18, 40],
    strokes: [1, 1],
    gap: [0.2, 0.2],
    channel: 'none',
    flash: 0.1,
    crack: 0.1,
    spread: 8,
    wander: 0,
    width: 0,
    odds: [0.9, 0],
    thunder: false,
  },
};

/** Seconds of sky clock in one bucket. At most one strike is drawn per bucket. */
export const BUCKET = 4;

/**
 * The clock strikes are drawn against, in seconds — game days geared down by
 * the same sixty the decks run on, so at the default day length one of these is
 * one real second and scrubbing the hour scrubs the lightning with it.
 */
export function skyClock(climate: Climate): number {
  return climate.elapsedDays * 1440;
}

export interface Stroke {
  /** Seconds after the flash begins. */
  at: number;
  peak: number;
}

export interface Strike {
  readonly row: Lightning;
  /** Radians. The world direction at bearing b is (cos b, 0, sin b). */
  readonly bearing: number;
  /** Kilometres. */
  readonly range: number;
  /** Unit, toward the middle of the channel. */
  readonly toward: THREE.Vector3;
  readonly strokes: readonly Stroke[];
  /** Seconds the flash lasts. */
  readonly life: number;
  /** The channel's own dice. */
  readonly seed: number;
}

/** Rise and ring-down of one stroke, in seconds. */
const RISE = 0.012;
const FALL = 0.055;
/**
 * The same with the flicker switched off: one stroke, a slow rise, and a hard
 * ceiling well short of white. A stroke train is a full-frame luminance
 * transient at 15–20 Hz, which is the pattern that causes seizures.
 */
const CALM_RISE = 0.25;
const CALM_FALL = 0.3;
const CALM_CEILING = 0.3;

/** How much dimmer each return stroke is than the one before it. */
const RETURN_DECAY = 0.62;

let flicker = true;

/** The accessibility switch. Off is one slow stroke under a ceiling, not no storm. */
export function setLightning(on: boolean): void {
  flicker = on;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** Into −π..π. */
function wrapPi(angle: number): number {
  return angle - Math.PI * 2 * Math.floor((angle + Math.PI) / (Math.PI * 2));
}

/** Strikes a minute here and now, over every kind that throws them. */
export function strikeRate(climate: Climate): number {
  let rate = 0;
  for (const kind of WEATHER_KINDS) {
    if (!kind.strike) continue;
    rate += climate.amountOf(kind.name) * kind.strike.rate;
  }
  return rate;
}

/** Which rows anything running right now is allowed to draw. */
function allowed(climate: Climate): readonly LightningName[] {
  const names: LightningName[] = [];
  for (const kind of WEATHER_KINDS) {
    if (!kind.strike || climate.amountOf(kind.name) <= 0) continue;
    for (const name of kind.strike.kinds ?? (Object.keys(LIGHTNING) as LightningName[])) {
      if (!names.includes(name)) names.push(name);
    }
  }
  return names;
}

/**
 * The strike in this bucket, or null for a bucket that has none. Everything
 * about it — which row, how far, which way, how many strokes — comes off
 * further hashes of the same bucket, so nothing is kept.
 *
 * `single` collapses the return-stroke train to one stroke: the reduced-motion
 * shape, and the global cap that stops two strikes compounding into a longer
 * flicker than one bolt makes.
 */
export function drawStrike(climate: Climate, bucket: number, single: boolean): Strike | null {
  const rate = strikeRate(climate);
  if (rate <= 0) return null;
  const seed = climate.settings.seed;
  if (hash(seed * 7919 + bucket) > Math.min(0.9, (rate * BUCKET) / 60)) return null;

  const roll = (n: number): number => hash(Math.imul(bucket, 0x9e3779b1) + n * 8191 + seed);

  // Where the cell is. Rain hammering here is a cell on top of you; a dry field
  // with rain either side of it in time is a cell over there.
  const closeness = clamp01(climate.precipitation);
  const rows = allowed(climate);
  const odds = (name: LightningName): number =>
    lerp(LIGHTNING[name].odds[0], LIGHTNING[name].odds[1], closeness);
  let total = 0;
  for (const name of rows) total += odds(name);
  if (total <= 0) return null;
  let pick = roll(1) * total;
  let row = LIGHTNING[rows[rows.length - 1]];
  for (const name of rows) {
    pick -= odds(name);
    if (pick <= 0) {
      row = LIGHTNING[name];
      break;
    }
  }

  // Pushed toward the near end of the row as the cell closes.
  const range = lerp(row.range[0], row.range[1], Math.pow(roll(2), 1 + closeness * 2));

  // A cell that is coming is upwind and one that has been is downwind, so the
  // rain gradient already says which way to lean and no new field is needed.
  const wind = climate.wind.settings.windDirection;
  const coming = climate.precipitationSoon - climate.precipitation;
  const going = climate.precipitationPast - climate.precipitation;
  const lean = coming > going ? wind + Math.PI : wind;
  const pull = clamp01(Math.max(coming, going) * 2.5) * 0.55;
  const bearing = lean + wrapPi(roll(3) * Math.PI * 2 - lean) * (1 - pull);

  const base = GENERA.cumulonimbus.height;
  const climb = Math.atan2(base * 0.5, range);
  const toward = new THREE.Vector3(
    Math.cos(bearing) * Math.cos(climb),
    Math.sin(climb),
    Math.sin(bearing) * Math.cos(climb),
  );

  const strokes: Stroke[] = [];
  const count = single || !flicker ? 1 : Math.round(lerp(row.strokes[0], row.strokes[1], roll(4)));
  let at = 0;
  for (let i = 0; i < count; i++) {
    strokes.push({ at, peak: row.flash * Math.pow(RETURN_DECAY, i) * (0.78 + roll(10 + i) * 0.3) });
    at += lerp(row.gap[0], row.gap[1], roll(20 + i));
  }
  const life = strokes[strokes.length - 1].at
    + (flicker ? RISE + FALL * 7 : CALM_RISE + CALM_FALL * 7);

  return { row, bearing, range, toward, strokes, life, seed: Math.floor(roll(5) * 1e6) };
}

/**
 * How bright the flash is `since` seconds in. A function of the time rather
 * than an envelope stepped per frame: `dt` is clamped and the frame rate can be
 * capped, and a skipped frame has to lose a stroke's brightness, not the stroke.
 */
export function flashOf(strike: Strike, since: number): number {
  if (since < 0 || since > strike.life) return 0;
  const rise = flicker ? RISE : CALM_RISE;
  const fall = flicker ? FALL : CALM_FALL;
  let total = 0;
  for (const stroke of strike.strokes) {
    const t = since - stroke.at;
    if (t < 0) continue;
    total += stroke.peak * (t < rise ? t / rise : Math.exp(-(t - rise) / fall));
  }
  return flicker ? total : Math.min(total, CALM_CEILING);
}
