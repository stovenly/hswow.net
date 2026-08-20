/**
 * The client half of the voice: a score in, gestures posted, timings kept.
 *
 * Everything that decides *what is said* is above this (`audio/speech`), and
 * everything that decides *what a throat does about it* is below (`writer`,
 * then `processor.js` on the audio thread). This is the join: it owns the
 * node, turns a score into keys, posts them ahead on the audio clock, and
 * keeps `Utterance.units` on the main thread so the head and mouth have
 * something to move to.
 *
 * There is no second voice behind this one. If the worklet does not register,
 * `createVoice` hands back a stub that says nothing at all: a creature that
 * cannot speak must not take the world down with it.
 */

import type { AudioEngine } from '../AudioEngine';
import { greetScore, score, type Score, type Tune } from '../speech';
import type { Unit, Utterance, Voice, VoiceOptions } from './types';
import { babbleScore } from '../speech';
import { villagerBody } from './body';
import { identity, write } from './writer';
import { addThroat, dropThroat } from './tuning';
import processorUrl from './processor.js?url';

export type { Unit, Utterance, Voice, VoiceOptions } from './types';

/**
 * One module load per context, shared. `addModule` is idempotent but not free
 * and it is asynchronous, so calling it twice would race rather than queue.
 */
const registered = new WeakMap<BaseAudioContext, Promise<boolean>>();
const state = new WeakMap<BaseAudioContext, 'ready' | 'failed'>();

/**
 * Says so, across the top of the screen, when the throat does not load.
 *
 * With nothing behind it a failed `addModule` means the whole world is mute,
 * and it is silent about it: `?url` hands the file to `addModule` unparsed, so
 * neither `tsc` nor the bundler ever looks inside `processor.js` and a one-line
 * syntax error reads as "the change did nothing". So the failure is loud and it
 * stays on screen.
 */
function shout(error: unknown): void {
  if (typeof document === 'undefined') return;
  const bar = document.createElement('div');
  bar.style.cssText =
    'position:fixed;inset:0 0 auto 0;z-index:9999;background:#8b1a10;color:#fff;' +
    'font:600 13px/1.5 system-ui,sans-serif;padding:10px 14px;white-space:pre-wrap';
  bar.textContent =
    `voice worklet failed to load — NOBODY IN THE WORLD CAN SPEAK.\n${String(error)}`;
  document.body.appendChild(bar);
}

export function registerVoice(context: BaseAudioContext): Promise<boolean> {
  let pending = registered.get(context);
  if (!pending) {
    pending = (context as AudioContext).audioWorklet
      .addModule(processorUrl)
      .then(() => {
        state.set(context, 'ready');
        console.info('voice: throat ready');
        return true;
      })
      .catch((error: unknown) => {
        state.set(context, 'failed');
        console.error('voice: worklet did not load — nobody can speak', error);
        shout(error);
        return false;
      });
    registered.set(context, pending);
  }
  return pending;
}

/**
 * Whether a voice built now would be able to speak.
 *
 * `'waiting'` means the module has not landed yet — and a caller that builds
 * anyway gets a mute stub **and keeps it**, because a creature holds its voice
 * for life. Better to stay quiet for the millisecond the module takes.
 */
export function voiceState(context: BaseAudioContext): 'ready' | 'failed' | 'waiting' {
  return state.get(context) ?? 'waiting';
}

function hash(seed: number, n: number): number {
  const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** A villager's voice: the throat, or a stub that says nothing. */
export function createVoice(engine: AudioEngine, options: VoiceOptions = {}): Voice {
  if (voiceState(engine.context) !== 'ready') {
    console.warn('voice: built before the throat was ready — this one is mute for life');
    return mute(engine);
  }
  return createThroat(engine, options);
}

/** No throat. It takes up the same shape and makes no sound. */
function mute(engine: AudioEngine): Voice {
  const output = engine.context.createGain();
  output.gain.value = 0;
  const nothing = (text: string, at: number): Utterance => ({ text, at, end: at, units: [] });
  return {
    output,
    syllables: [],
    speaking: null,
    say: (text, at) => nothing(text, at),
    babble: (_kind, at) => nothing('', at),
    hush() {},
    fire: () => 0,
    dispose: () => output.disconnect(),
  };
}

function createThroat(engine: AudioEngine, options: VoiceOptions): Voice {
  const context = engine.context;
  const seed = options.seed ?? 1;
  const me = identity(seed, options.tone ?? 1, options.pitch ?? 250);
  const body = villagerBody(context.sampleRate, me.lengthCm, seed);

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const node = new AudioWorkletNode(context, 'voice-processor', {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [1],
    processorOptions: { body },
  });
  node.connect(output);
  addThroat(node);
  // A dead worklet is silent forever, so say so once rather than let a
  // villager quietly stop having a voice.
  node.onprocessorerror = () => console.warn('voice: processor died');

  let speaking: Utterance | null = null;
  let syllables: Unit[] = [];
  let turn = 0;

  // The throat says when it has rung down. That is the only thing it sends.
  node.port.onmessage = (event: MessageEvent) => {
    if ((event.data as { kind?: string }).kind === 'idle') speaking = null;
  };

  const perform = (sc: Score, at: number): Utterance => {
    const start = Math.max(at, context.currentTime + 0.08);
    // A gesture replaces the whole schedule, so this cuts off whatever was
    // being said by itself — the throat glides from where it is into the new
    // line rather than holding the note it was interrupted on.
    const written = write(sc, me, start);
    if (written.inhale > 0) {
      node.port.postMessage({ kind: 'inhale', at: start, depth: 0.6 + hash(seed, ++turn) * 0.3 });
    }
    node.port.postMessage({ kind: 'gesture', tracks: written.tracks });

    const utterance: Utterance = { text: sc.text, at: start, end: written.end, units: written.units };
    speaking = utterance;
    syllables = written.units;
    return utterance;
  };

  const voice: Voice = {
    output,
    get syllables() {
      return syllables;
    },
    get speaking() {
      return speaking;
    },

    say(text, at) {
      return perform(score(text), at);
    },

    babble(kind, at) {
      if (kind === 'greeting') return perform(greetScore(seed), at);
      const tune: Tune = hash(seed, ++turn) < 0.3 ? 'question' : 'statement';
      const count = 4 + Math.floor(hash(seed, ++turn) * 5);
      const salt = ++turn;
      let n = 0;
      return perform(babbleScore(count, tune, () => hash(seed, salt * 100 + n++)), at);
    },

    hush(at) {
      const t = Math.max(at, context.currentTime);
      node.port.postMessage({ kind: 'hush', at: t, over: 0.03 });
      if (speaking) syllables = speaking.units.filter((u) => u.at + u.length <= t);
      speaking = null;
    },

    fire(at, force) {
      const said = voice.babble(force > 0.7 ? 'talk' : 'greeting', at);
      return said.end - at + 0.3;
    },

    dispose() {
      node.port.postMessage({ kind: 'hush', at: context.currentTime, over: 0.02 });
      dropThroat(node);
      node.disconnect();
      node.port.onmessage = null;
      output.disconnect();
      speaking = null;
    },
  };
  return voice;
}
