# Content packs: DLC the game finds on disk

**Proposed.** Nothing here is built. What this document is for is the decision
at the top of it, which is cheap to keep now and expensive to recover later.
Everything under it is how the decision plays out, and can be built in pieces
when the first pack is wanted.

Working names throughout. "Pack" is the mechanism; what a pack is called on a
store page is the owner's to choose.

---

## The decision

**Content is data the game fetches at boot from an ordered list of packs. It
is never imported as a module, and a pack never carries code.**

Today the opposite is true: `vite.config.ts` globs every zone, person, trait,
quest, item, `world.json` and sidecar into the bundle with an eager import, so
content is code and a shipped build knows exactly one world. A pack a player
downloads after that build cannot be seen by it. That is the one structural
thing standing between this engine and DLC, and it is the thing this document
exists to stop being reintroduced.

The corollaries, each of which is a rule from now on:

- **Every content document is keyed by an id and merged by id.** Zones, people,
  traits, quests, items, portals, horizon props. Nothing is keyed by file name
  or by position in a list. This is already true of every family the engine
  holds; it has to stay true of every family added.
- **Builders are engine.** A new tool, creature or building the DLC introduces
  is a builder in `src/art/builders/`, shipped to everyone in the base game as
  a lazy chunk, dormant until a document names it. The pack carries the
  documents that name it. Nothing executable ever comes from a pack, which is
  also what keeps the desktop sandbox and the content security policy honest.
- **A pack's reach is additive or a whole-document override.** A pack adds
  documents, replaces a base document whole, or contributes entries to an
  existing zone through a layer. It never patches a field inside another
  pack's document.
- **Closed unions of content names are not allowed in the engine.** A pack
  may bring a zone family, a weather kind or a ground material the base game
  has no row for; the engine reads those tables from the loaded content.
  `ZoneGroup` is a string union today and is the one known violation.

---

## What a pack is

A folder. The base project is pack zero and has the same shape as every pack
that follows it, which is what makes the loader one code path:

```
<pack>/
  pack.json
  zones/        *.json, plus *.r32 and *.u8 sidecars
  people/
  traits/
  quests/
  items/
  world.json
```

`pack.json`:

```
id          stable, never renamed once shipped
version     for the save file and the slot picker, nothing else
requires    pack ids this one needs present, in no order
overrides   base ids this pack replaces whole, by family
```

`project.json` stays the base game's manifest and gains nothing. Its `groups`
list becomes a union over every loaded pack's declared groups rather than a
fixed list.

---

## Load order and the merge

The platform hands the loader an ordered list of pack roots. The base project
is first; packs follow in the order the platform reports them, which on the
desktop is a `load-order` file beside the packs directory that lists ids, and
on the web is the order the build wrote. A pack whose `requires` is not
satisfied by the packs before it is skipped with a console error, not moved.

The merge is a fold over that list, one family at a time:

- A document whose id nobody earlier used is added.
- A document whose id an earlier pack used **replaces it whole**, provided the
  later pack declared that id under `overrides`. Undeclared, it is a boot error
  naming both packs. This is the guard Bethesda gets from form-id prefixes
  without needing them, and it is what stops two packs written apart from
  silently clobbering each other.
- `world.json` merges the same way at the level of its rows: portals by id,
  horizon props by id. A new zone reached from the village is one zone document
  and one portal whose end names `village`.
- Sidecar rasters belong to the pack whose zone names them, and are fetched
  from that pack's root.

`src/app/content.ts` keeps its shape. `interpret` takes the folded bundle
instead of one, and `holdCast`, `holdItems`, `holdAtlas` and `zoneFromDocument`
run once over the result exactly as they do now. The interpreted world is still
one object the editor and the world share.

---

## Adding to a zone that already exists

The common DLC move is a new person standing in the village, or a new item on a
table in the store. Whole-document override is the wrong tool for it: a second
pack replacing `village.json` would clobber whatever the first pack put there.

Zone documents already carry named layers. A pack may therefore ship a zone
document that names an existing zone under `extends` and carries only layers:

```
{ "id": "village", "extends": true, "layers": [ { "name": "harbour-folk", "entries": [ ... ] } ] }
```

The merge appends those layers to the base zone's own. Two packs can both add a
person to the village and neither knows the other exists. Entry ids inside a
contributed layer are prefixed with the pack id at merge time, so `on`, portal
ends and the override layer keep pointing at the right thing.

An extending document may carry nothing but `id`, `extends` and `layers`. Any
other field on it is a boot error: changing a zone's terrain, place, air or
soundscape is an override, and has to say so.

---

## The platform seam

The `platform` module the Electron spec describes gains one member:

```
content     packs(): PackRoot[]          ordered
            read(root, path): Promise<Response>
```

- **Web.** The build writes a `packs.json` listing the pack roots it carries,
  base first, and `read` is `fetch` against the site. The web build is the base
  game plus whichever packs the build was told to bake in, so nothing about
  the deployed site changes for a player who has none.
- **Desktop.** The main process lists the packs directory under the install
  folder, reads each `pack.json`, applies the load-order file, and serves the
  files over the same privileged scheme as the game. The preload exposes the
  list through the bridge.

Nothing else in the engine asks where content came from.

---

## Steam

A Steam DLC is a depot that installs into the game's own install folder, and
Steam only downloads it for an account that owns it. So **installed means the
folder is present**, and the desktop platform's directory listing is the whole
ownership check. Steamworks exposes an is-DLC-installed call from the main
process if a belt-and-braces check is ever wanted; it is not needed for the
game to work, and it is not called from the renderer.

A pack's depot layout is the pack folder, nothing else. Uninstalling the DLC
removes the folder, and the next boot loads without it.

---

## Saves

Two additions to `SaveData`, both optional so an older save still opens:

- **The pack list at save time**, ids and versions. The slot picker shows a
  save made with a pack that is now absent, and says which.
- **A missing zone falls back**, extending the relocation path that already
  exists for renamed zones: a save standing in a zone no loaded pack provides
  opens at the project's start with `relocated` set and the player told why.

Quest stages, flags and chart rasters keyed to a pack's ids stay in the save
untouched while the pack is absent. The journal and the map ask by id and get
nothing back, and the pack's return finds them where they were.

---

## The editor

The editor edits the same document objects the world reads, and writes them
back through the thirteen calls in `editor/api.ts`. With packs, a document has
a home: the pack it came from. The editor gains one selector, which pack new
documents are written into, and every save goes to the pack that owns the
document being saved. An extending zone document is edited as its own file
even though it appears in the world as part of the base zone.

---

## Steps

Each lands on its own. Only the first is owed before the Electron build; the
rest arrive with the first pack.

1. **Content is fetched.** The virtual project module stops globbing content.
   The build copies each pack's folder to the output and writes `packs.json`;
   the loader fetches from it through the platform. One pack, the base. No
   behaviour change.
2. **The fold.** `pack.json`, `requires`, `overrides`, the merge, the boot
   errors. Still one pack in the repo; a second pack of test content under
   `projects/<id>/packs/` proves the fold and is deleted.
3. **Extending zones.** `extends`, layer append, entry id prefixing.
4. **Groups off the content.** `ZoneGroup` becomes a string; the ordered list
   comes from the packs.
5. **Saves** carry the pack list and fall back on a missing zone.
6. **The desktop listing** and the load-order file, in the Electron wrapper.
7. **The editor's pack selector.**

*Done when* a second pack dropped into the packs directory of an installed
desktop build adds a zone, a person in the village and an item, with no
rebuild, and removing it again leaves a save that opens.

---

## Ruled out, and why

- **Code in packs.** A pack that ships JavaScript is a pack that runs in the
  player's sandbox with the game's privileges, and it makes the engine's
  update story a lie: a builder bug would be fixed in every pack separately.
  Builders are engine.
- **Field-level patches.** A pack that sets one property of another pack's
  document has to know that document's shape forever. Override whole, or
  extend through a layer.
- **File-name keys.** A document is its `id`. Two packs may well ship a
  `village.json` each, and one of them is an override, and the manifest says
  so.
- **Merging on the build.** A DLC that needs a rebuild of the base game is a
  patch, not a DLC. The merge happens at boot, from what is on disk.

---

## To settle before building

1. **The name.** Pack, module, expansion, something of the fiction's.
2. **Where the packs directory sits** in the install folder, and whether the
   base game's content is a pack folder beside the others or stays under the
   renderer directory as today.
3. **Load order on the web.** Fixed by the build, or a query flag for testing.
4. **The editor's pack selector**, or whether the editor only ever edits the
   base pack and packs are authored by hand.
5. **Whether `overrides` is per family or one flat list of ids.**
