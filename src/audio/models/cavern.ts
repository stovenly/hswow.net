import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import type { FaustNode } from '../faust/FaustNode';
import { playNoise, type NoiseVoice } from '../noise';

/**
 * The keynote of a large hollow space: a cave, a vault, a cistern, a shaft.
 *
 * The synthesis is `faust/cavern.dsp`; this is what drives it and what happens
 * when the wasm does not arrive.
 *
 * A cave has **no note**. It has several broad irrational resonances that
 * wander as air moves through passages you cannot see, and a pressure floor
 * under them. Building it as a stopped pipe gives it a definite pitch and a
 * harmonic series, which is why that reads as an organ or as a drum being
 * tuned — because that is what those are.
 *
 * The fallback is a different thing that happens to sound similar: four static
 * bandpasses on brown noise, slowly cross-faded. It has the right spectrum and
 * none of the movement, because the movement is a feedback loop whose length
 * changes every sample and a node graph cannot hold one at all above 375 Hz.
 * `usingFaust` says which is playing.
 */

export interface CavernOptions {
  gain?: number;
  /** The lowest resonance, Hz. 25 is a chamber, 70 a room, 140 a passage. */
  size?: number;
  /** Rock against soft fill, 0..1. High is bare, hard and long. */
  hard?: number;
  /** Air moving through, 0..1. Live — see `setDraught`. */
  draught?: number;
  /** How far the passages breathe, 0..1. */
  drift?: number;
  /** The sub-bass floor, 0..1. Weight rather than sound. */
  floor?: number;
}

export interface CavernModel extends SoundModel {
  /** Air moving through, 0..1. The one thing the weather drives here. */
  setDraught(value: number): void;
  readonly usingFaust: boolean;
}

const HANDOVER = 0.6;

async function loadCavernNode(context: BaseAudioContext): Promise<FaustNode | null> {
  try {
    const [{ createFaustNode }, { cavernMeta, cavernUrl }] = await Promise.all([
      import('../faust/FaustNode'),
      import('../faust/built/cavern'),
    ]);
    return await createFaustNode(context, cavernUrl, cavernMeta);
  } catch (error) {
    console.warn('cavern: faust tier unavailable — using the filtered fallback', error);
    return null;
  }
}

/** Ratios with no small-integer relationship between any pair. See the dsp. */
const RATIOS = [1, 1.61, 2.29, 3.44];
const WEIGHTS = [1, 0.62, 0.44, 0.28];

export function createCavern(engine: AudioEngine, options: CavernOptions = {}): CavernModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('cavern built before the noise buffers were ready');

  const size = options.size ?? 45;
  const hard = options.hard ?? 0.7;
  const drift = options.drift ?? 0.5;
  const floor = options.floor ?? 0.6;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.2;

  // Both paths exist permanently and exactly one is audible.
  const faustOut = context.createGain();
  faustOut.gain.value = 0;
  faustOut.connect(output);
  const nativeOut = context.createGain();
  nativeOut.gain.value = 1;
  nativeOut.connect(output);

  // --- the fallback --------------------------------------------------------
  const voices: NoiseVoice[] = [];
  const bands: BiquadFilterNode[] = [];
  const excite = context.createGain();
  excite.gain.value = 0.35;
  RATIOS.forEach((ratio, i) => {
    const band = context.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = size * ratio;
    band.Q.value = 6 + hard * 10;
    const level = context.createGain();
    level.gain.value = WEIGHTS[i] * 0.5;
    excite.connect(band).connect(level).connect(nativeOut);
    bands.push(band);
  });
  voices.push(playNoise(context, noise.pink, excite));

  const floorBand = context.createBiquadFilter();
  floorBand.type = 'lowpass';
  floorBand.frequency.value = 38;
  floorBand.Q.value = 0.7;
  const floorGain = context.createGain();
  floorGain.gain.value = floor * 1.2;
  floorBand.connect(floorGain).connect(nativeOut);
  voices.push(playNoise(context, noise.brown, floorBand));

  let faust: FaustNode | null = null;
  let draught = options.draught ?? 0.4;
  let active = true;
  let disposed = false;

  void loadCavernNode(context).then((node) => {
    if (!node || disposed) {
      node?.dispose();
      return;
    }
    faust = node;
    node.set('size', size);
    node.set('hard', hard);
    node.set('drift', drift);
    node.set('floor', floor);
    node.set('draught', draught);
    node.node.connect(faustOut);
    const now = context.currentTime;
    faustOut.gain.setTargetAtTime(1, now, HANDOVER / 3);
    nativeOut.gain.setTargetAtTime(0, now, HANDOVER / 3);
  });

  const apply = (): void => {
    if (faust) {
      faust.set('draught', draught);
      return;
    }
    // The fallback cannot breathe, so all it can do is open up.
    const now = context.currentTime;
    excite.gain.setTargetAtTime(0.12 + draught * 0.5, now, 0.8);
  };

  return {
    output,

    setDraught(value) {
      draught = Math.min(1, Math.max(0, value));
      apply();
    },

    setActive(next) {
      active = next;
    },

    update(_dt, audio, at) {
      if (!active) return;
      // Air through a cave is the weather outside it, damped by everything
      // between — so it moves, slowly, and never reaches zero.
      draught = 0.15 + audio.weather.strengthAt(at.x, at.z) * 0.6;
      apply();
    },

    get usingFaust() {
      return faust !== null;
    },

    dispose() {
      disposed = true;
      for (const voice of voices) voice.stop();
      voices.length = 0;
      for (const band of bands) band.disconnect();
      bands.length = 0;
      excite.disconnect();
      floorBand.disconnect();
      floorGain.disconnect();
      faust?.dispose();
      faustOut.disconnect();
      nativeOut.disconnect();
      output.disconnect();
    },
  };
}
