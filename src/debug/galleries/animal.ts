import type { GalleryPlan } from './layout';
import { bovine } from '../../art/builders/bovine';
import { ovine } from '../../art/builders/ovine';
import { equine } from '../../art/builders/equine';
import { porcine } from '../../art/builders/porcine';
import { poultry } from '../../art/builders/poultry';
import { dog } from '../../art/builders/dog';

/**
 * Everything that moves under its own power, including us.
 *
 * The gallery that most needed to exist. Five of the seven rows come out of one
 * body plan at different proportions, and the whole claim of that approach is
 * that proportion alone tells them apart — which is a claim you can only test
 * by standing them in a row and looking along it. A cow beside a horse beside a
 * pig is the comparison; a cow beside a barrel is not.
 *
 * `figure` is deliberately *not* here. A person's scale question is not "is it
 * the right size beside a cow" — it is whether it fits through a doorway and
 * sits on a stool, so it stands in the village rank with the things it has to
 * agree with.
 *
 * **Every animal with a call in the table has a body here**, which is the point
 * of the room: the calls were tuned against nothing for a phase, and rhythm
 * identifies a species more than timbre does. Four of them ring out over the
 * rows below, one voice each, so a bark and a bleat can be heard against the
 * two things making them.
 */

export const ZONE_GALLERY_ANIMAL = 'gallery-animal';

const BUILDERS = [bovine, ovine, equine, porcine, poultry, dog];

export const animalGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_ANIMAL,
  name: 'Animal Gallery',
  builders: BUILDERS,
};
