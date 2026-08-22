import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { createCall, type CallShape, type Syllable } from '../oneshots/call';
import { createAnimal, type AnimalOptions } from '../oneshots/animal';
import { createClatter, type ClatterOptions } from '../oneshots/clatter';
import { createBell, type BellOptions } from '../oneshots/bell';
import { createDrip, type DripOptions } from '../oneshots/drip';
import { createHammer, type HammerOptions } from '../oneshots/hammer';
import { createVoice } from '../voice/Voice';
import type { VoiceOptions } from '../voice/types';
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

const sung = (band: Band, shape: CallShape, alive = true, tone = 1): VoiceEntry => ({
  band,
  alive,
  build: (engine) => createCall(engine, { shape, tone }),
});

const beast = (band: Band, options: AnimalOptions): VoiceEntry => ({
  band,
  alive: true,
  build: (engine) => createAnimal(engine, options),
});

const thing = (band: Band, options: ClatterOptions): VoiceEntry => ({
  band,
  alive: false,
  build: (engine) => createClatter(engine, options),
});

const rung = (band: Band, options: BellOptions): VoiceEntry => ({
  band,
  alive: false,
  build: (engine) => createBell(engine, options),
});

const drop = (band: Band, options: DripOptions): VoiceEntry => ({
  band,
  alive: false,
  build: (engine) => createDrip(engine, options),
});

const said = (band: Band, options: VoiceOptions): VoiceEntry => ({
  band,
  alive: true,
  build: (engine) => createVoice(engine, options),
});

const struck = (band: Band, options: HammerOptions): VoiceEntry => ({
  band,
  alive: false,
  build: (engine) => createHammer(engine, options),
});

export const VOICES: Record<AmbienceVoice, VoiceEntry> = {
  // --- songbirds ----------------------------------------------------------
  //
  // Nearly all of them live in `song`, which is why the band ledger matters
  // most here: two of these at once is a garden centre, not a wood.

  robin: sung('song', {
    pitch: 3200,
    variance: 0.1,
    // A few clear notes, then a run downhill. Its whole character is that no
    // two phrases are the same length.
    phrase: [
      s(1, 1.06, [0.1, 0.16], [0.05, 0.09]),
      s(1.18, 1.02, [0.08, 0.13], [0.04, 0.07]),
      s(0.94, 0.78, [0.06, 0.1], [0.03, 0.05]),
      s(0.86, 0.7, [0.05, 0.08], [0.02, 0.04], { trill: { hz: 22, cents: 90 } }),
    ],
    count: [3, 8],
    formant: 3600,
    gain: 0.5,
  }),

  blackbird: sung('song', {
    pitch: 2100,
    variance: 0.09,
    // Fluted and unhurried, and it ends scratchy — the low drive at the front
    // against the high drive at the back is the whole bird.
    phrase: [
      s(1, 1.12, [0.2, 0.3], [0.06, 0.12], { drive: 0.12 }),
      s(1.22, 1.05, [0.18, 0.28], [0.05, 0.1], { drive: 0.15 }),
      s(0.9, 0.98, [0.16, 0.24], [0.05, 0.09], { drive: 0.18 }),
      s(1.4, 1.5, [0.07, 0.11], [0.03, 0.06], { drive: 0.6, level: 0.5 }),
    ],
    count: [3, 5],
    between: [1.4, 3.2],
    repeats: [1, 2],
    formant: 2400,
    q: 0.9,
    gain: 0.55,
  }),

  songthrush: sung('song', {
    pitch: 2800,
    variance: 0.1,
    // The signature: everything said two to four times before it moves on.
    phrase: [
      s(1, 1.1, [0.09, 0.14], [0.05, 0.08]),
      s(1.26, 1.18, [0.08, 0.12], [0.05, 0.08]),
    ],
    count: [1, 2],
    repeats: [2, 4],
    between: [0.18, 0.32],
    formant: 3200,
    gain: 0.55,
  }),

  wren: sung('song', {
    pitch: 4300,
    variance: 0.06,
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
    gain: 0.5,
  }),

  'wren-scold': sung('song', {
    pitch: 3800,
    phrase: [s(1, 0.97, [0.014, 0.022], [0.026, 0.045], { drive: 0.85 })],
    count: [10, 22],
    rasp: 0.45,
    formant: 3600,
    q: 1.6,
    fade: 0.995,
    gain: 0.42,
  }),

  chaffinch: sung('song', {
    pitch: 3400,
    variance: 0.07,
    // The accelerating descent, then the flourish that turns back up.
    phrase: [
      s(1.16, 1.12, [0.07, 0.09], [0.05, 0.07]),
      s(1.1, 1.06, [0.06, 0.08], [0.04, 0.055]),
      s(1.02, 0.98, [0.055, 0.07], [0.03, 0.045]),
      s(0.94, 0.9, [0.05, 0.065], [0.025, 0.035]),
      s(0.86, 1.24, [0.13, 0.19], [0.4, 0.9], { drive: 0.45, bend: { at: 0.45, to: 0.74 } }),
    ],
    formant: 3600,
    gain: 0.5,
  }),

  greattit: sung('song', {
    pitch: 3900,
    phrase: [
      s(1, 1, [0.11, 0.15], [0.04, 0.06], { drive: 0.2 }),
      s(0.79, 0.79, [0.11, 0.15], [0.1, 0.16], { drive: 0.2 }),
    ],
    repeats: [3, 6],
    between: [0.02, 0.06],
    formant: 4000,
    fade: 1,
    gain: 0.45,
  }),

  blackcap: sung('song', {
    pitch: 2900,
    phrase: [
      s(0.9, 1.05, [0.05, 0.09], [0.02, 0.04], { drive: 0.3 }),
      s(1.12, 0.96, [0.05, 0.08], [0.02, 0.04], { drive: 0.3 }),
      s(1.28, 1.34, [0.12, 0.2], [0.03, 0.05], { drive: 0.15, level: 1.1 }),
    ],
    count: [6, 12],
    formant: 3100,
    gain: 0.45,
  }),

  skylark: sung('song', {
    pitch: 4000,
    variance: 0.05,
    // The one bird that does not stop. Sustained, high, and it hangs there.
    phrase: [
      s(1, 1.14, [0.035, 0.055], [0.008, 0.018], { drive: 0.35 }),
      s(1.08, 0.92, [0.03, 0.05], [0.008, 0.018], { drive: 0.35 }),
      s(0.9, 1.06, [0.035, 0.05], [0.008, 0.02], { drive: 0.4, trill: { hz: 40, cents: 140 } }),
    ],
    count: [40, 90],
    formant: 4400,
    fade: 0.999,
    gain: 0.34,
  }),

  yellowhammer: sung('song', {
    pitch: 4400,
    phrase: [
      s(1, 1, [0.045, 0.06], [0.045, 0.07], { drive: 0.3 }),
      s(1, 1, [0.045, 0.06], [0.045, 0.07], { drive: 0.3 }),
      s(1, 1, [0.045, 0.06], [0.045, 0.07], { drive: 0.3 }),
      s(1, 1, [0.045, 0.06], [0.045, 0.07], { drive: 0.3 }),
      s(0.7, 0.66, [0.3, 0.45], [0.6, 1.4], { drive: 0.25, level: 0.9 }),
    ],
    formant: 4200,
    fade: 1,
    gain: 0.42,
  }),

  whitethroat: sung('song', {
    pitch: 3300,
    phrase: [
      s(1, 0.92, [0.04, 0.07], [0.02, 0.04], { drive: 0.5 }),
      s(1.14, 1.02, [0.04, 0.07], [0.02, 0.04], { drive: 0.5 }),
      s(0.88, 0.96, [0.05, 0.08], [0.02, 0.05], { drive: 0.55 }),
    ],
    count: [5, 9],
    rasp: 0.25,
    formant: 3200,
    gain: 0.42,
  }),

  // Two stones tapped together, and that is the entire bird.
  stonechat: sung('song', {
    pitch: 3600,
    phrase: [
      s(1, 0.98, [0.012, 0.018], [0.07, 0.11], { drive: 0.9 }),
      s(1, 0.98, [0.012, 0.018], [0.5, 1.6], { drive: 0.9 }),
    ],
    rasp: 0.55,
    formant: 3400,
    q: 1.8,
    gain: 0.4,
  }),

  meadowpipit: sung('song', {
    pitch: 4600,
    phrase: [s(1, 0.985, [0.03, 0.045], [0.045, 0.075], { drive: 0.25 })],
    count: [6, 14],
    formant: 4600,
    fade: 0.97,
    gain: 0.36,
  }),

  linnet: sung('song', {
    pitch: 3500,
    phrase: [
      s(1, 1.12, [0.035, 0.055], [0.02, 0.04], { drive: 0.3 }),
      s(1.2, 1, [0.03, 0.05], [0.02, 0.045], { drive: 0.3 }),
      s(0.88, 0.96, [0.04, 0.06], [0.025, 0.05], { drive: 0.35 }),
    ],
    count: [6, 12],
    formant: 3600,
    gain: 0.36,
  }),

  sparrow: sung('song', {
    pitch: 3200,
    variance: 0.14,
    phrase: [s(1, 0.94, [0.05, 0.08], [0.12, 0.26], { drive: 0.45 })],
    count: [2, 5],
    rasp: 0.22,
    formant: 3000,
    gain: 0.4,
  }),

  swallow: sung('song', {
    pitch: 4200,
    phrase: [
      s(1, 1.15, [0.025, 0.04], [0.015, 0.03], { drive: 0.35 }),
      s(1.1, 0.9, [0.025, 0.04], [0.015, 0.03], { drive: 0.35 }),
      s(0.95, 0.72, [0.09, 0.15], [0.05, 0.12], { drive: 0.7, level: 0.8 }),
    ],
    count: [4, 9],
    rasp: 0.3,
    formant: 4000,
    gain: 0.38,
  }),

  // The scream over the rooftops. Long, high and harsh, and it arrives moving.
  swift: sung('song', {
    pitch: 4500,
    variance: 0.05,
    phrase: [s(1, 1.06, [0.35, 0.7], [0.12, 0.3], { drive: 0.75, trill: { hz: 60, cents: 60 } })],
    count: [1, 3],
    rasp: 0.45,
    formant: 4800,
    q: 1.4,
    gain: 0.4,
  }),

  wagtail: sung('song', {
    pitch: 4000,
    phrase: [
      s(1, 1.1, [0.03, 0.045], [0.05, 0.08], { drive: 0.4 }),
      s(1.06, 0.96, [0.03, 0.045], [0.4, 1.2], { drive: 0.4 }),
    ],
    formant: 3900,
    gain: 0.36,
  }),

  // Rhythm and almost nothing else: a dry chatter that never settles on a tune.
  reedwarbler: sung('song', {
    pitch: 3000,
    phrase: [
      s(1, 0.96, [0.05, 0.08], [0.05, 0.1], { drive: 0.5 }),
      s(1.18, 1.18, [0.03, 0.05], [0.03, 0.07], { drive: 0.55 }),
      s(0.82, 0.86, [0.06, 0.1], [0.06, 0.12], { drive: 0.45 }),
    ],
    count: [10, 20],
    rasp: 0.4,
    formant: 2900,
    fade: 0.995,
    gain: 0.38,
  }),

  // Two notes, a falling minor third, and nothing else ever.
  cuckoo: sung('call', {
    pitch: 700,
    variance: 0.03,
    phrase: [
      s(1, 1, [0.16, 0.2], [0.1, 0.13], { drive: 0.1 }),
      s(0.84, 0.84, [0.2, 0.26], [1.4, 3.5], { drive: 0.1, level: 0.7 }),
    ],
    repeats: [2, 5],
    between: [0, 0],
    formant: 1400,
    q: 2.2,
    fade: 1,
    gain: 0.5,
  }),

  kingfisher: sung('song', {
    pitch: 4800,
    phrase: [s(1, 1.04, [0.06, 0.09], [0.1, 0.2], { drive: 0.3 })],
    count: [1, 3],
    formant: 4800,
    gain: 0.45,
  }),

  // --- corvids and the harsh end ------------------------------------------

  jay: sung('call', {
    pitch: 1400,
    variance: 0.08,
    phrase: [s(1, 0.86, [0.3, 0.45], [0.24, 0.4], { drive: 0.95 })],
    count: [2, 3],
    rasp: 0.75,
    formant: 1800,
    q: 1.2,
    gain: 0.6,
  }),

  raven: sung('throat', {
    pitch: 500,
    variance: 0.07,
    // Three descending knocks, and the drop between them is the bird.
    phrase: [
      s(1, 0.94, [0.16, 0.22], [0.2, 0.3], { drive: 0.8 }),
      s(0.92, 0.86, [0.16, 0.22], [0.2, 0.32], { drive: 0.8 }),
      s(0.84, 0.78, [0.18, 0.26], [0.6, 1.6], { drive: 0.75 }),
    ],
    rasp: 0.6,
    formant: 900,
    q: 1.1,
    gain: 0.55,
  }),

  rook: sung('throat', {
    pitch: 900,
    variance: 0.12,
    phrase: [s(1, 0.9, [0.18, 0.28], [0.22, 0.4], { drive: 0.85 })],
    count: [2, 4],
    rasp: 0.7,
    formant: 1300,
    gain: 0.5,
  }),

  crow: sung('throat', {
    pitch: 800,
    variance: 0.1,
    phrase: [s(1, 0.93, [0.16, 0.24], [0.2, 0.32], { drive: 0.9 })],
    count: [3, 4],
    rasp: 0.75,
    formant: 1200,
    gain: 0.52,
  }),

  magpie: sung('call', {
    pitch: 1600,
    phrase: [s(1, 0.95, [0.45, 0.75], [0.5, 1.4], { drive: 0.9, trill: { hz: 26, cents: 200 } })],
    count: [1, 2],
    rasp: 0.65,
    formant: 2000,
    q: 1.5,
    gain: 0.5,
  }),

  // --- doves, game and waders ---------------------------------------------

  // Five notes, endlessly, and the third is the long one.
  woodpigeon: sung('body', {
    pitch: 480,
    variance: 0.04,
    phrase: [
      s(1, 1.04, [0.14, 0.18], [0.06, 0.09], { drive: 0.06 }),
      s(1.1, 1.06, [0.3, 0.4], [0.07, 0.1], { drive: 0.06, level: 1.1 }),
      s(1, 0.98, [0.16, 0.22], [0.06, 0.09], { drive: 0.06 }),
      s(1.02, 1, [0.15, 0.2], [0.06, 0.09], { drive: 0.06 }),
      s(0.94, 0.9, [0.12, 0.16], [0.9, 1.6], { drive: 0.06, level: 0.7 }),
    ],
    repeats: [2, 4],
    between: [0, 0],
    formant: 700,
    q: 2.6,
    fade: 1,
    gain: 0.5,
  }),

  pheasant: sung('call', {
    pitch: 900,
    variance: 0.06,
    phrase: [
      s(1, 0.88, [0.12, 0.16], [0.06, 0.09], { drive: 1 }),
      s(0.94, 0.8, [0.14, 0.2], [0.5, 1.2], { drive: 1 }),
    ],
    rasp: 0.85,
    formant: 1500,
    q: 1,
    gain: 0.65,
  }),

  woodpecker: sung('call', {
    pitch: 620,
    variance: 0.03,
    // A drum, not a call: a burst too fast to count, over in half a second.
    phrase: [s(1, 0.97, [0.42, 0.58], [2, 6], { drive: 1, trill: { hz: 19, cents: 40 } })],
    rasp: 0.8,
    formant: 900,
    q: 3,
    gain: 0.5,
  }),

  woodcock: sung('throat', {
    pitch: 420,
    // A grunt, then a squeak. Two entirely different sounds in one pass.
    phrase: [
      s(1, 0.9, [0.14, 0.2], [0.1, 0.16], { drive: 0.8 }),
      s(1, 0.88, [0.12, 0.18], [0.14, 0.2], { drive: 0.8 }),
      s(6.6, 7.4, [0.1, 0.15], [1, 2], { drive: 0.2, level: 0.6 }),
    ],
    rasp: 0.5,
    formant: 800,
    gain: 0.45,
  }),

  // The bubbling call: an accelerating trill that climbs the whole way.
  curlew: sung('song', {
    pitch: 1500,
    variance: 0.05,
    phrase: [
      s(1, 1.5, [0.5, 0.7], [0.05, 0.09], { drive: 0.14 }),
      s(1.5, 1.7, [0.3, 0.4], [0.03, 0.06], { drive: 0.18, trill: { hz: 9, cents: 120 } }),
      s(1.7, 1.9, [0.3, 0.45], [0.03, 0.05], { drive: 0.22, trill: { hz: 15, cents: 150 } }),
      s(1.9, 2.05, [0.4, 0.6], [1.5, 4], { drive: 0.28, trill: { hz: 24, cents: 170 } }),
    ],
    formant: 2600,
    q: 1.6,
    fade: 1,
    gain: 0.5,
  }),

  oystercatcher: sung('song', {
    pitch: 3000,
    phrase: [s(1, 1.02, [0.05, 0.07], [0.06, 0.11], { drive: 0.45 })],
    count: [5, 12],
    formant: 3200,
    fade: 0.99,
    gain: 0.45,
  }),

  heron: sung('throat', {
    pitch: 640,
    variance: 0.06,
    phrase: [s(1, 0.82, [0.3, 0.42], [0.9, 2], { drive: 1 })],
    count: [1, 2],
    rasp: 0.85,
    formant: 1000,
    gain: 0.6,
  }),

  duck: sung('call', {
    pitch: 900,
    variance: 0.09,
    // The descending series is the female; each one lower than the last.
    phrase: [
      s(1, 0.9, [0.1, 0.14], [0.09, 0.14], { drive: 0.9 }),
      s(0.92, 0.84, [0.1, 0.14], [0.1, 0.15], { drive: 0.9 }),
      s(0.85, 0.77, [0.1, 0.15], [0.11, 0.17], { drive: 0.9 }),
      s(0.78, 0.7, [0.11, 0.16], [0.5, 1.2], { drive: 0.9 }),
    ],
    rasp: 0.7,
    formant: 1400,
    gain: 0.5,
  }),

  moorhen: sung('call', {
    pitch: 1500,
    phrase: [s(1, 0.8, [0.1, 0.15], [0.6, 1.8], { drive: 0.95 })],
    count: [1, 2],
    rasp: 0.6,
    formant: 1900,
    gain: 0.5,
  }),

  // The long wailing series. The most beach sound there is.
  gull: sung('call', {
    pitch: 1600,
    variance: 0.07,
    phrase: [
      s(0.86, 1.18, [0.24, 0.34], [0.14, 0.22], { drive: 0.5, bend: { at: 0.3, to: 1.24 } }),
      s(1.14, 0.92, [0.28, 0.4], [0.16, 0.26], { drive: 0.55 }),
      s(1.06, 0.86, [0.3, 0.44], [0.18, 0.3], { drive: 0.55 }),
    ],
    count: [4, 8],
    rasp: 0.35,
    formant: 2000,
    q: 1.3,
    fade: 0.97,
    gain: 0.55,
  }),

  kittiwake: sung('song', {
    pitch: 2200,
    phrase: [
      s(1, 1.08, [0.12, 0.17], [0.05, 0.08], { drive: 0.5 }),
      s(0.86, 0.86, [0.1, 0.14], [0.05, 0.08], { drive: 0.5 }),
      s(1.16, 1.02, [0.18, 0.26], [0.5, 1.4], { drive: 0.55 }),
    ],
    repeats: [1, 3],
    between: [0.25, 0.5],
    rasp: 0.3,
    formant: 2600,
    gain: 0.42,
  }),

  // --- night ---------------------------------------------------------------

  // The hoot: a note, a gap, then the long tremulous one.
  owl: sung('body', {
    pitch: 480,
    variance: 0.04,
    phrase: [
      s(1, 0.97, [0.35, 0.5], [0.35, 0.6], { drive: 0.05 }),
      s(0.99, 0.96, [0.1, 0.14], [0.16, 0.24], { drive: 0.05, level: 0.5 }),
      s(1, 0.94, [0.8, 1.2], [2, 5], { drive: 0.06, trill: { hz: 7.5, cents: 45 } }),
    ],
    formant: 620,
    q: 3.2,
    fade: 1,
    gain: 0.55,
  }),

  // The other bird answering. A different call entirely, which is the point.
  'owl-answer': sung('call', {
    pitch: 1300,
    variance: 0.05,
    phrase: [s(1, 1.35, [0.16, 0.24], [0.8, 2], { drive: 0.5 })],
    rasp: 0.35,
    formant: 1800,
    gain: 0.5,
  }),

  // A churr: a pulse train, not a note. Mechanical, and unmistakable for it.
  nightjar: sung('call', {
    pitch: 1750,
    variance: 0.02,
    phrase: [
      s(1, 1.03, [3, 7], [0.2, 0.4], { drive: 0.6, trill: { hz: 31, cents: 260 } }),
      s(0.92, 0.9, [2, 5], [4, 12], { drive: 0.6, trill: { hz: 28, cents: 260 } }),
    ],
    count: [1, 2],
    rasp: 0.2,
    formant: 1900,
    q: 1.4,
    fade: 1,
    gain: 0.34,
  }),

  fox: sung('call', {
    pitch: 850,
    variance: 0.08,
    phrase: [s(1, 1.22, [0.4, 0.6], [0.7, 1.6], { drive: 0.9, bend: { at: 0.25, to: 1.3 } })],
    count: [2, 4],
    rasp: 0.55,
    formant: 1500,
    q: 1.1,
    fade: 0.9,
    gain: 0.6,
  }),

  bats: sung('air', {
    pitch: 7200,
    variance: 0.2,
    phrase: [s(1, 0.9, [0.006, 0.012], [0.02, 0.09], { drive: 0.7 })],
    count: [4, 14],
    rasp: 0.5,
    formant: 8000,
    q: 2,
    gain: 0.28,
  }),

  // --- kept animals ---------------------------------------------------------

  dog: beast('throat', { kind: 'dog', gain: 0.6 }),
  cow: beast('body', { kind: 'cow', gain: 0.6 }),
  sheep: beast('throat', { kind: 'sheep', gain: 0.55 }),
  pig: beast('throat', { kind: 'pig', gain: 0.55 }),
  hen: beast('call', { kind: 'fowl', gain: 0.5 }),
  // Bigger throat than a hen and driven harder.
  cockerel: beast('call', { kind: 'fowl', tone: 0.78, gain: 0.6, rasp: 0.15 }),
  goose: beast('call', { kind: 'fowl', tone: 0.55, gain: 0.7, rasp: 0.25 }),
  // A long tract, and the vibrato does the rest.
  horse: beast('throat', { kind: 'sheep', tone: 0.62, gain: 0.6, rasp: 0.3 }),
  deer: beast('throat', { kind: 'dog', tone: 0.7, gain: 0.55, rasp: 0.2 }),
  stag: beast('body', { kind: 'cow', tone: 0.72, gain: 0.7, rasp: 0.3 }),
  seal: beast('body', { kind: 'cow', tone: 0.85, gain: 0.55, rasp: 0.35 }),
  rat: sung('air', {
    pitch: 5200,
    variance: 0.18,
    phrase: [s(1, 1.3, [0.02, 0.04], [0.05, 0.12], { drive: 0.6 })],
    count: [2, 6],
    rasp: 0.4,
    formant: 5600,
    gain: 0.3,
  }),
  mouse: sung('air', {
    pitch: 6800,
    variance: 0.15,
    phrase: [s(1, 1.2, [0.012, 0.025], [0.04, 0.1], { drive: 0.5 })],
    count: [2, 5],
    rasp: 0.35,
    formant: 7000,
    gain: 0.22,
  }),
  // The foot, not the voice.
  rabbit: thing('body', { material: 'stone', tone: 0.55, pieces: 1, heft: 0.95, gain: 0.35 }),
  frog: beast('throat', { kind: 'pig', tone: 1.5, gain: 0.4, rasp: 0.2 }),
  toad: beast('throat', { kind: 'pig', tone: 1.25, gain: 0.38, rasp: 0.15 }),

  // --- insects --------------------------------------------------------------
  //
  // Stridulation is a pulse train through a sharp resonance, which is what a
  // hard trill on a nearly pure source already is. Their own model comes later.

  cricket: sung('song', {
    pitch: 4600,
    variance: 0.02,
    phrase: [s(1, 1, [0.02, 0.028], [0.02, 0.03], { drive: 0.08 })],
    count: [3, 5],
    formant: 4600,
    q: 8,
    fade: 1,
    gain: 0.3,
  }),

  grasshopper: sung('air', {
    pitch: 5200,
    phrase: [s(1, 1, [0.5, 1.4], [1.5, 5], { drive: 0.5, trill: { hz: 48, cents: 60 } })],
    rasp: 0.85,
    formant: 5600,
    q: 1.2,
    gain: 0.26,
  }),

  bee: sung('throat', {
    pitch: 220,
    variance: 0.08,
    phrase: [s(1, 0.96, [0.8, 2.2], [0.3, 1.2], { drive: 0.75, trill: { hz: 5, cents: 55 } })],
    count: [1, 3],
    rasp: 0.2,
    formant: 660,
    q: 2.4,
    gain: 0.28,
  }),

  wasp: sung('throat', {
    pitch: 260,
    variance: 0.1,
    phrase: [s(1, 1.06, [0.5, 1.4], [0.4, 1.4], { drive: 0.85, trill: { hz: 7, cents: 90 } })],
    rasp: 0.3,
    formant: 800,
    q: 2,
    gain: 0.26,
  }),

  fly: sung('call', {
    pitch: 420,
    variance: 0.14,
    phrase: [s(1, 1.15, [0.25, 0.9], [0.15, 0.6], { drive: 0.8, trill: { hz: 11, cents: 140 } })],
    count: [2, 5],
    rasp: 0.25,
    formant: 1300,
    q: 1.8,
    gain: 0.22,
  }),

  midge: sung('air', {
    pitch: 720,
    variance: 0.1,
    phrase: [s(1, 1.1, [0.4, 1.2], [0.4, 1.4], { drive: 0.55, trill: { hz: 9, cents: 120 } })],
    formant: 2200,
    q: 2.2,
    gain: 0.16,
  }),

  dragonfly: sung('call', {
    pitch: 95,
    phrase: [s(1, 1.05, [0.4, 0.9], [0.5, 1.5], { drive: 0.9, trill: { hz: 33, cents: 180 } })],
    rasp: 0.4,
    formant: 1600,
    q: 1.2,
    gain: 0.2,
  }),

  // --- people ---------------------------------------------------------------

  call: said('call', { gain: 0.45 }),
  shout: said('call', { gain: 0.6, pitch: 210 }),
  laugh: said('throat', { gain: 0.4, pitch: 200 }),
  cough: said('throat', { gain: 0.3, tone: 0.95 }),
  chatter: said('throat', { gain: 0.3, pitch: 175 }),
  // Through a horn and a bad amplifier: the words never arrive, and that is
  // the whole effect.
  tannoy: said('call', { gain: 0.5, pitch: 150, tone: 0.85, lect: 'city' }),

  hum: sung('throat', {
    pitch: 220,
    variance: 0.03,
    phrase: [
      s(1, 1.12, [0.5, 0.8], [0.06, 0.14], { drive: 0.1 }),
      s(1.12, 1, [0.4, 0.7], [0.06, 0.16], { drive: 0.1 }),
      s(0.9, 0.94, [0.6, 1], [0.5, 1.4], { drive: 0.1 }),
    ],
    count: [3, 7],
    formant: 500,
    q: 2.8,
    fade: 1,
    gain: 0.3,
  }),

  whistle: sung('song', {
    pitch: 1300,
    variance: 0.04,
    phrase: [
      s(1, 1.12, [0.18, 0.3], [0.05, 0.12], { drive: 0.03 }),
      s(1.12, 1.34, [0.16, 0.26], [0.05, 0.12], { drive: 0.03 }),
      s(1.26, 1, [0.24, 0.4], [0.1, 0.3], { drive: 0.03 }),
      s(0.9, 0.86, [0.3, 0.5], [0.4, 1.2], { drive: 0.03 }),
    ],
    count: [4, 9],
    formant: 1500,
    q: 4,
    fade: 1,
    gain: 0.3,
  }),

  // --- things handled --------------------------------------------------------

  wood: thing('call', { material: 'wood', gain: 0.45 }),
  pot: thing('call', { material: 'pot', gain: 0.45 }),
  metal: thing('call', { material: 'metal', gain: 0.45 }),
  stone: thing('throat', { material: 'stone', gain: 0.45 }),
  coins: thing('song', { material: 'metal', tone: 2.4, pieces: 12, heft: 0.15, gain: 0.3 }),
  paper: thing('air', { material: 'wood', tone: 3.2, pieces: 14, heft: 0.1, gain: 0.18 }),
  latch: thing('call', { material: 'metal', tone: 1.4, pieces: 2, heft: 0.8, gain: 0.4 }),
  hinge: thing('call', { material: 'metal', tone: 0.8, pieces: 1, heft: 0.7, gain: 0.35 }),
  whetstone: thing('song', { material: 'stone', tone: 3, pieces: 3, heft: 0.2, gain: 0.3 }),
  thump: thing('body', { material: 'stone', tone: 0.45, pieces: 1, heft: 1, gain: 0.5 }),
  grit: thing('air', { material: 'stone', tone: 3.4, pieces: 16, heft: 0.05, gain: 0.2 }),
  slab: thing('body', { material: 'stone', tone: 0.4, pieces: 3, heft: 0.9, gain: 0.55 }),
  rockfall: thing('body', { material: 'stone', tone: 0.5, pieces: 30, heft: 0.7, gain: 0.7 }),
  // A pigeon leaving a tree: a burst of small soft contacts and no ring at all.
  wings: thing('call', { material: 'wood', tone: 1.8, pieces: 18, heft: 0.12, gain: 0.35 }),
  embers: thing('body', { material: 'wood', tone: 0.7, pieces: 7, heft: 0.08, gain: 0.22 }),

  // --- water -----------------------------------------------------------------

  drip: drop('song', { gain: 0.5 }),
  plop: drop('call', { radius: [0.004, 0.007], cycles: 26, tick: 0.5, gain: 0.5 }),
  splash: drop('call', { radius: [0.006, 0.02], cycles: 12, tick: 0.9, gain: 0.6 }),

  // --- signals and soundmarks -------------------------------------------------

  'bell-church': rung('body', { hz: 168, decay: 16, strokes: 1, gain: 0.55 }),
  'bell-hand': rung('song', { hz: 880, decay: 3.2, strokes: 3, interval: 0.34, gain: 0.4 }),
  'bell-shop': rung('song', { hz: 1150, decay: 1.8, strokes: 2, interval: 0.16, gain: 0.35 }),
  // Rung by the sea, so it is one stroke and a long tail.
  'bell-buoy': rung('body', { hz: 300, decay: 9, strokes: 1, warble: 2.2, gain: 0.45 }),
  bowl: rung('song', { hz: 520, decay: 11, strokes: 1, warble: 1.6, strike: 0.2, gain: 0.4 }),

  klaxon: sung('call', {
    pitch: 330,
    variance: 0.01,
    phrase: [
      s(1, 1, [0.7, 0.9], [0.25, 0.35], { drive: 0.95 }),
      s(1, 1, [0.7, 0.9], [1.5, 2.5], { drive: 0.95 }),
    ],
    repeats: [2, 3],
    between: [0, 0],
    rasp: 0.15,
    formant: 1000,
    q: 2,
    fade: 1,
    gain: 0.5,
  }, false),

  foghorn: sung('body', {
    pitch: 120,
    variance: 0.01,
    phrase: [s(1, 0.98, [2.4, 3.2], [8, 14], { drive: 0.7 })],
    rasp: 0.1,
    formant: 260,
    q: 2.6,
    gain: 0.6,
  }, false),

  press: struck('body', { tone: 0.35, damping: 0.75, bounces: 0, gain: 0.7 }),
  steam: sung('air', {
    pitch: 2600,
    phrase: [s(1, 0.42, [0.9, 1.8], [2, 6], { drive: 1 })],
    rasp: 1,
    formant: 4200,
    q: 0.7,
    gain: 0.45,
  }, false),
  relay: thing('call', { material: 'metal', tone: 2.2, pieces: 1, heft: 0.9, gain: 0.22 }),
  contactor: thing('body', { material: 'metal', tone: 0.55, pieces: 2, heft: 0.95, gain: 0.45 }),
  tick: thing('song', { material: 'wood', tone: 2.8, pieces: 1, heft: 0.9, gain: 0.16 }),
  crack: thing('song', { material: 'wood', tone: 2.2, pieces: 1, heft: 0.85, gain: 0.2 }),
};
