import * as THREE from 'three';
import { builderByName } from '../art/registry';
import { coerceFields } from '../art/schema';
import { finishCaptured } from '../art/assemble';
import { takeWarm } from './warmProps';
import type { PropAsk } from '../engine/work/jobs';
import { personById, traitById, type Folk } from './people';
import type { NpcMark } from './Interaction';
import type { LifeSpec } from '../life/spec';
import { markCollidable } from '../player/Collider';
import { markLabelled, markReadable } from './Interaction';
import { markGlitched } from '../art/glitch';
import { markHaunted } from '../art/horror';
import { waterPlane } from '../art/water';
import { createParticles, type ParticleSpec } from '../art/particles';
import { createRng } from '../art/random';
import { fence, FENCE_MAX_SECTIONS, FENCE_SECTION } from '../art/builders/fence';
import { stoneWall, WALL_MAX_SECTIONS, WALL_SECTION, wallHeight } from '../art/builders/stone-wall';
import { stoneWallSquareColumn, COLUMN_REACH } from '../art/builders/stone-wall-square-column';
import { fencePost } from '../art/builders/fence-post';
import { hazel } from '../art/builders/hazel';
import {
  vistaRing,
  vistaRingPlan,
  type VistaProp,
  type VistaRingOptions,
  type VistaScatter,
} from './vista-ring';
import {
  edgeDressing,
  edgeDressingPlan,
  type DressingKind,
  type DressingOptions,
} from './dressing';
import { shapeDistance, GROUND, COVER_TYPES, type PatchShape } from './ground';
import type { Terrain } from './terrain';
import { SURFACES } from '../audio/models/footsteps';
import { doorways, doorwayFront } from '../art/building';
import { dilateOutline, type Skirt } from './vista';
import { DOOR_PROUD } from './Portal';
import {
  insidePolygon,
  layRun,
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
  type ChainEntry,
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
  type RunEntry,
  type Anchor,
  type AvoidItem,
  type ChainRun,
  type ScatterEntry,
  type SoundEntry,
  type SoundScatterEntry,
  type VistaRingEntry,
  type WaterEntry,
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
  asks(entry) {
    const builder = builderByName(entry.builder);
    if (!builder) return [];
    return [
      {
        builder: entry.builder,
        seed: seedOf(entry),
        scale: entry.scale,
        extras: optionsOf(builder, entry.options),
      },
    ];
  },
  build(entry, ctx) {
    const builder = needBuilder(entry.builder);
    const extras = optionsOf(builder, entry.options);
    const seed = seedOf(entry);
    // Built on a worker before this walk ran, where the builder was one pure
    // walk to a `finish`. A miss builds it here, exactly as it always did.
    const warm = takeWarm({ builder: entry.builder, seed, scale: entry.scale, extras });
    const mesh = warm ? finishCaptured(warm) : builder.build({ seed, scale: entry.scale, ...extras });
    applyPlacement(mesh, entry, ctx);
    // The item systems read this back, so a taken prop is carried with the
    // exact look it stood with.
    mesh.userData.seed = seed;

    const solid = entry.solid ?? builder.solid !== false;
    if (solid) markCollidable(mesh);
    if (entry.underfoot) mesh.userData.underfoot = entry.underfoot;
    if (entry.cover) mesh.userData.cover = entry.cover;
    if (entry.ground) mesh.userData.ground = true;
    if (entry.label) markLabelled(mesh, entry.label);
    if (entry.text) markReadable(mesh, builder, entry.text);
    return mesh;
  },
});

// --- creature ---------------------------------------------------------------

registerEntryKind<CreatureEntry>({
  kind: 'creature',
  palette: { tab: 'creatures', list: () => [] },
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
    if (life?.kind === 'biped') {
      const folk: Folk = worn.folk === 'city' ? 'city' : 'country';
      const person = entry.person ? personById(entry.person) : undefined;
      const traits = [...ctx.traits, ...(entry.traits ?? []), ...(person?.traits ?? [])];
      const name = entry.name ?? person?.name ?? traitName(traits);
      if (name) {
        const proxy = new THREE.Mesh(
          new THREE.CylinderGeometry(life.radius, life.radius, life.height, 8, 1, true),
        );
        proxy.name = 'npc-hover';
        proxy.visible = false;
        proxy.position.y = life.height / 2;
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

// --- run --------------------------------------------------------------------

interface RunShape {
  pitch: number;
  most: number;
  build(seed: number, run: number, sections: number): THREE.Mesh;
}

const RUNS: Record<string, RunShape> = {
  fence: {
    pitch: FENCE_SECTION,
    most: FENCE_MAX_SECTIONS,
    build: (seed, run, sections) => fence.build({ seed, run, sections }),
  },
  'stone-wall': {
    pitch: WALL_SECTION,
    most: WALL_MAX_SECTIONS,
    build: (seed, run, sections) => stoneWall.build({ seed, run, sections }),
  },
};

function runShape(name: string): RunShape {
  const shape = RUNS[name];
  if (!shape) throw new Error(`"${name}" is not something that runs along a line`);
  return shape;
}

registerEntryKind<RunEntry>({
  kind: 'run',
  schema: {
    builder: { type: 'choice', options: () => Object.keys(RUNS) },
    pitch: { type: 'number', min: 0.2, max: 8, step: 0.05, label: 'metres per section' },
    most: { type: 'int', min: 1, max: 12, label: 'sections per piece' },
    cap: { type: 'choice', options: ['post'], label: 'far end' },
  },
  defaults: () => ({ builder: 'fence', points: [[0, 0], [6, 0]] }),
  build(entry, ctx) {
    const shape = runShape(entry.builder);
    const group = new THREE.Group();
    const seed = seedOf(entry);
    const points = entry.points.map((point) => pointOf(point, ctx));
    let at = points[0];
    let yaw = 0;
    for (let i = 1; i < points.length; i++) {
      yaw = along(at, points[i]).yaw;
      at = layRun(
        group,
        {
          // One carpentry seed for the whole run, so two pieces meeting on a
          // post are the same fence rather than two butted together.
          build: (pieceSeed, sections) => shape.build(pieceSeed, seed, sections),
          pitch: entry.pitch ?? shape.pitch,
          most: entry.most ?? shape.most,
          seed: seed + i * 10,
          groundAt: ctx.groundAt,
        },
        at,
        points[i],
      );
    }
    // Rounding moves the far end, so a terminal post is placed where the run
    // actually finished rather than where it was aimed.
    if (entry.cap === 'post') {
      place(group, fencePost.build({ seed: seed + 9, run: seed }), at[0], at[1], yaw, ctx.groundAt);
    }
    return group;
  },
});

// --- chain ------------------------------------------------------------------

/** Metres between hedge shrubs. Tight enough that the line reads as one thing. */
const HEDGE_PITCH = 1.5;

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

registerEntryKind<ChainEntry>({
  kind: 'chain',
  schema: { close: { type: 'choice', options: ['hedge'], label: 'close the gap with' } },
  defaults: () => ({ start: [0, 0], edges: [{ to: [8, 0], kind: 'fence' }] }),
  build(entry, ctx) {
    const group = new THREE.Group();
    const seed = seedOf(entry);
    const runs: readonly ChainRun[] =
      entry.runs ?? [{ start: entry.start ?? [0, 0], edges: entry.edges ?? [] }];

    const ends: Point[] = [];
    const starts: Point[] = [];
    runs.forEach((run, index) => {
      const first = pointOf(run.start, ctx);
      starts.push(first);
      ends.push(layOneChain(group, run.seed ?? seed + index * 200, first, run.edges, ctx));
    });

    if (entry.close === 'hedge') {
      // One chain closes back on itself; several close end to end, which is
      // what a boundary laid outward from a gateway leaves.
      const from = ends[ends.length - 1];
      const to = runs.length > 1 ? ends[0] : starts[0];
      layHedge(group, entry.closeSeed ?? seed + 600, from, to, ctx);
    }

    return group;
  },
});

/** Lays one chain of runs, cornering between them, and returns where it stopped. */
function layOneChain(
  group: THREE.Object3D,
  seed: number,
  start: Point,
  edges: readonly { to: Anchor; kind: 'wall' | 'fence' }[],
  ctx: EntryContext,
): Point {
  let at = start;
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    const to = pointOf(edge.to, ctx);
    const run = along(at, to);
    const shape = runShape(edge.kind === 'wall' ? 'stone-wall' : 'fence');
    const runSeed = seed + i * 10;
    const end = layRun(
      group,
      {
        build: (pieceSeed, sections) => shape.build(pieceSeed, runSeed, sections),
        pitch: shape.pitch,
        most: shape.most,
        seed: runSeed,
        groundAt: ctx.groundAt,
      },
      at,
      to,
    );
    slab(group, at, end, ctx);

    const next = edges[i + 1];
    if (!next) return end;

    // A pier wherever stone is one of the two sides, a post where both are
    // timber. The pier stands `COLUMN_REACH` past the run that arrives and the
    // run that leaves starts the same distance the other side of it, so the
    // masonry butts against its faces instead of into its middle.
    if (edge.kind === 'wall' || next.kind === 'wall') {
      const centre: Point = [end[0] + run.ux * COLUMN_REACH, end[1] + run.uz * COLUMN_REACH];
      const stand = wallHeight(createRng(runSeed + 7)) + 0.3;
      place(
        group,
        stoneWallSquareColumn.build({ seed: runSeed + 7, height: stand }),
        centre[0],
        centre[1],
        run.yaw,
        ctx.groundAt,
      );
      const out = along(centre, pointOf(next.to, ctx));
      at = [centre[0] + out.ux * COLUMN_REACH, centre[1] + out.uz * COLUMN_REACH];
    } else {
      place(
        group,
        fencePost.build({ seed: runSeed + 7, run: runSeed }),
        end[0],
        end[1],
        run.yaw,
        ctx.groundAt,
      );
      at = end;
    }
  }
  return at;
}

/**
 * The closing stretch, and the only run that can be any length: the chains
 * finish where their rounding puts them and this divides the gap evenly.
 */
function layHedge(group: THREE.Object3D, seed: number, from: Point, to: Point, ctx: EntryContext): void {
  const { ux, uz, length, yaw } = along(from, to);
  const gaps = Math.max(1, Math.round(length / HEDGE_PITCH));
  place(group, fencePost.build({ seed, run: seed }), from[0], from[1], yaw, ctx.groundAt);
  place(group, fencePost.build({ seed: seed + 1, run: seed }), to[0], to[1], yaw, ctx.groundAt);
  for (let i = 0; i < gaps; i++) {
    const d = ((i + 0.5) / gaps) * length;
    place(
      group,
      hazel.build({ seed: seed + 10 + i }),
      from[0] + ux * d,
      from[1] + uz * d,
      i * 1.3,
      ctx.groundAt,
    );
  }
  slab(group, from, to, ctx);
}

// --- scatter ----------------------------------------------------------------

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
  // Every candidate is warmed, including the ones the ground will reject: the
  // accept, slope, height and avoid tests need a built context this does not
  // have, and building a rejected prop on a worker costs less than waiting for
  // an accepted one on the frame. `dropWarm` frees what is not claimed.
  asks(entry) {
    if (!builderByName(entry.builder)) return [];
    return scatterCandidates({
      seed: seedOf(entry),
      count: entry.count,
      within: entry.within,
      from: entry.from,
      scale: entry.scale,
    }).map((candidate) => ({
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
          if (region && !region.some((shape) => shapeDistance(shape, x, z) <= 0)) return false;
          if (ctx.outline) return insidePolygon(ctx.outline, x, z, inset);
          return true;
        },
      },
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

registerEntryKind<WaterEntry>({
  kind: 'water',
  schema: {
    width: { type: 'number', min: 0.5, max: 200, step: 0.1 },
    depth: { type: 'number', min: 0.5, max: 200, step: 0.1 },
    chop: { type: 'number', min: 0, max: 3, step: 0.01 },
    segment: { type: 'number', min: 0.2, max: 8, step: 0.1, label: 'metres per quad' },
  },
  defaults: () => ({ width: 8, depth: 8, chop: 0.4 }),
  build(entry, ctx) {
    const holder = new THREE.Object3D();
    applyPlacement(holder, entry, ctx);
    return waterPlane({
      width: entry.width,
      depth: entry.depth,
      at: holder.position.clone(),
      chop: entry.chop,
      flow: entry.flow ? new THREE.Vector2(entry.flow[0], entry.flow[1]) : undefined,
      segment: entry.segment,
    });
  },
});

// --- particles --------------------------------------------------------------

registerEntryKind<ParticlesEntry>({
  kind: 'particles',
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
  schema: { ref: { type: 'ref', label: 'anchored to' }, lift: { type: 'number', min: 0, max: 20, step: 0.05 } },
  defaults: () => ({ spec: { sound: { model: 'bird' }, at: [0, 1, 0], spread: 12, every: 30 } }),
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
  schema: { chunk: { type: 'number', min: 40, max: 800, step: 10, label: 'merge cell (m)' } },
  defaults: () => ({ band: { inner: 30, outer: 160 }, place: [], scatter: [] }),
  // `keepOut` is left off: it moves parallax props about after they are built
  // and has no say in which props there are.
  asks(entry, ctx) {
    if (!ctx.skirt) return [];
    return vistaRingPlan({ ...ringPlan(entry), skirt: ctx.skirt }).map((prop) => ({
      builder: prop.builder.name,
      seed: prop.seed,
      scale: prop.scale ?? 1,
    }));
  },
  build(entry, ctx) {
    if (!ctx.skirt) throw new Error('a vista ring needs a skirt');
    const keepOut =
      typeof entry.keepOut === 'string'
        ? ctx.regions[entry.keepOut]
        : entry.keepOut
          ? dilateOutline(ctx.skirt.outline, entry.keepOut.dilate)
          : undefined;
    return vistaRing({ ...ringPlan(entry), skirt: ctx.skirt, keepOut });
  },
});

/** Everything about a ring except where it stands, which the two callers differ on. */
function ringPlan(entry: VistaRingEntry): Omit<VistaRingOptions, 'skirt' | 'keepOut'> {
  return {
    seed: seedOf(entry),
    band: entry.band,
    place: (entry.place ?? []).map(namedVistaProp),
    scatter: (entry.scatter ?? []).map(namedVistaScatter),
    chunk: entry.chunk,
  };
}

function namedVistaProp(raw: Record<string, unknown>): VistaProp {
  const { builder, ...rest } = raw as { builder: string } & Record<string, unknown>;
  return { builder: needBuilder(builder), ...rest } as VistaProp;
}

function namedVistaScatter(raw: Record<string, unknown>): VistaScatter {
  const { builder, ...rest } = raw as { builder: string } & Record<string, unknown>;
  return { builder: needBuilder(builder), ...rest } as VistaScatter;
}

registerEntryKind<DressingEntry>({
  kind: 'dressing',
  schema: { solidWithin: { type: 'number', min: -200, max: 200, step: 1, label: 'solid inside (m)' } },
  defaults: () => ({ band: { inner: -4, outer: 14 }, kinds: [] }),
  asks(entry, ctx) {
    if (!ctx.terrain || !ctx.skirt) return [];
    return edgeDressingPlan(dressingOptions(entry, ctx.terrain, ctx.skirt)).map((at) => ({
      builder: at.builder.name,
      seed: at.seed,
      scale: at.scale,
    }));
  },
  build(entry, ctx) {
    if (!ctx.terrain || !ctx.skirt) throw new Error('edge dressing needs a terrain and a skirt');
    return edgeDressing(dressingOptions(entry, ctx.terrain, ctx.skirt));
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
