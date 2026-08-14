# Working on this project

## A builder builds the object. Nothing else.

**Do not dress scenes.** A builder in `src/art/builders/` makes one object and
hands it over. It does not add debris, scatter, ground marks, spill, or any other
prop around itself to suggest a surrounding world state.

Examples of what this rule forbids, all of which have been written and removed:

- the plough laying ridges of turned earth under its own share
- the hay rick strewing loose hay round its foot
- stone builders scattering chips and rubble on the ground beside them

**Why:** this world is modular and hand placed. Every prop is put somewhere by a
person, on purpose. A builder that decides there is churned earth here, or straw
there, has placed art that nobody asked it to place — it cannot be asked for the
plain object, and the ground it dressed is ground the person can no longer dress
themselves. It removes control and it degrades the result.

The exception is when the object genuinely *is* an arrangement and the request
said so — `hay-bale-stack` is a stack, `log-pile` is a pile. Even then the
builder makes the arrangement and not a scene around it.

Related rules already in force: builders make one complete connected thing, and
must not roll dice on gaps, damage or omissions a placer can create themselves.
There is no placement layer and none is wanted — nothing samples terrain, tips
props to a slope or beds them into ground.

## Orientation is decided, never assumed

**Work out which way every part faces, every time.** This has gone wrong
repeatedly and always the same way: a rotation is applied with the wrong sign, or
about the wrong axis, or after a translation that made it rotate about the wrong
point, and the mistake is invisible in the code and glaring in the world.

Ones that shipped and had to be fixed:

- the well's drum stones turned by `−θ` where the outward normal needs `+θ`, so
  the whole barrel was laid inside out
- the hay bale stack turning alternate courses ninety degrees
- `dung-heap` and `straw-pile` yawing a stretched mound *after* everything else
  had been positioned against its unstretched axes
- `wall-ruin`'s far skin turned a half turn about the origin while its panel was
  stated at the bay's world x, so the stones landed on a different bay

Before writing a rotation, state in a comment what it maps to what — "`rotateY(θ)`
takes +Z to the outward normal at bearing θ" — and check the sign against the
translate that follows it. `CylinderGeometry`'s axis is +Y; `throughStone` faces
+Z; `assemble` does not fix anything up afterwards.

Do **not** answer an orientation bug by adding a check under `tools/`. Fix the
builder and move on.

## Comments are short

**A line or three.** State what the code does and, where it is not obvious, the
one constraint that decides it. Then stop.

Do not write: tuning history, what a previous version did wrong, rejected
alternatives, before-and-after narration, or an essay justifying a number. If a
bug is worth remembering it goes in a commit message, not in a block comment
above the fix. Multi-paragraph headers with `##` sections are for a module that
genuinely needs one — not for every builder.

## No checks. None.

**Do not write checks, probes, verification scripts or throwaway `tools/`
files.** Not permanent ones, not temporary ones, not "just to measure this".

`check:world` is not to be run. `check:art` was deleted on purpose and must not
come back.

Geometry checks in particular are worthless here. Every one written has either
measured the wrong thing or been unable to tell a correct object from a broken
one — distance-to-nearest-face could not tell a stem buried in foliage from a
stem in open air; bounding-box overlap called an L-shaped group a collision; the
V-depth of a corner was swamped by the wall's own thickness. Each cost a round of
work and produced a number that had to be thrown away.

Verify by **reading the code** and by what is reported from the world. The render
is the ground truth. If something cannot be worked out from the code, say so and
ask — do not build an instrument.
