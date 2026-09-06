# Items, inventory, containers, and the save slots

**Built, all eight phases.** Checked against the code as it stands; if a fact
stops being true, edit the line.

---

## 1. Inventory

`src/player/Inventory.ts`: a flat list of items, no capacity limit yet. An
`Item` is `{ name, kind, builder?, seed?, state? }` — the name is what the
player reads; `kind` is `tool | accessory | stuff`; the builder and seed are
how the world mesh comes back identical when the item is dropped. Items with
no builder stand on a small sack when dropped, tooltip carrying the item's
name.

**`state` is the open bag for everything else a thing knows about itself.**
Plain JSON, so it rides through the pack, containers, drops and saves
untouched. What goes in and out of the world is table-driven: a small registry
of state keys, each with a capture (read it off the built mesh at pickup) and
a restore (write it back onto the rebuilt mesh at drop). One row exists today
— `text`, a readable's note binding — so a pocketed book keeps its prose and a
dropped one is readable again where it lands. A future kind of state (a lit
flame, a fill level, an inscription) is one new row, and unknown keys already
round-trip through saves without code knowing them.

The UI (`src/ui/Inventory.ts`) opens on **Tab**, releases the mouse exactly the
way the reading screen does, and takes it back on close (Tab or Escape). The
centre of the screen stays clear: the pack and the equipment sit in one panel
on the right, an opened container in a panel on the left. Same visual register
as the options panel — flat dark ground, one hard pixel of border.

## 2. Equipment

One primary tool slot and ten accessory slots at the top of the right panel;
the pack list under them. Items move by dragging; dropping on an occupied slot
swaps, and the displaced item goes back to the pack.

**Slots are typed.** Only a `tool` fits the tool slot; only an `accessory`
fits an accessory slot; a refused drop bounces back with a note. Tools, by
builder: broom, rake, pitchfork, pail, lantern. Two starter accessories exist
as builderless items — **Gold Ring** and **Silver Necklace** — obtainable as
uncommon dresser and chest rolls, loot being the only source of anything yet.

## 3. The held tool

`src/player/HeldTool.ts` draws whatever is in the tool slot at the camera's
right hand, scaled toward hand size from the builder's stated `radius`. Left
click while captured swings it — a consumed edge on `Input` (`takeAttack`),
the `takeInteract` pattern, only ever firing while the mouse is already
captured so the capture click itself never swings. The swing is a ~0.3 s arc
and does nothing to the world yet. No real light is cast from a held flame.

## 4. What is an item

A per-species table, like `flex.ts` and `underfoot.ts`: `src/world/items.ts`
lists which builder names make one complete hand-sized thing (`PICKUPS`),
which of those are tools (`TOOLS`), and which builders make something stock is
kept in (`CONTAINERS`).

**Pickable:** lantern, candle, broom, rake, pitchfork, pail, pinecone, and
every individual readable — leather/cloth/vellum/gilt/board/battered book,
clasped-tome, ledger, pamphlet, folded-letter, loose-note, roller-scroll,
scroll-case. No gallery fixtures, no piles, no furniture.

Every built prop mesh already carries its builder name (`finishMesh` stamps
`mesh.name`), and two one-line changes stamp `userData.seed` at the two places
props are built (`kinds.ts` prop entries, `scatterProps`). When a zone is
dressed, a new `ZoneManager.onDressed` hook hands the built root to the item
system, which walks it once and marks matching meshes. No per-zone
declarations, and the code-built zones get it for free.

## 5. Tooltips and the interact key

The crosshair probe resolves, in order: door → readable → container → item.
Items and containers show their name as a one-line tooltip. E picks an item up
or opens a container. A readable still opens on E, and **E again while the
page is open takes the book**, plot-bearing notes included (Escape just
closes). A taken note-bound book carries its binding in `state.text` (§1);
reading from the pack is future work, but nothing is lost on the way there.

## 6. Taken means gone

Every marked mesh gets a **key**, stable across rebuilds because builds are
seeded: zone id + entry id (or mesh name) + world position to the centimetre.
Picking up removes the mesh from the live zone immediately and records the
key; rebuilt cells re-apply the record. Taking an originally solid world item
(lantern, pail) only invalidates the zone's collider cache — a full reindex on
the spot is a hitch the hand feels, so the stale triangles cost a candle-shaped
bump underfoot until the next entry rebuilds behind the fade. Any light change
re-pads the census and re-collects the flame activity
(`ZoneManager.rebalanceLights`), so shaders hold and flames keep flickering.

## 7. Dropping and stacking

Drag an item out of any panel and release it over the world: a ray from the
camera through the release point, hit against the collider, settled straight
down from just short of the hit so a drop against a wall lands on the floor in
front of it. Refused past ~4.5 m or with no floor within reach — the item goes
back where it came from, with a quiet note.

**Dropped items are non-solid**, so they never touch the collider. Because of
that, the drop ray also tests the zone's item meshes directly: releasing onto
an item lands the drop naively on the **top of that item's bounding box** at
the ray's x/z — books stack on books, anything stacks on anything. Dropped
flames keep their lights: every runtime light add or remove re-pads the zone's
census (`ZoneManager.rebalanceLights`), so the shared shader tiers hold except
when a zone crosses a tier boundary, which is a one-time compile. The held
tool still carries no light.

## 8. Affected records and the save slots

`src/world/save.ts` holds the world seed and the `WorldDelta`: removed keys,
placed items (id, zone, item, position, yaw), and the contents of every
container the player has touched. Every zone build applies the delta after
marking — leave and return, the cell rebuilds from the recipe and is then
corrected. Live changes edit the built zone directly.

**Every page load is a new world**: fresh seed, empty delta, nothing loaded
unless asked. **Save and load live on the pause screen** — the not-playing
stack that comes up on Escape or alt-tab, stacked under the controls panel as
Save / Load / Options: the first two each open a slot picker. Three slots, each
row showing the saved zone and when it was written, or "empty"; load offers
only occupied slots. A save carries seed, inventory,
equipment, delta, and where the player stood. Loading releases every built
zone under one fade (a new `ZoneManager.hardReset`) and re-enters the saved
zone, so everything rebuilds against the loaded records. Title-screen
new/continue flow is future work.

## 9. Containers

Crate, barrel, chest, dresser, sack, crate-stack ("Crate Pile"), barrel-stack
("Barrel Pile"). One container per prop, no sub-containers. Washtub, trough,
cistern, hopper, beds, carts and buildings are not containers.

Untouched contents are rolled deterministically from
`hash(worldSeed, containerKey)` over a loot table per container kind — same
world, same crate, same junk, every visit. The first change materialises the
list into the delta, which is authoritative from then on. E opens the
container beside the inventory; drag both ways, drop to the ground from
either. Container and inventory are unlimited for now.

**Loot is placeholder junk, no treasure** — random mundane crap you would find
in that thing in that place, names throwaway and yours to rename: Yarn Spool,
Fork, Old Rag, Leather Boot, Wooden Spoon, Clay Cup, Empty Bottle, Candle
Stub, Hemp Twine, Iron Nails, Bent Horseshoe, Flint, Sewing Needle, Horn
Buttons, Apple, Handful Of Grain, Dried Herbs, Fish Hooks. Real-builder rolls
stay mundane too: a candle in a crate, letters and notes and the odd worn book
in chests and dressers; Gold Ring and Silver Necklace appear rarely there as
the two starter accessories. Rolls of 1–3 for a crate or barrel, 2–4 for a
chest, 1–4 for a dresser, 1–2 for a sack, 2–5 for a pile.

## Build order

Eight phases, each shippable and checkable in the running game before the next
starts.

**P1 — Tables and marking.** `items.ts` (PICKUPS, TOOLS, CONTAINERS), the seed
stamps, `onDressed`, the marking walk, tooltip integration in the probe.
*Done when* every pickable and container in the village and interiors names
itself over the crosshair, and nothing else does.

**P2 — Inventory and the Tab screen.** Item type with `kind` and `state`, the
model, typed slots, the two panels, drag between pack and slots.
*Done when* Tab opens and closes cleanly against the pointer lock, and the
empty pack, tool slot and ten accessory slots read right.

**P3 — Pickup.** E takes an item; E-again takes an open readable, capturing
`state.text`; delta records the key; light-census pads; collider reindex for
solid items; targets refresh.
*Done when* a lantern, a rake and a bound book can be taken, appear in the
pack, and the room's lighting and shaders do not hitch or change.

**P4 — Held tool.** `HeldTool`, `takeAttack`, the swing.
*Done when* an equipped rake sits in the right hand, swings on left click, and
the capture click never swings.

**P5 — Dropping and stacking.** The drop ray, floor settle, range refusal,
non-solid rebuilds with state restored, the item-mesh stack test, placeholder
sack for builderless items.
*Done when* a dropped book lands, reads again where it lies, stacks on another
book, and a too-far drop bounces back with the note.

**P6 — Persistence across cells.** Delta applied on every build; eviction and
re-entry honour removals and placements.
*Done when* an item carried out of the cottage and dropped in the village is
still gone from one and lying in the other after walking far enough to force
both to rebuild.

**P7 — Containers.** Loot tables, deterministic rolls, the container panel,
materialise-on-change, drops from either list.
*Done when* the same crate holds the same junk on every visit until something
is taken, and whatever is put in stays in.

**P8 — Save slots.** `WorldDelta` serialization, the pause-screen save and
load buttons, the slot picker, `hardReset`.
*Done when* save, reload the page (new world), load, and the world comes back
— seed, pack, equipment, taken items, drops and touched containers all as
left.

## Wiring notes

- The item systems install from the game page only (`main.ts`), through
  generic hooks on the boot (`onFrame`, `interceptInteract`) and the zone
  manager (`onDressed`). **The editor is untouched**; its Tab stays the fly
  toggle.
- Pause-screen save/load extends the existing not-playing stack in
  `index.html`/`styles.css` plus a small slot-picker panel in `src/ui/`.
