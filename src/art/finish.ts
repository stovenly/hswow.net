import * as THREE from 'three';
import { NOISE_GLSL } from '../engine/noise';
import { CLOUD_SHADOW_GLSL } from './glsl/clouds';
import { SKY_MAP_GLSL, skyMapUniforms } from '../world/skymap';
import { SKY_GLSL, skyUniforms } from '../engine/Sky';
import { sinHash3 } from './glsl/hash';
import { RAMP_GLSL, RAMP_V, rampUniforms } from './glsl/ramp';
import { indent } from './glsl/text';
import {
  RECIPE_ATTRIBUTE,
  RECIPES,
  VARIANT_INDEX,
  VARIANT_FIELD,
  recipeChain,
  recipeGlsl,
  recipeSlot,
  recipeUniforms,
  PLAIN_KNOBS,
  RECIPE_KNOB_ROWS,
  type RecipeName,
  type VariantName,
  type FinishFeatureName,
} from './recipes';
/**
 * The finish stage: specular, metal, cloth and film terms on the shared art
 * material. Parameters are per-vertex attributes baked from `Part.finish`.
 * Patches the lighting chunks, after the colour chain.
 */

/** metallic, roughness, sheen, iridescence. */
export const FINISH_ATTRIBUTE = 'aFinish';
/** grain axis x and z (biased to 0..1), anisotropy, translucency. */
export const GRAIN_ATTRIBUTE = 'aGrain';
/** glint, star. */
export const GLINT_ATTRIBUTE = 'aGlint';
/** A random 0..1 per triangle, the same on all three of its vertices. Baked in `assemble`, where the geometry is un-indexed. */
export const FACE_ATTRIBUTE = 'aFace';

/** Glint cells per metre. */
const GLINT_DENSITY = 140;

/** The finish stage's own hash. Cheap and periodic; the lattices use pcg3d. */
const FINISH_HASH3 = sinHash3('finishHash3', [
  [127.1, 311.7, 74.7],
  [269.5, 183.3, 246.1],
  [113.5, 271.9, 124.6],
]);

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
  return 1 << (RECIPE_SHIFT + RECIPES.findIndex((recipe) => recipe.name === name));
}

/** Every feature and recipe: compiles byte-identically to the un-split shader. */
export const FINISH_MASK_ALL = (1 << (RECIPE_SHIFT + RECIPES.length)) - 1;

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
    const recipe = RECIPES.find((entry) => entry.name === field);
    for (const implied of recipe?.implies ?? []) mask |= FINISH_FEATURE[implied];
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

export const finishUniforms = {
  /** The dev toggle. Zero is bit-identical to Lambert. */
  uFinishOn: { value: 1 },
  /**
   * How wet every surface the sky can reach is, 0..1. Lags the rain by minutes
   * in both directions — see `world/WeatherRig`, which integrates it.
   */
  uWetness: { value: 0 },
  /** How much snow lies on every up-facing surface, 0..1. */
  uSnow: { value: 0 },
  uSnowColour: { value: new THREE.Color(0xdde5f0) },
  /** How much of a surface's own colour snow is allowed to take, 0..1. */
  uSnowDepth: { value: 0.82 },
  /** Global scale on the direct highlight. */
  uFinishSpecular: { value: 1 },
  /** Global scale on the reflection term. */
  uFinishEnv: { value: 1 },
  /** 1 where the zone has a sky, 0 indoors. */
  uFinishSky: { value: 1 },
};

/**
 * Adds the finish stage to a material already carrying the sway, wear and detail
 * patches. Surface material only; reads `finishWorn`, `vWearPos`, `vDetailView`.
 * `mask` picks which gated chunks compile.
 */
export function applyFinish(material: THREE.Material, mask: number): void {
  const glint = (mask & FINISH_FEATURE.glint) !== 0;
  const film = (mask & FINISH_FEATURE.film) !== 0;
  const trans = (mask & FINISH_FEATURE.translucency) !== 0;
  const aniso = (mask & FINISH_FEATURE.anisotropy) !== 0;
  const recipes = RECIPES.filter((recipe) => (mask & recipeMaskBit(recipe.name)) !== 0);
  const anyRecipe = recipes.length > 0;
  /** A hook, filled by whichever recipes in the mask joined at it. See RecipeSlots. */
  const slot = (name: Parameters<typeof recipeSlot>[1], spaces: number): string =>
    anyRecipe ? recipeSlot(recipes, name, spaces) : '';

  const prior = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prior?.call(material, shader, renderer);

    Object.assign(shader.uniforms, finishUniforms, recipeUniforms, rampUniforms, skyUniforms, skyMapUniforms);

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        attribute vec4 ${FINISH_ATTRIBUTE};
        attribute vec4 ${GRAIN_ATTRIBUTE};
        attribute vec2 ${GLINT_ATTRIBUTE};
        attribute float ${FACE_ATTRIBUTE};
        attribute float ${RECIPE_ATTRIBUTE};
        varying float vRecipe;
        /** Toward the camera, in object space. See below for why it is here. */
        varying vec3 vRecipeView;
        /**
         * The *smooth* normal, where the geometry has one. The material is flat
         * shaded, so the fragment normal is constant across a triangle and a
         * recipe keyed on it comes back as triangle-shaped patches. On a box
         * this is the face normal, so a flat-sided prop is unchanged.
         */
        varying vec3 vRecipeNormal;
        /**
         * A second object axis, carried into view space. One direction is not a
         * frame, and a star sapphire's fibres are fixed in the crystal.
         */
        varying vec3 vRecipeSide;
        varying vec3 vRecipeUp;
        varying vec4 vFinish;
        /** The grain axis in view space. */
        varying vec3 vGrainAxis;
        /** anisotropy, translucency, glint, star. */
        varying vec4 vFinishExtra;
        /** This triangle's random draw, constant across the face. */
        varying float vFace;
        /** A phase per placed object, from where it stands. */
        varying float vObjectPhase;
        /** Metres, world space. What the cloud shadow is looked up at. */
        varying vec3 vFinishWorld;
        `,
      )
      .replace(
        '#include <begin_vertex>',
        /* glsl */ `#include <begin_vertex>
        vFinish = ${FINISH_ATTRIBUTE};
        vFinishWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
        {
          // Y recovered rather than stored: this is an axis, so it was flipped
          // to the upper hemisphere on the way in. See resolveFinish.
          vec2 flat2 = ${GRAIN_ATTRIBUTE}.xy * 2.0 - 1.0;
          float up = sqrt(max(1.0 - dot(flat2, flat2), 0.0));
          // Through the normal matrix, which sway never touches — so the grain
          // is welded to the cloth however the cloth moves.
          vGrainAxis = normalMatrix * vec3(flat2.x, up, flat2.y);
        }
        vFinishExtra = vec4(${GRAIN_ATTRIBUTE}.zw, ${GLINT_ATTRIBUTE});
        vFace = ${FACE_ATTRIBUTE};
        // Two copies of a prop share object space, so anything keyed to it
        // alone fires on every copy at once. Where it stands is what differs.
        vObjectPhase = fract(sin(dot(modelMatrix[3].xz, vec2(12.9898, 78.233))) * 43758.5453);
        vRecipe = ${RECIPE_ATTRIBUTE};
        {
          // The view direction in object space, where the speck fields are
          // hashed. There is no inverse model matrix, but for the rigid,
          // uniformly scaled placements this kit makes the normal matrix is a
          // rotation with a scale, so v times normalMatrix, which GLSL reads as
          // the transpose times v, carries a direction back.
          vec3 toEye = normalize(-(modelViewMatrix * vec4(position, 1.0)).xyz);
          vRecipeView = normalize(toEye * normalMatrix);
          vRecipeSide = normalMatrix * vec3(1.0, 0.0, 0.0);
          vRecipeUp = normalMatrix * vec3(0.0, 1.0, 0.0);
          vRecipeNormal = normalMatrix * normal;
        }
        `,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        varying vec4 vFinish;
        varying vec3 vGrainAxis;
        varying vec4 vFinishExtra;
        varying float vFace;
        varying float vObjectPhase;
        varying float vRecipe;
        varying vec3 vRecipeView;
        varying vec3 vRecipeSide;
        varying vec3 vRecipeUp;
        varying vec3 vRecipeNormal;
        // The clock the wind and the water already run on. Sway declares this
        // in its vertex stage only, so the fragment side is ours to declare.
        uniform float swayTime;
        uniform float uFinishOn;
        uniform float uFinishSpecular;
        uniform float uFinishEnv;
        uniform float uFinishSky;
        uniform float uWetness;
        uniform float uSnow;
        uniform vec3 uSnowColour;
        uniform float uSnowDepth;
        varying vec3 vFinishWorld;
        `,
      )
      .replace(
        // The lighting hook. The lights loop folds the shadow factor into
        // directLight.color before RE_Direct, so every lobe below is shadowed.
        '#include <lights_lambert_pars_fragment>',
        /* glsl */ `#include <lights_lambert_pars_fragment>
        ${NOISE_GLSL}
        ${SKY_GLSL}
        ${CLOUD_SHADOW_GLSL}
        ${SKY_MAP_GLSL}

        /** How wet and how snowed-on this fragment is. See the weather rig. */
        float finishWet = 0.0;
        float finishCrust = 0.0;
        /** Where the weather lies thick and where it lies thin, 0..1. */
        float finishGrain = 0.5;
        /**
         * How far to lean on the interpolated normal instead of the face one,
         * and how hard to blur what the surface reflects.
         *
         * A surface with no finish of its own is lit only because it is wet,
         * and the material is flat shaded: one normal per triangle means one
         * sky sample and one dot(N, H) per triangle, so a narrow lobe and a
         * sharp reflection both come back as patches shaped like the mesh.
         * That is the field of triangles a wet field turns into otherwise.
         */
        float finishSmooth = 0.0;
        float finishEnvBlur = 1.0;
        /**
         * How grazing the *view ray* is, 0 looking straight down at a surface
         * and 1 looking along it. Smooth over the whole frame, because it does
         * not touch the normal at all.
         *
         * A bare wet surface cannot use a fresnel off its own normal: the
         * material is flat shaded, so that fresnel is one value per triangle
         * and swings from a twentieth to three quarters between neighbouring
         * facets — the whole mesh comes back drawn on the surface in grey. The
         * cue that actually reads on wet ground is the ray's own angle anyway:
         * the road far off is bright and the road at your feet is dark.
         */
        float finishGraze = 0.0;

        /** The interpolated attribute normal, in view space. See finishSmooth. */
        vec3 finishSoftNormal() {
          return normalize(vRecipeNormal);
        }
        /** 1 in open sun, down to 1 − strength under the low deck. */
        float finishCloud = 1.0;

        // Written in main once the colour chain has run; read by the lobes. Zero
        // wherever a vertex declared no finish, and the stage is gated on it.
        float finishStrength = 0.0;
        float finishRough = 1.0;
        float finishSheen = 0.0;
        float finishTrans = 0.0;
        float finishGlint = 0.0;
        float finishAniso = 0.0;
        vec3 finishF0 = vec3(0.0);
        vec3 finishSheenColour = vec3(0.0);
        /** How strongly this surface colours what it reflects, 0..1. */
        float finishTintDepth = 0.0;
        vec3 finishTangent = vec3(1.0, 0.0, 0.0);
        vec3 finishBitangent = vec3(0.0, 1.0, 0.0);

        // --- what the recipes reach into ---------------------------
        //
        // Globals defaulting to what the base stage already does, so a recipe
        // that sets none gets today's answer. Named rather than passed, because
        // the speck field is called from two places.

        /** Metres a grain slides per unit of depth. Zero welds it to the surface. */
        float finishSpeckParallax = 0.0;
        /** 1 twinkles and drifts (frost); 0 is a solid holding still specks in it. */
        float finishSpeckLively = 1.0;
        /** How far a grain's own facet leans off the surface, and how close the half vector must come. */
        float finishSpeckSpread = 0.08;
        float finishSpeckGate = 0.972;
        /** How much film a recipe wants laid on. Pointillist kills whole cells. */
        float recipeFilmMix = 1.0;
        // A row of uRecipeKnobs, read once the recipe byte is known. These
        // initialisers are row 0 — no recipe. See RecipeKnobs in recipes/types.ts.
        float recipeGloss = ${PLAIN_KNOBS.gloss.toFixed(2)};
        float recipeRim = ${PLAIN_KNOBS.rim.toFixed(2)};
        float recipeSunGlare = ${PLAIN_KNOBS.sunGlare.toFixed(2)};
        float recipeEnvGain = ${PLAIN_KNOBS.envGain.toFixed(2)};
        /** Sample the environment off the smooth normal instead of the facet. */
        bool recipeSmoothEnv = false;
        /** True on any recipe fragment, so the hooks cost one branch elsewhere. */
        bool finishRecipeAny = false;

        /**
         * The normal distribution, stretched along the grain when asked. The
         * lobe has a floor: a facet turns ten or twenty degrees from its
         * neighbour, and a lobe narrower than that falls between facets, so the
         * highlight is absent rather than dim.
         */
${aniso ? /* glsl */ `        /** The anisotropic form, about a frame given rather than the global one. */
        float finishDAxis(vec3 N, vec3 H, vec3 T, vec3 B) {
          float lobe = max(finishRough, 0.16);
          float a = max(lobe * lobe, 0.002);
          float at = max(a * (1.0 + finishAniso), 0.002);
          float ab = max(a * (1.0 - finishAniso), 0.002);
          float ht = dot(H, T) / at;
          float hb = dot(H, B) / ab;
          float hn = dot(H, N);
          float w = ht * ht + hb * hb + hn * hn;
          return 1.0 / (PI * at * ab * w * w);
        }

        float finishD(vec3 N, vec3 H) {
          float lobe = max(finishRough, 0.16);
          float a = max(lobe * lobe, 0.002);
          if (finishAniso <= 0.0) {
            float d = pow2(dot(N, H)) * (a * a - 1.0) + 1.0;
            return (a * a) / (PI * d * d);
          }
          return finishDAxis(N, H, finishTangent, finishBitangent);
        }` : /* glsl */ `        float finishD(vec3 N, vec3 H) {
          float lobe = max(finishRough, 0.16);
          float a = max(lobe * lobe, 0.002);
          float d = pow2(dot(N, H)) * (a * a - 1.0) + 1.0;
          return (a * a) / (PI * d * d);
        }`}

        /**
         * Smith height-correlated visibility. A constant is right head-on and
         * wrong at a grazing angle, where Fresnel climbs to white and every edge
         * comes back with a pale line drawn along it. It evaluates to 0.25 at
         * dotNL = dotNV = 1, so nothing tuned head-on moved.
         */
        float finishV(float dotNL, float dotNV) {
          float lobe = max(finishRough, 0.16);
          float a2 = pow2(lobe * lobe);
          float gv = dotNL * sqrt(dotNV * dotNV * (1.0 - a2) + a2);
          float gl = dotNV * sqrt(dotNL * dotNL * (1.0 - a2) + a2);
          return 0.5 / max(gv + gl, 1e-5);
        }

        /**
         * A view-space direction brought into the object's own space. Recipes
         * reason in the frame of the thing; two object axes through the normal
         * matrix give the third by cross product. Object-space vectors vary
         * continuously per fragment where the flat-shaded normal does not.
         */
        vec3 recipeToObject(vec3 v) {
          vec3 ax = normalize(vRecipeSide);
          vec3 ay = normalize(vRecipeUp);
          return vec3(dot(v, ax), dot(v, ay), dot(v, cross(ax, ay)));
        }

        /** The smooth normal where there is one, in view space. */
        vec3 recipeSmoothNormal() {
          return normalize(vRecipeNormal);
        }

        ${indent(FINISH_HASH3, 8)}
${glint || anyRecipe ? /* glsl */ `        ${RAMP_GLSL}` : ''}

${glint ? /* glsl */ `        vec3 finishGrainTint(float h, float depth) {
          return rampColour(${RAMP_V.ice.toFixed(6)}, h);
        }

        /**
         * One depth of the speck field. No backticks anywhere below: this shader
         * source is a template literal. Depth is 0 at the surface and rises going
         * into the material: deeper grains are dimmer, softer edged and a little
         * smaller. The layers are offset by a fraction of a cell, so they clump.
         */
        vec3 finishSpeckLayer(float dotNH, float gate, float depth, float density) {
          // Parallax, and it is what puts a grain under the surface. Offsetting
          // the sample along the eye ray in proportion to depth is where the ray
          // at that depth actually is, so grains slide as the camera orbits.
          // In metres, before the density scale. Zero for frost, which sits on top.
          vec3 under = vWearPos - vRecipeView * (finishSpeckParallax * depth);
          vec3 p = under * density + vec3(0.37, 0.61, 0.19) * depth;
          vec3 cell = floor(p);
          vec3 seed = finishHash3(cell + depth * 11.3);
          vec3 alt = finishHash3(cell + depth * 11.3 + 19.7);
          float radius = (0.16 + 0.16 * alt.x) * (1.0 - depth * 0.14);
          // Kept off the cell walls so a grain is never clipped by one.
          float away = length(fract(p) - (seed * 0.5 + 0.25));
          // Softer the deeper it sits: light reaching it has been through frost.
          float speck = 1.0 - smoothstep(radius * (0.6 - depth * 0.2), radius, away);
          if (speck <= 0.0) return vec3(0.0);

          // Each grain breathes on its own phase and rate, with a slow wave
          // deciding which part of the field is up. A clock, not a history.
          float twinkle = 0.06 + 0.94 * (0.5 + 0.5 * sin(
            swayTime * (4.5 + alt.z * 6.0) + seed.x * 6.2831853));
          // A wave measured as an angle about the object's axis travels round it
          // rather than through it, and rising with height it climbs as it goes.
          // Several crests at once, or the surface breathes as one; the noise
          // term breaks the wavefront up and kills long-range order.
          float swirl = atan(vWearPos.z, vWearPos.x) * 3.5 + vWearPos.y * 11.0
            + wearNoise(vWearPos * 1.3) * 14.0;
          float glide = 0.22 + 0.78 * (0.5 + 0.5 * sin(
            swirl + wearNoise(vWearPos * 4.5) * 7.5 - swayTime * 2.2));
          // A solid's inclusions do not twinkle: only whether light reaches them
          // changes. Faded to one rather than branched around.
          speck *= mix(1.0, twinkle * glide, finishSpeckLively);

          // The gate is the sun's share and not all of it: a frosted surface is
          // rough in every direction, so its grains catch whatever light is going.
          float jitter = alt.y * 2.0 - 1.0;
          float lit = smoothstep(finishSpeckGate, 1.0, dotNH + jitter * finishSpeckSpread);
          // Skewed toward the rose end, which is where ice shows most of its
          // colour and where the pinks are.
          return finishGrainTint(pow(seed.y, 1.35), depth) * (mix(1.0, lit, gate) * speck);
        }

        /** Three depths of grain, overlapping, at one scale. */
        vec3 finishSpeckStack(float dotNH, float gate, float density) {
          return finishSpeckLayer(dotNH, gate, 0.0, density)
            + finishSpeckLayer(dotNH, gate, 1.0, density) * 0.45
            + finishSpeckLayer(dotNH, gate, 2.0, density) * 0.22;
        }

        /**
         * The field, at a grain size that holds up wherever it is seen from.
         * Fixed in world size a grain falls under one chunky pixel a few metres
         * out, so it coarsens in octaves, crossfading between two the way
         * trilinear filtering does. Capped at three.
         */
        vec3 finishSparkle(float dotNH, float gate) {
          float base = ${(1 / GLINT_DENSITY).toFixed(5)};
          float footprint = length(fwidth(vDetailView));
          float steps = clamp(log2(max(footprint * 1.5, base) / base), 0.0, 3.0);
          float coarse = floor(steps);
          float density = ${GLINT_DENSITY.toFixed(1)};
          return mix(
            finishSpeckStack(dotNH, gate, density / exp2(coarse)),
            finishSpeckStack(dotNH, gate, density / exp2(coarse + 1.0)),
            steps - coarse
          );
        }` : ''}

${film ? /* glsl */ `        /**
         * Thin film, as a hue walk rather than a spectral integral: quantization
         * is per channel, and this is entirely hue. The thickness varies across
         * the surface — view angle alone draws concentric rings on a sphere.
         */
        vec3 finishFilm(float dotNV, float thickness) {
          float phase = (1.0 - dotNV) * 2.4 * thickness;
          return max(vec3(0.0), 0.75 + cos(6.2831853 * (phase + vec3(0.0, 0.33, 0.67))));
        }

        /** How thick the film is where a recipe has not said otherwise. */
        float finishFilmThickness() {
          return 0.72 + 0.56 * wearNoise(vWearPos * 13.0);
        }` : ''}

${anyRecipe ? /* glsl */ `        ${recipeGlsl(recipes)}` : ''}

        void RE_Direct_Finish(
          const in IncidentLight directLight,
          const in vec3 geometryPosition,
          const in vec3 geometryNormal,
          const in vec3 geometryViewDir,
          const in vec3 geometryClearcoatNormal,
          const in LambertMaterial material,
          inout ReflectedLight reflectedLight
        ) {
          IncidentLight shadedLight = directLight;
          shadedLight.color *= finishCloud;
          RE_Direct_Lambert(shadedLight, geometryPosition, geometryNormal, geometryViewDir,
            geometryClearcoatNormal, material, reflectedLight);
          if (finishStrength <= 0.0) return;

          // The diffuse keeps the face normal — the props read low-poly and
          // that is the look — but the highlight takes the interpolated one,
          // or it lands as whole triangles.
          vec3 finishLobeNormal = normalize(mix(geometryNormal, finishSoftNormal(), finishSmooth));
          vec3 halfDir = normalize(directLight.direction + geometryViewDir);
          float dotNL = saturate(dot(finishLobeNormal, directLight.direction));
          float dotNH = saturate(dot(finishLobeNormal, halfDir));
          float dotVH = saturate(dot(geometryViewDir, halfDir));
          float dotNV = saturate(dot(finishLobeNormal, geometryViewDir));
          vec3 F = F_Schlick(finishF0, 1.0, dotVH);

          // Sheen replaces this lobe rather than standing on top of it: cloth
          // scatters in its fibres and does not also carry a dielectric mirror.
          float lobe = 1.0 - finishSheen;

          float distribution = finishD(finishLobeNormal, halfDir);

          // Pulled down where the finish stage is only running because the
          // surface is wet: a direct lobe on a flat-shaded facet is one value
          // for the whole triangle however broad it is, so a bare wet surface
          // leans on the sky and the darkening instead.
          reflectedLight.directSpecular += shadedLight.color * F
            * (distribution * finishV(dotNL, dotNV) * dotNL * lobe * recipeGloss
               * uFinishSpecular * mix(1.0, 0.3, finishSmooth));
${glint ? /* glsl */ `
          if (finishGlint > 0.0) {
            // Pushed most of the way to white and hard: a grain is a fraction of
            // a chunky pixel, so brightness is what makes it read. Not all the
            // way — a grain driven to clip has no hue left at all.
            vec3 spark = mix(F, vec3(1.0), 0.35) * 2.1;
            reflectedLight.directSpecular +=
              shadedLight.color * spark * (finishSparkle(dotNH, 1.0) * finishGlint * dotNL * uFinishSpecular);
          }
` : ''}

          // Velvet: bright where the surface turns away from the eye. Tinted by
          // the cloth's own colour, because this is fibre scatter.
          if (finishSheen > 0.0) {
            float rim = pow(1.0 - dotNV, 3.0);
            reflectedLight.directSpecular +=
              shadedLight.color * finishSheenColour * (finishSheen * rim * dotNL * uFinishSpecular);
          }
${trans ? /* glsl */ `
          if (finishTrans > 0.0) {
            // Wrap: the terminator softens instead of cutting at ninety degrees.
            // Added as the difference over Lambert, so it vanishes at zero.
            float wrapped = saturate(
              (dot(geometryNormal, directLight.direction) + finishTrans) / (1.0 + finishTrans)
            );
            reflectedLight.directDiffuse +=
              shadedLight.color * BRDF_Lambert(material.diffuseColor) * max(wrapped - dotNL, 0.0);
            // And what comes through from behind. The shadow factor is already in
            // directLight.color, so this reads on thin geometry and edges.
            float through = pow(saturate(dot(geometryViewDir, -directLight.direction)), 3.0);
            reflectedLight.directDiffuse +=
              shadedLight.color * material.diffuseColor * (through * finishTrans * 0.35);
          }
` : ''}${anyRecipe ? /* glsl */ `
          // Recipes answering a light. Object-space half vector, so they vary
          // per fragment instead of per facet.
          if (finishRecipeAny) {
            vec3 lightObj = recipeToObject(directLight.direction);
            vec3 halfObj = normalize(vRecipeView + lightObj);
            vec3 normalObj = recipeToObject(recipeSmoothNormal());
            float smoothNL = saturate(dot(recipeSmoothNormal(), directLight.direction));
            float weight = dot(shadedLight.color, vec3(0.2126, 0.7152, 0.0722));
            if (weight > recipeSunWeight) {
              recipeSunWeight = weight;
              recipeSunObj = lightObj;
            }
            ${slot('direct', 12)}
          }
` : ''}        }

        #undef RE_Direct
        #define RE_Direct RE_Direct_Finish
        `,
      )
      .replace(
        // After the colour chain has decided what the surface is: metals tint
        // their highlight with their own colour and give up their diffuse.
        // finishWorn is the weathering hand-off — where rust won, gilt is matte.
        '#include <lights_lambert_fragment>',
        /* glsl */ `#include <lights_lambert_fragment>
        if (uFinishSky > 0.5) {
          finishCloud = cloudShadowAt(vFinishWorld, normalize(uSunDirection));
          if (uWetness > 0.0 || uSnow > 0.0) {
            vec3 finishUp = inverseTransformDirection(normal, viewMatrix);
            // Whether anything stands between this fragment and the sky. The
            // normal alone cannot tell a roof from the ground under its eave.
            float reach = skyReach(vFinishWorld);
            // Two scales of world noise. Weather that covers evenly is paint:
            // the coarse one decides where a drift lies and where the ground
            // shows through, the fine one ravels the edge of it.
            finishGrain = valueNoise(vFinishWorld.xz * 0.35) * 0.6
              + valueNoise(vFinishWorld.xz * 1.9 + vFinishWorld.y * 0.7) * 0.4;

            // Porosity. A surface that declared no finish is plain stone, soil
            // or timber and drinks; a metal, a glaze or a cloth does not.
            float soak = vFinish.y > 0.001
              ? (1.0 - vFinish.x) * (1.0 - vFinish.z) * smoothstep(0.12, 0.55, vFinish.y)
              : 1.0;
            // Rain runs down a wall and never reaches an underside.
            // The normal decides one thing only: whether this face points at
            // the ground. Everything else the sky can reach gets wet, because
            // rain blows and water runs down whatever it lands on — a shingle
            // course is not dry on its risers.
            //
            // Anything finer than that cannot be asked of a normal here. The
            // material is flat shaded, so a normal term is one value for a
            // whole triangle, and a surface built of many small facets comes
            // back with its own mesh drawn on it. What is sheltered is the
            // map's answer, not the normal's.
            finishWet = uWetness * soak * reach
              * smoothstep(-0.85, -0.2, finishUp.y)
              // Water stands where the ground lets it. Flat and even is a
              // varnish; uneven is a wet street.
              * (0.8 + 0.32 * finishGrain);

            // Snow needs a surface near enough level to hold it. A roof at
            // forty degrees sheds, which is what a pitched roof is for, and a
            // wall holds none at all — so the threshold is high and narrow,
            // and the noise is what stops the line it draws from being a band.
            float lie = smoothstep(0.34, 0.95, finishUp.y);
            finishCrust = uSnow * reach
              * smoothstep(0.28, 0.72, lie * (0.62 + 0.72 * finishGrain));
            finishWet *= 1.0 - finishCrust;
          }
        }
        if (finishCrust > 0.0) {
          // Outside the finish gate on purpose: most of the world declares no
          // finish at all, and snow lies on all of it.
          //
          // Never all the way to the snow colour. Taking every surface to one
          // value is what turns a snowy village into a white shape with a
          // skyline: what is left of the material underneath is the only thing
          // still saying which part of it is a roof and which is a road.
          vec3 lying = uSnowColour * (0.9 + 0.16 * finishGrain);
          material.diffuseColor = mix(material.diffuseColor, lying, finishCrust * uSnowDepth);
        }
        finishStrength = uFinishOn
          * max(step(0.001, vFinish.y), step(0.004, finishWet)) * (1.0 - finishWorn);
        if (finishStrength > 0.0) {
          float finishMetal = vFinish.x * finishStrength;
          // Nothing declared is fully rough, not a mirror: vFinish.y is zero
          // there, and clamping it to the floor would gloss the whole world.
          finishRough = vFinish.y > 0.001 ? clamp(vFinish.y, 0.05, 1.0) : 1.0;
          finishSheen = vFinish.z * finishStrength;
          finishSheenColour = material.diffuseColor;
          finishAniso = clamp(vFinishExtra.x, 0.0, 0.95) * finishStrength;
          finishTrans = vFinishExtra.y * finishStrength;
          finishGlint = vFinishExtra.z * finishStrength;
${aniso ? /* glsl */ `
          // The tangent falls out of the axis and the facet normal, so one axis
          // per part serves a whole turned surface. Where the axis stands along
          // the normal there is no grain direction, so it fades out.
          vec3 across = cross(vGrainAxis, normal);
          float spread = length(across);
          finishAniso *= smoothstep(0.0, 0.2, spread);
          if (finishAniso > 0.0) {
            finishTangent = across / max(spread, 1e-4);
            finishBitangent = cross(normal, finishTangent);
          }
` : ''}${anyRecipe ? /* glsl */ `
          finishRecipeAny = uRecipeOn > 0.5 && vRecipe > 0.5;
          {
            // Read rather than branched to: row 0 holds the plain values, so no
            // recipe and the dev toggle off both land there. Clamped because the
            // byte arrives as an attribute.
            int row = finishRecipeAny ? clamp(int(vRecipe + 0.5), 0, ${RECIPE_KNOB_ROWS - 1}) : 0;
            vec4 knobs = uRecipeKnobs[row];
            recipeGloss = knobs.x;
            recipeRim = knobs.y;
            recipeSunGlare = knobs.z;
            recipeEnvGain = knobs.w;
            // And the variant's own row beside it: which ramp, and three
            // numbers whose meaning is its field's business. R6.
            recipeVar = uRecipeVar[row];
          }
          // Every recipe samples the environment off the smooth normal. The
          // diffuse stays faceted, so the props still read low-poly.
          recipeSmoothEnv = finishRecipeAny;
          ${slot('body', 10)}
` : ''}${film ? /* glsl */ `
          float filmNV = saturate(dot(normal, normalize(vViewPosition)));
          vec3 film = finishFilm(filmNV, ${anyRecipe ? 'recipeFilm(finishFilmThickness())' : 'finishFilmThickness()'});
          ${slot('film', 10)}
          vec3 tint = mix(vec3(1.0), film, vFinish.w * finishStrength * recipeFilmMix);
` : ''}          finishF0 = mix(vec3(0.05), material.diffuseColor, finishMetal) * finishStrength${film ? ' * tint' : ''};
          ${slot('surface', 10)}
          if (finishCrust > 0.0) {
            finishRough = mix(finishRough, 0.82, finishCrust);
            finishSheen *= 1.0 - finishCrust;
          }
          // Bare, and wet: the finish stage is only running here because of
          // the weather. Wide lobe, flat reflection, and the wetness read
          // carried by the darkening and the grazing fresnel instead.
          float finishBare = 1.0 - step(0.001, vFinish.y);
          finishSmooth = finishWet * finishBare;
          {
            vec3 toEye = inverseTransformDirection(normalize(vViewPosition), viewMatrix);
            finishGraze = pow(1.0 - abs(toEye.y), 5.0);
          }

          if (finishWet > 0.0) {
            // Water standing in the pores. Multiplied by *itself* rather than
            // by a constant, which is the whole difference between a wet
            // surface and a dim one: squaring darkens a dark surface further
            // in proportion than a pale one, and it deepens the hue instead of
            // washing it out. A flat multiply plus a grey sky reflection over
            // the top is exactly how a wet street ends up looking like a grey
            // street with nothing on it.
            material.diffuseColor *= mix(vec3(1.0), material.diffuseColor, finishWet * 0.7);
            // Tight enough to read as water and no tighter: a narrower lobe
            // than this crawls against the quantizer, and the painted register
            // does not want a mirror.
            float wetRough = mix(max(0.2, finishRough * 0.34), 0.38, finishBare);
            finishRough = mix(finishRough, wetRough, finishWet);
            finishF0 = max(finishF0, vec3(0.02 * finishWet));
          }
          // Set last, once roughness is settled, and keyed on wetness rather
          // than on bareness. A wet surface that *did* declare a finish is the
          // worse case, not the better one: its roughness falls furthest, so
          // its reflection sharpens the most, and a sharp reflection on flat
          // shaded geometry is one sky sample per triangle. Wet always blurs.
          finishEnvBlur = max(finishRough, finishWet * 0.92);
          finishTintDepth = max(max(finishF0.r, finishF0.g), finishF0.b)
            - min(min(finishF0.r, finishF0.g), finishF0.b);
          material.diffuseColor *= 1.0 - finishMetal;
        }
        `,
      )
      .replace(
        // The reflection: analytic sky outdoors, the hemisphere pair indoors —
        // a dim interior honestly reflects a two-colour gradient. Roughness
        // blurs the sky toward its own average.
        '#include <lights_fragment_end>',
        /* glsl */ `#include <lights_fragment_end>
        if (finishStrength > 0.0) {
          vec3 finishEnvNormal = recipeSmoothEnv
            ? recipeSmoothNormal()
            : normalize(mix(geometryNormal, finishSoftNormal(), finishSmooth));
          vec3 finishBounce = reflect(-geometryViewDir, finishEnvNormal);
          vec3 finishWorld = inverseTransformDirection(finishBounce, viewMatrix);
          ${slot('envBend', 10)}
          vec3 finishEnv = vec3(0.0);
          #if NUM_HEMI_LIGHTS > 0
            finishEnv = getHemisphereLightIrradiance(hemisphereLights[0], finishBounce);
          #endif
          ${anyRecipe ? recipeChain(recipes, 'envSource', 10) : ''}if (uFinishSky > 0.5) {
            vec3 finishSky = skyColourWithSun(finishWorld, recipeSunGlare);
            finishEnv = mix(finishSky, mix(uHorizon, uZenith, 0.4),
              smoothstep(0.15, 0.85, finishEnvBlur));
          }
          // A tinted metal reflecting only the sky comes back wrong: gold has
          // almost no blue and the sky little else, so gilding renders olive.
          // Pulling the environment toward its own brightness stands in for the
          // bounce a landscape gives. Keyed to tint depth, not to metalness.
          float envLuma = dot(finishEnv, vec3(0.2126, 0.7152, 0.0722));
          finishEnv = mix(finishEnv, vec3(envLuma), saturate(finishTintDepth) * 0.8);

          float finishNV = saturate(dot(finishEnvNormal, geometryViewDir));
          // Schlick climbs to 1 at a grazing angle whatever the surface is, so
          // the grazing value is capped by roughness and then pulled back
          // toward F0 by however much rim the recipe asked for.
          vec3 f90 = mix(finishF0, max(vec3(1.0 - finishRough), finishF0), recipeRim);
          vec3 envF = finishF0 + (f90 - finishF0) * pow(1.0 - finishNV, 5.0);
          // Bare and wet: off the ray rather than off the facet, and at water's
          // own reflectance rather than a wash. Water is two per cent
          // reflective face on, and only climbs at angles far more grazing
          // than most of a frame ever gets — half the sky laid over every
          // surface is not a wet surface, it is a filter, and it is what was
          // turning wet roofs grey while the ground beside them stayed green.
          envF = mix(envF, vec3(mix(0.02, 0.11, finishGraze)), finishWet);
          // Scaled by the same (1 − sheen) the direct lobe is: a velvet
          // reflecting the sky would be a velvet-coloured mirror.
          reflectedLight.indirectSpecular +=
            finishEnv * envF * ((1.0 - finishSheen) * recipeEnvGain * uFinishEnv);
${glint ? /* glsl */ `
          // Frost's ambient half: the same grains catching the sky. Against the
          // ambient's brightness, not its colour, or every grain reads sky-blue.
          if (finishGlint > 0.0 && finishSpeckLively > 0.0) {
            reflectedLight.indirectSpecular += mix(finishEnv, vec3(envLuma), 0.8)
              * finishSparkle(0.0, 0.0) * (finishGlint * 1.5 * uFinishEnv);
          }
` : ''}${anyRecipe ? /* glsl */ `
          // The ambient half of each recipe: keyed on the object-space view
          // direction, which is defined over every pixel of the object, so the
          // direct halves above are peaks rather than the only place it exists.
          if (finishRecipeAny) {
            vec3 normalObj = recipeToObject(recipeSmoothNormal());
            float smoothNV = saturate(dot(recipeSmoothNormal(), geometryViewDir));
            vec3 neutral = mix(finishEnv, vec3(envLuma), 0.55);
            ${slot('ambient', 12)}
          }
` : ''}        }
        `,
      )
      .replace(
        // Lambert's outgoing light has no specular terms; hand them back.
        // With no finish both are exactly vec3(0), so adding them is identity.
        'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;',
        'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;',
      );
  };

  // A missing attribute reads as whatever the last draw left in the slot. Zero
  // means matte.
  (material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
    ...(material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues,
    [FINISH_ATTRIBUTE]: [0, 0, 0, 0],
    [GRAIN_ATTRIBUTE]: [0, 0, 0, 0],
    [GLINT_ATTRIBUTE]: [0, 0],
    [FACE_ATTRIBUTE]: [0],
    [RECIPE_ATTRIBUTE]: [0],
  };

  material.customProgramCacheKey = () => 'sway-wear-detail-finish:' + mask;
  material.needsUpdate = true;
}
