import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base: the build has to work from a Pages project subpath (…/hswow.net/)
  // as well as from a local file server, so nothing may be rooted at "/".
  base: './',
  build: {
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
