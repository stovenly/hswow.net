import * as THREE from 'three';
import { builderByName } from '../art/registry';
import { coerceFields } from '../art/schema';
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
import { vistaRing, type VistaProp, type VistaScatter } from './vista-ring';
import { edgeDressing, type DressingKind } from './dressing';
import { shapeDistance, type PatchShape } from './ground';
import { insidePolygon, layRun, place, scatterProps, along, type Point } from './placement';
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

const _box = new THREE.Box3();

function seedOf(entry: { seed?: number; id?: string }): number {
  if (entry.seed !== undefined) return entry.seed;
  // A document that never saved a seed still has to build the same thing twice.
  let hash = 2166136261;
  for (const char of entry.id ?? 'entry') {
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  }
  return (hash >>> 0) % 1_000_000;
}

/** The builder a name points at, or a thrown error naming the document's fault. */
function needBuilder(name: string): NonNullable<ReturnType<typeof builderByName>> {
  const builder = builderByName(name);
  if (!builder) throw new Error(`no builder named "${name}"`);
  return builder;
}

// --- prop -------------------------------------------------------------------

registerEntryKind<PropEntry>({
  kind: 'prop',
  palette: { tab: 'objects', list: () => [] },
  build(entry, ctx) {
    const builder = needBuilder(entry.builder);
    const extras = builder.options ? coerceFields(builder.options, entry.options) : {};
    const mesh = builder.build({ seed: seedOf(entry), scale: entry.scale, ...extras });
    applyPlacement(mesh, entry, ctx);

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
  build(entry, ctx) {
    const builder = needBuilder(entry.builder);
    const extras = builder.options ? coerceFields(builder.options, entry.options) : {};
    const mesh = builder.build({
      seed: seedOf(entry),
      scale: entry.scale,
      ...(entry.roam !== undefined ? { roam: entry.roam } : {}),
      ...(entry.folk !== undefined ? { folk: entry.folk } : {}),
      ...(entry.face !== undefined ? { face: entry.face } : {}),
      ...extras,
    } as never);
    applyPlacement(mesh, entry, ctx);
    // Creatures move: they are never in the octree, and `LifeActivity` picks
    // them up off `userData.life` and `userData.rig`.
    return mesh;
  },
});

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
  build(entry, ctx) {
    const shape = runShape(entry.builder);
    const group = new THREE.Group();
    const seed = seedOf(entry);
    let at = entry.points[0];
    for (let i = 1; i < entry.points.length; i++) {
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
        entry.points[i],
      );
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
  build(entry, ctx) {
    const group = new THREE.Group();
    const seed = seedOf(entry);
    let at: Point = entry.start;

    for (let i = 0; i < entry.edges.length; i++) {
      const edge = entry.edges[i];
      const run = along(at, edge.to);
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
        edge.to,
      );
      slab(group, at, end, ctx);

      const next = entry.edges[i + 1];
      if (!next) {
        at = end;
        break;
      }

      // A pier wherever stone is one of the two sides, a post where both are
      // timber. The pier stands `COLUMN_REACH` past the run that arrives and
      // the run that leaves starts the same distance the other side of it, so
      // the masonry butts against its faces instead of into its middle.
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
        const out = along(centre, next.to);
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

    if (entry.close === 'hedge') {
      const from = at;
      const to = entry.start;
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

    return group;
  },
});

// --- scatter ----------------------------------------------------------------

registerEntryKind<ScatterEntry>({
  kind: 'scatter',
  build(entry, ctx) {
    const builder = needBuilder(entry.builder);
    const group = new THREE.Group();
    const avoid =
      typeof entry.avoid === 'string' ? circlesOf(ctx.regions[entry.avoid] ?? []) : entry.avoid;
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
  build(entry, ctx) {
    const group = new THREE.Group();
    if (entry.from && entry.to) {
      slab(group, entry.from, entry.to, ctx, entry.height ?? BARRIER_HEIGHT);
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
  build(entry, ctx) {
    const spec = { ...entry.spec } as Record<string, unknown>;
    if (entry.ref) {
      const base = ctx.resolve(entry.ref);
      if (base) {
        _box.setFromObject(base, true);
        const lift = entry.lift ?? 0;
        spec.at = [base.position.x, (_box.isEmpty() ? base.position.y : _box.max.y) + lift, base.position.z];
      }
    } else if (entry.at) {
      const at = entry.at;
      spec.at =
        at.length >= 3 ? [at[0], at[1], at[2]] : [at[0], ctx.groundAt(at[0], at[1]) + 1, at[1]];
    }
    if (entry.id && spec.id === undefined) spec.id = entry.id;
    ctx.collected.emitters.push(spec as never);
    return null;
  },
});

registerEntryKind<SoundScatterEntry>({
  kind: 'soundScatter',
  build(entry, ctx) {
    ctx.collected.scatters.push(entry.spec);
    return null;
  },
});

// --- vista ------------------------------------------------------------------

registerEntryKind<VistaRingEntry>({
  kind: 'vistaRing',
  build(entry, ctx) {
    if (!ctx.skirt) throw new Error('a vista ring needs a skirt');
    const keepOut =
      typeof entry.keepOut === 'string'
        ? ctx.regions[entry.keepOut]
        : entry.keepOut
          ? dilate(ctx.skirt.outline, entry.keepOut.dilate)
          : undefined;
    return vistaRing({
      skirt: ctx.skirt,
      seed: seedOf(entry),
      band: entry.band,
      place: (entry.place ?? []).map(namedVistaProp),
      scatter: (entry.scatter ?? []).map(namedVistaScatter),
      keepOut,
      chunk: entry.chunk,
    });
  },
});

function namedVistaProp(raw: Record<string, unknown>): VistaProp {
  const { builder, ...rest } = raw as { builder: string } & Record<string, unknown>;
  return { builder: needBuilder(builder), ...rest } as VistaProp;
}

function namedVistaScatter(raw: Record<string, unknown>): VistaScatter {
  const { builder, ...rest } = raw as { builder: string } & Record<string, unknown>;
  return { builder: needBuilder(builder), ...rest } as VistaScatter;
}

/** The outline grown outward, for a keep-out nothing else states. */
function dilate(outline: readonly PatchShape[], by: number): readonly PatchShape[] {
  return outline.map((shape) => {
    if (shape.kind === 'blot') return { ...shape, radius: shape.radius + by };
    if (shape.kind === 'field') {
      return {
        ...shape,
        min: [shape.min[0] - by, shape.min[1] - by] as const,
        max: [shape.max[0] + by, shape.max[1] + by] as const,
      };
    }
    return { ...shape, width: shape.width + by * 2 };
  });
}

registerEntryKind<DressingEntry>({
  kind: 'dressing',
  build(entry, ctx) {
    if (!ctx.terrain || !ctx.skirt) throw new Error('edge dressing needs a terrain and a skirt');
    return edgeDressing({
      terrain: ctx.terrain,
      skirt: ctx.skirt,
      seed: seedOf(entry),
      band: entry.band,
      solidWithin: entry.solidWithin,
      kinds: entry.kinds.map((raw) => {
        const { builder, ...rest } = raw as { builder: string } & Record<string, unknown>;
        return { builder: needBuilder(builder), ...rest } as DressingKind;
      }),
    });
  },
});

/** Forces the registrations above to run. Imported for effect, called for clarity. */
export function registerBuiltInKinds(): void {}

export { seedOf, needBuilder, yawOf, tagEntry, type Entry };
