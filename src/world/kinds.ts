import * as THREE from 'three';
import { builderByName } from '../art/registry';
import { coerceFields } from '../art/schema';
import { finishCaptured } from '../art/dress';
import { keepPlan, takePlan, takeWarm } from './warmProps';
import type { PropAsk } from '../engine/work/jobs';
import { personById, traitById, type Folk } from './people';
import type { NpcMark } from './Interaction';
import type { LifeSpec } from '../life/spec';
import { markCollidable } from '../player/Collider';
import { markLabelled, markReadable } from './Interaction';
import { markGlitched } from '../art/glitch';
import { markHaunted } from '../art/horror';
import { WaterBody, specCovers, specLevelAt, type WaterBodySpec, type ShelterShape } from '../art/water/body';
import { Mooring } from '../art/water/flotilla';
import type { TrackEntry } from './entry';
import { buildTrackNetwork } from './trackNetwork';
import { createParticles, type ParticleSpec } from '../art/particles';
import { lineBuilderByName, LINE_BUILDERS, hashOf as lineHash, type Line, type LineBuilder, type Laid } from '../art/lines';
import { rows, borderLine, type RowsOptions } from '../art/lines/regions';
import { assemble, assembleCanopy, finish } from '../art/assemble';
import { CELL } from './interior';
import { STAND_SPECIES, variantSeed } from '../art/foliage';
import { standMesh } from './stands';
import {
  propAsk,
  vistaRing,
  vistaRingPlan,
  type VistaProp,
  type VistaRingOptions,
  type VistaScatter,
} from './vista-ring';
import { atlasBuilders, horizonLayer, neighboursOf, placeOf } from './atlas';
import {
  edgeDressing,
  edgeDressingPlan,
  type DressingKind,
  type DressingOptions,
  type DressingPlacement,
} from './dressing';
import { shapeDistance, GROUND, COVER_TYPES, type PatchShape } from './ground';
import type { Terrain } from './terrain';
import { SURFACES } from '../audio/models/footsteps';
import { doorways, doorwayFront } from '../art/building';
import { dilateOutline, type Skirt } from './vista';
import { DOOR_PROUD } from './Portal';
import {
  insidePolygon,
  place,
  scatterCandidates,
  scatterProps,
  along,
  type Point,
} from './placement';
import {
  applyPlacement,
  registerEntryKind,
  tagEntry,
  yawOf,
  type CreatureEntry,
  type DressingEntry,
  type EffectVolumeEntry,
  type Entry,
  type EntryContext,
  type FogVolumeEntry,
  type GroundEntry,
  type BarrierEntry,
  type ParticlesEntry,
  type PrefabEntry,
  type PropEntry,
  type LineEntry,
  type RegionEntry,
  type Anchor,
  type AvoidItem,
  type ScatterEntry,
  type SoundEntry,
  type SoundScatterEntry,
  type VistaRingEntry,
  type WaterEntry,
  type MooringEntry,
} from './entry';

/**
 * Every kind a zone document can hold, and what each one maps onto in code.
 *
 * Lights are not here: a light belongs to the prop that carries it. Doors are
 * not here: the manager builds them from the portal graph. Groundcover is not
 * here: it grows from terrain paint and from `cover` on a prop.
 */


function seedOf(entry: { seed?: number; id?: string }): number {
  if (entry.seed !== undefined) return entry.seed;
  // A document that never saved a seed still has to build the same thing twice.
  let hash = 2166136261;
  for (const char of entry.id ?? 'entry') {
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  }
  return (hash >>> 0) % 1_000_000;
}

/** An entry's options, coerced against whatever schema its builder declares. */
function optionsOf(
  builder: NonNullable<ReturnType<typeof builderByName>>,
  options: unknown,
): Record<string, unknown> {
  return builder.options ? coerceFields(builder.options, options) : {};
}

/**
 * A placement said in a room's own terms — `in` a room, or `against` a cell
 * edge — resolved to world `at` and `yaw` before the ordinary placement runs.
 */
function inRoom<E extends { at?: readonly number[]; yaw?: unknown; in?: string; against?: { at: readonly [number, number]; side: 'n' | 'e' | 's' | 'w'; along?: number; face?: boolean } }>(entry: E, ctx: EntryContext): E {
  const plan = ctx.interior;
  if (!plan) return entry;
  if (entry.in) {
    for (const storey of plan.storeys) {
      const room = storey.rooms.get(entry.in);
      if (!room) continue;
      const at = entry.at ?? [0, 0];
      const lift = at.length >= 3 ? at[1] : 0;
      const dx = at[0] ?? 0;
      const dz = at.length >= 3 ? at[2] : (at[1] ?? 0);
      return { ...entry, at: [room.i0 * CELL + dx + plan.offset[0], room.level + lift, room.j0 * CELL + dz + plan.offset[1]] };
    }
    console.warn(`no room "${entry.in}" for a placement`);
    return entry;
  }
  if (entry.against) {
    const { at, side, along = 0.5, face } = entry.against;
    const [i, j] = at;
    let x: number;
    let z: number;
    let yaw: number;
    // The inner face of the cell's edge, a little proud of it, and the yaw whose +Z points into the room.
    switch (side) {
      case 'n':
        x = (i + along) * CELL;
        z = j * CELL + 0.02;
        yaw = 0;
        break;
      case 's':
        x = (i + along) * CELL;
        z = (j + 1) * CELL - 0.02;
        yaw = Math.PI;
        break;
      case 'w':
        x = i * CELL + 0.02;
        z = (j + along) * CELL;
        yaw = Math.PI / 2;
        break;
      default:
        x = (i + 1) * CELL - 0.02;
        z = (j + along) * CELL;
        yaw = -Math.PI / 2;
    }
    let level = 0;
    for (const storey of plan.storeys) {
      const id = storey.cells.get((i + 32768) * 65536 + (j + 32768));
      const room = id ? storey.rooms.get(id) : undefined;
      if (room) level = room.level;
    }
    return { ...entry, at: [x + plan.offset[0], level, z + plan.offset[1]], ...(face ? { yaw } : {}) };
  }
  return entry;
}

/** Whether a builder's trees are shared and instanced per zone. */
function stands(name: string): boolean {
  return STAND_SPECIES.has(name);
}

/** The builder a name points at, or a thrown error naming the document's fault. */
function needBuilder(name: string): NonNullable<ReturnType<typeof builderByName>> {
  const builder = builderByName(name);
  if (!builder) throw new Error(`no builder named "${name}"`);
  return builder;
}

const _bounds = new THREE.Box3();
const UP = new THREE.Vector3(0, 1, 0);

/**
 * A point, or a point taken off something already built.
 *
 * Document order is build order, so a referent is always finished by the time
 * anything asks about it — which is what lets a wall butt against a jamb whose
 * width was rolled from a seed.
 */
function pointOf(anchor: Anchor, ctx: EntryContext): Point {
  if (Array.isArray(anchor)) return anchor as Point;
  const ref = anchor as Exclude<Anchor, Point>;
  const base = ctx.resolve(ref.ref);
  if (!base) throw new Error(`nothing built with id "${ref.ref}"`);

  let x = base.position.x;
  let z = base.position.z;

  if (ref.ahead !== undefined) {
    const front = doorFront(base);
    if (front) {
      x = front.x + Math.sin(front.yaw) * ref.ahead;
      z = front.z + Math.cos(front.yaw) * ref.ahead;
    }
  } else if (ref.edge) {
    _bounds.setFromObject(base, true);
    if (ref.edge === '+x') x = _bounds.max.x;
    else if (ref.edge === '-x') x = _bounds.min.x;
    else if (ref.edge === '+z') z = _bounds.max.z;
    else z = _bounds.min.z;
  }

  if (ref.offset) {
    x += ref.offset[0];
    z += ref.offset[1];
  }
  return [x, z];
}

/**
 * Where a door leaf stands in a building's first doorway, and which way it
 * faces — in the zone's space.
 *
 * The standoff is taken along the doorway's own normal first and the whole
 * offset is then turned by the building's yaw; the other order puts the leaf on
 * a different wall.
 */
function doorFront(object: THREE.Object3D): { x: number; z: number; yaw: number } | null {
  if (!(object instanceof THREE.Mesh)) return null;
  const way = doorways(object)[0];
  if (!way) return null;
  const yaw = object.rotation.y;
  const stand = doorwayFront(way, DOOR_PROUD);
  const offset = new THREE.Vector3(stand.x, 0, stand.z).applyAxisAngle(UP, yaw);
  return { x: object.position.x + offset.x, z: object.position.z + offset.z, yaw: yaw + way.yaw };
}

// --- prop -------------------------------------------------------------------

registerEntryKind<PropEntry>({
  kind: 'prop',
  palette: { tab: 'objects', list: () => [] },
  names: (entry) => [entry.builder],
  asks(entry, ctx) {
    const builder = builderByName(entry.builder);
    if (!builder) return [];
    if (stands(builder.name)) return [{ builder: entry.builder, seed: variantSeed(ctx.zone, builder.name, seedOf(entry)), scale: 1 }];
    return [
      {
        builder: entry.builder,
        seed: seedOf(entry),
        scale: entry.scale,
        extras: optionsOf(builder, entry.options),
      },
    ];
  },
  build(placed, ctx) {
    const entry = inRoom(placed, ctx);
    const builder = needBuilder(entry.builder);
    const extras = optionsOf(builder, entry.options);
    const seed = seedOf(entry);
    // Built on a worker before this walk ran, where the builder was one pure
    // walk to a `finish`. A miss builds it here, exactly as it always did.
    let mesh: THREE.Mesh;
    if (stands(builder.name)) {
      mesh = standMesh(ctx.collected.stands, ctx.zone, builder, seed, entry.scale ?? 1);
    } else {
      const warm = takeWarm({ builder: entry.builder, seed, scale: entry.scale, extras });
      mesh = warm ? finishCaptured(warm) : builder.build({ seed, scale: entry.scale, ...extras });
    }
    applyPlacement(mesh, entry, ctx);
    if (mesh.userData.stand && entry.stretch === undefined) mesh.scale.setScalar(entry.scale ?? 1);
    // The item systems read this back, so a taken prop is carried with the
    // exact look it stood with.
    mesh.userData.seed = seed;

    const solid = entry.solid ?? builder.solid !== false;
    if (solid) markCollidable(mesh);
    if (entry.underfoot) mesh.userData.underfoot = entry.underfoot;
    if (entry.cover) mesh.userData.cover = entry.cover;
    if (entry.ground) mesh.userData.ground = true;
    if (entry.wades) mesh.userData.wades = true;
    if (entry.afloat) {
      const asked = typeof entry.afloat === 'object' ? entry.afloat : {};
      const radius = (asked.radius ?? builder.radius) * (entry.scale ?? 1);
      const draft = asked.draft ?? radius * 0.12;
      const over = ctx.waters.find((w) => specCovers(waterSpecOf(w), mesh.position.x, mesh.position.z));
      if (over) mesh.position.y = specLevelAt(waterSpecOf(over), mesh.position.x, mesh.position.z) - draft;
      mesh.userData.floatRadius = radius;
      ctx.collected.floats.push({ object: mesh, draft, radius });
    }
    if (entry.label) markLabelled(mesh, entry.label);
    if (entry.text) markReadable(mesh, builder, entry.text);
    return mesh;
  },
});

// --- creature ---------------------------------------------------------------

registerEntryKind<CreatureEntry>({
  kind: 'creature',
  palette: { tab: 'creatures', list: () => [] },
  names: (entry) => [wearing(entry).builder],
  asks(entry) {
    const worn = wearing(entry);
    const builder = builderByName(worn.builder);
    return builder ? [creatureAsk(worn, builder)] : [];
  },
  build(entry, ctx) {
    const worn = wearing(entry);
    const builder = needBuilder(worn.builder);
    const ask = creatureAsk(worn, builder);
    // A rigged builder is captured too: the bones and the `LifeSpec` cross the
    // wire and the skeleton is bound here, where the materials are.
    const warm = takeWarm(ask);
    const mesh = warm
      ? finishCaptured(warm)
      : builder.build({ seed: ask.seed, scale: ask.scale, ...ask.extras } as never);
    applyPlacement(mesh, entry, ctx);
    // A skinned mesh raycasts against its bind pose, so the crosshair is given
    // an invisible cylinder to find instead. Invisible rather than absent: a
    // raycast does not test `visible`, and nothing invisible is drawn or
    // shadowed.
    const life = mesh.userData.life as LifeSpec | undefined;
    if (life) {
      const folk: Folk = worn.folk === 'city' ? 'city' : 'country';
      const person = entry.person ? personById(entry.person) : undefined;
      // An animal carries its species and nothing the zone hands its people.
      const species = life.kind === 'biped' ? undefined : SPECIES_TRAIT[life.call ?? 'voice'];
      const traits =
        life.kind === 'biped'
          ? [...ctx.traits, ...(entry.traits ?? []), ...(person?.traits ?? [])]
          : [...(species ? [species] : []), ...(entry.traits ?? [])];
      const name = entry.name ?? person?.name ?? traitName(traits);
      if (name) {
        // A figure is a cylinder about its feet. An animal is a closed box the
        // size of its body, nose to tail along +Z and up to its head: a ray from
        // a standing eye comes down onto its back, and an open cylinder only
        // offers that ray the inside of its far wall.
        const tall = life.kind === 'biped' ? life.height : Math.max(life.height, life.headHeight) + 0.1;
        const proxy =
          life.kind === 'biped'
            ? new THREE.Mesh(new THREE.CylinderGeometry(life.radius, life.radius, tall, 8, 1, true))
            : new THREE.Mesh(new THREE.BoxGeometry(life.radius * 1.6, tall, life.bodyLength + 0.2));
        proxy.name = 'npc-hover';
        proxy.visible = false;
        proxy.position.y = tall / 2;
        proxy.userData.label = name;
        proxy.userData.npc = { folk, name, person: entry.person, traits } satisfies NpcMark;
        proxy.userData.noCollide = true;
        mesh.add(proxy);
      }
    }
    // Creatures move: they are never in the octree, and `LifeActivity` picks
    // them up off `userData.life` and `userData.rig`.
    return mesh;
  },
});

/** The trait an animal speaks with, by the call its builder gave it. */
const SPECIES_TRAIT: Partial<Record<NonNullable<LifeSpec['call']>, string>> = {
  dog: 'dog',
  cow: 'cow',
  sheep: 'sheep',
  pig: 'pig',
  fowl: 'hen',
};

/** The entry as its person wears it. A named body wins over the placement's. */
function wearing(entry: CreatureEntry): CreatureEntry {
  const body = entry.person ? personById(entry.person)?.body : undefined;
  if (!body) return entry;
  const kept = Object.fromEntries(Object.entries(body).filter(([, value]) => value !== undefined));
  return { ...entry, ...kept };
}

/** What to call somebody with no name of their own: the last trait that supplies one. */
function traitName(traits: readonly string[]): string | undefined {
  let name: string | undefined;
  for (const id of traits) name = traitById(id)?.name ?? name;
  return name;
}

/**
 * What a creature entry calls its builder with. The one place the options are
 * assembled, so the warm and the walk key the same way — the order of the keys
 * is part of that key.
 */
function creatureAsk(
  entry: CreatureEntry,
  builder: NonNullable<ReturnType<typeof builderByName>>,
): PropAsk {
  return {
    builder: entry.builder,
    seed: seedOf(entry),
    scale: entry.scale,
    extras: {
      ...(entry.roam !== undefined ? { roam: entry.roam } : {}),
      ...(entry.folk !== undefined ? { folk: entry.folk } : {}),
      ...(entry.face !== undefined ? { face: entry.face } : {}),
      ...optionsOf(builder, entry.options),
    },
  };
}

// --- line -------------------------------------------------------------------

const BARRIER_MATERIAL = new THREE.MeshBasicMaterial();
/** Metres of standing height on the invisible slabs. */
const BARRIER_HEIGHT = 3;

/**
 * The half of a boundary that actually stops you. Never drawn, always collided
 * with — three times its standing height and sunk by the same, so it holds over
 * a shelf and a slope without the ground being levelled for it.
 */
function slab(root: THREE.Object3D, from: Point, to: Point, ctx: EntryContext, height = BARRIER_HEIGHT): void {
  const { yaw, length } = along(from, to);
  const x = (from[0] + to[0]) / 2;
  const z = (from[1] + to[1]) / 2;
  // Overlapping its neighbours, so no corner has a seam to squeeze through.
  const box = new THREE.Mesh(new THREE.BoxGeometry(length + 0.8, height * 3, 0.5), BARRIER_MATERIAL);
  box.position.set(x, ctx.groundAt(x, z) + height / 2, z);
  // rotateY(yaw) takes the box's +X to the run's direction.
  box.rotation.y = yaw;
  box.visible = false;
  root.add(markCollidable(box));
}

/** A water body's level under a point, from the zone's water entries alone. */
function waterFromSpecs(ctx: EntryContext, x: number, z: number) {
  for (const entry of ctx.waters) {
    const spec = waterSpecOf(entry);
    if (spec.regime === 'fall' || !specCovers(spec, x, z)) continue;
    const level = specLevelAt(spec, x, z);
    const column = level - ctx.groundAt(x, z);
    if (column <= 0) continue;
    return { body: spec.id, regime: spec.regime, level, column, flow: [0, 0] as [number, number], heightAt: () => level };
  }
  return null;
}

/** One oriented box as an unseen collider, sunk and overtall as `slab` makes them. */
function boxCollider(box: { centre: readonly [number, number, number]; halfExtents: readonly [number, number, number]; yaw: number }): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(box.halfExtents[0] * 2, box.halfExtents[1] * 2, box.halfExtents[2] * 2), BARRIER_MATERIAL);
  mesh.position.set(box.centre[0], box.centre[1], box.centre[2]);
  // rotateY(yaw) takes the box's +X to the chord's direction.
  mesh.rotation.y = box.yaw;
  mesh.visible = false;
  return markCollidable(mesh);
}

/**
 * Lays a line with its builder and expands what came back: one merged mesh
 * (with a crown when the builder made canopy parts), a collider per chord, the
 * footprint for the cover mask, and the props standing at its marks.
 */
function expandLaid(name: string, seed: number, laid: Laid, ctx: EntryContext, cover?: string): THREE.Group {
  const group = new THREE.Group();
  if (laid.parts.length > 0) {
    const art = assemble(laid.parts);
    const crown = assembleCanopy(laid.parts);
    const mesh = finish(art, name, (seed % 628) / 100, laid.underfoot, crown);
    if (laid.solid === false) mesh.userData.noCollide = true;
    else markCollidable(mesh);
    if (laid.footprint) {
      mesh.userData.footprint = laid.footprint;
      if (laid.footprintSoft) mesh.userData.footprintSoft = laid.footprintSoft;
    }
    if (cover) mesh.userData.cover = cover;
    group.add(mesh);
  }
  for (const box of laid.colliders) group.add(boxCollider(box));
  for (const prop of laid.props) {
    const builder = builderByName(prop.builder);
    if (!builder) {
      console.warn(`line: no builder named "${prop.builder}" for its mark`);
      continue;
    }
    const mesh = builder.build({ seed: prop.seed, scale: prop.scale, ...optionsOf(builder, prop.options) });
    mesh.userData.seed = prop.seed;
    place(group, mesh, prop.at[0], prop.at[1], prop.yaw, ctx.groundAt, builder.solid !== false);
  }
  return group;
}

function lineOf(entry: LineEntry, ctx: EntryContext, builder: LineBuilder | null): Line {
  return {
    id: entry.id ?? 'line',
    seed: seedOf(entry),
    closed: entry.closed === true,
    smooth: entry.smooth ?? builder?.name === 'hedge',
    points: entry.points.map((p) => ({ at: pointOf(p.at, ctx), width: p.width, height: p.height, corner: p.corner })),
    marks: entry.marks ?? [],
    style: entry.style,
    options: entry.options,
  };
}

function layContext(ctx: EntryContext, seed: number) {
  return {
    groundAt: ctx.groundAt,
    waterAt: (x: number, z: number) => waterFromSpecs(ctx, x, z),
    hash: (index: number, channel: number) => lineHash(seed, index, channel),
    ground: GROUND[ctx.terrain?.baseMaterial ?? 'turf'].color,
  };
}

registerEntryKind<LineEntry>({
  kind: 'line',
  schema: {
    builder: { type: 'choice', options: () => [...Object.keys(LINE_BUILDERS), 'track'] },
    style: { type: 'string' },
    closed: { type: 'boolean' },
    smooth: { type: 'boolean' },
  },
  defaults: () => ({ builder: 'fence', points: [{ at: [0, 0] }, { at: [6, 0] }] }),
  names(entry) {
    const out = [...(lineBuilderByName(entry.builder)?.props ?? [])];
    for (const mark of entry.marks ?? []) {
      if (mark.builder) out.push(mark.builder);
      else if (mark.kind === 'bridge') out.push('footbridge');
    }
    return out;
  },
  build(entry, ctx) {
    if (entry.builder === 'track') return trackGroup(entry, ctx);
    const builder = lineBuilderByName(entry.builder);
    if (!builder) throw new Error(`no line builder named "${entry.builder}"`);
    const line = lineOf(entry, ctx, builder);
    if (line.points.length < 2) return null;
    const laid = builder.lay(line, layContext(ctx, line.seed));
    return expandLaid(builder.name, line.seed, laid, ctx, entry.cover);
  },
});

// --- region -----------------------------------------------------------------

registerEntryKind<RegionEntry>({
  kind: 'region',
  schema: { builder: { type: 'choice', options: ['rows', 'border'] } },
  defaults: () => ({ builder: 'rows', points: [[-6, -6], [6, -6], [6, 6], [-6, 6]], options: { rowPitch: 6, pitch: 5, headland: 2, plant: 'fruit' } }),
  names(entry) {
    const options = (entry.options ?? {}) as Record<string, unknown>;
    if (entry.builder === 'rows') return [typeof options.plant === 'string' ? options.plant : 'fruit'];
    const line = lineBuilderByName(typeof options.builder === 'string' ? options.builder : 'hedge');
    return [...(line?.props ?? [])];
  },
  asks(entry, ctx) {
    if (entry.builder !== 'rows') return [];
    const options = (entry.options ?? {}) as Partial<RowsOptions>;
    const builder = builderByName(options.plant ?? 'fruit');
    if (!builder) return [];
    const placed = rows(entry.points, seedOf(entry), { rowPitch: options.rowPitch ?? 6, pitch: options.pitch ?? 5, headland: options.headland ?? 2, plant: builder.name, bearing: options.bearing, jitter: options.jitter, scale: options.scale });
    if (stands(builder.name)) {
      const seen = new Set<number>();
      const asks: PropAsk[] = [];
      for (const p of placed) {
        const variant = variantSeed(ctx.zone, builder.name, p.seed);
        if (seen.has(variant)) continue;
        seen.add(variant);
        asks.push({ builder: builder.name, seed: variant, scale: 1 });
      }
      return asks;
    }
    return placed.map((p) => ({ builder: builder.name, seed: p.seed, scale: p.scale }));
  },
  build(entry, ctx) {
    const seed = seedOf(entry);
    const options = (entry.options ?? {}) as Record<string, unknown>;
    if (entry.builder === 'rows') {
      const o = options as Partial<RowsOptions>;
      const builder = needBuilder(o.plant ?? 'fruit');
      const group = new THREE.Group();
      const placed = rows(entry.points, seed, { rowPitch: o.rowPitch ?? 6, pitch: o.pitch ?? 5, headland: o.headland ?? 2, plant: builder.name, bearing: o.bearing, jitter: o.jitter, scale: o.scale });
      for (const p of placed) {
        const mesh = stands(builder.name)
          ? standMesh(ctx.collected.stands, ctx.zone, builder, p.seed, p.scale)
          : (() => {
              const warm = takeWarm({ builder: builder.name, seed: p.seed, scale: p.scale });
              return warm ? finishCaptured(warm) : builder.build({ seed: p.seed, scale: p.scale });
            })();
        mesh.userData.seed = p.seed;
        place(group, mesh, p.x, p.z, p.yaw, ctx.groundAt, builder.solid !== false);
      }
      return group;
    }
    if (entry.builder === 'border') {
      const name = typeof options.builder === 'string' ? options.builder : 'hedge';
      const builder = lineBuilderByName(name);
      if (!builder) throw new Error(`no line builder named "${name}"`);
      const width = typeof options.width === 'number' ? options.width : 1;
      const line = borderLine(entry.id ?? 'border', seed, entry.points, width, typeof options.style === 'string' ? options.style : undefined, options.options as Record<string, unknown> | undefined);
      if (options.smooth === true) (line as { smooth: boolean }).smooth = true;
      const laid = builder.lay(line, layContext(ctx, seed));
      return expandLaid(builder.name, seed, laid, ctx);
    }
    throw new Error(`no region builder named "${entry.builder}"`);
  },
});

// --- scatter ----------------------------------------------------------------// --- scatter ----------------------------------------------------------------

registerEntryKind<ScatterEntry>({
  kind: 'scatter',
  schema: {
    count: { type: 'int', min: 1, max: 400 },
    within: { type: 'number', min: 0.5, max: 200, step: 0.5, label: 'radius (m)' },
    maxSlope: { type: 'number', min: 0, max: 80, step: 1, label: 'steepest (deg)' },
    minHeight: { type: 'number', min: -60, max: 200, step: 0.5 },
    maxHeight: { type: 'number', min: -60, max: 200, step: 0.5 },
    inset: { type: 'number', min: 0, max: 20, step: 0.5, label: 'clear of the edge' },
    region: { type: 'string', label: 'inside region' },
  },
  defaults: () => ({ builder: 'bush', count: 12, within: 8 }),
  names: (entry) => [entry.builder],
  // Every candidate is warmed, including the ones the ground will reject: the
  // accept, slope, height and avoid tests need a built context this does not
  // have, and building a rejected prop on a worker costs less than waiting for
  // an accepted one on the frame. `dropWarm` frees what is not claimed.
  asks(entry, ctx) {
    const builder = builderByName(entry.builder);
    if (!builder) return [];
    const candidates = scatterCandidates({
      seed: seedOf(entry),
      count: entry.count,
      within: entry.within,
      from: entry.from,
      scale: entry.scale,
    });
    if (stands(builder.name)) {
      // Four variants at most, however many candidates: one build each.
      const seen = new Set<number>();
      const asks: PropAsk[] = [];
      for (const candidate of candidates) {
        const variant = variantSeed(ctx.zone, builder.name, candidate.seed);
        if (seen.has(variant)) continue;
        seen.add(variant);
        asks.push({ builder: entry.builder, seed: variant, scale: 1 });
      }
      return asks;
    }
    return candidates.map((candidate) => ({
      builder: entry.builder,
      seed: candidate.seed,
      scale: candidate.scale,
    }));
  },
  build(entry, ctx) {
    const builder = needBuilder(entry.builder);
    const group = new THREE.Group();
    const avoid = avoidCircles(entry.avoid, ctx);
    const region = entry.region ? ctx.regions[entry.region] : undefined;
    const inset = entry.inset ?? 2;

    scatterProps(
      group,
      builder,
      {
        seed: seedOf(entry),
        count: entry.count,
        within: entry.within,
        from: entry.from,
        maxSlope: entry.maxSlope,
        minHeight: entry.minHeight,
        maxHeight: entry.maxHeight,
        avoid,
        scale: entry.scale,
      },
      {
        groundAt: ctx.groundAt,
        slopeAt: ctx.slopeAt,
        accept: (x, z) => {
          if (region) return region.some((shape) => shapeDistance(shape, x, z) <= 0);
          if (ctx.outline) return insidePolygon(ctx.outline, x, z, inset);
          return true;
        },
      },
      undefined,
      stands(builder.name) ? (seed, scale) => standMesh(ctx.collected.stands, ctx.zone, builder, seed, scale) : undefined,
    );
    return group;
  },
});

/** Everything a scatter is told to stay off, as circles. */
function avoidCircles(
  avoid: string | readonly AvoidItem[] | undefined,
  ctx: EntryContext,
): readonly (readonly [number, number, number])[] {
  if (!avoid) return [];
  if (typeof avoid === 'string') return circlesOf(ctx.regions[avoid] ?? []);
  const out: (readonly [number, number, number])[] = [];
  for (const item of avoid) {
    if (typeof item === 'string') {
      out.push(...circlesOf(ctx.regions[item] ?? []));
    } else if (Array.isArray(item)) {
      out.push(item as readonly [number, number, number]);
    } else {
      const ref = item as { ref: string; radius: number; ahead?: number };
      const at = pointOf({ ref: ref.ref, ahead: ref.ahead }, ctx);
      out.push([at[0], at[1], ref.radius]);
    }
  }
  return out;
}

/** A region as circles, for the scatter rule's cheap avoidance test. */
function circlesOf(shapes: readonly PatchShape[]): readonly (readonly [number, number, number])[] {
  const out: (readonly [number, number, number])[] = [];
  for (const shape of shapes) {
    if (shape.kind === 'blot') out.push([shape.at[0], shape.at[1], shape.radius]);
    else if (shape.kind === 'field') {
      const cx = (shape.min[0] + shape.max[0]) / 2;
      const cz = (shape.min[1] + shape.max[1]) / 2;
      out.push([cx, cz, Math.hypot(shape.max[0] - cx, shape.max[1] - cz)]);
    } else if (shape.kind === 'polygon') {
      let cx = 0;
      let cz = 0;
      for (const [px, pz] of shape.points) {
        cx += px / shape.points.length;
        cz += pz / shape.points.length;
      }
      let r = 0;
      for (const [px, pz] of shape.points) r = Math.max(r, Math.hypot(px - cx, pz - cz));
      out.push([cx, cz, r]);
    } else {
      for (const point of shape.through) out.push([point[0], point[1], shape.width / 2]);
    }
  }
  return out;
}

// --- barrier ----------------------------------------------------------------

registerEntryKind<BarrierEntry>({
  kind: 'barrier',
  schema: { height: { type: 'number', min: 0.5, max: 20, step: 0.1 } },
  defaults: () => ({ size: [2, 3, 0.5] }),
  names: () => [],
  build(entry, ctx) {
    const group = new THREE.Group();
    if (entry.from && entry.to) {
      slab(group, pointOf(entry.from, ctx), pointOf(entry.to, ctx), ctx, entry.height ?? BARRIER_HEIGHT);
      return group;
    }
    const size = entry.size ?? [2, entry.height ?? BARRIER_HEIGHT, 2];
    const box = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), BARRIER_MATERIAL);
    applyPlacement(box, entry, ctx);
    box.position.y += size[1] / 2;
    box.visible = false;
    group.add(markCollidable(box));
    return group;
  },
});

// --- prefab -----------------------------------------------------------------

registerEntryKind<PrefabEntry>({
  kind: 'prefab',
  schema: { prefab: { type: 'string' } },
  defaults: () => ({ prefab: '' }),
  // Its entries', recursively. `entryNames` resolves the body; a prefab that is
  // not there names nothing and the walk reports it.
  names: (entry) => [`#prefab:${entry.prefab}`],
  build(entry, ctx) {
    const body = ctx.prefabs[entry.prefab];
    if (!body) throw new Error(`no prefab named "${entry.prefab}"`);
    const group = new THREE.Group();
    applyPlacement(group, entry, ctx);
    // Seeds inside are offset by this entry's, so two of the same prefab differ.
    ctx.expand(body, group, `${entry.id ?? entry.prefab}.`, seedOf(entry));
    return group;
  },
});

// --- ground -----------------------------------------------------------------

registerEntryKind<GroundEntry>({
  kind: 'ground',
  names: () => [],
  schema: {
    y: { type: 'number', min: -60, max: 200, step: 0.05 },
    thickness: { type: 'number', min: 0.05, max: 4, step: 0.05 },
    material: { type: 'choice', options: () => Object.keys(GROUND) },
    cover: { type: 'choice', options: () => Object.keys(COVER_TYPES) },
    underfoot: { type: 'choice', options: () => Object.keys(SURFACES) },
  },
  defaults: () => ({ size: [4, 4], thickness: 0.3, material: 'stone' }),
  build(entry, ctx) {
    const size = entry.size ?? [4, 4];
    const thickness = entry.thickness ?? 0.3;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size[0], thickness, size[1]),
      groundMaterial(),
    );
    applyPlacement(mesh, entry, ctx);
    if (entry.y !== undefined) mesh.position.y = entry.y;
    mesh.position.y -= thickness / 2;
    mesh.name = 'authoredGround';
    mesh.userData.ground = true;
    if (entry.cover) mesh.userData.cover = entry.cover;
    if (entry.underfoot) mesh.userData.underfoot = entry.underfoot;
    markCollidable(mesh);
    return mesh;
  },
});

let _groundMaterial: THREE.Material | null = null;
function groundMaterial(): THREE.Material {
  _groundMaterial ??= new THREE.MeshLambertMaterial({ color: 0x6f6a58 });
  return _groundMaterial;
}

// --- water ------------------------------------------------------------------

/** The body an entry describes, before anything is built. */
export function waterSpecOf(entry: WaterEntry): WaterBodySpec {
  const at = entry.at;
  return {
    id: entry.id ?? 'water',
    regime: entry.regime,
    palette: entry.palette,
    level: entry.level ?? (at && at.length >= 3 ? at[1] : undefined),
    shape: entry.shape,
    course: entry.course,
    fall: entry.fall,
    reach: entry.reach,
    swell: entry.swell,
    shelter: entry.shelter,
    facet: entry.facet,
    segment: entry.segment,
    bury: entry.bury,
    ripples: entry.ripples,
    wash: entry.wash,
    collar: entry.collar,
    chop: entry.chop,
    rise: entry.rise,
  };
}

/** The voice a body has by its regime, unless the entry says otherwise. */
function waterVoice(entry: WaterEntry, body: WaterBody): Record<string, unknown> | null {
  const id = entry.id ?? 'water';
  if (entry.sound === null) return null;
  if (entry.sound) {
    const at = (entry.sound as { at?: unknown }).at;
    const centre = bodyCentre(body);
    return { ...entry.sound, id, at: at ?? [centre[0], body.levelAt(centre[0], centre[1]), centre[1]] };
  }
  switch (body.regime) {
    case 'still': {
      const [cx, cz] = bodyCentre(body);
      return {
        model: 'water',
        options: { flow: 'lap', gain: 0.22, tone: 1 },
        at: [cx, body.levelAt(cx, cz), cz],
        id,
        refDistance: 3,
        maxDistance: 22,
        rolloff: 1.3,
        reverb: 0.4,
      };
    }
    case 'flow': {
      const first = body.samples[0];
      if (!first) return null;
      let speed = 0;
      let width = 0;
      for (const sample of body.samples) {
        speed += sample.speed;
        width += sample.width;
      }
      speed /= body.samples.length;
      width /= body.samples.length;
      const flow = speed < 0.4 ? 'brook' : speed < 0.9 ? 'stream' : 'rapid';
      return {
        model: 'water',
        options: { flow, gain: Math.min(0.45, 0.2 + width * speed * 0.03), tone: Math.max(0.7, 1.15 - width * 0.03) },
        at: [first.x, first.level, first.z],
        id: `${id}:flow`,
        refDistance: 4,
        maxDistance: 32,
        rolloff: 1.3,
        reverb: 0.4,
      };
    }
    case 'fall': {
      if (!body.fall) return null;
      const { x, z, width, drop } = body.fall;
      return {
        model: 'cascade',
        options: { size: width * drop, gain: 0.5 },
        at: [x, body.levelAt(x, z) - drop, z],
        id,
        refDistance: 6,
        maxDistance: 70,
        rolloff: 1.1,
        reverb: 0.5,
        importance: 1.5,
      };
    }
    case 'sea':
      // The surf is placed by hand, where the shore is.
      return null;
  }
}

function bodyCentre(body: WaterBody): [number, number] {
  const b = body.bounds;
  return [(b.minX + b.maxX) / 2, (b.minZ + b.maxZ) / 2];
}

registerEntryKind<WaterEntry>({
  kind: 'water',
  names: () => [],
  schema: {
    level: { type: 'number', min: -60, max: 200, step: 0.05, label: 'level (m)' },
    reach: { type: 'number', min: 0, max: 5000, step: 10, label: 'reach (m)' },
    facet: { type: 'number', min: 0, max: 1, step: 0.05 },
    segment: { type: 'number', min: 0.2, max: 8, step: 0.1, label: 'metres per quad' },
    bury: { type: 'number', min: 0, max: 3, step: 0.05, label: 'bury (m)' },
    chop: { type: 'number', min: 0, max: 3, step: 0.05 },
    wash: { type: 'number', min: 0, max: 2, step: 0.05, label: 'wash line (m)' },
    collar: { type: 'number', min: 0, max: 2, step: 0.05, label: 'collar (m)' },
    rise: { type: 'number', min: 0, max: 30, step: 0.5, label: 'fish per minute' },
  },
  defaults: () => ({
    regime: 'still',
    level: 0,
    shape: [
      [-4, -4],
      [4, -4],
      [4, 4],
      [-4, 4],
    ],
  }),
  build(entry, ctx) {
    // The skirt holds the seabed past the level's square; the terrain's landforms die out there.
    const groundAt = (x: number, z: number): number =>
      Math.min(ctx.groundAt(x, z), ctx.skirt?.heightAt(x, z) ?? Infinity);
    const body = new WaterBody(waterSpecOf(entry), {
      groundAt,
      regions: ctx.regions as unknown as Record<string, readonly ShelterShape[]>,
      bodies: ctx.waters.map(waterSpecOf),
      stands: ctx.stands,
      seed: seedOf(entry),
    });
    ctx.collected.water.push(body);
    const voice = waterVoice(entry, body);
    if (voice) ctx.collected.emitters.push(voice as never);
    return body.root;
  },
});

// --- mooring ----------------------------------------------------------------

registerEntryKind<MooringEntry>({
  kind: 'mooring',
  names: () => [],
  schema: {
    float: { type: 'ref', label: 'holds' },
    post: { type: 'ref', label: 'made fast to' },
    lift: { type: 'number', min: 0, max: 5, step: 0.05, label: 'tied at (m)' },
    slack: { type: 'number', min: 0, max: 1, step: 0.01 },
  },
  defaults: () => ({ float: '', slack: 0.15, lift: 0.9 }),
  build(entry, ctx) {
    const float = ctx.resolve(entry.float);
    if (!float) throw new Error(`nothing afloat with id "${entry.float}"`);
    const lift = entry.lift ?? 0.9;
    let post: THREE.Vector3;
    if (entry.post) {
      const base = ctx.resolve(entry.post);
      if (!base) throw new Error(`nothing built with id "${entry.post}"`);
      post = base.position.clone();
      post.y += lift;
    } else if (entry.at && entry.at.length >= 2) {
      const x = entry.at[0];
      const z = entry.at.length >= 3 ? entry.at[2] : entry.at[1];
      post = new THREE.Vector3(x, entry.at.length >= 3 ? entry.at[1] : ctx.groundAt(x, z) + lift, z);
    } else {
      throw new Error('a mooring needs a post or a point');
    }
    const radius = (float.userData.floatRadius as number | undefined) ?? 1;
    // The hull is built along +X with the bow at +X; the rope is tied at the bow, just above the sheer.
    const mooring = new Mooring({
      float,
      post,
      cleat: new THREE.Vector3(radius * 0.9, 0.3, 0),
      slack: entry.slack ?? 0.15,
      colour: 0x8a7550,
    });
    const id = entry.id ?? 'mooring';
    mooring.mesh.name = `mooring:${id}`;
    ctx.collected.moorings.push(mooring);
    ctx.collected.emitters.push({
      model: 'friction',
      options: { motion: 'steady', force: 0, speed: 0, pitch: 170, decay: 0.35, bright: 0.35, roughness: 0.7, gain: 0.3 },
      at: [post.x, post.y, post.z],
      id: `${id}:creak`,
      refDistance: 2,
      maxDistance: 14,
      rolloff: 1.4,
      reverb: 0.3,
    } as never);
    return mooring.mesh;
  },
});

// --- track ------------------------------------------------------------------

/**
 * A track line: the zone's tracks are one network, built together on the first
 * of them in a pass and keyed by id. A line's marks may have split it into
 * several network tracks (`id`, `id#1`, …); they come back as one group, with
 * the bridge the mark named standing across the gap.
 */
function trackGroup(entry: LineEntry, ctx: EntryContext): THREE.Group {
  const id = entry.id ?? 'track';
  let network = networks.get(ctx.tracks);
  if (!network || [...network.values()].some((group) => group.parent && group.parent.parent === null && false)) network = undefined;
  if (!network) {
    const beside = GROUND[ctx.terrain?.baseMaterial ?? 'turf'].color;
    network = buildTrackNetwork({
      tracks: ctx.tracks.map((track) => ({
        id: track.id ?? 'track',
        through: track.through,
        width: track.width,
        surface: track.surface,
        edge: track.edge,
        wear: track.wear,
        seed: seedOf(track),
      })),
      groundAt: ctx.groundAt,
      beside,
    });
    networks.set(ctx.tracks, network);
  }
  const group = new THREE.Group();
  for (const [key, built] of network) {
    if (key === id || key.startsWith(`${id}#`)) {
      if (built.parent) built.removeFromParent();
      group.add(built);
    }
  }
  for (const mark of entry.marks ?? []) {
    if (mark.kind !== 'bridge') continue;
    const builder = builderByName(mark.builder ?? 'footbridge');
    if (!builder) continue;
    const line = lineOf(entry, ctx, null);
    const walk = new (class {})() as never;
    void walk;
    const at = stationOf(line, mark.at);
    const mesh = builder.build({ seed: mark.seed ?? seedOf(entry) + Math.round(mark.at * 10), ...optionsOf(builder, { ...(mark.options ?? {}), length: mark.width }) });
    place(group, mesh, at.x, at.z, at.yaw, ctx.groundAt, builder.solid !== false);
  }
  return group;
}

/** Where a line is at `s` metres along its chords, and the yaw that lays a builder's +X along it. */
function stationOf(line: Line, s: number): { x: number; z: number; yaw: number } {
  let left = s;
  for (let i = 0; i + 1 < line.points.length; i++) {
    const a = line.points[i].at;
    const b = line.points[i + 1].at;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (left <= len || i + 2 === line.points.length) {
      const t = len > 0 ? Math.min(1, Math.max(0, left / len)) : 0;
      // rotateY(yaw) takes +X to (cos yaw, 0, −sin yaw), the chord.
      return { x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, yaw: Math.atan2(-(b[1] - a[1]), b[0] - a[0]) };
    }
    left -= len;
  }
  const p = line.points[0].at;
  return { x: p[0], z: p[1], yaw: 0 };
}

const networks = new WeakMap<readonly TrackEntry[], Map<string, THREE.Group>>();

// --- particles --------------------------------------------------------------

registerEntryKind<ParticlesEntry>({
  kind: 'particles',
  names: () => [],
  schema: {},
  defaults: () => ({
    spec: {
      count: 200,
      shape: 'billboard',
      motion: 'rise',
      volume: { kind: 'box', size: [4, 3, 4] },
      size: [0.04, 0.09],
      colour: 0xd8d0c0,
      opacity: 0.7,
      speed: [0.2, 0.5],
    },
  }),
  build(entry, ctx) {
    const spec = { shape: 'billboard', ...entry.spec } as unknown as ParticleSpec;
    const mesh = createParticles(spec, seedOf(entry));
    applyPlacement(mesh, entry, ctx);
    return mesh;
  },
});

// --- volumes ----------------------------------------------------------------

registerEntryKind<FogVolumeEntry>({
  kind: 'fogVolume',
  names: () => [],
  schema: {
    shape: { type: 'choice', options: ['ellipsoid', 'box'] },
    density: { type: 'number', min: 0, max: 2, step: 0.01, label: 'per metre' },
    tint: { type: 'color' },
    softness: { type: 'number', min: 0.02, max: 1, step: 0.01 },
    noiseScale: { type: 'number', min: 0.5, max: 40, step: 0.5, label: 'billow (m)' },
    turbulence: { type: 'number', min: 0, max: 1, step: 0.01 },
  },
  defaults: () => ({
    shape: 'ellipsoid',
    center: [0, 1, 0],
    size: [6, 2, 6],
    density: 0.25,
    tint: '#c8d0d8',
    softness: 0.4,
    noiseScale: 6,
    turbulence: 0.4,
  }),
  build(entry, ctx) {
    ctx.collected.fogVolumes.push({
      shape: entry.shape,
      center: new THREE.Vector3(entry.center[0], entry.center[1], entry.center[2]),
      size: new THREE.Vector3(entry.size[0], entry.size[1], entry.size[2]),
      density: entry.density,
      tint: entry.tint,
      softness: entry.softness,
      noiseScale: entry.noiseScale,
      turbulence: entry.turbulence,
      drift: entry.drift ? new THREE.Vector2(entry.drift[0], entry.drift[1]) : undefined,
    });
    return null;
  },
});

for (const kind of ['glitch', 'horror'] as const) {
  registerEntryKind<EffectVolumeEntry>({
    kind,
    names: () => [],
    schema: {
      shape: { type: 'choice', options: ['ellipsoid', 'box'] },
      strength: { type: 'number', min: 0, max: 1, step: 0.01 },
      tempo: { type: 'number', min: 0.1, max: 8, step: 0.05 },
      grounded: { type: 'boolean' },
    },
    defaults: () => ({ shape: 'ellipsoid', center: [0, 1, 0], size: [4, 3, 4], strength: 0.5 }),
    build(entry, ctx) {
      const placement = {
        shape: entry.shape,
        center: new THREE.Vector3(entry.center[0], entry.center[1], entry.center[2]),
        size: new THREE.Vector3(entry.size[0], entry.size[1], entry.size[2]),
        strength: entry.strength,
        seed: seedOf(entry),
        tempo: entry.tempo,
        weights: entry.weights,
        grounded: entry.grounded,
      };
      // Attached to an entry rather than free-standing: the volume follows the
      // object's matrix, which is what `markGlitched` and `markHaunted` are for.
      if (entry.on) {
        const base = ctx.resolve(entry.on);
        if (base) {
          const spec = {
            shape: entry.shape,
            size: placement.size,
            strength: entry.strength,
            seed: placement.seed,
            tempo: entry.tempo,
            weights: entry.weights,
          };
          if (kind === 'glitch') markGlitched(base, spec as never);
          else markHaunted(base, spec as never);
          return null;
        }
      }
      if (kind === 'glitch') ctx.collected.glitches.push(placement as never);
      else ctx.collected.horrors.push(placement as never);
      return null;
    },
  });
}

// --- sound ------------------------------------------------------------------

registerEntryKind<SoundEntry>({
  kind: 'sound',
  names: () => [],
  schema: { ref: { type: 'ref', label: 'anchored to' }, lift: { type: 'number', min: 0, max: 20, step: 0.05 } },
  defaults: () => ({ spec: { model: 'fire', options: {} } }),
  build(entry, ctx) {
    const spec = { ...entry.spec } as Record<string, unknown>;
    if (entry.ref) {
      const base = ctx.resolve(entry.ref);
      // Above the referent's foot, not its top: a forge's fire is a height on
      // the forge, and a canopy's rustle is a height up the tree.
      if (base) spec.at = [base.position.x, base.position.y + (entry.lift ?? 0), base.position.z];
    } else if (entry.at) {
      const at = entry.at;
      spec.at =
        at.length >= 3
          ? [at[0], at[1], at[2]]
          : [at[0], ctx.groundAt(at[0], at[1]) + (entry.lift ?? 0), at[1]];
    }
    if (entry.id && spec.id === undefined) spec.id = entry.id;
    ctx.collected.emitters.push(spec as never);
    return null;
  },
});

registerEntryKind<SoundScatterEntry>({
  kind: 'soundScatter',
  names: () => [],
  schema: { ref: { type: 'ref', label: 'anchored to' }, lift: { type: 'number', min: 0, max: 20, step: 0.05 } },
  defaults: () => ({ spec: { sound: 'clatter', at: [0, 1, 0], spread: [6, 0.5, 6], every: 30 } }),
  build(entry, ctx) {
    const spec = { ...entry.spec } as Record<string, unknown>;
    if (entry.ref) {
      const base = ctx.resolve(entry.ref);
      if (base) spec.at = [base.position.x, base.position.y + (entry.lift ?? 0), base.position.z];
    } else if (entry.at) {
      const at = entry.at;
      spec.at =
        at.length >= 3
          ? [at[0], at[1], at[2]]
          : [at[0], ctx.groundAt(at[0], at[1]) + (entry.lift ?? 0), at[1]];
    }
    if (entry.id && spec.id === undefined) spec.id = entry.id;
    ctx.collected.scatters.push(spec as never);
    return null;
  },
});

// --- vista ------------------------------------------------------------------

registerEntryKind<VistaRingEntry>({
  kind: 'vistaRing',
  names(entry) {
    const out: string[] = [];
    for (const raw of [...(entry.place ?? []), ...(entry.scatter ?? [])]) {
      const named = raw as { builder?: string; tree?: string };
      const name = named.tree ?? named.builder;
      if (name) out.push(name);
    }
    // The neighbours' icons and the shared far layer, which the ring reads off
    // the atlas rather than off this entry.
    if (entry.neighbours || entry.horizon) out.push(...atlasBuilders());
    return out;
  },
  schema: {
    chunk: { type: 'number', min: 40, max: 800, step: 10, label: 'merge cell (m)' },
    neighbours: { type: 'boolean', label: "neighbours' icons" },
    horizon: { type: 'boolean', label: 'shared far layer' },
  },
  defaults: () => ({ band: { inner: 30, outer: 160 }, place: [], scatter: [] }),
  // `keepOut` is left off: it moves parallax props about after they are built
  // and has no say in which props there are.
  asks(entry, ctx) {
    if (!ctx.skirt) return [];
    const plan = vistaRingPlan({ ...ringPlan(entry, ctx.zone, ctx.skirt), skirt: ctx.skirt });
    keepPlan(planKey(entry), plan);
    // A tree in the ring is built through the stand path, on a variant seed
    // rather than the placement's, and a card is built once per atlas variant
    // however many stand in it. Neither claims a prop warmed at its own seed.
    return plan.filter((prop) => !prop.card && !STAND_SPECIES.has(prop.builder.name)).map(propAsk);
  },
  build(entry, ctx) {
    if (!ctx.skirt) throw new Error('a vista ring needs a skirt');
    const keepOut =
      typeof entry.keepOut === 'string'
        ? ctx.regions[entry.keepOut]
        : entry.keepOut
          ? dilateOutline(ctx.skirt.outline, entry.keepOut.dilate)
          : undefined;
    return vistaRing({
      ...ringPlan(entry, ctx.zone, ctx.skirt),
      skirt: ctx.skirt,
      keepOut,
      plan: takePlan<VistaProp[]>(planKey(entry)) ?? undefined,
    });
  },
});

/** A neighbour's icon subtends what the true thing would at its true distance, times this. */
const ICON_PERSPECTIVE = 1.5;
/** Metres inside the outline a viewer typically stands when looking out. */
const VIEWER_INSET = 40;
/** Metres out from the outline the icons and the far layer stand unless the ring says. */
const NEIGHBOUR_AT = 150;
const HORIZON_AT = 200;

/** The point `out` metres past the outline on the ray from the origin along `(dx, dz)`. */
function onRay(skirt: Skirt, dx: number, dz: number, out: number): [number, number] {
  const length = Math.hypot(dx, dz) || 1;
  const ux = dx / length;
  const uz = dz / length;
  let s = 0;
  while (s < 2000 && skirt.outside(ux * s, uz * s) < out) s += 4;
  return [ux * s, uz * s];
}

function hashOf(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return (h >>> 0) % 0x7fffffff || 1;
}

/** Every neighbouring cell's icon, on its true bearing at its true distance, looking back at this cell. */
function neighbourProps(entry: VistaRingEntry, zone: string, skirt: Skirt): VistaProp[] {
  if (!entry.neighbours) return [];
  const at = (typeof entry.neighbours === 'object' ? entry.neighbours.at : undefined) ?? NEIGHBOUR_AT;
  return neighboursOf(zone).map((near) => {
    const [x, z] = onRay(skirt, near.dx, near.dz, at);
    const scale = Math.min(1, Math.max(0.08, ((at + VIEWER_INSET) / near.distance) * ICON_PERSPECTIVE));
    return {
      builder: needBuilder(near.icon),
      at: [x, z],
      scale,
      seed: hashOf(zone + '>' + near.zone),
      // rotateY(yaw) takes +Z to (sin yaw, 0, cos yaw): the icon's front looks back at the origin.
      yaw: Math.atan2(-near.dx, -near.dz),
      apparent: near.distance,
      clear: ICON_CLEAR,
    };
  });
}

/** Degrees either side of an icon's bearing kept free of scatter, so the road out of the cell shows it. */
const ICON_CLEAR = 10;

/** How big a far thing with a map position is stood, from what it would subtend where it really is. */
function perspective(stand: number, distance: number, times = 1): number {
  return Math.min(1, Math.max(0.08, ((stand + VIEWER_INSET) / distance) * ICON_PERSPECTIVE * times));
}

/** The shared far layer: by bearing, the same from every cell; by map position, where it really is. */
function horizonProps(entry: VistaRingEntry, zone: string, skirt: Skirt): VistaProp[] {
  if (!entry.horizon) return [];
  const at = (typeof entry.horizon === 'object' ? entry.horizon.at : undefined) ?? HORIZON_AT;
  const here = placeOf(zone);
  const props: VistaProp[] = [];
  for (const far of horizonLayer()) {
    let dx: number;
    let dz: number;
    let apparent: number;
    let scale: number | undefined;
    if (far.at) {
      if (!here) continue;
      dx = (far.at[0] - here[0]) * 1000;
      dz = (far.at[1] - here[1]) * 1000;
      apparent = Math.hypot(dx, dz);
      scale = perspective(at, apparent, far.scale ?? 1);
    } else if (far.bearing !== undefined) {
      const bearing = (far.bearing * Math.PI) / 180;
      dx = Math.sin(bearing);
      dz = -Math.cos(bearing);
      apparent = far.apparent ?? 4000;
      scale = far.scale;
    } else {
      continue;
    }
    const [x, z] = onRay(skirt, dx, dz, at);
    props.push({
      builder: needBuilder(far.builder),
      at: [x, z],
      scale,
      seed: far.seed,
      variant: far.variant,
      yaw: Math.atan2(-dx, -dz),
      apparent,
      clear: far.at ? ICON_CLEAR : undefined,
    });
  }
  return props;
}

/** What a kept plan is filed under: the entry as written, so an edit plans afresh. */
function planKey(entry: Entry): string {
  return JSON.stringify(entry);
}

/** Everything about a ring except where it stands, which the two callers differ on. */
function ringPlan(entry: VistaRingEntry, zone: string, skirt: Skirt): Omit<VistaRingOptions, 'skirt' | 'keepOut'> {
  return {
    seed: seedOf(entry),
    band: entry.band,
    // The far layer and the icons first, so nothing scattered pushes them off their bearings.
    place: [
      ...horizonProps(entry, zone, skirt),
      ...neighbourProps(entry, zone, skirt),
      ...(entry.place ?? []).map(namedVistaProp),
    ],
    scatter: (entry.scatter ?? []).map(namedVistaScatter),
    chunk: entry.chunk,
  };
}

/** `tree` names a real foliage builder standing in the ring; `builder` names a vista piece. */
function namedVistaProp(raw: Record<string, unknown>): VistaProp {
  const { builder, tree, ...rest } = raw as { builder?: string; tree?: string } & Record<string, unknown>;
  return { builder: needBuilder(tree ?? builder ?? ''), ...rest } as VistaProp;
}

function namedVistaScatter(raw: Record<string, unknown>): VistaScatter {
  const { builder, tree, ...rest } = raw as { builder?: string; tree?: string } & Record<string, unknown>;
  return { builder: needBuilder(tree ?? builder ?? ''), ...rest } as VistaScatter;
}

registerEntryKind<DressingEntry>({
  kind: 'dressing',
  names: (entry) => entry.kinds.map((raw) => (raw as { builder: string }).builder),
  schema: { solidWithin: { type: 'number', min: -200, max: 200, step: 1, label: 'solid inside (m)' } },
  defaults: () => ({ band: { inner: -4, outer: 14 }, kinds: [] }),
  asks(entry, ctx) {
    if (!ctx.terrain || !ctx.skirt) return [];
    const plan = edgeDressingPlan(dressingOptions(entry, ctx.terrain, ctx.skirt));
    keepPlan(planKey(entry), plan);
    return plan.map((at) => ({
      builder: at.builder.name,
      seed: at.seed,
      scale: at.scale,
    }));
  },
  build(entry, ctx) {
    if (!ctx.terrain || !ctx.skirt) throw new Error('edge dressing needs a terrain and a skirt');
    return edgeDressing({
      ...dressingOptions(entry, ctx.terrain, ctx.skirt),
      plan: takePlan<DressingPlacement[]>(planKey(entry)) ?? undefined,
    });
  },
});

function dressingOptions(entry: DressingEntry, terrain: Terrain, skirt: Skirt): DressingOptions {
  return {
    terrain,
    skirt,
    seed: seedOf(entry),
    band: entry.band,
    solidWithin: entry.solidWithin,
    kinds: entry.kinds.map((raw) => {
      const { builder, ...rest } = raw as { builder: string } & Record<string, unknown>;
      return { builder: needBuilder(builder), ...rest } as DressingKind;
    }),
  };
}

/** Forces the registrations above to run. Imported for effect, called for clarity. */
export function registerBuiltInKinds(): void {}

export { seedOf, needBuilder, yawOf, tagEntry, type Entry };
