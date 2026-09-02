# The world map, drawn as a continent

**Decided; building.** Supersedes the "world map" half of `MAPS.md`. The local map
is untouched. Names below are working labels, not decisions. Decision points
are marked **⟶ decide**.

**The short version.** The world map stops being a diagram of circles and
roads and becomes a *map*: a continent with a coastline, sea, mountains,
forests, rivers, fields and towns, in colour, in the register of fantasy
cartography — the Fable endpaper, the Azgaar/Red Blob/O'Leary generators.
The continent is a fib. Every zone is a few hundred metres across and the
world map claims they are days apart; nobody will mind. What is *not* a fib
is the graph: every place on the map is a document outdoor zone, every road
is a real way between two of them, and the country each place sits in is what
its vibe says it is. The map draws itself from the graph, deterministically,
and the player reveals it as they play.

Right now the document has **two** outdoor zones (`countryside-village` and
`demos`), so today's picture is one island with two places on it. Everything
below is built for the map this becomes as zones are added; nothing in it
needs authoring beyond what a zone already declares.

---

## How the generators do it, and what is borrowed

Three sources, all read:

- **Red Blob's polygon maps.** Land/water from a shape function plus noise;
  *elevation is distance from the coast*, redistributed so most land is low
  and little is high; rivers run downhill corner to corner and merge; moisture
  is distance from fresh water; a biome is a lookup on elevation × moisture.
- **O'Leary's `terrain`.** Heightmap built from primitives (slope, cone,
  hills, noise), depressions filled so water always has somewhere to go, a
  flow map, rivers where flux passes a threshold, slope hachures for relief,
  labels placed by scoring against everything already drawn.
- **Azgaar.** Height first, then everything is a layer over it: biomes by
  height and moisture, coast extended with extra detail, burgs at good
  scores, roads between burgs, and the whole thing drawn in a chosen style.

What is borrowed: the *order* — land, then height, then water, then biome,
then marks, then names — and the two rules that make a generated map read as
geography: **height comes from the coast** and **water runs downhill**. What
is not borrowed: Voronoi meshes and erosion. Our nodes are already placed by
the graph; the field only has to look right at map scale, and a raster does
that in a fraction of the code.

---

## The pipeline

Runs once per content load, seeded from a hash of the sorted outdoor zone
ids, so the same content gives the same map on every machine. Nothing in it
depends on what the player has found.

### 1. Layout — as now

Nodes are document outdoor zones; edges are portals between them with
interiors folded in (`buildWorldChart`, unchanged). Relaxation as now, seeded
from `place.at` where declared. One change: the relaxed layout is then
scaled so a road is a fixed length in *map* units and the whole is padded by
about a road on every side — that padding is where the sea is.

### 2. Land — the fib

A scalar field over the map plane, sampled on a raster (`1024²`, sized to the
span's aspect):

    land(p) = Σ bump(node, p) + Σ ridge(road, p) + noise(p) − sea

- **bump**: a smooth hill of radius ≈ `0.9 × ROAD` about each node, so every
  place stands on land.
- **ridge**: a lower, narrower hill along each road's route, so a road never
  wades. The coast between two joined places is the sea eating in from
  either side, not a strait the road crosses.
- **noise**: three octaves of seeded value noise at about a road's
  wavelength, which is what turns the union of blobs into bays, headlands and
  the odd offshore island.
- **family shaping**: `beach` lowers its own bump and pulls the coast to it;
  `cave` raises its bump into a mountain; `plains` widens its bump and
  flattens it; `riverside` is guaranteed a river (step 4).

`land > 0` is land. The **coastline** is traced by marching squares over the
raster and smoothed once, so it is a clean curve and not a staircase.

### 3. Height

Elevation is **distance from the coast** (Red Blob), scaled by the field,
then pushed through a curve so most land is low and only a little is high,
with the `cave` bumps left as peaks. Hillshade is the gradient of this, lit
from the north-west, and is what makes the land look like land rather than
a filled polygon.

### 4. Water

Rivers start at the highest cells (and at one point above each `riverside`
node) and run downhill on the raster until they reach the sea, merging when
they meet; depressions are filled first so every river gets there. Drawn
tapered: a hair at the source, a proper line at the mouth. **A few lakes:**
low, wet ground well inland is left as water where the seed says so; a river
that reaches one ends there and one river leaves it for the sea.

### 5. Biome — what colour the land is

A lookup on height × moisture, where moisture is distance from rivers and
coast plus the family's say:

| where | colour | reads as |
| --- | --- | --- |
| low and dry | pale straw | plains, open country |
| low and wet | green | meadow, farmland |
| mid, wet | deep green | forest |
| mid, dry | ochre | moor, hill country |
| high | brown to pale grey | mountains, peaks |
| beside the sea | sand | beach |
| about an industrial node | ash grey with a rust tint | blighted ground |

Painted flat into the raster with soft edges between biomes, hillshade
multiplied over, and a faint paper grain. The sea is a deep blue paling
toward the shore, with the coast's own line dark and three thin **ripple
lines** stepping out from it at increasing spacing, which is the one
convention every fantasy map shares.

### 6. Marks — the pen over the paint

Vector, drawn every frame in window pixels so they stay crisp at every zoom,
placed deterministically from the seed, and all kept clear of the names:

- **Mountains.** Peak glyphs — a peak with its right face shaded — placed on
  cells above the mountain threshold, drawn north to south so each overlaps
  the one behind it, larger at the highest cells. Ridges read as rows.
- **Hills.** Small humps on mid ground with a stroke on one side.
- **Forest.** Clumps of lobed tree crowns with a dark underside, in the
  forest biome and thick about `forest` nodes.
- **Fields.** Short strip hatches about `farm` nodes.
- **Marsh.** Horizontal dashes with tufts on low wet ground about
  `riverside` nodes.
- **Industry.** Chimneys with a smudge (`factory`), pylons (`substation`),
  heaps (`scrapyard`), grates and pipe ends (`sewer`).
- **Towns.** The current place glyph, coloured: a disc in the road colour
  with a pale ring, filled solid where you are.
- **Roads.** The current wandering `route()`, in the Fable red-brown with a
  pale casing, ending square at each town.

The current `country.ts` splotch marks are folded into this: they become
the family-specific glyphs above, placed by the biome as well as by the node.

### 7. Names

As now — placed and reserved first, everything else stands clear of them,
drawn last in the prose serif with a halo. Larger and bolder for a town with
more roads out of it, so a crossroads reads as a bigger place, which is what
the Fable map does with Bowerstone.

### 8. Dressing

Three things, all fixed to the window rather than the chart:

- a **compass rose** in the bottom-left corner;
- **rhumb lines** — faint straight lines radiating across the sea, under the
  land and never over it;
- a **cartouche** in the top-right corner, naming the land: **Arkstin**.

No scale bar and no graticule.

---

## Reveal

The layout and the raster are computed over the whole graph so nothing moves
when a place appears. What the player *sees* is gated the same way it is
now: a place, its name and its country when the zone is entered; a road and
its far end when the fog on the local map reaches the door.

**Charted as you go.** The coastline is there from the start as a faint
pencil line over blank parchment — the shape of the land is known, the land
itself is not. Colour, relief and marks appear inside a soft-edged region
about each found place and along each found road, so the painted map grows
out of where you have been. Roads and names as now.

---

## Colour

The map is its own register: a parchment sheet in a dark window, not ink on
the void. Roads and towns in the Fable red-brown. Every value below is yours
to move.

| thing | colour |
| --- | --- |
| parchment | `#e9dfc0` |
| deep sea | `#3f6382` |
| shallows | `#7d9fb6` |
| plains | `#d3c893` |
| meadow | `#a8b96f` |
| forest | `#5f7f43` |
| moor | `#b8a26a` |
| mountain | `#a68d6b` |
| peak | `#e4dccb` |
| sand | `#e6d5a3` |
| blight | `#8d8880` |
| river | `#4f7fa3` |
| road | `#b5452f` |
| ink (lines, names) | `#3b2f22` |

The dyslexia-friendly type option still swaps the face; the colours do not
follow the UI theme.

---

## Where it lives

- `src/ui/map/world.ts` — graph, layout, and the draw order; keeps its
  exports.
- `src/ui/map/continent.ts` — the field, coastline, height, rivers, biome.
  Pure functions over typed arrays; nothing about the canvas.
- `src/ui/map/paint.ts` — the raster bake: biome colours, hillshade, sea,
  ripples, grain, into an offscreen canvas drawn under everything.
- `src/ui/map/relief.ts` — the pen marks: mountains, hills, trees, fields,
  marsh, industry. Replaces `country.ts`.
- `src/ui/map/pen.ts` — roads, as now.
- `MapScreen.ts` — unchanged except for the reveal mask, if A is chosen.

The bake is a few hundred milliseconds once per content load and runs the
first time the map is opened, not on boot.

---

## Not doing

- Erosion, Voronoi meshes, plate tectonics. The field is drawn, not
  simulated.
- Travel from the map. Clicking still does nothing.
- Authored geography beyond `place.at`. No zone gains a field for its
  terrain; the vibe says what a place is.
- Anything on the local map.
