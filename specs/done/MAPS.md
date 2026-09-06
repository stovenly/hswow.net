# Maps — spec

**Built.** Two windows on one key: a **world map** of how the outdoor
zones join up on the left, and a **local map** of the zone you are standing in
on the right. Neither is a minimap; both are things you stop to open. Names of fields and files below are
working labels, not decisions.

**The short version.** The local map is a bird's-eye view of the active zone:
the zone itself rendered from straight above and stylised, with the playable
outline as a hard edge, everything outside it scratched out, every door
marked, and a fog of war that remembers where you have walked. The world
map is a flat map in the manner of a paperback's endpaper, generated from the
zone graph and nothing else: every outdoor zone is a circle labelled with its
name, every portal between two of them is a road, and the country around each
circle — trees, hills, waves, chimneys — is drawn from the zone's vibe. The
layout is worked out deterministically from the graph, so the same content
always gives the same map. Nothing new has to be authored.

---

## What exists

- **The outline.** `skirt.outline` (or `regions.outline`) is the level's shape
  as a union of `PatchShape`s; `document.outlineOf` turns it into a closed
  polygon and `vista.outlineDistance` gives a signed distance to it. The `rim`
  landform lifts the ground past the slope limit at `inset` metres inside that
  outline. There is no invisible wall; the rim *is* the boundary. A zone with
  no outline is its terrain's square.
- **Portals.** `PortalGraph.in(zone)` lists every side in a zone with its
  world position and its `target.zone`. `ZoneDefinition.name` is the display
  name of the far side.
- **Outdoor and indoor.** `environment.sky` is true for a zone under the
  open sky and false for a shell. `ZoneDefinition.place` is the climate's map
  coordinate; only `countryside-village` declares one, and the world map does
  not depend on it.
- **The vibe.** `environment.vibe` is a `VibeChoice`: a `VibeName` or a
  `{ music, ambience }` pairing. Twenty-five names in `audio/vibes.ts`.
- **Offscreen renders of the real thing.** `editor/thumbnails.ts` and
  `ui/ItemIcons.ts` both draw builders through an orthographic camera into a
  small target with the game's own renderer.
- **Overlays.** `Reading`, `InventoryUI` and the options panel each own a
  `body.is-*` class, release the pointer lock on the way in, and take it back
  on the way out through `input.capture()`. Tab is the inventory; `M` and `N`
  are unbound in play.
- **Saving.** `SaveData` is version 1 with optional fields added as they
  arrive (`state?`). `WorldFlags` holds what is judged by conditions and is
  not the place for a raster.

---

## The local map

### What it shows

Four things, and nothing else:

1. **The playable area** — the outline inset by the rim, as one hard line.
   Outside it the map is *scratched out*: a diagonal hatch over flat ground
   with no detail drawn under it. Vista geometry never appears. This is the
   same edge the vista band is written against, so the map and the world
   cannot disagree about where the level ends.
2. **The zone from above** — the real render, stylised. Roofs, paths,
   fields, water, tree crowns and walls are all there because they are all in
   the picture; nothing is redrawn as a symbol.
3. **Doors** — one marker per portal side in the zone, at its world position.
   Labelled with the far zone's `name`.
4. **Where you have been** — the fog of war, below.

Not drawn: people, animals, items, the player's own footprints. The player is
a single marker with a heading wedge.

### Where the picture comes from

**A photograph, stylised.** On entering a zone the map renders it once from
straight above through an orthographic camera: colour in one pass, packed depth
in a second over the same view, both read back. Every surface is drawn with an
unlit stand-in carrying its own vertex colours, which is what makes the picture
independent of the hour and costs one program rather than a recompile of the
whole kit against a second light census.

The posterising and the lines are done once, on those two buffers, and the
result is kept as a canvas — so a window redraw is a `drawImage`, and the
picture is the same picture a pass over the pair would have produced. The
playable line, the hatch, the fog, the doors and the player are drawn over it
every redraw, because those are the parts that change.

The bake is lit flat — no sun, no shadow — so the map does not change with
the hour and a roof is the same tone at dusk as at noon. It is one render per
zone entry; the stylise pass runs only while the map is open.

Why a render and not a drawing built from the document: the document knows
landforms and patches, but not what a builder made. A drawn map needs a
symbol for every kind of entry that should show, which is a second
description of every builder that will drift from the first. The render sees
what the world is, which is the rule everywhere else here — the render is the
ground truth.

Three things the bake has to get right:

- **Interiors are cut below the ceiling.** From above, a sealed shell is its
  ceiling. The camera's near plane sits a hand's width under it, so the
  picture is the floor, the furniture and the wall tops. Outdoors nothing is
  cut: a bird sees roofs and crowns, and so does the map.
- **Living things are left out.** Creatures carry `userData.life`; the bake
  skips them, and so does groundcover, whose blades are placed by per-instance
  attributes a stand-in material does not carry.
- **Nothing is measured off the built world.** How high the camera stands and
  how far down it sees are stated. A bounding box of a zone is a full traversal
  that computes one for every geometry in it, and the packed depth carries the
  whole stated range at a precision of tens of microns.

512 square, which covers a 114 m level at a cell every 22 cm and costs one draw
of the zone. Interiors are tiny and share the size.

### The boundary

The outline polygon, inset by the rim's `inset` (or by a default where a zone
has no rim), is the *playable line*. It is drawn as one unbroken stroke. Past
it the hatch is laid over the blank ground and nothing of the render or its
doors is drawn — the picture is clipped to the polygon, not merely dimmed. A zone whose terrain
is a plain square gets a square. An interior's playable line is its shell's
inside wall, which the render already shows; the hatch begins at the wall's
outer face.

### Doors

Every `PortalSide` in the zone is a marker at its position, oriented by its
yaw so a door in a wall points into the room. Kinds are not distinguished — a
hatch, a road trigger and a door all get the same mark. A `none` end is drawn
too: it is somewhere you arrived from.

The label is the far zone's `name`, shown the moment the door's cell is
seen. Passing through it is not required: the fog is what reveals a door,
and a revealed door is a named one.

### Fog of war

A **seen raster** per zone: one byte per cell on a grid coarser than the
terrain's, about 2 m, covering the terrain's square. Outdoors, once a frame
the cells inside a disc of about 14 m around the player accumulate towards
full, so standing still finishes unveiling the ground around you over a couple
of seconds and walking on leaves a soft trail rather than a hard stamp. Line
of sight is not consulted; a disc is enough to say "you were here" and costs
nothing. A cell never goes back down.

**An interior is revealed whole on entry.** Its raster climbs to full
everywhere over the same couple of seconds, so a room is a room and not a
torch beam.

The raster is drawn over the picture as one image the size of the grid,
stretched over the ground it covers and filtered, so the map unveils gradually
as the values climb and the edge of what is open is soft. Unseen ground shows as
blank ground; unseen doors are not marked. A door is marked and named once its
cell has passed a threshold, and stays so.

The raster is the only state the local map has. It is kept for every zone the
player has stood in, not just the resident ones, and it is saved.

### Orientation

North-up, always, so the local map and the world map agree. `environment.
bearing` says which way a zone faces for its windows; where it is declared it
rotates the chart, and where it is absent authored `-Z` is north. The player
marker rotates with the camera yaw.

---

## The world map

Superseded by `WORLD-MAP.md`: the world map is now a continent drawn from the
zone graph, and that document is the one to read. The graph and the reveal
rule below still hold.

**Nodes are outdoor zones. Edges are portals between them.** Outdoor means
`environment.sky`; interiors are never on the world map. An interior belongs
to whichever outdoor zone it is reached from. A road, and the node at its far
end, appear the moment the local map's fog reveals the door that leads there,
so the two maps never disagree about what you have found.

## The screen

One overlay, `body.is-map`, opened with `M` in play, closed with `M` or
Escape. It releases the pointer lock on the way in and takes it back on the
way out, exactly as the inventory does; it will not open while a transition
is running or while the reading screen or inventory is up. The world stays
visible and dimmed behind a scrim, as it does under the inventory.

**Two floating windows**, both `Floating`, exactly the inventory's two: the
world map on the left and the local map on the right by default, each dragged
by its header and resized by its edges, their geometry remembered per machine
the way the inventory's is. `M` opens both together and closes both together.

**Scrolling over either window zooms it**, about the pointer, between a floor
that fits the whole chart in the window and a ceiling of a few times that.
The local map opens at fit for an outdoor zone and at a closer zoom for an
interior, so a cottage fills its window rather than sitting as a postage
stamp in the middle of it. The world map opens at fit. Dragging with the
pointer pans a zoomed chart; the zoom is per window and remembered for the
session only.

Each window is one canvas. The chrome — border, captions, door labels — is
in the register of the rest of the interface: `--ink` on `--void`, one hard
pixel of border, no ornament, type in `--type`, lowercase, at the caption
sizes the options panel uses. The picture inside keeps the world's own
colours, posterised; the blank unseen ground is `--void`.

---

## State and saving

A new module beside `state.ts`, working name `chart.ts`, holding:

- `seen: Map<ZoneId, Uint8Array>` — the fog rasters, one byte per cell, one
  per zone ever entered, sized from that zone's terrain.
- `visited: Set<ZoneId>` — for the world map, and derivable from `seen`.
- `found: Set<string>` — portal ids whose door the fog has revealed, which is
  what draws a road and its far node.

Saved as an optional `chart?` on `SaveData`, version unchanged: each raster as
a base64 string, keyed by zone id. A save from before the field
opens with an empty chart. Loading a slot replaces the chart; the reset path
that `resetWorld` runs clears it.

The bake target is runtime state on the map screen, keyed on zone id and
dropped when the zone is evicted; it is rebuilt from the world on the next
entry, which is free.

---

## Cost

- The seen stamp: a disc of a few hundred bytes added to once a frame. Cheap
  enough not to budget.
- The bake: one orthographic draw of the zone on entry, into a 512 square
  target, at full black inside the same frame the zone is swapped in. Once.
- The stylise pass: one shader per window while the map is open.
- The world map: a layout run once per content load, and a canvas redraw
  when the map opens or something is revealed.

Nothing here runs while the player is playing.

---

## Build order

**P1 — the chart and the bake.** `chart.ts` with the seen raster and the
per-frame stamp; the top-down bake on zone entry; the map overlay with the
local window drawing the stylised render, the playable line, the hatch and
the fog mask; zoom and pan.
*Done when* `M` shows the village from above with a hard playable line, hatch
outside it, and the fog opens as you walk.

**P2 — doors and interiors.** Portal markers and labels; the ceiling cut and
the whole-room reveal so a cottage reads as a floor plan at a closer zoom;
the player marker.
*Done when* every door in the village and every hatch in the cottage is
marked with the right name, and the cellar shows as a room.

**P3 — the world map.** The graph walk that folds interiors into their
outdoor zone; the deterministic layout; circles, names and roads; the
current-zone mark; the found set and the reveal rule.
*Done when* the world window shows the village alone on a new game, grows the
gate road and the showcase circle when the fog reaches the gate, and fills
the circle the player is in.

**P4 — the country.** The family table and the marks; the seeded scatter
around each node.
*Done when* every family draws something, the village sits among roofs, and
a node's country changes when its vibe does.

**P5 — saving.** `chart?` on `SaveData`; load and reset.
*Done when* a save reopened shows the fog where it was left, and a new game
starts blank.

---

## What came out differently

- **The picture keeps the world's own colours.** No posterising: quantizing the
  three channels separately moves the hue, and two woods a few values apart land
  on olive and on maroon. The depth-step line does the work instead.
- **The bake frames the playable ground, not the terrain's square.** A level is a
  shape cut out of a heightfield twice its width, and framing the square spends
  four fifths of the picture on ground the chart clips away — which is what made
  the part you can see coarse. 768 square over the level itself.
- **Anything drawn transparent is left out of it** — a shaft of light through a
  window, a flame's glow, a pane of glass. Light is not a thing on a map, and
  drawn flat it comes out as a solid shape standing on the ground.
- **The lines are found by curvature, not by slope**, at two samples per axis,
  and smeared by one sample before the picture is written. The side of a barrel
  is nearly vertical and perfectly smooth: a test on the difference between one
  sample and the next fires along part of it and not the rest, which draws a
  ragged crawling ring instead of a rim.
- **The stylise happens once, at the bake**, not as a pass while the map is
  open. Same picture, and a redraw is then a `drawImage`.
- **The whole chart is 2D canvas.** Nothing but the bake touches the renderer.
- **`ZonePlan`** is the new field on `ZoneDefinition` that carries the extent,
  the outline, the rim's inset and the ceiling. `chart.ts` sizes its raster from
  it, and a raster restored against a different grid starts again rather than
  landing askew. A zone written in code states none, and `Zone.plan` measures one
  off what it built — everything that is not scenery.
- **The playable line's inset is a bisector approximation** — each vertex moves
  along its own ray from the outline's centre. Exact on a straight run and close
  enough on the gentle corners a level outline is made of. No zone in the
  project declares a rim yet, so nothing insets at all today.

### The local map

- **Doors are marked, never named.** One archway glyph for every kind of way
  out, standing open, with no bearing on it; the cursor over one gets the
  crosshair's own wording, from the same function the crosshair calls.
- **One mark per way out.** A portal with both ends in one zone — a ladder
  between two floors — is not marked, and neither is an end marked `accessory`,
  which is what a second way through one threshold declares itself as.
- **The player is one arrow**, solid ink inside a heavy casing of the ground,
  larger than anything else on the sheet.
- **Marks are sized against the chart, not the window**, so pulling in makes them
  larger the way everything drawn on the ground does — clamped either way, or a
  mark is a speck at one end of the zoom range and a billboard at the other.
- The window opens a little wider than the tight fit, and zooms out past it.

### The world map

See `WORLD-MAP.md`.

## Open questions

None. The layout's road length and the marks themselves are tuned when they
are seen.
