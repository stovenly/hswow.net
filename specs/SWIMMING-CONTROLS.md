# Swimming — controls, state, and sound

Not built. Researched and specified.

There is already water in the world: `art/water.ts` builds it, `engine/Water.ts`
draws it, `engine/Underwater.ts` is the volume on the near side of the surface.
What does not exist is any way for something that is not a render pass to find
out where it is. That gap is most of the work, and §1 is about it.

The rest is a movement mode and a sound. Both are smaller than they look,
because the controller and the footstep model already have the shapes they need
— the swim gait is `advanceBob`'s distance-driven cadence with a different
stride, and a stroke is `water.ts`'s two layers with an envelope on them.

**The brief, restated as constraints:** zippy, not constraining. Full three-axis
motion. Sprint speeds it up, jump rises, crouch sinks, both in world axes. `W`
follows the camera; `A`/`D` strafe as they do on land; `S` is `W` reversed. The
pitch clamp stays. Footsteps stop and strokes take over, quietly. At the surface,
jump gets you out onto a ledge.

---

## 1. Nothing outside the render pass knows where the water is

`WaterEffect.submersion(scene, camera)` is the only water query in the codebase.
It cannot be the one the controller uses, for three separate reasons:

- **It lives in `engine/`, behind `PostFX`.** A dependency from `player/` on the
  render pipeline is backwards, and it would make the movement code untestable
  headlessly — every check in `tools/` would need a WebGL context to ask whether
  the player is in a pond.
- **It answers for the camera.** Swimming is decided by the *body*: the feet,
  which is where the capsule is. The camera is 1.35 m above them, moves with the
  head bob, and dips on landing.
- **It runs once a frame, after the world has moved.** `Controller.step` runs up
  to sixteen times a frame, before anything is drawn.

### The list already exists; it is built in the wrong place

`Zone.root()` already walks the whole group once at build time, looking for
`userData.water`, to answer `hasWater`. `WaterEffect.submersion` then does
**a second traverse of the same scene, looking for the same flag**, to build the
same list of boxes.

So this is a consolidation rather than an addition. The zone's existing walk
collects what it is already looking at:

```ts
/** One body of water: the box it covers, and the mean height of its surface. */
interface WaterSurface {
  box: THREE.Box3;
  level: number;
}
```

and `ZoneManager` gains a query with exactly the shape of the one next to it:

```ts
/** Mean surface height of the deepest water over a position, or null. */
waterAt(x: number, z: number): number | null
```

`surfaceAt(x, z)` — "what does the ground sound like here" — is four lines away
in the same file and is the precedent to copy, down to returning a default when
there is no active zone.

`WaterEffect.submersion` then reads that list instead of building its own, which
deletes its scene traverse and its `scanned` flag.

**The reason to insist on one list rather than two is not tidiness.** Two
independent scans can disagree, and the failure is silent in both directions: a
pond the physics knows about and the shader does not is invisible water you swim
in, and the reverse is a blue rectangle you walk across. One list makes those
unrepresentable.

### One thing to check when this is built

`Box3.setFromObject` reads world matrices. `Zone.root()` builds the group and
returns it; `ZoneManager.enter` is what adds it to the scene. Take the boxes
after an explicit `updateMatrixWorld(true)` on the group, or a zone whose root
carries any transform gets boxes in the wrong place — and the symptom is water
that works in every zone except one.

### The mean plane, not the wave height — for the physics too

`submersion` deliberately uses the surface's mean height and says why: waves move
the real surface a few centimetres either way, and keying a full-screen effect to
that makes it flicker as crests go past.

**The same argument is stronger for swimming.** `AMP_LONG + AMP_SHORT` is 8.5 cm
of vertical movement at 1.05 and 1.63 rad/s. A buoyancy threshold riding on that
would flip a player standing chest-deep between walking and swimming roughly once
a second, and the flip changes what every key does.

So the swim test reads the same number the picture reads. That is not a
compromise — it is the property that makes the moment your view goes green the
moment your controls change.

---

## 2. Control modes, of which swimming is the first

Swimming is not a special case bolted onto walking. It is the **second** of what
will be several ways of moving a body around — a vehicle, flight, a ladder,
whatever else — and the seam wants cutting once, here, while there are exactly
two modes to cut it against.

Two is the number that matters. One mode behind an interface proves nothing; the
interface is whatever the single implementation happens to need. Two is the
minimum that tests whether the seam is in the right place, and it is cheap now in
a way it will not be after the walk has grown a third set of exceptions.

**The honest caveat first:** this interface will be wrong in ways only the third
mode reveals. §2's job is to be wrong in *recoverable* ways — to put the seam
where a vehicle can be added by writing a vehicle, rather than by editing
swimming and walking to accommodate it.

### What is not a mode

Worth fixing before the interface, because the temptation is to make everything
one:

- **Wading is not a mode.** It is Ground with a speed penalty and a different
  footstep sound. If wading needed to be a mode, the seam would be in the wrong
  place — it would mean modes were being used for *states*, and there is no end
  to those.
- **Airborne is not a mode.** Jumping is Ground's business; Ground already models
  contact and its absence, and splitting them would put the coyote window and the
  jump buffer on a boundary they span.
- **Crouching is not a mode.** It is a stance, and it is exactly the thing §4 has
  to stop being confused with descending.

The test: *does it change what the keys mean, or only what the numbers are?*
Numbers are parameters. Meanings are modes.

### What varies, and what does not

| | Owner |
|---|---|
| The capsule, `resolve()`, the collider | **shared** — collision is collision |
| The sub-step loop and accumulator | **shared** |
| `applyLook` and the pitch clamp | **shared** |
| Writing the camera transform | **shared** |
| Input → meaning | **per mode** |
| Integration: forces, drag, gravity | **per mode** |
| Whether this mode should be running | **per mode** |
| Camera decoration — bob, eye height, dip | **per mode** |
| Which body sound is live | **per mode** |

The top four are the reason this is a seam and not a rewrite. **Every mode
collides the same way**, so no mode gets to invent collision, and the hardest,
most load-bearing code in `Controller` is untouched by all of this.

### The interface

Five members, and each earns its place by being something Ground and Swim
genuinely disagree about:

```ts
interface ControlMode {
  /** Whether this mode should hold the player right now. */
  claims(ctx: ModeContext): boolean;
  /** Input to velocity, for one sub-step. Collision is not its business. */
  integrate(ctx: ModeContext, dt: number): void;
  /** Bob, eye height, dip — layered over the shared transform write. */
  decorateCamera(ctx: ModeContext, dt: number): void;
  enter(ctx: ModeContext): void;
  exit(ctx: ModeContext): void;
}
```

`enter` and `exit` are not ceremony. Everything already identified as transition
work lands in them exactly: Swim's `enter` applies the entry damping and drives
`stance` to zero, and its `exit` nulls `lastFeetY` so the step-lag machinery is
not handed a stale height. **That those two fell into the lifecycle hooks without
being designed for is the strongest evidence the seam is roughly right.**

### Who decides, and why it is not the modes

Each mode says whether it *claims* the player; something else picks. The
alternative — each mode naming its successor — is brittle in a specific way:
`Swim` would have to know `Vehicle` exists in order to hand off to it, so adding
a mode would mean editing every mode that could precede it.

So: an **ordered list, first claim wins, Ground last as the fallback.**

```
[ Vehicle, Swim, Ground ]
```

Adding a mode is adding one entry. The order is the design, and it is where the
interesting decisions live — a boat on water means `Vehicle` must outrank `Swim`,
and writing that down as a list position is better than discovering it as a bug.

**Hysteresis belongs to the claim test**, not to the arbiter. `Swim.claims` is
simply easier to satisfy while Swim is already active — 0.85 m to keep the player
versus 1.15 m to take them. That keeps §3's band local to the mode that cares
about it and means the arbiter has no notion of stickiness at all.

### Sound stays as it is, for now

Modes own which body sound is live, but `Controller` keeps its named callbacks —
`onFootstep`, `onLand`, `onJump`, plus `onStroke` and `onSplash`.

Collapsing them into one `onBodyEvent(kind, payload)` union is the obvious
generalisation and it is **deliberately not done**. Two modes produce five
callbacks, which `main.ts` wires in a readable block; the union costs a
discriminated type and an indirection to save nothing yet. If a third mode adds
three more, that is the moment — and it is a cheap change then, because the call
sites are all in one file.

### The risk, stated plainly

**Extracting Ground is the highest-risk phase in this document.** It is a pure
refactor of the code every other system in the game is tuned against, and its
failure mode is a walk that is subtly different in a way nobody can point at.

It gets its own commit, before any swimming exists, and it is gated on the walk
being *identical* rather than *fine*. If `check:movement` does not already replay
a recorded input trace and compare positions, that phase is where one gets
written — because "it still feels right" is not a claim anybody can make honestly
about a 1 % change in ground acceleration.

---

## 3. Three states, and the middle one is where the difficulty is

Not a boolean.

| | Contact | Forces | What the keys do |
|---|---|---|---|
| **Dry** | grounded or airborne | today's | today's |
| **Wading** | feet on the bed | today's | today's, slower |
| **Swimming** | none that matters | buoyant, dragged | §4 |

Wading is not a third movement mode. It is the dry controller with a speed
penalty and a different sound, and keeping it that way is what stops this feature
touching the walk.

### The boundary, and why it needs hysteresis

Submersion is `level − feetY`, measured at the capsule's feet. Standing on the
bank it is negative; wading it is small and positive.

A single threshold flaps, and it flaps here worse than most places, because the
bed is not smooth — `WaterShowcase2.bedAt` has a `meander` term and a sandbar in
it, and any real beach will. So two thresholds:

```
enter swimming when depth > 1.15 m     (mid-chest on a 1.8 m body)
leave swimming when depth < 0.85 m     (waist)
```

This is the same shape as the sprint FOV gate in `applyCamera`, which has
hysteresis for exactly this reason and says so.

### Worked against the beach that exists

`WaterShowcase2` shelves as `−7 · out^0.8` where `out` is the fraction of 95 m
offshore. Solving for the two thresholds:

| Depth | `out` | Distance from the waterline |
|---|---|---|
| 0.85 m — stand up | 0.072 | **6.8 m** |
| 1.15 m — start swimming | 0.105 | **9.9 m** |

**Three metres of beach between the two.** Wide enough that the meander (±0.4 m
of shoreline wander) cannot walk you back and forth across it, narrow enough that
the transition happens where you expect. That is the number the thresholds should
be judged against, and it is the reason to pick them in metres of body rather
than as fractions of anything.

The **sandbar is the interesting case.** At `BAR_Z = −27` the profile is −2.85 m
with 1.35 m of bar on top, so there is 1.50 m of water over it — just past the
swim threshold. You swim over the bar rather than standing on it, which is honest
for chest-deep water, and it makes the bar the most sensitive place in the game
to these two numbers. If they ever move, that is where it shows first.

### Derived, never latched

Everything above is recomputed each frame from `waterAt` and the capsule. The
only state carried between frames is which side of the hysteresis band you were
on last.

That is worth being deliberate about, because it makes a whole class of bugs
impossible for free: swimming through a portal into a dry room, respawning while
submerged, a zone unloading under you. `teleport` already zeroes velocity and
resets stance; it needs to do nothing about swimming, because there is nothing to
reset.

---

## 4. The force model

### Neutral buoyancy, and this is the decision that delivers "zippy"

**No gravity while swimming.** Not reduced gravity fought by a buoyant force —
that is the constraining version, where letting go of the keys means sinking and
every vertical move is a negotiation.

Let go and you hold your depth. Everything else in this section is detail; this
is the feature.

### Drag replaces friction

`applyFriction` runs only when grounded and acts on the whole velocity vector,
which is already the right shape — on a slope, some of your walking speed is
vertical and has to decay with the rest. Swimming wants the same function with a
different constant and no ground test.

Linear, matching the existing code, rather than the quadratic a fluid actually
applies. Predictable beats correct here: a quadratic drag makes the top of the
speed range feel soft and the bottom feel frictionless, which is the opposite of
what a control scheme wants.

### Speed — faster than a person, on purpose

| | Base | Sprinting |
|---|---|---|
| Walking (today) | 4.2 | 7.35 |
| **Swimming** | **3.6** | **6.84** |

A good swimmer does about 2 m/s. This is three times that at a sprint, and the
game is better for it. Water that halves your speed makes every body of water a
wall with a long animation attached; water you cross at very nearly walking pace
makes it a route.

`swimSprintScale` is its own number (1.9) rather than reusing `sprintScale`
(1.75), because the two are answering different questions. On land the sprint
scale is tuned against the FOV boost and the gait cadence. In water it is the
whole difference between cruising and getting somewhere, over a lower base.

### The wish direction

Three contributions, summed and normalised:

```
wish = look · moveZ  +  right · moveX  +  worldUp · lift
lift = (jump held ? 1 : 0) − (crouch held ? 1 : 0)
```

**`look` is the camera axis, with pitch.** The camera uses `YXZ` order and
`rotation.set(pitch, yaw, roll)`, so its forward is:

```
look = ( −sin(yaw)·cos(pitch),  sin(pitch),  −cos(yaw)·cos(pitch) )
```

At `pitch = 0` that is `(−sin yaw, 0, −cos yaw)`, which is exactly today's
`_forward`. **That identity is a headless assertion**, and it is worth having:
a sign error in this vector is the difference between `W` swimming you forward
and `W` swimming you into the bed, and it would be diagnosed by feel otherwise.

**`right` needs no code at all.** Camera right under `YXZ` with zero roll is
`R·(1,0,0)` = `(cos yaw, 0, −sin yaw)` — pitch does not enter it. So "strafe as
before" and "strafe along the camera's right axis" are the *same vector*, and
requirement 6 is already satisfied by `_right` unchanged. A strafe that tilted
with pitch would roll the world sideways, which nobody wants.

**Backwards moves you vertically, and that is correct.** `S` is `−look`, so
looking down and pressing `S` carries you up. That falls out of the brief rather
than being added to it, and it is the behaviour every game with free swimming
has.

### Ascend and descend are world axes

Requirement 2 and 3 name crouch as down and jump as up (the parentheticals in the
brief read as transposed; the verbs are unambiguous and conventional, so the
verbs win).

World-vertical rather than camera-vertical, deliberately. It is what lets you
hold a depth while looking around, and it composes cleanly with a pitched `W`
instead of fighting it.

**Neither needs an input change.** `Input.jumping` is a live held read that
already exists for the bunny-hop option, and `Input.crouching` is a live held
read with the hold/toggle preference already applied. `Input` keeps saying what
the *key* is doing; what that means is the controller's business — see below.

### Swim's mapping

§2 owns the machinery; this is what Swim does with it. The same two keys mean
different things in and out of water, and because the mapping is **switched
once** rather than gated per consumer, there is no site left that has to remember
which is which:

| Key | Dry and wading | Swimming |
|---|---|---|
| Crouch, held | stance — capsule and camera shrink | descend |
| Jump, held | auto-hop, if enabled | ascend |
| Jump, pressed | jump | surface exit — §5 |

Read one way this is the same behaviour as gating each consumer, and it is not,
in one respect that matters: **a gate has to be remembered at every site, and a
mapping cannot be forgotten at any.** Crouch has three consumers today — the
stance ease in `applyCamera`, `applyStance`'s capsule resize, and `crouchDrag`'s
speed penalty in `applyWish` — and the failure mode of gating is that two of them
learn about swimming and the third does not. Multiply that by a fourth and fifth
mode and the gates are the whole problem.

Concretely, in swim mode `stance` is driven to **zero** rather than left alone.
That distinction is the whole thing:

- Entering the water already crouched has to stand you up. Left alone, `stance`
  stays latched at 1 and you swim the whole way across the lake in a crouched
  capsule with the camera 0.65 m low.
- `crouchDrag` reads `stance`, so forcing it to zero also removes the speed
  penalty from descending — which is right. Sinking is not a slow way to move.
- `headroom()` short-circuits on `stance < 0.01`, so it stops running by itself.
  No gate needed there at all.

Two properties fall out for free, and both are worth having:

- **Leaving the water while still holding crouch re-crouches you**, once there is
  headroom, because `stance` is eased toward whatever the mapping currently says
  rather than latched at a transition.
- **The ease survives.** `crouchSpeed` is 22, so standing up on entry takes about
  45 ms rather than snapping. The capsule is briefly short while swimming, which
  is harmless — it is a smaller collision volume with no ground code reading it.

### The pitch clamp costs nothing

`applyLook` clamps to ±(π/2 − 0.001) so the yaw axis cannot go degenerate.
Requirement 4 is therefore already met, and it does not restrict movement: at the
clamp the horizontal component of `look` is 0.001 of its length, so `W` at full
pitch is vertical to within a tenth of a percent.

The clamp is a camera constraint, not a movement one. **The reason ascend and
descend exist anyway** is that they are the only way to change depth *without*
pointing the camera at the floor.

### While swimming, `grounded` is observed but not obeyed

Collision does not change. `resolve()` still runs, you still cannot swim through
rock, and `grounded` is still set when the capsule is against the bed — it is
just no longer permitted to drive anything except the wade test.

Eight call sites read it today. Each needs a decision, and the table is the
review surface for this phase:

| Site | While swimming |
|---|---|
| `step` — gravity | **skip** |
| `step` — `applyFriction` | **skip**; swim drag instead |
| `applyWish` — slope projection | **skip**; the wish is already 3D |
| `applyWish` — `groundAccel`/`airAccel` | **neither**; `swimAccel` |
| `applyJump` — coyote window | **skip**; §5 owns jump in water |
| `capAirSpeed` | **skip** |
| `move` — `snapToGround` | **skip** |
| `move` — `tryStepUp` | **skip** |
| `advanceBob` | strokes, not steps — §7 |
| `applyCamera` — crouch/`headroom` | the mode switch above, not a gate |

**`capAirSpeed` is the one worth a note, and it is deliberately left alone.** It
caps horizontal speed at `4.2 × 1.75 × 1.12 = 8.23` m/s, above the 6.84 sprint
swim — so it changes nothing today and would silently cap swimming the first time
anybody raises the speed. It is a one-line change if that ever happens, and it is
recorded here so that when swimming mysteriously stops getting faster, this is
the first place to look rather than the last.

### `speed` is horizontal, and three things read it

```ts
get speed(): number {
  return Math.hypot(this.velocity.x, this.velocity.z);
}
```

Swimming straight down at full pelt reports **zero**. That silently breaks the
sprint FOV gate, the bob intensity, and — worst — the stroke cadence in §7, whose
symptom would be "the strokes stop when I dive."

A `speed3` alongside it, used by every swim path. Cheap, and it has to land in
the same phase as the force model rather than being discovered by the audio work.

### Entering the water

A dive should carry. Water drag alone kills a fall in about a second, which is
roughly right, but a long drop drives you to the bed first. So one damping
multiplier applied on the dry → swimming transition, around 0.6, and nothing
else: the plunge is a feature and only its extreme needs bounding.

**`onLand` must not fire.** Today any touchdown with `impact > 1` adds `landDip`
to the camera and calls `footsteps.land(impact)`. Falling into the sea currently
makes a stone footstep. §8 replaces it with a splash, and §8 is deliberately a
separate commit from the suppression — see the phases.

---

## 5. The surface is a place, not a coordinate

With neutral buoyancy and nothing else, holding ascend at the waterline flies you
out of the water at swim speed, gravity grabs you, and you fall back in. Repeat.
That oscillation is the thing to design away.

### The float line

Swimming holds you at **1.15 m of submersion** when there is nothing pushing you
deeper — feet 1.15 m under, eye 0.20 m above the surface. Within the top 0.4 m a
gentle upward push takes you there; below that there is no buoyancy at all.

Three numbers agree here and it is worth seeing why:

- 1.15 m is the swim *entry* threshold, so idling at the surface parks you exactly
  at the boundary you crossed to get there.
- The wade threshold is 0.85 m, so the hysteresis band is what keeps you floating
  rather than snapping back to wading. The band is doing its job rather than
  being a fudge.
- The eye sits 0.20 m clear of the line against 0.02 m of head bob, so floating
  never dunks the camera and `UnderwaterEffect`'s 0.35 m ramp never strobes.

**Buoyancy exists only where it does a job**, and the job is making the surface
findable. Anywhere below it, letting go holds your depth.

### You cannot swim out into the air

The upward component is clamped at the float line. This is not a restriction any
player will notice as one — it is what removes the pop-out oscillation — and it
is what makes the exit jump below a distinct, deliberate action instead of a
thing that happens by accident.

### The exit jump

From the surface band, a jump *press* — `takeJump`, the buffered edge trigger,
not the held read — leaves the water properly:

```
velocity.y = jumpSpeed × swimExitScale     (7.2 × 0.8 = 5.76 m/s)
```

| | Launch | Apex |
|---|---|---|
| Standing jump | 7.2 m/s | 1.00 m |
| **Out of water** | **5.76 m/s** | **0.64 m** |

Less than a standing jump, because there is nothing to push off. Still enough for
any bank, and `stepHeight` of 0.45 m catches the lip on the way down —
`tryStepUp` is deliberately not gated on being grounded, and its own comment says
catching a lip on the descent is the same manoeuvre.

Which means **the exit is "swim at the bank and press jump"**, because
`tryStepUp` requires a non-zero wish direction. That is what players do anyway.

**The non-obvious part is the lockout.** Without one, the rise re-enters the swim
state within a frame or two, the float clamp eats the jump, and the player bobs.
A short window during which swimming cannot be re-entered fixes it, and the
codebase already has this pattern twice — `HOP_CONTINUATION`, and the
`timeOffGround = coyoteTime` line that spends the coyote window so it cannot be
used twice for one jump.

---

## 6. Where this goes wrong

### The water plane is deliberately bigger than its basin

`art/water.ts` says so outright: the plane is sized a little larger than the
basin, and "the honest place for its hard geometric edge is buried in the bank."

So `waterAt(x, z)` returns a level at points where the **ground is above it**.
Standing on the bank next to a pond, the box test passes.

This is the single most likely shipping bug in the feature, and the design
already handles it — because submersion is `level − feetY` and not "am I inside
the box." On the bank, feet are above the buried plane and the depth is negative.

It is worth stating explicitly anyway, because the tempting simplification
("swimming = inside a water volume") is wrong in a way that only shows up next to
one particular pond.

### Overlapping surfaces

`submersion` takes the deepest of all matching surfaces. Keeping that is right;
the failure it implies should be written down. A pond at y = 0 with an aqueduct
crossing at y = 6 reports six metres of submersion to somebody standing beside
the pond, because the only guard is an axis-aligned XZ box.

No zone does this today. The fix, if it ever bites, is to ignore a surface whose
level is far above you with no water column reaching down — and it should be
built when something needs it, not now.

### Sampling rate

`waterAt` is a loop over a handful of cached boxes, so it is cheap. It should
still be sampled **once per frame in `update`, not per sub-step in `step`** — the
level cannot change between sub-steps, so sixteen identical lookups is waste, and
a water level that *did* change mid-frame would be a very confusing bug to have
made possible.

The depth is then computed per sub-step from the current feet, which does change.
Same shape as the wind field: sample once, read many.

### The frozen stride, which is already a bug

`advanceBob` returns early when not grounded, so `strideProgress` freezes mid-air
and landing at 0.97 fires a footstep centimetres later, on top of the landing
sound. `FOOTSTEPS.md` records this.

Swimming makes it worse — the stride now freezes for however long you were in the
water — and both specs want the same fix. **Whoever gets there first should fix
it once**, and the other should not fix it again differently.

### Falling out of the world

`zone.floor` respawns you below a threshold. Water Showcase 2's is −30 against a
bed bottoming at −7, so swimming cannot reach it. An interior with a pool whose
floor sits just under the room's would respawn a diving player. One line of
awareness, not a mechanism.

---

## 7. The sound

Three claims from the brief: no footsteps underwater, strokes as the player pulls
through the water, and not distractingly loud. The third is the hardest and it is
mostly won by envelope shape rather than by level.

### A stroke is not an impact

Everything in `footsteps.ts` is an impact model — `excite` caps its attack at
1.2 ms, because it is feeding resonators and anything slower stops being an
impulse.

A limb moving through water is the opposite event: **broadband flow noise that
swells and fades**, over a few hundred milliseconds, with no transient at all.
Roughly a 60–120 ms rise and a 200–400 ms fall.

That shape is why strokes will not be distracting. A slow-attack sound does not
grab attention the way a transient does, whatever its level — the level is the
second-order control here, not the first.

On top of it, a small population of bubbles from `dsp/bubble.ts`. Few, and larger
than a brook's, so it reads as water rather than as fizz.

**Which makes a stroke `water.ts`'s two layers with an envelope on them** — a
turbulence bed and a bubble population — fired as an event rather than run as a
bed. That model's header already argues the split; nothing new needs inventing.

### Surface and submerged strokes are different sounds

As different as forward and backward footsteps, and for a comparable physical
reason:

- **At the surface** the arm breaks the line. Air is entrained violently: many
  bubbles, bright, plus the slap of the hand going in. This is the splashy,
  audible one.
- **Fully under** there is no air to entrain. Almost no bubbles, just the low
  broadband rush of water moving past. Much quieter, much darker.

One parameter crossfades them, and it is the submersion the controller already
has. Blend rather than branch — the same conclusion `FOOTSTEPS.md` reached about
gait, for the same reason: a threshold here would flip the character of the sound
as a wave went over your head.

### Cadence is `advanceBob`'s problem, already solved

Strokes fire **by distance covered, not by time**, which is `advanceBob`'s whole
argument and transfers without modification: creeping forward strokes rarely, a
sprint strokes more often but sub-linearly, and tapping a key strokes not at all.

So `advanceBob` gains a swimming branch with its own stride length, and the
existing left/right toggle — `takeFoot()`, which every gesture that loads one
side goes through — alternates arms so strokes pan. Free character out of
machinery that exists.

It reads `speed3`, not `speed`. See §4.

### The muffle is the biggest cue in the feature

Bigger than the strokes. Under water the ear loses the top end badly, and
directional hearing largely collapses — interaural time differences shrink by the
ratio of sound speeds, about 4.4×.

One lowpass, on the master bus, ramped by submersion. Insert it between `duck`
and `master`:

```
dry → duck → [muffle] → master → limiter → destination
```

Two things fall out of that position. The reverb returns join at `duck`, so the
room's tail is muffled too — correct, since you are hearing the room through
water. And the debug analyser taps `master`, so the spectrum readout shows what
you actually hear rather than what was sent.

**Ramped on the same number the picture uses.** `UnderwaterEffect.setDepth` ramps
over the first 35 cm so a head bobbing at the waterline cannot strobe; the filter
takes the identical value, so the sound and the image cross the line together.
Two ramps with two constants would drift the first time either was tuned.

### Entry, exit, and the head crossing

**Entry is not optional.** Suppressing `onLand` leaves a silent hole where a
plainly audible event just happened, so the splash is part of closing that hole
rather than an extra. Scaled by impact speed exactly as `land(impact)` is — wade
in slowly and it is almost nothing, dive from a height and it is the loudest
thing in the zone.

**The head crossing the line** is a separate, smaller event from the body
entering, and it is the one that sells the transition: the sudden bass-heavy
gloop as your ears go under. It fires on the submersion crossing, in both
directions.

**Exit** — streaming and dripping as you climb out — is a short burst of large
bubbles under a wet hiss tailing off over a second or so. The least important of
the three and the first to cut if it does not earn its place.

### Wading keeps its footsteps, wet

"No footsteps underwater" is right and wading is not underwater — the feet are
still on the bed, and there is a real footfall to hear.

Compose rather than switch: the footstep fires with its level attenuated by
depth, and a splash fires with its level raised by depth. Past about knee depth
the footstep is gone and it is all splash, which is also what actually happens —
a foot landing under half a metre of water is a smeared impact, not a sharp one.

No new surface table. `SURFACES` already has `mud`, the wet slap, and the whole
argument in `strike()`'s doc comment is that gestures should not each get their
own copy of every material.

### Level

`Footsteps` is built at gain 0.55. Strokes at **0.30**, and the number's job is
to sit *under* the muffled ambience rather than over it. If it needs to be heard
over anything, the muffle is set wrong.

### Where the model lives

`audio/models/swim.ts`, built and wired in `main.ts` immediately beside
`Footsteps`, with the same lifetime and for the reason already written there:
these belong to *you*, not to a zone; they follow you through every door and
would be wrong to tear down on a threshold. Two player-owned models rather than
one, which is a precedent that already exists rather than a new category.

---

## 8. Camera

- **Head bob is wrong while swimming.** It is a footfall bounce driven by
  `bobPhase`. Swimming wants a slow roll on the stroke cycle — same machinery,
  much lower amplitude, half the rate. Or nothing; that is an ear-and-eye call
  rather than an arithmetic one.
- **Sprint FOV stays.** It is the cheapest "zippy" cue available and it already
  works. It needs `speed3` to fire while diving.
- **`landDip` must not fire** on water entry, with `onLand`.
- **`lastFeetY` goes stale.** The step-lag machinery treats any upward move of
  the feet under `1.2 × stepHeight` while grounded as a stair and lags the camera
  behind it. Coming out of swimming onto a sloped bed can hand it a large jump.
  `teleport` already nulls it for this exact reason; the swim exit should too, or
  the camera drifts for a fraction of a second on every exit and nothing looks
  wrong in the swimming code.

---

## 9. Deliberately not in the first version

- **Any resource.** No breath, no stamina, no timer. Stated in the brief and
  worth restating, because the surface design in §5 is the shape it is
  *because* nothing is counting down — the float line exists to make the surface
  findable, not to make it necessary.
- **Currents.** `aFlow` already exists per vertex and pushing the player along it
  would be a natural read. It is also a second thing acting on velocity that the
  player did not ask for, and it belongs after the base controller feels right.
- **Underwater visibility as a gameplay quantity.** `uMurkDensity` is a look, not
  a rule.
- **Swimming animations or a visible body.** There is no player model.
- **Diving from a height as a distinct move.** The entry damping in §4 is a
  bound on the plunge, not a mechanic.
- **A second capsule shape for swimming.** Horizontal collision while prone would
  be more honest and would need its own headroom test, its own stand-up rule and
  its own interaction with `crouchHeight`. The upright capsule swims fine.

---

## 10. Needs an eye, or an ear

Things arithmetic cannot settle:

- **Whether 3.6 / 6.84 is zippy or silly.** The claim in §4 is that swimming at
  nearly walking pace turns water from a wall into a route. Only swimming it
  says whether it reads as agile or as gliding.
- **Whether 0.4 m of buoyant band is enough** to make the surface findable
  without making it feel like a lid.
- **Whether the exit jump clears the banks that actually exist**, as opposed to
  the 0.64 m the arithmetic promises. Water Showcase 1's basins are the test —
  they are room-sized and walled, which is the hard case.
- **Whether the muffle is too much.** The temptation is to over-filter, because
  the effect is so satisfying the first time; the version that survives an hour
  of play is usually gentler.
- **Whether strokes want to be quieter still**, or whether 0.30 already
  disappears under the muffle.
- **Whether the swim bob should exist at all.**

---

## 11. Phases

Thirteen, each a commit. Ordered so that **every phase that changes what the game
does is preceded by one that does not** — the plumbing lands separately and is
verified by changing nothing, so when something does change, exactly one thing
changed.

The first three are the mode seam and are not about swimming at all. They are
here rather than in their own document because two modes is what makes the seam
real, and swimming is the second mode; extracting the seam first and finding its
second user later is how interfaces come out shaped like their only user.

Three kinds of gate:

- **Closed by check** — arithmetic or plumbing. `npm run check` plus, where
  noted, a new headless assertion. Nothing needs a person.
- **Closed by feel** — it changes how the controller handles. It stops at a play
  session and cannot be signed off any other way.
- **Closed by ear** — it changes what the game sounds like. Same rule.

| | Phase | Touches | Gate |
|---|---|---|---|
| **M1** | A trace to refactor against | `tools/`, `check:movement` | check |
| **M2** | The mode seam, Ground only | `player/modes/`, `Controller.ts` | check + **feel** |
| **W1** | Water as a world query | `Zone.ts`, `ZoneManager.ts`, `Water.ts` | check |
| **W2** | The swim basis | `Controller.ts` | check |
| **W3** | Swim mode, claiming but inert | `player/modes/Swim.ts`, `main.ts` | check + eye |
| **W4** | The force model | `player/modes/Swim.ts` | **feel** |
| **W5** | The surface and the exit jump | `player/modes/Swim.ts` | **feel** |
| **W6** | Camera | `player/modes/Swim.ts` | eye |
| **W7** | Silence, honestly | `Controller.ts`, `main.ts` | check + **ear** |
| **W8** | Entry, exit, head crossing | `swim.ts`, `main.ts` | **ear** |
| **W9** | Strokes | `swim.ts`, `player/modes/Swim.ts` | **ear** |
| **W10** | The muffle | `AudioEngine.ts`, `main.ts` | **ear** |
| **W11** | Wading | `main.ts`, `footsteps.ts` | **ear** |

### M1 — A trace to refactor against

Before touching `Controller`, get a way to prove it did not change. A recorded
input trace — a couple of minutes of walking, jumping, stairs, slopes, crouching
under something — replayed through the fixed sub-step, with positions compared
against a stored baseline.

Whether `check:movement` already does something like this decides whether this
phase is an hour or a morning. Either way it is the cheapest insurance in the
document, because **M2 has no other honest gate.**

**Done when** the trace passes against unmodified `Controller` and fails if
`groundAccel` is nudged by 1 %.

### M2 — The mode seam, Ground only

Extract everything in §2's per-mode column into a `Ground` mode behind the
interface. One mode, one entry in the arbiter's list, no behaviour change
intended anywhere.

**The highest-risk phase in this document** — see §2. Gated on M1's trace passing
byte-for-byte, *and* on a play session, because a trace proves the positions and
not the feel of the camera.

**Done when** the trace is identical and walking, running, jumping, stairs and
crouch are indistinguishable. If the trace cannot be made identical, stop and
find out why rather than re-recording the baseline.

### W1 — Water as a world query

Collect `WaterSurface` in the walk `Zone.root()` already does. Add
`ZoneManager.waterAt(x, z)`. Re-point `WaterEffect.submersion` at the same list
and delete its scene traverse and `scanned` flag.

**Done when** the picture is unchanged — which is a strong claim and the whole
reason this is its own commit. Assert headlessly that `waterAt` and the old
box-scan agree over a grid of points in Water Showcase 2, including points on the
dry bank where the plane is buried.

### W2 — The swim basis

The pitch-inclusive forward vector. Nothing calls it.

**Done when** an assertion in `check:movement` shows it equals `_forward`
exactly at `pitch = 0`, and that it is unit length across a sweep of pitch and
yaw. A sign error here is otherwise diagnosed by swimming into the bed.

### W3 — Swim mode, claiming but inert

A second entry in the arbiter's list. `Swim.claims` implements §3's thresholds
and hysteresis; `Swim.integrate` is **Ground's, unchanged**.

So the player wades into the sea, the readout says *swimming*, and they walk
along the bed exactly as before. That is deliberately absurd and it is the point:
it exercises the arbiter, the claim ordering, the hysteresis band and the
`enter`/`exit` hooks with the force model held constant, so the first phase where
swimming *feels* like anything has only one new thing in it.

This is also the phase that proves §2's seam was worth cutting. If a second mode
cannot be added without editing Ground, the interface is wrong and this is the
cheapest possible moment to find out.

**Done when** walking down Water Showcase 2's beach shows one clean transition
each way with no flapping, including over the sandbar, and the two distances
match §3's 6.8 m and 9.9 m within the meander — and `Ground` has not been
modified.

### W4 — The force model

`Swim.integrate` stops being a copy of Ground's. Gravity off, drag on, the 3D
wish, `speed3`, entry damping in `enter`, and §4's mapping — crouch and jump move
to descend and ascend together, with `stance` driven to zero rather than left
latched.

Nothing outside `Swim.ts` should need touching. If something does, that is
information about §2 and worth recording rather than working around.

**Done when** it is swum — this is the phase the feature lives or dies on, and
W5 does not start on an unplayed W4. Plus two things that can be checked without
a person: the three crouch consumers agree, so diving while crouched stands the
capsule up, does not drop the camera and applies no `crouchDrag` penalty; and
`stance` reaches zero within a few frames of entering swim mode from a full
crouch.

### W5 — The surface and the exit jump

Float line, the top-band buoyancy, the upward clamp, the exit jump and its
re-entry lockout.

**Done when** you can get out onto a bank in Water Showcase 1 without bobbing,
and idling at the surface parks you there rather than drifting.

### W6 — Camera

`Swim.decorateCamera`: the swim bob on the stroke phase rather than the gait.
The stale `lastFeetY` is cleared in `Swim.exit`, where it belongs.

### W7 — Silence, honestly

Suppress `onLand`, `landDip` and footsteps on water entry. **Nothing is added.**

**Done when** entering the water is silent. That hole is the point of doing this
separately — it makes W8 a thing you can hear arrive rather than a change to
something already there.

### W8 — Entry, exit, head crossing

The splash scaled by impact, the head-crossing gloop both ways, the climb-out.

### W9 — Strokes

The model, the distance-driven cadence in `advanceBob`, the surface/submerged
blend, L/R alternation.

Depends on W4's `speed3`. Reading `speed` here gives silence on a vertical dive.

### W10 — The muffle

The lowpass between `duck` and `master`, ramped on the same value
`UnderwaterEffect.setDepth` receives.

### W11 — Wading

Footstep level down with depth, splash level up with depth, composed rather than
switched.

### Standing rules

- **Do not touch the walk.** M2 moves it and must not change it; W1–W11 change
  nothing about dry movement at all. If a phase makes walking feel different,
  something has leaked.
- **`Ground` is not the place to put a swimming exception.** After M2, a change
  to `Ground.ts` in any W phase is a signal that §2's seam is in the wrong place.
  Say so and move the seam; do not add the exception and carry on. That decision
  compounds, and it is the one that decides whether a third mode is a day or a
  fortnight.
- **The frozen-stride bug in §6 belongs to whoever reaches it first**, and to
  exactly one of these specs. Not both, and not twice.
- **A feel- or ear-gated phase is not closed by "it builds."** If nobody is
  available to play it, stop and say the phase is built but unplayed. That is a
  real state and it is fine to be in; claiming it passed is not.
