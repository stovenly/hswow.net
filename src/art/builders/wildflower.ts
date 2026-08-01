import * as THREE from 'three';
import type { Part } from '../assemble';
import { species, type HeadContext } from '../flower';

/**
 * Wildflowers: whatever is in the field, at whatever height.
 *
 * Not a species — a *mixture*, and that is the whole idea. Every other flower
 * in the kit is internally consistent, which is right for a stand of one thing
 * and wrong for rough ground, where the point is that nothing matches.
 *
 * ## The mixture has to be inside the patch
 *
 * Two attempts got this wrong in the same direction, each less badly than the
 * last. The first varied only the *colour*, so a patch was a dozen identical
 * daisies in assorted tints — and the eye reads outline long before it reads
 * hue, so that reads as one plant somebody has been dyeing. The second varied
 * the whole shape but rolled it **once per clump**, so each patch was a dozen
 * identical buttercups, or a dozen identical campions. Better between patches,
 * and no better within one.
 *
 * A meadow is not a patch of one thing next to a patch of another. It is
 * buttercup and speedwell and campion *interleaved*, and the only version of
 * this builder worth having puts them in the same clump. So the form is rolled
 * **per flower**: this is the one builder in the kit where two blooms on the
 * same square foot of ground are different plants.
 *
 * That breaks the shared plan's assumption — one head shape per species — which
 * is exactly what the head hook exists for.
 *
 * The one builder to reach for when dressing ground rather than making a
 * feature of a flower.
 */

interface Form {
  petals: number;
  /** Petal length as a multiple of the head radius. */
  reach: number;
  /** Petal width as a fraction of its length. */
  width: number;
  /** How far the petals tip up out of the plane, in radians. */
  cup: [number, number];
  /** Head radius, in metres. */
  size: [number, number];
  petal: readonly number[];
  centre: number;
  /** How often the head hangs over rather than facing up. */
  nod: number;
}

/**
 * The forms.
 *
 * Loosely a buttercup, an ox-eye, a scabious, a campion, a speedwell and
 * something long-petalled and drooping. None is named, and deliberately — the
 * moment one is called a buttercup it has to *be* a buttercup, and this
 * builder's whole job is to be what you scatter when you have not decided.
 */
const FORMS: readonly Form[] = [
  {
    // Broad, cupped, few petals.
    petals: 5,
    reach: 2.1,
    width: 0.62,
    cup: [0.5, 0.95],
    size: [0.026, 0.042],
    petal: [0xe8c848, 0xdcb832, 0xe4d24a],
    centre: 0xa88a2c,
    nod: 0.1,
  },
  {
    // Many narrow petals, nearly flat.
    petals: 14,
    reach: 2.3,
    width: 0.18,
    cup: [0.05, 0.3],
    size: [0.028, 0.046],
    petal: [0xf0ece0, 0xe8e4d4, 0xf4e8b8],
    centre: 0xd8b840,
    nod: 0.1,
  },
  {
    // A tight pincushion: short petals crowded round a big centre.
    petals: 12,
    reach: 1.15,
    width: 0.42,
    cup: [0.35, 0.8],
    size: [0.03, 0.05],
    petal: [0xb0a4d0, 0x9c8cc0, 0xc4b4dc],
    centre: 0x6f5f96,
    nod: 0.15,
  },
  {
    // Five wide petals and a pale eye.
    petals: 5,
    reach: 1.7,
    width: 0.5,
    cup: [0.15, 0.45],
    size: [0.024, 0.04],
    petal: [0xd86a94, 0xc85482, 0xe08aa8],
    centre: 0xf0e0d0,
    nod: 0.12,
  },
  {
    // Small, wide open, four petals.
    petals: 4,
    reach: 2.4,
    width: 0.55,
    cup: [0, 0.2],
    size: [0.016, 0.028],
    petal: [0x7f9fd8, 0x6b8cc8, 0x9ab4e0],
    centre: 0xf0f0e0,
    nod: 0.05,
  },
  {
    // Long-petalled and drooping.
    petals: 8,
    reach: 2.6,
    width: 0.24,
    cup: [0.6, 1.1],
    size: [0.022, 0.036],
    petal: [0xe0906a, 0xd47c58, 0xe8a880],
    centre: 0x8c4a2c,
    nod: 0.6,
  },
];

/**
 * One head, of whichever form this particular flower turned out to be.
 *
 * Deliberately the same construction the shared plan uses for a single-species
 * flower — a disc and a ring of flattened cones — because the point here is not
 * a different *kind* of head, it is that the numbers change from bloom to
 * bloom instead of from patch to patch.
 */
function wildflowerHead({ axis, rng }: HeadContext): Part[] {
  const parts: Part[] = [];
  const form = FORMS[rng.int(0, FORMS.length - 1)];
  const at = axis(1);

  const head = rng.range(form.size[0], form.size[1]);
  const petalColor = rng.pick(form.petal);

  // A heavy head hangs. Applied as a tilt of the whole flower about the top of
  // the stem, so the disc and the petals go over together.
  const nod = rng.chance(form.nod) ? rng.range(0.5, 1.1) : rng.range(0, 0.18);
  const nodAt = rng.range(0, Math.PI * 2);
  const place = (geometry: THREE.BufferGeometry): void => {
    geometry.rotateX(Math.cos(nodAt) * nod);
    geometry.rotateZ(Math.sin(nodAt) * nod);
    geometry.translate(at.x, at.y, at.z);
  };

  const disc = new THREE.CylinderGeometry(head, head * 0.9, head * 0.5, 8);
  place(disc);
  parts.push({ geometry: disc, color: form.centre, sway: 1 });

  const petalLength = head * form.reach;
  for (let p = 0; p < form.petals; p++) {
    const bearing = (p / form.petals) * Math.PI * 2 + rng.range(-0.12, 0.12);
    // Every petal a slightly different size. Partly because real ones are, and
    // partly for a mechanical reason: petals built to identical dimensions and
    // merged into one clump occasionally land exactly on top of each other, and
    // two coincident faces z-fight against each other forever.
    const grown = petalLength * rng.range(0.88, 1.12);
    const petal = new THREE.ConeGeometry(grown * form.width * rng.range(0.9, 1.1), grown, 3);
    // Built pointing +Y and laid over to point outward, so the wide end is at
    // the disc and the tip at the rim — which is the way round a petal tapers.
    petal.translate(0, grown / 2, 0);
    petal.scale(1, 1, 0.28);
    petal.rotateX(Math.PI / 2 - rng.range(form.cup[0], form.cup[1]));
    petal.rotateY(bearing);
    petal.translate(0, head * 0.12, 0);
    place(petal);
    parts.push({ geometry: petal, color: petalColor, sway: 1 });
  }

  return parts;
}

export const wildflower = species(
  'wildflower',
  {
    // A wide height range, because the forms genuinely are different plants —
    // a speedwell at ankle height and a campion at the knee in the same square
    // foot is what rough ground looks like.
    height: [0.14, 0.62],
    stemThickness: 0.0085,
    headSize: [0, 0],
    petals: 0,
    reach: 0,
    petalWidth: 0,
    cup: [0, 0],
    petal: [0xd8d0e4],
    centre: 0xd8c060,
    count: [14, 26],
    spread: 0.6,
    leaves: 1,
    nod: 0,
    head: wildflowerHead,
  },
  0.75,
);
