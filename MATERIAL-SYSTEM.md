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

R1 landed alone, as planned — it fixes the materials2 bar by itself and
nothing else depends on it. R2, R3 and R4 landed alone too, each paying its own
cache invalidation; that is one reload apiece and the tables were worth proving
separately. R4 was the long pole and was, as expected, almost entirely
mechanical — the checkpoint turned out to be stronger than "byte-comparable":
the same statements in the same hooks across every one of the 1024 masks, with
only the order between different recipes permuted. R5 was the deletion pass, and
it deleted R1's machinery along with Phase E's — the decision gate was taken in
its favour. Every phase has landed.

## What is given up

- Per-prop program leanness inside a finished room (R1), and then per-room
  leanness too (R5). Both revertable, which is why the mask is still stamped.
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
