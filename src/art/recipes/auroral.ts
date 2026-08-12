import { SCENE_SHARED, sceneSlots } from '../glsl/sky';
import type { Recipe } from './types';

const GLSL = /* glsl */ `
  // --- auroral: standing under a corona -------------------------------------
  //
  // Curtains are vertical sheets hanging between about 100 and 300 km, and rays
  // are columns of air standing on the field lines. Both are drawn by marching
  // the eye ray up through that slab and sampling a footprint that is a function
  // of plan position alone — no height term, so a column stays a column, and the
  // rays converge overhead by perspective exactly as the real ones do.
  //
  // Colour is a function of altitude, never of viewing elevation: nitrogen pink
  // along the base, the oxygen green body, then the long thin red crown.
  //
  // recipeTime is in seconds, so every rate below is per second.

  /** How brightly the curtains burn. */
  float auroraGain() { return recipeVar.y; }
  /** How fast the display travels. Scales every clock in it. */
  float auroraRate() { return recipeVar.z; }
  /** How far the sheets wander off their bearings. Low is a tidy arc. */
  float auroraSpread() { return recipeVar.w; }

  /** A sparse field, so the sky behind the display is not empty. */
  vec3 auroraStars(vec3 d) {
    vec3 p = d * 58.0;
    vec3 c = floor(p);
    vec3 draw = finishHash3(c);
    if (draw.z < 0.88) return vec3(0.0);
    vec3 spot = vec3(draw.x, draw.y, fract(draw.x * 7.3 + draw.y * 3.1));
    vec3 delta = p - (c + 0.25 + spot * 0.5);
    // Widened to a pixel and dimmed to match, so a point source cannot alias.
    float px = length(fwidth(p)) * 0.55;
    float r2 = 0.04 + px * px;
    float g = dot(delta, delta) / r2;
    return vec3(0.72, 0.78, 0.95) * (exp(-g * g) * (0.04 / r2) * (draw.z - 0.88) * 6.0);
  }

  /**
   * How much light the column of air at plan position p emits. Units are base
   * altitude, so 1.0 is roughly a hundred kilometres.
   *
   * hn widens the sheet and softens its ribs with height, because the high red
   * line takes a minute or so to fire and the atoms drift while it does. w is
   * the plan-space width this one sample stands for, and everything fine enough
   * to beat against it is rolled off by it.
   */
  float auroraFoot(vec2 p, float t, float w, float hn) {
    // Spirals and omega folds, then the finer curls inside them. Both advect as
    // well as evolve: a field that only changes in place boils, and what a
    // display does is travel.
    float coarse = wearNoise(vec3(p * 0.34 + vec2(-t * 0.017, t * 0.006), t * 0.030)) - 0.5;
    float curl = wearNoise(vec3(p * 1.05 + vec2(-t * 0.115, t * 0.030) + 7.3, t * 0.050)) - 0.5;
    // The whole train drifts poleward under all of it.
    float lane = (p.y - t * 0.018 + (coarse * 1.70 + curl * 0.42) * auroraSpread()) * 0.66;
    float f = lane - floor(lane) - 0.5;

    // The halo first: a wide soft lobe standing where the sheet does, which is
    // the scattered light that makes a curtain read as luminous rather than as
    // a lit strip. Both lobes reach zero inside the lane, so there is no seam.
    float wide = f * 2.28;
    float halo = max(0.0, 1.0 - wide * wide);
    halo *= halo;

    // Patches running along the arc's length, and under them a long wave doing
    // the same — a wave crossing an arc from one horizon to the other in tens
    // of seconds is the display's characteristic motion.
    float run = 0.45 + 0.55 * smoothstep(0.22, 0.78, wearNoise(vec3(p.x * 0.28 - t * 0.090, lane * 0.7, 9.4)));
    run *= 1.0 + 0.16 * sin(p.x * 1.35 - t * 0.42);
    // Flaming: a surge rushing up through the curtain, staggered along the arc
    // so the whole sheet does not pulse as one slab.
    float flame = 1.0 + 0.15 * sin(hn * 8.0 - t * 0.90 + p.x * 0.45);

    float across = f / (0.15 + hn * 0.18 + smoothstep(0.15, 0.60, w) * 0.13);
    if (abs(across) >= 1.0) return halo * (0.22 * run * flame);
    float sheet = 1.0 - across * across;
    sheet *= sheet;

    // Rays: the sheet's own striations, sliding along it.
    //
    // Each harmonic's amplitude is divided by its own pitch against w, so a
    // pitch this sample cannot resolve fades to nothing instead of beating
    // against the step size. That beat is what made the moving stripes, and
    // fading the ribs by distance alone does not fix it — the march is coarser
    // than the pixel almost everywhere.
    //
    // Centred on one, not on a half: rays are emission added to the sheet, so
    // they brighten it in bundles rather than cutting it into a weave.
    float phase = wearNoise(vec3(p * 1.6 + vec2(-t * 0.10, 0.0), 4.1));
    float u = p.x - t * 0.12 + phase * 0.30;
    float ribs = sin(u * 26.0) / (1.0 + w * 26.0)
      + 0.45 * sin(u * 61.0 - t * 0.35) / (1.0 + w * 61.0);
    float rays = 1.0 + 0.62 * ribs * smoothstep(0.25, 0.70, phase) * (1.0 - hn * 0.45);

    return (sheet * rays + halo * 0.34) * run * flame;
  }

  vec3 recipeAurora(vec3 dir) {
    vec3 d = normalize(dir);
    float t = recipeTime() * auroraRate();

    vec3 sky = vec3(0.009, 0.013, 0.032)
      + vec3(0.013, 0.021, 0.048) * smoothstep(-0.30, 0.85, d.y);
    sky += auroraStars(d);

    // Plan position the ray reaches per unit of altitude. Diverges at the
    // horizon because the air there genuinely is infinitely far off; floored,
    // and what the floor would draw is faded out by reach below.
    vec2 az = d.xz / max(d.y, 0.055);
    float rad = length(az);
    // Plan units one pixel covers per unit of altitude: half the antialiasing,
    // the march step being the other half.
    float azw = length(fwidth(az));

    vec3 glow = vec3(0.0);
    for (int i = 0; i < 14; i++) {
      // Squared, so the samples crowd the bright sharp base and thin out
      // through the soft crown.
      float s = (float(i) + 0.5) / 14.0;
      float hn = s * s;
      float h = 1.0 + hn * 2.1;
      float reach = 1.0 - smoothstep(9.0, 20.0, rad * h);
      if (reach <= 0.0) continue;

      // What this sample stands for: the wider of the pixel's footprint and the
      // plan distance the ray crosses between steps.
      float w = max(azw * h, rad * 0.30 * s);
      float dens = auroraFoot(az * h, t, w, hn);
      if (dens <= 0.0) continue;

      float lit = exp(-hn * 3.2) + smoothstep(0.20, 0.80, hn) * 0.30;
      glow += rampColour(recipeRamp(), hn) * (dens * lit * reach);
    }
    glow *= auroraGain() * 0.21;

    // The structureless arc every display has sitting low under its curtains,
    // out where the march has faded. Fixed at the green of the body: this one
    // term is keyed on elevation, and anything with colour in it would stratify
    // the whole display horizontally and lay it on its side.
    float arc = smoothstep(0.02, 0.16, d.y) * (1.0 - smoothstep(0.20, 0.62, d.y));
    glow += rampColour(recipeRamp(), 0.13)
      * (arc * 0.17 * auroraGain() * (0.6 + 0.4 * wearNoise(vec3(d.xz * 3.0 - t * 0.02, t * 0.05))));

    sky += glow * smoothstep(-0.03, 0.10, d.y);
    // A little of the light left on the ground: a display that stops dead on
    // the horizon line reads as a decal.
    sky += rampColour(recipeRamp(), 0.15) * (0.07 * smoothstep(0.08, -0.35, d.y));
    // Kneed high. A low ceiling compresses the whole display toward its own
    // mid-tone, which is the difference between a burning sky and hanging cloth.
    return recipeKnee(sky, 2.6);
  }
`;

export const auroral: Recipe = {
  name: 'auroral',
  glsl: GLSL,
  shared: SCENE_SHARED,
  params: ['gain', 'rate', 'spread'],
  variants: [
    {
      name: 'auroral',
      ramp: 'aurora',
      knobs: { gloss: 0, rim: 0, sunGlare: 0, envGain: 0 },
      params: [1.2, 1.0, 1.0],
    },
  ],
  slots: sceneSlots('recipeAurora', 1.1),
};
