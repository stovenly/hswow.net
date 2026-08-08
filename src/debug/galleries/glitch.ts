import * as THREE from 'three';
import type { GalleryPlan } from './layout';
import { signPost } from './layout';
import { markCollidable } from '../../player/Collider';
import { markGlitched, GLITCH_ONSETS } from '../../art/glitch';
import { GLITCH_EFFECTS, type GlitchSpec } from '../../engine/Glitch';
import { figure } from '../../art/builders/figure';
import { crate } from '../../art/builders/crate';
import { barrel } from '../../art/builders/barrel';

/**
 * The Glitch Showcase: where placed corruption is judged. GLITCH-SHADERS.md §7.
 *
 * Laid out like every other gallery: one row per subject, sign at the near
 * end, and the thing being varied runs *down* the row. Walking west to east
 * reads the effects in ladder order — the order they arrive on the master
 * dial — and walking down any one row reads that effect alone, faint by the
 * sign and full strength at the far end. The isolation is real: every station
 * in an effect's row carries that one weight at 1 and the other fourteen at 0.
 *
 * Strength steps are placed inside each effect's own active range (the onset
 * table in `art/glitch.ts`), because a flat 0.25/0.5/0.75 ladder would leave
 * a late effect like shatter showing nothing on three of its four stations —
 * the whole row would read as broken rather than as a ramp.
 *
 * East of the effect rows, the **recipe rank**: curated combinations, one row
 * per recipe, because the end of this system is not fifteen dials — it is a
 * corrupted *individual*, and which effects compose into a person going wrong
 * is a judgement that needs its own stations. Recipe names are working names.
 *
 * Three rows are neither effect nor recipe:
 *
 * - **`all-effects`**, westmost: default weights, master strength climbing —
 *   the composed ladder, where the staged onsets are judged as a whole.
 * - **`fully-corrupt`**: one figure, everything at 1 — the far end of the
 *   whole system, standing on its own.
 * - **`anomaly`**, eastmost: a free-standing volume over unmarked crates,
 *   proving the fog-style placement route — the spot is wrong, not the things.
 *
 * The dev panel's glitch folder carries a steady override and a freeze,
 * because a burst envelope is the enemy of a careful look. Bursts are judged
 * here too — walk the all-effects row with the override off.
 */

export const ZONE_GLITCH_SHOWCASE = 'glitch-showcase';

/**
 * Every station's burst cadence. World placements pace themselves off their
 * own strength — a faint glitch that fires twice a minute is the point out
 * there — but in here the wait is only a wait, so the whole room runs hot: a
 * quiet station shows its burst every couple of seconds instead.
 */
const TEMPO = 6;

/** Stations down a row, as fractions of the effect's own onset..1 span. */
const STEPS = [0.25, 0.5, 0.75, 1.0] as const;
/** The composed row's master strengths, door end first. */
const ALL_STEPS = [0.15, 0.35, 0.55, 0.75, 1.0] as const;

const ROW_SPACING = 5;
const STATION_DEPTH = 6;
const FIRST_Z = -2;
const SIGN_Z = 2;

/**
 * The combinations: what several effects make together. Each is a statement
 * about *what* is failing — the signal, the data, or the thing itself — and
 * every weight not named is silent.
 */
const RECIPES: ReadonlyArray<{ name: string; weights: GlitchSpec['weights'] }> = [
  // The image of it is failing: it doubles, tears and drops out, while the
  // thing underneath stays whole.
  {
    name: 'bad-signal',
    weights: { stutter: 0.6, split: 1, tear: 0.8, dropout: 0.7, ghost: 0.9 },
  },
  // The data of it is failing: colours rot, the surface posterizes and gives
  // way to static, faces go missing.
  {
    name: 'data-rot',
    weights: { 'palette-rot': 1, crush: 0.8, salt: 0.8, erode: 0.6, 'static-fill': 0.9 },
  },
  // The thing itself is failing: it shivers, shears and sheds facets while
  // its picture stays honest about it.
  {
    name: 'coming-apart',
    weights: { stutter: 0.5, jitter: 0.7, slice: 0.9, blocks: 0.8, shatter: 1 },
  },
];

/**
 * Rows west to east: the composed ladder, every effect in ladder order, the
 * recipe rank, the fully-corrupt centrepiece, the anomaly.
 */
const ROWS = GLITCH_EFFECTS.length + RECIPES.length + 3;
const WEST = -((ROWS - 1) * ROW_SPACING) / 2;

/** A volume sized to a standing figure, mid-torso. */
function figureSpec(spec: Omit<GlitchSpec, 'size' | 'offset'>): GlitchSpec {
  return {
    size: new THREE.Vector3(0.85, 1.05, 0.85),
    offset: new THREE.Vector3(0, 0.95, 0),
    tempo: TEMPO,
    ...spec,
  };
}

/**
 * The named weights over a silent base. An absent weight means 1 to the
 * engine — the right default for a placement — so a curated set has to say
 * its zeroes out loud.
 */
function only(named: NonNullable<GlitchSpec['weights']>): GlitchSpec['weights'] {
  const weights: NonNullable<GlitchSpec['weights']> = {};
  for (const name of GLITCH_EFFECTS) weights[name] = named[name] ?? 0;
  return weights;
}

/** One weight at 1 and fourteen at 0, for the effect rows. */
function solo(effect: (typeof GLITCH_EFFECTS)[number]): GlitchSpec['weights'] {
  return only({ [effect]: 1 });
}

function extras(): THREE.Object3D[] {
  const placed: THREE.Object3D[] = [];

  /** One row: a sign at the head, figures marching away from the door. */
  const row = (
    x: number,
    name: string,
    strengths: readonly number[],
    weights: GlitchSpec['weights'],
    seedBase: number,
  ): void => {
    const sign = signPost(name);
    sign.position.set(x, 0, SIGN_Z);
    placed.push(sign);
    strengths.forEach((strength, j) => {
      const mesh = figure.build({ seed: seedBase + j * 7919 });
      mesh.position.set(x, 0, FIRST_Z - j * STATION_DEPTH);
      markGlitched(mesh, figureSpec({ strength, seed: seedBase + j, weights }));
      placed.push(markCollidable(mesh));
    });
  };

  // --- the composed ladder, westmost ---------------------------------------
  row(WEST, 'all-effects', ALL_STEPS, undefined, 1000);

  // --- one row per effect, in ladder order ----------------------------------
  GLITCH_EFFECTS.forEach((effect, i) => {
    const onset = GLITCH_ONSETS[effect];
    const strengths = STEPS.map((f) => onset + f * (1 - onset));
    row(WEST + (i + 1) * ROW_SPACING, effect, strengths, solo(effect), 4000 + i * 131);
  });

  // --- the recipe rank ------------------------------------------------------
  // Master strength climbs down each row the way it does everywhere else, so
  // a recipe is judged as a progression too: a slightly-off individual near
  // the sign, a fully failed one at the far end.
  RECIPES.forEach((recipe, i) => {
    const x = WEST + (GLITCH_EFFECTS.length + 1 + i) * ROW_SPACING;
    row(x, recipe.name, [0.5, 0.75, 1.0], only(recipe.weights ?? {}), 8000 + i * 379);
  });

  // --- the centrepiece: everything, at full ---------------------------------
  {
    const x = WEST + (ROWS - 2) * ROW_SPACING;
    const sign = signPost('fully-corrupt');
    sign.position.set(x, 0, SIGN_Z);
    placed.push(sign);
    const mesh = figure.build({ seed: 6666 });
    mesh.position.set(x, 0, FIRST_Z - STATION_DEPTH);
    markGlitched(mesh, figureSpec({ strength: 1, seed: 66 }));
    placed.push(markCollidable(mesh));
  }

  // --- the anomaly, eastmost ------------------------------------------------
  // Nothing here is marked. The volume in `glitches` below is what corrupts
  // them, which is the claim being staged.
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

export const glitchShowcasePlan: GalleryPlan = {
  id: ZONE_GLITCH_SHOWCASE,
  group: 'general',
  name: 'Glitch Showcase',
  // No builder rank: nothing in the art kit makes a glitch — the subject of
  // this room is a stage, not a prop — and the rows above are stations, not
  // seeds.
  builders: [],

  glitches: [
    {
      shape: 'sphere',
      center: new THREE.Vector3(WEST + (ROWS - 1) * ROW_SPACING, 1.2, FIRST_Z - STATION_DEPTH),
      size: new THREE.Vector3(4.5, 2.4, 4.5),
      strength: 0.6,
      seed: 9,
      tempo: TEMPO,
    },
  ],

  extras,
};
