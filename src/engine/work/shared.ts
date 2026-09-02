/**
 * Result buffers that can be shared rather than moved. Under cross-origin
 * isolation a worker's field is the main thread's field; without it these are
 * ordinary arrays and the pool transfers them.
 */

const shared = typeof SharedArrayBuffer === 'function' && typeof crossOriginIsolated === 'boolean' && crossOriginIsolated;

export function floats(length: number): Float32Array {
  return shared ? new Float32Array(new SharedArrayBuffer(length * 4)) : new Float32Array(length);
}

/** Only what a transfer list may hold: a shared buffer is already on both sides. */
export function movable(buffers: Iterable<ArrayBufferLike>): ArrayBuffer[] {
  const out: ArrayBuffer[] = [];
  for (const buffer of buffers) if (buffer instanceof ArrayBuffer) out.push(buffer);
  return out;
}
