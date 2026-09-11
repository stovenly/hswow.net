import type { MeshBuilder } from './types';

/**
 * The builder registry, one module at a time, shared by the main thread and the
 * workers. A builder's file is its name — `oak` is `builders/oak.ts` — so the
 * index costs nothing and nothing has to be imported to know what exists.
 * `ALIASES` covers the few whose name is not their file's.
 */

const loaders = import.meta.glob<Record<string, unknown>>('./builders/*.ts');

/** Builders whose name is not their file's, name → file. */
const ALIASES: Record<string, string> = {
  'voidstone-orb': 'orbs',
  'gold-orb': 'orbs',
  'pearl-orb': 'orbs',
  'quicksilver-orb': 'orbs',
  'oceanglass-orb': 'orbs',
};

/** Every module there is. A runtime read of the directory, never a list in the engine. */
export const BUILDER_KEYS: readonly string[] = Object.keys(loaders);

/** The file a name lives in, whether or not it is there. Named in the error when it is not. */
export function keyOf(name: string): string {
  return `./builders/${ALIASES[name] ?? name}.ts`;
}

const loaded = new Map<string, Promise<MeshBuilder[]>>();

export function isBuilder(value: unknown): value is MeshBuilder {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<MeshBuilder>;
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.radius === 'number' &&
    typeof candidate.build === 'function'
  );
}

/** Every builder one module exports. Empty for a key that is not in the glob. */
export function loadModule(key: string): Promise<MeshBuilder[]> {
  let pending = loaded.get(key);
  if (!pending) {
    const loader = loaders[key];
    if (!loader) return Promise.resolve([]);
    pending = loader().then((module) => Object.values(module).filter(isBuilder));
    loaded.set(key, pending);
  }
  return pending;
}

export async function loadBuilder(name: string): Promise<MeshBuilder | undefined> {
  return (await loadModule(keyOf(name))).find((builder) => builder.name === name);
}
