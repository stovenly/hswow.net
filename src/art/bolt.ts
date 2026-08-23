import * as THREE from 'three';
import { GLOW_LAYER } from '../layers';
import { createRng } from './random';

/**
 * The visible lightning channel: one camera-facing ribbon mesh, built once and
 * rewritten per strike. Art, but not a builder — it makes no object anybody
 * places, and it is carried on the camera like the dome rather than standing
 * anywhere in the world.
 */

/** Segments the buffer holds. Each is drawn twice, as a sheath and a core. */
const SEGMENTS = 64;
const QUADS = SEGMENTS * 2;

/** Points down the main channel, and the most any one branch may have. */
const TRUNK = 26;
const BRANCH = 7;
const BRANCHES = 4;

/**
 * Metres out from the camera a bolt beyond the far plane is drawn at. Inside
 * the 500 m far plane and inside the dome, so the vista ring and the treeline
 * in front of it occlude it — which is right, because a bolt six kilometres off
 * is behind the hills.
 */
const SHELL = 460;

/** A bolt is a white core in a violet sheath; one flat colour reads as a crack in the screen. */
const CORE = new THREE.Color(2.6, 2.6, 2.8);
const SHEATH = new THREE.Color(0.5, 0.34, 0.95);
/** The core's width against the sheath's, and the thinnest it may be drawn. */
const CORE_WIDTH = 0.45;
const CORE_FLOOR = 0.35;

/**
 * Radians one chunky pixel spans, near enough: a 70 degree field over a frame
 * rendered at about a third of display resolution. A channel is a metre across
 * over kilometres of length, so its drawn width is an angle rather than a
 * fraction of itself — sized in metres it is either invisible at six kilometres
 * or a wall at two hundred.
 */
const PIXEL = 0.0036;

export interface BoltStrike {
  /** Unit, toward the strike. */
  toward: THREE.Vector3;
  /** Kilometres. */
  range: number;
  /** Metres the channel's top stands above its foot, before any scaling. */
  height: number;
  channel: 'fork' | 'crawl';
  /** How far the channel wanders off straight, as a fraction of its length. */
  wander: number;
  /** Channel width in chunky pixels. */
  width: number;
  seed: number;
}

export interface Bolt {
  readonly mesh: THREE.Mesh;
  /** Rewrites the channel in place. */
  strike(spec: BoltStrike): void;
  /** How hard it burns, 0..1. The flash's own curve drives this. */
  setBrightness(value: number): void;
  clear(): void;
  dispose(): void;
}

/**
 * Additive, unlit and unfogged, like every other glow. Module scope because
 * `PostFX.hideGlowFromNormals` names the materials it keeps out of the normal
 * pass, and a ribbon of additive normals in that buffer is a smear in the
 * ambient occlusion for the length of the flash.
 */
export const BOLT_MATERIAL = new THREE.MeshBasicMaterial({
  vertexColors: true,
  transparent: true,
  blending: THREE.AdditiveBlending,
  // Tested, never written: occluded by the hill in front of it, and never
  // hiding what is behind it.
  depthWrite: false,
  side: THREE.DoubleSide,
  fog: false,
  opacity: 0,
});

/** One run of points, and how wide the ribbon is at each end of it. */
interface Run {
  from: number;
  count: number;
  wide: number;
  thin: number;
}

const DIR = new THREE.Vector3();
const SIDE = new THREE.Vector3();
const EYE = new THREE.Vector3();
const PERP = new THREE.Vector3();
const FOOT = new THREE.Vector3();
const ACROSS = new THREE.Vector3();
const START = new THREE.Vector3();
const STEP = new THREE.Vector3();
const DRIFT = new THREE.Vector3();

export function createBolt(): Bolt {
  const geometry = new THREE.BufferGeometry();
  const position = new THREE.BufferAttribute(new Float32Array(QUADS * 4 * 3), 3);
  const colour = new THREE.BufferAttribute(new Float32Array(QUADS * 4 * 3), 3);
  position.setUsage(THREE.DynamicDrawUsage);
  colour.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', position);
  geometry.setAttribute('color', colour);

  const index = new Uint16Array(QUADS * 6);
  for (let q = 0; q < QUADS; q++) {
    const v = q * 4;
    index.set([v, v + 1, v + 2, v + 2, v + 1, v + 3], q * 6);
  }
  geometry.setIndex(new THREE.BufferAttribute(index, 1));

  const mesh = new THREE.Mesh(geometry, BOLT_MATERIAL);
  mesh.name = 'Bolt';
  mesh.userData.noCollide = true;
  mesh.renderOrder = 2;
  mesh.frustumCulled = false;
  mesh.visible = false;
  mesh.layers.enable(GLOW_LAYER);

  const points: THREE.Vector3[] = [];
  for (let i = 0; i < TRUNK + BRANCH * BRANCHES; i++) points.push(new THREE.Vector3());
  const runs: Run[] = [];
  let used = 0;

  const ribbon = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    wa: number,
    wb: number,
    tint: THREE.Color,
    at: number,
  ): void => {
    DIR.subVectors(b, a);
    const length = DIR.length();
    if (length < 1e-5) {
      // Blanked rather than skipped: the caller has already spent this quad,
      // and leaving it holds the last strike's geometry on screen.
      for (let v = at * 4; v < at * 4 + 4; v++) {
        position.setXYZ(v, 0, 0, 0);
        colour.setXYZ(v, 0, 0, 0);
      }
      return;
    }
    DIR.divideScalar(length);

    const write = (p: THREE.Vector3, width: number, v: number): void => {
      // The camera sits at the group's origin, so the direction to the eye is
      // the point's own direction — no camera basis is needed and the ribbon
      // stays face-on however the head turns.
      EYE.copy(p).normalize();
      SIDE.crossVectors(DIR, EYE);
      if (SIDE.lengthSq() < 1e-8) SIDE.set(DIR.z, 0, -DIR.x);
      SIDE.normalize().multiplyScalar(width);
      position.setXYZ(v, p.x - SIDE.x, p.y - SIDE.y, p.z - SIDE.z);
      position.setXYZ(v + 1, p.x + SIDE.x, p.y + SIDE.y, p.z + SIDE.z);
      colour.setXYZ(v, tint.r, tint.g, tint.b);
      colour.setXYZ(v + 1, tint.r, tint.g, tint.b);
    };

    write(a, wa, at * 4);
    write(b, wb, at * 4 + 2);
  };

  /** Everything from here on collapses to a point and draws no fragments. */
  const blank = (from: number): void => {
    for (let v = from * 4; v < QUADS * 4; v++) {
      position.setXYZ(v, 0, 0, 0);
      colour.setXYZ(v, 0, 0, 0);
    }
  };

  return {
    mesh,

    strike(spec) {
      const rng = createRng(spec.seed);
      const metres = Math.max(spec.range * 1000, 1);
      const distance = Math.min(metres, SHELL);
      // Everything past the shell is drawn on it and scaled by how much nearer
      // that is, so a bolt subtends the angle its true distance gives it.
      const scale = distance / metres;
      const height = spec.height * scale;
      const wander = (height * spec.wander) / TRUNK;
      // Half-widths, so the drawn ribbon is twice these.
      const wide = distance * PIXEL * spec.width * 0.5;
      const core = Math.max(wide * CORE_WIDTH, distance * PIXEL * CORE_FLOOR);

      const flat = Math.hypot(spec.toward.x, spec.toward.z) || 1;
      FOOT.set((spec.toward.x / flat) * distance, 0, (spec.toward.z / flat) * distance);
      // Across the line of sight: the axis a channel wanders on, and the one a
      // crawler runs along.
      ACROSS.set(-FOOT.z, 0, FOOT.x).normalize();

      runs.length = 0;
      used = 0;

      const walk = (count: number, spread: number, top: number, tip: number): void => {
        const from = used;
        DRIFT.set(0, 0, 0);
        PERP.crossVectors(STEP, ACROSS);
        if (PERP.lengthSq() < 1e-8) PERP.set(0, 1, 0);
        PERP.normalize();
        for (let i = 0; i < count && used < points.length; i++) {
          const p = points[used++];
          if (i === 0) {
            p.copy(START);
            continue;
          }
          // Each step turns the heading by a bounded amount rather than jumping
          // off it: a walk with no memory of where it was going comes out as a
          // zigzag rather than as a channel.
          DRIFT.addScaledVector(ACROSS, rng.around(0, spread))
            .addScaledVector(PERP, rng.around(0, spread * 0.6))
            .multiplyScalar(0.72);
          p.copy(points[used - 2]).add(STEP).add(DRIFT);
        }
        runs.push({ from, count: used - from, wide: top, thin: tip });
      };

      if (spec.channel === 'crawl') {
        // Along the cloud base rather than down from it: cloud to cloud.
        const span = height * 2.2;
        START.copy(FOOT).setY(height).addScaledVector(ACROSS, -span * 0.5);
        STEP.copy(ACROSS).multiplyScalar(span / (TRUNK - 1));
        walk(TRUNK, wander, wide, wide * 0.3);
      } else {
        START.copy(FOOT).setY(height);
        STEP.set(0, -height / (TRUNK - 1), 0);
        walk(TRUNK, wander, wide, wide * 0.18);

        // Branches, thrown off the trunk and terminating early. Each leaves at
        // a diverging angle and never rejoins.
        const trunk = runs[0];
        for (let b = 0; b < BRANCHES; b++) {
          if (!rng.chance(0.72) || used + BRANCH > points.length) continue;
          const at = trunk.from + rng.int(3, Math.max(trunk.count - 4, 3));
          START.copy(points[at]);
          STEP.copy(ACROSS)
            .multiplyScalar(rng.chance(0.5) ? -1 : 1)
            .setY(-0.9)
            .normalize()
            .multiplyScalar(rng.range(0.04, 0.09) * height);
          walk(rng.int(3, BRANCH), wander, wide * 0.4, wide * 0.1);
        }
      }

      let at = 0;
      for (const run of runs) {
        for (let i = 0; i + 1 < run.count && at + 2 <= QUADS; i++) {
          const span = Math.max(run.count - 1, 1);
          const w0 = run.wide + (run.thin - run.wide) * (i / span);
          const w1 = run.wide + (run.thin - run.wide) * ((i + 1) / span);
          const a = points[run.from + i];
          const b = points[run.from + i + 1];
          ribbon(a, b, w0, w1, SHEATH, at++);
          const shrink = core / Math.max(wide, 1e-6);
          ribbon(a, b, w0 * shrink, w1 * shrink, CORE, at++);
        }
      }
      blank(at);
      position.needsUpdate = true;
      colour.needsUpdate = true;
      mesh.visible = true;
    },

    setBrightness(value) {
      BOLT_MATERIAL.opacity = Math.max(0, Math.min(value, 1));
      mesh.visible = BOLT_MATERIAL.opacity > 0.002;
    },

    clear() {
      mesh.visible = false;
      BOLT_MATERIAL.opacity = 0;
    },

    dispose() {
      geometry.dispose();
    },
  };
}
