/**
 * The noise substrate. Every sound in this game is noise pushed through
 * filters, so the noise itself is generated once at boot into a few
 * `AudioBuffer`s and looped. A worklet generating samples per emitter does not
 * scale past a handful of voices and buys nothing: the character is in the
 * filtering, and `BiquadFilterNode` is native code a worklet cannot match.
 *
 * Voices start at random offsets and run at slightly different rates, or the
 * shared buffer betrays itself as a repeating hiss. See `playNoise`.
 */

/** Long enough that a loop is not audible as a loop, short enough to be cheap. */
const SECONDS = 6;

export type NoiseColour = 'white' | 'pink' | 'brown';

export type NoiseBuffers = Record<NoiseColour, AudioBuffer>;

/**
 * Builds white, pink and brown noise. The three differ by spectral slope:
 * white is flat, pink falls at 3 dB per octave, brown at 6. That is also
 * roughly an ordering of scale — hiss and detail, the middle of things, weight
 * and distance — which is why the wind model wants all three at once.
 */
export function createNoiseBuffers(context: BaseAudioContext): NoiseBuffers {
  const length = Math.floor(context.sampleRate * SECONDS);
  return {
    white: fill(context, length, whiteGenerator()),
    pink: fill(context, length, pinkGenerator()),
    brown: fill(context, length, brownGenerator()),
  };
}

function fill(context: BaseAudioContext, length: number, next: () => number): AudioBuffer {
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = next();

  // Cross-fade the tail into the head so the loop point is not a click. A
  // discontinuity in noise is still a discontinuity, and it is audible.
  const fade = Math.min(2048, (length / 4) | 0);
  for (let i = 0; i < fade; i++) {
    const t = i / fade;
    data[i] = data[i] * t + data[length - fade + i] * (1 - t);
  }

  normalise(data);
  return buffer;
}

/** Scales to just under full range: filtering later can only reduce level. */
function normalise(data: Float32Array): void {
  let peak = 0;
  for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]));
  if (peak === 0) return;
  const scale = 0.95 / peak;
  for (let i = 0; i < data.length; i++) data[i] *= scale;
}

function whiteGenerator(): () => number {
  return () => Math.random() * 2 - 1;
}

/**
 * Pink noise by Paul Kellett's filter: one-pole filters at spaced corner
 * frequencies, summed. Accurate to about ±0.05 dB across the audible band.
 */
function pinkGenerator(): () => number {
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;

  return () => {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    return pink * 0.11;
  };
}

/**
 * Brown noise: integrated white, leaked so it cannot wander off to a DC offset
 * and silently eat all the headroom.
 */
function brownGenerator(): () => number {
  let last = 0;
  return () => {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    return last * 3.5;
  };
}

export interface NoiseVoice {
  source: AudioBufferSourceNode;
  stop(when?: number): void;
}

/**
 * Starts a looping noise source. The random start offset and small rate detune
 * stop several voices from the same buffer phasing into one another — without
 * them, two emitters running the same noise sound like one that got louder.
 */
export function playNoise(
  context: BaseAudioContext,
  buffer: AudioBuffer,
  destination: AudioNode,
  detune = 0.06,
): NoiseVoice {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.playbackRate.value = 1 + (Math.random() * 2 - 1) * detune;
  source.connect(destination);
  source.start(0, Math.random() * buffer.duration);

  return {
    source,
    stop(when = 0) {
      try {
        source.stop(when);
      } catch {
        // Already stopped. Web Audio throws rather than shrugging.
      }
    },
  };
}
