import './styles.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Viewport } from './engine/Viewport';
import { Loop } from './engine/Loop';
import { ProvingGround } from './debug/ProvingGround';
import { createDevTools } from './debug/DevPanel';

const canvas = document.getElementById('viewport');
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('#viewport canvas is missing from index.html');
}

const viewport = new Viewport(canvas);
const loop = new Loop();
const dev = createDevTools();

viewport.scene.fog = new THREE.Fog(0x0a0a0f, 20, 90);

const provingGround = new ProvingGround();
viewport.scene.add(provingGround.root);

// --- Phase 0 camera -------------------------------------------------------
// Temporary. The first-person controller in Phase 1 replaces this outright.
// OrbitControls is here only so the fixtures can be inspected, and it handles
// touch for free, which keeps the deployed build meaningful on a phone.
viewport.camera.position.set(7, 4, 11);
const controls = new OrbitControls(viewport.camera, canvas);
controls.target.set(0, 1, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI * 0.495; // keep the camera above the floor
controls.update();

if (dev.gui) {
  const fog = viewport.scene.fog as THREE.Fog;
  const folder = dev.gui.addFolder('fog');
  folder.add(fog, 'near', 0, 100, 1);
  folder.add(fog, 'far', 0, 300, 1);
}

loop.add(() => {
  controls.update();
  viewport.render();
  dev.update();
});

loop.start();
