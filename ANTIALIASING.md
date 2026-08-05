# Antialiasing

**Built.** Names are `antialias` (the player's switch), `RenderSettings.samples`
(the count), `PostFX.setAntialias`, `PixelStage.setSamples`. Change any of them
freely; nothing outside the five files below reads them.

**The short version:** the world is rasterised at a fraction of display
resolution with one coverage sample per pixel, so anything thinner than a chunky
pixel either wins its sample or vanishes. Multisampling the one target the scene
is drawn into fixes that and leaves the pixelation, the ink lines and the whole
effect chain untouched.

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
lit edges of a crate — are both **geometry**. A village interior lays each board
as its own box with a seam of bare slab between them (`world/interior.ts`, the
`planks` block), so a floorboard gap is a real hole with the dark slab showing
through. It is a triangle boundary, not a colour gradient painted on a flat
quad. The same is true of a plank door (`art/builders/hut-door.ts:195`) and of
any lit box edge against a darker surface behind it.

Sub-pixel triangle boundaries, sampled once per pixel, marching across a regular
pattern as the camera turns, is the textbook cause of moiré. It is also
precisely what multisampling is for: MSAA evaluates *coverage* at several points
per pixel while shading once per triangle, so a gap covering a quarter of a
chunky pixel resolves to a quarter blend instead of all-or-nothing.

Had the boards been vertex-coloured stripes on one continuous quad, MSAA would
have done nothing and this would have been a supersampling change instead.

### Two things that are not the answer

- **`antialias: false` on the `WebGLRenderer`** (`Viewport.ts:30`) is a red
  herring. It applies to the default framebuffer, and nothing renders there —
  every pass goes through `EffectComposer` targets. Flipping it changes nothing.
- **FXAA, SMAA or TAA at output resolution** would filter *across* chunky-pixel
  boundaries, which dissolves the pixelation. That is the look, and
  `setPixelation` already exists for people who want it off.

What is wanted is antialiasing *inside* a chunky pixel: each block becoming an
honest average of the geometry it covers. Blocks stay blocks.

## What shipped

`samples` on **`colourTarget` only**.

- **Not `normalTarget`.** It feeds the edge detector, and an averaged normal
  across a silhouette reads as a *smaller* discontinuity — the ink lines would
  soften or wash out. Left alone, the outlines are byte-identical to before.
  See *Left for you*.
- **Not the `ping` pair.** Those are written by fullscreen quads. There is no
  coverage to sample.

| File | What |
|---|---|
| `src/engine/PixelStage.ts` | `setSamples`, and a `samples` getter for the check. |
| `src/engine/PostFX.ts` | `samples` in `RenderSettings` and `DEFAULT_RENDER`, `setAntialias`, and `resolveSamples`. |
| `src/ui/options/model.ts` | `antialias` in `Options`, defaulted on, and its row in the Video tab. |
| `src/ui/options/apply.ts` | `postfx.setAntialias(options.antialias)`. |
| `src/main.ts` | The switch and the count in the `look` folder. |

### Why `setSamples` disposes, and why it detaches first

Three allocates a target's multisampled framebuffer once, in `setupRenderTarget`,
and nothing tells it the sample count moved. Disposing drops the allocation and
the next `setRenderTarget` builds it again at the new count.

But `deallocateRenderTarget` also does this
(`three.module.js:24642`):

```js
if ( renderTarget.depthTexture ) {
    renderTarget.depthTexture.dispose();
    properties.remove( renderTarget.depthTexture );
}
```

— and bloom has that same depth texture bound as the depth attachment of its
*own* target, so that a lamp inside a hut is occluded by the hut. Bloom's target
has not changed, so three would not rebuild it, and it would go on pointing at a
texture that no longer exists. The symptom would land in bloom, in a zone with
no antialiasing question in it at all.

So the depth texture is set aside across the dispose and put back after:

```ts
this.colourTarget.samples = samples;
this.colourTarget.depthTexture = null;
this.colourTarget.dispose();
this.colourTarget.depthTexture = this.depthTexture;
```

On rebuild, `setupDepthTexture` finds `__webglTexture` already there and the
image dimensions unchanged, so it re-attaches rather than re-uploading
(`three.module.js:25802`).

This is not a problem on resize, which is the other path that disposes the
colour target: `PixelStage.setSize` resizes every effect too, so bloom's target
is disposed in the same breath and rebuilds against the new depth texture.

## What three actually does with it

Two paths, and which one runs depends on a single extension:

```js
function useMultisampledRTT( renderTarget ) {
    return renderTarget.samples > 0
        && extensions.has( 'WEBGL_multisampled_render_to_texture' ) === true
        && renderTargetProperties.__useRenderToTexture !== false;
}
```

**Correcting an earlier claim here:** the plan said three refuses the
render-to-texture path whenever it sees an external `DepthTexture`. It does not.
That `__useRenderToTexture = false` is set only inside
`renderer.setRenderTargetTextures` (`three.module.js:31110`), which this pipeline
never calls — assigning `target.depthTexture` directly does not go near it. So
the path is chosen purely on extension availability, which on desktop WebGL2
generally means the extension is absent and the blit path runs.

**Blit path** (no extension). Three keeps a multisampled colour renderbuffer and
a multisampled depth renderbuffer, renders into those, and resolves both into
the single-sample framebuffer with `blitFramebuffer`. `resolveDepthBuffer`
defaults true and the mask picks up `DEPTH_BUFFER_BIT` whenever the target has a
depth buffer (`three.module.js:26255`).

**Extension path.** `framebufferTexture2DMultisampleEXT` attaches the colour and
depth textures directly with an implicit resolve at end of pass.

Either way, two consequences:

1. **Depth stays sharp.** A depth resolve picks one sample rather than averaging.
   GTAO, fog, water and the edge detector receive the depth they received
   before. This is what we want — an averaged depth at a silhouette is a surface
   that exists nowhere.
2. **Colour and depth now disagree at an edge, by design.** A chunky pixel
   straddling a silhouette gets a *blended* colour and a *single-surface* depth.
   Anything compositing on depth applies a front-surface decision to a colour
   that is partly the background. At a hairline floorboard seam this is
   invisible. At a silhouette against distant fog it could show as a one-block
   halo. This is the thing to go looking for, and it is the reason the toggle
   exists as much as performance is.

## The outline itself — graded thresholds

Once the floor was quiet, the remaining jagged lines were the outlines, on any
prop built from planks with real gaps between them: tables, dressers, doors.
Not moiré in the surface — the edge detector drawing staircases.

The cause was structural. The shader arrived from `RenderPixelatedPass`
binarising the same signal **three times over**:

```glsl
float depthIndicator  = clamp(sign(depthDiff * .25 + .0025), 0.0, 1.0);
float normalIndicator = clamp(smoothstep(-.01, .01, normalDiff), 0.0, 1.0);
...
return step(0.1, indicator);
```

The one genuinely continuous quantity in there is `1.0 - dot(normal,
neighborNormal)` — how sharply the surface turns. It was multiplied by two
near-binary gates and then thresholded, so a pixel a third covered by an edge
got exactly the same 50% brightening as one fully covered. **That is an outline
that cannot be antialiased**, however well the rest of the frame is sampled, and
it is why a diagonal came out a staircase. The depth edge did it too, one step
gentler: `floor(smoothstep(0.01, 0.02, diff) * 2.) / 2.` quantised to three
values.

So `sign` and `step` became `smoothstep` at the same crossing points, and the
`floor(… * 2.) / 2.` came out. A hard 90° edge still reads 1.0 from a single tap
and is unchanged; what grades is everything shallower and everything partly
covered, which is the whole of the staircasing. Free — same instruction count.

`normalIndicator` stayed binary **deliberately**. It is not a strength, it picks
*which side* of an edge draws the line; graded, both sides draw and every
outline in the game comes out double.

This knowingly breaks R0's contract that the stage produce the same picture the
upstream pass did, and every outline in the game moves with it. Both stale
"lifted verbatim / nothing in here is ours to improve" comments in
`PixelStage.ts` were corrected in the same pass.

Not covered by a check: the edge pass is invisible to anything without a GPU,
and unlike the sample plumbing there is no seam here where a silent failure
could hide — the change is four constants in one shader, and it is either on
screen or it is not.

### The sky was riding the edge strength

Found by turning `normalEdgeStrength` down and watching the *sky* dim with it.
Nothing to do with the grading — it was there under the binary thresholds too.

`PostFX.apply` sets the renderer's clear colour to the fog colour, which is
right for the colour pass: with the sky dome off, every pixel the geometry
misses has to be fog or an interior is a lit room floating in blue. But there is
one clear colour and two render targets, and the normal pass was getting it as
well. The sky dome does not survive that pass either — `scene.overrideMaterial`
replaces the material wholesale, so the sphere loses its `BackSide` and is
culled from inside — so every open-sky pixel in the normal buffer held the fog
colour, which `getNormal` decodes to a vector 0.66 long. The detector's quantity
is `1 - dot(normal, neighborNormal)`, and a short vector reads as a turn even
where the buffer is uniform: 0.56 a tap, 1.12 over four, well past any
threshold. The whole sky was being multiplied by `1 + normalEdgeStrength`.

The normal target now takes its own clear — `FLAT_NORMAL`, the packed `(0, 0, 1)`
— borrowed and given back around the render, the same shape `Bloom.renderEmitters`
uses. Unit length, so an empty region contributes exactly nothing. Silhouettes
against the sky are unaffected: `dei > 0` on the geometry side, and the ternary
takes the depth branch there before the normal term is ever consulted.

This one *is* covered by a check — `nothing in the normal buffer is not an edge`
in `world-check` decodes the constant and runs the uniform-region case through
the shader's arithmetic. Verified by pointing it at the horizon colour, which
reports the 0.663 and the 1.12 above.

The sky came out genuinely dimmer, having lost a multiply it should never have
had, so `DEFAULT_SKY`'s three gradient colours carry it now: `#bcd4e6 → #cce6f9`,
`#3f7fbf → #458acf`, `#5d6469 → #656d72`, each scaled 1.2 in linear. The
compositing in `skyColour` is `mix` throughout and `mix` is linear in its
inputs, so scaling the inputs is the same picture the multiply produced.

`cloudColor` and `sunColor` were left alone. Scaled they clip — `#f2f5f8` to
pure white, `#fff6e0` to `#fffff3` — and there is no tone mapping in the
pipeline, so they were already clipping on screen under the old multiply. Baking
that in would write a rendering artefact into the art direction and lose the
warm sun the day an exposure control exists.

The fog follows the horizon through `linkFogToSky`, which is the point rather
than a side effect: the multiply hit the sky and not the geometry fading into
it, so those two had been disagreeing by 20% at the horizon the whole time.

### Considered and not done

- **Eight taps instead of four.** The detector samples a 4-neighbour cross, so a
  45° edge is sampled by two axis-aligned neighbours and staircases by
  definition. Costs 8 more fetches per chunky pixel. Worth revisiting if graded
  thresholds alone leave diagonals reading badly.
- **Footprint attenuation on the normal edge.** The detail fade's principle
  applied to lines: derive the surface footprint from the depth buffer and stop
  outlining detail once it is sub-pixel, leaving the depth edge alone so
  silhouettes survive at any range. Needs the depth buffer linearised and the
  camera's near and far as uniforms.

## The toggle

SHADERS.md's rule (*Player options*, line 432): **an option is something a
player may reasonably want off — for performance or comfort — while the world
still reads as itself without it.** Antialiasing qualifies on both counts: real
per-frame cost, and nothing is lost but smoothing.

| Where | What |
|---|---|
| `options.antialias` | One boolean, Video tab, on by default. One honest switch — not a quality ladder (SHADERS.md line 449), which here would be two controls for one thing on screen. |
| `RenderSettings.samples` | The count, default 4, on the developer's dial beside `ao.strength` and `bloom.radius`. |

`resolveSamples` is where the two meet, and it is a separate exported function
so a headless run can check it. Off returns 0. Anything over `maxSamples` comes
back as `maxSamples`. Anything under 2 comes back as 0 — one sample is a
multisampled framebuffer with nothing to average, which is an expensive way to
change nothing.

## Cost

The scene is rendered twice per frame — once for colour, once with
`MeshNormalMaterial` for the edge detector. **Only the colour render is
multisampled**, so the normal render is unchanged.

What multiplies is rasterisation, depth testing and the bandwidth of a 4×
renderbuffer, plus one resolve blit. **Shading does not**: MSAA shades once per
triangle per pixel, which is the whole reason it is the right tool here. At DPR
2 with `pixelSize` 2 the colour render covers a sixteenth of the device pixels,
so four samples on it is four sixteenths — a quarter of a full-resolution
frame's *coverage* work, at a sixteenth of a full-resolution frame's shading
work.

The expensive part of the frame — GTAO, fog volumes, particles, bloom — runs on
the resolved chunky texture and does not move at all.

## Risks

- **`RGBA16F` multisampled renderbuffer.** The chunky targets are
  `HalfFloatType`. Multisampled renderbuffer storage in that format needs
  `EXT_color_buffer_float`, which three requests at start-up
  (`three.module.js:17539`) and which is near-universal on desktop — and desktop
  is the only target, mobile having been dropped. If it is missing, three fails
  loudly rather than quietly, which is the good failure.
- **The depth/colour disagreement** described above.
- **Moiré reduces, it does not vanish.** Four coverage samples cannot resolve a
  board pattern running several periods per chunky pixel at distance; the
  pattern is below Nyquist and stays below it. MSAA moves the threshold out, it
  does not remove the frequency. See below.

## What multisampling does not fix — `art/detail.ts`

The complete cure for moiré is removing the high frequency where it cannot be
sampled, which is what a mipmap does for a texture and which vertex-coloured
geometry has no equivalent of. This was deferred out of the first change on the
grounds that it should be judged after coverage was being sampled honestly
rather than before. It was, it still shimmered, and it is now built.

**The idea.** Each part declares the size of the feature it *is*, in metres, and
what it looks like from far enough away that you cannot tell it apart from its
surroundings. The shader crossfades between the two. Close up you see boards and
seams; far off you see one timber; nothing in between is ever resolved from a
sample too coarse to resolve it.

**Why `fwidth` and not view distance.** The obvious trigger is distance, and it
is wrong in exactly the case that matters — a floor is not viewed head-on. At a
shallow angle one chunky pixel covers far more surface than its distance
suggests, which is why the shimmer is worst toward the far wall rather than in a
ring around you. A distance fade would under-fade precisely where it is needed.
`fwidth` of the view-space position is the metres of surface under one chunky
pixel, there, at that angle: the same quantity the GPU uses to pick a mipmap
level, one instruction, and spatial-only, so it stays inside SHADERS.md's ground
rule 3.

**Why per part and not per surface.** A floor carries a 9 mm seam and a 290 mm
board on the same plane, and they stop being resolvable at ranges thirty times
apart. The seam dissolves while the board-to-board variation is still perfectly
clear. One global fade range could not tell them apart.

| | declares | fades to | starts |
|---|---|---|---|
| seam strips | 9 mm | `style.floor` | ~2 m, gone by ~7 m |
| board strips | ~290 mm | `style.floor` | ~50 m — never, indoors |

**The mechanism** is a third instance of a pattern the kit already runs twice:
a per-vertex attribute baked by `assemble`, and an `onBeforeCompile` patch on the
shared `ART_MATERIAL` that wraps what is already there.

| | attributes | patch |
|---|---|---|
| sway | `sway` | `applySway` |
| weathering | `wear`, `wearTint` | `applyWear` |
| detail | `detail`, `detailTint` | `applyDetail` |

Anchored on `#include <alphamap_fragment>` rather than on `<color_fragment>`,
because weathering has already replaced that chunk — landing on it again would
put the fade *above* the wear block, and a rusted patch would then hold full
contrast into the distance while the surface under it dissolved. Sparkle on
rust, pointing nowhere near here.

Two dev dials in `look`, in pixels per feature: `detail.start` (where a feature
begins to dissolve — 1 is "as soon as it is narrower than a pixel") and
`detail.span` (how many times wider the pixel gets before it is gone). `span`
settled at **16** by eye — four octaves, considerably wider than the two
trilinear filtering uses between mip levels. A short ramp puts a visible ring on
the floor where the seams give out, and nothing on screen should announce where
the detail went. **No player option** — the cost is one `fwidth`, one
`smoothstep` and one `mix` behind an early-out, and a switch nobody would turn
off is not a switch.

Cost: two attributes per vertex, the same as weathering. Opt-in, so today
exactly one surface in the game uses it and everything else is byte-identical.

The village interior's floorboard seam narrowed from 12 mm to 5 mm in the same
pass. That is a separate lever and an honest one: a 12 mm gap on a 290 mm board
is a hard black grid about a chunky pixel wide, which is exactly the width that
shimmers. It reduces the *contrast* of the pattern where MSAA improves how the
pattern is *sampled*, and the two compound.

## What was actually left, once this shipped

Neither of the above. **It was the ink lines**, and it was confirmed by dropping
`normalEdgeStrength` to 0 in the `look` folder, at which point the floor went
quiet.

Each board was a box 30 mm thick with its top at `y = 0`, sitting 6 mm above the
slab — so every seam was a slot with **6 mm of vertical board side-wall** in it.
In the normal buffer that wall is a 90° discontinuity against the floor, which
`normalEdgeIndicator` resolves through `step(0.1, …)` to `1 + 0.5 × 1`: a 50%
brightening, all-or-nothing per chunky pixel, re-decided every frame as the
camera turns. A shimmering grid of outlines, on the one surface you sweep across.

Three reasons nothing above touched it:

- The normal target is deliberately **not** multisampled, so the samples do not
  reach it.
- The decision is a hard threshold, so there is no partial coverage to average
  even if they did.
- Narrowing the seam made the slot **narrower** and left it exactly as **deep**.
  Near the horizon the floor foreshortens and a 6 mm wall does not, so the walls
  are most of what is being sampled there.

**The fix is geometric.** Boards and seams now tile the floor edge to edge, each
as its own box with its top at `y = 0`, and the seam is the same near-black
`floorSeam` colour painted rather than cut. The floor has no vertical faces in
it, so there is no normal step for the detector to find, and the outlines
everywhere else in the game are untouched. The trade is that the seam stops being
a slot you could drop a coin into — a look decision, taken deliberately.

Pinned by `a boarded floor is one unbroken surface` in `check:world`: 8,640 rays
straight down inside the footprint of 12 rooms, every one landing at `y = 0`.
Re-cut the seam and it reports 72 rays falling 6.0 mm into the slab.

The same construction is in plank doors (`hut-door.ts:195`), trapdoors and
signboards, and they will be doing the same thing. Left alone on purpose: a
door's gaps are part of how it reads as a door, and you do not sweep a camera
across one the way you do a floor. Judge those on the door.

## Verification

`npm run check:world` asserts the plumbing, which is where the silent failures
are:

- **`the sample count is clamped, and off is off`** — `resolveSamples` over six
  driver limits × eight requested counts. Never over the limit, never one, and
  always zero with the switch off. Fails 24 + 6 with the clamp removed.
- **`a boarded floor is one unbroken surface`** — see the ink-lines section.
- **`the detail fade patches land, after weathering`** — five injections into
  three's Lambert program, the dials shared by reference, and the fade's position
  in the fragment shader asserted to be *after* the wear block. Anchor it on
  `<color_fragment>` instead and it fails on the ordering alone.
- **`nothing in the kit fades unless it asked to`** — 272,208 vertices across 90
  builders, every feature size 0. Guards the opt-in: one shared material means a
  mistake in `assemble` would dissolve the entire kit at once.
- **`the floor seam fades at its own width`** — the one surface that does opt in,
  asserting two distinct feature sizes, the seam's within an order of magnitude
  of 9 mm, and both fading to the floor colour.
- **`setting the sample count keeps the depth texture`** — six changes through
  `PixelStage.setSamples`, asserting each count lands, the depth texture is on
  the target afterwards, and it is *off* it at the moment the target dispatches
  `dispose`. That last one is the interesting part: the freeing happens inside
  three's texture cache and needs a GL context, so what the check watches is the
  state three reads to decide — the same condition, one step earlier. Drop the
  detach and it reports 5 disposals that would have freed it.

The rest is by eye:

1. **The village interior floorboards**, turning on the spot. *Done.* The
   antialiasing helped and the shimmer that survived it was the ink lines — see
   the section above. Worth one more look now the seams are painted, with
   `normalEdgeStrength` back at 0.5.
2. **A crate lit from above**, for the thin lit batten faces.
3. **A silhouette against distant fog**, looking specifically for a one-block
   halo — the depth/colour disagreement.
4. **Bloom and the ink lines**, to confirm both are unchanged. They should be
   *exactly* unchanged; if they are not, something is multisampling that should
   not be.
5. **A/B with the toggle**, which is the whole reason it went in with one.

## Left for you

- The names above, and this filename.
- The default sample count. 4 shipped; the dial goes to 8, and `maxSamples` on a
  desktop card is usually 8.
- Whether `normalTarget` should be multisampled too, once the surfaces are
  smooth and the outlines are the remaining hard thing on screen.
- Whether `antialias` should default on. It does. The reasoning was that it is a
  fidelity improvement with a modest cost and the switch is there for anyone
  whose machine disagrees — but it is a look decision, not an engineering one.
