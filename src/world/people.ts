import type { Condition } from './entry';

/**
 * Who somebody is, and what they are.
 *
 * A **trait** is what somebody is — `villager`, `trader` — and is granted by the
 * zone they stand in, by their placement, or by the person they are. A
 * **person** is who they are: a name, the body they wear, and what only they
 * know. Both contribute the same thing to a conversation, which is why they
 * share `Speech`.
 *
 * Documents live in a project's `content/traits/` and `content/people/`, and are
 * held here as they are read, before any zone is interpreted.
 */

/** Where somebody comes from: their dress, their mask and their lect. */
export type Folk = 'country' | 'city';

/**
 * What saying a line does. A fixed vocabulary of records, never a script: a
 * line that needs more than these offers is a line to reconsider. `person`
 * defaults to whoever is speaking.
 */
export type Effect =
  | { do: 'setFlag'; flag: string; on?: boolean }
  | { do: 'startQuest'; quest: string }
  | { do: 'setStage'; quest: string; stage: number }
  | { do: 'failQuest'; quest: string }
  | { do: 'grantTrait'; trait: string; person?: string }
  | { do: 'revokeTrait'; trait: string; person?: string }
  | { do: 'giveItem'; builder: string; seed?: number }
  | { do: 'takeItem'; builder: string };

export interface Info {
  when?: Condition;
  reply: string;
  then?: readonly Effect[];
}

export interface Topic {
  /** What a topic is matched on across owners. Stable; the label is not. */
  key: string;
  label: string;
  when?: Condition;
  /** Overrides the owner's own rank, to jump the order. */
  priority?: number;
  infos: readonly Info[];
}

/** What one owner brings to a conversation. */
export interface Speech {
  greeting?: readonly string[];
  farewell?: readonly string[];
  topics?: readonly Topic[];
}

export interface TraitDocument extends Speech {
  id: string;
  /** What the crosshair calls somebody who has no name of their own. */
  name?: string;
}

/** What a named person wears. Every field wins over the placement's. */
export interface Body {
  builder?: string;
  seed?: number;
  folk?: Folk;
  face?: string;
  scale?: number;
  options?: Record<string, unknown>;
}

export interface PersonDocument extends Speech {
  id: string;
  name: string;
  body?: Body;
  /** The zone they belong in, which is what `atHome` compares against. */
  home?: string;
  traits?: readonly string[];
}

/**
 * One step of a quest. `at` is sparse — author 10, 20, 30 — so a step can be
 * put between two later without renumbering what dialogue already names.
 */
export interface Stage {
  at: number;
  /** What the journal will read. Nothing reads it yet. */
  log?: string;
  /** Run once, the first time this stage is reached. */
  then?: readonly Effect[];
}

export interface QuestDocument extends Speech {
  id: string;
  name: string;
  /** Where its topics sit against a trait's and a person's. */
  priority?: number;
  /** Role name to person id, so recasting is one edit. */
  cast?: Record<string, string>;
  stages?: readonly Stage[];
}

const people = new Map<string, PersonDocument>();
const traits = new Map<string, TraitDocument>();
const quests = new Map<string, QuestDocument>();

/** Replaces what is held: a project's people, traits and quests, off its bundle. */
export function holdCast(
  peopleDocs: readonly PersonDocument[],
  traitDocs: readonly TraitDocument[],
  questDocs: readonly QuestDocument[] = [],
): void {
  people.clear();
  traits.clear();
  quests.clear();
  for (const doc of peopleDocs) people.set(doc.id, doc);
  for (const doc of traitDocs) traits.set(doc.id, doc);
  for (const doc of questDocs) quests.set(doc.id, doc);
}

export function personById(id: string): PersonDocument | undefined {
  return people.get(id);
}

export function traitById(id: string): TraitDocument | undefined {
  return traits.get(id);
}

export function questById(id: string): QuestDocument | undefined {
  return quests.get(id);
}

export function everyQuest(): readonly QuestDocument[] {
  return [...quests.values()];
}

/** The stage a quest opens at: its lowest authored step. */
export function firstStage(quest: QuestDocument): number {
  let first = Infinity;
  for (const stage of quest.stages ?? []) first = Math.min(first, stage.at);
  return Number.isFinite(first) ? first : 10;
}
