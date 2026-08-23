import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { createCall, type CallShape, type Syllable } from '../oneshots/call';
import { createStrike, type StrikeOptions } from '../oneshots/strike';
import { createFlow, type FlowOptions } from '../oneshots/flow';
import { createDroplet, type DropletOptions } from '../oneshots/droplet';
import { createThunder, type ThunderOptions } from '../oneshots/thunder';
import { createGroan, type GroanOptions } from '../oneshots/groan';
import { createVent } from '../oneshots/vent';
import { createHorn } from '../oneshots/horn';
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
  /** Decibels against the ambience reference. Set from `DB` below, never on the model. */
  db: number;
  /** Whether this is something breathing. Only the living hush. */
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
 * Family normalisation, and the one thing that has to be true of these numbers:
 * **`fire(at, 1)` must peak in roughly the same place whichever family it is.**
 * `DB` is the mix and it is a plain multiplier on `force`, so a family whose
 * internals swallow that multiplier is a family the mix cannot reach. These
 * are not the mix.
 */
const CALL_GAIN = 0.5;
const THING_GAIN = 0.3;
const FLOW_GAIN = 9;
const DROPLET_GAIN = 3;
const THUNDER_GAIN = 1.2;
const GROAN_GAIN = 0.45;
const VENT_GAIN = 0.6;
const HORN_GAIN = 0.45;

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

const low = (band: Band, options: ThunderOptions): VoiceEntry => ({
  band,
  db: 0,
  alive: false,
  build: (engine) => createThunder(engine, { ...options, gain: THUNDER_GAIN }),
});

const strained = (band: Band, options: GroanOptions): VoiceEntry => ({
  band,
  db: 0,
  alive: false,
  build: (engine) => createGroan(engine, { ...options, gain: GROAN_GAIN }),
});

/**
 * Several one-shots fired as one event, each at its own offset and share.
 * For things that are genuinely one happening with several sounds in it.
 */
const compose = (
  band: Band,
  parts: readonly { make: (engine: AudioEngine) => OneShot; delay: number; level: number }[],
): VoiceEntry => ({
  band,
  db: 0,
  alive: false,
  build: (engine) => {
    const output = engine.context.createGain();
    const shots = parts.map((part) => {
      const shot = part.make(engine);
      shot.output.connect(output);
      return { shot, delay: part.delay, level: part.level };
    });
    return {
      output,
      fire(at, force) {
        let busy = 0;
        for (const part of shots) {
          busy = Math.max(busy, part.delay + part.shot.fire(at + part.delay, force * part.level));
        }
        return busy;
      },
      dispose() {
        for (const part of shots) part.shot.dispose();
        output.disconnect();
      },
    };
  },
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
    phrase: [
      s(1, 1.06, [0.1, 0.16], [0.05, 0.09]),
      s(1.18, 1.02, [0.08, 0.13], [0.04, 0.07]),
      s(0.94, 0.78, [0.06, 0.1], [0.03, 0.05]),
      s(0.86, 0.7, [0.05, 0.08], [0.02, 0.04], { trill: { hz: 22, cents: 90 } }),
    ],
    count: [3, 8],
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
    phrase: [
      s(1, 1.12, [0.2, 0.3], [0.06, 0.12], { drive: 0.12 }),
      s(1.22, 1.05, [0.18, 0.28], [0.05, 0.1], { drive: 0.15 }),
      s(0.9, 0.98, [0.16, 0.24], [0.05, 0.09], { drive: 0.18 }),
      s(1.4, 1.5, [0.07, 0.11], [0.03, 0.06], { drive: 0.6, level: 0.5 }),
    ],
    count: [3, 5],
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
    phrase: [
      s(1, 1.1, [0.09, 0.14], [0.05, 0.08]),
      s(1.26, 1.18, [0.08, 0.12], [0.05, 0.08]),
    ],
    count: [1, 2],
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

  // Slow whistles that swell, then the hard "jug jug jug", then a long trill.
  // Three ideas that share nothing, which is the bird.
  nightingale: sung('song', {
    pitch: 2700,
    variance: 0.08,
    size: [0.95, 1.06],
    phrase: [
      s(1, 1.02, [0.25, 0.4], [0.12, 0.2], { drive: 0.1, level: 0.55 }),
      s(1, 1.02, [0.25, 0.4], [0.12, 0.2], { drive: 0.18, level: 0.75 }),
      s(1, 1.04, [0.25, 0.4], [0.1, 0.18], { drive: 0.32 }),
      s(1.02, 1.08, [0.22, 0.35], [0.3, 0.6], { drive: 0.5 }),
    ],
    also: [
      [
        s(0.62, 0.58, [0.05, 0.07], [0.05, 0.07], { drive: 0.75 }),
        s(0.62, 0.58, [0.05, 0.07], [0.05, 0.07], { drive: 0.75 }),
        s(0.62, 0.58, [0.05, 0.07], [0.05, 0.07], { drive: 0.75 }),
        s(0.62, 0.58, [0.05, 0.07], [0.05, 0.07], { drive: 0.75 }),
        s(0.62, 0.58, [0.05, 0.07], [0.05, 0.07], { drive: 0.75 }),
        s(0.62, 0.58, [0.05, 0.07], [0.4, 0.8], { drive: 0.75 }),
      ],
      [s(1.1, 1.15, [0.5, 0.8], [0.3, 0.6], { drive: 0.45, trill: { hz: 18, cents: 160 } })],
      [
        s(1.3, 1.24, [0.06, 0.09], [0.03, 0.05], { drive: 0.4 }),
        s(1.18, 1.12, [0.06, 0.09], [0.03, 0.05], { drive: 0.4 }),
        s(1.06, 1, [0.06, 0.09], [0.03, 0.05], { drive: 0.4 }),
        s(0.94, 0.88, [0.08, 0.12], [0.4, 0.8], { drive: 0.45 }),
      ],
    ],
    formant: 3000,
    fade: 1,
  }),

  // --- open country ---------------------------------------------------------
  //
  // None of these is ever seen. The call is the whole animal, and it comes
  // from somewhere out in the grass every time.

  // The long rising whistle, and the bubbling run that climbs and hurries.
  curlew: sung('call', {
    pitch: 1500,
    variance: 0.08,
    size: [0.95, 1.06],
    phrase: [
      s(0.78, 1.2, [0.3, 0.45], [0.15, 0.3], { drive: 0.25 }),
      s(0.82, 1.26, [0.28, 0.4], [0.4, 0.9], { drive: 0.3 }),
    ],
    also: [
      [
        s(0.9, 1.05, [0.1, 0.14], [0.06, 0.09], { drive: 0.3, trill: { hz: 14, cents: 120 } }),
        s(0.98, 1.12, [0.09, 0.12], [0.05, 0.07], { drive: 0.32, trill: { hz: 15, cents: 120 } }),
        s(1.05, 1.2, [0.08, 0.11], [0.04, 0.06], { drive: 0.35, trill: { hz: 16, cents: 120 } }),
        s(1.12, 1.3, [0.07, 0.1], [0.03, 0.05], { drive: 0.38, trill: { hz: 17, cents: 120 } }),
        s(1.18, 1.36, [0.07, 0.1], [0.3, 0.8], { drive: 0.4, trill: { hz: 18, cents: 120 } }),
      ],
    ],
    repeats: [1, 2],
    between: [0.6, 1.4],
    formant: 2000,
    q: 1.2,
  }),

  // "Pee-wit": wheezy, and the display tumbles.
  lapwing: sung('call', {
    pitch: 2200,
    variance: 0.08,
    size: [0.95, 1.06],
    phrase: [
      s(0.85, 1.15, [0.12, 0.18], [0.06, 0.1], { drive: 0.55 }),
      s(1.3, 0.95, [0.16, 0.24], [0.5, 1.2], { drive: 0.6 }),
    ],
    also: [
      [
        s(0.9, 1.2, [0.08, 0.12], [0.04, 0.06], { drive: 0.5 }),
        s(1.25, 1.05, [0.07, 0.1], [0.04, 0.06], { drive: 0.5 }),
        s(1.1, 1.35, [0.1, 0.15], [0.05, 0.08], { drive: 0.55 }),
        s(1.4, 0.9, [0.2, 0.3], [0.6, 1.2], { drive: 0.65 }),
      ],
    ],
    rasp: 0.35,
    formant: 2500,
    q: 1.2,
  }),

  // "Wet-my-lips", said from inside the crop, over and over, never seen.
  quail: sung('song', {
    pitch: 2600,
    variance: 0.06,
    size: [0.96, 1.05],
    phrase: [
      s(1, 1.05, [0.05, 0.07], [0.08, 0.11], { drive: 0.5 }),
      s(0.95, 1, [0.04, 0.06], [0.06, 0.09], { drive: 0.45 }),
      s(1.15, 1.25, [0.09, 0.13], [0.9, 1.8], { drive: 0.6 }),
    ],
    repeats: [2, 4],
    between: [0.6, 1.4],
    formant: 2900,
    q: 1.3,
  }),

  // Drumming: tail feathers in a dive, not a voice. A throb that climbs in
  // pitch and hurries, then falls away.
  snipe: sung('throat', {
    pitch: 380,
    variance: 0.1,
    size: [0.95, 1.06],
    phrase: [
      s(0.8, 1.15, [0.9, 1.4], [0.3, 0.6], { drive: 0.35, trill: { hz: 11, cents: 300 } }),
      s(1.15, 0.85, [0.6, 0.9], [2, 4], { drive: 0.3, trill: { hz: 12, cents: 300 } }),
    ],
    rasp: 0.5,
    formant: 600,
    q: 0.8,
  }),

  // One mournful whistle across a moor.
  plover: sung('call', {
    pitch: 1900,
    variance: 0.06,
    size: [0.95, 1.06],
    phrase: [s(0.92, 1.08, [0.25, 0.4], [1.5, 4], { drive: 0.2 })],
    also: [[s(1.05, 0.9, [0.3, 0.45], [2, 4], { drive: 0.18 })]],
    formant: 2300,
    q: 1.3,
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

  // --- struck far off ----------------------------------------------------------

  thump: thing('body', { material: 'oak', size: 0.4, striker: 0.2, ring: 0.7 }),
  slab: thing('body', { material: 'stone', size: 0.45, striker: 0.85 }),
  crack: thing('song', { material: 'pine', size: 2.2, striker: 1, ring: 0.35 }),
  girder: thing('body', { material: 'iron', size: 0.3, striker: 0.95, ring: 1.6 }),
  sheet: thing('body', { material: 'tin', size: 0.5, striker: 0.6, ring: 1.2 }),
  // A gust arriving on a wall: the whole building moving, once.
  buffet: thing('floor', { material: 'oak', size: 0.2, striker: 0.1, ring: 0.5 }),

  // --- structures under strain --------------------------------------------------

  beam: strained('body', { material: 'iron' }),
  timber: strained('body', { material: 'timber' }),
  strain: strained('floor', { material: 'rock' }),

  // --- loose material, which arrives over a span and keeps finding stragglers
  grit: loose('air', { kind: 'grit' }),
  sand: loose('air', { kind: 'grit', tone: 1.25, amount: 0.7 }),
  slip: loose('throat', { kind: 'scree', amount: 0.7 }),
  rockfall: loose('body', { kind: 'rubble', amount: 1.3 }),
  wings: loose('call', { kind: 'feather' }),
  rabble: loose('throat', { kind: 'gravel' }),
  slide: loose('body', { kind: 'snow' }),
  mast: loose('air', { kind: 'mast', amount: 0.6 }),
  // A limb coming down somewhere in the wood: the snap, the fall, the leaves.
  bough: compose('body', [
    { make: (engine) => createStrike(engine, { material: 'pine', size: 1.6, striker: 1, ring: 0.4, gain: THING_GAIN }), delay: 0, level: 1 },
    { make: (engine) => createStrike(engine, { material: 'oak', size: 0.3, striker: 0.5, ring: 0.6, gain: THING_GAIN }), delay: 0.4, level: 0.9 },
    { make: (engine) => createFlow(engine, { kind: 'feather', amount: 1.4, gain: FLOW_GAIN }), delay: 0.42, level: 0.5 },
  ]),

  // --- water -----------------------------------------------------------------

  // The cavity is what makes a drip say how big the room is, so the ones that
  // fall indoors get one and the ones outdoors do not.
  drip: wet('song', { kind: 'drip', cavity: 130, room: 0.55 }),
  eaves: wet('song', { kind: 'drip', tone: 1.25 }),
  patter: wet('air', { kind: 'patter' }),
  pool: wet('throat', { kind: 'plunk', cavity: 55, room: 0.7 }),
  rise: wet('call', { kind: 'rise' }),
  surge: wet('throat', { kind: 'surge' }),

  // --- weather and the ground ----------------------------------------------------

  thunder: low('floor', { kind: 'sky' }),
  rumble: low('floor', { kind: 'earth' }),

  // --- works ---------------------------------------------------------------------

  blowoff: {
    band: 'call',
    db: 0,
    alive: false,
    build: (engine) => createVent(engine, { gain: VENT_GAIN }),
  },
  horn: {
    band: 'throat',
    db: 0,
    alive: false,
    build: (engine) => createHorn(engine, { gain: HORN_GAIN }),
  },

  // --- soundmarks -----------------------------------------------------------------

  // Bells are a shell whose partials are deliberately not harmonic, and a
  // tower bell swings. Standing in as long metal until they have a model.
  'bell-church': thing('body', { material: 'brass', size: 0.32, striker: 0.9, ring: 3.5 }),
};

/**
 * **The mix.** One table, one unit, and the only place a level is decided.
 *
 * Decibels against the ambience reference, where 0 dB is as loud as anything in
 * this layer is ever allowed to be — a soundmark, heard on purpose, once an
 * hour. Everything else is below it, and most things are a long way below it.
 *
 * The declared value is a **ceiling**: the per-event dice can only take a
 * source below it, never above. Anything absent sits at -24.
 */
const DB: Partial<Record<AmbienceVoice, number>> = {
  // --- soundmarks: the loudest things here, and the rarest ----------------
  'bell-church': -6,
  horn: -6,

  // --- signals: meant to be listened to -----------------------------------
  thunder: -8,
  rockfall: -12,
  rumble: -14,
  girder: -14,
  bough: -16,
  surge: -16,
  sheet: -16,
  blowoff: -16,
  strain: -16,

  // --- songbirds ----------------------------------------------------------
  //
  // Down here on purpose. A wood full of birds is a *texture*: individually
  // audible, never demanding.
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
  nightingale: -23,
  'wren-scold': -24,

  // --- open country -------------------------------------------------------
  curlew: -22,
  lapwing: -23,
  quail: -24,
  snipe: -22,
  plover: -24,

  // --- structures ---------------------------------------------------------
  beam: -18,
  timber: -24,
  buffet: -18,
  crack: -26,

  // --- loose material -----------------------------------------------------
  thump: -20,
  grit: -28,
  sand: -28,
  slip: -22,
  rabble: -23,
  slab: -19,
  wings: -22,
  slide: -20,
  mast: -28,

  // --- water --------------------------------------------------------------
  drip: -22,
  eaves: -24,
  patter: -27,
  pool: -22,
  rise: -25,

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
