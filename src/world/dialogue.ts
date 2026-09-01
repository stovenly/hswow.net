import { holds, type Subject, type WorldState } from './entry';
import type { NpcMark } from './Interaction';
import { personById, traitById, type Speech, type Topic } from './people';

/**
 * What somebody has to say, gathered from everything they are.
 *
 * Traits and people contribute topics into one pool. A key clash is settled by
 * rank — a person outranks a trait, and a trait granted later outranks one
 * granted earlier, which is how a visitor's own trait beats the one the zone
 * hands everybody standing in it.
 */

const TRAIT = 0;
const PERSON = 20;

export interface Answered {
  key: string;
  label: string;
  reply: string;
}

export interface Conversation {
  greeting: readonly string[];
  farewell: readonly string[];
  topics: readonly Answered[];
}

const NOTHING: readonly string[] = [];

export function converse(mark: NpcMark, state: WorldState, doing?: string): Conversation {
  const person = mark.person ? personById(mark.person) : undefined;
  const who: Subject = { person: mark.person, traits: mark.traits, home: person?.home, doing };

  const owners: { speech: Speech; rank: number }[] = [];
  for (const id of mark.traits) {
    const trait = traitById(id);
    if (trait) owners.push({ speech: trait, rank: TRAIT });
  }
  if (person) owners.push({ speech: person, rank: PERSON });

  let greeting = NOTHING;
  let farewell = NOTHING;
  const held = new Map<string, { rank: number; topic: Topic }>();
  for (const owner of owners) {
    if (owner.speech.greeting?.length) greeting = owner.speech.greeting;
    if (owner.speech.farewell?.length) farewell = owner.speech.farewell;
    for (const topic of owner.speech.topics ?? []) {
      const rank = topic.priority ?? owner.rank;
      const standing = held.get(topic.key);
      if (standing && standing.rank > rank) continue;
      held.set(topic.key, { rank, topic });
    }
  }

  // A topic none of whose infos hold has nothing to say and does not appear.
  // Saying so is a line somebody writes: an info with no `when`, last.
  const topics: Answered[] = [];
  for (const { topic } of held.values()) {
    if (!holds(topic.when, state, who)) continue;
    const info = topic.infos.find((one) => holds(one.when, state, who));
    if (info) topics.push({ key: topic.key, label: topic.label, reply: info.reply });
  }
  return { greeting, farewell, topics };
}

/** One of a bank, chosen by the speaker's seed and how many lines have passed. */
export function pick(lines: readonly string[], seed: number, turn: number): string {
  return lines.length === 0 ? '' : lines[(seed + turn * 7) % lines.length];
}
