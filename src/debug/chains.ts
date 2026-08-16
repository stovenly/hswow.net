import * as THREE from 'three';
import { type ZoneDefinition, INDOOR_ENVIRONMENT } from '../world/Zone';
import type { PortalDefinition } from '../world/Portal';
import { buildInterior, HOUSE_STYLE, WORKS_STYLE } from '../world/interior';
import { markCollidable } from '../player/Collider';
import { PALETTE, shade } from '../art/palette';
// Direct imports rather than `art/registry`, which is Vite-only — the headless
// zone check reaches this file through esbuild. Same rule as `zones.ts`.
import { anvil } from '../art/builders/anvil';
import { barrel } from '../art/builders/barrel';
import { bed } from '../art/builders/bed';
import { candle } from '../art/builders/candle';
import { chair } from '../art/builders/chair';
import { chainlink } from '../art/builders/chainlink';
import { chest } from '../art/builders/chest';
import { crate } from '../art/builders/crate';
import { dresser } from '../art/builders/dresser';
import { figure } from '../art/builders/figure';
import { floodlight } from '../art/builders/floodlight';
import { forge } from '../art/builders/forge';
import { hangingHerbs } from '../art/builders/hanging-herbs';
import { hoist } from '../art/builders/hoist';
import { hopper } from '../art/builders/hopper';
import { ladder } from '../art/builders/ladder';
import { lantern } from '../art/builders/lantern';
import { machine } from '../art/builders/machine';
import { pipes } from '../art/builders/pipes';
import { railing } from '../art/builders/railing';
import { sink } from '../art/builders/sink';
import { spinningWheel } from '../art/builders/spinning-wheel';
import { stool } from '../art/builders/stool';
import { table } from '../art/builders/table';
import { tank } from '../art/builders/tank';
import { vent } from '../art/builders/vent';
import { washtub } from '../art/builders/washtub';
import { windowBuilder } from '../art/builders/window';
import { workbench } from '../art/builders/workbench';

/**
 * Two chains of rooms, three deep, hung off the hub.
 *
 * **These exist to be walked away from.** Zone eviction keys residency to the
 * portal graph, so the only way to observe it is to stand somewhere more than
 * two doors from where you started — and until now the world had no such place.
 * Every interior hung directly off the Proving Ground, which meant the whole
 * world was within one hop of the hub and nothing was ever a candidate for
 * being dropped.
 *
 * Three deep is the shortest chain that proves the policy rather than merely
 * exercising it. At two deep the far room is two hops from the hub, which is
 * inside the grace band; at three the hub itself falls out of the resident set,
 * which is the case worth being sure about — the hub is the zone the player
 * always comes back to, so it is the one whose rebuild has to be correct.
 *
 * ## They are also fixtures, and are dressed accordingly
 *
 * Each room differs from its parent in *proportion* rather than in contents,
 * because proportion is what the eye reads first and what a zone system is
 * actually claiming to change. A long corridor, a tall shaft, a low store and a
 * shallow workroom are four obviously different spaces built from one
 * `buildInterior` call each — which is also the honest demonstration that the
 * interior kit is not a box factory.
 *
 * Props are enough to make each room read as a place and no more. These are
 * test fixtures; the finished world's rooms are content, and content is
 * authored against the fiction rather than against a residency check.
 *
 * **The names are placeholders**, like every other name in the test world.
 */

export const ZONE_FACTORY_2 = 'factory-2';
export const ZONE_FACTORY_3 = 'factory-3';
export const ZONE_HUT_ROOM = 'hut-room';
export const ZONE_HUT_ROOM_2 = 'hut-room-2';

/**
 * How far a portal door stands out from the wall it is set into.
 *
 * Duplicated from `zones.ts` rather than imported, because importing it would
 * make this module depend on the one that imports *it* — and a cycle between
 * two zone files is a boot-order bug waiting for someone to reorder an import.
 * One number, and the world check measures the result rather than trusting it.
 */
const DOOR_PROUD = 0.07;

/**
 * The rooms, as half-extents the door placement can be written against.
 *
 * Declared up here rather than inside each builder because a portal end needs
 * the wall position and the builder needs the same number — typing it twice is
 * how a door ends up floating a hand's width inside a wall.
 */
const FACTORY_2 = { width: 7, depth: 22, height: 4 };
const FACTORY_3 = { width: 8.5, depth: 8.5, height: 9 };
const HUT_ROOM = { width: 5.5, depth: 6, height: 2.5 };
const HUT_ROOM_2 = { width: 9, depth: 5, height: 3 };

/**
 * A works, one flight down and colder.
 *
 * Same palette family as the hall it opens off, deliberately: these are meant
 * to read as further into the *same* building, so the thing that changes is the
 * shape of the space and not the material it is made of.
 */
const WORKS_ENVIRONMENT = {
  ...INDOOR_ENVIRONMENT,
  room: 'hall' as const,
  surface: 'stone' as const,
  fogColor: '#0f1316',
  ambientSky: 0x76818e,
  ambientGround: 0x847d73,
  ambientIntensity: 2.1,
  sunIntensity: 0.85,
  fillIntensity: 0.8,
  fillColor: 0x8e9eb0,
  footstepReverb: 0.34,
};

/** A dwelling: warm, close, and lit by things standing on other things. */
const HOUSE_ENVIRONMENT = {
  ...INDOOR_ENVIRONMENT,
  room: 'cell' as const,
  surface: 'wood' as const,
  fogColor: '#181309',
  ambientSky: 0xa2977c,
  ambientGround: 0x574c3c,
  ambientIntensity: 2.3,
  sunIntensity: 1.2,
  fillIntensity: 0.8,
  fillColor: 0xa08c6a,
  footstepReverb: 0.45,
};

export function chainZones(): ZoneDefinition[] {
  return [
    {
      id: ZONE_FACTORY_2,
      name: 'Factory 2',
      group: 'industrial',
      environment: {
        ...WORKS_ENVIRONMENT,
        // Long, so the far end has to actually be far. Fog that closes at 48 m
        // in a 22 m room never engages at all; pulled in, the length of the
        // place becomes something you can see rather than something you pace.
        fogNear: 7,
        fogFar: 30,
      },
      spawn: { position: new THREE.Vector3(0, 0.1, -FACTORY_2.depth / 2 + 2), yaw: Math.PI },
      floor: -5,
      build: () => buildFactory2(),
    },
    {
      id: ZONE_FACTORY_3,
      name: 'Factory 3',
      group: 'industrial',
      environment: {
        ...WORKS_ENVIRONMENT,
        // Tall rather than long, so the fog is set to leave the roof visible.
        // A nine-metre shaft whose top is fogged out is a room with no top,
        // which is the one thing this space is for.
        fogNear: 11,
        fogFar: 42,
        // Lifted, because the only thing up there to light the underside of the
        // roof is bounce off a floor nine metres below it.
        ambientIntensity: 2.4,
      },
      spawn: { position: new THREE.Vector3(0, 0.1, -FACTORY_3.depth / 2 + 2), yaw: Math.PI },
      floor: -5,
      build: () => buildFactory3(),
    },
    {
      id: ZONE_HUT_ROOM,
      name: 'Villager Hut Room',
      group: 'countryside',
      environment: {
        ...HOUSE_ENVIRONMENT,
        // A store room, and stores are dim. Also the smallest space in the
        // world, so the fog is tightened to match — at the hut's 9 m near
        // plane a 6 m room has no fog in it at all.
        fogNear: 4,
        fogFar: 20,
        ambientIntensity: 1.9,
        sunIntensity: 0.7,
      },
      spawn: { position: new THREE.Vector3(0, 0.1, 1), yaw: Math.PI },
      floor: -5,
      build: () => buildHutRoom(),
    },
    {
      id: ZONE_HUT_ROOM_2,
      name: 'Villager Hut Room 2',
      group: 'countryside',
      environment: {
        ...HOUSE_ENVIRONMENT,
        fogNear: 6,
        fogFar: 26,
        // The one room in the chain with windows in it, so it is the one room
        // that is allowed to be bright.
        ambientIntensity: 2.6,
        sunIntensity: 1.35,
      },
      spawn: { position: new THREE.Vector3(0, 0.1, 1), yaw: Math.PI },
      floor: -5,
      build: () => buildHutRoom2(),
    },
  ];
}

/**
 * The doors that chain them, and the two that hang the chains off the world.
 *
 * The parent ends — in The Factory and in the Villager Hut — are placed against
 * walls that were already clear, which took some doing in the hut: it is a
 * ten-by-eight room with a hearth, a stove, two windows and a bed in it, and
 * the only wall with two metres of floor in front of it is the east one.
 */
export function chainPortals(factoryId: string, hutId: string): PortalDefinition[] {
  const f2 = FACTORY_2.depth / 2;
  const f3 = FACTORY_3.depth / 2;

  return [
    {
      id: 'factory-2-door',
      a: {
        // The Factory's north wall, east of the door you came in by. The strip
        // between the two pipe runs at x = ±3.6 is the only clear span on that
        // wall, and the aisle it opens onto is the one the arrival check walks.
        zone: factoryId,
        position: new THREE.Vector3(2.2, 0, -11 / 2 + DOOR_PROUD),
        yaw: 0,
        material: 'iron',
        seed: 9401,
      },
      b: {
        zone: ZONE_FACTORY_2,
        position: new THREE.Vector3(0, 0, -f2 + DOOR_PROUD),
        yaw: 0,
        material: 'iron',
        seed: 9402,
      },
    },
    {
      id: 'factory-3-door',
      a: {
        // The far end of the long room, which is the whole point of walking it.
        zone: ZONE_FACTORY_2,
        position: new THREE.Vector3(0, 0, f2 - DOOR_PROUD),
        yaw: Math.PI,
        material: 'iron',
        seed: 9403,
      },
      b: {
        zone: ZONE_FACTORY_3,
        position: new THREE.Vector3(0, 0, -f3 + DOOR_PROUD),
        yaw: 0,
        material: 'iron',
        seed: 9404,
      },
    },
    {
      id: 'hut-room-door',
      a: {
        // The hut's east wall, in the gap between the stove and the barrel.
        zone: hutId,
        position: new THREE.Vector3(10 / 2 - DOOR_PROUD, 0, 2),
        yaw: -Math.PI / 2,
        material: 'timber',
        seed: 8901,
      },
      b: {
        zone: ZONE_HUT_ROOM,
        position: new THREE.Vector3(0, 0, -HUT_ROOM.depth / 2 + DOOR_PROUD),
        yaw: 0,
        material: 'timber',
        seed: 8902,
      },
    },
    {
      id: 'hut-room-2-door',
      a: {
        zone: ZONE_HUT_ROOM,
        position: new THREE.Vector3(HUT_ROOM.width / 2 - DOOR_PROUD, 0, 0),
        yaw: -Math.PI / 2,
        material: 'timber',
        seed: 8903,
      },
      b: {
        zone: ZONE_HUT_ROOM_2,
        position: new THREE.Vector3(0, 0, -HUT_ROOM_2.depth / 2 + DOOR_PROUD),
        yaw: 0,
        material: 'timber',
        seed: 8904,
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// The rooms themselves.

/**
 * A long service corridor: plant down one side, a walkway down the other.
 *
 * The hall it opens off is fifteen metres wide and eleven deep — nearly square,
 * and read at a glance. This is seven by twenty-two, which cannot be read at a
 * glance at all: you see the near bay, the fog, and something at the far end.
 * The only way to find out what is down there is to walk it, and that is the
 * entire difference a proportion makes.
 */
function buildFactory2(): THREE.Group {
  const root = new THREE.Group();
  root.add(
    buildInterior({ ...FACTORY_2, seed: 7710, style: WORKS_STYLE, planks: false, beams: 0 }),
  );

  const halfW = FACTORY_2.width / 2;
  const halfD = FACTORY_2.depth / 2;

  // The doors are both at x = 0 in the end walls, so the middle of the room is
  // the walkway and everything stands off it. West side is plant, east side is
  // storage and services — the same three-lane logic as the hall, folded into a
  // width that only has room for two.
  const plantX = -halfW + 1.5;
  const storeX = halfW - 1.4;

  // --- plant, west ---------------------------------------------------------
  //
  // Four machines evenly down the run rather than a cluster. In a corridor the
  // rhythm *is* the room: you pass one, then another, and the repetition is
  // what makes twenty-two metres feel like a distance rather than a number.
  [-7.5, -2.5, 2.5, 7.5].forEach((z, index) => {
    place(root, machine.build({ seed: 3410 + index }), plantX, 0, z, Math.PI / 2);
  });

  // Railings between the walkway and the plant, in the gaps between machines,
  // which is where somebody could otherwise step sideways into the run.
  [-5, 0, 5].forEach((z, index) => {
    place(root, railing.build({ seed: 9410 + index }), plantX + 1.6, 0, z, Math.PI / 2);
  });

  // --- storage and services, east ------------------------------------------
  place(root, tank.build({ seed: 4410 }), storeX, 0, -6.4, Math.PI / 2);
  place(root, hopper.build({ seed: 4411 }), storeX + 0.2, 0, -1.2, -Math.PI / 2);
  place(root, workbench.build({ seed: 4412 }), storeX, 0, 3.4, -Math.PI / 2);
  place(root, crate.build({ seed: 4413 }), storeX + 0.1, 0, 6.2, 0.3);
  place(root, barrel.build({ seed: 4414 }), storeX - 0.3, 0, 7.4, 0.1);
  place(root, sink.build({ seed: 4415 }), halfW - 0.55, 0, 9.4, -Math.PI / 2);

  // --- services, on the walls ----------------------------------------------
  //
  // `pipes` builds its main along +X, so a run down a side wall is a quarter
  // turn. Four of them end to end are what makes the corridor read as carrying
  // something from one end of the building to the other, which is what a
  // corridor in a works is *for*.
  [-8, -3, 2, 7].forEach((z, index) => {
    const run = pipes.build({ seed: 9420 + index });
    run.position.set(-halfW + 0.34, 0, z);
    run.rotation.y = Math.PI / 2;
    root.add(run);
  });

  const extract = vent.build({ seed: 9430 });
  extract.position.set(halfW - 0.22, 1.4, -9.2);
  extract.rotation.y = -Math.PI / 2;
  root.add(extract);

  // --- ribs across the ceiling ---------------------------------------------
  //
  // The hall gets full trusses; this gets plain ribs, because at four metres a
  // truss with a half-metre depth eats an eighth of the headroom and reads as
  // a low ceiling rather than a structured one. Same job — break a long
  // unbroken plane — at a fraction of the geometry.
  const rib = new THREE.MeshLambertMaterial({
    color: shade(PALETTE.IRON, 0.9),
    flatShading: true,
  });
  for (let i = 0; i < 11; i++) {
    const z = -halfD + ((i + 0.5) / 11) * FACTORY_2.depth;
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(FACTORY_2.width, 0.16, 0.2),
      rib,
    );
    beam.position.set(0, FACTORY_2.height - 0.12, z);
    root.add(beam);
  }

  // --- lit in pools, not evenly --------------------------------------------
  //
  // Three lamps down twenty-two metres, aimed across the walkway rather than
  // along it. Evenly lighting a corridor removes the only thing a corridor has
  // going for it: you should be able to see that there is more of it than you
  // can currently see.
  place(root, floodlight.build({ seed: 5510 }), 0.9, 0, -8, -Math.PI / 2);
  place(root, floodlight.build({ seed: 5511 }), 0.9, 0, 0, -Math.PI / 2);
  place(root, floodlight.build({ seed: 5512 }), 0.9, 0, 8, -Math.PI / 2);

  return markCollidable(root);
}

/**
 * A tall shaft with a hoist in it. Eight and a half square, nine metres up.
 *
 * The one room in the world whose interesting axis is vertical. Everything else
 * ever built here has been a floor plan with a lid on it at head height plus
 * two metres, and a space you have to look *up* in is a different experience of
 * the same engine — it is also the only room where the ceiling material is
 * something the player will actually study.
 */
function buildFactory3(): THREE.Group {
  const root = new THREE.Group();
  root.add(
    buildInterior({ ...FACTORY_3, seed: 7720, style: WORKS_STYLE, planks: false, beams: 0 }),
  );

  const halfW = FACTORY_3.width / 2;
  const halfD = FACTORY_3.depth / 2;

  // The hoist, centred and turned across the room. In the hall a gantry
  // straddles an aisle; here it is the reason the room is tall, so it stands in
  // the middle where you walk under it and look up.
  place(root, hoist.build({ seed: 8120 }), 0, 0, 1.2, Math.PI / 2);

  // A ladder up the west wall, going nowhere. The point is the *read* — a
  // ladder is the cheapest possible way to say "this shaft has a top", and a
  // nine-metre wall with nothing on it says only that somebody made a wall.
  place(root, ladder.build({ seed: 6210 }), -halfW + 0.42, 0, -2.4, Math.PI / 2);

  // The forge in the far corner, which is the one warm light in the chain and
  // the reason to come down here at all.
  place(root, forge.build({ seed: 6220 }), -halfW + 1.3, 0, halfD - 1.4, Math.PI * 0.25);
  place(root, anvil.build({ seed: 6221 }), -1.6, 0, 2.6, 0.4);

  // Stock against the east wall, clear of the walk from the door.
  place(root, crate.build({ seed: 6230 }), halfW - 0.9, 0, -1.6, 0.2);
  place(root, barrel.build({ seed: 6231 }), halfW - 0.8, 0, 0.1, 0.5);
  place(root, workbench.build({ seed: 6232 }), halfW - 1.2, 0, 2.4, -Math.PI / 2);

  // Fenced off under the hoist's drop, because a thing that lifts loads over a
  // floor is the one piece of plant that should visibly keep you off it.
  place(root, chainlink.build({ seed: 6240 }), 2.2, 0, halfD - 0.8, 0);

  // --- the top of the shaft ------------------------------------------------
  //
  // A gallery of steel ringing the room at four metres: two runs of plate on
  // the side walls, high enough to be clearly out of reach. It costs four boxes
  // and it is what turns a tall box into a building with an upstairs.
  const steel = new THREE.MeshLambertMaterial({
    color: shade(PALETTE.IRON, 0.86),
    flatShading: true,
  });
  for (const x of [-halfW + 0.6, halfW - 0.6]) {
    const walk = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, FACTORY_3.depth - 0.7), steel);
    walk.position.set(x, 4.2, 0);
    root.add(walk);

    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, FACTORY_3.depth - 0.7), steel);
    rail.position.set(x + (x < 0 ? 0.55 : -0.55), 4.7, 0);
    root.add(rail);
  }

  // Lit from below and from the gallery, so the shaft has a bright band partway
  // up and darkness above it — which reads as height far more strongly than
  // lighting the whole volume evenly would.
  place(root, floodlight.build({ seed: 5520 }), 1.4, 0, -2.8, Math.PI);
  const upper = floodlight.build({ seed: 5521 });
  upper.position.set(halfW - 1.1, 4.3, -1.5);
  upper.rotation.y = Math.PI / 2;
  root.add(upper);

  return markCollidable(root);
}

/**
 * The store off the hut: low, small and full.
 *
 * Two and a half metres to the ceiling, which is a hand's breadth over head
 * height and immediately obvious the moment you step in. Rooms in this world
 * have all been generous so far; this one is the demonstration that they do not
 * have to be, and cramped is a feeling the engine has never once produced.
 */
function buildHutRoom(): THREE.Group {
  const root = new THREE.Group();
  root.add(
    buildInterior({ ...HUT_ROOM, seed: 4410, style: HOUSE_STYLE, planks: true, beams: 2 }),
  );

  const halfW = HUT_ROOM.width / 2;
  const halfD = HUT_ROOM.depth / 2;

  // Doors in the north wall (in from the hut) and the east wall (on to the
  // workroom), so the clear floor is an L and everything stands on the two
  // walls that are left.
  //
  // Stores are stacked against walls, and the density is the point: this is the
  // fullest room in the world by floor area, which is what a store is.
  place(root, dresser.build({ seed: 4420 }), -halfW + 0.4, 0, -1.4, Math.PI / 2);
  place(root, chest.build({ seed: 4421 }), -halfW + 0.55, 0, 0.6, Math.PI / 2);
  const stack = crate.build({ seed: 4422 });
  place(root, stack, -halfW + 0.75, 0, 2.1, 0.15);
  place(root, barrel.build({ seed: 4423 }), -halfW + 0.7, 0, halfD - 0.7, 0.4);
  place(root, barrel.build({ seed: 4424 }), 0.3, 0, halfD - 0.65, 0.9);
  place(root, washtub.build({ seed: 4425 }), 1.6, 0, halfD - 0.7, 0.2);

  // Herbs on the north wall beside the door, which in a room this low are at
  // eye height rather than overhead — the one place in the world where the
  // hanging register is something you duck under.
  place(root, hangingHerbs.build({ seed: 4426 }), 1.5, 0, -halfD + 0.16, 0);

  // One lantern, standing on the crates. A single source in a small dark room
  // does more than three would, and there is nowhere to put three.
  place(root, lantern.build({ seed: 7110 }), -halfW + 0.8, topOf(stack), 2.1, 0.7);

  return markCollidable(root);
}

/**
 * The workroom at the end of the chain: wide, shallow and full of daylight.
 *
 * Nine by five, which is almost exactly the reverse of the store you reach it
 * through — you step out of a cramped dark box into a room you can see the
 * whole of at once. Putting the two next to each other in a chain is the
 * cheapest possible demonstration that proportion is doing the work, because
 * the palette, the floor and the lighting model are identical.
 */
function buildHutRoom2(): THREE.Group {
  const root = new THREE.Group();
  root.add(
    buildInterior({ ...HUT_ROOM_2, seed: 4430, style: HOUSE_STYLE, planks: true, beams: 4 }),
  );

  // Width is used only through the literal positions below — the room is nine
  // metres across and everything is placed against a named wall by hand.
  const halfD = HUT_ROOM_2.depth / 2;

  // Three windows along the south wall. A shallow room is all wall and the
  // south one is nine metres of it, so this is the room that gets to be lit by
  // something other than a candle.
  place(root, windowBuilder.build({ seed: 4440 }), -2.9, 0, halfD - 0.1, Math.PI);
  place(root, windowBuilder.build({ seed: 4441 }), 0.1, 0, halfD - 0.1, Math.PI);
  place(root, windowBuilder.build({ seed: 4442 }), 3.1, 0, halfD - 0.1, Math.PI);

  // **The middle of the room is a corridor, and nothing stands in it.** The door
  // is in the north wall at x = 0 and the room is only five metres deep, so the
  // lane from the arrival marker to the far wall is most of the floor's short
  // axis — the first layout put the work table squarely across it and the world
  // check caught the player boxed in a metre from the door they had just used.
  // The room is nine metres wide precisely so that everything can stand *beside*
  // that lane, which is the whole argument for a shallow room.

  // Work in the east half, under the windows and facing them.
  const board = table.build({ seed: 4451 });
  place(root, board, 2.2, 0, 0.9, 0.05);
  place(root, chair.build({ seed: 4452 }), 2.0, 0, 0.1, 0.2);
  place(root, stool.build({ seed: 4453 }), 3.5, 0, 0.9, -0.3);
  place(root, dresser.build({ seed: 4461 }), 3.8, 0, -halfD + 0.6, 0);

  // The wheel in the west half, under its own window.
  place(root, spinningWheel.build({ seed: 4450 }), -3.4, 0, halfD - 1.1, Math.PI * 0.9);

  // Sleeping and storage along the west end, out of the daylight — which is how
  // a room with windows down one side actually gets used.
  place(root, bed.build({ seed: 4460 }), -3.2, 0, -1.2, Math.PI / 2);
  place(root, chest.build({ seed: 4462 }), -1.9, 0, -halfD + 0.5, 0);

  // Somebody at the wheel. Static, like the figure in the hut — and standing at
  // a task rather than in open floor, for the same reason.
  place(root, figure.build({ seed: 6610, roam: 1.5 }), -2.4, 0, 0.9, Math.PI * 0.15);

  place(root, candle.build({ seed: 7120 }), 2.35, topOf(board), 0.7, 0.4);

  return markCollidable(root);
}

// ---------------------------------------------------------------------------

/**
 * The height of the top of a placed prop, in its parent's space.
 *
 * Same helper as `zones.ts`, and duplicated for the same reason `DOOR_PROUD`
 * is: every builder rolls its own dimensions from its seed, so standing a
 * lantern *on* a crate means asking the crate that was actually built.
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
