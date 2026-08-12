import type { AudioEngine } from '../AudioEngine';
import { createEventClock, type EventClock, type Gap } from '../dsp/clock';
import {
  MODES,
  DRONE,
  hz,
  centreMoves,
  degreeToSemitone,
  semitoneToDegree,
  type ModeName,
} from './theory';
import { melodyCell, textureCell, type Cell } from './patterns';
import type { Instrument } from './instruments/voice';
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
 * The director — a scarcity system before it is a music system.
 *
 * One non-positional voice beside the beds, outside the emitter budget, with
 * its own gain into `dry` and `send`. A zone opts in by declaring
 * `ZoneEnvironment.music`; absent means silent. What plays is three strata —
 * low drone, mid ostinato, sparse high melody — and most of the time the
 * answer to "what now" is deliberately nothing: pieces run a few minutes,
 * the rests after them run longer, and every exit is by subtraction.
 *
 * All note material comes from the zone's seeds through `patterns.ts`, so a
 * zone's motifs recur on every visit without a bar of composed data. Timing
 * and the performance choices — which motif of the family, where the centre
 * steps — use `Math.random`, the same split `dsp/clock` already makes.
 */

export type MusicVoice =
  | 'strings'
  | 'brass'
  | 'flute'
  | 'choir'
  | 'bass'
  | 'bells'
  | 'pluck'
  | 'guitar';

/** Which instrument carries each stratum. Percussion is deliberately absent. */
export interface MusicPalette {
  drone: MusicVoice;
  texture: MusicVoice;
  melody: MusicVoice;
}

export interface MusicSpec {
  /** Drone fundamental, in Hz. Everything else stands on it. */
  root: number;
  mode: ModeName;
  palette: MusicPalette;
  /** Intensity is layer count, nothing else: 0 is drone alone, 1 is all three. */
  density: number;
  /** Felt pulse in BPM — the grammar says 50–70 — or null for pulse-free. */
  pulse: number | null;
  /**
   * The kit, for places that are machinery rather than weather. It rides the
   * felt pulse under the texture, enters after it and leaves before it, and
   * every stroke is a dice roll — the grammar keeps percussion out of calm
   * states, and out of anything resembling a metronome.
   */
  drums?: boolean;
  /** The zone's motifs. Every cell is re-rolled from seeds derived from this. */
  seed: number;
}

type Span = readonly [number, number];
const between = (span: Span): number => span[0] + Math.random() * (span[1] - span[0]);

// The scarcity numbers: a piece is minutes and the rest after it is longer,
// so the duty cycle sits well under half. Randomized, never a fixed timer.
const PIECE: Span = [75, 150];
const REST: Span = [160, 380];
/** The first scored zone ever entered does not wait out a full rest. */
const FIRST_WAIT: Span = [8, 20];

/** Drone notes overlap by a few seconds, so the pad never gaps. */
const DRONE_NOTE = 14;
const DRONE_GAP: Span = [9, 12];

const TEXTURE_OCTAVE = 12;
const MELODY_OCTAVE = 24;

/** The drone wants the slow front; the upper strata speak sooner. */
function createVoice(engine: AudioEngine, name: MusicVoice, role: 'drone' | 'upper'): Instrument {
  const slow = role === 'drone';
  switch (name) {
    case 'strings':
      return createStrings(engine, slow ? { attack: 2, release: 3 } : { attack: 0.4, release: 1.2 });
    case 'brass':
      return createBrass(engine, slow ? { attack: 0.8, release: 1.5 } : {});
    case 'flute':
      return createFlute(engine, slow ? { attack: 0.6, release: 1.2 } : {});
    case 'choir':
      return createChoir(engine, slow ? { release: 2 } : {});
    case 'bass':
      return createBass(engine, slow ? { release: 1.5 } : { release: 0.5, sweep: true });
    case 'bells':
      return createBells(engine, {});
    case 'pluck':
      return createPluck(engine, { gain: 0.3 });
    case 'guitar':
      return createGuitar(engine, {});
  }
}

interface Kit {
  readonly kick: Instrument;
  readonly snare: Instrument;
  readonly hat: Instrument;
}

/** A zone's three instruments and the fader its border crossfades ride. */
interface Rack {
  readonly drone: Instrument;
  readonly texture: Instrument;
  readonly melody: Instrument;
  /** Only where the spec declares `drums`. */
  readonly kit: Kit | null;
  readonly gain: GainNode;
}

export class MusicDirector {
  private readonly engine: AudioEngine;
  /** The options slider. Border fades live on each rack, not here. */
  private readonly out: GainNode;
  private readonly reverb: GainNode;

  /** One rack per spec, kept like soundscapes: built once, silenced often. */
  private readonly racks = new Map<MusicSpec, Rack>();
  private rack: Rack | null = null;
  private spec: MusicSpec | null = null;

  private readonly droneClock: EventClock;
  private readonly textureClock: EventClock;
  private readonly melodyClock: EventClock;
  private readonly beatClock: EventClock;

  private playing = false;
  /** When the next piece may begin. Infinity until a scored zone is entered. */
  private nextPiece = Infinity;
  private pieceStart = 0;
  private pieceEnd = 0;
  /** Each stratum's window inside the piece. Entries stagger; exits subtract. */
  private textureFrom = Infinity;
  private textureUntil = 0;
  private melodyFrom = Infinity;
  private melodyUntil = 0;
  private drumsFrom = Infinity;
  private drumsUntil = 0;
  /** Which beat of the bar the kit is on. */
  private beatAt = 0;

  /** The harmonic centre, as a mode degree. 0 is home; the drone stays there. */
  private centre = 0;
  private textureNotes: Cell = [];
  private textureAt = 0;
  /** When the harmony next moves — see `shiftHarmony`. */
  private nextShift = 0;

  /** 0 day, 1 night. Stubbed — nothing feeds it until the day/night cycle exists. */
  private night = 0;

  constructor(engine: AudioEngine) {
    this.engine = engine;
    const context = engine.context;

    this.out = context.createGain();
    this.out.gain.value = engine.settings.musicVolume;
    this.out.connect(engine.dry);

    // A generous send — the shared room is what blurs entries and exits.
    this.reverb = context.createGain();
    this.reverb.gain.value = 0.55;
    this.out.connect(this.reverb);
    this.reverb.connect(engine.send);

    this.droneClock = createEventClock(context);
    this.textureClock = createEventClock(context);
    this.melodyClock = createEventClock(context);
    this.beatClock = createEventClock(context);
  }

  /**
   * Follows the player across a border. A piece already playing keeps playing:
   * the old rack fades under the new one and the drone re-fires at the new
   * root, which is what makes a doorway a change of key rather than of track.
   */
  setZone(spec: MusicSpec | null): void {
    if (spec === this.spec) return;
    const now = this.engine.context.currentTime;

    if (this.rack) {
      // Scored to scored is a crossfade under a continuing piece. Scored to
      // unscored is *fast*: through a door the world changes at a cut, and
      // music that lingers into an unscored place reads as a leak — it was a
      // slow "walk out with the player" fade once, and that is exactly how
      // it read.
      this.rack.gain.gain.cancelScheduledValues(now);
      this.rack.gain.gain.setTargetAtTime(0, now, spec ? 0.9 : 0.35);
    }

    this.spec = spec;
    this.rack = spec ? this.rackFor(spec) : null;

    if (!spec || !this.rack) {
      // Unscored country ends the piece; the tails walk out with the player.
      if (this.playing) this.stopPiece(now);
      return;
    }

    this.rack.gain.gain.cancelScheduledValues(now);
    this.rack.gain.gain.setTargetAtTime(1, now, 0.6);

    this.droneClock.reset();
    this.textureClock.reset();
    this.melodyClock.reset();
    this.beatClock.reset();
    // A border resets the centre: the retune lands on the new root, home.
    this.shiftHarmony(now, 'home');

    if (!this.playing && this.nextPiece === Infinity) {
      this.nextPiece = now + between(FIRST_WAIT);
    }
  }

  /** Pumped every frame from the zone manager, beside the soundscape. */
  update(_dt: number): void {
    this.out.gain.value = this.engine.settings.musicVolume;
    if (!this.spec || !this.rack || !this.engine.started) return;
    const now = this.engine.context.currentTime;

    if (!this.playing) {
      if (now < this.nextPiece) return;
      this.startPiece(now);
    }
    if (now >= this.pieceEnd) {
      this.stopPiece(now);
      return;
    }

    this.droneClock.pump(this.fireDrone, this.droneGap);
    if (now >= this.textureFrom && now < this.textureUntil) {
      this.textureClock.pump(this.fireTexture, this.pulseGap, 'oneGap');
    }
    if (now >= this.drumsFrom && now < this.drumsUntil) {
      this.beatClock.pump(this.fireBeat, this.pulseGap, 'oneGap');
    }
    if (now >= this.melodyFrom && now < this.melodyUntil) {
      // 'immediate': a piece that earned a melody layer states at least one
      // phrase — the entry time is already randomized by the window itself.
      this.melodyClock.pump(this.firePhrase, this.melodyGap);
    }
  }

  /**
   * Day/night input: same seeds, softer touch, half-time texture.
   * Stubbed until a day/night cycle exists to feed it.
   */
  setNight(night: number): void {
    this.night = Math.min(Math.max(night, 0), 1);
  }

  /**
   * For the music stage's panel: a whole piece, now. Starts one (or restarts
   * the one playing) and pulls every entry into the first few seconds, so a
   * vibe can be judged in one sitting. The scarcity machine's own timings are
   * the design for *playing*; this is for *auditioning*, which is why the
   * compressed entries live here and nowhere near `startPiece`.
   */
  playNow(): void {
    if (!this.spec || !this.rack) return;
    const now = this.engine.context.currentTime;
    this.startPiece(now);
    this.textureFrom = now + between([1.5, 3]);
    this.drumsFrom = this.spec.drums ? now + between([4, 7]) : Infinity;
    this.melodyFrom = now + between([6, 10]);
  }

  /**
   * The panel's companion to `playNow`: end the piece, now. The rack fades at
   * the exit rate so scheduled tails do not ring on, and the scarcity
   * machine's ordinary rest follows — play is the way back sooner.
   */
  stopNow(): void {
    const now = this.engine.context.currentTime;
    if (this.playing) this.stopPiece(now);
    if (this.rack) {
      this.rack.gain.gain.cancelScheduledValues(now);
      this.rack.gain.gain.setTargetAtTime(0, now, 0.35);
    }
  }

  /** For the debug readout: what the scarcity machine thinks it is doing. */
  get status(): string {
    if (!this.spec) return 'unscored';
    const now = this.engine.context.currentTime;
    if (!this.playing) return `resting ${Math.max(0, this.nextPiece - now).toFixed(0)}s`;
    const layers = ['drone'];
    if (now >= this.textureFrom && now < this.textureUntil) layers.push('texture');
    if (now >= this.drumsFrom && now < this.drumsUntil) layers.push('drums');
    if (now >= this.melodyFrom && now < this.melodyUntil) layers.push('melody');
    return `${layers.join('+')} ${Math.max(0, this.pieceEnd - now).toFixed(0)}s`;
  }

  dispose(): void {
    for (const rack of this.racks.values()) {
      rack.drone.dispose();
      rack.texture.dispose();
      rack.melody.dispose();
      if (rack.kit) {
        rack.kit.kick.dispose();
        rack.kit.snare.dispose();
        rack.kit.hat.dispose();
      }
      rack.gain.disconnect();
    }
    this.racks.clear();
    this.rack = null;
    this.reverb.disconnect();
    this.out.disconnect();
  }

  // --- the piece ------------------------------------------------------------

  private startPiece(now: number): void {
    const spec = this.spec as MusicSpec;
    const rack = this.rack as Rack;
    this.playing = true;
    this.pieceStart = now;
    this.pieceEnd = now + between(PIECE);

    // The rack may still be silenced from a panel stop; a piece plays at full.
    rack.gain.gain.cancelScheduledValues(now);
    rack.gain.gain.setTargetAtTime(1, now, 0.3);

    // Density is a dice roll per piece, not a threshold: a sparse place
    // mostly drones and *rarely* states a phrase, instead of never. Melody
    // rolls only when the texture it stands on is there, so intensity is
    // still nothing but layer count, decided once per piece.
    const density = Math.min(Math.max(spec.density, 0), 1);
    const texture = Math.random() < Math.min(1, 0.25 + density);
    const melody = texture && Math.random() < density;
    const layers = 1 + (texture ? 1 : 0) + (melody ? 1 : 0);

    // Layers enter one at a time and leave in reverse order, so both ends of
    // the piece are successive subtraction rather than a cut.
    this.textureFrom = layers >= 2 ? now + between([6, 14]) : Infinity;
    this.textureUntil = this.pieceEnd - between([10, 22]);
    this.melodyFrom = layers >= 3 ? now + between([18, 35]) : Infinity;
    this.melodyUntil = this.pieceEnd - between([25, 40]);
    // The kit is inside the texture's window: rhythm arrives after the
    // ostinato it stands under, and is subtracted before it.
    this.drumsFrom = spec.drums && layers >= 2 ? now + between([12, 24]) : Infinity;
    this.drumsUntil = this.pieceEnd - between([14, 26]);
    this.beatAt = 0;

    this.droneClock.reset();
    this.textureClock.reset();
    this.melodyClock.reset();
    this.beatClock.reset();
    this.shiftHarmony(now, 'home');
  }

  private stopPiece(now: number): void {
    this.playing = false;
    this.nextPiece = now + between(REST);
  }

  private rackFor(spec: MusicSpec): Rack {
    let rack = this.racks.get(spec);
    if (!rack) {
      const gain = this.engine.context.createGain();
      gain.gain.value = 0;
      gain.connect(this.out);
      rack = {
        drone: createVoice(this.engine, spec.palette.drone, 'drone'),
        texture: createVoice(this.engine, spec.palette.texture, 'upper'),
        melody: createVoice(this.engine, spec.palette.melody, 'upper'),
        kit: spec.drums
          ? {
              kick: createKick(this.engine),
              snare: createSnare(this.engine),
              hat: createHat(this.engine),
            }
          : null,
        gain,
      };
      rack.drone.output.connect(gain);
      rack.texture.output.connect(gain);
      rack.melody.output.connect(gain);
      if (rack.kit) {
        rack.kit.kick.output.connect(gain);
        rack.kit.snare.output.connect(gain);
        rack.kit.hat.output.connect(gain);
      }
      this.racks.set(spec, rack);
    }
    return rack;
  }

  // --- the strata -------------------------------------------------------------

  private readonly droneGap: Gap = () => between(DRONE_GAP);
  /** The felt pulse, halved at night. The texture and the kit both ride it. */
  private readonly pulseGap: Gap = () => this.beat() * (this.night > 0.5 ? 2 : 1);
  private readonly melodyGap: Gap = () => between([18, 40]);

  /** The felt pulse, or a slow randomized one where the zone declares none. */
  private beat(): number {
    const pulse = this.spec?.pulse;
    return pulse ? 60 / pulse : between([2.4, 4]);
  }

  /**
   * Every stratum's touch at a moment: the piece-long swell — soft in, fullest
   * in the middle, soft out — under the night's hand. Velocity is brightness
   * in every voice, so this moves the tone and not merely the level.
   */
  private level(at: number): number {
    const length = this.pieceEnd - this.pieceStart;
    const p = length > 0 ? Math.min(Math.max((at - this.pieceStart) / length, 0), 1) : 1;
    return (0.65 + 0.35 * Math.sin(Math.PI * p)) * (1 - this.night * 0.3);
  }

  private readonly fireDrone = (at: number): void => {
    if (at >= this.pieceEnd || !this.spec || !this.rack) return;
    // Root and fifth, no third. The last note is shortened so its release
    // lands on the end of the piece instead of ringing past it.
    const duration = Math.min(DRONE_NOTE, this.pieceEnd - at);
    for (const interval of DRONE) {
      this.rack.drone.noteOn(at, hz(this.spec.root, interval), 0.32 * this.level(at), duration);
    }
  };

  private readonly fireTexture = (at: number): void => {
    if (!this.spec || !this.rack) return;
    if (at >= this.nextShift) this.shiftHarmony(at, 'move');
    const note = this.textureNotes[this.textureAt % this.textureNotes.length];
    this.textureAt++;
    const velocity = (0.34 + Math.random() * 0.1) * this.level(at);
    this.rack.texture.noteOn(at, hz(this.spec.root, note + TEXTURE_OCTAVE), velocity, this.beat() * 1.8);
  };

  /** A cell note re-stood on the current centre, in degree space — the scale lock holds by construction. */
  private onCentre(note: number): number {
    const mode = MODES[(this.spec as MusicSpec).mode];
    return degreeToSemitone(mode, semitoneToDegree(mode, note) + this.centre);
  }

  /**
   * The harmonic rhythm, made real: every 2–8 bars the centre steps to
   * another degree of the mode — the classic modal moves, weighted, never a
   * dominant — and the ostinato re-rolls onto one of the zone's motifs over
   * it. The drone pedals on through, so the move is colour against the pedal
   * rather than a cadence.
   */
  private shiftHarmony(at: number, to: 'home' | 'move'): void {
    const spec = this.spec as MusicSpec;
    const mode = MODES[spec.mode];
    if (to === 'home') {
      this.centre = 0;
    } else {
      const moves = centreMoves(mode).filter((degree) => degree !== this.centre);
      this.centre = moves[Math.floor(Math.random() * moves.length)];
    }
    const cell = textureCell(spec.seed + Math.floor(Math.random() * 4), mode);
    this.textureNotes = cell.map((note) => this.onCentre(note));
    this.textureAt = 0;
    this.nextShift = at + this.beat() * 4 * (2 + Math.floor(Math.random() * 7));
  }

  private readonly fireBeat = (at: number): void => {
    const spec = this.spec;
    const kit = this.rack?.kit;
    if (!spec || !kit) return;
    const beat = this.beatAt++ % 4;
    const level = this.level(at);
    // A kick that mostly keeps the one, a hat that mostly fills, a snare that
    // sometimes answers. Every "mostly" is a dice roll — a pattern that always
    // resolves is a metronome with extra steps.
    if (beat === 0 ? Math.random() < 0.9 : beat === 2 && Math.random() < 0.5) {
      kit.kick.noteOn(at, spec.root, 0.5 * level);
    }
    if (Math.random() < 0.6) {
      kit.hat.noteOn(at, spec.root, (0.16 + Math.random() * 0.1) * level);
    }
    if (beat === 3 && Math.random() < 0.4) {
      kit.snare.noteOn(at, spec.root, 0.3 * level);
    }
  };

  /**
   * Melody is an event: a statement and its answer, then nothing for a while.
   * The statement is a cell stood on the current centre; the answer is the
   * same shape moved to land on the pedal's root or fifth — a question that
   * colours with the chord, a resolution that agrees with the drone. Velocity
   * arcs across the whole phrase, and the register is free to drop an octave
   * between phrases, never inside one.
   */
  private readonly firePhrase = (at: number): void => {
    if (!this.spec || !this.rack) return;
    const spec = this.spec;
    const mode = MODES[spec.mode];
    const cell = melodyCell(spec.seed + 100 + Math.floor(Math.random() * 4), mode);
    const degrees = cell.map((note) => semitoneToDegree(mode, note));

    const statement = degrees.map((degree) => degree + this.centre);
    const target = Math.random() < 0.5 ? 0 : semitoneToDegree(mode, 7);
    const landing = target - degrees[degrees.length - 1];
    const answer = degrees.map((degree) => degree + landing);

    const octave = MELODY_OCTAVE - (Math.random() < 0.35 ? 12 : 0);
    const phrase = [...statement, ...answer];

    let t = at;
    for (let i = 0; i < phrase.length; i++) {
      const step = spec.pulse ? (60 / spec.pulse) * (Math.random() < 0.35 ? 2 : 1) : between([1.1, 2.2]);
      const arc = 0.7 + 0.3 * Math.sin((Math.PI * i) / Math.max(phrase.length - 1, 1));
      const velocity = (0.45 + Math.random() * 0.15) * arc * this.level(t);
      const last = i === phrase.length - 1;
      const note = degreeToSemitone(mode, phrase[i]) + octave;
      // The landing note is held — a resolution that rings instead of stopping.
      this.rack.melody.noteOn(t, hz(spec.root, note), velocity, step * (last ? 2.2 : 1.1));
      t += step;
      // The breath between the statement and its answer.
      if (i === statement.length - 1) t += step;
    }
  };
}
