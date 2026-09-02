import type GUI from 'lil-gui';
import type Stats from 'three/examples/jsm/libs/stats.module.js';
import { flags } from './flags';

/**
 * The `?debug` overlay: frame stats plus a live tuning panel. Nulls without the
 * flag, and the two libraries are only fetched with it.
 */
export interface DevTools {
  gui: GUI | null;
  stats: Stats | null;
  update(): void;
  dispose(): void;
}

export async function createDevTools(): Promise<DevTools> {
  if (!flags.debug) {
    return { gui: null, stats: null, update: () => {}, dispose: () => {} };
  }
  const [{ default: GUI }, { default: Stats }] = await Promise.all([
    import('lil-gui'),
    import('three/examples/jsm/libs/stats.module.js'),
  ]);

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
