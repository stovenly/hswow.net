# src/audio/voice

An articulatory synthesiser: a Kelly-Lochbaum tube driven by a glottal source,
running in `processor.js` on the audio thread. Nothing here plays back a
sample, and nothing here has a formant table — the resonances come out of the
tube's shape because that is what a throat is.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## The layers

```
score (audio/speech) ─► writer.ts ─► keys on 12 tracks ─► processor.js
                            ▲                                 ▲
                       shapes.ts                         body.ts preset
                       character.ts                      tuning.ts (?debug)
```

- `body.ts` — `BodyPreset`: tube length, where the nose joins, wall loss, how
  fast each articulator moves. The whole of what the worklet knows about a
  species.
- `character.ts` — who one throat belongs to. Axis spans per people, drawn per
  creature; named voices state their own.
- `shapes.ts` — where things go: the posture of every vowel and place.
- `writer.ts` — a score of syllables into gestures. The only file that knows
  what a vowel is.
- `Voice.ts` — the client half: posts keys ahead on the audio clock and keeps
  `Utterance.units` so a head and mouth have something to move to.
- `tuning.ts` — live dials, `?debug` only.

## Conventions

**A new voice is a preset and a writer, never a branch in the DSP.** The
worklet knows about a tube and twelve tracks. If a species needs something the
tube cannot do, the tube is wrong — do not add a case to `processor.js`.

**Everything is written in time order.** The worklet walks keys forward and
never looks back, so a consonant reaching back past the syllable before it is
clamped forward rather than sorted in.

**Consonants are written before the vowel comes on**, because that is when they
happen: a stop is a closure already made by the time you hear it open. Every
closure is still → shut → held → open, never one ramp.

**No held posture goes below `NO_HISS`.** The tube makes turbulence wherever it
is narrower than `HISS_AT`, which is what a fricative is; a vowel target under
that comes out as a vowel with a hiss over it. Only fricatives, a liquid, and a
stop on its way open may cross.

**There is no fallback voice.** If the worklet does not register, `createVoice`
hands back a mute stub and says so on screen — `?url` hands `processor.js` to
`addModule` unparsed, so a syntax error in it is never seen by `tsc`.

## Adding a people

A region in `character.ts` narrowing the axes it owns, a lect in
`audio/speech`, and a writer entry for whatever its inventory needs. Not a new
`BodyPreset` unless the anatomy genuinely differs.
