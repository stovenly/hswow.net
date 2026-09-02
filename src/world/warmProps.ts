import { pool } from '../engine/work/pool';
import type { PropAsk } from '../engine/work/jobs';
import type { Finished } from '../art/assemble';
import { entryKind, holds, type WarmContext, type WorldState } from './entry';
import type { Layer } from './document';
import type { SkirtOptions } from './vista';
import { cacheKey } from '../engine/work/cache';

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

/** The ground's two meshes, claimed under names no builder has. */
export const TERRAIN_ASK: PropAsk = { builder: '#terrain', seed: 0 };
export const SKIRT_ASK: PropAsk = { builder: '#skirt', seed: 0 };

/** Plans the warm made and the walk can take rather than make again. */
const plans = new Map<string, unknown>();

/** Keeps a plan under its entry, for `takePlan`. */
export function keepPlan(key: string, plan: unknown): void {
  plans.set(key, plan);
}

/** Claims a plan the warm kept. Taken, not read: a rebuilt zone plans afresh. */
export function takePlan<T>(key: string): T | null {
  const held = plans.get(key);
  if (held === undefined) return null;
  plans.delete(key);
  return held as T;
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
  skirt?: Omit<SkirtOptions, 'terrain'>,
  fingerprint?: string,
): Promise<void> {
  const found = planDocument(layers, ctx, state);
  const ground = ctx.terrain !== null;
  if (found.length === 0 && !ground) return;

  const bank = new Map<string, Finished[]>();
  banks.set(zone, bank);
  const giveUp = new AbortController();
  // Scaled by the queue: one machine's number is another's timeout, and a
  // warm that gives up early lands its props back on the walk.
  const timer = setTimeout(() => giveUp.abort(), budgetFor(found.length + (ground ? 2 : 0)));

  const keep = (ask: PropAsk, made: Finished | null): void => {
    if (!made) return;
    const key = keyOf(ask);
    const waiting = bank.get(key);
    if (waiting) waiting.push(made);
    else bank.set(key, [made]);
  };
  const quietly = async (work: () => Promise<void>): Promise<void> => {
    try {
      await work();
    } catch {
      // Cancelled, refused or failed: all the same from here, and the walk
      // builds it, which is what it did before any of this existed.
    }
  };

  const jobs = found.map((ask) =>
    quietly(async () => keep(ask, await pool.run('prop-geometry', ask, { signal: giveUp.signal }))),
  );
  if (ctx.terrain) {
    // First in the queue: the ground is the biggest single build and the one
    // every prop stands on.
    const terrain = ctx.terrain.wire();
    jobs.unshift(
      quietly(async () =>
        keep(
          TERRAIN_ASK,
          await pool.run('terrain-mesh', terrain, {
            signal: giveUp.signal,
            urgent: true,
            cache: cacheKey(zone, 'terrain', fingerprint),
          }),
        ),
      ),
    );
    if (skirt) {
      jobs.unshift(
        quietly(async () =>
          keep(
            SKIRT_ASK,
            await pool.run('skirt-mesh', { skirt, terrain }, {
              signal: giveUp.signal,
              urgent: true,
              cache: cacheKey(zone, 'skirt', fingerprint),
            }),
          ),
        ),
      );
    }
  }
  await Promise.all(jobs);
  clearTimeout(timer);
}

/** Milliseconds a warm of `jobs` may take: the floor, or longer when the queue is deep for the workers there are. */
function budgetFor(jobs: number): number {
  const perWorker = jobs / Math.max(1, pool.size);
  return Math.max(BUDGET, perWorker * PER_JOB);
}

/** Milliseconds one job is allowed on one worker before the budget grows. */
const PER_JOB = 40;

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
