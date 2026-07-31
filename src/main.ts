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
import type { WindModel } from './audio/models/wind';
import type { FoliageModel } from './audio/models/foliage';
import type { MachineModel } from './audio/models/machine';
import type { FireModel } from './audio/models/fire';
import type { RainModel } from './audio/models/rain';
import type { WaterModel } from './audio/models/water';
import { createGallery, galleryOrder } from './debug/Gallery';
import { AudioEngine } from './audio/AudioEngine';
import { createDevTools } from './debug/DevPanel';
import { ZoneManager } from './world/ZoneManager';
import { Interaction } from './world/Interaction';
import { Reticle, Fade } from './ui/Reticle';
import { createTestWorld, ZONE_EXTERIOR, ZONE_VILLAGE } from './debug/zones';
import { Loader } from './ui/Loader';

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

const postfx = new PostFX(viewport);
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

// Built here rather than inside the zone builder so it gets its own step — it
// is two dozen builders at eight instances each and the single heaviest thing
// in the boot.
const gallery = await loader.step('raising the props', 0.42, () => createGallery());

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

const world = createTestWorld(provingGround, { gallery: () => gallery });
for (const definition of world.zones) zones.register(definition);
// Linked after every zone is registered — a portal to an unregistered zone
// throws here rather than when somebody opens the door.
for (const portal of world.portals) zones.link(portal);

// Builds the exterior's geometry and indexes all of it for collision, which on
// a world this size is a couple of hundred milliseconds on its own.
await loader.step('settling the world', 0.6, () => zones.enter(ZONE_EXTERIOR));

// Built now rather than on first entry. A zone this size takes longer to raise
// than the transition fade is black for, so paying it here keeps the doorway
// instant — and the collider caches it, so it is paid exactly once.
await loader.step('raising arkstin', 0.78, () => zones.prebuild(ZONE_VILLAGE));

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
 * Which of the proving ground's test rooms the listener is standing in.
 *
 * `undefined` rather than `null` to start, so the first frame applies whatever
 * it finds — `null` is a legitimate value here and means "outdoors".
 */
let lastRoom: string | null | undefined = undefined;

/**
 * Base leaf articulation per foliage emitter, so one slider can scale them all.
 *
 * Read off the specs rather than guessed: a hedge ticks where a canopy hushes,
 * and a single absolute value applied to both flattens that distinction.
 */
const FOLIAGE_BASE = new Map<string, number>([
  ['canopy', 0.22],
  ['shrub-a', 0.34],
  ['shrub-b', 0.34],
  ['wood-north', 0.2],
  ['wood-east', 0.22],
  ['hedge', 0.34],
]);

await loader.step('rendering the rooms', 0.86, () => audio.ready);

await loader.step('tuning the air', 0.96, () => {
  footsteps = new Footsteps(audio, 0.55);
  player.onFootstep = (speed) => {
    if (!footsteps) return;
    // Sampled per step rather than per zone: outdoors the ground cover changes
    // under you, and a cobbled lane that sounds like the grass beside it is
    // only paint.
    const at = player.position;
    footsteps.surface = zones.surfaceAt(at.x, at.z);
    footsteps.step(speed);
  };
  // Landing is part of the same system — same surface, same models, different
  // gesture. Without this, jumping on the spot is completely silent.
  player.onLand = (impact) => {
    if (!footsteps) return;
    const at = player.position;
    footsteps.surface = zones.surfaceAt(at.x, at.z);
    footsteps.land(impact);
  };
  // The push-off. The controller decides whether this one counts — a hop
  // chained straight off a landing does not, because the landing was the same
  // contact with the ground.
  player.onJump = () => {
    if (!footsteps) return;
    const at = player.position;
    footsteps.surface = zones.surfaceAt(at.x, at.z);
    footsteps.jump();
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

if (dev.gui) {
  const r = postfx.settings;
  const refresh = (): void => postfx.apply();

  const look = dev.gui.addFolder('look');
  look.add(r, 'pixelSize', 1, 12, 1).onChange(refresh);
  look.add(r, 'normalEdgeStrength', 0, 2, 0.05).onChange(refresh);
  look.add(r, 'depthEdgeStrength', 0, 2, 0.05).onChange(refresh);
  look.add(r, 'quantize', ['off', 'levels', 'palette']).onChange(refresh);
  look.add(r, 'levels', 2, 16, 1).onChange(refresh);
  look.add(r, 'ditherScale', 0, 2, 0.05).name('dither (steps)').onChange(refresh);
  look
    .add(r, 'ditherPattern', { bayer: 'bayer', 'blue noise': 'blue', 'gradient noise': 'noise' })
    .onChange(refresh);
  look.add(r, 'ditherMatrix', { '2×2': 2, '4×4': 4, '8×8': 8 }).name('bayer size').onChange(refresh);

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

  const fogFolder = dev.gui.addFolder('fog').close();
  fogFolder.add(r, 'linkFogToSky').name('match horizon').onChange(refresh);
  fogFolder.addColor(r, 'fogColor').onChange(refresh);
  fogFolder.add(r, 'fogNear', 0, 200, 1).onChange(refresh);
  fogFolder.add(r, 'fogFar', 0, 400, 1).onChange(refresh);

  // Sixteen colour pickers is a lot of panel, but a palette is not something
  // that can be judged from a number — it has to be seen against the scene.
  const paletteFolder = dev.gui.addFolder('palette').close();
  r.palette.forEach((_, index) => {
    paletteFolder.addColor(r.palette, index).name(`${index}`).onChange(refresh);
  });

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
  view.add(t, 'sprintFov', 50, 120, 1);

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
  // Bound through the active zone's soundscape rather than to a model directly.
  // A zone declares its sound as data and the models are built on entry, so a
  // panel that captured one at startup would be tuning the proving ground's
  // tree while the player stands in Arkstin. `find` looks it up by the `id` the
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
    gallery: galleryOrder(),
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
  // Triangles change with the zone now, so this has to be watched rather than
  // read once — it is also the first place a collider leak would show up.
  state.add(readout, 'triangles').listen().disable();
  state.add(readout, 'gallery').name('gallery order').disable();
  state.add({ respawn: () => zones.respawn() }, 'respawn');

  // Jumping straight to a zone, without walking to its door. Mostly for
  // getting back out of an interior after breaking the door that leads there.
  const travel = dev.gui.addFolder('zones');
  for (const zone of zones.zones.values()) {
    travel.add({ go: () => zones.enter(zone.id) }, 'go').name(zone.name);
  }

  loop.add(() => {
    readout.speed = player.speed.toFixed(2);
    readout.grounded = player.isGrounded ? 'yes' : 'no';
    const p = player.position;
    readout.position = `${p.x.toFixed(1)}, ${p.y.toFixed(1)}, ${p.z.toFixed(1)}`;
    readout.zone = zones.current?.name ?? '—';
    readout.crossings = zones.crossings;
    readout.triangles = collider.triangles;
    readout.room = audio.room ?? 'open';
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

  const door = zones.update();
  // Consumed unconditionally. Read only when a door is in front of you, a
  // press aimed at nothing would sit in the buffer and fire at whatever you
  // happened to look at next.
  const interacted = input.takeInteract();
  if (interacted && door) void zones.use(door);

  // The listener has to be moved before anything is judged against it, so the
  // engine is pumped first and hands back whether the occlusion raycasts are
  // due this frame.
  const retestOcclusion = audio.update(dt, viewport.camera);
  zones.updateSound(dt, retestOcclusion);

  // The proving ground's two test rooms are rooms *within* the exterior zone
  // rather than zones of their own — the Phase 3 acoustics fixture — so nothing
  // in the zone system knows about them and this has to be driven by hand.
  if (zones.current?.id === ZONE_EXTERIOR) {
    const room = provingGround.roomAt(audio.listenerPosition);
    if (room !== lastRoom) {
      lastRoom = room;
      audio.setRoom(room ?? 'open');
      // Inside one of the rooms the wind bed drops away and loses its top end:
      // you are hearing it through a wall, and the whistle is the first thing
      // a wall takes.
      zones.sound?.setBedLevel(room === null ? 1 : 0.22);
      zones.sound?.find<WindModel>('wind')?.setTone(room === null ? 3400 : 900);
      if (footsteps) footsteps.surface = room === null ? 'earth' : 'stone';
    }
  }

  // The wheel you can see turns at the speed the clank you can hear is firing
  // at, phase cycle included, so it visibly labours and surges.
  provingGround.update(dt, zones.sound?.find<MachineModel>('mill')?.currentRpm ?? 0);
  postfx.render(elapsed);
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
