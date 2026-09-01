/**
 * The peoples, by the way they talk.
 *
 * A lect is data, one entry per people, in the same spirit as `PEOPLE` in
 * `figure-people.ts`. It says which part of the chart this people uses and how
 * prominent each piece of it is, how fast and how wide they say it, and what
 * they say when they meet you.
 *
 * The two are not a split down the middle. They share about fifteen phonemes,
 * so a villager and a cityfolk sound like they come from the same planet, and
 * about a third of the chart is used by neither — headroom for the peoples
 * that come later.
 */

import { OPEN, sound, type Consonant, type Tone, type Vowel } from './phonemes';
import type { Tune } from './parse';
import type { LectName } from '../voice/types';

export interface Draw<T> {
  of: T;
  /** How prominent, 1 to 9. Relative within its own list and nothing else. */
  weight: number;
}

export interface Lect {
  /** Weighted draws for babble. `-` is a syllable that opens on its vowel. */
  onsets: readonly Draw<Consonant>[];
  codas: readonly Draw<Consonant>[];
  vowels: readonly Draw<Vowel>[];
  tones: readonly Tone[];
  tunes: readonly Draw<Tune>[];
  /** A second constriction laid on a drawn onset, and how often. */
  colour?: Consonant['colour'];
  colourRate: number;
  nasalRate: number;
  longRate: number;
  creakRate: number;
  breathRate: number;
  /** Syllables a second, low to high across the people. */
  rate: [number, number];
  /** How wide the pitch swings, likewise. */
  range: [number, number];
  /** Added to the fold shape: up is breathy, down is pressed. */
  rdBias: number;
  /** How far the pitch falls across a statement. */
  declination: number;
  /** How much the nose leaks when it should be shut. */
  velum: number;
  wordLength: [number, number];
  /** Scales every written pause. */
  pauseScale: number;
  greetings: readonly string[];
  /** Goodbyes: falling, and longer on the last vowel. */
  farewells: readonly string[];
  chatter: readonly string[];
}

/**
 * A letter and how prominent it is, one token each: `b3 ɾ5 -6`. `-` is no
 * onset and no coda. Written this way so an inventory reads as a list of
 * sounds rather than a page of object literals.
 */
function inventory(spec: string): Draw<Consonant>[] {
  return spec.trim().split(/\s+/).map((token) => {
    const letter = token.slice(0, -1);
    return { of: letter === '-' ? OPEN : sound(letter), weight: Number(token.slice(-1)) };
  });
}

function vowels(spec: string): Draw<Vowel>[] {
  return spec.trim().split(/\s+/).map((token) => ({
    of: token.slice(0, -1) as Vowel,
    weight: Number(token.slice(-1)),
  }));
}

/**
 * The countryside. Laid back, natural, calm: open syllables, vowel-heavy,
 * soft onsets, no aspiration and no sibilant clutter. The mouth barely closes.
 *
 * Voiced stops and never their voiceless twins, implosives and murmured stops
 * for the swallowed and the sighed, a tap where the city has trills, one
 * fricative and two h's for the whole inventory, and the clicks, which read as
 * friendly popping rather than as fuss.
 */
const country: Lect = {
  onsets: inventory(`
    b5 d5 g5 ɓ3 ɗ3 ɠ2 bʱ2 dʱ2 gʱ2 mb3 nd3 ŋg3
    m6 n6 ŋ4 ɾ5 l5 ɫ3 w4 j4 ɰ2 s3 h4 ɦ2 ʔ3 ʘ2 ǀ2 ǃ2 -4
  `),
  codas: inventory('-9 m2 n2 ŋ2 ʔ2 l2'),
  vowels: vowels('a6 ɑ4 e4 o4 u3 ɤ3 ɯ2 ə5 ɐ3 ɔ3'),
  tones: ['level', 'level', 'low', 'rise', 'dip'],
  tunes: [{ of: 'lilt', weight: 5 }, { of: 'statement', weight: 3 }, { of: 'question', weight: 2 }],
  colour: 'velar',
  colourRate: 0.12,
  nasalRate: 0.18,
  longRate: 0.28,
  creakRate: 0.05,
  breathRate: 0.18,
  rate: [5.4, 7.4],
  range: [0.14, 0.26],
  rdBias: 0.25,
  declination: 0.14,
  velum: 0.14,
  wordLength: [1, 3],
  pauseScale: 1.3,
  /**
   * Twenty-six hellos and fourteen runs of talk. Every consonant and vowel in
   * the inventory above turns up in at least two of them: a phoneme nobody
   * says is a phoneme nobody can judge.
   */
  greetings: [
    'ɓàːlo', 'mboɾǒ', 'ǀaːme, ǀaːme', 'hɤ̀wa',
    'ndaːʔ?', 'ɠoɾə̀', 'wuːlɐ', 'ǃoǃo',
    'dʱaːnɯ', 'ɫaʔɐ̌', 'ŋgumǎ', 'jaːwo',
    'ʘuːmə', 'ɗegeɾà', 'bʱoːʔa', 'nɐɰǒ?',
    'mɔːlə̀', 'ɾaɓaɾa', 'hùːjo', 'ǀəmǀəm',
    'gʱaːɾe', 'wɔ̀ndo', 'ɓɤːɾə̌?', 'laːnǀo',
    'sɑ̀ːŋo', 'ɦabudɐ',
  ],
  farewells: [
    'ɓoːlâ', 'mbaɾô', 'ǀuːmə̂', 'hɤ̀wô',
    'ndaːlô', 'ɠoɾâ', 'wuːlô', 'ǃaǃô',
    'dʱaːnô', 'ɫaʔô', 'ŋgumâ', 'jaːwô',
  ],
  chatter: [
    'wàːlo ɓoɾə, mɐɰuːna.', 'ǀəme ǀəme, hɑːjo lɐ.',
    'ndoɾu bʱaːle, sɔ̀ŋgə wo.', 'ɠɤːma, ɠɤːma nɐʔo.',
    'ɦuːbe laɾə̀, ʘomo ndaʔ.', 'dʱɐlo weɾa, ɫaːgu mə.',
    'ǃaŋo ɓuɾe, jɑːmə̀ wo.', 'gʱoːnə ɾawa, ɰɯːlɔ.',
    'mbaɾe hɤ̀lo, ɗumə̌ na.', 'sɐːwo ɫəŋo, ɓaɾaɓaɾa.',
    'ʘɤme nduːʔ, ɦoɾə̀ la.', 'ŋguːla waɾə, ǀome jɐʔ.',
    'bʱɔːnə ɾɑːgo, ɗeme wu.', 'ɰaɾo huːjə, ǃomə̀ ndɐ.',
  ],
};

/**
 * The city. Pompous, arrogant, rich, refined: closed syllables, everything
 * articulated hard and fast. A busy, clattering, hissing language.
 *
 * Trills, both series of voiceless stops, ejectives for the clipped emphasis,
 * a rack of affricates and nine fricatives. Palatal colour is the clearest
 * single marker against the countryside's velar one.
 */
const city: Lect = {
  onsets: inventory(`
    r6 ʀ6 ʙ2 pʰ4 tʰ5 kʰ4 p3 t4 k3 q2 tʼ3 kʼ3 b3 d3 g2
    ts4 dz2 tʃ4 tɕ3 pf3 ɸ2 s5 ʃ5 ç3 x3 χ3 β2 z3 ʒ3
    m4 n5 ɲ3 l4 ʎ2 j3 ʔ2 -2
  `),
  codas: inventory('-4 p2 t3 k2 s4 ʃ3 m2 n3 r3 l3'),
  vowels: vowels('i6 ɪ4 e5 ɛ4 ü3 ø3 œ3 ɵ2 ʉ2 a4 ɔ3 æ3'),
  tones: ['high', 'fall', 'high', 'fall', 'level'],
  tunes: [{ of: 'statement', weight: 5 }, { of: 'exclaim', weight: 4 }, { of: 'question', weight: 1 }],
  colour: 'palatal',
  colourRate: 0.22,
  nasalRate: 0.3,
  longRate: 0.06,
  creakRate: 0.22,
  breathRate: 0.04,
  rate: [7.6, 9.8],
  range: [0.28, 0.44],
  rdBias: -0.12,
  declination: 0.38,
  velum: 0.28,
  wordLength: [2, 4],
  pauseScale: 0.8,
  greetings: [
    'ʀéxtsʉ!', 'tʰɪ́ʃka!', 'pfœ́rti', 'tsǽʀdi!',
    'kʼɛ́stʃɔ?', 'ʙǘmjɛn!', 'çîrtʰæ', 'ʒøkʼí!',
    'tɕɪ́ʔʀe', 'pʰɔ́rzɛ!', 'xǽltʼi', 'ɸǿdzɪ?',
    'ʀɛ́nχa!', 'tʲîːskɛ', 'zǿpfa', 'ɲɛ́ʀgʉ!',
    'ʃɔ́rβi', 'kʰǽntsɔ!', 'βɪ́ʎɛr?', 'tʃø̂lki',
    'qɔ́ʃjɛ!', 'béʀtʃi', 'sʲɛ́ʀpa!', 'ɵ́ʃtʰɪn',
    'mʉ́ʔtsɛ?', 'ʒæ̂kʼʀɔ!',
  ],
  farewells: [
    'ʀéxtsɔ̂', 'tʰɪ́ʃkø̂', 'pfœ́rtâ', 'tsǽʀdø̂',
    'kʼɛ́stʃø̂', 'ʙǘmjê', 'çîrtʰø̂', 'ʒøkʼî',
    'tɕɪ́ʔʀø̂', 'pʰɔ́rzê', 'xǽltʼø̂', 'ɸǿdzê',
  ],
  chatter: [
    'pʰɔ́rzɛ tɕímbɛ, kʰɔ́ntsɔ!', 'tʰɪ́ʃka ʀɛ́nti, ʒøgí βɛʀ.',
    'çœ́rtʰɛ ʙǘmɛn, tɕɪ̂nʀɔ pfɛ!', 'kʼɛ́stʃɔ xǽʃta, sʲɛ́ʀpi tsi.',
    'qɔ́rʃɛ ɲǿʃtɛ, ɸø̂dzi!', 'ʃɔ́rβi tʲíːstʼɛ, mʉ́rtsɛ ʀa.',
    'béʀtʃi qɔ́χʃɛ, ɵ́ʃtʰɪn dzø!', 'βɪ́ʎɛr tʃǿlki, kʰæ̂ntsɔ ʒɛ!',
    'zǿpfa ʀéxti, tsǽʀdi nø.', 'ɲǿʃtɛ pʰɪ́kʀʉ, ʙɔ́ʀtsa xɛ!',
    'tɕǽmpʰi sʲɔ́ʀβɛ, ʎɛ̂tsɪ kʉ.', 'xʉ́rtʃa kʼœ́pfɛ, ʀɪ́nzɔ tʰa!',
    'dzɛ́ʀkʰi ɵ́mβɔ, tʃɪ́ʎa pfe.', 'kʰǽstɛ ʙǿʀki, ʒɔ̂ntsʉ ʀi!',
  ],
};

export const LECTS: Record<LectName, Lect> = { country, city };

/** The lect a voice speaks. Anyone who did not say is from the countryside. */
export function lectOf(name: LectName | undefined): Lect {
  return LECTS[name ?? 'country'];
}

/** One weighted draw. */
export function pick<T>(list: readonly Draw<T>[], random: () => number): T {
  let total = 0;
  for (const d of list) total += d.weight;
  let n = random() * total;
  for (const d of list) {
    n -= d.weight;
    if (n <= 0) return d.of;
  }
  return list[list.length - 1].of;
}
