import * as THREE from 'three';
import { heightRamp, type Part } from './assemble';
import type { Rng } from './random';
import { shade } from './palette';
import { rod } from './rod';
import { cloud, heightWeight, type Cloud, type LeafColour, type Species, type Twig } from './foliage';
import { packBranch, type Family } from './fields';
import { lathe, type OakWood } from './oakwood';

// A conifer's wood: a straight lathe leader carrying whorls of branch stubs,
// each stub its own lever in the wind, the whorls shortening toward the top
// into a cone. Stands on y = 0.

const TAU = Math.PI * 2;
const GOLDEN = 2.399963;

/** How a whorled cone is grown. Metres, or fractions of the height where named; every range is rolled. */
export interface WhorlForm {
  height: readonly [number, number];
  butt: readonly [number, number];
  bend: readonly [number, number];
  ribs: readonly [number, number];
  thin: number;
  /** How far up the height the lathe runs. */
  latheTop: number;
  /** Where the lowest whorl sits, as a fraction of the height. */
  skirt: readonly [number, number];
  /** Metres between one whorl and the next. */
  step: readonly [number, number];
  arms: readonly [number, number];
  /** The lowest whorl's reach as a fraction of the height, then a constant tail and a floor in metres. */
  reach: number;
  hem: number;
  minReach: number;
  /** A stub's own length before its share of the reach, metres. */
  stub: number;
  /** A bough's tip travel per metre from the trunk at full gust, metres. */
  swing: number;
  /** A crown cloud every this many metres of trunk, sat this far above its whorl and this tall. */
  cloudStep: number;
  cloudLift: number;
  cloudHeight: number;
  /** The leader's sprays, and the cloud over them as radius and height. */
  leaderSpray: number;
  tipCloud: readonly [number, number];
  bark: number;
  colour: LeafColour;
}

/** Builds the cone's wood into `parts` and returns what a crown needs to hang on it. */
export function whorlWood(rng: Rng, parts: Part[], form: WhorlForm): OakWood {
  const height = rng.range(form.height[0], form.height[1]);
  const butt = rng.range(form.butt[0], form.butt[1]);
  const bendAt = rng.range(0, TAU);
  const bend = rng.range(form.bend[0], form.bend[1]);
  const spine = (y: number): THREE.Vector3 => {
    const t = Math.max(0, y / height);
    return new THREE.Vector3(Math.cos(bendAt) * bend * t * t, y, Math.sin(bendAt) * bend * t * t);
  };
  const species: Species = { colour: form.colour, deciduous: false, bark: shade(form.bark, 0.9), weight: heightWeight(height, 1.6) };
  const bark = form.bark;
  parts.push({
    geometry: lathe(spine, butt, height * form.latheTop, rng.int(form.ribs[0], form.ribs[1]), rng.range(0, TAU), form.thin),
    color: (x, y, z) => {
      const c = spine(y);
      const theta = Math.atan2(z - c.z, x - c.x);
      const flake = Math.sin(theta * 7 + y * 1.7) * 0.5 + Math.sin(theta * 13 - y * 2.3) * 0.5;
      return shade(bark, flake > 0.5 ? 0.93 : 0.98 + Math.sin(x * 41 + y * 67 + z * 53) * 0.02);
    },
    sway: heightRamp(0, height, 2.4),
  });

  const twigs: Twig[] = [];
  const clouds: Cloud[] = [];
  const skirt = height * rng.range(form.skirt[0], form.skirt[1]);
  const reachAt = (y: number): number => {
    const t = (y - skirt) / (height - skirt);
    return Math.max(form.minReach, height * form.reach * (1 - t) ** 0.85 + form.hem);
  };
  let bearing = rng.range(0, TAU);
  for (let y = skirt; y < height * 0.94; y += rng.range(form.step[0], form.step[1])) {
    const arms = rng.int(form.arms[0], form.arms[1]);
    const at = spine(y);
    const reach = reachAt(y);
    for (let i = 0; i < arms; i++) {
      bearing += GOLDEN + rng.around(0, 0.3);
      const droop = -0.18 - 0.22 * (1 - (y - skirt) / (height - skirt)) + rng.around(0, 0.08);
      const axis = new THREE.Vector3(Math.cos(bearing), droop, Math.sin(bearing)).normalize();
      const stub = at.clone().addScaledVector(axis, form.stub + reach * 0.18);
      // Each bough is its own lever off the trunk, out of step with its neighbours in the whorl.
      const family: Family = { pivot: at.clone(), phase: rng.range(0, 1), swing: form.swing };
      parts.push({ geometry: rod(at, stub, butt * 0.22, butt * 0.1, 4), color: shade(bark, 0.9), sway: heightRamp(0, height, 1.6), branch: (px, py, pz) => packBranch(px, py, pz, family) });
      twigs.push({ from: at.clone().addScaledVector(axis, 0.05), to: at.clone().addScaledVector(axis, 0.05 + reach * rng.range(0.9, 1.1)), family });
      // A short inner bough beside it, so the whorl is full against the trunk.
      const inner = new THREE.Vector3(Math.cos(bearing + rng.around(0, 0.35)), droop + rng.around(0, 0.1), Math.sin(bearing + rng.around(0, 0.35))).normalize();
      const innerFamily: Family = { pivot: at.clone(), phase: rng.range(0, 1), swing: form.swing };
      twigs.push({ from: at.clone().addScaledVector(inner, 0.03), to: at.clone().addScaledVector(inner, 0.03 + reach * rng.range(0.4, 0.55)), family: innerFamily });
    }
    if (clouds.length === 0 || y - clouds[clouds.length - 1].centre.y > form.cloudStep) {
      clouds.push(cloud(rng, new THREE.Vector3(at.x, y + form.cloudLift, at.z), new THREE.Vector3(reach * 1.05, form.cloudHeight, reach * 1.05), 0.12));
    }
  }
  // The leader: a few short sprays pointing up round the tip.
  const tip = spine(height * 0.95);
  for (let i = 0; i < 3; i++) {
    const b = rng.range(0, TAU);
    const axis = new THREE.Vector3(Math.cos(b) * 0.35, 1, Math.sin(b) * 0.35).normalize();
    twigs.push({ from: tip.clone(), to: tip.clone().addScaledVector(axis, form.leaderSpray) });
  }
  clouds.push(cloud(rng, new THREE.Vector3(tip.x, tip.y - 0.3, tip.z), new THREE.Vector3(form.tipCloud[0], form.tipCloud[1], form.tipCloud[0]), 0.1));

  return { species, clouds, twigs, height };
}
