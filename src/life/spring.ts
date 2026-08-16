/**
 * Damped springs, in the closed forms from Holden's "Spring-Roll-Call", so
 * they are stable at any frame rate and never overshoot unless asked to.
 * Everything that follows something here — a head after a body turn, an ear
 * after a head, a lean after an acceleration — goes through one of these.
 */

const LN2 = Math.LN2;

/** Moves `x` toward `goal` with a half-life; no velocity, no overshoot. */
export function damp(x: number, goal: number, halflife: number, dt: number): number {
  return goal + (x - goal) * Math.exp((-LN2 * dt) / Math.max(halflife, 1e-5));
}

/** Position and velocity, for the critically damped and decaying forms. */
export class Spring {
  x = 0;
  v = 0;

  constructor(x = 0) {
    this.x = x;
  }

  /** Critically damped: arrives at `goal` in about `halflife`, no overshoot. */
  to(goal: number, halflife: number, dt: number): number {
    const y = (2 * LN2) / Math.max(halflife, 1e-5);
    const j0 = this.x - goal;
    const j1 = this.v + j0 * y;
    const e = Math.exp(-y * dt);
    this.x = e * (j0 + j1 * dt) + goal;
    this.v = e * (this.v - j1 * y * dt);
    return this.x;
  }

  /** Under-damped: `goal` is reached with a wobble. `zeta` below 1 is how bouncy. */
  bounce(goal: number, halflife: number, zeta: number, dt: number): number {
    const d = (4 * LN2) / Math.max(halflife, 1e-5);
    const s = (d * d) / (4 * zeta * zeta);
    const y = d / 2;
    const w = Math.sqrt(Math.max(s - y * y, 1e-6));
    const j0 = this.x - goal;
    const j1 = this.v + j0 * y;
    const e = Math.exp(-y * dt);
    const c = Math.cos(w * dt);
    const sn = Math.sin(w * dt);
    this.x = e * (j0 * c + (j1 / w) * sn) + goal;
    this.v = e * (-j0 * y * c - (j1 * y) / w * sn - j0 * w * sn + j1 * c);
    return this.x;
  }

  /** Decays toward zero, keeping whatever velocity it had. */
  decay(halflife: number, dt: number): number {
    return this.to(0, halflife, dt);
  }

  set(x: number, v = 0): void {
    this.x = x;
    this.v = v;
  }
}
