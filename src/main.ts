import './styles.css';
import * as THREE from 'three';
import { Viewport } from './engine/Viewport';
import { Loop } from './engine/Loop';
import { PostFX } from './engine/PostFX';
import { Input, isTouchDevice } from './engine/Input';
import { Collider } from './player/Collider';
import { Controller } from './player/Controller';
import { TouchControls } from './ui/TouchControls';
import { ProvingGround, SPAWN, type SurfaceName } from './debug/ProvingGround';
import { SoundGarden } from './debug/SoundGarden';
import { AudioEngine } from './audio/AudioEngine';
import { createDevTools } from './debug/DevPanel';

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

const provingGround = new ProvingGround();
viewport.scene.add(provingGround.root);

const collider = new Collider();
// World transforms have to be current before triangles are read out of the
// scene graph, and nothing has rendered yet at this point.
provingGround.root.updateWorldMatrix(true, true);
collider.build(provingGround.root);

const input = new Input(canvas);
const player = new Controller(viewport.camera, input, collider);
player.teleport(SPAWN, 0);

// --- audio ----------------------------------------------------------------
// The engine exists immediately but its context is suspended until a gesture,
// and the emitters cannot be built until the noise buffers and room impulse
// responses have been rendered. So the garden arrives a beat late, and the
// frame loop has to cope with it not being there yet.
const audio = new AudioEngine();
let garden: SoundGarden | null = null;

void audio.ready.then(() => {
  garden = new SoundGarden(audio, provingGround, collider, viewport.camera);
  player.onFootstep = (speed) => garden?.footsteps.step(speed);
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

  const lights = dev.gui.addFolder('light').close();
  lights.add(provingGround.lights.sun, 'intensity', 0, 5, 0.1).name('sun');
  lights.add(provingGround.lights.sky, 'intensity', 0, 5, 0.1).name('ambient');

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
  // Bound late: the garden does not exist until the impulse responses finish
  // rendering, so the controller reads through a getter rather than a value.
  weather
    .add({ get windTone() { return garden?.tuning.windTone ?? 3400; } }, 'windTone', 700, 9000, 50)
    .name('wind softness')
    .onChange((value: number) => {
      if (garden) garden.tuning.windTone = value;
    });
  weather
    .add(
      { get leaves() { return garden?.tuning.foliageArticulation ?? 1; } },
      'leaves',
      0,
      2.5,
      0.05,
    )
    .name('leaf articulation')
    .onChange((value: number) => {
      if (garden) garden.tuning.foliageArticulation = value;
    });
  weather
    .add({ get machineRpm() { return garden?.tuning.machineRpm ?? 52; } }, 'machineRpm', 0, 200, 1)
    .name('machine rpm')
    .onChange((value: number) => {
      if (garden) garden.tuning.machineRpm = value;
    });

  // A readout rather than a control: what the controller thinks is happening,
  // which is the only way to tell a tuning problem from a collision problem.
  const readout = {
    speed: '0.00',
    grounded: 'no',
    position: '',
    triangles: collider.triangles,
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
  state.add(readout, 'room').listen().disable();
  state.add(readout, 'audio').listen().disable();
  state.add(readout, 'gust').listen().disable();
  state.add(readout, 'swell').listen().disable();
  state.add(readout, 'machine').listen().disable();
  state.add(readout, 'emitters').name('audible / occluded').listen().disable();
  state.add(readout, 'triangles').disable();
  state.add({ respawn: () => player.teleport(SPAWN, 0) }, 'respawn');

  loop.add(() => {
    readout.speed = player.speed.toFixed(2);
    readout.grounded = player.isGrounded ? 'yes' : 'no';
    const p = player.position;
    readout.position = `${p.x.toFixed(1)}, ${p.y.toFixed(1)}, ${p.z.toFixed(1)}`;
    readout.room = audio.room ?? 'open';
    readout.audio = garden === null ? 'rendering…' : audio.context.state;
    readout.gust = audio.weather.strength.toFixed(2);
    readout.swell = audio.weather.swell.toFixed(2);
    readout.machine = garden?.machinePhase ?? '—';
    readout.emitters =
      garden === null ? '—' : `${garden.audibleCount} / ${garden.occludedCount}`;
  });
}

// A floor under the world, so a fall through a seam is recoverable rather than
// permanent. Real death planes belong to zones in Phase 5.
const VOID_Y = -20;

loop.add((dt, elapsed) => {
  player.update(dt);
  if (player.position.y < VOID_Y) player.teleport(SPAWN, 0);
  garden?.update(dt);
  postfx.render(elapsed);
  dev.update();
});

loop.start();
