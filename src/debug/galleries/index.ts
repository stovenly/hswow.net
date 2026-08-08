import type { GalleryPlan } from './layout';
import { foliageGalleryPlan } from './foliage';
import { animalGalleryPlan } from './animal';
import { textShowcaseGalleryPlan } from './text';
import { darkRoomPlan } from './dark';
import { lightShowcasePlan } from './light';
import { fogShowcasePlan } from './fog';
import { readablesGalleryPlan } from './readables';
import { readablesShowcasePlan } from './readables-showcase';
import { materialsGalleryPlan } from './materials';
import { fabricsGalleryPlan } from './fabrics';
import {
  villageInteriorGalleryPlan,
  villageExteriorGalleryPlan,
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
  foliageGalleryPlan,
  animalGalleryPlan,
  villageInteriorGalleryPlan,
  villageExteriorGalleryPlan,
  factoryInteriorGalleryPlan,
  factoryExteriorGalleryPlan,
  textShowcaseGalleryPlan,
  darkRoomPlan,
  lightShowcasePlan,
  fogShowcasePlan,
  readablesGalleryPlan,
  readablesShowcasePlan,
  materialsGalleryPlan,
  fabricsGalleryPlan,
];

export { galleryZone, galleryDoor, galleryPortal, rowPosition } from './layout';
export type { GalleryPlan } from './layout';
export { ZONE_GALLERY_FOLIAGE } from './foliage';
export { ZONE_GALLERY_ANIMAL } from './animal';
export { ZONE_TEXT_SHOWCASE } from './text';
export { ZONE_DARK_ROOM } from './dark';
export { ZONE_LIGHT_SHOWCASE } from './light';
export { ZONE_FOG_SHOWCASE } from './fog';
export { ZONE_READABLES_GALLERY } from './readables';
export { ZONE_READABLES_SHOWCASE } from './readables-showcase';
export { ZONE_MATERIALS_GALLERY } from './materials';
export { ZONE_FABRICS_GALLERY } from './fabrics';
export {
  ZONE_GALLERY_VILLAGE_INTERIOR,
  ZONE_GALLERY_VILLAGE_EXTERIOR,
  ZONE_GALLERY_FACTORY_INTERIOR,
  ZONE_GALLERY_FACTORY_EXTERIOR,
} from './structures';
