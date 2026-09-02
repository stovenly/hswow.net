import processorUrl from './processor.js?url';
import { platform } from '../../platform';
import { floats } from '../../engine/work/shared';

/**
 * The main-thread half of the particle worklet: registration, the shared
 * noise table, and a writer that batches records to one processor.
 *
 * A record is `STRIDE` floats, the contract `processor.js` also spells:
 *
 *     0 kind   1 at (s)   2 length (s)   3 level   4 channel
 *     grain, strike:  5 rate   6 offset into the noise (s)   7 rise (s)   8 decay constant (s)
 *     bubble:         5 hz     6 pitch rise, fraction        7 decay (s)
 */

export const STRIDE = 10;
export const GRAIN = 0;
export const STRIKE = 1;
export const BUBBLE = 2;

/** Records the shared ring holds. Past this the writer falls back to a message. */
const RING = 2048;
/** Seconds of the noise table each processor reads. Longer than any grain. */
const NOISE_SECONDS = 2;

const registered = new WeakMap<BaseAudioContext, Promise<boolean>>();
const tables = new WeakMap<BaseAudioContext, Float32Array>();

/**
 * Registers the processor and takes the noise it will read. Awaited once by
 * the engine before any bed is built; false where worklets are refused, and
 * every bed then schedules nodes as it always did.
 */
export function registerParticles(context: BaseAudioContext, white: AudioBuffer): Promise<boolean> {
  let pending = registered.get(context);
  if (!pending) {
    const length = Math.min(white.length, Math.round(context.sampleRate * NOISE_SECONDS));
    // Through a plain array: `copyFromChannel` refuses a shared one.
    const plain = new Float32Array(length);
    white.copyFromChannel(plain, 0);
    const table = floats(length);
    table.set(plain);
    tables.set(context, table);
    pending = (context as AudioContext).audioWorklet
      .addModule(processorUrl)
      .then(() => true)
      .catch((error: unknown) => {
        console.warn('particles: worklet unavailable — scheduling nodes instead', error);
        return false;
      });
    registered.set(context, pending);
  }
  return pending;
}

/** Whether `particleNode` can be made on this context now. */
export function particlesReady(context: BaseAudioContext): boolean {
  return ready.has(context);
}

const ready = new WeakSet<BaseAudioContext>();

export async function awaitParticles(context: BaseAudioContext, white: AudioBuffer): Promise<void> {
  if (await registerParticles(context, white)) ready.add(context);
}

/**
 * One processor with `outputs` mono outputs, and the writer that feeds it.
 * The processor lets itself go after seconds of silence and is built again
 * on the next record, so `connect` is called for every processor made.
 */
export interface ParticleNode {
  /** Files one record. `a`..`d` are the kind's own fields, in order. */
  write(kind: number, at: number, length: number, level: number, channel: number, a: number, b: number, c?: number, d?: number): void;
  dispose(): void;
}

export function particleNode(
  context: BaseAudioContext,
  outputs: number,
  connect: (node: AudioWorkletNode) => void,
): ParticleNode {
  const table = tables.get(context);
  if (!table) throw new Error('particles: node asked for before the processor was registered');

  const ring = platform.isolated
    ? {
        data: new Float32Array(new SharedArrayBuffer(RING * STRIDE * 4)),
        head: new Int32Array(new SharedArrayBuffer(8)),
      }
    : null;

  let node: AudioWorkletNode | null = null;
  let disposed = false;

  const build = (): AudioWorkletNode => {
    const made = new AudioWorkletNode(context, 'particle-processor', {
      numberOfInputs: 0,
      numberOfOutputs: outputs,
      outputChannelCount: Array.from({ length: outputs }, () => 1),
      processorOptions: { noise: table, ring },
    });
    made.port.onmessage = (event: MessageEvent<{ type: string }>) => {
      if (event.data.type !== 'asleep' || node !== made) return;
      made.port.onmessage = null;
      made.disconnect();
      node = null;
    };
    connect(made);
    return made;
  };

  const awake = (): AudioWorkletNode => {
    if (!node && !disposed) node = build();
    return node as AudioWorkletNode;
  };

  node = build();

  // Records written since the last flush, sent as one message at the end of
  // the task that wrote them. The ring path needs no flush at all.
  let batch = new Float32Array(STRIDE * 64);
  let filled = 0;
  let flushing = false;
  const flush = (): void => {
    flushing = false;
    if (filled === 0 || disposed) return;
    const records = batch.slice(0, filled);
    filled = 0;
    awake().port.postMessage({ records }, [records.buffer]);
  };

  const queue = (at: number, records: Float32Array): void => {
    if (filled + STRIDE > batch.length) {
      const grown = new Float32Array(batch.length * 2);
      grown.set(batch);
      batch = grown;
    }
    batch.set(records.subarray(at, at + STRIDE), filled);
    filled += STRIDE;
    if (!flushing) {
      flushing = true;
      queueMicrotask(flush);
    }
  };

  const record = new Float32Array(STRIDE);

  return {
    write(kind, at, length, level, channel, a, b, c = 0, d = 0) {
      record[0] = kind;
      record[1] = at;
      record[2] = length;
      record[3] = level;
      record[4] = channel;
      record[5] = a;
      record[6] = b;
      record[7] = c;
      record[8] = d;
      record[9] = 0;
      if (disposed) return;
      if (ring) {
        const write = ring.head[0];
        const read = Atomics.load(ring.head, 1);
        if (write - read < RING) {
          ring.data.set(record, (write % RING) * STRIDE);
          Atomics.store(ring.head, 0, write + 1);
          awake();
          return;
        }
      }
      queue(0, record);
    },
    dispose() {
      disposed = true;
      if (node) {
        node.port.onmessage = null;
        node.disconnect();
      }
      node = null;
    },
  };
}
