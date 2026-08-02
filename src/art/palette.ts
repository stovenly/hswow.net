/**
 * The art kit's colours.
 *
 * Named by material rather than by hue — `BARK`, not `BROWN` — so that
 * changing what bark looks like is one edit here instead of a hunt through
 * every builder for the right shade of brown.
 *
 * **This is placeholder art direction.** Cold stone and slate against warm
 * earth and wood, chosen to survive the render pipeline's colour quantization:
 * levels are applied per channel, so colours that differ in *hue* stay
 * distinct after quantization where colours that differ only in brightness
 * collapse together. The specific colours are the repo owner's to replace.
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
   *
   * Lifted about 40% in luminance, **at constant chroma**. That second half is
   * the whole trick and getting it wrong is instructive: the obvious way to
   * brighten a colour is to multiply every channel by the same factor, and that
   * does not make it lighter — it makes it *more saturated*. Timber at
   * `(95, 76, 55)` multiplied by 1.25 gains 24 in red and 16 in blue, so the
   * gap between the channels widens by half and the wood comes out redder than
   * it started, which is precisely what happened on the first attempt.
   *
   * Lifting toward white instead keeps the difference between the channels the
   * same in absolute terms while raising all three, which is what the eye reads
   * as the same material under more light. Timber's channel spread is 40 before
   * and 40 after; stone's is 10 and 10.
   *
   * The hue relationships therefore survive intact, which matters for the
   * reason at the top of this file: quantization is per channel, so cold stone
   * against warm wood stays distinct where two colours differing only in
   * brightness would collapse together.
   *
   * `BARK` deliberately did not move with them. Bark is not timber — a tree is
   * meant to sit *darker* than the buildings around it, and lifting both would
   * stop a village separating from its treeline at all.
   */
  STONE: 0x969aa0,
  STONE_DARK: 0x757a80,
  STONE_PALE: 0xaeb2b6,

  EARTH: 0x4c4536,
  TIMBER: 0x8a7362,
  TIMBER_DARK: 0x6b5a4d,
  /**
   * Sun-bleached softwood. The lightest timber in the kit.
   *
   * Added because the plank door had nowhere to go. It was built from
   * `TIMBER_DARK` on both its leaf and its frame — the darkest wood there was —
   * so the one door in three whose whole idea is *rough sawn boards* came out
   * as the one you could not see the boards on. Three door types need three
   * legible woods, and taking `TIMBER_DARK` for the darkest of them left the
   * range with no top end.
   */
  TIMBER_PALE: 0xa89376,

  IRON: 0x5a5f63,
  IRON_DARK: 0x3f4448,
  RUST: 0x7a4a30,
  /**
   * Cast bronze, and what it goes when it has stood outside for a century.
   *
   * Two entries rather than one because a bell is nearly always both: the
   * patina takes the sheltered faces and the rain keeps the rest bright, and a
   * bell in one flat colour reads as a plastic cone.
   */
  BRONZE: 0x8a7038,
  PATINA: 0x5c7060,
  /**
   * Standing water seen from above.
   *
   * Dark and desaturated on purpose. Water is mostly a reflection of the sky,
   * and there are no reflections here — a bright blue panel in a trough reads
   * as painted tin, where a dark one reads as depth.
   */
  WATER: 0x2c3f46,
  /**
   * The colour of a flame seen directly, not of anything lit by one.
   *
   * Only ever used on `GLOW_MATERIAL`, which is additive and unlit — so this is
   * read as an amount of light to add rather than as a surface colour, and it
   * is deliberately far brighter than anything else in the table. Used on a lit
   * material it would come out as cream-coloured paint.
   */
  LAMPLIGHT: 0xffe0a8,
  CLOTH: 0x8d8672,
  SKIN: 0xa8927a,

  /**
   * Lettering and painted marks — sign boards, banners, anything written.
   *
   * Very dark and slightly warm rather than black: pure black is the one
   * value the quantizer cannot dither against anything, and lamp-black paint
   * on timber was never black anyway. Legibility is carried by the luminance
   * gap against whatever the letters sit on, which survives quantization
   * where a hue difference alone would not.
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
 * Multiplies a colour's brightness, clamped per channel.
 *
 * For giving the individual boards of a floor, a table top or a door leaf
 * slightly different timber. A surface built from one repeated colour reads as
 * a texture-less plane however many polygons it has, and varying the value by
 * a few percent per piece is the cheapest fix there is.
 *
 * Operates on the packed hex directly rather than through `THREE.Color`, which
 * would convert into linear space on the way in and back out — that would make
 * a factor of 1.1 mean something different for a dark colour than for a light
 * one, which is not what any caller wants.
 */
export function shade(hex: number, factor: number): number {
  const r = Math.min(255, Math.round(((hex >> 16) & 0xff) * factor));
  const g = Math.min(255, Math.round(((hex >> 8) & 0xff) * factor));
  const b = Math.min(255, Math.round((hex & 0xff) * factor));
  return (r << 16) | (g << 8) | b;
}
