/**
 * The villager writer: a score of syllables into gestures for a throat.
 *
 * Everything above this line is `audio/speech` and unchanged — words become
 * syllables, punctuation becomes pauses, a sentence has a shape. Everything
 * below it is physical: where the jaw is, how open the folds are, what is
 * touching what. This is the only place the two meet, and it is the only place
 * that knows what a vowel is.
 *
 * Consonants are written *before* the vowel comes on, because that is when
 * they happen: a stop is a closure that has already been made by the time you
 * hear it open. Every key on a track is written in time order, so the worklet
 * can walk them forward and never look back.
 */

import type { Coda, Onset, Place, Score, Syllable, Tone, Vowel } from '../speech';
import { CURVE, type Curve, type Track } from './body';

export interface Unit {
  at: number;
  length: number;
  from: number;
  to: number;
  stress: number;
}

/**
 * A mouth shape: how far the jaw is down, where along the tract the tongue
 * humps and how tight it is, and how far the lips are open. Tuned against the
 * formant tables in `dsp/formant` as a reference and then left to the tube —
 * these are positions, not frequencies, and the frequencies are what the tube
 * makes of them.
 */
interface Shape {
  jaw: number;
  bodyPos: number;
  bodyDia: number;
  lips: number;
}

/**
 * **No posture that is held may go below this**, tongue or lips.
 *
 * The worklet makes turbulence wherever the tube is narrower than `HISS_AT`
 * (0.45), and it is right to: that is what a fricative is. But a rounded lip
 * and a humped tongue are nowhere near that tight in a real mouth, so a vowel
 * target under it comes out as a vowel with a hiss laid over it. Only the
 * fricatives, a liquid, and a stop passing through on its way open may cross.
 */
const NO_HISS = 0.55;
/**
 * A liquid's gap. Under the hiss threshold, on purpose: an `l` is a closed
 * midline with the air going round the sides, and a wider gap is not heard
 * as anything. What noise this makes is a whisper under a full voice.
 */
const LIQUID = 0.36;
/** A fricative's gap, and the wider one a lateral hiss is forced through. */
const FRIC = 0.16;
const LATERAL = 0.26;

const SHAPES: Record<Vowel, Shape> = {
  // Open jaw, tongue back and low: a narrow pharynx under a wide mouth.
  a: { jaw: 0.95, bodyPos: 0.12, bodyDia: 0.62, lips: 1.4 },
  e: { jaw: 0.55, bodyPos: 0.72, bodyDia: 1.0, lips: 1.35 },
  i: { jaw: 0.22, bodyPos: 0.92, bodyDia: NO_HISS, lips: 1.45 },
  o: { jaw: 0.58, bodyPos: 0.24, bodyDia: 0.85, lips: 0.7 },
  u: { jaw: 0.24, bodyPos: 0.3, bodyDia: 0.6, lips: NO_HISS },
  schwa: { jaw: 0.45, bodyPos: 0.55, bodyDia: 1.15, lips: 1.1 },
  // The far side of the chart: an i with the lips rounded, a u with them
  // spread, and the ones between.
  'ü': { jaw: 0.22, bodyPos: 0.92, bodyDia: NO_HISS, lips: 0.62 },
  'ɯ': { jaw: 0.24, bodyPos: 0.3, bodyDia: 0.6, lips: 1.4 },
  'ø': { jaw: 0.5, bodyPos: 0.72, bodyDia: 1.0, lips: 0.68 },
  'æ': { jaw: 0.8, bodyPos: 0.7, bodyDia: 0.85, lips: 1.4 },
  'ɑ': { jaw: 0.9, bodyPos: 0.04, bodyDia: NO_HISS, lips: 1.3 },
  'ɨ': { jaw: 0.25, bodyPos: 0.6, bodyDia: NO_HISS, lips: 1.4 },
  'ɤ': { jaw: 0.55, bodyPos: 0.24, bodyDia: 0.85, lips: 1.35 },
};

/** Where the tongue tip sits for a vowel: out of the way. */
const TIP_OPEN = 1.5;
/** Where the tongue body goes for a velar, and for the pharynx. */
const VELAR = 0.34;
const UVULA = 0.2;
const PHARYNX = 0;

/** How long a closure is held, by where it is made. Lips take the longest. */
const CLOSURE: Record<Place, number> = { lip: 0.075, ridge: 0.058, back: 0.055, throat: 0.055 };
/** Silence between the burst and the voice. */
const VOT = 0.018;
/** An ejective's silence: the folds are shut too, and open late. */
const EJECT = 0.06;
/**
 * How long an articulator takes to shut, and to let go. The tube hisses for
 * as long as a gap is narrow and it has no pressure to run out of, so a
 * release that is not quick is a fricative. Every closure below is written
 * still → shut → held → open, never as one ramp from shut to open.
 */
const CLOSE = 0.045;
const OPEN = 0.012;

/** A trill's beat, by what is trilling. Lips are heavier than the tip. */
const TRILL_PERIOD: Record<Place, number> = { lip: 0.045, ridge: 0.036, back: 0.038, throat: 0.038 };
const TRILL_BEATS = 3;

/** Onsets the voice does not run into from the vowel before. */
const UNVOICED = new Set<Onset>(['hiss', 'hush', 'breath', 'glottal', 'ejective', 'click', 'whisperNasal', 'lateral']);
/** Onsets that write their own breath into the start of the vowel. */
const BREATHED = new Set<Onset>(['hiss', 'hush', 'breath', 'lateral', 'whisperNasal', 'murmur']);
/** Onsets whose voice comes on all at once. */
const ABRUPT = new Set<Onset>(['glottal', 'ejective', 'click']);

/**
 * A syllable's own tone as a pitch shape: fractions of the vowel and the
 * multiple of the target there. `level` leaves it to the stress.
 */
const TONES: Record<Tone, readonly (readonly [number, number])[] | null> = {
  level: null,
  high: [[0.3, 1.24], [1, 1.2]],
  low: [[0.3, 0.84], [1, 0.78]],
  rise: [[0.25, 0.88], [1, 1.3]],
  fall: [[0.2, 1.3], [1, 0.8]],
  dip: [[0.15, 0.95], [0.5, 0.76], [1, 1.18]],
};

/** How far past the vowel a coda runs before the next syllable may start. */
const CODA_TAIL: Record<Coda, number> = { open: 0, stop: 0, nasal: 0, glottal: 0.02, trill: 0.08, lateral: 0.06, fricative: 0.1 };

export interface Identity {
  /** Syllables a second. */
  rate: number;
  /** Tract length, cm. */
  lengthCm: number;
  f0: number;
  /** How wide the pitch swings. */
  range: number;
  /** Baseline wave shape: low is pressed, high is breathy. */
  rd: number;
  breath: number;
  /** How much the nose leaks when it should be shut. */
  velum: number;
}

function hash(seed: number, n: number): number {
  const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Who this one is. `tone` is the old control and still means the same thing:
 * above 1 is a shorter tract and a smaller person.
 */
export function identity(seed: number, tone: number, pitch: number): Identity {
  // How big a person this is, 0 to 1. Pitch and tract follow it together —
  // a long throat on a high voice is nobody — and the spread is the adult
  // range, roughly 100 to 300 Hz over 14 to 18 cm, before `tone` shrinks it.
  const size = hash(seed, 9);
  return {
    rate: 4.4 + hash(seed, 1) * 3.6,
    lengthCm: (14.2 + 4 * size) / tone,
    f0: pitch * (0.7 + 0.3 * tone) * (1.15 - 0.55 * size) * (0.9 + hash(seed, 8) * 0.2),
    range: 0.18 + hash(seed, 6) * 0.22,
    // **This is the brightness of the voice.** `Rd` sets the length of the
    // fold's return phase, which puts a second 6 dB an octave on everything
    // above `f0 / 2π·Ra` — and that corner falls with f0, so a big low voice
    // needs a lower Rd than a small high one to keep the same top.
    rd: 0.58 + hash(seed, 2) * 0.24 - 0.18 * size,
    // Never dry. A voice with no air in it at all is a buzzer.
    breath: 0.03 + hash(seed, 3) * 0.04,
    velum: hash(seed, 12) * 0.14,
  };
}

/**
 * Keys, one growing list per track.
 *
 * Times are clamped forward rather than sorted: the writer works in time order
 * and a consonant that reaches back past the syllable before it should land on
 * its heels, not behind it.
 */
class Lines {
  private readonly data = new Map<Track, number[]>();
  private readonly last = new Map<Track, number>();
  private readonly value = new Map<Track, number>();

  at(track: Track, t: number, v: number, curve: Curve = 'lin'): void {
    let list = this.data.get(track);
    if (!list) {
      list = [];
      this.data.set(track, list);
    }
    const previous = this.last.get(track) ?? -Infinity;
    const time = Math.max(t, previous);
    this.last.set(track, time);
    this.value.set(track, v);
    list.push(time, v, CURVE[curve]);
  }

  /** Says the last value again at `t`, so the track sits still until then. */
  hold(track: Track, t: number): void {
    const v = this.value.get(track);
    if (v !== undefined) this.at(track, t, v, 'lin');
  }

  packed(): Partial<Record<Track, Float32Array>> {
    const out: Partial<Record<Track, Float32Array>> = {};
    for (const [track, list] of this.data) out[track] = Float32Array.from(list);
    return out;
  }
}

export interface Written {
  tracks: Partial<Record<Track, Float32Array>>;
  units: Unit[];
  /** When the last syllable is done, before its trailing pause. */
  end: number;
  /** When the throat can be left alone. */
  quiet: number;
  /** Seconds of inhale to run before the first syllable, or 0. */
  inhale: number;
}

/**
 * A whole utterance. `at` is when the voice may first make a sound; the first
 * syllable lands a little after it, and after an inhale if there is one.
 */
export function write(score: Score, me: Identity, at: number): Written {
  const lines = new Lines();
  const units: Unit[] = [];
  const unit = 1 / me.rate;
  const rest = SHAPES.schwa;

  // No drawn breath. A villager's line is a second and a half at most, which
  // is not long enough to need one, and a third of a second of noise in front
  // of every other utterance is heard as a hiss beside the voice, not as a
  // breath belonging to it. The worklet keeps the gesture for writers that
  // want it — an animal calling, someone out of puff.
  const inhale = 0;
  const start = at;

  // Everything starts from a resting mouth and a shut voice.
  lines.at('loud', at, 0, 'step');
  lines.at('breath', at, 0, 'step');
  lines.at('rd', at, me.rd, 'step');
  lines.at('chaos', at, 0, 'step');
  lines.at('modulate', at, 0, 'step');
  lines.at('velum', at, me.velum, 'step');
  lines.at('jaw', at, rest.jaw, 'step');
  lines.at('bodyPos', at, rest.bodyPos, 'step');
  lines.at('bodyDia', at, rest.bodyDia, 'step');
  lines.at('tip', at, TIP_OPEN, 'step');
  lines.at('lips', at, rest.lips, 'step');
  lines.at('f0', at, me.f0, 'step');

  let cursor = start + 0.04;
  let f0 = me.f0;
  let afterPause = true;
  let carried = false;

  for (let i = 0; i < score.syllables.length; i++) {
    const s = score.syllables[i];
    const next = score.syllables[i + 1];
    const lilt = s.tune === 'lilt';
    const creaky = s.voice === 'creaky';
    const breathy = s.voice === 'breathy';
    // Longer before a pause and at the end of a phrase — the last syllable of a
    // sentence stretches, and a line without that stretch is a list.
    const held = (s.pause >= 0.2 ? 1.35 : s.pause > 0 ? 1.1 : 1) * (s.final ? 1.2 : 1) * (s.long ? 1.45 : 1);
    const length =
      unit * (lilt ? 0.5 + 0.14 * s.stress : 0.55 + 0.45 * s.stress) * held * (0.9 + hash(me.f0, 20 + i) * 0.2);
    // The voice runs on into a voiced consonant rather than stopping and
    // starting again.
    const carries = !!next && s.pause === 0 && !UNVOICED.has(next.onset);
    // An unstressed syllable is much quieter than a stressed one; a line whose
    // syllables are all one loudness is a machine reading a list.
    const level =
      (0.4 + 0.6 * s.stress) * (s.tune === 'exclaim' ? 1.12 : lilt ? 1.08 : 1) * (0.9 + hash(me.f0, 60 + i) * 0.2);
    const lead = leadFor(s.onset, s.place);
    const on = cursor + lead;
    const end = on + length;

    // --- the pitch line ---------------------------------------------------
    // The tune of the phrase, then the stress on top of it, then a little that
    // is nobody's plan. Each is a real interval — a fifth on a question, a
    // third across a statement — because anything smaller is heard as flat.
    let contour: number;
    if (s.tune === 'question') contour = s.final ? (s.along >= 1 ? 1.45 : 1.22) : 1.02 - 0.08 * s.along;
    else if (s.tune === 'exclaim') contour = 1.32 - 0.3 * s.along;
    else if (lilt) contour = 1.18 + 0.12 * s.along + (s.final ? 0.1 : 0);
    else contour = 1.12 - 0.26 * s.along;
    contour *= 1 + (me.range + (lilt ? 0.08 : 0)) * (s.stress - 0.35) + (hash(me.f0, 100 + i) - 0.5) * 0.14;

    // A creaky vowel sits low as well as rough.
    const target = me.f0 * contour * (creaky ? 0.86 : 1);
    const settles = s.pause > 0.3 && s.tune !== 'question' && !lilt;
    // A stressed syllable rises into its peak and falls off it; an unstressed
    // one is passed through nearly level. A tone of its own overrides that.
    const peak = target * (lilt ? 1.06 : 1.01 + 0.05 * s.stress);
    const f0End = target * (settles ? 0.8 : lilt ? 1.04 : 0.99 - 0.05 * s.stress);
    const shape = TONES[s.tone] ?? [[0.32, peak / target], [1, f0End / target]];
    const from = afterPause ? target * 0.92 : f0;

    // Up to the peak a third of the way in, then away from it to the end,
    // always moving: a pitch that arrives and holds is a keyboard.
    if (afterPause) lines.at('f0', cursor, from, 'step');
    if (s.onset === 'implosive') {
      // The larynx drops behind the closure and comes back up as it opens.
      lines.at('f0', on - lead, from, 'lin');
      lines.at('f0', on - 0.008, from * 0.76, 'exp');
    }
    for (const [frac, mult] of shape) lines.at('f0', on + length * frac, target * mult, 'exp');
    const f0Last = target * shape[shape.length - 1][1];

    // --- effort -----------------------------------------------------------
    // Rd is the shape of the fold cycle: pressed on the stress, breathier at
    // the edges of a phrase. This is what makes loudness a change of timbre.
    const slack = breathy || s.onset === 'murmur';
    const pressed = creaky || s.onset === 'ejective';
    lines.at('rd', on, me.rd + (slack ? 0.7 : pressed ? -0.15 : 0.1), 'lin');
    lines.at('rd', on + length * 0.35, me.rd + (breathy ? 0.5 : -0.2 * s.stress), 'lin');
    lines.at('rd', end, me.rd + (s.pause > 0.2 ? 0.25 : 0.08), 'lin');

    // --- the consonant, ahead of the voice --------------------------------
    const vowel = SHAPES[s.vowel];
    const glide = SHAPES[s.glide];
    writeOnset(lines, s, on, lead, level, vowel, me, carried);

    // --- the vowel --------------------------------------------------------
    // An arc, not a plateau: up to full over the first third, easing off
    // toward the end.
    const rise = ABRUPT.has(s.onset) ? 0.006 : s.onset === 'stop' ? 0.014 : s.onset === 'none' ? 0.028 : 0.02;
    lines.at('loud', on + rise, level * 0.9, 'lin');
    lines.at('loud', on + length * 0.35, level, 'lin');
    lines.at('loud', end - 0.02, level * 0.72, 'lin');

    lines.at('jaw', on + 0.03, vowel.jaw, 'lin');
    lines.at('bodyPos', on + 0.03, vowel.bodyPos, 'lin');
    lines.at('bodyDia', on + 0.03, vowel.bodyDia, 'lin');
    lines.at('lips', on + 0.03, vowel.lips, 'lin');
    if (s.onset !== 'hiss' && s.onset !== 'hush') lines.at('tip', on + 0.02, TIP_OPEN, 'lin');

    // The mouth moves on into the second vowel across the middle of it.
    if (s.glide !== s.vowel) {
      const to = on + length * 0.85;
      lines.at('jaw', to, glide.jaw, 'lin');
      lines.at('bodyPos', to, glide.bodyPos, 'lin');
      lines.at('bodyDia', to, glide.bodyDia, 'lin');
      lines.at('lips', to, glide.lips, 'lin');
    }

    // Through the nose: the velum opens under the vowel and shuts after it,
    // unless a nasal coda is about to want it open anyway.
    if (s.nasal) {
      lines.at('velum', on + 0.04, 0.9, 'lin');
      if (s.coda !== 'nasal') {
        lines.hold('velum', end);
        lines.at('velum', end + 0.06, me.velum, 'lin');
      }
    }

    // Creak: alternate cycles short and quiet, the whole vowel through.
    if (creaky) {
      lines.at('chaos', on, 0.55, 'lin');
      lines.at('chaos', end, 0.55, 'lin');
      lines.at('chaos', end + 0.04, 0, 'lin');
    }

    // Breath under the voice, more at a word's start and in the tail, and
    // most of all under a breathy vowel.
    const air = breathy ? 3.5 : 1;
    if (!BREATHED.has(s.onset)) lines.at('breath', on, me.breath * (1 + s.stress) * air, 'lin');
    lines.at('breath', on + length * 0.5, me.breath * 0.6 * air, 'lin');
    lines.at('breath', end, me.breath * (s.pause > 0.2 ? 1 : 0.5), 'lin');

    // --- the coda ---------------------------------------------------------
    writeCoda(lines, s, end, level, me, carries);

    // And then it stops. Left to run to the next syllable's key the tail
    // stretches across the whole pause, which is a hiss where a silence goes.
    lines.at('breath', end + 0.1 + CODA_TAIL[s.coda], 0, 'lin');

    // A line that has come to rest goes down into creak: the pitch is low
    // already and the folds stop being regular about it.
    if (settles && !creaky) {
      lines.at('chaos', end - 0.1, 0, 'lin');
      lines.at('chaos', end + 0.02, 0.7, 'lin');
      lines.at('chaos', end + 0.12, 0, 'lin');
    }

    units.push({ at: on, length, from: s.from, to: s.to, stress: s.stress });
    f0 = f0Last;
    cursor = end + 0.012 + CODA_TAIL[s.coda] + s.pause;
    afterPause = s.pause >= 0.2;
    carried = carries;
  }

  const last = units[units.length - 1];
  const end = last ? last.at + last.length : start;

  // It just stops. There was a breath let go here; it was the thing being
  // heard as a hiss after the voice, and a villager finishing a line does not
  // need one.
  const tail = end + 0.12;
  lines.at('loud', tail, 0, 'lin');
  lines.at('breath', tail, 0, 'lin');
  lines.at('velum', tail + 0.1, me.velum, 'lin');
  lines.at('jaw', tail + 0.2, rest.jaw, 'lin');
  lines.at('bodyPos', tail + 0.2, rest.bodyPos, 'lin');
  lines.at('bodyDia', tail + 0.2, rest.bodyDia, 'lin');
  lines.at('tip', tail + 0.2, TIP_OPEN, 'lin');
  lines.at('lips', tail + 0.2, rest.lips, 'lin');

  return { tracks: lines.packed(), units, end, quiet: tail + 0.4, inhale };
}

/** How much room a consonant needs in front of the voice. */
function leadFor(onset: Onset, place: Place): number {
  switch (onset) {
    case 'stop':
    case 'murmur':
      return CLOSURE[place] + VOT;
    case 'ejective':
      return CLOSURE[place] + EJECT;
    case 'implosive':
      return CLOSURE[place] + 0.008;
    case 'prenasal':
      return 0.06 + CLOSURE[place] + VOT;
    case 'click':
      return 0.11;
    case 'trill':
      return TRILL_PERIOD[place] * TRILL_BEATS + 0.01;
    case 'hiss':
    case 'hush':
      return 0.085;
    case 'lateral':
    case 'whisperNasal':
      return 0.1;
    case 'breath':
      return 0.065;
    case 'nasal':
      return 0.07;
    case 'liquid':
      return 0.06;
    case 'glottal':
      return 0.04;
    default:
      return 0.014;
  }
}

/** The articulator that closes at `place`, and where it goes when it lets go. */
function closer(place: Place, vowel: Shape): { track: Track; open: number } {
  if (place === 'lip') return { track: 'lips', open: vowel.lips };
  if (place === 'ridge') return { track: 'tip', open: TIP_OPEN };
  return { track: 'bodyDia', open: vowel.bodyDia };
}

/** Where the tongue body sits for a constriction at `place`. */
function bodyAt(place: Place): number {
  return place === 'throat' ? PHARYNX : VELAR;
}

/**
 * Puts the tongue body where a closure at `place` is made and keeps it there
 * until `until`; everything not making the closure goes to the vowel.
 */
function settle(lines: Lines, place: Place, vowel: Shape, begin: number, until: number, pos = bodyAt(place)): void {
  if (place === 'back' || place === 'throat') {
    lines.hold('bodyPos', begin - CLOSE);
    lines.at('bodyPos', begin, pos, 'lin');
    lines.hold('bodyPos', until);
  } else {
    lines.at('bodyPos', begin, vowel.bodyPos, 'lin');
    lines.at('bodyDia', begin, vowel.bodyDia, 'lin');
  }
  if (place !== 'lip') lines.at('lips', begin, vowel.lips, 'lin');
}

/** Still, then shut by `begin`, then held shut until `release`. */
function shut(lines: Lines, track: Track, begin: number, release: number, closeFor = CLOSE): void {
  lines.hold(track, begin - closeFor);
  lines.at(track, begin, 0, 'lin');
  lines.hold(track, release);
}

/**
 * Beats of a trill from `from`. The follower cannot reach a closure in half
 * a beat, so each beat is asked for well past shut and well past open and
 * lands where it can — which is a tap and a gap, `beats` times over.
 */
function trill(lines: Lines, track: Track, place: Place, from: number, beats: number): number {
  const period = TRILL_PERIOD[place];
  const swing = place === 'lip' ? 0.9 : 0.5;
  let t = from;
  for (let b = 0; b < beats; b++) {
    lines.at(track, t + period * 0.45, -swing, 'lin');
    lines.at(track, t + period, swing + 0.05, 'lin');
    t += period;
  }
  return t;
}

/**
 * The consonant. It runs from `on − lead` to `on`, and it is made of nothing
 * but articulator positions and how open the folds are — the burst, the
 * aspiration and the hiss are the tube's to produce.
 */
function writeOnset(
  lines: Lines,
  s: Syllable,
  on: number,
  lead: number,
  level: number,
  vowel: Shape,
  me: Identity,
  carried: boolean,
): void {
  const begin = on - lead;
  // Off, or carried in from the last vowel: either way it holds where it is
  // until this one starts, rather than creeping up across the gap.
  if (carried) lines.hold('loud', begin);
  else lines.at('loud', begin, 0, 'step');

  switch (s.onset) {
    case 'stop':
    case 'murmur': {
      // Still, shut, held, let go: the closing articulator and nothing else.
      // The closure is silent and the tube is being pushed into, so the
      // release makes the burst by itself.
      const release = on - VOT;
      const { track, open } = closer(s.place, vowel);
      shut(lines, track, begin, release);
      lines.at(track, release + OPEN, open, 'lin');
      lines.at('jaw', begin, Math.min(vowel.jaw, 0.35), 'lin');
      settle(lines, s.place, vowel, begin, release);
      // A little voicing behind the closure — these are all b, d, g — held at
      // that level until it opens. A voiced stop barely aspirates: any real
      // puff of air on the release is heard as a crack.
      lines.at('loud', begin + 0.015, level * 0.1, 'lin');
      lines.hold('loud', release);
      lines.at('breath', begin, me.breath * 0.5, 'step');
      if (s.onset === 'murmur') {
        // Lets go with the folds slack: a rush of air under the vowel's first
        // stretch, and Rd is up there too.
        lines.at('breath', release, 0.3, 'lin');
        lines.at('breath', on + 0.09, me.breath, 'lin');
      } else {
        lines.at('breath', release, me.breath * 1.2, 'lin');
        lines.at('breath', on + 0.012, me.breath, 'lin');
      }
      break;
    }
    case 'ejective': {
      // Shut in the mouth and at the folds. It lets go hard, then nothing,
      // and the voice comes in late, all at once, with a catch on it.
      const release = on - EJECT;
      const { track, open } = closer(s.place, vowel);
      shut(lines, track, begin, release);
      lines.at(track, release + OPEN, open, 'lin');
      lines.at('jaw', begin, Math.min(vowel.jaw, 0.35), 'lin');
      settle(lines, s.place, vowel, begin, release);
      lines.hold('loud', on - 0.004);
      lines.at('loud', on, level * 0.85, 'lin');
      lines.at('breath', begin, 0, 'step');
      lines.at('breath', release, 0.5, 'step');
      lines.at('breath', release + 0.015, 0, 'lin');
      lines.hold('breath', on);
      lines.at('chaos', on, 0.6, 'step');
      lines.at('chaos', on + 0.06, 0, 'lin');
      break;
    }
    case 'implosive': {
      // Shut with the voice running behind it and the larynx dropping — the
      // dip is on the f0 line — then let go with no puff at all.
      const release = on - 0.008;
      const { track, open } = closer(s.place, vowel);
      shut(lines, track, begin, release);
      lines.at(track, release + OPEN, open, 'lin');
      lines.at('jaw', begin, Math.min(vowel.jaw, 0.35), 'lin');
      settle(lines, s.place, vowel, begin, release);
      lines.at('loud', begin + 0.012, level * 0.5, 'lin');
      lines.hold('loud', release);
      lines.at('breath', begin, 0, 'lin');
      lines.hold('breath', on);
      break;
    }
    case 'click': {
      // Two closures: the tongue body all but seals the velum while the front
      // shuts, the front snaps open into the pocket between them, then the
      // back lets go. No voice and no breath — the pop is all there is.
      const pop = on - 0.06;
      const front = closer(s.place, vowel);
      lines.at('jaw', begin, 0.3, 'lin');
      lines.hold('bodyPos', begin - CLOSE);
      lines.at('bodyPos', begin, VELAR, 'lin');
      lines.hold('bodyPos', pop + 0.02);
      lines.hold('bodyDia', begin - CLOSE);
      lines.at('bodyDia', begin, 0.05, 'lin');
      lines.hold('bodyDia', pop + 0.02);
      lines.at('bodyDia', pop + 0.05, vowel.bodyDia, 'lin');
      shut(lines, front.track, begin, pop);
      lines.at(front.track, pop + 0.004, front.open, 'lin');
      if (s.place !== 'lip') lines.at('lips', begin, vowel.lips, 'lin');
      lines.hold('loud', on - 0.004);
      lines.at('loud', on, level * 0.8, 'lin');
      lines.at('breath', begin, 0, 'step');
      lines.at('breath', pop, 0.35, 'step');
      lines.at('breath', pop + 0.012, 0, 'lin');
      lines.hold('breath', on);
      break;
    }
    case 'trill': {
      // Beats of closure with the voice on under them.
      const { track, open } = closer(s.place, vowel);
      lines.at('jaw', begin, Math.min(vowel.jaw, 0.4), 'lin');
      settle(lines, s.place, vowel, begin, on + 0.02, s.place === 'back' ? UVULA : undefined);
      lines.hold(track, begin - 0.03);
      trill(lines, track, s.place, begin, TRILL_BEATS);
      lines.at(track, on + 0.03, open, 'lin');
      lines.at('loud', begin + 0.012, level * 0.7, 'lin');
      break;
    }
    case 'hiss':
    case 'hush': {
      // A narrow channel with no voice behind it. The tube hisses because it
      // is narrow, not because a filter was told to — and narrower than any
      // vowel gets, which is what makes this a fricative and not a close
      // vowel with noise on it.
      const gap = s.onset === 'hush' ? 0.22 : s.place === 'ridge' ? 0.13 : FRIC;
      lines.at('jaw', begin, 0.22, 'lin');
      if (s.place === 'ridge') {
        lines.at('bodyPos', begin, 0.75, 'lin');
        lines.at('bodyDia', begin, 1.0, 'lin');
        lines.hold('tip', begin - 0.03);
        lines.at('tip', begin + 0.012, gap, 'lin');
        lines.at('lips', begin, s.onset === 'hush' ? 0.85 : vowel.lips, 'lin');
        lines.hold('tip', on - 0.02);
        lines.at('tip', on, TIP_OPEN, 'lin');
      } else if (s.place === 'lip') {
        lines.at('bodyPos', begin, vowel.bodyPos, 'lin');
        lines.at('bodyDia', begin, vowel.bodyDia, 'lin');
        lines.hold('lips', begin - 0.03);
        lines.at('lips', begin + 0.012, gap, 'lin');
        lines.hold('lips', on - 0.02);
        lines.at('lips', on, vowel.lips, 'lin');
      } else {
        // The tongue body against the velum, or the pharynx wall.
        lines.hold('bodyPos', begin - 0.03);
        lines.at('bodyPos', begin, bodyAt(s.place), 'lin');
        lines.hold('bodyPos', on - 0.02);
        lines.hold('bodyDia', begin - 0.03);
        lines.at('bodyDia', begin + 0.012, gap, 'lin');
        lines.hold('bodyDia', on - 0.02);
        lines.at('bodyDia', on, vowel.bodyDia, 'lin');
        lines.at('lips', begin, vowel.lips, 'lin');
      }
      lines.at('breath', begin, 0.4, 'lin');
      lines.at('breath', on + 0.01, me.breath, 'lin');
      break;
    }
    case 'lateral': {
      // The tongue up in an l with air forced past its sides: voiced for a
      // moment, then the voice goes and it hisses through the gap.
      lines.at('jaw', begin, 0.25, 'lin');
      lines.at('bodyPos', begin, 0.7, 'lin');
      lines.at('bodyDia', begin, 1.0, 'lin');
      lines.hold('tip', begin - 0.03);
      lines.at('tip', begin, LATERAL, 'lin');
      lines.hold('tip', on - 0.015);
      lines.at('tip', on, TIP_OPEN, 'lin');
      lines.at('lips', begin, vowel.lips, 'lin');
      lines.at('loud', begin + 0.01, level * 0.35, 'lin');
      lines.at('loud', begin + 0.035, 0, 'lin');
      lines.hold('loud', on - 0.01);
      lines.at('breath', begin, me.breath, 'lin');
      lines.at('breath', begin + 0.03, 0.42, 'lin');
      lines.hold('breath', on - 0.01);
      lines.at('breath', on + 0.01, me.breath, 'lin');
      break;
    }
    case 'breath': {
      // An h: the vowel's own shape, breathed before it is voiced. In the
      // throat, the pharynx narrows on it first.
      lines.at('jaw', begin, vowel.jaw, 'lin');
      if (s.place === 'throat') {
        lines.hold('bodyPos', begin - 0.03);
        lines.at('bodyPos', begin, PHARYNX, 'lin');
        lines.hold('bodyPos', on - 0.01);
        lines.hold('bodyDia', begin - 0.03);
        lines.at('bodyDia', begin, 0.24, 'lin');
        lines.hold('bodyDia', on - 0.01);
        lines.at('bodyDia', on + 0.03, vowel.bodyDia, 'lin');
      } else {
        lines.at('bodyPos', begin, vowel.bodyPos, 'lin');
        lines.at('bodyDia', begin, vowel.bodyDia, 'lin');
      }
      lines.at('lips', begin, vowel.lips, 'lin');
      lines.at('breath', begin, s.place === 'throat' ? 0.4 : 0.3, 'lin');
      lines.at('breath', on + 0.02, me.breath * 1.4, 'lin');
      break;
    }
    case 'nasal': {
      // A hum through a shut mouth that opens into the vowel. The nose is what
      // makes the sound; the mouth is closed the whole time and lets go fast.
      const { track, open } = closer(s.place, vowel);
      lines.hold('velum', begin - CLOSE);
      lines.at('velum', begin, 1.1, 'lin');
      shut(lines, track, begin, on);
      lines.at(track, on + OPEN, open, 'lin');
      lines.at('jaw', begin, 0.3, 'lin');
      if (s.place === 'back') settle(lines, s.place, vowel, begin, on);
      lines.at('loud', begin + 0.015, level * 0.55, 'lin');
      // The velum takes about thirty milliseconds to shut behind the vowel.
      lines.hold('velum', on);
      lines.at('velum', on + 0.035, me.velum, 'lin');
      break;
    }
    case 'whisperNasal': {
      // A nasal with no voice in it: mouth shut, nose open, only breath
      // through it, and the voice comes on just before the mouth opens.
      const { track, open } = closer(s.place, vowel);
      lines.hold('velum', begin - CLOSE);
      lines.at('velum', begin, 1.1, 'lin');
      shut(lines, track, begin, on);
      lines.at(track, on + OPEN, open, 'lin');
      lines.at('jaw', begin, 0.3, 'lin');
      if (s.place === 'back') settle(lines, s.place, vowel, begin, on);
      lines.at('breath', begin, 0.4, 'lin');
      lines.hold('breath', on - 0.03);
      lines.at('breath', on, me.breath, 'lin');
      lines.hold('loud', on - 0.03);
      lines.at('loud', on - 0.005, level * 0.5, 'lin');
      lines.hold('velum', on);
      lines.at('velum', on + 0.035, me.velum, 'lin');
      break;
    }
    case 'prenasal': {
      // A hum, then the nose shuts behind it and the stop lets go: mb, nd.
      const release = on - VOT;
      const seal = begin + 0.06 + CLOSURE[s.place] * 0.4;
      const { track, open } = closer(s.place, vowel);
      lines.hold('velum', begin - CLOSE);
      lines.at('velum', begin, 1.1, 'lin');
      lines.hold('velum', seal - 0.02);
      lines.at('velum', seal, me.velum, 'lin');
      shut(lines, track, begin, release);
      lines.at(track, release + OPEN, open, 'lin');
      lines.at('jaw', begin, 0.3, 'lin');
      settle(lines, s.place, vowel, begin, release);
      lines.at('loud', begin + 0.015, level * 0.55, 'lin');
      lines.hold('loud', seal);
      lines.at('loud', seal + 0.01, level * 0.12, 'lin');
      lines.hold('loud', release);
      lines.at('breath', begin, me.breath * 0.5, 'step');
      lines.at('breath', release, me.breath * 1.2, 'lin');
      lines.at('breath', on + 0.012, me.breath, 'lin');
      break;
    }
    case 'liquid': {
      // A real constriction with the voice on, made, held into the vowel and
      // let go slowly. It sits right on the hiss threshold: as tight as the
      // tube allows without noise, which is what a liquid is.
      const { track, open } = closer(s.place, vowel);
      lines.at('jaw', begin, Math.min(vowel.jaw, 0.4), 'lin');
      if (s.place === 'back' || s.place === 'throat') {
        lines.hold('bodyPos', begin - 0.03);
        lines.at('bodyPos', begin, bodyAt(s.place), 'lin');
        lines.hold('bodyPos', on + 0.02);
      } else {
        lines.at('bodyPos', begin, vowel.bodyPos, 'lin');
        lines.at('bodyDia', begin, vowel.bodyDia, 'lin');
      }
      lines.hold(track, begin - 0.03);
      lines.at(track, begin, s.place === 'throat' ? 0.3 : LIQUID, 'lin');
      lines.hold(track, on + 0.02);
      lines.at(track, on + 0.06, open, 'lin');
      lines.at('loud', begin + 0.012, level * 0.6, 'lin');
      // A pharyngeal is rough by nature.
      if (s.place === 'throat') {
        lines.at('chaos', begin, 0, 'lin');
        lines.at('chaos', begin + 0.01, 0.5, 'lin');
        lines.at('chaos', on + 0.04, 0, 'lin');
      }
      break;
    }
    case 'glottal': {
      // Nothing in the mouth: the folds shut, and open again onto the vowel
      // with a catch.
      lines.at('jaw', begin, vowel.jaw, 'lin');
      lines.at('bodyPos', begin, vowel.bodyPos, 'lin');
      lines.at('bodyDia', begin, vowel.bodyDia, 'lin');
      lines.at('lips', begin, vowel.lips, 'lin');
      lines.hold('loud', on - 0.003);
      lines.at('loud', on, level * 0.9, 'lin');
      lines.at('chaos', on - 0.01, 0, 'lin');
      lines.at('chaos', on, 0.8, 'lin');
      lines.at('chaos', on + 0.06, 0, 'lin');
      break;
    }
    default: {
      lines.at('jaw', begin, vowel.jaw, 'lin');
      lines.at('bodyPos', begin, vowel.bodyPos, 'lin');
      lines.at('bodyDia', begin, vowel.bodyDia, 'lin');
      lines.at('lips', begin, vowel.lips, 'lin');
      break;
    }
  }
}

/** How the syllable shuts: on nothing, on a closure, on a hum, or on more than that. */
function writeCoda(
  lines: Lines,
  s: Syllable,
  end: number,
  level: number,
  me: Identity,
  carries: boolean,
): void {
  const place = s.codaPlace;
  const rest = SHAPES.schwa;
  const { track, open } = closer(place, rest);
  const inBody = place === 'back' || place === 'throat';
  switch (s.coda) {
    case 'nasal': {
      lines.hold('velum', end - 0.1);
      lines.at('velum', end - 0.06, 1.1, 'lin');
      if (inBody) {
        lines.hold('bodyPos', end - 0.08);
        lines.at('bodyPos', end - 0.04, bodyAt(place), 'lin');
        lines.hold('bodyPos', end + 0.04);
      }
      lines.hold(track, end - 0.08);
      lines.at(track, end - 0.04, 0, 'lin');
      lines.at('loud', end - 0.01, level * 0.45, 'lin');
      lines.at('loud', end + 0.03, 0, 'lin');
      // It comes open once the hum is off, quickly, and the velum shuts after.
      lines.hold(track, end + 0.04);
      lines.at(track, end + 0.04 + OPEN, open, 'lin');
      lines.at('velum', end + 0.09, me.velum, 'lin');
      return;
    }
    case 'stop': {
      // Shut on it, hold, then let it go into the pause: the release is a
      // small burst with no voice behind it.
      if (inBody) {
        lines.hold('bodyPos', end - 0.06);
        lines.at('bodyPos', end - 0.02, bodyAt(place), 'lin');
        lines.hold('bodyPos', end + 0.05);
      }
      lines.hold(track, end - 0.06);
      lines.at(track, end - 0.02, 0, 'lin');
      lines.at('loud', end, 0, 'lin');
      lines.at('breath', end, me.breath * 0.5, 'step');
      lines.hold(track, end + 0.05);
      lines.at(track, end + 0.05 + OPEN, open, 'lin');
      lines.at('breath', end + 0.055, me.breath * 2, 'lin');
      lines.at('breath', end + 0.09, 0, 'lin');
      return;
    }
    case 'glottal': {
      // The folds clap shut on the vowel: a creak into it and then nothing.
      lines.at('chaos', end - 0.06, 0, 'lin');
      lines.at('chaos', end - 0.015, 0.8, 'lin');
      lines.at('chaos', end + 0.02, 0, 'lin');
      lines.at('loud', end - 0.004, level * 0.7, 'lin');
      lines.at('loud', end, 0, 'lin');
      lines.at('breath', end, 0, 'step');
      return;
    }
    case 'trill': {
      // Two beats after the vowel with the voice still on.
      if (inBody) {
        lines.hold('bodyPos', end - 0.04);
        lines.at('bodyPos', end - 0.01, UVULA, 'lin');
        lines.hold('bodyPos', end + 0.09);
      }
      lines.hold(track, end - 0.03);
      const done = trill(lines, track, place, end - 0.01, 2);
      lines.at(track, done + 0.02, open, 'lin');
      lines.at('loud', done, level * 0.5, 'lin');
      lines.at('loud', done + 0.02, 0, 'lin');
      return;
    }
    case 'lateral': {
      // Up into an l and held there as the voice goes.
      lines.hold('tip', end - 0.03);
      lines.at('tip', end, LIQUID, 'lin');
      lines.hold('tip', end + 0.06);
      lines.at('tip', end + 0.08, TIP_OPEN, 'lin');
      lines.at('loud', end + 0.05, level * 0.5, 'lin');
      lines.at('loud', end + 0.08, 0, 'lin');
      return;
    }
    case 'fricative': {
      // The voice goes and the gap stays: a hiss on the way out.
      const gap = place === 'ridge' ? LATERAL : place === 'throat' ? 0.24 : FRIC;
      lines.at('loud', end + 0.01, 0, 'lin');
      if (inBody) {
        lines.hold('bodyPos', end - 0.04);
        lines.at('bodyPos', end, bodyAt(place), 'lin');
        lines.hold('bodyPos', end + 0.09);
      }
      lines.hold(track, end - 0.04);
      lines.at(track, end, gap, 'lin');
      lines.hold(track, end + 0.09);
      lines.at(track, end + 0.11, open, 'lin');
      lines.at('breath', end - 0.01, me.breath, 'lin');
      lines.at('breath', end + 0.01, 0.4, 'lin');
      lines.hold('breath', end + 0.08);
      lines.at('breath', end + 0.11, 0, 'lin');
      return;
    }
    default:
      // Open coda: the voice runs on toward the next consonant, or lets go.
      lines.at('loud', end + 0.01, carries ? level * 0.45 : 0, 'lin');
  }
}
