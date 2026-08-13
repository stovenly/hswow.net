import { human } from './voice';

/**
 * The mono wind core — a pool of persistent players for the blown voices.
 *
 * A wind phrase is one breath, not a row of separate notes: the player tongues
 * the first note, glides through the joins, and lets the last one taper off.
 * An oscillator per note re-tongues every join and gates every ending, and
 * that re-tonguing is the harsh stop-start the winds were doing. So a wind
 * instrument here is a few players that never stop — each an oscillator chain
 * whose envelope idles at zero — and a note is a decision about which player
 * carries it and how.
 *
 * **Legato is read from timing alone.** The director already writes phrases
 * with the notes overlapping slightly; a note that starts while a player is
 * still sounding *joins* it — the pitch glides over ~20 ms under a small
 * breath dip, and there is no new attack. A note that finds only silent
 * players is a phrase start and gets the tongued front. Every note's end is
 * written as a full phrase ending — a decrescendo into a close, the colour
 * darkening alongside — and a join simply cancels the ending it arrived
 * before. Nothing upstream declares phrases; the voice contract is unchanged.
 */

export interface MonoVoice {
  /** The envelope the pool schedules on. Idles at zero; the player runs on. */
  envelope: GainNode;
  /** Moves every per-note parameter. A join glides; a phrase start may jump. */
  tune(at: number, freq: number, velocity: number, glide: boolean, until: number): void;
  /** The phrase-end colour: darken alongside the closing gain. */
  taper(at: number, release: number): void;
  dispose(): void;
}

export interface MonoPoolOptions {
  /** Pool size. Two carries a root-and-fifth drone; three is the default headroom. */
  voices?: number;
  /** Max semitones a join may glide. A note farther out takes a fresh player. */
  span?: number;
  /** Seconds the tongued front takes to speak; the time constant is a third. */
  attack: number;
  /** Seconds a phrase end takes to close; the time constant is a third. */
  release: number;
  /** Envelope peak for a velocity. */
  peak(velocity: number): number;
}

export interface MonoPool {
  note(at: number, freq: number, velocity: number, duration: number): void;
  dispose(): void;
}

interface Player {
  voice: MonoVoice;
  start: number;
  end: number;
  freq: number;
  peak: number;
}

/**
 * A join must find a note that actually got going. Simultaneous notes — a
 * drone's root and fifth — land inside this window of each other and spread
 * across players instead of stealing the one that just spoke.
 */
const SETTLED = 0.15;

export function createMonoPool(
  context: BaseAudioContext,
  build: () => MonoVoice,
  options: MonoPoolOptions,
): MonoPool {
  const players: Player[] = Array.from({ length: options.voices ?? 3 }, () => ({
    voice: build(),
    start: -Infinity,
    end: -Infinity,
    freq: 440,
    peak: 0,
  }));

  const nearest = (from: readonly Player[], freq: number): Player =>
    from.reduce((a, b) =>
      Math.abs(Math.log(freq / a.freq)) <= Math.abs(Math.log(freq / b.freq)) ? a : b,
    );

  return {
    note(at, freq, velocity, duration) {
      const n = human(context, at, freq, velocity);
      const sounding = players.filter((p) => p.end > n.at && n.at - p.start >= SETTLED);
      const idle = players.filter((p) => p.end <= n.at);
      // A note over a sounding player joins it, nearest pitch first — but
      // only within the voice's `span`: past it a glide is a swoop, and the
      // note takes a fresh player instead. Failing that, the player quiet
      // longest speaks fresh. Failing *that* — more simultaneous notes than
      // players — the nearest is bent rather than re-struck, because a fresh
      // attack on a sounding player is a click.
      const reach = options.span ?? Infinity;
      const joinable = sounding.filter((p) => Math.abs(Math.log2(n.freq / p.freq)) * 12 <= reach);
      const join = joinable.length > 0 || idle.length === 0;
      const player =
        joinable.length > 0
          ? nearest(joinable, n.freq)
          : idle.length > 0
            ? idle.reduce((a, b) => (a.end <= b.end ? a : b))
            : nearest(sounding.length > 0 ? sounding : players, n.freq);

      const peak = options.peak(n.velocity);
      const end = n.at + duration;
      const g = player.voice.envelope.gain;

      g.cancelScheduledValues(n.at);
      if (join) {
        // The breath at the join: down toward 70 % for ~30 ms, then up.
        g.setTargetAtTime(Math.min(peak, player.peak) * 0.7, n.at, 0.012);
        g.setTargetAtTime(peak, n.at + 0.03, 0.02);
      } else {
        g.setTargetAtTime(peak, n.at, options.attack / 3);
      }
      player.voice.tune(n.at, n.freq, n.velocity, join, end);

      // Every note ends as a phrase until a join says otherwise: level falls
      // away through the last stretch, then the close. A following note
      // cancels this; nothing follows and it *is* the phrase end.
      const settle = Math.max(n.at + options.attack, end - Math.min(0.45, duration * 0.35));
      g.setTargetAtTime(peak * 0.55, settle, 0.15);
      g.setTargetAtTime(0, end, options.release / 3);
      player.voice.taper(end, options.release);

      player.start = n.at;
      player.end = end;
      player.freq = n.freq;
      player.peak = peak;
    },

    dispose() {
      for (const player of players) player.voice.dispose();
    },
  };
}
