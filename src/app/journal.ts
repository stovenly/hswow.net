import { Journal } from '../ui/Journal';
import type { Notices } from '../ui/Notices';
import { questById } from '../world/people';
import { worldState } from '../world/state';
import type { App } from './boot';

/** The journal, wired to a running app: the window on `J`, and a line when something is written in it. */
export function installJournal(app: App, overlay: HTMLElement, notices: Notices): Journal {
  let wasPlaying = false;
  const journal = new Journal(overlay, worldState, {
    onOpen: () => {
      wasPlaying = app.input.locked;
      document.exitPointerLock();
    },
    onClose: () => {
      if (!wasPlaying) return;
      document.body.classList.add('is-capturing');
      void app.input.capture().finally(() => document.body.classList.remove('is-capturing'));
    },
  });

  worldState.onStage = (quest, at) => {
    const stage = questById(quest)?.stages?.find((one) => one.at === at);
    if (stage?.log) notices.say('Journal updated', 'quest');
  };

  window.addEventListener('keydown', (event) => {
    if (event.code !== 'KeyJ' || event.repeat || event.defaultPrevented) return;
    if (journal.shown) {
      event.preventDefault();
      journal.hide();
      return;
    }
    if (app.reading.shown) return;
    if (document.body.classList.contains('is-inventory') || document.body.classList.contains('is-map')) return;
    if (!app.input.locked || app.zones.isTransitioning) return;
    event.preventDefault();
    journal.show();
  });

  return journal;
}
