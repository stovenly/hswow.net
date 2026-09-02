/**
 * Every kind of work the pool can be asked for, in one table.
 *
 * A kind has two halves. `inWorker` is pure — a function of its payload and
 * nothing else — and returns buffers to be moved rather than copied. `onMain`
 * turns those buffers into whatever the engine wanted, and is the only half
 * allowed to touch three, the renderer or the DOM. A kind that reads ambient
 * state would break silently off the main thread and is forbidden.
 */

import { capture, type Finished } from '../../art/assemble';
import type { Rig } from '../../art/rig';
import { indexBuilders, loadBuilder } from '../../art/registry-lazy';
import { fromWire, toWire, type GeometryWire } from './geometry';
import { movable } from './shared';
import { planOctree, type OctreePlan } from '../../player/octreePlan';
import { fillNoiseTables, fillRoomNoise, type NoiseTables, type RoomNoiseAsk } from '../../audio/noise-tables';
import { terrainFromWire, type TerrainWire } from '../../world/terrain';
import { Skirt, type SkirtOptions } from '../../world/vista';
import { raiseWorld, raisedBuffers, type WorldAsk, type WorldRaised } from '../../ui/map/raise';
import {
  buffersOf,
  meshFor,
  packSample,
  sampleCover,
  type CoverChunks,
  type CoverRequest,
} from '../../art/cover-sample';

export interface Made<Wire> {
  result: Wire;
  transfer?: Transferable[];
}

export interface Job<Payload, Wire, Value> {
  inWorker(payload: Payload): Made<Wire> | Promise<Made<Wire>>;
  onMain(wire: Wire): Value;
}

/** What every worker is told before its first job, and the inline path too. */
export interface Prime {
  builders: Record<string, string>;
}

export function primeJobs(prime: Prime): void {
  indexBuilders(prime.builders);
}

const job = <P, W, V>(spec: Job<P, W, V>): Job<P, W, V> => spec;

/** One prop, by the arguments its builder is called with. */
export interface PropAsk {
  builder: string;
  seed: number;
  scale?: number;
  extras?: Record<string, unknown>;
}

interface PropWire {
  geometry: GeometryWire;
  name: string;
  phase: number;
  underfoot?: string;
  /** A creature's bones, so the skeleton can be built on the main thread. */
  rig?: Rig;
  scale?: number;
  userData?: Record<string, unknown>;
}

export interface PlanWire extends OctreePlan {
  positions: Float32Array;
}

export interface SkirtAsk {
  skirt: Omit<SkirtOptions, 'terrain'>;
  terrain: TerrainWire;
}

/** What `capture` took, as buffers to move. */
function made(taken: Finished | null): Made<PropWire | null> {
  if (!taken) return { result: null };
  const { wire, transfer } = toWire(taken.geometry);
  return {
    result: {
      geometry: wire,
      name: taken.name,
      phase: taken.phase,
      underfoot: taken.underfoot,
      rig: taken.rig,
      scale: taken.scale,
      userData: taken.userData,
    },
    transfer,
  };
}

function unwire(wire: PropWire | null): Finished | null {
  return wire === null
    ? null
    : {
        geometry: fromWire(wire.geometry),
        name: wire.name,
        phase: wire.phase,
        underfoot: wire.underfoot as Finished['underfoot'],
        rig: wire.rig,
        scale: wire.scale,
        userData: wire.userData,
      };
}

export const JOBS = {
  /**
   * One prop's geometry, or one creature's. Null when the builder is not a pure
   * walk to a single `finish` or `finishRigged` — it hung lights or children on
   * its mesh — and the caller must build it on the main thread as before.
   */
  'prop-geometry': job<PropAsk, PropWire | null, Finished | null>({
    inWorker: async (ask) => {
      const builder = await loadBuilder(ask.builder);
      if (!builder) return { result: null };
      return made(capture(() => builder.build({ seed: ask.seed, scale: ask.scale, ...ask.extras })));
    },
    onMain: unwire,
  }),

  /** A zone's ground mesh, built from the same options the walk would use. */
  'terrain-mesh': job<TerrainWire, PropWire | null, Finished | null>({
    inWorker: (wire) => made(capture(() => terrainFromWire(wire).build())),
    onMain: unwire,
  }),

  /** And the skirt under it, which stands on the same terrain. */
  'skirt-mesh': job<SkirtAsk, PropWire | null, Finished | null>({
    inWorker: ({ skirt, terrain }) =>
      made(capture(() => new Skirt({ ...skirt, terrain: terrainFromWire(terrain) }).build())),
    onMain: unwire,
  }),

  /** The world map's continent, paint, marks and rivers, off the graph. Once per content load. */
  'world-chart': job<WorldAsk, WorldRaised, WorldRaised>({
    inWorker: (ask) => {
      const raised = raiseWorld(ask);
      return { result: raised, transfer: movable(raisedBuffers(raised)) };
    },
    onMain: (raised) => raised,
  }),

  /** A zone's collision tree: boxes and which triangles fall in them. The corners come back with it. */
  'collision-index': job<{ positions: Float32Array }, PlanWire, PlanWire>({
    inWorker: ({ positions }) => {
      const plan = planOctree(positions);
      return {
        result: { ...plan, positions },
        transfer: [
          plan.boxes.buffer,
          plan.firstChild.buffer,
          plan.childCount.buffer,
          plan.triStart.buffer,
          plan.triCount.buffer,
          plan.triIndices.buffer,
          positions.buffer,
        ],
      };
    },
    onMain: (plan) => plan,
  }),

  /**
   * One ground mesh's groundcover instances. Not geometry and not a builder:
   * the second tenant, on the same pool, with no change to the pool.
   */
  /** The looped noise beds, as samples. The engine wraps them in `AudioBuffer`s. */
  'noise-tables': job<{ sampleRate: number }, NoiseTables, NoiseTables>({
    inWorker: ({ sampleRate }) => {
      const tables = fillNoiseTables(sampleRate);
      return { result: tables, transfer: [tables.white.buffer, tables.pink.buffer, tables.brown.buffer] };
    },
    onMain: (tables) => tables,
  }),

  /** The fallback room impulse's excitation, two channels of decaying noise. */
  'room-noise': job<RoomNoiseAsk, Float32Array<ArrayBuffer>[], Float32Array<ArrayBuffer>[]>({
    inWorker: (ask) => {
      const channels = fillRoomNoise(ask);
      return { result: channels, transfer: channels.map((data) => data.buffer) };
    },
    onMain: (channels) => channels,
  }),

  'cover-sample': job<CoverRequest, CoverChunks | null, CoverChunks | null>({
    inWorker: (request) => {
      const sample = sampleCover(meshFor(request), request.cover);
      const chunks =
        sample && (sample.bladeCount > 0 || sample.propCount > 0) ? packSample(sample) : null;
      return { result: chunks, transfer: chunks ? buffersOf(chunks) : [] };
    },
    onMain: (chunks) => chunks,
  }),
};

export type JobName = keyof typeof JOBS;
export type JobPayload<K extends JobName> =
  (typeof JOBS)[K] extends Job<infer P, unknown, unknown> ? P : never;
export type JobWire<K extends JobName> =
  (typeof JOBS)[K] extends Job<never, infer W, unknown> ? W : never;
export type JobValue<K extends JobName> =
  (typeof JOBS)[K] extends Job<never, unknown, infer V> ? V : never;
