import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { createCall, type CallShape, type Syllable } from '../oneshots/call';
import { createBeast, type BeastOptions } from '../oneshots/beast';
import { createVessel, type VesselOptions } from '../oneshots/vessel';
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
const BEAST_GAIN = 0.55;
const VESSEL_GAIN = 0.45;
const THING_GAIN = 0.45;
const FLOW_GAIN = 0.45;
const DROPLET_GAIN = 0.5;

const sung = (band: Band, shape: CallShape, alive = true, tone = 1): VoiceEntry => ({
  band,
  db: 0,
  alive,
  build: (engine) => createCall(engine, { shape, tone, gain: CALL_GAIN }),
});

const beast = (band: Band, options: BeastOptions): VoiceEntry => ({
  band,
  db: 0,
  alive: true,
  build: (engine) => createBeast(engine, { ...options, gain: BEAST_GAIN }),
});

const held = (band: Band, options: VesselOptions): VoiceEntry => ({
  band,
  db: 0,
  alive: false,
  build: (engine) => createVessel(engine, { ...options, gain: VESSEL_GAIN }),
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
    phrase: [
      s(0.9, 1.05, [0.05, 0.09], [0.02, 0.04], { drive: 0.3 }),
      s(1.12, 0.96, [0.05, 0.08], [0.02, 0.04], { drive: 0.3 }),
      s(1.28, 1.34, [0.12, 0.2], [0.03, 0.05], { drive: 0.15, level: 1.1 }),
    ],
    count: [6, 12],
    formant: 3100,
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
  }),

  meadowpipit: sung('song', {
    pitch: 4600,
    phrase: [s(1, 0.985, [0.03, 0.045], [0.045, 0.075], { drive: 0.25 })],
    count: [6, 14],
    formant: 4600,
    fade: 0.97,
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
  }),

  sparrow: sung('song', {
    pitch: 3200,
    variance: 0.14,
    phrase: [s(1, 0.94, [0.05, 0.08], [0.12, 0.26], { drive: 0.45 })],
    count: [2, 5],
    rasp: 0.22,
    formant: 3000,
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
  }),

  wagtail: sung('song', {
    pitch: 4000,
    phrase: [
      s(1, 1.1, [0.03, 0.045], [0.05, 0.08], { drive: 0.4 }),
      s(1.06, 0.96, [0.03, 0.045], [0.4, 1.2], { drive: 0.4 }),
    ],
    formant: 3900,
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
  }),

  kingfisher: sung('song', {
    pitch: 4800,
    phrase: [s(1, 1.04, [0.06, 0.09], [0.1, 0.2], { drive: 0.3 })],
    count: [1, 3],
    formant: 4800,
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
  }),

  rook: sung('throat', {
    pitch: 900,
    variance: 0.12,
    phrase: [s(1, 0.9, [0.18, 0.28], [0.22, 0.4], { drive: 0.85 })],
    count: [2, 4],
    rasp: 0.7,
    formant: 1300,
  }),

  crow: sung('throat', {
    pitch: 800,
    variance: 0.1,
    phrase: [s(1, 0.93, [0.16, 0.24], [0.2, 0.32], { drive: 0.9 })],
    count: [3, 4],
    rasp: 0.75,
    formant: 1200,
  }),

  magpie: sung('call', {
    pitch: 1600,
    phrase: [s(1, 0.95, [0.45, 0.75], [0.5, 1.4], { drive: 0.9, trill: { hz: 26, cents: 200 } })],
    count: [1, 2],
    rasp: 0.65,
    formant: 2000,
    q: 1.5,
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
  }),

  woodpecker: sung('call', {
    pitch: 620,
    variance: 0.03,
    // A drum, not a call: a burst too fast to count, over in half a second.
    phrase: [s(1, 0.97, [0.42, 0.58], [2, 6], { drive: 1, trill: { hz: 19, cents: 40 } })],
    rasp: 0.8,
    formant: 900,
    q: 3,
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
  }),

  oystercatcher: sung('song', {
    pitch: 3000,
    phrase: [s(1, 1.02, [0.05, 0.07], [0.06, 0.11], { drive: 0.45 })],
    count: [5, 12],
    formant: 3200,
    fade: 0.99,
  }),

  heron: sung('throat', {
    pitch: 640,
    variance: 0.06,
    phrase: [s(1, 0.82, [0.3, 0.42], [0.9, 2], { drive: 1 })],
    count: [1, 2],
    rasp: 0.85,
    formant: 1000,
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
  }),

  moorhen: sung('call', {
    pitch: 1500,
    phrase: [s(1, 0.8, [0.1, 0.15], [0.6, 1.8], { drive: 0.95 })],
    count: [1, 2],
    rasp: 0.6,
    formant: 1900,
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
  }),

  // The other bird answering. A different call entirely, which is the point.
  'owl-answer': sung('call', {
    pitch: 1300,
    variance: 0.05,
    phrase: [s(1, 1.35, [0.16, 0.24], [0.8, 2], { drive: 0.5 })],
    rasp: 0.35,
    formant: 1800,
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
  }),


  bats: sung('air', {
    pitch: 7200,
    variance: 0.2,
    phrase: [s(1, 0.9, [0.006, 0.012], [0.02, 0.09], { drive: 0.7 })],
    count: [4, 14],
    rasp: 0.5,
    formant: 8000,
    q: 2,
  }),

  // --- kept animals ---------------------------------------------------------

  dog: beast('throat', { kind: 'dog' }),
  cow: beast('body', { kind: 'cow' }),
  sheep: beast('throat', { kind: 'sheep' }),
  pig: beast('throat', { kind: 'pig' }),
  hen: beast('call', { kind: 'fowl' }),
  // Bigger throat than a hen and driven harder.
  cockerel: beast('call', { kind: 'fowl', tone: 0.78, rasp: 0.15 }),
  goose: beast('call', { kind: 'fowl', tone: 0.55, rasp: 0.25, chaos: 0.2 }),
  // A long tract, and the vibrato does the rest.
  horse: beast('throat', { kind: 'sheep', tone: 0.62, rasp: 0.3, chaos: 0.2 }),
  deer: beast('throat', { kind: 'dog', tone: 0.7, rasp: 0.2 }),
  fox: beast('call', { kind: 'fox' }),
  stag: beast('body', { kind: 'stag' }),
  seal: beast('body', { kind: 'cow', tone: 0.85, rasp: 0.35, chaos: 0.3 }),
  rat: sung('air', {
    pitch: 5200,
    variance: 0.18,
    phrase: [s(1, 1.3, [0.02, 0.04], [0.05, 0.12], { drive: 0.6 })],
    count: [2, 6],
    rasp: 0.4,
    formant: 5600,
  }),
  mouse: sung('air', {
    pitch: 6800,
    variance: 0.15,
    phrase: [s(1, 1.2, [0.012, 0.025], [0.04, 0.1], { drive: 0.5 })],
    count: [2, 5],
    rasp: 0.35,
    formant: 7000,
  }),
  // The foot, not the voice.
  rabbit: thing('body', { material: 'oak', size: 0.6, striker: 0.2, ring: 0.5 }),
  frog: beast('throat', { kind: 'pig', tone: 1.5, rasp: 0.2 }),
  toad: beast('throat', { kind: 'pig', tone: 1.25, rasp: 0.15 }),

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
  }),

  grasshopper: sung('air', {
    pitch: 5200,
    phrase: [s(1, 1, [0.5, 1.4], [1.5, 5], { drive: 0.5, trill: { hz: 48, cents: 60 } })],
    rasp: 0.85,
    formant: 5600,
    q: 1.2,
  }),

  bee: sung('throat', {
    pitch: 220,
    variance: 0.08,
    phrase: [s(1, 0.96, [0.8, 2.2], [0.3, 1.2], { drive: 0.75, trill: { hz: 5, cents: 55 } })],
    count: [1, 3],
    rasp: 0.2,
    formant: 660,
    q: 2.4,
  }),

  wasp: sung('throat', {
    pitch: 260,
    variance: 0.1,
    phrase: [s(1, 1.06, [0.5, 1.4], [0.4, 1.4], { drive: 0.85, trill: { hz: 7, cents: 90 } })],
    rasp: 0.3,
    formant: 800,
    q: 2,
  }),

  fly: sung('call', {
    pitch: 420,
    variance: 0.14,
    phrase: [s(1, 1.15, [0.25, 0.9], [0.15, 0.6], { drive: 0.8, trill: { hz: 11, cents: 140 } })],
    count: [2, 5],
    rasp: 0.25,
    formant: 1300,
    q: 1.8,
  }),

  midge: sung('air', {
    pitch: 720,
    variance: 0.1,
    phrase: [s(1, 1.1, [0.4, 1.2], [0.4, 1.4], { drive: 0.55, trill: { hz: 9, cents: 120 } })],
    formant: 2200,
    q: 2.2,
  }),

  dragonfly: sung('call', {
    pitch: 95,
    phrase: [s(1, 1.05, [0.4, 0.9], [0.5, 1.5], { drive: 0.9, trill: { hz: 33, cents: 180 } })],
    rasp: 0.4,
    formant: 1600,
    q: 1.2,
  }),

  // --- people ---------------------------------------------------------------

  // --- people ---------------------------------------------------------------
  //
  // **No speech.** Nobody talks in the ambience: a voice is a person, a person
  // is somebody you can walk up to, and that is the creature system's job. What
  // is left here is wordless and tuneful — a whistle carrying across a yard is
  // a sound the place makes, and a conversation is not.

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
  }),

  // --- things handled --------------------------------------------------------

  wood: thing('call', { material: 'oak', size: 0.8, striker: 0.5 }),
  // Vessels, which have an inside: the air in them is a note of its own and it
  // climbs as they fill.
  pot: held('call', { kind: 'pot', handling: 'set-down', full: 0.25 }),
  pail: held('call', { kind: 'pail', handling: 'set-down', full: 0.4 }),
  'pail-fill': held('body', { kind: 'pail', handling: 'fill', full: 0.05 }),
  'pail-pour': held('body', { kind: 'pail', handling: 'pour', full: 0.8 }),
  churn: held('body', { kind: 'churn', handling: 'knock', full: 0.5 }),
  trough: held('body', { kind: 'trough', handling: 'fill', full: 0.2 }),
  jar: held('song', { kind: 'jar', handling: 'set-down', full: 0.3 }),
  metal: thing('call', { material: 'iron', size: 1.1, striker: 0.85 }),
  stone: thing('throat', { material: 'stone', size: 0.9, striker: 0.8 }),
  coins: thing('song', { material: 'brass', size: 3.4, striker: 0.9, hits: [3, 6], spacing: [0.03, 0.07] }),
  paper: thing('air', { material: 'pine', size: 3.6, striker: 0.15, ring: 0.3, hits: [2, 4] }),
  // Two contacts, accelerating: the bolt, then the catch.
  latch: thing('call', { material: 'iron', size: 1.9, striker: 0.9, ring: 0.4, hits: [2, 2], spacing: [0.05, 0.09] }),
  hinge: thing('call', { material: 'iron', size: 1.3, striker: 0.35, ring: 0.6 }),
  whetstone: thing('song', { material: 'stone', size: 2.6, striker: 0.7, hits: [2, 4], spacing: [0.11, 0.2] }),
  thump: thing('body', { material: 'oak', size: 0.4, striker: 0.2, ring: 0.7 }),
  slab: thing('body', { material: 'stone', size: 0.45, striker: 0.85 }),
  press: thing('body', { material: 'iron', size: 0.35, striker: 1, ring: 0.5 }),
  relay: thing('call', { material: 'iron', size: 2.6, striker: 1, ring: 0.25, hits: [1, 2], spacing: [0.02, 0.04] }),
  contactor: thing('body', { material: 'iron', size: 0.7, striker: 1, ring: 0.4, hits: [1, 2], spacing: [0.03, 0.05] }),
  tick: thing('song', { material: 'brass', size: 3, striker: 1, ring: 0.12 }),
  crack: thing('song', { material: 'pine', size: 2.2, striker: 1, ring: 0.35 }),

  // --- loose material, which arrives over a span and keeps finding stragglers
  grit: loose('air', { kind: 'grit' }),
  slip: loose('throat', { kind: 'scree', amount: 0.7 }),
  rockfall: loose('body', { kind: 'rubble', amount: 1.3 }),
  embers: loose('body', { kind: 'ember', amount: 0.6 }),
  // A pigeon leaving a tree: soft, broad, and no ring at all.
  wings: loose('call', { kind: 'feather' }),
  rabble: loose('throat', { kind: 'gravel' }),

  // --- water -----------------------------------------------------------------

  // The cavity is what makes a drip say how big the room is, so the ones that
  // fall indoors get one and the ones outdoors do not.
  drip: wet('song', { kind: 'drip', cavity: 130, room: 0.55 }),
  plop: wet('call', { kind: 'rise' }),
  splash: wet('call', { kind: 'splash' }),
  patter: wet('air', { kind: 'patter' }),

  // --- signals and soundmarks -------------------------------------------------

  // Bells are a shell whose partials are deliberately not harmonic, and a
  // tower bell swings, so it also turns its mouth toward you and away. Neither
  // is a struck bar. Standing in as long metal until they have their own model.
  'bell-church': thing('body', { material: 'brass', size: 0.32, striker: 0.9, ring: 3.5 }),
  'bell-hand': thing('song', { material: 'brass', size: 1.7, striker: 0.9, ring: 1.4, hits: [3, 3], spacing: [0.3, 0.38] }),
  'bell-shop': thing('song', { material: 'brass', size: 2.4, striker: 1, ring: 0.8, hits: [2, 2], spacing: [0.14, 0.19] }),
  'bell-buoy': thing('body', { material: 'brass', size: 0.6, striker: 0.75, ring: 2.4 }),
  bowl: thing('song', { material: 'brass', size: 1.1, striker: 0.4, ring: 3 }),

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
  }, false),

  foghorn: sung('body', {
    pitch: 120,
    variance: 0.01,
    phrase: [s(1, 0.98, [2.4, 3.2], [8, 14], { drive: 0.7 })],
    rasp: 0.1,
    formant: 260,
    q: 2.6,
  }, false),

  steam: sung('air', {
    pitch: 2600,
    phrase: [s(1, 0.42, [0.9, 1.8], [2, 6], { drive: 1 })],
    rasp: 1,
    formant: 4200,
    q: 0.7,
  }, false),
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
  'bell-buoy': -10,
  foghorn: -8,
  klaxon: -9,
  'bell-hand': -13,
  'bell-shop': -17,
  bowl: -15,

  // --- signals: meant to be listened to -----------------------------------
  jay: -14,
  pheasant: -14,
  goose: -13,
  rockfall: -12,
  press: -13,
  steam: -16,
  contactor: -17,

  // --- animals near enough to matter --------------------------------------
  dog: -17,
  cow: -17,
  stag: -16,
  fox: -17,
  sheep: -19,
  pig: -20,
  horse: -19,
  seal: -19,
  cockerel: -18,
  heron: -18,
  raven: -19,
  crow: -20,
  rook: -20,
  magpie: -20,
  gull: -18,
  hen: -22,
  deer: -21,
  duck: -21,
  moorhen: -22,
  kittiwake: -21,
  oystercatcher: -22,
  woodpigeon: -21,
  owl: -19,
  'owl-answer': -21,
  woodcock: -23,
  curlew: -19,
  nightjar: -25,

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
  skylark: -26,
  yellowhammer: -25,
  whitethroat: -25,
  stonechat: -25,
  meadowpipit: -26,
  linnet: -26,
  sparrow: -25,
  swallow: -25,
  swift: -22,
  wagtail: -26,
  reedwarbler: -25,
  cuckoo: -20,
  kingfisher: -23,
  woodpecker: -19,
  'wren-scold': -24,

  // --- people -------------------------------------------------------------
  hum: -25,
  whistle: -23,

  // --- things handled -----------------------------------------------------
  pail: -20,
  'pail-fill': -21,
  'pail-pour': -21,
  churn: -21,
  trough: -22,
  jar: -22,
  pot: -21,
  wood: -21,
  metal: -20,
  stone: -21,
  coins: -25,
  paper: -30,
  latch: -22,
  hinge: -23,
  whetstone: -23,
  thump: -20,
  grit: -28,
  slip: -22,
  rabble: -23,
  slab: -19,
  wings: -22,
  embers: -28,
  relay: -28,
  tick: -30,
  crack: -26,

  // --- water --------------------------------------------------------------
  drip: -22,
  plop: -23,
  splash: -20,
  patter: -27,

  // --- the small and the far ----------------------------------------------
  rat: -28,
  mouse: -32,
  rabbit: -25,
  bats: -30,
  frog: -24,
  toad: -25,
  cricket: -28,
  grasshopper: -29,
  bee: -26,
  wasp: -27,
  fly: -28,
  midge: -33,
  dragonfly: -29,
};

/** Anything the table does not name. Deliberately quiet. */
const DEFAULT_DB = -24;

for (const [name, entry] of Object.entries(VOICES)) {
  entry.db = DB[name as AmbienceVoice] ?? DEFAULT_DB;
}

/** Every name, for the dev panel's picker. */
export const AMBIENCE_VOICES = Object.keys(VOICES) as readonly AmbienceVoice[];
