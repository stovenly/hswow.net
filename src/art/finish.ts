import * as THREE from 'three';
import { NOISE_GLSL } from '../engine/noise';
import { SKY_GLSL, skyUniforms } from '../engine/Sky';
import {
  RECIPE_ATTRIBUTE,
  RECIPES,
  RECIPE_INDEX,
  recipeGlsl,
  recipeUniforms,
  type RecipeName,
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
/**
 * A random 0..1 per triangle, the same on all three of its vertices. Baked in
 * `assemble`, where the geometry is un-indexed. Gives the sweep a per-face
 * phase without reading it off derivatives, which are wrong on any pixel quad
 * straddling two triangles.
 */
export const FACE_ATTRIBUTE = 'aFace';

/** Glint cells per metre. */
const GLINT_DENSITY = 140;

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
   * An optical model that is not a parameter — labradorite's domains, a
   * starfield behind a black mirror. See `art/recipes.ts`, which explains at
   * length why these are a recipe index rather than ten more lanes.
   *
   * Composes with everything above: the recipe is added to the finish, not
   * substituted for it, so `nacreous` still wants its iridescence and star.
   */
  recipe?: RecipeName;
}

/** Named finishes. Names are placeholders. */
export const FINISHES = {
  gilt: { metallic: 1, roughness: 0.25, glint: 0, star: 0.9 },
  polished: { metallic: 0.9, roughness: 0.15 },
  chrome: { metallic: 1, roughness: 0.05 },
  marble: { metallic: 0.15, roughness: 0.2 },
  brushed: { metallic: 0.9, roughness: 0.4, anisotropy: 0.85 },
  silk: { metallic: 0, roughness: 0.4, anisotropy: 0.8, sheen: 0.35 },
  velvet: { metallic: 0, roughness: 0.9, sheen: 1 },
  shell: { metallic: 0.6, roughness: 0.3, iridescence: 0.8 },
  waxen: { metallic: 0, roughness: 0.5, translucency: 0.8 },
  frost: { metallic: 0.25, roughness: 0.5, glint: 1 },

  // The recipes (MATERIAL-RECIPES.md, M5–M8). Each is an ordinary finish with a
  // recipe on top — the base is what the surface does between flashes, and it
  // matters: a recipe standing on nothing reads as an effect laid over a
  // material rather than as a material.
  // Feldspar: a glassy dielectric, dark and fairly smooth. The flood is
  // bright enough on its own that a metallic base would only wash it out.
  schiller: { metallic: 0.25, roughness: 0.18, recipe: 'schiller' },
  // Low roughness on purpose. Blur the environment and there is nothing left to
  // watch crawl, which is the whole recipe.
  quickmetal: { metallic: 1, roughness: 0.045, recipe: 'quickmetal' },
  // Sodalite is translucent, and it matters here more than anywhere: the
  // edges of a tenebrescent piece pass light, so they stay pale while the
  // faces darken — which doubles the inversion the recipe is about.
  tenebrescent: { metallic: 0, roughness: 0.42, translucency: 0.45, recipe: 'tenebrescent' },
  // A pearl is a smooth translucent dielectric with a *low* film on it. The
  // iridescence was at 0.95 and that was the whole problem: it is the orient
  // and the growth lines that make nacre, and the film is a wash over them.
  // The star lane rides the same quad sparkles gilt uses; nacreous sites draw
  // the thin sliver sprite instead of the four-armed star.
  nacreous: {
    metallic: 0.2,
    roughness: 0.12,
    iridescence: 0.5,
    translucency: 0.3,
    star: 0.45,
    recipe: 'nacreous',
  },
  pointillist: { metallic: 0.5, roughness: 0.2, iridescence: 1, recipe: 'pointillist' },
  voidstone: { metallic: 1, roughness: 0.04, recipe: 'voidstone' },
} as const satisfies Record<string, Finish>;

export type FinishName = keyof typeof FINISHES;

/** A grain axis in object space. Defaults to up. */
export type Grain = readonly [number, number, number];

/**
 * Bits for the gated shader chunks. A geometry's mask is the union of its
 * parts' masks (`assemble` stamps it on `userData.finishMask`) and the
 * material compiled for it carries only the chunks the mask names. The base
 * specular lobe and sheen stay unconditional — nearly everything polished
 * uses them and they are small.
 */
export const FINISH_FEATURE: Record<FinishFeatureName, number> = {
  glint: 1 << 0,
  film: 1 << 1,
  translucency: 1 << 2,
  anisotropy: 1 << 3,
};

/** Recipe bits sit above the feature bits, in registry order. */
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
    mask |= recipeMaskBit(f.recipe);
    const recipe = RECIPES.find((entry) => entry.name === f.recipe);
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
    // Not clamped and not scaled: every other number here is a 0..1 knob and
    // this is a name written as an integer. Putting it through `clamp` would
    // typecheck and quietly turn recipe 10 into recipe 1.
    recipe: f.recipe === undefined ? 0 : RECIPE_INDEX[f.recipe],
    mask,
  };
}

export const finishUniforms = {
  /** The dev toggle. Zero is bit-identical to Lambert. */
  uFinishOn: { value: 1 },
  /** Global scale on the direct highlight. */
  uFinishSpecular: { value: 1 },
  /** Global scale on the reflection term. */
  uFinishEnv: { value: 1 },
  /** 1 where the zone has a sky, 0 indoors. */
  uFinishSky: { value: 1 },
};

/**
 * Adds the finish stage to a material already carrying the sway, wear and
 * detail patches. Surface material only.
 *
 * Reads `finishWorn`, `vWearPos` and `vDetailView` from those earlier patches.
 *
 * `mask` picks which gated chunks compile. `FINISH_MASK_ALL` produces the
 * un-split shader byte for byte; anything smaller is a leaner program.
 */
export function applyFinish(material: THREE.Material, mask: number): void {
  const glint = (mask & FINISH_FEATURE.glint) !== 0;
  const film = (mask & FINISH_FEATURE.film) !== 0;
  const trans = (mask & FINISH_FEATURE.translucency) !== 0;
  const aniso = (mask & FINISH_FEATURE.anisotropy) !== 0;
  const recipes = RECIPES.filter((recipe) => (mask & recipeMaskBit(recipe.name)) !== 0);
  const on = (name: RecipeName): boolean => recipes.some((recipe) => recipe.name === name);
  const anyRecipe = recipes.length > 0;

  const prior = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prior?.call(material, shader, renderer);

    Object.assign(shader.uniforms, finishUniforms, recipeUniforms, skyUniforms);

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
         * The *smooth* normal, where the geometry has one.
         *
         * The material is flat shaded, so the fragment normal comes from screen
         * derivatives and is constant across a triangle. That is the art
         * direction and it stays — but it is also why every recipe keyed on
         * dot(N, H) came back as triangle-shaped patches, which is the
         * "pixelated, low quality" complaint in one sentence.
         *
         * This is the *attribute* normal instead, interpolated. On a lathe or a
         * subdivided polyhedron three writes true vertex normals, so this is
         * smooth and a recipe driven by it flows across the surface. On a box it
         * is the face normal, identical to the flat one — so a flat-sided prop
         * behaves exactly as it does today and nothing has to know which it got.
         *
         * The shading stays faceted; only the material's own structure is
         * smooth. That is the split the look wants: a stone with something
         * happening inside it, lit in facets.
         */
        varying vec3 vRecipeNormal;
        /**
         * A second object axis, carried into view space.
         *
         * The grain axis is one direction and one direction is not a frame. A
         * star sapphire's fibres are fixed *in the crystal*, so drawing them
         * needs a basis anchored to the object rather than to the surface — and
         * with two axes through the normal matrix there is one, for three
         * floats.
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
        `,
      )
      .replace(
        '#include <begin_vertex>',
        /* glsl */ `#include <begin_vertex>
        vFinish = ${FINISH_ATTRIBUTE};
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
          // **The view direction in the space the speck field is hashed in.**
          // Recipes offset their samples along the eye ray in proportion to
          // depth, and that offset has to be applied where the fields live,
          // which is object space.
          //
          // There is no inverse model matrix to be had — three supplies the
          // normal matrix and nothing that goes the other way — but for the
          // rigid, uniformly-scaled placements this kit makes, the normal
          // matrix *is* a rotation with a scale on it, so its transpose carries
          // a direction back. In GLSL a vector times a matrix is the
          // transpose of that matrix times the vector, and the normalize
          // afterwards absorbs the scale.
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
        `,
      )
      .replace(
        // The lighting hook. The lights loop folds the shadow factor into
        // directLight.color before calling RE_Direct, so every lobe below is
        // shadowed for free.
        '#include <lights_lambert_pars_fragment>',
        /* glsl */ `#include <lights_lambert_pars_fragment>
        ${NOISE_GLSL}
        ${SKY_GLSL}

        // Written in main once the colour chain has run; read by the lobes.
        // All zero everywhere a vertex declared no finish, which is nearly
        // everywhere, and the whole stage is gated on the first of them.
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
        // Four globals, all defaulting to what frost and the base stage
        // already do, so a recipe that does not set one gets today's answer.
        // Named rather than passed because the speck field is called from two
        // places and threading four more arguments through both would be four
        // more chances to pass the wrong one.

        /** Metres a grain slides per unit of depth. Zero welds it to the surface. */
        float finishSpeckParallax = 0.0;
        /** 1 twinkles and drifts (frost); 0 is a solid holding still specks in it. */
        float finishSpeckLively = 1.0;
        /**
         * How far a grain's own facet leans off the surface, and how close the
         * half vector has to come before it answers. Frost's grains sit near
         * enough aligned with the surface that they fire in a tight band along
         * the highlight.
         */
        float finishSpeckSpread = 0.08;
        float finishSpeckGate = 0.972;
        /** How much film a recipe wants laid on. Pointillist kills whole cells. */
        float recipeFilmMix = 1.0;
        /**
         * How much of the plain specular lobe a recipe wants under it.
         *
         * **Nearly none of them want all of it.** The lobe has a roughness
         * floor of 0.16, because a lobe narrower than a facet is not dim but
         * *absent* — which is right for metal and wrong for almost everything
         * here. On a 320-face orb it lands as one blown white triangle, and a
         * stone with a mirror flash stuck to one of its faces reads as plastic
         * whatever else is happening on it. Frost and gilt get away with it
         * because they are a rough dielectric and a smooth metal; a
         * labradorite is neither.
         */
        float recipeGloss = 1.0;
        /**
         * How much of the grazing-angle sky the recipe reflects.
         *
         * The environment fresnel climbs toward f90 at the silhouette, and f90
         * is capped by roughness — so a *smooth* finish gets a strong one, and
         * every smooth recipe here came back wearing the same blue ring round
         * its edge. It is the correct answer for chrome and quickmetal and it
         * is noise on everything else: eight orbs sharing one rim read as eight
         * orbs sharing a bug.
         */
        float recipeRim = 1.0;
        /**
         * How much of the sun the environment sample keeps.
         *
         * **This is where the white triangles were actually coming from**, and
         * no amount of damping the specular lobe was ever going to reach them.
         * The environment term is skyColour(reflected direction), and the sky
         * draws the sun as a disc inside a 260-power halo — so a facet whose one
         * reflected direction lands on the sun returns uSunColor over its whole
         * area. Not a highlight: a white polygon.
         *
         * One is the sky as everything has always seen it, so nothing that does
         * not set this moves by a bit.
         */
        float recipeSunGlare = 1.0;
        /** Sample the environment off the smooth normal instead of the facet. */
        bool recipeSmoothEnv = false;
        /** Scale on the plain sky-mirror term. Most stones want very little. */
        float recipeEnvGain = 1.0;
        /** True on any recipe fragment, so the hooks cost one branch elsewhere. */
        bool finishRecipeAny = false;

        /**
         * The normal distribution, stretched along the grain when asked.
         *
         * Isotropic is the same GGX it always was — the anisotropic form
         * reduces to it exactly at anisotropy zero, so the branch is for the
         * arithmetic and not for the answer.
         *
         * **The lobe has a floor, and flat shading is why.** A facet on a
         * prop in this kit turns ten or twenty degrees from its neighbour, and
         * a lobe narrower than that falls between facets: the highlight is not
         * dim, it is *absent*, and then present for one frame when a facet
         * happens to swing through the mirror angle. A metal ball came back
         * looking like painted clay for exactly this reason. Smooth finishes
         * still read as smooth, because what makes them read is the
         * environment term below, which keeps its true roughness.
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
         * Smith height-correlated visibility — how much of the micro-surface
         * shadows itself.
         *
         * **This is what stops cloth looking like cling film.** A constant
         * stood here at first, and a constant is exactly right head-on and
         * badly wrong at a grazing angle, where Fresnel is climbing to white
         * and nothing is left to hold it down: every hem and every edge in the
         * world came back with a hard pale line drawn along it. The honest
         * term costs two square roots and is *identical* to that constant at
         * normal incidence — at dotNL = dotNV = 1 it evaluates to 0.25 — so
         * nothing that was tuned head-on moved, and only the blow-out went.
         */
        float finishV(float dotNL, float dotNV) {
          float lobe = max(finishRough, 0.16);
          float a2 = pow2(lobe * lobe);
          float gv = dotNL * sqrt(dotNV * dotNV * (1.0 - a2) + a2);
          float gl = dotNV * sqrt(dotNL * dotNL * (1.0 - a2) + a2);
          return 0.5 / max(gv + gl, 1e-5);
        }

        /**
         * A view-space direction, brought into the object's own space.
         *
         * Recipes want to reason in the frame of the *thing* — a lamella has an
         * orientation in the crystal, a flake of copper has one in the glass —
         * and the lights arrive in view space. Two object axes carried through
         * the normal matrix give the third by cross product, and for the rigid,
         * uniformly-scaled placements this kit makes that basis is exact.
         *
         * The point of doing it at all: object-space vectors vary *continuously*
         * per fragment, where the flat-shaded normal does not. An effect built
         * on these flows across facets instead of being cut into triangles by
         * them, and it exists over the whole object rather than only where a
         * highlight is.
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

        vec3 finishHash3(vec3 p) {
          p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
                   dot(p, vec3(269.5, 183.3, 246.1)),
                   dot(p, vec3(113.5, 271.9, 124.6)));
          return fract(sin(p) * 43758.5453);
        }

${glint ? /* glsl */ `        /**
         * What a grain of ice does to the light it passes.
         *
         * Ice disperses far less than water, so its optics are pale rather than
         * spectral — a sun dog runs red nearest the sun through orange to a
         * white-blue tail, and iridescent cirrus is pastel pink and cyan. So
         * this is a light ramp, never a rainbow: rose to peach to cream to a
         * cold cyan, with a little violet at the far end. Every stop is high
         * value on purpose; the moment one of them darkens it stops reading as
         * ice and starts reading as painted glass.
         */
        vec3 finishIceTint(float h) {
          vec3 c = mix(vec3(1.00, 0.44, 0.66), vec3(1.00, 0.68, 0.42), smoothstep(0.0, 0.30, h));
          c = mix(c, vec3(1.00, 0.95, 0.84), smoothstep(0.28, 0.55, h));
          c = mix(c, vec3(0.42, 0.80, 1.00), smoothstep(0.55, 0.80, h));
          return mix(c, vec3(0.66, 0.52, 1.00), smoothstep(0.80, 1.0, h));
        }

        vec3 finishGrainTint(float h, float depth) {
          return finishIceTint(h);
        }

        /**
         * One depth of the speck field.
         *
         * Depth is 0 at the surface and rises going into the material:
         * deeper grains are dimmer, softer edged and a little smaller, which is
         * what a crystal seen *through* frost looks like against one sitting on
         * top of it. Their grid is offset by a fraction of a cell rather than
         * by a whole one, so the layers land near each other and clump instead
         * of reading as three separate fields laid over one another.
         *
         * (No backticks in this shader source: it is a template literal.)
         */
        vec3 finishSpeckLayer(float dotNH, float gate, float depth, float density) {
          // A grain in the cell: small, hard-edged, and a different size in
          // every cell. Filling the cell gives squares, smoothing it gives
          // blobs, and one size everywhere gives a field of discs.
          // **Parallax, and it is what puts a grain *under* the surface.**
          // Offsetting the sample along the eye ray in proportion to depth is
          // exactly where the ray at that depth actually is, so the grains
          // slide against the surface as the camera orbits — and that sliding
          // is the entire cue that says "in" rather than "on". Zero for frost,
          // whose grains are weather sitting on top and must not slide.
          //
          // In metres before the density scale, because the offset is a
          // distance into the material and the density is cells per metre.
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

          // **The animation layer.** Each grain breathes on its own phase and
          // rate, and a slow wave crosses the surface deciding which part of
          // the field is up at all — so the frost glides rather than sitting
          // still. A clock, not a history: nothing is accumulated per frame.
          float twinkle = 0.06 + 0.94 * (0.5 + 0.5 * sin(
            swayTime * (4.5 + alt.z * 6.0) + seed.x * 6.2831853));
          // **A wave that goes round the object rather than through it.** A
          // plane wave sweeps one way and the whole surface breathes with it;
          // measured as an *angle* about the object's axis it travels round
          // instead, and rising with height it climbs as it goes, so the field
          // turns rather than pulses. The noise term breaks the wavefront up so
          // it reads as weather over the surface and not as a rotating bar.
          // **Several crests on the object at once, or it breathes as one.**
          // At about a wavelength across the whole orb every grain peaks
          // together and the surface flashes; at a few wavelengths some regions
          // are coming up while others are going down, which is the thing that
          // reads as weather crossing it. The noise is weighted heavily for the
          // same reason — it is what keeps the crests from being a clean spiral.
          // The wide noise term kills long-range order: on a surface much
          // bigger than the orb the linear terms alone draw diagonal stripes.
          float swirl = atan(vWearPos.z, vWearPos.x) * 3.5 + vWearPos.y * 11.0
            + wearNoise(vWearPos * 1.3) * 14.0;
          float glide = 0.22 + 0.78 * (0.5 + 0.5 * sin(
            swirl + wearNoise(vWearPos * 4.5) * 7.5 - swayTime * 2.2));
          // **A solid's inclusions do not twinkle.** Frost is weather and every
          // grain of it is on its own clock; a fleck sealed in glass is not
          // going anywhere, and the only thing that changes is whether the
          // light is currently reaching it. Faded to one rather than branched
          // around, so there is one code path and no second speck field.
          speck *= mix(1.0, twinkle * glide, finishSpeckLively);

          // **The gate is the sun's share, and it is not all of it.** A frosted
          // surface is rough in every direction at once, so its grains catch
          // whatever light is going and scatter it everywhere — they are not
          // only visible where they happen to line up with the sun. Gated, this
          // is the hard pop along the highlight; ungated, it is the field that
          // covers the whole object.
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
         *
         * Fixed in world size, a grain falls under one chunky pixel a few
         * metres out: the field stops being sampleable, turns to boiling noise,
         * and then vanishes. So it coarsens with distance instead — in octaves,
         * crossfading between two, which is what trilinear filtering does
         * between mip levels and for the same reason. A grain stays about a
         * pixel and a half whatever the range, and the frost reads as frost
         * across the room instead of only up close.
         *
         * Capped at three octaves: past that the grains would be bigger than
         * the props carrying them.
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
         * Thin film, as a hue walk rather than a spectral integral.
         *
         * Quantization is per channel, so it keeps differences in hue and
         * collapses differences in brightness — and this is entirely hue.
         *
         * **The film varies in thickness across the surface.** View angle alone
         * is radially symmetric on a sphere, so it draws concentric rings of
         * repeating colour. A real film is not laid to an even depth, and that
         * unevenness is most of what an oil slick or a shell looks like.
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
          RE_Direct_Lambert(directLight, geometryPosition, geometryNormal, geometryViewDir,
            geometryClearcoatNormal, material, reflectedLight);
          if (finishStrength <= 0.0) return;

          vec3 halfDir = normalize(directLight.direction + geometryViewDir);
          float dotNL = saturate(dot(geometryNormal, directLight.direction));
          float dotNH = saturate(dot(geometryNormal, halfDir));
          float dotVH = saturate(dot(geometryViewDir, halfDir));
          float dotNV = saturate(dot(geometryNormal, geometryViewDir));
          vec3 F = F_Schlick(finishF0, 1.0, dotVH);

          // **Sheen replaces this lobe rather than standing on top of it.**
          // Cloth scatters in its fibres; it does not also carry a dielectric
          // mirror. Velvet asks for all of the sheen and therefore none of
          // this, which is the difference between fabric and a wrapped
          // surface — and silk keeps most of its lobe, stretched, which is
          // the difference between silk and velvet.
          float lobe = 1.0 - finishSheen;

          float distribution = finishD(geometryNormal, halfDir);

          reflectedLight.directSpecular += directLight.color * F
            * (distribution * finishV(dotNL, dotNV) * dotNL * lobe * recipeGloss * uFinishSpecular);
${glint ? /* glsl */ `
          if (finishGlint > 0.0) {
            // Pushed most of the way to white and hard: a grain is a fraction
            // of a chunky pixel, so what makes it read is how bright it is,
            // not how big. Tinted by F alone it stays the colour of the
            // surface and disappears into it.
            // Less white and less hot than it was. Both were washing the grain
            // colour out: whitening dilutes it, and a grain driven hard enough
            // to clip has no hue left at all — every channel pinned at 1 is the
            // same colour whatever it started as.
            vec3 spark = mix(F, vec3(1.0), 0.35) * 2.1;
            reflectedLight.directSpecular +=
              directLight.color * spark * (finishSparkle(dotNH, 1.0) * finishGlint * dotNL * uFinishSpecular);
          }
` : ''}

          // Velvet: bright where the surface turns away from the eye. Tinted by
          // the cloth's own colour, because this is fibre scatter rather than a
          // reflection off anything.
          if (finishSheen > 0.0) {
            float rim = pow(1.0 - dotNV, 3.0);
            reflectedLight.directSpecular +=
              directLight.color * finishSheenColour * (finishSheen * rim * dotNL * uFinishSpecular);
          }
${trans ? /* glsl */ `
          if (finishTrans > 0.0) {
            // Wrap: the terminator softens instead of cutting at ninety
            // degrees. Added as the *difference* over Lambert, so the term is
            // purely additive and vanishes exactly at translucency zero.
            float wrapped = saturate(
              (dot(geometryNormal, directLight.direction) + finishTrans) / (1.0 + finishTrans)
            );
            reflectedLight.directDiffuse +=
              directLight.color * BRDF_Lambert(material.diffuseColor) * max(wrapped - dotNL, 0.0);
            // And what comes through from behind. Note the shadow factor is
            // already in directLight.color, so a thick closed solid shadows its
            // own back — this reads on thin geometry and edges, which is where
            // light actually gets through.
            float through = pow(saturate(dot(geometryViewDir, -directLight.direction)), 3.0);
            reflectedLight.directDiffuse +=
              directLight.color * material.diffuseColor * (through * finishTrans * 0.35);
          }
` : ''}${anyRecipe ? /* glsl */ `
          // Recipes answering a light. Object-space half vector, so they vary
          // per fragment instead of per facet.
          if (finishRecipeAny) {
            vec3 lightObj = recipeToObject(directLight.direction);
            vec3 halfObj = normalize(vRecipeView + lightObj);
            vec3 normalObj = recipeToObject(recipeSmoothNormal());
            float smoothNL = saturate(dot(recipeSmoothNormal(), directLight.direction));
            float weight = dot(directLight.color, vec3(0.2126, 0.7152, 0.0722));
            if (weight > recipeSunWeight) {
              recipeSunWeight = weight;
              recipeSunObj = lightObj;
            }
${on('schiller') ? /* glsl */ `
            if (isRecipe(${RECIPE_INDEX.schiller.toFixed(1)})) {
              // Kneed: a domain at its brightest is deep saturated blue, never
              // white. Off the smooth normal so no facet shapes the flood.
              reflectedLight.directSpecular += recipeKnee(
                directLight.color * recipeSchiller(halfObj) * (smoothNL * 1.5), 0.55
              ) * uFinishSpecular;
            }
` : ''}${on('quickmetal') ? /* glsl */ `
            if (isRecipe(${RECIPE_INDEX.quickmetal.toFixed(1)})) {
              // A restrained sheen along the ridged streaks. finishF0 rather
              // than the facet Fresnel, so no triangle steps brighter.
              vec2 body = recipeQuickBody();
              reflectedLight.directSpecular += directLight.color * finishF0
                * (body.y * 0.7 * smoothNL * uFinishSpecular);
            }
` : ''}${on('nacreous') ? /* glsl */ `
            if (isRecipe(${RECIPE_INDEX.nacreous.toFixed(1)})) {
              float nacreNV = saturate(dot(recipeSmoothNormal(), geometryViewDir));
              reflectedLight.directDiffuse += directLight.color * finishSheenColour
                * recipeNacreSheen(nacreNV) * (recipeOrient(nacreNV) * 0.40 * smoothNL);
            }
` : ''}${on('tenebrescent') ? /* glsl */ `
            if (isRecipe(${RECIPE_INDEX.tenebrescent.toFixed(1)})) {
              // A polished-gem highlight off the smooth normal: a tight core
              // inside a soft bloom, curving round the stone rather than
              // landing facet by facet.
              vec3 glossHalf = normalize(directLight.direction + geometryViewDir);
              float glossNH = saturate(dot(recipeSmoothNormal(), glossHalf));
              reflectedLight.directSpecular += recipeKnee(
                directLight.color * (pow(glossNH, 110.0) * 0.9 + pow(glossNH, 24.0) * 0.18),
                0.55
              ) * uFinishSpecular;
            }
` : ''}
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
        finishStrength = uFinishOn * step(0.001, vFinish.y) * (1.0 - finishWorn);
        if (finishStrength > 0.0) {
          float finishMetal = vFinish.x * finishStrength;
          finishRough = clamp(vFinish.y, 0.05, 1.0);
          finishSheen = vFinish.z * finishStrength;
          finishSheenColour = material.diffuseColor;
          finishAniso = clamp(vFinishExtra.x, 0.0, 0.95) * finishStrength;
          finishTrans = vFinishExtra.y * finishStrength;
          finishGlint = vFinishExtra.z * finishStrength;
${aniso ? /* glsl */ `
          // The tangent falls out of the axis and the *facet* normal, which is
          // what lets one axis per part serve a whole turned or folded surface.
          // Where the axis stands along the normal there is no grain direction
          // to speak of — the pole of a lathe — so it fades out rather than
          // snapping to whatever the cross product rounded to.
          vec3 across = cross(vGrainAxis, normal);
          float spread = length(across);
          finishAniso *= smoothstep(0.0, 0.2, spread);
          if (finishAniso > 0.0) {
            finishTangent = across / max(spread, 1e-4);
            finishBitangent = cross(normal, finishTangent);
          }
` : ''}${anyRecipe ? /* glsl */ `
          // Gloss, rim and sun glare per recipe. Gloss scales the plain
          // specular lobe, rim the grazing-angle sky, glare how much of the sun
          // disc the environment sample keeps.
          finishRecipeAny = uRecipeOn > 0.5 && vRecipe > 0.5;
${on('schiller') ? /* glsl */ `          // Schiller has no surface shine at all: the flood is the only light
          // it returns, so the stone reads as colour inside, not gloss on top.
          if (isRecipe(${RECIPE_INDEX.schiller.toFixed(1)})) { recipeGloss = 0.0; recipeRim = 0.0; recipeSunGlare = 0.0; recipeEnvGain = 0.02; }
` : ''}${on('quickmetal') ? /* glsl */ `          // A mirror with no per-facet lobe at all: everything it shows comes
          // through the smooth-normal environment, so no triangle ever flashes.
          if (isRecipe(${RECIPE_INDEX.quickmetal.toFixed(1)})) { recipeGloss = 0.0; recipeRim = 0.85; recipeSunGlare = 0.12; recipeEnvGain = 1.25; }
` : ''}${on('tenebrescent') ? /* glsl */ `          if (isRecipe(${RECIPE_INDEX.tenebrescent.toFixed(1)})) { recipeGloss = 0.04; recipeRim = 0.20; recipeSunGlare = 0.02; recipeEnvGain = 0.25; }
` : ''}${on('nacreous') ? /* glsl */ `          if (isRecipe(${RECIPE_INDEX.nacreous.toFixed(1)})) { recipeGloss = 0.06; recipeRim = 0.12; recipeSunGlare = 0.02; recipeEnvGain = 0.24; }
` : ''}${on('pointillist') ? /* glsl */ `          if (isRecipe(${RECIPE_INDEX.pointillist.toFixed(1)})) { recipeGloss = 0.05; recipeRim = 0.11; recipeSunGlare = 0.02; recipeEnvGain = 0.16; }
` : ''}${on('voidstone') ? /* glsl */ `          // The void is not a sky reflection, so its gain is its own business.
          if (isRecipe(${RECIPE_INDEX.voidstone.toFixed(1)})) { recipeGloss = 0.0; recipeRim = 0.0; recipeSunGlare = 0.0; recipeEnvGain = 0.0; }
` : ''}          // Every recipe here samples the environment off the smooth normal.
          // The diffuse stays faceted, so the props still read low-poly; what
          // goes is the reflection landing as one hard triangle per face.
          recipeSmoothEnv = finishRecipeAny;
${on('schiller') ? /* glsl */ `
          if (isRecipe(${RECIPE_INDEX.schiller.toFixed(1)})) {
            material.diffuseColor *= recipeSchillerSeam();
          }
` : ''}` : ''}${film ? /* glsl */ `
          float filmNV = saturate(dot(normal, normalize(vViewPosition)));
          vec3 film = finishFilm(filmNV, ${anyRecipe ? 'recipeFilm(finishFilmThickness())' : 'finishFilmThickness()'});
          // **A pearl's colour is a wash, not a spectrum.** Three quarters of
          // the hue walk is thrown away right here, and what survives is the
          // faint rose-and-green cast a real pearl carries over a warm white
          // body. Everything that makes nacre read as nacre is elsewhere — the
          // curved growth lines and the orient — and if this term is the one
          // doing the work, it is wrong.
          // Raised from a quarter. At that strength the wash was so faint that
          // what was left was a smooth pale dielectric — which is marble, and
          // that is exactly what it looked like. A pearl's colour is quiet, not
          // absent: you should be able to find the rose and the green on it
          // without hunting.
${on('nacreous') ? /* glsl */ `          if (isRecipe(${RECIPE_INDEX.nacreous.toFixed(1)})) film = mix(vec3(1.0), film, 0.66);
` : ''}          vec3 tint = mix(vec3(1.0), film, vFinish.w * finishStrength * recipeFilmMix);
` : ''}          finishF0 = mix(vec3(0.05), material.diffuseColor, finishMetal) * finishStrength${film ? ' * tint' : ''};
${on('pointillist') ? /* glsl */ `
          if (isRecipe(${RECIPE_INDEX.pointillist.toFixed(1)})) {
            float cellNV = saturate(dot(recipeSmoothNormal(), normalize(vViewPosition)));
            vec3 cell = recipeBerryCell();
            // The cell colour is the reflectance: a structural colour has no
            // pigment behind it, so a wash over a dark body renders as dim
            // confetti.
            finishF0 = recipeBerryTint(cell.x, cellNV) * (finishStrength * cell.z * cell.y * 0.95);
            finishTintDepth = max(max(finishF0.r, finishF0.g), finishF0.b)
              - min(min(finishF0.r, finishF0.g), finishF0.b);
            material.diffuseColor *= 0.35;
          }
` : ''}          finishTintDepth = max(max(finishF0.r, finishF0.g), finishF0.b)
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
          vec3 finishBounce = reflect(
            -geometryViewDir, recipeSmoothEnv ? recipeSmoothNormal() : geometryNormal);
          vec3 finishWorld = inverseTransformDirection(finishBounce, viewMatrix);
${on('quickmetal') ? /* glsl */ `          // Quickmetal leans the ray and nothing else. The geometric normal is
          // untouched, so the silhouette, the outline and the shadow are all
          // exactly today's — only what the surface is looking at moves.
          if (isRecipe(${RECIPE_INDEX.quickmetal.toFixed(1)})) finishWorld = recipeWobble(finishWorld);
` : ''}          vec3 finishEnv = vec3(0.0);
          #if NUM_HEMI_LIGHTS > 0
            finishEnv = getHemisphereLightIrradiance(hemisphereLights[0], finishBounce);
          #endif
          ${on('voidstone') ? /* glsl */ `// Voidstone ignores uFinishSky: the sky is in the stone, indoors too.
          if (isRecipe(${RECIPE_INDEX.voidstone.toFixed(1)})) {
            // The raw view ray, untouched: every fragment looks straight out
            // along its own eye ray, so the stone is a flat window on the
            // void at every angle.
            finishEnv = recipeVoid(inverseTransformDirection(-geometryViewDir, viewMatrix));
          } else ` : ''}${on('quickmetal') ? /* glsl */ `if (isRecipe(${RECIPE_INDEX.quickmetal.toFixed(1)})) {
            // Mercury reflects its own invented surroundings — the real sky has
            // too little ground-to-horizon contrast for the wobble to show.
            // Indoors the same contrast curve rides the hemisphere light.
            if (uFinishSky > 0.5) {
              finishEnv = recipeChromeEnv(finishWorld);
            } else {
              finishEnv *= 0.18 + 1.5 * smoothstep(-0.045, 0.09, finishWorld.y)
                + exp(-finishWorld.y * finishWorld.y * 130.0) * 0.7;
            }
          } else ` : ''}if (uFinishSky > 0.5) {
            vec3 finishSky = skyColourWithSun(finishWorld, recipeSunGlare);
            finishEnv = mix(finishSky, mix(uHorizon, uZenith, 0.4),
              smoothstep(0.15, 0.85, finishRough));
          }
${on('quickmetal') ? /* glsl */ `          // A mirror bright enough to clip loses the very thing it is for: the
          // detail in what it is reflecting. Kneed rather than scaled down, so
          // the dark half keeps its contrast.
          if (isRecipe(${RECIPE_INDEX.quickmetal.toFixed(1)})) {
            finishEnv = recipeKnee(finishEnv, 0.92);
          }` : ''}
          // **A tinted metal cannot reflect only the sky and come back right.**
          // Gold has almost no blue in it and the sky has almost nothing else,
          // so a gilded ball outdoors renders olive-green — which is what a
          // gold mirror in an empty blue room would genuinely do, and nothing
          // like gilding, because real gilding stands in a landscape that
          // bounces its own light back at it. With one analytic sky and no
          // probes, pulling the environment toward its own brightness is the
          // stand-in for that bounce.
          //
          // Keyed to how much the surface *colours* what it reflects, not to
          // how metallic it is: chrome is a metal too, and chrome reflecting a
          // grey sky would be the same mistake in the other direction. Gold
          // neutralises most of the way, chrome almost not at all, and no
          // dielectric is touched.
          float envLuma = dot(finishEnv, vec3(0.2126, 0.7152, 0.0722));
          finishEnv = mix(finishEnv, vec3(envLuma), saturate(finishTintDepth) * 0.8);

          float finishNV = saturate(dot(
            recipeSmoothEnv ? recipeSmoothNormal() : geometryNormal, geometryViewDir));
          // Schlick climbs to 1 at a grazing angle whatever the surface is, so
          // the grazing value is capped by roughness and then pulled back
          // toward F0 by however much rim the recipe asked for.
          vec3 f90 = mix(finishF0, max(vec3(1.0 - finishRough), finishF0), recipeRim);
          vec3 envF = finishF0 + (f90 - finishF0) * pow(1.0 - finishNV, 5.0);
          // Scaled by the same (1 − sheen) the direct lobe is: a velvet that
          // reflected the sky off its surface would be a velvet-coloured
          // mirror, which is the plastic look arriving by the other door.
          reflectedLight.indirectSpecular +=
            finishEnv * envF * ((1.0 - finishSheen) * recipeEnvGain * uFinishEnv);
${glint ? /* glsl */ `
          // Frost's ambient half: the same grains catching the sky, so the
          // whole object is frosted rather than only its lit side. Against the
          // ambient's brightness, not its colour, or every grain comes back
          // sky-blue whatever tint it drew.
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
${on('schiller') ? /* glsl */ `
            if (isRecipe(${RECIPE_INDEX.schiller.toFixed(1)})) {
              reflectedLight.indirectSpecular += recipeKnee(
                neutral * recipeSchiller(vRecipeView) * 1.15, 0.50
              ) * uFinishEnv;
            }
` : ''}${on('quickmetal') ? /* glsl */ `
            if (isRecipe(${RECIPE_INDEX.quickmetal.toFixed(1)})) {
              // The metal's own cast, and the streaks as shading on the mirror
              // itself — multiplied, never added, so nothing hazes over it.
              vec2 body = recipeQuickBody();
              vec3 metal = mix(vec3(0.74, 0.76, 0.83), vec3(0.98, 0.92, 0.78), body.x);
              reflectedLight.indirectSpecular *= mix(vec3(1.0), metal, uFinishEnv);
              reflectedLight.indirectSpecular *= mix(1.0, 0.86 + body.y * 0.30, uFinishEnv);
            }
` : ''}${on('pointillist') ? /* glsl */ `
            if (isRecipe(${RECIPE_INDEX.pointillist.toFixed(1)})) {
              reflectedLight.indirectSpecular += finishEnv * finishF0 * (1.8 * uFinishEnv);
            }
` : ''}${on('nacreous') ? /* glsl */ `
            if (isRecipe(${RECIPE_INDEX.nacreous.toFixed(1)})) {
              // The lustre, tinted by the interference: pearl's rainbow is *in*
              // the depth rather than laid on the surface over it.
              reflectedLight.indirectDiffuse += finishEnv * finishSheenColour
                * recipeNacreSheen(smoothNV) * (recipeOrient(smoothNV) * 1.35 * uFinishEnv);
            }
` : ''}${on('voidstone') ? /* glsl */ `
            if (isRecipe(${RECIPE_INDEX.voidstone.toFixed(1)})) {
              // Flat: what you are looking at is behind the surface, so it is
              // not rationed by how obliquely you meet that surface.
              reflectedLight.indirectSpecular += finishEnv * (1.05 * uFinishEnv);
            }
` : ''}${on('tenebrescent') ? /* glsl */ `
            if (isRecipe(${RECIPE_INDEX.tenebrescent.toFixed(1)})) {
              // Exposure comes from the dominant light alone, so the boundary
              // is that light's terminator — one clean great circle. Summing
              // every light let fill lights drag violet down the shaded side.
              float exposure = saturate(dot(normalObj, recipeSunObj))
                * saturate(recipeSunWeight);
              vec3 burn = recipeBurn(exposure);
              reflectedLight.directDiffuse *= burn;
              reflectedLight.indirectDiffuse *= burn;
              // The changing edge is the show: a soft violet light along it.
              reflectedLight.indirectDiffuse += vec3(0.46, 0.20, 0.58) * recipeBurnHalo;
              // State-aware sparkle, keyed on the dominant light's half vector.
              reflectedLight.indirectSpecular +=
                recipeTeneSparkle(normalize(vRecipeView + recipeSunObj), recipeBurnT)
                * ((0.35 + envLuma) * (0.4 + 0.6 * saturate(recipeSunWeight)) * uFinishEnv);
            }
` : ''}          }
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

  // The lesson every patch here records: a missing attribute reads as whatever
  // the last draw left in the slot. Zero means matte.
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
