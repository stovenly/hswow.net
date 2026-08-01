# Zone entry progress — spec

Not built. Written up while the reason for it was fresh, to be picked up later.

## The problem

Walking through a door into a zone that has never been entered builds its whole
world in one synchronous burst: every builder runs, every prop is placed, the
geometry is merged and the collider indexes the lot into an octree. The frame
loop is blocked throughout, so the browser cannot paint — the game simply stops,
for anywhere between a few hundred milliseconds and a couple of seconds.

The foliage gallery is the case that surfaced it: thirty-four rows of eight
instances, some of them trees costing five to seven thousand triangles apiece.
But it is not a gallery problem. Any zone dense enough will do it, and Arkstin
only escapes because `main.ts` deliberately prebuilds it at boot.

**There is already a progress bar and it cannot be reused.** `ui/Loader` runs the
boot sequence and then calls `done()`, which removes itself from the document.
It is also a full-screen takeover, which is right for boot and wrong for a
doorway.

## What it should do

- A zone that builds fast enough to be invisible must show **nothing at all**.
  Most doorways are already instant and putting a flash of UI on them would be a
  regression.
- A zone that is going to block should show a progress indicator **before** it
  starts blocking, not after.
- It should read as part of the transition rather than as an error. There is
  already a `Fade` between zones; this belongs inside it.

## Why it is not a one-line change

`ZoneManager.enter` is synchronous, and so is everything under it. Showing
progress requires the build to **yield to the browser part-way through**, which
means the work has to be broken into chunks that can be awaited — and that makes
`enter` async, which propagates to `use()`, `respawn()`, the boot sequence and
the debug panel's zone jumps.

Yielding is not optional and cannot be faked. A progress bar that is updated
inside a blocking loop never paints: the DOM changes are all coalesced into the
one frame that happens after the loop finishes, so the bar jumps from empty to
gone. This is the same trap `Loader.step` already documents — it awaits *two*
animation frames, because a single `requestAnimationFrame` callback fires before
the paint it belongs to.

## Shape of the work

1. **Make the build chunkable.** `ZoneManager.prepare` currently calls
   `zone.build()` once. It needs to become a sequence of steps that can be
   awaited between — at minimum: build geometry, add to scene, index the
   collider. The collider index is the single largest cost on a dense zone and
   is worth being its own step.

2. **Decide per zone whether to show anything.** Cheapest reliable signal is
   *has this zone been built before* — a cached zone is instant, a cold one is
   not. Prefer that over timing a build, which cannot be known in advance and
   would show the bar after the damage.

3. **A transition indicator, not the boot loader.** Small, inside the existing
   fade, sharing the CSS the loading bar already has. It should say what it is
   doing in the same register as the boot steps ("raising the wood").

4. **Async `enter`, threaded through.** `use()` is already async. `respawn()`
   and the debug jumps are fire-and-forget and can stay that way with a `void`.
   The boot sequence already awaits.

5. **Guard re-entry.** Once entering is async, a second `enter` can arrive while
   the first is still running — a player mashing a door, or a jump from the
   panel mid-transition. It must be safe: either ignore the second or cancel the
   first, and whichever is chosen must be stated in a comment, because the
   failure mode is two zones half-added to one scene.

## Cheaper things to do first

Both of these reduce the problem rather than reporting it, and both are worth
doing regardless:

- **Prebuild on approach.** A portal knows what is on its other side. Building
  the far zone when the player is near enough to read the door's tooltip would
  hide most of the cost behind ordinary walking, with no UI at all.
- **Reduce what the galleries cost.** Eight instances of every builder is a
  comparison tool, not a place, and the tree rows are the expensive part. Fewer
  instances of the costly ones, or a lower instance count for anything over some
  triangle threshold, would cut gallery build time substantially.

## Done when

Entering the foliage gallery from cold shows a progress indicator that actually
advances, the frame loop is never blocked for longer than about a frame at a
time, and entering a zone that has already been built shows nothing whatsoever.
