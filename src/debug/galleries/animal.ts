import type { GalleryPlan } from './layout';
import { figure } from '../../art/builders/figure';
import { bovine } from '../../art/builders/bovine';
import { ovine } from '../../art/builders/ovine';
import { equine } from '../../art/builders/equine';
import { porcine } from '../../art/builders/porcine';
import { poultry } from '../../art/builders/poultry';
import { dog } from '../../art/builders/dog';

/**
 * Everything that moves under its own power, including us.
 *
 * The gallery that most needed to exist. Five of the rows come out of one body
 * plan at different proportions, and the whole claim of that approach is that
 * proportion alone tells them apart — which is a claim you can only test by
 * standing them in a row and looking along it. A cow beside a horse beside a
 * pig is the comparison; a cow beside a barrel is not.
 *
 * `figure` leads the rank. It stood in the village gallery for a phase, on the
 * argument that a person's scale question is the doorways and the furniture —
 * and that argument lost to the palette taxonomy: the categories group by what
 * a thing *is* in the world, and a villager is village life, not village
 * clutter. The furniture comparison is one door away when it is wanted.
 *
 * **Every animal with a call in the table has a body here**, which is the point
 * of the room: the calls were tuned against nothing for a phase, and rhythm
 * identifies a species more than timbre does. Four of them ring out over the
 * rows below, one voice each, so a bark and a bleat can be heard against the
 * two things making them.
 */

export const ZONE_GALLERY_ANIMAL = 'gallery-animal';

const BUILDERS = [figure, bovine, ovine, equine, porcine, poultry, dog];

export const animalGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_ANIMAL,
  group: 'countryside',
  name: 'Countryside Village Life',
  builders: BUILDERS,
};
