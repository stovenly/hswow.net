import type { Rng } from './random';

/**
 * What a source is doing, over time — not "flicker". Two halves: bands, a table
 * of `{ hz, depth }` summed as value noise, which is how the source wanders; and
 * events, which are what it does — a crackle, a spit, a log settling.
 *
 * Everything is a pure function of `t`, with no accumulated state, which is what
 * lets the light and the sound answer the same crackle without either telling
 * the other: the light samples backwards for envelopes that have not decayed,
 * and a sound model enumerates forwards and schedules on the audio clock. The
 * price of being seekable is that time is cut into slots holding at most one
 * hashed event each, so the gaps vary widely but are not exponential.
 *
 * The clock is the frame loop's `elapsed`, in seconds. `AudioContext` counts its
 * own, so an audio model has to convert through an epoch captured at boot.
 */

export interface ActivityBand {
  /** How fast it wanders. */
  hz: number;
  /** Roughly the peak swing it contributes, either side of the resting level. */
  depth: number;
}

export interface ActivityEvents {
  /** Slots per second. Rather under three quarters of them carry an event. */
  hz: number;
  /** How far a full-strength one lifts the level. Most are far below it. */
  strength: number;
  attack: number;
  /** Time constant of the decay, not its length. */
  decay: number;
  /** Chance of a big one, and how much bigger. */
  spit: number;
  spitScale: number;
}

export interface ActivitySpec {
  readonly bands: readonly ActivityBand[];
  readonly events?: ActivityEvents;
  /** Never darker than this fraction of the authored level. */
  readonly floor: number;
  /** How much of the swing the source's own glow geometry takes, 0..1. */
  readonly glow: number;
}

/** One event, in a caller-owned buffer. See `eventsIn`. */
export interface ActivityEvent {
  time: number;
  strength: number;
}

/**
 * One instance of a spec, with its rates and phases rolled off a seed.
 *
 * Three things vary per instance and it takes all three. Phase alone stops two
 * sources being in step; it does not stop ten at the same rate drifting into
 * step and beating, which is the failure you actually see in a row of candles.
 */
export interface ActivitySource {
  readonly spec: ActivitySpec;
  readonly seed: number;
  readonly rates: Float32Array;
  readonly phases: Float32Array;
  readonly depths: Float32Array;
  /** Mean event contribution, subtracted so the whole signal averages 1. */
  readonly bias: number;
}

/** Fraction of slots carrying an event. */
const DENSITY = 0.72;
/** Mean of the strength roll, `u²` on a uniform. Skewed toward the small. */
const MEAN_STRENGTH = 1 / 3;
/** Past this many time constants an envelope contributes nothing worth summing. */
const TAIL = 5;

export function rollActivity(spec: ActivitySpec, rng: Rng): ActivitySource {
  const count = spec.bands.length;
  const rates = new Float32Array(count);
  const phases = new Float32Array(count);
  const depths = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const band = spec.bands[i];
    rates[i] = band.hz * rng.around(1, 0.25);
    phases[i] = rng.range(0, 1024);
    depths[i] = band.depth * rng.around(1, 0.15);
  }

  return {
    spec,
    seed: (rng() * 0xffffffff) >>> 0,
    rates,
    phases,
    depths,
    bias: spec.events ? eventBias(spec.events) : 0,
  };
}

/**
 * The same source with its phases displaced.
 *
 * For two props placed with the same seed in different rooms, which content
 * data will do and which would otherwise leave them in perfect lockstep. The
 * salt is a hash of world position — as deterministic as the seed, so nothing
 * is given up.
 */
export function displace(source: ActivitySource, salt: number): ActivitySource {
  const phases = new Float32Array(source.phases.length);
  for (let i = 0; i < phases.length; i++) {
    phases[i] = source.phases[i] + hash(salt, i) * 1024;
  }
  return { ...source, seed: mix(source.seed ^ salt), phases };
}

/**
 * The level at `t`, as a multiplier on whatever the source was authored at.
 *
 * Averages 1 by construction: the bands are centred and the events have their
 * mean contribution taken back out, so the resting level sits a shade below 1
 * and an event carries it above. Without that, giving every hearth in the game
 * a signal would quietly re-light every room it stands in.
 */
export function sampleActivity(source: ActivitySource, t: number): number {
  const spec = source.spec;
  let level = 1;

  for (let i = 0; i < source.rates.length; i++) {
    level += source.depths[i] * noise(source.seed + i * 7919, t * source.rates[i] + source.phases[i]);
  }

  const events = spec.events;
  if (events) {
    const window = events.attack + events.decay * TAIL;
    const found = eventsIn(source, t - window, t, scratch);
    for (let i = 0; i < found; i++) {
      const event = scratch[i];
      level += event.strength * envelope(t - event.time, events.attack, events.decay);
    }
    level -= source.bias;
  }

  return Math.max(spec.floor, level);
}

/**
 * Every event falling in `[from, to)`, written into a caller-owned buffer.
 *
 * Returns how many were written; `out` may be longer and is reused, so nothing
 * allocates after the first few frames. This is the entry point a sound model
 * schedules from, and `sampleActivity` responds to exactly what it reports —
 * there is one event implementation and both go through it.
 */
export function eventsIn(
  source: ActivitySource,
  from: number,
  to: number,
  out: ActivityEvent[],
): number {
  const events = source.spec.events;
  if (!events) return 0;

  const first = Math.floor(from * events.hz);
  const last = Math.floor(to * events.hz);
  let count = 0;

  for (let slot = first; slot <= last; slot++) {
    if (hash(source.seed, slot) >= DENSITY) continue;
    const time = (slot + hash(source.seed ^ 0x9e3779b9, slot)) / events.hz;
    if (time < from || time >= to) continue;

    const roll = hash(source.seed ^ 0x85ebca6b, slot);
    const big = hash(source.seed ^ 0xc2b2ae35, slot) < events.spit;
    const slotted = out[count] ?? (out[count] = { time: 0, strength: 0 });
    slotted.time = time;
    slotted.strength = events.strength * roll * roll * (big ? events.spitScale : 1);
    count++;
  }

  return count;
}

const scratch: ActivityEvent[] = [];

/** Linear attack, exponential tail. Its integral is `attack / 2 + decay`. */
function envelope(age: number, attack: number, decay: number): number {
  if (age < 0) return 0;
  if (age < attack) return age / attack;
  return Math.exp(-(age - attack) / decay);
}

/** What the events add on average, which is what gets subtracted back out. */
function eventBias(events: ActivityEvents): number {
  const strength = events.strength * MEAN_STRENGTH * (1 + events.spit * (events.spitScale - 1));
  return events.hz * DENSITY * strength * (events.attack / 2 + events.decay);
}

/** Value noise in [-1, 1], mean zero. Smoothstepped between hashed lattice points. */
function noise(seed: number, x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const s = f * f * (3 - 2 * f);
  const a = hash(seed, i);
  const b = hash(seed, i + 1);
  return (a + (b - a) * s) * 2 - 1;
}

/** A stable hash of two integers to [0, 1). */
function hash(seed: number, n: number): number {
  return mix(seed ^ Math.imul(n, 0x27d4eb2d)) / 4294967296;
}

function mix(value: number): number {
  let h = value >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return (h ^ (h >>> 16)) >>> 0;
}

// --- what the kit burns ------------------------------------------------------

/** A bare wick, moved by whatever the air in the room is doing. */
export const CANDLE: ActivitySpec = {
  bands: [
    { hz: 4.5, depth: 0.3 },
    { hz: 1.6, depth: 0.16 },
    { hz: 0.35, depth: 0.1 },
  ],
  events: { hz: 0.35, strength: 0.5, attack: 0.03, decay: 0.18, spit: 0.12, spitScale: 2.2 },
  floor: 0.35,
  glow: 0.55,
};

/** The same flame behind glass: half the depth, and the fast content gone. */
export const LANTERN: ActivitySpec = {
  bands: [
    { hz: 2.2, depth: 0.12 },
    { hz: 0.6, depth: 0.1 },
  ],
  floor: 0.6,
  glow: 0.5,
};

/** Out in the weather. Slow, deep, and it flares when something catches it. */
export const STREETLAMP: ActivitySpec = {
  bands: [
    { hz: 0.9, depth: 0.14 },
    { hz: 0.22, depth: 0.2 },
  ],
  events: { hz: 0.18, strength: 0.35, attack: 0.08, decay: 0.45, spit: 0.1, spitScale: 2 },
  floor: 0.45,
  glow: 0.6,
};

/** A slow swell carries the level and the crackles sit on top of it. */
export const HEARTH: ActivitySpec = {
  bands: [
    { hz: 0.45, depth: 0.16 },
    { hz: 0.13, depth: 0.12 },
    { hz: 1.4, depth: 0.07 },
  ],
  events: { hz: 1.8, strength: 0.3, attack: 0.02, decay: 0.25, spit: 0.09, spitScale: 3 },
  floor: 0.5,
  glow: 0.45,
};

/** Bellows pace: very slow and very deep, with the odd bright one. */
export const FORGE: ActivitySpec = {
  bands: [
    { hz: 0.16, depth: 0.3 },
    { hz: 0.05, depth: 0.14 },
  ],
  events: { hz: 0.5, strength: 0.45, attack: 0.05, decay: 0.5, spit: 0.15, spitScale: 2.4 },
  floor: 0.45,
  glow: 0.5,
};

/** A sealed firebox does not flicker. It comes up and it goes down. */
export const STOVE: ActivitySpec = {
  bands: [
    { hz: 0.22, depth: 0.18 },
    { hz: 0.07, depth: 0.1 },
  ],
  floor: 0.6,
  glow: 0.4,
};
