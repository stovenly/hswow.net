import { defineConfig, type Plugin } from 'vite';

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
function noAutoReload(): Plugin {
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

export default defineConfig({
  plugins: [noAutoReload()],
  // Relative base: the build has to work from a Pages project subpath (…/hswow.net/)
  // as well as from a local file server, so nothing may be rooted at "/".
  base: './',
  build: {
    // The editor is a dev-server page only; the game's build lists one input.
    rollupOptions: { input: 'index.html' },
    outDir: 'docs',
    emptyOutDir: true,
    // es2022 for top-level await, which `main.ts` uses to sequence boot behind
    // the loading screen. Supported everywhere pointer lock and WebGL2 are.
    target: 'es2022',
    // The whole game is one bundle; there is nothing to lazily split yet.
    chunkSizeWarningLimit: 1500,
  },
  server: {
    // Exposed on the LAN so a phone can hit the dev server if that ever becomes useful.
    host: true,
  },
});
