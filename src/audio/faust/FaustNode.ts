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
import { platform } from '../../platform';

/**
 * One control, as the `.dsp` declared it.
 *
 * The range travels with the offset so a panel can be generated rather than
 * hand-written — see the note on `collect` in `tools/faust-build.ts`.
 */
export interface FaustControl {
  /** Byte offset into the DSP struct. All the worklet needs. */
  at: number;
  init: number;
  min: number;
  max: number;
  step: number;
}

/** Trimmed at build time out of Faust's much larger `dsp-meta.json`. */
export interface FaustMeta {
  name: string;
  inputs: number;
  outputs: number;
  /** DSP struct size in bytes. The audio buffers are laid out after it. */
  size: number;
  /** Control label → where it lives and what it accepts. */
  params: Record<string, FaustControl>;
}

export interface FaustNode {
  /**
   * The worklet. A sleeping node replaces this after a silence, so anything
   * that may sleep connects through `input` and `output`, which are stable.
   */
  readonly node: AudioWorkletNode;
  /** Present when the module takes input. */
  readonly input: GainNode | null;
  readonly output: GainNode;
  /** What this module declares, for generated panels. */
  readonly meta: FaustMeta;
  /** Controls are messaged, not automated. See the note in `processor.js`. */
  set(key: string, value: number): void;
  /**
   * The last value written, or the control's declared default.
   *
   * The DSP struct lives in the worklet's memory and is not readable from
   * here without a round trip, so this mirrors what has been sent. That is
   * enough for a panel to open showing what the model is actually doing
   * rather than resetting it to defaults on the first drag.
   */
  get(key: string): number;
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

interface Loaded {
  wasm: ArrayBuffer;
  /** Compiled once here, off the audio thread, and cloned into every node. */
  module: WebAssembly.Module | null;
  meta: FaustMeta;
}

/** Fetched and compiled once per URL and shared — several emitters may want the same model. */
const modules = new Map<string, Promise<Loaded | null>>();

async function load(wasmUrl: string, meta: FaustMeta): Promise<Loaded | null> {
  let pending = modules.get(wasmUrl);
  if (!pending) {
    pending = fetch(wasmUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.arrayBuffer();
      })
      .then(async (wasm) => ({ wasm, module: await WebAssembly.compile(wasm).catch(() => null), meta }))
      .catch((error: unknown) => {
        console.warn(`faust: could not load ${wasmUrl} — falling back`, error);
        return null;
      });
    modules.set(wasmUrl, pending);
  }
  return pending;
}

/**
 * The parameter ring, when the page is isolated: one float per control in
 * declared order, and a dirty flag beside each. The worklet drains it at the
 * top of every quantum, so a value written every frame costs no message.
 */
function ringFor(meta: FaustMeta): { values: Float32Array; dirty: Int32Array } | null {
  if (!platform.isolated) return null;
  const count = Object.keys(meta.params).length;
  return {
    values: new Float32Array(new SharedArrayBuffer(count * 4)),
    dirty: new Int32Array(new SharedArrayBuffer(count * 4)),
  };
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
  options: { sleeps?: boolean } = {},
): Promise<FaustNode | null> {
  try {
    const [loaded] = await Promise.all([load(wasmUrl, meta), register(context)]);
    if (!loaded) return null;

    const sleeps = options.sleeps === true;
    const input = meta.inputs > 0 ? context.createGain() : null;
    const output = context.createGain();

    // Mirrors what has been written, seeded from the declared defaults so a
    // panel opened before anything has been set still shows the truth — and
    // what a woken node is told, so it picks up where the last one slept.
    const values = new Map<string, number>();
    const slots = new Map<string, number>();
    Object.entries(meta.params).forEach(([key, control], i) => {
      values.set(key, control.init);
      slots.set(key, i);
    });

    let ring = ringFor(meta);
    let node: AudioWorkletNode | null = null;
    let disposed = false;

    const send = (key: string, value: number): void => {
      const slot = slots.get(key);
      if (ring && slot !== undefined) {
        ring.values[slot] = value;
        Atomics.store(ring.dirty, slot, 1);
      } else {
        node?.port.postMessage({ type: 'param', key, value });
      }
    };

    const build = (): AudioWorkletNode => {
      const made = new AudioWorkletNode(context, 'faust-processor', {
        numberOfInputs: meta.inputs > 0 ? 1 : 0,
        numberOfOutputs: 1,
        outputChannelCount: [Math.max(meta.outputs, 1)],
        processorOptions: {
          // A structured clone rather than a transfer, which would detach the
          // buffer and break the cache for the next caller. A few tens of
          // kilobytes, once per node, and only read where the Module is absent.
          wasm: loaded.wasm,
          module: loaded.module,
          meta: loaded.meta,
          ring,
          sleeps,
        },
      });
      input?.connect(made);
      made.connect(output);
      made.port.onmessage = (event: MessageEvent<{ type: string }>) => {
        if (event.data.type !== 'asleep' || node !== made) return;
        // Dead on the audio thread already; the next write builds a new one.
        made.port.onmessage = null;
        made.disconnect();
        input?.disconnect(made);
        node = null;
      };
      return made;
    };

    const wake = (): void => {
      if (node || disposed) return;
      // A fresh ring, so the new processor sees every value as new.
      ring = ringFor(meta);
      node = build();
      for (const [key, value] of values) send(key, value);
    };

    node = build();

    return {
      get node() {
        wake();
        return node as AudioWorkletNode;
      },
      input,
      output,
      meta,
      set(key, value) {
        if (values.get(key) === value && node) return;
        values.set(key, value);
        if (!node) {
          wake();
          return;
        }
        send(key, value);
      },
      get(key) {
        return values.get(key) ?? 0;
      },
      dispose() {
        disposed = true;
        if (node) {
          node.port.onmessage = null;
          node.disconnect();
        }
        node = null;
        input?.disconnect();
        output.disconnect();
      },
    };
  } catch (error) {
    console.warn('faust: worklet unavailable — falling back', error);
    return null;
  }
}
