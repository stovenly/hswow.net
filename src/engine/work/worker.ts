import { JOBS, type JobName } from './jobs';

/** The worker half of every job kind. One message in, one message out. */

interface Ask {
  id: number;
  kind: JobName;
  payload: unknown;
}

self.onmessage = (event: MessageEvent<Ask>) => {
  const { id, kind, payload } = event.data;
  const entry = JOBS[kind];
  if (!entry) {
    self.postMessage({ id, ok: false, error: `no such job kind: ${kind}` });
    return;
  }
  try {
    const { result, transfer } = entry.inWorker(payload as never);
    self.postMessage({ id, ok: true, result }, { transfer: transfer ?? [] });
  } catch (error) {
    self.postMessage({ id, ok: false, error: String(error) });
  }
};
