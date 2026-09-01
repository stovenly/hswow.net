# Blending a creature's motions — spec

Every motion a figure makes should arrive out of the one before it and leave
into the one after. Today most of them cut.

**The short version.** There is a blend, and it is doing less than it looks.
`settling` carries the difference between the old pose and the new one and
decays it over a 0.14 s half-life — but it only fires on a *state* change, and
during a conversation the state does not change. Three of the layers take no
weight at all and are applied flat from their first frame to their last. So a
villager mid-conversation drops one gesture and starts the next on the same
frame, and the only thing smoothing it is a decaying offset that never fired.

---

## What is there now

`update` sums the layers into one `Pose` every frame, then:

```
if (settling) offset += last − pose        // the step, captured once
offset *= 2^(−dt / SETTLE)                 // SETTLE = 0.14 s
pose += offset
```

That is a good mechanism and it is the right one to build on. It has three
problems.

**It only fires on a state change.** `begin(state)` sets `settling` when the
state is genuinely different. `startGesture` does not, and `startGesture` is
what runs during a conversation: a new sentence picks a new `talkStyle`, resets
`gestureT` to 0 and changes `gestureLength`, all while the state stays `talk`.
Nothing is carried, so `t01` jumps from wherever it was to 0 and the arms go
with it.

**Three layers have no weight.** `bipedTalk`, `look`, `graze` and `faceTalk`
all take one and ramp; `bipedGreet`, `bipedFidget` and `call` do not. A
greeting is applied at full strength on the frame it starts and the frame it
is cut off. `bipedTalk` ramps over the first and last quarter of its own life,
which is why talking reads better than greeting does.

**The fidget is a hard switch.** `startGesture` sets `timer = -1` to stop the
idle business fighting the gesture for the same arms, and `converseGestures`
sets it back to `fidgetLength` when the line ends. `busy` flips on a frame, and
`bipedFidget` gets `1 - timer / fidgetLength`, which is 0 at that moment — so
the fidget appears and disappears at full weight rather than fading.

**And a freeze is not a tween.** Even where `settling` fires, what it carries
is a *difference*, held still and shrunk. An arm that was rising when it was
interrupted stops rising; the offset only hides the discontinuity, it does not
continue the motion. At 0.14 s that is a snap being absorbed rather than one
motion becoming another.

## The constraint that shapes all of it

**Layers add.** `pose.blend(layer, w)` and every gait function accumulate into
the same buffer, and `envelope.ts` states the largest rotation any layer may
apply per bone. Two gestures overlapping at full weight would sum past it — a
figure with both hands where one hand should be.

So a cross-fade has to be a **lerp, not a sum**: the outgoing gesture at
`1 − k` and the incoming at `k`, with the two weights adding to one. Every step
below has to hold that, and any step that cannot is wrong.

## Step 1 — every layer takes a weight

`bipedGreet`, `bipedFidget` and `call` grow a `w` parameter and scale what they
add by it, as `bipedTalk` and `look` already do. No caller changes behaviour
yet: they all pass 1.

*Done when* every gait function has a weight and the figures look exactly as
they do now.

## Step 2 — nothing starts or ends at full strength

The ramp `bipedTalk` already has — `smooth(min(t01·4, 1, (1−t01)·4))` — becomes
the rule rather than one function's habit. A greeting fades in over its first
fifth and out over its last; the fidget fades both ways over its own length
instead of switching on `busy`.

This alone fixes the ends of every motion. It does not fix a motion cut off in
the middle, which is Step 4.

*Done when* a greeting no longer pops at either end, and the idle business
under a conversation arrives and leaves rather than blinking.

## Step 3 — a gesture change settles like a state change

`startGesture` sets `settling`, and so does anything else that resets
`gestureT` or changes `gestureLength`. `SETTLE` moves from 0.14 s to something
that reads as a transition rather than as damage control — 0.25 s is the first
number to try, and it is the repo owner's to move.

*Done when* the gesture that opens each sentence of a conversation grows out of
the one before it.

## Step 4 — two gesture slots, and a real cross-fade

The one that changes the character of it. Instead of one gesture with one
phase, the figure holds two:

```
gesture[0]: kind, t, length      the one coming in
gesture[1]: kind, t, length      the one going out, still advancing
k: 0 → 1 over CROSS seconds
```

Both are evaluated every frame — the outgoing one keeps its own clock running,
so an arm that was rising is still rising as it fades — and they are mixed at
`k` and `1 − k`. Starting a third gesture while a cross-fade is running
collapses the current mix into the outgoing slot rather than adding a third,
because the envelope allows exactly one gesture's worth of rotation and a
three-way mix is one more than the budget.

With this in place `settling` goes back to being what it was for: a state
change, where the *kind* of thing the body is doing changed and there is no
matching pair of gestures to blend.

*Done when* a villager interrupted mid-greeting by a new line finishes the
greeting's arc under the new gesture rather than dropping it.

## Step 5 — the envelope holds

Every gait function's largest rotation per bone was cleared against
`envelope.ts` on the assumption that one gesture runs at a time. A cross-fade
keeps that true by construction if and only if the weights sum to one, so the
mix is the thing to check and not the individual layers.

The one place it can still break is a gesture crossing with the fidget, which
is a separate layer on the same arms — hence `timer = -1` today. Under Step 2
the fidget fades rather than switching, so during the fade both are on the arms
at once. Either the fidget's weight is `1 − (gesture weight)`, which is the
cheap answer and the right one, or the pair needs its own envelope entry.

*Done when* no bone exceeds its entry during a cross-fade, checked by reading
the weights rather than by measuring anything.

## What this is not

- Not clips, not an animation graph, not keyframes. Every layer stays a pure
  function of a phase or a clock, and the only state added is the second
  gesture slot and its fade.
- Not a change to what any gesture looks like. Every step is about how one gets
  to another; a gesture whose shape changes means the step was wrong.
- Not cloth. Rigged creatures carry no cloth simulation and this does not
  change that — but garments are cleared against `envelope.ts`, so Step 5 is
  what keeps them honest.

## To settle before building

1. **How far.** Steps 1–3 are small, land together and fix the ends of every
   motion, which may be most of what was actually wrong. Step 4 is the real
   cross-fade and is its own piece of work. Worth doing both, or is 1–3 enough
   to look at first?
2. **The numbers.** `SETTLE`, the ramp fractions and `CROSS` are all
   placeholders picked from reading the code, not from watching a villager.
   They want a pass in the world once there is something to watch.
