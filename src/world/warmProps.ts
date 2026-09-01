import { pool } from '../engine/work/pool';
import type { PropAsk } from '../engine/work/jobs';
import type { Finished } from '../art/assemble';
import { builderByName } from '../art/registry';
import { coerceFields } from '../art/schema';
import type { ZoneDocument } from './document';

/**
 * A zone's props, built off the main thread before the document walk runs.
 *
 * The walk itself stays synchronous and unchanged: it asks here first, and a
 * hit hands it a geometry that is already made. A miss — a builder that hangs
 * lights on its mesh, a prop inside a prefab whose seed the scan cannot
 * predict, a browser with no workers — costs nothing but the build it would
 * have done anyway.
 */

/** Per zone, geometries waiting to be claimed, keyed by the builder call that made them. */
const banks = new Map<string, Map<string, Finished[]>>();
/** The bank the walk in progress draws from. See `useWarm`. */
let current: Map<string, Finished[]> | null = null;

function keyOf(ask: PropAsk): string {
  return `${ask.builder}|${ask.seed}|${ask.scale ?? 1}|${JSON.stringify(ask.extras ?? {})}`;
}

/** The seed rule `kinds.ts` uses, so a scanned entry keys the same as a built one. */
function seedOf(entry: { seed?: number; id?: string }): number {
  if (entry.seed !== undefined) return entry.seed;
  let hash = 2166136261;
  for (const char of entry.id ?? 'entry') {
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  }
  return (hash >>> 0) % 1_000_000;
}

/** Everything a `prop` entry asks its builder for, or null if it is not one. */
export function askOf(entry: Record<string, unknown>): PropAsk | null {
  if (entry.kind !== 'prop' || typeof entry.builder !== 'string') return null;
  const builder = builderByName(entry.builder);
  if (!builder) return null;
  const extras = builder.options ? coerceFields(builder.options, entry.options) : {};
  return {
    builder: entry.builder,
    seed: seedOf(entry as { seed?: number; id?: string }),
    scale: entry.scale as number | undefined,
    extras,
  };
}

function scan(node: unknown, found: PropAsk[]): void {
  if (Array.isArray(node)) {
    for (const item of node) scan(item, found);
    return;
  }
  if (typeof node !== 'object' || node === null) return;
  const record = node as Record<string, unknown>;
  const ask = askOf(record);
  if (ask) found.push(ask);
  for (const value of Object.values(record)) {
    if (typeof value === 'object' && value !== null) scan(value, found);
  }
}

/**
 * Fans a document's props out over the pool. One prop is one job, which is what
 * makes the pool worth having. Awaited before the zone is built.
 */
export async function warmDocument(doc: ZoneDocument): Promise<void> {
  const found: PropAsk[] = [];
  scan(doc.layers, found);
  if (found.length === 0) return;
  const bank = new Map<string, Finished[]>();
  banks.set(doc.id, bank);
  await Promise.all(
    found.map(async (ask) => {
      try {
        const made = await pool.run('prop-geometry', ask);
        if (!made) return;
        const key = keyOf(ask);
        const waiting = bank.get(key);
        if (waiting) waiting.push(made);
        else bank.set(key, [made]);
      } catch {
        // Nothing to do: the walk builds it inline, which is what it did before.
      }
    }),
  );
}

/** Opens the zone's bank for the walk about to run. Closed by `dropWarm`. */
export function useWarm(zone: string): void {
  current = banks.get(zone) ?? null;
}

/** Claims a warmed geometry. Taken, not read: two props may not share one. */
export function takeWarm(ask: PropAsk): Finished | null {
  if (!current) return null;
  const key = keyOf(ask);
  const waiting = current.get(key);
  if (!waiting || waiting.length === 0) return null;
  const made = waiting.pop() as Finished;
  if (waiting.length === 0) current.delete(key);
  return made;
}

/** Frees whatever the walk did not claim — a `when` the state turned off. */
export function dropWarm(zone: string): void {
  const bank = banks.get(zone);
  banks.delete(zone);
  current = null;
  if (!bank) return;
  for (const waiting of bank.values()) {
    for (const made of waiting) made.geometry.dispose();
  }
}
