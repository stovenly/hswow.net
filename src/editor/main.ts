import { createApp } from '../app/boot';
import { loadProject } from '../app/loadProject';
import { contentWorld, loadSidecars } from '../app/content';
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

// The same documents the boot interprets: the editor edits the objects the
// world is already reading, so a change reaches the world without a reload.
await loadSidecars(project.id);
const content = contentWorld(project.id);

// Into a document rather than the project's own entry: a code zone opens fine
// and has nothing in it to select, which is a poor place for an editor to land.
// `?zone=` beats everything, for coming back to what you were working on.
const asked = new URLSearchParams(window.location.search).get('zone');
const known = new Set(content.documents.map((doc) => doc.id));
const entry =
  [asked, project.editorEntry].find((id) => id && known.has(id)) ??
  content.documents[0]?.id ??
  project.entry;

const app = await createApp({ canvas, overlay, project: { ...project, entry }, enter: true });
new Editor(app, content.documents, content.manifest);
await app.start();
