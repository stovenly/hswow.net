# Antialiasing — spec

**Not built.** This document is the plan. Names are proposals — `antialias`,
`samples`, `setAntialias`, `setSamples` — and so is the filename.

**The short version:** the world is rasterised at a fraction of display
resolution with one coverage sample per pixel, so anything thinner than a chunky
pixel either wins its sample or vanishes. Multisampling the one target the scene
is drawn into fixes that, costs about a quarter of a full-resolution render, and
leaves the pixelation, the ink lines and the whole effect chain untouched.

## The problem

`PixelStage` renders the scene into `colourTarget` at `width / pixelSize`, with
`NearestFilter`, and point-magnifies the result back up. `pixelSize` is authored
in CSS pixels and multiplied by device pixel ratio (`PostFX.apply`), so:

| DPR | `pixelSize` | Chunky pixel | Scene rasterised at |
|---|---|---|---|
| 1 | 2 | 2 device px | 1/2 per axis, 1/4 the pixels |
| 2 | 2 | 4 device px | 1/4 per axis, **1/16 the pixels** |

One sample per chunky pixel, no filtering. Every silhouette is a hard staircase,
and any feature narrower than a chunky pixel is a coin toss against that
sample's position. Rotate the camera and the coin re-flips every frame.

### It is coverage aliasing, not shading aliasing

This matters, because it decides which fix works.

The two symptoms that prompted this — the gaps between floorboards, and the thin
lit edges of a crate — are both **geometry**. Planks are built as separate boxes
at `0.94` of their pitch (`art/builders/hut-door.ts:195`, and the same shape in
`signboard.ts`), so a floorboard gap is a real 6%-of-a-plank hole with the
surface behind it showing through. It is a triangle boundary, not a colour
gradient painted on a flat quad.

Sub-pixel triangle boundaries, sampled once per pixel, marching across a
regular pattern as the camera turns, is the textbook cause of moiré. It is also
precisely what multisampling is for: MSAA evaluates *coverage* at several points
per pixel while shading once per triangle, so a gap covering a quarter of a
chunky pixel resolves to a quarter blend instead of all-or-nothing.

Had the boards been vertex-coloured stripes on one continuous quad, MSAA would
have done nothing and this document would be specifying supersampling instead.

### Two things that are not the answer

- **`antialias: false` on the `WebGLRenderer`** (`Viewport.ts:30`) is a red
  herring. It applies to the default framebuffer, and nothing renders there —
  every pass goes through `EffectComposer` targets. Flipping it changes nothing.
- **FXAA, SMAA or TAA at output resolution** would filter *across* chunky-pixel
  boundaries, which dissolves the pixelation. That is the look, and
  `setPixelation` already exists for people who want it off.

What is wanted is antialiasing *inside* a chunky pixel: each block becoming an
honest average of the geometry it covers. Blocks stay blocks.

## The change

`samples` on **`colourTarget` only**.

- **Not `normalTarget`.** It feeds the edge detector, and an averaged normal
  across a silhouette reads as a *smaller* discontinuity — the ink lines would
  soften or wash out. Left alone, the outlines are byte-identical to today's.
  See *Open questions*.
- **Not the `ping` pair.** Those are written by fullscreen quads. There is no
  coverage to sample.

In `PixelStage`'s `chunky()` factory the colour target gains a sample count, and
the class gains a setter:

```ts
setSamples(samples: number): void {
  if (this.colourTarget.samples === samples) return;
  this.colourTarget.samples = samples;
  // Three allocates the multisampled framebuffer once, in `setupRenderTarget`,
  // and nothing tells it the count moved. Disposing drops the allocation and
  // the next `setRenderTarget` builds it again at the new count.
  this.colourTarget.dispose();
}
```

`PostFX.apply` clamps and drives it, the way it already drives `pixelSize`:

```ts
const wanted = this.antialias ? s.samples : 0;
this.pixelStage.setSamples(
  Math.min(wanted, this.viewport.renderer.capabilities.maxSamples),
);
```

**One thing to verify on the first run:** whether `colourTarget.dispose()` also
tears down the `DepthTexture` hung on it. If it does, `setSamples` rebuilds the
target and the depth texture together and calls `setSize` — slightly more code,
same shape, and every consumer already receives these textures per-frame through
the effect context rather than holding them, so a rebuild is safe.

## What three actually does with it

Worth writing down, because the interesting part is not a gamble — it is
determined, and it was read out of `three@0.170`.

`colourTarget` carries an **external** `DepthTexture`. Three explicitly refuses
the `WEBGL_multisampled_render_to_texture` path when it sees one
(`three.module.js:31113`: *"Render-to-texture extension was disabled because an
external texture was provided"*) and falls back to a multisampled renderbuffer
plus an explicit `blitFramebuffer` resolve.

That resolve moves depth as well as colour — `resolveDepthBuffer` defaults to
`true` (`RenderTarget.js:37`) and the blit mask picks up `DEPTH_BUFFER_BIT`
whenever the target has a depth buffer (`three.module.js:26255`).

Two consequences:

1. **Depth stays sharp.** A depth blit from a multisampled source resolves to
   one sample rather than an average. So GTAO, fog, water and the edge detector
   receive exactly the depth they receive today. This is what we want — an
   averaged depth at a silhouette is a surface that exists nowhere.
2. **Colour and depth now disagree at an edge, by design.** A chunky pixel
   straddling a silhouette gets a *blended* colour and a *single-surface* depth.
   Anything compositing on depth applies a front-surface decision to a colour
   that is partly the background. At a 6%-wide floorboard gap this is invisible.
   At a silhouette against distant fog it could show as a one-block halo. This
   is the thing to go looking for, and it is the reason the toggle exists as
   much as performance is.

On desktop the extension three is refusing is usually not present anyway, so the
console warning may never appear. It is not an error either way.

## The toggle

SHADERS.md's rule (*Player options*, line 432): **an option is something a
player may reasonably want off — for performance or comfort — while the world
still reads as itself without it.** Antialiasing qualifies on both counts: real
per-frame cost, and nothing is lost but smoothing.

So, following the `dither` / `pixelation` / `ambientOcclusion` pattern exactly:

| Where | What | Why there |
|---|---|---|
| `options.antialias` | one boolean, Video tab | One honest switch. Not a quality ladder — SHADERS.md line 449, and it would be two controls for one thing on screen. |
| `RenderSettings.samples` | the count, default 4 | The developer's dial, beside `ao.strength` and `bloom.radius`. Clamped to `capabilities.maxSamples`, typically 8 on desktop. |

Files, and one line in each:

- `src/engine/PixelStage.ts` — `samples` on `colourTarget`, `setSamples`.
- `src/engine/PostFX.ts` — `samples` in `RenderSettings` and `DEFAULT_RENDER`,
  an `antialias` field, `setAntialias`, and the clamp in `apply`.
- `src/ui/options/model.ts` — `antialias: boolean` in the interface, `true` in
  the defaults, `{ kind: 'toggle', key: 'antialias', label: 'antialiasing' }` in
  the video rows.
- `src/ui/options/apply.ts` — `postfx.setAntialias(options.antialias)`.
- `src/main.ts` — `look.add(r, 'samples', 0, 8, 1)` in the `look` folder.

## Cost

The scene is rendered twice per frame — once for colour, once with
`MeshNormalMaterial` for the edge detector. **Only the colour render is
multisampled**, so the normal render is unchanged.

At DPR 2 with `pixelSize` 2, the colour render covers 1/16 of the device pixels.
Four samples on that is about **a quarter of one full-resolution single-sampled
render**, plus a resolve blit. At DPR 1 it is roughly the cost of one
full-resolution render.

The expensive part of the frame — GTAO, fog volumes, particles, bloom — runs on
the resolved chunky texture and does not move at all.

## Risks

- **`RGBA16F` multisampled renderbuffer.** The chunky targets are
  `HalfFloatType`. Multisampled renderbuffer storage in that format needs
  `EXT_color_buffer_float` on WebGL2 — near-universal on desktop, and desktop is
  the only target (mobile was dropped). If it is missing, three will fail loudly
  rather than quietly, which is the good failure.
- **The depth/colour disagreement** described above.
- **Moiré will reduce, not vanish.** Four coverage samples cannot resolve a
  board pattern running several periods per chunky pixel at distance; the
  pattern is below Nyquist and stays below it. MSAA moves the threshold out, it
  does not remove the frequency. See below.

## What this does not fix, and what would

The complete cure for moiré is removing the high frequency where it cannot be
sampled — which is what a mipmap does for a texture, and which vertex-coloured
geometry has no equivalent of. The hand-rolled version is to fade board-to-board
contrast toward its own mean with distance, in the shader.

Deliberately **not** in this change. It is a separate mechanism with its own
authoring question (which props have a "mean colour" worth fading to, and who
supplies it), and it is only worth building if the moiré still reads badly once
the coverage is being sampled honestly. Judge it after, not before.

## Verification

Headless checks cannot exercise this — there is no GPU in `check:art`, and MSAA
is invisible to everything except a rendered frame. What *can* be asserted is
the plumbing, which is where the silent failures are:

- `setSamples` clamps to `capabilities.maxSamples` and never sets a count the
  driver will reject.
- The toggle reaches the target: `antialias: false` leaves `colourTarget.samples
  === 0`. A toggle that silently does nothing is the failure mode
  `a toggle means a toggle` exists to prevent.

The rest is by eye, against the two cases that prompted it:

1. **The village interior floorboards**, turning on the spot. This is the moiré
   case and the one that decides whether the change was worth it.
2. **A crate lit from above**, for the thin lit batten faces.
3. **A silhouette against distant fog**, looking specifically for a one-block
   halo — the depth/colour disagreement.
4. **Bloom and the ink lines**, to confirm both are unchanged. They should be
   exactly unchanged; if they are not, something is multisampling that should
   not be.
5. **A/B with the toggle**, which is the whole reason it goes in with one.

## Left for you

- The names above, and this filename.
- The default sample count: 4 is proposed, 8 is free to try on desktop.
- Whether `normalTarget` should be multisampled too, once the surfaces are
  smooth and the outlines are the remaining hard thing on screen.
- Whether `antialias` should default on. Proposed yes — it is a fidelity
  improvement with a modest cost, and the switch is there for anyone whose
  machine disagrees.
