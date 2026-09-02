import type { MeshBuilder } from './types';
import { pool } from '../engine/work/pool';
import { isBuilder } from './registry-lazy';

/**
 * Every builder in `builders/`, found automatically.
 *
 * `import.meta.glob` is resolved by Vite at build time into a set of static
 * imports, so this is not a runtime directory scan and nothing is lazy — it
 * costs the same as having written the import list by hand, and cannot fall
 * out of date with it. Dropping a file into `builders/` is the entire process
 * for adding a mesh type.
 *
 * **This module is Vite-only.** `import.meta.glob` does not exist under plain
 * esbuild, which is what the headless checks in `tools/` run through. Nothing
 * that those checks reach may import this file — the proving ground therefore
 * imports the builders it needs directly, and only the debug gallery goes
 * through the registry.
 */

const modules = import.meta.glob<Record<string, unknown>>('./builders/*.ts', { eager: true });

/** Sorted by name, so the gallery's layout is stable between runs. */
export const builders: MeshBuilder[] = Object.values(modules)
  .flatMap((module) => Object.values(module))
  .filter(isBuilder)
  .sort((a, b) => a.name.localeCompare(b.name));

/** Builder name → glob key, which is how a worker finds the one module it needs. */
const byName: Record<string, string> = {};
for (const [key, module] of Object.entries(modules)) {
  for (const value of Object.values(module)) if (isBuilder(value)) byName[value.name] = key;
}
pool.prime({ builders: byName });

export function builderByName(name: string): MeshBuilder | undefined {
  return builders.find((builder) => builder.name === name);
}
