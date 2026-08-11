import { RAMP_ROW } from '../glsl/ramp';
import { RECIPE_INDEX, type Recipe } from './types';

const GLSL = /* glsl */ `
  // --- tenebrescence: hackmanite --------------------------------------------
  //
  // Sunlight darkens it; shade leaves it pale. Everything interesting is at the
  // boundary, which grows fingers toward the light and moves.

  /**
   * How far the front is pushed here, in exposure units. Finger-width and
   * finer only: a coarse octave would displace the front bodily off the
   * terminator instead of fraying it.
   */
  float recipeCreep() {
    float t = recipeTime();
    // Sampled along the light direction, so fingers elongate toward the sun.
    vec3 toward = vWearPos - recipeSunObj * 0.022;
    vec3 tendrilPos = recipeWarp(toward * 15.0, 0.9, 1.0, 0.07);
    float tendrils = wearNoise(tendrilPos + vec3(t * 0.22, 0.0, -t * 0.14)) - 0.5;
    float fray = wearNoise(toward * 42.0 - vec3(0.0, t * 0.41, 0.0)) - 0.5;
    float dust = wearNoise(toward * 105.0 + vec3(t * 0.6, 0.0, 0.0)) - 0.5;
    return tendrils * 0.52 + fray * 0.33 + dust * 0.15;
  }

  /**
   * The body of the stone in both states: a drifting blue-white bloom under
   * the surface, a tighter core inside it, and fine crystalline grain over
   * everything so neither face is flat paint.
   */
  vec3 recipeMoonbloom(float t) {
    float drift = recipeTime() * 0.035;
    // Two clouds at different rates, so the bloom moves through itself.
    float bloom = recipeFbm(vWearPos * 1.9 + vec3(0.0, drift, 0.0)) * 0.62
      + recipeFbm(vWearPos * 3.7 - vec3(drift * 0.7, 0.0, 1.3)) * 0.38;
    bloom = smoothstep(0.30, 0.78, bloom);

    vec3 grit = recipeWarp(vWearPos, 8.0, 0.05, 0.0);
    float sugar = wearNoise(grit * 120.0) * 0.6 + wearNoise(grit * 320.0) * 0.4;
    sugar = mix(1.0, 0.82 + 0.36 * sugar, 1.0 - smoothstep(0.003, 0.014, recipeFootprint()));

    float core = smoothstep(0.55, 0.95, recipeFbm(vWearPos * 5.2 + vec3(drift * 1.3, 0.0, 4.4)));

    // Pale state: cool blue-white where the bloom is, warm white where it is not.
    vec3 pale = mix(vec3(1.0, 0.99, 0.96), vec3(0.74, 0.85, 1.0), bloom * 0.62);
    pale = mix(pale, vec3(0.88, 0.94, 1.0), core * 0.45);
    // Dark state: the same blooms read as fire inside the violet.
    vec3 deep = mix(vec3(0.88, 0.84, 1.0), vec3(1.0, 0.78, 0.90), bloom * 0.75);
    deep = mix(deep, vec3(1.0, 0.62, 0.78), core * 0.5);
    return mix(pale, deep, t) * sugar;
  }

  vec3 recipeBurn(float exposure) {
    // Threshold grain, kept fine and small — a broad offset here would move
    // the terminator itself.
    float region = wearNoise(vWearPos * 3.0);
    float speck = wearNoise(vWearPos * 26.0);
    float grain = (region - 0.5) * 0.06 + (speck - 0.5) * 0.09;

    float t = saturate((exposure * 1.9 - 0.30) / 0.86 + grain);
    // The creep only acts in a narrow window around the front.
    float edge = 4.0 * t * (1.0 - t);
    edge *= edge;
    t = saturate(t + recipeCreep() * 0.85 * edge);
    t = t * t * (3.0 - 2.0 * t);

    vec3 c = rampColour(${RAMP_ROW.burn}, t);
    // A warm lift right at the front, and the edge-glow weight read back by
    // the finish stage.
    float halo = 4.0 * t * (1.0 - t);
    recipeBurnHalo = halo * halo * 0.45;
    recipeBurnT = t;
    c += vec3(0.10, 0.03, 0.05) * halo * halo;
    return c * recipeMoonbloom(t);
  }

  /**
   * Crystalline sparkle, different in each state: the pale face carries sparse
   * icy pinpricks, the violet face denser rose-gold sparks.
   */
  vec3 recipeTeneSparkle(vec3 halfObj, float state) {
    vec3 p = RECIPE_TILT * (vWearPos * 150.0);
    vec3 cellId = floor(p);
    vec3 seed = recipeHash3(cellId);
    vec3 alt = recipeHash3(cellId + 18.0);
    float t = recipeTime();
    // The catching plane precesses, so sparks flare and die over time.
    vec3 plane = normalize(seed * 2.0 - 1.0 + vec3(0.0, 0.0013, 0.0) + vec3(
      sin(t * (0.5 + alt.z * 0.7) + seed.x * 6.2831853),
      sin(t * 0.43 + seed.y * 6.2831853),
      sin(t * 0.37 + alt.x * 6.2831853)) * 0.16);
    float lit = pow(abs(dot(plane, halfObj)), 30.0 + alt.y * 60.0);
    float shimmer = 0.65 + 0.35 * sin(t * (1.2 + alt.y * 1.6) + seed.z * 6.2831853);
    vec3 off = fract(p) - 0.5 - (seed - 0.5) * 0.5;
    float spot = 1.0 - smoothstep(0.0, 0.20 + alt.x * 0.15, length(off));
    float fade = 1.0 - smoothstep(0.002, 0.010, recipeFootprint());
    float gate = mix(step(0.62, seed.y), step(0.30, seed.y), state);
    vec3 tint = mix(vec3(0.85, 0.93, 1.0), vec3(1.0, 0.72, 0.86), state);
    return tint * (spot * lit * shimmer * gate * fade);
  }
`;

export const tenebrescent: Recipe = {
  name: 'tenebrescent',
  index: RECIPE_INDEX.tenebrescent,
  glsl: GLSL,
  knobs: { gloss: 0.04, rim: 0.2, sunGlare: 0.02, envGain: 0.25 },
  slots: {
    direct: /* glsl */ `
      // A polished-gem highlight off the smooth normal: a tight core
      // inside a soft bloom, curving round the stone rather than
      // landing facet by facet.
      vec3 glossHalf = normalize(directLight.direction + geometryViewDir);
      float glossNH = saturate(dot(recipeSmoothNormal(), glossHalf));
      reflectedLight.directSpecular += recipeKnee(
        directLight.color * (pow(glossNH, 110.0) * 0.9 + pow(glossNH, 24.0) * 0.18),
        0.55
      ) * uFinishSpecular;
    `,
    ambient: /* glsl */ `
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
    `,
  },
};
