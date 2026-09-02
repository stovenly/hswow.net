# Electron: the same game in its own window

**Proposed.** Nothing here is built. A desktop build of any project, distributed
as a folder you unzip and run, that plays the same build `vite build --mode
<id>` already writes to `docs/<id>`. The web build stays; the two share one
engine and one seam.

**The short version.** One `platform` module in the engine says what the page
is running on, and everything that touches storage, the window or the keyboard
goes through it. A wrapper folder outside `src/` holds an Electron main process
that serves the built site over a privileged custom scheme with the
cross-origin isolation headers set, a preload that installs the desktop
platform through `contextBridge`, and a packaging script that turns `docs/<id>`
into a zipped folder. The engine never imports Electron and the wrapper never
imports the engine.

Working names throughout. The scheme, the bridge and the package name are the
owner's to choose.

---

## What it is, and is not

It is **not faster**. The same V8 runs the same JavaScript and the same ANGLE
drives the same GPU; a frame that takes 6 ms in Chrome takes 6 ms in the
window. Anyone expecting the port itself to buy frame time will be
disappointed, and it is better said once here.

What it is, is **control**:

- **A pinned Chromium.** The exact version ships with the game, so "Chrome-only,
  cutting edge" becomes a promise the game can keep rather than a hope about
  what the player has installed.
- **Isolation for free.** `PERFORMANCE-II.md` Phase 4 needs two response
  headers that GitHub Pages cannot set and a service worker has to fake. The
  protocol handler sets them in one line, and with them `SharedArrayBuffer`,
  `Atomics` and an honest core count.
- **No throttling, no tab.** Background timer throttling and renderer
  backgrounding are switched off, the V8 heap and the GPU program cache are
  sized by the game rather than by the browser's defaults, and there is no
  other tab competing for the GPU process.
- **A real window.** Kiosk fullscreen with keyboard lock, so Escape and Alt
  belong to the game; a quit that quits; saves and the zone cache on disk with
  no quota prompt.
- **The editor, later.** The dev server exists to give the editor a save
  endpoint. A desktop build can write files itself, which makes the editor
  something that could ship inside the same binary.

---

## The seam: `platform`

One module, `src/platform/`, and one interface. Everything below already
exists in the engine as a direct browser call and is routed through it. The
web implementation is those calls, unchanged in behaviour; the desktop one is
whatever the preload installed.

```
kind        'web' | 'desktop'
isolated    crossOriginIsolated, read once
storage     get(key) / set(key, value) / remove(key), strings, synchronous
window      fullscreen(on) / isFullscreen() / quit()
keys        lock(codes) / unlock()
```

**Storage stays synchronous.** `save.ts`, the options, the presets, the
floating panels and the render preset all read and write `localStorage`
synchronously, and nothing in the engine should learn to await a save. The
desktop store reads its whole contents from the main process once at preload,
answers reads from memory, and writes through on a debounce. The keys are the
same strings the web build uses today.

**Detection is one check at boot.** `main.ts` and `editor/main.ts` call
`installPlatform` before `createApp`; the desktop preload has put its
implementation on the window under the bridge name, and if it is there it
wins, otherwise the web one is installed. Nothing else in the engine asks
which it is running on; it asks the platform for what it needs.

**The query flags still work.** `flags.ts` reads `window.location.search`, and
the wrapper loads `index.html?debug` when launched with `--debug`, so `?debug`
reaches the desktop build the same way it reaches the deployed site.

**Touchpoints to route**, exhaustively, from a grep of the engine:

| Today | Through |
|---|---|
| `world/save.ts` `localStorage` | `storage` |
| `ui/options` load and store | `storage` |
| `dev/presets.ts`, `ui/Floating.ts`, the render preset in `PostFX` | `storage` |
| `ui/QuitToTitle.ts` | gains a quit-to-desktop entry on the pause stack when `kind` is desktop |
| `engine/Input.ts` pointer lock | unchanged; pointer lock is the same API |
| `PERFORMANCE-II.md` Phases 4 and 6 | read `isolated`, call `keys.lock` |

---

## The wrapper

A folder at the repository root, one for all projects, with its own
`package.json`. Electron and its builder are its devDependencies and never the
engine's; `tsconfig.json` excludes it; Vite does not know it exists.

**The scheme.** The site is **not loaded from `file://`**. The renderer's
`fetch` of sidecars, wasm and content fails on that scheme, and the null
origin breaks IndexedDB and `localStorage`. Instead the main process registers
a privileged scheme before `app` is ready (`standard`, `secure`,
`supportFetchAPI`, `corsEnabled`, `stream`) and handles it with
`protocol.handle`, serving files from the renderer directory. The handler
sets on every response:

- `Cross-Origin-Opener-Policy: same-origin` and
  `Cross-Origin-Embedder-Policy: require-corp`, so the page is isolated;
- a correct `Content-Type`, in particular `application/wasm`, so
  `WebAssembly.compileStreaming` is allowed to work and module scripts are
  accepted;
- `Cache-Control` long enough that Chromium's own cache does the rest.

Because `base: './'` is already set, the built site is location-independent
and nothing in the build changes for the desktop.

**The window.** One `BrowserWindow`, background `#0a0a0f` so there is no white
flash before the inline styles land, menu bar hidden, `contextIsolation` and
`sandbox` on, `nodeIntegration` off, `backgroundThrottling` off. A permission
handler grants pointer lock, fullscreen and keyboard lock and refuses the
rest. Navigation away from the scheme and `window.open` are denied. Fullscreen
is the window's own; kiosk is an option for a release build.

**Switches**, appended before `ready`:

- `disable-renderer-backgrounding`, `disable-background-timer-throttling`;
- `gpu-program-cache-size-kb` raised, so the shader programs the game
  compiles across every zone stay on disk between runs;
- `js-flags=--max-old-space-size=<n>` sized for the cover pools.

Not `disable-frame-rate-limit` or `disable-gpu-vsync`. The game has its own
frame cap and tearing is a look change; held as an open question.

**The preload.** A few dozen lines. It asks the main process for the store's
contents with one synchronous IPC at load, exposes `storage`, `window` and
`keys` on the bridge, and forwards writes. The main process keeps the store as
JSON files under `app.getPath('userData')/<project id>/`, one file per key,
so a save is a file a player can find.

**The editor**, when it comes, is `editor.html` served on the same scheme. Its
whole server surface is the thirteen `fetch` calls in `editor/api.ts`; the
desktop platform gains a `files` member that answers them against the project
directory, and the Vite middleware keeps answering them on the web.

---

## Build and distribution

`npm run package -- <id>` in the engine:

1. runs the worklet check, `tsc`, and `vite build --mode <id>` exactly as
   `deploy` does, minus the git steps;
2. points the wrapper at `docs/<id>` as its renderer directory;
3. runs the builder with a **directory** target and zips the result as
   `<title>-<version>-win-x64.zip`.

**A directory, not a portable exe.** The single-file portable target unpacks
itself to a temp folder on every launch, which is slow, and it defeats the
shader cache because the install path changes. A folder you unzip once runs
from where it is, and its `userData` and program cache persist.

**The Electron version is pinned exactly** in the wrapper's `package.json`.
That is the Chromium the game promises; it moves when the owner moves it.

**Size.** Roughly 200 MB unpacked and 90 MB zipped, of which the game is about
3 MB. That is the price of a pinned Chromium and there is no way round it
short of Tauri, which is ruled out below.

**Windows first.** The wrapper is platform-neutral, but the only machine the
game is judged on is a Windows desktop, and macOS needs signing and
notarisation before anything runs at all.

---

## Steps

Each lands on its own and leaves the web build untouched.

1. **The seam, web only.** `src/platform/` with the interface and the web
   implementation; every touchpoint above routed through it. No behaviour
   change; the diff is mechanical.
2. **The wrapper loads the site.** Scheme, handler, window, preload with an
   empty bridge. The game plays over the scheme from `docs/<id>`.
3. **Isolation.** The two headers in the handler; `crossOriginIsolated` is true
   in the window. `PERFORMANCE-II.md` Phase 4 can now be built against the
   desktop first and the service worker second.
4. **Storage on disk.** The bridge's store; saves and options survive a
   reinstall. No migration from `localStorage`; a desktop build starts fresh.
5. **The window.** Fullscreen and keyboard lock through the platform, a quit
   entry on the pause stack, the switches. What Escape does under lock is
   decided in `PERFORMANCE-II.md`'s open questions and applied here.
6. **Packaging.** The script, the directory target, the zip. A first build
   handed to someone who has never seen the repo.
7. **The editor in the binary.** Deferred until steps 1 through 6 are in and
   the editor is wanted somewhere the dev server is not.

*Done when* a zip unpacked on a clean Windows machine runs the current
project full-screen, isolated, saving to disk, with `?debug` reachable from
the command line, and the same commit deploys to Pages unchanged.

---

## Ruled out, and why

- **`file://` loading.** `fetch` fails, the origin is null, storage breaks.
  Every "just `loadFile` the index" tutorial stops working at the first
  sidecar.
- **Tauri.** WebView2 is always present on Windows 11 and the binary is a few
  megabytes, but it is Edge's Chromium at whatever version the machine has,
  with no command-line switches and no version pin. That is exactly the
  control this document exists to get.
- **`nodeIntegration` in the renderer.** The engine must not learn about Node;
  the bridge is the only door, and it is a handful of functions.
- **Auto-update.** A portable distribution is a zip; a new version is a new
  zip.
- **Going all in on the desktop.** The web build costs nothing once the seam
  exists, and it stays the thing that can be sent as a link.

---

## To settle before building

1. **Names.** The scheme, the bridge property on the window, the wrapper
   folder, the package name and the zip's title.
2. **Windows only** for the first release, or a macOS build alongside with the
   signing that entails.
3. **Escape and quit.** Under keyboard lock, Escape is the game's; the pause
   stack has a quit-to-desktop entry. Is that the shape, or is quitting
   elsewhere?
4. **Vsync.** Leave Chromium's frame pacing alone, or expose the uncapped
   switch as a desktop-only option beside the frame-rate cap.
5. **Code signing.** Unsigned, SmartScreen warns on first run. Signing costs a
   certificate and a step in the packaging script.
6. **The editor.** Whether step 7 is wanted at all, and if so whether it ships
   in the player's zip or in a separate one.
7. **Where `docs/<id>` sits in the flow.** Today it is a clone of the site
   repo; the wrapper reads from it but should never commit to it. Whether the
   package step builds into a scratch directory instead is a small choice
   worth making up front.
