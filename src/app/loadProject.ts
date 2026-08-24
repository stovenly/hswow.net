import { configs, loaders, only } from 'virtual:project';
import type { Project, ProjectCode } from './project';

/** Every project this build carries, by id. One entry in a shipped site. */
export function projectIds(): string[] {
  return Object.keys(configs);
}

/**
 * The project a page runs. A built site is pinned to one; the dev server takes
 * `?project=<id>` and falls back to the first it finds.
 */
export async function loadProject(id?: string): Promise<Project> {
  const wanted =
    only ?? id ?? new URLSearchParams(window.location.search).get('project') ?? projectIds()[0];
  const config = wanted ? configs[wanted] : undefined;
  if (!config) throw new Error(`no project "${wanted ?? ''}" under projects/`);
  const module = await loaders[config.id]();
  const code = (('project' in module ? module.project : module) ?? {}) as ProjectCode;
  return { ...config, ...code };
}
