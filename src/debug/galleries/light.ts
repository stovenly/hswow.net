import * as THREE from 'three';
import type { GalleryPlan } from './layout';
import type { ZoneEnvironment } from '../../world/Zone';
import { signPost } from './layout';
import { alcove, sealedRoom, UNLIT } from './dark';
import { markCollidable } from '../../player/Collider';
import { assemble, finish, type Part } from '../../art/assemble';
import { PALETTE, shade } from '../../art/palette';
import { createRng } from '../../art/random';
import { rollActivity, CANDLE, HEARTH, type ActivitySpec } from '../../art/activity';
import { candle } from '../../art/builders/candle';
import { lantern } from '../../art/builders/lantern';
import { streetlamp } from '../../art/builders/streetlamp';
import { fireplace } from '../../art/builders/fireplace';
import { forge } from '../../art/builders/forge';
import { stove } from '../../art/builders/stove';

/**
 * Everything the kit burns, in the dark, moving.
 *
 * The Dark Room made the argument this room extends: a lit void is the right
 * place to judge a shape and the wrong place to judge a light. That room is for
 * lettering that emits; this one is for the six props that carry a flame, and
 * what `art/activity.ts` has them doing over time.
 *
 * **The rank is the decorrelation test.** A gallery lays out eight of every
 * builder automatically, so eight candles stand in a line here without anything
 * being authored — and if any two of them are in step you can see it from the
 * door. That is the requirement the activity signal exists to meet.
 *
 * Two bays off the rank, for the two things a rank cannot show:
 *
 * - **The depth ramp**, west. The same candle at nothing, a quarter, a half and
 *   full swing, so a default gets picked off something rather than off a guess.
 * - **The event bay**, east. One hearth with its crackles off, one at its own
 *   rate, one at four times it — the discrete half of the signal made visible
 *   as a thing separate from the wander.
 */

export const ZONE_LIGHT_SHOWCASE = 'light-showcase';

/** The Dark Room's darkness in a much bigger room, so it sounds like one. */
const ENVIRONMENT: Partial<ZoneEnvironment> = {
  ...UNLIT,
  fogNear: 16,
  fogFar: 52,
  room: 'hall',
  footstepReverb: 0.3,
};

/** Room enough for the rank, the two bays and the door home at z = 16. */
const ROOM = { half: 24, south: 22, north: -36, height: 7 };

/** A pedestal, so a hand-scale flame lights something other than the floor. */
function plinth(height: number): THREE.Object3D {
  const parts: Part[] = [];
  const top = new THREE.BoxGeometry(1.1, 0.14, 1.1);
  top.translate(0, height - 0.07, 0);
  parts.push({ geometry: top, color: PALETTE.STONE, sway: 0 });
  const shaft = new THREE.BoxGeometry(0.7, height - 0.14, 0.7);
  shaft.translate(0, (height - 0.14) / 2, 0);
  parts.push({ geometry: shaft, color: shade(PALETTE.STONE_DARK, 0.9), sway: 0 });
  return markCollidable(finish(assemble(parts), 'light-plinth', 0));
}

/**
 * The same spec with its swing scaled.
 *
 * Rig-only: a builder authors one character and this is how a bay shows four
 * amounts of it side by side. Events scale with the bands, so a quarter-swing
 * candle also splutters a quarter as hard.
 */
function scaled(spec: ActivitySpec, factor: number): ActivitySpec {
  return {
    ...spec,
    bands: spec.bands.map((band) => ({ ...band, depth: band.depth * factor })),
    events: spec.events
      ? { ...spec.events, strength: spec.events.strength * factor }
      : undefined,
  };
}

/** The same spec with its events rescheduled, the bands untouched. */
function crackling(spec: ActivitySpec, factor: number): ActivitySpec {
  if (!spec.events) return spec;
  if (factor === 0) return { ...spec, events: undefined };
  return { ...spec, events: { ...spec.events, hz: spec.events.hz * factor } };
}

/** A prop standing where it is told, running a spec of the bay's choosing. */
function station(
  mesh: THREE.Mesh,
  spec: ActivitySpec,
  seed: number,
  x: number,
  y: number,
  z: number,
): THREE.Object3D {
  mesh.position.set(x, y, z);
  mesh.userData.activity = rollActivity(spec, createRng(seed));
  return markCollidable(mesh);
}

/**
 * Back wall and label for one bay station.
 *
 * The alcove stands so its opening is in front of the prop and its back is
 * behind it — three surfaces for the light to fall off across, which is the
 * only reason there is any wall in a room whose subject is darkness.
 */
function bay(name: string, x: number, z: number, width: number, depth: number): THREE.Object3D[] {
  const wall = alcove(width, depth, 3.4);
  wall.position.set(x, 0, z + depth * 0.55);
  const sign = signPost(`${ZONE_LIGHT_SHOWCASE}:${name}`, name);
  sign.position.set(x + width / 2 + 0.5, 0, z + 1.4);
  return [wall, sign];
}

/** How hard the ramp swings, west to east, as a fraction of the authored depth. */
const RAMP = [0, 0.25, 0.5, 1] as const;
/** How often the hearth bay crackles, as a multiple of its authored rate. */
const CRACKLE = [0, 1, 4] as const;

export const lightShowcasePlan: GalleryPlan = {
  id: ZONE_LIGHT_SHOWCASE,
  group: 'general',
  name: 'Light Showcase',
  door: 'iron',
  builders: [candle, lantern, streetlamp, fireplace, forge, stove],
  environment: ENVIRONMENT,

  extras() {
    const extras: THREE.Object3D[] = [sealedRoom(ROOM)];

    RAMP.forEach((factor, i) => {
      const z = -i * 4.5;
      const height = 0.95;
      extras.push(plinth(height).translateX(-17).translateZ(z));
      extras.push(...bay(`swing-${Math.round(factor * 100)}`, -17, z, 2.4, 2.2));
      extras.push(
        station(
          candle.build({ seed: 4100 + i * 7919 }),
          scaled(CANDLE, factor),
          4100 + i * 7919,
          -17,
          height,
          z,
        ),
      );
    });

    CRACKLE.forEach((factor, i) => {
      const z = -i * 6;
      extras.push(...bay(`crackle-${factor}x`, 17, z, 3.2, 3));
      extras.push(
        station(
          fireplace.build({ seed: 4200 + i * 7919 }),
          crackling(HEARTH, factor),
          4200 + i * 7919,
          17,
          0,
          z,
        ),
      );
    });

    return extras;
  },
};
