# Materials compile as needed, and never on the draw frame — spec

**Built through Step 5; Steps 6 and 7 await their own sign-off.** Walks the
finish stage back to a program per declared
mask — the reversal the two-programs commit reserved — and closes the two
paths where a compile can land on a frame the player is watching: entering a
cell with cold materials, and placing an item whose material this session has
never drawn. The worst case becomes a visible "compiling materials" line on a
loading surface, never a freeze.

**The short version.** A mesh's stamped `finishMask` picks a cached material
variant compiled with exactly those chunks, so a cottage holding one voidstone
orb compiles lean plus one field, not the everything-program. Zone entry
already compiles the root behind the fade and needs nothing new. Items warm at
acquisition through the icon queue's built mesh; a drop holds the mesh out of
the scene for the frames a cold program needs. All waiting is done by polling
`KHR_parallel_shader_compile` — the browser's main thread is never asked to
block on a link.

---

## Why the browser froze, and why it stops

`gl.compileShader`/`linkProgram` return immediately; the stall is wherever
link status is first *forced* — a status query, or a draw with an unlinked
program. Today the everything-program (nine recipe fields spliced twice, plus
horror and glitch) is forced on the first frame that shows a finished mesh.
Two fixes compound:

- **Smaller programs.** Per-mask variants are lean-plus-one-field for every
  single-finish item; the all-nine program stops existing.
- **Never force.** three's `compileAsync` polls `COMPLETION_STATUS_KHR` once a
  frame and resolves when the driver finishes on its own threads. Everything
  below waits that way; nothing draws a program that has not reported ready.
  Where the extension is missing (rare on desktop), the fallback forces at
  most one program per frame — and the programs are small, which is the real
  defence.

## Step 1 — a material per mask

`dressArtMesh` stops choosing between two materials and takes one from a
cache keyed by `finishMask` (0 stays the lean material, unchanged). A variant
is created on first request and patched exactly as the finished material is
today — sway, wear, detail, `applyFinish(mask)`, glitch, horror, fog — with
the mask in its program cache key, as `applyFinish` already writes.

- Placed items are separate meshes, so a house full of collected finery needs
  the *set* of small programs, never their union in one.
- Zone entry needs no new code: meshes carry their final materials when
  `enter()` runs its existing `compileAsync` behind the fade.
- The gallery wings compile their fields one small program at a time behind
  the same fade.
- `ART_FINISHED_MATERIAL` retires. The mask population in practice is the
  single-field masks plus the few unions authored props declare; the cache is
  bounded by what content actually uses.

*Done when* the cottage with the voidstone orb loads behind an ordinary fade,
the materials wing still shows every finish, and no program containing more
than one uninvoked recipe field exists.

## Step 2 — warm at acquisition

A player can only place what they first acquired, so acquisition is the warm
window. The icon queue already builds every acquired item's mesh off-budget:
after that build, read the mesh's `finishMask`; if its variant has not
compiled against the live scene this session, kick a background
`compileAsync` for it there (the icon scene's own rig compiles separately and
warms nothing but icons). Pickup, container-open and save-load warming all
ride the queue that already exists.

*Done when* acquiring a first-ever voidstone item starts its program
compiling within a frame or two of the pickup, with no lengthened frame.

## Step 3 — gate the drop

`ItemWorld.drop` and `move` check the variant's compile state before
`root.add`. Ready — lands as today. Cold — the mesh joins the scene when the
poll resolves, typically a few frames, covered by the drop sound. The delta
records the drop immediately either way; only the visual waits.

*Done when* dropping a first-ever voidstone item in a lean zone never
lengthens a frame, and the item appears within a beat of the sound.

## Step 4 — name the wait at boot

The loader gains a `compiling materials` step wherever entry compiles run
behind the bar — the boot flow, and the title flow once that exists.

*Done when* a fresh session booting into a zone with finished meshes shows
the step, and the bar keeps moving while the driver works.

## Step 5 — name the wait on a load

If a fade's compile await runs past ~250 ms, the fade shows a small
`compiling materials…` line until it resolves. First session on a fresh
driver cache, the fully stocked house reads as a slightly long, labelled
load — once. Chrome's disk program cache covers the sessions after.

*Done when* a cleared GPU cache plus a loaded museum-house shows the line,
stays responsive (the tab animates, the browser never beachballs), and the
second load of the same save shows nothing.

## Step 6 — shrink the variants (separate sign-off)

Split glitch and horror out of gameplay variants so masks stop multiplying by
corruption states they never show.

*Done when* a gameplay zone's variant programs carry no corruption chunks and
the industrial zones still corrupt.

## Step 7 — audit the heavy recipes (separate sign-off)

Audit the heavy recipe GLSL (voidstone's cell field, evaluated twice) for
compile-hostile constructs, to lower the ceiling on any one link.

*Done when* the slowest single program link is measurably shorter and every
look is visually unchanged.

## What this is not

- Not the old variant probe: no deferred material swaps on world meshes, no
  invisible probe object, no second dressing pass. A zone mesh has its final
  material from birth; only a *dropped item* can briefly exist unshown.
- Not a change to looks: a look stays a uniform row, and new gems or weapons
  on existing fields still cost zero programs.
