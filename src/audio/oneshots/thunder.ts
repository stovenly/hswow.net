import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { thump } from '../dsp/impact';

/**
 * A very large low event a long way off: thunder, or something heavy moving
 * under a building or inside a hill.
 *
 * Distance has already removed everything above a few hundred hertz, so what
 * arrives is a handful of low bursts — one per bend in the lightning channel,
 * or one for the whole slab — and then a tail that *rolls*: the same energy
 * arriving off every surface between, so the level throbs rather than fading
 * smoothly. The roll is the whole difference between thunder and a bass drum
 * with a long release.
 */

export type Rumble = 'sky' | 'earth';

interface Kind {
  bursts: readonly [number, number];
  /** Seconds between bursts. */
  spacing: readonly [number, number];
  attack: readonly [number, number];
  decay: readonly [number, number];
  /** Lowpass at the front of a burst and where it has fallen to by the tail, Hz. */
  top: number;
  bottom: number;
  /** Depth of the throb on the tail, 0..1. */
  roll: number;
  /** Seconds the tail goes on after the last burst. */
  tail: readonly [number, number];
  weight: number;
}

const KINDS: Record<Rumble, Kind> = {
  sky: {
    bursts: [2, 5],
    spacing: [0.25, 1.4],
    attack: [0.04, 0.18],
    decay: [0.6, 1.8],
    top: 420,
    bottom: 70,
    roll: 0.55,
    tail: [3, 7],
    weight: 0.6,
  },
  earth: {
    bursts: [1, 1],
    spacing: [0, 0],
    attack: [0.25, 0.6],
    decay: [1.2, 2.5],
    top: 140,
    bottom: 45,
    roll: 0.25,
    tail: [1.5, 3],
    weight: 0.9,
  },
};

export interface ThunderOptions {
  kind?: Rumble;
  gain?: number;
}

/** Level of each burst against the loudest. The second is usually the big one. */
const SHAPE = [0.7, 1, 0.6, 0.45, 0.3];

function between(range: readonly [number, number]): number {
  return range[0] + Math.random() * (range[1] - range[0]);
}

export function createThunder(engine: AudioEngine, options: ThunderOptions = {}): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('thunder built before the noise buffers were ready');

  const kind = KINDS[options.kind ?? 'sky'];

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // The throb. One slow modulator over the whole event, at a rate no two
  // events share, so the roll never reads as a tremolo setting.
  const roll = context.createGain();
  roll.gain.value = 1;
  roll.connect(output);

  const pending: AudioNode[] = [];
  let cleanup = 0;

  const burst = (
    at: number,
    level: number,
    attack: number,
    decay: number,
    from: number,
    to: number,
  ): number => {
    const source = context.createBufferSource();
    source.buffer = noise.brown;
    source.playbackRate.value = 0.75 + Math.random() * 0.5;

    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 0.7;
    filter.frequency.setValueAtTime(from, at);
    filter.frequency.exponentialRampToValueAtTime(to, at + attack + decay * 1.5);

    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(level, at + attack);
    envelope.gain.setTargetAtTime(0, at + attack, decay / 3);

    source.connect(filter).connect(envelope).connect(roll);
    const length = attack + decay * 2.5;
    source.start(at, Math.random() * Math.max(noise.brown.duration - length, 0));
    source.stop(at + length);
    pending.push(filter, envelope);
    return length;
  };

  return {
    output,

    fire(at, force) {
      const count = Math.round(between(kind.bursts));
      const lfo = context.createOscillator();
      lfo.frequency.value = 1.3 + Math.random() * 3.2;
      const depth = context.createGain();
      depth.gain.value = kind.roll * 0.5;
      roll.gain.setValueAtTime(1 - kind.roll * 0.5, at);
      lfo.connect(depth).connect(roll.gain);
      lfo.start(at);

      let cursor = at;
      let end = at;
      let loudest = at;
      let peak = 0;
      for (let i = 0; i < count; i++) {
        const level = force * SHAPE[Math.min(i, SHAPE.length - 1)] * (0.8 + Math.random() * 0.2);
        if (level > peak) {
          peak = level;
          loudest = cursor;
        }
        const length = burst(
          cursor,
          level,
          between(kind.attack),
          between(kind.decay),
          kind.top * (0.8 + Math.random() * 0.4),
          kind.bottom,
        );
        end = Math.max(end, cursor + length);
        cursor += between(kind.spacing);
      }

      // The tail: the same thing off everything between here and there.
      const tail = between(kind.tail);
      const tailAt = Math.max(at, cursor - 0.2);
      end = Math.max(end, tailAt + burst(tailAt, force * 0.35, 0.6, tail * 0.45, kind.bottom * 1.6, kind.bottom * 0.7));

      thump(context, output, loudest, force * kind.weight * 0.5, 60, 32, 0.5, 0.04);

      lfo.stop(end + 0.1);
      pending.push(depth);

      const busy = end - at;
      window.clearTimeout(cleanup);
      cleanup = window.setTimeout(
        () => {
          for (const node of pending) node.disconnect();
          pending.length = 0;
        },
        (busy + 0.5) * 1000,
      );
      return busy;
    },

    dispose() {
      window.clearTimeout(cleanup);
      for (const node of pending) node.disconnect();
      pending.length = 0;
      roll.disconnect();
      output.disconnect();
    },
  };
}
