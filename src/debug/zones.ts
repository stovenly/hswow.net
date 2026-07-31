import * as THREE from 'three';
import { type ZoneDefinition, OUTDOOR_ENVIRONMENT, INDOOR_ENVIRONMENT } from '../world/Zone';
import type { SoundscapeSpec } from '../audio/Soundscape';
import type { PortalDefinition } from '../world/Portal';
import { buildInterior, HOUSE_STYLE, WORKS_STYLE } from '../world/interior';
import { markCollidable } from '../player/Collider';
import { ProvingGround, SPAWN } from './ProvingGround';
// Builders are imported directly rather than through `art/registry`, which is
// Vite-only. The headless zone check reaches this file through esbuild.
import { hut, hutDoorAnchor } from '../art/builders/hut';
import { crate } from '../art/builders/crate';
import { barrel } from '../art/builders/barrel';
import { post } from '../art/builders/post';
import { bush } from '../art/builders/bush';
import { bed } from '../art/builders/bed';
import { table } from '../art/builders/table';
import { chair } from '../art/builders/chair';
import { stool } from '../art/builders/stool';
import { figure } from '../art/builders/figure';
import { machine } from '../art/builders/machine';
import { archway } from '../art/builders/archway';
import { PALETTE } from '../art/palette';
import { villageZone, villageTerrain, VILLAGE_GATE, ZONE_VILLAGE } from './village';

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
export const ZONE_EXAMPLE = 'example';
export const ZONE_FACTORY = 'factory';
export { ZONE_VILLAGE } from './village';

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
 * The factory: immediately east of the proving ground's machine hall.
 *
 * Stood beside the hall rather than out in the open. The hall at x 15..29 is
 * the Phase 3 acoustics room with the flywheel in it, and the factory reads as
 * the same industry — walking from one to the other is a few paces instead of a
 * hike across the field, and it keeps the south-east clear of the prop gallery.
 *
 * **The hall is deliberately not the factory's exterior.** It is the Phase 3
 * fixture: two rooms of very different acoustics that you walk between through
 * an open doorway, which is how the reverb crossfade is judged. Putting a
 * portal on it would replace a walk-through with a teleport and destroy the
 * only test that proves the crossfade works. So the factory is its own
 * building next door, and the machinery it is named for now stands *inside*
 * it, where you can get at it.
 */
const FACTORY_AT = new THREE.Vector3(42, 0, -11);
/** Yaw 0 faces +Z — you come at it from the south, as you do the hall. */
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
 * The gateway out to the village, west of spawn.
 *
 * Clear of the movement gym (which starts at x = -4 and runs west from z = -12)
 * by sitting south of it, and clear of the strafe wall's corner at z = 15.8.
 */
const GATE_AT = new THREE.Vector3(-9, 0, 24);
/** Faces +Z, so it is side-on as you walk west from spawn and obvious. */
const GATE_YAW = 0.35;

/** Interior dimensions, shared by the zone builder and the portal placement. */
// Roomy rather than snug. The first version was 6.4 x 5.2 and read as a
// cupboard the moment there was furniture in it — at eye height a room needs
// enough floor that you can walk *around* something, not just past it.
const EXAMPLE = { width: 10, depth: 8, height: 3.4 };
const FACTORY = { width: 15, depth: 11, height: 5.6 };

/** The factory's exterior footprint, which its doorway is measured from. */
const SHED_WIDTH = 16;
const SHED_DEPTH = 12;
const SHED_HEIGHT = 6.4;

const UP = new THREE.Vector3(0, 1, 0);

export interface TestWorld {
  zones: ZoneDefinition[];
  portals: PortalDefinition[];
}

export interface TestWorldOptions {
  /**
   * Builds the prop gallery, if wanted.
   *
   * Injected rather than imported because the gallery reads `art/registry`,
   * which uses `import.meta.glob` and therefore only exists under Vite. The
   * headless check imports this module through esbuild and omits it.
   */
  gallery?: () => THREE.Group;
}

export function createTestWorld(ground: ProvingGround, options: TestWorldOptions = {}): TestWorld {
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

  const factoryDoor = new THREE.Vector3(0, 0, SHED_DEPTH / 2 + DOOR_PROUD)
    .applyAxisAngle(UP, FACTORY_YAW)
    .add(FACTORY_AT);

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
        // The Phase 3 emitter garden, now declared rather than hand-wired.
        //
        // Positions come from `ground.anchors` rather than from the meshes
        // standing on them, because **a sound belongs to a place, not to
        // whichever prop happens to be there** — the props were replaced with
        // art-kit builders in Phase 4 and the anchors deliberately did not move.
        soundscape: {
          bed: { model: 'wind', id: 'wind', options: { gain: 0.17, tone: 3400 } },
          emitters: [
            // A big canopy: tuned down for broad heavy leaves, articulated very
            // lightly. Pulled in hard, because wind in a tree is a *local*
            // sound — at 34 m the whole field sounded like it had a tree in the
            // middle of it.
            {
              model: 'foliage',
              id: 'canopy',
              at: [ground.anchors.tree.x, ground.anchors.tree.y, ground.anchors.tree.z],
              options: { density: 240, tone: 0.8, gain: 0.42, articulation: 0.22 },
              refDistance: 2.5,
              maxDistance: 20,
              rolloff: 1.7,
              reverb: 0.35,
            },
            // The bushes are small, dry and quiet, with a much shorter reach —
            // they only exist when you are beside them.
            {
              model: 'foliage',
              id: 'shrub-a',
              at: [ground.anchors.bush.x, ground.anchors.bush.y, ground.anchors.bush.z],
              options: { density: 160, tone: 1.45, gain: 0.26, articulation: 0.34 },
              refDistance: 1.4,
              maxDistance: 14,
              reverb: 0.25,
            },
            {
              model: 'foliage',
              id: 'shrub-b',
              at: [9.2, 0.5, 16.8],
              options: { density: 160, tone: 1.45, gain: 0.26, articulation: 0.34 },
              refDistance: 1.4,
              maxDistance: 14,
              reverb: 0.25,
            },
            // Quiet, dull and wet: three things together read as "over there"
            // where any one of them alone reads as "turned down".
            {
              model: 'bird',
              id: 'bird',
              at: [ground.anchors.bird.x, ground.anchors.bird.y, ground.anchors.bird.z],
              options: { pitch: 2600, interval: 6, gain: 0.075, tone: 2800 },
              refDistance: 4,
              maxDistance: 38,
              rolloff: 1.4,
              reverb: 0.85,
            },
            // Heavy, slow and worn. The longest reach of anything here — the
            // point of it is to be heard through the hall wall before you find
            // it — but it carries across the yard, not across the map.
            {
              model: 'machine',
              id: 'mill',
              at: [ground.anchors.machine.x, ground.anchors.machine.y, ground.anchors.machine.z],
              options: { rpm: 52, fundamental: 42, gain: 0.4 },
              refDistance: 2.5,
              maxDistance: 34,
              rolloff: 1.8,
              reverb: 0.9,
              // The one sound in the zone the player is meant to walk toward,
              // so it holds a voice when the budget is tight.
              importance: 1.6,
            },
            // Standing water in the cell, which is the small sealed stone box
            // at x 19–27, z −4–4. Two reasons it lives there rather than out
            // in the open: a cistern is what a room like that would actually
            // contain, and the drips below need a long hard tail to be
            // anything at all.
            {
              model: 'water',
              id: 'cistern',
              at: [23, 0.2, 1.5],
              options: { flow: 'cistern', gain: 0.4, tone: 0.9 },
              refDistance: 1.5,
              maxDistance: 12,
              rolloff: 1.6,
              reverb: 1,
            },
          ],
          scatter: [
            // **The reason the room reads as a room.** Nearly all of what you
            // hear is the tail, so this runs almost no dry signal and a full
            // reverb send. Periodic rather than Poisson: water collects at a
            // fixed rate and falls at a fixed volume, and a drip scattered
            // randomly reads as several leaks instead of one.
            {
              sound: 'drip',
              id: 'seep',
              at: [22, 1.4, -0.5],
              spread: [0.3, 0, 0.3],
              every: 3.6,
              rhythm: 'periodic',
              force: [0.7, 1],
              voices: 1,
              options: { gain: 0.5, radius: [0.0019, 0.0027], cycles: 32 },
              refDistance: 2,
              maxDistance: 16,
              rolloff: 1.4,
              reverb: 1,
            },
            // A second, slower one across the room at an interval that shares
            // no factor with the first. Two independent drips never settle into
            // a pattern; one drip twice as fast is just a faster drip.
            {
              sound: 'drip',
              id: 'seep-far',
              at: [25.5, 1.4, 2.4],
              spread: [0.3, 0, 0.3],
              every: 7.1,
              rhythm: 'periodic',
              force: [0.5, 0.8],
              voices: 1,
              options: { gain: 0.4, radius: [0.0031, 0.0042], cycles: 26 },
              refDistance: 2,
              maxDistance: 16,
              rolloff: 1.4,
              reverb: 1,
            },
          ],
        } satisfies SoundscapeSpec,
      },
      spawn: { position: SPAWN.clone(), yaw: 0 },
      floor: -20,
      build() {
        const root = ground.root;
        root.add(markCollidable(hutMesh));
        root.add(buildFactoryExterior());

        // The arch the village door stands in. Placed by the same position and
        // yaw as the portal, so the two cannot drift apart.
        const arch = archway.build({ seed: 4711 });
        arch.position.copy(GATE_AT);
        arch.rotation.y = GATE_YAW;
        root.add(markCollidable(arch));

        if (options.gallery) root.add(options.gallery());
        return root;
      },
    },

    {
      id: ZONE_EXAMPLE,
      name: 'Example Interior',
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
      build: () => buildExampleInterior(),
    },

    {
      id: ZONE_FACTORY,
      name: 'The Factory',
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
        ambientGround: 0x3a3f44,
        ambientIntensity: 2,
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
      },
      spawn: { position: new THREE.Vector3(0, 0.1, 2), yaw: Math.PI },
      floor: -5,
      build: () => buildFactory(),
    },

    villageZone(),
  ];

  const portals: PortalDefinition[] = [
    {
      id: 'example-door',
      a: {
        zone: ZONE_EXTERIOR,
        position: hutDoor,
        yaw: HUT_YAW,
        material: 'timber',
        seed: 8801,
      },
      b: {
        zone: ZONE_EXAMPLE,
        // Set into the north wall, facing back into the room. This is the way
        // out — the same portal read from the other end.
        position: new THREE.Vector3(0, 0, -EXAMPLE.depth / 2 + DOOR_PROUD),
        yaw: 0,
        material: 'timber',
        seed: 8802,
      },
    },
    {
      id: 'factory-door',
      a: {
        zone: ZONE_EXTERIOR,
        position: factoryDoor,
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
      id: 'village-gate',
      a: {
        zone: ZONE_EXTERIOR,
        position: GATE_AT,
        yaw: GATE_YAW,
        material: 'timber',
        seed: 4712,
      },
      b: {
        zone: ZONE_VILLAGE,
        // On the lane at the north end of the valley, dropped onto the ground.
        // The arrival marker is derived a stride in front of this, which the
        // check confirms is walkable rather than halfway up the rim.
        position: VILLAGE_GATE.clone().setY(villageTerrain.heightAt(VILLAGE_GATE.x, VILLAGE_GATE.z)),
        yaw: Math.PI,
        material: 'timber',
        seed: 4713,
      },
    },
  ];

  return { zones, portals };
}

/**
 * The factory, from the outside.
 *
 * Hand-built rather than taken from the art kit: the kit has a `hut`, which is
 * a dwelling, and nothing at this scale. Crude on purpose — the point of this
 * fixture is the doorway in it. If more industrial buildings are ever wanted
 * this should become a builder so it lands in the gallery with everything else.
 */
function buildFactoryExterior(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'FactoryExterior';
  group.position.copy(FACTORY_AT);
  group.rotation.y = FACTORY_YAW;

  const stone = new THREE.MeshLambertMaterial({ color: PALETTE.STONE_DARK, flatShading: true });
  const iron = new THREE.MeshLambertMaterial({ color: PALETTE.IRON, flatShading: true });
  const dark = new THREE.MeshLambertMaterial({ color: 0x14161a, flatShading: true });

  const walls = new THREE.Mesh(new THREE.BoxGeometry(SHED_WIDTH, SHED_HEIGHT, SHED_DEPTH), stone);
  walls.position.y = SHED_HEIGHT / 2;
  group.add(walls);

  // A gable roof, overhanging the walls on every side.
  //
  // **Built by rotating the geometry, then seated by measuring it** — the same
  // way `hut` does it, and for the same two reasons it had to learn to.
  //
  // The first version set `rotation.x` and `rotation.z` on the *mesh*, which
  // composes them as an Euler triple in a fixed order rather than applying them
  // one after the other. The prism came out rotated about an axis that was no
  // longer where the previous rotation had left it, so it sat askew and cut
  // through its own walls. Geometry rotations are sequential and mean exactly
  // what they read as.
  //
  // The second reason is the seating. A prism rotated twice and then scaled has
  // an underside whose height is not obvious from any of those numbers, so any
  // guessed `position.y` buries the eaves or floats them. Measuring the bounding
  // box and lifting by exactly the shortfall puts the eave on the wall head
  // whatever the roof is next changed to.
  const ridge = 2.1;
  const roof = new THREE.CylinderGeometry(ridge, ridge, SHED_WIDTH * 1.08, 3, 1);
  // Lay the prism on its side, so its axis runs along the building's length.
  roof.rotateZ(Math.PI / 2);
  // Spin the triangular section a sixth of a turn so a flat face is downward —
  // an untouched three-sided prism rests on an edge, not a face.
  roof.rotateX(Math.PI / 6);
  // Stretch the section across the building's depth, with a little overhang.
  roof.scale(1, 1, (SHED_DEPTH * 1.1) / (ridge * 2));
  roof.computeBoundingBox();
  roof.translate(0, SHED_HEIGHT - (roof.boundingBox?.min.y ?? 0), 0);
  group.add(new THREE.Mesh(roof, iron));

  // The recess the portal door stands in. Set *into* the wall rather than
  // proud of it, so the door — which stands proud — is not fighting it.
  const recess = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.7, 0.3), dark);
  recess.position.set(0, 1.35, SHED_DEPTH / 2 - 0.13);
  group.add(recess);

  // A chimney, so the silhouette says works rather than barn. Placed off the
  // ridge line and tall enough to clear it.
  const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.78, 6.4, 8), stone);
  stack.position.set(SHED_WIDTH * 0.3, SHED_HEIGHT + 2.6, -SHED_DEPTH * 0.22);
  group.add(stack);

  return markCollidable(group);
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
function buildExampleInterior(): THREE.Group {
  const root = new THREE.Group();
  root.add(
    buildInterior({ ...EXAMPLE, seed: 4400, style: HOUSE_STYLE, planks: true, beams: 3 }),
  );

  const halfW = EXAMPLE.width / 2;
  const halfD = EXAMPLE.depth / 2;

  // Bed along the west wall. Beds are built lying along Z, so it needs no
  // rotation — only pushing back until it nearly touches the wall.
  place(root, bed.build({ seed: 3120 }), -halfW + 0.9, 0, -1.4, 0);
  place(root, stool.build({ seed: 415 }), -halfW + 1.1, 0, 0.7, 0.6);

  // Table and seating in the east half, clear of the door's approach.
  place(root, table.build({ seed: 2077 }), 2.2, 0, 0.6, 0.08);
  place(root, chair.build({ seed: 411 }), 2.1, 0, 2.1, Math.PI);
  place(root, chair.build({ seed: 412 }), 2.3, 0, -0.9, 0);
  place(root, stool.build({ seed: 413 }), 3.6, 0, 1.8, 0.4);

  // A side table against the south wall, with the clutter on it.
  place(root, table.build({ seed: 2078 }), -1.6, 0, halfD - 0.9, Math.PI);

  // Somebody home. Static — Phase 7 is where figures start moving — but a room
  // with a person standing in it reads completely differently from one without,
  // and this is the fixture the animation work will be judged against.
  place(root, figure.build({ seed: 6602 }), -0.2, 0, 2.4, Math.PI * 0.85);

  place(root, crate.build({ seed: 61 }), halfW - 0.9, 0, -halfD + 1, 0.4);
  place(root, crate.build({ seed: 66 }), halfW - 1, 0, -halfD + 2.3, 1.1);
  place(root, barrel.build({ seed: 63 }), -halfW + 0.7, 0, halfD - 0.9, -0.3);
  place(root, barrel.build({ seed: 67 }), halfW - 0.8, 0, halfD - 1, 0.2);

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
  root.add(buildInterior({ ...FACTORY, seed: 7700, style: WORKS_STYLE, planks: false, beams: 5 }));

  // Laid out in three lanes across the width: engines west, an open aisle up
  // the middle where the door lets you in, and storage east. The door is in the
  // north wall at x = 0, so the strip around z = -4 is kept clear — the check
  // verifies the arrival marker itself is not inside anything, and separately
  // that you can walk forward off it, which is what this lane is for.
  const engineX = -5.4;
  const postX = 4;

  // A row of engines along the west wall, turned to face the aisle. Different
  // seeds, so they read as the same kind of machine rather than as three
  // copies of one.
  place(root, machine.build({ seed: 3301 }), engineX, 0, -2.4, Math.PI / 2);
  place(root, machine.build({ seed: 3302 }), engineX, 0, 1.1, Math.PI / 2);
  place(root, machine.build({ seed: 3303 }), engineX, 0, 4.4, Math.PI / 2);

  // And one pulled out into the open, at an angle, part-way through being
  // worked on — the reason anyone would be in here.
  place(root, machine.build({ seed: 3304 }), 1.5, 0, 1.9, -0.35);
  place(root, crate.build({ seed: 71 }), 3.3, 0, 3.6, 0.3);
  place(root, barrel.build({ seed: 74 }), -0.4, 0, 3.4, 0);

  // Roof posts down the east side only. They give the hall something to
  // occlude sound with — the one thing in either interior that does — and a
  // second row down the west would stand inside the engines.
  for (const z of [-3, 0.5, 4]) {
    place(root, post.build({ seed: 100 + z * 7 }), postX, 0, z, 0);
  }

  // Storage along the east wall, clear of the posts.
  place(root, table.build({ seed: 7811 }), 6.2, 0, 0.6, -Math.PI / 2);
  place(root, crate.build({ seed: 72 }), 6.3, 0, -3.4, 1.2);
  place(root, crate.build({ seed: 73 }), 6, 0, 3.9, -0.6);
  place(root, barrel.build({ seed: 75 }), 6.4, 0, -1.9, 0.9);
  // Something growing where nothing should. The one soft thing in the room.
  place(root, bush.build({ seed: 76, scale: 0.7 }), -6.4, 0, -4.6, 0);

  return markCollidable(root);
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
