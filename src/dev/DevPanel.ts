import GUI from 'lil-gui';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { flags } from './flags';

/**
 * The `?debug` overlay: frame stats plus a live tuning panel that later phases
 * hang their parameters off. Returns nulls when the flag is absent so callers
 * can no-op without branching everywhere.
 */
export interface DevTools {
  gui: GUI | null;
  stats: Stats | null;
  update(): void;
  dispose(): void;
}

export function createDevTools(): DevTools {
  if (!flags.debug) {
    return { gui: null, stats: null, update: () => {}, dispose: () => {} };
  }

  const stats = new Stats();
  stats.dom.style.position = 'fixed';
  stats.dom.style.top = '0';
  stats.dom.style.left = '0';
  document.body.appendChild(stats.dom);

  const gui = new GUI({ title: 'hswow' });
  // Roomier than the default so the panel is usable with a thumb.
  gui.domElement.style.setProperty('--width', '280px');

  return {
    gui,
    stats,
    update: () => stats.update(),
    dispose: () => {
      gui.destroy();
      stats.dom.remove();
    },
  };
}
