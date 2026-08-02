import * as THREE from 'three';
import type { Collider } from '../player/Collider';

/**
 * What the player is looking at, and whether they can reach it.
 *
 * There is no mouse cursor to hover with — the pointer is captured, and the
 * crosshair in the middle of the screen *is* the cursor. So "hovering over a
 * door" means a ray straight down the view axis, and the tooltip appears above
 * the crosshair rather than above a pointer that does not exist.
 *
 * Everything is gated on `reach`. That is not only a rule about how far you can
 * lean; it is what makes the tooltip mean something. A label that appears the
 * moment a door is anywhere in view would be a caption on the scenery, and the
 * player would have to learn separately how close they need to be. Showing it
 * only within reach makes the tooltip and the affordance the same fact: **if
 * you can read it, you can use it.**
 */

/** Metres. A little more than arm's length, so you needn't press up against it. */
export const DEFAULT_REACH = 3.2;

/**
 * Slack when comparing the interaction ray against the collision ray.
 *
 * Doors are solid, so the collider's nearest hit along the view axis is
 * normally the door itself, at very nearly the same distance the mesh raycast
 * reported. Only something meaningfully *nearer* than the door counts as being
 * in the way. Too small and a door occludes itself; too large and you can use
 * a door through a thin wall.
 */
const OCCLUSION_SLACK = 0.15;

export interface Hover {
  object: THREE.Object3D;
  distance: number;
}

/**
 * Marks an object as something the player can read but not use.
 *
 * A door is a *link*: hovering it offers a place to go, and pressing the key
 * takes you there. A gallery sign is not — it is a caption on a row of props,
 * and there is nothing to press. Both want the same tooltip, so the label is
 * stored on the object rather than derived from the portal graph, and the zone
 * manager falls back to it when the thing under the crosshair turns out not to
 * be a door.
 *
 * This is also how most of the kit gets labels. The world *can* carry text
 * now — `art/lettering` builds sign-scale geometric letters that survive the
 * pipeline — but that works at sign scale and above, and a caption has to be
 * readable at caption scale. The tooltip layer sits above the canvas and
 * stays sharp, which keeps "walk up to it and read it" the right way to name
 * anything smaller than a sign.
 */
export function markLabelled<T extends THREE.Object3D>(object: T, label: string): T {
  object.userData.label = label;
  return object;
}

/** Reads a label off an object or the nearest ancestor carrying one. */
export function labelOf(object: THREE.Object3D | null): string | null {
  for (let node = object; node; node = node.parent) {
    const label = node.userData.label;
    if (typeof label === 'string') return label;
  }
  return null;
}

export class Interaction {
  reach = DEFAULT_REACH;

  private readonly raycaster = new THREE.Raycaster();
  private targets: THREE.Object3D[] = [];

  constructor() {
    this.raycaster.far = this.reach;
  }

  /** Replaces the interactable set. Called whenever the active zone changes. */
  setTargets(objects: THREE.Object3D[]): void {
    this.targets = objects;
  }

  get targetCount(): number {
    return this.targets.length;
  }

  /**
   * The nearest interactable under the crosshair, or null.
   *
   * Two rays, not one. The first is a mesh raycast against the handful of
   * registered interactables, which is cheap because there are only ever a few
   * of them and it gives back the object identity that the collider's triangle
   * soup cannot. The second is the collider, which knows about walls the
   * interactable set has never heard of — without it you could open a door
   * from the far side of the wall it is set into.
   */
  probe(camera: THREE.Camera, collider: Collider): Hover | null {
    if (this.targets.length === 0) return null;

    camera.updateWorldMatrix(true, false);
    _origin.setFromMatrixPosition(camera.matrixWorld);
    _direction.set(0, 0, -1).applyQuaternion(camera.getWorldQuaternion(_quaternion));

    this.raycaster.far = this.reach;
    this.raycaster.set(_origin, _direction);

    // `true` — doors are merged into a single mesh but are parented into the
    // zone's group, and a caller may well register a group rather than a mesh.
    const hits = this.raycaster.intersectObjects(this.targets, true);
    if (hits.length === 0) return null;

    const hit = hits[0];
    const blocker = collider.raycast(_origin, _direction);
    if (blocker !== null && blocker < hit.distance - OCCLUSION_SLACK) return null;

    return { object: hit.object, distance: hit.distance };
  }
}

const _origin = new THREE.Vector3();
const _direction = new THREE.Vector3();
const _quaternion = new THREE.Quaternion();
