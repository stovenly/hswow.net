/**
 * English in, the speaker's own language out.
 *
 * The mapping is a language, not a shuffle: an English word hashes to a seed,
 * the seed builds one word out of that people's own onsets, vowels, codas and
 * tones, and the answer is cached — so the same English word is the same word
 * in the mouth of every speaker of that people, forever. The commonest
 * function words are fixed short particles, because grammar-like recurrence is
 * what makes sustained speech sound like a language rather than noise.
 *
 * Sentence shape rides the machinery `parse.ts` already has: tune, position
 * along the sentence, the final rise and the written pauses all come off the
 * *English* punctuation, so a question rises and a statement declines through
 * code that already runs.
 */

import { blank, PAUSES, type Score, type Syllable, type Tune } from './parse';
import { pick, type Lect } from './lects';
import type { Consonant, Vowel } from './phonemes';
import type { LectName } from '../voice/types';

/**
 * The English words that carry grammar rather than meaning. Each becomes one
 * short particle in the lect, unstressed and level-toned, so it reduces the way
 * a real function word does and recurs the way one does.
 */
const PARTICLES = [
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'at',
  'is', 'are', 'was', 'be', 'it', 'that', 'this', 'you', 'we', 'i',
  'for', 'with', 'not', 'do', 'have', 'as', 'but', 'so', 'they', 'them',
];

const PARTICLE_SET = new Set(PARTICLES);

/** One built word per lect per English word. Built once, said forever. */
const banks = new Map<LectName, Map<string, Syllable[]>>();

function hash(text: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < text.length; i += 1) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** A stream of 0..1 from one seed. The house shape, in one place. */
function stream(seed: number): () => number {
  let n = 0;
  return () => {
    let h = Math.imul(seed ^ (n++ * 2654435761), 2246822519) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 3266489917) >>> 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
}

/** How many syllables the English word has, by its vowel groups. */
function englishSyllables(word: string): number {
  const groups = word.toLowerCase().match(/[aeiouy]+/g);
  return Math.max(1, groups?.length ?? 1);
}

/**
 * Builds one lect word. Length follows the English word's, held inside the
 * lect's own habits; within a word the opening consonant repeats as often as
 * it changes and the vowel mostly holds, which is the same habit babble has.
 */
function buildWord(english: string, lect: Lect, particle: boolean): Syllable[] {
  const random = stream(hash(english, particle ? 17 : 3));
  const [shortest, longest] = lect.wordLength;
  const count = particle
    ? 1
    : Math.min(Math.max(englishSyllables(english), shortest), longest);

  const onset = (): Consonant => {
    const drawn = pick(lect.onsets, random);
    return lect.colour && random() < lect.colourRate ? { ...drawn, colour: lect.colour } : drawn;
  };
  const root = onset();
  const colour = pick(lect.vowels, random);

  const out: Syllable[] = [];
  for (let i = 0; i < count; i += 1) {
    const head = i === 0 || random() < 0.5 ? root : onset();
    const vowel = i === 0 || random() < 0.6 ? colour : pick(lect.vowels, random);
    const glide: Vowel = random() < 0.25 ? pick(lect.vowels, random) : vowel;
    const coda = random() < 0.35 ? pick(lect.codas, random) : lect.codas[0].of;
    const s = blank(0, 0, head, vowel, glide, coda);
    s.tone = particle ? 'level' : lect.tones[Math.floor(random() * lect.tones.length)];
    s.nasal = random() < lect.nasalRate;
    s.voice = random() < lect.creakRate ? 'creaky' : random() < lect.breathRate ? 'breathy' : 'modal';
    s.long = !particle && random() < lect.longRate;
    // Word-initial carries the stress, as everywhere else; a particle carries
    // almost none, which is what makes it read as grammar.
    s.stress = particle ? 0.2 : i === 0 ? (count > 1 ? 1 : 0.7) : 0.25;
    out.push(s);
  }
  return out;
}

function wordFor(english: string, lect: Lect, name: LectName): readonly Syllable[] {
  let bank = banks.get(name);
  if (!bank) {
    bank = new Map();
    banks.set(name, bank);
  }
  const key = english.toLowerCase().replace(/[^a-z0-9']/g, '');
  const held = bank.get(key);
  if (held) return held;
  const made = buildWord(key || english.toLowerCase(), lect, PARTICLE_SET.has(key));
  bank.set(key, made);
  return made;
}

/**
 * The English line as this people would say it. `Score.text` stays the English
 * and every syllable's range points into it, so a reveal shows the English as
 * its translation is voiced.
 */
export function loan(text: string, lect: Lect, name: LectName): Score {
  const syllables: Syllable[] = [];
  // The same tokens `parse.ts` splits on, so a range here means what one there
  // would mean.
  const re = /[\p{L}\p{M}\p{Sk}0-9']+|[^\p{L}\p{M}\p{Sk}0-9'\s]+|\s+/gu;
  let sentenceStart = 0;
  const closeSentence = (tune: Tune): void => {
    const run = syllables.slice(sentenceStart);
    const n = run.length;
    run.forEach((s, i) => {
      s.tune = tune;
      s.along = n > 1 ? i / (n - 1) : 1;
      s.final = tune === 'question' && i >= n - 2;
    });
    // Final lengthening: the last vowel of a sentence is held.
    const last = run[n - 1];
    if (last) last.long = true;
    sentenceStart = syllables.length;
  };

  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const token = m[0];
    if (/^\s+$/.test(token)) {
      const last = syllables[syllables.length - 1];
      if (last) last.pause = Math.max(last.pause, 0.05);
      continue;
    }
    if (/^[\p{L}\p{M}\p{Sk}0-9']/u.test(token)) {
      const from = m.index;
      const to = m.index + token.length;
      for (const template of wordFor(token, lect, name)) {
        syllables.push({ ...template, from, to });
      }
      continue;
    }
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
  for (const s of syllables) s.pause *= lect.pauseScale;
  return { text, syllables };
}
