# Performance II: the crossing, the frame, the sound, and the bundle

**Built.** Decisions are folded in at the end, with what came out differently. It follows `done/PERFORMANCE.md`,
`done/WORKERS.md` and `done/MORE-WORKER-TASKS.md`, and everything those three
ruled out stays ruled out: no reduced-rate shadow map, no cascades, no WebGPU,
no `BatchedMesh`, no renderer in a worker, no forked three. This document does
not reopen any of it. It is the next layer down: what is left once the
conventional wins are spent, found by reading every hot path again with the
current code in front of it.

It also takes a position the earlier documents could not: **the game is
Chrome-only.** Desktop, keyboard and mouse were already locked; this narrows the
browser too, so anything Chrome ships is fair to use. Phases 4 and 6 are what
that buys. Phases 1, 2, 3 and 5 need nothing but WebGL2 and are worth doing on
their own.

Working names throughout. Every number below is from reading the code, not
from an instrument, and the render is the only place that can say whether a
step earned its keep.

---

## The problem, stated once

Four costs, in four different places.

**The crossing.** `Zone.root()` is one synchronous call, and most of what is in
it is no longer the props. The terrain's `coverEdge` ring probes eighteen points
per vertex, and each probe walks every ground and cover patch: on the village's
~16,000 vertices that is on the order of three million segment tests, plus one
throwaway `Map` per vertex. The skirt is another ~15,000 vertices of the same
shape. `Collider.carve` allocates one `THREE.Triangle` and pushes nine numbers
into a plain array for every triangle in the zone before converting. The cover
sampler builds its field as boxed `number[]`, packs it, transfers it, and then
`gather()` copies every attribute again on the main thread: at a million blades
that is ~76 MB per copy, twice. Its chunk keys are template strings, one per
blade. The vista ring and edge dressing plans run twice, once in the warm and
once in the walk. And the warm's fixed 2.5 s budget misses on a two-worker
machine with ~412 jobs in flight, so the props it was meant to take off the
frame land back on it.

**The frame.** The sky dome draws first with the depth test off, so all three
cloud decks and their four-step light march are evaluated for every chunky
pixel, including the ones a street then covers. The scene graph is walked up to
nine times a frame because every layer-restricted pass calls
`renderer.render(scene, camera)`; the `visible = false` short-circuit proposed
in `done/PERFORMANCE.md` §2 never landed. The normal target is half-float for a
packed normal, the AO targets are RGBA8 for one scalar, and the AO and bloom
targets carry depth renderbuffers nothing reads. 144 vec4 of glitch and horror
volume uniforms sit in the vertex stage of every art, depth, normal and mask
material whether or not the zone has a volume in it. `scene.onBeforeRender`
flips material visibility nine times for a value that changes twice, and the
cover pass swaps every chunk's material out and back each frame.

**The sound.** Every Faust worklet compiles its wasm in its own constructor, on
the audio thread. A pluck instrument builds a pool of four to eight waveguide
nodes, a rack builds several instruments, and racks are cached per vibe and
never evicted: a walk through every vibe leaves on the order of a hundred
worklets computing forever, because `process()` never returns false. Friction,
cavern and plant post a parameter message every frame with no dirty check. The
listener gets nine automation ramps every frame whether or not the camera moved.
And every grain, raindrop, bubble and footstep particle is two or three
`AudioNode`s built and dropped: a windy, rainy walk through the village is on
the order of one to two and a half thousand nodes a second, and one sand
footstep alone is about 280. The noise tables cost ~900,000 `Math.random` calls
on the main thread at boot.

**The bundle.** The art kit ships twice. `work/jobs.ts` imports the registry's
eager glob of all 192 builders, and the builders import `assemble`, which
imports the material layer, so the worker chunk is 785 KB of which ~600 KB is
the same code as the main chunk, parsed once per worker, up to six times. Three
is not in its own chunk, so every content change busts the whole 2 MB. The dev
panel, Audition, its baselines table, lil-gui and stats ship in production
behind a runtime flag, ~78 KB. The ramp LUT and its `DataTexture` are built at
module evaluation, before the loading bar exists.

---

## What Chrome-only buys, and the one thing it needs

Almost everything in Phases 4 and 6 hangs off **cross-origin isolation**: the
page has to be served with `Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp`. That unlocks `SharedArrayBuffer`,
`Atomics`, and an honest `navigator.hardwareConcurrency`. GitHub Pages cannot
set headers. The known working hack is a service worker that intercepts every
response and adds them, at the cost of one reload on the very first visit,
before boot and before the title. Electron sets them natively (`ELECTRON.md`).
The engine reads one flag, `crossOriginIsolated`, and never asks how it got set.

The rest of the list needs no isolation: `navigator.keyboard.lock()`, a
`desynchronized` canvas, `scheduler.yield()`, and the origin private file
system with synchronous access handles in workers.

---

## Phase 1 — the bundle

Mechanical, behaviour-preserving, and the cheapest download win available.

1. **Three in its own chunk.** `manualChunks` in `vite.config.ts` puts `three`
   and `three/examples/jsm` into a vendor chunk. Content and engine changes stop
   invalidating 500 KB that has not changed since r170 landed.
2. **The dev panel behind a dynamic import.** `main.ts` already guards the
   *call* on `flags.debug`; the import at the top of the file is what ships it.
   Move `installDevPanel` and `createDevTools`' lil-gui and stats imports inside
   the guard as `await import(...)`. Audition, `baselines.json`, Meter,
   FaustPanel and VoiceLabel's panel half go with it. `Identify` is
   constructed unconditionally and is small; leave it.
3. **`finish` becomes a sink.** This is the seam that halves the worker.
   Builders call `finish(geometry, ...)`; today that function lives in
   `assemble.ts` next to the material path, so a builder's import graph reaches
   the shaders. Split it: `assemble.ts` keeps `finish` and `capture`, and
   `finish` hands its geometry to whichever sink is installed. The main thread
   installs the one that dresses a mesh (`finishCaptured` and friends, in a
   module that imports `sway`, `finish`, `weathering`, `detail`, `sparkle`);
   the worker installs nothing and `capture` is the only path. No builder
   changes. The worker chunk sheds the ~24 GLSL blobs, `ShaderMaterial`,
   `onBeforeCompile` and everything under `art/glsl`.
4. **Builders lazy in the worker.** `registry.ts` stays eager on the main
   thread because `kinds.ts` resolves builders synchronously. The worker gets
   its own registry over the same glob, non-eager, and `prop-geometry`'s
   `inWorker` may return a promise; `worker.ts` awaits it. A worker then parses
   only the builders a zone actually asks for.
5. **The noise tables on the pool.** `done/MORE-WORKER-TASKS.md` left them
   because there is no Web Audio in a worker, which is true of the *buffer*, not
   the *samples*. A `noise-tables` job fills three `Float32Array`s and
   transfers them; `createNoiseBuffers` does `copyToChannel` and nothing else.
   The fallback room IRs' `decayingNoise` loop takes the same route.
6. **The ramp LUT behind the loading bar.** `ramp.ts` builds its LUT and
   `DataTexture` at import. Wrap it in a `warm()` that boot calls inside a
   loader step, so it lands on the bar instead of before it.
7. **Touch controls deleted.** Dropped in the master spec; `TouchControls.ts`,
   `isTouchDevice`, the `?touch` flag and the viewport meta are dead weight.

*Done when* the worker chunk is a fraction of its current size, `lil-gui` does
not appear in a build without `?debug`, three has its own hashed file, and the
loading bar is the first thing on screen after the dark ground.

**Looked at and left alone.** Precompression: Pages gzips on the fly and
ignores `.br` files, so there is no lever there, and Electron serves from disk.
Named imports instead of `import * as THREE`: measured at 80 bytes in
`done/PERFORMANCE.md`. The stale root build in `docs/assets` is 2 MB of
deployed dead weight, but `docs/` is a clone and what is in it is the owner's.

---

## Phase 2 — the frame

None of these should change the picture. Where one might, it says so.

1. **The sky draws last.** `depthTest: true`, `depthWrite: false`, a large
   `renderOrder`. The dome already sits at `camera.far * 0.95` and the skirt
   reaches 320 m, so the test passes exactly where nothing was written. The
   normal pass uses an override material and already depth-tests the dome, so
   it is unaffected; the water's reflection miss reads the sky analytically and
   never touches the dome. Indoors it is invisible either way. This is the
   single largest fragment saving in the frame, and it is a two-line change.
2. **The layer passes stop walking the world.** Each zone's props go under one
   static group at build, and everything observed onto `WATER_LAYER`,
   `GLASS_LAYER`, `PARTICLE_LAYER` and `GLOW_LAYER` goes under a sibling. The
   water, glass, particle, bloom-emitter, held and mask passes set the static
   group `visible = false` around their `render` call. `projectObject`
   short-circuits on `visible`, which is the ~700× measured in
   `done/PERFORMANCE.md` §2, and the lights stay where they are. Creatures,
   doors, cloths and anything `LightActivity` thaws are not in the static
   group, which keeps them in the passes that need them.
3. **Target formats.** The normal target becomes `UnsignedByteType`; the AO
   and blur targets become `RedFormat` + `UnsignedByteType`; the AO, blur and
   six bloom targets set `depthBuffer: false`. The ping pair keeps its depth
   because the held overlay clears and uses it. **The normal change is the one
   that could show:** the edge detector compares neighbouring normals, and
   eight bits is coarser than sixteen. Look at edges at the default strengths
   before calling it done.
4. **Volume uniforms compiled out.** `glitchVariant()` already keys the art
   program on the erode switch. Extend the key with whether the zone declared
   any glitch or horror volumes, and `#ifdef` the vertex arrays, the vertex
   loop and the fragment fields out of the variant without. The depth, normal
   and mask materials take the same define. Zones without corruption stop
   carrying 144 vec4 of vertex uniforms and a per-vertex loop, and skinned
   creatures stop flirting with the uniform limit. `prewarm` compiles both.
5. **Change-driven flips.** The visibility flips in `scene.onBeforeRender`
   move into `PixelStage.render` around the two renders that differ. The cover
   pass gets a second mesh per chunk on `COVER_LAYER` wearing the normal twin,
   instead of swapping materials on every chunk twice a frame. The
   `EffectContext` literal is hoisted and mutated.
6. **The crosshair reads asynchronously.** `done/PERFORMANCE.md` P5 gated the
   read on motion; it is still the frame's only hard GPU sync, ten times a
   second while moving. WebGL2 can `readPixels` into a `PIXEL_PACK_BUFFER`,
   drop a `fenceSync`, and collect the pixel a frame or two later with
   `getBufferSubData` once the fence reports done. The contrast flip lands one
   frame late, which is invisible, and the stall is gone.

*Done when* the debug panel's per-pass GPU readout shows the colour pass
cheaper outdoors with the sky unchanged to the eye, the frame readout's main
thread time drops with a dressed village on screen, and the crosshair no
longer appears in the pass list at all.

---

## Phase 3 — the crossing

The walk stays synchronous and a miss stays free, as `done/MORE-WORKER-TASKS.md`
settled. What changes is what runs before the walk and how it is stored.

1. **Terrain on the pool.** `Terrain.build()` is pure until its last line, and
   `done/MORE-WORKER-TASKS.md` left it inline because the cost was one
   `heightAt` per vertex. The `coverEdge` ring added since is where the time
   goes now. A `terrain-mesh` job takes the terrain's options, runs the same
   build, and returns the six attribute arrays; `onMain` wraps them and calls
   `finish`. The editor's live sculpt keeps calling the `inWorker` half
   directly, inline, which is what the pool already does when it is broken.
   Before moving it, fix it where it stands: the per-vertex `Map` becomes a
   fixed array of counts, and the `number[]` accumulators become typed arrays
   sized from the cell counts up front. Both are the same code in both places.
2. **The skirt on the pool**, the same way. It ends in `assemble` and
   `finish`, which is exactly the prop seam.
3. **`carve` stops allocating.** It stays on the main thread because it walks
   the scene graph. It writes straight into a `Float32Array` sized from the
   geometry counts it can read before the walk, with no `Triangle` objects and
   no `number[]`.
4. **The cover field is copied once.** `sampleCover` writes into typed arrays
   that grow by doubling rather than `number[]`; the shuffle, `gather`,
   `keepOf` and `chunkSphere` run in the worker before transfer, so `assemble`
   on the main thread wraps buffers and builds meshes and nothing else. Chunk
   keys become one packed integer. `sampleOnPool` reads `attribute.array`
   directly when it is already a `Float32Array` instead of `getComponent` per
   lane.
5. **Plans run once.** The vista ring and edge dressing plans are computed in
   the warm and stored beside the geometry they asked for; the walk claims the
   plan the way it claims a mesh. `doorwayAnchor` stops building a whole
   building to find a door: a builder that has a doorway says where it is
   through the same per-builder declaration that `asks` uses.
6. **The warm budget scales.** 2.5 s was set for one machine. The deadline
   becomes a function of jobs queued over workers available, with the current
   value as its floor, so two workers and 412 jobs do not time out into the
   walk. The queue jump for the collider stays.

*Done when* the village enters without the "compiling materials" note on a
warm machine, a cold zone's build indicator is dominated by the compile rather
than the build, and the crossing into the village on a two-worker laptop does
not fall back to inline props.

---

## Phase 4 — isolation and shared memory

Chrome-only from here on.

1. **The isolating service worker.** Registered from `index.html` before the
   module script, it adds the two headers to every response it serves and, on
   the very first visit, reloads once so the page runs isolated. It does
   nothing when `crossOriginIsolated` is already true, which is how it stays
   inert under Electron. The engine reads the flag once at boot and exposes it
   on the platform (`ELECTRON.md` owns that seam).
2. **Shared results.** The pool gains a shared path: when isolated, a job may
   be handed a `SharedArrayBuffer` to write into instead of transferring a
   result back, and the main thread wraps the same memory in
   `BufferAttribute`s. The cover pool is the case that matters: the worker's
   field *is* the main thread's field, and the copy in Phase 3 step 4 becomes
   zero.
3. **The parameter ring to the worklets.** Continuous parameters (friction's
   speed, cavern's draught, plant's rpm and load) and Phase 5's record queue
   go through a `SharedArrayBuffer` ring the worklet drains at the top of
   `process()` with `Atomics`. `port.postMessage` stays as the fallback and as
   the path for one-off messages like a room change.
4. **An honest core count.** `hardwareConcurrency` is exact under isolation.
   The pool's cap of six stays, because the reason for it was bandwidth, not
   the clamp.

*Done when* `crossOriginIsolated` is true on the deployed site and in the
window, the cover field is allocated exactly once per zone, and no per-frame
`postMessage` reaches any worklet.

---
## Phase 5 — the sound

1. **Compile once.** `FaustNode` compiles the fetched bytes with
   `WebAssembly.compile` and caches the `Module` beside them per URL. The
   `Module` goes through `processorOptions`, which structured-clones it, and
   `processor.js` instantiates without compiling. The synchronous compile
   leaves the audio thread entirely.
2. **Dirty checks.** `FaustNode.set` returns early when the value is unchanged.
   `updateListener` compares position, orientation and up against last frame
   and skips the nine ramps when nothing moved.
3. **Worklets are bounded.** Three moves, in order of how much each buys:
   pluck pools are shared per voice family across racks rather than built per
   instrument instance; alt textures and alt melodies, which only play on a
   dice roll, get a pool of one until they are chosen; and racks for vibes not
   heard recently are evicted past a small resident set. A worklet that has
   been silent past a settle window may return `false` from `process()` and be
   rebuilt on demand from the cached module, which with step 1 is cheap for
   every model but the reverb, which never sleeps.
4. **A grain and particle worklet.** One processor kind that owns the noise
   buffer and renders overlapping windowed grains, PhISEM particles, bubbles
   and raindrops from a ring of scheduled records: `{at, duration, rate, level,
   channel}` or a bubble's four floats. The existing 10 Hz and 20 Hz director
   tickers batch the records they would have turned into nodes and post them
   once per tick. `dsp/grain.ts`, `dsp/phisem.ts`, `dsp/bubble.ts` and the rain
   model's drop scheduler become writers of records rather than builders of
   nodes. This is the largest piece of engineering in the phase and the one
   that removes the engine's dominant allocation. With Phase 4 the record ring
   becomes shared memory and the message goes away too.
5. **Footstep particle counts.** Until step 4 lands, `scatterParticles`
   for sand and snow throws 124 and 112 nodes per contact. A lower count at a
   compensated level is a one-table change and buys most of the difference.
6. **The analyser disconnects when the meter hides.** Tiny.

*Done when* opening a music rack no longer shows a hitch on the audio thread,
walking every vibe in the gallery leaves a bounded worklet count, and a rainy
gust in the village no longer shows a scavenge every few frames in the
frame readout.

---
## Phase 6 — the Chrome features

1. **Keyboard lock.** After pointer lock, in fullscreen,
   `navigator.keyboard.lock()` captures Escape, Tab and Alt so they reach the
   game instead of the browser. This is the one item on the list that changes
   how the game feels: Escape stops being the browser's key. It needs a
   fullscreen control, which the options do not have today. **What Escape
   does under lock is the owner's call**, and the mechanism is all this
   proposes.
2. **A desynchronized canvas.** `Viewport` creates its own `webgl2` context
   with `desynchronized: true` and hands it to the renderer. It bypasses the
   compositor for lower input-to-photon latency under pointer lock, and it can
   tear. An option, off by default, until it has been seen.
3. **A zone cache on disk.** Builders are seeded and deterministic, which
   eviction already relies on. Everything Phase 3 makes flat (the terrain and
   skirt arrays, the octree plan, the cover pool at the tier in use) is written
   to the origin private file system by the worker that built it, keyed on
   project, zone, a hash of the document and its sidecars, and the engine's
   build hash. The warm reads through a synchronous access handle before it
   builds, and a hit hands the walk finished buffers. The editor bypasses it.
   Disk is bounded by evicting least recently used zones past a budget.
4. **`scheduler.yield()`.** Would let the parts of `build()` that stay on the
   main thread interleave with frames without making the walk async. Held as
   an open question below, because the walk staying synchronous was a
   decision.

*Done when* the second run of the game enters the village with neither the
build indicator nor the compile note showing, and Escape under fullscreen does
whatever was decided rather than releasing the pointer.

---

## Levers that change the look

Real savings, listed so the cost is known, none proposed. Each is the owner's.

| Lever | Saving | What changes |
|---|---|---|
| Shadow map 4096² → 2048² | ~50 MB and most of the shadow fill | Texel 2.3 cm → 4.6 cm, then resampled to 960×540 and quantised to 64 levels |
| `cloudShadowAt` per vertex instead of per fragment | Two noise taps on every outdoor lit fragment | Cloud shadow edges follow the mesh rather than the pixel |
| Normal target at 8 bits (Phase 2 step 3) | Half the normal bandwidth | Edge detection may shift at fine grazing angles |
| `MAX_GLITCHES` / `MAX_HORRORS` 16 → 8 | Half the volume uniforms even in zones that have them | A zone may hold eight of each, not sixteen |

---

## Ruled out, and why

- **Everything `done/PERFORMANCE.md` ruled out.** The reasons have not changed.
  `BatchedMesh` in particular looks tempting once the browser is Chrome, but
  the objection was the per-instance JavaScript it does every frame, not the
  missing extension.
- **Moving `carve` off the main thread.** It walks the scene graph.
- **A second `AudioContext` or rendering audio in a worker.** No Web Audio in a
  worker; the worklets are already the off-thread half.
- **Precompression.** Pages ignores it.

---

## Order and dependencies

The phases are numbered in the order they should be built.

1. **The bundle** first; it is mechanical and every later phase benefits from
   a smaller worker.
2. **The frame** is independent of everything and can run alongside any other
   phase.
3. **The crossing** wants Phase 1's `finish` sink, because the terrain and
   skirt jobs go through it.
4. **Isolation** needs nothing built first, and lands before the sound so the
   record ring in Phase 5 step 4 is shared memory from the start.
5. **The sound** is otherwise independent.
6. **The Chrome features** come last; step 3 caches what Phase 3 made flat.

The first slice is **Phase 1 plus Phase 2 steps 1 and 2**: the download
shrinks, the sky stops shading pixels that are thrown away, and the layer
passes stop walking the world. None of it can change the picture and all of it
is visible in the frame readout.

---

## Decided

1. **The isolating service worker ships on the web build.** One reload on the
   first visit is accepted.
2. **Escape under keyboard lock is the pause stack.** The pointer is released
   only while a menu is up.
3. **The zone cache holds everything**, the cover pool included, under a
   512 MB budget with least-recently-used eviction.
4. **No `scheduler.yield()` inside `build()`.** The walk stays synchronous
   and `Zone.root()` stays a plain call.
5. **Pluck voices are both shared across racks and put to sleep** past the
   settle window.
6. **All four look levers are taken**: the shadow map at 2048², cloud shadow
   per vertex, the 8-bit normal target, and the volume caps at eight.

## What came out differently

- **Phase 2 step 5, the cover twin.** The cover meshes keep swapping their
  material for the normal pass. A twin mesh per chunk would have to track a
  geometry that is replaced on every upload and an instance count that moves
  every frame, which is more work than the two property writes it replaces.
- **Phase 3 step 5, `doorwayAnchor`.** Still builds the building. A doorway
  is decided by the whole run of a builder's numbers, and separating that plan
  from its geometry is a rewrite of five building builders; the anchor is
  computed once per portal end at content load, not at a crossing.
- **Phase 5 step 3, pluck pools.** Not shared across racks. A pool grows one
  voice at a time from the first note, an instrument never played holds
  nothing, a voice silent for three seconds lets its worklet go and is rebuilt
  from the cached module on the next note, and racks past three go. That
  bounds the count without redirecting ringing tails between instruments.
- **Phase 5 step 5, footstep particle counts.** Left as they are: with the
  particle worklet in, a collision is a record and not a node.
- **The Electron spec's storage routing** is not here. `src/platform/` carries
  `isolated`, the window and the keys; storage stays on `localStorage` until
  that spec is built.
