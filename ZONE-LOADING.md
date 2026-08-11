# Zone loading: shader compiles, code chunks, and the catalogue

The plan for keeping zone entry fast while the catalogue of builders, finishes
and recipes grows without bound. Five phases, in the order they should
land. A and B are small and kill today's hitch; C is the structural change that
makes the material catalogue scale; D does the same for the JS catalogue; E is
the stand-in hotswap, and it falls out of C almost for free.

**All five have landed.** Each phase heading carries a note on how the
implementation differed from the sketch under it, and those notes are the
authority — several of the sketches were wrong in ways only found by building
them. What remains is content migration under D.

## The problem, stated once

Zone entry hitches because of a multiplication:

- **One shared material carries every shader stage, always.** `applyFinish`
  splices the whole of `RECIPE_GLSL` into `ART_MATERIAL` unconditionally
  (finish.ts), plus the speck field, the film, and every other finish feature —
  whether the zone contains any of it or not. Every material added grows every
  program ever compiled.
- **Nearly every zone is a new program.** three.js keys its program cache on
  the count of each light type, and zones carry their own point and spot
  lights (candles, forges, streetlamps, windows, floodlights). A zone with 3
  point lights and one with 5 are different programs, so the whole patched
  shader recompiles — synchronously, on the first drawn frame — for almost
  every zone whose light census hasn't been seen this session.
- **Nothing compiles ahead of time.** `prebuild` warms geometry and the
  collider; no `renderer.compileAsync` exists anywhere.

Cost = shader size × distinct light rigs, and both axes grow with content.
There is no WebGL program-binary API, so compiled programs cannot be persisted
by us — the levers are: fewer distinct programs (A), compiling off the critical
frame (B), smaller programs per zone (C), and the browser's own disk cache,
which keys on exact source bytes and works across sessions as long as the
generated GLSL stays byte-stable across builds (a rule, not a phase: nothing
non-deterministic may be interpolated into a shader string).

---

## Phase A — light-rig tiers *(landed)*

**Goal:** the light-count component of the program key takes a handful of
values game-wide instead of one per zone, so three's in-session program cache
actually hits. After the first few rooms, no zone entry compiles anything.

**Change:** in `ZoneManager.prepare()`, after the existing traversal has seen
the zone's lights, count point and spot lights and pad up to the next tier
with zero-intensity black lights parented to the zone root.

- Point tiers: 0 / 4 / 8. Spot tiers: 0 / 2.
- A pad light is `new THREE.PointLight(0x000000, 0)` at the origin — it
  contributes nothing to shading and survives `LightActivity` untouched
  (activity drives intensity on flames it collected; pads are never collected).
- A zone exceeding the top tier is a content error worth a console warning:
  one greedy zone would mint a new permutation for the whole game.

**Why padding works:** the renderer counts lights collected from the visible
graph regardless of intensity, so a black light holds its slot in the shader's
loop. The waste is a few dead loop iterations of Lambert point shading per
fragment — bounded by the tier, invisible in this pipeline.

**Watch for:** anything that toggles a light's `visible` (not intensity) at
runtime would change the census mid-zone and force a compile. Audit: flames
flicker intensity, so today nothing does — keep it that way as a rule.

**Acceptance:** instrument `renderer.info.programs.length` in the debug
readout. Walk ten zones cold; the count must plateau after the first two or
three. This is also a natural check-suite assertion alongside `crossings`.

## Phase B — compile behind the fade *(landed)*

**Goal:** whatever compiles remain (first visit to each tier, first boot on a
cold browser cache) stop landing as a frozen first frame and happen behind the
fade and the loading bar instead.

**Change:**

1. `ZoneManager` gets a handle on the `WebGLRenderer` (via its options — it
   already takes `postfx`, which owns the renderer; expose it or pass it
   directly).
2. In `enter()`, after `scene.add(root)` and the light-environment block —
   the census must be final first — insert
   `await renderer.compileAsync(root, camera, scene)` before the fade lifts.
   On the cold path this sits under the existing `'almost there'` step; on
   the warm path it resolves instantly when the program is cached, so it
   costs nothing on the common doorway.
3. At boot, after `zones.prebuild(ZONE_COUNTRYSIDE)`, add a loader step that
   compiles the prebuilt root the same way — the first zone's programs are
   ready before the player exists.

`compileAsync` uses KHR_parallel_shader_compile where the driver offers it, so
the link happens on a driver thread while the fade plays and the browser stays
responsive either way.

**Corrections found during implementation:** `compileAsync(root, camera, scene)`
with a root *already in* the scene collects the root's lights twice — three
traverses both the target scene and the pre-add object — and compiles a
doubled-census program nothing renders with. So `enter()` compiles the scene
itself, and a detached root compiles against a stand-in scene holding clones
of the global rig (which also frees the precompile from any boot-ordering
constraint). The countryside precompile fires unawaited *after* boot — first
paint is not gated on it, and a door reached early just awaits the remainder
behind its fade.

**Watch for:** the shadow depth material and the pixel pass's normal override
material compile on their own first use, outside `compileAsync(root, …)`. Both
are small (no lights, no finish stage) — leave them unless profiling says
otherwise.

**Acceptance:** with A landed and the browser's shader cache cleared, a cold
zone entry shows the bar a beat longer and drops no frames after the fade
lifts.

## Phase C — the finish stage becomes a set of chunks *(landed)*

**As landed, three deviations from the sketch below.** Gating is JS-side
splicing in `applyFinish(material, mask)`, not `#ifdef` — which makes the
byte-identity invariant literal (verified: full mask reproduces the pre-split
fragment byte for byte; the lean fragment is 73% smaller). Masks live per
*prop* mesh, not per zone batch — `finish()` already assigns each prop its
material, so no merge split was needed; `assemble` stamps the union of its
parts' masks on `userData.finishMask` and `artMaterialFor` (art/sway.ts) does
the rest. And star has no bit — it draws as sparkle quads, never in this
shader. There is no recipe-vs-regular distinction anywhere in the result:
every feature and every recipe is one bit in one mask, and nothing compiles
unless a part in the prop declares it.

**Goal:** a zone compiles only the shader features its own props declare. Gold
glint, frost's field, the film, the star, every recipe — each is a
chunk that most zones never pay for, in compile time or per-fragment cost.
Adding recipe #30 to the game costs nothing anywhere it doesn't stand.

This is the big one, in three steps.

### C1. Split the GLSL behind feature defines

Two kinds of gate, because the catalogue has two kinds of thing in it:

- **Feature flags** for the parametric lanes, since many finishes share one
  code path: `FINISH_GLINT` (the speck field — gilt, frost), `FINISH_FILM`
  (shell, nacreous, pointillist), `FINISH_STAR`, `FINISH_TRANS`,
  `FINISH_ANISO` (brushed, silk). The base specular lobe stays unconditional
  within the finish stage — nearly everything polished uses it and it is
  small.
- **Recipe flags** per recipe: `RECIPE_SCHILLER`, `RECIPE_QUICKMETAL`, … Each
  recipe's GLSL and its hook bodies (the `lights_fragment_end` block, the
  direct-lobe branch, the env branch) wrap in its `#ifdef`. Shared recipe
  helpers (`recipeHash3`, `recipeCell`, `recipeWarp`, `RECIPE_TILT`, the
  drift/star kit) compile under an umbrella `RECIPE_ANY`, or per-helper
  `#if defined(...)||…` where only one recipe uses a helper.

Restructure `recipe.ts` into a registry — a hand-written table, not
`import.meta.glob`, because the headless checks reach this code through
esbuild:

```ts
interface Recipe {
  name: string;        // 'voidstone'
  index: number;       // the aRecipe byte; retired indices stay retired
  define: string;      // 'RECIPE_VOIDSTONE'
  glsl: string;        // helpers + fields, already #ifdef-wrapped
  directHook?: string; // spliced into the direct-light block
  envHook?: string;    // spliced into the env block
}
```

The assembled `RECIPE_GLSL` is the concatenation, unchanged in content — the
defines decide what survives preprocessing. **The compiled output at
mask=everything must be byte-identical to today's shader**, which is both the
correctness argument and what preserves the browser disk cache for the
gallery.

### C2. The mask, from `assemble`, for free

`resolveFinish` already maps a finish name to its lanes and recipe index at
bake time (assemble.ts). Extend it to also return a feature bitmask (low bits
the feature flags, high bits the recipe indices). `assemble` ORs each part's
mask into the geometry it merges and stamps the union on
`geometry.userData.finishMask`. Zero cost — the loop already runs per part.

`assemble` then splits its merge by mask class: parts whose mask is
base-only merge into the lean batch; parts carrying features or recipes merge
into a second batch stamped with the union of their masks. Two meshes per
zone at most in the common case; most zones produce only the first.

### C3. A material cache keyed by mask

A small module-level cache beside `ART_MATERIAL`:

```ts
function artMaterialFor(mask: number): THREE.MeshLambertMaterial
```

`mask === 0` returns `ART_MATERIAL` itself. Anything else clones the base
material, runs the same patch chain (sway → wear → detail → finish → glitch →
horror), sets `defines` from the mask, and sets
`customProgramCacheKey = () => 'art:' + mask` (replacing the constant
`'sway'`, which exists to keep patched programs from being confused with
unpatched ones and does the same job here with more information). Whatever
places the merged meshes assigns `artMaterialFor(geometry.userData.finishMask)`.

Uniforms stay shared: every clone receives the same `finishUniforms` /
`recipeUniforms` / wind uniform objects by reference, so the per-frame update
path doesn't change and doesn't multiply.

**Variant explosion is the risk to manage, not to fear.** Masks cluster in
practice (base-only, base+glint, the gallery's everything). Start exact; if
the program count creeps, round masks up to a few canonical profiles
(lean / sparkly / full) at the `assemble` split — one line, and the cache
collapses onto three entries. The debug readout from Phase A is what says
whether it's needed.

**Depth and normal materials are untouched** — they carry no finish stage, so
shadows and outlines keep exactly one program each.

**Acceptance:** a countryside zone with no recipe props compiles a program
whose fragment source contains no recipe or speck code (assert by inspecting
`renderer.info` or a dev-only source dump); the materials galleries still
render byte-identically at mask=everything; program count across a ten-zone
walk stays within the Phase A plateau plus the handful of masks actually used.

## Phase D — the catalogue leaves the boot bundle *(landed)*

**As landed, three deviations from the sketch below.** Hover prefetch was
dropped: every door the player can see leads one hop out, which the arrival
prefetch already covered, so the second trigger would have been two code paths
racing to load the same chunk. `art/registry.ts` needed nothing — it turns out
nothing imports it any more, so step 5 was already true. And the galleries stay
eager, for a reason worth writing down: a gallery's fog and floor size are
*derived* from the sum of its builders' radii at definition time
(`floorSize`/`viewDistance` in galleries/layout.ts), so its builder list cannot
be lazy without either authoring those distances by hand or splitting every
builder module into metadata and geometry. They are debug rooms and will not
ship; the content zones are what this phase is for.

Migrated so far: the two hub interiors (`debug/interiors.build.ts`) and the
three countryside homes (`debug/countryside-homes.build.ts`). What stays in each
definition file is what the world needs before anyone opens a door — the names,
the air, and the dimensions the portals and the soundscapes are placed from.
That last one is the same "placement runs object → sound" rule the factory
already had, now load-bearing in a second way.

**The win today is small and structural, and the reason is the galleries.**
Vite emits both chunks, but they are about 3 KB each, because every builder they
use is *also* statically imported by some gallery and therefore lives in the
main bundle regardless. Delete the debug rooms and those chunks inherit the
builders. That is the shape of the fix: what the pattern buys is that the next
forty content zones do not grow the boot bundle, not that today's boot bundle
shrinks.

**Verified** with a throwaway probe rather than by eye: each migrated zone
builds geometry byte-identical to its pre-split source (same mesh count, same
vertex data, same world matrices, hashed and compared against the git snapshot),
and every portal end stands where it did. Seeded builders are what makes that
check meaningful — it is the same determinism eviction already rests on.

**Watch for:** `Zone.root()` now throws if it is called before the zone's chunk
has arrived. Anything that builds a zone owes it an `await ensureLoaded()` first
— `enter`, `prebuild`, `precompile` and the world check all do. The failure is
loud on purpose; the alternative is an empty room.

---

### The original design

**Goal:** a hundred more builders and forty more zones grow the *download*,
not the boot. Today every builder and zone module is statically imported
(zones.ts imports the world; `art/registry.ts` globs eagerly), so the whole
catalogue ships, parses and evaluates before the first frame, even though
geometry is lazily built.

**Design:** definitions stay eager, geometry code goes lazy.

1. **Zone definitions stay tiny and eager.** The portal graph, door tooltips,
   groups and spawn points need every zone's name at boot; that metadata is a
   few hundred bytes a zone. What's heavy is the `build()` closure and the
   builder modules it captures.
2. `ZoneDefinition` gains an optional async loader:
   `readonly load?: () => Promise<() => THREE.Group>` — resolves to the build
   function. Written as explicit `() => import('./zones/foo')` maps (plain
   dynamic import works under esbuild, so the headless checks keep working;
   only `import.meta.glob` is Vite-only). Vite turns each into a chunk and
   dedupes builders shared between zones into common chunks automatically.
3. `Zone.root()` grows an async path: if the definition has `load` and the
   build function hasn't arrived, `enter()` awaits it behind the fade —
   `enter` is already async with yields; this is one more awaited step on the
   cold path, and re-entry never pays it. `prebuild` awaits it the same way.
4. **Prefetch hides the latency.** After every entry settles (beside
   `evict()`), prefetch `load()` for every zone within `KEEP_WITHIN` doors —
   residency already computes the set, and every reachable door is inside it.
5. `art/registry.ts` flips to a non-eager glob for the debug gallery's
   listing, or keeps eager under a dev-only flag — the gallery is a dev
   surface and may pay what it likes; the shipped world path goes through the
   explicit imports.

**Migration is incremental:** `load` is optional, so zones move one group at a
time — galleries first (biggest, least visited), then prop halls, then the
countryside homes. A zone without `load` behaves exactly as today.

**Acceptance:** boot bundle size drops and stays flat as new zone groups land;
a cold door-open after a hover shows no added latency; `check:world` still
passes under esbuild.

## Phase E — the stand-in hotswap *(landed, then retired)*

**Retired by MATERIAL-SYSTEM.md R5. None of the machinery below still exists.**
`dressArtMesh` now picks one of two shared materials — lean, or every finish
chunk — from the mask a prop declared, at the moment the mesh is made, and that
is the whole of it. No deferral, no per-mask variant cache, no probe, no second
pass over the graph, nothing resolved per room: every mesh already carries the
material it will keep by the time `enter()` compiles the root, so the ordinary
compile covers it. `pendingArtProbe`, `resolveArtVariants`, `artMaterialFor`,
`pendingRoomFinish` and `dressRoom` are all gone.

**What survives is the reason, not the mechanism.** The compile still happens
before the swap and behind the bar, for exactly the reasons written up below and
in Phase B, and the light-census argument still holds — there is simply nothing
special left to arrange for it.

**Two supersessions, and the sequence is the lesson.** R1 first replaced the
per-mask deferral with a per-room union, which fixed the real bug — a room full
of finishes waiting on a dozen compiles at the door — and cost a probe, a cache
and a deferral to do it. R5 then found the union could just be *all of it*,
always, and deleted the lot. The one wide program was the kit's shape before any
of this and it shipped; both clever versions were answers to a question that
turned out not to need asking. What follows describes the first of the three.

**As it landed first, the deferral was per *mask*, once per session, decided at
the material rather than at the batch.** `dressArtMesh` was the single gate: a
prop whose variant had already been compiled took it outright, and only the
first prop of a never-seen mask stood in lean. So the pop happened at most once
per finish per session, never on a revisit, and never for the many props whose
mask is 0.

The compile-before-assign is an **invisible probe hung off the root `enter()` is
about to compile**, in the same pass as the rest of the room and before the
swap. This is the part worth remembering: three gathers lights with
`traverseVisible` and materials with a plain `traverse` (checked against the
installed 0.170 source, not assumed), so a hidden group under the root has its
materials compiled and never draws a pixel — including during the frames the
entry still spends showing the zone being left. `compileAsync` then waits on
`isReady()` for every material it gathered, the probe's included, so the await
that already gated the fade now also covers the variants. The probe borrows a
waiting mesh's geometry rather than inventing one, because the program key
depends on what the buffers carry.

**The census is right, and an earlier note here was wrong about why.** The
detached branch of `compile` passes the root as `scene` and the stand-in as
`targetScene`; three gathers lights from *both* when they differ, so the zone's
own lights are counted alongside the global rig. The probe therefore compiles
under exactly the census the first real frame renders under.

`pendingArtProbe()` hands back the masks it covers and `resolveArtVariants`
takes them, which closes the one real hole: a zone built *while* the compile is
in flight adds more waiting meshes, and resolving the whole list would mark
those ready with no program behind them.

**Why the light census cannot bite later.** A mask marked compiled means the
variant exists, not that it exists for every census. That is safe because
`enter()` compiles the whole root before the swap (Phase B) — a zone at a
different light tier compiles its own programs behind the fade, as it always
did.

**A crossing mid-compile leaves the meshes lean** rather than forcing the swap:
the entry returns on its staleness check without resolving, the masks stay on
the waiting list, and the next entry retries.

**Corrected after the fact: the upgrade does not run on arrival.** It first
landed as an unawaited pass after the bar hid, on the theory that one program
should gate the fade instead of one per finish in the room. In the second
materials gallery that read as a bug — the room appeared in flat stand-in
materials, hung while the whole batch of variants compiled on a rendering
frame, then corrected itself. Moving the probe into the pre-swap compile costs
a longer bar on the first entry to a room full of novel finishes, which is time
the player has already agreed to spend, and the room arrives correct. The
deferral still earns its place: it is what lets every mesh in a room being
built carry one material, so a single compile covers the lot, and it keeps a
variant from ever being compiled for a mask no zone actually uses. The lean
material is now a build-time placeholder that is never rendered.

**Verified** with a throwaway probe: uncompiled variants stand in lean, every
mesh of a mask swaps together, a mask compiled once is assigned outright
thereafter, a mesh registered mid-flight is not swept up by the resolve, and
mask 0 never leaves the shared material.

**Not done:** `precompile` does not carry a probe. It could — attaching one and
*not* resolving would warm the programs so the entry's compile hits the cache
and the bar is shorter — but `precompile` is called exactly once, at boot, for
the countryside, so today it would buy nothing for the rooms that actually feel
this. If the neighbour prefetch (Phase D) ever grows to compile as well as
load, that is where this belongs. Resolving off it would still be wrong: it
would hand meshes materials compiled under another zone's census with no
compile between the assignment and the next frame.

---

### The original design

The idea: a complex prop is usually seen from a distance before it's seen up
close — show something cheap and static until the real shader is ready, then
swap, same geometry, no second mesh.

With C in place this is nearly free, because it's a *material* swap, not a
mesh swap:

1. When a zone's recipe batch is placed, assign it the **lean** material
   (mask stripped to base finish) immediately. The prop renders at once with
   its base FINISHES parameters — the frost orb is a matte white stone, the
   schiller orb a dark glossy one. Correct silhouette, correct base colour,
   one Lambert lobe: exactly the "cheap static version", derived from data the
   part already declares rather than authored twice.
2. In parallel, request `artMaterialFor(fullMask)` and `compileAsync` it
   (Phase B's machinery, pointed at one material).
3. On resolve, set `mesh.material = full` — one assignment, no geometry
   touched, next frame draws the real thing.

Most of the time the swap resolves inside the entry fade and is invisible. If
a compile outlasts the fade, the pop is a stone gaining its fire a beat after
you walk in — acceptable, rare, and strictly better than the frame hitch it
replaces.

**Optional extension — distance-deferred compile:** don't request the full
material until the player is within a radius of the batch (the clutter cull
already does this shape of check per frame). Worth it only if the variant
count grows enough that compiling every mask on entry measurably lengthens
the fade; with A–C landed that is unlikely, so this stays a documented option
rather than a task.

**Constraint: E never touches geometry.** The swap is one material
assignment on a mesh that already exists — no proxy mesh, no second builder
output, no LOD geometry, ever. The geometry is not the cost — the program is
— and a proxy would be a second thing to author, place, and keep in sync for
no win over the lean material the batch already has. If a future change finds
itself wanting a stand-in *mesh*, it has misread this phase.

---

## Order and dependencies

| Phase | Depends on | Size | What it buys | Status |
|-------|-----------|------|--------------|--------|
| A — light tiers | — | small | zone entries stop compiling at all after the first few | landed |
| B — compileAsync | — | small | remaining compiles leave the critical frame | landed |
| C — feature/recipe gating | B (for E later) | large | material catalogue scales; per-frame cost drops | landed |
| D — code splitting | — | medium | builder/zone catalogue scales; boot stays flat | landed, migrating |
| E — stand-in hotswap | C | small | a room compiles one variant per finish it actually holds, once | landed |

All five are in. D is the only one with work left, and it is content work
rather than engineering: `load` is optional, so zones move a group at a time.
Migrated so far are the two hub interiors and the three countryside homes. The
galleries stay eager on purpose — see the note under D.

**What now bounds a cold entry**, with all five landed: one light-tier census
(A), one lean program plus one variant per finish the room actually holds and
has not paid for before (C + E), compiled behind the fade rather than on the
first frame (B), against code that arrived while the player was in the previous
room (D). None of those four terms grows with the size of the catalogue — the
variant term grows with the finishes in *this room*, which is why a materials
gallery is the slowest thing in the game to enter and an ordinary room is not.
That was the whole point.
