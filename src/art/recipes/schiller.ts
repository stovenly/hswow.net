import type { Recipe } from './types';

const GLSL = /* glsl */ `
  // --- schiller: labradorite ------------------------------------------------
  //
  // Twinned domains, each a stack of lamellae at its own angle inside the
  // crystal. A domain floods when the light and the eye straddle *its* plane,
  // which is independent of the surface — so the flood is smooth across facets
  // and different domains answer all over the stone at once.

  /** How fine the domains are. Bigger is more of them, each smaller. */
  float schillerDomain() { return recipeVar.y; }
  /** How wide the alignment window is — how much of the stone is alight. */
  float schillerBand() { return recipeVar.z; }
  /** Lamella pitch inside a domain: the fine structure over the flood. */
  float schillerPitch() { return recipeVar.w; }

  /** The domain field, warped so boundaries interlock rather than tile. */
  vec2 recipePlates() {
    vec3 w = recipeWarp(vWearPos, 3.1, 0.16, 0.02) * schillerDomain();
    return vec2(wearNoise(w * 7.5 + 3.1), wearNoise(w * 12.0 + 11.7));
  }

  /** Darkening where two domains meet. */
  float recipeSchillerSeam() {
    vec2 f = recipePlates();
    float seam = smoothstep(0.06, 0.0, abs(fract(f.x * 6.0) - 0.5) - 0.44)
      + smoothstep(0.06, 0.0, abs(fract(f.y * 5.0) - 0.5) - 0.44);
    return 1.0 - 0.30 * saturate(seam);
  }

  /** One scale of domain. */
  vec3 recipeSchillerScale(vec3 driveObj, vec2 field, float coarseness, float bandGain) {
    float plate = floor(field.x * 6.0) * 11.0 + floor(field.y * 5.0);
    vec3 draw = finishHash3(vec3(plate, plate * 0.37 + 1.3, plate * 1.71 + 7.9));
    vec3 alt = finishHash3(vec3(plate * 2.11 + 5.7, plate * 0.53, plate * 1.29 + 19.3));
    float t = recipeTime();

    // The domain's plane, precessing slowly so floods travel rather than blink.
    vec3 plane = normalize(draw * 2.0 - 1.0 + vec3(0.0, 0.0013, 0.0));
    plane = normalize(plane + vec3(
      sin(t * 0.13 + draw.x * 6.2831853),
      sin(t * 0.11 + draw.y * 6.2831853),
      sin(t * 0.09 + draw.z * 6.2831853)
    ) * 0.11);

    // A band, not a threshold: each domain answers at its own angle, so only a
    // fraction are alight at any moment. Two unrelated clocks move the band.
    float align = abs(dot(plane, driveObj));
    float centre = 0.34 + draw.x * 0.55
      + sin(t * 0.10 + vWearPos.y * 2.4 + vObjectPhase * 6.2831853) * 0.045
      + sin(t * (0.21 + alt.y * 0.3) + draw.z * 6.2831853) * 0.035;
    float width = (0.05 + alt.x * 0.07) * bandGain * schillerBand();

    float away = abs(align - centre) / width;
    if (away >= 1.0) return vec3(0.0);
    float lit = 1.0 - away * away;
    lit = lit * lit * (0.55 + 0.45 * lit);

    // Lamellae along the plate's own normal, with a finer cross-set over them.
    float pitch = (120.0 + alt.y * 150.0) * coarseness * schillerPitch();
    float sheets = 0.5 + 0.5 * sin(dot(vWearPos, plane) * pitch + alt.z * 6.2831853);
    vec3 across = normalize(cross(plane, vec3(0.37, 0.86, 0.35)));
    float weave = 0.5 + 0.5 * sin(dot(vWearPos, across) * pitch * 2.3 + 1.7);
    float structure = 0.72 + 0.20 * sheets + 0.08 * weave;
    structure = mix(1.0, structure, 1.0 - smoothstep(0.004, 0.017, recipeFootprint()));

    // Fringes run a little further round the wheel than the core of a flood.
    vec3 tint = rampColour(recipeRamp(), fract(draw.y + draw.z * 0.31 + (1.0 - lit) * 0.10));
    return tint * (lit * structure);
  }

  /**
   * The flood: coarse domains, a finer set inside them, and a faint sheen
   * everywhere so the rock between floods is never plain dead grey.
   */
  vec3 recipeSchiller(vec3 driveObj) {
    float grain = schillerDomain();
    vec3 wCoarse = recipeWarp(vWearPos, 3.1, 0.16, 0.02) * grain;
    vec2 coarse = vec2(wearNoise(wCoarse * 7.5 + 3.1), wearNoise(wCoarse * 12.0 + 11.7));
    vec3 wFine = recipeWarp(vWearPos, 6.2, 0.09, 0.035) * grain;
    vec2 fine = vec2(wearNoise(wFine * 19.0 + 27.3), wearNoise(wFine * 31.0 + 5.9));

    vec3 flood = recipeSchillerScale(driveObj, coarse, 1.0, 1.0)
      + recipeSchillerScale(driveObj, fine, 2.1, 1.5) * 0.28;

    // A low sheen over the whole stone, from the coarse field's own plane: a
    // labradorite that is not flooding still catches light off its twins.
    float base = 0.5 + 0.5 * sin(dot(vWearPos, normalize(vec3(coarse, 0.5) * 2.0 - 1.0)) * 40.0);
    vec3 rest = rampColour(recipeRamp(), fract(coarse.x * 3.0 + 0.2))
      * (0.055 + 0.05 * base) * (0.35 + 0.65 * abs(driveObj.y));
    return flood + rest;
  }
`;

export const schiller: Recipe = {
  name: 'schiller',
  glsl: GLSL,
  params: ['domain', 'band', 'pitch'],
  variants: [
    {
      // The stone the field was written for. Every number here is 1: this is
      // the row the params were factored out *of*, so it has to be the identity
      // or the factoring was wrong.
      name: 'labradorite',
      ramp: 'labrador',
      // No surface shine at all: the flood is the only light schiller returns,
      // so the stone reads as colour inside rather than gloss on top.
      knobs: { gloss: 0, rim: 0, sunGlare: 0, envGain: 0.02 },
      params: [1.0, 1.0, 1.0],
    },
    {
      // Wider bands, so several domains are alight at once and the stone is
      // never dark. With the full-wheel ramp behind it this is the one that
      // stops reading as rock and starts reading as a jewel.
      name: 'spectrolite',
      ramp: 'spectrolite',
      knobs: { gloss: 0, rim: 0.04, sunGlare: 0, envGain: 0.05 },
      params: [0.85, 1.8, 0.9],
    },
    {
      // Coarse domains and a narrow band: one broad sheet lights at a time and
      // travels across the stone as you move, which is adularescence rather
      // than schiller. The pitch is dropped with it — fine lamellae inside one
      // big sheet read as fabric.
      name: 'moonsheen',
      ramp: 'moonsheen',
      knobs: { gloss: 0.05, rim: 0.08, sunGlare: 0, envGain: 0.10 },
      params: [0.6, 0.5, 0.7],
    },
    {
      // The opposite end: many small domains, tight bands, fine lamellae. The
      // flood breaks into glitter, which is what aventurescence is — platelets
      // rather than twins.
      name: 'sunstone',
      ramp: 'sunstone',
      knobs: { gloss: 0.08, rim: 0.05, sunGlare: 0.04, envGain: 0.08 },
      params: [2.2, 0.9, 1.6],
    },
  ],
  slots: {
    body: /* glsl */ `
      material.diffuseColor *= recipeSchillerSeam();
    `,
    direct: /* glsl */ `
      // Kneed: a domain at its brightest is deep saturated blue, never
      // white. Off the smooth normal so no facet shapes the flood.
      reflectedLight.directSpecular += recipeKnee(
        directLight.color * recipeSchiller(halfObj) * (smoothNL * 1.5), 0.55
      ) * uFinishSpecular;
    `,
    ambient: /* glsl */ `
      reflectedLight.indirectSpecular += recipeKnee(
        neutral * recipeSchiller(vRecipeView) * 1.15, 0.50
      ) * uFinishEnv;
    `,
  },
};
