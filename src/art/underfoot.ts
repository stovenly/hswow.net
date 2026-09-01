import type { SurfaceName } from '../audio/models/footsteps';

/**
 * What a prop sounds like when you stand on it — declared, one line each.
 *
 * Not measured off the colours. Nothing in the kit uses a palette entry raw:
 * everything is `shade(X, k)`, and the families are only a few per cent apart at
 * the dark end, so `STONE_DARK` shaded to 0.86 is nearer `IRON` than it is to
 * `STONE_DARK`. A colour match is a coin flip — over eight seeds a cow came back
 * as masonry four times. So the material is stated, and stated here in one list
 * rather than scattered through ninety builders, because the question this file
 * has to answer at a glance is whether anything claims to be metal that is not.
 *
 * An entry is the material of the part you could stand on, not what most of it is
 * made of: a stone wall with a timber gate hanging off it is stone. `null` is a
 * real answer and the commonest one — you cannot stand on this, and the ground
 * underneath answers instead.
 */

/**
 * Every name that reaches `finish`, and what standing on it sounds like. Grouped
 * by material rather than alphabetically, because the grouping is what makes a
 * mistake visible: a wall in the metal block is wrong on sight.
 */
export const MATERIALS: Record<string, SurfaceName | null> = {
  // --- stone ---------------------------------------------------------------
  'stone-wall-archway': 'stone',
  cairn: 'stone',
  cistern: 'stone',
  'platinum-column': 'stone',
  'chrome-column': 'stone',
  'frost-column': 'stone',
  'gilt-column': 'stone',
  'quartz-column': 'stone',
  'bronze-column': 'stone',
  'iridescent-column': 'stone',
  'marble-column': 'stone',
  'platinum-orb': 'stone',
  'chrome-orb': 'stone',
  'frost-orb': 'stone',
  'gilt-orb': 'stone',
  'quartz-orb': 'stone',
  'amethyst-gem': 'stone',
  'bubble-orb': 'stone',
  'crystal-gem': 'stone',
  'glass-pane': 'stone',
  'bronze-orb': 'stone',
  'iridescent-orb': 'stone',
  'marble-orb': 'stone',
  fireplace: 'stone',
  // The buildings. All stone, whatever they are walled in: what a player can
  // actually stand on is the plinth, the threshold and the buttresses, and
  // every one of those is masonry on all eight of them.
  hut: 'stone',
  cottage: 'stone',
  manor: 'stone',
  market: 'stone',
  blacksmith: 'stone',
  stable: 'stone',
  church: 'stone',
  barn: 'stone',
  rock: 'stone',
  // The boundary stone. Every one of these is something you can get on top of,
  // which is the test — `scree` is the exception and is below with the things
  // that are not walked on at all.
  boulder: 'stone',
  outcrop: 'stone',
  crag: 'stone',
  'rock-shelf': 'stone',
  'standing-stone': 'stone',
  'stone-wall-ruin': 'stone',
  'stone-wall': 'stone',
  'stone-wall-low': 'stone',
  'stone-wall-triangle-column': 'stone',
  'stone-wall-triangle-column-low': 'stone',
  'stone-wall-square-column': 'stone',
  'stone-wall-square-column-low': 'stone',
  'stone-wall-pentagon-column': 'stone',
  'stone-wall-pentagon-column-low': 'stone',

  // --- timber --------------------------------------------------------------
  barrel: 'wood',
  bed: 'wood',
  bookshelf: 'wood',
  'bookshelf-bare': 'wood',
  'bookshelf-part': 'wood',
  chair: 'wood',
  chest: 'wood',
  crate: 'wood',
  dresser: 'wood',
  'fallen-log': 'wood',
  deadfall: 'wood',
  snag: 'wood',
  'log-pile': 'wood',
  'crate-stack': 'wood',
  'barrel-stack': 'wood',
  cart: 'wood',
  plough: 'wood',
  well: 'wood',
  fence: 'wood',
  'fence-post': 'wood',
  'hut-door': 'wood',
  'hut-trapdoor': 'wood',
  lectern: 'wood',
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

  // --- straw ---------------------------------------------------------------
  //
  // `grass` is the nearest thing the surface table has to trodden dry stalks,
  // and it is the right answer rather than a near miss: what you hear standing
  // on a bale is the same rustle, with the same lack of anything solid under it.
  'hay-bale': 'grass',
  'hay-bale-stack': 'grass',
  'hay-rick': 'grass',
  // Straw again, and a sack of grain is soft the same way. Nothing you would
  // choose to stand on, and everything a yard is stacked with.
  sack: 'grass',
  // Muck. `soil` rather than `mud` — a heap left to rot is packed and dry on
  // top, and mud is what the yard around it turns into.
  'dung-heap': 'soil',

  // --- nothing you stand on ------------------------------------------------
  //
  // The ground underneath answers for all of these. Animals, plants, cloth,
  // things at head height, and things too small to get a foot on.
  'battered-book': null,
  banner: null,
  'hanging-banner': null,
  flag: null,
  curtain: null,
  'silk-drape': null,
  'velvet-drape': null,
  bluebell: null,
  // The soft boundary, and the rubble. A hedge and a thicket stop you and are
  // not things you stand *on*; scree and a root tangle are not in the collider
  // at all, so the ground under them answers.
  hedge: null,
  thicket: null,
  scree: null,
  'root-tangle': null,
  // A stick in a field. Not in the collider, so the ground answers.
  scarecrow: null,
  // Loose straw you wade into, and two tools that are leaning somewhere. None
  // of them is in the collider either.
  'straw-pile': null,
  pitchfork: null,
  rake: null,
  // Small enough to be beside your boot rather than under it.
  pail: null,
  'board-book': null,
  bovine: null,
  bramble: null,
  birch: null,
  broom: null,
  bush: null,
  candle: null,
  'cloth-book': null,
  'clasped-tome': null,
  cowparsley: null,
  daisy: null,
  dog: null,
  elder: null,
  equine: null,
  fern: null,
  figure: null,
  'folded-letter': null,
  foxglove: null,
  'gilt-book': null,
  gorse: null,
  'hanging-herbs': null,
  hazel: null,
  'large-grass-clump': null,
  lantern: null,
  lavender: null,
  'leather-book': null,
  'loose-note': null,
  ledger: null,
  moss: null,
  mushroom: null,
  nettle: null,
  oak: null,
  ovine: null,
  pamphlet: null,
  pinecone: null,
  'voidstone-orb': null,
  'gold-orb': null,
  'pearl-orb': null,
  'quicksilver-orb': null,
  'oceanglass-orb': null,
  poppy: null,
  porcine: null,
  poultry: null,
  reeds: null,
  'roller-scroll': null,
  'scroll-case': null,
  'small-birch': null,
  'small-grass-clump': null,
  'small-oak': null,
  'small-spruce': null,
  'small-tree': null,
  spruce: null,
  sticks: null,
  sunflower: null,
  thistle: null,
  'vellum-book': null,
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
  'bookshelf-books': null,
  writing: null,
};
