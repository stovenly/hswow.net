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
import { Thumbnails } from './thumbnails';
import { Palette } from './palette';
import { Outliner } from './outliner';
import { ZonePanel } from './zonePanel';
import { TerrainPanel } from './terrainPanel';
import { Visualisers, type ViewFlags } from './visualisers';
import { Shapes, groundPoint, type ShapeKind } from './shapes';
import { PortalTool } from './portals';
import { Terraform, type Brush } from './terraform';
import { findIn } from './transform';
import {
  addEntry,
  duplicateEntries,
  listOf,
  makePrefab,
  pasteEntries,
  removeEntries,
  reorderEntry,
  templateDocument,
} from './entries';
import { entryKind, type Entry } from '../world/entry';

export type EditorMode = 'fly' | 'play' | 'top';

/**
 * How high the top view sits, and how narrow its field is.
 *
 * A narrow field from a long way up rather than an orthographic camera: the
 * pipeline captures the perspective camera in a dozen places — the pixel stage,
 * the sky, the cover, the water's submersion test — and swapping it would be a
 * change to the renderer for the sake of a view mode.
 */
const TOP_HEIGHT = 340;
const TOP_FOV = 20;

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
  readonly zonePanel: ZonePanel;
  readonly palette: Palette;
  readonly outliner: Outliner;
  readonly thumbnails: Thumbnails;
  readonly terrainPanel: TerrainPanel;
  readonly visualisers: Visualisers;
  readonly shapes: Shapes;
  readonly portalTool: PortalTool;
  readonly terraform: Terraform;

  private current: EditorMode = 'fly';
  private readonly modeToggles: Record<EditorMode, Toggle>;
  private readonly toolToggles = new Map<Tool, Toggle>();
  private readonly moveToggles = new Map<MoveMode, Toggle>();
  private picking: ((id: string) => void) | null = null;
  private readonly zonePicker: HTMLSelectElement;
  /** Cut across zones: entries keep their seeds and get fresh ids on paste. */
  private clipboard: Entry[] = [];
  /** Where the last prop brush stroke put something, so spacing is honoured. */
  private lastBrush: THREE.Vector3 | null = null;
  /** What the camera was doing before the top view, so leaving restores it. */
  private beforeTop: { position: THREE.Vector3; yaw: number; pitch: number; fov: number } | null = null;
  private wiringPortals = false;
  /** ctrl-drag between two points, metres in the status line. */
  private ruler: THREE.Vector3 | null = null;
  private rulerText = '';
  /** Where a key sends the camera. Session-only, like everything on the View menu. */
  private readonly bookmarks = new Map<string, { position: THREE.Vector3; yaw: number; pitch: number }>();

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

    this.thumbnails = new Thumbnails(app);
    this.palette = new Palette(this.thumbnails);
    this.palette.visible = false;
    this.palette.onChoice = (choice) => {
      this.chrome.say(choice ? `placing ${choice.builder ?? choice.kind} — click the ground` : '');
    };

    this.outliner = new Outliner(this.session, {
      select: (id, extend) => this.selectById(id, extend),
      frame: (id) => {
        this.selectById(id, false);
        this.orbit.frame();
      },
      setVisible: (id, visible) => {
        const object = this.objectFor(id);
        if (object) object.visible = visible;
      },
      reorder: (from, to) => {
        const zone = app.zones.current?.id;
        if (zone) reorderEntry(this.session, zone, from, to);
      },
    });
    this.outliner.visible = false;

    this.visualisers = new Visualisers(app, this.session);
    this.shapes = new Shapes(app);
    this.terraform = new Terraform(app, this.session);
    this.terraform.say = (message) => this.chrome.say(message);
    this.portalTool = new PortalTool(app, this.session);
    this.portalTool.say = (message) => this.chrome.say(message);
    this.portalTool.onWired = () => this.visualisers.invalidate();

    this.terrainPanel = new TerrainPanel(this.gui, this.session, {
      changed: () => this.visualisers.invalidate(),
      drawCircle: (onDone) =>
        this.shapes.start('circle', (shape) => {
          if (shape.kind === 'circle') onDone([shape.at[0], shape.at[1]], shape.radius);
        }),
      drawPolyline: (onDone) =>
        this.shapes.start('polyline', (shape) => {
          if (shape.kind === 'polyline') onDone(shape.points.map((point) => [point[0], point[1]]));
        }),
      drawRectangle: (onDone) =>
        this.shapes.start('rectangle', (shape) => {
          if (shape.kind === 'rectangle') {
            onDone([shape.min[0], shape.min[1]], [shape.max[0], shape.max[1]]);
          }
        }),
      editPoints: (points, onChange) => this.shapes.edit(points, onChange),
    });

    this.zonePanel = new ZonePanel(this.gui, this.session, {
      rebuilt: () => {},
      newZone: (kind) => this.newZone(kind),
      duplicate: () => this.duplicateZone(),
      remove: () => void this.removeZone(),
    });

    const modes = this.chrome.group();
    this.modeToggles = {
      fly: this.chrome.toggle(modes, 'fly', () => this.setMode('fly'), 'free camera'),
      play: this.chrome.toggle(modes, 'play', () => this.setMode('play'), 'drop in as the player — Tab'),
      top: this.chrome.toggle(modes, 'top', () => this.setMode('top'), 'straight down — Home'),
    };
    this.zonePicker = this.buildToolbar();

    this.brushMenu();
    this.viewMenu();
    const tuning = this.gui.addFolder('tuning').close();
    installDevPanel(tuning, app);

    this.bindMouse();
    this.bindKeys();

    this.selection.onChanged(() => {
      const tag = this.selection.tag;
      this.inspector.show(tag?.zone ?? null, tag?.id ?? null);
      this.refreshOutliner();
      this.showHandles(tag);
    });
    this.transform.onCommit = () => this.inspector.refresh();
    this.session.onChange = () => {
      this.report();
      this.refreshOutliner();
      this.zonePanel.refresh();
      this.terrainPanel.refresh();
      this.visualisers.invalidate();
    };

    this.setMode('fly');
    this.zonePanel.show(app.zones.current?.id ?? null);
    this.terrainPanel.show(app.zones.current?.id ?? null);
    this.refreshOutliner();
    app.loop.add(() => this.report());
  }

  get mode(): EditorMode {
    return this.current;
  }

  /** The brushes, and the swatch rows they paint from. */
  private brushMenu(): void {
    const folder = this.gui.addFolder('ground brush').close();
    const brushes: Brush[] = [
      'raise',
      'smooth',
      'flatten',
      'set',
      'ramp',
      'roughen',
      'erase',
      'paint',
      'unpaint',
    ];
    folder
      .add(this.terraform, 'brush', brushes)
      .onChange(() => this.setBrush(true));
    folder.add(this.terraform, 'radius', 0.5, 120, 0.5).name('radius (m)').listen();
    folder.add(this.terraform, 'strength', 0.05, 6, 0.05);
    folder.add(this.terraform, 'falloff', ['smooth', 'linear', 'flat']);
    folder.add(this.terraform, 'seed', 0, 1_000_000, 1).name('roughen seed');
    folder.add(this.terraform, 'painting', ['material', 'cover']).name('paint which');
    folder.add(this.terraform, 'material', [...Terraform.materials]);
    folder.add(this.terraform, 'cover', [...Terraform.covers]);
    folder
      .add({ off: () => this.setBrush(false) }, 'off')
      .name('put the brush down');
  }

  /** B turns the ground brush on; it and the gizmo are never both live. */
  setBrush(on: boolean): void {
    this.terraform.setEnabled(on);
    this.transform.controls.enabled = !on && this.selection.objects.length > 0;
    this.chrome.say(on ? `${this.terraform.brush} — scroll for radius` : '');
  }

  /** Everything session-only, in one folder that says so. */
  private viewMenu(): void {
    const folder = this.gui.addFolder('view · session only').close();
    const flags = this.visualisers.flags;
    for (const key of Object.keys(flags) as (keyof ViewFlags)[]) {
      folder.add(flags, key).onChange((on: boolean) => this.visualisers.set(key, on));
    }
    folder.add(this.app.zones, 'showBarriers').name('invisible walls');
    folder.add(this.app.zones, 'freezeVista').name('freeze the vista').listen();

    const isolate = { kind: 'everything' };
    const kinds = ['everything', ...entryKindNames()];
    folder
      .add(isolate, 'kind', kinds)
      .name('isolate')
      .onChange((kind: string) => this.isolate(kind === 'everything' ? null : kind));
  }

  /** Hides every entry but one kind. Inspection state; nothing is written. */
  private isolate(kind: string | null): void {
    const zone = this.app.zones.current;
    if (!zone?.isBuilt) return;
    for (const { entry } of this.session.entries(zone.id)) {
      const object = entry.id ? this.objectFor(entry.id) : null;
      if (object) object.visible = kind === null || entry.kind === kind;
    }
    this.outliner.isolate(kind);
  }

  /** Draws a shape and writes it into whatever the selection can take. */
  private drawInto(kind: ShapeKind): void {
    const tag = this.selection.tag;
    if (!tag) {
      this.chrome.say('select what the shape belongs to first');
      return;
    }
    this.shapes.start(kind, (shape) => {
      this.session.commit(tag.zone, 'zone', (doc) => {
        const entry = findIn(doc, tag.id) as unknown as Record<string, unknown> | undefined;
        if (!entry) return;
        if (shape.kind === 'polyline') {
          if (entry.kind === 'run') entry.points = shape.points;
          else if (entry.kind === 'chain') {
            entry.start = shape.points[0];
            entry.edges = shape.points.slice(1).map((to) => ({ to, kind: 'fence' }));
            delete entry.runs;
          }
        } else if (shape.kind === 'circle') {
          entry.from = shape.at;
          entry.within = shape.radius;
        } else {
          entry.at = [(shape.min[0] + shape.max[0]) / 2, (shape.min[1] + shape.max[1]) / 2];
          entry.size = [shape.max[0] - shape.min[0], shape.max[1] - shape.min[1]];
        }
      });
      this.chrome.say(`shaped ${tag.id}`);
    });
    this.chrome.say('click to place points, enter to finish, escape to drop it');
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

    const shapes = chrome.group();
    for (const [label, kind] of [['line', 'polyline'], ['circle', 'circle'], ['box', 'rectangle']] as const) {
      chrome.button(shapes, label, () => this.drawInto(kind), `draw into the selection`);
    }
    const portalToggle = chrome.toggle(shapes, 'portal', () => {
      this.wiringPortals = !this.wiringPortals;
      portalToggle.pressed = this.wiringPortals;
      if (!this.wiringPortals) this.portalTool.cancel();
      this.chrome.say(this.wiringPortals ? 'pick a door site' : '');
    }, 'wire a door between two zones');

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

    const panels = chrome.group();
    const paletteToggle = chrome.toggle(panels, 'palette', () => {
      this.palette.visible = !this.palette.visible;
      paletteToggle.pressed = this.palette.visible;
    }, 'what can be placed');
    const outlinerToggle = chrome.toggle(panels, 'outliner', () => {
      this.outliner.visible = !this.outliner.visible;
      outlinerToggle.pressed = this.outliner.visible;
      this.refreshOutliner();
    }, 'the tree');

    const edit = chrome.group();
    chrome.button(edit, 'copy', () => this.copy(), 'ctrl-C');
    chrome.button(edit, 'duplicate', () => this.duplicate(), 'ctrl-D');
    chrome.button(edit, 'delete', () => this.remove(), 'Del');
    chrome.button(edit, 'prefab', () => this.savePrefab(), 'save the selection as a prefab');

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
      if (this.terraform.enabled) {
        this.terraform.hover(event, (event.buttons & 1) !== 0);
        return;
      }
      if (this.shapes.drag(event)) return;
      if (this.ruler) {
        const at = groundPoint(this.app, event);
        if (at) this.rulerText = `${this.ruler.distanceTo(at).toFixed(2)} m`;
        return;
      }
      if (this.current === 'play' || this.transform.controls.dragging || this.orbit.active) return;
      this.selection.hover(this.selection.pick(event));
    });

    canvas.addEventListener('pointerup', () => {
      this.terraform.up();
      this.shapes.release();
      this.ruler = null;
    });

    canvas.addEventListener(
      'wheel',
      (event) => {
        if (!this.terraform.enabled || event.shiftKey) return;
        this.terraform.scale(event.deltaY);
        event.preventDefault();
      },
      { passive: false },
    );

    canvas.addEventListener('dblclick', () => this.shapes.finishPolyline());

    canvas.addEventListener('pointerdown', (event) => {
      if (this.current === 'play' || event.button !== 0 || event.shiftKey) return;
      if (this.terraform.enabled) {
        this.terraform.down(event, event.shiftKey);
        return;
      }
      if (this.shapes.click(event)) return;
      if (this.shapes.grab(event)) return;
      if (event.ctrlKey && event.altKey) {
        this.ruler = groundPoint(this.app, event);
        return;
      }
      if (this.wiringPortals) {
        this.portalTool.click(event, this.selection.pick(event));
        return;
      }
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

      if (this.palette.choice) {
        this.placeAt(event);
        return;
      }

      if (!hit) {
        if (!event.ctrlKey) this.selection.clear();
        return;
      }
      if (event.ctrlKey) this.selection.toggle(hit);
      else this.selection.set([hit]);
    });

    // The prop brush: drag a favourite out at a spacing, one kept seed each.
    canvas.addEventListener('pointermove', (event) => {
      if (this.current !== 'fly' || !this.palette.brushing || !(event.buttons & 1)) return;
      const at = this.groundUnderCursor(event);
      if (!at) return;
      if (this.lastBrush && at.distanceTo(this.lastBrush) < this.palette.brushSpacing) return;
      this.lastBrush = at.clone();
      this.placeChoice(at, null);
    });
    canvas.addEventListener('pointerup', () => {
      this.lastBrush = null;
    });
  }

  /** Where the cursor meets the world, by collider raycast. */
  private groundUnderCursor(event: MouseEvent): THREE.Vector3 | null {
    const zone = this.app.zones.current;
    if (!zone?.isBuilt) return null;
    const canvas = this.app.viewport.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    const caster = new THREE.Raycaster();
    caster.setFromCamera(pointer, this.app.viewport.camera);
    const hit = caster.intersectObject(zone.root(), true)[0];
    return hit ? hit.point.clone() : null;
  }

  private placeAt(event: MouseEvent): void {
    const at = this.groundUnderCursor(event);
    if (!at) return;
    this.placeChoice(at, null);
  }

  /**
   * Places whatever the palette is holding. A favourite rolls its yaw and scale
   * from the ranges pinned with it; anything else takes the yaw given, or zero.
   */
  private placeChoice(at: THREE.Vector3, yaw: number | null): void {
    const choice = this.palette.choice;
    const zone = this.app.zones.current?.id;
    if (!choice || !zone) return;
    const favourite = choice.builder ? this.palette.favourite(choice.builder) : undefined;
    const seed = Math.floor(Math.random() * 1_000_000);
    const rolled = favourite
      ? favourite.yaw[0] + Math.random() * (favourite.yaw[1] - favourite.yaw[0])
      : 0;
    const scale = favourite
      ? favourite.scale[0] + Math.random() * (favourite.scale[1] - favourite.scale[0])
      : undefined;

    const kind = choice.kind || 'prop';
    const entry = {
      ...(entryKind(kind)?.defaults?.() ?? {}),
      kind,
      ...(choice.builder ? { builder: choice.builder } : {}),
      seed,
      at: [round(at.x), round(at.z)],
      yaw: round(yaw ?? rolled, 4),
      ...(scale !== undefined && Math.abs(scale - 1) > 0.001 ? { scale: round(scale, 3) } : {}),
    } as unknown as Entry;

    const id = addEntry(this.session, zone, entry, choice.builder ?? choice.kind);
    if (id) this.chrome.say(`placed ${id}`);
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
        if (event.code === 'KeyC') {
          this.copy();
          return true;
        }
        if (event.code === 'KeyV') {
          this.paste(event.shiftKey);
          return true;
        }
        if (event.code === 'KeyD') {
          this.duplicate();
          return true;
        }
        if (event.code.startsWith('Digit')) {
          this.bookmarks.set(event.code, {
            position: this.app.player.position.clone(),
            yaw: this.app.player.heading,
            pitch: this.app.player.tilt,
          });
          this.chrome.say(`bookmark ${event.code.slice(5)}`);
          return true;
        }
        return false;
      }

      switch (event.code) {
        case 'Tab':
          this.setMode(this.current === 'play' ? 'fly' : 'play');
          return true;
        case 'Home':
          this.setMode(this.current === 'top' ? 'fly' : 'top');
          return true;
        case 'KeyP':
          this.drawInto('polyline');
          return true;
        case 'Enter':
          this.shapes.finishPolyline();
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
        case 'Delete':
          this.remove();
          return true;
        case 'KeyB':
          this.setBrush(!this.terraform.enabled);
          return true;
        case 'KeyN':
          this.palette.brushing = !this.palette.brushing;
          this.chrome.say(this.palette.brushing ? 'prop brush on' : 'prop brush off');
          return true;
        case 'End':
          this.transform.drop();
          return true;
        case 'Period':
          this.orbit.frame();
          return true;
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9': {
          const held = this.bookmarks.get(event.code);
          if (!held) return false;
          this.app.player.teleport(held.position, held.yaw);
          this.app.player.aim(held.yaw, held.pitch);
          return true;
        }
        case 'Escape':
          this.picking = null;
          this.shapes.cancel();
          this.portalTool.cancel();
          this.setBrush(false);
          this.palette.pick(null);
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

  private selectById(id: string, extend: boolean): void {
    const object = this.objectFor(id);
    if (!object) return;
    if (extend) this.selection.add(object);
    else this.selection.set([object]);
  }

  private selectedIds(): string[] {
    return this.selection.objects
      .map((object) => entryTagOf(object)?.id)
      .filter((id): id is string => typeof id === 'string');
  }

  private copy(): void {
    const zone = this.app.zones.current?.id;
    const doc = zone ? this.session.doc(zone) : undefined;
    if (!doc) return;
    const wanted = new Set(this.selectedIds());
    this.clipboard = listOf(doc)
      .filter((entry) => wanted.has(entry.id ?? ''))
      .map((entry) => JSON.parse(JSON.stringify(entry)) as Entry);
    this.chrome.say(`copied ${this.clipboard.length}`);
  }

  private paste(inPlace: boolean): void {
    const zone = this.app.zones.current?.id;
    if (!zone || this.clipboard.length === 0) return;
    const at = this.app.player.position;
    const made = pasteEntries(this.session, zone, this.clipboard, inPlace, [
      round(at.x),
      round(at.z),
    ]);
    this.chrome.say(`pasted ${made.length}`);
  }

  private duplicate(): void {
    const zone = this.app.zones.current?.id;
    if (!zone) return;
    const made = duplicateEntries(this.session, zone, this.selectedIds(), 1);
    this.chrome.say(`duplicated ${made.length}`);
  }

  private remove(): void {
    const zone = this.app.zones.current?.id;
    if (!zone) return;
    const ids = this.selectedIds();
    if (ids.length === 0) return;
    this.selection.clear();
    removeEntries(this.session, zone, ids);
    this.chrome.say(`deleted ${ids.length}`);
  }

  private savePrefab(): void {
    const zone = this.app.zones.current?.id;
    const ids = this.selectedIds();
    if (!zone || ids.length === 0) return;
    const name = window.prompt('prefab name', ids[0]);
    if (!name) return;
    makePrefab(this.session, zone, ids, name);
    this.chrome.say(`saved prefab ${name}`);
  }

  private newZone(kind: 'exterior' | 'interior'): void {
    const id = window.prompt('zone id', `${kind}-1`);
    if (!id) return;
    const name = window.prompt('zone name', id) ?? id;
    this.session.createZone(templateDocument(id, name, kind));
    void this.app.zones.travel(id);
    this.chrome.say(`made ${id}`);
  }

  private duplicateZone(): void {
    const from = this.app.zones.current?.id;
    const doc = from ? this.session.doc(from) : undefined;
    if (!doc) return;
    const id = window.prompt('new zone id', `${doc.id}-copy`);
    if (!id) return;
    const copy = JSON.parse(JSON.stringify(doc)) as ZoneDocument;
    copy.id = id;
    copy.name = `${doc.name} copy`;
    this.session.createZone(copy);
    void this.app.zones.travel(id);
  }

  private async removeZone(): Promise<void> {
    const id = this.app.zones.current?.id;
    if (!id || !this.session.doc(id)) return;
    if (!window.confirm(`delete ${id}? Its portals go with it.`)) return;
    await this.session.deleteZone(id);
    this.chrome.say(`deleted ${id} — reload to clear it from the world`);
  }

  /** A selected run or chain gets a draggable handle on each of its points. */
  private showHandles(tag: { zone: string; id: string } | null): void {
    const entry = tag ? this.session.entry(tag.zone, tag.id) : undefined;
    const record = entry as unknown as Record<string, unknown> | undefined;
    if (!tag || !record) {
      this.shapes.edit(null);
      return;
    }
    if (record.kind === 'run' && Array.isArray(record.points)) {
      this.shapes.edit(record.points as [number, number][], (points) => {
        this.session.commit(tag.zone, 'zone', (doc) => {
          const held = findIn(doc, tag.id) as unknown as Record<string, unknown> | undefined;
          if (held) held.points = points;
        });
      });
      return;
    }
    if (record.kind === 'chain' && Array.isArray(record.edges)) {
      const edges = record.edges as { to: [number, number]; kind?: 'wall' | 'fence' }[];
      const start = (record.start as [number, number]) ?? [0, 0];
      this.shapes.edit([start, ...edges.map((edge) => edge.to)], (points) => {
        this.session.commit(tag.zone, 'zone', (doc) => {
          const held = findIn(doc, tag.id) as unknown as Record<string, unknown> | undefined;
          if (!held) return;
          held.start = points[0];
          held.edges = points.slice(1).map((to, index) => ({
            to,
            kind: edges[index]?.kind ?? 'fence',
          }));
        });
      });
      return;
    }
    this.shapes.edit(null);
  }

  private refreshOutliner(): void {
    const zone = this.app.zones.current?.id ?? null;
    this.outliner.show(this.session.doc(zone ?? '') ? zone : null, this.selectedIds());
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
    const leavingTop = this.current === 'top' && mode !== 'top';
    this.current = mode;
    for (const name of ['fly', 'play', 'top'] as const) this.modeToggles[name].pressed = name === mode;

    const { player, zones, input } = this.app;
    // Parallax frozen unless the player is walking, or the vista band slides
    // under whatever is being looked at and a placement cannot be judged.
    zones.freezeVista = mode !== 'play';
    this.transform.controls.getHelper().visible = mode !== 'play';

    if (leavingTop && this.beforeTop) {
      player.tuning.fov = this.beforeTop.fov;
      player.teleport(this.beforeTop.position, this.beforeTop.yaw);
      player.aim(this.beforeTop.yaw, this.beforeTop.pitch);
      this.beforeTop = null;
    }

    if (mode === 'top') {
      this.beforeTop = {
        position: player.position.clone(),
        yaw: player.heading,
        pitch: player.tilt,
        fov: player.tuning.fov,
      };
      player.noclip = true;
      input.freeLook = true;
      if (document.pointerLockElement) document.exitPointerLock();
      player.tuning.fov = TOP_FOV;
      const at = player.position;
      player.teleport(new THREE.Vector3(at.x, TOP_HEIGHT, at.z), 0);
      player.aim(0, -Math.PI / 2 + 0.001);
      this.visualisers.set('grid', true);
      this.chrome.say('straight down — draw shapes here');
      return;
    }

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
    if (this.rulerText) this.chrome.set('ruler', this.rulerText);
    const here = zone?.name;
    if (!here || this.zonePicker.value === here) return;
    this.zonePanel.show(zone?.id ?? null);
    this.terrainPanel.show(zone?.id ?? null);
    this.refreshOutliner();
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

function round(value: number, places = 3): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

/** Every kind the isolate filter can name. */
function entryKindNames(): string[] {
  return [
    'prop', 'creature', 'run', 'chain', 'scatter', 'barrier', 'prefab', 'ground',
    'water', 'particles', 'fogVolume', 'glitch', 'horror', 'sound', 'soundScatter',
    'vistaRing', 'dressing',
  ].filter((kind) => entryKind(kind) !== undefined);
}
