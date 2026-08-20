/**
 * The art kit's colours, named by material rather than by hue — `BARK`, not
 * `BROWN` — so changing what bark looks like is one edit here instead of a hunt
 * through every builder.
 *
 * Placeholder art direction: cold stone and slate against warm earth and wood,
 * chosen to survive the pipeline's per-channel quantization, where colours that
 * differ in hue stay distinct and colours differing only in brightness collapse
 * together. The specific colours are the repo owner's to replace.
 */

export const PALETTE = {
  BARK: 0x463b30,
  BARK_PALE: 0x574a3c,
  LEAF: 0x4f6039,
  LEAF_DARK: 0x3d4c2c,
  LEAF_DRY: 0x6b6a3c,

  GRASS: 0x5c6b3a,
  GRASS_DRY: 0x7a7444,

  /**
   * Worked stone and sawn timber — the two materials nearly every building is.
   * Lifted about 40% in luminance at constant chroma: multiplying every channel
   * by one factor does not lighten a colour, it saturates it, because the gap
   * between the channels widens. Lifting toward white keeps that gap the same in
   * absolute terms, which the eye reads as more light on the same material.
   * `BARK` deliberately did not move with them — a tree sits darker than the
   * buildings, or a village never separates from its treeline.
   */
  STONE: 0x969aa0,
  STONE_DARK: 0x757a80,
  STONE_PALE: 0xaeb2b6,

  EARTH: 0x4c4536,
  TIMBER: 0x8a7362,
  TIMBER_DARK: 0x6b5a4d,
  /** Sun-bleached softwood, the lightest timber in the kit. Three door types need three legible woods, and the darkest of them took `TIMBER_DARK`. */
  TIMBER_PALE: 0xa89376,

  IRON: 0x5a5f63,
  IRON_DARK: 0x3f4448,
  /**
   * The pale end of the metal, for machine casings and plant bodies. Cooler than
   * the stones rather than merely darker, and that is the point: `IRON` and
   * `STONE_DARK` are the same hue at different brightness, so iron could not be
   * told from stone by colour at all. This has nearly twice the blue-over-red of
   * any stone, so the two families separate on hue and survive quantization.
   */
  IRON_PALE: 0x6d757e,
  RUST: 0x7a4a30,
  /** Cast bronze, and what it goes when it has stood outside for a century. Two entries, because a bell is nearly always both. */
  BRONZE: 0x8a7038,
  PATINA: 0x5c7060,
  /**
   * Gilding — leaf, not cast metal. Bright, because on a metal this is not a
   * colour but the reflectance: a metal has no diffuse at all, so everything you
   * see is the sky and the sun arriving through this multiply. The blue channel
   * decides whether daylight comes back as gold or as clay. Set as sRGB and
   * linearised on the way in, so it is brighter here than it looks.
   */
  GOLD: 0xf2ce6b,
  /** Bright plate for the chrome finish. A metal's reflection is tinted by its
   * own colour, so chrome has to be nearly white or the sky comes back grey. */
  CHROME: 0xd9dcdf,
  /** Standing water seen from above. Dark and desaturated: there are no reflections here, and a bright blue panel in a trough reads as painted tin. */
  WATER: 0x2c3f46,
  /** The colour of a flame seen directly, not of anything lit by one. Only ever on `GLOW_MATERIAL`, which is additive and unlit, so it is an amount of light to add. */
  LAMPLIGHT: 0xffe0a8,
  CLOTH: 0x8d8672,
  /** Dyed cloth, the deep end. Dark on purpose: sheen is a rim of the surface's own colour, and a pale cloth has no room above itself to show one. */
  CLOTH_DEEP: 0x6d3242,
  SKIN: 0xa8927a,

  /**
   * Lettering and painted marks. Very dark and slightly warm rather than black:
   * pure black is the one value the quantizer cannot dither against anything, and
   * lamp-black paint on timber was never black anyway. Legibility is carried by
   * the luminance gap against whatever the letters sit on.
   */
  INK: 0x2b2620,

  HIDE: 0x6d5641,
  HIDE_DARK: 0x413429,
  HIDE_PALE: 0xa29075,
  WOOL: 0xbdb6a4,
  HOG: 0xa8807a,
  FOWL: 0x9c8f77,
  COMB: 0x9c4234,
  MARKER_YELLOW: 0xc9a04a,
  COW_BLACK: 0x24211f,
} as const;

export type PaletteName = keyof typeof PALETTE;

/**
 * Multiplies a colour's brightness, clamped per channel — for giving the boards
 * of a floor or a door leaf slightly different timber. Operates on the packed hex
 * rather than through `THREE.Color`, which would convert into linear space and
 * back, and make a factor of 1.1 mean something different for a dark colour than
 * for a light one.
 */
export function shade(hex: number, factor: number): number {
  const r = Math.min(255, Math.round(((hex >> 16) & 0xff) * factor));
  const g = Math.min(255, Math.round(((hex >> 8) & 0xff) * factor));
  const b = Math.min(255, Math.round((hex & 0xff) * factor));
  return (r << 16) | (g << 8) | b;
}

/** Mixes two packed colours, in sRGB for `shade`'s reason: a half-way blend has to land half-way to the eye. */
export function blend(a: number, b: number, t: number): number {
  const k = t < 0 ? 0 : t > 1 ? 1 : t;
  const mix = (shift: number): number => {
    const from = (a >> shift) & 0xff;
    return Math.round(from + (((b >> shift) & 0xff) - from) * k);
  };
  return (mix(16) << 16) | (mix(8) << 8) | mix(0);
}
