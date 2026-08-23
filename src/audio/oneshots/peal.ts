import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { thump } from '../dsp/impact';

/**
 * A thunderclap, as a line source rather than a bang.
 *
 * A bolt is kilometres of channel and every part of it is a different distance
 * from the ear. That one fact produces the crack, the roll, the length and the
 * dullness: the nearest segment arrives first and sharpest, the rest arrive
 * over the difference in path length across the channel, and each is filtered
 * by the air it came through. Filtering a single bang gives none of it.
 *
 * Distinct from `thunder.ts`, which is the ambience cast's far-off rumble and
 * has no geometry behind it.
 */

/** Arrivals per peal, one per notional segment of channel. */
const ARRIVALS = 26;

/** Where the air has taken a segment's top off, in hertz per kilometre travelled. */
const ABSORB = 6;
const TOP_HZ = 1500;
const FLOOR_HZ = 55;

export interface PealOptions {
  gain?: number;
  /** Metres per second. The climate's temperature decides it. */
  speed?: number;
}

export interface PealShot {
  /** Kilometres to the near end of the channel. */
  range: number;
  /** Kilometres of channel the arrivals are spread over. */
  spread: number;
  /** How much of the peal is its first arrivals, 0..1. A rip against a roll. */
  crack: number;
  /** Metres per second. */
  speed: number;
  seed: number;
}

/** Set before `fire`, because `OneShot.fire` carries only a time and a force. */
export interface Peal extends OneShot {
  aim(shot: PealShot): void;
  /** −1 to 1. Updated per frame: a peal lasts ten seconds and the head turns. */
  setPan(pan: number): void;
  /** Through a wall the crack goes and the rumble stays. */
  setIndoors(indoors: boolean): void;
}

function hashed(seed: number, n: number): number {
  let x = Math.imul((seed + n * 2654435761) | 0, 0x27d4eb2d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  return (x >>> 0) / 4294967296;
}

export function createPeal(engine: AudioEngine, options: PealOptions = {}): Peal {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('thunder built before the noise buffers were ready');

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // Shallow, and shallower with distance: a near crack is placed, a distant
  // roll is everywhere. Too far for a panner — the default `maxDistance` is
  // 60 m and an HRTF emitter at four kilometres is a fiction.
  const panner = context.createStereoPanner();
  panner.connect(output);

  // The wall. Wide open outdoors, so it costs one biquad and changes nothing.
  const wall = context.createBiquadFilter();
  wall.type = 'lowpass';
  wall.frequency.value = 20000;
  wall.Q.value = 0.5;
  wall.connect(panner);

  let shot: PealShot = { range: 5, spread: 5, crack: 0.4, speed: 340, seed: 1 };
  const pending: AudioNode[] = [];
  let cleanup = 0;

  const arrival = (
    at: number,
    level: number,
    distance: number,
    length: number,
    seed: number,
  ): void => {
    const source = context.createBufferSource();
    source.buffer = noise.brown;
    source.playbackRate.value = 0.7 + hashed(seed, 1) * 0.6;

    // Air absorption, per arrival. Nobody decides that distant thunder is dull;
    // it comes out that way because this segment's own path is longer.
    const air = context.createBiquadFilter();
    air.type = 'lowpass';
    air.Q.value = 0.6;
    air.frequency.value = Math.max(FLOOR_HZ, TOP_HZ / (1 + distance * ABSORB));

    const envelope = context.createGain();
    const attack = 0.004 + hashed(seed, 2) * 0.03 + distance * 0.004;
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(level, at + attack);
    envelope.gain.setTargetAtTime(0, at + attack, length / 3);

    source.connect(air).connect(envelope).connect(wall);
    const busy = attack + length * 2.5;
    source.start(at, hashed(seed, 3) * Math.max(noise.brown.duration - busy, 0));
    source.stop(at + busy);
    pending.push(air, envelope);
  };

  return {
    output,

    aim(next) {
      shot = next;
    },

    setPan(pan) {
      panner.pan.setTargetAtTime(Math.max(-1, Math.min(pan, 1)), context.currentTime, 0.08);
    },

    setIndoors(indoors) {
      // Not silenced and not merely turned down: what comes through a wall is
      // the rumble, and losing the crack is most of what says you are inside.
      wall.frequency.setTargetAtTime(indoors ? 180 : 20000, context.currentTime, 0.2);
    },

    fire(at, force) {
      const { range, spread, crack, speed, seed } = shot;
      const near = Math.max(range, 0.05);
      let end = at;
      for (let i = 0; i < ARRIVALS; i++) {
        // Up the channel, jittered, because a channel is irregular and that is
        // what stops the roll sounding like a delay line.
        const up = spread * ((i + hashed(seed, 100 + i) * 0.9) / ARRIVALS);
        const distance = Math.hypot(near, up);
        const when = at + ((distance - near) * 1000) / speed;
        // The first arrivals against the rest is the one dial that separates a
        // rip from a roll.
        const share = i < 2 ? 0.35 + crack : (1 - crack) * 0.85;
        const level = (force * share * 0.9) / (1 + distance * 0.55);
        const length = 0.12 + distance * 0.09 + hashed(seed, 200 + i) * 0.2;
        arrival(when, level, distance, length, seed + i * 31);
        end = Math.max(end, when + length * 3);
      }

      // What the noise cannot carry: a bolt close enough to crack has weight
      // under everything the air let through.
      if (crack > 0.4) {
        thump(context, wall, at, force * crack * 0.4 / (1 + near), 58, 26, 0.5, 0.006);
      }

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
      wall.disconnect();
      panner.disconnect();
      output.disconnect();
    },
  };
}
