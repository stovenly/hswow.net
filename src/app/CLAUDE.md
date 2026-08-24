# src/app

The boot sequence and the tuning panel, shared by the game page and the editor.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## Files

- `boot.ts` — `createApp` runs the ordered boot and returns the handles. The
  ordering is load-bearing: `useAerialFog` before any material compiles,
  `patchArtMaterial` before `PostFX`, the world before the audio. `start()` is
  separate so a page can register its own loops ahead of the frame loop.
- `devPanel.ts` — every tuning folder the game has, mounted into whichever GUI is
  passed. The game hands it the `?debug` panel; the editor hands it its own, so a
  knob exists once.
- `project.ts` — what a project is: `project.json` plus an optional `code/`.
- `loadProject.ts` — which one this page runs.
- `content.ts` — a project's documents, interpreted once. The editor edits the
  same objects the world is reading, so a second interpretation would hand it
  copies and every change would go nowhere.

## Direction of dependency

Projects import the engine as `@engine/*`. **The engine never imports a
project** — a page asks `virtual:project` for one and hands it to `createApp`.
Anything that looks like an engine dev utility living in a project belongs in
`src/dev/`.
