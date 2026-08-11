import { RAMP_ROW } from '../glsl/ramp';
import { RECIPE_INDEX, type Recipe } from './types';

const GLSL = /* glsl */ `
  // --- voidstone ------------------------------------------------------------
  //
  // A night sky as a function of direction. Layers drift on their own axes at
  // their own rates, which is what makes it a volume rather than a turntable.

  vec3 recipeDrift(vec3 d, float rate, vec3 axis) {
    float a = recipeTime() * rate;
    float c = cos(a);
    float s = sin(a);
    return d * c + cross(axis, d) * s + axis * dot(axis, d) * (1.0 - c);
  }

  /**
   * A dense field of faint stars.
   *
   * Gaussian rather than a thresholded disc: a hard edge on a point smaller
   * than a pixel is a lit pixel with an aliased boundary, which is what the
   * single-pixel specks were. A gaussian has no edge to alias, stays smooth at
   * any size, and is what a defocused point source actually looks like.
   *
   * Magnitudes follow a power law, so most of the field is far below the
   * threshold of notice and the few that are not carry the sky.
   */
  vec3 recipeStarDust(vec3 d, float density, float size, float rarity) {
    vec3 p = d * density;
    // A star smaller than a pixel widens to pixel size and dims to conserve
    // energy, so distance fades the field instead of deleting it.
    float px = length(fwidth(p)) * 0.55;
    // The eight cells around the point, so a star's kernel is drawn whole
    // from every side instead of being sliced off at its own cell wall.
    vec3 corner = floor(p - 0.5);
    vec3 total = vec3(0.0);
    for (int i = 0; i <= 1; i++) {
      for (int j = 0; j <= 1; j++) {
        for (int k = 0; k <= 1; k++) {
          vec3 c = corner + vec3(float(i), float(j), float(k));
          vec3 draw = finishHash3(c);
          float magnitude = pow(draw.z, rarity);
          vec3 delta = p - (c + 0.25 + finishHash3(c + 31.7) * 0.5);
          float radius = size * (0.45 + magnitude);
          float r2 = radius * radius;
          float r2eff = r2 + px * px;
          // Super-gaussian: a flat bright core with a fast clean falloff, so
          // a star is a point of light rather than a smudge, and alias-free.
          float g = dot(delta, delta) / r2eff;
          float star = exp(-g * g) * (r2 / r2eff);
          total += rampColour(${RAMP_ROW.star}, draw.y) * (star * magnitude);
        }
      }
    }
    return total;
  }

  /**
   * The bright few, with halos and a slow twinkle.
   *
   * Searched over the eight cells around the point rather than only its own, so
   * a halo crosses cell walls instead of being clipped by them, and two stars
   * can sit close together the way real ones do.
   */
  vec3 recipeStarBright(vec3 d, float density, float size, float rarity, float twinkle) {
    vec3 p = d * density;
    float px = length(fwidth(p)) * 0.55;
    // Centred on the point, not forward-biased: a star just behind a wall
    // would otherwise have its halo and spikes clipped by it.
    vec3 corner = floor(p - 0.5);
    vec3 total = vec3(0.0);
    for (int i = 0; i <= 1; i++) {
      for (int j = 0; j <= 1; j++) {
        for (int k = 0; k <= 1; k++) {
          vec3 c = corner + vec3(float(i), float(j), float(k));
          vec3 draw = finishHash3(c);
          float magnitude = pow(draw.z, rarity);
          if (magnitude < 0.06) continue;

          // Two unrelated fast beats, each star on its own phase and rate.
          float beat = recipeTime() * (1.4 + draw.x * 2.3) + draw.y * 6.2831853;
          float shimmer = 1.0 - twinkle * 0.30
            * (0.5 + 0.5 * sin(beat)) * (0.65 + 0.35 * sin(beat * 0.37 + 1.7));
          magnitude *= shimmer;

          vec3 delta = p - (c + finishHash3(c + 31.7));
          float r2 = dot(delta, delta);
          float radius = size * (0.45 + 0.55 * magnitude);
          // Widened to at least a pixel and dimmed to match, as in the dust.
          float rr = radius * radius;
          float r2eff = rr + px * px;
          float g = r2 / r2eff;
          float core = exp(-g * g) * (rr / r2eff);
          // A weak halo: the scatter an eye adds to anything bright.
          float halo = exp(-r2 / (rr * 9.0)) * 0.08;
          // The brightest carry four-point diffraction spikes, narrow across
          // and long along, sharing one orientation like a lens flare does.
          float bright = smoothstep(0.55, 0.90, magnitude);
          if (bright > 0.0) {
            float w2 = rr * 0.16 + px * px;
            float l2 = rr * 14.0;
            float spikes =
              exp(-(delta.y * delta.y + delta.z * delta.z) / w2 - delta.x * delta.x / l2)
              + exp(-(delta.x * delta.x + delta.z * delta.z) / w2 - delta.y * delta.y / l2);
            core += spikes * bright * 0.55 * (rr * 0.16 / w2);
          }
          total += rampColour(${RAMP_ROW.star}, draw.y) * ((core + halo) * magnitude);
        }
      }
    }
    return total;
  }

  vec3 recipeVoid(vec3 dir) {
    vec3 d = normalize(dir);
    float band = 1.0 - smoothstep(0.0, 0.5, abs(dot(d, vec3(0.31, 0.86, -0.41))));
    float crowd = 0.3 + 0.7 * band;

    vec3 slow = recipeDrift(d, 0.016, normalize(vec3(0.2, 1.0, 0.1)));
    float broad = smoothstep(0.40, 0.90, recipeFbm(slow * 2.6 + 4.7));
    float tight = smoothstep(0.52, 0.95, recipeFbm(slow * 6.1 + 21.3));
    float haze = recipeFbm(slow * 1.2 + 31.7);
    vec3 cool = mix(vec3(0.05, 0.03, 0.17), vec3(0.02, 0.10, 0.16), wearNoise(slow * 1.4));
    vec3 warm = mix(vec3(0.16, 0.05, 0.13), vec3(0.13, 0.09, 0.04), wearNoise(slow * 2.2 + 8.1));

    vec3 base = vec3(0.010, 0.012, 0.030) + vec3(0.020, 0.014, 0.040) * haze;
    vec3 cloud = cool * (broad * (0.55 + 0.75 * band))
      + warm * (tight * broad * (0.50 + 0.80 * band));

    // Two planes only: star fields behind the nebula, dimmed by it, and the
    // sharp bright stars in front. No dust is ever drawn over the clouds.
    //
    // Layer offsets are added AFTER the drift rotation. Added before, the
    // rotation spins the offset vector too, which turns a slow rotation into
    // a fast translation — the whole field sweeps across the window instead
    // of drifting in place.
    // Every plane turns at its own rate on its own axis, slowest at the back
    // and fastest in front (the nebula's 0.016 sits between), so the layers
    // shear against each other and the sky reads as a volume.
    vec3 far = recipeDrift(d, 0.0088, normalize(vec3(0.1, 1.0, 0.25)));
    vec3 far2 = recipeDrift(d, 0.0120, normalize(vec3(0.35, 1.0, -0.15))) + 3.0;
    vec3 near = recipeDrift(d, 0.0300, normalize(vec3(-0.3, 0.8, 0.5))) + 17.0;

    float behind = 1.0 - 0.80 * broad * (0.4 + 0.6 * band);
    vec3 sky = base
      + recipeStarDust(far, 135.0, 0.13, 9.0) * (1.4 * crowd) * behind
      + recipeStarDust(far2, 92.0, 0.14, 7.5) * (1.05 * crowd) * behind;
    sky += cloud;
    sky += recipeStarBright(near, 23.0, 0.10, 9.0, 1.0) * 1.35;
    // Kneed: a star that clips is a white disc, and the shape of a star is the
    // only thing that says it is one.
    return recipeKnee(sky, 0.90);
  }
`;

export const voidstone: Recipe = {
  name: 'voidstone',
  index: RECIPE_INDEX.voidstone,
  glsl: GLSL,
  // The void is not a sky reflection, so its gain is its own business.
  knobs: { gloss: 0, rim: 0, sunGlare: 0, envGain: 0 },
  slots: {
    envSource: /* glsl */ `
      // Voidstone ignores uFinishSky: the sky is in the stone, indoors too.
      // The raw view ray, untouched: every fragment looks straight out
      // along its own eye ray, so the stone is a flat window on the
      // void at every angle.
      finishEnv = recipeVoid(inverseTransformDirection(-geometryViewDir, viewMatrix));
    `,
    ambient: /* glsl */ `
      // Flat: what you are looking at is behind the surface, so it is
      // not rationed by how obliquely you meet that surface.
      reflectedLight.indirectSpecular += finishEnv * (1.05 * uFinishEnv);
    `,
  },
};
