import type { Recipe } from './types';

const GLSL = /* glsl */ `
  // --- stained glass --------------------------------------------------------
  //
  // Bragg stacks whose layer thickness differs cell to cell. Cells come from a
  // Worley lattice and are shaded as domes, so they interlock instead of
  // tiling, and the gap to the runner-up site draws the came between them.
  //
  // It was called pointillist, after what the field is; it is named after what
  // it *looks* like now, which is the more useful of the two once there are six
  // of them. The optics are a marble berry's and the read is a leaded window's.

  /** Cells per metre, as a multiple of the default 26. */
  float stainedDensity() { return recipeVar.y; }
  /** How heavy the came between cells reads. */
  float stainedLead() { return recipeVar.z; }
  /** How often a cell catches the light on its own. */
  float stainedFlash() { return recipeVar.w; }

  /** Thicker stacks run redder, and a grazing view thins what it looks through. */
  vec3 recipeStainedTint(float thickness, float smoothNV) {
    return rampColour(recipeRamp(), saturate(thickness - (1.0 - smoothNV) * 0.20));
  }

  /** (stack thickness, dome shading, how much film the cell carries). */
  vec3 recipeStainedCell() {
    // One lattice, fixed to the surface, at every distance. Coarsening it would
    // regenerate the whole skin rather than simplifying it, since the hash is
    // taken at the scaled position — so the material keeps its close-range look
    // all the way out and lets the sampling fall where it falls.
    //
    // **A per-variant density is not that, and the distinction matters.** What
    // POINTILLIST-POP-FIX.md rejected was density changing *with distance*, one
    // material regenerating its own skin as you walked toward it. This is chosen
    // once for a material and never moves, which is the ordinary business of
    // being a different material. Do not put a footprint term back in here.
    float density = 26.0 * stainedDensity();

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
    float flash = step(1.0 - 0.015 * stainedFlash(), alt.z)
      * pow(0.5 + 0.5 * sin(recipeTime() * (0.6 + alt.x * 0.8) + draw.x * 6.2831853), 8.0);
    shade += flash * 0.4;
    float film = alt.y > 0.97 ? 0.30 : 1.0;
    // The polygon edge, and a fainter one from the layer beneath showing
    // through. Widened by the came weight, which is the only thing separating a
    // window from a mosaic once the colours are chosen.
    float came = soft * stainedLead();
    film *= 0.30 + 0.70 * smoothstep(0.0, came, border);
    film *= 0.80 + 0.20 * smoothstep(0.0, came * 1.6, underBorder);
    return vec3(thickness, shade, film);
  }
`;

export const stainedGlass: Recipe = {
  name: 'stainedGlass',
  glsl: GLSL,
  params: ['density', 'lead', 'flash'],
  variants: [
    {
      // The blues and teals the field was tuned against, at the density it was
      // tuned at. The identity row.
      name: 'oceanglass',
      ramp: 'oceanglass',
      knobs: { gloss: 0.05, rim: 0.11, sunGlare: 0.02, envGain: 0.16 },
      params: [1.0, 1.0, 1.0],
    },
    {
      // West light: reds and golds, with the deep magenta real pot-metal glass
      // goes where it is thick.
      name: 'rosewindow',
      ramp: 'rosewindow',
      knobs: { gloss: 0.05, rim: 0.11, sunGlare: 0.03, envGain: 0.16 },
      params: [1.0, 1.0, 1.0],
    },
    {
      name: 'ivyglass',
      ramp: 'ivyglass',
      knobs: { gloss: 0.05, rim: 0.11, sunGlare: 0.02, envGain: 0.16 },
      params: [1.0, 1.0, 1.0],
    },
    {
      // Two colours and no middle, so the came has to be heavier — a hard
      // colour boundary with a thin line on it reads as an error rather than
      // as lead.
      name: 'lapispane',
      ramp: 'lapispane',
      knobs: { gloss: 0.04, rim: 0.14, sunGlare: 0.02, envGain: 0.18 },
      params: [1.0, 1.25, 0.6],
    },
  ],
  slots: {
    surface: /* glsl */ `
      float cellNV = saturate(dot(recipeSmoothNormal(), normalize(vViewPosition)));
      vec3 cell = recipeStainedCell();
      // The cell colour is the reflectance: a structural colour has no
      // pigment behind it, so a wash over a dark body renders as dim
      // confetti.
      finishF0 = recipeStainedTint(cell.x, cellNV) * (finishStrength * cell.z * cell.y * 0.95);
      finishTintDepth = max(max(finishF0.r, finishF0.g), finishF0.b)
        - min(min(finishF0.r, finishF0.g), finishF0.b);
      material.diffuseColor *= 0.35;
    `,
    ambient: /* glsl */ `
      reflectedLight.indirectSpecular += finishEnv * finishF0 * (1.8 * uFinishEnv);
    `,
  },
};
