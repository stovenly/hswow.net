/**
 * Text into a score of syllables, for a voice that says nothing.
 *
 * The Animal Crossing idea: whatever is written in the box is what the
 * villager "says", one small sound per unit of it, so the babble follows the
 * shape of the line — its length, its words, its commas, whether it is a
 * question. Nothing here is a language. It is the *rhythm and colour* of one:
 * a syllable's opening consonant decides how it starts (a stop, a hiss, a
 * hum, a glide), its vowels decide the mouth shape and whether it moves, the
 * first syllable of each word carries the stress, the last before a pause is
 * held longer, and the pitch falls across a sentence and rises into a
 * question. The voice model plays it.
 */

export type Onset = 'none' | 'stop' | 'hiss' | 'hush' | 'breath' | 'nasal' | 'liquid';
/** Where in the mouth a consonant is made — sets the formant it moves from. */
export type Place = 'lip' | 'ridge' | 'back';
export type Vowel = 'a' | 'e' | 'i' | 'o' | 'u' | 'schwa';
export type Coda = 'open' | 'stop' | 'nasal';

export interface Syllable {
  /** Character range in the text this syllable reveals, end exclusive. */
  from: number;
  to: number;
  onset: Onset;
  place: Place;
  /** The vowel it opens on, and the one it moves to (the same for a pure one). */
  vowel: Vowel;
  glide: Vowel;
  coda: Coda;
  /** 0..1: how prominent. Word-initial syllables carry it. */
  stress: number;
  /** Seconds of nothing after it: a word gap, a comma, a full stop. */
  pause: number;
  /** Which sentence shape it belongs to. */
  tune: Tune;
  /** 0..1 through its sentence, for declination and the final rise. */
  along: number;
  /** Set on the last syllable or two of a question, where the rise goes. */
  final: boolean;
}

export type Tune = 'statement' | 'question' | 'exclaim' | 'lilt';

export interface Score {
  text: string;
  syllables: Syllable[];
}

const VOWELS = new Set('aeiouy');
const NASALS = new Set('mn');
const LIQUIDS = new Set('lrwy');
const STOPS = new Set('pbtdkgcq');
const HISS = new Set('sz');
const HUSH_PAIRS = new Set(['sh', 'ch', 'th', 'zh']);
const BREATH = new Set('hfv');

function placeOf(c: string): Place {
  if ('pbmwfv'.includes(c)) return 'lip';
  if ('tdnszlr'.includes(c)) return 'ridge';
  return 'back';
}

function onsetOf(cluster: string): { onset: Onset; place: Place } {
  if (cluster.length === 0) return { onset: 'none', place: 'back' };
  const pair = cluster.slice(0, 2);
  const c = cluster[0];
  if (HUSH_PAIRS.has(pair)) return { onset: pair === 'th' ? 'breath' : 'hush', place: 'ridge' };
  if (STOPS.has(c)) return { onset: 'stop', place: placeOf(c) };
  if (HISS.has(c)) return { onset: 'hiss', place: 'ridge' };
  if (BREATH.has(c)) return { onset: 'breath', place: placeOf(c) };
  if (NASALS.has(c)) return { onset: 'nasal', place: placeOf(c) };
  if (LIQUIDS.has(c)) return { onset: 'liquid', place: c === 'w' ? 'lip' : 'ridge' };
  return { onset: 'stop', place: 'back' };
}

function vowelOf(c: string): Vowel {
  return c === 'y' ? 'i' : (c as Vowel);
}

/** Splits one word into syllables: onset consonants, a vowel group, a coda. */
function syllabify(word: string, from: number, out: Syllable[]): void {
  const lower = word.toLowerCase();
  // Runs of vowels and the consonants between them.
  const groups: { start: number; end: number }[] = [];
  let i = 0;
  while (i < lower.length) {
    if (VOWELS.has(lower[i])) {
      const start = i;
      while (i < lower.length && VOWELS.has(lower[i])) i++;
      groups.push({ start, end: i });
    } else {
      i++;
    }
  }
  if (groups.length === 0) {
    // "hmm", "brr", "psst": one syllable on a hum.
    const { onset, place } = onsetOf(lower);
    out.push(blank(from, from + word.length, onset, place, 'schwa', 'schwa', NASALS.has(lower[lower.length - 1]) ? 'nasal' : 'open'));
    return;
  }
  for (let g = 0; g < groups.length; g++) {
    const group = groups[g];
    // Consonants before this vowel group. All of them for the first syllable;
    // after that the cluster is split, the last one opening this syllable.
    const clusterStart = g === 0 ? 0 : groups[g - 1].end;
    const cluster = lower.slice(clusterStart, group.start).replace(/'/g, '');
    const onsetCluster = g === 0 ? cluster : cluster.slice(-1);
    const { onset, place } = onsetOf(onsetCluster);
    const vowels = lower.slice(group.start, group.end);
    const vowel = vowelOf(vowels[0]);
    // A second different vowel letter is a glide; a doubled one just holds.
    const last = vowelOf(vowels[vowels.length - 1]);
    const glide = vowels.length > 1 && last !== vowel ? last : vowel;
    // The syllable's characters run to the start of the next vowel group's
    // onset, or the end of the word.
    const next = groups[g + 1];
    const end = next ? Math.max(group.end, next.start - 1) : lower.length;
    const tail = lower.slice(group.end, end).replace(/'/g, '');
    const codaChar = tail[tail.length - 1];
    const coda: Coda = !codaChar ? 'open' : NASALS.has(codaChar) ? 'nasal' : STOPS.has(codaChar) ? 'stop' : 'open';
    out.push(blank(from + (g === 0 ? 0 : clusterStart + (cluster.length - onsetCluster.length)), from + end, onset, place, vowel, glide, coda));
  }
}

function blank(from: number, to: number, onset: Onset, place: Place, vowel: Vowel, glide: Vowel, coda: Coda): Syllable {
  return { from, to, onset, place, vowel, glide, coda, stress: 0, pause: 0, tune: 'statement', along: 0, final: false };
}

/** Seconds of silence a mark buys. */
const PAUSES: Record<string, number> = { ',': 0.26, ';': 0.32, ':': 0.3, '.': 0.55, '!': 0.5, '?': 0.55, '—': 0.4, '-': 0.12, '…': 0.7 };

/**
 * Scores a line. Words become syllables; punctuation becomes pauses on the
 * syllable before it; the terminal mark of each sentence sets its tune.
 */
export function score(text: string): Score {
  const syllables: Syllable[] = [];
  const re = /[A-Za-z0-9']+|[^A-Za-z0-9'\s]+|\s+/g;
  let m: RegExpExecArray | null;
  let sentenceStart = 0;
  const closeSentence = (tune: Tune): void => {
    const run = syllables.slice(sentenceStart);
    const n = run.length;
    run.forEach((s, i) => {
      s.tune = tune;
      s.along = n > 1 ? i / (n - 1) : 1;
      s.final = tune === 'question' && i >= n - 2;
    });
    sentenceStart = syllables.length;
  };
  while ((m = re.exec(text)) !== null) {
    const token = m[0];
    if (/^\s+$/.test(token)) {
      // A word gap, if a syllable is there to take it. Never longer than a
      // mark's own pause already on it.
      const last = syllables[syllables.length - 1];
      if (last) last.pause = Math.max(last.pause, 0.05);
      continue;
    }
    if (/^[A-Za-z0-9']/.test(token)) {
      const before = syllables.length;
      syllabify(token, m.index, syllables);
      // Stress: the first syllable of the word; a one-syllable word gets a
      // little less so a run of them does not hammer.
      if (syllables.length > before) syllables[before].stress = syllables.length - before > 1 ? 1 : 0.7;
      continue;
    }
    // Punctuation: it belongs to the syllable before it, whose text range
    // grows to cover it, and which pauses after it.
    const last = syllables[syllables.length - 1];
    let pause = 0;
    for (const ch of token) pause = Math.max(pause, PAUSES[ch] ?? 0.08);
    if (last) {
      last.to = m.index + token.length;
      last.pause = Math.max(last.pause, pause);
    }
    if (/[.!?…]/.test(token) && syllables.length > sentenceStart) {
      closeSentence(token.includes('?') ? 'question' : token.includes('!') ? 'exclaim' : 'statement');
    }
  }
  if (syllables.length > sentenceStart) closeSentence('statement');
  return { text, syllables };
}

/**
 * The twenty-five hellos. Each villager has one of these, and no two said one
 * after the other are the same — so a row of them does not read as one voice.
 * Written in the little language below and scored like anything else.
 */
export const GREETINGS: readonly string[] = [
  'mikai!', 'nolu?', 'tobo, tobo', 'weli!', 'kanun?',
  'bimi', 'dolau!', 'tuwai?', 'narenu', 'pelan!',
  'himo?', 'gudi', 'oanu!', 'mubon', 'keta?',
  'lolei!', 'bawa', 'tinu, tinu!', 'deka?', 'numa',
  'porilo!', 'wamu?', 'kolu, kolu', 'hairan!', 'tikadu?',
];

/** The last few said, anywhere, so none of them comes round twice running. */
const lately: number[] = [];

/** A villager's own hello, stepped along if it has just been heard. */
export function greetScore(seed: number): Score {
  let i = Math.abs(Math.floor(seed)) % GREETINGS.length;
  for (let n = 0; n < GREETINGS.length && lately.includes(i); n++) i = (i + 7) % GREETINGS.length;
  lately.push(i);
  if (lately.length > 4) lately.shift();
  const sc = score(GREETINGS[i]);
  const last = sc.syllables.length - 1;
  // The mark a hello is written with is its shape: `!` throws it out and lets
  // it fall, `?` lifts the end, and one written plain climbs on the lilt.
  const first = sc.syllables[0];
  const tune: Tune = !first || first.tune === 'statement' ? 'lilt' : first.tune;
  sc.syllables.forEach((s, k) => {
    s.tune = tune;
    s.final = k >= last - (tune === 'question' ? 1 : 0);
    s.along = last > 0 ? k / last : 1;
  });
  return sc;
}

/**
 * The little language. Every syllable is a consonant and a vowel and then it
 * is over: no fricatives, no clusters, nothing that shuts. English cannot be
 * built out of this.
 */
const ONSETS: readonly [Onset, Place][] = [
  ['stop', 'lip'], ['stop', 'ridge'], ['stop', 'back'], ['nasal', 'lip'], ['nasal', 'ridge'],
  ['liquid', 'ridge'], ['liquid', 'lip'], ['none', 'back'],
];
const VOWEL_LIST: readonly Vowel[] = ['a', 'e', 'i', 'o', 'u'];

/**
 * A score of nothing in particular, for a creature with nothing written to
 * say. `count` syllables in words of one to three; within a word the opening
 * consonant repeats as often as it changes and the vowel mostly holds, so
 * words come out as mimi, tuka, nanona. Deterministic in `random`.
 */
export function babbleScore(count: number, tune: Tune, random: () => number): Score {
  const syllables: Syllable[] = [];
  const pick = <T>(list: readonly T[]): T => list[Math.floor(random() * list.length)];
  let inWord = 0;
  let wordLength = 1 + Math.floor(random() * 3);
  let root = pick(ONSETS);
  let colour = pick(VOWEL_LIST);
  for (let i = 0; i < count; i++) {
    const [onset, place] = inWord === 0 || random() < 0.5 ? root : pick(ONSETS);
    const vowel = inWord === 0 || random() < 0.6 ? colour : pick(VOWEL_LIST);
    // A quarter of them sing up onto an i or a u on the way out.
    const glide: Vowel = random() < 0.25 ? (random() < 0.5 ? 'i' : 'u') : vowel;
    const s = blank(i, i + 1, onset, place, vowel, glide, 'open');
    s.stress = inWord === 0 ? (wordLength > 1 ? 1 : 0.7) : 0.25;
    s.tune = tune;
    s.along = count > 1 ? i / (count - 1) : 1;
    s.final = tune === 'question' ? i >= count - 2 : tune === 'lilt' && i >= count - 1;
    inWord++;
    if (inWord >= wordLength) {
      inWord = 0;
      wordLength = 1 + Math.floor(random() * 3);
      root = pick(ONSETS);
      colour = pick(VOWEL_LIST);
      s.pause = random() < 0.15 ? 0.26 : 0.05;
    }
    syllables.push(s);
  }
  if (syllables.length) syllables[syllables.length - 1].pause = 0.5;
  return { text: '', syllables };
}
