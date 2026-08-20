# src/art/builders

One file, one builder, one object. Everything here is picked up automatically by
`registry.ts`, so adding a mesh type is dropping a file in.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## The header line

One line at the top of the file naming the object and its origin or axis
convention, plus any constraint a reader has to know before touching it:

```
// Window: opening, frame, and the sheared daylight shaft. Wall at z = 0, proud
// toward +Z, floor at y = 0.
```

Not an essay. What the object is in the world, what a previous version did, and
why a number is the number it is do not go here — the first is lore, the second
belongs in the commit message, and the third belongs nowhere.

## A builder builds the object. Nothing else

No debris, no scatter, no ground marks, no spill. Nothing that decides what the
ground round the object is like: this world is hand placed, and a builder that
dresses a scene has placed art nobody asked for on ground the person can no
longer dress themselves. The exception is when the object genuinely *is* an
arrangement and the name says so — `hay-bale-stack`, `log-pile`.

The same rule forbids rolling dice on gaps, damage, or which way a thing faces.
A placer turns props; a builder that has already chosen cannot be overridden.

## Conventions

Built facing **+Z**, standing on **y = 0**, centred on the origin in x and z.
A door adds one more promise: centred on x, so portals derive the arrival marker
from position and yaw alone. A wall-mounted thing is built with the wall at
z = 0 and everything proud toward +Z.

Declare `category`, `radius`, `variants` and `solid` on every builder. `radius`
is the widest the object actually reaches, measured rather than guessed — under-
declaring it is read as spare room by the placer's spacing.

Add the name to `underfoot.ts` (what standing on it sounds like, `null` if you
cannot stand on it), to `flex.ts` if it bends in wind, and to `clutter.ts` if it
is small enough that its shadow is not worth drawing. A name absent from those
tables is rigid, shadow-casting and silent, which are the right defaults.

## Where the materials come from

Stone: `art/masonry.ts` — `skin`, `quoinStone`, `throughStone`, `stoneColours`.
Timber and roofs: `art/building.ts` — `look`, `block`, `framing`, `roof`.
Colour: `art/palette.ts`, always through `shade` or `blend`.
Cloth: `art/cloth.ts` with a fabric named in `art/fabrics.ts`.
Light: `art/flame.ts` for the tint and `FLAME_DECAY`, `art/glow.ts` for the
geometry you can see. A source is modelled twice — a light and a glow.

## The trap

Two solids that meet exactly share corner vertices, and a shared corner makes
edges belonging to four triangles instead of two. Overlap by a few millimetres
instead: every joint in this kit is a lap, never a butt.
