import * as THREE from 'three';
import { OUTDOOR_ENVIRONMENT, type ZoneDefinition } from '../../world/Zone';
import { SILENCE } from '../../audio/Soundscape';
import type { PortalDefinition, PortalEnd } from '../../world/Portal';
import { flatGround } from '../../world/floor';
import { galleryPortal, type GalleryPlan } from './layout';
import { variantPair } from '../../art/builders/recipe-fixtures';
import { giltOrb } from '../../art/builders/gilt-orb';
import { giltColumn } from '../../art/builders/gilt-column';
import { bronzeOrb } from '../../art/builders/bronze-orb';
import { bronzeColumn } from '../../art/builders/bronze-column';
import { chromeOrb } from '../../art/builders/chrome-orb';
import { chromeColumn } from '../../art/builders/chrome-column';
import { platinumOrb } from '../../art/builders/platinum-orb';
import { platinumColumn } from '../../art/builders/platinum-column';
import { frostOrb } from '../../art/builders/frost-orb';
import { frostColumn } from '../../art/builders/frost-column';
import { iridescentOrb } from '../../art/builders/iridescent-orb';
import { iridescentColumn } from '../../art/builders/iridescent-column';
import { quartzOrb } from '../../art/builders/quartz-orb';
import { quartzColumn } from '../../art/builders/quartz-column';
import { marbleOrb } from '../../art/builders/marble-orb';
import { marbleColumn } from '../../art/builders/marble-column';
import { silkDrape } from '../../art/builders/silk-drape';
import { velvetDrape } from '../../art/builders/velvet-drape';
import { crystalGem } from '../../art/builders/crystal-gem';
import { amethystGem } from '../../art/builders/amethyst-gem';
import { bubbleOrb } from '../../art/builders/bubble-orb';
import { glassPaneProp } from '../../art/builders/glass-pane';

/**
 * The Materials wing: an antechamber, and one room per question about a
 * surface.
 *
 * **It was two doors in the showcase rank and it could not stay two.** The rank
 * in `debug/props.ts` holds sixteen doors and held sixteen; Materials and
 * Materials 2 had one each, and R6 tripled what wants showing. Adding five more
 * doors to a rank already argued down from eight-metre spacing to five is the
 * sprawl the galleries were built to replace.
 *
 * So the two rooms become one door and a wing, in the halls' own shape — an
 * antechamber with the categories hanging off it, exactly as the industrial and
 * countryside kits are arranged. That *frees* a slot in the rank rather than
 * needing five more, and it puts the material rooms next to each other, which
 * is where they belong: the only useful thing to compare a highlight against is
 * another highlight.
 *
 * The wing itself is a gallery-shaped room rather than a hall — a flat gridded
 * floor in fogged open air, doors standing free on the grid. Materials have no
 * setting to borrow a shell from, which is the same argument the general hall
 * makes about itself.
 *
 * ## One room, one question
 *
 * The principle the first Materials Gallery was built on, kept: a room is a
 * *scale*, and standing something in it that differs by a whole optical model
 * breaks the scale. What is new is that there are now enough looks to make each
 * scale properly, instead of two rooms holding a scale and a collection.
 */

export const ZONE_MATERIALS_WING = 'materials-wing';

export const ZONE_MATERIALS_METALS = 'materials-metals';
export const ZONE_MATERIALS_STONE = 'materials-stone';
export const ZONE_MATERIALS_GEMSTONE = 'materials-gemstone';
export const ZONE_MATERIALS_SHELL = 'materials-shell';
export const ZONE_MATERIALS_CLOTH = 'materials-cloth';
export const ZONE_MATERIALS_STAINED_GLASS = 'materials-stained-glass';
export const ZONE_MATERIALS_PORTALS = 'materials-portals';

/**
 * Metal, mirror to matte — and then four mirrors onto somewhere that is not
 * here.
 *
 * The four parameter metals first, because quickmetal is only legible against
 * a real one: what it does is replace what the surface is *looking at*, and
 * that claim is unreadable unless something beside it is looking at the room.
 */
export const materialsMetalsPlan: GalleryPlan = {
  id: ZONE_MATERIALS_METALS,
  group: 'general',
  name: 'Metals',
  door: 'iron',
  builders: [
    chromeOrb,
    chromeColumn,
    bronzeOrb,
    bronzeColumn,
    platinumOrb,
    platinumColumn,
    giltOrb,
    giltColumn,
    // Mercury, and what else that flow turns out to be. `nightsilver` stands
    // second so the inversion is read straight off the one it inverts.
    ...variantPair('quicksilver'),
    ...variantPair('nightsilver'),
    ...variantPair('slowbrass'),
    ...variantPair('stillglass'),
  ],
};

/**
 * What light does *inside* a dielectric.
 *
 * Quartz is the plain answer, marble the one light wraps through, the schillers
 * put colour in the body, and the tenebrescents change it while you watch. One
 * rank,
 * because the argument runs the whole length of it: every fixture here is
 * returning light from under the surface rather than off it.
 */
export const materialsStonePlan: GalleryPlan = {
  id: ZONE_MATERIALS_STONE,
  group: 'general',
  name: 'Stone',
  builders: [
    quartzOrb,
    quartzColumn,
    marbleOrb,
    marbleColumn,
    ...variantPair('labradorite'),
    ...variantPair('spectrolite'),
    ...variantPair('moonsheen'),
    ...variantPair('sunstone'),
    // The three that change while you watch. Every one of them burns from a
    // colour into another colour — see `recipes/tenebrescent.ts` for why none
    // of them has a bare white face any more.
    ...variantPair('violetbloom'),
    ...variantPair('emberstone'),
    ...variantPair('verdigrist'),
  ],
};

/**
 * Refraction, facets and transmission — the transmissive family, which is a
 * different material and a different pass.
 *
 * Frost leads rather than standing with the films next door: it is a rough
 * dielectric full of grains, which is the dry version of the question every
 * other fixture in here answers wet.
 */
export const materialsGemstonePlan: GalleryPlan = {
  id: ZONE_MATERIALS_GEMSTONE,
  group: 'general',
  name: 'Gemstone',
  builders: [
    frostOrb,
    frostColumn,
    // Each isolates one term: the gem is refraction broken by facets, the
    // amethyst is the same cut absorbing hard, the pane is one flat normal
    // with no dispersion, and the bubble is fresnel and film alone.
    crystalGem,
    amethystGem,
    glassPaneProp,
    bubbleOrb,
  ],
};

/**
 * Films: interference laid over a pale body.
 *
 * The plain iridescent fixture first — one film, one thickness, hue by angle —
 * and then the same term made uneven, over a pale body and a dark one. Those
 * two are one shader and one pair of table rows apart, and they read as
 * different materials entirely; if anything in the wing makes R6's case in a
 * single glance, it is those two standing next to each other.
 */
export const materialsShellPlan: GalleryPlan = {
  id: ZONE_MATERIALS_SHELL,
  group: 'general',
  name: 'Shell',
  builders: [
    iridescentOrb,
    iridescentColumn,
    ...variantPair('nacreous'),
    ...variantPair('lunacreous'),
  ],
};

/**
 * Cloth, which wants a different shape entirely.
 *
 * The two drapes stood in the Shell room on the argument that sheen is one term
 * whatever it is wrapped around. True, and beside the point: nothing else in
 * that room is cloth, and a hanging panel next to a rank of orbs reads as a
 * mistake before it reads as a comparison. The terms that matter to cloth are
 * both about a *surface turning*, which is why the fixture is a drape and why
 * the drapes get a room.
 *
 * Two rows, and it is meant to grow — this is where a finish belongs the moment
 * it is one a garment would have.
 */
export const materialsClothPlan: GalleryPlan = {
  id: ZONE_MATERIALS_CLOTH,
  group: 'general',
  name: 'Cloth',
  builders: [silkDrape, velvetDrape],
};

/**
 * Six looks, one field, one program, no compile.
 *
 * **Its own room because it is the argument.** Everything else in this wing is
 * a set of materials; this is a demonstration that the material system does
 * what six phases of refactor claimed it would. Walking the rank you are
 * looking at one shader block and six rows of a uniform table, and the only
 * honest way to say that is to put them in a line and let it be obvious.
 */
export const materialsStainedGlassPlan: GalleryPlan = {
  id: ZONE_MATERIALS_STAINED_GLASS,
  group: 'general',
  name: 'Stained Glass',
  builders: [
    ...variantPair('oceanglass'),
    ...variantPair('rosewindow'),
    ...variantPair('ivyglass'),
    ...variantPair('lapispane'),
  ],
};

/**
 * The scene class: windows onto somewhere that is not here.
 *
 * An orb and a column for every one of them, like every other room in the wing.
 * The temptation was to give the scenes orbs only, on the argument that a scene
 * depends on the eye ray alone and so an orb and a column wear the *same*
 * window — which is true, and is exactly the thing worth being able to see. A
 * rank that states it once and then stops has made the claim without showing it.
 *
 * Lit like the rest of the wing. It was dark, on the reasoning that a night sky
 * cannot be read in daylight; but only one of these seven is a night, and a room
 * blacked out for the sake of one fixture makes the other six wrong. They emit
 * their own light regardless — that is what a portal is.
 */
export const materialsPortalsPlan: GalleryPlan = {
  id: ZONE_MATERIALS_PORTALS,
  group: 'general',
  name: 'Portals',
  door: 'iron',
  builders: [
    // Night first, then the deck, then three hours of one day, then the corona.
    ...variantPair('voidstone'),
    ...variantPair('overcast'),
    ...variantPair('lakestill'),
    ...variantPair('duskstone'),
    ...variantPair('dawnstone'),
    ...variantPair('daystone'),
    ...variantPair('auroral'),
  ],
};

/** The wing's rooms, west to east, in the order the doors stand. */
export const MATERIALS_ROOMS: readonly GalleryPlan[] = [
  materialsMetalsPlan,
  materialsStonePlan,
  materialsGemstonePlan,
  materialsShellPlan,
  materialsClothPlan,
  materialsStainedGlassPlan,
  materialsPortalsPlan,
];

/** Wide enough for the rank of doors and the walk back from them, no wider. */
const FLOOR = 90;
/** Where the door home stands, the same distance in as a gallery's. */
const DOOR_Z = 16;
/**
 * Where the six doors stand, west to east.
 *
 * Five metres apart and centred on the arrival, which is `SHOWCASE_SLOTS`'
 * spacing and its reasoning: these all face the same way, so their walk-offs
 * run parallel and never meet, and a frame is about a metre and a half. An odd
 * number of doors, so one stands on the middle and the arrival looks straight
 * at it.
 */
const SLOTS = [-15, -10, -5, 0, 5, 10, 15] as const;

export function materialsWingZone(): ZoneDefinition {
  return {
    id: ZONE_MATERIALS_WING,
    name: 'Materials',
    group: 'general',
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      // The numbers a gallery derives for a floor this size: fog closing inside
      // the floor's half-width so the edge of the world never shows, and pale
      // bounce off the pale grid.
      fogNear: FLOOR * 0.46 * 0.45,
      fogFar: FLOOR * 0.46,
      ambientGround: 0xbfb298,
      surface: 'stone',
      room: 'open',
      soundscape: SILENCE,
    },
    spawn: { position: new THREE.Vector3(0, 0.1, DOOR_Z - 2), yaw: 0 },
    floor: -20,
    groundAt: () => 0,
    // A floor, and the doors standing free on the grid the way a gallery's own
    // door does — the portal system builds the door meshes, so there is nothing
    // to add here. Deliberately empty otherwise: an antechamber with fixtures
    // in it is the beginning of the accumulation the rooms exist to hold.
    build() {
      const root = new THREE.Group();
      root.add(flatGround(FLOOR));
      return root;
    },
  };
}

/**
 * Every door in and out of the wing: the one from the showcase rank, and the
 * six inside.
 *
 * The hub end is passed in rather than derived, for the galleries' own reason —
 * where the door stands out there is the hall's business, and a wing knows what
 * hangs off it and nothing about the world outside its door.
 */
export function materialsWingPortals(hub: PortalEnd): PortalDefinition[] {
  return [
    {
      id: 'materials-wing-door',
      a: hub,
      b: {
        zone: ZONE_MATERIALS_WING,
        // Standing free on the grid facing -Z into the room, exactly as a
        // gallery's door does — the arrival looks out over the rank.
        position: new THREE.Vector3(0, 0, DOOR_Z),
        yaw: Math.PI,
        material: 'timber',
        seed: 6449,
      },
    },
    ...MATERIALS_ROOMS.map((plan, index) =>
      galleryPortal(plan, {
        zone: ZONE_MATERIALS_WING,
        position: new THREE.Vector3(SLOTS[index], 0, 0),
        yaw: 0,
        material: plan.door === 'iron' ? 'iron' : 'timber',
        seed: 6450 + index,
      }),
    ),
  ];
}
