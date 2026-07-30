# Heaven Sleeps Within Our Wounds

A first-person browser game. three.js, TypeScript, no art assets — every mesh and every
sound is generated in code.

Live at <https://stovenly.github.io/hswow.net/> once Pages is enabled (see below).

## Commands

```
npm run build     # typecheck, then bundle into docs/
npm run preview   # serve the built docs/ locally
npm run dev       # dev server with HMR, exposed on the LAN
```

`docs/` is committed on purpose — it is what GitHub Pages serves.

## Enabling Pages

One-time, in the repo on GitHub: **Settings → Pages → Source: Deploy from a branch →
Branch `main`, folder `/docs`**. After that every push that touches `docs/` redeploys.

## Debug switches

Query-string flags, and they work in the deployed build — not just locally — because
the game is tested on a phone against the live URL.

| Flag | Effect |
|---|---|
| `?debug` | Frame stats and the live tuning panel |
| `?level=<name>` | Which level to boot into. Only `proving` exists so far |

## Layout

```
src/
  engine/     renderer, frame loop, post-processing
  audio/      procedural synthesis, spatialization, zone acoustics
  player/     first-person controller, collision
  world/      zones, heightfield, portals, prop streaming
  art/        procedural mesh builders
  actors/     NPCs and animation
  systems/    topics, dialogue, quests, inventory, notes, autosave
  ui/         HUD, dialogue, journal, touch controls
  content/    data only, no engine imports
  debug/      proving ground, panels, overlays
docs/         build output, served by Pages
```

Content files hold no engine imports, so writing the game is authoring data rather
than writing code.

## Build plan

Phases, current status, and the reasoning behind the audio and dialogue systems live in
the plan file kept alongside this work. Phase 0 (harness) is in place; the camera is
temporary OrbitControls and gets replaced by the first-person controller in Phase 1.
