/**
 * The chart. A consonant is a bundle of features, not a name.
 *
 * The writer has one case per *manner* — twelve of them — and everything else
 * here is a decoration applied around that core: which way the folds are set,
 * what happens before the closure, what it opens into, whether a second
 * constriction is held through it. That is what lets a hundred consonants be
 * twelve cases instead of a hundred, and it is why murmur, prenasalisation and
 * the ejectives stopped being manners of their own.
 *
 * The letters are IPA. This table is the only place that knows which letter is
 * which sound: the parser matches longest-first against it and `spell` reads it
 * backwards.
 */

/** Where in the mouth. `throat` is the pharynx; `glottis` is the folds alone. */
export type Place = 'lip' | 'ridge' | 'palate' | 'back' | 'uvula' | 'throat' | 'glottis';

/** One writer case each. */
export type Manner =
  | 'none' | 'stop' | 'fricative' | 'nasal' | 'trill' | 'tap'
  | 'approximant' | 'lateral' | 'lateralFricative' | 'click'
  | 'glottal' | 'breath';

/**
 * Which channel the tip makes at the ridge.
 *
 * The tip sits at a fixed place along the tract, so dental, alveolar and
 * post-alveolar are not separable by *where* it is. They are separable by how
 * wide the gap is, where the body sits behind it and what the lips do — which
 * is how `s` and `ʃ` have always been told apart here.
 */
export type Shade = 'plain' | 'hush' | 'retroflex' | 'alveolopalatal' | 'dental' | 'lateral';

export type Voicing = 'off' | 'on' | 'murmur' | 'creak';

export interface Consonant {
  manner: Manner;
  place: Place;
  /** The folds through the constriction. */
  voice: Voicing;
  /** Airstream. Absent is pulmonic. */
  air?: 'ejective' | 'implosive';
  /** What happens before the constriction. */
  attack?: 'prenasal' | 'preaspirated';
  /** What it opens into. */
  release?: 'aspirated' | 'affricated' | 'nasal' | 'lateral';
  /** A second constriction held through it. */
  colour?: 'round' | 'palatal' | 'velar' | 'pharyngeal';
  /** Only meaningful at the ridge. */
  shade?: Shade;
  /** Geminate: the closure is held twice as long. */
  long?: boolean;
}

/** No consonant at all: a syllable that opens on its vowel, or shuts on nothing. */
export const OPEN: Consonant = { manner: 'none', place: 'glottis', voice: 'on' };

export type Vowel =
  | 'a' | 'e' | 'i' | 'o' | 'u' | 'ə' | 'ü' | 'ɯ' | 'ø' | 'æ' | 'ɑ' | 'ɨ' | 'ɤ'
  | 'ɛ' | 'œ' | 'ɔ' | 'ʌ' | 'ɪ' | 'ʊ' | 'ɐ' | 'ɜ' | 'ɵ' | 'ʉ' | 'ɒ' | 'ɶ' | 'ɚ';

/** The pitch shape a syllable carries of its own, under the phrase's tune. */
export type Tone = 'level' | 'high' | 'low' | 'rise' | 'fall' | 'dip';
export type Phonation = 'modal' | 'creaky' | 'breathy' | 'whisper' | 'harsh';

const c = (
  manner: Manner, place: Place, voice: Voicing, extra: Partial<Consonant> = {},
): Consonant => ({ manner, place, voice, ...extra });

/**
 * Letter to sound. Order matters twice over: the parser tries longer keys
 * first, and `spell` takes the first letter that writes a given bundle.
 */
export const CONSONANTS: readonly (readonly [string, Consonant])[] = [
  // Stops. Voiced and voiceless are the same gesture with the folds set
  // differently and the release moved.
  ['b', c('stop', 'lip', 'on')],
  ['d', c('stop', 'ridge', 'on')],
  ['g', c('stop', 'back', 'on')],
  ['p', c('stop', 'lip', 'off')],
  ['t', c('stop', 'ridge', 'off')],
  ['k', c('stop', 'back', 'off')],
  ['ɟ', c('stop', 'palate', 'on')],
  ['c', c('stop', 'palate', 'off')],
  ['ɢ', c('stop', 'uvula', 'on')],
  ['q', c('stop', 'uvula', 'off')],
  ['pʰ', c('stop', 'lip', 'off', { release: 'aspirated' })],
  ['tʰ', c('stop', 'ridge', 'off', { release: 'aspirated' })],
  ['cʰ', c('stop', 'palate', 'off', { release: 'aspirated' })],
  ['kʰ', c('stop', 'back', 'off', { release: 'aspirated' })],
  ['qʰ', c('stop', 'uvula', 'off', { release: 'aspirated' })],
  ['pʼ', c('stop', 'lip', 'off', { air: 'ejective' })],
  ['tʼ', c('stop', 'ridge', 'off', { air: 'ejective' })],
  ['cʼ', c('stop', 'palate', 'off', { air: 'ejective' })],
  ['kʼ', c('stop', 'back', 'off', { air: 'ejective' })],
  ['qʼ', c('stop', 'uvula', 'off', { air: 'ejective' })],
  ['ɓ', c('stop', 'lip', 'on', { air: 'implosive' })],
  ['ɗ', c('stop', 'ridge', 'on', { air: 'implosive' })],
  ['ʄ', c('stop', 'palate', 'on', { air: 'implosive' })],
  ['ɠ', c('stop', 'back', 'on', { air: 'implosive' })],
  ['bʱ', c('stop', 'lip', 'murmur')],
  ['dʱ', c('stop', 'ridge', 'murmur')],
  ['ɟʱ', c('stop', 'palate', 'murmur')],
  ['gʱ', c('stop', 'back', 'murmur')],
  ['ʈ', c('stop', 'ridge', 'off', { shade: 'retroflex' })],
  ['ɖ', c('stop', 'ridge', 'on', { shade: 'retroflex' })],
  ['ʔ', c('glottal', 'glottis', 'off')],

  // Affricates: a stop that opens into its own channel and holds it there
  // instead of opening all the way.
  ['ts', c('stop', 'ridge', 'off', { release: 'affricated', shade: 'plain' })],
  ['dz', c('stop', 'ridge', 'on', { release: 'affricated', shade: 'plain' })],
  ['tʃ', c('stop', 'ridge', 'off', { release: 'affricated', shade: 'hush' })],
  ['dʒ', c('stop', 'ridge', 'on', { release: 'affricated', shade: 'hush' })],
  ['tɕ', c('stop', 'ridge', 'off', { release: 'affricated', shade: 'alveolopalatal' })],
  ['dʑ', c('stop', 'ridge', 'on', { release: 'affricated', shade: 'alveolopalatal' })],
  ['tɬ', c('stop', 'ridge', 'off', { release: 'affricated', shade: 'lateral' })],
  ['pf', c('stop', 'lip', 'off', { release: 'affricated' })],
  ['kx', c('stop', 'back', 'off', { release: 'affricated' })],
  ['qχ', c('stop', 'uvula', 'off', { release: 'affricated' })],

  // Fricatives. `s` and `ʃ` differ by the shade, not by where the tip is.
  ['s', c('fricative', 'ridge', 'off', { shade: 'plain' })],
  ['z', c('fricative', 'ridge', 'on', { shade: 'plain' })],
  ['ʃ', c('fricative', 'ridge', 'off', { shade: 'hush' })],
  ['ʒ', c('fricative', 'ridge', 'on', { shade: 'hush' })],
  ['ʂ', c('fricative', 'ridge', 'off', { shade: 'retroflex' })],
  ['ʐ', c('fricative', 'ridge', 'on', { shade: 'retroflex' })],
  ['ɕ', c('fricative', 'ridge', 'off', { shade: 'alveolopalatal' })],
  ['ʑ', c('fricative', 'ridge', 'on', { shade: 'alveolopalatal' })],
  ['θ', c('fricative', 'ridge', 'off', { shade: 'dental' })],
  ['ð', c('fricative', 'ridge', 'on', { shade: 'dental' })],
  ['th', c('fricative', 'ridge', 'off', { shade: 'dental' })],
  ['sh', c('fricative', 'ridge', 'off', { shade: 'hush' })],
  ['ch', c('fricative', 'ridge', 'off', { shade: 'hush' })],
  ['zh', c('fricative', 'ridge', 'off', { shade: 'hush' })],
  ['ɸ', c('fricative', 'lip', 'off')],
  ['β', c('fricative', 'lip', 'on')],
  ['f', c('fricative', 'lip', 'off')],
  ['v', c('fricative', 'lip', 'on')],
  ['ç', c('fricative', 'palate', 'off')],
  ['ʝ', c('fricative', 'palate', 'on')],
  ['x', c('fricative', 'back', 'off')],
  ['ɣ', c('fricative', 'back', 'on')],
  ['χ', c('fricative', 'uvula', 'off')],
  ['ʁ', c('fricative', 'uvula', 'on')],
  ['ħ', c('fricative', 'throat', 'off')],
  ['ʕ', c('fricative', 'throat', 'on')],
  ['ɬ', c('lateralFricative', 'ridge', 'off')],
  ['ɮ', c('lateralFricative', 'ridge', 'on')],

  // An h is the vowel's own shape breathed before it is voiced. Voiced, it is
  // the same gesture with the folds left slack under it.
  ['h', c('breath', 'glottis', 'off')],
  ['ɦ', c('breath', 'glottis', 'murmur')],

  // Nasals. A ring under one takes the voice out of it.
  ['m', c('nasal', 'lip', 'on')],
  ['n', c('nasal', 'ridge', 'on')],
  ['ɲ', c('nasal', 'palate', 'on')],
  ['ŋ', c('nasal', 'back', 'on')],
  ['ng', c('nasal', 'back', 'on')],
  ['ɴ', c('nasal', 'uvula', 'on')],
  ['m̥', c('nasal', 'lip', 'off')],
  ['n̥', c('nasal', 'ridge', 'off')],
  ['ɲ̊', c('nasal', 'palate', 'off')],
  ['ŋ̊', c('nasal', 'back', 'off')],

  // Trills, and the taps that are one beat of the same gesture.
  ['ʙ', c('trill', 'lip', 'on')],
  ['r', c('trill', 'ridge', 'on')],
  ['ʀ', c('trill', 'uvula', 'on')],
  ['ʙ̥', c('trill', 'lip', 'off')],
  ['r̥', c('trill', 'ridge', 'off')],
  ['ʀ̥', c('trill', 'uvula', 'off')],
  ['ɾ', c('tap', 'ridge', 'on')],
  ['ɽ', c('tap', 'ridge', 'on', { shade: 'retroflex' })],
  ['ɺ', c('tap', 'ridge', 'on', { shade: 'lateral' })],

  // Liquids and approximants: a real constriction with the voice on. A dark
  // l is a plain one with the tongue body pulled back, and nothing else.
  ['l', c('lateral', 'ridge', 'on')],
  ['ɭ', c('lateral', 'ridge', 'on', { shade: 'retroflex' })],
  ['ɫ', c('lateral', 'ridge', 'on', { colour: 'velar' })],
  ['ʎ', c('lateral', 'palate', 'on')],
  ['ʟ', c('lateral', 'back', 'on')],
  ['w', c('approximant', 'lip', 'on', { colour: 'velar' })],
  ['ʋ', c('approximant', 'lip', 'on')],
  ['ɹ', c('approximant', 'ridge', 'on')],
  ['j', c('approximant', 'palate', 'on')],
  ['ɰ', c('approximant', 'back', 'on')],
  ['ʁ̞', c('approximant', 'uvula', 'on')],

  // Clicks: two closures and the pop of the pocket between them.
  ['ʘ', c('click', 'lip', 'off')],
  ['ǀ', c('click', 'ridge', 'off', { shade: 'dental' })],
  ['ǃ', c('click', 'ridge', 'off')],
  ['ǂ', c('click', 'ridge', 'off', { shade: 'alveolopalatal' })],
  ['ǁ', c('click', 'ridge', 'off', { shade: 'lateral' })],
];

/**
 * A nasal glued to the stop after it, and only where a word opens — otherwise
 * every `mb` inside a word would be one consonant instead of a coda and an
 * onset.
 */
export const PRENASAL: readonly (readonly [string, Consonant])[] = [
  ['mb', c('stop', 'lip', 'on', { attack: 'prenasal' })],
  ['nd', c('stop', 'ridge', 'on', { attack: 'prenasal' })],
  ['ɲɟ', c('stop', 'palate', 'on', { attack: 'prenasal' })],
  ['ŋg', c('stop', 'back', 'on', { attack: 'prenasal' })],
  ['ɴɢ', c('stop', 'uvula', 'on', { attack: 'prenasal' })],
  ['nj', c('stop', 'palate', 'on', { attack: 'prenasal' })],
];

/** Everything the parser may match, longest key first. */
export const MATCHES: readonly (readonly [string, Consonant])[] =
  [...CONSONANTS].sort((a, b) => b[0].length - a[0].length);
export const PRENASAL_MATCHES: readonly (readonly [string, Consonant])[] =
  [...PRENASAL].sort((a, b) => b[0].length - a[0].length);

function key(x: Consonant): string {
  return [
    x.manner, x.place, x.voice,
    x.air ?? '', x.attack ?? '', x.release ?? '', x.colour ?? '', x.shade ?? '', x.long ? 'ː' : '',
  ].join('|');
}

const LETTER = new Map<string, string>();
for (const [letter, sound] of [...CONSONANTS, ...PRENASAL]) {
  const k = key(sound);
  if (!LETTER.has(k)) LETTER.set(k, letter);
}

const BY_LETTER = new Map<string, Consonant>();
for (const [letter, sound] of [...CONSONANTS, ...PRENASAL]) {
  if (!BY_LETTER.has(letter)) BY_LETTER.set(letter, sound);
}

/**
 * The sound a letter writes. Throws on a letter nothing writes, at import
 * time, because a mistyped inventory would otherwise be one silent phoneme.
 */
export function sound(letter: string): Consonant {
  const found = BY_LETTER.get(letter);
  if (!found) throw new Error(`speech: no consonant is written "${letter}"`);
  return found;
}

/**
 * A second constriction held through a consonant, written after it. The point
 * of these is that two peoples can share a phoneme and still not share a
 * sound: the same /t/ is `tʲ` for one and `tˠ` for the other.
 */
export const COLOUR: Record<string, NonNullable<Consonant['colour']>> = {
  'ʷ': 'round', 'ʲ': 'palatal', 'ˠ': 'velar', 'ˤ': 'pharyngeal',
};
const COLOUR_MARK: Record<NonNullable<Consonant['colour']>, string> = {
  round: 'ʷ', palatal: 'ʲ', velar: 'ˠ', pharyngeal: 'ˤ',
};

/** The letter a bundle would be written with, or nothing if none writes it. */
export function spellConsonant(x: Consonant): string {
  if (x.manner === 'none') return '';
  const direct = LETTER.get(key(x));
  if (direct) return direct;
  // Not in the table on its own: the marks come off one at a time until
  // something is.
  if (x.long) {
    const base = spellConsonant({ ...x, long: false });
    if (base) return `${base}ː`;
  }
  if (x.colour) {
    const base = spellConsonant({ ...x, colour: undefined });
    if (base) return base + COLOUR_MARK[x.colour];
  }
  return '';
}

export const VOWEL_LIST: readonly Vowel[] = [
  'a', 'e', 'i', 'o', 'u', 'ə', 'ü', 'ɯ', 'ø', 'æ', 'ɑ', 'ɨ', 'ɤ',
  'ɛ', 'œ', 'ɔ', 'ʌ', 'ɪ', 'ʊ', 'ɐ', 'ɜ', 'ɵ', 'ʉ', 'ɒ', 'ɶ', 'ɚ',
];

/** Letter to vowel. Every one has a row of its own; `y` is the one spelling. */
export const VOWEL_OF: Record<string, Vowel> = Object.fromEntries([
  ...VOWEL_LIST.map((v) => [v, v] as const),
  ['y', 'i'] as const,
]);
