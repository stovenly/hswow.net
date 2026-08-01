import type { GalleryPlan } from './layout';
import { foliageGalleryPlan } from './foliage';
import { animalGalleryPlan } from './animal';
import { villageGalleryPlan, factoryGalleryPlan } from './structures';

/**
 * Every gallery, in the order their doors stand in the hub.
 *
 * Adding one is a file and a line here. The hub reads this list to build its
 * rank of doors, so a gallery cannot exist without being reachable — which is
 * the failure mode the old injected gallery had, where the only way in was to
 * already know where it was.
 *
 * Castle and Cave are absent deliberately. Those kits do not exist yet, and an
 * empty gallery is worse than no gallery: it reads as a bug, and it takes a
 * door in the rank away from something that has contents.
 */
export const GALLERIES: readonly GalleryPlan[] = [
  foliageGalleryPlan,
  animalGalleryPlan,
  villageGalleryPlan,
  factoryGalleryPlan,
];

export { galleryZone, galleryDoor, galleryPortal, rowPosition } from './layout';
export type { GalleryPlan } from './layout';
export { ZONE_GALLERY_FOLIAGE } from './foliage';
export { ZONE_GALLERY_ANIMAL } from './animal';
export { ZONE_GALLERY_VILLAGE, ZONE_GALLERY_FACTORY } from './structures';
