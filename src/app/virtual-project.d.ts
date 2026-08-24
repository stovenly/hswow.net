declare module 'virtual:project' {
  import type { ProjectConfig, ProjectCode } from './project';

  /** Every project in `projects/`, by id. One entry only in a built site. */
  export const configs: Record<string, ProjectConfig>;
  export const loaders: Record<string, () => Promise<ProjectCode | { project?: ProjectCode }>>;
  /** Each project's `content/`, globbed at build time. */
  export const content: Record<
    string,
    {
      zones: Record<string, unknown>;
      world: Record<string, unknown>;
      /** Sidecar rasters, by path, as URLs to fetch. */
      sidecars: Record<string, string>;
    }
  >;
  /** The id a built site is pinned to, or null on the dev server. */
  export const only: string | null;
}
