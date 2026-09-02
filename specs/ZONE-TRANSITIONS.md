# Zone transitions — spec

**Built, all nine steps.** Two things came out differently and say so below: a
fourth end kind, `none`, for the far side of a one-way link, and the landing on
top of the crate tower, which is measured off the crates rather than derived
from the ladder.

A door is currently the only way between two zones, and the portal system is
written as though it always will be: a `PortalEnd` is a position and a yaw, the
manager builds a door mesh there, and the door mesh *is* the thing the crosshair
finds. Everything below comes from prising those three apart.

Nine steps. The first five are engine, the next three are the village demo
exercising them, and the last is the loading screen, which is unrelated to any
of it.

---

## The model

**A portal end is a place, a way of touching it, and — sometimes — a fitting
built there.** Today those are welded together. Four end kinds:

| kind | what stands there | what the crosshair finds | how it fires |
| --- | --- | --- | --- |
| `door` | a door the portal builds | the door mesh | pressing E |
| `prop` | an entry the *document* placed | an invisible box over it | pressing E |
| `volume` | nothing | an invisible box | walking into it |
| `none` | nothing | nothing | never |

`none` was not in the plan and fell out of the cellar. The ladder down there
leads up to the cottage and the cottage has no second way down — the hatch is
already the way down — so the far end of that link is somewhere to arrive and
nothing else. Without it the cottage would carry two overlapping targets on one
hatch, both doing the same thing.

`door` is exactly what exists now and changes in no observable way.

**A `prop` end names an entry id in its own zone and adopts it.** The document
places the trapdoor, the ladder, the crates it leans on; the portal only says
"that one is the way through". This is the important choice in the whole spec —
the alternative was teaching the portal system to build ladders and hatches at
angles, which would put art placement inside the link layer and duplicate the
authoring tools that already exist. A builder builds the object, a document
places it, a portal links two places. Nothing moves.

The box is measured from the entry's built world bounding box, inflated a
little, invisible and non-colliding. That is what makes a ladder usable: two
rails four centimetres across are almost impossible to put a crosshair on, and
the box is the whole face of the ladder. It is also what makes a hatch in a
ceiling usable without the portal system knowing which way up it is.

**`half: 'lower' | 'upper'`** takes the bottom or the top half of that box in Y,
and that is the entire mechanism behind a ladder that goes up a level inside one
cell: one portal, both ends in the same zone, one on each half of the same
ladder. Click low, arrive at the top; click high, arrive at the bottom. No
climbing controls, no animation and no new concept — a portal with both ends in
one zone was always expressible, nothing had ever asked for it.

## The prompt

`PortalSide.title` becomes `string | null`. With a title the prompt is the two
lines it already is — `Wood Trapdoor / to / Countryside Cellar`. With none it is
one line, which is what a walk-in volume wants (the name of the place, over the
crosshair, as you come up the road) and what a ladder inside one cell wants:
`Ladder / to / Countryside Village Demo` is a lie about where you are going.

An end may state both halves. Defaults: a door titles itself from its material
as it does now and a prop end from its builder's display name; the second line
is the destination zone's name unless the end overrides it. A volume has no
fitting to name itself after, so it states its own first line — the road you are
stepping onto, `Dirt Path / to / Demo Showcase`.

## Reach

Unchanged, and deliberately: 2.2 m for everything, measured to the surface the
ray actually hits. A trigger box spanning a road is therefore named from most of
the way across it while a door is named from arm's length, with one number
behind both.

## Walking in

A volume end fires on the rising edge of being inside its box *while it is the
hovered target*. Hovering is the whole gate for direction: the crosshair is the
view axis, so you cannot be hovering something you are reversing into, or one
you are sliding past sideways. Nothing is added to the collider — the box is
invisible and non-colliding, and backing into it does nothing at all.

Rising edge, not "is inside", because arriving next to a volume would otherwise
fire it on the first frame. Each volume side holds whether the player was inside
it last frame, seeded from where they land.

## Leaving on foot

A door crossing plays a door. Nothing else has a door, so it plays the player's
own footsteps receding into the black — scheduled on the audio clock in one go
as the fade starts, alternating feet, each quieter and further off than the
last. Four of them out through a gate at the end of a road, two down a ladder or
a hatch, and the black is held for exactly as long as they take rather than the
0.14 s a door gets.

---

## Step 1 — A portal end is a place and a way of touching it

`src/world/Portal.ts`. `PortalEnd` gains `use?` (`door` by default), `propOf?`,
`half?`, `volume?: { size, offset?, reach? }`, `landOn?` and
`prompt?: { title?, label? }`. `PortalSide.door` becomes
`node: THREE.Object3D | null` and `title` becomes `string | null`; `bind` takes
any object.

`ZoneManager.dress` grows two cases beside the door it already builds. A prop
end walks the built root for the entry tag, measures it and hangs the proxy on
the zone root; a volume end builds its box from `end.position` and `end.volume`.
The volume's `offset` is stated in the end's own frame — `+Z` is the way the end
faces, which is out through the arch — and turned by the end's yaw, so an author
says "a metre and a half beyond me" without knowing which way north is.

`src/world/document.ts` carries the same fields onto `ManifestEnd`, and `endOf`
starts honouring a per-end label, which today exists only per portal.

## Step 2 — Reach

Nothing. This step wanted a per-target reach so a trigger could name itself from
nine metres off, and nine metres against everything else's 2.2 read as a bug in
the world rather than as a feature. The box is large and the ray hits its near
face, which gives the approach the name arrives on without a second number.

## Step 3 — The trapdoor has an underside

`hut-trapdoor` is built to be looked at from above and has a dark plane sitting
just under the leaf, so from below it is a black rectangle in a curb. Seen from
under a ceiling it has to read as boards: the void moves flush behind the planks
so their soffits show, and two ledger battens cross them. The object gains an
underside. Nothing is added around it.

## Step 4 — Walking into a volume

`ZoneManager.update` fires a hovered volume the player has just entered.
`Focus`'s door case is unchanged — pressing E on a volume is not a thing,
because a volume has nothing to press.

## Step 5 — Footsteps walking away

`Footsteps` gains a method that schedules a run of receding footfalls, and
`Fade.cover` gains a hold — stated as *how long the cover lasts in total*, so
holding the black over a sound does not add that many seconds on top of however
long the rebuild took. A door crossing is untouched.

## Step 6 — The cellar

New zone `countryside-cellar`: one room under the cottage, stone, storage round
the walls. Three links, all prop ends:

- the hatch in the cottage floor, down
- the hatch in the cellar ceiling, up — the same builder, pitched half a turn
  about X so it hangs from the boards
- a ladder standing under the hatch, up

The ladder builder learns a `height`, because a ladder in a hole has to reach
the hole and today the height rolls off the seed.

## Step 7 — The crate tower

A tower of crates in the village with a ladder against it, and one portal with
both ends in `countryside-village`: the lower half of the ladder puts you on
top, the upper half puts you back down. `ZoneManager` gets a same-zone hop — the
fade and the teleport without the entry, because re-entering the zone you are
standing in would rebuild its audio, its targets and its lighting in order to
arrive three metres higher.

**How high the top of a stack of crates is, is not a number an author has.** A
crate rolls its size class from its seed and three of them stack to anything
between one metre and six, so the arrival cannot be written down. An end may
instead name an entry it stands *on top of*, and the height is measured off
that when the zone is built; where in plan, and which way you face, stay the
author's. A `Placement` gains `exact`, because a landing three metres up must
not then be settled onto the ground under it.

## Step 8 — The village exits through the arch

`countryside-gate`'s village end becomes a volume, a metre and a half beyond the
arch and as wide as the road, naming where it goes from nine metres out. The
`demos` end stays a door, and coming back through it lands you inside the arch
as it does now, outside the volume. Asymmetric on purpose, so both kinds are
walked in one trip.

## Step 9 — The loading screen

Unrelated to the rest. The boot screen is a one-pixel rule and a lowercase word,
and the zone-building indicator is the same rule in the middle of the screen.
Honest, and anonymous.

It becomes a dawn over the thing the title names. The screen is a sky in the
same terms the renderer states everything else in — six flat levels rather than
a smooth ramp, the steps between them dithered at the three-pixel block the game
is quantized to — over a horizon that runs the width of the window, with a stone
standing on it in silhouette. The stone goes up course by course and the night
lifts off the sky, both off the same fraction, so loading *is* the light coming
up on what is being built. The title and the step sit under the horizon at the
left margin, as a caption rather than as a status line in the middle of a void.

The dither is two posterised gradients half a band apart with the upper one
checkerboarded: in the middle of a band they agree and it is flat, at a step
they disagree and half the pixels take the level above. No assets, no canvas.

A step that cannot report its own progress works the one course above whatever
is standing, which is the stone actually being lifted; a band sweeping over
stones already standing is a progress bar wearing a costume. That, and the
night, are compositor animations, because a load step freezes the main thread
completely and anything driven from script would stop dead at the moment it most
needs to look alive. Everything else moves only between steps, which is when the
thread is free.

Constraints that do not move: it is inline in `index.html` so it paints before
any module runs — at `--lit: 0` that first frame is black with a horizon and a
caption, which is what wants to be up instantly — the progress stays the honest
position in a known sequence, and there are no assets. The zone indicator takes
the stone and the ground but not the sky, since it only ever appears inside a
transition already at full black.
