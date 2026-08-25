import type GUI from 'lil-gui';
import type { ZoneDefinition, ZoneGroup, ZoneId } from '../world/Zone';
import type { PortalDefinition } from '../world/Portal';
import type { Loader } from '../ui/Loader';
import type { App } from './boot';

/**
 * A project is one game built on this engine: its zones, its content, its
 * site. The engine never imports one — a project is handed to `createApp`,
 * and `virtual:project` is how a page gets hold of it.
 */

/** `project.json`. Everything here is data a page can read before any code runs. */
export interface ProjectConfig {
  readonly id: string;
  readonly title: string;
  /** Where a fresh boot lands. */
  readonly entry: ZoneId;
  /** Where the editor lands. A code zone has nothing in it to select. */
  readonly editorEntry?: ZoneId;
  /** Zone families, in the order anything listing zones should read them. */
  readonly groups?: readonly ZoneGroup[];
  /** Whether this project's build carries the `?debug` panel at all. */
  readonly debug?: boolean;
}

/** What a project's optional `code/index.ts` adds on top of the config. */
export interface ProjectCode {
  /**
   * Zones that are code rather than documents — galleries, showcases, rigs —
   * and the portals between them. Built inside loader steps, since a project's
   * fixtures can be as expensive as its content.
   */
  world?(loader: Loader): Promise<ProjectWorld> | ProjectWorld;
  /** Built behind the loading screen, before the first frame. */
  prebuild?: readonly ZoneId[];
  /** Shader-compiled in the background once the loop is running. */
  precompile?: readonly ZoneId[];
  /** Named stations the soundscape solo control offers. */
  stations?: readonly string[];
  /** This project's own tuning folders, mounted alongside the engine's. */
  panel?(gui: GUI, app: App): void;
  /** Which zone a builder is on show in, for the inspector's jump to it. */
  galleryFor?(builder: string): ZoneId | undefined;
}

export interface ProjectWorld {
  zones: ZoneDefinition[];
  portals: PortalDefinition[];
}

export type Project = ProjectConfig & ProjectCode;

const EMPTY: ProjectWorld = { zones: [], portals: [] };

/** The world a project declares, code and documents together. */
export async function projectWorld(project: Project, loader: Loader): Promise<ProjectWorld> {
  if (!project.world) return { zones: [...EMPTY.zones], portals: [...EMPTY.portals] };
  return project.world(loader);
}
