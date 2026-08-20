import * as THREE from 'three';
import type { BuildOptions, MeshBuilder } from './types';
import { assemble, finish, type Part } from './assemble';
import { createRng, type Rng } from './random';
import { PALETTE } from './palette';

/**
 * One flower plan, several species: a stem, a disc and petals around it, at
 * proportions that are nearly all of what tells a daisy from a sunflower from a
 * poppy at more than a metre.
 *
 * The clump is the unit, not the bloom. Every builder here returns a spread, and
 * the count, the spacing and the leans are what make a daisy lawn look like a
 * daisy lawn. Every stem carries a flower: a bud at this scale is a green lump
 * on a stick. Petals are flat cones, the same trick `grass` uses for blades.
 *
 * Not in `builders/`, so the registry does not pick it up as a builder in its own
 * right — only the species that use it are, one file each.
 */

export interface Species {
  /** Stem height range, in metres. The most species-defining number here. */
  height: [number, number];
  stemThickness: number;
  /** Radius of the flower head. Ignored when `head` is supplied. */
  headSize: [number, number];
  petals: number;
  /** How far a petal reaches, as a multiple of the head radius. */
  reach: number;
  /** Petal width as a multiple of its length. Low is a daisy, high is a poppy. */
  petalWidth: number;
  /** How far the petals tip up out of the plane, in radians. */
  cup: [number, number];
  petal: readonly number[];
  centre: number;
  /** How many stand together, and how far apart. */
  count: [number, number];
  spread: number;
  /** Pairs of leaves up the stem. */
  leaves: number;
  /** Heads that hang rather than face up — a sunflower's whole posture. */
  nod: number;
  /**
   * Builds the flowering part, replacing the disc-and-petals entirely. Four of
   * the eight species are not a face on a stick — a foxglove is a column of
   * bells hung down one side of a spire, cow parsley a flat table on forked rays
   * — and those are architectures rather than proportions. A species that brings
   * one still gets the stem, the clump, the lean and the sway weighting.
   *
   * When present, `petals`, `reach`, `petalWidth`, `cup`, `petal`, `centre`,
   * `nod` and `facing` are not consulted.
   */
  head?: (context: HeadContext) => Part[];
  /**
   * How far a head may point away from the clump's own bearing, in radians. Omit
   * for a patch where every flower faces wherever it likes. Small for the
   * heliotropes: a field of sunflowers all lean the same way, having spent the
   * morning following the same sun. Not zero, though — a perfectly aligned rank
   * is a printed pattern.
   */
  facing?: number;
}

/**
 * What a bespoke flowering head needs to know about the stem it grows on. `axis`
 * is the important one: a stem is built vertical and then leaned, so any point on
 * it has to come out of the same transform the geometry got.
 */
export interface HeadContext {
  /** A point on the stem, `t` from 0 at the root to 1 at the tip. */
  axis: (t: number) => THREE.Vector3;
  /** Stem height, so a head can size itself against it. */
  height: number;
  rng: Rng;
}

const STEM = 0x4a6034;
const STEM_PALE = 0x5d7440;
const LEAF = PALETTE.LEAF;

/**
 * Builds one clump.
 *
 * Every flower is built standing at the origin, tilted, and then moved out —
 * rather than being built in place — so the tilt is about its own root and not
 * about the middle of the patch. A patch tilted as a whole reads as a plant
 * that has been knocked over.
 */
export function buildClump(name: string, species: Species, rng: Rng, { scale = 1 }: BuildOptions) {
  const parts: Part[] = [];
  const count = rng.int(species.count[0], species.count[1]);
  const petalColor = rng.pick(species.petal);
  // One bearing for the whole clump, used only by species that declare a
  // `facing` scatter. Drawn unconditionally so the random sequence — and
  // therefore every seeded clump ever built — does not depend on it.
  const bearing = rng.range(0, Math.PI * 2);

  for (let i = 0; i < count; i++) {
    // Denser in the middle, thinning at the edges — a uniform scatter over a
    // disc leaves a ring with a hole in it, because area grows with the square
    // of the radius. Same correction the grass tuft makes.
    const angle = rng.range(0, Math.PI * 2);
    const distance = Math.sqrt(rng()) * species.spread;
    const ox = Math.cos(angle) * distance;
    const oz = Math.sin(angle) * distance;

    // Shorter at the edges of the clump. Plants at the middle of a patch are
    // sheltered and get the light, and a patch with a flat top reads as having
    // been cut.
    const vigour = 1 - (distance / species.spread) * rng.range(0.1, 0.35);
    const height = rng.range(species.height[0], species.height[1]) * vigour;
    const lean = rng.range(0, 0.22);
    const leanAt = rng.range(0, Math.PI * 2);
    const tipX_a = Math.cos(leanAt) * lean;
    const tipZ_b = Math.sin(leanAt) * lean;

    // The stem, with a slight bend applied as a rotation about its root.
    const stem = new THREE.CylinderGeometry(
      species.stemThickness * 0.7,
      species.stemThickness,
      height,
      4,
    );
    stem.translate(0, height / 2, 0);
    stem.rotateX(tipX_a);
    stem.rotateZ(tipZ_b);
    stem.translate(ox, 0, oz);
    parts.push({
      geometry: stem,
      color: rng.chance(0.4) ? STEM_PALE : STEM,
      // Free at the top, pinned at the root. Clamped before the power: tilting
      // puts base vertices fractionally below zero, and a negative base to a
      // fractional exponent is NaN — which goes straight into the buffer and
      // takes the whole mesh with it.
      sway: (_x, y) => Math.max(0, y / height) ** 1.4,
    });

    // Leaves, in opposed pairs up the lower stem. Cheap, and the difference
    // between a flower and a lollipop on a stick.
    //
    // Placed along the *leaned* stem, by the same reasoning as the head: a leaf
    // pinned to where the stem would have been if it were vertical floats
    // beside it.
    for (let l = 0; l < species.leaves; l++) {
      const at = height * (0.2 + (l / Math.max(1, species.leaves)) * 0.45);
      _node.set(0, at, 0).applyAxisAngle(X_AXIS, tipX_a).applyAxisAngle(Z_AXIS, tipZ_b);
      for (const side of [-1, 1]) {
        const leafLength = height * rng.range(0.16, 0.28);
        const blade = new THREE.ConeGeometry(leafLength * 0.3, leafLength, 3);
        blade.translate(0, leafLength / 2, 0);
        blade.scale(1, 1, 0.35);
        blade.rotateZ(side * rng.range(1, 1.35));
        blade.rotateY(rng.range(0, Math.PI * 2));
        blade.translate(ox + _node.x, _node.y, oz + _node.z);
        parts.push({
          geometry: blade,
          color: LEAF,
          sway: () => Math.max(0, at / height) ** 1.4,
        });
      }
    }

    // Where the head sits, once the lean has carried the top of the stem off its
    // own axis. Taken from the transform rather than derived by hand: the stem
    // geometry is rotated about X and then about Z, so the tip is exactly
    // Rz · Rx · (0, height, 0), and asking `Vector3` for that cannot disagree
    // with what the geometry actually did.
    _tip.set(0, height, 0).applyAxisAngle(X_AXIS, tipX_a).applyAxisAngle(Z_AXIS, tipZ_b);
    const tipX = ox + _tip.x;
    const tipY = _tip.y;
    const tipZ = oz + _tip.z;
    const swayAtTip = 1;

    if (species.head) {
      parts.push(
        ...species.head({
          axis: (t) =>
            new THREE.Vector3(0, height * t, 0)
              .applyAxisAngle(X_AXIS, tipX_a)
              .applyAxisAngle(Z_AXIS, tipZ_b)
              .add(new THREE.Vector3(ox, 0, oz)),
          height,
          rng,
        }),
      );
      continue;
    }

    const head = rng.range(species.headSize[0], species.headSize[1]) * vigour;

    // A heavy head hangs. Applied as a tilt of the whole flower about the top
    // of the stem, so the petals and the disc go over together.
    const nod = rng.chance(species.nod) ? rng.range(0.5, 1.1) : rng.range(0, 0.18);
    const scatter = rng.range(-Math.PI, Math.PI);
    const nodAt =
      species.facing === undefined
        ? scatter
        : bearing + (scatter / Math.PI) * species.facing;
    const place = (geometry: THREE.BufferGeometry): void => {
      geometry.rotateX(Math.cos(nodAt) * nod);
      geometry.rotateZ(Math.sin(nodAt) * nod);
      geometry.translate(tipX, tipY, tipZ);
    };

    const disc = new THREE.CylinderGeometry(head, head * 0.9, head * 0.5, 8);
    place(disc);
    parts.push({ geometry: disc, color: species.centre, sway: swayAtTip });

    const petalLength = head * species.reach;
    for (let p = 0; p < species.petals; p++) {
      const bearing = (p / species.petals) * Math.PI * 2 + rng.range(-0.12, 0.12);
      // Every petal a slightly different size. Partly because real ones are, and
      // partly because petals built to identical dimensions occasionally land
      // exactly on top of each other, and two coincident faces z-fight forever.
      const grown = petalLength * rng.range(0.88, 1.12);
      const petal = new THREE.ConeGeometry(grown * species.petalWidth * rng.range(0.9, 1.1), grown, 3);
      // Built pointing +Y and laid over to point outward, so the wide end is
      // at the disc and the tip is at the rim — which is the way round a petal
      // actually tapers.
      petal.translate(0, petalLength / 2, 0);
      petal.scale(1, 1, 0.28);
      petal.rotateX(Math.PI / 2 - rng.range(species.cup[0], species.cup[1]));
      petal.rotateY(bearing);
      petal.translate(0, head * 0.12, 0);
      place(petal);
      parts.push({ geometry: petal, color: petalColor, sway: swayAtTip });
    }
  }

  const geometry = assemble(parts);
  geometry.rotateY(rng.range(0, Math.PI * 2));
  if (scale !== 1) geometry.scale(scale, scale, scale);
  return finish(geometry, name, rng.range(0, Math.PI * 2));
}

export function species(name: string, plan: Species, radius: number): MeshBuilder {
  return {
    name,
    category: 'foliage',
    radius,
    // Walk straight through them, like the grass. Being stopped by a daisy is
    // the fastest way to make a world feel like a floor with boxes on it.
    solid: false,
    build: (options = {}) => buildClump(name, plan, createRng(options.seed ?? 1), options),
  };
}

const X_AXIS = new THREE.Vector3(1, 0, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);
/** Reused across parts. One flower is built at a time and never concurrently. */
const _tip = new THREE.Vector3();
const _node = new THREE.Vector3();
