# src/art/recipes

The recipe lane: an optical model selected by a one-byte per-vertex index
rather than by ten more per-vertex parameters. Nine fields carry thirty-five
looks between them.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## A field is code; a look is a row

A **field** is an optical structure — how light behaves in this material — and
it is GLSL. A **look** is a row of the knob table: two `vec4` of uniform, and a
ramp. The difference between two looks of one field is no branch, no source
byte and no compile, which is what lets a colourway be designed by dragging a
slider and read back out as a table row.

## Files

- `types.ts` — the names and the shape. Below both `index.ts` and the recipes,
  because they import it and it imports neither.
- `index.ts` — the registry, the splice, and the shared preamble's assembly.
- `shared.ts` — the helpers every recipe leans on, spliced once if any recipe
  is in the mask.
- one file per field. Its helpers, its variants and the blocks it splices all
  sit together, and nothing outside this folder names it — `art/finish.ts` asks
  for a slot and gets whoever fills it.

## Conventions

**Object space, not the fragment normal.** The material is flat shaded, so
`dot(N, H)` and `dot(N, V)` are constant across a triangle: anything keyed on
them comes out as triangle-shaped patches confined to the specular highlight.
Recipes are driven by object-space position and object-space directions. Where a
surface normal is genuinely needed, `recipeSmoothNormal()` gives the
interpolated attribute normal — smooth on lathes and subdivided polyhedra, the
face normal on a box.

Every recipe is evaluated **twice**: against the light, which is the peak, and
against the eye, which is everywhere.

`aRecipe` is an index and is never normalized. 0 is no recipe.

**No backticks in any recipe's GLSL.** It is a template literal, and a backtick
ends it mid-shader — the error lands on a line number that has nothing to do
with the mistake.

## Adding a field

One file, exporting a `Recipe`. Declare its slots, its variants and its knob
rows, add it to `index.ts`'s registry and its name to `RecipeName` and
`RECIPE_NAMES` in `types.ts`. Adding a *look* to an existing field is a
variant entry in `VARIANT_INDEX` and `VARIANT_FIELD`, a ramp, and no GLSL.
