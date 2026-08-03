import type { GalleryPlan } from './layout';
import { oak } from '../../art/builders/oak';
import { smallOak } from '../../art/builders/small-oak';
import { birch } from '../../art/builders/birch';
import { smallBirch } from '../../art/builders/small-birch';
import { spruce } from '../../art/builders/spruce';
import { smallSpruce } from '../../art/builders/small-spruce';
import { elder } from '../../art/builders/elder';
import { hazel } from '../../art/builders/hazel';
import { gorse } from '../../art/builders/gorse';
import { fallenLog } from '../../art/builders/fallen-log';
import { sticks } from '../../art/builders/sticks';
import { bramble } from '../../art/builders/bramble';
import { fern } from '../../art/builders/fern';
import { nettle } from '../../art/builders/nettle';
import { reeds } from '../../art/builders/reeds';
import { moss } from '../../art/builders/moss';
import { pinecone } from '../../art/builders/pinecone';
import { smallGrassClump } from '../../art/builders/small-grass-clump';
import { largeGrassClump } from '../../art/builders/large-grass-clump';
import { mushroom } from '../../art/builders/mushroom';
import { stump } from '../../art/builders/stump';
import { rock } from '../../art/builders/rock';
import { cairn } from '../../art/builders/cairn';
import { wildflower } from '../../art/builders/wildflower';
import { bluebell } from '../../art/builders/bluebell';
import { cowparsley } from '../../art/builders/cowparsley';
import { foxglove } from '../../art/builders/foxglove';
import { lavender } from '../../art/builders/lavender';
import { thistle } from '../../art/builders/thistle';
import { daisy } from '../../art/builders/daisy';
import { poppy } from '../../art/builders/poppy';
import { sunflower } from '../../art/builders/sunflower';

/**
 * Everything that grows, and the stone it grows around.
 *
 * Rock and cairn are `nature` rather than `foliage` and are here anyway. The
 * question a gallery answers is "does this family hang together", and the
 * family that matters for the ground cover is *what is scattered across a
 * landscape* — a rock beside a stump is the comparison worth making, and a rock
 * beside an anvil is not.
 *
 * The room was thin to start with: a tree, a bush and some ground cover, which
 * is not enough to dress a wood with. It was missing three whole registers, and
 * the rank is ordered by them — tallest first, so it steps down as you walk it
 * and nothing hides behind its neighbour:
 *
 * - **Species, rather than categories.** There was one `tree` and one `bush`,
 *   and a wood built from two shapes reads as wallpaper however good the two
 *   shapes are. Now: oak, birch and spruce, each with its own sapling, and
 *   elder, hazel and gorse under them. Chosen for silhouette rather than
 *   for botany — the pipeline chunks to three-pixel blocks and destroys
 *   everything except outline and proportion, so a tree that cannot be told
 *   from its neighbour at thirty metres is not a second tree.
 * - **A middle storey**, between ankle height and overhead: the saplings, the
 *   bushes and `bramble`. Without it a wood goes from grass to canopy with
 *   nothing in between, which is what makes a stand of trees read as a stage
 *   set.
 * - **Dead matter.** `fallen-log`, `sticks`, `stump`. A forest floor is
 *   mostly things that used to be trees, and a wood with none has not been
 *   standing long enough to be a wood.
 * - **The small stuff that fills gaps.** `fern`, `nettle`, `moss`, `pinecone`,
 *   `reeds`, and the flowers. Individually trivial; collectively the difference
 *   between ground *cover* and a green plane with objects on it.
 */

export const ZONE_GALLERY_FOLIAGE = 'gallery-foliage';

// Tallest first, so the rank steps down as you walk along it and nothing is
// hidden behind its neighbour. Flowers last, together, because the question
// about them is whether they read as different species — and that is only
// answerable side by side.
const BUILDERS = [
  // **The wood, by species.** One generic `tree` and one generic `bush` used
  // to stand here, and a wood built from two shapes reads as wallpaper however
  // good the two shapes are. These are ordered so each species sits beside its
  // own sapling — the comparison that matters for a tree is not against other
  // trees but against its own young, because that is what says the wood has
  // been growing rather than been placed.
  oak,
  smallOak,
  birch,
  smallBirch,
  spruce,
  smallSpruce,
  elder,
  hazel,
  gorse,
  bramble,
  stump,
  fallenLog,
  sticks,
  reeds,
  nettle,
  fern,
  largeGrassClump,
  smallGrassClump,
  mushroom,
  moss,
  pinecone,
  rock,
  cairn,
  foxglove,
  thistle,
  sunflower,
  cowparsley,
  lavender,
  poppy,
  bluebell,
  daisy,
  wildflower,
];

export const foliageGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_FOLIAGE,
  group: 'countryside',
  name: 'Countryside Forest Clutter',
  builders: BUILDERS,
};
