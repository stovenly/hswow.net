import * as THREE from 'three';
import type { PortalDefinition, PortalEnd } from '@engine/world/Portal';
// Direct imports rather than `art/registry`, which is Vite-only — the headless
// zone check reaches this file through esbuild. Same rule as `zones.ts`.
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

/** Where the door home stands, same distance in as a gallery's. */
const DOOR_Z = 16;

/**
 * Where the demo doors stand, west to east.
 *
 * The countryside pair first — the valley and the cottage inside it — then the
 * works, then the horizon. Eight metres apart rather than the showcase rank's
 * five, because one of these is a building and the hut needs its own ground.
 */
const SLOTS = [-18, -8, 2, 10] as const;

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
export function demoPortals(factoryInterior: PortalEnd): PortalDefinition[] {
  return [
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
