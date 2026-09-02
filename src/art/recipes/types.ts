import type { RampName } from '../glsl/ramp';

/**
 * What a recipe is, as far as the rest of the kit is concerned.
 *
 * Separate from `index.ts` because the recipes import this and `index.ts`
 * imports the recipes: the names and the shape have to stand below both.
 */

/** Which look runs, if any. One byte, un-normalized: 0 is none. */
export const RECIPE_ATTRIBUTE = 'aRecipe';

/**
 * The fields: an optical *structure*, which is code and always will be. Six of
 * them were the whole vocabulary until R6; the last three are the scene class,
 * which is a window rather than a surface treatment. See `glsl/sky.ts`.
 */
export type RecipeName =
  | 'schiller'
  | 'quickmetal'
  | 'tenebrescent'
  | 'nacreous'
  | 'stainedGlass'
  | 'voidstone'
  | 'overcast'
  | 'duskfall'
  | 'auroral';

/**
 * The looks, and the byte each one is.
 *
 * **A field's variants take a contiguous span**, which is what lets the guard
 * around its shader block be one range test rather than a chain of equalities.
 * Add a variant by extending its field's span and pushing everything after it
 * along; the numbers exist as data, not as identity.
 *
 * They were described here as "baked into geometry", which was over-stated —
 * `assemble` writes them from this table on every build and nothing serialises
 * a `BufferGeometry`, so a byte lives exactly as long as the process does.
 * Renumbering costs a stale browser shader cache and nothing else.
 */
export const VARIANT_INDEX = {
  // schiller — labradorite and its relatives
  labradorite: 1,
  spectrolite: 2,
  moonsheen: 3,
  sunstone: 4,
  // quickmetal — mercury and what else that flow can be
  quicksilver: 5,
  nightsilver: 6,
  slowbrass: 7,
  stillglass: 8,
  // tenebrescent — what the light does to it. All three burn from one colour
  // into another; none of them has a bare white side.
  violetbloom: 9,
  emberstone: 10,
  verdigrist: 11,
  // nacreous — the film, over a pale body and over a dark one
  nacreous: 12,
  lunacreous: 13,
  // stained glass — the colorways, which is what R6 was argued for
  oceanglass: 14,
  rosewindow: 15,
  ivyglass: 16,
  lapispane: 17,
  // the scene class: a window onto somewhere, not a surface
  voidstone: 18,
  overcast: 19,
  lakestill: 20,
  duskstone: 21,
  dawnstone: 22,
  daystone: 23,
  auroral: 24,
} as const satisfies Record<string, number>;

export type VariantName = keyof typeof VARIANT_INDEX;

/** Rows in the knob tables. Bytes index them directly, so it spans them; each further row is two vec4 on every recipe-carrying program. */
export const KNOB_ROWS = 28;

export type FinishFeatureName = 'glint' | 'film' | 'translucency' | 'anisotropy';

/** The fields in splice order, which is the order the sections compile in and the order of the mask bits. */
export const RECIPE_NAMES: readonly RecipeName[] = [
  'schiller',
  'quickmetal',
  'tenebrescent',
  'nacreous',
  'stainedGlass',
  'voidstone',
  'overcast',
  'duskfall',
  'auroral',
];

/** Which field owns each look. A field's looks must be contiguous in `VARIANT_INDEX`. */
export const VARIANT_FIELD: Record<VariantName, RecipeName> = {
  labradorite: 'schiller',
  spectrolite: 'schiller',
  moonsheen: 'schiller',
  sunstone: 'schiller',
  quicksilver: 'quickmetal',
  nightsilver: 'quickmetal',
  slowbrass: 'quickmetal',
  stillglass: 'quickmetal',
  violetbloom: 'tenebrescent',
  emberstone: 'tenebrescent',
  verdigrist: 'tenebrescent',
  nacreous: 'nacreous',
  lunacreous: 'nacreous',
  oceanglass: 'stainedGlass',
  rosewindow: 'stainedGlass',
  ivyglass: 'stainedGlass',
  lapispane: 'stainedGlass',
  voidstone: 'voidstone',
  overcast: 'overcast',
  lakestill: 'overcast',
  duskstone: 'duskfall',
  dawnstone: 'duskfall',
  daystone: 'duskfall',
  auroral: 'auroral',
};

/** Finish features a field's shader cannot stand without. */
export const RECIPE_IMPLIES: Partial<Record<RecipeName, readonly FinishFeatureName[]>> = {
  nacreous: ['film'],
};

export interface FieldSpan {
  readonly lo: number;
  readonly hi: number;
}

/**
 * Each field's byte range. A gap would be silent and severe: the shader's guard
 * is a range test, so an unclaimed byte inside a field would run its shader
 * against a row of zeros.
 */
export const FIELD_SPAN = Object.fromEntries(
  RECIPE_NAMES.map((name) => {
    const bytes = (Object.keys(VARIANT_FIELD) as VariantName[])
      .filter((variant) => VARIANT_FIELD[variant] === name)
      .map((variant) => VARIANT_INDEX[variant]);
    const lo = Math.min(...bytes);
    const hi = Math.max(...bytes);
    if (hi - lo + 1 !== bytes.length) {
      throw new Error(`recipe '${name}': bytes ${lo}..${hi} are not contiguous`);
    }
    if (hi >= KNOB_ROWS) throw new Error(`recipe '${name}': byte ${hi} is past KNOB_ROWS`);
    return [name, { lo, hi }];
  }),
) as Record<RecipeName, FieldSpan>;

/**
 * How a look answers the shared lighting stage.
 *
 * These were spliced constants — `if (isRecipe(3.0)) { recipeGloss = 0.04; … }`,
 * one branch per recipe per knob — so a program's source depended on which
 * recipes were in its mask. They are rows of a uniform table now, read by the
 * byte, and every art program compiles the same text whatever it carries.
 * MATERIAL-SYSTEM.md R2; a row is per *variant* rather than per field as of R6.
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
 * Row 0, and every row no variant claims: the finish stage with no recipe on
 * it. One is the sky and the lobe as everything has always seen them, so a
 * plain surface, a stray byte and the `uRecipeOn` toggle all land on the same
 * answers. The GLSL globals are initialised from here, so they cannot drift.
 */
export const PLAIN_KNOBS: RecipeKnobs = { gloss: 1, rim: 1, sunGlare: 1, envGain: 1 };

/**
 * Where a recipe joins the finish stage.
 *
 * These were hand-written `if (isRecipe(N))` blocks inside `art/finish.ts` —
 * one per recipe per hook, spread over three splices — so every new material
 * meant editing the file that draws all of them. They are strings on the
 * registry entry now, and finish.ts splices one dispatcher per hook without
 * knowing what is in it. A new field is a file in this folder, a registry
 * entry and a knob row; a new *look* on an existing field is a row and nothing
 * else. MATERIAL-SYSTEM.md R4 and R6.
 *
 * Each is a statement block spliced into the hook named, and each is written
 * against the locals in scope *there* rather than against arguments — the
 * dispatchers are inline, not functions, so what a slot may reach is exactly
 * what the hand-written block beside it could reach. What that is, per slot,
 * is written down below; `art/finish.ts` holds the other end.
 *
 * The order slots run in is registry order, and it does not matter: every
 * block is guarded by its field's byte span, one byte falls in one span, and
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
   * not looking at the sky at all. Every scene lives here.
   */
  envSource?: string;
  /**
   * The view-keyed half: what the recipe does everywhere rather than only
   * where a light is. `finishEnv`, `envLuma`, `neutral`, `smoothNV` and
   * `normalObj` are in scope.
   */
  ambient?: string;
}

/**
 * One look: a byte, a colour ramp, a knob row and three numbers.
 *
 * **No GLSL.** That is the whole of R6 — a variant reaches the shader as two
 * vec4 of uniform, so adding one costs no program, no compile and not even a
 * changed source byte, which means it does not invalidate the browser's shader
 * cache the way every phase before this one did.
 */
export interface RecipeVariant {
  readonly name: VariantName;
  /** Which ramp its field reads. Fields with no ramp of their own omit it. */
  readonly ramp?: RampName;
  /** Where its row differs from `PLAIN_KNOBS`. */
  readonly knobs?: Partial<RecipeKnobs>;
  /**
   * p0, p1, p2, whose meanings are named on the field's `params`.
   *
   * Written out per variant rather than as overrides on a default, because the
   * point of the table is that the looks can be read against each other — and
   * three numbers you have to go and look up are three numbers nobody checks.
   */
  readonly params: readonly [number, number, number];
}

/**
 * One field: the optical structure, and the GLSL it costs to draw.
 *
 * A field is code and stays code, which is the honest limit of this system —
 * a Worley berry skin, a lamellar flood and a starfield share no math a
 * parameter can select between. What varies *within* a field is `variants`.
 */
export interface Recipe {
  readonly name: RecipeName;
  /** The field's own helpers and fields. */
  readonly glsl: string;
  /**
   * GLSL this field shares with its siblings — the scene class's kit, and
   * whatever comes after it. Emitted **once** however many of the fields that
   * declare it are in the mask, deduplicated by identity, so a family can have
   * a common body without every member redeclaring it.
   */
  readonly shared?: string;
  /** Where it joins the finish stage. */
  readonly slots: RecipeSlots;
  /**
   * Its looks, in byte order. Their bytes must be contiguous — `index.ts`
   * checks it, because a gap silently widens the guard onto a neighbour.
   */
  readonly variants: readonly RecipeVariant[];
  /** What p0, p1 and p2 mean here. For the dev panel, and for readers. */
  readonly params: readonly [string, string, string];
}
