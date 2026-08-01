import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import type { Part } from '../assemble';
import { buildQuadruped, type HeadContext, type Species } from '../quadruped';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * A dog: short, low, and all head and tail.
 *
 * The one animal in the kit whose sound existed before its body did. The animal
 * call table has had a dog in it since the scatter fields landed, and until now
 * the barking in Arkstin came from a patch of empty lane.
 *
 * Proportion does the identifying, as it does for the rest of the quadrupeds,
 * but a dog needs the numbers pushed much further than the livestock do — and
 * the first attempt did not push them far enough. It came out reading as a
 * calf, which is the specific failure to design against: at this scale the risk
 * was never that it looked like a wolf, it was that it looked like a small cow.
 *
 * Four things separate the two, in the order the eye reads them:
 *
 * 1. **No markings.** Big two-tone patches are a Holstein. Pattern is read
 *    before proportion, so a patched short quadruped is a calf whatever its
 *    dimensions say.
 * 2. **Ground clearance.** Legs long against a shallow girth. A calf's belly
 *    nearly touches the grass; a dog stands clear of it.
 * 3. **Head carriage.** A long neck rising steeply. Grazers carry the head
 *    forward and down because that is where the food is.
 * 4. **The head is built here, not by the shared plan.** This was the one that
 *    actually mattered, and the first two attempts both missed it by only
 *    moving numbers. Every other animal in the kit has the same head — a blob
 *    with a cone stuck on the front — and that is a fair description of a cow,
 *    a pig, a sheep and a horse, all of which are essentially a muzzle
 *    continuing the line of the skull. A dog has a **stop**: a step down and
 *    in where the forehead ends and the muzzle begins, with a squarer braincase
 *    behind it and a jaw hanging below. No amount of stretching a blob
 *    produces that break, so `canineHead` builds one.
 */

/**
 * A dog's head: braincase, stop, muzzle, jaw, and pricked ears.
 *
 * Built from boxes and a square frustum rather than the icosahedra the
 * livestock use, and deliberately — a faceted, angular head next to five
 * rounded ones is doing half the work of telling them apart before any
 * proportion is considered.
 *
 * The **stop** is the whole design. Everything else here is ordinary: a box for
 * the skull, a taper for the muzzle, a slab for the jaw. What makes it a dog is
 * that the muzzle starts *lower and narrower* than the skull it comes out of,
 * so there is a visible step between them. Livestock have no step; their faces
 * run straight on from the forehead, which is why every attempt to make a dog
 * out of the shared head produced a calf.
 */
function canineHead({ at, size, coat, extremity, rng }: HeadContext): Part[] {
  const parts: Part[] = [];

  // --- braincase -----------------------------------------------------------
  //
  // Wider than tall and slightly wedge-shaped, tapering toward the muzzle.
  // Four radial segments gives a squared-off box that still narrows, which a
  // `BoxGeometry` cannot do.
  const skullW = size * 1.45;
  const skull = new THREE.CylinderGeometry(size * 0.62, size * 0.78, size * 1.5, 4);
  skull.rotateX(Math.PI / 2);
  // Four-sided cylinders come up corner-first; an eighth turn squares them.
  skull.rotateZ(Math.PI / 4);
  skull.scale(skullW / (size * 1.1), size * 1.15 / (size * 1.1), 1);
  skull.translate(at.x, at.y, at.z - size * 0.15);
  parts.push({ geometry: skull, color: coat, sway: 0 });

  // --- the stop ------------------------------------------------------------
  //
  // The muzzle root: set down from the middle of the skull and well inside its
  // width, so the break between the two is a real silhouette and not a colour
  // change. The offsets are the entire trick.
  // A wide range, for the same reason the legs have one: a muzzle is the other
  // thing that varies enormously between dogs and not at all between cattle.
  // The short end is a squat, blunt face and it has to actually get there —
  // a range that bottoms out at "slightly shorter" produces eight of the same
  // dog.
  const muzzleLength = size * rng.range(0.45, 1.05);
  const muzzleY = at.y - size * 0.34;
  const muzzleZ = at.z + size * 0.6;

  const muzzle = new THREE.CylinderGeometry(size * 0.3, size * 0.46, muzzleLength, 4);
  muzzle.rotateX(Math.PI / 2);
  muzzle.rotateZ(Math.PI / 4);
  // Flattened top to bottom. A muzzle of square section is a beak.
  muzzle.scale(1, 0.78, 1);
  muzzle.translate(at.x, muzzleY, muzzleZ + muzzleLength / 2);
  parts.push({ geometry: muzzle, color: coat, sway: 0 });

  // The jaw, hanging under it and stopping short of the nose — an underhung
  // jaw is a bulldog and a flush one is a duck.
  const jaw = new THREE.BoxGeometry(size * 0.52, size * 0.26, muzzleLength * 0.8);
  jaw.translate(at.x, muzzleY - size * 0.28, muzzleZ + muzzleLength * 0.44);
  parts.push({ geometry: jaw, color: extremity, sway: 0 });

  // The nose: a small dark block on the end, sitting a little proud and a
  // little high. The one part of a dog's face anyone would name.
  const nose = new THREE.BoxGeometry(size * 0.36, size * 0.3, size * 0.22);
  nose.translate(at.x, muzzleY + size * 0.08, muzzleZ + muzzleLength + size * 0.05);
  parts.push({ geometry: nose, color: 0x241f1c, sway: 0 });

  // A brow ridge across the stop. Small, and it is what casts the shadow that
  // makes the step legible from the side.
  const brow = new THREE.BoxGeometry(skullW * 0.82, size * 0.2, size * 0.28);
  brow.translate(at.x, at.y + size * 0.22, muzzleZ - size * 0.08);
  parts.push({ geometry: brow, color: coat, sway: 0 });

  // --- ears ----------------------------------------------------------------
  //
  // Pricked, triangular, and flattened into blades rather than left as cones —
  // a dog's ear is a flap, and a solid cone reads as a horn. Set wide on the
  // back of the skull and canted outward, which is where they sit and is also
  // what keeps them clear of the braincase silhouette.
  const prick = rng.range(0.75, 1.05);
  for (const side of [-1, 1]) {
    const ear = new THREE.ConeGeometry(size * 0.34, size * prick, 3);
    ear.translate(0, (size * prick) / 2, 0);
    ear.scale(1, 1, 0.34);
    ear.rotateZ(side * rng.range(0.16, 0.34));
    ear.rotateX(-rng.range(0.05, 0.22));
    ear.translate(at.x + side * skullW * 0.34, at.y + size * 0.4, at.z - size * 0.35);
    parts.push({ geometry: ear, color: extremity, sway: 0 });
  }

  return parts;
}
const CANINE: Species = {
  // Short body. The first version was 0.62–0.85 against a 0.24–0.31 girth,
  // which is a *cow's* ratio at a quarter scale — and a cow at a quarter scale
  // is a calf, which is exactly what it read as.
  length: [0.5, 0.68],
  // Slim. A dog is deep through the chest and narrow across it; livestock are
  // barrels. Girth carries most of that difference on its own.
  girth: [0.19, 0.24],
  // **A wide range, and the widest thing in the table.** Every other species
  // here is one animal with a tolerance on it; a dog is not one animal. The
  // spread from a terrier to a lurcher is most of what "dog" means, and a rank
  // of eight identically-proportioned ones reads as a product line. The bottom
  // of this range is genuinely short-legged — that end is the point, not a
  // margin of error.
  legLength: [0.19, 0.38],
  legThickness: 0.026,
  feet: 'paw',
  // Longer neck, carried high. A grazing animal's neck runs forward and down
  // because its head lives at the grass; a dog's runs up. Of everything here
  // this is the cheapest change and the most identifying.
  neck: [0.15, 0.21],
  neckRise: [0.6, 1],
  // The scale the bespoke head is measured against, not a blob radius.
  headSize: [0.1, 0.13],
  // Unused: `head` replaces the shared blob-and-snout, ears included. Left at
  // neutral values rather than removed, because they are required fields and a
  // future variant that wants the shared head should not have to invent them.
  headStretch: 1,
  snout: 0,
  ears: 'none',
  head: canineHead,
  horns: 'none',
  tail: 'carried',
  woolly: false,
  hide: [PALETTE.HIDE, PALETTE.HIDE_DARK, PALETTE.HIDE_PALE, PALETTE.STONE_DARK],
  extremity: PALETTE.HIDE_DARK,
  // **No patches, and this was the loudest of the tells.** Large irregular
  // two-tone markings on a quadruped are a Holstein, and the eye reads the
  // pattern before it reads the proportions — so a patched short animal was a
  // calf no matter what the numbers underneath it said. A plain coat with dark
  // legs, ears and muzzle is both commoner in dogs and unambiguous.
};

export const dog: MeshBuilder = {
  name: 'dog',
  category: 'animals',
  radius: 0.55,
  build: (options = {}) =>
    buildQuadruped('dog', CANINE, createRng(options.seed ?? 1), options),
};
