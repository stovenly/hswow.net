# src/art/glsl

Shader source that more than one system needs, written down once. Everything
here is a string or a builder of strings — no meshes, no materials, no three.js
objects beyond what a uniform needs.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## Files

- `hash.ts` — the hash *shapes*. The constants stay at the call sites.
- `ramp.ts` — colour ramps as data, and `rampAt` to evaluate one on the CPU.
- `volume.ts` — which effect volume owns a vertex or fragment, and how strongly.
- `sky.ts` — the sky function the scene-class recipes look out through.
- `clouds.ts` — the genus table, the three form functions, and the deck compositor.
- `text.ts` — `indent` and `reindent`, so a spliced block lands readable.

## Conventions

**A shape is shared; a constant is a look.** A hash's constants decide every
speck it scatters and every slot it rolls, so reseeding one moves the material.
The shapes live here and the numbers stay written down where they are used.

**Ramps overlap on purpose.** These are not gradients between neighbouring
stops: every stop is mixed over whatever the chain has produced so far, so where
one window has not closed before the next opens, three colours are in play at
once and the *order* decides the hue. `rampAt` runs the same chain in the same
order the shader does, so a swatch and a surface cannot disagree.

**A genus is a row, not a shader.** Apparent element size — the thing a viewer
actually names a cloud by — falls out of the deck's height and the element's size
in kilometres, so cirrocumulus and stratocumulus are the same billow at
different altitudes and the arithmetic says so.

**A volume is a sphere or a box.** Membership feathers over the outer third; an
*owned* volume ignores geometry entirely and takes its object whole; the
underside is a cut rather than a fade. The strongest volume wins outright — they
do not sum. How the owner id is read is the caller's to say, because the glitch
and horror banks pack it differently.

**No backticks anywhere in a GLSL literal.** A backtick ends the template
literal mid-shader, and the resulting TypeScript error points at a line that has
nothing to do with the mistake.

## Adding a block

It belongs here when two systems would otherwise carry the same source, or when
one system carries it twice — a vertex copy and a fragment copy kept in step by
hand is the same duplication with a worse failure mode. Export it as a string
and let the caller decide where it splices and what it is called.
