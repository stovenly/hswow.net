# Builder loading — spec

**Built.** Every one of the 268 builders is in the boot graph, so walking into
riverside downloads the farm's pigs. `ZONE-LOADING.md` got the zones and their
code chunks off the boot path and recorded that `art/registry.ts` "needed
nothing — nothing imports it any more". Eleven modules import it now. This is
that regression, and the mechanism that stops it recurring.

**The one-sentence version:** `art/registry.ts` globs the builder directory
with `eager: true` and is statically reachable from `main.ts`, so the whole
catalogue loads whatever the zone is; the fix is an index that knows every
builder's name without importing it, and a gather that loads the forty a zone
actually names before its walk begins.

Checked against `art/registry.ts`, `art/registry-lazy.ts`, `art/lines/index.ts`,
`engine/work/pool.ts`, `engine/work/jobs.ts`, `engine/work/worker.ts`,
`world/kinds.ts`, `world/entry.ts`, `world/document.ts`, `world/warmProps.ts`,
`world/ZoneManager.ts`, `world/items.ts`, `world/loot.ts`, `world/ItemWorld.ts`,
`player/HeldTool.ts`, `ui/ItemIcons.ts`, `audio/models/items.ts`, `main.ts`,
`app/boot.ts`, `app/items.ts`, the 268 files in `art/builders/` and the
eighteen zone documents, as they stand.

---

## 1. What was seen

Loading `riverside` from `forest-path`, the network tab shows `porcine.ts`,
`bovine.ts`, `poultry.ts` and the rest of the catalogue coming down. Riverside
has no livestock in it; the farm does.

---

## 2. What is actually happening

`art/registry.ts:21`:

```ts
const modules = import.meta.glob<Record<string, unknown>>('./builders/*.ts', { eager: true });
```

`eager: true` is resolved by Vite into a set of **static** imports. The module
is statically reachable from the entry —

```
main.ts → app/items.ts → world/items.ts → art/registry.ts
```

— and ten other modules import it besides, including `world/kinds.ts`,
`world/document.ts`, `world/ItemWorld.ts`, `world/ZoneManager.ts`,
`ui/ItemIcons.ts`, `player/HeldTool.ts` and `audio/models/items.ts`. So the
catalogue is in the boot graph and comes down regardless of which zone is
entered. In dev that is 268 separate module requests which keep arriving well
after the first zone is standing, which is what the transition appears to
trigger. In a build they are 1.6 MB of source in the main chunk.

**The worker half is already correct and is the model for this work.**
`registry-lazy.ts` globs the same directory *without* `eager` and
`loadBuilder(name)` pulls one module at a time, so a geometry job only ever
loads what it was asked to build. Only the main thread takes the lot.

**Why `eager` is load-bearing and this is not a one-line fix.** `builderByName`
is synchronous, and the document walk calls `builder.build()` inline every time
the warm pass missed — `kinds.ts:302`, `kinds.ts:350`, `kinds.ts:512`,
`kinds.ts:599`, `kinds.ts:1065`, `document.ts:390`, `document.ts:716`,
`dressing.ts:165`, `placement.ts:179`, `vista-ring.ts:347`. Dropping `eager`
without anything else makes the lookup asynchronous and pushes `await` through
the whole walk, which is the one thing `warmProps` was written to avoid: *"the
walk itself stays synchronous and unchanged"*.

---

## 3. What it is worth

| | |
|---|---|
| Builder files | **268**, 1.6 MB of source |
| Names a zone document mentions | `barn` 11, `store` 9, `riverside` **41**, `forest` 40, `forest-path` 49, `farm` 61, `village` **62** |
| Union of all eighteen zone documents | **181** |
| Never named by any zone | **87** — galleries, recipe fixtures, figure parts, orbs, the debug rooms |

So the largest zone in the project needs under a quarter of the catalogue, and
a third of the catalogue is never in a zone at all. The saving is not a tuning
win; it is the difference between a boot that scales with the project and one
that scales with the zone.

---

## 4. What this stands on

| | |
|---|---|
| `art/registry-lazy.ts` | `loadBuilder(name)`, a per-module promise cache, and `isBuilder`. Already lazy, already correct, already used by the worker. The main thread joins it rather than gaining a third registry |
| `engine/work/pool.ts` | `pool.prime({ builders: byName })` ships the name→key index to the workers today. §6 changes where that index comes from, not that it exists |
| `world/entry.ts` | `EntryKind`, `registerEntryKind`, `entryKind`, `entryKinds`. Seventeen kinds, each already declaring `schema`, `defaults`, `build` and optionally `asks`. §7 adds one more member |
| `world/warmProps.ts` | `planDocument` already walks the layers applying the same `when` tests the build does, and calls `kind.asks`. The gather is that walk with a different question |
| `world/ZoneManager.ts` | `prepare` already awaits `zone.ensureLoaded()` and `warmDocument` before the walk. The gather goes in beside them |
| `art/lines/index.ts` | `LINE_BUILDERS`, six line builders, statically imported and tiny. Not the problem, but they place props by name and §7 needs them to say which |
| `specs/ZONE-LOADING.md` phase D | The precedent, including the reason the galleries stay eager: their fog and floor size are derived from the sum of their builders' radii at definition time |

---

## 5. How the work lands

| Phase | What lands | What to look at |
|---|---|---|
| **1** | The index without the modules (§6). `registry.ts` drops `eager`; `builderByName` stays synchronous over a map that `ensureBuilders` fills; **every current caller calls `ensureAllBuilders()` first, so nothing changes about what downloads** | Nothing, and that is the point. The mechanism moves under a behaviour that is identical, so if a zone breaks it is this and not the gather |
| **2** | The gather (§7). `EntryKind.names`, the line builders' mark defaults, and `ZoneManager.prepare` awaiting `ensureBuilders` on what the document names. The world path stops calling `ensureAllBuilders` | The network tab entering riverside from forest-path: forty-odd builder modules, no livestock |
| **3** | The other callers (§8): items, held tool, item icons, item audio and the portal display name off the full set and onto their own enumerable tables | Picking things up, the inventory grid, the held-tool overlay, and a portal's label |
| **4** | The editor and the galleries left explicitly eager (§8), and the `ensureAllBuilders` fallback made loud in dev | The editor palette still lists all 268 |

Phase 1 is its own, for the reason in its row. 2 is its own. 3 and 4 may go
together.

---

## 6. An index that does not import anything

`builderByName` looks up by the builder's **name**, which is a runtime value
inside the module — that is the reason `registry-lazy.ts` gives for needing an
index handed to it, and the reason `registry.ts` was eager in the first place.

It turns out the index is almost free, because the convention already holds.
Of the **200** names the eighteen zone documents and the item tables between
them reference, every single one resolves to `./builders/<name>.ts` except:

| Exception | Why |
|---|---|
| `voidstone-orb`, `gold-orb`, `pearl-orb`, `quicksilver-orb`, `oceanglass-orb` | Five builders made by one factory in `orbs.ts` |
| `fence`, `wall`, `hedge`, `track`, `jetty` | Not mesh builders at all — line builders in `art/lines/`, a different registry, statically imported and six files |

So:

```
name → ./builders/<name>.ts, unless ALIASES says otherwise
```

`ALIASES` is a short explicit table in `registry-lazy.ts` — today the five orbs
and whatever `figure-head.ts` and `recipe-fixtures.ts` export under names that
are not their file's. It is read by both the main thread and the worker, so
`pool.prime({ builders })` stops shipping a derived index and ships nothing.

**A name that resolves to nothing throws, naming both the name and the file it
looked for.** That is the whole drift protection: a builder added under a
mismatched name fails the first time it is placed, with the fix in the message.
No generated file, no build step, no manifest to keep honest.

`import.meta.glob`'s keys stay the table of what exists — a runtime read, not a
list in the engine — so a content pack naming a builder that ships in
`art/builders/` resolves the same way it does today. Nothing here closes a
union over content names.

### The new shape of `registry.ts`

```ts
/** Fills the map for these names. Awaited before anything looks one up. */
export async function ensureBuilders(names: Iterable<string>): Promise<void>

/** Every builder there is. The editor and the galleries; never the world path. */
export async function ensureAllBuilders(): Promise<void>

/** Synchronous, as it is today. Throws if the name was never ensured. */
export function builderByName(name: string): MeshBuilder | undefined
```

`builders` — the sorted array the editor palette iterates — becomes a function
over whatever has been ensured, so it is only ever complete after
`ensureAllBuilders`.

---

## 7. The gather

Before a zone's walk runs, every builder it can reach must be in hand, because
the walk is synchronous and stays that way.

**`asks` cannot be that list.** Its own contract says so: *"Omitting it warms
the kind for nothing, which is what most kinds want"*, and a warm miss is free
because the walk builds it inline. A gather miss is not free — it is an
exception in the middle of a zone build. `asks` is allowed to be partial; the
gather must be total. They are different questions and they get different
members.

`EntryKind` gains:

```ts
/**
 * Every builder this entry can name, including the kind's own defaults.
 * Complete or absent: a kind that cannot say falls the whole zone back on
 * the full catalogue rather than under-loading it.
 */
names?(entry: E): readonly string[];
```

No `WarmContext` and no seeds — it is a read of the entry, and cheap. The
seventeen kinds implement it, and the ones with defaults are where the care
goes: `kinds.ts:570` reaches for `options.plant ?? 'fruit'` and `kinds.ts:1059`
for `mark.builder ?? 'footbridge'`, neither of which appears in the document.

Two kinds need help from elsewhere:

- **`line`.** A line builder places props at its marks — `hedgeLine` stands
  `mark.builder ?? 'oak'` at a `standard`, `'gate'` at a gate, `'stile'` at a
  stile. `LineBuilder` gains a `props?: readonly string[]` of the names its
  defaults can reach; the mark's own `builder` comes off the entry.
- **`prefab`.** A prefab is a document of entries, so its names are the union of
  its entries' names, recursively. Its *seeds* are what the warm cannot predict;
  its names are plain.

`ZoneManager.prepare` then gathers over the same layers `planDocument` walks,
with the same `when` tests, and awaits `ensureBuilders` before the walk — beside
the `ensureLoaded` and `warmDocument` it already awaits.

---

## 8. The callers that are not a zone

| Caller | What it names | After |
|---|---|---|
| `world/items.ts` `displayOf` | An item's builder, for its name and `nameFor` | The item builder set: `READABLES`, `ACCESSORIES`, `PICKUPS`, `TOOLS`, `CONTAINERS` and the `loot.ts` tables are all static sets already. One `ensureBuilders(ITEM_BUILDERS)` at boot — about forty modules, and they are the things the player carries |
| `world/ItemWorld.ts` `buildPlaced` | A dropped item's builder, or `sack` | Same set |
| `player/HeldTool.ts` | The held item's builder, or `sack` | Same set |
| `ui/ItemIcons.ts` | The icon's builder, or `sack` | Same set |
| `audio/models/items.ts` `toneOfBuilder` | Only `.radius` | Same set. It reads one number and must not be the reason a module loads — if the set is not ensured it returns its `1` default, as it does today for an unknown builder |
| `world/ZoneManager.ts:1057` | `builderByName(adopted.name)?.display` for a portal's label | The adopted prop is in the zone document, so §7's gather already has it |
| `editor/palette.ts`, `inspector.ts`, `thumbnails.ts` | All of them, by design | `await ensureAllBuilders()` when the editor opens. It is a dev surface and `ZONE-LOADING.md` already argues this |
| The galleries | All of theirs, at definition time | **Unchanged and still eager.** Their fog and floor size are derived from the sum of their builders' radii before anything runs, which cannot be lazy without splitting every builder into metadata and geometry. They are debug rooms and will not ship |

---

## 9. The rule that keeps this safe

**An incomplete gather costs the saving, never the zone.**

A kind with no `names`, a line builder with no `props`, a path nobody thought
of: the gather returns "cannot say", and the zone falls back to
`ensureAllBuilders()` — which is exactly today's behaviour. It downloads too
much and it works.

The opposite failure — a gather that quietly under-loads, and a `needBuilder`
that throws in the middle of a walk — is an empty room, and it is the failure
`ZONE-LOADING.md` already warns about for `Zone.root()`. It must not be
possible to reach it by forgetting something.

In dev the fallback logs which kind could not say, once per kind. That is how
the eighteenth kind gets noticed, rather than by a zone breaking a month later.

---

## 10. Ways to get this wrong

- **Making the walk async.** It is synchronous, `warmProps` says why, and this
  spec exists to keep it that way. Everything is loaded *before* the walk; the
  walk itself is untouched.
- **Reusing `asks` as the gather.** Partial by contract. §7.
- **A generated index file.** No build step, no manifest, no parsed source. The
  convention plus a five-line alias table covers all 200 names in the project,
  and an unresolvable name throws with the file it looked for.
- **Under-loading silently.** §9. The fallback is the whole catalogue, not an
  exception.
- **Touching the galleries.** They are eager for a stated reason and they are
  not what this is for.
- **A per-zone list of builders anywhere.** The gather is derived from the
  document every time. A hand-written list per zone would be a closed union
  over content names in the engine, which is the one thing `CONTENT-PACKS.md`
  forbids outright.
- **Reporting the win from the dev network tab alone.** Dev serves every module
  separately; the number that matters is the built main chunk. If it is
  measured at all it is measured there.

---

## 11. Not here

- Splitting builders into metadata and geometry. It would let the galleries go
  lazy too and it is a 268-file change for a debug surface.
- Anything about zone documents, chunks or residency. `ZONE-LOADING.md` owns
  those and they landed.
- The worker's registry. It is already right.
- Eviction of loaded builder modules. A module, once fetched, stays; the win is
  in not fetching it.
- `vite.config.ts`'s eager content globs. `CONTENT-PACKS.md` owns that debt and
  this spec must not deepen it — the gather reads documents that are already
  loaded and adds no glob.

---

## 12. Decisions

| # | Question | My recommendation |
|---|---|---|
| 1 | Convention plus a short alias table, or a generated index? | **Convention.** 200 of 200 names resolve, the exceptions are the five orbs, and a mismatch throws with the filename it wanted |
| 2 | Does `names` go on `EntryKind` beside `asks`, or does `asks` grow a total mode? | **Beside.** They answer different questions and one of them is allowed to be wrong |
| 3 | Do the item builders load at boot as one set, or on demand per item? | **At boot, as one set.** About forty modules, they are what the player carries, and the alternative is an async hop in the middle of a pickup |

---

## 13. Built

Phases 1–4 landed together, on the three recommendations of §12. Four things
the spec did not foresee:

- **Two callers run outside any zone's gather**, and both need a builder before
  a zone exists: `standsOf` measures anything `wades` or `afloat` as a zone is
  *defined*, and `doorwayAnchor` measures a door's building as the portal graph
  is *linked*. `content.ts` names both sets off the raw documents and boot
  ensures them first.
- **An interior's marks name builders the entries do not.** `window`,
  `fireplace`, `ladder` and whatever a mark says, all off `doc.interior`.
  `interiorBuilders` reads them and the zone's warm adds them to the gather.
- **`neighbours` and `horizon` cannot be resolved from the entry alone** — which
  neighbours a ring shows depends on which cell it is in, and `names` is handed
  only the entry. A ring that asks for either takes every cell's icon and the
  whole far layer: two dozen names, always right.
- **`pool.prime` is gone**, rather than shipping nothing. With the name index
  derived from the convention on both sides there was no message left to send,
  so the kind, the `Prime` type and the worker's branch went with it.

Measured on the built main chunk, as §10 requires: 1,306 kB to 1,231 kB, and
the catalogue is now 268 chunks the zone fetches by name. Every builder the
eighteen documents can name resolves under the convention; the alias table is
the five orbs and nothing else.
