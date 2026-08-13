import type { AudioEngine } from '../AudioEngine';
import { createEventClock, type EventClock, type Gap } from '../dsp/clock';
import { createTicker, type Ticker } from '../dsp/ticker';
import { createRng, type Rng } from '../../art/random';
import {
  MODES,
  NEIGHBOURS,
  justHz,
  inMode,
  degreeToSemitone,
  semitoneToDegree,
  type Mode,
  type ModeName,
} from './theory';
import {
  textureCell,
  texturePool,
  motifHead,
  periodFrom,
  applyOp,
  type Cell,
  type MotifOp,
} from './patterns';
import { GROUNDS, groundFor, cadenceApproach, type Ground } from './harmony';
import {
  BAR_BEATS,
  rhythmCell,
  subdivide,
  mutateOstinato,
  type RhythmCell,
  type RhythmStep,
  type GaitName,
} from './rhythm';
import { ritardCurve, phraseArch, SECTION_END_V, FINAL_V } from './tempo';
import type { Instrument } from './instruments/voice';
import { buildVoice } from './instruments/build';
import { createKick, createSnare, createHat } from './instruments/drums';

/**
 * The director — a scarcity system before it is a music system.
 *
 * One non-positional voice beside the beds, outside the emitter budget, with
 * its own gain into `dry` and `send`. A zone opts in by declaring
 * `ZoneEnvironment.music`; absent means silent. Most of the time the answer
 * to "what now" is deliberately nothing: pieces run a few minutes, the rests
 * after them run longer, and every exit is by subtraction.
 *
 * Inside a piece, structure comes from scheduling, not from note choice —
 * and all of the scheduling comes from **one clock**. The bar clock is the
 * only clock: each bar, `fireBar` places everything the bar contains — the
 * chord and its drone, the texture figure with its downbeat on the downbeat,
 * the kit's four beats, and any melody statement that has come due, started
 * on the bar line. Chord changes and figure changes agree by construction,
 * and drift and ritard stretch every part identically because every part is
 * placed from the same bar length. The parts play together because there is
 * only one "when".
 *
 * What distinguishes the places is each vibe's `character`: register, gait,
 * harmonic pace, phrase habit, level. The form machinery is shared; the
 * fingerprints are not.
 *
 * All note material still comes from the zone's seeds through `patterns.ts`
 * and `harmony.ts`, so a zone's motifs and its ground recur on every visit.
 * Timing and the performance choices use `Math.random`, the same split
 * `dsp/clock` already makes.
 */

export type MusicVoice =
  | 'strings'
  | 'brass'
  | 'trumpet'
  | 'tuba'
  | 'flute'
  | 'ocarina'
  | 'choir'
  | 'monks'
  | 'accordion'
  | 'organ'
  | 'bass'
  | 'bells'
  | 'chimes'
  | 'musicbox'
  | 'kalimba'
  | 'tonguedrum'
  | 'marimba'
  | 'pluck'
  | 'harp'
  | 'dulcimer'
  | 'guitar'
  // Phase 6i: rust, concrete and cold water.
  | 'anvil'
  | 'oildrum'
  | 'vibraphone'
  | 'glass'
  | 'hum'
  | 'pipe'
  // Phase 6j: the performers.
  | 'fiddle'
  | 'gurdy'
  | 'saw'
  | 'harmonica'
  | 'deepdrum'
  // Phase 6l: the back of the wagon.
  | 'viol'
  | 'whistler'
  | 'banjo'
  | 'jawharp'
  | 'waterphone';

/**
 * Which instrument carries each stratum. The alternates are the band's other
 * hands: a piece may pick them per seed, and a restatement may — not must —
 * re-orchestrate onto them. Percussion is deliberately absent.
 */
export interface MusicPalette {
  drone: MusicVoice;
  texture: MusicVoice;
  melody: MusicVoice;
  altTexture?: MusicVoice;
  altMelody?: MusicVoice;
}

export type Span = readonly [number, number];

/**
 * A vibe's fingerprint — everything behavioural the nine places do NOT
 * share. The form machinery is common property; where a place sits, how it
 * walks, how fast it thinks and how much it says are the place's own.
 */
export interface MusicCharacter {
  /** Semitones above the root where the ostinato sits. */
  textureOctave: number;
  /** Semitones above the root where phrases sit; tension may lift, dice may drop. */
  melodyOctave: number;
  /** The rhythm cells this vibe may own — its gait. Ignored when pulse-free. */
  gait: readonly GaitName[];
  /** Bars a chord holds: 1 rocks, 2–4 drifts. */
  chordBars: number;
  /** Rest between melody statements, in seconds. */
  phraseRest: Span;
  /** Chance a statement is only the motif's closing fragment. */
  fragment: number;
  /** The vibe's own fader, under the master trim — interiors sit low. */
  level: number;
  /** The drone's seat in the mix — the one layer that never stops earns its own trim. */
  droneLevel: number;
}

export interface MusicSpec {
  /** Drone fundamental, in Hz. Everything else stands on it. */
  root: number;
  mode: ModeName;
  palette: MusicPalette;
  character: MusicCharacter;
  /**
   * How much the melody speaks. Every piece has one; this leans the rest
   * between statements toward the short end of `phraseRest`. 1 is talkative,
   * 0 is as still as the vibe's own span allows.
   */
  density: number;
  /** Felt pulse as a BPM span — each piece rolls its own — or null for pulse-free. */
  pulse: Span | null;
  /**
   * The kit, for places that are machinery rather than weather. It arrives
   * only where the section arc peaks, under the texture, and every stroke is
   * a dice roll — the grammar keeps percussion out of calm states, and out of
   * anything resembling a metronome.
   */
  drums?: boolean;
  /** The zone's motifs. Ground, cells and heads all re-roll from this. */
  seed: number;
}

const between = (span: Span): number => span[0] + Math.random() * (span[1] - span[0]);

// The scarcity numbers: a piece is minutes and the rest after it is longer,
// so the duty cycle sits well under half. Randomized, never a fixed timer.
const PIECE: Span = [75, 150];
const REST: Span = [160, 380];
/** The first scored zone ever entered does not wait out a full rest. */
const FIRST_WAIT: Span = [8, 20];

/** Bar length where no pulse exists — harmony breathes instead of counting. */
const BREATH_BAR: Span = [8, 13];

/** Chance a due pad refresh is skipped so the drone breathes out for a bar. */
const DRONE_BREATH = 0.3;

/** The whole score sits below the world, by the owner's ear. */
const MUSIC_TRIM = 0.76;

/**
 * How often the bar clock is pumped, in milliseconds.
 *
 * Well under the clock's lookahead, so the window is topped up many times over
 * before it could run dry. It is not a frame rate — nothing here is drawn.
 */
const PUMP_MS = 50;

/** Half-time for the night: adjacent steps merge, half the notes, same bar. */
const halveFigure = (cell: RhythmCell): RhythmCell => {
  const out: RhythmStep[] = [];
  for (let i = 0; i < cell.length; i += 2) {
    out.push({ beats: cell[i].beats + (cell[i + 1]?.beats ?? 0), accent: cell[i].accent });
  }
  return out;
};

/** A piece's form: a run of sections, each with a place on the tension arc. */
interface Section {
  kind: 'A' | 'B';
  fromBar: number;
  bars: number;
  /** 0–1 along low → peak (~2/3 in) → resolve. Spent as register, subdivision and layers. */
  tension: number;
}

interface Kit {
  readonly kick: Instrument;
  readonly snare: Instrument;
  readonly hat: Instrument;
}

/** A zone's instruments and the fader its border crossfades ride. */
interface Rack {
  readonly drone: Instrument;
  readonly texture: Instrument;
  readonly melody: Instrument;
  readonly altTexture: Instrument | null;
  readonly altMelody: Instrument | null;
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

  /** The only clock. Every part of every bar is placed from it. */
  private readonly barClock: EventClock;
  /** What pumps it. Not the frame loop — see `dsp/ticker.ts`. */
  private readonly ticker: Ticker;

  private playing = false;
  /** When the next piece may begin. Infinity until a scored zone is entered. */
  private nextPiece = Infinity;
  private pieceStart = 0;
  private pieceEnd = 0;
  /** Nominal length, for the swell — the ritard stretches the real end past it. */
  private pieceSpan = 0;

  // --- the form, laid out per piece -----------------------------------------
  private sections: Section[] = [];
  private sectionAt = 0;
  private totalBars = 0;
  private barIndex = 0;
  /** Per-piece performance dice — seeded from nothing, unlike the material. */
  private dice: Rng = createRng(1);

  // --- tempo -----------------------------------------------------------------
  /** Seconds per beat, rolled per piece from the vibe's span. 0 is pulse-free. */
  private beatSec = 0;
  /** The section's hand on the tempo, ±3–5%. */
  private drift = 1;
  private finalV = 0.6;
  /** Set by `fireBar`, read by the gap — one roll of the breath bar, not two. */
  private currentBarLen = 4;

  // --- harmony ----------------------------------------------------------------
  private ground: Ground = [0];
  private awayGround: Ground = [0];
  private borrowBar = -1;
  /** The chord of the bar, as a mode degree. The upper strata stand on it. */
  private chordDegree = 0;
  /** Last bar's chord, so the texture can suspend over a change. */
  private lastChordDegree = 0;
  /** The sounding mode. The spec's, except where a bridge steps to a neighbour. */
  private mode: ModeName = 'dorian';
  private dronePc = NaN;
  private droneFiredAt = -Infinity;

  // --- the strata's material ---------------------------------------------------
  private cell: RhythmCell = [];
  private cellRepeats = 0;
  private nextMutation = 4;
  private ostinato: Cell = [];
  private ostinatoAt = 0;
  private head: readonly number[] = [];
  private op: MotifOp = 'plain';
  private augment = false;
  private phraseUntil = 0;
  private melodyDueAt = 0;
  /** Statements this piece. The first is always plain; later ones decorate. */
  private statements = 0;

  // --- who plays ---------------------------------------------------------------
  private earnedTexture = false;
  private earnedMelody = false;
  private earnedDrums = false;
  private textureFromBar = 0;
  private melodyFromBar = 0;
  /** Where each stratum leaves. Counted from the end in seconds, not bars. */
  private textureUntilBar = 0;
  private melodyUntilBar = 0;
  private textureActive = false;
  private melodyActive = false;
  private drumsActive = false;
  private texAlt = false;
  private melAlt = false;
  private pieceTexAlt = false;
  private pieceMelAlt = false;

  /** 0 day, 1 night. Stubbed — nothing feeds it until the day/night cycle exists. */
  private night = 0;

  constructor(engine: AudioEngine) {
    this.engine = engine;
    const context = engine.context;

    this.out = context.createGain();
    this.out.gain.value = engine.settings.musicVolume * MUSIC_TRIM;
    this.out.connect(engine.dry);

    // A generous send — the shared room is what blurs entries and exits.
    this.reverb = context.createGain();
    this.reverb.gain.value = 0.55;
    this.out.connect(this.reverb);
    this.reverb.connect(engine.send);

    this.barClock = createEventClock(context);
    this.ticker = createTicker(PUMP_MS, this.pump);
  }

  /**
   * Follows the player across a border. A piece already playing keeps playing:
   * the old rack fades under the new one, the composition re-rolls onto the
   * new zone's seeds at the same bar of the same form, and the drone re-fires
   * at the new root — a doorway is a change of key, not of track.
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
    this.rack.gain.gain.setTargetAtTime(spec.character.level, now, 0.6);

    if (this.playing) this.recompose(spec);
    this.barClock.reset();

    if (!this.playing && this.nextPiece === Infinity) {
      this.nextPiece = now + between(FIRST_WAIT);
    }
  }

  /**
   * Pumped from a worker timer, not from the frame loop.
   *
   * Nothing below reads frame state — every decision here is made against
   * `context.currentTime` — so a late frame was never a reason for a bar to be
   * late, and under a contended GPU it constantly was.
   */
  private readonly pump = (): void => {
    this.out.gain.value = this.engine.settings.musicVolume * MUSIC_TRIM;
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

    this.barClock.pump(this.fireBar, this.barGap);
  };

  /**
   * Day/night input. Night inverts instead of reducing: same seeds, same
   * motifs, the other half of the vocabulary — the alternates become the
   * usual draw, the registers flip, some answers go unsaid, the drone
   * breathes out more, and the touch softens only a little. Stubbed until a
   * day/night cycle exists to feed it.
   */
  setNight(night: number): void {
    this.night = Math.min(Math.max(night, 0), 1);
  }

  /**
   * For the music stage's panel: a whole piece, now. Starts one (or restarts
   * the one playing) with every layer earned and the entries pulled into the
   * first bars, so a vibe can be judged in one sitting. The scarcity
   * machine's own dice are the design for *playing*; this is for
   * *auditioning*, which is why the compression lives here and nowhere near
   * `startPiece`'s ordinary path.
   */
  playNow(): void {
    if (!this.spec || !this.rack) return;
    this.startPiece(this.engine.context.currentTime, true);
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

  /** For the debug readout: what the machine thinks it is doing. */
  get status(): string {
    if (!this.spec) return 'unscored';
    const now = this.engine.context.currentTime;
    if (!this.playing) return `resting ${Math.max(0, this.nextPiece - now).toFixed(0)}s`;
    const layers = ['drone'];
    if (this.textureActive) layers.push('texture');
    if (this.drumsActive) layers.push('drums');
    if (this.melodyActive) layers.push('melody');
    const section = this.sections[this.sectionAt];
    const remaining = Math.max(0, this.pieceStart + this.pieceSpan - now);
    return `${layers.join('+')} ${section?.kind ?? '?'}${this.sectionAt} ${remaining.toFixed(0)}s`;
  }

  dispose(): void {
    this.ticker.stop();
    for (const rack of this.racks.values()) {
      rack.drone.dispose();
      rack.texture.dispose();
      rack.melody.dispose();
      rack.altTexture?.dispose();
      rack.altMelody?.dispose();
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

  private startPiece(now: number, audition = false): void {
    const spec = this.spec as MusicSpec;
    const rack = this.rack as Rack;
    this.playing = true;
    this.pieceStart = now;
    this.barIndex = 0;
    this.sectionAt = -1;
    this.dice = createRng(Math.floor(Math.random() * 0x7fffffff));

    // The rack may still be silenced from a panel stop; a piece plays at full.
    rack.gain.gain.cancelScheduledValues(now);
    rack.gain.gain.setTargetAtTime(spec.character.level, now, 0.3);

    // Tempo first — the form is counted in bars and a bar is made of it.
    this.beatSec = spec.pulse ? 60 / between(spec.pulse) : 0;
    this.finalV = between(FINAL_V);
    const barSec = spec.pulse
      ? this.beatSec * BAR_BEATS
      : (BREATH_BAR[0] + BREATH_BAR[1]) / 2;
    const target = between(PIECE);
    this.totalBars = Math.max(6, Math.round(target / barSec));
    this.pieceSpan = this.totalBars * barSec;
    // The ritard stretches the true end past the nominal one; the final bar
    // sets the real value when it fires. This is only the net under it.
    this.pieceEnd = now + this.pieceSpan + 30;
    this.sections = this.buildSections(this.totalBars);

    this.composeFor(spec);

    // One bar may borrow a chord from outside the mode — the single emotional
    // event, seeded rare, never at an edge and never in the bridge.
    this.borrowBar = -1;
    if (this.dice.chance(0.55)) {
      const home = this.sections.filter((s) => s.kind === 'A' && s.bars > 3);
      if (home.length > 0) {
        const section = this.dice.pick(home);
        this.borrowBar = section.fromBar + this.dice.int(1, section.bars - 3);
      }
    }

    // A piece is more than its pad. Every piece gets all three strata: this
    // was a dice roll on whether the melody existed at all, and a losing roll
    // meant two minutes of pad and scattered texture — which is a broken pad,
    // not a sparse place. Sparseness lives in the rests between pieces and in
    // how often the melody speaks, never in a stratum missing.
    this.earnedTexture = true;
    this.earnedMelody = true;
    this.earnedDrums = spec.drums ?? false;

    // Growth is Sweden's: one voice in at a time, exits by subtraction — but
    // both edges are counted in SECONDS and converted, never in bars. A breath
    // bar is ten seconds and a pulse-free piece is seven of them, so "the
    // melody arrives with the second section, texture leaves two bars early"
    // spent half a minute at each end on bare pad. What the ear is owed is a
    // short intro and a short outro, whatever the bar happens to be worth.
    // A breath bar is ten seconds, so a pulse-free piece concedes no intro at
    // all: the texture is in from the downbeat and the growth is the melody.
    const inBars = (seconds: number) => Math.max(1, Math.round(seconds / barSec));
    this.textureFromBar = audition || this.beatSec === 0 ? 0 : inBars(2 + this.dice() * 4);
    this.melodyFromBar = audition ? 1 : inBars(6 + this.dice() * 8);
    this.textureUntilBar = this.totalBars - inBars(this.beatSec === 0 ? 4 : 5);
    this.melodyUntilBar = this.totalBars - inBars(this.beatSec === 0 ? 8 : 9);

    // Per-piece orchestration: the alternates get a turn by seedless dice.
    // At night the dice flip — the other hands become the usual draw and the
    // primaries the exception.
    this.pieceTexAlt = rack.altTexture !== null && this.dice.chance(0.3 + this.night * 0.45);
    this.pieceMelAlt = rack.altMelody !== null && this.dice.chance(this.night * 0.75);
    this.texAlt = this.pieceTexAlt;
    this.melAlt = this.pieceMelAlt;

    this.phraseUntil = 0;
    this.melodyDueAt = 0;
    this.statements = 0;
    this.textureActive = false;
    this.melodyActive = false;
    this.drumsActive = false;

    this.barClock.reset();
  }

  /**
   * The zone's composed material — everything that stands on the spec's
   * seeds. Split out so a border crossing can re-roll it onto the new zone
   * mid-piece without touching the form's position.
   */
  private composeFor(spec: MusicSpec): void {
    this.ground = groundFor(spec.seed * 31 + this.dice.int(0, 3), spec.mode, 'home');
    this.awayGround = groundFor(spec.seed * 31 + 7 + this.dice.int(0, 3), spec.mode, 'away');
    this.chordDegree = 0;
    this.lastChordDegree = 0;
    this.mode = spec.mode;
    this.dronePc = NaN;
    this.droneFiredAt = -Infinity;

    const mode = MODES[spec.mode];
    this.head = motifHead(spec.seed + 100 + this.dice.int(0, 3), mode);
    this.ostinato = textureCell(spec.seed + this.dice.int(0, 3), mode);
    this.ostinatoAt = 0;
    this.cellRepeats = 0;
    this.nextMutation = this.dice.int(4, 8);
    this.cell = rhythmCell(spec.seed * 17 + this.dice.int(0, 2), spec.character.gait);
  }

  /** A border mid-piece: new seeds, new key, same bar of the same form. */
  private recompose(spec: MusicSpec): void {
    this.beatSec = spec.pulse ? 60 / between(spec.pulse) : 0;
    this.composeFor(spec);
  }

  /**
   * A A B A when the piece has room, the compact A A B when it does not. The
   * tension targets walk the arc — low, building, peak about two thirds in,
   * resolve — and every section spends its target as register, subdivision
   * and layer count rather than as loudness.
   */
  private buildSections(totalBars: number): Section[] {
    const four = totalBars >= 24;
    const kinds: readonly ('A' | 'B')[] = four ? ['A', 'A', 'B', 'A'] : ['A', 'A', 'B'];
    const tensions = four ? [0.3, 0.55, 1, 0.45] : [0.35, 1, 0.5];
    const base = Math.floor(totalBars / kinds.length);
    const spare = totalBars % kinds.length;
    const sections: Section[] = [];
    let from = 0;
    kinds.forEach((kind, i) => {
      const bars = base + (i < spare ? 1 : 0);
      sections.push({ kind, fromBar: from, bars, tension: tensions[i] });
      from += bars;
    });
    return sections;
  }

  private stopPiece(now: number): void {
    this.playing = false;
    this.textureActive = false;
    this.melodyActive = false;
    this.drumsActive = false;
    this.nextPiece = now + between(REST);
  }

  private rackFor(spec: MusicSpec): Rack {
    let rack = this.racks.get(spec);
    if (!rack) {
      const gain = this.engine.context.createGain();
      gain.gain.value = 0;
      gain.connect(this.out);
      rack = {
        drone: buildVoice(this.engine, spec.palette.drone, 'drone'),
        texture: buildVoice(this.engine, spec.palette.texture, 'upper'),
        melody: buildVoice(this.engine, spec.palette.melody, 'upper'),
        altTexture: spec.palette.altTexture
          ? buildVoice(this.engine, spec.palette.altTexture, 'upper')
          : null,
        altMelody: spec.palette.altMelody
          ? buildVoice(this.engine, spec.palette.altMelody, 'upper')
          : null,
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
      rack.altTexture?.output.connect(gain);
      rack.altMelody?.output.connect(gain);
      if (rack.kit) {
        rack.kit.kick.output.connect(gain);
        rack.kit.snare.output.connect(gain);
        rack.kit.hat.output.connect(gain);
      }
      this.racks.set(spec, rack);
    }
    return rack;
  }

  // --- the bar --------------------------------------------------------------

  /**
   * Length of a bar, tempo state and all: the felt pulse or the breath bar,
   * the section's drift, and the ritard where a landing is due.
   */
  private barLen(bar: number): number {
    const spec = this.spec as MusicSpec;
    const base = spec.pulse ? this.beatSec * BAR_BEATS * this.drift : between(BREATH_BAR);
    return base / this.ritard(bar);
  }

  /** The tempo factor a bar plays under — 1 in open country, less at landings. */
  private ritard(bar: number): number {
    // The final cadence commits: the measured curve over the last three bars.
    const FINAL_BARS = 3;
    if (bar >= this.totalBars - FINAL_BARS) {
      const x = (bar - (this.totalBars - FINAL_BARS) + 1) / FINAL_BARS;
      return ritardCurve(x, this.finalV);
    }
    // Section ends ease, gently, over their last two bars.
    const section = this.sections[this.sectionAt];
    if (section && this.sectionAt < this.sections.length - 1) {
      const end = section.fromBar + section.bars;
      if (bar >= end - 2) return ritardCurve((bar - (end - 2) + 1) / 2, SECTION_END_V);
    }
    return 1;
  }

  private readonly barGap: Gap = () => this.currentBarLen;

  /**
   * The piece's heartbeat and its only conductor: one call per bar places
   * everything the bar contains. Chord first — the strata stand on it — then
   * the melody statement if one is due (it starts on the bar line), then the
   * texture figure with its downbeat on the downbeat, then the kit.
   */
  private readonly fireBar = (at: number): void => {
    const spec = this.spec;
    const rack = this.rack;
    if (!spec || !rack) return;
    const bar = this.barIndex++;

    if (bar >= this.totalBars) {
      // The form is spent; the last chord's tail is the piece's exit.
      this.pieceEnd = Math.min(this.pieceEnd, at);
      return;
    }

    // Section bookkeeping first — the chord depends on where the bar stands.
    const sectionAt = this.sections.findIndex(
      (s) => bar >= s.fromBar && bar < s.fromBar + s.bars,
    );
    if (sectionAt !== this.sectionAt) this.onSection(sectionAt);
    const section = this.sections[this.sectionAt];
    const barInSection = bar - section.fromBar;
    const lastOfSection = barInSection === section.bars - 1;
    const penult = barInSection === section.bars - 2;
    const barLen = this.barLen(bar);
    this.currentBarLen = barLen;
    // The sounding mode — the spec's, unless the bridge stepped to a neighbour.
    const mode = MODES[this.mode];

    // Raise and subtract the strata in bar space. Texture leaves before the
    // final cadence, melody before that, drums keep only the arc's peak.
    this.textureActive =
      this.earnedTexture && bar >= this.textureFromBar && bar <= this.textureUntilBar;
    this.melodyActive =
      this.earnedMelody && bar >= this.melodyFromBar && bar <= this.melodyUntilBar;
    this.drumsActive =
      this.earnedDrums && section.tension >= 0.6 && bar <= this.totalBars - 4;

    // The chord of the bar, at the vibe's own pace. The bridge walks the away
    // ground; every section lands home through its approach chord — bVII–i or
    // plagal, never V.
    const hold = Math.max(1, spec.character.chordBars);
    const loop = section.kind === 'B' ? this.awayGround : this.ground;
    let pc = loop[Math.floor(barInSection / hold) % loop.length];
    if (lastOfSection) pc = 0;

    this.lastChordDegree = this.chordDegree;
    if (penult) {
      // Cadence approach: the harmonic rhythm doubles — the loop chord keeps
      // the first half of the bar and the approach takes the second — and the
      // upper strata anticipate the approach for the whole bar.
      const approach = cadenceApproach(this.mode);
      this.fireDrone(at, pc, barLen / 2 + 1.5);
      this.fireDrone(at + barLen / 2, approach, barLen / 2 + 2.5);
      this.chordDegree = semitoneToDegree(mode, approach);
    } else if (bar === this.borrowBar) {
      // The borrowed chord: the bass alone leans out of the mode for one bar
      // while everything above holds home — dissonance rationed, then spent.
      this.fireDrone(at, GROUNDS[spec.mode].borrow, barLen + 2);
      this.chordDegree = 0;
    } else {
      // An ordinary bar: re-fire the pad when the chord moves, or refresh it
      // before the overlap runs dry. Each refresh re-voices, which is what
      // keeps a held chord from being a held note — and sometimes the pad
      // skips a due refresh and breathes out instead, so the drone falls
      // away and re-enters rather than sounding for the whole piece.
      const refresh = this.beatSec === 0 ? barLen * 0.9 : barLen * 2;
      const stale = at - this.droneFiredAt > refresh;
      if (pc !== this.dronePc || (stale && Math.random() > DRONE_BREATH + this.night * 0.15)) {
        this.fireDrone(at, pc, this.beatSec === 0 ? barLen + 3 : barLen * 2 + 2);
      }
      this.chordDegree = inMode(pc, mode) ? semitoneToDegree(mode, pc) : 0;
    }

    // Melody before texture: the figure listens for the phrase's silences.
    if (this.melodyActive && at >= this.melodyDueAt) this.fireStatement(at);
    if (this.textureActive) this.fireFigure(at, barLen, section.tension);
    if (this.drumsActive) this.fireKit(at, barLen);
  };

  /** Turn a section over: new drift, new cell, the motif's next operation. */
  private onSection(index: number): void {
    const spec = this.spec as MusicSpec;
    const rack = this.rack as Rack;
    this.sectionAt = index;
    const section = this.sections[index];
    const last = index === this.sections.length - 1;

    // Sections drift a few percent — the corpus assigns different BPMs to
    // sections of one track, and this is that, scaled down.
    this.drift = 1 + (this.dice() * 2 - 1) * 0.04;

    // The bridge may change mode, not just ground: one accidental darker or
    // brighter on the same root. A sections always come home.
    if (section.kind === 'B') {
      const steps = NEIGHBOURS[spec.mode];
      this.mode = steps && this.dice.chance(0.5) ? this.dice.pick(steps) : spec.mode;
    } else {
      this.mode = spec.mode;
    }

    // Each section owns ONE rhythm cell from the vibe's gait.
    this.cell = rhythmCell(spec.seed * 17 + index * 13 + this.dice.int(0, 2), spec.character.gait);

    // The motif's development schedule: stated plain, then one operation per
    // restatement — and the last section augments, which is an op on time.
    if (index === 0) this.op = 'plain';
    else if (section.kind === 'B') {
      this.op = this.dice.pick<MotifOp>(['inversion', 'fragment', 'sequence']);
    } else if (last) this.op = 'plain';
    else this.op = this.dice.pick<MotifOp>(['plain', 'sequence']);
    this.augment = last;

    // Re-orchestration on restatement is a chance, not a guarantee — an
    // alternate voice is a visit, and the return always takes the band back.
    if (section.kind === 'B') {
      this.melAlt =
        rack.altMelody !== null &&
        (this.dice.chance(0.5) ? !this.pieceMelAlt : this.pieceMelAlt);
      this.texAlt =
        rack.altTexture !== null && this.dice.chance(0.35) ? !this.pieceTexAlt : this.pieceTexAlt;
    } else {
      this.melAlt = this.pieceMelAlt;
      this.texAlt = this.pieceTexAlt;
    }
  }

  // --- the strata -------------------------------------------------------------

  /**
   * The silence after a statement: the vibe's own span, leaned toward its
   * short end by the vibe's density. Density is how *much* the melody speaks,
   * not whether it speaks — a talkative place lives near the bottom of its
   * span, a still one near the top, and neither ever exceeds it.
   */
  private restAfterPhrase(): number {
    const spec = this.spec as MusicSpec;
    const [lo, hi] = spec.character.phraseRest;
    const lean = Math.min(Math.max(spec.density, 0), 1);
    return lo + (hi - lo) * Math.random() * (1 - lean * 0.6);
  }

  /** The felt beat under the current section's hand. */
  private beat(): number {
    return this.beatSec > 0 ? this.beatSec * this.drift : between([2.4, 4]);
  }

  /**
   * Every stratum's touch at a moment: the piece-long swell — soft in,
   * fullest in the middle, soft out — under the section's tension and the
   * night's hand. Velocity is brightness in every voice, so this moves the
   * tone and not merely the level.
   */
  private level(at: number): number {
    const p = this.pieceSpan > 0
      ? Math.min(Math.max((at - this.pieceStart) / this.pieceSpan, 0), 1)
      : 1;
    const swell = 0.65 + 0.35 * Math.sin(Math.PI * p);
    const tension = this.sections[this.sectionAt]?.tension ?? 0.5;
    // A little quiet for the moon, not a muffle — the night moves live elsewhere.
    return swell * (0.85 + 0.2 * tension) * (1 - this.night * 0.12);
  }

  /**
   * The pad, voiced as a rocking bass: high chords fall below the root. No
   * two firings are the same breath — the touch wobbles, the fifth comes and
   * goes, and sometimes the octave or the high fifth joins over the root,
   * which is the one fixture. Root and fifth only, as the grammar writes it;
   * what varies is the voicing, never the chord.
   */
  private fireDrone(at: number, pc: number, duration: number): void {
    const spec = this.spec;
    const rack = this.rack;
    if (!spec || !rack) return;
    const bass = pc > 6 ? pc - 12 : pc;
    const velocity =
      0.26 * spec.character.droneLevel * this.level(at) * (0.85 + Math.random() * 0.3);
    rack.drone.noteOn(at, justHz(spec.root, bass), velocity, duration);
    // A bare root is the darkest voicing, and it happens.
    if (Math.random() < 0.7) {
      rack.drone.noteOn(at, justHz(spec.root, bass + 7), velocity * 0.8, duration);
    }
    if (Math.random() < 0.25) {
      rack.drone.noteOn(at, justHz(spec.root, bass + 12), velocity * 0.5, duration);
    }
    if (Math.random() < 0.2) {
      rack.drone.noteOn(at, justHz(spec.root, bass + 19), velocity * 0.4, duration);
    }
    this.dronePc = pc;
    this.droneFiredAt = at;
  }

  /**
   * A note re-stood on a chord, in degree space — the scale lock holds by
   * construction. The degree is read in the home mode the note was generated
   * in and rendered in the sounding mode; the modes are the same length, so
   * a mutated bridge re-says the same degree with one accidental moved.
   */
  private onChord(note: number, chord = this.chordDegree): number {
    const spec = this.spec as MusicSpec;
    return degreeToSemitone(
      MODES[this.mode],
      semitoneToDegree(MODES[spec.mode], note) + chord,
    );
  }

  /**
   * This bar's ostinato figure, placed inside the bar: the section's cell,
   * downbeat on the downbeat, notes standing on the chord of the bar. At the
   * arc's peak the figure subdivides; in the melody's silences a long step
   * may break into a pair — the call-and-response rung of the ladder. Every
   * 4–8 bars, exactly one element of the note loop mutates.
   */
  private fireFigure(at: number, barLen: number, tension: number): void {
    const spec = this.spec;
    const rack = this.rack;
    if (!spec || !rack) return;
    const voice = this.texAlt && rack.altTexture ? rack.altTexture : rack.texture;
    // At night the figure lifts an octave — moonlight on the same object.
    const octave = spec.character.textureOctave + (this.night > 0.5 ? 12 : 0);

    if (this.beatSec === 0) {
      // Wilderness floats: a few unmetered notes scattered inside the breath
      // bar, still standing on its chord.
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const t = at + Math.random() * barLen * 0.8;
        const note = this.ostinato[this.ostinatoAt++ % this.ostinato.length];
        const velocity = (0.28 + Math.random() * 0.1) * this.level(t);
        voice.noteOn(t, justHz(spec.root, this.onChord(note) + octave), velocity, between([2.2, 3.6]));
      }
      this.advanceMutation(spec);
      return;
    }

    let figure = tension >= 0.7 ? subdivide(this.cell) : this.cell;
    if (this.night > 0.5) figure = halveFigure(figure);
    // Seconds per beat with this bar's drift and ritard baked in, so the
    // figure fills exactly the bar the drone is holding.
    const unit = barLen / BAR_BEATS;

    // Over a chord change the figure may keep its old footing for the first
    // step — the suspension — then resolve by step toward the new chord on
    // the second: fourth into fifth, second into root, never onto a third.
    const suspending =
      this.chordDegree !== this.lastChordDegree && figure.length >= 2 && Math.random() < 0.5;
    let suspended = 0;
    let resolved = 0;
    if (suspending) {
      const footing = semitoneToDegree(
        MODES[spec.mode],
        this.ostinato[this.ostinatoAt % this.ostinato.length],
      );
      const held = footing + this.lastChordDegree;
      const target = footing + this.chordDegree;
      suspended = degreeToSemitone(MODES[this.mode], held);
      resolved = degreeToSemitone(MODES[this.mode], held + Math.sign(target - held));
    }

    let offset = 0;
    let index = 0;
    for (const step of figure) {
      const t = at + offset * unit;
      offset += step.beats;
      const note = this.ostinato[this.ostinatoAt++ % this.ostinato.length];
      const velocity = (0.26 + step.accent * 0.16) * this.level(t);
      const seconds = step.beats * unit * 1.8;

      let pitch = this.onChord(note) + octave;
      if (suspending && index === 0) pitch = suspended + octave;
      if (suspending && index === 1) pitch = resolved + octave;

      // The ladder's lowest rung, spent only when the melody is quiet: the
      // step breaks into a pair, the second note a neighbour from the cell.
      // A suspension owns its two steps — they never split.
      const quiet = t > this.phraseUntil;
      const splittable = !(suspending && index < 2);
      if (splittable && quiet && tension >= 0.55 && step.beats >= 1 && Math.random() < 0.5) {
        const half = (step.beats * unit) / 2;
        const next = this.ostinato[this.ostinatoAt % this.ostinato.length];
        voice.noteOn(t, justHz(spec.root, pitch), velocity, half * 1.8);
        voice.noteOn(
          t + half,
          justHz(spec.root, this.onChord(next) + octave),
          velocity * 0.7,
          half * 1.8,
        );
      } else {
        voice.noteOn(t, justHz(spec.root, pitch), velocity, seconds);
      }
      index++;
    }
    this.advanceMutation(spec);
  }

  /** One bar stated; every 4–8 of them, one element of the loop changes. */
  private advanceMutation(spec: MusicSpec): void {
    this.cellRepeats++;
    if (this.cellRepeats >= this.nextMutation) {
      const pool = texturePool(MODES[spec.mode]);
      this.ostinato = mutateOstinato(this.dice, this.ostinato, pool).notes;
      this.cellRepeats = 0;
      this.nextMutation = this.dice.int(4, 8);
    }
  }

  /** The kit's bar, placed beat by beat from the same bar length as everything else. */
  private fireKit(at: number, barLen: number): void {
    const spec = this.spec;
    const kit = this.rack?.kit;
    if (!spec || !kit) return;
    const unit = barLen / BAR_BEATS;
    // Night is half-time here too: the odd beats simply are not played.
    const stride = this.night > 0.5 ? 2 : 1;
    for (let beat = 0; beat < BAR_BEATS; beat += stride) {
      const t = at + beat * unit;
      const level = this.level(t);
      // A kick that mostly keeps the one, a hat that mostly fills, a snare
      // that sometimes answers. Every "mostly" is a dice roll — a pattern
      // that always resolves is a metronome with extra steps.
      if (beat === 0 ? Math.random() < 0.9 : beat === 2 && Math.random() < 0.5) {
        kit.kick.noteOn(t, spec.root, 0.5 * level);
      }
      if (Math.random() < 0.6) {
        kit.hat.noteOn(t, spec.root, (0.16 + Math.random() * 0.1) * level);
      }
      if (beat === 3 && Math.random() < 0.4) {
        kit.snare.noteOn(t, spec.root, 0.3 * level);
      }
    }
  }

  /**
   * A statement is a period: the head, an open tail hanging on the second or
   * fifth, a breath, the same head again and the stepwise fall onto the root,
   * held — or, where the vibe's habit says so, only the closing fragment.
   * Statements start on the bar line; later ones develop the motif by the
   * section's one operation, and the bridge lifts the whole period onto its
   * ground. Steps take their lengths from the section's rhythm cell and
   * their lean from the arch.
   */
  private fireStatement(at: number): void {
    const spec = this.spec;
    const rack = this.rack;
    if (!spec || !rack) return;
    const mode = MODES[this.mode];
    const section = this.sections[this.sectionAt];
    const tension = section?.tension ?? 0.5;

    const fragmentary = this.dice.chance(spec.character.fragment);
    const head = applyOp(this.head, fragmentary ? 'fragment' : this.op, this.dice);
    const period = periodFrom(head, mode);
    // At night some statements speak the question and withhold the answer —
    // nothing new is said, something is left unsaid.
    const withheld = !fragmentary && this.dice.chance(this.night * 0.4);
    const halves = fragmentary
      ? [period.consequent]
      : withheld
        ? [period.antecedent]
        : [period.antecedent, period.consequent];

    // The bridge stands the whole period on its opening chord — both halves,
    // so the head stays shared and the landing agrees with the away bass.
    const lift =
      section?.kind === 'B' && inMode(this.awayGround[0], mode)
        ? semitoneToDegree(mode, this.awayGround[0])
        : 0;

    // A statement may sit an octave down between the arc's peaks — but only
    // where the vibe's seat leaves an octave to give.
    const mayDrop = spec.character.melodyOctave >= 24 && tension < 0.7;
    const octave =
      spec.character.melodyOctave -
      (mayDrop && this.dice.chance(0.35 + this.night * 0.4) ? 12 : 0);
    const voice = this.melAlt && rack.altMelody ? rack.altMelody : rack.melody;
    const stretch = this.augment ? 1.7 : 1;

    // The second time through, the player decorates. The first never is.
    const decorated = this.statements > 0;

    // At the arc's high ground an idle alt voice shadows the tune — the same
    // notes a breath behind, some passing notes dropped. One tune, two
    // players: heterophony, not a harmony line.
    const shadow =
      !this.melAlt && rack.altMelody && tension >= 0.6 && this.dice.chance(0.6)
        ? rack.altMelody
        : null;

    let t = at;
    halves.forEach((half, h) => {
      // A withheld statement never closes: its last note hangs open.
      const closingHalf = h === halves.length - 1 && !withheld;
      for (let i = 0; i < half.length; i++) {
        const progress = half.length > 1 ? i / (half.length - 1) : 1;
        const beats = this.beatSec > 0 ? this.cell[i % this.cell.length].beats : 0;
        const step =
          (this.beatSec > 0 ? beats * this.beat() : between([1.1, 2.2])) *
          stretch *
          phraseArch(progress);
        const arc = 0.7 + 0.3 * Math.sin(Math.PI * progress);
        const velocity = (0.42 + Math.random() * 0.12) * arc * this.level(t);
        const note = degreeToSemitone(mode, half[i] + lift) + octave;
        const closing = closingHalf && i === half.length - 1;
        const open = !closingHalf && i === half.length - 1;
        // The landing is held two to four beats' worth — a resolution that
        // rings instead of stopping; the question hangs a little too.
        const hold = closing ? 2 + this.dice() * 2 : open ? 1.6 : 1.1;
        const pitch = justHz(spec.root, note);
        const duration = step * hold;

        if (decorated && step >= 0.35 && Math.random() < 0.12 + 0.28 * tension) {
          this.ornament(voice, t, mode, half[i] + lift, octave, velocity, duration, i > 0);
        } else {
          voice.noteOn(t, pitch, velocity, duration);
        }
        // The shadow keeps the edges and may drop what lies between.
        if (shadow && (i === 0 || closing || open || Math.random() > 0.25)) {
          shadow.noteOn(t + 0.03 + Math.random() * 0.06, pitch, velocity * 0.6, duration);
        }
        t += step * (closing ? hold * 0.8 : 1);
      }
      // The breath between the question and its answer. A withheld answer
      // takes no breath: the phrase rest begins on the open note.
      if (h < halves.length - 1) t += this.beatSec > 0 ? this.beat() : between([1.2, 2]);
    });

    this.statements++;
    this.phraseUntil = t;
    this.melodyDueAt = t + this.restAfterPhrase();
  }

  /**
   * One note, decorated: the cut is a grace a degree above, the mordent dips
   * to the lower neighbour and returns, the anticipation touches the pitch
   * early and softly. Extra short noteOns and nothing else — the mono voices
   * read the tight joins as glides, which is a fiddle cut for free. The
   * anticipation leans before the beat, so it is kept off phrase starts.
   */
  private ornament(
    voice: Instrument,
    at: number,
    mode: Mode,
    degree: number,
    octave: number,
    velocity: number,
    duration: number,
    midPhrase: boolean,
  ): void {
    const spec = this.spec as MusicSpec;
    const pitch = justHz(spec.root, degreeToSemitone(mode, degree) + octave);
    const roll = Math.random();
    if (midPhrase && roll < 0.25) {
      voice.noteOn(at - 0.13, pitch, velocity * 0.4, 0.12);
      voice.noteOn(at, pitch, velocity, duration);
    } else if (roll < 0.6) {
      const above = justHz(spec.root, degreeToSemitone(mode, degree + 1) + octave);
      voice.noteOn(at, above, velocity * 0.55, 0.09);
      voice.noteOn(at + 0.07, pitch, velocity, Math.max(duration - 0.07, 0.2));
    } else {
      const below = justHz(spec.root, degreeToSemitone(mode, degree - 1) + octave);
      voice.noteOn(at, pitch, velocity, 0.09);
      voice.noteOn(at + 0.08, below, velocity * 0.7, 0.09);
      voice.noteOn(at + 0.16, pitch, velocity * 0.9, Math.max(duration - 0.16, 0.2));
    }
  }
}
