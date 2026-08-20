import * as THREE from 'three';
import type { GalleryPlan } from './layout';
import { signPost } from './layout';
import { markCollidable } from '../../player/Collider';
import { markHaunted } from '../../art/horror';
import { markGlitched } from '../../art/glitch';
import { HORROR_EFFECTS, type HorrorSpec } from '../../engine/Horror';
import { GLITCH_EFFECTS, type GlitchSpec } from '../../engine/Glitch';
import type { MeshBuilder } from '../../art/types';
import { figure } from '../../art/builders/figure';
import { bovine } from '../../art/builders/bovine';
import { barrel } from '../../art/builders/barrel';
import { crate } from '../../art/builders/crate';
import { chair } from '../../art/builders/chair';
import { smallOak } from '../../art/builders/small-oak';
import { quartzOrb } from '../../art/builders/quartz-orb';

/**
 * The Object Effect Showcase: what the effect systems make *together*, and on
 * things that are not all the same shape.
 *
 * The Glitch and Horror galleries each answer "what does this one effect do",
 * one row per effect with strength climbing down it. Neither can answer the
 * two questions that actually decide whether a corrupted thing is usable:
 * **what do several effects make when stacked**, and **does that survive being
 * put on something other than a standing figure**. A room of figures teaches
 * you nothing about what erosion looks like on a chair.
 *
 * So the axes here are the other two. Walking west to east reads one
 * combination per row — horror recipes, glitch recipes, then the ones that
 * cross the two systems. Walking *down* any row holds the combination fixed
 * and changes the subject: a person, an animal, a staved barrel, a plain box,
 * something thin and legged, something branching, and a floating orb.
 * Strength does not vary in here on purpose — that is the other two rooms'
 * question, and varying it as well would leave every station differing from
 * its neighbours in two ways at once.
 *
 * **Nothing in here is grounded.** The `grounded` flag pins an effect's pivot
 * to the object's base so a figure leans from the ankles, and the Horror
 * Showcase's rank of figures uses it — but it is the special case, not the
 * default, and this room is where the general case gets looked at. Everything
 * here pivots about its own volume, boxes and animals and the hanging orb
 * alike.
 *
 * Every recipe and subject name here is a working name.
 */

export const ZONE_OBJECT_EFFECTS = 'object-effects';

/** Showcase cadence, matching the other two rooms. */
const TEMPO = 10;

const ROW_SPACING = 6;
const STATION_DEPTH = 5;
const FIRST_Z = -2;
const SIGN_Z = 2;

interface Subject {
  readonly name: string;
  readonly builder: MeshBuilder;
  /** Raised off the floor, for the one subject that is meant to hang. */
  readonly lift?: number;
}

/**
 * How much bigger than the thing its volume is, sideways and upward.
 *
 * Both engines feather a volume's strength away over its outer third
 * (`smoothstep(0.7, 1.0, e)`), so a volume drawn tight to the silhouette
 * leaves the whole outside of the object at reduced strength. Sized past that
 * shoulder instead, the object sits inside the full-strength core with only
 * its extremities easing off.
 */
const VOLUME_PAD = 1.5;

/**
 * The volume that covers a built mesh, measured rather than authored.
 *
 * Since membership for an attached volume is by owner id (art/effectId.ts),
 * these faces decide nothing about what is affected — the box only anchors
 * the horror effects (breathe's swell centre, headshake's height mask, the
 * pivots) and carries the spec. Measured rather than authored because a wrong
 * anchor still reads wrong, and a builder knows its own size where a
 * hand-authored extent is one edit away from not matching.
 */
function volumeFor(mesh: THREE.Object3D): { size: THREE.Vector3; offset: THREE.Vector3 } {
  mesh.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(mesh);
  if (box.isEmpty()) {
    return { size: new THREE.Vector3(1, 1, 1), offset: new THREE.Vector3(0, 0.5, 0) };
  }
  const extent = box.getSize(new THREE.Vector3());
  const grow = VOLUME_PAD - 1;
  // Sideways from the centre, upward from the top, and not at all downward.
  const halfX = Math.max((extent.x * (1 + grow)) / 2, 0.2);
  const halfZ = Math.max((extent.z * (1 + grow)) / 2, 0.2);
  const top = box.max.y + extent.y * grow;
  const bottom = Math.max(box.min.y, 0);
  const halfY = Math.max((top - bottom) / 2, 0.2);
  return {
    size: new THREE.Vector3(halfX, halfY, halfZ),
    offset: new THREE.Vector3((box.min.x + box.max.x) / 2, bottom + halfY, (box.min.z + box.max.z) / 2),
  };
}

/**
 * The rank of subjects, in the order they run away from the sign. Ordered
 * person → animal → round → boxy → thin → branching → floating, so the walk
 * down a row moves steadily further from the figure every effect was tuned
 * against.
 */
const SUBJECTS: readonly Subject[] = [
  { name: 'figure', builder: figure },
  { name: 'bovine', builder: bovine },
  { name: 'barrel', builder: barrel },
  { name: 'crate', builder: crate },
  { name: 'chair', builder: chair },
  { name: 'small-oak', builder: smallOak },
  // Hanging, so there is nothing under it to hold still even if this room
  // asked things to — which it does not.
  { name: 'quartz-orb', builder: quartzOrb, lift: 1.3 },
];

interface Recipe {
  readonly name: string;
  readonly strength: number;
  readonly horror?: NonNullable<HorrorSpec['weights']>;
  readonly glitch?: NonNullable<GlitchSpec['weights']>;
}

/**
 * The combinations, west to east: each system's whole ladder, then the curated
 * recipes within each, then the ones that cross. A recipe naming no weights
 * for a system carries none of it at all.
 */
const RECIPES: readonly Recipe[] = [
  // Each system entire, as a reference for everything east of it.
  { name: 'all-horror', strength: 1, horror: {} },
  { name: 'all-glitch', strength: 1, glitch: {} },

  // Horror alone.
  {
    name: 'possessed',
    strength: 0.9,
    horror: { tremor: 0.7, judder: 0.6, headshake: 1, lean: 0.4, flicker: 0.5 },
  },
  {
    name: 'corpse-walker',
    strength: 0.9,
    horror: { pallor: 1, breathe: 0.7, stretch: 0.3 },
  },
  {
    name: 'shadow-thing',
    strength: 0.9,
    horror: { shroud: 1, flicker: 0.8, lean: 0.5, stretch: 0.6, pallor: 0.4 },
  },

  // Glitch alone.
  {
    name: 'bad-signal',
    strength: 0.9,
    glitch: { stutter: 0.6, split: 1, tear: 0.8, dropout: 0.7, ghost: 0.9 },
  },
  {
    name: 'data-rot',
    strength: 0.9,
    glitch: { 'palette-rot': 1, crush: 0.8, salt: 0.8, erode: 0.6, 'static-fill': 0.9 },
  },
  {
    name: 'coming-apart',
    strength: 0.9,
    glitch: { stutter: 0.5, jitter: 0.7, slice: 0.9, blocks: 0.8, shatter: 1 },
  },

  // And the crossings, which are the reason this room exists. A thing that is
  // both haunted and badly transmitted is not the sum of two rooms — the
  // horror stage grades and moves the body, and the glitch stage then corrupts
  // the picture of what it did.
  {
    name: 'haunted-signal',
    strength: 0.9,
    horror: { shroud: 0.8, flicker: 0.6, stretch: 0.5, judder: 0.5 },
    glitch: { split: 1, tear: 0.7, ghost: 0.9, dropout: 0.5 },
  },
  {
    name: 'rotting-body',
    strength: 0.9,
    horror: { pallor: 1, breathe: 0.8, lean: 0.5, tremor: 0.4 },
    glitch: { 'palette-rot': 0.7, crush: 0.8, erode: 0.6, 'static-fill': 0.5 },
  },

  // The far end of both systems at once, and the room's last word.
  { name: 'everything', strength: 1, horror: {}, glitch: {} },
];

const ROWS = RECIPES.length;
const WEST = -((ROWS - 1) * ROW_SPACING) / 2;

/**
 * The named weights over a silent base. An absent weight means 1 to both
 * engines — the right default for a placement — so a curated set has to say
 * its zeroes out loud. An empty set therefore means *everything*, which is
 * what the `all-` and `everything` rows want.
 */
function onlyHorror(named: NonNullable<HorrorSpec['weights']>): HorrorSpec['weights'] | undefined {
  if (Object.keys(named).length === 0) return undefined;
  const weights: NonNullable<HorrorSpec['weights']> = {};
  for (const name of HORROR_EFFECTS) weights[name] = named[name] ?? 0;
  return weights;
}

function onlyGlitch(named: NonNullable<GlitchSpec['weights']>): GlitchSpec['weights'] | undefined {
  if (Object.keys(named).length === 0) return undefined;
  const weights: NonNullable<GlitchSpec['weights']> = {};
  for (const name of GLITCH_EFFECTS) weights[name] = named[name] ?? 0;
  return weights;
}

function extras(): THREE.Object3D[] {
  const placed: THREE.Object3D[] = [];

  RECIPES.forEach((recipe, i) => {
    const x = WEST + i * ROW_SPACING;

    const sign = signPost(recipe.name);
    sign.position.set(x, 0, SIGN_Z);
    placed.push(sign);

    SUBJECTS.forEach((subject, j) => {
      const seed = 5000 + i * 631 + j * 7919;
      const mesh = subject.builder.build({ seed });
      // Measured while it still stands at the origin, so the box is the
      // object's own and the offset is what the volume rides on.
      const { size, offset } = volumeFor(mesh);
      mesh.position.set(x, subject.lift ?? 0, FIRST_Z - j * STATION_DEPTH);

      if (recipe.horror) {
        markHaunted(mesh, {
          shape: 'box',
          size,
          offset,
          strength: recipe.strength,
          tempo: TEMPO,
          seed,
          weights: onlyHorror(recipe.horror),
        });
      }
      if (recipe.glitch) {
        markGlitched(mesh, {
          shape: 'box',
          size,
          offset,
          strength: recipe.strength,
          tempo: TEMPO,
          seed,
          weights: onlyGlitch(recipe.glitch),
        });
      }

      placed.push(markCollidable(mesh));
    });
  });

  return placed;
}

export const objectEffectsPlan: GalleryPlan = {
  id: ZONE_OBJECT_EFFECTS,
  group: 'general',
  name: 'Object Effects',
  // No builder rank: the subjects stand in the rows above, one per station,
  // and a rank of eight seeds of each would be a different room entirely.
  builders: [],
  extras,
};
