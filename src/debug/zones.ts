import * as THREE from 'three';
import { type ZoneDefinition, OUTDOOR_ENVIRONMENT, INDOOR_ENVIRONMENT } from '../world/Zone';
import type { SoundscapeSpec } from '../audio/Soundscape';
import type { PortalDefinition, PortalEnd } from '../world/Portal';
import { buildInterior, HOUSE_STYLE, WORKS_STYLE } from '../world/interior';
import { markCollidable } from '../player/Collider';
import { PALETTE, shade } from '../art/palette';
import { ProvingGround, SPAWN } from './ProvingGround';
// Builders are imported directly rather than through `art/registry`, which is
// Vite-only. The headless zone check reaches this file through esbuild.
import { hut, hutDoorAnchor } from '../art/builders/hut';
import { crate } from '../art/builders/crate';
import { barrel } from '../art/builders/barrel';
import { bed } from '../art/builders/bed';
import { table } from '../art/builders/table';
import { chair } from '../art/builders/chair';
import { stool } from '../art/builders/stool';
import { figure } from '../art/builders/figure';
import { machine } from '../art/builders/machine';
import { sink } from '../art/builders/sink';
import { candle } from '../art/builders/candle';
import { floodlight } from '../art/builders/floodlight';
import { pipes } from '../art/builders/pipes';
import { tank } from '../art/builders/tank';
import { vent } from '../art/builders/vent';
import { railing } from '../art/builders/railing';
import { chainlink } from '../art/builders/chainlink';
import { fireplace } from '../art/builders/fireplace';
import { stove } from '../art/builders/stove';
import { windowBuilder } from '../art/builders/window';
import { dresser } from '../art/builders/dresser';
import { chest } from '../art/builders/chest';
import { washtub } from '../art/builders/washtub';
import { broom } from '../art/builders/broom';
import { hangingHerbs } from '../art/builders/hanging-herbs';
import { spinningWheel } from '../art/builders/spinning-wheel';
import { wallPegs } from '../art/builders/wall-pegs';
import { hoist } from '../art/builders/hoist';
import { lantern } from '../art/builders/lantern';
import {
  countrysideZone,
  countrysideTerrain,
  COUNTRYSIDE_GATE,
  ZONE_COUNTRYSIDE,
} from './countryside';
import { countrysideHomeZones, countrysideHomePortals } from './countryside-homes';
import { GALLERIES, galleryZone } from './galleries';
import { propZones, propPortals } from './props';
import { soundStageZone } from './SoundStage';
import { waterShowcaseZone } from './WaterShowcase';
import { waterShowcase2Zone } from './WaterShowcase2';
import { footstepsShowcaseZone } from './FootstepsShowcase';
import { chainZones, chainPortals } from './chains';

/**
 * The test world: one exterior and two interiors, joined by two portals.
 *
 * This is the Phase 5 fixture, in the same spirit as the movement gym and the
 * prop gallery — not content, but a place where the system can be exercised.
 *
 * **The first door is a few paces from spawn, on purpose.** A portal you have
 * to walk thirty seconds to reach is a portal that gets tested once; one you
 * are looking at the moment the game boots gets used every time anything
 * nearby changes. The second building is further out, which is the case that
 * matters for the *other* thing being tested — that a zone entered from cold,
 * after the first has already been built and left, comes up correctly.
 *
 * Two portals rather than one because a single portal cannot show whether zone
 * state is being reset or merely swapped: with two interiors you can go in one
 * door, come out, go in the other, and any leak between them shows up as the
 * wrong room. They are deliberately unalike in every axis the zone system
 * controls — size, light, fog, floor material, acoustics — because the claim
 * of a zone is that crossing into it changes the place, and two rooms that
 * differ only in dimensions prove nothing.
 *
 * **The names are placeholders.** They are what a door's tooltip shows, so
 * they are the most player-facing strings in the game so far, and naming is
 * not mine to do. One string each, here, whenever the fiction wants them.
 */

export const ZONE_EXTERIOR = 'exterior';
export const ZONE_HUT = 'villager-hut';
export const ZONE_FACTORY = 'factory';
export { ZONE_COUNTRYSIDE } from './countryside';

/**
 * The near hut: just off spawn, facing back at it.
 *
 * Spawn is `(0, 0.1, 10)` looking down -Z, so a building at z = 6 sits
 * directly ahead and a little to the right, clear of the measured cubes at
 * z = 0 and well clear of the movement gym west of x = -4.
 */
const HUT_AT = new THREE.Vector3(5, 0, 6);
/** Yaw 0 faces +Z — back toward spawn. */
const HUT_YAW = 0;

/**
 * The factory door, standing beside the village gate.
 *
 * **The shed it used to be set into is gone.** There was a hand-built exterior
 * out at x = 42, and the walk to it was most of the cost of using the fixture:
 * fifty metres each way to test a threshold, past nothing else that needed
 * testing. The doors that lead somewhere are worth far more standing together
 * where you spawn looking at them — and a door alone in open ground is exactly
 * as honest as a door in a hand-carved wall. Both are scaffolding, and one of
 * them is free.
 *
 * The building comes back when there is an industrial structure kit to build it
 * from, at which point it is content rather than a prop whittled in this file.
 */
const FACTORY_DOOR_AT = new THREE.Vector3(14, 0, 6);
/** Faces +Z, back toward spawn, square-on beside the gate. */
const FACTORY_YAW = 0;

/**
 * How far a portal door stands out from the wall it is set into.
 *
 * Small, but not zero. The hut paints a dark panel where its doorway is and
 * the interior shell is a sealed box; a door mesh exactly coplanar with either
 * would z-fight along every edge at every distance.
 */
const DOOR_PROUD = 0.07;

/**
 * The gateway out to the village, immediately right of the near hut.
 *
 * Spawn looks down -Z, so "right" is +X, and the hut sits at x = 5 with a
 * radius of about three. Standing the gate just past it puts the two doors that
 * lead somewhere in the same glance: you boot, look forward, and both the
 * interior and the village are in front of you.
 */
const GATE_AT = new THREE.Vector3(10, 0, 6);
/** Faces +Z, back toward spawn, so it is square-on the moment you look at it. */
const GATE_YAW = 0;

/**
 * The rank of prop hall doors, directly behind spawn.
 *
 * This rank used to carry one door per gallery, and the galleries now hang off
 * the prop halls instead — see `props.ts` for why. Three doors where four
 * stood, in the same spots: the hub's job is unchanged, it is just no longer
 * the place that grows when the kit does.
 *
 * Yaw π faces -Z, back toward spawn, so the rank is square-on when you turn.
 *
 * **Everything in the gym has to stay south of the arrival markers**, which
 * sit a stride in front of these doors at z ≈ 20.9. The rank was moved out to
 * z = 22 because the first two doors opened straight onto the old strafe wall
 * and the check caught it as "boxed in 0.5 m from the door" — walkable on
 * arrival and walled a stride later. The parkour courses that replaced that
 * wall stop at z = 18 for the same reason.
 */
const PROP_RANK = new THREE.Vector3(-10, 0, 22);
const PROP_SPACING = 5;
const PROP_YAW = Math.PI;

/** Interior dimensions, shared by the zone builder and the portal placement. */
// Roomy rather than snug. The first version was 6.4 x 5.2 and read as a
// cupboard the moment there was furniture in it — at eye height a room needs
// enough floor that you can walk *around* something, not just past it.
const HUT_ROOM_SHELL = { width: 10, depth: 8, height: 3.4 };
const FACTORY = { width: 15, depth: 11, height: 5.6 };

const UP = new THREE.Vector3(0, 1, 0);

/**
 * Where the plant in the factory hall actually stands.
 *
 * Same rule as the wet corner above: **placement runs object → sound.** These
 * are read by `buildFactory` and by `FACTORY_SOUND`, so an engine cannot be
 * moved without its noise following it, which is exactly what went wrong the
 * first time an emitter was given coordinates of its own.
 */
const ENGINE_X = -5.4;
const ENGINE_Z = [-2.4, 1.1, 4.4] as const;
/** The engine pulled out into the aisle, part-way through being worked on. */
const STRIPPED_AT: readonly [number, number, number] = [1.5, 0.9, 1.9];
/** The gantry straddling the aisle, and the height of its trolley. */
const GANTRY_AT: readonly [number, number, number] = [-1.8, 2.6, 2.4];
/**
 * The pipe run on the east wall, and roughly the height of its main.
 *
 * `FACTORY.width / 2 − 0.34` — written out because this is read before
 * `buildFactory` declares its local `halfW`, and the two must not drift.
 */
const PIPE_RUN: readonly [number, number, number] = [15 / 2 - 0.34, 1.5, 1.6];

/**
 * The factory hall.
 *
 * A works is not a village and the rules are different. Out in the open,
 * sparse beats dense and everything has a short reach; in a sealed stone box
 * fifteen metres across there is nowhere to walk *away* to, so the danger is
 * the opposite one — four continuous sources at once is a wall of noise with
 * no shape, and the room stops having a near end and a far end.
 *
 * So: two engines and not four. The row is three machines long and the ear
 * cannot separate three of the same model in one room anyway — it hears "an
 * engine room", which is the read that is wanted, and two sources deliver it
 * for half the voices. They are pitched a fifth apart and run at different
 * speeds, because two identical machines beat against each other into a
 * chorus and stop being two objects.
 *
 * The gantry is what makes it a *working* room rather than a running one. It
 * moves in bursts with long silences between, and a silence in an industrial
 * space is worth more than another drone in it.
 *
 * ## Everything here is quieter than it looks
 *
 * The first pass used gains borrowed from the proving ground's mill, and in
 * here it was far too loud. Three things stack up in a sealed room and none of
 * them is the gain:
 *
 * - **There is nowhere to be far away.** The hall is 15 × 11, so the listener
 *   is within about eight metres of everything in it at all times. Distance
 *   attenuation, which does most of the mixing outdoors, does almost nothing.
 * - **`refDistance` was set as though it would.** At 2.5 m the sources were at
 *   full level across most of the floor. Pulled in, so crossing the room is
 *   actually a change.
 * - **The room adds the sound back.** A `hall` tail returns most of what is
 *   sent to it, so a continuous source at reverb 0.9 is heard roughly twice —
 *   once dry and once as a room that never stops ringing. Fine for a hammer
 *   with silence after it; wrong for an engine that never stops. Sends are
 *   well down here for exactly that reason, and the intermittent sources keep
 *   theirs.
 */
const FACTORY_SOUND: SoundscapeSpec = {
  emitters: [
    // The north end of the row, nearest the door — heard first, and the reason
    // the hall sounds occupied before you are properly inside it.
    {
      model: 'machine',
      id: 'engine-north',
      at: [ENGINE_X + 1, 1.1, ENGINE_Z[0]],
      options: { rpm: 74, fundamental: 52, gain: 0.15, wear: 0.55, clank: 0.45 },
      refDistance: 1.4,
      maxDistance: 22,
      rolloff: 1.7,
      reverb: 0.3,
    },
    // The far end. Slower, heavier, and duller, so walking the aisle is a
    // change of register rather than a change of level.
    {
      model: 'machine',
      id: 'engine-south',
      at: [ENGINE_X + 1, 1.1, ENGINE_Z[2]],
      options: { rpm: 46, fundamental: 35, gain: 0.16, wear: 0.8, clank: 0.7 },
      refDistance: 1.4,
      maxDistance: 22,
      rolloff: 1.7,
      reverb: 0.35,
    },
    // **The chain hoist.** The genuine friction case: a load on a chain over a
    // drum, hauled in bursts. Iron, so the body rings much longer and brighter
    // than the tree in the proving ground does — same model, and nobody would
    // mistake one for the other, which is the argument for modelling it rather
    // than crossfading two recordings.
    {
      model: 'friction',
      id: 'gantry',
      at: GANTRY_AT,
      // **Duller and slower than the first pass, and both matter.** `bright`
      // at 0.75 put most of the energy into the three upper modes, where the
      // contact noise lives — measured across octave bands it came out flat,
      // which is the definition of hiss. And 0.34 sits past the Stribeck dip
      // in the model's rub regime, so it never reached the creak at all.
      options: {
        motion: 'cycle',
        speed: 0.26,
        force: 0.8,
        pitch: 210,
        decay: 1.4,
        bright: 0.4,
        roughness: 0.22,
        gain: 0.18,
      },
      refDistance: 1.6,
      maxDistance: 22,
      rolloff: 1.5,
      // Keeps its send. It stops, so the tail has somewhere to fall into —
      // which is what makes the hall sound big rather than merely reverberant.
      reverb: 0.8,
      // Intermittent and quiet, and the one thing in here that is somebody
      // rather than something. It should not lose its voice to an engine.
      importance: 1.5,
    },
    // Air in the pipework on the east wall — a stopped tube with a draught
    // through it, which is a thing a works has a great deal of.
    //
    // **Deliberately tiny reach.** This room was already too loud once, and
    // the fix for that was not only lower gains but shorter distances: a fifth
    // continuous source that filled the hall would undo it. At 9 m this exists
    // when you are beside the wall and nowhere else, which is what a draught
    // in a pipe actually does — and it rewards walking the room rather than
    // adding to its floor.
    {
      model: 'waveguide',
      id: 'pipe-air',
      at: PIPE_RUN,
      options: {
        excite: 'breath',
        // Stopped at one end: odd harmonics only, sounding an octave below the
        // 190 asked for. A hollow, woody note rather than a whistle.
        closed: true,
        pitch: 190,
        decay: 0.9,
        bright: 0.28,
        drive: 0.55,
        gain: 0.3,
      },
      refDistance: 1.2,
      maxDistance: 9,
      rolloff: 1.8,
      reverb: 0.4,
    },
  ],
  scatter: [
    // Somebody working on the stripped engine. Rare, close, and metal — the
    // room is full of it, so a clatter has something to have come off.
    {
      sound: 'clatter',
      id: 'fitting',
      at: STRIPPED_AT,
      spread: [1.1, 0.4, 1.1],
      every: 17,
      force: [0.3, 0.85],
      options: { material: 'metal', gain: 0.2, pieces: 3 },
      refDistance: 1.8,
      maxDistance: 22,
      rolloff: 1.3,
      reverb: 0.85,
    },
  ],
};

export interface TestWorld {
  zones: ZoneDefinition[];
  portals: PortalDefinition[];
}

/**
 * Where the door to the nth prop hall stands in the hub.
 *
 * Shared by the portal definition and the arch built around it, so the two
 * cannot drift apart — the same trick the village gate uses.
 */
function propHub(index: number, material: 'timber' | 'iron'): PortalEnd {
  return {
    zone: ZONE_EXTERIOR,
    position: new THREE.Vector3(
      PROP_RANK.x + index * PROP_SPACING,
      PROP_RANK.y,
      PROP_RANK.z,
    ),
    yaw: PROP_YAW,
    material,
    seed: 5200 + index * 17,
  };
}

export function createTestWorld(ground: ProvingGround): TestWorld {
  // Built eagerly, outside the zone builder, because the portal placement below
  // has to measure the hut's doorway — and the doorway's position is rolled
  // from the hut's seed, so it cannot be known before the mesh exists.
  const hutMesh = hut.build({ seed: 5511 });
  hutMesh.position.copy(HUT_AT);
  hutMesh.rotation.y = HUT_YAW;

  const anchor = hutDoorAnchor(hutMesh);
  const hutDoor = new THREE.Vector3(anchor.x, 0, anchor.z + DOOR_PROUD)
    .applyAxisAngle(UP, HUT_YAW)
    .add(HUT_AT);

  const zones: ZoneDefinition[] = [
    {
      id: ZONE_EXTERIOR,
      name: 'Outside',
      environment: {
        ...OUTDOOR_ENVIRONMENT,
        // The shared outdoor default bounces the old dark floor colour. This
        // zone's floor is now pale, and a pale floor throwing dark warm light
        // back up leaves every fixture's underside reading as dirt. Local to
        // the proving ground — the village floor did not change.
        ambientGround: 0xbfb298,
      },
      spawn: { position: SPAWN.clone(), yaw: 0 },
      floor: -20,
      build() {
        // Refilled rather than merely fetched: this group belongs to the
        // `ProvingGround`, which outlives the zone, so after residency releases
        // the hub it comes back empty. See `ProvingGround.populate`.
        const root = ground.populate();

        // **Built fresh here, not the mesh measured above.** `hutMesh` exists
        // only so the portal placement can read the doorway off it before any
        // zone is built; adding *that* instance would put a mesh in the scene
        // whose geometry is released the first time the hub is dropped, and it
        // would come back invisible. The seed is fixed, so this is the same hut.
        const shed = hut.build({ seed: 5511 });
        shed.position.copy(HUT_AT);
        shed.rotation.y = HUT_YAW;
        root.add(markCollidable(shed));

        // The sink and the cistern stood in the cell, which is gone with the
        // rest of the acoustics fixture. They were there for one reason —
        // "every sound needs an object", and the water you could hear had to
        // be coming out of something — so with the water gone there is nothing
        // for them to be the object of.

        // No frames around the village gate or the prop hall rank. An archway
        // reads as a threshold you walk *through*, and neither of these is —
        // both are doors you use and are teleported by. Ringing every one of
        // them in masonry made the Proving Ground look like a folly garden and
        // said nothing true about what they do. The portal system builds the
        // door meshes themselves; that is the whole fixture.
        return root;
      },
    },

    {
      id: ZONE_HUT,
      name: 'Countryside Village Interior Demo',
      environment: {
        ...INDOOR_ENVIRONMENT,
        room: 'cell',
        surface: 'wood',
        // Warm, and light enough to see the far corners.
        fogColor: '#181309',
        fogNear: 9,
        fogFar: 34,
        ambientSky: 0xa2977c,
        ambientGround: 0x574c3c,
        ambientIntensity: 2.3,
        sunIntensity: 1.2,
        fillIntensity: 0.8,
        fillColor: 0xa08c6a,
        footstepReverb: 0.45,
      },
      // Only reached if something goes wrong — arriving through the door puts
      // you on the portal's marker instead. Placed in the middle of the floor
      // so it is obvious when it has been used.
      spawn: { position: new THREE.Vector3(0, 0.1, 1), yaw: Math.PI },
      // The floor is at y = 0 and the room is sealed, so anything below this is
      // a bug rather than a fall — but the recovery still has to exist.
      floor: -5,
      build: () => buildVillagerHut(),
    },

    {
      id: ZONE_FACTORY,
      name: 'Industrial Factory Interior Demo',
      environment: {
        ...INDOOR_ENVIRONMENT,
        room: 'hall',
        surface: 'stone',
        // Cold and big. The acoustic opposite of the example room, which is
        // the point of having two — but not the *dark* opposite: a room you
        // cannot see the far wall of is not atmospheric, it is broken.
        fogColor: '#111519',
        fogNear: 12,
        fogFar: 48,
        ambientSky: 0x7c8794,
        // **This is what the ceiling is lit by, and almost nothing else.**
        //
        // A hemisphere light is sampled by the surface normal, and a ceiling
        // points straight down — so it takes the *ground* lobe and none of the
        // sky one. Both directional lights are above it and contribute nothing
        // at all. At 0x3a3f44 the roof was being lit by a dark slate colour and
        // no amount of adjusting the material could rescue it: the albedo was
        // being multiplied by nearly zero.
        //
        // Lifted well up, and warm rather than blue, because what is actually
        // bouncing up here is light off a lit floor.
        ambientGround: 0x8a8378,
        ambientIntensity: 2.2,
        sunIntensity: 0.9,
        fillIntensity: 0.85,
        fillColor: 0x93a3b5,
        // A four-second stone tail on your own boots turned every step into a
        // gunshot in a cathedral, so this was cut hard — and cut too far. With
        // almost no send the steps went completely dry, which put them right
        // back at the listener's head, just quieter: reverb is most of what
        // tells you a sound is happening in a *room* rather than in your ears.
        // Enough to place them in the hall, not enough to ring it.
        footstepReverb: 0.34,
        soundscape: FACTORY_SOUND,
      },
      spawn: { position: new THREE.Vector3(0, 0.1, 2), yaw: Math.PI },
      floor: -5,
      build: () => buildFactory(),
    },

    countrysideZone(),
    // The three houses in it you can go into — see `countryside-homes.ts`.
    ...countrysideHomeZones(),
    // Two chains of rooms hung off the hut and the factory, three deep. They
    // exist so that somewhere in the world is more than two doors from the hub
    // — see `chains.ts`, and the residency check in `check:world`.
    ...chainZones(),
  ];

  const portals: PortalDefinition[] = [
    {
      id: 'hut-door',
      a: {
        zone: ZONE_EXTERIOR,
        position: hutDoor,
        yaw: HUT_YAW,
        material: 'timber',
        seed: 8801,
      },
      b: {
        zone: ZONE_HUT,
        // Set into the north wall, facing back into the room. This is the way
        // out — the same portal read from the other end.
        position: new THREE.Vector3(0, 0, -HUT_ROOM_SHELL.depth / 2 + DOOR_PROUD),
        yaw: 0,
        material: 'timber',
        seed: 8802,
      },
    },
    {
      id: 'factory-door',
      a: {
        zone: ZONE_EXTERIOR,
        position: FACTORY_DOOR_AT,
        yaw: FACTORY_YAW,
        material: 'iron',
        seed: 9301,
      },
      b: {
        zone: ZONE_FACTORY,
        position: new THREE.Vector3(0, 0, -FACTORY.depth / 2 + DOOR_PROUD),
        yaw: 0,
        material: 'iron',
        seed: 9302,
      },
    },
    {
      id: 'countryside-gate',
      a: {
        zone: ZONE_EXTERIOR,
        position: GATE_AT,
        yaw: GATE_YAW,
        material: 'timber',
        seed: 4712,
      },
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
    // The doors in the three open houses. The exterior owns where they stand
    // and the homes own what is behind them, so neither can be authored without
    // the other agreeing.
    ...countrysideHomePortals(),
    ...chainPortals(ZONE_FACTORY, ZONE_HUT),
  ];

  // One zone per gallery, as before — but the doors to them stand inside the
  // two prop halls now, one hall per setting, and the hub carries a door per
  // hall. `propPortals` owns every door in and out of the halls, including the
  // gallery ends, so a gallery still cannot exist without a way in.
  for (const plan of GALLERIES) zones.push(galleryZone(plan));
  zones.push(...propZones());
  portals.push(...propPortals(propHub(1, 'iron'), propHub(0, 'timber'), propHub(2, 'timber')));

  // The Sound Showcase. Its door stands in the general props hall with the
  // other showcases rather than in the village street — see `propPortals`,
  // which is where every door in that room is placed.
  zones.push(soundStageZone());
  // The Water Showcase, whose door stands in the same rank — see `propPortals`.
  zones.push(waterShowcaseZone());
  zones.push(waterShowcase2Zone());
  // And the Footsteps Showcase, whose door completes that rank.
  zones.push(footstepsShowcaseZone());

  return { zones, portals };
}

/**
 * A small timber room: floor, four walls, ceiling, and somebody's things in it.
 *
 * Furnished rather than empty because an empty sealed box proves the zone
 * system works and proves nothing about whether it is worth having. A bed
 * against one wall, a table with chairs pulled up to it and a figure standing
 * by are what make walking through the door land as arriving somewhere.
 *
 * Everything is placed by hand here. There are a dozen objects and a Phase 6
 * editor or a JSON file would be doing exactly this from data — the point is
 * that the placement is the only thing that would move.
 */
function buildVillagerHut(): THREE.Group {
  const root = new THREE.Group();
  root.add(
    buildInterior({ ...HUT_ROOM_SHELL, seed: 4400, style: HOUSE_STYLE, planks: true, beams: 3 }),
  );

  const halfW = HUT_ROOM_SHELL.width / 2;
  const halfD = HUT_ROOM_SHELL.depth / 2;

  // --- a room somebody lives in --------------------------------------------
  //
  // Rearranged around the fireplace, because a hearth is not furniture — it is
  // the thing a room is *organised by*. Everything here now answers to it: the
  // seating faces it, the bed is out of its draught, the work that needs light
  // is under the windows, and the storage is in the dead corner behind the
  // door. Before this the pieces were spaced to be looked at individually,
  // which is what a gallery is for.
  //
  // The door is in the north wall at x = 0, so the strip in front of it is kept
  // clear — the world check verifies you can walk forward off the arrival
  // marker, and it is also simply how a room works.

  // The hearth, central on the west wall and facing into the room. Built with
  // its back at z = 0 projecting +Z, so a quarter turn puts it against −X.
  place(root, fireplace.build({ seed: 8801 }), -halfW + 0.12, 0, 0.4, Math.PI / 2);

  // Two windows in the south wall, either side of centre. Facing −Z, into the
  // room. They are the reason the south half is where the daytime work happens.
  place(root, windowBuilder.build({ seed: 8810 }), -2.6, 0, halfD - 0.1, Math.PI);
  place(root, windowBuilder.build({ seed: 8811 }), 2.4, 0, halfD - 0.1, Math.PI);

  // The stove on the east wall — a second, smaller heat source at the far end
  // from the hearth, which is what a room this long would actually have.
  place(root, stove.build({ seed: 8820 }), halfW - 0.35, 0, -1.6, -Math.PI / 2);

  // Bed in the north-west corner: out of the hearth's radiant heat, out of the
  // window light, and away from the door. Beds are built lying along Z, so the
  // west wall needs no rotation.
  place(root, bed.build({ seed: 3120 }), -halfW + 0.95, 0, -2.5, 0);
  // The chest at its foot, which is where a chest goes.
  const foot = chest.build({ seed: 8830 });
  place(root, foot, -halfW + 1.0, 0, -1.0, 0.06);

  // Table and seating pulled in toward the fire rather than pushed to the far
  // wall. Two chairs and a stool round it, the chairs on the hearth side.
  const board = table.build({ seed: 2077 });
  place(root, board, 0.6, 0, 0.9, 0.08);
  place(root, chair.build({ seed: 411 }), -0.5, 0, 1.5, Math.PI * 0.4);
  place(root, chair.build({ seed: 412 }), 0.9, 0, -0.4, 0.1);
  place(root, stool.build({ seed: 413 }), 1.7, 0, 0.4, 0.4);
  // One drawn up to the fire itself, turned to face it.
  place(root, stool.build({ seed: 415 }), -halfW + 1.6, 0, 0.2, -0.5);

  // The spinning wheel under the west window, because it is the piece that
  // most needs light to work at — and putting it there is the cheapest way to
  // say the windows are for something.
  place(root, spinningWheel.build({ seed: 8840 }), -2.9, 0, halfD - 2.2, Math.PI * 0.85);

  // A side table against the south wall between the windows, with the clutter.
  const side = table.build({ seed: 2078 });
  place(root, side, -0.2, 0, halfD - 0.8, Math.PI);

  // The dresser on the north wall, east of the door, facing into the room.
  place(root, dresser.build({ seed: 8850 }), 2.6, 0, -halfD + 0.35, 0);

  // Washing in the corner by the hearth, where the water would be heated.
  place(root, washtub.build({ seed: 8860 }), -halfW + 0.75, 0, 3.3, 0.4);
  // Herbs drying on the wall above it — the overhead register, and the only
  // thing in the room whose geometry starts above head height.
  place(root, hangingHerbs.build({ seed: 8870 }), -halfW + 0.16, 0, 2.4, Math.PI / 2);
  // Pegs by the door, where coats come off.
  place(root, wallPegs.build({ seed: 8880 }), -1.5, 0, -halfD + 0.14, 0);
  // And the broom leaning beside them.
  place(root, broom.build({ seed: 8890 }), -2.3, 0, -halfD + 0.45, 0.25);

  // Somebody home. Static — Phase 7 is where figures start moving — but a room
  // with a person standing in it reads completely differently from one without,
  // and this is the fixture the animation work will be judged against. Stood at
  // the table rather than in open floor, which is where a person actually is.
  place(root, figure.build({ seed: 6602 }), 0.4, 0, 2.1, Math.PI * 0.9);

  // Storage in the dead corner behind the door, which is where it goes in a
  // real room: the space nobody walks through and nobody sits in.
  const crateA = crate.build({ seed: 61 });
  place(root, crateA, halfW - 0.9, 0, -halfD + 1.0, 0.4);
  // **The second crate is gone.** It rolls very nearly a metre across, and
  // there is nowhere left in a ten-by-eight room with a hearth, a stove, a
  // dresser and two windows in it that a metre-wide box can stand without
  // fouling something — it was inside the dresser in one position and standing
  // in the daylight from the south window in the next. One crate is enough.
  place(root, barrel.build({ seed: 67 }), halfW - 0.7, 0, -0.2, 0.2);

  // --- light you can see ---------------------------------------------------
  //
  // The interior's own lighting is a sun at a tenth strength and a generous
  // ambient — enough to read the room by and no reason for any of it. These are
  // the reason: four small sources, each standing on something, so the light in
  // here is *coming from* things rather than being a property of the air.
  //
  // Four rather than a dozen. Each carries a `PointLight`, and every one of
  // those is another iteration in the shader for every lit fragment in the
  // room. Four is enough to give the space a direction and a couple of pools of
  // warmth; a candle on every surface would cost real frames for a difference
  // that reads as "the lights are on".
  //
  // Stood on measured surfaces rather than at guessed heights — see `topOf`.
  place(root, candle.build({ seed: 7101 }), 0.75, topOf(board), 0.65, 0.6);
  place(root, candle.build({ seed: 7102 }), -0.35, topOf(side), halfD - 0.85, -0.4);
  // On a crate rather than beside it. A lantern on the floor of a room this
  // size lights the boards and nothing else; up on a box it reaches the wall.
  place(root, lantern.build({ seed: 7103 }), halfW - 0.95, topOf(crateA), -halfD + 1, 0.9);
  // And one genuinely on the floor, by the bed, where somebody set it down.
  // Standing *on* the chest at the foot of the bed, not inside it. Read off
  // the chest's own geometry rather than assumed — the lid height is rolled.
  place(root, lantern.build({ seed: 7104 }), -halfW + 1.05, topOf(foot), -1.05, -0.5);

  return markCollidable(root);
}

/**
 * Inside the factory: a large stone hall with engines in it.
 *
 * The machinery is the point of the room. An empty industrial shell is just a
 * bigger version of the other interior, and the two are supposed to prove that
 * crossing a threshold puts you somewhere *different* — so this one has a line
 * of engines down it, a working aisle, and enough clutter to look used.
 */
function buildFactory(): THREE.Group {
  const root = new THREE.Group();
  // **No beams.** `buildInterior` puts timber joists across the ceiling, which
  // is right for a dwelling and wrong here — a works is not roofed in wood, and
  // a room dressed with steel plant under oak beams reads as a barn somebody
  // put machinery in. The overhead structure is pipework instead, below.
  root.add(buildInterior({ ...FACTORY, seed: 7700, style: WORKS_STYLE, planks: false, beams: 0 }));

  const halfW = FACTORY.width / 2;
  const halfD = FACTORY.depth / 2;

  // Laid out in three lanes across the width: engines west, an open aisle up
  // the middle where the door lets you in, and storage east. The door is in the
  // north wall at x = 0, so the strip around z = -4 is kept clear — the check
  // verifies the arrival marker itself is not inside anything, and separately
  // that you can walk forward off it, which is what this lane is for.
  const engineX = ENGINE_X;

  // --- the plant -----------------------------------------------------------
  //
  // A row of engines along the west wall, turned to face the aisle. Different
  // seeds, so they read as the same kind of machine rather than as three
  // copies of one.
  //
  // Positions from `ENGINE_Z`, shared with `FACTORY_SOUND`. Typing them twice
  // is how an engine ends up standing a metre from its own noise.
  ENGINE_Z.forEach((z, index) => {
    place(root, machine.build({ seed: 3301 + index }), engineX, 0, z, Math.PI / 2);
  });

  // The vessel along the east wall, lying across the room. The biggest single
  // mass in here and the only thing that breaks the sightline down the hall,
  // which is what stops a shed reading as one empty box.
  place(root, tank.build({ seed: 4401 }), 5.1, 0, 2.1, Math.PI / 2);

  // And one engine pulled out into the open, at an angle, part-way through
  // being worked on — the reason anyone would be in here, and what the clatter
  // in `FACTORY_SOUND` is coming off.
  place(root, machine.build({ seed: 3304 }), STRIPPED_AT[0], 0, STRIPPED_AT[2], -0.35);

  // --- pipework, on the walls ---------------------------------------------
  //
  // Along the walls and not across the ceiling. Pipes overhead were standing in
  // for the timber joists that were removed, and they were the wrong shape for
  // the job — a pipe run is a *service*, something that goes from one machine
  // to another at working height, and hanging four of them across a roof reads
  // as decoration. The roof is carried by trusses below, which is what actually
  // carries a roof.
  //
  // `pipes` builds its main at a fixed 2 m along +X, so a wall run is a
  // rotation and a nudge and nothing else.
  const wallRuns: [number, number, number][] = [
    [-3.6, -halfD + 0.34, 0],
    [3.6, -halfD + 0.34, 0],
    // Shared with `FACTORY_SOUND`, which puts the air in this one. Same rule
    // as the engines and the gantry: the emitter is derived from the object.
    [PIPE_RUN[0], PIPE_RUN[2], Math.PI / 2],
    [halfW - 0.34, -2.4, Math.PI / 2],
  ];
  for (let i = 0; i < wallRuns.length; i++) {
    const [a, b, yaw] = wallRuns[i];
    const run = pipes.build({ seed: 9101 + i });
    run.position.set(yaw === 0 ? a : a, 0, yaw === 0 ? b : b);
    run.rotation.y = yaw;
    root.add(run);
  }

  // Extract high on the east wall. Vents build about a fixed 1.7 m sill, so
  // this is lifted the same way a wall pipe run is turned.
  const extract = vent.build({ seed: 9201 });
  extract.position.set(halfW - 0.22, 1.4, -1.4);
  extract.rotation.y = -Math.PI / 2;
  root.add(extract);

  // --- roof trusses --------------------------------------------------------
  //
  // Steel, and built here rather than by `buildInterior`, whose `beams` are
  // timber joists — right for a dwelling, wrong for a works, and the reason
  // they were turned off. But turning them off left the ceiling as one
  // unbroken plane fifteen metres across, and an unbroken plane lit from a
  // single direction is a flat field of one colour whatever that colour is.
  // Pipes alone are too thin to break it.
  //
  // A truss is a top chord, a bottom chord and a zigzag of webs between them.
  // That is three cheap boxes and a loop, and it is unmistakably industrial in
  // a way a single beam is not — the diagonals are the whole read.
  const truss = new THREE.MeshLambertMaterial({
    color: shade(PALETTE.IRON, 0.92),
    flatShading: true,
  });
  const trussTop = FACTORY.height - 0.12;
  const trussDepth = 0.42;

  for (const z of [-4.2, -1.4, 1.4, 4.2]) {
    const bay = new THREE.Group();

    for (const [y, thick] of [
      [trussTop, 0.13],
      [trussTop - trussDepth, 0.1],
    ] as const) {
      const chord = new THREE.Mesh(
        new THREE.BoxGeometry(FACTORY.width, thick, thick * 1.25),
        truss,
      );
      chord.position.set(0, y, 0);
      bay.add(chord);
    }

    // The webs. Alternating lean, so consecutive panels form the W that says
    // "this is carrying a load" rather than a ladder, which says nothing.
    const panels = 9;
    const pitch = FACTORY.width / panels;
    for (let i = 0; i < panels; i++) {
      const web = new THREE.Mesh(
        new THREE.BoxGeometry(0.07, Math.hypot(pitch, trussDepth), 0.09),
        truss,
      );
      web.position.set(-FACTORY.width / 2 + pitch * (i + 0.5), trussTop - trussDepth / 2, 0);
      web.rotation.z = (i % 2 === 0 ? 1 : -1) * Math.atan2(pitch, trussDepth);
      bay.add(web);
    }

    bay.position.z = z;
    root.add(bay);
  }

  // --- keeping people out of the plant -------------------------------------
  //
  // A railing between the aisle and the engine row, and a fenced-off corner at
  // the south end. Both are the cheapest way to say that this is a place with
  // rules in it: a machine you can walk straight into is scenery, and one
  // behind a rail is equipment.
  place(root, railing.build({ seed: 9301 }), engineX + 1.9, 0, 1, Math.PI / 2);
  place(root, chainlink.build({ seed: 9302 }), 2.4, 0, halfD - 0.7, 0);

  // The wash-up, in the corner by the door. Every works has one and it is the
  // one object in here at human scale.
  place(root, sink.build({ seed: 9401 }), halfW - 0.55, 0, -halfD + 1.5, -Math.PI / 2);

  // --- the gantry ----------------------------------------------------------
  //
  // Straddling the aisle rather than standing over the plant, because the
  // point of a hoist is the empty floor underneath it: something gets lifted
  // *off* a machine and set down where there is room to work on it, and the
  // engine pulled out at an angle a couple of metres away is that job. Turned
  // to run along the hall so the beam does not block the walk down it.
  //
  // **This is the object the creak comes from.** The friction emitter in the
  // factory soundscape sits at the trolley, and it was placed here first — a
  // rope groaning out of clear air in the middle of a room reads as a bug.
  place(root, hoist.build({ seed: 8110 }), GANTRY_AT[0], 0, GANTRY_AT[2], Math.PI / 2);

  // --- lit for work --------------------------------------------------------
  //
  // Aimed at things, not scattered. `floodlight` builds pointing +Z and takes
  // no facing of its own, so the yaw here is the whole aim — which is the only
  // reason it is possible to say "this one lights the engine row" and be right.
  //
  // Aimed *across* the hall rather than down it, for a second reason: the beam
  // is visible geometry, and a beam pointing away from you is a bright disc
  // while a beam crossing your view is a shaft. The shaft is the entire value
  // of drawing the cone.
  //
  // Three, and not one per machine. Each carries a `SpotLight`, which is the
  // most expensive light in the API — a cone test and a penumbra falloff for
  // every lit fragment, on top of a shadow map when shadows are on.
  //
  // Onto the engine row from across the aisle, facing -X.
  place(root, floodlight.build({ seed: 5501 }), -0.6, 0, -2.4, -Math.PI / 2);
  place(root, floodlight.build({ seed: 5502 }), -0.6, 0, 4.4, -Math.PI / 2);
  // And onto the tank from the aisle, facing +X.
  place(root, floodlight.build({ seed: 5503 }), 1.2, 0, -0.6, Math.PI / 2);


  return markCollidable(root);
}

/**
 * The height of the top of a placed prop, in its parent's space.
 *
 * Measured off the geometry rather than looked up. Every builder rolls its own
 * dimensions from its seed — a table is between 0.68 and 0.78 m tall — so the
 * only way to stand something *on* one and be right about it is to ask the mesh
 * that was actually built. A constant here would be correct for one seed and
 * put a candle through the boards or hovering above them for every other.
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
