# Performance

**Built**, P0 through P6. **P7, adaptive resolution, is dropped** — it was
always conditional on the frame turning out fill-bound, and the per-pass numbers
P0 delivered say it is not.

A companion to [MASTER-SPEC.md](../MASTER-SPEC.md) and a sibling of [SCALING.md](SCALING.md). Scaling asks
what has to change for the world to reach its finished size. This asks a narrower and more
immediate question: **the game is demanding for a browser, and it degrades badly when the
machine is busy with something else.** Both halves matter, and they have different answers.

Everything here came from a six-way audit of the current tree plus a survey of what browsers
and three.js actually offer in 2026. Where a number is measured it says so; where it is
derived from the code it says that too. Nothing below is a look decision — the handful of
levers that would visibly change the image are quarantined in their own section and marked
as the owner's call.

---

## Two problems, not one

**Absolute cost.** A default outdoor frame currently runs five full scene rasterizations,
fifteen full-screen quads, a 4096² shadow map, and roughly 2.1 M groundcover triangles drawn
twice. Some of that is the look and is not negotiable. A surprising amount of it is
bookkeeping that produces nothing.

**Behaviour under contention.** When another game has the CPU, the frame loop and the audio
thread both starve, and the audio starves in a way the player hears immediately. This is
partly unfixable — no web API can raise a tab's scheduling priority — but the current
settings give away far more headroom than they need to.

The two are related: the cheaper the frame, the more contention it survives.

---

## First: we cannot currently see anything

**The classic `WebGLRenderer` has no GPU timing.** There is no `renderer.info` timestamp;
timestamp support exists only in the new `WebGPURenderer` stack. Nothing in this project
measures GPU time, and `ui/Performance.ts` reports frame intervals, which are vsync-quantised
into 16.7 / 33.3 / 50.0 ms buckets and therefore carry no gradient at all.

Two further traps worth writing down so nobody walks into them:

- **Chrome DevTools' "GPU" track is not GPU time.** It is populated from `GPUTask` events on
  the GPU *process's main thread* — CPU time spent decoding and issuing GL commands. A slow
  shader can show a short bar; a flood of draw calls shows a long one.
- **`performance.now()` around `renderer.render()` measures command submission, not
  execution.** On a GPU-bound frame it reads near zero.

So the first piece of work is a measurement one: wire `EXT_disjoint_timer_query_webgl2` by
hand — a query ring buffer, roughly forty lines — and put per-pass GPU time on the debug HUD.
Available on ~86% of Windows Chrome; absent on Firefox, which gates it behind a pref. Read
`QUERY_COUNTER_BITS_EXT` at runtime, use `TIME_ELAPSED_EXT` rather than `TIMESTAMP_EXT`, never
read a result before `QUERY_RESULT_AVAILABLE`, and discard everything in flight when
`GPU_DISJOINT_EXT` fires.

**The ten-minute version, available today:** halve the render resolution and re-measure. A
proportional drop means fill-bound; barely any movement means CPU-bound. That one test gates
most of what follows, and it costs nothing to run.

---

## The findings

Numbered for reference from the phases at the end. The order here is roughly by size of win;
the order they should be *built* in is the phase list.

### 1. Passes that produce nothing

Two items, after checking which ones survive contact with the actual zone contents.

**The particle pass runs in every zone** (`PostFX.ts:912`). Its siblings all gate on presence —
`water.hasWater` at `:861`, `glass.hasGlass` at `:876`, `fog.hasVolumes` at `:856` — but
particles gate only on the dev switch. `createParticles` has **exactly one real call site in the
project** (`debug/ParticleShowcase.ts:357`), so today every zone but that one showcase pays a
full-screen blit plus a complete scene traversal to draw nothing, every frame. Note that
`PARTICLES.md` plans wider use, so this is a gate that matters less over time, not more.

**Three full-resolution passes where one would do** (`PostFX.ts:591-593`). The chain ends
`PixelStage` upscale blit → `OutputPass` (sRGB only; tone mapping is `NoToneMapping`) →
`RetroShader`. At 1080p × DPR 2 that is ~25 M fragment invocations and ~133 MB of bandwidth per
frame for three trivial shaders. Concatenating them is byte-identical output — the ordering
constraint documented at `PostFX.ts:46-50` is satisfied by the concatenation order. This is the
only item here that pays in every zone unconditionally. The vignette in `RetroShader.ts:288-294`
— a `length`, a `smoothstep` and a multiply per pixel for a strength that is zero by default and
has no options-UI control — comes out in the same edit.

**Two candidates that look like this and are not, recorded so they are not re-proposed:**

- *A bloom presence gate.* Bloom is gated on `glow && strength > 0` (`PostFX.ts:883`) but never
  on whether the zone has anything on the glow layer. That sounds like the particle case, but
  the glow-emitting builders — candle, fireplace, forge, lantern, stove, streetlamp, floodlight,
  window, lettering — appear in every real zone: 101 uses across countryside, the homes build,
  interiors, chains and both galleries. The gate would be true almost everywhere.
- *Skipping the normal render when nothing reads it* (`PixelStage.ts:227-242`). Its consumers are
  the edge composite and GTAO, so the skip requires AO off **and** both edge strengths at zero.
  The edge strengths default to 0.2 and 0.5 (`PostFX.ts:234-235`) and are dev dials, not player
  options, so the condition is unreachable in practice.

### 2. The scene walk, paid seven times

This is the largest unclaimed CPU win in the codebase and it needs no three.js patching.

`WebGLRenderer.render()` calls `scene.updateMatrixWorld()` and then walks the entire graph in
`projectObject` — **on every call**. This project calls it up to eight times a frame (colour,
normal override, cover normals, bloom emitters, water, glass, particles, effect mask). Five of
those are `camera.layers.set(...)` passes that draw a handful of meshes, but `projectObject`
recurses into children regardless of the layer test; only `object.visible === false`
short-circuits it.

Measured on this machine at 2000 props / 4000 nodes:

| | now | achievable |
|---|---:|---:|
| `updateMatrixWorld` | 7 × 0.178 ms = **1.25 ms** | 1 × 0.044 ms = **0.04 ms** |
| `projectObject` walks | 7 × 0.138 ms = **0.97 ms** | ~0.28 ms |
| | **~2.2 ms/frame** | **~0.3 ms/frame** |

Three changes:

1. `scene.matrixAutoUpdate = false` and `scene.matrixWorldAutoUpdate = false`, with one
   explicit `scene.updateMatrixWorld()` in `PostFX.render` — **after** `sky.follow(...)` at
   `PostFX.ts:1029`, which writes `mesh.position` from the camera. The main loop already
   completes all movement before `postfx.render(elapsed)` (`main.ts:1019`), and nothing inside
   the composer chain writes a transform.
2. `updateMatrix()` then `matrixAutoUpdate = false` on static props at build time — in that
   order, or the matrix stays identity. Note that `matrixAutoUpdate` alone does not stop the
   recursion; the child loop in `Object3D.updateMatrixWorld` has no guard.
3. Optionally, `visible = false` on the static prop group around the five layer passes. The
   measured short-circuit is ~700×.

`camera.updateMatrixWorld` is separate and fires only when `camera.parent === null`; shadow
cameras self-update. Both remain correct.

### 3. The collision fix that is already written

`COLLISION-FIX.md` is a complete, measured diagnosis that was never built. Two defects in
three's `Octree` multiply: it subdivides to depth 16 whether or not subdivision separates
anything (33,662 village triangles become 790,287 entries across 235,615 nodes), and the
candidate dedupe is `indexOf` on a growing array, so cost is quadratic. Measured worst case is
**5.95 ms for a single query** in a dense interior, and `Controller` issues up to ~34 queries
per frame — then feeds back, because a slow frame means a larger `dt` means more sub-steps.

Phases 1 and 2 of that document turn a 6 ms query into 0.027 ms in one file with no content
decisions. Nothing else in this audit has that ratio.

### 4. Memory that is held and never used

| What | Cost | Where |
|---|---|---|
| The shadow map survives turning shadows off | ~117–134 MB never reclaimed | `ZoneManager.setShadows:281-283` sets `castShadow = false`; three never disposes `shadow.map` on that transition. A `sun.shadow.dispose()` fixes it. |
| Groundcover uploads the ultra pool at every tier | ~42 MB resident and never drawn at the default `high` tier (70% of ~60 MB); 91% at `medium` | `cover.ts:1286-1296` — tiers set `instanceCount` only. The shuffle-and-prefix design makes tier switching free; the price is permanent VRAM. Resampling on tier change trades tens of ms for tens of MB. |
| `PostFX.dispose` leaks `retroPass` and `OutputPass` | Two `ShaderMaterial`s and their programs | `PostFX.ts:1072-1083`; `EffectComposer.dispose()` frees only its own two targets and `copyPass`. Matters for hot-reload only. |

Total GPU memory for a populated level is ~215–232 MB at DPR 1 and ~510–530 MB at DPR 2, of
which the shadow map alone is about half. **Procedural textures are 445 KB — 0.2% of the
budget, and not worth touching.** The no-image-files rule has been kept to the point that
there is nothing there to optimise.

### 5. Early-Z, currently disabled everywhere

`art/glitch.ts:293` contains an unconditional `discard;` in a chunk that both `ART_MATERIAL`
and `ART_FINISHED_MATERIAL` compile in. Drivers disable early depth rejection for any shader
that *can* discard, so all opaque world geometry pays full fragment cost regardless of
occlusion — including the 16 PCF-soft shadow taps. The runtime guard (`if (uGlitchCount > 0)`)
is a branch, not a compile-time exclusion.

Making the discard `#ifdef`-gated and compiling a second program variant for glitched zones
restores early-Z for every ordinary zone. This is a real fill-rate saving on a scene with
depth complexity, and it changes nothing on screen. `TUFT_MATERIAL`'s stipple discard
(`cover.ts:320-321`) is genuine and stays.

### 6. Per-frame work that only needs to happen on change

None of these alter the image.

- **`updateWind` rebuilds and re-uploads two textures every frame** (`sway.ts:436-459`) — 256
  `fieldAt` evaluations, ~1,280 `Math.cos` calls. At the authored gust rate one frame advances
  the window by **0.14 of a texel**. Rebuilding at 10–15 Hz is pixel-identical. It also runs
  when `swayAmount` is 0.
- **`Emitter.update`'s parameter writes** (`Emitter.ts:320-347`) are all `setTargetAtTime` with
  a 0.08 s time constant, so the filter already smooths five frames. Folding them into the
  existing 0.12 s occlusion tick is inaudible and merges two loops.
- **Uniform writes that depend only on resize or zone entry** — `coverPixel`, `coverSunDir`,
  `coverGlow` (`cover.ts:1326-1335`), `uPixelsPerRadian`/`uNear`/`uFar` (`particles.ts:550-553`),
  the sky's `scale` (`Sky.ts:340`), `master.gain` (`AudioEngine.ts:325`), `sendGain`
  (`Emitter.ts:347`), the music trim (`director.ts:372`).
- **Per-frame closure allocation** — `poisson(rate)` and `periodic(period)` build a new closure
  every frame per emitter (`foliage.ts:156`, `machine.ts:255`); `AudioEngine.ts:358` allocates a
  `{emitter, priority}` object per emitter per tick despite the comment at `:114` claiming
  otherwise; `Collider.ts:233` allocates a `THREE.Ray` on every raycast.
- **`Interaction.probe` at 60 Hz** (`ZoneManager.ts:881`) — the reticle is imperceptibly better
  than at 15–20 Hz, and it is where the per-frame raycast and its allocations live.
- **`Crosshair`'s `readPixels`** (`Crosshair.ts:81`) is a full GPU→CPU sync, ten times a second,
  including while standing still. Gating on camera motion removes most of them.

Modern V8 makes *major* GC largely a non-issue; the thing that still hitches is **scavenge
frequency**, driven by allocation rate. The young generation is up to 16 MiB, so a couple of MB
of garbage per frame means a scavenge every few frames forever — invisible in an average,
audible and visible as micro-stutter under a constantly-moving first-person camera.

### 7. Audio under contention

This is the reported symptom, and it has two independent causes that sound different.

**The audio thread.** `AudioEngine.ts:130` opens the context with `latencyHint: 'interactive'`,
which asks Windows for the smallest buffer it will give. Chromium's WASAPI shared mode has a
documented typical delay of ~35 ms regardless, so the small buffer is buying less than it
appears to while costing all the underrun headroom. `'playback'` (≥20 ms on Windows) is the
documented escape hatch; a numeric hint gets rounded and undershooting the device period buys
underruns rather than latency. It can only be chosen at context creation, so it belongs in the
options menu as a startup setting, not a live toggle.

One thing already right: all DSP is in `AudioWorklet` and Web Audio nodes, never a
`ScriptProcessorNode`, and the audio render thread is MMCSS-boosted by Windows — which is
exactly why the audio survives contention better than the frame loop does, and why the
remaining glitches point at buffer size rather than at thread priority.

**The scheduler.** Every sound in the game — footsteps, rain, machines, and the music
director's bar clock — is queued from the `requestAnimationFrame` loop with a 140 ms lookahead
(`dsp/clock.ts:22`). A contended GPU makes browser frames arrive late and irregularly, and any
gap longer than the lookahead empties the queue; the clock then resyncs to now. Two fixes:

1. Raise `LOOKAHEAD` to ~400 ms. Costs nothing in latency for reactive sounds, which are
   scheduled at `currentTime` directly. The only cost is that a machine changing speed takes up
   to 400 ms to respond.
2. Pump the music director's bar clock from a Web Worker timer rather than from rAF. It needs
   no frame state, and worker timers keep ticking at a steady rate regardless of what the
   renderer is doing. The model-driven clocks stay on rAF — they read positions and distances
   that only exist per frame.

Two facts worth keeping: **Windows raises a process to High QoS while it is playing audio**, so
a game with sound is genuinely in a better scheduling class than a silent one; and Windows may
*lower* a foreground application to Medium QoS after a period with no input detected on battery
— which will bite during a long idle or an automated benchmark.

### 8. Adaptive resolution — after measurement, not before

The chunky render scale (`PostFX.ts:840-842`) is already a global resolution lever wired to a
player toggle. Making it adaptive is the standard answer to "runs badly on a busy machine", but
it should be built last, for two reasons.

**It may not help here.** Dynamic resolution assumes cost scales with pixels. Shadow map
generation, culling, and scene traversal do not — and this project's frame is heavy in exactly
those. If the timer queries show the shadow pass dominating, a resolution scaler will
underdeliver and the effort belongs elsewhere.

**Naive implementations oscillate by construction.** rAF deltas are vsync-quantised, so a
controller reading them infers enormous headroom the moment it drops a step, raises, and snaps
back. The shape that works — Google's model-viewer ships it against three.js — is: an EMA of
**GPU time**, a clamp on how far one update may move the average (so a single compile hitch
cannot yank it), quantised scale steps, a deadzone wide enough to straddle the vsync buckets,
and a reset to the deadzone midpoint on every change. Raises must additionally be gated on
actually being GPU-bound.

If it is built: reallocating render targets per step is the black-frame source and, worse, a
VRAM leak unless the old ones are disposed. The fixed-max-target-plus-viewport-sub-rect
approach avoids both, at the cost of clamping UVs in every neighbour-sampling pass.

### 9. Boot time

Not the reported problem, but it is where the largest single block of main-thread work sits.
Groundcover sampling dominates: `cover.ts:994` rolls up to a million blades per zone, pushing
~18 M values into plain arrays before shuffling and copying into typed arrays. It is a pure
function of the terrain and a seed, it touches no `THREE` state beyond reading attributes, and
it produces transferable `Float32Array`s — so it is the clean candidate for a Worker.

Two smaller ones: the collider octree (which phases 1–2 of `COLLISION-FIX.md` would shrink 4.6×
for free before any threading), and the noise buffers, which fill 3 × 6 s of audio sample by
sample on the main thread.

Shader pre-compilation is already handled well — `compileAsync` against a stand-in scene with
the right light census, light-count tiers to stop program explosion, and a full throwaway frame
before the loading screen lifts. The residual hitches are the conditionally-enabled effect
passes (water, glass, glitch, horror, effect mask), each compiling on the first frame of the
first zone that needs it, i.e. immediately after the fade. Forcing every pass on for one
throwaway frame during boot closes it.

---

## Levers that change the look — the owner's call, not mine

These are real savings and they are listed so the cost is known. Each one changes what is on
screen, so none of them are proposed.

| Lever | Saving | What changes |
|---|---|---|
| Shadow map 4096² → 2048² | ~85 MB and three quarters of the shadow fill | Shadow texel goes 2.3 cm → 4.6 cm. Worth noting that `ZoneManager.ts:214-240` gives *bias*, not resolution, as the reason for 4096, and then records `normalBias` as the thing that actually closed the seam. |
| GTAO `SLICES`/`STEPS` (4 × 6 = 48 taps) | Up to 4 chunky full-screen passes | The file documents at `:33-37` that these control variance near furniture; cutting either brings back the grain the two blurs are sized to remove. |
| Fog volume `STEPS = 8` | Up to 384 noise taps per pixel | Fewer steps re-introduce concentric shells; the jittered start is what currently converts banding into noise. |
| Bloom `LEVELS = 3` | 2 of 6 full-screen passes | Narrows the halo. |
| Groundcover density | Proportional to ~2.1 M triangles, drawn twice | Already a player option; the default tier is what is being measured. |
| A CAS sharpen after a lower render scale | Makes a lower scale look acceptable | Five taps; the best value-per-instruction in the resolution area, but it is a look change. |

---

## Ruled out, and why

- **Reduced-rate or baked shadow maps.** Ruled out by the day/night decision — the sun moves.
  Stated once for completeness: the audit found the map is regenerated every frame
  (`PostFX.ts:1026`) at 4096² over the full 96 m zone with every non-clutter mesh submitted, and
  that at 2.3 cm/texel a quarter-degree of sun rotation moves the shadow edge well under a
  texel, so an *angle*-gated `needsUpdate` would be visually exact rather than approximate. Not
  proposed; noted so the number is on the record.
- **Cascaded shadow maps.** `CSM.js` creates one real `DirectionalLight` per cascade, so four
  cascades mean four shadow targets and four full scene traversals — quadrupling the cost of the
  thing it is meant to help. A hand-authored 96 m cell with an already-tight shadow camera is
  exactly the regime where CSM is a net loss.
- **Streaming or chunking levels.** Against the design: cells are small, hand-authored and
  rebuilt from seeds.
- **Anything mobile-specific.** Desktop keyboard and mouse only.
- **WebGPU / `WebGPURenderer`.** Not maturity hand-waving: a clean r183 benchmark measures ~2×
  the CPU cost and 5–10× the first frame against `WebGLRenderer`, on both backends, tracked as an
  open high-priority defect (three.js #30560, still open as of March 2026). Separately, and
  decisively for this codebase, `onBeforeCompile`, `ShaderMaterial` and `RawShaderMaterial` do
  not work there at all — and the entire art pipeline is a chain of `onBeforeCompile` patches.
- **`BatchedMesh`.** Hard-requires `WEBGL_multi_draw` with no fallback path in three's source,
  and does per-instance matrix + bounding-sphere + frustum + sort work in JS every frame;
  measured 4× CPU regressions against plain meshes are on record. `InstancedMesh` has no
  per-instance frustum culling, which is the wrong trade for a first-person camera.
- **OffscreenCanvas / rendering in a worker.** The official three.js example demonstrates *jank
  isolation* — it ships a synthetic main-thread hog to prove it — not throughput. The GL calls
  end up in the same GPU process either way. High integration cost, permanent architectural
  constraint.
- **Upgrading three.js for performance.** r185 measures **+35.5% gzip** on an identical minimal
  entry. Staying on r170 is worth ~45 KB.

## The gutting question, answered

Whether a codebase that uses none of three's texture, skinning, morph, PBR or loader machinery
can strip it out for speed. The short answer is **no, and the reason is worth keeping**: the
things that are strippable are load-time bytes, and the things that cost frame time are not in
three at all.

What the audit confirmed the game genuinely never touches: `MeshStandardMaterial`,
`MeshPhysicalMaterial`, every map slot, env maps, PMREM, IBL, `SkinnedMesh`, `Skeleton`, bones,
morph targets, the whole animation system, every `Loader`, `LOD`, `Sprite`, `InstancedMesh`,
`BatchedMesh`, clipping planes, XR, and three's audio. Planned NPCs do not change this —
`assemble.ts:39` already records that a jointed figure is *a matter of not merging*, and Phase 7
puts sway in the vertex shader.

And yet, measured on this machine with this project's own Vite pipeline:

| Idea | Result |
|---|---|
| Named imports instead of `import * as THREE` | **80 bytes.** Rollup shakes the namespace import just as well. Do not refactor the 185 files. |
| Import from `three/src/Three.js` | *Larger*: 134.6 vs 126.5 KB gzip |
| Strip every unusable `ShaderChunk` | 111 KB raw → **~16 KB gzip.** GLSL compresses away. |
| Strip unused branches from *generated* shaders | three's own `#ifdef`s already remove **85%** before the driver sees it; the rest is dead-code-eliminated by the compiler. And three contributes only ~31% of this game's shader source — the recipe/glitch/horror GLSL is the other 69%. |
| Fork or vendor a slim three | ~3,600 changed lines across 77 files in 15 releases, in the fastest-churning files in the repo, to buy ~9–16 KB gzip |
| `RawShaderMaterial` for speed | Compile-time prefix only; a missing built-in uniform is already a map miss |
| Cache the lights uniform rebuild | O(lights) with tiny constants, already gated by program-switch *and* a value cache. And the light state hash tracks light *counts* only — so a sun that moves every frame never forces a re-resolve. Nothing to fix. |
| Optimise the program cache-key path | It does not run per frame. `getParameters` and `getProgramCacheKey` are reached only when the material actually needs a different program. |
| Optimise `renderObject`'s matrix maths | **27 ns per draw** — 0.02 ms at 800 draws. The "4×4 inverse per object" scare is 9 ns. |
| Disable frustum culling | 18.6 ns per object, against a whole draw call |
| Disable render-list sorting | Sorting groups by material *before* depth, which is what keeps programs contiguous. Trades a fraction of a millisecond for unbounded uniform re-uploads. |
| Disable `renderer.info` | Free already, and load-bearing — `info.render.frame` is the once-per-frame geometry-upload dedup key |

The reason the gutting angle comes up empty is that **the codebase already did the work the
optimisation literature actually recommends**: two art programs for the whole game, one draw
call per prop, light counts quantised into tiers so the program set stays constant, explicit
`customProgramCacheKey` at all seventeen patch sites, `compileAsync` prewarming, and a shadow
pass deduplicated across composer passes. The conventional wins are spent. What is left is in
§1–§7 above, and it is all this project's own code.

One correctness note that fell out of the same investigation: **the "free" shadow toggle is not
free.** `Viewport.ts:36-45` reasons that flipping `sun.castShadow` avoids the recompile that
`shadowMap.enabled` would cause. But the sun is the only caster, so turning it off makes
`shadows.length === 0`, which flips `shadowMapEnabled` in the program cache key and changes
`numDirectionalShadows` in the light hash — a full recompile of every lit program either way.
`sun.shadow.intensity = 0` is a plain uniform and is the genuinely free version.

---

## The phases

Ordered by what unblocks what, what is provably invisible on screen, and what needs the owner's
eye before it can land. The first slice is **P0 + P1**: one gives sight, the other fixes the
reported symptom, and neither depends on anything else.

### P0 — Sight

Hand-wired `EXT_disjoint_timer_query_webgl2` — a query ring buffer, roughly forty lines — with
each composer pass bracketed and per-pass GPU milliseconds on the debug HUD beside the existing
frame stats. Then the half-resolution A/B test. Degrades to "unavailable" where the extension is
absent rather than breaking.

Changes nothing in the game. Gates P7 entirely, and decides whether P4's early-Z trade is worth
making. *First: we cannot currently see anything*, above, records the two traps — DevTools' GPU
track and `performance.now()` around `render()` — that make this necessary rather than merely
nice.

### P1 — Audio under contention

Lookahead 140 → ~400 ms in `dsp/clock.ts`, the buffer-size choice as a startup setting in the
options menu, and the music director's bar clock pumped from a worker timer instead of the frame
loop. §7.

Independent of everything else, cheap, and it is the symptom that started this. The model-driven
clocks stay on the frame loop — they read positions and distances that only exist per frame.

### P2 — The invisible wins

Three things that cannot change what is on screen:

1. **The scene walk** (§2) — `matrixAutoUpdate` and `matrixWorldAutoUpdate` off, one explicit
   `updateMatrixWorld()` in `PostFX.render` after `sky.follow`, static props' matrices frozen at
   build time, `visible = false` on the static group around the layer passes. ~2.2 ms → ~0.3 ms
   at 2000 props. **The headline of the whole plan.**
2. **The particle-pass presence gate** (§1).
3. **Fusing the three device-resolution passes into one** (§1), vignette dead code removed with
   it.

The risk lives entirely in the first item and it is specific: anything that writes a transform
after the update point silently stops moving — doors, the cloth rig, `LightActivity`,
`GlitchActivity`, `HorrorActivity`. The phase is mostly an audit of who writes transforms per
frame and when; the four lines are the easy part.

Verification is `renderer.info` draw counts before and after, plus P0's numbers.

### P3 — Collision

`COLLISION-FIX.md` phases 1 and 2, as written there. 5.95 ms worst-case query → 0.027 ms. One
file, no content decisions, independent of everything above — it can run in parallel with any
other phase. §3.

### P4 — Memory and early-Z

Dispose the shadow map when shadows are switched off (~117–134 MB currently unreclaimable),
resample groundcover on tier change (~42 MB held and never drawn at the default tier), and make
the glitch `discard` compile-time rather than a runtime branch so early-Z returns for ordinary
zones. §4, §5.

The last one adds a program variant for the art material and a `customProgramCacheKey` change, so
it trades compile time against per-frame fill. P0's numbers decide whether that is a good trade.

### P5 — Change-driven work

Wind table rebuild throttled to 10–15 Hz, `Emitter.update`'s parameter writes folded into the
existing 0.12 s occlusion tick, the per-frame closure and object allocations killed in the audio
clocks and the ranking loop, the reticle probe dropped to ~20 Hz, the crosshair's `readPixels`
gated on camera motion. §6.

Individually small. Together they are the scavenge-frequency fix, which is what micro-stutter
under a constantly-moving camera usually turns out to be.

### P6 — Boot

Groundcover sampling moved to a Worker — the largest single piece of engineering in the plan, but
it is a pure function of terrain and a seed, touches no `THREE` state beyond reading attributes,
and already produces transferable typed arrays. Plus one throwaway frame during boot with every
effect pass forced on, so water, glass, glitch, horror and the effect mask do not compile on the
first frame after a fade lifts. §9.

### P7 — Adaptive resolution *(dropped)*

Conditional on P0, and P0 answered it. The frame is not fill-bound, so a resolution
scaler underdelivers and the effort belongs elsewhere. §8.

*Done when the game holds its frame rate on a machine that is busy with something else, and
when the answer to "why is this frame slow" is a number on a HUD rather than an argument.*
