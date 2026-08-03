import * as THREE from 'three';
import { type ZoneDefinition, INDOOR_ENVIRONMENT, type ZoneEnvironment } from '../world/Zone';
import type { PortalDefinition } from '../world/Portal';
import { buildInterior, HOUSE_STYLE, type InteriorStyle } from '../world/interior';
import { markCollidable } from '../player/Collider';
import { PALETTE } from '../art/palette';
import { HOUSE_DOORS, ZONE_COTTAGE, ZONE_WORKSHOP, ZONE_STORE } from './countryside';
import { windowBuilder } from '../art/builders/window';
import { fireplace } from '../art/builders/fireplace';
import { stove } from '../art/builders/stove';
import { dresser } from '../art/builders/dresser';
import { chest } from '../art/builders/chest';
import { washtub } from '../art/builders/washtub';
import { broom } from '../art/builders/broom';
import { hangingHerbs } from '../art/builders/hanging-herbs';
import { spinningWheel } from '../art/builders/spinning-wheel';
import { wallPegs } from '../art/builders/wall-pegs';
import { bed } from '../art/builders/bed';
import { table } from '../art/builders/table';
import { chair } from '../art/builders/chair';
import { stool } from '../art/builders/stool';
import { crate } from '../art/builders/crate';
import { barrel } from '../art/builders/barrel';
import { cistern } from '../art/builders/cistern';
import { candle } from '../art/builders/candle';
import { lantern } from '../art/builders/lantern';
import { figure } from '../art/builders/figure';

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
 */

/** Interior dimensions, shared by each zone builder and its portal placement. */
const COTTAGE = { width: 8, depth: 6.5, height: 3 };
const WORKSHOP = { width: 9, depth: 7, height: 3.2 };
const STORE = { width: 7, depth: 5.5, height: 2.8 };

/**
 * How far a portal door stands out from the wall. Duplicated from `zones.ts`
 * for the reason `props.ts` gives: importing it would invert the dependency,
 * and the world check measures the result rather than trusting the number.
 */
const DOOR_PROUD = 0.07;

/**
 * A flagged floor, for the store. `buildInterior` paints its slab in `floor`
 * when boards are off, and nothing else moves: it is the same building as its
 * neighbours, and the floor is the whole of what makes it read as cold.
 */
const STORE_STYLE: InteriorStyle = { ...HOUSE_STYLE, floor: PALETTE.STONE_DARK };

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
  footstepReverb: 0.45,
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
  footstepReverb: 0.55,
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
      build: buildCottage,
    },
    {
      id: ZONE_WORKSHOP,
      name: 'Countryside Workshop Demo',
      group: 'countryside',
      environment: COTTAGE_ENVIRONMENT,
      spawn: { position: new THREE.Vector3(0, 0.1, 0.5), yaw: Math.PI },
      floor: -5,
      build: buildWorkshop,
    },
    {
      id: ZONE_STORE,
      name: 'Countryside Store Demo',
      group: 'countryside',
      environment: STORE_ENVIRONMENT,
      spawn: { position: new THREE.Vector3(0, 0.1, 0.4), yaw: Math.PI },
      floor: -5,
      build: buildStore,
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

/**
 * A single room round a hearth. Everything answers to the fire: the seating
 * faces it, the bed is out of its draught, the washing is where the water would
 * be heated. The strip in front of the doorway is kept clear, which the world
 * check insists on and a room wants anyway.
 */
function buildCottage(): THREE.Group {
  const root = new THREE.Group();
  root.add(buildInterior({ ...COTTAGE, seed: 4410, style: HOUSE_STYLE, planks: true, beams: 3 }));

  const halfW = COTTAGE.width / 2;
  const halfD = COTTAGE.depth / 2;

  // The hearth, central on the west wall, facing into the room. Built with its
  // back at z = 0 projecting +Z, so a quarter turn puts it against −X.
  place(root, fireplace.build({ seed: 4411 }), -halfW + 0.12, 0, 0.3, Math.PI / 2);

  // Two windows in the south wall, either side of centre, facing into the room.
  place(root, windowBuilder.build({ seed: 4412 }), -2.2, 0, halfD - 0.1, Math.PI);
  place(root, windowBuilder.build({ seed: 4413 }), 2.0, 0, halfD - 0.1, Math.PI);

  // Bed in the north-west corner: out of the fire's radiant heat, out of the
  // window light, away from the door. Beds are built lying along Z.
  place(root, bed.build({ seed: 4414 }), -halfW + 0.95, 0, -1.9, 0);
  const foot = chest.build({ seed: 4415 });
  place(root, foot, -halfW + 1.0, 0, -0.5, 0.06);

  // Table and seating pulled in toward the fire rather than pushed to the wall.
  const board = table.build({ seed: 4416 });
  place(root, board, 0.8, 0, 1.3, 0.08);
  place(root, chair.build({ seed: 4417 }), -0.5, 0, 1.9, Math.PI * 0.4);
  place(root, chair.build({ seed: 4418 }), 1.6, 0, 0.5, 0.1);
  place(root, stool.build({ seed: 4419 }), 1.9, 0, 2.0, 0.4);

  // Washing by the hearth, herbs drying above it — the overhead register, and
  // the only thing in the room whose geometry starts above head height.
  place(root, washtub.build({ seed: 4420 }), -halfW + 0.75, 0, 2.9, 0.4);
  place(root, hangingHerbs.build({ seed: 4421 }), -halfW + 0.16, 0, 2.2, Math.PI / 2);

  // The dresser on the north wall east of the door, facing into the room.
  place(root, dresser.build({ seed: 4422 }), 2.6, 0, -halfD + 0.35, 0);
  // Pegs by the door where coats come off, and the broom leaning beside them.
  place(root, wallPegs.build({ seed: 4423 }), -1.5, 0, -halfD + 0.14, 0);
  place(root, broom.build({ seed: 4424 }), -2.2, 0, -halfD + 0.45, 0.25);

  // Storage in the dead corner behind the door: the space nobody walks through
  // and nobody sits in.
  const box = crate.build({ seed: 4425 });
  place(root, box, halfW - 0.9, 0, -halfD + 0.9, 0.4);
  place(root, barrel.build({ seed: 4426 }), halfW - 0.7, 0, -0.6, 0.2);

  // Somebody home, at the table rather than in open floor — which is where a
  // person actually is.
  place(root, figure.build({ seed: 4427 }), 0.6, 0, 2.4, Math.PI * 0.9);

  // Small sources, each standing on something, at heights read off the mesh.
  place(root, candle.build({ seed: 4428 }), 0.95, topOf(board), 1.05, 0.6);
  place(root, lantern.build({ seed: 4429 }), halfW - 0.95, topOf(box), -halfD + 0.95, 0.9);
  place(root, candle.build({ seed: 4430 }), -halfW + 1.05, topOf(foot), -0.55, -0.4);

  return markCollidable(root);
}

/**
 * The room where the work is done, organised by its windows rather than by its
 * heat — so the wheel is under the south wall and everything that needs no
 * looking at is pushed to the ends.
 */
function buildWorkshop(): THREE.Group {
  const root = new THREE.Group();
  root.add(buildInterior({ ...WORKSHOP, seed: 4440, style: HOUSE_STYLE, planks: true, beams: 4 }));

  const halfW = WORKSHOP.width / 2;
  const halfD = WORKSHOP.depth / 2;

  // The light, and the two things that need it.
  place(root, windowBuilder.build({ seed: 4441 }), -2.6, 0, halfD - 0.1, Math.PI);
  place(root, windowBuilder.build({ seed: 4442 }), 2.4, 0, halfD - 0.1, Math.PI);
  place(root, spinningWheel.build({ seed: 4443 }), -2.9, 0, halfD - 1.1, Math.PI * 0.85);
  place(root, figure.build({ seed: 4444 }), -2.2, 0, halfD - 1.9, -0.7);

  // The bench end, against the west wall, out of the traffic between the door
  // and the light.
  const bench = table.build({ seed: 4445 });
  place(root, bench, -2.6, 0, -1.2, 0.1);
  place(root, stool.build({ seed: 4446 }), -1.6, 0, -1.9, 0.7);
  place(root, stool.build({ seed: 4447 }), -3.3, 0, -2.3, 2.1);
  place(root, washtub.build({ seed: 4448 }), -halfW + 0.7, 0, -0.2, 0.3);

  // Heat at the far end from the light, which is where a workroom puts it.
  place(root, stove.build({ seed: 4449 }), halfW - 0.35, 0, -2.9, -Math.PI / 2);

  // Stock down the east wall. Four containers in a line is a store; the same
  // four scattered is a mess.
  const box = crate.build({ seed: 4450 });
  place(root, box, halfW - 0.7, 0, -1.1, 0.1);
  place(root, crate.build({ seed: 4451 }), halfW - 0.75, 0, 0.3, 0.5);
  place(root, crate.build({ seed: 4452 }), 2.9, 0, -2.1, 0.9);
  place(root, barrel.build({ seed: 4453 }), halfW - 0.6, 0, 1.9, 0);
  place(root, barrel.build({ seed: 4454 }), 3.2, 0, 2.7, 0.4);
  place(root, chest.build({ seed: 4455 }), 3.6, 0, -3.0, 0.05);

  // Drying on both long walls, which is what a room with a stove in it is for.
  place(root, hangingHerbs.build({ seed: 4456 }), halfW - 0.16, 0, -0.2, -Math.PI / 2);
  place(root, hangingHerbs.build({ seed: 4457 }), -halfW + 0.16, 0, 1.1, Math.PI / 2);

  // Pegs and a broom by the door.
  place(root, wallPegs.build({ seed: 4458 }), -1.6, 0, -halfD + 0.14, 0);
  place(root, broom.build({ seed: 4459 }), -2.4, 0, -halfD + 0.45, -0.2);

  place(root, candle.build({ seed: 4460 }), -2.35, topOf(bench), -1.45, 0.3);
  place(root, lantern.build({ seed: 4461 }), halfW - 0.7, topOf(box), -1.1, -0.6);

  return markCollidable(root);
}

/**
 * A cold room with goods in it and nothing else: no furniture, no windows, no
 * person. Crates and barrels are dressing everywhere else they appear; this
 * asks whether they can carry a room on their own.
 */
function buildStore(): THREE.Group {
  const root = new THREE.Group();
  // Stone underfoot, and two beams rather than three: it is a shorter room.
  root.add(buildInterior({ ...STORE, seed: 4470, style: STORE_STYLE, planks: false, beams: 2 }));

  const halfW = STORE.width / 2;
  const halfD = STORE.depth / 2;

  // Barrels west, crates east. Sorted by kind, which is what separates a store
  // from a heap.
  place(root, barrel.build({ seed: 4471 }), -halfW + 0.6, 0, -1.6, 0);
  place(root, barrel.build({ seed: 4472 }), -halfW + 0.55, 0, -0.6, 0.4);
  place(root, barrel.build({ seed: 4473 }), -halfW + 0.62, 0, 0.5, 0.9);
  place(root, barrel.build({ seed: 4474 }), -2.4, 0, 1.6, 0.2);

  const box = crate.build({ seed: 4475 });
  place(root, box, halfW - 0.7, 0, -1.7, 0.1);
  place(root, crate.build({ seed: 4476 }), halfW - 0.65, 0, -0.5, 0.6);
  place(root, crate.build({ seed: 4477 }), halfW - 0.72, 0, 0.7, 1.2);
  place(root, crate.build({ seed: 4478 }), 2.2, 0, 1.8, 0.3);

  // The far wall: what is kept rather than what is stacked.
  const lid = chest.build({ seed: 4479 });
  place(root, lid, -1.3, 0, halfD - 0.5, 0.04);
  place(root, chest.build({ seed: 4480 }), 0.1, 0, halfD - 0.45, -0.03);
  place(root, dresser.build({ seed: 4481 }), -halfW + 0.35, 0, 1.9, Math.PI / 2);

  // Water, in the only room cold enough to keep it — and a stone basin wants
  // the stone floor.
  place(root, cistern.build({ seed: 4482 }), 1.5, 0, halfD - 0.7, 0.3);
  place(root, washtub.build({ seed: 4483 }), 1.4, 0, -halfD + 0.6, 0.5);
  place(root, hangingHerbs.build({ seed: 4484 }), halfW - 0.16, 0, 1.7, -Math.PI / 2);

  // One lantern and one candle, and that is the lot. A store lit like a
  // parlour is a parlour.
  place(root, lantern.build({ seed: 4485 }), halfW - 0.7, topOf(box), -1.7, -0.5);
  place(root, candle.build({ seed: 4486 }), -1.3, topOf(lid), halfD - 0.5, 0.4);

  return markCollidable(root);
}

/**
 * The height of the top of a placed prop, in its parent's space. Measured
 * rather than looked up: every builder rolls its dimensions from its seed, so
 * a constant would be right for one table and wrong for every other.
 */
function topOf(mesh: THREE.Mesh): number {
  mesh.geometry.computeBoundingBox();
  return (mesh.geometry.boundingBox?.max.y ?? 0) + mesh.position.y;
}

function place(
  parent: THREE.Object3D,
  mesh: THREE.Mesh,
  x: number,
  y: number,
  z: number,
  yaw: number,
): void {
  mesh.position.set(x, y, z);
  mesh.rotation.y = yaw;
  parent.add(mesh);
}
