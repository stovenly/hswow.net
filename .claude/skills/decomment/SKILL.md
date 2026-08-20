---
name: decomment
description: Strip comment bloat from source files under src/ or tools/ — run the fixed gauntlet (narration, history, essay/lore, moving-target, stale, trim, keep) over a file or directory and delete everything that fails it. Use when asked to decomment, clean up comments, strip comment bloat, or run a comment cleanup phase.
---

# Decomment

Apply the "Default to no comment" rule in the root `CLAUDE.md` to existing code.
Comments only — a diff whose non-comment lines changed has failed.

## Scope

One file, or one directory named by the caller. Never `docs/`,
`src/audio/faust/built/`, `node_modules/`, or root `*.md`.

## The gauntlet

Run these in order over every comment in the file. The order is fixed so the
result does not depend on mood. First test that fires decides the comment.

1. **Narration** — does it restate the line under it, or the name above it?
   `// build the roof` over `buildRoof()`; `/** Ring-down time in seconds. */`
   over `decay: number`. **Delete.**
2. **History** — does it describe a previous version, an attempt, a bug, a fix,
   or a change? "used to", "originally", "the first version", "was corrected",
   "turned out to", "now", "instead of". **Delete.** It belongs in a commit
   message and the commit message already has it.
3. **Essay or lore** — a paragraph defending a number, quoting a measurement
   from finished work, comparing against a rejected alternative, or saying what
   the object is in the world and who uses it. **Delete.** If a single hard
   constraint is buried in it, that constraint survives as one line and the
   prose does not.
4. **Moving target** — does it point at a document, a section number, another
   file's line, or "see X"? **Delete or rewrite** so it names the constraint and
   stands alone.
5. **Stale** — does it still describe the code beneath it? If not, **delete**;
   do not repair it and do not annotate the drift.
6. **Trim the survivor** — a comment that got this far is cut to one line, two
   at the very most. `##` headings, blank comment lines and bullet lists inside
   a comment all go.
7. **Keep** — what is left is an orientation mapping, a unit or range, a
   cross-file contract, or a one-sentence gotcha. Nothing else survives.

## Never delete

An orientation comment. Shrink it to the mapping sentence —
`// rotateY(θ) takes +Z to the outward normal at bearing θ` — and keep it.

## File headers

Where a file needs one at all, one sentence: what the file is, plus its origin
or axis convention if it has one.

`// Window: opening, frame, and the sheared daylight shaft. Wall at z=0, proud toward +Z.`

Builders under `src/art/builders/` get exactly this and nothing more.

## Overflow

Something worth keeping and genuinely too long for one line goes into that
area's `CLAUDE.md`, not into another comment. Those files are capped at 60
lines and carry no history either.

## Finishing

- Re-read the diff and confirm only comment lines moved.
- `npx tsc --noEmit` if any `.ts` file lost a doc comment that might have been
  load-bearing for inference.
- One commit per area, message plainly stating it:
  `Strip comment bloat from art/builders`.
