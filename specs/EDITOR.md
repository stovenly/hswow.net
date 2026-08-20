# Zone files, and the editor that edits them — spec

**Not built.** This is the plan for making zones data instead of code, and then for editing
that data in the running game. Nothing here exists yet; the file names, key names and slugs
throughout are provisional — naming is the repo owner's. SPEC.md reserves the destinations
already: `src/content/` ("data only — zones, npcs, topics, quests, items, notes") and
`src/editor/` ("world editor, Phase 11"), with the note that content files hold no engine
imports. This document says what goes in them and in what order the work runs.

The trigger for writing it is the one SPEC.md's Phase 11 deferral told us to watch for:
*"wanting to nudge one prop at a time, or authoring a zone that is mostly hand-placed set
pieces rather than rules."* The long-term intent is hand-placed zones authored by a person,
and that intent has now been stated. The deferral has expired.

## Why the format comes before the editor

The editor is the visible half, but it is the second half, and not only for sequencing
reasons:

- **An editor edits *something*.** Today a zone is a TypeScript `build()` function.
  No tool can round-trip edits into hand-written code; the moment a gizmo moves a prop,
  the prop's position has to live in a document the tool can write back. The format is
  the editor's save file, so it has to exist first.
- **Picking needs a source of truth.** When you click a crate, the editor must answer
  "which *entry* is this?" — not "which mesh". A data-driven builder can tag every mesh it
  makes with the document entry that asked for it (`userData.entry`), and picking becomes a
  table lookup. A code-built zone cannot answer that question at all; there is no way to
  raycast your way back to line 1042 of `countryside.ts`.
- **Most of the machine already treats zones as data.** `ZoneDefinition` is pure data except
  for `build()`. `PortalDefinition` is pure data today. Doors, groundcover, shadows and
  clutter tagging are applied by `ZoneManager.prepare`, not by `build()`. `Zone.ts` called
  this shot: *"a `ZoneDefinition` is a description... That distinction is what will let
  Phase 6 or a JSON file produce zones without any of this changing."* The format replaces
  exactly one function.

## What the document is: verbs, not meshes

The file stores what the authoring vocabulary *says*, never what the scene graph *contains*.
A prop is a builder name, a seed and a placement — the builder contract has promised this
from the start ("a prop is a name and a number, and the same number always gives back the
same object"; "Placement data stores this, not geometry"). A fence is a polyline. A scatter
is a rule. The world is derived from the document on every build, and determinism is already
a checked invariant (`a released zone rebuilds identically`), so the derivation is safe to
repeat forever.

The alternative — serializing placed transforms per instance, Bethesda-style — is rejected.
It would turn a six-line scatter into four hundred rows, destroy diffability, and quietly
break the seeded-draw invariant that lets an exclusion zone be added without reshuffling
everything already placed. Rules stay rules; the editor edits the rule and watches the
result.

## The zone document

One file per zone in `src/content/zones/`. Sketch of the grammar, exterior first:

```jsonc
{
  "id": "countryside-exterior",
  "name": "Countryside Exterior Demo",
  "group": "countryside",
  "environment": { "base": "outdoor", "fogNear": 30, "fogFar": 190, "footstepReverb": 0.5 },
  "soundscape": { /* SoundscapeSpec — already JSON-shaped data */ },
  "spawn": { "at": [0, 28], "yaw": "south" },
  "terrain": {
    "size": 96,
    "landforms": [ { "kind": "hill", "at": [30, -20], "radius": 22, "height": 5 } ],
    "patches":   [ { "kind": "path", "through": [[0, 34], [0, 8]], "width": 2.6, "material": "dirt" } ],
    "detail":    [ { "at": [0, 8], "radius": 26, "level": 2 } ]
  },
  "regions": {
    "keepClear":     [ [0, 8, 7] ],
    "keepClearSoft": [ [0, 8, 10] ]
  },
  "layers": [
    {
      "name": "base",
      "entries": [
        { "prop": "hut", "seed": 21, "at": [-14, 10], "yaw": 0.8, "ref": "millers-house" },
        { "prop": "signboard", "seed": 7, "at": [2, 30], "yaw": 0, "options": { "text": "…" } },
        { "run": "fence", "seed": 12, "points": [[4, 8], [14, 8], [14, 18]] },
        { "scatter": "oak", "seed": 9, "count": 14, "within": [[-48, -48], [48, 48]],
          "maxSlope": 30, "avoid": "keepClear", "scale": [0.9, 1.3] }
      ]
    }
  ]
}
```

And an interior:

```jsonc
{
  "id": "countryside-cottage",
  "name": "Countryside Cottage Demo",
  "group": "countryside",
  "environment": { "base": "cottage" },
  "shell": { "width": 8, "depth": 6.5, "height": 3, "style": "house", "planks": true, "beams": 3 },
  "layers": [
    { "name": "base", "entries": [
      { "prop": "table",  "seed": 3, "at": [1.2, 0, -1.4], "yaw": 0.4, "ref": "table" },
      { "prop": "candle", "seed": 5, "at": [1.3, -1.2], "on": "table" }
    ] }
  ]
}
```

Reading rules, each pinned to a fact about the code as it stands:

- **`environment.base` names a preset registered in code**, and the rest of the block is
  overrides spread onto it — exactly how every zone already spreads `OUTDOOR_ENVIRONMENT`
  or a shared interior constant. Presets stay code (they are tuning, argued for at length
  in comments); the *choice* of preset and the per-place deltas are data.
- **`at` with two numbers is a ground placement, with three it is absolute.** Two numbers
  settle onto the terrain (the exterior `place()`), three are explicit XYZ (the interior
  `place()`). That covers both of the two placement vocabularies that exist today, which
  are currently four private copies of the same helpers across four files. Building the
  interpreter is also the moment those collapse into one shared `src/world/placement.ts`.
- **`on: ref` stacks by measurement.** The interior files stand candles on seed-varied
  tables by reading `topOf(mesh)` from the built mesh, because the table's height is not
  knowable before it is built. The document says the same thing referentially: build the
  entry named `table`, measure it, stand this on it. Order within a layer is document order,
  so the referent always exists by the time it is needed.
- **`terrain` is the `TerrainOptions` literal, verbatim.** The landform list is already
  "the same list a Phase 6 editor would drag around" — terrain.ts says so in its header.
  Nothing to invent; the interpreter constructs a `Terrain` from it and derives `groundAt`
  and `surfaceAt`, the two `ZoneDefinition` fields that are functions today. No terrain
  section means flat at 0, which is every other zone.
- **`shell` starts as `InteriorOptions`, verbatim**, with `style` naming a registered
  `InteriorStyle` — and grows into the room graph ("Interior shells beyond the box",
  below). A one-room shell with no joins is exactly today's box, so the simple case never
  pays for the general one.
- **Runs and scatters carry their existing signatures.** `run` is the `laid` family —
  polyline in, pieces out, corner-chaining from returned endpoints handled inside the
  interpreter. `scatter` is the existing options record with `avoid` allowed to name a
  shared region list instead of repeating circles.
- **`options` passes through to `BuilderWith` extras** — signboard text, fence sections,
  column heights. The builder validates its own options, as it does now.
- **Yaw accepts radians or a compass word.** `"south"` beats `3.14159` in a file a person
  edits by hand, and the editor writes radians when precision matters.
- **The full transform is available, and the short form is the common case.** `yaw` alone
  covers most props. `rotation: [pitch, yaw, roll]` (YXZ, the order `lean` already uses,
  tilting about the foot so the origin stays on the ground where the checks look for it)
  covers the leaning post and the toppled crate. `scale` is the builder contract's uniform
  scale. Per-axis stretch is deliberately a separate, louder key (`stretch: [x, y, z]`,
  applied to the finished mesh) because it leaves the builder's `radius` spacing hint and
  proportions behind — legal, but the document should show where it happened.

What the document never contains: door meshes (the manager builds those), groundcover
placement (grown from the ground, never placed), shadows, clutter tags, collision — all of
it is `prepare()`'s work already, and the format inherits that cleanliness for free.

## Interior shells beyond the box

`buildInterior` is one sealed rectangular room with style knobs. That was the right size
for proving thresholds; it cannot make an L-shaped tavern, a loft over a workshop, a cellar
stair, or a corridor between rooms. Interiors that want to break the mold need a hardier
kit, and the shell grammar is where it lands.

Three ways to build one, and the choice matters more than any other in this document:

**A — the room graph (recommended).** A shell is a set of rooms — rectangular footprints,
each with its own floor level, ceiling height and style — plus *joins*: openings cut where
two rooms share a wall (doorway, arch, open span, stair), plus *features* on walls
(windows, hearth recesses). The builder unions the rooms, cuts the joins, builds the stair
geometry, and guarantees the result watertight, exactly as the box does today.

```jsonc
"shell": {
  "style": "house",
  "rooms": [
    { "id": "hall",   "at": [0, 0],    "size": [8, 6.5], "height": 3 },
    { "id": "snug",   "at": [7, 1.5],  "size": [4, 3.5], "height": 2.4 },
    { "id": "cellar", "at": [1, 0],    "size": [4, 4],   "floor": -2.6, "height": 2.2, "style": "works" }
  ],
  "joins": [
    { "between": ["hall", "snug"],   "kind": "arch", "at": 0.5 },
    { "between": ["hall", "cellar"], "kind": "stair" }
  ],
  "features": [
    { "room": "hall", "wall": "+x", "kind": "window", "at": 0.3 }
  ]
}
```

Why this one: **the seal check stays a proof.** `check:world` fires 600 rays out of every
interior and none may escape; with a builder that seals by construction, that check
verifies the builder once and every document inherits the guarantee. It also stays
readable as a place — three rooms and two joins *is* the floor plan — and it degrades to
the current grammar (one room, no joins, is today's box).

**B — kit pieces (rejected).** Bethesda-style modular wall/corner/floor/stair segments,
snapped to a grid in the editor. Maximal freedom, and the wrong trade everywhere else:
watertightness becomes an authoring problem instead of a builder guarantee, so the seal
check degrades from proof to lint that fires after every editing session; hairline seams
between pieces are exactly what flat-shaded untextured geometry cannot hide; and it cuts
against the house rule that a builder hands over one complete connected thing.

**C — surface styles on a sealed shell (not an alternative — a layer on A).** The rock
recipe — displace vertices along normals — applies to a shell's inner surface as well as
it does to an icosahedron. A `roughen` style on a room graph turns the same sealed
geometry into a cave, a crypt, a dug cellar, with the seal untouched because displacement
moves vertices, never topology. This is how interiors escape *boxiness* without escaping
the box guarantee, and it should be a style field, not a different system.

Multi-storey falls out of the room graph: an upper room is a room with a raised `floor`,
a stair join reaches it, and its floor slab is the lower room's ceiling where footprints
overlap. What stays out of scope for the shell kit: exteriors of buildings (those are prop
builders like `hut`), and free non-rectangular footprints — if a real interior eventually
needs a curved wall, that is a new room kind added then, not speculative geometry now.

## Portals: one manifest, ends by reference

Portals go in one file — `src/content/world.json` — not in zone files. A portal is a fact
about a *pair* of zones; splitting its two ends across two files invites the orphan-half
bug, and the existing code pattern (the hub passes its end into the far zone's factory,
stated three times over as "a hall knows what hangs off it and nothing about the world
outside its door") already treats the link as something neither zone owns alone.

```jsonc
{
  "portals": [
    {
      "id": "millers-door",
      "a": { "zone": "countryside-exterior", "doorOf": "millers-house" },
      "b": { "zone": "countryside-cottage", "wall": "-z" },
      "seed": 21
    }
  ]
}
```

Two derivations replace hand-typed coordinates, both preserving the code's
measured-not-computed discipline:

- **`doorOf: ref`** — the end stands at the door anchor of a placed building. This is
  `houseDoorEnd` as data: build the hut (the zone build does anyway), read
  `userData.doorAnchor`, done. The door cannot drift off its building because it was never
  stored separately — the same argument `Portal.ts` makes for derived arrival markers.
- **`wall: "-z"`** — the end sits in an interior shell wall at `-depth/2 + DOOR_PROUD`.
  That formula is currently copy-pasted with `DOOR_PROUD = 0.07` into five files; the
  interpreter becomes the one place it lives.

Explicit `at`/`yaw` stays available for the countryside-gate case (a freestanding portal
between two exteriors), and `arrival` stays available as the same rare override it is now.

## Refs, conditions and state — designing the hooks without building the systems

This is the Bethesda borrowing, taken at the level of the *convention*, not the tooling.

**Refs.** Any entry may declare `"ref": "slug"`, unique within its zone,
zone-qualified globally (`countryside-exterior/millers-house`). Only things that need
referring to declare one: portal `doorOf` targets, `on` stacking bases, soundscape emitters
anchored to props (`"at": { "ref": "smithy-forge", "lift": 1.1 }` — replacing today's
shared-constant convention with the same guarantee that neither can move without the
other), and eventually quest scripts. Everything else stays anonymous.

**Conditions.** Entries and layers may carry `when`, in the grammar SPEC.md's dialogue
model already commits to — quest stage, flag — with the three combinators:

```jsonc
"when": { "quest": "the-fire", "stage": { "min": 40 } }
"when": { "flag": "gate-opened" }
"when": { "not": { … } }   "when": { "all": [ … ] }   "when": { "any": [ … ] }
```

**Layers are the unit of change, not props.** "Finish the quest and the town is burned" is
not forty props each carrying a condition; it is a `village` layer whose `when` is the
negation of a `village-burned` layer's. Per-entry `when` is allowed but the convention is
to reach for a layer the moment two entries share a condition. This keeps the common case —
a zone with no conditions at all — a document with one unnamed layer, costing nothing.

**Evaluation is at build time, on entry.** One zone is resident at a time, rebuilds are
proven identical and cheap, and the residency walk already disposes and rebuilds zones
constantly — so conditional state needs no live patching. A flag flipped while standing in
the affected zone takes effect on next entry, and if a quest moment ever needs the world to
change *while you watch*, that is a scripted event, not the format's job.

**Until Phase 8 exists, conditions read a stub.** Quests, flags and saves are Phase 8/9 and
not started; per house rule, that costs a sentence, not a gate. The interpreter evaluates
`when` against a `WorldState` object that is, for now, a set of dev-panel toggles — which
is also precisely the test rig the burned-town layer needs: flip the flag, re-enter, see
the other town.

**The delineation, in one line each.** The zone file knows where a body stands; the
character file knows who they are. So: `content/zones/` — places, layers, refs.
`content/world.json` — the portal graph. `content/npcs/` — greeting, topics, rebuffs, per
SPEC.md's existing data model; a zone places `{ "npc": "miller", "figureSeed": 3, "at": …,
"patrol": [...] }` and the id joins the two. `content/quests/` — stages and the flags they
set. `content/notes/` — readable text, teaching keywords. Zone documents point *into*
these by id and never contain them; `check:world` grows a cross-reference pass so a
dangling id is a failed check, not a silent nothing.

## What never migrates

Two kinds of zone coexist indefinitely, because both are just `ZoneDefinition`s and the
registry cannot tell them apart. The proving ground, the movement gym, all ten galleries,
the prop halls and the showcases stay code: they are fixtures *derived from the registry*
(a gallery is a function of the builder list — as a document it would be a stale copy of
one), and several are test rigs whose geometry argues with the systems they exercise. The
migration set is exactly the four content-like zones: `countryside-exterior` and the three
homes. Everything after that is new content, born as data.

## The interpreter

`src/world/document.ts` (or wherever it lands): `zoneFromDocument(doc): ZoneDefinition` and
`portalsFromManifest(manifest): PortalDefinition[]`. Registration in `main.ts` changes by
two lines — the arrays from `createTestWorld` are concatenated with the arrays from
content. Builders resolve by name through an explicit import table in the interpreter, not
through `art/registry` — the registry is `import.meta.glob` and Vite-only, and `check:world`
reaches zones through esbuild; the galleries already solve this the same way.

During build, every mesh an entry produces is tagged `userData.entry = { zone, layer,
index, ref? }`. The game ignores it; the editor is built on it; the checks use it to say
*which document line* put a prop underground.

## The editor

Dev-only, in the running game, behind `?editor`. Not a separate app: the entire value of
editing in-engine is that the render pipeline, fog, groundcover and light are the real
ones — judging placement through anything else violates the screenshot-before-tuning rule
by construction. lil-gui is already resident for panels; the same skeleton serves.

The loop that makes it an editor rather than a viewer:

1. **Edit** — a change mutates the in-memory document (never the scene).
2. **Rebuild** — the resident zone disposes and rebuilds from the document, in place.
   This is the existing eviction path; it is proven leak-free across 60 crossings and
   identical across rebuilds. On a 96 m zone the cost is a loading-bar blink, and it is
   honest: what you see is a from-scratch derivation, exactly what the next boot shows.
3. **Save** — POST the document to a Vite dev-server middleware that writes the JSON into
   `src/content/zones/`. Git is the undo of last resort; the in-session undo is a snapshot
   stack of the document, which is small enough to snapshot on every mutation.

Everything the editor can touch is saved, by construction: a control that changes what you
see is a control that wrote a document field, and the document is the save file. What stays
session-only is deliberate and short — the fly camera's position, the undo stack, and the
layer-preview toggles, which are inspection state rather than world truth. One wrinkle for
step 1: saving writes into `src/`, so Vite's watcher fires, and the save path has to ride
the same reload suppression `HotReload` already does for edits — a save that reloads the
page and drops you at spawn would make saving feel like dying.

Staged, each stage usable alone:

**Stage E1 — inspect and edit anything selected.** Fly camera with full six-axis movement
and free look (detach from the capsule, noclip; the controller keeps its state so leaving
editor mode drops you back where you stood). Pick via the existing raycast machinery
against `userData.entry`. The inspector panel exposes *every* field of the selected entry
as a control: XYZ position, pitch/yaw/roll, uniform scale and per-axis stretch, the seed
(a re-roll button and a slider — changing a selected entry's seed is intentional churn),
and the builder's own options as typed controls. That last one forces the spec's only
change to the art kit contract: `BuilderWith` options exist only as TypeScript types,
which are gone at runtime, so extended builders gain a small runtime schema (field name,
kind, range) the editor renders controls from and `check:art` validates against the type.
This stage alone retires "wanting to nudge one prop at a time."

**Stage E2 — place and remove.** A palette listing every known builder by
`CATEGORY_ORDER`, searchable, with the gallery as its permanent visual reference (the
Vite-only registry is fine here — the editor is Vite-only by nature). Click ground to
place at the hit point; new entries roll a seed and it is *kept*, never re-rolled on later
edits — seed churn on an *untouched* entry is a visible world change and the determinism
checks make it a loud one. Delete, duplicate, drag along the ground plane.

**Stage E3 — the menus for everything that isn't a prop.** The zone's whole environment
block as a panel: fog, sun, fill, ambient, wind, room acoustics, surface, soundscape
gains — the same knobs the dev panel already exposes for tuning, but writing into the
document instead of evaporating. Sky properties sit here too, and grow as the sky does.
Note that the *air* has grown a set of its own since this was written — VISTA.md's
`airCurve`, `fogRamp` and `fogCeiling` are a look rather than a place, so they belong with
the preset and not in the zone's environment block; `fogNear`/`fogFar` remain per zone. Interior shell editing as forms over the room graph — add a room, drag its
footprint, pick a join kind. Landform handles (drag a hill's centre, scroll its radius —
editing the list terrain.ts always said an editor would drag around). Patch and region
shapes drawn on the ground. Run polylines with corner dragging. Scatter rules edited as
forms, with the rule's instances highlighted while selected. Portal wiring by clicking two
door sites. Emitter placement with audible-radius spheres — the thing Phase 6 proved is
miserable to type.

**Stage E4 — when the systems exist.** NPC spawns and patrol paths (Phase 7), trigger
volumes, layer preview (a dropdown that forces `when` results, driving the same stub the
dev panel exposes). None of this blocks E1–E3.

## Checks

The existing suite is the editor's safety net and needs almost nothing new — `check:world`
never cared where a `ZoneDefinition` came from, so every arrival, seal, leak, slope and
residency assertion applies to data zones unchanged. New assertions, all cheap:

- Every document validates against the schema; unknown keys are errors, not warnings.
- Every `prop`/`run`/`scatter` names a builder the interpreter knows.
- Refs are unique per zone; every `on`, `doorOf`, emitter anchor and manifest end resolves.
- Every `when` references a quest or flag declared in content (against the stub manifest
  until Phase 8).
- Migration one-off: the data-built countryside matches the code-built one in triangle and
  mesh counts before the code version is deleted.
- Layer extremes both pass: each zone is built with all conditions false and all true, and
  the seal/arrival/floor checks run on both worlds.

## Ways to get it wrong

- **Serializing the scene back.** The document is upstream of the world, one direction,
  forever. An "export current scene" feature is the first step toward two sources of truth.
- **Re-rolling seeds on edit.** Moving a prop keeps its seed; re-saving an untouched
  scatter keeps its draws. Any editor operation that reshuffles what it didn't touch turns
  a one-prop nudge into a whole-zone diff and a visibly different world.
- **Per-prop conditions everywhere.** The moment two entries share a `when`, it is a layer.
  Condition sprawl is how a format stops being readable as a place.
- **Building the editor first.** Every hour spent on gizmos before the format exists is
  spent editing something that cannot be saved.
- **Letting the editor become the only author.** The files stay hand-editable and diffable;
  the editor is a faster hand, not a gatekeeper. If a document stops being something a
  person would write, the grammar has failed, not the person.

## Shape of the work

1. **Schema and interpreter.** Types for the document, `zoneFromDocument`,
   `portalsFromManifest`, the shared placement module extracted from the four private
   copies. No content yet; a unit-sized test document proves the loop.
2. **Migrate the three homes.** Small, interior-only, exercises shell/props/`on`/portal
   `wall` ends. Delete their code once counts match.
3. **Migrate the countryside.** The hard one — terrain, runs, scatters, regions, `doorOf`,
   emitter anchors. Everything the grammar claims, proven on the only real exterior.
4. **Refs, layers, `when`, and the dev-panel state stub.** The burned-town rig works
   end to end with no quest system in sight.
5. **Editor E1**, then **E2**, then **E3** — each shippable alone, each on the same
   document loop.
6. **The room-graph shell kit.** Independent of the editor stages — it is a builder, so it
   can land any time after step 1 and be authored as raw JSON before E3 gives it forms.
   The migrated homes stay one-room boxes; the first multi-room interior is new content
   and proves the kit. The seal and leak checks apply unchanged, which is the point.
7. **E4 rides on Phases 7/8** and is those phases' business to schedule.

Vista is one more entry kind — `{ "vistaRing": { … } }` — and VISTA.md has now landed, so
what follows is what it actually left behind rather than what it was expected to.

**The expensive half is already paid.** The band merges fifty props into one chunk, so a
chunk cannot carry a single `userData.entry` — and that is a fact about merging, not about
vista: every merged system after this one hits the same wall, and none of them can fix it
after the fact, because once the buffers are concatenated nothing can tell which triangle
belonged to which prop. `vistaRing` therefore records `{ start, count, name, seed }` per
prop while it concatenates, and `vistaPropAt` binary-searches a raycast's `faceIndex`
through it. The tagging rule above stands widened — **a mesh carries either one entry or a
sorted range table** — and the editor's remaining job is to add an `entry` field to that
record and read it. That is an afternoon, and nothing about it gets harder by waiting.

**The placer's options are pure data, and were built that way deliberately.** There is not
one function type in `VistaProp`, `VistaScatter` or `VistaRingOptions` — numbers, tuples,
named shapes, and two object references (`MeshBuilder`, `Skirt`) that a loader constructs
from a name and a table. `scatter()`'s `avoid`/`maxSlope` predicate idiom would have made
the ring unserialisable forever; it was kept out.

Three corrections to what this document previously assumed:

- **Vista entries are not polar.** They were going to be bearing/distance/apparent-size,
  which is a form the inspector would have needed beside the XYZ one. They are not: a prop
  is a world position, and everything else about the band — the inner and outer edges, each
  kind's own band, the keep-out, and `apparent` — is a **distance measured out from the
  level's outline**. One unit, one extra field, no second form. That is also what makes an
  L-shaped or S-shaped level cost nothing: the distance field bends with the outline.
- **There are no parallax tiers.** Parallax is per object: a prop states how far it should
  *read* (`apparent`) and its `k` is derived. Merged means still, individual means moving,
  so a moving prop is its own mesh and carries an ordinary single entry — the range table
  is only ever needed for the still band. E1's fly camera still wants the freeze toggle
  (`ZoneManager.freezeVista`, already built and already in the dev panel), or moving the
  camera slides the world under the prop being placed.
- **There is no sky ridge.** Band 3 was built as a shader feature in the dome and then
  removed; a skyline, if one is wanted, will be low-poly geometry like everything else. No
  environment fields, no inspector form.

Two things E3's shape tools acquire as consumers rather than as new work: the **level
outline** and the **parallax keep-out** are both `PatchShape[]`, the same vocabulary ground
materials and cover are already painted in, so "patch and region shapes drawn on the
ground" covers all four. The keep-out is worth calling out because it is the one shape a
human genuinely has to draw — for a compact level it is the outline dilated by whatever
the still band reaches and `dilateOutline` does it, but the interesting case is a shape no
dilation produces, like the cup between the arms of a Y-shaped level.

Finally, an authoring rule rather than a feature: **vista placement is assumed to be in
good faith, and there is no guard.** Two props that read as equally distant but carry very
different `apparent` values will drift against each other and look wrong. That is a thing
for the editor to make *visible* — showing `apparent` on selection, or drawing the
keep-out while a vista entry is selected — and deliberately not a thing for the placer to
police.

Readables (READABLES.md) cost this document less, and something different: not a change to
how entries are tagged, but a **second document type to edit**. A note lives in
`content/notes/` and is not an entry, so it cannot be reached from the inspector — it needs a
library pane beside E3's environment forms, listing every note, editing its body, and showing
where each is bound. The entry side is one field: `text`, a searchable dropdown over that
library, plus *clear*, which is what keeps the prop and the words independently editable.
Two smaller notes: the game's reading screen *is* the editor's preview, because pagination is
measured against the real box and an approximation would be wrong exactly where it matters;
and `check:world`'s cross-reference pass grows a `text → note` arm, with prose that is
written but placed nowhere as a warning rather than a failure.

## Decisions that are yours

- **Names throughout**: this file's own name, `content/` layout, key names, `ref` slugs,
  room and join kind names in the shell grammar.
- **The shell kit choice.** The room graph is the recommendation and B's rejection is
  argued above, but it forecloses free-form modular building — worth an explicit yes.
- **JSON dialect.** Plain JSON is the safe machine-round-trip choice but has no comments;
  this repo prizes marginalia. Options: JSON5 (comments, but editor round-trips destroy
  them anyway), or plain JSON plus an optional `"note"` field the editor preserves
  verbatim. Recommendation: plain JSON + `note`, and prose lives in docs.
- **Portal manifest granularity**: one `world.json`, or one manifest per zone group.
- **Whether E1's fly camera doubles as a player-facing photo mode later** — engineering
  says free, fiction says maybe not.
