import * as THREE from 'three';
import type { SoundscapeSpec } from '../audio/Soundscape';
import { CELL, SHELL_THICKNESS, buildInteriorFromSpec, interiorBuilders, interiorOfShell, planInterior, type InteriorPlan, type InteriorSpec } from './interior';
import { coerceFields } from '../art/schema';
import { markCollidable } from '../player/Collider';
import { FLAT_SIZE, flatGround, type FlatGroundOptions } from './floor';
import { Terrain, type TerrainOptions, type TerrainRasters } from './terrain';
import { heightRaster, indexRaster } from './raster';
import { Skirt, type SkirtOptions } from './vista';
import {
  DOOR_PROUD,
  type EndPrompt,
  type EndUse,
  type EndVolume,
  type PortalDefinition,
  type PortalEnd,
} from './Portal';
import { doorways, doorwayFront } from '../art/building';
import {
  OUTDOOR_ENVIRONMENT,
  type Placement,
  type ZoneDefinition,
  type ZoneEnvironment,
  type ZoneGroup,
  type ZonePlan,
} from './Zone';
import { environmentByName } from './environments';
import type { ZonePlace } from './climate';
import type { Point } from './placement';
import { worldState } from './state';
import {
  emptyCollected,
  entryKind,
  holds,
  tagEntry,
  yawOf,
  type Collected,
  type Entry,
  type EntryContext,
  type PrefabEntry,
  type PropEntry,
  type ShellSpec,
  type TrackEntry,
  type LineEntry,
  type RegionEntry,
  type WaterEntry,
  type WorldState,
  type Yaw,
} from './entry';
import { needBuilder, seedOf } from './kinds';
import { builderByName, ensureAllBuilders, ensureBuilders } from '../art/registry';
import type { WaterBody } from '../art/water/body';
import type { Mooring } from '../art/water/flotilla';
import type { FloatPlacement } from './water';
import { raiseStands } from './stands';
import { lineBuilderByName, hashOf } from '../art/lines';
import { dropWarm, gatherNames, useWarm, warmDocument, takeWarm, TERRAIN_ASK, SKIRT_ASK } from './warmProps';
import { finishCaptured } from '../art/dress';
import { markVista } from '../art/vista';
import { hashString } from './loot';
import type { CoverPatch, GroundPatch, PatchShape } from './ground';

/**
 * The interpreter. A zone document in, a `ZoneDefinition` out.
 *
 * Every commit is document to world, one direction. Nothing here reads the
 * scene graph back into the file.
 */

export interface EnvironmentSpec extends Partial<Omit<ZoneEnvironment, 'soundscape'>> {
  /** A preset registered in code. The rest of the block is overrides on it. */
  base?: string;
}

export interface SculptLayer {
  file: string;
  /** Metres per cell. May be finer than the mesh's own. */
  resolution?: number;
}

/**
 * Sidecar rasters, by file name, decoded before any document is interpreted.
 *
 * Raw little-endian and out of the JSON: a 114 m zone at 1 m is thirteen
 * thousand floats, and keeping that out of the document keeps the parse cheap
 * and the git objects small.
 */
const sidecars = new Map<string, ArrayBuffer>();

export function holdSidecar(file: string, bytes: ArrayBuffer): void {
  sidecars.set(file, bytes);
}

export function sidecarBytes(file: string): ArrayBuffer | undefined {
  return sidecars.get(file);
}

export interface TerrainSpec extends Omit<TerrainOptions, 'landforms'> {
  landforms?: TerrainOptions['landforms'];
  sculpt?: SculptLayer;
  paint?: SculptLayer;
  coverPaint?: SculptLayer;
}

export interface ZoneDocument {
  id: string;
  name: string;
  group?: ZoneGroup;
  /** Where on the map, in kilometres. Presence puts the zone under the weather. */
  place?: ZonePlace;
  environment?: EnvironmentSpec;
  spawn?: { at: readonly number[]; yaw?: Yaw };
  floor?: number;
  soundscape?: SoundscapeSpec;
  terrain?: TerrainSpec;
  skirt?: Omit<SkirtOptions, 'terrain'>;
  shell?: ShellSpec;
  /** Rooms as cells and marks on their edges; a kit turns them into walls. Replaces `shell`. */
  interior?: InteriorSpec;
  /** A gridded plane, for a zone that is neither a heightfield nor a room. */
  flat?: { size?: number } & FlatGroundOptions;
  /** Named lists of shapes, so a scatter or a ring can name one. */
  regions?: Record<string, readonly PatchShape[]>;
  /** What this place makes of anybody standing in it: `villager`, and so on. */
  traits?: readonly string[];
  /** How this zone appears on its neighbours' horizons: the builder that is its landmark at vista scale. */
  vista?: { icon?: string };
  /** Composed sets of entries this zone places by name. */
  prefabs?: Record<string, readonly Entry[]>;
  layers?: readonly Layer[];
  /** Loose entries, for a zone with nothing conditional in it. */
  entries?: readonly Entry[];
}

export interface Layer {
  name: string;
  when?: import('./entry').Condition;
  entries: readonly Entry[];
}

export interface PortalManifest {
  portals?: readonly ManifestPortal[];
  /** The far layer every exterior shares, so the same mountains stand at the same bearings from every cell. */
  horizon?: readonly HorizonProp[];
  /** Water palettes by id, folded over the engine's defaults. */
  water?: Record<string, { shallow?: number; deep?: number; foam?: number; scatter?: number; bands?: number }>;
}

/**
 * One far prop on every horizon. By `bearing` it is infinitely far and stands
 * the same way from every cell; by `at` it has a place on the map, and each
 * cell works out its own bearing and distance to it.
 */
export interface HorizonProp {
  builder: string;
  /** Degrees clockwise from north: 0 is −Z, 90 is +X. */
  bearing?: number;
  /** Kilometres on the map, east and south, as a zone's `place.at`. */
  at?: readonly [number, number];
  /** Metres it should read at. Derived from `at` when that is given. */
  apparent?: number;
  /** A multiplier on the size the perspective rule gives it, or the whole scale for a `bearing` prop. */
  scale?: number;
  seed: number;
  variant?: string;
}

export interface ManifestPortal {
  id: string;
  a: ManifestEnd;
  b: ManifestEnd;
  seed?: number;
  material?: PortalEnd['material'];
  label?: string;
}


export type WallSide = '+x' | '-x' | '+z' | '-z';

export interface ManifestEnd {
  zone: string;
  /** Stood at the door anchor of a placed building. */
  doorOf?: string;
  /** Put in a shell wall, facing in. */
  wall?: WallSide;
  /** Put in an interior's marked edge, facing in. */
  edge?: string;
  /** Which room of a graph the wall belongs to. The first, by default. */
  room?: string;
  at?: readonly number[];
  yaw?: Yaw;
  arrival?: { at: readonly number[]; yaw?: Yaw; on?: string };
  use?: EndUse;
  /** Another way through a threshold something else already covers. See `PortalEnd`. */
  accessory?: boolean;
  /** The entry in this zone the end adopts, for `use: "prop"`. */
  propOf?: string;
  half?: 'lower' | 'upper';
  volume?: EndVolume;
  prompt?: EndPrompt;
}

/** What a portal end needs to know about a zone, without building it. */
interface Registered {
  doc: ZoneDocument;
  terrain: Terrain | null;
  shell: ShellSpec | null;
  interior: InteriorPlan | null;
  groundAt(x: number, z: number): number;
}

const registry = new Map<string, Registered>();

/** Per zone, a way to build one of its entries again against the live build. */
const rebuilders = new Map<string, (id: string) => THREE.Object3D | null>();

/**
 * Builds one entry again, in the context of the zone's current build.
 *
 * Null when the zone has never been built, when the id names nothing, or when
 * the entry contributes no geometry — a sound, a volume — all of which the
 * caller has to answer by raising the zone instead.
 */
export function rebuildEntry(zone: string, id: string): THREE.Object3D | null {
  return rebuilders.get(zone)?.(id) ?? null;
}

/**
 * Whether a zone was interpreted from a document. The world map is a chart of
 * authored places, and the galleries and showcases written in code are not
 * places — they are rooms built to judge one system in.
 */
export function isDocumentZone(zone: string): boolean {
  return registry.has(zone);
}

/** The live heightfield a document built, for the brushes that write into it. */
export function terrainOf(zone: string): Terrain | null {
  return registry.get(zone)?.terrain ?? null;
}

/** The ground height a document's terrain gives, for anything measuring into it. */
export function groundOf(zone: string, x: number, z: number): number {
  return registry.get(zone)?.groundAt(x, z) ?? 0;
}

/** The shell a document declares, for anything placing a door in its wall. */
export function shellOf(zone: string): ShellSpec | null {
  return registry.get(zone)?.shell ?? null;
}

/**
 * A door standing in a shell wall, facing back into the room. Exported so a
 * zone that is still code can wire a portal to a document interior.
 */
export function wallEnd(
  zone: string,
  wall: WallSide | undefined,
  room?: string,
  edge?: string,
): { position: THREE.Vector3; yaw: number } {
  const plan = registry.get(zone)?.interior ?? null;
  if (edge) {
    const site = plan?.edges.get(edge);
    if (!site) throw new Error(`zone "${zone}" has no edge "${edge}"`);
    // DOOR_PROUD inside the inner face, along the inward normal rotateY(yaw) takes +Z to.
    return { position: new THREE.Vector3(site.x + Math.sin(site.yaw) * DOOR_PROUD, site.y, site.z + Math.cos(site.yaw) * DOOR_PROUD), yaw: site.yaw };
  }
  if (!wall) throw new Error(`zone "${zone}": a wall end needs a wall or an edge`);
  const held = shellOf(zone);
  // A graph names which room the door stands in; a plain box has only the one.
  const inRoom = held?.rooms?.find((candidate) => candidate.id === (room ?? held.rooms?.[0]?.id));
  const planRoom = plan && room ? plan.storeys[0]?.rooms.get(room) : plan?.storeys[0]?.rooms.values().next().value;
  const shell = inRoom
    ? { width: inRoom.width, depth: inRoom.depth, at: inRoom.at, level: inRoom.level ?? 0 }
    : planRoom
      ? { width: (planRoom.i1 - planRoom.i0) * CELL, depth: (planRoom.j1 - planRoom.j0) * CELL, at: [((planRoom.i0 + planRoom.i1) / 2) * CELL, ((planRoom.j0 + planRoom.j1) / 2) * CELL] as const, level: planRoom.level }
      : { width: held?.width ?? 8, depth: held?.depth ?? 6, at: [0, 0] as const, level: 0 };
  const inset = DOOR_PROUD;
  const [cx, cz] = shell.at;
  const y = shell.level;
  switch (wall) {
    case '-z':
      return { position: new THREE.Vector3(cx, y, cz - shell.depth / 2 + inset), yaw: 0 };
    case '+z':
      return { position: new THREE.Vector3(cx, y, cz + shell.depth / 2 - inset), yaw: Math.PI };
    case '-x':
      return { position: new THREE.Vector3(cx - shell.width / 2 + inset, y, cz), yaw: Math.PI / 2 };
    default:
      return { position: new THREE.Vector3(cx + shell.width / 2 - inset, y, cz), yaw: -Math.PI / 2 };
  }
}

const layersOf = (doc: ZoneDocument): readonly Layer[] =>
  doc.layers ?? [{ name: 'main', entries: doc.entries ?? [] }];

export function zoneFromDocument(doc: ZoneDocument, state: WorldState = worldState): ZoneDefinition {
  const base = environmentByName(doc.environment?.base ?? 'outdoor') ?? OUTDOOR_ENVIRONMENT;
  // Mutable on purpose: anchored emitters are resolved as the zone is built,
  // and the manager reads this after `build()` has run.
  const soundscape: SoundscapeSpec = {
    bed: doc.soundscape?.bed,
    emitters: [...(doc.soundscape?.emitters ?? [])],
    scatter: [...(doc.soundscape?.scatter ?? [])],
  };
  const environment: ZoneEnvironment = {
    ...base,
    ...stripUndefined(doc.environment ?? {}),
    soundscape,
  };
  delete (environment as { base?: string }).base;

  const fingerprint = fingerprintOf(doc);
  const tracks = tracksOf(doc);
  const waters = watersOf(doc);
  const regions = { ...(doc.regions ?? {}), ...trackRegions(tracks) };
  const terrain = doc.terrain ? new Terrain(terrainOptions(doc.terrain, tracks, doc)) : null;
  const skirt = terrain && doc.skirt ? new Skirt({ ...doc.skirt, terrain }) : null;
  const shell = doc.shell ?? null;
  const interiorSpec: InteriorSpec | null = doc.interior ?? (shell ? interiorOfShell(shell) : null);
  const interiorPlan = interiorSpec ? planInterior(interiorSpec) : null;
  const groundAt = (x: number, z: number): number => (terrain ? terrain.heightAt(x, z) : 0);
  const stands = standsOf(doc, groundAt);

  const collected: Collected = emptyCollected();
  const spawnAt = doc.spawn?.at ?? [0, 0];
  const spawn: Placement = {
    position: new THREE.Vector3(
      spawnAt[0],
      spawnAt.length >= 3 ? spawnAt[1] : groundAt(spawnAt[0], spawnAt[1]) + 0.1,
      spawnAt.length >= 3 ? spawnAt[2] : spawnAt[1],
    ),
    yaw: yawOf(doc.spawn?.yaw),
  };

  registry.set(doc.id, { doc, terrain, shell, interior: interiorPlan, groundAt });
  // Kept from the last build, so one entry can be raised again on its own.
  let lastPass: ((entry: Entry, id: string) => THREE.Object3D | null) | null = null;
  rebuilders.set(doc.id, (id) => {
    const entry = findEntry(doc, id);
    return entry && lastPass ? lastPass(entry, id) : null;
  });

  const build = (): THREE.Group => {
    useWarm(doc.id);
    const root = new THREE.Group();
    // Rebuilt from empty on every build, or a second build doubles the volumes
    // and the emitters the manager reads back.
    collected.emitters.length = 0;
    collected.scatters.length = 0;
    collected.fogVolumes.length = 0;
    collected.glitches.length = 0;
    collected.horrors.length = 0;
    for (const body of collected.water) body.dispose();
    collected.water.length = 0;
    collected.floats.length = 0;
    for (const mooring of collected.moorings) mooring.dispose();
    collected.moorings.length = 0;
    collected.stands.clear();
    collected.cards.length = 0;
    for (const spec of doc.soundscape?.emitters ?? []) collected.emitters.push(spec);
    for (const spec of doc.soundscape?.scatter ?? []) collected.scatters.push(spec);

    if (terrain) {
      const warm = takeWarm(TERRAIN_ASK);
      const ground = warm ? finishCaptured(warm) : terrain.build();
      ground.name = 'terrain';
      root.add(markCollidable(ground));
    } else if (!interiorSpec) {
      const { size, ...rest } = doc.flat ?? {};
      root.add(flatGround(size, rest));
    }
    // The skirt is out of bounds by definition: seen, never walked on.
    if (skirt) {
      const warm = takeWarm(SKIRT_ASK);
      root.add(warm ? markVista(finishCaptured(warm)) : skirt.build());
    }
    if (interiorSpec) {
      const built = buildInteriorFromSpec(interiorSpec);
      built.mesh.name = 'interior';
      root.add(markCollidable(built.mesh));
      // What the marks call for: windows on their walls, a hearth in its breast, a ladder under a hatch.
      for (const prop of built.props) {
        const builder = builderByName(prop.builder);
        if (!builder) {
          console.warn(`zone "${doc.id}": interior mark names no builder "${prop.builder}"`);
          continue;
        }
        const options = builder.options ? coerceFields(builder.options, prop.options) : {};
        const mesh = builder.build({ seed: prop.seed, ...options });
        mesh.position.set(prop.at[0], prop.at[1], prop.at[2]);
        mesh.rotation.y = prop.yaw;
        mesh.userData.seed = prop.seed;
        tagEntry(mesh, doc.id, `interior:${prop.builder}:${prop.at[0].toFixed(1)},${prop.at[2].toFixed(1)}`);
        root.add(builder.solid === false ? mesh : markCollidable(mesh));
      }
    }

    const byId = new Map<string, THREE.Object3D>();

    const ctx: EntryContext = {
      zone: doc.id,
      root,
      terrain,
      skirt,
      shell,
      interior: interiorPlan,
      groundAt,
      slopeAt: (x, z) => (terrain ? terrain.slopeAt(x, z) : 0),
      regions,
      tracks,
      waters,
      stands,
      traits: doc.traits ?? [],
      outline: outlineOf(doc),
      resolve: (id) => byId.get(id),
      collected,
      state,
      prefabs: doc.prefabs ?? {},
      expand: (entries, parent, prefix, seed) => run(entries, parent, prefix, seed),
    };

    const run = (
      entries: readonly Entry[],
      parent: THREE.Object3D,
      prefix: string,
      seedOffset: number,
    ): void => {
      for (const entry of entries) {
        if (!holds(entry.when, state)) continue;
        const kind = entryKind(entry.kind);
        if (!kind) throw new Error(`zone "${doc.id}": no entry kind "${entry.kind}"`);
        const id = `${prefix}${entry.id ?? entry.kind}`;
        const shifted =
          seedOffset === 0
            ? entry
            : ({ ...entry, seed: (entry as { seed?: number }).seed !== undefined
                ? ((entry as { seed?: number }).seed as number) + seedOffset
                : undefined } as Entry);
        // A half-typed entry loses itself, not the level: the editor is the
        // only thing that ever writes these, and it writes them mid-edit.
        let object: THREE.Object3D | null = null;
        try {
          object = kind.build(shifted as never, ctx);
        } catch (error) {
          console.warn(`zone "${doc.id}": entry "${id}" did not build`, error);
          continue;
        }
        if (!object) continue;
        tagEntry(object, doc.id, id);
        byId.set(id, object);
        parent.add(object);
      }
    };

    // Held for `rebuildEntry`: the context a single entry needs is the one the
    // whole pass used, and it is only valid while this build's root is live.
    lastPass = (entry, id) => {
      const kind = entryKind(entry.kind);
      if (!kind) return null;
      const object = kind.build(entry as never, ctx);
      if (object) tagEntry(object, doc.id, id);
      return object;
    };

    for (const layer of layersOf(doc)) {
      if (!holds(layer.when, state)) continue;
      run(layer.entries, root, '', 0);
    }

    // Every stand's crowns into one instanced draw per variant, once every tree stands.
    raiseStands(root, collected);

    // The manager reads these off the definition after `build()`. Copied rather
    // than aliased so a rebuild cannot leave the previous pass's volumes live.
    soundscape.emitters = [...collected.emitters];
    soundscape.scatter = [...collected.scatters];
    dropWarm(doc.id);
    return root;
  };

  return {
    id: doc.id,
    name: doc.name,
    group: doc.group,
    environment,
    place: doc.place,
    spawn,
    floor: doc.floor,
    surfaceAt: terrain ? (x, z) => terrain.stepAt(x, z) : undefined,
    groundAt: terrain ? (x, z) => terrain.heightAt(x, z) : undefined,
    regions,
    plan: planOf(doc, interiorPlan),
    get fogVolumes() {
      return collected.fogVolumes;
    },
    get glitches() {
      return collected.glitches;
    },
    get horrors() {
      return collected.horrors;
    },
    get water(): readonly WaterBody[] {
      return collected.water;
    },
    get floats(): readonly FloatPlacement[] {
      return collected.floats;
    },
    get moorings(): readonly Mooring[] {
      return collected.moorings;
    },
    get cards() {
      return collected.cards;
    },
    warm: async () => {
      // Before the warm and before the walk, both of which look builders up by
      // name and neither of which may await one.
      const names = gatherNames(layersOf(doc), state, doc.prefabs ?? {});
      if (names) await ensureBuilders([...names, ...interiorBuilders(interiorSpec)]);
      else await ensureAllBuilders();
      await warmDocument(doc.id, layersOf(doc), { zone: doc.id, terrain, skirt, groundAt }, state, doc.skirt, fingerprint);
    },
    fingerprint,
    build,
  };
}

/** The document and every sidecar it names, hashed. What the on-disk cache keys a zone on. */
function fingerprintOf(doc: ZoneDocument): string {
  let hash = hashString(JSON.stringify(doc));
  for (const layer of [doc.terrain?.sculpt, doc.terrain?.paint, doc.terrain?.coverPaint]) {
    const bytes = layer && sidecars.get(layer.file);
    if (!bytes) continue;
    const view = new Uint8Array(bytes);
    for (let i = 0; i < view.length; i++) hash = Math.imul(hash ^ view[i], 16777619) >>> 0;
  }
  return hash.toString(36);
}

function stripUndefined<T extends object>(value: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (item !== undefined) out[key] = item;
  }
  return out as Partial<T>;
}

/**
 * A track declares its ground once: the terrain is painted its surface at its
 * width and grows nothing there, with a band of tussock outside a verge.
 */
function terrainOptions(spec: TerrainSpec, tracks: readonly TrackEntry[], doc: ZoneDocument): TerrainOptions {
  const patches: GroundPatch[] = [...(spec.patches ?? [])];
  const verges: CoverPatch[] = [];
  for (const track of tracks) {
    // Dirt and gravel paint: the terrain under the track is what the footsteps and the cover mask read.
    if (track.surface === 'dirt' || track.surface === 'gravel') {
      patches.push({ kind: 'path', through: track.through, width: track.width * 0.9, material: track.surface, feather: 1 });
    }
    if (track.edge !== 'verge') continue;
    verges.push({ kind: 'path', through: track.through, width: track.width + 2, cover: 'tussock', edge: 'feather' });
  }
  for (const layer of doc.layers ?? [{ entries: doc.entries ?? [] }]) {
    for (const entry of layer.entries) {
      if (entry.kind !== 'region') continue;
      const region = entry as RegionEntry;
      if (region.builder === 'rows' && (region.options as { crop?: boolean } | undefined)?.crop) {
        patches.push({ kind: 'polygon', points: region.points, material: 'crop', feather: 1 });
      }
    }
  }
  const grown: CoverPatch[] = [...(spec.cover ?? []), ...verges];
  const rasters: TerrainRasters = {};
  const sculpt = spec.sculpt && sidecars.get(spec.sculpt.file);
  if (spec.sculpt && sculpt) {
    rasters.sculpt = heightRaster(sculpt, spec.size, spec.sculpt.resolution ?? spec.resolution);
  }
  const paint = spec.paint && sidecars.get(spec.paint.file);
  if (spec.paint && paint) {
    rasters.paint = indexRaster(paint, spec.size, spec.paint.resolution ?? spec.resolution);
  }
  const cover = spec.coverPaint && sidecars.get(spec.coverPaint.file);
  if (spec.coverPaint && cover) {
    rasters.cover = indexRaster(cover, spec.size, spec.coverPaint.resolution ?? spec.resolution);
  }
  return { ...spec, landforms: spec.landforms ?? [], patches, cover: grown, rasters };
}

/**
 * How far the level reaches, and what shape it is. Read off the document rather
 * than measured from the built world, because a bounding box of an outdoor zone
 * takes in three hundred metres of skirt nobody can walk on.
 *
 * The shell forms are grown by the wall thickness, so an interior's extent ends
 * at the outer face of its walls and not at the inside of the room.
 */
function planOf(doc: ZoneDocument, interior: InteriorPlan | null): ZonePlan | undefined {
  const outline = outlineOf(doc) ?? undefined;
  if (doc.terrain) {
    const half = doc.terrain.size / 2;
    const rim = doc.terrain.landforms?.find((form) => form.kind === 'rim');
    return { min: [-half, -half], max: [half, half], outline, inset: rim?.inset };
  }
  if (interior) {
    return { min: [interior.minX, interior.minZ], max: [interior.maxX, interior.maxZ], outline, ceiling: interior.ceiling };
  }
  const shell = doc.shell;
  if (shell) {
    const t = shell.thickness ?? SHELL_THICKNESS;
    if (shell.rooms && shell.rooms.length > 0) {
      const min: [number, number] = [Infinity, Infinity];
      const max: [number, number] = [-Infinity, -Infinity];
      let ceiling = 0;
      for (const room of shell.rooms) {
        min[0] = Math.min(min[0], room.at[0] - room.width / 2 - t);
        min[1] = Math.min(min[1], room.at[1] - room.depth / 2 - t);
        max[0] = Math.max(max[0], room.at[0] + room.width / 2 + t);
        max[1] = Math.max(max[1], room.at[1] + room.depth / 2 + t);
        ceiling = Math.max(ceiling, (room.level ?? 0) + room.height);
      }
      return { min, max, outline, ceiling };
    }
    const width = (shell.width ?? 8) / 2 + t;
    const depth = (shell.depth ?? 6) / 2 + t;
    return { min: [-width, -depth], max: [width, depth], outline, ceiling: shell.height ?? 3 };
  }
  const half = (doc.flat?.size ?? FLAT_SIZE) / 2;
  return { min: [-half, -half], max: [half, half], outline };
}

/** The level's outline as a closed polygon, when its skirt or terrain states one. */
function outlineOf(doc: ZoneDocument): readonly Point[] | null {
  const shapes = doc.skirt?.outline ?? doc.regions?.outline;
  if (!shapes) return null;
  const points: Point[] = [];
  for (const shape of shapes) {
    if (shape.kind === 'path') points.push(...shape.through.map((p) => [p[0], p[1]] as Point));
  }
  return points.length >= 3 ? points : null;
}

// --- portals ----------------------------------------------------------------

export function portalsFromManifest(manifest: PortalManifest): PortalDefinition[] {
  return (manifest.portals ?? []).map((portal) => ({
    id: portal.id,
    a: endOf(portal.a, portal),
    b: endOf(portal.b, portal),
  }));
}

function endOf(end: ManifestEnd, portal: ManifestPortal): PortalEnd {
  const out: PortalEnd = {
    zone: end.zone,
    position: new THREE.Vector3(),
    yaw: yawOf(end.yaw),
    use: end.use,
    accessory: end.accessory,
    propOf: end.propOf,
    half: end.half,
    volume: end.volume,
    material: portal.material,
    seed: portal.seed,
    // The portal's label is the fallback: both ends of a door lead somewhere
    // with one name, and the two halves of a ladder do not.
    prompt: { ...end.prompt, label: end.prompt?.label ?? portal.label },
  };

  if (end.doorOf) {
    const anchor = doorwayAnchor(end.zone, end.doorOf);
    out.position.copy(anchor.position);
    out.yaw = anchor.yaw;
  } else if (end.wall || end.edge) {
    const inner = wallEnd(end.zone, end.wall, end.room, end.edge);
    out.position.copy(inner.position);
    out.yaw = inner.yaw;
  } else if (end.at) {
    const at = end.at;
    const x = at[0];
    const z = at.length >= 3 ? at[2] : at[1];
    const y = at.length >= 3 ? at[1] : (registry.get(end.zone)?.groundAt(x, z) ?? 0);
    out.position.set(x, y, z);
  }

  out.landOn = end.arrival?.on;

  if (end.arrival) {
    const at = end.arrival.at;
    const stated = at.length >= 3;
    out.arrival = {
      position: new THREE.Vector3(at[0], stated ? at[1] : 0, stated ? at[2] : at[1]),
      yaw: yawOf(end.arrival.yaw),
      // Three numbers means the height was meant. Two means the ground's.
      exact: stated,
    };
  }

  return out;
}

const UP = new THREE.Vector3(0, 1, 0);

/**
 * Where a door leaf stands in a placed building's first doorway.
 *
 * The building is built once here and thrown away rather than read off the
 * zone: a portal has to be placed before anybody has entered either side, and a
 * doorway measured from a different seed is a way out inside a wall.
 *
 * The standoff is taken along the doorway's own normal first and the whole
 * offset is then turned by the building's yaw — the other order puts the leaf on
 * a different wall.
 */
function doorwayAnchor(zone: string, entryId: string): { position: THREE.Vector3; yaw: number } {
  const registered = registry.get(zone);
  if (!registered) throw new Error(`no zone document "${zone}"`);
  const entry = findEntry(registered.doc, entryId);
  if (!entry || entry.kind !== 'prop') {
    throw new Error(`zone "${zone}" has no placed building "${entryId}"`);
  }
  const prop = entry as PropEntry;
  const builder = needBuilder(prop.builder);
  const mesh = builder.build({ seed: seedOf(prop), scale: prop.scale });
  const way = doorways(mesh)[0];
  mesh.geometry.dispose();
  if (!way) throw new Error(`"${prop.builder}" has no doorway for portal end "${entryId}"`);

  const yaw = yawOf(prop.yaw);
  const stand = doorwayFront(way, DOOR_PROUD);
  const offset = new THREE.Vector3(stand.x, 0, stand.z).applyAxisAngle(UP, yaw);
  const at = prop.at ?? [0, 0];
  const baseX = at[0];
  const baseZ = at.length >= 3 ? at[2] : at[1];
  const x = baseX + offset.x;
  const z = baseZ + offset.z;
  return {
    position: new THREE.Vector3(x, registered.groundAt(x, z), z),
    yaw: yaw + way.yaw,
  };
}

function watersOf(doc: ZoneDocument): WaterEntry[] {
  const out: WaterEntry[] = [];
  const walk = (entries: readonly Entry[]): void => {
    for (const entry of entries) {
      if (entry.kind === 'water') out.push(entry as WaterEntry);
      if (entry.kind === 'prefab') {
        const body = doc.prefabs?.[(entry as PrefabEntry).prefab];
        if (body) walk(body);
      }
    }
  };
  for (const layer of layersOf(doc)) walk(layer.entries);
  return out;
}

/** Everything that said it stands in the water, as a disc, before anything is built: wading props, floats, and every jetty's piles. */
function standsOf(doc: ZoneDocument, groundAt: (x: number, z: number) => number): { x: number; z: number; radius: number }[] {
  const out: { x: number; z: number; radius: number }[] = [];
  for (const layer of layersOf(doc)) {
    for (const entry of layer.entries) {
      if (entry.kind === 'line' && (entry as LineEntry).builder === 'jetty') {
        const jetty = entry as LineEntry;
        const builder = lineBuilderByName('jetty');
        const points = jetty.points.filter((p) => Array.isArray(p.at)).map((p) => ({ at: p.at as Point, width: p.width, height: p.height, corner: p.corner }));
        if (!builder || points.length < 2) continue;
        const seed = seedOf(jetty);
        const laid = builder.lay({ id: jetty.id ?? 'jetty', seed, closed: false, smooth: false, points, marks: jetty.marks ?? [], style: jetty.style, options: jetty.options }, { groundAt, hash: (i, c) => hashOf(seed, i, c), ground: 0 });
        for (const [x, z, radius] of laid.wades ?? []) out.push({ x, z, radius });
        continue;
      }
      if (entry.kind !== 'prop') continue;
      const prop = entry as PropEntry;
      if (!prop.wades && !prop.afloat) continue;
      const at = prop.at;
      if (!at || at.length < 2) continue;
      const builder = builderByName(prop.builder);
      const asked = typeof prop.afloat === 'object' ? prop.afloat : {};
      const radius = (asked.radius ?? builder?.radius ?? 1) * (prop.scale ?? 1) * (prop.afloat ? 0.8 : 0.7);
      out.push({ x: at[0], z: at.length >= 3 ? at[2] : at[1], radius });
    }
  }
  return out;
}

/**
 * The track network's input: every `line` whose builder is `track`, its points
 * smoothed unless it says not, and split at its `bridge`, `gap` and `ford`
 * marks — a ford's middle stretch becomes flagstone.
 */
function tracksOf(doc: ZoneDocument): TrackEntry[] {
  const out: TrackEntry[] = [];
  for (const layer of layersOf(doc)) {
    for (const entry of layer.entries) {
      if (entry.kind !== 'line' || (entry as LineEntry).builder !== 'track') continue;
      const line = entry as LineEntry;
      const options = (line.options ?? {}) as { width?: number; surface?: TrackEntry['surface']; edge?: TrackEntry['edge']; wear?: number };
      const through = line.points.map((p) => (Array.isArray(p.at) ? (p.at as Point) : null)).filter((p): p is Point => p !== null);
      if (through.length < 2) continue;
      const width = options.width ?? line.points.find((p) => p.width !== undefined)?.width ?? 2.4;
      const surface = options.surface ?? (line.style as TrackEntry['surface'] | undefined) ?? 'dirt';
      const smooth = line.smooth !== false && through.length > 2;
      const spine = smooth ? smoothPolyline(through) : through;
      const base: TrackEntry = { kind: 'track', id: line.id, through: spine, width, surface, edge: options.edge, wear: options.wear, seed: line.seed };
      const cuts = (line.marks ?? []).filter((m) => m.kind === 'bridge' || m.kind === 'gap' || m.kind === 'ford').sort((a, b) => a.at - b.at);
      if (cuts.length === 0) {
        out.push(base);
        continue;
      }
      let from = 0;
      let piece = 0;
      for (const mark of cuts) {
        const half = (mark.width ?? 3) / 2;
        const before = slicePolyline(spine, from, mark.at - half);
        if (before.length >= 2) out.push({ ...base, id: piece === 0 ? line.id : `${line.id}#${piece}`, through: before });
        piece++;
        if (mark.kind === 'ford') {
          const across = slicePolyline(spine, mark.at - half, mark.at + half);
          if (across.length >= 2) out.push({ ...base, id: `${line.id}#${piece}`, through: across, surface: 'flagstone', edge: 'none' });
          piece++;
        }
        from = mark.at + half;
      }
      const after = slicePolyline(spine, from, Infinity);
      if (after.length >= 2) out.push({ ...base, id: `${line.id}#${piece}`, through: after });
    }
  }
  return out;
}

/** Centripetal Catmull–Rom through the points, four samples a segment. */
function smoothPolyline(points: readonly Point[]): Point[] {
  const n = points.length;
  const at = (i: number): Point => points[Math.min(n - 1, Math.max(0, i))];
  const out: Point[] = [];
  for (let i = 0; i + 1 < n; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const d = (a: Point, b: Point): number => Math.max(1e-4, Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1])));
    const t0 = 0;
    const t1 = t0 + d(p0, p1);
    const t2 = t1 + d(p1, p2);
    const t3 = t2 + d(p2, p3);
    for (let k = 0; k < 4; k++) {
      const t = t1 + ((t2 - t1) * k) / 4;
      const lerp = (a: Point, b: Point, ta: number, tb: number): Point => {
        const w = tb - ta || 1e-6;
        return [(a[0] * (tb - t) + b[0] * (t - ta)) / w, (a[1] * (tb - t) + b[1] * (t - ta)) / w];
      };
      const a1 = lerp(p0, p1, t0, t1);
      const a2 = lerp(p1, p2, t1, t2);
      const a3 = lerp(p2, p3, t2, t3);
      const b1 = lerp(a1, a2, t0, t2);
      const b2 = lerp(a2, a3, t1, t3);
      out.push(lerp(b1, b2, t1, t2));
    }
  }
  out.push(points[n - 1]);
  return out;
}

/** The part of a polyline between two arc lengths. */
function slicePolyline(points: readonly Point[], from: number, to: number): Point[] {
  const out: Point[] = [];
  let s = 0;
  for (let i = 0; i + 1 < points.length; i++) {
    const a = points[i];
    const b = points[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const s1 = s + len;
    if (s1 < from || s > to) {
      s = s1;
      continue;
    }
    if (out.length === 0) {
      const t = len > 0 ? Math.min(1, Math.max(0, (from - s) / len)) : 0;
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
    if (s1 <= to) out.push(b);
    else {
      const t = len > 0 ? Math.min(1, Math.max(0, (to - s) / len)) : 0;
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      break;
    }
    s = s1;
  }
  return out;
}

/** Each track's strip as a region under its id, so a scatter can keep off it by name. */
function trackRegions(tracks: readonly TrackEntry[]): Record<string, readonly PatchShape[]> {
  const out: Record<string, readonly PatchShape[]> = {};
  for (const track of tracks) {
    if (track.id) out[track.id] = [{ kind: 'path', through: track.through, width: track.width }];
  }
  return out;
}

function findEntry(doc: ZoneDocument, id: string): Entry | undefined {
  for (const layer of layersOf(doc)) {
    for (const entry of layer.entries) if (entry.id === id) return entry;
  }
  return undefined;
}
