export type UpdateFn = (dt: number, elapsed: number) => void;

/**
 * The frame loop. Subscribers are called in insertion order with a delta in
 * seconds; anything needing wall-clock scheduling should use
 * `AudioContext.currentTime` instead.
 */
/**
 * How early a frame may arrive and still be drawn, in milliseconds. Without it a
 * cap almost never lands where it is set: frames are delivered on the display's
 * cadence, so a 60 fps cap asking for exactly 16.67 ms rejects any frame that
 * arrives a fraction early and takes the next one, halving the rate to 30.
 */
const CAP_SLACK = 1;

export class Loop {
  private readonly subscribers = new Set<UpdateFn>();
  private handle = 0;
  private last = 0;
  private elapsed = 0;
  private running = false;
  /** Minimum milliseconds between frames. 0 is uncapped. */
  private minInterval = 0;

  /** Returns an unsubscribe function. */
  add(fn: UpdateFn): () => void {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  /**
   * Caps the frame rate, or removes the cap with `null`. Skipped frames, not a
   * timer: `setTimeout` is not synchronised to the display, so driving the loop
   * from one produces frames landing at arbitrary points in the refresh cycle.
   * The consequence is that a cap is only exactly reached when it divides the
   * refresh rate, which is why the choices offered are the common refresh rates.
   */
  setFpsCap(fps: number | null): void {
    this.minInterval = fps && fps > 0 ? 1000 / fps : 0;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();

    const tick = (now: number): void => {
      this.handle = requestAnimationFrame(tick);

      // Declined, and nothing is advanced: `last` stays where it was, so the delta
      // handed to subscribers when a frame is taken covers the whole span since the
      // last one.
      if (this.minInterval > 0 && now - this.last < this.minInterval - CAP_SLACK) return;

      // Clamped so returning to a backgrounded tab doesn't deliver a
      // multi-second step that teleports the player through geometry.
      const dt = Math.min((now - this.last) / 1000, 0.1);
      this.last = now;
      this.elapsed += dt;
      for (const fn of this.subscribers) fn(dt, this.elapsed);
    };

    this.handle = requestAnimationFrame(tick);
  }

  stop(): void {
    if (!this.running) return;
    cancelAnimationFrame(this.handle);
    this.running = false;
  }
}
