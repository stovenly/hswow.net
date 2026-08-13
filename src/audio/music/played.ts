import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { MODES, justHz, type ModeName } from './theory';
import { melodyCell, type Cell } from './patterns';
import { buildVoice, type BenchVoice } from './instruments/build';

/**
 * An instrument being played, as a placeable sound model.
 *
 * The bridge between the director's world and the soundscape's. The director
 * is non-positional by design — a score is not *somewhere* — but an
 * instrument still has to be judged, and judging means walking up to it on a
 * stage the way every other model in the library is walked up to. This wraps
 * one voice and a seeded line as a standard `SoundModel`, so a zone can stand
 * it on a plinth with an ordinary emitter, and solo, occlusion and the voice
 * budget all come along free.
 *
 * The line is real material, not a test scale: cells from `patterns.ts`,
 * stated one note at a time with a breath between passes, each pass re-rolled
 * onto another of the seed's motifs. A fixed arpeggio would be easier to
 * write and would audition the wrong thing — what a zone actually gets is a
 * voice playing cells.
 */

export type PlayedVoice = BenchVoice;

export interface PlayedOptions {
  voice: PlayedVoice;
  /** The root the line stands on, in Hz. The kit folds it — see `drums.ts`. */
  root?: number;
  mode?: ModeName;
  /** Which motifs the line draws. One seed is one family of cells. */
  seed?: number;
  /** Semitones above (or below) the root the line is stated at. */
  octave?: number;
  /** Seconds between notes. */
  every?: number;
  gain?: number;
}

export function createPlayed(engine: AudioEngine, options: PlayedOptions): SoundModel {
  // Bench role: every default, so the stage flatters nothing.
  const voice = buildVoice(engine, options.voice);
  const output = engine.context.createGain();
  output.gain.value = options.gain ?? 0.5;
  voice.output.connect(output);

  const mode = MODES[options.mode ?? 'dorian'];
  const root = options.root ?? 146.83;
  const seed = options.seed ?? 1;
  const octave = options.octave ?? 0;
  const every = options.every ?? 1.6;

  let cell: Cell = melodyCell(seed, mode);
  let step = 0;
  let pass = 0;
  let next = 0.4;

  return {
    output,

    update(dt) {
      next -= dt;
      if (next > 0) return;
      if (step >= cell.length) {
        // The pass ends with a breath, then the next of the seed's motifs.
        pass += 1;
        cell = melodyCell(seed + (pass % 4), mode);
        step = 0;
        next = every * 2;
        return;
      }
      next = every;
      // The music path's tuning, so a station states what the score states.
      voice.noteOn(
        engine.context.currentTime + 0.05,
        justHz(root, cell[step++] + octave),
        0.45 + Math.random() * 0.4,
        every * 0.9,
      );
    },

    dispose() {
      voice.dispose();
      output.disconnect();
    },
  };
}
