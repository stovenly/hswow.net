/**
 * A timer that keeps time when the frame loop does not.
 *
 * `requestAnimationFrame` stops entirely on an occluded tab and arrives late
 * and irregularly on a contended GPU. A worker's `setInterval` runs on its own
 * thread and does neither, which makes it the right pump for anything driven by
 * the audio clock rather than by what is on screen — the music director's bar
 * clock reads no frame state at all, so there was never a reason for it to wait
 * on a frame.
 *
 * The worker is a blob rather than its own module: it is four lines, and a file
 * would be a build artefact and a fetch for them.
 */

const SOURCE = `let id = 0;
onmessage = (e) => {
  clearInterval(id);
  if (e.data > 0) id = setInterval(() => postMessage(0), e.data);
};`;

export interface Ticker {
  stop(): void;
}

/**
 * Calls `tick` every `intervalMs`, off the frame loop.
 *
 * Falls back to a main-thread interval where a worker cannot be built. That is
 * still not the frame loop — it keeps running while the renderer is stalled —
 * so the fallback is a downgrade in steadiness rather than in kind.
 */
export function createTicker(intervalMs: number, tick: () => void): Ticker {
  let worker: Worker | null = null;
  let url = '';

  try {
    if (typeof Worker === 'function' && typeof URL.createObjectURL === 'function') {
      url = URL.createObjectURL(new Blob([SOURCE], { type: 'text/javascript' }));
      worker = new Worker(url);
      worker.onmessage = tick;
      worker.postMessage(intervalMs);
    }
  } catch {
    worker = null;
  }

  if (worker) {
    const live = worker;
    // Revoked on stop rather than straight after construction: the worker
    // fetches its own source, and whether that has happened yet by the time the
    // next statement runs is not something the specification promises.
    return {
      stop(): void {
        live.terminate();
        if (url) URL.revokeObjectURL(url);
      },
    };
  }

  const id = setInterval(tick, intervalMs);
  return {
    stop(): void {
      clearInterval(id);
    },
  };
}
