/**
 * The worklet half of the Faust bridge.
 *
 * Plain JavaScript, not TypeScript, and deliberately dependency-free: this file
 * is loaded verbatim by `AudioWorklet.addModule` into a global scope that has no
 * `window`, no `fetch`, no DOM and no module resolution. Anything it needs has
 * to arrive either in the file itself or through `processorOptions`.
 *
 * It runs on the audio thread, which is a hard real-time context. Nothing here
 * may allocate, and nothing here may throw once running — a single exception
 * kills the processor and the node goes permanently silent.
 *
 * Parameters arrive one of two ways: a message per change, or — when the page
 * is isolated — a shared ring the main thread writes and `process` drains at
 * the top of every quantum. See `FaustNode.ts`.
 *
 * ## Why this is hand-written
 *
 * `@grame/faustwasm` ships a runtime that does this, and it is ~195 KB of
 * shipped bundle for a surface we use a fraction of. The compiled module's ABI
 * turned out to be five imported math functions and a dozen exports, and its
 * memory layout is four offsets — small enough that owning it costs less than
 * integrating around someone else's abstraction. So the Faust *compiler* stays
 * a build-time dependency and none of it reaches the browser.
 *
 * ## Memory layout
 *
 * The compiled module exports its own linear memory, laid out by the Faust wasm
 * backend as:
 *
 * ```
 *  0                                        DSP struct        (meta.size bytes)
 *  size                                     input pointers    (numIn  × 4)
 *  size + numIn×4                           output pointers   (numOut × 4)
 *  size + (numIn+numOut)×4                  input samples     (numIn  × 128 × 4)
 *  … + numIn×128×4                          output samples    (numOut × 128 × 4)
 * ```
 *
 * The pointer tables hold byte offsets of the sample buffers; `compute` is
 * handed the addresses of the two tables, not of the buffers.
 */

/** Web Audio's render quantum. Fixed by the spec, not a preference. */
const QUANTUM = 128;
/** Quanta of silence in and out before a sleeping model lets itself be collected. About three seconds. */
const SETTLE = 1100;
/** Below this the output counts as silent. */
const HUSH = 1e-5;
/** Byte size of an f32. Faust is built single-precision here. */
const SAMPLE = 4;

/**
 * Faust's generated code calls out to libm.
 *
 * The single-precision names are what a default build imports; the
 * double-precision ones are listed too so that a `-double` module does not
 * fail to instantiate with a mystifying LinkError. Supplying a name the module
 * does not import is free.
 */
function mathImports() {
  const single = {
    _acosf: Math.acos, _asinf: Math.asin, _atanf: Math.atan, _atan2f: Math.atan2,
    _ceilf: Math.ceil, _cosf: Math.cos, _expf: Math.exp, _floorf: Math.floor,
    _logf: Math.log, _log10f: Math.log10, _powf: Math.pow, _roundf: Math.round,
    _sinf: Math.sin, _sqrtf: Math.sqrt, _tanf: Math.tan,
    _acoshf: Math.acosh, _asinhf: Math.asinh, _atanhf: Math.atanh,
    _coshf: Math.cosh, _sinhf: Math.sinh, _tanhf: Math.tanh,
    _exp10f: (x) => Math.pow(10, x),
    _fmodf: (x, y) => x % y,
    _remainderf: (x, y) => x - Math.round(x / y) * y,
  };
  const env = {};
  for (const name of Object.keys(single)) {
    env[name] = single[name];
    // `_cosf` → `_cos`, and so on for the double-precision build.
    env[name.slice(0, -1)] = single[name];
  }
  return { env };
}

class FaustProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const { wasm, meta, ring, sleeps } = options.processorOptions;
    // Whether silence past the settle window ends this processor. The node
    // side rebuilds one on the next write. Never for a reverb.
    this.sleeps = sleeps === true;
    this.quiet = 0;

    // Compiled on the main thread and cloned in as a Module; the bytes are the
    // fallback for a browser that cannot clone one.
    const module = options.processorOptions.module ?? new WebAssembly.Module(wasm);
    this.instance = new WebAssembly.Instance(module, mathImports());
    this.api = this.instance.exports;

    this.numIn = meta.inputs;
    this.numOut = meta.outputs;
    this.params = meta.params; // label → { at, min, max, ... }; only `at` is used here

    const size = meta.size;
    this.ptrIn = size;
    this.ptrOut = size + this.numIn * SAMPLE;
    const firstIn = this.ptrOut + this.numOut * SAMPLE;
    const firstOut = firstIn + this.numIn * QUANTUM * SAMPLE;
    const end = firstOut + this.numOut * QUANTUM * SAMPLE;

    // The module sizes its own memory from the DSP struct, which does not
    // account for the buffers we are about to append. Usually there is slack
    // in the last page; when there is not, this is the difference between
    // working and writing over the reverb's delay lines.
    const memory = this.api.memory;
    if (memory.buffer.byteLength < end) {
      memory.grow(Math.ceil((end - memory.buffer.byteLength) / 65536));
    }

    const heap32 = new Int32Array(memory.buffer);
    for (let c = 0; c < this.numIn; c++) {
      heap32[(this.ptrIn >> 2) + c] = firstIn + c * QUANTUM * SAMPLE;
    }
    for (let c = 0; c < this.numOut; c++) {
      heap32[(this.ptrOut >> 2) + c] = firstOut + c * QUANTUM * SAMPLE;
    }

    // Views onto the sample buffers, taken once. `memory.grow` invalidates
    // them, so nothing may grow the memory after this point.
    const heapF = new Float32Array(memory.buffer);
    this.ins = [];
    this.outs = [];
    for (let c = 0; c < this.numIn; c++) {
      const at = (firstIn + c * QUANTUM * SAMPLE) >> 2;
      this.ins.push(heapF.subarray(at, at + QUANTUM));
    }
    for (let c = 0; c < this.numOut; c++) {
      const at = (firstOut + c * QUANTUM * SAMPLE) >> 2;
      this.outs.push(heapF.subarray(at, at + QUANTUM));
    }

    this.api.init(0, sampleRate);

    // The controls in declared order, which is the ring's order too.
    this.controls = Object.values(this.params);
    // The shared ring: a value per control and a dirty flag beside it.
    this.ringValues = ring ? ring.values : null;
    this.ringDirty = ring ? ring.dirty : null;

    // Parameters arrive as messages rather than as `AudioParam`s. Faust's
    // controls are not sample-accurate and do not need to be — they are room
    // sizes and damping factors, not envelopes — and a k-rate write per
    // control per quantum would cost more than the DSP.
    this.port.onmessage = (event) => {
      const { type, key, value } = event.data;
      if (type === 'param') this.write(this.params[key], value);
    };

    this.alive = true;
  }

  /**
   * Clamped here rather than trusted. A control driven outside its declared
   * range is not merely wrong — for anything inside a feedback loop it is the
   * difference between a model and a runaway, and this is the last place
   * before it reaches the DSP.
   */
  write(control, value) {
    if (control === undefined) return;
    const clamped = Math.min(control.max, Math.max(control.min, value));
    this.api.setParamValue(0, control.at, clamped);
  }

  /** Takes every control the main thread has written since the last quantum. */
  drain() {
    const dirty = this.ringDirty;
    const values = this.ringValues;
    for (let i = 0; i < this.controls.length; i++) {
      if (Atomics.exchange(dirty, i, 0) !== 0) this.write(this.controls[i], values[i]);
    }
  }

  process(inputs, outputs) {
    if (!this.alive) return false;
    if (this.ringDirty) this.drain();

    const input = inputs[0];
    let fed = false;
    for (let c = 0; c < this.numIn; c++) {
      const channel = input && input[c];
      // A disconnected input arrives as an empty array, not as silence.
      if (channel) {
        this.ins[c].set(channel);
        if (this.sleeps && !fed) fed = peak(channel) > HUSH;
      } else this.ins[c].fill(0);
    }

    this.api.compute(0, QUANTUM, this.ptrIn, this.ptrOut);

    const output = outputs[0];
    for (let c = 0; c < output.length; c++) {
      // A mono module feeding a stereo node repeats its last channel rather
      // than leaving one side silent.
      output[c].set(this.outs[Math.min(c, this.numOut - 1)]);
    }

    if (this.sleeps) {
      if (fed || peak(this.outs[0]) > HUSH) this.quiet = 0;
      else if (++this.quiet > SETTLE) {
        this.alive = false;
        this.port.postMessage({ type: 'asleep' });
        return false;
      }
    }
    // A reverb never returns false: it has a tail, and a processor that stops
    // when its input goes quiet cuts that tail off.
    return true;
  }
}

function peak(samples) {
  let most = 0;
  for (let i = 0; i < samples.length; i++) {
    const v = samples[i] < 0 ? -samples[i] : samples[i];
    if (v > most) most = v;
  }
  return most;
}

registerProcessor('faust-processor', FaustProcessor);
