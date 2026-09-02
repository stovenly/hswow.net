import '../styles.css';
import * as THREE from 'three';
import { Viewport } from '../engine/Viewport';
import { Loop } from '../engine/Loop';
import { PostFX } from '../engine/PostFX';
import { useAerialFog } from '../engine/fog';
import { Input } from '../engine/Input';
import { Collider } from '../player/Collider';
import { Controller } from '../player/Controller';
import { Footsteps } from '../audio/models/footsteps';
import { AudioEngine } from '../audio/AudioEngine';
import { createDevTools, type DevTools } from '../dev/DevPanel';
import { warmRamps } from '../art/glsl/ramp';
import { zoneCache } from '../engine/work/cache';
import { Identify } from '../dev/Identify';
import { ZoneManager, type Focus } from '../world/ZoneManager';
import type { Project } from './project';
import { contentWorld, loadSidecars } from './content';
import { Climate } from '../world/climate';
import { WeatherRig } from '../world/WeatherRig';
import { Interaction, type NpcMark } from '../world/Interaction';
import { Dialogue } from '../ui/Dialogue';
import { apply, converse, pick } from '../world/dialogue';
import { worldState } from '../world/state';
import type { Creature } from '../life/Creature';
import { Reticle, Fade } from '../ui/Reticle';
import { Crosshair } from '../ui/Crosshair';
import { patchArtMaterial, updateWind } from '../art/sway';
import { updateCover } from '../art/cover';
import { updateParticles } from '../art/particles';
import { installReloadBanner } from '../dev/HotReload';
import { watchCompiles } from '../dev/compileWatch';
import { loadingScreen } from '../ui/LoadingScreen';
import {
  audioLatencyHint,
  installOptions,
  loadOptions,
  type Options,
  type OptionsHandle,
} from '../ui/options';
import { Reading } from '../ui/Reading';
import { PerformanceHud } from '../ui/Performance';

/**
 * The boot sequence, once. The game page and the editor page both run it, so
 * neither holds a private copy of the ordering it depends on.
 */

export interface AppOptions {
  canvas: HTMLCanvasElement;
  overlay: HTMLElement;
  project: Project;
  /** Whether boot enters `project.entry` behind the bar. The editor asks; the game page boots to the title. */
  enter?: boolean;
}

export interface App {
  readonly viewport: Viewport;
  readonly loop: Loop;
  readonly postfx: PostFX;
  readonly collider: Collider;
  readonly input: Input;
  readonly player: Controller;
  readonly zones: ZoneManager;
  readonly audio: AudioEngine;
  readonly climate: Climate;
  readonly weather: WeatherRig;
  readonly options: Options;
  readonly settings: OptionsHandle;
  readonly reading: Reading;
  readonly identify: Identify;
  readonly dev: DevTools;
  readonly project: Project;
  /** Null until the audio has finished rendering its buffers. */
  readonly footsteps: Footsteps | null;
  /** Elapsed seconds the loop last saw, frozen while `identify` is up. */
  readonly clock: number;
  /**
   * Whether the world is *running* as against being looked at. The editor
   * turns it off outside Play: a villager who wanders off while you are placing
   * him cannot be placed. Anything added later that moves things of its own
   * accord is gated on it in the frame loop.
   */
  simulate: boolean;
  /**
   * First say over what the interact key does. Called before the default door
   * and reading verbs; returning true consumes the press. How the game page
   * adds verbs — items, containers — without the boot learning them.
   */
  interceptInteract: ((focus: Focus) => boolean) | null;
  /** Runs inside the frame loop, after the player has moved and before the render. Returns an unsubscribe. */
  onFrame(fn: (dt: number, elapsed: number) => void): () => void;
  /** Registers the frame loop, lifts the loading screen and starts running. */
  start(): Promise<void>;
}

export async function createApp({ canvas, overlay, project, enter = false }: AppOptions): Promise<App> {
  const viewport = new Viewport(canvas, loadOptions().lowLatency);
  zoneCache.project = project.id;
  const loop = new Loop();
  const dev = await createDevTools();
  // The debug picker, and the last clock the loop saw — held while it is up so nothing moves.
  const identify = new Identify(viewport.scene, viewport.camera, canvas);
  let clock = 0;

  // Created before PostFX, which owns the fog's colour and distances from here on.
  viewport.scene.fog = new THREE.Fog(0x0a0a0f, 20, 90);

  // Dev server only, compiled out of the production build. Cancels Vite's full
  // reload and shows a banner instead — a reload drops pointer lock and sends you
  // back to spawn.
  installReloadBanner();

  // **Before anything compiles a program.** Materials bake the fog chunk in at
  // compile time, so this has to happen before the first material is built or the
  // session runs on planar fog whatever the source says. See `engine/fog.ts`.
  useAerialFog();

  // **Before PostFX**, and load-bearing. The kit's shared material is patched in
  // place, so a prop built later picks the sway up without knowing about it — and
  // `PostFX` reaches into the normal pass and patches *that* material too, which
  // it can only do once the patch exists.
  patchArtMaterial();

  const postfx = new PostFX(viewport);
  const crosshair = new Crosshair(viewport.renderer);
  viewport.onResize = () => postfx.resize();

  const collider = new Collider();
  const input = new Input(canvas);
  const player = new Controller(viewport.camera, input, collider);

  // --- boot -------------------------------------------------------------------
  // Sequenced behind a loading screen rather than run in one synchronous burst.
  // None of this is a download — every triangle and every sample is generated
  // here — so there is no network progress to report, but there is easily a
  // second of work, and a second of blank page looks like a fault.
  const loader = loadingScreen();


  // --- zones ------------------------------------------------------------------
  // Nothing is added to the scene or to the collider here. `ZoneManager.enter`
  // owns both, because exactly one zone is ever present in either.
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
  // preferences on one machine. Separate store, separate lifetime.
  const options = loadOptions();

  // Documents first, then the project's code zones: a portal end reads the
  // document zone it stands in, and the manager throws on a link to a zone it
  // has not been given.
  await loader.step('reading the ground', 0.08, () => {
    warmRamps();
    return loadSidecars(project.id);
  });
  const documents = contentWorld(project.id);
  const code = (await project.world?.(loader)) ?? { zones: [], portals: [] };
  const world = {
    zones: [...documents.zones, ...code.zones],
    portals: [...documents.portals, ...code.portals],
  };
  for (const definition of world.zones) zones.register(definition);
  // Linked after every zone is registered — a portal to an unregistered zone
  // throws here rather than when somebody opens the door.
  for (const portal of world.portals) zones.link(portal);

  // Builds the exterior's geometry and indexes all of it for collision, which on
  // a world this size is a couple of hundred milliseconds on its own.
  //
  // Shadows are set ahead of the first build rather than in `applyOptions`, which
  // cannot run until the audio engine exists. The flag is read as a zone's meshes
  // are prepared, so setting it afterwards would raise the exterior with the
  // wrong casters and then walk all of it again to correct them.
  zones.setShadows(options.shadows);
  postfx.aimSun(zones.sunDirection);

  if (enter) {
    await loader.step('settling the world', 0.55, () => zones.prebuild(project.entry));
    // The entry of a built zone is its compile, so the wait carries its name.
    await loader.step('compiling materials', 0.7, () => zones.enter(project.entry));
  }

  // Built now rather than on first entry, so a doorway into it is instant. Only
  // where boot enters: raising a zone is one synchronous burst that cannot yield,
  // and a title screen is being clicked on while this would run.
  if (enter) {
    for (const id of project.prebuild ?? []) {
      await loader.step('raising the countryside', 0.78, () => zones.prebuild(id));
    }
  }

  // --- audio ----------------------------------------------------------------
  // The context is suspended until a gesture, but the noise buffers and the room
  // impulse responses are rendered offline regardless, and the emitters cannot be
  // built until they are done. The buffer size is read here rather than in
  // `applyOptions`: it can only be chosen as the context is opened.
  const audio = new AudioEngine(audioLatencyHint(options));

  /**
   * The clock, the wind and the weather — one object deciding what today is,
   * everywhere at once — and the rig that applies it to the world. The wind field
   * itself still belongs to the audio engine, which steps it; the climate writes
   * its settings and reads it back.
   */
  const climate = new Climate(audio.weather);

  const weather = new WeatherRig(climate, viewport.scene);

  /**
   * Your own feet, which belong to you rather than to any zone. Everything else
   * audible is declared by the zone you are standing in; footsteps happen *at*
   * the listener, follow you through every door, and would be wrong to tear down
   * and rebuild on a threshold.
   */
  let footsteps: Footsteps | null = null;


  await loader.step('rendering the rooms', 0.86, () => audio.ready);

  await loader.step('tuning the air', 0.96, () => {
    footsteps = new Footsteps(audio, 0.55);
    player.onFootstep = (step) => {
      if (!footsteps) return;
      // Sampled per step rather than per zone: outdoors the ground cover changes
      // under you, and a cobbled lane that sounds like the grass beside it is
      // only paint.
      const at = player.position;
      footsteps.surface = weather.surface ?? zones.surfaceAt(at.x, at.z);
      footsteps.step(step);
    };
    // Landing is part of the same system — same surface, same models, different
    // gesture. Without this, jumping on the spot is completely silent.
    player.onLand = (impact, horizontal) => {
      if (!footsteps) return;
      const at = player.position;
      footsteps.surface = weather.surface ?? zones.surfaceAt(at.x, at.z);
      footsteps.land(impact, horizontal);
    };
    // The push-off. The controller decides whether this one counts — a hop
    // chained straight off a landing does not, because the landing was the same
    // contact with the ground.
    player.onJump = (speed) => {
      if (!footsteps) return;
      const at = player.position;
      footsteps.surface = weather.surface ?? zones.surfaceAt(at.x, at.z);
      footsteps.jump(speed);
    };
    // Attaching builds the current zone's soundscape, including the one the
    // player was already standing in before the audio existed.
    zones.attachAudio({ engine: audio, footsteps });
  });

  input.onLockChange = (locked) => document.body.classList.toggle('is-playing', locked);

  // --- options ----------------------------------------------------------------
  //
  // Installed here rather than at load because half of what they touch — the
  // audio engine most of all — does not exist until boot has finished. Everything
  // they govern has a sensible value in the meantime, and the two that have to be
  // right *before* the world is raised are set above.
  //
  // Named `perfHud` rather than `performance`, which is a global this file
  // already reads for the heap size.
  const perfHud = new PerformanceHud(overlay, viewport.renderer, postfx.gpu);
  const compiles = watchCompiles(viewport.renderer);

  // The reading screen. Not a pause: the world keeps running behind it, exactly
  // as it does behind the options panel — what stops is *steering*, and that
  // falls out of releasing the pointer lock, because `Input` already ignores the
  // whole keyboard while the mouse is free.
  //
  // Closing puts the mouse back exactly where it was rather than always taking
  // it: a note opened from the world was opened by somebody who was playing, and
  // one opened from the debug panel was not.
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
      // the page closes and the lock does not come back on that frame — the
      // browser holds a cooldown after a user-initiated exit — so without this
      // the interface believes nobody is playing and raises the capture panel.
      document.body.classList.add('is-capturing');
      void input.capture().finally(() => document.body.classList.remove('is-capturing'));
    },
  });

  // The one place in the game that takes the camera. `converse` holds the view
  // on the villager's head; `release` hands it back where it rests.
  let talkingTo: Creature | null = null;
  let talkTurn = 0;
  const _head = new THREE.Vector3();
  const dialogue = new Dialogue(overlay, {
    onOpen: () => {
      wasPlaying = input.locked;
      document.exitPointerLock();
    },
    onClose: () => {
      talkingTo?.endConverse();
      talkingTo = null;
      player.release();
      if (!wasPlaying) return;
      document.body.classList.add('is-capturing');
      void input.capture().finally(() => document.body.classList.remove('is-capturing'));
    },
  });

  /** Opens a conversation, and takes the camera onto whoever it is with. */
  const openTalk = (mesh: THREE.Object3D, mark: NpcMark): void => {
    if (dialogue.isOpen) return;
    const creature = zones.creatureFor(mesh);
    // Refused mid street meeting: the prompt still names them, E just does
    // nothing until they are finished with each other.
    if (!creature || creature.inConverse || creature.inMeeting) return;
    const talk = converse(mark, worldState, creature.doing);
    if (talk.greeting.length === 0) return;
    const turn = talkTurn++;
    talkingTo = creature;
    creature.beginConverse();
    dialogue.open({
      name: mark.name,
      greeting: pick(talk.greeting, creature.spec.seed, turn),
      farewell: pick(talk.farewell, creature.spec.seed, turn),
      topics: () =>
        converse(mark, worldState, creature.doing).topics.map((topic) => ({
          ...topic,
          chosen: topic.then
            ? () => apply(topic.then, worldState, { person: mark.person, name: mark.name })
            : undefined,
        })),
      speak: (text, manner) => creature.say(text, manner),
      hush: () => creature.hush(),
      away: () => creature.mesh.position.distanceTo(player.position),
    });
  };

  const settings = installOptions(options, overlay, {
    audio,
    postfx,
    zones,
    player,
    input,
    loop,
    performance: perfHud,
  });


  let simulate = true;
  let interceptInteract: ((focus: Focus) => boolean) | null = null;
  const frameHooks = new Set<(dt: number, elapsed: number) => void>();

  const start = async (): Promise<void> => {
    loop.add((rawDt, rawElapsed) => {
      const dt = identify.active ? 0 : rawDt;
      const elapsed = identify.active ? identify.frozenElapsed : rawElapsed;
      clock = elapsed;
      // Held on the head every frame, so a villager still settling into its own
      // turn is tracked rather than landed short of. Before the controller runs.
      if (talkingTo) player.converse(talkingTo.head(_head));
      dialogue.update(dt);
      // Not before somewhere exists to stand: with no collider the player falls.
      if (zones.current) player.update(dt);

      // A floor under the world, so a fall through a seam is recoverable rather
      // than permanent. Each zone sets its own — an interior's is just below its
      // floor, because down there is not a fall, it is a bug.
      const zone = zones.current;
      // Not while flying: the debug camera goes under the world on purpose, and
      // being teleported back for it makes the mode useless.
      if (zone && !player.noclip && player.position.y < zone.floor) zones.respawn();

      const focus = zones.update(elapsed);
      // Consumed unconditionally. Read only when something is in front of you, a
      // press aimed at nothing would sit in the buffer and fire at whatever you
      // happened to look at next.
      const interacted = input.takeInteract();
      if (interacted && focus && !interceptInteract?.(focus)) {
        // The verbs are decided by what is under the crosshair rather than by a
        // mode, so nothing has to be entered or left.
        if (focus.kind === 'door') void zones.use(focus.side);
        else if (focus.kind === 'read') reading.open(focus.note);
        else if (focus.kind === 'talk') openTalk(focus.object, focus.npc);
      }

      for (const fn of frameHooks) fn(dt, elapsed);

      // The listener has to be moved before anything is judged against it, so the
      // engine is pumped first and hands back whether the occlusion raycasts are
      // due this frame.
      const retestOcclusion = audio.update(dt, viewport.camera);
      zones.updateSound(dt, retestOcclusion);
      // The creatures, once the listener stands where it stands this frame.
      // Stepped by zero rather than skipped, so a creature still holds a
      // settled pose rather than the bind pose it was built in.
      zones.updateLife(simulate ? dt : 0, retestOcclusion);

      // **After the audio, and that ordering is the point.** `audio.update` steps
      // the gust field; this ships the *same* field to the vertex shader. The other
      // way round the world bends to one frame's weather while the rustle answers
      // the next — a whole frame of drift between a sight and a sound that are
      // meant to be one event.
      updateWind(audio.weather, elapsed);
      // After the wind has been stepped and shipped, and before anything is drawn:
      // the sun moves, so the light rig, the dome and the shadow camera are all
      // per-frame now. Nothing here may bake.
      weather.update(dt, postfx, zones, audio, viewport.camera);
      // After the wind for the same reason again: each cloth samples the same
      // field the trees just bent to, so a gust arrives at the flag and the tree
      // beside it on the same frame.
      zones.updateCloth(dt, audio.weather);
      // Packs the active zone's glitch volumes for the frame about to be drawn —
      // attached volumes follow their object's matrix, so this has to run after
      // everything that moves and before the render that reads the uniforms.
      zones.updateGlitch(elapsed);
      // And the horror volumes beside them, for the same reason — plus the
      // unwatched gate, which reads the camera this same frame.
      zones.updateHorror(elapsed);
      // After the wind, for the same reason: the cover reads the gust field the
      // trees just took. This ships the width clamp, the tread and the backlight.
      updateCover(viewport.camera, postfx.artHeight, player.position, zones.lights.sun);
      // And beside it, for the same reason: the sub-pixel clamp is measured in art
      // pixels, so it moves with the window and with the pixel-size setting.
      updateParticles(viewport.camera, postfx.artHeight);

      // Every acoustic, wind bed and footstep surface is a property of a *zone* and
      // is declared as one, so the loop has no opinion about where inside a zone
      // the player is standing.
      postfx.render(elapsed);
      // After the render, and in the same frame: the default framebuffer is only
      // reliably readable before the browser composites it.
      crosshair.update(player.camera);
      // After the render, so `renderer.info` describes the frame just drawn rather
      // than the one before it — `PostFX.render` resets those counters on its way
      // in. The debug readout reads them at the *top* of the frame and is a frame
      // behind for exactly that reason; this one does not have to be.
      perfHud.update(dt);
      compiles(dt, zones.current !== null);
      dev.update();
    });

    // One frame drawn *before* the boot screen fades, so it reveals the world
    // rather than an empty canvas: the pipeline's targets are allocated and empty
    // at this point, and fading out over that shows black for the length of the
    // fade.
    //
    // The zero-length update is not a formality. `teleport` moves the *capsule*;
    // the camera is only placed by `applyCamera`, which runs at the end of an
    // update — so until one has happened the camera is still where the
    // `PerspectiveCamera` constructor left it, at the origin.
    player.update(0);
    // Before that first real frame, and behind the boot screen: every effect pass
    // forced on for two throwaway frames, so water, glass, glitch, horror and the
    // effect mask compile here rather than on the frame a fade lifts. See `prewarm`.
    postfx.prewarm();
    postfx.render(0);

    await loader.done();
    loop.start();

    // Unawaited on purpose: the countryside's programs compile on driver threads
    // while the player stands at spawn. Reaching its door first just means the
    // entry awaits the remainder behind the fade.
    // Unawaited, but not free: it builds the zone to compile it, and that build
    // blocks. Same reason as the prebuild above — never under a live title.
    if (enter) for (const id of project.precompile ?? []) void zones.precompile(id);
  };

  return {
    viewport,
    loop,
    postfx,
    collider,
    input,
    player,
    zones,
    audio,
    climate,
    weather,
    options,
    settings,
    reading,
    identify,
    dev,
    project,
    get footsteps() {
      return footsteps;
    },
    get clock() {
      return clock;
    },
    get simulate() {
      return simulate;
    },
    set simulate(on: boolean) {
      simulate = on;
    },
    get interceptInteract() {
      return interceptInteract;
    },
    set interceptInteract(fn: ((focus: Focus) => boolean) | null) {
      interceptInteract = fn;
    },
    onFrame(fn: (dt: number, elapsed: number) => void) {
      frameHooks.add(fn);
      return () => frameHooks.delete(fn);
    },
    start,
  };
}
