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

  STONE: 0x6a6f74,
  STONE_DARK: 0x4c5157,
  STONE_PALE: 0x878c8f,

  EARTH: 0x4c4536,
  TIMBER: 0x5f4c37,
  TIMBER_DARK: 0x453727,

  IRON: 0x5a5f63,
  RUST: 0x7a4a30,
  CLOTH: 0x8d8672,
  SKIN: 0xa8927a,

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
