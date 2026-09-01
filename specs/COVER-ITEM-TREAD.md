# Cover parts around placed items — spec

**Optional, not built.** Dropped items vanish into groundcover; this makes the
blades part around them the way they already part around the player, so a fork
dropped in a meadow stays findable.

**The short version.** The player tread is one uniform point read by the two
cover vertex shaders. This generalises it to a small fixed array of tread
points fed from the placed-item list, with a shorten term added so ordinary
short grass opens a visible dimple instead of only leaning. No buffers change,
nothing rebuilds, and pickup un-parts for free because the array just reads
what is placed.

---

## What exists

- `coverUniforms.coverPlayer` (`art/cover.ts`): the player's feet, written
  every frame by `updateCover`.
- Both the blade material and the tuft material bend tips away from that point
  inside ~0.85 m, faded by vertical distance so a floor above does not part
  the lawn below.
- The push is gated to tall blades — `smoothstep(0.4, 0.6, len)` — so 0.3 m
  village grass does not part at all. That gate is right for the player and
  wrong for items: short grass is exactly what a small drop is lost in.
- `ItemWorld` owns every placed item and its position, and already reacts to
  drop, pickup and zone build.

## The change

**Uniforms.** `coverTreads`: a fixed array of 16 `vec4` — xyz the item's rest
point, w a radius — plus `coverTreadCount`. Zero radius means an empty entry.

**Shaders.** In both vertex patches, after the player tread: loop the array,
and for each point in range push the tip outward *and* multiply `len` down
toward a floor (never to zero — flattened, not mown). No tall gate. Same
vertical fade as the player term. The loop is over 16 vec4s per vertex, which
is noise next to the work the shader already does.

**CPU.** When the placed list changes — drop, pickup, entry rebuild, save
load — refill the array with the placed items nearest the player, nearest
first. More than 16 nearby and the farthest stop parting, which reads fine:
past a dozen drops in one spot the pile is its own landmark. No per-frame
work; the array only rewrites on change and on zone entry.

**Radius** comes from the item's builder `radius` plus a margin, clamped to a
sane band (~0.25–0.6 m), so a pail opens more grass than a note.

## What this is not

- Not a clearing: no instance buffers are edited, no blades are removed, and
  nothing has to be remembered across rebuilds or restored on pickup.
- Not a placement layer: nothing samples terrain or beds items in; the grass
  reacts to the item, the item is wherever the drop put it.

## Build order

One phase. *Done when* an item dropped in tall meadow parts a pocket around
itself, one dropped in short village grass sits in a visible dimple, picking
it up closes the grass, and both survive walking away and back through an
entry rebuild.
