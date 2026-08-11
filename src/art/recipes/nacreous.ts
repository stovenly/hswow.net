import { RECIPE_INDEX, type Recipe } from './types';

const GLSL = /* glsl */ `
  // --- nacreous: pearl ------------------------------------------------------
  //
  // Warm near-white body, a deep lustre from under the surface, curved growth
  // lines, and only a faint wash of interference over it.

  /**
   * Film thickness in soft broad patches.
   *
   * Growth lines drawn as a wave gave a corduroy shell, and a pearl has no
   * stripes on it — the nacre is laid in concentric shells around a nucleus and
   * what you see at the surface is an uneven *thickness*, which puts the colour
   * in soft clouds. Two scales of noise, drifting slowly.
   */
  float recipeNacreThickness() {
    float t = recipeTime() * 0.035;
    return 0.55
      + 1.15 * recipeFbm(vWearPos * 2.3 + vec3(0.0, t, 0.0))
      + 0.35 * wearNoise(vWearPos * 6.8 - vec3(t * 0.6, 0.0, 2.1));
  }

  /**
   * Orient: the iridescent wash.
   *
   * A pearl really does show pink, green and gold, so this is a full hue walk —
   * but laid over white at low strength, in patches, and strongest where the
   * surface turns away. Saturated hue on a white body is what pearlescence is;
   * saturated hue on a coloured body would be an oil slick.
   */
  vec3 recipeNacreSheen(float smoothNV) {
    float phase = (1.0 - smoothNV) * 2.1 + recipeNacreThickness() * 1.35;
    vec3 hue = 0.5 + 0.5 * cos(6.2831853 * (phase + vec3(0.0, 0.33, 0.67)));
    // Pale, and never below white: this tints the lustre rather than replacing
    // it, so the pearl stays a pearl and gains a rainbow.
    return mix(vec3(1.0), hue, 0.42) * (0.70 + 0.30 * pow(1.0 - smoothNV, 1.4));
  }

  /** Orient: broadest where the path through the platelets is longest. */
  float recipeOrient(float smoothNV) {
    float rim = pow(1.0 - smoothNV, 2.0);
    float body = pow(1.0 - smoothNV, 0.55) * 0.6;
    float t = recipeTime() * 0.05;
    float cloud = 0.80 + 0.32 * recipeFbm(vWearPos * 3.4 + vec3(0.0, t, 7.7));
    return (rim + body) * cloud;
  }
`;

export const nacreous: Recipe = {
  name: 'nacreous',
  index: RECIPE_INDEX.nacreous,
  glsl: GLSL,
  knobs: { gloss: 0.06, rim: 0.12, sunGlare: 0.02, envGain: 0.24 },
  implies: ['film'],
  slots: {
    thickness: 'recipeNacreThickness()',
    // **A pearl's colour is a wash, not a spectrum.** Three quarters of the hue
    // walk is thrown away right here, and what survives is the faint
    // rose-and-green cast a real pearl carries over a warm white body.
    // Everything that makes nacre read as nacre is elsewhere — the curved
    // growth lines and the orient — and if this term is the one doing the
    // work, it is wrong.
    //
    // Raised from a quarter. At that strength the wash was so faint that what
    // was left was a smooth pale dielectric — which is marble, and that is
    // exactly what it looked like. A pearl's colour is quiet, not absent: you
    // should be able to find the rose and the green on it without hunting.
    film: /* glsl */ `
      film = mix(vec3(1.0), film, 0.66);
    `,
    direct: /* glsl */ `
      float nacreNV = saturate(dot(recipeSmoothNormal(), geometryViewDir));
      reflectedLight.directDiffuse += directLight.color * finishSheenColour
        * recipeNacreSheen(nacreNV) * (recipeOrient(nacreNV) * 0.40 * smoothNL);
    `,
    ambient: /* glsl */ `
      // The lustre, tinted by the interference: pearl's rainbow is *in*
      // the depth rather than laid on the surface over it.
      reflectedLight.indirectDiffuse += finishEnv * finishSheenColour
        * recipeNacreSheen(smoothNV) * (recipeOrient(smoothNV) * 1.35 * uFinishEnv);
    `,
  },
};
