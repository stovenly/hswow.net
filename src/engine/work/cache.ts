import { floats } from './shared';

/**
 * A job result on disk, in the origin private file system: what a worker
 * built for a zone last time, read back before it builds again. Keys carry
 * the project, the zone, a hash of its document and the engine's build, so a
 * change to any of them is a miss. Least recently used files go past the
 * budget. Workers only — the synchronous access handles do not exist on the
 * main thread.
 */

/**
 * Whether results are cached at all, and for which project. Off on the dev
 * server, where the code under a key changes without the key; off in the
 * editor, which rebuilds what it just changed.
 */
export const zoneCache = {
  on: !import.meta.env.DEV && typeof navigator !== 'undefined' && typeof navigator.storage?.getDirectory === 'function',
  project: '',
};

/** A key for one part of one zone, or undefined when nothing is to be cached. */
export function cacheKey(zone: string, part: string, fingerprint: string | undefined): string | undefined {
  if (!zoneCache.on || !fingerprint) return undefined;
  return `${zoneCache.project}.${zone}.${part}.${fingerprint}.${__BUILD__}`;
}

/** Bytes the cache may hold before the oldest files go. */
const BUDGET = 512 * 1024 * 1024;
const FOLDER = 'zone-cache';

type Wire = unknown;

/** The worker-only handle, which the DOM lib does not declare. */
interface SyncHandle {
  getSize(): number;
  read(buffer: ArrayBufferView, options?: { at: number }): number;
  write(buffer: ArrayBufferView, options?: { at: number }): number;
  truncate(size: number): void;
  flush(): void;
  close(): void;
}

type SyncFileHandle = FileSystemFileHandle & { createSyncAccessHandle(): Promise<SyncHandle> };

interface Header {
  /** The result with every typed array replaced by `{ $: index }`. */
  shape: unknown;
  arrays: { kind: string; length: number }[];
}

const KINDS: Record<string, new (buffer: ArrayBufferLike, byteOffset: number, length: number) => ArrayBufferView> = {
  Float32Array,
  Float64Array,
  Int32Array,
  Uint32Array,
  Int16Array,
  Uint16Array,
  Int8Array,
  Uint8Array,
};

/** Flattens a result into one buffer: a JSON header, then the arrays, each 8-aligned. */
export function pack(result: Wire): ArrayBuffer {
  const arrays: ArrayBufferView[] = [];
  const kinds: Header['arrays'] = [];
  const shape = walk(result, (view) => {
    arrays.push(view);
    kinds.push({ kind: view.constructor.name, length: (view as unknown as { length: number }).length });
    return { $: arrays.length - 1 };
  });
  const header = new TextEncoder().encode(JSON.stringify({ shape, arrays: kinds } satisfies Header));
  let size = 8 + align(header.byteLength);
  for (const view of arrays) size += align(view.byteLength);
  const out = new ArrayBuffer(size);
  const bytes = new Uint8Array(out);
  new DataView(out).setUint32(0, header.byteLength, true);
  bytes.set(header, 8);
  let at = 8 + align(header.byteLength);
  for (const view of arrays) {
    bytes.set(new Uint8Array(view.buffer, view.byteOffset, view.byteLength), at);
    at += align(view.byteLength);
  }
  return out;
}

/** The inverse of `pack`. Arrays come back in shared memory where the page is isolated. */
export function unpack(bytes: ArrayBuffer): { result: Wire; transfer: ArrayBuffer[] } {
  const headerLength = new DataView(bytes).getUint32(0, true);
  const header = JSON.parse(new TextDecoder().decode(new Uint8Array(bytes, 8, headerLength))) as Header;
  let at = 8 + align(headerLength);
  const transfer: ArrayBuffer[] = [];
  const arrays = header.arrays.map(({ kind, length }) => {
    const make = KINDS[kind] ?? Uint8Array;
    const view = new make(new ArrayBuffer(0), 0, 0);
    const byteLength = length * (view as unknown as { BYTES_PER_ELEMENT: number }).BYTES_PER_ELEMENT;
    let out: ArrayBufferView;
    if (kind === 'Float32Array') {
      const shared = floats(length);
      shared.set(new Float32Array(bytes, at, length));
      out = shared;
    } else {
      out = new make(bytes.slice(at, at + byteLength), 0, length);
    }
    if (out.buffer instanceof ArrayBuffer) transfer.push(out.buffer);
    at += align(byteLength);
    return out;
  });
  const result = walk(header.shape, undefined, (ref) => arrays[ref]);
  return { result, transfer };
}

function align(n: number): number {
  return (n + 7) & ~7;
}

/** Copies a plain tree, swapping typed arrays out (`onArray`) or refs back in (`onRef`). */
function walk(
  value: unknown,
  onArray?: (view: ArrayBufferView) => unknown,
  onRef?: (index: number) => unknown,
): unknown {
  if (ArrayBuffer.isView(value)) return onArray ? onArray(value) : value;
  if (Array.isArray(value)) return value.map((item) => walk(item, onArray, onRef));
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (onRef && typeof record.$ === 'number' && Object.keys(record).length === 1) return onRef(record.$);
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(record)) {
      if (item !== undefined) out[key] = walk(item, onArray, onRef);
    }
    return out;
  }
  return value;
}

let folder: Promise<FileSystemDirectoryHandle | null> | null = null;

function directory(): Promise<FileSystemDirectoryHandle | null> {
  if (!folder) {
    folder = (async () => {
      try {
        const root = await navigator.storage.getDirectory();
        return await root.getDirectoryHandle(FOLDER, { create: true });
      } catch {
        return null;
      }
    })();
  }
  return folder;
}

function fileName(key: string): string {
  return key.replace(/[^a-zA-Z0-9._-]/g, '_') + '.bin';
}

/** What the cache holds under `key`, or null. */
export async function readCached(key: string): Promise<ArrayBuffer | null> {
  const dir = await directory();
  if (!dir) return null;
  try {
    const file = (await dir.getFileHandle(fileName(key))) as SyncFileHandle;
    const handle = await file.createSyncAccessHandle();
    try {
      const size = handle.getSize();
      const bytes = new ArrayBuffer(size);
      handle.read(new Uint8Array(bytes), { at: 0 });
      return bytes;
    } finally {
      handle.close();
    }
  } catch {
    return null;
  }
}

/** Writes `bytes` under `key`, then lets the oldest files go past the budget. */
export async function writeCached(key: string, bytes: ArrayBuffer): Promise<void> {
  const dir = await directory();
  if (!dir) return;
  try {
    const file = (await dir.getFileHandle(fileName(key), { create: true })) as SyncFileHandle;
    const handle = await file.createSyncAccessHandle();
    try {
      handle.truncate(0);
      handle.write(new Uint8Array(bytes), { at: 0 });
      handle.flush();
    } finally {
      handle.close();
    }
    await trim(dir);
  } catch {
    // Out of quota, or refused: the cache is a convenience and the build stands.
  }
}

async function trim(dir: FileSystemDirectoryHandle): Promise<void> {
  const files: { name: string; size: number; modified: number }[] = [];
  let total = 0;
  for await (const [name, entry] of dir as unknown as AsyncIterable<[string, FileSystemHandle]>) {
    if (entry.kind !== 'file') continue;
    const file = await (entry as FileSystemFileHandle).getFile();
    files.push({ name, size: file.size, modified: file.lastModified });
    total += file.size;
  }
  if (total <= BUDGET) return;
  files.sort((a, b) => a.modified - b.modified);
  for (const file of files) {
    if (total <= BUDGET) break;
    await dir.removeEntry(file.name);
    total -= file.size;
  }
}
