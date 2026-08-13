import * as THREE from 'three';
import { buffersOf, packSample, sampleCover, type CoverChunks } from './cover-sample';
import type { CoverName } from '../world/ground';

/**
 * Groundcover sampling, off the main thread.
 *
 * The sampler is the longest purely arithmetic step in building a zone and it
 * depends on nothing but a mesh's attributes and a seed, so the main thread has
 * no reason to be blocked by it: the fade or the loading bar animates while this
 * runs, instead of freezing for the length of a field.
 *
 * Nothing here touches a GL object. The geometry rebuilt below exists only so
 * `sampleCover` can read attributes the way it does on the other side; it is
 * never rendered, never uploaded, and dies with the message.
 */

/** A ground mesh, flattened for the crossing. See `coverFor`. */
export interface CoverRequest {
  id: number;
  /** `userData.cover`, or the type passed at the call site. */
  cover?: CoverName;
  /** `matrixWorld`, in three's column-major order. */
  matrix: number[];
  attributes: Record<string, { data: Float32Array; size: number }>;
  index: Uint32Array | null;
}

export interface CoverReply {
  id: number;
  chunks: CoverChunks | null;
}

/** Rebuilds enough of a mesh for the sampler to read. */
function meshFrom(request: CoverRequest): THREE.Mesh {
  const geometry = new THREE.BufferGeometry();
  for (const [name, { data, size }] of Object.entries(request.attributes)) {
    geometry.setAttribute(name, new THREE.BufferAttribute(data, size));
  }
  if (request.index) geometry.setIndex(new THREE.BufferAttribute(request.index, 1));

  const mesh = new THREE.Mesh(geometry);
  // The world matrix arrives resolved, and `sampleCover` recomputes it from the
  // mesh's own transform — so it is decomposed back into one here rather than
  // assigned, or the recompute would throw it away and sample object space.
  mesh.matrix.fromArray(request.matrix);
  mesh.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
  if (request.cover) mesh.userData.cover = request.cover;
  return mesh;
}

/**
 * The worker's own global, stated rather than inherited.
 *
 * The project compiles against the DOM lib, where `self` is a `Window` and
 * `postMessage` takes an origin. Adding the WebWorker lib to reach the real
 * type would put `onmessage` and a second `postMessage` on every file in the
 * game; two lines of shape here are cheaper and are only wrong in this file if
 * this file stops being a worker.
 */
const scope = self as unknown as {
  onmessage: ((event: MessageEvent<CoverRequest>) => void) | null;
  postMessage: (message: CoverReply, transfer: ArrayBufferLike[]) => void;
};

scope.onmessage = (event: MessageEvent<CoverRequest>): void => {
  const request = event.data;
  const mesh = meshFrom(request);
  const sample = sampleCover(mesh, request.cover);
  const chunks =
    sample && (sample.bladeCount > 0 || sample.propCount > 0) ? packSample(sample) : null;
  const reply: CoverReply = { id: request.id, chunks };
  // Transferred, not copied: a populated exterior is tens of megabytes of
  // instance data and copying it back would spend most of what the move saved.
  scope.postMessage(reply, chunks ? buffersOf(chunks) : []);
};
