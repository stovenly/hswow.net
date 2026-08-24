import { createApp } from '../app/boot';
import { loadProject } from '../app/loadProject';
import { contentWorld } from '../app/content';
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
// The same documents the boot interpreted: the editor edits the objects the
// world is already reading, so a change reaches the world without a reload.
const content = contentWorld(project.id);
new Editor(app, content.documents, content.manifest);
await app.start();
