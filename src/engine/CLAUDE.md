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
the entered zone actually built, observed rather than declared. The walk is
short: `statics.ts` gathers every zone subtree that carries no light and no
layer but the default under one group, and each of those passes hides that
group around its render (`withStaticHidden`).

`surfaces.ts` is the one visibility flip left: glow, cover and the bolt are
hidden for the normal pass and the effect mask, which read geometry as
geometry, and shown again straight after. Nothing flips per render otherwise.

The glitch and horror stages are compiled out of every art, depth, normal and
mask program while the zone being drawn has no volume of that kind
(`setGlitchVolumes`, `setHorrorVolumes`); the variant rides in every carrying
material's cache key, and `PostFX.prewarm` compiles both ends.

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
through `finishEnv` and on every reflection miss in the water. The dome is
drawn after every opaque with the depth test on, so the deck march only runs
where nothing else was drawn. The cloud shadow is evaluated per vertex.

Every new sky layer must be either invisible at `direction.y = 0` or present
identically in `skyAir`. That one line is what the vista band cannot afford a
seam on.

## Off the main thread

`work/` is a pool of module workers with a queue in front of them. A job kind is
registered by name in `work/jobs.ts` with two halves: `inWorker` is pure and
returns transferable buffers, `onMain` turns those into engine objects and is
the only half allowed to touch three, the renderer or the DOM. Callers await
`pool.run(kind, payload)` and never see a worker; a browser that refuses them
runs the same halves inline.

Shader compilation, buffer upload and anything touching the renderer stay on
the main thread. Its tenants are a zone's props — placed, scattered, dressed
along the boundary, standing in the vista band, and its creatures — a zone's
collision tree, the groundcover sampler, the audio noise tables, and the
editor's palette thumbnails.

The worker loads builders one module at a time. `pool.prime` sends every
worker the builder-name index before its first job, and a job's `inWorker` may
return a promise.

A job may ask to jump the queue, which only a zone crossing's collision tree
does. Nothing else has a deadline the player can see.

A job may also name a cache key (`work/cache.ts`): the worker reads the result
off the origin private file system under it before building, and writes it
there after. Keys carry the project, the zone, the document's fingerprint and
the build stamp, so any change is a miss; the cache is off on the dev server
and in the editor. Under cross-origin isolation — `public/isolate.js` on the
deployed site, headers on the dev server — the big result arrays are
`SharedArrayBuffer`s (`work/shared.ts`) and cross without a copy.

`src/platform/` is what the page runs on: `isolated`, fullscreen, keyboard
lock. Pointer lock asks for the keyboard lock too, so in fullscreen Escape,
Tab and Alt reach the game; Escape releases the pointer, which raises the
pause stack, and Escape on the stack takes it back.

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
