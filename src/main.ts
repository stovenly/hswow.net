import { createApp } from './app/boot';
import { installDevPanel } from './app/devPanel';
import { debugWorld } from './debug/world';

const canvas = document.getElementById('viewport');
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('#viewport canvas is missing from index.html');
}
const overlay = document.getElementById('overlay');
if (!(overlay instanceof HTMLElement)) {
  throw new Error('#overlay is missing from index.html');
}

const app = await createApp({ canvas, overlay, source: debugWorld });
// Before `start`, so the readout folder's loop is registered ahead of the
// frame loop and reports the frame just drawn rather than the one in progress.
if (app.dev.gui) installDevPanel(app.dev.gui, app);
await app.start();
