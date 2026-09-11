import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise, type NoiseVoice } from '../noise';
import { createEventClock, poissonGap } from '../dsp/clock';
import { popBubble, bubbleRadius } from '../dsp/bubble';

/**
 * Falling water. Far off it is a roar with no events in it: pink noise
 * lowpassed near 800 Hz, level by how much water is falling. Close up the roar
 * gives way to what it is made of — a bright turbulence bed and a dense
 * population of small bubbles — crossfaded by the listener's distance, so the
 * fall is heard before it is seen and resolves into detail as you arrive.
 */

export interface CascadeOptions {
  gain?: number;
  /** Width × drop, square metres. Sets the roar's level and darkness. */
  size?: number;
  /** Below 1 is a bigger, darker fall. */
  tone?: number;
  /** Metres at which the close layer has fully replaced the roar. */
  near?: number;
}

export function createCascade(engine: AudioEngine, options: CascadeOptions = {}): SoundModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('cascade built before the noise buffers were ready');

  const size = Math.max(0.5, options.size ?? 4);
  const tone = (options.tone ?? 1) / Math.pow(size / 4, 0.2);
  const near = options.near ?? 6;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const roarFilter = context.createBiquadFilter();
  roarFilter.type = 'lowpass';
  roarFilter.frequency.value = 800 * tone;
  roarFilter.Q.value = 0.5;
  const roarGain = context.createGain();
  roarGain.gain.value = 0;
  const roar: NoiseVoice = playNoise(context, noise.pink, roarFilter);
  roarFilter.connect(roarGain).connect(output);

  const bedFilter = context.createBiquadFilter();
  bedFilter.type = 'bandpass';
  bedFilter.frequency.value = 1900 * tone;
  bedFilter.Q.value = 0.55;
  const bedGain = context.createGain();
  bedGain.gain.value = 0;
  const bed: NoiseVoice = playNoise(context, noise.white, bedFilter);
  bedFilter.connect(bedGain).connect(output);

  const bubbleBus = context.createGain();
  bubbleBus.gain.value = 0;
  const sparkle = context.createBiquadFilter();
  sparkle.type = 'highshelf';
  sparkle.frequency.value = 3000;
  sparkle.gain.value = -4;
  bubbleBus.connect(sparkle).connect(output);

  const clock = createEventClock(context);
  const popGap = poissonGap();
  const level = Math.min(1, 0.45 + Math.log2(size) * 0.12);
  let active = true;
  let closeness = 0;

  const pop = (at: number): void => {
    popBubble(context, bubbleBus, at, {
      radius: bubbleRadius(0.0005 / tone, 0.0035 / tone),
      level: 0.08 * (0.3 + Math.random() * 0.7),
      cycles: 13 * (0.75 + Math.random() * 0.5),
    });
  };

  return {
    output,
    setActive(next) {
      active = next;
      if (next) clock.reset();
    },
    update(_dt, engineNow, at) {
      if (!active) return;
      const now = context.currentTime;
      const distance = engineNow.listenerPosition.distanceTo(at);
      closeness = 1 - Math.min(1, Math.max(0, (distance - near * 0.4) / (near * 1.6)));
      roarGain.gain.setTargetAtTime(level * (1 - closeness * 0.6), now, 0.4);
      bedGain.gain.setTargetAtTime(level * 0.35 * closeness, now, 0.4);
      bubbleBus.gain.setTargetAtTime(closeness, now, 0.4);
      if (closeness < 0.05) {
        clock.reset();
        return;
      }
      popGap.rate = 160 * closeness * Math.min(2, Math.sqrt(size / 4));
      clock.pump(pop, popGap);
    },
    dispose() {
      roar.stop();
      bed.stop();
      roarGain.disconnect();
      bedGain.disconnect();
      bubbleBus.disconnect();
      sparkle.disconnect();
      output.disconnect();
    },
  };
}
