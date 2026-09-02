import * as THREE from 'three';
import type { Fields } from '../art/schema';
import type { SurfaceName } from '../audio/models/footsteps';
import type { EmitterSpec } from '../audio/Soundscape';
import type { ScatterSpec } from '../audio/Scatter';
import type { FogVolume } from '../engine/FogVolumes';
import type { GlitchPlacement } from '../engine/Glitch';
import type { HorrorPlacement } from '../engine/Horror';
import type { PropAsk } from '../engine/work/jobs';
import type { CoverName, GroundName, PatchShape } from './ground';
import type { Terrain } from './terrain';
import type { Skirt } from './vista';
import type { GroundAt, Point } from './placement';
import type { Join, Room } from './rooms';

/**
 * What a zone document is made of, and the table that turns one entry into
 * geometry.
 *
 * The file stores what the authoring vocabulary *says*, never what the scene
 * graph contains. A prop is a builder name, a seed and a placement; a fence is a
 * polyline; a scatter is a rule. The world is derived on every build, and
 * builders are seeded, so the derivation is repeatable forever.
 */

// --- placement --------------------------------------------------------------

/**
 * A compass word instead of radians. A builder faces +Z, and `rotateY(θ)` takes
 * +Z to `(sin θ, 0, cos θ)`, so +Z is south and the four fall out of that.
 */
export const COMPASS = {
  south: 0,
  east: Math.PI / 2,
  north: Math.PI,
  west: -Math.PI / 2,
  southeast: Math.PI / 4,
  northeast: (Math.PI * 3) / 4,
  northwest: (-Math.PI * 3) / 4,
  southwest: -Math.PI / 4,
} as const;

export type Compass = keyof typeof COMPASS;
export type Yaw = number | Compass;

export function yawOf(yaw: Yaw | undefined, fallback = 0): number {
  if (yaw === undefined) return fallback;
  return typeof yaw === 'number' ? yaw : (COMPASS[yaw] ?? fallback);
}

/** Shared by every placed entry. */
export interface EntryPlacement {
  /** `[x, z]` settles onto the ground; `[x, y, z]` is absolute. */
  at?: readonly number[];
  /** Stood on the top of the entry with this id, measured after it is built. */
  on?: string;
  yaw?: Yaw;
  /** YXZ about the foot, when pitch or roll is needed. Wins over `yaw`. */
  rotation?: readonly [number, number, number];
  /** The builder contract's uniform scale. */
  scale?: number;
  /** Per-axis, applied to the finished mesh. Loud on purpose. */
  stretch?: readonly [number, number, number];
}

// --- conditions -------------------------------------------------------------

/**
 * A question about the world or about somebody in it. The world answers `flag`,
 * `quest`, `zone`, `region`, `ambient` and `cast`; the subject answers `trait`,
 * `person`, `atHome` and `doing`. Anything nobody can answer is false.
 */
export type Condition =
  | { flag: string }
  /** Every clause present must hold. `done` is a stage ever visited. */
  | { quest: string; stage?: { min?: number; max?: number }; done?: number; failed?: boolean }
  | { zone: string }
  | { region: string }
  /** A field of the ambient snapshot, in its own units. A boolean field reads 0 or 1. */
  | { ambient: string; min?: number; max?: number }
  | { trait: string }
  | { person: string }
  /** The subject is who the quest `of` has cast in this role. */
  | { cast: string; of: string }
  | { atHome: boolean }
  | { doing: string }
  /** The player's pack holds something this builder made. */
  | { carries: string }
  | { not: Condition }
  | { all: readonly Condition[] }
  | { any: readonly Condition[] };

/** Who a condition is being asked about, where it is asking about somebody. */
export interface Subject {
  person?: string;
  traits?: readonly string[];
  /** The zone they belong in, which is what `atHome` compares against. */
  home?: string;
  /** What they are up to: the creature's state now, a schedule's answer later. */
  doing?: string;
}

/** What conditions are evaluated against. A dev-panel stub until quests exist. */
export interface WorldState {
  flag(name: string): boolean;
  stage(quest: string): number;
  /** Whether a stage was ever visited, which the highest reached does not answer. */
  stageDone(quest: string, index: number): boolean;
  failed(quest: string): boolean;
  /** Where the player is. */
  zone(): string;
  region(name: string): boolean;
  /** A field of the ambient snapshot, or undefined when nothing has sampled one. */
  ambient(field: string): number | undefined;
  cast(quest: string, role: string): string | undefined;
  /** The placed grants, plus what has been granted since, minus what has been taken. */
  traitsOf(person: string, placed: readonly string[]): readonly string[];
  /** Whether the player's pack holds something this builder made. */
  carries(builder: string): boolean;
}

export const NO_STATE: WorldState = {
  flag: () => false,
  stage: () => 0,
  stageDone: () => false,
  failed: () => false,
  zone: () => '',
  region: () => false,
  ambient: () => undefined,
  carries: () => false,
  cast: () => undefined,
  traitsOf: (_person, placed) => placed,
};

export function holds(condition: Condition | undefined, state: WorldState, who?: Subject): boolean {
  if (!condition) return true;
  if ('flag' in condition) return state.flag(condition.flag);
  if ('quest' in condition) {
    const { min, max } = condition.stage ?? {};
    const at = state.stage(condition.quest);
    if (min !== undefined && at < min) return false;
    if (max !== undefined && at > max) return false;
    if (condition.done !== undefined && !state.stageDone(condition.quest, condition.done)) {
      return false;
    }
    if (condition.failed !== undefined && state.failed(condition.quest) !== condition.failed) {
      return false;
    }
    return true;
  }
  if ('zone' in condition) return state.zone() === condition.zone;
  if ('region' in condition) return state.region(condition.region);
  if ('ambient' in condition) {
    const value = state.ambient(condition.ambient);
    if (value === undefined) return false;
    const { min, max } = condition;
    return (min === undefined || value >= min) && (max === undefined || value <= max);
  }
  if ('carries' in condition) return state.carries(condition.carries);
  if ('trait' in condition) return who?.traits?.includes(condition.trait) ?? false;
  if ('person' in condition) return who?.person !== undefined && who.person === condition.person;
  if ('cast' in condition) {
    return who?.person !== undefined && state.cast(condition.of, condition.cast) === who.person;
  }
  if ('atHome' in condition) {
    if (who?.home === undefined) return false;
    return (who.home === state.zone()) === condition.atHome;
  }
  if ('doing' in condition) return who?.doing === condition.doing;
  if ('not' in condition) return !holds(condition.not, state, who);
  if ('all' in condition) return condition.all.every((one) => holds(one, state, who));
  return condition.any.some((one) => holds(one, state, who));
}

// --- entries ----------------------------------------------------------------

export interface EntryBase extends EntryPlacement {
  /**
   * Minted once by the editor and never re-minted. What `on`, emitter anchors,
   * portal ends and the player-state override layer point at.
   */
  id?: string;
  kind: string;
  when?: Condition;
  /** Which layer this belongs to. Set by the interpreter, not by the file. */
  layer?: string;
}

export interface PropEntry extends EntryBase {
  kind: 'prop';
  builder: string;
  seed?: number;
  /** The builder's own extras, checked against its runtime option schema. */
  options?: Record<string, unknown>;
  /** Overrides the builder's own answer. */
  solid?: boolean;
  label?: string;
  /** A note id, for a readable. */
  text?: string;
  /** Overrides the footstep surface for this mesh's triangles. */
  underfoot?: SurfaceName;
  /** Grows groundcover on it. The wall types only exist this way. */
  cover?: CoverName;
  /** Treated as ground by `prepare()`: receives shadow, casts none. */
  ground?: boolean;
}

export interface CreatureEntry extends EntryBase {
  kind: 'creature';
  builder: string;
  seed?: number;
  roam?: number;
  folk?: string;
  face?: string;
  /** What the crosshair calls them. Absent falls back to the person, then the trait. */
  name?: string;
  /** A named person, whose body wins over every field above. */
  person?: string;
  /** Granted on top of the zone's, and under the person's own. */
  traits?: readonly string[];
  options?: Record<string, unknown>;
}

/**
 * A point, or a point taken off something already built.
 *
 * `edge` is the referent's world extent along that axis, which is how a wall
 * butts against an arch's jamb without anyone knowing how wide the arch rolled.
 * `ahead` steps out of the referent's first doorway, which is how a scatter
 * keeps off the ground you land on stepping out of a house.
 */
export type Anchor =
  | Point
  | {
      ref: string;
      edge?: '+x' | '-x' | '+z' | '-z';
      ahead?: number;
      offset?: Point;
    };

export interface RunEntry extends EntryBase {
  kind: 'run';
  builder: string;
  seed?: number;
  points: readonly Anchor[];
  /** Metres per section, when the builder's own pitch is not wanted. */
  pitch?: number;
  most?: number;
  /** A post on the far end, where rounding leaves it. */
  cap?: 'post';
}

export interface ChainEdge {
  to: Anchor;
  kind: 'wall' | 'fence';
}

export interface ChainRun {
  start: Anchor;
  edges: readonly ChainEdge[];
  /** Its own seed, so a boundary's two halves are dressed independently. */
  seed?: number;
}

export interface ChainEntry extends EntryBase {
  kind: 'chain';
  seed?: number;
  /** One chain. Several are `runs`, and `close` joins their far ends in order. */
  start?: Anchor;
  edges?: readonly ChainEdge[];
  runs?: readonly ChainRun[];
  /** Closes the gap with a hedge: one chain back to its start, several end to end. */
  close?: 'hedge';
  closeSeed?: number;
}

export interface ScatterEntry extends Omit<EntryBase, 'scale'> {
  kind: 'scatter';
  builder: string;
  seed?: number;
  count: number;
  within: number;
  from?: Point;
  maxSlope?: number;
  minHeight?: number;
  maxHeight?: number;
  /**
   * Where not to place: a region name, a circle as `[x, z, radius]`, or a
   * clearance round something built.
   */
  avoid?: string | readonly AvoidItem[];
  /** Metres of clearance from the level outline. */
  inset?: number;
  /** A region name the candidates must fall inside. */
  region?: string;
  /** Uniform scale range, rolled per instance. */
  scale?: readonly [number, number];
}

export type AvoidItem =
  | readonly [number, number, number]
  | string
  | { ref: string; radius: number; ahead?: number };

export interface BarrierEntry extends EntryBase {
  kind: 'barrier';
  from?: Anchor;
  to?: Anchor;
  height?: number;
  /** The box form: `at` plus half-extents. */
  size?: readonly [number, number, number];
}

export interface PrefabEntry extends EntryBase {
  kind: 'prefab';
  prefab: string;
  seed?: number;
}

export interface GroundEntry extends EntryBase {
  kind: 'ground';
  shape?: readonly PatchShape[];
  /** The plain slab form. */
  size?: readonly [number, number];
  y?: number;
  material?: GroundName;
  cover?: CoverName;
  thickness?: number;
  underfoot?: SurfaceName;
}

export interface WaterEntry extends EntryBase {
  kind: 'water';
  width: number;
  depth: number;
  chop?: number;
  /** Metres of column over which the chop fades in from nothing at the bed. */
  taper?: number;
  flow?: readonly [number, number];
  segment?: number;
}

export interface ParticlesEntry extends EntryBase {
  kind: 'particles';
  seed?: number;
  spec: Record<string, unknown>;
}

export interface FogVolumeEntry extends EntryBase, Omit<FogVolume, 'center' | 'size' | 'drift'> {
  kind: 'fogVolume';
  center: readonly [number, number, number];
  size: readonly [number, number, number];
  drift?: readonly [number, number];
}

export interface EffectVolumeEntry extends EntryBase {
  kind: 'glitch' | 'horror';
  shape: 'box' | 'ellipsoid';
  center: readonly [number, number, number];
  size: readonly [number, number, number];
  strength: number;
  seed?: number;
  tempo?: number;
  weights?: readonly number[];
  grounded?: boolean;
}

export interface SoundEntry extends EntryBase {
  kind: 'sound';
  spec: Record<string, unknown>;
  /** Anchored to a built entry rather than to a coordinate. */
  ref?: string;
  /** Metres above the referent's foot, or above the ground under a flat `at`. */
  lift?: number;
}

export interface SoundScatterEntry extends EntryBase {
  kind: 'soundScatter';
  spec: ScatterSpec;
  ref?: string;
  lift?: number;
}

export interface VistaRingEntry extends EntryBase {
  kind: 'vistaRing';
  seed?: number;
  band: { inner: number; outer: number };
  /** A region name, or a dilation of the level outline. */
  keepOut?: string | { dilate: number };
  place?: readonly Record<string, unknown>[];
  scatter?: readonly Record<string, unknown>[];
  chunk?: number;
}

export interface DressingEntry extends EntryBase {
  kind: 'dressing';
  seed?: number;
  band: { inner: number; outer: number };
  solidWithin?: number;
  kinds: readonly Record<string, unknown>[];
}

export type Entry =
  | PropEntry
  | CreatureEntry
  | RunEntry
  | ChainEntry
  | ScatterEntry
  | BarrierEntry
  | PrefabEntry
  | GroundEntry
  | WaterEntry
  | ParticlesEntry
  | FogVolumeEntry
  | EffectVolumeEntry
  | SoundEntry
  | SoundScatterEntry
  | VistaRingEntry
  | DressingEntry
  | (EntryBase & Record<string, unknown>);

// --- the build context ------------------------------------------------------

export interface ShellSpec {
  /** The one-room form: a sealed box centred on the origin. */
  width?: number;
  depth?: number;
  height?: number;
  seed?: number;
  style?: string;
  planks?: boolean;
  beams?: number;
  thickness?: number;
  /** The room graph. Present, it replaces the three dimensions above. */
  rooms?: readonly Room[];
  joins?: readonly Join[];
}

/** What a kind's `build` is handed. Everything a zone knows about itself. */
export interface EntryContext {
  zone: string;
  root: THREE.Group;
  terrain: Terrain | null;
  skirt: Skirt | null;
  shell: ShellSpec | null;
  groundAt: GroundAt;
  slopeAt(x: number, z: number): number;
  /** Named regions the document declared, for anything that names one. */
  regions: Record<string, readonly PatchShape[]>;
  /** What this zone makes of anybody standing in it. The lowest trait grant. */
  traits: readonly string[];
  /** The level's outline as a closed polygon, when it has one. */
  outline: readonly Point[] | null;
  /** An entry built earlier in this pass. */
  resolve(id: string): THREE.Object3D | undefined;
  /** What an entry adds to the zone as a whole. */
  collected: Collected;
  state: WorldState;
  /** Prefab bodies, by name. */
  prefabs: Record<string, readonly Entry[]>;
  /** Builds a nested list of entries into `parent` — how a prefab expands. */
  expand(entries: readonly Entry[], parent: THREE.Object3D, prefix: string, seed: number): void;
}

/**
 * What exists before the walk runs: the ground and the skirt, both made with
 * the definition, and nothing built. See `EntryKind.asks`.
 */
export type WarmContext = Pick<EntryContext, 'terrain' | 'skirt' | 'groundAt'>;

/** Everything an entry can contribute that is not geometry. */
export interface Collected {
  emitters: EmitterSpec[];
  scatters: ScatterSpec[];
  fogVolumes: FogVolume[];
  glitches: GlitchPlacement[];
  horrors: HorrorPlacement[];
}

export function emptyCollected(): Collected {
  return { emitters: [], scatters: [], fogVolumes: [], glitches: [], horrors: [] };
}

// --- the kind table ---------------------------------------------------------

export interface EntryKind<E extends Entry = never> {
  kind: string;
  /** Fields the inspector renders, beyond the placement every entry has. */
  schema?: Fields;
  /** What a freshly placed entry of this kind carries, beyond its placement. */
  defaults?(): Record<string, unknown>;
  /** Builds the entry, or returns null when it contributes no geometry. */
  build(entry: E, ctx: EntryContext): THREE.Object3D | null;
  /**
   * The builder calls `build` is going to make, in the order it makes them, so
   * they can be built off the main thread before the walk runs. Omitting it
   * warms the kind for nothing, which is what most kinds want. Listing a call
   * the walk does not make costs a build nobody claims; listing one with the
   * wrong seed costs the same and gains nothing, so the draw order has to be
   * shared with `build` rather than reproduced here.
   */
  asks?(entry: E, ctx: WarmContext): readonly PropAsk[];
  /** For kinds with no mesh of their own: what the editor draws instead. */
  gizmo?(entry: E, ctx: EntryContext): THREE.Object3D | null;
  /** Where the palette lists it, and what it offers. */
  palette?: { tab: string; list(): readonly string[] };
}

const kinds = new Map<string, EntryKind<never>>();

/**
 * Adds a kind. The interpreter, the inspector, the palette, the outliner icons
 * and the pick path all read this table; nothing else knows the list of kinds.
 */
export function registerEntryKind<E extends Entry>(kind: EntryKind<E>): void {
  kinds.set(kind.kind, kind as unknown as EntryKind<never>);
}

export function entryKind(name: string): EntryKind<never> | undefined {
  return kinds.get(name);
}

export function entryKinds(): readonly EntryKind<never>[] {
  return [...kinds.values()];
}

// --- shared placement -------------------------------------------------------

const _bounds = new THREE.Box3();

/**
 * Puts a built object where its entry says. Position, then rotation about the
 * foot, then stretch — in that order, because a rotation applied after a
 * translation turns about the wrong point.
 */
export function applyPlacement(
  object: THREE.Object3D,
  entry: EntryPlacement,
  ctx: Pick<EntryContext, 'groundAt' | 'resolve'>,
): void {
  const at = entry.at;
  let x = 0;
  let z = 0;
  let y: number | null = null;

  if (at && at.length >= 2) {
    x = at[0];
    z = at.length >= 3 ? at[2] : at[1];
    if (at.length >= 3) y = at[1];
  }

  if (entry.on) {
    const base = ctx.resolve(entry.on);
    if (base) {
      if (!at || at.length < 2) {
        x = base.position.x;
        z = base.position.z;
      }
      _bounds.setFromObject(base, true);
      y = _bounds.isEmpty() ? base.position.y : _bounds.max.y;
    }
  }

  object.position.set(x, y ?? ctx.groundAt(x, z), z);

  if (entry.rotation) {
    object.rotation.set(entry.rotation[0], entry.rotation[1], entry.rotation[2], 'YXZ');
  } else {
    object.rotation.set(0, yawOf(entry.yaw), 0);
  }

  if (entry.stretch) {
    object.scale.set(entry.stretch[0], entry.stretch[1], entry.stretch[2]);
  }
}

/** Tags a subtree so a pick can name the entry it came from. */
export function tagEntry(object: THREE.Object3D, zone: string, id: string): void {
  object.userData.entry = { zone, id };
}
