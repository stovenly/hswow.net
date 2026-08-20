import * as THREE from 'three';
import { outlineDistance } from './ground';
import type { Outline } from './vista';

/**
 * The half of the lie that scale cannot tell: moving the far props with the camera,
 * one at a time.
 *
 * A prop slides with the camera by a fraction `k` of its travel, so what is left
 * over is the parallax the eye reads — `k = 0.75` moves a quarter as much as the
 * ground and reads four times further away than it is. One `k` per prop, not per
 * tier: two props at different apparent distances moving differently against each
 * other is not warping, it is parallax, and it is the depth cue tiers flatten.
 *
 * A prop carried toward the keep-out stops, at whatever angle it arrived, and does
 * not slide along the boundary — projecting the offset onto the allowed region
 * changes the prop's bearing, and a horizon that rearranges itself as you walk is
 * the artefact this system exists to avoid. So the clamp is on the magnitude of
 * the offset, along its own direction. Parallax saturating is not a failure.
 *
 * Only stopped props are obstacles. Props are resolved in order of how close they
 * were placed to the keep-out, and one that had to stop short becomes a circle the
 * ones behind it must clear; a prop that got where it was going imposes nothing.
 * Treating free-moving props as obstacles freezes the band, because the placer
 * allows two hills to overlap at the base and the relative drift between two of
 * them *is* the parallax.
 *
 * The clamp is one-sided, because motion is a ray: solved analytically against
 * each stopped prop's circle and by sphere tracing against the keep-out's distance
 * field. A prop already touching something is free to move away from it.
 */

/** One prop that moves, and what it needs to know to be stopped. */
export interface ParallaxProp {
  mesh: THREE.Object3D;
  /** Where it was placed, in world XZ. Every frame's offset starts here. */
  base: readonly [number, number];
  /** Fraction of the camera's travel it moves with. */
  k: number;
  /** Its own half-extent, and the most room it will ever ask for. */
  keep: number;
}

/**
 * Steps of sphere tracing along the offset. Each advances by the clearance at the
 * current point, which can never overshoot the boundary — so running out of steps
 * leaves the prop short of where it could have gone rather than through something.
 */
const MARCH = 12;

export class VistaParallax {
  /** Resolve order: nearest the keep-out first. See the class note. */
  private readonly props: readonly ParallaxProp[];
  private readonly keepOut: readonly Outline[];
  /** Where each prop ended up this frame, in resolve order, as flat XZ pairs. */
  private readonly at: Float64Array;
  /** How far short of its own parallax each prop had to stop, this frame. */
  private readonly short: Float64Array;
  /** How near the keep-out each prop was placed, capped at its own half-extent. */
  private readonly keepRoom: Float64Array;
  /** How near two props may come, as a square table in resolve order. */
  private readonly propRoom: Float64Array;
  private lastX = NaN;
  private lastZ = NaN;

  constructor(props: readonly ParallaxProp[], keepOut: readonly Outline[] = []) {
    this.keepOut = keepOut;
    const room = (prop: ParallaxProp): number =>
      keepOut.length === 0 ? Infinity : outlineDistance(keepOut, prop.base[0], prop.base[1]);
    this.props = [...props].sort((a, b) => room(a) - room(b));

    const n = this.props.length;
    this.at = new Float64Array(n * 2);
    this.short = new Float64Array(n);
    this.keepRoom = new Float64Array(n);
    this.propRoom = new Float64Array(n * n);
    for (let i = 0; i < n; i++) {
      const p = this.props[i];
      this.at[i * 2] = p.base[0];
      this.at[i * 2 + 1] = p.base[1];
      const placed = room(p);
      // Capped at where it was placed. A prop standing closer to the keep-out
      // than its own half-extent cannot be given room it never had, so it is
      // pinned — which at least stops visibly rather than sinking in.
      this.keepRoom[i] = Math.min(p.keep, placed);
      if (placed < p.keep) {
        console.warn(
          `VistaParallax: a prop ${p.keep.toFixed(0)} m across was placed ` +
            `${placed.toFixed(0)} m from the keep-out, so it barely moves`,
        );
      }
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const q = this.props[j];
        const gap = Math.hypot(p.base[0] - q.base[0], p.base[1] - q.base[1]);
        // Their radii where the placement left room for them, and the placement
        // itself where it did not — see the note on contact, above.
        this.propRoom[i * n + j] = Math.min(p.keep + q.keep, gap);
      }
    }
  }

  /**
   * Puts every prop where the camera being at `(x, z)` says it should be. Translate
   * only, never rotate: a prop that yaw-locks to the camera is a skybox. XZ only as
   * well — vertical slide against the horizon line is the most detectable kind
   * there is. Zones are authored about their own origin, so the camera's position
   * is its offset. Pass `(0, 0)` to put everything back where it was authored.
   */
  update(x: number, z: number): void {
    if (x === this.lastX && z === this.lastZ) return;
    this.lastX = x;
    this.lastZ = z;

    const n = this.props.length;
    for (let i = 0; i < n; i++) {
      const prop = this.props[i];
      const offsetX = x * prop.k;
      const offsetZ = z * prop.k;
      const span = Math.hypot(offsetX, offsetZ);
      let gone = 0;

      if (span > 1e-4) {
        const dx = offsetX / span;
        const dz = offsetZ / span;
        gone = this.freeRun(i, dx, dz, span);
        for (let j = 0; j < i; j++) {
          // Props that got where parallax sent them are not in the way — see
          // the class note. Only the ones that stopped short are.
          if (this.short[j] <= 0) continue;
          const reach = this.rayCircle(
            prop.base[0],
            prop.base[1],
            dx,
            dz,
            this.at[j * 2],
            this.at[j * 2 + 1],
            this.propRoom[i * n + j],
          );
          if (reach < gone) gone = reach;
        }
      }

      const px = prop.base[0] + (span > 0 ? (offsetX / span) * gone : 0);
      const pz = prop.base[1] + (span > 0 ? (offsetZ / span) * gone : 0);
      this.at[i * 2] = px;
      this.at[i * 2 + 1] = pz;
      this.short[i] = span - gone;
      prop.mesh.position.x = px;
      prop.mesh.position.z = pz;
    }
  }

  /**
   * Lets these props keep their own matrices. `freezeMatrices` turns auto-update off
   * across a whole zone once it is built, and a prop that moves with a frozen matrix
   * takes its new `position` and draws where it used to be.
   */
  thaw(): void {
    for (const prop of this.props) prop.mesh.matrixAutoUpdate = true;
  }

  /**
   * How far prop `i` may run along `(dx, dz)` before it reaches the keep-out, up to
   * `span`. Sphere tracing: each step advances by the distance to the boundary,
   * which cannot overshoot it, so running out of steps leaves the prop short —
   * the conservative failure, and the one that reads as more distance.
   */
  private freeRun(i: number, dx: number, dz: number, span: number): number {
    if (this.keepOut.length === 0) return span;
    const prop = this.props[i];
    let gone = 0;
    for (let step = 0; step < MARCH && gone < span; step++) {
      const clear =
        outlineDistance(this.keepOut, prop.base[0] + dx * gone, prop.base[1] + dz * gone) -
        this.keepRoom[i];
      if (clear <= 0) break;
      gone = Math.min(span, gone + clear);
    }
    return gone;
  }

  /**
   * Where a ray first touches a circle, as a distance along the ray, or Infinity.
   * One-sided on purpose: a ray starting inside the circle is free to leave and
   * forbidden to sink further, rather than being pinned where it stands.
   */
  private rayCircle(
    x: number,
    z: number,
    dx: number,
    dz: number,
    cx: number,
    cz: number,
    radius: number,
  ): number {
    const ox = x - cx;
    const oz = z - cz;
    // Negative means the ray is closing on the centre.
    const along = ox * dx + oz * dz;
    const outside = ox * ox + oz * oz - radius * radius;
    if (outside <= 0) return along >= 0 ? Infinity : 0;
    if (along >= 0) return Infinity;
    const discriminant = along * along - outside;
    if (discriminant <= 0) return Infinity;
    return -along - Math.sqrt(discriminant);
  }
}
