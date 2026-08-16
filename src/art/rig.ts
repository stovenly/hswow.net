import * as THREE from 'three';
import { assemble, finishMesh, type Part } from './assemble';

/**
 * Rigged creatures: one merged mesh, one draw call, and a skeleton of hinges.
 *
 * A creature is built exactly like any other prop — parts positioned in its
 * own space, feet on y = 0, facing +Z — with each part naming the bone it
 * rides. `assemble` binds every vertex rigidly to that bone, and the mesh
 * comes back as a `SkinnedMesh` whose bones start at identity rotation at
 * their pivots. So the built pose *is* the rest pose, and animation is written
 * as deltas: `bone.rotation` from zero, `bone.position` from `rest`.
 *
 * Three's built-in materials — the art material, the shadow depth material and
 * the pixel pass's normal material — all skin when the object is a
 * `SkinnedMesh`, so nothing in the shader chain changes. See LIFE.md §5.
 */

export interface BoneSpec {
  name: string;
  /** Omitted for the root. Parents must be listed before their children. */
  parent?: string;
  /** Pivot, in the creature's own space. */
  at: readonly [number, number, number];
}

export interface Rig {
  readonly bones: readonly BoneSpec[];
}

/** What the runtime gets hold of. Stored on `mesh.userData.rig`. */
export interface RigHandle {
  readonly mesh: THREE.SkinnedMesh;
  readonly bones: Readonly<Record<string, THREE.Bone>>;
  /** Each bone's local rest position — its pivot relative to its parent's. */
  readonly rest: Readonly<Record<string, THREE.Vector3>>;
  readonly names: readonly string[];
}

export function boneNames(rig: Rig): string[] {
  return rig.bones.map((bone) => bone.name);
}

/**
 * Merges the parts, bound to the rig's bones, and finishes them as a skinned
 * mesh. The optional `transform` is applied to the geometry *and* the pivots
 * — a builder's `scale` — so the two cannot disagree.
 */
export function finishRigged(
  parts: Part[],
  rig: Rig,
  name: string,
  phase: number,
  scale = 1,
): THREE.SkinnedMesh {
  const names = boneNames(rig);
  const geometry = assemble(parts, names);
  if (scale !== 1) geometry.scale(scale, scale, scale);

  const bones: Record<string, THREE.Bone> = {};
  const rest: Record<string, THREE.Vector3> = {};
  const list: THREE.Bone[] = [];
  let root: THREE.Bone | null = null;

  for (const spec of rig.bones) {
    const bone = new THREE.Bone();
    bone.name = spec.name;
    const at = new THREE.Vector3(...spec.at).multiplyScalar(scale);
    if (spec.parent) {
      const parent = bones[spec.parent];
      if (!parent) throw new Error(`rig: bone "${spec.name}" listed before its parent`);
      const parentAt = new THREE.Vector3(...rig.bones.find((b) => b.name === spec.parent)!.at)
        .multiplyScalar(scale);
      bone.position.copy(at).sub(parentAt);
      parent.add(bone);
    } else {
      if (root) throw new Error('rig: more than one root bone');
      bone.position.copy(at);
      root = bone;
    }
    bones[spec.name] = bone;
    rest[spec.name] = bone.position.clone();
    list.push(bone);
  }
  if (!root) throw new Error('rig: no root bone');

  const mesh = new THREE.SkinnedMesh(geometry);
  finishMesh(mesh, name, phase);
  // Bound at the origin, so the bind matrix is identity and the bones' inverse
  // bind matrices are simply their pivots undone. `attached` mode then follows
  // the mesh wherever it is placed.
  mesh.add(root);
  mesh.updateMatrixWorld(true);
  mesh.bind(new THREE.Skeleton(list));
  // The bind-pose sphere, widened: a head turned to watch the player is still
  // inside it, and it is never recomputed after this.
  geometry.computeBoundingSphere();
  mesh.boundingSphere = geometry.boundingSphere!.clone();
  mesh.boundingSphere.radius *= 1.35;

  // Never in the static collider: the octree is cut once per zone from the
  // built pose, and a creature that walked off would leave a ghost of itself
  // there. The player is stopped by the creature's own footprint instead.
  mesh.userData.noCollide = true;
  const handle: RigHandle = { mesh, bones, rest, names };
  mesh.userData.rig = handle;
  return mesh;
}
