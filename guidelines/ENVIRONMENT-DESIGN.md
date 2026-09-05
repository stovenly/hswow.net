# Environment design

How to make a place look like a place. Where to put the ground, the rock, the
trees and the small things so that a forest reads as a forest, a beach as a
beach, and none of it reads as placed. Read this before dressing a zone and run
the checklist at the end. `LEVEL-DESIGN.md` decides where the player goes; this
file decides what they see on the way.

Tools this file assumes: terrain landforms (`hill`, `ridge`, `scarp`, `basin`,
`channel`, `terrace`), ground `patches` and `cover` blots, `detail` levels,
`scatter` with avoid and region, `track`, the `skirt` and the vista ring. The
render is 960×540 with a dither, so anything smaller than a hand at ten metres
is gone; silhouettes and masses carry everything.

---

## 1. Nature does the work: derive, never decorate

A real landscape is the result of a chain, and every part of it is where it is
for a reason. Run the chain forward for every cell and the placements fall out;
skip it and the placements have to be guessed, and guessed placements read as
guessed.

**Rock → water → soil → plants → animals → people**, in that order.

1. **Rock.** What is the ground made of and how does it break? Granite makes
   rounded tors and boulder-strewn slopes. Sedimentary rock makes ledges,
   strata and flat-topped scarps. Chalk makes smooth rounded downs and dry
   valleys. Decide once per cell and every outcrop, scarp and crag follows.
2. **Water.** Where does rain go? Downhill, converging. Every slope drains to a
   line; lines join; the joined line is the stream, and the stream has cut the
   valley the slopes are the sides of. Water is why there is a valley, not a
   thing added to one.
3. **Soil.** Deep on the flat and in the hollows, thin on the slopes, gone on
   the crests. Wet at the bottom, dry on top. Sand where the sea or a river
   left it.
4. **Plants.** Each grows where its soil, water, light and shelter are. Trees on
   the deep soil, in the lee, along the water. Heather and gorse on the thin
   dry acid ground. Reeds in the wet. Nothing on the sand until the dune grasses
   hold it. Nothing on bare rock but lichen.
5. **Animals.** Tracks through the cover, grazed lawns, a bare wallow. (Only
   when asked. The default is none.)
6. **People.** They build on the dry, in the lee, near the water and on the
   track. Their walls follow the boundaries the ground already suggests. Their
   lanes take the gentle line. Their fields are where the soil is. Nothing of
   theirs is anywhere it would be inconvenient.

Every mass placed should be able to answer "why here?" in one clause from this
chain. A crag with no reason is a prop; a crag where the ridge's rock breaks
the surface is a crag.

---

## 2. Composition

### Start big

Big masses first: the landforms, the treeline, the water. Then the medium:
individual crags, single trees, buildings. Then the small: scatter, cover,
detail. Never the other way. A weak silhouette is not rescued by clutter, and
clutter added early hides the silhouette that needed fixing.

The sequence matches the tools: landforms, then skirt and vista, then large
props, then scatter and cover, then detail radius.

### Big, medium, small

Every view should have one thing that is clearly the largest, several that are
clearly medium, and many that are clearly small, with **distinct gaps between
the scales**. A view where everything is medium is mush; a view where everything
is big is a wall. Within a cluster the same holds: one large boulder, two or
three medium, a fan of small.

### Hierarchy is local contrast

A thing is important because of what is next to it. Tall among short, dark
among light, round among angular, dense among open, tilted among level. The
landmark does not need to be huge; it needs to be the one thing that is
different from its neighbours in a way the eye picks up at a glance. Give every
district one such thing and only one.

### Negative space

Rest is what makes detail legible. A sea of detail has no focus; the clear
patch in it is where the eye goes. Leave open ground, open water, open sky.
Between two clusters leave a gap wider than either cluster. A meadow with three
trees is a composition; a meadow with thirty is a wood, and a wood with one
clearing is a composition again.

### Depth: three grounds

Compose the arrival shot and the main sightlines as foreground, midground,
background:

- **Foreground** (0–15 m): ground texture, cover, a rock or post to frame with.
  Large on screen, sharp, warm.
- **Midground** (15–80 m): where the subject lives. The landmark, the hut, the
  bend in the track. This is what the cell is *about*.
- **Background** (80 m +): the vista, the far arm of the bay, the treeline.
  Cool, low contrast, in the fog. Says what is beyond.

Overlap them: a foreground shape crossing in front of the midground shape sells
the distance more than any fog. Keep something in each ground of every main
view. A view with only a background is a postcard; a view with only a
foreground is a wall.

### Lines the eye follows

A track, a stream, a hedge, a ridgeline, a strandline. They should lead toward
the midground subject, not away, and they should curve: the S-curve into depth
is the oldest device in landscape and it works because water and feet make it
naturally. Do not draw lines on screenshots and call it design. Build the real
things (the track, the stream) where they would really run, and check that
where they run happens to lead the eye.

### Silhouette and skyline

The player looks along the ground, so the skyline is where shapes are read.
Vary it: a peak, a flat, a notch, a tree crown, a roof. Two identical bumps
side by side on the skyline are the most artificial thing a landscape can show.
A ridge is one long shape with a rhythm along its top, not a row of hills.

---

## 3. Grouping: how many, how spaced

### Clusters, not rows

Things in nature come in families. Seeds fall near the parent, rock breaks near
the outcrop, water pools near the low point. So:

- **Odd numbers** in a group: one, three, five. Two reads as a gateway; four
  as corners.
- **One dominant** per cluster and the rest attend it. Equal-sized members read
  as a set of copies.
- **Uneven spacing.** Two close, one apart. Never equidistant.
- **Uneven bearing.** Rotate every instance; never share a yaw.
- **A trailing off.** The cluster has a dense heart and thins to an outlier or
  two. The outlier is what makes the heart look natural.

The working method for a rocky place is the fractal one: place one rock; copy
it, shrink it, turn it, shift it; repeat, getting smaller. The result reads as
one event (a fall, an outcrop weathering) rather than a delivery.

### Gestalt

The eye groups by proximity, similarity, continuity and closure. Use that:
things that belong together sit close and share a material; a line of anything
(posts, stones, trees) is read as a single edge, so only draw such a line where
an edge is wanted; a broken ring is read as a ring. And beware it: three crags
in a row become a wall, a scatter at even density becomes a carpet, and any
alignment at all becomes an intention.

### Density gradients

Nothing in nature has a hard edge of density. Trees thin toward a clearing over
several trunks; cover feathers out; rocks fan from the foot of a crag and
peter out down the slope. Scatter regions should be hearts with falloff, not
stamps. Where two covers meet, they interleave for a band before one wins.

### Repetition and the tyranny of the grid

A kit of builders repeats. Hide the repeat: scale, yaw, partial burial, company.
Never let two instances of one builder stand at the same size, the same
bearing, in the same relation to a third thing. Break every implied grid with
one thing off it. Where a line of repeats is genuinely wanted (fence posts,
an avenue) it is a human line and should say so by being straight and evenly
spaced on purpose.

---

## 4. Terrain

### What each landform says

| Landform | Reads as | Use it for |
|---|---|---|
| **hill** | a mass, a thing to go over or around | medium triangles, hiding what is behind |
| **ridge** | a wall of ground with a top to walk | enclosing a corridor, an arm of a bay, a skyline |
| **scarp** | a step, one side up | a bluff, a raised beach, a field terrace, a cliff top |
| **basin** | a hollow that holds things | a marsh, a pond bed, a sheltered yard, a cove's floor |
| **channel** | water's line, a lane's cut | streams, gullies, a lane through dunes |
| **terrace** | a flat made for something | a house platform, a yard, a landing |

Landforms **sum**. Two hills that overlap make a saddle or a spike; a channel
across a basin makes a pit at the crossing. Before placing any landform add up
what already reaches that spot. Every pit so far has been a sum.

### Slopes must be honest

The rock angle paints anything steeper as rock. That is the rule the player
learns in the first minute: grey means no. So a bank the player must not climb
is steeper than the rock angle and looks like rock; a bank they may walk is
shallower and looks like grass; **nothing sits between**. A 3 m channel with
steep banks is a concrete trench; a lane through dunes is a wide shallow
hollow with soft banks and sand all the way up.

### Creases, not blobs

Do not over-smooth. Real ground has creases where slopes meet: a valley floor
has a line, a scarp has a lip and a foot, a ridge has a crest. Blend radii
should be large enough that landforms do not step, and no larger. A cell where
every transition is a long ease reads as melted.

### Where the ground changes material

Ground material follows the chain: rock where it is steep and on crests; sand
where the sea or wind left it; dirt where feet and wheels wear the grass off;
wet sand and mud in the low wet places; grass everywhere else. Patches are
not decoration; each is a statement about what happened there. Put the bare
patch where the track pauses (a gate, a ford, a yard), the dirt where the
animals stand, the moss in the damp shade.

### Paths by shape

- **Ledge path** — open one side, closed the other. A view along it. Cliff-top
  walks, the shelf above a beach.
- **Cutting** — closed both sides. Enclosed, safe or mysterious. Sunken lanes,
  a gap through dunes, a hollow way.
- **Ridge path** — open both sides, raised. Exhilarating. Along the top of an
  arm or a dune crest.
- **Switchback** — a slope taken in zigzags with a pause at each turn. Every
  turn is a pocket and a view.

Paths follow contour and gradient because feet and hooves do. They cross a
slope diagonally, take the saddle not the summit, cross a stream at the
shallows. A straight path is a made thing and belongs to made places.

---

## 5. Recipes by country

Each recipe is the chain run forward for one kind of place. Use the vocabulary
and the ordering; the numbers are typical, not required.

### Forest

Structure is vertical and it is read from inside:

- **Canopy** — the crowns, closed enough that light comes in patches. Trunks
  bare below the canopy; branches start high in a mature wood.
- **Understory** — smaller trees and shrubs where the light gets through:
  along the edge, in gaps, by water. Sparse under a closed canopy.
- **Floor** — litter, moss, a few ferns; bare and dark under dense canopy,
  rich where light falls. Fallen trunks lie where they fell, downhill and
  across the slope, and a fallen tree makes a gap that fills with understory.
- **Edge** — a wood does not stop; it steps down. Tall trees, then a mantle of
  shrubs and young trees, then a fringe of tall herbs and bramble, then the
  grass. The mantle is where the wildlife and the flowers are; it is 5–15 m
  deep in a natural edge. A hard tree-to-grass edge is a plantation or a
  felled line and says so.
- **Clearings** — bowls of light. The understory crowds their rim; the floor
  is grass or flower in the middle. One clearing is a composition; a wood
  with none is a corridor.
- **Rides and tracks** — the light gets in along them too, so their verges
  are the mantle again.

Spacing: trunks 4–10 m apart in a mature wood, clumped, with the odd giant
standing apart in its own pool of shade. Lean trunks slightly and randomly;
never vertical rows. Trees on a slope stand vertical but the slope makes their
crowns step, which gives the skyline.

### Heath and moor

Thin acid soil over hard rock, open to wind:

- **Ground cover** — heather in low mounds, gorse in taller clumps, bracken in
  the damper hollows and along the tracks, coarse grass where grazed. Colours
  in patches, not mixed: a heather patch, a grass patch, bracken in the gully.
- **Rock** — tors on the crests where the rock stands proud, and **clitter**
  (a fan of fallen blocks) spreading downslope from them. The tor is the big,
  the clitter the medium and small of the same event. Boulders half-buried,
  lichen-grey, all from one family of shape.
- **Water** — small streams in shallow peaty gullies, boggy flats in the
  saddles, a pool where a basin holds it.
- **Trees** — few, wind-shaped, in the lee of a tor or in the gullies. Alone,
  never in a stand.
- **People** — dry-stone walls enclosing the fringe, stone-faced banks topped
  with gorse, sunken lanes, a clapper bridge at a ford, a cairn on the crest.
- **Aspect** — the tree line is higher and the growth richer on the sunny side;
  the windward side is barer and its trees lean away from the wind.

### Farmland and lane

Ancient countryside, small scale:

- **Fields** — irregular, sized by what one household could work, bounded by
  hedgerows on banks. Boundaries follow the ground: a stream, a ridge foot, the
  edge of the wet. Gates at corners and where the lane touches.
- **Hedgerows** — a bank, then the hedge, with standard trees along it at
  uneven intervals. The hedge is the wall the player cannot cross and the
  edge the eye follows.
- **Copses** — small woods on the ground too steep or wet to farm. Where a
  copse touches a field there is the woodland edge again.
- **Lanes** — narrow, hedged both sides, winding, sunken where old. They go
  between farms and to the church, not across country.
- **Buildings** — on the dry ground, in the lee, near the water, off the best
  soil, facing the sun. A yard is a terrace of bare ground with the buildings
  around it and the lane arriving at one corner.

### Stream and river

- **Meanders.** A stream is never straight. Bends have a wavelength of roughly
  ten to fourteen channel widths and the channel swings between them.
- **Inside of a bend** — a point bar: shallow, gravel or sand, gently sloped.
  This is the beach of a river and where a ford goes.
- **Outside of a bend** — a cut bank: steep, undercut, roots showing, the deep
  pool below it.
- **Riffle and pool.** Shallow fast water (riffle) at the crossover between
  bends, deep slow water (pool) on the outside of each bend. Alternate them.
- **Banks** — densely vegetated where left alone; willow, alder and reed hold
  the bank and narrow the channel. Bare and trampled at fords and drinking
  places.
- **Floodplain** — a flat beside the channel, wet meadow or reed. The river's
  own terrace, then the ground rises to the valley side.
- **Gradient** — a steep stream is step and pool over boulders with white
  water; a gentle one is riffle and pool across a broad flat.

### Beach and coast

From the sea inland, each band is a different material and a different slope:

- **Nearshore** — the bed shelving out under water, sand ribbed by the waves.
- **Foreshore** — the wet sand between tides, flat, mirror-wet, with the
  swash edge as its inland line.
- **Berm** — a low step of dry sand above the reach of ordinary waves, where
  the slope changes from the foreshore's to the flat of the backshore.
- **Strandline** — the line of wrack, driftwood and debris at the top of the
  tide. It is where things wash up and the one line of clutter a beach has.
- **Backshore** — dry sand, flat to gently rising, wind-rippled.
- **Embryo dunes** — low mounds of sand catching behind any obstacle or grass
  tuft at the back of the backshore.
- **Foredune** — the first proper ridge, shore-parallel, held by marram and
  couch grass, steep to the sea and gentler behind; anything from 2 m to 20 m.
  Blowouts are bowls cut through it by the wind where the grass failed, and
  they are where a lane through the dunes goes.
- **Grey dunes and slacks** — behind the foredune, older ridges going over to
  turf, lichen and low scrub, with damp hollows (slacks) between them.
- **Heath or field** — where the sand ends and the soil begins.

Headlands and coves: hard rock stands as the arms, soft rock between wears
back into the bay. The arms are rock at the seaward end (cliff, stack, skerry,
wave-cut platform at the foot, scree where it fails), turning to turf and
gorse on top and landward. A **stack** is a piece of the arm the sea has cut
off, so it stands in line with the arm's trend, not at random. A cove's beach
is a crescent because the waves bend round the arms; the sand is deepest in the
middle and thins to rock at each end.

People on a beach: a hut stands above the storm berm, on the first firm ground,
in the lee of an arm. Boats are drawn up above the strandline. A post is where
a rope was needed.

### Desert and dry country

The same chain with less water:

- **Mountain front → pediment → bajada → playa.** Rock, then a bare sloping
  apron, then the fans of debris the washes have spread, then the flat where
  the water ended and left salt. Slope decreases the whole way.
- **Washes** — dry stream beds, braided, gravel-floored, with steep cut banks.
  Every shrub and tree of any size is along a wash, because that is where the
  water was.
- **Dunes** — where wind has sand to move: gentle windward slope, sharp crest,
  steep slip face in the lee at the angle of rest. All crests share the wind's
  bearing. Dunes are in fields, not alone; between them the ground is bare or
  gravel.
- **Rock** — varnished dark on exposed faces, pale where freshly broken; mesas
  and buttes are flat-topped because a hard layer caps them, and their sides
  step where the layers change.
- **Vegetation** — evenly spaced by competition for water, not clustered like a
  wood: shrubs at arm's length from each other, bare ground between.

---

## 6. Where plants grow

Rules the eye checks without knowing it:

- **Water first.** The greenest, tallest growth is along the water and in the
  hollows; the driest on the crests and the sand.
- **Light.** Understory in gaps and at edges; bare floor under closed canopy.
- **Shelter.** Trees in the lee, wind-shaped on the exposed side, leaning away
  from the wind with the windward branches short.
- **Aspect.** The sunny side grows more; the shaded side is damper and mossier.
- **Soil.** Deep soil takes trees; thin soil takes heath; no soil takes lichen.
- **Disturbance.** Bare where trampled (tracks, gates, fords, yards); rank and
  tall where nothing walks; grazed short where animals are.
- **Ecotones are bands, not lines.** Every boundary between two covers is a
  strip where both occur, and the strip is the richest ground in the cell.

Cover is a statement about all of the above. A `cover: none` blot says
"trampled" or "sand" or "rock"; make sure the ground agrees.

---

## 7. Marks of people

- People build where it is dry, sheltered, near water and on the way. Test
  every building against all four.
- Walls follow existing edges: a stream, a slope foot, a rock line.
- Lanes follow gradient and hedge; they arrive at a yard from one side.
- Human lines are straight and evenly spaced on purpose (fence posts, a row of
  planted trees, a wall). Natural lines never are. Do not blur the two.
- Maintained things are crisp; abandoned things soften, but **weathering is
  opt-in**: no wear, rust, lichen, grime or ruin unless asked by name.
- The ground records use. Bare earth at a gate. A worn threshold. Ruts in a
  lane. These are patches placed by the person authoring the zone, never by a
  builder deciding for itself.

---

## 8. Colour, value and light

- **Group hues to define districts.** Tan dunes, green heath, grey arms, blue
  water. A district reads as one when its colour is one. Mixed hues everywhere
  is no district anywhere.
- **Value hierarchy.** Ground darker than what stands on it; near darker than
  far; shade darker than sun. Keep the landmark's value distinct from its
  background at the distance it is meant to be read from.
- **Saturation is an accent.** Keep most of the cell at moderate saturation so
  the one saturated thing (a door, a flower patch, a sail) is the eye's target.
- **Fog is the depth tool.** Our aerial fog cools and lightens with distance;
  arrange the grounds so each is a step in the fog, and let the vista be the
  last step.
- **Light is the pointer.** Players go to the lit thing. A gap in the canopy,
  the sunny side of a hollow, a lit window at dusk. Place the subject where the
  light falls and the approach in shade.

---

## 9. Reading at our resolution

At 960×540 with a dither a chunky pixel is about 10 cm at 20 m and half a
metre at 100 m. Consequences:

- Silhouettes and masses carry everything; surface detail is gone past 20 m.
- Small props are noise beyond the midground. Put them in the foreground of a
  composed view or nowhere.
- Repeated small shapes at even spacing form moiré. Vary spacing and size.
- The vista's crude geometry is right for its distance: a twenty-triangle hut
  at 150 m is a hut. Do not spend triangles on what the dither erases.
- Thin things (posts, masts, single reeds) flicker. Give them thickness or
  company.
- Colour boundaries at the pixel saw; **edges are mesh edges**, never a
  thresholded colour function.

---

## 10. Anti-patterns

All of these have been built here and taken out.

- A rim of hills as a boundary. Boundaries are walls, hedges, trees, water or
  rock, and the vista goes beyond.
- Several instances of one builder in a row at one size: a colonnade.
- A narrow channel with rock-painted banks through soft ground: a trench.
- Water stopping at a straight edge.
- Everything at one height, or every transition eased to a blob.
- Even spacing, shared yaw, a grid anyone can see.
- Builders dressing the ground around themselves.
- Weathering, birds, signs, debris nobody asked for.
- Four systems in one cell each doing their own thing instead of one picture.
- Detail everywhere and rest nowhere.

---

## 11. Process

1. **Run the chain.** Rock, water, soil, plants, people, for this cell, in six
   lines. Every later placement points back to one of them.
2. **Big masses.** Landforms and skirt. Check the sums. Check the skyline from
   each gate and from the landmark.
3. **Districts.** Assign each area one material, one cover, one colour, one
   dominant thing.
4. **Medium.** Crags, trees, buildings, in clusters with one dominant and
   uneven spacing. Check each against "why here?".
5. **Edges and ecotones.** Feather every boundary; interleave covers; step the
   wood down at its edge.
6. **Small.** Scatter and cover with density gradients from hearts. Leave the
   rest empty.
7. **Grounds.** Stand at each gate and at the landmark; name the foreground,
   midground and background of each view and fix the one that is missing.
8. **Report.** The owner's look is the verdict.

---

## 12. Checklist

- [ ] The chain is written for the cell and every mass answers "why here?".
- [ ] Big, medium and small are present in every main view with clear gaps.
- [ ] One dominant thing per district; districts are one colour each.
- [ ] Clusters are odd, uneven, dominated, and trail off.
- [ ] No shared yaw, no equal spacing, no row of copies.
- [ ] Every boundary between covers is a band, not a line.
- [ ] The wood steps down at its edge; the beach has its bands in order; the
      stream meanders with bar inside and cut bank outside.
- [ ] Slopes are either walkable and grass or unwalkable and rock, nothing
      between.
- [ ] Landform sums checked at every overlap; no pits, no spikes.
- [ ] Skyline varies: no two equal bumps.
- [ ] Each main view has a foreground, a midground and a background.
- [ ] There is empty ground, empty water or empty sky to rest in.
- [ ] Nothing thinner than the dither can hold stands alone in the midground.
- [ ] No weathering, debris, sound or creature that was not asked for.

---

## Sources

- The Level Design Book: *Landscape*, *Environment Art*, *Composition* —
  https://book.leveldesignbook.com
- Catherine Dee, *Form and Fabric in Landscape Architecture* (2001): fabric,
  space, paths, edges, foci, thresholds, detail
- Anthony Vaccaro, *Environment Art Tips* —
  https://80.lv/articles/environment-art-tips-from-anthony-vaccaro
- Vejzovic, *Organic Environment Art: Vegetation & Rocks* —
  https://80.lv/articles/organic-environment-art-vegetation-rocks
- Radiator Blog on Breath of the Wild's triangles at three scales —
  https://www.blog.radiator.debacle.us/2017/10/open-world-level-design-spatial.html
- Coastal dune geomorphology —
  https://www.nature.com/scitable/knowledge/library/coastal-dunes-geomorphology-25822000/
- Natural stream processes —
  https://content.ces.ncsu.edu/natural-stream-processes
- Dartmoor National Character Area description —
  https://nationalcharacterareas.co.uk/dartmoor/description/
- Woodland edge — https://en.wikipedia.org/wiki/Woodland_edge
- Heathland and moorland —
  https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/habitats/heathland-and-moorland/
- Tree line and krummholz — https://sciencescout.blog/tree-line-elevation-factors
- Desire paths — https://en.wikipedia.org/wiki/Desire_path
- Rule of three in landscape design —
  https://abladeofgrass.com/blog/what-is-the-rule-of-3-in-landscaping/
- Landscape painting: foreground, midground, background —
  https://drawpaintacademy.com/foreground-middleground-background/
