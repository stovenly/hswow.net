import type { GalleryPlan } from './layout';
import { bovine } from '@engine/art/builders/bovine';
import { ovine } from '@engine/art/builders/ovine';
import { porcine } from '@engine/art/builders/porcine';
import { poultry } from '@engine/art/builders/poultry';
import { dog } from '@engine/art/builders/dog';

/**
 * The animals. (The villagers have a room of their own next door —
 * `villager.ts` — where the face options stand in a rank to be judged.)
 *
 * The gallery that most needed to exist. Five of the rows come out of one body
 * plan at different proportions, and the whole claim of that approach is that
 * proportion alone tells them apart — which is a claim you can only test by
 * standing them in a row and looking along it. A cow beside a sheep beside a
 * pig is the comparison; a cow beside a barrel is not.
 *
 * **Every animal with a call in the table has a body here**, which is the point
 * of the room: the calls were tuned against nothing for a phase, and rhythm
 * identifies a species more than timbre does. Four of them ring out over the
 * rows below, one voice each, so a bark and a bleat can be heard against the
 * two things making them.
 */

export const ZONE_GALLERY_ANIMAL = 'gallery-animal';

const BUILDERS = [bovine, ovine, porcine, poultry, dog];

export const animalGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_ANIMAL,
  group: 'countryside',
  name: 'Countryside Animal Life',
  builders: BUILDERS,
};
