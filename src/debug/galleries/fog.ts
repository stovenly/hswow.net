import * as THREE from 'three';
import type { GalleryPlan } from './layout';
import { signPost } from './layout';
import { markCollidable } from '../../player/Collider';

/**
 * The Fog Showcase: where placed fog volumes are judged.
 *
 * Volumes make three claims (SHADERS-AND-MATERIALS.md §2), and all three are claims about
 * what something looks like from inside a room, which no headless check can
 * settle. So each gets a station, and each station has the *geometry* the claim
 * needs — because a volume alone proves nothing. Mist with nothing standing in
 * it is a grey patch; the pillar is what shows the mist is in front of some of
 * the pillar and behind the rest of it.
 *
 * - **The pool.** A pillar stands in it and the player walks through it. This
 *   is the depth test: a volume that failed it would be a flat disc painted
 *   over the pillar, and the difference is visible in one step sideways.
 * - **The bank.** A ridge with its ends left showing, and a volume wrapped
 *   round the ridge. The claim is that a cloud hides where backdrop geometry
 *   stops, which is what lets a small zone claim a large landform — so the
 *   ridge is deliberately too short, and the bank is what makes that read as
 *   distance rather than as an unfinished model.
 * - **The plume.** A chimney with a thin column over it, drifting on the wind
 *   the trees answer. This is the one that shows the noise has vertical
 *   structure: a plume made from noise that only varies horizontally is a
 *   column of even haze, and there is nowhere to hide that.
 *
 * **The fixtures are rough on purpose.** A pillar, a ridge and a chimney, in
 * three boxes' worth of geometry each. They exist to be occluded by fog and to
 * give it something to sit against; a well-modelled chimney would prove nothing
 * a crate does not, and this is a dev room that has never pretended otherwise.
 *
 * The room's own distance fog is the gallery default, deliberately: the volumes
 * have to hold up *over* the haze that is already there, since that is the
 * situation in every real zone.
 */

export const ZONE_FOG_SHOWCASE = 'fog-showcase';

/** Rough grey stone for every fixture here. See the header on why they are rough. */
const STONE = new THREE.MeshLambertMaterial({ color: 0x8b8577, flatShading: true });

/**
 * Where the three stations stand, along the rank the rows would have run down.
 *
 * Chosen against the room's own distance fog, which closes at about 25 m and is
 * total by 55. The pool sits in clear air, because the depth test it exists to
 * show has to be read without haze helping. The bank sits at forty-odd metres —
 * far enough that the distance fog is doing real work on it, which is the whole
 * claim, and near enough that it has not dissolved into the fog altogether.
 */
const POOL_Z = -6;
const BANK_Z = -26;
const PLUME_Z = -18;

function block(
  width: number,
  height: number,
  depth: number,
  x: number,
  y: number,
  z: number,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), STONE);
  mesh.position.set(x, y + height / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** A pillar to stand in the mist, tall enough that its top is clear of it. */
function pillar(): THREE.Group {
  const group = new THREE.Group();
  group.add(block(0.9, 0.35, 0.9, 0, 0, 0));
  group.add(block(0.62, 4.2, 0.62, 0, 0.35, 0));
  group.add(block(0.9, 0.3, 0.9, 0, 4.55, 0));
  return group;
}

/**
 * A ridge whose ends are meant to show.
 *
 * Three blocks stepping down, and then it simply stops — which is the whole
 * fixture. What the bank has to do is make that stop unreadable.
 */
function ridge(): THREE.Group {
  const group = new THREE.Group();
  group.add(block(14, 7, 5, -6, 0, 0));
  group.add(block(12, 5, 5, 5, 0, -1.5));
  group.add(block(9, 3.2, 4.5, 14, 0, 0.5));
  return group;
}

/** A chimney for the plume to leave. */
function chimney(): THREE.Group {
  const group = new THREE.Group();
  group.add(block(2.4, 0.4, 2.4, 0, 0, 0));
  group.add(block(1.5, 5.4, 1.5, 0, 0.4, 0));
  group.add(block(1.9, 0.45, 1.9, 0, 5.8, 0));
  return group;
}

export const fogShowcasePlan: GalleryPlan = {
  id: ZONE_FOG_SHOWCASE,
  group: 'general',
  name: 'Fog Showcase',
  // No builder rank. Nothing in the art kit makes fog: the whole subject of
  // this room is a pass, not a prop.
  builders: [],

  fogVolumes: [
    // --- the pool ----------------------------------------------------------
    // Wide and shallow, sitting on the floor with its centre below it, so what
    // is in the room is the top of a much larger volume — which is how a mist
    // pool actually reads. Centred short of the pillar rather than on it: mist
    // that happens to be centred on the one thing standing in it hides the
    // depth test instead of demonstrating it.
    {
      shape: 'ellipsoid',
      center: new THREE.Vector3(-9, -1.2, POOL_Z),
      size: new THREE.Vector3(9, 3.4, 9),
      density: 0.55,
      tint: '#b9c6cc',
      softness: 0.75,
      noiseScale: 5,
      turbulence: 0.65,
      // Its own slow drift rather than the wind. This is the indoor case, and
      // a pool creeping along at walking pace reads as a draught nobody can
      // feel — see `FogVolume.drift`.
      drift: new THREE.Vector2(0.05, 0.03),
    },

    // --- the bank ----------------------------------------------------------
    // A box rather than an ellipsoid, and wide enough to run past both ends of
    // the ridge. An ellipsoid tight to the ridge would put the cloud's own
    // curvature where the landform's silhouette should be, which is the
    // failure this station exists to catch.
    {
      shape: 'box',
      center: new THREE.Vector3(4, 4.5, BANK_Z),
      size: new THREE.Vector3(26, 5, 7),
      density: 0.3,
      tint: '#ccd6e0',
      softness: 0.85,
      noiseScale: 14,
      turbulence: 0.55,
    },

    // --- the plume ---------------------------------------------------------
    // Tall, thin, and centred well above the chimney it leaves: a plume is
    // mostly the part that has already risen. Turbulence high and the billow
    // small, because this is the volume whose job is to show that the noise has
    // vertical structure at all.
    {
      shape: 'ellipsoid',
      center: new THREE.Vector3(12, 8.5, PLUME_Z),
      size: new THREE.Vector3(2.4, 6, 2.4),
      density: 0.5,
      tint: '#d8d2c6',
      softness: 0.9,
      noiseScale: 3,
      turbulence: 0.85,
      // No drift of its own, so it answers the wind — the point of the station
      // being that it leans the same way the trees outside do.
    },
  ],

  extras() {
    const extras: THREE.Object3D[] = [];

    /** A fixture and the post that names it for the tooltip. */
    const at = (object: THREE.Object3D, name: string, x: number, z: number): void => {
      object.position.set(x, 0, z);
      extras.push(markCollidable(object));
      const post = signPost(name);
      post.position.set(x, 0, z + 3);
      extras.push(post);
    };

    // In the pool, not beside it: the pillar has to be the thing the mist is
    // measured against.
    at(pillar(), 'mist-pool', -6, POOL_Z);
    at(chimney(), 'plume', 12, PLUME_Z);
    // The ridge's post stands well clear, because walking up to the ridge is
    // walking into the bank, and the caption should be readable from outside it.
    at(ridge(), 'cloud-bank', 4, BANK_Z);

    return extras;
  },
};
