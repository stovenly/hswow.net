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
import { builderByName } from '../../art/registry';
import { fromWire, toWire, type GeometryWire } from './geometry';
import { planOctree, type OctreePlan } from '../../player/octreePlan';
import {
  buffersOf,
  meshFor,
  packSample,
  sampleCover,
  type CoverChunks,
  type CoverRequest,
} from '../../art/cover-sample';

export interface Job<Payload, Wire, Value> {
  inWorker(payload: Payload): { result: Wire; transfer?: Transferable[] };
  onMain(wire: Wire): Value;
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
}

export const JOBS = {
  /**
   * One prop's geometry. Null when the builder is not a pure walk to a single
   * `finish` — it hung lights or children on its mesh — and the caller must
   * build it on the main thread as before.
   */
  'prop-geometry': job<PropAsk, PropWire | null, Finished | null>({
    inWorker: (ask) => {
      const builder = builderByName(ask.builder);
      if (!builder) return { result: null };
      const taken = capture(() =>
        builder.build({ seed: ask.seed, scale: ask.scale, ...ask.extras }),
      );
      if (!taken) return { result: null };
      const { wire, transfer } = toWire(taken.geometry);
      return {
        result: { geometry: wire, name: taken.name, phase: taken.phase, underfoot: taken.underfoot },
        transfer,
      };
    },
    onMain: (wire) =>
      wire === null
        ? null
        : {
            geometry: fromWire(wire.geometry),
            name: wire.name,
            phase: wire.phase,
            underfoot: wire.underfoot as Finished['underfoot'],
          },
  }),

  /** A zone's collision tree: boxes and which triangles fall in them. */
  'collision-index': job<{ positions: Float32Array }, OctreePlan, OctreePlan>({
    inWorker: ({ positions }) => {
      const plan = planOctree(positions);
      return {
        result: plan,
        transfer: [
          plan.boxes.buffer,
          plan.firstChild.buffer,
          plan.childCount.buffer,
          plan.triStart.buffer,
          plan.triCount.buffer,
          plan.triIndices.buffer,
        ],
      };
    },
    onMain: (plan) => plan,
  }),

  /**
   * One ground mesh's groundcover instances. Not geometry and not a builder:
   * the second tenant, on the same pool, with no change to the pool.
   */
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
