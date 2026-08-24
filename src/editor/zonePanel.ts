import GUI from 'lil-gui';
import { environmentNames } from '../world/environments';
import { interiorStyleNames } from '../world/interior';
import { ROOM_PRESETS } from '../audio/reverb';
import { SURFACES } from '../audio/models/footsteps';
import { VIBE_NAMES } from '../audio/vibes';
import { ZONE_GROUPS } from '../world/Zone';
import type { ZoneDocument } from '../world/document';
import type { Session } from './session';

/**
 * The zone's own header: where it stands, where you arrive, and the whole
 * environment block as controls.
 *
 * These are the same knobs the dev panel's light, fog and audio folders expose.
 * The difference is that these ones save.
 */

export interface ZonePanelHooks {
  /** After a change that needs the zone raised again. */
  rebuilt(zone: string): void;
  newZone(kind: 'exterior' | 'interior'): void;
  duplicate(): void;
  remove(): void;
}

export class ZonePanel {
  private readonly root: GUI;
  private readonly session: Session;
  private readonly hooks: ZonePanelHooks;
  private folder: GUI | null = null;
  private shown: string | null = null;

  constructor(root: GUI, session: Session, hooks: ZonePanelHooks) {
    this.root = root;
    this.session = session;
    this.hooks = hooks;
  }

  show(zone: string | null): void {
    if (zone === this.shown) return;
    this.shown = zone;
    this.folder?.destroy();
    this.folder = null;
    if (!zone) return;
    const doc = this.session.doc(zone);
    if (!doc) return;

    const folder = this.root.addFolder(`zone · ${doc.name}`);
    this.folder = folder;
    this.header(folder, doc);
    this.environment(folder, doc);
    this.shell(folder, doc);
    this.zones(folder);
  }

  refresh(): void {
    const shown = this.shown;
    this.shown = null;
    this.show(shown);
  }

  private edit(doc: ZoneDocument, write: () => void): void {
    this.session.commit(doc.id, 'zone', () => write());
    this.hooks.rebuilt(doc.id);
  }

  private header(folder: GUI, doc: ZoneDocument): void {
    const state = {
      name: doc.name,
      group: doc.group ?? '',
      floor: doc.floor ?? -20,
      atKm: doc.place?.at?.[0] ?? 0,
      atKm2: doc.place?.at?.[1] ?? 0,
      altitude: doc.place?.altitude ?? 0,
      weather: doc.place !== undefined,
      spawnX: doc.spawn?.at?.[0] ?? 0,
      spawnZ: (doc.spawn?.at?.length ?? 0) >= 3 ? (doc.spawn?.at?.[2] ?? 0) : (doc.spawn?.at?.[1] ?? 0),
      spawnYaw: typeof doc.spawn?.yaw === 'number' ? doc.spawn.yaw : 0,
    };
    folder.add({ id: doc.id }, 'id').disable();
    folder.add(state, 'name').onChange(() => this.edit(doc, () => (doc.name = state.name)));
    folder
      .add(state, 'group', ['', ...ZONE_GROUPS])
      .onChange(() =>
        this.edit(doc, () => {
          if (state.group) doc.group = state.group as (typeof ZONE_GROUPS)[number];
          else delete doc.group;
        }),
      );
    folder
      .add(state, 'floor', -200, 20, 1)
      .name('fall floor')
      .onChange(() => this.edit(doc, () => (doc.floor = state.floor)));

    // Where on the map, which is the whole of what a zone controls about its
    // weather: the day is global and a zone modifies what it samples.
    const place = folder.addFolder('on the map').close();
    const writePlace = (): void =>
      this.edit(doc, () => {
        if (state.weather) doc.place = { at: [state.atKm, state.atKm2], altitude: state.altitude };
        else delete doc.place;
      });
    place.add(state, 'weather').name('under the weather').onChange(writePlace);
    place.add(state, 'atKm', -500, 500, 0.1).name('east (km)').onChange(writePlace);
    place.add(state, 'atKm2', -500, 500, 0.1).name('north (km)').onChange(writePlace);
    place.add(state, 'altitude', -200, 4000, 1).name('altitude (m)').onChange(writePlace);

    const spawn = folder.addFolder('spawn').close();
    const writeSpawn = (): void =>
      this.edit(doc, () => {
        doc.spawn = { at: [state.spawnX, state.spawnZ], yaw: state.spawnYaw };
      });
    spawn.add(state, 'spawnX', -400, 400, 0.1).name('x').onChange(writeSpawn);
    spawn.add(state, 'spawnZ', -400, 400, 0.1).name('z').onChange(writeSpawn);
    spawn.add(state, 'spawnYaw', -Math.PI, Math.PI, 0.01).name('yaw').onChange(writeSpawn);
  }

  private environment(folder: GUI, doc: ZoneDocument): void {
    const env = (doc.environment ??= {});
    const air = folder.addFolder('environment');
    const state: Record<string, unknown> = {
      base: env.base ?? 'outdoor',
      sky: env.sky ?? true,
      fogColor: env.fogColor ?? '#bcd4e6',
      fogNear: env.fogNear ?? 25,
      fogFar: env.fogFar ?? 140,
      sunIntensity: env.sunIntensity ?? 2.2,
      fillIntensity: env.fillIntensity ?? 1.15,
      ambientIntensity: env.ambientIntensity ?? 1.8,
      wind: env.wind ?? 1,
      bearing: env.bearing ?? 0,
      room: env.room ?? 'open',
      surface: env.surface ?? 'soil',
      firstPersonReverb: env.firstPersonReverb ?? 0.7,
      vibe: typeof env.vibe === 'string' ? env.vibe : '',
    };
    const write = (key: string): (() => void) => () =>
      this.edit(doc, () => {
        const held = env as unknown as Record<string, unknown>;
        const value = state[key];
        if (value === '' ) delete held[key];
        else held[key] = value;
      });

    air.add(state, 'base', environmentNames()).name('preset').onChange(write('base'));
    air.add(state, 'sky').name('draw the sky').onChange(write('sky'));
    air.addColor(state, 'fogColor').onChange(write('fogColor'));
    air.add(state, 'fogNear', 0, 300, 1).onChange(write('fogNear'));
    air.add(state, 'fogFar', 0, 600, 1).onChange(write('fogFar'));
    air.add(state, 'sunIntensity', 0, 5, 0.05).name('sun').onChange(write('sunIntensity'));
    air.add(state, 'fillIntensity', 0, 5, 0.05).name('fill').onChange(write('fillIntensity'));
    air.add(state, 'ambientIntensity', 0, 5, 0.05).name('ambient').onChange(write('ambientIntensity'));
    air.add(state, 'wind', 0, 3, 0.05).name('wind ×').onChange(write('wind'));
    air.add(state, 'bearing', -180, 180, 1).name('bearing (°)').onChange(write('bearing'));
    air.add(state, 'room', Object.keys(ROOM_PRESETS)).name('acoustic').onChange(write('room'));
    air.add(state, 'surface', Object.keys(SURFACES)).name('floor').onChange(write('surface'));
    air
      .add(state, 'firstPersonReverb', 0, 1, 0.01)
      .name('your own reverb')
      .onChange(write('firstPersonReverb'));
    air.add(state, 'vibe', ['', ...VIBE_NAMES]).onChange(write('vibe'));
  }

  private shell(folder: GUI, doc: ZoneDocument): void {
    if (!doc.shell) return;
    const shell = doc.shell;
    const state = {
      width: shell.width,
      depth: shell.depth,
      height: shell.height,
      seed: shell.seed ?? 1,
      style: shell.style ?? 'house',
      planks: shell.planks ?? true,
      beams: shell.beams ?? 3,
    };
    const write = (): void =>
      this.edit(doc, () => {
        Object.assign(shell, state);
      });
    const group = folder.addFolder('shell');
    group.add(state, 'width', 2, 40, 0.1).onChange(write);
    group.add(state, 'depth', 2, 40, 0.1).onChange(write);
    group.add(state, 'height', 2, 12, 0.1).onChange(write);
    group.add(state, 'seed', 0, 1_000_000, 1).onChange(write);
    group.add(state, 'style', interiorStyleNames()).onChange(write);
    group.add(state, 'planks').name('boarded floor').onChange(write);
    group.add(state, 'beams', 0, 8, 1).onChange(write);
  }

  private zones(folder: GUI): void {
    const group = folder.addFolder('zones').close();
    group.add({ make: () => this.hooks.newZone('exterior') }, 'make').name('new exterior');
    group.add({ make: () => this.hooks.newZone('interior') }, 'make').name('new interior');
    group.add({ copy: () => this.hooks.duplicate() }, 'copy').name('duplicate this zone');
    group.add({ remove: () => this.hooks.remove() }, 'remove').name('delete this zone');
  }
}
