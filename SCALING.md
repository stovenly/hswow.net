# Scaling to the finished shape

A companion to [SPEC.md](SPEC.md), and subordinate to it: the spec says what the game
is, this says what has to change structurally for the game to reach the size it is
meant to reach. Nothing here is a feature. Everything here is a decision that is cheap
to make now and expensive to make after the phase that depends on it has shipped.

Written to be read cold. Update it as the shape settles.

---

## The shape this assumes

Everything below derives from five numbers. If any of them move, the priorities move
with them.

| | |
|---|---|
| **Hubs** | Nine, each a cell the size of the current test bowl — 96 m, not a landscape |
| **Interiors** | A variety on every hub, of roughly the size of the example interior |
| **Density** | About three times what the debug maps carry today |
| **Sessions** | Long, with autosave |
| **Targets** | Desktop at 60, and a phone, per Phase 9 |

Two consequences fall straight out of that and drive most of this document.

**No zone is ever big.** The world grows by adding cells, not by growing them. Per-zone
cost is bounded permanently, which retires a whole class of worry — see *Ruled out*.

**There are a great many zones.** Nine hubs with a variety of interiors each is
plausibly sixty to a hundred and forty. Everything the engine currently keeps *per
zone, for the whole session* is therefore multiplied by that number, and the policies
that were written when there were nine zones do not survive it.

---

## The cost basis

The debug maps are placeholder content and nothing here is a judgement on what is in
them. They are used for one thing only: **what a prop costs**, which is the only
measured basis available for projecting forward.

Counted headless, by building every zone and walking it:

| zone | meshes | triangles |
|---|---|---|
| exterior (Proving Ground) | 100 | 10,990 |
| example interior | 21 | 3,284 |
| factory | 65 | 8,638 |
| village | 310 | 130,398 |
| gallery-foliage | 528 | 349,240 |
| gallery-village | 410 | 29,662 |
| gallery-factory | 310 | 59,480 |
| gallery-animal | 117 | 19,144 |
| sound-stage | 215 | 5,768 |

Two materials across the whole of it, one geometry per prop.

> **These are static counts, not profiles.** Nothing here has been measured in a
> browser with a frame timer. That is the first item on the priority list for exactly
> that reason: every number below this line is arithmetic on top of the table above,
> and arithmetic is a hypothesis.

### Submissions per frame, in a hub at 3× density

`RenderPixelatedPass` renders the scene twice — once for beauty, once with
`scene.overrideMaterial` set to a `MeshNormalMaterial` for the edge detector. And
`WebGLRenderer.render()` calls `shadowMap.render()` unconditionally
(`WebGLRenderer.js:1218`), with `shadowMap.autoUpdate` defaulting to true, so **the
shadow map is drawn on both of those passes**. The second one is pure waste: the shadow
pass uses its own depth materials and ignores `overrideMaterial` entirely.

Taking ~930 props and estimating 30% visible (the camera is about 100° horizontally and
fog does not cull much across a bowl narrower than `fogFar`):

| | submissions |
|---|---|
| Camera passes, 2 × ~400 visible | ~800 |
| Shadow pass, ~930 casters × 2 renders | ~1,860 |
| **As built today** | **~2,660** |
| Without the duplicate shadow render | ~1,730 |
| And without small props as casters | **~1,265** |

Two changes, neither structural, and the shadow pass stops being two thirds of the
frame. Desktop at 60 is comfortable after them; a phone is not, which is where
`BatchedMesh` eventually comes in.

### Memory, across a session

`assemble()` un-indexes every part before merging and carries `position`, `normal`,
`color` and `sway` — **40 bytes per vertex, and no index buffer.** That is a deliberate
trade for flat shading and it is not being questioned here; it just has to be counted.

- A hub at 3× density ≈ 390k triangles ≈ 1.17M vertices ≈ **~47 MB of vertex data.**
- three retains the CPU-side typed arrays after upload by default, so that is held
  twice — **~94 MB resident per hub.**
- The collider's octree holds `Triangle` objects of three `Vector3`s each. At roughly
  200 bytes per triangle effective, and about a third of the geometry being collidable,
  **~20 MB per hub.**
- Interiors are cheap alone — about a megabyte — and there are a hundred of them.

**Nine hubs resident is on the order of a gigabyte.** That is a tab kill on a mid-tier
laptop and a certain one on iOS. Long sessions do not merely risk reaching it; the whole
point of nine hubs is that the player visits all of them.

---

## Ruled out by this shape

Recorded so the question is not reopened.

**Cascaded shadow maps — not needed, ever.** The 4096² map, the ±48 m orthographic box
and the bias tuning documented in `ZoneManager` are sized to a 96 m cell. Because the
world grows by adding cells rather than by growing them, that sizing is correct
permanently. This was a live risk only under the assumption of one large exterior.

**Proximity prop streaming — not needed.** Per-zone prop counts stay bounded at around a
thousand. Phase 5 deferred this to Phase 9 on the grounds that the collider cache had
removed the cost; the rationale was about index rebuilds rather than about draw
submission, so it was right for the wrong reason. Under this shape it is right outright.

**Mesh LOD and billboard impostors — the wrong axis.** Triangles are not the constraint
at any density under discussion, and both of them leave draw call count untouched.
Impostors would also need a texture atlas, against a project whose premise is that
nothing is textured.

---

## Priorities

### 1. Zone residency

**The problem.** Zones build lazily and are kept for the session — geometry, collider
octree and soundscape. That is the right default and its reasoning is sound at nine
zones. At sixty to a hundred and forty it is the arithmetic in *Memory* above.

**The change.** Not an LRU. **Key residency to the portal graph.** `PortalGraph` already
knows precisely what the player can reach in one action — `portals.in(zoneId)` — so the
resident set is the current zone plus everything one portal hop away, which under this
shape is naturally *one hub and its interiors*: about eleven zones, on the order of
60 MB. Evict past two hops.

Three things already in the repo make this cheap rather than painful:

- **Builders are seeded and deterministic.** A zone is a name and a list of seeds, and
  rebuilding it is guaranteed to give back the same world. This is the return on the
  `Math.random` ban in builders, and it is what makes eviction *safe*. Phase 5 rejected
  rebuild-on-entry because it pays the build cost at every threshold — true, and under
  neighbourhood residency the cost is only paid for cold zones, which are by
  construction the ones the player just walked two hops away from.
- **`ZoneManager.prebuild` already exists.** After an entry, warm the neighbours over the
  following frames. Cold entry then only happens on hub-to-hub travel, which can afford
  a longer cover and already has `Loader` for it.
- **The CPU-side arrays can be dropped for decoration.** `attribute.onUpload(function ()
  { this.array = null })` halves the geometry cost for anything that is neither
  collidable nor raycast for interaction — most props at final density. Collidables and
  interactables must keep theirs, because the octree and `Interaction.probe` read them,
  so this keys off the `solid` flag the kit already carries.

*Done when a session that visits every hub and every interior settles to a bounded
resident set, and the check suite asserts it.*

### 2. The override layer, and stable ids

**The problem, and it is the same problem as the one above.** If a zone can be torn down
and rebuilt from a seed, then anything the player did to that zone cannot live as a
mutation of the built `Group`. It has to be data held outside the zone, keyed to a
stable id, and replayed onto the zone when it is rebuilt.

**Why it is urgent.** Phase 8 brings inventory, items and quests — the first
player-caused changes to the world. If eviction is not designed by then, object identity
becomes scene-graph identity, and unwinding that afterwards touches every interactable,
the save format and the zone lifecycle at once.

**The rule to establish now:** *player-caused changes are an override layer keyed by
stable id; they are never a mutation of built geometry.* Costs almost nothing today.

*Done when a zone can be evicted and re-entered with every player-caused change intact.*

### 3. The shadow pass

**Two changes, both small, and together the largest frame-time win per line in the
project.**

- `renderer.shadowMap.autoUpdate = false`, with `needsUpdate = true` set once per frame
  before `postfx.render()`. Byte-identical output, half the shadow cost, because it
  removes the duplicate render described above.
- A `casts` flag on `MeshBuilder`, or a threshold on `radius`. `ZoneManager.prepare()`
  currently sets `castShadow` on everything but glow and ground; at final density grass
  and clutter are the bulk of the object count, and their shadows are sub-pixel after a
  three-pixel chunk and a five-level quantize.

Beyond those two, and once §5 has separated static geometry from dynamic: the world is
static and the sun is static — `postfx.aimSun` is called once — so the world's shadow map
only needs re-rendering **on zone entry**. That is the change that makes 3× density
comfortable rather than merely affordable, and it is a Phase 7 decision because Phase 7
introduces the first geometry that moves.

*Done when a hub at final density holds 60 on a mid-tier laptop with shadows on.*

### 4. Instrumentation, and the leak check

Every number in this document is arithmetic. Make them observable before acting on more
than the free wins.

- `renderer.info.render.calls` and `.triangles` into the `?debug` readout. Note that
  `readout.triangles` in `main.ts` is currently *collider* triangles, which is a
  different and also useful number — both want to be visible, distinctly labelled.
- `performance.memory` where the browser offers it.
- **Extend the crossing check.** `check:world` already asserts that sixty crossings
  change neither triangle count nor child count, which is exactly the right instinct.
  Under residency it should assert that N crossings across a hub neighbourhood return to
  a *bounded resident set* and a stable heap. That is the leak canary for long sessions,
  and the check suite is the right home for it.

> **A gap worth closing while in there.** Every assertion in `check:world` is of the form
> "everything present is valid", which passes vacuously on an empty result — a placement
> rule that puts down a tenth of what it asked for, or none of it, is invisible to the
> suite. Asserting that a scatter lands within some fraction of its requested count
> catches a whole class of content fault that grows more likely as content volume grows.

*Done when the frame's real cost can be read off the screen on the deployed build.*

### 5. Static and dynamic, declared

`place()` already marks collidability. Add the second axis before Phase 7 puts the first
moving thing in the world, because batching, baked shadow maps and cached collider
indexes all assume geometry does not move. Declaring the split costs one parameter now;
retrofitting it after NPCs, sway, doors and mechanisms exist means revisiting all of
them.

Note the three-way interaction landing in the same phase: sway is a vertex displacement
patched into the shared material, so it needs the same patch on the shadow depth material
or shadows will not move — and a baked static shadow map means they cannot. The cheapest
coherent answer is probably that swaying things cast unswayed shadows, which nobody will
see through the pixelation. It should be a decision rather than a discovery.

### 6. Autosave at transitions

Not on a timer. **Save inside the fade.** The transition is already at full black for a
third of a second, a synchronous `localStorage` write of that payload is single-digit
milliseconds, and in a world of this many zones the player crosses thresholds constantly
— so the natural save cadence is also the free one. A timer-driven autosave is the
version that hitches mid-play.

This holds as long as the override layer of §2 stays ids and flags rather than
serialised state.

### 7. A builder returns a descriptor, not a `Mesh`

`MeshBuilder.build()` is typed as returning `THREE.Mesh`, which fixes one draw call per
prop into the contract every builder is written against. Returning geometry plus its
metadata, and letting the caller decide what it becomes, keeps `BatchedMesh` available as
a small change rather than a rewrite.

The seam already exists and is clean: **fifty-two of sixty-six builders call `finish()`,
none construct a `Mesh` directly, and only five attach glow children.** So the work is
`finish()`'s return shape plus its callers — `place()`, `scatter()`, and the gallery
layout helper — rather than sixty-six files. An afternoon now; a project at two hundred
builders.

---

## Already correct — verified, no action

Recorded because each of these looked like a risk and turned out to be handled.

- **Soundscape deactivation disconnects rather than merely silencing.**
  `Soundscape.setActive(false)` sets `emitter.enabled = false`; `AudioEngine.ts:346`
  forces disabled emitters to `'virtual'`; `setDetail('virtual')` disconnects the model
  from the graph. A dormant soundscape costs nothing per quantum, so "silenced, never
  torn down" scales to this shape as written.
- **Interiors default to `SILENCE`,** so soundscape residency is bounded by hub count —
  nine — rather than by zone count.
- **One material across the art kit.** Near-zero program switches is most of why the
  current draw call counts are affordable at all, and it is what makes batching a
  straightforward change when it is wanted.
- **Seeded, reproducible builders.** The precondition for eviction, established long
  before eviction was on the table.
- **The voice cap, panner LOD and emitter virtualisation.** The audio system's runtime
  scaling work is already done; its remaining risk is authoring effort, not frame time.

---

## Deferred, with triggers

| | Trigger |
|---|---|
| `BatchedMesh` | `info.render.calls` past ~1,200 on desktop, or the phone build missing 60. §7 is what keeps this small when it fires. |
| Freeing decoration's CPU arrays | Resident heap past whatever §4 shows is comfortable. |
| Anything about zone *size* | Never, under this shape. If a hub ever wants to be 200 m, reopen *Ruled out* first. |

---

## Order of work

1. §4 instrumentation — because everything else is a hypothesis until it exists.
2. §3 shadow pass — free, and the largest win per line.
3. §1 residency — the one that decides whether long sessions survive.
4. §2 override layer — must land before Phase 8.
5. §5 static/dynamic — must land with Phase 7.
6. §6 autosave, §7 builder contract — with the phases that need them.
