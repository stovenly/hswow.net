# Phonemes: a big chart, and two peoples who use different parts of it

Spec for (1) widening the voice's phoneme set from ~16 consonant manners to a
full articulatory chart, (2) giving each people a subset of it, and (3)
rewriting the greetings and chatter so each people's lines are drawn from its
own subset. Follows on from `VOICE.md`, which built the throat.

Nothing here touches `processor.js`. The throat is general; the chart is a
writer table and a parser table; a people is data. That is the whole point of
the layering in `VOICE.md` §3 and this spec stays inside it.

## 1. Where it stands

| layer | file | knows |
| --- | --- | --- |
| language | `audio/speech.ts` | letters, syllables, tunes, the greeting bank |
| writer | `audio/voice/writer.ts` | what a vowel is, what a closure is |
| throat | `audio/voice/processor.js` | tubes, folds, noise. No phonemes at all |

Today: 16 `Onset` manners × 4 `Place`s (many combinations unused or
nonsensical), 13 vowels, 6 tones, 3 phonations, 7 codas. One shared bank of 25
greetings, and one `babbleScore` drawing from one global `ONSETS` list. Every
villager and every cityfolk draws from the same pot, so they are the same
language in different clothes.

Two structural facts decide how this grows:

- **`writeOnset` is a switch with one case per manner.** 100 phonemes cannot be
  100 cases. They have to be a small number of manner cases parameterised by
  place, voicing and colour.
- **`Place` is a `Record` key in six places** (`CLOSURE`, `TRILL_PERIOD`,
  `closer`, `bodyAt`, and `SHAPES`/`LOCUS`/`LIQUID`/`BURST` in the old
  node-graph voice). Widening it is type-checked everywhere, which is what we
  want, but §9 covers the tax the old model charges.

## 2. What the throat can actually make

Read out of `processor.js`, not wished for. Everything below is reachable on
the existing twelve tracks.

- **`bodyPos` 0..1 maps to 0.26..0.82 along the tract.** Named stops today are
  pharynx 0, uvula 0.2, velar 0.34. **Palatal (~0.85) is unused and free.**
- **`tip` sits at a fixed 0.8 of the tract, spread 0.09.** So dental, alveolar
  and post-alveolar are *not* separable by tip position. They are separable by
  tip *gap*, by where the body sits behind the tip, and by lip rounding — which
  is how `s` and `ʃ` are already told apart. Sibilant colour is a real axis;
  tip place is not.
- **The area function is a sum of three windows.** A constriction at one place
  and a second at another cost nothing extra. **Secondary articulation —
  rounding, palatalisation, velarisation, pharyngealisation — is free**, and it
  is the largest single multiplier available.
- **`loud` is a track.** Voiced and voiceless versions of every continuant are
  the same gesture with one line moved. Currently `hiss`, `hush`, `lateral` are
  voiceless only and `trill`, `liquid`, `nasal` are voiced only, for no reason
  but that nobody wrote the other half.
- **VOT is a number.** `stop` today is the voiced series. Tenuis and aspirated
  are the same gesture with voicing off and the release moved earlier. `VOICE.md`
  §10 already says so: "one flag on the syllable and a longer VOT here".
- **A release can go somewhere other than open.** Release into the fricative gap
  and hold it and you have an affricate. Release with the velum open and you
  have a nasal release. Same machinery.
- **`trill()` takes a beat count.** One beat is a tap.
- **`modulate` is a track the writer never sets.** 24 Hz amplitude and pitch
  roughness, unused. That is a whole phonation type sitting idle.
- **The `inhale` gesture exists and is never sent** (`writer.ts` hard-codes
  `inhale = 0`). Ingressive syllables are reachable if wanted.
- **One noise source, at the narrowest point.** So no phoneme may want two
  simultaneous frications. Nothing on the chart does.

Limits worth stating so nothing is specced that cannot be heard: no labiodental
vs bilabial distinction (`f`/`ɸ` are one sound here — the lips are two
sections); no dental vs alveolar; retroflex only as a colour on a sibilant;
no lateral *and* central frication at once.

## 3. The chart

Target: **~100 consonants, 26 vowels, 4 secondary colours, 6 tones, 5
phonations.** Each people below takes roughly a third of the consonants. The
rest is deliberate headroom for the peoples that come later.

### 3.1 Places — 4 becomes 7

`lip · ridge · palate · back · uvula · throat · glottis`

`palate` and `uvula` are new. `throat` splits: it means the pharynx
(`bodyPos` 0) and nothing else; `glottis` means the folds alone, which is what
`ʔ` and `h` actually are and what `throat` was doing double duty for.

| place | closes with | `bodyPos` | notes |
| --- | --- | --- | --- |
| lip | `lips` | vowel's | last two sections |
| ridge | `tip` | 0.75 | the tip's fixed 0.8 |
| palate | `bodyDia` | 0.85 | new |
| back | `bodyDia` | 0.34 | velar |
| uvula | `bodyDia` | 0.20 | was folded into `back` for trills |
| throat | `bodyDia` | 0.00 | pharynx |
| glottis | — | vowel's | `loud`/`chaos`/`breath` only |

### 3.2 A phoneme is a feature bundle, not a name

```ts
export interface Consonant {
  manner: Manner;      // one writer case each — twelve of them
  place: Place;
  /** The folds through the constriction. */
  voice: 'off' | 'on' | 'murmur' | 'creak';
  /** Airstream. Default pulmonic. */
  air?: 'ejective' | 'implosive' | 'click';
  /** What happens before the constriction. */
  attack?: 'prenasal' | 'preaspirated';
  /** What it opens into. */
  release?: 'aspirated' | 'affricated' | 'nasal' | 'lateral';
  /** A second constriction held through it. */
  colour?: 'round' | 'palatal' | 'velar' | 'pharyngeal';
  /** Geminate: the closure is held twice as long. */
  long?: boolean;
}

type Manner =
  | 'none' | 'stop' | 'fricative' | 'nasal' | 'trill' | 'tap'
  | 'approximant' | 'lateral' | 'lateralFricative' | 'click'
  | 'glottal' | 'breath';
```

Twelve manner cases in the writer, each parameterised. Everything else is a
decorator applied around the core gesture — a few lines each, orthogonal, and
combinable. `murmur`, `prenasal`, `ejective`, `implosive`, `whisperNasal` and
`hush` all stop being manners of their own: they are `stop`+`voice:'murmur'`,
`stop`+`attack:'prenasal'`, `stop`+`air:'ejective'`, `nasal`+`voice:'off'`,
`fricative`+place/colour.

### 3.3 The consonants

**Stops** (34) — the laryngeal series is `voice` × `release` × `air`.

| series | lip | ridge | palate | back | uvula |
| --- | --- | --- | --- | --- | --- |
| voiced | b | d | ɟ | g | ɢ |
| tenuis | p | t | c | k | q |
| aspirated | pʰ | tʰ | cʰ | kʰ | qʰ |
| ejective | pʼ | tʼ | cʼ | kʼ | qʼ |
| implosive | ɓ | ɗ | ʄ | ɠ | — |
| murmured | bʱ | dʱ | ɟʱ | gʱ | — |
| prenasal | mb | nd | ɲɟ | ŋg | ɴɢ |

plus the glottal stop `ʔ`.

**Affricates** (10) — `stop` + `release: 'affricated'`.
`ts dz tʃ dʒ tɕ dʑ pf kx qχ tɬ`

**Fricatives** (22) — the same gesture voiced and voiceless.

| | lip | ridge | post-alv | retroflex | palate | back | uvula | throat | glottis |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| voiceless | ɸ | s, θ | ʃ | ʂ | ç | x | χ | ħ | h |
| voiced | β | z, ð | ʒ | ʐ | ʝ | ɣ | ʁ | ʕ | ɦ |

Post-alveolar and retroflex are `ridge` with different tip gaps, body positions
and rounding — see §4.2. `θ`/`ð` is a wide, blunt tip gap: weak and diffuse,
which is what a dental fricative is. Today `th` is mapped to `breath`, a fudge
this replaces.

**Lateral fricatives** (2) `ɬ ɮ`. **Lateral approximants** (4) `l ɫ ʎ ʟ` —
`ɫ` is `l` with `colour: 'velar'`, which is the whole difference and is
audible.

**Nasals** (9) `m n ɲ ŋ ɴ` and voiceless `m̥ n̥ ɲ̊ ŋ̊`.

**Trills** (6) `ʙ r ʀ` and voiceless `ʙ̥ r̥ ʀ̥`.
**Taps** (3) `ɾ ɽ ɺ` — one beat where a trill has three.

**Approximants** (6) `w ʋ ɹ j ɰ ʁ̞`.

**Clicks** (5) `ʘ ǀ ǃ ǂ ǁ` — four places now that `palate` exists, plus the
lateral release.

**Total: 101.**

### 3.4 Secondary colours

Four, on any consonant, at the cost of one extra held track:

| colour | mark | what is held | reads as |
| --- | --- | --- | --- |
| round | ʷ | `lips` 0.55 | heavy, muffled |
| palatal | ʲ | `bodyPos` 0.85, `bodyDia` 0.7 | precious, mincing |
| velar | ˠ | `bodyPos` 0.34, `bodyDia` 0.65 | dark, slow |
| pharyngeal | ˤ | `bodyPos` 0, `bodyDia` 0.5, `chaos` 0.3 | growled |

A colour is not applied where it would fight the primary place (palatal on a
palatal, velar on a velar); the table falls through to plain.

The point of colours is that **two peoples can share a phoneme and still not
share a sound**: the same `/t/` is `tʲ` for one and `tˠ` for the other, which
is a bigger perceived difference than most whole phonemes.

### 3.5 Vowels — 13 becomes 26

Existing: `a e i o u ə ü ɯ ø æ ɑ ɨ ɤ`.
New: `ɛ œ ɔ ʌ ɪ ʊ ɐ ɜ ɵ ʉ ɒ ɶ ɚ`.

`Shape` gains an optional `tip`, which it does not have today, so that `ɚ` and
the retroflex vowels can narrow the tip without a consonant. Starting targets,
in the same units as the existing table:

| vowel | jaw | bodyPos | bodyDia | lips | tip |
| --- | --- | --- | --- | --- | --- |
| ɛ | 0.68 | 0.70 | 0.90 | 1.38 | — |
| œ | 0.66 | 0.70 | 0.90 | 0.66 | — |
| ɔ | 0.72 | 0.18 | 0.75 | 0.66 | — |
| ʌ | 0.72 | 0.18 | 0.75 | 1.32 | — |
| ɪ | 0.34 | 0.85 | 0.72 | 1.42 | — |
| ʊ | 0.36 | 0.32 | 0.72 | 0.60 | — |
| ɐ | 0.82 | 0.45 | 0.95 | 1.25 | — |
| ɜ | 0.60 | 0.50 | 1.05 | 1.20 | — |
| ɵ | 0.42 | 0.55 | 1.00 | 0.66 | — |
| ʉ | 0.24 | 0.60 | 0.55 | 0.60 | — |
| ɒ | 0.90 | 0.06 | 0.55 | 0.72 | — |
| ɶ | 0.85 | 0.68 | 0.85 | 0.66 | — |
| ɚ | 0.45 | 0.50 | 0.90 | 0.95 | 0.60 |

`œ` and `ʉ` are currently aliased onto `ø` and `ü` in `VOWEL_OF`; they get their
own rows. Diphthongs stay free — any vowel may glide to any other.

### 3.6 Phonation

`modal · creaky · breathy` today. Add two, both from tracks that exist:

- **whisper** — `loud` 0 across the vowel, `breath` 0.5. The tract still shapes
  it, so it is an audible whispered vowel, not a hiss.
- **harsh** — `modulate` 0.5 across the vowel. The unused track. Growled.

### 3.7 Headline count

101 consonants × 4 colours where they apply, 26 vowels × {plain, long, nasal}
× 5 phonations, 6 tones, free diphthongs. The set the two peoples below use is
about 60 consonants and 17 vowels between them, sharing a core of about 15.

## 4. The writer

`writeOnset` becomes: resolve the bundle to a core gesture by manner, then
apply decorators. Concrete recipes, in the existing vocabulary.

### 4.1 Manner cores

- **stop** — as now: still, shut, held, released. `voice` decides whether
  `loud` runs at `level × 0.1` behind the closure.
- **fricative** — as `hiss` now, with the gap from §4.2, and `loud` held at
  `level × 0.45` through it when voiced. A voiced fricative takes a *slightly
  wider* gap: the folds damp the flow, and the same gap voiced is quieter.
- **nasal / trill / tap / lateral / click / glottal / breath** — as now, with
  the place table widened and `loud` no longer hard-wired on or off.

### 4.2 Gaps

| what | track | gap | notes |
| --- | --- | --- | --- |
| s / z | tip | 0.13 | body 0.75 |
| ʃ / ʒ | tip | 0.22 | body 0.75, lips 0.85 |
| ʂ / ʐ | tip | 0.20 | body 0.55, lips neutral |
| ɕ / ʑ | tip | 0.16 | body 0.90, lips spread |
| θ / ð | tip | 0.30 | jaw 0.35 — blunt and weak |
| ɸ / β | lips | 0.16 | |
| ç ʝ x ɣ χ ʁ ħ ʕ | bodyDia | 0.16 | at the place's `bodyPos` |
| lateral ɬ ɮ | tip | 0.26 | already `LATERAL` |
| approximant | either | 0.50 | just clear of `HISS_AT` — no hiss |
| liquid l | tip | 0.36 | already `LIQUID` |

`NO_HISS` (0.55) still governs anything held as a vowel target. Only
fricatives, liquids and a closure passing through may go under it.

### 4.3 Decorators

| decorator | what it writes |
| --- | --- |
| `release: 'aspirated'` | release at `on − 0.075`; `breath` 0.45 falling to `me.breath` by `on + 0.02`; `loud` 0 until `on`; `rd + 0.4` at onset |
| `release: 'affricated'` | at release the closing track goes to the §4.2 gap, holds 0.045, then opens over 0.02; `breath` 0.4 across the hold |
| `release: 'nasal'` | `velum` opens at release and shuts 0.035 into the vowel |
| `release: 'lateral'` | the tip goes to `LATERAL` rather than open |
| `attack: 'prenasal'` | as the current `prenasal` case, lifted out |
| `attack: 'preaspirated'` | `breath` 0.35 from `begin − 0.05`, `loud` off, then the closure |
| `voice: 'murmur'` | as the current `murmur`: slack folds and a rush under the vowel |
| `voice: 'creak'` | `chaos` 0.5 through the constriction |
| `air:` ejective/implosive/click | as now, lifted out of the manner switch |
| `colour:` | the §3.4 track held from `begin` and released with the primary |
| `long` | `CLOSURE[place] × 2` |

`leadFor` becomes a sum: manner lead + attack lead + release lead. That is the
one place a mistake will show as a consonant landing on top of the vowel
before it, so it gets a comment saying what each term is.

### 4.4 Codas

`Coda` today is a separate seven-value union with its own switch. It becomes
the same `Consonant` bundle with a flag, so a coda can be anything an onset can
be — a coda affricate, a coda aspirate, a voiceless coda nasal. `CODA_TAIL`
becomes a function of manner and release rather than a `Record`.

## 5. The peoples

A `Lect` is everything about how one people speaks. It is data, one entry per
people, in the same spirit as `PEOPLE` in `figure-people.ts`.

```ts
export interface Lect {
  /** Weighted draws for babble. A phoneme's weight is how prominent it is. */
  onsets: readonly { p: string; weight: number }[];
  codas: readonly { p: string; weight: number }[];
  vowels: readonly { v: Vowel; weight: number }[];
  /** Syllable shapes, weighted: 'CV' | 'CVː' | 'CVC' | 'CCV' | 'V' | 'CVCC'. */
  shapes: readonly { shape: string; weight: number }[];
  tones: readonly Tone[];
  tunes: readonly { tune: Tune; weight: number }[];
  nasalRate: number; longRate: number; creakRate: number; breathRate: number;
  /** Identity bias: syllables a second, pitch swing, fold shape, pause scale. */
  rate: [number, number];
  range: [number, number];
  rdBias: number;
  declination: number;
  wordLength: [number, number];
  pauseScale: number;
  /** Written lines, by occasion. */
  greetings: readonly string[];
  chatter: readonly string[];
}

export const LECTS: Record<'country' | 'city', Lect>;
```

### 5.1 Country — the villagers

Laid back, natural, calm. **Open syllables, vowel-heavy, soft onsets, no
aspiration and no sibilant clutter.** The mouth barely closes.

- **stops** voiced only: `b d g` — never `p t k`
- **implosives** `ɓ ɗ ɠ` and **murmured** `bʱ dʱ gʱ` — swallowed and sighed
- **prenasals** `mb nd ŋg` — hummed
- **nasals** `m n ŋ`, frequent
- **tap** `ɾ` — the relaxed r. **No trills at all.**
- **laterals** `l` and dark `ɫ`
- **approximants** `w j ɰ`
- **fricatives**: `s` alone, and `h ɦ`. That is the entire fricative inventory
- **glottal** `ʔ`
- **clicks** `ʘ ǀ ǃ` — kept, because they read as friendly popping rather than
  as fuss, and because they are already the villagers' signature sound
- **colour**: velar `ˠ` only, and rarely

28 consonants. Vowels `a ɑ e o u ɤ ɯ ə ɐ ɔ` — open, back-heavy, **no front
rounding whatever**. Long vowels frequent, nasal moderate, breathy frequent,
creak only as a trail-off. Tones `level level low rise dip` — no high, no fall.
Codas open (most), nasal, glottal, lateral; **no stop or fricative codas**.
Shapes `CV CVː V CVN CVʔ`, words of one to three syllables, reduplication
common. Rate 3.6–5.2 syl/s, range 0.14–0.26, `rdBias +0.25` (breathy),
declination shallow, pauses ×1.3, tune mostly `lilt`.

### 5.2 City — the cityfolk

Pompous, arrogant, rich, refined. **Closed syllables, clusters, everything
articulated hard and fast.** A busy, clattering, hissing language.

- **trills** `r ʀ ʙ` — asked for by name; uvular `ʀ` is the prominent one
- **aspirated stops** `pʰ tʰ kʰ` beside tenuis `p t k q` — over-articulated
- **voiced stops** `b d g`, less prominent
- **ejectives** `tʼ kʼ` — the clipped, snapped emphasis
- **affricates** `ts dz tʃ tɕ pf` — fussy
- **fricatives** voiceless `ɸ s ʃ ç x χ` and voiced `β z ʒ` — dense
- **nasals** `m n ɲ`
- **laterals** `l ʎ`, **approximant** `j`
- **glottal** `ʔ`
- **colour**: palatal `ʲ` — mincing, and the clearest single marker against the
  villagers' `ˠ`

35 consonants. Vowels `i ɪ e ɛ ü ø œ ɵ ʉ a ɔ æ` — front, **rounded, closed**.
Nasal frequent (hauteur), long rare, creaky on statement ends (the sneering
drop), breathy rare. Tones weighted `high fall high fall level` — no dip.
Codas stop, fricative, nasal, trill, open. Shapes `CV CVC CCV CVCC`, words of
two to four syllables. Rate 5.6–7.6 syl/s, range 0.28–0.44, `rdBias −0.12`
(pressed), declination steep — they talk *down* — pauses ×0.8, tune mostly
`statement` and `exclaim`; **questions rare, because they do not ask**.

### 5.3 Shared, and reserved

**Shared** so it is one world: `m n ŋ · b d g · l · j · ʔ · s · h` and the
vowels `a e o ə ɔ`. About fifteen phonemes, enough that a villager and a
cityfolk sound like they come from the same planet.

**Reserved**, used by neither, ready for the peoples that come later:
retroflexes `ʈ ɖ ʂ ʐ ɽ`, pharyngeals `ħ ʕ`, most uvulars `ɢ ɴ qʼ qχ`, lateral
fricatives `ɬ ɮ`, palatal stops `c ɟ ʄ`, the clicks `ǂ ǁ`, taps `ɽ ɺ`,
approximants `ʋ ɹ ʁ̞`, laterals `ʟ`, the far vowels `ɨ ɜ ɒ ɶ ɚ ʌ ʊ`, whisper and
harsh phonation, ingressives, the `ʷ` and `ˤ` colours. Roughly a third of the
chart is untouched, which is the headroom this was sized for.

### 5.4 Body presets

Per `VOICE.md`'s rule — presets and writers, never DSP branches — the two
peoples get two bodies rather than one.

- **country**: `velum` leak as now, `breathFloor` up a third, `tau[tip]` down
  (the tap needs it), `wallDamp` up — darker, looser.
- **city**: `velum` leak doubled (a nasal drawl reads as hauteur), `wallDamp`
  down — brighter and more forward — `tau[jaw]` up, so the jaw barely moves and
  the delivery is clipped and closed.

## 6. The lines

Both banks are written in the little language, in that people's inventory and
nothing else, and scored like anything else.

**The rule that decides when a bank is finished: every phoneme in the lect
appears in at least two lines across its greetings and chatter.** A phoneme
nobody says is a phoneme nobody can judge. This is read off the page, not
measured by anything.

### 6.1 Country greetings — 26

```
ɓàːlo        mboɾǒ        ǀaːme, ǀaːme   hɤ̀wa
ndaːʔ?       ɠoɾə̀         wuːlɐ          ǃoǃo
dʱaːnɯ       ɫaʔɐ̌         ŋgumǎ          jaːwo
ʘuːmə        ɗegeɾà       bʱoːʔa         nɐɰǒ?
mɔːlə̀        ɾaɓaɾa       hùːjo          ǀəmǀəm
gʱaːɾe       wɔ̀ndo        ɓɤːɾə̌?         laːnǀo
sɑ̀ːŋo        ɦabudɐ
```

### 6.2 Country chatter — 14

```
wàːlo ɓoɾə, mɐɰuːna.        ǀəme ǀəme, hɑːjo lɐ.
ndoɾu bʱaːle, sɔ̀ŋgə wo.     ɠɤːma, ɠɤːma nɐʔo.
ɦuːbe laɾə̀, ʘomo ndaʔ.      dʱɐlo weɾa, ɫaːgu mə.
ǃaŋo ɓuɾe, jɑːmə̀ wo.        gʱoːnə ɾawa, ɰuːlɔ.
mbaɾe hɤ̀lo, ɗumə̌ na.        sɐːwo ɫəŋo, ɓaɾaɓaɾa.
ʘɤme nduːʔ, ɦoɾə̀ la.        ŋguːla waɾə, ǀome jɐʔ.
bʱɔːnə ɾɑːgo, ɗeme wu.      ɰaɾo huːjə, ǃomə̀ ndɐ.
```

### 6.3 City greetings — 26

```
ʀéxtsʉ!      tʰɪ́ʃka!      pfœ́rti        tsǽʀvi!
kʼɛ́stʃɔ?     ʙǘmɛn!       çirtʰǽ        ʒøkʼí!
tɕɪ́nʀe       pʰɔ́rzɛ!      xǽʃti         frǿtsɪ?
ʀɛ́ntʃa!      tʲíːskɛ      zǿpfa         ɲɛ́krʉ!
ʃtɔ́rvi       kʰǽntsɔ!     vɪ́ʎɛr?        tʃǿki
qɔ́rʃɛ!       bʀétʃi       sʲɛ́ʀpa!       ɵ́ʃtʰɪn
mʉ́rtsɛ?      ʒǽkʼʀɔ!
```

### 6.4 City chatter — 14

```
ʀextsʉ́ pfœrtí, kʰɔ́mbrɛ tsɔ!   tʰɪ́ʃka ʀɛ́nti, ʒøkʼí vɛʀ.
çírtʰɛ ʙǘmɛn, tɕɪ́nʀɔ pfɛ!      kʼɛ́stʃɔ xǽʃti, sʲɛ́ʀpa tsi.
pʰɔ́rzɛ ɲɛ́krʉ, frǿtsɪ kɔ!      ʃtɔ́rvi tʲíːskɛ, mʉ́rtsɛ ʀa.
bʀétʃi qɔ́rʃɛ, ɵ́ʃtʰɪn dzø!     vɪ́ʎɛr tʃǿki, kʰǽntsɔ ʒɛ!
zǿpfa ʀéxti, tsǽʀvi nø.        ɲǿʃtɛ pʰɪ́krʉ, ʙɔ́ʀtsa xɛ!
tɕǽmpʰi sʲɔ́ʀvɛ, ʎɛ́tsɪ ku.     xʉ́rtʃa kʼǿpfɛ, ʀɪ́nzɔ tʰa!
dzɛ́ʀkʰi ɵ́mvɔ, tʃɪ́ʎa pfe.     kʰǽstɛ ʙrǿki, ʒɔ́ntsʉ ʀi!
```

The wording is a first draft and is yours to reject line by line; the
*shape* of each bank — which sounds are in it, how long the words are, which
tunes — is what the spec is asserting.

### 6.5 Which occasion plays which

`Creature.ts` has exactly two: `babble('greeting')` on a greeting gesture and
`babble('talk')` while idling. So:

- greeting → the lect's `greetings` bank, stepped along so a row does not
  repeat (the existing `lately` logic, per lect)
- talk → the lect's `chatter` bank, stepped along the same way

**Procedural talk comes later.** `babbleScore` draws from the global `ONSETS`
and `VOWEL_LIST`, so left as it is it would have both peoples speaking the
whole chart at each other and undo the split. Until it is re-pointed at the
lect's inventory it is not called for a creature at all; the chatter bank
carries `talk` on its own. Re-pointing it is a small job — the draw lists
become the lect's — and it is worth doing, because fourteen lines per people
will start to repeat in a village.

Further occasions — a farewell as the player walks off, a startle, an assent —
are cheap once the banks are per-lect, but they need a caller in `Creature.ts`
that does not exist. Out of scope here; noted so the `Lect` shape leaves room.

## 7. Plumbing

`LifeSpec` does not carry `folk` today, so nothing downstream of the builder
knows which people a figure is.

1. `LifeSpec` gains `lect?: 'country' | 'city'`; `figure.ts` stamps it from the
   `folk` it was built with (one line, beside `face: kind`).
2. `VoiceOptions` gains `lect?: string`.
3. `Creature.ts` passes `lect: this.spec.lect` into `createVoice`.
4. `Voice.ts` looks the lect up and hands it to `identity()`, to
   `greetScore(seed, lect)` and to `babbleScore(…, lect)`, and picks the body
   preset by it.
5. `identity()` takes the lect's rate, range and `rdBias` as its bias, keeping
   the per-seed spread inside it — two villagers still differ from each other.

Nothing else moves. `Emitter`, the gaits, the mouth timing and `Utterance`
are untouched.

## 8. File layout

`speech.ts` is 475 lines and would land near 1300. It becomes a directory:

```
audio/speech/
  index.ts      re-exports; score(); spell()
  phonemes.ts   the chart — Consonant bundles, the IPA table, the vowel table
  parse.ts      text → Score: graphemes, longest match, marks, syllabify
  lects.ts      the peoples: inventories, prosody, line banks
  babble.ts     greetScore / chatterScore / babbleScore from a Lect
audio/voice/
  writer.ts     manner cores + decorators
  shapes.ts     vowel Shape table, place geometry, gap table (out of writer.ts)
  body.ts       countryBody / cityBody
```

The parser stops being six `Set`s and a digraph list: it becomes longest-match
against `phonemes.ts`, which handles `tʃ`, `mb`, `tʼ`, `kʷ`, `n̥` and `pʰ`
uniformly, and `spell()` becomes the reverse lookup — which makes it *more*
faithful than it is now, since today `LETTERS[onset][place]` loses information.

## 9. The old node-graph voice goes

`oneshots/voice.ts` is the fallback when the worklet fails to register, and it
is out. It holds `Record<Vowel, Formant[]>` and three `Record<Place, …>`
tables, so every new vowel and every new place would demand a hand-tuned
formant row there — roughly doubling the cost of this feature for a path that
is not used. `VOICE.md` §10 left the decision open; this closes it.

It is a small deletion, because almost nothing depends on it:

- `Unit`, `Utterance`, `Voice` and `VoiceOptions` are declared there and
  re-exported by `voice/Voice.ts`. They move to `audio/voice/types.ts`, which
  is where the surviving voice lives.
- `Scatter.ts` imports `VoiceOptions` as a type only; it re-points.
- `dsp/glottal.ts` has no other caller and goes with it. `dsp/formant.ts`
  **stays** — `crowd.ts`, `choir.ts` and `oneshots/animal.ts` all use it, and
  `writer.ts` still cites its tables as the reference the vowel shapes were
  tuned against.
- `createVoice` loses its fallback branch. When the worklet did not register it
  returns a **silent stub** rather than throwing: a creature that cannot speak
  must not take the world down with it. `shout()` stays and gets blunter — with
  nothing behind it, a failed `addModule` now means silence, and that has to be
  unmissable on screen.
- `voiceState() === 'waiting'` keeps its meaning, and `Creature.ts` keeps
  skipping a greeting rather than building a voice too early.

Done first, before the chart grows, so nothing is ever tuned in a file that is
about to be deleted.

## 10. Phases

Each ends with someone listening in the world. Nothing else judges anything.

1. **The fallback goes.** §9. The types move, two files are deleted, the stub
   replaces the branch. The world talks exactly as it did.
2. **The bundle.** `Consonant` replaces `Onset`; `writeOnset` becomes twelve
   manner cores plus decorators; `Place` widens to seven; the parser becomes a
   table. **No new phonemes yet** — the existing greetings must sound exactly
   as they do now. If they do not, the refactor is wrong and nothing after it
   is trustworthy.
3. **Voicing, VOT and the vowels.** The voiced/voiceless fricative pairs,
   tenuis and aspirated stops, taps, the thirteen new vowels, the `tip` on
   `Shape`. Roughly half the new chart, all from existing gestures.
4. **The rest of the chart.** Affricates, palatals and uvulars, secondary
   colours, voiceless sonorants, the new phonations. This is where entries that
   the tube cannot tell apart get found and cut.
5. **The lects.** `Lect`, the two inventories, the two body presets, the
   plumbing in §7. Both galleries now sound like two peoples.
6. **The lines.** The four banks, the coverage rule in §6, and greeting and
   talk both wired to them.

Later, not phased here: procedural babble re-pointed at the lect's inventory
(§6.5), and any further occasion that gets a caller in `Creature.ts`.

## 11. Risks

- **Entries that are not audibly distinct.** The tube has one tip position and
  one noise source. Some of §3.3 will not survive phase 3. That is expected and
  the phasing is built for it — cut them rather than keep a chart entry nobody
  can hear.
- **Phase 1 changing the sound.** It is a pure refactor and must be inaudible.
  Any drift there is a bug, not a tuning question.
- **Cost.** Unchanged. Same worklet, same tracks; a few more keys per syllable
  for affricates and colours, against a 384-key cap per track that a line
  nowhere near fills.
- **How any of this gets heard.** `gallery-villager` and `gallery-cityfolk`
  already stand rows of figures that greet, and the world is the rest. **No
  phoneme gallery is being built** — and no listening tool, no probe, nothing
  under `tools/`. A chart entry that cannot be judged from a row and a walk
  through the village is a chart entry that goes.

## 12. Settled

1. **The node-graph fallback is retired**, not mapped. §9, and it goes first.
2. **The lects stay `country` and `city`** for now, matching `PEOPLE`. Names of
   their own are fiction and can arrive later without moving anything.
3. **The clicks stay with the villagers.** `ʘ ǀ ǃ` on the laid-back people.
4. **No phoneme gallery.** The two existing rows and the world are how it is
   judged.
5. **`talk` plays written chatter lines.** Procedural babble drawn from the
   lect's inventory is worth having and comes later; until it does, it is not
   called for a creature, because drawing from the global lists would put both
   languages in every mouth. §6.5.
