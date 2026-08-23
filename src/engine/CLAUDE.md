# src/engine

The render pipeline, the frame loop, and the input that drives them. Everything
between "the world exists" and "there is a picture of it".

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## The pipeline

```
scene ─► PixelStage ─────────────────────────────────────────────► screen
         chunky pixels,                      upscale, sRGB,
         [effect slot]                       dither, quantize
```

`PixelStage` is the only pass. It renders at chunky resolution, runs the effect
slot there, and upscales — and the upscale is the **only**
step in the pipeline that runs at device resolution, so the sRGB encode, the
halftone and the quantizer all live in its one shader (`RetroShader`). The
order inside it is load-bearing: sRGB first, because spacing quantization steps
evenly is only correct on the display side of that conversion, and the dither
*within* a step is resolved in linear light.

## The effect slot, in order

```
GTAO ─► water ─► underwater ─► glass ─► fog volumes ─► particles ─► bloom
     ─► effect mask ─► horror ─► glitch
```

**The order is the design, not an accident of construction.** AO is shading and
belongs on the surfaces, so it runs while the colour is still only surfaces.
Water is a surface too, but one that reads everything already drawn. Glass is
the last surface and the one that reads all the others. Fog stands *between*
the camera and all of that. Particles come after the fog volumes, so a flake
half a metre away is not veiled by twenty metres of mist behind it, and before
bloom, whose emitters pass depth-tests against a uniform the particle pass
sets — the one ordering that breaks silently. Horror lands before glitch, so
the body goes wrong first and the signal of it corrupts on top.

Two effects draw rather than filter: bloom's emitters pass, and every
layer-restricted pass (water, glass, particles). Each blits the chain's colour
forward and re-renders the scene with the camera on its own layer, so it costs
its own draw calls and a scene-graph walk — which is why each is gated on what
the entered zone actually built, observed rather than declared.

## The sky

`Sky.ts` draws one dome from `skyUniforms`, which are at module scope because
water reflects into the sky and two copies would be two skies. Its *shape* — the
elevation curves, the disc's size, the master cloud dials — is `SkySettings` and
persists with the render preset. Its **colour is not authored**: every colour in
the sky comes off the sun's elevation through the table in `atmosphere.ts`,
because one authored blue can only ever be right at one hour.

`atmosphere.ts` is seven rows keyed on sun elevation, interpolated in Oklab —
straight RGB between a night blue and a sunset orange passes through a dead grey.
Dawn is tinted cooler and pinker than dusk over the same rows.

Clouds are three decks, high to low, each a row of the genus table in
`art/glsl/clouds.ts`. The dome runs the full function; **everything else runs a
single cheap layer**, because `skyColour` is evaluated on every lit fragment
through `finishEnv` and on every reflection miss in the water.

Every new sky layer must be either invisible at `direction.y = 0` or present
identically in `skyAir`. That one line is what the vista band cannot afford a
seam on.

## Conventions

Effects are **spatial only**: one value per chunky pixel, no accumulation
across frames. Knowing the clock is allowed; keeping a history is not.

`Viewport` turns off three's automatic shadow-map update, `info` reset and
`updateMatrixWorld`, because this pipeline renders the scene up to eight times
a frame and nothing moves between the calls. `PostFX.render` does each once.

Anything that draws the scene has to agree about **where** the scene is: the
surface material, the shadow depth material, and the normal override the
ambient occlusion reads all take the same displacement patches.

`RenderSettings` is the look and persists to localStorage; `ZoneAir` is the
place and is applied on top, so walking through a door never overwrites tuning.
Player switches layer over both rather than writing into either.
