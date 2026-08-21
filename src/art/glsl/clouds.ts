/**
 * Cloud decks: three layers composited high to low, each a row of the genus
 * table rather than a shader of its own. A genus is data — a height, a form, an
 * element size and how hard it shades itself — so a new one costs a row.
 */

export type GenusName =
  | 'cirrus'
  | 'cirrostratus'
  | 'cirrocumulus'
  | 'altostratus'
  | 'altocumulus'
  | 'stratocumulus'
  | 'cumulus'
  | 'stratus'
  | 'nimbostratus';

/** Which of the three slots a genus occupies. One genus per slot at a time. */
export type DeckLevel = 'high' | 'mid' | 'low';

/** Which form function draws it. The shader branches on this as a float. */
export const FORM = { sheet: 0, cells: 1, fibres: 2 } as const;
export type FormName = keyof typeof FORM;

export interface Genus {
  readonly level: DeckLevel;
  /** Kilometres. Sets the parallax, the apparent element size and the twilight lead. */
  readonly height: number;
  readonly form: FormName;
  /** Kilometres across one element or one billow. */
  readonly element: number;
  /** Threshold on the form at full amount. Higher leaves more blue. */
  readonly cover: number;
  /** Edge hardness. Small is cut-out; large is a haze with no edge at all. */
  readonly softness: number;
  /** How opaque the thickest part gets. */
  readonly opacity: number;
  /** How far the form is drawn out along the shear. 1 is round. */
  readonly stretch: number;
  /** How dark its own shadowed side goes, 0..1. Ice clouds barely shade at all. */
  readonly shade: number;
  /** How much high-frequency ragging is added to the form, 0..1. */
  readonly detail: number;
  /** Kilometres of drift per second. */
  readonly drift: number;
  /** How grey the lit colour is before the sky's own light is applied, 0..1. */
  readonly grey: number;
}

/**
 * The roster. Element sizes are in kilometres and the apparent size a viewer
 * judges genus by falls out of the height: 0.12 km at 7.5 km subtends under a
 * degree and is cirrocumulus, the same billow at 1.6 km subtends ten and is
 * stratocumulus. That is the WMO distinction, and here it is arithmetic.
 */
export const GENERA: Record<GenusName, Genus> = {
  cirrus: {
    level: 'high',
    height: 9,
    form: 'fibres',
    element: 5,
    cover: 0.56,
    softness: 0.3,
    opacity: 0.55,
    stretch: 6,
    shade: 0,
    detail: 0.5,
    drift: 0.02,
    grey: 0,
  },
  cirrostratus: {
    level: 'high',
    height: 8,
    form: 'sheet',
    element: 22,
    cover: 0.3,
    softness: 0.45,
    opacity: 0.3,
    stretch: 1.6,
    shade: 0,
    detail: 0.2,
    drift: 0.016,
    grey: 0.04,
  },
  cirrocumulus: {
    level: 'high',
    height: 7.5,
    form: 'cells',
    element: 0.12,
    cover: 0.42,
    softness: 0.22,
    opacity: 0.5,
    stretch: 1.35,
    shade: 0.06,
    detail: 0.35,
    drift: 0.014,
    grey: 0.02,
  },
  altostratus: {
    level: 'mid',
    height: 4.5,
    form: 'sheet',
    element: 13,
    cover: 0.24,
    softness: 0.4,
    opacity: 0.82,
    stretch: 1.5,
    shade: 0.12,
    detail: 0.25,
    drift: 0.01,
    grey: 0.42,
  },
  altocumulus: {
    level: 'mid',
    height: 4,
    form: 'cells',
    element: 0.25,
    cover: 0.45,
    softness: 0.2,
    opacity: 0.85,
    stretch: 1.5,
    shade: 0.3,
    detail: 0.4,
    drift: 0.009,
    grey: 0.16,
  },
  stratocumulus: {
    level: 'low',
    height: 1.6,
    form: 'cells',
    element: 0.35,
    cover: 0.4,
    softness: 0.16,
    opacity: 0.95,
    stretch: 1.7,
    shade: 0.45,
    detail: 0.45,
    drift: 0.006,
    grey: 0.24,
  },
  cumulus: {
    level: 'low',
    height: 1.2,
    form: 'sheet',
    element: 0.75,
    cover: 0.62,
    softness: 0.1,
    opacity: 1,
    stretch: 1.1,
    shade: 0.55,
    detail: 0.55,
    drift: 0.005,
    grey: 0.08,
  },
  stratus: {
    level: 'low',
    height: 0.55,
    form: 'sheet',
    element: 9,
    cover: 0.16,
    softness: 0.5,
    opacity: 0.92,
    stretch: 1.4,
    shade: 0.1,
    detail: 0.2,
    drift: 0.004,
    grey: 0.5,
  },
  nimbostratus: {
    level: 'low',
    height: 0.9,
    form: 'sheet',
    element: 7,
    cover: 0.1,
    softness: 0.45,
    opacity: 1,
    stretch: 1.3,
    shade: 0.28,
    detail: 0.35,
    drift: 0.007,
    grey: 0.72,
  },
};

export const DECK_LEVELS: readonly DeckLevel[] = ['high', 'mid', 'low'];

/**
 * How far below the horizon the sun can sit and still light a deck at this
 * height, in degrees. The geometric dip, `acos(R / (R + h))` — three degrees for
 * cirrus and barely one for stratus, which is the whole reason high cloud burns
 * after the low cloud has gone flat grey.
 */
export function twilightLead(heightKm: number): number {
  const R = 6371;
  return (Math.acos(R / (R + heightKm)) * 180) / Math.PI;
}

/**
 * The decks, and the cheap single-layer stand-in beside them.
 *
 * `skyDecks` is the dome's, and it is the expensive one: three forms, each
 * sampled twice where the deck shades itself. `skyCloudsCheap` is what runs per
 * lit fragment through `finishEnv` and per reflection miss in the water — one
 * layer, two hashes, no shading — because that path is evaluated on every lit
 * pixel in the frame and the dome's is not.
 *
 * Requires `NOISE_GLSL` and the sky's own uniforms in scope. (No backticks
 * below: this is a template literal.)
 */
export const CLOUDS_GLSL = /* glsl */ `
  #ifndef CLOUDS_INCLUDED
  #define CLOUDS_INCLUDED

  /** cover, softness, elements per kilometre, opacity. */
  uniform vec4 uDeckShape[3];
  /** height in kilometres, form code, detail, stretch. */
  uniform vec4 uDeckForm[3];
  /** shade, drift kilometres per second, amount, 0. */
  uniform vec4 uDeckLight[3];
  uniform vec3 uDeckLit[3];
  uniform vec3 uDeckShade[3];
  /** Unit vector the decks travel along, in world xz. */
  uniform vec2 uCloudWind;
  uniform float uCloudTime;
  /** Total sky covered, and the one colour the cheap path paints it. */
  uniform float uSkyCover;
  uniform vec3 uSkyCloudColour;
  uniform float uSkyCheapScale;

  vec2 cloudHash2(vec2 p) {
    return vec2(hash(p), hash(p + 37.19));
  }

  /** Discrete elements: mackerel sky, and the base of every cumuliform deck. */
  float cloudCells(vec2 p) {
    vec2 cell = floor(p);
    vec2 f = fract(p);
    float best = 2.0;
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 o = vec2(float(i), float(j));
        vec2 jitter = cloudHash2(cell + o);
        best = min(best, length(o + jitter - f));
      }
    }
    // Inverted, so a cell centre is dense and the lanes between them are sky.
    return clamp(1.0 - best * 1.15, 0.0, 1.0);
  }

  /**
   * Fibres: fbm drawn out hard along one axis and then domain-warped across it,
   * which is what makes a cirrus streak bend rather than merely stretch.
   */
  float cloudFibres(vec2 p) {
    float warp = valueNoise(p * vec2(0.35, 1.1));
    return fbm(p + vec2(0.0, (warp - 0.5) * 2.2));
  }

  float cloudForm(vec2 p, float form, float detail) {
    float base;
    if (form < 0.5) base = fbm(p);
    else if (form < 1.5) base = cloudCells(p);
    else base = cloudFibres(p);
    if (detail > 0.0) base = mix(base, base * (0.55 + 0.9 * valueNoise(p * 4.7)), detail);
    return base;
  }

  /**
   * Where a view ray meets a deck, in kilometres across its plane. Rays near the
   * horizon travel much further before they arrive, so the crowding that makes a
   * deck read as a ceiling rather than a dome is the projection's own doing.
   */
  vec2 cloudPlane(vec3 direction, float heightKm) {
    return (direction.xz / max(direction.y, 0.02)) * heightKm;
  }

  /**
   * One deck's colour and how much of the sky it takes. The uniforms arrive as
   * arguments rather than being indexed inside: a uniform array may only be
   * subscripted by a loop index, never by a function parameter, and a driver
   * that happens to allow it is not one to rely on.
   *
   * sunward is the unit xz step toward the sun, used to sample the form a short
   * way along the light and shade whatever stands behind denser cloud.
   */
  vec4 cloudDeck(vec4 shape, vec4 form, vec4 light, vec3 lit, vec3 dark,
                 vec3 direction, vec2 sunward) {
    float amount = light.z;
    if (amount <= 0.001 || direction.y <= 0.0) return vec4(0.0);

    vec2 drift = uCloudWind * (uCloudTime * light.y);
    vec2 plane = cloudPlane(direction, form.x) + drift;
    // Stretched across the wind rather than along it: a sheared deck lies in
    // bands at right angles to the shear, which is what banners a cirrus field.
    vec2 along = uCloudWind;
    vec2 across = vec2(-uCloudWind.y, uCloudWind.x);
    vec2 sheared = along * (dot(plane, along) / max(form.w, 0.05)) + across * dot(plane, across);
    vec2 p = sheared * shape.z;

    float density = cloudForm(p, form.y, form.z);
    // Cover opens as the amount climbs, so a deck arrives by taking more sky
    // rather than by fading up out of nothing.
    float threshold = mix(1.05, shape.x, amount);
    float mask = smoothstep(threshold, threshold + shape.y, density);
    if (mask <= 0.0) return vec4(0.0);

    vec3 colour = lit;
    if (light.x > 0.0) {
      // Self-shadowing: denser cloud a short way toward the sun means this part
      // is behind it. One extra form evaluation, and the term that separates a
      // modelled cumulus from a white stain.
      float toward = cloudForm(p + sunward * (shape.z * form.x * 0.06), form.y, form.z);
      colour = mix(colour, dark, clamp((toward - density) * 2.6, 0.0, 1.0) * light.x);
      // And the base, shaded whatever the sun is doing: the deeper into the
      // deck the ray goes, the less of the top gets out of the bottom.
      colour = mix(colour, dark, clamp(density - shape.x, 0.0, 1.0) * light.x * 0.7);
    }

    // Faded out at the horizon, where the projection stretches to infinity and
    // the form turns to mush. The dome and the air have to agree exactly at
    // direction.y = 0, and this is what guarantees it.
    return vec4(colour, mask * shape.w * smoothstep(0.0, 0.14, direction.y));
  }

  /** The three decks over whatever the gradient already painted. High first. */
  vec3 skyDecks(vec3 direction, vec3 base) {
    vec2 sunward = normalize(uSunDirection.xz + vec2(1e-5, 0.0));
    vec3 colour = base;
    for (int i = 0; i < 3; i++) {
      vec4 deck = cloudDeck(uDeckShape[i], uDeckForm[i], uDeckLight[i],
        uDeckLit[i], uDeckShade[i], direction, sunward);
      colour = mix(colour, deck.rgb, deck.a);
    }
    return colour;
  }

  /** One layer, no shading. Everything that is not the dome uses this. */
  vec3 skyCloudsCheap(vec3 direction, vec3 base) {
    if (uSkyCover <= 0.001 || direction.y <= 0.0) return base;
    vec2 p = cloudPlane(direction, 2.0) * uSkyCheapScale + uCloudWind * (uCloudTime * 0.008);
    float density = valueNoise(p) * 0.62 + valueNoise(p * 2.3 + 11.7) * 0.38;
    float threshold = mix(1.0, 0.28, uSkyCover);
    float amount = smoothstep(threshold, threshold + 0.22, density)
      * smoothstep(0.0, 0.14, direction.y);
    return mix(base, uSkyCloudColour, amount);
  }

  #endif
`;

/**
 * What a lit fragment reads to find out whether a cloud is between it and the
 * sun. The low deck only, two octaves, no shading — a shadow is a shape on the
 * ground and does not need the deck's own modelling. Requires `NOISE_GLSL`.
 */
export const CLOUD_SHADOW_GLSL = /* glsl */ `
  #ifndef CLOUD_SHADOW_INCLUDED
  #define CLOUD_SHADOW_INCLUDED

  /** Strength, elements per kilometre, deck height in kilometres, drift. */
  uniform vec4 uCloudShadow;

  /**
   * The position is world metres and the deck is in kilometres, so the throw
   * from the ground up to it is scaled on the way. Zero strength is one compare
   * and no noise at all.
   */
  float cloudShadowAt(vec3 at, vec3 toSun) {
    if (uCloudShadow.x <= 0.001 || toSun.y <= 0.05) return 1.0;
    vec3 up = at * 0.001 + toSun * ((uCloudShadow.z - at.y * 0.001) / toSun.y);
    vec2 p = up.xz * uCloudShadow.y + uCloudWind * (uCloudTime * uCloudShadow.w);
    float density = valueNoise(p) * 0.62 + valueNoise(p * 2.4 + 5.3) * 0.38;
    return 1.0 - smoothstep(0.42, 0.72, density) * uCloudShadow.x;
  }

  #endif
`;
