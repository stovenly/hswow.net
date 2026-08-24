import { createApp } from '../app/boot';
import { debugWorld } from '../debug/world';
import { Editor } from './Editor';

const canvas = document.getElementById('viewport');
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('#viewport canvas is missing from editor.html');
}
const overlay = document.getElementById('overlay');
if (!(overlay instanceof HTMLElement)) {
  throw new Error('#overlay is missing from editor.html');
}

const app = await createApp({ canvas, overlay, source: debugWorld });
new Editor(app);
await app.start();
