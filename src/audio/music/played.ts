import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { MODES, hz, type ModeName } from './theory';
import { melodyCell, type Cell } from './patterns';
import type { Instrument } from './instruments/voice';
import type { MusicVoice } from './director';
import { createStrings } from './instruments/strings';
import { createBrass } from './instruments/brass';
import { createFlute } from './instruments/flute';
import { createChoir } from './instruments/choir';
import { createBass } from './instruments/bass';
import { createBells } from './instruments/bell';
import { createPluck } from './instruments/pluck';
import { createGuitar } from './instruments/guitar';
import { createKick, createSnare, createHat } from './instruments/drums';

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

export type PlayedVoice = MusicVoice | 'kick' | 'snare' | 'hat';

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

/** Defaults throughout, for the sound stage's reason: a bench tuned to flatter each voice agrees with itself. */
function buildVoice(engine: AudioEngine, voice: PlayedVoice): Instrument {
  switch (voice) {
    case 'strings':
      return createStrings(engine);
    case 'brass':
      return createBrass(engine);
    case 'flute':
      return createFlute(engine);
    case 'choir':
      return createChoir(engine);
    case 'bass':
      return createBass(engine);
    case 'bells':
      return createBells(engine);
    case 'pluck':
      return createPluck(engine);
    case 'guitar':
      return createGuitar(engine);
    case 'kick':
      return createKick(engine);
    case 'snare':
      return createSnare(engine);
    case 'hat':
      return createHat(engine);
  }
}

export function createPlayed(engine: AudioEngine, options: PlayedOptions): SoundModel {
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
      voice.noteOn(
        engine.context.currentTime + 0.05,
        hz(root, cell[step++] + octave),
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
