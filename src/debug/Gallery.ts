import * as THREE from 'three';
import { builders } from '../art/registry';
import { markCollidable } from '../player/Collider';

/**
 * One row per builder, several seeds each.
 *
 * The gallery is how the art kit is judged. Seeing four instances of the same
 * builder side by side is the only way to tell whether its randomness is doing
 * anything — a builder can look fine in isolation and turn out to produce the
 * same object every time, or to produce four things that share no family
 * resemblance at all. Both are faults, and neither is visible from one copy.
 *
 * Populated from the registry, so a new file in `art/builders/` appears here
 * without this file being touched.
 */

/**
 * Seeds per builder.
 *
 * Eight rather than four. Four is enough to prove a builder varies at all;
 * it is not enough to see *how* it varies — whether the spread is even or
 * clusters around one shape, and whether a rare variant (a lopsided figure,
 * a post with a collar) actually shows up at the rate it was meant to. Rare
 * things are invisible in small samples, which is exactly when a wrong
 * probability goes unnoticed.
 */
const INSTANCES = 8;
/** Gap between instances of the same builder, beyond their own radius. */
const PADDING = 1.4;

export interface GalleryOptions {
  /** Where the row starts, and which way it runs. */
  origin?: THREE.Vector3;
  /** Distance between rows of the same builder, along -Z. */
  depth?: number;
}

export function createGallery(options: GalleryOptions = {}): THREE.Group {
  // Well south of the movement gym, which reaches z ≈ 20. Two fixtures that
  // crowd each other get tested together whether or not that was intended.
  const origin = options.origin ?? new THREE.Vector3(-24, 0, 56);
  const depth = options.depth ?? 4;

  const gallery = new THREE.Group();
  gallery.name = 'Gallery';

  // Laid out by accumulating radii rather than on a fixed grid, so a hut and a
  // tuft of grass each get the room they need and no more.
  let x = origin.x;

  for (let index = 0; index < builders.length; index++) {
    const builder = builders[index];
    // The gap to the *next* row has to clear both radii. Spacing from only the
    // current builder's radius leaves a three-metre hut standing on top of the
    // grass beside it — which is exactly what it did.
    const next = builders[index + 1];
    const spacing = next ? builder.radius + next.radius + PADDING : 0;
    const row = new THREE.Group();
    row.name = `gallery:${builder.name}`;

    // A plinth marking where the row starts, so the rows can be told apart
    // without labels — there are no fonts in this project.
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.12, 0.5),
      new THREE.MeshLambertMaterial({ color: 0x2e3640, flatShading: true }),
    );
    plinth.position.set(x, 0.06, origin.z + depth);
    row.add(plinth);

    for (let i = 0; i < INSTANCES; i++) {
      // Seeds spaced widely: adjacent integers through a good hash are as
      // unrelated as distant ones, but wide spacing makes that obvious to
      // anyone reading the numbers.
      const mesh = builder.build({ seed: 1000 + i * 7919 });
      mesh.position.set(x, 0, origin.z - i * depth);
      // Per builder, not per gallery: grass and the like are meant to be
      // walked through, and marking the whole group solid would override that.
      row.add(builder.solid === false ? mesh : markCollidable(mesh));
    }

    gallery.add(row);
    x += spacing;
  }

  gallery.position.y = origin.y;
  // The plinths, and nothing else — each instance decided for itself above.
  return gallery;
}

/** Names in layout order, for the debug readout. */
export function galleryOrder(): string {
  return builders.map((builder) => builder.name).join(' · ');
}
