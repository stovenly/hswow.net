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
  /**
   * How far above the cut the deck takes to reach its full thickness.
   *
   * Small is a hard mask: a thin rim and then flat opacity all the way across,
   * which is the other half of why a cloud reads as spilled paint. A real one
   * thickens the whole way in from its edge, so this is wide and the *shading*
   * is what gives the mass its definition.
   */
  readonly softness: number;
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
}

/**
 * The roster.
 *
 * These are named after real genera and they are not models of them. The aim is
 * cloud cover that reads well in a game — soft coherent masses with a clear
 * silhouette and light on one side — with enough of each genus's shape to be
 * recognisable and no more. Chasing the real article the other way round is
 * what produced fields of specks: a real cirrocumulus element subtends under a
 * degree, and under a degree at this resolution is not a small cloud, it is
 * noise with a cloud's name on it.
 *
 * So every deck is cut from the same warped masses, and what separates them is
 * scale, cover, softness, how hard they shade and whether they lie in rows. Element sizes are in kilometres; what a viewer names a genus by is
 * the angle one element subtends, which the deck's height decides.
 *
 * The projection foreshortens: a ray at elevation t crosses the deck at
 * h/tan(t), so one element spans `element * sin(t)^2 / h` radians, not
 * `element / h`. At forty-five degrees that is half the naive figure and near
 * the horizon a small fraction of it — so an element sized for the zenith is
 * under a degree across most of the sky, and at this resolution that is not a
 * cloud, it is noise. Every size here is set from the angle wanted at
 * mid-elevation — about fifteen degrees for stratocumulus and a good deal more
 * for the sheets above it.
 */
export const GENERA: Record<GenusName, Genus> = {
  // Ice, thin, and drawn out to nothing: no shading, no base, eroded hard.
  cirrus: {
    level: 'high',
    height: 9,
    form: 'fibres',
    element: 5,
    cover: 0.62,
    softness: 0.3,
    opacity: 0.7,
    stretch: 3.2,
    shade: 0,
    glow: 1.0,
    base: 0,
    ripple: 0.1,
    grey: 0,
  },
  // A veil over the whole sky that you notice by the halo rather than by
  // seeing it: near-total cover, almost no contrast, barely opaque.
  cirrostratus: {
    level: 'high',
    height: 8,
    form: 'sheet',
    element: 8,
    cover: 0.86,
    softness: 0.5,
    opacity: 0.42,
    stretch: 1.6,
    shade: 0,
    glow: 0.85,
    base: 0,
    ripple: 0,
    grey: 0.04,
  },
  // A featureless grey sheet the sun shows through as a bright patch.
  // Rows of small soft cloud high up. Drawn far larger than the real thing —
  // legible at a glance rather than correct at a degree — and shaded lightly so
  // the rows catch the light along one side.
  cirrocumulus: {
    level: 'high',
    height: 7.5,
    form: 'sheet',
    element: 2.2,
    cover: 0.6,
    softness: 0.32,
    opacity: 0.45,
    stretch: 1.4,
    shade: 0.14,
    glow: 0.7,
    base: 0,
    ripple: 0.5,
    grey: 0.02,
  },
  altostratus: {
    level: 'mid',
    height: 4.5,
    form: 'sheet',
    element: 9,
    cover: 0.93,
    softness: 0.5,
    opacity: 0.9,
    stretch: 1.5,
    shade: 0.14,
    glow: 0.45,
    base: 0.15,
    ripple: 0,
    grey: 0.66,
  },
  // Large rolls with blue between them, well shaded and with a definite base.
  // The same rows a good deal lower, so they read larger and carry a proper
  // shaded side. The mid deck's everyday cloud.
  altocumulus: {
    level: 'mid',
    height: 4,
    form: 'sheet',
    element: 1.7,
    cover: 0.62,
    softness: 0.3,
    opacity: 0.72,
    stretch: 1.4,
    shade: 0.36,
    glow: 0.4,
    base: 0.18,
    ripple: 0.45,
    grey: 0.16,
  },
  stratocumulus: {
    level: 'low',
    height: 1.6,
    form: 'heap',
    element: 0.7,
    cover: 0.72,
    softness: 0.32,
    opacity: 0.96,
    stretch: 1.7,
    shade: 0.55,
    glow: 0.3,
    base: 0.35,
    ripple: 0.34,
    grey: 0.24,
  },
  // Isolated heaps: little cover, hard self-shadow, a flat dark base, and the
  // most eroded edges of anything here.
  cumulus: {
    level: 'low',
    height: 1.2,
    form: 'heap',
    element: 1.05,
    cover: 0.54,
    softness: 0.3,
    opacity: 1,
    stretch: 1.1,
    shade: 0.6,
    glow: 0.35,
    base: 0.4,
    ripple: 0,
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
    softness: 0.55,
    opacity: 0.94,
    stretch: 1.4,
    shade: 0.1,
    glow: 0.2,
    base: 0.25,
    ripple: 0.14,
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
    softness: 0.55,
    opacity: 1,
    stretch: 1.3,
    shade: 0.3,
    glow: 0.15,
    base: 0.4,
    ripple: 0,
    grey: 0.72,
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
  // Two to fourteen metres a second at head height, and about four and a half
  // times that at nine kilometres.
  const ground = 2 + surface * 12;
  return {
    speed: (ground * (1 + heightKm * 0.4)) / 1000,
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

  /** coverage at full amount, edge softness, elements per kilometre, opacity. */
  uniform vec4 uDeckShape[3];
  /** height in kilometres, form code, base darkening, stretch. */
  uniform vec4 uDeckForm[3];
  /** shade, forward-scatter gain, amount, ripple. */
  uniform vec4 uDeckLight[3];
  /** Each deck's own wind, in kilometres per second across its plane. */
  uniform vec2 uDeckWind[3];
  /**
   * How far each deck has actually travelled, in kilometres — accumulated a
   * frame at a time rather than worked out as speed times the clock.
   *
   * Speed times the clock is not a distance travelled unless the speed never
   * changed: differentiate it and a second term appears, the rate of change of
   * the wind multiplied by the whole elapsed time, and after a few minutes that
   * term is the only one that matters. The wind wanders a little every frame,
   * so the decks were being flung across the sky by the wander — and pinning
   * the wind to its ceiling, where it cannot wander, stopped them dead.
   */
  uniform vec2 uDeckDrift[3];
  uniform vec3 uDeckLit[3];
  uniform vec3 uDeckShade[3];
  /**
   * The low deck's travel, in kilometres. What the cheap path and the ground
   * shadow both use — a shadow has to slide with the cloud casting it, not at
   * some speed of its own.
   */
  uniform vec2 uCloudWind;
  uniform float uCloudTime;
  /** Total sky covered, and the one colour the cheap path paints it. */
  uniform float uSkyCover;
  uniform vec3 uSkyCloudColour;
  uniform float uSkyCheapScale;
  /** How thick the low haze is, per unit of airmass. See the deck's haze. */
  uniform float uCloudHaze;
  /**
   * What is actually lighting the decks: xyz toward it, w how strong. The sun
   * by day and the moon once the sun is down — shading a cloud from a sun that
   * is below the horizon puts a lit side and a silvered edge on it facing a
   * light nobody can see, which is most of why a night sky looked wrong.
   */
  uniform vec4 uSkyLight;

  float cloudRemap(float v, float lo, float hi) {
    return (v - lo) / (hi - lo);
  }

  /**
   * The warp. Displacing a noise field by another noise field is the single
   * thing that separates a cloud from a stain: it turns round lumps into
   * billows that curl, and it costs two lookups.
   */
  /**
   * One octave, faded toward its own mean once its wavelength drops under a
   * pixel. Fading toward the *mean* and not toward zero is the whole trick:
   * zeroing an octave takes its average out of the sum with it and the deck
   * changes brightness as it recedes.
   *
   * Without this a deck near the horizon is sampled far finer than the screen
   * can carry — the plane runs to a hundred kilometres down there — and what
   * arrives is moire and grain rather than cloud. It matters more than it
   * sounds: a player looks at the horizon most of the time.
   */
  float bandNoise(vec2 p, float w) {
    return mix(0.5, valueNoise(p), smoothstep(1.0, 0.5, w));
  }

  vec2 cloudWarp(vec2 p, float w) {
    return vec2(bandNoise(p + 11.31, w), bandNoise(p * 1.07 + 41.77, w)) - 0.5;
  }

  /** Stratiform: warped masses, four octaves, soft everywhere. */
  float cloudSheet(vec2 p, float w, float curl) {
    vec2 q = p + cloudWarp(p * 0.55, w * 0.55) * curl;
    return bandNoise(q, w) * 0.50
      + bandNoise(q * 2.03 + 5.1, w * 2.03) * 0.28
      + bandNoise(q * 4.11 + 9.7, w * 4.11) * 0.15
      + bandNoise(q * 8.27 + 2.3, w * 8.27) * 0.07;
  }

  /**
   * Cumuliform: billow noise, which is ordinary noise folded about its middle.
   * The fold is what makes the tops round and the valleys sharp, and that is
   * the whole difference between a heap of cloud and a hill of it.
   */
  float cloudHeap(vec2 p, float w, float curl) {
    vec2 q = p + cloudWarp(p * 0.7, w * 0.7) * curl * 0.68;
    float sum = 0.0;
    float total = 0.0;
    float amp = 0.5;
    float width = w;
    for (int i = 0; i < 3; i++) {
      // Faded after the fold, not before it. Folding doubles the frequency and
      // moves the mean: fading the input toward a half hands the fold a one,
      // so a deck would brighten as it receded.
      float folded = 1.0 - abs(valueNoise(q) * 2.0 - 1.0);
      sum += amp * mix(0.5, folded, smoothstep(1.0, 0.5, width));
      total += amp;
      q = q * 2.07 + 3.13;
      width *= 2.07;
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
  float cloudFibres(vec2 p, float w, float curl) {
    // Drawn out along the wind and bent across itself, over the same warped
    // masses the sheet uses. A cirrus field is long soft shapes; sampling it
    // at a high frequency across the streak gives filaments in theory and a
    // scatter of white flecks at this resolution, which is not cirrus at all.
    float bend = bandNoise(vec2(p.x * 0.35, p.y * 0.5), w * 0.5) - 0.5;
    return cloudSheet(vec2(p.x * 0.6, p.y + bend * 1.9), w, curl);
  }

  float cloudForm(vec2 p, float form, float w, float curl) {
    if (form < 0.5) return cloudSheet(p, w, curl);
    if (form < 1.5) return cloudHeap(p, w, curl);
    return cloudFibres(p, w, curl);
  }

  /**
   * How far a view ray travels before it reaches a deck at this height, in
   * kilometres — against a shell around the Earth, not a flat plane.
   *
   * A plane stretches to infinity as the ray comes down to the horizon, so its
   * features draw out into vertical streaks there and the whole deck smears.
   * A shell meets the horizon at a finite distance — about a hundred and
   * twenty kilometres for a deck a kilometre up, three hundred and forty for
   * cirrus — so the deck crowds and then stops, which is what a real one does,
   * and the coordinate never runs away from the hash's precision either.
   */
  float cloudRange(vec3 direction, float heightKm) {
    float b = 6371.0 * direction.y;
    return sqrt(b * b + 2.0 * 6371.0 * heightKm + heightKm * heightKm) - b;
  }

  /** Where that ray lands, in kilometres across the deck. */
  vec2 cloudPlane(vec3 direction, float heightKm) {
    return direction.xz * cloudRange(direction, heightKm);
  }

  /**
   * One deck's colour and how much of the sky it takes.
   *
   * The uniforms arrive as arguments rather than being indexed inside: a
   * uniform array may only be subscripted by a loop index, never by a function
   * parameter, and a driver that happens to allow it is not one to rely on.
   */
  vec4 cloudDeck(vec4 shape, vec4 form, vec4 light, vec2 wind, vec2 drift,
                 vec3 lit, vec3 dark, vec3 direction) {
    float amount = light.z;
    if (amount <= 0.001 || direction.y <= 0.0) return vec4(0.0);

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
    // How much of the noise lattice one pixel covers. Everything below reads
    // this and stops asking for detail it cannot show.
    float w = max(fwidth(p.x), fwidth(p.y));

    // What kind of day this patch of sky is having. A deck of one genus should
    // not look the same everywhere in it: rows over here and scattered cloud
    // over there, a tight curl in one place and a lazy one in another, thick
    // and thin in patches. Two very slow fields, so the variation happens over
    // whole quarters of the sky rather than cloud to cloud.
    float mood = bandNoise(p * 0.07 + 61.31, w * 0.07);
    float sprawl = bandNoise(p * 0.045 - 23.91, w * 0.045);
    float curl = 1.4 * (0.5 + 1.0 * sprawl);

    float base = cloudForm(p, form.y, w, curl);

    // Rows. A mackerel sky is not scattered lumps, it is a sheet broken into
    // bands lying across the wind, and that banding is most of what a person
    // recognises altocumulus and cirrocumulus by.
    if (light.w > 0.0) {
      // Rows, but wandering ones. A sine on a straight lane is a barcode, and
      // that is exactly what it looked like: real undulatus bends, breaks and
      // changes its spacing along itself, and what a person notices is the
      // rhythm rather than the ruling. So the lane is displaced by a slow
      // field before the wave is taken, and the wave is then broken *along*
      // its own length so a row is a string of elements and not a stripe.
      float lane = p.x * max(form.w, 0.05);
      float wander = bandNoise(vec2(p.x * 0.31, p.y * 0.11), w * 0.31) - 0.5;
      float phase = (lane + wander * 3.4) * 1.7;
      // Band-limited, like everything else. A raw sine is the one thing here
      // that has no octaves to fade and no lattice to measure, so it happily
      // runs past a pixel a hundred times over near the horizon.
      float wave = 0.5 + 0.5 * sin(phase) * smoothstep(6.2831853, 0.0, fwidth(phase));
      // Broken along the rows, so a row is a string of elements. Both halves
      // sit about a half, and the product is doubled to sit about a half too.
      wave *= bandNoise(vec2(p.x * 0.8, p.y * 2.1) + 5.7, w * 2.1) * 2.0;

      // Applied about zero, never as a subtraction. The rows take density from
      // between them and give it back to the bands; taking it *out* of the
      // field drops the whole deck's mean, and the moment distance fades the
      // detail toward that mean the deck sinks under its own threshold and
      // disappears — which is a rippled deck fading to nothing at the horizon.
      base *= 1.0 + light.w * 1.05 * (0.3 + 1.4 * mood) * (wave - 0.5);
    }

    // A threshold, and deliberately not a remap. Remapping spreads the density
    // smoothly from nothing to full across the whole width of a cloud, so every
    // edge is a long gradient and the deck comes back as noise with a tint on
    // it. A threshold cuts a shape out of the field, and the shape is the whole
    // of what a painted cloud is. The amount lowers the cut rather than fading
    // the result, so a deck arrives by taking more sky.
    // The cut wanders too, so a deck opens into clear sky in one place and
    // thickens in another instead of covering everything evenly.
    float threshold = mix(1.05, 1.0 - shape.x, amount) + (sprawl - 0.5) * 0.16;
    float density = smoothstep(threshold, threshold + shape.y, base);
    if (density <= 0.0) return vec4(0.0);

    vec3 colour = lit;
    if (light.x > 0.0) {
      // The field read as a *height*, and the light marched up through it.
      //
      // One density comparison toward the sun gives one number per point, so a
      // cloud comes back as a flat stencil with a soft rim — spilled paint. A
      // mass only gets a light side and a dark side if the shading knows how
      // much cloud a ray climbing toward the sun actually passes through, and
      // for a two-dimensional field that means treating the value as an
      // altitude and asking, a few steps along, whether the field over there is
      // still taller than the ray has climbed.
      vec2 toward = normalize(uSkyLight.xz + vec2(1e-5, 0.0)) * 0.19;
      // How fast the ray climbs: a low sun crawls along under the deck and
      // shadows it right across, a high one is out of it in one step.
      float rise = 0.1 + max(uSkyLight.y, 0.0) * 0.5;
      float buried = 0.0;
      for (int i = 1; i <= 4; i++) {
        float climbed = base + float(i) * rise * 0.25;
        buried += step(climbed, cloudForm(p + toward * float(i), form.y, w, curl));
      }
      colour = mix(colour, dark, buried * 0.25 * light.x);

      // The powder term. Just inside a sunlit edge less light comes back out
      // than Beer's law predicts, because it has not had the depth to scatter
      // round — so a lit rim darkens slightly before it brightens. It is the
      // sugar-cube look, and it is most of what makes a cloud read as a solid
      // rather than as a decal.
      colour *= mix(1.0, 0.74 + 0.26 * (1.0 - exp(-density * 4.5)), light.x);
    }

    // Forward scattering, Henyey-Greenstein, at the deck's own gain. Ice
    // throws light forward far harder than water does, which is why a cirrus
    // field near the sun burns and a stratocumulus deck merely brightens.
    float cosT = dot(direction, uSkyLight.xyz);
    float g2 = 0.62 * 0.62;
    float phase = (1.0 - g2) / pow(1.0 + g2 - 2.0 * 0.62 * cosT, 1.5);
    colour += lit * clamp((phase - 0.35) * 0.17, 0.0, 0.7) * uSkyLight.w * light.y;

    // The base. Looking toward the horizon is looking at the underside of the
    // deck, and a deck with a defined base has a dark one — which is the cue
    // that says how high it is with nothing drawn in perspective.
    if (form.z > 0.0) {
      colour = mix(colour, dark, form.z * (1.0 - smoothstep(0.12, 0.55, direction.y)));
    }

    // Aerial perspective, into the same colour the land fades into. A deck at
    // ten degrees is tens of kilometres off and has as much air in front of it
    // as a ridge on the horizon; without this it keeps full contrast while the
    // ridge in front of it pales, and the ridge comes out lighter than the
    // cloud behind it.
    //
    // Range along the ray decides it, so a high deck hazes harder than a low
    // one at the same elevation — which is right, because it is further away.
    // And because the target is skyAir, the dome and the air still agree
    // exactly at direction.y = 0, which is the one line the vista band cannot
    // afford a seam on.
    // Airmass, not range. Haze lives in the low few hundred metres of air, so
    // what decides how much of it stands in front of a deck is how far the ray
    // travels *through that layer* — one at the zenith, fifty at the horizon —
    // and it is very nearly the same for every deck, because they all sit
    // above the whole of it. Keying on range instead leaves a low deck at six
    // degrees barely touched while the ridge below it has gone completely.
    float haze = 1.0 - exp(-uCloudHaze / max(direction.y, 0.015));
    // Forced the rest of the way home at the horizon itself. The dome and the
    // air have to be exactly equal at direction.y = 0 and this is what
    // guarantees it, so the deck needs no alpha fade to hide behind.
    haze = max(haze, 1.0 - smoothstep(0.0, 0.09, direction.y));
    colour = mix(colour, skyAir(direction), haze);

    return vec4(colour, density * shape.w);
  }

  /** The three decks over whatever the gradient already painted. High first. */
  vec3 skyDecks(vec3 direction, vec3 base) {
    vec3 colour = base;
    for (int i = 0; i < 3; i++) {
      vec4 deck = cloudDeck(uDeckShape[i], uDeckForm[i], uDeckLight[i], uDeckWind[i],
        uDeckDrift[i], uDeckLit[i], uDeckShade[i], direction);
      colour = mix(colour, deck.rgb, deck.a);
    }
    return colour;
  }

  /** One layer, no shading. Everything that is not the dome uses this. */
  vec3 skyCloudsCheap(vec3 direction, vec3 base) {
    if (uSkyCover <= 0.001 || direction.y <= 0.0) return base;
    vec2 p = (cloudPlane(direction, 2.0) + uCloudWind) * uSkyCheapScale;
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
    vec2 p = (up.xz + uCloudWind) * uCloudShadow.y;
    float density = valueNoise(p) * 0.62 + valueNoise(p * 2.4 + 5.3) * 0.38;
    return 1.0 - smoothstep(0.42, 0.72, density) * uCloudShadow.x;
  }

  #endif
`;

