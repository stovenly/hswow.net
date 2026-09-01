import { hailClear, stampHail, type Creature } from './Creature';

/**
 * Two villagers crossing paths.
 *
 * The whole exchange is rolled the moment they meet — who opens, whether there
 * is any small talk, how much — and then played out one line at a time. Rolling
 * it up front is what makes "always close a chat with goodbyes" a property of
 * the list rather than a rule the state machine has to remember.
 */

/** How close two of them have to come. */
const MEET_AT = 2.4;
/** And how far apart before it is abandoned. */
const MEET_LOST = 6;
/** Seconds before the same pair may hail each other again, plus a per-pair spread. */
const PAIR_LOCKOUT = 240;
const PAIR_SPREAD = 120;
/** The beat between one line ending and the answer starting. */
const REPLY_GAP = 0.45;
/** Chance of any small talk at all, and what each further exchange is worth. */
const CHAT_CHANCE = 0.35;
const CHAT_DECAY = 0.4;
/** A line nobody could hear the end of is abandoned after this. */
const TURN_TIMEOUT = 9;

interface Turn {
  who: 0 | 1;
  kind: 'greeting' | 'talk' | 'farewell';
}

interface Meeting {
  pair: [Creature, Creature];
  key: string;
  turns: Turn[];
  at: number;
  /** Wall clock: when the turn in hand may start, and when to give up on it. */
  startAt: number;
  giveUpAt: number;
  started: boolean;
}

function hash(text: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < text.length; i += 1) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return ((h >>> 0) % 100000) / 100000;
}

/** Who opens, and how far the small talk runs. Deterministic in the pair and the count. */
function rollTurns(key: string, meets: number): Turn[] {
  const opener: 0 | 1 = hash(key, meets * 31 + 1) < 0.5 ? 0 : 1;
  const other: 0 | 1 = opener === 0 ? 1 : 0;
  const turns: Turn[] = [
    { who: opener, kind: 'greeting' },
    { who: other, kind: 'greeting' },
  ];
  let chance = CHAT_CHANCE;
  for (let round = 0; round < 4; round += 1) {
    if (hash(key, meets * 31 + 7 + round) >= chance) break;
    turns.push({ who: opener, kind: 'talk' }, { who: other, kind: 'talk' });
    chance *= CHAT_DECAY;
  }
  // Hello and hello alone ends unceremoniously; anything longer is closed off.
  if (turns.length > 2) turns.push({ who: opener, kind: 'farewell' }, { who: other, kind: 'farewell' });
  return turns;
}

export class Meetings {
  private readonly live: Meeting[] = [];
  /** Wall-clock time a pair is free to meet again. */
  private readonly lockout = new Map<string, number>();
  /** Everyone in a live meeting, including one whose opener has yet to speak. */
  private readonly engaged = new Set<Creature>();
  private count = 0;

  /** For the readout: meetings running right now. */
  get running(): number {
    return this.live.length;
  }

  clear(): void {
    for (const meeting of this.live) {
      meeting.pair[0].endMeet();
      meeting.pair[1].endMeet();
    }
    this.live.length = 0;
    this.engaged.clear();
    this.lockout.clear();
  }

  update(awake: readonly Creature[], now: number, audioNow: number): void {
    this.drive(now, audioNow);
    this.look(awake, now);
  }

  private drive(now: number, audioNow: number): void {
    for (let i = this.live.length - 1; i >= 0; i -= 1) {
      const meeting = this.live[i];
      const [a, b] = meeting.pair;
      const gone =
        (meeting.started && (!a.inMeeting || !b.inMeeting)) ||
        a.inConverse ||
        b.inConverse ||
        apart(a, b) > MEET_LOST;
      if (gone) {
        this.close(meeting, i, now);
        continue;
      }
      const turn = meeting.turns[meeting.at];
      if (!turn) {
        this.close(meeting, i, now);
        continue;
      }
      const speaker = meeting.pair[turn.who];
      if (!meeting.started) {
        if (now < meeting.startAt) continue;
        // A hail never lands on the heels of somebody else's.
        if (!hailClear(now)) continue;
        stampHail(now);
        speaker.meet(meeting.pair[turn.who === 0 ? 1 : 0], turn.kind);
        meeting.started = true;
        meeting.giveUpAt = now + TURN_TIMEOUT;
        continue;
      }
      if (speaker.saying(audioNow) && now < meeting.giveUpAt) continue;
      meeting.at += 1;
      meeting.started = false;
      meeting.startAt = now + REPLY_GAP;
    }
  }

  private close(meeting: Meeting, index: number, now: number): void {
    meeting.pair[0].endMeet();
    meeting.pair[1].endMeet();
    this.engaged.delete(meeting.pair[0]);
    this.engaged.delete(meeting.pair[1]);
    this.live.splice(index, 1);
    this.lockout.set(meeting.key, now + PAIR_LOCKOUT + hash(meeting.key, 0) * PAIR_SPREAD);
  }

  private look(awake: readonly Creature[], now: number): void {
    for (const [key, until] of this.lockout) if (now > until) this.lockout.delete(key);
    for (let i = 0; i < awake.length; i += 1) {
      const a = awake[i];
      if (a.spec.kind !== 'biped' || !a.idleEnough || this.engaged.has(a)) continue;
      for (let k = i + 1; k < awake.length; k += 1) {
        const b = awake[k];
        if (b.spec.kind !== 'biped' || !b.idleEnough || this.engaged.has(b)) continue;
        if (apart(a, b) > MEET_AT) continue;
        const key = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;
        if (this.lockout.has(key)) continue;
        // A street where the same two hail each other every lap is worse than
        // one where they never do.
        this.lockout.set(key, now + PAIR_LOCKOUT + hash(key, 0) * PAIR_SPREAD);
        this.engaged.add(a);
        this.engaged.add(b);
        this.live.push({
          pair: [a, b],
          key,
          turns: rollTurns(key, this.count++),
          at: 0,
          startAt: now,
          giveUpAt: now + TURN_TIMEOUT,
          started: false,
        });
        break;
      }
    }
  }
}

function apart(a: Creature, b: Creature): number {
  return Math.hypot(a.mesh.position.x - b.mesh.position.x, a.mesh.position.z - b.mesh.position.z);
}
