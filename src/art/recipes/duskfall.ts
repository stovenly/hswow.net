import { SCENE_SHARED, sceneSlots } from '../glsl/sky';
import type { Recipe } from './types';

const GLSL = /* glsl */ `
  // --- duskfall: a setting sun ----------------------------------------------
  //
  // The cheapest scene in the class: a gradient, a disc and one band of strata.
  // No loops at all, which makes it the answer whenever a portal is wanted on
  // something that covers a lot of screen.
  //
  // Read by elevation, and **crammed into the bottom on purpose**. A sunset
  // mapped linearly up the sky is a gradient; what makes it a sunset is that
  // the whole event happens in the few degrees above the horizon and the rest
  // is already night.

  /** How far up the sky the event reaches. Bigger is a tighter, lower sunset. */
  float duskSpread() { return recipeVar.y; }
  /** How bright the disc and its halo burn. */
  float duskSun() { return recipeVar.z; }
  /** Strata drift. */
  float duskDrift() { return recipeVar.w; }

  vec3 recipeDusk(vec3 dir) {
    vec3 d = normalize(dir);
    float t = recipeTime() * 0.010 * duskDrift();

    // Squared, so the ramp's warm end is spent near the horizon and its cold
    // end covers most of the dome.
    float band = 1.0 - saturate(d.y * duskSpread() + 0.12);
    vec3 sky = rampColour(recipeRamp(), band * band);

    vec3 toSun = sceneSun();
    float near = dot(d, toSun);
    // Two powers: a tight core for the disc's bloom and a broad one for the
    // glare that washes the quarter of sky the sun is in.
    float halo = pow(saturate(near), 220.0) * 0.90 + pow(saturate(near), 14.0) * 0.22;
    sky += rampColour(recipeRamp(), 1.0) * (halo * duskSun());
    // The disc itself, hard-edged. A sun with a soft edge is a lamp.
    float disc = smoothstep(0.9975, 0.9990, near);
    sky = mix(sky, vec3(1.55, 1.34, 1.02) * duskSun(), disc);

    // Strata: long thin clouds stretched along the horizon, because a layer is
    // thin in exactly one direction and that is the one you see it in.
    vec2 plane = vec2(atan(d.z, d.x) * 1.6 + t, d.y * 9.0);
    float lines = recipeFbm(vec3(plane * vec2(1.0, 2.2), t * 0.6)) * 0.62
      + recipeFbm(vec3(plane * vec2(2.7, 5.5) + 7.3, t * 0.9)) * 0.38;
    float bar = smoothstep(0.56, 0.74, lines) * smoothstep(0.42, 0.10, abs(d.y - 0.06));
    // **Underlit.** A cloud at dusk is a dark shape against a bright sky except
    // where the sun reaches beneath it, and that contrast is the whole reason
    // to draw one — a cloud lit from above at sunset looks like midday cut out
    // and pasted on.
    vec3 shape = mix(
      vec3(0.05, 0.035, 0.06),
      rampColour(recipeRamp(), 0.92),
      pow(saturate(near * 0.5 + 0.5), 3.0)
    );
    sky = mix(sky, shape, bar * 0.85);

    return recipeKnee(sky, 1.35);
  }
`;

export const duskfall: Recipe = {
  name: 'duskfall',
  glsl: GLSL,
  shared: SCENE_SHARED,
  params: ['spread', 'sun', 'drift'],
  // Three hours of one day, on one field. Nothing structural separates them —
  // a ramp, how far up the sky the light reaches, and how hard the sun burns.
  variants: [
    {
      // Evening: rose over gold, a low sun, slow strata.
      name: 'duskstone',
      ramp: 'dusk',
      knobs: { gloss: 0, rim: 0, sunGlare: 0, envGain: 0 },
      params: [2.4, 1.0, 1.0],
    },
    {
      // Morning, and the difference is not the hour — it is the air. A night's
      // cold has dropped the dust out of it, so the colour is cleaner and paler
      // than an evening's and reaches a little further up. The strata barely
      // move, because nothing has had time to stir yet.
      name: 'dawnstone',
      ramp: 'dawn',
      knobs: { gloss: 0, rim: 0, sunGlare: 0, envGain: 0 },
      params: [2.0, 0.85, 0.55],
    },
    {
      // Broad daylight: the gradient spread over the whole dome instead of
      // crammed into the last few degrees, so what is left is zenith blue,
      // horizon haze and a hard bright sun. **The one that is not an event** —
      // nothing is happening in it, which makes it the one to put behind
      // something that has to be looked at for a while.
      name: 'daystone',
      ramp: 'day',
      knobs: { gloss: 0, rim: 0, sunGlare: 0, envGain: 0 },
      params: [0.85, 1.35, 1.2],
    },
  ],
  slots: sceneSlots('recipeDusk', 1.0),
};
