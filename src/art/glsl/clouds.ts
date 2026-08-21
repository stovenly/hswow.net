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
export const FORM = { sheet: 0, heap: 1, fibres: 2 } as const;
export type FormName = keyof typeof FORM;

export interface Genus {
  readonly level: DeckLevel;
  /** Kilometres. Sets the parallax, the apparent element size and the twilight lead. */
  readonly height: number;
  readonly form: FormName;
  /** Kilometres across one element or one billow. */
  readonly element: number;
  /** How much sky it takes at full amount, 0..1. */
  readonly cover: number;
  /** How deep the high-frequency noise eats into the edges, 0..1. */
  readonly erosion: number;
  /** How opaque the thickest part gets. */
  readonly opacity: number;
  /** How far the form is drawn out along the shear. 1 is round. */
  readonly stretch: number;
  /** How dark its own shadowed side goes, 0..1. Ice clouds barely shade at all. */
  readonly shade: number;
  /** How dark the underside is, 0..1. What says how high a deck is. */
  readonly base: number;
  /**
   * How hard the deck breaks into bands lying across the wind, 0..1. The
   * mackerel in a mackerel sky.
   */
  readonly ripple: number;
  /** Kilometres of drift per second. */
  readonly drift: number;
  /** How grey the lit colour is before the sky's own light is applied, 0..1. */
  readonly grey: number;
}

/**
 * The roster. Element sizes are in kilometres; what a viewer names a genus by is
 * the angle one element subtends, which the deck's height decides.
 *
 * The projection foreshortens: a ray at elevation t crosses the deck at
 * h/tan(t), so one element spans `element * sin(t)^2 / h` radians, not
 * `element / h`. At forty-five degrees that is half the naive figure and near
 * the horizon a small fraction of it — so an element sized for the zenith is
 * under a degree across most of the sky, and at this resolution that is not a
 * cloud, it is noise. Every size here is set from the angle wanted at
 * mid-elevation: about 2 degrees for cirrocumulus, 6 for altocumulus, 15 for
 * stratocumulus, which is the WMO ordering and the whole point of the table.
 */
export const GENERA: Record<GenusName, Genus> = {
  // Ice, thin, and drawn out to nothing: no shading, no base, eroded hard.
  cirrus: {
    level: 'high',
    height: 9,
    form: 'fibres',
    element: 5,
    cover: 0.52,
    erosion: 0.45,
    opacity: 0.6,
    stretch: 6,
    shade: 0,
    base: 0,
    ripple: 0.1,
    drift: 0.042,
    grey: 0,
  },
  // A veil over the whole sky that you notice by the halo rather than by
  // seeing it: near-total cover, almost no contrast, barely opaque.
  cirrostratus: {
    level: 'high',
    height: 8,
    form: 'sheet',
    element: 22,
    cover: 0.94,
    erosion: 0.12,
    opacity: 0.28,
    stretch: 1.6,
    shade: 0,
    base: 0,
    ripple: 0,
    drift: 0.034,
    grey: 0.04,
  },
  // Fine granulation in bands. Unshaded — its elements are too small and too
  // thin to have a dark side, which is the test that separates it from
  // altocumulus at any distance.
  cirrocumulus: {
    level: 'high',
    height: 7.5,
    form: 'heap',
    element: 0.62,
    cover: 0.62,
    erosion: 0.34,
    opacity: 0.55,
    stretch: 1.35,
    shade: 0.04,
    base: 0,
    ripple: 0.85,
    drift: 0.03,
    grey: 0.02,
  },
  // A featureless grey sheet the sun shows through as a bright patch.
  altostratus: {
    level: 'mid',
    height: 4.5,
    form: 'sheet',
    element: 13,
    cover: 0.93,
    erosion: 0.14,
    opacity: 0.85,
    stretch: 1.5,
    shade: 0.14,
    base: 0.15,
    ripple: 0,
    drift: 0.022,
    grey: 0.42,
  },
  // Rolls with a shaded side: the same billow as cirrocumulus, four kilometres
  // lower and so several times the apparent size, and shaded because at this
  // thickness the elements have a dark side.
  altocumulus: {
    level: 'mid',
    height: 4,
    form: 'heap',
    element: 0.78,
    cover: 0.66,
    erosion: 0.3,
    opacity: 0.88,
    stretch: 1.5,
    shade: 0.34,
    base: 0.2,
    ripple: 0.68,
    drift: 0.02,
    grey: 0.16,
  },
  // Large rolls with blue between them, well shaded and with a definite base.
  stratocumulus: {
    level: 'low',
    height: 1.6,
    form: 'heap',
    element: 0.85,
    cover: 0.72,
    erosion: 0.36,
    opacity: 0.96,
    stretch: 1.7,
    shade: 0.5,
    base: 0.35,
    ripple: 0.34,
    drift: 0.014,
    grey: 0.24,
  },
  // Isolated heaps: little cover, hard self-shadow, a flat dark base, and the
  // most eroded edges of anything here.
  cumulus: {
    level: 'low',
    height: 1.2,
    form: 'heap',
    element: 1.05,
    cover: 0.42,
    erosion: 0.44,
    opacity: 1,
    stretch: 1.1,
    shade: 0.6,
    base: 0.4,
    ripple: 0,
    drift: 0.012,
    grey: 0.08,
  },
  // Uniform low grey with no structure at all. Cover is total; what makes it
  // stratus rather than fog is that it has a base you can stand under.
  stratus: {
    level: 'low',
    height: 0.55,
    form: 'sheet',
    element: 9,
    cover: 0.96,
    erosion: 0.1,
    opacity: 0.94,
    stretch: 1.4,
    shade: 0.1,
    base: 0.25,
    ripple: 0.14,
    drift: 0.008,
    grey: 0.5,
  },
  // Dark, total and soft: rain falling out of the bottom of a deck blurs its
  // outline away, so nimbostratus is the one cloud with no edges to speak of.
  nimbostratus: {
    level: 'low',
    height: 0.9,
    form: 'sheet',
    element: 7,
    cover: 0.98,
    erosion: 0.08,
    opacity: 1,
    stretch: 1.3,
    shade: 0.3,
    base: 0.4,
    ripple: 0,
    drift: 0.015,
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
 * `skyDecks` is the dome's, and it is the expensive one. `skyCloudsCheap` is
 * what runs per lit fragment through `finishEnv` and per reflection miss in the
 * water — one layer, two hashes, no shading — because that path is evaluated on
 * every lit pixel in the frame and the dome's is not.
 *
 * Requires `NOISE_GLSL` and the sky's own uniforms in scope. (No backticks
 * below: this is a template literal.)
 */
export const CLOUDS_GLSL = /* glsl */ `
  #ifndef CLOUDS_INCLUDED
  #define CLOUDS_INCLUDED

  /** coverage at full amount, erosion depth, elements per kilometre, opacity. */
  uniform vec4 uDeckShape[3];
  /** height in kilometres, form code, base darkening, stretch. */
  uniform vec4 uDeckForm[3];
  /** shade, drift kilometres per second, amount, ripple. */
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

  float cloudRemap(float v, float lo, float hi) {
    return (v - lo) / (hi - lo);
  }

  /**
   * The warp. Displacing a noise field by another noise field is the single
   * thing that separates a cloud from a stain: it turns round lumps into
   * billows that curl, and it costs two lookups.
   */
  vec2 cloudWarp(vec2 p) {
    return vec2(valueNoise(p + 11.31), valueNoise(p * 1.07 + 41.77)) - 0.5;
  }

  /** Stratiform: warped masses, four octaves, soft everywhere. */
  float cloudSheet(vec2 p) {
    vec2 q = p + cloudWarp(p * 0.55) * 1.4;
    return valueNoise(q) * 0.50
      + valueNoise(q * 2.03 + 5.1) * 0.28
      + valueNoise(q * 4.11 + 9.7) * 0.15
      + valueNoise(q * 8.27 + 2.3) * 0.07;
  }

  /**
   * Cumuliform: billow noise, which is ordinary noise folded about its middle.
   * The fold is what makes the tops round and the valleys sharp, and that is
   * the whole difference between a heap of cloud and a hill of it.
   */
  float cloudHeap(vec2 p) {
    vec2 q = p + cloudWarp(p * 0.7) * 0.95;
    float sum = 0.0;
    float total = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 3; i++) {
      sum += amp * (1.0 - abs(valueNoise(q) * 2.0 - 1.0));
      total += amp;
      q = q * 2.07 + 3.13;
      amp *= 0.5;
    }
    return sum / total;
  }

  /**
   * Fibres. A cirrus streak carries its detail *along* its length and is smooth
   * across it, so stretching an isotropic field does not give one — stretching
   * lowers the detail along the streak with everything else. Sampled on an
   * anisotropic lattice instead, so the fine structure survives the stretch,
   * and bent across itself so the streaks curve rather than run parallel.
   */
  float cloudFibres(vec2 p) {
    float bend = valueNoise(p * vec2(0.22, 0.9)) - 0.5;
    vec2 q = p + vec2(0.0, bend * 2.6);
    return valueNoise(q) * 0.42
      + valueNoise(q * vec2(4.3, 1.35) + 7.1) * 0.33
      + valueNoise(q * vec2(11.7, 2.1) + 3.9) * 0.25;
  }

  float cloudForm(vec2 p, float form) {
    if (form < 0.5) return cloudSheet(p);
    if (form < 1.5) return cloudHeap(p);
    return cloudFibres(p);
  }

  /**
   * Where a view ray meets a deck, in kilometres across its plane. Rays near the
   * horizon travel much further before they arrive, so the crowding that makes a
   * deck read as a ceiling rather than a dome is the projection's own doing.
   *
   * Floored well above zero: the shared hash is a fract of a large product and
   * loses most of its precision once its input reaches the hundreds, which it
   * does within a couple of degrees of the horizon — and a hash losing
   * precision does not soften, it speckles.
   */
  vec2 cloudPlane(vec3 direction, float heightKm) {
    return (direction.xz / max(direction.y, 0.05)) * heightKm;
  }

  /**
   * One deck's colour and how much of the sky it takes.
   *
   * The uniforms arrive as arguments rather than being indexed inside: a
   * uniform array may only be subscripted by a loop index, never by a function
   * parameter, and a driver that happens to allow it is not one to rely on.
   */
  vec4 cloudDeck(vec4 shape, vec4 form, vec4 light, vec3 lit, vec3 dark,
                 vec3 direction, vec3 sunDir) {
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

    float base = cloudForm(p, form.y);

    // Rows. A mackerel sky is not scattered lumps, it is a sheet broken into
    // bands lying across the wind, and that banding is most of what a person
    // recognises altocumulus and cirrocumulus by.
    if (light.w > 0.0) {
      float lane = dot(plane, along) * shape.z;
      float wave = 0.5 + 0.5 * sin(lane * 2.1 + valueNoise(p * 0.33) * 7.0);
      base *= 1.0 - light.w * 0.55 * (1.0 - wave);
    }

    // Coverage as a remap rather than a threshold. A threshold sweeping across
    // a fixed field makes cloud appear all over the sky at once; remapping
    // grows it outward from where it already is, which is how a deck thickens,
    // and it keeps the detail as the cover climbs instead of clipping it away.
    float coverage = clamp(amount * shape.x, 0.0, 1.0);
    float density = clamp(cloudRemap(base, 1.0 - coverage, 1.0), 0.0, 1.0);
    if (density <= 0.0) return vec4(0.0);

    // Erosion. High-frequency noise eats into the edges and leaves the body
    // alone, which is what a torn cloud edge is; noise multiplied into the
    // density instead speckles the middle and reads as static. The detail
    // drifts faster than the base it sits on, so a deck evolves as it travels
    // rather than sliding past whole.
    float h = shape.y;
    if (h > 0.0) {
      float fine = cloudForm(p * 3.3 + drift * shape.z * 2.4, form.y);
      float a = fine * (1.0 - h) + h;
      density = clamp(cloudRemap(a, 1.0 - density, 1.0 - density + h), 0.0, 1.0);
      if (density <= 0.0) return vec4(0.0);
    }

    vec3 colour = lit;
    if (light.x > 0.0) {
      // Self-shadowing, as Beer's law: light falls off exponentially through
      // the depth of cloud between here and the sun, and that depth is how much
      // denser the deck is a short way along the light.
      float toward = cloudForm(p + normalize(sunDir.xz + vec2(1e-5, 0.0)) * 0.22, form.y);
      float depth = clamp((toward - base) * 2.6 + density * 0.5, 0.0, 1.0);
      colour = mix(colour, dark, (1.0 - exp(-depth * 3.0)) * light.x);

      // The powder term. Just inside a sunlit edge less light comes back out
      // than Beer's law predicts, because it has not had the depth to scatter
      // round — so a lit rim darkens slightly before it brightens. It is the
      // sugar-cube look, and it is most of what makes a cloud read as a solid
      // rather than as a decal.
      colour *= mix(1.0, 0.72 + 0.28 * (1.0 - exp(-density * 4.5)), light.x);
    }

    // Forward scattering, Henyey-Greenstein. Cloud within a few degrees of the
    // sun silvers, and nothing else in a sky says "lit from behind" so plainly.
    float cosT = dot(direction, sunDir);
    float g2 = 0.62 * 0.62;
    float phase = (1.0 - g2) / pow(1.0 + g2 - 2.0 * 0.62 * cosT, 1.5);
    colour += lit * clamp((phase - 0.4) * 0.12, 0.0, 0.5) * uSunIntensity;

    // The base. Looking toward the horizon is looking at the underside of the
    // deck, and a deck with a defined base has a dark one — which is the cue
    // that says how high it is with nothing drawn in perspective.
    if (form.z > 0.0) {
      colour = mix(colour, dark, form.z * (1.0 - smoothstep(0.12, 0.55, direction.y)));
    }

    // Faded out at the horizon, where the projection stretches to infinity and
    // the form turns to mush. The dome and the air have to agree exactly at
    // direction.y = 0, and this is what guarantees it.
    return vec4(colour, density * shape.w * smoothstep(0.0, 0.12, direction.y));
  }

  /** The three decks over whatever the gradient already painted. High first. */
  vec3 skyDecks(vec3 direction, vec3 base) {
    vec3 sunDir = normalize(uSunDirection);
    vec3 colour = base;
    for (int i = 0; i < 3; i++) {
      vec4 deck = cloudDeck(uDeckShape[i], uDeckForm[i], uDeckLight[i],
        uDeckLit[i], uDeckShade[i], direction, sunDir);
      colour = mix(colour, deck.rgb, deck.a);
    }
    return colour;
  }

  /** One layer, no shading. Everything that is not the dome uses this. */
  vec3 skyCloudsCheap(vec3 direction, vec3 base) {
    if (uSkyCover <= 0.001 || direction.y <= 0.0) return base;
    vec2 p = cloudPlane(direction, 2.0) * uSkyCheapScale + uCloudWind * (uCloudTime * 0.008);
    float density = valueNoise(p) * 0.62 + valueNoise(p * 2.3 + 11.7) * 0.38;
    float amount = clamp(cloudRemap(density, 1.0 - uSkyCover, 1.0), 0.0, 1.0)
      * smoothstep(0.0, 0.12, direction.y);
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
