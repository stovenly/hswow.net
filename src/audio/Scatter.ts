import * as THREE from 'three';
import type { AudioEngine } from './AudioEngine';
import { Emitter, type SoundModel } from './Emitter';
import { createEventClock, periodic, poisson, type EventClock, type Gap } from './dsp/clock';
import { createDrip, type DripOptions } from './oneshots/drip';
import { createBell, type BellOptions } from './oneshots/bell';
import { createHammer, type HammerOptions } from './oneshots/hammer';
import { createClatter, type ClatterOptions } from './oneshots/clatter';
import { createAnimal, type AnimalOptions } from './oneshots/animal';
import type { VoiceOptions } from './oneshots/voice';
import { createVoice } from './voice/Voice';

/**
 * Sounds that happen once, somewhere over there, every so often.
 *
 * **This is the missing primitive.** Every model in the library up to here is a
 * continuous emitter that lives at a fixed point and never stops — wind,
 * foliage, a mill, a fire. Continuous sources establish that a place exists.
 * They cannot establish that anybody *lives* in it, because the sounds people
 * make are intermittent, and they come from somewhere slightly different every
 * time.
 *
 * A hammer two streets over, once every twenty seconds, from a slightly
 * different spot, does more for a village than any three continuous models. It
 * is also the cheapest thing in the library: nothing runs between events.
 *
 * ## Poisson, not a timer
 *
 * Gaps are exponentially distributed. A one-shot every twelve seconds *exactly*
 * is a clock, and the ear finds clocks in about three repetitions; the same
 * mean with exponential gaps sometimes gives you two in a row and sometimes
 * gives you forty seconds of nothing, which is what intermittent human activity
 * actually looks like. This matters far more here than it does inside a
 * texture, because these events are individually audible by design.
 *
 * The clock resyncs with `'oneGap'` for the same reason: resuming immediately
 * would put a hammer blow at the precise instant you walked into range, which
 * reads as a trigger rather than as a village.
 *
 * ## Voices
 *
 * Each field owns a small pool of `Emitter`s, and each emitter wraps its own
 * copy of the one-shot. That buys spatialisation, air absorption, occlusion and
 * detail-level management for free — a scatter field beyond the voice budget
 * goes virtual and stops scheduling entirely, which is the whole reason the
 * emitter rework came first.
 *
 * A voice is busy until its event has rung out, because the one-shot's
 * resonators are shared across the strikes it makes: firing twice into one
 * hammer rings one anvil twice, not two anvils. Two is usually enough. If every
 * voice is busy the event is simply dropped — an ambience that misses one
 * bucket is indistinguishable from one that did not, and the alternative is
 * unbounded node allocation on a mistyped interval.
 */

/**
 * A sound with a beginning and an end.
 *
 * Extends `SoundModel` so an `Emitter` can carry one unmodified — the whole
 * spatial chain works the same whether what is upstream of it runs forever or
 * for a fifth of a second.
 */
export interface OneShot extends SoundModel {
  /**
   * Schedules one event.
   *
   * @param at Audio-clock time. In the future; this schedules, it does not play.
   * @param force Scales the event, 0..1-ish.
   * @returns Seconds this voice stays busy, including the ring-out.
   */
  fire(at: number, force: number): number;
  /**
   * The syllables of the last call, on the audio clock — for whatever moves
   * with the sound. Voiced models keep it current; the rest leave it out.
   */
  readonly syllables?: readonly { at: number; length: number }[];
}

export type OneShotSpec =
  | { sound: 'hammer'; options?: HammerOptions }
  | { sound: 'clatter'; options?: ClatterOptions }
  | { sound: 'animal'; options?: AnimalOptions }
  | { sound: 'voice'; options?: VoiceOptions }
  | { sound: 'drip'; options?: DripOptions }
  | { sound: 'bell'; options?: BellOptions };

export type ScatterSpec = OneShotSpec & {
  id?: string;
  /** Centre of the region events land in. */
  at: readonly [number, number, number];
  /**
   * Half-extents of that region.
   *
   * Not decoration. A source that comes from an identical point every time is
   * heard as a loudspeaker; a few metres of wander is heard as a person moving
   * about their work. Default is flat and modest — most activity happens on the
   * ground and within a yard.
   */
  spread?: readonly [number, number, number];
  /** Mean seconds between events. Exponentially distributed by default. */
  every: number;
  /**
   * How the gaps are distributed.
   *
   * `'poisson'` for anything a person or animal does, which is nearly
   * everything. `'periodic'` for the few sources that genuinely are regular:
   * water accumulating at a fixed rate and falling at a fixed volume is the
   * clear case, and a drip scattered by a Poisson process reads as several
   * leaks rather than one.
   */
  rhythm?: 'poisson' | 'periodic';
  /** Level range per event. Variation is most of what stops repetition. */
  force?: readonly [number, number];
  /** Simultaneous events. Two is usually plenty. */
  voices?: number;

  refDistance?: number;
  maxDistance?: number;
  rolloff?: number;
  reverb?: number;
  importance?: number;
  ignoreAbsorption?: boolean;
  ignoreOcclusion?: boolean;
  invertDistance?: boolean;
};

/**
 * Builds a one-shot from its spec.
 *
 * Exported for the audition harness, which measures one-shots the same way it
 * measures continuous models and would otherwise need a second copy of this
 * switch — the exact duplication the discriminated union exists to avoid.
 */
export function buildOneShot(engine: AudioEngine, spec: OneShotSpec): OneShot {
  switch (spec.sound) {
    case 'hammer':
      return createHammer(engine, spec.options);
    case 'clatter':
      return createClatter(engine, spec.options);
    case 'animal':
      return createAnimal(engine, spec.options);
    case 'voice':
      return createVoice(engine, spec.options);
    case 'drip':
      return createDrip(engine, spec.options);
    case 'bell':
      return createBell(engine, spec.options);
  }
}

interface Voice {
  shot: OneShot;
  emitter: Emitter;
  /** Audio-clock time this voice is free again. */
  busyUntil: number;
}

const DEFAULT_SPREAD: readonly [number, number, number] = [5, 0.4, 5];

export class ScatterField {
  private readonly context: BaseAudioContext;
  private readonly voices: Voice[] = [];
  private readonly clock: EventClock;
  private readonly centre = new THREE.Vector3();
  private readonly spread = new THREE.Vector3();
  private readonly force: readonly [number, number];
  private readonly gap: Gap;
  private active = true;

  constructor(engine: AudioEngine, spec: ScatterSpec) {
    this.context = engine.context;
    this.centre.set(...spec.at);
    this.spread.set(...(spec.spread ?? DEFAULT_SPREAD));
    this.force = spec.force ?? [0.55, 1];
    const every = Math.max(spec.every, 0.05);
    // Even a periodic source wanders a little — nothing physical keeps time
    // perfectly, and a train the ear can predict exactly stops being heard.
    this.gap = spec.rhythm === 'periodic' ? periodic(every, 0.09) : poisson(1 / every);
    this.clock = createEventClock(engine.context);

    const count = Math.max(1, spec.voices ?? 2);
    for (let i = 0; i < count; i++) {
      const shot = buildOneShot(engine, spec);
      this.voices.push({
        shot,
        busyUntil: 0,
        emitter: new Emitter(engine, shot, {
          // Placed at the centre to start with, so the engine's very first
          // detail assignment sees a sensible distance rather than the origin.
          position: this.centre,
          refDistance: spec.refDistance,
          maxDistance: spec.maxDistance,
          rolloff: spec.rolloff,
          reverb: spec.reverb,
          importance: spec.importance,
          ignoreAbsorption: spec.ignoreAbsorption,
          ignoreOcclusion: spec.ignoreOcclusion,
          invertDistance: spec.invertDistance,
        }),
      });
    }
  }

  setActive(active: boolean): void {
    if (active === this.active) return;
    this.active = active;
    if (active) this.clock.reset();
    for (const voice of this.voices) voice.emitter.enabled = active;
  }

  update(dt: number, collider: Parameters<Emitter['update']>[1], retestOcclusion: boolean): void {
    for (const voice of this.voices) voice.emitter.update(dt, collider, retestOcclusion);
    if (!this.active) return;

    // Nothing to schedule into if every voice has been dropped from the budget.
    // The clock still advances on the next pump from `now`, so coming back into
    // range does not fire a backlog.
    if (this.voices.every((voice) => voice.emitter.isVirtual)) {
      this.clock.reset();
      return;
    }

    this.clock.pump(
      (at) => this.fire(at),
      this.gap,
      // Individually audible events. See the class doc.
      'oneGap',
    );
  }

  private fire(at: number): void {
    const voice = this.voices.find((candidate) => candidate.busyUntil <= at);
    // Every voice still ringing. Dropping the event is correct — see the class
    // doc — and cheaper than the alternatives by a wide margin.
    if (!voice || voice.emitter.isVirtual) return;

    _point.set(
      this.centre.x + (Math.random() * 2 - 1) * this.spread.x,
      this.centre.y + (Math.random() * 2 - 1) * this.spread.y,
      this.centre.z + (Math.random() * 2 - 1) * this.spread.z,
    );
    voice.emitter.moveTo(_point);

    const [low, high] = this.force;
    const busy = voice.shot.fire(at, low + Math.random() * (high - low));
    voice.busyUntil = at + busy;
  }

  /**
   * Fires one event now, ignoring the schedule.
   *
   * Tuning a sound whose whole design is that it happens every twenty seconds
   * is otherwise mostly waiting, and waiting is how a parameter gets changed
   * twice between hearings.
   */
  trigger(): void {
    this.fire(this.context.currentTime + 0.02);
  }

  /** The one-shots themselves, so a tuning panel can reach their controls. */
  get shots(): readonly OneShot[] {
    return this.voices.map((voice) => voice.shot);
  }

  get voiceCount(): number {
    return this.voices.length;
  }

  dispose(): void {
    // Disposing the emitter disposes its model, which is the one-shot.
    for (const voice of this.voices) voice.emitter.dispose();
    this.voices.length = 0;
  }
}

const _point = new THREE.Vector3();
