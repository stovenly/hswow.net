import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise, type NoiseVoice } from '../noise';

/**
 * The keynote: the air you are standing in.
 *
 * `wind.ts` is a *source* — a thing over there making a noise, spatialised by
 * an emitter. This is the opposite and needs building the opposite way: it is
 * everywhere, it has no direction, and the one thing it must never be is a
 * point. A mono bed on the dry bus sits in the dead centre of the listener's
 * head and no amount of level or filtering moves it.
 *
 * So every layer here is **two decorrelated voices, panned apart**. Same
 * buffer, different start offsets, slightly different rates — which is exactly
 * what `playNoise` exists to do, and what makes two copies read as a field
 * rather than as one source that got louder. The width narrows as the air
 * quietens, because a still room is narrower than a gale.
 *
 * Four bands, and they are four different physical things rather than one
 * noise with an EQ on it:
 *
 * - **roar** — the mass of moving air. Under 150 Hz, felt more than heard, and
 *   it is what makes a gale feel like weather rather than like hiss.
 * - **rush** — air past large surfaces. The body, and most of the level.
 * - **hiss** — air past small ones: grass, leaves, edges, your own ears.
 * - **whistle** — one narrow band that *rises in pitch and coherence* with
 *   speed, because faster air past the same edge sheds vortices faster and more
 *   regularly. It is the only part that says how hard it is blowing.
 *
 * All four answer the travelling gust field, so the air quickens where the
 * front actually is rather than everywhere at once.
 */

export interface AirOptions {
  gain?: number;
  /**
   * How much the place takes off the top, 0..1. A bowl with hills round it, a
   * lane between houses and a wood are all shelter; a shore is none.
   */
  shelter?: number;
  /** Lowpass over the whole bed, Hz. The softness control. */
  tone?: number;
  /** Balance, each 0..1-ish. A cave is all roar; a beach is all hiss. */
  roar?: number;
  rush?: number;
  hiss?: number;
  /**
   * How much of an edge there is to whistle past, 0..1. A chainlink fence and
   * a stone arch are high; open grass is nearly zero.
   */
  aperture?: number;
  /** How wide the bed sits, 0..1. Lower is closer and more enclosed. */
  width?: number;
  /** Steady level under the gust, 0..1. Nowhere is ever perfectly still. */
  floor?: number;
}

export interface AirModel extends SoundModel {
  /** Live tone control, Hz. Lower is softer and more enclosed. */
  setTone(hz: number): void;
}

const ROAR_HZ = 150;
const RUSH_HZ = 520;
const RUSH_Q = 0.8;
const HISS_HZ = 3400;
const HISS_Q = 0.5;
const WHISTLE_MIN_HZ = 1100;
const WHISTLE_MAX_HZ = 3200;
/**
 * Kept low. Past about Q 12 a bandpass on white noise stops sounding like air
 * over an edge and starts sounding like feedback, which is where nearly all the
 * harshness in a synthesised wind comes from.
 */
const WHISTLE_MIN_Q = 3;
const WHISTLE_MAX_Q = 10;

/**
 * How far toward one side any part of the bed may sit.
 *
 * Deliberately short of the ends. Nothing in a real environment arrives at one
 * ear and not the other — your head is not an infinite baffle, and a sound to
 * your right still reaches your left a fraction of a millisecond later and only
 * a few decibels down. A bed panned to the stops sounds like headphones with a
 * fault, and it is the single most common way synthesised air gives itself away.
 */
const MAX_PAN = 0.75;

interface Layer {
  /** Two voices, panned apart. The whole reason this file is not `wind.ts`. */
  voices: NoiseVoice[];
  pans: StereoPannerNode[];
  /**
   * Where each side sits at full width. Held here rather than read back off
   * the node: an `AudioParam` mid-ramp reports where it has got to, not where
   * it was aimed, so scaling the live value compounds every frame and walks
   * the field into the middle — and `Math.sign` pins it there once it arrives.
   */
  base: number[];
  filter: BiquadFilterNode;
  level: GainNode;
}

export function createAir(engine: AudioEngine, options: AirOptions = {}): AirModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('air built before the noise buffers were ready');

  const shelter = options.shelter ?? 0.35;
  const aperture = options.aperture ?? 0.3;
  const width = options.width ?? 0.8;
  const floorLevel = options.floor ?? 0.12;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.2;

  // One lowpass over everything, so the tone control shapes the four layers
  // together rather than each of them fighting the others.
  const tone = context.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = options.tone ?? 3600;
  tone.Q.value = 0.4;
  tone.connect(output);

  const build = (
    buffer: AudioBuffer,
    type: BiquadFilterType,
    hz: number,
    q: number,
    spread: number,
  ): Layer => {
    const filter = context.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = hz;
    filter.Q.value = q;

    const level = context.createGain();
    level.gain.value = 0;
    filter.connect(level).connect(tone);

    // Two voices into two pans, not one voice split — a split source is still
    // one source and the ear places it dead centre however far the pans go.
    const pans: StereoPannerNode[] = [];
    const base: number[] = [];
    const voices: NoiseVoice[] = [];
    for (let side = 0; side < 2; side++) {
      const pan = context.createStereoPanner();
      // Never fully to one side. Air is all around you; a bed that reaches the
      // ends of the field is a bed with a hole in the middle of it.
      const seat = (side === 0 ? -1 : 1) * spread * width * MAX_PAN;
      pan.pan.value = seat;
      pan.connect(filter);
      pans.push(pan);
      base.push(seat);
      // A wider rate detune than the default: these run for the whole session
      // and two voices at nearly the same rate drift into audible phasing.
      voices.push(playNoise(context, buffer, pan, 0.11));
    }
    return { voices, pans, base, filter, level };
  };

  // Brown for the mass, pink for the body, white for the detail — the three
  // slopes are also an ordering of scale, which is why the bed wants all three.
  const roar = build(noise.brown, 'lowpass', ROAR_HZ, 0.6, 0.55);
  const rush = build(noise.pink, 'bandpass', RUSH_HZ, RUSH_Q, 0.85);
  const hiss = build(noise.white, 'bandpass', HISS_HZ, HISS_Q, 1);
  const whistle = build(noise.white, 'bandpass', WHISTLE_MIN_HZ, WHISTLE_MIN_Q, 0.7);

  const mix = {
    roar: options.roar ?? 0.55,
    rush: options.rush ?? 1,
    hiss: options.hiss ?? 0.7,
  };

  let strength = 0;

  const apply = (at: number): void => {
    const speed = Math.min(1, Math.max(0, strength));
    // Never quite still: a room with the window shut still has air in it, and
    // a bed that reaches zero reads as the sound being switched off.
    const drive = floorLevel + (1 - floorLevel) * speed;

    // The roar comes up faster than the rest and carries the weight.
    roar.level.gain.setTargetAtTime(mix.roar * drive * drive * 0.9, at, 0.4);
    rush.level.gain.setTargetAtTime(mix.rush * drive * 0.5, at, 0.35);
    // Shelter takes the top off, and it takes more of it the harder it blows —
    // which is what standing in a wood in a gale actually sounds like.
    hiss.level.gain.setTargetAtTime(mix.hiss * drive * 0.3 * (1 - shelter * 0.75), at, 0.3);

    // The whistle is where the realism is: centre and Q both climb with speed,
    // and it scales as the cube so it is absent until it is suddenly there.
    const rising = speed * speed * speed;
    whistle.filter.frequency.setTargetAtTime(
      WHISTLE_MIN_HZ + (WHISTLE_MAX_HZ - WHISTLE_MIN_HZ) * speed,
      at,
      0.25,
    );
    whistle.filter.Q.setTargetAtTime(
      WHISTLE_MIN_Q + (WHISTLE_MAX_Q - WHISTLE_MIN_Q) * speed,
      at,
      0.25,
    );
    whistle.level.gain.setTargetAtTime(aperture * rising * 0.22, at, 0.2);

    // The field narrows as it quietens. A still place is a small place.
    const narrow = 0.5 + 0.5 * speed;
    for (const layer of [roar, rush, hiss, whistle]) {
      for (let side = 0; side < 2; side++) {
        layer.pans[side].pan.setTargetAtTime(layer.base[side] * narrow, at, 1.2);
      }
    }
  };

  apply(context.currentTime);

  return {
    output,

    setTone(hz) {
      tone.frequency.setTargetAtTime(hz, context.currentTime, 0.3);
    },

    update(_dt, audio, at) {
      // The travelling field, not the global reading. A bed has no position of
      // its own, so it samples where the listener is standing.
      strength = audio.weather.strengthAt(at.x, at.z);
      apply(context.currentTime);
    },

    dispose() {
      for (const layer of [roar, rush, hiss, whistle]) {
        for (const voice of layer.voices) voice.stop();
        for (const pan of layer.pans) pan.disconnect();
        layer.filter.disconnect();
        layer.level.disconnect();
      }
      tone.disconnect();
      output.disconnect();
    },
  };
}
