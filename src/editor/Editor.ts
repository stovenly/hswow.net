import * as THREE from 'three';
import GUI from 'lil-gui';
import type { App } from '../app/boot';
import { installDevPanel } from '../app/devPanel';
import { Chrome, type Toggle } from './chrome';
import { Keys } from './keys';

export type EditorMode = 'fly' | 'play';

const DOWN = new THREE.Vector3(0, -1, 0);
/** How far above a hit the capsule is set down, matching `Zone.settle`. */
const SETTLE_CLEARANCE = 0.12;

/**
 * The authoring shell around the running game: chrome, the tuning panel, and
 * the two ways of being in the world. Everything drawn is drawn by the game's
 * own pipeline; nothing here has a second renderer.
 */
export class Editor {
  readonly app: App;
  readonly chrome = new Chrome();
  readonly keys = new Keys();
  readonly gui: GUI;

  private current: EditorMode = 'fly';
  private readonly modeToggles: Record<EditorMode, Toggle>;

  constructor(app: App) {
    this.app = app;

    this.gui = new GUI({ title: 'hswow editor' });
    this.gui.domElement.style.setProperty('--width', '300px');
    installDevPanel(this.gui, app);

    const modes = this.chrome.group();
    this.modeToggles = {
      fly: this.chrome.toggle(modes, 'fly', () => this.setMode('fly'), 'free camera'),
      play: this.chrome.toggle(modes, 'play', () => this.setMode('play'), 'drop in as the player — Tab'),
    };

    const view = this.chrome.group();
    this.chrome.toggle(view, 'walls', () => {
      app.zones.showBarriers = !app.zones.showBarriers;
      this.modeToggles.fly.element.blur();
    }, 'show invisible walls');

    const travel = this.chrome.group();
    const names = [...app.zones.zones.values()];
    const picker = this.chrome.select(
      travel,
      names.map((zone) => zone.name),
      (value) => {
        const zone = names.find((candidate) => candidate.name === value);
        if (zone) void app.zones.travel(zone.id);
      },
    );
    app.loop.add(() => {
      const here = app.zones.current?.name;
      if (here && picker.value !== here) picker.value = here;
    });

    this.keys.add((event) => {
      if (event.code === 'Tab') {
        this.setMode(this.current === 'play' ? 'fly' : 'play');
        return true;
      }
      return false;
    });

    this.setMode('fly');
    app.loop.add(() => this.report());
  }

  get mode(): EditorMode {
    return this.current;
  }

  setMode(mode: EditorMode): void {
    this.current = mode;
    for (const name of ['fly', 'play'] as const) this.modeToggles[name].pressed = name === mode;

    const { player, zones } = this.app;
    // Parallax frozen while flying, or the vista band slides under whatever is
    // being looked at and a placement cannot be judged.
    zones.freezeVista = mode === 'fly';
    if (mode === 'fly') {
      player.noclip = true;
      this.chrome.say('flying');
      return;
    }

    player.noclip = false;
    const from = player.position.clone();
    const drop = this.app.collider.raycast(from, DOWN);
    if (drop !== null) {
      player.teleport(new THREE.Vector3(from.x, from.y - drop + SETTLE_CLEARANCE, from.z), player.heading);
    }
    this.chrome.say('walking — Tab to fly');
  }

  private report(): void {
    const { player, zones, collider } = this.app;
    const at = player.position;
    this.chrome.set('mode', this.current);
    this.chrome.set('zone', zones.current?.name ?? '—');
    this.chrome.set('at', `${at.x.toFixed(1)} ${at.y.toFixed(1)} ${at.z.toFixed(1)}`);
    this.chrome.set('tris', `${collider.triangles.toLocaleString()} tris`);
  }
}
