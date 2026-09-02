/** The noise samples, with nothing of Web Audio in them: what the pool fills and the engine wraps. */

/** Long enough that a loop is not audible as a loop, short enough to be cheap. */
export const NOISE_SECONDS = 6;

export interface NoiseTables {
  white: Float32Array<ArrayBuffer>;
  pink: Float32Array<ArrayBuffer>;
  brown: Float32Array<ArrayBuffer>;
}

export function fillNoiseTables(sampleRate: number): NoiseTables {
  const length = Math.floor(sampleRate * NOISE_SECONDS);
  return {
    white: fill(length, whiteGenerator()),
    pink: fill(length, pinkGenerator()),
    brown: fill(length, brownGenerator()),
  };
}

function fill(length: number, next: () => number): Float32Array<ArrayBuffer> {
  const fade = Math.min(2048, (length / 4) | 0);
  // Generated `fade` samples longer than the table, and the overrun is what
  // the head is faded into: blending the last samples into the head instead
  // leaves the wrap discontinuous, and a step in noise is a click once a second.
  const source = new Float32Array(length + fade);
  for (let i = 0; i < source.length; i++) source[i] = next();

  const data = source.slice(0, length);
  for (let i = 0; i < fade; i++) {
    const t = i / fade;
    data[i] = source[i] * t + source[length + i] * (1 - t);
  }

  normalise(data);
  return data;
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

/** Brown noise: integrated white, leaked so it cannot wander off to a DC offset. */
function brownGenerator(): () => number {
  let last = 0;
  return () => {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    return last * 3.5;
  };
}

export interface RoomNoiseAsk {
  length: number;
  sampleRate: number;
  preDelay: number;
  rt60: number;
}

/** Two channels of independent noise under an exponential decay reaching −60 dB at rt60. */
export function fillRoomNoise({ length, sampleRate, preDelay, rt60 }: RoomNoiseAsk): Float32Array<ArrayBuffer>[] {
  const start = Math.floor(preDelay * sampleRate);
  const decay = Math.exp(-Math.log(1000) / (rt60 * sampleRate));
  const channels: Float32Array<ArrayBuffer>[] = [];
  for (let channel = 0; channel < 2; channel++) {
    const data = new Float32Array(length);
    let envelope = 1;
    for (let i = start; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * envelope;
      envelope *= decay;
    }
    channels.push(data);
  }
  return channels;
}
