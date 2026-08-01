import * as THREE from 'three';
import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { createNoiseBuffers } from '../noise';
import { Weather } from '../weather';
import { DEFAULT_AUDIO } from '../AudioEngine';

/**
 * Rendering a model offline, so it can be measured.
 *
 * `measure.ts` decides what the numbers mean and is pure arithmetic. This is
 * the other half: getting a model to actually produce a buffer without a
 * speaker, a frame loop or a player standing in front of it.
 *
 * It has to run in a browser and not in the check suite, and that is not a
 * convenience — `OfflineAudioContext` *is* the Web Audio implementation, and
 * the whole point of auditioning is to exercise the real biquads, the real
 * panner and the real worklets rather than a model of them. A reimplementation
 * in Node would measure the reimplementation.
 *
 * ## The problem this solves
 *
 * Almost every model in the library schedules events *ahead* on the audio
 * clock and is pumped once a frame from the game loop. Offline there is no
 * frame loop, and `startRendering()` is one call that runs the whole buffer —
 * so a naive render pumps the scheduler exactly once, gets a single lookahead
 * window of events, and returns 140 milliseconds of sound followed by silence.
 * Every texture in the library would measure as a fade-out.
 *
 * `OfflineAudioContext.suspend(when)` is the way out, and it is the reason
 * this is possible at all: rendering stops at a scheduled time, control comes
 * back on the main thread, and `resume()` carries on. Pumping the model at
 * each suspension is the offline equivalent of a frame, and it is *better* than
 * a frame — the steps are exact, so a texture rendered twice is identical
 * where the same model driven by `requestAnimationFrame` never is.
 *
 * ## Weather runs too
 *
 * The stand-in engine has its own `Weather`, advanced by the same steps. Two
 * models in the library — wind and foliage — do nothing interesting at a fixed
 * gust strength, and a measurement taken with the weather frozen at its
 * initial value would describe a model nobody will ever hear.
 */

/** Samples between pumps. A multiple of the 128-sample render quantum. */
const STEP_SAMPLES = 1024;

/**
 * Something that can be rendered and measured.
 *
 * `build` is handed a stand-in engine and returns a model. It does *not*
 * connect anything: where the output goes is the harness's business, and a
 * model that wired itself to a bus could not be measured in isolation.
 */
export interface Subject {
  name: string;
  /**
   * Continuous texture, or discrete events.
   *
   * Not a label — it decides which crest-factor band the row is judged
   * against, and the two are nearly disjoint. See `Audition.ts`.
   */
  kind?: 'texture' | 'event';
  /** How long to render. Long enough to contain the model's own rhythm. */
  seconds?: number;
  build(engine: AudioEngine): SoundModel;
  /**
   * Resolves when the model is fully assembled.
   *
   * For the one model that loads part of itself over the network. Without it
   * the render finishes before the wasm arrives and quietly measures the
   * fallback path — which is a real thing worth measuring and not the thing
   * the row claims to be.
   */
  ready?(model: SoundModel): Promise<unknown>;
}

/** Default render length. See `Subject.seconds`. */
export const DEFAULT_SECONDS = 6;

/**
 * Where a subject is deemed to stand.
 *
 * Wind-driven models now sample the gust field at their own position, because
 * the field travels. A bench has no geography, so everything is measured at
 * the origin — where the lag is zero and the field reads exactly what the
 * global `strength` used to. That keeps a rendered row comparable with the
 * baselines captured before the field became positional.
 */
const ORIGIN = new THREE.Vector3();

/**
 * A stand-in for `AudioEngine` around an offline context.
 *
 * Not an `AudioEngine`: that constructor opens a real `AudioContext`, listens
 * for gestures and renders impulse responses, none of which belongs in a
 * measurement. Models only ever touch `context`, `noise`, `weather` and — for
 * the two that connect themselves — `dry` and `send`, so those are what this
 * provides. The cast is narrow and deliberate, and it is checked by the fact
 * that adding a new field to `AudioEngine` and using it from a model would
 * fail here at runtime rather than silently measuring something else.
 */
function standIn(context: OfflineAudioContext, destination: AudioNode): AudioEngine {
  const engine = {
    context,
    settings: { ...DEFAULT_AUDIO },
    weather: new Weather(),
    noise: createNoiseBuffers(context),
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
 * Renders one subject to a mono buffer.
 *
 * Mono on purpose. Every measurement in `measure.ts` is about spectrum and
 * level, none of them is about width, and folding a stereo model down would
 * hide a channel imbalance rather than reveal one — so models are measured
 * before they reach a panner, where they are mono anyway.
 */
export async function render(
  subject: Subject,
  sampleRate = 48000,
): Promise<{ signal: Float32Array; model: SoundModel; rate: number }> {
  const seconds = subject.seconds ?? DEFAULT_SECONDS;
  const length = Math.ceil((seconds * sampleRate) / STEP_SAMPLES) * STEP_SAMPLES;
  const context = new OfflineAudioContext(1, length, sampleRate);

  const engine = standIn(context, context.destination);
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
