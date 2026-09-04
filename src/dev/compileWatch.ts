import type * as THREE from 'three';

// Reports every frame long enough to have been a shader link, once play has
// started. Dev only.

/** Frames slower than this are worth a line, in seconds. */
const SLOW = 0.1;

export function watchCompiles(renderer: THREE.WebGLRenderer): (dt: number, live: boolean) => void {
  if (!import.meta.env.DEV) return () => {};
  const seen = new Set<string>();
  let armed = false;
  let frame = 0;

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
      return;
    }

    frame++;
    if (fresh.length === 0 && dt > SLOW) {
      console.warn(
        `[slow] frame ${frame} took ${(dt * 1000).toFixed(0)}ms, programs ${programs.length}, no new link`,
      );
    }
  };
}
