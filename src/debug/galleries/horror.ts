import * as THREE from 'three';
import type { GalleryPlan } from './layout';
import { signPost } from './layout';
import { markCollidable } from '../../player/Collider';
import { markHaunted, HORROR_ONSETS } from '../../art/horror';
import { HORROR_EFFECTS, type HorrorSpec } from '../../engine/Horror';
import { figure } from '../../art/builders/figure';
import { crate } from '../../art/builders/crate';
import { barrel } from '../../art/builders/barrel';

/**
 * The Horror Showcase (HORROR-SHADERS.md), laid out like the glitch one: one
 * row per effect, walking west to east reads them in ladder order, walking
 * down a row reads that one effect from faint to full. All names are working
 * names.
 *
 * **One effect at a time, and nothing else.** Combinations — recipes, both
 * systems at once, everything at full — live in the Object Effect Showcase,
 * along with the question of what any of it looks like on something that is
 * not a standing figure. Two questions, two rooms; a room that answered both
 * would leave every station differing from its neighbour in two ways.
 */

export const ZONE_HORROR_SHOWCASE = 'horror-showcase';

/**
 * Showcase cadence: in here a wait is only a wait, so the room runs hot.
 * Drives the fit rate and the slow drifts alike — at 10, a proportion drift
 * that takes minutes in the world crosses its range in seconds here.
 */
const TEMPO = 10;

/** Stations down a row, as fractions of the effect's own onset..1 span. */
const STEPS = [0.25, 0.5, 0.75, 1.0] as const;

const ROW_SPACING = 5;
const STATION_DEPTH = 6;
const FIRST_Z = -2;
const SIGN_Z = 2;

/** Rows west to east: every effect in ladder order, then the anomaly. */
const ROWS = HORROR_EFFECTS.length + 1;
const WEST = -((ROWS - 1) * ROW_SPACING) / 2;

/**
 * A volume sized to a standing figure, and it has feet.
 *
 * Membership is by owner id (art/effectId.ts), so these faces only anchor the
 * effects — breathe's swell centre mid-torso, headshake's height mask from the
 * chest up, the lean and stretch pivots.
 */
function figureSpec(spec: Omit<HorrorSpec, 'size' | 'offset'>): HorrorSpec {
  return {
    size: new THREE.Vector3(0.85, 1.15, 0.85),
    offset: new THREE.Vector3(0, 1.15, 0),
    tempo: TEMPO,
    grounded: true,
    ...spec,
  };
}

/**
 * The named weights over a silent base — an absent weight means 1 to the
 * engine, so a curated set has to say its zeroes out loud.
 */
function only(named: NonNullable<HorrorSpec['weights']>): HorrorSpec['weights'] {
  const weights: NonNullable<HorrorSpec['weights']> = {};
  for (const name of HORROR_EFFECTS) weights[name] = named[name] ?? 0;
  return weights;
}

/** One weight at 1 and the rest at 0, for the effect rows. */
function solo(effect: (typeof HORROR_EFFECTS)[number]): HorrorSpec['weights'] {
  return only({ [effect]: 1 });
}

function extras(): THREE.Object3D[] {
  const placed: THREE.Object3D[] = [];

  /** One row: a sign at the head, figures marching away from the door. */
  const row = (
    x: number,
    name: string,
    stations: readonly Partial<HorrorSpec>[],
    seedBase: number,
  ): void => {
    const sign = signPost(name);
    sign.position.set(x, 0, SIGN_Z);
    placed.push(sign);
    stations.forEach((station, j) => {
      const mesh = figure.build({ seed: seedBase + j * 7919 });
      mesh.position.set(x, 0, FIRST_Z - j * STATION_DEPTH);
      markHaunted(
        mesh,
        figureSpec({ strength: 1, seed: seedBase + j, ...station } as Omit<
          HorrorSpec,
          'size' | 'offset'
        >),
      );
      placed.push(markCollidable(mesh));
    });
  };

  // --- one row per effect, in ladder order ----------------------------------
  // Strength steps sit inside each effect's own onset..1 span, so a late
  // effect like flicker still ramps down its row instead of showing nothing.
  HORROR_EFFECTS.forEach((effect, i) => {
    const onset = HORROR_ONSETS[effect];
    row(
      WEST + i * ROW_SPACING,
      effect,
      STEPS.map((f) => ({ strength: onset + f * (1 - onset), weights: solo(effect) })),
      4000 + i * 131,
    );
  });

  // --- the anomaly, eastmost ------------------------------------------------
  // Nothing here is marked; the free-standing volume below is what haunts
  // them. Crates that breathe are the placement route's proof.
  const anomalyX = WEST + (ROWS - 1) * ROW_SPACING;
  const anomalyZ = FIRST_Z - STATION_DEPTH;
  const stack: Array<[number, number]> = [
    [-1.2, 0.4],
    [1.1, -0.6],
    [0.1, 1.2],
    [-0.4, -1.3],
  ];
  stack.forEach(([dx, dz], i) => {
    const mesh = (i % 2 === 0 ? crate : barrel).build({ seed: 7000 + i * 977 });
    mesh.position.set(anomalyX + dx, 0, anomalyZ + dz);
    placed.push(markCollidable(mesh));
  });
  const sign = signPost('anomaly');
  sign.position.set(anomalyX, 0, SIGN_Z);
  placed.push(sign);

  return placed;
}

export const horrorShowcasePlan: GalleryPlan = {
  id: ZONE_HORROR_SHOWCASE,
  group: 'general',
  name: 'Horror Showcase',
  // No builder rank: the subject of this room is a stage, not a prop.
  builders: [],

  horrors: [
    {
      shape: 'sphere',
      // Low, at the height of the crates themselves: the volume's centre is
      // also the anchor `breathe` swells away from, so a volume floating over
      // its subjects would inflate them downward through the floor.
      center: new THREE.Vector3(WEST + (ROWS - 1) * ROW_SPACING, 0.5, FIRST_Z - STATION_DEPTH),
      size: new THREE.Vector3(4.5, 2.4, 4.5),
      strength: 0.6,
      seed: 9,
      tempo: TEMPO,
      // Crates and barrels sitting on the floor, so they should stay on it.
      grounded: true,
    },
  ],

  extras,
};
