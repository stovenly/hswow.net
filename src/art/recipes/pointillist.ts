import { RAMP_ROW } from '../glsl/ramp';
import { RECIPE_INDEX, type Recipe } from './types';

const GLSL = /* glsl */ `
  // --- pointillist: the marble berry ----------------------------------------
  //
  // Bragg stacks whose layer thickness differs cell to cell. Cells come from a
  // Worley lattice and are shaded as domes, so they interlock instead of
  // tiling.

  /** Thicker stacks run redder, and a grazing view thins what it looks through. */
  vec3 recipeBerryTint(float thickness, float smoothNV) {
    return rampColour(${RAMP_ROW.berry}, saturate(thickness - (1.0 - smoothNV) * 0.20));
  }

  /** (stack thickness, dome shading, how much film the cell carries). */
  vec3 recipeBerryCell() {
    // One lattice, fixed to the surface, at every distance. Coarsening it would
    // regenerate the whole skin rather than simplifying it, since the hash is
    // taken at the scaled position — so the material keeps its close-range look
    // all the way out and lets the sampling fall where it falls.
    const float density = 26.0;

    // Barely warped: the lattice showing through is the point. What is wanted
    // is mathematical irregularity, not organic blobbing.
    vec3 p = recipeWarp(vWearPos, 4.5, 0.014, 0.012) * density;
    float border;
    vec4 cell = recipeCell(p, border);
    vec3 draw = finishHash3(cell.yzw);
    vec3 alt = finishHash3(cell.yzw + 47.3);

    // A coarser field underneath, offset along the eye ray, so a cell shows a
    // hint of a different one behind it and the skin has a thickness.
    float underBorder;
    vec4 under = recipeCell((vWearPos - vRecipeView * 0.012) * density * 0.42 + 9.7, underBorder);
    vec3 deep = finishHash3(under.yzw);

    float cluster = wearNoise(floor(cell.yzw * 0.25) * 0.8 + 3.3);
    float breath = sin(recipeTime() * 0.045 + draw.z * 6.2831853 + vObjectPhase * 6.2831853);
    // Cubed: the stops past two thirds of the ramp are olive and gold, so four
    // cells in five need to land in the blues.
    // Narrower than before: the cells that landed in olive and gold were
    // reading as flecks of solid colour stuck on rather than as part of the
    // same skin.
    float thickness = saturate(
      0.06 + 0.44 * draw.x * draw.x * draw.x + cluster * 0.24
        + deep.x * 0.10 + breath * 0.020
    );

    // Nearly flat across the cell: a tile, not a dome. The under-layer lifts
    // the middle a little so the skin is not perfectly even.
    // Edge width, widened with the pixel footprint. A line whose width is fixed
    // in object space falls under a pixel at a few metres and crawls; widened
    // as it recedes it stays a line and simply softens, which is what every
    // other fine field here does and for the same reason.
    float soft = 0.055 + recipeFootprint() * density * 0.9;
    float shade = 0.80 + 0.26 * (1.0 - smoothstep(0.20, 0.55 + soft, cell.x))
      + 0.12 * (1.0 - smoothstep(0.1, 0.5, under.x));
    // A rare cell catches the light for a moment, in its own colour.
    float flash = step(0.985, alt.z)
      * pow(0.5 + 0.5 * sin(recipeTime() * (0.6 + alt.x * 0.8) + draw.x * 6.2831853), 8.0);
    shade += flash * 0.4;
    float film = alt.y > 0.97 ? 0.30 : 1.0;
    // The polygon edge, and a fainter one from the layer beneath showing through.
    film *= 0.30 + 0.70 * smoothstep(0.0, soft, border);
    film *= 0.80 + 0.20 * smoothstep(0.0, soft * 1.6, underBorder);
    return vec3(thickness, shade, film);
  }
`;

export const pointillist: Recipe = {
  name: 'pointillist',
  index: RECIPE_INDEX.pointillist,
  glsl: GLSL,
  knobs: { gloss: 0.05, rim: 0.11, sunGlare: 0.02, envGain: 0.16 },
  slots: {
    surface: /* glsl */ `
      float cellNV = saturate(dot(recipeSmoothNormal(), normalize(vViewPosition)));
      vec3 cell = recipeBerryCell();
      // The cell colour is the reflectance: a structural colour has no
      // pigment behind it, so a wash over a dark body renders as dim
      // confetti.
      finishF0 = recipeBerryTint(cell.x, cellNV) * (finishStrength * cell.z * cell.y * 0.95);
      finishTintDepth = max(max(finishF0.r, finishF0.g), finishF0.b)
        - min(min(finishF0.r, finishF0.g), finishF0.b);
      material.diffuseColor *= 0.35;
    `,
    ambient: /* glsl */ `
      reflectedLight.indirectSpecular += finishEnv * finishF0 * (1.8 * uFinishEnv);
    `,
  },
};
