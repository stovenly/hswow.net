import type { GalleryPlan } from './layout';
import { hut } from '../../art/builders/hut';
import { archway } from '../../art/builders/archway';
import { fence } from '../../art/builders/fence';
import { post } from '../../art/builders/post';
import { door } from '../../art/builders/door';
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
import { figure } from '../../art/builders/figure';
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
 * The two setting galleries: one room per world the kit has to dress.
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
 * The factory room was thin — one machine, and a room with one row in it is a
 * corridor. What it needed was not more *machines* but the things around them:
 * a works reads as a works because material is routed through it and people are
 * fenced off from it, so the pipe run, the railing and the chainlink do more
 * for the setting than a second engine would.
 *
 * `figure` leads the rank rather than standing with the livestock. A person is
 * not an animal here in the sense that matters — every other quadruped in the
 * kit is judged against the body plan it shares, and a figure is judged against
 * the *doorways it has to fit through and the furniture it has to sit on*. That
 * comparison is in this room, so it is in this room.
 *
 * After it the rows run structures first, then the fixtures that stand between
 * them, then the movable goods — roughly outward from the building, which is
 * the order the eye walks a village in.
 */

export const ZONE_GALLERY_VILLAGE = 'gallery-village';
export const ZONE_GALLERY_FACTORY = 'gallery-factory';

const VILLAGE_BUILDERS = [
  figure,
  hut,
  archway,
  door,
  fence,
  post,
  streetlamp,
  trough,
  cistern,
  anvil,
  bell,
  crate,
  barrel,
  candle,
  lantern,
  table,
  chair,
  stool,
  bed,
];

export const villageGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_VILLAGE,
  name: 'Village Gallery',
  builders: VILLAGE_BUILDERS,
};

// Ordered as a works reads: the things that do the work, then the things that
// carry it about, then the things that fence it off and light it.
const FACTORY_BUILDERS = [
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
  chainlink,
  floodlight,
];

export const factoryGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_FACTORY,
  name: 'Factory Gallery',
  builders: FACTORY_BUILDERS,
};
