import * as THREE from 'three';
import { type ZoneDefinition, INDOOR_ENVIRONMENT, OUTDOOR_ENVIRONMENT } from '../world/Zone';
import { SILENCE } from '../audio/Soundscape';
import type { PortalDefinition, PortalEnd } from '../world/Portal';
import { buildInterior, HOUSE_STYLE, WORKS_STYLE } from '../world/interior';
import { markCollidable } from '../player/Collider';
import { flatGround } from '../world/floor';
// Plans imported from their own modules rather than through `GALLERIES`,
// because which hall a gallery belongs to is a statement about setting, and a
// list index cannot make it.
import { galleryPortal } from './galleries';
import {
  factoryInteriorGalleryPlan,
  factoryExteriorGalleryPlan,
  villageInteriorGalleryPlan,
  villageExteriorGalleryPlan,
} from './galleries/structures';
import { foliageGalleryPlan } from './galleries/foliage';
import { animalGalleryPlan } from './galleries/animal';
import { textShowcaseGalleryPlan } from './galleries/text';
import { fogShowcasePlan } from './galleries/fog';
import { soundStagePortal } from './SoundStage';
import { waterShowcasePortal } from './WaterShowcase';
import { waterShowcase2Portal } from './WaterShowcase2';
import { footstepsShowcasePortal } from './FootstepsShowcase';
import { groundcoverShowcasePortal } from './GroundcoverShowcase';
import { particleShowcasePortal } from './ParticleShowcase';

/**
 * The prop halls: one antechamber per setting, with the setting's galleries
 * hanging off it.
 *
 * The hub used to carry one door per gallery, which was four doors and about to
 * be more — every new family of objects meant another door in the rank, and the
 * rank was on its way to being the sprawl the galleries were built to replace.
 * What the world is actually growing toward is a handful of *zones*, each with
 * its own palette of objects broken down by category — so the doors are grouped
 * the way the palettes will be: a hall for the industrial kit, a hall for the
 * countryside kit, and the categories as doors inside.
 *
 * **The halls are deliberately long and deliberately empty.** Empty because
 * they are corridors to galleries, not galleries — anything standing in one
 * would be the beginning of exactly the accumulation the galleries exist to
 * hold. Long because the doors inside them are one per subzone category, and
 * more categories are coming; a hall sized to today's doors would need
 * rebuilding every time the kit grows a family, and wall is cheap.
 *
 * Doors run down the east wall from the entrance, so walking in reads the
 * whole catalogue in one look down the room, and a new category is a door in
 * the next clear stretch of wall.
 */

export const ZONE_INDUSTRIAL_PROPS = 'industrial-props';
export const ZONE_COUNTRYSIDE_PROPS = 'countryside-props';
export const ZONE_GENERAL_PROPS = 'general-props';

/**
 * How far a portal door stands out from the wall it is set into.
 *
 * Duplicated from `zones.ts` for the reason `chains.ts` gives: importing it
 * would make this module depend on the one that imports *it*, and the world
 * check measures the result rather than trusting the number.
 */
const DOOR_PROUD = 0.07;

/**
 * The halls, as half-extents the door placement is written against.
 *
 * Thirty metres deep against four doors' worth of need — see the header. The
 * proportions are otherwise their settings' own: the industrial hall is a
 * works corridor writ large, the countryside one a long timber room.
 */
const INDUSTRIAL = { width: 9, depth: 30, height: 4.5 };
const COUNTRYSIDE = { width: 8, depth: 30, height: 3.2 };

/**
 * The general hall is not a hall at all — it is a gallery-style room: a flat
 * gridded floor in fogged open air, the same construction as the galleries
 * themselves. It has no setting to borrow a shell from, which is the point of
 * it, and the doors it will eventually carry get placed the way a gallery's
 * own door is: standing free on the grid, no wall required.
 */
const GENERAL_FLOOR = 120;
/** Where the door home stands, same distance in as a gallery's. */
const GENERAL_DOOR_Z = 16;

/**
 * Where gallery doors stand along the east wall, entrance end first.
 *
 * Six metres apart, which clears two arrival markers and their walk-off sweeps
 * with room to spare. The countryside hall uses all four today; the next
 * category is a fifth entry here, and the halls were sized so the wall can
 * take several more before anything has to move.
 */
const DOOR_SLOTS = [-9, -3, 3, 9] as const;

/**
 * Where the showcase doors stand on the general hall's grid, west to east.
 *
 * Five metres apart, and it was eight. The argument for eight was that two
 * doors closer than their own arrival sweeps would read as one door with a
 * spare — which is true of doors facing *each other* and false of these: they
 * all face +Z, so their walk-offs run parallel and never meet. A frame is about
 * a metre and a half, so this still leaves three and a half metres of clear
 * grid between neighbours.
 *
 * What eight actually bought was a rank forty metres wide. That is most of the
 * way to the fog, and a long walk between two rooms whose whole purpose is to
 * be compared with each other.
 *
 * Centred on the arrival rather than running east from it, so walking in from
 * the hub puts the whole rank in one look instead of trailing off to one side.
 * An even number of doors therefore straddles the middle rather than standing
 * one on it, which is why these are on half-metres.
 */
const SHOWCASE_SLOTS = [-17.5, -12.5, -7.5, -2.5, 2.5, 7.5, 12.5, 17.5] as const;

/** A showcase door standing free on the grid, facing the way home. */
function gridDoor(slot: number, material: 'timber' | 'iron', seed: number): PortalEnd {
  return {
    zone: ZONE_GENERAL_PROPS,
    position: new THREE.Vector3(SHOWCASE_SLOTS[slot], 0, 0),
    yaw: 0,
    material,
    seed,
  };
}

/**
 * A works and a dwelling, in the same registers as the demo interiors they sit
 * beside — these halls are the *lobby* of their setting, so they borrow its
 * light and its acoustics rather than inventing their own. Fog pulled in the
 * way the factory corridor's is: a thirty-metre room whose far end fades is a
 * room with a far end, which is the one thing a long hall has to say.
 */
const INDUSTRIAL_ENVIRONMENT = {
  ...INDOOR_ENVIRONMENT,
  room: 'hall' as const,
  surface: 'stone' as const,
  fogColor: '#0f1316',
  fogNear: 8,
  fogFar: 34,
  ambientSky: 0x76818e,
  ambientGround: 0x847d73,
  ambientIntensity: 2.1,
  sunIntensity: 0.85,
  fillIntensity: 0.8,
  fillColor: 0x8e9eb0,
  footstepReverb: 0.34,
};

const COUNTRYSIDE_ENVIRONMENT = {
  ...INDOOR_ENVIRONMENT,
  room: 'cell' as const,
  surface: 'wood' as const,
  fogColor: '#181309',
  fogNear: 8,
  fogFar: 30,
  ambientSky: 0xa2977c,
  ambientGround: 0x574c3c,
  ambientIntensity: 2.3,
  sunIntensity: 1.2,
  fillIntensity: 0.8,
  fillColor: 0xa08c6a,
  footstepReverb: 0.45,
};

export function propZones(): ZoneDefinition[] {
  return [
    {
      id: ZONE_INDUSTRIAL_PROPS,
      name: 'Industrial Props',
      group: 'industrial',
      environment: INDUSTRIAL_ENVIRONMENT,
      spawn: { position: new THREE.Vector3(0, 0.1, -INDUSTRIAL.depth / 2 + 2), yaw: Math.PI },
      floor: -5,
      // Shell only. No planks and no beams, same as the factory hall — a works
      // is not roofed in wood — and nothing on the floor at all.
      build: () =>
        markCollidable(
          new THREE.Group().add(
            buildInterior({ ...INDUSTRIAL, seed: 7730, style: WORKS_STYLE, planks: false, beams: 0 }),
          ),
        ),
    },
    {
      id: ZONE_COUNTRYSIDE_PROPS,
      name: 'Countryside Props',
      group: 'countryside',
      environment: COUNTRYSIDE_ENVIRONMENT,
      spawn: { position: new THREE.Vector3(0, 0.1, -COUNTRYSIDE.depth / 2 + 2), yaw: Math.PI },
      floor: -5,
      // Beams every four metres or so — thirty metres of unbroken timber
      // ceiling would be the one plane in the room with nothing to read on it.
      build: () =>
        markCollidable(
          new THREE.Group().add(
            buildInterior({ ...COUNTRYSIDE, seed: 4470, style: HOUSE_STYLE, planks: true, beams: 7 }),
          ),
        ),
    },
    {
      id: ZONE_GENERAL_PROPS,
      name: 'General Props',
      group: 'general',
      environment: {
        ...OUTDOOR_ENVIRONMENT,
        // The same numbers a gallery derives for a floor this size: fog closing
        // inside the floor's half-width, so the edge of the world never shows,
        // and pale bounce off the pale grid.
        fogNear: GENERAL_FLOOR * 0.46 * 0.45,
        fogFar: GENERAL_FLOOR * 0.46,
        ambientGround: 0xbfb298,
        surface: 'stone',
        room: 'open',
        soundscape: SILENCE,
      },
      spawn: { position: new THREE.Vector3(0, 0.1, GENERAL_DOOR_Z - 2), yaw: 0 },
      floor: -20,
      groundAt: () => 0,
      // A floor, and the doors standing free on the grid the way a gallery's
      // own door does — the Text Showcase's is the first; the portal system
      // builds the door meshes themselves, so there is nothing to add here.
      build() {
        const root = new THREE.Group();
        root.add(flatGround(GENERAL_FLOOR));
        return root;
      },
    },
  ];
}

/** A gallery door in a hall's east wall, facing into the room. */
function wallDoor(
  zone: string,
  shell: { width: number },
  slot: number,
  material: 'timber' | 'iron',
  seed: number,
): PortalEnd {
  return {
    zone,
    position: new THREE.Vector3(shell.width / 2 - DOOR_PROUD, 0, DOOR_SLOTS[slot]),
    // Faces -X, into the hall, so the arrival stands in open floor looking
    // across it rather than into the wall the door is set in.
    yaw: -Math.PI / 2,
    material,
    seed,
  };
}

/**
 * Every door in and out of the two halls.
 *
 * The hub ends are passed in rather than derived, for the galleries' own
 * reason: where the doors stand in the hub is the hub's business, and a hall
 * knows what hangs off it and nothing about the world outside its door.
 */
export function propPortals(
  industrialHub: PortalEnd,
  countrysideHub: PortalEnd,
  generalHub: PortalEnd,
): PortalDefinition[] {
  return [
    {
      id: 'industrial-props-door',
      a: industrialHub,
      b: {
        zone: ZONE_INDUSTRIAL_PROPS,
        position: new THREE.Vector3(0, 0, -INDUSTRIAL.depth / 2 + DOOR_PROUD),
        yaw: 0,
        material: 'iron',
        seed: 6401,
      },
    },
    {
      id: 'countryside-props-door',
      a: countrysideHub,
      b: {
        zone: ZONE_COUNTRYSIDE_PROPS,
        position: new THREE.Vector3(0, 0, -COUNTRYSIDE.depth / 2 + DOOR_PROUD),
        yaw: 0,
        material: 'timber',
        seed: 6402,
      },
    },
    {
      id: 'general-props-door',
      a: generalHub,
      b: {
        zone: ZONE_GENERAL_PROPS,
        // Standing free on the grid, facing -Z into the room, exactly as a
        // gallery's door does — the arrival looks out over the empty floor.
        position: new THREE.Vector3(0, 0, GENERAL_DOOR_Z),
        yaw: Math.PI,
        material: 'timber',
        seed: 6403,
      },
    },
    // The galleries, one door each, entrance end first. `galleryPortal` owns
    // the gallery side, so a gallery cannot exist without a way in — the same
    // guarantee the hub rank used to provide, moved one door deeper.
    //
    // Interior before exterior in both halls, and the village pair before the
    // rest of the countryside: a hall is read walking in, so the categories of
    // one subzone stand together and the odd ones out come last.
    galleryPortal(
      factoryInteriorGalleryPlan,
      wallDoor(ZONE_INDUSTRIAL_PROPS, INDUSTRIAL, 0, 'iron', 6411),
    ),
    galleryPortal(
      factoryExteriorGalleryPlan,
      wallDoor(ZONE_INDUSTRIAL_PROPS, INDUSTRIAL, 1, 'iron', 6412),
    ),
    galleryPortal(
      villageInteriorGalleryPlan,
      wallDoor(ZONE_COUNTRYSIDE_PROPS, COUNTRYSIDE, 0, 'timber', 6421),
    ),
    galleryPortal(
      villageExteriorGalleryPlan,
      wallDoor(ZONE_COUNTRYSIDE_PROPS, COUNTRYSIDE, 1, 'timber', 6422),
    ),
    galleryPortal(animalGalleryPlan, wallDoor(ZONE_COUNTRYSIDE_PROPS, COUNTRYSIDE, 2, 'timber', 6423)),
    galleryPortal(foliageGalleryPlan, wallDoor(ZONE_COUNTRYSIDE_PROPS, COUNTRYSIDE, 3, 'timber', 6424)),
    // --- the showcase rank, west to east ------------------------------------
    //
    // Everything here hangs off the general hall because it belongs to no
    // setting, which is exactly what that room is for: lettering, air, a rack
    // of machinery, a pond, the sea, and the ground.
    //
    // Fog first, at the west end. Air belongs to no setting either.
    galleryPortal(fogShowcasePlan, gridDoor(0, 'timber', 6432)),
    // Lettering, which was the first door out here and the reason the rank
    // exists.
    galleryPortal(textShowcaseGalleryPlan, gridDoor(1, 'timber', 6431)),
    // The Sound Showcase. It stood in the exterior, four paces from spawn, on
    // the argument that it was the only place in the hub where a model could be
    // heard and friction in front of the only door is just friction. That
    // argument was about *reachability*, and it is answered as well by a door
    // in the room the other showcases open off — while a workbench standing in
    // the village street was always the odd thing out in a zone that is meant
    // to read as a place.
    //
    // Iron rather than timber: what is behind it is a rack of machinery, and
    // the door is the first thing that says so.
    soundStagePortal(gridDoor(2, 'iron', 6433)),
    // A pond is not industrial and it is not countryside; it is a surface.
    waterShowcasePortal(gridDoor(3, 'timber', 6434)),
    // And the open sea beside it, which is the same subject at a size nothing
    // else in the rank is — see `WaterShowcase2`.
    waterShowcase2Portal(gridDoor(4, 'timber', 6435)),
    // Footsteps. Iron again: what is behind it is a test rig rather than a
    // place.
    footstepsShowcasePortal(gridDoor(5, 'iron', 6436)),
    // The ground everything else in this room is standing on.
    groundcoverShowcasePortal(gridDoor(6, 'timber', 6437)),
    // And the air above it closes the rank. Iron, because what is behind it is
    // a rig rather than a place — ten systems standing in a line.
    particleShowcasePortal(gridDoor(7, 'iron', 6438)),
  ];
}
