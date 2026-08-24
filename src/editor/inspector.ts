import GUI from 'lil-gui';
import type { Controller } from 'lil-gui';
import { builders, builderByName } from '../art/registry';
import type { Field } from '../art/schema';
import { COMPASS, entryKind, type Entry } from '../world/entry';
import { GROUND, COVER_TYPES } from '../world/ground';
import { SURFACES } from '../audio/models/footsteps';
import { allNotes } from '../world/notes';
import type { Session } from './session';
import { findIn } from './transform';

/**
 * Every field of the selected entry, as controls generated from the kind's
 * schema and, for a prop, the builder's own runtime options.
 *
 * A control that changes what you see writes a document field. Anything that
 * does not is on the View menu and marked session-only; there is no third kind.
 */

export interface InspectorHooks {
  /** Starts a pick-in-view for a ref field. */
  pick(onPicked: (id: string) => void): void;
  /** Opens the builder's gallery row with this seed marked. */
  openInGallery(builder: string, seed: number): void;
  /** Rebuild reach for a field: placement is cheap, anything else is not. */
  after(reach: 'transform' | 'zone'): void;
}

const YAW_WORDS = Object.keys(COMPASS);

export class Inspector {
  private readonly root: GUI;
  private readonly session: Session;
  private readonly hooks: InspectorHooks;
  private folder: GUI | null = null;
  private shown: { zone: string; id: string } | null = null;

  constructor(root: GUI, session: Session, hooks: InspectorHooks) {
    this.root = root;
    this.session = session;
    this.hooks = hooks;
  }

  /** Redraws for a selection, or clears when nothing is selected. */
  show(zone: string | null, id: string | null): void {
    if (zone === this.shown?.zone && id === this.shown?.id) return;
    this.shown = zone && id ? { zone, id } : null;
    this.folder?.destroy();
    this.folder = null;
    if (!zone || !id) return;

    const entry = this.session.entry(zone, id);
    if (!entry) return;

    const folder = this.root.addFolder(`${entry.kind} · ${id}`);
    this.folder = folder;
    folder.add({ id }, 'id').disable();

    this.placement(folder, zone, entry);
    this.kindFields(folder, zone, entry);
    folder.open();
  }

  /** Rebuilds the open folder in place, after something else changed the entry. */
  refresh(): void {
    const shown = this.shown;
    this.shown = null;
    this.show(shown?.zone ?? null, shown?.id ?? null);
  }

  private edit(
    zone: string,
    id: string,
    reach: 'transform' | 'zone',
    write: (entry: Entry) => void,
  ): void {
    this.session.commit(zone, reach, (doc) => {
      const entry = findIn(doc, id);
      if (entry) write(entry);
    });
    this.hooks.after(reach);
  }

  private placement(folder: GUI, zone: string, entry: Entry): void {
    const id = entry.id as string;
    const at = (entry.at ?? [0, 0]) as number[];
    const state = {
      x: at[0] ?? 0,
      y: at.length >= 3 ? at[1] : 0,
      z: at.length >= 3 ? at[2] : (at[1] ?? 0),
      settled: at.length < 3,
      yaw: typeof entry.yaw === 'number' ? entry.yaw : (COMPASS[entry.yaw ?? 'south'] ?? 0),
      scale: typeof entry.scale === 'number' ? entry.scale : 1,
      on: entry.on ?? '',
    };
    const writeAt = (): void => {
      this.edit(zone, id, 'transform', (target) => {
        target.at = state.settled ? [state.x, state.z] : [state.x, state.y, state.z];
      });
    };

    const place = folder.addFolder('placement');
    place.add(state, 'x', -400, 400, 0.01).onChange(writeAt).listen();
    place.add(state, 'z', -400, 400, 0.01).onChange(writeAt).listen();
    place.add(state, 'y', -60, 200, 0.01).onChange(writeAt).listen();
    place
      .add(state, 'settled')
      .name('sit on the ground')
      .onChange(writeAt);
    place
      .add(state, 'yaw', -Math.PI, Math.PI, 0.001)
      .onChange(() => this.edit(zone, id, 'transform', (target) => (target.yaw = state.yaw)))
      .listen();
    place
      .add({ compass: '' }, 'compass', ['', ...YAW_WORDS])
      .name('face')
      .onChange((word: string) => {
        if (!word) return;
        state.yaw = COMPASS[word as keyof typeof COMPASS];
        this.edit(zone, id, 'transform', (target) => (target.yaw = word as keyof typeof COMPASS));
      });
    if (entry.kind === 'prop' || entry.kind === 'creature') {
      place
        .add(state, 'scale', 0.2, 4, 0.01)
        .onChange(() => this.edit(zone, id, 'zone', (target) => (target.scale = state.scale)));
    }
    this.ref(place, 'stands on', state, 'on', (value) =>
      this.edit(zone, id, 'transform', (target) => {
        if (value) target.on = value;
        else delete target.on;
      }),
    );
  }

  /** A dropdown of entry ids with a crosshair button beside it. */
  private ref(
    folder: GUI,
    label: string,
    state: Record<string, unknown>,
    key: string,
    write: (value: string) => void,
  ): void {
    const ids = ['', ...this.currentIds()];
    const control = folder.add(state, key, ids).name(label).onChange(write);
    folder
      .add(
        {
          pick: () =>
            this.hooks.pick((picked) => {
              state[key] = picked;
              control.updateDisplay();
              write(picked);
            }),
        },
        'pick',
      )
      .name(`↖ pick ${label}`);
  }

  private currentIds(): string[] {
    const zone = this.shown?.zone;
    if (!zone) return [];
    return this.session
      .entries(zone)
      .map((row) => row.entry.id)
      .filter((id): id is string => typeof id === 'string' && id !== this.shown?.id);
  }

  private kindFields(folder: GUI, zone: string, entry: Entry): void {
    const id = entry.id as string;
    const record = entry as unknown as Record<string, unknown>;

    if ('seed' in record || entry.kind === 'prop' || entry.kind === 'creature') {
      const seed = { value: (record.seed as number) ?? 1 };
      const control = folder
        .add(seed, 'value', 0, 1_000_000, 1)
        .name('seed')
        .onChange(() => this.edit(zone, id, 'zone', (target) => ((target as { seed?: number }).seed = seed.value)));
      folder
        .add(
          {
            roll: () => {
              // Deliberate churn: a re-rolled seed is a different object, and
              // that is the point of the button.
              seed.value = Math.floor(Math.random() * 1_000_000);
              control.updateDisplay();
              this.edit(zone, id, 'zone', (target) => ((target as { seed?: number }).seed = seed.value));
            },
          },
          'roll',
        )
        .name('re-roll the seed');
    }

    if (entry.kind === 'prop' || entry.kind === 'creature') {
      const which = { builder: (record.builder as string) ?? '' };
      folder
        .add(which, 'builder', builders.map((builder) => builder.name))
        .onChange(() => {
          this.edit(zone, id, 'zone', (target) => ((target as { builder?: string }).builder = which.builder));
          this.refresh();
        });
      folder
        .add(
          { gallery: () => this.hooks.openInGallery(which.builder, (record.seed as number) ?? 1) },
          'gallery',
        )
        .name('open in the gallery');
    }

    if (entry.kind === 'prop') {
      const prop = record as { solid?: boolean; label?: string; text?: string; underfoot?: string; cover?: string; ground?: boolean };
      const state = {
        solid: prop.solid ?? true,
        label: prop.label ?? '',
        text: prop.text ?? '',
      };
      folder
        .add(state, 'solid')
        .onChange(() => this.edit(zone, id, 'zone', (target) => ((target as { solid?: boolean }).solid = state.solid)));
      folder
        .add(state, 'label')
        .onChange(() =>
          this.edit(zone, id, 'zone', (target) => {
            const held = target as { label?: string };
            if (state.label) held.label = state.label;
            else delete held.label;
          }),
        );
      folder
        .add(state, 'text', ['', ...allNotes().map((note) => note.id)])
        .name('bound note')
        .onChange(() =>
          this.edit(zone, id, 'zone', (target) => {
            const held = target as { text?: string };
            if (state.text) held.text = state.text;
            else delete held.text;
          }),
        );

      const ground = folder.addFolder('as ground').close();
      const groundState = {
        underfoot: prop.underfoot ?? '',
        cover: prop.cover ?? '',
        ground: prop.ground ?? false,
      };
      ground
        .add(groundState, 'underfoot', ['', ...Object.keys(SURFACES)])
        .onChange(() =>
          this.edit(zone, id, 'zone', (target) => {
            const held = target as { underfoot?: string };
            if (groundState.underfoot) held.underfoot = groundState.underfoot;
            else delete held.underfoot;
          }),
        );
      ground
        .add(groundState, 'cover', ['', ...Object.keys(COVER_TYPES)])
        .onChange(() =>
          this.edit(zone, id, 'zone', (target) => {
            const held = target as { cover?: string };
            if (groundState.cover) held.cover = groundState.cover;
            else delete held.cover;
          }),
        );
      ground
        .add(groundState, 'ground')
        .name('treat as ground')
        .onChange(() =>
          this.edit(zone, id, 'zone', (target) => ((target as { ground?: boolean }).ground = groundState.ground)),
        );

      this.builderOptions(folder, zone, entry);
    }

    if (entry.kind === 'creature') {
      const creature = record as { roam?: number; folk?: string; face?: string };
      const state = { roam: creature.roam ?? 0, folk: creature.folk ?? '' };
      folder
        .add(state, 'roam', 0, 12, 0.1)
        .name('roam (m)')
        .onChange(() => this.edit(zone, id, 'zone', (target) => ((target as { roam?: number }).roam = state.roam)));
      folder
        .add(state, 'folk', ['', 'country', 'city'])
        .onChange(() =>
          this.edit(zone, id, 'zone', (target) => {
            const held = target as { folk?: string };
            if (state.folk) held.folk = state.folk;
            else delete held.folk;
          }),
        );
    }

    // Everything a kind declares beyond the placement, which is the escape
    // hatch a new kind gets for free.
    const schema = entryKind(entry.kind)?.schema;
    if (schema) this.fields(folder, zone, entry, schema, record);
  }

  private builderOptions(folder: GUI, zone: string, entry: Entry): void {
    const record = entry as unknown as Record<string, unknown>;
    const builder = builderByName(record.builder as string);
    if (!builder?.options) return;
    const options = ((record.options as Record<string, unknown>) ?? {}) as Record<string, unknown>;
    const held = { ...options };
    const group = folder.addFolder('builder options');
    for (const [key, field] of Object.entries(builder.options)) {
      this.field(group, held, key, field, () =>
        this.edit(zone, entry.id as string, 'zone', (target) => {
          (target as { options?: Record<string, unknown> }).options = { ...held };
        }),
      );
    }
  }

  private fields(
    folder: GUI,
    zone: string,
    entry: Entry,
    schema: Record<string, Field>,
    record: Record<string, unknown>,
  ): void {
    const held = { ...record };
    for (const [key, field] of Object.entries(schema)) {
      this.field(folder, held, key, field, () =>
        this.edit(zone, entry.id as string, 'zone', (target) => {
          (target as Record<string, unknown>)[key] = held[key];
        }),
      );
    }
  }

  private field(
    folder: GUI,
    held: Record<string, unknown>,
    key: string,
    field: Field,
    write: () => void,
  ): Controller | null {
    const label = field.label ?? key;
    switch (field.type) {
      case 'number':
        held[key] ??= field.min ?? 0;
        return folder.add(held, key, field.min ?? 0, field.max ?? 10, field.step ?? 0.01).name(label).onChange(write);
      case 'int':
        held[key] ??= field.min ?? 1;
        return folder.add(held, key, field.min ?? 0, field.max ?? 100, 1).name(label).onChange(write);
      case 'boolean':
        held[key] ??= false;
        return folder.add(held, key).name(label).onChange(write);
      case 'choice': {
        const options = typeof field.options === 'function' ? field.options() : field.options;
        held[key] ??= '';
        return folder.add(held, key, ['', ...options]).name(label).onChange(write);
      }
      case 'color':
        held[key] ??= '#ffffff';
        return folder.addColor(held, key).name(label).onChange(write);
      case 'ref': {
        const state = held as Record<string, unknown>;
        state[key] ??= '';
        this.ref(folder, label, state, key, write);
        return null;
      }
      case 'string':
        held[key] ??= '';
        return folder.add(held, key).name(label).onChange(write);
      default:
        return null;
    }
  }
}

/** Named so the ground table is a dropdown rather than a typed string. */
export const GROUND_NAMES = Object.keys(GROUND);
