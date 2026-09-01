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

export interface Info {
  when?: Condition;
  reply: string;
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

const people = new Map<string, PersonDocument>();
const traits = new Map<string, TraitDocument>();

/** Replaces what is held: a project's people and traits, read off its bundle. */
export function holdCast(
  peopleDocs: readonly PersonDocument[],
  traitDocs: readonly TraitDocument[],
): void {
  people.clear();
  traits.clear();
  for (const doc of peopleDocs) people.set(doc.id, doc);
  for (const doc of traitDocs) traits.set(doc.id, doc);
}

export function personById(id: string): PersonDocument | undefined {
  return people.get(id);
}

export function traitById(id: string): TraitDocument | undefined {
  return traits.get(id);
}
