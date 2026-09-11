import type { MeshBuilder } from './types';
import { BUILDER_KEYS, keyOf, loadModule } from './registry-lazy';

/**
 * The main thread's builders. `registry-lazy.ts` holds the glob and fetches one
 * module at a time; this holds what has been fetched, so `builderByName` can
 * stay synchronous — the document walk calls it inline and must not await.
 *
 * Everything a zone can name is ensured **before** its walk runs, by
 * `ZoneManager`; a name that was never ensured looks up as `undefined`.
 *
 * **This module is Vite-only**, through the glob it stands on. Nothing the
 * headless checks in `tools/` reach may import it.
 */

const held = new Map<string, MeshBuilder>();
let everything: Promise<void> | null = null;

function keep(found: readonly MeshBuilder[]): void {
  for (const builder of found) held.set(builder.name, builder);
}

/** Fetches these builders' modules. Awaited before anything looks one of them up. */
export async function ensureBuilders(names: Iterable<string>): Promise<void> {
  const want = [...new Set(names)].filter((name) => name && !held.has(name));
  if (want.length === 0) return;
  await Promise.all(want.map((name) => loadModule(keyOf(name)).then(keep)));
  // A builder added under a name its file does not match fails the first time
  // it is placed, with the file it was looked for in.
  for (const name of want) {
    if (!held.has(name)) throw new Error(`no builder named "${name}": looked in ${keyOf(name)}`);
  }
}

/** Every builder there is. The editor and the galleries; never a zone. */
export async function ensureAllBuilders(): Promise<void> {
  everything ??= Promise.all(BUILDER_KEYS.map((key) => loadModule(key).then(keep))).then(() => undefined);
  await everything;
}

/** Synchronous, because the document walk calls it inline. Undefined until the name has been ensured. */
export function builderByName(name: string): MeshBuilder | undefined {
  return held.get(name);
}

/** Sorted by name, so the gallery's layout is stable between runs. Complete only after `ensureAllBuilders`. */
export function builders(): MeshBuilder[] {
  return [...held.values()].sort((a, b) => a.name.localeCompare(b.name));
}
