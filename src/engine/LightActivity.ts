import * as THREE from 'three';
import { displace, sampleActivity, type ActivitySource } from '../art/activity';
import { GLOW_LAYER } from '../layers';

/**
 * Drives every light and flame in the active zone off its own activity signal.
 *
 * A builder tags the *prop* — `mesh.userData.activity` — and not the light. One
 * tag then covers however many lights and glow meshes stand under it, which it
 * has to: a candle prop is three flames sharing a single `PointLight`, and
 * tagging the light would leave the flames still.
 *
 * Collected once when a zone is prepared, released when it is evicted, and
 * ticked only for the zone you are standing in. The cost is one signal sample
 * per prop per frame — not per light — plus two writes.
 *
 * See `art/activity.ts` for what the signal is and why it is a pure function of
 * time rather than something stepped per frame.
 */

/** Past this, a source is left at its resting level. */
const RANGE = 45;

/**
 * What counts as the flame, as opposed to anything else hanging off the prop.
 *
 * The glow layer rather than `noCollide`, which a lettered plaque also carries
 * — and a sign that breathed with the fire beside it would be a strange thing
 * to have to diagnose.
 */
const EMISSIVE = new THREE.Layers();
EMISSIVE.set(GLOW_LAYER);

interface Tracked {
  /** The prop's own, which drives its lights. */
  source: ActivitySource;
  prop: THREE.Object3D;
  lights: THREE.Light[];
  /** What each light was authored at, which is what the signal multiplies. */
  intensities: Float32Array;
  glows: THREE.Mesh[];
  /**
   * One per glow mesh, displaced off the prop's. A candle carries three wicks
   * in three meshes and they are three flames, not one flame drawn three times
   * — the same argument that decorrelates two candles, one prop further in.
   * The first is the prop's own, so the light agrees with the wick it sits on.
   */
  sources: ActivitySource[];
  /** Where each glow mesh sat, and the point it grows about. See `apply`. */
  origins: THREE.Vector3[];
  pivots: THREE.Vector3[];
  scales: Float32Array;
  dormant: boolean;
}

export class LightActivity {
  private readonly zones = new Map<string, Tracked[]>();

  /** Walks a freshly built zone once and records everything that moves in it. */
  collect(id: string, root: THREE.Object3D): void {
    const tracked: Tracked[] = [];

    root.traverse((object) => {
      const source = object.userData.activity as ActivitySource | undefined;
      if (!source) return;

      const lights: THREE.Light[] = [];
      const glows: THREE.Mesh[] = [];
      object.traverse((child) => {
        if (child instanceof THREE.Light) lights.push(child);
        else if (child instanceof THREE.Mesh && child.layers.test(EMISSIVE)) {
          // A zone's matrices are frozen once it is built — `freezeMatrices` in
          // `ZoneManager` — and `swell` moves this one every frame, so it takes
          // its own back.
          child.matrixAutoUpdate = true;
          glows.push(child);
        }
      });
      if (!lights.length && !glows.length) return;

      // Two props built from the same seed would otherwise be in lockstep, so
      // the phases are displaced by where this one is standing.
      object.updateWorldMatrix(true, false);
      const at = object.matrixWorld.elements;
      const salt = Math.imul(Math.round(at[12] * 71) ^ Math.round(at[14] * 131), 0x9e3779b9);
      const displaced = displace(source, salt);

      tracked.push({
        source: displaced,
        prop: object,
        lights,
        intensities: Float32Array.from(lights.map((light) => light.intensity)),
        glows,
        sources: glows.map((_, i) =>
          i === 0 ? displaced : displace(displaced, Math.imul(i, 0x85ebca6b)),
        ),
        origins: glows.map((glow) => glow.position.clone()),
        pivots: glows.map((glow) => pivotOf(glow)),
        scales: Float32Array.from(glows.map((glow) => glow.scale.x)),
        dormant: false,
      });
    });

    if (tracked.length) this.zones.set(id, tracked);
  }

  release(id: string): void {
    this.zones.delete(id);
  }

  clear(): void {
    this.zones.clear();
  }

  update(id: string | null, elapsed: number, eye: THREE.Vector3): void {
    const tracked = id ? this.zones.get(id) : undefined;
    if (!tracked) return;

    const limit = RANGE * RANGE;
    for (const entry of tracked) {
      const at = entry.prop.matrixWorld.elements;
      const dx = at[12] - eye.x;
      const dy = at[13] - eye.y;
      const dz = at[14] - eye.z;

      if (dx * dx + dy * dy + dz * dz > limit) {
        // Set once on the way out rather than every frame, so a village full of
        // lit windows costs three subtractions each.
        if (!entry.dormant) rest(entry);
        entry.dormant = true;
        continue;
      }

      entry.dormant = false;
      const level = sampleActivity(entry.source, elapsed);
      for (let i = 0; i < entry.lights.length; i++) {
        entry.lights[i].intensity = entry.intensities[i] * level;
      }
      for (let i = 0; i < entry.glows.length; i++) {
        swell(entry, i, i === 0 ? level : sampleActivity(entry.sources[i], elapsed));
      }
    }
  }
}

/** Everything back to the level it was authored at. */
function rest(entry: Tracked): void {
  for (let i = 0; i < entry.lights.length; i++) {
    entry.lights[i].intensity = entry.intensities[i];
  }
  for (let i = 0; i < entry.glows.length; i++) swell(entry, i, 1);
}

/**
 * Grows one flame.
 *
 * A glow mesh is scaled about its own origin, and a builder that puts several
 * emitters in one buffer has therefore chosen a pivot between them — its
 * flames slide sideways as they swell rather than growing where they stand.
 * Scaling about the geometry's bounding-box centre corrects that as far as one
 * pivot can, which is exactly: a buffer holding one emitter is right, and a
 * buffer holding several is still a compromise. `candle` gives each wick its
 * own mesh for that reason.
 *
 * The pivot is in geometry space and the position it corrects is in the
 * parent's, so this holds only while a glow mesh is unrotated. Builders rotate
 * glow *geometry* instead, which they were already doing.
 */
function swell(entry: Tracked, i: number, level: number): void {
  const grow = 1 + (level - 1) * entry.source.spec.glow;
  const glow = entry.glows[i];
  const base = entry.scales[i];
  glow.scale.setScalar(base * grow);
  // Where the pivot has moved to, taken back off the position.
  const shift = base * (1 - grow);
  const pivot = entry.pivots[i];
  const origin = entry.origins[i];
  glow.position.set(
    origin.x + pivot.x * shift,
    origin.y + pivot.y * shift,
    origin.z + pivot.z * shift,
  );
}

function pivotOf(glow: THREE.Mesh): THREE.Vector3 {
  const geometry = glow.geometry;
  if (!geometry.boundingBox) geometry.computeBoundingBox();
  return geometry.boundingBox?.getCenter(new THREE.Vector3()) ?? new THREE.Vector3();
}
