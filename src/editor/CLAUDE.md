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

**Fly** is the game's `Controller` with `noclip` on. **Hold the right button to
fly**: that is what sets `Input.freeLook`, which lets the keyboard steer while
the mouse is loose. Let go and the same keys are the editor's shortcuts again —
W is the move tool and a step forward, and only one of them at a time. Letting
go also drops whatever was held, so a key released after you stop flying cannot
stick. Shift-drag orbits the selection.

**Play** drops the capsule at the camera's feet with everything live. Nothing
about it is special-cased: it is the game loop with the panels still on screen.

**Top** is a narrow field from three hundred metres up rather than an
orthographic camera. The pipeline captures the perspective camera in a dozen
places, and swapping it would be a change to the renderer for the sake of a view
mode.

## Rebuild reach

Three reaches, and nothing should ask for a costlier one than it needs.

- `transform` moves the built object. No builder runs and nothing is disposed.
- `entry` builds that one object again and swaps it in — a re-rolled seed, a
  changed builder option — through `ZoneManager.replaceObject`.
- `zone` raises the whole level through `ZoneManager.rebuild`. Terrain, a
  scatter rule, a shell, a layer condition. It makes the world blink.

Collision is *marked* stale by a move and rebuilt on the way into Play: indexing
a level the size of the village blocks for a second, and nothing in Fly collides
with anything. Contact dragging and drop cast against the scene graph instead.

An entry that throws while building loses itself and not the level, because the
editor writes these files mid-edit.

## No checks

Same rule as everywhere else in this repo: no probes, no verification scripts, no
schema validators. Open the zone and look.
