# src/world

Places, and what is between them. A zone is one contiguous piece of world you
can walk around in; a portal is a link between two of them, and both its ends
may be in the same one.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## The zone lifecycle

Exactly **one** zone is in the scene and in the collider at any moment. The
exterior is a zone and every interior is a zone; they never coexist, which is
what lets every interior be authored about its own origin.

Crossing a threshold, in `ZoneManager.enter`, is: build the zone if it is cold
(async, because a blocked frame cannot paint), compile its programs *before*
anything is swapped, then — with nothing yielding from here to the teleport —
remove the old root, add the new one, rebuild the collider from it, push the
zone's air and acoustics into the pipeline and the audio engine, and drop the
player on the arrival marker. All of it at full black inside one frame.

`evict` runs last, once the arrival has settled, and drops every zone further
than `KEEP_WITHIN` doors away plus the one you just left. It is safe because
builders are seeded: a rebuild gives back the same world down to the blade of
grass. Geometry, the collider's octree, the doors, the soundscape and the warm
mark all go together.

## The climate

`climate.ts` decides what today is: the clock, the sun's position from a real
solar model, the wind field's settings, and how much of each registered weather
kind is running. It is sampled at a **map coordinate**, never declared — two
zones in the same valley get the same shower, and a zone with no `place` stands
outside the weather entirely, which is what a gallery wants.

A weather **kind** is a row. What a kind can do is closed — particles, sound,
air, surface, sky, ground, wind — and which kinds exist is open, so smog is a
row and needs no code anywhere downstream.

`WeatherRig.ts` is the other half: what the climate does to the world, once a
frame. The light rig, the dome's colours, the cloud decks, what is falling, what
it sounds like, and how wet the stones are. It integrates the wet and lying
values itself — rain soaks a surface in about half a minute and takes minutes to
leave it, so the gloss outlives the shower.

`lightning.ts` is the one discrete thing in the climate. A strike is drawn from
a hash of a four-second bucket of the sky clock rather than stored, so two zones
see the same bolts, scrubbing the clock scrubs them, and there is nothing to
serialise. A row of `WEATHER_KINDS` throws lightning by declaring `strike`, which
also gates it on the moisture the climate has already sampled. The flash enters
the world in one place — `skyBand` — which is what makes the dome, the fog, every
lit surface and the water light up together; the channel is `art/bolt.ts`, and
the peal is a `WeatherRig`-owned one-shot that *causes* the ambience director's
hush rather than being subject to it.

`skymap.ts` bakes one orthographic pass straight down over each zone as it is
built. The finish stage reads it to tell a roof from the ground under its eave.

**The sun moves, so nothing may bake or rate-limit what depends on its
direction.** The shadow map is rebuilt every frame; the light and the fill both
travel with it.

## Portal ends

An end is a place, a way of touching it, and — for a door — a fitting built
there. `door` builds a door mesh and the mesh is what the crosshair finds.
`prop` adopts an entry the document already placed and hangs an invisible,
non-colliding box over its extent, which is what makes two ladder rails findable
and a hatch in a ceiling usable without this layer knowing which way up it is;
`half` takes the bottom or top of that box, which is a ladder that goes up a
level inside one cell. `volume` builds a box and nothing else: it names where it
goes from further off than arm's length, and fires on the rising edge of the
player being inside it *while it is the hovered target* — the crosshair is the
view axis, so a volume you are reversing into or sliding past is not the one
under it. `none` is somewhere to arrive and nothing else, for a one-way link.

An end whose landing nobody could write down names what it stands `on`, and the
height is measured off that entry when the zone is built. `Placement.exact`
stops the landing being settled onto the ground three metres below it.

Leaving through a door plays a door. Leaving through anything else plays the
player's own footsteps receding, scheduled on the audio clock in one go so the
tail carries across the cut, and the black is held for as long as they take.

## Documents

A zone is a JSON file of verbs, never meshes: `document.ts` turns one into a
`ZoneDefinition` and `world.json` into the portal graph. Before that walk runs,
`warmProps.ts` asks every entry kind what it is going to build and makes those
geometries on the work pool; the walk claims what is ready and builds the rest
itself. A kind says so by declaring `asks`, which has to list the same builder
calls `build` makes, in the same order — so a kind that rolls its placement
shares one function between the two rather than reproducing it. A kind needing
anything the walk has not built yet, like a resolved anchor, declares none and
builds on the frame. The warm gives up after a budget, because a miss is free
and a stall is not. `entry.ts`
holds the grammar and the kind table `registerEntryKind` extends; `kinds.ts`
holds the kinds themselves. Every mesh an entry produces is tagged `userData.entry`, which
the game ignores and the editor is built on.

`people.ts` holds the other two content families: a **trait** is what somebody
is and a **person** is who they are, and both contribute greetings, farewells
and topics. `dialogue.ts` gathers them — every owner's topics into one pool, the
highest-ranked survivor of each key, each answered by the first of its infos
that holds. A person outranks a trait, and a trait granted later outranks one
granted earlier, which is how a visitor's own trait beats the one the zone hands
everybody standing in it. A creature naming a person wears that person's body,
resolved before the warm pass so the warm and the walk ask for the same mesh.

`state.ts` is what a `when` is judged against. Flags and quest stages are held
in memory and remain a stub until the quest system exists; where the player
stands and what the weather is doing are pushed in once a frame by
`WeatherRig.applyAmbience`, which already samples both. A condition may also ask
about a person — their traits, their name, what they are doing — and is handed
that subject by whoever is asking; asked without one, it is false.

## Dressing, interior, terrain, vista

- **`terrain.ts`** — the walkable heightfield, summed from placed landforms.
  Authored, never noise. The `rim` landform is the boundary: ground past the
  slope limit, made of the same triangles as everything else.
- **`ground.ts`** — what that ground is *made of*, patch by patch. A material is
  a colour **and** a sound **and** what grows on it, in one table, so the three
  cannot drift apart.
- **`interior.ts`** — a sealed shell with no doorway cut in it. Portal doors
  bring their own frame and dark backing panel. `rooms.ts` is the same thing for
  several rooms joined where they touch: every wall is built as panels that tile
  it exactly with the openings taken out, so the shell is watertight by
  construction rather than by care.
- **`raster.ts`** — the sculpted layer over a heightfield. Shapes for what is
  deliberate, rasters for what is brushed, and the two compose.
- **`vista*.ts`** — everything past the boundary, in three bands: ordinary props
  along the edge (`dressing.ts`), merged scenery in the ring, and the sky. The
  whole band is written against one signed distance to the level's outline,
  which is why a winding level costs nothing extra.

## Conventions

**Declared or observed, never both.** A fog volume has no geometry, so it is
declared on the `ZoneDefinition`. Water and glass *are* geometry, so they are
observed on the build traversal — a flag that could disagree with what was
built would silently cost a whole-scene walk or leave a pond that never draws.

Positional facts live on the definition (`spawn`, `groundAt`, `fogVolumes`,
`glitches`); facts about a *kind* of place live in `ZoneEnvironment`, which is
why two constants cover nearly every zone.

Two solids that meet exactly share corner vertices, which is a seam a player can
fall through. Walls overlap at corners; floors are inset into them.
