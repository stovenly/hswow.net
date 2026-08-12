# The material system: looks as data, programs as a constant

The refactor that takes the recipe lane the rest of the way to how glitch and
horror already work: **one body of shader code, always the same programs, and
every individual look expressed as rows of data**. Adding a material stops
costing a program, a compile, or a bar — it costs a table row.

Supersedes the forward-looking half of [MATERIAL-RECIPES.md](MATERIAL-RECIPES.md);
builds on ZONE-LOADING.md Phases C and E, which it partly retires.
The `exotic` vocabulary is gone from the codebase as of the R0 sweep — there
are no exotic materials, only materials, and sometimes they show up.

---

## The review, and what it found

Why glitch scales and materials don't, stated precisely. Glitch is fifteen
effects compiled into every art program, ungated, once. What varies —
placement, strength, seed, which effects — lives in a 16-slot uniform table
(`uGlitch*`), and membership (a world-space volume test or an owner id) selects
a row per vertex. Adding a haunted room writes a row. Horror is the same
architecture with its own bank. **Program count is a constant; content is
data.**

The recipe lane is halfway there, and the review found the half that exists is
bigger than it looks:

1. **Selection is already data.** `aRecipe` is a per-vertex byte; `isRecipe()`
   compares it. One program already serves any mix of recipes per prop. This is
   the part glitch calls membership, and it is done.

2. **The response knobs are already a table — stored in the wrong place.**
   `recipeGloss / recipeRim / recipeSunGlare / recipeEnvGain / recipeFilmMix`
   and the speck-field knobs are per-recipe constants, but they are *spliced
   branches* in finish.ts (`if (isRecipe(1.0)) { recipeGloss = 0.0; … }`), so
   which recipes a program carries changes its source bytes. Move the constants
   into a uniform table indexed by the byte and the branches disappear.

3. **The palettes are five copies of one function.** `recipeLabradorTint`,
   `recipeBerryTint`, `recipeStarTint`, the tenebrescent burn ramp and
   `finishIceTint` are all the same shape — a chain of `mix(…, smoothstep(e0,
   e1, t))` stops with different constants. One ramp chunk reading stops from a
   uniform table replaces all five, and recolouring a material becomes a data
   edit (and a live dev-slider, which none of them has ever had).

4. **The shared field kit already exists.** `recipeWarp`, `recipeHash3`,
   `recipeCell`, `recipeFbm`, `recipeDrift`, `recipeFootprint`, `recipeKnee`,
   the tilt matrix — about 110 of the ~570 lines of recipe GLSL are already
   generic primitives. The six recipes sit on top as bespoke code.

5. **The fields are genuinely code, and stay code.** A Worley berry skin, a
   lamellar flood, a starfield behind glass — these do not share math that a
   parameter can select between. This is the honest limit of the glitch
   parallel: glitch's fifteen effects are also code. In both systems, *what an
   effect is* is code and *where/how strongly/in what colour it appears* is
   data. The refactor moves everything in the second category out of the
   program source; it does not pretend the first category can follow.

6. **The fat-program fear is already disproven in this repo.** `applyGlitch`
   and `applyHorror` are ungated on every art material including the lean one,
   and always have been. The pre-Phase-C shader carried every recipe and every
   feature unconditionally and shipped fine. Registers for mutually exclusive
   branches coalesce — a union program costs about its heaviest member, not the
   sum. The union end state below is the shader the game already ran on, minus
   dead weight, plus everything learned since.

7. **Glitch and horror duplicate each other.** The membership loop — owner-id
   gate, sphere/box test, underside cut, strongest-volume-wins — exists twice,
   once per system, differing only in uniform names and the horror feather.
   Their hashes are also re-declared per file. The shared-chunk phase folds
   both onto one source.

**Feasibility verdict: yes, with one boundary.** Program count becomes a small
constant (two per light tier: lean and union) and never again a function of
content. New looks assembled from existing fields — a recolour, a different
density, a different pitch, any knob/ramp change — are pure data, no compile,
no code. A genuinely new optical *structure* is a new field function: code,
reviewed once, compiled into the union once, and from then on free. That
boundary is the same one glitch lives with, and it has never hurt glitch.

---

## The target model

```
FIELDS   (code, compiled always)   cellular · lamellar · flow · bloom · scene …
SLOTS    (code, fixed hooks)       body / thickness / film / surface / direct /
                                   envBend / envSource / ambient
KNOBS    (uniform table, by byte)  gloss · rim · sunGlare · envGain
PARAMS   (uniform table, by byte)  ramp row · p0 · p1 · p2, named by the field
RAMPS    (texture, one row each)   ramps of any length, one fetch to read
MEMBER   (per-vertex byte)         aRecipe selects the knob row, the param row,
                                   and — by contiguous span — the field branch
```

A material = a `FINISHES` entry (base lobe parameters, as always) + a knob row +
a param row + which field code answers its byte. **Only the last is code**, and
one field's code serves every look built on it.

*As built. The plan named six slots and there turned out to be eight, the knobs
and params are two vec4 of one table, and the ramps left the uniform banks
entirely — R4 and R6 say why each of those moved.*

---

## Phases

Every phase that touches GLSL invalidates the browser's disk shader cache once
(it keys on exact source bytes). Land phases in bundles, not dribbles, and
never interpolate anything non-deterministic into shader source — the
byte-stability rule from ZONE-LOADING.md stands throughout.

### R0 — the vocabulary *(landed)*

`exotic` removed from the codebase entirely: `art/exotic.ts` →
`art/recipes.ts`, `aExotic` → `aRecipe`, `EXOTICS` → `RECIPE_INDEX`,
`EXOTIC_RECIPES` → `RECIPES`, `isExotic` → `isRecipe`, `uExoticOn/Motion` →
`uRecipeOn/Motion`, `Finish.exotic` → `Finish.recipe`, `setExotics` →
`setRecipes`, every `exotic*` GLSL identifier → `recipe*`, all varyings, docs
and comments swept (EXOTIC-MATERIALS.md → MATERIAL-RECIPES.md). Verified:
zero case-insensitive matches outside git history, tsc clean, build clean.

### R1 — one material per room *(landed)*

**Goal:** the compile a cold room gates on stops being one program per finish
and becomes one program, full stop.

**As landed:** `dressArtMesh` no longer decides anything — it hands out the
lean material and stamps `mesh.userData.finishMask`. `pendingRoomFinish(root)`
(art/sway.ts) walks a built room once, unions the declared masks, and returns
the meshes waiting plus a one-mesh invisible probe carrying the union variant;
`dressRoom` hands the material out and marks the root. `enter()` calls the
first before its pre-swap compile and the second after, in place of the Phase E
pair. The variant cache stays keyed by mask, so two rooms with the same union
share one program, and a union already compiled comes back with no probe.

The root is marked in `dressRoom` rather than in the walk, so an entry
abandoned mid-compile leaves the room undressed for the next one to retry
rather than stranding it lean forever.

**What it costs:** a prop with a cheap finish in a room with an expensive one
runs the expensive program's occupancy. Accepted on the R5 evidence; the
per-prop masks stay stamped on both mesh and geometry, so reverting to per-prop
variants is a one-line policy change if a weak GPU ever says otherwise.

**Verified** with a throwaway probe over the real galleries: materials-gallery-2
declares six distinct masks across 96 finished meshes and now gates on **one**
program (union 1014); all 96 end on one material, its 12 plain art meshes stay
lean, a twin room needs no second compile, materials-gallery-1's different
union (15) gets its own, an abandoned entry retries, a dressed room has nothing
pending, and a room with no finishes offers no probe.

### R2 — knobs into a uniform table *(landed)*

**Goal:** program source stops varying by *which* recipes are in the mask —
only by which field code is included.

**As landed:** `RecipeKnobs` (gloss, rim, sunGlare, envGain) is a registry
member — `Recipe.knobs`, a partial over `PLAIN_KNOBS` — resolved into
`RECIPE_KNOBS` and written to `uRecipeKnobs[16]`, one vec4 row indexed
directly by the recipe byte. The six spliced constant blocks in finish.ts
became one indexed read, clamped because the byte arrives as an attribute and
an index off the end is undefined. Values are the old constants verbatim,
checked against them.

Row 0 is not a material, it is the absence of one: it holds the plain-finish
values, so a fragment with no recipe and the whole table with `uRecipeOn` off
both land on today's answers without a comparison per recipe. Every unclaimed
row carries the same, so a stray byte draws an ordinary surface rather than a
black one. The GLSL globals are still initialised in source — a lean program
has no bank to read — but from `PLAIN_KNOBS` rather than by hand, so the two
cannot drift.

**The knob docs moved with the knobs.** Why almost every stone wants a
fraction of the plain lobe, where the white triangles were actually coming
from, why a smooth recipe needs its rim pulled back — that is written up on
`RecipeKnobs` in art/recipes.ts now, beside the numbers it explains, instead
of on four globals in the middle of a shader.

**Deviation from the plan above:** the speck knobs
(`finishSpeckParallax/Lively/Spread/Gate`) and `recipeFilmMix` stayed put.
They read like per-recipe knobs but nothing overrides them — they are hooks
with one value each, spliced identically into every program, so they never
made source vary and moving them would have bought a second uniform bank and
nothing else. The mechanism is there the day a recipe wants sealed specks
instead of weather: give it a row.

**Uniform budget, noted because it is not free:** the bank is 16 vec4 on a
recipe-carrying program and zero on a lean one. Glitch and horror already
declare four banks of 16 each on every art fragment shader — 128 vec4 before
this — so the union sits around 144 against a GLES3 floor of 224. Comfortable
on anything this game targets; R3's ramps did add a bank, and the running
total is kept there.

**Verified** by a throwaway probe, 52 assertions: each row equals the
constants parsed back out of the previous commit's finish.ts; each lands at
its own byte; unclaimed rows are the plain row; a GUI edit reaches the bank;
the union declares and reads the bank exactly once and carries no surviving
per-recipe constant; **the knob block is byte-identical across all six
single-recipe masks and the union** — which is the phase's actual claim; the
lean program declares no bank; braces balance and no template marker or
backtick escapes into the source for lean, union and single-recipe masks; and
no GLSL reserved word is declared anywhere in the union (with a self-test
proving the scanner fires on a planted `float flat`).

**The dev folder:** `material finish → recipe knobs`, a subfolder per recipe,
four sliders each. Twenty-four values that until now could only be changed by
editing GLSL and reloading.

### R3 — ramps into a table *(landed)*

**Goal:** colour becomes data; the five ramp functions become one chunk.

**As landed:** `src/art/ramp.ts` holds the five ramps as data — a base colour,
up to four stops of `(start, end, rgb)` mixed over it in order, and a pull
toward grey — and one GLSL function `rampColour(int row, float t)` runs that
chain reading `uRampStops`. `recipeLabradorTint`, `recipeStarTint` and
`finishIceTint` are gone entirely, their call sites naming a row instead;
`recipeBerryTint` and `recipeBurn` keep their wrappers because what they do
before the ramp — thinning by view angle, threshold grain and creep — is not
ramp business. Every number was lifted verbatim and checked against the
previous commit.

**The overlap was the whole risk, and it was real.** These are not gradients
between neighbouring stops: labrador's second window opens at 0.44 while its
first closed at 0.36, burn's third opens at 0.52 before its second closes at
0.55. Every stop is mixed over whatever the chain has produced so far, so
where two windows overlap three colours are in play and the *order* decides
the hue. The evaluator runs the same chain in the same order, which is why
this is a port and not a re-tune.

**Deviation from the plan above:** the row a material reads is a constant
interpolated into its GLSL, not a field on `RecipeKnobs`. Which ramp a recipe
uses is registry data either way — only the binding time differs — and the
recipe's own source is already generated per recipe, so a literal costs no
uniform slot, no dynamic index and no vec4 of knob bank doubled to hold
numbers that never change. The ice ramp settles it: frost is a finish feature
with no recipe byte at all, so there is no knob row for it to live in. `grey`
is stored as the pull rather than as what survives it, so the four ramps that
do not want it mix by zero — the identity however a driver spells `mix`.

**Layout:** six vec4 per ramp — the base with the grey pull in its `w`, four
stop colours each carrying the `t` it starts at, then the four `t` they finish
at. Unused stops sit in a window past 1 and change nothing, so the evaluator
is one loop with a constant bound and no per-ramp count. Thirty rows for five
ramps, spliced wherever a ramp is read: any recipe, or frost on its own.

**Uniform budget:** 30 vec4 on a program that reads a ramp, on top of R2's 16
and the 128 glitch and horror already declare — about 174 against a GLES3
floor of 224, and zero on a program with neither frost nor a recipe. This is
now the number to watch: R4 adds no bank, but a sixth ramp costs six more
rows, and if the floor is ever the real constraint the packing has room (three
of the five ramps use only three stops).

R4 measured it rather than estimating it, and the estimate was right: the
fragment stage is 46 + 64 + 64 = **174** exactly, and R4 left it there. The
vertex stage — which has its own budget, and which nothing above counted — is
glitch's 64 plus horror's 80 = **144** against a floor of 256.

**Verified** by a throwaway probe, 95 assertions: each ramp diffed against its
closed form, hand-transcribed from the shader it replaces, at 2001 values of t
plus four outside 0..1 — **bit-identical on berry, star, burn and ice, and
within a third of a float32 ulp on labrador**, which is the one whose grey
pull is re-associated; every base, stop, window and pull equal to the
constants parsed back out of the previous commit; the bank layout the shader
indexes; padding stops past 1; a GUI edit reaching the bank; the evaluator
byte-identical across frost-alone, each of the six single-recipe masks and the
union; all seven call sites naming an integer row start that is a real ramp;
no surviving hand-written constant (`0.3333` appears exactly once, in the
evaluator); a lean program declaring neither bank nor evaluator; frost alone
getting the evaluator without dragging in the recipe kit; braces balanced and
no template marker or backtick leaking into source; and the reserved-word scan
with its self-test.

**The dev folder:** `material finish → ramps`, a subfolder per ramp with a
base swatch, a grey slider and a folder per stop — colour, start, end. A
recoloured pointillist is now a swatch drag, and the first material added for
zero code is one row in `RAMPS`.

### R4 — fields into slots, primitives into one library *(landed)*

**Goal:** the structural half becomes a registry of small chunks; new recipes
stop touching finish.ts.

**What landed, materials:** `src/art/recipes.ts` is now `src/art/recipes/`,
one file per recipe. Each holds its helpers, its knob row, and the blocks it
splices into the finish stage; `index.ts` holds the registry and the
dispatchers; `types.ts` holds the shape both need. Every `if (isRecipe(N))`
block that stood in finish.ts moved to the recipe that owns it, and finish.ts
now splices one dispatcher per hook without knowing what is in it. **It no
longer contains the name of a single recipe, nor one `isRecipe` guard, nor one
call into a recipe's helpers** — that is the phase, in one sentence.

**Deviation from the plan above, on the slots.** The plan named six hooks; the
code had eight. `surface` is two positions, not one — the diffuse body before
the film and F0 are worked out (schiller's seam) and the reflectance after
(pointillist's cells) — so it is `body` and `surface`. The film is two more:
`thickness`, an expression feeding `recipeFilm`, and `film`, a statement over
the computed colour, both nacreous's. And `grade` does not exist: the one
thing that grades a lit result (tenebrescent's burn) does it inside `ambient`,
where the value it needs already is. So: `body`, `thickness`, `film`,
`surface`, `direct`, `envBend`, `envSource`, `ambient`.

**Deviation, on the dispatchers.** The plan said slot *functions*. They are
inline splices instead. A function would have to be handed every local the
block reads — `directLight`, `reflectedLight`, `halfObj`, `smoothNL`,
`finishEnv`, `envLuma`, `neutral`, `film`, `finishF0` — as arguments, which is
nine chances to pass the wrong one for no gain, since the blocks are already
written against exactly those names. Spliced inline, a slot reaches precisely
what the hand-written block beside it reached, and the emitted program is the
same statements it always was. That is what made the acceptance test below
possible at all.

**What landed, cross-system:** `src/art/glsl/` — `ramp.ts` (moved there,
unchanged), `hash.ts`, `volume.ts` and `text.ts`. The hashes are *generators*,
not bodies: `sinHash2`, `sinHash31`, `sinHash2x3`, `sinHash3` and `pcgHash3`
emit a named declaration from constants the call site still writes down. That
is the distinction the plan asked for — the shape is single-sourced, the
constants stay local, because a hash's constants are a look and reseeding one
moves every speck it scatters. Glitch and horror each declared theirs twice
(vertex and fragment) and now declare them once. The membership loop —
sphere-or-box, feathered over the outer third, owned volumes taking their
object whole, underside a cut not a fade — was four copies and is now one
chunk with four splices.

**One arithmetic change, and it is exact.** Glitch's owned branch selected
`uGlitchSize[i].w` or zero; it now selects 1 or 0 and multiplies, which is the
form horror already used and the only way one body serves both. `1.0 * x == x`
and `0.0 * x == 0.0` for every finite `x`, and that `w` is `min(strength ×
burst, 1)`, so the values are identical rather than close.

**Acceptance, run:** the emitted fragment program was captured for **all 1024
masks** before and after. Comments stripped, every `isRecipe` block lifted out:
the remaining scaffolding is **identical**, and within each hook, each recipe's
statements are **identical**. 6401 assertions, none failed. What differs is the
order of blocks *between* recipes — they splice in registry order now rather
than in the order they were typed — and one fragment carries one recipe byte
against guards on distinct constants, so at most one block per hook runs and
the permutation cannot be observed. The one merge (quickmetal's environment
knee, which stood after the chain and is now the last line of quickmetal's own
arm of it) is asserted separately: the probe checks that what sat between the
two was the chain's final `else` arm, which an arm already taken cannot enter.
The comparison was self-tested by mutating two constants in the output — one
inside a recipe block, one in the scaffolding — and confirming it failed.

A second probe, 197 assertions: finish.ts naming no recipe and calling none of
their helpers; a fabricated seventh recipe filling all eight slots and reaching
the emitted program through the same dispatchers, with nothing edited; every
registered slot appearing in the union exactly once and in no lean program;
each recipe alone dragging in no other; the hash generators reproducing, byte
for byte, the declarations they replace, read back out of the previous commit;
each system's two stages proved to be one membership body by substituting one
stage's arguments into the other's output; the reserved-word scan with its
self-test; braces, backticks and template markers; and the register count.

Glitch and horror were diffed the same way: the whole change is the feather
split above and two comments the shared chunk carries that the fragment copies
had lost.

**What is still finish.ts's:** the named finishes. `FINISHES` is the palette a
prop picks a look from, so a new recipe that wants a name gets a row there —
one line of table, not a line of shader. Nothing else about it comes back.

### R5 — the standing set *(landed)*

**Goal:** the compile story ends: two art programs per light tier, ever,
compiled at boot behind the loader.

**What landed:** `ART_FINISHED_MATERIAL` stands beside `ART_MATERIAL` in
`art/assemble.ts`, and `patchArtMaterial` runs the same chain over both — mask
0 on one, `FINISH_MASK_ALL` on the other — at boot, from `main.ts`. A prop that
declared any finish takes the finished one; everything else takes the lean one;
`dressArtMesh` decides it from the mask when the mesh is made, and nothing
decides anything about materials afterwards. The mask is still stamped and now
gates nothing at runtime, which is what the revert path below wants.

**Retired:** `artMaterialFor`, the `ART_VARIANTS` cache, the `COMPILED` set,
`RoomFinish`, `pendingRoomFinish`, `dressRoom`, the `finishUnion` marker on the
root, and — in `ZoneManager.enter` — the probe being hung off the root, the
`try`/`finally` that took it down again, and the second pass that handed
materials out after the compile. That last one is now three lines shorter than
it was before R1 ever touched it. ZONE-LOADING Phase E is marked retired, with
the sequence kept.

**Deviation: the retire list named machinery that R1 had already replaced.**
`pendingArtProbe` and `resolveArtVariants` were gone before this phase started;
what actually stood there was R1's `pendingRoomFinish` and `dressRoom`. Same
job, one generation on, and retired here.

**Deviation: nothing is force-compiled at boot, and nothing needs to be.** The
plan said the union variant is "compiled once at boot alongside `ART_MATERIAL`",
which would take a boot-time compile pass that does not exist — `ART_MATERIAL`
is not force-compiled at boot either. It compiles with the first zone that uses
it, behind the loading bar, because `enter()` compiles the whole root before the
swap and every mesh in that root already carries its final material. The goal —
no program ever compiled on a rendering frame — holds without adding anything,
which is the correct amount of machinery for a deletion phase.

**What it costs, precisely:** a mesh that declares a finish now runs the program
with every finish in it rather than the one its *room* unioned to. Plain meshes
are untouched and still take the lean material, exactly as under R1 — R1 only
ever upgraded the meshes that declared something, and so does this. So the
change is per-room union → global union, on those meshes alone.

**Verified** by a throwaway probe, 78 assertions: two materials with two
distinct program keys; every stage present on both; every recipe, both uniform
banks and all four gated features present on the finished one and absent from
the lean one; `dressArtMesh` returning the right material and the right stamp
for mask 0 and seven nonzero masks; and every retired name absent from both
files. **R5 changed no shader source** — asked of `git diff` against the R4
commit for `art/finish.ts`, `art/recipes/` and `art/glsl/` rather than of a
captured artefact, so it cannot pass by comparing R5's output with R5's.

**The decision point, taken.** If profiling on the weakest target GPU ever shows
the union hurting fill rate, the revert is `dressArtMesh` handing out
`artMaterialFor(mask)` again — which is why the mask is still stamped on the
mesh and on its geometry. Every other phase is unaffected either way.

### R6 — variants: a look is a row *(landed)*

**Goal:** the half of "adding a material costs a table row" that R3 promised and
could not deliver. Six phases in, the *response* to light was data and the
*structure* was code — and the **colour was still code**, because the ramp a
recipe read was a constant interpolated into its own GLSL.

**The diagnosis.** The recipe byte did three jobs at once:

1. selected which field code runs — `isRecipe(7.0)`, `recipes/shared.ts`
2. indexed the knob row — already a uniform table, `finish.ts`, R2
3. picked the ramp, and every per-look scalar — and these were still literals:
   `rampColour(${RAMP_ROW.berry}, …)` and `const float density = 26.0`, both in
   the file that is now `recipes/stained-glass.ts`

Only job 1 has to be code. Job 2 was already data. Job 3 is the same *kind* of
thing as job 2 and sat in the source for one historical reason: when R3 bound
the row, one recipe meant one ramp, so a literal cost nothing and bought a saved
uniform slot. That trade had gone backwards. The consequence was that two
finishes sharing a recipe byte could differ in the base lobe under them and **in
nothing else** — a blue stained glass beside a green one was a new byte, a new
file and a shader recompile for every player, for a change that is four colours.

**What landed: nine fields carrying twenty-four looks**, of which eighteen are
new, across a rebuilt colour table, a widened uniform row, three new scenes and a
wing of seven rooms to read them in.

#### R6a — the ramps left the uniform bank

**Forced, not chosen.** The looks below want seventeen more ramps. At six vec4
each that is 102 on top of the old 30, against a fragment stage standing at 174
of a GLES3 floor of 224 — so the new ramps alone would have put it at 276 before
the variant table was counted at all. There is no packing that saves that. The
bank was the wrong home for a table meant to grow.

**As landed:** `uRampLut`, one `RGBA16F` data texture, 512 wide and one row per
ramp. `RAMPS`, `RampStop` and the stop chain are unchanged and are evaluated
**on the CPU** by `rampAt`; `rampColour(float row, float t)` is a single
`texture2D` fetch. Twenty-two ramps at 512 samples is 88 KB, and the dev sliders
re-bake on change as they used to re-upload.

**Cheaper than what it replaced**, which was not the reason and is worth having:
one fetch against six uniform reads, four `smoothstep`s and four `mix`es.
Voidstone is where that lands — it reads a ramp up to twenty-four times a
fragment inside its two star loops.

**The row arrives as a V coordinate**, `(index + 0.5) / height`, precomputed and
carried in the variant row. So nothing dynamically indexes an array anywhere in
the system now, and `LinearFilter` sampled at an exact texel centre in V returns
that row rather than a blend of it and its neighbour — the one way to get this
wrong, and it fails as one colorway bleeding into the next. `t` is mapped by the
inverse of the bake, so sample 0 is `t = 0` and sample 511 is `t = 1` exactly.

**The four-stop limit went with it.** `STOPS` was a shader constant because the
evaluator was a loop with a constant bound. Only the CPU sees the stop list now,
so `spectrolite` has five and `silver` has one.

**Deviation: half-float, not float.** Linear filtering of `RGBA16F` is core in
WebGL2; `RGBA32F` needs `OES_texture_float_linear`, which is not an extension a
colour table should have to ask for. A 10-bit mantissa over 0..1 is about the
same error again as the sampling, and both are in the measurement below.

**What it cost, and this is the honest one: R6 is the first phase in the series
that changes pixels.** R3 was bit-identical on four ramps and within a third of
a float32 ulp on the fifth, because it was a port. A 512-sample lookup with
linear interpolation between half-float samples is not a port. **Measured**
against the analytic chain at 2001 values of `t` on all twenty-two ramps: worst
channel error **3.32e-4**, which is **0.085 of an 8-bit step**, at `lapispane`
t = 0.864 — the sharpest shoulder in the set, which is where it should be. That
is a bound at the ramp; whatever multiplies it multiplies the error, so
`LUT_WIDTH` is a constant to raise if a scene ever shows a facet.

#### R6b — the variant table

**As landed:** the knob row is one vec4 as before, and `uRecipeVar` stands beside
it holding `(rampV, p0, p1, p2)`. `Recipe` means *field* and gained `variants`: a
name, a byte, a ramp, knob overrides and three params. `FINISHES` entries name a
look. Where a recipe held a `const float` that was a **look** it became
`recipeParam`-style accessor named by its field; where it held one that is a
**law** — the Bragg cell hash offsets, the drift axes, the tilt matrix — it
stayed a constant, and that distinction was the phase's only real judgement.

**Guards became spans.** A field's block runs for any of its looks' bytes, so
`isRecipe(7.0)` became `isField(lo, hi)` — two compares against a subtract, an
`abs` and a compare. The rewrite is proved over all 256 values the attribute can
hold: every claimed byte reaches exactly one field, every unclaimed byte reaches
none.

**Renumbered, and the comment that said not to was out of date.**
`RECIPE_INDEX`'s note claimed the bytes were baked into geometry; `assemble`
writes them from the table on every build and nothing serialises a
`BufferGeometry`, so a byte lives exactly as long as the process does. It is
`VARIANT_INDEX` now, contiguous by field, and the retired 5/6/8/9 came back.

**Deviation: `Recipe.shared`.** Four scenes share the drift rotation, the sun and
the deck projection, and four copies of a function declaration will not compile.
A field may now carry a `shared` block that `recipeGlsl` emits **once**,
deduplicated by identity, however many of its family are in the mask. Asserted:
four scenes in one mask, one `recipeDrift`, one `sceneSun`.

**Deviation: contiguity is asserted at module load, not tested.** A gap inside a
span is silent and severe — a byte belonging to nobody, falling between two of a
field's looks, would run that field's shader against a row of zeros. `FIELD_SPAN`
throws on it, because there is no version of this that should ship broken.

**Deviation: the table is 28 rows, not 32.** Three scene fields arrived with the
wing, and a round of pruning took the look count back down; twenty-five bytes are
claimed. **Measured** at 56 vec4 of recipe table and zero of ramp, so the fragment
stage is 128 (glitch and horror, untouched) plus 56 = **184 of 224**, against 174
before. Better than the plan's estimate of 192, because the ramps leaving paid for
more than the variant row cost. The vertex stage is untouched at 144 of 256.
Three spare rows.

**Deviation: "no look costs a program" needed splitting in two**, because as
written it was too strong and the probe caught it.

- **At runtime it is unconditional.** R5 left two standing materials and the mask
  stops at the door: all twenty-four looks take `ART_FINISHED_MATERIAL`.
  Asserted, one look at a time.
- **In the emitted source it holds per mask, not per look.** Two looks of one
  field can emit different text — `moonsheen` declares translucency and
  `labradorite` does not, so their *base lobes* pull in a different gated
  feature. That was true of finishes before any of this and has nothing to do
  with being a look. Grouped by mask, every field emits exactly one program, and
  the four stained-glass looks — which differ in nothing but their rows — emit
  one program between them.

**And the thing that actually scales: no changed source byte.** Once colour left
the source, adding a colorway stopped invalidating the browser's shader cache.
Every phase before this one cost every player one recompile; the next colorway
costs nothing at all.

#### R6c — the named looks

Twenty-four looks over nine fields. **None of them is a line of GLSL.**

The base finishes were renamed with them, because the recipe looks had been
named for the *material* all along while the base set was still named for the
term it isolated: `bronze` not `polished`, `platinum` not `brushed`, `iridescent`
not `shell`. `quartz` is the plain dielectric the old `marble` was, and `marble`
is the translucent one — which is what marble actually is.

**schiller** *(labradorite)* — params `domain` (how fine the domains are), `band`
(how much of the stone is alight at once), `pitch` (lamella pitch).

| Look | Ramp | domain · band · pitch |
|---|---|---|
| `labradorite` | labrador | 1 · 1 · 1 — the identity row, which it has to be or the factoring was wrong |
| `spectrolite` | spectrolite | 0.85 · **1.8** · 0.9 — wide bands and the grey pull off; stops reading as rock |
| `moonsheen` | moonsheen | **0.6** · **0.5** · 0.7 — one broad sheet at a time, which is adularescence, not schiller |
| `sunstone` | sunstone | **2.2** · 0.9 · 1.6 — many small domains, so the flood breaks into glitter |

**quickmetal** *(mercury)* — params `flow`, `invert`, `wobble`. The metal's own
cast became a ramp, replacing a two-colour `mix`.

| Look | Ramp | flow · invert · wobble |
|---|---|---|
| `quicksilver` | silver | 1 · 0 · 1 |
| `nightsilver` | nightmetal | 0.9 · **1** · 1 — the invented world turned over: black above, molten below |
| `slowbrass` | brass | **0.35** · 0 · 0.8 — mercury's *motion* is most of what makes it mercury |
| `stillglass` | silver | **0.04** · 0 · 0.55 — nearly frozen, and the wobble pulled back with it |

The inversion is one line: `quickUp(y)` returns `y * (1 - 2 * invert)`, and the
surroundings are keyed on nothing but elevation, so mirroring the height mirrors
the world. A lerp rather than a branch, so it can also sit halfway — where the
horizon flash doubles and the mirror reads as a slot.

**tenebrescent** — params `gain`, `invert`, `creep`.

| Look | Ramp | gain · invert · creep |
|---|---|---|
| `violetbloom` | violetbloom | 1 · 0 · 1 — pale lilac into mid violet into deep violet |
| `emberstone` | ember | 1 · 0 · 1 — pale amber into orange into a red-brown that keeps its heat |
| `verdigrist` | verdigris | 1 · 0 · **1.3** — pale mint into the near-black green of old bronze |

**No part of any of these is grey, and getting that wrong twice is what makes it
worth writing down.** Verdigrist was right from the first attempt and the other
two were not, and the reason turned out to be two separate mistakes wearing one
symptom.

*One: the body colour is half the material.* `recipeBurn` **multiplies** the
prop's diffuse, so wherever the ramp is pale, what you are looking at is the
prop's own colour. Verdigrist's fixture stands on `PALETTE.PATINA`, a green
stone; the other two stood on `STONE_PALE`, which is grey. That is the whole of
it — the shader was never the thing making them grey, the *bodies* were. All
three now stand on a muted stone in their own hue at PATINA's value.

*Two: a ramp that crosses the wheel passes through neutral.* The first fix made
these run from a cold face into a warm one — turquoise into violet, blue into
orange — and a mix between opposite hues is unsaturated in the middle, so the
grey came back in the band where the front actually is. Verdigris never crossed:
it is green at every stop and only the value moves. All three are one hue family
at three values now, and the probe checks every stop's chroma, not just the base.

*And one more, in the shader:* `recipeMoonbloom` multiplied by hardcoded colours
— a blue-white pale state and a pink-and-violet deep one. A coloured multiplier
over a coloured ramp is a second material fighting the first, and it is what put
pink through the middle of everything that was not violet. It is value and
temperature now; hue belongs to the ramp and nothing else. The edge glow, the
front lift and the sparkle tint all read the material's own ramp for the same
reason.

The curve was rewritten about its own midpoint, so `gain` steepens the front
without sliding it round the stone — which sliding it is what a slope on the raw
exposure would have done. At gain 1 it is the line it replaces, constant for
constant. `invert` acts on the exposure *before* the curve, so an inverted stone
would get a real terminator rather than a photographic negative of one; nothing
uses it today and the mechanism costs a lerp.

**nacreous** — the one field with no ramp; its colour is a cosine hue wheel, so
its colorways are params. `wash`, `hue`, `grain`.

| Look | wash · hue · grain |
|---|---|
| `nacreous` | 1 · 0 · 1 — over a cream body |
| `lunacreous` | **1.7** · **0.58** · 0.9 — the same field over a near-black one |

**The pair is the clearest thing in the wing.** Over a pale body the wash is a
tint on a lustre that is already doing most of the work; over a near-black one
there is no lustre to tint, so what survives is the peacock sheen alone with
nothing behind it. Two table rows and a body colour apart, and they read as
different materials — which is the phase's whole claim, standing in one room
where it can be checked in a glance.

**stained glass** *(was pointillist)* — params `density`, `lead`, `flash`. The
field the phase was argued for.

| Look | Ramp | density · lead · flash |
|---|---|---|
| `oceanglass` | oceanglass | 1 · 1 · 1 — the blues and teals the field was tuned against |
| `rosewindow` | rosewindow | 1 · 1 · 1 |
| `ivyglass` | ivyglass | 1 · 1 · 1 |
| `lapispane` | lapispane | 1 · **1.25** · 0.6 — two colours and no middle, so the came has to carry the boundary |

Three of the four differ in nothing but a ramp row, which is the whole claim put
in one rank.

**The scene class** — four fields, seven looks, all of them windows. See
"Scenes, and what one costs" below for why they share a ray and a kit.

| Field | Look | Ramp | params |
|---|---|---|---|
| voidstone | `voidstone` | star | nebula 1 · stars 1 · warmth 0 |
| overcast | `overcast` | daylight | cover 0.72 · depth 1 · drift 1 |
| overcast | `lakestill` | lakestill | cover **0.24** · depth 0.7 · drift **0.35** — high cirrocumulus, which never covers the blue and barely moves |
| duskfall | `duskstone` | dusk | spread 2.4 · sun 1 · drift 1 |
| duskfall | `dawnstone` | dawn | spread 2.0 · sun 0.85 · drift **0.55** — a night's cold has dropped the dust out of the air, so it is cleaner and paler than an evening |
| duskfall | `daystone` | day | spread **0.85** · sun **1.35** · drift 1.2 — the gradient spread over the whole dome instead of crammed into the horizon |
| auroral | `auroral` | aurora | gain 1.15 · rate 1 · spread 1 |

`overcast` reads a deck in projection; coverage is a threshold on the field
rather than a multiply, because a deck that thins out everywhere reads as haze
and what makes cloud read as cloud is that it has an edge somewhere. `duskfall`
has **no loops at all** — a gradient, two powers, a disc and one band of underlit
strata — which makes it the answer whenever a portal is wanted on something that
covers a lot of screen.

**Deviation: the horizon seam, which was a real bug.** `sceneDeck` divided by
`abs(d.y)`, which mirrors the deck onto its own underside — so the sky below the
horizon was the sky above it reflected, and the two met along `d.y = 0` in a hard
bright line that read as a smear welded across the middle of the object.
Elevation is signed now, the projection is faded out by `sceneAbove` before it
diverges, and what fills the last few degrees is haze, which is what is actually
there. The probe asserts no scene takes the magnitude of an elevation again.

**Deviation: auroral took three attempts, and the two failures are the useful
part.** Green and crimson started as two looks with two ramps; they are one
display, and one ramp now carries nitrogen pink at the fringe, oxygen green
through the body, the blue-violet band and the thin high crimson. Stacking them
by altitude is not a compromise — it is what a great storm does.

The geometry was harder. *Horizontal bands across the sky* is an aurora
photographed from a hundred miles off, not one you are standing under. *Bands by
distance from the zenith* is worse: concentric rings, which read as a ring of
aurora-shaped pins stuck round the player.

What it is now: a curtain is a **band about a wavy line in the deck plane**. A
straight line there is a great arc across the sky, so five of them on fanned
headings lie roughly parallel and run away over the horizon — near ones overhead
spread wide, far ones compressed to a line — and the plane's own foreshortening
does every bit of that perspective for free. The rays run *along* each band and
so come out across it: near-vertical overhead, converging toward the zenith the
way a corona does, packed to a fringe where the band runs out. Drawn back to
front, so they overlap.

Two things it has to do that the earlier tries did not: distance dims and
smooths (a hundred kilometres of air, and the deck plane runs to infinity at the
horizon, so the stripes would alias to noise), and the colour is keyed on the
sky's own elevation rather than on any one band — five sheets at five distances
have to agree about where "high" is.

**Twenty-two ramps**, up from five.

**Deviation: two hardcoded colours in tenebrescent, and only one of them moved.**
The edge glow was a constant violet — right for one of three looks and wrong for
the rest — and now reads the material's own ramp at t = 0.62. The **sparkle tint
did not move**: a spark is light caught on a facet, and all three of these stones
have the same facets.

**Deviation: quickmetal's cast interpolates differently.** It was `mix(a, b, t)`,
linear; a ramp stop arrives over a `smoothstep`. A gentle S across a warm-to-cool
metal shift, and the alternative was a special case in the evaluator for one call
site.

**The rename.** `pointillist` → `stainedGlass`: the byte, the `FINISHES` rows,
`recipeBerryCell`/`recipeBerryTint` → `recipeStainedCell`/`recipeStainedTint`,
the `berry` ramp → `oceanglass`, the file, and POINTILLIST-POP-FIX.md →
STAINED-GLASS-POP-FIX.md. **That write-up's conclusion survives the `density`
param**, and its reason is now restated where the param is declared: what looked
bad was density changing *with distance*, because the hash is taken at the scaled
position and halving it regenerates the whole skin. A per-variant density is
chosen once and never moves. This is exactly the sort of distinction that gets
optimised back out by someone who reads the param and not the history.

#### R6d — the Materials wing

**The rank was full.** `SHOWCASE_SLOTS` in `debug/props.ts` holds sixteen doors
and sixteen were taken; Materials and Materials 2 had two of them, and R6 tripled
what wants showing. Adding five more doors to a rank already argued down from
eight-metre spacing to five is the sprawl the galleries were built to replace.

**So the two rooms became one door and a wing.** `materials-wing.ts` holds a hub
in the galleries' own construction — flat gridded floor, fog pulled in, seven
doors standing free on the grid, which is the trick `ZONE_GENERAL_PROPS` already
uses — and the rooms hang off it. **Slot 15 came free doing it, which is the
first time that rank has ever got shorter.**

| Room | What is in it | The question |
|---|---|---|
| **Metals** | chrome, bronze, platinum, gilt, and quickmetal's four | the mirror family — and the only room where an invented mirror can be read against a real one |
| **Stone** | quartz, marble, schiller's four, tenebrescent's three | what light does *inside* a dielectric |
| **Gemstone** | frost, crystal gem, amethyst gem, pane, bubble | refraction, facets and transmission |
| **Shell** | iridescent, and the two nacres | one film, then the same term over a pale body and a dark one |
| **Cloth** | the silk and velvet drapes | a surface *turning*, which is why the fixture is a drape |
| **Stained Glass** | the four colorways | one field, one program, four looks: the argument, put in a line |
| **Portals** | the seven scenes | a window that is the same window on every shape |

Doors are timber except Metals' and Portals', which are iron.

**Deviation: Cloth is its own room.** The drapes stood in Shell on the argument
that sheen is one term whatever it is wrapped around. True, and beside the point:
nothing else in that room is cloth, and a hanging panel beside a rank of orbs
reads as a mistake before it reads as a comparison. Two rows today, and it is
where a finish belongs the moment it is one a garment would have.

**Deviation: Portals is lit like everything else, and every scene gets both
fixtures.** It was dark, on the reasoning that a night sky cannot be read in
daylight — but only one of the seven is a night, and a room blacked out for one
fixture makes the other six wrong. They emit their own light regardless; that is
what a portal is. And the orbs-only shortcut is gone: a scene depends on the eye
ray alone, so an orb and a column wear the *same* window, which is exactly the
thing worth being able to see rather than to be told once.

**One builder per shape, not per look.** Each look was its own two-line module —
twelve files for six recipes, and twenty-four under the same rule would be forty-eight.
`art/builders/recipe-fixtures.ts` is one table of look and body colour, and
`variantOrb`/`variantColumn`/`variantPair` hand them out.

**Deviation: `check:art` does not exist.** The plan said the split would be
checked from both sides by it. There is no such script, and `art/registry.ts` —
which the galleries' own header describes as the thing it guards against — has no
live importer anywhere in the tree. The rooms were checked by hand instead: every
builder the two old galleries listed has a home in the new seven, and none is
listed twice. Worth a real check one day; it is not this phase's.

#### Acceptance, run

A throwaway probe, **920 assertions, none failed**.

- **The lookup against the analytic chain**, per ramp, at 2001 values of `t` plus
  four outside 0..1 — worst error 0.085 of an 8-bit step, stated above — with the
  comparison self-tested by moving a stop and confirming it fails. R3's probe,
  pointed the other way.
- **The guard rewrite over all 256 bytes**: at most one field per byte, every
  claimed byte reaching its field, every unclaimed byte reaching none.
- **Both banks**: every look's knobs and params landing at its own byte, every
  ramp V matching the table, every unclaimed row plain with no ramp.
- **The union**: one block per field guarded by its span, no surviving
  `isRecipe(`, no `uRampStops`, one `rampColour`; four scenes in one mask
  declaring one `recipeDrift`, one `sceneSun`, one `sceneDeck` and one
  `sceneAbove`; a lean program with no variant bank, no ramp reader and no field
  guard.
- **The horizon seam**, as a standing check rather than a fix: no scene may take
  the magnitude of an elevation. Matched against code, since the comment
  explaining the trap names the trap.
- **Neither end of a tenebrescent ramp is grey**, measured as chroma on the base
  colour. The pale faces were the point of that revision and a drift back toward
  white would undo it silently.
- **Programs**: every look taking the finished material; every field one program
  per mask; four stained-glass looks, one program.
- **Hygiene**: braces and parens balanced on the union, the lean program and the
  vertex stage; no backtick, template marker, `NaN` or stray `undefined` in
  emitted source; the reserved-word scan with its planted self-test.
- **The table**: names unique, every window opening before it closes, every ramp
  read by a look or by frost, every look carrying a `FINISHES` row that resolves
  to its own byte and its field's bit.

`tsc --noEmit` clean and `vite build` clean; `docs/` deliberately untouched.

#### Two things the wing found that were not R6's

Walking every room of the wing and back produced a periodic hitch — a second of
stall every five or six seconds, arriving part-way through the circuit and
staying for the session — and then, on a longer circuit, a crash. One gallery
never did either.

**The wing is a hub with seven of the heaviest rooms in the game hanging off
it**, and the residency ring kept every one of them. `KEEP_WITHIN` was two
doors, so from inside any wing room all six siblings are within the ring: walk
the wing once and all eight zones stay built for the session. **Measured over the
real portal graph, walking the wing peaked at eight built zones** — about ninety
megabytes of vertex buffers, seven collision octrees, and something like eleven
thousand GPU buffer objects that nothing would ever release. Two rooms did not
do this; seven do.

The second hop was documented as hysteresis rather than headroom — it exists so
that pacing in a doorway does not rebuild a zone every crossing. That reasoning
is right and the implementation was a blunt instrument: a whole extra ring of
rooms to protect *one* of them, the one behind you. So `KEEP_WITHIN` is one now,
and `residentZones` takes the zone you stepped out of. **The same walk peaks at
two.** The hysteresis is stated exactly instead of approximated by radius, and
the world check's assertions — the hub released from three doors, the set
bounded from everywhere — hold on a strictly smaller set.

This is the first time the residency policy has been the binding constraint on
anything, which is the argument for it having been two hops until now.

*And separately, in the same investigation:*

**Three instanced systems were handing per-zone geometry the *same* base
buffers.** `art/sparkle.ts` gave every zone's star mesh the module-level quad's
index and position attribute; `art/cover.ts` gave every chunk the blade's whole
attribute set; `art/particles.ts` gave every system the shared billboard's.
`Zone.dispose` calls `dispose()` on those geometries, and three answers by
deleting the GPU buffer behind **every attribute the geometry holds** — so
releasing one zone tore the buffers out from under every other zone still
standing, and each of them had to upload again the next time it drew. With seven
heavy rooms inside one residency ring, entering and leaving churns that
continuously.

The best part is that `art/particles.ts` had the rule written at the top of the
very function that broke it: *"Sharing is the trap: `Zone.dispose` walks the
graph freeing geometry, and a shared buffer freed by one zone is missing from the
next."* Every word of that was true and nothing was cloning. All three clone
now, at a cost of a handful of vertices per system.

**What was ruled out.** A throwaway loop built and disposed every fixture in the
wing eight times over with the collector forced between rounds: 0.03 MB of drift
per circuit, so the build path — `assemble`, `finish`, the sparkle sites —
retains nothing. That is what moved the search to the renderer and then to
residency, and it is worth writing down because "the builders are leaking" is
the first place anyone will look next time and it is measurably not true.

The dev panel gained `geometries / textures` off `renderer.info.memory` beside
the heap readout. It is the number that separates a leak from a large resident
set: walk the wing and come back, and it should settle rather than climb.

**What no probe here checks: that a driver compiles it.** The emitted union is
structurally sound — balanced, single-declaration, no reserved words — and that
is not the same as valid GLSL. Nothing in this repo can compile a shader
headlessly, so the first real check on any of this is the console on entering a
finished room.

---

## Scenes, and what one costs

Answered for voidstone, and then acted on — three more scenes landed with R6c,
which is the measurement.

**Cheap, and cheaper than the one that already existed.** `envSource` is the best
extension point in the system — a field filling it replaces what the surface
samples, so a scene is a pure function of one direction returning a colour. No
light loop, no lobe, no geometry, no pass. `vec3 scene(vec3 dir)` in, `finishEnv`
out, and nothing else in the shader needs to know.

**On cost, the numbers rather than the impression.** Voidstone is by a wide
margin the heaviest thing in the set: `recipeStarDust` walks eight cells with two
hashes and an `exp` each and is called twice, `recipeStarBright` walks eight more
with branches and diffraction spikes, and three `recipeFbm` calls sit under them.
`overcast` is four noise samples and some mixes. `duskfall` has **no loops at
all** — a gradient, two powers, a disc and one band of strata — which makes it
the answer whenever a portal is wanted on something that covers a lot of screen.
`auroral` is three curtains of three samples each, and it is the only one where
the cost is in motion rather than in detail.

**And one thing the class has to get right, learned the expensive way.** A scene
reading a deck plane must fade it out before the projection diverges, and must
not take the magnitude of the elevation to get a value below the horizon. Doing
so mirrors the ceiling onto its own underside and welds the two together along
`d.y = 0` in a bright seam — which on an orb is a smear across the middle of the
object and reads as a bug in the material rather than in the sky. `sceneDeck` is
signed and `sceneAbove` is what stops it being drawn where it blows up; the probe
asserts both. It is the one trap in an otherwise forgiving extension point.

**Which means a new scene is free twice over.** At runtime one byte satisfies one
guard, so the cost is paid only by fragments actually wearing that material. In
the program, register pressure is the maximum over mutually exclusive arms, and
voidstone already set the ceiling for `envSource` — so all three of these added
**nothing** to the union's occupancy. What they cost was compile time and one
cache invalidation, the same boundary R4 drew for a new field and the same one
glitch has always lived with.

**The shared work is in `src/art/glsl/sky.ts`** — the drift rotation with its
offsets-after-rotation trap, the fixed sun, the deck projection, and `sceneSlots`,
which writes both of a scene's slot bodies from its entry point and a gain.
Emitted once across all four fields, which is what `Recipe.shared` is for. A
fifth scene cannot quietly pick up a reflected ray or an angle-rationed ambient —
both of which look plausible in isolation and break the class.

**The ray is the class's, not the scene's.** Every one of these reads the raw eye
ray, so every fragment looks straight out along its own line of sight. Not a
reflection — passing the reflected direction instead would make a polished stone
with a sky *on* it, a different material. And not a hole: a direction-only scene
has no parallax, so the view does not slide as you walk past it.

**That is the point rather than the limitation.** These are portals, and a portal
does not have to obey a room. Because the scene depends on the eye ray alone it
shows the same view at every angle on every shape — an orb, a column, a pane and
a wall all read as the same window, and none of them can be walked around to
catch it out. A position term would buy correctness for one case, the window set
in a wall, and cost the property that makes the whole class hang together. So
there is no position term, and the contract is fixed:

    vec3 scene(vec3 dir)   // dir = inverseTransformDirection(-geometryViewDir, viewMatrix)

---

## Order and dependencies

| Phase | Depends on | Size | What it buys |
|-------|-----------|------|--------------|
| R0 — vocabulary | — | mechanical | the concept matches the code *(landed)* |
| R1 — room union | — | small | cold room gates on one compile *(landed)* |
| R2 — knob table | R0 | small | source stops varying by recipe set; live tuning *(landed)* |
| R3 — ramp table | R2 | medium | colour is data; first zero-code material *(landed)* |
| R4 — slots + shared chunks | R2 | large | new fields without touching finish.ts; glitch/horror single-sourced *(landed)* |
| R5 — standing set | R1, R2 | negative | two programs, patched at boot; Phase E machinery deleted *(landed)* |
| R6 — variants | R3, R4 | large | a look is a row; the field count stops bounding the material count *(landed)* |

R1 landed alone, as planned — it fixes the materials2 bar by itself and
nothing else depends on it. R2, R3 and R4 landed alone too, each paying its own
cache invalidation; that is one reload apiece and the tables were worth proving
separately. R4 was the long pole and was, as expected, almost entirely
mechanical — the checkpoint turned out to be stronger than "byte-comparable":
the same statements in the same hooks across every one of the 1024 masks, with
only the order between different recipes permuted. R5 was the deletion pass, and
it deleted R1's machinery along with Phase E's — the decision gate was taken in
its favour. R0 through R5 have all landed.

R6 is the phase the first five were for, and the first whose argument is made by
*content* rather than by the shader: twenty-four looks, three new fields and
seven rooms, and not one of them a program. It landed whole rather than split at
R6a/R6b as the plan allowed — the ramp lookup and the variant row are the same
change seen from two ends, and proving one without the other would have meant
building the bank twice.

**Every phase has landed.** What R0 set out to do is done: program count is a
constant, content is data, and the only thing left that costs a compile is a new
optical structure — which is the boundary glitch has lived with all along.

## What is given up

- Per-prop program leanness inside a finished room (R1), and then per-room
  leanness too (R5). Both revertable, which is why the mask is still stamped.
- The theoretical minimum register footprint (R5) — traded against the
  evidence that the maximum has already shipped.
- Byte-frozen palettes and knobs: once they are uniforms, the browser cache
  keys stop covering them, which is precisely what makes them tunable. The
  *source* stays byte-stable, which is what the cache actually keys on.
- Bit-exact colour (R6). R3 ported five ramps without moving a pixel; R6 bakes
  them to a 512-sample half-float lookup and interpolates between samples, which
  is a bounded error rather than no error — **measured at 0.085 of an 8-bit
  step**, worst case, across all twenty-two ramps. Given up deliberately,
  because it is what buys unlimited ramps.
- Tenebrescent's constant violet edge glow, and its bare white unburnt face
  (R6). The glow reads the material's own ramp now and the pale side carries a
  colour. Both are deliberate look changes rather than rounding, and both are the
  same argument: a stone that is two materials with a front between them should
  be two *coloured* materials, or the front is only half of an event.

## What this does not do

It does not make new optical structures free — a new field is code, as a new
glitch effect is code. It does not touch the particle, sparkle, glass, water
or cloth systems, which have their own materials and their own scaling
arguments. And it does not decide look questions: every knob and stop value
ports verbatim, and retuning them afterwards is the owner's call, made with
sliders instead of recompiles.

After R6, three ceilings remain, and they are worth writing down so they are
recognised when they are hit rather than discovered:

- **Three params a look.** A fourth is another vec4 on every row — 28 more
  against the 40 the fragment stage has spare. Affordable once, and only once.
- **Twenty-eight rows, twenty-five claimed.** The table is indexed by the byte and
  spans it, so the ceiling is the table's size and not the attribute's —
  `aRecipe` holds 255. Each further row is 2 vec4, so about twenty more fit
  before the 224 floor does. After that the variant row follows the ramps into a
  texture, which is a small change and is the reason to note this early.
- **A variant cannot change the shape of its field.** `grisaille` can be
  colourless and `mosaic` can be coarse, but neither can make the cells hexagonal.
  That is the R4 boundary restated at the variant scale, and it is the one that
  will be argued with, because a param that is *nearly* enough is the most
  tempting place in this system to put a branch.
