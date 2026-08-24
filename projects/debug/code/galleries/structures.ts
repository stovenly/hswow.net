import type { GalleryPlan } from './layout';
import { windowBuilder } from '@engine/art/builders/window';
import { fireplace } from '@engine/art/builders/fireplace';
import { stove } from '@engine/art/builders/stove';
import { dresser } from '@engine/art/builders/dresser';
import { chest } from '@engine/art/builders/chest';
import { washtub } from '@engine/art/builders/washtub';
import { broom } from '@engine/art/builders/broom';
import { hangingHerbs } from '@engine/art/builders/hanging-herbs';
import { spinningWheel } from '@engine/art/builders/spinning-wheel';
import { wallPegs } from '@engine/art/builders/wall-pegs';
import { hut } from '@engine/art/builders/hut';
import { cottage } from '@engine/art/builders/cottage';
import { manor } from '@engine/art/builders/manor';
import { market } from '@engine/art/builders/market';
import { blacksmith } from '@engine/art/builders/blacksmith';
import { stable } from '@engine/art/builders/stable';
import { church } from '@engine/art/builders/church';
import { barn } from '@engine/art/builders/barn';
import { fence } from '@engine/art/builders/fence';
import { fencePost } from '@engine/art/builders/fence-post';
import { stoneWall } from '@engine/art/builders/stone-wall';
import { stoneWallLow } from '@engine/art/builders/stone-wall-low';
import {
  stoneWallSquareColumn,
  stoneWallSquareColumnLow,
} from '@engine/art/builders/stone-wall-square-column';
import {
  stoneWallTriangleColumn,
  stoneWallTriangleColumnLow,
} from '@engine/art/builders/stone-wall-triangle-column';
import {
  stoneWallPentagonColumn,
  stoneWallPentagonColumnLow,
} from '@engine/art/builders/stone-wall-pentagon-column';
import { stoneWallRuin } from '@engine/art/builders/stone-wall-ruin';
import { stoneWallArchway } from '@engine/art/builders/stone-wall-archway';
import { post } from '@engine/art/builders/post';
import { hutDoor } from '@engine/art/builders/hut-door';
import { hutTrapdoor } from '@engine/art/builders/hut-trapdoor';
import { factoryDoor } from '@engine/art/builders/factory-door';
import { factoryTrapdoor } from '@engine/art/builders/factory-trapdoor';
import { streetlamp } from '@engine/art/builders/streetlamp';
import { crate } from '@engine/art/builders/crate';
import { barrel } from '@engine/art/builders/barrel';
import { crateStack } from '@engine/art/builders/crate-stack';
import { barrelStack } from '@engine/art/builders/barrel-stack';
import { cart } from '@engine/art/builders/cart';
import { well } from '@engine/art/builders/well';
import { hayBale } from '@engine/art/builders/hay-bale';
import { hayBaleStack } from '@engine/art/builders/hay-bale-stack';
import { hayRick } from '@engine/art/builders/hay-rick';
import { logPile } from '@engine/art/builders/log-pile';
import { plough } from '@engine/art/builders/plough';
import { scarecrow } from '@engine/art/builders/scarecrow';
import { sack } from '@engine/art/builders/sack';
import { dungHeap } from '@engine/art/builders/dung-heap';
import { strawPile } from '@engine/art/builders/straw-pile';
import { pitchfork } from '@engine/art/builders/pitchfork';
import { rake } from '@engine/art/builders/rake';
import { pail } from '@engine/art/builders/pail';
import { table } from '@engine/art/builders/table';
import { chair } from '@engine/art/builders/chair';
import { stool } from '@engine/art/builders/stool';
import { bed } from '@engine/art/builders/bed';
import { trough } from '@engine/art/builders/trough';
import { cistern } from '@engine/art/builders/cistern';
import { anvil } from '@engine/art/builders/anvil';
import { bell } from '@engine/art/builders/bell';
import { candle } from '@engine/art/builders/candle';
import { lantern } from '@engine/art/builders/lantern';
import { machine } from '@engine/art/builders/machine';
import { tank } from '@engine/art/builders/tank';
import { pipes } from '@engine/art/builders/pipes';
import { vent } from '@engine/art/builders/vent';
import { railing } from '@engine/art/builders/railing';
import { chainlink } from '@engine/art/builders/chainlink';
import { floodlight } from '@engine/art/builders/floodlight';
import { sink } from '@engine/art/builders/sink';
import { forge } from '@engine/art/builders/forge';
import { hoist } from '@engine/art/builders/hoist';
import { hopper } from '@engine/art/builders/hopper';
import { ladder } from '@engine/art/builders/ladder';
import { panel } from '@engine/art/builders/panel';
import { stair } from '@engine/art/builders/stair';
import { workbench } from '@engine/art/builders/workbench';

/**
 * The setting galleries: one room per palette the kit has to dress.
 *
 * Split by setting rather than by kind, which is the one place in this scheme
 * where setting earns its keep. A hut and a mill are both buildings and not
 * remotely the same problem — the question about a hut is whether it sits in a
 * village and the question about a mill is whether it sits in a works, and
 * standing them together answers neither.
 *
 * **A set is not a category.** A barrel and a bed are the same *kind* of thing
 * and it is the wrong split: both exist to dress a village, and a barrel judged
 * beside a stool tells you nothing a barrel judged beside a hut does not tell
 * you better. What a room like this has to answer is "does this all belong in
 * the same place".
 *
 * The village is two rooms, on the same reasoning taken further: interior and
 * exterior dressing are different categories because they are different
 * *places*. A dresser is judged against the room it furnishes and a streetlamp
 * against the lane it stands in. The line runs where the wall does, and the
 * lamps split with it — `lantern` hangs by a door and `candle` stands on a
 * table.
 *
 * The exterior is three rooms, because two of them are systems.
 *
 * **The stone wall is a system, not a prop**: six pieces that share one pitch,
 * one batter, one set of stones and one seam behaviour, which only tile because
 * of that. What has to be checked is whether a straight piece, a curve, a pier
 * and a ruin still look like the same wall, and that is a comparison you make
 * by standing them in a line.
 *
 * **The farm is a place, not a kind.** A rick, a plough and a skep have nothing
 * in common as objects and everything in common as a statement.
 *
 * **The buildings are a system too**: eight of them share one plinth, one set
 * of walls and one set of roofs, and whether they still agree is a question you
 * answer by standing them in a line.
 *
 * What is left in the village room is what dresses a lane: the light, the
 * water, the goods and the fences. `figure` is in none of them — it stands with
 * the animals in the Life gallery.
 *
 * The factory room needed not more *machines* but the things around them: a
 * works reads as a works because material is routed through it and people are
 * fenced off from it, so the pipe run, the railing and the chainlink do more
 * for the setting than a second engine would.
 */

export const ZONE_GALLERY_VILLAGE_INTERIOR = 'gallery-village-interior';
export const ZONE_GALLERY_VILLAGE_EXTERIOR = 'gallery-village-exterior';
export const ZONE_GALLERY_VILLAGE_BUILDINGS = 'gallery-village-buildings';
export const ZONE_GALLERY_FARM = 'gallery-farm';
export const ZONE_GALLERY_STONE_WALL = 'gallery-stone-wall';
export const ZONE_GALLERY_FACTORY_INTERIOR = 'gallery-factory-interior';
export const ZONE_GALLERY_FACTORY_EXTERIOR = 'gallery-factory-exterior';

// What dresses a village from the outside. Structures first, then the fixtures
// that stand between them, then the movable goods — roughly outward from the
// building, which is the order the eye walks a village in.
const VILLAGE_EXTERIOR_BUILDERS = [
  hutDoor,
  hutTrapdoor,
  well,
  // The one run-and-cap pair still in this room, together, so a fence and the
  // post that finishes it are read side by side — which is the only way to see
  // that they are the same post. The masonry has a room of its own now.
  fence,
  fencePost,
  post,
  streetlamp,
  anvil,
  bell,
  // The yard, and what is stacked in it. Each stack stands beside the single
  // object it is made of, because the question about a stack is not whether it
  // is a good crate — it is `crate` and cannot be otherwise — but whether
  // several of them arranged read as goods that were *handled*.
  crate,
  crateStack,
  barrel,
  barrelStack,
  cart,
  lantern,
];

/**
 * The stone wall, as a family. Ordered so every piece stands next to the one it
 * has to agree with: the two heights of the straight run, then the two of the
 * curve, then the piers that finish them, then the two ways a run can end in
 * something other than a pier. If any two disagree about what stone looks like,
 * that is visible from where you arrive.
 */
const STONE_WALL_BUILDERS = [
  stoneWall,
  stoneWallLow,
  // The piers, by how hard a turn they make: three faces bend a run sixty
  // degrees, four ninety, five thirty-six or seventy-two. They are the whole of
  // how this wall changes direction. Read in that order, each beside its own low
  // version, so the one thing that has to be true of all six is checkable at a
  // glance: **every face is the same width**, which is what lets a run meet any
  // of them.
  stoneWallTriangleColumn,
  stoneWallTriangleColumnLow,
  stoneWallSquareColumn,
  stoneWallSquareColumnLow,
  stoneWallPentagonColumn,
  stoneWallPentagonColumnLow,
  stoneWallArchway,
  stoneWallRuin,
];

/**
 * The farm: what a place that grows things has standing about in it.
 *
 * Tallest first, as the foliage rooms are, and then read across in three
 * registers — the things that are **stacked**, the things that are **heaped**,
 * and the things that are **held**. That last is the register the kit was
 * shortest of: a place with nothing at hand scale in it reads as a model of
 * itself.
 *
 * The two straw piles stand together on purpose. `hay-bale-stack` is the stuff
 * squared, corded and stacked; `straw-pile` is the same material before any of
 * that happened to it, and the pair is the difference between a yard that is
 * worked and a warehouse.
 */
const FARM_BUILDERS = [
  // Landmarks.
  hayRick,
  scarecrow,
  // Stacked.
  hayBaleStack,
  logPile,
  hayBale,
  sack,
  // Worked, and what holds water.
  plough,
  cistern,
  trough,
  // Heaped.
  strawPile,
  dungHeap,
  // Held. Built on an axis rather than standing on the ground — see
  // `pitchfork` for why a hand tool has no resting position of its own.
  pitchfork,
  rake,
  pail,
];

// What is inside those buildings. The question this room answers is whether a
// *room* built from these hangs together — the fixed things before the loose
// ones, because a room is read by what is against its walls before what is on
// its floor.
const VILLAGE_INTERIOR_BUILDERS = [
  windowBuilder,
  fireplace,
  dresser,
  stove,
  spinningWheel,
  wallPegs,
  hangingHerbs,
  washtub,
  bed,
  table,
  chair,
  stool,
  chest,
  broom,
  candle,
];

/**
 * The buildings, read by status: what a village is made of, and then what one
 * man built for himself.
 *
 * A room of its own because a building is not judged the way a barrel is. What
 * has to be true of these is that they agree — the same plinth, the same
 * carpentry, the same four roofs — while still saying who paid for each of
 * them, and that comparison only works standing them in a line.
 *
 * Ordered up the money: the two houses a villager lives in, the three buildings
 * a trade works out of, then the two the parish and the manor put up. `church`
 * is last because it is the only one that is *tall*, and a rank read from the
 * door reads better ending on the landmark than starting on it.
 *
 * **Only the first two rows are rows.** A hut and a cottage get placed by the
 * dozen and are rolled from a seed, so eight of each shows whether the spread
 * is even. The other six are placed once in a settlement and declare
 * `variants: 1`, because eight identical churches is not a comparison.
 */
const VILLAGE_BUILDING_BUILDERS = [hut, cottage, market, blacksmith, stable, barn, manor, church];

/**
 * Eight metres between instances rather than a grid tile. Only `hut` and
 * `cottage` are more than one deep; everything else declares `variants: 1`, so
 * its row is one building and the spacing does not reach it.
 */
const BUILDING_SPACING = 8;

export const villageBuildingsGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_VILLAGE_BUILDINGS,
  group: 'countryside',
  name: 'Countryside Village Buildings',
  builders: VILLAGE_BUILDING_BUILDERS,
  spacing: BUILDING_SPACING,
};

export const villageExteriorGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_VILLAGE_EXTERIOR,
  group: 'countryside',
  name: 'Countryside Village Exterior Clutter',
  builders: VILLAGE_EXTERIOR_BUILDERS,
};

export const stoneWallGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_STONE_WALL,
  group: 'countryside',
  name: 'Countryside Stone Wall Clutter',
  builders: STONE_WALL_BUILDERS,
};

export const farmGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_FARM,
  group: 'countryside',
  name: 'Countryside Farm Clutter',
  builders: FARM_BUILDERS,
};

export const villageInteriorGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_VILLAGE_INTERIOR,
  group: 'countryside',
  name: 'Countryside Village Interior Clutter',
  builders: VILLAGE_INTERIOR_BUILDERS,
};

// The works, split along the same wall the village is: what stands inside the
// building and what stands outside it.
const FACTORY_INTERIOR_BUILDERS = [
  // Plant, then the things that carry material, then the structure people move
  // and work on, then what fences it off and lights it. Roughly the order a
  // works is built in, and it keeps the tall things away from the small ones.
  machine,
  forge,
  tank,
  hopper,
  pipes,
  hoist,
  vent,
  workbench,
  panel,
  sink,
  stair,
  ladder,
  railing,
  floodlight,
];

// The perimeter, and the ways through it: the fence, the door in it, and the
// hatch behind it. Room for the rest of the yard kit as it arrives.
const FACTORY_EXTERIOR_BUILDERS = [chainlink, factoryDoor, factoryTrapdoor];

export const factoryInteriorGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_FACTORY_INTERIOR,
  group: 'industrial',
  name: 'Industrial Factory Interior Clutter',
  builders: FACTORY_INTERIOR_BUILDERS,
  door: 'iron',
};

export const factoryExteriorGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_FACTORY_EXTERIOR,
  group: 'industrial',
  name: 'Industrial Factory Exterior Clutter',
  builders: FACTORY_EXTERIOR_BUILDERS,
  door: 'iron',
};
