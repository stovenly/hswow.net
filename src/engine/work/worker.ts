import { JOBS, primeJobs, type JobName, type Prime } from './jobs';
import { pack, readCached, unpack, writeCached } from './cache';

/** The worker half of every job kind. One message in, one message out. */

interface Ask {
  id: number;
  kind: JobName | 'prime';
  payload: unknown;
  cache?: string;
}

self.onmessage = async (event: MessageEvent<Ask>) => {
  const { id, kind, payload } = event.data;
  if (kind === 'prime') {
    primeJobs(payload as Prime);
    return;
  }
  const entry = JOBS[kind];
  if (!entry) {
    self.postMessage({ id, ok: false, error: `no such job kind: ${kind}` });
    return;
  }
  try {
    const cache = event.data.cache;
    if (cache) {
      const held = await readCached(cache);
      if (held) {
        const { result, transfer } = unpack(held);
        self.postMessage({ id, ok: true, result }, { transfer });
        return;
      }
    }
    const { result, transfer } = await entry.inWorker(payload as never);
    // Packed before the buffers are moved, written after the answer has gone.
    const bytes = cache ? pack(result) : null;
    self.postMessage({ id, ok: true, result }, { transfer: transfer ?? [] });
    if (cache && bytes) await writeCached(cache, bytes);
  } catch (error) {
    self.postMessage({ id, ok: false, error: String(error) });
  }
};
