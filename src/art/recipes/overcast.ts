import { SCENE_SHARED, sceneSlots } from '../glsl/sky';
import type { Recipe } from './types';

const GLSL = /* glsl */ `
  // --- overcast: a cloud deck -----------------------------------------------
  //
  // The daylight member of the scene class, and by a wide margin the cheapest:
  // four noise samples and some mixes, against voidstone's twenty-four cell
  // walks. A scene costs what its idea costs.
  //
  // The deck is read in projection rather than as a shell — a field divided by
  // elevation piles up toward the horizon, which is what makes a noise read as
  // a ceiling with a far edge instead of as fog in every direction. What is
  // below the horizon is haze, not more ceiling; see sceneDeck for the seam
  // that mirroring it produced.

  /** How much sky is filled. A threshold, so low values leave holes with edges. */
  float overcastCover() { return recipeVar.y; }
  /** Contrast between a billow's lit shoulder and its shadowed base. */
  float overcastDepth() { return recipeVar.z; }
  /** How fast the deck moves through itself. */
  float overcastDrift() { return recipeVar.w; }

  vec3 recipeOvercast(vec3 dir) {
    vec3 d = normalize(dir);
    float t = recipeTime() * 0.02 * overcastDrift();

    // Where the horizon is, and everything below is what the sky throws down
    // rather than the deck seen from underneath.
    float above = sceneAbove(d);
    vec2 plane = sceneDeck(d, 1.6) + vec2(t * 0.9, t * 0.35);

    // Three scales on their own clocks, so the deck shears through itself
    // rather than sliding across as one sheet — the layered-parallax argument
    // from voidstone, in two dimensions.
    float body = recipeFbm(vec3(plane * 0.9, t * 0.7)) * 0.55
      + recipeFbm(vec3(plane * 2.3 + 11.7, t * 1.15)) * 0.32
      + wearNoise(vec3(plane * 5.6 + 31.3, t * 1.9)) * 0.13;

    // **Coverage is a threshold, not a multiply.** A deck that simply thins out
    // everywhere reads as haze; what makes cloud read as cloud is that it has
    // an edge somewhere, and a threshold is the only cheap way to have one.
    float cover = overcastCover();
    float deck = smoothstep(0.60 - 0.34 * cover, 0.80 - 0.20 * cover, body);

    // Lit by difference against the same field sampled sunward. One extra
    // octave buys a billow that is bright on one side and dark on the other,
    // which is the entire reason a cloud has a shape.
    float ahead = recipeFbm(vec3(plane * 0.9 + vec2(0.62, 0.26), t * 0.7));
    float lit = saturate(0.5 + (ahead - body) * 3.2 * overcastDepth());

    vec3 gap = rampColour(recipeRamp(), 0.0);
    vec3 sky = mix(gap, rampColour(recipeRamp(), lit), deck);

    // The sun through it: broad rather than a disc, because a deck thick enough
    // to have a shape is thick enough to have no edge. Strongest where the
    // cloud is thin, which is where a real one silvers.
    float glow = pow(saturate(dot(d, sceneSun())), 5.0);
    sky += rampColour(recipeRamp(), 1.0) * (glow * 0.5 * (1.0 - deck * 0.65));

    // The horizon band, and below it the ground haze a portal has instead of a
    // floor. Faded *in* as the deck fades out, so the last few degrees before
    // the horizon are haze rather than a stretched, aliasing sheet — which is
    // what the projection gives if it is drawn all the way down.
    vec3 haze = mix(
      rampColour(recipeRamp(), 0.16),
      rampColour(recipeRamp(), 0.46),
      smoothstep(-0.45, 0.06, d.y)
    );
    haze += rampColour(recipeRamp(), 1.0) * (glow * 0.28);
    sky = mix(haze, sky, above);

    return recipeKnee(sky, 1.10);
  }
`;

export const overcast: Recipe = {
  name: 'overcast',
  glsl: GLSL,
  shared: SCENE_SHARED,
  params: ['cover', 'depth', 'drift'],
  variants: [
    {
      // A working overcast: nearly closed, moderate relief, slow.
      name: 'overcast',
      ramp: 'daylight',
      knobs: { gloss: 0, rim: 0, sunGlare: 0, envGain: 0 },
      params: [0.72, 1.0, 1.0],
    },
    {
      // High cirrocumulus over still water. Thin enough that the blue is never
      // covered, so the coverage comes right down and the ramp's low end is sky
      // rather than shadow — and almost still, because that altitude barely
      // moves in a lifetime of looking up at it.
      name: 'lakestill',
      ramp: 'lakestill',
      knobs: { gloss: 0, rim: 0, sunGlare: 0, envGain: 0 },
      params: [0.24, 0.7, 0.35],
    },
  ],
  slots: sceneSlots('recipeOvercast', 1.0),
};
