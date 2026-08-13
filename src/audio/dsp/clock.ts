/**
 * Scheduling events on the audio clock instead of the frame clock.
 *
 * **There are two clocks and only one of them is trustworthy.** `AudioContext`'s
 * is sample-accurate; `requestAnimationFrame`'s drifts, stutters and stops
 * entirely when the tab is occluded. Anything rhythmic driven from the frame
 * loop inherits every hitch the renderer has, and a footstep or a clank landing
 * four milliseconds late is audible in a way a dropped frame is not.
 *
 * The standard answer is to schedule *ahead*: each frame, queue every event due
 * within the next lookahead window, and let Web Audio place them exactly. The
 * frame loop then only has to run often enough to keep the window fed, which is
 * a far weaker requirement than being on time.
 *
 * This was written three times — in `foliage`, in `machine`, and again in
 * `footsteps` — before being pulled out here. The cursor arithmetic is easy to
 * get subtly wrong in ways that only show up as a texture that is *slightly*
 * mechanical, so it is worth having once.
 */

/**
 * How far ahead to queue.
 *
 * Sized against frame *gaps*, not frame time: any gap longer than this empties
 * the queue and forces a resync, which is what a machine busy with something
 * else sounds like from the inside. Reactive sounds are scheduled at
 * `currentTime` and never come through here, so the only cost is that a source
 * changing rate takes up to this long to be heard doing it.
 */
const LOOKAHEAD = 0.4;

/**
 * Ceiling on events queued per pump.
 *
 * A guard against a pathological `dt` — an alt-tab, a breakpoint, a laptop
 * waking up — asking for tens of thousands of events at once and locking the
 * main thread. The cursor is reset rather than allowed to catch up.
 *
 * Scaled with the window: the densest texture in the game is rain on canopy at
 * 420 events a second, which fills the lookahead with about 170. The cap has to
 * sit well above that to stay a guard rather than a throttle.
 */
const MAX_PER_PUMP = 400;

/** Seconds until the next event. Return a fresh value per call. */
export type Gap = () => number;

/**
 * What to do when the cursor has fallen behind the present.
 *
 * Happens on the first pump, on returning from silence, and after any frame
 * hitch longer than the lookahead.
 *
 * - `'immediate'` — resume at once. Right for textures, where the events are
 *   not individually audible and a gap is more noticeable than a resync.
 * - `'oneGap'` — wait one interval first. Right for anything whose events *are*
 *   individually audible, where resuming immediately puts an unscheduled hit
 *   at the exact moment the source becomes audible, which reads as a glitch
 *   rather than as the machine it belongs to.
 */
export type Resync = 'immediate' | 'oneGap';

export interface EventClock {
  /**
   * Queues everything due inside the lookahead window.
   *
   * @param fire Called with the exact audio time each event should start at.
   *   It must schedule, not play — the time is in the future.
   */
  pump(fire: (at: number) => void, gap: Gap, resync?: Resync): void;
  /**
   * Drops the cursor to now.
   *
   * Called when a source comes back after being silent. Without it, a model
   * that went virtual for four minutes returns and tries to queue four minutes
   * of backlog into the next lookahead window.
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
 * Exponentially distributed gaps — a Poisson process.
 *
 * **This is the one that matters for texture.** Events at even intervals sound
 * like a buzz at the event rate, which is exactly what granular foliage and
 * scattering gravel are trying not to be. Exponential gaps are what "random
 * arrivals at an average rate" actually means, and the ear knows the
 * difference immediately even when it cannot say why.
 *
 * @param rate Events per second, averaged.
 */
export function poisson(rate: number): Gap {
  const safe = Math.max(rate, 0.01);
  // `1 - random()` rather than `random()`: Math.random can return exactly 0,
  // and log(0) is -Infinity.
  return () => -Math.log(1 - Math.random()) / safe;
}

/**
 * Regular intervals with a little wander.
 *
 * For things that genuinely are periodic — a shaft turning, a pump — where the
 * rate itself is the information. A *perfectly* periodic train is a metronome,
 * and the ear latches onto metronomes and stops believing them, so a few
 * percent of jitter is what keeps a machine mechanical rather than digital.
 *
 * @param jitter Fraction of the period, plus or minus.
 */
export function periodic(period: number, jitter = 0.06): Gap {
  return () => period * (1 + (Math.random() * 2 - 1) * jitter);
}

/**
 * A gap whose rate can be moved without building a new one.
 *
 * `poisson` and `periodic` capture their rate, which is right for a source
 * whose rate is fixed when it is built. A model that recomputes its rate from
 * the weather or a machine's speed every frame allocates a closure every frame
 * instead, per emitter — and allocation rate, not total garbage, is what drives
 * the young-generation scavenges that read as micro-stutter. Same numbers, one
 * object for the life of the model.
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
