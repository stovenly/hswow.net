import type { Conditions } from '../audio/ambience/conditions';
import type { WorldState } from './entry';
import { outlineDistance, type PatchShape } from './ground';

/**
 * What a `when` is evaluated against.
 *
 * A stub until the quest system exists: flags and quest stages held in memory,
 * set by the editor's layer panel and by nothing else yet. Player saves do not
 * touch it and it is never written to a document. Where the player stands and
 * what the weather is doing are pushed in once a frame instead, by whoever
 * already samples them.
 */

export type StatePreview = 'live' | 'all' | 'none';

export class WorldFlags implements WorldState {
  private readonly raised = new Set<string>();
  private readonly stages = new Map<string, number>();
  private readonly visited = new Map<string, Set<number>>();
  private readonly lost = new Set<string>();
  private readonly roles = new Map<string, string>();
  private readonly given = new Map<string, Set<string>>();
  private readonly taken = new Map<string, Set<string>>();
  private now: Conditions | null = null;
  private here = '';
  private regions: Record<string, readonly PatchShape[]> = {};
  private x = 0;
  private z = 0;

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

  stageDone(quest: string, index: number): boolean {
    if (this.preview !== 'live') return this.preview === 'all';
    return this.visited.get(quest)?.has(index) ?? false;
  }

  failed(quest: string): boolean {
    if (this.preview !== 'live') return this.preview === 'all';
    return this.lost.has(quest);
  }

  zone(): string {
    return this.here;
  }

  region(name: string): boolean {
    if (this.preview !== 'live') return this.preview === 'all';
    const shapes = this.regions[name];
    return shapes !== undefined && outlineDistance(shapes, this.x, this.z) < 0;
  }

  ambient(field: string): number | undefined {
    const value = this.now?.[field as keyof Conditions];
    if (typeof value === 'boolean') return value ? 1 : 0;
    return value;
  }

  cast(quest: string, role: string): string | undefined {
    return this.roles.get(`${quest}/${role}`);
  }

  traitsOf(person: string, placed: readonly string[]): readonly string[] {
    const given = this.given.get(person);
    const taken = this.taken.get(person);
    if (!given && !taken) return placed;
    const out = taken ? placed.filter((id) => !taken.has(id)) : [...placed];
    // Appended, so a trait granted in conversation outranks one they stood up with.
    if (given) for (const id of given) if (!out.includes(id)) out.push(id);
    return out;
  }

  setFlag(name: string, on: boolean): void {
    if (on) this.raised.add(name);
    else this.raised.delete(name);
  }

  setStage(quest: string, at: number): void {
    this.stages.set(quest, at);
    const seen = this.visited.get(quest);
    if (seen) seen.add(at);
    else this.visited.set(quest, new Set([at]));
  }

  setFailed(quest: string, on: boolean): void {
    if (on) this.lost.add(quest);
    else this.lost.delete(quest);
  }

  setCast(quest: string, role: string, person: string): void {
    this.roles.set(`${quest}/${role}`, person);
  }

  grantTrait(person: string, trait: string, on: boolean): void {
    const into = on ? this.given : this.taken;
    const outOf = on ? this.taken : this.given;
    outOf.get(person)?.delete(trait);
    const held = into.get(person);
    if (held) held.add(trait);
    else into.set(person, new Set([trait]));
  }

  /** What the world is doing and where the player stands, sampled once a frame. */
  observe(
    now: Conditions,
    zone: string,
    regions: Record<string, readonly PatchShape[]> | undefined,
    x: number,
    z: number,
  ): void {
    this.now = now;
    this.here = zone;
    this.regions = regions ?? {};
    this.x = x;
    this.z = z;
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
