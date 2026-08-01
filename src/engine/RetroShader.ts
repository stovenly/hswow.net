/**
 * Halftone dithering, colour quantization and vignette, in one pass.
 *
 * They are together rather than chained because they are not independent: the
 * dither has to be resolved *against* the quantization — that is the entire
 * mechanism, trading spatial resolution for colour resolution — and the
 * vignette has to be applied before both, or its falloff is the smoothest
 * gradient on screen and bands worse than anything it was darkening.
 *
 * Runs after `OutputPass`, so it sees display-referred sRGB values.
 *
 * ## The colour comes from the scene
 *
 * There is no palette here and there is not going to be one. Every surface in
 * this game is flat-shaded vertex colour out of `art/palette.ts`, lit, fogged
 * and tone-mapped — that is the colour set, it is continuous, and it changes
 * whenever the art changes. This pass quantizes what it is given. It does not
 * decide what the game is allowed to look like.
 *
 * A previous version could match against a fixed sixteen-colour palette. It
 * was removed: replacing every pixel in the game with one of sixteen authored
 * swatches is art direction imposed by the renderer, and it drained the colour
 * out of everything.
 *
 * ## The dither is the texture
 *
 * There are no textures anywhere in this game, so the quantizer *is* the
 * surface treatment. That is the whole reason for a clustered dot rather than
 * an ordered matrix or a noise mask: a print screen across a flat face reads
 * as a material, where the others read as anti-banding.
 *
 * Bayer, blue noise, gradient noise, line and crosshatch screens were all
 * built and all removed once this one was chosen. They are in the history if
 * one is ever wanted back.
 */

export const RetroShader = {
  name: 'RetroShader',

  uniforms: {
    tDiffuse: { value: null as unknown },
    /** Device-pixel size of one chunky pixel, so the dither grid lines up. */
    uPixelSize: { value: 1 },
    /** Dither spread, in quantization steps. 1 is a full step; see `ditherScale`. */
    uDitherScale: { value: 1.65 },
    /** Dot cell in chunky pixels. */
    uPeriod: { value: 3 },
    /** 0 none, 1 per-channel levels. */
    uQuantize: { value: 1 },
    uLevels: { value: 16 },
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
    uniform float uDitherScale;
    uniform float uPeriod;
    uniform int uQuantize;
    uniform float uLevels;
    uniform float uVignette;
    uniform float uVignetteRadius;
    uniform float uVignetteSoftness;

    varying vec2 vUv;

    /**
     * Clustered-dot halftone: the classic rotated cosine spot function, whose
     * level sets are round through the middle of the range and square off
     * towards the ends.
     *
     * Rotated 45 degrees because that is where a print screen sits — square to
     * the pixel grid it beats against the pixelation and reads as a plaid.
     *
     * Honestly caveated: the tone response is exact at the mid-point and
     * compressed at both extremes, because a growing dot covers area slowly at
     * first and then has only the corners left to fill at the end. Every
     * halftone has this. It is why the levels count is high — at five, the
     * compression lands on the few tones there are and the whole thing reads
     * as a coarse repeating tile.
     */
    float halftone(vec2 cell, float period) {
      vec2 q = vec2(cell.x + cell.y, cell.x - cell.y) * 0.70710678 / period;
      return 0.5 - 0.25 * (cos(6.2831853 * q.x) + cos(6.2831853 * q.y));
    }

    /**
     * Quantizes to N levels per channel, dithering **in linear light**.
     *
     * The old form added the threshold to the colour and rounded. That is
     * wrong in a way that is easy to miss and affects every pixel in the game:
     * the eye and the display average two adjacent chunky pixels in *linear*
     * light, but this pass runs after OutputPass on display-referred sRGB. A
     * half-and-half dither between 0 and 1 therefore reads as 0.73, not as
     * 0.5, so every tone between two levels came out too bright — at five
     * levels, the middle of the first band was 41% high.
     *
     * So instead of nudging and rounding: find the two levels the colour falls
     * between, and solve for the *proportion* of the brighter one whose linear
     * average is the colour asked for. That proportion is the threshold to
     * compare against. Gamma 2.0 (c * c) rather than the exact sRGB curve —
     * visually indistinguishable here, three multiplies instead of a pow
     * chain, and it moves a ratio rather than a decision.
     *
     * uDitherScale is how many quantization steps the dither spreads across.
     * At 1 the whole gap dithers and every tone is reproduced exactly. Below
     * 1 the ends of each band go flat and some banding survives on purpose.
     * Above 1 nothing is ever flat, which is what keeps the dots visible as a
     * texture rather than only at the band boundaries.
     */
    vec3 quantizeLevels(vec3 colour, float threshold) {
      float steps = max(uLevels - 1.0, 1.0);

      vec3 scaled = clamp(colour, 0.0, 1.0) * steps;
      // At pure white the colour sits exactly on the top level and would name
      // a bracket one past the end; back it off so the pair is always real.
      vec3 lower = min(floor(scaled), vec3(steps - 1.0));

      vec3 low = lower / steps;
      vec3 high = (lower + 1.0) / steps;

      vec3 a = low * low;
      vec3 b = high * high;
      vec3 target = colour * colour;
      vec3 ratio = clamp((target - a) / max(b - a, vec3(1e-6)), 0.0, 1.0);

      // Spread the transition over uDitherScale of a step, centred on the
      // half-way point, so the knob widens or narrows the dithered band
      // without moving where it sits.
      ratio = clamp((ratio - 0.5) / max(uDitherScale, 0.001) + 0.5, 0.0, 1.0);

      return mix(low, high, step(vec3(threshold), ratio));
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

      if (uQuantize == 1) {
        // One threshold value per chunky pixel, not per screen pixel. It has
        // to be: every device pixel inside a chunky block carries the same
        // colour, so a threshold that varied within the block would dither
        // *inside* it and dissolve the pixelation. The consequence is that the
        // dot cell is counted in chunky pixels, and its size on screen is
        // therefore uPeriod times uPixelSize.
        vec2 cell = gl_FragCoord.xy / max(uPixelSize, 1.0);
        colour = quantizeLevels(colour, halftone(cell, max(uPeriod, 2.0)));
      }

      gl_FragColor = vec4(clamp(colour, 0.0, 1.0), texel.a);
    }
  `,
};
