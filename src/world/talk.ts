/**
 * What a villager says when you talk to them.
 *
 * **Every line here is a placeholder.** The keyword system in `MASTER-SPEC.md`
 * Phase 8 replaces this table with per-NPC topics, rebuffs and conditions; the
 * shape is keyed so that swap does not move the interface.
 */

export type Folk = 'country' | 'city';

export interface Topic {
  /** What Phase 8 will match on. Stable; the label is not. */
  readonly key: string;
  readonly label: string;
  readonly reply: string;
}

export interface TalkScript {
  readonly name: string;
  readonly greeting: readonly string[];
  readonly farewell: readonly string[];
  readonly topics: readonly Topic[];
}

export const SCRIPTS: Record<Folk, TalkScript> = {
  country: {
    name: 'Villager',
    greeting: [
      'Good day to you.',
      'You are about early.',
      'Well met, stranger.',
      'Come far, have you?',
    ],
    farewell: ['Mind the road.', 'Good day, then.', 'Off with you, and keep well.'],
    topics: [
      {
        key: 'village',
        label: 'Village',
        reply:
          'This is the whole of it. The well, the green, and the road out. ' +
          'We keep to ourselves and the season keeps to us.',
      },
      {
        key: 'city',
        label: 'City',
        reply: 'The city? I went once. Too many walls and not one of them mine.',
      },
    ],
  },
  city: {
    name: 'Cityfolk',
    greeting: ['You have business?', 'Speak, then.', 'A moment, no longer.'],
    farewell: ['We are finished.', 'Go on, then.', 'That will do.'],
    topics: [
      {
        key: 'village',
        label: 'Village',
        reply: 'Out past the gate, where the roads give up. They grow things. It suits them.',
      },
      {
        key: 'city',
        label: 'City',
        reply:
          'You are standing in it. Keep to the lit streets and do not ask after the quarter ' +
          'below the cistern.',
      },
    ],
  },
};

/** One of a bank, chosen by the speaker's seed and how many lines have passed. */
export function pick(lines: readonly string[], seed: number, turn: number): string {
  return lines[(seed + turn * 7) % lines.length];
}
