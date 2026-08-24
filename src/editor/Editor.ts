import * as THREE from 'three';
import GUI from 'lil-gui';
import type { App } from '../app/boot';
import { installDevPanel } from '../app/devPanel';
import { projectIds } from '../app/loadProject';
import type { ZoneDocument, PortalManifest } from '../world/document';
import { Chrome, type Toggle } from './chrome';
import { Keys } from './keys';
import { Selection, entryTagOf } from './selection';
import { Session } from './session';
import { Transform, type MoveMode, type Tool } from './transform';
import { OrbitCamera, FreeLook } from './camera';
import { Inspector } from './inspector';

export type EditorMode = 'fly' | 'play';

const DOWN = new THREE.Vector3(0, -1, 0);
/** How far above a hit the capsule is set down, matching `Zone.settle`. */
const SETTLE_CLEARANCE = 0.12;

/**
 * The authoring shell around the running game.
 *
 * Everything drawn is drawn by the game's own pipeline; nothing here has a
 * second renderer, and every control that changes what you see writes a
 * document field.
 */
export class Editor {
  readonly app: App;
  readonly chrome = new Chrome();
  readonly keys = new Keys();
  readonly gui: GUI;
  readonly session: Session;
  readonly selection: Selection;
  readonly transform: Transform;
  readonly orbit: OrbitCamera;
  readonly inspector: Inspector;

  private current: EditorMode = 'fly';
  private readonly modeToggles: Record<EditorMode, Toggle>;
  private readonly toolToggles = new Map<Tool, Toggle>();
  private readonly moveToggles = new Map<MoveMode, Toggle>();
  private picking: ((id: string) => void) | null = null;
  private readonly zonePicker: HTMLSelectElement;

  constructor(app: App, documents: readonly ZoneDocument[], manifest: PortalManifest) {
    this.app = app;

    this.gui = new GUI({ title: 'hswow editor' });
    this.gui.domElement.style.setProperty('--width', '320px');

    this.session = new Session(app);
    this.session.adopt(documents, manifest);
    this.session.say = (message) => this.chrome.say(message);

    this.selection = new Selection(app);
    this.transform = new Transform(app, this.session, this.selection);
    this.orbit = new OrbitCamera(app, this.selection);
    new FreeLook(app, () => this.current === 'fly');

    this.inspector = new Inspector(this.gui, this.session, {
      pick: (onPicked) => {
        this.picking = onPicked;
        this.chrome.say('pick an entry…');
      },
      openInGallery: (builder, seed) => this.openInGallery(builder, seed),
      after: (reach) => {
        if (reach !== 'transform') return;
        const tag = this.selection.tag;
        const object = this.selection.first;
        if (!tag || !object) return;
        const entry = this.session.entry(tag.zone, tag.id);
        if (entry) this.session.reposition(tag.zone, entry, object);
      },
    });

    const modes = this.chrome.group();
    this.modeToggles = {
      fly: this.chrome.toggle(modes, 'fly', () => this.setMode('fly'), 'free camera'),
      play: this.chrome.toggle(modes, 'play', () => this.setMode('play'), 'drop in as the player — Tab'),
    };
    this.zonePicker = this.buildToolbar();

    const tuning = this.gui.addFolder('tuning').close();
    installDevPanel(tuning, app);

    this.bindMouse();
    this.bindKeys();

    this.selection.onChanged(() => {
      const tag = this.selection.tag;
      this.inspector.show(tag?.zone ?? null, tag?.id ?? null);
    });
    this.transform.onCommit = () => this.inspector.refresh();
    this.session.onChange = () => this.report();

    this.setMode('fly');
    app.loop.add(() => this.report());
  }

  get mode(): EditorMode {
    return this.current;
  }

  // --- chrome ---------------------------------------------------------------

  private buildToolbar(): HTMLSelectElement {
    const { chrome, app } = this;

    const tools = chrome.group();
    const tool = (label: string, which: Tool, hint: string): void => {
      this.toolToggles.set(which, chrome.toggle(tools, label, () => this.setTool(which), hint));
    };
    tool('move', 'move', 'W');
    tool('turn', 'rotate', 'E');
    tool('size', 'scale', 'R');
    tool('stretch', 'stretch', 'T');

    const moves = chrome.group();
    const move = (label: string, which: MoveMode, hint: string): void => {
      this.moveToggles.set(which, chrome.toggle(moves, label, () => this.setMoveMode(which), hint));
    };
    move('free', 'free', 'F — things may interpenetrate');
    move('contact', 'contact', 'C — stops at the first touch');
    move('ground', 'ground', 'G — rides the terrain');

    const view = chrome.group();
    chrome.button(view, 'frame', () => this.orbit.frame(), '.');
    chrome.button(view, 'drop', () => this.transform.drop(), 'End');
    chrome.toggle(
      view,
      'walls',
      () => {
        app.zones.showBarriers = !app.zones.showBarriers;
      },
      'show invisible walls',
    );

    const file = chrome.group();
    chrome.button(file, 'save', () => void this.session.saveAll(), 'ctrl-S');

    const projects = chrome.group();
    const switcher = chrome.select(projects, projectIds(), (value) => {
      const url = new URL(window.location.href);
      url.searchParams.set('project', value);
      window.location.href = url.toString();
    });
    switcher.value = app.project.id;
    switcher.title = 'project';

    const travel = chrome.group();
    return chrome.select(travel, this.zoneNames(), (value) => {
      const zone = [...app.zones.zones.values()].find((held) => held.name === value);
      if (zone) void app.zones.travel(zone.id);
    });
  }

  private zoneNames(): string[] {
    return [...this.app.zones.zones.values()].map((zone) => zone.name);
  }

  // --- input ----------------------------------------------------------------

  private bindMouse(): void {
    const canvas = this.app.viewport.renderer.domElement;

    canvas.addEventListener('pointermove', (event) => {
      if (this.current !== 'fly' || this.transform.controls.dragging || this.orbit.active) return;
      this.selection.hover(this.selection.pick(event));
    });

    canvas.addEventListener('pointerdown', (event) => {
      if (this.current !== 'fly' || event.button !== 0 || event.shiftKey) return;
      // A press that started on a gizmo handle belongs to the gizmo.
      if (this.transform.controls.axis) return;
      const hit = this.selection.pick(event);

      if (this.picking) {
        const tag = hit ? entryTagOf(hit) : null;
        if (tag) {
          this.picking(tag.id);
          this.chrome.say(`picked ${tag.id}`);
        }
        this.picking = null;
        return;
      }

      if (!hit) {
        if (!event.ctrlKey) this.selection.clear();
        return;
      }
      if (event.ctrlKey) this.selection.toggle(hit);
      else this.selection.set([hit]);
    });
  }

  private bindKeys(): void {
    const held = { snapping: false };
    window.addEventListener('keyup', (event) => {
      if (event.key !== 'Control' || !held.snapping) return;
      held.snapping = false;
      this.transform.setSnapping(false);
    });

    this.keys.add((event) => {
      if (event.ctrlKey && !held.snapping) {
        held.snapping = true;
        this.transform.setSnapping(true);
      }

      if (event.ctrlKey) {
        if (event.code === 'KeyZ') {
          if (event.shiftKey) this.session.redo();
          else this.session.undo();
          return true;
        }
        if (event.code === 'KeyS') {
          void this.session.saveAll();
          return true;
        }
        return false;
      }

      switch (event.code) {
        case 'Tab':
          this.setMode(this.current === 'play' ? 'fly' : 'play');
          return true;
        case 'KeyW':
        case 'KeyE':
        case 'KeyR':
        case 'KeyT': {
          // Only while the mouse is loose. In play these are movement keys.
          if (this.current !== 'fly' || this.app.input.locked) return false;
          const which: Tool =
            event.code === 'KeyW'
              ? 'move'
              : event.code === 'KeyE'
                ? 'rotate'
                : event.code === 'KeyR'
                  ? 'scale'
                  : 'stretch';
          this.setTool(which);
          return true;
        }
        case 'KeyX':
        case 'KeyY':
        case 'KeyZ':
          if (this.current !== 'fly') return false;
          this.transform.setAxis(event.code.slice(3) as 'X' | 'Y' | 'Z');
          return true;
        case 'KeyL':
          this.transform.setSpace(this.transform.space === 'local' ? 'world' : 'local');
          return true;
        case 'KeyF':
          if (this.current !== 'fly') return false;
          this.setMoveMode('free');
          return true;
        case 'KeyC':
          if (this.current !== 'fly') return false;
          this.setMoveMode('contact');
          return true;
        case 'KeyG':
          if (this.current !== 'fly') return false;
          this.setMoveMode('ground');
          return true;
        case 'KeyS':
          if (this.current !== 'fly' || this.selection.objects.length === 0) return false;
          this.picking = (id) => {
            const target = this.objectFor(id);
            if (target) this.transform.snapTo(target);
          };
          this.chrome.say('pick what to snap to…');
          return true;
        case 'End':
          this.transform.drop();
          return true;
        case 'Period':
          this.orbit.frame();
          return true;
        case 'Escape':
          this.picking = null;
          this.selection.clear();
          return true;
        default:
          return false;
      }
    });
  }

  /** The built object for an entry id in the zone being stood in. */
  objectFor(id: string): THREE.Object3D | null {
    const zone = this.app.zones.current;
    if (!zone?.isBuilt) return null;
    let found: THREE.Object3D | null = null;
    zone.root().traverse((object) => {
      if (found) return;
      const tag = object.userData.entry as { id: string } | undefined;
      if (tag?.id === id) found = object;
    });
    return found;
  }

  // --- state ----------------------------------------------------------------

  setTool(tool: Tool): void {
    this.transform.setTool(tool);
    for (const [which, toggle] of this.toolToggles) toggle.pressed = which === tool;
  }

  setMoveMode(mode: MoveMode): void {
    this.transform.setMode(mode);
    for (const [which, toggle] of this.moveToggles) toggle.pressed = which === mode;
  }

  setMode(mode: EditorMode): void {
    this.current = mode;
    for (const name of ['fly', 'play'] as const) this.modeToggles[name].pressed = name === mode;

    const { player, zones, input } = this.app;
    // Parallax frozen while flying, or the vista band slides under whatever is
    // being looked at and a placement cannot be judged.
    zones.freezeVista = mode === 'fly';
    this.transform.controls.getHelper().visible = mode === 'fly';

    if (mode === 'fly') {
      player.noclip = true;
      input.freeLook = true;
      if (document.pointerLockElement) document.exitPointerLock();
      this.setTool(this.transform.tool);
      this.setMoveMode(this.transform.mode);
      this.chrome.say('flying — right-drag to look, click to pick');
      return;
    }

    input.freeLook = false;
    player.noclip = false;
    const from = player.position.clone();
    const drop = this.app.collider.raycast(from, DOWN);
    if (drop !== null) {
      player.teleport(
        new THREE.Vector3(from.x, from.y - drop + SETTLE_CLEARANCE, from.z),
        player.heading,
      );
    }
    this.chrome.say('walking — click to capture, Tab to fly');
  }

  private openInGallery(builder: string, seed: number): void {
    const where = this.app.project.galleryFor?.(builder);
    if (!where) {
      this.chrome.say(`${builder} is not on show anywhere`);
      return;
    }
    this.chrome.say(`${builder} · seed ${seed}`);
    void this.app.zones.travel(where);
  }

  private report(): void {
    const { player, zones, collider } = this.app;
    const at = player.position;
    const zone = zones.current;
    this.chrome.set('mode', this.current);
    this.chrome.set(
      'tool',
      this.transform.tool + (this.transform.axis ? ` ${this.transform.axis}` : ''),
    );
    this.chrome.set('zone', (zone?.name ?? '—') + (zone && this.session.isDirty(zone.id) ? ' •' : ''));
    this.chrome.set('at', `${at.x.toFixed(1)} ${at.y.toFixed(1)} ${at.z.toFixed(1)}`);
    this.chrome.set('tris', `${collider.triangles.toLocaleString()} tris`);
    const lights = this.census();
    this.chrome.set('lights', lights.text, lights.over);
    const here = zone?.name;
    if (!here || this.zonePicker.value === here) return;
    if (![...this.zonePicker.options].some((option) => option.value === here)) this.refreshZoneList();
    this.zonePicker.value = here;
  }

  private refreshZoneList(): void {
    this.zonePicker.replaceChildren();
    for (const name of this.zoneNames()) {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      this.zonePicker.append(option);
    }
  }

  /** Point and spot lights in the built zone, against the tiers the manager pads to. */
  private census(): { text: string; over: boolean } {
    const zone = this.app.zones.current;
    if (!zone?.isBuilt) return { text: '—', over: false };
    let points = 0;
    let spots = 0;
    zone.root().traverse((object) => {
      if (object instanceof THREE.PointLight) points++;
      else if (object instanceof THREE.SpotLight) spots++;
    });
    return { text: `${points}/8 point · ${spots}/2 spot`, over: points > 8 || spots > 2 };
  }
}
