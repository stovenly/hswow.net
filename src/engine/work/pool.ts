import { JOBS, type JobName, type JobPayload, type JobValue } from './jobs';

/**
 * A fixed set of module workers with a queue in front of them. Callers never
 * see a worker: they await `pool.run(kind, payload)`. The pool knows about
 * queues, transfers and failure, and nothing about art, zones or collision.
 *
 * Minus one so the main thread keeps a core to render on; floored at two
 * because the count is an anti-fingerprinting surface and some browsers return
 * 2 whatever the hardware is; capped at six because each worker parses its own
 * copy of three, and past that this work is bandwidth bound rather than
 * compute bound.
 */
const SIZE = Math.min(Math.max((navigator.hardwareConcurrency || 4) - 1, 2), 6);

/** What a cancelled job rejects with. The caller asked; it is not a failure. */
export const CANCELLED = 'work: cancelled';

interface Pending {
  id: number;
  kind: JobName;
  payload: unknown;
  transfer: Transferable[];
  settle(wire: unknown): void;
  fail(error: unknown): void;
  signal?: AbortSignal;
}

interface Answer {
  id: number;
  ok: boolean;
  result?: unknown;
  error?: string;
}

export interface RunOptions {
  /** Aborting drops the result; the promise rejects with `CANCELLED`. */
  signal?: AbortSignal;
  /** Payload buffers to move rather than copy. Unusable here afterwards. */
  transfer?: Transferable[];
}

export class WorkPool {
  private readonly idle: Worker[] = [];
  private readonly running = new Map<number, Pending>();
  private readonly queue: Pending[] = [];
  private readonly owner = new Map<Worker, number>();
  private spawned = 0;
  private next = 1;
  /** Set once a worker cannot be made or dies. Everything runs inline after. */
  private broken = false;

  get size(): number {
    return SIZE;
  }

  /** True once the pool has given up on workers and is running work inline. */
  get inline(): boolean {
    return this.broken;
  }

  run<K extends JobName>(
    kind: K,
    payload: JobPayload<K>,
    options: RunOptions = {},
  ): Promise<JobValue<K>> {
    if (options.signal?.aborted) return Promise.reject(CANCELLED);
    if (this.broken) return this.runInline(kind, payload);
    return new Promise<JobValue<K>>((resolve, reject) => {
      const pending: Pending = {
        id: this.next++,
        kind,
        payload,
        transfer: options.transfer ?? [],
        settle: (wire) => resolve(JOBS[kind].onMain(wire as never) as JobValue<K>),
        fail: reject,
        signal: options.signal,
      };
      options.signal?.addEventListener('abort', () => this.drop(pending), { once: true });
      this.queue.push(pending);
      this.pump();
    });
  }

  /** Frees every worker. The pool still runs, inline, after this. */
  dispose(): void {
    this.broken = true;
    for (const worker of this.idle) worker.terminate();
    this.idle.length = 0;
    for (const worker of this.owner.keys()) worker.terminate();
    this.owner.clear();
    this.running.clear();
    for (const pending of this.queue.splice(0)) pending.fail(CANCELLED);
  }

  /**
   * A browser that refuses workers still plays: the same halves run here, on
   * the frame, which is exactly what this pool exists to avoid — but slow is
   * better than absent.
   */
  private async runInline<K extends JobName>(
    kind: K,
    payload: JobPayload<K>,
  ): Promise<JobValue<K>> {
    const { result } = JOBS[kind].inWorker(payload as never);
    return JOBS[kind].onMain(result as never) as JobValue<K>;
  }

  private drop(pending: Pending): void {
    const queued = this.queue.indexOf(pending);
    if (queued >= 0) this.queue.splice(queued, 1);
    // In flight: the worker finishes and the answer is thrown away. Killing it
    // would cost more than the work left in it.
    this.running.delete(pending.id);
    pending.fail(CANCELLED);
  }

  private pump(): void {
    while (this.queue.length > 0) {
      const worker = this.take();
      if (!worker) return;
      const pending = this.queue.shift();
      if (!pending) {
        this.idle.push(worker);
        return;
      }
      this.running.set(pending.id, pending);
      this.owner.set(worker, pending.id);
      worker.postMessage(
        { id: pending.id, kind: pending.kind, payload: pending.payload },
        pending.transfer,
      );
    }
  }

  private take(): Worker | null {
    const free = this.idle.pop();
    if (free) return free;
    if (this.spawned >= SIZE) return null;
    const worker = this.spawn();
    if (worker) this.spawned += 1;
    return worker;
  }

  private spawn(): Worker | null {
    try {
      const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (event: MessageEvent<Answer>) => this.answer(worker, event.data);
      worker.onerror = () => this.collapse();
      worker.onmessageerror = () => this.collapse();
      return worker;
    } catch {
      this.collapse();
      return null;
    }
  }

  private answer(worker: Worker, message: Answer): void {
    this.owner.delete(worker);
    this.idle.push(worker);
    const pending = this.running.get(message.id);
    // Gone means cancelled while in flight, and the result is dropped.
    if (pending) {
      this.running.delete(message.id);
      if (message.ok) pending.settle(message.result);
      else pending.fail(new Error(message.error ?? 'work: job failed'));
    }
    this.pump();
  }

  /** A worker that will not load or has died takes the whole pool with it. */
  private collapse(): void {
    if (this.broken) return;
    this.broken = true;
    for (const worker of this.idle) worker.terminate();
    this.idle.length = 0;
    for (const worker of this.owner.keys()) worker.terminate();
    this.owner.clear();
    const stranded = [...this.running.values(), ...this.queue.splice(0)];
    this.running.clear();
    for (const pending of stranded) {
      if (pending.signal?.aborted) continue;
      try {
        pending.settle(JOBS[pending.kind].inWorker(pending.payload as never).result);
      } catch (error) {
        pending.fail(error);
      }
    }
  }
}

export const pool = new WorkPool();
