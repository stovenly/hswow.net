# The transition cue — surviving the crossing

Not built. Investigated and specified.

The door sound is cut off partway through every crossing. It is not being torn
down with the zone — `DoorAudio.play` owns every node it creates and schedules
all of them on the audio clock, exactly as its header promises. It is being
**left behind in space**: the cue is spatialised at the door you pressed, in the
old zone's coordinates, and then the listener teleports away from it.

The fix is three lines shorter than the bug. What takes longer is deciding what
to do about iron, which has been failing a check that quietly moved its own
threshold to let it pass.

---

## 1. The defect

`DoorAudio.play` anchors the cue at the door's world position
(`ZoneManager.ts:651`) through a `PannerNode` with `distanceModel: 'inverse'`,
`refDistance 1.6`, `rolloff 1.1`, `maxDistance 45` (`door.ts:228-233`). Nothing
ever moves it.

`enter()` then teleports the listener onto the arrival marker
(`ZoneManager.ts:493-494`). Every zone is added to the scene at the origin with
no offset (`ZoneManager.ts:438`), so an interior's door sits at
`(0, 0, -depth/2 + DOOR_PROUD)` (`countryside-homes.ts:155`) while the village
door you just pressed is tens of metres out. The listener does not step 1.15 m
through a doorway. It jumps an arbitrary distance away from a panner that stayed
put.

| listener distance to the panner | panner gain |
| --- | --- |
| ~2 m — standing at the door | 0.78 |
| ≥ 45 m — clamped at `maxDistance` | 0.032 |

**−27.7 dB, applied over the 20 ms listener ramp** in
`AudioEngine.updateListener` (`AudioEngine.ts:412-414`). The reverb send is
taken *after* the panner (`door.ts:242-245`), so the tail — 0.9 send, the part
the header calls "the first thing you hear of the place you have arrived in" —
collapses with it.

### When it lands

`use()` fires the cue, then `fade.cover` waits `FADE_TIME` = 0.22 s before
calling `enter()` (`Reticle.ts:153-156`).

- **Warm zone:** teleport at ~0.23 s.
- **Cold zone:** the build blocks the main thread, so the listener is never
  updated and the cue plays *over* the loading bar — then dies the instant the
  loop resumes and the bar disappears, at 0.22 s + build time.

Against the gestures, from `doorDuration` (`door.ts:131-134`): plank 0.32 s,
timber 0.56 s, **iron 1.10 s**. Iron loses most of itself, and iron is the one
with the longest ring, which is why it is the most obvious offender.

## 2. The fix: route it like footsteps

Delete the panner. The codebase has already made this ruling once, in
`footsteps.ts:1241`:

> **Your own feet are a metre and a half below your ears, not between them.**
> Nothing here is spatialised — a `PannerNode` at zero distance from the
> listener produces nonsense

`Footsteps` therefore runs into `engine.dry` with a separate `reverbSend` into
`engine.send` (`footsteps.ts:1256-1273`). The door cue is the same category of
sound — a first-person gesture, not a world object — and got the other
treatment. **That is the defect. The distance collapse is a symptom.**

**No panner at all, not a `StereoPannerNode`.** Footsteps has one because it
alternates feet and has something to vary. The door does not: you have to be
*looking* at a door to use it — `interaction.probe(player.camera, collider)` is
a crosshair ray — so the source is within a few degrees of centre by
construction, every time. A panner that can only ever render dead ahead is
paying for a node and producing this bug.

### Why not the two alternatives

- **Re-anchoring the panner to `side.target.position`** sounds better on paper
  and needs a handle on a sound already in flight. That means a second lifetime
  to keep in sync with the existing disposal timer, and it has to be correct
  when `enter()` bails at the re-entry guard (`ZoneManager.ts:427`, `:436`)
  before the teleport ever happens. `DoorAudio` currently holds one field and no
  mutable state; this is what it would cost to change that.
- **Setting `rolloffFactor = 0` at the crossing** needs the *same* handle —
  cheaper in the mutation, identical in the plumbing, worse in the result.
  Dominated.
- **Folding it into `Emitter`** is the reuse instinct and it is backwards:
  `Emitter` occludes by raycasting against a collider that is about to be
  rebuilt out from under it, which is the one thing a transition cue must not
  depend on.

## 3. What changes

### `src/audio/models/door.ts`

| Line | Change |
| --- | --- |
| 1 | Delete `import * as THREE` — `Vector3` was only in the signatures being removed |
| 45-49 | ASCII graph: drop the `panner` box |
| 61-62 | The header claims the sound outlives the *zone*; extend it to the listener, which is the half that was missing |
| 162 | `play(position, material)` → `play(material)` |
| 218-248 | `buildOutput`: drop the `position` param, delete `createPanner` and its six property assignments, connect `output` straight to `engine.dry` and to `send`; `nodes.push(output, send)` |
| 287-299 | Delete `setPosition` — 13 lines, including the deprecated-Safari branch |

Roughly **−35 lines, +3**, and one fewer node per press — the HRTF panner, which
`AudioEngine.ts:60-67` calls the most expensive in the API.

### `src/world/ZoneManager.ts`

- **651-652** collapse to `this.doorAudio?.play(material);`
- **681** delete `const _at` — used nowhere else in the file
- **636-641** `use()`'s doc says the tail carries across the cut. That becomes
  true rather than aspirational; worth a touch.

### Not touched

`art/door.ts`, `Portal.ts`, `galleries/layout.ts`, `hut-door.ts` and
`factory-door.ts` import `DoorMaterial` as a **type only**, and `DOOR_SPECS`
keeps its shape. `play` has exactly one caller in the repo.

## 4. Four numbers that need an ear

`spec.level` on all three materials — 0.55 / 0.5 / 0.42 — and
`send.gain.value` at `door.ts:238`.

Removing the panner removes ~0.78 of gain at the door, and the send was
compounding it: 0.9 × 0.78 ≈ 0.70 effective, now 0.9 flat. Start near 0.78× and
0.70, then trim by ear. This is the only part of the change that cannot be
settled by building it.

## 5. Iron, and the check that already knew

`tools/world-check.ts:735-738` states the invariant —

> Over before the fade is. `FADE_TIME + FADE_HOLD + FADE_TIME` is 0.58 s.

— and then asserts `duration < 1.3`. Iron at 1.10 s passes a check whose stated
intent it fails by a factor of two. The threshold was loosened to admit it and
the comment was left saying otherwise.

Shortening iron is not free, because a second block reads the same function.
`world-check.ts:778-795` requires the closest pair of doors to differ by more
than 0.3 octaves of pitch **or** length:

| pair | pitch | length | counts as |
| --- | --- | --- | --- |
| timber / iron | 0.42 | 0.97 | 0.97 |
| timber / plank | 0.83 | 0.80 | 0.83 |
| iron / plank | 0.42 | 1.78 | 1.78 |

Closest pair today: **0.83**. Bring iron inside 0.58 s and its length gap with
timber collapses from 0.97 to 0.05, leaving only the 240 Hz / 180 Hz pitch
difference — closest pair **0.42**, against a floor of 0.3. Still passing, and
iron stops being the door you can identify by how long it rings.

So this is a decision, not a cleanup:

- **Leave the durations, fix the comment.** Iron ringing past the fade into the
  new room is arguably the effect that was wanted, and it is one that only
  becomes audible once §2 lands. Recommended.
- **Shorten iron to match the stated invariant**, and accept that the three
  doors are told apart mostly by pitch.

Either way the comment and the constant stop disagreeing. A check that documents
one invariant and enforces a weaker one is worse than no comment on it at all.

## 6. Deliberately not in this change

- **`setRoom` retuning the tail on arrival** (`ZoneManager.ts:514`). It rewrites
  the reverb to the new room mid-flight, and that is intended — once the send
  survives the crossing there is finally a tail there for it to retune.
- **A far-field taper for the door.** `Emitter` has one (`TAPER_FROM`) because
  Web Audio's distance models never reach zero. With no panner the cue has no
  far field, so it needs nothing.
- **A second cue on arrival.** Cut once already; `door.ts:152-158` records why.

## 7. Phases

| | Phase | Touches | Gate |
| --- | --- | --- | --- |
| **P1** | Drop the panner, retrim the four numbers | `audio/models/door.ts`, `world/ZoneManager.ts` | **ear** |
| **P2** | Settle iron, reconcile the check with its own comment | `audio/models/door.ts`, `tools/world-check.ts` | check + **ear** |

**P1 is not closed by "it builds."** The whole defect is inaudible in a type
checker and audible in a doorway: cross into a warm zone and into a cold one,
and use an iron door for both, because iron is where 0.9 s of the gesture was
going missing.

**P2 is a decision before it is an edit.** Do not shorten iron to make a number
pass — pick which of the two readings in §5 is wanted, then make the comment and
the constant agree with it.

`docs/` gets rebuilt and committed with the source.
