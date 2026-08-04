import * as THREE from 'three';
import { OUTDOOR_ENVIRONMENT, type ZoneDefinition } from '../world/Zone';
import { SILENCE } from '../audio/Soundscape';
import { Terrain, type Landform } from '../world/terrain';
import type { GroundName, GroundPatch, CoverPatch } from '../world/ground';
import { markCollidable } from '../player/Collider';
import { signPost } from './galleries/layout';
import type { PortalEnd, PortalDefinition } from '../world/Portal';

/**
 * The Groundcover Showcase: a rank of strips, a plume meadow, a bank, and two
 * painted patches.
 *
 * Groundcover makes claims a headless check cannot settle, so the room makes
 * each one answerable by standing somewhere and looking:
 *
 * - **The rank.** Every cover type on the ground material that grows it, from
 *   bare to thick, ending on a cleared strip — turning cover *off* somewhere
 *   is as much a thing to author as turning it on.
 * - **The plume meadow.** A field of pampas to walk into: stalks over long
 *   grass, the tread parting blades at your feet, and the backlight when you
 *   look through the plumes toward the sun.
 * - **The bank.** Steeper than the rock angle, so cover stops in a line that
 *   is not authored anywhere.
 * - **Two painted patches**: clover in a hollow, moss along the foot of a
 *   wall — cover the material underneath knows nothing about.
 *
 * **Terrain, not slabs**, because the cover sampler reads the per-face
 * attribute the terrain writes, and that is the path the game actually uses.
 * Silent, like the galleries.
 */

export const ZONE_GROUNDCOVER_SHOWCASE = 'groundcover-showcase';

/** Metres across. Square, centred on the origin, and it is one mesh. */
const SIZE = 96;
/** Metres per quad. */
const RESOLUTION = 1.5;

/** The rank runs across the room, this far either side of the middle. */
const RANK_HALF = 30;
/** And this deep, so you can stand in one strip with the others out of view. */
const RANK_Z: readonly [number, number] = [-10, 10];
/** Where the captions stand, at the near end of every strip. */
const SIGN_Z = 11.6;

/** Where the door home stands. */
const DOOR_Z = 24;

/** The wall the moss grows along, and the ground it stands on. */
const WALL = { z: -16, from: -12, to: 8, thick: 0.7, height: 2.4 };

const STONE = new THREE.MeshLambertMaterial({ color: 0x8d8779, flatShading: true });

interface Strip {
  /** The caption, and the sign's name. */
  name: string;
  /** What the ground is made of. Its own `COVER` entry does the rest. */
  material: GroundName;
  /** Painted over the top, where the point of the strip is the painting. */
  paint?: CoverPatch['cover'];
}

/**
 * The rank, west to east, from bare to thick to tall.
 *
 * `gravel` is first because bare is a reading too — it is what a painted path
 * across a field has to look like.
 */
const STRIPS: readonly Strip[] = [
  { name: 'bare', material: 'gravel' },
  { name: 'weeds', material: 'dirt' },
  { name: 'heather', material: 'dirt', paint: 'heather' },
  { name: 'moss', material: 'cobble' },
  { name: 'clover', material: 'turf', paint: 'clover' },
  { name: 'stubble', material: 'crop' },
  { name: 'turf', material: 'turf' },
  { name: 'flowers', material: 'turf', paint: 'flowers' },
  { name: 'tussock', material: 'meadow' },
  { name: 'sedge', material: 'mire', paint: 'sedge' },
  { name: 'plume', material: 'meadow', paint: 'plume' },
  { name: 'cleared', material: 'turf', paint: 'none' },
];

/** Strip width, so the rank fills the space it was given exactly. */
const STRIP = (RANK_HALF * 2) / STRIPS.length;

/** The x span of the nth strip. */
function stripSpan(index: number): [number, number] {
  const west = -RANK_HALF + index * STRIP;
  return [west, west + STRIP];
}

const LANDFORMS: readonly Landform[] = [
  // The boundary, as everywhere: hills that get steeper until they turn you
  // back. Well clear of the rank, which stays dead level.
  { kind: 'rim', inset: 10, height: 16 },
  // **The bank.** Eight metres of rise over ten gives about 56° at its
  // steepest, comfortably past the 34° the terrain turns to rock at — so the
  // cover has somewhere to stop, and the line it stops on is the whole point.
  { kind: 'ridge', from: [-22, -30], to: [22, -30], width: 10, height: 8 },
  // The hollow the clover is painted into. Shallow enough to walk out of.
  { kind: 'basin', at: [31, 6], radius: 6.5, depth: 2.4 },
];

/** The pampas field, west of the wall and running up the bank's foot. */
const MEADOW = { min: [-36, -28] as const, max: [-16, -13] as const };

const PATCHES: readonly GroundPatch[] = [
  ...STRIPS.map((strip, i) => {
    const [from, to] = stripSpan(i);
    return {
      kind: 'field' as const,
      min: [from, RANK_Z[0]] as const,
      max: [to, RANK_Z[1]] as const,
      material: strip.material,
    };
  }),
  { kind: 'field', min: MEADOW.min, max: MEADOW.max, material: 'meadow' },
];

const COVER_PATCHES: readonly CoverPatch[] = [
  // The strips whose point is the painting rather than the material.
  ...STRIPS.flatMap((strip, i): CoverPatch[] => {
    if (!strip.paint) return [];
    const [from, to] = stripSpan(i);
    return [
      { kind: 'field', min: [from, RANK_Z[0]], max: [to, RANK_Z[1]], cover: strip.paint },
    ];
  }),
  // Clover in the hollow, over turf that would otherwise be grass.
  { kind: 'blot', at: [31, 6], radius: 5.5, cover: 'clover' },
  // The meadow grows pampas, and keeps growing it up the bank until the rock.
  { kind: 'field', min: MEADOW.min, max: MEADOW.max, cover: 'plume' },
  // And moss along the foot of the wall, on its lit side. A band rather than a
  // blot, because what a wall grows is a line.
  {
    kind: 'path',
    through: [
      [WALL.from, WALL.z + 1.1],
      [WALL.to, WALL.z + 1.1],
    ],
    width: 2.2,
    cover: 'moss',
  },
];

const terrain = new Terrain({
  size: SIZE,
  resolution: RESOLUTION,
  landforms: LANDFORMS,
  patches: PATCHES,
  cover: COVER_PATCHES,
  // Finer over the rank, so a strip edge is a straight line rather than
  // whatever the base grid happened to do. Kept on level ground, which is where
  // a change of facet size is invisible — see `DetailRegion`.
  detail: [{ at: [0, 0], radius: 33, level: 2 }],
});

/** Exported so the portals and the checks can measure the ground. */
export const groundcoverTerrain = terrain;

export function groundcoverShowcaseZone(): ZoneDefinition {
  return {
    id: ZONE_GROUNDCOVER_SHOWCASE,
    name: 'Groundcover Showcase',
    group: 'general',
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      // Opened out. Half of what this room says is said by a whole field at
      // once, and fog closing at forty would put the far strips in haze.
      fogNear: 50,
      fogFar: 170,
      // Blowier than the weather's default: the sway is half of what the room
      // exists to show.
      wind: 1.6,
      soundscape: SILENCE,
    },
    spawn: { position: onGround(0, DOOR_Z - 2.5), yaw: Math.PI },
    floor: -20,
    surfaceAt: (x, z) => terrain.stepAt(x, z),
    groundAt: (x, z) => terrain.heightAt(x, z),
    build() {
      const root = new THREE.Group();
      // Marked, because it is the only thing to stand on in here — an unmarked
      // terrain is a room with no floor, which is what the arrival check calls
      // it.
      root.add(markCollidable(terrain.build()));

      STRIPS.forEach((strip, i) => {
        const [from, to] = stripSpan(i);
        const x = (from + to) / 2;
        const post = signPost(strip.name);
        post.position.copy(onGround(x, SIGN_Z));
        root.add(post);
      });

      // The wall the moss runs along. A box, and deliberately: it is here to
      // have a foot and a shadow, and a built one would prove nothing more.
      const length = WALL.to - WALL.from;
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(length, WALL.height, WALL.thick),
        STONE,
      );
      wall.position.set(
        (WALL.from + WALL.to) / 2,
        terrain.heightAt(0, WALL.z) + WALL.height / 2,
        WALL.z,
      );
      root.add(markCollidable(wall));

      const wallSign = signPost('moss on the wall');
      wallSign.position.copy(onGround(WALL.to + 2.5, WALL.z + 1.2));
      root.add(wallSign);

      const hollow = signPost('clover hollow');
      hollow.position.copy(onGround(24, 6));
      root.add(hollow);

      const meadow = signPost('plume meadow');
      meadow.position.copy(onGround(-14, -12));
      root.add(meadow);

      const bank = signPost('where cover stops');
      bank.position.copy(onGround(0, -21));
      root.add(bank);

      return root;
    },
  };
}

/** Drops a point onto the terrain. */
function onGround(x: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, terrain.heightAt(x, z), z);
}

/** The showcase end of a portal, for whoever stands a door here. */
export function groundcoverShowcaseDoor(): PortalEnd {
  return {
    zone: ZONE_GROUNDCOVER_SHOWCASE,
    position: onGround(0, DOOR_Z),
    // Facing -Z, into the room, which puts the arrival looking straight down
    // the rank — the same reasoning `galleryDoor` gives.
    yaw: Math.PI,
    material: 'timber',
    seed: 6702,
  };
}

export function groundcoverShowcasePortal(hub: PortalEnd): PortalDefinition {
  return { id: `portal:${ZONE_GROUNDCOVER_SHOWCASE}`, a: hub, b: groundcoverShowcaseDoor() };
}
