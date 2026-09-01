/**
 * Lines for a creature with nothing written to say: the written banks, and a
 * score of nothing in particular drawn from a people's own inventory.
 */

import { type Consonant, type Vowel } from './phonemes';
import { blank, score, spell, type Score, type Syllable, type Tune } from './parse';
import { pick, type Lect } from './lects';

/**
 * The hellos every people said before they had their own. Kept as the bank a
 * lect falls back on, so a people written with no lines of its own still
 * speaks.
 */
export const GREETINGS: readonly string[] = [
  'ǃaɬúm!', 'ʘoʔó?', 'tʼɨka, tʼɨkâ', 'ɓaŋǔ!', 'χoʔɯ̀?',
  'ʀæmíːl', 'ndoʔ, tʼê!', 'ħãlú?', 'mbìrá', 'ɬeʕǒ!',
  'kʼɤ̰pʼi?', 'ɗolǀû', 'm̥ǎ, m̥ǎ', 'ʙuxà!', 'bʱa̤ʔ',
  'ŋɯ̂r?', 'ǃóǃò', 'tʼãɬ!', 'ħǔlɨʔ', 'ɠaʀáx?',
  'pʼɨ̰ma̰!', 'ʘúʔù?', 'xøːʔ, xøː!', 'ɓǐɓì', 'ǂǎŋ, ǂǎŋ!',
];

/**
 * The last few said out of each bank, so none of them comes round twice
 * running. Per bank: a villager and a cityfolk do not step on each other.
 */
const lately = new WeakMap<readonly string[], number[]>();

/** A line from `bank`, stepped along if it has just been heard. */
function fromBank(bank: readonly string[], seed: number): Score {
  let said = lately.get(bank);
  if (!said) {
    said = [];
    lately.set(bank, said);
  }
  let i = Math.abs(Math.floor(seed)) % bank.length;
  for (let n = 0; n < bank.length && said.includes(i); n++) i = (i + 7) % bank.length;
  said.push(i);
  if (said.length > 4) said.shift();
  return score(bank[i]);
}

/** A villager's own hello. */
export function greetScore(seed: number, lect: Lect): Score {
  const bank = lect.greetings.length ? lect.greetings : GREETINGS;
  const sc = fromBank(bank, seed);
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
 * A villager's own goodbye: whatever it is written as, said as a statement, so
 * the pitch falls across it rather than lifting at the end.
 */
export function farewellScore(seed: number, lect: Lect): Score {
  const bank = lect.farewells.length ? lect.farewells : lect.greetings;
  const sc = fromBank(bank, seed);
  const last = sc.syllables.length - 1;
  sc.syllables.forEach((s, k) => {
    s.tune = 'statement';
    s.final = false;
    s.along = last > 0 ? k / last : 1;
  });
  if (last >= 0) sc.syllables[last].long = true;
  return sc;
}

/** A written line of talk, or nothing if this people has none written. */
export function chatterScore(seed: number, lect: Lect): Score | null {
  return lect.chatter.length ? fromBank(lect.chatter, seed) : null;
}

/**
 * A score of nothing in particular, for a creature with nothing written to
 * say. `count` syllables in words of the lect's length; within a word the
 * opening consonant repeats as often as it changes and the vowel mostly
 * holds, so words come out as ǃiǃi, tʼuka, ndanona. Deterministic in `random`.
 */
export function babbleScore(count: number, tune: Tune, random: () => number, lect: Lect): Score {
  const syllables: Syllable[] = [];
  const [shortest, longest] = lect.wordLength;
  const span = longest - shortest + 1;
  const word = (): number => shortest + Math.floor(random() * span);
  const onset = (): Consonant => {
    const drawn = pick(lect.onsets, random);
    // The colour is what keeps two peoples apart on a phoneme they share.
    return lect.colour && random() < lect.colourRate ? { ...drawn, colour: lect.colour } : drawn;
  };
  let inWord = 0;
  let wordLength = word();
  let root = onset();
  let colour = pick(lect.vowels, random);
  for (let i = 0; i < count; i++) {
    const head = inWord === 0 || random() < 0.5 ? root : onset();
    const vowel = inWord === 0 || random() < 0.6 ? colour : pick(lect.vowels, random);
    // A quarter of them sing up onto a close vowel on the way out.
    const glide: Vowel = random() < 0.25 ? pick(lect.vowels, random) : vowel;
    const coda = random() < 0.35 ? pick(lect.codas, random) : lect.codas[0].of;
    const s = blank(i, i + 1, head, vowel, glide, coda);
    s.tone = lect.tones[Math.floor(random() * lect.tones.length)];
    s.nasal = random() < lect.nasalRate;
    s.voice = random() < lect.creakRate ? 'creaky' : random() < lect.breathRate ? 'breathy' : 'modal';
    s.long = random() < lect.longRate;
    s.stress = inWord === 0 ? (wordLength > 1 ? 1 : 0.7) : 0.25;
    s.tune = tune;
    s.along = count > 1 ? i / (count - 1) : 1;
    s.final = tune === 'question' ? i >= count - 2 : tune === 'lilt' && i >= count - 1;
    inWord++;
    if (inWord >= wordLength) {
      inWord = 0;
      wordLength = word();
      root = onset();
      colour = pick(lect.vowels, random);
      s.pause = random() < 0.15 ? 0.26 : 0.05;
    }
    syllables.push(s);
  }
  if (syllables.length) syllables[syllables.length - 1].pause = 0.5;
  return { text: spell(syllables), syllables };
}
