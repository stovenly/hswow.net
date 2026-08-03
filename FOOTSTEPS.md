# Footsteps — direction, stance, and character

**Part built.** F1, F2, M2 and M4 have landed; see the phase table in §14 for
what that means and what is still owed. Extends `audio/models/footsteps.ts`,
which already had the hard parts.

**Short answer: yes to all three, and the file is already shaped for it.**
`strike()` takes a `shape` argument precisely so that a step, a landing and a
push-off can be the same foot on the same ground with a different *contact*, and
its own comment says why giving each gesture its own material table would be
wrong. Backwards, sideways and crouched are three more contacts. They do not
need new materials, new engines or new sounds — they need the gesture vocabulary
that already exists to be finished.

There is one thing that has to be got right or this is worse than what exists,
and it is the diagonal. See §3.

---

## 1. What is actually different, per the biomechanics

The instinct in the request is correct on all three counts, and the literature is
sharper than "reverse" and "different parts of the foot".

### Backwards is a mirror, but not a symmetric one

In backward walking the anterior-posterior ground reaction force is
approximately the mirror image of forward walking, and `heel off` replaces
`toe off` as the transition event — so the contact order genuinely reverses:
**forefoot lands, heel lowers after.**

But the weights do not mirror. Forward walking peaks at roughly 50% of the gait
cycle; backward walking peaks at **15% of the cycle, at 118% of body weight**.
The first contact carries the load. So this is not "swap the two levels" — in
forward gait the heel strike is heavy and the toe-off is a light push
(`toe: 0.45` on stone); in backward gait the forefoot landing is heavy and what
follows is a **heel lowering under control**, which is not a strike at all. It is
a flat pad being set down: longer contact, much duller, almost no ring, and
barely any scuff, because nothing is pushing off.

Backward walking also shows a larger medial force — **7.3% of body weight
against 4.6% forward**. Going backwards is a sideways-scuffier event than going
forwards, which shows up as grit, not as level.

### Sideways is a different event entirely, and the two feet do different things

This is the one the request is most right about, and it goes further than
expected. Sidestepping has **no heel-to-toe roll at all**, because the foot's
long axis is perpendicular to travel. There is nothing to roll along. Instead the
contact rolls *across* the foot — along the lateral border, then flat.

And unlike forward walking, where both feet do the same thing half a cycle apart,
**a sidestep is asymmetric between feet**:

- The **lead foot** (on the side you are travelling toward) reaches out and
  catches your weight on its **outer edge**, then flattens. A large, soft, broad
  contact area. Studies of side-step cutting find forefoot and lateral contact
  produce **lower vertical ground reaction force and a lower loading rate** than
  a rearfoot strike — so it is duller and less impulsive, not just different.
- The **trail foot** does not strike anything. It pushes off medially and is
  *dragged in* to close the gap. It is a scuff and a placement — which is very
  nearly the shape `jump()` already uses for a push-off.

The alternation this needs is **already there for free**. `takeFoot()` returns
−1 or +1, so `foot === sign(moveX)` is the lead foot, and because the cycle
alternates, a strafe naturally produces lead, trail, lead, trail — step out,
drag in, step out, drag in. That is exactly what sidestepping is.

### Crouching is the biggest difference of the three, and today it is nearly inaudible

Squatting, the ankle cannot dorsiflex enough to present the heel, so the foot
arrives **flat or forefoot-first onto a bent knee**. The knee absorbs the load,
so the loading rate collapses. There is no roll, because there is nothing to roll
through.

**Here is the concrete problem.** Crouching already changes the sound, via
`crouchDrag: 0.45` feeding a slower speed into the weight curve. Working it
through with the real numbers — `walkSpeed: 4.2`, so a crouched walk is
1.89 m/s:

| | speed | `weight` | relative |
|---|---|---|---|
| Walk | 4.2 m/s | 0.863 | — |
| Crouched walk | 1.89 m/s | 0.677 | **0.785** |

So crouching today is **about 2 dB quieter and identical in every other
respect.** That is not a sneak; that is the same footstep slightly down. Worse,
the roll gap is derived from speed — `roll × max(0.35, 1 − speed/12)` — so
crouching currently *lengthens* the heel-to-toe roll from 49 ms to 63 ms, when
the truth is that a crouched step has **no roll at all**.

The same arithmetic gives a useful general warning. Walk to sprint is 0.863 to
0.957: **under 1 dB.** Level is a weak lever in this system by design, and the
sprint reads as faster cadence and a merging roll rather than as more volume.
Everything below therefore works through timbre and contact, not through gain.

---

## 2. The design: contacts, not gestures

Right now `step()` hardcodes "strike, then strike again at `roll` scaled by
`toe`". Generalise that one level:

```ts
/** One contact of a foot with the ground, relative to the material. */
interface Contact {
  /** When, as a multiple of surface.roll. The first is always 0. */
  at: number;
  /** Level, as a multiple of the step's force. */
  level: number;
  /** Contact time, as a multiple of impact.duration. Softness. */
  stretch: number;
  /** How hard the body is rung. */
  modes: number;
  /** How much loose material is scuffed up. */
  grit: number;
  /** Brightness, as a multiple of impact.tone. */
  tone: number;
}

type Gait = readonly [Contact, Contact];
```

`stretch`, `modes` and `grit` are the three the `shape` argument already carries.
**`tone` is the one addition, and it is the important one** — a crouched step and
a lateral edge-landing are principally *duller*, and without a brightness control
they can only be quieter, which is the failure the table above describes.

`tone` costs one structural change: `chainFor()` currently caches the impact
lowpass per surface, so it cannot vary per contact. Give the impact path its own
`BiquadFilterNode` per contact instead. That fits the file's own rule rather than
bending it — the comment says *"resonators are the ground, not the step"*, and
the resonators must stay cached because their ring-down is state. **The impact
filter is part of the step, not the ground.** It carries nothing between
contacts, and one biquad alongside the buffer source and gain that every contact
already allocates is not a cost worth discussing.

### The four gaits

Multipliers, not absolutes, so every material keeps its own character.

| | `at` | `level` | `stretch` | `modes` | `grit` | `tone` | |
|---|---|---|---|---|---|---|---|
| **Forward** — heel | 0 | 1 | 1 | 1 | 1 | 1 | the strike |
| **Forward** — toe | 1 | `surface.toe` | 1.15 | 0.7 | 1.25 | 0.9 | a push, not a hit |
| **Backward** — forefoot | 0 | 1 | 0.9 | 0.85 | 1.1 | 1.05 | smaller, firmer contact |
| **Backward** — heel | 1.25 | 0.7 | 1.6 | 0.5 | 0.5 | 0.65 | lowered, not struck |
| **Lateral lead** — edge | 0 | 1 | 1.3 | 0.8 | 0.9 | 0.7 | broad, on the outer border |
| **Lateral lead** — flatten | 0.4 | 0.55 | 1.5 | 0.45 | 1.3 | 0.6 | rolls across, not along |
| **Lateral trail** — push | 0 | 0.5 | 2.4 | 0.3 | 1.8 | 0.75 | a scuff |
| **Lateral trail** — set | 0.5 | 0.4 | 1.4 | 0.5 | 0.7 | 0.7 | placed |

Two things to note in that table.

**Forward changes too.** Its toe-off is currently an exact copy of the heel
strike at 45% level, which is why quick walking has a slightly doubled, clicky
quality — the same event twice. A toe-off is a push: more scuff, less ring,
slightly duller. This row improves the 95% case, not just the new ones, and it is
worth landing on its own so it can be heard against the current build.

**The lateral roll gaps are much shorter** — 0.4 and 0.5 against forward's 1.0.
Rolling across the width of a foot is roughly a third of the distance of rolling
along its length, and the timing is most of what says *sideways*.

### Clamp the composed contact, not the individual multipliers

**This is the one structural risk in the spec and it needs saying before any of
the tables are trusted.** Every number above is a multiplier, and they stack:
surface × gait × landing × crouch. The worst case is not hypothetical — a
running lateral landing on leaves is `grit` 1.8 (lateral trail) × 2.2 (glance)
= **3.96×**, applied to the surface that already has the highest particle count
in the table at 34. That will not sound like a skid. It will sound like a fault.

Multiplicative parameter sets always do this, and the wrong fix is to shave the
individual tables until no combination misbehaves — that detunes the common
cases to protect the rare ones, and it has to be redone every time a row
changes.

**Compose first, clamp once, at the end.** Roughly:

| | range |
|---|---|
| `stretch` | 0.5 – 3.0 |
| `modes` | 0 – 1.2 |
| `grit` | 0 – 2.5 |
| `tone` | 0.35 – 1.3 |
| `level` | 0 – 1.4 |

One clamp in one place, so the tables stay readable as physics and the safety
lives somewhere it can be reasoned about. Where a clamp fires often, that is
information — it says two multipliers are describing the same thing twice.

### Crouch is a modifier, not a gait

It applies on top of whichever gait is selected, scaled by the eased `stance`
(0..1), because it composes with all of them — you can creep backwards.

At full crouch: `level ×0.45`, `stretch ×1.7`, `modes ×0.35`, `grit ×0.4`,
`tone ×0.5`, and **the second contact's `at` ×0.35 and `level` ×0.4**, which is
the roll collapsing into the placement.

Combined with the 0.785 that the speed curve already contributes, that is a total
of about **−9 dB and half the brightness** against a standing walk. That is a
sneak. And it is largely a timbre change, which is why it will read as *crouched*
rather than as *turned down*.

Use `stance`, not `input.crouching`. `stance` is the eased value the camera and
the collider both follow, so the sound changes with the body rather than with the
key; `crouchSpeed: 22` means it settles in about 50 ms either way. It is private
and needs a getter.

---

## 3. The diagonal, which is where this breaks

**If gait is chosen by branching on direction, this ships worse than what exists
now.** Strafing while walking forward is most real movement, and a player
drifting across the boundary between "forward" and "lateral" would hear their
footsteps flip character mid-corridor. A hard switch would be far more noticeable
than the missing detail it was added to fix.

So blend, do not branch. `input.moveX` and `input.moveZ` are already in the
player's local frame — right/left and forward/back — which is exactly the two
numbers needed, with no transformation at all. From the normalised pair:

```
lateral  = |moveX|
backward = max(0, -moveZ)
forward  = 1 − max(lateral, backward)
```

Then interpolate the *parameters*. Every gait above is two contacts, so blending
is a pairwise lerp across six numbers — no branch, no discontinuity, and a
diagonal is genuinely half a sidestep, which is what it physically is.

Two details this needs:

- **Latch the last non-zero direction.** Input can drop to zero while the player
  is still decelerating, and a step fired during that should keep the gait it was
  travelling with rather than snapping to forward.
- **Take direction from input, not velocity.** Sliding sideways down a slope
  while pressing forward is still forward walking — your feet do what you are
  asking them to. Velocity is the wrong source, for the same reason `wishX/wishZ`
  is kept before the slope projection a few lines up in `Controller`.

### One free nicety

Pan magnitude should differ between lead and trail. The lead foot lands out to
the side you are travelling toward; the trail foot is dragged in near the
midline. So lead ≈ 0.28, trail ≈ 0.10, against the current flat 0.2. Costs
nothing and is most of what sells the asymmetry.

Also worth doing: on entering a strafe from a standstill, set `this.left` so the
**next foot is the lead one**. Otherwise the first sidestep is a trail-foot drag
with nothing to drag toward. One line, one step's worth of difference.

---

## 4. Landings: how flush, and which way

`land()` currently receives one number — `impact = -this.velocity.y`, pure
vertical speed. That describes a drop and nothing else, which is why every
landing in the game is the same centred double-thump at different volumes.

**The missing number is the approach angle**, and it is the one that decides
whether this was a landing at all:

```
horizontal = hypot(velocity.x, velocity.z)
vertical   = impact                        // already computed
glance     = horizontal / (horizontal + vertical)
```

Dimensionless, well behaved, and it separates the cases cleanly with the tuning
as it stands:

| | horizontal | vertical | `glance` | |
|---|---|---|---|---|
| Jump on the spot | 0 | 7.2 | **0.00** | a stomp |
| Walking jump | 4.2 | 7.2 | **0.37** | a landing |
| Sprinting jump | 7.35 | 7.2 | **0.50** | a stride that touched down |
| Off a low ledge, sprinting | 7.35 | 3.0 | **0.71** | barely a landing |
| Long fall, sprinting | 7.35 | 18 | **0.29** | a stomp again — correctly |

That last row is the check that the number is the right one. Falling a long way
while moving fast is *still* a heavy vertical arrival, and any formula based on
total speed would have got it backwards.

`LANDING_FULL = 9` should stay vertical-only. Vertical is what gets arrested;
horizontal carries on. Total kinetic energy would be the wrong measure and would
make a fast shallow skim louder than a drop, which is the opposite of true.

### What glance changes

At `glance = 0`, everything stays exactly as it is today — the current `land()`
is a correct model of a flat drop and should be preserved as the zero end.

| | flat drop | glancing (0.7) | why |
|---|---|---|---|
| Pan | 0 | ±0.22 | one foot leads; at a stride's separation the feet are genuinely far apart, so this goes *wider* than a footstep's 0.2 |
| Gap between feet | 12–30 ms | ~90 ms | they arrive at stride separation, not together |
| Second contact level | 0.4–0.6 | 0.8 | both feet do real work; neither is merely catching the other |
| `stretch` | 1 | 1.5 | shear spreads the contact |
| `modes` | 1 | 0.55 | the energy carries forward instead of into the floor |
| `grit` | 1 | 2.2 | **the skid** — the single biggest tell |
| `tone` | 1 | 0.8 | |
| Level | 1 | 1.25 | modest; more mass in motion, more shear |

### Looking versus moving

This is the second half of the question and it drops straight onto the machinery
in §2. Rotate velocity into the player's local frame with the yaw they are
actually looking along:

```
localForward = −(vx·sin(yaw) + vz·cos(yaw))
localRight   =   vx·cos(yaw) − vz·sin(yaw)
```

— the same two basis vectors `applyWish` builds, so the frames cannot drift
apart. Normalise by `horizontal`, and that pair feeds **the same gait blend the
walk uses**. Jumping forwards but turning in the air to face sideways lands you
in the lateral contact, which is exactly right and costs nothing extra once §3
exists.

**And `glance` is also the weight on that blend.** Falling straight down,
direction is meaningless — there is no shear to have a direction. Skimming in, it
is everything. One number does both jobs, and it means a stomp can never
accidentally acquire a sideways character.

The three directions do not land alike:

- **Forward** — a roll-through. The stride continues; this is the case that most
  wants the widened gap and the reduced ring.
- **Lateral** — the harsh one. You catch your weight on the outside edge with
  momentum travelling *across* the foot, which the side-step cutting work
  identifies as the highest-load, highest-loading-rate contact of the set. So
  the two contacts stay **close** — about 0.35 of the running gap — because
  there is no roll-through. You catch, and you plant. It also takes the most
  grit of the three.
- **Backward** — the least controlled thing a person can do: heels first with
  momentum going away from you. A heavier second contact, because you sit back
  onto it, and more scrape than strike.

### Landings read velocity — steps read input

**This deliberately contradicts the rule in §3, and it has to.** A step reads
`input` because your feet do what you are asking them to. A landing cannot:
`airAccel: 7.5` against `groundAccel: 14` and a `maxAirSpeed` cap of 1.12 mean
that in the air you have limited authority over where your body goes. The shear
at touchdown is set by where you are *actually travelling*, not by what you are
holding. Reading input here would let a player mute their own skid by releasing
a key mid-flight.

Both rules are right for their own event. Stating the pair together is the point
— it is exactly the kind of thing that gets "tidied" into consistency later and
quietly breaks one of them.

### Two interactions with existing code

**The foot cycle.** `land()` currently leaves it alone on purpose, and its
comment explains why: you land on both feet, so the landing belongs to neither.
That reasoning is correct for a drop and wrong for a running touchdown, where the
landing genuinely *is* a footfall in the stride. So above `glance > 0.45` it
should take a foot and advance the cycle.

A discrete switch inside a continuous blend, which normally would not be
acceptable — but here it is inaudible, because nothing about the landing sound
changes at the threshold. Pan is already continuous through it, and the only
consequence is which foot the *next* step uses some 300 ms later.

**`strideProgress` needs resetting, and this is a live stutter.** `advanceBob`
returns early when airborne, so stride progress freezes mid-jump and resumes on
touchdown. Land running with it at 0.97 and a full footstep fires a few
centimetres later, on top of the landing. Any landing that takes a foot should
set `strideProgress = 0`, buying a clean stride of clearance.

This one is a `Controller` change rather than an audio change, but it belongs in
the same commit: it is the same event, and it is only audible once landings and
steps stop sounding identical.

### Left alone

The `impact > 1` gate stays. Below it the player barely left the ground and the
gait is still running, so it will fire a footfall of its own — adding a landing
there would double the sound, not enrich it.

`landDip` also stays vertical-only for now. A glancing landing physically dips
the camera less, which is true and worth doing, but it is a feel change to the
controller and it should be judged on feel, not smuggled in beside an audio
commit.

---

## 5. Other enhancements worth having

Ranked. The first two are the ones I would actually push for.

### a. Per-foot character — the cheapest real win in the file

Steps currently vary by `rand(0.9, 1.1)` per contact. Random variation stops
things sounding sampled, but it does not make a gait sound like *a person's*
gait, because there is nothing to learn. Give each foot a small **persistent**
offset on top of the existing randomness. Real people are asymmetric, the ear
picks it up within a few steps, and it is about six lines.

**Put it in timing and brightness, not in level.** ±3% of level is 0.26 dB,
which is below the just-noticeable difference for a transient — it would be
work for nothing. Timing is far more salient: ±5% of roll is 2.5 ms on stone
and is genuinely perceptible as a gait rather than as an error. Bind a small
`tone` offset to each foot as well. Level can carry a couple of percent for
free, but it should not be what the effect rests on.

### b. Turning on the spot is silent

Footfalls are driven by distance covered, so pivoting produces no sound at all
while the whole world swings past. A pivot scuffs. Yaw rate is available in
`Controller`, and the sound wanted is exactly the lateral trail foot's push
contact — so once §2 exists this is a trigger condition, not a new sound.

### c. Slope and step awareness

Going up, you land forefoot-first — much the same contact as a crouched step.
Coming down, the heel arrives harder and earlier. Both inputs are already
present: `groundNormal` is tracked, and `applyCamera` already computes `climbed`
per frame for the step-lag smoothing. This mostly reuses the crouch modifier with
the sign flipped.

### d. The step that stops

`advanceBob` eases the phase to the nearest footfall below 0.15 m/s and primes
`firstStepFraction` for moving off again, but nothing sounds. Coming to a halt
plants a final foot that does not roll off. Cheap — but the risk is a spurious
step every time a key is tapped, so it needs hearing before it is kept.

### e. Landings inherit the crouch modifier

`land()` should take `stance` as well as the two numbers §4 adds. Landing out of
a crouch is a soft absorbed arrival, not the same double-thump quieter — the
knee is already bent, which is the whole point of the crouch contact. It
composes with `glance` rather than competing with it: a crouched running landing
is soft *and* sheared.

---

## 6. Shape of the work

Broken into phases in **§14**, which covers both parts of this document in one
ordered list.

Nothing here is a player option. This is not a quality ladder or a preference —
it is what walking sounds like, and there is no version of the game that wants
the sideways one to sound like the forward one.

---

## 7. Deliberately not in the first version

- **Shoe or actor character.** `Contact` is the natural home for boots against
  bare feet, and later for anything else that walks. Worth building toward,
  not worth generalising for before there is a second walker.
- **Shortening the backward stride.** Real backward stride is 85–90% of forward,
  which would tighten the cadence appropriately. It lives in `advanceBob`, not in
  the audio, and it moves the head bob as well — so it is a controller change
  with a feel consequence, and it belongs in its own commit.
- **Correcting the modal bank.** `chainFor()` still uses `ring: 'filter'` and
  `compensation: 'inverse'`, both of which the file documents as wrong and
  preserved on purpose because `SURFACES` was tuned by ear against them. Nothing
  here touches that, and nothing here should — it is its own audible commit.

---

## 8. Needs an eyeball, or rather an ear

- **Whether the lateral trail foot is too quiet.** At `level: 0.5` through a
  scuff shape it may vanish on grass, and a sidestep that only sounds every other
  step is worse than one that sounds wrong.
- **The blend near 45°.** The arithmetic is continuous; whether it *sounds*
  continuous while circle-strafing is the actual test, and circle-strafing round
  a prop is the way to hear it.
- **Whether crouch at −9 dB is too quiet to be informative.** Sneaking should
  still tell you what you are walking on. Stone and gravel will survive it; grass
  may not.
- **Backward on gravel.** The heaviest first contact and the largest grit
  multiplier land on the surface that is already almost entirely PhISEM
  (`count: 26`). If anything overloads, it is that.
- **Whether a sprinting jump still reads as a landing.** At `glance = 0.50` it
  gets half the shallow treatment, and if that is too much it will sound like a
  heavy footstep rather than a touchdown. This is the most likely thing in §4 to
  need its curve bending — probably by putting the glance response on a curve
  rather than using it raw.
- **The skid on gravel and leaves, back to back.** `grit ×2.2` on top of
  `count: 34` for leaves is the loudest thing this spec asks for anywhere, and a
  running landing in the wood is where it will be heard first.

---
---

# Part two — the materials underneath

Separate piece of work, specced here because it shares a file and because the
order between the two matters. Part one is gestures: **ratios**, describing how
a contact is made. This is the absolutes underneath them.

## 9. Why the materials sound thin, precisely

"Fine for basic ground, not the best elsewhere" is a more exact diagnosis than
it sounds, and the code says why.

`chainFor()` builds the bank with `ring: 'filter'` and `compensation: 'inverse'`,
both of which `modal.ts` documents as wrong and which are preserved on purpose.
`ring: 'filter'` derives Q from the decay time, `Q = π · f · decay`, capped at
220. Working that out for the table as it stands:

| surface | mode | derived Q | bandwidth |
|---|---|---|---|
| earth | 120 Hz / 0.05 s | **18.9** | 6.4 Hz |
| mud | 240 / 0.06 | **45.2** | 5.3 Hz |
| stone | 620 / 0.06 | **116.9** | 5.3 Hz |
| stone | 2600 / 0.018 | **147.0** | 17.7 Hz |
| wood | 155 / 0.22 | **107.1** | 1.4 Hz |
| wood | 390 / 0.15 | **183.8** | 2.1 Hz |
| metal | 480 / 0.5 | 754 → **clamped 220** | 2.2 Hz |
| metal | 4100 / 0.18 | 2319 → **clamped 220** | 18.6 Hz |

`modal.ts` gives the threshold explicitly: above `π · f · decay ≈ 40` you want
`'excitation'` instead. **Every mode in the table except earth's is past it, most
of them by an order of magnitude.**

A bandpass two hertz wide is not a resonance. It is a sine wave with a rumour of
noise in it. So wood's hollowness, stone's crack and metal's ring are not being
produced — three narrow tones are, and they carry no material information at all.

Metal is the clearest casualty. Every one of its four modes clamps at 220, which
means its actual ring-downs are:

| specified | actual at Q 220 | |
|---|---|---|
| 0.5 s | 0.146 s | 29% |
| 0.42 s | 0.055 s | 13% |
| 0.30 s | 0.030 s | 10% |
| 0.18 s | 0.017 s | 9.5% |

The comment calls metal *"the only one that sings"*. It does not sing. It cannot
— the clamp is what stops it.

### The diagnosis is falsifiable, and it matches the ear

Sort the table by how much it leans on the bank:

| | impact | modes | grit | uses the bank? |
|---|---|---|---|---|
| gravel | 0.45 | **none** | 0.75 | no |
| grass | 0.5 | **none** | 0.4 | no |
| leaves | 0.35 | **none** | 0.55 | no |
| earth | **1.0** | one, at the only sane Q | 0.22 | barely |
| mud | **1.0** | one | 0.3 | barely |
| stone | 0.9 | three | 0.12 | **entirely** |
| wood | 0.7 | three | 0.08 | **entirely** |
| metal | 0.9 | four | none | **entirely** |

Five of the eight barely touch the modal bank; they are impact plus PhISEM, both
of which are correct and neither of which is affected by any of this. Three
depend on it completely.

**The five that work are exactly the five that avoid it.** `earth` — the default
surface, and the "basic ground" that reads as fine — has the lowest Q in the
table and the highest impact level, so it is nearly all excitation and grit. That
is not a coincidence, it is the whole explanation.

## 10. What the correction costs, honestly

Both options have to move together, and the retune is not small.

**Switching `compensation` alone would be catastrophic.** `'inverse'` trims by
`1/√Q` and `'energy'` by `√Q`, so the ratio between them is **Q itself** — a
factor of 117 on stone's first mode, 220 on every metal mode. That is 41 to 47 dB.
This is exactly why the file froze it, and the freeze was the right call.

**`ring: 'excitation'` also needs a change in `strike()`.** In excitation mode
the decay lives in the envelope rather than in the filter, so the modes can no
longer be fed a flat 2 ms click. `excite()` has to be called per mode with a
duration derived from `mode.decay`. That is a handful of lines, but it is the
part that is easy to miss and it silently produces a bank with no ring at all.

### A mechanical starting point rather than a blank page

Retuning eight surfaces by ear from scratch is how this gets deferred forever.
It does not have to start from nothing. Switching both options changes each
mode's trim from `1/√Q_old` to `√Q_new`, and both are known, so:

```
level_new = level_old × (1 / √Q_old) / √Q_new
```

is a **loudness-neutral transform**. Apply it and the bank comes out at the same
level it is at now, with the timbre corrected — which is the change you actually
want to hear. Stone's first mode goes 0.6 → 0.024, which looks alarming and is
simply what the arithmetic says.

Then tune from there, by ear, with the numbers no longer fighting.

`audio/audition/render.ts` is what makes this tractable. Offline rendering with
exact pumping means before-and-after can be produced for all eight surfaces and
compared side by side, rather than tuned one at a time with a keyboard in hand.
Whatever else changes, this should not be attempted without it.

### It stays its own commit

Unchanged from what `footsteps.ts` and `modal.ts` already say. This is an
audible change to every hard surface in the game and it must be hearable before
and after in isolation — not folded into part one, and not smuggled under a
refactor.

## 11. Surfaces that do not exist yet

Eight surfaces: stone, wood, earth, gravel, grass, leaves, metal, mud. The gaps
are specific.

**`snow`.** Named in `footsteps.ts`'s own opening taxonomy as a canonical
aggregate, and absent. It is the most distinctive aggregate there is — a
compression squeak on top of the crunch, which no other surface has — and it is
the one an aggregate-capable engine most obviously ought to be able to make.

**`water`, meaning shallow.** `mud` is the wet slap and it is not a splash.
The game has water zones and a shoreline; walking into ankle-deep water is a
liquid event with a rising-pitch component that neither the impact nor the
PhISEM path produces. `dsp/bubble.ts` already exists.

**`cobble`, split from `stone`.** The `GROUND` table distinguishes cobble from
flagstone from rock, and they are genuinely different underfoot: a slab is one
contact, cobbles are several small ones with joints between them — much closer
to a sparse aggregate over a solid than to a flagstone.

**`moss`, or whatever `GROUNDCOVER.md` ends up painting.** That spec's `COVER`
table introduces moss, clover and weeds. Moss underfoot is nothing like turf —
it is nearly silent, damp, and has no grit at all.

Lower priority, and listed so they are not rediscovered: sand, thatch, carpet.

## 12. Where a surface should come from

`surfaceAt` is currently opt-in per zone — `zone.definition.surfaceAt?.(x, z) ??
zone.environment.surface` — so a zone that does not write one gets a single flat
material across its whole extent. Its own comment names the failure: *"a cobbled
path sounds like the grass beside it"*.

The `GROUND` table has ten materials, `SURFACES` has eight, and nothing connects
them. Every zone that wants variation hand-writes the mapping.

**`GROUNDCOVER.md` widens this gap rather than narrowing it.** It adds a `COVER`
table keyed off the same ground materials, so after it lands there are two
independent tables describing what is underfoot and a third, hand-written per
zone, describing what it sounds like.

The fix is a default derivation — one table from `GroundMaterial` to
`SurfaceName`, used when a zone does not override — so that painting a cobbled
lane changes what it sounds like by construction. Zones keep the override for
anywhere the sound should differ from the look.

This is small, and it should land **with** groundcover rather than after it. Two
tables keyed off the same thing is a fact; three is a maintenance problem.

## 13. Order, and why

Gestures, then the bank correction and retune together, then new surfaces
against a bank that works — writing `snow` or `water` against the current one
would mean writing them twice — then the derivation table with groundcover.
**§14** has this as phases.

Gestures first is the non-obvious half, so the reasoning is worth stating
plainly. Part one is currently flattening every material identically — heel and
toe are the same event twice at different levels, on every surface. Some of what
reads as thin materials is that flatness, and fixing the gestures tells you what
is genuinely left to fix underneath. Retuning first risks tuning the materials to
compensate for a gesture problem, and then having to undo it.

---

## 14. Phases

Twelve phases, each a commit. Ordered so that **every audible phase is preceded
by a silent one** — the plumbing it needs lands separately and is verified by
sounding identical, so when something does change, exactly one thing changed.

Two kinds of gate, and the distinction is what makes this pickup-able:

- **Closed by check** — the phase is arithmetic or refactoring. `npm run check`
  plus, where noted, a new headless assertion. Nothing needs a listener.
- **Closed by ear** — the phase changes what the game sounds like. It stops at
  a listening pass and cannot be signed off any other way. Do not start the next
  phase on an unheard one; that is how two changes get blamed on each other.

`npm run check` runs movement, audio, art, world and faust suites. `docs/` is
the built site and is rebuilt and committed alongside source.

| | Phase | Touches | Gate | Status |
|---|---|---|---|---|
| **F1** | Contact refactor | `footsteps.ts` | check | ✅ built, checked |
| **F2** | Forward toe-off | `footsteps.ts` | **ear** | built, **unheard** |
| **F3** | Direction and stance plumbing | `Controller.ts`, `main.ts`, `footsteps.ts` | check | |
| **F4** | Crouch | `footsteps.ts` | **ear** | |
| **F5** | Backward and lateral gaits | `footsteps.ts` | check + **ear** | |
| **F6** | Landings | `footsteps.ts`, `Controller.ts` | check + **ear** | |
| **F7** | Per-foot character, pivot scuff | `footsteps.ts`, `Controller.ts` | **ear** | |
| **M1** | Audition baseline | `tools/`, `audition/` | check | **skipped** — see below |
| **M2** | Bank correction | `footsteps.ts` | check + **ear** | built, **unheard** |
| **M3** | Material retune | `footsteps.ts` | **ear** | |
| **M4** | New surfaces | `footsteps.ts`, `ground.ts`, a debug zone | **ear** | built, **unheard** |
| **M5** | Surface derivation table | `ground.ts`, `ZoneManager.ts`, `Zone.ts` | check | |

### Deviations from the order above

**M4 was pulled forward, ahead of F3–F7.** It brought the Footsteps Showcase
with it — twelve strips of ground you can run down — and that room is the
listening harness every remaining ear gate needs. Building it last would have
meant signing off F2 through F7 by walking round the village.

**M1 was skipped.** Its purpose was to make M2's before-and-after exact, and M2
instead landed a `check:audio` assertion that its level transform is
loudness-neutral to a hundredth of a decibel across all twelve modes. That is a
stronger statement than comparing two renders by ear, and it is the only claim
M1's renders were there to support. If M3 turns out to want a baseline, it can
have one then, against a bank that works.

**The `stretch` clamp is 3.2, not the 3.0 in §2.** The push-off is authored at
3.2 and has been signed off by ear there, so 3.0 would have made F1 — a phase
whose whole gate is "nothing sounds different" — quietly change how a jump
sounds.

**Three surfaces had no ground before M4**, which §11 did not notice: `leaves`
and `metal` were in `SURFACES` with nothing in `GROUND` playing them, so neither
could be heard anywhere in the world. `check:world` now asserts the two tables
cover each other.

### F1 — Contact refactor · *check*

`Contact` and `Gait` from §2. Rewrite `strike()` to take a `Contact` instead of
the loose `shape` object, and move `step()`, `land()` and `jump()` onto it with
their current values. Add the per-contact impact filter, replacing the one
cached in `chainFor()`; resonators stay cached. Add the compose-and-clamp helper,
which at these values is a no-op.

**Done when** `npm run check` passes and nothing sounds different.

One honest caveat for whoever hears it: the cached impact filter carried its
state between contacts and a per-contact one does not. At `Q = 1` and a 1.7–9 kHz
cutoff that settles in well under a millisecond, so it is nil — but it is the
single place this phase is not bit-identical, and it is better to know that in
advance than to hunt for it.

### F2 — Forward toe-off · *ear*

One row of the §2 table: the toe-off becomes a push rather than a quieter copy
of the heel strike — `stretch 1.15`, `modes 0.7`, `grit 1.25`, `tone 0.9`.

**Done when** it is signed off against the current build. This changes every
step in the game, so nothing stacks on it until it has been heard.

### F3 — Direction and stance plumbing · *check*

Expose `stance` from `Controller`. Widen both callbacks to context objects:
`onFootstep` carrying speed, the latched local **input** direction and stance;
`onLand` carrying vertical impact, `glance`, the local **velocity** direction and
stance. `main.ts` passes them through. Nothing consumes the new fields yet.

The two callbacks reading direction from different sources is §4's rule, and the
parameter names should say so plainly enough that it survives a later tidy-up.

**New assertion** in `check:movement`: the local-frame rotation. Given a yaw and
a world velocity, `localForward`/`localRight` must agree with the basis
`applyWish` builds. Pure arithmetic, and the sign errors it catches are
otherwise diagnosed by walking backwards and hearing a sidestep.

**Done when** check passes and nothing sounds different.

### F4 — Crouch · *ear*

The crouch modifier from §2, scaled by `stance`. One scalar, no blend — which is
why it comes before the gaits despite being the bigger win: it exercises the
whole `Contact` path with one number to argue about.

**Done when** crouching reads as a sneak rather than as a volume drop, and stone
and gravel are still tellable apart underneath it.

### F5 — Backward and lateral gaits · *check + ear*

The four gait tables, the continuous blend, direction latching, the lead/trail
pan split, and the lead-foot latch on entering a strafe.

**New assertion** in `check:audio`: sweep direction through 360° and assert every
blended contact parameter is continuous — no jump between adjacent angles beyond
a small epsilon. This is the §3 diagonal risk, it is the thing most likely to be
got wrong, and it is provable rather than audition-able.

**Done when** check passes and a circle-strafe around a prop sounds continuous.

### F6 — Landings · *check + ear*

`glance`, the direction blend weighted by it, the foot handoff above 0.45, and
the `strideProgress = 0` reset in `Controller`.

**New assertions** in `check:audio`: the five worked `glance` examples from §4's
table; and a sweep of the full cross product — 8 surfaces × 4 gaits × `glance`
0..1 × `stance` 0..1 — asserting composed contacts land inside the §2 clamp
ranges, *and reporting how often the clamp fires*. §2 says a frequently-firing
clamp means two multipliers describe the same thing twice; that only becomes
information if it is counted.

**Done when** check passes, and a sprinting landing, a flat drop and a sideways
landing are three distinguishable events.

### F7 — Per-foot character, pivot scuff · *ear*

Persistent per-foot offsets in timing and brightness (§5a — **not** in level,
see the note there), then the pivot scuff (§5b), which reuses the lateral trail
contact and is a trigger condition rather than a new sound.

Slope awareness (§5c) and the terminal step (§5d) are optional tails here. Both
are cheap; both are easy to overdo. Keep only what survives hearing.

### M1 — Audition baseline · *check*

Render all eight surfaces through `audition/render.ts` — step, land and jump
each — and keep the results as the "before".

Worth doing properly because `render.ts` is deterministic by design: its own
notes say a texture rendered twice is identical where a frame-driven one never
is. That makes the M2 comparison exact rather than impressionistic.

**Done when** eight before-renders exist and reproduce byte-for-byte on a second
run.

### M2 — Bank correction · *check + ear*

`ring: 'excitation'`, `compensation: 'energy'`, the per-mode excitation duration
derived from `mode.decay` in `strike()`, and the loudness-neutral level
transform from §10.

**New assertion** in `check:audio`: the transform is loudness-neutral —
`level_old × trim_old ≈ level_new × trim_new` for every mode in the table. This
is arithmetic, it catches a single mistyped constant instantly, and without it
the phase's central claim is unverifiable.

**Done when** check passes, the renders match M1 in level and differ in timbre,
and that difference is signed off. Metal is the one to listen to first — §9 says
it currently rings at 10–29% of its specified decay, so it should change more
than anything else in the table.

### M3 — Material retune · *ear*

Eight surfaces, by ear, against a bank that now works. No arithmetic gate exists
for this and none should be invented.

**Done when** each surface is signed off individually. This is the phase that
cannot be hurried and cannot be closed without a listener; splitting it per
surface is fine and probably wise.

### M4 — New surfaces · *ear*

`snow`, shallow `water`, `cobble` split from `stone`, and `moss` (§11).

**Each new surface needs somewhere to walk on it** — a `GROUND` material and a
patch in a debug zone — landing in the same commit. A surface with no ground
that uses it cannot be heard, and an unhearable sound is an unfinished one.

**Done when** each can be walked onto from a neighbouring surface and is
identifiable by ear at the boundary.

### M5 — Surface derivation table · *check*

The default `GroundMaterial → SurfaceName` mapping from §12, used wherever a
zone does not override `surfaceAt`. Lands **with** `GROUNDCOVER.md`, not after
it.

**Gate is the compiler**: declare it as an exhaustive `Record` over the ground
material names, so adding a ground material without deciding what it sounds like
fails the build. That is better than a runtime assertion and it is free.

**Done when** painting a cobbled lane changes what it sounds like with no
per-zone code, and every existing zone's hand-written `surfaceAt` either still
overrides deliberately or has been deleted as redundant.

### Standing rules for whoever picks this up

- **Do not touch the numbers in `SURFACES` during F1–F7.** Part one is
  multipliers on the materials; changing both at once makes neither judgeable.
- **Do not fold M2 into anything.** Both `footsteps.ts` and `modal.ts` already
  say this in their own comments, for the same reason.
- **An ear-gated phase is not closed by "it builds".** If no listener is
  available, stop and say the phase is built but unheard. That is a real state
  and it is fine to be in; claiming it passed is not.
