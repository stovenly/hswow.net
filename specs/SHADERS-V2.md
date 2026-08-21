# Shaders, second round

What is left of the screen-space roadmap after `SHADERS-AND-MATERIALS` closed.
Three effects, none of them blocking anything, each independent of the others.
The pipeline they hook into is finished: `PixelStage` owns the chunky stage,
GTAO, fog volumes, bloom, water and glass are in the chain, and the effect mask
exists. Nothing below needs new infrastructure.

Names are the ones the closed document used; rename freely.

---

## 1. God rays

Wants the day/night clock from `ATMOSPHERE-WEATHER.md`. Technically it needs
nothing but the pixel stage, but the effect earns its cost at a low golden sun,
and until the sun moves there is no low golden sun to earn it at.

The sun disc is drawn analytically in the sky shader and aimed from the actual
`DirectionalLight`, so the light source's screen position is one projection away
and shadows, disc and rays agree by construction.

- **Mask**, at chunky resolution or half: scene-colour brightness weighted by
  angular proximity to the sun direction. Using the rendered colour rather than
  a depth test means the sky's own clouds occlude the rays for free.
- **Radial blur**: two iterated passes of 16 taps each marching toward the sun's
  screen position, which is the standard cascade and is worth about 256 taps.
- **Composite**: additive, in linear light, before the upscale. Intensity scaled
  by `dot(viewDir, sunDir)` so rays fade as the sun leaves frame instead of
  snapping off at the screen edge, and by sun elevation once the clock exists.

Cost is a mask pass and 32 taps at low resolution — cheap enough to leave on.

*Done when* rays fall through the village at golden hour, occluded by drawn
clouds; the fade as the sun leaves frame has no edge snap; and the effect is off
at night and near noon by the elevation curve rather than by a special case.

---

## 2. Heat shimmer

Screen-space refraction, and the cheapest tier of that family. After the opaques
are drawn, a distortion pass: marker volumes over the forge, chimneys and hot
machinery — glow-style no-collide geometry on one shared material writing into a
small R8 target — lay down a mask; a composite pass then offsets its
colour-buffer reads by time-scrolled noise scaled by that mask.

Glass panes are the same read with a constant normal-based offset and a tint,
and are worth adding only if a prop asks for them. The existing windows are
emissive by design and are not a retrofit target.

*Done when* the forge shimmers and the effect is invisible in the frame readout
at village scale.

---

## 3. Depth of field

Punctuation, not a state. Always-on DoF fights a look built on crisp edges; as a
focus event — examining an item, a conversation — it is worth having.

- **API**: `postfx.focus(distanceMetres | null)`, critically damped toward the
  target so focus pulls rather than snaps. The interaction system already
  raycasts the crosshair target, so the distance is one it can supply.
- **Shader**: thin-lens circle of confusion from the depth texture; gather blur
  at chunky resolution, a 12-tap poisson disc scaled by CoC, taps weighted by
  their own CoC so a sharp foreground does not bleed into a blurred background.
  Background blur only — near-field doubles the complexity for a case this
  framing rarely needs.
- **Order**: after fog, before bloom, so blurred lamps still bloom.
- The quantizer turns the blur gradient into stepped, dithered rings. That is
  the look, not an artifact to hide: 12 taps at this resolution *is* the effect.
- Default off. Nothing enables it but a focus event.

*Done when* focusing on a prop blurs the world behind it and releases cleanly,
and the default state is off and stays off.

---

## Not here

**General SSR** — the parked third tier — was answered by water. Reflection
arrived inside the water shader, marched in world space against the depth
buffer, which is SSR's best case and the only case the world had. A general tier
for wet stone and polished floors still needs per-surface roughness the vertex
format does not carry, and flat-shaded Lambert does not read specularity anyway.
If rain ever wants wet ground, it comes back with the weather that asks for it.

**Planar mirrors** stay ruled out: a second mirrored scene render doubles draw
calls, and draw calls are the ceiling.
