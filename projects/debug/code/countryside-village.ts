import * as THREE from 'three';
import { type ZoneDefinition, OUTDOOR_ENVIRONMENT } from '@engine/world/Zone';
import type { PortalEnd } from '@engine/world/Portal';
import type { SoundscapeSpec } from '@engine/audio/Soundscape';
import { Terrain, type Landform } from '@engine/world/terrain';
import type { GroundPatch, CoverPatch, PatchShape } from '@engine/world/ground';
import { Skirt, dilateOutline } from '@engine/world/vista';
import { vistaRing } from '@engine/world/vista-ring';
import { edgeDressing } from '@engine/world/dressing';
import { markCollidable } from '@engine/player/Collider';
import { createRng } from '@engine/art/random';
import type { MeshBuilder } from '@engine/art/types';
// The band past the boundary.
import { vistaHill } from '@engine/art/builders/vista-hill';
import { vistaCrag } from '@engine/art/builders/vista-crag';
import { vistaCopse } from '@engine/art/builders/vista-copse';
import { vistaHamlet } from '@engine/art/builders/vista-hamlet';
import { vistaFieldWall } from '@engine/art/builders/vista-field-wall';
import { vistaRange } from '@engine/art/builders/vista-range';
// Canopy.
import { oak } from '@engine/art/builders/oak';
import { smallOak } from '@engine/art/builders/small-oak';
import { birch } from '@engine/art/builders/birch';
import { smallBirch } from '@engine/art/builders/small-birch';
import { tree } from '@engine/art/builders/tree';
import { smallTree } from '@engine/art/builders/small-tree';
// The storey under it.
import { bush } from '@engine/art/builders/bush';
import { hazel } from '@engine/art/builders/hazel';
import { elder } from '@engine/art/builders/elder';
import { bramble } from '@engine/art/builders/bramble';
import { gorse } from '@engine/art/builders/gorse';
// The floor.
import { smallGrassClump } from '@engine/art/builders/small-grass-clump';
import { largeGrassClump } from '@engine/art/builders/large-grass-clump';
import { fern } from '@engine/art/builders/fern';
import { nettle } from '@engine/art/builders/nettle';
import { moss } from '@engine/art/builders/moss';
import { mushroom } from '@engine/art/builders/mushroom';
import { reeds } from '@engine/art/builders/reeds';
import { sticks } from '@engine/art/builders/sticks';
import { stump } from '@engine/art/builders/stump';
// Flowers.
import { wildflower } from '@engine/art/builders/wildflower';
import { daisy } from '@engine/art/builders/daisy';
import { poppy } from '@engine/art/builders/poppy';
import { cowparsley } from '@engine/art/builders/cowparsley';
import { foxglove } from '@engine/art/builders/foxglove';
import { thistle } from '@engine/art/builders/thistle';
import { sunflower } from '@engine/art/builders/sunflower';
import { lavender } from '@engine/art/builders/lavender';
// Stone.
import { rock } from '@engine/art/builders/rock';
// The settlement.
import { hut } from '@engine/art/builders/hut';
import { doorways, doorwayFront } from '@engine/art/building';
import { hutDoor } from '@engine/art/builders/hut-door';
import { hutTrapdoor } from '@engine/art/builders/hut-trapdoor';
import { fence, FENCE_MAX_SECTIONS, FENCE_SECTION } from '@engine/art/builders/fence';
import { fencePost } from '@engine/art/builders/fence-post';
import {
  stoneWall,
  wallHeight,
  WALL_MAX_SECTIONS,
  WALL_SECTION,
} from '@engine/art/builders/stone-wall';
import {
  stoneWallSquareColumn,
  COLUMN_REACH,
} from '@engine/art/builders/stone-wall-square-column';
import { post } from '@engine/art/builders/post';
import { stoneWallArchway } from '@engine/art/builders/stone-wall-archway';
import { streetlamp } from '@engine/art/builders/streetlamp';
import { signboard, type SignboardOptions } from '@engine/art/builders/signboard';
import { banner, type BannerOptions } from '@engine/art/builders/banner';
import { cistern } from '@engine/art/builders/cistern';
import { trough } from '@engine/art/builders/trough';
import { crate } from '@engine/art/builders/crate';
import { barrel } from '@engine/art/builders/barrel';
import { table } from '@engine/art/builders/table';
import { stool } from '@engine/art/builders/stool';
// Life.
import { bovine } from '@engine/art/builders/bovine';
import { ovine } from '@engine/art/builders/ovine';
import { porcine } from '@engine/art/builders/porcine';
import { poultry } from '@engine/art/builders/poultry';
import { figure } from '@engine/art/builders/figure';
import { forge, FORGE_FIRE_HEIGHT } from '@engine/art/builders/forge';
import { anvil, ANVIL_FACE_HEIGHT } from '@engine/art/builders/anvil';
import { bell, BELL_MOUTH_HEIGHT } from '@engine/art/builders/bell';
import { dog } from '@engine/art/builders/dog';

/**
 * Countryside Village Demo — one cell of Folkville, walled all the way round,
 * with the rest of the country standing past it in the vista band.
 *
 * There is no rim. The boundary is a chain of stone wall, fence and hedge laid
 * end to end, each run backed by an invisible slab, so the ground stays flat to
 * the edge and the horizon belongs to the band rather than to a bank of hills.
 * The only way in or out is the arch on the +Z side, which carries the portal
 * back to the Demo Showcase.
 */

export const ZONE_COUNTRYSIDE = 'countryside-village';

/** The three houses you can go into. Their rooms live in `countryside-homes`. */
export const ZONE_COTTAGE = 'countryside-cottage';
export const ZONE_WORKSHOP = 'countryside-workshop';
export const ZONE_STORE = 'countryside-store';

/** Metres from the middle to the boundary. */
const PLAY_HALF = 23;
/** Ground past it, every metre of which is cover fade. */
const MARGIN = 34;
const HALF = PLAY_HALF + MARGIN;
const SIZE = HALF * 2;

/** Past the walkable cell's far corner, or the haze starts inside the village. */
const FOG_NEAR = 70;
const FOG_FAR = 320;

/** The still band, in metres out from the level's edge. */
const BAND = { inner: 14, outer: 70 };

/**
 * How far the still band reaches, props and all: `BAND.outer` plus the widest
 * half-extent scattered into it. A moving prop may never come inside this.
 */
const STILL_REACH = 99;

/** Where the parallax props stand, and how far out they pose. */
const FRINGE = {
  band: { inner: 160, outer: 180 },
  apparent: [300, 380] as const,
};

/** The ridges past all of it. `band.outer` + reach stays under `fogFar` × 0.9. */
const FAR = {
  band: { inner: 195, outer: 210 },
  apparent: [420, 500] as const,
};

type Point = readonly [number, number];

/**
 * The boundary, corner by corner, from the arch's east jamb round to its west
 * one. `buildBoundary` lays it as two chains meeting on the hedge, so the arch
 * ends are exact and the rounding lands where a hedge can absorb it.
 */
const RING: readonly Point[] = [
  [9, 22],
  [18, 14],
  [23, 1],
  [20, -13],
  [8, -21],
  [-2, -22],
  [-12, -21],
  [-21, -15],
  [-23, 3],
  [-17, 17],
  [-6, 22],
];

/** Where the arch stands. Axis-aligned, so the portal's yaw is a half turn. */
const ARCH_AT: Point = [0, 22];
const ARCH_SEED = 4714;

/**
 * Stretches of the boundary left plain and unbuilt, inside and out, where
 * gateways to the neighbouring cells will go. Nothing solid stands in them.
 */
const RESERVED: readonly (readonly [number, number, number])[] = [
  [21.5, -6, 6],
  [-22, -6, 6],
  [3, -21.5, 6],
];

const LANE: PatchShape = {
  kind: 'path',
  through: [
    [0, 22],
    [0, 12],
    [0, 3],
  ],
  width: 3,
};

/** The paved lanes between the houses. The green is grass and stays grass. */
const STREETS: readonly PatchShape[] = [
  { kind: 'path', through: [[-10, 8], [-3, 4], [9, 9]], width: 2.2 },
  { kind: 'path', through: [[-9, -6], [0, 0], [14, -1]], width: 2.2 },
  { kind: 'path', through: [[2, -10], [0, -2], [0, 3]], width: 2.2 },
];

/** Where the animals stand, and the reeds behind them. */
const PEN: PatchShape = { kind: 'blot', at: [-15, -11], radius: 5 };

const LANDFORMS: readonly Landform[] = [
  // Gentle, and all of it inside the walkable cell: rolling ground out in the
  // margin reads as a low ridge standing in front of the band.
  { kind: 'hill', at: [-9, 7], radius: 18, height: 0.9 },
  { kind: 'hill', at: [16, 12], radius: 12, height: 0.6 },
  { kind: 'basin', at: [11, -13], radius: 15, depth: 0.8 },
  // The shelf the houses stand on. Buildings are rigid and ground is not.
  { kind: 'terrace', at: [0, 2], radius: 15, height: 0.55, blend: 7 },
];

const PATCHES: GroundPatch[] = [
  { kind: 'field', min: [-8, -20], max: [6, -12], material: 'meadow' },
  { kind: 'field', min: [12, -15], max: [21, -6], material: 'crop' },
  { ...LANE, material: 'dirt' },
  ...STREETS.map((street) => ({ ...street, material: 'cobble' as const })),
  { ...PEN, material: 'mire' },
];

/**
 * Walked ground grows nothing. Without this the lane grows weeds and the paving
 * grows moss, which is what a track nobody uses looks like.
 */
const COVER_PATCHES: CoverPatch[] = [
  { ...LANE, cover: 'none', edge: 'hard' },
  ...STREETS.map((street) => ({ ...street, cover: 'none' as const, edge: 'hard' as const })),
];

const terrain = new Terrain({
  size: SIZE,
  resolution: 3,
  landforms: LANDFORMS,
  patches: PATCHES,
  cover: COVER_PATCHES,
  // Both rings sit on the shelf and its blend, where every facet points up and a
  // change of facet size cannot draw a line.
  detail: [
    { at: [0, 2], radius: 20, level: 2 },
    { at: [0, 2], radius: 14, level: 4 },
  ],
  // Full density everywhere inside the boundary, nothing by the mesh's edge.
  edgeFade: { band: MARGIN },
});

/** Exported so the portals can measure the ground. */
export const countrysideTerrain = terrain;

/** Where you arrive from the Demo Showcase, under the arch. */
export const COUNTRYSIDE_GATE = new THREE.Vector3(ARCH_AT[0], 0, ARCH_AT[1]);

const skirt = new Skirt({
  terrain,
  reach: FOG_FAR,
  resolution: 14,
  collar: 8,
  apron: 24,
  // Level with the ground you walk on: see `LANDFORMS`.
  roll: 0,
  flatten: { from: BAND.outer, to: FRINGE.band.inner },
  seed: 7411,
});

/**
 * The two trees the foliage emitters hang on, outside the wall where a treeline
 * would be. A sound comes from a thing, so these are placed and not scattered.
 */
const TREELINE = [
  { at: [-27, -5] as Point, seed: 5101 },
  { at: [26, 17] as Point, seed: 5102 },
];

const SMITHY = { forge: [16, 4], anvil: [14.4, 2.6] } as const;
/** At the edge of the green where the lane comes in — a bell wants to be heard. */
const BELL_AT: Point = [-6, 15];
/** A yard dog between two houses on the west side, not a wandering one. */
const DOG_AT: Point = [-12, 2];
/** The hedge on the west lane, which is the object the `hedge` emitter is. */
const HEDGE_AT: Point = [-14, 9];

/** World position of something standing on the terrain at (x, z). */
function anchor(at: Point, lift: number): [number, number, number] {
  return [at[0], terrain.heightAt(at[0], at[1]) + lift, at[1]];
}

const COUNTRYSIDE_SOUND: SoundscapeSpec = {
  bed: [
    { model: 'wind', id: 'wind', options: { gain: 0.15, tone: 3000 } },
    {
      model: 'rain',
      id: 'rain',
      options: { gain: 0.17, intensity: 0, surface: 'earth', articulation: 0.3 },
    },
  ],
  emitters: [
    {
      model: 'foliage',
      id: 'wood-west',
      at: anchor(TREELINE[0].at, 4),
      options: { density: 240, tone: 0.8, gain: 0.36, articulation: 0.2 },
      refDistance: 3,
      maxDistance: 24,
      rolloff: 1.6,
      reverb: 0.3,
    },
    {
      model: 'foliage',
      id: 'wood-east',
      at: anchor(TREELINE[1].at, 4),
      options: { density: 220, tone: 0.88, gain: 0.34, articulation: 0.22 },
      refDistance: 3,
      maxDistance: 22,
      rolloff: 1.6,
      reverb: 0.3,
    },
    {
      model: 'foliage',
      id: 'hedge',
      at: anchor(HEDGE_AT, 1),
      options: { density: 150, tone: 1.5, gain: 0.24, articulation: 0.34 },
      refDistance: 1.4,
      maxDistance: 13,
      reverb: 0.22,
    },
    {
      model: 'bird',
      id: 'bird-west',
      at: [-24, 6, 2],
      options: { pitch: 2500, interval: 7, gain: 0.07, tone: 2700 },
      refDistance: 5,
      maxDistance: 46,
      rolloff: 1.3,
      reverb: 0.9,
    },
    {
      model: 'bird',
      id: 'bird-south',
      at: [12, 5.5, -26],
      options: { pitch: 3100, interval: 11, gain: 0.055, tone: 3000 },
      refDistance: 5,
      maxDistance: 44,
      rolloff: 1.35,
      reverb: 0.9,
    },
    {
      model: 'fire',
      id: 'forge',
      at: anchor(SMITHY.forge, FORGE_FIRE_HEIGHT),
      options: { gain: 0.5, intensity: 0.85, tone: 1.15, crackle: 0.65, draught: 0.12 },
      refDistance: 2,
      maxDistance: 20,
      rolloff: 1.5,
      reverb: 0.35,
    },
    {
      model: 'friction',
      id: 'gate',
      at: [ARCH_AT[0] + 0.9, 1.7, ARCH_AT[1]],
      // 150 Hz keeps the whole weather-driven speed range clear of the model's
      // low-speed regime, where one high partial takes over on every gust.
      options: {
        motion: 'weather',
        speed: 0.22,
        force: 0.85,
        pitch: 150,
        decay: 1.1,
        bright: 0.2,
        roughness: 0.15,
        gain: 0.3,
      },
      refDistance: 3,
      maxDistance: 40,
      rolloff: 1.4,
      reverb: 0.5,
    },
  ],
  scatter: [
    {
      sound: 'hammer',
      id: 'smith',
      at: anchor(SMITHY.anvil, ANVIL_FACE_HEIGHT),
      spread: [0.7, 0.2, 0.7],
      every: 13,
      force: [0.45, 1],
      options: { gain: 0.5, tone: 0.95, damping: 0.35, bounces: 2 },
      refDistance: 3,
      maxDistance: 52,
      rolloff: 1.1,
      reverb: 0.55,
    },
    {
      sound: 'clatter',
      id: 'yards',
      at: [0, 1, 2],
      spread: [11, 0.5, 10],
      every: 26,
      force: [0.3, 0.85],
      options: { material: 'wood', gain: 0.45, tone: 1.05 },
      refDistance: 2.5,
      maxDistance: 34,
      rolloff: 1.25,
      reverb: 0.4,
    },
    {
      sound: 'animal',
      id: 'cattle',
      at: [-15, 1.1, -11],
      spread: [3.5, 0.2, 3.5],
      every: 44,
      force: [0.5, 0.9],
      voices: 1,
      options: { kind: 'cow', gain: 0.55, tone: 0.97 },
      refDistance: 4,
      maxDistance: 48,
      rolloff: 1.1,
      reverb: 0.5,
    },
    {
      sound: 'animal',
      id: 'sheep',
      at: [-15.5, 0.9, -12],
      spread: [4, 0.2, 4],
      every: 27,
      force: [0.4, 0.85],
      voices: 1,
      options: { kind: 'sheep', gain: 0.42, tone: 1.06 },
      refDistance: 3.5,
      maxDistance: 40,
      rolloff: 1.2,
      reverb: 0.45,
    },
    {
      sound: 'animal',
      id: 'fowl',
      at: [-1, 0.7, 3],
      spread: [7, 0.15, 7],
      every: 16,
      force: [0.3, 0.7],
      voices: 1,
      options: { kind: 'fowl', gain: 0.3, tone: 1 },
      refDistance: 2.5,
      maxDistance: 26,
      rolloff: 1.35,
      reverb: 0.35,
    },
    {
      sound: 'animal',
      id: 'dog',
      at: anchor(DOG_AT, 0.4),
      spread: [2.2, 0.2, 2.2],
      every: 36,
      force: [0.45, 1],
      voices: 1,
      options: { kind: 'dog', gain: 0.5, tone: 0.94 },
      refDistance: 4,
      maxDistance: 50,
      rolloff: 1.15,
      reverb: 0.55,
    },
    {
      sound: 'bell',
      id: 'bell',
      at: anchor(BELL_AT, BELL_MOUTH_HEIGHT),
      spread: [0, 0, 0],
      every: 95,
      rhythm: 'periodic',
      force: [0.8, 1],
      voices: 1,
      options: { hz: 186, decay: 12, gain: 0.34, strokes: 2, interval: 2.6, warble: 1.1 },
      refDistance: 8,
      maxDistance: 70,
      rolloff: 0.9,
      reverb: 1,
    },
  ],
};

export function countrysideZone(): ZoneDefinition {
  return {
    id: ZONE_COUNTRYSIDE,
    // Declaring this is what puts the zone under the world's clock and weather.
    place: { at: [0, 0], altitude: 0 },
    name: 'Countryside Village Demo',
    group: 'countryside',
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      fogNear: FOG_NEAR,
      fogFar: FOG_FAR,
      firstPersonReverb: 0.5,
      soundscape: COUNTRYSIDE_SOUND,
      vibe: 'village 1',
    },
    spawn: { position: onGround(0, 19), yaw: Math.PI },
    floor: -20,
    surfaceAt: (x, z) => terrain.stepAt(x, z),
    // The level's own ground, never the skirt's.
    groundAt: (x, z) => terrain.heightAt(x, z),
    build: buildVillage,
  };
}

/** Drops a point onto the terrain. */
function onGround(x: number, z: number, lift = 0): THREE.Vector3 {
  return new THREE.Vector3(x, terrain.heightAt(x, z) + lift, z);
}

function place(
  parent: THREE.Object3D,
  mesh: THREE.Mesh,
  x: number,
  z: number,
  yaw: number,
  solid = true,
): void {
  mesh.position.copy(onGround(x, z));
  mesh.rotation.y = yaw;
  parent.add(solid ? markCollidable(mesh) : mesh);
}

/** Stands something on the ground and tips it about its foot. */
function lean(
  parent: THREE.Object3D,
  mesh: THREE.Mesh,
  x: number,
  z: number,
  yaw: number,
  tilt: number,
): void {
  mesh.position.copy(onGround(x, z));
  mesh.rotation.set(tilt, yaw, 0, 'YXZ');
  parent.add(markCollidable(mesh));
}

/**
 * Which way a line runs. `fence`, `stone-wall` and the boundary slabs are all
 * built along +X, and `rotateY(yaw)` takes +X to (ux, uz).
 */
function along(from: Point, to: Point): { ux: number; uz: number; length: number; yaw: number } {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const length = Math.hypot(dx, dz);
  return { ux: dx / length, uz: dz / length, length, yaw: Math.atan2(-dz, dx) };
}

/**
 * Lays a builder that tiles along a line, in pieces, and reports where it
 * actually ended — rounding to whole sections moves it, and chaining from the
 * returned point is what keeps the boundary closed.
 */
function laid(
  root: THREE.Group,
  build: (seed: number, sections: number) => THREE.Mesh,
  pitch: number,
  most: number,
  seed: number,
  from: Point,
  to: Point,
): Point {
  const { ux, uz, length, yaw } = along(from, to);
  const total = Math.max(1, Math.round(length / pitch));

  for (let done = 0, piece = 0; done < total; piece++) {
    const take = Math.min(most, total - done);
    const middle = (done + take / 2) * pitch;
    place(root, build(seed + piece, take), from[0] + ux * middle, from[1] + uz * middle, yaw);
    done += take;
  }

  return [from[0] + ux * total * pitch, from[1] + uz * total * pitch];
}

function fenceRun(root: THREE.Group, seed: number, from: Point, to: Point): Point {
  return laid(
    root,
    // One carpentry seed for the whole run, so two pieces meeting on a post are
    // the same fence rather than two butted together.
    (s, n) => fence.build({ seed: s, run: seed, sections: n }),
    FENCE_SECTION,
    FENCE_MAX_SECTIONS,
    seed,
    from,
    to,
  );
}

function wallRun(root: THREE.Group, seed: number, from: Point, to: Point): Point {
  return laid(
    root,
    (s, n) => stoneWall.build({ seed: s, run: seed, sections: n }),
    WALL_SECTION,
    WALL_MAX_SECTIONS,
    seed,
    from,
    to,
  );
}

/** A pier standing on a corner, matched to the wall it finishes and a little proud. */
function pier(root: THREE.Group, seed: number, at: Point, yaw: number): void {
  const stand = wallHeight(createRng(seed)) + 0.3;
  place(root, stoneWallSquareColumn.build({ seed, height: stand }), at[0], at[1], yaw);
}

const BOUNDARY_MATERIAL = new THREE.MeshBasicMaterial();
/** Metres of standing height on the invisible slabs. */
const BOUNDARY_HEIGHT = 3;

/**
 * The half of the boundary that actually stops you. Never drawn, always
 * collided with — three times its standing height and sunk by the same, so it
 * holds over the shelf and the slope without the ground being levelled for it.
 */
function slab(root: THREE.Group, from: Point, to: Point): void {
  const { yaw, length } = along(from, to);
  const x = (from[0] + to[0]) / 2;
  const z = (from[1] + to[1]) / 2;
  // Overlapping its neighbours, so no corner has a seam to squeeze through.
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(length + 0.8, BOUNDARY_HEIGHT * 3, 0.5),
    BOUNDARY_MATERIAL,
  );
  box.position.set(x, terrain.heightAt(x, z) + BOUNDARY_HEIGHT / 2, z);
  // rotateY(yaw) takes the box's +X to the run's direction.
  box.rotation.y = yaw;
  box.visible = false;
  root.add(markCollidable(box));
}

function sign(seed: number, text: string): SignboardOptions {
  return { seed, text };
}

function strung(seed: number, text: string): BannerOptions {
  return { seed, text };
}

/** Shortest distance from a point to a segment, in the XZ plane. */
function toSegment(x: number, z: number, a: Point, b: Point): number {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const lenSq = dx * dx + dz * dz;
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / lenSq));
  return Math.hypot(x - (a[0] + dx * t), z - (a[1] + dz * t));
}

/** The boundary as a closed polygon, for keeping placement off it. */
const RING_CLOSED: readonly Point[] = [ARCH_AT, ...RING];

/** Inside the boundary and at least `inset` metres clear of it. */
function insideRing(x: number, z: number, inset: number): boolean {
  let odd = false;
  for (let i = 0, j = RING_CLOSED.length - 1; i < RING_CLOSED.length; j = i++) {
    const a = RING_CLOSED[i];
    const b = RING_CLOSED[j];
    if (a[1] > z !== b[1] > z && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) {
      odd = !odd;
    }
  }
  if (!odd) return false;
  for (let i = 0, j = RING_CLOSED.length - 1; i < RING_CLOSED.length; j = i++) {
    if (toSegment(x, z, RING_CLOSED[i], RING_CLOSED[j]) < inset) return false;
  }
  return true;
}

/**
 * Scatters a builder over an area, skipping anything too steep, too near the
 * boundary, or too close to where people are. Rejected candidates still consume
 * their draws, so adding an exclusion does not reshuffle what is already placed.
 */
function scatter(
  parent: THREE.Object3D,
  builder: MeshBuilder,
  options: {
    seed: number;
    count: number;
    within: number;
    from?: Point;
    maxSlope?: number;
    minHeight?: number;
    maxHeight?: number;
    /** Circles to stay out of: [x, z, radius]. */
    avoid?: readonly (readonly [number, number, number])[];
    /** Metres of clearance from the boundary. */
    inset?: number;
    scale?: [number, number];
  },
): void {
  const rng = createRng(options.seed);
  const [cx, cz] = options.from ?? [0, 0];
  const maxSlope = options.maxSlope ?? 26;
  const avoid = options.avoid ?? [];
  const inset = options.inset ?? 2;
  const solid = builder.solid !== false;

  for (let i = 0; i < options.count; i++) {
    // Square-rooted radius: uniform in radius is not uniform in area.
    const angle = rng.range(0, Math.PI * 2);
    const radius = Math.sqrt(rng()) * options.within;
    const x = cx + Math.cos(angle) * radius;
    const z = cz + Math.sin(angle) * radius;
    const yaw = rng.range(0, Math.PI * 2);
    const size = options.scale ? rng.range(options.scale[0], options.scale[1]) : 1;
    const seed = rng.int(1, 1_000_000);

    if (!insideRing(x, z, inset)) continue;
    if (terrain.slopeAt(x, z) > maxSlope) continue;

    const height = terrain.heightAt(x, z);
    if (options.minHeight !== undefined && height < options.minHeight) continue;
    if (options.maxHeight !== undefined && height > options.maxHeight) continue;

    let blocked = false;
    for (const [ax, az, ar] of avoid) {
      if (Math.hypot(x - ax, z - az) < ar) {
        blocked = true;
        break;
      }
    }
    if (blocked) continue;

    place(parent, builder.build({ seed, scale: size }), x, z, yaw, solid);
  }
}

/**
 * Where the houses stand. The streets run to these coordinates, so moving a
 * house means moving its street. `interior` marks the three you can go into.
 */
interface House {
  readonly at: Point;
  readonly seed: number;
  readonly interior?: string;
}

const HOUSES: readonly House[] = [
  { at: [-10, 8], seed: 700, interior: ZONE_COTTAGE },
  { at: [9, 9], seed: 962, interior: ZONE_WORKSHOP },
  { at: [-9, -6], seed: 1486, interior: ZONE_STORE },
  { at: [2, -10], seed: 831 },
  { at: [14, -1], seed: 1093 },
];

/** The middle of it. Everything faces this. */
const GREEN: Point = [0, 2];

/** How far a portal door stands out: the hut paints a dark panel a coplanar door z-fights. */
const DOOR_PROUD = 0.07;

const UP = new THREE.Vector3(0, 1, 0);

function houseYaw(house: House): number {
  return Math.atan2(GREEN[0] - house.at[0], GREEN[1] - house.at[1]);
}

/**
 * Where the portal door in a house's doorway stands, in world space. Measured
 * off a built hut rather than computed: the doorway's offset is rolled from the
 * seed. The mesh is thrown away — `buildSettlement` builds its own from it.
 */
function houseDoorEnd(house: House): PortalEnd {
  const mesh = hut.build({ seed: house.seed });
  const doorway = doorways(mesh)[0];
  mesh.geometry.dispose();

  const yaw = houseYaw(house);
  const stand = doorwayFront(doorway, DOOR_PROUD);
  const offset = new THREE.Vector3(stand.x, 0, stand.z).applyAxisAngle(UP, yaw);
  const x = house.at[0] + offset.x;
  const z = house.at[1] + offset.z;

  return {
    zone: ZONE_COUNTRYSIDE,
    position: new THREE.Vector3(x, terrain.heightAt(x, z), z),
    // The house's own turn plus which of its walls the doorway is in.
    yaw: yaw + doorway.yaw,
    material: 'timber',
    seed: 7100 + house.seed,
  };
}

/**
 * The exterior end of the door into each enterable house, by zone id. Read by
 * `countryside-homes`, which owns the rooms behind them.
 */
export const HOUSE_DOORS: ReadonlyMap<string, PortalEnd> = new Map(
  HOUSES.filter((house) => house.interior).map((house) => [
    house.interior as string,
    houseDoorEnd(house),
  ]),
);

/** The ground you land on stepping out of a house. Nothing may stand here. */
const DOOR_APPROACHES: readonly (readonly [number, number, number])[] = [
  ...HOUSE_DOORS.values(),
].map((end) => [
  end.position.x + Math.sin(end.yaw) * 2.2,
  end.position.z + Math.cos(end.yaw) * 2.2,
  2.4,
]);

/** Kept clear of anything solid: this is the ground creatures walk on. */
const KEEP_CLEAR: readonly (readonly [number, number, number])[] = [
  [GREEN[0], GREEN[1], 12],
  [ARCH_AT[0], ARCH_AT[1], 7],
  // The stretch of lane between the green's reach and the arch's.
  [0, 16, 4],
  [-15, -11, 8],
  // The buildings and the yards round them.
  ...HOUSES.map(({ at }) => [at[0], at[1], 5.5] as const),
  [SMITHY.forge[0], SMITHY.forge[1], 5],
  [BELL_AT[0], BELL_AT[1], 3],
  // The garden inside its fence.
  [-13.5, 13, 5],
  ...RESERVED,
  ...DOOR_APPROACHES,
];

/**
 * Where ground cover may not grow — much smaller than `KEEP_CLEAR`. A daisy is
 * not in the collider, so a wide exclusion only costs the village its grass.
 */
const KEEP_CLEAR_SOFT: readonly (readonly [number, number, number])[] = [
  [ARCH_AT[0], ARCH_AT[1], 5],
  ...HOUSES.map(({ at }) => [at[0], at[1], 3.2] as const),
  ...DOOR_APPROACHES,
];

function buildVillage(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'CountrysideVillage';
  root.add(markCollidable(terrain.build()));
  root.add(skirt.build());

  buildBoundary(root);
  buildSettlement(root);
  buildCountry(root);
  root.add(buildRing());
  root.add(buildDressing());

  return root;
}

type Edge = { readonly to: Point; readonly kind: 'wall' | 'fence' };

/** East of the arch, clockwise as far as the hedge. */
const EAST_EDGES: readonly Edge[] = [
  { to: RING[0], kind: 'wall' },
  { to: RING[1], kind: 'wall' },
  { to: RING[2], kind: 'wall' },
  { to: RING[3], kind: 'fence' },
  { to: RING[4], kind: 'fence' },
  { to: RING[5], kind: 'fence' },
];

/** West of the arch, anticlockwise as far as the hedge. */
const WEST_EDGES: readonly Edge[] = [
  { to: RING[10], kind: 'wall' },
  { to: RING[9], kind: 'wall' },
  { to: RING[8], kind: 'wall' },
  { to: RING[7], kind: 'fence' },
  { to: RING[6], kind: 'fence' },
];

/**
 * The arch's half width, so the wall butts against the jamb instead of into the
 * opening. Rolled from the seed, so it cannot be known without a mesh.
 */
const ARCH_HALF = (() => {
  const mesh = stoneWallArchway.build({ seed: ARCH_SEED });
  mesh.geometry.computeBoundingBox();
  const half = mesh.geometry.boundingBox!.max.x;
  mesh.geometry.dispose();
  return half;
})();

/**
 * The boundary: two chains laid outward from the arch's jambs and closed by a
 * hedge between their far ends.
 *
 * Both chains start at the arch because a run's length rounds to whole sections
 * and the end moves — laid the other way, the rounding lands in the opening.
 * The hedge is placed shrub by shrub over whatever gap the chains leave, so it
 * closes exactly however far apart they finish.
 */
function buildBoundary(root: THREE.Group): void {
  // rotateY(π) turns the archway, built facing +Z, to face -Z: the doorway the
  // portal stands its door in looks back out of the village, and the run
  // through it is axis-aligned so the portal's own yaw is a half turn too.
  place(root, stoneWallArchway.build({ seed: ARCH_SEED }), ARCH_AT[0], ARCH_AT[1], Math.PI);
  slab(root, [ARCH_AT[0] - ARCH_HALF, ARCH_AT[1] + 0.9], [ARCH_AT[0] + ARCH_HALF, ARCH_AT[1] + 0.9]);

  const east = layChain(root, 6200, [ARCH_AT[0] + ARCH_HALF, ARCH_AT[1]], EAST_EDGES);
  const west = layChain(root, 6400, [ARCH_AT[0] - ARCH_HALF, ARCH_AT[1]], WEST_EDGES);
  layHedge(root, 6600, east, west);
}

/**
 * Lays one chain of runs, cornering between them, and returns where it stopped.
 *
 * A pier wherever stone is one of the two sides, a fence post where both are
 * timber. The pier stands `COLUMN_REACH` past the run that arrives and the run
 * that leaves starts the same distance the other side of it, so the masonry
 * butts against the pier's faces instead of into its middle. A post is thin
 * enough to stand on the corner itself, which is where a fence wants one.
 */
function layChain(root: THREE.Group, seed: number, start: Point, edges: readonly Edge[]): Point {
  let at = start;
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    const run = along(at, edge.to);
    const end =
      edge.kind === 'wall'
        ? wallRun(root, seed + i * 10, at, edge.to)
        : fenceRun(root, seed + i * 10, at, edge.to);
    slab(root, at, end);

    const next = edges[i + 1];
    if (!next) return end;

    if (edge.kind === 'wall' || next.kind === 'wall') {
      const centre: Point = [end[0] + run.ux * COLUMN_REACH, end[1] + run.uz * COLUMN_REACH];
      pier(root, seed + i * 10 + 7, centre, run.yaw);
      const out = along(centre, next.to);
      at = [centre[0] + out.ux * COLUMN_REACH, centre[1] + out.uz * COLUMN_REACH];
    } else {
      place(root, fencePost.build({ seed: seed + i * 10 + 7, run: seed + i * 10 }), end[0], end[1], run.yaw);
      at = end;
    }
  }
  return at;
}

/** Metres between hedge shrubs. Tight enough that the line reads as one thing. */
const HEDGE_PITCH = 1.5;

/**
 * The closing stretch, and the only run that can be any length: the two chains
 * finish where their rounding puts them and this divides the gap evenly.
 */
function layHedge(root: THREE.Group, seed: number, from: Point, to: Point): void {
  const { ux, uz, length, yaw } = along(from, to);
  const gaps = Math.max(1, Math.round(length / HEDGE_PITCH));

  // The terminal posts the two fence runs each leave off, and the shrubs set
  // between them rather than on them.
  place(root, fencePost.build({ seed, run: seed }), from[0], from[1], yaw);
  place(root, fencePost.build({ seed: seed + 1, run: seed }), to[0], to[1], yaw);

  for (let i = 0; i < gaps; i++) {
    const d = ((i + 0.5) / gaps) * length;
    place(root, hazel.build({ seed: seed + 10 + i }), from[0] + ux * d, from[1] + uz * d, i * 1.3);
  }
  slab(root, from, to);
}

/** The houses, and everything standing between them. */
function buildSettlement(root: THREE.Group): void {
  // The village's name, strung across the lane. Built facing +Z, and the lane
  // is walked in the -Z direction, so yaw 0 turns it to meet whoever arrives.
  place(root, banner.build(strung(5401, 'FOLKVILLE')), 0, 13.5, 0);

  place(root, post.build({ seed: 5221 }), 1.6, 18.4, 0.4);
  place(root, post.build({ seed: 5222 }), -1.7, 16.2, 2.1);

  for (const house of HOUSES) {
    place(root, hut.build({ seed: house.seed }), house.at[0], house.at[1], houseYaw(house));
  }

  // --- the well ------------------------------------------------------------
  place(root, cistern.build({ seed: 5301 }), -3.6, 11.4, 0.3);
  place(root, trough.build({ seed: 5302 }), -5, 12.3, 1.2);

  // --- the hedge on the west lane ------------------------------------------
  const HEDGE = [
    [-0.8, -1.4],
    [-0.2, -0.1],
    [0.5, 1.2],
    [1.3, 2.4],
  ] as const;
  HEDGE.forEach(([dx, dz], i) => {
    place(root, hazel.build({ seed: 5310 + i }), HEDGE_AT[0] + dx, HEDGE_AT[1] + dz, i * 1.3);
  });

  // --- the market end of the green -----------------------------------------
  place(root, table.build({ seed: 5402 }), 3.4, 8.4, 0.3);
  place(root, stool.build({ seed: 5403 }), 4.4, 7.8, 1.1);
  place(root, stool.build({ seed: 5404 }), 2.6, 7.6, 2.4);
  place(root, crate.build({ seed: 5405 }), 3.0, 10.0, 0.7);

  // --- lit lanes -----------------------------------------------------------
  // Two, and no more: each carries a `PointLight`.
  place(root, streetlamp.build({ seed: 5501 }), 5.2, 11.2, 1.9);
  place(root, streetlamp.build({ seed: 5502 }), -5.2, 0.4, -0.7);

  // --- yards ---------------------------------------------------------------
  // Against the walls of the houses with no door you can use.
  place(root, crate.build({ seed: 5601 }), 4.2, -13.0, 0.5);
  place(root, barrel.build({ seed: 5602 }), 2.6, -13.6, 0);
  place(root, barrel.build({ seed: 5603 }), 5.4, -12.0, 0.9);
  place(root, barrel.build({ seed: 5604 }), 17.2, -3.2, 0.2);
  place(root, crate.build({ seed: 5605 }), 16.4, -4.4, 1.3);
  place(root, barrel.build({ seed: 5608 }), -12.6, 5.4, 0.6);

  place(root, hutTrapdoor.build({ seed: 5610 }), 17.4, 1.2, 0.8);
  // A spare door propped against the west house, made and not yet hung.
  lean(root, hutDoor.build({ seed: 5611 }), -12.4, -7.6, 2.5, 0.24);

  // --- the garden ----------------------------------------------------------
  // Fenced on the two sides facing open ground; the cottage is the other two.
  const gardenCorner = fenceRun(root, 5701, [-15.6, 11.6], [-15.6, 14.6]);
  const gardenEnd = fenceRun(root, 5705, gardenCorner, [-11.4, 14.6]);
  place(root, fencePost.build({ seed: 5709, run: 5705 }), gardenEnd[0], gardenEnd[1], 0);
  place(root, sunflower.build({ seed: 5711 }), -14.2, 14.1, 0.4, false);
  place(root, sunflower.build({ seed: 5712 }), -13.4, 13.8, 1.9, false);
  place(root, sunflower.build({ seed: 5713 }), -15, 13.9, 3.1, false);
  // One. Lavender is fourteen thousand triangles for a plant the size of a boot,
  // so it goes where the lane passes within a stride of it and nowhere else.
  place(root, lavender.build({ seed: 5714 }), -12.4, 13.7, 0.7, false);

  // --- the pen -------------------------------------------------------------
  const penCorner = fenceRun(root, 400, [-19, -6], [-19, -14]);
  const penEnd = fenceRun(root, 420, penCorner, [-11, -14]);
  place(root, fencePost.build({ seed: 429, run: 420 }), penEnd[0], penEnd[1], 0);
  place(root, trough.build({ seed: 91 }), -12.6, -13, 0.4);
  scatter(root, bovine, { seed: 8801, count: 2, within: 3.5, from: [-15, -11], maxSlope: 20 });
  scatter(root, ovine, { seed: 8802, count: 4, within: 4, from: [-15, -11], maxSlope: 20 });
  scatter(root, porcine, { seed: 8803, count: 2, within: 3.5, from: [-16, -9], maxSlope: 20 });
  scatter(root, poultry, { seed: 8804, count: 6, within: 7, from: [-1, 3], maxSlope: 18 });

  // --- the things that make the noise --------------------------------------
  // Placed from the numbers the emitters are derived from, so neither can move
  // without the other. The forge faces the green, the anvil turns across it.
  place(root, forge.build({ seed: 5901 }), SMITHY.forge[0], SMITHY.forge[1], Math.PI);
  place(root, anvil.build({ seed: 5902 }), SMITHY.anvil[0], SMITHY.anvil[1], 0.6);
  place(root, signboard.build(sign(5903, 'SMITHY')), 13.4, 5.6, -1.5);
  place(root, bell.build({ seed: 5904 }), BELL_AT[0], BELL_AT[1], -0.5);
  place(root, dog.build({ seed: 5905, roam: 2.4 }), DOG_AT[0], DOG_AT[1], 1.9);

  // --- the people ----------------------------------------------------------
  place(root, figure.build({ seed: 3301, roam: 5 }), 3.4, 0.6, 2.2);
  place(root, figure.build({ seed: 3302, roam: 5 }), -3.2, 3.6, 1.1);
  place(root, figure.build({ seed: 3303, roam: 4 }), 6.4, -3.4, -0.8);
  place(root, figure.build({ seed: 3304, roam: 3 }), -5.4, 12.9, -1.1);
  // The one who is not from here.
  place(root, figure.build({ seed: 3311, roam: 2.5, folk: 'city' }), 2.6, 17.4, 3);
}

/** The country the village stands in, ordered by storey. */
function buildCountry(root: THREE.Group): void {
  // The two trees the foliage emitters hang on. Outside the boundary, so they
  // are placed rather than scattered — `scatter` will not go there.
  for (const { at, seed } of TREELINE) {
    place(root, oak.build({ seed, scale: 1.1 }), at[0], at[1], seed * 0.001);
  }

  // --- canopy --------------------------------------------------------------
  // Inside a cell this size a wood is a handful of trees, not a stand.
  scatter(root, oak, { seed: 5001, count: 3, within: 20, from: [-12, -4], maxSlope: 24, avoid: KEEP_CLEAR, scale: [0.85, 1.1] });
  scatter(root, smallOak, { seed: 5002, count: 4, within: 22, from: [-10, -6], maxSlope: 26, avoid: KEEP_CLEAR, scale: [0.8, 1.2] });
  scatter(root, birch, { seed: 5003, count: 4, within: 22, from: [10, 10], maxSlope: 28, avoid: KEEP_CLEAR, scale: [0.8, 1.15] });
  scatter(root, smallBirch, { seed: 5004, count: 5, within: 22, from: [10, 8], maxSlope: 30, avoid: KEEP_CLEAR, scale: [0.8, 1.25] });
  // A hundred and thirty triangles against a birch's three thousand.
  scatter(root, tree, { seed: 5007, count: 7, within: 22, maxSlope: 28, avoid: KEEP_CLEAR, scale: [0.8, 1.25] });
  scatter(root, smallTree, { seed: 5008, count: 6, within: 22, maxSlope: 30, avoid: KEEP_CLEAR, scale: [0.8, 1.2] });

  // --- the storey under it -------------------------------------------------
  scatter(root, bush, { seed: 5011, count: 16, within: 22, maxSlope: 30, avoid: KEEP_CLEAR });
  scatter(root, hazel, { seed: 5012, count: 4, within: 16, from: [-12, -8], maxSlope: 28, avoid: KEEP_CLEAR });
  scatter(root, elder, { seed: 5013, count: 4, within: 16, from: [8, -12], maxSlope: 28, avoid: KEEP_CLEAR });
  scatter(root, gorse, { seed: 5014, count: 5, within: 22, maxSlope: 34, avoid: KEEP_CLEAR });
  scatter(root, bramble, { seed: 5015, count: 7, within: 22, maxSlope: 30, avoid: KEEP_CLEAR_SOFT });

  // --- what used to be trees -----------------------------------------------
  scatter(root, stump, { seed: 5021, count: 4, within: 20, maxSlope: 22, avoid: KEEP_CLEAR });
  scatter(root, sticks, { seed: 5023, count: 9, within: 22, maxSlope: 28, avoid: KEEP_CLEAR_SOFT });

  // --- the floor -----------------------------------------------------------
  // The large clump covers ten times the ground of the small one and costs
  // twenty times the triangles, so the ratio runs the other way.
  scatter(root, largeGrassClump, { seed: 5031, count: 5, within: 22, maxSlope: 24, avoid: KEEP_CLEAR_SOFT });
  scatter(root, smallGrassClump, { seed: 5032, count: 55, within: 22, maxSlope: 28, avoid: KEEP_CLEAR_SOFT });
  scatter(root, fern, { seed: 5033, count: 7, within: 14, from: [-14, -4], maxSlope: 28, avoid: KEEP_CLEAR_SOFT });
  scatter(root, nettle, { seed: 5034, count: 8, within: 8, from: [-15, -11], maxSlope: 26, avoid: KEEP_CLEAR_SOFT });
  scatter(root, moss, { seed: 5035, count: 10, within: 22, maxSlope: 34, avoid: KEEP_CLEAR_SOFT });
  scatter(root, mushroom, { seed: 5036, count: 12, within: 22, maxSlope: 22, avoid: KEEP_CLEAR_SOFT });
  // Reeds in the wet ground and nowhere else — see `PEN`.
  scatter(root, reeds, { seed: 5038, count: 5, within: 4, from: [-17, -13], maxSlope: 22 });

  // --- flowers -------------------------------------------------------------
  // Each in the ground it belongs to: poppies in the crop, thistle on the rough
  // ground nobody works.
  scatter(root, daisy, { seed: 5041, count: 6, within: 8, from: [-2, -16], maxSlope: 22, avoid: KEEP_CLEAR_SOFT });
  scatter(root, wildflower, { seed: 5042, count: 6, within: 8, from: [-16, 3], maxSlope: 24, avoid: KEEP_CLEAR_SOFT });
  scatter(root, poppy, { seed: 5043, count: 9, within: 5, from: [17, -9], maxSlope: 22, avoid: KEEP_CLEAR_SOFT });
  scatter(root, cowparsley, { seed: 5044, count: 5, within: 8, from: [-8, 16], maxSlope: 26, avoid: KEEP_CLEAR_SOFT });
  scatter(root, foxglove, { seed: 5046, count: 4, within: 12, from: [10, -14], maxSlope: 28, avoid: KEEP_CLEAR_SOFT });
  scatter(root, thistle, { seed: 5047, count: 6, within: 22, maxSlope: 30, avoid: KEEP_CLEAR_SOFT });

  // --- stone ---------------------------------------------------------------
  scatter(root, rock, { seed: 6001, count: 18, within: 22, maxSlope: 40, scale: [0.7, 1.4], avoid: KEEP_CLEAR });
}

/**
 * The band past the boundary. The hamlet is placed rather than scattered: it is
 * the rest of Folkville, and which way you look to see it is composition.
 */
function buildRing(): THREE.Group {
  return vistaRing({
    skirt,
    seed: 9140,
    band: BAND,
    keepOut: dilateOutline(skirt.outline, STILL_REACH),
    place: [
      // Straight out over the arch, so it is what the lane points at. Placed in
      // world coordinates: the level's edge is at 57, and this stands 38 m of
      // band beyond it.
      { builder: vistaHamlet, at: [0, 95] as const, scale: 1.2, seed: 5601 },
    ],
    scatter: [
      // Copses first and most of them: a treeline is what fills a horizon.
      { builder: vistaCopse, count: 5, band: { inner: BAND.inner, outer: 55 }, scale: [0.9, 1.3], spacing: 18 },
      { builder: vistaHill, count: 4, band: { inner: 30, outer: BAND.outer }, scale: [0.8, 1.3], spacing: 28 },
      // Walls, because a landscape with no boundaries in it is scenery.
      { builder: vistaFieldWall, count: 3, band: { inner: BAND.inner, outer: 45 }, scale: [0.9, 1.3], spacing: 26 },
      { builder: vistaCrag, count: 1, band: { inner: 30, outer: BAND.outer }, scale: [1, 1.6], spacing: 30 },
      // --- the parallax fringe ---------------------------------------------
      { builder: vistaHill, count: 4, band: FRINGE.band, apparent: FRINGE.apparent, scale: [1.5, 2], spacing: 34 },
      { builder: vistaCrag, count: 1, band: FRINGE.band, apparent: FRINGE.apparent, scale: [2, 2.5], spacing: 36 },
      // --- and the far ridge -------------------------------------------------
      { builder: vistaRange, count: 1, band: FAR.band, apparent: FAR.apparent, scale: [0.85, 1], spacing: 80 },
    ],
  });
}

/**
 * What stands along the boundary, straddling it: half kit you can walk up to
 * and half mass on the far side. `-MARGIN` is where the boundary is, in
 * distance-from-the-outline terms.
 */
function buildDressing(): THREE.Group {
  return edgeDressing({
    terrain,
    skirt,
    seed: 6180,
    band: { inner: -MARGIN - 4, outer: -MARGIN + 16 },
    solidWithin: -MARGIN,
    kinds: [
      {
        builder: gorse,
        count: 3,
        band: { inner: -MARGIN - 3, outer: -MARGIN },
        clump: [2, 3],
        huddle: 3.2,
        scale: [0.9, 1.3],
      },
      {
        builder: bramble,
        count: 3,
        band: { inner: -MARGIN - 3, outer: -MARGIN + 1 },
        clump: [2, 3],
        huddle: 2.8,
        scale: [0.9, 1.2],
      },
      // Bush is 78 triangles and rock is 55, so this is where the massing is.
      {
        builder: bush,
        count: 8,
        band: { inner: -MARGIN - 1, outer: -MARGIN + 15 },
        clump: [3, 6],
        huddle: 3,
        scale: [1, 1.7],
      },
      {
        builder: rock,
        count: 6,
        band: { inner: -MARGIN - 2, outer: -MARGIN + 15 },
        clump: [3, 5],
        huddle: 2.6,
        scale: [1.2, 2.6],
      },
    ],
  });
}
