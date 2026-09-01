# Work off the main thread — spec

**Proposed, not built.** A general worker pool the whole project can push jobs
onto, and the two first tenants: building a zone's geometry, and indexing it
for collision. Both are pure functions of a seed today and both currently run
as one synchronous burst that freezes the frame.

**The short version.** A `WorkPool` owns a fixed set of module workers and a
task queue. A *job kind* is registered once by name with two halves — the
worker half, pure and returning transferable buffers, and the main-thread half
that turns those buffers into whatever the engine wanted. Callers never see a
worker: they `await pool.run('zone-geometry', payload)`. Nothing about the pool
knows what a zone is.

---

## Why

Raising the countryside blocks for about two seconds. So did the proving
ground's `populate()`. Neither can yield: a builder is one synchronous call
that returns a finished mesh, and `Collider.warm` is one walk that returns a
finished octree. Behind a loading bar that is merely slow; behind a live title
screen it is a screen that ignores clicks.

## What cannot move

A worker has no DOM and no WebGL context. **Shader compilation, buffer upload
and anything touching the renderer stay on the main thread forever** — the
program-link hitches are not a worker problem and this spec does not claim
them. `THREE.BufferGeometry` and the math classes are pure and do run in a
worker; `THREE.Mesh` as the engine uses it does not, because `dressArtMesh`
assigns a live material.

That is the seam, and it already exists: `assemble()` returns a geometry,
`finish()` wraps it in a mesh. Everything above the seam is workerable.

## The abstraction

One pool, many kinds of job. The pool knows about queues, transfers and
failure; it knows nothing about art, zones or collision.

```
pool.run(kind, payload)  ──►  queue  ──►  free worker
                                            │
                                   worker half: pure, returns
                                   { result, transfer: [...] }
                                            │
                              main half: buffers ──► engine objects
```

- **A kind is registered in one place**, by name, with its two halves and its
  payload and result types. Adding a kind touches no engine code.
- **Results come back as transferables** — `ArrayBuffer`s moved, never cloned.
  A kind that cannot express its result as buffers does not belong in a worker.
- **Every job is cancellable and every job can fail.** A cancelled job's result
  is dropped; a failed one rejects and the caller falls back to running the
  work inline, so a browser that refuses workers still plays.
- **Determinism is the contract.** A kind must be a pure function of its
  payload. Everything here is seeded, so this holds — but a kind that reads
  ambient state would break silently and is forbidden.

**Pool size.** `clamp(navigator.hardwareConcurrency - 1, 2, 6)`. Minus one so
the main thread keeps a core to render on; floored at two because the number is
an anti-fingerprinting surface and some browsers return 2 whatever the hardware
is; capped at six because each worker parses its own copy of three, and past
that this work is memory-bandwidth bound rather than compute bound. No CPU
detection: no API reports core *type*, and on a P/E-core machine the count says
nothing about how many are fast.

## Step 1 — the pool, with one trivial kind

`WorkPool`, the kind registry, the queue, transfer handling, cancellation, and
the inline fallback. Proved with one job kind small enough to be uninteresting,
so the harness is what is under test.

*Done when* a registered kind runs on a worker, returns a transferred buffer,
survives a cancel mid-flight, and falls back inline when workers are disabled.

## Step 2 — split geometry from mesh in the art kit

`MeshBuilder` grows a `geometry(options)` half; `build` becomes `geometry`
followed by the dressing that needs a material. Same output, same seeds, same
pictures — this is a refactor with no behaviour in it.

*Done when* every builder in the registry produces byte-identical geometry
through the split path, and the galleries are unchanged.

## Step 3 — zone geometry on the pool

A zone build fans out per entry rather than per zone: a zone of two hundred
props is two hundred jobs, which is what makes the pool worth having. The main
thread receives buffers, wraps them, dresses them and places them.

*Done when* raising the countryside no longer blocks the title, the zone is
identical to the one built inline, and a cold entry is faster on a machine with
cores to spare and no slower on one without.

## Step 4 — the collision index on the pool

`Collider.warm` is a pure walk over triangles. The octree is a tree of objects
today, so this step is mostly about giving it a flat, transferable
representation and rebuilding it on arrival — or teaching the queries to read
the flat form directly, which is the better end state.

*Done when* indexing a zone happens off-thread, and standing on the result
behaves exactly as before.

## Step 5 — the second tenant

Prove the abstraction generalises by moving something that is not geometry.
Candidates, in order of how well they fit: item icon meshes (already built off
a queue), loot rolls, the audio engine's offline noise and impulse renders
(already async but main-thread), terrain heightfields.

*Done when* a second kind of work runs on the same pool with no change to the
pool itself.

## Step 6 — adaptive sizing (separate sign-off)

Replace the static clamp with measured throughput: start at the guess, time
the first batch, grow or shrink. Handles P/E cores, thermal throttling and a
busy machine — none of which any detection API would have reported.

*Done when* the pool settles on a different size on two machines with the same
`hardwareConcurrency` and different real throughput.

## What this is not

- Not a fix for shader compile hitches. Those are main-thread by definition.
- Not `SharedArrayBuffer`. It needs COOP/COEP headers on the host; transferables
  are enough for a one-way result.
- Not a worker per job. A fixed pool with a queue, or spawn cost eats the win.
- Not a change to what any builder produces. Every step above is behaviour
  preserving; if a picture changes, the step is wrong.
