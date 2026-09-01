import * as THREE from 'three';

/**
 * The spatial half of the collision index: boxes and which triangles fall in
 * them, worked out from triangle positions alone. Pure and transferable, so it
 * runs on a worker; `Collider` hangs its own triangle objects on the result.
 */

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
 * A tree flattened into buffers. Node 0 is the root; a node's children are
 * consecutive from `firstChild`, and its triangles are `triIndices` from
 * `triStart` for `triCount`. Internal nodes hold no triangles of their own.
 */
export interface OctreePlan {
  /** Six per node: min xyz then max xyz. */
  boxes: Float32Array;
  firstChild: Int32Array;
  childCount: Int32Array;
  triStart: Int32Array;
  triCount: Int32Array;
  triIndices: Int32Array;
}

interface Node {
  box: THREE.Box3;
  tris: number[];
  first: number;
  count: number;
}

const _half = new THREE.Vector3();

export function planOctree(positions: Float32Array): OctreePlan {
  const total = Math.floor(positions.length / 9);
  const triangles: THREE.Triangle[] = new Array(total);
  const box = new THREE.Box3();
  box.makeEmpty();
  for (let i = 0; i < total; i += 1) {
    const at = i * 9;
    const triangle = new THREE.Triangle(
      new THREE.Vector3(positions[at], positions[at + 1], positions[at + 2]),
      new THREE.Vector3(positions[at + 3], positions[at + 4], positions[at + 5]),
      new THREE.Vector3(positions[at + 6], positions[at + 7], positions[at + 8]),
    );
    triangles[i] = triangle;
    box.expandByPoint(triangle.a).expandByPoint(triangle.b).expandByPoint(triangle.c);
  }
  // Three's own offset, to account for a regular grid.
  box.min.x -= 0.01;
  box.min.y -= 0.01;
  box.min.z -= 0.01;

  const nodes: Node[] = [];
  const root: number[] = new Array(total);
  for (let i = 0; i < total; i += 1) root[i] = i;
  nodes.push({ box, tris: root, first: -1, count: 0 });
  if (total > 0) divide(nodes, 0, triangles, 0);

  const boxes = new Float32Array(nodes.length * 6);
  const firstChild = new Int32Array(nodes.length);
  const childCount = new Int32Array(nodes.length);
  const triStart = new Int32Array(nodes.length);
  const triCount = new Int32Array(nodes.length);
  let held = 0;
  for (const node of nodes) held += node.tris.length;
  const triIndices = new Int32Array(held);
  let at = 0;
  nodes.forEach((node, i) => {
    boxes[i * 6] = node.box.min.x;
    boxes[i * 6 + 1] = node.box.min.y;
    boxes[i * 6 + 2] = node.box.min.z;
    boxes[i * 6 + 3] = node.box.max.x;
    boxes[i * 6 + 4] = node.box.max.y;
    boxes[i * 6 + 5] = node.box.max.z;
    firstChild[i] = node.first;
    childCount[i] = node.count;
    triStart[i] = at;
    triCount[i] = node.tris.length;
    for (const index of node.tris) triIndices[at++] = index;
  });
  return { boxes, firstChild, childCount, triStart, triCount, triIndices };
}

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
function divide(
  nodes: Node[],
  self: number,
  triangles: readonly THREE.Triangle[],
  level: number,
): void {
  const node = nodes[self];
  const held = node.tris;
  if (held.length <= LEAF_SIZE || level >= MAX_DEPTH) return;

  const box = node.box;
  _half.copy(box.max).sub(box.min).multiplyScalar(0.5);

  const boxes: THREE.Box3[] = [];
  const buckets: number[][] = [];
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
  for (const index of held) {
    const triangle = triangles[index];
    for (let i = 0; i < boxes.length; i++) {
      if (!boxes[i].intersectsTriangle(triangle)) continue;
      const count = buckets[i].push(index);
      total++;
      if (count > largest) largest = count;
    }
  }

  const parent = held.length;
  if (parent <= SCAN_LIMIT && (largest >= parent * NO_PROGRESS || total > parent * MAX_DUPLICATION)) {
    return;
  }

  const kept: number[] = [];
  for (let i = 0; i < boxes.length; i++) if (buckets[i].length > 0) kept.push(i);
  const first = nodes.length;
  for (const i of kept) {
    nodes.push({ box: boxes[i], tris: buckets[i], first: -1, count: 0 });
  }
  node.tris = [];
  node.first = first;
  node.count = kept.length;
  // After the whole rank is pushed, so siblings stay consecutive.
  for (let i = 0; i < kept.length; i++) divide(nodes, first + i, triangles, level + 1);
}
