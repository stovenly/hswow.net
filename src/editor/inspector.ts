import { builders, builderByName } from '../art/registry';
import type { Field } from '../art/schema';
import { COMPASS, entryKind, type Entry } from '../world/entry';
import { COVER_TYPES } from '../world/ground';
import { SURFACES } from '../audio/models/footsteps';
import { allNotes } from '../world/notes';
import type { Panel, Section } from './ui';
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
const TURN = { min: -Math.PI, max: Math.PI, step: 0.001, scrub: 0.01 };
const METRES = { step: 0.01, scrub: 0.02 };

export class Inspector {
  private readonly panel: Panel;
  private readonly session: Session;
  private readonly hooks: InspectorHooks;
  private shown: { zone: string; id: string } | null = null;

  constructor(panel: Panel, session: Session, hooks: InspectorHooks) {
    this.panel = panel;
    this.session = session;
    this.hooks = hooks;
    this.panel.clear();
    this.panel.loose().note('nothing selected');
  }

  /** Redraws for a selection, or clears when nothing is selected. */
  show(zone: string | null, id: string | null): void {
    if (zone === this.shown?.zone && id === this.shown?.id) return;
    this.shown = zone && id ? { zone, id } : null;
    this.panel.clear();

    if (!zone || !id) {
      this.panel.loose().note('nothing selected');
      return;
    }
    const entry = this.session.entry(zone, id);
    if (!entry) {
      this.panel.loose().note(`no entry "${id}"`);
      return;
    }

    const head = this.panel.loose();
    head.readout(entry.kind, id);

    this.placement(this.panel.section('placement'), zone, entry);
    this.body(zone, entry);
  }

  /** Rebuilds in place, after something else changed the entry. */
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

  private ids(): string[] {
    const zone = this.shown?.zone;
    if (!zone) return [];
    return this.session
      .entries(zone)
      .map((row) => row.entry.id)
      .filter((id): id is string => typeof id === 'string' && id !== this.shown?.id);
  }

  // --- placement -------------------------------------------------------------

  private placement(section: Section, zone: string, entry: Entry): void {
    const id = entry.id as string;
    const at = (entry.at ?? [0, 0]) as number[];
    const flat = at.length < 3;
    const state = {
      x: at[0] ?? 0,
      y: flat ? 0 : at[1],
      z: flat ? (at[1] ?? 0) : at[2],
      settled: flat,
    };
    const writeAt = (): void => {
      this.edit(zone, id, 'transform', (target) => {
        target.at = state.settled ? [state.x, state.z] : [state.x, state.y, state.z];
      });
    };

    section.vector(
      'at',
      [state.x, state.y, state.z],
      ['x', 'y', 'z'],
      METRES,
      (index, value) => {
        if (index === 0) state.x = value;
        else if (index === 1) state.y = value;
        else state.z = value;
        writeAt();
      },
    );
    section.toggle('on the ground', state.settled, (on) => {
      state.settled = on;
      writeAt();
      this.refresh();
    });

    const yaw = typeof entry.yaw === 'number' ? entry.yaw : (COMPASS[entry.yaw ?? 'south'] ?? 0);
    section.number('yaw', yaw, TURN, (value) =>
      this.edit(zone, id, 'transform', (target) => (target.yaw = value)),
    );
    section.select('facing', typeof entry.yaw === 'string' ? entry.yaw : '', ['', ...YAW_WORDS], (word) => {
      if (!word) return;
      this.edit(zone, id, 'transform', (target) => (target.yaw = word as keyof typeof COMPASS));
      this.refresh();
    });

    if (entry.kind === 'prop' || entry.kind === 'creature') {
      section.number('scale', typeof entry.scale === 'number' ? entry.scale : 1, {
        min: 0.05,
        max: 8,
        step: 0.01,
      }, (value) => this.edit(zone, id, 'zone', (target) => (target.scale = value)));
    }

    section.ref(
      'stands on',
      entry.on ?? '',
      this.ids(),
      (value) =>
        this.edit(zone, id, 'transform', (target) => {
          if (value) target.on = value;
          else delete target.on;
        }),
      (accept) => this.hooks.pick(accept),
    );
  }

  // --- the entry's own fields ------------------------------------------------

  private body(zone: string, entry: Entry): void {
    const id = entry.id as string;
    const record = entry as unknown as Record<string, unknown>;

    if (entry.kind === 'prop' || entry.kind === 'creature') {
      const made = this.panel.section(entry.kind === 'prop' ? 'prop' : 'creature');
      made.select('builder', (record.builder as string) ?? '', builders.map((b) => b.name), (name) => {
        this.edit(zone, id, 'zone', (target) => ((target as { builder?: string }).builder = name));
        this.refresh();
      });
      const seed = (record.seed as number) ?? 1;
      made.number('seed', seed, { min: 0, max: 1_000_000, step: 1, scrub: 40 }, (value) =>
        this.edit(zone, id, 'zone', (target) => ((target as { seed?: number }).seed = value)),
      );
      made.actions(
        {
          label: 're-roll',
          title: 'a different object of the same kind',
          onClick: () => {
            // Deliberate churn: a re-rolled seed is a different object, and
            // that is the whole point of the button.
            this.edit(zone, id, 'zone', (target) => {
              (target as { seed?: number }).seed = Math.floor(Math.random() * 1_000_000);
            });
            this.refresh();
          },
        },
        {
          label: 'in the gallery',
          onClick: () => this.hooks.openInGallery((record.builder as string) ?? '', seed),
        },
      );
    }

    if (entry.kind === 'prop') this.prop(zone, entry, record);
    if (entry.kind === 'creature') this.creature(zone, entry, record);

    const schema = entryKind(entry.kind)?.schema;
    if (schema && Object.keys(schema).length > 0) {
      this.fields(this.panel.section(entry.kind), zone, entry, schema, record);
    }
  }

  private prop(zone: string, entry: Entry, record: Record<string, unknown>): void {
    const id = entry.id as string;
    const held = record as { solid?: boolean; label?: string; text?: string };

    const world = this.panel.section('in the world');
    world.toggle('solid', held.solid ?? true, (on) =>
      this.edit(zone, id, 'zone', (target) => ((target as { solid?: boolean }).solid = on)),
    );
    world.text('label', held.label ?? '', (value) =>
      this.edit(zone, id, 'zone', (target) => {
        const named = target as { label?: string };
        if (value) named.label = value;
        else delete named.label;
      }),
    );
    world.select('bound note', held.text ?? '', ['', ...allNotes().map((note) => note.id)], (value) =>
      this.edit(zone, id, 'zone', (target) => {
        const named = target as { text?: string };
        if (value) named.text = value;
        else delete named.text;
      }),
    );

    const ground = this.panel.section('as ground', false);
    const state = record as { underfoot?: string; cover?: string; ground?: boolean };
    ground.select('underfoot', state.underfoot ?? '', ['', ...Object.keys(SURFACES)], (value) =>
      this.edit(zone, id, 'zone', (target) => {
        const named = target as { underfoot?: string };
        if (value) named.underfoot = value;
        else delete named.underfoot;
      }),
    );
    ground.select('grows', state.cover ?? '', ['', ...Object.keys(COVER_TYPES)], (value) =>
      this.edit(zone, id, 'zone', (target) => {
        const named = target as { cover?: string };
        if (value) named.cover = value;
        else delete named.cover;
      }),
    );
    ground.toggle('treat as ground', state.ground ?? false, (on) =>
      this.edit(zone, id, 'zone', (target) => ((target as { ground?: boolean }).ground = on)),
    );

    this.builderOptions(zone, entry, record);
  }

  private creature(zone: string, entry: Entry, record: Record<string, unknown>): void {
    const id = entry.id as string;
    const held = record as { roam?: number; folk?: string };
    const section = this.panel.section('life');
    section.number('roam', held.roam ?? 0, { min: 0, max: 20, step: 0.1, suffix: 'm' }, (value) =>
      this.edit(zone, id, 'zone', (target) => ((target as { roam?: number }).roam = value)),
    );
    section.select('folk', held.folk ?? '', ['', 'country', 'city'], (value) =>
      this.edit(zone, id, 'zone', (target) => {
        const named = target as { folk?: string };
        if (value) named.folk = value;
        else delete named.folk;
      }),
    );
  }

  private builderOptions(zone: string, entry: Entry, record: Record<string, unknown>): void {
    const builder = builderByName(record.builder as string);
    if (!builder?.options) return;
    const held = { ...((record.options as Record<string, unknown>) ?? {}) };
    const section = this.panel.section(`${builder.name} options`);
    for (const [key, field] of Object.entries(builder.options)) {
      this.field(section, held, key, field, () =>
        this.edit(zone, entry.id as string, 'zone', (target) => {
          (target as { options?: Record<string, unknown> }).options = { ...held };
        }),
      );
    }
  }

  private fields(
    section: Section,
    zone: string,
    entry: Entry,
    schema: Record<string, Field>,
    record: Record<string, unknown>,
  ): void {
    const held = { ...record };
    for (const [key, field] of Object.entries(schema)) {
      this.field(section, held, key, field, () =>
        this.edit(zone, entry.id as string, 'zone', (target) => {
          (target as Record<string, unknown>)[key] = held[key];
        }),
      );
    }
  }

  private field(
    section: Section,
    held: Record<string, unknown>,
    key: string,
    field: Field,
    write: () => void,
  ): void {
    const label = field.label ?? key;
    switch (field.type) {
      case 'number':
        section.number(label, (held[key] as number) ?? field.min ?? 0, field, (value) => {
          held[key] = value;
          write();
        });
        return;
      case 'int':
        section.number(
          label,
          (held[key] as number) ?? field.min ?? 0,
          { ...field, step: 1, scrub: 0.2 },
          (value) => {
            held[key] = Math.round(value);
            write();
          },
        );
        return;
      case 'boolean':
        section.toggle(label, (held[key] as boolean) ?? false, (on) => {
          held[key] = on;
          write();
        });
        return;
      case 'choice': {
        const options = typeof field.options === 'function' ? field.options() : field.options;
        section.select(label, (held[key] as string) ?? '', ['', ...options], (value) => {
          held[key] = value;
          write();
        });
        return;
      }
      case 'ref':
        section.ref(
          label,
          (held[key] as string) ?? '',
          this.ids(),
          (value) => {
            held[key] = value;
            write();
          },
          (accept) => this.hooks.pick(accept),
        );
        return;
      case 'string':
      case 'color':
        section.text(label, (held[key] as string) ?? '', (value) => {
          held[key] = value;
          write();
        });
        return;
      default:
        return;
    }
  }
}
