import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise, type NoiseVoice } from '../noise';

/**
 * Wind, as three layers.
 *
 * Wind has no sound of its own — what you hear is air dragged past edges, and
 * the size of the edge sets the pitch. So: brown noise through a lowpass for
 * the body of moving air, pink through a mid bandpass for the rush past large
 * surfaces, white through a narrow high bandpass for the whistle round small
 * ones.
 *
 * The whistle is where the realism lives. Its centre frequency and its Q both
 * rise with wind speed, because faster air past the same edge sheds vortices
 * faster and more coherently. Wind that only gets *louder* in a gust sounds
 * like someone turning a knob; wind that gets louder and higher and more
 * focused sounds like weather.
 */

const RUMBLE_HZ = 220;
const RUSH_HZ = 560;
const RUSH_Q = 1.4;
const WHISTLE_MIN_HZ = 1300;
const WHISTLE_MAX_HZ = 2900;
/**
 * Q range for the whistle.
 *
 * Kept low. A high-Q bandpass on white noise is a *ringing* narrow band, and
 * past about Q 12 it stops sounding like air over an edge and starts sounding
 * like feedback — which is most of where "harsh" comes from in a wind model.
 */
const WHISTLE_MIN_Q = 4;
const WHISTLE_MAX_Q = 9;

export interface WindOptions {
  /** Overall level. */
  gain?: number;
  /** Scales the whistle layer, which is the one that gets shrill indoors. */
  whistle?: number;
  /**
   * Lowpass over the whole model, in Hz.
   *
   * Real wind reaching your ear has already been filtered by everything it
   * travelled past, and by your own head and outer ear. Synthesised wind has
   * not, so it arrives with a top end nothing in nature would deliver — bright,
   * flat and fatiguing. This is the single most effective softness control.
   */
  tone?: number;
}

export interface WindModel extends SoundModel {
  /** Live tone control, in Hz. Lower is softer and further away. */
  setTone(hz: number): void;
}

export function createWind(engine: AudioEngine, options: WindOptions = {}): WindModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('wind model built before the noise buffers were ready');

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // Everything lands here first, so the tone control shapes all three layers
  // together rather than each of them fighting the others.
  const tone = context.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = options.tone ?? 3400;
  tone.Q.value = 0.4;

  // A gentle shelf under the lowpass: takes the sting out of the 2–5 kHz
  // region the ear is most sensitive to without dulling the whole thing.
  const soften = context.createBiquadFilter();
  soften.type = 'highshelf';
  soften.frequency.value = 2200;
  soften.gain.value = -7;

  tone.connect(soften).connect(output);

  const rumbleGain = context.createGain();
  const rushGain = context.createGain();
  const whistleGain = context.createGain();

  const rumble = context.createBiquadFilter();
  rumble.type = 'lowpass';
  rumble.frequency.value = RUMBLE_HZ;

  const rush = context.createBiquadFilter();
  rush.type = 'bandpass';
  rush.frequency.value = RUSH_HZ;
  rush.Q.value = RUSH_Q;

  const whistle = context.createBiquadFilter();
  whistle.type = 'bandpass';
  whistle.frequency.value = WHISTLE_MIN_HZ;
  whistle.Q.value = WHISTLE_MIN_Q;

  const voices: NoiseVoice[] = [
    playNoise(context, noise.brown, rumble),
    playNoise(context, noise.pink, rush),
    playNoise(context, noise.white, whistle),
  ];

  rumble.connect(rumbleGain).connect(tone);
  rush.connect(rushGain).connect(tone);
  whistle.connect(whistleGain).connect(tone);

  const whistleScale = options.whistle ?? 1;

  return {
    output,

    setTone(hz) {
      tone.frequency.setTargetAtTime(hz, context.currentTime, 0.1);
    },

    update(_dt, audio) {
      const strength = audio.weather.strength;
      const now = context.currentTime;
      // Every move is a glide. Wind changes continuously; stepping any of
      // these per frame would put a 60 Hz buzz under the whole thing.
      const glide = 0.09;

      // The rumble is nearly always there — it is the body of the air, and it
      // barely responds to gusting. Carrying more of the level than the bands
      // above is also what keeps the whole thing soft: weight low, not bright.
      rumbleGain.gain.setTargetAtTime(0.55 + strength * 0.45, now, glide);
      rushGain.gain.setTargetAtTime(0.12 + strength * strength * 0.5, now, glide);
      whistleGain.gain.setTargetAtTime(strength ** 3 * 0.22 * whistleScale, now, glide);

      // Cubed above, because the whistle should be absent in light air and
      // then arrive suddenly — that threshold is most of what makes a gust
      // feel like a gust rather than a fade.
      whistle.frequency.setTargetAtTime(
        WHISTLE_MIN_HZ + (WHISTLE_MAX_HZ - WHISTLE_MIN_HZ) * strength,
        now,
        glide,
      );
      whistle.Q.setTargetAtTime(
        WHISTLE_MIN_Q + (WHISTLE_MAX_Q - WHISTLE_MIN_Q) * strength,
        now,
        glide,
      );
    },

    dispose() {
      for (const voice of voices) voice.stop();
      output.disconnect();
    },
  };
}
