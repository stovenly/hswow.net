declare module 'virtual:project' {
  import type { ProjectConfig, ProjectCode } from './project';

  /** Every project in `projects/`, by id. One entry only in a built site. */
  export const configs: Record<string, ProjectConfig>;
  export const loaders: Record<string, () => Promise<ProjectCode | { project?: ProjectCode }>>;
  /** The id a built site is pinned to, or null on the dev server. */
  export const only: string | null;
}
