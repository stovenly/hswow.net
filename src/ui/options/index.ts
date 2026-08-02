import { OptionsMenu } from './menu';
import { applyOptions, type OptionTargets } from './apply';
import { saveOptions, type Options } from './model';

export { loadOptions } from './model';
export type { Options } from './model';

/**
 * The options, installed.
 *
 * One call, so `main.ts` says what the settings are attached to and nothing
 * about how any of it works. Everything else — the panel, the persistence, the
 * unit conversions, the rules between switches — lives under `ui/options/`.
 *
 * Two touch points rather than one, and the reason is boot order: the shadow
 * switches are read as a zone's meshes are prepared, which happens long before
 * the audio engine exists. So `main` loads the options early, uses those two,
 * and installs the rest once there is something to install them against.
 */
export interface OptionsHandle {
  /** The live object. Held by the debug panel, which edits it directly. */
  readonly options: Options;
  /** Re-applies and re-saves everything, and redraws the panel. */
  commit: () => void;
  /** Opens the menu — the debug panel offers this, and so does the HUD button. */
  open: () => void;
  dispose: () => void;
}

export function installOptions(
  options: Options,
  overlay: HTMLElement,
  targets: OptionTargets,
): OptionsHandle {
  const publish = (): void => {
    applyOptions(options, targets);
    saveOptions(options);
  };

  const menu = new OptionsMenu(overlay, options, {
    onChange: publish,
    // The button says resume, so it resumes. Without this the panel would
    // close and leave the player looking at "click to play", having just
    // clicked — the panel swallowed the click that would have taken the lock.
    onResume: () => targets.input.capture(),
  });

  applyOptions(options, targets);

  return {
    options,
    commit: () => {
      publish();
      // For writers that are not the panel: the debug folder binds straight to
      // the same booleans, and the rows have to follow.
      menu.sync();
    },
    open: () => menu.show(),
    dispose: () => menu.dispose(),
  };
}
