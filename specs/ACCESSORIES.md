# Accessories: the things that go in the accessory slots

**Built, under working names.** The six builders, the shared vocabulary, the
tables, the loot rows and the hover box are all in. The stone names and the
metal words are placeholders until the owner chooses them; the leather voice
is still open. All six stand on the bench in Bess's house for looking at.
The inventory has had accessory slots since it was built; this gives the
slots a family to fill them: a ring, a necklace, a bracelet, a brooch, a pair
of earrings and a belt, each one builder, each a seed and a name.

**These are the objects as they are put down, not as they are worn.** Each
builder makes the thing as it sits on a flat surface, kept or shown: a ring
lying on a table, a belt folded the way a shopkeeper folds one for the shelf,
a necklace gathered round its pendant on a counter for sale. Nothing here is
shaped for a body, and nothing here is drawn on one. The player is
first-person and has no body to draw it on, and the figures' finery is a
separate vocabulary that this does not touch.

**The short version.** Six small builders in `src/art/builders/`, all drawing
from one shared vocabulary of metals, stones, leather and chain. Each rolls
its material first so `nameFor` can say what it is before it is built, the
way the lantern does. The engine learns one new table, `ACCESSORIES`, so the
item kind comes off the builder like `tool` does; the loot rows that name
accessories switch from a bare name to a builder; and small pickups gain a
hand-sized hit box at mark time so a ring on a table can be looked at from
arm's length. What a worn accessory does comes later, in its own spec.

Working names throughout. What each thing is called, and what any stone is
called, is the owner's to choose.

---

## What exists

- `world/items.ts` — `ItemKind` is `tool | accessory | stuff`; `kindOf` answers
  from `TOOLS` and otherwise says `stuff`. There is no set that says
  `accessory`, so a document has to say `kind` by hand for one.
- `world/loot.ts` — chests and dressers roll `{ name: 'Gold Ring', accessory:
  true }` and `{ name: 'Silver Necklace', accessory: true }`. No builder, so
  no mesh, no icon of its own, and the generic handling cue.
- `player/Inventory.ts` — five accessory slots, typed: only an `accessory`
  drops into one. Worn items are carried, saved and taken by dialogue.
- `art/fixture.ts` `glassGem` — a display stone on a plinth through the glass
  pass. Far too large and too dear for a ring's head.
- `ui/ItemIcons.ts` frames an item by its bounding box, so a thing two
  centimetres across fills its cell like a lantern does.
- `world/Interaction.ts` — the crosshair reaches 2.2 m. A ring is 2 cm across.

---

## The builders

All six stand on y = 0 at the origin, as put down for keeping or showing, at
real scale. `category: 'objects'`, `solid: false`, `variants: 8`, no sway, no
light, one `finish` call, so each is a pure walk `capture` can take to the
worker. Every roll comes off the seed in a fixed order, and the material is
the first draw, shared with `nameFor`.

| builder | radius | what it is, put down |
|---|---|---|
| `ring` | 0.02 | A band lying flat, plain or with a head |
| `bracelet` | 0.045 | A bangle, a cuff, or a bead string, lying flat |
| `necklace` | 0.05 | The pendant, with the chain gathered loosely round it |
| `brooch` | 0.03 | A disc or an annular brooch, face up, pin under it |
| `earrings` | 0.03 | A pair of drops, side by side |
| `belt` | 0.08 | A strap folded into a flat stack, buckle on top |

**`ring`.** A torus lying flat: `TorusGeometry` is built in the XY plane
with its axis along +Z, and `rotateX(π/2)` takes +Z to −Y, standing that axis
vertical. Major radius 9–11 mm, tube 1.2–2 mm, wider and flatter for a signet.
Six in ten carry a head at bearing 0, +Z from the centre: a bezel (a short
wide cylinder) with a stone in it, or a flat signet table. The head is set so
its top clears the band's top, so the ring rests on the band and the head is
what the eye lands on. Names: `Gold Ring`, `Silver Ring`, `Bronze Ring`,
`Iron Ring`; with a stone, `<Stone> Ring`.

**`bracelet`.** The ring's construction at wrist size: major radius 30–36 mm,
tube 3–5 mm. Three forms by seed: a closed bangle; a cuff, the torus arc
stopped short of a full turn with the gap at −Z; a string of beads, twelve to
twenty small icosahedra on the same circle, alternating two sizes. Names by
metal, or `Bead Bracelet`.

**`necklace`.** The pendant is the object and sits at the origin, face up: a
disc, a drop, or the shared bezel and stone, 15–25 mm across. The chain is
put down round it, not laid out as a loop: one Catmull-Rom curve that wanders
two or three loose turns about the pendant within 40–50 mm of it, with a
per-point wobble so no two lie the same way, and rising by one chain
thickness wherever a later pass crosses an earlier one so no two lengths
share a plane. Drawn as a `TubeGeometry` at 1.5 mm radius, or as thirty to
fifty beads along the same curve. One end of the chain runs into the
pendant's bail so the thing is one connected object. Three in ten have no
pendant and are the gathered chain alone. Names: `<Metal> Necklace`,
`Bead Necklace`, `<Stone> Pendant`.

**`brooch`.** Face up. A disc 30–45 mm across and 4–6 mm thick with a raised
rim ring and a central boss or stone; or an annular brooch, a torus 30–40 mm
across with a pin lying across the opening. Under either, a pin: a rod along
the back, clear of the ground by the rim's height, so the face sits level.
Names by metal, or `<Stone> Brooch`.

**`earrings`.** The one arrangement in the set, and a pair is the object. Two
drops 30 mm apart across x, each a hook (a torus arc, open at the bottom,
lying on its side) and a bead or the shared stone hanging off it. Both from
the same rolls so they match. Names by metal, or `<Stone> Earrings`.

**`belt`.** Folded, not coiled and not a circle. A strap 30–40 mm wide and
3 mm thick folded on itself three or four times into a flat stack: each
layer is a strip along z, 120–160 mm long, stacked one thickness up on the
last, with the two joined at alternate ends by a fold, a half cylinder whose
axis runs along x at the strap's edge and whose radius is the thickness. The
top layer is the buckle end, and the buckle lies on it at +Z: a frame (a
flat torus, or a box with its middle taken out as four bars) and a tongue
pointing +Z. The other end of the strap, the tip, shows at −Z on the bottom
layer, rounded or with a metal tip. Four in ten carry studs, small domes
along the top layer. Leather in `HIDE` shades; the buckle, studs and tip in
the rolled metal. Names: `Leather Belt`, `Studded Belt`, `Buckled Belt`.

---

## The shared vocabulary

One module, working name `src/art/worn.ts`, beside `masonry.ts` and
`building.ts`, holding what the six share so they cannot drift:

- **`rollMetal(rng)`** → `{ name, color, finish }`, the first draw every
  builder makes. Four rows: gold (`PALETTE.GOLD`, `gilt`), silver
  (`PALETTE.CHROME` shaded down, `chrome`), bronze (`PALETTE.BRONZE`,
  `bronze`), iron (`PALETTE.IRON`, no finish lane). Weighted toward the base
  metals, so gold is the one you notice.
- **`rollStone(rng)`** → `{ name, color, finish, cut }`. Opaque, through the
  finish lanes the kit already has rather than the glass pass: `quartz`,
  `iridescent`, `labradorite`, `moonsheen`, `sunstone`, and `nacreous` for a
  pearl. `cut` is faceted or cabochon.
- **`stone(size, cut)`** — the head. Faceted: a crown (an open tapered
  cylinder, table up) over a shallow pavilion (a cone, apex down), eight sides,
  merged as one hull; cabochon: half an icosahedron, smooth. Built with its
  girdle at y = 0 and its table at +Y, so the caller sets it in a bezel.
- **`bezel(radius, height)`** — the cup a stone sits in, a short wide
  cylinder with a lip.
- **`chain(curve, radius)`** and **`beads(curve, count, sizes)`** — the two
  ways along a curve.
- **`buckle(width)`** — frame and tongue, lying flat, tongue toward +Z.

Every dimension in metres, every colour a `shade` of a palette entry. No
weathering on any of it unless asked for by name.

---

## The engine

Small, and all of it tables but one:

- **`items.ts`** gains `ACCESSORIES`, a set of the six names, and `kindOf`
  answers `accessory` for them before falling through to `stuff`. The six join
  `PICKUPS`.
- **`underfoot.ts`** gets six `null` rows: nothing here is stood on.
- **`inhand.ts`** gets six rows: `ring`, `bracelet`, `brooch` and `earrings`
  as `metal-ring`; `necklace` and `belt` as `null`, because a row is per
  builder and a bead string or a strap says nothing a metal voice should.
- **`loot.ts`** replaces the two builderless rows with `{ builder: 'ring' }`
  and `{ builder: 'necklace' }` at the same weights, and the dresser gains
  `{ builder: 'brooch' }` and `{ builder: 'earrings' }` at the same rarity.
  The name comes from `nameFor`, the kind from `kindOf`.
- **The hit box.** `ItemWorld.mark` measures each pickup's bounds, and for
  one under a hand's breadth across hangs an invisible box grown to that
  breadth over it, as a child flagged `noCollide` and left out of the cover
  stamp, the way an adopted portal end grows its box so a crosshair near a
  ladder rail still lands on it. Hung at mark time and never by the builder,
  so the icon renderer, which builds from the builder, frames the ring and
  not the box.

Nothing changes in the inventory, the save or the editor. An item document
naming one of the six is an accessory without saying so:

```
{ "id": "hobs-ring", "name": "Hob's Ring", "builder": "ring", "seed": 7103, "quest": "..." }
```

Placed in a zone, each is an entry like any prop, set `on` a table or a
shelf by the person laying out the room.

---

## Steps

1. **The vocabulary and the ring.** `worn.ts`, `ring`, the four table rows,
   the loot swap for the ring. *Done when* a chest rolls a Gold Ring that
   drops on a table as a ring, icons as one, and drags into an accessory
   slot.
2. **The hit box.** The ring on the table is hovered from reach without
   hunting for it.
3. **The other five**, one file each, and the remaining loot rows.

*Done when* all six stand in the gallery in eight variants each, roll from
chests and dressers under their own names, drop and land as themselves, and
fill an accessory slot with an icon.

---

## Ruled out, and why

- **Worn shapes.** A belt as a circle, a necklace as an open loop: those are
  the things on a body, and nothing here is on a body. Only the shape a
  thing takes on a shelf, a counter or a table.
- **Stones through the glass pass.** `glassGem` composites a hull in draw
  order in a second pass. A ring's head is under a centimetre across and
  there could be a dozen on one table; an opaque stone with a finish lane
  reads as a stone at that size and costs one merge.
- **Real chain links.** A necklace of a hundred small tori is a hundred
  small tori on every table that has one. A tube reads as chain at reach.
- **A builder per metal.** `gold-ring`, `silver-ring` and so on, the way the
  orbs go. The orbs exist to carry the finish system; a ring is one thing
  whose metal is a roll, and one name in a document with a seed is what the
  loot table and the item documents want.
- **Scaling up so a ring can be seen.** A ring the size of a bracelet is a
  bracelet. The hit box answers the hover; the size is the size.
- **Effects from wearing.** Later, in their own spec. Nothing here reads a
  slot.

---

## To settle before building

1. **The names.** Six builder names and the metal and stone words `nameFor`
   uses. The stone names in particular are fiction, and the finish lane a
   stone uses need not be what it is called.
2. **A leather handling voice.** `footsteps.ts` has no surface for it, so the
   belt keeps the generic cue. A new surface is a row there if it is wanted.
