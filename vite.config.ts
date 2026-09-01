import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
// @ts-expect-error — plain JS, and its shape is one function.
import { editorRoutes } from './scripts/editor-middleware.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PROJECTS = 'projects';

/** Every folder under `projects/` carrying a `project.json`. */
function listProjects(): string[] {
  const dir = path.join(ROOT, PROJECTS);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => fs.existsSync(path.join(dir, name, 'project.json')))
    .sort();
}

function hasCode(name: string): boolean {
  return fs.existsSync(path.join(ROOT, PROJECTS, name, 'code', 'index.ts'));
}

/**
 * `virtual:project` — which games this repo carries.
 *
 * On the dev server it lists every project, and the page picks one with
 * `?project=<id>`. A build is pinned to the one named by `--mode`, so nothing
 * in a shipped site knows the others exist.
 */
function projectModule(pinned: string | null): Plugin {
  const VIRTUAL = 'virtual:project';
  const RESOLVED = '\0' + VIRTUAL;
  return {
    name: 'hswow:project',
    configureServer(server) {
      // A document dropped into a project is a new zone, and the module that
      // lists them was resolved before it existed.
      server.watcher.on('add', (file) => {
        if (!file.includes('content')) return;
        const module = server.moduleGraph.getModuleById(RESOLVED);
        if (module) server.moduleGraph.invalidateModule(module);
      });
    },
    resolveId(id) {
      return id === VIRTUAL ? RESOLVED : undefined;
    },
    load(id) {
      if (id !== RESOLVED) return undefined;
      const names = pinned ? [pinned] : listProjects();
      const head: string[] = [];
      const configs: string[] = [];
      const loaders: string[] = [];
      const content: string[] = [];
      names.forEach((name, i) => {
        const dir = `/${PROJECTS}/${name}/content`;
        content.push(
          [
            `  ${JSON.stringify(name)}: {`,
            `    zones: import.meta.glob('${dir}/zones/*.json', { eager: true, import: 'default' }),`,
            `    people: import.meta.glob('${dir}/people/*.json', { eager: true, import: 'default' }),`,
            `    traits: import.meta.glob('${dir}/traits/*.json', { eager: true, import: 'default' }),`,
            `    quests: import.meta.glob('${dir}/quests/*.json', { eager: true, import: 'default' }),`,
            `    world: import.meta.glob('${dir}/world.json', { eager: true, import: 'default' }),`,
            `    sidecars: import.meta.glob('${dir}/zones/*.{r32,u8}', { eager: true, query: '?url', import: 'default' }),`,
            `  },`,
          ].join('\n'),
        );
        head.push(`import config${i} from '/${PROJECTS}/${name}/project.json';`);
        configs.push(`  ${JSON.stringify(name)}: config${i},`);
        if (!hasCode(name)) {
          loaders.push(`  ${JSON.stringify(name)}: () => Promise.resolve({}),`);
          return;
        }
        const from = `/${PROJECTS}/${name}/code/index.ts`;
        if (pinned) {
          head.push(`import * as code${i} from '${from}';`);
          loaders.push(`  ${JSON.stringify(name)}: () => Promise.resolve(code${i}),`);
        } else {
          loaders.push(`  ${JSON.stringify(name)}: () => import('${from}'),`);
        }
      });
      return [
        ...head,
        `export const configs = {\n${configs.join('\n')}\n};`,
        `export const loaders = {\n${loaders.join('\n')}\n};`,
        `export const content = {\n${content.join('\n')}\n};`,
        `export const only = ${pinned ? JSON.stringify(pinned) : 'null'};`,
      ].join('\n');
    },
  };
}

/**
 * The project's own `public/`, copied over the engine's after a build. Two
 * static roots rather than one, because the fonts belong to the engine and the
 * `CNAME` belongs to the site.
 */
function projectPublic(pinned: string | null): Plugin {
  let out = '';
  return {
    name: 'hswow:project-public',
    apply: 'build',
    configResolved(config) {
      out = config.build.outDir;
    },
    closeBundle() {
      if (!pinned) return;
      const from = path.join(ROOT, PROJECTS, pinned, 'public');
      if (!fs.existsSync(from)) return;
      fs.cpSync(from, path.resolve(ROOT, out), { recursive: true });
    },
  };
}

/**
 * The editor's save endpoint, on the dev server the editor is already served
 * from. Writes it makes are marked so the reload banner does not report the
 * editor's own saves back to it.
 */
function editorSave(written: Set<string>): Plugin {
  return {
    name: 'hswow:editor-save',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(
        editorRoutes(ROOT, (file: string) => {
          written.add(file.split(/[\\/]/).pop() ?? '');
          setTimeout(() => written.clear(), 2000);
        }),
      );
    },
  };
}

/**
 * Never reload the page by itself. Say so instead.
 *
 * A full reload drops pointer lock, returns you to spawn, rebuilds every zone
 * and re-renders the room impulse responses. That is a bad trade for any edit,
 * and an actively hostile one while something is saving a stream of files —
 * the moment you stand still to look at something is the moment it vanishes.
 *
 * **This has to be done on the server.** The obvious client-side approach is to
 * listen for `vite:beforeFullReload` and throw, which used to cancel the
 * reload; Vite 5 awaits listeners inside `Promise.allSettled`, which swallows
 * the exception, and the page reloads anyway. Checked in
 * `node_modules/vite/dist/client/client.mjs` rather than assumed, because the
 * failure is silent and looks exactly like the code not running.
 *
 * Returning an empty array from `handleHotUpdate` tells Vite that no modules
 * were affected, so it sends nothing and the client has nothing to act on. The
 * custom event carries the news to the banner instead.
 */
function noAutoReload(written: Set<string>): Plugin {
  return {
    name: 'hswow:no-auto-reload',
    apply: 'serve',
    configureServer(server) {
      // Printed once at startup so "is this even loaded" is answerable without
      // guessing. The plugin lives in the config, so it only takes effect after
      // a server restart — which Vite does automatically when the config
      // changes, but not if the server was started from a stale process.
      server.config.logger.info('  hswow: auto-reload off, banner instead');
    },
    handleHotUpdate(ctx) {
      const file = ctx.file.split(/[\\/]/).pop() ?? '';
      // The editor's own save, coming back round. Reporting it would tell the
      // person who pressed ctrl-S that something changed under them.
      if (written.has(file)) return [];
      ctx.server.config.logger.info(`  hswow: suppressed reload for ${file}`);
      ctx.server.ws.send({
        type: 'custom',
        event: 'hswow:changed',
        data: { file },
      });
      // Nothing updated, nothing reloaded. The page keeps running the code it
      // booted with until somebody refreshes, which is the whole point.
      return [];
    },
  };
}

export default defineConfig(({ command, mode }) => {
  // `vite build --mode <id>` picks the project. Serving lists them all.
  const pinned = command === 'build' ? (listProjects().includes(mode) ? mode : listProjects()[0] ?? null) : null;
  const outDir = pinned ? `docs/${pinned}` : 'docs';
  const written = new Set<string>();
  return {
    plugins: [projectModule(pinned), projectPublic(pinned), editorSave(written), noAutoReload(written)],
    resolve: {
      alias: { '@engine': path.join(ROOT, 'src') },
    },
    // Relative base: the build has to work from a Pages project subpath (…/hswow.net/)
    // as well as from a local file server, so nothing may be rooted at "/".
    base: './',
    build: {
      // The editor is a dev-server page only; a site's build lists one input.
      rollupOptions: { input: 'index.html' },
      outDir,
      emptyOutDir: true,
      // es2022 for top-level await, which the boot uses to sequence itself
      // behind the loading screen. Supported everywhere pointer lock and WebGL2 are.
      target: 'es2022',
      chunkSizeWarningLimit: 1500,
    },
    server: {
      // Exposed on the LAN so a phone can hit the dev server if that ever becomes useful.
      host: true,
    },
  };
});
