import type * as THREE from 'three';

// Reports every shader program the renderer links once play has started, and
// every frame long enough to have been one. Dev only.

/** Frames slower than this are worth a line, in seconds. */
const SLOW = 0.1;

export function watchCompiles(renderer: THREE.WebGLRenderer): (dt: number, live: boolean) => void {
  if (!import.meta.env.DEV) return () => {};
  const seen = new Set<string>();
  let armed = false;
  let frame = 0;
  let started = performance.now();

  return (dt: number, live: boolean) => {
    const programs = renderer.info.programs ?? [];
    const fresh: string[] = [];
    for (const program of programs) {
      const key = (program as unknown as { cacheKey: string }).cacheKey;
      if (seen.has(key)) continue;
      seen.add(key);
      fresh.push(key);
    }

    // Everything up to the first playable frame is boot, and boot is meant to
    // compile. Reported as one number rather than one line each.
    if (!live) return;
    if (!armed) {
      armed = true;
      console.warn(`[compile] ${seen.size} programs linked before play`);
      return;
    }

    frame++;
    const now = performance.now();
    const since = now - started;
    started = now;

    if (fresh.length > 0) {
      console.warn(
        `[compile] frame ${frame} (+${since.toFixed(0)}ms) linked ${fresh.length}:`,
        // Trimmed: a cache key is the whole parameter list and runs to kilobytes.
        fresh.map((key) => key.slice(0, 200)),
      );
    } else if (dt > SLOW) {
      console.warn(
        `[slow] frame ${frame} took ${(dt * 1000).toFixed(0)}ms, programs ${programs.length}, no new link`,
      );
    }
  };
}
