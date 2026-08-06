import type { SurfaceName } from '../audio/models/footsteps';

/**
 * What a prop sounds like when you stand on it — **declared, one line each**.
 *
 * This was measured instead: every triangle's colour matched to a palette
 * family, weighted by area, largest total wins. The argument for it was good —
 * the answer is already in the geometry, a re-coloured prop changes its own
 * sound, and nobody has to remember a second place to edit. It does not work,
 * and the reason it does not work is worth stating plainly so it is not tried
 * again.
 *
 * **Nothing in the kit uses a palette entry raw.** Everything is `shade(X, k)`
 * — the same colour a bit darker or lighter — and the families are only a few
 * per cent apart in brightness at the dark end. `STONE_DARK` shaded to 0.86 is
 * nearer `IRON` than it is to `STONE_DARK`. So the measurement was a coin
 * flip, and measurably so: over eight seeds a stone wall came back as steel
 * once, a barrel as steel four times, a cow as *masonry* four times, and a
 * handrail as timber or stone in half its rolls. Every one of those is
 * something the player hears and cannot explain.
 *
 * Colour cannot tell iron from stone in this palette, and it was never going
 * to — the two are the same hue thirty per cent apart in brightness, and
 * shading moves a colour exactly that far. So the material is stated, and it
 * is stated **here**, in one list, rather than scattered through ninety
 * builders where nobody can scan it. That is the point of the shape: the
 * question this file has to answer at a glance is *"is anything claiming to be
 * metal that is not metal"*, and one screen answers it.
 *
 * ## What an entry means
 *
 * The material of the part of it you could **stand on**. Not what most of it
 * is made of — a stone wall with a timber gate hanging off it is stone,
 * because the wall is what holds you up.
 *
 * `null` is a real answer and the commonest one: **you cannot stand on this**.
 * A flower, a cow, a hanging lantern, a banner. The ground underneath answers
 * instead, which is right — you are not standing on a lantern's light.
 */

/**
 * Every name that reaches `finish`, and what standing on it sounds like.
 *
 * Grouped by material rather than alphabetically, because the grouping is what
 * makes a mistake visible: a wall in the metal block is wrong on sight.
 * `check:art` asserts that every builder appears here, so a new prop cannot be
 * added without saying what it is.
 */
export const MATERIALS: Record<string, SurfaceName | null> = {
  // --- stone ---------------------------------------------------------------
  archway: 'stone',
  cairn: 'stone',
  cistern: 'stone',
  fireplace: 'stone',
  hut: 'stone',
  rock: 'stone',
  'stone-wall': 'stone',
  'stone-wall-low': 'stone',
  'stone-wall-column': 'stone',
  'stone-wall-column-low': 'stone',

  // --- timber --------------------------------------------------------------
  barrel: 'wood',
  bed: 'wood',
  chair: 'wood',
  chest: 'wood',
  crate: 'wood',
  dresser: 'wood',
  'fallen-log': 'wood',
  fence: 'wood',
  'fence-post': 'wood',
  'hut-door': 'wood',
  'hut-trapdoor': 'wood',
  post: 'wood',
  signboard: 'wood',
  'spinning-wheel': 'wood',
  stool: 'wood',
  stump: 'wood',
  table: 'wood',
  washtub: 'wood',
  window: 'wood',
  workbench: 'wood',

  // --- metal ---------------------------------------------------------------
  //
  // **Every one of these is actually made of steel or iron.** Nothing gets in
  // here because its colour was grey; see the header.
  anvil: 'metal-solid',
  'factory-door': 'metal-solid',
  floodlight: 'metal-solid',
  forge: 'metal-solid',
  sink: 'metal-solid',
  streetlamp: 'metal-solid',

  // Fixed at its ends, so the clang travels along it.
  bell: 'metal-ring',
  chainlink: 'metal-ring',
  hoist: 'metal-ring',
  ladder: 'metal-ring',
  railing: 'metal-ring',
  stair: 'metal-ring',

  // Sheet with a small volume behind it.
  'factory-trapdoor': 'metal-hollow-small',
  panel: 'metal-hollow-small',
  pipes: 'metal-hollow-small',
  stove: 'metal-hollow-small',
  vent: 'metal-hollow-small',

  // A great deal of air under it.
  hopper: 'metal-hollow-big',
  machine: 'metal-hollow-big',
  tank: 'metal-hollow-big',

  // --- rolled per prop -----------------------------------------------------
  //
  // A trough is stone or timber, decided by its own seed, so it is the one
  // thing here that cannot be a fixed entry. It passes its answer to `finish`.
  trough: null,

  // --- nothing you stand on ------------------------------------------------
  //
  // The ground underneath answers for all of these. Animals, plants, cloth,
  // things at head height, and things too small to get a foot on.
  banner: null,
  bluebell: null,
  bovine: null,
  bramble: null,
  birch: null,
  broom: null,
  bush: null,
  candle: null,
  cowparsley: null,
  daisy: null,
  dog: null,
  elder: null,
  equine: null,
  fern: null,
  figure: null,
  foxglove: null,
  gorse: null,
  'hanging-herbs': null,
  hazel: null,
  'large-grass-clump': null,
  lantern: null,
  lavender: null,
  moss: null,
  mushroom: null,
  nettle: null,
  oak: null,
  ovine: null,
  pinecone: null,
  poppy: null,
  porcine: null,
  poultry: null,
  reeds: null,
  'small-birch': null,
  'small-grass-clump': null,
  'small-oak': null,
  'small-spruce': null,
  'small-tree': null,
  spruce: null,
  sticks: null,
  sunflower: null,
  thistle: null,
  tree: null,
  'wall-pegs': null,
  wildflower: null,

  // --- not props -----------------------------------------------------------
  //
  // Ground and shells. These are the floor rather than something on it, so the
  // zone's own answer governs: painted ground outdoors (`ZoneDefinition
  // .surfaceAt`) and a declared floor material indoors.
  terrain: null,
  interior: null,
  lettering: null,
  'sealed-room': null,
  'dark-alcove': null,
  'light-plinth': null,
  'text-backdrop': null,
  'text-station': null,
  'text-station-ink': null,
};
