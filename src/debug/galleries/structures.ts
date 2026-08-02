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
import { archway } from '../../art/builders/archway';
import { fence } from '../../art/builders/fence';
import { post } from '../../art/builders/post';
import { hutDoor } from '../../art/builders/hut-door';
import { hutTrapdoor } from '../../art/builders/hut-trapdoor';
import { factoryDoor } from '../../art/builders/factory-door';
import { factoryTrapdoor } from '../../art/builders/factory-trapdoor';
import { streetlamp } from '../../art/builders/streetlamp';
import { crate } from '../../art/builders/crate';
import { barrel } from '../../art/builders/barrel';
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
 * `figure` is in neither — it stands with the animals in the Life gallery,
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
export const ZONE_GALLERY_FACTORY_INTERIOR = 'gallery-factory-interior';
export const ZONE_GALLERY_FACTORY_EXTERIOR = 'gallery-factory-exterior';

// What dresses a village from the outside. Structures first, then the fixtures
// that stand between them, then the movable goods — roughly outward from the
// building, which is the order the eye walks a village in.
const VILLAGE_EXTERIOR_BUILDERS = [
  hut,
  archway,
  hutDoor,
  hutTrapdoor,
  fence,
  post,
  streetlamp,
  trough,
  cistern,
  anvil,
  bell,
  crate,
  barrel,
  lantern,
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
  name: 'Countryside Village Exterior Clutter',
  builders: VILLAGE_EXTERIOR_BUILDERS,
};

export const villageInteriorGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_VILLAGE_INTERIOR,
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
  name: 'Industrial Factory Interior Clutter',
  builders: FACTORY_INTERIOR_BUILDERS,
  door: 'iron',
};

export const factoryExteriorGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_FACTORY_EXTERIOR,
  name: 'Industrial Factory Exterior Clutter',
  builders: FACTORY_EXTERIOR_BUILDERS,
  door: 'iron',
};
