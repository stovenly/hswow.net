# NPC dialogue — spec

**Built, all five phases.** Talking to villagers and cityfolk: names on hover, E to converse, a slow
Skyrim-style turn into the exchange, English on screen while the throat speaks
the people's own language, gestures on every line. Around it, three vibrance
fixes: NPCs stop phasing through furniture, NPCs greet each other in the
street, and a chance meeting can grow into a short back-and-forth.

This is not Phase 8. The keyword system, topic pool, `[[keyword]]` markup,
conditions and actions stay in `MASTER-SPEC.md`. This spec builds the *stage*
Phase 8 will play on — the verb, the camera, the box, the voice path — with
placeholder content shaped so Phase 8's data model drops into it.

**The short version.** A creature placement grows an invisible torso proxy
carrying its name ("Villager" / "Cityfolk" for now), so the existing reticle
prompt names it on hover and E yields a new `Focus { kind: 'talk' }`. Talking
releases the mouse under a new `is-dialogue` state; the controller eases the
camera onto the NPC's head over about a second while the NPC's existing greet
turn brings it round to face you — two turns reading as one exchange. A bottom
panel in the prompt register types out English lines syllable-by-syllable
while the voice speaks them in the speaker's lect, through a new deterministic
English→lect converter: the same English word is always the same lect word,
questions rise, statements decline, function words become short recurring
particles. Greeting on open (skipped if they hailed you recently), a couple of
placeholder topics, farewell on close, and the proximity greeting stays locked
out through it all and for a while after. Gestures land at least once per
line. Separately: creatures gain a capsule resolve against the collision
octree, and pairs of NPCs greet each other with turn-taking, a pair lockout,
and an exponentially-decaying chance of small talk that always closes with a
farewell.

---

## What exists

Everything below was read from the code; the seams named here are the ones
the build uses.

- **The voice already has the written-line path.** `Voice.say(text, at)`
  (`audio/voice/types.ts`) is implemented and called by nothing in game code.
  `Utterance.units` carries per-syllable `{ at, length, stress, from, to }` —
  text ranges put there for a typewriter reveal that was never built.
- **Prosody from punctuation already works.** `score(text)` (`speech/parse.ts`)
  splits words and sentences, stamps every syllable with `tune` (`?` →
  question, `!` → exclaim), `along` (0..1 through the sentence), `final`, and
  pause seconds from `. , ; —`. The writer turns those into real contours — a
  question's last syllables rise a fifth, statements decline by the speaker's
  `declination`, city statements creak at the end.
- **The lects are complete.** `speech/lects.ts` holds both peoples'
  inventories, syllable shapes, tones, tunes, rates and line banks.
  `babble.ts` draws greetings and chatter with a no-repeat memory. There is no
  farewell bank yet; `done/PHONEMES.md` §6.5 anticipated one.
- **The NPC side of the exchange is built.** `Creature.ts` has states
  `greet`/`talk`, the turn-toward-player sequencing (`TURN_RATE = 2.4`,
  `BODY_LAG = 0.4`, speak only once facing), the greeting lockouts
  (`greeted`, `greetCooldown`, global `lastGreetAt`), `voiceNow()` for mouth
  level and beat, and a positional `Emitter` per creature. Gesture families in
  `gaits.ts`: 10 greetings, 6 talk hand styles, 5 fidgets, face layers.
- **Interaction has an extension seam.** `Focus` is a discriminated union
  resolved in `ZoneManager.lookAhead` from `userData` marks;
  `App.interceptInteract` consumes the E press; `items.ts` installs the
  current handler. Hover is `userData.label` on any ancestor, shown by
  `Reticle`; a `THREE.SkinnedMesh` raycasts against its bind pose, so the
  creature mesh itself is the wrong target.
- **The presentation slots exist unused.** `#speech` in `styles.css` — the
  bottom panel with `.speech-unsaid` for the reveal — shipped with the
  villagers and was never mounted. `AudioEngine.duck` is "a stub until there
  is dialogue to duck under". The pause stack is governed by the one
  `#pause` gate, which a new body class must join.
- **Creatures collide with almost nothing.** Not in the octree, not
  interaction targets. They avoid walls with two rays probed every 0.3 s
  (knee and chest heights) — a table top slips between the rays — and push
  off each other with a radius test in the pair loop.
- **The player's camera is never taken.** `Controller` owns `yaw`/`pitch`;
  `aim()` exists for the editor only. `angleTo` in `life/pose.ts` is the
  shortest-path wrap everything uses. Damping convention is
  `THREE.MathUtils.damp` and the springs in `life/spring.ts`.

## The change

### 1. Names on hover

`kinds.ts`'s creature entry gains an invisible cylinder proxy — child of the
skinned mesh at torso height, `spec.radius` wide, `spec.height` tall — carrying
`userData.label` (the name) and `userData.npc` (a mark holding the entry id
and folk). The proxy, not the skinned mesh: a skinned mesh raycasts in bind
pose. `collectTargets` picks it up like any label. Names for now are
"Villager" and "Cityfolk" by folk; a `name` field on the creature entry
overrides when the world starts naming people — the names themselves are
yours.

The prompt is the ordinary reticle prompt, same register as items, containers
and doors. Reach is the standard 2.2 m; occlusion behaves as it does for
everything else.

### 2. The talk verb

`Focus` gains `{ kind: 'talk'; object; npc }`, resolved in `lookAhead` from
`userData.npc` ahead of the pickup/container walk. The handler chains where
`items.ts` already intercepts. Talking is refused while the creature is mid
NPC-to-NPC exchange (§7) — the prompt still names them, E just does nothing
until they finish, the same shape as a door that will not open.

Pressing E within reach opens the dialogue: `is-dialogue` joins the pause
gate's list, the pointer lock is released through the existing
`wasPlaying`/`is-capturing` dance, movement and mouse-look are gated (look is
still drained and discarded, or the stored spin lands the moment the box
closes), and a scrim catches stray clicks exactly as `Reading`'s does.

### 3. The camera — the part worth getting right

The turn is a fixed-time eased blend, not a damp: a damp moves fastest at the
start, which reads as a snap; the ask is Skyrim's slow settle.

- Target: yaw and pitch that put the NPC's head (`spec.headHeight` above its
  feet) at centre screen, recomputed every frame so a still-settling NPC is
  tracked, wrapped through `angleTo`.
- Blend: cubic ease-in-out over `0.45 s + 0.35 s per radian` of initial
  error, capped at 1.1 s — a quarter turn takes ~0.7 s, matching the NPC's
  own `TURN_RATE` so the two turns mirror.
- After the blend lands, the camera holds on the head through a lazy damp
  (`λ ≈ 3`), so breathing sway is followed without rigidity.
- The NPC meanwhile runs its existing greet turn — shoulders lagging the
  head by `BODY_LAG` — and does not speak until it faces you, exactly the
  sequencing the proximity greeting already performs.
- On close, nothing snaps back: the camera is simply yours again from where
  it rests. No FOV change, no cut, no fade.

This lives in `Controller` as a converse mode (`converse(target)` /
`release()`): it is the one place yaw and pitch may be written, and the mode
suppresses `applyLook` rather than fighting it.

### 4. English shown, lect spoken

A new module in `audio/speech/` (working name `loan.ts`; the name is yours)
turns an English line into a `Score` in the speaker's lect:

- **Words are the unit, and the mapping is a language, not a shuffle.** Each
  English word hashes to a seed; the seed drives a small RNG that builds one
  lect word from that lect's own shapes, onsets, vowels, codas and tones.
  The same English word is the same lect word for every speaker of that
  people, forever — "well" said by any villager is one word. Cached per lect.
- **Function words become particles.** The ~20 most common English words
  (the, a, of, and, to, is, you, …) map to fixed single-syllable lect
  particles. Grammar-like recurrence is what makes sustained speech sound
  like a language instead of noise, and it keeps the word-for-word alignment
  the reveal needs.
- **Length follows length, inside the lect's habits.** Syllable count scales
  with the English word's, clamped to the lect's `wordLength` (1–3 country,
  2–4 city); country keeps its reduplication habit for short words.
- **Sentence structure rides the existing machinery.** The converter stitches
  the lect words into a `Score` and stamps `tune`/`along`/`final`/pauses from
  the *English* punctuation — so a question rises a fifth on its last word, a
  statement declines, an exclamation starts high and falls, commas breathe,
  and city speakers creak their endings, all through code that already runs.
  On top: the sentence-final word's vowel is marked long (final lengthening),
  and particles carry `level` tone and low stress so they reduce as real
  function words do.
- **Delivery.** `Voice` gains `speak(score, at)` — `say` minus the parse —
  and the dialogue drives it. Per-speaker identity (pitch, rate, breath)
  keeps two villagers distinct while the words stay shared.

`Utterance.units`' `from`/`to` ranges point into the *English* line, one lect
word per English word, so the box reveals the English as its translation is
voiced.

### 5. The box, and the flow

`src/ui/Dialogue.ts` mounts the long-promised `#speech` slot, deliberately
plain for now: bottom-centre text orphaned on the screen — **no panel and no
background behind it** — the NPC's name small above the line, the choices as
text lines beneath. Clean and in register with the rest of the UI; if the
letters fight the world behind them, a border on the text comes later, on
request. The line is laid at full size immediately with `.speech-unsaid`
holding the space, syllables un-hidden as their units pass — no reflow
mid-sentence. The real dialogue UI is a later cleanup pass; nothing here is
precious.

Flow, all placeholder wording (yours to rewrite, marked as such in the data):

1. **Greeting** — one line on open. Skipped when they hailed you in the open
   world recently (`greeted` set and `greetCooldown` still running): you go
   straight to the topics, as asked.
2. **Topics** — for now two, "Village" and "City", each answering with a line
   or two of flavour. Choices are bare clickable text lines under the spoken
   line; a choice speaks its reply, then the choices return. The data
   shape is a per-folk table today, keyed so Phase 8's per-NPC
   `topics`/`rebuffs` model replaces it without moving the UI.
3. **Farewell** — the last choice, and what Escape chooses. Its line plays as
   the box closes and control returns; nobody waits out the goodbye.

The proximity greeting is locked out for the whole exchange, and when the
farewell *utterance ends* the lockout is set fresh — `greeted = true`,
`greetCooldown` re-rolled, `lastGreetAt` stamped — so they do not hail you as
you walk off.

Dialogue lines duck the world: the `AudioEngine.duck` stub finally pulls the
ambience down a few dB under an utterance and recovers after.

### 6. Gestures on every line

While its voice speaks, the creature is in a converse state: the existing
`bipedTalk` hand style runs off `voiceNow()`'s beat as it does today, and on
top, discrete gestures:

- one from the talk-appropriate set at each line's start,
- another at each further sentence boundary inside a long line (the `Score`'s
  sentence pauses mark them),
- the greeting line uses the greeting families; the farewell draws from the
  calmer of them (bow, raise, press).

While listening, fidgets at a low rate. All of it inside the motion envelope;
any gesture that needs more room widens the envelope entry and takes the
recheck that implies.

### 7. NPCs meet each other

Beside the existing pair push loop, awake bipeds check for meetings:

- **Trigger**: two bipeds within 2.4 m, both in `idle`/`walk`/`business`,
  neither talking to the player, the pair not locked out. The pair lockout is
  long — 4 minutes plus a per-pair hash spread — because a street where the
  same two hail each other every lap is worse than one where they never do.
- **Turn-taking**: a hash of the two seeds and a meeting counter flips the
  coin for who opens. The opener turns, gestures, and speaks a greeting from
  its own lect's bank; the responder waits for the opener's utterance to end
  plus a beat, then answers with its own. Never both at once; the global
  greeting gap is respected so a player-facing hail cannot pile on top.
- **Small talk, decaying**: after the hello pair, a 0.35 chance of one
  chatter exchange (a line each, alternating), each further exchange at ×0.4
  of the last — usually nothing, sometimes a line each, rarely a real chat.
  If any chatter happened at all, the meeting always closes with a farewell
  pair from the new bank. Hello-hello alone ends unceremoniously, as asked.
- Both face each other through it with the existing turn machinery, gesture
  per line, and resume their business after. A meeting aborts cleanly if the
  player opens dialogue with one of them or one is pulled out of range.

The farewell bank is new in `lects.ts` — a dozen lines per people, written in
each lect's inventory like the greeting banks, shaped goodbye-like (falling
tunes, longer finals). Drafted for you to reject line by line, as the
greeting banks were.

### 8. Creatures stop phasing through furniture

Creatures gain a capsule resolve against the collision octree: radius and
height from the spec, up to two depenetration passes per frame while awake,
horizontal push only, run after movement and before the ground snap. The two
walk-probe rays stay for path planning; the capsule is what actually keeps a
villager out of the table. Cost is bounded by the awake set (the 55 m range),
and a resolved push that keeps blocking simply ends the walk into `idle`, as
a blocked probe does today.

## Build order

**1 — the verb and the camera.** Proxy and label, `Focus 'talk'`,
`is-dialogue` in the pause gate, the converse camera in `Controller`, the box
with greeting → topics → farewell speaking through `babble('talk')` as a
stand-in voice.
*Done when* hovering an NPC names it, E turns you smoothly onto them while
they turn to you, the placeholder flow plays end to end, Escape farewells,
and the proximity greeting never fires during or shortly after.

**2 — the language.** The converter, `Voice.speak`, the typewriter reveal
against the English, the duck. Farewell/greeting/topic lines all through it.
*Done when* the same English line from two villagers is the same words in two
voices, a question audibly rises, and the box reveals in step with the voice.

**3 — gestures and polish.** Per-line and per-sentence gestures, listening
fidgets, greeting-skip freshness, lockout set at farewell end (phase 1 sets it at
close; this moves it to utterance end).
*Done when* no line passes without a gesture and long lines gesture again
mid-line.

**4 — prop collision.** The capsule resolve.
*Done when* a villager walking at a table stops or slides around it, and the
cottage's furniture is never inside anyone.

**5 — meetings.** Pair trigger, turn-taking, the decaying chat, the farewell
bank, lockouts.
*Done when* two villagers crossing paths sometimes exchange hellos, rarely
chat, always close a chat with goodbyes, and never do it twice in quick
succession.

## Risks

- **The reveal's alignment.** One lect word per English word is the invariant
  the typewriter rests on; contractions and hyphenated words must normalise
  to one token each or the ranges drift.
- **Pointer lock churn.** Open and close cross the browser's relock cooldown;
  everything goes through `input.capture()` and `is-capturing` as the other
  panels do, nothing calls `requestPointerLock` bare.
- **A moving target mid-blend.** The NPC settles as you settle; recomputing
  the target each frame handles it, but the blend must measure remaining
  error against the *live* target or it can land short.
- **Worklet mute.** A creature whose voice failed to build stays mute today;
  in dialogue the reveal must run off the wall clock in that case so the text
  still arrives.
- **Meeting deadlocks.** Two NPCs waiting on each other's utterances need a
  hard timeout; any state the pair machine can enter must fall back to
  `idle` on its own.
