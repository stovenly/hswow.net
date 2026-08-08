import './styles.css';
import * as THREE from 'three';
import { Viewport } from './engine/Viewport';
import { Loop } from './engine/Loop';
import { PostFX } from './engine/PostFX';
import { Input, isTouchDevice } from './engine/Input';
import { Collider } from './player/Collider';
import { Controller } from './player/Controller';
import { TouchControls } from './ui/TouchControls';
import { ProvingGround, type SurfaceName } from './debug/ProvingGround';
import { Footsteps } from './audio/models/footsteps';
import { ZONE_GROUPS } from './world/Zone';
import type { WindModel } from './audio/models/wind';
import type { FoliageModel } from './audio/models/foliage';
import type { MachineModel } from './audio/models/machine';
import type { FireModel } from './audio/models/fire';
import type { RainModel } from './audio/models/rain';
import type { WaterModel } from './audio/models/water';
import { AudioEngine } from './audio/AudioEngine';
import { createDevTools } from './debug/DevPanel';
import { ZoneManager } from './world/ZoneManager';
import { Interaction } from './world/Interaction';
import { Reticle, Fade } from './ui/Reticle';
import { Crosshair } from './ui/Crosshair';
import { createTestWorld, ZONE_EXTERIOR, ZONE_COUNTRYSIDE } from './debug/zones';
import { STAGE_STATIONS } from './debug/SoundStage';
import { auditionToConsole } from './debug/Audition';
import { createMeter } from './debug/Meter';
import { patchArtMaterial, updateWind, windUniforms } from './art/sway';
import { updateCover } from './art/cover';
import { updateParticles } from './art/particles';
import { installReloadBanner } from './debug/HotReload';
import { attachFaustPanel } from './debug/FaustPanel';
import type { FrictionModel } from './audio/models/friction';
import type { WaveguideModel } from './audio/models/waveguide';
import { Loader } from './ui/Loader';
import { installOptions, loadOptions } from './ui/options';
import { Reading } from './ui/Reading';
import { READING_FIXTURES } from './debug/reading-fixtures';
import { NOTES } from './content/notes';
import { PerformanceHud } from './ui/Performance';

const canvas = document.getElementById('viewport');
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('#viewport canvas is missing from index.html');
}
const overlay = document.getElementById('overlay');
if (!(overlay instanceof HTMLElement)) {
  throw new Error('#overlay is missing from index.html');
}

const viewport = new Viewport(canvas);
const loop = new Loop();
const dev = createDevTools();

// Created before PostFX, which owns the fog's colour and distances from here on.
viewport.scene.fog = new THREE.Fog(0x0a0a0f, 20, 90);

// Dev server only, and compiled out of the production build entirely. Cancels
// Vite's full reload and shows a banner instead — a reload drops pointer lock
// and sends you back to spawn, which is expensive at the exact moment you are
// standing still looking at something.
installReloadBanner();

// **Before PostFX**, and that ordering is load-bearing rather than tidy. The
// kit's shared material is patched in place, so a prop built later picks the
// sway up without knowing about it — but `PostFX` reaches into its edge pass
// and patches *that* material too, and it can only do so once the patch
// exists. Constructed the other way round it silently did nothing, and the
// symptom was a motionless outline around every swaying plant.
patchArtMaterial();

const postfx = new PostFX(viewport);
const crosshair = new Crosshair(viewport.renderer);
viewport.onResize = () => postfx.resize();

const collider = new Collider();
const input = new Input(canvas);
const player = new Controller(viewport.camera, input, collider);

// --- boot -------------------------------------------------------------------
// Sequenced behind a loading screen rather than run in one synchronous burst.
//
// None of this is a download — every triangle and every sample is generated
// here — so there is no network progress to report, but there is easily a
// second of work, and a second of blank page looks like a fault. Splitting it
// into steps also stops the whole thing landing in one frame, which is what
// made the first seconds of play stutter.
const loader = new Loader(document.body);

const provingGround = await loader.step(
  'shaping the ground',
  0.12,
  () => new ProvingGround(),
);

// --- zones ------------------------------------------------------------------
// Nothing is added to the scene or to the collider here. `ZoneManager.enter`
// owns both, because exactly one zone is ever present in either, and having two
// places that add geometry is how a zone ends up half-swapped.
const zones = new ZoneManager({
  scene: viewport.scene,
  collider,
  player,
  postfx,
  interaction: new Interaction(),
  reticle: new Reticle(overlay),
  fade: new Fade(overlay),
});

// The player's settings, read before anything they govern is built.
//
// Kept out of `RenderSettings` on purpose. That is a saved *preset* — the look,
// dialled in and shared between machines — and these are one player's
// preferences on one machine; a shadow switch that travelled with a preset
// would arrive turned off on somebody else's computer for no reason they could
// see. Separate store, separate lifetime. See `ui/options/`.
const options = loadOptions();

const world = createTestWorld(provingGround);
for (const definition of world.zones) zones.register(definition);
// Linked after every zone is registered — a portal to an unregistered zone
// throws here rather than when somebody opens the door.
for (const portal of world.portals) zones.link(portal);

// Builds the exterior's geometry and indexes all of it for collision, which on
// a world this size is a couple of hundred milliseconds on its own.
// Ahead of the first build rather than in `applyOptions` below, which cannot
// run until the audio engine exists. It is read as a zone's meshes are
// prepared, so setting it afterwards would raise the exterior with the wrong
// casters and then walk all of it again to correct them.
zones.setShadows(options.shadows);
// The drawn sun and the shadow-casting one are the same direction by
// construction. Static for now; when it moves, this call moves with it.
postfx.aimSun(zones.sunDirection);

await loader.step('settling the world', 0.6, () => zones.enter(ZONE_EXTERIOR));

// Built now rather than on first entry. A zone this size takes longer to raise
// than the transition fade is black for, so paying it here keeps the doorway
// instant — and the collider caches it, so it is paid exactly once.
await loader.step('raising the countryside', 0.78, () => zones.prebuild(ZONE_COUNTRYSIDE));

// --- audio ----------------------------------------------------------------
// The context is suspended until a gesture, but the noise buffers and the room
// impulse responses are rendered offline regardless, and the emitters cannot be
// built until they are done.
const audio = new AudioEngine();

/**
 * Your own feet, which belong to you rather than to any zone.
 *
 * Everything else audible is declared by the zone you are standing in and built
 * by `ZoneManager`. Footsteps are the exception: they happen *at* the listener,
 * they follow you through every door, and they are the one sound that would be
 * wrong to tear down and rebuild on a threshold.
 */
let footsteps: Footsteps | null = null;

/**
 * Base leaf articulation per foliage emitter, so one slider can scale them all.
 *
 * Read off the specs rather than guessed: a hedge ticks where a canopy hushes,
 * and a single absolute value applied to both flattens that distinction.
 *
 * Looked up by id against whatever zone is current, so entries for a zone you
 * are not standing in simply find nothing. `canopy` and the two shrubs were
 * the proving ground's sound garden and are kept: the sound stage declares a
 * `foliage` station, and the countryside demo its own hedgerows.
 */
const FOLIAGE_BASE = new Map<string, number>([
  ['canopy', 0.22],
  ['foliage', 0.4],
  ['shrub-a', 0.34],
  ['shrub-b', 0.34],
  ['wood-north', 0.2],
  ['wood-east', 0.22],
  ['hedge', 0.34],
]);

await loader.step('rendering the rooms', 0.86, () => audio.ready);

await loader.step('tuning the air', 0.96, () => {
  footsteps = new Footsteps(audio, 0.55);
  player.onFootstep = (step) => {
    if (!footsteps) return;
    // Sampled per step rather than per zone: outdoors the ground cover changes
    // under you, and a cobbled lane that sounds like the grass beside it is
    // only paint.
    const at = player.position;
    footsteps.surface = zones.surfaceAt(at.x, at.z);
    footsteps.step(step);
  };
  // Landing is part of the same system — same surface, same models, different
  // gesture. Without this, jumping on the spot is completely silent.
  player.onLand = (impact, horizontal) => {
    if (!footsteps) return;
    const at = player.position;
    footsteps.surface = zones.surfaceAt(at.x, at.z);
    footsteps.land(impact, horizontal);
  };
  // The push-off. The controller decides whether this one counts — a hop
  // chained straight off a landing does not, because the landing was the same
  // contact with the ground.
  player.onJump = (speed) => {
    if (!footsteps) return;
    const at = player.position;
    footsteps.surface = zones.surfaceAt(at.x, at.z);
    footsteps.jump(speed);
  };
  // Attaching builds the current zone's soundscape, including the one the
  // player was already standing in before the audio existed.
  zones.attachAudio({ engine: audio, footsteps });
});

// On touch there is no capture step, so the game is live from the first frame.
if (isTouchDevice()) {
  new TouchControls(input, overlay);
  document.body.classList.add('is-touch', 'is-playing');
} else {
  input.onLockChange = (locked) => document.body.classList.toggle('is-playing', locked);
}

// --- options ----------------------------------------------------------------
//
// Installed here rather than at load because half of what they touch — the
// audio engine most of all — does not exist until boot has finished. Everything
// they govern has a sensible value in the meantime, and the two that have to be
// right *before* the world is raised are set above.
// Named `perfHud` rather than `performance`, which is a global this file
// already reads for the heap size — shadowing it here would break that at a
// distance, in a readout, silently.
const perfHud = new PerformanceHud(overlay, viewport.renderer);

// The reading screen. Not a pause: the world keeps running behind it, exactly
// as it does behind the options panel — what stops is *steering*, and that
// falls out of releasing the pointer lock rather than being a mode of its own,
// because `Input` already ignores the whole keyboard while the mouse is free.
//
// Closing puts the mouse back exactly where it was rather than always taking
// it: a note opened from the world was opened by somebody who was playing, and
// one opened from the debug panel was not. Re-capturing unconditionally would
// throw the second case into the game on the way out.
let wasPlaying = false;
const reading = new Reading(overlay, {
  onOpen: () => {
    wasPlaying = input.locked;
    document.exitPointerLock();
  },
  // Not a bare `requestPointerLock`: closing a note is not a click, and the
  // browser's cooldown after a user-initiated exit refuses the first ask. See
  // `Input.capture`, which is the one place that knows to keep asking.
  onClose: () => {
    if (!wasPlaying) return;
    // Held until the mouse is genuinely back. `is-reading` comes off the moment
    // the page closes, and the lock does not come back on that frame — the
    // browser holds a cooldown after a user-initiated exit — so for a few
    // hundred milliseconds the interface believes nobody is playing and raises
    // the capture panel. Closing a book flashed the pause screen every time.
    document.body.classList.add('is-capturing');
    void input.capture().finally(() => document.body.classList.remove('is-capturing'));
  },
});

const settings = installOptions(options, overlay, {
  audio,
  postfx,
  zones,
  player,
  input,
  loop,
  performance: perfHud,
});

if (dev.gui) {
  const r = postfx.settings;
  const refresh = (): void => postfx.apply();

  // Dev-only, and held here rather than in the settings because it is a switch
  // on the pass rather than a value in the preset — the same shape the fog
  // volumes' dev toggle has.
  const particleState = {
    enabled: true,
    apply: (): void => postfx.setParticles(particleState.enabled),
  };

  const look = dev.gui.addFolder('look');
  // The same boolean the options menu edits, not a parallel one. Bound with
  // `.listen()` so a change made in the menu moves the control here, and routed
  // through `commit` so it lands in the engine and in storage the same way the
  // menu's would.
  look.add(options, 'shadows').name('cast shadows').listen().onChange(settings.commit);
  look.add({ open: settings.open }, 'open').name("open the player's menu");
  look.add(r, 'pixelSize', 1, 12, 1).onChange(refresh);
  // The player's switch is in the options menu; this is how many. Clamped to
  // what the driver offers, so the top of the slider may not be reachable —
  // and under 2 it is off, which is what the switch is for.
  look.add(options, 'antialias').listen().onChange(settings.commit);
  look.add(r, 'samples', 0, 8, 1).onChange(refresh);
  // The other half, and the half samples cannot buy: fine detail dissolving
  // into its surroundings once a pixel is too coarse to resolve it. Counted in
  // pixels per feature, so it is independent of resolution and view distance.
  look.add(r.detail, 'start', 0.25, 4, 0.05).name('detail fade start').onChange(refresh);
  // Ceiling well above the default of 16, which is where it sits after being
  // dialled in — a slider whose default is its own maximum can only go one way.
  look.add(r.detail, 'span', 1, 48, 0.5).name('detail fade span').onChange(refresh);
  look.add(r, 'normalEdgeStrength', 0, 2, 0.05).onChange(refresh);
  look.add(r, 'depthEdgeStrength', 0, 2, 0.05).onChange(refresh);
  look.add(r, 'quantize', ['off', 'levels']).onChange(refresh);
  // Up to 64. The output is eight bits a channel, so past there the steps are
  // finer than the display and the quantizer stops being visible at all —
  // which is what `quantize: off` is for.
  look.add(r, 'levels', 2, 64, 1).onChange(refresh);
  // Counted in *steps*, so what it does on screen depends on `levels` — at 32
  // a step is half as wide as at 16, and the same number here spreads the
  // dither across half as much colour. Ceiling raised to match.
  look.add(r, 'ditherScale', 0, 4, 0.05).name('dither (steps)').onChange(refresh);
  // Counted in chunky pixels, so this and `pixelSize` multiply — a period of 4
  // at pixel size 3 is the same size on screen as 3 at pixel size 4.
  look.add(r, 'screenPeriod', 2, 32, 1).name('screen period').onChange(refresh);

  // The same switch the options menu edits, plus the tuning the menu does not
  // show — the player's switch, the developer's dials, one folder.
  const ao = dev.gui.addFolder('ambient occlusion');
  ao.add(options, 'ambientOcclusion').name('enabled').listen().onChange(settings.commit);
  ao.add(r.ao, 'strength', 0, 1, 0.05).onChange(refresh);
  ao.add(r.ao, 'radius', 0.1, 2, 0.05).name('radius (m)').onChange(refresh);

  // The same switch the options menu edits, plus the tuning it does not show.
  const bloom = dev.gui.addFolder('bloom');
  bloom.add(options, 'bloom').name('enabled').listen().onChange(settings.commit);
  bloom.add(r.bloom, 'strength', 0, 2, 0.05).onChange(refresh);
  bloom.add(r.bloom, 'radius', 0.25, 4, 0.05).onChange(refresh);

  // Dev-only, like the fog volumes: a finish is what a prop is made of. The
  // profiles themselves live in `FINISHES`; these scale the two lobes globally.
  const finishState = {
    enabled: true,
    apply: (): void => postfx.setFinish(finishState.enabled),
  };
  const finishFolder = dev.gui.addFolder('material finish');
  finishFolder.add(finishState, 'enabled').onChange(finishState.apply);
  finishFolder.add(r.finish, 'specular', 0, 2, 0.05).onChange(refresh);
  finishFolder.add(r.finish, 'environment', 0, 2, 0.05).onChange(refresh);

  // Not in the player's menu, and not because it was forgotten: a pond is part
  // of the place, by SHADERS-AND-MATERIALS.md's line on what crosses into the options screen.
  // Both of these are global because water is one material — how rough a
  // particular pool is rides on the geometry. See `art/water.ts`.
  const water = dev.gui.addFolder('water');
  water.add(r.water, 'waves', 0, 2, 0.05).onChange(refresh);
  water
    .add(r.water, 'reflections')
    .name('screen-space reflections')
    .onChange(refresh);

  // Dev-only for water's reason — a crystal is part of the place. The recipes
  // live in `GLASSES`; this scales how far the image behind is bent, and the
  // march rides water's own switch above rather than growing a second one.
  const glass = dev.gui.addFolder('glass');
  glass.add(r.glass, 'refraction', 0, 2, 0.05).onChange(refresh);

  // The player has one dropdown; the shape is tuned here, as multipliers over
  // the type table in world/ground.ts, which is authored in real units.
  const cover = dev.gui.addFolder('groundcover');
  cover
    .add(options, 'groundcoverDensity', ['off', 'low', 'medium', 'high', 'ultra'])
    .name('player setting')
    .listen()
    .onChange(settings.commit);
  cover.add(r.cover, 'density', 0, 1, 0.05).name('fraction drawn').onChange(refresh);
  cover.add(r.cover, 'height', 0.25, 2, 0.05).onChange(refresh);
  cover.add(r.cover, 'width', 0.25, 3, 0.05).onChange(refresh);

  // No player video option here on purpose — snow in a snowy zone is the place,
  // like a pond or a mist pool (PARTICLES.md §8). What the player does get is
  // the accessibility switch, which is in the menu beside head bob.
  const particles = dev.gui.addFolder('particles');
  particles.add(particleState, 'enabled').name('draw particles').onChange(particleState.apply);
  particles
    .add(options, 'precipitation')
    .name('player: precipitation')
    .listen()
    .onChange(settings.commit);
  particles.add(r.particles, 'density', 0, 1, 0.05).name('fraction drawn').onChange(refresh);
  particles.add(r.particles, 'size', 0.25, 3, 0.05).onChange(refresh);
  // In seconds. A streak is `speed × shutter`, so this is the one knob that
  // decides whether rain reads as rain or as falling dots.
  particles.add(r.particles, 'shutter', 0, 0.05, 0.001).name('shutter (s)').onChange(refresh);

  // The player's slider, and the one number behind it they do not get: how far
  // inside the view distance the grass stops. See VIEW-DISTANCE.md.
  const distance = dev.gui.addFolder('view distance');
  distance
    .add(options, 'viewDistance', 40, 300, 20)
    .name('metres (300 = off)')
    .listen()
    .onChange(settings.commit);
  distance.add(r, 'clutterCull', 0.3, 1, 0.05).name('clutter at ×').onChange(refresh);

  const vignette = dev.gui.addFolder('vignette').close();
  vignette.add(r, 'vignetteStrength', 0, 1, 0.01).onChange(refresh);
  vignette.add(r, 'vignetteRadius', 0, 1.5, 0.01).onChange(refresh);
  vignette.add(r, 'vignetteSoftness', 0.01, 1.5, 0.01).onChange(refresh);

  const sky = dev.gui.addFolder('sky');
  sky.addColor(r.sky, 'zenith').onChange(refresh);
  sky.addColor(r.sky, 'horizon').onChange(refresh);
  sky.addColor(r.sky, 'ground').name('below horizon').onChange(refresh);
  sky.add(r.sky, 'curve', 0.1, 3, 0.05).onChange(refresh);

  const clouds = dev.gui.addFolder('clouds');
  clouds.addColor(r.sky, 'cloudColor').name('colour').onChange(refresh);
  clouds.add(r.sky, 'cloudCover', 0.1, 0.9, 0.01).name('cover').onChange(refresh);
  clouds.add(r.sky, 'cloudSoftness', 0.01, 0.6, 0.01).name('softness').onChange(refresh);
  clouds.add(r.sky, 'cloudScale', 0.2, 4, 0.05).name('scale').onChange(refresh);
  clouds.add(r.sky, 'cloudOpacity', 0, 1, 0.01).name('opacity').onChange(refresh);
  clouds.add(r.sky, 'cloudDrift', 0, 0.1, 0.001).name('drift').onChange(refresh);

  // Owned by the zone manager and overwritten on every crossing, so these are
  // for looking at a zone's lighting rather than for dialling one in — that
  // belongs in the zone's environment, in data.
  const lights = dev.gui.addFolder('light').close();
  lights.add(zones.lights.sun, 'intensity', 0, 5, 0.1).name('sun');
  lights.add(zones.lights.ambient, 'intensity', 0, 5, 0.1).name('ambient');

  // Placed volumes, as opposed to the distance fog below — see SHADERS-AND-MATERIALS.md §2.
  // Only a switch, and deliberately: a volume's density, tint and size belong
  // to the zone that placed it, so there is nothing global here to tune. Not in
  // the player's menu either; see `PostFX.setFogVolumes`.
  const volumetric = { enabled: true };
  const fogVolumes = dev.gui.addFolder('fog volumes');
  fogVolumes
    .add(volumetric, 'enabled')
    .name('enabled')
    .onChange(() => postfx.setFogVolumes(volumetric.enabled));

  const fogFolder = dev.gui.addFolder('fog').close();
  fogFolder.add(r, 'linkFogToSky').name('match horizon').onChange(refresh);
  fogFolder.addColor(r, 'fogColor').onChange(refresh);
  fogFolder.add(r, 'fogNear', 0, 200, 1).onChange(refresh);
  fogFolder.add(r, 'fogFar', 0, 400, 1).onChange(refresh);

  // Surface colours, live. Contrast between the floor and everything standing
  // on it is a quantization question as much as an art one, so it wants to be
  // adjustable against the filters rather than guessed at in a constant.
  const surfaces = dev.gui.addFolder('surfaces').close();
  for (const name of Object.keys(provingGround.colors) as SurfaceName[]) {
    surfaces.addColor(provingGround.colors, name).onChange(() => provingGround.applyColors());
  }
  surfaces.add(
    {
      reset: () => {
        provingGround.resetColors();
        dev.gui?.controllersRecursive().forEach((c) => c.updateDisplay());
      },
    },
    'reset',
  );

  const preset = dev.gui.addFolder('preset');
  preset.add(
    {
      save: () => {
        const ok = postfx.save();
        preset.title(ok ? 'preset · saved' : 'preset · SAVE FAILED');
      },
    },
    'save',
  );
  preset.add(
    {
      reset: () => {
        postfx.reset();
        dev.gui?.controllersRecursive().forEach((c) => c.updateDisplay());
      },
    },
    'reset',
  );
  preset.add(
    {
      copy: () => {
        void navigator.clipboard?.writeText(JSON.stringify(postfx.settings, null, 2));
      },
    },
    'copy',
  ).name('copy JSON');

  const t = player.tuning;
  const move = dev.gui.addFolder('movement');
  move.add(t, 'walkSpeed', 1, 12, 0.1);
  move.add(t, 'sprintScale', 1, 3, 0.05);
  move.add(t, 'groundAccel', 1, 60, 0.5);
  move.add(t, 'airAccel', 0, 20, 0.1);
  move.add(t, 'friction', 0, 30, 0.5);
  move.add(t, 'gravity', 5, 60, 0.5);
  move.add(t, 'jumpSpeed', 2, 14, 0.1);
  move.add(t, 'autoHop');

  const contact = dev.gui.addFolder('contact').close();
  contact.add(t, 'slopeLimitDeg', 5, 85, 1);
  contact.add(t, 'stepHeight', 0, 1, 0.01);
  contact.add(t, 'coyoteTime', 0, 0.5, 0.01);
  contact.add(t, 'jumpBuffer', 0, 0.5, 0.01);

  const view = dev.gui.addFolder('view');
  view.add(t, 'lookSensitivity', 0.0002, 0.008, 0.0001);
  view.add(t, 'invertY');
  view.add(t, 'eyeHeight', 1, 2, 0.01);
  view.add(t, 'fov', 50, 110, 1);
  view.add(t, 'sprintFovBoost', 0, 30, 1).name('sprint fov +');

  const bob = dev.gui.addFolder('head bob').close();
  bob.add(t, 'bobAmount', 0, 0.15, 0.001);
  bob.add(t, 'bobSway', 0, 0.15, 0.001);
  bob.add(t, 'bobRoll', 0, 0.05, 0.0005);
  bob.add(t, 'bobStepsPerSecond', 0.5, 5, 0.05);
  bob.add(t, 'bobSpeedInfluence', 0, 1, 0.05);
  bob.add(t, 'landDip', 0, 0.1, 0.001);

  const sound = dev.gui.addFolder('audio');
  sound.add(audio.settings, 'masterVolume', 0, 1, 0.01).name('volume');
  sound
    .add(audio.settings, 'reverbAmount', 0, 2, 0.01)
    .name('reverb')
    .onChange(() => audio.applyReverbAmount());
  sound.add(audio.settings, 'airAbsorption', 0, 1, 0.01).name('air absorption');
  sound.add(audio.settings, 'occlusion', 0, 1, 0.01).name('occlusion');

  const weather = dev.gui.addFolder('weather');
  weather.add(audio.weather.settings, 'windSpeed', 0, 1, 0.01).name('wind');
  weather.add(audio.weather.settings, 'gustDepth', 0, 1, 0.01).name('gust depth');
  weather.add(audio.weather.settings, 'gustRate', 0.01, 0.6, 0.01).name('gust rate');
  weather
    .add(audio.weather.settings, 'windDirection', 0, Math.PI * 2, 0.01)
    .name('wind direction');
  // How fast a gust crosses the world. The control that decides whether the
  // wind reads as weather or as a global parameter being turned: at the top of
  // this range the front is near enough instant and everything moves together,
  // which is what it looked like before the field travelled at all.
  weather
    .add(audio.weather.settings, 'frontSpeed', 1, 60, 0.5)
    .name('front speed (m/s)');
  // One global scale over the vertex sway, so the whole world's motion can be
  // judged — or turned off — without re-tuning seventy builders against each
  // other. `art/flex.ts` holds the per-species part.
  weather.add(windUniforms.swayAmount, 'value', 0, 2, 0.01).name('sway');
  // Bound through the active zone's soundscape rather than to a model directly.
  // A zone declares its sound as data and the models are built on entry, so a
  // panel that captured one at startup would be tuning the proving ground's
  // tree while the player stands in the countryside. `find` looks it up by the `id` the
  // spec declared, every time the slider moves.
  const tuning = {
    windTone: 3400,
    leaves: 1,
    machineRpm: 52,
    fireIntensity: 0.85,
    rain: 0,
    water: 1,
    // Scatter events are minutes apart by design, so tuning one by waiting for
    // it means changing a parameter twice between hearings.
    strike: () => zones.sound?.findField('smith')?.trigger(),
    drop: () => zones.sound?.findField('yards')?.trigger(),
    // Ninety-five seconds is a long time to wait to hear whether a tail is
    // right.
    toll: () => zones.sound?.findField('bell')?.trigger(),
  };
  weather
    .add(tuning, 'windTone', 700, 9000, 50)
    .name('wind tone (Hz)')
    .onChange((value: number) => {
      zones.sound?.find<WindModel>('wind')?.setTone(value);
    });
  weather
    .add(tuning, 'leaves', 0, 2, 0.01)
    .name('leaf articulation')
    .onChange((value: number) => {
      // Every foliage model in the zone, whatever it is called. Their base
      // articulations differ — a stiff bush ticks where a canopy hushes — so
      // this scales what the spec asked for rather than replacing it.
      for (const [id, base] of FOLIAGE_BASE) {
        zones.sound?.find<FoliageModel>(id)?.setArticulation(base * value);
      }
    });
  weather
    .add(tuning, 'machineRpm', 0, 200, 1)
    .name('mill rpm')
    .onChange((value: number) => {
      zones.sound?.find<MachineModel>('mill')?.setRpm(value);
    });
  weather
    .add(tuning, 'fireIntensity', 0, 1, 0.01)
    .name('forge intensity')
    .onChange((value: number) => {
      zones.sound?.find<FireModel>('forge')?.setIntensity(value);
    });
  weather
    .add(tuning, 'rain', 0, 1, 0.01)
    .name('rain')
    .onChange((value: number) => {
      zones.sound?.find<RainModel>('rain')?.setIntensity(value);
    });
  weather
    .add(tuning, 'water', 0, 1, 0.01)
    .name('water flow')
    .onChange((value: number) => {
      zones.sound?.find<WaterModel>('cistern')?.setRate(value);
    });
  weather.add(tuning, 'strike').name('hammer now');
  weather.add(tuning, 'drop').name('clatter now');
  weather.add(tuning, 'toll').name('bell now');

  // A readout rather than a control: what the controller thinks is happening,
  // which is the only way to tell a tuning problem from a collision problem.
  const readout = {
    speed: '0.00',
    grounded: 'no',
    position: '',
    triangles: collider.triangles,
    // What the frame actually costs, as opposed to what the arithmetic in
    // SCALING.md predicts it costs. Accumulated across every composer pass and
    // including the shadow draws — see `Viewport`, which turns `autoReset` off
    // to make that true.
    draws: 0,
    drawn: '0',
    heap: '—',
    // Zones currently holding memory, and how many have been released. Together
    // these are the readable form of the residency policy: the first should
    // settle rather than climb across a long session, and the second proves the
    // first is settling because eviction is *working* rather than because
    // nowhere new has been visited.
    resident: '—',
    zone: '—',
    crossings: 0,
    room: '—',
    // Audio has no visible output at all, so a readout of what it thinks is
    // happening is the only way to tell "occlusion is broken" apart from
    // "occlusion is working and that wall is thick".
    audio: 'waiting for a click',
    gust: '0.00',
    swell: '0.00',
    machine: '—',
    emitters: '—',
  };
  const state = dev.gui.addFolder('state');
  state.add(readout, 'speed').listen().disable();
  state.add(readout, 'grounded').listen().disable();
  state.add(readout, 'position').listen().disable();
  state.add(readout, 'zone').listen().disable();
  state.add(readout, 'crossings').listen().disable();
  state.add(readout, 'room').listen().disable();
  state.add(readout, 'audio').listen().disable();
  state.add(readout, 'gust').listen().disable();
  state.add(readout, 'swell').listen().disable();
  state.add(readout, 'machine').listen().disable();
  state.add(readout, 'emitters').name('hrtf / panned / virtual').listen().disable();
  state.add(readout, 'draws').name('draw calls').listen().disable();
  state.add(readout, 'drawn').name('drawn tris').listen().disable();
  state.add(readout, 'heap').listen().disable();
  state.add(readout, 'resident').name('zones built / evicted').listen().disable();
  // Triangles change with the zone now, so this has to be watched rather than
  // read once — it is also the first place a collider leak would show up.
  //
  // Named rather than left as `triangles`: sat next to the renderer's count it
  // is two numbers of the same name measuring different things, and the one
  // that matters here is *collision* geometry — a number that is usually a
  // fraction of what is drawn and grows for entirely different reasons.
  state.add(readout, 'triangles').name('collider tris').listen().disable();
  state.add({ respawn: () => zones.respawn() }, 'respawn');

  // Jumping straight to a zone, without walking to its door. Mostly for
  // getting back out of an interior after breaking the door that leads there.
  // Also the only way into the sound stage, which deliberately has no door.
  //
  // Grouped the way the world is: a family per hall, with the hub and anything
  // else that belongs to no setting sitting loose at the top. A flat list was
  // fine at six zones and is not at twenty-six — and the grouping is the zone's
  // own (`ZoneDefinition.group`) rather than a second list maintained here,
  // which would be the sort that drifts a room at a time.
  const travel = dev.gui.addFolder('zones');
  const all = [...zones.zones.values()];
  const go = (folder: typeof travel, id: string, name: string): void => {
    folder.add({ go: () => void zones.enter(id) }, 'go').name(name);
  };

  for (const zone of all) {
    if (!zone.definition.group) go(travel, zone.id, zone.name);
  }
  for (const group of ZONE_GROUPS) {
    const members = all.filter((zone) => zone.definition.group === group);
    if (members.length === 0) continue;
    const folder = travel.addFolder(group);
    folder.close();
    for (const zone of members) go(folder, zone.id, zone.name);
  }

  // --- the reading screen ---------------------------------------------------
  //
  // A way in that is not a walk across a room. Everything here is also bound to
  // a book in the Readables Showcase and reachable the way a player reaches it;
  // this is for the times you are tuning the type and do not want the walk
  // between one look and the next.
  const read = dev.gui.addFolder('reading').close();
  for (const note of [...NOTES, ...READING_FIXTURES]) {
    read.add({ open: () => reading.open(note) }, 'open').name(note.title.toLowerCase());
  }

  // --- the sound stage ------------------------------------------------------
  //
  // Closed by default, and everything in it acts on whatever soundscape is
  // current rather than on the stage specifically. Solo is as useful standing
  // in the countryside trying to work out which of six sources is the harsh one, and
  // the room controls are the only way to tune an acoustic at all.
  // Built here rather than at boot: it taps an analyser off the master bus,
  // and nothing outside `?debug` should be paying for an FFT.
  const meter = createMeter(audio);
  loop.add(() => meter.update());

  const stage = dev.gui.addFolder('sound stage').close();
  const stageState = {
    solo: 'all',
    reverb: '—',
    audition: () => {
      void auditionToConsole();
    },
  };
  stage
    .add(stageState, 'solo', ['all', ...STAGE_STATIONS])
    .name('solo')
    .onChange((value: string) => {
      zones.sound?.setSolo(value === 'all' ? null : value);
    });
  stage.add(stageState, 'reverb').listen().disable();
  // Renders the whole library offline and prints the table. A few seconds, and
  // it does not touch what you are listening to — a separate context entirely.
  stage.add(stageState, 'audition').name('audition the library');
  stage.add(meter, 'visible').name('spectrum');

  // --- generated Faust panels ----------------------------------------------
  //
  // Not written, read. Every compiled module declares its controls' ranges and
  // the build tool carries them through, so these folders build themselves —
  // which is the whole return on that change: `friction` had seven controls
  // and no panel, and the reverb had three hand-written sliders that covered
  // less than the module actually exposes. The generated one has `decayLow`
  // and `decayMid` separately, and the crossover between them, which is the
  // control a stone room actually needs.
  //
  // Each follows its model through zone changes and disappears with it, so the
  // panel always reflects what is currently audible rather than accumulating
  // folders for rooms you have left.
  const panels = [
    attachFaustPanel(stage, 'reverb', () => audio.reverbControls),
    // Every friction source in the game, by declared id. A lookup that finds
    // nothing simply has no folder, so this list can name sources that only
    // exist in one zone without the others carrying an empty control.
    ...['gantry', 'gate', 'limb', 'friction'].map((id) =>
      attachFaustPanel(stage, id, () => zones.sound?.find<FrictionModel>(id)?.loop ?? null),
    ),
    ...['pipe-air', 'waveguide'].map((id) =>
      attachFaustPanel(stage, id, () => zones.sound?.find<WaveguideModel>(id)?.loop ?? null),
    ),
  ];
  loop.add(() => {
    for (const panel of panels) panel.sync();
  });

  loop.add(() => {
    readout.speed = player.speed.toFixed(2);
    readout.grounded = player.isGrounded ? 'yes' : 'no';
    const p = player.position;
    readout.position = `${p.x.toFixed(1)}, ${p.y.toFixed(1)}, ${p.z.toFixed(1)}`;
    readout.zone = zones.current?.name ?? '—';
    readout.crossings = zones.crossings;
    readout.triangles = collider.triangles;
    // Read here rather than after the render: this runs at the top of the
    // frame, so it reports the frame just drawn. `info.reset()` happens inside
    // `postfx.render`, which is later in the same loop.
    const info = viewport.renderer.info.render;
    readout.draws = info.calls;
    readout.drawn = info.triangles.toLocaleString();
    // Chrome only, and behind a flag on some builds. Absent is a normal answer
    // rather than an error — this is the one number in the panel that says
    // whether a long session is leaking, and it is worth showing when it exists.
    const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory;
    readout.heap = memory ? `${(memory.usedJSHeapSize / 1048576).toFixed(0)} MB` : 'unavailable';
    readout.resident = `${zones.builtZones.length} / ${zones.evictions}`;
    readout.room = audio.room ?? 'open';
    stageState.reverb = audio.reverbKind === 'fdn' ? 'fdn — tunable' : 'convolution — fixed';
    readout.audio = footsteps === null ? 'rendering…' : audio.context.state;
    readout.gust = audio.weather.strength.toFixed(2);
    readout.swell = audio.weather.swell.toFixed(2);
    readout.machine = zones.sound?.find<MachineModel>('mill')?.phase ?? '—';
    // The voice budget, made visible. HRTF panning is the most expensive node
    // in the API, so "how many are running one" is the number that decides
    // whether a dense zone is affordable — and it is not a number worth
    // assuming.
    const voices = audio.voiceCounts;
    readout.emitters =
      zones.sound === null
        ? '—'
        : `${voices.hrtf} / ${voices.panned} / ${voices.virtual} · ${zones.sound.occludedCount} occl`;
  });
}

loop.add((dt, elapsed) => {
  player.update(dt);

  // A floor under the world, so a fall through a seam is recoverable rather
  // than permanent. Each zone sets its own — an interior's is just below its
  // floor, because down there is not a fall, it is a bug.
  const zone = zones.current;
  if (zone && player.position.y < zone.floor) zones.respawn();

  const focus = zones.update(elapsed);
  // Consumed unconditionally. Read only when something is in front of you, a
  // press aimed at nothing would sit in the buffer and fire at whatever you
  // happened to look at next.
  const interacted = input.takeInteract();
  if (interacted && focus) {
    // Two verbs, one key. Which one is decided by what is under the crosshair
    // rather than by a mode, so nothing has to be entered or left.
    if (focus.kind === 'door') void zones.use(focus.side);
    else reading.open(focus.note);
  }

  // The listener has to be moved before anything is judged against it, so the
  // engine is pumped first and hands back whether the occlusion raycasts are
  // due this frame.
  const retestOcclusion = audio.update(dt, viewport.camera);
  zones.updateSound(dt, retestOcclusion);

  // **After the audio, and that ordering is the point.** `audio.update` steps
  // the gust field; this ships the *same* field to the vertex shader. Done the
  // other way round the world would bend to one frame's weather while the
  // rustle answered the next, which is a whole frame of drift between a sight
  // and a sound that are meant to be one event.
  updateWind(audio.weather, elapsed);
  // After the wind, for the same reason: the cover reads the gust field the
  // trees just took. This ships the width clamp, the tread and the backlight.
  updateCover(viewport.camera, postfx.artHeight, player.position, zones.lights.sun);
  // And beside it, for the same reason: the sub-pixel clamp is measured in art
  // pixels, so it moves with the window and with the pixel-size setting.
  updateParticles(viewport.camera, postfx.artHeight);

  // **The hand-driven room switching is gone with the rooms.** The proving
  // ground used to contain a two-room stone building that was not a zone, so
  // nothing in the zone system knew about it and the acoustic, the wind bed
  // and the footstep surface all had to be swapped from here by testing the
  // listener's position against two boxes. Every one of those is a property of
  // a *zone*, and the sound stage is one — so all of it is declared now, and
  // the loop no longer has an opinion about where in a zone you are standing.
  postfx.render(elapsed);
  // After the render, and in the same frame: the default framebuffer is only
  // reliably readable before the browser composites it.
  crosshair.update();
  // After the render, so `renderer.info` describes the frame just drawn rather
  // than the one before it — `PostFX.render` resets those counters on its way
  // in. The debug readout reads them at the *top* of the frame and is a frame
  // behind for exactly that reason; this one does not have to be.
  perfHud.update(dt);
  dev.update();
});

// One frame drawn *before* the boot screen fades, so it reveals the world
// rather than an empty canvas. The composer has never run at this point — its
// render targets are allocated but nothing has been drawn into them — and
// fading out over that shows black for the length of the fade.
//
// The zero-length update is not a formality. `teleport` moves the *capsule*;
// the camera is only placed by `applyCamera`, which runs at the end of an
// update — so until one has happened the camera is still at the origin the
// `PerspectiveCamera` constructor left it at. Rendering before that draws the
// world from ground level, and the player sees themselves half sunk into the
// floor for a frame before the loop starts and pops them up to eye height.
player.update(0);
postfx.render(0);

await loader.done();
loop.start();
