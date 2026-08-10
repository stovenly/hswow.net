import * as THREE from 'three';
import { type ZoneDefinition, OUTDOOR_ENVIRONMENT, INDOOR_ENVIRONMENT } from '../world/Zone';
import type { SoundscapeSpec } from '../audio/Soundscape';
import type { PortalDefinition, PortalEnd } from '../world/Portal';
import { markCollidable } from '../player/Collider';
import { ProvingGround, SPAWN } from './ProvingGround';
// Builders are imported directly rather than through `art/registry`, which is
// Vite-only. The headless zone check reaches this file through esbuild. Only
// the hub's own is here now — the two interiors' builders went with their
// geometry into `interiors.build.ts`.
import { hut, hutDoorAnchor } from '../art/builders/hut';
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
import { groundcoverShowcaseZone } from './GroundcoverShowcase';
import { particleShowcaseZone } from './ParticleShowcase';
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

/**
 * Interior dimensions, shared by the zone builder and the portal placement.
 * Exported for `interiors.build.ts`, which holds the builder half of that
 * sharing now that the geometry loads on demand.
 */
// Roomy rather than snug. The first version was 6.4 x 5.2 and read as a
// cupboard the moment there was furniture in it — at eye height a room needs
// enough floor that you can walk *around* something, not just past it.
export const HUT_ROOM_SHELL = { width: 10, depth: 8, height: 3.4 };
export const FACTORY = { width: 15, depth: 11, height: 5.6 };

const UP = new THREE.Vector3(0, 1, 0);

/**
 * Where the plant in the factory hall actually stands.
 *
 * Same rule as the wet corner above: **placement runs object → sound.** These
 * are read by `buildFactory` and by `FACTORY_SOUND`, so an engine cannot be
 * moved without its noise following it, which is exactly what went wrong the
 * first time an emitter was given coordinates of its own.
 */
export const ENGINE_X = -5.4;
export const ENGINE_Z = [-2.4, 1.1, 4.4] as const;
/** The engine pulled out into the aisle, part-way through being worked on. */
export const STRIPPED_AT: readonly [number, number, number] = [1.5, 0.9, 1.9];
/** The gantry straddling the aisle, and the height of its trolley. */
export const GANTRY_AT: readonly [number, number, number] = [-1.8, 2.6, 2.4];
/**
 * The pipe run on the east wall, and roughly the height of its main.
 *
 * `FACTORY.width / 2 − 0.34` — written out because this is read before
 * `buildFactory` declares its local `halfW`, and the two must not drift.
 */
export const PIPE_RUN: readonly [number, number, number] = [15 / 2 - 0.34, 1.5, 1.6];

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
      group: 'countryside',
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
      load: () => import('./interiors.build').then((m) => m.buildVillagerHut),
    },

    {
      id: ZONE_FACTORY,
      name: 'Industrial Factory Interior Demo',
      group: 'industrial',
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
      load: () => import('./interiors.build').then((m) => m.buildFactory),
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
  // The Groundcover Showcase, which is the ground itself rather than anything
  // standing on it — see `propPortals` for where its door stands.
  zones.push(groundcoverShowcaseZone());
  // And the Particle Showcase, which is the air above it.
  zones.push(particleShowcaseZone());

  return { zones, portals };
}
