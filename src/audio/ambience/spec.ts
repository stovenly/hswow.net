import type { ModelSpec } from '../Soundscape';

/**
 * What a place sounds like when nothing in particular is happening in it,
 * declared as data. Zones name a vibe; the director reads this.
 */

/**
 * The six niches. Coarse on purpose — this is a masking model, not an
 * equaliser. floor <80 Hz, body 80–300, throat 300–900, call 0.9–2.5k,
 * song 2.5–6k, air above that.
 */
export type Band = 'floor' | 'body' | 'throat' | 'call' | 'song' | 'air';

export type Span = readonly [number, number];

/**
 * Who may speak. The band, the throat and the call's shape are facts about the
 * voice and live in `voices.ts`; a cast entry says only where and when.
 */
export type AmbienceVoice =
  // Songbirds.
  | 'robin'
  | 'blackbird'
  | 'songthrush'
  | 'wren'
  | 'wren-scold'
  | 'chaffinch'
  | 'greattit'
  | 'blackcap'
  | 'yellowhammer'
  | 'whitethroat'
  | 'stonechat'
  | 'linnet'
  | 'sparrow'
  | 'swallow'
  | 'swift'
  | 'wagtail'
  | 'reedwarbler'
  | 'nightingale'
  // Open country: heard from everywhere in it and seen nowhere.
  | 'curlew'
  | 'lapwing'
  | 'quail'
  | 'snipe'
  | 'plover'
  // Night.
  | 'bats'
  // Loose material and things far off.
  | 'thump'
  | 'grit'
  | 'sand'
  | 'slip'
  | 'rabble'
  | 'slab'
  | 'rockfall'
  | 'slide'
  | 'mast'
  | 'bough'
  | 'wings'
  // Structures under strain, and struck far away.
  | 'beam'
  | 'timber'
  | 'strain'
  | 'girder'
  | 'sheet'
  | 'buffet'
  | 'crack'
  // Water.
  | 'drip'
  | 'eaves'
  | 'patter'
  | 'pool'
  | 'rise'
  | 'surge'
  // Weather and the ground.
  | 'thunder'
  | 'rumble'
  // Works.
  | 'blowoff'
  | 'horn'
  // Soundmarks.
  | 'bell-church';

/** What a continuous layer answers to. */
export type Driver =
  | 'wind'
  | 'gust'
  | 'rain'
  | 'snow'
  | 'fog'
  | 'night'
  | 'warmth'
  | 'activity';

/**
 * A level response, as multipliers on the layer's own gain at driver 0 and
 * driver 1. Level only — a layer's spectrum is the model's business.
 */
export interface Follow {
  by: Driver;
  span: Span;
}

/**
 * When something may sound at all. Which fields exist is closed; which voices
 * exist is open, the same split `WeatherKind` makes.
 */
export interface Window {
  /** Sun elevation span in degrees. `[-6, 90]` is daylight and twilight. */
  sun?: Span;
  /**
   * Minutes before sunrise this one wakes, and the order the hush recovers in.
   * Larger is earlier: a song thrush is about 47, a chaffinch about 10.
   */
  wakes?: number;
  /** Season phase span, 0 at midwinter. Wraps, so `[0.8, 0.2]` is winter. */
  season?: Span;
  /** Silent above this wind strength, 0..1. */
  shy?: number;
  /** Wind strength span it needs, 0..1. Shutters, snow off a roof, a gust on a wall. */
  wind?: Span;
  /** Rain amount tolerated, 0..1. */
  rain?: Span;
  /** Fog needed, 0..1. A foghorn in clear air is a foghorn nobody believes. */
  fog?: Span;
  /** Speaks only once the weather has stopped — eaves, gutters, a wet wood. */
  after?: 'rain' | 'snow';
  /** Degrees C. Below the floor it does not sound at all. */
  warmth?: Span;
  /** Needs at least this much of the disc lit, 0..1. */
  moon?: number;
  /** Only under cover, or only out in it. */
  under?: 'roof' | 'sky';
}

/**
 * The keynote: no position, no events to resolve, and it never stops. Mixed
 * into the ambience bed bus, which is what ducks as a whole indoors.
 */
export type AirLayer = ModelSpec & {
  id?: string;
  gain?: number;
  follow?: readonly Follow[];
  when?: Window;
};

/**
 * Continuous, and somewhere out there. Sited by the director in a ring around
 * the listener rather than at a coordinate — a zone that wants a source at a
 * place declares it in its own `SoundscapeSpec` instead.
 */
export type ChorusLayer = ModelSpec & {
  id?: string;
  gain?: number;
  /** Metres above the listener. Height is most of what stops a ring of speakers. */
  height?: number;
  follow?: readonly Follow[];
  when?: Window;
};

export interface CastMember {
  voice: AmbienceVoice;
  /** Mean seconds between utterances at full activity. */
  every: Span;
  /**
   * How the gaps fall. `'poisson'` for anything a creature does, which is
   * nearly everything — a source the ear can predict stops being heard within
   * about three repetitions. `'periodic'` for the few that genuinely keep
   * time, and those do not slow down because the place has gone quiet.
   */
  rhythm?: 'poisson' | 'periodic';
  level?: number;
  height?: number;
  /** Chance this one is answered from somewhere else a beat later, 0..1. */
  answers?: number;
  /**
   * What answers it. Absent is another of its own kind; naming a different
   * voice is the tawny owl's case, where the reply is a different call
   * altogether and that is the whole effect.
   */
  answer?: AmbienceVoice;
  /** It crosses rather than sits: path length in metres, seconds to fly it. */
  passes?: { over: number; seconds: Span };
  when?: Window;
}

/**
 * A foreground sound, meant to be listened to. One at a time across the whole
 * vibe, and never twice inside `floor` seconds however the dice fall.
 */
export interface Signal extends CastMember {
  floor: number;
  /** Struck on the hour rather than on a clock of its own. */
  clock?: 'hour';
  /** Stops the biophony dead. Alarm calls, and anything loud enough to. */
  hushes?: boolean;
}

export interface AmbienceSpec {
  air: readonly AirLayer[];
  chorus?: readonly ChorusLayer[];
  cast?: readonly CastMember[];
  signals?: readonly Signal[];
  /** How busy this place is at its busiest, 0..1. The one scarcity dial. */
  activity: number;
  /** Bands kept thin whatever the score is doing, on top of what it claims. */
  yield?: readonly Band[];
  /** The place's own dice: siting, cycle phases and rotations re-roll here. */
  seed: number;
}

/** Nothing at all. What a zone gets until it is given a vibe. */
export const QUIET: AmbienceSpec = { air: [], activity: 0, seed: 0 };
