import * as THREE from 'three';
import { builderByName } from '../art/registry';
import { HELD_LAYER } from '../layers';
import { hashString } from '../world/loot';
import type { Item } from '../world/items';

/**
 * The equipped tool, drawn in the world at the camera's right hand. Swinging is
 * a gesture and nothing else yet: the arc plays and no world query is made.
 */

const SWING_TIME = 0.32;
/** Camera-space grip: right, down and forward of the eye, in metres. */
const GRIP = new THREE.Vector3(0.34, -0.32, -0.55);

const _offset = new THREE.Vector3();
const _tilt = new THREE.Quaternion();
const _euler = new THREE.Euler();

export class HeldTool {
  private readonly holder = new THREE.Group();
  /** Seconds into the current swing; past SWING_TIME is idle. */
  private arc = SWING_TIME;
  private signature = '';

  constructor(scene: THREE.Scene) {
    scene.add(this.holder);
    this.holder.visible = false;
  }

  setItem(item: Item | null): void {
    const signature = item ? `${item.builder ?? ''}:${item.seed ?? 0}:${item.name}` : '';
    if (signature === this.signature) return;
    this.signature = signature;

    for (const child of [...this.holder.children]) {
      child.removeFromParent();
      release(child);
    }
    this.holder.visible = false;
    if (!item) return;

    const stand = (item.builder ? builderByName(item.builder) : undefined) ?? builderByName('sack');
    if (!stand) return;
    const seed = item.seed ?? hashString(item.name) % 1_000_000;
    const mesh = stand.build({ seed });
    stripLights(mesh);
    // HELD_LAYER only: out of every world pass, drawn by the held overlay.
    mesh.traverse((child) => {
      child.layers.set(HELD_LAYER);
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    const scale = THREE.MathUtils.clamp(0.5 / Math.max(stand.radius, 0.15), 0.35, 1.3);
    mesh.scale.setScalar(scale);
    this.holder.add(mesh);
    this.holder.visible = true;
  }

  /** Starts a swing, or reports that one could not start — nothing held, or mid-arc. */
  swing(): boolean {
    if (!this.holder.visible || this.arc < SWING_TIME) return false;
    this.arc = 0;
    return true;
  }

  get visible(): boolean {
    return this.holder.visible;
  }

  get swinging(): boolean {
    return this.arc < SWING_TIME;
  }

  update(camera: THREE.Camera, dt: number): void {
    if (!this.holder.visible) return;

    let bend = 0;
    if (this.arc < SWING_TIME) {
      this.arc = Math.min(this.arc + dt, SWING_TIME);
      bend = Math.sin((this.arc / SWING_TIME) * Math.PI) * -1.15;
    }

    this.holder.position
      .copy(camera.position)
      .add(_offset.copy(GRIP).applyQuaternion(camera.quaternion));
    // rotateX lays the tool's +Y forward over the hand; the yaw turns its face
    // in toward the view. The swing bends further about the same axis.
    _tilt.setFromEuler(_euler.set(-0.5 + bend, 0.4, 0.12));
    this.holder.quaternion.copy(camera.quaternion).multiply(_tilt);
  }

  dispose(): void {
    for (const child of [...this.holder.children]) {
      child.removeFromParent();
      release(child);
    }
    this.holder.removeFromParent();
  }
}

function stripLights(root: THREE.Object3D): void {
  const lights: THREE.Object3D[] = [];
  root.traverse((child) => {
    if (child instanceof THREE.Light) lights.push(child);
  });
  for (const light of lights) light.removeFromParent();
}

function release(root: THREE.Object3D): void {
  root.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      for (const material of [object.material].flat()) {
        if (material.userData.owned) material.dispose();
      }
    }
  });
}
