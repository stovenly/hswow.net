import * as THREE from 'three';
import { type ZoneDefinition, OUTDOOR_ENVIRONMENT } from '../world/Zone';
import { SILENCE } from '../audio/Soundscape';
import type { PortalDefinition, PortalEnd } from '../world/Portal';
import { markCollidable } from '../player/Collider';
import { flatGround } from '../world/floor';
// Direct imports rather than `art/registry`, which is Vite-only — the headless
// zone check reaches this file through esbuild. Same rule as `zones.ts`.
import { hut } from '../art/builders/hut';
import { doorways, doorwayFront } from '../art/building';
import { countrysideTerrain, COUNTRYSIDE_GATE, ZONE_COUNTRYSIDE } from './countryside';
import { vistaShowcasePortal } from './VistaShowcase';

/**
 * The Demo Showcase: every place that is a *place*, behind one door.
 *
 * The hub used to carry the demos loose in its own field — the villager hut a
 * few paces off spawn, the village gate beside it, the factory door beside
 * that. That was right while there were two of them and it stopped being right
 * at four: the Proving Ground is a fixture for exercising movement and
 * lighting, and a rank of doors to finished places standing in the middle of it
 * is the same sprawl the prop halls were built to gather up.
 *
 * So the hub now says two things and no more. Turn around for the kit — three
 * prop halls, and the galleries and showcases inside them. Look forward for the
 * world — this room, and the demos in it.
 *
 * **The hut came with its door.** It is the one demo whose entrance is set into
 * a building rather than standing free, and a hut with a painted doorway and no
 * door in it reads as broken rather than as scaffolding. Everything else here is
 * a door on open ground, which `zones.ts` has already argued is exactly as
 * honest as a door in a wall somebody whittled for it.
 *
 * A gridded floor in fogged open air, like the general props hall and for the
 * same reason: what hangs off it is a countryside, a works, a cottage and a
 * horizon, and a shell borrowed from any one of them would be a claim about the
 * other three.
 */

export const ZONE_DEMOS = 'demos';

/** Metres across. Sized to the rank plus the walk in, not to the halls. */
const FLOOR = 96;

/** Where the door home stands, same distance in as a gallery's. */
const DOOR_Z = 16;

/**
 * How far a portal door stands out from the wall it is set into.
 *
 * Duplicated from `zones.ts` for the reason `props.ts` gives: importing it
 * would make this module depend on the one that imports *it*, and the world
 * check measures the result rather than trusting the number.
 */
const DOOR_PROUD = 0.07;

const UP = new THREE.Vector3(0, 1, 0);

/**
 * Where the demo doors stand, west to east.
 *
 * The countryside pair first — the valley and the cottage inside it — then the
 * works, then the horizon. Eight metres apart rather than the showcase rank's
 * five, because one of these is a building and the hut needs its own ground.
 */
const SLOTS = [-18, -8, 2, 10] as const;

/** The hut, and the seed it has always been built from. */
const HUT_SEED = 5511;
const HUT_AT = new THREE.Vector3(SLOTS[1], 0, 0);
/** Yaw 0 faces +Z — back toward the arrival, so the doorway is square-on. */
const HUT_YAW = 0;

/**
 * Where the hut's doorway actually is.
 *
 * Rolled from the hut's seed, so it cannot be known before a mesh exists.
 * Measured once from a throwaway build and cached — the real hut is built again
 * inside the zone, because a mesh added here would have its geometry released
 * the first time the room is dropped and come back invisible.
 */
let hutDoorAt: THREE.Vector3 | null = null;
function hutDoorPosition(): THREE.Vector3 {
  if (!hutDoorAt) {
    const measure = hut.build({ seed: HUT_SEED });
    const stand = doorwayFront(doorways(measure)[0], DOOR_PROUD);
    hutDoorAt = new THREE.Vector3(stand.x, 0, stand.z).applyAxisAngle(UP, HUT_YAW).add(HUT_AT);
    measure.geometry.dispose();
  }
  return hutDoorAt.clone();
}

/** A demo door standing free on the grid, facing the way home. */
function demoDoor(slot: number, material: 'timber' | 'iron', seed: number): PortalEnd {
  return {
    zone: ZONE_DEMOS,
    position: new THREE.Vector3(SLOTS[slot], 0, 0),
    yaw: 0,
    material,
    seed,
  };
}

export function demoZone(): ZoneDefinition {
  return {
    id: ZONE_DEMOS,
    name: 'Demo Showcase',
    // No setting of its own — it holds a countryside, a works and a horizon,
    // which is exactly what `general` means here.
    group: 'general',
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      // The numbers a gallery derives for a floor this size: fog closing inside
      // the floor's half-width, so the edge of the world never shows.
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
    build() {
      const root = new THREE.Group();
      root.add(flatGround(FLOOR));

      // The one demo that arrives as a building. Built here rather than reusing
      // the mesh the door was measured from — see `hutDoorPosition`.
      const shed = hut.build({ seed: HUT_SEED });
      shed.position.copy(HUT_AT);
      shed.rotation.y = HUT_YAW;
      root.add(markCollidable(shed));

      // The portal system builds the door meshes themselves; that is the rest
      // of the room.
      return root;
    },
  };
}

/** The hub end of the door into this room, wherever the hub decides to put it. */
export function demoHallPortal(hub: PortalEnd): PortalDefinition {
  return {
    id: 'demo-showcase-door',
    a: hub,
    b: {
      zone: ZONE_DEMOS,
      // Standing free on the grid, facing -Z into the room, exactly as a
      // gallery's door does — the arrival looks down the rank.
      position: new THREE.Vector3(0, 0, DOOR_Z),
      yaw: Math.PI,
      material: 'timber',
      seed: 6450,
    },
  };
}

/**
 * Every door out of this room.
 *
 * The two interior ends are passed in rather than derived, for the prop halls'
 * reason exactly: how a room is shaped inside is that room's business, and this
 * hall knows what hangs off it and nothing about the far side of its doors. The
 * countryside and the vista showcase own their own ends already, so they are
 * asked for them here.
 */
export function demoPortals(
  hutInterior: PortalEnd,
  factoryInterior: PortalEnd,
): PortalDefinition[] {
  return [
    {
      id: 'countryside-gate',
      a: demoDoor(0, 'timber', 4712),
      b: {
        zone: ZONE_COUNTRYSIDE,
        // On the lane at the north end of the valley, dropped onto the ground.
        // The arrival marker is derived a stride in front of this, which the
        // check confirms is walkable rather than halfway up the rim.
        position: COUNTRYSIDE_GATE.clone().setY(
          countrysideTerrain.heightAt(COUNTRYSIDE_GATE.x, COUNTRYSIDE_GATE.z),
        ),
        yaw: Math.PI,
        material: 'timber',
        seed: 4713,
      },
    },
    {
      id: 'hut-door',
      a: {
        zone: ZONE_DEMOS,
        position: hutDoorPosition(),
        yaw: HUT_YAW,
        material: 'timber',
        seed: 8801,
      },
      b: hutInterior,
    },
    {
      id: 'factory-door',
      a: demoDoor(2, 'iron', 9301),
      b: factoryInterior,
    },
    // The band past the rim. Its door stood in the general hall's showcase rank
    // while it was a rig; it is a place to stand and look out of, which is what
    // this room is for.
    vistaShowcasePortal(demoDoor(3, 'timber', 6449)),
  ];
}
