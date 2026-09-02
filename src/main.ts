import { createApp } from './app/boot';
import { installDevPanel } from './app/devPanel';
import { installGameItems } from './app/items';
import { loadProject } from './app/loadProject';
import { Title } from './ui/Title';
import { QuitToTitle } from './ui/QuitToTitle';
import { applyTextSize, loadOptions } from './ui/options';
import { loadingScreen } from './ui/LoadingScreen';

const canvas = document.getElementById('viewport');
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('#viewport canvas is missing from index.html');
}
const overlay = document.getElementById('overlay');
if (!(overlay instanceof HTMLElement)) {
  throw new Error('#overlay is missing from index.html');
}

const project = await loadProject();

// Before the title is drawn, not with the rest of the options during boot: the
// interface is sized in `rem`, so a late resize jumps under the pointer.
applyTextSize(loadOptions());

let title: Title | null = null;

const showTitle = (): void => {
  // Boot carries on behind the title, and a readout of it is not a reason to
  // cover the thing the player is meant to be clicking on.
  loadingScreen().hide();
  title = new Title(overlay, project.title, {
    newGame: async () => {
      const { app } = await ready;
      await app.zones.begin(project.start ?? project.entry);
      void app.input.capture();
    },
    continueFrom: async (slot) => {
      const { items } = await ready;
      return items.loadSlot(slot);
    },
    showLoad: () => void ready.then(({ items }) => items.showLoad()),
    showOptions: () => void ready.then(({ app }) => app.settings.open()),
  });
};

// The title is up before the world is: boot runs behind it, and every way in
// awaits it.
showTitle();

const ready = (async () => {
  const app = await createApp({ canvas, overlay, project });
  // The game page only: the editor keeps Tab for its fly toggle and installs
  // none of the item systems.
  const items = installGameItems(app, overlay);
  // Before `start`, so the readout folder's loop is registered ahead of the
  // frame loop and reports the frame just drawn rather than the one in progress.
  if (app.dev.gui && project.debug !== false) installDevPanel(app.dev.gui, app);

  new QuitToTitle(overlay, () => {
    void (async () => {
      document.exitPointerLock();
      // Before the fade, or the pause stack shows through the whole transition:
      // the lock is gone, and the title that hides it is not up yet.
      document.body.classList.add('is-title');
      await app.zones.leave(() => {
        // Nothing of the last run survives into the next: a new game after this
        // must be as fresh as one after a reload.
        items.resetWorld();
        showTitle();
      });
    })();
  });

  await app.start();
  // Torn down the frame a zone becomes live, which is at full black either way.
  app.onFrame(() => {
    if (!title || !app.zones.current) return;
    title.dispose();
    title = null;
  });
  return { app, items };
})();
