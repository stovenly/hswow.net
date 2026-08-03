import * as THREE from 'three';
import { OUTDOOR_ENVIRONMENT, type ZoneDefinition } from '../world/Zone';
import { SILENCE } from '../audio/Soundscape';
import type { PortalDefinition, PortalEnd } from '../world/Portal';
import type { SurfaceName } from '../audio/models/footsteps';
import { GROUND, type GroundName } from '../world/ground';
import { flatGround, gridMap, GRID_TILE } from '../world/floor';
import { signboard, type SignboardOptions } from '../art/builders/signboard';

/**
 * The Footsteps Showcase: one long strip of every surface, side by side.
 *
 * Footsteps are the only sound in the game that happens *at* the listener and
 * the only one with no object to look at, so every other showcase's method —
 * stand in front of the thing and listen — does not apply. What you need
 * instead is **ground you can cover at speed**, because half of what a surface
 * sounds like is its cadence, and a two-metre patch tells you nothing a single
 * step does not.
 *
 * So: a strip per material, five metres wide and forty-four long. Wide enough
 * to sprint down without steering, long enough that a stride settles, and
 * contiguous, so crossing from one to the next is a step rather than a walk.
 *
 * **The order is the set of comparisons worth making.** Neighbours are the pairs
 * that are hard to tell apart or that ought to be obvious and are not:
 *
 * - `flagstone | cobble | rubble | gravel | sand` — **one axis, five points.**
 *   The aggregate family is a single question — how big are the pieces, and are
 *   they fixed — asked at five grain sizes from a slab down to dust. Adjacent
 *   pairs should be tellable apart; the ends should not be comparable.
 * - `dirt | mire | shallows` — dry, wet, and under water. Mud was the wet slap
 *   for the whole project's life; the question is whether the shallows are
 *   audibly a *splash* rather than a louder one, and whether mud gloops where
 *   water plinks.
 * - `moss | turf | leaflitter | snow` — soft, in ascending order of noise. Moss
 *   should be very nearly silent without being absent; snow should compress
 *   rather than crunch.
 * - `boards | plate | grating | pipework | hollowmetal` — the five that ring,
 *   and the only five allowed to. Wood hollow, sheet metal bright and dead,
 *   grating clanging, pipe knocking, tank booming. The last two are the same
 *   box at two sizes, which in a hollow body is almost entirely pitch and
 *   ring-down. If any of the twelve to their left sounds like a board, the
 *   fault is in that surface and not in this one.
 *
 * Nothing stands on the ground and nothing is emitted in the air. A prop here
 * would be something to look at while listening, which is the opposite of what
 * the room is for, and the soundscape is `SILENCE` for the same reason.
 *
 * **Colour comes from `GROUND`, not from a table here.** That module's claim is
 * that a material is a colour *and* a sound, held together so they cannot drift
 * — so a strip names a ground material and takes both from it. A strip whose
 * paint and footfall disagreed would be the one bug this room cannot show you.
 */

export const ZONE_FOOTSTEPS_SHOWCASE = 'footsteps-showcase';

/**
 * Ground materials, left to right. See the header for why this order.
 *
 * Read as a walk: hard stone down through the aggregate family by grain size,
 * then wet, then soft, then the two things that genuinely ring.
 */
const STRIPS: readonly GroundName[] = [
  'flagstone',
  'cobble',
  'rubble',
  'gravel',
  'sand',
  'dirt',
  'mire',
  'shallows',
  'moss',
  'turf',
  'leaflitter',
  'snow',
  'boards',
  'plate',
  'grating',
  'pipework',
  'hollowmetal',
];

/** Wide enough to run down without steering into the neighbour. */
const STRIP_WIDTH = 4;
/** Half the run. A sprint covers this in three seconds. */
const HALF_LENGTH = 22;
const HALF_FIELD = (STRIPS.length * STRIP_WIDTH) / 2;

/** Where the door stands, and the depth of clear apron in front of it. */
const DOOR_Z = 26;
/** Signs stand at the head of their own strip, facing the door. */
const SIGN_Z = HALF_LENGTH + 0.5;

/**
 * Big enough that the fog closes before the edge does, and no bigger — the
 * collider indexes every quad of it.
 */
const FLOOR = 160;

/**
 * What the apron and everything off the field is made of.
 *
 * Flagstone, so the walk to the strips is the surface the first strip is, and
 * stepping onto it is silent. A neutral third material here would be a
 * thirteenth surface nobody asked to compare.
 */
const APRON: SurfaceName = 'stone';

/**
 * A material strip, laid a hair above the floor.
 *
 * Not collidable and not thick: the gridded floor underneath carries collision
 * for the whole room, and a raised slab would put a five-centimetre kerb
 * between neighbours, which is the one thing that would make crossing between
 * two surfaces sound like something other than crossing between two surfaces.
 */
function strip(ground: GroundName, centreX: number): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(STRIP_WIDTH, HALF_LENGTH * 2, 2, 12);
  geometry.rotateX(-Math.PI / 2);

  // World-unit UVs, the way `flatGround` writes them, so the grid runs
  // unbroken across the strips and the floor around them.
  const uv = geometry.getAttribute('uv');
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(
      i,
      ((uv.getX(i) - 0.5) * STRIP_WIDTH + centreX) / GRID_TILE,
      (uv.getY(i) - 0.5) * ((HALF_LENGTH * 2) / GRID_TILE),
    );
  }
  uv.needsUpdate = true;

  const material = new THREE.MeshLambertMaterial({ color: GROUND[ground].color });
  material.map = gridMap();

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = `strip:${ground}`;
  mesh.position.set(centreX, -0.01, 0);
  return mesh;
}

function sign(seed: number, text: string): SignboardOptions {
  return { seed, text };
}

/** The surface under a position: the strip it is on, or the apron. */
function surfaceAt(x: number, z: number): SurfaceName {
  if (z < -HALF_LENGTH || z > HALF_LENGTH) return APRON;
  const index = Math.floor((x + HALF_FIELD) / STRIP_WIDTH);
  if (index < 0 || index >= STRIPS.length) return APRON;
  return GROUND[STRIPS[index]].step;
}

export function footstepsShowcaseZone(): ZoneDefinition {
  return {
    id: ZONE_FOOTSTEPS_SHOWCASE,
    name: 'Footsteps Showcase',
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      // Closing well inside the floor's half-width, so the edge never shows,
      // and beyond the far end of the strips, so the run has somewhere to go.
      fogNear: 34,
      fogFar: 76,
      ambientGround: 0xbfb298,
      surface: APRON,
      room: 'open',
      // **Nearly dry, deliberately.** A tail on your own boots is what tells you
      // which room you are in, and in here it is the one thing that would blur
      // the comparison this zone exists to make — a reverb tail on a footstep
      // is itself a hollow ring, and telling it apart from the material's own
      // is the whole task.
      footstepReverb: 0.12,
      soundscape: SILENCE,
    },
    spawn: { position: new THREE.Vector3(0, 0.1, DOOR_Z - 2), yaw: Math.PI },
    floor: -20,
    groundAt: () => 0,
    surfaceAt,
    build() {
      const root = new THREE.Group();
      // Below the strips by five centimetres rather than the usual centimetre,
      // so nothing z-fights along forty-four metres of grazing angle.
      root.add(flatGround(FLOOR, { y: -0.06 }));

      STRIPS.forEach((ground, index) => {
        const centreX = -HALF_FIELD + (index + 0.5) * STRIP_WIDTH;
        root.add(strip(ground, centreX));

        // Named by the *surface*, not the ground material: what is being
        // compared here is the footstep model, and two grounds can share one.
        const board = signboard.build(sign(7300 + index * 13, GROUND[ground].step.toUpperCase()));
        board.position.set(centreX, 0, SIGN_Z);
        root.add(board);
      });

      return root;
    },
  };
}

/** The showcase side of the door. See `props.ts` for where the other end is. */
export function footstepsShowcaseDoor(): PortalEnd {
  return {
    zone: ZONE_FOOTSTEPS_SHOWCASE,
    position: new THREE.Vector3(0, 0, DOOR_Z),
    // Facing -Z, so arriving puts the whole rank of strips ahead of you and the
    // signs at reading distance.
    yaw: Math.PI,
    material: 'iron',
    seed: 7290,
  };
}

export function footstepsShowcasePortal(hub: PortalEnd): PortalDefinition {
  return { id: 'footsteps-showcase-door', a: hub, b: footstepsShowcaseDoor() };
}
