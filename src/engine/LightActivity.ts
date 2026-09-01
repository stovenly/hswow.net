import * as THREE from 'three';
import { displace, sampleActivity, sampleDrift, type ActivitySource } from '../art/activity';
import { GLOW_LAYER } from '../layers';

/**
 * Drives every light and flame in the active zone off its own activity signal.
 *
 * A builder tags the prop — `mesh.userData.activity` — and not the light, which it
 * has to: a candle prop is three flames sharing a single `PointLight`, and tagging
 * the light would leave the flames still. Collected once when a zone is prepared,
 * released when it is evicted, ticked only for the zone you are standing in, at
 * one signal sample per prop per frame.
 */

/** Past this, a source is left at its resting level. */
const RANGE = 45;

/**
 * How much of the flame's lean the glow geometry takes. A diffusion flame is
 * pinned at the wick and stretches from there, so the body moves less than the
 * light does — the light stands for the luminous centre, which is up the plume
 * where the movement is.
 */
const GLOW_LEAN = 0.5;

/** What counts as the flame, as opposed to anything else hanging off the prop. The glow layer rather than `noCollide`, which a lettered plaque also carries. */
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
   * One per glow mesh, displaced off the prop's. A candle carries three wicks in
   * three meshes and they are three flames, not one flame drawn three times. The
   * first is the prop's own, so the light agrees with the wick it sits on.
   */
  sources: ActivitySource[];
  /** Where each glow mesh sat, and the point it grows about. See `apply`. */
  origins: THREE.Vector3[];
  pivots: THREE.Vector3[];
  scales: Float32Array;
  /** Where each light was placed, which its lean is measured from. */
  stands: THREE.Vector3[];
  /** Whether this flame moves at all, or only brightens. */
  moves: boolean;
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

      const moves = (source.spec.sway ?? 0) > 0 || (source.spec.rise ?? 0) > 0;
      const lights: THREE.Light[] = [];
      const glows: THREE.Mesh[] = [];
      object.traverse((child) => {
        if (child instanceof THREE.Light) {
          // Frozen with the rest of the zone. A light that leans takes its own
          // matrix back, the way `swell` does for the flames.
          if (moves) child.matrixAutoUpdate = true;
          lights.push(child);
        } else if (child instanceof THREE.Mesh && child.layers.test(EMISSIVE)) {
          // A second-pass copy of another mesh's geometry is on the glow layer
          // too; what swells is the mesh that owns it, the copy riding along.
          const owner = child.userData.borrowedGeometry === true ? child.parent : child;
          if (!(owner instanceof THREE.Mesh)) return;
          // A zone's matrices are frozen once it is built — `freezeMatrices` in
          // `ZoneManager` — and `swell` moves this one every frame, so it takes
          // its own back.
          owner.matrixAutoUpdate = true;
          glows.push(owner);
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
        stands: lights.map((light) => light.position.clone()),
        moves,
        dormant: false,
      });
    });

    if (tracked.length) this.zones.set(id, tracked);
  }

  /** Puts every tracked flame back at its authored level — call before a re-collect, so a mid-flicker intensity is never captured as a baseline. */
  settle(id: string): void {
    const tracked = this.zones.get(id);
    if (!tracked) return;
    for (const entry of tracked) rest(entry);
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
      lean(entry, elapsed, level);
      for (let i = 0; i < entry.lights.length; i++) {
        entry.lights[i].position.copy(entry.stands[i]).add(_lean);
      }
      for (let i = 0; i < entry.glows.length; i++) {
        swell(entry, i, i === 0 ? level : sampleActivity(entry.sources[i], elapsed));
      }
    }
  }
}

/** Everything back to the level it was authored at, and back where it stood. */
function rest(entry: Tracked): void {
  for (let i = 0; i < entry.lights.length; i++) {
    entry.lights[i].intensity = entry.intensities[i];
    entry.lights[i].position.copy(entry.stands[i]);
  }
  _lean.set(0, 0, 0);
  for (let i = 0; i < entry.glows.length; i++) swell(entry, i, 1);
}

/**
 * Where this flame is leaning, into `_lean`. Sideways is the room's air; upward
 * is the level itself, because a flame that has stretched is taller and brighter
 * at once and there is no sense in giving that two signals.
 */
function lean(entry: Tracked, elapsed: number, level: number): void {
  if (!entry.moves) {
    _lean.set(0, 0, 0);
    return;
  }
  const sway = entry.source.spec.sway ?? 0;
  sampleDrift(entry.source, elapsed, _drift);
  _lean.set(_drift[0] * sway, (level - 1) * (entry.source.spec.rise ?? 0), _drift[1] * sway);
}

const _drift = new Float32Array(2);
const _lean = new THREE.Vector3();

/**
 * Grows one flame. A glow mesh is scaled about its own origin, so a builder that
 * puts several emitters in one buffer has chosen a pivot between them and its
 * flames slide sideways as they swell; scaling about the geometry's bounding-box
 * centre corrects that as far as one pivot can. The pivot is in geometry space and
 * the position it corrects is in the parent's, so this holds only while a glow
 * mesh is unrotated — builders rotate glow geometry instead.
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
    origin.x + pivot.x * shift + _lean.x * GLOW_LEAN,
    origin.y + pivot.y * shift + _lean.y * GLOW_LEAN,
    origin.z + pivot.z * shift + _lean.z * GLOW_LEAN,
  );
}

function pivotOf(glow: THREE.Mesh): THREE.Vector3 {
  const geometry = glow.geometry;
  if (!geometry.boundingBox) geometry.computeBoundingBox();
  return geometry.boundingBox?.getCenter(new THREE.Vector3()) ?? new THREE.Vector3();
}
