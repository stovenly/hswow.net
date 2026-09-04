import { Menu } from '../ui/Menu';
import type { App } from './boot';

/**
 * The menu window, wired to a running app: the pointer lock given up on the
 * way in and taken back on the way out, and the keys refused while a page is
 * up or a zone is changing. Installed by the game page and not by the editor,
 * which keeps Tab for its fly toggle.
 */
export function installMenu(app: App, overlay: HTMLElement): Menu {
  let wasPlaying = false;
  return new Menu(overlay, {
    onOpen: () => {
      wasPlaying = app.input.locked;
      document.exitPointerLock();
    },
    // Not a bare `requestPointerLock` — see the reading screen, which is the
    // same dance for the same reason.
    onClose: () => {
      if (!wasPlaying) return;
      document.body.classList.add('is-capturing');
      void app.input.capture().finally(() => document.body.classList.remove('is-capturing'));
    },
    canOpen: () => !app.reading.shown && app.input.locked && !app.zones.isTransitioning,
  });
}
