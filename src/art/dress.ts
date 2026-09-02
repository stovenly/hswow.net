import * as THREE from 'three';
import { CLUTTER } from './clutter';
import { MATERIALS } from './underfoot';
import type { SurfaceName } from '../audio/models/footsteps';
import { FLEX } from './flex';
import { SWAY_DEPTH_MATERIAL, dressArtMesh } from './sway';
import { FIELD_ATTRIBUTE, FIELD_SWAY } from './fields';
import { ART_MATERIAL } from './material';
import { installFinish, type Finished } from './assemble';
import { boneNames, type Rig, type RigHandle } from './rig';

/**
 * The main thread's finish sink: a merged geometry becomes a mesh on the art
 * material. Importing this module installs it; the worker never imports it.
 */

installFinish({
  mesh: (geometry, name, phase, underfoot) =>
    finishMesh(new THREE.Mesh(geometry, ART_MATERIAL), name, phase, underfoot),
  rigged: dressRigged,
});

/** Dresses what `capture` took. */
export function finishCaptured(taken: Finished): THREE.Mesh {
  const mesh = taken.rig
    ? dressRigged(taken.geometry, taken.rig, taken.name, taken.phase, taken.scale ?? 1)
    : finishMesh(new THREE.Mesh(taken.geometry, ART_MATERIAL), taken.name, taken.phase, taken.underfoot);
  if (taken.userData) Object.assign(mesh.userData, taken.userData);
  return mesh;
}

/**
 * The body of `finish`, on a mesh the caller made — a `SkinnedMesh` for a
 * rigged creature (`art/rig.ts`), a plain one for everything else.
 */
export function finishMesh<T extends THREE.Mesh>(
  mesh: T,
  name: string,
  phase: number,
  underfoot?: SurfaceName,
): T {
  const geometry = mesh.geometry;
  // Baked into the attribute rather than passed as a uniform: a uniform would
  // need a material per species, and the whole kit sharing one material is what
  // keeps a prop to a single draw call.
  const flex = FLEX[name] ?? 0;
  const fields = geometry.getAttribute(FIELD_ATTRIBUTE);
  if (fields && flex !== 1) {
    const array = fields.array as Float32Array;
    for (let i = FIELD_SWAY; i < array.length; i += 3) array[i] *= flex;
    fields.needsUpdate = true;
  }

  // The lean material, and a note of what this prop's parts declared.
  dressArtMesh(mesh, (geometry.userData.finishMask as number | undefined) ?? 0);
  mesh.name = name;
  mesh.userData.swayPhase = phase;
  // Stamped here rather than looked up in the zone manager: by the time the
  // manager walks a built zone the builder is long gone, and the name on the mesh
  // is the only thing left that says what this is.
  if (CLUTTER.has(name)) mesh.userData.clutter = true;
  // What standing on it sounds like, declared by name in `art/underfoot.ts`. The
  // collider carries it onto every triangle, so what holds the player up is what
  // they hear.
  const material = underfoot ?? MATERIALS[name];
  if (material) mesh.userData.underfoot = material;
  // So the sun sees what the camera sees: without it the shadow map is drawn from
  // undisplaced geometry and every swaying plant casts a still shadow of where it
  // is not. Set on everything rather than only on things that bend — a rigid
  // prop's displacement is zero, and a rule would have to be remembered.
  mesh.customDepthMaterial = SWAY_DEPTH_MATERIAL;
  return mesh;
}

/**
 * The half that needs the main thread: the bones, the skeleton and the
 * material. The pivots are in the builder's unscaled space, so `scale` has to
 * be the same one `riggedGeometry` was given or the two disagree.
 */
export function dressRigged(
  geometry: THREE.BufferGeometry,
  rig: Rig,
  name: string,
  phase: number,
  scale = 1,
): THREE.SkinnedMesh {
  const names = boneNames(rig);

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
