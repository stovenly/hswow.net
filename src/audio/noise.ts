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

import { pool } from '../engine/work/pool';

export type NoiseColour = 'white' | 'pink' | 'brown';

export type NoiseBuffers = Record<NoiseColour, AudioBuffer>;

/**
 * White, pink and brown noise, filled on the pool. The three differ by spectral
 * slope: white is flat, pink falls at 3 dB per octave, brown at 6, which is also
 * roughly an ordering of scale — hiss and detail, the middle of things, weight
 * and distance — which is why the wind model wants all three at once.
 */
export async function createNoiseBuffers(context: BaseAudioContext): Promise<NoiseBuffers> {
  const tables = await pool.run('noise-tables', { sampleRate: context.sampleRate });
  const wrap = (data: Float32Array<ArrayBuffer>): AudioBuffer => {
    const buffer = context.createBuffer(1, data.length, context.sampleRate);
    buffer.copyToChannel(data, 0);
    return buffer;
  };
  return { white: wrap(tables.white), pink: wrap(tables.pink), brown: wrap(tables.brown) };
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
