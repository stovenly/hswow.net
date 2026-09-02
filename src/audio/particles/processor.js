/**
 * The particle worklet: grains, strikes and bubbles rendered from a queue of
 * records, one processor per bed. Plain JavaScript, loaded verbatim by
 * `AudioWorklet.addModule`; nothing here may allocate once running.
 *
 * A record is ten floats — see `RECORD` in `Particles.ts`, which is the other
 * side of this contract. Records arrive either as batches on the port or,
 * when the page is isolated, through a shared ring drained at the top of
 * every quantum. Each writes into one of the node's outputs, which the bed
 * has connected to its own filter for that channel.
 */

const STRIDE = 10;
/** Records that can wait or play at once. Past this a new one is dropped. */
const CAPACITY = 4096;
/** Quanta with nothing to play before the processor lets itself be collected. About five seconds. */
const IDLE = 1900;

const GRAIN = 0;
const STRIKE = 1;
const BUBBLE = 2;

class ParticleProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const { noise, ring } = options.processorOptions;
    this.noise = noise;
    this.ring = ring ? ring.data : null;
    this.ringHead = ring ? ring.head : null;
    this.ringCapacity = ring ? ring.data.length / STRIDE : 0;

    // Pending and active records, in one fixed store.
    this.records = new Float32Array(CAPACITY * STRIDE);
    // Per record: 0 free, 1 pending, 2 playing.
    this.state = new Uint8Array(CAPACITY);
    /** Sample index the record starts at, and how far it has played. */
    this.startAt = new Float64Array(CAPACITY);
    this.played = new Int32Array(CAPACITY);
    /** Noise read position, in samples, fractional. */
    this.position = new Float64Array(CAPACITY);
    /** Bubble phase, radians. */
    this.phase = new Float64Array(CAPACITY);
    this.count = 0;
    this.cursor = 0;
    this.idle = 0;

    this.port.onmessage = (event) => {
      const batch = event.data.records;
      if (!batch) return;
      for (let at = 0; at + STRIDE <= batch.length; at += STRIDE) {
        if (!this.admit(batch, at)) return;
      }
    };
  }

  /** Files one record from `source` at float offset `at`. False when full. */
  admit(source, at) {
    let slot = -1;
    for (let i = 0; i < CAPACITY; i++) {
      const candidate = (this.cursor + i) % CAPACITY;
      if (this.state[candidate] === 0) {
        slot = candidate;
        break;
      }
    }
    if (slot < 0) return false;
    this.cursor = slot + 1;
    const base = slot * STRIDE;
    for (let k = 0; k < STRIDE; k++) this.records[base + k] = source[at + k];
    this.state[slot] = 1;
    this.startAt[slot] = Math.round(this.records[base + 1] * sampleRate);
    this.played[slot] = 0;
    this.position[slot] = this.records[base + 6] * sampleRate;
    this.phase[slot] = 0;
    this.count++;
    return true;
  }

  /** Takes everything the main thread has written to the ring since last time. */
  drain() {
    const head = this.ringHead;
    const write = Atomics.load(head, 0);
    let read = head[1];
    while (read !== write) {
      if (!this.admit(this.ring, (read % this.ringCapacity) * STRIDE)) break;
      read++;
    }
    Atomics.store(head, 1, read);
  }

  process(inputs, outputs) {
    if (this.ringHead) this.drain();
    if (this.count === 0) {
      // Gone after a long silence; the node side builds another on the next
      // record, over the same ring, so nothing written meanwhile is lost.
      if (++this.idle > IDLE) {
        this.port.postMessage({ type: 'asleep' });
        return false;
      }
      return true;
    }
    this.idle = 0;

    const blockStart = currentFrame;
    const blockEnd = blockStart + 128;
    const noise = this.noise;
    const noiseLength = noise.length;
    const records = this.records;

    for (let slot = 0; slot < CAPACITY; slot++) {
      const state = this.state[slot];
      if (state === 0) continue;
      const base = slot * STRIDE;
      const start = this.startAt[slot];
      if (state === 1) {
        if (start >= blockEnd) continue;
        // Late records start now, from where they would have been.
        if (start < blockStart) this.played[slot] = blockStart - start;
        this.state[slot] = 2;
      }

      const kind = records[base];
      const length = Math.round(records[base + 2] * sampleRate);
      const level = records[base + 3];
      const channel = records[base + 4] | 0;
      const out = outputs[channel] && outputs[channel][0];
      let played = this.played[slot];
      // The first sample of this block the record plays on.
      let from = start + played;
      if (from < blockStart) from = blockStart;
      const to = Math.min(blockEnd, start + length);

      if (out) {
        if (kind === BUBBLE) {
          const hz = records[base + 5];
          const rise = records[base + 6];
          const decay = records[base + 7];
          let phase = this.phase[slot];
          const fall = Math.log(0.001) / (decay * sampleRate);
          for (let s = from; s < to; s++) {
            const t = s - start;
            const f = hz * (1 + rise * Math.min(1, t / (decay * sampleRate)));
            phase += (2 * Math.PI * f) / sampleRate;
            out[s - blockStart] += Math.sin(phase) * level * Math.exp(fall * t);
          }
          this.phase[slot] = phase;
        } else {
          const rate = records[base + 5];
          let position = this.position[slot];
          if (kind === GRAIN) {
            for (let s = from; s < to; s++) {
              const t = (s - start) / length;
              const window = 0.5 * (1 - Math.cos(2 * Math.PI * t));
              out[s - blockStart] += noise[position | 0] * window * level;
              position += rate;
              if (position >= noiseLength) position -= noiseLength;
            }
          } else {
            const rise = Math.max(1, Math.round(records[base + 7] * sampleRate));
            const tau = records[base + 8] * sampleRate;
            for (let s = from; s < to; s++) {
              const t = s - start;
              const env = t < rise ? t / rise : Math.exp(-(t - rise) / tau);
              out[s - blockStart] += noise[position | 0] * env * level;
              position += rate;
              if (position >= noiseLength) position -= noiseLength;
            }
          }
          this.position[slot] = position;
        }
      }

      played = to - start;
      this.played[slot] = played;
      if (played >= length) {
        this.state[slot] = 0;
        this.count--;
      }
    }
    return true;
  }
}

registerProcessor('particle-processor', ParticleProcessor);
