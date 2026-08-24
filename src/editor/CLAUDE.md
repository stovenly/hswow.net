# src/editor

The authoring tool. A second Vite entry — `editor.html` — that boots the real
engine through `app/boot.ts`, loads the project's zone documents, and writes them
back through the dev server.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## The rule everything else follows

**Every commit is document to world, one direction.** Nothing here reads the
scene graph back into a file. There is no "export current scene", and a moved
prop writes a placement, never a mesh.

**A control that changes what you see wrote a document field. A control that did
not is on the View menu and says session only.** There is no third category —
visibility, isolate, the ruler, bookmarks, the world-state preview and the
climate holds are all inspection state and none of them is saved.

**No second renderer.** The world is drawn by `PostFX` or not at all. The gizmo,
the outlines, the brush rings and the visualisers are ordinary scene objects with
`depthTest` off and `fog` off; the moment the editor draws anything the game
would draw differently, its judgement is worthless.

## Files

- `Editor.ts` — the shell: modes, keys, toolbar, and what everything else hangs
  off.
- `session.ts` — the documents in hand, undo, the rebuild loop and autosave.
- `api.ts` — the client half of `/__editor`; `scripts/editor-middleware.mjs` is
  the server half.
- `selection.ts`, `transform.ts` — picking by `userData.entry`, and the gizmo.
- `inspector.ts`, `zonePanel.ts`, `terrainPanel.ts`, `layerPanel.ts` — forms,
  generated from the kind's schema and the builder's own option schema.
- `palette.ts`, `thumbnails.ts`, `entries.ts` — what can be placed, what it looks
  like, and adding, copying and removing it.
- `outliner.ts` — the tree. Dragging a row reorders the document, and document
  order is build order.
- `shapes.ts`, `terraform.ts` — drawing on the ground, and the brushes.
- `portals.ts` — two-click door wiring into `world.json`.
- `visualisers.ts` — everything the world does not draw.

## Modes

**Fly** is the game's `Controller` with `noclip` on and `Input.freeLook` set, so
the keyboard still steers while the mouse is loose — a left click has to be able
to pick. Right-drag looks; shift-drag orbits the selection.

**Play** drops the capsule at the camera's feet with everything live. Nothing
about it is special-cased: it is the game loop with the panels still on screen.

**Top** is a narrow field from three hundred metres up rather than an
orthographic camera. The pipeline captures the perspective camera in a dozen
places, and swapping it would be a change to the renderer for the sake of a view
mode.

## Rebuild reach

A placement change moves the built object and re-indexes the collider — no
builder runs and nothing is disposed. Anything else rebuilds the whole zone
through `ZoneManager.rebuild`, debounced. An entry that throws while building
loses itself and not the level, because the editor writes these files mid-edit.

## No checks

Same rule as everywhere else in this repo: no probes, no verification scripts, no
schema validators. Open the zone and look.
