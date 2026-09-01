import type { Panel, Section } from './ui';
import type { Family, Named } from './api';
import type { Session } from './session';
import type {
  Folk,
  PersonDocument,
  QuestDocument,
  Speech,
  TraitDocument,
  Topic,
} from '../world/people';

/**
 * People, traits and quests: who is in the world and what any of them can say.
 *
 * A condition is edited as JSON. There are a dozen cases in the union and a
 * form for all of them is a panel of its own; a field that refuses to commit
 * what it cannot parse is the honest version of the small one.
 */

const FAMILIES: readonly Family[] = ['people', 'traits', 'quests'];

export interface CastPanelHooks {
  /** The zone showing, so a changed body raises the right level. */
  zone(): string | null;
  /** A line for the status bar. */
  say(message: string): void;
}

export class CastPanel {
  private readonly panel: Panel;
  private readonly session: Session;
  private readonly hooks: CastPanelHooks;
  private family: Family = 'people';
  private chosen: Partial<Record<Family, string>> = {};

  constructor(panel: Panel, session: Session, hooks: CastPanelHooks) {
    this.panel = panel;
    this.session = session;
    this.hooks = hooks;
  }

  refresh(): void {
    this.panel.clear();
    const head = this.panel.loose();
    head.select('family', this.family, [...FAMILIES], (value) => {
      this.family = value as Family;
      this.refresh();
    });

    const family = this.family;
    const list = this.session.cast(family);
    const ids = list.map((doc) => doc.id);
    const id = this.chosen[family] ?? ids[0] ?? '';
    head.select(family, id, ['', ...ids], (value) => {
      this.chosen[family] = value;
      this.refresh();
    });
    head.actions(
      { label: 'new', onClick: () => this.create() },
      { label: 'rename', onClick: () => this.rename(id) },
      { label: 'delete', onClick: () => this.remove(id) },
    );

    const doc = id ? this.session.castDoc(family, id) : undefined;
    if (!doc) {
      this.panel.loose().note(`nothing in ${family} yet`);
      return;
    }
    if (family === 'people') this.person(doc as PersonDocument);
    if (family === 'traits') this.trait(doc as TraitDocument);
    if (family === 'quests') this.quest(doc as QuestDocument);
    this.speech(doc as Named & Speech);
  }

  private write(id: string, mutate: (doc: never) => void, body = false): void {
    this.session.commitCast(this.family, id, mutate, body ? (this.hooks.zone() ?? undefined) : undefined);
  }

  private create(): void {
    const id = window.prompt(`new ${this.family.slice(0, -1)} id`)?.trim();
    if (!id) return;
    if (this.session.castDoc(this.family, id)) return this.hooks.say(`"${id}" is taken`);
    const doc =
      this.family === 'people'
        ? ({ id, name: id } satisfies PersonDocument)
        : this.family === 'quests'
          ? ({ id, name: id } satisfies QuestDocument)
          : ({ id } satisfies TraitDocument);
    this.session.createCast(this.family, doc);
    this.chosen[this.family] = id;
    this.refresh();
  }

  private rename(id: string): void {
    if (!id) return;
    const to = window.prompt('rename to', id)?.trim();
    if (!to || to === id) return;
    void this.session.renameCast(this.family, id, to).then(() => {
      this.chosen[this.family] = to;
      this.refresh();
    });
  }

  private remove(id: string): void {
    if (!id || !window.confirm(`delete ${this.family}/${id}?`)) return;
    void this.session.removeCast(this.family, id).then(() => {
      delete this.chosen[this.family];
      this.refresh();
    });
  }

  private person(doc: PersonDocument): void {
    const who = this.panel.section('who');
    who.text('name', doc.name, (value) =>
      this.write(doc.id, (target: PersonDocument) => (target.name = value)),
    );
    const zones = this.session.zones.map((zone) => zone.id);
    who.select('home', doc.home ?? '', ['', ...zones], (value) =>
      this.write(doc.id, (target: PersonDocument) => set(target, 'home', value || undefined)),
    );
    this.strings(who, 'traits', doc.traits ?? [], (lines) =>
      this.write(doc.id, (target: PersonDocument) => set(target, 'traits', lines.length ? lines : undefined)),
    );

    // A body raises whichever zone is showing: a face is what you came to look at.
    const body = this.panel.section('body', false);
    const held = { ...(doc.body ?? {}) };
    const put = (): void =>
      this.write(
        doc.id,
        (target: PersonDocument) => set(target, 'body', Object.keys(held).length ? { ...held } : undefined),
        true,
      );
    body.text('builder', held.builder ?? '', (value) => {
      set(held, 'builder', value || undefined);
      put();
    });
    body.text('seed', held.seed === undefined ? '' : String(held.seed), (value) => {
      set(held, 'seed', value.trim() === '' ? undefined : Number(value));
      put();
    });
    body.select('folk', held.folk ?? '', ['', 'country', 'city'], (value) => {
      set(held, 'folk', (value || undefined) as Folk | undefined);
      put();
    });
    body.text('face', held.face ?? '', (value) => {
      set(held, 'face', value || undefined);
      put();
    });
    body.text('scale', held.scale === undefined ? '' : String(held.scale), (value) => {
      set(held, 'scale', value.trim() === '' ? undefined : Number(value));
      put();
    });
  }

  private trait(doc: TraitDocument): void {
    const what = this.panel.section('what');
    what.text('crosshair name', doc.name ?? '', (value) =>
      this.write(doc.id, (target: TraitDocument) => set(target, 'name', value || undefined)),
    );
  }

  private quest(doc: QuestDocument): void {
    const what = this.panel.section('quest');
    what.text('name', doc.name, (value) =>
      this.write(doc.id, (target: QuestDocument) => (target.name = value)),
    );
    what.text('priority', doc.priority === undefined ? '' : String(doc.priority), (value) =>
      this.write(doc.id, (target: QuestDocument) =>
        set(target, 'priority', value.trim() === '' ? undefined : Number(value)),
      ),
    );
    this.json(what, 'cast', doc.cast, (value) =>
      this.write(doc.id, (target: QuestDocument) => set(target, 'cast', value as QuestDocument['cast'])),
    );

    const stages = this.panel.section('stages', false);
    for (const [index, stage] of (doc.stages ?? []).entries()) {
      stages.readout(`stage ${index}`, String(stage.at));
      stages.text(`  log`, stage.log ?? '', (value) =>
        this.write(doc.id, (target: QuestDocument) => {
          const held = [...(target.stages ?? [])];
          held[index] = { ...held[index], log: value || undefined };
          target.stages = held;
        }),
      );
    }
    this.json(stages, 'stages (json)', doc.stages, (value) =>
      this.write(doc.id, (target: QuestDocument) => set(target, 'stages', value as QuestDocument['stages'])),
    );
  }

  /** Greetings, farewells and topics. The same three for every family. */
  private speech(doc: Named & Speech): void {
    const said = this.panel.section('says', false);
    this.strings(said, 'greeting', doc.greeting ?? [], (lines) =>
      this.write(doc.id, (target: Speech) => set(target, 'greeting', lines.length ? lines : undefined)),
    );
    this.strings(said, 'farewell', doc.farewell ?? [], (lines) =>
      this.write(doc.id, (target: Speech) => set(target, 'farewell', lines.length ? lines : undefined)),
    );

    const topics = doc.topics ?? [];
    for (const [index, topic] of topics.entries()) {
      const section = this.panel.section(`topic · ${topic.label || topic.key}`, false);
      const edit = (mutate: (held: Topic) => void): void =>
        this.write(doc.id, (target: Speech) => {
          const held = [...(target.topics ?? [])];
          const one = { ...held[index] };
          mutate(one);
          held[index] = one;
          target.topics = held;
        });
      section.text('key', topic.key, (value) => edit((one) => (one.key = value)));
      section.text('label', topic.label, (value) => edit((one) => (one.label = value)));
      section.text('priority', topic.priority === undefined ? '' : String(topic.priority), (value) =>
        edit((one) => set(one, 'priority', value.trim() === '' ? undefined : Number(value))),
      );
      this.json(section, 'when', topic.when, (value) =>
        edit((one) => set(one, 'when', value as Topic['when'])),
      );
      this.json(section, 'infos', topic.infos, (value) =>
        edit((one) => (one.infos = (value ?? []) as Topic['infos'])),
      );
      section.actions({
        label: 'remove topic',
        onClick: () =>
          this.write(doc.id, (target: Speech) => {
            target.topics = (target.topics ?? []).filter((_, at) => at !== index);
          }),
      });
    }

    this.panel.loose().actions({
      label: 'add topic',
      onClick: () => {
        this.write(doc.id, (target: Speech) => {
          target.topics = [...(target.topics ?? []), { key: 'topic', label: 'Topic', infos: [] }];
        });
        this.refresh();
      },
    });
  }

  /** A bank of lines: one field each, and a blank one at the end to add with. */
  private strings(
    section: Section,
    label: string,
    lines: readonly string[],
    onChange: (lines: string[]) => void,
  ): void {
    lines.forEach((line, index) => {
      section.text(index === 0 ? label : ' ', line, (value) => {
        const held = [...lines];
        if (value.trim() === '') held.splice(index, 1);
        else held[index] = value;
        onChange(held);
        this.refresh();
      });
    });
    section.text(lines.length === 0 ? label : ' ', '', (value) => {
      if (value.trim() === '') return;
      onChange([...lines, value]);
      this.refresh();
    });
  }

  /** A field holding a value as JSON. Bad JSON is said and not committed. */
  private json(
    section: Section,
    label: string,
    value: unknown,
    onChange: (parsed: unknown) => void,
  ): void {
    const input = section.text(label, value === undefined ? '' : JSON.stringify(value), (text) => {
      if (text.trim() === '') {
        input.classList.remove('is-bad');
        onChange(undefined);
        return;
      }
      try {
        const parsed: unknown = JSON.parse(text);
        input.classList.remove('is-bad');
        onChange(parsed);
      } catch (error) {
        input.classList.add('is-bad');
        this.hooks.say(`${label}: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
  }
}

/** Sets a field, or removes it: an absent field is not the same as its default. */
function set<T extends object, K extends keyof T>(target: T, key: K, value: T[K] | undefined): void {
  if (value === undefined) delete target[key];
  else target[key] = value;
}
