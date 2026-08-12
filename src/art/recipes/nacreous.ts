import type { Recipe } from './types';

const GLSL = /* glsl */ `
  // --- nacreous: pearl ------------------------------------------------------
  //
  // Warm near-white body, a deep lustre from under the surface, curved growth
  // lines, and only a faint wash of interference over it.

  /** How much of the hue wheel survives. The one knob that makes or breaks it. */
  float nacreWash() { return recipeVar.y; }
  /** Where on the wheel the walk starts. A whole turn is 1. */
  float nacreHue() { return recipeVar.z; }
  /** Thickness patch scale: bigger is finer clouds. */
  float nacreGrain() { return recipeVar.w; }

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
    float g = nacreGrain();
    return 0.55
      + 1.15 * recipeFbm(vWearPos * 2.3 * g + vec3(0.0, t, 0.0))
      + 0.35 * wearNoise(vWearPos * 6.8 * g - vec3(t * 0.6, 0.0, 2.1));
  }

  /**
   * Orient: the iridescent wash.
   *
   * A pearl really does show pink, green and gold, so this is a full hue walk —
   * but laid over white at low strength, in patches, and strongest where the
   * surface turns away. Saturated hue on a white body is what pearlescence is;
   * saturated hue on a *dark* body is a black pearl, and there is no lustre
   * underneath it to wash the colour out — which is why the strength is a knob
   * rather than a law, and why lunacreous can afford nearly twice as much.
   */
  vec3 recipeNacreSheen(float smoothNV) {
    float phase = (1.0 - smoothNV) * 2.1 + recipeNacreThickness() * 1.35 + nacreHue();
    vec3 hue = 0.5 + 0.5 * cos(6.2831853 * (phase + vec3(0.0, 0.33, 0.67)));
    // Pale, and never below white: this tints the lustre rather than replacing
    // it, so the pearl stays a pearl and gains a rainbow.
    return mix(vec3(1.0), hue, saturate(0.42 * nacreWash()))
      * (0.70 + 0.30 * pow(1.0 - smoothNV, 1.4));
  }

  /** Orient: broadest where the path through the platelets is longest. */
  float recipeOrient(float smoothNV) {
    float rim = pow(1.0 - smoothNV, 2.0);
    float body = pow(1.0 - smoothNV, 0.55) * 0.6;
    float t = recipeTime() * 0.05;
    float cloud = 0.80 + 0.32 * recipeFbm(vWearPos * 3.4 * nacreGrain() + vec3(0.0, t, 7.7));
    return (rim + body) * cloud;
  }
`;

export const nacreous: Recipe = {
  name: 'nacreous',
  glsl: GLSL,
  params: ['wash', 'hue', 'grain'],
  implies: ['film'],
  variants: [
    {
      name: 'nacreous',
      knobs: { gloss: 0.06, rim: 0.12, sunGlare: 0.02, envGain: 0.24 },
      params: [1.0, 0.0, 1.0],
    },
    {
      // A black pearl, and the point of it is that the wash is the *only* thing
      // there. Over a pale body the interference is a tint on a lustre already
      // doing most of the work; over a near-black one there is no lustre to
      // tint, so what survives is the peacock sheen alone, floating on
      // something you cannot see the surface of.
      //
      // Turned most of the way round the wheel to the green-and-aubergine a
      // Tahitian pearl carries, with the wash well up because a dark body can
      // take it — over white the same numbers would read as an oil slick.
      name: 'lunacreous',
      knobs: { gloss: 0.09, rim: 0.20, sunGlare: 0.02, envGain: 0.34 },
      params: [1.7, 0.58, 0.9],
    },
  ],
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
      film = mix(vec3(1.0), film, saturate(0.66 * nacreWash()));
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
