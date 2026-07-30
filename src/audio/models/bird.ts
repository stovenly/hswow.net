import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';

/**
 * A small bird, calling now and then.
 *
 * A call is two or three short notes, each a sine sweeping in pitch with a
 * softer partial above it. Birdsong is almost pure tone — the syrinx is a very
 * efficient resonator — so unlike everything else in this engine there is no
 * noise in it at all.
 *
 * What makes it read as an animal rather than a beep is the *timing*. Calls
 * come in bursts with long, irregular silences between them, notes inside a
 * burst are fast and unevenly spaced, and each note bends in pitch rather than
 * holding. A regular chirp on a timer is instantly a machine.
 *
 * It also falls quiet in strong wind, which real birds do, and which quietly
 * ties it to the same weather everything else is listening to.
 */

export interface BirdOptions {
  /** Centre of the pitch range, Hz. Small birds are high. */
  pitch?: number;
  gain?: number;
  /** Average seconds between calls. */
  interval?: number;
  /** Wind strength above which it stops calling. */
  shySpeed?: number;
  /** Lowpass in Hz. Lower reads as further away. */
  tone?: number;
}

export function createBird(engine: AudioEngine, options: BirdOptions = {}): SoundModel {
  const context = engine.context;

  const pitch = options.pitch ?? 2400;
  const interval = options.interval ?? 7;
  const shySpeed = options.shySpeed ?? 0.72;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.16;

  /**
   * A lowpass, standing in for distance.
   *
   * Level alone does not make something sound far away — it makes it sound
   * like a quiet thing that is close, which is a different and much less
   * interesting impression. Air absorbs high frequencies far faster than low
   * ones, so distance is heard as *dullness* first and quietness second. A
   * bird calling from the crown of a tree has already lost most of its top
   * end by the time it reaches the ground.
   */
  const distance = context.createBiquadFilter();
  distance.type = 'lowpass';
  distance.frequency.value = options.tone ?? 3200;
  distance.Q.value = 0.5;
  distance.connect(output);

  let active = true;
  let nextCall = 0;

  const scheduleNote = (at: number, from: number, to: number, duration: number): void => {
    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(from, at);
    // Exponential, because pitch is perceived in ratios: a linear sweep sounds
    // like it slows down as it rises.
    osc.frequency.exponentialRampToValueAtTime(to, at + duration);

    // A quiet partial an octave and a bit up, which is roughly what gives a
    // real call its edge without making it sound like a square wave.
    const partial = context.createOscillator();
    partial.type = 'sine';
    partial.frequency.setValueAtTime(from * 2.02, at);
    partial.frequency.exponentialRampToValueAtTime(to * 2.02, at + duration);
    const partialGain = context.createGain();
    partialGain.gain.value = 0.18;

    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(1, at + duration * 0.18);
    envelope.gain.setValueAtTime(1, at + duration * 0.6);
    envelope.gain.linearRampToValueAtTime(0, at + duration);

    osc.connect(envelope);
    partial.connect(partialGain).connect(envelope);
    envelope.connect(distance);

    osc.start(at);
    partial.start(at);
    osc.stop(at + duration + 0.02);
    partial.stop(at + duration + 0.02);
  };

  /**
   * Call shapes.
   *
   * A bird with one phrase is a car alarm. Real calls come in recognisable
   * kinds — a rising query, a falling complaint, a rattled trill, a single
   * held whistle — and it is having *several* that makes something sound
   * alive, far more than the detail of any one of them. Weighted, because a
   * bird has habits: mostly the ordinary phrase, occasionally the odd one.
   */
  const SHAPES = [
    { name: 'rising', weight: 0.26 },
    { name: 'falling', weight: 0.2 },
    { name: 'trill', weight: 0.16 },
    { name: 'pair', weight: 0.22 },
    { name: 'single', weight: 0.1 },
    { name: 'chatter', weight: 0.06 },
  ] as const;

  const pickShape = (): (typeof SHAPES)[number]['name'] => {
    let roll = Math.random();
    for (const shape of SHAPES) {
      roll -= shape.weight;
      if (roll <= 0) return shape.name;
    }
    return 'pair';
  };

  const scheduleCall = (at: number): number => {
    // One bird, one voice: the whole call sits around a pitch chosen per call,
    // so successive calls sound like the same creature in a mood rather than
    // different creatures.
    const base = pitch * (0.82 + Math.random() * 0.36);
    let cursor = at;

    switch (pickShape()) {
      case 'rising': {
        const notes = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < notes; i++) {
          const step = 1 + i * (0.1 + Math.random() * 0.09);
          const duration = 0.06 + Math.random() * 0.07;
          scheduleNote(cursor, base * step, base * step * 1.22, duration);
          cursor += duration + 0.03 + Math.random() * 0.05;
        }
        break;
      }
      case 'falling': {
        const notes = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < notes; i++) {
          const step = 1 - i * (0.08 + Math.random() * 0.07);
          const duration = 0.08 + Math.random() * 0.1;
          scheduleNote(cursor, base * step * 1.18, base * step * 0.82, duration);
          cursor += duration + 0.04 + Math.random() * 0.06;
        }
        break;
      }
      case 'trill': {
        // Many very short notes, close together, alternating slightly.
        const notes = 5 + Math.floor(Math.random() * 7);
        const gap = 0.028 + Math.random() * 0.022;
        for (let i = 0; i < notes; i++) {
          const wobble = i % 2 === 0 ? 1 : 1.09;
          scheduleNote(cursor, base * wobble, base * wobble * 1.05, gap * 0.8);
          cursor += gap;
        }
        break;
      }
      case 'pair': {
        const duration = 0.07 + Math.random() * 0.06;
        scheduleNote(cursor, base, base * 1.3, duration);
        cursor += duration + 0.05 + Math.random() * 0.04;
        scheduleNote(cursor, base * 1.28, base * 1.05, duration * 1.2);
        cursor += duration * 1.2;
        break;
      }
      case 'single': {
        const duration = 0.22 + Math.random() * 0.3;
        scheduleNote(cursor, base * 0.95, base * 1.12, duration);
        cursor += duration;
        break;
      }
      case 'chatter': {
        // Harsh and fast — an alarm rather than a song.
        const notes = 3 + Math.floor(Math.random() * 4);
        for (let i = 0; i < notes; i++) {
          const duration = 0.02 + Math.random() * 0.02;
          scheduleNote(cursor, base * 0.6, base * 0.5, duration);
          cursor += duration + 0.02 + Math.random() * 0.03;
        }
        break;
      }
    }

    return cursor;
  };

  return {
    output,

    setActive(next) {
      active = next;
      if (next) nextCall = 0;
    },

    update(_dt, audio) {
      if (!active) return;
      const now = context.currentTime;
      if (nextCall < now) nextCall = now + Math.random() * interval;
      if (nextCall > now + 0.2) return;

      if (audio.weather.strength < shySpeed) {
        const end = scheduleCall(nextCall);
        // Bouts. A third of the time the bird answers itself a beat later;
        // otherwise it goes quiet for a while. Calls spread evenly by a single
        // exponential wait are still too regular — real ones cluster, and the
        // clustering is what makes the long silences read as silence rather
        // than as a gap between events.
        nextCall =
          end +
          (Math.random() < 0.34
            ? 0.4 + Math.random() * 2.2
            : -Math.log(1 - Math.random()) * interval);
      } else {
        nextCall = now + 1.5;
      }
    },

    dispose() {
      output.disconnect();
    },
  };
}
