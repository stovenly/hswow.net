# Title screen — spec

**Built.** The game page stops loading straight into the debug
exterior. Boot resolves onto a title screen; the world is entered only when the
player chooses.

**The short version.** The title mounts before boot runs: the game page shows
it immediately, the whole boot — world build, prebuild, audio render — runs
behind it with the loading screen hidden, and every way in awaits whatever is
still warming. The title screen (`body.is-title`): the
game's title over four buttons in the pause-button dress — **continue** (only
when a save exists; loads the newest slot), **new game** (enters the
countryside village), **load** (the existing slot picker), **options** (the
existing panel). The pause stack — capture hint, save/load/options openers —
is hidden under `is-title`; the title's own buttons drive the same panels.
Choosing fades, builds, and drops into play through the same capture dance a
save load uses today. The editor page is untouched and still enters its zone
at boot.

---

## What exists

- `app/boot.ts` — `createApp` runs the ordered boot; `'settling the world'`
  enters `project.entry` ('exterior') during loading; `start()` draws one
  frame before the boot screen fades and prewarms the effect chain.
- `world/save.ts` — three slots, `savedAt` stamps, `saveSummaries()` for the
  picker; `ui/SaveSlots.ts` owns the picker and the load path
  (`hardReset` + capture).
- The not-playing stack in `index.html`/`styles.css`, keyed off body classes
  (`is-loading`, `is-playing`, `is-reading`, …).
- `project.json` — `title: "Here Stands What Once Was"`, `entry: "exterior"`.

## The change

**Boot.** `createApp` takes the entry step only when asked (the editor asks;
the game page does not). On the game page the title mounts first and boot runs
behind it — `body.is-title` hides the static loading screen, which covers only
the window before the first module runs. Nothing sounds before a zone exists:
the weather rig's beds are gated on one.

**The screen.** `src/ui/Title.ts`, mounted by `main.ts` only. Title lettering
from `project.title`, buttons beneath, the options register: flat dark ground,
one hard pixel of border, lowercase. `continue` is absent when no slot is
occupied. `body.is-title` hides the pause stack and the crosshair.

- **continue** — loads the newest occupied slot by `savedAt`, through the
  exact load path the slot picker uses.
- **new game** — fresh world (the page-load state is already fresh), enters
  `project.start` — a new project field naming the first zone, set to
  `countryside-village`; `entry` keeps meaning what the editor and debug
  flows enter.
- **load** — opens the existing slot picker in load mode over the title.
- **options** — opens the existing options panel over the title.

Every button's click is the user gesture that resumes the audio context.

**Into play.** Choice → the shared `Fade` down → enter/hardReset → fade up →
`input.capture()`. The title tears down; Escape from play shows the pause
stack as today. No "quit to title" — a page reload is that, for now.

## Build order

**P1 — deferred entry.** The flag on `createApp`, the black first frame, the
title screen with new game wired.
*Done when* the game page boots to the title, new game fades into the
village, and the editor still boots straight into its zone.

**P2 — continue and load.** Newest-slot continue, the picker over the title,
both resolving through the load path.
*Done when* continue appears only with a save present and lands in the saved
zone, and load offers the three slots over the title.

**P3 — polish.** Options over the title, hidden pause stack.
*Done when* options opens and closes without capturing the mouse, and nothing
from the pause stack shows behind the title.
