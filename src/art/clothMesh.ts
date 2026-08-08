import * as THREE from 'three';
import { assemble, finish } from './assemble';
import { FABRICS } from './fabrics';
import type { ClothSim } from './cloth';

/**
 * The drawn side of a cloth: one dynamic mesh per cloth, skinned from the grid.
 *
 * The sim is the midplane; the skin is a front and a back sheet offset
 * ±thickness/2 along the local normal, plus a welded hem strip around the
 * border — which keeps `ART_MATERIAL` exactly as it is, front-side and
 * flat-shaded, rather than forcing a double-sided clone into the kit. Shadows
 * and outlines agree for free: the buffer itself moves, so every pass draws
 * the cloth where it is. CLOTH.md §6.
 */

export interface ClothInstance {
  sim: ClothSim;
  /** Buffer writes, run after the sim steps. The panel's own is first. */
  updates: (() => void)[];
  refresh(): void;
}

export interface ClothPanel {
  mesh: THREE.Mesh;
  instance: ClothInstance;
  /** Smoothed per-particle normals, refreshed by the panel's own update. */
  normals: Float32Array;
}

export interface ClothPanelOptions {
  /** Builder name, for `finish` — flex, clutter and underfoot key off it. */
  name: string;
  color: number;
}

/**
 * Builds the skin from the sim's current (pre-draped) state and returns the
 * mesh with its per-frame update wired. The mesh carries `userData.cloth`,
 * which is how the runtime finds it, and `noCollide`, because a cloth panel's
 * triangles have no business in the player collider's octree.
 */
export function clothPanel(sim: ClothSim, options: ClothPanelOptions): ClothPanel {
  const { cols, rows } = sim;
  const cells = (cols - 1) * (rows - 1);
  const borderEdges = 2 * (cols - 1) + 2 * (rows - 1);
  const vertexCount = cells * 12 + borderEdges * 6;

  // Which particle each skin vertex rides, and which side of the midplane.
  const gridOf = new Int32Array(vertexCount);
  const sideOf = new Float32Array(vertexCount);
  let cursor = 0;
  const at = (r: number, c: number) => r * cols + c;
  const put = (index: number, side: number): void => {
    gridOf[cursor] = index;
    sideOf[cursor] = side;
    cursor++;
  };

  // Front sheet, wound to face +Z for a grid authored with x right, y up.
  for (let r = 0; r + 1 < rows; r++) {
    for (let c = 0; c + 1 < cols; c++) {
      put(at(r, c), 1);
      put(at(r + 1, c), 1);
      put(at(r, c + 1), 1);
      put(at(r, c + 1), 1);
      put(at(r + 1, c), 1);
      put(at(r + 1, c + 1), 1);
    }
  }
  // Back sheet, reversed winding.
  for (let r = 0; r + 1 < rows; r++) {
    for (let c = 0; c + 1 < cols; c++) {
      put(at(r, c), -1);
      put(at(r, c + 1), -1);
      put(at(r + 1, c), -1);
      put(at(r, c + 1), -1);
      put(at(r + 1, c + 1), -1);
      put(at(r + 1, c), -1);
    }
  }
  // The hem: a quad per border edge joining the two sheets, which is what
  // gives dense fabric a visible edge. `flip` swaps the winding per border so
  // each strip faces outward at rest.
  const hem = (a: number, b: number, flip: boolean): void => {
    if (!flip) {
      put(a, 1);
      put(b, 1);
      put(b, -1);
      put(a, 1);
      put(b, -1);
      put(a, -1);
    } else {
      put(a, 1);
      put(b, -1);
      put(b, 1);
      put(a, 1);
      put(a, -1);
      put(b, -1);
    }
  };
  for (let c = 0; c + 1 < cols; c++) hem(at(0, c), at(0, c + 1), false);
  for (let c = 0; c + 1 < cols; c++) hem(at(rows - 1, c), at(rows - 1, c + 1), true);
  for (let r = 0; r + 1 < rows; r++) hem(at(r, 0), at(r + 1, 0), true);
  for (let r = 0; r + 1 < rows; r++) hem(at(r, cols - 1), at(r + 1, cols - 1), false);

  const gridNormals = new Float32Array(sim.count * 3);
  const positions = new Float32Array(vertexCount * 3);
  const half = FABRICS[sim.fabricName].thickness / 2;

  const smoothNormals = (): void => {
    gridNormals.fill(0);
    const p = sim.positions;
    for (let r = 0; r + 1 < rows; r++) {
      for (let c = 0; c + 1 < cols; c++) {
        // Both triangles of the cell share one facet normal, accumulated on
        // all four corners — smooth enough for an offset direction.
        const a = at(r, c);
        const b = at(r + 1, c);
        const d = at(r, c + 1);
        const e = at(r + 1, c + 1);
        const e1x = p[b * 3] - p[a * 3];
        const e1y = p[b * 3 + 1] - p[a * 3 + 1];
        const e1z = p[b * 3 + 2] - p[a * 3 + 2];
        const e2x = p[d * 3] - p[a * 3];
        const e2y = p[d * 3 + 1] - p[a * 3 + 1];
        const e2z = p[d * 3 + 2] - p[a * 3 + 2];
        const nx = e1y * e2z - e1z * e2y;
        const ny = e1z * e2x - e1x * e2z;
        const nz = e1x * e2y - e1y * e2x;
        for (const i of [a, b, d, e]) {
          gridNormals[i * 3] += nx;
          gridNormals[i * 3 + 1] += ny;
          gridNormals[i * 3 + 2] += nz;
        }
      }
    }
    for (let i = 0; i < sim.count; i++) {
      const nx = gridNormals[i * 3];
      const ny = gridNormals[i * 3 + 1];
      const nz = gridNormals[i * 3 + 2];
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      if (len > 1e-9) {
        gridNormals[i * 3] = nx / len;
        gridNormals[i * 3 + 1] = ny / len;
        gridNormals[i * 3 + 2] = nz / len;
      } else {
        gridNormals[i * 3 + 2] = 1;
      }
    }
  };

  const writePositions = (target: Float32Array): void => {
    const p = sim.positions;
    for (let v = 0; v < vertexCount; v++) {
      const i = gridOf[v];
      const offset = sideOf[v] * half;
      target[v * 3] = p[i * 3] + gridNormals[i * 3] * offset;
      target[v * 3 + 1] = p[i * 3 + 1] + gridNormals[i * 3 + 1] * offset;
      target[v * 3 + 2] = p[i * 3 + 2] + gridNormals[i * 3 + 2] * offset;
    }
  };

  smoothNormals();
  writePositions(positions);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
  const merged = assemble([{ geometry, color: options.color, sway: 0 }]);
  const mesh = finish(merged, options.name, 0);
  mesh.userData.noCollide = true;

  const positionAttribute = merged.getAttribute('position') as THREE.BufferAttribute;
  const normalAttribute = merged.getAttribute('normal') as THREE.BufferAttribute;
  positionAttribute.setUsage(THREE.DynamicDrawUsage);
  normalAttribute.setUsage(THREE.DynamicDrawUsage);

  // A conservative bounding sphere, set once: the tether reach bounds a pinned
  // cloth; a pinless one can at worst fall to the ground, so its own height is
  // the bound. Never recomputed — that would walk every vertex every frame.
  {
    const centre = new THREE.Vector3();
    for (let i = 0; i < sim.count; i++) {
      centre.x += sim.rest[i * 3];
      centre.y += sim.rest[i * 3 + 1];
      centre.z += sim.rest[i * 3 + 2];
    }
    centre.multiplyScalar(1 / sim.count);
    let base = 0;
    let top = 0;
    for (let i = 0; i < sim.count; i++) {
      const dx = sim.rest[i * 3] - centre.x;
      const dy = sim.rest[i * 3 + 1] - centre.y;
      const dz = sim.rest[i * 3 + 2] - centre.z;
      base = Math.max(base, Math.sqrt(dx * dx + dy * dy + dz * dz));
      top = Math.max(top, sim.rest[i * 3 + 1]);
    }
    const slack = sim.pins.length > 0 ? sim.maxTether : top;
    merged.boundingSphere = new THREE.Sphere(centre, base + slack + sim.spacing);
  }

  const positionArray = positionAttribute.array as Float32Array;
  const normalArray = normalAttribute.array as Float32Array;

  const update = (): void => {
    smoothNormals();
    writePositions(positionArray);
    // Flat normals, recomputed from the final vertex positions: the kit is
    // un-indexed, so consecutive triples are triangles.
    for (let v = 0; v < vertexCount; v += 3) {
      const e1x = positionArray[(v + 1) * 3] - positionArray[v * 3];
      const e1y = positionArray[(v + 1) * 3 + 1] - positionArray[v * 3 + 1];
      const e1z = positionArray[(v + 1) * 3 + 2] - positionArray[v * 3 + 2];
      const e2x = positionArray[(v + 2) * 3] - positionArray[v * 3];
      const e2y = positionArray[(v + 2) * 3 + 1] - positionArray[v * 3 + 1];
      const e2z = positionArray[(v + 2) * 3 + 2] - positionArray[v * 3 + 2];
      let nx = e1y * e2z - e1z * e2y;
      let ny = e1z * e2x - e1x * e2z;
      let nz = e1x * e2y - e1y * e2x;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      if (len > 1e-9) {
        nx /= len;
        ny /= len;
        nz /= len;
      }
      for (let k = 0; k < 3; k++) {
        normalArray[(v + k) * 3] = nx;
        normalArray[(v + k) * 3 + 1] = ny;
        normalArray[(v + k) * 3 + 2] = nz;
      }
    }
    positionAttribute.needsUpdate = true;
    normalAttribute.needsUpdate = true;
  };

  const instance: ClothInstance = {
    sim,
    updates: [update],
    refresh() {
      for (const run of this.updates) run();
    },
  };
  mesh.userData.cloth = instance;

  return { mesh, instance, normals: gridNormals };
}

/**
 * Binds an already-finished mesh — the banner's lettering — to the cloth grid.
 *
 * A build-time skinning map: each vertex is bound to its cell by bilinear
 * weights plus a normal offset, and re-projected after each solve, so the
 * words bend *with* the fold they sit on. `map` turns an authored vertex
 * position into grid coordinates: u across, v down, both 0..1, and the offset
 * off the midplane in metres.
 */
export function skinToCloth(
  target: THREE.Mesh,
  panel: ClothPanel,
  map: (x: number, y: number, z: number) => readonly [number, number, number],
): void {
  const sim = panel.instance.sim;
  const { cols, rows } = sim;
  const attribute = target.geometry.getAttribute('position') as THREE.BufferAttribute;
  const normalAttribute = target.geometry.getAttribute('normal') as THREE.BufferAttribute;
  attribute.setUsage(THREE.DynamicDrawUsage);
  normalAttribute.setUsage(THREE.DynamicDrawUsage);
  const array = attribute.array as Float32Array;
  const normals = normalAttribute.array as Float32Array;
  const count = attribute.count;

  const corner = new Int32Array(count * 4);
  const weight = new Float32Array(count * 4);
  const offset = new Float32Array(count);

  for (let v = 0; v < count; v++) {
    const [u, w, off] = map(array[v * 3], array[v * 3 + 1], array[v * 3 + 2]);
    const gx = Math.min(Math.max(u, 0), 1) * (cols - 1);
    const gy = Math.min(Math.max(w, 0), 1) * (rows - 1);
    const c0 = Math.min(Math.floor(gx), cols - 2);
    const r0 = Math.min(Math.floor(gy), rows - 2);
    const fx = gx - c0;
    const fy = gy - r0;
    corner[v * 4] = r0 * cols + c0;
    corner[v * 4 + 1] = r0 * cols + c0 + 1;
    corner[v * 4 + 2] = (r0 + 1) * cols + c0;
    corner[v * 4 + 3] = (r0 + 1) * cols + c0 + 1;
    weight[v * 4] = (1 - fx) * (1 - fy);
    weight[v * 4 + 1] = fx * (1 - fy);
    weight[v * 4 + 2] = (1 - fx) * fy;
    weight[v * 4 + 3] = fx * fy;
    offset[v] = off;
  }

  // Reuses the panel's smoothed normals, so it must run after the panel's own
  // update — which `updates` order guarantees.
  const update = (): void => {
    const p = sim.positions;
    const n = panel.normals;
    for (let v = 0; v < count; v++) {
      let x = 0;
      let y = 0;
      let z = 0;
      let nx = 0;
      let ny = 0;
      let nz = 0;
      for (let k = 0; k < 4; k++) {
        const i = corner[v * 4 + k];
        const w = weight[v * 4 + k];
        x += p[i * 3] * w;
        y += p[i * 3 + 1] * w;
        z += p[i * 3 + 2] * w;
        nx += n[i * 3] * w;
        ny += n[i * 3 + 1] * w;
        nz += n[i * 3 + 2] * w;
      }
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      const d = offset[v] / len;
      array[v * 3] = x + nx * d;
      array[v * 3 + 1] = y + ny * d;
      array[v * 3 + 2] = z + nz * d;
    }
    // Flat normals for the marks too, or the light disagrees with the fold.
    for (let v = 0; v + 2 < count; v += 3) {
      const e1x = array[(v + 1) * 3] - array[v * 3];
      const e1y = array[(v + 1) * 3 + 1] - array[v * 3 + 1];
      const e1z = array[(v + 1) * 3 + 2] - array[v * 3 + 2];
      const e2x = array[(v + 2) * 3] - array[v * 3];
      const e2y = array[(v + 2) * 3 + 1] - array[v * 3 + 1];
      const e2z = array[(v + 2) * 3 + 2] - array[v * 3 + 2];
      let nx = e1y * e2z - e1z * e2y;
      let ny = e1z * e2x - e1x * e2z;
      let nz = e1x * e2y - e1y * e2x;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      if (len > 1e-9) {
        nx /= len;
        ny /= len;
        nz /= len;
      }
      for (let k = 0; k < 3; k++) {
        normals[(v + k) * 3] = nx;
        normals[(v + k) * 3 + 1] = ny;
        normals[(v + k) * 3 + 2] = nz;
      }
    }
    attribute.needsUpdate = true;
    normalAttribute.needsUpdate = true;
  };

  target.geometry.boundingSphere = panel.mesh.geometry.boundingSphere;
  panel.instance.updates.push(update);
  update();
}
