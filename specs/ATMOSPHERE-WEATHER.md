# Atmosphere and weather

The sky's clock, the weather that rides it, and the props that make their own
air. Three pieces that were specified in three different documents and turn out
to be one body of work: a zone should be able to say it is snowing, at dusk,
with the forge throwing sparks, and have all three answer from the same place.

The pieces are inherited rather than new. Day/night was `SHADERS-AND-MATERIALS`
R4, weather was `PARTICLES` P7, and props building their own particles was P6;
those documents are closed and this one carries what they did not build. The
machinery each one needs already exists — the particle system, the sky, the fog
link, the zone crossing — so none of this is infrastructure.

Names throughout are working names.

---

## 1. Day and night

The largest unbuilt thing in the tree, and mostly clock and keyframes rather
than shader work. Four sub-phases, each shippable alone.

**D1 — clock and sun path.** Time of day as state rather than a preset, with
speed and pause; sun azimuth and elevation derived from it; `aimSun` goes
per-frame; the shadow camera's position derived from the sun direction, with the
elevation clamp the shadow map needs.

*Done when* scrubbing time in the panel swings sun, disc and shadows together,
shadow contact stays tight through golden hour, and frame cost is unchanged —
the map already redraws every frame.

**D2 — atmosphere keyframes.** An elevation-keyed table of `SkySettings` plus
light and fog looks — night, dawn, golden, noon — interpolated between. Authored
by tuning the existing sky panel and capturing what it gives.

*Done when* a full scrubbed cycle has no visible snap and dusk repaints the
distance haze through the existing fog link. The four keyframes are the repo
owner's to tune; the phase delivers the machinery and placeholder values.

**D3 — night sky.** Stars faded in below about −6°, a moon disc reusing the
sun-disc code, a dim moon `DirectionalLight`.

*Done when* night reads as night and the player can still see, and clouds
occlude stars.

**D4 — lamps.** A dusk-to-dawn schedule. First cut is the global glow-brightness
uniform; a per-prop `uLit` attribute is the follow-up if one global proves too
blunt.

*Done when* the village lights itself at dusk, and blooms.

**The standing constraint:** the sun moves, so nothing may bake or rate-limit
what depends on its direction. Shadow maps stay per-frame.

---

## 2. Weather

`ZoneEnvironment.weather`, applied at a crossing beside the fog and the
soundscape, driving the particle system that already exists.

**The one number rule.** The rain you hear and the rain you see come from the
same value. That is the whole point of putting weather on the environment rather
than in two systems that agree by hand.

**The wrap gate lands here**, because this is where a `follow` box belongs:
walking a hundred metres in a straight line must never run out of snow and never
show a wrap, and looking straight up must show no popping. There is nowhere in
the particle showcase to check that, which is why the check waits for weather.

*Done when* walking from a snowy exterior into an interior stops the snow at the
threshold along with the fog and the reverb, walking back out resumes it, and
turning the intensity down makes both the sound and the sight answer.

**Weather and the clock meet here.** An overcast sky is a weather state that has
to reach D2's keyframe table, not a separate set of colours. Whichever of the
two lands second owns the join.

---

## 3. Props that make their own air

`finishParticles`, beside `finishGlow`, so a prop carries its emitter the way it
carries its glow. First two callers: the forge's sparks and a chimney's smoke.

*Done when* placing a forge places its sparks with no other authoring step, the
player can walk through the smoke, and the prop-grounding and interior-leak
checks still pass.

Smaller than the other two and independent of both. It is here because it is the
last piece of the particle system rather than because it is atmospheric.

---

## Order

3 is independent and can land any time. 1 before 2, because an overcast state
with nothing to be overcast against is untestable — but D1 alone is enough to
unblock weather; D2 through D4 can follow it.

`SHADERS-V2.md`'s god rays want D1 and D2 landed before they are worth judging.
