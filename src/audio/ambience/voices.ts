import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { createCall, type CallShape, type Syllable } from '../oneshots/call';
import { createStrike, type StrikeOptions } from '../oneshots/strike';
import { createFlow, type FlowOptions } from '../oneshots/flow';
import { createDroplet, type DropletOptions } from '../oneshots/droplet';
import type { AmbienceVoice, Band } from './spec';

/**
 * Who can speak, and what they are made of. One entry per name a cast may use.
 *
 * The band is a fact about the voice rather than about where it stands, so it
 * lives here and not in the cast — a robin occupies the same niche whichever
 * wood it is in, and the director's ledger is the poorer for two entries that
 * disagree.
 *
 * Rhythm is the species. The tables below spend nearly all their detail on
 * time: how many syllables, how they are spaced, how often the whole thing is
 * repeated. A song thrush is a bird that says everything three times.
 */

export interface VoiceEntry {
  band: Band;
  /**
   * How prominent this voice is, in decibels against the ambience reference.
   * Set from `DB` below; see the note there. Never set on the model.
   */
  db: number;
  /**
   * Whether this is something breathing. Only the living hush — a clock does
   * not stop ticking because a jay shouted, and a press does not either.
   */
  alive: boolean;
  build(engine: AudioEngine): OneShot;
}

/** `from` and `to` are ratios of the call's base pitch. Lengths in seconds. */
const s = (
  from: number,
  to: number,
  length: readonly [number, number],
  gap: readonly [number, number],
  extra: Omit<Syllable, 'from' | 'to' | 'length' | 'gap'> = {},
): Syllable => ({ from, to, length, gap, ...extra });

/**
 * Family normalisation. One number per synthesis family, whose only job is to
 * bring the families onto the same footing so that `fire(t, 1)` peaks in the
 * same place whichever one is speaking. **These are not the mix** — the mix is
 * `DB`, and nothing else may set a level.
 */
const CALL_GAIN = 0.5;
/**
 * Family normalisation, and the one thing that has to be true of these numbers:
 * **`fire(at, 1)` must peak in roughly the same place whichever family it is.**
 * `DB` is the mix and it is a plain multiplier on `force`, so a family whose
 * internals swallow that multiplier is a family the mix cannot reach.
 *
 * `flow` swallowed a factor of twenty. Its per-collision level lives inside the
 * particle bed at around 0.05, so a voice at −28 dB arrived at 0.0036 where a
 * bird at −24 arrived at 0.04 — twenty five decibels down, which is not quiet,
 * it is absent. That is why every loose-material voice played nothing.
 *
 * `thing` goes the other way: a modal bank in filter mode compensates for the
 * filter's bandwidth by multiplying by the square root of Q, and at the Q a
 * long ring needs that is a factor of ten on its own.
 */
const THING_GAIN = 0.3;
const FLOW_GAIN = 9;
const DROPLET_GAIN = 3;

const sung = (band: Band, shape: CallShape, alive = true, tone = 1): VoiceEntry => ({
  band,
  db: 0,
  alive,
  build: (engine) => createCall(engine, { shape, tone, gain: CALL_GAIN }),
});

const thing = (band: Band, options: StrikeOptions): VoiceEntry => ({
  band,
  db: 0,
  alive: false,
  build: (engine) => createStrike(engine, { ...options, gain: THING_GAIN }),
});

const wet = (band: Band, options: DropletOptions): VoiceEntry => ({
  band,
  db: 0,
  alive: false,
  build: (engine) => createDroplet(engine, { ...options, gain: DROPLET_GAIN }),
});

const loose = (band: Band, options: FlowOptions): VoiceEntry => ({
  band,
  db: 0,
  alive: false,
  build: (engine) => createFlow(engine, { ...options, gain: FLOW_GAIN }),
});



export const VOICES: Record<AmbienceVoice, VoiceEntry> = {
  // --- songbirds ----------------------------------------------------------
  //
  // Nearly all of them live in `song`, which is why the band ledger matters
  // most here: two of these at once is a garden centre, not a wood.

  robin: sung('song', {
    pitch: 3200,
    variance: 0.1,
    size: [0.93, 1.08],
    // A few clear notes, then a run downhill. Its whole character is that no
    // two phrases are the same length.
    phrase: [
      s(1, 1.06, [0.1, 0.16], [0.05, 0.09]),
      s(1.18, 1.02, [0.08, 0.13], [0.04, 0.07]),
      s(0.94, 0.78, [0.06, 0.1], [0.03, 0.05]),
      s(0.86, 0.7, [0.05, 0.08], [0.02, 0.04], { trill: { hz: 22, cents: 90 } }),
    ],
    count: [3, 8],
    // Its whole character is that no two phrases are the same, so it gets the
    // widest repertoire in the book: a bright one that climbs and a thin sad
    // one that does not.
    also: [
      [
        s(1.3, 1.36, [0.12, 0.19], [0.06, 0.11], { drive: 0.12 }),
        s(1.42, 1.2, [0.09, 0.14], [0.05, 0.09], { drive: 0.15 }),
        s(1.5, 1.62, [0.07, 0.11], [0.04, 0.07], { drive: 0.2 }),
      ],
      [
        s(0.86, 0.8, [0.14, 0.22], [0.09, 0.16], { drive: 0.08 }),
        s(0.78, 0.72, [0.16, 0.26], [0.5, 1.1], { drive: 0.08 }),
      ],
    ],
    formant: 3600,
  }),

  blackbird: sung('song', {
    pitch: 2100,
    variance: 0.09,
    size: [0.94, 1.07],
    // Fluted and unhurried, and it ends scratchy — the low drive at the front
    // against the high drive at the back is the whole bird.
    phrase: [
      s(1, 1.12, [0.2, 0.3], [0.06, 0.12], { drive: 0.12 }),
      s(1.22, 1.05, [0.18, 0.28], [0.05, 0.1], { drive: 0.15 }),
      s(0.9, 0.98, [0.16, 0.24], [0.05, 0.09], { drive: 0.18 }),
      s(1.4, 1.5, [0.07, 0.11], [0.03, 0.06], { drive: 0.6, level: 0.5 }),
    ],
    count: [3, 5],
    // A second fluted idea, lower and slower, with the same scratchy sign-off.
    also: [
      [
        s(0.86, 0.94, [0.24, 0.36], [0.07, 0.14], { drive: 0.1 }),
        s(1.02, 0.88, [0.22, 0.32], [0.06, 0.12], { drive: 0.13 }),
        s(1.16, 1.24, [0.06, 0.1], [0.04, 0.07], { drive: 0.6, level: 0.45 }),
      ],
    ],
    between: [1.4, 3.2],
    repeats: [1, 2],
    formant: 2400,
    q: 0.9,
  }),

  songthrush: sung('song', {
    pitch: 2800,
    variance: 0.1,
    size: [0.95, 1.06],
    // The signature: everything said two to four times before it moves on.
    phrase: [
      s(1, 1.1, [0.09, 0.14], [0.05, 0.08]),
      s(1.26, 1.18, [0.08, 0.12], [0.05, 0.08]),
    ],
    count: [1, 2],
    // The bird with the largest real repertoire of any of them, and the one
    // where a single phrase is most obviously a loop — because it says each
    // one three times before moving on, so the repeat is already the hook.
    also: [
      [s(0.82, 0.86, [0.1, 0.15], [0.06, 0.1], { drive: 0.2 })],
      [
        s(1.44, 1.3, [0.07, 0.11], [0.04, 0.07], { drive: 0.35 }),
        s(1.18, 1.24, [0.06, 0.1], [0.05, 0.08], { drive: 0.3 }),
      ],
      [s(1, 1.62, [0.12, 0.18], [0.07, 0.12], { drive: 0.25 })],
      [
        s(0.66, 0.7, [0.13, 0.2], [0.06, 0.1], { drive: 0.15 }),
        s(0.74, 0.68, [0.11, 0.17], [0.06, 0.1], { drive: 0.18 }),
      ],
    ],
    repeats: [2, 4],
    between: [0.18, 0.32],
    formant: 3200,
  }),

  wren: sung('song', {
    pitch: 4300,
    variance: 0.06,
    size: [0.96, 1.05],
    // Absurdly loud for its size, and it ends on a hard trill.
    phrase: [
      s(1, 1.08, [0.04, 0.06], [0.015, 0.03], { drive: 0.4 }),
      s(1.1, 0.96, [0.035, 0.055], [0.015, 0.03], { drive: 0.4 }),
      s(0.92, 1.04, [0.04, 0.06], [0.015, 0.03], { drive: 0.45 }),
      s(1, 0.88, [0.28, 0.42], [0.02, 0.04], { drive: 0.55, trill: { hz: 34, cents: 220 } }),
    ],
    count: [8, 14],
    formant: 4600,
    fade: 0.985,
  }),

  'wren-scold': sung('song', {
    pitch: 3800,
    phrase: [s(1, 0.97, [0.014, 0.022], [0.026, 0.045], { drive: 0.85 })],
    count: [10, 22],
    rasp: 0.45,
    formant: 3600,
    q: 1.6,
    fade: 0.995,
  }),

  chaffinch: sung('song', {
    pitch: 3400,
    variance: 0.07,
    size: [0.95, 1.06],
    // The accelerating descent, then the flourish that turns back up.
    phrase: [
      s(1.16, 1.12, [0.07, 0.09], [0.05, 0.07]),
      s(1.1, 1.06, [0.06, 0.08], [0.04, 0.055]),
      s(1.02, 0.98, [0.055, 0.07], [0.03, 0.045]),
      s(0.94, 0.9, [0.05, 0.065], [0.025, 0.035]),
      s(0.86, 1.24, [0.13, 0.19], [0.4, 0.9], { drive: 0.45, bend: { at: 0.45, to: 0.74 } }),
    ],
    formant: 3600,
  }),

  greattit: sung('song', {
    pitch: 3900,
    size: [0.95, 1.06],
    phrase: [
      s(1, 1, [0.11, 0.15], [0.04, 0.06], { drive: 0.2 }),
      s(0.79, 0.79, [0.11, 0.15], [0.1, 0.16], { drive: 0.2 }),
    ],
    repeats: [3, 6],
    between: [0.02, 0.06],
    formant: 4000,
    fade: 1,
  }),

  blackcap: sung('song', {
    pitch: 2900,
    size: [0.95, 1.06],
    phrase: [
      s(0.9, 1.05, [0.05, 0.09], [0.02, 0.04], { drive: 0.3 }),
      s(1.12, 0.96, [0.05, 0.08], [0.02, 0.04], { drive: 0.3 }),
      s(1.28, 1.34, [0.12, 0.2], [0.03, 0.05], { drive: 0.15, level: 1.1 }),
    ],
    count: [6, 12],
    formant: 3100,
  }),

  yellowhammer: sung('song', {
    pitch: 4400,
    size: [0.95, 1.06],
    phrase: [
      s(1, 1, [0.045, 0.06], [0.045, 0.07], { drive: 0.3 }),
      s(1, 1, [0.045, 0.06], [0.045, 0.07], { drive: 0.3 }),
      s(1, 1, [0.045, 0.06], [0.045, 0.07], { drive: 0.3 }),
      s(1, 1, [0.045, 0.06], [0.045, 0.07], { drive: 0.3 }),
      s(0.7, 0.66, [0.3, 0.45], [0.6, 1.4], { drive: 0.25, level: 0.9 }),
    ],
    formant: 4200,
    fade: 1,
  }),

  whitethroat: sung('song', {
    pitch: 3300,
    size: [0.95, 1.06],
    phrase: [
      s(1, 0.92, [0.04, 0.07], [0.02, 0.04], { drive: 0.5 }),
      s(1.14, 1.02, [0.04, 0.07], [0.02, 0.04], { drive: 0.5 }),
      s(0.88, 0.96, [0.05, 0.08], [0.02, 0.05], { drive: 0.55 }),
    ],
    count: [5, 9],
    rasp: 0.25,
    formant: 3200,
  }),

  // Two stones tapped together, and that is the entire bird.
  stonechat: sung('song', {
    pitch: 3600,
    size: [0.95, 1.06],
    phrase: [
      s(1, 0.98, [0.012, 0.018], [0.07, 0.11], { drive: 0.9 }),
      s(1, 0.98, [0.012, 0.018], [0.5, 1.6], { drive: 0.9 }),
    ],
    rasp: 0.55,
    formant: 3400,
    q: 1.8,
  }),

  linnet: sung('song', {
    pitch: 3500,
    size: [0.95, 1.06],
    phrase: [
      s(1, 1.12, [0.035, 0.055], [0.02, 0.04], { drive: 0.3 }),
      s(1.2, 1, [0.03, 0.05], [0.02, 0.045], { drive: 0.3 }),
      s(0.88, 0.96, [0.04, 0.06], [0.025, 0.05], { drive: 0.35 }),
    ],
    count: [6, 12],
    formant: 3600,
  }),

  sparrow: sung('song', {
    pitch: 3200,
    size: [0.92, 1.09],
    variance: 0.14,
    phrase: [s(1, 0.94, [0.05, 0.08], [0.12, 0.26], { drive: 0.45 })],
    count: [2, 5],
    rasp: 0.22,
    formant: 3000,
  }),

  swallow: sung('song', {
    pitch: 4200,
    size: [0.95, 1.05],
    phrase: [
      s(1, 1.15, [0.025, 0.04], [0.015, 0.03], { drive: 0.35 }),
      s(1.1, 0.9, [0.025, 0.04], [0.015, 0.03], { drive: 0.35 }),
      s(0.95, 0.72, [0.09, 0.15], [0.05, 0.12], { drive: 0.7, level: 0.8 }),
    ],
    count: [4, 9],
    rasp: 0.3,
    formant: 4000,
  }),

  // The scream over the rooftops. Long, high and harsh, and it arrives moving.
  swift: sung('song', {
    pitch: 4500,
    size: [0.96, 1.05],
    variance: 0.05,
    phrase: [s(1, 1.06, [0.35, 0.7], [0.12, 0.3], { drive: 0.75, trill: { hz: 60, cents: 60 } })],
    count: [1, 3],
    rasp: 0.45,
    formant: 4800,
    q: 1.4,
  }),

  wagtail: sung('song', {
    pitch: 4000,
    size: [0.95, 1.06],
    phrase: [
      s(1, 1.1, [0.03, 0.045], [0.05, 0.08], { drive: 0.4 }),
      s(1.06, 0.96, [0.03, 0.045], [0.4, 1.2], { drive: 0.4 }),
    ],
    formant: 3900,
  }),

  // Rhythm and almost nothing else: a dry chatter that never settles on a tune.
  reedwarbler: sung('song', {
    pitch: 3000,
    size: [0.95, 1.06],
    phrase: [
      s(1, 0.96, [0.05, 0.08], [0.05, 0.1], { drive: 0.5 }),
      s(1.18, 1.18, [0.03, 0.05], [0.03, 0.07], { drive: 0.55 }),
      s(0.82, 0.86, [0.06, 0.1], [0.06, 0.12], { drive: 0.45 }),
    ],
    count: [10, 20],
    rasp: 0.4,
    formant: 2900,
    fade: 0.995,
  }),

  // Two notes, a falling minor third, and nothing else ever.
  bats: sung('air', {
    pitch: 7200,
    size: [0.85, 1.18],
    variance: 0.2,
    phrase: [s(1, 0.9, [0.006, 0.012], [0.02, 0.09], { drive: 0.7 })],
    count: [4, 14],
    rasp: 0.5,
    formant: 8000,
    q: 2,
  }),

  // --- kept animals ---------------------------------------------------------

  thump: thing('body', { material: 'oak', size: 0.4, striker: 0.2, ring: 0.7 }),
  slab: thing('body', { material: 'stone', size: 0.45, striker: 0.85 }),
  crack: thing('song', { material: 'pine', size: 2.2, striker: 1, ring: 0.35 }),

  // --- loose material, which arrives over a span and keeps finding stragglers
  grit: loose('air', { kind: 'grit' }),
  slip: loose('throat', { kind: 'scree', amount: 0.7 }),
  rockfall: loose('body', { kind: 'rubble', amount: 1.3 }),
  wings: loose('call', { kind: 'feather' }),
  rabble: loose('throat', { kind: 'gravel' }),

  // --- water -----------------------------------------------------------------

  // The cavity is what makes a drip say how big the room is, so the ones that
  // fall indoors get one and the ones outdoors do not.
  drip: wet('song', { kind: 'drip', cavity: 130, room: 0.55 }),
  patter: wet('air', { kind: 'patter' }),

  // --- signals and soundmarks -------------------------------------------------

  // Bells are a shell whose partials are deliberately not harmonic, and a
  // tower bell swings, so it also turns its mouth toward you and away. Neither
  // is a struck bar. Standing in as long metal until they have their own model.
  'bell-church': thing('body', { material: 'brass', size: 0.32, striker: 0.9, ring: 3.5 }),
};

/**
 * **The mix.** One table, one unit, and the only place a level is decided.
 *
 * Decibels against the ambience reference, where 0 dB is as loud as anything in
 * this layer is ever allowed to be — a soundmark, heard on purpose, once an
 * hour. Everything else is below it, and most things are a long way below it.
 *
 * The rule this table exists to enforce: **no source may be startling.** A
 * songbird thirty metres off is not a foreground event and must not arrive like
 * one, however good the synthesis is. The tier trim in the director attenuates
 * further on top of this, and the declared value is a **ceiling** — the
 * per-event dice can only take a source below it, never above.
 *
 * Anything absent sits at the default for its stratum, which is -24.
 */
const DB: Partial<Record<AmbienceVoice, number>> = {
  // --- soundmarks: the loudest things here, and the rarest ----------------
  'bell-church': -6,

  // --- signals: meant to be listened to -----------------------------------
  rockfall: -12,

  // --- animals near enough to matter --------------------------------------

  // --- songbirds ----------------------------------------------------------
  //
  // Down here on purpose. A wood full of birds is a *texture*: individually
  // audible, never demanding. This is the block that was arriving as a
  // foreground event and should not have been.
  blackbird: -23,
  songthrush: -23,
  robin: -24,
  wren: -23,
  chaffinch: -24,
  greattit: -24,
  blackcap: -25,
  yellowhammer: -25,
  whitethroat: -25,
  stonechat: -25,
  linnet: -26,
  sparrow: -25,
  swallow: -25,
  swift: -22,
  wagtail: -26,
  reedwarbler: -25,
  'wren-scold': -24,

  // --- people -------------------------------------------------------------

  // --- things handled -----------------------------------------------------
  thump: -20,
  grit: -28,
  slip: -22,
  rabble: -23,
  slab: -19,
  wings: -22,
  crack: -26,

  // --- water --------------------------------------------------------------
  drip: -22,
  patter: -27,

  // --- the small and the far ----------------------------------------------
  bats: -22,
};

/** Anything the table does not name. Deliberately quiet. */
const DEFAULT_DB = -24;

for (const [name, entry] of Object.entries(VOICES)) {
  entry.db = DB[name as AmbienceVoice] ?? DEFAULT_DB;
}

/** Every name, for the dev panel's picker. */
export const AMBIENCE_VOICES = Object.keys(VOICES) as readonly AmbienceVoice[];
