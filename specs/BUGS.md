# Bugs

A temporary list, kept here until there is a real tracker. One heading per bug:
what is wrong, where it lives, and what fixing it means. Delete an entry when it
is fixed — this file is a queue, not a record.

---

## Flicker and headshake ignore reduced motion

`reducedMotion` is an accessibility control and the two effects most likely to
hurt somebody do not read it. Glitch's flicker-class effects and horror's
`headshake` are rate-capped in the shader and tuned conservatively, which is a
mitigation and not the switch.

- Glitch: `GLITCH-SHADERS.md` §8.3 specified photosensitivity damping and it was
  never wired. The hook is `effective()` and `apply.ts`.
- Horror: the same gap, same place, for `headshake` and the flicker in `drain`.

The water and the recipe clocks already read the switch, so the plumbing exists
and this is a matter of two more readers.

**Fix means:** with reduced motion on, no effect in either family flashes or
shakes above the rate the option promises — and it is off by the option, not by
a conservative constant.
