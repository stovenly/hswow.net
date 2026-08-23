import { DEFAULT_TUNING } from '../../player/Controller';
import { DEFAULT_AUDIO } from '../../audio/AudioEngine';
import { setSwayOption } from '../../art/sway';
import { setClothSimulation } from '../../engine/ClothActivity';
import { setPrecipitation } from '../../art/particles';
import { setLightning } from '../../world/lightning';
import { effective, type Options } from './model';
import { setDyslexicFont } from './font';
import type { AudioEngine } from '../../audio/AudioEngine';
import { VIEW_UNLIMITED, type PostFX } from '../../engine/PostFX';
import type { ZoneManager } from '../../world/ZoneManager';
import type { Controller } from '../../player/Controller';
import type { Input } from '../../engine/Input';
import type { Loop } from '../../engine/Loop';
import type { PerformanceHud } from '../Performance';

/**
 * Where the player's settings meet the engine. One function, called with the
 * whole options object every time anything changes — deliberately blunt: a
 * per-option dispatch table would be faster and would also be a dozen places
 * to forget, and this runs when a slider moves, not sixty times a second.
 *
 * **Everything applies live, with one exception.** Nothing is read at boot and
 * cached, so dragging the field of view moves the camera under the panel and
 * the colourblind correction changes the picture behind the menu as the slider
 * moves. That is why the scrim is barely tinted. The exception is the audio
 * buffer, which `audioLatencyHint` hands to the engine once at boot, because a
 * context's buffer size is fixed the moment it is opened.
 *
 * The unit conversions live here rather than in `model.ts` because they are
 * facts about the engine, not about the settings.
 */

export interface OptionTargets {
  audio: AudioEngine;
  postfx: PostFX;
  zones: ZoneManager;
  player: Controller;
  input: Input;
  loop: Loop;
  performance: PerformanceHud;
}

/**
 * The lowest sensitivity the slider can actually apply. The slider reads 0 at
 * the bottom, and 0 is a camera that cannot be turned at all — a setting whose
 * only effect is to make the game look frozen. Two per cent of the default:
 * slow enough to be indistinguishable from stopped, fast enough to get back to
 * the menu and undo it.
 */
const MIN_SENSITIVITY = 0.1;

/** Sensitivity 5 is the tuned default; the scale either side of it is linear. */
const SENSITIVITY_MIDPOINT = 5;

/**
 * The interface size the text-size slider counts from, in CSS pixels. Two above
 * the browser's usual 16: the panel is set in a monospace face at well under a
 * rem for most of its text, and the slider runs either side of the baseline
 * rather than only upwards.
 */
const BASE_FONT_PX = 18;

/**
 * The one setting that cannot be applied live, resolved for the engine's
 * constructor. Called from `main.ts` before the engine exists, which is the
 * only moment it can be and the reason it is a separate function.
 */
export function audioLatencyHint(options: Options): AudioContextLatencyCategory {
  return options.audioBuffer === 'large' ? 'playback' : 'interactive';
}

export function applyOptions(stored: Options, targets: OptionTargets): void {
  // `performance` is a global; bound to a short name here rather than
  // destructured under its own, so nothing in this function can reach for the
  // wrong one.
  const { audio, postfx, zones, player, input, loop, performance: perf } = targets;
  const tuning = player.tuning;
  // The overrides resolved once, here, so nothing below has to remember that
  // reduced motion exists — see `effective`.
  const options = effective(stored);

  // --- audio ---------------------------------------------------------------
  // Every slider is a percentage of the level the game is mixed at, so 100 is
  // the sound as designed and none of them can push the limiter into working.
  audio.settings.masterVolume = DEFAULT_AUDIO.masterVolume * (options.masterVolume / 100);
  audio.settings.musicVolume = DEFAULT_AUDIO.musicVolume * (options.musicVolume / 100);
  audio.settings.ambienceVolume = DEFAULT_AUDIO.ambienceVolume * (options.ambientVolume / 100);
  audio.settings.weatherVolume = DEFAULT_AUDIO.weatherVolume * (options.weatherVolume / 100);
  audio.settings.footstepVolume = DEFAULT_AUDIO.footstepVolume * (options.footstepVolume / 100);
  audio.settings.creatureVolume = DEFAULT_AUDIO.creatureVolume * (options.creatureVolume / 100);
  audio.settings.npcVolume = DEFAULT_AUDIO.npcVolume * (options.npcVolume / 100);

  // --- video ---------------------------------------------------------------
  // Snapped rather than eased — see `setFieldOfView`. A slider whose picture
  // arrives half a second after the number is a slider you cannot judge.
  //
  // Sprint zoom off is a boost of zero: the effect is a delta, so removing it
  // is setting it to nothing rather than making two numbers equal.
  player.setFieldOfView(
    options.fov,
    options.sprintZoom ? DEFAULT_TUNING.sprintFovBoost : 0,
    options.fovScaling,
  );
  postfx.setDither(options.dither);
  postfx.setPixelation(options.pixelation);
  postfx.setAntialias(options.antialias);
  postfx.setAmbientOcclusion(options.ambientOcclusion);
  postfx.setBloom(options.bloom);
  postfx.setColorblind(options.colorblind, options.colorblindStrength / 100);
  postfx.setGroundcover(options.groundcoverDensity);
  // Null rather than the number at the top of the slider: unlimited means the
  // camera's own far plane, so the clutter cull and the fog clamp are off
  // entirely rather than arithmetically harmless.
  postfx.setViewDistance(
    options.viewDistance >= VIEW_UNLIMITED ? null : options.viewDistance,
  );
  zones.setShadows(options.shadows);
  // `uncapped` is not a number, and anything else stored there would be, so a
  // failed parse and the deliberate case land in the same place.
  const cap = Number.parseInt(options.fpsCap, 10);
  loop.setFpsCap(Number.isFinite(cap) ? cap : null);
  perf.setMode(options.performance);

  // --- controls ------------------------------------------------------------
  tuning.lookSensitivity =
    (DEFAULT_TUNING.lookSensitivity * Math.max(options.sensitivity, MIN_SENSITIVITY)) /
    SENSITIVITY_MIDPOINT;
  tuning.invertY = options.invertY;
  tuning.invertX = options.invertX;
  input.setSprintMode(options.sprintMode);
  input.setCrouchMode(options.crouchMode);

  // --- accessibility -------------------------------------------------------
  setSwayOption(options.windSway);
  // Off freezes cloth in its settled pose; the wind-sway option above already
  // scales cloth's wind response, so the two compose. Read off the stored
  // value rather than the effective one — reduced motion does not gate it.
  setClothSimulation(stored.clothSim);
  setPrecipitation(options.precipitation);
  setLightning(options.lightning);
  postfx.setWaterMotion(options.waterMotion);
  tuning.bobScale = options.headBob ? 1 : 0;
  setDyslexicFont(options.dyslexicFont);
  // The root size, so every `rem` in the interface follows it. Nothing in the
  // world is measured in `rem`, so this moves the HUD and the menus and leaves
  // the game alone.
  document.documentElement.style.fontSize = `${BASE_FONT_PX + options.fontSize}px`;
}
