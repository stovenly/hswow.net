import * as THREE from 'three';
import { windUniforms } from '../art/sway';
import type { Weather } from '../audio/weather';
import type { ClothInstance } from '../art/clothMesh';

/**
 * Drives every simulated cloth in the active zone. CLOTH.md §8–§9.
 *
 * The `LightActivity` shape: collected once when a zone is prepared, released
 * when it is evicted, stepped only for the zone you are standing in. Each
 * cloth samples `Weather.strengthAt` at its own position — the gust front you
 * watch cross the valley bending trees arrives at the flag on the same frame
 * it arrives at the tree beside it.
 */

/** Past this, a cloth freezes in its last pose. A banner there is a few pixels. */
const SLEEP_RANGE = 40;
/** Asleep longer than this, a wake settles first — a cloth frozen mid-gust and
 * revealed minutes later in calm air should not resume a gust that no longer
 * exists. */
const STALE_AFTER = 2;
const SETTLE_STEPS = 12;

/** The options toggle: off freezes every cloth in its settled pose. */
let enabled = true;
export function setClothSimulation(on: boolean): void {
  enabled = on;
}

/** Dev-only: the fabrics gallery's wind station. Null follows the weather. */
let windOverride: number | null = null;
export function setClothWindOverride(strength: number | null): void {
  windOverride = strength;
}

/** Dev-only freeze, separate from the option so the menu cannot fight it. */
let frozen = false;
export function setClothFrozen(on: boolean): void {
  frozen = on;
}

interface TrackedCloth {
  instance: ClothInstance;
  mesh: THREE.Mesh;
  /** When it last stepped, for the stale-wake settle. */
  lastStepped: number;
  helpers: THREE.Object3D[] | null;
}

const WIREFRAME = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x35d08c });

export class ClothActivity {
  private readonly zones = new Map<string, TrackedCloth[]>();
  private elapsed = 0;
  private wireframes = false;
  /** For readouts: cloths stepped last frame. */
  awake = 0;

  /** Walks a freshly built zone once and records every cloth in it. */
  collect(id: string, root: THREE.Object3D): void {
    const tracked: TrackedCloth[] = [];
    root.traverse((object) => {
      const instance = object.userData.cloth as ClothInstance | undefined;
      if (!instance || !(object instanceof THREE.Mesh)) return;
      tracked.push({ instance, mesh: object, lastStepped: -Infinity, helpers: null });
    });
    if (tracked.length) this.zones.set(id, tracked);
  }

  release(id: string): void {
    this.zones.delete(id);
  }

  clear(): void {
    this.zones.clear();
  }

  /** Collider wireframes, for the fabrics gallery's no-clipping row. */
  setWireframes(on: boolean): void {
    this.wireframes = on;
  }

  update(id: string | null, dt: number, weather: Weather, eye: THREE.Vector3): void {
    this.elapsed += dt;
    this.awake = 0;
    const tracked = id ? this.zones.get(id) : undefined;
    if (!tracked) return;

    for (const entry of tracked) {
      if (this.wireframes !== (entry.helpers !== null)) this.toggleHelpers(entry);
    }
    if (!enabled || frozen) return;

    // The same composed player-option × zone-wind the trees obey: a
    // reduced-motion world stills the flags too, and gravity still drapes them.
    const sway = windUniforms.swayAmount.value;
    const windAngle = weather.settings.windDirection;
    const worldX = Math.cos(windAngle);
    const worldZ = Math.sin(windAngle);
    const limit = SLEEP_RANGE * SLEEP_RANGE;

    for (const entry of tracked) {
      const m = entry.mesh.matrixWorld.elements;
      const dx = m[12] - eye.x;
      const dy = m[13] - eye.y;
      const dz = m[14] - eye.z;
      // Asleep means frozen in last pose — no integration, no upload.
      if (dx * dx + dy * dy + dz * dz > limit) continue;

      if (this.elapsed - entry.lastStepped > STALE_AFTER) {
        entry.instance.sim.settle(SETTLE_STEPS);
      }
      entry.lastStepped = this.elapsed;

      const strength = (windOverride ?? weather.strengthAt(m[12], m[14])) * sway;

      // The wind in the cloth's own frame. Only Y rotation and uniform scale
      // are ever used, so dotting with the basis columns over the scale
      // squared inverts the rotation — the sway shader's own trick.
      const scaleSq = Math.max(m[0] * m[0] + m[1] * m[1] + m[2] * m[2], 1e-6);
      let lx = (m[0] * worldX + m[2] * worldZ) / scaleSq;
      let lz = (m[8] * worldX + m[10] * worldZ) / scaleSq;
      const len = Math.sqrt(lx * lx + lz * lz) || 1;
      lx /= len;
      lz /= len;

      entry.instance.sim.step(dt, { x: lx, z: lz, strength, time: this.elapsed });
      entry.instance.refresh();
      this.awake++;
    }
  }

  private toggleHelpers(entry: TrackedCloth): void {
    if (entry.helpers) {
      for (const helper of entry.helpers) {
        helper.removeFromParent();
        if (helper instanceof THREE.Mesh) helper.geometry.dispose();
      }
      entry.helpers = null;
      return;
    }

    const helpers: THREE.Object3D[] = [];
    for (const collider of entry.instance.sim.colliders) {
      if (collider.kind === 'ground') continue;
      let helper: THREE.Mesh;
      if (collider.kind === 'sphere') {
        helper = new THREE.Mesh(new THREE.SphereGeometry(collider.radius, 12, 8), WIREFRAME);
        helper.position.set(collider.at[0], collider.at[1], collider.at[2]);
      } else {
        const a = new THREE.Vector3(...collider.a);
        const b = new THREE.Vector3(...collider.b);
        const axis = b.clone().sub(a);
        const length = axis.length();
        helper = new THREE.Mesh(
          new THREE.CapsuleGeometry(collider.radius, length, 3, 10),
          WIREFRAME,
        );
        helper.position.copy(a).addScaledVector(axis, 0.5);
        if (length > 1e-6) {
          helper.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            axis.divideScalar(length),
          );
        }
      }
      helper.userData.noCollide = true;
      helper.castShadow = false;
      // Beside the panel, in the same local frame the colliders are declared in.
      entry.mesh.add(helper);
      helpers.push(helper);
    }
    entry.helpers = helpers;
  }
}
