import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise, type NoiseVoice } from '../noise';
import { createEventClock, poissonGap } from '../dsp/clock';
import { createGrainBed } from '../dsp/grain';
import { excite } from '../dsp/impact';
import { popBubble, bubbleRadius } from '../dsp/bubble';

/**
 * Rain. A hiss bed — every drop too far away to resolve — carrying nearly all
 * the level, and patter on top carrying almost none of it and all of the
 * identity. Backwards, it is bubble wrap with a hat on.
 *
 * Rain has no sound of its own. Water falling through air is silent; what you
 * hear is the surface it lands on, and the same weather over a canopy, a slate
 * roof, a dirt track and a pond makes four sounds with nothing in common —
 * dense mid rustle, bright sharp tick, dull thud, bubbles. So `surface` is not
 * a tone control on the model, it *is* the model, and the rest is a scheduler.
 *
 * Rain on stone or leaves is an impact, exactly like a footstep. Rain on water
 * is air being entrained, every drop ringing at the size of the bubble it
 * traps, so `'water'` uses `dsp/bubble.ts` rather than `dsp/impact.ts`.
 */

export type RainSurface = 'canopy' | 'stone' | 'earth' | 'water';

interface Surface {
  /** Where the individual drops resonate. */
  channels: { hz: number; q: number; weight: number }[];
  /** Contact time. Short is hard, long is soft — see `dsp/impact.ts`. */
  contact: readonly [number, number];
  /** Level of one drop against the bed. */
  drop: number;
  /** Centre of the hiss bed, and how broad it is. */
  bedHz: number;
  bedQ: number;
  /** Drops per second per unit of intensity. */
  density: number;
  /** Bubbles instead of impacts. Only water. */
  bubbles?: readonly [number, number];
}

const SURFACES: Record<RainSurface, Surface> = {
  // Dense, mid, and blurred. A canopy is thousands of small soft targets, so
  // the contact is long, the bands are broad and no single drop stands out.
  canopy: {
    channels: [
      { hz: 900, q: 2.4, weight: 0.42 },
      { hz: 1900, q: 2.8, weight: 0.4 },
      { hz: 3600, q: 3.2, weight: 0.18 },
    ],
    contact: [0.004, 0.012],
    drop: 0.16,
    bedHz: 1600,
    bedQ: 0.7,
    density: 420,
  },
  // Bright, sharp, and it rings. Stone is the surface where individual drops
  // are most audible, which is why a rainy street sounds busier than a rainy
  // wood at the same rainfall.
  stone: {
    channels: [
      { hz: 2400, q: 5, weight: 0.34 },
      { hz: 4200, q: 6, weight: 0.42 },
      { hz: 6800, q: 7, weight: 0.24 },
    ],
    contact: [0.0012, 0.004],
    drop: 0.26,
    bedHz: 3200,
    bedQ: 0.55,
    density: 300,
  },
  // Dull and dead. Earth absorbs almost everything, so the drops are thuds with
  // no ring at all and the bed does nearly all the work.
  earth: {
    channels: [
      { hz: 420, q: 1.8, weight: 0.5 },
      { hz: 780, q: 2, weight: 0.36 },
      { hz: 1500, q: 2.4, weight: 0.14 },
    ],
    contact: [0.01, 0.028],
    drop: 0.14,
    bedHz: 800,
    bedQ: 0.6,
    density: 260,
  },
  // Bubbles. A different generator entirely — see the header. The radii are
  // small: a raindrop entrains very little air, which is why rain on a pond is
  // so much higher-pitched than a tap running into a sink.
  water: {
    channels: [
      { hz: 1400, q: 3, weight: 0.5 },
      { hz: 2600, q: 3.5, weight: 0.5 },
    ],
    contact: [0.002, 0.006],
    drop: 0.07,
    bedHz: 2000,
    bedQ: 0.6,
    density: 240,
    bubbles: [0.0004, 0.0016],
  },
};

export interface RainOptions {
  gain?: number;
  surface?: RainSurface;
  /** How hard it is raining, 0..1. See `setIntensity`. */
  intensity?: number;
  /** Shifts every band. Below 1 is a heavier, softer surface. */
  tone?: number;
  /** How much of the level the individual drops carry, 0..1. Small on purpose. */
  articulation?: number;
  /** Extra drops per second under an eave or a gutter. Zero in the open. */
  eaves?: number;
}

export interface RainModel extends SoundModel {
  /**
   * How hard it is raining, 0..1. Moves rate, level and brightness together;
   * rate goes as the square, because heavier rain is not proportionally more
   * drops, it is far more.
   */
  setIntensity(value: number): void;
  /**
   * What it is falling on. Changes the bands rather than rebuilding, so it can
   * switch live — a lane onto cobbles under the same sky. `'water'` cannot be
   * switched into: the bubble path is decided at construction.
   */
  setSurface(surface: RainSurface): void;
}

export function createRain(engine: AudioEngine, options: RainOptions = {}): RainModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('rain model built before the noise buffers were ready');

  const tone = options.tone ?? 1;
  const eaves = options.eaves ?? 0;
  let surface = SURFACES[options.surface ?? 'canopy'];
  const bubbles = surface.bubbles;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const dropBus = context.createGain();
  dropBus.gain.value = 0;
  dropBus.connect(output);
  const drops = createGrainBed(context, surface.channels, dropBus, tone);

  // The bed. Pink rather than white: the aggregate of a very large number of
  // small impacts falls off with frequency, and white noise here is the single
  // commonest reason synthetic rain sounds like a hi-hat.
  const bedFilter = context.createBiquadFilter();
  bedFilter.type = 'bandpass';
  bedFilter.frequency.value = surface.bedHz * tone;
  bedFilter.Q.value = surface.bedQ;
  const bedGain = context.createGain();
  bedGain.gain.value = 0;

  // Three voices, not one. A single six-second buffer through a narrow band is
  // recognisable inside two passes: the band picks out that one buffer's own
  // wander and hands it back on a timer. Three at rates a few per cent apart
  // have loop lengths that do not line up again for many minutes, and the ear
  // stops finding a period at all.
  //
  // Spread across the stereo field rather than stacked in the middle. Rain is
  // the one sound that is genuinely all around you, and a mono hiss sits inside
  // your head instead — which is most of why it reads as an effect rather than
  // as weather.
  const bedSum = context.createGain();
  const bed: NoiseVoice[] = [-0.75, 0.0, 0.75].map((side) => {
    const panner = context.createStereoPanner();
    panner.pan.value = side;
    panner.connect(bedSum);
    return playNoise(context, noise.pink, panner, 0.09);
  });
  bedSum.gain.value = 0.58;
  bedSum.connect(bedFilter);

  // And a second band under it. Rain is not one filtered hiss: there is the
  // spatter you can pick drops out of and, under it, the weight of everything
  // too far off to resolve. One bandpass alone is what makes synthetic rain
  // read as noise with a filter on it rather than as a sound with distance in
  // it.
  const roar = context.createBiquadFilter();
  roar.type = 'lowpass';
  roar.frequency.value = 340 * tone;
  roar.Q.value = 0.6;
  const roarGain = context.createGain();
  roarGain.gain.value = 0.72;
  bedSum.connect(roar);
  roar.connect(roarGain).connect(bedGain);

  // A third band over the other two: the fine spatter, the part with drops
  // almost resolvable in it. Low, high and something between is the least that
  // sounds like water rather than like a filter sweep.
  const fine = context.createBiquadFilter();
  fine.type = 'bandpass';
  fine.frequency.value = surface.bedHz * tone * 3.1;
  fine.Q.value = 0.7;
  const fineGain = context.createGain();
  fineGain.gain.value = 0.34;
  bedSum.connect(fine);
  fine.connect(fineGain).connect(bedGain);

  bedFilter.connect(bedGain).connect(output);

  // A slow hand on the level, taken off brown noise played at a thirtieth
  // speed — six seconds of buffer become three minutes of wander. Rain surges
  // and slackens over tens of seconds and a bed held at one level is a fan;
  // this is the cheapest honest way to give it that, because it costs an
  // oscillator and no per-frame work at all. Summed into the gain rather than
  // multiplied, which is what an AudioParam does with a connected source.
  const swell = context.createBufferSource();
  swell.buffer = noise.brown;
  swell.loop = true;
  swell.playbackRate.value = 0.033;
  const swellDepth = context.createGain();
  swellDepth.gain.value = 0;
  swell.connect(swellDepth).connect(bedGain.gain);
  swell.start(0, Math.random() * noise.brown.duration);

  let intensity = options.intensity ?? 0.5;
  const articulation = options.articulation ?? 0.35;
  let active = true;
  const clock = createEventClock(context);
  const eaveClock = createEventClock(context);
  const dropGap = poissonGap();
  const eaveGap = poissonGap();

  const drop = (at: number): void => {
    if (bubbles) {
      popBubble(context, dropBus, at, {
        radius: bubbleRadius(bubbles[0], bubbles[1]),
        level: surface.drop * (0.4 + Math.random() * 0.6),
        // Fewer cycles than a still pool: the surface is already agitated, so
        // nothing gets to ring for long.
        cycles: 13,
      });
      return;
    }
    const [low, high] = surface.contact;
    excite(
      context,
      noise.white,
      drops.pick(),
      at,
      surface.drop * (0.35 + Math.random() * 0.65),
      low + Math.random() * (high - low),
    );
  };

  // Runoff: the fat, slow, individually audible drops off an edge. These *are*
  // meant to resolve as events, and they are most of what makes standing under
  // an eave feel like shelter rather than like the rain being quieter.
  const eave = (at: number): void => {
    popBubble(context, dropBus, at, {
      radius: bubbleRadius(0.0022, 0.0065),
      level: 0.5 + Math.random() * 0.5,
      cycles: 22,
    });
  };

  return {
    output,

    setIntensity(value) {
      intensity = Math.min(1, Math.max(0, value));
    },

    setSurface(next) {
      // The bubble path is structural, not a band. Switching a water model onto
      // stone would leave it popping bubbles through a stone filter, which is
      // worse than either.
      if (bubbles) return;
      surface = SURFACES[next];
      const now = context.currentTime;
      bedFilter.frequency.setTargetAtTime(surface.bedHz * tone, now, 0.25);
      bedFilter.Q.setTargetAtTime(surface.bedQ, now, 0.25);
      roar.frequency.setTargetAtTime(340 * tone, now, 0.25);
      fine.frequency.setTargetAtTime(surface.bedHz * tone * 3.1, now, 0.25);
      // The drop bands are fixed at construction — rebuilding filter nodes
      // mid-texture drops every drop in flight. Retuning them by ratio keeps
      // the character of the new surface without the seam.
      drops.setTone((surface.bedHz / SURFACES.canopy.bedHz) * tone, now);
    },

    setActive(next) {
      active = next;
      if (next) {
        clock.reset();
        eaveClock.reset();
      } else {
        bedGain.gain.value = 0;
        dropBus.gain.value = 0;
      }
    },

    update(_dt, audio, at) {
      if (!active) return;
      const now = context.currentTime;

      // Wind drives rain sideways and into things, so a gust genuinely makes it
      // louder and harder. Weak coupling — rain that tracked the gust field
      // exactly would read as one sound with two names.
      const fall = Math.min(1, intensity * (1 + audio.weather.strengthAt(at.x, at.z) * 0.22));

      // Off means off. The drop rate has a floor on it so that light rain stays
      // a texture rather than becoming countable, and without this gate that
      // floor would keep eight drops a second falling out of a clear sky.
      if (fall < 0.02) {
        bedGain.gain.setTargetAtTime(0, now, 0.6);
        swellDepth.gain.setTargetAtTime(0, now, 0.6);
        dropBus.gain.setTargetAtTime(0, now, 0.6);
        clock.reset();
        eaveClock.reset();
        return;
      }

      bedGain.gain.setTargetAtTime(fall * 0.55, now, 0.6);
      // The surge rides on top, and scales with the rain: a downpour heaves,
      // a drizzle barely moves.
      swellDepth.gain.setTargetAtTime(fall * fall * 0.2, now, 1.2);
      // Harder rain is brighter: faster drops, sharper contacts, more spray.
      bedFilter.frequency.setTargetAtTime(surface.bedHz * tone * (0.7 + fall * 0.55), now, 0.6);
      fine.frequency.setTargetAtTime(surface.bedHz * tone * 3.1 * (0.8 + fall * 0.4), now, 0.6);
      dropBus.gain.setTargetAtTime(articulation * (0.2 + fall * 0.8), now, 0.6);

      dropGap.rate = Math.max(8, surface.density * fall * fall);
      clock.pump(drop, dropGap);
      if (eaves > 0) {
        // `'oneGap'`: runoff drops are individually audible, and one landing at
        // the instant you step under a porch reads as a trigger.
        eaveGap.rate = eaves * (0.35 + fall * 0.65);
        eaveClock.pump(eave, eaveGap, 'oneGap');
      }
    },

    dispose() {
      for (const voice of bed) voice.stop();
      try {
        swell.stop();
      } catch {
        // Already stopped. Web Audio throws rather than shrugging.
      }
      drops.dispose();
      dropBus.disconnect();
      bedGain.disconnect();
      output.disconnect();
    },
  };
}
