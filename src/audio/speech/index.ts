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
 * The letters are IPA — `phonemes` is the whole chart and the only place that
 * knows which letter is which sound. On a vowel, `á à ǎ â` and `a˨˩˦` are
 * tones, `ã` is through the nose, `a̰` creaks, `a̤` breathes, `aː` is long.
 */

export {
  OPEN, sound, spellConsonant, VOWEL_OF,
  type Consonant, type Manner, type Phonation, type Place, type Shade,
  type Tone, type Voicing, type Vowel,
} from './phonemes';
export { blank, score, spell, type Score, type Syllable, type Tune } from './parse';
export { LECTS, lectOf, pick, type Draw, type Lect } from './lects';
export { babbleScore, chatterScore, farewellScore, greetScore, GREETINGS } from './babble';
