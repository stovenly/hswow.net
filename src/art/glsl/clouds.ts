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
  /**
   * How hard it throws light forward, 0..1. Ice scatters forward far harder
   * than water, so a cirrus field near the sun burns where a low deck only
   * brightens.
   */
  readonly glow: number;
  /** How dark the underside is, 0..1. What says how high a deck is. */
  readonly base: number;
  /**
   * How hard the deck breaks into bands lying across the wind, 0..1. The
   * mackerel in a mackerel sky.
   */
  readonly ripple: number;
  /** How grey the lit colour is before the sky's own light is applied, 0..1. */
  readonly grey: number;
  /**
   * Kilometres from the base to the top. The low deck is marched through
   * rather than projected, and this is the slab it is marched through; the
   * high and mid decks are genuinely thin sheets and it is unused there.
   */
  readonly thickness: number;
  /**
   * How far the top climbs where there is more cloud, 0..1. What separates a
   * heap that towers over its own gaps from a sheet of even depth.
   */
  readonly swell: number;
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
    cover: 0.58,
    erosion: 0.45,
    opacity: 0.72,
    stretch: 2.4,
    shade: 0,
    glow: 1.0,
    base: 0,
    ripple: 0.1,
    grey: 0,
    thickness: 0.2,
    swell: 0,
  },
  // A veil over the whole sky that you notice by the halo rather than by
  // seeing it: near-total cover, almost no contrast, barely opaque.
  cirrostratus: {
    level: 'high',
    height: 8,
    form: 'sheet',
    element: 22,
    cover: 0.94,
    erosion: 0.08,
    opacity: 0.42,
    stretch: 1.6,
    shade: 0,
    glow: 0.85,
    base: 0,
    ripple: 0,
    grey: 0.04,
    thickness: 0.3,
    swell: 0,
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
    glow: 0.7,
    base: 0,
    ripple: 0.85,
    grey: 0.02,
    thickness: 0.4,
    swell: 0.1,
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
    glow: 0.45,
    base: 0.15,
    ripple: 0,
    grey: 0.42,
    thickness: 0.8,
    swell: 0.05,
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
    glow: 0.4,
    base: 0.2,
    ripple: 0.68,
    grey: 0.16,
    thickness: 0.6,
    swell: 0.3,
  },
  // Large rolls with blue between them, well shaded and with a definite base.
  stratocumulus: {
    level: 'low',
    height: 1.2,
    form: 'heap',
    element: 0.85,
    cover: 0.72,
    erosion: 0.36,
    opacity: 0.96,
    stretch: 1.7,
    shade: 0.5,
    glow: 0.3,
    base: 0.35,
    ripple: 0.34,
    grey: 0.24,
    thickness: 0.85,
    swell: 0.55,
  },
  // Isolated heaps: little cover, hard self-shadow, a flat dark base, and the
  // most eroded edges of anything here.
  cumulus: {
    level: 'low',
    height: 1.1,
    form: 'heap',
    element: 1.05,
    cover: 0.42,
    erosion: 0.44,
    opacity: 1,
    stretch: 1.1,
    shade: 0.6,
    glow: 0.35,
    base: 0.4,
    ripple: 0,
    grey: 0.08,
    thickness: 1.9,
    swell: 1.0,
  },
  // Uniform low grey with no structure at all. Cover is total; what makes it
  // stratus rather than fog is that it has a base you can stand under.
  stratus: {
    level: 'low',
    height: 0.4,
    form: 'sheet',
    element: 9,
    cover: 0.96,
    erosion: 0.1,
    opacity: 0.94,
    stretch: 1.4,
    shade: 0.1,
    glow: 0.2,
    base: 0.25,
    ripple: 0.14,
    grey: 0.5,
    thickness: 0.35,
    swell: 0.05,
  },
  // Dark, total and soft: rain falling out of the bottom of a deck blurs its
  // outline away, so nimbostratus is the one cloud with no edges to speak of.
  nimbostratus: {
    level: 'low',
    height: 0.8,
    form: 'sheet',
    element: 7,
    cover: 0.98,
    erosion: 0.08,
    opacity: 1,
    stretch: 1.3,
    shade: 0.3,
    glow: 0.15,
    base: 0.4,
    ripple: 0,
    grey: 0.72,
    thickness: 2.7,
    swell: 0.15,
  },
};

export const DECK_LEVELS: readonly DeckLevel[] = ['high', 'mid', 'low'];

/**
 * The wind a deck at this height is in. There is one wind, and a cloud does not
 * have a speed of its own — it goes at the speed of the air it is in, and that
 * air is not the air at head height.
 *
 * Speed grows with height and the bearing veers clockwise with it, both of
 * which are what the real profile does: the surface drags on the bottom of the
 * atmosphere and the Coriolis turn is what is left once that drag lets go. It
 * is also why a cirrus deck can race across a still afternoon, which looks like
 * an inconsistency and is not one.
 *
 * `surface` is the 0..1 gust-field strength. Returns kilometres per second and
 * a bearing in radians.
 */
export function windAtHeight(
  surface: number,
  bearing: number,
  heightKm: number,
): { speed: number; bearing: number } {
  // Two to eighteen metres a second at head height, and about five times that
  // at nine kilometres.
  const ground = 2 + surface * 16;
  return {
    speed: (ground * (1 + heightKm * 0.5)) / 1000,
    // Around three and a half degrees a kilometre, levelling off high up.
    bearing: bearing + Math.min(heightKm, 10) * 0.062,
  };
}

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
  /** shade, forward-scatter gain, amount, ripple. */
  uniform vec4 uDeckLight[3];
  /** Each deck's own wind, in kilometres per second across its plane. */
  uniform vec2 uDeckWind[3];
  uniform vec3 uDeckLit[3];
  uniform vec3 uDeckShade[3];
  /**
   * The low deck's wind, in kilometres per second. What the cheap path and the
   * ground shadow both use — a shadow has to slide at the speed of the cloud
   * casting it, not at some speed of its own.
   */
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
    // Bent first, by a field that varies slowly along the streak and slowly
    // across it, so the strands curve and hook the way a fallstreak does
    // instead of running like ruled lines.
    float bend = valueNoise(vec2(p.x * 0.5, p.y * 0.22)) - 0.5;
    float y = p.y + bend * 2.9;
    // Every octave is far finer across the streak than along it, and that
    // ratio is the whole of what a fibre is. Stretching an isotropic field
    // cannot produce it: stretching lowers the detail along the streak by
    // exactly as much as it lengthens it, and what comes out is a smear.
    float strand = valueNoise(vec2(p.x * 0.55, y * 2.6)) * 0.50
      + valueNoise(vec2(p.x * 1.5, y * 6.1) + 7.31) * 0.30
      + valueNoise(vec2(p.x * 3.7, y * 14.0) + 3.17) * 0.20;
    // A streak thins and gathers along its own length. Without this a cirrus
    // field reads as combed hair.
    float gather = valueNoise(vec2(p.x * 0.85, y * 0.35) + 21.7);
    return strand * (0.52 + 0.72 * gather);
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
  vec4 cloudDeck(vec4 shape, vec4 form, vec4 light, vec2 wind, vec3 lit, vec3 dark,
                 vec3 direction, vec3 sunDir) {
    float amount = light.z;
    if (amount <= 0.001 || direction.y <= 0.0) return vec4(0.0);

    vec2 drift = wind * uCloudTime;
    vec2 plane = cloudPlane(direction, form.x) + drift;
    // Stretched across the wind rather than along it: a sheared deck lies in
    // bands at right angles to the shear, which is what banners a cirrus field.
    // Turned into the wind's own frame, not merely stretched in world space.
    // The old form rebuilt a world-axis vector after dividing one component,
    // which stretches an isotropic field correctly and leaves an anisotropic
    // one pointing the wrong way — so a fibre could never lie along the wind
    // however hard it was drawn out.
    vec2 along = normalize(wind + vec2(1e-6, 0.0));
    vec2 across = vec2(-along.y, along.x);
    vec2 p = vec2(dot(plane, along) / max(form.w, 0.05), dot(plane, across)) * shape.z;

    float base = cloudForm(p, form.y);

    // Rows. A mackerel sky is not scattered lumps, it is a sheet broken into
    // bands lying across the wind, and that banding is most of what a person
    // recognises altocumulus and cirrocumulus by.
    if (light.w > 0.0) {
      float lane = p.x * max(form.w, 0.05);
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
    // drifts a little faster than the base it sits on, so a deck evolves as it
    // travels rather than sliding past whole — but only a little, because it
    // is sampled at three times the frequency and any more of a difference
    // shimmers rather than evolves.
    float h = shape.y;
    if (h > 0.0) {
      float fine = cloudForm(p * 3.3 + drift * shape.z * 1.35, form.y);
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

    // Forward scattering, Henyey-Greenstein, at the deck's own gain. Ice
    // throws light forward far harder than water does, which is why a cirrus
    // field near the sun burns and a stratocumulus deck merely brightens.
    float cosT = dot(direction, sunDir);
    float g2 = 0.62 * 0.62;
    float phase = (1.0 - g2) / pow(1.0 + g2 - 2.0 * 0.62 * cosT, 1.5);
    colour += lit * clamp((phase - 0.35) * 0.17, 0.0, 0.7) * uSunIntensity * light.y;

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

  /**
   * The high and mid decks over whatever the gradient already painted, furthest
   * first. The low deck is not here: it has real depth and is marched.
   */
  vec3 skyDecks(vec3 direction, vec3 base) {
    vec3 sunDir = normalize(uSunDirection);
    vec3 colour = base;
    for (int i = 0; i < 2; i++) {
      vec4 deck = cloudDeck(uDeckShape[i], uDeckForm[i], uDeckLight[i], uDeckWind[i],
        uDeckLit[i], uDeckShade[i], direction, sunDir);
      colour = mix(colour, deck.rgb, deck.a);
    }
    return colour;
  }

  /** One layer, no shading. Everything that is not the dome uses this. */
  vec3 skyCloudsCheap(vec3 direction, vec3 base) {
    if (uSkyCover <= 0.001 || direction.y <= 0.0) return base;
    vec2 p = (cloudPlane(direction, 2.0) + uCloudWind * uCloudTime) * uSkyCheapScale;
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

  /** Strength, elements per kilometre, deck height in kilometres, spare. */
  uniform vec4 uCloudShadow;

  /**
   * The position is world metres and the deck is in kilometres, so the throw
   * from the ground up to it is scaled on the way. Zero strength is one compare
   * and no noise at all.
   */
  float cloudShadowAt(vec3 at, vec3 toSun) {
    if (uCloudShadow.x <= 0.001 || toSun.y <= 0.05) return 1.0;
    vec3 up = at * 0.001 + toSun * ((uCloudShadow.z - at.y * 0.001) / toSun.y);
    vec2 p = (up.xz + uCloudWind * uCloudTime) * uCloudShadow.y;
    float density = valueNoise(p) * 0.62 + valueNoise(p * 2.4 + 5.3) * 0.38;
    return 1.0 - smoothstep(0.42, 0.72, density) * uCloudShadow.x;
  }

  #endif
`;

/**
 * The low deck, marched rather than projected.
 *
 * A cirrus sheet is kilometres across and tens of metres thick, so a plane is
 * not an approximation of it, it is the right model. A cumulus is one to two
 * kilometres tall and a plane can never be right: no flat base, no lit side, no
 * parallax between its front and its back. So the low deck alone gets a slab
 * and a ray through it, and it is the only path here that costs a loop.
 *
 * The shape comes from the same two-dimensional field the flat decks use — one
 * coverage map, so the shadow on the ground, the sky in a puddle and the cloud
 * overhead can never disagree — with the vertical structure and the erosion
 * added in three dimensions on top. That division of labour is what keeps the
 * marched path affordable: the expensive noise is only ever evaluated where the
 * cheap field has already said there is cloud.
 *
 * Dome only. Requires NOISE_GLSL, VOLUME_NOISE_GLSL and CLOUDS_GLSL.
 */
export const CLOUD_VOLUME_GLSL = /* glsl */ `
  /** base km, top km, longest path km, extinction. */
  uniform vec4 uLowSlab;
  /** swell, detail per kilometre, light step km, spare. */
  uniform vec4 uLowShape;
  /** ambient gain, powder, phase g, sun gain. */
  uniform vec4 uLowLight;

  /**
   * How much cloud stands over this square of ground, 0..1. The flat decks'
   * own field read off the low slot, so every consumer of it agrees.
   */
  float lowCoverage(vec2 planeKm) {
    vec2 along = normalize(uDeckWind[2] + vec2(1e-6, 0.0));
    vec2 across = vec2(-along.y, along.x);
    vec2 plane = planeKm + uDeckWind[2] * uCloudTime;
    vec2 sheared = along * (dot(plane, along) / max(uDeckForm[2].w, 0.05))
      + across * dot(plane, across);
    vec2 p = sheared * uDeckShape[2].z;

    float base = cloudForm(p, uDeckForm[2].y);
    if (uDeckLight[2].w > 0.0) {
      float lane = dot(plane, along) * uDeckShape[2].z;
      float wave = 0.5 + 0.5 * sin(lane * 2.1 + valueNoise(p * 0.33) * 7.0);
      base *= 1.0 - uDeckLight[2].w * 0.55 * (1.0 - wave);
    }
    float coverage = clamp(uDeckLight[2].z * uDeckShape[2].x, 0.0, 1.0);
    return clamp(cloudRemap(base, 1.0 - coverage, 1.0), 0.0, 1.0);
  }

  /**
   * Density at a point in the slab, in kilometres. The fine flag buys the
   * three-dimensional erosion; the light march goes without it, which is both
   * cheaper and right — a shadow cast through a cloud does not care about the
   * lace on its edge.
   *
   * The height gradient is what makes a heap a heap. The base is cut flat,
   * because that is where the air reaches its dew point and not a metre lower,
   * and the top climbs with how much cloud is standing here — so a heap towers
   * over its own gaps instead of lying at one depth like a sheet.
   */
  float lowDensity(vec3 posKm, bool fine) {
    float span = max(uLowSlab.y - uLowSlab.x, 0.01);
    float h = (posKm.y - uLowSlab.x) / span;
    if (h < 0.0 || h > 1.0) return 0.0;

    float cover = lowCoverage(posKm.xz);
    if (cover <= 0.001) return 0.0;

    float top = mix(1.0, 0.25 + 0.75 * cover, uLowShape.x);
    float gradient = smoothstep(0.0, 0.09, h) * (1.0 - smoothstep(top * 0.4, top, h));
    float density = cover * gradient;
    if (density <= 0.0 || !fine) return density;

    // Eroded in three dimensions by the same remap the flat decks use: it eats
    // into the surface and leaves the body alone, so a billow keeps its mass
    // and gains a torn edge rather than going to soup.
    // volumeFbm, not two raw lookups: volumeNoise is one octave of filtered
    // white noise, and two of those under a saturating remap is not erosion,
    // it is blotches. The fractal is normalised and smooth, which is what the
    // remap wants underneath it.
    vec3 q = posKm * uLowShape.y;
    q.xz += uDeckWind[2] * (uCloudTime * uLowShape.y * 1.4);
    float wisp = volumeFbm(q);
    // Shallower than the flat decks': at this scale the erosion is carving the
    // body of the cloud rather than its outline, and a deep cut there hollows
    // it out into lumps.
    float e = min(uDeckShape[2].y, 0.28);
    return clamp(cloudRemap(wisp * (1.0 - e) + e, 1.0 - density, 1.0 - density + e), 0.0, 1.0);
  }

  /** Optical depth from here to the sun, in the slab's own units. */
  float lowSunDepth(vec3 posKm, vec3 sunDir) {
    float step = uLowShape.z;
    float depth = 0.0;
    for (int i = 0; i < 4; i++) {
      depth += lowDensity(posKm + sunDir * (step * (float(i) + 0.7)), false);
    }
    return depth * step;
  }

  /**
   * How much sunlight comes back out, summed over three orders of scattering.
   *
   * One Beer term alone drives a thick cloud to black and a real one never goes
   * black: the light that failed to come straight through arrives later having
   * bounced, softer and from everywhere. Each order halves the scattering,
   * halves the extinction and slackens the anisotropy, so the first is a sharp
   * forward lobe through thin cloud and the last is nearly uniform light
   * through thick cloud.
   */
  float lowEnergy(float depth, float density, float cosT) {
    float energy = 0.0;
    float scatter = 1.0;
    float extinct = 1.0;
    float anisotropy = 1.0;
    for (int i = 0; i < 3; i++) {
      float g = uLowLight.z * anisotropy;
      float g2 = g * g;
      float phase = (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * cosT, 1.5);
      energy += scatter * exp(-depth * uLowSlab.w * extinct) * phase;
      scatter *= 0.5;
      extinct *= 0.5;
      anisotropy *= 0.6;
    }
    // The powder term: just inside a lit edge less light comes back out than
    // Beer's law predicts, because it has not had the depth to turn round.
    return energy * mix(1.0, 1.0 - exp(-density * 7.0), uLowLight.y);
  }

  /**
   * The slab, marched. Returns the light gathered and how much of the sky
   * behind it is left over.
   *
   * Twenty even steps, and no dither. Nothing here accumulates between frames,
   * so the usual trick of scattering the start offset per pixel would have to
   * survive to the screen unfiltered at a third of display resolution — which
   * means it arrives as dots rather than as smoothness.
   */
  vec4 skyLowDeck(vec3 direction, vec3 sunDir, vec3 horizon) {
    if (uDeckLight[2].z <= 0.001 || direction.y <= 0.012) return vec4(0.0);

    float t0 = uLowSlab.x / direction.y;
    float t1 = min(uLowSlab.y / direction.y, t0 + uLowSlab.z);
    float span = t1 - t0;
    if (span <= 0.0) return vec4(0.0);

    // No per-pixel jitter. It is the usual answer to banding at a low step
    // count, and it is the wrong one here: it trades bands for noise, and this
    // pipeline draws at a third of display resolution with no filter that
    // could resolve noise again — so every offset stays on screen as a dot.
    // Bands are cheaper to remove honestly, by taking more steps.
    float dt = span / 20.0;
    float t = t0 + dt * 0.5;
    float cosT = dot(direction, sunDir);
    float transmittance = 1.0;
    vec3 gathered = vec3(0.0);

    for (int i = 0; i < 20; i++) {
      vec3 pos = direction * t;
      float density = lowDensity(pos, true);
      if (density > 0.002) {
        float energy = lowEnergy(lowSunDepth(pos, sunDir), density, cosT);

        // Where in the slab this sample sits. The top of a cloud sees the whole
        // sky and the base sees the ground, and that gradient is what reads as
        // depth even with the sun behind you.
        float h = clamp((pos.y - uLowSlab.x) / max(uLowSlab.y - uLowSlab.x, 0.01), 0.0, 1.0);
        vec3 ambient = mix(uDeckShade[2], uDeckLit[2], h * h) * uLowLight.x;
        vec3 sunlit = uDeckLit[2] * (energy * uLowLight.w * uSunIntensity);

        float stepT = exp(-density * dt * uLowSlab.w);
        gathered += transmittance * (1.0 - stepT) * (sunlit + ambient);
        transmittance *= stepT;
        if (transmittance < 0.02) break;
      }
      t += dt;
    }

    float alpha = 1.0 - transmittance;
    if (alpha <= 0.002) return vec4(0.0);
    // Aerial perspective. The deck runs to the horizon and loses itself in the
    // haze rather than stopping in a ring — and because it arrives at exactly
    // the horizon colour, the one line the vista band cannot afford a seam on
    // still holds.
    float away = 1.0 - smoothstep(0.012, 0.3, direction.y);
    return vec4(mix(gathered / max(alpha, 1e-4), horizon, away * 0.96), alpha);
  }
`;
