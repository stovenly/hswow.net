# Horror effects

Organic dread as placeable set dressing — the glitch system's sibling
(GLITCH-SHADERS.md). Where glitch reads as a *signal going bad* — electronic,
blocky, torn — this reads as a *body going wrong*: it trembles, breathes,
leans, drains and darkens. Same machinery end to end: world-space volumes
(sphere/box) placed free-standing on a zone or attached to an object, a master
strength dial 0..1 with fixed per-effect onsets, per-effect weight sliders,
everything a pure function of the clock.

All effect and recipe names are working names.

## 1. The effects, in ladder order

| effect | onset | route | what you see |
| --- | --- | --- | --- |
| `stretch` | 0.05 | vertex | Proportion drift too slow to catch moving: taller and gaunter, the change only ever noticed as a state. (Uncanny-valley proportion violation; Slender-type elongation.) |
| `pallor` | 0.10 | surface | Colour drains toward grey-green; mottled darker patches bloom on a slow clock. Livor mortis. |
| `judder` | 0.15 | vertex | A slow whole-body wander shown only as held poses — stop-motion, reversed-footage temporal deadness. (The Ring, Faith.) |
| `tremor` | 0.25 | vertex | Per-face high-frequency buzz, each face out of phase — the silhouette boils; the thing cannot hold still. (P.T.'s Lisa, weaponized PS1 jitter.) |
| `lean` | 0.30 | vertex | A few degrees past balance, frozen mid-topple, the axis creeping; a slight hover at strength. (Wrong centre of mass; hanged-figure imagery.) |
| `breathe` | 0.40 | vertex | Asymmetric swell — fast in, held, let go — with breaths skipped, radiating from the volume's height on the object's own axis. (Anatomy.) |
| `headshake` | 0.55 | vertex | The upper region snaps between held offsets at ~9 Hz with pauses — the 4fps-film thrash, height-masked against the volume so only the top of the thing goes. (Jacob's Ladder.) |
| `shroud` | 0.70 | screen | Darkness pools over everything standing in the volume — figure and air alike — with slow smoke-noise. A hole in the scene's light. (Shadow-person folklore.) |
| `flicker` | 0.80 | surface | For a moment the figure is a flat black silhouette, then not. Rate- and duty-capped (≤ ~3 transitions/s) — this borders on a strobe. (P.T. flash-appearances; frame splices.) |

Cut after review: `weep` (dark runnels; read as nothing at showcase scale),
`crawler` (under-skin bulge), and the `unwatched` modifier (still-while-
watched gate — it read as broken stations, since judging a thing means
looking at it).

**`grounded`** (spec field, default off) decides what the shape-changing
effects pivot about. Off — the honest default, since most of the kit is not a
body with feet — stretch, lean and judder pivot about the volume's own centre
and headshake takes the whole object, so a boulder or a hanging sign tips and
swells in place. On, they pivot about the object's base and headshake masks to
the upper region, so a figure leans from the ankles and its head thrashes over
a still body rather than the thing being levered off a floor it never stood on.

## 2. Two strengths, not one

The activity packs each volume with a **steady** strength (`uHorrorSize.w`)
and a **fit** strength (`uHorrorParams.y` = steady × fit envelope). Effects
that must not blink — stretch, pallor, lean, breathe, shroud — read the
steady lane (a corpse-grey figure stays corpse-grey). The motion effects —
judder, tremor, headshake — read the fit lane: long stillness, then a violent
fit with a fast attack, a long hold and a slow settle, which is the temporal
shape of a haunting where glitch's burst is a malfunction. Flicker schedules
its own rare events off the steady lane. The dev steady override forces both
lanes — it exists for judging.

## 3. Architecture (deltas from glitch only)

Everything not listed here is `art/glitch.ts` / `engine/Glitch.ts` /
`GlitchActivity` verbatim: 16-volume packed vec4 uniform store shared by
reference, three-material displacement patching (surface, shadow depth, edge
normal), `markHaunted` + `ZoneDefinition.horrors` twin routes, nearest-first
cull at 45 m, position-salted seeds, onsets as data (`HORROR_ONSETS`).

- Files: `art/horror.ts` (uniforms, onsets, mark, patches),
  `engine/Horror.ts` (names, spec, screen pass), `engine/HorrorActivity.ts`,
  `debug/galleries/horror.ts`.
- Wrap order: horror wraps outermost on the shared material, which lands its
  chunks *before* glitch's in the compiled shader — the body goes wrong first,
  then the signal of it corrupts on top. Cache keys:
  `sway-wear-detail-finish-glitch-horror` / `sway-glitch-horror`.
- Screen pass (`HorrorEffect`, shroud only) sits between bloom and the glitch
  pass: darkness pools over the bloomed scene, and corruption can still tear
  the darkness.
- The pallor mottle uses a small 3D value noise on world position — the no-UV
  answer to patches that stick to the body.
- **Displacement is a pure function of object-space position, never of the
  face normal or a face id.** Kit geometry is non-indexed and flat-shaded, so
  displacing along `normal` translates each triangle in its own direction and
  every shared edge opens into a hole through the object — a barrel's staves
  floating apart. Keyed on position, coincident vertices are bit-identical and
  move together, so the surface stays sealed. Glitch is exempt: `shatter`
  separating faces is the effect there.

## 4. The showcases

**`horror-showcase`**, door 13 in the general props rank (iron). One effect at
a time and nothing else: a row per effect west→east in ladder order, strength
climbing down each row away from the sign with the steps placed inside that
effect's own onset..1 span. Its figures are `grounded`. The eastmost row is
`anomaly` — unmarked crates under a free-standing volume, the placement
route's proof.

**`object-effects`**, door 14 (iron), shared with the glitch system. The two
questions the per-effect rooms cannot answer: what several effects make when
stacked, and whether that survives being put on something that is not a
standing figure. A row per combination west→east — each system's whole ladder,
then recipes within each (`possessed`, `corpse-walker`, `shadow-thing`;
`bad-signal`, `data-rot`, `coming-apart`), then the crossings
(`haunted-signal`, `rotting-body`), then `everything`. Walking *down* a row
holds the combination fixed and changes the subject: figure, bovine, barrel,
crate, chair, small-oak, and a hanging marble orb. Strength does not vary in
here — that is the per-effect rooms' axis — and nothing is grounded, since the
general case is the one this room exists to show. Volumes are **measured** off
each built mesh rather than authored: hand-authored extents gave `crate`
(radius 1.2) a half-extent of 0.6, and its volume sat inside it doing nothing.

**A volume's underside is a cut, not a fade, and belongs on its subject's
base.** Every other face feathers over its outer third; the bottom stops dead
at `centre.y - size.y`, with no vertical falloff between the base and the
centre. So a volume sited on an object's underside covers it whole, feet to
crown, and touches nothing below it. Authors pad sideways and upward, never
down.

The soft-bottom version cannot work, and the reason is worth keeping: the
screen passes grade whatever a pixel hit without knowing which mesh drew it, a
volume must reach an object's base to cover its base, and an object standing on
the ground has its base *at* the ground — so any bottom falloff wide enough to
be soft is wide enough to grade the floor, and the choice of shape only decides
whether the patch under the object is a square or a circle. Free-standing
volumes still reach the ground by simply being sited lower, which is what an
anomaly wants: its claim is that a *place* is wrong, floor included.

Showcase tempo is 10 in both rooms; world placements default to 1. Tempo drives the fit
rate *and* the slow drift clocks (stretch, lean, pallor mottle, shroud smoke)
— so in the showcase a drift that takes minutes in the world crosses its
range in seconds. Flicker deliberately ignores tempo: its rate cap is a
photosensitivity bound, not a cadence. Dev folder `horror`: pass switch,
steady override, strength, freeze.

## 5. Known gaps and hazards

- Flicker and headshake are the photosensitivity risks; both are rate-capped
  in the shader, and neither is wired to the reduced-motion option yet — the
  same standing gap glitch has.
- A free-standing volume's centre doubles as the anchor `breathe` swells away
  from, so a volume floating well above its subjects inflates them downward.
  Site the centre at the height of what it haunts.
- **The screen passes have no silhouette mask**, so they cannot tell an object
  from anything else standing inside its volume. The hard bottom handles the
  ground, which is the case that matters; a wall or a prop close behind a
  haunted thing would still be graded with it. The fix if that ever bites:
  render the affected meshes (the activities already track and cull them) into
  a one-channel target at chunky resolution, patched with the same displacement
  chain the normal material carries, and multiply the screen passes by it —
  skipping the mask for free-standing volumes, which want the whole spot.
- Per-face effects assume non-indexed kit geometry (`gl_VertexID / 3`) —
  glitch's assumption site, shared.
- The long-exposure echo from the research was dropped: it needs extra draw
  calls per affected object, which breaks the volume-only architecture, and
  glitch's ghost covers adjacent ground.
