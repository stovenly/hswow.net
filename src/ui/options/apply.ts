import { DEFAULT_TUNING } from '../../player/Controller';
import { DEFAULT_AUDIO } from '../../audio/AudioEngine';
import { setSwayOption } from '../../art/sway';
import { effective, type Options } from './model';
import { setDyslexicFont } from './font';
import type { AudioEngine } from '../../audio/AudioEngine';
import type { PostFX } from '../../engine/PostFX';
import type { ZoneManager } from '../../world/ZoneManager';
import type { Controller } from '../../player/Controller';
import type { Input } from '../../engine/Input';
import type { Loop } from '../../engine/Loop';
import type { PerformanceHud } from '../Performance';

/**
 * Where the player's settings meet the engine.
 *
 * One function, called with the whole options object every time anything
 * changes. That is deliberately blunt: a per-option dispatch table would be
 * faster and would also mean a dozen places to forget, and none of this costs
 * anything measurable. It runs when a slider moves, not sixty times a second.
 *
 * **Everything applies live.** Nothing here is read at boot and cached, so
 * dragging the field of view moves the camera under the panel, dropping the
 * shadows re-walks the zone that is already standing, and the colourblind
 * correction changes the picture behind the menu as the slider moves. That is
 * the whole reason the scrim is barely tinted — the point of adjusting a video
 * setting is watching what it does.
 *
 * The unit conversions live here rather than in `model.ts` because they are
 * facts about the engine, not about the settings — a sensitivity of 5 means
 * `lookSensitivity: 0.0022` only for as long as that is what the controller is
 * tuned to.
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
 * The lowest sensitivity the slider can actually apply.
 *
 * The slider reads 0 at the bottom, and 0 would be a camera that cannot be
 * turned at all — a setting whose only effect is to make the game look frozen,
 * reachable by dragging one notch too far. This is two per cent of the
 * default: slow enough to be indistinguishable from stopped, fast enough to
 * get back to the menu and undo it.
 */
const MIN_SENSITIVITY = 0.1;

/** Sensitivity 5 is the tuned default; the scale either side of it is linear. */
const SENSITIVITY_MIDPOINT = 5;

/**
 * The interface size the text-size slider counts from, in CSS pixels.
 *
 * Two pixels above the browser's usual 16. The panel is set in a monospace
 * face at well under a rem for most of its text, and 16 put the sub-labels
 * close to the size where they stop being comfortable — so the baseline moved
 * up and the slider runs either side of it rather than only upwards.
 */
const BASE_FONT_PX = 18;

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
  // Master only; the other four are stored, shown and marked as unconnected in
  // the menu itself. See `notWired` in `model.ts` for what they are waiting on.
  audio.settings.masterVolume = DEFAULT_AUDIO.masterVolume * (options.masterVolume / 100);

  // --- video ---------------------------------------------------------------
  // Snapped rather than eased — see `setFieldOfView`. A slider whose picture
  // arrives half a second after the number is a slider you cannot judge.
  //
  // Sprint zoom off is a boost of zero, which is the whole switch: the effect
  // is a delta, so removing it is setting it to nothing rather than making two
  // numbers equal and hoping they stay that way.
  player.setFieldOfView(
    options.fov,
    options.sprintZoom ? DEFAULT_TUNING.sprintFovBoost : 0,
    options.fovScaling,
  );
  postfx.setDither(options.dither);
  postfx.setPixelation(options.pixelation);
  postfx.setAmbientOcclusion(options.ambientOcclusion);
  postfx.setBloom(options.bloom);
  postfx.setColorblind(options.colorblind, options.colorblindStrength / 100);
  postfx.setGroundcover(options.groundcover, options.groundcoverDensity);
  zones.setShadows(options.shadows);
  zones.setClutterShadows(options.grassShadows);
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
  postfx.setWaterMotion(options.waterMotion);
  tuning.bobScale = options.headBob ? 1 : 0;
  setDyslexicFont(options.dyslexicFont);
  // The root size, so every `rem` in the interface follows it. Nothing in the
  // world is measured in `rem`, so this moves the HUD and the menus and leaves
  // the game alone.
  document.documentElement.style.fontSize = `${BASE_FONT_PX + options.fontSize}px`;
}
