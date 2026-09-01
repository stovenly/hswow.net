# A glowing thing may not sample the depth it is drawn against — spec

**Built through Step 3. Step 4 is a reading from the world.** Removes the `GL_INVALID_OPERATION: Feedback loop
formed between Framebuffer and active Texture` raised on every frame that
draws a star sparkle or an emissive particle, by splitting those draws so no
shader samples a texture that is bound as the current target's depth
attachment.

**The short version.** The bloom emitters pass binds the scene's depth texture
as the depth attachment of its own target, so an emitter behind a wall fails
the test and never reaches the blur. Two art systems draw on `GLOW_LAYER` with
materials that *sample* that same depth texture, which is a feedback loop.
Each becomes two meshes over one shared geometry: the particle-pass copy keeps
the manual depth sample, the glow-pass copy drops it and depth-tests against
the attachment the bloom pass already binds.

---

## The fault

- `Bloom.ts` sets `this.emitters.depthTexture = context.depth` and renders the
  scene with the camera on `GLOW_LAYER`.
- `art/sparkle.ts` puts its mesh on `PARTICLE_LAYER` **and** `GLOW_LAYER`, and
  its material samples `tDepth` for the all-or-nothing test at each star's
  centre.
- `art/particles.ts` does the same wherever `spec.emissive` is set.

So in the bloom pass those materials sample the texture attached to the
framebuffer being drawn into. WebGL says so once per draw; Chrome reports 256
and then stops, but the invalid draw keeps happening — the sparkle mesh sets
`frustumCulled = false`, so it draws every frame whether or not a star is in
front of the player.

**Why the manual sample exists at all**, and why it cannot simply be deleted:
the particles pass renders into a ping target carrying its own depth
renderbuffer, not the scene's, so there is no attachment there to test
against. That pass genuinely needs the sample. The bloom pass genuinely needs
the attachment, because `art/glow.ts` and `art/bolt.ts` meshes depth-test
normally and sample nothing. Neither pass is wrong; one mesh cannot serve both.

## Step 1 — a glow variant of the sparkle material

`art/sparkle.ts` gains a second material: the same vertex shader, a fragment
shader with the `tDepth` sample and the centre test removed, `depthTest: true`
and `depthWrite: false`. `buildZoneSparkles` returns a group of two meshes over
one `InstancedBufferGeometry` — one on `PARTICLE_LAYER` with the existing
material, one on `GLOW_LAYER` with the variant.

*Done when* a zone holding a gilt or nacreous prop raises no GL error, the
stars still bloom, and a star behind a wall is still hidden in both passes.

## Step 2 — the same for emissive particles

`art/particles.ts` splits an emissive system the same way. The rule it is
following, stated once where a reader will meet it: **a mesh on `GLOW_LAYER`
may not sample `tDepth`.**

*Done when* an emissive particle system raises no GL error and looks unchanged.

## Step 3 — one geometry, one owner

Two meshes share one geometry, so exactly one path may dispose it.
`Zone.dispose`, `ZoneManager.refreshSparkles` and the particle teardown all
free per-mesh today and would double-free. Disposal moves to the group, or the
second mesh is marked as borrowing.

*Done when* entering, leaving and re-entering a zone with sparkles repeatedly
leaves `renderer.info.memory.geometries` flat.

## Step 4 — confirm it was costing something

With the errors gone, re-read the frame timing. An erroring instanced draw
every frame is a plausible source of judder that leaves `requestAnimationFrame`
cadence untouched — which is the shape of the choppiness reported against a
steady 120 fps readout.

*Done when* the 1% low and the GPU pass timings are compared before and after,
and the result is written down either way. Outstanding: the comparison is a
report from the running game, not something the code can answer.

## What this is not

- Not dropping `GLOW_LAYER` from the sparkles. That removes the bloom from the
  star cores, which is a change to the look and not a bug fix.
- Not a change to the bloom pass. Borrowing the scene depth is what stops a
  spark behind a wall blooming through it, and every other emitter depends on
  it.
- Not a copy of the depth texture per pass. It fixes the error by spending
  bandwidth on a problem that a second material solves for nothing.
