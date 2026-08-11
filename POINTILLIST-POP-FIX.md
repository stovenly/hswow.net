# Pointillist pop fix

Landed. The lattice no longer changes with distance; nothing replaces it.

## The problem

`recipeCellDensity()` snapped the Worley density to discrete octaves — 26 → 13 →
6.5 → 3.25 at footprints of about 0.019, 0.038 and 0.077 metres per pixel. Three
hard jumps, no hysteresis, so a camera sitting near a threshold flapped between
two states.

The jumps were ugly rather than merely visible because this was not a mip chain.
`recipeCell` hashes `floor(p)` at the already-scaled position
(`src/art/recipes/shared.ts:87`), so halving the density regenerated the entire
lattice — new cell boundaries, new per-cell colours everywhere. Each step was a
different skin, not a coarser one.

## What landed

`recipeCellDensity()` is gone. `recipeBerryCell()` takes no argument and holds
`density` as a local `const float` of 26.0, so one lattice stays locked to the
surface from contact to fade-out and the material reads at range exactly as it
reads up close. Whatever the sampling does with it at distance, it does.

`soft` (`src/art/recipes/pointillist.ts:56`) is unchanged and still widens the
cell edge with the pixel footprint, as it did before any of this. That is the
material's own long-standing edge treatment, not a level of detail.

## What was tried and rejected

Fading the cell structure toward its flat average with the footprint —
`thickness` → 0.34, `shade` → 1.0, `film` → 0.85 under a
`smoothstep(0.006, 0.024, recipeFootprint())`. It converged the distant material
to a smooth blue-green body, which is not what the material is for. Keeping the
full-detail skin at all distances is preferred to any distance treatment,
including a continuous one.

Worth knowing if a fade is ever revisited: it cannot be called `flat`, which is
an interpolation qualifier in GLSL ES 3.00 and will not compile as an identifier.

## Cost

Lower than before. One lattice evaluated once, same as the old shader at close
range, and the octave arithmetic is gone.

## Acceptance

Walk out from a pointillist piece — `src/art/builders/pointillist-column.ts`,
`src/art/builders/pointillist-orb.ts`, or the second materials gallery
(`src/debug/galleries/materials2.ts`).

- No discrete change in the pattern at any distance.
- Standing at any distance and stepping back and forth produces no flapping.
- Close range is pixel-identical to before the change.
