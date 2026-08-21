import * as THREE from 'three';
import { type ZoneDefinition, OUTDOOR_ENVIRONMENT } from '../world/Zone';
import type { PortalEnd } from '../world/Portal';
import type { SoundscapeSpec } from '../audio/Soundscape';
import { Terrain, type Landform } from '../world/terrain';
import type { GroundPatch } from '../world/ground';
import { markCollidable } from '../player/Collider';
import { createRng } from '../art/random';
import type { MeshBuilder } from '../art/types';
// Canopy, by species.
import { oak } from '../art/builders/oak';
import { smallOak } from '../art/builders/small-oak';
import { birch } from '../art/builders/birch';
import { smallBirch } from '../art/builders/small-birch';
import { spruce } from '../art/builders/spruce';
import { smallSpruce } from '../art/builders/small-spruce';
import { tree } from '../art/builders/tree';
import { smallTree } from '../art/builders/small-tree';
// The storey under it.
import { bush } from '../art/builders/bush';
import { hazel } from '../art/builders/hazel';
import { elder } from '../art/builders/elder';
import { gorse } from '../art/builders/gorse';
import { bramble } from '../art/builders/bramble';
// What used to be trees.
import { stump } from '../art/builders/stump';
import { fallenLog } from '../art/builders/fallen-log';
import { sticks } from '../art/builders/sticks';
// The floor.
import { smallGrassClump } from '../art/builders/small-grass-clump';
import { largeGrassClump } from '../art/builders/large-grass-clump';
import { fern } from '../art/builders/fern';
import { nettle } from '../art/builders/nettle';
import { moss } from '../art/builders/moss';
import { mushroom } from '../art/builders/mushroom';
import { pinecone } from '../art/builders/pinecone';
import { reeds } from '../art/builders/reeds';
// Flowers.
import { wildflower } from '../art/builders/wildflower';
import { daisy } from '../art/builders/daisy';
import { poppy } from '../art/builders/poppy';
import { cowparsley } from '../art/builders/cowparsley';
import { bluebell } from '../art/builders/bluebell';
import { foxglove } from '../art/builders/foxglove';
import { thistle } from '../art/builders/thistle';
import { lavender } from '../art/builders/lavender';
import { sunflower } from '../art/builders/sunflower';
// Stone.
import { rock } from '../art/builders/rock';
import { cairn } from '../art/builders/cairn';
// The settlement.
import { hut } from '../art/builders/hut';
import { doorways, doorwayFront } from '../art/building';
import { hutDoor } from '../art/builders/hut-door';
import { hutTrapdoor } from '../art/builders/hut-trapdoor';
import { fence, FENCE_MAX_SECTIONS, FENCE_SECTION } from '../art/builders/fence';
import { fencePost } from '../art/builders/fence-post';
import {
  stoneWall,
  wallHeight,
  WALL_MAX_SECTIONS,
  WALL_SECTION,
} from '../art/builders/stone-wall';
import {
  stoneWallSquareColumn,
  COLUMN_REACH,
} from '../art/builders/stone-wall-square-column';
import { post } from '../art/builders/post';
import { stoneWallArchway } from '../art/builders/stone-wall-archway';
import { streetlamp } from '../art/builders/streetlamp';
import { signboard, type SignboardOptions } from '../art/builders/signboard';
import { banner, type BannerOptions } from '../art/builders/banner';
import { cistern } from '../art/builders/cistern';
import { trough } from '../art/builders/trough';
import { crate } from '../art/builders/crate';
import { barrel } from '../art/builders/barrel';
import { table } from '../art/builders/table';
import { stool } from '../art/builders/stool';
// Life.
import { bovine } from '../art/builders/bovine';
import { ovine } from '../art/builders/ovine';
import { porcine } from '../art/builders/porcine';
import { poultry } from '../art/builders/poultry';
import { figure } from '../art/builders/figure';
import { forge, FORGE_FIRE_HEIGHT } from '../art/builders/forge';
import { anvil, ANVIL_FACE_HEIGHT } from '../art/builders/anvil';
import { bell, BELL_MOUTH_HEIGHT } from '../art/builders/bell';
import { dog } from '../art/builders/dog';

/**
 * Countryside Exterior Demo — the whole outdoor half of the countryside kit,
 * standing in one place instead of in a row.
 *
 * A bounded outdoor bowl: hills around the edge that turn you back, a valley
 * floor with a settlement in it, a ridge to climb, a plateau to look down from.
 * Everything is placed against the heightfield rather than at y = 0, which is
 * the whole reason this exists — a gallery asks whether a row of props hangs
 * together, and this asks whether the kit makes a place.
 *
 * The green and the lanes are kept clear of anything solid: this is the level
 * creatures get tested in and they need somewhere to walk that is not an
 * obstacle course. Ground cover is a different question — see `KEEP_CLEAR_SOFT`.
 */

export const ZONE_COUNTRYSIDE = 'countryside-exterior';

/** The three houses you can go into. Their rooms live in `countryside-homes`. */
export const ZONE_COTTAGE = 'countryside-cottage';
export const ZONE_WORKSHOP = 'countryside-workshop';
export const ZONE_STORE = 'countryside-store';

/**
 * Metres across. A village is a place where the next house is a few paces away
 * and you can see the whole of it at once, so everything here is scaled to
 * that: the map, the hills, and above all the gaps between the buildings.
 */
const SIZE = 96;
const HALF = SIZE / 2;

/**
 * The shape of the place. Read in order: the bowl first, then the things
 * standing in it. The rim is last because it has to win at the edges — a hill
 * placed near the boundary would flatten the wall out and open a way out.
 */
const LANDFORMS: Landform[] = [
  // A shallow dish, so the ground reads as a valley floor rather than a table.
  { kind: 'basin', at: [0, 0], radius: 34, depth: 3 },

  // Rolling ground east and north, all gentle enough to walk straight over.
  { kind: 'hill', at: [18, -12], radius: 12, height: 4.5, falloff: 1.3 },
  { kind: 'hill', at: [20, 8], radius: 10, height: 3.5, falloff: 1.4 },
  { kind: 'hill', at: [8, 20], radius: 11, height: 3, falloff: 1.5 },

  // The whole settlement stands on one level shelf. Buildings are rigid and
  // ground is not: a hut on a one-in-twenty slope buries one corner and floats
  // the opposite one, and fences and troughs are no different.
  //
  // Centred between the green and the paddock and wide enough to hold both,
  // eased back into the valley over nine metres so it reads as a terrace rather
  // than a disc somebody stamped out.
  { kind: 'terrace', at: [-6, 1], radius: 26, height: -3, blend: 9 },

  // A second, small shelf under the gateway. The arch is as rigid as a house —
  // two stone piers a couple of metres apart — and the outer slope of the shelf
  // above would bury one and lift the other.
  //
  // Applied after the big shelf so it wins locally; the lane between the two
  // falls about three metres over twenty, which is a gentle walk down.
  { kind: 'terrace', at: [0, 34], radius: 6, height: -0.4, blend: 7 },

  // The wall of hills. A smootherstep's steepest gradient is
  // 1.875 × height / inset, and the wall is kept short and steep rather than
  // tall and long: 14 m of rise over 13 m reads as a bank at the end of a
  // field, where 58 m looks like the rim of a crater. Steeper rather than
  // taller is also what buys back the slope the grid resolution smears away.
  //
  // Landforms *sum*, so nothing above may reach into this band or it lifts the
  // foot of the wall into a ramp. Everything is kept inside ±32 m for that.
  { kind: 'rim', inset: 13, height: 14 },
];

/**
 * Ground cover, painted in layers: fields first, then the lanes across them,
 * then the yards and hollows where the lanes end.
 */
const PATCHES: GroundPatch[] = [
  // Worked ground on the outskirts.
  { kind: 'field', min: [16, -6], max: [30, 8], material: 'crop' },
  { kind: 'field', min: [-30, 14], max: [-16, 28], material: 'meadow' },
  { kind: 'blot', at: [-24, -6], radius: 11, material: 'meadow' },

  // The lane in from the gate.
  { kind: 'path', through: [[0, 34], [0, 22], [0, 15]], width: 3, material: 'dirt' },
  // And out the other side, to the fields.
  { kind: 'path', through: [[4, 2], [14, -2], [24, -2]], width: 2.4, material: 'dirt' },

  // Cobble is the street, not a plaza. Streets are narrow, they run *between*
  // buildings, and the paving exists because that is where people walk. Four
  // lanes crossing at the green pave the junction for free where they overlap.
  { kind: 'path', through: [[-9, 13], [0, 8], [9, 1]], width: 2.2, material: 'cobble' },
  { kind: 'path', through: [[-2, 17], [0, 8], [1, -2]], width: 2.2, material: 'cobble' },
  { kind: 'path', through: [[7, 15], [0, 8], [-7, 0]], width: 2.2, material: 'cobble' },
  { kind: 'path', through: [[11, 8], [0, 8], [-12, 6]], width: 2.2, material: 'cobble' },

  // The paddock corner, churned up where the animals stand.
  { kind: 'blot', at: [-16, -10], radius: 7, material: 'mire' },
  // A rushy hollow west of it, for the reeds to stand in. There is no water
  // here; wet ground is the half of a waterline you can hear underfoot.
  { kind: 'blot', at: [-25, -19], radius: 5, material: 'mire' },
];

const terrain = new Terrain({
  size: SIZE,
  // Three metres, not four. The rim's steep band is only a dozen metres wide
  // and a coarse grid smears it: the player collides with the *triangles*, not
  // with the underlying function, so a wall that is mathematically 59° comes
  // out as a climbable 48° ramp once cut into four-metre quads.
  resolution: 3,
  landforms: LANDFORMS,
  patches: PATCHES,
  // Fine where people walk, coarse where they only look. The streets are 2.2 m
  // wide, barely one quad at the base grid, so their edges would run along
  // whatever the grid happened to do. Quartering the cells over the settlement
  // puts three quads across a street, with a half-step ring so the change in
  // density is not itself a visible line.
  //
  // **Every ring is kept inside flat ground.** A change of facet size on a
  // steep slope draws a hard shading line that looks like a crack in the mesh,
  // so these stop short of the terrace's edge and the gate's ring sits inside
  // its own small shelf.
  detail: [
    { at: [-6, 1], radius: 26, level: 2 },
    { at: [-6, 1], radius: 20, level: 4 },
    { at: [0, 34], radius: 5, level: 3 },
  ],
});

/** Exported so the portals and the checks can measure the ground. */
export const countrysideTerrain = terrain;

/** Where you arrive from the Proving Ground, on the lane at the north end. */
export const COUNTRYSIDE_GATE = new THREE.Vector3(0, 0, 34);

/**
 * The things in this zone that make a noise, and where they stand.
 *
 * **Placement runs object → sound.** These are the positions of the *things*,
 * and the emitters below are derived from them, so changing one of these moves
 * the sound with it.
 *
 * The heights are the anchors the builders export — a hearth's coal bed, an
 * anvil's face, a bell's mouth — because the sound of a bell comes from its
 * mouth and not from the middle of the frame it hangs in.
 */
const SMITHY = { forge: [14.2, 5.6], anvil: [13, 3.8] } as const;
/**
 * Outside the ring of houses on the north lane, not on the green. A bell wants
 * to be heard from everywhere and the green is the one place here deliberately
 * kept clear, so it stands at the edge of it where the lane comes in.
 */
const BELL_AT = [-5.4, 19.2] as const;
/** Between two houses on the west side. A yard dog, not a wandering one. */
const DOG_AT = [-8.5, 4.5] as const;
/**
 * The hedge on the north-west lane. The `hedge` emitter below was standing in
 * open grass; four shrubs in a line is the object it wanted.
 */
const HEDGE_AT = [-11.4, 14.6] as const;

/** World position of something standing on the terrain at (x, z). */
function anchor(at: readonly [number, number], lift: number): [number, number, number] {
  return [at[0], terrain.heightAt(at[0], at[1]) + lift, at[1]];
}

/**
 * What this place sounds like. Three rules, and they are the ones worth
 * reusing:
 *
 * - **Local sounds have short reach.** Wind in a tree is something you notice
 *   when you are under it. Given a generous `maxDistance` every tree in the
 *   valley is audible from every point in it, which reads as one hiss laid
 *   over the whole zone rather than as a lot of trees.
 * - **Sparse beats dense.** Four foliage emitters spread across the bowl place
 *   the settlement in a landscape; fourteen place it inside a waterfall, and
 *   cost fourteen voices to do it.
 * - **Nothing sits in the middle of the green.** The open ground is left clear
 *   for creatures, and should stay acoustically clear too.
 */
const COUNTRYSIDE_SOUND: SoundscapeSpec = {
  // A touch softer and darker than the default. Open ground with hills around
  // it — the bowl takes the top off the wind before it reaches the middle.
  bed: [
    { model: 'wind', id: 'wind', options: { gain: 0.15, tone: 3000 } },
    // Driven by the climate, which finds it by this id. Idle cost is one noise
    // voice and a filter: below an intensity of 0.02 the model stops scheduling
    // drops entirely rather than raining faintly out of a clear sky.
    {
      model: 'rain',
      id: 'rain',
      options: { gain: 0.5, intensity: 0, surface: 'earth', articulation: 0.3 },
    },
  ],
  emitters: [
    // The treeline, around the rim rather than in the settlement.
    {
      model: 'foliage',
      id: 'wood-north',
      at: [-26, 4, -31],
      options: { density: 260, tone: 0.78, gain: 0.4, articulation: 0.2 },
      refDistance: 3,
      maxDistance: 24,
      rolloff: 1.6,
      reverb: 0.3,
    },
    {
      model: 'foliage',
      id: 'wood-east',
      at: [33, 4, -9],
      options: { density: 240, tone: 0.85, gain: 0.38, articulation: 0.22 },
      refDistance: 3,
      maxDistance: 22,
      rolloff: 1.6,
      reverb: 0.3,
    },
    // The hedge by the lane. Small, dry and close — it only exists when you are
    // beside it, which is what makes walking past it an event.
    {
      model: 'foliage',
      id: 'hedge',
      at: anchor(HEDGE_AT, 1),
      options: { density: 150, tone: 1.5, gain: 0.24, articulation: 0.34 },
      refDistance: 1.4,
      maxDistance: 13,
      reverb: 0.22,
    },
    // Two birds, far apart and both quiet. One bird is a decoration; two at
    // opposite ends of a valley is a valley with birds in it.
    {
      model: 'bird',
      id: 'bird-west',
      at: [-24, 6, 4],
      options: { pitch: 2500, interval: 7, gain: 0.07, tone: 2700 },
      refDistance: 5,
      maxDistance: 46,
      rolloff: 1.3,
      reverb: 0.9,
    },
    {
      model: 'bird',
      id: 'bird-south',
      at: [17, 5.5, 34],
      options: { pitch: 3100, interval: 11, gain: 0.055, tone: 3000 },
      refDistance: 5,
      maxDistance: 44,
      rolloff: 1.35,
      reverb: 0.9,
    },
    // The forge, behind the house on the east lane. The only sound here that is
    // continuously *worked* rather than merely present, and it is what the
    // hammer below is standing next to.
    {
      model: 'fire',
      id: 'forge',
      at: anchor(SMITHY.forge, FORGE_FIRE_HEIGHT),
      // Bright and small — a charcoal hearth under a roof, not a bonfire.
      // Little draught response, because it is sheltered and half of what is
      // fanning it is a bellows rather than the weather.
      options: { gain: 0.5, intensity: 0.85, tone: 1.15, crackle: 0.65, draught: 0.12 },
      refDistance: 2,
      maxDistance: 20,
      rolloff: 1.5,
      reverb: 0.35,
    },
    // The gate on its hinges: an iron door in a stone arch, complaining when
    // the wind gets under it — `'weather'` motion, so it is silent in still air
    // and that is most of the time. Sited on the gate itself, derived from
    // `COUNTRYSIDE_GATE` like the arch and the portal door.
    //
    // Carried a long way for how quiet it is: a gate you can hear from inside
    // the settlement is a settlement with a way out of it, and this is the only
    // sound here that comes from its edge.
    {
      model: 'friction',
      id: 'gate',
      at: [COUNTRYSIDE_GATE.x + 0.9, 1.7, COUNTRYSIDE_GATE.z],
      // Low and dull. The model has a narrow low-speed regime where a high
      // partial dominates and a weather-driven source crosses it on every gust;
      // 150 keeps the whole range clear of it, and it is the right register
      // anyway. A village gate is a heavy iron thing, and heavy iron groans.
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
    // People, on the far side of the green. Quiet, dull and deliberately never
    // close enough to make out — `refDistance` is short and the model's own
    // lowpass is well down, because walla that gets near enough for the ear to
    // start reaching for words stops being a crowd and starts being uncanny.
    {
      model: 'crowd',
      id: 'folk',
      at: [-3, 1.4, 16],
      options: { voices: 5, density: 0.4, pitch: 132, variety: 0.55, gain: 0.36, distance: 1450 },
      refDistance: 5,
      maxDistance: 30,
      rolloff: 1.5,
      reverb: 0.6,
    },
  ],
  scatter: [
    // The sound that makes the place inhabited. Everything above is a place;
    // this is somebody in it. Carried much further than anything else here on
    // purpose — a hammer on an anvil is the one village sound that genuinely
    // crosses a valley.
    {
      sound: 'hammer',
      id: 'smith',
      at: anchor(SMITHY.anvil, ANVIL_FACE_HEIGHT),
      // Tight: the smith is at the anvil, not wandering. The metre of wander
      // is the swing, not the man.
      spread: [0.7, 0.2, 0.7],
      every: 13,
      force: [0.45, 1],
      options: { gain: 0.5, tone: 0.95, damping: 0.35, bounces: 2 },
      refDistance: 3,
      maxDistance: 52,
      rolloff: 1.1,
      reverb: 0.55,
    },
    // Everything else: a bucket set down, firewood dropped, a shutter. Spread
    // across the whole settled part of the bowl, rare enough that two in a row
    // is a surprise, and never twice from the same spot.
    {
      sound: 'clatter',
      id: 'yards',
      at: [0, 1, 8],
      spread: [13, 0.5, 11],
      every: 26,
      force: [0.3, 0.85],
      options: { material: 'wood', gain: 0.45, tone: 1.05 },
      refDistance: 2.5,
      maxDistance: 34,
      rolloff: 1.25,
      reverb: 0.4,
    },
    // The pen on the west side, where the cattle and sheep actually stand. One
    // voice each: a herd that answers itself in unison is a synthesiser, and
    // the overlapping-call problem is not worth solving for two animals.
    {
      sound: 'animal',
      id: 'cattle',
      at: [-16, 1.1, -10],
      spread: [4, 0.2, 4],
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
      at: [-16.5, 0.9, -11],
      spread: [5, 0.2, 5],
      every: 27,
      force: [0.4, 0.85],
      voices: 1,
      options: { kind: 'sheep', gain: 0.42, tone: 1.06 },
      refDistance: 3.5,
      maxDistance: 40,
      rolloff: 1.2,
      reverb: 0.45,
    },
    // Hens on the green. Wide spread and often, because they are the one animal
    // here that genuinely wanders and the one whose noise is background rather
    // than event.
    {
      sound: 'animal',
      id: 'fowl',
      at: [-2, 0.7, 6],
      spread: [8, 0.15, 8],
      every: 16,
      force: [0.3, 0.7],
      voices: 1,
      options: { kind: 'fowl', gain: 0.3, tone: 1 },
      refDistance: 2.5,
      maxDistance: 26,
      rolloff: 1.35,
      reverb: 0.35,
    },
    // A dog in a yard between two houses on the west side. Rare, and carries a
    // long way — a bark crossing a valley says the place is lived in. It moves
    // about its own patch rather than roaming the settlement, because a sound
    // comes from a thing and eleven metres of wander has no object it could
    // belong to.
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
    // A bell, rarely. The longest reach and the longest tail of anything here —
    // it is the sound that tells you the valley has edges, because you hear it
    // come back off them. A single fixed point with no spread: a bell is a mass
    // hung from a frame and does not move.
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
    // Under the world's weather. Origin for now — the map's real coordinates
    // are laid out when the node map is.
    place: { at: [0, 0], altitude: 0 },
    name: 'Countryside Exterior Demo',
    group: 'countryside',
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      // Further sight lines than the proving ground — the point of a place this
      // size is being able to see across it.
      fogNear: 30,
      fogFar: 190,
      footstepReverb: 0.5,
      soundscape: COUNTRYSIDE_SOUND,
    },
    spawn: { position: onGround(0, 28), yaw: Math.PI },
    floor: -20,
    // Ground cover decides what you are walking on, so a cobbled yard sounds
    // like stone and the crop beside it sounds like grass.
    surfaceAt: (x, z) => terrain.stepAt(x, z),
    groundAt: (x, z) => terrain.heightAt(x, z),
    build: buildCountryside,
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

/**
 * Stands something on the ground and tips it over, for things that lean. The
 * tilt is about the foot, so the origin stays on the terrain.
 */
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

type Point = readonly [number, number];

/**
 * Which way a line runs, for laying a boundary along it. `fence` and
 * `stone-wall` are both built along +X and turned about Y by `place`, so a
 * direction of (ux, uz) is a yaw of `atan2(-uz, ux)`.
 */
function along(from: Point, to: Point): { ux: number; uz: number; length: number; yaw: number } {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const length = Math.hypot(dx, dz);
  return { ux: dx / length, uz: dz / length, length, yaw: Math.atan2(-dz, dx) };
}

/**
 * Lays a builder that tiles along a line, in pieces, and reports where it
 * actually ended.
 *
 * The fixed pitch is what makes this possible: an arbitrary length becomes a
 * count of sections, so nothing here has to build a piece to find out how wide
 * it came out and nothing here knows what a fence looks like.
 *
 * The end is *returned* rather than assumed, because rounding to whole sections
 * moves it — a ten-metre line at a 1.4 m pitch is seven sections and stops 20 cm
 * short. Chaining from the returned point is what keeps a corner closed.
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

/**
 * A fence along a line, optionally finished with the post it is missing.
 *
 * `cap` is the contract made visible: a run ends in two rails pointing at
 * nothing until something supplies the post at its far end, which is why a
 * corner passes `false` and lets the run turning out of it do the job.
 */
function fenceRun(root: THREE.Group, seed: number, from: Point, to: Point, cap = true): Point {
  const end = laid(
    root,
    // Every piece of the run shares one carpentry seed, so two of them meeting
    // on a post are the same fence rather than two butted together.
    (s, n) => fence.build({ seed: s, run: seed, sections: n }),
    FENCE_SECTION,
    FENCE_MAX_SECTIONS,
    seed,
    from,
    to,
  );
  if (cap) {
    place(root, fencePost.build({ seed: seed + 71, run: seed }), end[0], end[1], along(from, to).yaw);
  }
  return end;
}

/** A stone wall along a line, with a pier standing off each end of it. */
function wallRun(root: THREE.Group, seed: number, from: Point, to: Point): Point {
  const { ux, uz, yaw } = along(from, to);
  const end = laid(
    root,
    (s, n) => stoneWall.build({ seed: s, run: seed, sections: n }),
    WALL_SECTION,
    WALL_MAX_SECTIONS,
    seed,
    from,
    to,
  );
  // Matched to the run they finish, and a little proud of it.
  const stand = wallHeight(createRng(seed)) + 0.3;
  const pier = (at: Point, out: number, salt: number): void => {
    place(
      root,
      stoneWallSquareColumn.build({ seed: seed + salt, height: stand }),
      at[0] + ux * out * COLUMN_REACH,
      at[1] + uz * out * COLUMN_REACH,
      yaw,
    );
  };
  pier(from, -1, 70);
  pier(end, 1, 71);
  return end;
}

/**
 * What a sign says, and what a banner says. Both take text beyond the standard
 * seed and scale, which `MeshBuilder` does not know about, so the options carry
 * their own type at the call site.
 */
function sign(seed: number, text: string): SignboardOptions {
  return { seed, text };
}

function strung(seed: number, text: string): BannerOptions {
  return { seed, text };
}

/**
 * Scatters a builder over an area, skipping anything too steep or too close to
 * where people are. Seeded, so the field is identical every load — and rejected
 * candidates still consume their draws, so adding an exclusion does not
 * reshuffle everything already placed.
 */
function scatter(
  parent: THREE.Object3D,
  builder: MeshBuilder,
  options: {
    seed: number;
    count: number;
    within: number;
    from?: [number, number];
    maxSlope?: number;
    minHeight?: number;
    maxHeight?: number;
    /** Circles to stay out of: [x, z, radius]. */
    avoid?: readonly (readonly [number, number, number])[];
    scale?: [number, number];
  },
): void {
  const rng = createRng(options.seed);
  const [cx, cz] = options.from ?? [0, 0];
  const maxSlope = options.maxSlope ?? 26;
  const avoid = options.avoid ?? [];
  const solid = builder.solid !== false;

  for (let i = 0; i < options.count; i++) {
    // Square-rooted radius, or everything clusters at the middle: uniform in
    // radius is not uniform in area.
    const angle = rng.range(0, Math.PI * 2);
    const radius = Math.sqrt(rng()) * options.within;
    const x = cx + Math.cos(angle) * radius;
    const z = cz + Math.sin(angle) * radius;
    const yaw = rng.range(0, Math.PI * 2);
    const size = options.scale ? rng.range(options.scale[0], options.scale[1]) : 1;
    const seed = rng.int(1, 1_000_000);

    if (Math.abs(x) > HALF - 8 || Math.abs(z) > HALF - 8) continue;
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
 * Where the houses stand: a ring about ten metres out from the green, seven to
 * nine metres apart, so with a hut four metres across the gaps between them are
 * three or four metres, which is a street.
 *
 * The cobble lanes run to these coordinates, so moving a house means moving its
 * street. That coupling is deliberate: a path to nowhere is more obviously
 * wrong than a house standing on grass.
 *
 * `interior` marks the three you can go into — three sides of the ring, so
 * walking between the doors crosses the whole settlement.
 */
interface House {
  readonly at: readonly [number, number];
  readonly seed: number;
  readonly interior?: string;
}

const HOUSES: readonly House[] = [
  { at: [-9, 13], seed: 700, interior: ZONE_COTTAGE },
  { at: [-2, 17], seed: 831 },
  { at: [7, 15], seed: 962, interior: ZONE_WORKSHOP },
  { at: [11, 8], seed: 1093 },
  { at: [9, 1], seed: 1224 },
  { at: [1, -2], seed: 1355 },
  { at: [-7, 0], seed: 1486, interior: ZONE_STORE },
  { at: [-12, 6], seed: 1617 },
];

/** The middle of it. Everything faces this. */
const GREEN: readonly [number, number] = [0, 8];

/**
 * How far a portal door stands out from the wall. Small, but not zero: the hut
 * paints a dark panel where its doorway is, and a coplanar door z-fights it.
 */
const DOOR_PROUD = 0.07;

const UP = new THREE.Vector3(0, 1, 0);

/** Which way a house faces: the green, so its back makes the edge of the village. */
function houseYaw(house: House): number {
  return Math.atan2(GREEN[0] - house.at[0], GREEN[1] - house.at[1]);
}

/**
 * Where the portal door in a house's doorway stands, in world space. Measured
 * off a built hut rather than computed: the doorway's offset is rolled from the
 * seed, so arithmetic here would have to replay the builder's draws. The mesh
 * is thrown away — `buildSettlement` builds its own from that seed.
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
 * `countryside-homes`, which owns the rooms behind them — the exterior knows
 * where its doorways are and nothing about what is through them.
 */
export const HOUSE_DOORS: ReadonlyMap<string, PortalEnd> = new Map(
  HOUSES.filter((house) => house.interior).map((house) => [
    house.interior as string,
    houseDoorEnd(house),
  ]),
);

/**
 * The ground you land on stepping out of a house. Nothing may stand here.
 * Derived, so moving a house cannot leave a barrel in its doorway.
 */
const DOOR_APPROACHES: readonly (readonly [number, number, number])[] = [
  ...HOUSE_DOORS.values(),
].map((end) => [
  end.position.x + Math.sin(end.yaw) * 2.2,
  end.position.z + Math.cos(end.yaw) * 2.2,
  2.4,
]);

/**
 * The green, the streets and the gate approach, kept clear of anything solid.
 * This is the ground creatures walk on, so it is deliberately empty — a village
 * square full of shrubs is a pathfinding problem, not scenery.
 */
const KEEP_CLEAR: readonly (readonly [number, number, number])[] = [
  [0, 8, 17],
  [0, 24, 10],
  // The gate itself, and the ground you land on stepping out of it. A single
  // shrub here means arriving inside a shrub, which is how the check found it.
  [0, 33, 8],
  [-16, -10, 9],
  ...DOOR_APPROACHES,
];

/**
 * Where ground cover may not grow — much smaller than `KEEP_CLEAR`. A daisy is
 * not in the collider at all, so a wide exclusion buys nothing and costs the
 * settlement its grass: bare ground with a fringe beginning where the houses
 * end reads as a mown lawn. Ground cover keeps off the green, the buildings
 * and the arrivals, and nothing else.
 */
const KEEP_CLEAR_SOFT: readonly (readonly [number, number, number])[] = [
  [GREEN[0], GREEN[1], 7],
  [0, 33, 7],
  ...HOUSES.map(({ at }) => [at[0], at[1], 3.2] as const),
  ...DOOR_APPROACHES,
];

function buildCountryside(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'CountrysideExterior';
  // Collidable. The ground is the one mesh in a zone that absolutely must be —
  // everything else you can walk through and merely look silly, but a terrain
  // nobody marked solid is a zone you fall out of the moment you arrive.
  root.add(markCollidable(terrain.build()));

  buildSettlement(root);
  buildCountry(root);

  return root;
}

/** The houses, and everything standing between them. */
function buildSettlement(root: THREE.Group): void {
  // The arch on this side of the gate. The portal stands its door in the same
  // place from the same numbers, so the two ends match without being told to.
  place(
    root,
    stoneWallArchway.build({ seed: 4714 }),
    COUNTRYSIDE_GATE.x,
    COUNTRYSIDE_GATE.z,
    Math.PI,
  );
  // A sign beside it, facing the way you arrive. The lane in reads as a dirt
  // track rather than as the way to anywhere until something says so.
  place(root, signboard.build(sign(5210, 'VILLAGE')), 2.4, 30.4, 0.1);

  // Posts at the bends. A line of leaning timber is the cheapest thing in the
  // kit that says a route is used.
  place(root, post.build({ seed: 5221 }), 1.6, 24.4, 0.4);
  place(root, post.build({ seed: 5222 }), -1.5, 27.8, 2.1);
  place(root, post.build({ seed: 5223 }), 1.3, 31.2, 1.2);

  // --- the houses ----------------------------------------------------------
  for (const house of HOUSES) {
    place(root, hut.build({ seed: house.seed }), house.at[0], house.at[1], houseYaw(house));
  }

  // --- the well, and the yard round it -------------------------------------
  //
  // Off the green rather than on it, where three of the four lanes meet.
  place(root, cistern.build({ seed: 5301 }), -3.4, 12.8, 0.3);
  place(root, trough.build({ seed: 5302 }), -4.6, 13.9, 1.2);
  place(root, figure.build({ seed: 5303, roam: 3 }), -4.9, 14.8, -1.1);

  // --- the west boundary ---------------------------------------------------
  //
  // Where the settlement stops and the fields start. Stone rather than timber
  // because the two say different things about a line: a fence keeps animals
  // where they are put, and a wall says the ground either side belongs to
  // different people. A pier at each end, the only place the wall has one.
  wallRun(root, 6100, [-13.2, 11.4], [-18, 11.4]);

  // The hedge. The line is what makes it one rather than four bushes.
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
  //
  // A banner over a trestle. The banner is the only thing in the zone strung
  // above head height, which is most of why it is worth having.
  place(root, banner.build(strung(5401, 'MARKET')), 0.4, 11.6, Math.PI);
  place(root, table.build({ seed: 5402 }), 1.2, 10.2, 0.3);
  place(root, stool.build({ seed: 5403 }), 2.0, 9.5, 1.1);
  place(root, stool.build({ seed: 5404 }), 0.2, 9.4, 2.4);
  place(root, crate.build({ seed: 5405 }), 1.1, 12.3, 0.7);

  // --- lit lanes -----------------------------------------------------------
  //
  // Three, and no more: each carries a `PointLight`, and a lamp per junction
  // would be eight of them lighting a zone ninety metres across.
  place(root, streetlamp.build({ seed: 5501 }), 1.4, 14.9, 1.9);
  place(root, streetlamp.build({ seed: 5502 }), -4.9, 5.3, -0.7);
  place(root, streetlamp.build({ seed: 5503 }), 9.8, 11.6, 2.6);

  // --- yards ---------------------------------------------------------------
  //
  // Against the walls of the houses that are *not* enterable, so nothing stands
  // in a doorway you can use, and the green stays walkable.
  place(root, crate.build({ seed: 5601 }), 12.8, 10.2, 0.5);
  place(root, barrel.build({ seed: 5602 }), 13.3, 9.0, 0);
  place(root, barrel.build({ seed: 5603 }), 13.7, 9.9, 0.9);
  place(root, barrel.build({ seed: 5604 }), 10.8, -0.8, 0.2);
  place(root, crate.build({ seed: 5605 }), 11.4, 0.4, 1.3);
  place(root, crate.build({ seed: 5606 }), 2.4, -3.9, 0.4);
  place(root, barrel.build({ seed: 5607 }), 3.3, -3.0, 0);
  place(root, barrel.build({ seed: 5608 }), -14.0, 4.2, 0.6);

  // A cellar hatch behind the east house. The one piece of joinery in the kit
  // you look down at, and it wants flat ground with no traffic over it.
  place(root, hutTrapdoor.build({ seed: 5610 }), 10.6, 2.8, 0.8);
  // A spare door propped against the west house, made and not yet hung.
  // Leaning, because one standing square reads as a doorway to nowhere.
  lean(root, hutDoor.build({ seed: 5611 }), -14.2, 7.2, 2.5, 0.24);

  // --- the garden ----------------------------------------------------------
  //
  // The one place where planting is deliberate rather than scattered, which is
  // why the sunflowers and the lavender are here and nowhere else.
  //
  // Fenced on the two sides that face open country — the house behind it is the
  // other two. The corner carries one post and not two: the west run leaves its
  // last one off and the north run supplies it. Both runs stay on the level
  // shelf, because a rail follows its posts rather than the ground under them.
  const gardenCorner = fenceRun(root, 5701, [-5.4, 16.8], [-5.4, 19.6], false);
  fenceRun(root, 5705, gardenCorner, [-1, 19.6]);
  place(root, sunflower.build({ seed: 5711 }), -3.2, 19.3, 0.4, false);
  place(root, sunflower.build({ seed: 5712 }), -2.5, 19.0, 1.9, false);
  place(root, sunflower.build({ seed: 5713 }), -4.4, 19.1, 3.1, false);
  // One. Lavender is fourteen thousand triangles for a plant the size of a
  // boot — four per cent of this zone — so it goes at the fence where the lane
  // passes within a stride of it, and nowhere else.
  place(root, lavender.build({ seed: 5714 }), -1.9, 18.9, 0.7, false);

  // --- the paddock ---------------------------------------------------------
  //
  // West of the houses, on the mired ground. Two sides of it and no more, open
  // toward the settlement — one continuous run that turns a corner.
  const paddockCorner = fenceRun(root, 400, [-22, -4], [-22, -14], false);
  fenceRun(root, 420, paddockCorner, [-11, -14]);
  place(root, trough.build({ seed: 91 }), -13, -13, 0.4);
  place(root, figure.build({ seed: 5801, roam: 4 }), -13.4, -6.2, 2.6);
  scatter(root, bovine, { seed: 8801, count: 2, within: 5, from: [-16, -10], maxSlope: 20 });
  scatter(root, ovine, { seed: 8802, count: 4, within: 6, from: [-16, -10], maxSlope: 20 });
  scatter(root, porcine, { seed: 8803, count: 2, within: 5, from: [-17, -8], maxSlope: 20 });
  scatter(root, poultry, { seed: 8804, count: 6, within: 9, from: [-2, 6], maxSlope: 18 });

  // --- the things that make the noise --------------------------------------
  //
  // Placed from the same numbers the emitters are derived from, so neither can
  // move without the other. The forge faces the green so its hood and the glow
  // under it are read from the village side, and the anvil is turned across it
  // — a smith stands between the two.
  place(root, forge.build({ seed: 5901 }), SMITHY.forge[0], SMITHY.forge[1], Math.PI);
  place(root, anvil.build({ seed: 5902 }), SMITHY.anvil[0], SMITHY.anvil[1], 0.6);
  place(root, signboard.build(sign(5903, 'SMITHY')), 12.4, 7.8, -1.5);
  place(root, bell.build({ seed: 5904 }), BELL_AT[0], BELL_AT[1], -0.5);
  // Its patch is the bark field's spread, so the barking stays where the dog is.
  place(root, dog.build({ seed: 5905, roam: 2.4 }), DOG_AT[0], DOG_AT[1], 1.9);

  // Living: they walk about the green, watch you and greet you. LIFE.md.
  place(root, figure.build({ seed: 3301, roam: 5 }), 3.4, 6.6, 2.2);
  place(root, figure.build({ seed: 3302, roam: 5 }), -3.2, 8.6, 1.1);
  place(root, figure.build({ seed: 3303, roam: 5 }), 6.4, 2.6, -0.8);
}

/**
 * The country the settlement stands in, ordered by storey rather than by
 * builder: canopy, the shrubs under it, then the floor. The densities only mean
 * anything against each other, and any two of the three is a diorama.
 *
 * Species go by ground rather than by taste. Height bands do most of it, and
 * the `from` centres pull each wood toward a corner the soundscape already has
 * a treeline emitter in.
 */
function buildCountry(root: THREE.Group): void {
  // --- canopy --------------------------------------------------------------
  //
  // Four species and their saplings. The saplings matter more than the extra
  // species does: a wood where every trunk is the same height was planted.
  // Oak on the valley floor, where the soil is.
  scatter(root, oak, {
    seed: 5001,
    count: 12,
    within: 30,
    from: [-6, -6],
    maxSlope: 24,
    maxHeight: 4,
    avoid: KEEP_CLEAR,
    scale: [0.85, 1.15],
  });
  scatter(root, smallOak, {
    seed: 5002,
    count: 12,
    within: 32,
    from: [-6, -6],
    maxSlope: 26,
    maxHeight: 5,
    avoid: KEEP_CLEAR,
    scale: [0.8, 1.3],
  });
  // Birch anywhere: the one tree that takes both the wet bottom and the dry
  // side of the bowl.
  scatter(root, birch, {
    seed: 5003,
    count: 14,
    within: 40,
    maxSlope: 30,
    maxHeight: 9,
    avoid: KEEP_CLEAR,
    scale: [0.8, 1.2],
  });
  scatter(root, smallBirch, {
    seed: 5004,
    count: 14,
    within: 40,
    maxSlope: 32,
    maxHeight: 10,
    avoid: KEEP_CLEAR,
    scale: [0.8, 1.35],
  });
  // Spruce up the north and west sides, on the thin ground.
  scatter(root, spruce, {
    seed: 5005,
    count: 16,
    within: 26,
    from: [-20, -18],
    maxSlope: 32,
    maxHeight: 11,
    avoid: KEEP_CLEAR,
    scale: [0.85, 1.2],
  });
  scatter(root, smallSpruce, {
    seed: 5006,
    count: 12,
    within: 28,
    from: [-20, -18],
    maxSlope: 34,
    maxHeight: 12,
    avoid: KEEP_CLEAR,
    scale: [0.8, 1.3],
  });
  // The generic tree between the stands. A hundred and thirty triangles
  // against a birch's three thousand, so it is what the middle distance is.
  scatter(root, tree, {
    seed: 5007,
    count: 24,
    within: 42,
    maxSlope: 30,
    maxHeight: 9,
    avoid: KEEP_CLEAR,
    scale: [0.8, 1.35],
  });
  scatter(root, smallTree, {
    seed: 5008,
    count: 16,
    within: 42,
    maxSlope: 32,
    avoid: KEEP_CLEAR,
    scale: [0.8, 1.3],
  });

  // --- the storey under it -------------------------------------------------
  //
  // The register a wood is missing when it reads as a stage set: between ankle
  // height and overhead. Gorse takes the dry banks nothing else will.
  scatter(root, bush, { seed: 5011, count: 40, within: 42, maxSlope: 32, avoid: KEEP_CLEAR });
  scatter(root, hazel, {
    seed: 5012,
    count: 7,
    within: 34,
    from: [-10, -4],
    maxSlope: 28,
    maxHeight: 6,
    avoid: KEEP_CLEAR,
  });
  scatter(root, elder, {
    seed: 5013,
    count: 7,
    within: 32,
    from: [4, -8],
    maxSlope: 28,
    maxHeight: 7,
    avoid: KEEP_CLEAR,
  });
  scatter(root, gorse, {
    seed: 5014,
    count: 12,
    within: 40,
    maxSlope: 38,
    minHeight: 4,
    avoid: KEEP_CLEAR,
  });
  scatter(root, bramble, {
    seed: 5015,
    count: 14,
    within: 38,
    maxSlope: 32,
    avoid: KEEP_CLEAR_SOFT,
  });

  // --- what used to be trees -----------------------------------------------
  //
  // A wood with no dead matter has not been standing long enough to be one.
  scatter(root, stump, { seed: 5021, count: 12, within: 36, maxSlope: 24, avoid: KEEP_CLEAR });
  scatter(root, fallenLog, { seed: 5022, count: 10, within: 36, maxSlope: 22, avoid: KEEP_CLEAR });
  scatter(root, sticks, { seed: 5023, count: 20, within: 38, maxSlope: 30, avoid: KEEP_CLEAR_SOFT });

  // --- the floor -----------------------------------------------------------
  //
  // The large clump covers ten times the ground of the small one and costs
  // twenty times the triangles, so the ratio runs the other way: a handful to
  // break the ground up, and small ones by the hundred to fill between them.
  scatter(root, largeGrassClump, {
    seed: 5031,
    count: 10,
    within: 42,
    maxSlope: 24,
    avoid: KEEP_CLEAR_SOFT,
  });
  scatter(root, smallGrassClump, {
    seed: 5032,
    count: 115,
    within: 42,
    maxSlope: 28,
    avoid: KEEP_CLEAR_SOFT,
  });
  // Fern in the shade of the west wood, nettle where people and animals are:
  // a nettle bed is the most specific thing a weed can say about a place.
  scatter(root, fern, {
    seed: 5033,
    count: 15,
    within: 30,
    from: [-18, -10],
    maxSlope: 30,
    maxHeight: 6,
    avoid: KEEP_CLEAR_SOFT,
  });
  scatter(root, nettle, {
    seed: 5034,
    count: 12,
    within: 14,
    from: [-16, -10],
    maxSlope: 26,
    avoid: KEEP_CLEAR_SOFT,
  });
  scatter(root, moss, {
    seed: 5035,
    count: 22,
    within: 40,
    maxSlope: 40,
    minHeight: 3,
    avoid: KEEP_CLEAR_SOFT,
  });
  scatter(root, mushroom, {
    seed: 5036,
    count: 26,
    within: 36,
    maxSlope: 22,
    avoid: KEEP_CLEAR_SOFT,
  });
  // Cones only where there are conifers to have dropped them.
  scatter(root, pinecone, {
    seed: 5037,
    count: 11,
    within: 24,
    from: [-20, -18],
    maxSlope: 30,
    avoid: KEEP_CLEAR_SOFT,
  });
  // Reeds in the two wet places and nowhere else — see the mire patches above.
  scatter(root, reeds, { seed: 5038, count: 7, within: 5, from: [-25, -19], maxSlope: 22 });
  scatter(root, reeds, { seed: 5039, count: 4, within: 4, from: [-20, -14], maxSlope: 22 });

  // --- flowers -------------------------------------------------------------
  //
  // Each in the ground it belongs to rather than sprinkled evenly, which is
  // what makes a meadow read as confetti. Bluebells under the west wood,
  // poppies in the crop, thistle on the rough ground nobody works.
  scatter(root, daisy, {
    seed: 5041,
    count: 8,
    within: 12,
    from: [-23, 21],
    maxSlope: 22,
    avoid: KEEP_CLEAR_SOFT,
  });
  scatter(root, wildflower, {
    seed: 5042,
    count: 8,
    within: 13,
    from: [-24, -6],
    maxSlope: 24,
    avoid: KEEP_CLEAR_SOFT,
  });
  scatter(root, poppy, {
    seed: 5043,
    count: 12,
    within: 9,
    from: [23, 1],
    maxSlope: 22,
    avoid: KEEP_CLEAR_SOFT,
  });
  scatter(root, cowparsley, {
    seed: 5044,
    count: 6,
    within: 20,
    from: [0, 24],
    maxSlope: 26,
    avoid: KEEP_CLEAR_SOFT,
  });
  scatter(root, bluebell, {
    seed: 5045,
    count: 8,
    within: 14,
    from: [-24, 2],
    maxSlope: 26,
    maxHeight: 4,
    avoid: KEEP_CLEAR_SOFT,
  });
  scatter(root, foxglove, {
    seed: 5046,
    count: 5,
    within: 26,
    from: [2, -14],
    maxSlope: 30,
    avoid: KEEP_CLEAR_SOFT,
  });
  scatter(root, thistle, {
    seed: 5047,
    count: 8,
    within: 40,
    maxSlope: 34,
    minHeight: 3,
    avoid: KEEP_CLEAR_SOFT,
  });

  // --- stone ---------------------------------------------------------------
  //
  // On the steep and the high ground, where the soil would have gone.
  scatter(root, rock, {
    seed: 6001,
    count: 60,
    within: 45,
    maxSlope: 44,
    minHeight: 4,
    scale: [0.7, 1.6],
  });
  scatter(root, cairn, { seed: 6002, count: 6, within: 38, maxSlope: 20, minHeight: 5 });
}
