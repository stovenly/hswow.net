import * as THREE from 'three';
import { COLLISION_LAYER } from '../layers';

/**
 * The static group: everything in a zone that no layer-restricted pass can
 * want. The water, glass, particle, glow, held and mask passes hide it around
 * their render, so `projectObject` skips the whole subtree instead of walking
 * every prop to test its layers.
 */

/** Layer bits a static subtree may carry. Anything else is a pass's business. */
const STATIC_MASK = 1 | (1 << COLLISION_LAYER);

const STATIC_NAME = 'static';

/** Every static group in the world, whatever zone it belongs to. */
const groups = new Set<THREE.Group>();

function isStatic(object: THREE.Object3D): boolean {
  let plain = true;
  object.traverse((child) => {
    if (!plain) return;
    if (
      child instanceof THREE.Light ||
      (child.layers.mask & ~STATIC_MASK) !== 0 ||
      child.userData.rig !== undefined ||
      child.userData.cloth !== undefined ||
      child.userData.vistaParallax !== undefined
    ) {
      plain = false;
    }
  });
  return plain;
}

/**
 * Gathers a root's static children under one group. Run after every layer and
 * light has been decided, and again whenever the zone is re-dressed: an
 * existing group is flattened first so nothing is sorted twice.
 */
export function partitionStatic(root: THREE.Object3D): void {
  let group = root.children.find((child) => child.name === STATIC_NAME) as THREE.Group | undefined;
  if (group) {
    for (const child of [...group.children]) root.add(child);
  } else {
    group = new THREE.Group();
    group.name = STATIC_NAME;
    group.matrixAutoUpdate = false;
    root.add(group);
    groups.add(group);
  }
  for (const child of [...root.children]) {
    if (child !== group && isStatic(child)) group.add(child);
  }
}

/** Forgets a root's group. For a zone being disposed. */
export function releaseStatic(root: THREE.Object3D): void {
  for (const child of root.children) {
    if (child.name === STATIC_NAME) groups.delete(child as THREE.Group);
  }
}

/** Runs a render with every static group hidden. */
export function withStaticHidden(render: () => void): void {
  for (const group of groups) group.visible = false;
  try {
    render();
  } finally {
    for (const group of groups) group.visible = true;
  }
}
