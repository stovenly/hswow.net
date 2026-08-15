import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import {
  block,
  buttress,
  facePoint,
  gableFace,
  lancet,
  look,
  louvre,
  markDoorways,
  onFace,
  pyramid,
  ridgeHeight,
  slab,
} from '../building';
import { shade } from '../palette';

/**
 * A parish church: a west tower, a nave, a lower chancel, and a south porch.
 *
 * Cellular, which is what a Romanesque parish church is — not one space but a
 * row of separate boxes that step *down* and *in* from the nave to the chancel,
 * with a tower at the other end standing well over both. That stepping is the
 * whole silhouette and the reason a church reads as a church from across a
 * valley: nothing else in a village is three heights at once.
 *
 * Everything is stone, the windows are narrow and round-headed because the wall
 * between them is what holds the roof up, and the buttresses are shallow
 * pilasters rather than the flying kind — this is a village, not a cathedral.
 *
 * **One design, not a family** — drawn rather than rolled. See `manor`.
 */

const NAVE_WIDTH = 10;
const NAVE_DEPTH = 6;
const NAVE_EAVE = 5;
const PITCH = 0.82;

const CHANCEL_WIDTH = 4.6;
const CHANCEL_DEPTH = 4.6;
/**
 * Raised a quarter metre. The chancel is the lowest thing on the building and
 * its side lights had nowhere to go: at 3.7 the arch over one finished exactly
 * on the roof's underside. It still steps well below the nave's five.
 */
const CHANCEL_EAVE = 3.95;

const TOWER_SIDE = 3.7;
const TOWER_HEIGHT = 10;

const PORCH_WIDTH = 2.4;
const PORCH_DEPTH = 1.8;

/** Laid out so the whole plan comes out centred on the origin, not on the nave. */
const NAVE_X = -(CHANCEL_WIDTH - TOWER_SIDE + 0.3) / 2;
const NAVE_Z = -(PORCH_DEPTH - 0.3) / 2;
const CHANCEL_X = NAVE_X + NAVE_WIDTH / 2 + CHANCEL_WIDTH / 2;
const TOWER_X = NAVE_X - NAVE_WIDTH / 2 - TOWER_SIDE / 2 + 0.3;
/** On the middle bay, so it takes out exactly one of the three south lights. */
const PORCH_X = NAVE_X;

/**
 * How tall a lancet may be on a wall of a given block.
 *
 * Two things `Block.head` does not know. It is measured at a lintel's depth, and
 * an arch ring stands half again as far out — where the roof's underside, being
 * a slope, is lower still. And a window wants a course of wall above it rather
 * than to finish on the ceiling. Both are taken off here, so every lancet on the
 * building is sized the same way instead of each carrying its own guess.
 */
function lancetHeight(head: number, sill: number, width: number, want: number): number {
  /** From the opening's head to the outside of its arch ring. */
  const ring = width / 2 + 0.25;
  return Math.min(want, head - 0.28 - sill - ring);
}

const DOOR_WIDTH = 1.25;
const DOOR_HEIGHT = 2.55;
const WEST_WIDTH = 1.12;
const WEST_HEIGHT = 2.3;

export const church: MeshBuilder = {
  name: 'church',
  category: 'structures',
  radius: 9.5,
  variants: 1,

  build({ scale = 1 } = {}) {
    const rng = createRng(8423);
    const parts: Part[] = [];

    const style = look(rng, 'stone', 'slate');

    // --- the nave and the chancel --------------------------------------------
    const nave = block(rng, {
      x: NAVE_X,
      z: NAVE_Z,
      width: NAVE_WIDTH,
      depth: NAVE_DEPTH,
      base: 0.38,
      eave: NAVE_EAVE,
      pitch: PITCH,
      overEave: 0.28,
      overGable: 0.18,
      look: style,
    });
    parts.push(...nave.parts);

    const chancel = block(rng, {
      x: CHANCEL_X,
      z: NAVE_Z,
      width: CHANCEL_WIDTH,
      depth: CHANCEL_DEPTH,
      base: 0.34,
      eave: CHANCEL_EAVE,
      pitch: PITCH,
      overEave: 0.24,
      overGable: 0.16,
      look: style,
    });
    parts.push(...chancel.parts);

    // --- the tower -----------------------------------------------------------
    //
    // Square, buttressed only at its western corners, and taller than everything
    // else put together.
    const tower = block(rng, {
      x: TOWER_X,
      z: NAVE_Z,
      width: TOWER_SIDE,
      depth: TOWER_SIDE,
      base: 0.44,
      eave: TOWER_HEIGHT,
      pitch: PITCH,
      roofless: true,
      look: style,
    });
    parts.push(...tower.parts);

    // A parapet under the cap, so the spire sits on a tower rather than growing
    // out of one.
    parts.push({
      geometry: slab(TOWER_SIDE + 0.26, 0.3, TOWER_SIDE + 0.26, TOWER_X, TOWER_HEIGHT + 0.15, NAVE_Z),
      color: style.stoneDark,
    });
    parts.push(
      ...pyramid(rng, {
        x: TOWER_X,
        z: NAVE_Z,
        side: TOWER_SIDE + 0.1,
        base: TOWER_HEIGHT + 0.3,
        height: 3.4,
        look: style,
      }),
    );

    // String courses dividing the stages. Without them a tower is a chimney.
    for (const at of [0.36, 0.64]) {
      parts.push({
        geometry: slab(TOWER_SIDE + 0.2, 0.16, TOWER_SIDE + 0.2, TOWER_X, TOWER_HEIGHT * at, NAVE_Z),
        color: style.stoneDark,
      });
    }

    // The belfry, high enough that the nave's ridge does not stand in front of
    // it — the nave crowns just over eight metres and these used to start below
    // that, so a third of the east louvre was behind a roof.
    for (const face of [tower.wall.front, tower.wall.back, tower.wall.left, tower.wall.right]) {
      parts.push(
        ...onFace(
          louvre(rng, { at: 0, sill: TOWER_HEIGHT - 1.75, width: 0.72, height: 1.3, look: style }),
          face,
        ),
      );
      // A single small light at the middle stage, which is all a ringing chamber
      // ever had. **Not on the east face**, which is the one the nave is built
      // against — a window there is a window inside another building.
      if (face === tower.wall.right) continue;
      parts.push(
        ...onFace(
          lancet(rng, { at: 0, sill: TOWER_HEIGHT * 0.44, width: 0.38, height: 0.85, look: style }),
          face,
        ),
      );
    }

    // Clasping buttresses on the west end, which is the corner that has no
    // building to lean against.
    for (const side of [-1, 1]) {
      parts.push(
        ...onFace(
          buttress(rng, { at: side * (TOWER_SIDE / 2 - 0.44), width: 0.82, out: 0.48, high: TOWER_HEIGHT * 0.56, look: style }),
          tower.wall.left,
        ),
      );
    }
    for (const face of [tower.wall.front, tower.wall.back]) {
      parts.push(
        ...onFace(
          buttress(rng, { at: -(TOWER_SIDE / 2 - 0.44), width: 0.82, out: 0.48, high: TOWER_HEIGHT * 0.56, look: style }),
          face,
        ),
      );
    }

    // --- the porch, and the two ways in --------------------------------------
    //
    // Neither doorway builds anything. The porch's arch and the west door's went
    // with the rest of the frames: a door builder puts the whole opening there.
    // Both are still recorded, so the west door is still a way in.
    const porch = block(rng, {
      x: PORCH_X,
      z: NAVE_Z + NAVE_DEPTH / 2 + PORCH_DEPTH / 2 - 0.3,
      width: PORCH_WIDTH,
      depth: PORCH_DEPTH,
      base: 0.3,
      eave: 2.7,
      pitch: PITCH + 0.12,
      ridge: 'z',
      overEave: 0.16,
      overGable: 0.14,
      look: style,
    });
    parts.push(...porch.parts);

    // --- the lights ----------------------------------------------------------
    //
    // Three a side on the nave, with a pilaster between each pair. The porch
    // stands under the middle bay on the south, so that one light is left out.
    const bays = [-3.4, 0, 3.4];
    for (const face of [nave.wall.front, nave.wall.back]) {
      for (const at of bays) {
        if (face === nave.wall.front && Math.abs(NAVE_X + at - PORCH_X) < PORCH_WIDTH / 2 + 0.7) continue;
        parts.push(
          ...onFace(
            lancet(rng, {
              at,
              sill: 2.1,
              width: 0.48,
              height: lancetHeight(nave.head, 2.1, 0.48, 1.5),
              look: style,
            }),
            face,
          ),
        );
      }
      // Clear of the porch, whose roof oversails to 1.36 either side of it.
      for (const at of [-4.8, -2.3, 2.3, 4.8]) {
        parts.push(
          ...onFace(
            buttress(rng, { at, width: 0.7, out: 0.36, high: NAVE_EAVE * 0.6, look: style }),
            face,
          ),
        );
      }
    }

    for (const face of [chancel.wall.front, chancel.wall.back]) {
      parts.push(
        // Clamped to the chancel's own head. The chancel is the lowest thing on
        // the building and its side lights were the first to come out through
        // the roof — the arch over a lancet is another quarter metre above the
        // opening, and it stands proud, so it ducks lower still.
        ...onFace(
          lancet(rng, {
            at: 0,
            sill: 1.6,
            width: 0.44,
            height: lancetHeight(chancel.head, 1.6, 0.44, 1.25),
            look: style,
          }),
          face,
        ),
      );
    }

    // The east window: three lights, which is the one place a village church
    // spent anything on glass. Kept under the chancel's own eave, which is well
    // below the nave's.
    //
    // **Spaced, not grouped.** They stood at 62 cm centres, and a lancet is
    // wider than that once its jambs and the ring of its arch are counted — the
    // outer two had the middle one's arch driven through their frames. A lancet
    // 40 cm wide measures 45 from its middle to the outside of its arch, so the
    // centres have to clear 90; these are on 105 and each one stands alone.
    const sill = 1.45;
    const middle = lancetHeight(chancel.head, sill, 0.4, 1.7);
    for (const [at, height] of [
      [-1.05, middle * 0.78],
      [0, middle],
      [1.05, middle * 0.78],
    ] as const) {
      parts.push(
        ...onFace(lancet(rng, { at, sill, width: 0.4, height, look: style }), chancel.wall.right),
      );
    }

    // A cross on the chancel gable, which is the only ornament on the building.
    const apex = CHANCEL_EAVE + ridgeHeight(CHANCEL_DEPTH, PITCH);
    parts.push(
      ...onFace(
        [
          { geometry: slab(0.13, 0.72, 0.13, 0, apex + 0.36, 0.07), color: shade(style.stone, 1.05) },
          { geometry: slab(0.46, 0.13, 0.13, 0, apex + 0.52, 0.07), color: shade(style.stone, 1.05) },
        ],
        gableFace(chancel.roof, 1),
      ),
    );

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);

    const mesh = finish(geometry, 'church', 0);
    const south = facePoint(porch.wall.front, 0);
    const west = facePoint(tower.wall.left, 0);
    markDoorways(
      mesh,
      [
        { x: south.x, z: south.z, yaw: porch.wall.front.yaw, width: DOOR_WIDTH, height: DOOR_HEIGHT },
        { x: west.x, z: west.z, yaw: tower.wall.left.yaw, width: WEST_WIDTH, height: WEST_HEIGHT },
      ],
      scale,
    );
    return mesh;
  },
};
