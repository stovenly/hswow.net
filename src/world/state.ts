import type { WorldState } from './entry';

/**
 * What a `when` is evaluated against.
 *
 * A stub until the quest system exists: flags and quest stages held in memory,
 * set by the editor's layer panel and by nothing else yet. Player saves do not
 * touch it and it is never written to a document.
 */

export type StatePreview = 'live' | 'all' | 'none';

export class WorldFlags implements WorldState {
  private readonly raised = new Set<string>();
  private readonly stages = new Map<string, number>();

  /**
   * Forces every condition to a result, so a layer can be looked at without
   * inventing a quest to reach it. Inspection state; nothing is saved.
   */
  preview: StatePreview = 'live';

  flag(name: string): boolean {
    if (this.preview !== 'live') return this.preview === 'all';
    return this.raised.has(name);
  }

  stage(quest: string): number {
    if (this.preview === 'all') return Number.MAX_SAFE_INTEGER;
    if (this.preview === 'none') return -1;
    return this.stages.get(quest) ?? 0;
  }

  setFlag(name: string, on: boolean): void {
    if (on) this.raised.add(name);
    else this.raised.delete(name);
  }

  setStage(quest: string, at: number): void {
    this.stages.set(quest, at);
  }

  get flags(): readonly string[] {
    return [...this.raised];
  }

  get quests(): readonly [string, number][] {
    return [...this.stages];
  }
}

/** The one the interpreter reads when nobody hands it another. */
export const worldState = new WorldFlags();
