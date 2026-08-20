import type { GalleryPlan } from './layout';
import { treeGalleryPlan, groundcoverGalleryPlan, forestMiscGalleryPlan } from './forest';
import { animalGalleryPlan } from './animal';
import { villagerGalleryPlan } from './villager';
import { cityfolkGalleryPlan } from './cityfolk';
import { textShowcaseGalleryPlan } from './text';
import { darkRoomPlan } from './dark';
import { lightShowcasePlan } from './light';
import { fogShowcasePlan } from './fog';
import { readablesGalleryPlan } from './readables';
import { readablesShowcasePlan } from './readables-showcase';
import { MATERIALS_ROOMS } from './materials-wing';
import { fabricsGalleryPlan } from './fabrics';
import { glitchShowcasePlan } from './glitch';
import { horrorShowcasePlan } from './horror';
import { objectEffectsPlan } from './object-effects';
import {
  villageInteriorGalleryPlan,
  villageExteriorGalleryPlan,
  villageBuildingsGalleryPlan,
  farmGalleryPlan,
  stoneWallGalleryPlan,
  factoryInteriorGalleryPlan,
  factoryExteriorGalleryPlan,
} from './structures';

/**
 * Every gallery. The hub reads this list to build the zones; the doors to them
 * stand in the two prop halls, one hall per setting — see `debug/props.ts`,
 * which is where a new gallery also gets its door. `check:art` still fails on
 * any builder that is in no gallery, so an unreachable gallery is caught from
 * both sides.
 *
 * Castle and Cave are absent deliberately. Those kits do not exist yet, and an
 * empty gallery is worse than no gallery: it reads as a bug, and it takes a
 * door in a hall away from something that has contents.
 */
export const GALLERIES: readonly GalleryPlan[] = [
  treeGalleryPlan,
  groundcoverGalleryPlan,
  forestMiscGalleryPlan,
  animalGalleryPlan,
  villagerGalleryPlan,
  cityfolkGalleryPlan,
  villageInteriorGalleryPlan,
  villageExteriorGalleryPlan,
  villageBuildingsGalleryPlan,
  farmGalleryPlan,
  stoneWallGalleryPlan,
  factoryInteriorGalleryPlan,
  factoryExteriorGalleryPlan,
  textShowcaseGalleryPlan,
  darkRoomPlan,
  lightShowcasePlan,
  fogShowcasePlan,
  readablesGalleryPlan,
  readablesShowcasePlan,
  // The Materials wing's rooms. Their doors stand inside the wing rather than
  // in the showcase rank — see `galleries/materials-wing.ts` for why two rooms
  // out there became one door and six in here.
  ...MATERIALS_ROOMS,
  fabricsGalleryPlan,
  glitchShowcasePlan,
  horrorShowcasePlan,
  objectEffectsPlan,
];

export { galleryZone, galleryDoor, galleryPortal, rowPosition } from './layout';
export type { GalleryPlan } from './layout';
export { ZONE_GALLERY_TREES, ZONE_GALLERY_GROUNDCOVER, ZONE_GALLERY_FOREST_MISC } from './forest';
export { ZONE_GALLERY_ANIMAL } from './animal';
export { ZONE_GALLERY_VILLAGER } from './villager';
export { ZONE_GALLERY_CITYFOLK } from './cityfolk';
export { ZONE_TEXT_SHOWCASE } from './text';
export { ZONE_DARK_ROOM } from './dark';
export { ZONE_LIGHT_SHOWCASE } from './light';
export { ZONE_FOG_SHOWCASE } from './fog';
export { ZONE_READABLES_GALLERY } from './readables';
export { ZONE_READABLES_SHOWCASE } from './readables-showcase';
export {
  ZONE_MATERIALS_WING,
  ZONE_MATERIALS_METALS,
  ZONE_MATERIALS_STONE,
  ZONE_MATERIALS_GEMSTONE,
  ZONE_MATERIALS_SHELL,
  ZONE_MATERIALS_STAINED_GLASS,
  ZONE_MATERIALS_PORTALS,
} from './materials-wing';
export { ZONE_FABRICS_GALLERY } from './fabrics';
export { ZONE_GLITCH_SHOWCASE } from './glitch';
export { ZONE_HORROR_SHOWCASE } from './horror';
export { ZONE_OBJECT_EFFECTS } from './object-effects';
export {
  ZONE_GALLERY_VILLAGE_INTERIOR,
  ZONE_GALLERY_VILLAGE_EXTERIOR,
  ZONE_GALLERY_VILLAGE_BUILDINGS,
  ZONE_GALLERY_FARM,
  ZONE_GALLERY_STONE_WALL,
  ZONE_GALLERY_FACTORY_INTERIOR,
  ZONE_GALLERY_FACTORY_EXTERIOR,
} from './structures';
