import { indent, reindent } from '../glsl/text';
import { RECIPE_SHARED } from './shared';
import { KNOB_ROWS, PLAIN_KNOBS, type Recipe, type RecipeKnobs, type RecipeName, type RecipeSlots } from './types';
import { schiller } from './schiller';
import { quickmetal } from './quickmetal';
import { tenebrescent } from './tenebrescent';
import { nacreous } from './nacreous';
import { pointillist } from './pointillist';
import { voidstone } from './voidstone';
/**
 * The recipe lane: ten optical models selected by a one-byte recipe index
 * rather than by ten more per-vertex parameters. See MATERIAL-RECIPES.md.
 *
 * Recipes are driven by object-space position and object-space directions, not
 * by the fragment normal: the material is flat shaded, so `dot(N, H)` and
 * `dot(N, V)` are constant across a triangle and anything keyed on them comes
 * out as triangle-shaped patches confined to the specular highlight. Where a
 * surface normal is genuinely needed, `recipeSmoothNormal()` gives the
 * interpolated attribute normal — smooth on lathes and subdivided polyhedra,
 * the face normal on a box.
 *
 * Each recipe is evaluated twice: against the light (the peak) and against the
 * eye (everywhere).
 *
 * **One recipe is one file here.** Its helpers, its knob row and the blocks it
 * splices into the finish stage all sit together, and nothing outside this
 * folder names it: `art/finish.ts` asks for a slot and gets whoever fills it.
 */

export {
  RECIPE_ATTRIBUTE,
  RECIPE_INDEX,
  PLAIN_KNOBS,
  type FinishFeatureName,
  type Recipe,
  type RecipeKnobs,
  type RecipeName,
  type RecipeSlots,
} from './types';

/** In splice order, which is the order the sections have always compiled in. */
export const RECIPES: readonly Recipe[] = [
  schiller,
  quickmetal,
  tenebrescent,
  nacreous,
  pointillist,
  voidstone,
];

const KNOB_BANK = new Float32Array(KNOB_ROWS * 4);

export const recipeUniforms = {
  /** Dev toggle. Zero leaves the plain finish underneath. */
  uRecipeOn: { value: 1 },
  /** Scales every clock here. Rides the reduced-motion setting. */
  uRecipeMotion: { value: 1 },
  /** One row per recipe byte: gloss, rim, sunGlare, envGain. */
  uRecipeKnobs: { value: KNOB_BANK },
};

/** The array size the shader declares. Interpolated, so it stays byte-stable. */
export const RECIPE_KNOB_ROWS = KNOB_ROWS;

/** Each recipe's row, resolved. Mutable: the dev sliders edit these in place. */
export const RECIPE_KNOBS = Object.fromEntries(
  RECIPES.map((recipe) => [recipe.name, { ...PLAIN_KNOBS, ...recipe.knobs }]),
) as Record<RecipeName, RecipeKnobs>;

function writeKnobRow(row: number, knobs: RecipeKnobs): void {
  const at = row * 4;
  KNOB_BANK[at] = knobs.gloss;
  KNOB_BANK[at + 1] = knobs.rim;
  KNOB_BANK[at + 2] = knobs.sunGlare;
  KNOB_BANK[at + 3] = knobs.envGain;
}

/**
 * Pushes `RECIPE_KNOBS` into the uniform bank. Every unclaimed row carries the
 * plain values, so a byte with no recipe behind it draws an ordinary finish.
 */
export function uploadRecipeKnobs(): void {
  for (let row = 0; row < KNOB_ROWS; row++) writeKnobRow(row, PLAIN_KNOBS);
  for (const recipe of RECIPES) writeKnobRow(recipe.index, RECIPE_KNOBS[recipe.name]);
}

uploadRecipeKnobs();

/** Slots that are statement blocks. `thickness` is an expression; see below. */
type BlockSlot = Exclude<keyof RecipeSlots, 'thickness'>;

/** The byte, from the registry entry rather than the name: one source, not two. */
function guard(recipe: Recipe): string {
  return `isRecipe(${recipe.index.toFixed(1)})`;
}

function guarded(recipe: Recipe, body: string): string {
  return `if (${guard(recipe)}) {\n  ${reindent(body, 2)}\n}`;
}

function fill(recipes: readonly Recipe[], slot: BlockSlot): string[] {
  return recipes
    .filter((recipe) => recipe.slots[slot] !== undefined)
    .map((recipe) => guarded(recipe, recipe.slots[slot] as string));
}

/**
 * One hook: the guarded block of whichever recipes fill `slot`, at `spaces`.
 *
 * Empty when none of them do, which is how a lean program stays lean — and how
 * a hook nobody has ever used costs nothing to have declared.
 */
export function recipeSlot(
  recipes: readonly Recipe[],
  slot: BlockSlot,
  spaces: number,
): string {
  const blocks = fill(recipes, slot);
  return blocks.length === 0 ? '' : indent(blocks.join('\n'), spaces);
}

/**
 * The same, as a chain the caller finishes with its own fallback — for a hook
 * whose recipes are *replacing* something rather than adding to it. Ends in a
 * dangling `else`, so what follows is the default arm.
 */
export function recipeChain(
  recipes: readonly Recipe[],
  slot: BlockSlot,
  spaces: number,
): string {
  const blocks = fill(recipes, slot);
  return blocks.length === 0 ? '' : indent(`${blocks.join(' else ')} else `, spaces);
}

/**
 * The recipe stage for a set of recipes: the shared kit, each recipe's own
 * GLSL, and `recipeFilm` assembled from whoever overrides the film thickness.
 */
export function recipeGlsl(recipes: readonly Recipe[]): string {
  const thickness = recipes
    .filter((recipe) => recipe.slots.thickness !== undefined)
    .map((recipe) => `    if (${guard(recipe)}) return ${recipe.slots.thickness};\n`)
    .join('');
  const film = /* glsl */ `
  float recipeFilm(float base) {
${thickness}    return base;
  }
`;
  return RECIPE_SHARED + recipes.map((recipe) => recipe.glsl).join('') + film;
}
