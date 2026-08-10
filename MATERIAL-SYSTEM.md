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
FIELDS   (code, compiled always)   cellular · lamellar · directional · flow · bloom …
SLOTS    (code, fixed hooks)       surface / direct / envSource / envBend / ambient / grade
KNOBS    (uniform table, by byte)  gloss · rim · sunGlare · envGain · filmMix · speck…
RAMPS    (uniform table, by row)   5-stop colour ramps, one chunk evaluates all
MEMBER   (per-vertex byte)         aRecipe selects knob row, ramp rows, field branches
```

A material = a `FINISHES` entry (base lobe parameters, as today) + a knob row +
ramp rows + which field code answers its byte. The first three are data.

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

### R4 — fields into slots, primitives into one library

**Goal:** the structural half becomes a registry of small chunks; new recipes
stop touching finish.ts.

**Change, materials:** each recipe's GLSL is split into named slot functions —
`surface` (F0/diffuse override), `direct` (answer to a light), `envSource`
(replace the reflection), `envBend` (lean the ray), `ambient` (view-keyed
add), `grade` (multiply the lit result) — matching the six hook classes the
review identified in finish.ts. The `Recipe` registry entry grows optional
slot members; finish.ts splices one dispatcher per hook mechanically instead
of today's hand-written `isRecipe` blocks per recipe per hook. A new material
with a new field = one file exporting slot GLSL + a registry entry + a knob
row. finish.ts is never edited again for content.

**Change, cross-system:** one `src/art/glsl/` chunk library, of which R3's
`art/ramp.ts` is the first tenant — a table and its evaluator in one file,
spliced by whoever needs it. The hashes
(`finishHash3`, `recipeHash3`, `glitchHash`, horror's copy) become named
primitives in one file — **same constants per call site, single-sourced
declarations**; changing a hash's constants changes a look, so none do. The
glitch/horror membership loop becomes one shared chunk parameterised by its
uniform bank; both systems splice it. Their per-effect code stays put — it is
already in its end state.

**Acceptance:** full-union program byte-comparable before/after the mechanical
re-slotting (the splice output should reorder nothing within a hook); glitch
and horror showcases unchanged; a demo material (the R3 recolour plus one knob
change) lands with zero finish.ts edits.

### R5 — the standing set

**Goal:** the compile story ends: two art programs per light tier, ever,
compiled at boot behind the loader.

**Change:** the full-union variant (every field, every feature) is compiled
once at boot alongside `ART_MATERIAL`; rooms stop computing unions; every
finished mesh takes the full variant, every plain mesh the lean one. Retire:
the per-mask variant cache, `dressArtMesh`'s deferral, `pendingArtProbe`,
`resolveArtVariants`, and ZONE-LOADING Phase E's machinery (its spec entry
gets the correction note). The finish *feature* bits stay in `assemble`'s
stamp — they still gate nothing at runtime but they document what a prop
declares, and R1's revert path wants them.

**Why this is safe:** finding 6. This *is* the pre-Phase-C shader's shape,
which shipped, plus glitch and horror, which were always ungated anyway.

**Decision point, not a foregone one:** if profiling on the weakest target GPU
ever shows the union hurting fill rate, stop at R1's per-room unions — every
other phase is unaffected. R5 deletes the most code of any phase; that is its
whole argument, and it should land last, after R2–R4 have proven the tables.

---

## Order and dependencies

| Phase | Depends on | Size | What it buys |
|-------|-----------|------|--------------|
| R0 — vocabulary | — | mechanical | the concept matches the code *(landed)* |
| R1 — room union | — | small | cold room gates on one compile *(landed)* |
| R2 — knob table | R0 | small | source stops varying by recipe set; live tuning *(landed)* |
| R3 — ramp table | R2 | medium | colour is data; first zero-code material *(landed)* |
| R4 — slots + shared chunks | R2 | large | new fields without touching finish.ts; glitch/horror single-sourced |
| R5 — standing set | R1, R2 | negative | two programs, boot-compiled; Phase E machinery deleted |

R1 landed alone, as planned — it fixes the materials2 bar by itself and
nothing else depends on it. R2 and R3 landed alone too, each paying its own
cache invalidation; that is one reload apiece and the tables were worth proving
separately. R4 is
the long pole and is almost entirely mechanical restructuring with
byte-comparable checkpoints. R5 is a deletion pass with a decision gate.

## What is given up

- Per-prop program leanness inside a finished room (R1, revertable).
- The theoretical minimum register footprint (R5) — traded against the
  evidence that the maximum has already shipped.
- Byte-frozen palettes and knobs: once they are uniforms, the browser cache
  keys stop covering them, which is precisely what makes them tunable. The
  *source* stays byte-stable, which is what the cache actually keys on.

## What this does not do

It does not make new optical structures free — a new field is code, as a new
glitch effect is code. It does not touch the particle, sparkle, glass, water
or cloth systems, which have their own materials and their own scaling
arguments. And it does not decide look questions: every knob and stop value
ports verbatim, and retuning them afterwards is the owner's call, made with
sliders instead of recompiles.
