import * as THREE from 'three';
import { assemble, captureRigged, capturingNow, finishSink, type Part } from './assemble';

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
  const geometry = riggedGeometry(parts, rig, scale);
  if (capturingNow()) return captureRigged({ geometry, name, phase, rig, scale });
  return finishSink().rigged(geometry, rig, name, phase, scale);
}

/** The pure half: the parts merged against the rig's bones, at the builder's scale. */
export function riggedGeometry(parts: Part[], rig: Rig, scale = 1): THREE.BufferGeometry {
  const geometry = assemble(parts, boneNames(rig));
  if (scale !== 1) geometry.scale(scale, scale, scale);
  return geometry;
}
