import * as THREE from 'three';
import {
  aimWindow,
  lightWindow,
  MIN_ELEVATION,
  type WindowMetrics,
} from '../art/builders/window';
import type { Daylight } from './daylight';

/**
 * Swings every driven window in the active zone with the sun.
 *
 * Mirrors `LightActivity`: collected once when a zone is prepared, released when
 * it is evicted, ticked only for the zone you are standing in. A window is
 * collected only if its zone has said which way it faces — a room with no
 * bearing has no business being driven by a sky it cannot locate — and only if
 * nothing has held it.
 */

/** Past this, a window is left where it was. */
const RANGE = 45;
/**
 * What a `shine` window's opening is worth with nothing in the sky, lifted to 1
 * as the sky fills. Blended rather than clamped: taking the larger of the two
 * leaves the pane flat until the sky climbs past the floor and then moving, and
 * a corner in the curve reads as a click. `dark` windows take the sky's own
 * value and do go out.
 */
const NIGHT_FLOOR = 0.03;
/**
 * Where the beam goes as the sun swings round the wall: gone by 1.3 radians off
 * square, full by 1.0. Compared against `cos(azimuth)` rather than the angle, so
 * a sun behind the wall lands below the first threshold and is off outright.
 */
const GRAZE_GONE = Math.cos(1.3);
const GRAZE_FULL = Math.cos(1.0);

interface Tracked {
  prop: THREE.Object3D;
  metrics: WindowMetrics;
  /** World into this window's own frame, with both bearings already in it. */
  inverse: THREE.Quaternion;
  /** The curtains are drawn, so there is nothing to aim. */
  paneOnly: boolean;
}

const UP = new THREE.Vector3(0, 1, 0);
const _key = new THREE.Vector3();
const _turn = new THREE.Quaternion();

export class WindowLight {
  private readonly zones = new Map<string, Tracked[]>();

  /**
   * Walks a freshly built zone for its windows. `bearing` is degrees the zone's
   * +Z is turned from world +Z; undefined means the zone has not said, and none
   * of its windows are driven.
   */
  collect(id: string, root: THREE.Object3D, bearing: number | undefined): void {
    if (bearing === undefined) return;
    const tracked: Tracked[] = [];
    const zoneInverse = new THREE.Quaternion().setFromAxisAngle(UP, (-bearing * Math.PI) / 180);

    root.traverse((object) => {
      const metrics = object.userData.window as WindowMetrics | undefined;
      if (!metrics || !metrics.driven) return;

      // Takes a world direction to the window's own frame, right to left: out of
      // the world into the zone, out of the zone into the prop, then the odd
      // wall's own turn. `freezeMatrices` has run, so this is paid once.
      const inverse = new THREE.Quaternion().setFromAxisAngle(UP, -metrics.bearing);
      inverse.multiply(object.getWorldQuaternion(_turn).invert()).multiply(zoneInverse);

      tracked.push({
        prop: object,
        metrics,
        inverse,
        paneOnly: !object.getObjectByName('window:shaft'),
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

  update(id: string | null, daylight: Daylight, eye: THREE.Vector3): void {
    const tracked = id ? this.zones.get(id) : undefined;
    if (!tracked) return;

    // Every window in range, every frame. Spreading them over eight was a
    // saving of nothing — a room holds two or three — and it is the one thing
    // here that can turn a moving sky into a row of steps.
    const limit = RANGE * RANGE;
    for (const entry of tracked) {
      const at = entry.prop.matrixWorld.elements;
      const dx = at[12] - eye.x;
      const dy = at[13] - eye.y;
      const dz = at[14] - eye.z;
      if (dx * dx + dy * dy + dz * dz > limit) continue;
      aim(entry, daylight);
    }
  }
}

function aim(entry: Tracked, daylight: Daylight): void {
  // Toward the key, in the window's frame. Light travels the other way, and the
  // angles `aimWindow` takes are of the travel: `dx = sin(az)cos(el)`,
  // `dy = -sin(el)`, `dz = cos(az)cos(el)`.
  _key.copy(daylight.direction).applyQuaternion(entry.inverse);
  const elevation = Math.asin(_key.y < -1 ? -1 : _key.y > 1 ? 1 : _key.y);
  const azimuth = Math.atan2(-_key.x, -_key.z);

  // The clamps in `aimWindow` stop the shear inverting and the shaft blowing
  // up, but on their own a sun swinging past one leaves a beam frozen at full
  // brightness pointing the wrong way. These are what actually put it out.
  const graze = smoothstep(GRAZE_GONE, GRAZE_FULL, Math.cos(azimuth));
  const horizon = smoothstep(MIN_ELEVATION, MIN_ELEVATION * 2, elevation);
  const beam = daylight.beam * graze * horizon;
  const sky =
    entry.metrics.night === 'shine'
      ? NIGHT_FLOOR + (1 - NIGHT_FLOOR) * daylight.glow
      : daylight.glow;

  lightWindow(entry.prop, daylight.colour, sky, beam);
  if (!entry.paneOnly && beam > 0) aimWindow(entry.prop, azimuth, elevation);
}

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}
