import { PALETTE, shade } from '../../art/palette';
import type { SurfaceName } from '../../audio/models/footsteps';

// Kits: what a wall, a floor, a ceiling and a stair look like in each
// architecture. The generator asks for roles; a kit answers with a recipe.

/** The colours a style carries. `InteriorStyle` is what the code zones still pass. */
export interface InteriorStyle {
  floor: number;
  floorSeam: number;
  wall: number;
  wallTrim: number;
  ceiling: number;
  beam: number;
}

export interface KitStyle extends InteriorStyle {
  floorKind: 'boards' | 'flags' | 'earth';
  wallKind: 'frame' | 'plaster' | 'rubble' | 'boards';
  ceilingKind: 'beams' | 'joists' | 'none';
  /** Post section, metres. */
  post: number;
  underfoot: SurfaceName;
  stair: 'timber' | 'stone';
}

export interface Kit {
  name: string;
  styles: Record<string, KitStyle>;
}

export const HOUSE_STYLE: InteriorStyle = {
  floor: PALETTE.TIMBER,
  floorSeam: 0x14110d,
  wall: PALETTE.CLOTH,
  wallTrim: PALETTE.TIMBER_DARK,
  ceiling: PALETTE.TIMBER_DARK,
  beam: PALETTE.BARK,
};

export const WORKS_STYLE: InteriorStyle = {
  floor: PALETTE.STONE_DARK,
  floorSeam: 0x0e1012,
  wall: PALETTE.STONE,
  wallTrim: PALETTE.IRON,
  ceiling: 0x3d444a,
  beam: PALETTE.RUST,
};

const STONE_STYLE: InteriorStyle = {
  floor: PALETTE.STONE_PALE,
  floorSeam: 0x1a1c1e,
  wall: shade(PALETTE.STONE, 0.96),
  wallTrim: PALETTE.STONE_DARK,
  ceiling: PALETTE.TIMBER_DARK,
  beam: PALETTE.BARK,
};

const CELLAR_STYLE: InteriorStyle = {
  floor: PALETTE.STONE_DARK,
  floorSeam: 0x0b0d0e,
  wall: PALETTE.STONE_DARK,
  wallTrim: PALETTE.STONE,
  ceiling: PALETTE.TIMBER_DARK,
  beam: PALETTE.BARK,
};

const BARN_STYLE: InteriorStyle = {
  floor: PALETTE.TIMBER_DARK,
  floorSeam: 0x14110d,
  wall: PALETTE.TIMBER,
  wallTrim: PALETTE.BARK,
  ceiling: PALETTE.TIMBER_DARK,
  beam: PALETTE.BARK,
};

function house(style: InteriorStyle, over: Partial<KitStyle> = {}): KitStyle {
  return { ...style, floorKind: 'boards', wallKind: 'frame', ceilingKind: 'beams', post: 0.18, underfoot: 'wood', stair: 'timber', ...over };
}

export const KITS: Record<string, Kit> = {
  house: {
    name: 'house',
    styles: {
      default: house(HOUSE_STYLE),
      scullery: house({ ...HOUSE_STYLE, floor: PALETTE.STONE_PALE, floorSeam: 0x1a1c1e }, { floorKind: 'flags', underfoot: 'stone' }),
      workshop: house({ ...HOUSE_STYLE, wall: shade(PALETTE.CLOTH, 0.9) }),
      store: house({ ...HOUSE_STYLE, floor: PALETTE.STONE_DARK }, { floorKind: 'flags', underfoot: 'stone' }),
      works: house(WORKS_STYLE, { floorKind: 'flags', wallKind: 'plaster', ceilingKind: 'joists', post: 0.14, underfoot: 'stone' }),
    },
  },
  stone: {
    name: 'stone',
    styles: {
      default: house(STONE_STYLE, { floorKind: 'flags', wallKind: 'rubble', ceilingKind: 'beams', post: 0.22, underfoot: 'stone', stair: 'stone' }),
    },
  },
  barn: {
    name: 'barn',
    styles: {
      default: house(BARN_STYLE, { floorKind: 'boards', wallKind: 'boards', ceilingKind: 'joists', post: 0.22 }),
      earth: house(BARN_STYLE, { floorKind: 'earth', wallKind: 'boards', ceilingKind: 'joists', post: 0.22, underfoot: 'soil' }),
    },
  },
  cellar: {
    name: 'cellar',
    styles: {
      default: house(CELLAR_STYLE, { floorKind: 'flags', wallKind: 'rubble', ceilingKind: 'beams', post: 0.2, underfoot: 'stone', stair: 'stone' }),
    },
  },
};

/** Names the code zones and documents register: they become styles of the house kit. */
export function registerInteriorStyle(name: string, style: InteriorStyle): void {
  KITS.house.styles[name] = house(style, style.floor === PALETTE.STONE_DARK || style.floor === PALETTE.STONE_PALE ? { floorKind: 'flags', underfoot: 'stone' } : {});
}

export function interiorStyleByName(name: string): InteriorStyle | undefined {
  for (const kit of Object.values(KITS)) if (kit.styles[name]) return kit.styles[name];
  return undefined;
}

export function interiorStyleNames(): readonly string[] {
  return Object.keys(KITS.house.styles);
}

export function kitByName(name: string | undefined): Kit {
  return KITS[name ?? 'house'] ?? KITS.house;
}

export function kitStyle(kit: Kit, name: string | undefined): KitStyle {
  return (name ? kit.styles[name] : undefined) ?? kit.styles.default;
}
