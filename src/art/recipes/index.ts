import { indent, reindent } from '../glsl/text';
import { RAMP_V } from '../glsl/ramp';
import { RECIPE_SHARED } from './shared';
import {
  FIELD_SPAN,
  KNOB_ROWS,
  PLAIN_KNOBS,
  VARIANT_INDEX,
  type Recipe,
  type RecipeKnobs,
  type RecipeName,
  type RecipeSlots,
  type RecipeVariant,
  type VariantName,
} from './types';
import { schiller } from './schiller';
import { quickmetal } from './quickmetal';
import { tenebrescent } from './tenebrescent';
import { nacreous } from './nacreous';
import { stainedGlass } from './stained-glass';
import { voidstone } from './voidstone';
import { overcast } from './overcast';
import { duskfall } from './duskfall';
import { auroral } from './auroral';
/**
 * The recipe lane: an optical model selected by a one-byte index rather than by
 * ten more per-vertex parameters. See MATERIAL-RECIPES.md.
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
 * **One field is one file here.** Its helpers, its variants and the blocks it
 * splices into the finish stage all sit together, and nothing outside this
 * folder names it: `art/finish.ts` asks for a slot and gets whoever fills it.
 *
 * **A field is code; a look is a row.** Nine fields carry thirty-five looks
 * between them, and the difference between two looks of one field is two vec4
 * of uniform — no branch, no source byte, no compile. MATERIAL-SYSTEM.md R6.
 */

export {
  FIELD_SPAN,
  RECIPE_ATTRIBUTE,
  VARIANT_FIELD,
  VARIANT_INDEX,
  PLAIN_KNOBS,
  type FieldSpan,
  type FinishFeatureName,
  type Recipe,
  type RecipeKnobs,
  type RecipeName,
  type RecipeSlots,
  type RecipeVariant,
  type VariantName,
} from './types';

/** In splice order, which is the order the sections have always compiled in. */
export const RECIPES: readonly Recipe[] = [
  schiller,
  quickmetal,
  tenebrescent,
  nacreous,
  stainedGlass,
  voidstone,
  overcast,
  duskfall,
  auroral,
];

/** Every look, in byte order. */
export const VARIANTS: readonly RecipeVariant[] = RECIPES.flatMap((recipe) => recipe.variants);

/** Which field a byte belongs to, if any. Zero and unclaimed bytes are none. */
export function fieldOfByte(byte: number): RecipeName | undefined {
  for (const recipe of RECIPES) {
    const span = FIELD_SPAN[recipe.name];
    if (byte >= span.lo && byte <= span.hi) return recipe.name;
  }
  return undefined;
}

const KNOB_BANK = new Float32Array(KNOB_ROWS * 4);
const VAR_BANK = new Float32Array(KNOB_ROWS * 4);

export const recipeUniforms = {
  /** Dev toggle. Zero leaves the plain finish underneath. */
  uRecipeOn: { value: 1 },
  /** Scales every clock here. Rides the reduced-motion setting. */
  uRecipeMotion: { value: 1 },
  /** One row per byte: gloss, rim, sunGlare, envGain. */
  uRecipeKnobs: { value: KNOB_BANK },
  /** Beside it: ramp V, p0, p1, p2. */
  uRecipeVar: { value: VAR_BANK },
};

/** The array size the shader declares. Interpolated, so it stays byte-stable. */
export const RECIPE_KNOB_ROWS = KNOB_ROWS;

/** Each look's knob row, resolved. Mutable: the dev sliders edit these in place. */
export const RECIPE_KNOBS = Object.fromEntries(
  VARIANTS.map((variant) => [variant.name, { ...PLAIN_KNOBS, ...variant.knobs }]),
) as Record<VariantName, RecipeKnobs>;

/** Each look's three numbers. Mutable, for the same reason. */
export const RECIPE_PARAMS = Object.fromEntries(
  VARIANTS.map((variant) => [variant.name, [...variant.params] as [number, number, number]]),
) as Record<VariantName, [number, number, number]>;

function writeKnobRow(row: number, knobs: RecipeKnobs): void {
  const at = row * 4;
  KNOB_BANK[at] = knobs.gloss;
  KNOB_BANK[at + 1] = knobs.rim;
  KNOB_BANK[at + 2] = knobs.sunGlare;
  KNOB_BANK[at + 3] = knobs.envGain;
}

/**
 * Pushes `RECIPE_KNOBS` and `RECIPE_PARAMS` into the banks. Every unclaimed row
 * carries the plain values and a zero variant row, so a byte with no look
 * behind it draws an ordinary surface — and cannot reach a field's shader at
 * all, because unclaimed bytes lie outside every span.
 */
export function uploadRecipeKnobs(): void {
  for (let row = 0; row < KNOB_ROWS; row++) {
    writeKnobRow(row, PLAIN_KNOBS);
    VAR_BANK.fill(0, row * 4, row * 4 + 4);
  }
  for (const variant of VARIANTS) {
    const row = VARIANT_INDEX[variant.name];
    writeKnobRow(row, RECIPE_KNOBS[variant.name]);
    const at = row * 4;
    VAR_BANK[at] = variant.ramp === undefined ? 0 : RAMP_V[variant.ramp];
    const params = RECIPE_PARAMS[variant.name];
    VAR_BANK[at + 1] = params[0];
    VAR_BANK[at + 2] = params[1];
    VAR_BANK[at + 3] = params[2];
  }
}

uploadRecipeKnobs();

/** Slots that are statement blocks. `thickness` is an expression; see below. */
type BlockSlot = Exclude<keyof RecipeSlots, 'thickness'>;

/** The field's span, from the registry rather than the name: one source, not two. */
function guard(recipe: Recipe): string {
  const { lo, hi } = FIELD_SPAN[recipe.name];
  return `isField(${lo.toFixed(1)}, ${hi.toFixed(1)})`;
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
 * The recipe stage for a set of fields: the shared kit, each field's own GLSL,
 * and `recipeFilm` assembled from whoever overrides the film thickness.
 */
export function recipeGlsl(recipes: readonly Recipe[]): string {
  // Deduplicated by identity, so four scenes in one mask declare one drift
  // rotation rather than four — which is a redeclaration and will not compile.
  const shared = [...new Set(recipes.map((recipe) => recipe.shared).filter(Boolean))].join('');
  const thickness = recipes
    .filter((recipe) => recipe.slots.thickness !== undefined)
    .map((recipe) => `    if (${guard(recipe)}) return ${recipe.slots.thickness};\n`)
    .join('');
  const film = /* glsl */ `
  float recipeFilm(float base) {
${thickness}    return base;
  }
`;
  return RECIPE_SHARED + shared + recipes.map((recipe) => recipe.glsl).join('') + film;
}
