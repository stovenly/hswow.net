/**
 * The display encode, halftone dithering and colour quantization, in one pass.
 * They are together rather than chained because they are not independent: the
 * dither has to be resolved against the quantization — that is the entire
 * mechanism, trading spatial resolution for colour resolution — and both are only
 * correct on the display side of the sRGB conversion.
 *
 * There is no palette here. Every surface is flat-shaded vertex colour, lit,
 * fogged and tone-mapped; this pass quantizes what it is given and does not decide
 * what the game is allowed to look like.
 *
 * There are no textures anywhere in this game, so the quantizer is the surface
 * treatment — which is the whole reason for a clustered dot rather than an ordered
 * matrix or a noise mask: a print screen across a flat face reads as a material.
 */

/** Which colour deficiency the correction below is aimed at. Named for the condition rather than for the colours, because that is what somebody who has one knows it as. */
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
    uniform int uColorblind;
    uniform float uColorblindStrength;

    varying vec2 vUv;

    /**
     * Linear light to display sRGB. (No backticks: this is a template literal, and
     * one would end it mid-GLSL.) Its constant is 0.41666 rather than 1.0 / 2.4:
     * folding this in here was meant to stop paying for a pass, not to change what
     * one produces. The correction's own round trip below keeps its own exponent.
     */
    vec4 encodeSrgb(vec4 v) {
      return vec4(
        mix(pow(v.rgb, vec3(0.41666)) * 1.055 - vec3(0.055), v.rgb * 12.92,
            vec3(lessThanEqual(v.rgb, vec3(0.0031308)))),
        v.a
      );
    }

    /**
     * Colour vision deficiency correction, not simulation. A simulation shows a
     * player with normal vision what a player without it sees; what the person
     * playing needs is the opposite — the information their eye cannot separate
     * moved into channels it can. Correction still needs simulation inside it:
     * predict what the deficient eye receives, subtract it from what was sent, and
     * push the remainder into the channels that still work.
     *
     * (No backticks anywhere below: this is a template literal.)
     *
     * It runs in linear light. The widely-copied shader applies its cone matrices
     * straight to gamma-encoded values, and cone response is linear in light where
     * sRGB is not — so it decodes, works, and re-encodes, three pow calls each way.
     *
     * All three types use Brettel 1997, whose surviving colours form two
     * half-planes meeting along the neutral axis, decided per pixel. The
     * single-matrix Viénot projection everyone uses is valid only for protanopia
     * and deuteranopia; using one plane for tritanopia is wrong on roughly half
     * the gamut. Constants are libDaltonLens's, from Smith & Pokorny cone
     * fundamentals.
     */
    vec3 srgbToLinear(vec3 c) {
      return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), c));
    }

    vec3 linearToSrgb(vec3 c) {
      return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
    }

    /**
     * What a dichromat's eye receives, given linear RGB. The plane is chosen by
     * which side of a separating plane the colour falls on — the sign test below,
     * and the entire difference between Brettel and the approximations.
     */
    vec3 simulate(vec3 c) {
      vec3 normal;
      mat3 planeA;
      mat3 planeB;

      // Transposed from how they are published: a mat3 built from nine floats fills
      // its columns in order, and every source writes these out as rows. Getting it
      // backwards still compiles and still produces a colour.
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

      // Where the lost information goes. The simulation is settled science and the
      // redistribution is a design choice, since it asks what to do with information
      // the eye cannot receive. A red-green deficiency has its red error spread into
      // green and blue; blue-yellow is the mirror, and has to be — the same matrix
      // for all three would push a blue error back into the cone that cannot read it.
      vec3 shift = uColorblind == 3
        ? vec3(error.r + 0.7 * error.b, error.g + 0.7 * error.b, 0.0)
        : vec3(0.0, 0.7 * error.r + error.g, 0.7 * error.r + error.b);

      return linearToSrgb(clamp(linear + shift, 0.0, 1.0));
    }

    /**
     * Clustered-dot halftone: the classic rotated cosine spot function, whose level
     * sets are round through the middle of the range and square off toward the ends.
     * Rotated 45 degrees, because square to the pixel grid it beats against the
     * pixelation and reads as a plaid. The tone response is exact at the mid-point
     * and compressed at both extremes, as every halftone's is, which is why the
     * levels count is high.
     */
    float halftone(vec2 cell, float period) {
      vec2 q = vec2(cell.x + cell.y, cell.x - cell.y) * 0.70710678 / period;
      return 0.5 - 0.25 * (cos(6.2831853 * q.x) + cos(6.2831853 * q.y));
    }

    /**
     * Quantizes to N levels per channel, dithering in linear light. Adding a
     * threshold to the colour and rounding is wrong in a way that is easy to miss:
     * the eye and the display average two adjacent chunky pixels in linear light,
     * but the quantizer works on display-referred sRGB, so a half-and-half dither
     * between 0 and 1 reads as 0.73 rather than 0.5.
     *
     * So instead: find the two levels the colour falls between and solve for the
     * proportion of the brighter one whose linear average is the colour asked for.
     * Gamma 2.0 rather than the exact sRGB curve — indistinguishable here, and it
     * moves a ratio rather than a decision. uDitherScale is how many quantization
     * steps the dither spreads across; at 1 every tone is reproduced exactly.
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
      // The chunky colour, sampled nearest by the upscale that owns this
      // material, and encoded for the display here rather than one pass ago.
      vec4 texel = encodeSrgb(texture2D(tDiffuse, vUv));
      vec3 colour = texel.rgb;

      // Before the quantizer, not after: the correction moves colours by small
      // amounts, and doing it last would move them off the levels the dither is
      // resolving between — the halftone would still be there but would no longer be
      // dithering toward anything, and flat faces would come back banded.
      if (uColorblind != 0) {
        colour = mix(colour, correctColour(colour), clamp(uColorblindStrength, 0.0, 1.0));
      }

      if (uQuantize == 1) {
        // One threshold value per chunky pixel, not per screen pixel: every device
        // pixel inside a chunky block carries the same colour, so a threshold varying
        // within the block would dither inside it and dissolve the pixelation. The
        // dot cell is therefore counted in chunky pixels.
        vec2 cell = gl_FragCoord.xy / max(uPixelSize, 1.0);
        colour = quantizeLevels(colour, halftone(cell, max(uPeriod, 2.0)));
      }

      gl_FragColor = vec4(clamp(colour, 0.0, 1.0), texel.a);
    }
  `,
};
