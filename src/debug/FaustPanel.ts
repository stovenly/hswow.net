import type GUI from 'lil-gui';
import type { FaustNode } from '../audio/faust/FaustNode';

/**
 * A tuning panel built from a compiled module's own declaration.
 *
 * Every control in a `.dsp` states its range, its step and its default, and
 * `tools/faust-build.ts` carries all three through to the runtime. So a panel
 * does not have to be written: it can be read off the module, and it is
 * correct by construction for a module nobody has written yet.
 *
 * **This exists because `friction` shipped with seven controls and no panel.**
 * It was tuned by instantiating the compiled wasm in Node and printing
 * octave-band tables — which found two structural faults, and is an absurd way
 * to answer "is this a little too bright". Hand-writing a slider per control is
 * the obvious alternative, and it means the bounds are typed twice: once in the
 * `.dsp` and once in the panel, in agreement exactly until someone widens one.
 *
 * ## Two things that make this harder than it looks
 *
 * **The node arrives late.** A Faust model fetches its wasm, so the thing to
 * build a panel from does not exist when the panel is built. Hence `attach`
 * takes a *lookup* rather than a node, and builds the folder the first time
 * one turns up.
 *
 * **The model is also driving these.** A friction source rewrites `speed`
 * every frame from its motion cycle; a zone change rewrites the reverb's
 * decay. So the sliders are `listen()`ed against a mirror that `sync` refreshes
 * from the node, which means a driven control shows what the model is actually
 * doing rather than the last value someone dragged it to. Dragging one still
 * works — it just gets overwritten on the next frame, and that is the model
 * working rather than the panel failing.
 */

/** Controls a model rewrites per frame. Labelled, so the springback is expected. */
const DRIVEN = new Set(['speed']);

export interface FaustPanel {
  /** Call once a frame. Builds the folder when the node appears, then mirrors it. */
  sync(): void;
  dispose(): void;
}

/**
 * Adds a folder of sliders for whatever module `lookup` eventually returns.
 *
 * @param label Folder name. Usually the emitter's declared `id`.
 * @param lookup Re-run every sync — the node can appear, and can go away again
 *   when a zone is disposed, so this must not be captured once.
 */
export function attachFaustPanel(gui: GUI, label: string, lookup: () => FaustNode | null): FaustPanel {
  let folder: GUI | null = null;
  let built: FaustNode | null = null;
  // lil-gui binds to an object's properties, so the values need to live
  // somewhere. This is the mirror the sliders listen to.
  const state: Record<string, number> = {};

  function build(node: FaustNode): void {
    // Sorted, because Faust emits controls in declaration order — a `.dsp` is
    // written in the order the signal flows, which is not the order anyone
    // wants to read. Alphabetical is arbitrary and at least stable.
    const names = Object.keys(node.meta.params).sort();
    for (const name of names) state[name] = node.get(name);

    const next = gui.addFolder(label).close();
    for (const name of names) {
      const control = node.meta.params[name];
      next
        .add(state, name, control.min, control.max, control.step)
        .name(DRIVEN.has(name) ? `${name} (driven)` : name)
        .onChange((value: number) => node.set(name, value))
        .listen();
    }
    folder = next;
    built = node;
  }

  return {
    sync() {
      const node = lookup();
      if (node === null) {
        // The model went away with its zone. Drop the folder rather than
        // leaving sliders wired to a disposed worklet.
        folder?.destroy();
        folder = null;
        built = null;
        return;
      }
      if (node !== built) {
        folder?.destroy();
        build(node);
        return;
      }
      for (const name of Object.keys(node.meta.params)) state[name] = node.get(name);
    },

    dispose() {
      folder?.destroy();
      folder = null;
      built = null;
    },
  };
}
