import type { GalleryPlan } from './layout';
import { tree } from '../../art/builders/tree';
import { smallTree } from '../../art/builders/small-tree';
import { fallenLog } from '../../art/builders/fallen-log';
import { sticks } from '../../art/builders/sticks';
import { bramble } from '../../art/builders/bramble';
import { fern } from '../../art/builders/fern';
import { nettle } from '../../art/builders/nettle';
import { reeds } from '../../art/builders/reeds';
import { moss } from '../../art/builders/moss';
import { pinecone } from '../../art/builders/pinecone';
import { bush } from '../../art/builders/bush';
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
 * - **A middle storey.** `small-tree` and `bramble`, between ankle height and
 *   overhead. Without it a wood goes from grass to canopy with nothing between,
 *   which is what makes a stand of trees read as a stage set.
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
  tree,
  smallTree,
  bush,
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
  name: 'Foliage Gallery',
  builders: BUILDERS,
};
