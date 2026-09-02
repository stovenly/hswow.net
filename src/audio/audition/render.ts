import * as THREE from 'three';
import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { createNoiseBuffers } from '../noise';
import { awaitParticles } from '../particles/Particles';
import { Weather } from '../weather';
import { DEFAULT_AUDIO } from '../AudioEngine';

/**
 * Rendering a model offline, so `measure.ts` can put numbers on it.
 *
 * It runs in a browser rather than headlessly, and that is not a convenience:
 * `OfflineAudioContext` *is* the Web Audio implementation, and the point is to
 * exercise the real biquads, the real panner and the real worklets. A
 * reimplementation in Node would measure the reimplementation.
 *
 * Almost every model schedules events ahead on the audio clock and is pumped
 * once a frame. Offline there is no frame loop and `startRendering()` runs the
 * whole buffer in one call, so a naive render pumps the scheduler once and
 * returns one lookahead window of sound followed by silence.
 * `OfflineAudioContext.suspend(when)` is the way out: rendering stops at a
 * scheduled time, control comes back, and `resume()` carries on. Pumping at
 * each suspension is the offline equivalent of a frame, and a better one — the
 * steps are exact, so a texture rendered twice is identical.
 *
 * The stand-in engine has its own `Weather`, advanced by the same steps. Wind
 * and foliage do nothing interesting at a fixed gust strength.
 */

/** Samples between pumps. A multiple of the 128-sample render quantum. */
const STEP_SAMPLES = 1024;

/**
 * Something that can be rendered and measured. `build` is handed a stand-in
 * engine and returns a model; it does *not* connect anything, because a model
 * that wired itself to a bus could not be measured in isolation.
 */
export interface Subject {
  name: string;
  /**
   * Continuous texture, or discrete events. Not a label — it decides which
   * crest-factor band the row is judged against, and the two are nearly
   * disjoint.
   */
  kind?: 'texture' | 'event';
  /** How long to render. Long enough to contain the model's own rhythm. */
  seconds?: number;
  build(engine: AudioEngine): SoundModel;
  /**
   * Resolves when the model is fully assembled, for the models that load part
   * of themselves over the network. Without it the render finishes before the
   * wasm arrives and measures the fallback under the real model's name.
   */
  ready?(model: SoundModel): Promise<unknown>;
}

/** Default render length. See `Subject.seconds`. */
export const DEFAULT_SECONDS = 6;

/**
 * Where a subject is deemed to stand. Wind-driven models sample the gust field
 * at their own position, and a bench has no geography, so everything is
 * measured at the origin — where the lag is zero.
 */
const ORIGIN = new THREE.Vector3();

/**
 * A stand-in for `AudioEngine` around an offline context. Not an
 * `AudioEngine`: that constructor opens a real context, listens for gestures
 * and renders impulse responses, none of which belongs in a measurement.
 * Models only touch `context`, `noise`, `weather` and — for the two that
 * connect themselves — `dry` and `send`, so those are what this provides.
 */
async function standIn(context: OfflineAudioContext, destination: AudioNode): Promise<AudioEngine> {
  const engine = {
    context,
    settings: { ...DEFAULT_AUDIO },
    weather: new Weather(),
    noise: await createNoiseBuffers(context).then(async (noise) => {
      await awaitParticles(context, noise.white);
      return noise;
    }),
    // The two self-connecting models get a bus each. Both land in the same
    // place: a measurement of footsteps wants the reverb send included,
    // because that is what the player hears.
    dry: context.createGain(),
    send: context.createGain(),
    register: () => {},
    unregister: () => {},
  };
  engine.dry.connect(destination);
  engine.send.connect(destination);
  return engine as unknown as AudioEngine;
}

/**
 * Renders one subject to a mono buffer. Mono on purpose: every measurement in
 * `measure.ts` is about spectrum and level, and folding a stereo model down
 * would hide a channel imbalance rather than reveal one. Models are measured
 * before they reach a panner, where they are mono anyway.
 */
export async function render(
  subject: Subject,
  sampleRate = 48000,
): Promise<{ signal: Float32Array; model: SoundModel; rate: number }> {
  const seconds = subject.seconds ?? DEFAULT_SECONDS;
  const length = Math.ceil((seconds * sampleRate) / STEP_SAMPLES) * STEP_SAMPLES;
  const context = new OfflineAudioContext(1, length, sampleRate);

  const engine = await standIn(context, context.destination);
  const model = subject.build(engine);
  model.output.connect(context.destination);

  if (subject.ready) await subject.ready(model);

  // Every pump is scheduled *before* rendering starts. Calling `suspend` from
  // inside a suspension is legal and races with the render thread; queueing
  // them up front does not.
  const step = STEP_SAMPLES / sampleRate;
  const pumps = Math.floor(length / STEP_SAMPLES);
  for (let i = 1; i < pumps; i++) {
    void context.suspend((i * STEP_SAMPLES) / sampleRate).then(() => {
      engine.weather.update(step);
      model.update?.(step, engine, ORIGIN);
      void context.resume();
    });
  }

  // The first pump happens before any audio is rendered, so a model that
  // schedules its opening events from `currentTime` gets them at zero rather
  // than one step in.
  engine.weather.update(step);
  model.update?.(step, engine, ORIGIN);

  const rendered = await context.startRendering();
  return { signal: rendered.getChannelData(0), model, rate: sampleRate };
}
