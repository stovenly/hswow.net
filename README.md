# Here Stands What Once Was

A first-person browser game. three.js, TypeScript, no art assets — every mesh and every
sound is generated in code.

Live at <https://stovenly.github.io/hswow.net/> once Pages is enabled (see below).

## Commands

```
npm run build           # typecheck, then bundle into docs/
npm run preview         # serve the built docs/ locally
npm run dev             # dev server with HMR, exposed on the LAN
npm run check:movement  # headless collision and movement assertions
npm run check:audio     # gust field, noise colour, reverb decay
npm run check:art       # builder determinism, sway weights, scale
npm run check:world     # zone graph, portals, terrain, prop placement
npm run check:faust     # every .dsp matches its committed .wasm
npm run check           # all five
```

`docs/` is committed on purpose — it is what GitHub Pages serves. It is also Vite's output
directory and is **wiped on every build**, so nothing may be hand-written into it. Files
that must ship alongside the build — `.nojekyll`, the `CNAME` for the custom domain — live
in `public/`, which Vite copies across verbatim.

## Enabling Pages

One-time, in the repo on GitHub: **Settings → Pages → Source: Deploy from a branch →
Branch `main`, folder `/docs`**. After that every push that touches `docs/` redeploys.

## Debug switches

Query-string flags, and they work in the deployed build — not just locally — because
the game is tested on a phone against the live URL.

| Flag | Effect |
|---|---|
| `?debug` | Frame stats, the live tuning panel, and a movement state readout |
| `?level=<name>` | Which level to boot into. Only `proving` exists so far |
| `?touch` | Force the touch controls on, to test them with a mouse |

## Layout

```
src/
  engine/     renderer, frame loop, post-processing
  audio/      procedural synthesis, spatialization, zone acoustics
  player/     first-person controller, collision
  world/      zones, heightfield, portals, prop streaming
  actors/     NPCs and animation
  systems/    topics, dialogue, quests, inventory, notes, autosave
  ui/         HUD, dialogue, journal, touch controls
  content/    data only, no engine imports
  art/        procedural mesh builders — one file per family
  debug/      proving ground, panels, overlays
docs/         build output, served by Pages
```

Content files hold no engine imports, so writing the game is authoring data rather
than writing code.

## Build plan

See **[SPEC.md](SPEC.md)** — phases, status, locked decisions, open questions, and the
reasoning behind the audio and dialogue systems. It is written to be read without prior
context and is the source of truth for the build.

Phases 0 through 6 are in place: harness, first-person controller, render pipeline,
procedural audio, art kit, zones and portals, and zone soundscapes.

Click to capture the mouse, WASD to move, shift to sprint, space to jump, Escape to
release. On a phone the left half of the screen is a stick and the right half is look.

Open `?debug` to tune the look — pixel size, edge strength, levels, dither, fog
— then **preset → save** to keep it across reloads.
