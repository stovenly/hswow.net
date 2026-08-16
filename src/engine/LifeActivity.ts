import * as THREE from 'three';
import { Creature, type World } from '../life/Creature';
import type { Collider } from '../player/Collider';
import type { AudioEngine } from '../audio/AudioEngine';
import type { Obstacle } from '../player/Controller';

/**
 * Drives every creature in the active zone. LIFE.md §6.
 *
 * The `ClothActivity` shape: collected once when a zone is prepared, released
 * when it is evicted, updated only for the zone you are standing in and only
 * within range. A creature past the range holds its last pose — at fifty
 * metres a still cow is a cow.
 */

const RANGE = 55;

/** The options toggle: off holds every creature in its current pose. */
let enabled = true;
export function setLifeEnabled(on: boolean): void {
  enabled = on;
}

export class LifeActivity {
  private readonly zones = new Map<string, Creature[]>();
  private readonly awakeList: Creature[] = [];
  /** The creatures' footprints, handed to the player's controller each frame. */
  readonly obstacles: Obstacle[] = [];
  /** For readouts: creatures updated last frame. */
  awake = 0;

  collect(id: string, root: THREE.Object3D): void {
    const creatures: Creature[] = [];
    root.traverse((object) => {
      if (object.userData.rig && object.userData.life && (object as THREE.SkinnedMesh).isSkinnedMesh) {
        creatures.push(new Creature(object as THREE.SkinnedMesh));
      }
    });
    if (creatures.length) this.zones.set(id, creatures);
  }

  release(id: string): void {
    const creatures = this.zones.get(id);
    if (creatures) for (const creature of creatures) creature.dispose();
    this.zones.delete(id);
  }

  clear(): void {
    for (const creatures of this.zones.values()) for (const creature of creatures) creature.dispose();
    this.zones.clear();
    this.obstacles.length = 0;
  }

  update(
    id: string | null,
    dt: number,
    player: THREE.Vector3,
    eye: THREE.Vector3,
    groundAt: (x: number, z: number) => number,
    collider: Collider,
    audio: AudioEngine | null,
    retestOcclusion: boolean,
  ): void {
    this.awake = 0;
    this.obstacles.length = 0;
    const creatures = id ? this.zones.get(id) : undefined;
    if (!creatures || !enabled) return;

    const awake = this.awakeList;
    awake.length = 0;
    const limit = RANGE * RANGE;
    for (const creature of creatures) {
      const p = creature.mesh.position;
      const dx = p.x - player.x;
      const dz = p.z - player.z;
      const near = dx * dx + dz * dz < limit;
      creature.setAwake(near);
      if (near) awake.push(creature);
    }

    const world: World = { player, eye, groundAt, collider, audio, retestOcclusion, others: awake };
    for (const creature of awake) {
      creature.update(dt, world);
      const p = creature.mesh.position;
      this.obstacles.push({ x: p.x, z: p.z, y: p.y, radius: creature.radius, height: creature.height });
    }
    this.awake = awake.length;
  }
}
