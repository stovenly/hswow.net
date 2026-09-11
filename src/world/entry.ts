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
import type { ShellSpec, InteriorPlan } from './interior';
export type { ShellSpec } from './interior';

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
import type { WaterBody } from '../art/water/body';
import type { FloatPlacement, MooringPlacement } from './water';

export interface EntryPlacement {
  /** `[x, z]` settles onto the ground; `[x, y, z]` is absolute. */
  at?: readonly number[];
  /** Stood on the top of the entry with this id, measured after it is built. */
  on?: string;
  /** A room letter: `at` is then metres from that room's north-west cell corner on its floor. */
  in?: string;
  /** Against the inner face of a cell edge, `along` it in 0..1, turned to face the room when `face` is set. */
  against?: { at: readonly [number, number]; side: 'n' | 'e' | 's' | 'w'; along?: number; face?: boolean };
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
  /** The player's pack holds this written item. */
  | { item: string }
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
  /** Whether the player's pack holds this written item. */
  holds(item: string): boolean;
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
  holds: () => false,
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
  if ('item' in condition) return state.holds(condition.item);
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
  /** Stands in the water: its footprint is a disc in the water field's stand lane. */
  wades?: boolean;
  /** Floats: placed at the water's level less its draft, and ridden on the wave. */
  afloat?: boolean | { draft?: number; radius?: number };
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

export interface LinePointEntry {
  at: Anchor;
  width?: number;
  height?: number;
  /** Forces a hard point here whatever the turn. */
  corner?: boolean;
}

export interface MarkEntry {
  /** Metres along the line from its first point. */
  at: number;
  kind: string;
  width?: number;
  builder?: string;
  seed?: number;
  options?: Record<string, unknown>;
}

/** A painted polyline and the builder that covers it: a fence, a wall, a hedge, a track, a jetty. */
export interface LineEntry extends EntryBase {
  kind: 'line';
  builder: string;
  seed?: number;
  style?: string;
  closed?: boolean;
  smooth?: boolean;
  points: readonly LinePointEntry[];
  marks?: readonly MarkEntry[];
  options?: Record<string, unknown>;
  /** Grown on the built mesh, as a prop's `cover`. */
  cover?: CoverName;
}

/** A closed polygon and the builder that fills it: `rows` of plants, or a `border` run round it. */
export interface RegionEntry extends EntryBase {
  kind: 'region';
  builder: string;
  seed?: number;
  points: readonly Point[];
  options?: Record<string, unknown>;
}

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

/** The track network's input, made from a `line` entry whose builder is `track`. */
/** The track network's input, made from a `line` entry whose builder is `track`. */
export interface TrackEntry extends EntryBase {
  kind: 'track';
  through: readonly Point[];
  width: number;
  surface: 'cobble' | 'flagstone' | 'gravel' | 'dirt' | 'boards';
  edge?: 'kerb' | 'verge' | 'none';
  /** 0..1 */
  wear?: number;
  seed?: number;
}

export interface WaterEntry extends EntryBase {
  kind: 'water';
  regime: 'still' | 'flow' | 'fall' | 'sea';
  /** A palette id from the water family, or one inline. */
  palette?: string | { shallow?: number; deep?: number; foam?: number; scatter?: number; bands?: number };
  /** Surface height, metres. Still and sea. */
  level?: number;
  /** Closed outline, world xz. Still and sea. */
  shape?: readonly Point[];
  /** A flowing body's centre line: width per point, level where it drops, speed where it changes. */
  course?: readonly { at: Point; width: number; level?: number; speed?: number }[];
  /** A fall: the lip on the upper body, a point in the lower, its width, and how far it stands out at the pool. */
  fall?: { from: Point; to: Point; width: number; throw?: number };
  /** Metres of apron out toward the horizon. Still and sea. */
  reach?: number;
  swell?: { direction: Point; length: number; height: number };
  /** A region name: the swell and chop are damped inside it. Sea. */
  shelter?: string;
  /** 0 smooth, 1 plated. */
  facet?: number;
  /** Metres per quad. */
  segment?: number;
  /** Metres the surface runs on under the bank. */
  bury?: number;
  /** Whether a still body owns a ripple field. */
  ripples?: boolean;
  /** Wash-line width against the bank, metres. */
  wash?: number;
  /** Collar width round what stands in it, metres. */
  collar?: number;
  /** Scales the wind's agitation and the chop. */
  chop?: number;
  /** Fish rising per minute. */
  rise?: number;
  /** Overrides the regime's default voice; null silences it. */
  sound?: Record<string, unknown> | null;
}

export interface MooringEntry extends EntryBase {
  kind: 'mooring';
  /** The afloat prop the rope holds, by id. */
  float: string;
  /** The built entry the rope is made fast to ashore; `at` with a height otherwise. */
  post?: string;
  /** Metres up the post the rope is tied. */
  lift?: number;
  /** Extra rope as a fraction of the straight distance. */
  slack?: number;
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
  /** Put every neighbouring cell's icon on the horizon at its true bearing, `at` metres out from the outline. */
  neighbours?: boolean | { at?: number };
  /** Stand the shared far layer round this cell, `at` metres out. */
  horizon?: boolean | { at?: number };
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
  /** A region name the candidates must fall inside, in place of the level outline. */
  region?: string;
  /** Uniform scale range, rolled per instance. */
  scale?: readonly [number, number];
}

export type AvoidItem =
  | readonly [number, number, number]
  | string
  | { ref: string; radius: number; ahead?: number };

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
  | LineEntry
  | RegionEntry
  | ScatterEntry
  | BarrierEntry
  | PrefabEntry
  | GroundEntry
  | WaterEntry
  | MooringEntry
  | ParticlesEntry
  | FogVolumeEntry
  | EffectVolumeEntry
  | SoundEntry
  | SoundScatterEntry
  | VistaRingEntry
  | DressingEntry
  | (EntryBase & Record<string, unknown>);

// --- the build context ------------------------------------------------------

export interface EntryContext {
  zone: string;
  root: THREE.Group;
  terrain: Terrain | null;
  skirt: Skirt | null;
  shell: ShellSpec | null;
  /** The interior's plan: rooms as cells and every wall derived from them. Null outdoors. */
  interior: InteriorPlan | null;
  groundAt: GroundAt;
  slopeAt(x: number, z: number): number;
  /** Named regions the document declared, for anything that names one. */
  regions: Record<string, readonly PatchShape[]>;
  /** Every track in the document, which are built together as one network. */
  tracks: readonly TrackEntry[];
  /** Every body of water in the document, so a course can end at another's outline. */
  waters: readonly WaterEntry[];
  /** Everything declared standing in the water, with a footprint, before anything is built. */
  stands: readonly { x: number; z: number; radius: number }[];
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
export type WarmContext = Pick<EntryContext, 'zone' | 'terrain' | 'skirt' | 'groundAt'>;

/** Everything an entry can contribute that is not geometry. */
export interface Collected {
  emitters: EmitterSpec[];
  scatters: ScatterSpec[];
  fogVolumes: FogVolume[];
  glitches: GlitchPlacement[];
  horrors: HorrorPlacement[];
  /** Every body of water built, in document order. */
  water: WaterBody[];
  floats: FloatPlacement[];
  moorings: MooringPlacement[];
  /** The first tree built of each stand variant, whose geometry every later one shares. */
  stands: Map<string, THREE.Mesh>;
  /** Every instanced crown, with its trunk, and where each copy stands — for the cards. */
  cards: CardGroup[];
}

export interface CardGroup {
  key: string;
  trunk: THREE.BufferGeometry;
  canopy: THREE.BufferGeometry;
  instances: { x: number; y: number; z: number; yaw: number; scale: number }[];
}

export function emptyCollected(): Collected {
  return { emitters: [], scatters: [], fogVolumes: [], glitches: [], horrors: [], water: [], floats: [], moorings: [], stands: new Map(), cards: [] };
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
  /**
   * Every builder this entry can name, the kind's own defaults included. A read
   * of the entry and nothing else — no context, no seeds.
   *
   * Not `asks`: that is allowed to be partial, because a warm miss costs a build
   * the walk would have done anyway. This one must be **complete or absent**.
   * A kind that cannot say falls the whole zone back on the full catalogue,
   * which is slow; a kind that under-says leaves the walk without a builder,
   * which is an empty room.
   */
  names?(entry: E): readonly string[];
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
