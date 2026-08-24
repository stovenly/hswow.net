# The editor — spec

**Steps 1 through 11 of §7 are built.** What follows is the design; this note is
what the code does differently from it, and what is still open.

- **Documents carry no code-splitting flag.** Splitting one buys nothing: the
  geometry is in the shared builders either way, and a document is a few
  kilobytes of placement.
- **Top view is a narrow field from three hundred metres up**, not an
  orthographic camera. The pipeline captures the perspective camera in a dozen
  places and swapping it would be a change to the renderer for the sake of a
  view mode.
- **The factory interior stays code.** Its roof trusses are raw boxes in a
  private material rather than art-kit builders, so there is no builder name a
  document could name; making one is an art decision rather than a migration.
- **Wall features are not part of the room graph.** A window and a hearth are
  placed builders, which is what every interior does today; cutting them into
  the shell would be a second way to do the same thing with a different look.
- **`docs/` is ignored and untracked.** The one-time `git clone <site-repo>
  docs/debug` and the Pages switch have not been done, so the live site is
  served from a folder this repo no longer carries.
- **Nothing has been looked at in a browser.** Every zone the migration touched
  needs its render judged.

Every name, key, slug and key binding below is provisional — naming is the repo
owner's.

Two things are being specified, and the order between them is fixed:

1. **The zone document** — a data format that replaces `ZoneDefinition.build()`. The editor
   edits this and nothing else. Without it there is nothing to save.
2. **The editor** — a second page in this repo that boots the real engine, loads documents,
   shows the result through the real render pipeline, and writes documents back to disk
   through the dev server.

Under the house rules, this document contains no checks section. The render is the ground
truth; the editor's job is to put the truth in front of you fast, not to measure it.

---

## 1. Stack

### The brief, and where it is amended

The brief asks for a local HTML file that renders "very similarly", a lightweight local server
for file access, and free flight with a drop-in player. The shape is right. Three amendments:

**Not similar — identical.** The editor page imports the same `PostFX`, `ZoneManager`,
`WeatherRig`, `Controller`, `Collider`, `LifeActivity` and audio engine the game does, and
builds zones the same way. Judging placement through an approximation of the pipeline is the
one thing the previous spec got unambiguously right: fog, groundcover, the moving sun, wind on
foliage and window light all change what a placement reads as, and none of them can be
approximated. So the editor is not a viewer with the game's look — it *is* the game, with the
authoring layer around it and a different entry point.

**Not a file — a second Vite entry.** A `file://` page cannot write to disk, cannot run module
workers (groundcover samples in one), and cannot use `import.meta.glob` (the builder registry).
The dev server is already running whenever anyone works on this project. So: `editor.html` at
the repo root beside `index.html`, `src/editor/main.ts` as its script, served at
`/editor.html` by `npm run dev`. It is never built into `docs/` — the game's build config lists
only `index.html` as an input.

**Not a second server — the one already there.** `vite.config.ts` already carries a plugin
with `configureServer` (the reload suppressor). The save endpoint is a second middleware in the
same file, on the same origin, with no CORS, no port, no extra process. A separate Node
server would duplicate the file watching Vite already does and put the editor and its save
path on two origins for no gain. Electron and Tauri are rejected for the same reason plus a
toolchain.

### What the game gives up to make this possible

`src/main.ts` is 1,370 lines of boot sequence with the dev panel inlined. The editor needs
that boot sequence too, and it must not be copied. So the first job is a refactor with no
behaviour change:

- `src/app/boot.ts` — `createApp({ canvas, overlay, world })` runs the ordered boot
  (`useAerialFog` before any material compiles, `patchArtMaterial` before `PostFX`, the
  loader steps, `ZoneManager`, `AudioEngine`, `Climate`, `WeatherRig`, the frame loop) and
  returns the handles. `index.html` calls it with `createTestWorld`; `editor.html` calls it
  with the same world plus every document zone and then wraps it.
- `src/app/devPanel.ts` — the lil-gui folders lifted out of `main.ts` as
  `installDevPanel(gui, app)`. The editor mounts the same folders under its own **Look** and
  **Climate** tabs, so every tuning knob that exists in the game exists in the editor with no
  second implementation.

Nothing about the game changes for the player.

### UI toolkit

- **lil-gui** for every form. It already does numbers, ranges, colours, dropdowns, booleans,
  buttons and folders, and a schema→controller mapping is trivial. The inspector, the zone
  panel, the environment panel and the look/climate tabs are lil-gui.
- **Plain DOM** for the four things lil-gui cannot do: the outliner (a tree with selection,
  drag reorder, visibility and lock), the palette (a searchable grid of thumbnails), the
  toolbar, and the status line. No framework.
- **`TransformControls`** from `three/examples/jsm` for the gizmo. It gives the XYZ arrows,
  rotation rings and scale handles, local/world space, per-axis constraint and snapping, and
  emits drag start/change/end. It moves an `Object3D`; the editor listens and writes the
  document. It is not extended — the collision-aware movement below is done in the drag
  handler, not inside the control.
- **Thumbnails** come from the galleries: a hidden render target draws each builder at seed 1
  once per session, on demand, cached in memory. No image files in the repo.

---

## 2. The zone document

One JSON file per zone in `projects/<id>/content/zones/<zone>.json`, plus one `content/world.json` per project
holding the portal graph. Documents are read by an interpreter in the game and written by the
editor. The editor is the way zones are authored; the file is its save format, and it is
not a goal that anyone opens it in a text editor. The writer is still deterministic (stable
key order, rounded numbers) so that git history stays small and a rebuild of an untouched
zone is byte-identical.

### Verbs, not meshes

The file stores what the authoring vocabulary *says*, never what the scene graph contains. A
prop is a builder name, a seed and a placement. A fence is a polyline. A scatter is a rule.
The world is derived on every build, and builders are seeded, so the derivation is repeatable
forever. Serialising placed instances back out of a scatter is rejected for the same reasons
as before: it turns six lines into four hundred, and it breaks the invariant that adding an
exclusion never reshuffles what was already placed.

### Header

```jsonc
{
  "id": "countryside-village",
  "name": "Countryside Village Demo",
  "group": "countryside",
  "place": { "at": [0, 0], "altitude": 0 },       // km, m — presence puts the zone under the weather
  "environment": { "base": "outdoor", "fogNear": 70, "fogFar": 320, "firstPersonReverb": 0.5,
                   "vibe": "village 1", "bearing": 0 },
  "spawn": { "at": [0, 19], "yaw": "south" },
  "floor": -20,
  "soundscape": { "bed": [ … ], "emitters": [ … ], "scatter": [ … ] },
  "terrain": { … },       // exterior
  "skirt": { … },         // exterior, optional
  "shell": { … },         // interior
  "regions": { … },
  "layers": [ … ]
}
```

- `environment.base` names a preset registered in code (`outdoor`, `indoor`, and any named
  constant a zone group shares — the cottage environment becomes `countryside-house`). The
  rest of the block is overrides spread onto it, which is exactly what every zone already does
  with `OUTDOOR_ENVIRONMENT`. Presets stay code; the choice and the deltas are data.
- `soundscape` is `SoundscapeSpec` verbatim. It is already JSON-shaped and discriminated on
  `model`, so a typo is a load error. The one addition: an emitter's `at` may be
  `{ "ref": "smithy-forge", "lift": 1.1 }` instead of a coordinate, and the interpreter
  measures the anchor off the built entry — this replaces the shared-constant convention
  (`SMITHY.forge`, `FORGE_FIRE_HEIGHT`) with the same guarantee that a sound cannot drift from
  its object.
- `terrain` is `TerrainOptions` verbatim: `size`, `resolution`, `landforms`, `detail`,
  `patches`, `cover`, `rockAngle`, `base`, `edgeFade`. The interpreter constructs the
  `Terrain` and derives `groundAt` and `surfaceAt` from it. No `terrain` block means a flat
  floor at 0 (`flatGround`, with its options under `floor`).
- `skirt` is `SkirtOptions` minus the `terrain` reference, which the interpreter supplies.
- `shell` is `InteriorOptions` verbatim to begin with (`width`, `depth`, `height`, `seed`,
  `style` naming `house` or `works`, `planks`, `beams`, `thickness`) and grows into the room
  graph in §2.7.
- `regions` holds named lists of `PatchShape[]` (`keepClear`, `keepClearSoft`, `outline`,
  `keepOut` — whatever the zone needs) so scatters, dressing and the vista ring can name a
  region instead of repeating circles. Drawn on the ground in the editor.
- `spawn.at` follows the placement rule below. `yaw` accepts radians or a compass word.

### Placement, shared by every placed entry

```jsonc
"at": [x, z]              // ground-settled: y from the terrain (or the shell floor)
"at": [x, y, z]           // absolute
"on": "table-3"           // stood on the top of the entry with that id, measured after it is built
"yaw": 0.8                // radians or compass word; the common case
"rotation": [p, y, r]     // YXZ about the foot, when pitch or roll is needed
"scale": 1.2              // the builder contract's uniform scale
"stretch": [1, 1.4, 1]    // per-axis, applied to the finished mesh; loud on purpose
```

`on` is how a candle stands on a seed-varied table: build the base, read its top, stand this
on it. Order within a layer is document order, so the referent exists when it is needed.

### Ids and refs

Every entry has an `id`, minted once by the editor as a short slug from the builder name and a
counter (`oak-14`, `table-3`), unique within the zone, never re-minted on edit. Ids are what
`on`, emitter anchors, portal `doorOf` ends and — later — quest scripts and the player-state
override layer point at. MASTER-SPEC's outstanding "override layer and stable ids" item is
answered by this field: anything the player changes about a zone is data keyed to an entry id
and replayed on rebuild. A hand-written document may leave `id` off entries nothing refers to;
the editor fills them in on first save.

### 2.1 Entry kinds

Each entry has exactly one kind key. The list is closed per release and open across releases;
adding a kind is one registration (§6). Every kind is stated with what it maps onto in code
today.

**Objects**

| kind | payload | maps to |
|---|---|---|
| `prop` | builder name, `seed`, placement, `options` (the builder's own `BuilderWith` extras: `text`, `sections`, `height`, `curtains`, `shadows`), `solid` override, `label`, `text` (a note id) | `builder.build(...)` + `place` / `markCollidable` / `markLabelled` / `markReadable` |
| `creature` | builder name (`figure`, `dog`, `bovine`, `ovine`, `porcine`, `poultry`), `seed`, placement, `roam`, `folk`, `face` | `figure.build({ seed, roam, folk, face })` placed like a prop; `Creature` reads home and yaw off the transform |
| `run` | builder name (`fence`, `stone-wall`), `seed`, `points: [[x,z],…]` | `laid` with corner chaining from returned endpoints; `run` seed shared along the line |
| `chain` | `seed`, `start`, `edges: [{ to, kind }]`, `close: "hedge"` | `layChain` + `layHedge`: piers at stone corners, posts at timber ones, hedge over the closing gap |
| `scatter` | builder name, `seed`, `count`, `within`, `from`, `maxSlope`, `minHeight`, `maxHeight`, `avoid` (a region name or circles), `inset`, `scale` | the exterior `scatter()`; rejected draws still consume their roll |
| `barrier` | `from`, `to`, `height` — or `at`, `size`, `yaw` | the invisible collision slab; never drawn, shown by the editor |
| `prefab` | prefab name, placement, `seed` | a composed set of entries saved under the project's `content/prefabs/`, expanded in place with ids prefixed by this entry's; seeds inside are offset by this entry's seed so two of the same prefab differ |
| `ground` | `shape: PatchShape[]`, `y` (or `at` + `size` for a plain slab), `material: GroundName`, `cover`, `thickness` | an authored ground mesh: a flat polygon or box with `userData.ground`, collidable, `underfoot` from the material table — a plateau, a bridge deck, a cellar floor, a pond bed |

Any `prop` or `ground` may also carry:

- `underfoot: SurfaceName` — overrides the footstep surface for that mesh's triangles (a
  plank walk over mire sounds like timber);
- `cover: CoverName` — grows groundcover on the mesh; the wall types (`ivy`, `rose`,
  `wisteria`) only exist this way;
- `ground: true` on a prop — treated as ground by `prepare()`: receives shadow, casts none,
  grows cover from its `cover` field.

**Environment**

| kind | payload | maps to |
|---|---|---|
| `water` | `at`, `width`, `depth`, `chop`, `flow: [x,z]`, `segment` | `waterPlane` — colour is global and not per body; the bed is terrain or a `prop` |
| `particles` | placement, `spec: ParticleSpec` minus geometry (`shape` is `billboard` or a named shape), `seed` | `createParticles(spec, seed)` positioned as a mesh |
| `fogVolume` | `shape`, `center`, `size`, `density`, `tint`, `softness`, `noiseScale`, `turbulence`, `drift` | `ZoneDefinition.fogVolumes[]`; 8 live at once |
| `glitch` / `horror` | `shape`, `center`, `size`, `strength`, `seed`, `tempo`, `weights`, `grounded` | `ZoneDefinition.glitches[]` / `horrors[]`; or, with `"on": id`, `markGlitched` / `markHaunted` on that entry |
| `sound` | `EmitterSpec` (model, options, `at` or `{ ref, lift }`, distances, reverb, importance) | `soundscape.emitters[]` — kept in the document's `soundscape` block, but the editor places and selects it like any entry |
| `soundScatter` | `ScatterSpec` (`sound`, `at`, `spread`, `every`, `rhythm`, `force`, `voices`) | `soundscape.scatter[]` |

**Vista**

| kind | payload | maps to |
|---|---|---|
| `vistaRing` | `seed`, `band`, `keepOut` (region name or `dilate: metres`), `place: VistaProp[]`, `scatter: VistaScatter[]`, `chunk` | `vistaRing({ skirt, … })`; merged chunks keep the range table, so props stay pickable |
| `dressing` | `seed`, `band`, `solidWithin`, `kinds: DressingKind[]` | `edgeDressing` |

Lights are not a kind. A light belongs to the prop that carries it (`streetlamp`, `candle`,
`lantern`, `fireplace`), so placing the prop places the light, and the census rules — at most
8 point and 2 spot lights per zone, flames vary intensity never visibility — are the prop's to
keep. The editor shows the running census in the status line and goes red past the top tier.

Doors are not a kind. The manager builds them from `world.json`.

Groundcover is not a kind. It grows from terrain paint (`terrain.cover`), from the material
table, and from `cover` on a prop that wants ivy up a wall — that last one is a `prop` field.

Sparkles, clutter tags, shadows, collision, light padding and matrix freezing are all
`prepare()`'s work and never appear in a document.

### 2.2 Weather, and what "set weather for a zone" means

Weather is global by decision (CLIMATE.md): it is the same day everywhere, sampled at a
world coordinate and a world time, and *a zone modifies what it samples and never overrides
it*. The document therefore carries the three things a zone really controls:

- `place` — where on the map it is, and how high, which is what decides whether it is raining
  here, and whether that rain is snow;
- `environment.wind` — the zone's multiplier over the weather's wind;
- `environment.sky` — indoors or out, which gates precipitation, wetness and the rain bed.

Everything else on the editor's **Weather** tab — holding a kind at an amount, pinning a
cloud deck, scrubbing the clock, freezing it — is the existing climate dev panel, and is
*session-only preview*. It is how you look at your zone in a storm at dusk; it is not saved,
and the tab says so in its title.

If a zone ever needs authored weather ("it is always foggy in the crypt"), that is a decision
to reverse CLIMATE.md, and the format is ready for it: an `environment.weather` block of
`{ kind: amount }` holds, evaluated as a floor over the sample. It is listed under §10 as your
call, and it is not built until you make it.

### 2.3 Layers and conditions

Entries live in named layers. A zone with no conditional content has one layer. `when`
grammar as before — `{ flag }`, `{ quest, stage: { min } }`, `not` / `all` / `any` — on a
layer or an entry, evaluated at build time against a `WorldState` that is a dev-panel stub
until the quest system exists. The convention stands: the moment two entries share a
condition it is a layer. The editor's layer list has a preview dropdown that forces `when`
results, and hide/isolate per layer, which is inspection state and not saved.

### 2.4 Portals — `world.json`

```jsonc
{ "portals": [
  { "id": "cottage-door",
    "a": { "zone": "countryside-village", "doorOf": "hut-1" },
    "b": { "zone": "countryside-cottage", "wall": "-z" },
    "seed": 8811, "material": "timber" }
] }
```

- `doorOf: id` stands the end at the door anchor of a placed building: build it, read
  `userData.doorways[0]`, apply `doorwayFront(…, DOOR_PROUD)` and the building's yaw. This is
  `houseDoorEnd` as data, and it is why `DOOR_PROUD` finally lives in one place.
- `wall: "-z"` puts the end in a shell wall at `-depth/2 + DOOR_PROUD`, facing in.
- `at` / `yaw` stays for freestanding portals (the arch), `arrival` stays as the rare override.

A portal is a fact about a pair of zones, so it lives in neither.

### 2.5 The interpreter

`src/world/document.ts`: `zoneFromDocument(doc): ZoneDefinition` and
`portalsFromManifest(manifest): PortalDefinition[]`. It resolves builder names through
`art/registry`'s `builderByName`, which already exists; content is Vite-only (§4) so the
registry's `import.meta.glob` is no longer a reason to keep a second import table.
The four private copies of `place`/`topOf`/`laid`/`scatter` collapse into
`src/world/placement.ts` as part of this.

Every mesh an entry produces is tagged `userData.entry = { zone, id }`; a merged chunk
carries a sorted range table with the same field per range. The game ignores it. The editor
is built on it.

The one change to the art kit contract: `BuilderWith` options exist only as types. Extended
builders gain a small runtime schema — `options: { text: 'string', sections: ['int', 1, 8] }`
— that the inspector renders from and the interpreter validates against. Builders without
extras need nothing.

### 2.6 Terrain: landforms, sculpt and paint

Terrain today is `heightAt = Σ landforms`, authored and never noise, and the landform list is
the thing the editor was always going to drag handles on. Sculpting does not fit that: a
brush stroke is not a rule with a seed, and a hundred of them replayed on every build is a
recording, not a derivation. So the terrain block gains one raster layer
each for height and paint, and the rule for the whole block becomes: **shapes for what is
deliberate, rasters for what is sculpted, and the two compose.**

```jsonc
"terrain": {
  "size": 114, "resolution": 3, "base": "turf",
  "landforms": [ … ],                        // large forms, as now
  "sculpt":  { "file": "countryside-village.height.r32", "resolution": 1 },
  "paint":   { "file": "countryside-village.paint.u8",   "resolution": 1 },
  "coverPaint": { "file": "countryside-village.cover.u8", "resolution": 1 },
  "patches": [ … ], "cover": [ … ],          // shapes, as now
  "detail": [ … ], "edgeFade": { … }
}
```

- **Height** is `landforms + sculpt`, sampled bilinearly from a float32 grid centred on the
  origin at its own resolution (which may be finer than the mesh's, and the mesh's own
  `detail` rings decide what is visible). Landforms stay the way to say "a hill here, 18 m
  across"; the brush is how you raise the bank a little where the path meets the lane.
- **Material** is `base → paint raster → patches`, later wins; a cell of 0 in the raster is
  unpainted. Shapes still win, because a path is a decision and paint is a gesture. The
  slope-beats-paint rule (`rockAngle`) is unchanged.
- **Cover** composes the same way with the same three sources.
- Rasters are **sidecar binary files** beside the document, raw little-endian, named by the
  document, loaded through a static `?url` import in the content index. A 114 m zone at 1 m
  is 13 k floats; keeping that out of the JSON keeps the parse cheap and the git objects
  small, and nothing else turns on it.
- A zone with no raster files has no rasters. The three homes never get them.

Sculpting is exterior-only, on the heightfield. Interiors have a shell floor; where an
interior wants shaped ground (a cave floor) that is the `roughen` style on the room graph or
a `ground` entry, not a second heightfield.

Ground that is not the heightfield — a plateau slab, a bridge deck, a cellar floor, a pond
bed under a `water` plane — is a `ground` entry (§2.1). It is a mesh with `userData.ground`,
collidable, footsteps from its material, and it grows cover if asked. It is not sculptable;
it is placed and shaped like any other entry.

### 2.7 Interior shells beyond the box

`buildInterior` is one sealed rectangular room. The shell grammar grows into a room graph —
rooms with their own floor level, height and style; joins (`doorway`, `arch`, `open`,
`stair`) cut where two rooms share a wall; wall features (`window`, `hearth`) — built by one
builder that unions rooms, cuts joins and stays watertight by construction. One room with no
joins is today's box, so the simple case never pays for the general one. A `roughen` style
displaces the inner surface into cave or crypt without touching topology. Kit-piece modular
building is rejected: it makes sealing an authoring problem and puts hairline seams exactly
where flat shading cannot hide them. This is a builder and lands on its own schedule; the
editor gets forms for it when it exists.

---

## 3. The editor

### 3.1 Modes

**Fly.** A free camera with six-axis movement, free look on right-drag or pointer lock, speed
on scroll, shift to sprint, and no capsule. Under the hood it is the game `Controller` with
`noclip` on, so its position is the same kind of number the player's is. Vista parallax is
frozen while flying (`freezeVista`), or the band slides under the prop you are placing.
Session-only state: camera position, speed, bookmarks.

**Play.** One key drops the capsule at the camera's feet — raycast down against the collider,
settle with the usual clearance — with `noclip` off, life awake, audio running, weather live.
You walk, jump, open doors, read notes, cross into neighbouring zones. The same key returns to
Fly with the camera at the player's eye, and if you crossed zones the editor follows and
opens the zone you ended in. Nothing about Play is special-cased: it is the game loop with the
editor's panels still on screen.

**Top.** An orthographic view straight down, with the same tools. It is where paths, patches,
regions, runs and landforms are drawn, because they are all XZ shapes and a perspective view
lies about them. Toggle key; the last perspective camera is restored on leaving.

### 3.2 Selection

Click picks by raycast against the zone root; the hit's `userData.entry` (or its chunk's range
table by `faceIndex`) names the entry. Shift-click extends, ctrl-click toggles, drag on empty
ground box-selects in Top view. The outliner mirrors selection both ways. Escape clears.

Selected entries draw an outline through the existing effect mask layer; hovered entries draw
a fainter one. Non-mesh entries — sounds, volumes, scatter rules, regions, spawn, portal ends —
get editor-only gizmo meshes (spheres, boxes, rings, flags) that exist only in the editor
scene and are picked the same way. They are on a layer PostFX never sees, so they do not
bloom or fog.

### 3.3 Transform tools

Move, rotate, scale, on `W` `E` `R` as everywhere. `TransformControls` shows the handles;
`X` `Y` `Z` constrain to an axis, `L` toggles local/world space, holding `ctrl` snaps
(0.1 m, 5°, 0.05), and the snap values are on the toolbar.

Move has three collision behaviours, on a toolbar toggle and a key:

- **Free.** The gizmo moves the object; things may interpenetrate. The default for interiors,
  where a candle is *meant* to sit inside a table's bounding box.
- **Contact.** The object's collision extent (a box from its geometry, or the builder's
  `radius` as a cylinder for foliage) is swept along the drag against the zone collider, with
  the selection's own triangles excluded, and stops at the first contact plus 2 mm. Dragging a
  crate into a wall stops it against the wall; dragging it up out of the floor is free. This is
  the "bump objects up to each other" toggle.
- **Ground.** Y is not yours: the object rides the terrain (or the shell floor) under it and
  the gizmo shows only the two horizontal arrows. The default for exterior props, and it is
  what writes a two-number `at`.

Drop (`End`) settles the selection onto whatever is beneath it by collider raycast. If the
hit belongs to an entry, the document gets `on: that-id` (the editor mints the id if the base
has none); if it is terrain, a two-number `at`; otherwise absolute. Drop is what stacks a
candle on a table without typing anything.

Rotate defaults to yaw about the foot. Pitch and roll are on the gizmo's other rings and
write `rotation`. Scale writes the uniform `scale`; per-axis stretch is a separate tool (`T`)
so it stays loud in the document.

Duplicate (`ctrl-D`) copies the selection offset by one radius and re-rolls the copy's seed
only — the original keeps its seed, always. Copy, paste and paste-in-place work across zones;
pasted entries get fresh ids and keep their seeds.

Snap to entry (`S`, then pick): moves the selection so its origin sits on the picked entry's,
optionally matching yaw; with an axis held it instead slides along that axis until the two
collision extents touch.

During a drag the built mesh is moved directly for feedback. On drag end the document is
mutated and the rebuild loop runs (§3.10).

### 3.4 Placing things

The palette lists every builder by `CATEGORY_ORDER`, searchable, with thumbnails, plus tabs
for the non-builder kinds: creatures, sounds (every soundscape model, and one-shot scatters),
volumes (fog, glitch, horror), water, particles, barriers, and vista. Pick something, click
the ground, it stands there with a fresh seed that is kept forever. Click-drag before release
sets yaw. Holding the palette item and clicking repeatedly places several.

Creatures place like props and show their `roam` radius as a ring while selected.

Sounds place at the click point lifted 1 m, and show `refDistance` and `maxDistance` as two
spheres while selected, with `every`/`spread` as a box for one-shot scatters. Mute-others
(`M`) solos the selected emitter through `Soundscape.setSolo`.

Volumes place as a unit sphere or box and are sized with the scale tool.

Water places as a plane at the click height; `width`/`depth` are the scale handles.

### 3.5 Shapes on the ground

Runs, chains, paths, fields, blots, regions, landform footprints and the vista keep-out are all
XZ shapes, and they share one tool set:

- **Polyline** (`P` in Top view): click vertices, enter to finish, click a segment to insert a
  vertex, drag a vertex to move it, delete to remove. Used for `run.points`, `chain.edges`,
  `path.through`, `scarp`/`channel`, and the level outline.
- **Circle**: drag centre, scroll radius. `blot`, `hill`, `basin`, terrace, region circles,
  scatter `within`.
- **Rectangle**: drag corners. `field`, the box forms of barriers and volumes.

A chain edge's kind (`wall`/`fence`) is toggled per edge in the inspector; the pier/post rule
at corners is the builder's and is not exposed.

Landforms rebuild the terrain live while a handle is dragged — the heightfield alone is quick —
and the groundcover regrows on release, because sampling is what costs.

### 3.6 Terraforming

A brush tool set (`B`), usable in Fly and Top, working on the exterior heightfield. Every
brush has radius (scroll), strength, and a falloff curve (`smooth`, `linear`, `flat`),
shown as a ring projected onto the ground under the cursor with its falloff as a second ring.
Strokes write the sculpt raster; the landforms underneath are untouched, so a hill can still
be dragged after its flank has been shaped.

Brushes, each a per-cell operation on the raster inside the ring, weighted by falloff:

- **Raise / lower** — add ±strength per second. Shift inverts.
- **Smooth** — move each cell toward the mean of its neighbours.
- **Flatten** — move toward the height under the cursor at stroke start (ctrl: toward a typed
  level). What makes a building plot.
- **Set** — write the level, no blending. Terracing by hand.
- **Ramp** — two clicks; a linear gradient between their heights along the segment, width
  from the brush. Paths up a bank.
- **Roughen** — hand-placed noise at the brush's own seed and a typed scale. It is still
  authored: it goes where you put it and nowhere else.
- **Erase** — return cells to `landforms` only.

During a stroke the terrain mesh's vertices are re-evaluated from `heightAt` every frame
(they lie on a known grid, so it is a pass over a few thousand vertices, normals recomputed)
and the groundcover is hidden. On mouse-up the raster is committed as one undo step, the
collider is rebuilt, and cover regrows debounced. Props on the ground ride it: every entry
with a two-number `at` is re-settled after a stroke, which is the same rule as everywhere
else and is why ground-settled placement is the default outdoors.

**Paint** uses the same brushes with a material or cover picked from a swatch row (the
`GROUND` and `COVER_TYPES` tables, the same names the patches use). Two brushes: **paint**
and **erase**. Paint strokes write the paint or cover raster; shapes are drawn with the shape
tools and stay shapes. A cover swatch also offers `edge: hard`, which for a stroke means no
feather at its border.

The raster's own resolution is set on the terrain panel and can be changed; existing data is
resampled once, and the editor says so. A new exterior starts with no rasters and gets them
on the first stroke.

A new exterior creates a `terrain` block (size, resolution, base material) with a flat floor
and no rasters, and gets them on the first stroke. Landforms and the brush are both always
available; a landform keeps a handle you can drag later, a stroke is just ground.

### 3.7 The inspector

Every field of the selected entry, as controls generated from the kind's schema: placement,
seed (a re-roll button and a number field — changing a selected entry's seed is intentional
churn), builder options from the runtime schema, `label`, `text` as a searchable dropdown
over the project's `content/notes`, `solid`, layer, `when`. Multi-selection shows the shared fields and
applies edits to all.

Scatter rules show their instances highlighted while selected, and every knob rebuilds live.

The zone panel (no selection) is the header: name, group, `place`, spawn, floor, and the whole
environment block as controls — every field of `ZoneEnvironment`, with `base` as a dropdown
and only the overrides written. These are the same knobs the dev panel's `light`/`fog`/`audio`
folders expose, and the difference is that these ones save.

The terrain panel is `TerrainOptions` as forms: size, resolution, base, landform list with
add/remove/reorder, patch and cover shape lists, detail rings, edge fade, and the raster
block — resolution, which rasters exist, a clear button for each. A `ground` entry's
inspector has its shape, height, material, cover and thickness; a prop's has `underfoot`,
`cover` and `ground` under an *as ground* fold. The skirt, vista ring and dressing have
theirs. The shell panel is `InteriorOptions` now and the room graph later.

The soundscape's beds — non-positional — sit on the zone panel too.

### 3.8 The outliner

A tree: zone → layers → entries, named by id, with kind icons. Click selects, double-click
frames the camera on it, drag reorders (which matters — document order is build order and
`on` depends on it), eye toggles visibility, lock prevents picking. Visibility and lock are
session-only. A filter box narrows by kind or name.

### 3.9 Portals

Two-click wiring with the portal tool. Door sites highlight on hover:

- a placed building with doorways — snaps to the doorway's foot, `DOOR_PROUD` out, facing
  outward; writes `doorOf: id`;
- a shell wall — snaps to the wall's centre at floor level, facing in; writes `wall: "-z"`;
- ground or a barrier — a freestanding door; writes `at`/`yaw`, yaw from the click-drag.

The first click starts a *pending portal*, which survives switching zones. The second click,
in any zone, writes one entry to `world.json` with a seed rolled once and kept; both zones
rebuild, and the door meshes appear because the manager builds them from the graph. The
portal's inspector has material (`timber`/`iron`/`plank`), the optional label, and the rare
explicit `arrival`.

Two shortcuts on the pending state: **to a new interior** creates an interior zone from the
template, opens it and pre-selects its `-z` wall, since a door on a house wanting a room
behind it is the common case; and the zone tab expands each zone into its door sites
(doorway-bearing buildings, shell walls) so the second end can be picked from a list without
leaving the first zone.

While a portal end is selected the derived arrival marker is drawn as a capsule standing
where you would land, so a door whose arrival is in a hedge is visible before anyone walks
through it.

### 3.10 The rebuild loop

Every commit is document → world, never the other way.

1. The document is mutated and a snapshot pushed on the undo stack.
2. If the change touched exactly one single-mesh entry (prop, creature, volume, sound,
   barrier, water, particles), that entry's built object is disposed and rebuilt alone, the
   collider for the zone is rebuilt, and the activities that collected from it (`LifeActivity`,
   `LightActivity`, `WindowLight`, `ClothActivity`, glitch, horror) re-collect for the zone.
3. Anything else — a scatter knob, a run point, terrain, the shell, a layer condition — rebuilds
   the whole zone through the eviction path: `dispose`, `collider.invalidate`, clear `doored`
   and the per-zone maps, `unbind` the portal sides, release every activity, drop the
   soundscape if the soundscape changed, then `prepare` and re-add. `ensureLoaded` is awaited
   first as it must be. Full rebuilds are debounced (~250 ms after the last change) and show a
   spinner in the status line rather than the game's loading screen; the camera does not move.
4. Water, particles and glass presence are re-observed after any rebuild, since they are
   observed rather than declared.

Materials are never disposed — they are shared across zones.

Undo and redo are the snapshot stack, which is cheap because a document is small. The stack
is session-only.

### 3.11 Saving

Autosave: every commit schedules a write ~1 s later; a dirty dot on the zone tab shows the
gap. `ctrl-S` writes now. There is no "revert" beyond undo and git.

The middleware, in `vite.config.ts` beside the reload suppressor:

- `GET  /__editor/zones` — ids and mtimes.
- `GET  /__editor/zones/:id`, `GET /__editor/zones/:id/:layer`, `GET /__editor/world`.
- `PUT  /__editor/zones/:id`, `PUT /__editor/zones/:id/:layer` (raw bytes), `PUT
  /__editor/world` — the request carries the mtime the file was loaded at. The server writes
  to a temp file and renames; if the file on disk is newer than the client's mtime (a second
  editor tab, a git checkout), it refuses with 409 and the client offers reload-theirs or
  overwrite.
- `POST /__editor/zones/:id/rename` — files and `world.json` together.
- `DELETE /__editor/zones/:id` — document, sidecars, and its portals.

Writes land under `projects/`, which is inside Vite's watch root. The existing suppressor
already turns a change into a banner instead of a reload, and the middleware marks its own
writes so the banner does not count them. Only `serve` registers any of this; the built game
has no such routes.

### 3.12 Zones

The zone tab lists every registered zone — document zones editable, code zones (galleries,
showcases, the proving ground, the rigs) openable in Fly and Play but with nothing to select.
New zone offers two templates, exterior (flat floor, outdoor environment, a spawn) and
interior (a box shell, indoor environment, a spawn), and asks for id, name and group.
Duplicate copies a document under a new id. Delete asks once.

Switching zones goes through `ZoneManager.travel` with the loader hidden, and the camera is
placed at the spawn looking along its yaw.

### 3.13 Visualisers

All session-only, all on the View menu, most on by default:

- barriers (`showBarriers`, already built), spawn flag, portal ends and their arrival
  capsules, sound radii, volume shells, creature roam rings, regions as ground rings, the
  level outline and vista keep-out, `apparent` labels on vista props, keep-clear circles as
  dashed rings, a 1 m ground grid in Top view, the light census, and the triangle count from
  the collider.
- a placement ruler (`ctrl`-drag between two points, metres in the status line).
- camera bookmarks (`ctrl-1..9` to set, `1..9` to jump), session-only.

### 3.14 Borrowed from the Creation Kit

The design already mirrors the Kit's shape — base object and reference are builder and
entry, Cell View is the outliner, the Object Window is the palette, enable-parent is a
layer with `when`, markers are entries. Beyond that, the practices worth taking:

- **Pick in view.** Every ref-valued field — `on`, `doorOf`, an emitter's anchor, a patrol
  point, a prefab origin — has a crosshair button beside its dropdown that picks the entry by
  clicking it.
- **Prefabs.** Select entries, pick one as the origin, save as a prefab; it lands in the
  palette and places as one entry. Editing a prefab is opening it as its own small zone.
- **Favourites and randomised placement.** A pinned list in the palette, with per-item yaw
  and scale ranges rolled from each placed entry's seed. A **prop brush** drags favourites
  out at a spacing, one kept seed per entry — manual scatter, for where a rule would be wrong.
- **Orbit.** Shift-drag orbits the camera round the selection; `.` frames it. Fly is for
  placing, orbit is for looking at one thing.
- **Isolate by kind.** A view filter that shows only sounds, only volumes, only barriers, or
  only markers, the way hiding every reference shows the room markers.
- **Open in gallery.** From the inspector, jump to the builder's gallery row with the
  selection's seed marked — the Kit's *Edit Base*.
- **Translucent** as the middle state of hide, so a wall can be seen through while placing
  behind it.

Left behind on purpose: room bounds, portals and occlusion planes (residency is by door);
navmesh (creatures roam by radius with obstacle push-out, and if pathing is ever needed it is
generated from the collider, never drawn); persistence flags, ownership and plugin layering.

### 3.15 Keys, provisional

`W E R T` tools · `B` brush · `Q` select · `X Y Z` axis · `L` space · `G` ground / `C` contact / `F` free ·
`End` drop · `Tab` play · `Home` top view · `ctrl-D` duplicate · `Del` delete · `ctrl-Z` /
`ctrl-shift-Z` · `ctrl-S` · `H` hide selection / `alt-H` unhide all · `.` frame selection ·
`M` solo sound · `S` snap to entry · `ctrl-C`/`ctrl-V`/`ctrl-shift-V` copy, paste, paste in place.
The fly camera uses the game's movement keys; shift-drag orbits.

---

## 4. Loading documents in the game

the project's content index finds every document with `import.meta.glob('./zones/*.json',
{ eager: true })`, and every sidecar with a `?url` glob, and exports the zones and the portal
graph. Dropping a file into a project's `content/zones/` is all it takes for a zone to exist in the
game; nothing is registered by hand, which is what lets the editor create a zone without
anyone touching code. `boot.ts` concatenates document zones and portals with
`createTestWorld`'s.

This makes content Vite-only, like the builder registry already is. The headless esbuild
path was only ever for the check harnesses, which are not run.

Documents large enough to want code-splitting get `load` in the interpreter — the glob is
lazy for their bodies and eager for a small header — which is the split
`countryside-homes.ts` already makes by hand. Whether a zone is split is a flag on the
document, set from the zone panel.

The registry cannot tell a document zone from a code zone and does not need to.

### Storage layout

```
projects/<id>/content/
  world.json                          the portal graph, every door, both ends
  zones/
    <id>.json                         one document per zone, named by its id
    <id>.height.r32                   sculpt raster, only if the zone has one
    <id>.paint.u8                     material paint raster
    <id>.cover.u8                     cover paint raster
```

The id is the file name. Renaming a zone in the editor renames the files and rewrites every
reference in `world.json`. Deleting removes the document, its sidecars, and every portal that
names it.

### The schism

Today every traversable zone is code under `src/debug/`. The migration set is the content-like
ones: the countryside village, its three homes, the villager hut and the factory, and the demo
hall that links them. They become documents, their `build` functions are deleted once the
render matches, and from then on they are edited in the editor. Galleries, prop halls,
showcases, the proving ground and the eviction chains stay code — they are fixtures derived
from the builder list or rigs that argue with the systems they exercise, and a document of a
gallery would be a stale copy of the registry. They open in the editor as view-only.

Whether the proving-ground hub joins the migration set is your call (§10); it is the one zone
that is half rig, half place.

---

## 5. Engine and projects

The repo is one engine and many projects, and the editor is the thing that starts a project.

```
hswow.net/
  src/                    the engine: art, audio, engine, world, life, player, ui, app, editor
  editor.html
  index.html              the game page; which project it runs is decided at build time
  projects/
    debug/                everything under src/debug today, plus its content
      project.json
      content/            zones/, world.json, notes, npcs, …, sidecar rasters
      code/               zones that stay code (galleries, showcases, rigs), presets, extra builders
      public/             copied verbatim into the build: CNAME, favicon
    <game>/
      project.json
      content/
      public/
  docs/                   ignored by git; one clone of a site repo per project
    debug/
    <game>/
```

**A project is a folder.** `project.json` holds the id, the title, the entry zone, the zone
group order, and whether the dev panel and `?debug` exist in its build. `content/` is the
editor's territory (§4's layout, one level down). `code/` is optional and exports
`ZoneDefinition`s, environment presets and builders the engine registers alongside its own;
the debug project uses it for everything that stays code, a new game may never need it.
`public/` replaces the repo-level `public/`, so each site carries its own `CNAME`.

**Direction of dependency.** Projects import the engine (`@engine/*`); the engine never
imports a project. The three places it does today — `Input.ts` reading `debug/flags`,
`PostFX.ts` reading `debug/presets`, `Creature.ts` reading `debug/VoiceLabel` — are engine
dev utilities that happen to live in the debug folder, and they move to `src/dev/` in the
same commit that creates `projects/debug/`.

**How a build knows its project.** A Vite plugin exposes `virtual:project`. In `serve` it
lists every folder under `projects/` and the page picks one with `?project=<id>` (the editor
has a project switcher that does the same); in `build` it contains exactly the one named by
`vite build --mode <id>`, and `outDir` is `docs/<id>`, `publicDir` is that project's
`public/`, and the builder registry's glob includes that project's `code/builders/`. Content
globs are generated into the virtual module with the concrete path, so nothing in the engine
spells a project name. `base` stays `./`.

**Where the built sites live.** `docs/` is git-ignored in the engine repo. Each
`docs/<id>` is a clone of that project's own site repo, made once by hand
(`git clone <site-repo> docs/<id>`), and `npm run deploy -- <id>` builds into it, commits
and pushes. The engine repo therefore stops carrying any built output at all — it only ever
did because Pages needed it — and each game is hosted from its own repo with its own Pages
settings, domain and history. Submodules were considered and rejected: they would make the
engine repo record every site commit, which is noise, and add the submodule workflow for no
information anyone needs.

**Starting a project.** The editor's project switcher has *New*: id and title, and it writes
`project.json`, an empty `content/` with one exterior zone as the entry, and a `public/` with
a placeholder favicon. The middleware routes gain a project segment
(`/__editor/projects/:project/zones/:id` …) and `docs/<id>` is left for the one-time clone.

**What this does to the existing site.** hswow.net is served from this repo's `docs/`
today. After the split it is served from whichever project's site repo carries the `CNAME` —
the debug project is the natural first owner, since it is what is there now. The engine
repo's Pages setting is turned off.

The `check:*` scripts and `tools/` are debug-project concerns and move with it; nothing in
the engine build depends on them.

---

## 6. Extending it

The editor is built so that a new kind of thing costs one file:

```ts
registerEntryKind({
  kind: 'item',
  schema: { …fields the inspector renders… },
  build(entry, ctx): THREE.Object3D | null,    // ctx: terrain, shell, rng, resolve(id)
  gizmo?(entry): THREE.Object3D,                // for kinds with no mesh of their own
  palette?: { tab: 'objects', list: () => names },
});
```

The interpreter, the inspector, the palette, the outliner icons and the pick path all read
this table. Nothing else in the editor knows the list of kinds.

What is expected to arrive, and where it lands:

- **Items and inventory** — an `item` kind, placed like a prop and pointing at
  the project's `content/items/` by id. Picked-up state is the override layer keyed by entry id, not a
  document change.
- **NPC identity** — `creature` gains `npc: "miller"` pointing at the project's `content/npcs/`; patrol
  paths are a polyline on the entry, drawn with the shape tools.
- **Trigger volumes** — a `trigger` kind with a shape and an action list, using the volume
  gizmo. There is no trigger system yet; the kind waits for it.
- **Player saves** — untouched. Autosave is player state in localStorage and never writes a
  document.
- **Photo mode, if ever** — Fly is already the game's controller with `noclip`; whether the
  player gets it is fiction, not engineering.
- **Project tuning** — the engine tables that are records in code today: environment
  presets, climate settings and weather kind rows, ground materials and cover types, player
  tuning, vibes, interior styles, flame and lightning specs. `project.json` grows `climate`
  and `player`; `content/presets.json` holds the rest; a Tuning tab edits them and saves. The
  weather kinds' `season`/`daily` callbacks become named curves when this lands.
- **Notes and text** — a library pane over the project's `content/notes` (and, later,
  `content/npcs`): list, edit body, show where each is bound. A second document type on the
  same middleware; the inspector's `text` dropdown already reads it.
- **Shaped water** — `waterPlane` takes callbacks for `chop` and `flow`, which data cannot
  carry, so the `water` entry is a rectangle with constants. A polygon outline and named
  swell curves are an engine change for when a pond needs a shape.

---

## 7. Shape of the work

1. **Boot refactor.** `src/app/boot.ts` and `devPanel.ts` extracted from `main.ts`; the game
   is unchanged. `editor.html` and `src/editor/main.ts` boot the same app and show an empty
   panel. Fly and Play work against the existing code zones. This alone is already a better
   way to look at a zone than the game is.
2. **Projects.** `src/debug/` becomes `projects/debug/code/`, the three engine→debug imports
   move to `src/dev/`, `virtual:project`, `--mode` builds into `docs/<id>`, `docs/` ignored,
   the deploy script, the debug site's own repo cloned into `docs/debug` and hswow.net
   pointed at it. The game is still unchanged for the player.
3. **Format and interpreter.** Types, `zoneFromDocument`, `portalsFromManifest`,
   `placement.ts`, `userData.entry` tagging, the runtime option
   schema on extended builders. Content directory wired into boot. A one-room test document
   proves the loop.
4. **Migrate the three homes.** Small, interior-only, exercises shell, props, `on`,
   creatures, `wall` portal ends.
5. **Editor: select, transform, save.** Picking, gizmo, the three move behaviours, drop,
   snap to entry, inspector for `prop`/`creature` with pick-in-view on ref fields, orbit
   camera, undo, the middleware, autosave. Retires "nudge one prop at a time".
6. **Editor: place.** Palette with favourites and randomised placement, prop brush,
   thumbnails, open-in-gallery, duplicate, copy/paste across zones, delete, outliner,
   prefabs, zone panel with the environment block, new/duplicate/delete zone.
7. **Migrate the village.** Terrain, skirt, runs, chains, scatters, regions, `doorOf`,
   anchored emitters, vista ring, dressing, barriers. Everything the grammar claims, proven on
   the only real exterior. Then the hut, the factory and the demo hall.
8. **Editor: shapes and everything else.** Top view, polyline/circle/rectangle tools,
   landform handles, terrain and skirt panels, sounds, volumes, water, particles, vista and
   dressing panels, `ground` entries, portal wiring, visualisers, isolate-by-kind view.
9. **Terraforming.** The raster layers in `Terrain` (height, paint, cover), sidecar loading,
   the brush set, live vertex re-evaluation during strokes, paint swatches. Independent of 8
   apart from the terrain panel.
10. **Layers, `when`, and the state stub.**
11. **The room-graph shell kit**, on its own schedule, with forms following.
12. **New kinds as their systems arrive.**

Steps 1–6 are a usable editor. Nothing in 7–12 blocks using it.

---

## 8. Ways to get it wrong

- **Serialising the scene back.** The document is upstream of the world, one direction. There
  is no "export current scene".
- **Re-rolling seeds.** Moving keeps the seed; duplicating re-rolls only the copy; nothing
  reshuffles what it did not touch.
- **A second renderer.** The moment the editor draws anything the game would draw differently,
  its judgement is worthless. Editor-only gizmos live on a layer the pipeline ignores; the
  world is drawn by the pipeline or not at all.
- **Growing lil-gui into an editor UI.** It is a form library. The tree, the palette and the
  toolbar are DOM, and the line stays where it is.
- **Editor-only fields.** If a control changes what you see, it wrote a document field. If it
  did not, it is on the View menu and marked session-only. There is no third category.
- **Per-zone weather by the back door.** A preview hold is a preview hold. Saved weather is a
  decision (§10), not a convenience.
- **Writing checks for it.** No schema validator script, no geometry probe, no migration
  counter. Open the zone and look.

---

## 9. Cost, stated once

The boot refactor is the only large piece of plumbing and it is owed anyway. The interpreter
is a few hundred lines because every option record it consumes is already data. The
middleware is under a hundred. The editor proper is a few thousand lines of DOM and glue over
`TransformControls` and lil-gui. The migrations are the slow part, and they are slow for the
right reason — every coordinate in `countryside-village.ts` gets looked at as it moves.

---

## 10. Decisions that are yours

- **Names throughout** — the page name, `projects/` layout, every key, kind and slug, id
  slug style, key bindings.
- **Saved per-zone weather.** The format can hold it; CLIMATE.md says not to. Yes or no.
- **The migration set.** The six content zones is the recommendation; the proving-ground hub
  is the borderline case.
- **The shell kit.** Room graph is recommended and kit pieces are rejected above; worth an
  explicit yes because it forecloses free-form building.
- **Move default.** Ground for exteriors, Free for interiors, is the recommendation; Contact as
  the default everywhere is defensible.
- **Rasters as sidecars or in the JSON.** Sidecars are recommended for size; one file per
  zone is simpler to move around.
- **Paint order.** Shapes over paint is recommended (a path is a decision); the reverse is
  what most terrain editors do.
- **Prefab granularity** — whether a prefab may contain prefabs, and where the line sits
  between a prefab and a builder that should exist instead.
- **Which project owns hswow.net** after the split — debug is the recommendation.
- **Site repo naming and whether `docs/` stays the clone location** or moves out of the
  engine tree entirely.
- **Whether the editor's dev-panel tabs replace `?debug` in the game** once they exist in two
  places, or the game keeps its own.
