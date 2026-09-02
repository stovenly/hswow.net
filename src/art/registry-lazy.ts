import type { MeshBuilder } from './types';

/**
 * The worker's registry: the same glob as `registry.ts`, loaded a module at a
 * time. Names are found through an index the main thread sends over, because a
 * builder's name is a runtime value and not its file name.
 */

const loaders = import.meta.glob<Record<string, unknown>>('./builders/*.ts');

/** Builder name → glob key. Set once by `indexBuilders`. */
let index: Record<string, string> = {};
const loaded = new Map<string, Promise<MeshBuilder[]>>();

export function indexBuilders(byName: Record<string, string>): void {
  index = byName;
}

export function isBuilder(value: unknown): value is MeshBuilder {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<MeshBuilder>;
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.radius === 'number' &&
    typeof candidate.build === 'function'
  );
}

export async function loadBuilder(name: string): Promise<MeshBuilder | undefined> {
  const key = index[name];
  const loader = key ? loaders[key] : undefined;
  if (!loader) return undefined;
  let pending = loaded.get(key);
  if (!pending) {
    pending = loader().then((module) => Object.values(module).filter(isBuilder));
    loaded.set(key, pending);
  }
  return (await pending).find((builder) => builder.name === name);
}
