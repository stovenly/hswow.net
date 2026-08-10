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

### R1 — one material per room

**Goal:** the compile a cold room gates on stops being one program per finish
and becomes one program, full stop.

**Change:** `dressArtMesh` stops assigning per-prop variants. At zone build,
every mesh records its declared mask (`mesh.userData.finishMask`, already
stamped on the geometry); `ZoneManager.prepare()` ORs them into the room's
union; every mesh whose mask is non-zero gets `artMaterialFor(union)`, mask-0
meshes keep `ART_MATERIAL`. The variant cache stays keyed by mask, so two rooms
with the same union share one program. The Phase E probe carries exactly one
mesh — or dies here entirely if R5 lands in the same bundle.

**What it costs:** a prop with a cheap finish in a room with an expensive one
runs the expensive program's occupancy. Accepted on the R5 evidence; the
per-prop masks remain stamped on the geometry, so reverting to per-prop
variants is a one-line policy change if a weak GPU ever says otherwise.

**Acceptance:** materials2 cold entry gates on one new program (plus lean).
Geometry, portals and every prop's declared mask byte-identical to before.

### R2 — knobs into a uniform table

**Goal:** program source stops varying by *which* recipes are in the mask —
only by which field code is included.

**Change:** a TS table `RECIPE_KNOBS: Record<RecipeName, {gloss, rim,
sunGlare, envGain, filmMix, …}>` feeds `uRecipeKnobs[16]` (two vec4 banks,
indexed directly by the recipe byte; sparse rows stay zero — sixteen vec4s is
nothing, see MAX_GLITCHES). The spliced per-recipe constant blocks in the
surface-state section of finish.ts are replaced by one indexed read. Values
are today's constants verbatim.

**Also here:** the speck knobs (`finishSpeckParallax/Lively/Spread/Gate`)
join the table; they are the same kind of thing.

**Acceptance:** with the same knob values, output is visually identical (not
byte-identical in source — that is the point). The knob table gets a dev
folder in the GUI: every material's response tunable live, which has never
been possible.

### R3 — ramps into a table

**Goal:** colour becomes data; the five ramp functions become one chunk.

**Change:** a ramp is N segments of `(edge0, edge1, rgb)`; one GLSL function
`recipeRamp(int row, float t)` evaluates the same overlapping-smoothstep chain
the five hand-written ramps use, reading stops from `uRampStops`. A TS table
holds today's constants verbatim: labrador, berry, star, burn, ice. Rows are
addressed from the knob table, so a material's palette is part of its row.

**Watch for:** the existing ramps are *overlapping* smoothstep mixes, not
linear gradients — the generic evaluator must reproduce the same chain order
(later stops mixed over earlier), or hues shift where windows overlap. Port
one ramp, diff against the closed form at a few dozen sampled t values in a
throwaway node probe, then port the rest.

**Acceptance:** same stops → same colours. Ramps join the dev GUI. A
recoloured pointillist is now a data row — the first material added for zero
code.

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

**Change, cross-system:** one `src/art/glsl/` chunk library. The hashes
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
| R1 — room union | — | small | cold room gates on one compile |
| R2 — knob table | R0 | small | source stops varying by recipe set; live tuning |
| R3 — ramp table | R2 | medium | colour is data; first zero-code material |
| R4 — slots + shared chunks | R2 | large | new fields without touching finish.ts; glitch/horror single-sourced |
| R5 — standing set | R1, R2 | negative | two programs, boot-compiled; Phase E machinery deleted |

R1 can land alone and immediately — it fixes the materials2 bar on its own.
R2+R3 bundle well (one cache invalidation). R4 is the long pole and is almost
entirely mechanical restructuring with byte-comparable checkpoints. R5 is a
deletion pass with a decision gate.

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
