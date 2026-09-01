/**
 * Text into a score of syllables.
 *
 * A word is split at its vowels: the consonants before each vowel group open a
 * syllable, the ones left over shut the one before it, and the marks on the
 * vowel say what the folds and the pitch do. The consonants themselves are
 * matched longest-first against `phonemes`, so `tʃ`, `mb`, `tʼ` and `pʰ` are
 * all one lookup and there is no separate list of digraphs.
 */

import {
  COLOUR, MATCHES, OPEN, PRENASAL_MATCHES, VOWEL_OF, spellConsonant,
  type Consonant, type Phonation, type Tone, type Vowel,
} from './phonemes';

export type Tune = 'statement' | 'question' | 'exclaim' | 'lilt';

export interface Syllable {
  /** Character range in the text this syllable reveals, end exclusive. */
  from: number;
  to: number;
  onset: Consonant;
  /** The vowel it opens on, and the one it moves to (the same for a pure one). */
  vowel: Vowel;
  glide: Vowel;
  coda: Consonant;
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

export interface Score {
  text: string;
  syllables: Syllable[];
}

/** Marks that hang on the letter before them: combining marks, ʼ, ʱ, ː, tone letters. */
const MARK = /[\p{M}ʼʱː˥˦˧˨˩']/u;

/**
 * Splits a run of consonants into the consonants it is. `initial` allows the
 * prenasalised stops, which only open a word.
 */
function consonants(cluster: string, initial: boolean): { c: Consonant; text: string }[] {
  const out: { c: Consonant; text: string }[] = [];
  let i = 0;
  while (i < cluster.length) {
    let hit: { c: Consonant; text: string } | null = null;
    if (initial && i === 0) {
      for (const [letter, sound] of PRENASAL_MATCHES) {
        if (cluster.startsWith(letter, i)) { hit = { c: sound, text: letter }; break; }
      }
    }
    if (!hit) {
      for (const [letter, sound] of MATCHES) {
        if (cluster.startsWith(letter, i)) { hit = { c: sound, text: letter }; break; }
      }
    }
    if (!hit) {
      // A stray mark — an apostrophe in "don't", a tone letter that ran on —
      // or a letter nothing writes. It takes up room and makes no sound.
      if (out.length && MARK.test(cluster[i]) && cluster[i] !== "'") out[out.length - 1].text += cluster[i];
      i++;
      continue;
    }
    i += hit.text.length;
    // Then whatever is held through it: a colour, or a doubled length.
    while (i < cluster.length) {
      const colour = COLOUR[cluster[i]];
      if (colour) hit = { c: { ...hit.c, colour }, text: hit.text + cluster[i] };
      else if (cluster[i] === 'ː') hit = { c: { ...hit.c, long: true }, text: `${hit.text}ː` };
      else break;
      i++;
    }
    out.push(hit);
  }
  return out;
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
  const voice: Phonation =
    marks.includes('̰') ? 'creaky'
      : marks.includes('̤') ? 'breathy'
        : marks.includes('̥') ? 'whisper'
          : marks.includes('͈') ? 'harsh'
            : 'modal';
  return { tone, voice, nasal: marks.includes('̃'), long: marks.includes('ː') };
}

export function blank(
  from: number, to: number, onset: Consonant, vowel: Vowel, glide: Vowel, coda: Consonant,
): Syllable {
  return {
    from, to, onset, vowel, glide, coda,
    tone: 'level', voice: 'modal', nasal: false, long: false,
    stress: 0, pause: 0, tune: 'statement', along: 0, final: false,
  };
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
    const parts = consonants(lower, true);
    const onset = parts[0]?.c ?? OPEN;
    const tail = parts.length ? codaOf(parts[parts.length - 1].c) : OPEN;
    out.push(blank(from, from + word.length, onset, 'ə', 'ə', tail));
    return;
  }
  // The consonants before each vowel group: all of them open the first
  // syllable; after that the last one opens and the rest close the one before.
  const opens: { c: Consonant; start: number; coda: Consonant }[] = [];
  for (let g = 0; g < groups.length; g++) {
    const clusterStart = g === 0 ? 0 : groups[g - 1].end;
    const cluster = lower.slice(clusterStart, groups[g].start);
    const parts = consonants(cluster, g === 0);
    const onset = g === 0 ? parts[0] : parts[parts.length - 1];
    const coda = g === 0 ? undefined : parts.length > 1 ? parts[parts.length - 2] : undefined;
    const start = g === 0 ? 0 : clusterStart + cluster.length - (onset?.text.length ?? 0);
    opens.push({ c: onset?.c ?? OPEN, start, coda: coda ? codaOf(coda.c) : OPEN });
  }
  const last = consonants(lower.slice(groups[groups.length - 1].end), false);
  for (let g = 0; g < groups.length; g++) {
    const group = groups[g];
    const vowel = VOWEL_OF[group.bases[0]];
    // A second different vowel letter is a glide; a doubled one just holds.
    const lastV = VOWEL_OF[group.bases[group.bases.length - 1]];
    const glide = group.bases.length > 1 && lastV !== vowel ? lastV : vowel;
    const next = opens[g + 1];
    const end = next ? next.start : lower.length;
    const tail = next ? next.coda : last.length ? codaOf(last[last.length - 1].c) : OPEN;
    const s = blank(from + opens[g].start, from + end, opens[g].c, vowel, glide, tail);
    Object.assign(s, marksOf(group.marks));
    out.push(s);
  }
}

/**
 * The same consonant, said on the way out of a syllable rather than into one.
 *
 * A coda is the whole bundle, so a syllable may shut on anything an onset can
 * open with. Only the airstreams have nowhere to go at the end of a syllable
 * and are dropped to a plain closure.
 */
function codaOf(x: Consonant): Consonant {
  // An h has no constriction of its own to hold, so on the way out it becomes
  // the one place a breath can be heard shutting a syllable: the throat.
  if (x.manner === 'breath') return { ...x, manner: 'fricative', place: 'throat' };
  if (x.air || x.attack) return { manner: x.manner, place: x.place, voice: x.voice, shade: x.shade };
  return x;
}

/**
 * Seconds of silence a mark buys, before the lect's `pauseScale`. A sentence
 * mark is the one that has to read as a sentence ending: a fast conversational
 * gap is around 0.6 s and a slower one around 1 s, which is where the two
 * peoples land either side of these.
 */
export const PAUSES: Record<string, number> = {
  ',': 0.38, ';': 0.48, ':': 0.45, '.': 0.8, '!': 0.72, '?': 0.82, '—': 0.55, '-': 0.16, '…': 1,
};

/**
 * Scores a line. Words become syllables; punctuation becomes pauses on the
 * syllable before it; the terminal mark of each sentence sets its tune.
 */
export function score(raw: string): Score {
  // Decomposed, so an accent is a mark after its vowel and not another letter.
  // `ü` is the exception: decomposing it would leave a u with a mark on it,
  // and it is a vowel of its own with a row of its own.
  const text = raw.normalize('NFD').replace(/ü/g, 'ü');
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

const TONE_MARK: Record<Tone, string> = { level: '', high: '́', low: '̀', rise: '̌', fall: '̂', dip: '˨˩˦' };
/** How the folds are set, under the vowel. */
const VOICE_MARK: Record<Phonation, string> =
  { modal: '', creaky: '̰', breathy: '̤', whisper: '̥', harsh: '͈' };

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
    out += spellConsonant(s.onset);
    const mark = TONE_MARK[s.tone];
    const marks =
      (mark.length === 1 ? mark : '') +
      (s.nasal ? '̃' : '') + VOICE_MARK[s.voice];
    out += s.vowel + marks;
    if (s.glide !== s.vowel) out += s.glide;
    if (s.long) out += 'ː';
    if (mark.length > 1) out += mark;
    out += spellConsonant(s.coda);
    if (s.pause >= 0.2) out += s.pause >= 0.45 ? '. ' : ', ';
    else if (s.pause > 0) out += ' ';
  }
  return out.trim();
}
