import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import type { FaustNode } from '../faust/FaustNode';
import { playNoise, type NoiseVoice } from '../noise';
import { createEventClock, periodicGap, type EventClock } from '../dsp/clock';
import { excite } from '../dsp/impact';

/**
 * Heavy machinery under load: a plant floor, a press hall, a pump house.
 *
 * The synthesis is `faust/plant.dsp`; this is what drives it, what makes it
 * take on load and free up, and what happens when the wasm does not arrive.
 *
 * The point of the Faust tier here is that the casing's resonances have a
 * saturating nonlinearity **inside** the feedback loop, so they interact,
 * intermodulate and grind. Outside the loop, saturation is a distortion pedal
 * over a drone; parallel filters cannot do it at all, because parallel filters
 * by definition do not know about each other. That interaction is the whole
 * difference between a factory and a harsh tone.
 *
 * The fallback is a different thing that happens to sound similar: pink noise
 * through a few fixed resonances with a periodic knock scheduled over it. Right
 * spectrum, no grind, and it does not change under load. `usingFaust` says
 * which is playing.
 */

export interface PlantOptions {
  gain?: number;
  /** Revolutions per minute. The knock fires once per turn. */
  rpm?: number;
  /** The casing's lowest resonance, Hz. Below 60 is an engine room. */
  size?: number;
  /** Metal against air, 0..1. High is a bare hall. */
  metal?: number;
  /** The once-per-revolution knock, 0..1. */
  clank?: number;
  /** Bearing and airflow hiss, 0..1. */
  wear?: number;
  /** How hard it is working, 0..1. Live — see `setLoad`. */
  load?: number;
  /**
   * How much the load wanders on its own, 0..1. A plant that holds one setting
   * is a fan; real machinery takes work on and frees up all day.
   */
  duty?: number;
}

export interface PlantModel extends SoundModel {
  /** How hard it is working, 0..1. Moves speed, spectrum and roughness. */
  setLoad(value: number): void;
  setRpm(value: number): void;
  readonly usingFaust: boolean;
}

const HANDOVER = 0.6;

async function loadPlantNode(context: BaseAudioContext): Promise<FaustNode | null> {
  try {
    const [{ createFaustNode }, { plantMeta, plantUrl }] = await Promise.all([
      import('../faust/FaustNode'),
      import('../faust/built/plant'),
    ]);
    return await createFaustNode(context, plantUrl, plantMeta);
  } catch (error) {
    console.warn('plant: faust tier unavailable — using the filtered fallback', error);
    return null;
  }
}

/** No pair of these is a small integer ratio: a big steel box has no pitch. */
const RATIOS = [1, 2.37, 4.11];
const WEIGHTS = [0.5, 0.3, 0.2];

export function createPlant(engine: AudioEngine, options: PlantOptions = {}): PlantModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('plant built before the noise buffers were ready');

  const size = options.size ?? 90;
  const metal = options.metal ?? 0.6;
  const clank = options.clank ?? 0.4;
  const wear = options.wear ?? 0.4;
  const duty = options.duty ?? 0.5;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.25;

  const faustOut = context.createGain();
  faustOut.gain.value = 0;
  faustOut.connect(output);
  const nativeOut = context.createGain();
  nativeOut.gain.value = 1;
  nativeOut.connect(output);

  // --- the fallback --------------------------------------------------------
  const drive = context.createGain();
  drive.gain.value = 0.3 + wear * 0.5;
  const bands: BiquadFilterNode[] = [];
  RATIOS.forEach((ratio, i) => {
    const band = context.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = size * ratio;
    band.Q.value = 3 + metal * 6;
    const level = context.createGain();
    level.gain.value = WEIGHTS[i];
    drive.connect(band).connect(level).connect(nativeOut);
    bands.push(band);
  });
  const voices: NoiseVoice[] = [playNoise(context, noise.pink, drive)];

  const rumble = context.createBiquadFilter();
  rumble.type = 'lowpass';
  rumble.frequency.value = 55 + size * 0.4;
  const rumbleGain = context.createGain();
  rumbleGain.gain.value = 0.5;
  rumble.connect(rumbleGain).connect(nativeOut);
  voices.push(playNoise(context, noise.brown, rumble));

  const knock = context.createBiquadFilter();
  knock.type = 'bandpass';
  knock.frequency.value = size * 2.2;
  knock.Q.value = 4;
  knock.connect(nativeOut);

  const clock: EventClock = createEventClock(context);
  const gap = periodicGap(1, 0.04);

  let faust: FaustNode | null = null;
  let rpm = options.rpm ?? 220;
  let load = options.load ?? 0.5;
  /** Where the duty cycle currently sits. Wanders on its own. See `duty`. */
  let phase = Math.random() * 1000;
  let active = true;
  let disposed = false;

  void loadPlantNode(context).then((node) => {
    if (!node || disposed) {
      node?.dispose();
      return;
    }
    faust = node;
    node.set('size', size);
    node.set('metal', metal);
    node.set('clank', clank);
    node.set('wear', wear);
    node.set('rpm', rpm);
    node.set('load', load);
    node.node.connect(faustOut);
    const now = context.currentTime;
    faustOut.gain.setTargetAtTime(1, now, HANDOVER / 3);
    nativeOut.gain.setTargetAtTime(0, now, HANDOVER / 3);
  });

  const apply = (): void => {
    if (faust) {
      faust.set('rpm', rpm);
      faust.set('load', load);
      return;
    }
    const now = context.currentTime;
    // The fallback cannot grind, so all it can do is brighten and lift.
    drive.gain.setTargetAtTime(0.3 + wear * 0.5 + load * 0.35, now, 0.6);
    bands.forEach((band, i) => {
      band.frequency.setTargetAtTime(size * RATIOS[i] * (1 + load * 0.03), now, 0.8);
    });
  };

  apply();

  return {
    output,

    setLoad(value) {
      load = Math.min(1, Math.max(0, value));
      apply();
    },

    setRpm(value) {
      rpm = Math.max(1, value);
      apply();
    },

    setActive(next) {
      active = next;
      if (next) clock.reset();
    },

    update(dt) {
      if (!active) return;

      // Machinery is only interesting because it is working, so the load moves
      // on its own — two slow drifts at unrelated rates rather than an LFO,
      // which reads as periodic inside half a minute.
      if (duty > 0.01) {
        phase += dt;
        const swell =
          Math.sin(phase * 0.041) * 0.6 + Math.sin(phase * 0.017 + 2.1) * 0.4;
        load = Math.min(1, Math.max(0, (options.load ?? 0.5) + swell * duty * 0.4));
        apply();
      }

      // The Faust tier makes its own knock inside the casing, which is what
      // makes it the room being struck rather than a click over a drone.
      if (faust) return;
      gap.rate = 60 / Math.max(rpm, 1);
      clock.pump((at) => {
        excite(context, noise.white, knock, at, clank * 0.35 * (0.7 + load * 0.5), 0.004);
      }, gap, 'immediate');
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
      drive.disconnect();
      rumble.disconnect();
      rumbleGain.disconnect();
      knock.disconnect();
      faust?.dispose();
      faustOut.disconnect();
      nativeOut.disconnect();
      output.disconnect();
    },
  };
}
