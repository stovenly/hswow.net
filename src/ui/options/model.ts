import { DEFAULT_TUNING, type FovScaling } from '../../player/Controller';
import { loadPreset, savePreset, clearPreset } from '../../dev/presets';
import type { ColorblindMode } from '../../engine/RetroShader';
import { VIEW_UNLIMITED, type CoverDensity } from '../../engine/PostFX';
import type { PerformanceMode } from '../Performance';
import { fontNote } from './font';

/**
 * The player's settings, and the description of the menu that edits them.
 *
 * **This file knows nothing about how any of it is applied.** It holds the
 * values, their ranges and the rules between them; `apply.ts` pushes them into
 * the engine and `menu.ts` draws them. That split is what lets a dependency —
 * the motion effects under reduced motion, the correction strength under the
 * correction — be stated once, as data, instead of re-derived in three places.
 *
 * Values are stored in the units the *player* sees: volumes are percentages,
 * sensitivity is 0-10, field of view is degrees. A settings file is something
 * a person might read, and `lookSensitivity: 0.0022` tells them nothing.
 * Conversion happens on the way out, in `apply.ts`.
 */

const PRESET = 'options';

export type HoldMode = 'hold' | 'toggle';
export type AudioBuffering = 'small' | 'large';
export type { ColorblindMode };

export interface Options {
  // --- audio ---------------------------------------------------------------
  /**
   * Every volume is a percentage of the level the game is *mixed* at, not a
   * fraction of full scale. 100 means "as designed" rather than "as loud as
   * possible", and the sliders only ever attenuate — so turning everything up
   * can never push the limiter into working.
   */
  masterVolume: number;
  musicVolume: number;
  ambientVolume: number;
  weatherVolume: number;
  footstepVolume: number;
  creatureVolume: number;
  npcVolume: number;
  /**
   * How big a buffer the audio device is asked for. The one setting here that
   * does not apply live: a context's buffer size is fixed when it is opened, so
   * this is read once at boot.
   */
  audioBuffer: AudioBuffering;

  // --- video ---------------------------------------------------------------
  fov: number;
  /** Which axis `fov` is measured along. See `PlayerTuning.fovScaling`. */
  fovScaling: FovScaling;
  dither: boolean;
  pixelation: boolean;
  /**
   * Multisampling on the colour render. A player option for the same reason
   * ambient occlusion is: real per-frame cost, and off, the world still reads
   * as itself with harder staircases on every thin edge. One switch and no
   * tiers — a quality ladder would be two controls for one thing on screen.
   */
  antialias: boolean;
  /**
   * Ambient occlusion. A player option because it has real per-frame cost and
   * is purely additive shading — off, the world still reads as itself.
   */
  ambientOcclusion: boolean;
  /**
   * Bloom. Real per-frame cost, and glow bleed is taste that some people find
   * distracting. Off, the emitters still glow — the geometry is the glow — and
   * only the bleed goes.
   */
  bloom: boolean;
  shadows: boolean;
  /**
   * How much of the sampled field is drawn, `off` included — the one graphics
   * option here whose cost is vertex count rather than a pass.
   *
   * The type table is authored at ultra; every tier below draws a prefix of the
   * same shuffled pool, so the scatter stays even and switching tiers is free.
   * Off is the end of that scale rather than a switch above it.
   *
   * Groundcover, not grass: it is the field itself, and the `CLUTTER` props are
   * a different grass — see `art/clutter.ts`. Neither casts a shadow.
   */
  groundcoverDensity: CoverDensity;
  /**
   * How far you can see, in metres, `VIEW_UNLIMITED` being as far as the world
   * goes.
   *
   * It only ever pulls the view *in*. Every zone says how thick its own air is
   * and this clamps under that rather than extending it, so indoors it does
   * nothing. A number rather than a tier, because metres is what it means and
   * the failure it guards against — a cut with nothing in front of it — is a
   * distance.
   */
  viewDistance: number;
  /**
   * Frames per second, or `uncapped`. A string rather than a number so the
   * dropdown can offer "uncapped" as one of its choices rather than as a magic
   * value; `apply.ts` parses it.
   */
  fpsCap: string;
  performance: PerformanceMode;

  // --- controls ------------------------------------------------------------
  /** 0–10, where 5 is the tuned default. See `apply.ts`. */
  sensitivity: number;
  invertY: boolean;
  invertX: boolean;
  sprintMode: HoldMode;
  crouchMode: HoldMode;

  // --- accessibility -------------------------------------------------------
  /** The umbrella switch over the four motion effects below. See `effective`. */
  reducedMotion: boolean;
  windSway: boolean;
  /**
   * The cloth simulation, on or off — a real switch over real work, not a gate
   * on other settings. Off freezes every cloth in its pre-draped settled pose:
   * present, natural, still. Deliberately *not* under reduced motion, which
   * already stills cloth's wind response along with the trees'; the two compose
   * without either becoming a no-op.
   */
  clothSim: boolean;
  /**
   * Waves, and the foam lapping the shore with them. Separate from `windSway`
   * even though both answer the same gust field, because they are separate
   * things to be bothered by: a pond rocking in the corner of the eye is not
   * grass moving. Off, every body of water goes glass-still.
   */
  waterMotion: boolean;
  headBob: boolean;
  /**
   * Snow, rain, ash — the weather, and only the weather.
   *
   * An accessibility option rather than a video one, and a stronger case than
   * wind sway: falling snow is constant motion across the whole frame. There is
   * **no still version of it** — snow that holds still is snow hanging in the
   * air — so this removes the particles rather than freezing them, and that
   * costs the zone something real. Smoke and sparks stay: they are small,
   * local, and looked at rather than looked through.
   */
  precipitation: boolean;
  /**
   * The lightning flicker.
   *
   * A stroke train is a full-frame luminance transient at 15-20 Hz from
   * near-black to near-white, which is the pattern that causes seizures and is
   * the strongest such thing in the game. Off, the storm stays: one stroke
   * rather than a train, a quarter-second ramp rather than fifteen
   * milliseconds, a hard ceiling well short of white, and the channel and the
   * thunder untouched.
   */
  lightning: boolean;
  /** The field of view widening while sprinting. */
  sprintZoom: boolean;
  colorblind: ColorblindMode;
  /** 0–100, and only meaningful while a mode is chosen. */
  colorblindStrength: number;
  dyslexicFont: boolean;
  /** Pixels added to the base interface size, −5 to +5. See `apply.ts`. */
  fontSize: number;
}

export const DEFAULT_OPTIONS: Options = {
  masterVolume: 100,
  musicVolume: 100,
  ambientVolume: 100,
  weatherVolume: 100,
  footstepVolume: 100,
  creatureVolume: 100,
  npcVolume: 100,
  audioBuffer: 'small',

  // Read off the movement tuning rather than restated, so the menu opens
  // showing the value the game actually boots with. Two constants would drift,
  // and a menu reporting a field of view the camera does not have is not
  // something anyone would think to look for.
  fov: DEFAULT_TUNING.fov,
  fovScaling: DEFAULT_TUNING.fovScaling,
  dither: true,
  pixelation: true,
  antialias: true,
  ambientOcclusion: true,
  bloom: true,
  shadows: true,
  groundcoverDensity: 'high',
  // Unlimited. Unlike groundcover, where the default is a look, this only ever
  // *removes* world — so nobody's game changes until they ask for it.
  viewDistance: VIEW_UNLIMITED,
  fpsCap: 'uncapped',
  performance: 'off',

  sensitivity: 5,
  invertY: DEFAULT_TUNING.invertY,
  invertX: DEFAULT_TUNING.invertX,
  sprintMode: 'hold',
  crouchMode: 'hold',

  reducedMotion: false,
  windSway: true,
  clothSim: true,
  waterMotion: true,
  headBob: true,
  precipitation: true,
  lightning: true,
  sprintZoom: true,
  colorblind: 'off',
  colorblindStrength: 100,
  dyslexicFont: false,
  fontSize: 0,
};

/**
 * What the engine actually gets, once the switches that override others have
 * had their say.
 *
 * **Nothing is ever written back.** An option being overridden keeps the value
 * the player chose, so turning reduced motion off hands back exactly the world
 * they had before — including the head bob they had already switched off by
 * hand, which a restore-everything rule would silently turn back on. The menu
 * shows these values rather than the stored ones, so a suppressed switch reads
 * `off` while greyed and visibly returns when the switch above it is released.
 */
export function effective(options: Options): Options {
  const motion = !options.reducedMotion;
  return {
    ...options,
    windSway: options.windSway && motion,
    waterMotion: options.waterMotion && motion,
    headBob: options.headBob && motion,
    precipitation: options.precipitation && motion,
    lightning: options.lightning && motion,
    sprintZoom: options.sprintZoom && motion,
  };
}

// --- the menu, as data ------------------------------------------------------

/** The keys of `Options` whose values are of a given type. */
type KeysOf<T> = { [K in keyof Options]: Options[K] extends T ? K : never }[keyof Options];

interface ControlBase {
  label: string;
  /**
   * False greys the row out; the value underneath is untouched. Greyed rather
   * than removed, because these are options something *else* is overriding:
   * the player set them, they still hold, and they come back the moment the
   * switch above them is released.
   */
  enabledWhen?: (options: Options) => boolean;
  /**
   * False removes the row entirely. For an option that has no meaning at all
   * yet rather than one being overridden — the correction strength before a
   * correction has been chosen. Nothing there to preserve and nothing to
   * explain, so it appears when it starts to mean something.
   */
  shownWhen?: (options: Options) => boolean;
  /** A line under the row — what it is waiting on, or what it costs. */
  note?: (options: Options) => string | null;
}

export interface SliderControl extends ControlBase {
  kind: 'slider';
  key: KeysOf<number>;
  min: number;
  max: number;
  step: number;
  /** How the current value reads beside the slider. */
  format?: (value: number) => string;
}

export interface ToggleControl extends ControlBase {
  kind: 'toggle';
  key: KeysOf<boolean>;
}

export interface ChoiceControl extends ControlBase {
  kind: 'choice';
  key: KeysOf<string>;
  choices: readonly { value: string; label: string }[];
}

export type Control = SliderControl | ToggleControl | ChoiceControl;

export interface Category {
  id: string;
  label: string;
  controls: readonly Control[];
}

const percent = (value: number): string => `${Math.round(value)}%`;

/** The two hold-or-toggle dropdowns are the same choice twice. */
const HOLD_CHOICES = [
  { value: 'hold', label: 'hold' },
  { value: 'toggle', label: 'toggle' },
] as const;

/** Motion effects are overridden while reduced motion is on. */
const motionAllowed = (options: Options): boolean => !options.reducedMotion;

const volume = (key: KeysOf<number>, label: string): SliderControl => ({
  kind: 'slider',
  key,
  label,
  min: 0,
  max: 100,
  step: 1,
  format: percent,
});

/**
 * The tabs, in the order they appear — and the first is the one the panel opens
 * on. Video leads because it is what somebody opens this menu to change: the
 * audio is two working sliders, four waiting on a mixer and one setting that
 * needs a reload.
 */
export const CATEGORIES: readonly Category[] = [
  {
    id: 'video',
    label: 'Video',
    controls: [
      {
        kind: 'slider',
        key: 'fov',
        label: 'field of view',
        min: 60,
        max: 120,
        step: 1,
        format: (value) => `${Math.round(value)}°`,
      },
      {
        kind: 'choice',
        key: 'fovScaling',
        label: 'field of view scaling',
        // Named for the axis the number is measured along rather than by the
        // trade names — a player who knows they want Vert− will recognise
        // "horizontal", and one who does not would learn nothing from either.
        choices: [
          { value: 'vertical', label: 'vertical' },
          { value: 'horizontal', label: 'horizontal' },
        ],
        note: (options) =>
          options.fovScaling === 'horizontal'
            ? 'fixed side to side; a wider window loses height'
            : 'fixed top to bottom; a wider window shows more',
      },
      { kind: 'toggle', key: 'dither', label: 'dither' },
      { kind: 'toggle', key: 'pixelation', label: 'pixelation' },
      { kind: 'toggle', key: 'antialias', label: 'antialiasing' },
      { kind: 'toggle', key: 'ambientOcclusion', label: 'ambient occlusion' },
      { kind: 'toggle', key: 'bloom', label: 'bloom' },
      { kind: 'toggle', key: 'shadows', label: 'shadows' },
      {
        kind: 'choice',
        key: 'groundcoverDensity',
        label: 'groundcover density',
        choices: [
          { value: 'low', label: 'low' },
          { value: 'medium', label: 'medium' },
          { value: 'high', label: 'high' },
          { value: 'ultra', label: 'ultra' },
        ],
      },
      {
        kind: 'slider',
        key: 'viewDistance',
        label: 'view distance',
        // Twenty-metre steps: the difference a smaller one makes is not
        // visible, and the fog moves with every notch.
        min: 40,
        max: VIEW_UNLIMITED,
        step: 20,
        format: (value) => (value >= VIEW_UNLIMITED ? 'unlimited' : `${value} m`),
        note: (options) =>
          options.viewDistance >= VIEW_UNLIMITED ? null : 'never further than the zone allows',
      },
      {
        kind: 'choice',
        key: 'fpsCap',
        label: 'frame rate cap',
        // The common refresh rates, because a cap that does not divide the
        // display's rate cannot be reached exactly — see `Loop.setFpsCap`.
        choices: [
          { value: 'uncapped', label: 'uncapped' },
          { value: '30', label: '30 fps' },
          { value: '60', label: '60 fps' },
          { value: '120', label: '120 fps' },
          { value: '144', label: '144 fps' },
          { value: '240', label: '240 fps' },
        ],
      },
      {
        kind: 'choice',
        key: 'performance',
        label: 'performance monitor',
        choices: [
          { value: 'off', label: 'off' },
          { value: 'fps', label: 'frame rate' },
          { value: 'all', label: 'everything' },
        ],
      },
    ],
  },
  {
    id: 'audio',
    label: 'Audio',
    controls: [
      volume('masterVolume', 'master'),
      volume('musicVolume', 'music'),
      volume('ambientVolume', 'ambience'),
      volume('weatherVolume', 'weather'),
      volume('footstepVolume', 'footsteps'),
      volume('creatureVolume', 'creatures'),
      volume('npcVolume', 'voices'),
      {
        kind: 'choice',
        key: 'audioBuffer',
        label: 'audio buffer',
        choices: [
          { value: 'small', label: 'small' },
          { value: 'large', label: 'large' },
        ],
        note: () => '(increasing this can help with crackling)',
      },
    ],
  },
  {
    id: 'controls',
    label: 'Controls',
    controls: [
      {
        kind: 'slider',
        key: 'sensitivity',
        label: 'mouse sensitivity',
        min: 0,
        max: 10,
        step: 0.1,
        format: (value) => value.toFixed(1),
      },
      { kind: 'toggle', key: 'invertY', label: 'invert vertical' },
      { kind: 'toggle', key: 'invertX', label: 'invert horizontal' },
      { kind: 'choice', key: 'sprintMode', label: 'sprint', choices: HOLD_CHOICES },
      { kind: 'choice', key: 'crouchMode', label: 'crouch', choices: HOLD_CHOICES },
    ],
  },
  {
    id: 'accessibility',
    // Written out rather than abbreviated. Shortening the label on the
    // accessibility tab specifically, so the layout stays tidy, is exactly the
    // wrong thing to sacrifice; the tab strip wraps or scrolls first.
    label: 'Accessibility',
    controls: [
      { kind: 'toggle', key: 'reducedMotion', label: 'reduced motion' },
      {
        kind: 'toggle',
        key: 'windSway',
        label: 'wind sway',
        enabledWhen: motionAllowed,
        note: (options) => (options.reducedMotion ? 'held by reduced motion' : null),
      },
      {
        kind: 'toggle',
        key: 'clothSim',
        label: 'cloth simulation',
        note: (options) => (options.clothSim ? null : 'cloth hangs still, settled'),
      },
      {
        kind: 'toggle',
        key: 'waterMotion',
        label: 'water motion',
        enabledWhen: motionAllowed,
        note: (options) => (options.reducedMotion ? 'held by reduced motion' : null),
      },
      {
        kind: 'toggle',
        key: 'headBob',
        label: 'head bob',
        enabledWhen: motionAllowed,
        note: (options) => (options.reducedMotion ? 'held by reduced motion' : null),
      },
      {
        kind: 'toggle',
        key: 'precipitation',
        label: 'falling weather',
        enabledWhen: motionAllowed,
        note: (options) =>
          options.reducedMotion
            ? 'held by reduced motion'
            : options.precipitation
              ? null
              : 'snow and rain removed, not stilled',
      },
      {
        kind: 'toggle',
        key: 'lightning',
        label: 'lightning flicker',
        enabledWhen: motionAllowed,
        note: (options) =>
          options.reducedMotion
            ? 'held by reduced motion'
            : options.lightning
              ? null
              : 'one slow stroke, never a train',
      },
      {
        kind: 'toggle',
        key: 'sprintZoom',
        label: 'sprint zoom',
        enabledWhen: motionAllowed,
        note: (options) => (options.reducedMotion ? 'held by reduced motion' : null),
      },
      {
        kind: 'choice',
        key: 'colorblind',
        label: 'colourblind mode',
        // The clinical name *and* the colour, because between them they cover
        // everybody: somebody diagnosed knows the first, and somebody who only
        // knows they cannot tell two things apart on screen finds the second.
        choices: [
          { value: 'off', label: 'off' },
          { value: 'protanopia', label: 'protanopia (red blindness)' },
          { value: 'deuteranopia', label: 'deuteranopia (green blindness)' },
          { value: 'tritanopia', label: 'tritanopia (blue blindness)' },
        ],
      },
      {
        kind: 'slider',
        key: 'colorblindStrength',
        label: 'correction strength',
        min: 0,
        max: 100,
        step: 1,
        format: percent,
        shownWhen: (options) => options.colorblind !== 'off',
      },
      {
        kind: 'toggle',
        key: 'dyslexicFont',
        label: 'dyslexia-friendly text',
        note: fontNote,
      },
      {
        kind: 'slider',
        key: 'fontSize',
        label: 'text size',
        min: -5,
        max: 5,
        step: 1,
        // Signed, and 0 reads as the baseline rather than as "0px" — the
        // middle of this slider is a real setting, not the absence of one.
        format: (value) => (value === 0 ? 'default' : `${value > 0 ? '+' : ''}${value}px`),
      },
    ],
  },
];

// --- persistence ------------------------------------------------------------

/**
 * Reads the saved options, filling in anything a newer build has added. Merged
 * over the defaults rather than trusted wholesale — a blob written before an
 * option existed is missing that key, and a missing boolean would read as
 * `undefined` and turn the feature off. Every value is re-checked against its
 * own control, because this is the one input to the game a person can edit by
 * hand.
 */
export function loadOptions(): Options {
  const saved = (loadPreset<Options>(PRESET) ?? {}) as Record<string, unknown>;
  const options: Options = { ...DEFAULT_OPTIONS };

  for (const category of CATEGORIES) {
    for (const control of category.controls) {
      const value = saved[control.key];
      if (control.kind === 'slider') {
        if (typeof value !== 'number' || !Number.isFinite(value)) continue;
        options[control.key] = Math.min(Math.max(value, control.min), control.max);
      } else if (control.kind === 'toggle') {
        if (typeof value !== 'boolean') continue;
        options[control.key] = value;
      } else if (control.choices.some((choice) => choice.value === value)) {
        // Validated against the declared choices immediately above, which is
        // the only check a string union can be given at runtime.
        //
        // Written through `assign` rather than directly: the choice keys do not
        // all hold the same union, so a write indexed by the whole set of keys
        // would have to satisfy every one at once. Passing the key through a
        // generic narrows it to one at a time.
        assign(options, control.key, value as Options[KeysOf<string>]);
      }
    }
  }

  return options;
}

/** See the call site: one key at a time, so its value type is a single thing. */
function assign<K extends keyof Options>(options: Options, key: K, value: Options[K]): void {
  options[key] = value;
}

/** Best-effort, exactly like the render preset — see `debug/presets.ts`. */
export function saveOptions(options: Options): void {
  savePreset(PRESET, options);
}

export function clearOptions(): void {
  clearPreset(PRESET);
}
