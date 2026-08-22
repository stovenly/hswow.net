import * as THREE from 'three';
import { type ZoneDefinition, OUTDOOR_ENVIRONMENT, INDOOR_ENVIRONMENT } from '../world/Zone';
import type { SoundscapeSpec } from '../audio/Soundscape';
import type { PortalDefinition, PortalEnd } from '../world/Portal';
import { ProvingGround, SPAWN } from './ProvingGround';
import { countrysideZone } from './countryside';
import { demoZone, demoHallPortal, demoPortals } from './demos';
import { countrysideHomeZones, countrysideHomePortals } from './countryside-homes';
import { GALLERIES, galleryZone } from './galleries';
import { propZones, propPortals } from './props';
import { soundStageZone } from './SoundStage';
import { musicStageZone, musicAnnexZone, musicStagePortal } from './MusicStage';
import { waterShowcaseZone } from './WaterShowcase';
import { waterShowcase2Zone } from './WaterShowcase2';
import { footstepsShowcaseZone } from './FootstepsShowcase';
import { groundcoverShowcaseZone } from './GroundcoverShowcase';
import { particleShowcaseZone } from './ParticleShowcase';
import { vistaShowcaseZone } from './VistaShowcase';
import { chainZones, chainPortals } from './chains';

/**
 * The test world: the hub, and the two antechambers everything else hangs off.
 * Not content — a place where the system can be exercised.
 *
 * **The hub says two things.** Turn around for the kit: three prop halls, with
 * the galleries and showcases inside them. Look forward for the world: the Demo
 * Showcase, with every finished place behind it.
 *
 * Two interiors rather than one, because a single portal cannot show whether
 * zone state is being reset or merely swapped: with two you can go in one door,
 * come out, go in the other, and any leak shows up as the wrong room. They are
 * deliberately unalike in every axis the zone system controls — size, light,
 * fog, floor material, acoustics — because the claim of a zone is that crossing
 * into it changes the place.
 *
 * **The names are placeholders.** They are what a door's tooltip shows, so they
 * are the most player-facing strings in the game so far.
 */

export const ZONE_EXTERIOR = 'exterior';
export const ZONE_HUT = 'villager-hut';
export const ZONE_FACTORY = 'factory';
export { ZONE_COUNTRYSIDE } from './countryside';

/**
 * The door to the Demo Showcase, directly ahead of spawn. A portal you have to
 * walk thirty seconds to reach is a portal that gets tested once; one you are
 * looking at on boot gets used every time anything behind it changes. Clear of
 * the measured cubes at z = 0 and of the movement gym west of x = -4.
 */
const DEMO_DOOR_AT = new THREE.Vector3(10, 0, 6);
/** Faces +Z, back toward spawn, so it is square-on the moment you look at it. */
const DEMO_YAW = 0;

/**
 * How far a portal door stands out from the wall it is set into. Small, but not
 * zero: the interior shells are sealed boxes, and a door mesh exactly coplanar
 * with one would z-fight along every edge at every distance.
 */
const DOOR_PROUD = 0.07;

/**
 * The rank of prop hall doors, directly behind spawn. Yaw π faces -Z, back
 * toward spawn, so the rank is square-on when you turn.
 *
 * **Everything in the gym has to stay south of the arrival markers**, which sit
 * a stride in front of these doors at z ≈ 20.9. A door that is walkable on
 * arrival and walled a stride later is a door nobody can use.
 */
const PROP_RANK = new THREE.Vector3(-10, 0, 22);
const PROP_SPACING = 5;
const PROP_YAW = Math.PI;

/**
 * Interior dimensions, shared by the zone builder and the portal placement.
 * Exported for `interiors.build.ts`, which holds the builder half of that
 * sharing now that the geometry loads on demand.
 */
// Roomy rather than snug: at eye height a room needs enough floor that you can
// walk *around* something, not just past it.
export const HUT_ROOM_SHELL = { width: 10, depth: 8, height: 3.4 };
export const FACTORY = { width: 15, depth: 11, height: 5.6 };

/**
 * Where the plant in the factory hall actually stands.
 *
 * **Placement runs object → sound.** These are read by `buildFactory` and by
 * `FACTORY_SOUND`, so an engine cannot be moved without its noise following it.
 */
export const ENGINE_X = -5.4;
export const ENGINE_Z = [-2.4, 1.1, 4.4] as const;
/** The engine pulled out into the aisle, part-way through being worked on. */
export const STRIPPED_AT: readonly [number, number, number] = [1.5, 0.9, 1.9];
/** The gantry straddling the aisle, and the height of its trolley. */
export const GANTRY_AT: readonly [number, number, number] = [-1.8, 2.6, 2.4];
/**
 * The pipe run on the east wall, and roughly the height of its main.
 * `FACTORY.width / 2 − 0.34` — written out because this is read before
 * `buildFactory` declares its local `halfW`, and the two must not drift.
 */
export const PIPE_RUN: readonly [number, number, number] = [15 / 2 - 0.34, 1.5, 1.6];

/**
 * The factory hall.
 *
 * A works is not a village and the rules are different. Outdoors, sparse beats
 * dense and everything has a short reach; in a sealed stone box fifteen metres
 * across there is nowhere to walk *away* to, so the danger is the opposite one
 * — four continuous sources at once is a wall of noise with no shape, and the
 * room stops having a near end and a far end.
 *
 * So two engines and not four. The ear cannot separate three of the same model
 * in one room anyway — it hears "an engine room", which is the read that is
 * wanted. They are pitched a fifth apart and run at different speeds, because
 * two identical machines beat into a chorus and stop being two objects.
 *
 * The gantry is what makes it a *working* room rather than a running one: it
 * moves in bursts, and a silence in an industrial space is worth more than
 * another drone in it.
 *
 * **Everything here is quieter than it looks**, and three things stack up in a
 * sealed room. There is nowhere to be far away — the hall is 15 × 11, so the
 * listener is within about eight metres of everything and distance attenuation
 * does almost nothing. `refDistance` is pulled in to match, so crossing the
 * room is actually a change. And the room adds the sound back: a `hall` tail
 * returns most of what is sent to it, so a continuous source at reverb 0.9 is
 * heard roughly twice. Sends are well down here; the intermittent sources keep
 * theirs.
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
    // The chain hoist: a load on a chain over a drum, hauled in bursts. Iron, so
    // the body rings much longer and brighter than the tree in the proving
    // ground — same model, and nobody would mistake one for the other.
    {
      model: 'friction',
      id: 'gantry',
      at: GANTRY_AT,
      // Dull and slow. High `bright` puts most of the energy into the upper
      // modes where the contact noise lives, which measures flat across octave
      // bands and is the definition of hiss; and a low speed sits past the
      // Stribeck dip in the rub regime, never reaching the creak at all.
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
    // Deliberately tiny reach. A fifth continuous source filling the hall would
    // undo everything above. At 9 m this exists when you are beside the wall and
    // nowhere else, which is what a draught in a pipe actually does.
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
 * Where the door to the nth prop hall stands in the hub. Shared by the portal
 * definition and the arch built around it, so the two cannot drift apart.
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
  const zones: ZoneDefinition[] = [
    {
      id: ZONE_EXTERIOR,
      name: 'Outside',
      environment: {
        ...OUTDOOR_ENVIRONMENT,
        // The shared outdoor default bounces a dark floor colour. This
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

        // The hut that used to stand here went into the Demo Showcase with the
        // door that was set into it — see `demos.ts`.

        // The sink and the cistern are gone with the acoustics fixture they
        // stood in. Every sound needs an object, and with the water gone there
        // is nothing for them to be the object of.

        // No frames around the village gate or the prop hall rank. An archway
        // reads as a threshold you walk *through*, and neither of these is —
        // both are doors you use and are teleported by. The portal system
        // builds the door meshes themselves; that is the whole fixture.
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
        firstPersonReverb: 0.45,
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
        // This is what the ceiling is lit by, and almost nothing else. A
        // hemisphere light is sampled by the surface normal, and a ceiling
        // points straight down — so it takes the *ground* lobe and none of the
        // sky one, and both directional lights are above it and contribute
        // nothing. Lifted well up and warm rather than blue, because what is
        // actually bouncing up here is light off a lit floor.
        ambientGround: 0x8a8378,
        ambientIntensity: 2.2,
        sunIntensity: 0.9,
        fillIntensity: 0.85,
        fillColor: 0x93a3b5,
        // Enough to place your own steps in the hall, not enough to ring it. A
        // four-second stone tail on your own boots is a gunshot in a cathedral;
        // with almost no send they go dry, which puts them back at the
        // listener's head, just quieter.
        firstPersonReverb: 0.34,
        soundscape: FACTORY_SOUND,
      },
      spawn: { position: new THREE.Vector3(0, 0.1, 2), yaw: Math.PI },
      floor: -5,
      load: () => import('./interiors.build').then((m) => m.buildFactory),
    },

    // The antechamber every finished place hangs off, and the places themselves.
    demoZone(),
    countrysideZone(),
    // The three houses in it you can go into — see `countryside-homes.ts`.
    ...countrysideHomeZones(),
    // Two chains of rooms hung off the hut and the factory, three deep. They
    // exist so that somewhere in the world is more than two doors from the hub
    // — see `chains.ts`, and the residency check in `check:world`.
    ...chainZones(),
  ];

  const portals: PortalDefinition[] = [
    // The one door out of the hub that leads to a place rather than to a shelf
    // of props.
    demoHallPortal({
      zone: ZONE_EXTERIOR,
      position: DEMO_DOOR_AT,
      yaw: DEMO_YAW,
      material: 'timber',
      seed: 6451,
    }),
    // And every door out of that room. The interior ends are ours because the
    // shells are — `demos.ts` knows what hangs off it and nothing about the far
    // side of its own doors.
    ...demoPortals(
      {
        zone: ZONE_HUT,
        // Set into the north wall, facing back into the room. This is the way
        // out — the same portal read from the other end.
        position: new THREE.Vector3(0, 0, -HUT_ROOM_SHELL.depth / 2 + DOOR_PROUD),
        yaw: 0,
        material: 'timber',
        seed: 8802,
      },
      {
        zone: ZONE_FACTORY,
        position: new THREE.Vector3(0, 0, -FACTORY.depth / 2 + DOOR_PROUD),
        yaw: 0,
        material: 'iron',
        seed: 9302,
      },
    ),
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
  // The Vista Showcase, which is everything past the edge of both — see
  // `VistaShowcase.ts` and VISTA.md.
  zones.push(vistaShowcaseZone());
  // The Music Showcase and its annex. Its hall door is in
  // `propPortals` with the other showcases; the portal here joins the pair,
  // because the border retune the stage exists to prove has to be walked.
  zones.push(musicStageZone());
  zones.push(musicAnnexZone());
  portals.push(musicStagePortal());

  return { zones, portals };
}
