import * as THREE from 'three';
import { heightRamp, type Part } from './assemble';
import type { Rng } from './random';
import { shade } from './palette';
import { cloud, heightWeight, type Cloud, type LeafColour, type Species, type Twig } from './foliage';
import { growLimb, limbBranch, limbGeometry, type GrowForm, type Limb } from './limbs';
import type { OakWood } from './oakwood';

// A stool's wood: a sheaf of rods splayed from one base at the ground, each its
// own limb and its own lever in the wind, under one broad low crown. Stands on
// y = 0.

const TAU = Math.PI * 2;

/** How a sheaf of rods is grown; every range is rolled. Metres, or fractions of the height where named. */
export interface StoolForm {
  height: readonly [number, number];
  /** The sheaf's reach as a fraction of the height. */
  spread: readonly [number, number];
  rods: readonly [number, number];
  /** A rod's radius where it leaves the stool. */
  butt: readonly [number, number];
  /** How far out a rod's tip stands, as a fraction of the spread. */
  reach: readonly [number, number];
  bark: number;
  colour: LeafColour;
  /** Entered at level 1, so a rod is a first-level limb and `growth`'s level-0 entries never apply. */
  growth: GrowForm;
  evergreen?: boolean;
}

/** Builds the sheaf into `parts` and returns what a crown needs to hang on it. */
export function stoolWood(rng: Rng, parts: Part[], form: StoolForm): OakWood {
  const height = rng.range(form.height[0], form.height[1]);
  const spread = height * rng.range(form.spread[0], form.spread[1]);
  const species: Species = { colour: form.colour, deciduous: !form.evergreen, bark: form.bark, weight: heightWeight(height, 1.4) };

  const limbs: Limb[] = [];
  const twigs: Twig[] = [];
  const heads: THREE.Vector3[] = [];
  const rods = rng.int(form.rods[0], form.rods[1]);
  const start = rng.range(0, TAU);
  for (let i = 0; i < rods; i++) {
    const bearing = start + (i / rods) * TAU + rng.around(0, 0.4);
    const out = spread * rng.range(form.reach[0], form.reach[1]);
    const rise = height * rng.range(0.72, 1);
    const from = new THREE.Vector3(Math.cos(bearing) * 0.06, 0, Math.sin(bearing) * 0.06);
    const tip = new THREE.Vector3(Math.cos(bearing) * out, rise, Math.sin(bearing) * out);
    const rod = growLimb(rng, from, tip.clone().sub(from).normalize(), from.distanceTo(tip), rng.range(form.butt[0], form.butt[1]), 1, form.growth, limbs, twigs);
    heads.push(rod.points[rod.points.length - 1]);
  }

  const sway = heightRamp(0, height, 1.4);
  for (const limb of limbs) {
    parts.push({
      geometry: limbGeometry(limb),
      color: shade(form.bark, rng.range(0.94, 1.06)),
      sway,
      branch: limbBranch(limb),
    });
  }

  const clouds: Cloud[] = [];
  for (const head of heads) {
    const r = spread * rng.range(0.32, 0.44);
    clouds.push(cloud(rng, head.clone().lerp(new THREE.Vector3(0, height * 0.55, 0), 0.3), new THREE.Vector3(r, r * 0.85, r), 0.2));
  }
  clouds.push(cloud(rng, new THREE.Vector3(0, height * 0.6, 0), new THREE.Vector3(spread * 0.85, height * 0.4, spread * 0.85), 0.2));

  return { species, clouds, twigs, height };
}
