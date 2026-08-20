/**
 * Lines for a creature with nothing written to say: the written banks, and a
 * score of nothing in particular drawn from the chart.
 */

import { OPEN, sound, type Consonant, type Tone, type Vowel } from './phonemes';
import { blank, score, spell, type Score, type Syllable, type Tune } from './parse';

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
const ONSETS: readonly Consonant[] = [
  sound('b'), sound('d'), sound('g'), sound('m'), sound('n'), sound('ŋ'),
  sound('l'), sound('w'), OPEN,
  sound('tʼ'), sound('kʼ'), sound('ɓ'), sound('ɗ'),
  sound('ǃ'), sound('ʘ'), sound('r'), sound('ʀ'),
  sound('ɬ'), sound('ʔ'), sound('ħ'), sound('ʕ'),
  sound('mb'), sound('nd'), sound('m̥'), sound('x'),
];
const VOWELS: readonly Vowel[] = ['a', 'e', 'i', 'o', 'u', 'ü', 'ɯ', 'ø', 'æ', 'ɑ', 'ɨ', 'ɤ'];
const TONES: readonly Tone[] = ['level', 'level', 'high', 'low', 'rise', 'fall', 'dip'];
const CODAS: readonly Consonant[] = [
  OPEN, OPEN, OPEN, sound('n'), sound('m'),
  sound('ʔ'), sound('k'), sound('r'), sound('l'), sound('ɬ'),
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
  let colour = pick(VOWELS);
  for (let i = 0; i < count; i++) {
    const onset = inWord === 0 || random() < 0.5 ? root : pick(ONSETS);
    const vowel = inWord === 0 || random() < 0.6 ? colour : pick(VOWELS);
    // A quarter of them sing up onto an i or a u on the way out.
    const glide: Vowel = random() < 0.25 ? (random() < 0.5 ? 'i' : 'u') : vowel;
    const coda = random() < 0.35 ? pick(CODAS) : CODAS[0];
    const s = blank(i, i + 1, onset, vowel, glide, coda);
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
      colour = pick(VOWELS);
      s.pause = random() < 0.15 ? 0.26 : 0.05;
    }
    syllables.push(s);
  }
  if (syllables.length) syllables[syllables.length - 1].pause = 0.5;
  return { text: spell(syllables), syllables };
}
