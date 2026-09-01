import * as THREE from 'three';
import type { Collider } from '../player/Collider';
import type { Item } from './items';

/**
 * What the player is looking at, and whether they can reach it. There is no mouse
 * cursor to hover with — the crosshair in the middle of the screen is the cursor —
 * so hovering means a ray straight down the view axis.
 *
 * Everything is gated on `reach`, which is what makes the tooltip mean something:
 * a label that appeared the moment a door was in view would be a caption on the
 * scenery. If you can read it, you can use it.
 */

/** Metres. About arm's length with a small step of grace. */
export const DEFAULT_REACH = 2.2;

/**
 * Slack when comparing the interaction ray against the collision ray. Doors are
 * solid, so the collider's nearest hit is normally the door itself at very nearly
 * the same distance; only something meaningfully nearer counts as being in the
 * way. Too small and a door occludes itself, too large and you can use one
 * through a thin wall.
 */
const OCCLUSION_SLACK = 0.15;

export interface Hover {
  object: THREE.Object3D;
  distance: number;
}

/**
 * Marks an object as something the player can read but not use. A door is a link;
 * a gallery sign is a caption on a row of props with nothing to press. Both want
 * the same tooltip, so the label is stored on the object rather than derived from
 * the portal graph. The tooltip layer sits above the canvas and stays sharp, which
 * is what keeps walking up to a thing the right way to name anything smaller than
 * a sign.
 */
export function markLabelled<T extends THREE.Object3D>(object: T, label: string): T {
  object.userData.label = label;
  return object;
}

/**
 * Marks an object as something the player can read and open — the third state, and
 * why the zone manager stopped answering with yes or no: a bound book names itself
 * over the crosshair like a sign and does something when you press the key like a
 * door. The binding is one id into `content/notes`, never the prose, and it is the
 * binding that makes the tooltip two lines.
 */
export function markReadable<T extends THREE.Object3D>(
  object: T,
  /**
   * The builder that made it, not a string: what the player calls a prop is fixed
   * per builder, so taking it from the source means a cover cannot be renamed in
   * one place and keep its old name over every crosshair. Structurally typed, so
   * this file does not have to learn about the art kit.
   */
  source: { readonly name: string; readonly display?: string },
  text: string,
): T {
  object.userData.label = source.display ?? source.name;
  object.userData.text = text;
  return object;
}

/** What a hovered object says about itself: its name, and any note bound to it. */
export interface Labelled {
  readonly label: string;
  /** The note's id. Its presence is what makes the thing readable. */
  readonly text?: string;
}

/**
 * Reads the label off an object or the nearest ancestor carrying one. Both fields
 * come from the same node rather than from two separate walks, so a book standing
 * inside something else labelled cannot show one thing's name over another's prose.
 */
export function labelOf(object: THREE.Object3D | null): Labelled | null {
  for (let node = object; node; node = node.parent) {
    const label = node.userData.label;
    if (typeof label !== 'string') continue;
    const text = node.userData.text;
    return { label, text: typeof text === 'string' ? text : undefined };
  }
  return null;
}

/** Stored as `userData.pickup` by the item systems. `key` is the record the affected delta speaks; `placedId` is set on items the player put down. */
export interface PickupInfo {
  readonly key: string;
  readonly item: Item;
  readonly placedId?: string;
}

/** Stored as `userData.container`. `kind` is the builder name and picks the loot table. */
export interface ContainerInfo {
  readonly key: string;
  readonly kind: string;
  readonly display: string;
}

/**
 * The nearest ancestor carrying a pickup or container mark, whichever comes
 * first — one walk, so an item standing on a marked container names itself
 * rather than what it stands on.
 */
export function carriedOf(
  object: THREE.Object3D | null,
): { node: THREE.Object3D; pickup?: PickupInfo; container?: ContainerInfo } | null {
  for (let node = object; node; node = node.parent) {
    const pickup = node.userData.pickup as PickupInfo | undefined;
    if (pickup) return { node, pickup };
    const container = node.userData.container as ContainerInfo | undefined;
    if (container) return { node, container };
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
   * The nearest interactable under the crosshair, or null. Two rays, not one: a mesh
   * raycast against the handful of registered interactables, which gives back the
   * object identity the collider's triangle soup cannot, and the collider, which
   * knows about walls the interactable set has never heard of.
   */
  probe(camera: THREE.Camera, collider: Collider, through?: THREE.Vector2): Hover | null {
    if (this.targets.length === 0) return null;

    camera.updateWorldMatrix(true, false);
    this.raycaster.far = this.reach;
    if (through) {
      // The free cursor while a screen is open: the same ray and the same
      // occlusion, aimed through the pointer instead of down the view axis.
      this.raycaster.setFromCamera(through, camera);
      _origin.copy(this.raycaster.ray.origin);
      _direction.copy(this.raycaster.ray.direction);
    } else {
      _origin.setFromMatrixPosition(camera.matrixWorld);
      _direction.set(0, 0, -1).applyQuaternion(camera.getWorldQuaternion(_quaternion));
      this.raycaster.set(_origin, _direction);
    }

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
