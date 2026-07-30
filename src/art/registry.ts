import type { MeshBuilder } from './types';

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

function isBuilder(value: unknown): value is MeshBuilder {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<MeshBuilder>;
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.radius === 'number' &&
    typeof candidate.build === 'function'
  );
}

/** Sorted by name, so the gallery's layout is stable between runs. */
export const builders: MeshBuilder[] = Object.values(modules)
  .flatMap((module) => Object.values(module))
  .filter(isBuilder)
  .sort((a, b) => a.name.localeCompare(b.name));

export function builderByName(name: string): MeshBuilder | undefined {
  return builders.find((builder) => builder.name === name);
}
