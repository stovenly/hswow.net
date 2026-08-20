/**
 * What a voice is, to everything outside it. Declared here, with the throat,
 * so nothing has to reach into the worklet to know what an `Utterance` is.
 */

import type { OneShot } from '../Scatter';

export interface VoiceOptions {
  gain?: number;
  /** Tract length as a multiplier; below 1 is a bigger person, lower voice. */
  tone?: number;
  /** Base pitch, Hz. Around 250 is a small voice, 180 a larger one. */
  pitch?: number;
  /** Fixes the voice's character — rate, breath, flutter — so it is the same voice every time. */
  seed?: number;
  /** Which people this one speaks like. Absent is the countryside. */
  lect?: LectName;
  /** A named voice from `VOICES`, which brings its own lect and overrides the draw. */
  character?: string;
}

/** The peoples, by the name of how they talk. */
export type LectName = 'country' | 'city';

export interface Unit {
  /** Where the voice comes on, audio clock. */
  at: number;
  /** Seconds it is voiced. */
  length: number;
  /** Text range this unit reveals, end exclusive. */
  from: number;
  to: number;
  stress: number;
}

export interface Utterance {
  readonly text: string;
  readonly at: number;
  /** When the last unit is done — before its trailing pause. */
  readonly end: number;
  readonly units: readonly Unit[];
}

export interface Voice extends OneShot {
  /** Says a written line: for a dialogue box, when there is one. */
  say(text: string, at: number): Utterance;
  /** Says nothing in particular: a short greeting, or a run of talk. */
  babble(kind: 'greeting' | 'talk', at: number): Utterance;
  /** Cuts whatever is being said, from `at`. */
  hush(at: number): void;
  readonly speaking: Utterance | null;
}
