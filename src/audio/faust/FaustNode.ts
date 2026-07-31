/**
 * Loading compiled Faust modules into the graph.
 *
 * `.dsp` sources are compiled to `.wasm` at build time by `tools/faust-build.ts`
 * and the artifacts are committed, so a production build never needs the Faust
 * toolchain and Pages deploys reproducibly. This is the runtime half: fetch the
 * bytes, hand them to a worklet, and expose the parameters.
 *
 * **Nothing here is load-bearing.** Every caller must have something to fall
 * back on — the reverb keeps the generated-impulse-response path — because a
 * wasm fetch can fail and a missing room is a worse outcome than a simpler one.
 * `create` resolves to `null` rather than throwing for exactly that reason.
 */

import processorUrl from './processor.js?url';

/** Trimmed at build time out of Faust's much larger `dsp-meta.json`. */
export interface FaustMeta {
  name: string;
  inputs: number;
  outputs: number;
  /** DSP struct size in bytes. The audio buffers are laid out after it. */
  size: number;
  /** Control label → byte offset into the DSP struct. */
  params: Record<string, number>;
}

export interface FaustNode {
  readonly node: AudioWorkletNode;
  /** Controls are messaged, not automated. See the note in `processor.js`. */
  set(key: string, value: number): void;
  dispose(): void;
}

/**
 * Registered worklet modules, per context.
 *
 * `addModule` is idempotent but not free, and it is asynchronous — calling it
 * concurrently for several models would race. Caching the promise means the
 * second caller awaits the first one's registration rather than starting
 * another.
 */
const registered = new WeakMap<BaseAudioContext, Promise<void>>();

function register(context: BaseAudioContext): Promise<void> {
  let pending = registered.get(context);
  if (!pending) {
    pending = (context as AudioContext).audioWorklet.addModule(processorUrl);
    registered.set(context, pending);
  }
  return pending;
}

/** Fetched once per URL and shared — several emitters may want the same model. */
const modules = new Map<string, Promise<{ wasm: ArrayBuffer; meta: FaustMeta } | null>>();

async function load(
  wasmUrl: string,
  meta: FaustMeta,
): Promise<{ wasm: ArrayBuffer; meta: FaustMeta } | null> {
  let pending = modules.get(wasmUrl);
  if (!pending) {
    pending = fetch(wasmUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.arrayBuffer();
      })
      .then((wasm) => ({ wasm, meta }))
      .catch((error: unknown) => {
        console.warn(`faust: could not load ${wasmUrl} — falling back`, error);
        return null;
      });
    modules.set(wasmUrl, pending);
  }
  return pending;
}

/**
 * Builds a node from a compiled module, or resolves `null` if it cannot.
 *
 * The bytes are fetched here on the main thread and transferred into the
 * worklet, because an `AudioWorkletGlobalScope` has no `fetch`. That also
 * means `WebAssembly.instantiate` never sees a `Response`, so the MIME type
 * the host serves `.wasm` with is irrelevant — which is one fewer thing that
 * can differ between the dev server and Pages.
 */
export async function createFaustNode(
  context: BaseAudioContext,
  wasmUrl: string,
  meta: FaustMeta,
): Promise<FaustNode | null> {
  try {
    const [loaded] = await Promise.all([load(wasmUrl, meta), register(context)]);
    if (!loaded) return null;

    const node = new AudioWorkletNode(context, 'faust-processor', {
      numberOfInputs: meta.inputs > 0 ? 1 : 0,
      numberOfOutputs: 1,
      outputChannelCount: [Math.max(meta.outputs, 1)],
      processorOptions: {
        // Transferred rather than copied would detach the buffer and break the
        // cache for the next caller, so this is deliberately a structured
        // clone. A few tens of kilobytes, once per model.
        wasm: loaded.wasm,
        meta: loaded.meta,
      },
    });

    return {
      node,
      set(key, value) {
        node.port.postMessage({ type: 'param', key, value });
      },
      dispose() {
        node.port.onmessage = null;
        node.disconnect();
      },
    };
  } catch (error) {
    console.warn('faust: worklet unavailable — falling back', error);
    return null;
  }
}
