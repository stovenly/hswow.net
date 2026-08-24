# Here Stands What Once Was

A first-person browser game. three.js, TypeScript, no art assets — every mesh and every
sound is generated in code.

Live at <https://stovenly.github.io/hswow.net/>.

## Layout

One engine, many projects.

```
src/                 the engine: art, audio, engine, world, life, player, ui, app, editor, dev
editor.html          the authoring tool, dev server only
index.html           the game page
projects/<id>/
  project.json       id, title, entry zone, zone groups
  content/           zone documents and their sidecars — the editor's territory
  code/              zones that stay code: galleries, showcases, rigs
  public/            copied verbatim into the build: CNAME
docs/<id>            git-ignored; a clone of that project's own site repo
```

Projects import the engine as `@engine/*`. The engine never imports a project — a page
asks `virtual:project` for one and hands it to `createApp`.

## Commands

```
npm run dev             # dev server; /editor.html is the authoring tool
npm run build           # typecheck, then bundle the debug project into docs/debug
npm run deploy -- <id>  # build a project into its site repo, commit and push
npm run preview         # serve the built docs/debug locally
npm run check:movement  # headless collision and movement assertions
npm run check:audio     # gust field, noise colour, reverb decay
npm run check:world     # zone graph, portals, terrain, prop placement
npm run check:faust     # every .dsp matches its committed .wasm
```

`vite build --mode <id>` picks the project and writes `docs/<id>`. That folder is a clone
of the site repo it deploys to, made once by hand:

```
git clone <site-repo> docs/debug
```

The engine repo carries no built output. Each game is hosted from its own repo, with its
own Pages settings, domain and history; the `CNAME` lives in that project's `public/`.

## Debug switches

Query-string flags, and they work in the deployed build — not just locally — because
the game is tested on a phone against the live URL.

| Flag | Effect |
|---|---|
| `?debug` | Frame stats, the live tuning panel, and a movement state readout |
| `?level=<name>` | Which level to boot into. Only `proving` exists so far |
| `?touch` | Force the touch controls on, to test them with a mouse |

## Inside the engine

```
src/
  engine/     renderer, frame loop, post-processing
  audio/      procedural synthesis, spatialization, zone acoustics
  player/     first-person controller, collision
  world/      zones, heightfield, portals, prop streaming, notes
  life/       creatures and animation
  ui/         HUD, options, reading screen, loader
  art/        procedural mesh builders — one file per family
  app/        the boot sequence and the tuning panel, shared by both pages
  editor/     the authoring shell
  dev/        engine dev utilities: flags, presets, stats, identify
```

## Build plan

See **[MASTER-SPEC.md](specs/MASTER-SPEC.md)** — phases, status, locked decisions, open questions, and the
reasoning behind the audio and dialogue systems. It is written to be read without prior
context and is the source of truth for the build.

Phases 0 through 6 are in place: harness, first-person controller, render pipeline,
procedural audio, art kit, zones and portals, and zone soundscapes.

Click to capture the mouse, WASD to move, shift to sprint, space to jump, Escape to
release. On a phone the left half of the screen is a stick and the right half is look.

Open `?debug` to tune the look — pixel size, edge strength, levels, dither, fog
— then **preset → save** to keep it across reloads.
