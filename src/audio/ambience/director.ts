import * as THREE from 'three';
import type { AudioEngine } from '../AudioEngine';
import { Emitter, type SoundModel } from '../Emitter';
import type { OneShot } from '../Scatter';
import { createTicker, type Ticker } from '../dsp/ticker';
import { valueNoise } from '../weather';
import { createRng, type Rng } from '../../art/random';
import type { Collider } from '../../player/Collider';
import { buildModel } from '../Soundscape';
import type { InsectModel } from '../models/insect';
import type { ElectricModel } from '../models/electric';
import type { SurfModel } from '../models/surf';
import { VOICES } from './voices';
import { ambienceFor, VIBES, type VibeChoice, type VibeName } from '../vibes';
import { CLEAR, night, openness, weatherDamp, type Conditions } from './conditions';
import { QUIET } from './spec';
import type {
  AirLayer,
  Band,
  AmbienceSpec,
  AmbienceVoice,
  CastMember,
  ChorusLayer,
  Driver,
  Follow,
} from './spec';

/**
 * The ambience director.
 *
 * The score is a scarcity system; this is its opposite. A place that falls
 * silent has died, so the keynote never stops and the scarcity lives one
 * stratum up: signals are rare and soundmarks are rarer than signals.
 *
 * One rack per spec, kept the way the score keeps its own — built once,
 * silenced often — and one pump on a worker timer. Every decision below is
 * made against the audio clock and a conditions struct sampled once, never
 * against frame state.
 *
 * The director sites its own sources in a ring around the listener. A zone
 * that wants a sound at a coordinate declares it in its `SoundscapeSpec`
 * instead; nothing here knows where anything in the world is.
 */

const PUMP_MS = 100;
/** How far ahead an event is placed. Comfortably past one pump. */
const LOOKAHEAD = 0.12;

/** Seconds a border takes, and the faster exit into unscored country. */
const CROSSFADE = 0.9;
const LEAVE = 0.35;

/**
 * **Everything in this layer is far.** That is not a setting, it is what the
 * layer *is*: global ambience is what a whole zone sounds like, and a whole
 * zone is never at arm's length. There is no near and no middle distance,
 * because a source close enough to be either is a source that belongs to a
 * place — the zone's own `SoundscapeSpec` — and not to this.
 *
 * So there is one treatment and every source gets it: quiet, dark, with a lot
 * of room around it and a handful of scattered early returns, which is what
 * being a long way off in the open actually does to a sound.
 *
 * Direction is a **bias and never a side.** A single distant source may lean
 * one way, because a rook really is over there; nothing may ever arrive at one
 * ear and not the other, because that does not happen outside headphones. The
 * pan is capped well short of the ends and the master is crossfed on top.
 */
const FAR = {
  /** Where a source may stand. One ring, and it exists to give a bearing. */
  radius: [14, 26] as const,
  /** Metres above the listener, by default. */
  lift: 5,
  level: 0.32,
  tone: 5200,
  reverb: 0.9,
  importance: 0.6,
};

/**
 * How far off centre a source may sit, as a fraction of the ring.
 *
 * Two numbers, because there are two kinds of thing here and they localise
 * completely differently.
 *
 * **A continuous layer is diffuse.** Nobody can point at a chimney by ear, or
 * at a hedge, or at the plant behind a fence — they are large, they are steady,
 * and by the time they reach you they have come off every surface between. A
 * bed with a bearing is a loudspeaker with a bearing.
 *
 * **A discrete event has one**, because a rook really is over there and you
 * really do turn your head. Even then the extent is small: a source pushed to
 * the edge of the field is a source in one ear, and nothing outdoors is ever in
 * one ear — your head is small and sound goes round it.
 */
const CHORUS_BIAS = 0.1;
const EVENT_BIAS = 0.34;

/**
 * How much of each channel is fed to the other, on this layer alone.
 *
 * The master is already crossfed, which stops anything reaching one ear and not
 * the other. This is stronger, and it is stronger on purpose: **global ambience
 * must never have a close position that dominates one side.** A placed source
 * has a location and is allowed to insist on it; this layer is what the whole
 * zone sounds like, and a whole zone does not come from your left.
 *
 * At this depth the two ears are never more than about four decibels apart, so
 * a source still has a bearing and can never take over a side.
 */
const SPREAD = 0.62;
const SPREAD_HZ = 1400;

/** Decibels to a gain. The mix is stated in dB and applied here. */
const gainOf = (db: number): number => Math.pow(10, db / 20);

/**
 * The ambience never goes above this, whatever the book says and whatever the
 * dice do. A ceiling rather than a mix: it exists so that a stack of events
 * landing together cannot startle, not to make anything sit anywhere.
 */
const CEILING_DB = -3;

/** How much a fixed offset may swing the level. Small: it is not a distance. */
const ROLLOFF = 0.2;
/** Past any offset in use, so the emitter's own taper never engages. */
const REACH = 4000;

/**
 * Where each band starts, in Hz. Coarse on purpose: this is a masking model,
 * not an equaliser.
 */
const BAND_EDGES: readonly (readonly [Band, number])[] = [
  ['floor', 0],
  ['body', 80],
  ['throat', 300],
  ['call', 900],
  ['song', 2500],
  ['air', 6000],
];

function bandOf(hz: number): Band {
  let found: Band = 'floor';
  for (const [band, edge] of BAND_EDGES) if (hz >= edge) found = band;
  return found;
}

/**
 * How long an event holds its band, as a multiple of its own length. A near
 * source masks for longer than a far one, because distance is itself a form of
 * masking relief.
 */
const HOLD = 0.8;

/** Multiplier on that hold in a band the score is already sitting in. */
const CLAIMED_HOLD = 2.5;

/** Seconds a hush lasts, and how long the cast takes to come back after it. */
const HUSH: readonly [number, number] = [15, 40];
const RECOVER = 14;
/** Mean seconds between hushes that nothing in particular caused. */
const HUSH_EVERY = 280;

/** Coprime, so the swells never re-align. Seconds. */
const CYCLES = [41, 67, 103];
const CYCLE_WEIGHTS = [0.5, 0.3, 0.2];

interface Held {
  shot: OneShot;
  emitter: Emitter;
  /** Audio-clock time this voice is free again. */
  busyUntil: number;
  /** Set while this voice is crossing. See `THE PASS` in `update`. */
  path: { from: THREE.Vector3; to: THREE.Vector3; start: number; length: number } | null;
}

interface Pool {
  voices: Held[];
}

interface Layer {
  model: SoundModel;
  gain: GainNode;
  follow: readonly Follow[];
  base: number;
  spec: AirLayer | ChorusLayer;
}

/** The one treatment chain, shared by everything in the layer. */
interface Bus {
  /** Emitters' dry path lands here. */
  in: GainNode;
  /** And their wet path here. */
  send: GainNode;
  nodes: AudioNode[];
}

interface Rack {
  spec: AmbienceSpec;
  /** The vibe's fader. Two nodes so the wet path fades with the dry one. */
  dry: GainNode;
  wet: GainNode;
  bus: Bus;
  air: Layer[];
  /** `offset` is from the listener, not from the world origin. See `update`. */
  chorus: (Layer & { emitter: Emitter; offset: THREE.Vector3 })[];
  pools: Map<string, Pool>;
  /** Audio-clock time each cast member and signal is next due. */
  due: number[];
  signalDue: number[];
  rng: Rng;
  /** Where this vibe's cycles start, so two places are never in step. */
  offsets: number[];
}

export class AmbienceDirector {
  private readonly engine: AudioEngine;
  private readonly out: GainNode;
  private readonly wetOut: GainNode;
  private readonly limiter: DynamicsCompressorNode;

  private readonly racks = new Map<AmbienceSpec, Rack>();
  private rack: Rack | null = null;
  private spec: AmbienceSpec | null = null;
  /** The dev panel's own rack. See `say`. */
  private audition: Rack | null = null;

  private readonly ticker: Ticker;
  private conditions: Conditions = { ...CLEAR };

  /** Clock time in seconds, for the cycles. Runs whether or not a zone is live. */
  private clock = 0;
  private lastPump = 0;
  /** The hour last struck, so a soundmark fires on the change and not per pump. */
  private struck = -1;
  /** What the whole biophony is scaled by right now. */
  private live = 0;

  /** When each band is free again, on the audio clock. */
  private readonly busy: Record<Band, number> = {
    floor: 0,
    body: 0,
    throat: 0,
    call: 0,
    song: 0,
    air: 0,
  };
  /** Bands the score is sitting in while a piece plays. */
  private claimed: readonly Band[] = [];
  /** When the hush ends, and when the next unprovoked one is due. */
  private hushUntil = 0;
  private hushDue = 0;

  constructor(engine: AudioEngine) {
    this.engine = engine;
    const context = engine.context;

    // A limiter across the whole layer, before the trim. Procedural audio has
    // no mastering engineer and a dozen sources landing in phase is a matter of
    // when rather than if; this is the backstop that makes "stable across the
    // whole soundscape" true by construction rather than by tuning.
    const ceiling = context.createDynamicsCompressor();
    ceiling.threshold.value = CEILING_DB;
    ceiling.knee.value = 6;
    ceiling.ratio.value = 12;
    ceiling.attack.value = 0.004;
    ceiling.release.value = 0.25;

    this.out = context.createGain();
    this.out.connect(ceiling);
    const spread = diffuse(context);
    ceiling.connect(spread.input);
    spread.output.connect(engine.dry);
    this.limiter = ceiling;
    this.wetOut = context.createGain();
    this.wetOut.connect(engine.send);

    this.ticker = createTicker(PUMP_MS, this.pump);
  }

  /**
   * What the world is doing. Pushed in rather than read, because the clock and
   * the weather live in `src/world` and nothing under `src/audio` reads it.
   */
  setConditions(conditions: Conditions): void {
    this.conditions = conditions;
  }

  /**
   * Follows the player across a border. See the score's `setZone`.
   *
   * Takes the zone's choice rather than a spec, because a rotation is drawn on
   * the zone and the day and the day is already here in the conditions.
   */
  setZone(choice: VibeChoice | undefined, zoneId: string): void {
    this.select(ambienceFor(choice, zoneId, Math.floor(this.conditions.elapsed)));
  }

  /** For the dev panel: hold one vibe's ambience, or hand it back with null. */
  setVibe(name: VibeName | null): void {
    this.select(name ? VIBES[name].ambience : null);
  }

  private select(spec: AmbienceSpec | null): void {
    if (spec === this.spec) return;
    const now = this.engine.context.currentTime;
    const seconds = spec ? CROSSFADE : LEAVE;

    if (this.rack) this.fade(this.rack, 0, seconds);

    this.spec = spec;
    this.rack = spec ? this.rackFor(spec) : null;
    if (!this.rack) return;

    this.fade(this.rack, 1, CROSSFADE);
    // The clocks resume from now rather than from whenever this rack was last
    // live, so coming back to a place does not fire a backlog at the door.
    const rack = this.rack;
    for (let i = 0; i < rack.due.length; i++) rack.due[i] = now + Math.random() * 4;
    for (let i = 0; i < rack.signalDue.length; i++) rack.signalDue[i] = now + 20 + Math.random() * 40;
  }

  /**
   * Where the score is sitting, or null while it rests. The ambience thins in
   * those bands rather than vacating them — a wood does not stop having birds
   * in it because a flute came in.
   */
  setScore(voicing: { root: number; melody: number } | null): void {
    this.claimed = voicing ? [bandOf(voicing.root), bandOf(voicing.melody)] : [];
  }

  /**
   * Stops everything alive, for fifteen to forty seconds. An alarm call, a
   * stack going over, or a roll of the dice — and later, whatever the game
   * wants to make a place hold its breath for.
   *
   * The keynote and the geophony do not take part. Wind does not stop because
   * a jay shouted.
   */
  hush(now = this.engine.context.currentTime): void {
    this.hushUntil = Math.max(this.hushUntil, now + HUSH[0] + Math.random() * (HUSH[1] - HUSH[0]));
  }

  /**
   * Fires one voice now, ignoring its gates and its clock. Tuning a source
   * whose whole design is that it speaks every ninety seconds is otherwise
   * mostly waiting, and waiting is how a parameter gets changed twice between
   * hearings.
   */
  say(voice: AmbienceVoice): void {
    // Its own rack, with no air, no chorus and no cast — just the treatment
    // chain and somewhere to put a throat. Borrowing a vibe's rack meant
    // starting that whole vibe to get at its bus, so the button played a place
    // rather than the one voice it was asked for.
    if (!this.audition) {
      this.audition = this.rackFor(QUIET);
      this.fade(this.audition, 1, 0.05);
    }
    this.speak(
      this.audition,
      { voice, every: [1, 1] },
      this.engine.context.currentTime + 0.08,
      voice,
      true,
    );
  }

  /** Silences the whole layer without tearing it down. */
  setActive(active: boolean): void {
    const now = this.engine.context.currentTime;
    this.out.gain.setTargetAtTime(active ? 1 : 0, now, 0.15);
    this.wetOut.gain.setTargetAtTime(active ? 1 : 0, now, 0.15);
  }

  /**
   * Drives the emitters. Separate from the pump because spatialisation is
   * frame work and scheduling is not — the pump decides what speaks, this
   * moves what is already speaking.
   */
  update(dt: number, collider: Collider, retestOcclusion: boolean): void {
    const rack = this.rack;
    if (!rack) {
      if (this.audition) {
        for (const pool of this.audition.pools.values()) {
          for (const voice of pool.voices) voice.emitter.update(dt, collider, retestOcclusion);
        }
      }
      return;
    }
    const at = this.engine.listenerPosition;
    // The audition rack has no layers, only throats, and they still want their
    // spatial chain ticked.
    if (this.audition) {
      for (const pool of this.audition.pools.values()) {
        for (const voice of pool.voices) voice.emitter.update(dt, collider, retestOcclusion);
      }
    }
    for (const layer of rack.air) layer.model.update?.(dt, this.engine, at);
    for (const layer of rack.chorus) {
      // Carried with the listener. Sited once at the world origin, a chorus is
      // audible only in whichever zone happens to be built around it.
      layer.emitter.moveTo(_point.copy(at).add(layer.offset));
      layer.emitter.update(dt, collider, retestOcclusion);
    }
    const now = this.engine.context.currentTime;
    for (const pool of rack.pools.values()) {
      for (const voice of pool.voices) {
        const path = voice.path;
        if (path) {
          const t = (now - path.start) / path.length;
          if (t >= 1) voice.path = null;
          else if (t > 0) voice.emitter.moveTo(_point.lerpVectors(path.from, path.to, t));
        }
        voice.emitter.update(dt, collider, retestOcclusion);
      }
    }
  }

  private readonly pump = (): void => {
    const now = this.engine.context.currentTime;
    // Written when it moves, not sixty times a second to say the same number.
    const wanted = this.engine.settings.ambienceVolume;
    if (this.out.gain.value !== wanted) {
      this.out.gain.value = wanted;
      this.wetOut.gain.value = wanted;
    }
    const step = this.lastPump === 0 ? PUMP_MS / 1000 : Math.min(now - this.lastPump, 1);
    this.lastPump = now;
    this.clock += step;

    const rack = this.rack;
    if (!rack || !this.engine.started) return;
    const spec = rack.spec;
    const conditions = this.conditions;

    this.live = spec.activity * weatherDamp(conditions) * this.cycle(rack);

    if (this.hushDue === 0) this.hushDue = now + HUSH_EVERY * (0.5 + Math.random());
    else if (now > this.hushDue && now > this.hushUntil) {
      this.hush(now);
      this.hushDue = now + HUSH_EVERY * (0.5 + Math.random());
    }

    this.driveLayers(rack.air, now, conditions);
    this.driveLayers(rack.chorus, now, conditions);
    this.driveModels(rack.air, conditions);
    this.driveModels(rack.chorus, conditions);
    this.walkCast(rack, now, conditions);
    this.considerSignal(rack, now, conditions);
  };

  // --- the swell -------------------------------------------------------------

  /**
   * Three value-noise fields at coprime periods, so a place has busy stretches
   * and quiet ones and nothing in it ever reads as periodic.
   */
  private cycle(rack: Rack): number {
    let sum = 0;
    for (let i = 0; i < CYCLES.length; i++) {
      sum += valueNoise(this.clock / CYCLES[i] + rack.offsets[i]) * CYCLE_WEIGHTS[i];
    }
    // Expanded, because summed octaves cluster hard around their mean and a
    // field that never leaves the middle is a field with no shape.
    return Math.min(1, Math.max(0.12, 0.5 + (sum - 0.5) * 1.5));
  }

  private driverValue(by: Driver, now: Conditions): number {
    switch (by) {
      case 'wind':
        return now.wind;
      case 'gust':
        return now.gust;
      case 'rain':
        return now.rain;
      case 'snow':
        return now.snow;
      case 'fog':
        return now.fog;
      case 'night':
        return night(now);
      case 'warmth':
        return Math.min(1, Math.max(0, (now.warmth + 5) / 30));
      case 'activity':
        return this.live;
    }
  }

  private driveLayers(layers: readonly Layer[], now: number, conditions: Conditions): void {
    for (const layer of layers) {
      let level = layer.base * openness(layer.spec.when, conditions);
      for (const follow of layer.follow) {
        const driver = this.driverValue(follow.by, conditions);
        level *= follow.span[0] + (follow.span[1] - follow.span[0]) * driver;
      }
      // A layer that only moves level reads as somebody turning a knob, so this
      // is slow on purpose: it is the hour changing, not a fader.
      layer.gain.gain.setTargetAtTime(level, now, 1.2);
    }
  }

  /**
   * The handful of models whose *rate* is a condition rather than their level.
   * A cricket's chirp rate is the temperature and a corona's crackle rate is
   * the damp; neither is expressible as a gain, so neither goes through
   * `follow`.
   */
  private driveModels(layers: readonly Layer[], now: Conditions): void {
    for (const layer of layers) {
      switch (layer.spec.model) {
        case 'insect':
          (layer.model as InsectModel).setWarmth(now.warmth);
          break;
        case 'electric':
          (layer.model as ElectricModel).setDamp(Math.max(now.rain, now.wet));
          break;
        case 'surf':
          (layer.model as SurfModel).setSwell(0.3 + now.wind * 0.7);
          break;
        default:
          break;
      }
    }
  }

  // --- the cast ---------------------------------------------------------------

  private walkCast(rack: Rack, now: number, conditions: Conditions): void {
    const cast = rack.spec.cast;
    if (!cast) return;

    for (let i = 0; i < cast.length; i++) {
      if (rack.due[i] > now) continue;
      const member = cast[i];
      // The hush releases in wake order — the same ordering that runs the dawn
      // chorus, compressed. Earliest riser back first.
      if (VOICES[member.voice].alive && now < this.releasedAt(member)) {
        rack.due[i] = now + 1 + Math.random() * 2;
        continue;
      }
      const open = openness(member.when, conditions);
      // Shut, and cheap: one comparison and nothing is built. A cast member out
      // of season costs nothing for half the year.
      if (open < 0.03 || this.live < 0.05) {
        rack.due[i] = now + 4 + Math.random() * 6;
        continue;
      }

      this.speak(rack, member, now + LOOKAHEAD);

      const mean = member.every[0] + Math.random() * (member.every[1] - member.every[0]);
      // Exponential gaps: the same mean sometimes gives two in a row and
      // sometimes a long nothing. A periodic source keeps its own time and is
      // not slowed by the place being quiet — but nothing physical is exact,
      // and a train the ear can predict exactly stops being heard.
      const gap =
        member.rhythm === 'periodic'
          ? mean * (0.94 + Math.random() * 0.12)
          : -Math.log(1 - Math.random()) * (mean / Math.max(open * this.live, 0.04));
      rack.due[i] = now + Math.min(gap, 600);
    }
  }

  private speak(
    rack: Rack,
    member: CastMember,
    at: number,
    voiceName = member.voice,
    forced = false,
  ): void {
    const entry = VOICES[voiceName];
    const band = entry.band;
    // The niche rule. An event whose band is taken is dropped, not queued, and
    // the drop is inaudible by construction — it is indistinguishable from the
    // event never having been due. It is also an event never synthesised.
    if (!forced && band !== 'floor' && this.busy[band] > at) return;

    // Two throats only where this one can answer itself. Everywhere else a
    // second is a second emitter that is never both busy at once.
    const throats = member.answers && (member.answer ?? member.voice) === voiceName ? 2 : 1;
    const pool = this.poolFor(rack, voiceName, throats);
    const voice =
      pool.voices.find((held) => held.busyUntil <= at) ?? (forced ? pool.voices[0] : undefined);
    if (!voice || (voice.emitter.isVirtual && !forced)) return;
    // The budget and the ledger both exist to stop the book fighting itself,
    // and neither has any business silencing a button whose whole purpose is
    // "let me hear this one thing, now".
    if (forced) voice.emitter.enabled = true;

    const listener = this.engine.listenerPosition;
    const bearing = Math.random() * Math.PI * 2;
    const radius = FAR.radius[0] + Math.random() * (FAR.radius[1] - FAR.radius[0]);
    const height = listener.y + (member.height ?? FAR.lift) * (0.7 + Math.random() * 0.6);
    // `BIAS` shortens the horizontal offset without touching the height, so a
    // source has a real bearing and still never reaches the edge of the field.
    _point.set(
      listener.x + Math.cos(bearing) * radius * EVENT_BIAS,
      height,
      listener.z + Math.sin(bearing) * radius * EVENT_BIAS,
    );
    voice.emitter.moveTo(_point);
    voice.path = null;

    // A source that crosses rather than sits. `PannerNode` has no Doppler, so
    // the pitch is bent by hand across the flight.
    if (member.passes) {
      const seconds = member.passes.seconds;
      const flight = seconds[0] + Math.random() * (seconds[1] - seconds[0]);
      const across = bearing + Math.PI / 2 + (Math.random() - 0.5) * 0.7;
      const half = (member.passes.over / 2) * EVENT_BIAS;
      voice.path = {
        from: _point.clone().addScaledVector(_axis.set(Math.cos(across), 0, Math.sin(across)), -half),
        to: _point.clone().addScaledVector(_axis, half),
        start: at,
        length: flight,
      };
      voice.emitter.moveTo(voice.path.from);
      voice.shot.setBend?.(70, flight);
    }

    // The declared level is a **ceiling**. The dice may take an event below it
    // and may never take one above it, which is the whole of "no random harsh
    // loud things" — a source cannot surprise you by being louder than it was
    // ever supposed to be.
    const force =
      (member.level ?? 1) * gainOf(entry.db) * (0.62 + Math.random() * 0.38);
    const busy = voice.shot.fire(at, force);
    voice.busyUntil = at + busy;

    const hold = HOLD * (this.claimed.includes(band) ? CLAIMED_HOLD : 1);
    if (band !== 'floor') this.busy[band] = Math.max(this.busy[band], at + busy * hold);

    // The answer comes from somewhere else, later, and often as a different
    // call — which is what a tawny owl and the bird replying to it actually are.
    if (member.answers && Math.random() < member.answers) {
      const reply = member.answer ?? voiceName;
      const delay = 0.7 + Math.random() * 2.6;
      const echo = { ...member, level: (member.level ?? 1) * 0.8, answers: 0, passes: undefined };
      // Straight to the far side of the ring, not the same throat.
      this.speak(rack, echo, at + busy + delay, reply);
    }
  }

  /**
   * When a cast member may speak again after a hush. Larger `wakes` is an
   * earlier riser, and it comes back first.
   */
  private releasedAt(member: CastMember): number {
    if (this.hushUntil === 0) return 0;
    const wakes = member.when?.wakes ?? 25;
    const share = 1 - Math.min(wakes, 50) / 50;
    return this.hushUntil + share * RECOVER;
  }

  private considerSignal(rack: Rack, now: number, conditions: Conditions): void {
    const signals = rack.spec.signals;
    if (!signals) return;

    // On the hour, whatever else is happening. The clock is the one thing a
    // soundmark is allowed to be predictable about.
    if (conditions.hour !== this.struck) {
      const first = this.struck < 0;
      this.struck = conditions.hour;
      for (const signal of signals) {
        if (first) break;
        if (signal.clock !== 'hour') continue;
        if (openness(signal.when, conditions) < 0.3) continue;
        this.speak(rack, signal, now + LOOKAHEAD);
      }
    }

    for (let i = 0; i < signals.length; i++) {
      const signal = signals[i];
      if (signal.clock === 'hour' || rack.signalDue[i] > now) continue;
      const open = openness(signal.when, conditions);
      if (open < 0.05) {
        rack.signalDue[i] = now + signal.floor;
        continue;
      }
      this.speak(rack, signal, now + LOOKAHEAD);
      if (signal.hushes) this.hush(now);
      const mean = signal.every[0] + Math.random() * (signal.every[1] - signal.every[0]);
      rack.signalDue[i] = now + signal.floor + -Math.log(1 - Math.random()) * (mean / open);
    }
  }

  // --- building ----------------------------------------------------------------

  /**
   * Built on first use rather than up front: a vibe's cast is mostly out of
   * season, out of hours or rained off at any moment, and a voice that has not
   * spoken has cost nothing.
   *
   * Keyed on voice and tier rather than on the cast entry, so two members
   * naming the same bird share one throat. That is where the budget comes from.
   */
  private poolFor(rack: Rack, voice: AmbienceVoice, throats: number): Pool {
    let pool = rack.pools.get(voice);
    if (pool) return pool;

    const entry = VOICES[voice];
    const voices: Held[] = [];
    for (let i = 0; i < throats; i++) {
      const shot = entry.build(this.engine);
      voices.push({
        shot,
        busyUntil: 0,
        path: null,
        emitter: new Emitter(this.engine, shot, {
          position: this.engine.listenerPosition,
          // Flat by construction: the offset exists to give the panner a
          // direction, not to set a level. See `TIERS`.
          refDistance: ((FAR.radius[0] + FAR.radius[1]) / 2) * EVENT_BIAS,
          maxDistance: REACH,
          rolloff: ROLLOFF,
          reverb: 1,
          importance: FAR.importance,
          ignoreAbsorption: true,
          ignoreOcclusion: true,
          out: rack.bus.in,
          send: rack.bus.send,
        }),
      });
    }
    pool = { voices };
    rack.pools.set(voice, pool);
    return pool;
  }

  private rackFor(spec: AmbienceSpec): Rack {
    const existing = this.racks.get(spec);
    if (existing) return existing;

    const context = this.engine.context;
    const dry = context.createGain();
    dry.gain.value = 0;
    dry.connect(this.out);
    const wet = context.createGain();
    wet.gain.value = 0;
    wet.connect(this.wetOut);

    // One chain, shared by everything, rather than a darkened copy per model.
    const nodes: AudioNode[] = [];
    const input = context.createGain();
    const level = context.createGain();
    level.gain.value = FAR.level;

    const tone = context.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = FAR.tone;
    tone.Q.value = 0.5;
    input.connect(tone).connect(level).connect(dry);
    nodes.push(input, tone, level);

    // No early reflections here. The room owns those — see `ROOM_PRESETS` and
    // `EARLY_TAPS` — and a second set on this bus would be a second answer to
    // the same question, so a cave's ambience would come back off outdoor
    // walls. The send below is how this layer reaches them.

    const send = context.createGain();
    send.gain.value = FAR.reverb;
    send.connect(wet);
    nodes.push(send);

    const bus: Bus = { in: input, send, nodes };

    const rack: Rack = {
      spec,
      dry,
      wet,
      bus,
      air: [],
      chorus: [],
      pools: new Map(),
      due: (spec.cast ?? []).map(() => 0),
      signalDue: (spec.signals ?? []).map(() => 0),
      rng: createRng(spec.seed),
      offsets: CYCLES.map((_, i) => createRng(spec.seed + i * 97)() * 1000),
    };

    for (const layer of spec.air) {
      const model = buildModel(this.engine, layer);
      const gain = context.createGain();
      gain.gain.value = 0;
      model.output.connect(gain).connect(dry);
      rack.air.push({ model, gain, follow: layer.follow ?? [], base: layer.gain ?? 1, spec: layer });
    }

    for (const layer of spec.chorus ?? []) {
      const model = buildModel(this.engine, layer);
      const gain = context.createGain();
      gain.gain.value = 0;
      model.output.connect(gain);
      const bearing = rack.rng() * Math.PI * 2;
      const radius = FAR.radius[0] + rack.rng() * (FAR.radius[1] - FAR.radius[0]);
      // An offset from the listener, held for the life of the rack. A vibe's
      // chorus is a ring around you and travels with you; a source that belongs
      // at a coordinate is the zone's own `SoundscapeSpec` and not this.
      const offset = new THREE.Vector3(
        Math.cos(bearing) * radius * CHORUS_BIAS,
        layer.height ?? FAR.lift,
        Math.sin(bearing) * radius * CHORUS_BIAS,
      );
      const emitter = new Emitter(this.engine, faded(model, gain), {
        position: _point.copy(this.engine.listenerPosition).add(offset),
        refDistance: ((FAR.radius[0] + FAR.radius[1]) / 2) * CHORUS_BIAS,
        maxDistance: REACH,
        rolloff: ROLLOFF,
        reverb: 1,
        importance: FAR.importance,
        ignoreAbsorption: true,
        ignoreOcclusion: true,
        out: bus.in,
        send: bus.send,
      });
      rack.chorus.push({
        model,
        gain,
        follow: layer.follow ?? [],
        base: layer.gain ?? 1,
        spec: layer,
        emitter,
        offset,
      });
    }

    this.racks.set(spec, rack);
    return rack;
  }

  private fade(rack: Rack, to: number, seconds: number): void {
    const now = this.engine.context.currentTime;
    for (const gain of [rack.dry, rack.wet]) {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(to, now, seconds / 3);
    }
  }

  /** For the debug readout. */
  get status(): string {
    if (!this.spec) return 'no vibe';
    const voices = this.rack
      ? [...this.rack.pools.values()].reduce((n, pool) => n + pool.voices.length, 0)
      : 0;
    const now = this.engine.context.currentTime;
    // The reduction is the one number that says whether the mix is behaving:
    // anything past a couple of decibels means the book is fighting itself.
    const held = this.limiter.reduction;
    const duck = held < -0.2 ? ` · -${(-held).toFixed(1)}dB` : '';
    if (now < this.hushUntil) return `hushed ${(this.hushUntil - now).toFixed(0)}s`;
    return `live ${this.live.toFixed(2)} · ${voices} throats${duck}`;
  }

  dispose(): void {
    this.ticker.stop();
    for (const rack of this.racks.values()) {
      for (const layer of rack.air) layer.model.dispose();
      // The emitter owns the wrapper, and the wrapper owns the model.
      for (const layer of rack.chorus) layer.emitter.dispose();
      for (const pool of rack.pools.values()) {
        for (const voice of pool.voices) voice.emitter.dispose();
      }
      for (const node of rack.bus.nodes) node.disconnect();
      rack.dry.disconnect();
      rack.wet.disconnect();
    }
    this.racks.clear();
    this.rack = null;
    // Built through `rackFor`, so it was disposed with the rest above.
    this.audition = null;
    this.out.disconnect();
    this.wetOut.disconnect();
  }
}

/**
 * A model behind its own fader, so a chorus layer can answer the conditions
 * before the emitter spatialises it. Forwards everything, because a foliage
 * layer that never has `update` called reads the wind exactly once.
 */
function faded(model: SoundModel, gain: GainNode): SoundModel {
  return {
    output: gain,
    update: (dt, engine, at) => model.update?.(dt, engine, at),
    setActive: (active) => model.setActive?.(active),
    dispose: () => {
      model.dispose();
      gain.disconnect();
    },
  };
}

/**
 * A crossfeed matrix: each channel arrives in the other ear a fraction of a
 * millisecond later, dulled. See `SPREAD`.
 */
function diffuse(context: BaseAudioContext): { input: GainNode; output: GainNode } {
  const input = context.createGain();
  const output = context.createGain();
  const split = context.createChannelSplitter(2);
  const merge = context.createChannelMerger(2);

  input.connect(split);
  split.connect(merge, 0, 0);
  split.connect(merge, 1, 1);

  for (let side = 0; side < 2; side++) {
    const delay = context.createDelay(0.01);
    delay.delayTime.value = 0.00031;
    const shadow = context.createBiquadFilter();
    shadow.type = 'lowpass';
    shadow.frequency.value = SPREAD_HZ;
    shadow.Q.value = 0.5;
    const level = context.createGain();
    level.gain.value = SPREAD;
    split.connect(delay, side).connect(shadow).connect(level);
    level.connect(merge, 0, side === 0 ? 1 : 0);
  }

  merge.connect(output);
  return { input, output };
}

const _point = new THREE.Vector3();
const _axis = new THREE.Vector3();
