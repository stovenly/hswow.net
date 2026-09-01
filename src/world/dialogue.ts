import { holds, type Subject, type WorldState } from './entry';
import type { NpcMark } from './Interaction';
import {
  everyQuest,
  firstStage,
  personById,
  questById,
  traitById,
  type Effect,
  type Speech,
  type Topic,
} from './people';
import type { WorldFlags } from './state';

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
const QUEST = 60;

export interface Answered {
  key: string;
  label: string;
  reply: string;
  then?: readonly Effect[];
}

/** What `giveItem` and `takeItem` reach for. Held by whoever owns the pack. */
export interface Satchel {
  give(builder: string, seed?: number): void;
  take(builder: string): boolean;
}

let satchel: Satchel | null = null;

export function holdSatchel(pack: Satchel | null): void {
  satchel = pack;
}

export interface Conversation {
  greeting: readonly string[];
  farewell: readonly string[];
  topics: readonly Answered[];
}

const NOTHING: readonly string[] = [];

export function converse(mark: NpcMark, state: WorldState, doing?: string): Conversation {
  const person = mark.person ? personById(mark.person) : undefined;
  const carried = state.traitsOf(mark.person ?? '', mark.traits);
  const who: Subject = { person: mark.person, traits: carried, home: person?.home, doing };

  const owners: { speech: Speech; rank: number }[] = [];
  for (const id of carried) {
    const trait = traitById(id);
    if (trait) owners.push({ speech: trait, rank: TRAIT });
  }
  if (person) owners.push({ speech: person, rank: PERSON });
  for (const quest of everyQuest()) {
    if (state.stage(quest.id) <= 0 || state.failed(quest.id)) continue;
    owners.push({ speech: quest, rank: quest.priority ?? QUEST });
  }

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
    if (info) {
      topics.push({ key: topic.key, label: topic.label, reply: info.reply, then: info.then });
    }
  }
  return { greeting, farewell, topics };
}

/** Runs what a line does. Written state only, so it takes the real thing. */
export function apply(
  effects: readonly Effect[] | undefined,
  state: WorldFlags,
  speaker?: string,
): void {
  for (const effect of effects ?? []) {
    switch (effect.do) {
      case 'setFlag':
        state.setFlag(effect.flag, effect.on ?? true);
        break;
      case 'startQuest': {
        const quest = questById(effect.quest);
        if (state.stage(effect.quest) > 0) break;
        reach(state, effect.quest, quest ? firstStage(quest) : 10, speaker);
        break;
      }
      case 'setStage':
        reach(state, effect.quest, effect.stage, speaker);
        break;
      case 'failQuest':
        state.setFailed(effect.quest, true);
        break;
      case 'grantTrait':
      case 'revokeTrait': {
        const person = effect.person ?? speaker;
        if (person) state.grantTrait(person, effect.trait, effect.do === 'grantTrait');
        else console.warn(`dialogue: "${effect.trait}" has nobody named to hang it on`);
        break;
      }
      case 'giveItem':
        if (satchel) satchel.give(effect.builder, effect.seed);
        else console.warn(`dialogue: no pack to give "${effect.builder}" into`);
        break;
      case 'takeItem':
        if (satchel) satchel.take(effect.builder);
        else console.warn(`dialogue: no pack to take "${effect.builder}" from`);
        break;
    }
  }
}

/** Moves a quest to a stage, and runs that stage's own effects the first time. */
function reach(state: WorldFlags, quest: string, at: number, speaker?: string): void {
  const first = !state.stageDone(quest, at);
  state.setStage(quest, at);
  if (!first) return;
  const stage = questById(quest)?.stages?.find((one) => one.at === at);
  apply(stage?.then, state, speaker);
}

/** One of a bank, chosen by the speaker's seed and how many lines have passed. */
export function pick(lines: readonly string[], seed: number, turn: number): string {
  return lines.length === 0 ? '' : lines[(seed + turn * 7) % lines.length];
}
