import type { GalleryPlan } from './layout';
import { windowBuilder } from '../../art/builders/window';
import { fireplace } from '../../art/builders/fireplace';
import { stove } from '../../art/builders/stove';
import { dresser } from '../../art/builders/dresser';
import { chest } from '../../art/builders/chest';
import { washtub } from '../../art/builders/washtub';
import { broom } from '../../art/builders/broom';
import { hangingHerbs } from '../../art/builders/hanging-herbs';
import { spinningWheel } from '../../art/builders/spinning-wheel';
import { wallPegs } from '../../art/builders/wall-pegs';
import { hut } from '../../art/builders/hut';
import { fence } from '../../art/builders/fence';
import { fencePost } from '../../art/builders/fence-post';
import { stoneWall } from '../../art/builders/stone-wall';
import { stoneWallLow } from '../../art/builders/stone-wall-low';
import {
  stoneWallSquareColumn,
  stoneWallSquareColumnLow,
} from '../../art/builders/stone-wall-square-column';
import {
  stoneWallTriangleColumn,
  stoneWallTriangleColumnLow,
} from '../../art/builders/stone-wall-triangle-column';
import {
  stoneWallPentagonColumn,
  stoneWallPentagonColumnLow,
} from '../../art/builders/stone-wall-pentagon-column';
import { stoneWallRuin } from '../../art/builders/stone-wall-ruin';
import { stoneWallArchway } from '../../art/builders/stone-wall-archway';
import { post } from '../../art/builders/post';
import { hutDoor } from '../../art/builders/hut-door';
import { hutTrapdoor } from '../../art/builders/hut-trapdoor';
import { factoryDoor } from '../../art/builders/factory-door';
import { factoryTrapdoor } from '../../art/builders/factory-trapdoor';
import { streetlamp } from '../../art/builders/streetlamp';
import { crate } from '../../art/builders/crate';
import { barrel } from '../../art/builders/barrel';
import { crateStack } from '../../art/builders/crate-stack';
import { barrelStack } from '../../art/builders/barrel-stack';
import { cart } from '../../art/builders/cart';
import { well } from '../../art/builders/well';
import { hayBale } from '../../art/builders/hay-bale';
import { hayBaleStack } from '../../art/builders/hay-bale-stack';
import { hayRick } from '../../art/builders/hay-rick';
import { logPile } from '../../art/builders/log-pile';
import { plough } from '../../art/builders/plough';
import { scarecrow } from '../../art/builders/scarecrow';
import { sack } from '../../art/builders/sack';
import { dungHeap } from '../../art/builders/dung-heap';
import { strawPile } from '../../art/builders/straw-pile';
import { pitchfork } from '../../art/builders/pitchfork';
import { rake } from '../../art/builders/rake';
import { pail } from '../../art/builders/pail';
import { table } from '../../art/builders/table';
import { chair } from '../../art/builders/chair';
import { stool } from '../../art/builders/stool';
import { bed } from '../../art/builders/bed';
import { trough } from '../../art/builders/trough';
import { cistern } from '../../art/builders/cistern';
import { anvil } from '../../art/builders/anvil';
import { bell } from '../../art/builders/bell';
import { candle } from '../../art/builders/candle';
import { lantern } from '../../art/builders/lantern';
import { machine } from '../../art/builders/machine';
import { tank } from '../../art/builders/tank';
import { pipes } from '../../art/builders/pipes';
import { vent } from '../../art/builders/vent';
import { railing } from '../../art/builders/railing';
import { chainlink } from '../../art/builders/chainlink';
import { floodlight } from '../../art/builders/floodlight';
import { sink } from '../../art/builders/sink';
import { forge } from '../../art/builders/forge';
import { hoist } from '../../art/builders/hoist';
import { hopper } from '../../art/builders/hopper';
import { ladder } from '../../art/builders/ladder';
import { panel } from '../../art/builders/panel';
import { stair } from '../../art/builders/stair';
import { workbench } from '../../art/builders/workbench';

/**
 * The setting galleries: one room per palette the kit has to dress.
 *
 * Split by setting rather than by kind, which is the one place in this scheme
 * where setting earns its keep. A hut and a mill are both buildings and they
 * are not remotely the same problem — the question about a hut is whether it
 * sits in a village, and the question about a mill is whether it sits in a
 * works. Standing them together answers neither.
 *
 * **A set is not a category.** There was briefly a Prop Gallery holding the
 * crates, furniture, water and workshop pieces, on the reasoning that a barrel
 * and a bed are the same *kind* of thing. They are, and it was the wrong
 * split: every one of them exists to dress a village, and a barrel judged
 * beside a stool tells you nothing a barrel judged beside a hut does not tell
 * you better. What a room like this has to answer is "does this all belong in
 * the same place", so the things that go in one place go in one room.
 *
 * The village is two rooms now, on the same reasoning taken one step further:
 * the palette is broken down by subzone category, and interior and exterior
 * dressing are different categories because they are different *places* — a
 * dresser is judged against the room it furnishes and a streetlamp against the
 * lane it stands in, and neither judgement is helped by the other standing in
 * it. The line runs where the wall does. The lamps split with it: `lantern`
 * hangs by a door and `candle` stands on a table, so one is exterior and one
 * is interior even though they were built as a pair.
 *
 * ## And the exterior is three rooms, because two of them are systems
 *
 * The exterior grew past the point where one look down a rank could take it in,
 * and it did not grow evenly — it grew two clumps with a rule inside each.
 *
 * **The stone wall is a system, not a prop.** Six pieces that all share one
 * pitch, one batter, one set of stones and one seam behaviour, which only tile
 * because of that. What has to be checked about them is whether a straight
 * piece, a curve, a pier and a ruin still look like the same wall — and that is
 * a comparison you make by standing them in a line, not by hunting for them
 * among the streetlamps. `stone-wall-ruin` and `stone-wall-archway` are named
 * for the family rather than for themselves, because that is what they are: an
 * end and an opening *of the wall*.
 *
 * **The farm is a place, not a kind.** A rick, a plough and a skep have nothing
 * in common as objects and everything in common as a statement, and the
 * question about them is whether they add up to somewhere that grows things —
 * which is the same question the village room asks, about a different place.
 *
 * What is left in the village room is what dresses a lane: the buildings, the
 * light, the water, the goods and the fences.
 *
 * `figure` is in none of them — it stands with the animals in the Life gallery,
 * with the rest of what moves under its own power.
 *
 * The factory room was thin — one machine, and a room with one row in it is a
 * corridor. What it needed was not more *machines* but the things around them:
 * a works reads as a works because material is routed through it and people are
 * fenced off from it, so the pipe run, the railing and the chainlink do more
 * for the setting than a second engine would.
 */

export const ZONE_GALLERY_VILLAGE_INTERIOR = 'gallery-village-interior';
export const ZONE_GALLERY_VILLAGE_EXTERIOR = 'gallery-village-exterior';
export const ZONE_GALLERY_FARM = 'gallery-farm';
export const ZONE_GALLERY_STONE_WALL = 'gallery-stone-wall';
export const ZONE_GALLERY_FACTORY_INTERIOR = 'gallery-factory-interior';
export const ZONE_GALLERY_FACTORY_EXTERIOR = 'gallery-factory-exterior';

// What dresses a village from the outside. Structures first, then the fixtures
// that stand between them, then the movable goods — roughly outward from the
// building, which is the order the eye walks a village in.
const VILLAGE_EXTERIOR_BUILDERS = [
  hut,
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
 * The stone wall, as a family.
 *
 * Ordered so that every piece stands next to the one it has to agree with: the
 * two heights of the straight run, then the two of the curve, then the piers
 * that finish them, then the two ways a run can end in something other than a
 * pier. If any two of these disagree about what stone looks like, that is
 * visible from where you arrive.
 */
const STONE_WALL_BUILDERS = [
  stoneWall,
  stoneWallLow,
  // The piers, by how hard a turn they make: three faces bend a run sixty
  // degrees, four ninety, five thirty-six or seventy-two. They are the whole of
  // how this wall changes direction — see `stone-wall-square-column`. Read in
  // that order, and each beside its own low version, so the one thing that has
  // to be true of all six is checkable at a glance: **every face is the same
  // width**, because that is what lets a run meet any of them.
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
 * and the things that are **held**. That last one is the register the kit was
 * shortest of: everything outdoors was furniture, structure or a mass, and a
 * place with nothing at hand scale in it reads as a model of itself.
 *
 * The two straw piles stand together on purpose. `hay-bale-stack` is the stuff
 * squared, corded and stacked; `straw-pile` is the same material before any of
 * that happened to it, and the pair of them is the difference between a yard
 * that is worked and a warehouse.
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
