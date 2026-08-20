/**
 * Scheduling on the audio clock, which is sample-accurate, rather than the
 * frame clock, which drifts and stops on an occluded tab. Each frame, queue
 * every event due inside the lookahead and let Web Audio place it exactly.
 */

/**
 * How far ahead to queue, in seconds. Sized against frame *gaps*: a gap longer
 * than this empties the queue and forces a resync. Reactive sounds go at
 * `currentTime` and never come through here.
 */
const LOOKAHEAD = 0.4;

/**
 * Ceiling on events queued per pump, guarding against a pathological `dt`
 * asking for tens of thousands at once. Rain on canopy, the densest texture
 * here at 420 a second, fills the window with about 170.
 */
const MAX_PER_PUMP = 400;

/** Seconds until the next event. Return a fresh value per call. */
export type Gap = () => number;

/**
 * What to do when the cursor has fallen behind the present.
 *
 * - `'immediate'` for textures, where a gap is more noticeable than a resync.
 * - `'oneGap'` for individually audible events, where resuming at once puts an
 *   unscheduled hit at the moment the source becomes audible.
 */
export type Resync = 'immediate' | 'oneGap';

export interface EventClock {
  /**
   * Queues everything due inside the lookahead. `fire` is handed the exact
   * audio time and must schedule, not play — the time is in the future.
   */
  pump(fire: (at: number) => void, gap: Gap, resync?: Resync): void;
  /**
   * Drops the cursor to now. Call it when a source comes back after silence, or
   * it tries to queue the whole backlog into the next window.
   */
  reset(): void;
}

export function createEventClock(
  context: BaseAudioContext,
  lookahead = LOOKAHEAD,
): EventClock {
  let cursor = 0;

  return {
    pump(fire, gap, resync = 'immediate') {
      const now = context.currentTime;
      // Behind the present means either the first pump or a return from
      // silence. Either way the backlog is not worth hearing.
      if (cursor < now) cursor = now + (resync === 'oneGap' ? gap() : 0);

      const horizon = now + lookahead;
      let queued = 0;
      while (cursor < horizon && queued < MAX_PER_PUMP) {
        fire(cursor);
        cursor += Math.max(gap(), 1e-4);
        queued++;
      }
    },

    reset() {
      cursor = 0;
    },
  };
}

/**
 * Exponentially distributed gaps — a Poisson process, `rate` in events per
 * second. Even intervals buzz at the event rate; this is what random arrivals
 * at an average rate actually sound like.
 */
export function poisson(rate: number): Gap {
  const safe = Math.max(rate, 0.01);
  // `1 - random()` rather than `random()`: Math.random can return exactly 0,
  // and log(0) is -Infinity.
  return () => -Math.log(1 - Math.random()) / safe;
}

/**
 * Regular intervals with `jitter` as a fraction of the period either way. For
 * things that genuinely are periodic; a perfect train reads as a metronome.
 */
export function periodic(period: number, jitter = 0.06): Gap {
  return () => period * (1 + (Math.random() * 2 - 1) * jitter);
}

/**
 * A gap whose rate can be moved without building a new one. `poisson` and
 * `periodic` capture their rate, so a model recomputing it from the weather
 * every frame would allocate a closure per emitter per frame.
 */
export interface Rated {
  (): number;
  /** Events per second for `poissonGap`, seconds per event for `periodicGap`. */
  rate: number;
}

/** `poisson`, reusable. See `Rated`. */
export function poissonGap(initial = 1): Rated {
  const gap: Rated = Object.assign(() => -Math.log(1 - Math.random()) / Math.max(gap.rate, 0.01), {
    rate: initial,
  });
  return gap;
}

/** `periodic`, reusable. See `Rated`. */
export function periodicGap(initial = 1, jitter = 0.06): Rated {
  const gap: Rated = Object.assign(() => gap.rate * (1 + (Math.random() * 2 - 1) * jitter), {
    rate: initial,
  });
  return gap;
}
