import type { GalleryPlan } from './layout';
import { oak } from '../../art/builders/oak';
import { smallOak } from '../../art/builders/small-oak';
import { birch } from '../../art/builders/birch';
import { smallBirch } from '../../art/builders/small-birch';
import { spruce } from '../../art/builders/spruce';
import { smallSpruce } from '../../art/builders/small-spruce';
import { tree } from '../../art/builders/tree';
import { smallTree } from '../../art/builders/small-tree';
import { elder } from '../../art/builders/elder';
import { hazel } from '../../art/builders/hazel';
import { gorse } from '../../art/builders/gorse';
import { bush } from '../../art/builders/bush';
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
import { boulder } from '../../art/builders/boulder';
import { outcrop } from '../../art/builders/outcrop';
import { crag } from '../../art/builders/crag';
import { scree } from '../../art/builders/scree';
import { rockShelf } from '../../art/builders/rock-shelf';
import { standingStone } from '../../art/builders/standing-stone';
import { deadfall } from '../../art/builders/deadfall';
import { snag } from '../../art/builders/snag';
import { rootTangle } from '../../art/builders/root-tangle';
import { hedge } from '../../art/builders/hedge';
import { thicket } from '../../art/builders/thicket';
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
 * The wood, in three rooms: what stands over you, what grows at your feet, and
 * everything else on the floor between them.
 *
 * It was one room, and by the end it was thirty-two rows and about ninety
 * metres of rank — long enough that walking to the far end meant losing sight
 * of the near end, which is the one thing a gallery exists to prevent. A room
 * you cannot see the whole of is a list, and a list does not need a floor.
 *
 * The split runs by **register**, not by botany, because register is what the
 * comparison is for. An oak is judged against a birch — do they read apart at
 * thirty metres, does the wood look planted. A mushroom is judged against a
 * daisy — is there enough small stuff to fill the gaps, and does any of it
 * read at all at ankle height. Neither judgement is helped by the other
 * standing in it, and both were being made in the same look down the same
 * rank.
 *
 * - **Trees** — the canopy, by species, each beside its own sapling. The
 *   comparison that matters for a tree is not against other trees but against
 *   its own young, because that is what says the wood has been growing rather
 *   than been placed.
 * - **Groundcover** — the middle storey and the floor it stands on: the
 *   shrubs, the weeds, the grass, the flowers. Individually trivial;
 *   collectively the difference between ground *cover* and a green plane with
 *   objects on it.
 * - **Miscellaneous** — dead matter and stone. A forest floor is mostly things
 *   that used to be trees, and the rock that never was one. This is also where
 *   boundary stone goes as it arrives, which is why it is the room with room.
 *
 * `rock` and `cairn` are `nature` rather than `foliage` and are in the third
 * room anyway. The question a gallery answers is "does this family hang
 * together", and the family that matters is *what is scattered across a
 * landscape* — a rock beside a stump is the comparison worth making, and a
 * rock beside an anvil is not.
 */

export const ZONE_GALLERY_TREES = 'gallery-trees';
export const ZONE_GALLERY_GROUNDCOVER = 'gallery-groundcover';
export const ZONE_GALLERY_FOREST_MISC = 'gallery-forest-misc';

/**
 * The canopy, by species, each beside its own sapling.
 *
 * Chosen for silhouette rather than for botany — the pipeline chunks to
 * three-pixel blocks and destroys everything except outline and proportion, so
 * a tree that cannot be told from its neighbour at thirty metres is not a
 * second tree.
 *
 * `tree` and `small-tree` close the rank. They are the generic pair the middle
 * distance is actually made of — a hundred and thirty triangles against a
 * birch's three thousand — and they were in no gallery at all until this split,
 * which is exactly the kind of omission the old art check used to catch.
 */
const TREE_BUILDERS = [
  oak,
  smallOak,
  birch,
  smallBirch,
  spruce,
  smallSpruce,
  tree,
  smallTree,
  // The two boundary masses. They started in the groundcover room and outgrew
  // it: a hedge runs to nearly two metres and a thicket to two and a half, which
  // is a storey above everything else in there and the same storey as the
  // saplings here. Height is what these rooms are split by — see the header —
  // and a prop is judged against the things it will actually stand beside.
  //
  // They also belong with the trees for a second reason: both are read as
  // *canopy at eye level*. The question about a thicket is whether you can see
  // over it, which is exactly the question about a sapling, and is not a
  // question anyone asks about a fern.
  hedge,
  thicket,
];

// Tallest first, so the rank steps down as you walk along it and nothing is
// hidden behind its neighbour. Flowers last, together, because the question
// about them is whether they read as different species — and that is only
// answerable side by side.
const GROUNDCOVER_BUILDERS = [
  // The middle storey, between ankle height and overhead. Without it a wood
  // goes from grass to canopy with nothing in between, which is what makes a
  // stand of trees read as a stage set.
  hazel,
  elder,
  gorse,
  bush,
  bramble,
  reeds,
  nettle,
  fern,
  largeGrassClump,
  smallGrassClump,
  mushroom,
  moss,
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

/**
 * Dead matter and stone: what used to be a tree, and what never was one.
 *
 * The room that grew. It was six rows of woodland floor litter; it is now also
 * where the **boundary kit** lives, because that is what boundary props are —
 * rock and dead wood, at the sizes a player walks up to rather than the sizes
 * they step over.
 *
 * The rank is worth walking in order, because it is a scale as much as a
 * catalogue. It runs from `crag` at six or seven metres down to `pinecone`, and
 * the thing to look for on the way down is the gap that used to sit between
 * `rock` and the vista band: there was nothing here made of stone taller than a
 * person, so every tall thing outdoors was a tree. Rows two to seven are that
 * gap being filled.
 */
const FOREST_MISC_BUILDERS = [
  // Stone, tallest first.
  crag,
  snag,
  deadfall,
  boulder,
  standingStone,
  outcrop,
  rockShelf,
  // The floor litter it stands in.
  stump,
  cairn,
  fallenLog,
  rootTangle,
  rock,
  scree,
  sticks,
  pinecone,
];

export const treeGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_TREES,
  group: 'countryside',
  name: 'Countryside Forest Tree Clutter',
  builders: TREE_BUILDERS,
};

export const groundcoverGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_GROUNDCOVER,
  group: 'countryside',
  name: 'Countryside Forest Groundcover Clutter',
  builders: GROUNDCOVER_BUILDERS,
};

export const forestMiscGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_FOREST_MISC,
  group: 'countryside',
  name: 'Countryside Forest Miscellaneous Clutter',
  builders: FOREST_MISC_BUILDERS,
};
