# The inventory grid and item icons

**Built, all phases.** Extends `INVENTORY.md`: the list-of-words panels become
Morrowind-style icon grids in two floating windows. Performance is the design
constraint — the inventory must never hitch, so every icon is rendered off a
budgeted queue, never synchronously, and a cell is fully usable before its
icon exists.

---

## 1. Icons are derived from the seed

An item's icon is a render of its own builder at its own seed — one more view
of the name-and-number, like everything else in the kit. The machinery is the
editor palette's (`src/editor/thumbnails.ts`), rebuilt as a shared service:

**`src/ui/ItemIcons.ts`** — a queue and two caches.

- **Key**: `v{ICON_VERSION}:{builder}:{seed}`. The version is a hand-bumped
  constant, because builders evolve and a cached icon of last month's lantern
  is a lie. Builderless stock (junk, ring, necklace) renders the placeholder
  sack at its derived seed, so its icon matches its dropped mesh.
- **Render**: the game's own renderer into a small target (48 px), transparent
  clear, three-quarter orthographic framing by bounding box, the thumbnail
  light rig, lights stripped from the mesh. Upscaled nearest in CSS, so the
  icons share the world's chunk.
- **Budget**: N builds per frame off a queue, adaptive — more per frame while
  no panel is open (warming, and a fade is exactly when to warm), one per
  frame while the grid is up. The readback is a GPU sync and the build is a
  mesh; neither ever happens in a burst, whatever the pack size.
- **Contract with the grid**: `request(item, onDone)` returns instantly. A
  cell that has no icon yet shows the loading placeholder and is completely
  functional — drag, drop, hover tip — because the drag carries the item, not
  the picture. The icon swaps in whenever it lands.

### Warming, so placeholders are rarely seen

Icons render at the moment items enter play, not when the grid opens:

- on pickup and on equip (one item — invisible),
- when a container's contents materialise (open or loot roll — a handful),
- on save load, queued during the `hardReset` fade (the one true mass case).

A long session accumulates its pack one item at a time, so the grid is warm by
construction; the placeholder is the cold-load path, not the normal one.

## 2. Icons persist between sessions

**IndexedDB**, not localStorage — blobs without base64 bloat, async reads that
never block a frame, and a quota that does not compete with the save slots.

- Database `hswow-icons`, one store, the same versioned key.
- Read-through: memory → IndexedDB → render-and-write-back. Writes are
  fire-and-forget; a failure (private mode, quota) degrades silently to the
  session cache.
- A version bump orphans old keys; they are pruned lazily, not migrated.

A returning player who loads a save on the same browser gets a fully iconed
grid with zero renders.

## 3. Two floating windows

The player inventory and the container are the same window component, told
apart by what they hold.

- **Player inventory: left side** by default. Header bar carrying the title;
  the equipment block (tool slot, ten accessory slots, as icon cells) pinned
  under it; the grid below, scrolling vertically. The equipment block sets the
  window's minimum width and centres itself when the window goes wider.
- **Container: right side** by default. Header carries the container's display
  name and a **take all** button; the grid below.
- **Drag by the header**, move anywhere on screen. **Resize by any edge or
  corner** (8 px hit zones), clamped to a minimum that keeps the equipment
  block whole and a maximum of the viewport.
- **Position and size are remembered** per window in localStorage
  (`hswow:ui:*`) — a machine preference with the options' lifetime, not part
  of any save. Restored geometry is clamped into the current viewport, so a
  smaller window cannot strand a panel off screen.

## 4. The grid

- Cells are a fixed size (~3 rem), always: resizing the window changes how
  many columns and rows fit, never how big a cell is.
- A cell is an icon with the item's name on the existing hover tip — words
  leave the panel and move to the tip. Empty state keeps its quiet note.
- Drag semantics are unchanged from the list era: sources and targets, typed
  slots, world drops, world grabs, right-click cancel. The drag ghost becomes
  the icon (name beneath it while over the world, for the drop reading).
- Equipment cells render the equipped item's icon; the empty tool cell says
  "tool", empty accessory cells keep their numbers.

## 5. Performance rules

- No synchronous icon render, ever; the queue is the only path to the GPU.
- No per-frame DOM work while idle: grid re-renders on inventory change, icon
  arrival, and window resize — not per frame.
- Window drag and resize write geometry directly; the grid reflows via CSS
  (`grid-template-columns` from the cell size), no JS layout pass.
- Icon `<img>` elements reuse their data URLs from cache; a reopened window
  allocates no new image data.

## 6. Every readable reads

Rides this batch though it has nothing to do with the grid: a readable-class
item — every book, tome, ledger, pamphlet, letter, note, scroll and scroll
case — always opens the reading screen on E, bound note or not. An unbound one
shows the object's name over a page that says it is empty (*placeholder
wording, yours*); a bound one shows its note as now. Either way the player
reads before pocketing — E again takes, Escape leaves it. Tools and the
pinecone keep the instant pickup.

Mechanically: a `READABLES` subset beside `PICKUPS` in `items.ts`, and the
probe hands back a read focus with a stand-in empty note where no text is
bound. Nothing changes for the taking path, which already runs through the
reading screen.

## 7. The pause stack

The pause screen reorders: the controls panel takes the top anchor, and the
three buttons stand in one vertical stack beneath it — **Save**, **Load**,
**Options**, in that order, all in the shared pause-button dress. Same
visibility rules as today: shown while not playing, hidden under every other
screen. The slot picker is unchanged.

## 8. Build order

**P1 — Every readable reads.** The `READABLES` table and the empty-page focus.
*Done when* an unbound book opens onto its empty page, E-again pockets it, and
a rake is still taken in one press.

**P2 — Icon service.** `ItemIcons`, session cache, budgeted queue, adaptive
budget, placeholder protocol.
*Done when* a 50-item pack opens instantly with placeholders, icons fill in at
the budget, and the frame time readout shows no spike while they do.

**P3 — The grid.** Both panels become grids with icon cells; equipment slots
take icons; the drag ghost takes the icon; hover tips carry the names.
*Done when* every drag interaction from the list era — slots, container, world
drop, world grab, world move, cancel — works cell-to-cell.

**P4 — Floating windows and the pause stack.** The shared window component:
header drag, edge and corner resize, clamps, left/right defaults, localStorage
geometry. The pause screen reorders per §7.
*Done when* both windows can be placed and sized freely, survive a reload,
clamp back on screen when the viewport shrinks, and the pause screen reads
controls, then Save / Load / Options.

**P5 — Warming.** Acquisition, container-materialise and save-load triggers.
*Done when* ordinary play never shows a placeholder, and a loaded 50-item save
finishes warming behind or just after the fade.

**P6 — Persistence.** The IndexedDB read-through layer and version pruning.
*Done when* reloading and re-loading the same save shows a fully iconed grid
with the render queue never engaged, and a bumped `ICON_VERSION` quietly
re-renders everything once.

