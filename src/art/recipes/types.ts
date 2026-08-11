/**
 * What a recipe is, as far as the rest of the kit is concerned.
 *
 * Separate from `index.ts` because the recipes import this and `index.ts`
 * imports the recipes: the names and the shape have to stand below both.
 */

/** Which optical model runs, if any. One byte, un-normalized: 0 is none. */
export const RECIPE_ATTRIBUTE = 'aRecipe';

/** The recipes. Indices are written down because they are baked into geometry. */
export const RECIPE_INDEX = {
  schiller: 1,
  quickmetal: 2,
  tenebrescent: 3,
  nacreous: 4,
  pointillist: 7,
  voidstone: 10,
} as const satisfies Record<string, number>;

export type RecipeName = keyof typeof RECIPE_INDEX;

export type FinishFeatureName = 'glint' | 'film' | 'translucency' | 'anisotropy';

/**
 * How a recipe answers the shared lighting stage.
 *
 * These were spliced constants — `if (isRecipe(3.0)) { recipeGloss = 0.04; … }`,
 * one branch per recipe per knob — so a program's source depended on which
 * recipes were in its mask. They are rows of a uniform table now, read by the
 * recipe byte, and every art program compiles the same text whatever it
 * carries. MATERIAL-SYSTEM.md R2.
 */
export interface RecipeKnobs {
  /**
   * How much of the plain specular lobe the recipe wants under it.
   *
   * **Nearly none of them want all of it.** The lobe has a roughness floor of
   * 0.16, because a lobe narrower than a facet is not dim but *absent* — which
   * is right for metal and wrong for almost everything here. On a 320-face orb
   * it lands as one blown white triangle, and a stone with a mirror flash stuck
   * to one of its faces reads as plastic whatever else is happening on it.
   * Frost and gilt get away with it because they are a rough dielectric and a
   * smooth metal; a labradorite is neither.
   */
  gloss: number;
  /**
   * How much of the grazing-angle sky the recipe reflects.
   *
   * The environment fresnel climbs toward f90 at the silhouette, and f90 is
   * capped by roughness — so a *smooth* finish gets a strong one, and every
   * smooth recipe here came back wearing the same blue ring round its edge. It
   * is the correct answer for chrome and quickmetal and it is noise on
   * everything else: eight orbs sharing one rim read as eight orbs sharing a
   * bug.
   */
  rim: number;
  /**
   * How much of the sun the environment sample keeps.
   *
   * **This is where the white triangles were actually coming from**, and no
   * amount of damping the specular lobe was ever going to reach them. The
   * environment term is skyColour(reflected direction), and the sky draws the
   * sun as a disc inside a 260-power halo — so a facet whose one reflected
   * direction lands on the sun returns uSunColor over its whole area. Not a
   * highlight: a white polygon.
   */
  sunGlare: number;
  /** Scale on the plain sky-mirror term. Most stones want very little. */
  envGain: number;
}

/**
 * Row 0, and every row no recipe claims: the finish stage with no recipe on
 * it. One is the sky and the lobe as everything has always seen them, so a
 * plain surface, a stray byte and the `uRecipeOn` toggle all land on the same
 * answers. The GLSL globals are initialised from here, so they cannot drift.
 */
export const PLAIN_KNOBS: RecipeKnobs = { gloss: 1, rim: 1, sunGlare: 1, envGain: 1 };

/** Rows in the knob table. Recipe bytes index it directly, so it spans them. */
export const KNOB_ROWS = 16;

/**
 * Where a recipe joins the finish stage.
 *
 * These were hand-written `if (isRecipe(N))` blocks inside `art/finish.ts` —
 * one per recipe per hook, spread over three splices — so every new material
 * meant editing the file that draws all of them. They are strings on the
 * registry entry now, and finish.ts splices one dispatcher per hook without
 * knowing what is in it. A new material is a file in this folder, a registry
 * entry and a knob row; finish.ts is not touched. MATERIAL-SYSTEM.md R4.
 *
 * Each is a statement block spliced into the hook named, and each is written
 * against the locals in scope *there* rather than against arguments — the
 * dispatchers are inline, not functions, so what a slot may reach is exactly
 * what the hand-written block beside it could reach. What that is, per slot,
 * is written down below; `art/finish.ts` holds the other end.
 *
 * The order slots run in is registry order, and it does not matter: every
 * block is guarded by `isRecipe`, one recipe byte can satisfy one guard, and
 * so at most one block per hook ever runs.
 */
export interface RecipeSlots {
  /**
   * The body colour, before the film and F0 are worked out.
   * `material.diffuseColor` is the surface as the colour chain left it.
   */
  body?: string;
  /**
   * How thick the film is here — an *expression* returning a float, not a
   * block. Only reached where the film feature is in the mask.
   */
  thickness?: string;
  /** The film colour, once computed: `film` is the vec3 to adjust. */
  film?: string;
  /**
   * What the surface reflects. `finishF0` has just been set from the diffuse
   * colour and the metalness; a recipe with its own reflectance overrides it.
   */
  surface?: string;
  /**
   * The answer to one light, inside `RE_Direct`. `directLight`, `halfObj`,
   * `normalObj`, `smoothNL` and `geometryViewDir` are in scope, and the sum
   * goes into `reflectedLight`.
   */
  direct?: string;
  /**
   * Leans the reflected ray before anything is sampled along it. `finishWorld`
   * is the world-space direction; the sky is still what answers.
   */
  envBend?: string;
  /**
   * Replaces what the reflection samples. Sets `finishEnv`, and standing in
   * front of the sky rather than beside it — a recipe that fills this one is
   * not looking at the sky at all.
   */
  envSource?: string;
  /**
   * The view-keyed half: what the recipe does everywhere rather than only
   * where a light is. `finishEnv`, `envLuma`, `neutral`, `smoothNV` and
   * `normalObj` are in scope.
   */
  ambient?: string;
}

/** One recipe: the byte baked into geometry, and the GLSL it costs to draw. */
export interface Recipe {
  readonly name: RecipeName;
  /** The aRecipe byte. Retired indices stay retired. */
  readonly index: number;
  /** The recipe's own helpers and fields. */
  readonly glsl: string;
  /** Where it joins the finish stage. */
  readonly slots: RecipeSlots;
  /** Where its row differs from `PLAIN_KNOBS`. Data, not source. */
  readonly knobs?: Partial<RecipeKnobs>;
  /** Finish features the recipe's shader cannot stand without. */
  readonly implies?: readonly FinishFeatureName[];
}
