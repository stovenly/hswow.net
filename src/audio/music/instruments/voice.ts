import type { SoundModel } from '../../Emitter';

/**
 * The voice contract — what a musical instrument is, over the model contract.
 *
 * An instrument is a `SoundModel` that can be told to play a note at an exact
 * audio-clock time. The scheduling always happens here on the TypeScript side,
 * never inside a worklet: parameters messaged to Faust land on a render-quantum
 * boundary, which is inaudible on a pad swell and ruinous on a beat grid, and
 * native nodes place an onset sample-accurately for free.
 *
 * ## Humanization is the contract, not a nicety
 *
 * What makes a synth read as fake is stasis, not synthesis. So the jitter is
 * applied *inside* every instrument's `noteOn`, by the helpers below, and the
 * director upstream schedules clean idealised notes. Putting it here means no
 * instrument can forget it, and no caller can double it.
 */

export interface Instrument extends SoundModel {
  /**
   * Schedules one note.
   *
   * @param at Audio-clock time. Must be in the future — this schedules, it
   *   does not play. The director's lookahead guarantees that.
   * @param freq Fundamental in Hz, before humanization.
   * @param velocity 0..1. Level *and* brightness — a harder note is a brighter
   *   note everywhere, because that is what more energy does to a real one.
   * @param duration Sounding length in seconds, for the sustained families.
   *   Struck and plucked things ring for their own time and ignore it.
   */
  noteOn(at: number, freq: number, velocity: number, duration?: number): void;
}

export interface HumanNote {
  at: number;
  freq: number;
  velocity: number;
}

/**
 * One note's worth of imperfection: ±15 ms of timing, ±5 cents of pitch,
 * ±15 % of velocity. Every `noteOn` runs its inputs through this first.
 *
 * The timing jitter can move a note *earlier*, so the result is clamped to
 * just past now — a scheduler running close to the wire loses a little jitter
 * rather than throwing.
 */
export function human(
  context: BaseAudioContext,
  at: number,
  freq: number,
  velocity: number,
): HumanNote {
  const cents = (Math.random() * 2 - 1) * 5;
  return {
    at: Math.max(at + (Math.random() * 2 - 1) * 0.015, context.currentTime + 0.002),
    freq: freq * 2 ** (cents / 1200),
    velocity: Math.min(1, Math.max(0.05, velocity * (1 + (Math.random() * 2 - 1) * 0.15))),
  };
}

/**
 * Vibrato that arrives late, onto any `AudioParam`.
 *
 * A player settles onto a note and *then* leans into it: the depth builds from
 * nothing over 0.3–1 s, and the rate differs a few percent from every other
 * note's. Vibrato that starts at full depth on the first sample is the single
 * fastest way to sound like a test tone. Notes too short to develop any get
 * none, which is also what a player does.
 *
 * Self-terminating — the LFO stops itself just after `until`.
 */
export function vibrato(
  context: BaseAudioContext,
  param: AudioParam,
  at: number,
  until: number,
  depth: number,
  rate = 5.5,
): void {
  if (until - at < 0.35) return;

  const osc = context.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = rate * (1 + (Math.random() * 2 - 1) * 0.06);

  const swell = context.createGain();
  swell.gain.setValueAtTime(0, at);
  swell.gain.linearRampToValueAtTime(depth, at + 0.3 + Math.random() * 0.7);

  osc.connect(swell);
  swell.connect(param);
  osc.start(at);
  osc.stop(until + 0.05);
}

/**
 * A sustained note's envelope: smooth approach, hold, smooth release.
 *
 * `setTargetAtTime` both ways, so there is no corner anywhere — an exponential
 * approach never quite arrives and never quite leaves, which is exactly how a
 * bowed or blown note behaves and why a linear attack meeting its peak reads
 * as a click however slow it is.
 *
 * @returns The time the note's oscillators can safely stop.
 */
export function hold(
  gain: AudioParam,
  at: number,
  peak: number,
  attack: number,
  until: number,
  release: number,
): number {
  gain.setValueAtTime(0, at);
  gain.setTargetAtTime(peak, at, attack / 3);
  const off = Math.max(until, at + attack);
  gain.setTargetAtTime(0, off, release / 3);
  return off + release * 1.5 + 0.1;
}
