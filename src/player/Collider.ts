import * as THREE from 'three';
import { COLLISION_LAYER } from '../layers';
import { planOctree, type OctreePlan } from './octreePlan';
import { pool } from '../engine/work/pool';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import type { SurfaceName } from '../audio/models/footsteps';

/**
 * The static collision world: a flat triangle soup and the octree plan over
 * it, with nothing allocated per triangle.
 *
 * Triangles are the common denominator, so authored walls, ramps, stairs and
 * sculpted terrain all reduce to them and there is one collision path to
 * reason about. The plan decides where the tree stops dividing and `claim`
 * collects candidates; both are the difference between a fast query and a
 * slow one.
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
   * its own. Every triangle remembers the prop it was cut from, which is how
   * the game knows what it is standing on: the collider is already the
   * authority, so there is no second opinion about contact.
   */
  surface: SurfaceName | null;
}

/** Surface names by id, so a triangle's is one byte. Id 0 is none. */
const surfaceNames: (SurfaceName | null)[] = [null];
const surfaceIds = new Map<SurfaceName, number>();

function surfaceId(name: SurfaceName | null): number {
  if (name === null) return 0;
  let id = surfaceIds.get(name);
  if (id === undefined) {
    id = surfaceNames.length;
    surfaceNames.push(name);
    surfaceIds.set(name, id);
  }
  return id;
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

/** Triangle indices, gathered per query. */
const _candidates: number[] = [];
const _triangle = new THREE.Triangle();
const _ray = new THREE.Ray();
const _point = new THREE.Vector3();
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

/** What `carve` takes triangles from. See `markCollidable`. */
const COLLIDABLE = new THREE.Layers();
COLLIDABLE.disableAll();
COLLIDABLE.enable(COLLISION_LAYER);

/**
 * One zone's collision world: the plan's boxes and per-node triangle lists,
 * over world-space corners nine floats a triangle. A triangle straddling a
 * node boundary is listed in every node it touches, so `stamps` says which
 * query last saw it.
 */
interface Index {
  plan: OctreePlan;
  positions: Float32Array;
  surfaces: Uint8Array;
  stamps: Uint32Array;
  /** One per plan node, for the intersect tests. */
  boxes: THREE.Box3[];
  triangles: number;
}

function emptyIndex(): Index {
  return {
    plan: {
      boxes: new Float32Array(0),
      firstChild: new Int32Array(0),
      childCount: new Int32Array(0),
      triStart: new Int32Array(0),
      triCount: new Int32Array(0),
      triIndices: new Int32Array(0),
    },
    positions: new Float32Array(0),
    surfaces: new Uint8Array(0),
    stamps: new Uint32Array(0),
    boxes: [],
    triangles: 0,
  };
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
 * Takes the triangles a node holds, each one only once per query. A stamp
 * answers "seen already" in one comparison; internal nodes hold none of their
 * own, so this does nothing above a leaf.
 */
function claim(index: Index, node: number, out: number[]): void {
  const { triStart, triCount, triIndices } = index.plan;
  const start = triStart[node];
  const end = start + triCount[node];
  const stamps = index.stamps;
  for (let i = start; i < end; i++) {
    const t = triIndices[i];
    if (stamps[t] === query) continue;
    stamps[t] = query;
    out.push(t);
  }
}

/**
 * Candidates for a capsule. Descends only into boxes it could touch.
 *
 * Two walks rather than one taking a box test: one closure per query is one
 * allocation per query, and this runs about three hundred times a frame.
 */
function gatherCapsule(index: Index, node: number, capsule: Capsule, out: number[]): void {
  claim(index, node, out);
  const first = index.plan.firstChild[node];
  if (first < 0) return;
  const count = index.plan.childCount[node];
  for (let child = first; child < first + count; child++) {
    if (capsule.intersectsBox(index.boxes[child])) gatherCapsule(index, child, capsule, out);
  }
}

/** Candidates for a ray. `gatherCapsule`, with the other box test. */
function gatherRay(index: Index, node: number, ray: THREE.Ray, out: number[]): void {
  claim(index, node, out);
  const first = index.plan.firstChild[node];
  if (first < 0) return;
  const count = index.plan.childCount[node];
  for (let child = first; child < first + count; child++) {
    if (ray.intersectsBox(index.boxes[child])) gatherRay(index, child, ray, out);
  }
}

/** Loads one triangle's corners into the scratch triangle. */
function load(index: Index, t: number): THREE.Triangle {
  const p = index.positions;
  const at = t * 9;
  _triangle.a.set(p[at], p[at + 1], p[at + 2]);
  _triangle.b.set(p[at + 3], p[at + 4], p[at + 5]);
  _triangle.c.set(p[at + 6], p[at + 7], p[at + 8]);
  return _triangle;
}

export class Collider {
  private index: Index = emptyIndex();
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
    const { positions, surfaces } = carve(root);
    return assemble(planOctree(positions), positions, surfaces);
  }

  /**
   * The same index, with the tree worked out on the pool. Only ever a warm:
   * a crossing may not yield between the swap and the teleport, so `build` has
   * to find this already in the cache or do it inline itself.
   */
  async warmAsync(root: THREE.Object3D, key: string, urgent = false, cache?: string): Promise<void> {
    if (this.cache.has(key)) return;
    const { positions, surfaces } = carve(root);
    let plan;
    try {
      // The corners go over and come back: the plan job hands them back in its
      // transfer list, so the buffer is moved twice and copied never.
      plan = await pool.run('collision-index', { positions }, { transfer: [positions.buffer], urgent, cache });
    } catch {
      return;
    }
    if (this.cache.has(key)) return;
    this.cache.set(key, assemble(plan, plan.positions, surfaces));
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
    const index = this.index;
    if (index.triangles === 0) return null;
    _candidates.length = 0;
    query++;
    gatherCapsule(index, 0, capsule, _candidates);

    let deepest = 0;
    let hit = -1;

    for (let i = 0; i < _candidates.length; i++) {
      const t = _candidates[i];
      const depth = penetration(capsule, load(index, t));
      if (depth <= deepest) continue;
      deepest = depth;
      hit = t;
      _contact.normal.copy(_offset);
    }

    if (deepest === 0 || hit < 0) return null;
    _contact.depth = deepest;
    _contact.surface = surfaceNames[index.surfaces[hit]] ?? null;
    return _contact;
  }

  /** True if the capsule is inside anything. Stops at the first hit. */
  overlaps(capsule: Capsule): boolean {
    const index = this.index;
    if (index.triangles === 0) return false;
    _candidates.length = 0;
    query++;
    gatherCapsule(index, 0, capsule, _candidates);
    for (let i = 0; i < _candidates.length; i++) {
      if (penetration(capsule, load(index, _candidates[i])) > 0) return true;
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

    const index = this.index;
    if (index.triangles === 0) return null;
    _candidates.length = 0;
    query++;
    gatherRay(index, 0, _ray, _candidates);

    let nearest = Infinity;
    for (let i = 0; i < _candidates.length; i++) {
      const triangle = load(index, _candidates[i]);
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
 * Cuts every collidable mesh under `root` into world-space triangles, nine
 * floats each, with the surface it was cut from beside them. Counted first
 * and written once: nothing grows.
 */
function carve(root: THREE.Object3D): { positions: Float32Array; surfaces: Uint8Array } {
  root.updateWorldMatrix(true, true);

  let total = 0;
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || !COLLIDABLE.test(object.layers)) return;
    const geometry = object.geometry;
    const count = geometry.index ? geometry.index.count : geometry.getAttribute('position').count;
    total += Math.floor(count / 3);
  });

  const positions = new Float32Array(total * 9);
  const surfaces = new Uint8Array(total);
  let triangle = 0;

  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || !COLLIDABLE.test(object.layers)) return;
    const geometry = object.geometry;
    const position = geometry.getAttribute('position');
    const index = geometry.index;
    const count = index ? index.count : position.count;
    // Set once per mesh rather than per triangle: it is the same for every
    // face of a prop, and a prop is thousands of faces.
    const surface = surfaceId((object.userData.underfoot as SurfaceName | undefined) ?? null);
    const matrix = object.matrixWorld;

    for (let i = 0; i + 2 < count; i += 3) {
      let at = triangle * 9;
      for (let corner = 0; corner < 3; corner++) {
        const vertex = index ? index.getX(i + corner) : i + corner;
        _corner.fromBufferAttribute(position, vertex).applyMatrix4(matrix);
        positions[at] = _corner.x;
        positions[at + 1] = _corner.y;
        positions[at + 2] = _corner.z;
        at += 3;
      }
      surfaces[triangle] = surface;
      triangle++;
    }
  });

  return { positions, surfaces };
}

/** The plan's boxes as objects the intersect tests can take, over the flat corners. */
function assemble(plan: OctreePlan, positions: Float32Array, surfaces: Uint8Array): Index {
  const boxes: THREE.Box3[] = new Array(plan.firstChild.length);
  for (let i = 0; i < boxes.length; i++) {
    boxes[i] = new THREE.Box3(
      new THREE.Vector3(plan.boxes[i * 6], plan.boxes[i * 6 + 1], plan.boxes[i * 6 + 2]),
      new THREE.Vector3(plan.boxes[i * 6 + 3], plan.boxes[i * 6 + 4], plan.boxes[i * 6 + 5]),
    );
  }
  const triangles = surfaces.length;
  if (boxes.length === 0) return emptyIndex();
  return { plan, positions, surfaces, stamps: new Uint32Array(triangles), boxes, triangles };
}

