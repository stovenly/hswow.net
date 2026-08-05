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

/**
 * Which colour deficiency the correction below is aimed at.
 *
 * Named for the condition rather than for the colours involved, because that
 * is what somebody who has one knows it as — a player who has been told they
 * have deuteranomaly will not find themselves under "red/green".
 */
export type ColorblindMode = 'off' | 'protanopia' | 'deuteranopia' | 'tritanopia';

/** The shader takes an int; this is the only place the two agree. */
export const COLORBLIND_CODE: Record<ColorblindMode, number> = {
  off: 0,
  protanopia: 1,
  deuteranopia: 2,
  tritanopia: 3,
};

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
    /** 0 off, 1 protanopia, 2 deuteranopia, 3 tritanopia. */
    uColorblind: { value: 0 },
    /** How much of the correction to apply, 0..1. */
    uColorblindStrength: { value: 1 },
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
    uniform int uColorblind;
    uniform float uColorblindStrength;

    varying vec2 vUv;

    /**
     * Colour vision deficiency **correction**, not simulation.
     *
     * The distinction matters and it is the whole design of this block. A
     * simulation shows a player with normal vision what a player without it
     * sees; it is a tool for the person making the game. What the person
     * playing needs is the opposite — the information their eye cannot
     * separate moved into channels it can — and that is what happens here.
     * Turning it on should make more of the world legible, not less.
     *
     * Correction still needs simulation inside it, and that is the whole
     * method: predict what the deficient eye receives, subtract it from what
     * was sent, and the remainder is precisely the information that was lost.
     * Push that into the channels that still work.
     *
     * ## Two things this gets right that most implementations do not
     *
     * (No backticks anywhere below: this is a template literal, and one would
     * end it mid-GLSL. The same note is on the sway patch, for the same
     * reason, after making the same mistake.)
     *
     * **It runs in linear light.** The widely-copied shader — Fidaner, Lin &
     * Ozguven's, which is where the 17.8824 / 43.5161 cone matrix in every
     * daltonize snippet comes from — applies those matrices straight to
     * gamma-encoded values. Cone response is linear in light and sRGB is not,
     * so the matrices are being fed numbers that are not what they describe;
     * DaltonLens measured the result and a whole range of colours comes out
     * far too dark. This pass runs *after* OutputPass, so it is handed sRGB
     * and has to decode, work, and re-encode. Three pow calls each way, only
     * when the filter is on.
     *
     * **Tritanopia uses two half-planes.** The single-matrix projection
     * everyone uses is Viénot 1999, and its own authors say it is only valid
     * for protanopia and deuteranopia — the blue axis needs Brettel 1997,
     * where the surviving colours form *two* half-planes meeting along the
     * neutral axis and which one a colour belongs to is decided per pixel.
     * Using one plane for tritanopia is not a small error; it is wrong on
     * roughly half the gamut. All three types use Brettel here, because once
     * the branch exists there is no reason to keep a second code path that is
     * only nearly as good.
     *
     * Constants are libDaltonLens's, which derive them from Smith & Pokorny
     * cone fundamentals — the ones the original perceptual experiments were
     * run against.
     */
    vec3 srgbToLinear(vec3 c) {
      return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), c));
    }

    vec3 linearToSrgb(vec3 c) {
      return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
    }

    /**
     * What a dichromat's eye receives, given linear RGB.
     *
     * The plane is chosen by which side of a separating plane the colour falls
     * on — that is the sign test below, and it is the entire difference
     * between Brettel and the single-matrix approximations.
     */
    vec3 simulate(vec3 c) {
      vec3 normal;
      mat3 planeA;
      mat3 planeB;

      // **Transposed from how they are published.** A mat3 built from nine
      // floats fills its *columns* in order, and every source writes these
      // out as rows — so each group of three below is one column of the
      // published matrix, not one row of it. Getting this backwards still
      // compiles and still produces a colour, which is the worst kind of
      // wrong: it looks like a filter doing something.
      if (uColorblind == 1) {
        normal = vec3(0.00048, 0.00393, -0.00441);
        planeA = mat3(0.14980, 0.10764, 0.00384, 1.19548, 0.84864, -0.00540, -0.34528, 0.04372, 1.00156);
        planeB = mat3(0.14570, 0.10816, 0.00386, 1.16172, 0.85291, -0.00524, -0.30742, 0.03892, 1.00139);
      } else if (uColorblind == 2) {
        normal = vec3(-0.00281, -0.00611, 0.00892);
        planeA = mat3(0.36477, 0.26294, -0.02006, 0.86381, 0.64245, 0.02728, -0.22858, 0.09462, 0.99278);
        planeB = mat3(0.37298, 0.25954, -0.01980, 0.88166, 0.63506, 0.02784, -0.25464, 0.10540, 0.99196);
      } else {
        normal = vec3(0.03901, -0.02788, -0.01113);
        planeA = mat3(1.01277, -0.01243, 0.07589, 0.13548, 0.86812, 0.80500, -0.14826, 0.14431, 0.11911);
        planeB = mat3(0.93678, 0.06154, -0.37562, 0.18979, 0.81526, 1.12767, -0.12657, 0.12320, 0.24796);
      }

      return dot(c, normal) >= 0.0 ? planeA * c : planeB * c;
    }

    /**
     * The corrected colour, given sRGB in and sRGB out.
     */
    vec3 correctColour(vec3 srgb) {
      vec3 linear = srgbToLinear(clamp(srgb, 0.0, 1.0));
      vec3 error = linear - simulate(linear);

      // Where the lost information goes.
      //
      // There is no canonical answer to this half — the simulation is settled
      // science and the redistribution is a design choice, since it is asking
      // what to do with information the eye cannot receive at all. These are
      // the long-standing daltonize weights: a red-green deficiency has its
      // red error spread into green and blue, which are the axes still being
      // read.
      //
      // Blue-yellow is the mirror, and has to be. The same matrix used for all
      // three would push a blue error back into blue — handing it to the cone
      // that cannot read it, so the correction corrects nothing while looking
      // like it is doing something.
      vec3 shift = uColorblind == 3
        ? vec3(error.r + 0.7 * error.b, error.g + 0.7 * error.b, 0.0)
        : vec3(0.0, 0.7 * error.r + error.g, 0.7 * error.r + error.b);

      return linearToSrgb(clamp(linear + shift, 0.0, 1.0));
    }

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

      // **Before the quantizer, not after.** The correction moves colours by
      // small amounts, and doing it last would move them off the levels the
      // dither is resolving between — the halftone would still be there but it
      // would no longer be dithering toward anything, and flat faces would
      // come back banded. Corrected first, the output still lands exactly on
      // the levels per channel the look is built on.
      if (uColorblind != 0) {
        colour = mix(colour, correctColour(colour), clamp(uColorblindStrength, 0.0, 1.0));
      }

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
