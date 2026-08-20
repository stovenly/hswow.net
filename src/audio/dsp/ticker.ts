/**
 * A `setInterval` on a worker thread, which keeps time when the frame loop does
 * not: `requestAnimationFrame` stops entirely on an occluded tab and arrives
 * late on a contended GPU. The right pump for anything driven by the audio
 * clock rather than by what is on screen.
 *
 * The worker is a blob rather than its own module because it is four lines.
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
 * Calls `tick` every `intervalMs`, off the frame loop. Falls back to a
 * main-thread interval where a worker cannot be built — still not the frame
 * loop, so a downgrade in steadiness rather than in kind.
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
    // fetches its own source, and the spec does not promise that has happened
    // by the time the next statement runs.
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
