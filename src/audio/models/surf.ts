import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise } from '../noise';
import { createParticleBed, scatterParticles, type ParticleBed, type Particles } from '../dsp/phisem';
import { createEventClock, periodicGap, type EventClock } from '../dsp/clock';

/**
 * Waves on a shore. A **cycle**, not a bed — which is the whole difference
 * between a shore and a waterfall, and the thing a looped recording cannot
 * have.
 *
 * Three parts in order, every eight to fourteen seconds:
 *
 * 1. **The swell.** A slow broadband rise over several seconds as the wave
 *    stands up. Low, dark, and nearly featureless.
 * 2. **The break.** A brighter burst with a thump under it.
 * 3. **The draw.** The water going back out over the stones, and this is the
 *    part worth having: thousands of small hard objects dragging over one
 *    another is Cook's model exactly, at a count and a duration nothing else
 *    in the library uses.
 *
 * The period wanders slowly rather than repeating, and `phase` is published so
 * that anything rung by the sea — a bell buoy — is rung by *this* sea and not
 * by a clock of its own.
 */

export interface SurfOptions {
  gain?: number;
  /** Seconds between breaks. Wanders either side of the middle of this. */
  period?: readonly [number, number];
  /** How far off the water is. Below 1 is darker and further. */
  tone?: number;
  /** Shingle against sand, 0..1. Sand barely rattles; shingle roars. */
  shingle?: number;
  /** Sea state, 0..1. Live. */
  swell?: number;
}

export interface SurfModel extends SoundModel {
  /** How big the sea is, 0..1. */
  setSwell(value: number): void;
  /** Where the current wave is in its cycle, 0..1. Breaks near 0.42. */
  readonly phase: number;
}

/** Where in the cycle the wave breaks. Before it is the stand-up, after is the draw. */
const BREAK_AT = 0.42;

export function createSurf(engine: AudioEngine, options: SurfOptions = {}): SurfModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('surf built before the noise buffers were ready');

  const tone = options.tone ?? 1;
  const shingle = options.shingle ?? 0.7;
  const period = options.period ?? [8, 14];

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.25;

  // The body of moving water: brown noise low down, carrying most of the level
  // and none of the identity.
  const bodyFilter = context.createBiquadFilter();
  bodyFilter.type = 'lowpass';
  bodyFilter.frequency.value = 420 * tone;
  bodyFilter.Q.value = 0.6;
  bodyFilter.connect(output);
  const body = context.createGain();
  body.gain.value = 0;
  body.connect(bodyFilter);
  const bodyNoise = playNoise(context, noise.brown, body);

  // The break: brighter, and it is the only part with an edge on it.
  const crestFilter = context.createBiquadFilter();
  crestFilter.type = 'bandpass';
  crestFilter.frequency.value = 1300 * tone;
  crestFilter.Q.value = 0.5;
  crestFilter.connect(output);
  const crest = context.createGain();
  crest.gain.value = 0;
  crest.connect(crestFilter);
  const crestNoise = playNoise(context, noise.pink, crest);

  // The draw. Not noise: individual stones, thousands of them, over a second
  // and a half.
  /** The stones, built once. A beach does not acquire new pebbles per wave. */
  const shingleBed: Particles = {
    count: 700,
    over: 5,
    energyDecay: 2.4,
    hz: 2400 * tone,
    q: 1.4,
    level: 0.05 * shingle,
    voices: 4,
    spread: 0.75,
  };
  const stones: ParticleBed = createParticleBed(context, shingleBed, output);

  const clock: EventClock = createEventClock(context);
  const gap = periodicGap((period[0] + period[1]) / 2, 0.16);

  let swell = options.swell ?? 0.6;
  let active = true;
  let breakAt = 0;
  let span = gap.rate;

  const wave = (at: number): void => {
    // Each wave its own length, drawn fresh: a shore that keeps time is a
    // machine, and the ear finds it inside three waves.
    span = period[0] + Math.random() * (period[1] - period[0]);
    gap.rate = span;
    breakAt = at + span * BREAK_AT;

    const size = 0.35 + swell * 0.65 * (0.75 + Math.random() * 0.5);
    const stand = span * BREAK_AT;
    const draw = span * (1 - BREAK_AT);

    // Stand up: slow, and it is the anticipation that makes the break land.
    body.gain.cancelScheduledValues(at);
    body.gain.setValueAtTime(Math.max(body.gain.value, 0.0001), at);
    body.gain.linearRampToValueAtTime(size, breakAt);
    body.gain.setTargetAtTime(size * 0.12, breakAt + 0.15, draw * 0.4);

    // The break itself.
    crest.gain.cancelScheduledValues(at);
    crest.gain.setValueAtTime(0.0001, at);
    crest.gain.setValueAtTime(0.0001, breakAt - stand * 0.12);
    crest.gain.linearRampToValueAtTime(size * 0.75, breakAt + 0.09);
    crest.gain.setTargetAtTime(0.0001, breakAt + 0.12, draw * 0.22);

    // The draw, a beat behind the break, and it lasts most of the cycle.
    scatterParticles(
      context,
      noise.white,
      stones,
      {
        ...shingleBed,
        count: Math.round((260 + shingle * 900) * size),
        over: draw * 0.8,
        energyDecay: draw * 0.34,
      },
      breakAt + 0.16,
      size,
    );
  };

  return {
    output,

    setSwell(value) {
      swell = Math.min(1, Math.max(0, value));
    },

    get phase() {
      const now = context.currentTime;
      // Measured back from the break rather than forward from the start, so
      // the published phase agrees with what is actually being heard.
      return Math.min(1, Math.max(0, (now - (breakAt - span * BREAK_AT)) / Math.max(span, 0.1)));
    },

    setActive(next) {
      active = next;
      if (next) clock.reset();
    },

    update() {
      if (!active) return;
      clock.pump(wave, gap, 'oneGap');
    },

    dispose() {
      bodyNoise.stop();
      crestNoise.stop();
      stones.dispose();
      body.disconnect();
      crest.disconnect();
      bodyFilter.disconnect();
      crestFilter.disconnect();
      output.disconnect();
    },
  };
}
