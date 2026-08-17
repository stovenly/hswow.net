/**
 * Text into a score of syllables, for a voice that says nothing.
 *
 * The Animal Crossing idea: whatever is written in the box is what the
 * villager "says", one small sound per unit of it, so the babble follows the
 * shape of the line — its length, its words, its commas, whether it is a
 * question. Nothing here is a language. It is the *rhythm and colour* of one:
 * a syllable's opening consonant decides how it starts, its vowels decide the
 * mouth shape and whether it moves, its marks decide its tone and the state
 * of the folds, the first syllable of each word carries the stress, the last
 * before a pause is held longer, and the pitch falls across a sentence and
 * rises into a question. The voice model plays it.
 *
 * The letters are IPA where plain ones run out: `ǃ ʘ ǀ` are clicks, `tʼ` an
 * ejective, `ɓ ɗ ɠ` implosives, `r ʙ ʀ` trills, `ɬ` a lateral hiss, `ħ ʕ`
 * pharyngeals, `ʔ` a catch in the throat, `m̥` a whispered nasal, `mb` a stop
 * with a hum in front, `bʱ` one that lets go breathy. On a vowel, `á à ǎ â`
 * and `a˨˩˦` are tones, `ã` is through the nose, `a̰` creaks, `a̤` breathes,
 * `aː` is long.
 */

export type Onset =
  | 'none' | 'stop' | 'hiss' | 'hush' | 'breath' | 'nasal' | 'liquid'
  | 'ejective' | 'implosive' | 'click' | 'trill' | 'lateral' | 'glottal'
  | 'murmur' | 'whisperNasal' | 'prenasal';
/** Where in the mouth a consonant is made. `throat` is the pharynx. */
export type Place = 'lip' | 'ridge' | 'back' | 'throat';
export type Vowel = 'a' | 'e' | 'i' | 'o' | 'u' | 'schwa' | 'ü' | 'ɯ' | 'ø' | 'æ' | 'ɑ' | 'ɨ' | 'ɤ';
export type Coda = 'open' | 'stop' | 'nasal' | 'glottal' | 'trill' | 'lateral' | 'fricative';
/** The pitch shape a syllable carries of its own, under the phrase's tune. */
export type Tone = 'level' | 'high' | 'low' | 'rise' | 'fall' | 'dip';
export type Phonation = 'modal' | 'creaky' | 'breathy';

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
  codaPlace: Place;
  tone: Tone;
  voice: Phonation;
  /** The vowel is through the nose. */
  nasal: boolean;
  long: boolean;
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

// --- letters ------------------------------------------------------------------

const VOWEL_OF: Record<string, Vowel> = {
  a: 'a', e: 'e', i: 'i', o: 'o', u: 'u', y: 'i',
  'ü': 'ü', 'ʉ': 'ü', 'ɯ': 'ɯ', 'ø': 'ø', 'œ': 'ø', 'æ': 'æ', 'ɑ': 'ɑ', 'ɒ': 'ɑ',
  'ɨ': 'ɨ', 'ɤ': 'ɤ', 'ə': 'schwa', 'ɐ': 'a', 'ɛ': 'e', 'ɔ': 'o', 'ʊ': 'u', 'ɪ': 'i',
};
const NASALS = new Set('mnŋ');
const STOPS = new Set('pbtdkgcqɢ');
const CLICKS = new Set('ʘǃǀǁǂ');
const IMPLOSIVES = new Set('ɓɗɠ');
const TRILLS = new Set('rʙʀ');
const HISS = new Set('szfvxχɸβ');
const HUSH = new Set('ʃʒʂɕʑj');
const BREATH = new Set('hɦħθð');
const LIQUIDS = new Set('lwyɭʎɣʕ');
/** Two letters that are one consonant. The last three only open a word. */
const DIGRAPHS = new Set(['sh', 'ch', 'th', 'zh', 'ng']);
const PRENASAL = new Set(['mb', 'nd', 'ng', 'ŋg', 'nj']);
/** Marks that hang on the letter before them: combining marks, ʼ, ʱ, ː, tone letters. */
const MARK = /[\p{M}ʼʱː˥˦˧˨˩']/u;

function placeOf(c: string): Place {
  if ('pbmwfvʘɓʙɸβ'.includes(c)) return 'lip';
  if ('tdnszlrǃǀǁǂɗθðɬʃʒʂɕʑjyɭʎ'.includes(c)) return 'ridge';
  if ('ħʕʔ'.includes(c)) return 'throat';
  return 'back';
}

/**
 * Splits a run of consonants into the consonants it is: digraphs, a letter
 * and the marks on it, and a nasal glued to a stop where a word starts.
 */
function graphemes(cluster: string, initial: boolean): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < cluster.length) {
    const c = cluster[i];
    if (MARK.test(c)) {
      // A stray mark: an apostrophe in "don't". It rides on the last letter,
      // or on nothing.
      if (out.length && c !== "'") out[out.length - 1] += c;
      i++;
      continue;
    }
    let g = c;
    const pair = cluster.slice(i, i + 2);
    if (DIGRAPHS.has(pair) || (initial && i === 0 && PRENASAL.has(pair))) g = pair;
    i += g.length;
    while (i < cluster.length && MARK.test(cluster[i])) {
      if (cluster[i] !== "'") g += cluster[i];
      i++;
    }
    out.push(g);
  }
  return out;
}

function onsetOf(g: string): { onset: Onset; place: Place } {
  if (g.length === 0) return { onset: 'none', place: 'back' };
  const c = g[0];
  if (PRENASAL.has(g.slice(0, 2)) && g.length >= 2) {
    const stop = g[1];
    return { onset: 'prenasal', place: stop === 'j' ? 'ridge' : placeOf(stop) };
  }
  if (g === 'sh' || g === 'ch' || g === 'zh') return { onset: 'hush', place: 'ridge' };
  if (g === 'th') return { onset: 'breath', place: 'ridge' };
  if (g === 'ng') return { onset: 'nasal', place: 'back' };
  if (STOPS.has(c)) {
    if (g.includes('ʼ')) return { onset: 'ejective', place: placeOf(c) };
    if (g.includes('ʱ')) return { onset: 'murmur', place: placeOf(c) };
    return { onset: 'stop', place: placeOf(c) };
  }
  if (CLICKS.has(c)) return { onset: 'click', place: placeOf(c) };
  if (IMPLOSIVES.has(c)) return { onset: 'implosive', place: placeOf(c) };
  if (TRILLS.has(c)) return { onset: 'trill', place: placeOf(c) };
  if (c === 'ɬ') return { onset: 'lateral', place: 'ridge' };
  if (c === 'ʔ') return { onset: 'glottal', place: 'throat' };
  if (NASALS.has(c)) {
    // A ring under it is a nasal with no voice in it.
    if (g.includes('̥')) return { onset: 'whisperNasal', place: placeOf(c) };
    return { onset: 'nasal', place: placeOf(c) };
  }
  if (HISS.has(c)) return { onset: 'hiss', place: placeOf(c) };
  if (HUSH.has(c)) return { onset: 'hush', place: 'ridge' };
  if (BREATH.has(c)) return { onset: 'breath', place: placeOf(c) };
  if (LIQUIDS.has(c)) return { onset: 'liquid', place: c === 'w' ? 'lip' : placeOf(c) };
  return { onset: 'stop', place: 'back' };
}

function codaOf(g: string | undefined): { coda: Coda; place: Place } {
  if (!g) return { coda: 'open', place: 'ridge' };
  const c = g[0];
  if (g === 'ng' || NASALS.has(c)) return { coda: 'nasal', place: g === 'ng' ? 'back' : placeOf(c) };
  if (c === 'ʔ') return { coda: 'glottal', place: 'throat' };
  if (TRILLS.has(c)) return { coda: 'trill', place: placeOf(c) };
  if (c === 'l' || c === 'ɭ') return { coda: 'lateral', place: 'ridge' };
  if (c === 'ɬ' || HISS.has(c) || HUSH.has(c) || g === 'sh' || g === 'th') return { coda: 'fricative', place: placeOf(c) };
  if (c === 'ħ' || c === 'h') return { coda: 'fricative', place: 'throat' };
  if (STOPS.has(c) || g.includes('ʼ')) return { coda: 'stop', place: placeOf(c) };
  return { coda: 'open', place: placeOf(c) };
}

/** What the marks on a vowel run say about it. */
function marksOf(marks: string): { tone: Tone; voice: Phonation; nasal: boolean; long: boolean } {
  let tone: Tone = 'level';
  if (marks.includes('́')) tone = 'high';
  else if (marks.includes('̀')) tone = 'low';
  else if (marks.includes('̌')) tone = 'rise';
  else if (marks.includes('̂')) tone = 'fall';
  const letters = marks.replace(/[^˥˦˧˨˩]/g, '');
  if (letters.length) {
    const h = (ch: string): number => '˩˨˧˦˥'.indexOf(ch);
    const first = h(letters[0]);
    const last = h(letters[letters.length - 1]);
    let low = 4;
    for (const ch of letters) low = Math.min(low, h(ch));
    if (letters.length >= 3 && low < first && low < last) tone = 'dip';
    else if (last > first) tone = 'rise';
    else if (last < first) tone = 'fall';
    else tone = first >= 3 ? 'high' : first <= 1 ? 'low' : 'level';
  }
  const voice: Phonation = marks.includes('̰') ? 'creaky' : marks.includes('̤') ? 'breathy' : 'modal';
  return { tone, voice, nasal: marks.includes('̃'), long: marks.includes('ː') };
}

/** Splits one word into syllables: onset consonants, a vowel group, a coda. */
function syllabify(word: string, from: number, out: Syllable[]): void {
  const lower = word.toLowerCase();
  // Runs of vowels with their marks, and the consonants between them.
  const groups: { start: number; end: number; bases: string; marks: string }[] = [];
  let i = 0;
  while (i < lower.length) {
    if (VOWEL_OF[lower[i]]) {
      const start = i;
      let bases = '';
      let marks = '';
      while (i < lower.length && (VOWEL_OF[lower[i]] || (MARK.test(lower[i]) && lower[i] !== "'"))) {
        if (VOWEL_OF[lower[i]]) bases += lower[i];
        else marks += lower[i];
        i++;
      }
      groups.push({ start, end: i, bases, marks });
    } else {
      i++;
    }
  }
  if (groups.length === 0) {
    // "hmm", "brr", "psst": one syllable on a hum.
    const parts = graphemes(lower, true);
    const { onset, place } = onsetOf(parts[0] ?? '');
    const tail = codaOf(parts[parts.length - 1]);
    out.push(blank(from, from + word.length, onset, place, 'schwa', 'schwa', tail.coda, tail.place));
    return;
  }
  // The consonants before each vowel group: all of them open the first
  // syllable; after that the last one opens and the rest close the one before.
  const opens: { g: string; start: number; codaG: string | undefined }[] = [];
  for (let g = 0; g < groups.length; g++) {
    const clusterStart = g === 0 ? 0 : groups[g - 1].end;
    const cluster = lower.slice(clusterStart, groups[g].start);
    const parts = graphemes(cluster, g === 0);
    const onsetG = g === 0 ? parts[0] ?? '' : parts[parts.length - 1] ?? '';
    const codaG = g === 0 ? undefined : parts.length > 1 ? parts[parts.length - 2] : undefined;
    const start = g === 0 ? 0 : clusterStart + cluster.length - onsetG.length;
    opens.push({ g: onsetG, start, codaG });
  }
  const last = graphemes(lower.slice(groups[groups.length - 1].end), false);
  for (let g = 0; g < groups.length; g++) {
    const group = groups[g];
    const { onset, place } = onsetOf(opens[g].g);
    const vowel = VOWEL_OF[group.bases[0]];
    // A second different vowel letter is a glide; a doubled one just holds.
    const lastV = VOWEL_OF[group.bases[group.bases.length - 1]];
    const glide = group.bases.length > 1 && lastV !== vowel ? lastV : vowel;
    const next = opens[g + 1];
    const end = next ? next.start : lower.length;
    const tail = codaOf(next ? next.codaG : last[last.length - 1]);
    const s = blank(from + opens[g].start, from + end, onset, place, vowel, glide, tail.coda, tail.place);
    Object.assign(s, marksOf(group.marks));
    out.push(s);
  }
}

function blank(
  from: number, to: number, onset: Onset, place: Place, vowel: Vowel, glide: Vowel, coda: Coda, codaPlace: Place,
): Syllable {
  return {
    from, to, onset, place, vowel, glide, coda, codaPlace,
    tone: 'level', voice: 'modal', nasal: false, long: false,
    stress: 0, pause: 0, tune: 'statement', along: 0, final: false,
  };
}

/** Seconds of silence a mark buys. */
const PAUSES: Record<string, number> = { ',': 0.26, ';': 0.32, ':': 0.3, '.': 0.55, '!': 0.5, '?': 0.55, '—': 0.4, '-': 0.12, '…': 0.7 };

/**
 * Scores a line. Words become syllables; punctuation becomes pauses on the
 * syllable before it; the terminal mark of each sentence sets its tune.
 */
export function score(raw: string): Score {
  // Decomposed, so an accent is a mark after its vowel and not another letter.
  const text = raw.normalize('NFD');
  const syllables: Syllable[] = [];
  const re = /[\p{L}\p{M}\p{Sk}0-9']+|[^\p{L}\p{M}\p{Sk}0-9'\s]+|\s+/gu;
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
    if (/^[\p{L}\p{M}\p{Sk}0-9']/u.test(token)) {
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
 * Written in the little language and scored like anything else.
 */
export const GREETINGS: readonly string[] = [
  'ǃaɬúm!', 'ʘoʔó?', 'tʼɨka, tʼɨkâ', 'ɓaŋǔ!', 'χoʔɯ̀?',
  'ʀæmíːl', 'ndoʔ, tʼê!', 'ħãlú?', 'mbìrá', 'ɬeʕǒ!',
  'kʼɤ̰pʼi?', 'ɗolǀû', 'm̥ǎ, m̥ǎ', 'ʙuxà!', 'bʱa̤ʔ',
  'ŋɯ̂r?', 'ǃóǃò', 'tʼãɬ!', 'ħǔlɨʔ', 'ɠaʀáx?',
  'pʼɨ̰ma̰!', 'ʘúʔù?', 'xøːʔ, xøː!', 'ɓǐɓì', 'ǂǎŋ, ǂǎŋ!',
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
 * is over — no clusters — but the consonants come from the far end of the
 * chart and the vowels carry tone. English cannot be built out of this.
 */
const ONSETS: readonly [Onset, Place][] = [
  ['stop', 'lip'], ['stop', 'ridge'], ['stop', 'back'], ['nasal', 'lip'], ['nasal', 'ridge'], ['nasal', 'back'],
  ['liquid', 'ridge'], ['liquid', 'lip'], ['none', 'back'],
  ['ejective', 'ridge'], ['ejective', 'back'], ['implosive', 'lip'], ['implosive', 'ridge'],
  ['click', 'ridge'], ['click', 'lip'], ['trill', 'ridge'], ['trill', 'back'],
  ['lateral', 'ridge'], ['glottal', 'throat'], ['breath', 'throat'], ['liquid', 'throat'],
  ['prenasal', 'lip'], ['prenasal', 'ridge'], ['whisperNasal', 'lip'], ['hiss', 'back'],
];
const VOWEL_LIST: readonly Vowel[] = ['a', 'e', 'i', 'o', 'u', 'ü', 'ɯ', 'ø', 'æ', 'ɑ', 'ɨ', 'ɤ'];
const TONES: readonly Tone[] = ['level', 'level', 'high', 'low', 'rise', 'fall', 'dip'];
const CODAS: readonly [Coda, Place][] = [
  ['open', 'ridge'], ['open', 'ridge'], ['open', 'ridge'], ['nasal', 'ridge'], ['nasal', 'lip'],
  ['glottal', 'throat'], ['stop', 'back'], ['trill', 'ridge'], ['lateral', 'ridge'], ['fricative', 'ridge'],
];

/**
 * A score of nothing in particular, for a creature with nothing written to
 * say. `count` syllables in words of one to three; within a word the opening
 * consonant repeats as often as it changes and the vowel mostly holds, so
 * words come out as ǃiǃi, tʼuka, ndanona. Deterministic in `random`.
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
    const [coda, codaPlace] = random() < 0.35 ? pick(CODAS) : CODAS[0];
    const s = blank(i, i + 1, onset, place, vowel, glide, coda, codaPlace);
    s.tone = pick(TONES);
    s.nasal = random() < 0.15;
    s.voice = random() < 0.1 ? 'creaky' : random() < 0.08 ? 'breathy' : 'modal';
    s.long = random() < 0.12;
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
  return { text: spell(syllables), syllables };
}

/** The letter each onset would be written with, by where it is made. */
const LETTERS: Record<Onset, Record<Place, string>> = {
  none: { lip: '', ridge: '', back: '', throat: '' },
  stop: { lip: 'b', ridge: 'd', back: 'g', throat: 'ʔ' },
  nasal: { lip: 'm', ridge: 'n', back: 'ŋ', throat: 'n' },
  liquid: { lip: 'w', ridge: 'l', back: 'ɣ', throat: 'ʕ' },
  hiss: { lip: 'ɸ', ridge: 's', back: 'x', throat: 'ħ' },
  hush: { lip: 'ʃ', ridge: 'ʃ', back: 'ʃ', throat: 'ʃ' },
  breath: { lip: 'f', ridge: 'θ', back: 'h', throat: 'ħ' },
  ejective: { lip: 'pʼ', ridge: 'tʼ', back: 'kʼ', throat: 'ʔ' },
  implosive: { lip: 'ɓ', ridge: 'ɗ', back: 'ɠ', throat: 'ɠ' },
  click: { lip: 'ʘ', ridge: 'ǃ', back: 'ǁ', throat: 'ǁ' },
  trill: { lip: 'ʙ', ridge: 'r', back: 'ʀ', throat: 'ʀ' },
  lateral: { lip: 'ɬ', ridge: 'ɬ', back: 'ɬ', throat: 'ɬ' },
  glottal: { lip: 'ʔ', ridge: 'ʔ', back: 'ʔ', throat: 'ʔ' },
  murmur: { lip: 'bʱ', ridge: 'dʱ', back: 'gʱ', throat: 'ɦ' },
  whisperNasal: { lip: 'm̥', ridge: 'n̥', back: 'ŋ̊', throat: 'n̥' },
  prenasal: { lip: 'mb', ridge: 'nd', back: 'ŋg', throat: 'ŋg' },
};
const VOWEL_LETTER: Record<Vowel, string> = {
  a: 'a', e: 'e', i: 'i', o: 'o', u: 'u', schwa: 'ə', 'ü': 'ü', 'ɯ': 'ɯ', 'ø': 'ø', 'æ': 'æ', 'ɑ': 'ɑ', 'ɨ': 'ɨ', 'ɤ': 'ɤ',
};
const TONE_MARK: Record<Tone, string> = { level: '', high: '́', low: '̀', rise: '̌', fall: '̂', dip: '˨˩˦' };
const CODA_LETTER: Record<Coda, Record<Place, string>> = {
  open: { lip: '', ridge: '', back: '', throat: '' },
  stop: { lip: 'p', ridge: 't', back: 'k', throat: 'ʔ' },
  nasal: { lip: 'm', ridge: 'n', back: 'ŋ', throat: 'n' },
  glottal: { lip: 'ʔ', ridge: 'ʔ', back: 'ʔ', throat: 'ʔ' },
  trill: { lip: 'ʙ', ridge: 'r', back: 'ʀ', throat: 'ʀ' },
  lateral: { lip: 'l', ridge: 'l', back: 'l', throat: 'l' },
  fricative: { lip: 'ɸ', ridge: 'ɬ', back: 'x', throat: 'ħ' },
};

/**
 * Writes a score back out as the word it would be if it were one.
 *
 * Made-up syllables have no spelling of their own, and a line of babble is
 * otherwise nameless — there is nothing to point at when one of them sounds
 * wrong. This is what `Utterance.text` carries for a line nobody wrote.
 */
export function spell(syllables: readonly Syllable[]): string {
  let out = '';
  for (const s of syllables) {
    out += LETTERS[s.onset][s.place];
    const mark = TONE_MARK[s.tone];
    const marks = (mark.length === 1 ? mark : '') + (s.nasal ? '̃' : '') + (s.voice === 'creaky' ? '̰' : s.voice === 'breathy' ? '̤' : '');
    out += VOWEL_LETTER[s.vowel] + marks;
    if (s.glide !== s.vowel) out += VOWEL_LETTER[s.glide];
    if (s.long) out += 'ː';
    if (mark.length > 1) out += mark;
    out += CODA_LETTER[s.coda][s.codaPlace];
    if (s.pause >= 0.2) out += s.pause >= 0.45 ? '. ' : ', ';
    else if (s.pause > 0) out += ' ';
  }
  return out.trim();
}
