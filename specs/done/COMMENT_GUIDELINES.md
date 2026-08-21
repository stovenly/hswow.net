# Comment cleanup — spec

**Applied**, phases 0 through 9, one commit per phase, and every area
`CLAUDE.md` in the proposed set is written. **Phase 10, `tools/`, moved to
`FUTURE-REFACTORS.md`** — it is blocked on the decision about the check
harnesses, which is not a comment question.

## 0. What is actually there

Measured over `src/**` (`.ts`, `.js`, `.glsl`), 453 files, 106,211 lines:

| | |
|---|---|
| comment lines | 36,400 of 106,211 — **34%** |
| comment bytes | 1.53 MB of 4.19 MB — **36%** |
| block comments >= 6 lines | ~1,185 |
| files with past-decision narration ("used to", "originally", "that is why", "the old…") | 122 |
| trailing `//` comments | 62 (not the problem) |

Comment density by area:

```
src/content        53%   src/engine         40%
src/audio/dsp      51%   src/art/recipes    38%
src/audio/audition 50%   src/audio/faust    37%
src/player         46%   src/art            35%
src/world          45%   src/ui             35%
src/art/glsl       42%   src/art/builders   33%
src/audio/models   41%   src/audio/music    28%
```

Worst single files: `audio/models/footsteps.ts` (821 comment lines of 1,528),
`engine/PostFX.ts` (645/1,164), `player/Controller.ts` (623/1,304),
`world/ZoneManager.ts` (598/1,303), `art/building.ts` (530/1,587).

The four failure modes, all present verbatim in the tree:

1. **Essay headers.** `builders/window.ts` opens with 50 lines of prose under
   `##` sub-headings. `builders/elder.ts` opens with 30 lines on what the shrub
   means in an English hedgerow.
2. **Past-decision narration.** "which is what this used to be", "which is where
   that was corrected", "The first version stood 1.8 m…", "A spot was tried and
   its cone landed a circle over the square patch". The repo already bans this
   in prose and it shipped anyway.
3. **Restating the code.** `/** Ring-down time in seconds. */` above
   `decay: number`; `/** See dsp/bubble.ts */` above a type alias.
4. **Justifying numbers.** Paragraphs defending a constant, measurements quoted
   from work that is finished ("it blocks four horizontal sightlines in five").

The existing `CLAUDE.md` rule ("Comments are short — a line or three") is not
holding because it states a length and no test. Everything below replaces it
with a test.

## 1. The rule (goes into root `CLAUDE.md`, replacing "Comments are short")

Drafted from what the existing rule fails to catch, plus wording other people
report as the part that actually works — a *deny-list of comment kinds* plus an
*ordered gauntlet*, rather than a length limit.

Two things to know about this rule before writing it:

- Length limits do not survive. "A line or three" is in force today and files
  carry fifty-line headers. The rule has to name the *kinds* of comment that are
  banned, with examples from this repo, or it reads as advisory.
- One rules paragraph decays after a turn or two. It needs the second half: a
  cleanup pass that is run, not a promise to be good.

Proposed text:

> ### Default to no comment
>
> **Write zero comments unless the comment passes the test below.** The code
> says what it does. A comment exists only to carry something the code cannot:
> a constraint that is not visible at the call site, a unit, an axis, or the
> reason a simpler version is wrong.
>
> Before writing a comment, ask: *does a reader with this file open already know
> this?* If yes, do not write it.
>
> **Banned outright. Do not write these, ever:**
>
> - **Narration.** Restating the line under it. `// build the roof` over
>   `buildRoof()`. `/** Ring-down time in seconds. */` over `decay: number`.
> - **History.** What a previous version did, what was tried, what was wrong,
>   what was fixed. No "used to", "originally", "the first version", "was
>   corrected", "turned out to". If it matters it goes in the commit message.
> - **Justification essays.** Paragraphs defending a number, a proportion or a
>   material choice. Measurements from finished work. Comparisons to rejected
>   alternatives.
> - **Lore.** What the object is in the world, where it grows, who uses it, what
>   it evokes. That is not code documentation.
> - **`##` sections inside a comment.** If a comment needs headings it is a
>   document; put it in the area's `CLAUDE.md` or delete it.
> - **Pointers to moving targets.** "see SPEC.md §4", "per MATERIAL-SYSTEM.md".
>   Name the constraint instead, so the comment stands alone.
>
> **Keep, and keep short:**
>
> - **Orientation.** Required by the orientation rule — one line saying what a
>   rotation maps to what: `// rotateY(θ) takes +Z to the outward normal`.
> - **Units and ranges** where the name cannot carry them: `// metres`,
>   `// 0..1, gamma-encoded`.
> - **Contracts across files.** A uniform name a shader also spells, a field two
>   modules must agree on, an ordering another module depends on.
> - **Genuine gotchas.** The reason the obvious version breaks, in one sentence.
>
> **Size.** One line. Two if the constraint genuinely needs it. A file header,
> where a file needs one at all, is one sentence saying what the file is —
> `// Chimney: stack, cap, and the smoke emitter mount.` A comment reaching a
> fourth line is wrong; cut it or move it to the area's `CLAUDE.md`.
>
> **When editing existing code, delete comments that break these rules** in the
> region you are already touching. Do not preserve them out of politeness.

The existing sentence "If a bug is worth remembering it goes in a commit
message, not in a block comment above the fix" stays — it is the same rule —
but moves under **History** so it lands with the ban instead of as an aside.

Two supports to add at the same time, because a rules paragraph alone is known
not to hold:

- **A `/decomment` skill** in `.claude/skills/`, holding the gauntlet in a fixed
  order: narration → history → essay/lore → moving-target → stale →
  trim-the-survivor → keep. Ordered so the result does not depend on mood. This
  is the tool the phases below are executed with.
- **A commit habit:** a change that adds a comment block over three lines is
  wrong by default.

## 2. Phased retroactive cleanup

Rules for every phase, no exceptions:

- **Comments only.** No code moves, no renames, no reformatting, no "while I was
  here". A diff whose non-comment lines changed has failed the phase.
- **Delete, or shrink to one line.** Where a header carries a real constraint,
  the constraint survives as a single line; the prose around it does not.
- **Never delete an orientation comment.** Shrink it to the mapping sentence.
- **Anything worth keeping and too long for one line goes to the area's
  `CLAUDE.md`** (Part 3), not into another comment.
- **One phase per commit**, message plainly stating the area:
  `Strip comment bloat from art/builders`.
- Excluded entirely: `docs/` (build output), `src/audio/faust/built/`
  (generated), `node_modules/`, and the root `*.md` documents — those are notes,
  not source, and are out of scope here.

Order is by damage per file read, so the files opened most often get fixed first.

### Phase 0 — write the rule
Root `CLAUDE.md` gets the Part 1 text; `.claude/skills/decomment` gets the
gauntlet. Nothing else changes. Without this, every later phase regrows.

### Phase 1 — the five worst files
`audio/models/footsteps.ts`, `engine/PostFX.ts`, `player/Controller.ts`,
`world/ZoneManager.ts`, `art/building.ts`.
~3,200 comment lines across 5 files. This is the calibration set: whatever
survives here is the standard for every later phase, so do these by hand and
show the diff before continuing.
Target: under 8% comment lines each.

### Phase 2 — `src/art/*.ts` (50 files, 6,045 comment lines, 35%)
The shared vocabulary — `assemble`, `finish`, `masonry`, `palette`, `stone`,
`cover`, `sway`, `water`, `particles`. Read constantly, so the noise is paid for
constantly. Real API contracts live here; those become one-liners, the rest
goes. `src/art/CLAUDE.md` is written in this phase and absorbs what is worth
keeping.

### Phase 3 — `src/art/builders/` (191 files, 9,454 comment lines, 33%)
The largest block and the most formulaic: nearly every file opens with a header
essay about the object. Rule for this phase — **one line per builder file**,
naming the object and its origin/axis convention, e.g.
`// Window: opening, frame, and the sheared daylight shaft. Wall at z=0, proud toward +Z.`
Orientation lines inside the body survive as single lines. Everything else goes.
Expect this phase to remove ~7,500 lines on its own.

### Phase 4 — `src/engine/` (26 files, 2,972 comment lines, 40%)
Render pipeline. Pass order and uniform names are genuine cross-file contracts —
keep those as one-liners; delete the pipeline archaeology (what
`RenderPixelatedPass` used to do, what `OutputPass` was removed for).
`src/engine/CLAUDE.md` takes the pipeline diagram, which is the one thing in
`PostFX.ts` worth keeping.

### Phase 5 — `src/world/` (13 files, 2,507 comment lines, 45%)
Zones, terrain, interiors, vista. Highest density outside the leaf directories.
`src/world/CLAUDE.md` takes the zone lifecycle.

### Phase 6 — `src/audio/**` (76 files, ~5,300 comment lines)
Three commits, because the material differs:
- `audio/dsp/` (51%) and `audio/models/` (41%) — the physical-model derivations.
  Keep a one-line "what model this is" plus parameter units; delete the papers.
  `footsteps.ts` came from here, so Phase 1 already sets the bar.
- `audio/music/` + `instruments/` (28%/17%) — already the cleanest area; light
  pass.
- `audio/voice/`, `oneshots/`, `audition/`, `faust/` — light pass;
  `faust/built/` untouched.

### Phase 7 — `src/player/`, `src/life/`, `src/ui/**`, `src/content/`
(~2,300 comment lines). `player/` was mostly done in Phase 1; `life/` is already
at 20% and needs a skim; `ui/options/model.ts` and `content/notes.ts` (53%) are
the two that need work.

### Phase 8 — `src/debug/**` (45 files, 4,816 comment lines, ~35%)
Galleries and showcases. Deliberately last: it is scaffolding, nobody reads it to
understand the game, and it is the safest place to be aggressive. Gallery layout
files describe what they place — which is what the code already shows.

### Phase 9 — `src/main.ts`, `src/layers.ts` (535 comment lines, 41%)
Entry point. Late because it references every area and reads best once the areas
beneath it are settled.

### Phase 10 — `tools/` (8 files) *(moved out)*
The two footstep tools were done; the other six were not. Blocked on the
decision about the five check harnesses, which the no-checks rule says should
not exist at all — tidying files that are meant to go is wasted work. Carried
in `FUTURE-REFACTORS.md`.

Rough total: ~28,000 of the 36,400 comment lines expected to go, around 1.1 MB.

## 3. Area `CLAUDE.md` files

Written **only** where a reader needs orientation the code cannot give in a
name. Each is written during that area's phase, out of what the deleted comments
were trying to say — that is the point of writing them now, otherwise the
knowledge just goes.

**The same rules apply to these files**, stated at the top of each:

> Describe what this area is and how its pieces fit **now**. No history, no "we
> changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
> being true, edit the line — do not append a correction.

**Format, fixed:**

```
# <area>

<One or two sentences: what this directory is.>

## Files
<Only where the name is not enough. One line each. Not a table of contents.>

## Conventions
<Axes, origins, units, naming, the contract every file here keeps.>

## Adding a <thing>
<Only if there is a real recipe to follow.>
```

**Cap: 60 lines.** Longer means it is a design document and belongs in a root
`*.md` instead.

Proposed set:

| File | Carries |
|---|---|
| `src/art/CLAUDE.md` | The surface vocabulary: `Part`, `assemble`, `finish`, layers, palette/shade, the builder contract (`build(seed, scale)`), and the axis conventions everything obeys. Highest value of the set. |
| `src/art/builders/CLAUDE.md` | The one-object rule restated locally, the header-line format from Phase 3, registry registration, where a builder gets stone/wood/cloth from. |
| `src/art/recipes/CLAUDE.md` | What a recipe is, the uniform block it owns, how one is added. |
| `src/art/glsl/CLAUDE.md` | The snippet library: what each snippet provides and how it is injected. |
| `src/engine/CLAUDE.md` | The render pipeline: pass order, what runs at chunky resolution vs device resolution, where effects hook in. Takes the `PostFX.ts` diagram. |
| `src/world/CLAUDE.md` | Zone lifecycle; dressing vs interior vs terrain vs vista; portals and residency. |
| `src/audio/CLAUDE.md` | Engine, emitters, soundscape, and the split between `dsp/`, `models/`, `oneshots/`, `music/`, `voice/`. |
| `src/audio/dsp/CLAUDE.md` | The primitive set, one line each, and the calling convention. |
| `src/audio/models/CLAUDE.md` | One line per model naming the physical model it implements and its parameters. |
| `src/audio/music/CLAUDE.md` | Director → form → harmony → rhythm → instruments, and how a vibe is defined. |
| `src/audio/voice/CLAUDE.md` | Points at `VOICE.md`; states the presets-and-writers rule (no DSP branching). |
| `src/life/CLAUDE.md` | Creature, spec, gaits, legs, pose, spring — the rig contract. |
| `src/debug/CLAUDE.md` | What is scaffolding, how a gallery is added, that nothing here ships. |

**Not written:** `src/player/` (2 files), `src/content/` (1 file), `src/ui/` and
`src/ui/options/` (obvious from names), `src/audio/audition/`, `src/audio/faust/`
(the `.dsp` files are the documentation), `tools/`. An area gets a `CLAUDE.md`
when it earns one; a directory listing does not.

## Sequencing

Phase 0 first, then Phase 1 as a calibration diff for review. If the standard set
by Phase 1 is right, Phases 2–10 are mechanical and can run one commit per phase
without further review.
