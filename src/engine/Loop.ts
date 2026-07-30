export type UpdateFn = (dt: number, elapsed: number) => void;

/**
 * The frame loop. Subscribers are called in insertion order with a delta in
 * seconds; anything needing wall-clock scheduling (audio grains, for one)
 * should use AudioContext.currentTime instead of this.
 */
export class Loop {
  private readonly subscribers = new Set<UpdateFn>();
  private handle = 0;
  private last = 0;
  private elapsed = 0;
  private running = false;

  /** Returns an unsubscribe function. */
  add(fn: UpdateFn): () => void {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();

    const tick = (now: number): void => {
      this.handle = requestAnimationFrame(tick);
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
