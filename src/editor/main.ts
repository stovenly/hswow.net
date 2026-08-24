import { createApp } from '../app/boot';
import { loadProject } from '../app/loadProject';
import { Editor } from './Editor';

const canvas = document.getElementById('viewport');
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('#viewport canvas is missing from editor.html');
}
const overlay = document.getElementById('overlay');
if (!(overlay instanceof HTMLElement)) {
  throw new Error('#overlay is missing from editor.html');
}

const project = await loadProject();
document.title = `${project.title} — editor`;
const app = await createApp({ canvas, overlay, project });
new Editor(app);
await app.start();
