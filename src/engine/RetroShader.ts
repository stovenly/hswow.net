/**
 * Ordered dithering, colour quantization and vignette, in one pass.
 *
 * They are together rather than chained because they are not independent: the
 * dither has to be added to the colour *before* it is quantized — that is the
 * entire mechanism, trading spatial resolution for colour resolution — and the
 * vignette has to be applied before both, or its falloff is the smoothest
 * gradient on screen and bands worse than anything it was darkening.
 *
 * Runs after `OutputPass`, so it sees display-referred sRGB values. A palette
 * written as hex is an sRGB palette, and matching it against linear light
 * would pick the wrong colour for every swatch.
 */

/** Matches the array size in the shader. Raising it means editing both. */
export const MAX_PALETTE = 16;

export const RetroShader = {
  name: 'RetroShader',

  uniforms: {
    tDiffuse: { value: null as unknown },
    /** Device-pixel size of one chunky pixel, so the dither grid lines up. */
    uPixelSize: { value: 1 },
    uDither: { value: 0.06 },
    /** 0 Bayer, 1 blue noise, 2 interleaved gradient noise. */
    uPattern: { value: 1 },
    /** 2, 4 or 8 — the Bayer matrix edge. Ignored by the other patterns. */
    uMatrix: { value: 8 },
    /** The blue-noise mask, and its edge in texels. */
    tDither: { value: null as unknown },
    uDitherSize: { value: 64 },
    /** 0 none, 1 per-channel levels, 2 nearest palette entry. */
    uQuantize: { value: 1 },
    uLevels: { value: 8 },
    uPalette: { value: [] as number[] },
    uPaletteCount: { value: 0 },
    uVignette: { value: 0.35 },
    uVignetteRadius: { value: 0.55 },
    uVignetteSoftness: { value: 0.6 },
  },

  vertexShader: /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uPixelSize;
    uniform float uDither;
    uniform int uPattern;
    uniform float uMatrix;
    uniform sampler2D tDither;
    uniform float uDitherSize;
    uniform int uQuantize;
    uniform float uLevels;
    uniform vec3 uPalette[${MAX_PALETTE}];
    uniform int uPaletteCount;
    uniform float uVignette;
    uniform float uVignetteRadius;
    uniform float uVignetteSoftness;

    varying vec2 vUv;

    // The recursive Bayer construction, without the lookup table: each level
    // is the level below at half scale, plus a quarter of the 2x2 pattern.
    float bayer2(vec2 a) {
      a = floor(a);
      return fract(a.x * 0.5 + a.y * a.y * 0.75);
    }
    float bayer4(vec2 a) { return bayer2(a * 0.5) * 0.25 + bayer2(a); }
    float bayer8(vec2 a) { return bayer4(a * 0.5) * 0.25 + bayer2(a); }

    // Interleaved gradient noise. One line, no texture, and it breaks up flat
    // colour far better than Bayer does — though it keeps a faint diagonal
    // weave of its own, which is either character or a defect depending on
    // what you wanted.
    float interleavedGradient(vec2 a) {
      return fract(52.9829189 * fract(dot(floor(a), vec2(0.06711056, 0.00583715))));
    }

    float thresholdAt(vec2 cell) {
      if (uPattern == 1) {
        // Nearest-sampled and wrap-repeated, so one texel is one chunky pixel.
        return texture2D(tDither, (floor(cell) + 0.5) / uDitherSize).r;
      }
      if (uPattern == 2) return interleavedGradient(cell);
      if (uMatrix < 3.0) return bayer2(cell);
      if (uMatrix < 6.0) return bayer4(cell);
      return bayer8(cell);
    }

    // Squared distances throughout — the square root would not change which
    // swatch wins. Named 'd2' rather than 'distance' because that is a GLSL
    // built-in, and shadowing it is legal but upsets strict drivers.
    vec3 nearestInPalette(vec3 colour) {
      vec3 best = uPalette[0];
      float bestD2 = 1e9;

      for (int i = 0; i < ${MAX_PALETTE}; i++) {
        if (i >= uPaletteCount) break;
        // Weighted because the eye does not read the channels equally: green
        // carries most of the luminance and blue almost none, so an unweighted
        // distance picks swatches that measure close and look wrong.
        vec3 delta = (uPalette[i] - colour) * vec3(0.6, 1.0, 0.35);
        float d2 = dot(delta, delta);
        if (d2 < bestD2) {
          bestD2 = d2;
          best = uPalette[i];
        }
      }
      return best;
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec3 colour = texel.rgb;

      vec2 offset = vUv - 0.5;
      float radius = length(offset) * 2.0;
      colour *= 1.0 - uVignette * smoothstep(
        uVignetteRadius,
        uVignetteRadius + uVignetteSoftness,
        radius
      );

      // One threshold value per chunky pixel, not per screen pixel — a dither
      // finer than the pixelation reads as noise rather than as pattern.
      vec2 cell = gl_FragCoord.xy / max(uPixelSize, 1.0);
      colour += (thresholdAt(cell) - 0.5) * uDither;

      if (uQuantize == 1) {
        float steps = max(uLevels - 1.0, 1.0);
        colour = floor(colour * steps + 0.5) / steps;
      } else if (uQuantize == 2 && uPaletteCount > 0) {
        colour = nearestInPalette(colour);
      }

      gl_FragColor = vec4(clamp(colour, 0.0, 1.0), texel.a);
    }
  `,
};
