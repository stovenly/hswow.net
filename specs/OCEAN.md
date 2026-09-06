# Ocean — spec

**Not started.** The plan for a beach that reads as the edge of a sea: a
surface that goes to the horizon, swell on it, breakers that are waves rather
than paint, a waterline that moves, and the lighting that sells all of it. One
shader, one pass, no new stage in the effect chain.

**The one-sentence version:** the water plane grows a coarse apron out past
the far plane, a long swell runs over the whole of it, and near the sand that
swell shoals into a Gerstner train driven by a baked shore field — so the foam
comes off a wave that is actually there, and the sea ends at the sky instead
of at the fog.

Everything below is checked against `src/art/water.ts`, `src/engine/Water.ts`
and `src/world/vista.ts` as they stand. Nothing is to be built to verify it —
the render is the ground truth.

---

## 1. The ask

- The beach water should look like a real ocean: physical shape on the
  surface, foam on the crests, and the rest of what a sea does.
- It should lead out to the horizon and to far coasts. Lakes are volumes with
  edges; the sea is the special case with none.
- Nothing is fixed by removing detail. Every aliasing problem is solved by
  filtering, never by fading the feature out.
- The same stack: Three.js r170, WebGL2, one `ShaderMaterial`, no textures,
  no files, the pixel stage at chunky resolution.

---

## 2. What this stands on

| | |
|---|---|
| `art/water.ts` | One material for every water body. Two crossed sine trains in the vertex stage, slope from their derivative; `aChop` and `aFlow` per vertex. The fragment stage composites what is behind it from `tScene`/`tDepth`: Beer–Lambert body colour on the column, screen-space reflection march, Schlick fresnel, a fwidth-filtered ripple normal, a pixel-AA'd waterline rim, and foam banded to two flat colours. |
| `engine/Water.ts` | The water pass: blits the chain forward, re-renders `WATER_LAYER` with the opaque colour and depth bound. Gated on whether the zone built water. |
| `world/kinds.ts` `water` | Entry: `width`, `depth`, `chop`, `taper` (chop fades as the bed comes up, from `ctx.groundAt`), `flow`, `segment`. The beach has `shore` (92 × 62, 0.7 m quads, tapered) and `offing` (220 × 200, 3 m quads). |
| `world/vista.ts` `Skirt` | Ground past the boundary: continues the outline's own height outward, `curve` bows it down. On the beach's sea side the outline height is seabed, so the skirt is already under the sea everywhere past the outline. |
| `world/vista-ring.ts` | Far props on the skirt. `vista-headland`, `vista-dune`, `vista-crag`, `vista-sail` all stand in the sea and assume a plane hides everything under it. |
| `engine/Sky.ts` | `skyUniforms` are already in the water material: `uSunDirection`, `uSunColor`, `uSunIntensity`, the moon's, and `skyColour(dir)` for reflection misses. |
| `engine/fog.ts` | `aerialAir` / `aerialAmount`, applied by the water shader to its own share of the pixel. Beach fog runs 80 → 340 m; the camera's far plane is 500 m. |

What is missing is not a water shader. It is that the surface has no idea
where the shore is, and no edge of it goes anywhere.

---

## 3. The sea goes to the horizon

### 3.1 One plane, with an apron

The `water` entry gains `reach` (metres). A plane with a reach is built as its
authored rectangle at `segment` spacing **plus an apron of rings** outside it:
the rectangle's perimeter, offset outward at distances growing geometrically
from 2 m to `reach`, each ring carrying the same vertex count as the perimeter
so the strips between them triangulate trivially. Twelve rings on the beach's
perimeter is ~9 k vertices, one draw, and it replaces `offing`, which is
deleted.

`reach` defaults to 600 m: past the 500 m far plane, so the plane is cut by
the frustum at a fraction of a degree below the eye‑line, and past the fog, so
the cut is haze on haze. Nothing hides an edge because there is no edge.

**The apron is seaward only.** A ring vertex whose nearest perimeter point
stands on land — the level's ground at that point is above the water level —
is pinned to the perimeter instead of offset. Otherwise the plane runs under
the level's land and out to where the bowed skirt drops beneath sea level, and
the sea shows through the back of the dunes.

The apron carries the swell (3.2) and nothing else: `aChop` and `aFlow` are
zero on it, and the shore attributes (4.1) are zero, so the crossed trains and
the shore train are both silent there. The perimeter vertices belong to both
grids, so the seam is the same surface evaluated once.

### 3.2 Swell

A third train, long and slow, on every vertex of a plane that has a reach:
wavelength `L₀` 25–40 m, amplitude 0.15–0.35 m, one direction `d₀` from
offshore. Its phase is world position and the clock, no per-vertex data, so it
is continuous across the perimeter. Deep-water dispersion fixes its period
from its wavelength: ω² = g k₀. Plain sine on the apron; the slope goes into
`vSurfaceNormal` as the other two do.

This is what a distant sea shows — heave, not chop — and it is the parent of
the shore train: the breakers arrive at the swell's period, so the far water
and the surf read as one system.

Authored on the entry: `swell: { direction: [x, z], length: m, height: m }`.
`uWaterMotion` stops it like everything else.

### 3.3 The far branch

One `if` on `surfaceDistance` in the fragment stage, at about 120 m:

- **No reflection march.** Past that range it finds nothing a sky lookup does
  not, and it is a loop per pixel across the whole horizon. `reflection = sky`.
- Chop, ripple and foam terms are already pulled to their means by the fwidth
  filtering; nothing changes there. The swell is long enough to survive.
- The waterline rim (`shore`) stays on. Against a vista mass in the depth
  buffer it becomes a thin bright line at 200–300 m, which is exactly what a
  far coast's surf looks like, and it brightens as the swell arrives.

### 3.4 The sun path

The single biggest cue a horizon has and the one the shader lacks. When the
ripple normal is filtered flat by distance, the roughness has to rise to
compensate (Bruneton–Neyret–Holzschuch's geometry‑to‑BRDF transition): sharp
sparkle underfoot, a broad glitter road under the sun at the horizon.

One microfacet specular term on the *filtered* normal, GGX or Blinn–Phong,
with roughness `α = mix(α₀, α₁, swim + rippleSwim)` — the two filter weights
the shader already computes are the normal's variance. Lit by
`uSunColor · uSunIntensity` through the fresnel weight; the same term again for
the moon from `uMoonDirection`/`uMoonColor`/`uMoonIntensity`, so the night sea
has its moon path. `α₀ ≈ 0.02`, `α₁ ≈ 0.3`; both are look knobs.

### 3.5 Closing the horizon

At grazing incidence fresnel → 1 and the sea becomes `skyColour` at the
horizon; `aerialAir` finishes it. The sky dome's below‑horizon ground colour
must never be visible between the plane's frustum cut and the true horizon:
at 500 m from an eye 1.6 m up it is not. A spawn on a hill would need the
reach raised, and `reach` is per entry for that reason.

### 3.6 Far coasts

They are vista masses standing in the sea — `vista-headland`, `vista-dune`,
`vista-crag`, and an isle builder if one is wanted — placed by the ring with
`apparent` for parallax, as now. The plane hides their feet and the waterline
rim draws their surf. Nothing new is built for them; what they gain is the
water under them.

---

## 4. The shore

### 4.1 A baked shore field

The plane is a grid and `ctx.groundAt` is known at build time, so the shore
is baked per vertex. Four numbers in one lane, `aShore: vec4`:

| | |
|---|---|
| `h` | Still-water column at the vertex, `level − groundAt`, metres. ≤ 0 on land. |
| `σ` | The **wave coordinate**: the shore train's spatial phase, radians. |
| `d` | Unit direction the shore train travels, `∇σ / |∇σ|`. |

`σ` is the solution of the eikonal equation |∇σ| = k(h) over the grid, fast
marching inward from the perimeter, where it is seeded with the swell's own
plane-wave phase `k₀ · (d₀ · x)`. Cells on land are obstacles. That equation
*is* wave refraction — rays slow where the water is shallow and the crests
swing round to lie along the waterline — so the crests bend around a rock and
wrap into a cove with no special case, and they meet the swell at the
perimeter with no seam.

`k(h)` is the local wavenumber from the dispersion relation with depth,
ω² = g k tanh(k h), solved by a few Newton steps at bake time with the swell's
ω. It is `k₀` in deep water and grows as the bed comes up.

`aShore` defaults to zero through `defaultAttributeValues`, exactly as `aChop`
does, so a pond with no reach and no bake is untouched: the shore train's
amplitude is a function of `h` and is zero at zero.

### 4.2 Shoaling

The shore train is one Gerstner wave along `d` with phase `φ = σ − ω t` and
amplitude, wavenumber and steepness set by `h`:

- **Wavelength** shortens: `k(h)` from the bake, so crests bunch toward the
  sand.
- **Height** grows: Green's law through the shoaling coefficient
  `Ks = sqrt(cg₀ / cg(h))`, `cg = (c/2)(1 + 2kh / sinh 2kh)`. `a = a₀ · Ks`,
  where `a₀` is the swell's amplitude, so the train *is* the swell where it
  starts.
- **Breaking** caps it: `a ≤ γ h / 2`, γ = 0.78 (McCowan). `b = 2a / (γ h)`
  is the breaking ratio; it reaches 1 at the break point and the wave stays
  saturated from there in, shrinking with the depth as a bore does.
- **Steepness** sharpens the crest: Gerstner `Q = clamp(a k / s_max, 0, 1)`
  — flat troughs and a piled crest that leans shoreward as it shoals.

Gerstner horizontal displacement is along `d`; the normal comes from the
analytic tangent as the sines do now. The crossed chop trains keep running on
top as small ripple; `taper` on the entry stays the knob for how far up the
beach they reach.

The vertex stage hands the fragment stage `vBreak = b`, `vPhase = φ` and the
crest height in `vCrest` as now.

### 4.3 Foam, off the wave

The depth‑contour surf in the fragment stage is deleted. Foam has three
sources, all of them functions of the shore train:

- **The lip.** White on the crest and its shoreward face where the wave is at
  or past breaking: `lip = smoothstep(0.85, 1.0, b) · face(φ)`, `face` a
  window over the top of the phase, torn along its length by the streaked
  noise so it is a run of white with gaps.
- **The wash.** Foam the breaker deposits, decaying behind the crest:
  `wash = smoothstep(0.9, 1.0, b) · decay(fract(φ / 2π))`, where `decay`
  ramps down over the cycle and never reaches the second band's threshold —
  it is the pale band, never the white one. Torn into lace by two octaves of
  noise whose threshold *rises* as the wash decays, so it opens hole‑first,
  which is how foam actually goes.
- **Whitecaps** offshore stay as they are: noise‑placed, sitting on a chop
  crest where there is one, weighted by agitation, and off inside the surf
  zone.

The waterline rim keeps its pixel AA. `foam = max(rim, lip, wash, cap)` then
goes through the same two thresholds and flat colours as now.

### 4.4 Swash and wet sand

The plane covers the sand above the waterline, and the pass has the bed's
depth, so the bed's world position — and its height above the still level,
`rise` — is one unprojection away. The discard for a bed in front of the
surface is relaxed within a **runup band**:

- `R(x, t) = R₀ · max(0, cos(φ_shore))` is how far up the sand the last wave
  is right now, timed by the same phase the breaker arrived on. `R₀` scales
  with the swell height.
- `rise < R`: a sheet — the bed darkened and pulled slightly toward the
  reflection, with a thin foam edge over the last 0.15 m of it.
- `R < rise < R_max`: wet sand, the bed darkened, fading up to dry.
- Beyond: discard as now.

There is no memory of where the water reached, so drying is a fixed gradient
rather than a clock. It applies to whatever the bed is — a boulder at the
waterline is wet too, which is right; a person standing there gets wet feet.

### 4.5 Lighting the shallows

- **Scatter through the crest.** The sun through the upper face of a raised
  wave when the eye looks into it:
  `sss = crest · pow(max(dot(−view, sun), 0), 4) · (1 − fresnel) ·
  smoothstep(0.3, 1.0, thickness)` — the last term because a crest with sand
  behind it is not backlit. Tints toward a scatter colour, the shallow colour
  brightened by default; the colour is a call for the owner.
- **Refraction.** The bed is read at `uv + normal.xz · strength ·
  min(thickness, 1) / surfaceDistance`, and only if the depth there is still
  behind the surface; otherwise the unrefracted sample, so nothing above the
  water bends.
- **Caustics.** Two octaves of ridged value noise on the bed's world xz,
  scrolled two ways, brightening the bed where the column is between 0.05 and
  ~2 m and the sun is up. Off under `uWaterMotion = 0` like every other scroll.

### 4.6 Mesh

`shore` goes from 0.7 m to 0.4 m quads (~36 k vertices): a shoaled crest a
few metres long needs it. The apron is coarse by construction.

---

## 5. Content

`beach.json`: delete `offing`; on `shore` set `reach`, `swell`, `segment: 0.4`,
and raise `taper` to a few metres so the chop hands over to the shore train
rather than dying in the last half metre. Values are content and are the
owner's.

---

## 6. Budgets

- Vertex: 36 k + 9 k, one draw. Three trains per vertex instead of two.
- Fragment, per water pixel: one extra depth fetch (refraction), two noise
  samples (caustics), two (lace). The reflection march switched off past
  120 m more than pays for them at the horizon.
- Attributes: one vec4 lane on the water geometry. Water is its own material;
  the art ledger is untouched.
- Build: the eikonal march over a 230 × 155 grid runs at zone build, once.

---

## 7. Ways to get it wrong

- **Signs.** `d` points the way the wave *travels* — toward the shore, down
  the depth gradient. Gerstner moves a vertex against `d` on the front face.
  State both in the shader.
- **Land in the apron.** Rings must pin on the land side or the sea appears
  behind the dunes.
- **Two surfaces at one pixel.** Nothing may overlap the plane's apron; that is
  why `offing` goes and why the apron is part of the same geometry.
- **The depth‑test slack.** The relaxed discard is only inside the runup band;
  anywhere else the 0.02 m rule stands or the waterline flickers.
- **Foam by noise.** No term below 4.3 may put white where `b` is small. The
  noise tears foam that is there; it never places it.
- **The motion switch.** Swell, swash, caustics and the wash decay are all
  clocked; every one of them reads `uWaterMotion`.
- **Ponds.** Every new term must be zero at `aShore = 0` and no reach. The
  well and the mill race must not change by a pixel.

---

## 8. Not here

- No shallow‑water solver, no foam feedback buffer, no particle foam. Every
  quantity is analytic per vertex or per pixel.
- No projected grid or camera‑following mesh. The apron is static and coarse.
- No textures. Foam lace, caustics and glitter are noise and BRDF.
- No checks, probes or instruments. The render is the ground truth.

---

## 9. Order of work

1. Reach, apron, swell, sun/moon path, far branch. Delete `offing`. *(What
   you see from the spawn.)*
2. Shore bake, shore train, foam off it. Delete the contour surf.
3. Swash and wet sand.
4. Scatter, refraction, caustics.

Each a commit and a look before the next.

---

## 10. Calls for the owner

- Scatter colour (4.5), or leave it at the shallow colour brightened.
- Wet sand in or out; whether it wets rocks and people at the waterline.
- Caustics in or out.
- Swell direction, length and height on the beach.

---

## 11. Precedents — research notes

- Sea of Thieves (Ang, SIGGRAPH 2018): foam from wave peaks and from depth
  intersections, blurred with feedback so it disperses; colour from a peak
  mask for scatter. Ours is the analytic version — decay in phase rather than
  in a buffer.
- Tessendorf, *Whitecap Phenomenology*: foam where the surface Jacobian goes
  negative, accumulating and decaying. The breaking ratio `b` is the
  one‑dimensional Jacobian.
- Cyanilux, *Shoreline Shader Breakdown*: shore waves as a function of a
  distance‑to‑shore gradient, swash on a cosine, wet sand as a dark tint.
- Wave shoaling (Airy theory): dispersion with depth, Green's law, McCowan's
  γ = 0.78.
- Johanson 2004, projected grid; Crest's clipmap LODs: how infinite oceans
  are meshed. Not needed here because the outline is fixed.
- Bruneton, Neyret & Holzschuch 2010: the seamless transition from wave
  geometry to a rough BRDF with distance — the sun path.
