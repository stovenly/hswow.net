import type { Recipe } from './types';

const GLSL = /* glsl */ `
  // --- quickmetal: mercury --------------------------------------------------
  //
  // A mirror reflecting an invented, violently contrasted surroundings: dark
  // ground, a blazing horizon line, cool sky above, coloured from the zone's
  // own sky pair. The wobble bends the reflected ray across that horizon, so
  // bright and dark bands snake over the surface as it flows.

  /** How fast the surface runs. Mercury's motion is most of what makes it that. */
  float quickFlow() { return recipeVar.y; }
  /** 0 keeps the invented world up the right way; 1 turns it over. */
  float quickInvert() { return recipeVar.z; }
  /** How far the flow bends the reflected ray. */
  float quickWobble() { return recipeVar.w; }

  /**
   * Elevation, as this variant sees it.
   *
   * **The whole inversion is this line.** The invented surroundings are keyed on
   * nothing but the bent ray's height, so mirroring the height mirrors the
   * world — dark sky above and a burning floor below, out of the same code that
   * draws the bright one. A lerp rather than a branch so it can also sit
   * halfway, where the horizon flash doubles and the mirror reads as a slot.
   */
  float quickUp(float y) {
    return y * (1.0 - 2.0 * quickInvert());
  }

  /**
   * Four scales of flow: broad swells, a mid counter-swell drifting the other
   * way, a chop advected by the swells, and a fine ripple advected by the
   * chop. Each layer bends the reflected ray at its own rate.
   */
  vec3 recipeWobble(vec3 worldDir) {
    float t = recipeTime() * 0.16 * quickFlow();
    vec3 q = vWearPos * 2.1 + vObjectPhase * 9.0;
    vec3 swell = vec3(
      wearNoise(q + vec3(t, 0.0, 0.0)),
      wearNoise(q * 1.13 + vec3(0.0, t * 1.25, 3.7)),
      wearNoise(q * 0.91 + vec3(5.1, 0.0, t * 0.75))
    ) - 0.5;
    swell *= vec3(0.75, 1.7, 0.75);

    vec3 q2 = vWearPos * 4.6 + vObjectPhase * 5.0;
    vec3 swell2 = (vec3(
      wearNoise(q2 + vec3(0.0, t * 0.9, 1.7)),
      wearNoise(q2 * 1.07 + vec3(t * 0.7, 0.0, 8.3)),
      wearNoise(q2 * 0.95 + vec3(2.9, t * 0.55, 0.0))
    ) - 0.5) * vec3(0.45, 0.85, 0.45);

    vec3 r = vWearPos * 8.5 + swell * 0.55 + vec3(0.0, -t * 2.2, 0.0);
    vec3 chop = (vec3(
      wearNoise(r), wearNoise(r * 1.07 + 11.3), wearNoise(r * 0.94 + 23.9)
    ) - 0.5) * 0.50;

    vec3 r2 = vWearPos * 22.0 + chop * 2.0 + vec3(0.0, -t * 4.5, 0.0);
    vec3 ripple = (vec3(
      wearNoise(r2), wearNoise(r2 * 1.09 + 31.7), wearNoise(r2 * 0.93 + 47.1)
    ) - 0.5) * 0.16;

    return normalize(worldDir + (swell + swell2 + chop + ripple) * quickWobble());
  }

  /**
   * The invented surroundings, keyed only on the bent ray's elevation. Hard
   * edges on purpose: a mirror is only as crisp as what it reflects.
   */
  vec3 recipeChromeEnv(vec3 dir) {
    float h = quickUp(dir.y);
    vec3 ground = uHorizon * 0.08;
    vec3 upper = mix(uHorizon * 1.30, uZenith * 1.05, smoothstep(0.02, 0.75, h));
    vec3 env = mix(ground, upper, smoothstep(-0.015, 0.02, h));
    // The flash line at the horizon, thin and hot, with a dark cut just below
    // so the mirror line reads double, and fainter strata above it.
    env += uHorizon * (exp(-h * h * 700.0) * 1.1);
    float under = h + 0.05;
    env *= 1.0 - exp(-under * under * 800.0) * 0.5;
    float band1 = h - 0.16;
    float band2 = h - 0.40;
    env += uHorizon * (exp(-band1 * band1 * 900.0) * 0.30);
    env += uZenith * (exp(-band2 * band2 * 500.0) * 0.22);
    // Two bright pillars turning slowly about the azimuth, for the mirror to
    // stretch and snap as the surface flows.
    float az = atan(dir.z, dir.x);
    float tq = recipeTime() * quickFlow();
    float pillar = exp(-pow2(sin((az - tq * 0.021) * 0.5)) * 150.0)
      + exp(-pow2(sin((az + 1.9 + tq * 0.013) * 0.5)) * 260.0) * 0.55;
    env += (uHorizon * 1.1 + uZenith * 0.45)
      * (pillar * smoothstep(-0.02, 0.10, h) * (1.0 - smoothstep(0.2, 0.8, h)));
    // Scattered bright shards and dark pits at a fine angular scale, in both
    // hemispheres: two-dimensional content for the flow to warp, so the
    // reflection is detail everywhere rather than one banded gradient.
    float shard = smoothstep(0.70, 0.78, wearNoise(dir * 14.0 + 3.7))
      + smoothstep(0.76, 0.83, wearNoise(dir * 31.0 + 17.1)) * 0.6;
    env += (uHorizon * 0.9 + uZenith * 0.4) * shard;
    env *= 1.0 - smoothstep(0.68, 0.78, wearNoise(dir * 9.0 + 41.0)) * 0.55;
    return env;
  }

  /**
   * x: a slight warm-to-cool shift, the metal's own colour. y: ridged streaks
   * running down the surface, sampled in a frame squeezed along the drain.
   */
  vec2 recipeQuickBody() {
    float t = recipeTime() * 0.16 * quickFlow();
    vec3 q = vec3(vWearPos.x * 12.0, vWearPos.y * 3.2 - t * 2.4, vWearPos.z * 12.0);
    float sheet = wearNoise(q) * 0.52
      + wearNoise(q * 2.3 + 7.3) * 0.30
      + wearNoise(q * 5.7 + 19.1) * 0.18;
    sheet = 1.0 - abs(sheet * 2.0 - 1.0);
    sheet = pow(saturate(sheet), 2.2);
    float warmth = recipeFbm(vWearPos * 1.8 + vec3(t * 0.5, 0.0, 0.0));
    return vec2(warmth, sheet);
  }
`;

export const quickmetal: Recipe = {
  name: 'quickmetal',
  glsl: GLSL,
  params: ['flow', 'invert', 'wobble'],
  variants: [
    {
      // Mercury, and the identity row: flow 1, no inversion, full wobble.
      name: 'quicksilver',
      ramp: 'silver',
      // A mirror with no per-facet lobe at all: everything it shows comes
      // through the smooth-normal environment, so no triangle ever flashes.
      knobs: { gloss: 0, rim: 0.85, sunGlare: 0.12, envGain: 1.25 },
      params: [1.0, 0.0, 1.0],
    },
    {
      // The world turned over. A mirror is only what it reflects, so this is
      // the same material looking at a different sky — dark above, molten
      // below — and it reads as an entirely different metal for one lerp.
      name: 'nightsilver',
      ramp: 'nightmetal',
      knobs: { gloss: 0, rim: 0.55, sunGlare: 0.06, envGain: 1.4 },
      params: [0.9, 1.0, 1.0],
    },
    {
      // Slowed to a third and coloured. Mercury's *motion* is most of what
      // makes it mercury; take that away and the same field pours.
      name: 'slowbrass',
      ramp: 'brass',
      knobs: { gloss: 0.05, rim: 0.7, sunGlare: 0.18, envGain: 1.1 },
      params: [0.35, 0.0, 0.8],
    },
    {
      // Nearly frozen, and the wobble pulled back with it — a ray bent hard by
      // a field that is not moving reads as a dent rather than as flow. What is
      // left is a crisp mirror onto the invented world, which is what
      // architecture wants and what a moving one can never be.
      name: 'stillglass',
      ramp: 'silver',
      knobs: { gloss: 0, rim: 0.95, sunGlare: 0.22, envGain: 1.3 },
      params: [0.04, 0.0, 0.55],
    },
  ],
  slots: {
    direct: /* glsl */ `
      // A restrained sheen along the ridged streaks. finishF0 rather
      // than the facet Fresnel, so no triangle steps brighter.
      vec2 body = recipeQuickBody();
      reflectedLight.directSpecular += directLight.color * finishF0
        * (body.y * 0.7 * smoothNL * uFinishSpecular);
    `,
    envBend: /* glsl */ `
      // Quickmetal leans the ray and nothing else. The geometric normal is
      // untouched, so the silhouette, the outline and the shadow are all
      // exactly today's — only what the surface is looking at moves.
      finishWorld = recipeWobble(finishWorld);
    `,
    envSource: /* glsl */ `
      // Mercury reflects its own invented surroundings — the real sky has
      // too little ground-to-horizon contrast for the wobble to show.
      // Indoors the same contrast curve rides the hemisphere light.
      if (uFinishSky > 0.5) {
        finishEnv = recipeChromeEnv(finishWorld);
      } else {
        float indoorUp = quickUp(finishWorld.y);
        finishEnv *= 0.18 + 1.5 * smoothstep(-0.045, 0.09, indoorUp)
          + exp(-indoorUp * indoorUp * 130.0) * 0.7;
      }
      // A mirror bright enough to clip loses the very thing it is for: the
      // detail in what it is reflecting. Kneed rather than scaled down, so
      // the dark half keeps its contrast.
      finishEnv = recipeKnee(finishEnv, 0.92);
    `,
    ambient: /* glsl */ `
      // The metal's own cast, and the streaks as shading on the mirror
      // itself — multiplied, never added, so nothing hazes over it.
      vec2 body = recipeQuickBody();
      vec3 metal = rampColour(recipeRamp(), body.x);
      reflectedLight.indirectSpecular *= mix(vec3(1.0), metal, uFinishEnv);
      reflectedLight.indirectSpecular *= mix(1.0, 0.86 + body.y * 0.30, uFinishEnv);
    `,
  },
};
