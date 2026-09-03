import type { Conditions } from '../audio/ambience/conditions';
import type { WorldState } from './entry';
import { outlineDistance, type PatchShape } from './ground';
import { questById } from './people';

/**
 * What a `when` is evaluated against: flags, quest stages and recast roles,
 * which a save carries; and where the player stands and what the weather is
 * doing, pushed in once a frame by whoever already samples them.
 */

/** A stage a quest has been through, and the world day it was reached on. */
export interface Visit {
  at: number;
  day: number;
}

export type StatePreview = 'live' | 'all' | 'none';

export class WorldFlags implements WorldState {
  private readonly raised = new Set<string>();
  private readonly stages = new Map<string, number>();
  private readonly visited = new Map<string, Map<number, number>>();
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

  /** Told the first time a quest reaches a stage. */
  onStage: ((quest: string, at: number) => void) | null = null;

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

  /** Asks the pack, once the item systems have handed one over. */
  pack: { carries(builder: string): boolean; holds(item: string): boolean } | null = null;

  carries(builder: string): boolean {
    if (this.preview !== 'live') return this.preview === 'all';
    return this.pack?.carries(builder) ?? false;
  }

  holds(item: string): boolean {
    if (this.preview !== 'live') return this.preview === 'all';
    return this.pack?.holds(item) ?? false;
  }

  ambient(field: string): number | undefined {
    const value = this.now?.[field as keyof Conditions];
    if (typeof value === 'boolean') return value ? 1 : 0;
    return value;
  }

  cast(quest: string, role: string): string | undefined {
    return this.roles.get(`${quest}/${role}`) ?? questById(quest)?.cast?.[role];
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
    let seen = this.visited.get(quest);
    if (!seen) this.visited.set(quest, (seen = new Map()));
    if (seen.has(at)) return;
    seen.set(at, this.today);
    this.onStage?.(quest, at);
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

  /** The stages a quest has been through, in the order it reached them. */
  visits(quest: string): readonly Visit[] {
    const seen = this.visited.get(quest);
    return seen ? [...seen].map(([at, day]) => ({ at, day })) : [];
  }

  /** Days since the world began, as last observed. */
  get today(): number {
    return this.now?.elapsed ?? 0;
  }

  /** Everything a save carries. Inspection state — the preview — is not in it. */
  save(): WorldStateData {
    return {
      flags: [...this.raised],
      stages: [...this.stages],
      visited: [...this.visited].map(([quest, seen]) => [quest, [...seen]]),
      failed: [...this.lost],
      cast: [...this.roles],
      given: [...this.given].map(([person, ids]) => [person, [...ids]]),
      taken: [...this.taken].map(([person, ids]) => [person, [...ids]]),
    };
  }

  restore(data: WorldStateData | undefined): void {
    this.clear();
    if (!data) return;
    for (const flag of data.flags ?? []) this.raised.add(flag);
    for (const [quest, at] of data.stages ?? []) this.stages.set(quest, at);
    for (const [quest, seen] of data.visited ?? []) {
      this.visited.set(quest, new Map(seen.map((one) => (typeof one === 'number' ? [one, 0] : one))));
    }
    for (const quest of data.failed ?? []) this.lost.add(quest);
    for (const [key, person] of data.cast ?? []) this.roles.set(key, person);
    for (const [person, ids] of data.given ?? []) this.given.set(person, new Set(ids));
    for (const [person, ids] of data.taken ?? []) this.taken.set(person, new Set(ids));
  }

  clear(): void {
    this.raised.clear();
    this.stages.clear();
    this.visited.clear();
    this.lost.clear();
    this.roles.clear();
    this.given.clear();
    this.taken.clear();
  }
}

/** `WorldFlags` as a save file holds it. Plain JSON, and every field optional on the way in. */
export interface WorldStateData {
  flags: string[];
  stages: [string, number][];
  /** Stage and the day it was reached. A bare stage is from a save written before the journal. */
  visited: [string, ([number, number] | number)[]][];
  failed: string[];
  cast: [string, string][];
  given: [string, string[]][];
  taken: [string, string[]][];
}

/** The one the interpreter reads when nobody hands it another. */
export const worldState = new WorldFlags();
