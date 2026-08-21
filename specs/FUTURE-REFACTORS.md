# Future refactors

Work that is understood, unblocked, and deliberately not scheduled. Each entry
says what the change is, what it buys, and how to tell it is done. Nothing here
is urgent; nothing here is a bug. When one of these is taken, it gets its own
spec or it is small enough not to need one.

---

## Collidable geometry belongs to the builder

The collider is cheap now — the index was fixed — but it still indexes 43,786
triangles across the kit, and most of them are things nobody can lean on. The
builder is the only place that knows which parts of a prop are made of
something.

**The rule:** collidable geometry should resemble only the part of a thing that
can actually be collided with or stepped on. Branches and trunks, not leaves. A
door's leaf and frame, not its rivets, straps, hinges, handle or window bars.

**The mechanism**, with no change to `Collider` at all. `Part` already carries
`sway`, `wear` and `wearTint` as per-part fields baked at build time; whether a
part is solid is one more field of the same kind. `assemble` merges the solid
parts into a second, position-only geometry; `finish` hangs it off the prop as
an invisible child and flags the visible mesh `noCollide`. `markCollidable`
prunes by subtree already, and `Octree.fromGraphNode` filters on layer rather
than visibility, so both ends do the right thing today. No draw call — the child
is never rendered.

Two grades, both worth having: tagging a part non-solid, which covers foliage
where the render geometry is already the right shape once the canopy drops out;
and giving a part a simpler solid stand-in, which covers anything subdivided for
shading rather than for form. The factory door's leaf is 304 triangles because
it is subdivided 6×10 so the wear gradient can bend across it; as collision it
is a 12-triangle box. Tagging alone takes that door from ~950 collidable
triangles to ~376, the stand-in to ~72.

**The default must be solid** — opt-out, not opt-in, or a builder written next
month silently becomes walk-through and nothing says so. That is also what makes
the retrofit safe to do a few builders at a time.

**The retrofit, in priority order.** Foliage first: ten tree-canopy builders are
~25,150 of the 43,786 triangles, 57% of the whole problem, and the purest case
of the rule. Then doors and their furniture, then anything subdivided for a wear
gradient. `MeshBuilder.solid = false` already excludes 23 whole builders and
stays the right answer for a prop that is soft all the way through; the per-part
field is for props that are solid *somewhere*.

**Done when** a builder can express "this part is decoration", the galleries and
the movement checks still pass, and a walk through a dense interior indexes a
fraction of what it does today.

---

## `tools/` comment sweep, and the check tools behind it

The comment cleanup ran phases 0 through 9 and stopped at the last one. Six of
the eight files in `tools/` are untouched: `audio-check.ts`, `faust-build.ts`,
`faust-check.ts`, `glsl-check.ts`, `movement-check.ts`, `world-check.ts`. The
two footstep tools are done.

**The decision this is really waiting on.** Five of those six are check
harnesses, and the no-checks rule says they should not exist. Tidying them first
would be work spent on files that are meant to go. So: decide whether the check
tools are deleted, and only then sweep whatever is left. `faust-build.ts` is a
build tool rather than a check and gets the sweep either way.

**Done when** `tools/` holds only files that earn their place, and those files
pass the same gauntlet `src/` passed.
