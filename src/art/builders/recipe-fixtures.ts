import { finishOrb, finishColumn } from '../fixture';
import { PALETTE, shade } from '../palette';
import type { MeshBuilder } from '../types';
import type { VariantName } from '../recipes';

/**
 * One orb and one column per recipe look.
 *
 * **One file, not fifty.** Each of these was its own two-line module — twelve
 * files for six recipes, and twenty-five looks under the same rule would be
 * fifty. That is the bloat this whole refactor exists to prevent, reproduced on
 * the gallery side: a look is a table row in the shader and it should be a
 * table row here too.
 *
 * The body colour is the one thing that genuinely varies per look and cannot
 * come from the recipe, because the recipe is what happens *to* a surface and
 * this is the surface. Most of them share their field's, and the ones that do
 * not say why.
 */

interface Fixture {
  readonly variant: VariantName;
  readonly color: number;
}

/** In registry order, which is the order the galleries read them in. */
const FIXTURES: readonly Fixture[] = [
  // schiller. Dark iron under all four: the flood is the only light these
  // return, and a pale body under it reads as paint rather than as depth.
  { variant: 'labradorite', color: PALETTE.IRON_DARK },
  { variant: 'spectrolite', color: shade(PALETTE.IRON_DARK, 0.7) },
  // Moonstone's body is milky, not black — the sheen is *inside* it, so there
  // has to be something for it to be inside of.
  { variant: 'moonsheen', color: shade(PALETTE.STONE_PALE, 0.92) },
  { variant: 'sunstone', color: shade(PALETTE.BRONZE, 0.8) },

  // quickmetal. A mirror shows what it reflects and almost nothing of itself,
  // so these barely differ — except the inverted one, which wants a body dark
  // enough that the burning floor is the brightest thing on it.
  { variant: 'quicksilver', color: shade(PALETTE.CHROME, 0.74) },
  { variant: 'nightsilver', color: shade(PALETTE.CHROME, 0.34) },
  { variant: 'slowbrass', color: shade(PALETTE.GOLD, 0.82) },
  { variant: 'stillglass', color: shade(PALETTE.CHROME, 0.74) },

  // tenebrescent, and **this is where the grey was coming from**. The burn
  // *multiplies* the prop's diffuse, so wherever the ramp is pale the body's own
  // colour is what you see — and two of these three were standing on
  // `STONE_PALE`, which is grey. Verdigrist never looked grey for exactly one
  // reason: its body is `PATINA`, a green stone. So all three now stand on a
  // muted stone in their own hue, at PATINA's value, and the pale face is a
  // pale *colour* rather than an absence of one.
  { variant: 'violetbloom', color: 0x6a5878 },
  { variant: 'emberstone', color: 0x7a5238 },
  { variant: 'verdigrist', color: PALETTE.PATINA },

  // nacreous, over a pale body and a dark one. **The body is the whole
  // difference between these two** — the wash is laid over whatever colour the
  // prop is, so the same field reads as a pearl on cream and as a black pearl on
  // near-black. Not `INK`, which is a warm brown-black; this is a cool one, so
  // the green in the sheen has something to be green against.
  { variant: 'nacreous', color: shade(PALETTE.WOOL, 1.22) },
  { variant: 'lunacreous', color: 0x1d1f26 },

  // stained glass. Ink under all four: the cell colour *is* the reflectance, so
  // a bright body behind it washes the glass out.
  { variant: 'oceanglass', color: PALETTE.INK },
  { variant: 'rosewindow', color: PALETTE.INK },
  { variant: 'ivyglass', color: PALETTE.INK },
  { variant: 'lapispane', color: PALETTE.INK },

  // The scene class. The body never reaches the eye — the window replaces the
  // environment outright — so these are all the same and it does not matter.
  { variant: 'voidstone', color: PALETTE.STONE },
  { variant: 'overcast', color: PALETTE.STONE },
  { variant: 'lakestill', color: PALETTE.STONE },
  { variant: 'duskstone', color: PALETTE.STONE },
  { variant: 'dawnstone', color: PALETTE.STONE },
  { variant: 'daystone', color: PALETTE.STONE },
  { variant: 'auroral', color: PALETTE.STONE },
];

const ORBS = new Map<VariantName, MeshBuilder>();
const COLUMNS = new Map<VariantName, MeshBuilder>();

for (const { variant, color } of FIXTURES) {
  ORBS.set(variant, finishOrb(`${variant}-orb`, color, variant));
  COLUMNS.set(variant, finishColumn(`${variant}-column`, color, variant));
}

/**
 * A look's orb and column.
 *
 * Two fixtures, and the first gallery settled which two: an orb presents every
 * angle at once, which is what makes it the thing to tune a lobe against, and a
 * column is where a finish is read across large flat faces. Half of what is in
 * this wing is view-dependent across a surface rather than across an angle, so
 * both are needed.
 */
export function variantOrb(variant: VariantName): MeshBuilder {
  const found = ORBS.get(variant);
  if (!found) throw new Error(`no fixture for '${variant}'`);
  return found;
}

export function variantColumn(variant: VariantName): MeshBuilder {
  const found = COLUMNS.get(variant);
  if (!found) throw new Error(`no fixture for '${variant}'`);
  return found;
}

/** Both, in the order a gallery row wants them. */
export function variantPair(variant: VariantName): MeshBuilder[] {
  return [variantOrb(variant), variantColumn(variant)];
}

/** Every fixture, in registry order — for a gallery that wants the lot. */
export const RECIPE_FIXTURES: readonly MeshBuilder[] = FIXTURES.flatMap((fixture) =>
  variantPair(fixture.variant),
);
