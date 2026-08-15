import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import {
  block,
  chimney,
  facePoint,
  jetty,
  look,
  markDoorways,
  mullioned,
  onFace,
  proud,
  type Doorway,
} from '../building';

/**
 * The lord's house: a hall range with a cross-wing, and a porch on the front.
 *
 * Three things say money and they are all here. **Stone below, timber above** —
 * a wall a mason built rather than a carpenter. **A jetty**, which is the upper
 * floor standing out over the lower on the ends of its own joists, and which
 * exists to be seen. **Close studding**, oak nailed up the whole wall at half a
 * metre where a villager gets one stud a metre and a half.
 *
 * **One design, not a family.** A village has one manor, so this is drawn: the
 * numbers below are chosen and the seed is ignored. What the generator is still
 * doing is the shade of an individual stone and the like — nothing that changes
 * the building.
 */

const WIDTH = 12.5;
const DEPTH = 6.2;
const WING_WIDTH = 5;
const WING_DEPTH = 7.6;
const GROUND = 2.9;
const FIRST = 2.45;
const EAVE = GROUND + FIRST;
const PITCH = 0.78;
/** How far the upper storey stands out over the lower. */
const JETTY = 0.5;

/** Backs flush, wing forward — placed so the whole plan comes out centred. */
const HALL_Z = (DEPTH - WING_DEPTH) / 2;
const WING_X = WIDTH / 2 - WING_WIDTH / 2;
/**
 * The hall range runs up to the wing and stops.
 *
 * It used to be the full width of the house, so its right-hand quarter stood
 * *inside* the cross-wing — which put the hall's right wall on exactly the same
 * plane as the wing's, and the right-hand quarter of the hall's back wall on
 * exactly the same plane as the wing's back. Every course of stone on both was
 * being laid twice, by two blocks that could not see each other.
 *
 * Two ranges of an L-plan house abut; they do not overlap. The hall's own right
 * wall is the one they share, and it is declared a `join` so the wing draws the
 * stonework there alone.
 */
const HALL_WIDTH = WIDTH - WING_WIDTH;
const HALL_X = -WING_WIDTH / 2;
/**
 * Hard to the right of the hall's own front, so the whole of the rest of it is
 * a clear run for windows.
 *
 * The porch used to stand in the middle of that run with its roof and its
 * jambs through the first-floor window above it. A porch is two and a half
 * metres to the ridge and the chamber window starts under four — they cannot
 * share a bay, so the porch takes the end bay and the windows take the rest.
 */
const PORCH_X = -0.6;
const PORCH_WIDTH = 2.2;
const PORCH_DEPTH = 1.7;
/**
 * Where the windows sit on each floor.
 *
 * Both were a hand too high. The ground storey's heads ran up under the jetty's
 * bressummer with a finger's width to spare, and the first floor's ran into the
 * frame's own top plate — a window wants a clear course of wall above it or the
 * wall reads as having been squeezed round it.
 */
const GROUND_SILL = 0.95;
const FIRST_SILL = GROUND + 0.6;

const DOOR_WIDTH = 1.15;
const DOOR_HEIGHT = 2.45;

export const manor: MeshBuilder = {
  name: 'manor',
  category: 'structures',
  radius: 8.5,
  variants: 1,

  build({ scale = 1 } = {}) {
    const rng = createRng(4211);
    const parts: Part[] = [];

    // Two looks, one building. The ground storey is the mason's and the upper
    // is the carpenter's, and they share their stone and their roof so the two
    // read as one house.
    const lower = look(rng, 'stone', 'slate');
    const upper = {
      ...look(rng, 'frame', 'slate'),
      stone: lower.stone,
      stoneDark: lower.stoneDark,
      roof: lower.roof,
      timber: lower.timber,
      timberDark: lower.timberDark,
      studs: 0.44,
    };

    // --- the hall range ------------------------------------------------------
    const hallLow = block(rng, {
      x: HALL_X,
      z: HALL_Z,
      width: HALL_WIDTH,
      depth: DEPTH,
      joins: [Math.PI / 2],
      base: 0.34,
      eave: GROUND,
      pitch: PITCH,
      roofless: true,
      look: lower,
    });
    parts.push(...hallLow.parts);

    const hallHigh = block(rng, {
      x: HALL_X,
      z: HALL_Z + JETTY / 2,
      width: HALL_WIDTH,
      depth: DEPTH + JETTY,
      joins: [Math.PI / 2],
      base: GROUND,
      plinth: 0,
      eave: EAVE,
      pitch: PITCH,
      look: upper,
    });
    parts.push(...hallHigh.parts);
    parts.push(
      ...onFace(
        jetty(rng, { at: 0, span: HALL_WIDTH, y: GROUND, out: JETTY, look: upper }),
        hallLow.wall.front,
      ),
    );

    // --- the cross-wing ------------------------------------------------------
    //
    // Ridge along Z, so its gable faces the front. That gable end is the whole
    // point of a cross-wing: it turns a long low range into a house with a front.
    const wingLow = block(rng, {
      x: WING_X,
      width: WING_WIDTH,
      depth: WING_DEPTH,
      base: 0.34,
      eave: GROUND,
      pitch: PITCH,
      ridge: 'z',
      roofless: true,
      look: lower,
    });
    parts.push(...wingLow.parts);

    const wingHigh = block(rng, {
      x: WING_X,
      z: JETTY / 2,
      width: WING_WIDTH,
      depth: WING_DEPTH + JETTY,
      base: GROUND,
      plinth: 0,
      eave: EAVE,
      pitch: PITCH,
      ridge: 'z',
      look: upper,
    });
    parts.push(...wingHigh.parts);
    parts.push(
      ...onFace(
        jetty(rng, { at: 0, span: WING_WIDTH, y: GROUND, out: JETTY, look: upper }),
        wingLow.wall.front,
      ),
    );

    // --- the porch -----------------------------------------------------------
    //
    // In the angle between hall and wing, which is where a door goes when the
    // wing has taken one end of the front.
    const porch = block(rng, {
      x: PORCH_X,
      z: HALL_Z + DEPTH / 2 + PORCH_DEPTH / 2 - 0.3,
      width: PORCH_WIDTH,
      depth: PORCH_DEPTH,
      base: 0.3,
      eave: 2.6,
      pitch: PITCH + 0.12,
      ridge: 'z',
      overEave: 0.16,
      overGable: 0.14,
      look: lower,
    });
    parts.push(...porch.parts);

    // --- the lights ----------------------------------------------------------
    //
    // Wide on the ground where the hall is and narrower above it, which is what
    // a hall and the chambers over it actually give you.
    //
    // Two bays on each floor, in the run the porch leaves clear, and lined up
    // one above the other — a hall range reads as one building because its
    // openings stack, not because the two storeys match in anything else.
    for (const at of [-2.6, -0.6]) {
      parts.push(
        ...onFace(
          mullioned(rng, { at, sill: GROUND_SILL, width: 1.35, height: 1.28, lights: 3, look: lower }),
          hallLow.wall.front,
        ),
      );
      parts.push(
        ...onFace(
          mullioned(rng, { at, sill: FIRST_SILL, width: 1.2, height: 0.95, lights: 2, look: upper }),
          proud(hallLow.wall.front, JETTY),
        ),
      );
    }

    // The wing's gable end, which is the face this house is looked at from.
    parts.push(
      ...onFace(
        mullioned(rng, { at: 0, sill: GROUND_SILL, width: 2.5, height: 1.3, lights: 4, look: lower }),
        wingLow.wall.front,
      ),
    );
    parts.push(
      ...onFace(
        mullioned(rng, { at: 0, sill: FIRST_SILL, width: 1.9, height: 0.98, lights: 3, look: upper }),
        proud(wingLow.wall.front, JETTY),
      ),
    );

    // The hall's own gable end. **One either side of the stack**, not one in the
    // middle of it — the breast is the width of a window and the window was
    // inside it. `at` runs along Z on this face and the stack sits on the
    // block's own centre line, so the pair straddle `at = 0`.
    for (const at of [-1.7, 1.7]) {
      for (const [sill, style] of [
        [GROUND_SILL, lower],
        [FIRST_SILL, upper],
      ] as const) {
        parts.push(
          ...onFace(
            mullioned(rng, { at, sill, width: 1.05, height: 1, lights: 2, look: style }),
            hallLow.wall.left,
          ),
        );
      }
    }

    // The back. `at` runs the other way on a wall facing −Z, so these are the
    // hall's own three bays reading west to east — the wing has the rest of the
    // back and puts its own windows on it.
    for (const at of [2.7, 0, -2.7]) {
      parts.push(
        ...onFace(
          mullioned(rng, { at, sill: GROUND_SILL, width: 1.2, height: 1.15, lights: 2, look: lower }),
          hallLow.wall.back,
        ),
      );
      parts.push(
        ...onFace(
          mullioned(rng, { at, sill: FIRST_SILL, width: 1.05, height: 0.92, lights: 2, look: upper }),
          hallHigh.wall.back,
        ),
      );
    }

    // The wing's back gable carries the other stack, so the same rule applies.
    for (const at of [-1.5, 1.5]) {
      parts.push(
        ...onFace(
          mullioned(rng, { at, sill: FIRST_SILL, width: 1, height: 0.92, lights: 2, look: upper }),
          wingHigh.wall.back,
        ),
      );
    }

    // --- the stacks ----------------------------------------------------------
    //
    // Two, because a manor has a hearth in the hall and another in the chamber
    // wing. Both stand clear of their roof's own oversail with a breast filling
    // the gap: a stack inside the oversail has the slope driven through it and
    // out the far side.
    const hallClear = hallHigh.roof.overGable + 0.1;
    parts.push(
      ...chimney(rng, {
        x: HALL_X - HALL_WIDTH / 2 - hallClear - 0.55,
        z: HALL_Z,
        foot: 0,
        top: hallHigh.crown + 1.4,
        girth: 1.1,
        breast: { span: hallClear + 0.35, top: EAVE, yaw: -Math.PI / 2 },
        look: lower,
      }),
    );

    const wingClear = wingHigh.roof.overGable + 0.1;
    parts.push(
      ...chimney(rng, {
        x: WING_X,
        z: -(WING_DEPTH / 2 + wingClear + 0.5),
        foot: 0,
        top: wingHigh.crown + 1.1,
        girth: 1,
        breast: { span: wingClear + 0.35, top: EAVE, yaw: Math.PI },
        look: lower,
      }),
    );

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);

    const mesh = finish(geometry, 'manor', 0);
    const at = facePoint(porch.wall.front, 0);
    const doorway: Doorway = { x: at.x, z: at.z, yaw: 0, width: DOOR_WIDTH, height: DOOR_HEIGHT };
    markDoorways(mesh, [doorway], scale);
    return mesh;
  },
};
