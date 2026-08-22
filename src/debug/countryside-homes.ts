import * as THREE from 'three';
import { type ZoneDefinition, INDOOR_ENVIRONMENT, type ZoneEnvironment } from '../world/Zone';
import type { PortalDefinition } from '../world/Portal';
import { HOUSE_DOORS, ZONE_COTTAGE, ZONE_WORKSHOP, ZONE_STORE } from './countryside';

/**
 * The three rooms behind the three open doors in the Countryside Exterior Demo.
 *
 * They exist to be unlike each other. One enterable house proves the threshold
 * works; three prove the kit does, so every countryside interior builder is
 * used across the set and no two rooms come from the same half of it:
 *
 * - **the cottage** is organised by its hearth, and holds the furniture;
 * - **the workshop** is organised by its light, and holds the work;
 * - **the store** has no furniture, no windows and nobody in it — the one room
 *   that asks whether crates and barrels can carry a space on their own.
 *
 * Smaller than the Countryside Village Interior Demo, which is a well-off house
 * at ten by eight. These are the cottages in the street outside it.
 *
 * Their doors are the exterior's — see `HOUSE_DOORS`.
 *
 * **The geometry is in `countryside-homes.build.ts` and loads on demand.** What
 * is left here is what the world needs before anyone opens a door: the names,
 * the air, and the dimensions the portals are placed from. See
 * ZONE-LOADING.md Phase D.
 */

/**
 * Interior dimensions, shared by each zone's builder and its portal placement.
 * Exported for the build chunk, which is the other half of that sharing — a
 * room whose door is placed from one depth and whose walls are built from
 * another has its way out inside a wall.
 */
export const COTTAGE = { width: 8, depth: 6.5, height: 3 };
export const WORKSHOP = { width: 9, depth: 7, height: 3.2 };
export const STORE = { width: 7, depth: 5.5, height: 2.8 };

/**
 * How far a portal door stands out from the wall. Duplicated from `zones.ts`
 * for the reason `props.ts` gives: importing it would invert the dependency,
 * and the world check measures the result rather than trusting the number.
 */
const DOOR_PROUD = 0.07;

/**
 * Warm, close and quiet — the register the countryside interiors share. Taken
 * from the Countryside Village Interior Demo rather than re-tuned: these rooms
 * are next door to it and want the same weather.
 */
const COTTAGE_ENVIRONMENT: ZoneEnvironment = {
  ...INDOOR_ENVIRONMENT,
  room: 'cell',
  surface: 'wood',
  fogColor: '#181309',
  fogNear: 8,
  fogFar: 30,
  ambientSky: 0xa2977c,
  ambientGround: 0x574c3c,
  ambientIntensity: 2.3,
  sunIntensity: 1.2,
  fillIntensity: 0.8,
  fillColor: 0xa08c6a,
  firstPersonReverb: 0.45,
};

/**
 * The store: stone underfoot in a shorter, harder room, so the fog closes
 * sooner and the boots ring. Everything here is the floor's doing.
 */
const STORE_ENVIRONMENT: ZoneEnvironment = {
  ...COTTAGE_ENVIRONMENT,
  surface: 'stone',
  fogNear: 6,
  fogFar: 24,
  firstPersonReverb: 0.55,
};

export function countrysideHomeZones(): ZoneDefinition[] {
  return [
    {
      id: ZONE_COTTAGE,
      name: 'Countryside Cottage Demo',
      group: 'countryside',
      environment: COTTAGE_ENVIRONMENT,
      // Only reached if something goes wrong — arriving through the door puts
      // you on the portal's marker instead. In the middle of the floor, so it
      // is obvious when it has been used.
      spawn: { position: new THREE.Vector3(0, 0.1, 0.5), yaw: Math.PI },
      floor: -5,
      load: () => import('./countryside-homes.build').then((m) => m.buildCottage),
    },
    {
      id: ZONE_WORKSHOP,
      name: 'Countryside Workshop Demo',
      group: 'countryside',
      environment: COTTAGE_ENVIRONMENT,
      spawn: { position: new THREE.Vector3(0, 0.1, 0.5), yaw: Math.PI },
      floor: -5,
      load: () => import('./countryside-homes.build').then((m) => m.buildWorkshop),
    },
    {
      id: ZONE_STORE,
      name: 'Countryside Store Demo',
      group: 'countryside',
      environment: STORE_ENVIRONMENT,
      spawn: { position: new THREE.Vector3(0, 0.1, 0.4), yaw: Math.PI },
      floor: -5,
      load: () => import('./countryside-homes.build').then((m) => m.buildStore),
    },
  ];
}

export function countrysideHomePortals(): PortalDefinition[] {
  return [
    homePortal(ZONE_COTTAGE, COTTAGE.depth, 8811),
    homePortal(ZONE_WORKSHOP, WORKSHOP.depth, 8812),
    homePortal(ZONE_STORE, STORE.depth, 8813),
  ];
}

/**
 * One house's door, from the outside in. The inside end is always the same
 * shape — north wall, x = 0, facing back into the room — because each of these
 * rooms is authored about its own origin with the way out behind you.
 */
function homePortal(zone: string, depth: number, seed: number): PortalDefinition {
  const outside = HOUSE_DOORS.get(zone);
  if (!outside) throw new Error(`no doorway in the exterior for ${zone}`);
  return {
    id: `${zone}-door`,
    a: outside,
    b: {
      zone,
      position: new THREE.Vector3(0, 0, -depth / 2 + DOOR_PROUD),
      yaw: 0,
      material: 'timber',
      seed,
    },
  };
}
