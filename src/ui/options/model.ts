import { DEFAULT_TUNING, type FovScaling } from '../../player/Controller';
import { loadPreset, savePreset, clearPreset } from '../../debug/presets';
import type { ColorblindMode } from '../../engine/RetroShader';
import type { PerformanceMode } from '../Performance';
import { fontNote } from './font';

/**
 * The player's settings, and the description of the menu that edits them.
 *
 * **This file knows nothing about how any of it is applied.** It holds the
 * values, their ranges and the rules between them; `apply.ts` pushes them into
 * the engine and `menu.ts` draws them. Splitting it that way is what lets a
 * dependency — grass shadows under shadows, three motion effects under reduced
 * motion — be stated once, as data, instead of being re-derived in the menu, in
 * the apply step and in the debug panel.
 *
 * Values are stored in the units the *player* sees, not the ones the engine
 * wants: volumes are percentages, sensitivity is 0–10, field of view is
 * degrees. A settings file is something a person might one day read, and
 * `lookSensitivity: 0.0022` tells them nothing. Conversion happens on the way
 * out, in `apply.ts`.
 */

const PRESET = 'options';

export type HoldMode = 'hold' | 'toggle';
export type { ColorblindMode };

export interface Options {
  // --- audio ---------------------------------------------------------------
  /**
   * Every volume is a percentage of the level the game is *mixed* at, not a
   * fraction of full scale. 100 therefore means "as designed" rather than "as
   * loud as possible", and the sliders only ever attenuate — which is the
   * behaviour that cannot surprise anybody, and the reason turning everything
   * up can never push the limiter into working.
   */
  masterVolume: number;
  ambientVolume: number;
  footstepVolume: number;
  creatureVolume: number;
  npcVolume: number;

  // --- video ---------------------------------------------------------------
  fov: number;
  /** Which axis `fov` is measured along. See `PlayerTuning.fovScaling`. */
  fovScaling: FovScaling;
  dither: boolean;
  pixelation: boolean;
  /**
   * Off by default. Grass is most of the object count in an outdoor zone and
   * almost none of the picture — see `art/clutter.ts` — so this is the one
   * graphics option here that buys back real frame time, and the one somebody
   * with headroom will want to turn on.
   */
  grassShadows: boolean;
  shadows: boolean;
  /**
   * Frames per second, or `uncapped`.
   *
   * A string rather than a number so the dropdown can offer "uncapped" as one
   * of its choices rather than as a magic value; `apply.ts` parses it.
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
  /** The umbrella switch over the three motion effects below. See `effective`. */
  reducedMotion: boolean;
  windSway: boolean;
  headBob: boolean;
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
  ambientVolume: 100,
  footstepVolume: 100,
  creatureVolume: 100,
  npcVolume: 100,

  // Read off the movement tuning rather than restated, so the menu opens
  // showing the value the game actually boots with. Two constants would drift
  // the first time either was touched, and the symptom — a menu reporting a
  // field of view the camera does not have — is one nobody would think to look
  // for.
  fov: DEFAULT_TUNING.fov,
  fovScaling: DEFAULT_TUNING.fovScaling,
  dither: true,
  pixelation: true,
  grassShadows: false,
  shadows: true,
  fpsCap: 'uncapped',
  performance: 'off',

  sensitivity: 5,
  invertY: DEFAULT_TUNING.invertY,
  invertX: DEFAULT_TUNING.invertX,
  sprintMode: 'hold',
  crouchMode: 'hold',

  reducedMotion: false,
  windSway: true,
  headBob: true,
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
 * **Nothing is ever written back.** An option that is being overridden keeps
 * the value the player chose, so turning reduced motion off hands back exactly
 * the world they had before they turned it on — including the head bob they
 * had already switched off by hand, which a restore-everything rule would
 * silently turn back on. The menu shows these values rather than the stored
 * ones, so a suppressed switch reads `off` while it is greyed out and visibly
 * returns when the switch above it is released.
 */
export function effective(options: Options): Options {
  const motion = !options.reducedMotion;
  return {
    ...options,
    grassShadows: options.grassShadows && options.shadows,
    windSway: options.windSway && motion,
    headBob: options.headBob && motion,
    sprintZoom: options.sprintZoom && motion,
  };
}

// --- the menu, as data ------------------------------------------------------

/** The keys of `Options` whose values are of a given type. */
type KeysOf<T> = { [K in keyof Options]: Options[K] extends T ? K : never }[keyof Options];

interface ControlBase {
  label: string;
  /**
   * False greys the row out. The value underneath is untouched.
   *
   * Greyed rather than removed, because these are options something *else* is
   * overriding: the player set them, they still hold, and they come back the
   * moment the switch above them is released. Hiding one would look like it
   * had been thrown away.
   */
  enabledWhen?: (options: Options) => boolean;
  /**
   * False removes the row entirely.
   *
   * For an option that has no meaning at all yet rather than one being
   * overridden — the correction strength before a correction has been chosen.
   * There is nothing there to preserve and nothing to explain, so it appears
   * when it starts to mean something.
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
 * The four categories that are not yet connected to anything.
 *
 * Said once, in the menu, rather than left for the player to discover by
 * dragging a slider that does nothing: every emitter connects straight to the
 * engine's dry and send buses, so a per-category volume needs gain nodes in
 * between and a category declared on every sound in the game. Worth doing when
 * there are creatures and voices to balance against each other; not worth
 * doing now, when there are neither.
 */
const notWired = (): string => 'not connected yet';

/**
 * The tabs, in the order they appear — and the first is the one the panel
 * opens on. Video leads because it is what somebody opens this menu to change:
 * the audio is one working slider and four that are waiting on a mixer, and
 * putting those first means the panel opens on the page with the least in it.
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
      { kind: 'toggle', key: 'shadows', label: 'shadows' },
      {
        kind: 'toggle',
        key: 'grassShadows',
        label: 'grass shadows',
        enabledWhen: (options) => options.shadows,
        note: (options) => (options.shadows ? null : 'needs shadows'),
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
      { ...volume('ambientVolume', 'ambience'), note: notWired },
      { ...volume('footstepVolume', 'footsteps'), note: notWired },
      { ...volume('creatureVolume', 'creatures'), note: notWired },
      { ...volume('npcVolume', 'voices'), note: notWired },
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
    // Written out. It was abbreviated to "Access" to make four tabs fit, which
    // was a bad trade in general and a worse one here: shortening the label on
    // the accessibility tab specifically, so the layout stays tidy, is exactly
    // the wrong thing to sacrifice. The tab strip wraps or scrolls before any
    // of these names gets cut again.
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
        key: 'headBob',
        label: 'head bob',
        enabledWhen: motionAllowed,
        note: (options) => (options.reducedMotion ? 'held by reduced motion' : null),
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
        // everybody: somebody who has been diagnosed knows the first, and
        // somebody who only knows they cannot tell two things apart on screen
        // can find themselves by the second.
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
 * Reads the saved options, filling in anything a newer build has added.
 *
 * Merged over the defaults rather than trusted wholesale — a blob written
 * before an option existed is missing that key, and a missing boolean would
 * read as `undefined` and turn the feature off for everyone with an old save.
 * Every value is re-checked against its own control, because this is the one
 * input to the game a person can edit by hand.
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
        // Written through `assign` rather than directly. The choice keys do
        // not all hold the *same* union — one is hold-or-toggle, another is a
        // colourblind mode — so a write indexed by the whole set of keys has
        // to satisfy every one of them at once, which nothing can. Passing the
        // key through a generic narrows it to one at a time.
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
