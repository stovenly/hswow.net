import {
  RECIPE_IMPLIES,
  RECIPE_NAMES,
  VARIANT_FIELD,
  VARIANT_INDEX,
  type FinishFeatureName,
  type RecipeName,
  type VariantName,
} from './recipes/types';

/** The finish lanes: what a part's finish bakes to, with nothing of the shader. */

/** metallic, roughness, sheen, iridescence. */
export const FINISH_ATTRIBUTE = 'aFinish';
/** grain axis x and z (biased to 0..1), anisotropy, translucency. */
export const GRAIN_ATTRIBUTE = 'aGrain';
/** glint, star. */
export const GLINT_ATTRIBUTE = 'aGlint';
/** A random 0..1 per triangle, the same on all three of its vertices. Baked in `assemble`, where the geometry is un-indexed. */
export const FACE_ATTRIBUTE = 'aFace';


export interface Finish {
  /** 0 dielectric, 1 metal: tints the highlight, dims the diffuse. */
  metallic: number;
  /** Highlight width and environment blur. Under 0.05 reads as no finish. */
  roughness: number;
  /** Velvet and worn cloth: an inverted-fresnel rim in the surface's colour. */
  sheen?: number;
  /** Thin film: the highlight walks the hue wheel toward grazing angles. */
  iridescence?: number;
  /** How far the highlight stretches along `Part.grain`, 0..1. */
  anisotropy?: number;
  /** Wax and marble: light wraps past the terminator and through. */
  translucency?: number;
  /** Micro-facets that flash one at a time. */
  glint?: number;
  /** An occasional star sparkle, 0..1 — drawn as its own quad by `art/sparkle`. */
  star?: number;
  /**
   * An optical model that is not a parameter — see `art/recipes/`. Added to the
   * finish rather than substituted for it, so `pearl` keeps its iridescence.
   */
  recipe?: VariantName;
}

/** Named finishes, named for the material rather than for the term they isolate. */
export const FINISHES = {
  gilt: { metallic: 1, roughness: 0.25, glint: 0, star: 0.9 },
  bronze: { metallic: 0.9, roughness: 0.15 },
  chrome: { metallic: 1, roughness: 0.05 },
  quartz: { metallic: 0.15, roughness: 0.2 },
  platinum: { metallic: 0.9, roughness: 0.4, anisotropy: 0.85 },
  silk: { metallic: 0, roughness: 0.4, anisotropy: 0.8, sheen: 0.35 },
  velvet: { metallic: 0, roughness: 0.9, sheen: 1 },
  iridescent: { metallic: 0.6, roughness: 0.3, iridescence: 0.8 },
  marble: { metallic: 0, roughness: 0.5, translucency: 0.8 },
  frost: { metallic: 0.25, roughness: 0.5, glint: 1 },

  // --- the recipe looks ----------------------------------------------------
  //
  // Each is an ordinary finish with a look on top: the base is what the surface
  // does between flashes. Rows differing only in `recipe` share one program.

  // Feldspar: a glassy dielectric, dark and fairly smooth.
  labradorite: { metallic: 0.25, roughness: 0.18, recipe: 'labradorite' },
  spectrolite: { metallic: 0.2, roughness: 0.14, recipe: 'spectrolite' },
  // Moonstone is translucent where labradorite is not, so the sheen sits in it.
  moonsheen: { metallic: 0.1, roughness: 0.22, translucency: 0.35, recipe: 'moonsheen' },
  // Copper platelets, so the base leans metallic and rougher.
  sunstone: { metallic: 0.45, roughness: 0.24, recipe: 'sunstone' },

  // Low roughness on purpose: blur the environment and there is nothing left to crawl.
  quicksilver: { metallic: 1, roughness: 0.045, recipe: 'quicksilver' },
  nightsilver: { metallic: 1, roughness: 0.045, recipe: 'nightsilver' },
  slowbrass: { metallic: 1, roughness: 0.09, recipe: 'slowbrass' },
  stillglass: { metallic: 1, roughness: 0.03, recipe: 'stillglass' },

  // Sodalite is translucent — the edges pass light and stay pale while the faces darken.
  violetbloom: { metallic: 0, roughness: 0.42, translucency: 0.45, recipe: 'violetbloom' },
  emberstone: { metallic: 0, roughness: 0.42, translucency: 0.45, recipe: 'emberstone' },
  // Bronze rather than stone, so it is the one that is not translucent.
  verdigrist: { metallic: 0.25, roughness: 0.55, translucency: 0.2, recipe: 'verdigrist' },

  // A pearl is a smooth translucent dielectric with a low film on it: the orient
  // and the growth lines make nacre, and the film is a wash over them.
  nacreous: {
    metallic: 0.2,
    roughness: 0.12,
    iridescence: 0.5,
    translucency: 0.3,
    star: 0.45,
    recipe: 'nacreous',
  },
  lunacreous: {
    metallic: 0.3,
    roughness: 0.1,
    iridescence: 0.6,
    translucency: 0.15,
    star: 0.5,
    recipe: 'lunacreous',
  },

  // stained glass. Three of these four differ in nothing but their ramp row.
  oceanglass: { metallic: 0.5, roughness: 0.2, iridescence: 1, recipe: 'oceanglass' },
  rosewindow: { metallic: 0.5, roughness: 0.2, iridescence: 1, recipe: 'rosewindow' },
  ivyglass: { metallic: 0.5, roughness: 0.2, iridescence: 1, recipe: 'ivyglass' },
  lapispane: { metallic: 0.5, roughness: 0.2, iridescence: 1, recipe: 'lapispane' },

  // The scene class. The base lobe barely reaches the surface — each of these
  // replaces the environment outright — but a smooth metal is the honest base.
  voidstone: { metallic: 1, roughness: 0.04, recipe: 'voidstone' },
  overcast: { metallic: 1, roughness: 0.04, recipe: 'overcast' },
  lakestill: { metallic: 1, roughness: 0.04, recipe: 'lakestill' },
  duskstone: { metallic: 1, roughness: 0.04, recipe: 'duskstone' },
  dawnstone: { metallic: 1, roughness: 0.04, recipe: 'dawnstone' },
  daystone: { metallic: 1, roughness: 0.04, recipe: 'daystone' },
  auroral: { metallic: 1, roughness: 0.04, recipe: 'auroral' },
} as const satisfies Record<string, Finish>;

export type FinishName = keyof typeof FINISHES;

/** A grain axis in object space. Defaults to up. */
export type Grain = readonly [number, number, number];

/**
 * Bits for the gated shader chunks. A geometry's mask is the union of its parts'
 * (`assemble` stamps `userData.finishMask`), and the material compiled for it
 * carries only the chunks the mask names. The base lobe and sheen are always in.
 */
export const FINISH_FEATURE: Record<FinishFeatureName, number> = {
  glint: 1 << 0,
  film: 1 << 1,
  translucency: 1 << 2,
  anisotropy: 1 << 3,
};

/** Field bits sit above the feature bits, in registry order. One bit per field, not per look. */
const RECIPE_SHIFT = 4;

export function recipeMaskBit(name: RecipeName): number {
  return 1 << (RECIPE_SHIFT + RECIPE_NAMES.indexOf(name));
}

/** Every feature and recipe: compiles byte-identically to the un-split shader. */
export const FINISH_MASK_ALL = (1 << (RECIPE_SHIFT + RECIPE_NAMES.length)) - 1;

export interface FinishLanes {
  /** metallic, roughness, sheen, iridescence. */
  finish: [number, number, number, number];
  /** axis x, axis z (both biased), anisotropy, translucency. */
  grain: [number, number, number, number];
  /** glint, star. */
  glint: [number, number];
  /** Which recipe, 0 for none. An index, not a knob — never scaled. */
  recipe: number;
  /** Which gated shader chunks this finish needs. See `FINISH_FEATURE`. */
  mask: number;
}

/** A `Part.finish` and `Part.grain` as the lanes the shader reads. */
export function resolveFinish(finish: FinishName | Finish, grain?: Grain): FinishLanes {
  const f: Finish = typeof finish === 'string' ? FINISHES[finish] : finish;
  const clamp = (v: number): number => (v > 0 ? (v < 1 ? v : 1) : 0);

  // Flipped to the upper hemisphere: the shader recovers Y from x and z, which
  // only works one way up. Sign carries no information on an axis.
  let [gx, gy, gz] = grain ?? [0, 1, 0];
  const length = Math.hypot(gx, gy, gz) || 1;
  gx /= length;
  gy /= length;
  gz /= length;
  if (gy < 0) {
    gx = -gx;
    gy = -gy;
    gz = -gz;
  }

  // Star is absent on purpose: it draws as its own quad (art/sparkle.ts), so
  // it costs the shared shader nothing.
  let mask = 0;
  if ((f.glint ?? 0) > 0) mask |= FINISH_FEATURE.glint;
  if ((f.iridescence ?? 0) > 0) mask |= FINISH_FEATURE.film;
  if ((f.translucency ?? 0) > 0) mask |= FINISH_FEATURE.translucency;
  if ((f.anisotropy ?? 0) > 0) mask |= FINISH_FEATURE.anisotropy;
  if (f.recipe !== undefined) {
    const field = VARIANT_FIELD[f.recipe];
    mask |= recipeMaskBit(field);
    for (const implied of RECIPE_IMPLIES[field] ?? []) mask |= FINISH_FEATURE[implied];
  }

  return {
    finish: [clamp(f.metallic), clamp(f.roughness), clamp(f.sheen ?? 0), clamp(f.iridescence ?? 0)],
    grain: [
      clamp(gx * 0.5 + 0.5),
      clamp(gz * 0.5 + 0.5),
      clamp(f.anisotropy ?? 0),
      clamp(f.translucency ?? 0),
    ],
    glint: [clamp(f.glint ?? 0), clamp(f.star ?? 0)],
    // An index, not a knob: never clamped and never scaled, or look 10 quietly becomes look 1.
    recipe: f.recipe === undefined ? 0 : VARIANT_INDEX[f.recipe],
    mask,
  };
}
