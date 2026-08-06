import * as THREE from 'three';
import { COLLISION_LAYER } from '../layers';
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import type { SurfaceName } from '../audio/models/footsteps';

/**
 * The static collision world.
 *
 * three ships an `Octree` that indexes raw triangles, and that broad phase is
 * exactly what's wanted: triangles are the common denominator, so authored
 * walls, ramps and stairs all reduce to them, and so will the sculpted terrain
 * in Phase 5. There is only ever one collision path to reason about.
 *
 * The narrow phase is ours. `Octree.capsuleIntersect` decides penetration from
 * the capsule's distance to the triangle's *plane*, which is wrong wherever a
 * capsule stands beside a small horizontal face: the tread of a stair reports
 * the capsule as half a metre inside it and launches the player. Replacing it
 * with a proper closest-point test bounds every push by the capsule radius,
 * which is what makes stairs climb and slope feet stop wedging.
 *
 * Only meshes on the collision layer are indexed. That keeps decoration and
 * debug fixtures out of the collision set without a parallel scene graph.
 */

/**
 * Re-exported so the collider's own callers need not know where layer numbers
 * live; the number itself belongs to `src/layers.ts`, which is the one place
 * they are handed out. See that file for why it is not defined here any more.
 */
export { COLLISION_LAYER };

export interface Contact {
  /** Unit vector pointing out of the surface, toward the capsule. */
  normal: THREE.Vector3;
  /** How far the capsule has to move along the normal to be clear. */
  depth: number;
  /**
   * What the triangle is made of, or null if it is ground or something with no
   * material of its own. See `SurfacedTriangle`.
   */
  surface: SurfaceName | null;
}

/**
 * A collision triangle that remembers which prop it was cut from.
 *
 * **This is how the game knows what it is standing on**, and it is one field
 * because the collider is already the authority: the thing holding the player
 * up is, by definition, the thing they last pushed out of. Nothing else has to
 * be asked, nothing has to be searched for, and there is no way for the answer
 * to disagree with the physics.
 *
 * The alternative was to ask the geometry afterwards — sweep the props near the
 * player's feet and work out which one the sole is resting on — and it is both
 * slower and worse. Slower because it re-walks triangles the collider has
 * already sorted; worse because it is a *second* opinion about contact, and a
 * second opinion is wrong exactly when it matters: at the instant of landing,
 * on a curve, on anything narrow.
 */
interface SurfacedTriangle extends THREE.Triangle {
  surface: SurfaceName | null;
}

/**
 * Marks a subtree as solid. Call before building the collider.
 *
 * A subtree flagged `userData.noCollide` is skipped, along with everything
 * under it. Builders return one object and callers mark the whole of it, which
 * is right for the parts of a prop that are made of wood or stone and wrong for
 * the parts that are not made of anything — a street lamp's beam of light is
 * geometry, and without an opt-out the player would walk into it and stop.
 *
 * Recursive rather than `traverse`, because `traverse` has no way to prune: it
 * would skip the flagged node and then carry on into its children anyway.
 *
 * **This can only take a prop whole or leave it whole**, which is why the rule
 * about what a prop is made of lives with the builder rather than here — see the
 * collision section of `art/assemble`. By the time a mesh reaches this function
 * its parts have been merged into one buffer and nothing can tell a door's leaf
 * from the rivets on it. A builder that wants only part of itself to be solid
 * has to say so while it is still being built.
 */
export function markCollidable<T extends THREE.Object3D>(object: T): T {
  mark(object);
  return object;
}

function mark(node: THREE.Object3D): void {
  if (node.userData.noCollide === true) return;
  node.layers.enable(COLLISION_LAYER);
  for (const child of node.children) mark(child);
}

const _candidates: THREE.Triangle[] = [];
const _axis = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _planePoint = new THREE.Vector3();
const _reference = new THREE.Vector3();
const _centre = new THREE.Vector3();
const _closest = new THREE.Vector3();
const _offset = new THREE.Vector3();
const _segment = new THREE.Line3();
const _contact: Contact = { normal: new THREE.Vector3(), depth: 0, surface: null };
const _corner = new THREE.Vector3();

interface Index {
  octree: Octree;
  triangles: number;
}

export class Collider {
  private index: Index = { octree: new Octree(), triangles: 0 };
  /**
   * One index per zone, kept.
   *
   * **Zones are entered far more often than they change.** Indexing the
   * exterior takes about 140 ms and terrain pushes that well past the fade's
   * third of a second of black — so rebuilding on every crossing meant a visible
   * hitch at every doorway, paid over and over for geometry that had not moved
   * since the last time. Building once per zone and swapping the reference makes
   * a crossing free.
   *
   * The cost is memory: every zone the player has visited keeps its octree. For
   * a world of this size that is a few megabytes, and the alternative was
   * spending a tenth of a second on every threshold forever.
   *
   * A zone whose geometry genuinely changes must call `invalidate` — nothing
   * here can detect a mutated scene graph, and a stale index is a player walking
   * through a wall that is visibly in front of them.
   */
  private readonly cache = new Map<string, Index>();

  /**
   * Points the collider at `root`, building and caching under `key`.
   *
   * Without a key it builds every time and caches nothing, which is what the
   * checks want — they construct throwaway colliders over throwaway scenes.
   */
  build(root: THREE.Object3D, key?: string): void {
    if (key !== undefined) {
      const cached = this.cache.get(key);
      if (cached) {
        this.index = cached;
        return;
      }
    }
    const index = Collider.index(root);
    if (key !== undefined) this.cache.set(key, index);
    this.index = index;
  }

  /**
   * Indexes `root` into the cache *without* switching to it.
   *
   * For paying a zone's build cost during the loading screen instead of behind
   * the fade the first time somebody opens its door.
   */
  warm(root: THREE.Object3D, key: string): void {
    if (this.cache.has(key)) return;
    this.cache.set(key, Collider.index(root));
  }

  /** Drops a cached index, so the next entry rebuilds it. */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  private static index(root: THREE.Object3D): Index {
    const octree = new Octree();
    octree.layers.disableAll();
    octree.layers.enable(COLLISION_LAYER);
    // Not `octree.fromGraphNode`, which is the same walk without the one thing
    // wanted here: three's triangles do not remember which mesh they came from,
    // and that is the whole of what a footstep needs to know.
    cut(octree, root);
    octree.build();
    return { octree, triangles: countTriangles(octree) };
  }

  /** How much geometry is indexed — worth watching once zones stream in. */
  get triangles(): number {
    return this.index.triangles;
  }

  /**
   * The deepest surface the capsule is inside, or null if it is clear.
   *
   * One contact rather than a summed push: the caller re-queries after moving,
   * so a corner resolves over successive passes instead of by adding two
   * normals together and landing somewhere neither of them wanted.
   *
   * The returned object is reused between calls.
   */
  intersectCapsule(capsule: Capsule): Contact | null {
    _candidates.length = 0;
    this.index.octree.getCapsuleTriangles(capsule, _candidates);

    let deepest = 0;
    let hit: SurfacedTriangle | null = null;

    for (const triangle of _candidates) {
      const depth = penetration(capsule, triangle);
      if (depth <= deepest) continue;
      deepest = depth;
      hit = triangle as SurfacedTriangle;
      _contact.normal.copy(_offset);
    }

    if (deepest === 0 || !hit) return null;
    _contact.depth = deepest;
    _contact.surface = hit.surface ?? null;
    return _contact;
  }

  /** True if the capsule is inside anything. Stops at the first hit. */
  overlaps(capsule: Capsule): boolean {
    _candidates.length = 0;
    this.index.octree.getCapsuleTriangles(capsule, _candidates);
    for (const triangle of _candidates) {
      if (penetration(capsule, triangle) > 0) return true;
    }
    return false;
  }

  /**
   * Nearest surface along a ray. Phase 3 uses this for audio occlusion and
   * Phase 8 for the interaction cursor.
   */
  raycast(origin: THREE.Vector3, direction: THREE.Vector3): number | null {
    // rayIntersect returns `undefined` for a zero-length direction and `false`
    // for a miss, so neither can be tested for on its own.
    const hit = this.index.octree.rayIntersect(new THREE.Ray(origin, direction)) as
      | { distance: number }
      | false
      | undefined;
    return hit ? hit.distance : null;
  }
}

/**
 * Capsule against one triangle. Returns how deep it is inside, or 0 if clear,
 * and writes the unit push-out direction into `_offset`.
 *
 * The capsule is reduced to the single sphere that sits closest to the
 * triangle, after which it is an ordinary sphere-triangle test. Finding that
 * sphere is the whole trick: cross the capsule's axis with the triangle plane
 * to get a point on the axis roughly opposite the triangle, clamp that onto
 * the triangle to get a reference point, then take the point on the axis
 * closest to the reference. Faces, edges and vertices all fall out of it.
 */
function penetration(capsule: Capsule, triangle: THREE.Triangle): number {
  triangle.getNormal(_normal);
  _axis.subVectors(capsule.end, capsule.start);

  const denominator = _normal.dot(_axis);
  let along = 0;
  if (Math.abs(denominator) > 1e-6) {
    along = _normal.dot(_planePoint.subVectors(triangle.a, capsule.start)) / denominator;
    along = Math.min(Math.max(along, 0), 1);
  }

  _planePoint.copy(capsule.start).addScaledVector(_axis, along);
  triangle.closestPointToPoint(_planePoint, _reference);

  _segment.set(capsule.start, capsule.end);
  _segment.closestPointToPoint(_reference, true, _centre);
  triangle.closestPointToPoint(_centre, _closest);

  _offset.subVectors(_centre, _closest);
  const distance = _offset.length();
  if (distance >= capsule.radius) return 0;

  if (distance > 1e-6) {
    _offset.divideScalar(distance);
  } else {
    // Dead centre on the surface — no direction to recover from the offset, so
    // take the triangle's own.
    _offset.copy(_normal);
  }

  // Reject contacts from behind the face. Every collidable here is a closed
  // solid, so being behind one means already inside it, and pushing along a
  // normal that points further in would eject the player through the far side.
  if (_offset.dot(_normal) <= 0) return 0;

  return capsule.radius - distance;
}

/**
 * Cuts every collidable mesh under `root` into triangles and adds them to the
 * octree, each one carrying its mesh's material.
 *
 * A copy of three's `Octree.fromGraphNode` — same traversal, same layer test,
 * same handling of indexed geometry — with the surface stamped on and without
 * the `build()` at the end, so the caller can add from more than one root.
 */
function cut(octree: Octree, root: THREE.Object3D): void {
  root.updateWorldMatrix(true, true);

  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || !octree.layers.test(object.layers)) return;

    const indexed = object.geometry.index !== null;
    const geometry = indexed ? object.geometry.toNonIndexed() : object.geometry;
    const position = geometry.getAttribute('position');
    // Set once per mesh rather than per triangle: it is the same string for
    // every face of a prop, and a prop is thousands of faces.
    const surface = (object.userData.underfoot as SurfaceName | undefined) ?? null;

    for (let i = 0; i + 2 < position.count; i += 3) {
      const triangle = new THREE.Triangle() as SurfacedTriangle;
      for (const [corner, target] of [triangle.a, triangle.b, triangle.c].entries()) {
        target
          .copy(_corner.fromBufferAttribute(position, i + corner))
          .applyMatrix4(object.matrixWorld);
      }
      triangle.surface = surface;
      octree.addTriangle(triangle);
    }

    if (indexed) geometry.dispose();
  });
}

function countTriangles(node: Octree): number {
  let total = node.triangles.length;
  for (const subTree of node.subTrees) total += countTriangles(subTree);
  return total;
}
