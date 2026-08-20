import * as THREE from 'three';
import { COLLISION_LAYER } from '../layers';
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import type { SurfaceName } from '../audio/models/footsteps';

/**
 * The static collision world: three's `Octree` for storage, and everything
 * that decides what a query costs is ours.
 *
 * Triangles are the common denominator, so authored walls, ramps, stairs and
 * sculpted terrain all reduce to them and there is one collision path to
 * reason about. `split` below decides where the tree stops dividing and
 * `claim` collects candidates; both are the difference between a fast query
 * and a slow one.
 *
 * The narrow phase is ours too. `Octree.capsuleIntersect` decides penetration
 * from the capsule's distance to the triangle's *plane*, which is wrong
 * wherever a capsule stands beside a small horizontal face — the tread of a
 * stair reports the capsule half a metre inside it and launches the player. A
 * closest-point test bounds every push by the capsule radius instead.
 *
 * Only meshes on the collision layer are indexed, which keeps decoration and
 * debug fixtures out of the set without a parallel scene graph.
 */

/**
 * Re-exported so the collider's callers need not know where layer numbers
 * live. The number itself belongs to `src/layers.ts`.
 */
export { COLLISION_LAYER };

export interface Contact {
  /** Unit vector pointing out of the surface, toward the capsule. */
  normal: THREE.Vector3;
  /** How far the capsule has to move along the normal to be clear. */
  depth: number;
  /**
   * What the triangle is made of, or null if it is ground or has no material of
   * its own. See `SurfacedTriangle`.
   */
  surface: SurfaceName | null;
}

/**
 * A collision triangle that remembers which prop it was cut from — how the
 * game knows what it is standing on.
 *
 * One field, because the collider is already the authority: the thing holding
 * the player up is by definition the thing they last pushed out of. There is
 * no second opinion about contact to disagree with the physics at the instant
 * of landing, on a curve, or on anything narrow.
 */
interface SurfacedTriangle extends THREE.Triangle {
  surface: SurfaceName | null;
  /**
   * The id of the last query that claimed this triangle. See `claim`. A
   * triangle straddling a node boundary is stored in every node it touches, so
   * one query reaches it many times over and has to notice.
   */
  stamp: number;
}

/**
 * Marks a subtree as solid. Call before building the collider.
 *
 * A subtree flagged `userData.noCollide` is skipped along with everything under
 * it — a street lamp's beam of light is geometry, and without an opt-out the
 * player would walk into it and stop. Recursive rather than `traverse`, which
 * has no way to prune: it would skip the flagged node and carry on into its
 * children anyway.
 *
 * **This can only take a prop whole or leave it whole.** By the time a mesh
 * reaches here its parts are merged into one buffer and nothing can tell a
 * door's leaf from the rivets on it, so a builder that wants only part of
 * itself solid has to say so while it is still being built.
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

const _candidates: SurfacedTriangle[] = [];
const _ray = new THREE.Ray();
const _point = new THREE.Vector3();
const _half = new THREE.Vector3();
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

/**
 * The id of the query currently gathering candidates.
 *
 * **It must never be reset.** A stamp left over from an earlier query that read
 * as current would make the gather skip a triangle it has not seen, and a
 * skipped triangle is a player walking through a wall once, unrepeatably, with
 * nothing in the log. Only ever incremented, so a stale stamp is always
 * smaller than the live one.
 */
let query = 0;

/**
 * Takes the triangles a node holds, each one only once per query.
 *
 * Three's own gatherers dedupe with `indexOf`, a linear scan of everything
 * found so far per entry visited — in a dense interior, tens of thousands of
 * entries scanned against hundreds of candidates, for one query. A stamp
 * answers the same question in one comparison.
 *
 * Internal nodes hold no triangles of their own, so this does nothing above a
 * leaf.
 */
function claim(node: Octree, out: SurfacedTriangle[]): void {
  for (const triangle of node.triangles as SurfacedTriangle[]) {
    if (triangle.stamp === query) continue;
    triangle.stamp = query;
    out.push(triangle);
  }
}

/**
 * Candidates for a capsule. Descends only into boxes it could touch.
 *
 * Two walks rather than one taking a box test: one closure per query is one
 * allocation per query, and this runs about three hundred times a frame.
 */
function gatherCapsule(node: Octree, capsule: Capsule, out: SurfacedTriangle[]): void {
  claim(node, out);
  for (const subTree of node.subTrees) {
    if (subTree.box && capsule.intersectsBox(subTree.box)) gatherCapsule(subTree, capsule, out);
  }
}

/** Candidates for a ray. `gatherCapsule`, with the other box test. */
function gatherRay(node: Octree, ray: THREE.Ray, out: SurfacedTriangle[]): void {
  claim(node, out);
  for (const subTree of node.subTrees) {
    if (subTree.box && ray.intersectsBox(subTree.box)) gatherRay(subTree, ray, out);
  }
}

export class Collider {
  private index: Index = { octree: new Octree(), triangles: 0 };
  /**
   * One index per zone, kept. Zones are entered far more often than they
   * change, and indexing the exterior takes longer than the fade's third of a
   * second of black — so building once per zone and swapping the reference
   * makes a crossing free.
   *
   * The cost is memory: every zone the player has visited keeps its octree. A
   * zone whose geometry genuinely changes must call `invalidate`, because
   * nothing here can detect a mutated scene graph and a stale index is a player
   * walking through a wall that is visibly in front of them.
   */
  private readonly cache = new Map<string, Index>();

  /**
   * Points the collider at `root`, building and caching under `key`. Without a
   * key it builds every time and caches nothing.
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
   * Indexes `root` into the cache *without* switching to it — for paying a
   * zone's build cost during the loading screen rather than behind the fade
   * the first time somebody opens its door.
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
    const triangles = cut(octree, root);
    // Not `octree.build()`, which is this pair with three's `split`.
    octree.calcBox();
    split(octree, 0);
    return { octree, triangles };
  }

  /**
   * How much geometry is indexed: unique triangles, counted as they are cut.
   * Not the number of entries in the tree, which is much larger — a triangle is
   * stored in every node it touches.
   */
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
    query++;
    gatherCapsule(this.index.octree, capsule, _candidates);

    let deepest = 0;
    let hit: SurfacedTriangle | null = null;

    for (const triangle of _candidates) {
      const depth = penetration(capsule, triangle);
      if (depth <= deepest) continue;
      deepest = depth;
      hit = triangle;
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
    query++;
    gatherCapsule(this.index.octree, capsule, _candidates);
    for (const triangle of _candidates) {
      if (penetration(capsule, triangle) > 0) return true;
    }
    return false;
  }

  /**
   * Nearest surface along a ray, for audio occlusion and the interaction
   * cursor.
   *
   * Three's `rayIntersect` also reports the triangle and the point, which
   * neither caller wants; the loop is here so the ray and the hit point can be
   * reused rather than allocated per call, and occlusion casts one per emitter.
   */
  raycast(origin: THREE.Vector3, direction: THREE.Vector3): number | null {
    if (direction.lengthSq() === 0) return null;
    _ray.set(origin, direction);

    _candidates.length = 0;
    query++;
    gatherRay(this.index.octree, _ray, _candidates);

    let nearest = Infinity;
    for (const triangle of _candidates) {
      // Backface culled, as three's own does: every collidable is a closed
      // solid, so a face turned away is the far wall of something.
      if (!_ray.intersectTriangle(triangle.a, triangle.b, triangle.c, true, _point)) continue;
      const distance = _point.distanceTo(origin);
      if (distance < nearest) nearest = distance;
    }

    return nearest < Infinity ? nearest : null;
  }
}

/**
 * Capsule against one triangle. Returns how deep it is inside, or 0 if clear,
 * and writes the unit push-out direction into `_offset`.
 *
 * The capsule is reduced to the single sphere sitting closest to the triangle,
 * after which it is an ordinary sphere-triangle test. Finding that sphere is
 * the trick: cross the capsule's axis with the triangle plane for a point on
 * the axis roughly opposite it, clamp that onto the triangle for a reference
 * point, then take the point on the axis closest to the reference. Faces,
 * edges and vertices all fall out of it.
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
 * octree, each carrying its mesh's material.
 *
 * A copy of three's `Octree.fromGraphNode` — same traversal, same layer test,
 * same handling of indexed geometry — with the surface stamped on and without
 * the `build()` at the end, so the caller can add from more than one root.
 */
function cut(octree: Octree, root: THREE.Object3D): number {
  root.updateWorldMatrix(true, true);
  let count = 0;

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
      triangle.stamp = 0;
      octree.addTriangle(triangle);
      count++;
    }

    if (indexed) geometry.dispose();
  });

  return count;
}

/** How deep the tree may go. Three's own cap is 16 and every zone hit it. */
const MAX_DEPTH = 11;

/** A node holding no more than this is not worth dividing. Three's number. */
const LEAF_SIZE = 8;

/**
 * Refuse to split if any one child would keep this share of the parent. The
 * runaway case is a handful of large triangles that each straddle the whole
 * box: they are still a handful in every child, all the way down.
 */
const NO_PROGRESS = 0.9;

/** Refuse to split if the eight children between them would hold this many. */
const MAX_DUPLICATION = 2.5;

/**
 * Above this, a node is divided whatever the two guards say. The guards ask
 * whether dividing is worth what it costs, and the answer is always yes once a
 * leaf is large enough that a query has to scan all of it.
 */
const SCAN_LIMIT = 192;

/**
 * Divides a node into eight, unless dividing is only making copies.
 *
 * Three's `split` asks one question — more than eight triangles, and depth left
 * — and copies a triangle crossing a boundary into every child it touches.
 * Dense detail then drives subdivision to the cap and every large triangle
 * passing through that volume is copied into all the resulting leaves. A
 * doorway is where the two meet: a door's hardware, and the wall and floor
 * whose big triangles run through it.
 *
 * So this asks whether the split *separated* anything and stays a leaf when it
 * did not — up to `SCAN_LIMIT`, past which a leaf costs more to scan than the
 * nodes cost to walk. Both halves are load-bearing.
 */
function split(node: Octree, level: number): void {
  const box = node.box;
  if (!box || node.triangles.length <= LEAF_SIZE || level >= MAX_DEPTH) return;

  _half.copy(box.max).sub(box.min).multiplyScalar(0.5);

  const boxes: THREE.Box3[] = [];
  const buckets: THREE.Triangle[][] = [];
  for (let x = 0; x < 2; x++) {
    for (let y = 0; y < 2; y++) {
      for (let z = 0; z < 2; z++) {
        const child = new THREE.Box3();
        child.min.set(box.min.x + x * _half.x, box.min.y + y * _half.y, box.min.z + z * _half.z);
        child.max.copy(child.min).add(_half);
        boxes.push(child);
        buckets.push([]);
      }
    }
  }

  let total = 0;
  let largest = 0;
  for (const triangle of node.triangles) {
    for (let i = 0; i < boxes.length; i++) {
      if (!boxes[i].intersectsTriangle(triangle)) continue;
      const held = buckets[i].push(triangle);
      total++;
      if (held > largest) largest = held;
    }
  }

  const parent = node.triangles.length;
  if (parent <= SCAN_LIMIT && (largest >= parent * NO_PROGRESS || total > parent * MAX_DUPLICATION)) {
    return;
  }

  node.triangles.length = 0;
  for (let i = 0; i < boxes.length; i++) {
    if (buckets[i].length === 0) continue;
    const subTree = new Octree(boxes[i]);
    subTree.triangles = buckets[i];
    node.subTrees.push(subTree);
    split(subTree, level + 1);
  }
}
