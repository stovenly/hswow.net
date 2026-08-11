import { pcgHash3 } from '../glsl/hash';
import { indent } from '../glsl/text';
import { KNOB_ROWS } from './types';

/**
 * The shared recipe kit — helpers every recipe leans on — spliced by
 * `applyFinish` whenever any recipe is in the mask. Each recipe's own GLSL
 * follows it, from `RECIPES`. Requires `vRecipe`, `vRecipeView`,
 * `vRecipeSide`, `vRecipeUp`, `vRecipeNormal`, `vWearPos`, `vObjectPhase`,
 * `vDetailView`, `swayTime`, `wearNoise`, `finishHash3`, `recipeToObject`,
 * `recipeSmoothNormal`, `rampColour` and `skyColourWithSun` in scope.
 *
 * (No backticks below: these are template literals.)
 */
export const RECIPE_SHARED = /* glsl */ `
  uniform float uRecipeOn;
  uniform float uRecipeMotion;
  /** The knob table. Row 0 is no recipe; see RecipeKnobs in ./types.ts. */
  uniform vec4 uRecipeKnobs[${KNOB_ROWS}];

  /** The light direction in object space, captured from the brightest light. */
  vec3 recipeSunObj = vec3(0.0, 1.0, 0.0);
  float recipeSunWeight = 0.0;
  /** How close this fragment is to the tenebrescent front, for its edge glow. */
  float recipeBurnHalo = 0.0;
  /** The tenebrescent state here: 0 pale, 1 violet. */
  float recipeBurnT = 0.0;

  bool isRecipe(float which) {
    return uRecipeOn > 0.5 && abs(vRecipe - which) < 0.5;
  }

  float recipeTime() {
    return swayTime * uRecipeMotion;
  }

  /** Rolls a value off toward a ceiling instead of letting it clip. */
  vec3 recipeKnee(vec3 c, float ceiling) {
    return ceiling * c / (ceiling + c);
  }

  /** Metres per chunky pixel on this surface. */
  float recipeFootprint() {
    return length(fwidth(vDetailView));
  }

  float recipeFbm(vec3 p) {
    return wearNoise(p) * 0.68 + wearNoise(p * 2.7 + 13.1) * 0.32;
  }

  /** (angle about the object axis, height, radius). */
  vec3 recipeBody(vec3 p) {
    return vec3(atan(p.z, p.x), p.y, length(p.xz));
  }

  /**
   * Pushes a position sideways by a drifting noise field, so anything
   * quantized or latticed from it comes out irregular instead of axis-aligned.
   */
  vec3 recipeWarp(vec3 p, float scale, float amount, float rate) {
    float t = recipeTime() * rate;
    return p + (vec3(
      wearNoise(p * scale + vec3(t, 0.0, 0.0)),
      wearNoise(p * scale + vec3(3.1, t * 0.71, 0.0)),
      wearNoise(p * scale + vec3(0.0, 0.0, 7.3 + t * 0.53))
    ) - 0.5) * amount;
  }

  /**
   * An irrational tilt for point lattices. Geometry faces are axis-aligned and
   * so are lattice planes, so points on a large flat face land in visible
   * rows; tilted, the face cuts the lattice at an angle and the points land
   * nonperiodically.
   */
  const mat3 RECIPE_TILT = mat3(
    0.7986, 0.0, -0.6018,
    0.2351, 0.9205, 0.3120,
    0.5540, -0.3907, 0.7351);

  ${indent(pcgHash3('recipeHash3'), 2)}

  /**
   * Nearest feature point in a jittered lattice. Returns distance in x and the
   * owning cell in yzw. Sites are held near their cell centres, so the eight
   * cells meeting at the nearest lattice corner are enough to search.
   */
  vec4 recipeCell(vec3 p, out float border) {
    vec3 corner = floor(p + 0.5);
    float best = 100.0;
    float second = 100.0;
    vec3 bestCell = corner;
    for (int i = -1; i <= 0; i++) {
      for (int j = -1; j <= 0; j++) {
        for (int k = -1; k <= 0; k++) {
          vec3 c = corner + vec3(float(i), float(j), float(k));
          vec3 site = c + 0.5 + (recipeHash3(c) - 0.5) * 0.72;
          float d = length(site - p);
          if (d < best) {
            second = best;
            best = d;
            bestCell = c;
          } else if (d < second) {
            second = d;
          }
        }
      }
    }
    // The gap to the runner-up is zero exactly on the boundary between two
    // cells, so it draws the polygon edges rather than a ring round each site.
    border = second - best;
    return vec4(best, bestCell);
  }
`;
