import * as THREE from 'three';
import { OUTDOOR_ENVIRONMENT, type ZoneDefinition } from '@engine/world/Zone';
import type { SoundscapeSpec } from '@engine/audio/Soundscape';
import type { PortalEnd, PortalDefinition } from '@engine/world/Portal';
import { markCollidable } from '@engine/player/Collider';
import { waterPlane } from '@engine/art/water';
import { signPost } from './galleries/layout';
import { createRng } from '@engine/art/random';

/**
 * Water Showcase 2: one enormous body of water, and the stress test.
 *
 * The first showcase is a bench — five basins and five races, each sized to the
 * one claim it settles, and none larger than a room. That is the right shape
 * for judging whether an effect is *correct* and says nothing about whether it
 * is affordable, because no view in it is more than a third water.
 *
 * A hundred and seventy metres of open sea running to the fog, horizon most of
 * the way up the frame, is very close to the worst case:
 *
 * - **Almost every pixel is water**, so the fragment cost is paid at full
 *   screen rather than over a pond-shaped patch of it.
 * - **Almost every one of those pixels marches**, because a near-planar surface
 *   at a grazing angle is where fresnel is high — sixteen steps and four
 *   refinements spent per pixel rather than skipped.
 * - **The mesh is a hundred thousand triangles in one draw call**, a second and
 *   independent cost, and the reason the segment size is a knob here.
 *
 * And it is a beach, not a rectangle of sea. Everything expensive about water
 * at this scale is bound up in what makes it *read* at this scale: the swell
 * has to taper as the bed comes up or waves drive through the sand, the
 * waterline has to meander or the shore is a ruled line a hundred metres long,
 * and there has to be a sandbar, because a beach with one line of foam at the
 * sand is a swimming pool. Walk in and you wade; keep walking and it gets deep.
 */

export const ZONE_WATER_SHOWCASE_2 = 'water-showcase-2';

/** Where the door stands, up the dry end of the beach. */
const DOOR_Z = 16;
/** How far out the sea runs before the fog closes over it. */
const SEA_FAR = -152;
/** Half the width of everything here. */
const SEA_HALF = 84;
/** Roughly where the water meets the sand, before the shoreline meanders. */
const SHORE_Z = -4;
/** Where the bar runs, parallel to the shore. */
const BAR_Z = -27;

/**
 * Metres per quad on the sea itself — **the stress knob**. At 0.7 m this is
 * about a hundred and twenty thousand triangles in a single draw call, which is
 * the number worth measuring; the shortest wave train is 2.6 m, so it is also
 * about the coarsest the mesh can be before that train reads as a zigzag.
 */
const SEA_SEGMENT = 0.7;

const SAND = new THREE.MeshLambertMaterial({ color: 0xa89877, flatShading: true });
const TIMBER = new THREE.MeshLambertMaterial({ color: 0x6b563c, flatShading: true });

/**
 * How much the shoreline wanders at a given point along the beach. Two
 * frequencies that do not divide evenly: one makes a wave, two make a coast.
 * Without it the waterline is a straight edge a hundred and seventy metres
 * long, which the foam band draws attention to rather than hides.
 */
function meander(x: number): number {
  return 0.4 * Math.sin(x * 0.042) + 0.22 * Math.sin(x * 0.115 + 1.7);
}

/**
 * The sea bed, and the sand above it. Three pieces, in the order they matter:
 *
 * 1. **Above the waterline**, sand rising at about three degrees — gentle
 *    enough to walk without thinking about it, steep enough that the beach is
 *    plainly a slope rather than a floor with water on one end.
 * 2. **Below it**, deepening to seven metres over ninety, with a slight power
 *    curve, because a real profile is concave and steepest near the shore.
 * 3. **The bar**, a ridge parallel to the shore coming up to within about a
 *    hand's depth of the surface. The swell tapers with depth, so it shrinks
 *    over the bar and reforms in the trough behind it, and the thin water on
 *    top is deep inside the foam band — which draws a broken line of white a
 *    long way offshore. That line is most of what makes this read as open coast.
 */
function bedAt(x: number, z: number): number {
  const wander = meander(x);
  const shore = SHORE_Z + wander * 3;
  if (z >= shore) return (z - shore) * 0.055;

  // Concave, which is the way round a real beach goes: steepest at the shore
  // and flattening as it runs out. The other way about leaves twenty-five
  // metres of ankle-deep flat with nowhere near the sand deep enough to carry
  // a wave.
  const out = Math.min((shore - z) / 95, 1);
  const deep = -7 * out ** 0.8;
  const bar = 1.35 * Math.exp(-(((z - BAR_Z) / 8) ** 2));
  return deep + bar + wander * 0.25;
}

/** Smoothstep on a fraction that may run past either end. */
function ease(t: number): number {
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * (3 - 2 * c);
}

/**
 * How big the swell is at a point. **Two terms, and keeping them separate is
 * the whole of it.**
 *
 * - **How far out you are** sets how much swell there is, climbing evenly over
 *   seventy metres. Nothing about the bed enters into this, so nothing in the
 *   bed can put a step in it.
 * - **How much water there is** then caps it, over the last metre and a bit of
 *   depth. This is the physical part: waves die where there is no water to
 *   carry them. The cap is soft, so the bar dips the swell by a third as it
 *   passes over rather than switching it off.
 *
 * Driving height from depth alone inherits every step in the bed profile — a
 * bar means depth goes up, down over the ridge, and up again — and gives a sea
 * that starts all at once about thirty feet out.
 *
 * The floor is not zero either. Water that goes perfectly flat inshore reads as
 * a different material meeting the sea along a line; a couple of centimetres of
 * texture reads as shallow water.
 */
function swellAt(x: number, z: number): number {
  const carried = ease(-bedAt(x, z) / 1.4);
  const offshore = Math.min(Math.max((SHORE_Z - z) / 70, 0), 1);
  return 0.25 + 2.75 * carried * offshore;
}

/**
 * A groyne: a line of posts running down the beach and out into the water.
 *
 * Three jobs, and the third is the one it is here for. It breaks the run of the
 * shore so the beach is not one uninterrupted wedge; it gives the foam an edge
 * to wrap, which is where depth-difference shading is easiest to judge; and it
 * is **something for the reflection to find**. An empty sea reflects sky
 * everywhere, which is the screen-space march's miss case, so a sea with
 * nothing standing in it would exercise the expensive path and never show
 * whether it works.
 */
function groyne(seed: number, x: number): THREE.Object3D[] {
  const rng = createRng(seed);
  const posts: THREE.Object3D[] = [];
  for (let z = 3; z > -26; z -= 2.1) {
    const bed = bedAt(x, z);
    // Standing clear of the water by a diminishing amount as it goes out, so
    // the line of them sinks into the sea rather than stopping at a wall.
    const above = Math.max(1.5 + z * 0.03, 0.35);
    const height = above - bed;
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.28, height, 0.28), TIMBER);
    post.position.set(x + rng.range(-0.12, 0.12), bed + height / 2, z);
    post.rotation.y = rng.range(-0.2, 0.2);
    posts.push(markCollidable(post));
  }
  return posts;
}

/**
 * Wind and surf. The surf is one source well out in the water rather than a
 * line of them along the shore: a beach is heard as a single broad thing, and
 * five copies of one model spread across a hundred metres is a wash. Its reach
 * is long and its rolloff shallow, which is right for the one sound here that
 * is genuinely the size of the room.
 */
const SEA_SOUND: SoundscapeSpec = {
  bed: { model: 'wind', id: 'wind', options: { gain: 0.2, tone: 3000 } },
  emitters: [
    {
      model: 'water',
      id: 'surf',
      at: [0, 0.2, BAR_Z],
      options: { flow: 'stream', rate: 0.85, gain: 0.42 },
      refDistance: 14,
      maxDistance: 120,
      rolloff: 0.8,
      reverb: 0.2,
    },
  ],
};

export function waterShowcase2Zone(): ZoneDefinition {
  return {
    id: ZONE_WATER_SHOWCASE_2,
    name: 'Water Showcase 2',
    group: 'general',
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      // **Opened right out, which is part of the test.** Fog is what usually
      // rescues a scene like this by hiding most of it; pulled back to the far
      // plane, the water is drawn all the way to the horizon and pays for every
      // pixel of it.
      fogNear: 90,
      fogFar: 300,
      // Pale bounce off wet sand.
      ambientGround: 0xa3937a,
      surface: 'sand',
      room: 'open',
      soundscape: SEA_SOUND,
    },
    spawn: { position: new THREE.Vector3(0, bedAt(0, DOOR_Z - 2) + 0.1, DOOR_Z - 2), yaw: 0 },
    floor: -30,
    groundAt: bedAt,
    build() {
      const root = new THREE.Group();

      // The bed, at four metres a quad. Coarse against the sea's own mesh and
      // deliberately so: this is the surface the *collider* indexes, and
      // `world/floor.ts` records what happens to an octree when the triangles
      // it is fed span a third of the level.
      const width = SEA_HALF * 2;
      const depth = DOOR_Z + 8 - SEA_FAR;
      const geometry = new THREE.PlaneGeometry(
        width,
        depth,
        Math.round(width / 4),
        Math.round(depth / 4),
      );
      geometry.rotateX(-Math.PI / 2);
      const middleZ = (DOOR_Z + 8 + SEA_FAR) / 2;
      const position = geometry.getAttribute('position');
      for (let i = 0; i < position.count; i++) {
        position.setY(i, bedAt(position.getX(i), position.getZ(i) + middleZ));
      }
      position.needsUpdate = true;
      geometry.computeVertexNormals();

      const bed = new THREE.Mesh(geometry, SAND);
      bed.name = 'seabed';
      bed.position.z = middleZ;
      // Ground: a plane this size can only ever shadow itself, which is acne.
      bed.userData.ground = true;
      root.add(markCollidable(bed));

      // **The sea.** One plane, one draw call, and the thing being measured.
      root.add(
        waterPlane({
          width: width + 8,
          depth: DOOR_Z - SEA_FAR + 8,
          at: new THREE.Vector3(0, 0, (DOOR_Z + SEA_FAR) / 2),
          chop: swellAt,
          // Running square at the sand, slowly. A swell is a direction far more
          // than it is a current, and the drift is what carries the foam in.
          flow: new THREE.Vector2(0, 0.5),
          segment: SEA_SEGMENT,
        }),
      );

      for (const [i, x] of [-46, 21, 63].entries()) {
        for (const post of groyne(8210 + i * 37, x)) root.add(post);
      }

      const post = signPost('open-sea');
      post.position.set(-2.2, bedAt(-2.2, DOOR_Z - 1.5), DOOR_Z - 1.5);
      root.add(post);

      return root;
    },
  };
}

export function waterShowcase2Door(): PortalEnd {
  return {
    zone: ZONE_WATER_SHOWCASE_2,
    // Standing on the sand, so the door is on the beach rather than sunk in it.
    position: new THREE.Vector3(0, bedAt(0, DOOR_Z), DOOR_Z),
    // Faces -Z, out to sea, which puts the arrival looking down the beach.
    yaw: Math.PI,
    material: 'timber',
    seed: 6801,
  };
}

export function waterShowcase2Portal(hub: PortalEnd): PortalDefinition {
  return { id: `portal:${ZONE_WATER_SHOWCASE_2}`, a: hub, b: waterShowcase2Door() };
}
