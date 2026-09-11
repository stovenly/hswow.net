import * as THREE from 'three';
import { canopyMesh } from '../art/canopy';
import { finishCaptured, finishMesh } from '../art/dress';
import { variantSeed } from '../art/foliage';
import type { MeshBuilder } from '../art/types';
import { takeWarm } from './warmProps';
import type { Collected } from './entry';

// Stands: every copy of one tree variant shares its geometry and its crowns are
// drawn as one instanced mesh. What stands where is recorded so a vista can be
// given cards of these trees; nothing turns itself into one.

const _colour = new THREE.Color();

/**
 * Gathers the crowns of every stand tree into one `InstancedMesh` per variant,
 * tinted per copy, and records where each copy stands for the cards. Run once
 * the whole zone is built, so every tree is placed.
 */
export function raiseStands(root: THREE.Object3D, collected: Collected): void {
  root.updateWorldMatrix(true, true);
  const groups = new Map<THREE.BufferGeometry, { key: string; trunk: THREE.BufferGeometry; crowns: THREE.Mesh[] }>();
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || object.userData.canopy !== true) return;
    const trunk = object.parent;
    if (!(trunk instanceof THREE.Mesh) || typeof trunk.userData.stand !== 'string') return;
    let group = groups.get(object.geometry);
    if (!group) {
      group = { key: trunk.userData.stand, trunk: trunk.geometry, crowns: [] };
      groups.set(object.geometry, group);
    }
    group.crowns.push(object);
  });

  for (const [geometry, group] of groups) {
    const instances: Collected['cards'][number]['instances'] = [];
    const stand = canopyMesh(geometry, group.crowns.length) as THREE.InstancedMesh;
    group.crowns.forEach((crown, i) => {
      const trunk = crown.parent as THREE.Mesh;
      trunk.updateWorldMatrix(true, false);
      crown.updateWorldMatrix(false, false);
      stand.setMatrixAt(i, crown.matrixWorld);
      // A tint per copy, a few percent either way, so a wood is not one green.
      const h = Math.sin(trunk.position.x * 12.9898 + trunk.position.z * 78.233) * 43758.5453;
      const t = h - Math.floor(h);
      _colour.setRGB(0.95 + 0.1 * t, 0.94 + 0.12 * ((t * 7.3) % 1), 0.95 + 0.1 * ((t * 3.1) % 1));
      stand.setColorAt(i, _colour);
      instances.push({ x: trunk.position.x, y: trunk.position.y, z: trunk.position.z, yaw: trunk.rotation.y, scale: trunk.scale.x });
      crown.removeFromParent();
    });
    stand.instanceMatrix.needsUpdate = true;
    if (stand.instanceColor) stand.instanceColor.needsUpdate = true;
    stand.frustumCulled = false;
    stand.name = `stand:${group.key}`;
    root.add(stand);
    collected.cards.push({ key: group.key, trunk: group.trunk, canopy: geometry, instances });
  }
}

/**
 * A tree of a stand species: one of four variants per zone, built once and
 * shared. The first copy is built (or claimed warm) at scale 1 and kept in
 * `stands`; every later copy borrows its geometry, trunk and crown, and carries
 * its own scale.
 */
export function standMesh(stands: Map<string, THREE.Mesh>, zone: string, builder: MeshBuilder, seed: number, scale: number): THREE.Mesh {
  const variant = variantSeed(zone, builder.name, seed);
  const key = `${zone}:${builder.name}:${variant}`;
  let first = stands.get(key);
  if (!first) {
    const warm = takeWarm({ builder: builder.name, seed: variant, scale: 1 });
    first = warm ? finishCaptured(warm) : builder.build({ seed: variant, scale: 1 });
    stands.set(key, first);
    first.userData.stand = key;
    first.scale.setScalar(scale);
    return first;
  }
  const mesh = finishMesh(new THREE.Mesh(first.geometry, first.material), builder.name, first.userData.swayPhase as number, first.userData.underfoot as never);
  mesh.userData.borrowedGeometry = true;
  mesh.userData.stand = key;
  const crown = first.children.find((child) => child.userData.canopy === true) as THREE.Mesh | undefined;
  if (crown) {
    const copy = canopyMesh(crown.geometry);
    copy.name = crown.name;
    copy.userData.borrowedGeometry = true;
    mesh.add(copy);
    mesh.userData.hasCanopy = true;
  }
  mesh.scale.setScalar(scale);
  return mesh;
}
