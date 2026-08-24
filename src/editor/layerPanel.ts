import GUI from 'lil-gui';
import type { Condition, Entry } from '../world/entry';
import type { ZoneDocument } from '../world/document';
import { worldState, type StatePreview } from '../world/state';
import type { Session } from './session';

/** A layer being edited: the document's own lists are read-only until written back. */
interface MutableLayer {
  name: string;
  when?: Condition;
  entries: Entry[];
}

/**
 * Layers, their conditions, and the world state they are judged against.
 *
 * The convention: the moment two entries share a condition it is a layer. Hide
 * and isolate are inspection state and are never saved; the preview dropdown
 * forces every `when` to a result so a layer can be looked at without inventing
 * a quest to reach it.
 */

export interface LayerPanelHooks {
  /** After anything that needs the zone raised again. */
  changed(): void;
  /** Ids of the entries currently selected, for moving them between layers. */
  selected(): readonly string[];
  /** Hides a layer's entries without touching the document. */
  setLayerVisible(zone: string, layer: string, visible: boolean): void;
}

export class LayerPanel {
  private readonly root: GUI;
  private readonly session: Session;
  private readonly hooks: LayerPanelHooks;
  private folder: GUI | null = null;
  private shown: string | null = null;

  constructor(root: GUI, session: Session, hooks: LayerPanelHooks) {
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

    const folder = this.root.addFolder('layers').close();
    this.folder = folder;
    this.state(folder);
    this.list(folder, doc);
  }

  refresh(): void {
    const shown = this.shown;
    this.shown = null;
    this.show(shown);
  }

  /** The stub every `when` is evaluated against. */
  private state(folder: GUI): void {
    const group = folder.addFolder('world state · session only');
    const preview = { mode: worldState.preview as StatePreview };
    group
      .add(preview, 'mode', ['live', 'all', 'none'])
      .name('force every when to')
      .onChange((mode: StatePreview) => {
        worldState.preview = mode;
        this.hooks.changed();
      });

    const raise = { flag: '' };
    group.add(raise, 'flag').name('flag');
    group
      .add(
        {
          on: () => {
            if (!raise.flag) return;
            worldState.setFlag(raise.flag, true);
            this.hooks.changed();
            this.refresh();
          },
        },
        'on',
      )
      .name('raise it');

    for (const flag of worldState.flags) {
      group
        .add(
          {
            drop: () => {
              worldState.setFlag(flag, false);
              this.hooks.changed();
              this.refresh();
            },
          },
          'drop',
        )
        .name(`drop ${flag}`);
    }

    const quest = { name: '', stage: 0 };
    group.add(quest, 'name').name('quest');
    group
      .add(quest, 'stage', 0, 50, 1)
      .onChange(() => {
        if (!quest.name) return;
        worldState.setStage(quest.name, quest.stage);
        this.hooks.changed();
      });
  }

  private layersOf(doc: ZoneDocument): MutableLayer[] {
    if (doc.layers) return doc.layers.map((layer) => ({ ...layer, entries: [...layer.entries] }));
    return [{ name: 'main', entries: [...(doc.entries ?? [])] }];
  }

  private write(doc: ZoneDocument, layers: MutableLayer[]): void {
    this.session.commit(doc.id, 'zone', (target) => {
      // One layer with no condition is the plain form, and a document that has
      // nothing conditional in it should not carry the machinery for it.
      if (layers.length === 1 && !layers[0].when) {
        target.entries = layers[0].entries;
        delete target.layers;
        return;
      }
      target.layers = layers;
      delete target.entries;
    });
    this.hooks.changed();
  }

  private list(folder: GUI, doc: ZoneDocument): void {
    const layers = this.layersOf(doc);

    const added = { name: '' };
    folder.add(added, 'name').name('new layer');
    folder
      .add(
        {
          add: () => {
            if (!added.name) return;
            layers.push({ name: added.name, entries: [] });
            this.write(doc, layers);
            this.refresh();
          },
        },
        'add',
      )
      .name('add it');

    layers.forEach((layer, index) => {
      const row = folder.addFolder(`${layer.name} · ${layer.entries.length}`).close();
      const shown = { visible: true };
      row
        .add(shown, 'visible')
        .name('shown · session only')
        .onChange(() => this.hooks.setLayerVisible(doc.id, layer.name, shown.visible));

      const named = { name: layer.name };
      row.add(named, 'name').onChange(() => {
        layer.name = named.name;
        this.write(doc, layers);
      });

      this.condition(row, layer, () => this.write(doc, layers));

      row
        .add(
          {
            move: () => {
              const wanted = new Set(this.hooks.selected());
              if (wanted.size === 0) return;
              const moved: Entry[] = [];
              for (const held of layers) {
                for (let i = held.entries.length - 1; i >= 0; i--) {
                  if (!wanted.has(held.entries[i].id ?? '')) continue;
                  moved.push(...held.entries.splice(i, 1));
                }
              }
              layer.entries.push(...moved.reverse());
              this.write(doc, layers);
              this.refresh();
            },
          },
          'move',
        )
        .name('move the selection here');

      if (layers.length > 1) {
        row
          .add(
            {
              remove: () => {
                // Its entries go with it: a layer is what a set of entries share,
                // and orphaning them into another layer changes what they mean.
                layers.splice(index, 1);
                this.write(doc, layers);
                this.refresh();
              },
            },
            'remove',
          )
          .name('delete the layer and its entries');
      }
    });
  }

  /** One `when`, in the three forms that exist so far. */
  private condition(folder: GUI, layer: MutableLayer, write: () => void): void {
    const held = layer.when as { flag?: string; quest?: string; stage?: { min?: number } } | undefined;
    const state = {
      kind: held?.flag ? 'flag' : held?.quest ? 'quest' : 'always',
      flag: held?.flag ?? '',
      quest: held?.quest ?? '',
      atLeast: held?.stage?.min ?? 0,
      not: !!(layer.when && 'not' in layer.when),
    };
    const apply = (): void => {
      let condition: Condition | undefined;
      if (state.kind === 'flag' && state.flag) condition = { flag: state.flag };
      else if (state.kind === 'quest' && state.quest) {
        condition = { quest: state.quest, stage: { min: state.atLeast } };
      }
      if (condition && state.not) condition = { not: condition };
      if (condition) layer.when = condition;
      else delete layer.when;
      write();
    };
    folder.add(state, 'kind', ['always', 'flag', 'quest']).name('shown when').onChange(apply);
    folder.add(state, 'flag').onChange(apply);
    folder.add(state, 'quest').onChange(apply);
    folder.add(state, 'atLeast', 0, 50, 1).name('stage at least').onChange(apply);
    folder.add(state, 'not').name('invert it').onChange(apply);
  }
}
