# Material recipes — the next set of finishes

A companion to [SHADERS-AND-MATERIALS.md](SHADERS-AND-MATERIALS.md), which designed and
built the finish stage (M0–M2) and the transmissive family (M3). This proposes what
goes on that stage *next*, and one small piece of architecture that makes a long list
of them affordable instead of one of them expensive.

Nothing here is committed work. Names are placeholders throughout, as they are there.

---

## What we are trying to repeat

Two of the ten fixtures in the Materials Gallery are doing something the other eight
are not, and it is worth being precise about what, because "more like those" is the
whole brief.

**Frost** is a field of sub-pixel grains at three depths, each on its own clock, with a
slow wave crossing the object deciding which part of the field is up — and every grain
draws its colour from a *high-value* ramp (rose, peach, cream, cyan, violet) rather
than from the surface. **Gilt** lifts its sparkle off the surface entirely: camera-facing
quads on the particle layer, flashing whole, blooming through the glow layer.

Four things they have in common, and they are the design brief for everything below:

1. **They move on a clock, not on the camera.** Stand still and the surface is still
   doing something. Nothing else in the gallery is — chrome, marble and shell are
   inert until you walk.
2. **They play in hue, not in brightness.** Which is the palette doctrine's gift
   (`art/palette.ts`): per-channel quantization keeps hue differences and collapses
   brightness-only ones. Every effect below that reads well reads well *because* it is
   a hue effect that the quantizer prints rather than a gradient it bands.
3. **They have structure at more than one scale.** Frost has grain, clump and weather.
   A single-scale effect reads as a texture; three scales read as a material.
4. **They are made of many small things, not one big thing.** A highlight is one
   event and you see it once. A field is a thousand events and you see it every frame.

Everything below is scored against those four. Where an idea only has two of them, it
is in the parked list at the bottom and it says so.

---

## The architecture problem, and the byte that solves it

The finish stage has **nine parameters in ten lanes across three attributes**
(`aFinish` vec4, `aGrain` vec4, `aGlint` vec2), and M2's status block records what
the ninth one cost: a whole extra byte on every vertex in the game, because the two
vec4s were full and every way of avoiding it needed either a mode-switched lane or
sub-byte packing, and both of those fail silently.

Measured, that byte is real money: 9 bytes/vertex is ~24 MB across the fully resident
world. **Every idea in this document wants at least one more parameter**, and there are
eight ideas. Two more vec4s is +8 bytes/vertex, ≈ +21 MB, which roughly doubles the
finish stage's memory to buy a set of props you could count on two hands.

So: **do not widen the parameter set. Add a recipe index.**

```ts
/** Which recipe optical model runs, if any. 0 is none, which is nearly everything. */
export const RECIPE_ATTRIBUTE = 'aRecipe';   // one byte
```

One byte per vertex (~2.7 MB across the world, measured against M2's figures), holding
a small integer that selects one entry from a **uniform table of recipes**. Each
recipe brings its own constants — colours, rates, densities, depths — as uniforms, not
as vertex lanes. Add a tenth recipe and it costs a uniform slot and some shader, and
nothing per vertex at all.

**This is not the mode-switched lane M2 ruled out, and the difference is load-bearing.**
The thing that was rejected was one number whose *units* changed depending on another
number — you read a 0.6 and could not say what it meant. Here no existing lane changes
meaning: metallic is still metallic, glint is still glint, and the recipe lane selects a
*block of code* which arrives carrying every constant it needs. Nothing is reinterpreted;
something extra is switched on.

Three details that make it safe:

- **It is constant per triangle**, because `Part.finish` is per part and `assemble`
  bakes per part — so the three vertices of any triangle always agree, exactly as
  `aFace` already relies on. There is no interpolated-integer hazard.
- **It gates behind `if (vRecipe > 0.5)`**, so the matte 95% of the world pays one more
  attribute fetch and a branch that is coherent across whole draws.
- **The branch is per recipe and the recipes are few.** Six or eight is fine; thirty
  would grow the shared program past where a boot-time compile is comfortable, and that
  is the real ceiling on this list rather than memory.

### Two things already baked that nothing reads

Worth knowing before designing anything: `finish.ts` already bakes and carries two
varyings that no shader code consumes.

- **`vFace`** — a random 0..1 per triangle, the same on all three vertices, baked in
  `assemble` where the geometry is un-indexed. A free per-facet phase, and the comment
  on `FACE_ATTRIBUTE` says it was put there for a sweep that was never written.
- **`vObjectPhase`** — a hash of where the placed object stands, so two copies of one
  prop never do the same thing at the same time. Also read by nothing.

Both are exactly what a facet-flashing or object-breathing effect wants, and both are
already paid for. Half the ideas below use one or the other and cost nothing extra
for it.

### One piece of plumbing, for the emissive ones

Two of the recipes below (emberwork, spiritvein) put light *out*. Lambert's
`totalEmissiveRadiance` is right there and adding to it is trivial — but the bloom
pass (`engine/Bloom.ts`) builds its emitters mask by rendering the scene with the
camera restricted to `GLOW_LAYER`, using each object's own material. Put a finished
prop on that layer and the emitters pass draws the whole prop, diffuse and all, and
the crate beside the forge blooms.

**The fix is one uniform, and it unlocks the category.** `uEmittersPass`, set to 1 by
`Bloom` around its emitters draw and 0 otherwise; the art material's fragment stage
zeroes everything but its emissive term while it is set. An emissive finish then
contributes its glow to the mask and nothing else, and a prop opts in by enabling
`GLOW_LAYER` alongside its own — one line where the builder already sets a finish.

Cost: one uniform, one multiply on the final colour, and one extra branch in a pass
that draws tens of objects. It is worth landing before either emissive recipe, and it
is worth landing *only once*.

---

## The recipes

Costs are per *recipe* fragment, at chunky resolution, and should be read against the
calibration `SHADERS-AND-MATERIALS.md` already established: GTAO spends 48 texture taps
on every pixel of every frame and was signed off as carryable.

### 1. `aventurine` — the flecks are *inside*

Copper flecks suspended in glass. Goldstone, sunstone, aventurine — a dark body with a
field of metallic specks a millimetre or two under the surface, which all catch the sun
*together* when it lines up and go dead when it does not.

**What makes it distinct from frost**, which is the same speck machinery: parallax.
Frost's grains sit on the surface, so they are welded to it. These are offset along the
view direction in proportion to their depth, so they **slide against the surface as you
move round the object** — and that sliding is the entire cue that says "under" rather
than "on". Frost is weather; this is a solid with things in it.

Second difference: frost's grains are on independent clocks, so the field shimmers all
the time. These are on none. They fire as a *sheet*, gated hard on the sun's alignment,
and between alignments the stone is nearly black. Walking past one is a slow wink from
the whole surface at once.

**Implementation.** `finishSpeckLayer` already takes a `depth` parameter and already
dims, softens and shrinks with it — the change is to also offset its sampling position
by `viewDir × depth × thickness` and to raise the gate. The view direction is needed in
the space the specks are hashed in (`vWearPos`, object space); for this kit's rigid,
uniformly-scaled placements the transpose of the normal matrix carries the existing view
vector there, which is cheaper than a second varying and exact for every placement the
art kit makes.

*Cost: the frost stack plus a matrix multiply — call it what frost costs. Reuses the
distance-octave crossfade unchanged, so it holds up across a room like frost does.*

**Fixture:** an orb, because the parallax is only legible on a surface that turns.

### 2. `schiller` — labradorite, and the counterweight to frost

Frost is a thousand tiny things. This is **four or five enormous ones**. A labradorite
slab is grey until an internal plane happens to bisect your eye and the light, and then
a whole region of it floods peacock blue or gold — one domain at a time, edges hard,
and the flood *travels* across the stone as you turn.

Same optical family as `shell`, and nothing like it to look at. Shell walks the hue
wheel smoothly with view angle; every facet holds a slightly different hue and the
result is a cut opal. This holds one hue over a region ten facets wide and then stops
dead at a boundary that has nothing to do with the geometry.

**Implementation.** Cellular (Worley) domains over `vWearPos` at a metre-ish scale —
three or four hashes, cheaper than the fbm already in the file. Each cell hashes to a
plane normal and a hue. The domain lights on `pow(saturate(dot(domainNormal, H)), k)`
with a high `k`, tinted from a two-stop palette (the deep blue and the gold are what
labradorite actually does; a full rainbow reads as oil). Add a slow drift on the
domain normals — a few degrees, on `swayTime` — so a stationary player still sees the
flood breathe across a boundary rather than a frozen map.

*Cost: ~20 ALU. It is the cheapest thing in this document and probably the most
striking.*

**Fixture:** a column, and specifically the *slab*. Big flat faces are where domain
boundaries read; on an orb the domains are smaller than the facets and it degenerates
into shell.

### 3. `asterism` — the payoff the grain lane was always owed

The grain axis is baked, interpolated, welded to the normal matrix and currently
spends its whole life stretching a silk highlight. **A star sapphire is what that data
can really do.** Fibres in three directions sixty degrees apart, each stretching the
lobe along itself, and where the three cross you get a six-rayed star that sits on the
stone and slides across it as the light moves — not as the camera moves, which is the
part that makes it feel like a physical object rather than a screen effect.

The one-fibre case is a cat's-eye (chatoyancy — tiger's eye, satin spar), and it is the
same code with a rays constant of 1.

**Implementation.** `finishD` already has the anisotropic form. Evaluate it two more
times with the tangent rotated 60° and 120° about the normal and take the maximum
rather than the sum — a sum draws a bright blob at the crossing, a maximum draws arms
that meet. The fibre direction wants a little noise on it (a few degrees, from
`wearNoise(vWearPos)`) or the arms are geometrically perfect and read as a decal.

*Cost: ~+30 ALU on the direct lobe, on recipe pixels only. Nothing else changes; the
environment term, the fresnel cap and the sheen interaction all stand.*

**Fixture:** an orb on a plinth in the sun. This one wants R4's moving sun more than
anything else here — a star that never moves is a painted star.

### 4. `voidstone` — a black mirror with the wrong sky in it

Every reflective finish in the game reflects `skyColour(reflect(V, N))`, which is the
quiet luxury of a procedural sky: the environment is a function, so anything that can
be written as a function of direction can stand in for it.

So write a different one. A hashed starfield with a slow aurora over it, sampled in
the reflected direction: an obsidian orb that is dead black except that it has a night
sky inside it, and the constellations swing as you walk round. The object is matte-dark
and the *interior* is the entire effect, which is a thing nothing else in the kit does.

**Implementation.** A `voidColour(direction)` alongside `skyColour`, mixed toward it by
the recipe's strength: direction hashed to cells, a threshold for stars, sizes and
colours varying, plus two octaves of fbm as a slow-drifting nebula. The environment
composite already has the hooks — `finishEnv` is computed in one place and the tint
neutralisation, the roughness-capped fresnel and the sheen scaling all apply to whatever
is put in it.

**And it shares with R4c.** The night sky in `SHADERS-AND-MATERIALS.md` §5 wants stars
in the sky shader by exactly this method. Whichever lands first should write the chunk
in `engine/Sky.ts` and export it, on the argument the water shader already made about
`skyColour`: a second copy of a starfield would part company with the first the moment
either was tuned.

*Cost: ~30 ALU, replacing a `skyColour` evaluation of about the same. Roughly free.*

**Fixture:** a smooth orb, low roughness. Facets fragment a starfield into confetti,
which is a different and worse effect.

### 5. `quickmetal` — the reflection moves and the object does not

Chrome, but the surface is a liquid held in a shape. Perturb the normal used for the
*environment term only* by animated 3D noise, leaving the geometric normal alone
everywhere else: the silhouette is crisp, the outline is exactly where it was, the
shadow is unchanged — and the reflected sky crawls across the surface like mercury.

This is the cheapest way in the document to satisfy brief item 1 ("moves on a clock"),
and it is a *different kind* of motion from frost's. Frost twinkles, which is many
small changes. This flows, which is one large one.

**Implementation.** Two octaves of the existing noise over `vWearPos`, scrolled on
`swayTime`, perturbing `finishBounce` by a few degrees before the environment lookup.
Scale by the reduced-motion uniform, since this is precisely the class of thing that
option exists for. `vObjectPhase` offsets the noise so two quickmetal props in a room
do not ripple in lockstep — which is the whole reason that varying was baked.

*Cost: ~15 ALU. Note it pairs badly with high roughness: blur the environment and there
is nothing left to see crawl, so the recipe should hold roughness low and the check
should say so.*

**Fixture:** an orb *and* a slab. The slab is the honest one — a large flat face is
where a crawling reflection either reads or reveals itself as noise.

### 6. `emberwork` — cooling iron, and it is already in the world

There is a forge builder, an anvil, a stove and a fireplace. **The material they are all
missing is hot metal**: a dark crust broken by a network of bright cracks, the cracks
migrating slowly, the whole thing on a heat clock that can be driven by the zone or
just left to breathe.

Emissive, which is why the `uEmittersPass` plumbing above is worth landing: with it,
the cracks bloom and the crust does not, which is the entire difference between hot
metal and metal painted orange.

**Implementation.** A crack field is ridged noise — `1 - abs(2·fbm - 1)`, raised to a
power — over `vWearPos`, scrolled slowly. A blackbody ramp maps the field to colour
(dull red, orange, straw, white) and to emissive strength. The heat scalar biases where
on the ramp the surface sits, so the same recipe covers a banked forge and a
just-quenched blade. `finishWorn`, the weathering hand-off, should probably *cool* it —
a rusted surface is not glowing — and that is one line in the existing hand-off.

*Cost: ~35 ALU including the noise, plus the emitters-pass draw for props that opt into
bloom. The most expensive recipe here and still less than a third of GTAO.*

**Fixture:** a slab, on a plinth, and honestly the forge itself is the better test.

### 7. `spiritvein` — the material that reveals itself at night

A stone laced with veins that glow, and the trick is that **the glow scales inversely
with the direct light on the fragment**. In daylight it is a slightly odd rock with pale
mineral lines. At dusk the lines come up. In an unlit cellar it is the brightest thing
in the room.

It is the one recipe here that is *about* R4 rather than merely improved by it, and it
gives the day/night cycle something to reveal beyond making things darker.

**Implementation.** The vein field is the ridged noise from emberwork at a different
scale and colour (which is an argument for factoring that chunk once and calling it
from both). The reveal is `1 - saturate(luminance(directDiffuse))` read after the
lights loop, which is free — the number is sitting there. A slow pulse on `swayTime`,
phase from `vObjectPhase` so a wall of them is a wave rather than a strobe.

*Cost: emberwork's, minus the blackbody ramp. Same emitters-pass dependency.*

**Fixture:** a column, in the gallery, plus one in an interior — the whole claim is
about what it does in two different lighting conditions, and one room cannot show that.

### 8. `nacre` — banded film, and the cheapest idea in the document

`shell` drives its film thickness from noise, which gives the mottled oil-slick look.
Drive it instead from **distance along the grain axis** and the same code gives you
mother-of-pearl: bands of rainbow running with the growth lines, sliding along them as
the view angle changes.

Ten lines of difference from a term that is already built, using a lane that is already
baked, and it does not look remotely like the thing it is ten lines from.

*Cost: cheaper than shell — a dot product where there was an fbm.*

**Fixture:** a drape or a slab. It wants a surface with an obvious direction, which is
why the cloth fixtures exist.

---

## The transmissive family gets some too

`art/glass.ts` has four presets and its parameter set (`ior`, `dispersion`, `density`,
`tint`, `film`) already spans more than four interesting points. Three are nearly free:

- **`moonstone`** — adularescence: a soft blue sheen that appears to float *inside* the
  stone rather than on it, drifting as you move. Mechanically it is a strong forward
  fresnel with a cool tint applied at a depth offset, which the chord-thickness
  measurement (`d·cos θ`, M3) already computes. A milky ior with almost no dispersion.
- **`amber`** — high density, warm tint, low dispersion, and *inclusions*: dark specks
  hashed in object space at fixed depths inside the body, sampled along the refracted
  ray. The parallax that sells aventurine (recipe 1) sells this one too, and for the
  same reason.
- **`icedglass`** — a pane whose refraction offset is jittered per fragment by a frost
  pattern, so the room behind it dissolves into legible-but-wrong shapes. Costs one
  noise fetch on the existing offset. It is the effect a bathroom window has and no
  game ever bothers with, and it would make a beautiful zone boundary.

- **`dichroic`** — reflects one colour and transmits its complement, so the same pane is
  magenta from in front and green from behind, and the edge where the two meet is the
  whole effect. This is what dichroic glass actually does — a stack of dielectric layers
  splits the spectrum rather than absorbing any of it, which is why it looks lit from
  inside. **It is two lines in a shader that already separates the reflected and
  refracted terms and mixes them by fresnel:** tint one by `C`, the other by `1 − C`.
  Nothing in the document is cheaper for how strange it looks.

None of these need the recipe lane; they are entries in `GLASSES` plus, for amber's
inclusions, one shared chunk with recipe 1.

---

## The voidstone family — the environment is a function, and that is a licence

Recipe 4 is worth restating as a principle, because it is bigger than one stone.

Every reflective surface in this game reflects `skyColour(direction)`. Not a cubemap, not
a probe, not a capture — **a pure function of a direction vector**. Which means anything
expressible as a function of a direction can be put behind a surface, and the object will
carry it correctly through parallax, through fresnel, through the roughness blur and
through the tint neutralisation, because all of that machinery operates on whatever
`finishEnv` happens to hold.

That is a design space rather than an idea, and voidstone is only the first thing in it.

### 9. `deepstone` — an interior with actual depth

Voidstone puts a sky inside a stone; a sky is infinitely far away and so it does not move
as you cross the object. **Interior mapping** — the technique games use to fake rooms
behind building windows without modelling them — puts a *box* inside instead: intersect
the reflected (or refracted) ray against an axis-aligned box in object space, and shade
by which wall it hits and where.

The result is a stone with a room in it. Walk past and the interior parallaxes correctly,
walls sliding against each other at the right rates, and the illusion of depth is total
until you get close enough to see the box has six sides.

**Implementation.** A ray/box intersection is six divides and a couple of `min`s — it is
the cheapest analytic intersection there is, and the fog volume pass already does the
harder ellipsoid version. What the walls *are* is the authoring: receding planes for an
abyss, a hashed grid for a lattice, concentric shells for a well. Depth can vary by
recipe, so the same code gives a shallow shimmer and a bottomless pit.

*Cost: ~25 ALU, replacing a `skyColour` call. Cheaper than the thing it replaces.*

### 10. `skystone` — the wrong hour, sealed in a rock

`skyColour` takes its sun direction and its colours from `skyUniforms`. Evaluate it with a
*different* sun direction and a different keyframe, and you get a stone with sunset inside
it at noon, or with dawn inside it at midnight.

The effect is quiet and completely uncanny, and it costs nothing at all: the function is
already there, the keyframe interpolation R4b is building is already there, and the recipe
supplies a time offset. **It is the single cheapest idea in this document and it needs R4b
to exist first**, because before the keyframe table there is only one sky to be wrong
about.

A variant worth one line of the same recipe: offset the *time* rather than the elevation,
so the stone runs its own day at its own speed and is only occasionally in agreement with
the world outside it.

### 11. `starfall` — voidstone, moving

Voidstone's starfield is static in direction, so it swings with the camera and does
nothing on its own — which puts it at two of the four brief points rather than four. Drift
the hash field slowly and add a rare, bright streak (one cell in a few thousand, on a short
envelope, `vObjectPhase` deciding when) and the stone gets weather. Same cost, one clock.

This is the variant to build if voidstone is the one that lands and the notes come back
saying it wants something more.

---

## Second pass — recipes taken from real optics

Gemmology has spent two centuries naming effects that games do not implement, and most of
them are cheap here for exactly the reason the ones above are: the pipeline is analytic,
flat-shaded and quantized, which is a bad renderer for smooth PBR and an unusually good
one for hue tricks with hard edges. Sources at the end.

### 12. `grating` — iris agate, or the back of a CD

Thin film walks the hue wheel with view angle, which is what `shell` and `nacre` do. A
**diffraction grating** does something else entirely: it splits light into *spectral
orders*, so a fine ruled surface throws rainbow fans that sweep across it — not a wash of
shifting colour but distinct bands, at distinct angles, sweeping fast. Iris agate does it
with microscopic growth layers; a CD does it with data tracks; both look like nothing else.

**And it is the third good use of the grain lane.** The band direction is perpendicular to
the ruling, so `aGrain` supplies it and the effect inherits everything the grain already
does — welded through the normal matrix, fading out at a lathe's pole, per-part authored.

**Implementation.** The order angle is `sin θ = mλ/d`; inverted, the hue visible at a given
geometry is a linear function of `dot(H, tangent) / spacing`, wrapped, fed to a spectral
ramp. Take two or three orders (`m = 1, 2, 3`) at falling intensity and it fans properly.
The bands are *narrow* and *fast*, which is the sampling risk in the whole document — the
fade-with-footprint the glint stage already computes should gate it, for
`ANTIALIASING.md`'s reason.

*Cost: ~20 ALU. Wants a large flat face, so the slab and the column are the fixtures.*

### 13. `tenebrescent` — the stone that darkens where the light lands

Hackmanite is photochromic in reverse of expectation: sunlight *darkens* it — deep violet
where the light struck — and it fades back to white in the dark. A real mineral behaving
like a curse.

The honest version needs memory, which ground rule 3 does not allow anywhere in this
pipeline. **The instantaneous version needs nothing and is arguably the better effect**:
tint toward the dark colour by the direct light on the fragment, so the stone is violet
exactly where the sun strikes and pale in its own shadow. Everything is inverted — the lit
faces are the dark ones, the shaded faces glow pale — and a player's eye reads it as wrong
before it reads it as anything else, which for a fantasy game is the point.

The shadow factor is already folded into `directLight.color` before any of this runs, so a
tenebrescent statue is pale where a pillar shades it and violet everywhere else, and the
shadow edge is drawn *by the material*. That is a genuinely uncommon image.

*Cost: under 10 ALU, and it needs no new machinery whatsoever.*

### 14. `alexandrite` — a colour that depends on what is lighting it

Alexandrite is green in daylight and red under a candle, because its transmission window
has two peaks and which one wins depends on the illuminant's spectrum. It is the single
most famous gem phenomenon that no game does, and this pipeline is unusually well placed
for it: **the day/night keyframes (R4b) mean the game already knows what colour its light
is.**

So: hold two body colours, and mix between them by the *warmth* of the dominant light —
sun colour at noon versus lamplight at dusk, both of which are uniforms R4b will be
interpolating anyway. A ring that is teal in the field and plum indoors, with no state,
no script and no per-prop anything.

*Cost: a mix. Call it five ALU. It is a payoff for R4 rather than a cost against it, and
it is the best argument in this document for building the keyframe table.*

### 15. `retroreflect` — cat's eyes, and the flare over your shoulder

Almost every lighting model in existence brightens a surface when the light and the *view*
are on opposite sides. Retroreflectors — road signs, cat's eyes, the tapetum lucidum
behind a cat's retina — brighten when the light and the view are on the *same* side, and
they do it fiercely.

In a first-person game with a moving sun this has a lovely consequence: a retroreflective
surface is dead until you happen to put the sun behind you, and then it is the brightest
thing in the zone. Trail markers, a wayfinding lichen, animal eyes in a dark wood, an
enchantment that only answers you when you stand right.

**Implementation.** `pow(saturate(dot(V, L)), k)`, tinted, added to the direct lobe.
Roughly the backlight term the translucency stage already has, with the sign flipped. For
the beaded look, gate it through the speck field so it is a field of retroreflecting grains
rather than a smooth lobe — which is what a road sign genuinely is, and it puts the effect
back at four out of four on the brief.

*Cost: ~10 ALU, or frost's cost with the speck gate.*

### 16. `pointillist` — the marble berry, and a material for a plant

*Pollia condensata* is the most intensely coloured living thing known, and it manages it
with no pigment at all: helicoidal cellulose stacks Bragg-reflect, and — uniquely in
nature — **the layer thickness differs from cell to cell**, so the fruit is not blue so
much as *pixelated*, a pointillist mosaic of blues and greens and the occasional gold cell.

Which is a description of what this renderer does to everything anyway. A material whose
colour is quantized into cells by construction, viewed through a pipeline that quantizes,
is one of the few cases where the two agree instead of fighting.

**It is also the only idea here that wants to go on a plant.** The kit has bramble,
bluebell, elder and hazel builders; metallic berries on a bramble would be the strangest
thing in the woods and would cost one finish declaration.

**Implementation.** Cells over `vWearPos` at a millimetre scale, each hashing to a film
thickness; the existing `finishFilm` hue walk evaluated at that thickness. It is
`schiller`'s cellular domains at a hundredth of the size with `shell`'s film in them —
which is a nice check on the architecture, since two recipes sharing their chunks is what
the recipe table is for.

*Cost: `shell` plus a cell hash, ~25 ALU.*

---

## Parked, with reasons

Ideas that came up and did not clear the four-point brief. Recorded so they are not
re-proposed:

- **Damascus / watered steel.** A banded etch pattern along the grain. Real, handsome,
  and *static* — it fails brief items 1 and 4. It is also arguably a colour-stage
  effect (a wear pattern) rather than a lighting one, so if it is ever wanted it
  belongs in `art/weathering.ts` and not here.
- **Wet / rain-slicked.** A state that a *weather system* applies to everything, not a
  material a prop declares. It belongs with rain, whenever rain happens, and it needs
  Track C (general SSR) to be worth anything anyway.
- **Fur and moss-as-shell-texture.** The standard technique is 8–16 duplicated shells
  per prop, which is 8–16× the draw cost of the thing it is applied to — and draw calls
  are the documented ceiling (`SCALING.md`). Ruled out on architecture, not on looks.
- **Rune-lit metal, glyphs that trace themselves.** Wonderful, and it is *lettering*
  (`art/lettering.ts`) with an emissive finish, not a material. Worth doing; worth
  doing there.
- **Hoarfrost that grows.** Needles creeping out from seed points over ten seconds.
  Fails nothing on the brief and is genuinely lovely — parked only because it is
  `frost` with a growth term rather than a new material, and the gallery already
  has a frost fixture making the neighbouring claim. Revisit as a *variant* of frost
  rather than as a recipe of its own.
- **Phosphorescence — glow that lingers where the light fell.** The effect is a
  *history*, and ground rule 3 rules out history everywhere in this pipeline for
  reasons that have nothing to do with materials. `tenebrescent` (13) is the
  instantaneous cousin and gets most of the strangeness; `spiritvein` (7) gets the
  glowing-in-the-dark half. Between them there is little left for this to add.
- **Trapiche — the six-spoke radial pattern in emerald and sapphire.** Beautiful, and
  it is a *pattern*, not an optical phenomenon: black spokes on green. That is colour
  work in `weathering` or in the builder's part list, and it would cost nothing there.
  Recorded here only so nobody designs a lighting model for it.
- **Ammolite and fire agate.** Both are layered interference following a body's own
  growth structure, which is what `nacre` (8) already is with a different band
  function. If either is wanted specifically, it is a constant in nacre's recipe.
- **Opal's play-of-colour.** Patches of pure spectral hue, hard-edged, flashing on
  angle — which is `schiller` (2) with more domains and a narrower response. A recipe
  constant, not a recipe.
- **Thermochromism.** A colour that reports temperature. `emberwork` (6) already is
  this, with the ramp that matters; a second one would be the same shader wearing a
  laboratory coat.
- **Ferrofluid spikes, lotus-effect beading, anything that changes the silhouette.**
  These are geometry, and geometry is the one budget `SCALING.md` says is closed.

---

## What to build, in what order

Sixteen recipes and four glass presets, M-numbered to sit beside M0–M4. **They are not
grouped by how good they look; they are grouped by what they share.** A chunk written
twice is a chunk that will disagree with itself the first time either copy is tuned —
which is the argument `skyColour` and `marchReflection` have already won twice in this
codebase — so every phase below is one piece of shared machinery plus everything that
wants it.

M5 blocks all of Track A. After it, the phases are independent unless a dependency is
named, so the order past M6 can bend to whatever the game needs next.

**Every phase, before it is called done, lands the same four things**, and they are not
restated per phase: its fixtures in the Materials Gallery (an orb *and* a column or slab
where the claim differs between a turning surface and a flat one), its `check:art`
additions, its dev-panel entry where it has a knob worth turning, and the two
measurements below. No player options, by the rule already settled.

**Two numbers per phase, both of which get worse quietly.** The vertex-memory delta,
which after M5 should be *zero* for every subsequent phase and it is worth checking that
it is. And the **shared program's compile time and length** — every recipe is a branch
compiled into one shader at boot whether any prop uses it or not, and that, rather than
memory or ALU, is the real ceiling on this list. Record both after each phase; if the
boot compile starts to show, the answer is to stop adding recipes, not to make them
cheaper.

---

### M5 — the recipe lane *(infrastructure; blocks everything in Track A)*

`aRecipe`, the recipe uniform table, the gated branch, the packing in `assemble`, the
`check:art` additions (indices in range; every recipe's constants sane; recipe zero
bit-identical to today, probe-asserted the way M0's was).

Ships with **exactly two recipes**, chosen to prove the architecture rather than to look
good: `schiller` for a recipe that replaces the direct lobe, `quickmetal` for one that
replaces the environment. Both are ~20 ALU and neither needs a chunk that does not
already exist, so anything that goes wrong in this phase is the lane's fault and not a
recipe's.

*Exit: two fixtures reading at a glance in the gallery; an unfinished crate byte-identical
under the probe with the lane on and off; vertex-memory delta measured and recorded here
(expected: one byte, ~2.7 MB world).*

### M6 — the recipes that need nothing *(wants M5)*

Five, and the reason they are one phase is that between them they need no new chunk at
all: `tenebrescent`, `nacre`, `asterism`, `grating`, `pointillist`. Tenebrescent and
nacre are a handful of lines each; asterism is three evaluations of `finishD`; grating
is a spectral ramp; pointillist is M5's own cellular domains at a hundredth of the scale
with `shell`'s film in them — which is the first real test of whether recipes can share
each other's chunks, and the reason it is in this phase rather than a later one.

**The risk in this phase is sampling, and it is `grating` alone.** Its bands are narrow
and fast, which is the worst thing a surface can be in a pipeline that samples once per
chunky pixel. It must ride the footprint fade the glint stage already computes, for
`ANTIALIASING.md`'s reason, and it should be judged on a *moving* camera before it is
judged on a screenshot.

*Exit: five fixtures; grating does not crawl or alias when the camera moves past the
column at walking pace; asterism's star is legible (it will not be all it can be until
R4a moves the sun, and that is expected).*

### M7 — parallax, and the things that live under a surface *(wants M5)*

The chunk: the view direction carried into the space the specks are hashed in, and the
depth offset that follows from it. Then `aventurine`, which is the frost speck stack with
that offset and a much harder gate; and `retroreflect`, which is here rather than in M6
because the beaded version gates through the same speck field and the smooth version is
half an effect.

*Exit: the flecks visibly slide against the surface as the camera orbits the orb — the
whole claim of the phase, and one that a still frame cannot make; retroreflect is dark
until the sun is behind the camera and then is the brightest thing in the room.*

### M8 — the environment family *(wants M5; `starfall` wants `voidstone`)*

Two chunks and three recipes. The starfield, **written in `engine/Sky.ts` and exported**,
because R4c wants exactly this for the night sky and a second copy would part company
with the first — the argument `skyColour` won for the water shader, made a third time.
Then ray/box intersection, which is six divides and the cheapest analytic intersection
there is. `voidstone` on the first, `deepstone` on the second, `starfall` as voidstone
plus a clock.

*Exit: the starfield has exactly one implementation, and it is in the sky module; walking
past a deepstone fixture parallaxes its interior at the right rates and does not shear;
the three fixtures are visibly three materials and not one material at three strengths.*

### M9 — emissive finishes *(wants M5 and R3)*

The plumbing first and on its own: `uEmittersPass` in `Bloom` and in the art material,
so a finished prop can sit on `GLOW_LAYER` and contribute *only* its emissive term to
the mask. Then the ridged-noise chunk, then `emberwork` and `spiritvein` on top of it,
which differ by their ramp and by what gates them.

**Land the uniform before either recipe and verify it alone**, because its failure mode
is a crate beside the forge blooming — which reads as a bug in the recipe and is not one.

*Exit: an emberwork slab blooms at its cracks and nowhere else; a plain crate on the glow
layer beside it contributes nothing to the mask; spiritvein is invisible outdoors at noon
and obvious in an interior, with no per-zone authoring saying so.*

### M10 — the ones R4 pays for *(wants M5 and R4b)*

`alexandrite` and `skystone`. Both are a mix between two values the keyframe table will
already be interpolating, so both are nearly free and neither exists in any meaningful
form before R4b — there is only one sky to be wrong about, and only one light colour to
change under.

Worth doing as one phase because they share the question rather than the code: what a
material is allowed to read off the clock. If the answer settles here it settles for
everything after.

*Exit: scrubbing time in the dev panel walks an alexandrite fixture from teal to plum
with no snap at a keyframe boundary; a skystone at noon holds a sunset and the two
skies never blend into each other.*

### MG — the glass presets *(independent of all of it; wants M3, which is built)*

Not M-numbered in sequence because they touch a different material and can land in any
gap: `dichroic` first, as two lines in a shader that already splits its reflected and
refracted terms by fresnel; then `moonstone` and `icedglass`, each a preset plus a few
lines; then `amber`, last, because its inclusions want M7's parallax chunk and there is
no sense writing that twice either.

*Exit: four fixtures beside the existing gem, amethyst, pane and bubble; the dichroic
fixture is visibly two different colours from its two sides, which is the only one of
these that needs the fixture placed so you can walk behind it.*

---

### Status: M5–M8 built; four recipes cut in review

`art/recipes/` is the lane and the recipes, one file each; `art/finish.ts` grew the
hooks they reach through, and since MATERIAL-SYSTEM.md R4 it splices them without
naming any of them. **Asterism (5), grating (6), aventurine (8) and retroreflect (9) were
cut in review** — their indices are retired, not reused. **Nacre was renamed
`nacreous`** (same index, 4). The survivors: schiller, quickmetal, tenebrescent,
nacreous, pointillist, voidstone. `aRecipe` is one **un-normalized** byte baked by
`assemble`, and the measured cost is exactly the one predicted — one byte a vertex,
~2.7 MB across the resident world, and nothing per recipe after the first. The gallery
is `debug/galleries/materials2.ts`, twelve rows, an orb and a column apiece, hanging
off showcase slot fifteen. `uRecipeOn` sits beside the finish toggle in the dev panel;
their clocks ride the reduced-motion switch alongside the water.

**Verified under SwiftShader**, headless Chrome driving the real material: the patched
program compiles and links; a crate, a frost orb, a gilt orb, a chrome orb and a silk
drape are all **zero bytes different** with the lane on and off; every recipe differs
from its own base finish; all 45 pairs of recipes differ; and three of them render
twice to the byte, which is the no-frame-randomness guarantee.

**What the pictures changed, and none of it was visible in the numbers.** Every recipe
below passed the distinctness probe in its first form and half of them looked like
nothing at all. The harness that mattered was a contact sheet — ten orbs and ten
columns, one light, frost and gilt in the corner as the standard being measured
against — and it wants running before anything here is believed.

- **Asterism had no star, and the bug was a frame.** The fibre directions came from
  `cross(grain axis, facet normal)`, which is the anisotropy stage's tangent — a field
  that follows the *surface*. On anything curved it swirls, so each facet drew its
  arms somewhere different and no star ever assembled. Fibres in a crystal are fixed
  in the *stone*, which needs a basis anchored to the object rather than to the
  surface: `vRecipeSide` carries a second axis through the normal matrix, and the
  first one was already there.
- **Where a star sits is not where its arms point.** Fixed frame in hand, the star was
  then centred on the crystal axis, which is defensible and wrong — it meant the star
  only existed when you looked straight down that axis. On a cabochon the centre rides
  the *specular highlight* and slides across the stone as the light moves, which is
  the famous thing about them. Arms crystal-fixed, centre highlight-fixed.
- **A white star tinted by F is not a white star.** It was going through the specular
  Fresnel, and F on a wine dielectric is a dark red 0.05 — so the star rendered as a
  slightly-less-dark red patch on a dark red ball. Rutile needles are not the colour of
  the corundum around them.
- **The cell size was written down twice.** Pointillist computes a cell density in
  `recipeFilm` and the reflectance override computed it again; three tuning passes
  moved the first one and the berry never changed, because the second is the one that
  decides what the surface returns. They had drifted by a factor of five with nothing
  failing, because each is correct alone and only their disagreement is wrong. One
  `recipeCellLod()` now, called from both.
- **Restraint is the whole job, and every first draft failed it the same way.**
  Labradorite is a *dark grey stone* that goes blue in one place for a moment;
  the first pass shimmered everywhere in every colour and was an oil slick. A pearl is
  a warm near-white with a wash over it; iridescence at 0.95 made it a soap bubble, and
  what actually says nacre is the orient and the curved growth lines, with the film at
  a quarter strength. That fruit is *blue*, with a few gold cells; a uniform draw over
  a full-spectrum ramp is confetti, and cubing it puts four cells in five back in the
  blues. Iris agate shows its fan in one small place you have to turn the stone to
  find. **Every one of these got better by taking colour away and putting structure
  in.**
- **A probe with a black sky proves nothing about a mirror.** `skyUniforms` default to
  unset colours, so `skyColour` returns black in every direction — and `quickmetal`,
  whose entire recipe is leaning the reflected ray, measured as *zero bytes different*
  from its own base. So did `retroreflect`, for the matching reason: it was being
  measured with the sun in front of it, which is the geometry in which a
  retroreflector is switched off. Both read exactly like a term that was never wired.
  The probe now sets a real sky and shoots the sun from two positions.
- **The world check needs a bigger heap now.** Twenty rows at eight instances is a lot
  of geometry for a tool that builds every zone in the game at once, and
  `check:world` went from passing to a heap exhaustion. `--max-old-space-size=8192` in
  the script; it passes.

### The three faults they all shared, and the fixes

Three causes, each producing the same fault on all ten recipes.

**The white triangles were the environment, not the specular lobe.** `skyColour`
draws the sun as a disc inside a 260-power halo, and a flat-shaded facet has one
reflected direction — so a facet whose direction lands on the sun returns `uSunColor`
over its whole area. `Sky.ts` now exposes `skyColourWithSun(dir, sunScale)`, with
`skyColour` a wrapper at scale 1, so nothing else moves; `recipeSunGlare` sets the
scale per recipe. The environment is also sampled off the smooth normal for recipes,
so a reflection is a gradient over the stone rather than one flat triangle per face.

**`dot(N, H)` and `dot(N, V)` are constant across a flat-shaded facet**, so every
recipe keyed on them produced triangle-shaped patches — the "pixelated, blocky"
complaint — and lived only in the specular highlight. Recipes are now driven by
object-space position and object-space directions: `vRecipeView`, and
`recipeToObject()` for the lights. Where a surface normal is genuinely needed,
`recipeSmoothNormal()` is the interpolated attribute normal — smooth on lathes and
subdivided polyhedra, the face normal on a box, so flat-sided props are unaffected.

**A structure keyed on the half vector exists only where the sun is.** A lamella has
an orientation in the crystal and a copper flake has one in the glass; neither cares
where the facet points. Each recipe now answers a direction of its own, evaluated
twice — against the light for the peak, against the eye for coverage. The probe
measures this directly: what share of the *shaded* side each recipe reaches, counted
in blocks so a field of discrete specks is judged by the same question as a
continuous term.

Per recipe, the substantive changes: schiller floods per-domain plane with three
clocks and lamellae inside each domain; asterism's needles lie in the tangent plane,
which is what puts the hub on the highlight and gives six arms instead of one curved
streak, in a rose-silver taken from the body; grating returns a multiplier centred on
one, so orders colour the bright region instead of blowing out with it; nacre's
orient runs off a smooth view angle; pointillist's cells come from a Worley lattice
and are shaded as domes; aventurine has its own flake field with per-flake planes,
replacing the borrowed frost stack; retroreflect's bead field is played by the
alignment — brightness, colour temperature and bloom; quickmetal shades from its own
flow gradient and catches a specular on the crests; voidstone's three star layers
drift on their own axes at their own rates, with slow two-beat twinkle on resolvable
stars, dust lanes and three nebula layers.

**Verified under SwiftShader**: nine pre-existing finishes render **zero bytes
different** with the lane on and off; every recipe reaches 95–100% of the shaded
side; no recipe blows a region to white; all 45 pairs differ; four animated recipes
render twice to the byte.

**`check:world` builds every zone in the game and takes minutes.** It is not a
sensible check for a shader change and should not be run for one.

**Still owed: eyes in the running game.** Six of these are about motion and every
judgement above came from stills.

### Dependency summary

```
M5 (the recipe lane) ──┬──► M6  free recipes  — tenebrescent, nacre, asterism,
                       │                        grating, pointillist
                       ├──► M7  parallax      — aventurine, retroreflect
                       ├──► M8  environment   — voidstone, deepstone, starfall
                       ├──► M9  emissive      — emberwork, spiritvein   ◄─ R3
                       └──► M10 the clock     — alexandrite, skystone   ◄─ R4b

MG (glass presets) — independent: dichroic, moonstone, icedglass, then amber ◄─ M7

Value improves with R4a: asterism (a star wants a moving sun).
Chunks shared outward: M8's starfield → R4c's night sky.
```

### If it is cut short

**The one phase that must not be skipped is M5**, and not because of the recipes in it —
because a second recipe added without the lane means a fourth attribute, and then the
memory argument at the top of this document has been lost by accident rather than
decided.

If only three recipes are ever built, the recommendation is **`schiller` (M5),
`deepstone` (M8) and `dichroic` (MG)**: one for the direct lobe, one for the environment,
one for the transmissive material. Each proves a different third of the architecture,
and none needs anything that does not already exist.

If only *one* phase after M5 is ever built, make it **M6** — five materials for no new
machinery is the best ratio in this document, and it is the phase that tells you whether
the recipe table was worth building at all.

Player options: **none**, by the rule already settled — a finish is what a prop is made
of. The animated recipes (`quickmetal`, and frost's existing glide) should read the
reduced-motion uniform, which is an accessibility control and not a video one.

**And the whole set is still owed eyes.** M0–M2's status blocks are unanimous on this
point and it cost them two rounds of tuning against a harness that was photographing
the wrong renderer: every claim in this document about what something *looks like* is
an argument until somebody stands in the gallery and looks at it.

---

## Where the second-pass ideas came from

Recipes 12–16 and several of the glass presets are real optical phenomena rather than
invented ones, which is worth saying because it is why they are specific enough to
implement. The mechanisms above are paraphrased from:

- [Structures Behind the Spectacle: Optical Effects in Phenomenal Gemstones](https://www.gia.edu/gems-gemology/summer-2025-phenomenal-gemstones) and
  [G&G in a Flash: Guide to Phenomenal Gems](https://www.gia.edu/gems-gemology-summary-guide-to-phenomenal-gems) — GIA's survey of the
  named phenomena and the nanotextures under them; the best single source for this list.
- [Adularescence](https://en.wikipedia.org/wiki/Adularescence) and
  [Aventurescence](https://en.wikipedia.org/wiki/Aventurescence) — moonstone's
  layer-scattering glow, and the oriented platelet inclusions behind recipe 1.
- [A gift from nature: the 10 optical phenomena of gemmology](https://www.jewellerybusiness.com/gemstonesgemmology/a-gift-from-nature-the-10-optical-phenomena-of-gemmology/)
  and [10 Unique Gemstone Optical Effects](https://www.geologyin.com/2024/06/gemstones-special-effects.html) — the wider list, including
  tenebrescence (recipe 13) and the alexandrite colour change (recipe 14).
- [Iris Agate](https://geology.com/stories/13/iris-agate/) — the diffraction-grating
  effect of microscopic growth layers, which is recipe 12; and
  [Rainbow obsidian](https://www.geologyin.com/2020/09/rainbow-obsidian.html) and
  [Fire agate](https://en.wikipedia.org/wiki/Fire_agate) for the thin-film-in-a-body
  variants parked above.
- [Pointillist structural color in Pollia fruit](https://www.pnas.org/doi/10.1073/pnas.1210105109)
  (PNAS) — recipe 16, and specifically the finding that the layer thickness differs
  from cell to cell, which is the whole reason that fruit looks pixelated.
- [Cat's Eyes, Institute of Making](https://www.instituteofmaking.org.uk/materials-library/library/cats-eyes)
  — retroreflection and the tapetum lucidum, recipe 15.
