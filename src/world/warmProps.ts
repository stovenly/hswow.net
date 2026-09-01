import { pool } from '../engine/work/pool';
import type { PropAsk } from '../engine/work/jobs';
import type { Finished } from '../art/assemble';
import { entryKind, holds, type WarmContext, type WorldState } from './entry';
import type { Layer } from './document';

/**
 * A zone's props, built off the main thread before the document walk runs.
 *
 * The walk itself stays synchronous and unchanged: it asks here first, and a
 * hit hands it a geometry that is already made. A miss — a kind that declares
 * no `asks`, a prop inside a prefab whose seed cannot be predicted, a browser
 * with no workers, a job that missed the deadline — costs nothing but the
 * build it would have done anyway.
 */

/** Per zone, geometries waiting to be claimed, keyed by the builder call that made them. */
const banks = new Map<string, Map<string, Finished[]>>();
/** The bank the walk in progress draws from. See `useWarm`. */
let current: Map<string, Finished[]> | null = null;

/**
 * Milliseconds the warm may spend before the walk starts anyway. A zone of four
 * hundred props must not wait on the slowest job in it, and nothing is lost by
 * giving up: an unfinished warm is a miss, and a miss builds inline, which is
 * the path every kind took before any of this existed. Timing changes with the
 * machine; the zone that comes out cannot.
 */
const BUDGET = 2500;

function keyOf(ask: PropAsk): string {
  return `${ask.builder}|${ask.seed}|${ask.scale ?? 1}|${JSON.stringify(ask.extras ?? {})}`;
}

/**
 * Every builder call the walk is going to make, as far as the kinds can say
 * before it runs. The same `when` tests the walk applies, so a layer the state
 * has turned off is not warmed.
 */
function planDocument(layers: readonly Layer[], ctx: WarmContext, state: WorldState): PropAsk[] {
  const found: PropAsk[] = [];
  for (const layer of layers) {
    if (!holds(layer.when, state)) continue;
    for (const entry of layer.entries) {
      if (!holds(entry.when, state)) continue;
      const kind = entryKind(entry.kind);
      if (!kind?.asks) continue;
      try {
        found.push(...kind.asks(entry as never, ctx));
      } catch {
        // A half-typed entry warms nothing. The walk reports it properly.
      }
    }
  }
  return found;
}

/**
 * Fans a document's props out over the pool. One prop is one job, which is what
 * makes the pool worth having. Awaited before the zone is built.
 */
export async function warmDocument(
  zone: string,
  layers: readonly Layer[],
  ctx: WarmContext,
  state: WorldState,
): Promise<void> {
  const found = planDocument(layers, ctx, state);
  if (found.length === 0) return;

  const bank = new Map<string, Finished[]>();
  banks.set(zone, bank);
  const giveUp = new AbortController();
  const timer = setTimeout(() => giveUp.abort(), BUDGET);

  await Promise.all(
    found.map(async (ask) => {
      try {
        const made = await pool.run('prop-geometry', ask, { signal: giveUp.signal });
        if (!made) return;
        const key = keyOf(ask);
        const waiting = bank.get(key);
        if (waiting) waiting.push(made);
        else bank.set(key, [made]);
      } catch {
        // Cancelled, refused or failed: all the same from here, and the walk
        // builds it, which is what it did before any of this existed.
      }
    }),
  );
  clearTimeout(timer);
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

/** Frees whatever the walk did not claim — a rejected scatter, a `when` turned off. */
export function dropWarm(zone: string): void {
  const bank = banks.get(zone);
  banks.delete(zone);
  current = null;
  if (!bank) return;
  for (const waiting of bank.values()) {
    for (const made of waiting) made.geometry.dispose();
  }
}
