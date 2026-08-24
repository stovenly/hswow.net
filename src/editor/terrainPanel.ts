import GUI from 'lil-gui';
import type { Field } from '../art/schema';
import { GROUND, COVER_TYPES } from '../world/ground';
import type { ZoneDocument } from '../world/document';
import type { Point } from '../world/placement';
import type { Session } from './session';

/**
 * `TerrainOptions` as forms: size, resolution, base, the landform list, the
 * patch and cover lists, the detail rings, the edge fade, and the skirt.
 *
 * The shapes themselves are drawn with the shape tools; these are the numbers
 * beside them.
 */

type Record_ = Record<string, unknown>;

/** What each landform kind carries, beyond its own shape. */
const LANDFORM_FIELDS: Record<string, Record<string, Field>> = {
  hill: {
    radius: { type: 'number', min: 1, max: 200, step: 0.5 },
    height: { type: 'number', min: -60, max: 60, step: 0.05 },
    falloff: { type: 'number', min: 0.2, max: 4, step: 0.05, label: 'peakiness' },
  },
  basin: {
    radius: { type: 'number', min: 1, max: 200, step: 0.5 },
    depth: { type: 'number', min: 0, max: 60, step: 0.05 },
  },
  ridge: {
    width: { type: 'number', min: 0.5, max: 80, step: 0.5 },
    height: { type: 'number', min: -60, max: 60, step: 0.05 },
  },
  rim: {
    inset: { type: 'number', min: 0, max: 200, step: 1 },
    height: { type: 'number', min: -60, max: 120, step: 0.5 },
  },
  scarp: {
    run: { type: 'number', min: 0.5, max: 120, step: 0.5 },
    height: { type: 'number', min: -60, max: 60, step: 0.05 },
    side: { type: 'int', min: -1, max: 1, label: 'high side' },
    reach: { type: 'number', min: 0, max: 300, step: 1 },
  },
  channel: {
    width: { type: 'number', min: 0.5, max: 60, step: 0.5 },
    depth: { type: 'number', min: 0, max: 30, step: 0.05 },
    bank: { type: 'number', min: 0.5, max: 60, step: 0.5 },
  },
  terrace: {
    radius: { type: 'number', min: 1, max: 200, step: 0.5 },
    height: { type: 'number', min: -60, max: 60, step: 0.05 },
    blend: { type: 'number', min: 0.5, max: 60, step: 0.5 },
  },
};

const LANDFORM_KINDS = Object.keys(LANDFORM_FIELDS);

export interface TerrainPanelHooks {
  /** After a change that needs the zone raised again. */
  changed(): void;
  /** Draws a shape on the ground and hands it back. */
  drawCircle(onDone: (at: [number, number], radius: number) => void): void;
  drawPolyline(onDone: (points: [number, number][]) => void): void;
  drawRectangle(onDone: (min: [number, number], max: [number, number]) => void): void;
  /** Puts drag handles on a landform's own points. */
  editPoints(points: readonly Point[] | null, onChange?: (points: Point[]) => void): void;
}

export class TerrainPanel {
  private readonly root: GUI;
  private readonly session: Session;
  private readonly hooks: TerrainPanelHooks;
  private folder: GUI | null = null;
  private shown: string | null = null;

  constructor(root: GUI, session: Session, hooks: TerrainPanelHooks) {
    this.root = root;
    this.session = session;
    this.hooks = hooks;
  }

  show(zone: string | null): void {
    if (zone === this.shown) return;
    this.shown = zone;
    this.folder?.destroy();
    this.folder = null;
    const doc = zone ? this.session.doc(zone) : undefined;
    if (!doc) return;

    const folder = this.root.addFolder('terrain').close();
    this.folder = folder;
    if (!doc.terrain) {
      folder.add({ make: () => this.makeTerrain(doc) }, 'make').name('give this zone a heightfield');
      return;
    }
    this.field(folder, doc);
    this.landforms(folder, doc);
    this.paint(folder, doc);
    this.skirt(folder, doc);
  }

  refresh(): void {
    const shown = this.shown;
    this.shown = null;
    this.show(shown);
  }

  private edit(doc: ZoneDocument, write: () => void): void {
    this.session.commit(doc.id, 'zone', () => write());
    this.hooks.changed();
  }

  private makeTerrain(doc: ZoneDocument): void {
    this.edit(doc, () => {
      doc.terrain = { size: 96, resolution: 3, base: 'turf', landforms: [] };
      delete doc.flat;
    });
    this.refresh();
  }

  private field(folder: GUI, doc: ZoneDocument): void {
    const terrain = doc.terrain!;
    const state = {
      size: terrain.size,
      resolution: terrain.resolution,
      base: terrain.base ?? 'turf',
      rockAngle: terrain.rockAngle ?? 42,
      fade: terrain.edgeFade?.band ?? 0,
    };
    folder.add(state, 'size', 16, 600, 1).name('metres across').onChange(() =>
      this.edit(doc, () => (terrain.size = state.size)),
    );
    folder
      .add(state, 'resolution', 0.5, 12, 0.5)
      .name('metres per quad')
      .onChange(() => this.edit(doc, () => (terrain.resolution = state.resolution)));
    folder
      .add(state, 'base', Object.keys(GROUND))
      .name('unpainted ground')
      .onChange(() => this.edit(doc, () => (terrain.base = state.base as never)));
    folder
      .add(state, 'rockAngle', 10, 80, 1)
      .name('rock past (deg)')
      .onChange(() => this.edit(doc, () => (terrain.rockAngle = state.rockAngle)));
    folder
      .add(state, 'fade', 0, 200, 1)
      .name('cover fades over (m)')
      .onChange(() =>
        this.edit(doc, () => {
          if (state.fade > 0) terrain.edgeFade = { ...terrain.edgeFade, band: state.fade };
          else delete terrain.edgeFade;
        }),
      );
  }

  private landforms(folder: GUI, doc: ZoneDocument): void {
    const terrain = doc.terrain!;
    const group = folder.addFolder('landforms');
    const list = [...(terrain.landforms ?? [])] as Record_[];

    const write = (): void => this.edit(doc, () => (terrain.landforms = list as never));

    const added = { kind: 'hill' };
    group.add(added, 'kind', LANDFORM_KINDS).name('add');
    group
      .add(
        {
          add: () => {
            list.push(blankLandform(added.kind));
            write();
            this.refresh();
          },
        },
        'add',
      )
      .name('add it');

    list.forEach((form, index) => {
      const row = group.addFolder(`${index + 1} · ${String(form.kind)}`).close();
      const fields = LANDFORM_FIELDS[String(form.kind)] ?? {};
      for (const [key, field] of Object.entries(fields)) {
        if (form[key] === undefined) form[key] = field.type === 'int' ? 1 : 0;
        if (field.type === 'int') {
          row.add(form, key, field.min ?? -1, field.max ?? 1, 1).name(field.label ?? key).onChange(write);
        } else if (field.type === 'number') {
          row
            .add(form, key, field.min ?? 0, field.max ?? 100, field.step ?? 0.1)
            .name(field.label ?? key)
            .onChange(write);
        }
      }

      // The shape itself is drawn rather than typed.
      if ('at' in form || form.kind === 'hill' || form.kind === 'basin' || form.kind === 'terrace') {
        row
          .add(
            {
              draw: () =>
                this.hooks.drawCircle((at, radius) => {
                  form.at = at;
                  form.radius = radius;
                  write();
                  this.refresh();
                }),
            },
            'draw',
          )
          .name('draw the circle');
      }
      if (form.kind === 'ridge') {
        row
          .add(
            {
              draw: () =>
                this.hooks.drawPolyline((points) => {
                  form.from = points[0];
                  form.to = points[points.length - 1];
                  write();
                  this.refresh();
                }),
            },
            'draw',
          )
          .name('draw the line');
      }
      if (form.kind === 'scarp' || form.kind === 'channel') {
        row
          .add(
            {
              draw: () =>
                this.hooks.drawPolyline((points) => {
                  form.through = points;
                  write();
                  this.refresh();
                }),
            },
            'draw',
          )
          .name('draw the route');
        row
          .add(
            {
              handles: () =>
                this.hooks.editPoints((form.through as Point[]) ?? [], (points) => {
                  form.through = points;
                  write();
                }),
            },
            'handles',
          )
          .name('drag its points');
      }

      row.add({ remove: () => {
        list.splice(index, 1);
        write();
        this.refresh();
      } }, 'remove');
    });
  }

  private paint(folder: GUI, doc: ZoneDocument): void {
    const terrain = doc.terrain!;
    const patches = [...(terrain.patches ?? [])] as Record_[];
    const covers = [...(terrain.cover ?? [])] as Record_[];

    const group = folder.addFolder('paint').close();
    const writePatches = (): void => this.edit(doc, () => (terrain.patches = patches as never));
    const writeCovers = (): void => this.edit(doc, () => (terrain.cover = covers as never));

    const addShape = (
      list: Record_[],
      extra: Record_,
      write: () => void,
      kind: 'path' | 'blot' | 'field',
    ): void => {
      const done = (shape: Record_): void => {
        list.push({ ...shape, ...extra });
        write();
        this.refresh();
      };
      if (kind === 'blot') this.hooks.drawCircle((at, radius) => done({ kind: 'blot', at, radius }));
      else if (kind === 'field')
        this.hooks.drawRectangle((min, max) => done({ kind: 'field', min, max }));
      else this.hooks.drawPolyline((points) => done({ kind: 'path', through: points, width: 2 }));
    };

    const material = { name: 'dirt' as string };
    group.add(material, 'name', Object.keys(GROUND)).name('material');
    for (const kind of ['path', 'blot', 'field'] as const) {
      group
        .add({ draw: () => addShape(patches, { material: material.name }, writePatches, kind) }, 'draw')
        .name(`paint a ${kind}`);
    }

    const cover = { name: 'none' as string };
    group.add(cover, 'name', ['none', ...Object.keys(COVER_TYPES)]).name('cover');
    for (const kind of ['path', 'blot', 'field'] as const) {
      group
        .add(
          { draw: () => addShape(covers, { cover: cover.name, edge: 'hard' }, writeCovers, kind) },
          'draw',
        )
        .name(`cover a ${kind}`);
    }

    patches.forEach((patch, index) => {
      const row = group.addFolder(`patch ${index + 1} · ${String(patch.material)}`).close();
      row.add(patch, 'material', Object.keys(GROUND)).onChange(writePatches);
      if (patch.kind === 'path') row.add(patch, 'width', 0.5, 20, 0.1).onChange(writePatches);
      if (patch.kind === 'blot') row.add(patch, 'radius', 0.5, 100, 0.5).onChange(writePatches);
      row.add({ remove: () => {
        patches.splice(index, 1);
        writePatches();
        this.refresh();
      } }, 'remove');
    });

    covers.forEach((patch, index) => {
      const row = group.addFolder(`cover ${index + 1} · ${String(patch.cover)}`).close();
      row.add(patch, 'cover', ['none', ...Object.keys(COVER_TYPES)]).onChange(writeCovers);
      row.add(patch, 'edge', ['feather', 'hard']).onChange(writeCovers);
      row.add({ remove: () => {
        covers.splice(index, 1);
        writeCovers();
        this.refresh();
      } }, 'remove');
    });
  }

  private skirt(folder: GUI, doc: ZoneDocument): void {
    const group = folder.addFolder('skirt').close();
    if (!doc.skirt) {
      group
        .add(
          {
            make: () => {
              this.edit(doc, () => {
                doc.skirt = { reach: 320, resolution: 14, collar: 8, apron: 24, roll: 1, seed: 1 };
              });
              this.refresh();
            },
          },
          'make',
        )
        .name('give this level open country');
      return;
    }
    const skirt = doc.skirt as unknown as Record<string, number>;
    const write = (): void => this.edit(doc, () => {});
    const dial = (key: string, min: number, max: number, step: number, label?: string): void => {
      if (skirt[key] === undefined) skirt[key] = min;
      group.add(skirt, key, min, max, step).name(label ?? key).onChange(write);
    };
    dial('reach', 40, 900, 10, 'reaches (m)');
    dial('resolution', 2, 40, 1, 'metres per quad');
    dial('collar', 0, 40, 1, 'agrees over (m)');
    dial('apron', 0, 120, 1, 'falls away over (m)');
    dial('sink', 0, 40, 0.5, 'sinks under by (m)');
    dial('roll', 0, 4, 0.05, 'how much it rolls');
    dial('curve', 0, 20000, 100, 'world radius (m)');
    dial('seed', 0, 1_000_000, 1);
  }
}

function blankLandform(kind: string): Record_ {
  switch (kind) {
    case 'ridge':
      return { kind, from: [0, 0], to: [10, 0], width: 6, height: 1 };
    case 'rim':
      return { kind, inset: 10, height: 6 };
    case 'scarp':
      return { kind, through: [[0, 0], [10, 0]], run: 6, height: 1 };
    case 'channel':
      return { kind, through: [[0, 0], [10, 0]], width: 4, depth: 1, bank: 4 };
    case 'terrace':
      return { kind, at: [0, 0], radius: 10, height: 0, blend: 5 };
    case 'basin':
      return { kind, at: [0, 0], radius: 10, depth: 1 };
    default:
      return { kind: 'hill', at: [0, 0], radius: 12, height: 1 };
  }
}
