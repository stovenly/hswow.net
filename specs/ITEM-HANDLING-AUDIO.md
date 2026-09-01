# Item handling sounds by material — spec

**Signed off, building.** Pickup and placement noises stop being one generic cue
and derive from the item's material the way footsteps derive from the ground's
— a lantern set down clangs, a rake knocks like wood, a book lands with a soft
paper slap. Builderless items (Gold Ring, junk loot) keep the generic cues
exactly as they are.

**The short version.** Handling strikes the footstep surfaces themselves. The
footstep's per-contact synthesis (impact, crush, modal ring, grit, splash) is
extracted as `strikeSurface`/`surfaceChain` in `footsteps.ts`, shared verbatim
by feet and hands; a second declaration table beside `underfoot.ts` answers
*what is it made of in the hand* in `SurfaceName`s, so a candle set down rings
the same metal a boot finds. One new surface (`paper`) covers the readables.
No samples, no per-item DSP branches.

---

## What exists

- `art/underfoot.ts` — `MATERIALS`: builder → `SurfaceName | null`, declared
  not measured, grouped by material so a wrong claim is visible. Every pickup
  is `null` there, correctly: you cannot stand on a broom. That is why this
  table cannot be reused directly and a sibling is needed.
- `audio/models/footsteps.ts` — `SURFACES` and the per-contact synthesis:
  impact, crush, modal ring, PhISEM grit and splash, with cached resonator
  chains per surface. `strikeSurface` and `surfaceChain` are the extracted,
  shared form; `Footsteps` delegates to them.
- `audio/models/items.ts` — `ItemAudio`: the hand gestures, striking surfaces
  through its own persistent output and chain cache.
- Every call site that makes a handling noise already has the `Item` in reach
  (drag handlers, `interceptInteract`, `ItemWorld.pickup`).

## The change

**The table.** `art/inhand.ts`: `HANDLING`, builder → `SurfaceName | null`,
one line each, grouped by material like `underfoot.ts`. Only names in
`PICKUPS` appear. `null` or absent means the generic cue.

Assignments, every one yours to move:

- **metal** — lantern and pail as `metal-hollow-small`, candle (the holder is
  what lands) as `metal-ring`
- **wood** — broom, rake, pitchfork, pinecone, scroll-case
- **paper** — every book, clasped-tome, ledger, pamphlet, folded-letter,
  loose-note, roller-scroll

**The paper voice.** One new row in `SURFACES`, built by the five questions in
`models/CLAUDE.md`: a soft slap, a slight crush of pages, a rustle of grit, no
modes — paper does not ring.

**Size rides the builder's radius.** The contact's `tone` scales inversely
with the stated hand-size radius, so a candle taps brighter than a pail — the
same one-number derivation the held-tool scale already uses.

**The gestures.**

- **Placement** (drop, and a drag re-landing an item): the landing's
  two-contact shape on the item's surface — a strike and a settle.
- **Pickup**: one light, stretched contact — more draw than strike. It
  replaces the rising two-tick outright for anything with a surface; the
  ticks survive only as the builderless fallback.
- **Equip / unequip**: material-voiced too — a firmer seat of the same voice
  going in, a softer brush of it coming out. Take-all stays abstract.

**Wiring.** `ItemAudio.pickup(item?)` and `drop(item?)`; call sites pass what
they hold. No engine changes: same steps bus, same non-spatialised placement.

## What this is not

- No sampling of meshes or colours — the material is declared, for
  `underfoot.ts`'s stated reason: a colour match is a coin flip.
- No per-item synthesis code. A new item is a table line; a new material is a
  `SURFACES` row.

## Build order

One phase. *Done when* a pail dropped on the floor clangs and picked up gives
a small metal touch under the rise, a rake knocks wood, a loose-note lands
soft, and a Gold Ring still sounds exactly as it does today.
