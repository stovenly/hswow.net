import * as THREE from 'three';
import { OUTDOOR_ENVIRONMENT, type ZoneDefinition } from '../world/Zone';
import { SILENCE } from '../audio/Soundscape';
import { flatGround } from '../world/floor';
import { markCollidable } from '../player/Collider';
import { lantern } from '../art/builders/lantern';
import { PALETTE } from '../art/palette';
import { createParticles, type ParticleSpec } from '../art/particles';
import { signPost } from './galleries/layout';
import type { PortalEnd, PortalDefinition } from '../world/Portal';

/**
 * The Particle Showcase: one station per system, standing still.
 *
 * Almost nothing about particles can be settled by arithmetic — PARTICLES.md
 * §11 is a list of things only looking answers — so the room exists to make
 * each of them answerable by standing somewhere:
 *
 * - **The rank.** Every system in the table, each in its own wrapped box or on
 *   its own plinth, with a wall to fall past and ground to disappear into. The
 *   walls are what the soft-particle fade is judged against: a billboard
 *   meeting a wall draws a hard straight line across itself without it.
 * - **The band at ten to thirty metres.** The rank is long and the fog is
 *   pushed out, so the sub-pixel clamp is always in frame somewhere — that band
 *   is what P2 is really about, and it cannot be looked at in a small room.
 * - **The lamps.** A lit lantern beside the snow and another beside the sparks:
 *   the first is what proves a particle takes the scene's point lights, the
 *   second is a fixed reference for how hard an ember blooms next to a flame
 *   that was tuned long before particles existed.
 * **Nothing in here follows the camera, and that is the point.** A `follow` box
 * is ambient weather — it is carried by the player and covers everything — so in
 * a room built to compare ten systems side by side it is snow falling through
 * all ten of them at once, permanently, with no way to turn it off. The wrap
 * and the never-runs-out claims belong where weather is declared on a zone and
 * the whole zone is the subject; every station here is a box that stays put.
 *
 * Flat ground and a grid, like the galleries, and silent. What is being looked
 * at is the air.
 */

export const ZONE_PARTICLE_SHOWCASE = 'particle-showcase';

/** Metres across. */
const FLOOR = 120;

/**
 * **The room is small on purpose, and the first one was not.**
 *
 * §3's arithmetic is the whole reason: a 3 cm flake is under one chunky pixel
 * past ten metres, and the clamp that stops it flickering costs alpha by the
 * square of the distance. The pipeline then quantizes, so a particle under one
 * level of alpha is not faint — it is *not drawn*. Ten stations thirteen
 * metres apart with the door twenty-four metres off the end leaves five of the
 * ten mathematically incapable of appearing.
 *
 * So: two short rows either side of the walk in, everything inside about thirty
 * metres of the arrival, and the weather boxes sitting *on* the path rather
 * than beside it — the way to judge snow is to stand in it.
 */
const STATION_SPACING = 11;
/** The wrapped systems, on the near row; the emitters stand behind them. */
const NEAR_Z = 0;
const FAR_Z = -15;

/** Where the door home stands. Close, for the reason above. */
const DOOR_Z = 14;

const STONE = new THREE.MeshLambertMaterial({ color: 0x8d8779, flatShading: true });

/**
 * A wrapped box a station's weather lives in.
 *
 * Seven metres across against an eleven-metre spacing, so the boxes stand clear
 * of each other with four metres of bare air between — two neighbouring boxes
 * that touched would read as one continuous weather rather than as two things
 * being compared.
 */
const WEATHER_BOX = new THREE.Vector3(7, 10, 7);

/**
 * The systems, in the order they stand in the room.
 *
 * Starting points rather than tuned values, and the counts assume the boxes
 * above. The four motions are all here on purpose: a room that showed three of
 * them would leave the fourth to be discovered broken in a zone.
 */
interface Station {
  name: string;
  spec: ParticleSpec;
  /** A wall behind it, for the soft fade and for something to fall past. */
  wall?: boolean;
  /** A lit lantern beside it. */
  lamp?: boolean;
  /** Metres off the ground the emitter stands. */
  height?: number;
}

const STATIONS: readonly Station[] = [
  {
    name: 'snow',
    wall: true,
    lamp: true,
    spec: {
      count: 700,
      shape: 'billboard',
      motion: 'fall',
      volume: { kind: 'field', size: WEATHER_BOX },
      size: [0.028, 0.05],
      colour: [0xf2f6fb, 0xd8e4f0],
      opacity: 0.9,
      speed: [0.8, 1.4],
      windDrag: 0.8,
      turbulence: 0.12,
      weather: true,
    },
  },
  {
    name: 'rain',
    wall: true,
    spec: {
      count: 1300,
      shape: 'billboard',
      motion: 'fall',
      volume: { kind: 'field', size: WEATHER_BOX },
      size: [0.012, 0.02],
      colour: [0x9fb4c4, 0xbcd0dd],
      opacity: 0.55,
      speed: [7, 9],
      // A raindrop is heavy and falls nearly straight in anything short of a
      // gale. Most of the difference between this and the snow beside it.
      windDrag: 0.15,
      weather: true,
    },
  },
  {
    name: 'motes',
    lamp: true,
    spec: {
      count: 260,
      shape: 'billboard',
      motion: 'fall',
      volume: { kind: 'field', size: new THREE.Vector3(5, 4, 5) },
      size: [0.012, 0.022],
      colour: [0xffe9c0, 0xfff6e2],
      opacity: 0.5,
      speed: [0.05, 0.15],
      windDrag: 1,
      turbulence: 0.18,
      emissive: true,
    },
  },
  {
    name: 'leaves',
    spec: {
      count: 130,
      shape: new THREE.PlaneGeometry(1, 0.6),
      motion: 'tumble',
      volume: { kind: 'field', size: WEATHER_BOX },
      size: [0.09, 0.15],
      colour: [PALETTE.LEAF_DRY, 0x8a6a34],
      opacity: 1,
      speed: [0.6, 1],
      windDrag: 0.9,
      turbulence: 0.3,
      spin: 2.4,
      weather: true,
    },
  },
  {
    name: 'ash',
    wall: true,
    spec: {
      count: 400,
      shape: 'billboard',
      motion: 'fall',
      volume: { kind: 'field', size: WEATHER_BOX },
      size: [0.02, 0.04],
      colour: [0x6b6660, 0x8d867d],
      opacity: 0.75,
      speed: [0.2, 0.5],
      // It *is* the air, and it wanders.
      windDrag: 1,
      turbulence: 0.55,
      weather: true,
    },
  },
  {
    name: 'smoke',
    height: 0.9,
    spec: {
      count: 44,
      // Twenty faces, flat-shaded out of the palette. **The most opinionated
      // call in the whole design**: every other engine makes smoke a soft
      // sprite, and a soft sprite would be the one unfaceted object in this
      // game. It might read as rocks leaving a chimney; that is what this
      // station is for.
      shape: new THREE.IcosahedronGeometry(0.5, 0),
      motion: 'rise',
      volume: { kind: 'emitter', spread: 0.18 },
      size: [0.34, 0.5],
      colour: [0x4a4742, 0x6d6862],
      opacity: 0.42,
      speed: [0.5, 0.9],
      life: 5.5,
      gravity: 0.28,
      growth: 2.2,
      windDrag: 0.6,
      turbulence: 0.22,
      spin: 0.4,
    },
  },
  {
    name: 'steam',
    height: 0.7,
    spec: {
      count: 30,
      shape: new THREE.IcosahedronGeometry(0.5, 0),
      motion: 'rise',
      volume: { kind: 'emitter', spread: 0.14 },
      size: [0.26, 0.4],
      colour: [0xd6dbdd, 0xeef2f3],
      opacity: 0.3,
      speed: [0.8, 1.2],
      life: 2.6,
      gravity: 0.4,
      growth: 2.6,
      windDrag: 0.6,
      turbulence: 0.2,
      spin: 0.5,
    },
  },
  {
    name: 'sparks',
    height: 0.85,
    lamp: true,
    spec: {
      count: 140,
      shape: 'billboard',
      motion: 'ballistic',
      volume: { kind: 'emitter', spread: 0.08 },
      size: [0.016, 0.03],
      colour: [PALETTE.LAMPLIGHT, 0xffd08a],
      opacity: 1,
      speed: [3, 7],
      life: 0.85,
      gravity: 9.8,
      windDrag: 0.3,
      emissive: true,
    },
  },
  {
    name: 'embers',
    height: 0.6,
    spec: {
      count: 70,
      shape: 'billboard',
      motion: 'rise',
      volume: { kind: 'emitter', spread: 0.3 },
      size: [0.022, 0.04],
      colour: [PALETTE.LAMPLIGHT, 0xd8632a],
      opacity: 0.9,
      speed: [0.3, 0.7],
      life: 4.5,
      gravity: 0.1,
      growth: 0,
      windDrag: 0.9,
      turbulence: 0.3,
      emissive: true,
    },
  },
  {
    name: 'spray',
    height: 0.35,
    spec: {
      count: 240,
      shape: 'billboard',
      motion: 'ballistic',
      volume: { kind: 'emitter', spread: 0.5 },
      size: [0.02, 0.045],
      colour: [0xc8d6dc, 0xeaf1f4],
      opacity: 0.6,
      speed: [1, 3],
      life: 1.4,
      gravity: 9.8,
      windDrag: 0.5,
    },
  },
];

/**
 * Where a station stands.
 *
 * The wrapped systems take the near row and the emitters the far one, decided
 * by the volume rather than declared: a wrapped box is something you walk into
 * and an emitter is something you look at, so the ones you have to be inside of
 * are the ones on the path.
 */
function stationPlace(index: number): { x: number; z: number } {
  const near = STATIONS[index].spec.volume.kind !== 'emitter';
  const row = STATIONS.filter((s) => (s.spec.volume.kind !== 'emitter') === near);
  const place = row.indexOf(STATIONS[index]);
  return {
    x: (place - (row.length - 1) / 2) * STATION_SPACING,
    z: near ? NEAR_Z : FAR_Z,
  };
}

export function particleShowcaseZone(): ZoneDefinition {
  return {
    id: ZONE_PARTICLE_SHOWCASE,
    name: 'Particle Showcase',
    group: 'general',
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      // Pushed out past the whole room. The sub-pixel band this place is built
      // around runs from about ten metres to about thirty — which is the far
      // row and the ends of the near one — and fog closing inside that would
      // dim the very thing being judged.
      fogNear: 55,
      fogFar: 150,
      // Blowier than the weather's default, because half of what is being
      // looked at here is whether a gust *carries* the snow rather than
      // rubber-banding it.
      wind: 1.5,
      soundscape: SILENCE,
    },
    spawn: { position: new THREE.Vector3(0, 0.1, DOOR_Z - 2.5), yaw: Math.PI },
    floor: -20,
    groundAt: () => 0,
    build() {
      const root = new THREE.Group();
      root.add(flatGround(FLOOR));

      STATIONS.forEach((station, i) => {
        const { x, z } = stationPlace(i);
        const volume = station.spec.volume;

        if (station.wall) {
          // Just behind the box's back face, so the weather falls *in front of*
          // a surface rather than through its middle — where a billboard grazes
          // a wall is the one place the soft fade can be judged at all.
          const wall = new THREE.Mesh(new THREE.BoxGeometry(6, 4.5, 0.6), STONE);
          wall.position.set(x, 2.25, z - WEATHER_BOX.z / 2 - 0.8);
          root.add(markCollidable(wall));
        }

        if (station.lamp) {
          // Inside the weather, not beside it. A lamp two metres clear of the
          // snow proves nothing about whether the snow takes its light.
          const lamp = lantern.build({ seed: 9100 + i });
          lamp.position.set(x + 1.6, 0, z + 1.4);
          root.add(markCollidable(lamp));
        }

        const system = createParticles(station.spec, 9200 + i * 37);
        // A field box hangs by its centre; an emitter stands where it is put.
        system.position.set(
          x,
          station.height ?? (volume.kind === 'emitter' ? 1 : volume.size.y / 2),
          z,
        );
        system.name = `particles:${station.name}`;
        root.add(system);

        // On the near side of its own station, so the caption is read on the
        // way in rather than through the thing it names.
        const sign = signPost(station.name);
        sign.position.set(x, 0, z + (volume.kind === 'emitter' ? 3.2 : WEATHER_BOX.z / 2 + 1.4));
        root.add(sign);
      });

      return root;
    },
  };
}

/** The showcase end of a portal, for whoever stands a door here. */
export function particleShowcaseDoor(): PortalEnd {
  return {
    zone: ZONE_PARTICLE_SHOWCASE,
    position: new THREE.Vector3(0, 0, DOOR_Z),
    // Facing -Z, which puts the arrival looking straight down the rank.
    yaw: Math.PI,
    material: 'iron',
    seed: 6802,
  };
}

export function particleShowcasePortal(hub: PortalEnd): PortalDefinition {
  return { id: `portal:${ZONE_PARTICLE_SHOWCASE}`, a: hub, b: particleShowcaseDoor() };
}
