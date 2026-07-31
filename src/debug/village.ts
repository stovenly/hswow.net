import * as THREE from 'three';
import { type ZoneDefinition, OUTDOOR_ENVIRONMENT } from '../world/Zone';
import { Terrain, type Landform } from '../world/terrain';
import type { GroundPatch } from '../world/ground';
import { markCollidable } from '../player/Collider';
import { createRng } from '../art/random';
import type { MeshBuilder } from '../art/types';
import { tree } from '../art/builders/tree';
import { bush } from '../art/builders/bush';
import { grass } from '../art/builders/grass';
import { mushroom } from '../art/builders/mushroom';
import { rock } from '../art/builders/rock';
import { cairn } from '../art/builders/cairn';
import { stump } from '../art/builders/stump';
import { hut } from '../art/builders/hut';
import { fence } from '../art/builders/fence';
import { post } from '../art/builders/post';
import { trough } from '../art/builders/trough';
import { crate } from '../art/builders/crate';
import { barrel } from '../art/builders/barrel';
import { table } from '../art/builders/table';
import { bovine } from '../art/builders/bovine';
import { ovine } from '../art/builders/ovine';
import { equine } from '../art/builders/equine';
import { porcine } from '../art/builders/porcine';
import { poultry } from '../art/builders/poultry';
import { figure } from '../art/builders/figure';
import { archway } from '../art/builders/archway';

/**
 * Arkstin Village — the first zone that is a *place* rather than a fixture.
 *
 * A bounded outdoor bowl: hills around the edge that turn you back, a valley
 * floor with a settlement in it, a ridge to climb, and a plateau to look down
 * from. Everything is placed against the heightfield rather than at y = 0,
 * which is the whole reason this exists — the Proving Ground is deliberately
 * flat, so nothing there has ever exercised walking on a slope, dropping a prop
 * onto uneven ground, or ground cover changing under your feet.
 *
 * **The clear ground is deliberate.** The village green and the two lanes are
 * kept free of props, because this is the level NPCs get tested in and they
 * will need somewhere to walk that is not an obstacle course.
 */

export const ZONE_VILLAGE = 'village';

/**
 * Metres across.
 *
 * A quarter of what it was. The first version was 384 m — which is a
 * *landscape*, and the village sat in it as a handful of buildings a long walk
 * apart with a wall of mountains on the horizon. A village is a place where the
 * next house is a few paces away and you can see the whole of it at once, so
 * everything here is scaled to that: the map, the hills, and above all the gaps
 * between the buildings.
 */
const SIZE = 96;
const HALF = SIZE / 2;

/**
 * The shape of the place.
 *
 * Read in order: the bowl first, then the things standing in it. The rim is
 * last because it has to win at the edges — a hill placed near the boundary
 * would otherwise flatten the wall out and open a way out of the map.
 */
const LANDFORMS: Landform[] = [
  // A shallow dish, so the ground reads as a valley floor rather than a table.
  { kind: 'basin', at: [0, 0], radius: 34, depth: 3 },

  // Rolling ground east and north, all gentle enough to walk straight over.
  { kind: 'hill', at: [18, -12], radius: 12, height: 4.5, falloff: 1.3 },
  { kind: 'hill', at: [20, 8], radius: 10, height: 3.5, falloff: 1.4 },
  { kind: 'hill', at: [8, 20], radius: 11, height: 3, falloff: 1.5 },

  // **The whole settlement stands on one level shelf.**
  //
  // Buildings are rigid and ground is not: a hut placed on a one-in-twenty
  // slope buries one corner and floats the opposite one, and no amount of
  // fiddling with its position fixes that because the problem is the ground.
  // Fences and troughs are no different — a paddock rail follows the post it is
  // nailed to, not the hillside underneath.
  //
  // So the shelf is centred between the green and the paddock and made wide
  // enough to hold both, rather than levelling the houses and leaving the
  // animals on a slope beside them. Eased back into the valley over nine
  // metres, so it reads as a terrace rather than a disc somebody stamped out.
  //
  // The check measures the fall across each building's footprint and fails if
  // any of them is standing on a slope worth noticing.
  { kind: 'terrace', at: [-6, 1], radius: 26, height: -3, blend: 9 },

  // A second, small shelf under the gateway.
  //
  // The arch is as rigid as a house — two stone piers a couple of metres apart
  // — and it was standing on the outer slope of the shelf above, with one pier
  // buried and the other in the air by more than a metre. Found by widening the
  // level-ground check from huts to everything rigid, which is the sort of
  // thing that is invisible until you walk up to it.
  //
  // Applied after the big shelf, so it wins locally; the lane between the two
  // falls about three metres over twenty, which is a gentle walk down.
  { kind: 'terrace', at: [0, 34], radius: 6, height: -0.4, blend: 7 },

  // The wall of hills.
  //
  // A smootherstep's steepest gradient is 1.875 × height / inset. The wall is
  // kept *short and steep* rather than tall and long — 14 m of rise over 13 m
  // reads as a bank at the end of a field, where the first attempt at 58 m
  // looked like the rim of a crater. Making it steeper rather than taller is
  // also what buys back the slope the grid resolution smears away.
  //
  // Landforms *sum*, so nothing above may reach into this band or it lifts the
  // foot of the wall and flattens it into a ramp. Everything is kept inside
  // ±32 m for that reason, and the check walks 240 spokes to prove it.
  { kind: 'rim', inset: 13, height: 14 },
];

/**
 * Ground cover, painted in layers: fields first, then the lanes across them,
 * then the yard where the lanes meet.
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

  // **Cobble is the street, not a plaza.**
  //
  // This was one 26 m disc of cobble with the houses standing on it, which is
  // not a village — it is a car park. Streets are narrow, they run *between*
  // buildings, and the paving exists because that is where people walk. Four
  // lanes crossing at the green pave the junction for free where they overlap,
  // which is exactly how a village square comes to be paved in the first place.
  { kind: 'path', through: [[-9, 13], [0, 8], [9, 1]], width: 2.2, material: 'cobble' },
  { kind: 'path', through: [[-2, 17], [0, 8], [1, -2]], width: 2.2, material: 'cobble' },
  { kind: 'path', through: [[7, 15], [0, 8], [-7, 0]], width: 2.2, material: 'cobble' },
  { kind: 'path', through: [[11, 8], [0, 8], [-12, 6]], width: 2.2, material: 'cobble' },

  // The paddock corner, churned up where the animals stand.
  { kind: 'blot', at: [-16, -10], radius: 7, material: 'mire' },
];

const terrain = new Terrain({
  size: SIZE,
  // Three metres, not four. The rim's steep band is only a dozen metres wide,
  // and a coarse grid smears it: the player collides with the *triangles*, not
  // with the underlying function, so a wall that is mathematically 59° comes
  // out as a 48° ramp once it has been cut into four-metre quads — climbable,
  // and the check caught exactly that. On a map this size the finer grid costs
  // two thousand triangles.
  resolution: 3,
  landforms: LANDFORMS,
  patches: PATCHES,
  // Fine where people walk, coarse where they only look.
  //
  // The streets are 2.2 m wide, which at the three-metre base grid is barely
  // one quad — so their edges ran along whatever the grid happened to do and
  // the square read as a heap of triangles rather than as paving. Quartering
  // the cells over the settlement puts three quads across a street, with a
  // half-step ring around it so the change in density is not itself a line you
  // can see. The hills keep the base grid and cost nothing.
  //
  // **Every ring is kept inside flat ground.** The terrace above is level out
  // to 26 m, so these stop short of that — a boundary out at 34 m crossed the
  // rim at 61°, and a change of facet size on a slope that steep draws a hard
  // shading line that looks exactly like a crack in the mesh. The gate's ring
  // sits inside its own small shelf for the same reason. The check measures
  // the ground under each ring and fails if any of it is steep.
  detail: [
    { at: [-6, 1], radius: 26, level: 2 },
    { at: [-6, 1], radius: 20, level: 4 },
    { at: [0, 34], radius: 5, level: 3 },
  ],
});

/** Exported so the portal and the checks can measure the ground. */
export const villageTerrain = terrain;

/** Where you arrive from the Proving Ground, on the lane at the north end. */
export const VILLAGE_GATE = new THREE.Vector3(0, 0, 34);

export function villageZone(): ZoneDefinition {
  return {
    id: ZONE_VILLAGE,
    name: 'Arkstin Village',
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      // Further sight lines than the proving ground — the point of a place this
      // size is being able to see across it.
      fogNear: 30,
      fogFar: 190,
      footstepReverb: 0.5,
    },
    spawn: { position: onGround(0, 28), yaw: Math.PI },
    floor: -20,
    // Ground cover decides what you are walking on, so a cobbled yard sounds
    // like stone and the crop beside it sounds like grass.
    surfaceAt: (x, z) => terrain.stepAt(x, z),
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

/**
 * Scatters a builder over an area, skipping anything too steep or too close to
 * where people are.
 *
 * Seeded, so the field is identical every load — and rejected candidates still
 * consume their draws, so adding an exclusion does not reshuffle everything
 * that was already placed.
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
 * The green, the streets and the gate approach, kept clear of scatter.
 *
 * This is the ground NPCs will walk on in Phase 7, so it is deliberately empty
 * — a village square full of shrubs is a pathfinding problem, not scenery.
 */
const KEEP_CLEAR: readonly (readonly [number, number, number])[] = [
  [0, 8, 17],
  [0, 24, 10],
  // The gate itself, and the ground you land on stepping out of it. A single
  // shrub here means arriving inside a shrub, which is how the check found it.
  [0, 33, 8],
  [-16, -10, 9],
];

/**
 * Where the houses stand.
 *
 * A ring about ten metres out from the green, seven to nine metres apart — so
 * with a hut four metres across the gaps between them are three or four metres,
 * which is a street. The first version had six houses spread over forty metres
 * and read as a hamlet somebody had abandoned.
 *
 * The cobble lanes above run to these coordinates, so moving a house means
 * moving its street. That coupling is deliberate: a path to nowhere is more
 * obviously wrong than a house standing on grass.
 */
const HOUSES: readonly (readonly [number, number])[] = [
  [-9, 13],
  [-2, 17],
  [7, 15],
  [11, 8],
  [9, 1],
  [1, -2],
  [-7, 0],
  [-12, 6],
];

/** The middle of the village. Everything faces it. */
const GREEN: readonly [number, number] = [0, 8];

function buildVillage(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'ArkstinVillage';
  // **Collidable.** The ground is the one mesh in a zone that absolutely must
  // be — everything else you can walk through and merely look silly, but a
  // terrain nobody marked solid is a zone you fall out of the moment you
  // arrive. It went in unmarked the first time, and the arrival check caught
  // it by finding no floor under the gate.
  root.add(markCollidable(terrain.build()));

  // The arch on this side of the gate. The portal stands its door in the same
  // place from the same numbers, so the two ends match without being told to.
  place(root, archway.build({ seed: 4714 }), VILLAGE_GATE.x, VILLAGE_GATE.z, Math.PI);

  // --- the settlement -----------------------------------------------------
  HOUSES.forEach(([x, z], i) => {
    // Turned to face the green, so the doors all look inward and the backs of
    // the houses make the edge of the village.
    place(root, hut.build({ seed: 700 + i * 131 }), x, z, Math.atan2(GREEN[0] - x, GREEN[1] - z));
  });

  // Paddock west of the houses, on the mired ground.
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    place(root, fence.build({ seed: 400 + i }), -16 + Math.cos(angle) * 8, -10 + Math.sin(angle) * 8, angle);
  }
  place(root, trough.build({ seed: 91 }), -13, -13, 0.4);
  scatter(root, bovine, { seed: 8801, count: 2, within: 5, from: [-16, -10], maxSlope: 20 });
  scatter(root, ovine, { seed: 8802, count: 4, within: 6, from: [-16, -10], maxSlope: 20 });
  scatter(root, porcine, { seed: 8803, count: 2, within: 5, from: [-17, -8], maxSlope: 20 });
  scatter(root, poultry, { seed: 8804, count: 6, within: 9, from: [-2, 6], maxSlope: 18 });
  scatter(root, equine, { seed: 8805, count: 2, within: 6, from: [-24, 4], maxSlope: 18 });

  // Life on the street. Set against the houses rather than in the middle, so
  // the green itself stays walkable.
  place(root, table.build({ seed: 2211 }), 4, 11, 0.3);
  place(root, crate.build({ seed: 2212 }), 6, 12, 1.1);
  place(root, barrel.build({ seed: 2213 }), -4, 5, 0);
  place(root, barrel.build({ seed: 2214 }), -5, 6.5, 0.7);
  place(root, crate.build({ seed: 2215 }), 9, 5, 0.5);
  place(root, post.build({ seed: 2216 }), -2, 11, 0);

  // Placeholders for the actors this level exists to test.
  place(root, figure.build({ seed: 3301 }), 3, 7, 2.2);
  place(root, figure.build({ seed: 3302 }), -3, 9, 1.1);
  place(root, figure.build({ seed: 3303 }), 6, 3, -0.8);

  // --- the country around it ----------------------------------------------
  scatter(root, tree, {
    seed: 5001,
    count: 130,
    within: 42,
    maxSlope: 30,
    maxHeight: 9,
    avoid: KEEP_CLEAR,
    scale: [0.8, 1.35],
  });
  scatter(root, bush, { seed: 5002, count: 90, within: 42, maxSlope: 32, avoid: KEEP_CLEAR });
  scatter(root, grass, { seed: 5003, count: 220, within: 42, maxSlope: 28, avoid: KEEP_CLEAR });
  scatter(root, mushroom, { seed: 5004, count: 40, within: 36, maxSlope: 22, avoid: KEEP_CLEAR });
  scatter(root, stump, { seed: 5005, count: 16, within: 36, maxSlope: 24, avoid: KEEP_CLEAR });

  // Stone on the steep and the high ground, where the soil would have gone.
  scatter(root, rock, {
    seed: 6001,
    count: 70,
    within: 45,
    maxSlope: 44,
    minHeight: 4,
    scale: [0.7, 1.6],
  });
  scatter(root, cairn, { seed: 6002, count: 7, within: 38, maxSlope: 20, minHeight: 5 });

  return root;
}
